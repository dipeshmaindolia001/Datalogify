---
title: "Views & Temp Tables — Organize Complex Queries"
description: "Create views and temp tables to simplify complex analytics, improve reusability, and build data layers."
category: "sql"
order: 108
phase: 2
tags: ["sql", "views", "temp-tables", "materialized-views"]
publishedDate: 2025-03-08
prevSlug: "union-intersect"
nextSlug: "query-optimization"
seoTitle: "SQL Views and Temp Tables Tutorial | Datalogify"
seoDescription: "Master SQL views, temp tables, materialized views, and table variables for organized analytics."
---

## Why This Matters

Imagine you are running a massive warehouse:
* **A Regular View is like a Virtual Window cut into the warehouse wall.** 
  You can look through this window at any time to see the inventory. The window itself does not store any boxes; it is just a fixed viewpoint. If a worker moves boxes inside, what you see through the window changes immediately. Every time you look, you are looking at the live warehouse floor.
* **A Temporary Table is like a temporary cardboard storage box assembled on the warehouse floor.**
  You go into the warehouse, grab specific items, throw them in this cardboard box, and use them for your current task. When you are done and walk out, the box is thrown away. This box *does* physically store data, and you can organize items inside it (by labeling or sorting them) to make finding them faster.
* **A Materialized View is like a physical photo taken of the warehouse floor through that window.**
  It is incredibly fast to look at the photo rather than walking into the warehouse to count boxes. However, if new inventory arrives, the photo becomes out-of-date (stale). You must physically take a new photo (refresh it) to see the changes.

In SQL, as your logic grows to hundreds of lines with multiple joins and aggregations, you must decide how to package and optimize it. Regular Views, Materialized Views, Temporary Tables, and Common Table Expressions (CTEs) are the core tools you will use. Choosing the wrong one can lead to sluggish dashboards, stale reports, or database memory crashes.

---

## Step-by-Step Concept Breakdown

### 1. Regular Views (`CREATE VIEW`)
A regular view is a **virtual table**. It is simply a saved SELECT query definition stored in the database's system catalog. 

```sql
CREATE VIEW active_users_view AS
SELECT user_id, email, last_login
FROM users
WHERE status = 'Active';
```
When you run `SELECT * FROM active_users_view`, the database engine does not query a physical table called `active_users_view`. Instead, it retrieves the saved query text, merges it with your outer query, and executes the combined query on the underlying table `users` on the fly.

#### Why Use Views?
* **Security & Column Masking**: You can grant users access to a view that excludes sensitive columns (like salaries or passwords) without granting them access to the main tables.
* **Simplification**: Instead of writing a 10-table join every morning, you can query a view that does the joins for you.
* **Consistency**: It ensures all analysts query the same definition of "Active Customer" or "Net Revenue".

---

### 2. Materialized Views (`CREATE MATERIALIZED VIEW`)
Unlike a regular view, a materialized view **stores the query results physically on disk**, just like a real table.

```sql
CREATE MATERIALIZED VIEW monthly_sales_summary AS
SELECT product_id, SUM(amount) AS total_revenue
FROM orders
GROUP BY product_id;
```
When you query `monthly_sales_summary`, the database reads the pre-computed results directly from the disk. This results in sub-second query times, even if the underlying table has billions of rows.

#### The Trade-off: Stale Data
Because the results are stored physically, they do not update automatically when the underlying tables change. You must refresh the view:
```sql
REFRESH MATERIALIZED VIEW monthly_sales_summary;
```
During a refresh, the database re-runs the query and updates the stored table. This can be scheduled to run hourly, daily, or triggered by database events.

---

### 3. Temporary Tables (`CREATE TEMP TABLE`)
A temporary table is a physical table that exists only for the duration of your current database session (connection). 

