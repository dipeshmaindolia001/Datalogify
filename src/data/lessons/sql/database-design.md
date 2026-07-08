---
title: "Database Design & Normalization"
description: "Understand how databases are structured — normalization, primary/foreign keys, and schema design principles."
category: "sql"
order: 110
phase: 2
tags: ["sql", "database-design", "normalization", "schema", "keys"]
publishedDate: 2025-03-10
prevSlug: "query-optimization"
nextSlug: ""
seoTitle: "Database Design & Normalization Tutorial | Datalogify"
seoDescription: "Learn database design — normalization forms (1NF-3NF), primary/foreign keys, ERD, and schema best practices."
---

## Why This Matters

Imagine you are running a library and tracking all book loans in a single, massive Excel spreadsheet:
* Every time a student borrows a book, you write down their name, phone number, email, the book title, the author, the publisher, the checkout date, and the return date in a new row.
* If "Sarah Chen" checks out 20 books this semester, you type her phone number and email 20 times. 
* If Sarah changes her email address, you must manually find and update all 20 rows. If you miss one, you now have inconsistent data.
* If a student returns their only book and you delete that row, you lose all record of their email and phone number entirely.

This is the nightmare of **unnormalized data**. 

Database design is the art of breaking a messy, flat spreadsheet into a series of neat, interconnected **card decks** (tables) where information is written in exactly **one place**. In this lesson, you will learn the rules of normalization (1NF, 2NF, and 3NF), how to establish relationships using keys, and how to choose between the **Star** and **Snowflake** schemas for analytical data warehouses.

---

## Step-by-Step Concept Breakdown

```text
Visual Analogy:
[Messy, Flat Spreadsheet]
  |
  +---> Normalization (1NF, 2NF, 3NF)
  |
  +---> [Table A: Customers] <---+ (linked by Foreign Keys)
  +---> [Table B: Books]     |<--+
  +---> [Table C: Loans] ----+
```

### 1. Database Normalization (1NF, 2NF, 3NF)
Normalization is a systematic process of organizing tables to eliminate data redundancy (duplication) and prevent update, deletion, and insertion anomalies.

#### First Normal Form (1NF) — Atomicity
For a table to be in 1NF, it must satisfy three criteria:
1. **Atomic Values**: Each cell must contain a single, indivisible value. No arrays, lists, or comma-separated values.
2. **Unique Rows**: A primary key must be defined to identify each row uniquely.
3. **No Repeating Groups**: You cannot have columns like `phone_1`, `phone_2`, `phone_3` to store multiple values of the same attribute.

*Example violation of 1NF*:
```text
| customer_id | name       | phone_numbers          |
|-------------|------------|------------------------|
| 101         | Sarah Chen | 555-0101, 555-0199     | <-- Fails 1NF (Not atomic)
```

#### Second Normal Form (2NF) — No Partial Dependencies
To reach 2NF:
1. The table must be in **1NF**.
2. All non-key attributes must depend on the **entire primary key**. This only applies when your table has a **composite primary key** (a key made of multiple columns). If your primary key is a single column, the table is automatically in 2NF.

*Example violation of 2NF*:
Suppose you have a composite primary key `(order_id, product_id)`:
```text
| order_id (PK) | product_id (PK) | product_name   | quantity |
|---------------|-----------------|----------------|----------|
| 1001          | 50              | CRM Pro        | 2        |
```
* The column `quantity` depends on BOTH the order and the product (valid).
* The column `product_name` depends **only** on the `product_id`. It has nothing to do with the `order_id`. This is a **partial dependency** and fails 2NF. 

#### Third Normal Form (3NF) — No Transitive Dependencies
To reach 3NF:
1. The table must be in **2NF**.
2. There must be **no transitive dependencies**. A transitive dependency occurs when a non-key column depends on another non-key column, which then depends on the primary key.

In the words of database pioneer Bill Kent, every column must depend on **"the key, the whole key, and nothing but the key, so help me Codd."**

