---
title: "Subqueries — Queries Inside Queries"
description: "Nest queries inside other queries — filter by aggregates, create derived tables, and solve complex analytics problems."
category: "sql"
order: 8
phase: 2
tags: ["sql", "subqueries", "nested-queries", "derived-tables"]
publishedDate: 2025-02-19
prevSlug: "insert-update-delete"
nextSlug: "ctes"
seoTitle: "SQL Subqueries Tutorial | Datalogify"
seoDescription: "Master SQL subqueries — scalar, column, table, and correlated subqueries with real analytics examples."
---

## Why This Matters

"Show me employees who earn more than the average salary." You can't do this with a single WHERE clause — you don't know the average until you calculate it. Subqueries solve this by letting you nest one query inside another. They're how you filter by aggregated values, create temporary datasets, and answer multi-step analytical questions in a single SQL statement.

## The Tables We're Working With

```sql
-- employees table
-- | emp_id | name           | department  | salary | hire_date  |
-- |--------|----------------|-------------|--------|------------|
-- | 101    | Sarah Chen     | Analytics   | 95000  | 2021-03-15 |
-- | 102    | James Wilson   | Engineering | 115000 | 2020-06-01 |
-- | 103    | Priya Patel    | Analytics   | 88000  | 2022-01-10 |
-- | 104    | Marcus Brown   | Sales       | 72000  | 2023-05-20 |
-- | 105    | Lisa Zhang     | Engineering | 108000 | 2021-09-12 |
-- | 106    | David Kim      | Marketing   | 82000  | 2022-11-01 |
-- | 107    | Anna Kowalski  | Sales       | 68000  | 2024-02-14 |
-- | 108    | Tom Rivera     | Marketing   | 78000  | 2023-08-05 |

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

-- departments table
-- | dept_name   | budget  | head_count |
-- |-------------|---------|------------|
-- | Analytics   | 500000  | 15         |
-- | Engineering | 800000  | 25         |
-- | Sales       | 350000  | 10         |
-- | Marketing   | 300000  | 8          |
```

## Scalar Subqueries — Returns One Value

A scalar subquery returns exactly one row and one column — a single value. Use it anywhere you'd use a constant.

### In WHERE — Compare Against an Aggregate

```sql
-- Employees earning more than the company average
SELECT name, department, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
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

The inner query `(SELECT AVG(salary) FROM employees)` returns 88250. The outer query filters employees above that threshold.

### In SELECT — Add Computed Context

```sql
-- Show each employee's salary vs the company average
SELECT
    name,
    salary,
    (SELECT AVG(salary) FROM employees)            AS company_avg,
    salary - (SELECT AVG(salary) FROM employees)    AS diff_from_avg
