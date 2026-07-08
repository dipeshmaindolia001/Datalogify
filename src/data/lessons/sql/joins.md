---
title: "JOINs — Combining Tables Like a Pro"
description: "Master INNER, LEFT, RIGHT, and FULL JOINs to combine data across tables — the most-tested SQL skill in interviews."
category: "sql"
order: 2
phase: 2
tags: ["sql", "joins", "inner-join", "left-join"]
publishedDate: 2025-02-02
prevSlug: "select-and-where"
nextSlug: "group-by"
seoTitle: "SQL JOINs Explained for Data Analytics | Datalogify"
seoDescription: "Master INNER, LEFT, RIGHT, and FULL OUTER JOINs with visual examples and real analytics scenarios."
---

## Why This Matters

Real data lives in multiple tables. Customers in one table, orders in another, products in a third. JOINs let you stitch them together. This is the #1 most-tested SQL topic in data analytics interviews — bar none.

## The Tables We're Working With

```sql
-- customers table
-- | customer_id | name           | city          | signup_date |
-- |-------------|----------------|---------------|-------------|
-- | 1           | Sarah Chen     | San Francisco | 2023-01-15  |
-- | 2           | James Wilson   | New York      | 2023-03-22  |
-- | 3           | Priya Patel    | Chicago       | 2023-06-10  |
-- | 4           | Marcus Brown   | Austin        | 2023-09-05  |
-- | 5           | Lisa Zhang     | Seattle       | 2024-01-20  |

-- orders table
-- | order_id | customer_id | product_id | amount | order_date |
-- |----------|-------------|------------|--------|------------|
-- | 1001     | 1           | 201        | 299.99 | 2024-01-15 |
-- | 1002     | 1           | 203        | 149.50 | 2024-02-10 |
-- | 1003     | 2           | 201        | 299.99 | 2024-01-22 |
-- | 1004     | 3           | 202        | 499.00 | 2024-03-05 |
-- | 1005     | 2           | 204        | 79.99  | 2024-03-18 |
-- | 1006     | 6           | 201        | 299.99 | 2024-04-01 |

-- products table
-- | product_id | product_name    | category    | price  |
-- |------------|-----------------|-------------|--------|
-- | 201        | Analytics Pro   | Software    | 299.99 |
-- | 202        | Data Vault      | Software    | 499.00 |
-- | 203        | Dashboard Kit   | Add-on      | 149.50 |
-- | 204        | Report Builder  | Add-on      | 79.99  |
-- | 205        | ML Toolkit      | Software    | 899.00 |
```

Notice: Customer 4 and 5 have **no orders**. Order 1006 has customer_id 6, which **doesn't exist** in the customers table. Product 205 has **never been ordered**. These mismatches are intentional — they show exactly how each JOIN type behaves.

## INNER JOIN — Only Matching Rows

Think of INNER JOIN as the intersection of a Venn diagram. You only get rows where both tables have a match.

```sql
SELECT
    c.name          AS customer,
    c.city,
    o.order_id,
    o.amount,
    o.order_date
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
```

```text
# Output:
customer     | city          | order_id | amount | order_date
-------------|---------------|----------|--------|----------
Sarah Chen   | San Francisco | 1001     | 299.99 | 2024-01-15
Sarah Chen   | San Francisco | 1002     | 149.50 | 2024-02-10
James Wilson | New York      | 1003     | 299.99 | 2024-01-22
Priya Patel  | Chicago       | 1004     | 499.00 | 2024-03-05
James Wilson | New York      | 1005     | 79.99  | 2024-03-18
(5 rows)
```

**What happened:** Customer 4 (Marcus) and Customer 5 (Lisa) are gone — they have no orders. Order 1006 is gone — customer_id 6 doesn't exist in the customers table. INNER JOIN drops unmatched rows from both sides.

<div class="interview-tip">

**Where this is used in real jobs:** INNER JOIN is your default when you only want complete, matched records. "Show me customers and their orders" — if a customer hasn't ordered, they're not relevant to this report. 90% of production queries use INNER JOIN.

