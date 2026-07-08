---
title: "ORDER BY & LIMIT — Sorting and Pagination"
description: "Learn how to sort query results, isolate top records, and implement pagination using ORDER BY, LIMIT, and OFFSET."
category: "sql"
order: 5
phase: 2
tags: ["sql", "order-by", "limit", "offset", "pagination"]
publishedDate: 2025-02-16
prevSlug: "and-or-not"
nextSlug: "distinct-and-aliases"
seoTitle: "SQL ORDER BY & LIMIT Tutorial: Sorting and Pagination | Datalogify"
seoDescription: "Master SQL ORDER BY, ASC/DESC, sorting NULLs (NULLS FIRST/LAST), and LIMIT/OFFSET for pagination. Learn the performance cost of high offsets."
---

## Why This Matters

By default, relational databases do not store data in any specific order. When you run a query, the database engine retrieves rows in whatever sequence is fastest for it to read from disk (a concept called **non-deterministic sorting**). 

If you run a query twice, the rows might appear in a different order each time, especially if the table is constantly being updated.

For data analytics, sorting is essential:
*   "Show me our top 10 customers by revenue."
*   "What are the 5 oldest pending tickets?"
*   "List all products alphabetically by category."

The `ORDER BY` clause allows you to sort your output. When combined with the `LIMIT` and `OFFSET` clauses, it allows you to isolate outliers and build paginated reports.

---

## Conceptual Analogy: The Alphabetical Organizer

Imagine you have a messy stack of paper folders on your desk. Each folder represents a product profile.

```text
       [ Messy Stack of Folders ]
 (Folder B, Folder D, Folder A, Folder C)
```

You want to organize and present these folders:

1. **Sort the Folders (ORDER BY)**: You lay them out on a table. If you arrange them from A to Z, you are sorting in **Ascending** order (`ASC`). If you arrange them from Z to A, you are sorting in **Descending** order (`DESC`).

```text
   [Sorted Folders]
 (Folder A, Folder B, Folder C, Folder D)
```

2. **Sort by Multiple Criteria**: If you have multiple folders with the same name, you might decide to sort them first by category (e.g. Software, Hardware), and then sort folders within each category by price.
3. **Select the Top Folders (LIMIT)**: If you only need to show the best options, you count off the first 3 folders from the sorted pile and set the rest aside. This is your `LIMIT 3`.
4. **Retrieve the Next Page (OFFSET)**: If a client asks to see the next batch, you skip the first 3 folders (`OFFSET 3`) and take the next 3 folders (folders 4, 5, and 6) from the pile.

By organizing the folders this way, you can easily paginate through large stacks of records.

---

## The Table We're Working With

We will query a `products` table containing software catalog details:

| product_id | name | category | price | stock | launch_date | rating |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | CRM Pro | Software | 15000.00 | 45 | 2022-03-15 | 4.5 |
| 2 | Analytics Pro | Software | 8500.00 | 120 | 2021-07-20 | 4.8 |
| 3 | Data Vault | Software | 22000.00 | 15 | 2023-11-01 | *NULL* |
| 4 | Dashboard Kit | Add-on | 4500.00 | 250 | 2022-10-18 | 4.2 |
| 5 | Report Builder | Add-on | 79.99 | 1500 | 2024-01-05 | 3.9 |
| 6 | CRM Pro Lite | Software | 3000.00 | 0 | 2024-03-01 | 4.0 |
| 7 | Analytics Hub | Add-on | 18000.00 | 8 | 2023-05-12 | 4.7 |

---

## Sorting Mechanics

The `ORDER BY` clause sorts your query results. It executes near the very end of the logical execution sequence (after grouping and filtering).

### 1. Sorting Types:
*   **Numbers**: Sorted by numeric value.
*   **Strings**: Sorted alphabetically (collations determine case sensitivity).
*   **Dates**: Sorted chronologically (earliest to latest for `ASC`, latest to earliest for `DESC`).

### 2. Multi-Column Sorting
You can sort by multiple columns by separating them with commas. The database engine sorts by the first column first. If there are duplicate values (ties) in that column, it uses the second column to resolve the tie.

```sql
SELECT name, category, price
FROM products
ORDER BY category ASC, price DESC;
```