*Example violation of 3NF*:
```text
| order_id (PK) | customer_id | customer_email     |
|---------------|-------------|--------------------|
| 1001          | 201         | sarah@acme.com     |
```
* `customer_id` depends on the primary key `order_id` (valid).
* `customer_email` depends on the `customer_id` (a non-key column). Because `customer_email` depends on `customer_id` which depends on `order_id`, it is a transitive dependency. This fails 3NF.

---

### 2. Primary Keys, Foreign Keys & Referential Integrity
Relationships are the glue of relational databases:
* **Primary Key (PK)**: A column (or set of columns) that uniquely identifies each row in a table. It cannot contain NULL values, and its values must be unique.
* **Foreign Key (FK)**: A column in one table that references the Primary Key of another table. It is used to enforce relationships.

#### Referential Integrity Actions
When a row in a parent table is deleted or updated, what happens to the child rows referencing it? You define this using referential constraints:
* **ON DELETE CASCADE**: If a customer is deleted, automatically delete all of their orders.
* **ON DELETE RESTRICT / NO ACTION**: Block the deletion of the customer if they have existing orders. (This is the default safety check).
* **ON DELETE SET NULL**: If a manager is deleted from the employees table, set the `manager_id` of their direct reports to NULL.

---

### 3. Star Schema vs. Snowflake Schema (Dimensional Modeling)
In data warehousing and business intelligence, normalization rules are intentionally relaxed (denormalized) to prioritize **read speed** over insert efficiency. This is called dimensional modeling.

```text
STAR SCHEMA:
     [ Dim_Customer ]
           \
            \
  [ Dim_Date ] - [ Fact_Sales ] - [ Dim_Product ]
            /
           /
     [ Dim_Store ]
```

#### Star Schema
* **Structure**: A single, central **Fact table** (containing measurable, quantitative metrics like `revenue`, `quantity`, `dates`) surrounded by denormalized **Dimension tables** (containing descriptive attributes like customer names, product categories).
* **Joins**: Requires few joins. Queries are very simple to write and execute fast.
* **Redundancy**: Higher. Dimension tables are denormalized, meaning a product's category name might be repeated across rows in `dim_product`.

#### Snowflake Schema
* **Structure**: An extension of the Star Schema where **dimension tables are fully normalized** into secondary tables.
* **Joins**: Requires many joins (e.g. joining `Fact_Sales` to `Dim_Product` to `Dim_Category`).
* **Redundancy**: Minimal. Saves storage space but leads to slower query performance due to join overhead.

#### Star vs. Snowflake Comparison Matrix
| Attribute | Star Schema | Snowflake Schema |
| :--- | :--- | :--- |
| **Data Structure** | Denormalized Dimensions | Normalized Dimensions |
| **Query Complexity** | Low (Single-level Joins) | High (Multi-level Joins) |
| **Query Performance** | Fast | Slower (Join overhead) |
| **Storage Cost** | Higher | Lower (No redundancy) |
| **Maintenance** | Simple | Complex (More tables to manage) |

---

## Code & Practical Walkthroughs

### Example 1: Normalizing a Messy Invoice Worksheet
Imagine you are handed an unnormalized table tracking e-commerce invoice items:

```sql
-- Unnormalized Sheet:
-- | invoice_id | date       | customer_name | customer_address | item_id | item_name | price | qty |
-- |------------|------------|---------------|------------------|---------|-----------|-------|-----|
-- | 10001      | 2024-01-10 | Sarah Chen    | 123 Pine St      | 50      | CRM Pro   | 15000 | 1   |
-- | 10001      | 2024-01-10 | Sarah Chen    | 123 Pine St      | 51      | Backup    | 3200  | 2   |
```

Let's break this down into three normalized tables in **3NF**:

#### 1. Customers Table
```sql
CREATE TABLE customers (
    customer_id      SERIAL PRIMARY KEY,
    customer_name    VARCHAR(100) NOT NULL,
    customer_address VARCHAR(255) NOT NULL
);
```

#### 2. Products Table
```sql
CREATE TABLE products (
    product_id   INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    unit_price   NUMERIC(10, 2) NOT NULL
);
```