</div>

## LEFT JOIN — Keep All Rows From the Left Table

LEFT JOIN keeps every row from the left table (customers), and fills in NULLs where there's no match in the right table (orders).

```sql
SELECT
    c.name          AS customer,
    c.city,
    o.order_id,
    o.amount,
    o.order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;
```

```text
# Output:
customer     | city          | order_id | amount | order_date
-------------|---------------|----------|--------|----------
Sarah Chen   | San Francisco | 1001     | 299.99 | 2024-01-15
Sarah Chen   | San Francisco | 1002     | 149.50 | 2024-02-10
James Wilson | New York      | 1003     | 299.99 | 2024-01-22
Priya Patel  | Chicago       | 1004     | 499.00 | 2024-03-05
James Wilson | New York      | 1005     | 79.99  | 2024-03-18
Marcus Brown | Austin        | NULL     | NULL   | NULL
Lisa Zhang   | Seattle       | NULL     | NULL   | NULL
(7 rows)
```

**What happened:** Marcus and Lisa now appear — with NULLs for their order columns. Order 1006 is still missing because customer_id 6 isn't in the left table.

### Finding Customers Who Never Ordered

This is a classic interview pattern. Use LEFT JOIN + IS NULL:

```sql
SELECT c.name, c.city, c.signup_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

```text
# Output:
name         | city    | signup_date
-------------|---------|------------
Marcus Brown | Austin  | 2023-09-05
Lisa Zhang   | Seattle | 2024-01-20
(2 rows)
```

<div class="interview-tip">

**Interview classic:** "Find customers who have never placed an order" is asked in almost every SQL interview. The LEFT JOIN + WHERE IS NULL pattern is the most readable solution. You can also use `NOT EXISTS` or `NOT IN`, but LEFT JOIN is the standard answer interviewers expect.

</div>

## RIGHT JOIN — Keep All Rows From the Right Table

RIGHT JOIN is the mirror of LEFT JOIN. It keeps every row from the right table and fills NULLs for unmatched rows on the left.

```sql
SELECT
    c.name          AS customer,
    o.order_id,
    o.amount,
    o.order_date
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;
```

```text
# Output:
customer     | order_id | amount | order_date
-------------|----------|--------|----------
Sarah Chen   | 1001     | 299.99 | 2024-01-15
Sarah Chen   | 1002     | 149.50 | 2024-02-10
James Wilson | 1003     | 299.99 | 2024-01-22
Priya Patel  | 1004     | 499.00 | 2024-03-05
James Wilson | 1005     | 79.99  | 2024-03-18
NULL         | 1006     | 299.99 | 2024-04-01
(6 rows)
```

**What happened:** Order 1006 now shows up with a NULL customer name — it exists in orders but has no matching customer. Marcus and Lisa are gone because they're on the left side.

**In practice:** RIGHT JOIN is rarely used. You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the table order. Most teams standardize on LEFT JOIN for readability.

## FULL OUTER JOIN — Keep Everything

FULL OUTER JOIN keeps all rows from both tables. NULLs fill in wherever there's no match.

```sql
SELECT
    c.name          AS customer,
    c.city,
    o.order_id,
    o.amount
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id;
```

```text
# Output:
customer     | city          | order_id | amount
-------------|---------------|----------|-------
Sarah Chen   | San Francisco | 1001     | 299.99
Sarah Chen   | San Francisco | 1002     | 149.50
James Wilson | New York      | 1003     | 299.99
Priya Patel  | Chicago       | 1004     | 499.00
James Wilson | New York      | 1005     | 79.99
Marcus Brown | Austin        | NULL     | NULL
Lisa Zhang   | Seattle       | NULL     | NULL
NULL         | NULL          | 1006     | 299.99
(8 rows)
```

**What happened:** You get everything — customers without orders (Marcus, Lisa) AND orders without valid customers (order 1006). This is the union of both sides of the Venn diagram.

**Note:** MySQL does not support FULL OUTER JOIN. You'd simulate it with a UNION of LEFT JOIN and RIGHT JOIN.

## Joining Three Tables

Real analytics queries commonly join 3+ tables. Here's orders with customer names AND product details:

```sql
SELECT
    c.name           AS customer,
    p.product_name,
    p.category,
    o.amount,
    o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p  ON o.product_id = p.product_id
