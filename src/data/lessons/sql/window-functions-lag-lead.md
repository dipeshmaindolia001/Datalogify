---
title: "LAG & LEAD — Compare Rows in SQL"
description: "Compare current row with previous/next rows — calculate month-over-month growth, day-over-day changes, and gaps."
category: "sql"
order: 103
phase: 2
tags: ["sql", "lag", "lead", "window-functions", "growth-rate"]
publishedDate: 2025-03-03
prevSlug: "window-functions-aggregate"
nextSlug: "string-functions"
seoTitle: "SQL LAG and LEAD Functions Tutorial | Datalogify"
seoDescription: "Master SQL LAG and LEAD — month-over-month growth, day-over-day changes, gap analysis."
---

## Why This Matters

"What's our month-over-month revenue growth?" "How many users churned compared to last month?" "Find gaps in the sequence numbers." — all of these require comparing the current row with the previous or next row. LAG and LEAD make this trivial.

## The Tables We're Working With

```sql
-- monthly_metrics table
-- | metric_date | product       | revenue | signups |
-- |-------------|---------------|---------|---------|
-- | 2024-01-01  | CRM Pro       | 180000  | 120     |
-- | 2024-02-01  | CRM Pro       | 202500  | 135     |
-- | 2024-03-01  | CRM Pro       | 147000  | 98      |
-- | 2024-04-01  | CRM Pro       | 225000  | 150     |
-- | 2024-05-01  | CRM Pro       | 213000  | 142     |
-- | 2024-06-01  | CRM Pro       | 252000  | 168     |
-- | 2024-01-01  | Analytics Hub | 135000  | 45      |
-- | 2024-02-01  | Analytics Hub | 156000  | 52      |
-- | 2024-03-01  | Analytics Hub | 114000  | 38      |
-- | 2024-04-01  | Analytics Hub | 183000  | 61      |
-- | 2024-05-01  | Analytics Hub | 165000  | 55      |
-- | 2024-06-01  | Analytics Hub | 210000  | 70      |

-- user_events table
-- | user_id | event_type | event_time          |
-- |---------|------------|---------------------|
-- | 1001    | login      | 2024-03-15 09:00:00 |
-- | 1001    | page_view  | 2024-03-15 09:05:00 |
-- | 1001    | purchase   | 2024-03-15 09:12:00 |
-- | 1001    | login      | 2024-03-15 14:30:00 |
-- | 1001    | page_view  | 2024-03-15 14:35:00 |
-- | 1002    | login      | 2024-03-15 10:00:00 |
-- | 1002    | page_view  | 2024-03-15 10:02:00 |
-- | 1002    | page_view  | 2024-03-15 10:08:00 |
-- | 1002    | purchase   | 2024-03-15 10:15:00 |
```

## LAG() — Look at the Previous Row

LAG pulls a value from a **previous** row in the ordered result set.

```sql
LAG(column, offset, default_value) OVER(
    [PARTITION BY ...]
    ORDER BY ...
)
```

- `column` — the column to look back at
- `offset` — how many rows back (default: 1)
- `default_value` — what to return if there's no previous row (default: NULL)

```sql
SELECT metric_date, product, revenue,
       LAG(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS prev_month_revenue
FROM monthly_metrics;
```

```text
metric_date | product       | revenue | prev_month_revenue
------------|---------------|---------|-------------------
2024-01-01  | Analytics Hub | 135000  | NULL
2024-02-01  | Analytics Hub | 156000  | 135000
2024-03-01  | Analytics Hub | 114000  | 156000
2024-04-01  | Analytics Hub | 183000  | 114000
2024-05-01  | Analytics Hub | 165000  | 183000
2024-06-01  | Analytics Hub | 210000  | 165000
2024-01-01  | CRM Pro       | 180000  | NULL
2024-02-01  | CRM Pro       | 202500  | 180000
...
```

January has NULL for prev_month_revenue because there's no row before it. The PARTITION BY ensures we only compare within the same product.

## Month-Over-Month Growth — The Killer Query

This is the #1 real-world use of LAG. Every dashboard has it.