```text
# Output:
name           | category | price
---------------|----------|----------
Analytics Hub  | Add-on   | 18000.00   -- 'Add-on' group sorted highest price first
Dashboard Kit  | Add-on   | 4500.00
Report Builder | Add-on   | 79.99
Data Vault     | Software | 22000.00   -- 'Software' group sorted highest price first
CRM Pro        | Software | 15000.00
Analytics Pro  | Software | 8500.00
CRM Pro Lite   | Software | 3000.00
(7 rows)
```

---

## Sorting NULL Values

Since `NULL` represents an unknown value, it does not have a natural place in a sorted list. Different database engines handle NULL sorting differently.

### Default Database Behaviors:
*   **PostgreSQL & Oracle**: Treat `NULL` as the largest possible value.
    *   `ASC`: NULLs appear **last**.
    *   `DESC`: NULLs appear **first**.
*   **MySQL & SQL Server**: Treat `NULL` as the smallest possible value.
    *   `ASC`: NULLs appear **first**.
    *   `DESC`: NULLs appear **last**.

### Controlling NULL Placement:
To make your query behavior consistent across different database engines, you can use the `NULLS FIRST` or `NULLS LAST` modifiers at the end of the `ORDER BY` clause:

```sql
SELECT name, rating
FROM products
ORDER BY rating ASC NULLS LAST;   -- Forces NULLs to the bottom regardless of database
```

> [!NOTE]
> MySQL and SQL Server do not natively support `NULLS LAST`. To achieve this behavior in those engines, you can use a `CASE` statement to assign a sorting weight to NULL values:
> `ORDER BY CASE WHEN rating IS NULL THEN 1 ELSE 0 END, rating ASC`

---

## Pagination with LIMIT and OFFSET

Pagination is the process of splitting a large dataset into smaller, readable pages. This is done using the `LIMIT` and `OFFSET` clauses.

*   **`LIMIT`**: Specifies the maximum number of rows to return.
*   **`OFFSET`**: Specifies the number of rows to skip before returning the remaining rows.

```text
  [ Raw Sorted Data: Row 1 to Row 30 ]
  +---------------------------------------+
  | Page 1: LIMIT 10 OFFSET 0             | -> Returns Rows 1-10
  +---------------------------------------+
  | Page 2: LIMIT 10 OFFSET 10            | -> Skip first 10, Returns Rows 11-20
  +---------------------------------------+
  | Page 3: LIMIT 10 OFFSET 20            | -> Skip first 20, Returns Rows 21-30
  +---------------------------------------+
```

### The Performance Cost of Large Offsets
While `OFFSET` is easy to implement, it is highly inefficient for large datasets.

If you write a query with a large offset:
```sql
SELECT name, price 
FROM products 
ORDER BY price ASC 
LIMIT 10 OFFSET 1000000;
```

**How the database processes this**:
The database engine cannot simply skip the first 1,000,000 rows. It must read all 1,000,000 rows from disk, bring them into memory, sort them, and then count through them before returning rows 1,000,001 through 1,000,010. The first 1,000,000 sorted rows are then discarded. 

As the offset number grows, this query consumes more memory and disk I/O, causing performance to degrade.

#### The Alternative: Keyset Pagination (The Seek Method)
Instead of skipping rows using `OFFSET`, remember the last item seen on the previous page and filter on it using the `WHERE` clause:

```sql
-- Page 1:
SELECT product_id, name, price
FROM products
ORDER BY price ASC, product_id ASC
LIMIT 10;
-- Let's say the last item returned had price = 120.00 and product_id = 452.

-- Page 2 (Instead of OFFSET 10):
SELECT product_id, name, price
FROM products
WHERE (price > 120.00) OR (price = 120.00 AND product_id > 452)
ORDER BY price ASC, product_id ASC
LIMIT 10;
```
This approach is much faster because the database engine can use an index to quickly jump to the start of the next page, without reading any of the preceding rows.

---

## Code Walkthroughs

### Example 1: Multi-Column and Directional Sorting
**Business Scenario**: The Product team wants to evaluate their inventory. They want a list of all products sorted by **category in alphabetical order**, and then by **price from highest to lowest** for products within the same category.

```sql
SELECT 
    name,
    category,
    price,
    stock
FROM products
ORDER BY 
    category ASC,                      -- Primary sort: Category A-Z
    price DESC;                        -- Secondary sort: Price highest to lowest
```

