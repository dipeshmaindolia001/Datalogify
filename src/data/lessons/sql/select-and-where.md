---
title: "SELECT & WHERE — Your First SQL Queries"
description: "Write your first SQL queries to retrieve and filter data from tables — the foundation of every data analyst's toolkit."
category: "sql"
order: 1
phase: 2
tags: ["sql", "select", "where", "basics"]
publishedDate: 2025-02-01
prevSlug: ""
nextSlug: "joins"
seoTitle: "SQL SELECT & WHERE for Data Analytics Beginners | Datalogify"
seoDescription: "Learn SQL SELECT and WHERE clauses with practical data analytics examples — filtering, sorting, and retrieving data."
---

## Why This Matters

Every dashboard, every report, every data pull starts with a SELECT statement. If you can't retrieve and filter data from a table, you can't do analytics. This is day-one-on-the-job SQL.

## The Tables We're Working With

Throughout this lesson, we'll query an `employees` table and a `sales` table. Here's the structure:

```sql
-- employees table
-- | emp_id | name           | department  | salary | hire_date  | manager_id |
-- |--------|----------------|-------------|--------|------------|------------|
-- | 101    | Sarah Chen     | Analytics   | 95000  | 2021-03-15 | 201        |
-- | 102    | James Wilson   | Engineering | 115000 | 2020-06-01 | 202        |
-- | 103    | Priya Patel    | Analytics   | 88000  | 2022-01-10 | 201        |
-- | 104    | Marcus Brown   | Sales       | 72000  | 2023-05-20 | 203        |
-- | 105    | Lisa Zhang     | Engineering | 108000 | 2021-09-12 | 202        |
-- | 106    | David Kim      | Marketing   | 82000  | 2022-11-01 | NULL       |
-- | 107    | Anna Kowalski  | Sales       | 68000  | 2024-02-14 | 203        |

-- sales table
-- | sale_id | emp_id | product       | amount  | sale_date  | region |
-- |---------|--------|---------------|---------|------------|--------|
-- | 1       | 104    | CRM Pro       | 15000   | 2024-01-15 | West   |
-- | 2       | 107    | CRM Pro       | 12500   | 2024-01-22 | East   |
-- | 3       | 104    | Analytics Hub | 28000   | 2024-02-03 | West   |
-- | 4       | 107    | CRM Pro       | 15000   | 2024-02-18 | East   |
-- | 5       | 104    | Data Vault    | 8500    | 2024-03-07 | South  |
```

## SELECT * — Grab Everything

The simplest query. Pulls every column and every row.

```sql
SELECT *
FROM employees;
```

```text
# Output:
emp_id | name           | department  | salary | hire_date  | manager_id
-------|----------------|-------------|--------|------------|----------
101    | Sarah Chen     | Analytics   | 95000  | 2021-03-15 | 201
102    | James Wilson   | Engineering | 115000 | 2020-06-01 | 202
103    | Priya Patel    | Analytics   | 88000  | 2022-01-10 | 201
104    | Marcus Brown   | Sales       | 72000  | 2023-05-20 | 203
105    | Lisa Zhang     | Engineering | 108000 | 2021-09-12 | 202
106    | David Kim      | Marketing   | 82000  | 2022-11-01 | NULL
107    | Anna Kowalski  | Sales       | 68000  | 2024-02-14 | 203
(7 rows)
```

**In practice:** Never use `SELECT *` in production queries or dashboards. It pulls unnecessary data, slows things down, and breaks if the table schema changes. Use it only for quick exploration.

## SELECT Specific Columns

Always name the columns you actually need.

```sql
SELECT name, department, salary
FROM employees;
```

```text
# Output:
name           | department  | salary
---------------|-------------|-------
Sarah Chen     | Analytics   | 95000
James Wilson   | Engineering | 115000
Priya Patel    | Analytics   | 88000
Marcus Brown   | Sales       | 72000
Lisa Zhang     | Engineering | 108000
David Kim      | Marketing   | 82000
Anna Kowalski  | Sales       | 68000
(7 rows)
```

### Column Aliases with AS

Rename columns in your output to make reports readable.

```sql
SELECT
    name           AS employee_name,
    department     AS dept,
    salary         AS annual_salary,
    salary / 12.0  AS monthly_salary
FROM employees;
```

