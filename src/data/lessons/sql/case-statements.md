---
title: "CASE Statements — Conditional Logic in SQL"
description: "Add if-then-else logic to your queries — categorize data, create buckets, and build custom columns."
category: "sql"
order: 10
phase: 2
tags: ["sql", "case", "conditional-logic", "bucketing"]
publishedDate: 2025-02-21
prevSlug: "ctes"
nextSlug: "window-functions-ranking"
seoTitle: "SQL CASE Statement Tutorial | Datalogify"
seoDescription: "Master SQL CASE WHEN statements — categorize data, create buckets, and add conditional logic to queries."
---

## Why This Matters

"Label every customer as high, medium, or low value." "Flag orders over $10K as 'priority.'" "Show revenue in Q1, Q2, Q3, Q4 columns." These aren't simple filters — they're conditional logic. CASE is SQL's if-then-else. It transforms raw data into the categories, labels, and flags that business users actually understand. Every report you build will use CASE somewhere.

## The Tables We're Working With

```sql
-- orders table
-- | order_id | customer_id | product       | amount | order_date | region | status    |
-- |----------|-------------|---------------|--------|------------|--------|-----------|
-- | 1001     | 501         | CRM Pro       | 15000  | 2024-01-10 | East   | completed |
-- | 1002     | 502         | Analytics Hub | 28000  | 2024-01-18 | West   | completed |
-- | 1003     | 503         | Data Vault    | 8500   | 2024-02-05 | East   | completed |
-- | 1004     | 501         | Analytics Hub | 28000  | 2024-02-22 | East   | completed |
-- | 1005     | 504         | CRM Pro       | 15000  | 2024-03-01 | South  | pending   |
-- | 1006     | 502         | CRM Pro       | 12500  | 2024-03-14 | West   | completed |
-- | 1007     | 505         | Data Vault    | 8500   | 2024-04-02 | North  | cancelled |
-- | 1008     | 503         | ML Studio     | 35000  | 2024-04-19 | East   | completed |
-- | 1009     | 506         | Cloud Backup  | 3200   | 2024-05-08 | South  | completed |
-- | 1010     | 504         | Analytics Hub | 28000  | 2024-05-25 | West   | pending   |
-- | 1011     | 501         | CRM Pro       | 15000  | 2024-06-01 | East   | completed |
-- | 1012     | 503         | Cloud Backup  | 3200   | 2024-06-15 | East   | refunded  |

-- employees table
-- | emp_id | name           | department  | salary | hire_date  | performance_score |
-- |--------|----------------|-------------|--------|------------|-------------------|
-- | 101    | Sarah Chen     | Analytics   | 95000  | 2021-03-15 | 4.5               |
-- | 102    | James Wilson   | Engineering | 115000 | 2020-06-01 | 4.8               |
-- | 103    | Priya Patel    | Analytics   | 88000  | 2022-01-10 | 3.2               |
-- | 104    | Marcus Brown   | Sales       | 72000  | 2023-05-20 | 4.1               |
-- | 105    | Lisa Zhang     | Engineering | 108000 | 2021-09-12 | 4.6               |
-- | 106    | David Kim      | Marketing   | 82000  | 2022-11-01 | 2.8               |
-- | 107    | Anna Kowalski  | Sales       | 68000  | 2024-02-14 | NULL              |
-- | 108    | Tom Rivera     | Marketing   | 78000  | 2023-08-05 | 3.5               |
```

## Searched CASE — The Most Common Form

The searched CASE evaluates conditions (boolean expressions) in order and returns the first match.

```sql
SELECT
    name,
    salary,
    CASE
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 80000  THEN 'Mid-Level'
        WHEN salary >= 70000  THEN 'Junior'
        ELSE 'Entry'
    END AS salary_tier
FROM employees
ORDER BY salary DESC;
```

```text
# Output:
name          | salary | salary_tier
--------------|--------|------------
James Wilson  | 115000 | Senior
Lisa Zhang    | 108000 | Senior
Sarah Chen    | 95000  | Mid-Level
Priya Patel   | 88000  | Mid-Level
David Kim     | 82000  | Mid-Level
Tom Rivera    | 78000  | Junior
Marcus Brown  | 72000  | Junior
Anna Kowalski | 68000  | Entry
(8 rows)
```

