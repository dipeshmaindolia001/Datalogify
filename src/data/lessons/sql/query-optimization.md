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

Your query works. It returns the right data. But it takes 47 seconds. Your manager runs it on a dashboard that refreshes every 5 minutes. The database team sends you an angry email. Knowing SQL isn't just about getting correct results — it's about getting them fast. The difference between a junior and senior analyst is knowing WHY a query is slow and HOW to fix it.

## The Tables We're Working With

```sql
-- orders table (imagine 2 million rows in production)
-- | order_id | customer_id | product       | amount  | order_date | status    | region |
-- |----------|-------------|---------------|---------|------------|-----------|--------|
-- | 1        | 1001        | CRM Pro       | 15000   | 2024-01-10 | completed | East   |
-- | 2        | 1002        | Analytics Hub | 28000   | 2024-01-18 | completed | West   |
-- | 3        | 1003        | Data Vault    | 8500    | 2024-02-05 | completed | East   |
-- | ...      | ...         | ...           | ...     | ...        | ...       | ...    |
-- (2,000,000 rows)

-- customers table (50,000 rows)
-- | customer_id | company_name    | industry   | region | created_date |
-- |-------------|-----------------|------------|--------|--------------|
-- | 1001        | Acme Corp       | Technology | East   | 2022-01-15   |
-- | 1002        | Beta Industries | Finance    | West   | 2022-03-20   |
-- | ...         | ...             | ...        | ...    | ...          |
-- (50,000 rows)

-- employees table (10,000 rows)
-- | emp_id | name         | department  | salary | hire_date  |
-- |--------|--------------|-------------|--------|------------|
-- | 1      | Sarah Chen   | Analytics   | 95000  | 2022-01-15 |
-- | ...    | ...          | ...         | ...    | ...        |
-- (10,000 rows)
```

## EXPLAIN — See How Your Query Runs

EXPLAIN shows the database's execution plan — the steps it takes to run your query. This is the #1 tool for diagnosing slow queries.

```sql
-- PostgreSQL
EXPLAIN SELECT *
FROM orders
WHERE customer_id = 1001;
```

```text
                          QUERY PLAN
--------------------------------------------------------------
Seq Scan on orders  (cost=0.00..45218.00 rows=42 width=64)
  Filter: (customer_id = 1001)
```

```sql
-- With actual timing (EXPLAIN ANALYZE runs the query)
EXPLAIN ANALYZE SELECT *
FROM orders
WHERE customer_id = 1001;
```

```text
                                              QUERY PLAN
------------------------------------------------------------------------------------------------------
Seq Scan on orders  (cost=0.00..45218.00 rows=42 width=64) (actual time=0.521..287.314 rows=38 loops=1)
  Filter: (customer_id = 1001)
  Rows Removed by Filter: 1999962
Planning Time: 0.085 ms
Execution Time: 287.452 ms
```

<div class="interview-tip">

**Read EXPLAIN like this**: "Seq Scan" means the database is reading EVERY row in the table. It scanned 2 million rows to find 38 matches. That's like reading an entire phone book to find one person. An index would let the database jump directly to the matching rows.

</div>

## Indexes — The Most Important Performance Tool

An index is like a book's table of contents. Instead of reading every page, the database looks up where the data is.

```sql
-- Create an index on customer_id
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

```text
CREATE INDEX
```

```sql
-- Now the same query uses the index
EXPLAIN ANALYZE SELECT *
FROM orders
WHERE customer_id = 1001;
```

```text
                                                  QUERY PLAN
--------------------------------------------------------------------------------------------------------------
Index Scan using idx_orders_customer_id on orders  (cost=0.43..164.52 rows=42 width=64) (actual time=0.028..0.156 rows=38 loops=1)
  Index Cond: (customer_id = 1001)
Planning Time: 0.112 ms
Execution Time: 0.198 ms
```

287ms → 0.2ms. That's **1,400x faster**. Same query, same data, one index.

### What to Index

```sql
-- Index columns used in WHERE clauses
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);