ORDER BY o.order_date;
```

```text
# Output:
customer     | product_name   | category | amount | order_date
-------------|----------------|----------|--------|----------
Sarah Chen   | Analytics Pro  | Software | 299.99 | 2024-01-15
James Wilson | Analytics Pro  | Software | 299.99 | 2024-01-22
Sarah Chen   | Dashboard Kit  | Add-on   | 149.50 | 2024-02-10
Priya Patel  | Data Vault     | Software | 499.00 | 2024-03-05
James Wilson | Report Builder | Add-on   | 79.99  | 2024-03-18
(5 rows)
```

## CROSS JOIN — Every Combination

CROSS JOIN produces the Cartesian product — every row from table A paired with every row from table B. No ON clause needed.

```sql
-- Every customer paired with every product category
SELECT
    c.name,
    p.category
FROM customers c
CROSS JOIN (SELECT DISTINCT category FROM products) p
ORDER BY c.name, p.category;
```

```text
# Output:
name         | category
-------------|--------
James Wilson | Add-on
James Wilson | Software
Lisa Zhang   | Add-on
Lisa Zhang   | Software
Marcus Brown | Add-on
Marcus Brown | Software
Priya Patel  | Add-on
Priya Patel  | Software
Sarah Chen   | Add-on
Sarah Chen   | Software
(10 rows)
```

**When you'd use this:** Building grids — all products × all months for a sales matrix, or all regions × all quarters to find missing combinations.

## Self-JOIN — Joining a Table to Itself

A self-join uses the same table twice with different aliases. Classic use case: finding an employee's manager name.

```sql
-- employees table has a manager_id that references another emp_id
-- | emp_id | name          | department  | salary | manager_id |

SELECT
    e.name           AS employee,
    e.department,
    m.name           AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

```text
# Output:
employee      | department  | manager
--------------|-------------|--------
Sarah Chen    | Analytics   | (manager name for id 201)
James Wilson  | Engineering | (manager name for id 202)
Priya Patel   | Analytics   | (manager name for id 201)
Marcus Brown  | Sales       | (manager name for id 203)
Lisa Zhang    | Engineering | (manager name for id 202)
David Kim     | Marketing   | NULL
Anna Kowalski | Sales       | (manager name for id 203)
(7 rows)
```

**Why LEFT JOIN?** David Kim has no manager (manager_id is NULL). An INNER JOIN would drop him entirely. LEFT JOIN keeps him with a NULL manager name.

<div class="interview-tip">

**Interview favorite:** "Write a query to find each employee and their manager's name." This tests self-joins AND your choice of LEFT vs INNER JOIN. Always use LEFT JOIN unless the question explicitly says "only employees who have managers."

</div>

## Common JOIN Mistakes

### Mistake 1: Forgetting the ON Clause

```sql
-- WRONG — this creates a cross join (every row × every row)
SELECT c.name, o.amount
FROM customers c
JOIN orders o;
-- Returns 30 rows (5 customers × 6 orders) instead of 5

-- CORRECT
SELECT c.name, o.amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id;
```

### Mistake 2: Joining on the Wrong Column

```sql
-- WRONG — joining order_id to customer_id makes no sense
SELECT c.name, o.amount
FROM customers c
JOIN orders o ON c.customer_id = o.order_id;

-- CORRECT — join on the foreign key relationship
SELECT c.name, o.amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id;
```

### Mistake 3: Duplicated Rows From One-to-Many

```sql
-- This is CORRECT behavior, not a bug
-- Sarah has 2 orders, so she appears twice
SELECT c.name, o.order_id, o.amount
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE c.name = 'Sarah Chen';
```

```text
# Output:
name       | order_id | amount
-----------|----------|-------
Sarah Chen | 1001     | 299.99
Sarah Chen | 1002     | 149.50
(2 rows)
```

