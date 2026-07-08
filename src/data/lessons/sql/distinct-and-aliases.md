---
title: "DISTINCT & Aliases — Clean Output"
description: "Remove duplicates and make your queries readable with column and table aliases."
category: "sql"
order: 6
phase: 2
tags: ["sql", "distinct", "aliases", "readability"]
publishedDate: 2025-02-17
prevSlug: "order-by-limit"
nextSlug: "insert-update-delete"
seoTitle: "SQL DISTINCT and Aliases Tutorial | Datalogify"
seoDescription: "Learn SQL DISTINCT for unique values and aliases (AS) for readable, maintainable queries."
---

## Why This Matters

Your manager asks: "What regions do we sell in?" You run `SELECT region FROM sales` and get back 50,000 rows — mostly duplicates. DISTINCT gives you the clean, unique list of 4 regions in one second. Aliases make your queries readable so the next person (or future you) doesn't spend 20 minutes deciphering what `t1.c3 * t2.c7` means.

## The Tables We're Working With

```sql
-- transactions table
-- | txn_id | customer_id | product       | category  | amount | txn_date   | channel  | region |
-- |--------|-------------|---------------|-----------|--------|------------|----------|--------|
-- | 1      | 301         | CRM Pro       | Software  | 15000  | 2024-01-10 | online   | East   |
-- | 2      | 302         | Analytics Hub | Software  | 28000  | 2024-01-18 | partner  | West   |
-- | 3      | 301         | Data Vault    | Software  | 8500   | 2024-02-05 | online   | East   |
-- | 4      | 303         | Cloud Backup  | Service   | 3200   | 2024-02-14 | online   | North  |
-- | 5      | 304         | CRM Pro       | Software  | 15000  | 2024-03-01 | partner  | South  |
-- | 6      | 302         | SecureGate    | Security  | 12000  | 2024-03-20 | online   | West   |
-- | 7      | 305         | CRM Pro       | Software  | 15000  | 2024-04-08 | direct   | East   |
-- | 8      | 303         | Analytics Hub | Software  | 28000  | 2024-04-15 | online   | North  |
-- | 9      | 301         | CRM Pro       | Software  | 15000  | 2024-05-02 | online   | East   |
-- | 10     | 306         | Data Vault    | Software  | 8500   | 2024-05-18 | partner  | South  |
-- | 11     | 304         | Cloud Backup  | Service   | 3200   | 2024-06-01 | direct   | South  |
-- | 12     | 305         | Analytics Hub | Software  | 28000  | 2024-06-12 | online   | East   |

-- customers table
-- | customer_id | name            | industry   | tier     |
-- |-------------|-----------------|------------|----------|
-- | 301         | Acme Corp       | Technology | gold     |
-- | 302         | GlobalTech Inc  | Technology | platinum |
-- | 303         | RetailMax       | Retail     | silver   |
-- | 304         | DataFlow LLC    | Finance    | silver   |
-- | 305         | CloudNine       | SaaS       | gold     |
-- | 306         | MegaRetail      | Retail     | gold     |
```

## SELECT DISTINCT — Remove Duplicate Rows

### Basic DISTINCT

Without DISTINCT, you get every row including repeats:

```sql
-- Without DISTINCT — lots of repeats
SELECT region
FROM transactions;
```

```text
# Output:
region
------
East
West
East
North
South
West
East
North
East
South
South
East
(12 rows)
```

Add DISTINCT to get unique values only:

```sql
-- With DISTINCT — clean list
SELECT DISTINCT region
FROM transactions;
```

```text
# Output:
region
------
East
North
South
West
(4 rows)
```

That's the difference between 12 rows of noise and 4 rows of signal.

### DISTINCT with Multiple Columns

DISTINCT looks at the *combination* of all selected columns. Two rows are duplicates only if every column matches.

```sql
-- Unique product-channel combinations
SELECT DISTINCT product, channel
FROM transactions
ORDER BY product, channel;
```

```text
# Output:
product       | channel
--------------|--------
Analytics Hub | online
Analytics Hub | partner
Cloud Backup  | direct
Cloud Backup  | online
CRM Pro       | direct
CRM Pro       | online
CRM Pro       | partner
Data Vault    | online
Data Vault    | partner
SecureGate    | online
(10 rows)
```

Notice: "CRM Pro" appears three times because each row has a different channel. DISTINCT doesn't just deduplicate one column — it deduplicates the entire row.

