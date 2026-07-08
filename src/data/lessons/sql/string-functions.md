---
title: "SQL String Functions — Text Processing"
description: "Manipulate, extract, and clean text data in SQL — CONCAT, SUBSTRING, TRIM, REPLACE, and pattern matching."
category: "sql"
order: 104
phase: 2
tags: ["sql", "string-functions", "text", "concat", "substring"]
publishedDate: 2025-03-04
prevSlug: "window-functions-lag-lead"
nextSlug: "date-functions"
seoTitle: "SQL String Functions Tutorial | Datalogify"
seoDescription: "Master SQL string functions — CONCAT, SUBSTRING, TRIM, REPLACE, UPPER, LOWER, LIKE patterns."
---

## Why This Matters

Real-world data is messy. Names are in mixed case. Addresses have trailing spaces. Phone numbers come in five formats. Emails need domain extraction. If you can't clean and parse text in SQL, you'll spend hours exporting to Excel or Python for what should be a 3-line query.

## The Tables We're Working With

```sql
-- customers table
-- | cust_id | full_name       | email                  | phone          | address                    |
-- |---------|-----------------|------------------------|----------------|----------------------------|
-- | 1001    | Sarah Chen      | sarah.chen@gmail.com   | (555) 123-4567 | 123 Oak St, Portland, OR   |
-- | 1002    | JAMES WILSON    | JAMES@COMPANY.COM      | 555.234.5678   | 456 Elm Ave, Seattle, WA   |
-- | 1003    |  priya patel    | priya_p@yahoo.com      | 5553456789     |  789 Pine Rd, Denver, CO   |
-- | 1004    | Mike  Johnson   | mike.j@outlook.com     | (555) 456-7890 | 321 Maple Dr, Austin, TX   |
-- | 1005    | lisa park       | LISA.PARK@WORK.ORG     | 555-567-8901   | 654 Cedar Ln, Miami, FL    |
-- | 1006    | David Kim Jr.   | d.kim@email.co.uk      | 555 678 9012   | 987 Birch Ct, Boston, MA   |

-- products table
-- | product_id | sku           | product_name                      |
-- |------------|---------------|-----------------------------------|
-- | 1          | CRM-PRO-2024  | CRM Pro - Enterprise Edition      |
-- | 2          | AH-BASIC-2024 | Analytics Hub (Basic)             |
-- | 3          | DV-STD-2024   | Data Vault: Standard License      |
-- | 4          | CRM-PRO-2025  | CRM Pro - Enterprise Edition v2   |
```

## CONCAT — Joining Strings Together

```sql
-- Standard SQL: CONCAT()
SELECT CONCAT(full_name, ' <', email, '>') AS formatted
FROM customers;

-- PostgreSQL also supports ||
SELECT full_name || ' <' || email || '>' AS formatted
FROM customers;
```

```text
formatted
-----------------------------------
Sarah Chen <sarah.chen@gmail.com>
JAMES WILSON <JAMES@COMPANY.COM>
 priya patel <priya_p@yahoo.com>
Mike  Johnson <mike.j@outlook.com>
lisa park <LISA.PARK@WORK.ORG>
David Kim Jr. <d.kim@email.co.uk>
```

**CONCAT_WS** (concat with separator) is cleaner for multiple fields:

```sql
-- CONCAT_WS = concat with separator
SELECT CONCAT_WS(' | ', cust_id, full_name, email) AS record
FROM customers;
```

```text
record
----------------------------------------------
1001 | Sarah Chen | sarah.chen@gmail.com
1002 | JAMES WILSON | JAMES@COMPANY.COM
1003 |  priya patel | priya_p@yahoo.com
```

## UPPER() and LOWER() — Case Conversion

```sql
SELECT full_name,
       UPPER(full_name) AS upper_name,
       LOWER(full_name) AS lower_name
FROM customers;
```

```text
full_name      | upper_name     | lower_name
---------------|----------------|---------------
Sarah Chen     | SARAH CHEN     | sarah chen
JAMES WILSON   | JAMES WILSON   | james wilson
 priya patel   |  PRIYA PATEL   |  priya patel
```

### Case-Insensitive Matching

```sql
-- Don't do this (misses mixed case):
SELECT * FROM customers WHERE full_name = 'james wilson';

-- Do this instead:
SELECT * FROM customers WHERE LOWER(full_name) = 'james wilson';
-- Or:
SELECT * FROM customers WHERE UPPER(full_name) = 'JAMES WILSON';
```

