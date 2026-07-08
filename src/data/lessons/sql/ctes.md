---
title: "CTEs — Common Table Expressions (WITH Clause)"
description: "Write cleaner, more readable complex queries with WITH clause — the modern alternative to subqueries."
category: "sql"
order: 9
phase: 2
tags: ["sql", "cte", "with-clause", "readable-queries"]
publishedDate: 2025-02-20
prevSlug: "subqueries"
nextSlug: "case-statements"
seoTitle: "SQL CTE Tutorial — WITH Clause | Datalogify"
seoDescription: "Master SQL CTEs (Common Table Expressions) — write cleaner queries with the WITH clause."
---

## Why This Matters

Take that 30-line nested subquery monster from the last lesson and rewrite it as a CTE. Suddenly it reads top-to-bottom like English. CTEs are the single biggest readability upgrade in SQL — they let you name intermediate steps, reference them multiple times, and build complex analysis one logical piece at a time. Every senior analyst and data engineer writes CTEs daily.

## The Tables We're Working With

```sql
-- employees table
-- | emp_id | name           | department  | salary | hire_date  | manager_id |
-- |--------|----------------|-------------|--------|------------|------------|
-- | 101    | Sarah Chen     | Analytics   | 95000  | 2021-03-15 | 201        |
-- | 102    | James Wilson   | Engineering | 115000 | 2020-06-01 | 201        |
-- | 103    | Priya Patel    | Analytics   | 88000  | 2022-01-10 | 201        |
-- | 104    | Marcus Brown   | Sales       | 72000  | 2023-05-20 | 102        |
-- | 105    | Lisa Zhang     | Engineering | 108000 | 2021-09-12 | 102        |
-- | 106    | David Kim      | Marketing   | 82000  | 2022-11-01 | 201        |
-- | 107    | Anna Kowalski  | Sales       | 68000  | 2024-02-14 | 104        |
-- | 108    | Tom Rivera     | Marketing   | 78000  | 2023-08-05 | 106        |

-- sales table
-- | sale_id | emp_id | product       | amount | sale_date  | region |
-- |---------|--------|---------------|--------|------------|--------|
-- | 1       | 104    | CRM Pro       | 15000  | 2024-01-15 | West   |
-- | 2       | 107    | Analytics Hub | 28000  | 2024-01-22 | East   |
-- | 3       | 104    | Data Vault    | 8500   | 2024-02-03 | West   |
-- | 4       | 107    | CRM Pro       | 15000  | 2024-02-18 | East   |
-- | 5       | 104    | CRM Pro       | 15000  | 2024-03-07 | South  |
-- | 6       | 107    | Analytics Hub | 28000  | 2024-03-25 | East   |
-- | 7       | 104    | Analytics Hub | 28000  | 2024-04-10 | West   |
-- | 8       | 107    | Data Vault    | 8500   | 2024-04-20 | East   |
-- | 9       | 104    | CRM Pro       | 15000  | 2024-05-05 | West   |
-- | 10      | 107    | CRM Pro       | 15000  | 2024-05-18 | East   |
```

## Your First CTE — The WITH Clause

A CTE is a named temporary result set defined with `WITH` that exists for the duration of one query.

```sql
WITH high_earners AS (
    SELECT name, department, salary
    FROM employees
    WHERE salary > 90000
)
SELECT * FROM high_earners;
```

```text
# Output:
name         | department  | salary
-------------|-------------|-------
Sarah Chen   | Analytics   | 95000
James Wilson | Engineering | 115000
Lisa Zhang   | Engineering | 108000
(3 rows)
```

That's the basic pattern: `WITH name AS (query) SELECT ... FROM name`. The CTE behaves like a temporary table — but it only exists during this one statement.

### CTE vs Subquery — Same Logic, Way Cleaner

Here's the same analysis written both ways:

```sql
-- Subquery version (hard to read)
SELECT dept_summary.department, dept_summary.avg_salary
FROM (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS dept_summary
WHERE dept_summary.avg_salary > (
    SELECT AVG(salary) FROM employees
);

-- CTE version (reads like a story)
WITH dept_summary AS (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
),
company_avg AS (
    SELECT AVG(salary) AS avg_salary
    FROM employees
)
SELECT d.department, d.avg_salary
FROM dept_summary d, company_avg c
WHERE d.avg_salary > c.avg_salary;
```

```text
# Output (both):
department  | avg_salary
------------|----------
Analytics   | 91500
Engineering | 111500
(2 rows)
```

The CTE version names each step: first calculate department averages, then calculate the company average, then compare. You can read it top-to-bottom.

