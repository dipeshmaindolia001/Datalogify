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

"Combine this year's sales with last year's into one report." "Which customers bought from us AND attended our webinar?" "Show me products we sell online but NOT in stores." These are set operations — combining, intersecting, and subtracting result sets. You'll use these constantly when working with data from multiple sources, running comparisons, or building reconciliation reports.

## The Tables We're Working With

```sql
-- online_customers table
-- | customer_id | name            | email                  | signup_date |
-- |-------------|-----------------|------------------------|-------------|
-- | 101         | Sarah Chen      | sarah@email.com        | 2024-01-05  |
-- | 102         | James Wilson    | james@email.com        | 2024-01-12  |
-- | 103         | Priya Patel     | priya@email.com        | 2024-02-03  |
-- | 104         | Marcus Brown    | marcus@email.com       | 2024-02-18  |
-- | 105         | Lisa Zhang      | lisa@email.com         | 2024-03-01  |

-- store_customers table
-- | customer_id | name            | email                  | signup_date |
-- |-------------|-----------------|------------------------|-------------|
-- | 103         | Priya Patel     | priya@email.com        | 2024-01-20  |
-- | 105         | Lisa Zhang      | lisa@email.com         | 2024-02-14  |
-- | 106         | David Kim       | david@email.com        | 2024-01-08  |
-- | 107         | Anna Kowalski   | anna@email.com         | 2024-03-10  |
-- | 108         | Tom Rivera      | tom@email.com          | 2024-02-25  |

-- q1_sales table
-- | sale_id | product       | amount | sale_date  |
-- |---------|---------------|--------|------------|
-- | 1       | CRM Pro       | 15000  | 2024-01-15 |
-- | 2       | Analytics Hub | 28000  | 2024-02-10 |
-- | 3       | Data Vault    | 8500   | 2024-03-22 |

-- q2_sales table
-- | sale_id | product       | amount | sale_date  |
-- |---------|---------------|--------|------------|
-- | 4       | CRM Pro       | 15000  | 2024-04-08 |
-- | 5       | ML Studio     | 35000  | 2024-05-19 |
-- | 6       | Analytics Hub | 28000  | 2024-06-01 |
-- | 7       | Cloud Backup  | 3200   | 2024-06-14 |
```

## UNION ALL — Stack Results Together (Keep Duplicates)

UNION ALL combines two result sets vertically. It keeps every row, including duplicates. It's fast because it doesn't sort or deduplicate.

```sql
SELECT product, amount, sale_date, 'Q1' AS quarter
FROM q1_sales
UNION ALL
SELECT product, amount, sale_date, 'Q2' AS quarter
FROM q2_sales;
```

```text
product       | amount | sale_date  | quarter
--------------|--------|------------|--------
CRM Pro       | 15000  | 2024-01-15 | Q1
Analytics Hub | 28000  | 2024-02-10 | Q1
Data Vault    | 8500   | 2024-03-22 | Q1
CRM Pro       | 15000  | 2024-04-08 | Q2
ML Studio     | 35000  | 2024-05-19 | Q2
Analytics Hub | 28000  | 2024-06-01 | Q2
Cloud Backup  | 3200   | 2024-06-14 | Q2
```

### Combine and Aggregate

```sql
SELECT product,
       SUM(amount) AS total_revenue,
       COUNT(*) AS times_sold
FROM (
    SELECT product, amount FROM q1_sales
    UNION ALL
    SELECT product, amount FROM q2_sales
) all_sales
GROUP BY product
ORDER BY total_revenue DESC;
```

```text
product       | total_revenue | times_sold
--------------|---------------|----------
Analytics Hub | 56000         | 2
ML Studio     | 35000         | 1
CRM Pro       | 30000         | 2
Data Vault    | 8500          | 1
Cloud Backup  | 3200          | 1
```

<div class="interview-tip">

