---
title: "Database Design & Normalization"
description: "Understand how databases are structured — normalization, primary/foreign keys, and schema design principles."
category: "sql"
order: 110
phase: 2
tags: ["sql", "database-design", "normalization", "schema", "keys"]
publishedDate: 2025-03-10
prevSlug: "query-optimization"
nextSlug: ""
seoTitle: "Database Design & Normalization Tutorial | Datalogify"
seoDescription: "Learn database design — normalization forms (1NF-3NF), primary/foreign keys, ERD, and schema best practices."
---

## Why This Matters

You pull data from a database every day. But have you ever wondered why the tables are structured the way they are? Why is customer info in one table and orders in another? Why not just put everything in one giant spreadsheet? Understanding database design makes you faster at writing queries, better at spotting data quality issues, and essential in conversations with engineers about schema changes.

## The Problem: One Giant Table

Imagine your company puts everything in one table:

```sql
-- The "everything in one table" approach
-- | order_id | customer_name | customer_email     | customer_phone | product       | product_category | product_price | quantity | order_date |
-- |----------|---------------|--------------------|----------------|---------------|------------------|---------------|----------|------------|
-- | 1001     | Sarah Chen    | sarah@acme.com     | 555-0101       | CRM Pro       | Software         | 15000         | 1        | 2024-01-10 |
-- | 1002     | Sarah Chen    | sarah@acme.com     | 555-0101       | Analytics Hub | Software         | 28000         | 1        | 2024-01-18 |
-- | 1003     | James Wilson  | james@beta.com     | 555-0202       | CRM Pro       | Software         | 15000         | 2        | 2024-02-05 |
-- | 1004     | Sarah Chen    | sarah@newmail.com  | 555-0101       | Data Vault    | Storage          | 8500          | 1        | 2024-02-22 |
-- | 1005     | James Wilson  | james@beta.com     | 555-0202       | Cloud Backup  | Storage          | 3200          | 3        | 2024-03-01 |
```

Three problems jump out immediately:

**1. Redundancy**: Sarah's name and phone are repeated in every row she has an order. If she has 50 orders, that's 50 copies.

**2. Update anomalies**: Sarah changed her email in row 1004, but rows 1001 and 1002 still have the old email. Which is correct?

**3. Deletion anomalies**: If we delete James's orders, we lose his customer information entirely.

## Primary Keys — Unique Identifiers

Every table needs a primary key — a column (or combination) that uniquely identifies each row.

```sql
-- Creating tables with primary keys
CREATE TABLE customers (
    customer_id   SERIAL PRIMARY KEY,   -- auto-incrementing integer
    customer_name VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    created_date  DATE DEFAULT CURRENT_DATE
);

CREATE TABLE products (
    product_id    SERIAL PRIMARY KEY,
    product_name  VARCHAR(100) NOT NULL,
    category      VARCHAR(50),
    price         DECIMAL(10,2) NOT NULL
);
```

```text
CREATE TABLE
CREATE TABLE
```

```sql
-- Insert sample data
INSERT INTO customers (customer_name, email, phone) VALUES
('Sarah Chen',    'sarah@acme.com',  '555-0101'),
('James Wilson',  'james@beta.com',  '555-0202'),
('Priya Patel',   'priya@gamma.com', '555-0303'),
('Marcus Brown',  'marcus@delta.com','555-0404');

INSERT INTO products (product_name, category, price) VALUES
('CRM Pro',       'Software', 15000),
('Analytics Hub', 'Software', 28000),
('Data Vault',    'Storage',  8500),
('Cloud Backup',  'Storage',  3200),
('ML Studio',     'Software', 35000);
```

```text
INSERT 0 4
INSERT 0 5
```

```sql
SELECT * FROM customers;
```

