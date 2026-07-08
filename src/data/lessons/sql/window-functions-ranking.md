---
title: "Window Functions — ROW_NUMBER, RANK, DENSE_RANK"
description: "Rank rows, assign sequence numbers, and create percentiles — the advanced SQL that separates juniors from seniors."
category: "sql"
order: 101
phase: 2
tags: ["sql", "window-functions", "rank", "row-number"]
publishedDate: 2025-03-01
prevSlug: "case-statements"
nextSlug: "window-functions-aggregate"
seoTitle: "SQL Window Functions — RANK Tutorial | Datalogify"
seoDescription: "Master SQL ROW_NUMBER, RANK, DENSE_RANK, NTILE — ranking rows with OVER and PARTITION BY."
---

## Why This Matters

"Show me the top 3 salespeople in each region." "Deduplicate these customer records — keep the most recent one." "Split these accounts into quartiles by revenue." — every one of these requires window functions. This is the #1 skill that separates junior analysts from senior ones in SQL interviews.

## The Tables We're Working With

```sql
-- sales table
-- | sale_id | rep_id | product       | amount  | sale_date  | region |
-- |---------|--------|---------------|---------|------------|--------|
-- | 1       | 101    | CRM Pro       | 15000   | 2024-01-15 | West   |
-- | 2       | 102    | CRM Pro       | 12500   | 2024-01-22 | East   |
-- | 3       | 101    | Analytics Hub | 28000   | 2024-02-03 | West   |
-- | 4       | 103    | CRM Pro       | 15000   | 2024-02-18 | East   |
-- | 5       | 104    | Data Vault    | 8500    | 2024-03-07 | South  |
-- | 6       | 102    | Analytics Hub | 28000   | 2024-03-12 | West   |
-- | 7       | 103    | CRM Pro       | 12500   | 2024-04-01 | North  |
-- | 8       | 104    | CRM Pro       | 15000   | 2024-04-15 | West   |
-- | 9       | 101    | Data Vault    | 8500    | 2024-05-02 | East   |
-- | 10      | 103    | Analytics Hub | 28000   | 2024-05-20 | North  |

-- employees table
-- | emp_id | name           | department | salary | hire_date  |
-- |--------|----------------|------------|--------|------------|
-- | 1      | Sarah Chen     | Sales      | 85000  | 2022-01-15 |
-- | 2      | James Wilson   | Sales      | 78000  | 2022-06-01 |
-- | 3      | Priya Patel    | Sales      | 85000  | 2023-03-10 |
-- | 4      | Mike Johnson   | Marketing  | 72000  | 2021-08-20 |
-- | 5      | Lisa Park      | Marketing  | 72000  | 2022-11-05 |
-- | 6      | David Kim      | Marketing  | 68000  | 2023-07-15 |
-- | 7      | Emma Davis     | Engineering| 95000  | 2021-03-01 |
-- | 8      | Alex Turner    | Engineering| 92000  | 2022-09-12 |
-- | 9      | Nina Sharma    | Engineering| 88000  | 2023-06-20 |
```

## The OVER() Clause — What Makes a Window Function

A window function performs a calculation **across a set of rows related to the current row** — but unlike GROUP BY, it **doesn't collapse rows**. Every row keeps its identity.

```sql
-- Regular aggregate: collapses rows
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;
```

```text
department  | avg_salary
------------|----------
Sales       | 82666.67
Marketing   | 70666.67
Engineering | 91666.67
```

```sql
-- Window function: keeps every row, adds the calculation
SELECT name, department, salary,
       AVG(salary) OVER() AS company_avg
FROM employees;
```

```text
name         | department  | salary | company_avg
-------------|-------------|--------|------------
Sarah Chen   | Sales       | 85000  | 81666.67
James Wilson | Sales       | 78000  | 81666.67
Priya Patel  | Sales       | 85000  | 81666.67
Mike Johnson | Marketing   | 72000  | 81666.67
Lisa Park    | Marketing   | 72000  | 81666.67
David Kim    | Marketing   | 68000  | 81666.67
Emma Davis   | Engineering | 95000  | 81666.67
Alex Turner  | Engineering | 92000  | 81666.67
Nina Sharma  | Engineering | 88000  | 81666.67
```

Every row still shows up. The aggregate is calculated across **all rows** and attached to each one.

## PARTITION BY — Grouping Without Collapsing

PARTITION BY defines the "window" — which rows to include in the calculation for each row.