**UNION ALL vs UNION**: Always default to UNION ALL unless you specifically need deduplication. UNION ALL is faster because it skips the sort-and-deduplicate step. In analytics, you almost always want all rows — duplicates are usually meaningful (e.g., two identical sales are still two sales).

</div>

## UNION — Stack Results and Remove Duplicates

UNION deduplicates the combined result. It's slower because it sorts all rows to find duplicates.

```sql
-- CRM Pro and Analytics Hub appear in both quarters
-- UNION removes the duplicate rows
SELECT product FROM q1_sales
UNION
SELECT product FROM q2_sales;
```

```text
product
-----------
Analytics Hub
Cloud Backup
CRM Pro
Data Vault
ML Studio
```

```sql
-- Compare with UNION ALL — keeps duplicates
SELECT product FROM q1_sales
UNION ALL
SELECT product FROM q2_sales;
```

```text
product
-----------
CRM Pro
Analytics Hub
Data Vault
CRM Pro
ML Studio
Analytics Hub
Cloud Backup
```

### Combine All Customers From Both Channels

```sql
SELECT customer_id, name, email, 'Online' AS channel
FROM online_customers
UNION
SELECT customer_id, name, email, 'Store' AS channel
FROM store_customers
ORDER BY customer_id;
```

```text
customer_id | name          | email            | channel
------------|---------------|------------------|--------
101         | Sarah Chen    | sarah@email.com  | Online
102         | James Wilson  | james@email.com  | Online
103         | Priya Patel   | priya@email.com  | Online
103         | Priya Patel   | priya@email.com  | Store
105         | Lisa Zhang    | lisa@email.com   | Online
105         | Lisa Zhang    | lisa@email.com   | Store
106         | David Kim     | david@email.com  | Store
107         | Anna Kowalski | anna@email.com   | Store
108         | Tom Rivera    | tom@email.com    | Store
```

Notice Priya and Lisa appear twice — because the channel column makes the rows different. UNION only removes rows that are identical across ALL columns.

## The Column Rules — What Must Match

```sql
-- Rule 1: Same number of columns
-- WRONG: column count mismatch
-- SELECT customer_id, name, email FROM online_customers
-- UNION ALL
-- SELECT customer_id, name FROM store_customers;   -- ERROR: 3 vs 2 columns

-- Rule 2: Compatible data types
-- WRONG: mixing types
-- SELECT customer_id, name FROM online_customers
-- UNION ALL
-- SELECT name, customer_id FROM store_customers;   -- name vs customer_id types

-- Rule 3: Column names come from the FIRST query
SELECT customer_id AS id, name AS customer_name
FROM online_customers
UNION ALL
SELECT customer_id, name    -- these column names are ignored
FROM store_customers;
```

```text
id  | customer_name
----|---------------
101 | Sarah Chen
102 | James Wilson
103 | Priya Patel
104 | Marcus Brown
105 | Lisa Zhang
103 | Priya Patel
105 | Lisa Zhang
106 | David Kim
107 | Anna Kowalski
108 | Tom Rivera
```

## INTERSECT — Find Common Rows

INTERSECT returns only rows that appear in BOTH result sets. Think of it as a Venn diagram overlap.

```sql
-- Customers who shop BOTH online AND in store
SELECT customer_id, name
FROM online_customers
INTERSECT
SELECT customer_id, name
FROM store_customers;
```

```text
customer_id | name
------------|-------------
103         | Priya Patel
105         | Lisa Zhang
```

```sql
-- Products sold in BOTH Q1 and Q2
SELECT product FROM q1_sales
INTERSECT
SELECT product FROM q2_sales;
```

```text
product
-----------
Analytics Hub
CRM Pro
```

### Practical Use: Verify Data Migration

```sql
-- After migrating data, verify which records exist in both old and new tables
SELECT customer_id, name, email
FROM online_customers
INTERSECT
SELECT customer_id, name, email
FROM store_customers;
```