```text
# Output:
name           | category | price    | stock
---------------|----------|----------|------
Analytics Hub  | Add-on   | 18000.00 | 8
Dashboard Kit  | Add-on   | 4500.00  | 250
Report Builder | Add-on   | 79.99    | 1500
Data Vault     | Software | 22000.00 | 15
CRM Pro        | Software | 15000.00 | 45
Analytics Pro  | Software | 8500.00  | 120
CRM Pro Lite   | Software | 3000.00  | 0
(7 rows)
```

---

### Example 2: Sorting NULLs consistently
**Business Scenario**: The Quality Assurance team needs a report showing product ratings. They want to see products sorted by **rating from lowest to highest**, but they want to make sure any products that have not yet been rated (`NULL`) are placed at the bottom of the report.

```sql
SELECT 
    name,
    rating,
    price
FROM products
ORDER BY rating ASC NULLS LAST;        -- Sort lowest rating first, push NULLs to the end
```

```text
# Output:
name          | rating | price
--------------|--------|----------
Report Builder| 3.9    | 79.99
CRM Pro Lite  | 4.0    | 3000.00
Dashboard Kit | 4.2    | 4500.00
CRM Pro       | 4.5    | 15000.00
Analytics Hub | 4.7    | 18000.00
Analytics Pro | 4.8    | 8500.00
Data Vault    | NULL   | 22000.00   -- Pushed to the bottom
(7 rows)
```

---

### Example 3: Paginated Reports
**Business Scenario**: The Web Development team is building a catalog interface. The site displays 3 products per page. Write the queries to load **Page 1** and **Page 2** of the catalog, sorting products by price from lowest to highest.

```sql
-- Query for Page 1:
SELECT name, price, stock
FROM products
ORDER BY price ASC
LIMIT 3 OFFSET 0;                      -- Returns the first 3 cheapest products
```

```text
# Output:
name           | price    | stock
---------------|----------|------
Report Builder | 79.99    | 1500
CRM Pro Lite   | 3000.00  | 0
Dashboard Kit  | 4500.00  | 250
(3 rows)
```

```sql
-- Query for Page 2:
SELECT name, price, stock
FROM products
ORDER BY price ASC
LIMIT 3 OFFSET 3;                      -- Skips the first 3 products, returns the next 3
```

```text
# Output:
name          | price    | stock
--------------|----------|------
Analytics Pro | 8500.00  | 120
CRM Pro       | 15000.00 | 45
Analytics Hub | 18000.00 | 8
(3 rows)
```

---

## Edge Cases & Common Mistakes

### 1. Sorting Without ORDER BY
Without an `ORDER BY` clause, the order in which rows are returned is non-deterministic. If your application relies on a consistent row order (such as showing the newest updates first), you must include an `ORDER BY` clause. Otherwise, the database engine may return rows in a different order depending on internal server conditions.

### 2. Ordering by Positional Numbers
Some developers use positional numbers to sort by columns in the `SELECT` list:

```sql
-- ❌ AVOID THIS IN PRODUCTION:
SELECT name, category, price
FROM products
ORDER BY 2 ASC, 3 DESC;                -- Sorts by category (column 2) then price (column 3)
```

*Why it is an anti-pattern*: If you or another developer updates the query later to select different columns (e.g. `SELECT name, stock, category, price`), the positional numbers `2` and `3` will now point to different columns (`stock` and `category`), breaking the sorting logic.
*Best Practice*: Always write out the actual column names in the `ORDER BY` clause.

### 3. Pagination Drift
If new rows are added or existing rows are deleted from the database while a user is navigating through pages of results, the pages can drift. The user may see duplicate items on Page 2 that they already saw on Page 1, or some items may be skipped entirely. Keyset pagination solves this issue.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Finding Top Out-of-Stock Products
**Scenario**: You are an Inventory Management Analyst. The warehouse team needs to restock high-value inventory. Write a query to find the **top 2 most expensive products** in the `products` table that have **fewer than 15 items in stock**. 

Sort the results by price in descending order.

*   **Target Table**: `products`
*   **Expected Output**:
    ```text
    name          | price    | stock
    --------------|----------|------
    Data Vault    | 22000.00 | 15
    Analytics Hub | 18000.00 | 8
    ```

