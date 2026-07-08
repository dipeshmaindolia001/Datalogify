---
title: "Window Functions — Running Totals & Moving Averages"
description: "Calculate running totals, moving averages, and cumulative stats without GROUP BY — analytics superpowers."
category: "sql"
order: 102
phase: 2
tags: ["sql", "window-functions", "running-total", "moving-average"]
publishedDate: 2025-03-02
prevSlug: "window-functions-ranking"
nextSlug: "window-functions-lag-lead"
seoTitle: "SQL Running Totals & Moving Averages | Datalogify"
seoDescription: "Calculate running totals, moving averages, cumulative sums with SQL window functions."
---

## Why This Matters

"What's our revenue running total this quarter?" "Show me the 7-day moving average of signups." "What percentage of total revenue does each region contribute?" — these are bread-and-butter analytics questions. Running totals and moving averages turn raw transactional data into trend lines and dashboards.

## The Tables We're Working With

```sql
-- daily_revenue table
-- | rev_date   | revenue | region |
-- |------------|---------|--------|
-- | 2024-01-01 | 5200    | West   |
-- | 2024-01-02 | 3800    | West   |
-- | 2024-01-03 | 6100    | West   |
-- | 2024-01-04 | 4500    | West   |
-- | 2024-01-05 | 7200    | West   |
-- | 2024-01-06 | 3100    | West   |
-- | 2024-01-07 | 5800    | West   |
-- | 2024-01-08 | 4200    | West   |
-- | 2024-01-09 | 6700    | West   |
-- | 2024-01-10 | 5500    | West   |
-- | 2024-01-01 | 4100    | East   |
-- | 2024-01-02 | 3200    | East   |
-- | 2024-01-03 | 5500    | East   |
-- | 2024-01-04 | 4800    | East   |
-- | 2024-01-05 | 6000    | East   |

-- monthly_sales table
-- | month_start | product       | units_sold | revenue |
-- |-------------|---------------|------------|---------|
-- | 2024-01-01  | CRM Pro       | 120        | 180000  |
-- | 2024-02-01  | CRM Pro       | 135        | 202500  |
-- | 2024-03-01  | CRM Pro       | 98         | 147000  |
-- | 2024-04-01  | CRM Pro       | 150        | 225000  |
-- | 2024-05-01  | CRM Pro       | 142        | 213000  |
-- | 2024-06-01  | CRM Pro       | 168        | 252000  |
-- | 2024-01-01  | Analytics Hub | 45         | 135000  |
-- | 2024-02-01  | Analytics Hub | 52         | 156000  |
-- | 2024-03-01  | Analytics Hub | 38         | 114000  |
-- | 2024-04-01  | Analytics Hub | 61         | 183000  |
-- | 2024-05-01  | Analytics Hub | 55         | 165000  |
-- | 2024-06-01  | Analytics Hub | 70         | 210000  |
```

## SUM() OVER() — Running Totals

A running total adds each row's value to all previous rows. It's the simplest and most common aggregate window function.

```sql
SELECT rev_date, revenue,
       SUM(revenue) OVER(ORDER BY rev_date) AS running_total
FROM daily_revenue
WHERE region = 'West';
```

```text
rev_date   | revenue | running_total
-----------|---------|-------------
2024-01-01 | 5200    | 5200
2024-01-02 | 3800    | 9000
2024-01-03 | 6100    | 15100
2024-01-04 | 4500    | 19600
2024-01-05 | 7200    | 26800
2024-01-06 | 3100    | 29900
2024-01-07 | 5800    | 35700
2024-01-08 | 4200    | 39900
2024-01-09 | 6700    | 46600
2024-01-10 | 5500    | 52100
```

Each row shows the cumulative total from the first row through the current row.

### Running Total Per Group

```sql
SELECT rev_date, region, revenue,
       SUM(revenue) OVER(
           PARTITION BY region
           ORDER BY rev_date
       ) AS regional_running_total
FROM daily_revenue;
```

