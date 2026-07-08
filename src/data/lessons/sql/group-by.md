---
title: "GROUP BY & Aggregations — Summarize Your Data"
description: "Learn to aggregate data with GROUP BY, COUNT, SUM, AVG, MIN, MAX — essential for every analytics report."
category: "sql"
order: 3
phase: 2
tags: ["sql", "group-by", "aggregation", "having"]
publishedDate: 2025-02-03
prevSlug: "joins"
nextSlug: "subqueries"
seoTitle: "SQL GROUP BY & Aggregations for Data Analytics | Datalogify"
seoDescription: "Master GROUP BY, HAVING, COUNT, SUM, AVG with real analytics report examples."
---

## Why This Matters

"How much revenue did each region generate last quarter?" "Which product has the highest return rate?" "How many customers signed up each month?" — every single one of these questions requires GROUP BY and aggregation. This is what transforms raw rows into actual insights.

## The Tables We're Working With

```sql
-- sales table
-- | sale_id | rep_id | product       | amount  | sale_date  | region | status   |
-- |---------|--------|---------------|---------|------------|--------|----------|
-- | 1       | 101    | CRM Pro       | 15000   | 2024-01-15 | West   | closed   |
-- | 2       | 102    | CRM Pro       | 12500   | 2024-01-22 | East   | closed   |
-- | 3       | 101    | Analytics Hub | 28000   | 2024-02-03 | West   | closed   |
-- | 4       | 102    | CRM Pro       | 15000   | 2024-02-18 | East   | closed   |
-- | 5       | 101    | Data Vault    | 8500    | 2024-03-07 | South  | closed   |
-- | 6       | 103    | Analytics Hub | 28000   | 2024-03-12 | West   | closed   |
-- | 7       | 103    | CRM Pro       | 12500   | 2024-04-01 | North  | closed   |
-- | 8       | 101    | CRM Pro       | 15000   | 2024-04-15 | West   | pending  |
-- | 9       | 102    | Data Vault    | 8500    | 2024-05-02 | East   | refunded |
-- | 10      | 103    | Analytics Hub | 28000   | 2024-05-20 | North  | closed   |
-- | 11      | 101    | CRM Pro       | 15000   | 2024-06-01 | South  | closed   |
-- | 12      | 102    | Analytics Hub | 28000   | 2024-06-15 | East   | closed   |

-- reps table
-- | rep_id | name           | team     | hire_date  |
-- |--------|----------------|----------|------------|
-- | 101    | Sarah Chen     | Alpha    | 2022-01-15 |
-- | 102    | James Wilson   | Beta     | 2022-06-01 |
-- | 103    | Priya Patel    | Alpha    | 2023-03-10 |
```

## Aggregate Functions — The Basics

### COUNT — How Many Rows?

```sql
-- Total number of sales
SELECT COUNT(*) AS total_sales
FROM sales;
```

```text
# Output:
total_sales
-----------
12
(1 row)
```

```sql
-- COUNT(*) vs COUNT(column) — a critical difference
SELECT
    COUNT(*)          AS total_rows,
    COUNT(status)     AS non_null_status,
    COUNT(DISTINCT status) AS unique_statuses
FROM sales;
```

```text
# Output:
total_rows | non_null_status | unique_statuses
-----------|-----------------|----------------
12         | 12              | 3
(1 row)
```

**Key rule:** `COUNT(*)` counts all rows including NULLs. `COUNT(column)` counts only non-NULL values. `COUNT(DISTINCT column)` counts unique non-NULL values.

### SUM — Total Value

```sql
SELECT SUM(amount) AS total_revenue
FROM sales
WHERE status = 'closed';
```

```text
# Output:
total_revenue
-------------
177500
(1 row)
```

### AVG — Average Value

```sql
SELECT
    AVG(amount)       AS avg_deal_size,
    ROUND(AVG(amount), 2) AS avg_rounded
FROM sales
WHERE status = 'closed';
```

```text
# Output:
avg_deal_size     | avg_rounded
------------------|------------
17750.000000      | 17750.00
(1 row)
```

### MIN and MAX