### DISTINCT with ORDER BY

```sql
-- All unique categories, sorted
SELECT DISTINCT category
FROM transactions
ORDER BY category;
```

```text
# Output:
category
---------
Security
Service
Software
(3 rows)
```

**Rule:** When using DISTINCT with ORDER BY, the ORDER BY column must appear in the SELECT list (in most databases). This makes sense — you can't sort by a column that's been collapsed away by DISTINCT.

## COUNT(DISTINCT) — Count Unique Values

One of the most useful combinations in analytics. How many unique things exist?

```sql
-- How many unique customers made purchases?
SELECT COUNT(DISTINCT customer_id) AS unique_customers
FROM transactions;
```

```text
# Output:
unique_customers
----------------
6
```

```sql
-- How many unique products were sold in each region?
SELECT
    region,
    COUNT(DISTINCT product) AS unique_products,
    COUNT(*)                AS total_transactions
FROM transactions
GROUP BY region
ORDER BY unique_products DESC;
```

```text
# Output:
region | unique_products | total_transactions
-------|-----------------|-------------------
East   | 4               | 5
South  | 3               | 3
West   | 2               | 2
North  | 2               | 2
```

<div class="interview-tip">

**Where this is used in real jobs:** COUNT(DISTINCT) is everywhere in analytics dashboards. "How many unique visitors?" "How many distinct products were sold?" "How many different customers placed orders this month?" If you see a metric labeled "unique" or "distinct" on a dashboard, there's a COUNT(DISTINCT) behind it.

</div>

### COUNT(*) vs COUNT(DISTINCT)

```sql
-- The difference matters:
SELECT
    COUNT(*)                   AS total_rows,
    COUNT(product)             AS non_null_products,
    COUNT(DISTINCT product)    AS unique_products,
    COUNT(DISTINCT category)   AS unique_categories
FROM transactions;
```

```text
# Output:
total_rows | non_null_products | unique_products | unique_categories
-----------|-------------------|-----------------|------------------
12         | 12                | 5               | 3
```

- `COUNT(*)` = 12 total rows
- `COUNT(product)` = 12 non-null values (same here, no NULLs)
- `COUNT(DISTINCT product)` = 5 unique products
- `COUNT(DISTINCT category)` = 3 unique categories

## Column Aliases — Rename Your Output

### Basic Column Aliases with AS

```sql
SELECT
    product       AS product_name,
    amount        AS sale_amount,
    txn_date      AS transaction_date
FROM transactions
LIMIT 3;
```

```text
# Output:
product_name  | sale_amount | transaction_date
--------------|-------------|------------------
CRM Pro       | 15000       | 2024-01-10
Analytics Hub | 28000       | 2024-01-18
Data Vault    | 8500        | 2024-02-05
(3 rows)
```

Without aliases, whoever reads your report sees cryptic column names like `txn_date`. With aliases, they see `transaction_date`. Small effort, big impact on usability.

### Expression Aliases — Name Your Calculations

When you compute something, always alias it. Otherwise the column header is the raw expression.

```sql
SELECT
    product,
    amount,
    amount * 0.08           AS sales_tax,
    amount * 1.08           AS total_with_tax,
    amount / 12.0           AS monthly_equivalent
FROM transactions
WHERE amount > 10000
LIMIT 4;
```

```text
# Output:
product       | amount | sales_tax | total_with_tax | monthly_equivalent
--------------|--------|-----------|----------------|-------------------
CRM Pro       | 15000  | 1200.00   | 16200.00       | 1250.00
Analytics Hub | 28000  | 2240.00   | 30240.00       | 2333.33
CRM Pro       | 15000  | 1200.00   | 16200.00       | 1250.00
SecureGate    | 12000  | 960.00    | 12960.00       | 1000.00
(4 rows)
```

Without aliases, those columns would show up as `amount * 0.08`, `amount * 1.08`, `amount / 12.0` — ugly and confusing.

### Aliases with Spaces (Use Quotes)

```sql
SELECT
    product       AS "Product Name",
    amount        AS "Sale Amount ($)",
    txn_date      AS "Transaction Date"
FROM transactions
LIMIT 3;
```

