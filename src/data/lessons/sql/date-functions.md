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

## Introduction & The "Why"

Imagine a physical calendar timeline ruler extending from the distant past into the far future. 

```text
              THE TIMELINE RULER
◄───[2024-01-01]───────[2024-03-15]───────[2024-03-16]───────[2024-04-01]───►
        │                   │                   │                   │
        │                   ◄───── 24 Hours ────►                   │
        │                                                           │
        └──────────────────── DATE_TRUNC ('month') ─────────────────┘
                            (Aligns both March dates to March 1st)
```

If you place dates on this ruler, you can use several tools:
*   **The Slider (`EXTRACT` or `DATEPART`)**: Pulls out single values from a point on the ruler. You align it with `2024-03-15` and pull out just the year (`2024`), the month (`3`), or the day of the week (`5` for Friday).
*   **The Tape Measure (`DATE_ADD`, `DATE_SUB`, or `INTERVAL`)**: Moves your position forward or backward by a specific unit of time (e.g., jumping 30 days ahead to set an invoice expiration date).
*   **The Calipers (`DATEDIFF` or `AGE`)**: Measures the physical distance between two flags pinned to the timeline (e.g., calculating that 94 days have elapsed between a customer's first purchase and their second).
*   **The Grid Aligner (`DATE_TRUNC`)**: Aligns dates within a grid sector to the left-most edge of that sector. For example, aligning both `2024-03-15` and `2024-03-28` to the first day of that month (`2024-03-01`) for monthly reporting.

In data analytics, time is the ultimate dimension. Business performance is measured relative to time:
*   *"Are sales up this quarter compared to last quarter?"*
*   *"How long does a customer stick around before canceling their subscription?"*
*   *"What percentage of users who signed up in January made a purchase within 7 days?"*

If you cannot perform date calculations, you cannot build cohort charts, track SLAs, calculate customer churn, or construct financial reports.

---

## Step-by-Step Concept Breakdown

### Getting the Current Timestamp

Every database engine has its own functions to retrieve the current date and time. It is important to know the dialect of your system:

| Database | Date & Time (Timestamp) | Date Only |
| :--- | :--- | :--- |
| **PostgreSQL** | `NOW()`, `CURRENT_TIMESTAMP` | `CURRENT_DATE` |
| **MySQL** | `NOW()`, `CURRENT_TIMESTAMP` | `CURDATE()` |
| **SQL Server** | `GETDATE()`, `SYSDATETIME()` | `CAST(GETDATE() AS DATE)` |

#### Transaction-time vs. Clock-time:
In PostgreSQL and some other systems, `NOW()` and `CURRENT_TIMESTAMP` return the start time of the *current transaction*. If your query takes 5 minutes to run, `NOW()` will return the exact same timestamp at the beginning and the end of the query execution. 
If you need the actual, real-world clock time to update as the query runs, use `CLOCK_TIMESTAMP()`.

---

### Date Extraction: EXTRACT() and DATEPART()

Date extraction pulls a single numeric field (like year, month, or day) out of a timestamp.

*   **PostgreSQL / MySQL**:
    ```sql
    EXTRACT(field FROM timestamp)
    ```
*   **SQL Server**:
    ```sql
    DATEPART(field, timestamp)
    ```

#### Common Fields:
*   `YEAR`: Calendar year (e.g. `2025`).
*   `QUARTER`: Calendar quarter (values `1` through `4`).
*   `MONTH`: Month index (`1` through `12`).
*   `DAY`: Day of the month (`1` through `31`).
*   `DOW` (Day of Week): Sunday is `0` through Saturday is `6` (Postgres default).
*   `ISODOW`: Monday is `1` through Sunday is `7` (ISO-8601 standard).

---

### Date Math: Adding and Subtracting Intervals

Adding and subtracting time is vital for calculating expiration dates, trial periods, and SLA warnings.

#### PostgreSQL Syntax:
PostgreSQL uses the `INTERVAL` keyword combined with mathematical operators:
```sql
date_column + INTERVAL '14 days'
date_column - INTERVAL '3 months'
```

#### MySQL Syntax:
```sql
DATE_ADD(date_column, INTERVAL 14 DAY)
DATE_SUB(date_column, INTERVAL 3 MONTH)
```

#### SQL Server Syntax:
```sql
DATEADD(day, 14, date_column)
DATEADD(month, -3, date_column)
```

#### The Calendar Month Trap:
Adding `30 days` to a date is **not** the same as adding `1 month`.
*   Adding `30 days` to `'2025-02-15'` yields `'2025-03-17'`.
*   Adding `1 month` to `'2025-02-15'` yields `'2025-03-15'`.

For financial, billing, and subscription cohorts, always add **month intervals** to keep alignment with calendar months. For strict operational SLAs (e.g. customer tickets must close in 48 hours), use **day or hour intervals**.

---

### Date Differences: Measuring Elapsed Time

To find the duration of an event, you need to calculate the difference between two dates.

*   **PostgreSQL**: You can subtract dates directly. Subtracting two dates yields an integer representing the number of days:
    ```sql
    end_date::date - start_date::date
    ```
    If you need detailed interval durations (e.g., years, months, and days), use the `AGE(end, start)` function:
    ```sql
    AGE('2026-04-15', '2024-01-10') -- Returns: '2 years 3 months 5 days'
    ```
*   **MySQL & SQL Server**:
    ```sql
    DATEDIFF(unit, start_date, end_date)
    ```

---

### Date Truncation: DATE_TRUNC()

`DATE_TRUNC(precision, timestamp)` is the most important date function for data analysts. It cuts off (truncates) the time details of a timestamp to a specified unit of precision.

```text
DATE_TRUNC('month', '2025-03-15 14:30:15') ──► '2025-03-01 00:00:00'
```

It effectively rolls the date back to the first day of that period.

#### Why DATE_TRUNC is superior to EXTRACT for reports:
If you want to group weekly sales, you can use `EXTRACT(YEAR FROM date)` and `EXTRACT(WEEK FROM date)`. However, this returns two separate integer columns (`2025` and `11`). You cannot easily plot these integers on a chart timeline.

If you use `DATE_TRUNC('week', date)`, the database returns an actual date object corresponding to the start of each week (`2025-03-10`). This dates column is easy to sort, filter, and plot.

---

## Code / Practical Walkthroughs

We will run our walkthroughs using two tables: `orders_raw` and `employees_raw`.

### Schema Setup

```sql
-- Create orders_raw table
CREATE TABLE orders_raw (
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_time TIMESTAMP,
    amount DECIMAL(10,2)
);

INSERT INTO orders_raw VALUES
(1, 1001, '2024-01-15 09:30:00', 1250.00),
(2, 1002, '2024-02-22 14:15:00', 890.00),
(3, 1001, '2024-03-08 11:45:00', 2100.00),
(4, 1003, '2024-04-19 16:00:00', 450.00),
(5, 1002, '2024-05-30 10:20:00', 1800.00),
(6, 1004, '2024-06-12 08:45:00', 3200.00),
(7, 1001, '2024-07-25 13:10:00', 950.00),
(8, 1003, '2024-08-14 15:30:00', 1675.00),
(9, 1005, '2024-09-05 09:00:00', 2400.00),
(10, 1002, '2024-10-18 11:30:00', 1100.00);

-- Create employees_raw table
CREATE TABLE employees_raw (
    emp_id INT PRIMARY KEY,
    name VARCHAR(50),
    hire_date DATE,
    birth_date DATE
);

INSERT INTO employees_raw VALUES
(1, 'Sarah Chen', '2022-01-15', '1992-06-20'),
(2, 'James Wilson', '2022-06-01', '1988-11-03'),
(3, 'Priya Patel', '2023-03-10', '1995-02-14'),
(4, 'Mike Johnson', '2021-08-20', '1990-09-28'),
(5, 'Lisa Park', '2024-01-08', '1997-04-05');
```

---

### Walkthrough 1: Monthly Sales Aggregations

We need to build a monthly sales report that aggregates order count and total revenue. We will compare PostgreSQL's `DATE_TRUNC` method against the standard SQL `EXTRACT` method.

#### Query 1: Using `DATE_TRUNC` (PostgreSQL / Snowflake)

```sql
SELECT 
    -- Truncate order_time to the start of the month
    DATE_TRUNC('month', order_time)::date AS sales_month,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_revenue
FROM orders_raw
GROUP BY DATE_TRUNC('month', order_time)
ORDER BY sales_month;
```

```text
# Output:
sales_month | total_orders | total_revenue
------------|--------------|--------------
2024-01-01  | 1            | 1250.00
2024-02-01  | 1            | 890.00
2024-03-01  | 1            | 2100.00
2024-04-01  | 1            | 450.00
2024-05-01  | 1            | 1800.00
2024-06-01  | 1            | 3200.00
2024-07-01  | 1            | 950.00
2024-08-01  | 1            | 1675.00
2024-09-01  | 1            | 2400.00
2024-10-01  | 1            | 1100.00
```

#### Query 2: Using `EXTRACT` (Standard SQL / MySQL)

```sql
SELECT 
    EXTRACT(YEAR FROM order_time) AS sales_year,
    EXTRACT(MONTH FROM order_time) AS sales_month,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_revenue
FROM orders_raw
GROUP BY 
    EXTRACT(YEAR FROM order_time), 
    EXTRACT(MONTH FROM order_time)
ORDER BY sales_year, sales_month;
```

```text
# Output:
sales_year | sales_month | total_orders | total_revenue
------------|-------------|--------------|--------------
2024        | 1           | 1            | 1250.00
2024        | 2           | 1            | 890.00
2024        | 3           | 1            | 2100.00
2024        | 4           | 1            | 450.00
...
```

---

### Walkthrough 2: Customer Cohort Retention Analysis

Let's identify when each customer placed their first order (the cohort month), and then track their orders to see how many months elapsed before they made subsequent purchases.

#### Query:

```sql
-- Step 1: Find the first order month (cohort month) for each customer
WITH customer_cohorts AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', MIN(order_time))::date AS cohort_month
    FROM orders_raw
    GROUP BY customer_id
)
-- Step 2: Join the cohort table back to the orders table and calculate month offsets
SELECT 
    cc.cohort_month,
    o.order_id,
    o.order_time::date AS order_date,
    -- Calculate difference in months between cohort month and order month
    EXTRACT(YEAR FROM AGE(DATE_TRUNC('month', o.order_time)::date, cc.cohort_month)) * 12 
    + EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', o.order_time)::date, cc.cohort_month)) AS months_since_cohort
FROM orders_raw o
JOIN customer_cohorts cc ON o.customer_id = cc.customer_id
ORDER BY cc.cohort_month, cc.customer_id, order_date;
```

```text
# Output:
cohort_month | order_id | order_date | months_since_cohort
-------------|----------|------------|--------------------
2024-01-01   | 1        | 2024-01-15 | 0
2024-01-01   | 3        | 2024-03-08 | 2                  -- Repurchase occurred 2 months later!
2024-01-01   | 7        | 2024-07-25 | 6
2024-02-01   | 2        | 2024-02-22 | 0
2024-02-01   | 5        | 2024-05-30 | 3
2024-02-01   | 10       | 2024-10-18 | 8
2024-04-01   | 4        | 2024-04-19 | 0
2024-04-01   | 8        | 2024-08-14 | 4
2024-06-01   | 6        | 2024-06-12 | 0
2024-09-01   | 9        | 2024-09-05 | 0
```

#### Step-by-Step Logic Breakdown:
1.  **`customer_cohorts` CTE**: Aggregates the minimum order time per customer and uses `DATE_TRUNC` to pull the first day of that month. For customer 1001, the minimum date is `2024-01-15`, which is truncated to `2024-01-01`.
2.  **Primary Select**: Joins the CTE back to `orders_raw` on `customer_id`.
3.  For each order, we calculate the age interval between the order's month and the customer's cohort month.
4.  For order 3 (`2024-03-08`), the order month is `2024-03-01`. The age difference between `2024-03-01` and `2024-01-01` is 2 months.

---

### Walkthrough 3: SLA Warning and Aging Analysis

We want to track our customer order fulfillment speed. Assume we have a strict SLA: orders must be fulfilled within 180 days of booking. Let's write a query that checks how many days have elapsed since each order was booked (assume the current date is `'2024-11-01'` for consistency).

#### Query:

```sql
SELECT 
    order_id,
    order_time::date AS booking_date,
    -- Subtract order date from target baseline date to find days elapsed
    ('2024-11-01'::date - order_time::date) AS days_elapsed,
    -- Determine SLA status
    CASE 
        WHEN ('2024-11-01'::date - order_time::date) <= 30 THEN 'Under SLA: Active'
        WHEN ('2024-11-01'::date - order_time::date) <= 120 THEN 'Under SLA: Attention'
        WHEN ('2024-11-01'::date - order_time::date) <= 180 THEN 'Warning: Escalation'
        ELSE 'SLA Breached'
    END AS sla_status
FROM orders_raw;
```

```text
# Output:
order_id | booking_date | days_elapsed | sla_status
---------|--------------|--------------|---------------------
1        | 2024-01-15   | 291          | SLA Breached
2        | 2024-02-22   | 253          | SLA Breached
3        | 2024-03-08   | 238          | SLA Breached
4        | 2024-04-19   | 196          | SLA Breached
5        | 2024-05-30   | 155          | Warning: Escalation
6        | 2024-06-12   | 142          | Warning: Escalation
7        | 2024-07-25   | 99           | Under SLA: Attention
8        | 2024-08-14   | 79           | Under SLA: Attention
9        | 2024-09-05   | 57           | Under SLA: Attention
10       | 2024-10-18   | 14           | Under SLA: Active
```

---

### Walkthrough 4: Fiscal Year and Quarter Reporting

A fiscal year starting on April 1st is common for many corporate enterprises. Let's write a query that maps orders to their corresponding fiscal year and fiscal quarter.

#### Query:

```sql
SELECT 
    order_id,
    order_time::date AS order_date,
    amount,
    -- Fiscal Year Calculation (months 1-3 fall into prior calendar year)
    CASE 
        WHEN EXTRACT(MONTH FROM order_time) >= 4 
        THEN EXTRACT(YEAR FROM order_time)
        ELSE EXTRACT(YEAR FROM order_time) - 1
    END AS fiscal_year,
    -- Fiscal Quarter Calculation
    CASE 
        WHEN EXTRACT(MONTH FROM order_time) BETWEEN 4 AND 6 THEN 'FY-Q1'
        WHEN EXTRACT(MONTH FROM order_time) BETWEEN 7 AND 9 THEN 'FY-Q2'
        WHEN EXTRACT(MONTH FROM order_time) BETWEEN 10 AND 12 THEN 'FY-Q3'
        ELSE 'FY-Q4'
    END AS fiscal_quarter
FROM orders_raw
ORDER BY order_date;
```

```text
# Output:
order_id | order_date | amount  | fiscal_year | fiscal_quarter
---------|------------|---------|-------------|---------------
1        | 2024-01-15 | 1250.00 | 2023        | FY-Q4
2        | 2024-02-22 | 890.00  | 2023        | FY-Q4
3        | 2024-03-08 | 2100.00 | 2023        | FY-Q4
4        | 2024-04-19 | 450.00  | 2024        | FY-Q1
5        | 2024-05-30 | 1800.00 | 2024        | FY-Q1
6        | 2024-06-12 | 3200.00 | 2024        | FY-Q1
7        | 2024-07-25 | 950.00  | 2024        | FY-Q2
8        | 2024-08-14 | 1675.00 | 2024        | FY-Q2
9        | 2024-09-05 | 2400.00 | 2024        | FY-Q2
10       | 2024-10-18 | 1100.00 | 2024        | FY-Q3
```

---

## Dialect Syntax Cheat Sheet

Save this syntax cheat sheet to quickly reference commands between different SQL engines:

| Objective | PostgreSQL | MySQL | SQL Server |
| :--- | :--- | :--- | :--- |
| **Current Date** | `CURRENT_DATE` | `CURDATE()` | `CAST(GETDATE() AS DATE)` |
| **Current Time** | `NOW()` | `NOW()` | `GETDATE()` |
| **Extract Year** | `EXTRACT(YEAR FROM d)` | `EXTRACT(YEAR FROM d)` | `DATEPART(year, d)` |
| **Add 10 Days** | `d + INTERVAL '10 days'` | `DATE_ADD(d, INTERVAL 10 DAY)`| `DATEADD(day, 10, d)` |
| **Diff in Days** | `d1::date - d2::date` | `DATEDIFF(d1, d2)` | `DATEDIFF(day, d2, d1)` |
| **Date Truncate**| `DATE_TRUNC('month', d)` | (Format to YYYY-MM-01) | `DATETRUNC(month, d)` |

---

## Edge Cases & Common Mistakes

### 1. Mismatched Server Time Zones (UTC vs. Local)
Many production servers store dates in Coordinated Universal Time (UTC) to prevent time offset issues across global offices. However, local business teams want reports in their local time zone.

If you write a query that queries orders placed on `'2025-03-15'`, an order placed at 8:00 PM Pacific Standard Time (PST) is saved on the server as `2025-03-16 04:00:00 UTC`. 

*   **The Bug**: Standard calendar filtering will count the sales on the wrong day.
*   **The Fix**: Use time zone conversion syntax to shift timezone offsets before grouping or filtering:
    ```sql
    -- PostgreSQL: Convert UTC to Eastern Standard Time
    SELECT (order_time AT TIME ZONE 'UTC' AT TIME ZONE 'EST')::date AS est_date
    ```

---

### 2. The DATEDIFF Boundary-Crossing Trap
In SQL Server and MySQL, `DATEDIFF(unit, start, end)` calculates the number of *boundary crossings* between two dates, not the exact duration.

*   **Scenario**:
    *   Start time: `2025-01-31 23:59:59`
    *   End time: `2025-02-01 00:00:01`
    *   Physical duration: **2 seconds**
*   **The Bug**:
    ```sql
    DATEDIFF(month, '2025-01-31 23:59:59', '2025-02-01 00:00:01')
    ```
    This returns `1` month because a month boundary (January to February) was crossed.
*   **Solution**: To get the exact duration in days, convert the timestamps to seconds first and divide by `86400`, or use specialized timestamp functions like `TIMESTAMPDIFF` in MySQL.

---

### 3. Comparing Dates with Hidden Timestamps
If you filter a datetime column using a date-only string, the database implicitly appends a time portion of `'00:00:00'` to your filter.

*   **Incorrect Query**:
    ```sql
    -- Misses all orders placed on 2024-01-15 after midnight!
    WHERE order_time = '2024-01-15'
    ```
*   **Correct Queries**:
    ```sql
    -- Option A: Cast the timestamp column to a date
    WHERE order_time::date = '2024-01-15'

    -- Option B: Use range bounding (Better for index optimization)
    WHERE order_time >= '2024-01-15 00:00:00' 
      AND order_time < '2024-01-16 00:00:00'
    ```
    Option B is preferred for performance because it doesn't apply functions to the column, allowing the engine to leverage standard indexing.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Weekend Sales Premium
**Goal**: Write a query that computes total sales and average order amounts grouped by whether the order occurred on a Weekend (Saturday/Sunday) versus a Weekday (Monday through Friday).

*   *Hint*: Use `EXTRACT(DOW FROM order_time)` and a `CASE` statement.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    CASE 
        WHEN EXTRACT(DOW FROM order_time) IN (0, 6) THEN 'Weekend'
        ELSE 'Weekday'
    END AS day_type,
    COUNT(*) AS order_count,
    SUM(amount) AS total_sales,
    ROUND(AVG(amount), 2) AS average_order
FROM orders_raw
GROUP BY 1;
```
</details>

---

### Exercise 2: Active Subscriber Tenure
**Goal**: Using the `employees_raw` table, calculate the total tenure for each employee in months. Show the employee's name, hire date, and their tenure in complete months.

*   *Hint*: Use the `AGE` function in Postgres.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    name,
    hire_date,
    EXTRACT(YEAR FROM AGE('2024-11-01'::date, hire_date)) * 12 
    + EXTRACT(MONTH FROM AGE('2024-11-01'::date, hire_date)) AS tenure_in_months
FROM employees_raw;
```
</details>

---

### Exercise 3: Cohort Size Counter
**Goal**: Find the signup month cohort for each user, and return a summary showing the cohort month and the total number of unique customers who belong to that cohort.

*   *Hint*: Group by the truncated minimum date.

<details>
<summary>View Solution</summary>

```sql
WITH cohorts AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', MIN(order_time))::date AS cohort_month
    FROM orders_raw
    GROUP BY customer_id
)
SELECT 
    cohort_month,
    COUNT(DISTINCT customer_id) AS cohort_customer_count
FROM cohorts
GROUP BY cohort_month
ORDER BY cohort_month;
```
</details>

---

## Section Recaps

*   Different SQL engines use distinct date syntaxes. Make sure to consult your dialect's documentation.
*   **`EXTRACT()` and `DATEPART()`** pull numeric units (such as year or month) out of timestamps.
*   **`DATE_TRUNC()`** rolls timestamps back to the start of a specified interval (e.g., the first day of the month), which is ideal for grouping trends.
*   Subtracting timestamps in PostgreSQL yields an integer representing days. To get months or years, use the `AGE()` function.
*   When filtering timestamps, use range bounding (`>=` and `<`) instead of casting columns to dates to preserve index optimization.

---

## Common Interview Questions

### Q1: How do you group data by month in PostgreSQL versus SQL Server?

**Answer:**
*   In **PostgreSQL**, use the `DATE_TRUNC` function:
    ```sql
    SELECT DATE_TRUNC('month', order_date), SUM(amount) 
    FROM orders GROUP BY 1;
    ```
*   In **SQL Server**, you can use the `DATETRUNC` function (introduced in SQL Server 2022) or isolate and combine the date parts:
    ```sql
    SELECT DATEFROMPARTS(YEAR(order_date), MONTH(order_date), 1), SUM(amount)
    FROM orders GROUP BY YEAR(order_date), MONTH(order_date);
    ```

---

### Q2: Explain why adding 1 month is different from adding 30 days.

**Answer:**
*   Adding **30 days** increments the date value by exactly 30 cycles of 24 hours. Because months have different lengths (28, 29, 30, or 31 days), this can jump over calendar boundaries unevenly. For example, February 1st + 30 days is March 3rd (or March 2nd in a leap year).
*   Adding **1 month** shifts the date indicator directly to the same numeric day in the next calendar month. February 1st + 1 month is March 1st. 

---

### Q3: How do you write a query to calculate customer churn window (e.g. inactive for > 90 days)?

**Answer:**
You find the difference between the current date and the customer's maximum order date:

```sql
SELECT 
    customer_id,
    MAX(order_date)::date AS last_purchase_date,
    (CURRENT_DATE - MAX(order_date)::date) AS days_inactive
FROM orders
GROUP BY customer_id
HAVING (CURRENT_DATE - MAX(order_date)::date) > 90;
```

---

### Q4: What is the SQL Server DATEDIFF boundary-crossing trap, and how do you avoid it?

**Answer:**
`DATEDIFF` in SQL Server counts the number of date boundaries crossed rather than the elapsed time. 
For example, `DATEDIFF(year, '2025-12-31', '2026-01-01')` returns `1` year even though the elapsed time was only 24 hours. 
To avoid this boundary crossing trap when you need exact time intervals, measure the difference in a smaller unit (such as days or hours) and divide by the number of units per period (e.g., dividing total days by 365.25 to calculate years).

---

### Q5: Why can a query filter like `WHERE date_column = '2024-05-01'` fail to return records with timestamps?

**Answer:**
If the database column contains timestamps (which include hours, minutes, and seconds), a date-only string like `'2024-05-01'` is implicitly cast to `'2024-05-01 00:00:00'`. 
Any records created later in the day (for instance, `'2024-05-01 08:30:00'`) will fail the equality check. To fix this, you must cast the column to a date: `WHERE date_column::date = '2024-05-01'`, or filter using a range: `WHERE date_column >= '2024-05-01' AND date_column < '2024-05-02'`.
