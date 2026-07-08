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

## Introduction & The "Why"

Imagine you are looking at a long strip of paper containing a list of daily e-commerce sales. 

*   If you wanted to calculate the grand total of all sales, you would use a standard `SUM(revenue)` aggregate. This collapses the paper into a single tiny scrap with one number on it.
*   Now, imagine placing a **sliding magnifying glass** over that strip of paper. 
    *   As you slide the magnifying glass down the list, day by day, you look through it and add up the sales of the current day and the previous days. 
    *   If you look from the very top of the list down to where the glass is currently sitting, you are calculating a **running total (cumulative sum)**.
    *   If you construct a magnifying glass with a fixed height—say, always looking at the current day and the 6 days directly above it—and calculate the average, you are calculating a **7-day rolling average**.

```text
Visualizing the Sliding Magnifying Glass (Frame):

Row 1: | $100 |  <-- Magnifying glass looks here. Total = $100
Row 2: | $150 |  <-- Glass slides down. Looks at Row 1 & 2. Total = $250
Row 3: | $200 |  <-- Glass slides down. Looks at Row 1, 2, & 3. Total = $450
Row 4: | $120 |  ...and so on.
```

In data analytics, calculating rolling trends is essential because business metrics fluctuate. A massive spike in signups on Monday followed by a drop on Tuesday doesn't tell you if the product is succeeding. A **7-day moving average** cuts through the "noise" of daily variation (like weekend dips) to reveal the true underlying trajectory. Similarly, **running totals** allow finance teams to track progress against monthly or quarterly goals in real-time.

Aggregate window functions—using `SUM()`, `AVG()`, `COUNT()`, `MIN()`, and `MAX()` combined with the `OVER()` clause—allow you to perform these sliding calculations seamlessly without collapsing your underlying data.

---

## Step-by-Step Concept Breakdown

### The Anatomy of an Aggregate Window Function

When we use an aggregate function like `SUM(column)` as a window function, the syntax looks like this:

```sql
SUM(column) OVER (
    [PARTITION BY group_column]
    ORDER BY sort_column
    [ROWS|RANGE frame_specification]
)
```

We already know `PARTITION BY` divides our data into buckets (like resetting the calculation for each region) and `ORDER BY` sorts the sequence of processing. The new concept here is the **Frame Specification**.

### The Frame Clause: Controlling the Magnifying Glass

The frame clause defines the physical boundaries of the "window" relative to the current row being processed. It tells the engine, *"Only look at these specific rows to calculate the aggregate for this row."*

The syntax starts with `ROWS BETWEEN [start_boundary] AND [end_boundary]`.

#### Frame Boundaries:
*   `UNBOUNDED PRECEDING`: The very first row of the partition.
*   `N PRECEDING`: `N` rows before the current row (e.g., `3 PRECEDING`).
*   `CURRENT ROW`: The current row itself.
*   `N FOLLOWING`: `N` rows after the current row (e.g., `2 FOLLOWING`).
*   `UNBOUNDED FOLLOWING`: The very last row of the partition.

Let's look at the most common frame setups used in production:

#### 1. Running Total (Cumulative)
```sql
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```
This is the default setting for running totals. It instructs the query engine to look at the start of the partition and include every row up to the current row.

#### 2. Trailing 3-Row Rolling Frame
```sql
ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
```
This creates a window of exactly 3 rows: the current row plus the 2 rows immediately above it. As the query processes each row, this window slides down, dropping the oldest row and adding the new current row.

#### 3. Centered 3-Row Rolling Frame
```sql
ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
```
This looks at the current row, the row directly before it, and the row directly after it. This is highly useful for smoothing out localized statistical fluctuations.

#### 4. Remaining Partition Frame
```sql
ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
```
This starts at the current row and looks all the way to the end of the partition. For instance, you can use this to calculate "remaining target budget" as you deduct expenses.

---

### ROWS vs. RANGE: The Dangerous Default

If you write a window aggregate with an `ORDER BY` but omit the frame clause, SQL uses a default setting:

```sql
-- This query:
SUM(revenue) OVER (ORDER BY sales_date)

-- Is interpreted by the database engine as:
SUM(revenue) OVER (
    ORDER BY sales_date 
    RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
```

Notice the keyword **`RANGE`** instead of **`ROWS`**. 

