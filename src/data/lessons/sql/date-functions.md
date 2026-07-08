---
title: "SQL Date Functions — Time-Based Analysis"
description: "Extract, calculate, and format dates in SQL — essential for reporting periods, aging analysis, and cohorts."
category: "sql"
order: 105
phase: 2
tags: ["sql", "date-functions", "datepart", "datediff"]
publishedDate: 2025-03-05
prevSlug: "string-functions"
nextSlug: "null-handling"
seoTitle: "SQL Date Functions Tutorial | Datalogify"
seoDescription: "Master SQL date functions — DATEPART, DATEDIFF, DATEADD, EXTRACT, date formatting for analytics."
---

## Why This Matters

"Show me Q3 revenue." "How many days since each customer's last purchase?" "Group users by signup month." "What's our fiscal year performance?" — time is the backbone of business analytics. You cannot build a single useful report without dates.

## The Tables We're Working With

```sql
-- orders table
-- | order_id | customer_id | order_date          | amount  | status    |
-- |----------|-------------|---------------------|---------|-----------|
-- | 1        | 1001        | 2024-01-15 09:30:00 | 1250.00 | completed |
-- | 2        | 1002        | 2024-02-22 14:15:00 | 890.00  | completed |
-- | 3        | 1001        | 2024-03-08 11:45:00 | 2100.00 | completed |
-- | 4        | 1003        | 2024-04-19 16:00:00 | 450.00  | completed |
-- | 5        | 1002        | 2024-05-30 10:20:00 | 1800.00 | completed |
-- | 6        | 1004        | 2024-06-12 08:45:00 | 3200.00 | completed |
-- | 7        | 1001        | 2024-07-25 13:10:00 | 950.00  | completed |
-- | 8        | 1003        | 2024-08-14 15:30:00 | 1675.00 | completed |
-- | 9        | 1005        | 2024-09-05 09:00:00 | 2400.00 | completed |
-- | 10       | 1002        | 2024-10-18 11:30:00 | 1100.00 | completed |

-- employees table
-- | emp_id | name           | department | hire_date  | birth_date |
-- |--------|----------------|------------|------------|------------|
-- | 1      | Sarah Chen     | Sales      | 2022-01-15 | 1992-06-20 |
-- | 2      | James Wilson   | Sales      | 2022-06-01 | 1988-11-03 |
-- | 3      | Priya Patel    | Marketing  | 2023-03-10 | 1995-02-14 |
-- | 4      | Mike Johnson   | Engineering| 2021-08-20 | 1990-09-28 |
-- | 5      | Lisa Park      | Marketing  | 2024-01-08 | 1997-04-05 |
```

## Getting the Current Date and Time

Every database has its own function. Know your dialect:

```sql
-- PostgreSQL
SELECT CURRENT_DATE,           -- 2024-10-27 (date only)
       CURRENT_TIMESTAMP,      -- 2024-10-27 14:30:15.123456+00
       NOW();                  -- 2024-10-27 14:30:15.123456+00

-- MySQL
SELECT CURDATE(),              -- 2024-10-27
       NOW(),                  -- 2024-10-27 14:30:15
       CURRENT_TIMESTAMP;      -- 2024-10-27 14:30:15

-- SQL Server
SELECT GETDATE(),              -- 2024-10-27 14:30:15.123
       SYSDATETIME(),          -- 2024-10-27 14:30:15.1234567
       CAST(GETDATE() AS DATE); -- 2024-10-27
```

```text
-- PostgreSQL output:
current_date | current_timestamp              | now
-------------|--------------------------------|-------------------------------
2024-10-27   | 2024-10-27 14:30:15.123456+00  | 2024-10-27 14:30:15.123456+00
```

## EXTRACT / DATEPART — Pull Out Date Components