<div class="interview-tip">

**Performance Warning**: Using LOWER() or UPPER() in WHERE clauses prevents index usage. In production, consider a computed column or function-based index: `CREATE INDEX idx_name_lower ON customers(LOWER(full_name))` (PostgreSQL supports this).

</div>

## TRIM, LTRIM, RTRIM — Remove Whitespace

```sql
SELECT full_name,
       LENGTH(full_name) AS original_len,
       TRIM(full_name) AS trimmed,
       LENGTH(TRIM(full_name)) AS trimmed_len
FROM customers;
```

```text
full_name      | original_len | trimmed        | trimmed_len
---------------|--------------|----------------|------------
Sarah Chen     | 10           | Sarah Chen     | 10
JAMES WILSON   | 12           | JAMES WILSON   | 12
 priya patel   | 13           | priya patel    | 11
Mike  Johnson  | 14           | Mike  Johnson  | 13
```

Notice " priya patel" had a leading space — TRIM removed it. But "Mike  Johnson" still has a double space inside — TRIM only handles the edges.

```sql
-- LTRIM: left side only, RTRIM: right side only
SELECT LTRIM('  hello  ') AS left_trimmed,
       RTRIM('  hello  ') AS right_trimmed,
       TRIM('  hello  ')  AS both_trimmed;
```

```text
left_trimmed | right_trimmed | both_trimmed
-------------|---------------|------------
hello        |   hello       | hello
```

### Cleaning Internal Double Spaces

```sql
-- Replace double spaces with single
SELECT REPLACE(full_name, '  ', ' ') AS clean_name
FROM customers
WHERE full_name LIKE '%  %';
```

```text
clean_name
-----------
Mike Johnson
```

## SUBSTRING — Extract Parts of a String

```sql
-- SUBSTRING(string, start_position, length)
-- Positions are 1-indexed

SELECT email,
       SUBSTRING(email, 1, POSITION('@' IN email) - 1) AS username,
       SUBSTRING(email, POSITION('@' IN email) + 1) AS domain
FROM customers;
```

```text
email                  | username   | domain
-----------------------|------------|---------------
sarah.chen@gmail.com   | sarah.chen | gmail.com
JAMES@COMPANY.COM      | JAMES      | COMPANY.COM
priya_p@yahoo.com      | priya_p    | yahoo.com
mike.j@outlook.com     | mike.j     | outlook.com
LISA.PARK@WORK.ORG     | LISA.PARK  | WORK.ORG
d.kim@email.co.uk      | d.kim      | email.co.uk
```

### LEFT() and RIGHT()

```sql
SELECT sku,
       LEFT(sku, POSITION('-' IN sku) - 1) AS product_code,
       RIGHT(sku, 4) AS year_code
FROM products;
```

```text
sku           | product_code | year_code
--------------|--------------|----------
CRM-PRO-2024  | CRM          | 2024
AH-BASIC-2024 | AH           | 2024
DV-STD-2024   | DV           | 2024
CRM-PRO-2025  | CRM          | 2025
```

## POSITION / CHARINDEX — Find a Character's Location

```sql
-- PostgreSQL/MySQL: POSITION(substring IN string)
SELECT email,
       POSITION('@' IN email) AS at_position
FROM customers;

-- SQL Server: CHARINDEX(substring, string)
-- SELECT email, CHARINDEX('@', email) AS at_position FROM customers;
```

```text
email                  | at_position
-----------------------|------------
sarah.chen@gmail.com   | 11
JAMES@COMPANY.COM      | 6
priya_p@yahoo.com      | 8
mike.j@outlook.com     | 7
LISA.PARK@WORK.ORG     | 10
d.kim@email.co.uk      | 6
```

## REPLACE — Swap Text

```sql
-- Standardize phone numbers: strip all non-digits
-- Step by step approach:
SELECT phone,
       REPLACE(
           REPLACE(
               REPLACE(
                   REPLACE(phone, '(', ''),
               ')', ''),
           '-', ''),
       ' ', '') AS digits_only
FROM customers;
```

```text
phone          | digits_only
---------------|------------
(555) 123-4567 | 5551234567
555.234.5678   | 555.234.5678
5553456789     | 5553456789
(555) 456-7890 | 5554567890
555-567-8901   | 5555678901
555 678 9012   | 5556789012
```