**How it works:** SQL checks conditions top-to-bottom. James Wilson hits `salary >= 100000` first, so he's "Senior" — it doesn't keep checking the other conditions. Order matters.

### ELSE Is Your Safety Net

```sql
-- Without ELSE, unmatched rows get NULL
SELECT
    name,
    salary,
    CASE
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 80000  THEN 'Mid-Level'
    END AS salary_tier  -- No ELSE: anything below 80K becomes NULL
FROM employees;
```

**Always include ELSE** unless you intentionally want NULL for unmatched rows. Missing ELSE is a common source of unexpected NULLs in reports.

## Simple CASE — Match Against a Single Value

When you're comparing one column against specific values, simple CASE is cleaner.

```sql
SELECT
    order_id,
    status,
    CASE status
        WHEN 'completed' THEN '✅ Done'
        WHEN 'pending'   THEN '⏳ Waiting'
        WHEN 'cancelled' THEN '❌ Cancelled'
        WHEN 'refunded'  THEN '↩️ Refunded'
        ELSE '❓ Unknown'
    END AS status_label
FROM orders;
```

```text
# Output:
order_id | status    | status_label
---------|-----------|---------------
1001     | completed | ✅ Done
1002     | completed | ✅ Done
1003     | completed | ✅ Done
1004     | completed | ✅ Done
1005     | pending   | ⏳ Waiting
1006     | completed | ✅ Done
1007     | cancelled | ❌ Cancelled
1008     | completed | ✅ Done
1009     | completed | ✅ Done
1010     | pending   | ⏳ Waiting
1011     | completed | ✅ Done
1012     | refunded  | ↩️ Refunded
(12 rows)
```

**Simple CASE** = `CASE column WHEN value THEN result`. Use when comparing one column to discrete values.
**Searched CASE** = `CASE WHEN condition THEN result`. Use when you need ranges, expressions, or multiple columns.

## CASE for Data Bucketing — The Analytics Workhorse

### Revenue Tiers

```sql
SELECT
    order_id,
    product,
    amount,
    CASE
        WHEN amount >= 25000 THEN 'Enterprise'
        WHEN amount >= 10000 THEN 'Mid-Market'
        WHEN amount >= 5000  THEN 'SMB'
        ELSE 'Micro'
    END AS deal_tier
FROM orders
WHERE status = 'completed'
ORDER BY amount DESC;
```

```text
# Output:
order_id | product       | amount | deal_tier
---------|---------------|--------|----------
1008     | ML Studio     | 35000  | Enterprise
1002     | Analytics Hub | 28000  | Enterprise
1004     | Analytics Hub | 28000  | Enterprise
1001     | CRM Pro       | 15000  | Mid-Market
1011     | CRM Pro       | 15000  | Mid-Market
1006     | CRM Pro       | 12500  | Mid-Market
1003     | Data Vault    | 8500   | SMB
1009     | Cloud Backup  | 3200   | Micro
(8 rows)
```

### Date Bucketing — Fiscal Quarters

```sql
SELECT
    order_id,
    order_date,
    amount,
    CASE
        WHEN EXTRACT(MONTH FROM order_date) IN (1, 2, 3)   THEN 'Q1'
        WHEN EXTRACT(MONTH FROM order_date) IN (4, 5, 6)   THEN 'Q2'
        WHEN EXTRACT(MONTH FROM order_date) IN (7, 8, 9)   THEN 'Q3'
        WHEN EXTRACT(MONTH FROM order_date) IN (10, 11, 12) THEN 'Q4'
    END AS fiscal_quarter
FROM orders
ORDER BY order_date;
```

```text
# Output:
order_id | order_date | amount | fiscal_quarter
---------|------------|--------|---------------
1001     | 2024-01-10 | 15000  | Q1
1002     | 2024-01-18 | 28000  | Q1
1003     | 2024-02-05 | 8500   | Q1
1004     | 2024-02-22 | 28000  | Q1
1005     | 2024-03-01 | 15000  | Q1
1006     | 2024-03-14 | 12500  | Q1
1007     | 2024-04-02 | 8500   | Q2
1008     | 2024-04-19 | 35000  | Q2
1009     | 2024-05-08 | 3200   | Q2
1010     | 2024-05-25 | 28000  | Q2
1011     | 2024-06-01 | 15000  | Q2
1012     | 2024-06-15 | 3200   | Q2
(12 rows)
```

