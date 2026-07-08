---
title: "UNION, INTERSECT, EXCEPT — Combine Result Sets"
description: "Combine, find common, and subtract result sets — powerful set operations for multi-source data analysis."
category: "sql"
order: 107
phase: 2
tags: ["sql", "union", "intersect", "except", "set-operations"]
publishedDate: 2025-03-07
prevSlug: "null-handling"
nextSlug: "views-and-temp-tables"
seoTitle: "SQL UNION INTERSECT EXCEPT Tutorial | Datalogify"
seoDescription: "Master SQL set operations — UNION ALL, INTERSECT, EXCEPT for combining and comparing result sets."
---

## Why This Matters

Imagine you are managing two mailing lists in a physical mail room:
* **List A (Online Signups)**: Sarah, James, Priya, Marcus, Lisa.
* **List B (In-Store Signups)**: Priya, Lisa, David, Anna, Tom.

If you are asked to combine, compare, or filter these lists, you are performing **set operations**:
1. **"Send a catalog to everyone."** You stack the lists. If you remove duplicates (Priya and Lisa signed up in both places, but you only want to send them one catalog), you perform a **UNION**. If you don't care about duplicates and just stack them, you perform a **UNION ALL**.
2. **"Find our omnichannel customers who sign up both online and in-store."** You find the overlap. This is an **INTERSECT** (Priya, Lisa).
3. **"Find customers who signed up online but *never* in-store."** You subtract List B from List A. This is an **EXCEPT** or **MINUS** operation (Sarah, James, Marcus).

Set operations are fundamental to data analysis. They allow you to combine, match, and subtract result sets vertically, whereas joins combine tables horizontally. In this lesson, you will learn how set operations work under the hood, how to structure them safely, and when to use them for maximum performance.

---

## Step-by-Step Concept Breakdown

Set operations treat the results of individual `SELECT` queries as mathematical sets. Unlike joins which match columns side-by-side, set operations stack rows on top of each other.

```text
Visualizing Set Operations:

Query 1 Result: [Row 1, Row 2, Row 3]
Query 2 Result: [Row 3, Row 4, Row 5]

UNION ALL (Stops at stacking):
[Row 1, Row 2, Row 3, Row 3, Row 4, Row 5] (Duplicates kept)

UNION (Stacks and deduplicates):
[Row 1, Row 2, Row 3, Row 4, Row 5] (Row 3 merged)

INTERSECT (Finds common rows):
[Row 3]

EXCEPT / MINUS (Subtracts Query 2 from Query 1):
[Row 1, Row 2]
```

### The Three Strict Rules of Set Operations
For a set operation to succeed, the database requires the queries to be structurally compatible. If they are not, the database will throw a parser error.

1. **Rule 1: Identical Column Count**
   Both queries must return the exact same number of columns.
   * `SELECT name, email FROM online_customers UNION SELECT name FROM store_customers` $\rightarrow$ **ERROR**

2. **Rule 2: Compatible Data Types**
   The columns in corresponding positions must have matching or compatible data types. For example, column 1 in Query 1 and column 1 in Query 2 must both be strings, numbers, or dates.
   * `SELECT name (VARCHAR) FROM online_customers UNION SELECT customer_id (INT) FROM store_customers` $\rightarrow$ **ERROR**

3. **Rule 3: Order Matters**
   SQL matches columns based on their order in the `SELECT` list, not their names. If Query 1 has `SELECT name, email` and Query 2 has `SELECT email, name`, SQL will try to combine `name` with `email` and `email` with `name`, which will either fail or lead to corrupt mixed data.

---

## The Core Set Operators

### 1. `UNION ALL` — The Fast Stack
`UNION ALL` simply takes the result of the first query and appends the result of the second query directly below it. 
* It **preserves all duplicate rows**.
* It is extremely fast because the database does not need to read through the data to find and remove duplicates.

### 2. `UNION` — The Clean Merge
`UNION` (without the word `ALL`) appends the results of both queries, then scans the combined set to remove all duplicate rows.
* It **eliminates duplicates**.
* It is significantly slower than `UNION ALL` because the database must perform a sort or build a hash table to identify duplicates.

