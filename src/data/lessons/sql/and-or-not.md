---
title: "AND, OR, NOT — Combine Conditions in SQL"
description: "Chain multiple conditions with AND, OR, NOT operators — build complex filters for precise data extraction."
category: "sql"
order: 4
phase: 2
tags: ["sql", "operators", "logical", "filtering"]
publishedDate: 2025-02-15
prevSlug: "group-by"
nextSlug: "order-by-limit"
seoTitle: "SQL AND OR NOT Operators Tutorial | Datalogify"
seoDescription: "Master SQL AND, OR, NOT operators with practical examples — combine conditions for precise data filtering."
---

## Why This Matters

Real data questions are never simple. "Show me customers in New York who spent over $500 but haven't ordered in 90 days" — that's three conditions chained together. AND, OR, and NOT are how you build filters that actually match business requirements. Get the logic wrong, and you pull the wrong data. Get it right, and you answer questions nobody else on the team can.

## The Tables We're Working With

```sql
-- orders table
-- | order_id | customer_id | product       | amount | order_date | region | status    |
-- |----------|-------------|---------------|--------|------------|--------|-----------|
-- | 1001     | 501         | CRM Pro       | 15000  | 2024-01-10 | East   | completed |
-- | 1002     | 502         | Analytics Hub | 28000  | 2024-01-18 | West   | completed |
-- | 1003     | 503         | Data Vault    | 8500   | 2024-02-05 | East   | pending   |
-- | 1004     | 501         | Analytics Hub | 28000  | 2024-02-22 | East   | completed |
-- | 1005     | 504         | CRM Pro       | 15000  | 2024-03-01 | South  | cancelled |
-- | 1006     | 505         | Data Vault    | 8500   | 2024-03-14 | West   | completed |
-- | 1007     | 502         | CRM Pro       | 12500  | 2024-04-02 | West   | completed |
-- | 1008     | 503         | Analytics Hub | 28000  | 2024-04-19 | North  | pending   |
-- | 1009     | 506         | CRM Pro       | 15000  | 2024-05-08 | East   | completed |
-- | 1010     | 504         | Data Vault    | 8500   | 2024-05-25 | South  | refunded  |

-- customers table
-- | customer_id | name            | industry     | company_size | signup_date |
-- |-------------|-----------------|--------------|--------------|-------------|
-- | 501         | Acme Corp       | Technology   | large        | 2023-06-15  |
-- | 502         | GlobalTech Inc  | Technology   | medium       | 2023-08-01  |
-- | 503         | RetailMax       | Retail       | large        | 2023-09-20  |
-- | 504         | DataFlow LLC    | Finance      | small        | 2024-01-05  |
-- | 505         | CloudNine       | Technology   | small        | 2024-02-10  |
-- | 506         | MegaRetail      | Retail       | large        | 2024-03-22  |
```

## AND — Both Conditions Must Be True

AND narrows your results. Every condition joined by AND must be true for a row to appear.

```sql
-- Large technology companies
SELECT name, industry, company_size
FROM customers
WHERE industry = 'Technology'
  AND company_size = 'large';
```

```text
# Output:
name      | industry   | company_size
----------|------------|-------------
Acme Corp | Technology | large
(1 row)
```

### Chaining Multiple ANDs

You can stack as many AND conditions as you need.

```sql
-- Completed orders in the East region over $10,000
SELECT order_id, product, amount, order_date, status
FROM orders
WHERE status = 'completed'
  AND region = 'East'
  AND amount > 10000;
```

```text
# Output:
order_id | product       | amount | order_date | status
---------|---------------|--------|------------|----------
1001     | CRM Pro       | 15000  | 2024-01-10 | completed
1004     | Analytics Hub | 28000  | 2024-02-22 | completed
1009     | CRM Pro       | 15000  | 2024-05-08 | completed
(3 rows)
```

Every AND you add makes the filter stricter. Think of AND as tightening a net — fewer fish get through.

## OR — Either Condition Can Be True

OR widens your results. A row appears if *any* condition joined by OR is true.

```sql
-- Orders that are either pending or cancelled
SELECT order_id, product, amount, status
FROM orders
WHERE status = 'pending'
   OR status = 'cancelled';
```