Notice dots weren't removed — you'd need another REPLACE. For complex cleaning, REGEXP_REPLACE is better.

```sql
-- PostgreSQL: REGEXP_REPLACE strips all non-digits in one shot
SELECT phone,
       REGEXP_REPLACE(phone, '[^0-9]', '', 'g') AS digits_only
FROM customers;
```

```text
phone          | digits_only
---------------|------------
(555) 123-4567 | 5551234567
555.234.5678   | 5552345678
5553456789     | 5553456789
(555) 456-7890 | 5554567890
555-567-8901   | 5555678901
555 678 9012   | 5556789012
```

## LENGTH / LEN — String Size

```sql
SELECT full_name,
       LENGTH(full_name) AS char_count,
       LENGTH(TRIM(full_name)) AS trimmed_count
FROM customers;

-- SQL Server uses LEN() and it auto-trims trailing spaces
-- SELECT full_name, LEN(full_name) AS char_count FROM customers;
```

```text
full_name      | char_count | trimmed_count
---------------|------------|-------------
Sarah Chen     | 10         | 10
JAMES WILSON   | 12         | 12
 priya patel   | 13         | 11
Mike  Johnson  | 14         | 13
David Kim Jr.  | 13         | 13
```

## LIKE Patterns — Basic Pattern Matching

```sql
-- % = any characters (including none), _ = exactly one character

-- Emails from gmail
SELECT * FROM customers WHERE email LIKE '%@gmail.com';

-- Names starting with 'S' (case-sensitive)
SELECT * FROM customers WHERE full_name LIKE 'S%';

-- Names with exactly 4-letter first names
SELECT * FROM customers WHERE TRIM(full_name) LIKE '____ %';

-- Products containing 'Pro'
SELECT * FROM products WHERE product_name LIKE '%Pro%';
```

```text
-- '%@gmail.com' results:
cust_id | email
--------|---------------------
1001    | sarah.chen@gmail.com

-- 'S%' results:
cust_id | full_name
--------|----------
1001    | Sarah Chen

-- '%Pro%' results:
product_id | product_name
-----------|----------------------------
1          | CRM Pro - Enterprise Edition
4          | CRM Pro - Enterprise Edition v2
```

## REGEXP — Advanced Pattern Matching (MySQL/PostgreSQL)

```sql
-- PostgreSQL: ~ operator or REGEXP_MATCHES
-- MySQL: REGEXP or RLIKE

-- Find emails from any .com domain
SELECT email FROM customers
WHERE email ~ '.*@.*\.com$';

-- Find names that start with uppercase letter followed by lowercase
SELECT full_name FROM customers
WHERE TRIM(full_name) ~ '^[A-Z][a-z]';

-- Extract city from address (PostgreSQL)
SELECT address,
       (REGEXP_MATCH(address, ',\s*([^,]+),\s*[A-Z]{2}$'))[1] AS city
FROM customers;
```

```text
address                    | city
---------------------------|--------
123 Oak St, Portland, OR   | Portland
456 Elm Ave, Seattle, WA   | Seattle
 789 Pine Rd, Denver, CO   | Denver
321 Maple Dr, Austin, TX   | Austin
654 Cedar Ln, Miami, FL    | Miami
987 Birch Ct, Boston, MA   | Boston
```

## COALESCE with Strings — Handling NULL Text

```sql
-- Some customers have NULL phone numbers
SELECT full_name,
       COALESCE(phone, 'No phone on file') AS contact_phone
FROM customers;

-- Building display names with fallbacks
SELECT COALESCE(preferred_name, first_name, email) AS display_name
FROM users;
```

## Parsing Real Data — Putting It All Together

### Extract First and Last Name

```sql
SELECT full_name,
       TRIM(SUBSTRING(
           TRIM(full_name), 1,
           POSITION(' ' IN TRIM(full_name)) - 1
       )) AS first_name,
       TRIM(SUBSTRING(
           TRIM(full_name),
           POSITION(' ' IN TRIM(full_name)) + 1
       )) AS last_name
FROM customers;
```

```text
full_name      | first_name | last_name
---------------|------------|----------
Sarah Chen     | Sarah      | Chen
JAMES WILSON   | JAMES      | WILSON
 priya patel   | priya      | patel
Mike  Johnson  | Mike       | Johnson
lisa park       | lisa       | park
David Kim Jr.  | David      | Kim Jr.
```

### Standardize Names (Title Case Approximation)