#### 3. Invoices Table
```sql
CREATE TABLE invoices (
    invoice_id   INT PRIMARY KEY,
    invoice_date DATE NOT NULL,
    customer_id  INT REFERENCES customers(customer_id) -- Foreign key
);
```

#### 4. Invoice Line Items Table
```sql
CREATE TABLE invoice_items (
    invoice_id INT REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity   INT NOT NULL,
    PRIMARY KEY (invoice_id, product_id) -- Composite Primary Key
);
```

---

### Example 2: Establishing Table Relationships with Cascade Options
We want to model a corporate hierarchy where employees report to managers and belong to departments. If a department is deleted, we want our employee rows to remain but set their department fields to NULL. If an employee is deleted, we want their compensation history records to be deleted automatically.

```sql
-- Create parent department table
CREATE TABLE departments (
    dept_id   SERIAL PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL
);

-- Create employee table
CREATE TABLE employees (
    emp_id        INT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    dept_id       INT REFERENCES departments(dept_id) ON DELETE SET NULL, -- Cascade Action 1
    manager_id    INT REFERENCES employees(emp_id) ON DELETE RESTRICT     -- Cascade Action 2
);

-- Create compensation history table (dependent child table)
CREATE TABLE salary_history (
    emp_id      INT REFERENCES employees(emp_id) ON DELETE CASCADE,      -- Cascade Action 3
    salary_date DATE NOT NULL,
    amount      NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (emp_id, salary_date)
);
```

---

### Example 3: Designing a Star Schema for a Retail Data Warehouse
Let's design a clean dimensional model (Star Schema) to support sales analytics queries.

#### 1. The central Fact Table
```sql
CREATE TABLE fact_sales (
    sales_key    SERIAL PRIMARY KEY,
    date_key     INT NOT NULL, -- Points to Dim_Date
    product_key  INT NOT NULL, -- Points to Dim_Product
    customer_key INT NOT NULL, -- Points to Dim_Customer
    store_key    INT NOT NULL, -- Points to Dim_Store
    quantity     INT NOT NULL,
    net_revenue  NUMERIC(12, 2) NOT NULL
);
```

#### 2. Dimension Tables
```sql
CREATE TABLE dim_product (
    product_key  INT PRIMARY KEY,
    product_name VARCHAR(100),
    category     VARCHAR(50), -- Denormalized directly into the table
    brand        VARCHAR(50)
);

CREATE TABLE dim_customer (
    customer_key INT PRIMARY KEY,
    customer_name VARCHAR(100),
    country      VARCHAR(50),
    segment      VARCHAR(50)
);
```

---

## Edge Cases & Common Mistakes (Gotchas)

### Gotcha 1: The Pitfall of Over-Normalization
In school, you are taught that 3NF is the gold standard. However, in analytical environments (OLAP databases like Snowflake or BigQuery), fully normalized tables are actually a **performance bottleneck**.
* Querying fully normalized schemas requires joining dozens of tables. Joins require shuffling data across database nodes, which is slow.
* **Modern Warehouse Best Practice**: Store data in a **denormalized** or **semi-denormalized** format (like a Star Schema or using nested JSON fields) to maximize read performance, even if it uses more disk storage.

---

### Gotcha 2: Foreign Key Indexing
A common database administration mistake is forgetting to index Foreign Key columns.
* While databases automatically build an index on the table's **Primary Key**, they **do not** automatically build indexes on **Foreign Key** columns.
* If you frequently join the `orders` table to the `customers` table on `customer_id`, you must manually index the foreign key:
```sql
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```
Without this, joins can degrade into slow Table Scans.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Identify Normalization Violations
Examine the following table schema tracking student course registrations:
`registrations(student_id, student_name, student_email, course_id, course_title, instructor_name, instructor_office)`
Assume the primary key is `(student_id, course_id)`.
1. What normal form does this table currently satisfy?
2. List the dependency violations and normalize this table into 3NF.

<details>
<summary>View Solution</summary>

**Explanation:**
1. The table is in **1NF** (assuming values are atomic). It fails **2NF** because there are partial dependencies. For instance, `student_name` and `student_email` depend only on `student_id`, not the composite key `(student_id, course_id)`. `course_title` depends only on `course_id`.

