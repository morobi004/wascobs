-- ============================================
-- WASCO Water Bill Management System
-- MySQL Database Schema (Simplified Version)
-- ============================================

-- Drop existing database and recreate
DROP DATABASE IF EXISTS wasco_db;
CREATE DATABASE wasco_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wasco_db;

-- ============================================
-- TABLE: districts
-- ============================================
CREATE TABLE districts (
    district_id INT AUTO_INCREMENT PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE,
    district_code VARCHAR(10) NOT NULL UNIQUE,
    region VARCHAR(50) NOT NULL,
    population INT,
    area_km2 DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_district_code (district_code),
    INDEX idx_region (region)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'administrator', 'branch_manager') NOT NULL DEFAULT 'customer',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_username (username)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: customers
-- ============================================
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    meter_number VARCHAR(20) NOT NULL UNIQUE,
    customer_type ENUM('residential', 'commercial', 'industrial', 'government') NOT NULL DEFAULT 'residential',
    address TEXT NOT NULL,
    district_id INT NOT NULL,
    connection_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (district_id) REFERENCES districts(district_id) ON DELETE RESTRICT,
    INDEX idx_account_number (account_number),
    INDEX idx_meter_number (meter_number),
    INDEX idx_district (district_id),
    INDEX idx_customer_type (customer_type),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: billing_rates
-- ============================================
CREATE TABLE billing_rates (
    rate_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_type ENUM('residential', 'commercial', 'industrial', 'government') NOT NULL,
    tier_name VARCHAR(50) NOT NULL,
    min_usage DECIMAL(10,2) NOT NULL,
    max_usage DECIMAL(10,2),
    rate_per_unit DECIMAL(10,2) NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_type (customer_type),
    INDEX idx_effective_date (effective_date),
    INDEX idx_active (is_active)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: water_usage
-- ============================================
CREATE TABLE water_usage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    reading_date DATE NOT NULL,
    meter_reading DECIMAL(10,2) NOT NULL,
    previous_reading DECIMAL(10,2) NOT NULL DEFAULT 0,
    consumption DECIMAL(10,2) GENERATED ALWAYS AS (meter_reading - previous_reading) STORED,
    reading_type ENUM('actual', 'estimated') DEFAULT 'actual',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_reading_date (reading_date),
    INDEX idx_reading_type (reading_type),
    UNIQUE KEY unique_customer_reading (customer_id, reading_date)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: bills
-- ============================================
CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    usage_id INT,
    bill_number VARCHAR(20) NOT NULL UNIQUE,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    consumption DECIMAL(10,2) NOT NULL,
    base_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_status ENUM('unpaid', 'partial', 'paid', 'overdue') DEFAULT 'unpaid',
    amount_paid DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (usage_id) REFERENCES water_usage(usage_id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_bill_number (bill_number),
    INDEX idx_payment_status (payment_status),
    INDEX idx_due_date (due_date),
    INDEX idx_billing_period (billing_period_start, billing_period_end)
) ENGINE=InnoDB;

-- ============================================
-- TABLE: payments
-- ============================================
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    customer_id INT NOT NULL,
    payment_reference VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'mobile_money', 'bank_transfer', 'online') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(100),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_bill (bill_id),
    INDEX idx_customer (customer_id),
    INDEX idx_payment_reference (payment_reference),
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;

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
('Butha-Buthe', 'BUT', 'Lowlands', 110320, 1767);

-- ============================================
-- INITIAL DATA - Billing Rates
-- ============================================
INSERT INTO billing_rates (customer_type, tier_name, min_usage, max_usage, rate_per_unit, effective_date) VALUES
-- Residential rates
('residential', 'Tier 1 (0-10 m³)', 0, 10, 5.50, '2024-01-01'),
('residential', 'Tier 2 (11-30 m³)', 10.01, 30, 8.00, '2024-01-01'),
('residential', 'Tier 3 (31-50 m³)', 30.01, 50, 12.00, '2024-01-01'),
('residential', 'Tier 4 (50+ m³)', 50.01, NULL, 15.00, '2024-01-01'),
-- Commercial rates
('commercial', 'Tier 1 (0-50 m³)', 0, 50, 12.00, '2024-01-01'),
('commercial', 'Tier 2 (51-100 m³)', 50.01, 100, 15.00, '2024-01-01'),
('commercial', 'Tier 3 (100+ m³)', 100.01, NULL, 18.00, '2024-01-01'),
-- Industrial rates
('industrial', 'Tier 1 (0-100 m³)', 0, 100, 10.00, '2024-01-01'),
('industrial', 'Tier 2 (101-500 m³)', 100.01, 500, 13.00, '2024-01-01'),
('industrial', 'Tier 3 (500+ m³)', 500.01, NULL, 16.00, '2024-01-01'),
-- Government rates
('government', 'Standard Rate', 0, NULL, 9.00, '2024-01-01');

-- ============================================
-- DATABASE SETUP COMPLETE
-- ============================================

-- Made with Bob
