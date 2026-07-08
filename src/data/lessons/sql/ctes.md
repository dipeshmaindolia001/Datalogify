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

Imagine you are preparing a multi-page financial report for a company meeting. 
If you try to gather and calculate everything at once on a single piece of paper, your desk will be covered in messy, disconnected notes. You will find yourself calculating total sales in one corner, department budgets in another, and trying to write the final summary on the remaining scrap of paper.

Instead, a professional analyst uses separate desks or workspaces. 
*   On **Desk A**, you compile and total the sales records.
*   On **Desk B**, you list and summarize the department budgets.
*   Once both sub-reports are clean and finalized, you bring them to your **main desk**, join them together, and write the final report.

In SQL, a **Common Table Expression (CTE)** is your temporary workspace. 
Defined using the `WITH` clause, a CTE lets you write a sub-query, name it, and treat it like a temporary table for the duration of your query. Instead of nesting queries inside queries (derived tables) and creating hard-to-read "spaghetti SQL," CTEs allow you to write queries that read sequentially from top to bottom.

CTEs are the cornerstone of modern data analytics. Knowing how to write modular, clean CTEs is what separates junior query writers from senior data analysts and data engineers who build maintainable pipelines.

---

## The Tables We're Working With

We will use two tables for our B2B SaaS platform analysis: `employees` (employee registry with manager mappings) and `sales` (transaction logs).

### 1. `employees`
```sql
-- employees table schema and sample data:
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
```