```sql
-- PostgreSQL / MySQL: EXTRACT()
SELECT order_date,
       EXTRACT(YEAR FROM order_date)    AS order_year,
       EXTRACT(MONTH FROM order_date)   AS order_month,
       EXTRACT(DAY FROM order_date)     AS order_day,
       EXTRACT(DOW FROM order_date)     AS day_of_week,
       EXTRACT(QUARTER FROM order_date) AS quarter
FROM orders;

-- SQL Server: DATEPART()
-- SELECT order_date,
--        DATEPART(YEAR, order_date) AS order_year,
--        DATEPART(MONTH, order_date) AS order_month,
--        DATEPART(DAY, order_date) AS order_day,
--        DATEPART(WEEKDAY, order_date) AS day_of_week,
--        DATEPART(QUARTER, order_date) AS quarter
-- FROM orders;
```

```text
order_date          | order_year | order_month | order_day | day_of_week | quarter
--------------------|------------|-------------|-----------|-------------|--------
2024-01-15 09:30:00 | 2024       | 1           | 15        | 1           | 1
2024-02-22 14:15:00 | 2024       | 2           | 22        | 4           | 1
2024-03-08 11:45:00 | 2024       | 3           | 8         | 5           | 1
2024-04-19 16:00:00 | 2024       | 4           | 19        | 5           | 2
2024-05-30 10:20:00 | 2024       | 5           | 30        | 4           | 2
2024-06-12 08:45:00 | 2024       | 6           | 12        | 3           | 2
```

### Group by Month — The Most Common Date Query

```sql
SELECT EXTRACT(YEAR FROM order_date) AS yr,
       EXTRACT(MONTH FROM order_date) AS mo,
       COUNT(*) AS order_count,
       SUM(amount) AS total_revenue
FROM orders
GROUP BY EXTRACT(YEAR FROM order_date),
         EXTRACT(MONTH FROM order_date)
ORDER BY yr, mo;
```

```text
yr   | mo | order_count | total_revenue
-----|----|-------------|-------------
2024 | 1  | 1           | 1250.00
2024 | 2  | 1           | 890.00
2024 | 3  | 1           | 2100.00
2024 | 4  | 1           | 450.00
2024 | 5  | 1           | 1800.00
2024 | 6  | 1           | 3200.00
2024 | 7  | 1           | 950.00
2024 | 8  | 1           | 1675.00
2024 | 9  | 1           | 2400.00
2024 | 10 | 1           | 1100.00
```

## DATE_TRUNC — Truncate to a Period (PostgreSQL/Snowflake)

DATE_TRUNC is cleaner than EXTRACT for grouping. It returns an actual date instead of separate numbers.

```sql
-- PostgreSQL / Snowflake
SELECT DATE_TRUNC('month', order_date) AS order_month,
       COUNT(*) AS order_count,
       SUM(amount) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY order_month;
```

```text
order_month         | order_count | revenue
--------------------|-------------|--------
2024-01-01 00:00:00 | 1           | 1250.00
2024-02-01 00:00:00 | 1           | 890.00
2024-03-01 00:00:00 | 1           | 2100.00
2024-04-01 00:00:00 | 1           | 450.00
...
```

```sql
-- Truncate to quarter
SELECT DATE_TRUNC('quarter', order_date) AS quarter,
       SUM(amount) AS quarterly_revenue
FROM orders
GROUP BY DATE_TRUNC('quarter', order_date)
ORDER BY quarter;
```

```text
quarter             | quarterly_revenue
--------------------|------------------
2024-01-01 00:00:00 | 4240.00
2024-04-01 00:00:00 | 5450.00
2024-07-01 00:00:00 | 5025.00
2024-10-01 00:00:00 | 1100.00
```

## DATEDIFF — Time Between Two Dates

