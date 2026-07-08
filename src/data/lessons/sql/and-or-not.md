---
title: "Logical Operators — AND, OR, NOT, IN, BETWEEN, LIKE"
description: "Master combining filter conditions in SQL using AND, OR, NOT, list checks (IN), range checks (BETWEEN), and pattern matching (LIKE)."
category: "sql"
order: 4
phase: 2
tags: ["sql", "logical-operators", "and-or-not", "filtering"]
publishedDate: 2025-02-15
prevSlug: "group-by"
nextSlug: "order-by-limit"
seoTitle: "SQL Logical Operators Tutorial: AND, OR, NOT, IN, BETWEEN, LIKE | Datalogify"
seoDescription: "Step-by-step guide to SQL logical operators. Learn operator precedence, common logical traps, wildcards, and list/range matching."
---

## Why This Matters

Real-world business questions are rarely as simple as "show me sales in the West." Instead, they sound like:
*   "Which customers signed up in Q4 **AND** spent over $500, but have **NOT** opened our emails?"
*   "Show me orders that are either pending **OR** processing, but only for products in the 'Software' **OR** 'SaaS' categories."
*   "Find all users with email addresses ending in '@gmail.com' or '@yahoo.com' who signed up **BETWEEN** June and August."

To translate these compound business requests into SQL, you must chain multiple conditions together. The logical operators (`AND`, `OR`, `NOT`, `IN`, `BETWEEN`, `LIKE`) are the tools you use to build these filters. If you get the logic wrong, you pull the wrong dataset and report incorrect numbers. Master these rules, and you can build complex, bulletproof filters.

---

## Conceptual Analogy: The Security Guard at the Corporate Gate

Imagine a security guard standing at the entrance to a secure tech campus. The guard holds a clipboard containing a checklist of rules to decide who is allowed to enter:

```text
       [ CAMPUS GATE ]
    ( Visitor approaches )
              |
     [ Security Guard ] <--- Clipboard: "Verify Credentials"
```

*   **AND (Conjunction)**: The guard checks: "Do you have a corporate badge **AND** a photo ID?" Both must be valid. If you have a badge but forgot your photo ID, you are turned away.
*   **OR (Disjunction)**: The guard checks: "Do you have a permanent employee pass **OR** a pre-approved visitor pass?" Only one of these needs to be true to let you in.
*   **NOT (Negation)**: The guard checks: "Is your name **NOT** on the banned list?" If your name is on the list (TRUE), the NOT operator reverses it to FALSE, and you are denied entry.
*   **IN (List Matching)**: The guard checks: "Is your department in this pre-approved list: ('Executive', 'Engineering', 'Security')?"
*   **BETWEEN (Range Matching)**: The guard checks: "Is your clearance level **BETWEEN** 3 and 5 (inclusive)?"
*   **LIKE (Pattern Matching)**: The guard checks: "Does your company name start with the word 'Tech' (e.g. 'TechCorp', 'TechLabs')?"

The guard checks each visitor row-by-row against these rules. Only visitors who clear the check are allowed onto the campus (the final result set).

---

## Logical Operator Precedence: The Order of Operations

Just as math has an order of operations (PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction), SQL has a strict order of operations for logical operators.

When a query contains multiple operators, the database engine evaluates them in this order:

```text
Priority 1: Parentheses ( )      <-- Evaluated first (override order)
Priority 2: NOT                  <-- Evaluated second
Priority 3: AND                  <-- Evaluated third
Priority 4: OR                   <-- Evaluated last
```

### The Precedence Trap
Because **`AND` takes precedence over `OR`**, the engine will evaluate `AND` conditions first, even if they appear later in your code. This is the source of many logic errors.

Consider this query meant to find software products or add-ons that have a low rating:
```sql
-- ❌ LOGIC ERROR:
SELECT product, category, rating
FROM products
WHERE category = 'Software' OR category = 'Add-on' AND rating < 4.0;
```

#### How the Database Interprets This:
Because `AND` binds tighter than `OR`, the database engine reads the query like this:
```sql
SELECT product, category, rating
FROM products
WHERE category = 'Software' OR (category = 'Add-on' AND rating < 4.0);
```
This query will return:
1.  **Any** product in the 'Software' category, regardless of how high its rating is.
2.  Products in the 'Add-on' category **only if** their rating is below 4.0.