```sql
-- Capitalize first letter, lowercase the rest
SELECT full_name,
       CONCAT(
           UPPER(LEFT(TRIM(full_name), 1)),
           LOWER(SUBSTRING(TRIM(full_name), 2))
       ) AS title_case_approx
FROM customers;
```

```text
full_name      | title_case_approx
---------------|------------------
Sarah Chen     | Sarah chen
JAMES WILSON   | James wilson
 priya patel   | Priya patel
```

Note: True title case (capitalizing each word) requires INITCAP in PostgreSQL or a more complex approach.

```sql
-- PostgreSQL has INITCAP
SELECT INITCAP(TRIM(full_name)) AS proper_name
FROM customers;
```

```text
proper_name
-----------
Sarah Chen
James Wilson
Priya Patel
Mike  Johnson
Lisa Park
David Kim Jr.
```

### Extract State from Address

```sql
SELECT address,
       RIGHT(TRIM(address), 2) AS state_code
FROM customers;
```

```text
address                    | state_code
---------------------------|----------
123 Oak St, Portland, OR   | OR
456 Elm Ave, Seattle, WA   | WA
 789 Pine Rd, Denver, CO   | CO
321 Maple Dr, Austin, TX   | TX
654 Cedar Ln, Miami, FL    | FL
987 Birch Ct, Boston, MA   | MA
```

## Where This Is Used in Real Jobs

| Scenario | Functions | Why |
|----------|----------|-----|
| Standardize names | TRIM, UPPER, INITCAP | Clean messy imports |
| Parse email domains | SUBSTRING, POSITION | Customer analytics |
| Clean phone numbers | REPLACE, REGEXP_REPLACE | Standardize formats |
| Extract address parts | SUBSTRING, RIGHT | Geographic analysis |
| Case-insensitive search | LOWER/UPPER | Flexible matching |
| SKU parsing | LEFT, RIGHT, SUBSTRING | Product categorization |

<div class="challenge">

### Challenge 1: Email Domain Report
Extract the email domain from each customer's email. Show the domain in lowercase and count how many customers use each domain.

### Challenge 2: Phone Standardization
Clean all phone numbers to a standard format: (XXX) XXX-XXXX. First strip to digits only, then format.

### Challenge 3: Name Cleanup
Write a query that trims whitespace, fixes internal double spaces, and applies proper case (first letter of each word capitalized) to the full_name column.

</div>

## Common Interview Questions

### Q1: How do you extract the domain from an email address in SQL?

**Answer:** Use SUBSTRING with POSITION: `SUBSTRING(email, POSITION('@' IN email) + 1)`. This gets everything after the @ sign. To make it case-insensitive, wrap in LOWER(). In SQL Server, use CHARINDEX instead of POSITION: `SUBSTRING(email, CHARINDEX('@', email) + 1, LEN(email))`.

### Q2: What's the difference between CHAR and VARCHAR?

**Answer:** CHAR is fixed-length — CHAR(10) always stores 10 characters, padding with spaces. VARCHAR is variable-length — VARCHAR(10) stores only the characters actually used, up to 10. Use VARCHAR for most text fields. CHAR is only efficient when all values are the same length (like state codes: CHAR(2)).

### Q3: How do you handle case-insensitive searches in SQL?

**Answer:** Two approaches: (1) Use LOWER() or UPPER() on both sides: `WHERE LOWER(name) = LOWER('Smith')`. (2) Use a case-insensitive collation if your database supports it. PostgreSQL's ILIKE is also an option: `WHERE name ILIKE 'smith'`. Note that wrapping a column in a function prevents index usage — consider a functional index for performance.

### Q4: What is COALESCE and when do you use it with strings?

**Answer:** COALESCE returns the first non-NULL value from its arguments. With strings, it's used for fallback values: `COALESCE(preferred_name, full_name, 'Unknown')`. It's also essential when concatenating nullable columns — since NULL + any string = NULL in most databases, use `CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))`.

### Q5: How do you find rows where a column contains a specific substring?

**Answer:** Use LIKE with wildcards: `WHERE column LIKE '%substring%'`. The % matches any characters. For case-insensitive matching, use `WHERE LOWER(column) LIKE '%substring%'` or PostgreSQL's ILIKE. For complex patterns, use REGEXP (MySQL) or the `~` operator (PostgreSQL). LIKE with a leading % can't use standard indexes — consider full-text search for large tables.