```sql
SELECT metric_date, product, revenue,
       LAG(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS prev_revenue,
       ROUND(
           (revenue - LAG(revenue) OVER(
               PARTITION BY product
               ORDER BY metric_date
           )) * 100.0 /
           NULLIF(LAG(revenue) OVER(
               PARTITION BY product
               ORDER BY metric_date
           ), 0),
       1) AS mom_growth_pct
FROM monthly_metrics;
```

```text
metric_date | product       | revenue | prev_revenue | mom_growth_pct
------------|---------------|---------|--------------|---------------
2024-01-01  | Analytics Hub | 135000  | NULL         | NULL
2024-02-01  | Analytics Hub | 156000  | 135000       | 15.6
2024-03-01  | Analytics Hub | 114000  | 156000       | -26.9
2024-04-01  | Analytics Hub | 183000  | 114000       | 60.5
2024-05-01  | Analytics Hub | 165000  | 183000       | -9.8
2024-06-01  | Analytics Hub | 210000  | 165000       | 27.3
2024-01-01  | CRM Pro       | 180000  | NULL         | NULL
2024-02-01  | CRM Pro       | 202500  | 180000       | 12.5
2024-03-01  | CRM Pro       | 147000  | 202500       | -27.4
2024-04-01  | CRM Pro       | 225000  | 147000       | 53.1
2024-05-01  | CRM Pro       | 213000  | 225000       | -5.3
2024-06-01  | CRM Pro       | 252000  | 213000       | 18.3
```

The formula: `(current - previous) / previous * 100`. NULLIF prevents division by zero.

<div class="interview-tip">

**Interview Classic**: "Calculate month-over-month growth rate." This tests three things at once: LAG(), percentage calculation, and NULL handling (first row has no previous, plus division-by-zero safety with NULLIF). Practice this until it's muscle memory.

</div>

## LAG with Offset and Default

```sql
-- Look back 2 months instead of 1
SELECT metric_date, product, revenue,
       LAG(revenue, 2, 0) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS two_months_ago
FROM monthly_metrics
WHERE product = 'CRM Pro';
```

```text
metric_date | product | revenue | two_months_ago
------------|---------|---------|---------------
2024-01-01  | CRM Pro | 180000  | 0
2024-02-01  | CRM Pro | 202500  | 0
2024-03-01  | CRM Pro | 147000  | 180000
2024-04-01  | CRM Pro | 225000  | 202500
2024-05-01  | CRM Pro | 213000  | 147000
2024-06-01  | CRM Pro | 252000  | 225000
```

The third argument (`0`) replaces NULL when there's no row 2 positions back.

## LEAD() — Look at the Next Row

LEAD is the mirror of LAG — it pulls from a **future** row.

```sql
SELECT metric_date, product, revenue,
       LEAD(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS next_month_revenue
FROM monthly_metrics
WHERE product = 'CRM Pro';
```

```text
metric_date | product | revenue | next_month_revenue
------------|---------|---------|-------------------
2024-01-01  | CRM Pro | 180000  | 202500
2024-02-01  | CRM Pro | 202500  | 147000
2024-03-01  | CRM Pro | 147000  | 225000
2024-04-01  | CRM Pro | 225000  | 213000
2024-05-01  | CRM Pro | 213000  | 252000
2024-06-01  | CRM Pro | 252000  | NULL
```

The last row has NULL because there's no next month.

### Practical Use: Forecasting Gap

```sql
-- Show current vs next month to identify upcoming drops
SELECT metric_date, product, revenue,
       LEAD(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS next_revenue,
       CASE
           WHEN LEAD(revenue) OVER(
               PARTITION BY product
               ORDER BY metric_date
           ) < revenue THEN 'DECLINING'
           ELSE 'GROWING'
       END AS trend
FROM monthly_metrics
WHERE product = 'CRM Pro';
```

```text
metric_date | product | revenue | next_revenue | trend
------------|---------|---------|--------------|--------
2024-01-01  | CRM Pro | 180000  | 202500       | GROWING
2024-02-01  | CRM Pro | 202500  | 147000       | DECLINING
2024-03-01  | CRM Pro | 147000  | 225000       | GROWING
2024-04-01  | CRM Pro | 225000  | 213000       | DECLINING
2024-05-01  | CRM Pro | 213000  | 252000       | GROWING
2024-06-01  | CRM Pro | 252000  | NULL         | GROWING
```