#### The Fix:
Use **parentheses** to override the default precedence and force the database to evaluate the `OR` condition first:
```sql
--  CORRECT:
SELECT product, category, rating
FROM products
WHERE (category = 'Software' OR category = 'Add-on') AND rating < 4.0;
```

---

## The Tables We're Working With

We will query an `orders` table representing transaction logs:

| order_id | customer_id | product | amount | order_date | region | status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1001 | 501 | CRM Pro | 15000.00 | 2024-01-10 | East | completed |
| 1002 | 502 | Analytics Pro | 8500.00 | 2024-01-15 | West | completed |
| 1003 | 503 | Data Vault | 22000.00 | 2024-02-03 | West | pending |
| 1004 | 501 | Dashboard Kit | 4500.00 | 2024-02-18 | East | completed |
| 1005 | 504 | Report Builder | 79.99 | 2024-03-01 | South | cancelled |
| 1006 | 505 | CRM Pro Lite | 3000.00 | 2024-03-15 | North | completed |
| 1007 | 502 | Analytics Hub | 18000.00 | 2024-03-22 | West | *NULL* |

---

## Detailed Operator Explanations

### 1. IN — Checking Lists
The `IN` operator checks if a value matches any item in a comma-separated list. It acts as a shortcut for writing multiple `OR` conditions.

```sql
-- Using OR (Verbose)
WHERE region = 'East' OR region = 'West' OR region = 'South';

-- Using IN (Clean and Readable)
WHERE region IN ('East', 'West', 'South');
```

You can also pair it with `NOT` to exclude a list of values:
```sql
WHERE region NOT IN ('North', 'South');
```

---

### 2. BETWEEN — Checking Ranges
The `BETWEEN` operator checks if a value falls within a range. 

> [!IMPORTANT]
> **Boundary Inclusion**: The SQL standard specifies that `BETWEEN` is **inclusive**. This means that `WHERE amount BETWEEN 5000 AND 15000` will match values of exactly 5000 and 15000.

```sql
-- Equivalent logic using comparison operators:
WHERE amount >= 5000.00 AND amount <= 15000.00;

-- Equivalent logic using BETWEEN:
WHERE amount BETWEEN 5000.00 AND 15000.00;
```

---

### 3. LIKE — Pattern Matching with Wildcards
The `LIKE` operator performs case-sensitive (or case-insensitive depending on dialect) pattern matching on text columns. It uses two wildcard characters:

*   **`%` (Percent)**: Matches zero, one, or multiple characters.
*   **`_` (Underscore)**: Matches exactly one character.

#### Common Wildcard Patterns:

| Pattern | Meaning | Example Matches |
| :--- | :--- | :--- |
| `'CRM%'` | Starts with "CRM" | 'CRM Pro', 'CRM Pro Lite' |
| `'%Pro'` | Ends with "Pro" | 'CRM Pro', 'Analytics Pro' |
| `'%Vault%'` | Contains "Vault" anywhere | 'Data Vault', 'Vault Pro' |
| `'_R%'` | Second character is "R" | 'CRM Pro', 'Report Builder' |
| `'____'` | Exactly 4 characters | 'East', 'West' |

---

## Code Walkthroughs

### Example 1: Resolving Operator Precedence Traps
**Business Scenario**: The finance team is looking for key transactions. They want to identify any orders that are located in the **West** or **East** region, but only if the transaction status is **completed**.

```sql
SELECT 
    order_id,
    region,
    amount,
    status
FROM orders
WHERE (region = 'West' OR region = 'East')     -- Parentheses force OR evaluation first
  AND status = 'completed';                    -- Applied to the result of the OR filter
```

```text
# Output:
order_id | region | amount   | status
---------|--------|----------|----------
1001     | East   | 15000.00 | completed
1002     | West   | 8500.00  | completed
1004     | East   | 4500.00  | completed
(3 rows)
```
*Note*: Transaction 1003 (West, pending) is filtered out because it is not completed. Without the parentheses, transaction 1003 would have been returned because `region = 'West'` would have been evaluated as a standalone clause.

---

### Example 2: Lists (IN) and Ranges (BETWEEN)
**Business Scenario**: Marketing wants to run an email campaign targeting mid-sized deals. They need a list of orders closed in the **East, West, or South** region with transaction values **between $5,000 and $20,000** (inclusive).