If you want one row per customer, you need GROUP BY with aggregation — that's the next lesson.

## JOIN Type Summary

```sql
-- Quick reference:

-- INNER JOIN:      Only rows that match in BOTH tables
-- LEFT JOIN:       ALL rows from left + matches from right (NULLs if no match)
-- RIGHT JOIN:      ALL rows from right + matches from left (NULLs if no match)
-- FULL OUTER JOIN: ALL rows from both tables (NULLs where no match)
-- CROSS JOIN:      Every row from left × every row from right
-- SELF JOIN:       Same table joined to itself (uses aliases)
```

## Putting It All Together

Find customers who bought Software products, with their total spend on software:

```sql
SELECT
    c.name           AS customer,
    c.city,
    COUNT(o.order_id) AS software_orders,
    SUM(o.amount)     AS total_spent
FROM customers c
INNER JOIN orders o  ON c.customer_id = o.customer_id
INNER JOIN products p ON o.product_id = p.product_id
WHERE p.category = 'Software'
GROUP BY c.name, c.city
ORDER BY total_spent DESC;
```

```text
# Output:
customer     | city          | software_orders | total_spent
-------------|---------------|-----------------|------------
Priya Patel  | Chicago       | 1               | 499.00
Sarah Chen   | San Francisco | 1               | 299.99
James Wilson | New York      | 1               | 299.99
(3 rows)
```

<div class="challenge">

### Challenge: Find Products Nobody Bought

Write a query that:
1. Lists all products from the `products` table
2. Shows which ones have **never been ordered**
3. Returns the `product_name`, `category`, and `price`

**Expected output:**
```text
product_name | category | price
-------------|----------|------
ML Toolkit   | Software | 899.00
(1 row)
```

**Hint:** Use a LEFT JOIN from products to orders, then filter for NULL order_id.

</div>

## Common Interview Questions

### Q1: What is the difference between INNER JOIN and LEFT JOIN?

**A:** INNER JOIN returns only rows that have a match in both tables — unmatched rows are dropped. LEFT JOIN returns all rows from the left table, and fills NULL for columns from the right table where there's no match. Use INNER JOIN when you only care about matched data. Use LEFT JOIN when you need to preserve all rows from the primary table and identify gaps (e.g., customers who never ordered).

### Q2: How do you find records in one table that don't exist in another?

**A:** Three approaches: (1) `LEFT JOIN ... WHERE right_table.id IS NULL` — most readable and commonly expected in interviews. (2) `WHERE id NOT IN (SELECT id FROM other_table)` — simpler syntax but watch out for NULLs in the subquery. (3) `WHERE NOT EXISTS (SELECT 1 FROM other_table WHERE ...)` — often the most performant. All three return the same result; LEFT JOIN + IS NULL is the standard interview answer.

### Q3: Why does a JOIN sometimes produce more rows than either table?

**A:** This happens with one-to-many or many-to-many relationships. If customer A has 3 orders, an INNER JOIN produces 3 rows for that customer. A CROSS JOIN of 100 customers × 50 products produces 5,000 rows. Duplicate rows after a JOIN usually mean you're joining on a non-unique key. Always check cardinality (one-to-one, one-to-many, many-to-many) before joining.

### Q4: Can you JOIN on multiple columns?

**A:** Yes. Use `AND` in the ON clause: `JOIN orders o ON o.customer_id = c.customer_id AND o.region = c.region`. This is common when the relationship requires a composite key — for example, joining on both `year` and `department` for budget tables. Each condition narrows the match further.

### Q5: What is the difference between JOIN conditions in ON vs WHERE?

**A:** For INNER JOIN, there's no practical difference. For LEFT/RIGHT/FULL JOINs, it matters: conditions in `ON` are applied during the join (before NULLs are filled), while conditions in `WHERE` filter the final result (after NULLs are filled). Putting a right-table filter in WHERE effectively converts a LEFT JOIN into an INNER JOIN because NULL values get filtered out. Always put join-related conditions in ON, and put filters on the preserved table in WHERE.