```text
customer_id | customer_name | email            | phone    | created_date
------------|---------------|------------------|----------|-------------
1           | Sarah Chen    | sarah@acme.com   | 555-0101 | 2024-10-27
2           | James Wilson  | james@beta.com   | 555-0202 | 2024-10-27
3           | Priya Patel   | priya@gamma.com  | 555-0303 | 2024-10-27
4           | Marcus Brown  | marcus@delta.com | 555-0404 | 2024-10-27
```

<div class="interview-tip">

**Primary Key Rules**: (1) Must be unique — no two rows can have the same value. (2) Cannot be NULL. (3) Should rarely change — use synthetic IDs (auto-increment integers) instead of natural data like emails (which people change). (4) Every table must have one.

</div>

## Foreign Keys — Linking Tables Together

A foreign key is a column that references the primary key of another table. It enforces relationships.

```sql
CREATE TABLE orders (
    order_id    SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    product_id  INTEGER NOT NULL REFERENCES products(product_id),
    quantity    INTEGER NOT NULL DEFAULT 1,
    order_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    status      VARCHAR(20) DEFAULT 'pending'
);
```

```text
CREATE TABLE
```

```sql
INSERT INTO orders (customer_id, product_id, quantity, order_date, status) VALUES
(1, 1, 1, '2024-01-10', 'completed'),
(1, 2, 1, '2024-01-18', 'completed'),
(2, 1, 2, '2024-02-05', 'completed'),
(1, 3, 1, '2024-02-22', 'completed'),
(2, 4, 3, '2024-03-01', 'completed'),
(3, 5, 1, '2024-03-14', 'completed'),
(4, 2, 1, '2024-04-02', 'pending');
```

```text
INSERT 0 7
```

```sql
-- Foreign key PREVENTS bad data
INSERT INTO orders (customer_id, product_id, quantity, order_date)
VALUES (999, 1, 1, '2024-05-01');
-- ERROR: Key (customer_id)=(999) is not present in table "customers"
```

```text
ERROR:  insert or update on table "orders" violates foreign key constraint
DETAIL:  Key (customer_id)=(999) is not present in table "customers".
```

```sql
-- Now we can JOIN cleanly — each piece of data is stored ONCE
SELECT o.order_id,
       c.customer_name,
       c.email,
       p.product_name,
       p.price * o.quantity AS total_amount,
       o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN products p ON o.product_id = p.product_id
ORDER BY o.order_date;
```

```text
order_id | customer_name | email            | product_name  | total_amount | order_date
---------|---------------|------------------|---------------|--------------|----------
1        | Sarah Chen    | sarah@acme.com   | CRM Pro       | 15000        | 2024-01-10
2        | Sarah Chen    | sarah@acme.com   | Analytics Hub | 28000        | 2024-01-18
3        | James Wilson  | james@beta.com   | CRM Pro       | 30000        | 2024-02-05
4        | Sarah Chen    | sarah@acme.com   | Data Vault    | 8500         | 2024-02-22
5        | James Wilson  | james@beta.com   | Cloud Backup  | 9600         | 2024-03-01
6        | Priya Patel   | priya@gamma.com  | ML Studio     | 35000        | 2024-03-14
7        | Marcus Brown  | marcus@delta.com | Analytics Hub | 28000        | 2024-04-02
```

Sarah's info is stored once. If she changes her email, you update one row in `customers`. Every order automatically shows the correct email.

## Normalization — The Rules of Good Design

Normalization is the process of organizing tables to reduce redundancy and prevent anomalies. There are multiple "normal forms" — in practice, you need to know the first three.

### First Normal Form (1NF) — No Repeating Groups

Every column must contain a single value. No arrays, no comma-separated lists.

