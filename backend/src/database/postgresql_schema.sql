-- ============================================
-- WASCO ANALYTICS DATABASE (PostgreSQL)
-- Water Bill Management System - Analytics
-- ============================================

-- Create database
CREATE DATABASE wasco_analytics
WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8';

\c wasco_analytics;

-- ============================================
-- 1. CUSTOMER ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_analytics (
    analytics_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    customer_name VARCHAR(150),
    district_id INT,
    district_name VARCHAR(100),
    connection_type VARCHAR(20),
    total_consumption NUMERIC(12,2) DEFAULT 0,
    total_bills NUMERIC(12,2) DEFAULT 0,
    total_payments NUMERIC(12,2) DEFAULT 0,
    outstanding_balance NUMERIC(12,2) DEFAULT 0,
    average_monthly_consumption NUMERIC(10,2) DEFAULT 0,
    payment_behavior VARCHAR(20),
    last_payment_date TIMESTAMP,
    customer_since DATE,
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_customer_analytics UNIQUE (account_number)
);

CREATE INDEX idx_ca_account ON customer_analytics(account_number);
CREATE INDEX idx_ca_district ON customer_analytics(district_id);
CREATE INDEX idx_ca_connection_type ON customer_analytics(connection_type);
CREATE INDEX idx_ca_sync ON customer_analytics(sync_timestamp);

-- ============================================
-- 2. USAGE ANALYTICS TABLE (Time-Series)
-- ============================================
CREATE TABLE IF NOT EXISTS usage_analytics (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    district_id INT,
    district_name VARCHAR(100),
    connection_type VARCHAR(20),
    year INT NOT NULL,
    quarter INT,
    month INT NOT NULL,
    week INT,
    consumption NUMERIC(10,2),
    bill_amount NUMERIC(10,2),
    payment_amount NUMERIC(10,2),
    payment_status VARCHAR(20),
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_usage_analytics UNIQUE (account_number, year, month)
);

CREATE INDEX idx_ua_period ON usage_analytics(year, month);
CREATE INDEX idx_ua_account_period ON usage_analytics(account_number, year, month);
CREATE INDEX idx_ua_district ON usage_analytics(district_id);
CREATE INDEX idx_ua_quarter ON usage_analytics(year, quarter);

-- ============================================
-- 3. DISTRICT ANALYTICS TABLE (Aggregated)
-- ============================================
CREATE TABLE IF NOT EXISTS district_analytics (
    id SERIAL PRIMARY KEY,
    district_id INT NOT NULL,
    district_name VARCHAR(100),
    year INT NOT NULL,
    quarter INT,
    month INT NOT NULL,
    total_customers INT DEFAULT 0,
    active_customers INT DEFAULT 0,
    total_consumption NUMERIC(12,2) DEFAULT 0,
    total_revenue NUMERIC(12,2) DEFAULT 0,
    total_collections NUMERIC(12,2) DEFAULT 0,
    collection_rate NUMERIC(5,2) DEFAULT 0,
    average_consumption NUMERIC(10,2) DEFAULT 0,
    average_bill NUMERIC(10,2) DEFAULT 0,
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_district_analytics UNIQUE (district_id, year, month)
);

CREATE INDEX idx_da_district_period ON district_analytics(district_id, year, month);
CREATE INDEX idx_da_period ON district_analytics(year, month);

