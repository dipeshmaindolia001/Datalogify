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

Imagine you are running a giant e-commerce warehouse. On your inventory shelves, you have items in boxes:
* **Shelf A** has a box with **5 shirts** inside. (A known numeric value: `5`).
* **Shelf B** has a box with **0 shirts** inside. (A known numeric value: `0`. The box is present but empty).
* **Shelf C** has a box that is open, containing a label but no contents. (An empty string: `''`).
* **Shelf D** has **no box at all**. There is just an empty space on the shelf. You do not know if there are shirts, books, or electronics supposed to go there. You have no information. This is **NULL**.

In database terms, **NULL is not a value**. It is a marker indicating the **absence of a value** or that the value is **unknown**. 

Treating NULL as if it were a zero, a space, or a blank string is one of the most common and costly mistakes in data analytics. It leads to:
1. **Wrong Financial Reports**: Unintentionally excluding transactions with missing discounts.
2. **Silent Filter Drops**: Dropping rows from your reports because a column you filtered on had NULLs.
3. **Skewed Averages**: Calculating incorrect average order values because your database skipped NULLs instead of treating them as zero.

In this lesson, you will learn the exact mechanics of NULL, how to navigate SQL's unique three-valued logic, and how to use tools like `COALESCE` and `NULLIF` to write robust, bug-free queries.

---

## Step-by-Step Concept Breakdown

### 1. What is NULL?
In 1979, British computer scientist E.F. Codd (the creator of the relational database model) introduced NULL to represent missing or inapplicable information.

Because NULL represents the "unknown," you cannot compare it using standard operators. 
* Is an unknown value equal to another unknown value? We don't know.
* Is an unknown value greater than 10? We don't know.

Therefore, any direct comparison with NULL does not return `TRUE` or `FALSE`. It returns **UNKNOWN**.

```sql
-- What SQL does behind the scenes:
SELECT 
    5 = 5            AS five_eq_five,      -- Returns: TRUE
    5 = NULL         AS five_eq_null,      -- Returns: UNKNOWN
    NULL = NULL      AS null_eq_null,      -- Returns: UNKNOWN
    NULL <> NULL     AS null_neq_null,     -- Returns: UNKNOWN
    NULL > 100       AS null_gt_hundred;   -- Returns: UNKNOWN
```

```text
# Output:
five_eq_five | five_eq_null | null_eq_null | null_neq_null | null_gt_hundred
-------------+--------------+--------------+---------------+----------------
TRUE         | NULL         | NULL         | NULL          | NULL
```
*(Note: In SQL, the value representing UNKNOWN is rendered as `NULL` in the output).*

---

### 2. Three-Valued Logic (3VL)
Standard logic is binary: a statement is either `TRUE` or `FALSE`. Because of NULL, SQL uses **Three-Valued Logic (3VL)**:
1. **TRUE**
2. **FALSE**
3. **UNKNOWN** (represented by NULL)

The database's query engine relies on these three values to evaluate filters in your `WHERE` clause. A row is only returned if the condition evaluates to **TRUE**. If a condition evaluates to **FALSE** or **UNKNOWN**, the row is discarded.

#### Truth Tables for Three-Valued Logic (3VL)
Understanding how `AND`, `OR`, and `NOT` work with `UNKNOWN` is critical for auditing your filters.

##### The AND Operator
The `AND` operator requires both operands to be `TRUE` to return `TRUE`. If either operand is `FALSE`, the result is `FALSE`. Otherwise, it returns `UNKNOWN`.

| A | B | A AND B |
|---|---|---------|
| TRUE | TRUE | TRUE |
| TRUE | FALSE | FALSE |
| TRUE | UNKNOWN | UNKNOWN |
| FALSE | TRUE | FALSE |
| FALSE | FALSE | FALSE |
| FALSE | UNKNOWN | FALSE |
| UNKNOWN | TRUE | UNKNOWN |
| UNKNOWN | FALSE | FALSE |
| UNKNOWN | UNKNOWN | UNKNOWN |