> [!WARNING]
> The difference between `ROWS` and `RANGE` can lead to subtle bugs and slow performance.
> *   `ROWS` operates on **physical rows**. It counts rows by their position (e.g., 2 rows before).
> *   `RANGE` operates on **value duplicates**. If multiple rows share the exact same value in the `ORDER BY` column (such as multiple sales occurring on the same day `2025-01-01`), `RANGE` groups them together. The running total will add all of these duplicates together and display the same cumulative sum for all of them.

#### The Duplication Trap Visualized:
Suppose we have two transactions of $50 and $100 on the same date:

| Date | Amount | ROWS Running Total | RANGE Running Total (Default) |
| :--- | :--- | :--- | :--- |
| 2025-01-01 | $50 | **$50** | **$150** (Sums both duplicate dates!) |
| 2025-01-01 | $100 | **$150** | **$150** (Sums both duplicate dates!) |
| 2025-01-02 | $20 | **$170** | **$170** |

Furthermore, `RANGE` is significantly slower than `ROWS` because the database engine must scan ahead to verify if there are duplicate values in the sorted column. 

**Best Practice**: Always explicitly specify your frame using `ROWS` when calculating running totals or moving averages to ensure deterministic behavior and maximum query speed.

---

## Code / Practical Walkthroughs

To execute these queries, we will use two datasets: `daily_revenue` (daily transaction records) and `monthly_sales` (aggregated monthly product performance).

### Schema Setup

```sql
-- Create daily_revenue table
CREATE TABLE daily_revenue (
    rev_date DATE,
    revenue DECIMAL(10,2),
    region VARCHAR(50)
);

-- Insert sample records
INSERT INTO daily_revenue VALUES
('2024-01-01', 5200.00, 'West'),
('2024-01-02', 3800.00, 'West'),
('2024-01-03', 6100.00, 'West'),
('2024-01-04', 4500.00, 'West'),
('2024-01-05', 7200.00, 'West'),
('2024-01-06', 3100.00, 'West'),
('2024-01-07', 5800.00, 'West'),
('2024-01-08', 4200.00, 'West'),
('2024-01-09', 6700.00, 'West'),
('2024-01-10', 5500.00, 'West'),
('2024-01-01', 4100.00, 'East'),
('2024-01-02', 3200.00, 'East'),
('2024-01-03', 5500.00, 'East'),
('2024-01-04', 4800.00, 'East'),
('2024-01-05', 6000.00, 'East');

-- Create monthly_sales table
CREATE TABLE monthly_sales (
    month_start DATE,
    product VARCHAR(50),
    units_sold INT,
    revenue DECIMAL(10,2)
);

-- Insert sample records
INSERT INTO monthly_sales VALUES
('2024-01-01', 'CRM Pro', 120, 180000.00),
('2024-02-01', 'CRM Pro', 135, 202500.00),
('2024-03-01', 'CRM Pro', 98, 147000.00),
('2024-04-01', 'CRM Pro', 150, 225000.00),
('2024-05-01', 'CRM Pro', 142, 213000.00),
('2024-06-01', 'CRM Pro', 168, 252000.00),
('2024-01-01', 'Analytics Hub', 45, 135000.00),
('2024-02-01', 'Analytics Hub', 52, 156000.00),
('2024-03-01', 'Analytics Hub', 38, 114000.00),
('2024-04-01', 'Analytics Hub', 61, 183000.00),
('2024-05-01', 'Analytics Hub', 55, 165000.00),
('2024-06-01', 'Analytics Hub', 70, 210000.00);
```

---

### Walkthrough 1: Running Totals (Cumulative SUM)

Let's calculate the cumulative running total of revenue for our regions. We want the sum to reset when transitioning from `East` to `West` region.

#### Query:

```sql
SELECT 
    rev_date,
    region,
    revenue,
    -- Reset running total per region, sort chronologically, sum cumulatively
    SUM(revenue) OVER (
        PARTITION BY region
        ORDER BY rev_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_revenue
FROM daily_revenue;
```

