---
title: "NULL Handling — The Billion Dollar Mistake"
description: "Master NULL handling in SQL — IS NULL, COALESCE, NULLIF, and why NULLs break your queries silently."
category: "sql"
order: 106
phase: 2
tags: ["sql", "null", "coalesce", "nullif", "missing-data"]
publishedDate: 2025-03-06
prevSlug: "date-functions"
nextSlug: "union-intersect"
seoTitle: "SQL NULL Handling Tutorial | Datalogify"
seoDescription: "Master SQL NULL — IS NULL, COALESCE, NULLIF, NULL-safe comparisons, and common NULL traps."
---

## Why This Matters

NULL is not zero. NULL is not an empty string. NULL means "unknown" — and that one distinction will silently break your counts, your filters, your joins, and your aggregations. Every dataset you touch in the real world has missing data. If you don't handle NULLs deliberately, your numbers will be wrong and nobody will tell you.

## The Tables We're Working With

```sql
-- employees table
-- | emp_id | name           | department  | salary | manager_id | bonus  | phone          |
-- |--------|----------------|-------------|--------|------------|--------|----------------|
-- | 1      | Sarah Chen     | Analytics   | 95000  | 5          | 8500   | 555-0101       |
-- | 2      | James Wilson   | Engineering | 115000 | 5          | 12000  | NULL           |
-- | 3      | Priya Patel    | Analytics   | 88000  | 1          | NULL   | 555-0103       |
-- | 4      | Marcus Brown   | Sales       | 72000  | 6          | 5400   | 555-0104       |
-- | 5      | Lisa Zhang     | Engineering | 108000 | NULL       | 15000  | NULL           |
-- | 6      | David Kim      | Sales       | 82000  | 5          | NULL   | 555-0106       |
-- | 7      | Anna Kowalski  | Marketing   | NULL   | 6          | NULL   | NULL           |
-- | 8      | Tom Rivera     | Marketing   | 78000  | 6          | 3200   | 555-0108       |

-- orders table
-- | order_id | customer_id | product       | amount  | discount | ship_date  |
-- |----------|-------------|---------------|---------|----------|------------|
-- | 1001     | 201         | CRM Pro       | 15000   | 0.10     | 2024-01-15 |
-- | 1002     | 202         | Analytics Hub | 28000   | NULL     | 2024-01-22 |
-- | 1003     | 203         | Data Vault    | 8500    | 0.05     | NULL       |
-- | 1004     | 201         | Cloud Backup  | 3200    | NULL     | 2024-02-10 |
-- | 1005     | 204         | CRM Pro       | 15000   | 0.15     | 2024-02-28 |
-- | 1006     | 205         | ML Studio     | 35000   | NULL     | NULL       |
-- | 1007     | 202         | Cloud Backup  | 3200    | 0.00     | 2024-03-05 |
```

## What NULL Actually Means

NULL is not a value — it's the absence of a value. This distinction matters because NULL doesn't behave like any other value in SQL.

```sql
-- These all evaluate to NULL, not TRUE or FALSE
SELECT
    NULL = NULL      AS eq_test,       -- NULL (not TRUE!)
    NULL <> NULL     AS neq_test,      -- NULL (not TRUE!)
    NULL > 0         AS gt_test,       -- NULL
    NULL = 0         AS zero_test,     -- NULL
    NULL = ''        AS empty_test;    -- NULL
```

```text
eq_test | neq_test | gt_test | zero_test | empty_test
--------|----------|---------|-----------|----------
NULL    | NULL     | NULL    | NULL      | NULL
```

<div class="interview-tip">

**Three-Valued Logic**: SQL uses three-valued logic — TRUE, FALSE, and UNKNOWN. Any comparison involving NULL returns UNKNOWN, not FALSE. This is why `WHERE column = NULL` returns zero rows. NULL is not equal to anything, not even itself.

</div>

