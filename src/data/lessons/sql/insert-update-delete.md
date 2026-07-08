---
title: "INSERT, UPDATE, DELETE — Modify Data"
description: "Add, change, and remove data from tables — essential DML operations every analyst should understand."
category: "sql"
order: 7
phase: 2
tags: ["sql", "insert", "update", "delete", "dml"]
publishedDate: 2025-02-18
prevSlug: "distinct-and-aliases"
nextSlug: "subqueries"
seoTitle: "SQL INSERT UPDATE DELETE Tutorial | Datalogify"
seoDescription: "Master SQL INSERT INTO, UPDATE SET, DELETE FROM with safe practices and real examples."
---

## Why This Matters

Imagine you run an old-fashioned library with a physical card catalog. 
*   When the library acquires a **new book**, you must fill out a new index card and slip it into the correct drawer. This is an `INSERT`.
*   When a book's price changes, or you realize there is a typo in the title, you take a pencil, erase the old text, and write the new value. This is an `UPDATE`.
*   When a book is lost or discarded, you take its index card and toss it in the wastebasket. This is a `DELETE`.
*   If the library decides to shut down an entire section and throw away *all* cards in a drawer immediately without looking at them one by one, you dump the drawer directly into a shredder. This is a `TRUNCATE`.

In the digital world, data is constantly changing. While data analysts spend a lot of time reading data (`SELECT`), you cannot build data pipelines, clean up test records, set up ETL processes, or manage reporting tables without knowing how to modify data. 

Modifying data is a double-edged sword. A poorly written `SELECT` statement might return the wrong answer, but a poorly written `UPDATE` or `DELETE` statement can wipe out production databases and cost companies millions. This lesson explains how to modify data safely, understand the mechanisms behind the scenes, and build guardrails to protect your datasets.

---

## The Tables We're Working With

We will work with two tables: `products` (which holds our product catalog) and `orders` (which logs transactions).

### 1. `products`
```sql
-- products table schema and sample data:
-- | product_id | name          | category | price  | status   | last_updated |
-- |------------|---------------|----------|--------|----------|--------------|
-- | 1          | CRM Pro       | Software | 15000  | active   | 2024-01-15   |
-- | 2          | Analytics Hub | Software | 28000  | active   | 2024-01-15   |
-- | 3          | Data Vault    | Software | 8500   | active   | 2024-02-01   |
-- | 4          | Cloud Backup  | Service  | 3200   | active   | 2024-03-10   |
-- | 5          | SecureGate    | Security | 12000  | inactive | 2024-01-20   |
```

### 2. `orders`
```sql
-- orders table schema and sample data:
-- | order_id | customer_id | product_id | quantity | total  | order_date | status    |
-- |----------|-------------|------------|----------|--------|------------|-----------|
-- | 1001     | 501         | 1          | 2        | 30000  | 2024-01-10 | completed |
-- | 1002     | 502         | 2          | 1        | 28000  | 2024-01-18 | completed |
-- | 1003     | 503         | 3          | 3        | 25500  | 2024-02-05 | pending   |
-- | 1004     | 501         | 1          | 1        | 15000  | 2024-03-01 | completed |
-- | 1005     | 504         | 4          | 5        | 16000  | 2024-03-15 | cancelled |
```

---

## Step-by-Step Concept Breakdown

### DML vs. DDL
SQL statements are divided into sub-languages:
1.  **DML (Data Manipulation Language):** Operations that modify the *rows of data* inside a table. `INSERT`, `UPDATE`, and `DELETE` are DML. These operations can be rolled back using transactions in most databases.
2.  **DDL (Data Definition Language):** Operations that define or alter the *structure of the database* itself. `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, and `TRUNCATE TABLE` are DDL. In many databases, DDL statements commit automatically and cannot be easily rolled back.

---

## Step 1: INSERT INTO — Adding New Rows

There are two primary ways to write an `INSERT` statement: specifying the columns, or omitting them.

### 1.1 Specified Columns (Best Practice)
When inserting data, you should always explicitly define the columns you are populating.

```sql
-- Insert a single row with specified columns
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES (6, 'API Gateway', 'Service', 5500, 'active', '2024-04-01');
```

```text
# Output:
INSERT 0 1
(1 row inserted)
```

**Why specifying columns is a best practice:**
If someone alters the `products` table in the future to add a new column (like `discount_rate`), a query that specifies columns will still work. If the new column has a default value or allows `NULL`, SQL will handle it automatically.

### 1.2 Positional Column Insertion (Omitted Columns - Dangerous)
You can omit column names if you provide a value for *every single column* in the exact order they were defined when the table was created.

```sql
-- ⚠️ Omitted columns: Dangerous in production!
INSERT INTO products
VALUES (7, 'ML Studio', 'Software', 35000, 'active', '2024-04-01');
```

```text
# Output:
INSERT 0 1
(1 row inserted)
```

> [!WARNING]
> If a developer alters the table structure (e.g., adds or reorders columns), this query will break immediately, throwing a column count mismatch error, or worse, silently inserting the wrong data into the wrong columns. Never use this format in production code.

### 1.3 Inserting Multiple Rows
You can insert multiple rows at once by separating the value blocks with commas.

```sql
-- Batch inserting multiple rows
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES
    (8, 'DevOps Pro', 'Service', 9800, 'active', '2024-04-01'),
    (9, 'DataSync', 'Service', 4200, 'active', '2024-04-15');