##### The OR Operator
The `OR` operator requires at least one operand to be `TRUE` to return `TRUE`. If both operands are `FALSE`, it returns `FALSE`. Otherwise, it returns `UNKNOWN`.

| A | B | A OR B |
|---|---|--------|
| TRUE | TRUE | TRUE |
| TRUE | FALSE | TRUE |
| TRUE | UNKNOWN | TRUE |
| FALSE | TRUE | TRUE |
| FALSE | FALSE | FALSE |
| FALSE | UNKNOWN | UNKNOWN |
| UNKNOWN | TRUE | TRUE |
| UNKNOWN | FALSE | UNKNOWN |
| UNKNOWN | UNKNOWN | UNKNOWN |

##### The NOT Operator
The `NOT` operator simply inverts the truth value. Inverting an unknown value remains unknown.

| A | NOT A |
|---|-------|
| TRUE | FALSE |
| FALSE | TRUE |
| UNKNOWN | UNKNOWN |

---

### 3. NULL Propagation in Math and Strings
In math, if you add, subtract, multiply, or divide a number by an unknown value, the result is always unknown. This is called **NULL propagation**.

$$\text{Salary (\$100,000)} + \text{Bonus (UNKNOWN)} = \text{Total Compensation (UNKNOWN)}$$

```sql
SELECT 
    100 + NULL       AS add_test,
    50 - NULL        AS sub_test,
    10 * NULL        AS mul_test,
    20 / NULL        AS div_test,
    'Hello ' || NULL AS concat_test; -- PostgreSQL/Oracle concatenation
```

```text
# Output:
add_test | sub_test | mul_test | div_test | concat_test
---------+----------+----------+----------+-------------
NULL     | NULL     | NULL     | NULL     | NULL
```

> [!WARNING]
> In PostgreSQL and Oracle, concatenating a string with NULL yields NULL. In SQL Server and MySQL, it depends on database settings, but standard SQL dictates that any string concatenation with NULL propagates the NULL.

---

## The Core NULL Handling Tools

### 1. `IS NULL` and `IS NOT NULL`
Because standard comparisons return `UNKNOWN`, we cannot use `=` or `<>` to check for NULL. Instead, SQL provides the special operators `IS NULL` and `IS NOT NULL`.

```sql
-- WRONG: This query will run but return 0 rows
SELECT name, bonus 
FROM employees 
WHERE bonus = NULL;

-- RIGHT: This query correctly identifies employees without bonuses
SELECT name, bonus 
FROM employees 
WHERE bonus IS NULL;
```

---

### 2. `COALESCE` — The Fallback Provider
The `COALESCE` function accepts a list of arguments and returns the **first non-NULL value** it encounters from left to right.

```sql
-- Syntax:
COALESCE(value_1, value_2, ..., value_n)
```

Think of it as a fallback sequence:
"Use the work email. If that is missing, use the personal email. If that is also missing, display 'no-email@company.com'."

```sql
SELECT 
    name,
    COALESCE(work_email, personal_email, 'no-email@company.com') AS contact_email
FROM employees;
```

#### How `COALESCE` Compares to `CASE`
Under the hood, the SQL compiler converts `COALESCE` into an equivalent `CASE` expression. For example:
```sql
COALESCE(a, b, c)
```
Is translated to:
```sql
CASE 
    WHEN a IS NOT NULL THEN a
    WHEN b IS NOT NULL THEN b
    ELSE c
END
```
`COALESCE` is simply cleaner syntactic sugar for this common conditional logic.

---

### 3. Dialect Differences: `NVL`, `IFNULL`, and `ISNULL`
While `COALESCE` is the standard ANSI SQL standard and works in all major databases, you will often see platform-specific alternatives in legacy codebases:

* **PostgreSQL / redshift**: Supports standard `COALESCE`.
* **Oracle**: Uses `NVL(expr1, expr2)` which only allows two arguments.
* **MySQL**: Uses `IFNULL(expr1, expr2)` which also only allows two arguments.
* **SQL Server (T-SQL)**: Uses `ISNULL(expr1, expr2)` (not to be confused with the `IS NULL` condition).