```sql
SELECT
    MIN(amount) AS smallest_deal,
    MAX(amount) AS largest_deal,
    MIN(sale_date) AS first_sale,
    MAX(sale_date) AS last_sale
FROM sales;
```

```text
# Output:
smallest_deal | largest_deal | first_sale | last_sale
--------------|--------------|------------|----------
8500          | 28000        | 2024-01-15 | 2024-06-15
(1 row)
```

<div class="interview-tip">

**Where this is used in real jobs:** Every dashboard KPI — total revenue, average order value, customer count, first/last purchase date — is an aggregate function. You'll write these dozens of times per week. Know them cold.

</div>

## GROUP BY — Aggregate Per Category

GROUP BY splits your data into groups, then applies aggregate functions to each group separately.

### Single Column GROUP BY

```sql
-- Revenue by region
SELECT
    region,
    COUNT(*)      AS num_deals,
    SUM(amount)   AS total_revenue,
    AVG(amount)   AS avg_deal_size
FROM sales
WHERE status = 'closed'
GROUP BY region
ORDER BY total_revenue DESC;
```

```text
# Output:
region | num_deals | total_revenue | avg_deal_size
-------|-----------|---------------|-------------
West   | 3         | 71000         | 23666.67
East   | 3         | 55500         | 18500.00
North  | 2         | 40500         | 20250.00
South  | 2         | 23500         | 11750.00
(4 rows)
```

### Multiple Column GROUP BY

```sql
-- Revenue by region AND product
SELECT
    region,
    product,
    COUNT(*)    AS deals,
    SUM(amount) AS revenue
FROM sales
WHERE status = 'closed'
GROUP BY region, product
ORDER BY region, revenue DESC;
```

```text
# Output:
region | product       | deals | revenue
-------|---------------|-------|--------
East   | Analytics Hub | 1     | 28000
East   | CRM Pro       | 2     | 27500
North  | Analytics Hub | 1     | 28000
North  | CRM Pro       | 1     | 12500
South  | CRM Pro       | 1     | 15000
South  | Data Vault    | 1     | 8500
West   | Analytics Hub | 2     | 56000
West   | CRM Pro       | 1     | 15000
(8 rows)
```

### The Golden Rule of GROUP BY

**Every column in your SELECT must either be in the GROUP BY clause or inside an aggregate function.** Break this rule and you'll get an error.

```sql
-- WRONG — rep_id is not in GROUP BY and not aggregated
SELECT region, rep_id, SUM(amount)
FROM sales
GROUP BY region;
-- ERROR: column "sales.rep_id" must appear in GROUP BY clause

-- CORRECT — add rep_id to GROUP BY
SELECT region, rep_id, SUM(amount) AS revenue
FROM sales
GROUP BY region, rep_id;

-- ALSO CORRECT — aggregate rep_id
SELECT region, COUNT(DISTINCT rep_id) AS num_reps, SUM(amount) AS revenue
FROM sales
GROUP BY region;
```

## HAVING — Filter After Grouping

WHERE filters individual rows *before* grouping. HAVING filters groups *after* aggregation.

```sql
-- Only regions with revenue over 30K
SELECT
    region,
    SUM(amount) AS total_revenue,
    COUNT(*)    AS num_deals
FROM sales
WHERE status = 'closed'
GROUP BY region
HAVING SUM(amount) > 30000
ORDER BY total_revenue DESC;
```

```text
# Output:
region | total_revenue | num_deals
-------|---------------|----------
West   | 71000         | 3
East   | 55500         | 3
North  | 40500         | 2
(3 rows)
```

### WHERE vs HAVING — Side by Side

```sql
-- WHERE filters ROWS before grouping
-- HAVING filters GROUPS after aggregation

-- "Show regions where closed deals over 10K average more than 20K"
SELECT
    region,
    AVG(amount) AS avg_deal
FROM sales
WHERE status = 'closed'       -- Step 1: Filter to closed deals only
  AND amount > 10000          -- Step 1: Filter to deals over 10K only
GROUP BY region               -- Step 2: Group the filtered rows
HAVING AVG(amount) > 20000    -- Step 3: Keep groups where average > 20K
ORDER BY avg_deal DESC;
```

