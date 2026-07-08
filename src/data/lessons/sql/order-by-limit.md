---
title: "ORDER BY & LIMIT — Sort and Paginate Results"
description: "Sort query results, get top N rows, and implement pagination — essential for dashboards and reports."
category: "sql"
order: 5
phase: 2
tags: ["sql", "order-by", "limit", "sorting", "pagination"]
publishedDate: 2025-02-16
prevSlug: "and-or-not"
nextSlug: "distinct-and-aliases"
seoTitle: "SQL ORDER BY and LIMIT Tutorial | Datalogify"
seoDescription: "Learn SQL ORDER BY ASC/DESC, LIMIT, OFFSET, and TOP — sort and paginate query results."
---

## Why This Matters

"Show me the top 10 customers by revenue." "What were the 5 most recent orders?" "Give me page 3 of the results." Every dashboard, every leaderboard, every paginated API response uses ORDER BY and LIMIT. Without sorting, your data is returned in whatever order the database feels like — which is useless for analysis.

## The Tables We're Working With

```sql
-- products table
-- | product_id | name          | category    | price  | stock | launch_date | rating |
-- |------------|---------------|-------------|--------|-------|-------------|--------|
-- | 1          | CRM Pro       | Software    | 15000  | 45    | 2022-03-15  | 4.5    |
-- | 2          | Analytics Hub | Software    | 28000  | 12    | 2021-08-01  | 4.8    |
-- | 3          | Data Vault    | Software    | 8500   | 78    | 2023-01-20  | 4.2    |
-- | 4          | Cloud Backup  | Service     | 3200   | NULL  | 2023-06-10  | 3.9    |
-- | 5          | SecureGate    | Security    | 12000  | 30    | 2022-11-05  | 4.6    |
-- | 6          | API Gateway   | Service     | 5500   | NULL  | 2024-01-15  | NULL   |
-- | 7          | ML Studio     | Software    | 35000  | 8     | 2024-02-01  | 4.9    |
-- | 8          | DevOps Pro    | Service     | 9800   | NULL  | 2023-09-22  | 4.1    |

-- monthly_revenue table
-- | month      | product_id | units_sold | revenue |
-- |------------|------------|------------|---------|
-- | 2024-01    | 1          | 12         | 180000  |
-- | 2024-01    | 2          | 5          | 140000  |
-- | 2024-01    | 3          | 20         | 170000  |
-- | 2024-02    | 1          | 8          | 120000  |
-- | 2024-02    | 2          | 7          | 196000  |
-- | 2024-02    | 5          | 15         | 180000  |
-- | 2024-03    | 1          | 10         | 150000  |
-- | 2024-03    | 3          | 18         | 153000  |
-- | 2024-03    | 7          | 3          | 105000  |
-- | 2024-04    | 2          | 9          | 252000  |
-- | 2024-04    | 5          | 11         | 132000  |
-- | 2024-04    | 7          | 6          | 210000  |
```

## ORDER BY — Sort Your Results

### Single Column Sort

By default, ORDER BY sorts in ascending order (A→Z, 1→9, oldest→newest).

```sql
-- Products sorted by price, cheapest first
SELECT name, category, price
FROM products
ORDER BY price;
```

```text
# Output:
name         | category | price
-------------|----------|------
Cloud Backup | Service  | 3200
API Gateway  | Service  | 5500
Data Vault   | Software | 8500
DevOps Pro   | Service  | 9800
SecureGate   | Security | 12000
CRM Pro      | Software | 15000
Analytics Hub| Software | 28000
ML Studio    | Software | 35000
(8 rows)
```

### ASC and DESC — Controlling Direction

```sql
-- Most expensive products first
SELECT name, category, price
FROM products
ORDER BY price DESC;
```

```text
# Output:
name          | category | price
--------------|----------|------
ML Studio     | Software | 35000
Analytics Hub | Software | 28000
CRM Pro       | Software | 15000
SecureGate    | Security | 12000
DevOps Pro    | Service  | 9800
Data Vault    | Software | 8500
API Gateway   | Service  | 5500
Cloud Backup  | Service  | 3200
(8 rows)
```