```text
customer_id | name        | email
------------|-------------|---------------
103         | Priya Patel | priya@email.com
105         | Lisa Zhang  | lisa@email.com
```

## EXCEPT (MINUS) — Subtract One Result Set From Another

EXCEPT returns rows from the first query that don't appear in the second query. In Oracle, it's called MINUS.

```sql
-- Online-only customers (not in store)
SELECT customer_id, name
FROM online_customers
EXCEPT
SELECT customer_id, name
FROM store_customers;
```

```text
customer_id | name
------------|-------------
101         | Sarah Chen
102         | James Wilson
104         | Marcus Brown
```

```sql
-- Store-only customers (not online)
SELECT customer_id, name
FROM store_customers
EXCEPT
SELECT customer_id, name
FROM online_customers;
```

```text
customer_id | name
------------|---------------
106         | David Kim
107         | Anna Kowalski
108         | Tom Rivera
```

<div class="interview-tip">

**Order matters with EXCEPT**: `A EXCEPT B` is different from `B EXCEPT A`. The first returns rows in A that aren't in B. The second returns rows in B that aren't in A. This is not commutative — unlike UNION and INTERSECT.

</div>

### Products Exclusive to Q1

```sql
-- Products sold in Q1 but not Q2
SELECT product FROM q1_sales
EXCEPT
SELECT product FROM q2_sales;
```

```text
product
--------
Data Vault
```

```sql
-- Products sold in Q2 but not Q1
SELECT product FROM q2_sales
EXCEPT
SELECT product FROM q1_sales;
```

```text
product
-----------
Cloud Backup
ML Studio
```

## Chaining Multiple Set Operations

You can chain set operations. They execute top to bottom (unless you use parentheses):

```sql
-- All products sold in Q1 or Q2, but show each only once
SELECT product, amount, 'Q1' AS quarter FROM q1_sales
UNION ALL
SELECT product, amount, 'Q2' AS quarter FROM q2_sales
ORDER BY product, quarter;
```

```text
product       | amount | quarter
--------------|--------|--------
Analytics Hub | 28000  | Q1
Analytics Hub | 28000  | Q2
Cloud Backup  | 3200   | Q2
CRM Pro       | 15000  | Q1
CRM Pro       | 15000  | Q2
Data Vault    | 8500   | Q1
ML Studio     | 35000  | Q2
```

### UNION ALL with Summary Row

```sql
SELECT product, amount
FROM q1_sales
UNION ALL
SELECT product, amount
FROM q2_sales
UNION ALL
SELECT 'TOTAL', SUM(amount)
FROM (
    SELECT amount FROM q1_sales
    UNION ALL
    SELECT amount FROM q2_sales
) combined;
```

```text
product       | amount
--------------|-------
CRM Pro       | 15000
Analytics Hub | 28000
Data Vault    | 8500
CRM Pro       | 15000
ML Studio     | 35000
Analytics Hub | 28000
Cloud Backup  | 3200
TOTAL         | 132700
```

## Set Operations with WHERE and JOIN

Set operations work on complete queries — you can use WHERE, JOIN, GROUP BY, everything:

```sql
-- High-value online customers who also shop in-store
SELECT oc.customer_id, oc.name
FROM online_customers oc
WHERE oc.customer_id IN (
    SELECT customer_id FROM online_customers
    INTERSECT
    SELECT customer_id FROM store_customers
);
```

```text
customer_id | name
------------|-------------
103         | Priya Patel
105         | Lisa Zhang
```

```sql
-- Year-over-year comparison: customers from Jan who didn't return in Feb
SELECT customer_id, name
FROM online_customers
WHERE signup_date BETWEEN '2024-01-01' AND '2024-01-31'
EXCEPT
SELECT customer_id, name
FROM online_customers
WHERE signup_date BETWEEN '2024-02-01' AND '2024-02-28';
```

```text
customer_id | name
------------|-------------
101         | Sarah Chen
102         | James Wilson
```