### 2. `sales`
```sql
-- sales table schema and sample data:
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

---

## CTE Syntax and Anatomy

The basic structure of a CTE is:
```sql
WITH cte_name AS (
    -- Your subquery goes here
    SELECT column1, column2
    FROM table_name
    WHERE condition
)
-- Main query that references the CTE
SELECT * 
FROM cte_name;
```

*   **`WITH`:** Declares that we are starting a Common Table Expression block.
*   **`cte_name`:** The temporary name you give to the query's output. Think of this as a temporary table name.
*   **`AS (...)`:** Encloses the query that generates the data.
*   **Main Query:** Follows immediately after the closing parenthesis. This is where you consume the CTE.

---

## Step 1: Your First CTE — Readability Upgrade

Let's look at a query written both ways: first as a nested subquery, then as a CTE. We want to find departments whose average employee salary is higher than the overall company average.

### Approach A: Subquery Version (Hard to read)
```sql
-- Nested subqueries make code read from the inside out
SELECT dept_summary.department, dept_summary.avg_salary
FROM (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS dept_summary
WHERE dept_summary.avg_salary > (
    SELECT AVG(salary) FROM employees
);
```

### Approach B: CTE Version (Clean and sequential)
```sql
-- CTEs break the query into logical, top-to-bottom steps
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
# Output:
department  | avg_salary
------------|------------
Analytics   | 91500
Engineering | 111500
```

**Why the CTE version is superior:**
*   It reads like a story. First, we define `dept_summary`. Next, we define `company_avg`. Finally, we compare the two in the main query.
*   It avoids deep nesting. Anyone reading this query does not have to jump back and forth to understand what the database is doing.

---

## Step 2: Multiple CTEs — Building Step-by-Step

You can define multiple CTEs in a single query by separating them with commas. Each CTE can reference any CTE defined before it.

Let's write a query that calculates:
1.  Total sales per representative.
2.  Aggregates total sales with employee details (department, salary).
3.  Calculates team-wide performance averages.
4.  Compares each rep's performance to the team average.

```sql
WITH
-- CTE 1: Calculate total sales per rep
rep_totals AS (
    SELECT
        emp_id,
        COUNT(*)    AS deal_count,
        SUM(amount) AS total_revenue
    FROM sales
    GROUP BY emp_id
),
-- CTE 2: Join sales totals with employee metadata
rep_details AS (
    SELECT
        e.name,
        e.department,
        e.salary,
        rt.deal_count,
        rt.total_revenue
    FROM rep_totals rt
    JOIN employees e ON rt.emp_id = e.emp_id
),
-- CTE 3: Calculate the average revenue generated per rep
team_avg AS (
    SELECT AVG(total_revenue) AS avg_revenue
    FROM rep_details
)
-- Main Query: Join rep details with the overall average
SELECT
    rd.name,
    rd.total_revenue,
    ta.avg_revenue,
    rd.total_revenue - ta.avg_revenue AS vs_average
FROM rep_details rd, team_avg ta
ORDER BY rd.total_revenue DESC;
```

```text
# Output:
name          | total_revenue | avg_revenue | vs_average
--------------|---------------|-------------|-----------
Anna Kowalski | 94500         | 88000.00    | 6500.00
Marcus Brown  | 81500         | 88000.00    | -6500.00
```

---

## Step 3: Referencing a CTE Multiple Times

With derived tables (subqueries), if you want to use the same subquery twice in a query, you have to duplicate the code. A CTE can be referenced as many times as needed in the main query.

Let's calculate month-over-month sales growth by joining a monthly sales CTE to itself.

```sql
WITH monthly_revenue AS (
    -- Extract the month and sum the revenue
    SELECT
        DATE_TRUNC('month', sale_date) AS sale_month,
        SUM(amount)                    AS revenue
    FROM sales
    GROUP BY DATE_TRUNC('month', sale_date)
)
SELECT
    curr.sale_month                  AS current_month,
    curr.revenue                     AS current_revenue,
    prev.revenue                     AS previous_revenue,
    curr.revenue - prev.revenue      AS net_difference
FROM monthly_revenue curr
-- Left join the CTE to itself, offset by one month
LEFT JOIN monthly_revenue prev
    ON curr.sale_month = prev.sale_month + INTERVAL '1 month'
ORDER BY curr.sale_month;
```

```text
# Output:
current_month | current_revenue | previous_revenue | net_difference
--------------|-----------------|------------------|----------------
2024-01-01    | 43000           | NULL             | NULL
2024-02-01    | 23500           | 43000            | -19500
2024-03-01    | 43000           | 23500            | 19500
2024-04-01    | 36500           | 43000            | -6500
2024-05-01    | 30000           | 36500            | -6500
```

---

## Step 4: Recursive CTEs — Hierarchical Data

A **recursive CTE** is a specialized query that references itself. It is used to traverse hierarchical data, such as organizational charts (who reports to whom), product categories (subcategories under parent categories), or generating lists of dates.

### 4.1 Org Chart Hierarchy Parsing
Let's build a management hierarchy starting from James Wilson (ID 102). We want to find everyone who reports directly or indirectly to him and calculate their organizational level.

```sql
-- RECURSIVE keyword is required in PostgreSQL/MySQL
WITH RECURSIVE org_tree AS (
    -- 1. Base case: Start with James Wilson
    SELECT emp_id, name, manager_id, 1 AS org_level
    FROM employees
    WHERE emp_id = 102

    UNION ALL

    -- 2. Recursive step: Join the employees table to our org_tree
    SELECT e.emp_id, e.name, e.manager_id, ot.org_level + 1
    FROM employees e
    JOIN org_tree ot ON e.manager_id = ot.emp_id
)
-- 3. Main query
SELECT org_level, name, emp_id, manager_id
FROM org_tree
ORDER BY org_level, name;
```

```text
# Output:
org_level | name          | emp_id | manager_id
----------|---------------|--------|------------
1         | James Wilson  | 102    | 201
2         | Lisa Zhang    | 105    | 102
2         | Marcus Brown  | 104    | 102
3         | Anna Kowalski | 107    | 104
```

### How Recursive CTEs Work:
1.  **The Base Case (Anchor Member):** The query before `UNION ALL` runs first. It retrieves James Wilson (level 1).
2.  **The Recursive Step:** The query after `UNION ALL` runs and joins the `employees` table against the results of the base case. It finds Lisa Zhang and Marcus Brown because their `manager_id` matches James's `emp_id`. They are assigned level 2.
3.  **Iteration:** The recursive step runs again, joining `employees` against the level 2 results. It finds Anna Kowalski because her `manager_id` matches Marcus's `emp_id`. She is assigned level 3.
4.  **Termination:** The process runs again. Since no one reports to Anna Kowalski, the recursive step returns 0 rows, and the query terminates.

### 4.2 Generating a Date Series
Recursive CTEs are also useful for generating synthetic data, such as a calendar of dates for reporting purposes.

```sql
WITH RECURSIVE date_series AS (
    -- Start date
    SELECT DATE '2024-01-01' AS reporting_date

    UNION ALL

    -- Increment by 1 month until end date is reached
    SELECT reporting_date + INTERVAL '1 month'
    FROM date_series
    WHERE reporting_date < DATE '2024-04-01'
)
SELECT reporting_date 
FROM date_series;
```

```text
# Output:
reporting_date
--------------
2024-01-01
2024-02-01
2024-03-01
2024-04-01
```

---

## CTE vs. Subquery vs. Temp Table

Choosing the right tool is key to writing clean and performant SQL.

| Feature | CTE (`WITH`) | Subquery (Derived Table) | Temp Table (`#temp` / `CREATE TEMP`) |
| :--- | :--- | :--- | :--- |
| **Scope** | Single query | Single query | Entire session or transaction |
| **Readability** | High (sequential flow) | Low (nested structures) | Moderate |
| **Indexable** | No | No | Yes (increases speed on large datasets) |
| **Performance** | Inline execution (same as subquery) | Inline execution | Faster for massive datasets with multiple joins |
| **Recursion** | Yes | No | No |
| **Code Reuse** | Yes (in the same statement) | No (must duplicate code) | Yes (across multiple statements) |

> [!TIP]
> Use **CTEs** as your default tool for structuring complex, multi-step queries. 
> Use **Temp Tables** only when you are processing millions of rows, need to index the temporary data, or need to run multiple separate queries against the same intermediate dataset.

---

## Edge Cases & Common Mistakes

### Gotcha 1: Performance with Materialization (PostgreSQL 11 and earlier)
Historically, PostgreSQL treated CTEs as "optimization fences." This meant the database would execute the CTE query, write the result to a temporary table in memory, and then run the main query against that data. This sometimes prevented the database optimizer from using indexes from the main query.

*   **The Fix:** Modern databases (PostgreSQL 12+) automatically inline CTEs if they are simple enough. If you are on an older system and suspect a CTE is slow, you can use the `NOT MATERIALIZED` hint:
```sql
WITH temp_data AS NOT MATERIALIZED (
    SELECT * FROM sales
)
...
```

### Gotcha 2: Infinite Loops in Recursive CTEs
If your hierarchical data contains a loop (e.g., Alice reports to Bob, Bob reports to Charlie, Charlie reports to Alice), a recursive CTE will run infinitely until the server runs out of memory or crashes.

*   **The Fix:** Always verify that your data does not contain cycles, or add a safety recursion depth limit:
```sql
WHERE org_level < 10
```

---

## Practice Exercises & Mini-Projects

### Exercise 1: Department Cost Allocation
**Scenario:** Calculate how much money each department spends on employee salaries, and what percentage of the company-wide salary budget that represents. Use CTEs to keep the steps separate.

*   **Task:** Write a query with two CTEs:
    1.  `dept_salaries`: Calculate `SUM(salary)` per department.
    2.  `company_salary`: Calculate the global `SUM(salary)`.
    3.  Main query: Join them and calculate the percentage.

*   **Expected Output:**
```text
# Output:
department  | dept_salary | company_total | percent_of_budget
------------|-------------|---------------|------------------
Engineering | 223000      | 706000        | 31.59
Analytics   | 183000      | 706000        | 25.92
Marketing   | 160000      | 706000        | 22.66
Sales       | 140000      | 706000        | 19.83
```

<details>
<summary>View Solution</summary>

```sql
WITH dept_salaries AS (
    SELECT department, SUM(salary) AS total_dept_salary
    FROM employees
    GROUP BY department
),
company_salary AS (
    SELECT SUM(salary) AS total_company_salary
    FROM employees
)
SELECT
    ds.department,
    ds.total_dept_salary AS dept_salary,
    cs.total_company_salary AS company_total,
    ROUND((ds.total_dept_salary * 100.0) / cs.total_company_salary, 2) AS percent_of_budget
FROM dept_salaries ds, company_salary cs
ORDER BY percent_of_budget DESC;
```
</details>

---

### Exercise 2: Active Sales Rep Pipeline Audit
**Scenario:** Identify sales reps who have generated more than the average deal size. Return their names, total revenue, and how many deals they closed.

<details>
<summary>View Solution</summary>

```sql
WITH average_deal AS (
    SELECT AVG(amount) AS avg_deal_amount
    FROM sales
),
rep_performance AS (
    SELECT
        emp_id,
        COUNT(*) AS deal_count,
        SUM(amount) AS total_revenue
    FROM sales
    GROUP BY emp_id
)
SELECT
    e.name,
    rp.total_revenue,
    rp.deal_count
FROM rep_performance rp
JOIN employees e ON rp.emp_id = e.emp_id
WHERE rp.total_revenue > (SELECT avg_deal_amount FROM average_deal);
```
</details>

---

## Section Recaps

*   **CTEs (`WITH`)** act as named temporary workspaces that exist only for the duration of a single query.
*   **Sequential processing:** CTEs structure code logically from top to bottom, avoiding nested subquery structures.
*   **Reuse:** You can reference a CTE multiple times in the same query.
*   **Recursion:** Recursive CTEs use a base case and a recursive step to loop through hierarchical data.
*   **Performance:** CTEs are generally as fast as subqueries, but temp tables are preferred if intermediate index optimization is needed.

---

## Common Interview Questions

### Q1: What is a CTE, and when should you use it over a subquery?
**Answer:**
A CTE (Common Table Expression) is a named temporary result set defined with the `WITH` clause. 

You should use a CTE instead of a subquery when:
1.  **Readability is a priority:** CTEs organize complex queries into a sequential, top-to-bottom flow.
2.  **Code reuse is needed:** You can reference a CTE multiple times in the main query without repeating code.
3.  **Recursive traversal is required:** CTEs are the only way to perform recursion in standard SQL.

---

### Q2: Do CTEs improve query performance?
**Answer:**
Generally, no. In most relational databases (such as SQL Server, Oracle, and modern PostgreSQL), the query optimizer flattens CTEs and compiles them into the same execution plan as an equivalent nested subquery. 

CTEs are primarily a code organization and readability tool. However, in older database versions, CTEs were always materialized, which could occasionally hurt performance.

---

### Q3: What is a recursive CTE? Explain its components.
**Answer:**
A recursive CTE is a query that references itself to process hierarchical data. It consists of three components:
1.  **The Anchor Member (Base Case):** A query that runs first to return the initial seed rows.
2.  **The Recursive Member:** A query linked via `UNION ALL` that references the CTE itself and joins it to the source table. It runs iteratively.
3.  **The Termination Condition:** The loop ends automatically when the recursive step returns zero rows.

---

### Q4: Can you use DML statements (INSERT, UPDATE, DELETE) inside or with a CTE?
**Answer:**
Yes, in some databases (like PostgreSQL). You can write a CTE that contains a DML statement (like `DELETE ... RETURNING *`), capture the affected rows, and reference them in the main query (e.g., to archive deleted rows to another table). 

In other databases (like SQL Server), you can define a CTE to select target rows and then run an `UPDATE` or `DELETE` statement against the CTE itself, which modifies the underlying base table.

---

### Q5: What is the difference between a CTE and a Temporary Table?
**Answer:**
*   **Lifecycle:** A CTE exists only during the execution of a single SQL statement. A temp table persists for the duration of the entire user session.
*   **Indexing:** Temp tables can be optimized with indexes, statistics, and constraints. CTEs cannot be indexed.
*   **Syntax:** CTEs are declared inline using `WITH`. Temp tables are created using DDL (like `CREATE TEMPORARY TABLE`).