## Multiple CTEs — Building Step by Step

Separate CTEs with commas. Each can reference the ones defined before it.

```sql
WITH
-- Step 1: Calculate each rep's total sales
rep_totals AS (
    SELECT
        emp_id,
        COUNT(*)        AS deal_count,
        SUM(amount)     AS total_revenue,
        AVG(amount)     AS avg_deal_size
    FROM sales
    GROUP BY emp_id
),
-- Step 2: Get employee details for reps
rep_details AS (
    SELECT
        e.name,
        e.department,
        e.salary,
        rt.deal_count,
        rt.total_revenue,
        rt.avg_deal_size
    FROM rep_totals rt
    JOIN employees e ON rt.emp_id = e.emp_id
),
-- Step 3: Calculate team-wide averages
team_avg AS (
    SELECT AVG(total_revenue) AS avg_team_revenue
    FROM rep_details
)
-- Final: Compare each rep to the team average
SELECT
    rd.name,
    rd.total_revenue,
    ta.avg_team_revenue,
    rd.total_revenue - ta.avg_team_revenue AS vs_average,
    rd.deal_count,
    ROUND(rd.avg_deal_size, 0)             AS avg_deal
FROM rep_details rd, team_avg ta
ORDER BY rd.total_revenue DESC;
```

```text
# Output:
name          | total_revenue | avg_team_revenue | vs_average | deal_count | avg_deal
--------------|---------------|------------------|------------|------------|--------
Anna Kowalski | 94500         | 90250            | 4250       | 5          | 18900
Marcus Brown  | 81500         | 90250            | -8750      | 5          | 16300
(2 rows)
```

Each CTE is one logical step. When you come back to this query in 3 months, you can read each CTE independently and understand what it does.

<div class="interview-tip">

**Where this is used in real jobs:** Multi-step CTEs are the standard pattern for building analytics reports. Step 1: aggregate raw data. Step 2: join with dimension tables. Step 3: calculate benchmarks. Step 4: produce the final comparison. This is how most complex dashboards get their data — not through one massive query, but through a chain of named intermediate steps.

</div>

## Referencing a CTE Multiple Times

Unlike derived tables (subqueries in FROM), you can reference a CTE multiple times in the same query. The database calculates it once and reuses it.

```sql
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', sale_date) AS month,
        SUM(amount)                    AS revenue
    FROM sales
    GROUP BY DATE_TRUNC('month', sale_date)
)
SELECT
    curr.month                          AS current_month,
    curr.revenue                        AS current_revenue,
    prev.revenue                        AS previous_revenue,
    curr.revenue - prev.revenue         AS month_over_month
FROM monthly_revenue curr
LEFT JOIN monthly_revenue prev
    ON curr.month = prev.month + INTERVAL '1 month'
ORDER BY curr.month;
```

```text
# Output:
current_month | current_revenue | previous_revenue | month_over_month
--------------|-----------------|------------------|------------------
2024-01-01    | 43000           | NULL             | NULL
2024-02-01    | 23500           | 43000            | -19500
2024-03-01    | 43000           | 23500            | 19500
2024-04-01    | 36500           | 43000            | -6500
2024-05-01    | 30000           | 36500            | -6500
(5 rows)
```

The `monthly_revenue` CTE is referenced twice — once as `curr` and once as `prev` — without running the aggregation twice. Try that with a subquery and you'd need to duplicate the entire GROUP BY block.

## CTEs with INSERT, UPDATE, DELETE

CTEs aren't just for SELECT. You can use them with data modification statements.

```sql
-- Archive old sales and delete them in one operation (PostgreSQL)
WITH archived AS (
    INSERT INTO sales_archive
    SELECT * FROM sales
    WHERE sale_date < '2024-03-01'
    RETURNING *
)
SELECT COUNT(*) AS rows_archived FROM archived;
```

```text
# Output:
rows_archived
--------------
3
```

```sql
-- Use a CTE to identify which rows to update
WITH low_performers AS (
    SELECT emp_id, SUM(amount) AS total_sales
    FROM sales
    GROUP BY emp_id
    HAVING SUM(amount) < 85000
)
UPDATE employees
SET department = 'Sales Training'
WHERE emp_id IN (SELECT emp_id FROM low_performers);
```

## Recursive CTEs — Hierarchical Data

This is where CTEs do something subqueries literally cannot. Recursive CTEs traverse hierarchical data — org charts, category trees, bill-of-materials.

### The Org Chart Problem