```sql
-- ❌ Violates 1NF: multiple values in one column
-- | customer_id | name       | phone_numbers              |
-- |-------------|------------|----------------------------|
-- | 1           | Sarah Chen | 555-0101, 555-0102         |
-- | 2           | James      | 555-0201, 555-0202, 555-03 |

-- ✅ 1NF: one value per cell, separate table for multi-valued data
-- customers table
-- | customer_id | name        |
-- |-------------|-------------|
-- | 1           | Sarah Chen  |
-- | 2           | James Wilson|

-- customer_phones table
-- | customer_id | phone_type | phone_number |
-- |-------------|------------|--------------|
-- | 1           | work       | 555-0101     |
-- | 1           | mobile     | 555-0102     |
-- | 2           | work       | 555-0201     |
-- | 2           | mobile     | 555-0202     |
-- | 2           | home       | 555-0203     |
```

### Second Normal Form (2NF) — No Partial Dependencies

Every non-key column must depend on the ENTIRE primary key, not just part of it. This only matters for composite keys.

```sql
-- ❌ Violates 2NF: product_name depends only on product_id, not the full key
-- order_items (composite key: order_id + product_id)
-- | order_id | product_id | product_name  | quantity | price |
-- |----------|------------|---------------|----------|-------|
-- | 1001     | 1          | CRM Pro       | 2        | 15000 |
-- | 1001     | 2          | Analytics Hub | 1        | 28000 |
-- | 1002     | 1          | CRM Pro       | 1        | 15000 |
-- product_name depends on product_id alone, NOT on (order_id, product_id)

-- ✅ 2NF: split into two tables
-- products: product_id → product_name, price
-- order_items: (order_id, product_id) → quantity
```

### Third Normal Form (3NF) — No Transitive Dependencies

Every non-key column must depend directly on the primary key, not on another non-key column.

```sql
-- ❌ Violates 3NF: department_name depends on department_id, not emp_id
-- | emp_id | name       | department_id | department_name |
-- |--------|------------|---------------|-----------------|
-- | 1      | Sarah Chen | 10            | Analytics       |
-- | 2      | James      | 20            | Engineering     |
-- | 3      | Priya      | 10            | Analytics       |
-- department_name depends on department_id (transitive dependency)

-- ✅ 3NF: split into two tables
CREATE TABLE departments (
    department_id   SERIAL PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL
);

CREATE TABLE employees (
    emp_id        SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(department_id),
    salary        DECIMAL(10,2)
);
```

```text
CREATE TABLE
CREATE TABLE
```

```sql
INSERT INTO departments (department_name) VALUES
('Analytics'), ('Engineering'), ('Sales'), ('Marketing');

SELECT * FROM departments;
```

```text
department_id | department_name
--------------|---------
1             | Analytics
2             | Engineering
3             | Sales
4             | Marketing
```

## Relationship Types

### One-to-Many (Most Common)

One customer has many orders. One department has many employees.

```sql
-- One customer → many orders
-- The "many" side holds the foreign key
SELECT c.customer_name,
       COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_name;
```

```text
customer_name | order_count
--------------|------------
Sarah Chen    | 3
James Wilson  | 2
Priya Patel   | 1
Marcus Brown  | 1
```

### Many-to-Many

One student takes many courses. One course has many students. You need a junction table.

```sql
-- Junction table for many-to-many
CREATE TABLE employees_projects (
    emp_id     INTEGER REFERENCES employees(emp_id),
    project_id INTEGER,
    role       VARCHAR(50),
    PRIMARY KEY (emp_id, project_id)  -- composite primary key
);

-- employees table
-- | emp_id | name       |
-- |--------|------------|
-- | 1      | Sarah Chen |
-- | 2      | James      |
-- | 3      | Priya      |

-- projects table
-- | project_id | project_name    |
-- |------------|-----------------|
-- | 101        | Data Migration  |
-- | 102        | Dashboard Build |

-- employees_projects (junction table)
-- | emp_id | project_id | role       |
-- |--------|------------|------------|
-- | 1      | 101        | Lead       |
-- | 1      | 102        | Analyst    |
-- | 2      | 101        | Developer  |
-- | 3      | 102        | Analyst    |
```

### One-to-One

Rarely used. One employee has one badge. Usually these just go in the same table unless you need to separate sensitive data.