```text
# Output:
rev_date   | region | revenue  | cumulative_revenue
-----------|--------|----------|-------------------
2024-01-01 | East   | 4100.00  | 4100.00
2024-01-02 | East   | 3200.00  | 7300.00
2024-01-03 | East   | 5500.00  | 12800.00
2024-01-04 | East   | 4800.00  | 17600.00
('2024-01-05', 'East', 6000.00, 23600.00),
('2024-01-01', 'West', 5200.00, 5200.00), -- Reset occurs here!
('2024-01-02', 'West', 3800.00, 9000.00),
('2024-01-03', 'West', 6100.00, 15100.00),
('2024-01-04', 'West', 4500.00, 19600.00),
('2024-01-05', 'West', 7200.00, 26800.00),
('2024-01-06', 'West', 3100.00, 29900.00),
('2024-01-07', 'West', 5800.00, 35700.00),
('2024-01-08', 'West', 4200.00, 39900.00),
('2024-01-09', 'West', 6700.00, 46600.00),
('2024-01-10', 'West', 5500.00, 52100.00)
```

#### Step-by-Step Logic Breakdown:
1.  The query engine retrieves all rows from `daily_revenue`.
2.  `PARTITION BY region` splits the rows into two buckets: `East` and `West`.
3.  Inside the `East` bucket, rows are sorted by `rev_date`.
4.  For row 1 (`2024-01-01`), the window is only the first row. Cumulative revenue = $4,100.
5.  For row 2 (`2024-01-02`), the window expands to row 1 and row 2. Cumulative revenue = $4,100 + $3,200 = $7,300.
6.  This repeats until the end of the `East` partition.
7.  When processing transition to `West` region, the partition resets. The window clears, and calculations start over with $5,200 on `2024-01-01`.

---

### Walkthrough 2: Moving Averages (Trailing 3-Day Average)

Now let's calculate a rolling 3-day average of revenue for the West region. This calculation will smooth out the daily peaks and valleys.

#### Query:

```sql
SELECT 
    rev_date,
    revenue,
    -- Average the current day and the previous 2 days
    ROUND(
        AVG(revenue) OVER (
            ORDER BY rev_date
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 
        2
    ) AS rolling_3d_average
FROM daily_revenue
WHERE region = 'West';
```

```text
# Output:
rev_date   | revenue | rolling_3d_average
-----------|---------|-------------------
2024-01-01 | 5200.00 | 5200.00           -- Only 1 row in frame (5200 / 1)
2024-01-02 | 3800.00 | 4500.00           -- 2 rows in frame ((5200+3800) / 2)
2024-01-03 | 6100.00 | 5033.33           -- 3 rows in frame ((5200+3800+6100) / 3)
2024-01-04 | 4500.00 | 4800.00           -- Frame slides: Day 2, 3, 4 ((3800+6100+4500) / 3)
2024-01-05 | 7200.00 | 5933.33           -- Frame slides: Day 3, 4, 5 ((6100+4500+7200) / 3)
2024-01-06 | 3100.00 | 4933.33           -- Frame slides: Day 4, 5, 6
2024-01-07 | 5800.00 | 5366.67           -- Frame slides: Day 5, 6, 7
2024-01-08 | 4200.00 | 4366.67           -- Frame slides: Day 6, 7, 8
2024-01-09 | 6700.00 | 5566.67           -- Frame slides: Day 7, 8, 9
2024-01-10 | 5500.00 | 5466.67           -- Frame slides: Day 8, 9, 10
```

#### Step-by-Step Logic Breakdown:
1.  The `WHERE region = 'West'` clause filters the source data to only look at West region transactions.
2.  `ORDER BY rev_date` arranges the transactions chronologically.
3.  On the first day (`2024-01-01`), there are no preceding rows. The frame only contains the current row. The rolling average is $5,200 / 1 = $5,200.
4.  On the second day (`2024-01-02`), there is only 1 preceding row. The frame contains 2 rows. The rolling average is ($5,200 + $3,800) / 2 = $4,500.
5.  On the third day (`2024-01-03`), we have 2 preceding rows. The window is now full (3 rows). The rolling average is ($5,200 + $3,800 + $6,100) / 3 = $5,033.33.
6.  On the fourth day (`2024-01-04`), the window shifts. It drops the record from the first day (`2024-01-01`). The rolling average is ($3,800 + $6,100 + $4,500) / 3 = $4,800.00.

---

### Walkthrough 3: Percentage of Group Total (No Self-Joins)

We want to see the revenue contribution of each product for each month, expressed as a percentage of that month's total sales across all products.