### 3. `INTERSECT` — The Overlap
`INTERSECT` returns only the rows that appear in the results of **both** queries.
* Like `UNION`, it automatically deduplicates the final output.

### 4. `EXCEPT` / `MINUS` — The Subtraction
`EXCEPT` (called `MINUS` in Oracle) returns rows from the first query that **do not appear** in the second query.
* It acts as a logical filter: `Query A - Query B`.
* It also deduplicates the final output.

---

## The Tables We're Working With

To practice set operations, we will use three tables: `online_customers`, `store_customers`, and quarterly sales tables (`q1_sales` and `q2_sales`).

### The `online_customers` Table
```sql
-- | customer_id | name            | email                  | signup_date |
-- |-------------|-----------------|------------------------|-------------|
-- | 101         | Sarah Chen      | sarah@email.com        | 2024-01-05  |
-- | 102         | James Wilson    | james@email.com        | 2024-01-12  |
-- | 103         | Priya Patel     | priya@email.com        | 2024-02-03  |
-- | 104         | Marcus Brown    | marcus@email.com       | 2024-02-18  |
-- | 105         | Lisa Zhang      | lisa@email.com         | 2024-03-01  |
```

### The `store_customers` Table
```sql
-- | customer_id | name            | email                  | signup_date |
-- |-------------|-----------------|------------------------|-------------|
-- | 103         | Priya Patel     | priya@email.com        | 2024-01-20  |
-- | 105         | Lisa Zhang      | lisa@email.com         | 2024-02-14  |
-- | 106         | David Kim       | david@email.com        | 2024-01-08  |
-- | 107         | Anna Kowalski   | anna@email.com         | 2024-03-10  |
-- | 108         | Tom Rivera      | tom@email.com          | 2024-02-25  |
```

### The `q1_sales` Table
```sql
-- | sale_id | product       | amount | sale_date  |
-- |---------|---------------|--------|------------|
-- | 1       | CRM Pro       | 15000  | 2024-01-15 |
-- | 2       | Analytics Hub | 28000  | 2024-02-10 |
-- | 3       | Data Vault    | 8500   | 2024-03-22 |
```

### The `q2_sales` Table
```sql
-- | sale_id | product       | amount | sale_date  |
-- |---------|---------------|--------|------------|
-- | 4       | CRM Pro       | 15000  | 2024-04-08 |
-- | 5       | ML Studio     | 35000  | 2024-05-19 |
-- | 6       | Analytics Hub | 28000  | 2024-06-01 |
-- | 7       | Cloud Backup  | 3200   | 2024-06-14 |
```

---

## Code & Practical Walkthroughs

### Example 1: Merging Quarterly Sales Logs (`UNION ALL` vs `UNION`)
Let's compile a report of all products sold across Q1 and Q2.
* If we use `UNION ALL`, we get a complete transaction log.
* If we use `UNION`, we get a list of unique product-price combinations.

#### Option A: Transaction Log using `UNION ALL`
```sql
SELECT product, amount, sale_date, 'Q1' AS sales_quarter
FROM q1_sales
UNION ALL
-- Stack Q2 below Q1
SELECT product, amount, sale_date, 'Q2' AS sales_quarter
FROM q2_sales;
```

```text
# Output:
product       | amount | sale_date  | sales_quarter
--------------+--------+------------+--------------
CRM Pro       | 15000  | 2024-01-15 | Q1
Analytics Hub | 28000  | 2024-02-10 | Q1
Data Vault    | 8500   | 2024-03-22 | Q1
CRM Pro       | 15000  | 2024-04-08 | Q2
ML Studio     | 35000  | 2024-05-19 | Q2
Analytics Hub | 28000  | 2024-06-01 | Q2
Cloud Backup  | 3200   | 2024-06-14 | Q2
```

#### Option B: Unique Sales Combinations using `UNION`
Let's see what unique product offers sold.
```sql
-- Querying just product and amount to see unique product catalog offers sold
SELECT product, amount
FROM q1_sales
UNION
SELECT product, amount
FROM q2_sales;
```

