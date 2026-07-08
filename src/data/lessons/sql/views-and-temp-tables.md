---
title: "Views & Temp Tables — Organize Complex Queries"
description: "Create views and temp tables to simplify complex analytics, improve reusability, and build data layers."
category: "sql"
order: 108
phase: 2
tags: ["sql", "views", "temp-tables", "materialized-views"]
publishedDate: 2025-03-08
prevSlug: "union-intersect"
nextSlug: "query-optimization"
seoTitle: "SQL Views and Temp Tables Tutorial | Datalogify"
seoDescription: "Master SQL views, temp tables, materialized views, and table variables for organized analytics."
---

## Why This Matters

Your manager asks for a "customer lifetime value report." That query is 80 lines long with 4 CTEs and 3 joins. Next week she asks for the same thing sliced by region. Then by product. Are you copy-pasting 80 lines each time? No. You save it as a view. Views and temp tables are how analysts organize complex logic, avoid repetition, and build reusable data layers that the whole team can use.

## The Tables We're Working With

```sql
-- employees table
-- | emp_id | name           | department  | salary | hire_date  | manager_id |
-- |--------|----------------|-------------|--------|------------|------------|
-- | 1      | Sarah Chen     | Analytics   | 95000  | 2022-01-15 | 5          |
-- | 2      | James Wilson   | Engineering | 115000 | 2020-06-01 | 5          |
-- | 3      | Priya Patel    | Analytics   | 88000  | 2023-03-10 | 1          |
-- | 4      | Marcus Brown   | Sales       | 72000  | 2023-05-20 | 6          |
-- | 5      | Lisa Zhang     | Engineering | 108000 | 2019-08-20 | NULL       |
-- | 6      | David Kim      | Sales       | 82000  | 2021-11-01 | 5          |
-- | 7      | Anna Kowalski  | Marketing   | 68000  | 2024-02-14 | 6          |
-- | 8      | Tom Rivera     | Marketing   | 78000  | 2023-08-05 | 6          |

-- orders table
-- | order_id | customer_id | product       | amount | order_date | status    |
-- |----------|-------------|---------------|--------|------------|-----------|
-- | 1001     | 201         | CRM Pro       | 15000  | 2024-01-10 | completed |
-- | 1002     | 202         | Analytics Hub | 28000  | 2024-01-18 | completed |
-- | 1003     | 203         | Data Vault    | 8500   | 2024-02-05 | completed |
-- | 1004     | 201         | Analytics Hub | 28000  | 2024-02-22 | completed |
-- | 1005     | 204         | CRM Pro       | 15000  | 2024-03-01 | pending   |
-- | 1006     | 202         | CRM Pro       | 12500  | 2024-03-14 | completed |
-- | 1007     | 205         | Data Vault    | 8500   | 2024-04-02 | cancelled |
-- | 1008     | 203         | ML Studio     | 35000  | 2024-04-19 | completed |
-- | 1009     | 206         | Cloud Backup  | 3200   | 2024-05-08 | completed |
-- | 1010     | 204         | Analytics Hub | 28000  | 2024-05-25 | pending   |

-- customers table
-- | customer_id | company_name     | industry    | region |
-- |-------------|------------------|-------------|--------|
-- | 201         | Acme Corp        | Technology  | East   |
-- | 202         | Beta Industries  | Finance     | West   |
-- | 203         | Gamma Solutions  | Healthcare  | East   |
-- | 204         | Delta Systems    | Technology  | South  |
-- | 205         | Epsilon Labs     | Healthcare  | North  |
-- | 206         | Zeta Analytics   | Finance     | West   |
```

## CREATE VIEW — Save a Query as a Virtual Table

A view is a saved query that acts like a table. It doesn't store data — it runs the query every time you SELECT from it.

```sql
CREATE VIEW customer_summary AS
SELECT c.customer_id,
       c.company_name,
       c.industry,
       c.region,
       COUNT(o.order_id) AS total_orders,
       SUM(o.amount) AS total_revenue,
       AVG(o.amount) AS avg_order_value,
       MAX(o.order_date) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.company_name, c.industry, c.region;
```

```text
CREATE VIEW
```

Now use it like a table:

```sql
SELECT * FROM customer_summary
ORDER BY total_revenue DESC;
```

```text
customer_id | company_name    | industry   | region | total_orders | total_revenue | avg_order_value | last_order_date
------------|-----------------|------------|--------|--------------|---------------|-----------------|----------------
203         | Gamma Solutions | Healthcare | East   | 2            | 43500         | 21750.00        | 2024-04-19
201         | Acme Corp       | Technology | East   | 2            | 43000         | 21500.00        | 2024-02-22
202         | Beta Industries | Finance    | West   | 2            | 40500         | 20250.00        | 2024-03-14
206         | Zeta Analytics  | Finance    | West   | 1            | 3200          | 3200.00         | 2024-05-08
```