To write database-agnostic code that runs anywhere without modification, always prefer **`COALESCE`**.

---

### 4. `NULLIF` — The Equal-Value Nullifier
The `NULLIF` function takes two arguments. If they are equal, it returns `NULL`. If they are not equal, it returns the first argument.

```sql
-- Syntax:
NULLIF(expression_1, expression_2)
```

This is most commonly used to prevent division-by-zero crashes.
If `sales_count` is 0, we can turn it into `NULL` using `NULLIF(sales_count, 0)`. Then, dividing revenue by NULL will safely yield NULL instead of breaking the query.

```sql
SELECT 
    total_revenue,
    sales_count,
    total_revenue / NULLIF(sales_count, 0) AS average_sale_amount
FROM store_performance;
```

---

## The Tables We're Working With

To see these concepts in action, we will use two tables from our corporate directory and e-commerce transactions:

### The `employees` Table
```sql
-- | emp_id | name           | department  | salary | manager_id | bonus  | phone          | work_email        | personal_email       |
-- |--------|----------------|-------------|--------|------------|--------|----------------|-------------------|----------------------|
-- | 1      | Sarah Chen     | Analytics   | 95000  | 5          | 8500   | 555-0101       | sarah@corp.com    | NULL                 |
-- | 2      | James Wilson   | Engineering | 115000 | 5          | 12000  | NULL           | james@corp.com    | jwilson@gmail.com    |
-- | 3      | Priya Patel    | Analytics   | 88000  | 1          | NULL   | 555-0103       | NULL              | priya.p@yahoo.com    |
-- | 4      | Marcus Brown   | Sales       | 72000  | 6          | 5400   | 555-0104       | marcus@corp.com   | NULL                 |
-- | 5      | Lisa Zhang     | Engineering | 108000 | NULL       | 15000  | NULL           | lisa@corp.com     | lisaz@gmail.com      |
-- | 6      | David Kim      | Sales       | 82000  | 5          | NULL   | 555-0106       | NULL              | NULL                 |
-- | 7      | Anna Kowalski  | Marketing   | NULL   | 6          | NULL   | NULL           | anna@corp.com     | NULL                 |
-- | 8      | Tom Rivera     | Marketing   | 78000  | 6          | 3200   | 555-0108       | tom@corp.com      | trivera@outlook.com  |
```

### The `orders` Table
```sql
-- | order_id | customer_id | product       | amount  | discount | ship_date  | units_sold |
-- |----------|-------------|---------------|---------|----------|------------|------------|
-- | 1001     | 201         | CRM Pro       | 15000   | 0.10     | 2024-01-15 | 10         |
-- | 1002     | 202         | Analytics Hub | 28000   | NULL     | 2024-01-22 | 0          |
-- | 1003     | 203         | Data Vault    | 8500    | 0.05     | NULL       | 5          |
-- | 1004     | 201         | Cloud Backup  | 3200    | NULL     | 2024-02-10 | 1          |
-- | 1005     | 204         | CRM Pro       | 15000   | 0.15     | 2024-02-28 | 8          |
-- | 1006     | 205         | ML Studio     | 35000   | NULL     | NULL       | 0          |
-- | 1007     | 202         | Cloud Backup  | 3200    | 0.00     | 2024-03-05 | 2          |
```

---

## Code & Practical Walkthroughs

### Example 1: E-commerce Order Shipping & Revenue Audit
We need to calculate the actual revenue for each order.
* Net Revenue = `amount * (1 - discount)`
* If `discount` is NULL, it represents that no discount was applied (which should be 0%).
* We also need to flag orders that have not shipped yet.

```sql
SELECT 
    order_id,
    product,
    amount,
    -- If discount is NULL, replace it with 0 so the arithmetic doesn't return NULL
    COALESCE(discount, 0) AS applied_discount,
    -- Calculate net revenue safely
    amount * (1 - COALESCE(discount, 0)) AS net_revenue,
    -- Flag if the item has shipped
    CASE 
        WHEN ship_date IS NULL THEN 'Pending Shipment'
        ELSE 'Shipped'
    END AS shipping_status
FROM orders;
```