```text
rev_date   | region | revenue | regional_running_total
-----------|--------|---------|----------------------
2024-01-01 | East   | 4100    | 4100
2024-01-02 | East   | 3200    | 7300
2024-01-03 | East   | 5500    | 12800
2024-01-04 | East   | 4800    | 17600
2024-01-05 | East   | 6000    | 23600
2024-01-01 | West   | 5200    | 5200
2024-01-02 | West   | 3800    | 9000
2024-01-03 | West   | 6100    | 15100
...
```

The running total **resets** for each region. PARTITION BY defines the boundary.

## The Frame Clause — ROWS BETWEEN

This is where window functions get really powerful. The **frame clause** controls exactly which rows are included in the calculation relative to the current row.

```
ROWS BETWEEN [start] AND [end]
```

Common frame boundaries:
- `UNBOUNDED PRECEDING` — from the first row in the partition
- `N PRECEDING` — N rows before current row
- `CURRENT ROW` — the current row
- `N FOLLOWING` — N rows after current row
- `UNBOUNDED FOLLOWING` — through the last row in the partition

```sql
-- Default frame when ORDER BY is specified:
-- RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
-- (this is why SUM() OVER(ORDER BY ...) gives a running total)

-- Explicit running total (same as default):
SELECT rev_date, revenue,
       SUM(revenue) OVER(
           ORDER BY rev_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM daily_revenue
WHERE region = 'West';
```

## AVG() OVER() — Moving Averages

Moving averages smooth out daily noise to reveal trends. A 7-day moving average is the most common in business analytics.

```sql
-- 7-day moving average
SELECT rev_date, revenue,
       ROUND(AVG(revenue) OVER(
           ORDER BY rev_date
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ), 0) AS moving_avg_7d
FROM daily_revenue
WHERE region = 'West';
```

```text
rev_date   | revenue | moving_avg_7d
-----------|---------|-------------
2024-01-01 | 5200    | 5200
2024-01-02 | 3800    | 4500
2024-01-03 | 6100    | 5033
2024-01-04 | 4500    | 4900
2024-01-05 | 7200    | 5360
2024-01-06 | 3100    | 4983
2024-01-07 | 5800    | 5100
2024-01-08 | 4200    | 4957
2024-01-09 | 6700    | 5371
2024-01-10 | 5500    | 5286
```

`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` = current row + 6 rows before = 7 rows total.

For the first 6 rows, the window is smaller (only the available rows are used). The average self-corrects once you have a full window.

### 3-Day Moving Average (Centered)

```sql
SELECT rev_date, revenue,
       ROUND(AVG(revenue) OVER(
           ORDER BY rev_date
           ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
       ), 0) AS centered_avg_3d
FROM daily_revenue
WHERE region = 'West';
```

```text
rev_date   | revenue | centered_avg_3d
-----------|---------|---------------
2024-01-01 | 5200    | 4500
2024-01-02 | 3800    | 5033
2024-01-03 | 6100    | 4800
2024-01-04 | 4500    | 5933
2024-01-05 | 7200    | 4933
2024-01-06 | 3100    | 5367
2024-01-07 | 5800    | 4367
2024-01-08 | 4200    | 5567
2024-01-09 | 6700    | 5467
2024-01-10 | 5500    | 6100
```