```sql
-- Now the "slice by region" request is one line
SELECT region,
       SUM(total_revenue) AS region_revenue,
       AVG(avg_order_value) AS avg_aov
FROM customer_summary
GROUP BY region
ORDER BY region_revenue DESC;
```

```text
region | region_revenue | avg_aov
-------|----------------|--------
East   | 86500          | 21625.00
West   | 43700          | 11725.00
```

<div class="interview-tip">

**Views don't store data** — they re-run the underlying query every time. A view on a slow query will be slow every time you SELECT from it. If performance matters, consider a materialized view or temp table instead.

</div>

## CREATE OR REPLACE VIEW — Update an Existing View

```sql
-- Add a customer tier to the existing view
CREATE OR REPLACE VIEW customer_summary AS
SELECT c.customer_id,
       c.company_name,
       c.industry,
       c.region,
       COUNT(o.order_id) AS total_orders,
       SUM(o.amount) AS total_revenue,
       AVG(o.amount) AS avg_order_value,
       MAX(o.order_date) AS last_order_date,
       CASE
           WHEN SUM(o.amount) >= 40000 THEN 'Enterprise'
           WHEN SUM(o.amount) >= 10000 THEN 'Mid-Market'
           ELSE 'SMB'
       END AS customer_tier
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.company_name, c.industry, c.region;
```

```text
CREATE OR REPLACE VIEW
```

```sql
SELECT company_name, customer_tier, total_revenue
FROM customer_summary
ORDER BY total_revenue DESC;
```

```text
company_name    | customer_tier | total_revenue
----------------|---------------|-------------
Gamma Solutions | Enterprise    | 43500
Acme Corp       | Enterprise    | 43000
Beta Industries | Enterprise    | 40500
Zeta Analytics  | SMB           | 3200
```

## DROP VIEW — Remove a View

```sql
-- Remove the view
DROP VIEW customer_summary;

-- Safe version: won't error if view doesn't exist
DROP VIEW IF EXISTS customer_summary;
```

```text
DROP VIEW
```

## Views for Access Control

Views are commonly used to restrict what users can see:

```sql
-- HR can see everything
CREATE VIEW employee_full AS
SELECT * FROM employees;

-- Managers see their team but not salaries
CREATE VIEW employee_directory AS
SELECT emp_id, name, department, hire_date
FROM employees;

-- Finance sees salary data without names
CREATE VIEW salary_bands AS
SELECT department,
       COUNT(*) AS headcount,
       AVG(salary) AS avg_salary,
       MIN(salary) AS min_salary,
       MAX(salary) AS max_salary
FROM employees
GROUP BY department;
```

```sql
SELECT * FROM salary_bands ORDER BY avg_salary DESC;
```

```text
department  | headcount | avg_salary | min_salary | max_salary
------------|-----------|------------|------------|----------
Engineering | 2         | 111500     | 108000     | 115000
Analytics   | 2         | 91500      | 88000      | 95000
Sales       | 2         | 77000      | 72000      | 82000
Marketing   | 2         | 73000      | 68000      | 78000
```

## Temporary Tables — Store Intermediate Results

Temp tables actually store data. They exist only for your session and are automatically dropped when you disconnect.

```sql
-- PostgreSQL / MySQL
CREATE TEMPORARY TABLE top_customers AS
SELECT c.customer_id,
       c.company_name,
       SUM(o.amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.company_name
HAVING SUM(o.amount) > 20000;
```

```text
SELECT 3
```

```sql
-- SQL Server syntax
-- SELECT c.customer_id, c.company_name, SUM(o.amount) AS total_spent
-- INTO #top_customers
-- FROM customers c
-- JOIN orders o ON c.customer_id = o.customer_id
-- WHERE o.status = 'completed'
-- GROUP BY c.customer_id, c.company_name
-- HAVING SUM(o.amount) > 20000;
```

```sql
SELECT * FROM top_customers;
```

```text
customer_id | company_name    | total_spent
------------|-----------------|------------
201         | Acme Corp       | 43000
202         | Beta Industries | 40500
203         | Gamma Solutions | 43500
```

### Use Temp Tables for Multi-Step Analysis