#### Query:

```sql
SELECT 
    month_start,
    product,
    revenue,
    -- Calculate total monthly sales across all products by omitting ORDER BY
    SUM(revenue) OVER(
        PARTITION BY month_start
    ) AS total_monthly_sales,
    -- Divide individual row revenue by the monthly total
    ROUND(
        (revenue * 100.0) / SUM(revenue) OVER(PARTITION BY month_start),
        2
    ) AS contribution_percentage
FROM monthly_sales;
```

```text
# Output:
month_start | product       | revenue   | total_monthly_sales | contribution_percentage
------------|---------------|-----------|---------------------|------------------------
2024-01-01  | CRM Pro       | 180000.00 | 315000.00           | 57.14
2024-01-01  | Analytics Hub | 135000.00 | 315000.00           | 42.86
2024-02-01  | CRM Pro       | 202500.00 | 358500.00           | 56.49
2024-02-01  | Analytics Hub | 156000.00 | 358500.00           | 43.51
2024-03-01  | CRM Pro       | 147000.00 | 261000.00           | 56.32
2024-03-01  | Analytics Hub | 114000.00 | 261000.00           | 43.68
```

#### Step-by-Step Logic Breakdown:
1.  By using `PARTITION BY month_start` without an `ORDER BY` clause, we tell the query engine: *"Include the entire partition in the calculation window for every row in that partition."*
2.  For the `2024-01-01` partition, the engine sums the revenue of both CRM Pro ($180,000) and Analytics Hub ($135,000) to get $315,000.
3.  This sum ($315,000) is appended to both product rows as `total_monthly_sales`.
4.  The contribution percentage is evaluated for each row:
    *   CRM Pro: ($180,000 * 100) / $315,000 = 57.14%
    *   Analytics Hub: ($135,000 * 100) / $315,000 = 42.86%

---

## Edge Cases & Common Mistakes

### 1. The Duplicate Order Value Trap
If you calculate running totals using the default frame syntax on columns that have duplicate values, the calculations can yield unexpected results.

*   **Scenario**: You want to calculate running revenue ordered by transaction date, but multiple transactions occur on the same date.
*   **The Bug**:
    ```sql
    -- If two sales occur on 2024-01-01, both will show the combined total
    SELECT rev_date, revenue,
           SUM(revenue) OVER(ORDER BY rev_date) AS running_total
    FROM daily_revenue;
    ```
*   **The Solution**: Always add a unique row identifier as a secondary sorting field to guarantee predictable sorting and consistent execution.
    ```sql
    SELECT rev_date, revenue,
           SUM(revenue) OVER(
               ORDER BY rev_date, transaction_id -- unique tiebreaker
               ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
           ) AS running_total
    FROM daily_revenue;
    ```

---

### 2. Nulls in Aggregate Window Calculations
If you run window aggregates like `SUM()` or `AVG()` on a column that contains `NULL` values, the engine behaves in two ways:
*   The `NULL` values are excluded from the calculation. For example, if you run `AVG()` over three rows with values `10`, `NULL`, and `20`, the average is calculated as (10 + 20) / 2 = 15.
*   If all values in the window are `NULL`, the aggregate output will return `NULL`.

To handle this safely, you can use `COALESCE` to convert null values to 0 before calculating:
```sql
SUM(COALESCE(revenue, 0)) OVER (
    ORDER BY rev_date 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
```

---

### 3. Performance Cost of Large Frames
If you calculate a running total across millions of rows, the window size grows with each row. For the final row, the database engine must scan and aggregate the values of all preceding rows in that partition.

```text
Row 1: window size = 1 row
Row 1,000,000: window size = 1,000,000 rows
```

*   **Mitigation Strategy**: If you only need to display aggregated daily metrics, aggregate your raw transactional data into a summary table (or materialized view) *before* applying window functions. Running a window function on 365 daily rows is infinitely faster than running it on 10,000,000 transaction rows.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Trailing 7-Day Revenue Moving Average
**Goal**: Write a query that returns a rolling 7-day average of revenue for the West region. The output must include the date, daily revenue, and the moving average.

*   *Hint*: Remember that a 7-day window consists of the current row and 6 preceding rows.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    rev_date,
    revenue,
    ROUND(
        AVG(revenue) OVER (
            ORDER BY rev_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ), 
        2
    ) AS moving_avg_7d
