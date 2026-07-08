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

## Introduction & The "Why"

Imagine a single-file line of hikers climbing a mountain trail. 

```text
 Hiker A (Lead)  <-- FIRST_VALUE
      ▲
      │ (Looking forward)
 Hiker B        <-- LEAD (looks 1 ahead)
      ▲
      │ (Looking backward)
 Hiker C        <-- Current Position
      ▲
      │ (Looking backward)
 Hiker D        <-- LAG (looks 1 behind)
      ▲
      │
 Hiker E (Tail)  <-- LAST_VALUE (using correct boundaries)
```

If you are **Hiker C** standing on the trail, you might want to know:
*   *What was the altitude of the person directly behind you?* You look over your shoulder at **Hiker D**. In SQL, this is **`LAG()`**.
*   *What is the altitude of the person directly ahead of you?* You look forward at **Hiker B**. In SQL, this is **`LEAD()`**.
*   *What is the altitude of the trail guide at the very front of the line?* That is **`FIRST_VALUE()`**.
*   *What is the altitude of the safety sweeper at the absolute end of the line?* That is **`LAST_VALUE()`**.

In data analytics, rows are typically evaluated in isolation. But businesses thrive on comparisons over time. To answer questions like:
*   *"Is our revenue growing or shrinking compared to last month?"*
*   *"Did this customer buy a cheaper or more expensive product in their next transaction?"*
*   *"How much time did a user spend on our website before navigating to their next page?"*

To solve these queries, you must compare values between different rows. Without window functions, this requires joining a table to itself—an operation that is slow to execute and painful to write. Value window functions (`LAG`, `LEAD`, `FIRST_VALUE`, `LAST_VALUE`) make inter-row comparisons fast and simple.

---

## Step-by-Step Concept Breakdown

### The Syntax of LAG() and LEAD()

Both `LAG` and `LEAD` share the exact same syntactic structure:

```sql
LAG(column_name [, offset [, default_val]]) OVER (
    [PARTITION BY partition_column]
    ORDER BY sort_column
)
```

Let's dissect the parameters inside the function:

#### 1. `column_name`
The column containing the data you want to retrieve from the target row.

#### 2. `offset` (Optional)
The physical distance (in rows) to look back or forward. 
*   An offset of `1` looks at the immediate previous/next row.
*   An offset of `3` looks three rows back/ahead.
*   *Default*: If omitted, the offset defaults to `1`.

#### 3. `default_val` (Optional)
The backup value to return if the offset points to a row outside the boundaries of your partition. For instance, the very first row of a partition has no previous row.
*   *Default*: If omitted, this defaults to `NULL`. You can override this with values like `0`, `'-'`, or specific timestamps, provided the default value matches the data type of the target column.

---

### Period-Over-Period Growth Mechanics

The most frequent use case for `LAG` is calculating growth percentages. The math is simple:

$$\text{Growth Percentage} = \frac{\text{Current Value} - \text{Previous Value}}{\text{Previous Value}} \times 100$$

However, translating this math directly into SQL exposes a major vulnerability: **Division by Zero**. If your previous period had zero sales, your query will crash.

#### The Safe Growth Pattern:
To write a bulletproof growth calculation, combine `LAG` with `NULLIF`:

```sql
(current_val - LAG(current_val) OVER(...)) * 100.0 / NULLIF(LAG(current_val) OVER(...), 0)
```

`NULLIF(expression, value)` returns `NULL` if the expression matches the value. In our formula, if the previous value is `0`, `NULLIF` turns it into `NULL`. Because dividing any number by `NULL` returns `NULL` instead of failing, the query completes successfully.

---

### FIRST_VALUE() vs. LAST_VALUE() Frame Trap

`FIRST_VALUE(col)` and `LAST_VALUE(col)` extract the initial and terminal values from the window. While `FIRST_VALUE` usually works as expected, `LAST_VALUE` is a common source of bugs for beginners due to the default frame behavior.

Recall that when you define an `ORDER BY` in a window function, SQL defaults the frame specification to:
```sql
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```

Look closely at where that frame ends: **`CURRENT ROW`**.

If you run `LAST_VALUE` on this default frame:
1.  On Row 1: The frame contains only Row 1. The last value is Row 1.
2.  On Row 2: The frame contains Row 1 and Row 2. The last value is Row 2.
3.  On Row 3: The frame contains Row 1, Row 2, and Row 3. The last value is Row 3.