```sql
-- Step 1: Build a temp table with order metrics
CREATE TEMPORARY TABLE order_metrics AS
SELECT customer_id,
       COUNT(*) AS order_count,
       SUM(amount) AS total_amount,
       MIN(order_date) AS first_order,
       MAX(order_date) AS last_order
FROM orders
WHERE status = 'completed'
GROUP BY customer_id;

-- Step 2: Join with customer data and classify
SELECT c.company_name,
       c.industry,
       om.order_count,
       om.total_amount,
       om.last_order - om.first_order AS customer_lifetime_days,
       CASE
           WHEN om.order_count >= 3 THEN 'Loyal'
           WHEN om.order_count = 2 THEN 'Returning'
           ELSE 'One-Time'
       END AS loyalty_tier
FROM customers c
JOIN order_metrics om ON c.customer_id = om.customer_id
ORDER BY om.total_amount DESC;
```

```text
company_name    | industry   | order_count | total_amount | customer_lifetime_days | loyalty_tier
----------------|------------|-------------|--------------|------------------------|-------------
Gamma Solutions | Healthcare | 2           | 43500        | 73                     | Returning
Acme Corp       | Technology | 2           | 43000        | 43                     | Returning
Beta Industries | Finance    | 2           | 40500        | 55                     | Returning
Zeta Analytics  | Finance    | 1           | 3200         | 0                      | One-Time
```

## Views vs Temp Tables vs CTEs — When to Use Each

```sql
-- CTE: one-time, within a single query
WITH monthly_revenue AS (
    SELECT DATE_TRUNC('month', order_date) AS month,
           SUM(amount) AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT * FROM monthly_revenue ORDER BY month;
```

```text
month               | revenue
--------------------|--------
2024-01-01 00:00:00 | 43000
2024-02-01 00:00:00 | 36500
2024-03-01 00:00:00 | 12500
2024-04-01 00:00:00 | 35000
2024-05-01 00:00:00 | 3200
```

| Feature | CTE | View | Temp Table | Materialized View |
|---------|-----|------|------------|-------------------|
| Persists after query | No | Yes | Session only | Yes |
| Stores data | No | No | Yes | Yes |
| Reusable across queries | No | Yes | Yes (same session) | Yes |
| Auto-refreshes | N/A | Yes (every query) | No | No (manual refresh) |
| Best for | Single complex query | Reusable logic, access control | Multi-step analysis | Slow queries, dashboards |

## Materialized Views — Cached Query Results

A materialized view stores the query result physically. It's like a view that only runs once, then serves cached data until you refresh it.

```sql
-- PostgreSQL
CREATE MATERIALIZED VIEW monthly_dashboard AS
SELECT DATE_TRUNC('month', o.order_date) AS month,
       c.region,
       COUNT(o.order_id) AS order_count,
       SUM(o.amount) AS revenue,
       COUNT(DISTINCT o.customer_id) AS unique_customers
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed'
GROUP BY DATE_TRUNC('month', o.order_date), c.region;
```

```text
SELECT 7
```

```sql
SELECT * FROM monthly_dashboard
ORDER BY month, region;
```

```text
month               | region | order_count | revenue | unique_customers
--------------------|--------|-------------|---------|----------------
2024-01-01 00:00:00 | East   | 1           | 15000   | 1
2024-01-01 00:00:00 | West   | 1           | 28000   | 1
2024-02-01 00:00:00 | East   | 2           | 36500   | 2
2024-03-01 00:00:00 | West   | 1           | 12500   | 1
2024-04-01 00:00:00 | East   | 1           | 35000   | 1
2024-05-01 00:00:00 | West   | 1           | 3200    | 1
```

```sql
-- Refresh when source data changes
REFRESH MATERIALIZED VIEW monthly_dashboard;

-- Refresh concurrently (doesn't lock reads — requires unique index)
-- CREATE UNIQUE INDEX ON monthly_dashboard (month, region);
-- REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_dashboard;
```

```text
REFRESH MATERIALIZED VIEW
```

<div class="interview-tip">

**When to use materialized views**: Dashboard queries that run frequently on large tables, summary tables for reporting, and any query where stale-by-minutes data is acceptable. Refresh them on a schedule (e.g., every hour, every night). Most BI tools query materialized views, not raw tables.

</div>

## Common View Patterns in Analytics

### Pattern 1: Base Fact View

```sql
-- Clean, filtered fact table that everyone uses
CREATE VIEW fact_orders AS
SELECT order_id,
       customer_id,
       product,
       amount,
       order_date,
       EXTRACT(YEAR FROM order_date) AS order_year,
       EXTRACT(QUARTER FROM order_date) AS order_quarter,
       EXTRACT(MONTH FROM order_date) AS order_month
FROM orders
WHERE status = 'completed';
```