```

```text
# Output:
INSERT 0 2
(2 rows inserted)
```

Inserting in batches is much faster than running multiple individual `INSERT` statements because it reduces the network overhead and database transaction commits.

### 1.4 INSERT ... SELECT (Copying and Migrating Data)
In data warehousing and ETL pipelines, you often need to copy records from one table to another. You can combine `INSERT INTO` with a `SELECT` statement.

Let's assume we have an `archive_orders` table already set up. We want to populate it with all orders that were completed.

```sql
-- Populate an archive table with data from the orders table
INSERT INTO archive_orders (order_id, customer_id, product_id, quantity, total, order_date, status)
SELECT order_id, customer_id, product_id, quantity, total, order_date, status
FROM orders
WHERE status = 'completed';
```

```text
# Output:
INSERT 0 4
(4 rows inserted)
```

---

## Step 2: UPDATE — Changing Existing Data

The `UPDATE` statement modifies existing records. It is a powerful operation that requires precise filters.

### 2.1 Basic UPDATE with WHERE
Let's increase the price of product 4 ("Cloud Backup") to 3500 and update its timestamp.

```sql
-- Safe update targeted at a single ID
UPDATE products
SET price = 3500,
    last_updated = '2024-04-16'
WHERE product_id = 4;
```

```text
# Output:
UPDATE 1
(1 row updated)
```

### 2.2 ⚠️ The Disaster of Omitted WHERE Clauses
If you omit the `WHERE` clause in an `UPDATE` statement, the database will apply the change to **every single row** in the table.

```sql
-- 🚨 DANGEROUS: Wipes out the status of all products!
UPDATE products
SET status = 'inactive';
```

```text
# Output:
UPDATE 5
(All 5 rows updated to 'inactive')
```

If this happens in a production database, you have corrupted your catalog. To prevent this, always follow the **Safe Modification Pattern** (explained in the Transactions section below).

### 2.3 UPDATE with Calculations
You can reference a column's current value inside the `SET` clause. Let's give all "Software" products a 10% price increase.

```sql
-- Update using calculations on the existing price
UPDATE products
SET price = price * 1.10,
    last_updated = '2024-04-20'
WHERE category = 'Software';
```

```text
# Output:
UPDATE 3
(3 rows updated)
```

---

## Step 3: DELETE vs. TRUNCATE — Removing Data

There are two primary ways to delete rows from a table: `DELETE` and `TRUNCATE`. While they look similar on the surface, they act very differently.

### 3.1 DELETE FROM
The `DELETE` statement deletes rows that match a specific condition.

```sql
-- Delete orders that were cancelled
DELETE FROM orders
WHERE status = 'cancelled';
```

```text
# Output:
DELETE 1
(1 row deleted)
```

Like `UPDATE`, if you omit the `WHERE` clause, **you will delete all rows from the table**.

```sql
-- 🚨 DANGEROUS: Deletes all records from orders!
DELETE FROM orders;
```

```text
# Output:
DELETE 4
(4 rows deleted)
```

### 3.2 TRUNCATE TABLE
If you want to clear all data from a table, `TRUNCATE` is a faster alternative. It removes all rows by deallocating the database storage pages.

```sql
-- Empty a temporary logging or staging table instantly
TRUNCATE TABLE archive_orders;
```

```text
# Output:
TRUNCATE
(Table truncated successfully)
```

### 3.3 Deep Comparison: DELETE vs. TRUNCATE

| Feature | `DELETE FROM` | `TRUNCATE TABLE` |
| :--- | :--- | :--- |
| **DML vs. DDL** | DML (Data Manipulation Language) | DDL (Data Definition Language) |
| **WHERE Clause** | Supported (`WHERE status = 'cancelled'`) | Not supported (always clears the entire table) |
| **Speed** | Slower (deletes row-by-row, updates indexes for each row) | Fast (drops storage pages, bypasses row checks) |
| **Transaction Safety** | Fully rollbackable within transactions | Depends on database (rollbackable in PostgreSQL, usually not in MySQL/Oracle) |
| **Triggers** | Fires row-level delete triggers | Does not fire triggers |
| **Auto-Increment** | Does not reset auto-increment counters | Resets auto-increment counters to their start value |
| **Locks** | Obtains row-level locks | Obtains an exclusive table-level lock |

---

## Step 4: Transactions — Your Safety Net

A transaction is a group of SQL statements that are executed together as a single unit of work. Transactions follow the ACID compliance rules, ensuring database integrity.

The two main commands are:
*   `COMMIT`: Saves all changes permanently to the database.
*   `ROLLBACK`: Cancels all changes made in the transaction, restoring the database to its pre-transaction state.

### The Safe Modification Pattern (Always Use This!)
Whenever you write an `UPDATE` or `DELETE` statement, wrap it in a transaction to verify the changes before committing them.

```sql
-- Step 1: Start the transaction
BEGIN;