```sql
-- PostgreSQL Syntax:
CREATE TEMP TABLE temp_active_customers AS
SELECT customer_id, name 
FROM customers 
WHERE signup_date >= '2024-01-01';
```
* **Lifecycle**: As soon as you close your SQL client or your connection terminates, the temporary table is automatically dropped.
* **Scoping**: It is completely private. Other analysts logged into the same database cannot see or query your temporary table, preventing name collisions.
* **Performance Control**: Because a temporary table is a physical table, you can create indexes on its columns to speed up subsequent queries in a multi-step data processing pipeline.

---

## Matrix Comparison: CTEs, Temp Tables, Views, and Materialized Views

| Feature | CTE (`WITH`) | Temporary Table | Regular View | Materialized View |
| :--- | :--- | :--- | :--- | :--- |
| **Is data physically stored?** | No (Stored in memory on execution) | Yes (In temp space/disk) | No (Saved query definition) | Yes (Cached on disk) |
| **Lifecycle** | Single query execution | Current session/connection | Persistent schema object | Persistent schema object |
| **Scope** | Local to the query | Private to session | Global to all database users | Global to all database users |
| **Can you create indexes?** | No | Yes | No | Yes (Index on materialized columns) |
| **Updates automatically?** | Yes (Evaluated on run) | No (Static snapshot) | Yes (Runs underlying query) | No (Requires manual/scheduled refresh) |
| **Primary Use Case** | Cleaning up query structure | Multi-step ETL pipelines | Reusable, secured logic layer | Heavy analytical caching |

---

## The Tables We're Working With

We will work with `employees`, `orders`, and `customers` to build our views and temp tables:

### The `employees` Table
```sql
-- | emp_id | name           | department  | salary | hire_date  | manager_id |
-- |--------|----------------|-------------|--------|------------|------------|
-- | 1      | Sarah Chen     | Analytics   | 95000  | 2022-01-15 | 5          |
-- | 2      | James Wilson   | Engineering | 115000 | 2020-06-01 | 5          |
-- | 3      | Priya Patel    | Analytics   | 88000  | 2023-03-10 | 1          |
-- | 4      | Marcus Brown   | Sales       | 72000  | 2023-05-20 | 6          |
-- | 5      | Lisa Zhang     | Engineering | 108000 | 2019-08-20 | NULL       |
-- | 6      | David Kim      | Sales       | 82000  | 2021-11-01 | 5          |
-- | 7      | Anna Kowalski  | Marketing   | 68000  | 2024-02-14 | 6          |
-- | 8      | Tom Rivera     | Marketing   | 78000  | 2023-08-05 | 6          |
```

### The `orders` Table
```sql
-- | order_id | customer_id | product       | amount | order_date | status    |
-- |----------|-------------|---------------|--------|------------|-----------|
-- | 1001     | 201         | CRM Pro       | 15000  | 2024-01-10 | completed |
-- | 1002     | 202         | Analytics Hub | 28000  | 2024-01-18 | completed |
-- | 1003     | 203         | Data Vault    | 8500   | 2024-02-05 | completed |
-- | 1004     | 201         | Analytics Hub | 28000  | 2024-02-22 | completed |
-- | 1005     | 204         | CRM Pro       | 15000  | 2024-03-01 | pending   |
-- | 1006     | 202         | CRM Pro       | 12500  | 2024-03-14 | completed |
-- | 1007     | 205         | Data Vault    | 8500   | 2024-04-02 | cancelled |
-- | 1008     | 203         | ML Studio     | 35000  | 2024-04-19 | completed |
```

### The `customers` Table
```sql
-- | customer_id | company_name     | industry    | region |
-- |-------------|------------------|-------------|--------|
-- | 201         | Acme Corp        | Technology  | East   |
-- | 202         | Horizon Logistics| Logistics   | West   |
-- | 203         | Global Finance   | Finance     | East   |
-- | 204         | Apex Health      | Healthcare  | South  |
-- | 205         | Summit Retail    | Retail      | North  |
```

---

## Code & Practical Walkthroughs

