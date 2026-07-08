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

Imagine you have a stack of locked nesting boxes. Inside the outer box is a medium box, and inside that is a small box. To find out what is written on a card in the outermost box, you must first open the smallest box to find the key that unlocks the medium box, which in turn unlocks the outer box. 

In SQL, a **subquery** (or nested query) works exactly like these nested boxes. It is a query inside another query. The database engine executes the innermost query first, obtains its result, and passes that result to the outer query to run.

Consider this common business request: **"Show me all employees who earn more than the average salary."**

You cannot answer this with a simple query like:
```sql
-- ❌ THIS WILL FAIL:
SELECT name, salary 
FROM employees 
WHERE salary > AVG(salary);
```
Why? Because SQL cannot compute the average salary of the entire table while it is filtering individual rows. To solve this, you need a two-step process:
1.  Compute the average salary (e.g., $88,250).
2.  Filter the table for anyone earning more than $88,250.

A subquery lets you perform both steps in a single SQL statement. By nesting the average calculation inside the `WHERE` clause, you dynamically pass the result of step 1 directly into step 2.

---

## The Tables We're Working With

We will use three tables representing a B2B SaaS startup's internal operations: `employees`, `sales`, and `departments`.

### 1. `employees`
```sql
-- employees table schema and sample data:
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
```

### 3. `departments`
```sql
-- departments table schema and sample data:
-- | dept_name   | budget  | head_count |
-- |-------------|---------|------------|
-- | Analytics   | 500000  | 15         |
-- | Engineering | 800000  | 25         |
-- | Sales       | 350000  | 10         |
-- | Marketing   | 300000  | 8          |
```

---

## Types of Subqueries

Subqueries are classified by the format of the data they return:
1.  **Scalar Subqueries:** Return exactly one value (one row and one column).
2.  **Multi-Row (Column) Subqueries:** Return multiple rows but only one column.
3.  **Table Subqueries (Derived Tables):** Return a full table structure (multiple rows and multiple columns).
4.  **Correlated Subqueries:** Subqueries that reference columns in the outer query, executing repeatedly for each row in the outer table.

---

## Step 1: Scalar Subqueries — Returning a Single Value

A scalar subquery can be placed anywhere a constant or literal value is expected (in the `SELECT`, `WHERE`, or `HAVING` clauses).

### Example 1.1: Scalar Subquery in `WHERE`
Let's find all employees who earn more than the company average.

```sql
-- The subquery calculates the average, which is passed to the WHERE filter
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

**Under the Hood:**
1.  The database runs `SELECT AVG(salary) FROM employees` first. It returns the single value `88250`.
2.  The engine rewrites the outer query to: `SELECT name, department, salary FROM employees WHERE salary > 88250`.
3.  It returns the 3 matching employees.

### Example 1.2: Scalar Subquery in `SELECT`
You can use scalar subqueries to append context columns to your reports, such as comparing a row's value against a global metric.

```sql
-- Append the company average and calculate the individual deviation
SELECT
    name,
    salary,
    (SELECT AVG(salary) FROM employees)             AS company_avg,
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

---

## Step 2: Multi-Row Subqueries — Returning a List

When a subquery returns multiple values, you cannot use standard comparison operators (like `=`, `>`, `<`). You must use operators designed for lists: `IN`, `NOT IN`, `ANY`, or `ALL`.

### Example 2.1: Subquery with `IN`
Let's identify employees who have made at least one sale.

```sql
-- Find employees whose IDs appear in the sales table
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

### Example 2.2: Subquery with `ANY` and `ALL`
*   `> ANY (list)` means: greater than the **minimum** value in the list.
*   `> ALL (list)` means: greater than the **maximum** value in the list.

Let's find employees who earn more than *any* single person in the Sales department (i.e., earning more than the lowest Sales salary of 68,000).

```sql
-- Using ANY: checks if salary is greater than the minimum sales salary
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

Now let's find employees who earn more than *all* people in the Sales department (i.e., earning more than the highest Sales salary of 72,000).

```sql
-- Using ALL: checks if salary is greater than the maximum sales salary
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

---

## Step 3: Table Subqueries — Derived Tables

A subquery in the `FROM` clause acts as a temporary inline table. It must be assigned an alias.

### Example 3.1: Filtering Aggregated Metrics
Suppose you want to compute the total sales per rep, and then filter for reps who sold more than $50,000. You cannot use `WHERE` on `SUM(amount)` directly. You can use `HAVING`, or you can wrap the calculation in a derived table.

```sql
-- rep_summary is a derived table
SELECT
    rep.name,
    rep.total_sales,
    rep.deal_count