```sql
SELECT order_quarter, SUM(amount) AS quarterly_revenue
FROM fact_orders
WHERE order_year = 2024
GROUP BY order_quarter
ORDER BY order_quarter;
```

```text
order_quarter | quarterly_revenue
--------------|-----------------
1             | 91500
2             | 38200
```

### Pattern 2: Department Summary View

```sql
CREATE VIEW dept_summary AS
SELECT department,
       COUNT(*) AS headcount,
       ROUND(AVG(salary), 0) AS avg_salary,
       MIN(hire_date) AS earliest_hire,
       MAX(hire_date) AS latest_hire
FROM employees
GROUP BY department;
```

```sql
SELECT * FROM dept_summary ORDER BY headcount DESC;
```

```text
department  | headcount | avg_salary | earliest_hire | latest_hire
------------|-----------|------------|---------------|------------
Analytics   | 2         | 91500      | 2022-01-15    | 2023-03-10
Engineering | 2         | 111500     | 2019-08-20    | 2020-06-01
Marketing   | 2         | 73000      | 2023-08-05    | 2024-02-14
Sales       | 2         | 77000      | 2021-11-01    | 2023-05-20
```

## Where This Is Used in Real Jobs

| Scenario | Tool | Why |
|----------|------|-----|
| Dashboard data layer | Materialized Views | Pre-aggregate for fast dashboards |
| Reusable business logic | Views | Consistent definitions (e.g., "active customer") |
| Data access control | Views | Show Finance salary data, hide names |
| Multi-step ETL | Temp Tables | Break complex transforms into stages |
| Ad-hoc exploration | CTEs / Temp Tables | Build up analysis iteratively |
| Data warehouse layers | Views | staging → cleaned → business-ready |

<div class="challenge">

### Challenge 1: Customer 360 View
Create a view called `customer_360` that shows each customer's company_name, industry, region, total orders, total revenue, average order value, first order date, last order date, and a loyalty tier (Enterprise: >$40K, Mid-Market: $10K-$40K, SMB: <$10K).

### Challenge 2: Multi-Step Analysis with Temp Tables
Using temp tables, build a two-step analysis: (1) create a temp table with each department's average salary, (2) join it back to employees to show each person's name, salary, department average, and whether they're above or below their department average.

### Challenge 3: Monthly Dashboard View
Create a materialized view called `monthly_kpis` that shows month, total orders, total revenue, unique customers, average order value, and month-over-month revenue change (using LAG).

</div>

## Common Interview Questions

### Q1: What is the difference between a view and a table?

**Answer:** A table physically stores data on disk. A view is a saved SQL query — it stores only the query definition, not data. When you SELECT from a view, the database runs the underlying query in real-time. Views don't take up storage (except materialized views), but they can be slower if the underlying query is complex. Views are useful for reusability, access control, and simplifying complex joins.

### Q2: What is a materialized view and when would you use one?

**Answer:** A materialized view stores the query result physically, like a cached table. Unlike a regular view, it doesn't re-run the query on each SELECT — it serves the precomputed result. You refresh it manually or on a schedule. Use materialized views for: (1) slow aggregate queries that dashboards hit frequently, (2) summary tables for reporting, (3) any scenario where slightly stale data is acceptable. PostgreSQL, Oracle, and Snowflake support them natively.

### Q3: When would you use a temp table instead of a CTE?

**Answer:** Use a temp table when: (1) you need to reference the result in multiple separate queries (CTEs only live within one query), (2) the intermediate result is large and you want it indexed, (3) you're building a multi-step analysis where each step depends on the previous one, (4) you need to inspect intermediate results for debugging. CTEs are better for single-query readability. In practice, analysts use temp tables for ad-hoc exploration and CTEs for production queries.

### Q4: Can you update data through a view?

**Answer:** Simple views (single table, no aggregation, no DISTINCT, no GROUP BY) are usually updatable — you can INSERT, UPDATE, DELETE through them. Complex views (joins, aggregations, UNION) are not updatable. The rules vary by database. In practice, most analytics views are read-only because they involve joins and aggregations. If you need to update through a view, keep it simple and consider using INSTEAD OF triggers for complex cases.

### Q5: How do you organize views in a data warehouse?

**Answer:** The standard pattern is layered: (1) **Raw/Staging layer** — views over raw tables with minimal transformation. (2) **Cleaned layer** — views that handle NULLs, data types, deduplication. (3) **Business layer** — views with business logic (customer tiers, revenue calculations). (4) **Reporting layer** — pre-aggregated views for dashboards. Each layer references the one below it. This is the foundation of tools like dbt.