```text
# Output:
order_id | product       | amount | applied_discount | net_revenue | shipping_status
---------+---------------+--------+------------------+-------------+------------------
1001     | CRM Pro       | 15000  | 0.10             | 13500.00    | Shipped
1002     | Analytics Hub | 28000  | 0.00             | 28000.00    | Shipped
1003     | Data Vault    | 8500   | 0.05             | 8075.00     | Pending Shipment
1004     | Cloud Backup  | 3200   | 0.00             | 3200.00     | Shipped
1005     | CRM Pro       | 15000  | 0.15             | 12750.00    | Shipped
1006     | ML Studio     | 35000  | 0.00             | 35000.00    | Pending Shipment
1007     | Cloud Backup  | 3200   | 0.00             | 3200.00     | Shipped
```

---

### Example 2: Employee Contact Directory & Compensation Calculator
The HR team wants a unified contact directory and a total compensation statement.
* Total Compensation = `salary + bonus`.
* If salary is NULL, they are unpaid (contractor).
* If bonus is NULL, the bonus is 0.
* Contact method should check `work_email`, then `personal_email`, then `phone`. If none are available, display 'NO CONTACT'.

```sql
SELECT 
    name,
    -- Chained fallback contact search
    COALESCE(work_email, personal_email, phone, 'NO CONTACT') AS primary_contact,
    -- Total compensation calculation
    COALESCE(salary, 0) AS base_salary,
    COALESCE(bonus, 0) AS annual_bonus,
    -- Without COALESCE, employees with NULL bonus would get NULL total compensation
    COALESCE(salary, 0) + COALESCE(bonus, 0) AS total_compensation
FROM employees;
```

```text
# Output:
name           | primary_contact      | base_salary | annual_bonus | total_compensation
---------------+----------------------+-------------+--------------+-------------------
Sarah Chen     | sarah@corp.com       | 95000       | 8500         | 103500
James Wilson   | james@corp.com       | 115000      | 12000        | 127000
Priya Patel    | priya.p@yahoo.com    | 88000       | 0            | 88000
Marcus Brown   | marcus@corp.com      | 72000       | 5400         | 77400
Lisa Zhang     | lisa@corp.com        | 108000      | 15000        | 123000
David Kim      | 555-0106             | 82000       | 0            | 82000
Anna Kowalski  | anna@corp.com        | 0           | 0            | 0
Tom Rivera     | tom@corp.com         | 78000       | 3200         | 81200
```

---

### Example 3: Division-by-Zero Safety in E-commerce Performance
Let's find the average price paid per unit sold: `amount / units_sold`.
In our orders table, some orders have `units_sold` equal to 0. A raw division would cause a system error: `ERROR: division by zero`.
We will use `NULLIF(units_sold, 0)` to convert 0 to NULL. Since any division by NULL evaluates to NULL, the query will run smoothly.

```sql
SELECT 
    order_id,
    product,
    amount,
    units_sold,
    -- NULLIF converts 0 to NULL. Dividing by NULL safely produces NULL
    amount / NULLIF(units_sold, 0) AS price_per_unit
FROM orders;
```

```text
# Output:
order_id | product       | amount | units_sold | price_per_unit
---------+---------------+--------+------------+----------------
1001     | CRM Pro       | 15000  | 10         | 1500.00
1002     | Analytics Hub | 28000  | 0          | NULL
1003     | Data Vault    | 8500   | 5          | 1700.00
1004     | Cloud Backup  | 3200   | 1          | 3200.00
1005     | CRM Pro       | 15000  | 8          | 1875.00
1006     | ML Studio     | 35000  | 0          | NULL
1007     | Cloud Backup  | 3200   | 2          | 1600.00
```

---

### Example 4: Data Quality Audit Report
As a data engineer or analyst, you must audit tables for missing values. We want to find the number of missing values and the completeness rate for the `employees` table.