Because the window's end boundary moves as you slide down the table, `LAST_VALUE` simply returns the value of the **current row**.

```text
Default Window Frame:
[Row 1, Row 2, Row 3 (Current)] --> LAST_VALUE looks here and returns Row 3.
```

#### The Fix:
To make `LAST_VALUE` scan the entire partition from start to finish, you must explicitly expand the frame to cover the entire group:

```sql
LAST_VALUE(column) OVER (
    PARTITION BY group_column
    ORDER BY sort_column
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
```

```text
Expanded Window Frame:
[Row 1, Row 2, Row 3 (Current), Row 4, Row 5] --> LAST_VALUE looks all the way to Row 5!
```

---

## Code / Practical Walkthroughs

We will run our walkthroughs using three tables: `monthly_metrics`, `user_events`, and `order_sequences`.

### Schema Setup

```sql
-- Create monthly_metrics table
CREATE TABLE monthly_metrics (
    metric_date DATE,
    product VARCHAR(50),
    revenue DECIMAL(10,2),
    signups INT
);

INSERT INTO monthly_metrics VALUES
('2024-01-01', 'CRM Pro', 180000.00, 120),
('2024-02-01', 'CRM Pro', 202500.00, 135),
('2024-03-01', 'CRM Pro', 147000.00, 98),
('2024-04-01', 'CRM Pro', 225000.00, 150),
('2024-05-01', 'CRM Pro', 213000.00, 142),
('2024-06-01', 'CRM Pro', 252000.00, 168),
('2024-01-01', 'Analytics Hub', 135000.00, 45),
('2024-02-01', 'Analytics Hub', 156000.00, 52),
('2024-03-01', 'Analytics Hub', 114000.00, 38),
('2024-04-01', 'Analytics Hub', 183000.00, 61),
('2024-05-01', 'Analytics Hub', 165000.00, 55),
('2024-06-01', 'Analytics Hub', 210000.00, 70);

-- Create user_events table
CREATE TABLE user_events (
    user_id INT,
    event_type VARCHAR(50),
    event_time TIMESTAMP
);

INSERT INTO user_events VALUES
(1001, 'login', '2024-03-15 09:00:00'),
(1001, 'page_view', '2024-03-15 09:05:00'),
(1001, 'purchase', '2024-03-15 09:12:00'),
(1001, 'login', '2024-03-15 14:30:00'),
(1001, 'page_view', '2024-03-15 14:35:00'),
(1002, 'login', '2024-03-15 10:00:00'),
(1002, 'page_view', '2024-03-15 10:02:00'),
(1002, 'page_view', '2024-03-15 10:08:00'),
(1002, 'purchase', '2024-03-15 10:15:00');

-- Create order_sequences table
CREATE TABLE order_sequences (
    order_id INT PRIMARY KEY
);

INSERT INTO order_sequences VALUES
(5001), (5002), (5003), (5005), (5006), (5009);
```

---

### Walkthrough 1: Month-over-Month Revenue Growth Percentage

Let's calculate the Month-over-Month (MoM) revenue growth for each product. We want to show the current revenue, the previous month's revenue, and the percentage difference.

#### Query:

```sql
SELECT 
    metric_date,
    product,
    revenue,
    -- Pull previous month's revenue
    LAG(revenue, 1) OVER (
        PARTITION BY product
        ORDER BY metric_date
    ) AS previous_month_revenue,
    -- Calculate growth percentage, utilizing NULLIF for safety
    ROUND(
        (revenue - LAG(revenue, 1) OVER (
            PARTITION BY product
            ORDER BY metric_date
        )) * 100.0 / 
        NULLIF(LAG(revenue, 1) OVER (
            PARTITION BY product
            ORDER BY metric_date
        ), 0),
        2
    ) AS mom_growth_pct
FROM monthly_metrics;
```

