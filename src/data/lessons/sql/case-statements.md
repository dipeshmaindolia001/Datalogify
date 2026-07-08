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

Imagine you work in a massive logistics warehouse. As packages slide down a conveyor belt, they pass through a sorting machine. 
*   If a package weighs more than 50 pounds, the machine pushes it into the **Heavy Freight** bin.
*   If it weighs between 10 and 50 pounds, it goes into the **Standard Box** bin.
*   If it weighs less than 10 pounds, it is routed to the **Flyer Envelope** bin.
*   Anything else that doesn't fit these rules gets sent to the **Manual Inspection** bin.

In SQL, a **CASE statement** is that sorting machine. 
It evaluates your data rows against a series of rules (conditions) and routes each row to a specific value or label based on which rule it matches. It is SQL's version of an `if-then-else` statement.

Database tables often store clean, raw metrics (like integers or status codes), but business users need readable categories. Your manager doesn't want to see a list of order totals; they want to see how many orders fell into the "Enterprise", "Mid-Market", or "SMB" tiers. They don't want to see numeric codes like `status = 3`; they want to see "✅ Shipped". 

Mastering the `CASE` statement is how you add business logic directly into your queries, allowing you to categorize data, create custom sorting orders, and perform conditional aggregations.

---

## The Tables We're Working With

We will use two tables for our analytics scenarios: `orders` and `employees`.

### 1. `orders`
```sql
-- orders table schema and sample data:
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
```

### 2. `employees`
```sql
-- employees table schema and sample data:
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

---

## Simple CASE vs. Searched CASE

There are two syntaxes for writing a CASE statement: **Simple CASE** and **Searched CASE**.

### 1. Simple CASE Syntax
Simple CASE compares a single column or expression to a set of static values.
```sql
CASE column_name
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ELSE fallback_result
END
```

#### Example 1.1: Translating Status Codes
Let's clean up our order status values for a customer report.

```sql
SELECT
    order_id,
    status,
    CASE status
        WHEN 'completed' THEN '✅ Shipped'
        WHEN 'pending'   THEN '⏳ Processing'
        WHEN 'cancelled' THEN '❌ Cancelled'
        WHEN 'refunded'  THEN '↩️ Returned'
        ELSE '❓ Unknown'
    END AS status_label
FROM orders;
```

```text
# Output:
order_id | status    | status_label
---------|-----------|--------------
1001     | completed | ✅ Shipped
1002     | completed | ✅ Shipped
1003     | completed | ✅ Shipped
1004     | completed | ✅ Shipped
1005     | pending   | ⏳ Processing
1006     | completed | ✅ Shipped
1007     | cancelled | ❌ Cancelled
1008     | completed | ✅ Shipped
1009     | completed | ✅ Shipped
1010     | pending   | ⏳ Processing
1011     | completed | ✅ Shipped
1012     | refunded  | ↩️ Returned
```

*Note: Simple CASE only performs direct equality checks (`status = 'completed'`).*

### 2. Searched CASE Syntax
Searched CASE is much more powerful. Instead of comparing a single column, you write boolean conditions for each `WHEN` clause.
```sql
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ELSE fallback_result
END
```

#### Example 1.2: Bucketing Numeric Values
Let's group our employees into organizational levels based on their salaries.

```sql
SELECT
    name,
    salary,
    CASE
        WHEN salary >= 100000 THEN 'Principal'
        WHEN salary >= 80000  THEN 'Senior'
        WHEN salary >= 70000  THEN 'Associate'
        ELSE 'Junior'
    END AS career_tier
FROM employees
ORDER BY salary DESC;
```

```text
# Output:
name          | salary | career_tier
--------------|--------|------------
James Wilson  | 115000 | Principal
Lisa Zhang    | 108000 | Principal
Sarah Chen    | 95000  | Senior
Priya Patel   | 88000  | Senior
David Kim     | 82000  | Senior
Tom Rivera    | 78000  | Associate
Marcus Brown  | 72000  | Associate
Anna Kowalski | 68000  | Junior
```

**How it executes:**
The engine checks conditions top-to-bottom. Once a row matches a condition, it returns the value and stops checking. 
For example, James Wilson has a salary of `115000`. The first condition (`salary >= 100000`) is True, so he gets marked "Principal". SQL does not evaluate the remaining conditions for his row.

---

## Step 1: CASE for Data Bucketing

Bucketing is the process of converting raw continuous metrics (such as ages, dates, or prices) into discrete categorical groups.

### Example 2.1: Revenue Deal Segments
Let's segment our B2B orders to see which deals are critical enterprise contracts vs. standard sales.

```sql
SELECT
    order_id,
    product,
    amount,
    CASE
        WHEN amount >= 25000 THEN 'Enterprise'
        WHEN amount >= 10000 THEN 'Mid-Market'
        ELSE 'SMB'
    END AS deal_segment