**ASC** = ascending (default — you can omit it). **DESC** = descending. Always be explicit with DESC when you need it.

### Multi-Column Sort

Sort by one column first, then break ties with a second column.

```sql
-- Sort by category alphabetically, then by price highest first within each category
SELECT name, category, price
FROM products
ORDER BY category ASC, price DESC;
```

```text
# Output:
name          | category | price
--------------|----------|------
SecureGate    | Security | 12000
Cloud Backup  | Service  | 3200
DevOps Pro    | Service  | 9800
API Gateway   | Service  | 5500
ML Studio     | Software | 35000
Analytics Hub | Software | 28000
CRM Pro       | Software | 15000
Data Vault    | Software | 8500
(8 rows)
```

Each column gets its own sort direction. `ORDER BY category ASC, price DESC` sorts category A→Z, and within each category, price goes high→low.

### Sorting by Column Position

You can reference columns by their position in the SELECT list. Useful but less readable.

```sql
-- Sort by the 3rd column (price) descending
SELECT name, category, price
FROM products
ORDER BY 3 DESC;
```

```text
# Output:
name          | category | price
--------------|----------|------
ML Studio     | Software | 35000
Analytics Hub | Software | 28000
CRM Pro       | Software | 15000
...
(8 rows)
```

**In practice:** Avoid column-position sorting in production code. It breaks silently if someone adds or reorders columns in the SELECT. Use column names.

## NULLs in ORDER BY

NULLs are tricky when sorting. Where do they go — first or last?

```sql
-- Sort by rating — where do NULLs land?
SELECT name, rating
FROM products
ORDER BY rating ASC;
```

```text
# Output (PostgreSQL — NULLs last for ASC):
name          | rating
--------------|---------
Cloud Backup  | 3.9
DevOps Pro    | 4.1
Data Vault    | 4.2
CRM Pro       | 4.5
SecureGate    | 4.6
Analytics Hub | 4.8
ML Studio     | 4.9
API Gateway   | NULL
(8 rows)
```

**Default NULL placement varies by database:**
- **PostgreSQL:** NULLs are last for ASC, first for DESC
- **MySQL:** NULLs are first for ASC, last for DESC
- **SQL Server:** NULLs are first for ASC

### NULLS FIRST / NULLS LAST (PostgreSQL, Oracle)

```sql
-- Force NULLs to appear first
SELECT name, rating
FROM products
ORDER BY rating ASC NULLS FIRST;
```

```text
# Output:
name          | rating
--------------|---------
API Gateway   | NULL
Cloud Backup  | 3.9
DevOps Pro    | 4.1
...
(8 rows)
```

**For MySQL/SQL Server** (no NULLS FIRST/LAST syntax), use a CASE trick:

```sql
-- MySQL/SQL Server: Push NULLs to the end
SELECT name, rating
FROM products
ORDER BY CASE WHEN rating IS NULL THEN 1 ELSE 0 END, rating ASC;
```

<div class="interview-tip">

**Where this is used in real jobs:** NULL handling in ORDER BY matters when building leaderboards or ranked reports. Products with no ratings shouldn't appear at the top of a "best rated" list. Interviewers test whether you know that NULL behavior differs across databases.

</div>

## LIMIT — Get Only N Rows

### Basic LIMIT

```sql
-- Top 3 most expensive products
SELECT name, category, price
FROM products
ORDER BY price DESC
LIMIT 3;
```

```text
# Output:
name          | category | price
--------------|----------|------
ML Studio     | Software | 35000
Analytics Hub | Software | 28000
CRM Pro       | Software | 15000
(3 rows)
```

### LIMIT with OFFSET — Pagination

OFFSET skips rows before returning results. Essential for paginated displays.

```sql
-- Page 1: First 3 products (skip 0)
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3 OFFSET 0;
```

```text
# Output:
name          | price
--------------|------
ML Studio     | 35000
Analytics Hub | 28000
CRM Pro       | 15000
(3 rows)
```

```sql
-- Page 2: Next 3 products (skip 3)
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3 OFFSET 3;
```

```text
# Output:
name         | price
-------------|------
SecureGate   | 12000
DevOps Pro   | 9800
Data Vault   | 8500
(3 rows)
```