```sql
SELECT name, department, salary,
       AVG(salary) OVER(PARTITION BY department) AS dept_avg
FROM employees;
```

```text
name         | department  | salary | dept_avg
-------------|-------------|--------|---------
Sarah Chen   | Sales       | 85000  | 82666.67
James Wilson | Sales       | 78000  | 82666.67
Priya Patel  | Sales       | 85000  | 82666.67
Mike Johnson | Marketing   | 72000  | 70666.67
Lisa Park    | Marketing   | 72000  | 70666.67
David Kim    | Marketing   | 68000  | 70666.67
Emma Davis   | Engineering | 95000  | 91666.67
Alex Turner  | Engineering | 92000  | 91666.67
Nina Sharma  | Engineering | 88000  | 91666.67
```

Now each row sees the average **for its own department**. Think of PARTITION BY as "GROUP BY for window functions."

## ROW_NUMBER() — Assign Unique Sequential Numbers

ROW_NUMBER() assigns 1, 2, 3... to each row within the partition. **No ties** — even if values are identical, each row gets a unique number.

```sql
SELECT name, department, salary,
       ROW_NUMBER() OVER(ORDER BY salary DESC) AS row_num
FROM employees;
```

```text
name         | department  | salary | row_num
-------------|-------------|--------|--------
Emma Davis   | Engineering | 95000  | 1
Alex Turner  | Engineering | 92000  | 2
Nina Sharma  | Engineering | 88000  | 3
Sarah Chen   | Sales       | 85000  | 4
Priya Patel  | Sales       | 85000  | 5
James Wilson | Sales       | 78000  | 6
Mike Johnson | Marketing   | 72000  | 7
Lisa Park    | Marketing   | 72000  | 8
David Kim    | Marketing   | 68000  | 9
```

Notice Sarah and Priya both earn 85000, but they get **different** numbers (4 and 5). Which one gets 4 is **non-deterministic** — the database picks arbitrarily.

### ROW_NUMBER with PARTITION BY

```sql
SELECT name, department, salary,
       ROW_NUMBER() OVER(
           PARTITION BY department
           ORDER BY salary DESC
       ) AS dept_rank
FROM employees;
```

```text
name         | department  | salary | dept_rank
-------------|-------------|--------|---------
Emma Davis   | Engineering | 95000  | 1
Alex Turner  | Engineering | 92000  | 2
Nina Sharma  | Engineering | 88000  | 3
Mike Johnson | Marketing   | 72000  | 1
Lisa Park    | Marketing   | 72000  | 2
David Kim    | Marketing   | 68000  | 3
Sarah Chen   | Sales       | 85000  | 1
Priya Patel  | Sales       | 85000  | 2
James Wilson | Sales       | 78000  | 3
```

The numbering **restarts at 1** for each department. This is the foundation for "top N per group" queries.

## RANK() vs DENSE_RANK() — Handling Ties

This is the #1 interview question about window functions. Know the difference cold.

```sql
SELECT name, department, salary,
       ROW_NUMBER() OVER(ORDER BY salary DESC) AS row_num,
       RANK()       OVER(ORDER BY salary DESC) AS rank_val,
       DENSE_RANK() OVER(ORDER BY salary DESC) AS dense_rank_val
FROM employees;
```

```text
name         | salary | row_num | rank_val | dense_rank_val
-------------|--------|---------|----------|--------------
Emma Davis   | 95000  | 1       | 1        | 1
Alex Turner  | 92000  | 2       | 2        | 2
Nina Sharma  | 88000  | 3       | 3        | 3
Sarah Chen   | 85000  | 4       | 4        | 4
Priya Patel  | 85000  | 5       | 4        | 4
James Wilson | 78000  | 6       | 6        | 5
Mike Johnson | 72000  | 7       | 7        | 6
Lisa Park    | 72000  | 8       | 7        | 6
David Kim    | 68000  | 9       | 9        | 7
```

| Function     | Ties?          | Gaps after ties? |
|-------------|----------------|-----------------|
| ROW_NUMBER  | No ties ever   | N/A             |
| RANK        | Yes, same rank | Yes (skips)     |
| DENSE_RANK  | Yes, same rank | No (consecutive)|

- **ROW_NUMBER**: 1, 2, 3, 4, 5 — always unique
- **RANK**: 1, 2, 3, **4, 4**, 6 — ties get same rank, next rank skips
- **DENSE_RANK**: 1, 2, 3, **4, 4**, 5 — ties get same rank, next rank continues

