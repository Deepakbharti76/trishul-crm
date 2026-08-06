-- =============================================================
--  Trishul CRM - Smart Business Management
--  Complete MySQL Schema + Sample Data
--  MySQL 8.0+
-- =============================================================

DROP DATABASE IF EXISTS trishul_crm;
CREATE DATABASE trishul_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE trishul_crm;

-- -------------------------------------------------------------
-- Table: roles
-- -------------------------------------------------------------
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO roles (name) VALUES
('ROLE_ADMIN'),
('ROLE_SUPERVISOR'),
('ROLE_USER');

-- -------------------------------------------------------------
-- Table: users
-- Passwords are BCrypt hashes.
-- admin    / Admin@123
-- supervisor / Super@123
-- user     / User@123
-- -------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    role_id BIGINT NOT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

INSERT INTO users (username, password, email, full_name, enabled, role_id) VALUES
('admin', '$2a$10$DowJonEwYqk2f5.4X7oJTOZfWNfWZ8lYVjqzZzqz1KpG8s7g0m2Nu', 'admin@trishulcrm.com', 'Deepak Kushwaha', TRUE, 1),
('supervisor', '$2a$10$DowJonEwYqk2f5.4X7oJTOZfWNfWZ8lYVjqzZzqz1KpG8s7g0m2Nu', 'supervisor@trishulcrm.com', 'Guddu', TRUE, 2),
('user', '$2a$10$DowJonEwYqk2f5.4X7oJTOZfWNfWZ8lYVjqzZzqz1KpG8s7g0m2Nu', 'user@trishulcrm.com', 'Bablu', TRUE, 3);

-- NOTE: The application's DataSeeder.java generates fresh, correctly matched
-- BCrypt hashes for these three accounts automatically on first boot, so the
-- placeholder hashes above are for schema reference only. If you import this
-- file directly and skip the Java seeder, re-hash the passwords with BCrypt
-- (strength 10) before using them to log in.

-- -------------------------------------------------------------
-- Table: customers
-- -------------------------------------------------------------
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(100),
    address VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB;

INSERT INTO customers (name, email, phone, company, address, status, created_at, updated_at) VALUES
('Vikram Industries', 'contact@vikramind.com', '9876500001', 'Vikram Industries Pvt Ltd', 'Jaipur, Rajasthan', 'ACTIVE', NOW(), NOW()),
('Meera Textiles', 'info@meeratextiles.com', '9876500002', 'Meera Textiles', 'Surat, Gujarat', 'ACTIVE', NOW(), NOW()),
('Kiran Foods', 'hello@kiranfoods.com', '9876500003', 'Kiran Foods Ltd', 'Delhi, NCR', 'ACTIVE', NOW(), NOW()),
('Suresh Motors', 'sales@sureshmotors.com', '9876500004', 'Suresh Motors', 'Pune, Maharashtra', 'INACTIVE', NOW(), NOW()),
('Anjali Electronics', 'support@anjalielec.com', '9876500005', 'Anjali Electronics', 'Bengaluru, Karnataka', 'ACTIVE', NOW(), NOW()),
('Devendra Realty', 'info@devendrarealty.com', '9876500006', 'Devendra Realty', 'Ahmedabad, Gujarat', 'ACTIVE', NOW(), NOW());

-- -------------------------------------------------------------
-- Table: leads
-- -------------------------------------------------------------
CREATE TABLE leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    source VARCHAR(50),
    status VARCHAR(30) DEFAULT 'NEW',
    value DECIMAL(12,2) DEFAULT 0,
    assigned_to VARCHAR(100),
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB;

INSERT INTO leads (name, email, phone, source, status, value, assigned_to, created_at, updated_at) VALUES
('Ramesh Agarwal', 'ramesh.a@example.com', '9123400001', 'WEBSITE', 'NEW', 150000, 'Guddu', NOW(), NOW()),
('Sunita Rao', 'sunita.r@example.com', '9123400002', 'REFERRAL', 'CONTACTED', 280000, 'Bablu', NOW(), NOW()),
('Manoj Gupta', 'manoj.g@example.com', '9123400003', 'SOCIAL_MEDIA', 'QUALIFIED', 420000, 'Guddu', NOW(), NOW()),
('Kavita Joshi', 'kavita.j@example.com', '9123400004', 'COLD_CALL', 'PROPOSAL', 560000, 'Bablu', NOW(), NOW()),
('Arjun Malhotra', 'arjun.m@example.com', '9123400005', 'ADVERTISEMENT', 'WON', 750000, 'Guddu', NOW(), NOW()),
('Neha Kapoor', 'neha.k@example.com', '9123400006', 'WEBSITE', 'LOST', 90000, 'Bablu', NOW(), NOW()),
('Farhan Sheikh', 'farhan.s@example.com', '9123400007', 'REFERRAL', 'NEW', 310000, 'Guddu', NOW(), NOW());