## UNION ALL for Building Date Spines

A common analytics pattern — building a continuous date series:

```sql
-- Quick date spine for the first 7 days of January
SELECT '2024-01-01'::date AS report_date
UNION ALL SELECT '2024-01-02'::date
UNION ALL SELECT '2024-01-03'::date
UNION ALL SELECT '2024-01-04'::date
UNION ALL SELECT '2024-01-05'::date
UNION ALL SELECT '2024-01-06'::date
UNION ALL SELECT '2024-01-07'::date;
```

```text
report_date
-----------
2024-01-01
2024-01-02
2024-01-03
2024-01-04
2024-01-05
2024-01-06
2024-01-07
```

## Where This Is Used in Real Jobs

| Scenario | Operation | Why |
|----------|-----------|-----|
| Combine quarterly reports | UNION ALL | Stack Q1-Q4 into yearly view |
| Deduplicate customer lists | UNION | Merge lists from multiple sources |
| Find overlap between segments | INTERSECT | Who's in BOTH segment A and B? |
| Identify churn | EXCEPT | Last month's users minus this month's |
| Data migration validation | INTERSECT / EXCEPT | Verify all rows migrated correctly |
| Build reports with totals | UNION ALL | Append summary rows to detail |

<div class="challenge">

### Challenge 1: Full Customer List
Combine online_customers and store_customers into a single deduplicated list. Show customer_id, name, and email. If a customer appears in both, show them only once.

### Challenge 2: Channel Exclusivity Report
Write three queries: (1) customers who ONLY shop online, (2) customers who ONLY shop in-store, (3) customers who shop in BOTH channels. Show the count for each group.

### Challenge 3: Product Gap Analysis
You have q1_sales and q2_sales. Find: (a) products sold in Q1 but discontinued in Q2, (b) new products launched in Q2, (c) products sold in both quarters with combined revenue.

</div>

## Common Interview Questions

### Q1: What is the difference between UNION and UNION ALL?

**Answer:** UNION removes duplicate rows from the combined result — it sorts all rows and deduplicates, which makes it slower. UNION ALL keeps all rows including duplicates and is faster because it skips deduplication. In analytics, UNION ALL is preferred unless you specifically need deduplication, because (1) it's faster, (2) duplicates are usually meaningful data, and (3) you can always add DISTINCT later if needed.

### Q2: What are the rules for using set operations?

**Answer:** Three rules: (1) Both queries must return the same number of columns. (2) Corresponding columns must have compatible data types (e.g., both integers, both strings). (3) Column names in the result come from the first query — aliases in the second query are ignored. ORDER BY can only appear at the very end, after the last set operation.

### Q3: What is the difference between EXCEPT and NOT IN?

**Answer:** EXCEPT compares entire rows across all columns and handles NULLs correctly. NOT IN compares a single column and has a dangerous NULL trap — if the subquery returns any NULL, NOT IN returns no rows at all. EXCEPT is generally safer. Also, EXCEPT automatically deduplicates; NOT IN does not. In Oracle, EXCEPT is called MINUS.

### Q4: Can you use ORDER BY with UNION?

**Answer:** ORDER BY can only appear once, at the very end of the entire set operation — it applies to the final combined result, not to individual queries. If you need to control the order of rows from each source, add a sort column (like a label) and ORDER BY that column. For example: `SELECT name, 1 AS sort_order FROM table_a UNION ALL SELECT name, 2 FROM table_b ORDER BY sort_order, name`.

### Q5: How would you use EXCEPT to find data quality issues?

**Answer:** Run your expected result set as the first query and actual data as the second. `expected EXCEPT actual` shows rows that should exist but don't (missing records). `actual EXCEPT expected` shows rows that exist but shouldn't (extra/bad records). If both return zero rows, the data matches perfectly. This is a standard reconciliation technique for data migration, ETL validation, and audit checks.