<div class="interview-tip">

**Where this is used in real jobs:** Bucketing with CASE is everywhere — revenue tiers for pricing analysis, age groups for demographics, time periods for trend analysis, risk categories for compliance. Any time you see a bar chart with labeled categories on a dashboard, there's likely a CASE statement behind it.

</div>

## CASE in WHERE — Conditional Filtering

```sql
-- Dynamic filtering: only show completed orders for high-value deals,
-- but show all statuses for smaller deals
SELECT order_id, product, amount, status
FROM orders
WHERE CASE
    WHEN amount >= 20000 THEN status = 'completed'
    ELSE TRUE
END;
```

```text
# Output:
order_id | product       | amount | status
---------|---------------|--------|----------
1001     | CRM Pro       | 15000  | completed
1002     | Analytics Hub | 28000  | completed
1003     | Data Vault    | 8500   | completed
1004     | Analytics Hub | 28000  | completed
1005     | CRM Pro       | 15000  | pending
1006     | CRM Pro       | 12500  | completed
1008     | ML Studio     | 35000  | completed
1009     | Cloud Backup  | 3200   | completed
1011     | CRM Pro       | 15000  | completed
1012     | Cloud Backup  | 3200   | refunded
(10 rows)
```

Orders 1007 (cancelled, $8500) still shows because it's under $20K. Order 1010 (pending, $28000) is excluded because high-value orders must be completed.

## CASE in ORDER BY — Custom Sort Orders

```sql
-- Sort by priority: pending first, then completed, then everything else
SELECT order_id, product, status, amount
FROM orders
ORDER BY
    CASE status
        WHEN 'pending'   THEN 1
        WHEN 'completed' THEN 2
        WHEN 'refunded'  THEN 3
        WHEN 'cancelled' THEN 4
        ELSE 5
    END,
    amount DESC;
```

```text
# Output:
order_id | product       | status    | amount
---------|---------------|-----------|-------
1010     | Analytics Hub | pending   | 28000
1005     | CRM Pro       | pending   | 15000
1008     | ML Studio     | completed | 35000
1002     | Analytics Hub | completed | 28000
1004     | Analytics Hub | completed | 28000
1001     | CRM Pro       | completed | 15000
1011     | CRM Pro       | completed | 15000
1006     | CRM Pro       | completed | 12500
1003     | Data Vault    | completed | 8500
1009     | Cloud Backup  | completed | 3200
1012     | Cloud Backup  | refunded  | 3200
1007     | Data Vault    | cancelled | 8500
(12 rows)
```

## CASE with Aggregation — Pivot-Style Reports

This is one of the most powerful CASE patterns. It creates crosstab/pivot reports.

### Revenue by Quarter (Pivot)

```sql
SELECT
    product,
    SUM(CASE WHEN EXTRACT(MONTH FROM order_date) BETWEEN 1 AND 3
             THEN amount ELSE 0 END)  AS q1_revenue,
    SUM(CASE WHEN EXTRACT(MONTH FROM order_date) BETWEEN 4 AND 6
             THEN amount ELSE 0 END)  AS q2_revenue,
    SUM(amount)                        AS total_revenue
FROM orders
WHERE status = 'completed'
GROUP BY product
ORDER BY total_revenue DESC;
```

```text
# Output:
product       | q1_revenue | q2_revenue | total_revenue
--------------|------------|------------|-------------
Analytics Hub | 56000      | 0          | 56000
CRM Pro       | 27500      | 15000      | 42500
ML Studio     | 0          | 35000      | 35000
Data Vault    | 8500       | 0          | 8500
Cloud Backup  | 0          | 3200       | 3200
(5 rows)
```

### Count by Category

```sql
SELECT
    region,
    COUNT(*)                                                    AS total_orders,
    COUNT(CASE WHEN status = 'completed' THEN 1 END)           AS completed,
    COUNT(CASE WHEN status = 'pending' THEN 1 END)             AS pending,
    COUNT(CASE WHEN status IN ('cancelled', 'refunded') THEN 1 END) AS lost
FROM orders
GROUP BY region
ORDER BY total_orders DESC;
```