## IS NULL / IS NOT NULL — The Only Way to Test for NULL

```sql
-- WRONG: This returns nothing, ever
SELECT name, bonus
FROM employees
WHERE bonus = NULL;
```

```text
(0 rows)
```

```sql
-- RIGHT: Use IS NULL
SELECT name, bonus
FROM employees
WHERE bonus IS NULL;
```

```text
name          | bonus
--------------|------
Priya Patel   | NULL
David Kim     | NULL
Anna Kowalski | NULL
```

```sql
-- Find employees who DO have a phone number
SELECT name, phone
FROM employees
WHERE phone IS NOT NULL;
```

```text
name         | phone
-------------|----------
Sarah Chen   | 555-0101
Priya Patel  | 555-0103
Marcus Brown | 555-0104
David Kim    | 555-0106
Tom Rivera   | 555-0108
```

## The = NULL Trap — The #1 NULL Mistake

This is the single most common SQL bug. It looks right but returns wrong results silently:

```sql
-- Bug: trying to find employees with no manager
SELECT name, manager_id
FROM employees
WHERE manager_id = NULL;   -- Returns NOTHING. Always.
```

```text
(0 rows)
```

```sql
-- Fix: use IS NULL
SELECT name, manager_id
FROM employees
WHERE manager_id IS NULL;
```

```text
name       | manager_id
-----------|----------
Lisa Zhang | NULL
```

```sql
-- Bug: trying to exclude NULLs with <>
SELECT name, bonus
FROM employees
WHERE bonus <> 8500;       -- Misses NULL rows entirely
```

```text
name         | bonus
-------------|------
James Wilson | 12000
Marcus Brown | 5400
Lisa Zhang   | 15000
Tom Rivera   | 3200
```

```sql
-- Fix: include the NULL check explicitly
SELECT name, bonus
FROM employees
WHERE bonus <> 8500 OR bonus IS NULL;
```

```text
name          | bonus
--------------|------
James Wilson  | 12000
Priya Patel   | NULL
Marcus Brown  | 5400
Lisa Zhang    | 15000
David Kim     | NULL
Anna Kowalski | NULL
Tom Rivera    | 3200
```

## NULL in Aggregations — Silent Data Loss

Aggregate functions skip NULLs. This can silently change your results:

```sql
SELECT
    COUNT(*)         AS total_rows,
    COUNT(bonus)     AS count_bonus,     -- Skips NULLs
    COUNT(salary)    AS count_salary,    -- Skips NULLs
    SUM(bonus)       AS total_bonus,     -- Skips NULLs
    AVG(bonus)       AS avg_bonus        -- Skips NULLs (divides by 5, not 8)
FROM employees;
```

```text
total_rows | count_bonus | count_salary | total_bonus | avg_bonus
-----------|-------------|--------------|-------------|----------
8          | 5           | 7            | 44100       | 8820.00
```

<div class="interview-tip">

**Critical**: `AVG(bonus)` returns 44100 / 5 = 8820. It divides by 5 (non-NULL values), not 8 (all employees). If you want NULLs treated as zero: `AVG(COALESCE(bonus, 0))` = 44100 / 8 = 5512.50. This distinction has caused many wrong reports.

</div>

```sql
-- Compare the two approaches
SELECT
    AVG(bonus) AS avg_ignoring_nulls,
    AVG(COALESCE(bonus, 0)) AS avg_treating_null_as_zero,
    SUM(bonus) / COUNT(*) AS manual_avg_with_all_rows
FROM employees;
```

```text
avg_ignoring_nulls | avg_treating_null_as_zero | manual_avg_with_all_rows
-------------------|---------------------------|------------------------
8820.00            | 5512.50                   | 5512
```

## COALESCE — Replace NULL with a Default

COALESCE returns the first non-NULL value from a list. This is your most-used NULL handling function.

```sql
SELECT name,
       bonus,
       COALESCE(bonus, 0) AS bonus_clean
FROM employees;
```