FROM orders
WHERE status = 'completed'
ORDER BY amount DESC;
```

```text
# Output:
order_id | product       | amount | deal_segment
---------|---------------|--------|-------------
1008     | ML Studio     | 35000  | Enterprise
1002     | Analytics Hub | 28000  | Enterprise
1004     | Analytics Hub | 28000  | Enterprise
1001     | CRM Pro       | 15000  | Mid-Market
1011     | CRM Pro       | 15000  | Mid-Market
1006     | CRM Pro       | 12500  | Mid-Market
1003     | Data Vault    | 8500   | SMB
1009     | Cloud Backup  | 3200   | SMB
```

---

## Step 2: Conditional Aggregation

Conditional aggregation is one of the most powerful analytical patterns in SQL. It is used to pivot rows into columns or to count specific statuses inside a single summary statement.

### Example 3.1: Pivoting Sales by Date range (Quarterly Breakdown)
Suppose you want a single report showing each product's sales in Q1 vs. Q2.

```sql
SELECT
    product,
    SUM(CASE WHEN EXTRACT(MONTH FROM order_date) BETWEEN 1 AND 3 
             THEN amount ELSE 0 END) AS q1_revenue,
    SUM(CASE WHEN EXTRACT(MONTH FROM order_date) BETWEEN 4 AND 6 
             THEN amount ELSE 0 END) AS q2_revenue,
    SUM(amount)                      AS total_revenue
FROM orders
WHERE status = 'completed'
GROUP BY product
ORDER BY total_revenue DESC;
```

```text
# Output:
product       | q1_revenue | q2_revenue | total_revenue
--------------|------------|------------|--------------
Analytics Hub | 56000      | 0          | 56000
CRM Pro       | 27500      | 15000      | 42500
ML Studio     | 0          | 35000      | 35000
Data Vault    | 8500       | 0          | 8500
Cloud Backup  | 0          | 3200       | 3200
```

**Step-by-Step Logic:**
1.  **Group:** The database groups the orders by `product`.
2.  **Evaluate CASE:** For each order, it checks the month. 
    *   If it is January (Month 1), the CASE returns the order's `amount`.
    *   If it is May (Month 5), the CASE returns `0`.
3.  **Aggregate:** The `SUM()` function totals the values returned by the `CASE` statement, effectively filtering the inputs dynamically for each column.

---

## Step 3: CASE in ORDER BY — Custom Sorting

By default, SQL sorts alphabetically or numerically. If you want to sort by a custom business priority (e.g., show "Pending" items first, then "Completed", then "Cancelled"), you can write a `CASE` statement inside the `ORDER BY` clause.

### Example 4.1: Sorting by Operational Urgency
Let's sort our orders so that pending items appear at the top, followed by completed, refunded, and cancelled items.

```sql
SELECT order_id, product, status, amount
FROM orders
ORDER BY
    CASE status
        WHEN 'pending'   THEN 1
        WHEN 'completed' THEN 2
        WHEN 'refunded'  THEN 3
        WHEN 'cancelled' THEN 4
        ELSE 5
    END ASC,
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
```

---

## Handling NULLs with CASE

In SQL, comparisons with `NULL` (like `performance_score = NULL`) evaluate to `UNKNOWN`, not `TRUE` or `FALSE`. 

### ⚠️ The NULL Comparison Trap
```sql
-- ❌ THIS WILL NOT WORK CORRECTLY:
CASE performance_score
    WHEN NULL THEN 'No Review'
    ...
END
```
Because `NULL` cannot be evaluated using `=` operators, the row will fall through to the `ELSE` block.

### The Solution: Use Searched CASE with `IS NULL`
To check for missing values, you must use searched CASE syntax with the `IS NULL` operator, and place the `NULL` check at the **top** of the list.

```sql
SELECT
    name,
    performance_score,
    CASE
        WHEN performance_score IS NULL THEN 'Not Evaluated'
        WHEN performance_score >= 4.5  THEN 'Exceptional'
        WHEN performance_score >= 3.0  THEN 'Meets Standards'
        ELSE 'Needs Improvement'
    END AS performance_rating
FROM employees;
```

```text
# Output:
name          | performance_score | performance_rating
--------------|-------------------|--------------------
Sarah Chen    | 4.5               | Exceptional
James Wilson  | 4.8               | Exceptional
Priya Patel   | 3.2               | Meets Standards
Marcus Brown  | 4.1               | Meets Standards
Lisa Zhang    | 4.6               | Exceptional
David Kim     | 2.8               | Needs Improvement
Anna Kowalski | NULL              | Not Evaluated
Tom Rivera    | 3.5               | Meets Standards
```

---

## Edge Cases & Common Mistakes

### Gotcha 1: The Short-Circuit Execution Trap
Since SQL evaluates conditions in order, writing rules in the wrong order can result in dead code that never executes.

```sql
-- ❌ Incorrect Order:
CASE
    WHEN salary >= 70000 THEN 'Junior'
    WHEN salary >= 90000 THEN 'Senior' -- THIS WILL NEVER EXECUTE!
    ELSE 'Entry'