-- Step 2: Run a count first to see how many rows should change
SELECT COUNT(*) FROM products WHERE category = 'Service';
-- Output: 2

-- Step 3: Run the update
UPDATE products
SET status = 'inactive'
WHERE category = 'Service';
-- Output: UPDATE 2

-- Step 4: Verify the result by querying the modified rows
SELECT name, status FROM products WHERE category = 'Service';
-- Output:
-- ML Studio | inactive
-- DevOps Pro | inactive

-- Step 5: If the changes are correct, commit. If not, rollback!
COMMIT;
-- (Or ROLLBACK; if you accidentally updated the wrong rows)
```

---

## Step 5: UPSERT — Insert or Update

When writing data pipelines, you often encounter situations where you want to insert a row if it doesn't exist, or update it if it does. This hybrid operation is commonly called an **UPSERT**.

### 5.1 PostgreSQL Syntax: ON CONFLICT
In PostgreSQL, you use `ON CONFLICT` specifying a unique constraint or primary key column.

```sql
-- UPSERT in PostgreSQL: Insert product 1, or update price if it exists
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES (1, 'CRM Pro', 'Software', 16500, 'active', '2024-04-20')
ON CONFLICT (product_id)
DO UPDATE SET
    price = EXCLUDED.price,
    last_updated = EXCLUDED.last_updated;
```

```text
# Output:
INSERT 0 1
(Conflict detected: product_id 1 updated with new price and timestamp)
```
*Note: `EXCLUDED` refers to the values you attempted to insert.*

### 5.2 MySQL Syntax: ON DUPLICATE KEY UPDATE
In MySQL, you use the `ON DUPLICATE KEY UPDATE` clause.

```sql
-- UPSERT in MySQL
INSERT INTO products (product_id, name, category, price, status, last_updated)
VALUES (1, 'CRM Pro', 'Software', 16500, 'active', '2024-04-20')
ON DUPLICATE KEY UPDATE
    price = VALUES(price),
    last_updated = VALUES(last_updated);
```

---

## Edge Cases & Common Mistakes

### Gotcha 1: Foreign Key Constraint Violations
If you try to delete a row that is referenced by another table, the database will block the deletion to maintain data integrity.

```sql
-- ❌ This will fail:
DELETE FROM products
WHERE product_id = 1;
```
**Why?** The `orders` table contains rows where `product_id = 1` (orders 1001 and 1004). The database throws a foreign key constraint violation error.
**The Fix:** You must either delete the dependent orders first, configure the foreign key with `ON DELETE CASCADE` (which automatically deletes related orders), or perform a **soft delete** by setting `status = 'deleted'` rather than running a physical delete.

### Gotcha 2: Safe Updates Mode
Many modern SQL editors (like MySQL Workbench) have "Safe Updates" mode enabled by default. If you try to run an `UPDATE` or `DELETE` query without a `WHERE` clause referencing a primary key, it will throw an error and refuse to run. 

To override this, you must run:
```sql
SET SQL_SAFE_UPDATES = 0;
```
*Note: Only disable this temporarily for specific maintenance scripts. Keep it on to avoid accidental global updates.*

---

## Practice Exercises & Mini-Projects

### Exercise 1: Transactional Price Normalization
**Scenario:** You discover that all order totals in the `orders` table placed in January 2024 were calculated incorrectly. The prices should have been 15% higher. 

Write a script that:
1.  Starts a transaction.
2.  Updates the `total` of all orders placed between `2024-01-01` and `2024-01-31` to be 15% higher.
3.  Verifies the changes by displaying the updated rows.
4.  Commits the transaction.

<details>
<summary>View Solution</summary>

```sql
BEGIN;