```text
# Output:
region | avg_deal
-------|--------
West   | 23666.67
North  | 20250.00
(2 rows)
```

<div class="interview-tip">

**Interview question:** "What's the difference between WHERE and HAVING?" Expected answer: WHERE filters rows before GROUP BY runs. HAVING filters groups after aggregation. You can't use aggregate functions in WHERE — that's what HAVING is for. Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.

</div>

## Aggregation with JOINs

This is where it gets real. Combine GROUP BY with JOINs to answer business questions across multiple tables.

```sql
-- Total revenue by sales rep (joining reps table for names)
SELECT
    r.name          AS sales_rep,
    r.team,
    COUNT(*)        AS total_deals,
    SUM(s.amount)   AS total_revenue,
    AVG(s.amount)   AS avg_deal_size,
    MIN(s.sale_date) AS first_sale,
    MAX(s.sale_date) AS last_sale
FROM sales s
INNER JOIN reps r ON s.rep_id = r.rep_id
WHERE s.status = 'closed'
GROUP BY r.name, r.team
ORDER BY total_revenue DESC;
```

```text
# Output:
sales_rep    | team  | total_deals | total_revenue | avg_deal_size | first_sale | last_sale
-------------|-------|-------------|---------------|---------------|------------|----------
Sarah Chen   | Alpha | 4           | 66500         | 16625.00      | 2024-01-15 | 2024-06-01
James Wilson | Beta  | 3           | 55500         | 18500.00      | 2024-01-22 | 2024-06-15
Priya Patel  | Alpha | 3           | 68500         | 22833.33      | 2024-03-12 | 2024-05-20
(3 rows)
```

### Revenue by Product with Deal Count

```sql
SELECT
    product,
    COUNT(*)                          AS times_sold,
    SUM(amount)                       AS total_revenue,
    ROUND(AVG(amount), 2)             AS avg_price,
    ROUND(100.0 * SUM(amount) / (SELECT SUM(amount) FROM sales WHERE status = 'closed'), 1)
                                      AS pct_of_total
FROM sales
WHERE status = 'closed'
GROUP BY product
ORDER BY total_revenue DESC;
```

```text
# Output:
product       | times_sold | total_revenue | avg_price | pct_of_total
--------------|------------|---------------|-----------|-------------
Analytics Hub | 4          | 112000        | 28000.00  | 63.1
CRM Pro       | 5          | 70000         | 14000.00  | 39.4
Data Vault    | 1          | 8500          | 8500.00   | 4.8
(3 rows)
```

## DISTINCT with Aggregation

```sql
-- How many unique products did each rep sell?
SELECT
    r.name,
    COUNT(*)                AS total_deals,
    COUNT(DISTINCT s.product) AS unique_products
FROM sales s
INNER JOIN reps r ON s.rep_id = r.rep_id
WHERE s.status = 'closed'
GROUP BY r.name;
```

```text
# Output:
name         | total_deals | unique_products
-------------|-------------|----------------
Sarah Chen   | 4           | 3
James Wilson | 3           | 3
Priya Patel  | 3           | 2
(3 rows)
```

## Monthly Revenue Trend

A bread-and-butter analytics query:

```sql
-- Monthly revenue trend
SELECT
    DATE_TRUNC('month', sale_date) AS month,
    COUNT(*)                       AS deals,
    SUM(amount)                    AS revenue
FROM sales
WHERE status = 'closed'
GROUP BY DATE_TRUNC('month', sale_date)
ORDER BY month;
```

```text
# Output:
month      | deals | revenue
-----------|-------|--------
2024-01-01 | 2     | 27500
2024-02-01 | 2     | 43000
2024-03-01 | 2     | 36500
2024-04-01 | 1     | 12500
2024-05-01 | 1     | 28000
2024-06-01 | 2     | 43000
(6 rows)
```

**Note:** `DATE_TRUNC` works in PostgreSQL and Snowflake. In MySQL, use `DATE_FORMAT(sale_date, '%Y-%m-01')`. In SQL Server, use `DATETRUNC(month, sale_date)` or `FORMAT(sale_date, 'yyyy-MM')`.

## Putting It All Together

A complete sales performance dashboard query:

```sql
-- Sales team performance report: Q1 2024
SELECT
    r.name                        AS rep,
    r.team,
    COUNT(*)                      AS deals_closed,
    SUM(s.amount)                 AS revenue,
    ROUND(AVG(s.amount), 0)       AS avg_deal,
    MAX(s.amount)                 AS biggest_deal,
    COUNT(DISTINCT s.product)     AS products_sold,
    COUNT(DISTINCT s.region)      AS regions_covered
FROM sales s
INNER JOIN reps r ON s.rep_id = r.rep_id
WHERE s.status = 'closed'
  AND s.sale_date BETWEEN '2024-01-01' AND '2024-03-31'
GROUP BY r.name, r.team
HAVING SUM(s.amount) > 10000
ORDER BY revenue DESC;
```

```text
# Output:
rep          | team  | deals_closed | revenue | avg_deal | biggest_deal | products_sold | regions_covered
-------------|-------|--------------|---------|----------|--------------|---------------|----------------
Sarah Chen   | Alpha | 3            | 51500   | 17167    | 28000        | 3             | 2
James Wilson | Beta  | 2            | 27500   | 13750    | 15000        | 1             | 1
Priya Patel  | Alpha | 1            | 28000   | 28000    | 28000        | 1             | 1
(3 rows)
```

<div class="challenge">

### Challenge: Build a Product Sales Report

Write a query that:
1. Groups sales by **product**
2. Shows only **closed** deals
3. Calculates: total revenue, number of deals, average deal size, number of unique regions sold in
4. Only includes products with **more than 1 deal**
5. Sorted by total revenue descending

**Expected output:**
```text
product       | total_revenue | num_deals | avg_deal | regions
--------------|---------------|-----------|----------|--------
Analytics Hub | 112000        | 4         | 28000.00 | 3
CRM Pro       | 70000         | 5         | 14000.00 | 4
(2 rows)
```

**Hint:** Use GROUP BY + HAVING + COUNT(DISTINCT region).

</div>

## Common Interview Questions

### Q1: What is the difference between COUNT(*), COUNT(column), and COUNT(DISTINCT column)?

**A:** `COUNT(*)` counts all rows, including those with NULL values. `COUNT(column)` counts only rows where that column is not NULL. `COUNT(DISTINCT column)` counts unique non-NULL values. Example: if a table has 100 rows, `email` is NULL in 10 rows, and 15 emails are duplicates, then `COUNT(*)` = 100, `COUNT(email)` = 90, `COUNT(DISTINCT email)` = 75.

### Q2: Why can't you use an aggregate function in a WHERE clause?

**A:** Because WHERE filters rows *before* GROUP BY runs, so groups don't exist yet and aggregates can't be computed. Use HAVING to filter on aggregate results. The execution order is: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY. If you write `WHERE SUM(amount) > 1000`, the database hasn't computed any sums yet at that point, so it raises an error.

### Q3: Can you GROUP BY a column that's not in the SELECT?

**A:** Yes. You can group by any column in the table, even if you don't display it. For example, `SELECT COUNT(*) FROM orders GROUP BY customer_id` groups by customer but only shows the count. This is perfectly valid SQL and can be useful when you want aggregated results without exposing the grouping key.

### Q4: What happens if you use AVG with NULL values?

**A:** AVG ignores NULL values entirely — both in the sum and in the count. If you have values [100, 200, NULL, 400], `AVG` computes (100 + 200 + 400) / 3 = 233.33, not (100 + 200 + 0 + 400) / 4. If you want NULLs treated as zero, use `AVG(COALESCE(column, 0))`. This behavior is the same for SUM, MIN, and MAX — all aggregate functions skip NULLs.

### Q5: How do you calculate a percentage of total within each group?

**A:** Use a subquery or window function for the total. Subquery approach: `ROUND(100.0 * SUM(amount) / (SELECT SUM(amount) FROM sales), 1) AS pct_total`. Window function approach: `ROUND(100.0 * SUM(amount) / SUM(SUM(amount)) OVER (), 1)`. The window function version is more efficient because it avoids scanning the table twice. Always multiply by 100.0 (not 100) to force float division.