FROM (
    SELECT
        e.name,
        SUM(s.amount) AS total_sales,
        COUNT(*)      AS deal_count
    FROM sales s
    JOIN employees e ON s.emp_id = e.emp_id
    GROUP BY e.name
) AS rep
WHERE rep.total_sales > 50000;
```

```text
# Output:
name          | total_sales | deal_count
--------------|-------------|----------
Marcus Brown  | 66500       | 4
Anna Kowalski | 71000       | 3
(2 rows)
```

---

## Step 4: Correlated Subqueries — Row-by-Row Evaluation

A correlated subquery is a nested query that references a column from the outer query. Unlike simple subqueries, which run once, **a correlated subquery executes repeatedly — once for every row returned by the outer query.**

### Example 4.1: Department-Specific Comparisons
Let's find employees who earn more than their specific department's average salary.

```sql
-- The inner query references e.department from the outer query
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

**Step-by-Step Execution:**
1.  The engine reads the first row from the outer table: `Sarah Chen (Analytics, 95000)`.
2.  It replaces `e.department` in the subquery with `'Analytics'` and calculates the average salary for Analytics (`91500`).
3.  It evaluates: `95000 > 91500` (True). Sarah Chen remains in the result.
4.  The engine reads the next row: `James Wilson (Engineering, 115000)`.
5.  It evaluates the subquery for Engineering (`111500`).
6.  It evaluates: `115000 > 111500` (True). James Wilson remains in the result.
7.  This repeats for all 8 rows.

---

## EXISTS vs. IN

The `EXISTS` operator is used with correlated subqueries to check if a subquery returns *any* rows. It does not look at the actual values returned — it simply returns `TRUE` as soon as it finds a matching record.

### Example 5.1: Comparing syntax
These queries retrieve the same results, but their mechanics differ:

```sql
-- Using IN (Non-correlated)
SELECT name, department
FROM employees
WHERE emp_id IN (SELECT emp_id FROM sales);

-- Using EXISTS (Correlated)
SELECT name, department
FROM employees e
WHERE EXISTS (
    SELECT 1 
    FROM sales s 
    WHERE s.emp_id = e.emp_id
);
```

### Performance & Logical Differences

1.  **Short-Circuit Evaluation:** `EXISTS` is highly optimized. If the subquery finds a match on the very first row of an index scan, it immediately stops searching (short-circuits) and returns `TRUE`. Conversely, `IN` must execute the subquery and gather the entire list of values in memory before filtering the outer query.
2.  **NULL Handling Trap:** This is the most critical difference.

### ⚠️ The NOT IN Trap with NULLs
If a column in the subquery contains a `NULL` value, a `NOT IN` filter will return **zero rows**.

Let's assume our `employees` table had a column `manager_id` containing: `[101, 102, NULL]`.
We want to find employees who are not managers:

```sql
-- ❌ THIS WILL RETURN 0 ROWS:
SELECT name 
FROM employees
WHERE emp_id NOT IN (SELECT manager_id FROM employees);
```

**Why?**
The evaluation expands to:
`emp_id <> 101 AND emp_id <> 102 AND emp_id <> NULL`.
In SQL, any comparison against `NULL` evaluates to `UNKNOWN`. 
Since `AND` chains require *all* conditions to be true, and one condition is `UNKNOWN`, the entire filter evaluates to `UNKNOWN` or `FALSE` for every single row.

**The Fix:** Use `NOT EXISTS` instead. `NOT EXISTS` does not use three-valued comparison logic; it checks for row existence, which handles NULLs correctly.

```sql
-- ✅ Safe and correct:
SELECT name 
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 
    FROM employees m 
    WHERE m.manager_id = e.emp_id
);
```

---

## Edge Cases & Common Mistakes

### Gotcha 1: Subquery Returning More Than One Row
If you use a scalar operator (like `=`, `>`, `<`) with a subquery, and that subquery accidentally returns more than one row, the query will crash.

```sql
-- ❌ This will crash if more than one employee is named Sarah:
SELECT * 
FROM sales
WHERE emp_id = (SELECT emp_id FROM employees WHERE name = 'Sarah');
```
**Error:** `Subquery returned more than 1 row`.
**The Fix:** If the column cannot guarantee a single unique result, use `IN` instead of `=`.