-- Index columns used in JOIN conditions
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Composite index for queries that filter on multiple columns
CREATE INDEX idx_orders_status_date ON orders(status, order_date);
```

```sql
-- The composite index helps this query
EXPLAIN ANALYZE
SELECT order_id, amount
FROM orders
WHERE status = 'completed'
  AND order_date >= '2024-01-01';
```

```text
                                                       QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------
Index Scan using idx_orders_status_date on orders  (cost=0.43..8921.15 rows=285000 width=12) (actual time=0.031..45.218 rows=280150 loops=1)
  Index Cond: ((status = 'completed') AND (order_date >= '2024-01-01'))
Planning Time: 0.098 ms
Execution Time: 58.412 ms
```

### Composite Index Column Order Matters

```sql
-- Index on (status, order_date) helps:
--   WHERE status = 'completed'                        ✅
--   WHERE status = 'completed' AND order_date > '...' ✅
--   WHERE order_date > '2024-01-01'                   ❌ (wrong column order)

-- Think of it like a phone book sorted by last name, then first name:
--   Find all "Wilsons"                                ✅ (first column)
--   Find "Wilson, James"                              ✅ (both columns)
--   Find all "James"                                  ❌ (second column only)
```

## SARGable Queries — Queries That Can Use Indexes

SARGable = "Search ARGument ABLE." If your WHERE clause can't use an index, the database falls back to a full table scan.

```sql
-- ❌ NOT SARGable: function wraps the column
SELECT * FROM orders
WHERE EXTRACT(YEAR FROM order_date) = 2024;
-- Forces a full table scan — can't use index on order_date

-- ✅ SARGable: compare the column directly
SELECT * FROM orders
WHERE order_date >= '2024-01-01'
  AND order_date < '2025-01-01';
-- Uses the index on order_date
```

```sql
-- ❌ NOT SARGable: math on the column
SELECT * FROM employees
WHERE salary / 12 > 8000;
-- Can't use index on salary

-- ✅ SARGable: move the math to the other side
SELECT * FROM employees
WHERE salary > 8000 * 12;
-- Uses the index on salary
```

```sql
-- ❌ NOT SARGable: leading wildcard
SELECT * FROM customers
WHERE company_name LIKE '%Corp';
-- Full table scan — index can't help with leading %

-- ✅ SARGable: trailing wildcard only
SELECT * FROM customers
WHERE company_name LIKE 'Acme%';
-- Can use index on company_name
```

<div class="interview-tip">

**The SARGability Rule**: Never put a function, calculation, or type conversion on the indexed column in a WHERE clause. Move the transformation to the other side of the comparison. This is the single most common cause of unexpectedly slow queries.

</div>

## SELECT Only What You Need

```sql
-- ❌ Slow: selects all columns, reads more data from disk
SELECT * FROM orders WHERE status = 'completed';

-- ✅ Fast: only reads the columns you need
SELECT order_id, customer_id, amount
FROM orders WHERE status = 'completed';
```

```sql
-- EXPLAIN shows the difference in width (bytes per row)
EXPLAIN SELECT * FROM orders WHERE status = 'completed';
-- width=64 (reads all columns)

EXPLAIN SELECT order_id, amount FROM orders WHERE status = 'completed';
-- width=12 (reads only 2 columns)
```

```text
-- Full row: width=64, more I/O
Seq Scan on orders  (cost=0.00..45218.00 rows=1400000 width=64)

-- Two columns: width=12, less I/O
Seq Scan on orders  (cost=0.00..45218.00 rows=1400000 width=12)
```

## JOIN Optimization

```sql
-- ❌ Slow: joining without indexes on join columns
SELECT o.order_id, c.company_name, o.amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed';

-- ✅ Fast: ensure indexes exist on both sides of the join
-- CREATE INDEX idx_orders_customer_id ON orders(customer_id);
-- customers.customer_id is already the primary key (automatically indexed)
```

```sql
-- EXPLAIN the join
EXPLAIN ANALYZE
SELECT o.order_id, c.company_name, o.amount
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed';
```

```text
                                                          QUERY PLAN