```sql
SELECT 
    COUNT(*) AS total_rows,
    -- Count of NULL values in key columns
    COUNT(*) - COUNT(salary) AS missing_salaries,
    COUNT(*) - COUNT(bonus) AS missing_bonuses,
    COUNT(*) - COUNT(phone) AS missing_phones,
    -- Completeness percentages
    ROUND(100.0 * COUNT(salary) / COUNT(*), 1) AS salary_completeness_pct,
    ROUND(100.0 * COUNT(bonus) / COUNT(*), 1) AS bonus_completeness_pct
FROM employees;
```

```text
# Output:
total_rows | missing_salaries | missing_bonuses | missing_phones | salary_completeness_pct | bonus_completeness_pct
-----------+------------------+-----------------+----------------+-------------------------+-----------------------
8          | 1                | 3               | 3              | 87.5                    | 62.5
```

---

## How NULLs Affect Joins & Aggregations

### 1. NULLs in Joins
When you join two tables on a key, the database looks for equality: `tableA.key = tableB.key`. 
Since `NULL = NULL` is evaluated as `UNKNOWN`, rows with NULL keys will **never match** in an `INNER JOIN`.

Consider an employee hierarchy. Lisa Zhang has no manager, so her `manager_id` is NULL.
```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
INNER JOIN employees m ON e.manager_id = m.emp_id;
```
Lisa Zhang is completely omitted because `NULL = m.emp_id` evaluates to UNKNOWN.

If you use a `LEFT JOIN`, the row with the NULL join key is preserved, but all columns from the right table are filled with NULLs.
```sql
SELECT e.name AS employee, COALESCE(m.name, 'CEO') AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

---

### 2. NULLs in Aggregations
Aggregations treat NULLs with specific rules that can easily distort metrics:

#### The `COUNT` Difference
* `COUNT(*)` counts every row in the table, regardless of content (even if the entire row contains NULLs).
* `COUNT(column_name)` counts only rows where the specified column is **not NULL**.

```sql
SELECT 
    COUNT(*) AS count_all_rows,
    COUNT(bonus) AS count_non_null_bonuses
FROM employees;
```

```text
# Output:
count_all_rows | count_non_null_bonuses
---------------+-----------------------
8              | 5
```

#### Mathematical Aggregations (`SUM`, `AVG`, `MIN`, `MAX`)
* These operations **ignore NULL values completely**.
* If calculating an average (`AVG`), SQL computes it as $\frac{\text{Sum of non-NULL values}}{\text{Count of non-NULL values}}$.

Let's look at the average salary in the `employees` table:
Values: `95000, 115000, 88000, 72000, 108000, 82000, NULL, 78000` (7 active salaries, 1 NULL).

```sql
SELECT 
    -- Average of the 7 non-NULL values
    AVG(salary) AS standard_avg,
    -- Average treating NULL (contractor) as 0
    AVG(COALESCE(salary, 0)) AS zero_filled_avg
FROM employees;
```

```text
# Output:
standard_avg | zero_filled_avg
-------------+-----------------
91142.86     | 79750.00
```
Which one is correct? It depends on the business question. If you want the average salary of paid employees, `standard_avg` is correct. If you want the average salary across all headcount, `zero_filled_avg` is correct.

---

### 3. NULLs in `ORDER BY`
By default:
* **PostgreSQL / Oracle**: NULL values are treated as the largest possible values. They appear at the **end** in ascending orders (`ASC`), and at the **beginning** in descending orders (`DESC`).
* **MySQL / SQL Server**: NULL values are treated as the smallest possible values. They appear at the **beginning** in ascending orders (`ASC`), and at the **end** in descending orders (`DESC`).

You can explicitly control this behavior using standard SQL syntax:
```sql
SELECT name, bonus
FROM employees
ORDER BY bonus ASC NULLS LAST; -- Pushes NULLs to the bottom
```

---

## Edge Cases & Common Mistakes (Gotchas)

### Gotcha 1: The `NOT IN` with NULL Trap
This is the most dangerous silent trap in SQL. If you use a `NOT IN` filter against a list containing a NULL value, the query will **always return zero rows**.

Suppose you want to find all employees who are not managers:
```sql
-- Manager IDs present in the table: 5, 1, 6, and NULL (Lisa Zhang has no manager)
-- WRONG QUERY:
SELECT name 
FROM employees
WHERE emp_id NOT IN (SELECT manager_id FROM employees);
```
Why does this return zero rows? 
The subquery returns the set `{5, 1, 6, NULL}`.
The query translates to:
`WHERE emp_id <> 5 AND emp_id <> 1 AND emp_id <> 6 AND emp_id <> NULL`

Since `emp_id <> NULL` evaluates to **UNKNOWN**, the entire chain of `AND` conditions is evaluated to **UNKNOWN** or **FALSE**. No row can evaluate to **TRUE**.

#### The Safe Fixes:
```sql
-- Option A: Exclude NULLs from the subquery
SELECT name 
FROM employees
WHERE emp_id NOT IN (SELECT manager_id FROM employees WHERE manager_id IS NOT NULL);