```text
# Output:
employee_name  | dept        | annual_salary | monthly_salary
---------------|-------------|---------------|---------------
Sarah Chen     | Analytics   | 95000         | 7916.67
James Wilson   | Engineering | 115000        | 9583.33
Priya Patel    | Analytics   | 88000         | 7333.33
Marcus Brown   | Sales       | 72000         | 6000.00
Lisa Zhang     | Engineering | 108000        | 9000.00
David Kim      | Marketing   | 82000         | 6833.33
Anna Kowalski  | Sales       | 68000         | 5666.67
(7 rows)
```

## WHERE — Filtering Rows

This is where SQL becomes useful. WHERE keeps only the rows that match your condition.

### Exact Match with =

```sql
SELECT name, department, salary
FROM employees
WHERE department = 'Analytics';
```

```text
# Output:
name        | department | salary
------------|------------|-------
Sarah Chen  | Analytics  | 95000
Priya Patel | Analytics  | 88000
(2 rows)
```

### Comparison Operators: >, <, >=, <=, <>

```sql
-- Employees earning more than 90K
SELECT name, salary
FROM employees
WHERE salary > 90000;
```

```text
# Output:
name         | salary
-------------|-------
Sarah Chen   | 95000
James Wilson | 115000
Lisa Zhang   | 108000
(3 rows)
```

```sql
-- Employees earning 90K or less (using <=)
SELECT name, salary
FROM employees
WHERE salary <= 90000;
```

```text
# Output:
name          | salary
--------------|-------
Priya Patel   | 88000
Marcus Brown  | 72000
David Kim     | 82000
Anna Kowalski | 68000
(4 rows)
```

### BETWEEN — Range Filters

```sql
-- Salaries between 80K and 100K (inclusive on both ends)
SELECT name, department, salary
FROM employees
WHERE salary BETWEEN 80000 AND 100000;
```

```text
# Output:
name        | department | salary
------------|------------|-------
Sarah Chen  | Analytics  | 95000
Priya Patel | Analytics  | 88000
David Kim   | Marketing  | 82000
(3 rows)
```

### IN — Match Against a List

```sql
-- Employees in Analytics or Sales
SELECT name, department, salary
FROM employees
WHERE department IN ('Analytics', 'Sales');
```

```text
# Output:
name          | department | salary
--------------|------------|-------
Sarah Chen    | Analytics  | 95000
Priya Patel   | Analytics  | 88000
Marcus Brown  | Sales      | 72000
Anna Kowalski | Sales      | 68000
(4 rows)
```

### LIKE — Pattern Matching

```sql
-- Names starting with 'S'
SELECT name, department
FROM employees
WHERE name LIKE 'S%';
```

```text
# Output:
name       | department
-----------|----------
Sarah Chen | Analytics
(1 row)
```

```sql
-- Names containing 'an' anywhere
SELECT name, department
FROM employees
WHERE name LIKE '%an%';
```

```text
# Output:
name          | department
--------------|----------
Lisa Zhang    | Engineering
Anna Kowalski | Sales
(2 rows)
```

**Pattern cheat sheet:**
- `%` matches any number of characters (including zero)
- `_` matches exactly one character
- `'J%'` → starts with J
- `'%son'` → ends with "son"
- `'_a%'` → second character is "a"

<div class="interview-tip">

**Where this is used in real jobs:** LIKE is everywhere — searching customer names, filtering product SKUs by prefix, finding email domains (`WHERE email LIKE '%@gmail.com'`). In interviews, you'll often get asked to find patterns in text columns.

</div>

## Combining Conditions: AND, OR, NOT

### AND — Both Conditions Must Be True

```sql
-- Analytics employees earning over 90K
SELECT name, department, salary
FROM employees
WHERE department = 'Analytics'
  AND salary > 90000;
```

```text
# Output:
name       | department | salary
-----------|------------|-------
Sarah Chen | Analytics  | 95000
(1 row)
```

### OR — Either Condition Can Be True

```sql
-- Employees in Analytics OR earning over 100K
SELECT name, department, salary
FROM employees
WHERE department = 'Analytics'
   OR salary > 100000;
```

```text
# Output:
name         | department  | salary
-------------|-------------|-------
Sarah Chen   | Analytics   | 95000
James Wilson | Engineering | 115000
Priya Patel  | Analytics   | 88000
Lisa Zhang   | Engineering | 108000
(4 rows)
```

### Mixing AND/OR — Use Parentheses