-- -------------------------------------------------------------
-- Table: tasks
-- -------------------------------------------------------------
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    assigned_to VARCHAR(100),
    status VARCHAR(20) DEFAULT 'PENDING',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    due_date DATE,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB;

INSERT INTO tasks (title, description, assigned_to, status, priority, due_date, created_at, updated_at) VALUES
('Follow up with Vikram Industries', 'Discuss renewal of annual contract', 'Guddu', 'PENDING', 'HIGH', DATE_ADD(CURDATE(), INTERVAL 2 DAY), NOW(), NOW()),
('Prepare Q3 sales report', 'Compile sales figures for the third quarter', 'Bablu', 'IN_PROGRESS', 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 5 DAY), NOW(), NOW()),
('Onboard new employee', 'Complete onboarding paperwork and system access', 'Deepak Kushwaha', 'PENDING', 'MEDIUM', DATE_ADD(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
('Client demo - Anjali Electronics', 'Product walkthrough call', 'Guddu', 'COMPLETED', 'HIGH', DATE_SUB(CURDATE(), INTERVAL 1 DAY), NOW(), NOW()),
('Update CRM database backup', 'Verify nightly backup job', 'Bablu', 'PENDING', 'LOW', DATE_ADD(CURDATE(), INTERVAL 7 DAY), NOW(), NOW()),
('Send proposal to Kavita Joshi', 'Finalize pricing and send PDF proposal', 'Bablu', 'PENDING', 'URGENT', CURDATE(), NOW(), NOW());

-- -------------------------------------------------------------
-- Table: employees
-- -------------------------------------------------------------
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    designation VARCHAR(100),
    department VARCHAR(100),
    joining_date DATE,
    salary DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB;

INSERT INTO employees (name, email, phone, designation, department, joining_date, salary, status, created_at, updated_at) VALUES
('Deepak Kushwaha', 'admin@trishulcrm.com', '9988770001', 'Chief Executive Officer', 'Management', '2019-04-01', 250000, 'ACTIVE', NOW(), NOW()),
('Guddu', 'supervisor@trishulcrm.com', '9988770002', 'Sales Supervisor', 'Sales', '2020-06-15', 95000, 'ACTIVE', NOW(), NOW()),
('Bablu', 'user@trishulcrm.com', '9988770003', 'Sales Executive', 'Sales', '2022-01-10', 55000, 'ACTIVE', NOW(), NOW()),
('Isha Kulkarni', 'isha.k@trishulcrm.com', '9988770004', 'HR Manager', 'Human Resources', '2021-03-20', 70000, 'ACTIVE', NOW(), NOW()),
('Dev Patel', 'dev.p@trishulcrm.com', '9988770005', 'Support Engineer', 'Customer Support', '2023-08-05', 48000, 'ON_LEAVE', NOW(), NOW());

-- -------------------------------------------------------------
-- Table: reports
-- -------------------------------------------------------------
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    summary TEXT,
    generated_by VARCHAR(100),
    generated_date DATETIME
) ENGINE=InnoDB;

INSERT INTO reports (title, type, summary, generated_by, generated_date) VALUES
('Monthly Sales Report - July', 'SALES', 'Overall sales grew 18% month over month driven by the Sales team''s lead conversions.', 'Deepak Kushwaha', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('Customer Growth Report - Q2', 'CUSTOMER', 'Customer base grew by 6 new active accounts across manufacturing and retail sectors.', 'Guddu', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Lead Conversion Analysis', 'LEAD', 'Conversion rate from qualified to won stands at 32% this quarter.', 'Guddu', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Employee Performance Summary', 'EMPLOYEE', 'Sales department exceeded targets; support tickets resolved within SLA 94% of the time.', 'Deepak Kushwaha', DATE_SUB(NOW(), INTERVAL 6 HOUR));

-- -------------------------------------------------------------
-- Table: settings  (single-row company configuration)
-- -------------------------------------------------------------
CREATE TABLE settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100),
    company_email VARCHAR(100),
    currency VARCHAR(10),
    timezone VARCHAR(50),
    theme VARCHAR(20),
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    fiscal_year_start VARCHAR(20)
) ENGINE=InnoDB;

INSERT INTO settings (company_name, company_email, currency, timezone, theme, email_notifications, sms_notifications, fiscal_year_start) VALUES
('Trishul Enterprises Pvt. Ltd.', 'info@trishulcrm.com', 'INR', 'Asia/Kolkata', 'dark', TRUE, FALSE, 'April');

-- -------------------------------------------------------------
-- Helpful indexes
-- -------------------------------------------------------------
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_employees_status ON employees(status);

-- =============================================================
-- End of schema
-- =============================================================