-- Option B: Use NOT EXISTS (Recommended standard)
SELECT name 
FROM employees e
WHERE NOT EXISTS (
    SELECT 1 
    FROM employees m 
    WHERE m.manager_id = e.emp_id
);
```

---

### Gotcha 2: The `COALESCE` Data Type Constraint
All expressions inside a `COALESCE` function must resolve to the **same data type** (or data types that can be implicitly converted).

```sql
-- WRONG: Mixing VARCHAR and INTEGER
SELECT COALESCE(bonus, 'No Bonus') FROM employees; 
-- Result: ERROR: invalid input syntax for integer: "No Bonus"

-- RIGHT: Cast the integer to a string first
SELECT COALESCE(CAST(bonus AS VARCHAR), 'No Bonus') FROM employees;
```

---

### Gotcha 3: NULLs and Indexing
Beginners often assume that indexing a column will speed up queries checking for `IS NULL`. 
* In **PostgreSQL**, standard B-Tree indexes do store NULLs, so `WHERE column IS NULL` can utilize an index scan.
* In **Oracle**, standard B-Tree indexes **do not** index rows where all indexed columns are NULL. A query looking for `IS NULL` will force a full table scan. Analysts often resolve this using function-based indexes or partial/filtered indexes:
  ```sql
  CREATE INDEX idx_missing_bonus ON employees(emp_id) WHERE bonus IS NULL;
  ```

---

## Practice Exercises & Mini-Projects

### Exercise 1: Identify and Fix a Broken Subquery
A junior analyst wrote the following query to find orders that were not discounted. They complained that it returned no records at all:
```sql
SELECT order_id, product 
FROM orders 
WHERE discount NOT IN (0.05, 0.10, 0.15, NULL);
```
Rewrite the query to return the correct records and explain why it failed.

<details>
<summary>View Solution</summary>

**Explanation:** The inclusion of `NULL` in the `NOT IN` set turned the evaluation into `discount <> 0.05 AND discount <> 0.10 AND discount <> 0.15 AND discount <> NULL`. Since the comparison with NULL yields UNKNOWN, the entire WHERE clause returns UNKNOWN, yielding no results.

**Corrected SQL:**
```sql
SELECT order_id, product 
FROM orders 
-- Filter out the NULLs in the set and check for NULL explicitly if needed
WHERE discount NOT IN (0.05, 0.10, 0.15) 
   OR discount IS NULL;
```
</details>

---

### Exercise 2: Conversion Rate Calculator with Zero Protection
Write a query from the `orders` table that calculates the ratio of units sold to the dollar amount spent (`units_sold / amount`). Ensure that orders with $0 in `amount` (promotional free products) do not crash the database.

<details>
<summary>View Solution</summary>

**SQL Query:**
```sql
SELECT 
    order_id,
    product,
    amount,
    units_sold,
    -- Prevent division by zero if amount is 0 by converting it to NULL
    CAST(units_sold AS NUMERIC) / NULLIF(amount, 0) AS units_per_dollar