```sql
SELECT 
    order_id,
    region,
    product,
    amount
FROM orders
WHERE region IN ('East', 'West', 'South')      -- Matches East, West, or South
  AND amount BETWEEN 5000.00 AND 20000.00;     -- Inclusive range check
```

```text
# Output:
order_id | region | product       | amount
---------|--------|---------------|----------
1001     | East   | CRM Pro       | 15000.00
1002     | West   | Analytics Pro | 8500.00
(2 rows)
```

*Note*: Transaction 1004 ($4,500) is filtered out because it falls below the minimum limit of the range. Transaction 1003 ($22,000) is filtered out because it exceeds the maximum limit.

---

### Example 3: Wildcard Matches and Negative Filters
**Business Scenario**: A product manager wants to clean up the product portfolio. They need to find all orders for products containing the word **"CRM"** where the transaction is **not cancelled** and does **not have a missing (NULL) status**.

```sql
SELECT 
    order_id,
    product,
    amount,
    status
FROM orders
WHERE product LIKE '%CRM%'            -- Matches 'CRM Pro', 'CRM Pro Lite'
  AND status <> 'cancelled'           -- Excludes cancelled transactions
  AND status IS NOT NULL;             -- Excludes NULL status records
```

```text
# Output:
order_id | product      | amount   | status
---------|--------------|----------|----------
1001     | CRM Pro      | 15000.00 | completed
1006     | CRM Pro Lite | 3000.00  | completed
(2 rows)
```

---

## Edge Cases & Common Mistakes

### 1. The NOT IN (NULL) Trap
This is one of the most common traps in SQL:

```sql
-- ❌ THIS WILL RETURN ZERO ROWS:
SELECT order_id 
FROM orders
WHERE status NOT IN ('completed', 'cancelled', NULL);
```

*Why it fails*: Under SQL's three-valued logic, the expression `status NOT IN ('completed', 'cancelled', NULL)` is equivalent to:
`status <> 'completed' AND status <> 'cancelled' AND status <> NULL`

Since any comparison with `NULL` yields `UNKNOWN`, the entire condition evaluates to `UNKNOWN` for every row. As a result, the database returns no data.
*Best Practice*: Ensure no `NULL` values exist in your `NOT IN` list. Use `IS NOT NULL` as a separate check instead:
```sql
--  CORRECT:
SELECT order_id 
FROM orders
WHERE status NOT IN ('completed', 'cancelled')
  AND status IS NOT NULL;
```

---

### 2. Date Ranges and Timestamp Boundaries
When using `BETWEEN` with dates (like `'2024-01-01' AND '2024-01-31'`), the behavior depends on the data type of the column:
*   If the column is a pure `DATE` type, the query works as expected.
*   If the column is a `TIMESTAMP` or `DATETIME` type, string dates are automatically converted to start-of-day times (e.g. `'2024-01-31 00:00:00'`). This means any sale made on January 31st at 2:00 PM will **not** match because it is later than midnight on January 31st!
*   *Best Practice*: For datetime fields, avoid `BETWEEN` and use comparison operators instead:
    `WHERE order_date >= '2024-01-01' AND order_date < '2024-02-01'`

---

## Practice Exercises & Mini-Projects

### Exercise 1: Identifying High-Priority Leads
**Scenario**: You are a Lead Analyst. The Sales team wants to identify high-priority leads in the `orders` table. Write a query to find all orders that meet these criteria:
1.  Located in the **West** region.
2.  The product name starts with the word **'Analytics'** or **'Data'**.
3.  The order status is either **completed** or **pending** (or missing/NULL).
4.  The transaction amount is **at least $8,000**.

*   **Target Table**: `orders`
*   **Expected Output**:
    ```text
    order_id | product       | amount   | status
    ---------|---------------|----------|----------
    1002     | Analytics Pro | 8500.00  | completed
    1003     | Data Vault    | 22000.00 | pending
    1007     | Analytics Hub | 18000.00 | NULL
    ```

**Answer & Logic Walkthrough**:
```sql
SELECT 
    order_id,
    product,
    amount,
    status
FROM orders
WHERE region = 'West'
  AND (product LIKE 'Analytics%' OR product LIKE 'Data%')
  AND (status IN ('completed', 'pending') OR status IS NULL)
  AND amount >= 8000.00;
```
1.  `region = 'West'` keeps rows 1002, 1003, and 1007.
2.  `AND (product LIKE 'Analytics%' OR product LIKE 'Data%')` matches 'Analytics Pro', 'Data Vault', and 'Analytics Hub'.
3.  `AND (status IN ('completed', 'pending') OR status IS NULL)` keeps completed, pending, and NULL statuses.
4.  `AND amount >= 8000.00` matches all three values ($8.5k, $22k, $18k).