### Example 1: Creating a Reusable Sales View
Let's create a regular view called `completed_sales_details_view` that hides cancelled orders and joins the customer data automatically. 

```sql
CREATE OR REPLACE VIEW completed_sales_details_view AS
SELECT 
    o.order_id,
    o.product,
    o.amount,
    o.order_date,
    c.company_name,
    c.industry,
    c.region
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.status = 'completed';
```

Now, anyone on our team can query this view directly:
```sql
SELECT company_name, SUM(amount) AS total_spent
FROM completed_sales_details_view
GROUP BY company_name
ORDER BY total_spent DESC;
```

```text
# Output:
company_name      | total_spent
------------------+------------
Acme Corp         | 43000
Horizon Logistics | 40500
Global Finance    | 43500
```

---

### Example 2: Temporary Table Pipeline for High-Performance Segmentation
For a complex campaign audit, we want to isolate high-value technology orders, write them to a temp table, index them, and run a final comparison.

```sql
-- Step 1: Create the temp table with a subset of data
CREATE TEMP TABLE temp_tech_customers AS
SELECT 
    o.order_id,
    o.customer_id,
    c.company_name,
    o.amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE c.industry = 'Technology';

-- Step 2: Build an index on customer_id inside the temp table for fast joins
CREATE INDEX idx_temp_tech_cust ON temp_tech_customers(customer_id);

-- Step 3: Run queries against the temp table
SELECT 
    company_name, 
    SUM(amount) AS tech_spend
FROM temp_tech_customers
GROUP BY company_name;
```

```text
# Output:
company_name | tech_spend
-------------+-----------
Acme Corp    | 43000
```

---

### Example 3: Caching Dashboard Aggregations with a Materialized View
A dashboard requires a daily count of orders and revenue aggregated by region and industry. Running this on live transaction tables is slow, so we cache it in a materialized view.

```sql
CREATE MATERIALIZED VIEW mv_regional_sales_summary AS
SELECT 
    c.region,
    c.industry,
    COUNT(o.order_id) AS total_orders,
    SUM(o.amount) AS total_revenue
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
GROUP BY c.region, c.industry;
```

Querying this view is near-instant:
```sql
SELECT * FROM mv_regional_sales_summary WHERE region = 'East';
```

```text
# Output:
region | industry   | total_orders | total_revenue
-------+------------+--------------+--------------
East   | Technology | 2            | 43000
East   | Finance    | 2            | 43500
```

To refresh the snapshot overnight:
```sql
REFRESH MATERIALIZED VIEW mv_regional_sales_summary;
```

---

## Edge Cases & Common Mistakes (Gotchas)

### Gotcha 1: Schema Binding Errors
If you create a regular view that references columns in a table, and then you change or delete those columns in the table, the view will break.

```sql
-- Altering a column name breaks any view that references it
ALTER TABLE customers RENAME COLUMN company_name TO legal_name;

-- Now querying the view:
SELECT * FROM completed_sales_details_view;
-- Result: ERROR: attribute "company_name" of relation "customers" does not exist
```
* **Best Practice**: In SQL Server, you can use the `WITH SCHEMABINDING` option when creating a view. This prevents any table alterations that would break the view's definition.

---

### Gotcha 2: Temporary Table Name Collisions
Since temp tables are connection-locked, two different users can both run:
```sql
CREATE TEMP TABLE temp_report (id INT);
```
at the same time without conflicting. Under the hood, SQL prefixes the table name with a unique session identifier. 

However, if you are writing a script that creates a temp table, and you run that script twice in the **same window (session)**, it will fail:
```sql
-- Run 1: Table created
CREATE TEMP TABLE temp_report (id INT);

-- Run 2 (Same connection): 
CREATE TEMP TABLE temp_report (id INT);
-- Result: ERROR: relation "temp_report" already exists
```
* **Best Practice**: Always add a drop check at the top of your scripting procedures:
```sql
DROP TABLE IF EXISTS temp_report;
CREATE TEMP TABLE temp_report (id INT);
```