```text
# Output:
order_id | product       | amount | status
---------|---------------|--------|----------
1003     | Data Vault    | 8500   | pending
1005     | CRM Pro       | 15000  | cancelled
1008     | Analytics Hub | 28000  | pending
(3 rows)
```

### OR vs IN — Same Result, Different Style

When you're checking the same column against multiple values, `IN` is cleaner than chaining ORs.

```sql
-- These two queries return identical results:

-- Using OR (verbose)
SELECT order_id, product, amount
FROM orders
WHERE product = 'CRM Pro'
   OR product = 'Data Vault';

-- Using IN (cleaner)
SELECT order_id, product, amount
FROM orders
WHERE product IN ('CRM Pro', 'Data Vault');
```

```text
# Output (both queries):
order_id | product    | amount
---------|------------|-------
1001     | CRM Pro    | 15000
1003     | Data Vault | 8500
1005     | CRM Pro    | 15000
1006     | Data Vault | 8500
1007     | CRM Pro    | 12500
1009     | CRM Pro    | 15000
1010     | Data Vault | 8500
(7 rows)
```

**Rule of thumb:** If you're writing more than two ORs on the same column, switch to IN. Your future self will thank you.

<div class="interview-tip">

**Where this is used in real jobs:** IN is everywhere in analytics — filtering by a list of product IDs from a spreadsheet, pulling data for specific regions your manager asked about, checking status values from a dropdown. IN also accepts subqueries, which makes it far more powerful than a chain of ORs.

</div>

## NOT — Exclude What You Don't Want

NOT flips a condition. True becomes false, false becomes true.

```sql
-- All orders that are NOT completed
SELECT order_id, product, amount, status
FROM orders
WHERE NOT status = 'completed';
```

```text
# Output:
order_id | product       | amount | status
---------|---------------|--------|----------
1003     | Data Vault    | 8500   | pending
1005     | CRM Pro       | 15000  | cancelled
1008     | Analytics Hub | 28000  | pending
1010     | Data Vault    | 8500   | refunded
(4 rows)
```

### NOT with IN, BETWEEN, and LIKE

NOT pairs with other operators to create exclusion filters.

```sql
-- Customers NOT in Technology or Finance
SELECT name, industry
FROM customers
WHERE industry NOT IN ('Technology', 'Finance');
```

```text
# Output:
name       | industry
-----------|--------
RetailMax  | Retail
MegaRetail | Retail
(2 rows)
```

```sql
-- Orders NOT in the $10,000-$20,000 range
SELECT order_id, product, amount
FROM orders
WHERE amount NOT BETWEEN 10000 AND 20000;
```

```text
# Output:
order_id | product       | amount
---------|---------------|-------
1002     | Analytics Hub | 28000
1003     | Data Vault    | 8500
1004     | Analytics Hub | 28000
1006     | Data Vault    | 8500
1008     | Analytics Hub | 28000
1010     | Data Vault    | 8500
(6 rows)
```

```sql
-- Products that don't start with 'CRM'
SELECT DISTINCT product
FROM orders
WHERE product NOT LIKE 'CRM%';
```

```text
# Output:
product
-----------
Analytics Hub
Data Vault
(2 rows)
```

## Operator Precedence — The Trap Everyone Falls Into

This is where most bugs happen. **AND is evaluated before OR**, just like multiplication before addition in math.

```sql
-- WRONG: This does NOT mean "pending or cancelled orders in the East"
SELECT order_id, product, region, status
FROM orders
WHERE status = 'pending'
   OR status = 'cancelled'
  AND region = 'East';
```

```text
# Output (unexpected!):
order_id | product       | region | status
---------|---------------|--------|----------
1003     | Data Vault    | East   | pending
1008     | Analytics Hub | North  | pending
(2 rows)
```

SQL reads this as: `status = 'pending' OR (status = 'cancelled' AND region = 'East')`. The AND binds `cancelled` to `East`, but `pending` has no region restriction. Order 1008 (North, pending) sneaks through.

### Fix It with Parentheses

```sql
-- CORRECT: Parentheses make your intent explicit
SELECT order_id, product, region, status
FROM orders
WHERE (status = 'pending' OR status = 'cancelled')
  AND region = 'East';
```