```sql
-- (Analytics OR Sales) employees earning over 70K
SELECT name, department, salary
FROM employees
WHERE (department = 'Analytics' OR department = 'Sales')
  AND salary > 70000;
```

```text
# Output:
name         | department | salary
-------------|------------|-------
Sarah Chen   | Analytics  | 95000
Priya Patel  | Analytics  | 88000
Marcus Brown | Sales      | 72000
(3 rows)
```

**Without parentheses**, `AND` binds tighter than `OR`, which would give wrong results. Always use parentheses when mixing them.

### NOT — Exclude Rows

```sql
-- Everyone except Engineering
SELECT name, department, salary
FROM employees
WHERE department NOT IN ('Engineering');
```

```text
# Output:
name          | department | salary
--------------|------------|-------
Sarah Chen    | Analytics  | 95000
Priya Patel   | Analytics  | 88000
Marcus Brown  | Sales      | 72000
David Kim     | Marketing  | 82000
Anna Kowalski | Sales      | 68000
(5 rows)
```

## NULL Handling — IS NULL and IS NOT NULL

NULL means "unknown" or "missing." You cannot use `=` to check for NULL — it doesn't work. You must use `IS NULL` or `IS NOT NULL`.

```sql
-- Employees with no manager assigned
SELECT name, department, manager_id
FROM employees
WHERE manager_id IS NULL;
```

```text
# Output:
name      | department | manager_id
----------|------------|----------
David Kim | Marketing  | NULL
(1 row)
```

```sql
-- Employees who DO have a manager
SELECT name, department, manager_id
FROM employees
WHERE manager_id IS NOT NULL;
```

```text
# Output:
name          | department  | manager_id
--------------|-------------|----------
Sarah Chen    | Analytics   | 201
James Wilson  | Engineering | 202
Priya Patel   | Analytics   | 201
Marcus Brown  | Sales       | 203
Lisa Zhang    | Engineering | 202
Anna Kowalski | Sales       | 203
(6 rows)
```

<div class="interview-tip">

**Interview trap:** "Why doesn't `WHERE manager_id = NULL` work?" Because NULL isn't a value — it's the absence of a value. Any comparison with NULL returns NULL (not TRUE or FALSE), so `= NULL` never matches any rows. This is called **three-valued logic** and it trips up beginners constantly.

</div>

## ORDER BY — Sorting Results

```sql
-- Highest salaries first
SELECT name, department, salary
FROM employees
ORDER BY salary DESC;
```

```text
# Output:
name          | department  | salary
--------------|-------------|-------
James Wilson  | Engineering | 115000
Lisa Zhang    | Engineering | 108000
Sarah Chen    | Analytics   | 95000
Priya Patel   | Analytics   | 88000
David Kim     | Marketing   | 82000
Marcus Brown  | Sales       | 72000
Anna Kowalski | Sales       | 68000
(7 rows)
```

### Sorting by Multiple Columns

```sql
-- Sort by department A-Z, then by salary highest first within each department
SELECT name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;
```

```text
# Output:
name          | department  | salary
--------------|-------------|-------
Sarah Chen    | Analytics   | 95000
Priya Patel   | Analytics   | 88000
James Wilson  | Engineering | 115000
Lisa Zhang    | Engineering | 108000
David Kim     | Marketing   | 82000
Marcus Brown  | Sales       | 72000
Anna Kowalski | Sales       | 68000
(7 rows)
```

## LIMIT — Control How Many Rows You Get

```sql
-- Top 3 highest paid employees
SELECT name, department, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;
```

```text
# Output:
name         | department  | salary
-------------|-------------|-------
James Wilson | Engineering | 115000
Lisa Zhang   | Engineering | 108000
Sarah Chen   | Analytics   | 95000
(3 rows)
```

**Note:** In SQL Server, use `TOP 3` instead of `LIMIT 3`. In Oracle, use `FETCH FIRST 3 ROWS ONLY`. PostgreSQL and MySQL use `LIMIT`.

## DISTINCT — Remove Duplicates

```sql
-- What departments exist?
SELECT DISTINCT department
FROM employees
ORDER BY department;
```

```text
# Output:
department
-----------
Analytics
Engineering
Marketing
Sales
(4 rows)
```

```sql
-- Unique product-region combinations from sales
SELECT DISTINCT product, region
FROM sales
ORDER BY product, region;
```