---

## Practice Exercises & Mini-Projects

### Exercise 1: Create a Secured Salary View
Create a view called `public_employee_directory` based on the `employees` table.
* The view should display the employee's name, department, hire date, and their manager's name.
* The view must **completely exclude** the `salary` column to protect payroll confidentiality.

<details>
<summary>View Solution</summary>

**SQL Query:**
```sql
CREATE OR REPLACE VIEW public_employee_directory AS
SELECT 
    e.name AS employee_name,
    e.department,
    e.hire_date,
    m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```
</details>

---

### Exercise 2: ETL Temp Table Pipeline
Write a script that:
1. Creates a temporary table named `temp_recent_orders` for completed orders placed after `2024-02-01`.
2. Adds a column `commission` to the temp table (calculated as 5% of order amount).
3. Queries the temp table to find the total commission generated per product.

<details>
<summary>View Solution</summary>

**SQL Script:**
```sql
-- Drop the table if it already exists in the current session
DROP TABLE IF EXISTS temp_recent_orders;

-- Create and populate the temp table
CREATE TEMP TABLE temp_recent_orders AS
SELECT 
    order_id,
    product,
    amount,
    amount * 0.05 AS commission
FROM orders
WHERE status = 'completed' AND order_date >= '2024-02-01';

-- Retrieve total commission per product
SELECT 
    product,
    SUM(commission) AS total_commission
FROM temp_recent_orders
GROUP BY product
ORDER BY total_commission DESC;
```
</details>

---

### Section Recaps

* **Views are virtual**: They do not store data. They save the SELECT query text and run it on the fly when referenced.
* **Materialized Views store data physically**: They cache the results for lightning-fast reads, but require manual refreshes (`REFRESH MATERIALIZED VIEW`) to update.
* **Temp Tables are session-bound**: They are physical tables written to temporary storage. They disappear when the connection ends and can be indexed.
* **CTEs are query-bound**: They are local variables inside a single query block, designed solely for code readability.

---

## Common Interview Questions

### Q1: What is the difference between a View and a Materialized View?
**Answer:** The core difference lies in physical storage and data freshness:
* A **View** is virtual; it stores only the query definition. Every time you query the view, the database executes the underlying query on the source tables. Data is always 100% up-to-date.
* A **Materialized View** is physical; it executes the query once and saves the result table to disk. Querying it is incredibly fast, but the data is static and will become stale until you run a `REFRESH` operation.

### Q2: When would you use a Temporary Table instead of a CTE?
**Answer:** You should choose a temporary table over a CTE in the following scenarios:
1. **Reusability**: You need to refer to the subset of data multiple times across different queries in a script. (A CTE can only be used by the immediately following query).
2. **Performance on Large Sets**: The intermediate dataset has hundreds of thousands of rows. You can write the data to a temp table, create an index on the join keys, and speed up subsequent operations.
3. **Debugging**: You want to split a complex query into steps and verify the output of each step.

### Q3: What happens to a temporary table when your database connection drops or closes?
**Answer:** The database automatically drops the temporary table. It cleans up all the physical space used by the temp table in the system's temporary file storage.

<div class="interview-tip">
Mention that temp tables are private to the session that created them. If another analyst connects to the database, they cannot access your temp table, making it safe for parallel workflows.
</div>

### Q4: If an underlying table is updated, how do Views and Materialized Views reflect that change?
**Answer:** 
* A **View** will reflect the update immediately because it queries the source tables on the fly.
* A **Materialized View** will not reflect the update. It will continue returning the cached snapshot until a `REFRESH MATERIALIZED VIEW` command is executed.

### Q5: Can you index a View?
**Answer:** You cannot index a standard regular view because it has no physical structure. However, you can create indexes on a **Materialized View** (in PostgreSQL) or an **Indexed View** (in SQL Server) because they store their result sets physically on disk.