```sql
-- Page 3: Next 3 (skip 6) — only 2 left
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3 OFFSET 6;
```

```text
# Output:
name         | price
-------------|------
API Gateway  | 5500
Cloud Backup | 3200
(2 rows)
```

**Pagination formula:** `OFFSET = (page_number - 1) * page_size`

## Database-Specific Syntax

Different databases have different ways to limit rows. Here's the same query in each dialect:

```sql
-- PostgreSQL / MySQL
SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 5;

-- SQL Server
SELECT TOP 5 name, price
FROM products
ORDER BY price DESC;

-- Oracle / ANSI SQL Standard
SELECT name, price
FROM products
ORDER BY price DESC
FETCH FIRST 5 ROWS ONLY;

-- Oracle (with OFFSET)
SELECT name, price
FROM products
ORDER BY price DESC
OFFSET 10 ROWS FETCH NEXT 5 ROWS ONLY;
```

<div class="interview-tip">

**Interview tip:** If the interviewer doesn't specify which database, write PostgreSQL/MySQL syntax (`LIMIT`). But mention: "In SQL Server, I'd use TOP." Shows you've worked with multiple databases.

</div>

## Top N Analysis — Real Scenarios

### Top Revenue Month Per Product

```sql
-- Best month for each product (top revenue months overall)
SELECT
    p.name       AS product,
    mr.month,
    mr.revenue
FROM monthly_revenue mr
JOIN products p ON mr.product_id = p.product_id
ORDER BY mr.revenue DESC
LIMIT 5;
```

```text
# Output:
product       | month   | revenue
--------------|---------|--------
Analytics Hub | 2024-04 | 252000
ML Studio     | 2024-04 | 210000
Analytics Hub | 2024-02 | 196000
CRM Pro       | 2024-01 | 180000
SecureGate    | 2024-02 | 180000
(5 rows)
```

### Bottom Performers

```sql
-- 3 lowest-revenue months across all products
SELECT
    p.name       AS product,
    mr.month,
    mr.units_sold,
    mr.revenue
FROM monthly_revenue mr
JOIN products p ON mr.product_id = p.product_id
ORDER BY mr.revenue ASC
LIMIT 3;
```

```text
# Output:
product    | month   | units_sold | revenue
-----------|---------|------------|--------
ML Studio  | 2024-03 | 3          | 105000
CRM Pro    | 2024-02 | 8          | 120000
SecureGate | 2024-04 | 11         | 132000
(3 rows)
```

### Sorting by Calculated Expressions

You can ORDER BY expressions that aren't in the SELECT list.

```sql
-- Products sorted by revenue per unit (price * stock value estimate)
SELECT
    name,
    price,
    stock,
    price * COALESCE(stock, 0) AS inventory_value
FROM products
ORDER BY price * COALESCE(stock, 0) DESC;
```

```text
# Output:
name          | price | stock | inventory_value
--------------|-------|-------|----------------
CRM Pro       | 15000 | 45    | 675000
Data Vault    | 8500  | 78    | 663000
SecureGate    | 12000 | 30    | 360000
Analytics Hub | 28000 | 12    | 336000
ML Studio     | 35000 | 8     | 280000
Cloud Backup  | 3200  | NULL  | 0
API Gateway   | 5500  | NULL  | 0
DevOps Pro    | 9800  | NULL  | 0
(8 rows)
```

## Sorting with GROUP BY

ORDER BY works after GROUP BY, so you can sort aggregated results.

```sql
-- Total revenue by product, highest first
SELECT
    p.name          AS product,
    SUM(mr.revenue) AS total_revenue,
    SUM(mr.units_sold) AS total_units
FROM monthly_revenue mr
JOIN products p ON mr.product_id = p.product_id
GROUP BY p.name
ORDER BY total_revenue DESC;
```

```text
# Output:
product       | total_revenue | total_units
--------------|---------------|------------
Analytics Hub | 588000        | 21
CRM Pro       | 450000        | 30
Data Vault    | 323000        | 38
ML Studio     | 315000        | 9
SecureGate    | 312000        | 26
(5 rows)
```