```sql
-- Build the management chain starting from James Wilson (emp_id 102)
WITH RECURSIVE org_tree AS (
    -- Base case: start with James Wilson
    SELECT emp_id, name, manager_id, 1 AS level
    FROM employees
    WHERE emp_id = 102

    UNION ALL

    -- Recursive step: find people who report to someone in our result
    SELECT e.emp_id, e.name, e.manager_id, ot.level + 1
    FROM employees e
    JOIN org_tree ot ON e.manager_id = ot.emp_id
)
SELECT
    level,
    name,
    emp_id,
    manager_id
FROM org_tree
ORDER BY level, name;
```

```text
# Output:
level | name          | emp_id | manager_id
------|---------------|--------|----------
1     | James Wilson  | 102    | 201
2     | Lisa Zhang    | 105    | 102
2     | Marcus Brown  | 104    | 102
3     | Anna Kowalski | 107    | 104
(4 rows)
```

James Wilson manages Lisa Zhang and Marcus Brown (level 2). Marcus Brown manages Anna Kowalski (level 3). The recursive CTE follows the chain automatically.

### How Recursive CTEs Work

1. **Base case:** The first SELECT (before UNION ALL) runs once to seed the result
2. **Recursive step:** The second SELECT runs repeatedly, joining against the growing result set
3. **Termination:** Stops when the recursive step returns zero new rows

```sql
-- Visualize the hierarchy with indentation
WITH RECURSIVE org_tree AS (
    SELECT emp_id, name, manager_id, 0 AS depth,
           name AS path
    FROM employees
    WHERE manager_id = 201  -- top-level reports

    UNION ALL

    SELECT e.emp_id, e.name, e.manager_id, ot.depth + 1,
           ot.path || ' → ' || e.name
    FROM employees e
    JOIN org_tree ot ON e.manager_id = ot.emp_id
)
SELECT
    REPEAT('  ', depth) || name AS org_chart,
    path
FROM org_tree
ORDER BY path;
```

```text
# Output:
org_chart        | path
-----------------|----------------------------------
David Kim        | David Kim
  Tom Rivera     | David Kim → Tom Rivera
James Wilson     | James Wilson
  Lisa Zhang     | James Wilson → Lisa Zhang
  Marcus Brown   | James Wilson → Marcus Brown
    Anna Kowalski| James Wilson → Marcus Brown → Anna Kowalski
Priya Patel      | Priya Patel
Sarah Chen       | Sarah Chen
(8 rows)
```

### Generating a Series with Recursive CTEs

```sql
-- Generate dates for a reporting calendar
WITH RECURSIVE date_series AS (
    SELECT DATE '2024-01-01' AS dt

    UNION ALL

    SELECT dt + INTERVAL '1 month'
    FROM date_series
    WHERE dt < DATE '2024-06-01'
)
SELECT dt AS report_month
FROM date_series;
```

```text
# Output:
report_month
------------
2024-01-01
2024-02-01
2024-03-01
2024-04-01
2024-05-01
2024-06-01
(6 rows)
```

This is useful for creating report frameworks where you need a row for every month, even months with no data.

<div class="interview-tip">

**Interview tip:** Recursive CTEs are a common interview topic for senior roles. The typical question: "How would you query an employee hierarchy?" or "Find all subcategories under a parent category." Know the base case + recursive step pattern. Mention the termination condition and that you'd add a safety `LIMIT` or max depth check to prevent infinite loops.

</div>

## CTE vs Subquery vs Temp Table

| Feature | CTE | Subquery | Temp Table |
|---------|-----|----------|------------|
| Readability | ⭐⭐⭐ Best | ⭐ Can nest deeply | ⭐⭐ Good |
| Reusable in same query | ✅ Yes | ❌ Must repeat | ✅ Yes (within session) |
| Recursive | ✅ Yes | ❌ No | ❌ No |
| Persists across queries | ❌ No | ❌ No | ✅ Yes |
| Indexable | ❌ No | ❌ No | ✅ Yes |
| Performance (usually) | Same as subquery | Same as CTE | Better for large reused datasets |

**Use CTEs** for readable, multi-step analysis within a single query.
**Use subqueries** for simple, one-off filters (WHERE x IN (SELECT ...)).
**Use temp tables** when you need to reuse results across multiple queries or need indexes for performance.

## Real Scenario — Monthly Sales Report