## FIRST_VALUE() and LAST_VALUE()

```sql
SELECT metric_date, product, revenue,
       FIRST_VALUE(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS first_month_rev,
       revenue - FIRST_VALUE(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS change_from_start
FROM monthly_metrics
WHERE product = 'CRM Pro';
```

```text
metric_date | product | revenue | first_month_rev | change_from_start
------------|---------|---------|-----------------|------------------
2024-01-01  | CRM Pro | 180000  | 180000          | 0
2024-02-01  | CRM Pro | 202500  | 180000          | 22500
2024-03-01  | CRM Pro | 147000  | 180000          | -33000
2024-04-01  | CRM Pro | 225000  | 180000          | 45000
2024-05-01  | CRM Pro | 213000  | 180000          | 33000
2024-06-01  | CRM Pro | 252000  | 180000          | 72000
```

FIRST_VALUE always returns the first row's value in the window — perfect for "compared to baseline" analysis.

<div class="interview-tip">

**LAST_VALUE() Trap**: LAST_VALUE() with the default frame (`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`) returns the **current row's value**, not the actual last row. You must specify `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to get the true last value.

</div>

```sql
-- WRONG: returns current row
SELECT metric_date, revenue,
       LAST_VALUE(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
       ) AS wrong_last
FROM monthly_metrics WHERE product = 'CRM Pro';

-- CORRECT: returns actual last row
SELECT metric_date, revenue,
       LAST_VALUE(revenue) OVER(
           PARTITION BY product
           ORDER BY metric_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS correct_last
FROM monthly_metrics WHERE product = 'CRM Pro';
```

## NTH_VALUE() — Get a Specific Row's Value

```sql
-- Get the 3rd month's revenue for comparison
SELECT metric_date, product, revenue,
       NTH_VALUE(revenue, 3) OVER(
           PARTITION BY product
           ORDER BY metric_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS third_month_rev
FROM monthly_metrics
WHERE product = 'CRM Pro';
```

```text
metric_date | product | revenue | third_month_rev
------------|---------|---------|----------------
2024-01-01  | CRM Pro | 180000  | 147000
2024-02-01  | CRM Pro | 202500  | 147000
2024-03-01  | CRM Pro | 147000  | 147000
2024-04-01  | CRM Pro | 225000  | 147000
2024-05-01  | CRM Pro | 213000  | 147000
2024-06-01  | CRM Pro | 252000  | 147000
```

## Gap Detection — Finding Missing Sequences

```sql
-- order_numbers table
-- | order_id |
-- |----------|
-- | 1001     |
-- | 1002     |
-- | 1003     |
-- | 1005     |  ← 1004 is missing
-- | 1006     |
-- | 1009     |  ← 1007, 1008 missing

SELECT order_id,
       LEAD(order_id) OVER(ORDER BY order_id) AS next_order_id,
       LEAD(order_id) OVER(ORDER BY order_id) - order_id AS gap_size
FROM order_numbers
HAVING gap_size > 1;

-- Better approach with CTE:
WITH gaps AS (
    SELECT order_id,
           LEAD(order_id) OVER(ORDER BY order_id) AS next_id
    FROM order_numbers
)
SELECT order_id AS gap_starts_after,
       next_id AS gap_ends_before,
       next_id - order_id - 1 AS missing_count
FROM gaps
WHERE next_id - order_id > 1;
```

```text
gap_starts_after | gap_ends_before | missing_count
-----------------|-----------------|-------------
1003             | 1005            | 1
1006             | 1009            | 2
```

## Sessionization — Grouping User Activity

This is a real-world analytics pattern: group user events into "sessions" based on inactivity gaps.

```sql
-- A new session starts when there's a 30+ minute gap between events
WITH time_gaps AS (
    SELECT user_id, event_type, event_time,
           LAG(event_time) OVER(
               PARTITION BY user_id
               ORDER BY event_time
           ) AS prev_event_time,
           EXTRACT(EPOCH FROM (
               event_time - LAG(event_time) OVER(
                   PARTITION BY user_id
                   ORDER BY event_time
               )
           )) / 60 AS minutes_since_last
    FROM user_events
),
session_flags AS (
    SELECT *,
           CASE
               WHEN minutes_since_last IS NULL
                    OR minutes_since_last > 30
               THEN 1 ELSE 0
           END AS new_session_flag
    FROM time_gaps
),
sessions AS (
    SELECT *,
           SUM(new_session_flag) OVER(
               PARTITION BY user_id
               ORDER BY event_time
           ) AS session_id
    FROM session_flags
)
SELECT user_id, session_id, event_type, event_time,
       ROUND(minutes_since_last, 1) AS min_gap
FROM sessions;
```