A centered average looks both backward and forward — useful in time series analysis but not for real-time dashboards (you don't know the future).

## RANGE vs ROWS — A Critical Distinction

```sql
-- ROWS: counts physical rows
-- RANGE: groups rows with the same ORDER BY value together
```

This matters when you have **duplicate dates**:

```sql
-- Suppose two rows both have rev_date = 2024-01-03
-- ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
--   → always exactly 3 rows (the current + 2 before it)
-- RANGE BETWEEN 2 PRECEDING AND CURRENT ROW
--   → includes all rows with the same date as current row

-- Best practice: Use ROWS for most analytics
-- RANGE is the default when ORDER BY is specified — be explicit!
```

<div class="interview-tip">

**Trap Alert**: When you write `SUM(x) OVER(ORDER BY date)`, the default frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. If two rows share the same date, RANGE includes **both** in each other's calculation — potentially giving unexpected results. Always specify `ROWS BETWEEN` explicitly for predictable behavior.

</div>

## Cumulative Percentage — "What % of Total So Far?"

```sql
SELECT month_start, product, revenue,
       SUM(revenue) OVER(
           PARTITION BY product
           ORDER BY month_start
       ) AS cumulative_rev,
       ROUND(
           SUM(revenue) OVER(
               PARTITION BY product
               ORDER BY month_start
           ) * 100.0 /
           SUM(revenue) OVER(PARTITION BY product),
       1) AS cumulative_pct
FROM monthly_sales;
```

```text
month_start | product       | revenue | cumulative_rev | cumulative_pct
------------|---------------|---------|----------------|---------------
2024-01-01  | Analytics Hub | 135000  | 135000         | 14.0
2024-02-01  | Analytics Hub | 156000  | 291000         | 30.2
2024-03-01  | Analytics Hub | 114000  | 405000         | 42.0
2024-04-01  | Analytics Hub | 183000  | 588000         | 61.0
2024-05-01  | Analytics Hub | 165000  | 753000         | 78.1
2024-06-01  | Analytics Hub | 210000  | 963000         | 100.0
2024-01-01  | CRM Pro       | 180000  | 180000         | 14.8
2024-02-01  | CRM Pro       | 202500  | 382500         | 31.5
...
```

The trick: `SUM(revenue) OVER(PARTITION BY product)` with **no ORDER BY** gives the total for the entire partition. Dividing the running total by the grand total gives the cumulative percentage.

## YTD (Year-to-Date) Calculations

```sql
SELECT month_start, product, revenue,
       SUM(revenue) OVER(
           PARTITION BY product, EXTRACT(YEAR FROM month_start)
           ORDER BY month_start
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS ytd_revenue
FROM monthly_sales;
```

```text
month_start | product       | revenue | ytd_revenue
------------|---------------|---------|------------
2024-01-01  | CRM Pro       | 180000  | 180000
2024-02-01  | CRM Pro       | 202500  | 382500
2024-03-01  | CRM Pro       | 147000  | 529500
2024-04-01  | CRM Pro       | 225000  | 754500
2024-05-01  | CRM Pro       | 213000  | 967500
2024-06-01  | CRM Pro       | 252000  | 1219500
```

By partitioning on both product AND year, the running total resets at the start of each year.

## MIN/MAX Windows — Running High and Low

```sql
SELECT rev_date, revenue,
       MIN(revenue) OVER(
           ORDER BY rev_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_min,
       MAX(revenue) OVER(
           ORDER BY rev_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_max
FROM daily_revenue
WHERE region = 'West';
```

```text
rev_date   | revenue | running_min | running_max
-----------|---------|-------------|------------
2024-01-01 | 5200    | 5200        | 5200
2024-01-02 | 3800    | 3800        | 5200
2024-01-03 | 6100    | 3800        | 6100
2024-01-04 | 4500    | 3800        | 6100
2024-01-05 | 7200    | 3800        | 7200
2024-01-06 | 3100    | 3100        | 7200
2024-01-07 | 5800    | 3100        | 7200
2024-01-08 | 4200    | 3100        | 7200
2024-01-09 | 6700    | 3100        | 7200
2024-01-10 | 5500    | 3100        | 7200
```

Running min/max tracks the all-time low and high up to each point. Great for stock price analysis or performance tracking.

## COUNT() OVER() — Cumulative Count

```sql
SELECT rev_date, revenue,
       COUNT(*) OVER(
           ORDER BY rev_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS day_number,
       ROUND(
           SUM(revenue) OVER(
               ORDER BY rev_date
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
           ) * 1.0 /
           COUNT(*) OVER(
               ORDER BY rev_date
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
           ),
       0) AS running_avg
FROM daily_revenue
WHERE region = 'West';
```

```text
rev_date   | revenue | day_number | running_avg
-----------|---------|------------|------------
2024-01-01 | 5200    | 1          | 5200
2024-01-02 | 3800    | 2          | 4500
2024-01-03 | 6100    | 3          | 5033
2024-01-04 | 4500    | 4          | 4900
2024-01-05 | 7200    | 5          | 5360
```

## Percentage of Total — No GROUP BY Needed

```sql
SELECT product, month_start, revenue,
       ROUND(
           revenue * 100.0 / SUM(revenue) OVER(PARTITION BY month_start),
       1) AS pct_of_month
FROM monthly_sales;
```

```text
product       | month_start | revenue | pct_of_month
--------------|-------------|---------|-------------
CRM Pro       | 2024-01-01  | 180000  | 57.1
Analytics Hub | 2024-01-01  | 135000  | 42.9
CRM Pro       | 2024-02-01  | 202500  | 56.5
Analytics Hub | 2024-02-01  | 156000  | 43.5
CRM Pro       | 2024-03-01  | 147000  | 56.3
Analytics Hub | 2024-03-01  | 114000  | 43.7
...
```

No subquery, no self-join, no GROUP BY. Window functions calculate the monthly total and the per-row percentage in a single pass.

## Where This Is Used in Real Jobs

| Scenario | Function | Frame |
|----------|----------|-------|
| Revenue running total | SUM() OVER | UNBOUNDED PRECEDING |
| 7-day signup moving avg | AVG() OVER | 6 PRECEDING, CURRENT ROW |
| YTD revenue | SUM() OVER | PARTITION BY year |
| % of category total | SUM() OVER | No ORDER BY (full partition) |
| Stock all-time high | MAX() OVER | UNBOUNDED PRECEDING |
| Dashboard KPI trends | AVG() OVER | 30 PRECEDING (30-day) |

<div class="challenge">

### Challenge 1: Monthly Running Total
Using the monthly_sales table, calculate a running total of revenue for each product across months. Show product, month, revenue, and cumulative revenue.

### Challenge 2: 3-Day Moving Average
Using daily_revenue (West region), calculate a 3-day trailing moving average. Show the date, daily revenue, and the 3-day average.

### Challenge 3: Percentage of Annual Total
For each product-month row, calculate what percentage of that product's annual total the month represents. Show the product, month, revenue, and percentage.

</div>

## Common Interview Questions

### Q1: How do you calculate a running total in SQL?

**Answer:** Use SUM() with a window function: `SUM(amount) OVER(ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`. The UNBOUNDED PRECEDING starts from the first row, and CURRENT ROW ends at the current row, giving a cumulative sum. Add PARTITION BY to reset the running total per group.

### Q2: What is the difference between ROWS and RANGE in a window frame?

**Answer:** ROWS counts physical rows — `3 PRECEDING` always means exactly 3 rows back. RANGE groups rows with the same ORDER BY value together — if two rows have the same date, both are included in each other's window. ROWS gives predictable results for moving averages; RANGE is the default when ORDER BY is specified, which can cause unexpected behavior with duplicate values.

### Q3: How would you calculate a 7-day moving average?

**Answer:** `AVG(value) OVER(ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`. This includes the current row plus the 6 rows before it, totaling 7 rows. For the first 6 rows, the average uses fewer rows since the window isn't full yet.

### Q4: How do you calculate each row's percentage of the group total?

**Answer:** Divide the row's value by `SUM(value) OVER(PARTITION BY group)`. The key: using PARTITION BY without ORDER BY gives the total for the entire group. So `value * 100.0 / SUM(value) OVER(PARTITION BY category)` gives each row's percentage of its category total — no subquery needed.

### Q5: What's the default window frame when you specify ORDER BY in a window function?

**Answer:** `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. This means the window includes all rows from the start of the partition up to and including all rows with the same ORDER BY value as the current row. This is why SUM() OVER(ORDER BY date) automatically produces a running total. It's important to specify ROWS explicitly when you want per-row control.