```text
name          | bonus | bonus_clean
--------------|-------|------------
Sarah Chen    | 8500  | 8500
James Wilson  | 12000 | 12000
Priya Patel   | NULL  | 0
Marcus Brown  | 5400  | 5400
Lisa Zhang    | 15000 | 15000
David Kim     | NULL  | 0
Anna Kowalski | NULL  | 0
Tom Rivera    | 3200  | 3200
```

### COALESCE with Multiple Fallbacks

COALESCE takes multiple arguments and returns the first non-NULL:

```sql
-- Try phone, then 'No Phone on File'
SELECT name,
       phone,
       COALESCE(phone, 'No Phone') AS contact_number
FROM employees;
```

```text
name          | phone    | contact_number
--------------|----------|---------------
Sarah Chen    | 555-0101 | 555-0101
James Wilson  | NULL     | No Phone
Priya Patel   | 555-0103 | 555-0103
Marcus Brown  | 555-0104 | 555-0104
Lisa Zhang    | NULL     | No Phone
David Kim     | 555-0106 | 555-0106
Anna Kowalski | NULL     | No Phone
Tom Rivera    | 555-0108 | 555-0108
```

### Total Compensation with COALESCE

```sql
SELECT name,
       salary,
       bonus,
       COALESCE(salary, 0) + COALESCE(bonus, 0) AS total_comp
FROM employees
ORDER BY total_comp DESC;
```

```text
name          | salary | bonus | total_comp
--------------|--------|-------|----------
Lisa Zhang    | 108000 | 15000 | 123000
James Wilson  | 115000 | 12000 | 127000
Sarah Chen    | 95000  | 8500  | 103500
Priya Patel   | 88000  | NULL  | 88000
David Kim     | 82000  | NULL  | 82000
Tom Rivera    | 78000  | 3200  | 81200
Marcus Brown  | 72000  | 5400  | 77400
Anna Kowalski | NULL   | NULL  | 0
```

## NULLIF — Turn a Value Into NULL

NULLIF(a, b) returns NULL if a = b, otherwise returns a. The opposite of COALESCE — it creates NULLs.

```sql
-- Prevent division by zero
SELECT order_id,
       amount,
       discount,
       amount * COALESCE(discount, 0) AS discount_amount,
       amount * NULLIF(discount, 0) AS discount_nonzero
FROM orders;
```

```text
order_id | amount | discount | discount_amount | discount_nonzero
---------|--------|----------|-----------------|-----------------
1001     | 15000  | 0.10     | 1500.00         | 1500.00
1002     | 28000  | NULL     | 0.00            | NULL
1003     | 8500   | 0.05     | 425.00          | 425.00
1004     | 3200   | NULL     | 0.00            | NULL
1005     | 15000  | 0.15     | 2250.00         | 2250.00
1006     | 35000  | NULL     | 0.00            | NULL
1007     | 3200   | 0.00     | 0.00            | NULL
```

### Classic Use: Safe Division

```sql
-- Without NULLIF: crashes on division by zero
-- With NULLIF: returns NULL instead of error
SELECT department,
       COUNT(*) AS headcount,
       SUM(bonus) AS total_bonus,
       SUM(bonus) / NULLIF(COUNT(bonus), 0) AS avg_bonus_safe
FROM employees
GROUP BY department;
```

```text
department  | headcount | total_bonus | avg_bonus_safe
------------|-----------|-------------|---------------
Analytics   | 2         | 8500        | 8500
Engineering | 2         | 27000       | 13500
Marketing   | 2         | 3200        | 3200
Sales       | 2         | 5400        | 5400
```

## NULL in JOINs — Rows That Disappear

NULLs never match in JOIN conditions. This is by design — but it can silently drop rows:

```sql
-- Self-join: find each employee's manager
-- Anna Kowalski's manager_id is 6, but Lisa Zhang's is NULL
SELECT e.name AS employee,
       m.name AS manager
FROM employees e
INNER JOIN employees m ON e.manager_id = m.emp_id;
```