FROM daily_revenue
WHERE region = 'West';
```
</details>

---

### Exercise 2: Year-to-Date (YTD) Revenue Resets
**Goal**: Using the `monthly_sales` table, calculate the Year-to-Date (YTD) running total of revenue for each product. The running total must reset at the start of each year.

*   *Hint*: Use `EXTRACT(YEAR FROM month_start)` inside your partition clause.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    month_start,
    product,
    revenue,
    SUM(revenue) OVER (
        PARTITION BY product, EXTRACT(YEAR FROM month_start)
        ORDER BY month_start
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS ytd_revenue
FROM monthly_sales;
```
</details>

---

### Exercise 3: Centered 3-Day Revenue Smoothing
**Goal**: Write a query that computes a centered 3-day average of revenue for the West region (averaging yesterday, today, and tomorrow).

*   *Hint*: Use both `PRECEDING` and `FOLLOWING` in your frame specification.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    rev_date,
    revenue,
    ROUND(
        AVG(revenue) OVER (
            ORDER BY rev_date
            ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
        ), 
        2
    ) AS centered_avg_3d
FROM daily_revenue
WHERE region = 'West';
```
</details>

---

## Section Recaps

*   **Aggregate window functions** allow you to calculate rolling sums, averages, and counts while keeping individual row details intact.
*   **The frame clause (`ROWS BETWEEN`)** acts as a sliding magnifying glass that defines the boundaries of your calculation.
*   **`ROWS` operates on physical rows** and is the preferred method for running calculations in production.
*   **`RANGE` operates on values** and is the default behavior when the frame is omitted. This can lead to calculations merging together on duplicate dates.
*   To calculate percentages of a group total, omit the `ORDER BY` clause inside `OVER()` to extend the window across the entire partition.
*   Minimize performance overhead by aggregating raw transactions into daily summaries before running window functions.

---

## Common Interview Questions

### Q1: What is a window frame, and how do you specify one?

**Answer:**
A window frame defines a subset of rows within the current partition that are included in the window function's calculation for the current row. It is specified using the `ROWS` or `RANGE` clause inside `OVER()`. 
For example, `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` instructs the engine to look only at the current row and the two rows immediately preceding it to calculate the aggregate.

---

### Q2: Explain the performance differences and execution results between ROWS and RANGE.

**Answer:**
*   **Execution Results**: `ROWS` selects rows based on their physical offset from the current row. `RANGE` selects rows based on their sorting values. If the sorted column has duplicate values, `RANGE` includes all duplicates in the calculation, which can return unexpected totals for ties.
*   **Performance**: `ROWS` is much faster because the database engine knows the physical offsets of the rows. `RANGE` requires the engine to scan ahead in the partition to check for duplicate values, which increases CPU and disk overhead.

---

### Q3: Write a query to calculate YTD sales using aggregates.

**Answer:**
To calculate Year-to-Date sales, you partition your window by the product (or dimension) and the calendar year, and use a cumulative sum.

```sql
SELECT 
    sales_date,
    product_id,
    revenue,
    SUM(revenue) OVER (
        PARTITION BY product_id, EXTRACT(YEAR FROM sales_date)
        ORDER BY sales_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS ytd_sales
FROM sales_table;
```

---

### Q4: What happens if there are nulls in your rolling sum columns?

**Answer:**
Aggregate window functions like `SUM()` and `AVG()` ignore `NULL` values when performing calculations. If a row in the window contains a `NULL`, it is excluded from the calculation, and the denominator in functions like `AVG()` is adjusted accordingly. If all values in the window are `NULL`, the function returns `NULL`. You can use `COALESCE(column, 0)` to convert null values to zero before calculating if needed.

---

### Q5: How do you optimize a query calculating moving averages on a table with 10 million records?

**Answer:**
1.  **Index Optimization**: Create a composite index that matches your window definition: the partition columns first, followed by the sorting columns (e.g. `(region, sales_date)`).
2.  **Pre-Aggregation**: Avoid running window averages on raw, granular transaction-level records. First, aggregate the transactions into a daily summary table, and then run your window calculations on this smaller pre-aggregated dataset.
3.  **Use ROWS instead of RANGE**: Ensure you explicitly define your window using `ROWS` rather than leaving it to the slower `RANGE` default.
