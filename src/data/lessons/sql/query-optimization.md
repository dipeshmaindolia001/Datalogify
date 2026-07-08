---
title: "Query Optimization — Write Faster SQL"
description: "Understand execution plans, indexes, and query patterns that make your SQL 10x-100x faster."
category: "sql"
order: 109
phase: 2
tags: ["sql", "performance", "optimization", "indexes", "explain"]
publishedDate: 2025-03-09
prevSlug: "views-and-temp-tables"
nextSlug: "database-design"
seoTitle: "SQL Query Optimization Tutorial | Datalogify"
seoDescription: "Optimize SQL queries — understand EXPLAIN plans, indexes, SARGability, and performance patterns."
---

## Why This Matters

Imagine you are looking for information about "B-Tree Indexes" in a 1,200-page book on databases:
* **Approach A**: You start at page 1 and read every single page in order until you find the term. This is a **Table Scan** (or Sequential Scan). It is slow, tedious, and uses massive amounts of energy.
* **Approach B**: You turn to the index pages at the back of the book, look up "B-Tree Indexes" alphabetically, find that it is discussed on pages 452–458, and flip directly to those pages. This is an **Index Seek**. It takes seconds.

In SQL, writing a query that returns the correct data is only half the battle. If your database has 10,000 rows, a poorly written query might run in milliseconds. If your database grows to 100,000,000 rows, that same query will crash the database, hog CPU memory, and make dashboards hang indefinitely. 

Knowing how to write **SARGable queries**, read an **execution plan**, and structure indexes is the defining line between a junior developer and a senior database engineer.

---

## Step-by-Step Concept Breakdown

### 1. B-Tree Indexes — The Mechanics
By default, databases use a data structure called a **B-Tree (Balanced Tree)** to organize indexes.

```text
               [ Root Node ]
                 /       \
                /         \
        [ Branch Node ]  [ Branch Node ]
           /      \         /      \
       [Leaf]   [Leaf]   [Leaf]   [Leaf]
       (Data pointers or actual rows)
```

A B-Tree index sorted on an integer column (like `customer_id`) works by dividing values hierarchically:
1. **Root Node**: The starting point. It directs the query engine to search left or right (e.g., "values < 500" vs "values >= 500").
2. **Branch Nodes**: Intermediate routing levels that narrow the search range further (e.g., "values between 250 and 500").
3. **Leaf Nodes**: The bottom layer. They contain the indexed keys and pointers to where the actual data rows live on disk.

Because the tree is balanced, finding a value in a table of 1,000,000 rows requires traversing only 3 or 4 nodes. This is an $O(\log n)$ search cost compared to a full scan's $O(n)$ cost.

---

### 2. Clustered vs. Non-Clustered Indexes
Understanding the physical storage differences between these two indexes is crucial:

#### Clustered Index
* A clustered index determines the **physical order** of data storage on the disk. The leaf nodes of a clustered index contain the actual data rows.
* Because physical data can only be sorted in one way, you can have only **one clustered index** per table.
* By default, most databases (like MySQL's InnoDB) automatically set the table's `PRIMARY KEY` as the clustered index.

#### Non-Clustered Index
* A non-clustered index is a **separate structure** from the table data. The leaf nodes contain the index key and a pointer (like a Row ID or the clustered index key) back to the actual data row.
* Think of it as a separate index booklet. You can have **multiple non-clustered indexes** on a table (e.g., indexing by `email`, `last_name`, and `created_date`).

---

### 3. Understanding `EXPLAIN` Plans
When you submit a query, the database's Optimizer decides the most efficient way to run it. By prefixing your query with `EXPLAIN` (or `EXPLAIN ANALYZE` in PostgreSQL/MySQL), you can see this blueprint:

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 1001;
```

#### Core Execution Plan Components:
* **Sequential Scan / Table Scan**: The engine reads the entire table from disk. This is the slowest access path, usually occurring because there is no index, or the query is filtering on a non-indexed column.
* **Index Scan**: The engine reads the entire index tree in order. This is faster than a table scan, but still scans all rows.
* **Index Seek (or Index Scan using Index Cond)**: The engine traverses the B-Tree directly to locate specific keys. This is the fastest access path.
* **Nested Loop Join**: The database loops through each row of Table A and looks up matches in Table B. Excellent for small datasets.
* **Hash Match Join**: The database builds a temporary hash table in memory for the join keys of Table A, then scans Table B to find matches. Efficient for joining large tables.

---

### 4. SARGability (Search Argument Able)
A query is **SARGable** if the database engine can use an index to speed up the filter execution. If a query is **Non-SARGable**, the database is forced to ignore the index and scan the entire table.

The golden rule of SARGability: **Do not wrap your indexed columns in functions or calculations in the `WHERE` clause.**

```text
Non-SARGable:   WHERE YEAR(order_date) = 2024
SARGable:       WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
```
In the non-sargable query, the database must execute the `YEAR()` function on every single row in the table to evaluate the filter, preventing it from jumping straight to 2024 in the B-Tree index.

---

## The Tables We're Working With

To demonstrate query plans and SARGability, we will look at an enterprise `orders` table (containing 2,000,000 rows in production) and a `customers` table (50,000 rows):

### The `orders` Table
```sql
-- | order_id (PK) | customer_id (FK) | product       | amount  | order_date | status    | region |
-- |---------------|------------------|---------------|---------|------------|-----------|--------|
-- | 1             | 1001             | CRM Pro       | 15000   | 2024-01-10 | completed | East   |
-- | 2             | 1002             | Analytics Hub | 28000   | 2024-01-18 | completed | West   |
-- | ...           | ...              | ...           | ...     | ...        | ...       | ...    |
-- (2,000,000 rows)
```

---

## Code & Practical Walkthroughs

### Example 1: Date Filter Optimization (Making a Query SARGable)
We want to extract total revenue for orders placed in the year 2024.

#### The Slow (Non-SARGable) Query:
```sql
-- The database must execute YEAR() on all 2,000,000 rows, rendering indexes useless
SELECT SUM(amount) AS total_revenue
FROM orders
WHERE YEAR(order_date) = 2024;
```

```text
# Output:
total_revenue
-------------
48250000.00
Execution Time: 840ms (Seq Scan)
```

#### The Fast (SARGable) Query:
```sql
-- The database checks the index on order_date and seeks directly to the first row of 2024
SELECT SUM(amount) AS total_revenue
FROM orders
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01';
```

```text
# Output:
total_revenue
-------------
48250000.00
Execution Time: 12ms (Index Seek / Index Cond Scan)
```

---

### Example 2: Text Matching Optimization (Wildcards and Cases)
We want to search for customers whose company names begin with "Acme".

#### The Slow (Non-SARGable) Query:
```sql
-- Wrapping company_name in UPPER() and using a leading wildcard disables index scans
SELECT customer_id, company_name
FROM customers
WHERE UPPER(company_name) LIKE '%ACME%';
```

```text
# Output:
customer_id | company_name
------------+-------------
1001        | Acme Corp
1085        | Acme Technologies
Execution Time: 310ms (Seq Scan)
```

#### The Fast (SARGable) Query:
```sql
-- Searching from the start of the string allows the B-Tree index to seek alphabetically
SELECT customer_id, company_name
FROM customers
WHERE company_name LIKE 'Acme%';
```

```text
# Output:
customer_id | company_name
------------+-------------
1001        | Acme Corp
1085        | Acme Technologies
Execution Time: 4ms (Index Seek)
```

---

### Example 3: Arithmetic Column Optimization
We want to extract orders where the customer was charged more than $10,000, but we must account for a standard 10% VAT tax (i.e. `amount * 1.10 > 11000`).

#### The Slow (Non-SARGable) Query:
```sql
-- Calculation on the left side of the comparison forces a full table scan
SELECT order_id, amount
FROM orders
WHERE amount * 1.10 > 11000;
```

```text
# Output:
order_id | amount
---------+-------
1        | 15000
2        | 28000
Execution Time: 680ms (Seq Scan)
```

#### The Fast (SARGable) Query:
```sql
-- Rearranging algebra isolates the column name on the left, making it SARGable
SELECT order_id, amount
FROM orders
WHERE amount > 11000 / 1.10;
```

```text
# Output:
order_id | amount
---------+-------
1        | 15000
2        | 28000
Execution Time: 15ms (Index Seek)
```

---

## Edge Cases & Common Mistakes (Gotchas)

### Gotcha 1: The Danger of Over-Indexing
If indexes make reads fast, why not put an index on every single column?
* **Write Overhead**: Every time you run an `INSERT`, `UPDATE`, or `DELETE` command, the database must write the data to the table **and** update every index associated with that table. 
* **Storage Cost**: Indexes take up physical space on disk. Over-indexed tables can have indexes that consume more disk space than the actual table data itself.
* **Best Practice**: Only index columns that are frequently used in `JOIN` conditions, `WHERE` filters, or `ORDER BY` operations.

---

### Gotcha 2: The Cardinality Trap
If a column has very low cardinality (few unique values, like `status` which has only 'completed' or 'pending'), the database optimizer will often ignore any index on it and perform a Table Scan instead.
* If 95% of your orders are completed, querying `WHERE status = 'completed'` will return almost the entire table. Reading the index first, then looking up pages, actually adds more steps. The optimizer chooses the Table Scan because it is faster to read the table cover-to-cover than to jump back and forth using the index.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Identify the Non-SARGable Filters
Examine the three queries below. Identify which ones are Non-SARGable and rewrite them to utilize a B-Tree index on the filtered column.

1. `SELECT * FROM employees WHERE COALESCE(bonus, 0) > 5000;`
2. `SELECT * FROM customers WHERE created_date + INTERVAL '7 days' > NOW();`
3. `SELECT * FROM orders WHERE customer_id / 2 = 500;`

<details>
<summary>View Solution</summary>

**Rewritten Queries:**

1. **Original**: `COALESCE(bonus, 0)` is non-SARGable.
   **Rewritten**: 
   ```sql
   SELECT * FROM employees 
   WHERE bonus > 5000 
      OR (bonus IS NULL AND 0 > 5000); -- (simplified logically to just bonus > 5000)
   ```

2. **Original**: Adding an interval directly to the column name is non-SARGable.
   **Rewritten**: Move the arithmetic to the right side of the comparison:
   ```sql
   SELECT * FROM customers 
   WHERE created_date > NOW() - INTERVAL '7 days';
   ```

3. **Original**: Dividing the column is non-SARGable.
   **Rewritten**: 
   ```sql
   SELECT * FROM orders 
   WHERE customer_id = 500 * 2; -- (customer_id = 1000)
   ```
</details>

---

### Exercise 2: Index Auditing Execution Plan Analysis
Assume you have a table `users` with an index on the `email` column. You write a query to search for users with Gmail accounts:
```sql
SELECT user_id, email FROM users WHERE email LIKE '%@gmail.com';
```
Will this query utilize the index on the `email` column? Why or why not? How can you optimize this search?

<details>
<summary>View Solution</summary>

**Explanation:** No, this query will not utilize the index. A leading wildcard (`%@gmail.com`) forces the database to evaluate the ending of every record, which requires scanning the entire index or table from beginning to end. B-Tree indexes only allow left-to-right searching.

**Optimization Options:**
1. If possible, split the email column into `username` and `domain` during ingest, and build an index directly on `domain`.
2. Or use a reverse index or full-text search capability if supported.
</details>

---

### Section Recaps

* **Table Scan vs. Index Seek**: Table scan is reading every row of the table; index seek is using the B-Tree index to jump directly to specific records.
* **SARGable queries**: Avoid functions, math operations, and wildcard-start patterns (`%pattern`) on column names in the `WHERE` clause.
* **Clustered vs. Non-Clustered**: Clustered index physically sorts table data (max 1 per table); non-clustered index is a separate index booklet pointing back to rows.
* **EXPLAIN is your map**: Prefix queries with `EXPLAIN` to audit access paths and identify slow Sequential Scans.
* **Low Cardinality**: Columns with few unique values (e.g. boolean flags) are generally ignored by B-Tree indexes.

---

## Common Interview Questions

### Q1: What makes a query SARGable, and why does it matter?
**Answer:** SARGable stands for "Search Argument Able." A query is SARGable if the database engine can successfully use an index to resolve a search condition. Wrapping columns in functions, concatenating them, or performing math operations in the `WHERE` clause makes queries non-SARGable. Non-SARGable queries force full table scans, resulting in severe performance drops as tables grow.

### Q2: Why can a table only have one Clustered Index?
**Answer:** A clustered index determines the physical, sorted order of data on disk. Because database records can only be physically sorted in one sequence on disk (e.g., sorted physically by ID), you can only have one clustered index per table.

<div class="interview-tip">
You can use a physical analogy: "A clustered index is like a telephone directory sorted alphabetically by name. You cannot also physically sort that same phone book by phone number without printing a separate copy of the data."
</div>

### Q3: What is the difference between an Index Scan and an Index Seek?
**Answer:** 
* An **Index Seek** uses the B-Tree structure to jump directly to specific starting and ending points matching your search condition. This is highly efficient.
* An **Index Scan** is similar to a Table Scan, except it scans the index tree from top to bottom. It reads all pages of the index rather than seeking specific rows.

### Q4: If we run `SELECT * FROM orders WHERE status = 'Active'` and status has an index, why might the database still perform a full table scan?
**Answer:** If the database optimizer determines that a high percentage of rows (usually >20%) match the value `'Active'` (low cardinality), it will skip the index. Looking up rows via an index requires a two-step process: reading the index page and then fetching the corresponding data page from disk. If the database has to do this for a large portion of the table, performing a direct full table scan is faster.

### Q5: How do indexes affect INSERT, UPDATE, and DELETE operations?
**Answer:** While indexes speed up retrieval (`SELECT`), they slow down modifications (`INSERT`, `UPDATE`, `DELETE`). This is because every write to the table requires the database to update the corresponding entries in all associated indexes to keep the B-Tree balanced.