**Answer & Logic Walkthrough**:
```sql
SELECT 
    name,
    price,
    stock
FROM products
WHERE stock <= 15
ORDER BY price DESC
LIMIT 2;
```
1.  `WHERE stock <= 15` filters out products with high stock levels, keeping Data Vault (15), CRM Pro Lite (0), and Analytics Hub (8).
2.  `ORDER BY price DESC` sorts these three products by price from highest to lowest: Data Vault ($22,000), Analytics Hub ($18,000), and CRM Pro Lite ($3,000).
3.  `LIMIT 2` discards CRM Pro Lite, returning the top two items.

---

### Exercise 2: Sorting and Isolating High-Value Assets
**Scenario**: Finance needs a list of the **3rd and 4th most expensive products** in the catalog. Write a query to retrieve the product name, category, and price for these items.

*   **Target Table**: `products`
*   **Expected Output**:
    ```text
    name    | category | price
    --------|----------|----------
    CRM Pro | Software | 15000.00
    Analytics Pro| Software | 8500.00
    ```

**Answer & Logic Walkthrough**:
```sql
SELECT 
    name,
    category,
    price
FROM products
ORDER BY price DESC
LIMIT 2 OFFSET 2;
```
1.  `ORDER BY price DESC` sorts all products by price from highest to lowest.
2.  `OFFSET 2` skips the two most expensive products (Data Vault at $22,000 and Analytics Hub at $18,000).
3.  `LIMIT 2` returns the next two products (CRM Pro at $15,000 and Analytics Pro at $8,500).

---

## Section Recaps

*   **Non-Deterministic Sorting**: Without an explicit `ORDER BY` clause, the order of query results is not guaranteed.
*   **Multi-Column Sorting**: Separate column names with commas to sort by multiple criteria. The database engine resolves ties in the first column by sorting on the second.
*   **NULL Sorting Behavior**: Database engines handle NULL sorting differently by default. Use `NULLS FIRST` or `NULLS LAST` to ensure consistent behavior across platforms.
*   **Large Offset Overhead**: Using large `OFFSET` values degrades performance because the database engine must read and sort all skipped rows before returning the results.

---

## Common Interview Questions

### Q1: What happens to the order of query results if you omit the ORDER BY clause?
**Answer:** Without an `ORDER BY` clause, the order of query results is non-deterministic. The database engine will return rows in whatever sequence is fastest for it to read from disk, which depends on factors like table size, indexes, and execution plans. The order of the results can change between runs, especially when data is updated.

### Q2: How do different SQL database engines sort NULL values by default, and how can you standardize this behavior?
**Answer:** Default NULL sorting behavior varies by engine:
*   **PostgreSQL & Oracle** treat NULL as the largest value, placing them last in ascending order and first in descending order.
*   **MySQL & SQL Server** treat NULL as the smallest value, placing them first in ascending order and last in descending order.

To standardize this behavior across engines, use the `NULLS FIRST` or `NULLS LAST` modifiers in the `ORDER BY` clause (e.g., `ORDER BY rating DESC NULLS LAST`). For databases that do not support this syntax (like MySQL), use a `CASE` statement to assign a sorting weight to NULL values.

### Q3: What is the performance cost of using a query with a large OFFSET (e.g. LIMIT 10 OFFSET 100000)?
**Answer:** A query with a large offset is slow because the database engine must read, sort, and process all of the skipped rows (in this case, 100,000 rows) before it can return the requested rows. Once the engine reaches the offset limit, the skipped rows are discarded. This consumes CPU, memory, and disk I/O, causing performance to degrade as the offset size increases.

### Q4: What is Keyset Pagination (the Seek Method), and how does it improve query performance compared to OFFSET pagination?
**Answer:** Keyset pagination is a method of retrieving pages of data by filtering on the last-seen value of the sorting key from the previous page (e.g., `WHERE price > 120.00 ORDER BY price LIMIT 10`). This is much faster than using `OFFSET` because the database engine can use an index to quickly jump to the start of the next page without reading or sorting any of the preceding rows.

### Q5: Why is ordering by positional column numbers (e.g., `ORDER BY 1, 2`) considered an anti-pattern in production code?
**Answer:** Ordering by positional numbers is fragile because it depends on the exact sequence of columns listed in the `SELECT` clause. If a developer updates the query later to select different columns or change their order, the numbers in the `ORDER BY` clause will point to different columns, changing the sorting behavior. Writing out the actual column names in the `ORDER BY` clause prevents this issue and makes the query more readable.