-----------------------------------------------------------------------------------------------------------------------------
Hash Join  (cost=1693.00..62145.00 rows=1400000 width=28) (actual time=12.451..892.314 rows=1385200 loops=1)
  Hash Cond: (o.customer_id = c.customer_id)
  -> Seq Scan on orders o  (cost=0.00..45218.00 rows=1400000 width=16)
        Filter: (status = 'completed')
  -> Hash  (cost=818.00..818.00 rows=50000 width=20)
        -> Seq Scan on customers c  (cost=0.00..818.00 rows=50000 width=20)
Planning Time: 0.285 ms
Execution Time: 964.127 ms
```

### Join Type Performance

```sql
-- The database chooses the join algorithm based on data size:
-- Nested Loop: best for small tables or indexed lookups
-- Hash Join: best for medium-large tables (builds hash table in memory)
-- Merge Join: best when both inputs are already sorted

-- You rarely control this — but you CAN help by:
-- 1. Creating indexes on join columns
-- 2. Filtering rows BEFORE joining (reduces input size)
-- 3. Joining on integer keys (faster than string comparison)
```

## Avoid N+1 Patterns

```sql
-- ❌ Terrible: subquery runs once PER ROW in outer query
SELECT o.order_id,
       o.amount,
       (SELECT company_name FROM customers WHERE customer_id = o.customer_id) AS company
FROM orders o
WHERE o.status = 'completed';
-- Executes the subquery 1.4 million times!

-- ✅ Good: single JOIN
SELECT o.order_id,
       o.amount,
       c.company_name
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed';
-- Single pass through both tables
```

## EXISTS vs IN — Choose Wisely

```sql
-- For large subqueries, EXISTS is often faster than IN
-- EXISTS stops at the first match; IN loads all values first

-- ❌ Slower with large subquery results
SELECT customer_id, company_name
FROM customers
WHERE customer_id IN (
    SELECT customer_id FROM orders WHERE amount > 20000
);

-- ✅ Faster: EXISTS short-circuits
SELECT c.customer_id, c.company_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
      AND o.amount > 20000
);
```

```text
customer_id | company_name
------------|---------------
1002        | Beta Industries
1003        | Gamma Solutions
```

## Pagination — LIMIT and OFFSET Problems

```sql
-- ❌ Slow: OFFSET skips rows by reading and discarding them
SELECT order_id, amount, order_date
FROM orders
ORDER BY order_date DESC
LIMIT 20 OFFSET 100000;
-- Database reads 100,020 rows, discards 100,000, returns 20

-- ✅ Fast: keyset pagination (use the last seen value)
SELECT order_id, amount, order_date
FROM orders
WHERE order_date < '2024-03-15'  -- last seen date from previous page
ORDER BY order_date DESC
LIMIT 20;
-- Database jumps directly to the right spot using index
```

## Common Anti-Patterns and Fixes

```sql
-- Anti-pattern 1: DISTINCT to hide a bad JOIN
-- ❌ 
SELECT DISTINCT o.order_id, o.amount
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id;
-- Fix: check your JOIN logic. DISTINCT masks the real problem.

-- Anti-pattern 2: OR conditions that kill indexes
-- ❌ 
SELECT * FROM orders
WHERE customer_id = 1001 OR region = 'East';
-- Can't efficiently use either index

-- ✅ UNION ALL can use both indexes
SELECT * FROM orders WHERE customer_id = 1001
UNION ALL
SELECT * FROM orders WHERE region = 'East'
  AND customer_id <> 1001;  -- avoid duplicates
```

```sql
-- Anti-pattern 3: Counting all rows just to check existence
-- ❌ Slow: counts everything
SELECT COUNT(*) FROM orders WHERE customer_id = 1001;
-- Then check if count > 0