END
```
**Why?** If an employee earns $95,000, they match the first condition (`salary >= 70000`) and are labeled "Junior". SQL stops checking and never reaches the "Senior" rule.
**The Fix:** Always put the most restrictive or highest numeric thresholds first.

### Gotcha 2: Missing the ELSE Clause
If you omit the `ELSE` clause, and a row does not match any of your `WHEN` conditions, **SQL will return NULL**.

```sql
-- ❌ Omitted ELSE:
CASE
    WHEN status = 'completed' THEN 'Active'
END
```
For any order with a status of 'pending' or 'cancelled', this column will evaluate to `NULL`. Always use `ELSE` to define a default fallback value.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Customer Value Segmentation
**Scenario:** Segment our customer accounts into loyalty tiers based on their total spend across all **completed** orders.
*   Tiers:
    *   Spend >= $50,000 → 'Platinum'
    *   Spend >= $25,000 → 'Gold'
    *   Spend >= $10,000 → 'Silver'
    *   Else → 'Bronze'
*   **Task:** Write a query that computes total spend per customer and assigns their loyalty tier.

*   **Expected Output:**
```text
# Output:
customer_id | total_spend | loyalty_tier
------------|-------------|-------------
501         | 58000       | Platinum
503         | 43500       | Gold
502         | 40500       | Gold
504         | 15000       | Silver
506         | 3200        | Bronze
```

<details>
<summary>View Solution</summary>

```sql
SELECT
    customer_id,
    SUM(amount) AS total_spend,
    CASE
        WHEN SUM(amount) >= 50000 THEN 'Platinum'
        WHEN SUM(amount) >= 25000 THEN 'Gold'
        WHEN SUM(amount) >= 10000 THEN 'Silver'
        ELSE 'Bronze'
    END AS loyalty_tier
FROM orders
WHERE status = 'completed'
GROUP BY customer_id
ORDER BY total_spend DESC;
```
</details>

---

### Exercise 2: Regional Performance Scorecard
**Scenario:** Generate a scorecard showing the total orders placed in each region, alongside a count of how many were completed vs. how many were lost (cancelled or refunded).

<details>
<summary>View Solution</summary>

```sql
SELECT
    region,
    COUNT(*) AS total_orders,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN status IN ('cancelled', 'refunded') THEN 1 ELSE 0 END) AS lost_orders
FROM orders
GROUP BY region
ORDER BY total_orders DESC;
```
</details>

---

## Section Recaps

*   **`CASE`** statements evaluate conditions and return specific values.
*   **Simple CASE** checks a single column for equality against static values.
*   **Searched CASE** evaluates custom boolean expressions, making it more flexible.
*   **Order matters:** SQL stops evaluating at the first matching condition. Make sure to put the most restrictive rules first.
*   **Conditional aggregation** is created by nesting `CASE` statements inside aggregate functions (like `SUM` or `COUNT`) to pivot or filter data columns dynamically.
*   **Custom sorting:** Write a `CASE` statement inside `ORDER BY` to sort rows by business priorities instead of alphanumeric order.

---

## Common Interview Questions

### Q1: What is the difference between Simple CASE and Searched CASE?
**Answer:**
*   **Simple CASE** compares a single expression or column name against a series of values using equality checks (`CASE column WHEN value1 THEN result1`).
*   **Searched CASE** evaluates independent boolean conditions for each branch (`CASE WHEN condition1 THEN result1`). It is more flexible and can handle range checks (`>=`, `<`), multiple columns, logical operators (`AND`, `OR`), and check for `IS NULL`.

---

### Q2: Does the CASE statement support short-circuit evaluation?
**Answer:**
Yes. The SQL standard requires the `CASE` statement to evaluate conditions sequentially. 

As soon as it encounters a `WHEN` condition that is true, it returns the corresponding result and stops evaluating the rest of the expression. Therefore, you should always place the most specific or narrow conditions first in the list.

---

### Q3: What happens if none of the WHEN conditions are met and there is no ELSE clause?
**Answer:**
If no conditions match and there is no `ELSE` clause, the `CASE` statement returns `NULL`. 

To prevent unexpected `NULL` values in your reports, it is best practice to always include an `ELSE` clause to handle fallback values (e.g., `ELSE 'Unknown'` or `ELSE 0`).

---

### Q4: How do you pivot rows into columns in SQL using a CASE statement?
**Answer:**
You pivot data by combining `SUM` or `COUNT` with a `CASE` statement, which is called **conditional aggregation**. 

For example, to calculate sales for a specific year in a separate column:
```sql
SUM(CASE WHEN year = 2024 THEN sales ELSE 0 END) AS sales_2024
```
By grouping by a dimension (like product), the query sums the values only for rows that match the condition, creating a column-based summary of your row data.

---

### Q5: Can you use a CASE statement inside a JOIN condition?
**Answer:**
Yes. You can write conditional logic in your join criteria if you need to join tables differently depending on the row data. 

For example:
```sql
JOIN employees e 
  ON e.dept_id = CASE 
                    WHEN e.is_contractor = 1 THEN temp_dept_id 
                    ELSE perm_dept_id 
                 END
```
While functional, this can lead to slower queries because the database optimizer cannot easily optimize joins that contain complex conditional calculations.