-- Run update
UPDATE orders
SET total = total * 1.15
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Verify changes
SELECT order_id, total, order_date
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Commit
COMMIT;
```
</details>

---

### Exercise 2: Safe Soft-Delete Script
**Scenario:** Instead of physically deleting inactive products, write an `UPDATE` query that acts as a "soft delete", marking any product inactive if it has not been updated since before `2024-02-01`.

<details>
<summary>View Solution</summary>

```sql
UPDATE products
SET status = 'inactive',
    last_updated = CURRENT_DATE
WHERE last_updated < '2024-02-01';
```
</details>

---

## Section Recaps

*   **`INSERT INTO`** adds new records. Batch insertions are faster and use fewer resources than running multiple single statements.
*   **`UPDATE`** modifies data. Omitting the `WHERE` clause modifies every single row in the table.
*   **`DELETE`** removes rows target by a filter. `TRUNCATE` clears the entire table by dropping storage pages, making it faster but bypasses row checks.
*   **Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`)** protect your data. Wrapping modifications in transactions lets you inspect the changes before applying them permanently.
*   **UPSERT** resolves insert conflicts by updating matching records instead of throwing primary key errors.

---

## Common Interview Questions

### Q1: What is the difference between DELETE and TRUNCATE?
**Answer:**
1.  **Operation Type:** `DELETE` is DML (Data Manipulation Language) and operates on individual rows. `TRUNCATE` is DDL (Data Definition Language) and operates on the table's storage structure.
2.  **Filter Support:** `DELETE` supports the `WHERE` clause to target specific rows. `TRUNCATE` does not; it always deletes everything.
3.  **Performance:** `TRUNCATE` is much faster because it deallocates the table's storage pages rather than deleting rows one by one.
4.  **Transaction Safety:** In some databases (like PostgreSQL), both can be rolled back. In others (like MySQL), `TRUNCATE` triggers an implicit commit and cannot be rolled back.
5.  **Side Effects:** `TRUNCATE` resets auto-increment counters, while `DELETE` does not. `DELETE` fires triggers; `TRUNCATE` does not.

---

### Q2: What happens if you run an UPDATE or DELETE without a WHERE clause?
**Answer:**
Running an `UPDATE` or `DELETE` without a `WHERE` clause applies the change to all rows in the table. In a production environment, this is often a critical mistake that requires database recovery procedures. 

To prevent this:
1.  Wrap DML operations in transactions (`BEGIN ... ROLLBACK/COMMIT`).
2.  Run a `SELECT` statement with the same `WHERE` clause first to verify the target row count.
3.  Keep safe update modes enabled in your SQL client.

---

### Q3: What is ACID, and how does it relate to transactions?
**Answer:**
ACID represents the properties that guarantee database transactions are processed reliably:
*   **Atomicity:** "All or nothing." If any statement in the transaction fails, the entire transaction is rolled back.
*   **Consistency:** A transaction must transition the database from one valid state to another, maintaining all constraints and rules.
*   **Isolation:** Transactions executing concurrently cannot see each other's intermediate state.
*   **Durability:** Once a transaction is committed, the changes are written to persistent storage and will not be lost, even in a system crash.

---

### Q4: How does UPSERT work under the hood, and why is it useful?
**Answer:**
An UPSERT handles duplicate keys gracefully. During an `INSERT`, if the database detects a primary key or unique index conflict, it executes an alternative `UPDATE` statement on the conflicting row instead of throwing an error. 

This is useful in data synchronization pipelines where you receive updates and new records in the same feed, allowing you to run a single operation rather than checking for existence first.

---

### Q5: Why might a DELETE statement run slowly on a table with many rows?
**Answer:**
A `DELETE` statement runs slowly on large tables for several reasons:
1.  **Row-by-Row Processing:** The database must locate each row, check constraints, delete the row, and write to the transaction log.
2.  **Index Maintenance:** For every row deleted, the database must update every index on the table, which causes disk I/O overhead.
3.  **Locking:** The database locks the rows (or the entire table), which can lead to lock contention and wait times if other processes are reading or writing to the same table.
4.  **Foreign Key Constraints:** The database must check referenced tables to ensure the deletion does not violate constraints.