FROM employees
ORDER BY diff_from_avg DESC;
```

```text
# Output:
name          | salary | company_avg | diff_from_avg
--------------|--------|-------------|---------------
James Wilson  | 115000 | 88250       | 26750
Lisa Zhang    | 108000 | 88250       | 19750
Sarah Chen    | 95000  | 88250       | 6750
Priya Patel   | 88000  | 88250       | -250
David Kim     | 82000  | 88250       | -6250
Tom Rivera    | 78000  | 88250       | -10250
Marcus Brown  | 72000  | 88250       | -16250
Anna Kowalski | 68000  | 88250       | -20250
(8 rows)
```

<div class="interview-tip">

**Where this is used in real jobs:** Scalar subqueries in SELECT are common in ad-hoc analysis — "show me each product's revenue compared to the category average" or "what percentage of total revenue does each region represent?" They're quick to write but can be slow on large datasets. For production queries, window functions are usually better.

</div>

## Column Subqueries — Returns Multiple Values

A column subquery returns multiple rows but one column. Use it with IN, NOT IN, ANY, or ALL.

### Subquery with IN

```sql
-- Find employees who have made at least one sale
SELECT name, department, salary
FROM employees
WHERE emp_id IN (SELECT DISTINCT emp_id FROM sales);
```

```text
# Output:
name          | department | salary
--------------|------------|-------
Marcus Brown  | Sales      | 72000
Anna Kowalski | Sales      | 68000
(2 rows)
```

### Subquery with NOT IN

```sql
-- Find employees who have NEVER made a sale
SELECT name, department, salary
FROM employees
WHERE emp_id NOT IN (SELECT DISTINCT emp_id FROM sales);
```

```text
# Output:
name         | department  | salary
-------------|-------------|-------
Sarah Chen   | Analytics   | 95000
James Wilson | Engineering | 115000
Priya Patel  | Analytics   | 88000
Lisa Zhang   | Engineering | 108000
David Kim    | Marketing   | 82000
Tom Rivera   | Marketing   | 78000
(6 rows)
```

### ⚠️ NOT IN Trap with NULLs

```sql
-- If the subquery returns any NULL, NOT IN returns NO rows
-- This is a notorious bug:
SELECT name FROM employees
WHERE emp_id NOT IN (SELECT manager_id FROM employees);
-- If manager_id has NULLs, this returns ZERO rows. Every time.
```

**Fix:** Use `NOT EXISTS` instead of `NOT IN` when the subquery column might contain NULLs:

```sql
-- Safe alternative using NOT EXISTS
SELECT e.name
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM sales s WHERE s.emp_id = e.emp_id
);
```

### Subquery with ANY and ALL

```sql
-- Employees earning more than ANY person in Sales (i.e., more than the lowest Sales salary)
SELECT name, department, salary
FROM employees
WHERE salary > ANY (SELECT salary FROM employees WHERE department = 'Sales');
```

```text
# Output:
name         | department  | salary
-------------|-------------|-------
Sarah Chen   | Analytics   | 95000
James Wilson | Engineering | 115000
Priya Patel  | Analytics   | 88000
Marcus Brown | Sales       | 72000
Lisa Zhang   | Engineering | 108000
David Kim    | Marketing   | 82000
Tom Rivera   | Marketing   | 78000
(7 rows)
```

```sql
-- Employees earning more than ALL people in Sales (i.e., more than the highest Sales salary)
SELECT name, department, salary
FROM employees
WHERE salary > ALL (SELECT salary FROM employees WHERE department = 'Sales');
```

```text
# Output:
name         | department  | salary
-------------|-------------|-------
Sarah Chen   | Analytics   | 95000
James Wilson | Engineering | 115000
Priya Patel  | Analytics   | 88000
Lisa Zhang   | Engineering | 108000
David Kim    | Marketing   | 82000
Tom Rivera   | Marketing   | 78000
(6 rows)
```

**ANY** = greater than at least one value (same as `> MIN()`).
**ALL** = greater than every value (same as `> MAX()`).

## Table Subqueries (Derived Tables) — Returns a Dataset

A table subquery goes in the FROM clause and acts like a temporary table. It must have an alias.

```sql
-- Find each salesperson's total revenue, then filter to top performers
SELECT
    rep_summary.name,
    rep_summary.total_sales,
    rep_summary.deal_count
FROM (
    SELECT
        e.name,
        SUM(s.amount)  AS total_sales,
        COUNT(*)        AS deal_count
    FROM sales s
    JOIN employees e ON s.emp_id = e.emp_id
    GROUP BY e.name
) AS rep_summary
WHERE rep_summary.total_sales > 50000;
```

```text
# Output:
name          | total_sales | deal_count
--------------|-------------|----------
Marcus Brown  | 66500       | 4
Anna Kowalski | 71000       | 3
(2 rows)
```

The inner query calculates totals per salesperson. The outer query filters on those totals. You couldn't do this with a simple WHERE because you can't filter on aggregates without HAVING — and sometimes the logic is cleaner as a derived table.

### Joining Against a Derived Table

```sql
-- Compare each department's average salary to its budget per head
SELECT
    dept_avg.department,
    dept_avg.avg_salary,
    d.budget,
    d.head_count,
    d.budget / d.head_count          AS budget_per_head,
    dept_avg.avg_salary - (d.budget / d.head_count) AS diff
