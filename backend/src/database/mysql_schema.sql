-- ============================================
-- WASCO PRIMARY DATABASE (MySQL)
-- Water Bill Management System
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS wasco_primary
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE wasco_primary;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'administrator', 'branch_manager') NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- ============================================
-- 2. DISTRICTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS districts (
    district_id INT PRIMARY KEY AUTO_INCREMENT,
    district_name VARCHAR(100) NOT NULL,
    district_code VARCHAR(10) UNIQUE NOT NULL,
    region VARCHAR(50),
    population INT,
    area_km2 DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_district_code (district_code),
    INDEX idx_district_name (district_name)
) ENGINE=InnoDB;

-- ============================================
-- 3. CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    user_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    id_number VARCHAR(20) UNIQUE,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    physical_address TEXT,
    district_id INT NOT NULL,
    meter_number VARCHAR(20) UNIQUE NOT NULL,
    connection_type ENUM('residential', 'commercial', 'industrial') DEFAULT 'residential',
    connection_date DATE,
    property_type VARCHAR(50),
    number_of_occupants INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (district_id) REFERENCES districts(district_id) ON DELETE RESTRICT,
    
    INDEX idx_account_number (account_number),
    INDEX idx_district (district_id),
    INDEX idx_meter (meter_number),
    INDEX idx_connection_type (connection_type),
    INDEX idx_active (is_active),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- 4. BILLING RATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS billing_rates (
    rate_id INT PRIMARY KEY AUTO_INCREMENT,
    rate_tier VARCHAR(50) NOT NULL,
    connection_type ENUM('residential', 'commercial', 'industrial') NOT NULL,
    usage_range_min DECIMAL(10,2) NOT NULL,
    usage_range_max DECIMAL(10,2),
    cost_per_unit DECIMAL(10,2) NOT NULL,
    fixed_charge DECIMAL(10,2) DEFAULT 0.00,
    sewerage_charge_percentage DECIMAL(5,2) DEFAULT 0.00,
    vat_percentage DECIMAL(5,2) DEFAULT 15.00,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_connection_type (connection_type),
    INDEX idx_effective_dates (effective_from, effective_to),
    INDEX idx_active (is_active),
    INDEX idx_tier (rate_tier)
) ENGINE=InnoDB;

-- ============================================
-- 5. WATER USAGE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS water_usage (
    usage_id INT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(20) NOT NULL,
    reading_date DATE NOT NULL,
    meter_reading DECIMAL(10,2) NOT NULL,
    previous_reading DECIMAL(10,2) DEFAULT 0.00,
    consumption DECIMAL(10,2) GENERATED ALWAYS AS (meter_reading - previous_reading) STORED,
    reading_month INT NOT NULL,
    reading_year INT NOT NULL,
    meter_reader_id INT,
    reading_status ENUM('pending', 'verified', 'estimated', 'disputed') DEFAULT 'pending',
    is_estimated BOOLEAN DEFAULT FALSE,
    estimation_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (account_number) REFERENCES customers(account_number) ON DELETE CASCADE,
    FOREIGN KEY (meter_reader_id) REFERENCES users(user_id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_reading (account_number, reading_month, reading_year),
    INDEX idx_reading_date (reading_date),
    INDEX idx_account_month (account_number, reading_month, reading_year),
    INDEX idx_status (reading_status),
    INDEX idx_period (reading_year, reading_month)
) ENGINE=InnoDB;

-- ============================================
-- 6. BILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bills (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(20) NOT NULL,
    bill_number VARCHAR(30) UNIQUE NOT NULL,
    billing_month INT NOT NULL,
    billing_year INT NOT NULL,
    usage_id INT,
    consumption DECIMAL(10,2) NOT NULL,
    water_charge DECIMAL(10,2) NOT NULL,
    sewerage_charge DECIMAL(10,2) DEFAULT 0.00,
    fixed_charge DECIMAL(10,2) DEFAULT 0.00,
    vat_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    previous_balance DECIMAL(10,2) DEFAULT 0.00,
    total_due DECIMAL(10,2) GENERATED ALWAYS AS (total_amount + previous_balance) STORED,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    balance DECIMAL(10,2) GENERATED ALWAYS AS (total_amount + previous_balance - amount_paid) STORED,
    due_date DATE NOT NULL,
    payment_status ENUM('unpaid', 'partial', 'paid', 'overdue', 'cancelled') DEFAULT 'unpaid',
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (account_number) REFERENCES customers(account_number) ON DELETE CASCADE,
    FOREIGN KEY (usage_id) REFERENCES water_usage(usage_id) ON DELETE SET NULL,
    FOREIGN KEY (generated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_bill (account_number, billing_month, billing_year),
    INDEX idx_payment_status (payment_status),
    INDEX idx_due_date (due_date),
    INDEX idx_billing_period (billing_month, billing_year),
    INDEX idx_account (account_number),
    INDEX idx_bill_number (bill_number)
) ENGINE=InnoDB;

-- ============================================
-- 7. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    payment_reference VARCHAR(50) UNIQUE NOT NULL,
    payment_method ENUM('cash', 'card', 'mobile_money', 'bank_transfer', 'online') NOT NULL,
    payment_amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100),
    stripe_payment_intent_id VARCHAR(100),
    stripe_charge_id VARCHAR(100),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
    processed_by INT,
    receipt_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (account_number) REFERENCES customers(account_number) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_status (payment_status),
    INDEX idx_account (account_number),
    INDEX idx_bill (bill_id),
    INDEX idx_reference (payment_reference),
    INDEX idx_method (payment_method)
) ENGINE=InnoDB;