```text
employee      | manager
--------------|------------
Sarah Chen    | Lisa Zhang
James Wilson  | Lisa Zhang
Priya Patel   | Sarah Chen
Marcus Brown  | David Kim
David Kim     | Lisa Zhang
Anna Kowalski | David Kim
Tom Rivera    | David Kim
```

```sql
-- Lisa Zhang has no manager (NULL) — she was dropped!
-- Use LEFT JOIN to keep everyone
SELECT e.name AS employee,
       COALESCE(m.name, 'No Manager') AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

```text
employee      | manager
--------------|------------
Sarah Chen    | Lisa Zhang
James Wilson  | Lisa Zhang
Priya Patel   | Sarah Chen
Marcus Brown  | David Kim
Lisa Zhang    | No Manager
David Kim     | Lisa Zhang
Anna Kowalski | David Kim
Tom Rivera    | David Kim
```

## NULL in Boolean Logic — AND, OR, NOT

NULL follows three-valued logic in boolean expressions:

```sql
-- TRUE AND NULL = NULL (unknown)
-- FALSE AND NULL = FALSE
-- TRUE OR NULL = TRUE
-- FALSE OR NULL = NULL (unknown)
-- NOT NULL = NULL

SELECT name, bonus, department
FROM employees
WHERE department = 'Analytics'
  AND bonus > 5000;   -- Priya's NULL bonus makes this NULL, row excluded
```

```text
name       | bonus | department
-----------|-------|----------
Sarah Chen | 8500  | Analytics
```

```sql
-- To include NULLs in OR conditions
SELECT name, bonus
FROM employees
WHERE bonus > 10000 OR bonus IS NULL;
```

```text
name          | bonus
--------------|------
James Wilson  | 12000
Priya Patel   | NULL
Lisa Zhang    | 15000
David Kim     | NULL
Anna Kowalski | NULL
```

## NULL in ORDER BY

NULLs sort first or last depending on your database. You can control this:

```sql
-- PostgreSQL: control NULL position
SELECT name, bonus
FROM employees
ORDER BY bonus NULLS LAST;
```

```text
name          | bonus
--------------|------
Tom Rivera    | 3200
Marcus Brown  | 5400
Sarah Chen    | 8500
James Wilson  | 12000
Lisa Zhang    | 15000
Priya Patel   | NULL
David Kim     | NULL
Anna Kowalski | NULL
```

```sql
-- Works in all databases: use COALESCE to force sort order
SELECT name, bonus
FROM employees
ORDER BY COALESCE(bonus, 0);
```

```text
name          | bonus
--------------|------
Priya Patel   | NULL
David Kim     | NULL
Anna Kowalski | NULL
Tom Rivera    | 3200
Marcus Brown  | 5400
Sarah Chen    | 8500
James Wilson  | 12000
Lisa Zhang    | 15000
```

## NULL-Safe Comparison Patterns

```sql
-- Pattern 1: Compare two columns that might be NULL
-- WRONG: This misses rows where both are NULL
SELECT * FROM orders WHERE discount = ship_date;

-- RIGHT: Use IS NOT DISTINCT FROM (PostgreSQL)
-- SELECT * FROM orders WHERE discount IS NOT DISTINCT FROM other_col;

-- Pattern 2: COALESCE both sides for comparison
SELECT order_id, discount
FROM orders
WHERE COALESCE(discount, -1) = COALESCE(NULL, -1);
```

```text
order_id | discount
---------|--------
1002     | NULL
1004     | NULL
1006     | NULL
```

```sql
-- Pattern 3: Count NULLs explicitly
SELECT
    COUNT(*) AS total_orders,
    COUNT(ship_date) AS shipped,
    COUNT(*) - COUNT(ship_date) AS not_shipped,
    ROUND(100.0 * COUNT(ship_date) / COUNT(*), 1) AS ship_rate_pct
