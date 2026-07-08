---
title: "INSERT, UPDATE, DELETE — Modify Data"
description: "Add, change, and remove data from tables — essential DML operations every analyst should understand."
category: "sql"
order: 7
phase: 2
tags: ["sql", "insert", "update", "delete", "dml"]
publishedDate: 2025-02-18
prevSlug: "distinct-and-aliases"
nextSlug: "subqueries"
seoTitle: "SQL INSERT UPDATE DELETE Tutorial | Datalogify"
seoDescription: "Master SQL INSERT INTO, UPDATE SET, DELETE FROM with safe practices and real examples."
---

## Why This Matters

Analytics isn't read-only. You'll need to insert staging data, update incorrect records, clean test entries, and build ETL pipelines. Even if you don't write production INSERT/UPDATE/DELETE statements daily, you'll review them in pull requests, debug data issues caused by bad updates, and write data correction scripts. Understanding DML (Data Manipulation Language) separates analysts who can fix problems from those who just report them.

## The Tables We're Working With

```sql
-- products table
-- | product_id | name          | category | price  | status   | last_updated |
-- |------------|---------------|----------|--------|----------|--------------|
-- | 1          | CRM Pro       | Software | 15000  | active   | 2024-01-15   |
-- | 2          | Analytics Hub | Software | 28000  | active   | 2024-01-15   |
-- | 3          | Data Vault    | Software | 8500   | active   | 2024-02-01   |
-- | 4          | Cloud Backup  | Service  | 3200   | active   | 2024-03-10   |
-- | 5          | SecureGate    | Security | 12000  | inactive | 2024-01-20   |

-- orders table
-- | order_id | customer_id | product_id | quantity | total  | order_date | status    |
-- |----------|-------------|------------|----------|--------|------------|-----------|
-- | 1001     | 501         | 1          | 2        | 30000  | 2024-01-10 | completed |
-- | 1002     | 502         | 2          | 1        | 28000  | 2024-01-18 | completed |
-- | 1003     | 503         | 3          | 3        | 25500  | 2024-02-05 | pending   |
-- | 1004     | 501         | 1          | 1        | 15000  | 2024-03-01 | completed |
-- | 1005     | 504         | 4          | 5        | 16000  | 2024-03-15 | cancelled |
```

## INSERT INTO — Adding New Rows

### Insert a Single Row

```sql
-- Add a new product
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES (6, 'API Gateway', 'Service', 5500, 'active', '2024-04-01');
```

```text
# Output:
INSERT 0 1
(1 row inserted)
```

Always list the column names explicitly. Never rely on column order — if someone adds a column to the table, your INSERT breaks.

### Insert Multiple Rows

```sql
-- Add several products at once
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES
    (7, 'ML Studio', 'Software', 35000, 'active', '2024-04-01'),
    (8, 'DevOps Pro', 'Service', 9800, 'active', '2024-04-01'),
    (9, 'DataSync', 'Service', 4200, 'active', '2024-04-15');
```

```text
# Output:
INSERT 0 3
(3 rows inserted)
```

Multi-row INSERT is faster than running three separate INSERT statements because it's one trip to the database instead of three.

### Insert with Default and NULL Values

```sql
-- Insert with explicit NULL and DEFAULT
INSERT INTO orders (order_id, customer_id, product_id, quantity, total, order_date, status)
VALUES (1006, 505, 6, 2, 11000, CURRENT_DATE, 'pending');
```

```text
# Output:
INSERT 0 1
(1 row inserted)
```

`CURRENT_DATE` gives you today's date — useful for tracking when records are created.

### INSERT from SELECT — Copy Data Between Tables

This is extremely common in ETL and data migration work.

```sql
-- Create a high-value orders archive from existing data
-- (Assume archive_orders table already exists with same structure)
INSERT INTO archive_orders (order_id, customer_id, product_id, quantity, total, order_date, status)
SELECT order_id, customer_id, product_id, quantity, total, order_date, status
FROM orders
WHERE total > 25000
  AND status = 'completed';
```

```text
# Output:
INSERT 0 2
(2 rows inserted — orders 1001 and 1002)
```

```sql
-- Insert summary data into a reporting table
INSERT INTO monthly_summary (month, total_orders, total_revenue)
SELECT
    DATE_TRUNC('month', order_date) AS month,
    COUNT(*)                        AS total_orders,
    SUM(total)                      AS total_revenue
FROM orders
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', order_date);
```

```text
# Output:
INSERT 0 2
(2 rows inserted — Jan and Mar summaries)
```

<div class="interview-tip">

**Where this is used in real jobs:** INSERT...SELECT is the backbone of data pipelines. You'll use it to populate staging tables, create snapshots for reporting, migrate data between environments, and build summary tables that dashboards read from. It's far more common in analytics than single-row INSERTs.

</div>

## UPDATE — Changing Existing Data

### Basic UPDATE with WHERE

```sql
-- Increase the price of CRM Pro by 10%
UPDATE products
SET price = 16500,
    last_updated = '2024-04-15'
WHERE product_id = 1;
```