### Gotcha 2: Missing Derived Table Alias
In SQL, any subquery placed in the `FROM` clause must be given an alias, even if you don't reference it elsewhere.

```sql
-- ❌ Syntax Error in MySQL/PostgreSQL:
SELECT * 
FROM (SELECT emp_id, salary FROM employees);
```
**The Fix:** Assign an alias:
```sql
SELECT * 
FROM (SELECT emp_id, salary FROM employees) AS temp;
```

---

## Practice Exercises & Mini-Projects

### Exercise 1: Finding Underperforming Marketing Departments
**Scenario:** The executive team wants a list of departments whose average employee salary is higher than the average sales revenue generated per deal in the `sales` table.

*   **Task:** Write a query using a scalar subquery to find departments whose average salary is greater than the overall average deal size.
*   **Expected Output:**
```text
# Output:
department  | avg_salary
------------|-----------
Engineering | 111500
Analytics   | 91500
```

<details>
<summary>View Solution</summary>

```sql
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > (SELECT AVG(amount) FROM sales);
```
</details>

---

### Exercise 2: Top Sales Rep Identification
**Scenario:** Find the names of employees whose total sales amount is higher than the sales average of *any* rep.

*   **Task:** Use a derived table to find total sales per rep, and filter for those higher than the overall average.

<details>
<summary>View Solution</summary>

```sql
SELECT name 
FROM employees e
WHERE e.emp_id IN (
    SELECT emp_id
    FROM sales
    GROUP BY emp_id
    HAVING SUM(amount) > (
        -- Calculate the average of total sales across all reps
        SELECT AVG(total_rep_sales)
        FROM (
            SELECT emp_id, SUM(amount) AS total_rep_sales
            FROM sales
            GROUP BY emp_id
        ) AS sub
    )
);
```
</details>

---

## Section Recaps

*   **Scalar subqueries** return a single value. They are used in calculations or filters.
*   **Multi-row subqueries** return a list of values and must be evaluated using `IN`, `ANY`, or `ALL`.
*   **Derived tables** are subqueries inside the `FROM` clause and must have an alias.
*   **Correlated subqueries** reference the outer query and execute once per row, which can impact performance on large datasets.
*   **`NOT IN` trap:** If the list contains a `NULL`, `NOT IN` will return zero rows. Use `NOT EXISTS` instead.

---

## Common Interview Questions

### Q1: What is the difference between a correlated and a non-correlated subquery?
**Answer:**
*   A **non-correlated subquery** is independent of the outer query. It runs once, retrieves its result, and passes it to the outer query.
*   A **correlated subquery** references columns from the outer query. It executes repeatedly, once for each candidate row processed by the outer query, making it slower on large datasets.

---

### Q2: Why does `NOT IN` return zero rows if the subquery returns a NULL value?
**Answer:**
SQL uses three-valued logic (True, False, Unknown). When comparing values using `NOT IN`, SQL translates `val NOT IN (1, 2, NULL)` to:
`val <> 1 AND val <> 2 AND val <> NULL`.

Since any comparison with `NULL` (including `<>`) results in `UNKNOWN`, the overall condition evaluates to `UNKNOWN`. As a result, the database engine cannot confirm the condition is true for any row, and it returns an empty result set.

---

### Q3: When should you use EXISTS instead of IN?
**Answer:**
*   Use **`EXISTS`** when checking for the existence of matching rows in another table, especially when the subquery table is large. `EXISTS` is faster because it short-circuits as soon as a single match is found.
*   Use **`IN`** when the subquery returns a small, static set of values, or when the database engine can easily index the subquery result.

---

### Q4: What is a derived table, and why does it need an alias?
**Answer:**
A derived table is a subquery nested in the `FROM` clause of an outer query. It behaves like a temporary table for the duration of the query. 

It requires an alias so the database engine and the outer query can identify and reference its columns (e.g., `alias_name.column_name`). Without an alias, the query parser throws a syntax error.

---

### Q5: Can you rewrite a correlated subquery as a JOIN? What are the benefits?
**Answer:**
Yes, most correlated subqueries can be rewritten using `JOIN` (specifically `INNER JOIN` or `LEFT JOIN` with group aggregations). 

Rewriting as a `JOIN` is generally beneficial because modern database query optimizers are better at optimizing join operations than executing subqueries row-by-row, leading to better execution plans and faster runtimes on large datasets.