<div class="interview-tip">

**Interview Favorite**: "What's the difference between RANK and DENSE_RANK?" 
**Answer**: Both assign the same rank to ties. RANK skips the next value (1,1,3), DENSE_RANK doesn't (1,1,2). Use DENSE_RANK when you need consecutive numbering — like "show top 3 salary levels" where you want exactly 3 distinct salary tiers.

</div>

## NTILE() — Split Rows Into Buckets

NTILE(n) divides rows into n roughly equal groups. Perfect for percentiles, quartiles, or creating customer segments.

```sql
SELECT name, salary,
       NTILE(4) OVER(ORDER BY salary DESC) AS quartile
FROM employees;
```

```text
name         | salary | quartile
-------------|--------|---------
Emma Davis   | 95000  | 1
Alex Turner  | 92000  | 1
Nina Sharma  | 88000  | 1
Sarah Chen   | 85000  | 2
Priya Patel  | 85000  | 2
James Wilson | 78000  | 3
Mike Johnson | 72000  | 3
Lisa Park    | 72000  | 4
David Kim    | 68000  | 4
```

Quartile 1 = top 25% earners. If rows don't divide evenly, the first groups get one extra row.

```sql
-- Assign customer value tiers
SELECT customer_id, total_spend,
       CASE NTILE(5) OVER(ORDER BY total_spend DESC)
           WHEN 1 THEN 'Platinum'
           WHEN 2 THEN 'Gold'
           WHEN 3 THEN 'Silver'
           WHEN 4 THEN 'Bronze'
           WHEN 5 THEN 'Basic'
       END AS tier
FROM customer_summary;
```

## PERCENT_RANK() and CUME_DIST()

```sql
SELECT name, salary,
       ROUND(PERCENT_RANK() OVER(ORDER BY salary), 2) AS pct_rank,
       ROUND(CUME_DIST()    OVER(ORDER BY salary), 2) AS cum_dist
FROM employees;
```

```text
name         | salary | pct_rank | cum_dist
-------------|--------|----------|---------
David Kim    | 68000  | 0.00     | 0.11
Mike Johnson | 72000  | 0.13     | 0.33
Lisa Park    | 72000  | 0.13     | 0.33
James Wilson | 78000  | 0.38     | 0.44
Sarah Chen   | 85000  | 0.50     | 0.67
Priya Patel  | 85000  | 0.50     | 0.67
Nina Sharma  | 88000  | 0.75     | 0.78
Alex Turner  | 92000  | 0.88     | 0.89
Emma Davis   | 95000  | 1.00     | 1.00
```

- **PERCENT_RANK**: (rank - 1) / (total_rows - 1). Ranges from 0 to 1.
- **CUME_DIST**: Percentage of rows with values ≤ current row. Always > 0.

## Deduplication with ROW_NUMBER — The Real-World Power Move

Duplicate records are everywhere in production data. ROW_NUMBER is the standard tool to remove them.

```sql
-- customer_emails has duplicates
-- | customer_id | email              | updated_at          |
-- |-------------|--------------------|---------------------|
-- | 1001        | sarah@email.com    | 2024-01-15 10:00:00 |
-- | 1001        | sarah.c@email.com  | 2024-03-20 14:30:00 |
-- | 1001        | sarah@newmail.com  | 2024-06-01 09:15:00 |
-- | 1002        | james@email.com    | 2024-02-10 11:00:00 |
-- | 1002        | j.wilson@email.com | 2024-04-05 16:45:00 |

-- Keep only the most recent email per customer
SELECT customer_id, email, updated_at
FROM (
    SELECT customer_id, email, updated_at,
           ROW_NUMBER() OVER(
               PARTITION BY customer_id
               ORDER BY updated_at DESC
           ) AS rn
    FROM customer_emails
) ranked
WHERE rn = 1;
```

```text
customer_id | email             | updated_at
------------|-------------------|--------------------
1001        | sarah@newmail.com | 2024-06-01 09:15:00
1002        | j.wilson@email.com| 2024-04-05 16:45:00
```

The pattern: ROW_NUMBER() partitioned by the duplicate key, ordered by recency, then filter `WHERE rn = 1`. You'll use this weekly in any analytics role.

<div class="interview-tip">