```text
# Output:
UPDATE 1
(1 row updated)
```

### ⚠️ The Cardinal Rule: Never UPDATE Without WHERE

```sql
-- DANGER: This updates EVERY row in the table
UPDATE products
SET status = 'inactive';
-- All 5 products are now inactive. Oops.
```

**Always run a SELECT first** to verify which rows your WHERE clause matches:

```sql
-- Step 1: Check what you're about to update
SELECT product_id, name, status
FROM products
WHERE category = 'Service' AND status = 'active';
```

```text
# Output:
product_id | name         | status
-----------|--------------|-------
4          | Cloud Backup | active
(1 row)
```

```sql
-- Step 2: Now update, confident you're hitting the right rows
UPDATE products
SET status = 'inactive',
    last_updated = '2024-04-15'
WHERE category = 'Service' AND status = 'active';
```

```text
# Output:
UPDATE 1
(1 row updated)
```

### Update Multiple Columns

```sql
-- Fix a product's category and price
UPDATE products
SET category = 'Platform',
    price = 32000,
    last_updated = CURRENT_DATE
WHERE name = 'Analytics Hub';
```

```text
# Output:
UPDATE 1
(1 row updated)
```

### UPDATE with Calculations

```sql
-- Give all Software products a 15% price increase
UPDATE products
SET price = price * 1.15,
    last_updated = CURRENT_DATE
WHERE category = 'Software';
```

```text
# Output:
UPDATE 3
(3 rows updated — CRM Pro, Analytics Hub, Data Vault)
```

### UPDATE with JOIN (Update Based on Another Table)

```sql
-- Mark orders as 'shipped' if the product is active
-- PostgreSQL syntax:
UPDATE orders o
SET status = 'shipped'
FROM products p
WHERE o.product_id = p.product_id
  AND p.status = 'active'
  AND o.status = 'pending';
```

```text
# Output:
UPDATE 1
(1 row updated — order 1003)
```

```sql
-- MySQL syntax (different FROM clause):
UPDATE orders o
JOIN products p ON o.product_id = p.product_id
SET o.status = 'shipped'
WHERE p.status = 'active'
  AND o.status = 'pending';
```

**Note:** UPDATE with JOIN syntax differs between databases. PostgreSQL uses `UPDATE ... SET ... FROM ... WHERE`, MySQL uses `UPDATE ... JOIN ... SET ... WHERE`.

## DELETE — Removing Rows

### Basic DELETE with WHERE

```sql
-- Remove cancelled orders
DELETE FROM orders
WHERE status = 'cancelled';
```

```text
# Output:
DELETE 1
(1 row deleted — order 1005)
```

### ⚠️ Never DELETE Without WHERE

```sql
-- CATASTROPHE: Deletes every row in the table
DELETE FROM orders;
-- Your entire orders table is now empty. Have fun explaining that.
```

Same safety rule as UPDATE: **run a SELECT first**.

```sql
-- Step 1: Check what you'd delete
SELECT order_id, customer_id, status
FROM orders
WHERE status = 'cancelled';
```

```text
# Output:
order_id | customer_id | status
---------|-------------|----------
1005     | 504         | cancelled
(1 row)
```

```sql
-- Step 2: Confident? Now delete.
DELETE FROM orders
WHERE status = 'cancelled';
```

### DELETE with Subquery

```sql
-- Delete orders for inactive products
DELETE FROM orders
WHERE product_id IN (
    SELECT product_id
    FROM products
    WHERE status = 'inactive'
);
```

```text
# Output:
DELETE 0
(0 rows deleted — no orders had inactive products)
```

## TRUNCATE vs DELETE

Both remove data, but they work differently:

```sql
-- DELETE: Removes rows one by one, can filter with WHERE, can be rolled back
DELETE FROM staging_table
WHERE import_date < '2024-01-01';

-- TRUNCATE: Removes ALL rows instantly, no WHERE clause, faster
TRUNCATE TABLE staging_table;
```

| Feature | DELETE | TRUNCATE |
|---------|--------|----------|
| WHERE clause | ✅ Yes | ❌ No (removes all rows) |
| Speed | Slower (row-by-row) | Very fast (drops & recreates) |
| Transaction rollback | ✅ Can be rolled back | ⚠️ Depends on database |
| Triggers fire | ✅ Yes | ❌ No |
| Resets auto-increment | ❌ No | ✅ Yes |

**Use DELETE** when you need to remove specific rows or need transactional safety.
**Use TRUNCATE** when you want to wipe a staging table before a fresh data load.

## Transactions — Your Safety Net

Transactions let you group multiple operations and roll them back if something goes wrong.

```sql
-- Start a transaction
BEGIN;

-- Make your changes
UPDATE products
SET price = price * 1.20
WHERE category = 'Software';

-- Check the results before committing
SELECT name, price FROM products WHERE category = 'Software';
```

```text
# Output:
name          | price
--------------|------
CRM Pro       | 18000
Analytics Hub | 33600
Data Vault    | 10200
(3 rows)
```