```text
# Output:
region | total_orders | completed | pending | lost
-------|--------------|-----------|---------|-----
East   | 5            | 4         | 0       | 1
West   | 3            | 2         | 1       | 0
South  | 2            | 1         | 1       | 0
North  | 1            | 0         | 0       | 1
(4 rows)
```

<div class="interview-tip">

**Interview favorite:** "Write a query that pivots rows into columns." This is the SUM(CASE WHEN...) pattern above. Interviewers love it because it tests aggregation, CASE, and GROUP BY together. Practice it until it's muscle memory. In PostgreSQL you can also use `FILTER (WHERE ...)` syntax as a cleaner alternative.

</div>

## Handling NULLs with CASE

CASE is often used to clean up NULL values in reports.

```sql
SELECT
    name,
    performance_score,
    CASE
        WHEN performance_score IS NULL THEN 'Not Yet Reviewed'
        WHEN performance_score >= 4.5  THEN 'Exceptional'
        WHEN performance_score >= 3.5  THEN 'Meets Expectations'
        WHEN performance_score >= 2.5  THEN 'Needs Improvement'
        ELSE 'Below Standards'
    END AS review_status
FROM employees
ORDER BY performance_score DESC NULLS LAST;
```

```text
# Output:
name          | performance_score | review_status
--------------|-------------------|-------------------
James Wilson  | 4.8               | Exceptional
Lisa Zhang    | 4.6               | Exceptional
Sarah Chen    | 4.5               | Exceptional
Marcus Brown  | 4.1               | Meets Expectations
Tom Rivera    | 3.5               | Meets Expectations
Priya Patel   | 3.2               | Needs Improvement
David Kim     | 2.8               | Needs Improvement
Anna Kowalski | NULL              | Not Yet Reviewed
(8 rows)
```

**Check for NULL first** in your CASE conditions. If a NULL value passes through the other WHEN conditions, `performance_score >= 4.5` evaluates to NULL (not FALSE), and the row falls through to ELSE. Put the NULL check first to be explicit.

## CASE in GROUP BY — Group by Derived Categories

```sql
-- Revenue by deal tier
SELECT
    CASE
        WHEN amount >= 25000 THEN 'Enterprise'
        WHEN amount >= 10000 THEN 'Mid-Market'
        ELSE 'SMB'
    END                        AS deal_tier,
    COUNT(*)                   AS order_count,
    SUM(amount)                AS total_revenue,
    ROUND(AVG(amount), 0)      AS avg_deal_size
FROM orders
WHERE status = 'completed'
GROUP BY
    CASE
        WHEN amount >= 25000 THEN 'Enterprise'
        WHEN amount >= 10000 THEN 'Mid-Market'
        ELSE 'SMB'
    END
ORDER BY total_revenue DESC;
```

```text
# Output:
deal_tier  | order_count | total_revenue | avg_deal_size
-----------|-------------|---------------|-------------
Enterprise | 3           | 91000         | 30333
Mid-Market | 3           | 42500         | 14167
SMB        | 2           | 11700         | 5850
(3 rows)
```

**Note:** You have to repeat the full CASE expression in GROUP BY because most databases don't allow aliases in GROUP BY. MySQL is the exception — it lets you GROUP BY the alias directly.

## Nested CASE — Use Sparingly

You can nest CASE inside CASE, but readability drops fast.

```sql
SELECT
    name,
    department,
    salary,
    CASE
        WHEN department IN ('Engineering', 'Analytics') THEN
            CASE
                WHEN salary >= 100000 THEN 'Tech Senior'
                ELSE 'Tech Standard'
            END
        WHEN department = 'Sales' THEN
            CASE
                WHEN salary >= 70000 THEN 'Sales Senior'
                ELSE 'Sales Standard'
            END
        ELSE 'Other'
    END AS role_category
FROM employees
ORDER BY role_category;
```

```text
# Output:
name          | department  | role_category
--------------|-------------|---------------
David Kim     | Marketing   | Other
Tom Rivera    | Marketing   | Other
Marcus Brown  | Sales       | Sales Senior
Anna Kowalski | Sales       | Sales Standard
James Wilson  | Engineering | Tech Senior
Lisa Zhang    | Engineering | Tech Senior
Sarah Chen    | Analytics   | Tech Standard
Priya Patel   | Analytics   | Tech Standard
(8 rows)
```