```sql
-- One-to-one: separate sensitive data
-- employees: emp_id, name, department
-- employee_ssn: emp_id (PK + FK), ssn, tax_id
-- Only HR has access to employee_ssn
```

## Entity Relationship Diagrams (ERD)

An ERD is a visual map of your database. Here's how to read one:

```sql
-- Text-based ERD for our schema:
--
-- customers (1) ──────< (many) orders (many) >────── (1) products
--     │                          │
--     │ customer_id              │ order_id
--     │ customer_name            │ customer_id (FK)
--     │ email                    │ product_id (FK)
--     │ phone                    │ quantity
--     │ created_date             │ order_date
--                                │ status
--
-- Legend:
--   (1) ──< (many)  = one-to-many relationship
--   PK = Primary Key
--   FK = Foreign Key
```

## Constraints — Enforcing Data Quality

```sql
CREATE TABLE products_v2 (
    product_id   SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,             -- cannot be empty
    category     VARCHAR(50) NOT NULL,
    price        DECIMAL(10,2) NOT NULL CHECK (price > 0),  -- must be positive
    sku          VARCHAR(20) UNIQUE,                 -- no duplicates
    status       VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'discontinued', 'coming_soon')),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

```text
CREATE TABLE
```

```sql
-- Constraints prevent bad data
INSERT INTO products_v2 (product_name, category, price, sku)
VALUES ('Bad Product', 'Test', -500, 'SKU001');
-- ERROR: violates check constraint: price > 0
```

```text
ERROR:  new row for relation "products_v2" violates check constraint "products_v2_price_check"
DETAIL:  Failing row contains (1, Bad Product, Test, -500.00, SKU001, active, ...).
```

```sql
-- Valid insert
INSERT INTO products_v2 (product_name, category, price, sku) VALUES
('CRM Pro', 'Software', 15000, 'SKU001'),
('Analytics Hub', 'Software', 28000, 'SKU002');

SELECT * FROM products_v2;
```

```text
product_id | product_name  | category | price    | sku    | status | created_at
-----------|---------------|----------|----------|--------|--------|-------------------
1          | CRM Pro       | Software | 15000.00 | SKU001 | active | 2024-10-27 14:30:00
2          | Analytics Hub | Software | 28000.00 | SKU002 | active | 2024-10-27 14:30:01
```

<div class="interview-tip">

**Constraints summary**: NOT NULL (required field), UNIQUE (no duplicates), PRIMARY KEY (unique + not null), FOREIGN KEY (must reference existing row), CHECK (custom validation rule), DEFAULT (auto-fill if not provided). These are the database's last line of defense against bad data.

</div>

## Denormalization — When to Break the Rules

Sometimes you deliberately denormalize for performance. This is common in data warehouses and analytics databases.

```sql
-- Fully normalized: requires 3 JOINs for a simple report
SELECT o.order_id, c.customer_name, p.product_name, d.department_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN products p ON o.product_id = p.product_id
JOIN departments d ON c.department_id = d.department_id;

-- Denormalized fact table: single table, no JOINs needed
-- | order_id | customer_name | customer_email | product_name | category | amount | order_date |
-- This is redundant but FAST for analytics queries
```

```sql
-- Star schema: the standard for analytics databases
-- Fact table: orders_fact (measures: amount, quantity)
-- Dimension tables: dim_customers, dim_products, dim_dates
-- Each dimension has a surrogate key that the fact table references

-- dim_dates (one row per day)
-- | date_key | full_date  | year | quarter | month | day_of_week |
-- |----------|------------|------|---------|-------|-------------|
-- | 20240110 | 2024-01-10 | 2024 | 1       | 1     | Wednesday   |