```sql
-- Prices look wrong? Roll back.
ROLLBACK;
-- Prices are back to their original values.

-- Prices look right? Commit.
COMMIT;
-- Changes are now permanent.
```

### Safe Update Pattern

```sql
-- The professional workflow for data changes:
BEGIN;

-- 1. Check what you'll affect
SELECT COUNT(*) FROM orders WHERE status = 'pending';
-- Shows: 1

-- 2. Make the change
UPDATE orders
SET status = 'processing'
WHERE status = 'pending';
-- Shows: UPDATE 1

-- 3. Verify the result
SELECT order_id, status FROM orders WHERE status = 'processing';
-- Shows the updated rows

-- 4. Commit or rollback
COMMIT;  -- or ROLLBACK if something looks wrong
```

<div class="interview-tip">

**Interview tip:** When asked about UPDATE or DELETE, always mention: "I'd run a SELECT first with the same WHERE clause to verify the row count, wrap it in a transaction, and check the results before committing." This shows you understand production data safety — a sign of experience.

</div>

## UPSERT — Insert or Update (ON CONFLICT)

Sometimes you want to insert a row if it's new, or update it if it already exists.

```sql
-- PostgreSQL: INSERT ... ON CONFLICT
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES (1, 'CRM Pro', 'Software', 16500, 'active', CURRENT_DATE)
ON CONFLICT (product_id)
DO UPDATE SET
    price = EXCLUDED.price,
    last_updated = EXCLUDED.last_updated;
```

```text
# Output:
INSERT 0 1
(product_id 1 already exists — price updated to 16500)
```

```sql
-- MySQL equivalent: INSERT ... ON DUPLICATE KEY UPDATE
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES (1, 'CRM Pro', 'Software', 16500, 'active', CURRENT_DATE)
ON DUPLICATE KEY UPDATE
    price = VALUES(price),
    last_updated = VALUES(last_updated);
```

<div class="challenge">

### Challenge: Data Correction Script

Your company discovered that all orders placed in January 2024 were incorrectly priced. The actual prices should be 10% higher. Write a script that:

1. **Starts a transaction**
2. **Checks** how many orders will be affected (SELECT COUNT)
3. **Updates** the `total` column to be 10% higher for all orders where `order_date` is in January 2024
4. **Verifies** the changes by selecting the updated rows
5. **Commits** the transaction

**Expected verification output:**
```text
order_id | customer_id | total  | order_date | status
---------|-------------|--------|------------|----------
1001     | 501         | 33000  | 2024-01-10 | completed
1002     | 502         | 30800  | 2024-01-18 | completed
(2 rows)
```

**Hint:** Use BEGIN, SELECT COUNT, UPDATE with BETWEEN for dates, SELECT for verification, COMMIT.

</div>

## Common Interview Questions

### Q1: What is the difference between DELETE and TRUNCATE?

**Answer:** DELETE removes rows one at a time, supports WHERE clauses, fires triggers, and can always be rolled back within a transaction. TRUNCATE drops and recreates the table (or deallocates pages), is much faster, doesn't support WHERE, doesn't fire row-level triggers, and resets auto-increment counters. In PostgreSQL, TRUNCATE is transactional. In MySQL/SQL Server, it's generally not fully rollback-safe. Use DELETE for selective removal, TRUNCATE for wiping staging tables.

### Q2: What happens if you run UPDATE without a WHERE clause?

**Answer:** It updates every single row in the table. This is almost always a catastrophic mistake in production. Best practice: always write the WHERE clause first, run a SELECT with that same WHERE to verify the row count, wrap the UPDATE in a transaction, and verify the results before committing. Some database admin tools have a "safe updates" mode that prevents UPDATE/DELETE without WHERE.

### Q3: What is an UPSERT and when would you use it?

**Answer:** An UPSERT inserts a row if it doesn't exist, or updates it if it does. PostgreSQL uses `INSERT ... ON CONFLICT DO UPDATE`, MySQL uses `INSERT ... ON DUPLICATE KEY UPDATE`, and SQL Server uses `MERGE`. It's commonly used in ETL pipelines where you're loading data that may contain both new and updated records — for example, syncing product catalog changes from an external system daily.

### Q4: Can you INSERT into a table from a SELECT on the same table?

**Answer:** Yes. `INSERT INTO orders SELECT * FROM orders WHERE status = 'template'` is valid and commonly used for cloning rows. The database reads the source data first, then inserts. However, be careful with auto-increment columns and unique constraints — you may need to exclude or modify the primary key column. Always test with a small subset first.

### Q5: What are DML and DDL? What's the difference?

**Answer:** DML (Data Manipulation Language) includes INSERT, UPDATE, DELETE, and SELECT — operations that work on the data inside tables. DDL (Data Definition Language) includes CREATE, ALTER, DROP, and TRUNCATE — operations that modify the table structure itself. The key difference: DML changes are typically transactional (can be rolled back), while DDL changes in many databases cause an implicit commit and cannot be rolled back. In an interview, knowing this distinction shows you understand database fundamentals.