**Interview Pattern**: Deduplication with ROW_NUMBER shows up in 60%+ of SQL interviews. The pattern is always the same:
1. ROW_NUMBER() OVER(PARTITION BY [duplicate_key] ORDER BY [tiebreaker] DESC) AS rn
2. Wrap in subquery or CTE
3. WHERE rn = 1

</div>

## Top-N Per Group — The Classic Query

"Show me the top 2 highest-paid employees in each department."

```sql
WITH ranked AS (
    SELECT name, department, salary,
           ROW_NUMBER() OVER(
               PARTITION BY department
               ORDER BY salary DESC
           ) AS rn
    FROM employees
)
SELECT name, department, salary
FROM ranked
WHERE rn <= 2;
```

```text
name         | department  | salary
-------------|-------------|-------
Emma Davis   | Engineering | 95000
Alex Turner  | Engineering | 92000
Mike Johnson | Marketing   | 72000
Lisa Park    | Marketing   | 72000
Sarah Chen   | Sales       | 85000
Priya Patel  | Sales       | 85000
```

**When to use RANK instead**: If two people tie for 2nd place, ROW_NUMBER picks one arbitrarily. Use DENSE_RANK if you want to include all tied rows:

```sql
-- Include ALL employees tied at rank 2
WITH ranked AS (
    SELECT name, department, salary,
           DENSE_RANK() OVER(
               PARTITION BY department
               ORDER BY salary DESC
           ) AS dr
    FROM employees
)
SELECT name, department, salary
FROM ranked
WHERE dr <= 2;
```

## Where This Is Used in Real Jobs

| Scenario | Function | Why |
|----------|----------|-----|
| Deduplicating records | ROW_NUMBER | Pick one row per key |
| Top N per group | ROW_NUMBER or DENSE_RANK | Top 5 products per category |
| Customer segments | NTILE | Split into deciles/quartiles |
| Salary bands | PERCENT_RANK | Percentile-based compensation |
| Leaderboards | RANK | Show competition rankings |
| Data quality checks | ROW_NUMBER | Find and count duplicates |

<div class="challenge">

### Challenge 1: Sales Leaderboard
Using the sales table, rank each rep by total sales amount. Show each rep's total, their rank, and their dense rank. Order by total sales descending.

### Challenge 2: Top Product Per Region
Find the single best-selling product (by total amount) in each region. Use ROW_NUMBER to handle ties deterministically.

### Challenge 3: Quartile Analysis
Assign each employee to a salary quartile within their department. Show name, department, salary, and which quartile they fall in (1 = highest, 4 = lowest).

</div>

## Common Interview Questions

### Q1: What is the difference between ROW_NUMBER, RANK, and DENSE_RANK?

**Answer:** All three assign numbers to rows based on ORDER BY. ROW_NUMBER always assigns unique sequential numbers — no ties. RANK assigns the same number to ties but skips the next value (1, 1, 3). DENSE_RANK assigns the same number to ties without skipping (1, 1, 2). Use ROW_NUMBER for deduplication, RANK for competition-style rankings, and DENSE_RANK when you need consecutive numbering.

### Q2: How do you remove duplicate rows in SQL?

**Answer:** Use ROW_NUMBER() partitioned by the columns that define a duplicate, ordered by a tiebreaker column (like updated_at DESC). Wrap it in a CTE or subquery and filter WHERE rn = 1. This keeps exactly one row per duplicate group — typically the most recent.

### Q3: How would you find the top 3 products by revenue in each category?

**Answer:** Use ROW_NUMBER() or DENSE_RANK() with PARTITION BY category ORDER BY revenue DESC. Wrap in a CTE and filter WHERE rn <= 3. Use DENSE_RANK if you want all tied products at rank 3 included; use ROW_NUMBER if you want exactly 3 rows per category.

### Q4: What does NTILE(4) do and when would you use it?

**Answer:** NTILE(4) divides the ordered result set into 4 roughly equal groups, assigning values 1 through 4. Use it for quartile analysis, customer segmentation (top 25% = VIP), or any scenario where you need to bucket rows into equal-sized groups. If rows don't divide evenly, earlier groups get one extra row.

### Q5: Can you use window functions in a WHERE clause?

**Answer:** No. Window functions are evaluated after WHERE and GROUP BY. To filter on a window function result, wrap it in a subquery or CTE first, then filter in the outer query's WHERE clause. For example: `SELECT * FROM (SELECT *, ROW_NUMBER() OVER(...) AS rn FROM t) sub WHERE rn = 1`.