```text
# Output:
product       | region
--------------|-------
Analytics Hub | West
CRM Pro       | East
CRM Pro       | West
Data Vault    | South
(4 rows)
```

## Putting It All Together

A realistic query you'd write on your first day pulling data:

```sql
-- Find all sales reps who closed deals over 10K in Q1 2024,
-- sorted by deal size, top 5 only
SELECT
    s.sale_id,
    e.name          AS sales_rep,
    s.product,
    s.amount,
    s.sale_date,
    s.region
FROM sales s
JOIN employees e ON s.emp_id = e.emp_id
WHERE s.amount > 10000
  AND s.sale_date BETWEEN '2024-01-01' AND '2024-03-31'
ORDER BY s.amount DESC
LIMIT 5;
```

```text
# Output:
sale_id | sales_rep    | product       | amount | sale_date  | region
--------|--------------|---------------|--------|------------|-------
3       | Marcus Brown | Analytics Hub | 28000  | 2024-02-03 | West
1       | Marcus Brown | CRM Pro       | 15000  | 2024-01-15 | West
4       | Anna Kowalski| CRM Pro       | 15000  | 2024-02-18 | East
2       | Anna Kowalski| CRM Pro       | 12500  | 2024-01-22 | East
(4 rows)
```

<div class="challenge">

### Challenge: Find the Right Employees

Write a query that returns:
1. The **name**, **department**, and **salary** of all employees
2. Who are in the **Analytics** or **Engineering** department
3. With a salary **between 85,000 and 120,000**
4. Who have a **manager assigned** (manager_id is not null)
5. Sorted by **salary descending**

**Expected output:**
```text
name         | department  | salary
-------------|-------------|-------
James Wilson | Engineering | 115000
Lisa Zhang   | Engineering | 108000
Sarah Chen   | Analytics   | 95000
Priya Patel  | Analytics   | 88000
(4 rows)
```

**Hint:** Use `IN`, `BETWEEN`, `IS NOT NULL`, and `ORDER BY` together.

</div>

## Common Interview Questions

### Q1: What is the difference between WHERE and HAVING?

**A:** `WHERE` filters individual rows *before* any grouping happens. `HAVING` filters groups *after* `GROUP BY` has been applied. You cannot use aggregate functions (COUNT, SUM, AVG) in a WHERE clause — that's what HAVING is for. Example: `WHERE salary > 50000` filters rows; `HAVING COUNT(*) > 5` filters groups. Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.

### Q2: Why can't you use `= NULL` to check for NULL values?

**A:** SQL uses three-valued logic: TRUE, FALSE, and NULL. Any comparison with NULL — including `= NULL`, `> NULL`, or even `NULL = NULL` — returns NULL, not TRUE. Since WHERE only keeps rows that evaluate to TRUE, `WHERE column = NULL` returns zero rows. You must use `IS NULL` or `IS NOT NULL`. This is defined by the SQL standard and is consistent across all major databases.

### Q3: What is the difference between `LIMIT` and `TOP`?

**A:** They do the same thing — restrict the number of rows returned — but the syntax differs by database. PostgreSQL and MySQL use `LIMIT n` at the end of the query. SQL Server uses `SELECT TOP n` at the beginning. Oracle uses `FETCH FIRST n ROWS ONLY` (or the older `ROWNUM` trick). In interviews, mention you know the dialect differences.

### Q4: What is the order of execution in a SQL query?

**A:** SQL doesn't execute in the order you write it. The logical execution order is: `FROM` (identify tables) → `JOIN` (combine tables) → `WHERE` (filter rows) → `GROUP BY` (create groups) → `HAVING` (filter groups) → `SELECT` (pick columns) → `DISTINCT` (remove duplicates) → `ORDER BY` (sort) → `LIMIT` (restrict rows). This is why you can't use a column alias from SELECT in a WHERE clause — WHERE runs before SELECT.

### Q5: What is the difference between `IN` and `BETWEEN`?

**A:** `IN` checks if a value matches any item in a list — `WHERE department IN ('Sales', 'Analytics', 'Marketing')`. The values don't need to be sequential. `BETWEEN` checks if a value falls within a continuous range — `WHERE salary BETWEEN 50000 AND 100000`. BETWEEN is inclusive on both ends. Use `IN` for discrete values (categories, IDs), use `BETWEEN` for ranges (dates, numbers). `IN` can also accept a subquery, making it much more powerful than BETWEEN.