```text
# Output (correct):
order_id | product    | region | status
---------|------------|--------|----------
1003     | Data Vault | East   | pending
(1 row)
```

**Always use parentheses when mixing AND and OR.** Even if you remember the precedence rules, the next person reading your code might not.

<div class="interview-tip">

**Interview trap:** Interviewers love giving you a query with mixed AND/OR and asking "what does this return?" They want to see if you understand that AND binds tighter. Always mention precedence, then say you'd add parentheses in real code for clarity.

</div>

## Combining Everything — Real Scenarios

### Scenario 1: Quarterly Revenue Analysis

```sql
-- Q1 2024 completed orders over $10K from East or West regions
SELECT
    order_id,
    product,
    amount,
    order_date,
    region
FROM orders
WHERE status = 'completed'
  AND order_date BETWEEN '2024-01-01' AND '2024-03-31'
  AND region IN ('East', 'West')
  AND amount > 10000;
```

```text
# Output:
order_id | product       | amount | order_date | region
---------|---------------|--------|------------|-------
1001     | CRM Pro       | 15000  | 2024-01-10 | East
1002     | Analytics Hub | 28000  | 2024-01-18 | West
1004     | Analytics Hub | 28000  | 2024-02-22 | East
(3 rows)
```

### Scenario 2: Customer Segmentation

```sql
-- Find customers who are either:
--   Large companies in any industry, OR
--   Technology companies of any size
-- But exclude anyone who signed up before 2024
SELECT
    name,
    industry,
    company_size,
    signup_date
FROM customers
WHERE (company_size = 'large' OR industry = 'Technology')
  AND NOT signup_date < '2024-01-01';
```

```text
# Output:
name       | industry   | company_size | signup_date
-----------|------------|--------------|------------
CloudNine  | Technology | small        | 2024-02-10
MegaRetail | Retail     | large        | 2024-03-22
(2 rows)
```

### Scenario 3: Problem Order Detection

```sql
-- Find orders that need attention:
-- Pending orders over 30 days old OR any refunded/cancelled orders
SELECT
    o.order_id,
    c.name       AS customer,
    o.product,
    o.amount,
    o.status,
    o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE (o.status = 'pending' AND o.order_date < '2024-04-01')
   OR o.status IN ('refunded', 'cancelled');
```

```text
# Output:
order_id | customer      | product       | amount | status    | order_date
---------|---------------|---------------|--------|-----------|------------
1003     | RetailMax     | Data Vault    | 8500   | pending   | 2024-02-05
1005     | DataFlow LLC  | CRM Pro       | 15000  | cancelled | 2024-03-01
1010     | DataFlow LLC  | Data Vault    | 8500   | refunded  | 2024-05-25
(3 rows)
```

## BETWEEN — A Cleaner Range Check

BETWEEN is shorthand for `>= AND <=`. It's inclusive on both ends.

```sql
-- These are identical:
WHERE amount BETWEEN 10000 AND 20000
WHERE amount >= 10000 AND amount <= 20000
```

```sql
-- Date range filtering (very common in analytics)
SELECT order_id, product, amount, order_date
FROM orders
WHERE order_date BETWEEN '2024-02-01' AND '2024-04-30';
```

```text
# Output:
order_id | product       | amount | order_date
---------|---------------|--------|------------
1003     | Data Vault    | 8500   | 2024-02-05
1004     | Analytics Hub | 28000  | 2024-02-22
1005     | CRM Pro       | 15000  | 2024-03-01
1006     | Data Vault    | 8500   | 2024-03-14
1007     | CRM Pro       | 12500  | 2024-04-02
1008     | Analytics Hub | 28000  | 2024-04-19
(6 rows)
```

<div class="interview-tip">

**Watch out with BETWEEN and dates:** `BETWEEN '2024-01-01' AND '2024-01-31'` includes rows at exactly midnight on Jan 31 but excludes anything later that day if your column stores timestamps. For timestamp columns, use `>= '2024-01-01' AND < '2024-02-01'` instead. This is a common production bug.

</div>

## Quick Reference: Logical Operator Cheat Sheet