FROM orders;
```

```text
total_orders | shipped | not_shipped | ship_rate_pct
-------------|---------|-------------|-------------
7            | 5       | 2           | 71.4
```

## Where This Is Used in Real Jobs

| Scenario | Function | Why |
|----------|----------|-----|
| Revenue reports | COALESCE(discount, 0) | Missing discounts should be zero, not NULL |
| Customer profiles | COALESCE(phone, email, 'No Contact') | Fallback contact method |
| Safe division | x / NULLIF(y, 0) | Prevent division-by-zero crashes |
| Data quality checks | COUNT(*) - COUNT(col) | Count missing values per column |
| LEFT JOIN cleanup | COALESCE(m.name, 'Unassigned') | Label unmatched rows |
| Sorting reports | ORDER BY col NULLS LAST | Control where gaps appear |

<div class="challenge">

### Challenge 1: Data Quality Report
Write a query that shows, for each column in the employees table, the count of NULL values and the percentage of rows with NULLs. Show columns: column_name, null_count, null_percentage.

### Challenge 2: Clean Compensation Report
Create a report showing every employee's name, salary (replace NULL with 'Unpaid'), bonus (replace NULL with 0), and total compensation. Sort by total compensation descending.

### Challenge 3: Unshipped Orders
Find all orders that haven't shipped yet (ship_date IS NULL). Show the order_id, customer_id, product, amount, and the number of days since the order was placed (assume today is 2024-03-15).

</div>

## Common Interview Questions

### Q1: What is the difference between NULL, 0, and an empty string?

**Answer:** NULL means "unknown" or "no value" — the data is missing. Zero (0) is a known numeric value. Empty string ('') is a known string value that happens to have no characters. NULL is not equal to zero or empty string. `NULL = 0` returns NULL (unknown), not TRUE. In most databases, `NULL = ''` also returns NULL. PostgreSQL and MySQL treat empty strings and NULL differently. Oracle treats empty strings as NULL, which is a common source of bugs when migrating.

### Q2: Why does `WHERE column = NULL` not work?

**Answer:** Because any comparison with NULL returns UNKNOWN, not TRUE or FALSE. The WHERE clause only returns rows where the condition is TRUE. Since `column = NULL` evaluates to UNKNOWN (not TRUE), zero rows pass the filter. You must use `WHERE column IS NULL` instead. This is a consequence of SQL's three-valued logic (TRUE, FALSE, UNKNOWN).

### Q3: What does COALESCE do and how is it different from IFNULL/ISNULL?

**Answer:** COALESCE returns the first non-NULL value from a list of arguments. `COALESCE(a, b, c)` checks a first, then b, then c. IFNULL (MySQL) and ISNULL (SQL Server) only take two arguments. COALESCE is ANSI standard and works in all databases. Use COALESCE for portability and when you need multiple fallback values.

### Q4: How do NULLs affect COUNT, SUM, and AVG?

**Answer:** COUNT(*) counts all rows including NULLs. COUNT(column) skips NULL values. SUM skips NULLs (SUM of all NULLs returns NULL, not 0). AVG skips NULLs in both numerator and denominator — so AVG of (10, NULL, 20) = 15, not 10. This means AVG can be misleading when you have many NULLs. Use `AVG(COALESCE(col, 0))` if you want NULLs treated as zero.

### Q5: How do you handle NULL in JOIN conditions?

**Answer:** NULL never equals NULL in a JOIN condition, so rows with NULL join keys won't match. Use LEFT JOIN if you need to keep unmatched rows. In PostgreSQL, you can use `IS NOT DISTINCT FROM` for NULL-safe equality in joins. In MySQL, use the `<=>` operator. For other databases, use `COALESCE(a.col, sentinel) = COALESCE(b.col, sentinel)` where sentinel is a value that won't appear in real data.