```text
user_id | session_id | event_type | event_time          | min_gap
--------|------------|------------|---------------------|--------
1001    | 1          | login      | 2024-03-15 09:00:00 | NULL
1001    | 1          | page_view  | 2024-03-15 09:05:00 | 5.0
1001    | 1          | purchase   | 2024-03-15 09:12:00 | 7.0
1001    | 2          | login      | 2024-03-15 14:30:00 | 318.0
1001    | 2          | page_view  | 2024-03-15 14:35:00 | 5.0
1002    | 1          | login      | 2024-03-15 10:00:00 | NULL
1002    | 1          | page_view  | 2024-03-15 10:02:00 | 2.0
1002    | 1          | page_view  | 2024-03-15 10:08:00 | 6.0
1002    | 1          | purchase   | 2024-03-15 10:15:00 | 7.0
```

This pattern uses LAG to detect gaps, CASE to flag new sessions, and a running SUM to assign session IDs. You'll see this in Google Analytics, Amplitude, and every product analytics tool.

## Where This Is Used in Real Jobs

| Scenario | Function | Why |
|----------|----------|-----|
| MoM revenue growth | LAG | Compare current to previous |
| Day-over-day user change | LAG | Trend direction |
| Missing order detection | LEAD | Find sequence gaps |
| Session analysis | LAG + SUM | Group events by inactivity |
| Baseline comparison | FIRST_VALUE | Compare to initial value |
| Churn identification | LEAD | Find last activity before drop |

<div class="challenge">

### Challenge 1: Revenue Growth Report
Calculate month-over-month revenue growth percentage for each product. Include product name, month, revenue, previous month's revenue, and growth rate. Handle the first month's NULL gracefully.

### Challenge 2: Session Analysis
Using the user_events table, calculate the time gap (in minutes) between consecutive events for each user. Flag any gap greater than 30 minutes as a "session break."

### Challenge 3: Gap Finder
Given a table of invoice numbers (invoice_num: 5001, 5002, 5004, 5005, 5008), find all gaps. Show where each gap starts and how many numbers are missing.

</div>

## Common Interview Questions

### Q1: What is the difference between LAG and LEAD?

**Answer:** LAG looks at previous rows (backward), LEAD looks at subsequent rows (forward). LAG(revenue, 1) returns the previous row's revenue; LEAD(revenue, 1) returns the next row's. Both take three arguments: the column, the offset (default 1), and a default value for when there's no row to look at (default NULL).

### Q2: How do you calculate month-over-month growth in SQL?

**Answer:** Use LAG to get the previous month's value, then calculate `(current - previous) / previous * 100`. Wrap the LAG in NULLIF to avoid division by zero: `(revenue - LAG(revenue) OVER(...)) * 100.0 / NULLIF(LAG(revenue) OVER(...), 0)`. Partition by the entity (product, region) and order by date.

### Q3: Why does LAST_VALUE() often return the current row's value?

**Answer:** Because the default window frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which ends at the current row. LAST_VALUE within that frame is just the current row. To get the actual last row in the partition, you must explicitly set the frame to `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.

### Q4: How would you detect gaps in a sequence of numbers?

**Answer:** Use LEAD to compare each row's value with the next row's value. Where `LEAD(id) - id > 1`, there's a gap. The gap size is `LEAD(id) - id - 1`. Wrap in a CTE and filter for gaps greater than 1 in the outer query.

### Q5: What is sessionization and how do you implement it in SQL?

**Answer:** Sessionization groups sequential events into sessions based on inactivity thresholds (e.g., 30 minutes). Implementation: (1) Use LAG to get the previous event's timestamp, (2) calculate the time difference, (3) flag rows where the gap exceeds the threshold as new sessions (1/0), (4) use a running SUM of those flags to assign session IDs. This is a standard pattern in product analytics.