**Normalized 3NF Tables:**

* **students**: `(student_id [PK], student_name, student_email)`
* **courses**: `(course_id [PK], course_title, instructor_id [FK])`
* **instructors**: `(instructor_id [PK], instructor_name, instructor_office)`
* **registrations**: `(student_id [FK], course_id [FK])` -> (Composite Primary Key: `student_id, course_id`)
</details>

---

### Exercise 2: Cascade Action Strategy Design
You are building a blogging database with tables `users`, `posts`, and `comments`. 
1. If a user deletes their account, their blog posts should be preserved, but marked as written by a 'Deleted User'.
2. If a blog post is deleted, all comments associated with that post should be deleted immediately.
Write the SQL commands defining the relationships between these tables.

<details>
<summary>View Solution</summary>

**SQL Query:**
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    -- SET NULL preserves the posts but detaches the owner
    author_id INT REFERENCES users(user_id) ON DELETE SET NULL 
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE, -- CASCADE deletes comments
    comment_text TEXT NOT NULL
);
```
</details>

---

### Section Recaps

* **Normalization prevents anomalies**: It organizes data to eliminate redundancy and protect against insert, update, and delete errors.
* **1NF, 2NF, 3NF criteria**: 1NF requires atomic values and unique rows. 2NF removes partial dependencies. 3NF removes transitive dependencies.
* **Referential integrity**: Foreign Keys ensure child rows point to valid parent rows. Options include `CASCADE`, `RESTRICT`, and `SET NULL`.
* **Star vs. Snowflake Schema**: Star schema uses denormalized dimensions for simple, fast analytical queries. Snowflake schema normalizes dimensions to save storage space at the cost of join performance.

---

## Common Interview Questions

### Q1: What is the difference between 2NF and 3NF?
**Answer:** The core difference lies in the types of dependencies they address:
* To be in **2NF**, the table must have no **partial dependencies** (meaning no non-key column depends on only a part of a composite primary key).
* To be in **3NF**, the table must have no **transitive dependencies** (meaning no non-key column depends on another non-key column).

### Q2: What are update, insert, and deletion anomalies?
**Answer:** These are inconsistencies that occur in poorly structured databases:
* **Update Anomaly**: The same data is stored in multiple rows (e.g. a customer's address). If you update it in one place but not another, the data becomes inconsistent.
* **Insert Anomaly**: You cannot insert new data because it requires other, unrelated data that is not yet available (e.g. you cannot save a new customer because they haven't placed an order yet).
* **Deletion Anomaly**: Deleting a row destroys unrelated data that you wanted to save (e.g. deleting an order deletes the customer's profile entirely).

<div class="interview-tip">
Provide a short real-world scenario (like our library example) to illustrate anomalies. It demonstrates that you understand the practical consequences of bad database design.
</div>

### Q3: Under what circumstances would you choose a Star Schema over a Snowflake Schema?
**Answer:** A Star Schema is preferred for **analytical queries and data warehousing** (OLAP) because it minimizes joins and simplifies SQL queries for business intelligence analysts. It yields faster query performance because columns are pre-joined (denormalized) into dimension tables. A Snowflake Schema is preferred only when disk storage savings are paramount or when dimension logic is highly complex and must be normalized for maintenance.

### Q4: What is a Composite Primary Key, and when should you use one?
**Answer:** A Composite Primary Key is a primary key that consists of two or more columns. You use one in junction tables (also called link tables or bridge tables) that represent many-to-many relationships. For example, in an `invoice_items` table, the combination of `invoice_id` and `product_id` uniquely identifies a row.

### Q5: What does "ON DELETE CASCADE" do, and when is it dangerous?
**Answer:** `ON DELETE CASCADE` is a referential constraint. If a row in the parent table is deleted, the database automatically deletes all referencing rows in the child table. It is dangerous because deleting a single parent row (like a user account) can trigger a chain reaction that deletes millions of child records (like all posts, logs, and comments ever created by that user) without any warning.