FROM (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS dept_avg
JOIN departments d ON dept_avg.department = d.dept_name
ORDER BY diff DESC;
```

```text
# Output:
department  | avg_salary | budget | head_count | budget_per_head | diff
------------|------------|--------|------------|-----------------|-------
Analytics   | 91500      | 500000 | 15         | 33333           | 58167
Marketing   | 80000      | 300000 | 8          | 37500           | 42500
Engineering | 111500     | 800000 | 25         | 32000           | 79500
Sales       | 70000      | 350000 | 10         | 35000           | 35000
(4 rows)
```

## Correlated Subqueries — Reference the Outer Query

A correlated subquery runs once for *each row* of the outer query. It references the outer query's columns.

```sql
-- Employees who earn more than their department's average
SELECT name, department, salary
FROM employees e
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE department = e.department
);
```

```text
# Output:
name         | department  | salary
-------------|-------------|-------
Sarah Chen   | Analytics   | 95000
James Wilson | Engineering | 115000
David Kim    | Marketing   | 82000
Marcus Brown | Sales       | 72000
(4 rows)
```

For each employee, the subquery calculates that specific department's average. Sarah Chen (95K) is above Analytics' average (91.5K). James Wilson (115K) is above Engineering's average (111.5K).

### EXISTS — Check If Rows Exist

EXISTS is the most common correlated subquery. It returns TRUE if the subquery finds at least one matching row.

```sql
-- Departments that have at least one employee earning over 100K
SELECT DISTINCT department
FROM employees e
WHERE EXISTS (
    SELECT 1
    FROM employees e2
    WHERE e2.department = e.department
      AND e2.salary > 100000
);
```

```text
# Output:
department
-----------
Engineering
(1 row)
```

```sql
-- Employees who have NOT made any sales (using EXISTS)
SELECT name, department
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM sales s WHERE s.emp_id = e.emp_id
);
```

```text
# Output:
name         | department
-------------|----------
Sarah Chen   | Analytics
James Wilson | Engineering
Priya Patel  | Analytics
Lisa Zhang   | Engineering
David Kim    | Marketing
Tom Rivera   | Marketing
(6 rows)
```

<div class="interview-tip">

**Interview tip:** "When should you use EXISTS vs IN?" EXISTS stops scanning as soon as it finds one match — it's often faster for large datasets. IN materializes the entire subquery result first. Use EXISTS when the subquery table is large and has an index on the correlation column. Use IN when the subquery returns a small, known list. Most optimizers handle both well, but showing you know the difference earns points.

</div>

## Subquery vs JOIN — When to Use Which

Sometimes a subquery and a JOIN solve the same problem:

```sql
-- Using a subquery
SELECT name, department
FROM employees
WHERE department IN (
    SELECT dept_name FROM departments WHERE budget > 400000
);