```text
# Output:
metric_date | product       | revenue   | previous_month_revenue | mom_growth_pct
------------|---------------|-----------|------------------------|---------------
2024-01-01  | Analytics Hub | 135000.00 | NULL                   | NULL
2024-02-01  | Analytics Hub | 156000.00 | 135000.00              | 15.56
2024-03-01  | Analytics Hub | 114000.00 | 156000.00              | -26.92
2024-04-01  | Analytics Hub | 183000.00 | 114000.00              | 60.53
2024-05-01  | Analytics Hub | 165000.00 | 183000.00              | -9.84
2024-06-01  | Analytics Hub | 210000.00 | 165000.00              | 27.27
2024-01-01  | CRM Pro       | 180000.00 | NULL                   | NULL
2024-02-01  | CRM Pro       | 202500.00 | 180000.00              | 12.50
2024-03-01  | CRM Pro       | 147000.00 | 202500.00              | -27.41
2024-04-01  | CRM Pro       | 225000.00 | 147000.00              | 53.06
2024-05-01  | CRM Pro       | 213000.00 | 225000.00              | -5.33
2024-06-01  | CRM Pro       | 252000.00 | 213000.00              | 18.31
```

#### Step-by-Step Logic Breakdown:
1.  The query partitions the table by `product` to avoid comparing revenue across different product lines.
2.  `ORDER BY metric_date` sorts rows chronologically.
3.  On row 1 (`2024-01-01`), `LAG(revenue, 1)` yields `NULL` because there is no preceding month. The growth percentage also returns `NULL`.
4.  On row 2 (`2024-02-01`), `LAG` returns $135,000.00. The math runs: `(156000.00 - 135000.00) * 100.0 / 135000.00` = `15.56%`.
5.  This comparison continues down the partition.

---

### Walkthrough 2: Baseline vs. Current Month Comparison

Let's compute how each month's sales compare to the product's launch month (the very first month in our dataset) as well as the target projection (defined here as the final month).

#### Query:

```sql
SELECT 
    metric_date,
    product,
    revenue,
    -- First month revenue (Baseline)
    FIRST_VALUE(revenue) OVER (
        PARTITION BY product
        ORDER BY metric_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS launch_month_revenue,
    -- Last month revenue (Target) - REQUIRES EXPLICIT FRAME
    LAST_VALUE(revenue) OVER (
        PARTITION BY product
        ORDER BY metric_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS final_month_revenue
FROM monthly_metrics;
```

```text
# Output:
metric_date | product       | revenue   | launch_month_revenue | final_month_revenue
------------|---------------|-----------|----------------------|--------------------
2024-01-01  | Analytics Hub | 135000.00 | 135000.00            | 210000.00
2024-02-01  | Analytics Hub | 156000.00 | 135000.00            | 210000.00
2024-03-01  | Analytics Hub | 114000.00 | 135000.00            | 210000.00
2024-04-01  | Analytics Hub | 183000.00 | 135000.00            | 210000.00
2024-05-01  | Analytics Hub | 165000.00 | 135000.00            | 210000.00
2024-06-01  | Analytics Hub | 210000.00 | 135000.00            | 210000.00
2024-01-01  | CRM Pro       | 180000.00 | 180000.00            | 252000.00
...
```

#### Step-by-Step Logic Breakdown:
1.  The `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` overrides the default sliding frame. It expands the search area to include the entire partition for all rows.
2.  `FIRST_VALUE` evaluates the sorted rows and returns the first value ($135,000 for Analytics Hub).
3.  `LAST_VALUE` evaluates the sorted rows and returns the last value in the partition ($210,000 for Analytics Hub).

---

### Walkthrough 3: Sequence Gap Detection

Audit teams look for gaps in document sequences (like invoices or order numbers) to detect data loss, fraud, or system failures. Let's find missing IDs in `order_sequences`.

#### Query:

```sql
WITH order_gaps AS (
    SELECT 
        order_id,
        -- Peek at the next physical order_id
        LEAD(order_id, 1) OVER (
            ORDER BY order_id
        ) AS next_order_id
    FROM order_sequences
)
SELECT 
    order_id AS gap_start,
    next_order_id AS gap_end,
    -- Subtract current from next to calculate missing count
    (next_order_id - order_id - 1) AS missing_count
FROM order_gaps
WHERE (next_order_id - order_id) > 1;
```

```text
# Output:
gap_start | gap_end | missing_count
----------|---------|--------------
5003      | 5005    | 1
5006      | 5009    | 2
```

#### Step-by-Step Logic Breakdown:
1.  The CTE uses `LEAD(order_id, 1)` to look at the next order ID.
2.  For ID `5003`, the next ID is `5005`.
3.  The outer query evaluates `WHERE (next_order_id - order_id) > 1`.
4.  For row `5003`: `5005 - 5003 = 2` (which is greater than 1).
5.  It calculates the missing count: `5005 - 5003 - 1` = `1` missing order (specifically ID `5004`).