```sql
-- PostgreSQL: subtract dates directly (returns integer days)
SELECT customer_id,
       MIN(order_date) AS first_order,
       MAX(order_date) AS last_order,
       MAX(order_date)::date - MIN(order_date)::date AS days_between
FROM orders
GROUP BY customer_id;

-- SQL Server: DATEDIFF(unit, start, end)
-- SELECT customer_id,
--        MIN(order_date) AS first_order,
--        MAX(order_date) AS last_order,
--        DATEDIFF(DAY, MIN(order_date), MAX(order_date)) AS days_between
-- FROM orders
-- GROUP BY customer_id;

-- MySQL: DATEDIFF(end, start)
-- SELECT customer_id,
--        MIN(order_date) AS first_order,
--        MAX(order_date) AS last_order,
--        DATEDIFF(MAX(order_date), MIN(order_date)) AS days_between
-- FROM orders
-- GROUP BY customer_id;
```

```text
customer_id | first_order         | last_order          | days_between
------------|---------------------|---------------------|-------------
1001        | 2024-01-15 09:30:00 | 2024-07-25 13:10:00 | 192
1002        | 2024-02-22 14:15:00 | 2024-10-18 11:30:00 | 239
1003        | 2024-04-19 16:00:00 | 2024-08-14 15:30:00 | 117
1004        | 2024-06-12 08:45:00 | 2024-06-12 08:45:00 | 0
1005        | 2024-09-05 09:00:00 | 2024-09-05 09:00:00 | 0
```

## DATEADD / DATE_ADD — Adding Time to Dates

```sql
-- PostgreSQL: use INTERVAL
SELECT order_date,
       order_date + INTERVAL '30 days' AS plus_30_days,
       order_date + INTERVAL '1 month' AS plus_1_month,
       order_date - INTERVAL '1 year'  AS minus_1_year
FROM orders
WHERE order_id = 1;

-- SQL Server: DATEADD(unit, number, date)
-- SELECT order_date,
--        DATEADD(DAY, 30, order_date) AS plus_30_days,
--        DATEADD(MONTH, 1, order_date) AS plus_1_month,
--        DATEADD(YEAR, -1, order_date) AS minus_1_year
-- FROM orders WHERE order_id = 1;

-- MySQL: DATE_ADD(date, INTERVAL n unit)
-- SELECT order_date,
--        DATE_ADD(order_date, INTERVAL 30 DAY) AS plus_30_days,
--        DATE_ADD(order_date, INTERVAL 1 MONTH) AS plus_1_month,
--        DATE_SUB(order_date, INTERVAL 1 YEAR) AS minus_1_year
-- FROM orders WHERE order_id = 1;
```

```text
order_date          | plus_30_days        | plus_1_month        | minus_1_year
--------------------|---------------------|---------------------|--------------------
2024-01-15 09:30:00 | 2024-02-14 09:30:00 | 2024-02-15 09:30:00 | 2023-01-15 09:30:00
```

<div class="interview-tip">

**Tricky Difference**: Adding 30 days vs adding 1 month gives different results. Jan 15 + 30 days = Feb 14. Jan 15 + 1 month = Feb 15. For financial reporting, use month intervals. For SLA deadlines, use day intervals.

</div>

## Aging Analysis — Days Since an Event

```sql
-- How many days since each customer's last order?
SELECT customer_id,
       MAX(order_date)::date AS last_order_date,
       CURRENT_DATE - MAX(order_date)::date AS days_since_last_order,
       CASE
           WHEN CURRENT_DATE - MAX(order_date)::date <= 30  THEN 'Active'
           WHEN CURRENT_DATE - MAX(order_date)::date <= 90  THEN 'At Risk'
           WHEN CURRENT_DATE - MAX(order_date)::date <= 180 THEN 'Lapsing'
           ELSE 'Churned'
       END AS customer_status
FROM orders
GROUP BY customer_id;
```

```text
customer_id | last_order_date | days_since_last_order | customer_status
------------|-----------------|----------------------|----------------
1001        | 2024-07-25      | 94                   | At Risk
1002        | 2024-10-18      | 9                    | Active
1003        | 2024-08-14      | 74                   | At Risk
1004        | 2024-06-12      | 137                  | Lapsing
1005        | 2024-09-05      | 52                   | At Risk
```