-- orders_fact
-- | order_key | date_key | customer_key | product_key | amount | quantity |
-- Optimized for aggregation queries
```

## Where This Is Used in Real Jobs

| Scenario | Concept | Why |
|----------|---------|-----|
| Writing JOINs | Foreign keys | Understanding relationships speeds up query writing |
| Data quality audit | Constraints, normalization | Spotting redundancy and anomalies |
| Schema change meetings | 1NF-3NF, ERD | Speaking the same language as engineers |
| Data warehouse design | Star schema, denormalization | Building analytics-ready tables |
| ETL pipeline design | Normalization decisions | Deciding what to store where |
| Interview whiteboard | ERD, normalization | Design a schema for X is a common question |

<div class="challenge">

### Challenge 1: Identify the Normal Form
Look at this table and identify which normal form it violates. Then fix it by splitting into properly normalized tables:
`| order_id | customer_name | customer_email | product | product_category | amount | order_date |`

### Challenge 2: Design a Schema
Design a normalized schema (3NF) for a library system. You need to track: books (title, ISBN, author, genre), members (name, email, phone), and loans (which member borrowed which book, checkout date, return date). Show the CREATE TABLE statements with primary keys, foreign keys, and appropriate constraints.

### Challenge 3: Star Schema
Convert the library schema from Challenge 2 into a star schema suitable for analytics. Create one fact table (fact_loans) and dimension tables (dim_books, dim_members, dim_dates). Show how this simplifies typical analytics queries like "loans per month by genre."

</div>

## Common Interview Questions

### Q1: What is normalization and why is it important?

**Answer:** Normalization is the process of organizing database tables to minimize redundancy and prevent data anomalies (update, insert, delete anomalies). It works by splitting data into related tables linked by foreign keys. It's important because: (1) it saves storage by eliminating duplicate data, (2) it prevents inconsistencies — updating a customer's email in one place updates it everywhere, (3) it maintains data integrity through foreign key constraints. The trade-off is more JOINs are needed for queries.

### Q2: Explain the difference between 1NF, 2NF, and 3NF.

**Answer:** **1NF**: Every column contains atomic (single) values — no arrays or comma-separated lists. Each row is unique. **2NF**: Meets 1NF plus every non-key column depends on the entire primary key, not just part of it. This mainly applies to composite keys. **3NF**: Meets 2NF plus every non-key column depends directly on the primary key, not on another non-key column (no transitive dependencies). Example of 3NF violation: employee table with department_id AND department_name — department_name depends on department_id, not on emp_id.

### Q3: What is the difference between a primary key and a foreign key?

**Answer:** A **primary key** uniquely identifies each row in a table — it must be unique and not NULL. Each table has exactly one primary key. A **foreign key** is a column that references the primary key of another table — it creates a relationship between tables and enforces referential integrity (you can't insert a foreign key value that doesn't exist in the referenced table). A table can have multiple foreign keys. Example: orders.customer_id is a foreign key referencing customers.customer_id.

### Q4: When would you denormalize a database?

**Answer:** Denormalize when read performance is more important than write consistency — typically in analytics and reporting databases. Common scenarios: (1) Data warehouses use star schemas with denormalized dimension tables for fast aggregation. (2) Dashboards that need sub-second response times on large datasets. (3) Caching computed values (e.g., storing total_orders on the customer row). (4) When JOIN complexity becomes a performance bottleneck. The trade-off: faster reads but more storage, risk of data inconsistency, and slower writes.

### Q5: Design a schema for an e-commerce platform.

**Answer:** Core tables: **users** (user_id PK, name, email UNIQUE, created_at), **products** (product_id PK, name, description, price, category_id FK), **categories** (category_id PK, name), **orders** (order_id PK, user_id FK, order_date, status, total_amount), **order_items** (order_item_id PK, order_id FK, product_id FK, quantity, unit_price) — this is the junction table between orders and products. **addresses** (address_id PK, user_id FK, street, city, state, zip). Key design decisions: order_items stores unit_price at time of purchase (products prices change), orders stores total_amount for fast lookups, and addresses are separate because users can have multiple.