---

### Walkthrough 4: Advanced User Sessionization

In product analytics, we group user events into unique "sessions." A session ends if a user is inactive for 30 minutes or more.

#### Query:

```sql
WITH time_differences AS (
    SELECT 
        user_id,
        event_type,
        event_time,
        -- Fetch timestamp of the previous action
        LAG(event_time) OVER (
            PARTITION BY user_id
            ORDER BY event_time
        ) AS previous_event_time
    FROM user_events
),
session_boundaries AS (
    SELECT 
        user_id,
        event_type,
        event_time,
        -- Convert timestamp differences to minutes.
        -- If no previous action exists, or if gap > 30 minutes, mark as a new session start (1)
        CASE 
            WHEN previous_event_time IS NULL THEN 1
            WHEN EXTRACT(EPOCH FROM (event_time - previous_event_time)) / 60 >= 30 THEN 1
            ELSE 0
        END AS new_session_start
    FROM time_differences
)
SELECT 
    user_id,
    event_type,
    event_time,
    -- Use running sum of session starts to assign a unique session ID
    SUM(new_session_start) OVER (
        PARTITION BY user_id
        ORDER BY event_time
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS session_id
FROM session_boundaries;
```

```text
# Output:
user_id | event_type | event_time          | session_id
--------|------------|---------------------|-----------
1001    | login      | 2024-03-15 09:00:00 | 1
1001    | page_view  | 2024-03-15 09:05:00 | 1
1001    | purchase   | 2024-03-15 09:12:00 | 1
1001    | login      | 2024-03-15 14:30:00 | 2           -- Gap is > 30 mins! Session ID increments
1001    | page_view  | 2024-03-15 14:35:00 | 2
1002    | login      | 2024-03-15 10:00:00 | 1
1002    | page_view  | 2024-03-15 10:02:00 | 1
1002    | page_view  | 2024-03-15 10:08:00 | 1
1002    | purchase   | 2024-03-15 10:15:00 | 1
```

#### Step-by-Step Logic Breakdown:
1.  **`time_differences` CTE**: Retrieves the prior event's timestamp using `LAG` partitioned by user.
2.  **`session_boundaries` CTE**: Computes elapsed minutes between events. If it is a new user's first event (`previous_event_time IS NULL`) or the difference exceeds 30 minutes, it outputs `1`. Otherwise, it outputs `0`.
3.  **Final Select**: Runs a cumulative running `SUM()` of the `new_session_start` column. Each time a `1` is encountered, the sum increments, generating sequential session IDs.

---

## Edge Cases & Common Mistakes

### 1. Partition Boundary Blindness
`LAG` and `LEAD` respect partition boundaries. If you partition by a column (like `product`), the function will never look outside that partition to fetch data.

If you omit the partition columns, or partition on the wrong columns, you will pull data from other products or regions, resulting in incorrect calculations.

*   **Rule of thumb**: Ask yourself, *"Should this row be compared to the row above it if they represent different customers/products?"* If the answer is no, you must use `PARTITION BY`.

---

### 2. Mismatched Default Types
When specifying a custom default value in `LAG` or `LEAD`, the datatype of the fallback value must match the target column's datatype exactly.

*   **Incorrect Code**:
    ```sql
    -- Will fail if revenue is a DECIMAL column
    LAG(revenue, 1, 'N/A') OVER(ORDER BY metric_date)
    ```
*   **Correct Code**:
    ```sql
    -- Use a numerical fallback value
    LAG(revenue, 1, 0.00) OVER(ORDER BY metric_date)
    ```

---

### 3. Missing Sort Order
`LAG` and `LEAD` require a clear sort order to determine which rows are "previous" or "next."
If you sort on non-unique columns, the physical row order is non-deterministic, making your `LAG`/`LEAD` values inconsistent. Always include a primary key or timestamp as a secondary sort column to guarantee consistent results.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Month-over-Month Signup Growth
**Goal**: Using the `monthly_metrics` table, calculate the month-over-month growth rate in product signups. Display the product, the month, the signup count, the previous month's signup count, and the signup growth rate.