FROM orders;
```
</details>

---

### Exercise 3: Construct a Hierarchy-Aware Contact List
Create a report containing every employee's name and the email address where they should receive system notifications. 
* Priority 1: `work_email`
* Priority 2: `personal_email`
* Priority 3: Their manager's `work_email` (if they do not have an email address of their own)
* Default: 'system@company.com'

<details>
<summary>View Solution</summary>

**SQL Query:**
```sql
SELECT 
    e.name AS employee_name,
    COALESCE(
        e.work_email, 
        e.personal_email, 
        m.work_email, 
        'system@company.com'
    ) AS notification_email
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```
</details>

---

### Section Recaps

* **NULL is a state, not a value**: It means "unknown" or "missing data" and is completely distinct from `0` and empty strings `''`.
* **Three-Valued Logic**: SQL filters require conditions to be `TRUE`. Comparisons with NULL return `UNKNOWN` which drops the row.
* **Always use `IS NULL`**: Standard operators like `=` and `<>` do not work with NULL.
* **COALESCE and NULLIF**: Use `COALESCE` to define backup default values, and use `NULLIF` to prevent division-by-zero crashes.
* **Aggregations ignore NULLs**: Except for `COUNT(*)`, functions like `COUNT(column)`, `SUM`, and `AVG` bypass NULL records.
* **Index NULLs selectively**: Keep in mind database dialect differences regarding how NULLs are indexed.

---

## Common Interview Questions

### Q1: What is the difference between NULL, 0, and an empty string?
**Answer:** NULL represents the absence of a value or that a value is unknown. Zero is a defined numeric value representing a quantity of nothing. An empty string is a defined text value containing no characters. 
In database logic:
* `NULL = 0` evaluates to UNKNOWN.
* `NULL = ''` evaluates to UNKNOWN.
* `0 = ''` evaluates to FALSE (or causes a type conversion error).
You must use `IS NULL` to locate missing values.

### Q2: Why does `WHERE salary = NULL` return no rows?
**Answer:** SQL uses three-valued logic (TRUE, FALSE, UNKNOWN). Any standard comparison using `=` or `<>` with a NULL value evaluates to UNKNOWN. The `WHERE` clause filter will only return rows for which the search condition evaluates to TRUE. Since `salary = NULL` evaluates to UNKNOWN for every row, all rows are discarded. To find rows with missing salaries, you must use `WHERE salary IS NULL`.

<div class="interview-tip">
When answering this question, mention the term **Three-Valued Logic (3VL)**. Highlighting that comparisons return UNKNOWN rather than FALSE shows a deep theoretical understanding of database engines.
</div>

### Q3: How do aggregations like COUNT, SUM, and AVG handle NULL values?
**Answer:** 
* `COUNT(*)` counts all rows in the dataset, including rows containing NULLs.
* `COUNT(column_name)` counts only the rows where the specified column contains a non-NULL value.
* `SUM`, `AVG`, `MIN`, and `MAX` completely ignore NULL values. 
* Because `AVG` ignores NULLs, it can lead to misleading results if NULL was meant to represent 0. In such cases, you must write `AVG(COALESCE(column, 0))` to include those rows in the average calculation.

### Q4: Explain what the query `SELECT * FROM users WHERE status NOT IN ('Active', 'Pending', NULL)` will return.
**Answer:** This query will return **zero rows**, regardless of what is stored in the table. The `NOT IN` clause is translated to a series of `AND` statements: `status <> 'Active' AND status <> 'Pending' AND status <> NULL`. Because any comparison with NULL evaluates to UNKNOWN, the entire expression evaluates to UNKNOWN. Since the filter is not TRUE, SQL returns no records. To fix this, you must filter out NULL from the subquery list or check `IS NOT NULL`.

### Q5: What is the difference between `COALESCE` and `NULLIF`?
**Answer:** 
* `COALESCE` is used to supply fallback values. It accepts a list of arguments and returns the first non-NULL value. Example: `COALESCE(bonus, 0)` returns `0` if `bonus` is NULL.
* `NULLIF` is used to generate NULL values under specific conditions. It takes two arguments and returns `NULL` if they are equal; otherwise, it returns the first argument. Example: `NULLIF(units_sold, 0)` returns `NULL` if `units_sold` is `0`, which is commonly used to prevent division-by-zero errors.