-- ============================================
-- 4. REVENUE ANALYTICS TABLE (OLAP Cube)
-- ============================================
CREATE TABLE IF NOT EXISTS revenue_analytics (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    quarter INT,
    month INT,
    week INT,
    day DATE,
    district_id INT,
    district_name VARCHAR(100),
    connection_type VARCHAR(20),
    total_bills NUMERIC(12,2) DEFAULT 0,
    total_collections NUMERIC(12,2) DEFAULT 0,
    outstanding_amount NUMERIC(12,2) DEFAULT 0,
    number_of_transactions INT DEFAULT 0,
    number_of_customers INT DEFAULT 0,
    average_bill_amount NUMERIC(10,2) DEFAULT 0,
    collection_efficiency NUMERIC(5,2) DEFAULT 0,
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ra_time_hierarchy ON revenue_analytics(year, quarter, month, week);
CREATE INDEX idx_ra_district ON revenue_analytics(district_id);
CREATE INDEX idx_ra_connection_type ON revenue_analytics(connection_type);
CREATE INDEX idx_ra_day ON revenue_analytics(day);

-- ============================================
-- 5. PAYMENT TRENDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_trends (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL,
    payment_method VARCHAR(20),
    district_id INT,
    total_transactions INT DEFAULT 0,
    total_amount NUMERIC(12,2) DEFAULT 0,
    average_transaction NUMERIC(10,2) DEFAULT 0,
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_payment_trends UNIQUE (year, month, payment_method, district_id)
);

CREATE INDEX idx_pt_period ON payment_trends(year, month);
CREATE INDEX idx_pt_method ON payment_trends(payment_method);

-- ============================================
-- 6. CONSUMPTION PATTERNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS consumption_patterns (
    id SERIAL PRIMARY KEY,
    connection_type VARCHAR(20),
    district_id INT,
    year INT NOT NULL,
    month INT NOT NULL,
    consumption_category VARCHAR(20),
    customer_count INT DEFAULT 0,
    total_consumption NUMERIC(12,2) DEFAULT 0,
    average_consumption NUMERIC(10,2) DEFAULT 0,
    sync_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cp_type_period ON consumption_patterns(connection_type, year, month);
CREATE INDEX idx_cp_district ON consumption_patterns(district_id);

-- ============================================
-- MATERIALIZED VIEWS FOR FAST QUERIES
-- ============================================

-- Materialized View: Monthly Summary
CREATE MATERIALIZED VIEW monthly_summary AS
SELECT 
    year,
    month,
    COUNT(DISTINCT account_number) AS total_customers,
    SUM(consumption) AS total_consumption,
    SUM(bill_amount) AS total_revenue,
    SUM(payment_amount) AS total_collections,
    AVG(consumption) AS avg_consumption,
    AVG(bill_amount) AS avg_bill
FROM usage_analytics
GROUP BY year, month
ORDER BY year DESC, month DESC;

CREATE INDEX idx_ms_period ON monthly_summary(year, month);

-- Materialized View: District Performance
CREATE MATERIALIZED VIEW district_performance AS
SELECT 
    d.district_id,
    d.district_name,
    d.year,
    d.month,
    d.total_customers,
    d.total_consumption,
    d.total_revenue,
    d.collection_rate,
    RANK() OVER (PARTITION BY d.year, d.month ORDER BY d.total_revenue DESC) AS revenue_rank,
    RANK() OVER (PARTITION BY d.year, d.month ORDER BY d.collection_rate DESC) AS collection_rank
FROM district_analytics d
ORDER BY d.year DESC, d.month DESC, revenue_rank;

-- ============================================
-- FUNCTIONS FOR ANALYTICS
-- ============================================

-- Function: Calculate Collection Rate
CREATE OR REPLACE FUNCTION calculate_collection_rate(
    p_year INT,
    p_month INT,
    p_district_id INT DEFAULT NULL
)
RETURNS NUMERIC(5,2) AS $$
DECLARE
    v_total_billed NUMERIC(12,2);
    v_total_collected NUMERIC(12,2);
    v_rate NUMERIC(5,2);
BEGIN
    IF p_district_id IS NULL THEN
        SELECT 
            SUM(bill_amount),
            SUM(payment_amount)
        INTO v_total_billed, v_total_collected
        FROM usage_analytics
        WHERE year = p_year AND month = p_month;
    ELSE
        SELECT 
            SUM(bill_amount),
            SUM(payment_amount)
        INTO v_total_billed, v_total_collected
        FROM usage_analytics
        WHERE year = p_year 
            AND month = p_month 
            AND district_id = p_district_id;
    END IF;
    
    IF v_total_billed > 0 THEN
        v_rate := (v_total_collected / v_total_billed) * 100;
    ELSE
        v_rate := 0;
    END IF;
    
    RETURN ROUND(v_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- Function: Get Top Consumers
CREATE OR REPLACE FUNCTION get_top_consumers(
    p_year INT,
    p_month INT,
    p_limit INT DEFAULT 10
)
RETURNS TABLE (
    account_number VARCHAR(20),
    customer_name VARCHAR(150),
    district_name VARCHAR(100),
    consumption NUMERIC(10,2),
    bill_amount NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ua.account_number,
        ca.customer_name,
        ua.district_name,
        ua.consumption,
        ua.bill_amount
    FROM usage_analytics ua
    LEFT JOIN customer_analytics ca ON ua.account_number = ca.account_number
    WHERE ua.year = p_year AND ua.month = p_month
    ORDER BY ua.consumption DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Get District Summary
CREATE OR REPLACE FUNCTION get_district_summary(
    p_district_id INT,
    p_year INT,
    p_month INT
)
RETURNS TABLE (
    district_name VARCHAR(100),
    total_customers INT,
    total_consumption NUMERIC(12,2),
    total_revenue NUMERIC(12,2),
    collection_rate NUMERIC(5,2),
    average_consumption NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.district_name,
        d.total_customers,
        d.total_consumption,
        d.total_revenue,
        d.collection_rate,
        d.average_consumption
    FROM district_analytics d
    WHERE d.district_id = p_district_id
        AND d.year = p_year
        AND d.month = p_month;
END;
$$ LANGUAGE plpgsql;

-- Function: Get Usage Trend
CREATE OR REPLACE FUNCTION get_usage_trend(
    p_account_number VARCHAR(20),
    p_months INT DEFAULT 12
)
RETURNS TABLE (
    year INT,
    month INT,
    consumption NUMERIC(10,2),
    bill_amount NUMERIC(10,2),
    payment_status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ua.year,
        ua.month,
        ua.consumption,
        ua.bill_amount,
        ua.payment_status
    FROM usage_analytics ua
    WHERE ua.account_number = p_account_number
    ORDER BY ua.year DESC, ua.month DESC
    LIMIT p_months;
END;
$$ LANGUAGE plpgsql;

-- Function: Get Payment Method Distribution
CREATE OR REPLACE FUNCTION get_payment_method_distribution(
    p_year INT,
    p_month INT
)
RETURNS TABLE (
    payment_method VARCHAR(20),
    total_transactions INT,
    total_amount NUMERIC(12,2),
    percentage NUMERIC(5,2)
) AS $$
DECLARE
    v_total_amount NUMERIC(12,2);
BEGIN
    -- Get total amount for percentage calculation
    SELECT SUM(pt.total_amount) INTO v_total_amount
    FROM payment_trends pt
    WHERE pt.year = p_year AND pt.month = p_month;
    
    RETURN QUERY
    SELECT 
        pt.payment_method,
        pt.total_transactions,
        pt.total_amount,
        CASE 
            WHEN v_total_amount > 0 THEN ROUND((pt.total_amount / v_total_amount) * 100, 2)
            ELSE 0
        END AS percentage
    FROM payment_trends pt
    WHERE pt.year = p_year AND pt.month = p_month
    ORDER BY pt.total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Function: Get Consumption Category Distribution
CREATE OR REPLACE FUNCTION get_consumption_category_distribution(
    p_year INT,
    p_month INT,
    p_connection_type VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
    consumption_category VARCHAR(20),
    customer_count INT,
    total_consumption NUMERIC(12,2),
    percentage NUMERIC(5,2)
) AS $$
DECLARE
    v_total_customers INT;
BEGIN
    -- Get total customers for percentage calculation
    IF p_connection_type IS NULL THEN
        SELECT SUM(cp.customer_count) INTO v_total_customers
        FROM consumption_patterns cp
        WHERE cp.year = p_year AND cp.month = p_month;
    ELSE
        SELECT SUM(cp.customer_count) INTO v_total_customers
        FROM consumption_patterns cp
        WHERE cp.year = p_year 
            AND cp.month = p_month 
            AND cp.connection_type = p_connection_type;
    END IF;
    
    RETURN QUERY
    SELECT 
        cp.consumption_category,
        cp.customer_count,
        cp.total_consumption,
        CASE 
            WHEN v_total_customers > 0 THEN ROUND((cp.customer_count::NUMERIC / v_total_customers) * 100, 2)
            ELSE 0
        END AS percentage
    FROM consumption_patterns cp
    WHERE cp.year = p_year 
        AND cp.month = p_month
        AND (p_connection_type IS NULL OR cp.connection_type = p_connection_type)
    ORDER BY cp.customer_count DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- REFRESH MATERIALIZED VIEWS FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY district_performance;
    RAISE NOTICE 'All materialized views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SCHEDULED JOBS (Using pg_cron extension)
-- ============================================

-- Note: Requires pg_cron extension
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule materialized view refresh (daily at 2 AM)
-- SELECT cron.schedule('refresh-materialized-views', '0 2 * * *', 'SELECT refresh_all_materialized_views()');

-- ============================================
-- SAMPLE ANALYTICS DATA
-- ============================================

-- This will be populated by the sync service from MySQL
-- Sample insert for demonstration:

COMMENT ON TABLE customer_analytics IS 'Aggregated customer-level analytics data synced from MySQL';
COMMENT ON TABLE usage_analytics IS 'Time-series water usage data for trend analysis';
COMMENT ON TABLE district_analytics IS 'District-level performance metrics';
COMMENT ON TABLE revenue_analytics IS 'OLAP cube for multi-dimensional revenue analysis';
COMMENT ON TABLE payment_trends IS 'Payment method usage trends over time';
COMMENT ON TABLE consumption_patterns IS 'Water consumption pattern categorization';

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================

-- Made with Bob