```sql
-- Top 3 months by total revenue across all products
SELECT
    month,
    SUM(revenue)    AS total_revenue,
    SUM(units_sold) AS total_units
FROM monthly_revenue
GROUP BY month
ORDER BY total_revenue DESC
LIMIT 3;
```

```text
# Output:
month   | total_revenue | total_units
--------|---------------|------------
2024-04 | 594000        | 26
2024-01 | 490000        | 37
2024-02 | 496000        | 30
(3 rows)
```

<div class="challenge">

### Challenge: Product Performance Report

Write a query that returns:
1. Each **product name** and **category**
2. The **total revenue** and **average units sold per month**
3. Only include products with **total revenue over $300,000**
4. Sorted by **total revenue descending**
5. Show only the **top 3**

**Expected output:**
```text
product       | category | total_revenue | avg_units
--------------|----------|---------------|----------
Analytics Hub | Software | 588000        | 7
CRM Pro       | Software | 450000        | 10
Data Vault    | Software | 323000        | 19
(3 rows)
```

**Hint:** You need JOIN, GROUP BY, HAVING, ORDER BY, and LIMIT.

</div>

## Performance Notes

**ORDER BY is expensive.** It requires the database to sort the entire result set before returning rows. On a table with millions of rows:

1. **Add an index** on columns you frequently sort by
2. **Use LIMIT** to reduce the sorting workload — most databases optimize LIMIT + ORDER BY to avoid sorting everything
3. **Avoid ORDER BY on expressions** when possible — the database can't use an index on `ORDER BY price * quantity`
4. **OFFSET pagination gets slower** as the offset increases. For page 1000, the database must process and discard 999 pages of data. For high-volume pagination, use keyset pagination instead:

```sql
-- Keyset pagination (fast for any page):
-- Instead of OFFSET, filter by the last seen value
SELECT name, price
FROM products
WHERE price < 12000  -- last price from previous page
ORDER BY price DESC
LIMIT 3;
```

## Common Interview Questions

### Q1: What happens if you use ORDER BY without LIMIT?

**Answer:** The database sorts the entire result set and returns all rows in sorted order. This works fine for small tables but can be very slow on large datasets because sorting is O(n log n). In production, you almost always pair ORDER BY with LIMIT to avoid returning millions of rows. Some dashboarding tools add an implicit limit, but you shouldn't rely on that.

### Q2: Can you ORDER BY a column not in the SELECT list?

**Answer:** Yes, in most cases. `SELECT name FROM products ORDER BY price DESC` is valid — the database uses the price column for sorting even though it's not returned. The exception is when you use DISTINCT or GROUP BY — then you can only ORDER BY columns that are in the SELECT list or used in aggregate functions, because other columns would be ambiguous.

### Q3: What is the difference between LIMIT and FETCH FIRST?

**Answer:** LIMIT (MySQL, PostgreSQL) and FETCH FIRST ... ROWS ONLY (Oracle, SQL Server 2012+, ANSI standard) do the same thing — restrict the number of rows returned. FETCH FIRST is the ANSI SQL standard syntax and is more portable. SQL Server also has TOP. In interviews, mention you know the differences and would adapt to the database in use.

### Q4: How do you handle ties in Top N queries?

**Answer:** Standard LIMIT doesn't handle ties — it picks arbitrarily among rows with equal values. If two products both have $15,000 in revenue and you LIMIT 3, one might be included and one excluded randomly. To include all ties, use `FETCH FIRST 3 ROWS WITH TIES` (ANSI SQL) or use a window function: `WHERE RANK() OVER (ORDER BY revenue DESC) <= 3`. This guarantees you don't arbitrarily exclude tied rows.

### Q5: Why does OFFSET-based pagination get slow on large datasets?

**Answer:** With `LIMIT 10 OFFSET 100000`, the database must scan and sort the first 100,010 rows, then discard 100,000 of them. The work grows linearly with the offset value. For large offsets, use keyset pagination instead: `WHERE id > last_seen_id ORDER BY id LIMIT 10`. This uses an index seek instead of a scan and runs in constant time regardless of which "page" you're on.