```text
# Output:
Product Name  | Sale Amount ($) | Transaction Date
--------------|-----------------|------------------
CRM Pro       | 15000           | 2024-01-10
Analytics Hub | 28000           | 2024-01-18
Data Vault    | 8500            | 2024-02-05
(3 rows)
```

**Note:** Use double quotes in PostgreSQL/Oracle, square brackets `[Sale Amount ($)]` in SQL Server. Avoid spaces in aliases when possible — they make code harder to reference later.

### Aliases Without AS (Don't Do This)

SQL allows you to drop the AS keyword:

```sql
-- This works but DON'T do it
SELECT product product_name, amount sale_amount
FROM transactions;
```

**Always use AS.** Dropping it makes the code ambiguous and harder to read. One missing comma and your alias becomes a table reference.

## Table Aliases — Short Names for JOINs

### Why Table Aliases Exist

Without table aliases, JOIN queries become verbose:

```sql
-- Without aliases — painful to read and write
SELECT
    transactions.product,
    transactions.amount,
    customers.name,
    customers.industry
FROM transactions
JOIN customers ON transactions.customer_id = customers.customer_id;
```

### With Table Aliases — Clean and Fast

```sql
-- With aliases — much better
SELECT
    t.product,
    t.amount,
    c.name      AS customer_name,
    c.industry
FROM transactions t
JOIN customers c ON t.customer_id = c.customer_id
WHERE t.amount > 10000
ORDER BY t.amount DESC;
```

```text
# Output:
product       | amount | customer_name  | industry
--------------|--------|----------------|----------
Analytics Hub | 28000  | GlobalTech Inc | Technology
Analytics Hub | 28000  | RetailMax      | Retail
Analytics Hub | 28000  | CloudNine      | SaaS
CRM Pro       | 15000  | Acme Corp      | Technology
CRM Pro       | 15000  | DataFlow LLC   | Finance
CRM Pro       | 15000  | CloudNine      | SaaS
CRM Pro       | 15000  | Acme Corp      | Technology
SecureGate    | 12000  | GlobalTech Inc | Technology
(8 rows)
```

### Table Alias Conventions

Use short, meaningful abbreviations:

```sql
-- Good aliases — clear what each refers to
FROM transactions t
JOIN customers c ON t.customer_id = c.customer_id

-- Also good — first letter or abbreviation
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id

-- Bad aliases — meaningless
FROM transactions x
JOIN customers y ON x.customer_id = y.customer_id
```

### Self-Joins Require Aliases

Table aliases are *mandatory* for self-joins — you're joining a table to itself.

```sql
-- Find customers who bought the same product
SELECT
    t1.product,
    c1.name AS customer_1,
    c2.name AS customer_2
FROM transactions t1
JOIN transactions t2
    ON t1.product = t2.product
    AND t1.customer_id < t2.customer_id
JOIN customers c1 ON t1.customer_id = c1.customer_id
JOIN customers c2 ON t2.customer_id = c2.customer_id
ORDER BY t1.product;
```

```text
# Output (partial):
product       | customer_1     | customer_2
--------------|----------------|---------------
Analytics Hub | GlobalTech Inc | RetailMax
Analytics Hub | GlobalTech Inc | CloudNine
Analytics Hub | RetailMax      | CloudNine
CRM Pro       | Acme Corp      | DataFlow LLC
CRM Pro       | Acme Corp      | CloudNine
CRM Pro       | DataFlow LLC   | CloudNine
Data Vault    | Acme Corp      | MegaRetail
(7 rows)
```

Without aliases (`t1`, `t2`, `c1`, `c2`), this query is impossible to write.

## DISTINCT vs GROUP BY

A common question: when do you use DISTINCT and when do you use GROUP BY?

```sql
-- These return the same result:
SELECT DISTINCT region FROM transactions;
SELECT region FROM transactions GROUP BY region;
```

```text
# Output (both):
region
------
East
North
South
West
(4 rows)
```

**Use DISTINCT** when you just want unique values — no aggregation.
**Use GROUP BY** when you need aggregations (COUNT, SUM, AVG) alongside unique grouping.

```sql
-- GROUP BY is required here — you need COUNT
SELECT
    region,
    COUNT(*) AS order_count
FROM transactions
GROUP BY region
ORDER BY order_count DESC;
```

```text
# Output:
region | order_count
-------|------------
East   | 5
South  | 3
West   | 2
North  | 2
```

You cannot do this with DISTINCT alone. DISTINCT deduplicates; GROUP BY groups and aggregates.