| Operator | What It Does | Example |
|----------|-------------|---------|
| `AND` | Both conditions must be true | `WHERE region = 'East' AND amount > 10000` |
| `OR` | At least one condition must be true | `WHERE status = 'pending' OR status = 'cancelled'` |
| `NOT` | Reverses the condition | `WHERE NOT status = 'completed'` |
| `IN` | Matches any value in a list | `WHERE region IN ('East', 'West')` |
| `NOT IN` | Excludes values in a list | `WHERE region NOT IN ('South')` |
| `BETWEEN` | Inclusive range check | `WHERE amount BETWEEN 5000 AND 20000` |
| `NOT BETWEEN` | Outside the range | `WHERE amount NOT BETWEEN 5000 AND 20000` |

**Precedence order:** NOT → AND → OR. Use parentheses to override.

<div class="challenge">

### Challenge: Customer Order Analysis

Write a query that returns:
1. The **order_id**, **customer name**, **product**, **amount**, and **status**
2. For orders where the product is **Analytics Hub** or **CRM Pro**
3. The amount is **greater than $12,000**
4. The status is **NOT** cancelled or refunded
5. From customers in the **Technology** industry

**Expected output:**
```text
order_id | name           | product       | amount | status
---------|----------------|---------------|--------|----------
1001     | Acme Corp      | CRM Pro       | 15000  | completed
1002     | GlobalTech Inc | Analytics Hub | 28000  | completed
1004     | Acme Corp      | Analytics Hub | 28000  | completed
1007     | GlobalTech Inc | CRM Pro       | 12500  | completed
(4 rows)
```

**Hint:** You'll need a JOIN, IN, NOT IN, AND, and a comparison operator.

</div>

## Common Interview Questions

### Q1: What is the order of precedence for logical operators in SQL?

**Answer:** NOT is evaluated first, then AND, then OR. This means `WHERE a OR b AND c` is interpreted as `WHERE a OR (b AND c)`, not `WHERE (a OR b) AND c`. Always use parentheses when mixing AND and OR to make your intent clear and prevent bugs. This behavior is consistent across all major SQL databases.

### Q2: What is the difference between NOT IN and NOT EXISTS?

**Answer:** `NOT IN` checks if a value is absent from a list. `NOT EXISTS` checks whether a correlated subquery returns any rows. The critical difference: `NOT IN` fails unexpectedly when the list contains NULL values — if any value in the list is NULL, the entire NOT IN returns no rows. `NOT EXISTS` handles NULLs correctly. For subqueries, prefer NOT EXISTS. For hardcoded lists without NULLs, NOT IN is fine.

### Q3: Can you use OR in a JOIN condition?

**Answer:** Yes, but it's rare and often a sign of a design problem. Example: `JOIN orders o ON o.customer_id = c.customer_id OR o.alt_customer_id = c.customer_id`. This is valid SQL but can be slow because the optimizer can't use indexes as efficiently. If you need this pattern, consider restructuring your data or using UNION to combine two simpler joins.

### Q4: Is BETWEEN inclusive or exclusive?

**Answer:** BETWEEN is inclusive on both ends. `WHERE amount BETWEEN 100 AND 200` is equivalent to `WHERE amount >= 100 AND amount <= 200`. It includes both 100 and 200. This applies to numbers, dates, and strings. Be careful with timestamp columns — `BETWEEN '2024-01-01' AND '2024-01-31'` may miss timestamps later in the day on Jan 31. Use explicit >= and < for timestamp ranges.

### Q5: How does NULL interact with AND, OR, and NOT?

**Answer:** SQL uses three-valued logic: TRUE, FALSE, and NULL. With AND: `TRUE AND NULL = NULL`, `FALSE AND NULL = FALSE`. With OR: `TRUE OR NULL = TRUE`, `FALSE OR NULL = NULL`. With NOT: `NOT NULL = NULL`. This means if a column has NULL values and you filter with `WHERE column <> 'X'`, rows where column is NULL will be excluded — because `NULL <> 'X'` evaluates to NULL, not TRUE. Always handle NULLs explicitly with IS NULL / IS NOT NULL when they might exist in your data.