### Employee Tenure Calculation

```sql
SELECT name, hire_date,
       CURRENT_DATE - hire_date AS days_employed,
       EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) AS years_tenure,
       EXTRACT(MONTH FROM AGE(CURRENT_DATE, hire_date)) AS months_remainder
FROM employees;
```

```text
name           | hire_date  | days_employed | years_tenure | months_remainder
---------------|------------|---------------|--------------|----------------
Sarah Chen     | 2022-01-15 | 1016          | 2            | 9
James Wilson   | 2022-06-01 | 879           | 2            | 4
Priya Patel    | 2023-03-10 | 597           | 1            | 7
Mike Johnson   | 2021-08-20 | 1164          | 3            | 2
Lisa Park      | 2024-01-08 | 293           | 0            | 9
```

## Fiscal Year / Quarter Calculations

Most companies don't use calendar years. A fiscal year starting in April:

```sql
-- Fiscal year starts April 1
SELECT order_date,
       CASE
           WHEN EXTRACT(MONTH FROM order_date) >= 4
           THEN EXTRACT(YEAR FROM order_date)
           ELSE EXTRACT(YEAR FROM order_date) - 1
       END AS fiscal_year,
       CASE
           WHEN EXTRACT(MONTH FROM order_date) BETWEEN 4 AND 6  THEN 'Q1'
           WHEN EXTRACT(MONTH FROM order_date) BETWEEN 7 AND 9  THEN 'Q2'
           WHEN EXTRACT(MONTH FROM order_date) BETWEEN 10 AND 12 THEN 'Q3'
           ELSE 'Q4'
       END AS fiscal_quarter,
       amount
FROM orders;
```

```text
order_date          | fiscal_year | fiscal_quarter | amount
--------------------|-------------|----------------|-------
2024-01-15 09:30:00 | 2023        | Q4             | 1250.00
2024-02-22 14:15:00 | 2023        | Q4             | 890.00
2024-03-08 11:45:00 | 2023        | Q4             | 2100.00
2024-04-19 16:00:00 | 2024        | Q1             | 450.00
2024-05-30 10:20:00 | 2024        | Q1             | 1800.00
2024-06-12 08:45:00 | 2024        | Q1             | 3200.00
2024-07-25 13:10:00 | 2024        | Q2             | 950.00
2024-08-14 15:30:00 | 2024        | Q2             | 1675.00
2024-09-05 09:00:00 | 2024        | Q2             | 2400.00
2024-10-18 11:30:00 | 2024        | Q3             | 1100.00
```

## Cohort Grouping — Group Users by Signup Month

```sql
-- Group customers by the month they first ordered
WITH cohorts AS (
    SELECT customer_id,
           DATE_TRUNC('month', MIN(order_date)) AS cohort_month
    FROM orders
    GROUP BY customer_id
)
SELECT c.cohort_month,
       COUNT(DISTINCT c.customer_id) AS cohort_size,
       COUNT(o.order_id) AS total_orders,
       ROUND(AVG(o.amount), 2) AS avg_order_value
FROM cohorts c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.cohort_month
ORDER BY c.cohort_month;
```

```text
cohort_month        | cohort_size | total_orders | avg_order_value
--------------------|-------------|--------------|----------------
2024-01-01 00:00:00 | 1           | 3            | 1433.33
2024-02-01 00:00:00 | 1           | 3            | 1263.33
2024-04-01 00:00:00 | 1           | 2            | 1062.50
2024-06-01 00:00:00 | 1           | 1            | 3200.00
2024-09-01 00:00:00 | 1           | 1            | 2400.00
```

## Day-of-Week Analysis

```sql
SELECT
    CASE EXTRACT(DOW FROM order_date)
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END AS day_name,
    COUNT(*) AS order_count,
    ROUND(AVG(amount), 2) AS avg_amount
FROM orders
GROUP BY EXTRACT(DOW FROM order_date)
ORDER BY EXTRACT(DOW FROM order_date);
```