-- ✅ Fast: stops at first match
SELECT EXISTS (
    SELECT 1 FROM orders WHERE customer_id = 1001
) AS has_orders;
```

```text
has_orders
----------
true
```

## Optimization Checklist

```sql
-- Quick checklist for any slow query:
-- 1. Run EXPLAIN ANALYZE — is it doing a Seq Scan on a large table?
-- 2. Check for missing indexes on WHERE and JOIN columns
-- 3. Is the query SARGable? (no functions on indexed columns)
-- 4. Are you selecting only needed columns? (no SELECT *)
-- 5. Can you filter rows BEFORE joining? (push predicates down)
-- 6. Is there a correlated subquery that could be a JOIN?
-- 7. Is OFFSET large? Switch to keyset pagination
-- 8. Is DISTINCT hiding a JOIN bug?
```

## Where This Is Used in Real Jobs

| Scenario | Technique | Impact |
|----------|-----------|--------|
| Dashboard query too slow | Add indexes, use materialized view | 47s → 0.5s |
| ETL job timing out | Rewrite correlated subqueries as JOINs | 4 hours → 8 min |
| API response too slow | SELECT specific columns, add covering index | 800ms → 15ms |
| Pagination on large table | Keyset pagination instead of OFFSET | Linear → constant time |
| DBA escalation | Run EXPLAIN, fix SARGability | Self-service fix |
| Data warehouse costs | Reduce scanned data (BigQuery, Snowflake bill by scan) | 60% cost reduction |

<div class="challenge">

### Challenge 1: Index Detective
You have this slow query: `SELECT * FROM orders WHERE EXTRACT(MONTH FROM order_date) = 3 AND status = 'completed'`. Rewrite it to be SARGable so it can use an index on order_date.

### Challenge 2: Explain This Plan
Given this EXPLAIN output: `Seq Scan on orders (cost=0.00..45218.00 rows=2000000 width=64) Filter: (status = 'completed')` — What's happening? Why is it slow? What would you do to fix it? Write the CREATE INDEX statement.

### Challenge 3: Rewrite the Subquery
Rewrite this correlated subquery as a JOIN: `SELECT e.name, e.salary, (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e.department) AS dept_avg FROM employees e`.

</div>

## Common Interview Questions

### Q1: How do you identify and fix a slow SQL query?

**Answer:** Step 1: Run EXPLAIN ANALYZE to see the execution plan. Look for Seq Scans on large tables, high row estimates, and long execution times. Step 2: Check if indexes exist on WHERE and JOIN columns — add them if missing. Step 3: Check SARGability — make sure you're not wrapping indexed columns in functions. Step 4: Check for SELECT * and replace with specific columns. Step 5: Look for correlated subqueries and rewrite as JOINs. Step 6: Check if DISTINCT is masking a JOIN issue. Most slow queries are fixed by steps 2 and 3.

### Q2: What is an index and when would you NOT create one?

**Answer:** An index is a data structure (usually B-tree) that lets the database find rows without scanning the entire table — like a book's index. Don't create indexes when: (1) the table is small (< few thousand rows), (2) the column has very low cardinality (e.g., boolean with 50/50 split), (3) the table has heavy INSERT/UPDATE/DELETE activity (indexes slow down writes), (4) the column is rarely used in WHERE or JOIN clauses. Every index speeds up reads but slows down writes.

### Q3: What does SARGable mean?

**Answer:** SARGable (Search ARGument able) means a query condition can use an index. A condition is SARGable when the indexed column is compared directly to a value: `WHERE order_date > '2024-01-01'`. It's NOT SARGable when a function wraps the column: `WHERE YEAR(order_date) = 2024` — this forces a full table scan because the database must evaluate the function on every row before comparing. The fix is to rewrite the condition to keep the column bare.

### Q4: What is the difference between a Seq Scan and an Index Scan?

**Answer:** A Sequential Scan (Seq Scan) reads every row in the table from beginning to end — O(n) time. An Index Scan uses a B-tree index to jump directly to matching rows — O(log n) time. Seq Scan is actually faster for queries that return a large percentage of the table (>10-20%), because the overhead of random I/O from index lookups exceeds the cost of sequential reads. The database optimizer chooses automatically based on row estimates.

### Q5: How do you optimize a query with multiple JOINs?

**Answer:** (1) Ensure indexes exist on all JOIN columns (both sides). (2) Filter rows as early as possible — put WHERE conditions on the driving table before joining. (3) Join on integer keys instead of strings when possible. (4) Check the EXPLAIN plan for the join strategy (Nested Loop, Hash, Merge) and ensure the smaller table is the inner/build table. (5) Avoid joining on expressions or functions. (6) Consider breaking complex multi-join queries into temp tables if the optimizer makes bad choices.