*   *Hint*: Remember that signups are integers, but growth percentages require decimal precision.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    metric_date,
    product,
    signups,
    LAG(signups, 1) OVER (
        PARTITION BY product
        ORDER BY metric_date
    ) AS previous_month_signups,
    ROUND(
        (signups - LAG(signups, 1) OVER (
            PARTITION BY product
            ORDER BY metric_date
        )) * 100.0 / 
        NULLIF(LAG(signups, 1) OVER (
            PARTITION BY product
            ORDER BY metric_date
        ), 0),
        2
    ) AS signup_growth_pct
FROM monthly_metrics;
```
</details>

---

### Exercise 2: First-to-Last Transaction Difference
**Goal**: For each transaction in the West region, calculate the difference between the current transaction amount and the first transaction amount recorded in that region.

*   *Hint*: Use `FIRST_VALUE` to establish the baseline amount.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    metric_date,
    product,
    revenue,
    FIRST_VALUE(revenue) OVER (
        PARTITION BY product
        ORDER BY metric_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS initial_revenue,
    (revenue - FIRST_VALUE(revenue) OVER (
        PARTITION BY product
        ORDER BY metric_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    )) AS growth_from_baseline
FROM monthly_metrics;
```
</details>

---

### Exercise 3: User Activity Sequence Auditing
**Goal**: Given the `user_events` table, calculate the elapsed time in seconds between each page view event and the event that followed it for each user.

*   *Hint*: Use `LEAD` on the timestamp.

<details>
<summary>View Solution</summary>

```sql
WITH ordered_events AS (
    SELECT 
        user_id,
        event_type,
        event_time,
        LEAD(event_time) OVER (
            PARTITION BY user_id
            ORDER BY event_time
        ) AS next_event_time
    FROM user_events
)
SELECT 
    user_id,
    event_type,
    event_time,
    next_event_time,
    EXTRACT(EPOCH FROM (next_event_time - event_time)) AS seconds_to_next_event
FROM ordered_events;
```
</details>

---

## Section Recaps

*   **`LAG()`** pulls a value from a previous row in the partition.
*   **`LEAD()`** pulls a value from a subsequent row in the partition.
*   The default offset is `1`, and the default fallback value is `NULL`.
*   Always use `NULLIF(val, 0)` in growth rate denominators to prevent division-by-zero crashes.
*   **`FIRST_VALUE()`** returns the first value in the partition window.
*   **`LAST_VALUE()`** requires the explicit frame `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to prevent it from returning the current row's value.
*   Detect sequence gaps by comparing current values to the next value using `LEAD(id) - id`.

---

## Common Interview Questions

### Q1: What is the difference between LAG and LEAD?

**Answer:**
Both are value window functions used to reference other rows without performing a self-join:
*   `LAG()` retrieves data from a row that precedes the current row (looks backward).
*   `LEAD()` retrieves data from a row that follows the current row (looks forward).
Both allow you to specify an offset (number of rows to look back/ahead) and a default fallback value if the target row is out of bounds.

---

### Q2: Why does `LAST_VALUE()` return the current row's value instead of the final row?

**Answer:**
By default, the window frame when using `ORDER BY` is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. This means the window ends at the current row. 
Because the window does not contain any future rows, the "last" value in the window for the current row is the current row's value. To make `LAST_VALUE()` work correctly, you must explicitly set the frame to `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.

---

### Q3: Write a query to find the gap size in a sequence of primary keys.

**Answer:**
You can detect gaps by comparing the current key value to the next key value using `LEAD`.

```sql
WITH key_sequence AS (
    SELECT 
        id,
        LEAD(id) OVER (ORDER BY id) AS next_id
    FROM my_table
)
SELECT 
    id AS gap_starts_after,
    next_id AS gap_ends_before,
    (next_id - id - 1) AS missing_count
FROM key_sequence
WHERE (next_id - id) > 1;
```

---

### Q4: How do you prevent division-by-zero errors when calculating percentage differences?

**Answer:**
Use the `NULLIF` function on the denominator. If the denominator evaluates to zero, `NULLIF(denominator, 0)` converts it to `NULL`. Since any mathematical division by `NULL` yields `NULL` instead of failing, the query executes without throwing an error.

---

### Q5: How do LAG and LEAD behave when partition keys are changed?

**Answer:**
`LAG` and `LEAD` respect `PARTITION BY` boundaries. When the engine transitions to a new partition key, the window function resets. 
For `LAG`, the first row of a new partition will return `NULL` (or your defined default value), even if there is a row directly above it in the unsorted result set. For `LEAD`, the last row of a partition will return `NULL`.