```text
day_name   | order_count | avg_amount
-----------|-------------|----------
Monday     | 2           | 1100.00
Wednesday  | 2           | 2045.00
Thursday   | 3           | 1113.33
Friday     | 3           | 2133.33
```

## Where This Is Used in Real Jobs

| Scenario | Functions | Why |
|----------|----------|-----|
| Monthly reports | DATE_TRUNC, EXTRACT | Group data by period |
| Customer aging | DATEDIFF, CURRENT_DATE | Time since last activity |
| Fiscal quarters | CASE + EXTRACT | Non-calendar year reporting |
| Cohort analysis | DATE_TRUNC + MIN | Group by acquisition period |
| SLA tracking | DATEADD, DATEDIFF | Time until deadlines |
| Tenure analysis | AGE, DATEDIFF | Employee/subscription duration |

<div class="challenge">

### Challenge 1: Quarterly Revenue Report
Calculate total revenue by calendar quarter. Show the quarter label (Q1 2024, Q2 2024, etc.), order count, and total revenue.

### Challenge 2: Customer Aging
For each customer, calculate days since their last order. Categorize them as Active (0-30 days), Warm (31-60), Cool (61-90), Cold (91-180), or Churned (180+).

### Challenge 3: Fiscal Year Summary
Assuming a fiscal year starting July 1, calculate total revenue by fiscal year and fiscal quarter. Show the fiscal year, fiscal quarter, and total amount.

</div>

## Common Interview Questions

### Q1: How do you group data by month in SQL?

**Answer:** Two approaches: (1) Use DATE_TRUNC('month', date_column) in PostgreSQL/Snowflake — this returns the first day of the month. (2) Use EXTRACT(YEAR FROM date_column) and EXTRACT(MONTH FROM date_column) — works in all databases. GROUP BY and ORDER BY the same expression. DATE_TRUNC is preferred because it returns a single sortable value.

### Q2: What is the difference between DATEDIFF and subtracting dates?

**Answer:** In PostgreSQL, subtracting dates directly (`date1 - date2`) returns an integer number of days. DATEDIFF (SQL Server, MySQL) accepts a unit parameter (DAY, MONTH, YEAR) and returns the difference in that unit. DATEDIFF(MONTH, ...) counts month boundaries crossed, not 30-day periods — so Jan 31 to Feb 1 = 1 month even though it's only 1 day.

### Q3: How do you calculate someone's age in SQL?

**Answer:** PostgreSQL: use AGE(CURRENT_DATE, birth_date) which returns an interval, then EXTRACT(YEAR FROM AGE(...)). SQL Server: `DATEDIFF(YEAR, birth_date, GETDATE())` but this overcounts if the birthday hasn't occurred yet this year — adjust with a CASE statement. MySQL: `TIMESTAMPDIFF(YEAR, birth_date, CURDATE())` handles this correctly.

### Q4: How would you build a cohort analysis in SQL?

**Answer:** (1) Find each user's first action date: `MIN(event_date)` grouped by user_id. (2) Truncate to month with DATE_TRUNC — this is the cohort month. (3) Join back to all events and calculate the month offset from cohort month. (4) Group by cohort month and offset month, counting active users at each point.

### Q5: What is DATE_TRUNC and why is it useful for analytics?

**Answer:** DATE_TRUNC truncates a timestamp to a specified precision (day, week, month, quarter, year). It returns an actual date value, making it easier to group and sort than separate EXTRACT calls. `DATE_TRUNC('month', '2024-03-15')` returns '2024-03-01'. It's the go-to for time-series aggregation in PostgreSQL and Snowflake. SQL Server equivalent is `DATETRUNC` (added in 2022) or `DATEFROMPARTS(YEAR(d), MONTH(d), 1)`.