```text
# Output:
product       | amount
--------------+--------
CRM Pro       | 15000
Analytics Hub | 28000
Data Vault    | 8500
ML Studio     | 35000
Cloud Backup  | 3200
```
*(Notice that CRM Pro at 15000 and Analytics Hub at 28000 were only returned once, even though they sold in both quarters).*

---

### Example 2: Marketing Channel Overlap (`INTERSECT`)
The marketing team wants to find customers who signed up online **AND** also signed up in our physical store. These are highly engaged "omnichannel" customers.

```sql
-- Select customer contact details from online list
SELECT name, email
FROM online_customers
INTERSECT
-- Overlap with customer contact details from store list
SELECT name, email
FROM store_customers;
```

```text
# Output:
name        | email
------------+------------------
Priya Patel | priya@email.com
Lisa Zhang  | lisa@email.com
```

---

### Example 3: Customer Source Attribution (`EXCEPT`)
We want to run a promotional campaign targeting online-only customers. These are users who signed up online but have **never** signed up in a physical store.
* We subtract the store customers from the online customers.

```sql
-- Start with all online customers
SELECT name, email
FROM online_customers
EXCEPT
-- Subtract anyone who signed up in-store
SELECT name, email
FROM store_customers;
```

```text
# Output:
name         | email
-------------+------------------
Sarah Chen   | sarah@email.com
James Wilson | james@email.com
Marcus Brown | marcus@email.com
```

---

## Edge Cases & Common Mistakes (Gotchas)

### Gotcha 1: The Sorting Rules
You cannot place an `ORDER BY` clause inside individual subqueries within a set operation. The sorting must happen on the final, combined result set.

```sql
-- WRONG: SQL parser error
SELECT name FROM online_customers ORDER BY name
UNION
SELECT name FROM store_customers ORDER BY name;

-- RIGHT: Place ORDER BY at the very end
SELECT name, email FROM online_customers
UNION
SELECT name, email FROM store_customers
ORDER BY name ASC;
```

---

### Gotcha 2: Column Naming Priority
When queries are combined, the final table's column names are inherited from the **first SELECT query**. Aliases defined in subsequent queries are ignored.

```sql
SELECT name AS online_user_name, email
FROM online_customers
UNION
SELECT name AS retail_user_name, email
FROM store_customers;
```

```text
# Output:
online_user_name | email
-----------------+------------------
Sarah Chen       | sarah@email.com
...
```
*(The column is named `online_user_name`, completely ignoring `retail_user_name`).*

---

### Gotcha 3: Set Operations and NULL Values
Unlike joins and filters where `NULL = NULL` is UNKNOWN, set operations treat NULL values as **identical**.
* If you run a `UNION`, two rows containing NULL in the same columns are considered duplicates and will be merged into a single row.
* If you run `INTERSECT`, a row with a NULL value in Query 1 **will match** a row with a NULL value in Query 2.

```sql
-- Example showing NULL matches NULL in INTERSECT:
SELECT product, discount FROM orders WHERE order_id = 1002 -- discount is NULL
INTERSECT
SELECT product, discount FROM orders WHERE order_id = 1004; -- discount is NULL
```
This query will return one row representing the product and its NULL discount, showing that set operations are "NULL-safe".

---

## Performance Considerations

<div class="interview-tip">
Always default to <strong>UNION ALL</strong> unless you explicitly need to deduplicate. 
Under the hood, <strong>UNION</strong> requires the database engine to sort the combined dataset and run a deduplication algorithm, which utilizes temporary disk space and CPU memory. On tables with millions of rows, switching from <strong>UNION</strong> to <strong>UNION ALL</strong> can make a query run 10x to 100x faster.
</div>

---

## Practice Exercises & Mini-Projects

### Exercise 1: Multi-Source Customer Directory
Create a unified directory of all customers (online and store). The report must contain:
1. `customer_id`
2. `name`
3. `email`
4. `source` (a hardcoded text label: 'Online' or 'Physical Store')
Sort the final list alphabetically by name.