-- Using a JOIN (same result)
SELECT e.name, e.department
FROM employees e
JOIN departments d ON e.department = d.dept_name
WHERE d.budget > 400000;
```

```text
# Output (both):
name         | department
-------------|----------
Sarah Chen   | Analytics
James Wilson | Engineering
Priya Patel  | Analytics
Lisa Zhang   | Engineering
(4 rows)
```

### When Subqueries Win

- **Filtering by aggregates:** "Employees above average salary" is cleaner as a subquery
- **EXISTS/NOT EXISTS:** More readable and often faster than LEFT JOIN + IS NULL
- **One-off calculated values:** No need to join when you just need a single number

### When JOINs Win

- **Need columns from both tables:** Subqueries in WHERE can't add columns from the inner query
- **Performance on large datasets:** JOINs are generally better optimized
- **Readability for multi-table combinations:** Chained subqueries get messy fast

## Nested Subqueries — Going Deeper

You can nest subqueries multiple levels, but readability drops fast.

```sql
-- Find the name of the person with the highest total sales
SELECT name
FROM employees
WHERE emp_id = (
    SELECT emp_id
    FROM sales
    GROUP BY emp_id
    HAVING SUM(amount) = (
        SELECT MAX(total)
        FROM (
            SELECT emp_id, SUM(amount) AS total
            FROM sales
            GROUP BY emp_id
        ) AS totals
    )
);
```

```text
# Output:
name
--------------
Anna Kowalski
(1 row)
```

This works but is hard to follow. **When you hit more than two levels of nesting, use CTEs instead** (covered in the next lesson). They do the same thing but read like a story.

<div class="challenge">

### Challenge: Department Analysis

Write a query that returns:
1. Each **department name** and **number of employees**
2. The **average salary** in that department
3. Only include departments where the average salary is **above the company-wide average**
4. Sorted by **average salary descending**

**Expected output:**
```text
department  | emp_count | avg_salary
------------|-----------|----------
Engineering | 2         | 111500
Analytics   | 2         | 91500
(2 rows)
```

**Hint:** Use a scalar subquery in HAVING to compare each department's average against the overall average.

</div>

## Performance Considerations

1. **Correlated subqueries are expensive.** They run once per row of the outer query. On a million-row table, that's a million subquery executions. Rewrite as JOINs when possible.

2. **Subqueries in SELECT** execute per row too. If you're adding a column via subquery, consider a JOIN or window function instead.

3. **Derived tables** (subqueries in FROM) are generally fine — the database materializes them once.

4. **EXISTS is usually faster than IN** for large subquery results, because EXISTS stops at the first match.

5. **The optimizer may rewrite your subquery** as a JOIN behind the scenes. Check the query plan (`EXPLAIN`) to see what actually runs.

## Common Interview Questions

### Q1: What is the difference between a correlated and non-correlated subquery?

**Answer:** A non-correlated (simple) subquery is independent — it can run on its own and returns the same result regardless of the outer query. Example: `WHERE salary > (SELECT AVG(salary) FROM employees)`. A correlated subquery references columns from the outer query and runs once for each outer row. Example: `WHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department)`. Correlated subqueries are more powerful but slower because they execute repeatedly.

### Q2: Can a subquery return more than one column?

**Answer:** Yes, when used as a derived table in the FROM clause. `FROM (SELECT id, name, SUM(amount) AS total FROM sales GROUP BY id, name) AS summary` returns multiple columns. However, subqueries in WHERE with IN can only return one column, and scalar subqueries (used with =, >, <) must return exactly one row and one column. Subqueries in SELECT must also be scalar.

### Q3: Why does NOT IN fail when the subquery returns NULL?

**Answer:** Because of SQL's three-valued logic. `NOT IN (1, 2, NULL)` evaluates as `val <> 1 AND val <> 2 AND val <> NULL`. The `val <> NULL` part always evaluates to NULL, and `TRUE AND NULL = NULL`, so the entire expression can never be TRUE. This means NOT IN returns zero rows whenever the subquery contains any NULL. The fix: use `NOT EXISTS` or add `WHERE column IS NOT NULL` to the subquery.

### Q4: What is a derived table?

**Answer:** A derived table is a subquery in the FROM clause that acts as a temporary, inline table. It must have an alias. Example: `FROM (SELECT dept, AVG(salary) AS avg_sal FROM employees GROUP BY dept) AS dept_avgs`. The database executes the subquery first, materializes the result, then uses it like any other table in the outer query. Derived tables are useful for filtering on aggregated values or breaking complex logic into steps.

### Q5: When would you use a subquery instead of a JOIN?

**Answer:** Use subqueries when: (1) filtering by an aggregate value — `WHERE salary > (SELECT AVG(salary)...)`, (2) checking existence — `WHERE EXISTS (SELECT 1 FROM...)`, (3) you need a single computed value for comparison. Use JOINs when: (1) you need columns from both tables in the output, (2) performance matters on large datasets, (3) the relationship between tables is clear. Modern optimizers often convert between the two internally, but readability should guide your choice.