```sql
WITH
-- Step 1: Monthly totals per rep
monthly_rep AS (
    SELECT
        emp_id,
        DATE_TRUNC('month', sale_date)  AS month,
        SUM(amount)                      AS monthly_revenue,
        COUNT(*)                         AS deals
    FROM sales
    GROUP BY emp_id, DATE_TRUNC('month', sale_date)
),
-- Step 2: Running total per rep
rep_running AS (
    SELECT
        e.name,
        mr.month,
        mr.monthly_revenue,
        mr.deals,
        SUM(mr.monthly_revenue) OVER (
            PARTITION BY mr.emp_id ORDER BY mr.month
        ) AS cumulative_revenue
    FROM monthly_rep mr
    JOIN employees e ON mr.emp_id = e.emp_id
)
-- Step 3: Final report
SELECT
    name,
    month,
    monthly_revenue,
    deals,
    cumulative_revenue
FROM rep_running
ORDER BY name, month;
```

```text
# Output:
name          | month      | monthly_revenue | deals | cumulative_revenue
--------------|------------|-----------------|-------|-------------------
Anna Kowalski | 2024-01-01 | 28000           | 1     | 28000
Anna Kowalski | 2024-02-01 | 15000           | 1     | 43000
Anna Kowalski | 2024-03-01 | 28000           | 1     | 71000
Anna Kowalski | 2024-04-01 | 8500            | 1     | 79500
Anna Kowalski | 2024-05-01 | 15000           | 1     | 94500
Marcus Brown  | 2024-01-01 | 15000           | 1     | 15000
Marcus Brown  | 2024-02-01 | 8500            | 1     | 23500
Marcus Brown  | 2024-03-01 | 15000           | 1     | 38500
Marcus Brown  | 2024-04-01 | 28000           | 1     | 66500
Marcus Brown  | 2024-05-01 | 15000           | 1     | 81500
(10 rows)
```

<div class="challenge">

### Challenge: Department Budget Analysis

Write a query using CTEs that:
1. **CTE 1 (dept_costs):** Calculate each department's **total salary cost** (SUM of all employee salaries)
2. **CTE 2 (company_total):** Calculate the **total company-wide salary cost**
3. **Final query:** Show each department, its total salary cost, the company total, and what **percentage** of the total budget each department represents
4. Sort by percentage descending

**Expected output:**
```text
department  | dept_salary | company_total | pct_of_total
------------|-------------|---------------|-------------
Engineering | 223000      | 706000        | 31.6
Analytics   | 183000      | 706000        | 25.9
Marketing   | 160000      | 706000        | 22.7
Sales       | 140000      | 706000        | 19.8
(4 rows)
```

**Hint:** Use ROUND(dept_salary * 100.0 / company_total, 1) for the percentage.

</div>

## Common Interview Questions

### Q1: What is a CTE and why would you use one?

**Answer:** A CTE (Common Table Expression) is a named temporary result set defined with the WITH clause that exists only for the duration of a single SQL statement. You'd use it to: (1) break complex queries into readable, named steps, (2) reference the same aggregation multiple times without repeating code, (3) write recursive queries for hierarchical data, and (4) make queries easier to debug by testing each CTE independently. CTEs don't improve performance over subqueries — they improve readability and maintainability.

### Q2: Can you reference a CTE multiple times in the same query?

**Answer:** Yes, and this is one of the main advantages over subqueries. A CTE defined once can be referenced multiple times — for example, joining `monthly_totals` to itself for month-over-month comparisons. With a subquery, you'd have to duplicate the entire query. Note: whether the database materializes the CTE once or re-executes it varies — PostgreSQL 12+ lets you hint with `MATERIALIZED` / `NOT MATERIALIZED`.

### Q3: What is a recursive CTE and when would you use it?

**Answer:** A recursive CTE has two parts: a base case (the anchor) and a recursive step joined with UNION ALL. The recursive step references the CTE itself, allowing it to traverse hierarchical data — employee org charts, category trees, graph paths. It terminates when the recursive step produces no new rows. Always include a termination condition (like a depth limit) to prevent infinite loops. Use it when your data has parent-child relationships that go to unknown depths.

### Q4: Do CTEs improve query performance?

**Answer:** Generally no. In most databases, a CTE performs the same as the equivalent subquery — the optimizer often flattens CTEs into the main query. In PostgreSQL 11 and earlier, CTEs were always materialized (computed once), which could actually hurt performance if the CTE returned many rows but only a few were needed. PostgreSQL 12+ changed this. SQL Server and others inline CTEs by default. CTEs are a readability tool, not a performance tool. For performance, use temp tables with indexes.

### Q5: What is the difference between a CTE and a temporary table?

**Answer:** A CTE exists only within a single SQL statement and cannot be indexed. A temporary table persists for the entire session (or transaction), can be indexed, and can be referenced across multiple queries. Use CTEs for single-query readability. Use temp tables when you need to reuse results across multiple queries, need indexes for join performance, or are building multi-step ETL processes where each step is a separate statement.