<details>
<summary>View Solution</summary>

**SQL Query:**
```sql
SELECT customer_id, name, email, 'Online' AS source
FROM online_customers
UNION ALL
SELECT customer_id, name, email, 'Physical Store' AS source
FROM store_customers
ORDER BY name ASC;
```
</details>

---

### Exercise 2: Store-Only Customer Directory
Identify customers who signed up in the physical store but **never** signed up online. Show their names and email addresses.

<details>
<summary>View Solution</summary>

**SQL Query:**
```sql
SELECT name, email
FROM store_customers
EXCEPT
SELECT name, email
FROM online_customers;
```
</details>

---

### Exercise 3: Segment Comparison Audit
A retail store manager wants to check if there are any customer records where the name matches but the email addresses differ between the online and physical store signups. Write a query to find such records.

<details>
<summary>View Solution</summary>

**SQL Query:**
To find where names are identical but emails differ, we can run a join or set operation analysis. Let's do it using set operations:
```sql
-- Find matching names across both channels
WITH shared_names AS (
    SELECT name FROM online_customers
    INTERSECT
    SELECT name FROM store_customers
)
-- Now locate rows for these names where emails do not match
SELECT name, email, 'Online' AS source
FROM online_customers
WHERE name IN (SELECT name FROM shared_names)
UNION ALL
SELECT name, email, 'Store' AS source
FROM store_customers
WHERE name IN (SELECT name FROM shared_names)
ORDER BY name;
```
</details>

---

### Section Recaps

* **Set operations stack rows vertically**: They combine multiple result sets, compared to joins which match columns horizontally.
* **Three matching rules**: Columns must have identical counts, compatible data types in order, and align structurally.
* **UNION ALL vs UNION**: `UNION ALL` stacks queries fast and keeps duplicates. `UNION` removes duplicates but is slower due to sorting.
* **INTERSECT and EXCEPT**: `INTERSECT` finds overlap between sets, and `EXCEPT` (or `MINUS`) subtracts the second set from the first.
* **NULLs match NULLs**: In set operations, NULLs are treated as equivalent, unlike standard comparison operators.

---

## Common Interview Questions

### Q1: What is the difference between UNION and UNION ALL?
**Answer:** The primary difference is how they handle duplicate rows and their performance.
* `UNION ALL` combines all rows from the queries as-is, including duplicates. It is very fast because no processing is required to check for duplicates.
* `UNION` combines the rows and then filters out duplicate rows. It requires the database engine to sort or hash the combined result set, which is resource-intensive and slower on large tables.

### Q2: What are the requirements for combining two queries using set operations?
**Answer:** The queries must satisfy three conditions:
1. They must select the same number of columns.
2. The columns in corresponding positions must have compatible data types (e.g. both integers, both varchars).
3. The logical positioning must match since SQL aligns columns by order, not by name.

### Q3: What is the difference between JOIN and UNION?
**Answer:** 
* A `JOIN` combines columns from two tables based on a matching key. It expands the dataset **horizontally**.
* A `UNION` combines rows from two queries. It expands the dataset **vertically** by stacking the rows.

<div class="interview-tip">
You can illustrate this with a simple drawing analogy: "A join is like adding new rooms to a house (more columns). A union is like adding stories to a building (more rows)."
</div>

### Q4: How does EXCEPT (or MINUS) handle duplicate rows?
**Answer:** `EXCEPT` returns distinct rows from the first query that are not present in the second query. It automatically performs a deduplication step on the final output. If Query A has three duplicate rows of a record and Query B does not have it, `EXCEPT` will return only one copy of that record.

### Q5: How do set operations handle NULL values?
**Answer:** In set operations, NULL values are treated as equal to one another. If two rows have NULL in the same columns, a `UNION` will treat them as duplicates and collapse them. Similarly, an `INTERSECT` will successfully match a row with a NULL value in Table A to a row with a NULL value in Table B. This is different from joins, where `NULL = NULL` is evaluated as UNKNOWN and fails to match.