---

### Exercise 2: Auditing regional outliers
**Scenario**: The auditing team wants to find transactions that do not fit the usual regional criteria. Write a query to find all orders that:
*   Are **NOT** in the **East** or **West** region.
*   Have a product that does **NOT** contain the word **'Pro'**.

*   **Target Table**: `orders`
*   **Expected Output**:
    ```text
    order_id | product        | region | status
    ---------|----------------|--------|----------
    1005     | Report Builder | South  | cancelled
    ```

**Answer & Logic Walkthrough**:
```sql
SELECT 
    order_id,
    product,
    region,
    status
FROM orders
WHERE region NOT IN ('East', 'West')
  AND product NOT LIKE '%Pro%';
```
1.  `region NOT IN ('East', 'West')` leaves transactions in the South (1005) and North (1006).
2.  `product NOT LIKE '%Pro%'` filters out transaction 1006 ('CRM Pro Lite' contains 'Pro'), leaving only transaction 1005 ('Report Builder').

---

## Section Recaps

*   **Operator Precedence**: SQL evaluates logical operators in the order: `NOT` -> `AND` -> `OR`. Use parentheses to group conditions and ensure the query runs as intended.
*   **List Matching**: Use the `IN` operator as a readable alternative to multiple `OR` statements. 
*   **Range Checks**: The `BETWEEN` operator is inclusive of both boundary values. Be careful when using it with datetimes, as timestamps can exclude end-of-day records.
*   **Wildcard Matching**: The `LIKE` operator uses `%` to match any number of characters and `_` to match a single character.
*   **NULL Precedence**: Avoid using `NOT IN` lists that contain `NULL` values. A single `NULL` in a `NOT IN` list will make the entire condition evaluate to `UNKNOWN`, returning zero rows.

---

## Common Interview Questions

### Q1: In the expression `WHERE A OR B AND C`, how does the database evaluate the logic? How do you change it?
**Answer:** The database evaluates the logic as `A OR (B AND C)` because the `AND` operator has higher precedence than the `OR` operator. If you want the `OR` condition evaluated first, you must wrap it in parentheses: `(A OR B) and C`.

### Q2: Why does `WHERE column NOT IN (1, 2, NULL)` return zero rows?
**Answer:** The `NOT IN` operator is translated by the database into a series of `AND` conditions: `column <> 1 AND column <> 2 AND column <> NULL`. In SQL three-valued logic, any comparison with `NULL` returns `UNKNOWN`. Since the final condition is connected by `AND` operators, the entire expression evaluates to `UNKNOWN` for every row. As a result, the query returns no data.

### Q3: Is the SQL BETWEEN operator boundary-inclusive or boundary-exclusive? Write a query to show the difference.
**Answer:** The `BETWEEN` operator is inclusive of both boundaries.
Writing:
`WHERE amount BETWEEN 10 AND 20`
Is functionally identical to writing:
`WHERE amount >= 10 AND amount <= 20`
Values of exactly 10 and 20 are included in the results.

### Q4: What is the difference between `%` and `_` in a LIKE pattern match?
**Answer:** 
*   `%` (Percent) matches any sequence of zero or more characters. E.g., `LIKE 'A%'` matches 'A', 'Apples', and 'Apricots'.
*   `_` (Underscore) matches exactly one character. E.g., `LIKE 'A_'` matches 'An' and 'As', but not 'Apples'.

### Q5: How do you perform a case-insensitive LIKE match in PostgreSQL versus MySQL?
**Answer:** 
*   **PostgreSQL** is case-sensitive by default. To run a case-insensitive match, use the `ILIKE` operator (e.g., `WHERE product ILIKE '%crm%'`) or convert the column case: `WHERE LOWER(product) LIKE '%crm%'`.
*   **MySQL** uses a case-insensitive collation by default for text columns. A standard `LIKE` operator (e.g., `WHERE product LIKE '%crm%'`) will match 'CRM Pro' and 'crm pro' without any conversion.