**Better approach:** Flatten nested CASE into a single searched CASE with compound conditions:

```sql
-- Same result, more readable
CASE
    WHEN department IN ('Engineering', 'Analytics') AND salary >= 100000 THEN 'Tech Senior'
    WHEN department IN ('Engineering', 'Analytics')                       THEN 'Tech Standard'
    WHEN department = 'Sales' AND salary >= 70000                        THEN 'Sales Senior'
    WHEN department = 'Sales'                                            THEN 'Sales Standard'
    ELSE 'Other'
END AS role_category
```

<div class="challenge">

### Challenge: Customer Value Segmentation Report

Write a query that:
1. Calculates each customer's **total spend** across all completed orders
2. Categorizes them into tiers:
   - **$50,000+** → 'Platinum'
   - **$25,000 - $49,999** → 'Gold'
   - **$10,000 - $24,999** → 'Silver'
   - **Below $10,000** → 'Bronze'
3. Shows the **customer_id**, **total_spend**, **order_count**, and **tier**
4. Sorted by **total_spend descending**

**Expected output:**
```text
customer_id | total_spend | order_count | tier
------------|-------------|-------------|--------
501         | 58000       | 3           | Platinum
503         | 43500       | 2           | Gold
502         | 40500       | 2           | Gold
504         | 15000       | 1           | Silver
509         | 3200        | 1           | Bronze
(5 rows)
```

**Hint:** Use GROUP BY with HAVING to exclude non-completed orders, and CASE for the tier logic.

</div>

## Common Interview Questions

### Q1: What is the difference between simple CASE and searched CASE?

**Answer:** Simple CASE (`CASE column WHEN value THEN result`) compares one expression against specific values — like a switch statement. Searched CASE (`CASE WHEN condition THEN result`) evaluates boolean expressions — like if/else-if chains. Searched CASE is more flexible: it handles ranges (`WHEN salary > 100000`), multiple columns (`WHEN dept = 'Sales' AND salary > 50000`), and IS NULL checks. Simple CASE only does equality comparisons. In practice, searched CASE is used ~90% of the time.

### Q2: What happens when no CASE condition matches and there's no ELSE?

**Answer:** The CASE expression returns NULL. This is a common source of bugs — a report shows blank cells or calculations break because of unexpected NULLs. Best practice: always include an ELSE clause, even if it's just `ELSE 'Unknown'` or `ELSE 0`. The only exception is when you intentionally want NULL for unmatched rows, in which case, add a comment explaining why.

### Q3: How do you create a pivot table in SQL?

**Answer:** Use the SUM(CASE WHEN...) pattern. For each column you want in the pivot, write `SUM(CASE WHEN category = 'X' THEN value ELSE 0 END) AS x_column`. Group by the row dimension. Example: revenue by quarter becomes `SUM(CASE WHEN quarter = 'Q1' THEN revenue ELSE 0 END) AS q1_revenue`. Some databases have PIVOT syntax (SQL Server, Oracle), but the CASE approach works everywhere and is what interviewers expect.

### Q4: Can you use CASE in a WHERE clause?

**Answer:** Yes, but it's uncommon and often a sign that the logic could be written more clearly with regular AND/OR conditions. A valid use case is conditional filtering: `WHERE CASE WHEN @report_type = 'summary' THEN status = 'completed' ELSE TRUE END`. More commonly, you'll see CASE in SELECT (categorization), ORDER BY (custom sort), and GROUP BY (bucketing). If your WHERE clause CASE could be replaced with AND/OR, prefer the simpler form.

### Q5: Does CASE short-circuit? What if multiple WHEN conditions are true?

**Answer:** Yes, CASE evaluates conditions in order and returns the result of the first matching WHEN. It does not evaluate subsequent conditions once a match is found — this is called short-circuit evaluation. Order matters: `WHEN salary >= 50000 THEN 'High' WHEN salary >= 100000 THEN 'Very High'` would never reach "Very High" because every salary >= 100000 is also >= 50000. Always put the most specific (or highest threshold) conditions first.