## Putting It Together — Real Scenario

### Customer Purchase Summary

```sql
SELECT
    c.name                          AS customer,
    c.tier                          AS tier,
    COUNT(DISTINCT t.product)       AS unique_products,
    COUNT(*)                        AS total_orders,
    SUM(t.amount)                   AS total_spent,
    ROUND(AVG(t.amount), 0)        AS avg_order_value
FROM transactions t
JOIN customers c ON t.customer_id = c.customer_id
GROUP BY c.name, c.tier
ORDER BY total_spent DESC;
```

```text
# Output:
customer       | tier     | unique_products | total_orders | total_spent | avg_order_value
---------------|----------|-----------------|--------------|-------------|----------------
Acme Corp      | gold     | 2               | 3            | 38500       | 12833
CloudNine      | gold     | 2               | 2            | 43000       | 21500
GlobalTech Inc | platinum | 2               | 2            | 40000       | 20000
RetailMax      | silver   | 2               | 2            | 31200       | 15600
DataFlow LLC   | silver   | 2               | 2            | 18200       | 9100
MegaRetail     | gold     | 1               | 1            | 8500        | 8500
(6 rows)
```

Every alias here serves a purpose: `c` and `t` keep the query scannable, `AS customer` makes the output readable, and `AS avg_order_value` names the calculation.

<div class="challenge">

### Challenge: Channel Performance Report

Write a query that returns:
1. Each **sales channel** (aliased as `channel_name`)
2. The number of **unique customers** who used that channel
3. The number of **unique products** sold through that channel
4. The **total revenue** (aliased as `channel_revenue`)
5. Sorted by **channel_revenue descending**

**Expected output:**
```text
channel_name | unique_customers | unique_products | channel_revenue
-------------|------------------|-----------------|----------------
online       | 5                | 5               | 109700
partner      | 3                | 3               | 51500
direct       | 2                | 2               | 18200
(3 rows)
```

**Hint:** Use COUNT(DISTINCT ...), SUM(), GROUP BY, and column aliases.

</div>

## Common Interview Questions

### Q1: What is the difference between DISTINCT and GROUP BY?

**Answer:** DISTINCT removes duplicate rows from the result set. GROUP BY groups rows and is required when you use aggregate functions (COUNT, SUM, AVG). For simply getting unique values, both work: `SELECT DISTINCT region FROM sales` and `SELECT region FROM sales GROUP BY region` return the same result. But only GROUP BY lets you add aggregations like `COUNT(*)`. Use DISTINCT for deduplication, GROUP BY for aggregation.

### Q2: Does DISTINCT apply to all columns or just the first one?

**Answer:** DISTINCT applies to the entire row — the combination of all columns in the SELECT list. `SELECT DISTINCT first_name, last_name` deduplicates based on both columns together. Two rows with the same first_name but different last_names are NOT duplicates. There is no way to apply DISTINCT to only one column while selecting others (without using GROUP BY or window functions).

### Q3: Can you use a column alias in WHERE, GROUP BY, or HAVING?

**Answer:** It depends on the database. In MySQL, you can use aliases in GROUP BY, HAVING, and ORDER BY. In PostgreSQL, aliases work in ORDER BY but not in WHERE or HAVING. In SQL Server, aliases only work in ORDER BY. The safe answer: aliases always work in ORDER BY, may work elsewhere depending on the database. When in doubt, repeat the expression instead of using the alias.

### Q4: What is the performance impact of COUNT(DISTINCT)?

**Answer:** COUNT(DISTINCT column) is more expensive than COUNT(*) because the database must identify and track unique values — typically using sorting or hashing. On large tables, COUNT(DISTINCT) with millions of values can be significantly slower. For approximate distinct counts on very large datasets, some databases offer HyperLogLog-based functions like `APPROX_COUNT_DISTINCT` (SQL Server, BigQuery) that trade a small accuracy loss for massive speed gains.

### Q5: Why should you always use the AS keyword for aliases?

**Answer:** The AS keyword is technically optional in most databases — `SELECT name employee_name` works. But omitting AS creates ambiguity: if you forget a comma, `SELECT name department` looks like an alias when you meant two columns. Using AS explicitly — `SELECT name AS employee_name` — prevents these silent bugs, improves readability, and makes the intent clear. Every style guide recommends keeping AS.