-- ============================================
-- 8. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(20) NOT NULL,
    user_id INT,
    notification_type ENUM('bill_generated', 'payment_received', 'payment_overdue', 'leakage_alert', 'system_announcement') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    sent_via ENUM('email', 'sms', 'push', 'in_app') NOT NULL,
    sent_at TIMESTAMP NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (account_number) REFERENCES customers(account_number) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    INDEX idx_account_type (account_number, notification_type),
    INDEX idx_sent_at (sent_at),
    INDEX idx_is_read (is_read),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ============================================
-- 9. LEAKAGE REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leakage_reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(20),
    reporter_name VARCHAR(100) NOT NULL,
    reporter_phone VARCHAR(20),
    reporter_email VARCHAR(100),
    location_description TEXT NOT NULL,
    district_id INT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    severity ENUM('minor', 'moderate', 'severe', 'critical') DEFAULT 'moderate',
    status ENUM('reported', 'investigating', 'in_progress', 'resolved', 'closed', 'cancelled') DEFAULT 'reported',
    reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP NULL,
    assigned_to INT,
    estimated_water_loss DECIMAL(10,2),
    repair_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (account_number) REFERENCES customers(account_number) ON DELETE SET NULL,
    FOREIGN KEY (district_id) REFERENCES districts(district_id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_status (status),
    INDEX idx_district (district_id),
    INDEX idx_severity (severity),
    INDEX idx_reported_date (reported_date),
    INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB;

-- ============================================
-- 10. AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- SQL VIEWS
-- ============================================

-- View: Customer Billing Summary
CREATE OR REPLACE VIEW customer_billing_summary AS
SELECT 
    c.account_number,
    c.first_name,
    c.last_name,
    c.phone_number,
    c.email,
    d.district_name,
    c.connection_type,
    COUNT(DISTINCT b.bill_id) AS total_bills,
    COALESCE(SUM(b.total_amount), 0) AS total_billed,
    COALESCE(SUM(b.amount_paid), 0) AS total_paid,
    COALESCE(SUM(b.balance), 0) AS outstanding_balance,
    MAX(b.due_date) AS latest_due_date,
    COUNT(CASE WHEN b.payment_status = 'overdue' THEN 1 END) AS overdue_count
FROM customers c
LEFT JOIN bills b ON c.account_number = b.account_number
LEFT JOIN districts d ON c.district_id = d.district_id
WHERE c.is_active = TRUE
GROUP BY c.account_number, c.first_name, c.last_name, c.phone_number, 
         c.email, d.district_name, c.connection_type;

-- View: Outstanding Balances
CREATE OR REPLACE VIEW outstanding_balances AS
SELECT 
    c.account_number,
    c.first_name,
    c.last_name,
    c.phone_number,
    c.email,
    d.district_name,
    SUM(b.balance) AS outstanding_balance,
    COUNT(CASE WHEN b.payment_status = 'overdue' THEN 1 END) AS overdue_bills,
    MIN(b.due_date) AS oldest_due_date,
    MAX(b.due_date) AS latest_due_date,
    DATEDIFF(CURDATE(), MIN(b.due_date)) AS days_overdue
FROM customers c
INNER JOIN bills b ON c.account_number = b.account_number
LEFT JOIN districts d ON c.district_id = d.district_id
WHERE b.payment_status IN ('unpaid', 'partial', 'overdue')
GROUP BY c.account_number, c.first_name, c.last_name, c.phone_number, 
         c.email, d.district_name
HAVING outstanding_balance > 0
ORDER BY outstanding_balance DESC;

-- View: Monthly Usage Patterns
CREATE OR REPLACE VIEW monthly_usage_patterns AS
SELECT 
    c.account_number,
    c.connection_type,
    d.district_name,
    wu.reading_year,
    wu.reading_month,
    wu.consumption,
    b.total_amount,
    CASE 
        WHEN wu.consumption < 10 THEN 'Low'
        WHEN wu.consumption BETWEEN 10 AND 30 THEN 'Medium'
        WHEN wu.consumption BETWEEN 31 AND 50 THEN 'High'
        ELSE 'Very High'
    END AS consumption_category
FROM water_usage wu
INNER JOIN customers c ON wu.account_number = c.account_number
LEFT JOIN districts d ON c.district_id = d.district_id
LEFT JOIN bills b ON wu.usage_id = b.usage_id
WHERE wu.reading_status = 'verified'
ORDER BY wu.reading_year DESC, wu.reading_month DESC;

-- View: Payment History Summary
CREATE OR REPLACE VIEW payment_history_summary AS
SELECT 
    c.account_number,
    c.first_name,
    c.last_name,
    p.payment_id,
    p.payment_reference,
    p.payment_method,
    p.payment_amount,
    p.payment_date,
    p.payment_status,
    b.bill_number,
    b.billing_month,
    b.billing_year
FROM payments p
INNER JOIN bills b ON p.bill_id = b.bill_id
INNER JOIN customers c ON p.account_number = c.account_number
WHERE p.payment_status = 'completed'
ORDER BY p.payment_date DESC;

-- ============================================
-- STORED PROCEDURES
-- ============================================

DELIMITER //

-- Procedure: Calculate Bill Amount
CREATE PROCEDURE IF NOT EXISTS calculate_bill_amount(
    IN p_usage_id INT,
    OUT p_water_charge DECIMAL(10,2),
    OUT p_sewerage_charge DECIMAL(10,2),
    OUT p_fixed_charge DECIMAL(10,2),
    OUT p_vat_amount DECIMAL(10,2),
    OUT p_total_amount DECIMAL(10,2)
)
BEGIN
    DECLARE v_consumption DECIMAL(10,2);
    DECLARE v_connection_type VARCHAR(20);
    DECLARE v_cost_per_unit DECIMAL(10,2);
    DECLARE v_fixed DECIMAL(10,2);
    DECLARE v_sewerage_pct DECIMAL(5,2);
    DECLARE v_vat_pct DECIMAL(5,2);
    
    -- Get usage details
    SELECT wu.consumption, c.connection_type
    INTO v_consumption, v_connection_type
    FROM water_usage wu
    INNER JOIN customers c ON wu.account_number = c.account_number
    WHERE wu.usage_id = p_usage_id;
    
    -- Get applicable rate
    SELECT cost_per_unit, fixed_charge, sewerage_charge_percentage, vat_percentage
    INTO v_cost_per_unit, v_fixed, v_sewerage_pct, v_vat_pct
    FROM billing_rates
    WHERE connection_type = v_connection_type
        AND v_consumption BETWEEN usage_range_min AND COALESCE(usage_range_max, 999999)
        AND is_active = TRUE
        AND CURDATE() BETWEEN effective_from AND COALESCE(effective_to, '9999-12-31')
    LIMIT 1;
    
    -- Calculate charges
    SET p_water_charge = v_consumption * v_cost_per_unit;
    SET p_sewerage_charge = p_water_charge * (v_sewerage_pct / 100);
    SET p_fixed_charge = v_fixed;
    SET p_vat_amount = (p_water_charge + p_sewerage_charge + p_fixed_charge) * (v_vat_pct / 100);
    SET p_total_amount = p_water_charge + p_sewerage_charge + p_fixed_charge + p_vat_amount;
END //

DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER //

-- Trigger: Update bill payment status after payment
CREATE TRIGGER IF NOT EXISTS after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    DECLARE v_total_paid DECIMAL(10,2);
    DECLARE v_total_due DECIMAL(10,2);
    
    IF NEW.payment_status = 'completed' THEN
        -- Calculate total paid for this bill
        SELECT COALESCE(SUM(payment_amount), 0) INTO v_total_paid
        FROM payments
        WHERE bill_id = NEW.bill_id AND payment_status = 'completed';
        
        -- Get total due
        SELECT total_due INTO v_total_due
        FROM bills
        WHERE bill_id = NEW.bill_id;
        
        -- Update bill status and amount paid
        UPDATE bills
        SET amount_paid = v_total_paid,
            payment_status = CASE
                WHEN v_total_paid >= v_total_due THEN 'paid'
                WHEN v_total_paid > 0 THEN 'partial'
                ELSE payment_status
            END
        WHERE bill_id = NEW.bill_id;
    END IF;
END //

DELIMITER ;

-- ============================================
-- EVENTS
-- ============================================

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Event: Update overdue bills daily
DELIMITER $$
CREATE EVENT IF NOT EXISTS update_overdue_bills
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    UPDATE bills
    SET payment_status = 'overdue'
    WHERE due_date < CURDATE()
        AND payment_status IN ('unpaid', 'partial');
END$$
DELIMITER ;

-- ============================================
-- INITIAL DATA - Lesotho Districts
-- ============================================

INSERT INTO districts (district_name, district_code, region, population, area_km2) VALUES
('Maseru', 'MAS', 'Lowlands', 431998, 4279),
('Berea', 'BER', 'Lowlands', 250006, 2222),
('Leribe', 'LER', 'Lowlands', 298352, 2828),
('Mafeteng', 'MAF', 'Lowlands', 193682, 2119),
('Mohale''s Hoek', 'MOH', 'Lowlands', 176928, 3530),
('Quthing', 'QUT', 'Lowlands', 124048, 2916),
('Qacha''s Nek', 'QAC', 'Mountains', 69749, 2349),
('Mokhotlong', 'MOK', 'Mountains', 97713, 4075),
('Thaba-Tseka', 'THA', 'Mountains', 129881, 4270),
('Butha-Buthe', 'BUT', 'Lowlands', 110320, 1767)
ON DUPLICATE KEY UPDATE district_name=district_name;

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================

-- Made with Bob
