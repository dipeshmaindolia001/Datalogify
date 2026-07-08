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

## Introduction & The "Why"

Think of messy text data entering your database like a load of dirty clothes entering a laundry machine. 

```text
       ┌──────────────────────────────────────────────────┐
       │             TEXT LAUNDRY MACHINE                 │
       │                                                  │
 INPUT │ [  SArah.cHEN@gMAil.com  ]                       │
       └──────────────┬───────────────────────────────────┘
                      │
                      ▼
            [ Casing Cycle (LOWER) ]     ──► sarah.chen@gmail.com
                      │
                      ▼
            [ Spin Cycle (TRIM) ]        ──► sarah.chen@gmail.com (spaces gone)
                      │
                      ▼
            [ Split Cycle (SUBSTRING) ]  ──► Username: sarah.chen | Domain: gmail.com
                      │
                      ▼
       ┌──────────────────────────────────────────────────┐
       │ Clean, Standardized, Structured Output           │
       └──────────────────────────────────────────────────┘
```

When you open the washing machine lid, you have a series of specific cycles:
*   **The Casing Cycle (`LOWER` or `UPPER`)**: Takes shirts of different colors (mixed case) and dyes them all a uniform color (all lowercase or all uppercase) so they match.
*   **The Spin Cycle (`TRIM`)**: Shakes off all the loose lint and dirt clinging to the edges of the clothes (leading and trailing spaces, tabs, or hidden line breaks).
*   **The Repair Cycle (`REPLACE`)**: Finds holes or patches in a fabric and replaces them with clean matching cloth (like removing dots, hyphens, or brackets).
*   **The Scissors Cycle (`SUBSTRING`)**: Cuts a piece of fabric into specific sizes (like extracting the area code from a raw phone number).
*   **The Stitching Cycle (`CONCAT` or `||`)**: Sews two separate pieces of cloth together to create a single complete garment.

In the real world, data is exceptionally dirty. Users submit sign-up forms with trailing spaces, write names in all caps, paste telephone numbers in different formats (some with dots, some with hyphens, some with brackets), and enter email addresses with accidental spaces. 

If you cannot sanitize, clean, and restructure strings directly in SQL, you will be forced to export millions of rows to Python, R, or Excel just to perform basic cleanups. Text cleaning functions are essential for formatting reports, matching records between CRMs, and performing data preparation.

---

## Step-by-Step Concept Breakdown

### Case Standardization: UPPER() and LOWER()

Case variation is a primary cause of failed query joins. To a database, `'sarah.chen@gmail.com'` and `'Sarah.Chen@Gmail.com'` are completely distinct strings. Joining tables on mismatched case columns will result in dropped rows.

To standardize case, SQL provides two simple functions:
*   `UPPER(string)`: Converts all characters to uppercase.
*   `LOWER(string)`: Converts all characters to lowercase.

#### The Search Matching Pattern:
Always standardize case on both sides of a comparison in your filters:

```sql
WHERE LOWER(email) = LOWER('UserEnteredEmail@Email.com')
```

#### Index Suppression Warning:
When you apply a function like `LOWER()` to a column in your `WHERE` clause, the database query optimizer cannot use standard indexes on that column. It is forced to run a slow **full-table scan** because it has to calculate the `LOWER()` output for every single row in the table to evaluate the condition.

```text
WHERE email = 'smith@email.com'       <-- Uses index (Fast)
WHERE LOWER(email) = 'smith@email.com' <-- Bypasses index (Slow!)
```

**Best Practice**: In high-performance systems, either store text in lowercase by default at the write layer, or create a function-based index (supported in PostgreSQL and Oracle):
```sql
CREATE INDEX idx_customers_email_lower ON customers (LOWER(email));
```

---

### Whitespace Sanitation: TRIM(), LTRIM(), and RTRIM()

Whitespace characters include trailing spaces, leading spaces, tab characters (`\t`), carriage returns (`\r`), and newlines (`\n`). 

*   `TRIM(string)`: Removes all spaces/tabs from **both** the left and right ends of a string.
*   `LTRIM(string)`: Removes spaces only from the **left** side (leading spaces).
*   `RTRIM(string)`: Removes spaces only from the **right** side (trailing spaces).

> [!IMPORTANT]
> `TRIM` only removes whitespace from the *outer edges* of a string. It does **not** collapse multiple internal spaces. For instance, `TRIM('  Sarah   Chen  ')` returns `'Sarah   Chen'` (the internal spaces remain untouched).

To replace multiple internal spaces, you must use string replacement functions or regular expressions.

---

### Joining Strings: CONCAT(), CONCAT_WS(), and ||

Concatenation is the act of linking multiple strings end-to-end. Different database systems handle this using different syntaxes:

1.  **Standard SQL / PostgreSQL**: Use the pipe operator `||`.
    ```sql
    SELECT first_name || ' ' || last_name FROM customers;
    ```
2.  **MySQL / SQL Server / Oracle**: Use the `CONCAT()` function.
    ```sql
    SELECT CONCAT(first_name, ' ', last_name) FROM customers;
    ```

#### The NULL Propagation Trap:
In standard SQL, if you concatenate any string with a `NULL` value, the entire result becomes `NULL`. 

```text
'Hello' || NULL || 'World'  ──►  NULL
```

This occurs because `NULL` represents an unknown state, and any operation combining a known value with an unknown value yields an unknown result.

To bypass this trap, use the **`CONCAT_WS()`** (CONCAT With Separator) function (supported in MySQL, Postgres, and SQL Server) or guard each column with `COALESCE`:

*   **`CONCAT_WS(separator, string1, string2, ...)`**: This function automatically ignores `NULL` values and joins only the populated fields using the designated separator.
    ```sql
    CONCAT_WS(' ', first_name, middle_name, last_name)
    -- If middle_name is NULL, it will cleanly join first_name and last_name with a single space.
    ```

---

### Location Searching: POSITION() vs. CHARINDEX()

To extract a portion of a string, you often need to locate the position of a specific character (like finding the `@` symbol in an email or a space character in a full name).

*   **PostgreSQL / MySQL**: `POSITION(substring IN string)`
*   **SQL Server**: `CHARINDEX(substring, string)`

If the substring is found, the function returns its **1-indexed position** (meaning the first character of the string is position 1, not 0). If the character is not found, the function returns `0`.

---

### Substring Extraction: SUBSTRING()

The `SUBSTRING` function extracts a slice of text from a larger string based on a starting position and length.

```sql
SUBSTRING(string, start_position [, length])
```

*   `start_position`: The index where extraction begins (1-indexed).
*   `length` (Optional): The number of characters to extract. If omitted, it extracts everything from the start position to the end of the string.

To perform dynamic extraction, combine `SUBSTRING` with `POSITION`:

```text
Email:  [ s a r a h . c h e n @ g m a i l . c o m ]
Index:    1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18
POSITION('@' IN email) = 11

To extract username: SUBSTRING(email, 1, 11 - 1)  ──► sarah.chen
To extract domain:   SUBSTRING(email, 11 + 1)      ──► gmail.com
```

---

### Text Replacement: REPLACE()

The `REPLACE` function replaces all occurrences of a specified substring with a new substring.

```sql
REPLACE(string, target_substring, replacement_substring)
```

For basic swaps (like changing `'Street'` to `'St.'`), `REPLACE` works perfectly. However, if you need to remove multiple different symbols (like stripping brackets, hyphens, and spaces from a phone number), nesting multiple `REPLACE()` calls makes your code unreadable. 

For complex cleanup, use **`REGEXP_REPLACE`** (supported in Postgres, MySQL 8.0+, and Oracle) which applies regular expressions to match patterns:

```sql
REGEXP_REPLACE(phone, '[^0-9]', '', 'g')
-- Reads: "Match any character that is NOT a digit [^0-9] and replace it with nothing '', globally 'g'."
```

---

## Code / Practical Walkthroughs

We will run our walkthroughs using two tables: `customers_raw` and `inventory_products`.

### Schema Setup

```sql
-- Create customers_raw table
CREATE TABLE customers_raw (
    cust_id INT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    address VARCHAR(150)
);

INSERT INTO customers_raw VALUES
(1001, '  Sarah Chen  ', 'sarah.chen@gmail.com', '(555) 123-4567', '123 Oak St, Portland, OR'),
(1002, 'JAMES WILSON', 'JAMES@COMPANY.COM', '555.234.5678', '456 Elm Ave, Seattle, WA'),
(1003, '  priya patel  ', 'priya_p@yahoo.com', '5553456789', ' 789 Pine Rd, Denver, CO'),
(1004, 'Mike  Johnson', 'mike.j@outlook.com', NULL, '321 Maple Dr, Austin, TX'),
(1005, 'lisa park', 'LISA.PARK@WORK.ORG', '555-567-8901', '654 Cedar Ln, Miami, FL'),
(1006, 'David Kim Jr.', 'd.kim@email.co.uk', '555 678 9012', '987 Birch Ct, Boston, MA');

-- Create inventory_products table
CREATE TABLE inventory_products (
    product_id INT PRIMARY KEY,
    sku VARCHAR(50),
    product_name VARCHAR(100)
);

INSERT INTO inventory_products VALUES
(1, 'CRM-PRO-2024', 'CRM Pro - Enterprise Edition'),
(2, 'AH-BASIC-2024', 'Analytics Hub (Basic)'),
(3, 'DV-STD-2025', 'Data Vault: Standard License'),
(4, 'CRM-PRO-2025', 'CRM Pro - Enterprise Edition v2');
```

---

### Walkthrough 1: Dynamic Email Domain Extraction and Analysis

We need to analyze our database to find which email domains are most popular among our customers. We will extract the domain name and count the occurrences.

#### Query:

```sql
SELECT 
    -- Convert domain to lowercase for consistent grouping
    LOWER(
        SUBSTRING(
            email, 
            POSITION('@' IN email) + 1
        )
    ) AS email_domain,
    COUNT(*) AS customer_count
FROM customers_raw
GROUP BY 1
ORDER BY customer_count DESC;
```

```text
# Output:
email_domain | customer_count
-------------|---------------
gmail.com    | 1
company.com  | 1
yahoo.com    | 1
outlook.com  | 1
work.org     | 1
email.co.uk  | 1
```

#### Step-by-Step Logic Breakdown:
1.  `POSITION('@' IN email)` searches each email string for the index of the `@` character. For `sarah.chen@gmail.com`, it returns `11`.
2.  `SUBSTRING(email, 11 + 1)` instructs the engine to extract text starting at index 12 through to the end of the string. This extracts `'gmail.com'`.
3.  `LOWER()` standardizes the casing (converting `'COMPANY.COM'` to `'company.com'`).
4.  `GROUP BY 1` groups the results by this computed domain column.
5.  `COUNT(*)` sums up the records for each domain.

---

### Walkthrough 2: Phone Number Standardization

Our marketing dialer requires all phone numbers to be formatted in a strict E.164 string format: `+1XXXXXXXXXX` (11 digits starting with country code 1, no brackets, dots, spaces, or hyphens).

#### Query:

```sql
SELECT 
    cust_id,
    phone AS raw_phone,
    -- Step 1: Strip all non-numeric characters using REGEXP_REPLACE (Postgres syntax)
    -- Step 2: Prepend country code '+1'
    -- Step 3: Handle NULL values with COALESCE
    COALESCE(
        '+1' || REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 
        'No phone on file'
    ) AS standardized_phone
FROM customers_raw;
```

```text
# Output:
cust_id | raw_phone      | standardized_phone
--------|----------------|-------------------
1001    | (555) 123-4567 | +15551234567
1002    | 555.234.5678   | +15552345678
1003    | 5553456789     | +15553456789
1004    | NULL           | No phone on file
1005    | 555-567-8901   | +15555678901
1006    | 555 678 9012   | +15556789012
```

#### Step-by-Step Logic Breakdown:
1.  For row 1, `REGEXP_REPLACE('(555) 123-4567', '[^0-9]', '', 'g')` removes all brackets, spaces, and hyphens, returning `'5551234567'`.
2.  The pipe operator appends `'+1'` to the front, yielding `'+15551234567'`.
3.  For row 4 (`cust_id` 1004), the phone field is `NULL`. The regexp evaluation returns `NULL`. `COALESCE` detects the null value and swaps it for `'No phone on file'`.

---

### Walkthrough 3: Proper Name Formatting

Let's clean our customer names. We need to strip leading and trailing whitespace, collapse internal double spaces down to single spaces, and capitalize the first letter of each name.

#### Query (PostgreSQL / systems with `INITCAP`):

```sql
SELECT 
    full_name AS raw_name,
    -- Step 1: Trim outer spaces
    -- Step 2: Replace double spaces with single spaces
    -- Step 3: Apply proper casing
    INITCAP(
        REPLACE(
            TRIM(full_name), 
            '  ', 
            ' '
        )
    ) AS clean_name
FROM customers_raw;
```

```text
# Output:
raw_name        | clean_name
----------------|-------------
  Sarah Chen    | Sarah Chen
JAMES WILSON    | James Wilson
  priya patel   | Priya Patel
Mike  Johnson   | Mike Johnson
lisa park       | Lisa Park
David Kim Jr.   | David Kim Jr.
```

#### Step-by-Step Logic Breakdown:
1.  `TRIM('  Sarah Chen  ')` strips the outer padding to return `'Sarah Chen'`.
2.  `REPLACE('Mike  Johnson', '  ', ' ')` detects the double space in the center and swaps it for a single space, returning `'Mike Johnson'`.
3.  `INITCAP('james wilson')` capitalizes the first letter of each word, returning `'James Wilson'`.

---

### Walkthrough 4: SKU / Serial Number Parsing

Our SKU structure contains structured product info: `[ProductCode]-[Tier]-[Year]` (e.g., `CRM-PRO-2024`). Let's extract the individual elements.

#### Query:

```sql
SELECT 
    sku,
    -- Extract product code (everything before the first hyphen)
    SUBSTRING(sku, 1, POSITION('-' IN sku) - 1) AS product_code,
    -- Extract the release year (the last 4 characters)
    RIGHT(sku, 4) AS release_year,
    -- Extract the middle tier
    SUBSTRING(
        sku,
        POSITION('-' IN sku) + 1,
        -- Calculate length of tier by locating positions of hyphens
        (POSITION('-' IN RIGHT(sku, LENGTH(sku) - POSITION('-' IN sku))) + POSITION('-' IN sku) - 1) - POSITION('-' IN sku)
    ) AS product_tier
FROM inventory_products;
```

```text
# Output:
sku           | product_code | release_year | product_tier
--------------|--------------|--------------|-------------
CRM-PRO-2024  | CRM          | 2024         | PRO
AH-BASIC-2024 | AH           | 2024         | BASIC
DV-STD-2025   | DV           | 2025         | STD
CRM-PRO-2025  | CRM          | 2025         | PRO
```

#### Step-by-Step Logic Breakdown:
1.  `POSITION('-' IN sku)` finds the first hyphen. For `CRM-PRO-2024`, it's at index 4. `SUBSTRING(sku, 1, 3)` extracts `'CRM'`.
2.  `RIGHT(sku, 4)` pulls the final 4 characters (`'2024'`).
3.  The tier extraction dynamically isolates the text between the first and second hyphens.

---

## Edge Cases & Common Mistakes

### 1. NULL Contamination in CONCAT
As discussed, standard SQL concatenation using the `||` operator returns `NULL` if any element in the chain is `NULL`.

*   **Incorrect Code**:
    ```sql
    -- If address is NULL, the entire location is returned as NULL
    SELECT cust_id, full_name || ' lives at: ' || address AS location
    FROM customers_raw;
    ```
*   **Correct Code**:
    Use `COALESCE` to provide an empty fallback string, or use the `CONCAT` function (which automatically ignores null elements).
    ```sql
    SELECT cust_id, CONCAT(full_name, ' lives at: ', COALESCE(address, 'Unknown Location')) AS location
    FROM customers_raw;
    ```

---

### 2. Multi-byte Characters (Unicode)
Functions like `LENGTH(col)` behave differently depending on the database engine.
*   `LENGTH()` or `CHAR_LENGTH()` returns the **number of characters** in the string.
*   `OCTET_LENGTH()` or `DATALENGTH()` returns the **number of bytes** used to store the string.

If your data contains emojis or non-English characters (such as Chinese or Cyrillic letters), a single character can occupy 2 to 4 bytes. 

```text
Character: '🔥'
LENGTH('🔥')       ──► 1 (character)
OCTET_LENGTH('🔥') ──► 4 (bytes in UTF-8)
```

Be careful not to mix up character counts and byte counts when setting column constraints or running substrings on multi-byte text fields.

---

### 3. Case Standardization Index Suppression
When you use a text function like `LOWER(email) = 'abc@gmail.com'` inside your `WHERE` filter, the database will bypass the index and perform a slow full-table scan. 

*   **Fix**: If your database engine does not support function-based indexing, store all search-critical fields in lowercase at the point of ingestion.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Email Domain Counter
**Goal**: Write a query that extracts the email domain from the `customers_raw` table, converts it to lowercase, and counts the number of customers on each domain. Do not include domains that have fewer than 1 customer (or write the code to support grouping).

*   *Hint*: Combine `SUBSTRING` and `POSITION` with a `GROUP BY` clause.

<details>
<summary>View Solution</summary>

```sql
SELECT 
    LOWER(SUBSTRING(email, POSITION('@' IN email) + 1)) AS domain_name,
    COUNT(*) AS user_count
FROM customers_raw
GROUP BY 1
ORDER BY user_count DESC;
```
</details>

---

### Exercise 2: Dynamic Address Parser
**Goal**: Given the address format `'Street Address, City, State'`, write a query that extracts the City and State into separate columns.

*   *Hint*: Look at the positions of the commas.

<details>
<summary>View Solution</summary>

```sql
-- Using Postgres REGEXP_MATCH for clean extraction, or nested substrings:
SELECT 
    address,
    -- Extract City (between first and second comma)
    TRIM(
        SUBSTRING(
            address,
            POSITION(',' IN address) + 1,
            POSITION(',' IN RIGHT(address, LENGTH(address) - POSITION(',' IN address))) - 1
        )
    ) AS city,
    -- Extract State (last 2 characters)
    RIGHT(TRIM(address), 2) AS state
FROM customers_raw;
```
</details>

---

### Exercise 3: SKU Validation Check
**Goal**: Write a validation query that returns a list of SKUs from `inventory_products` that do not follow the strict 3-segment dash format (e.g. `XXX-XXX-XXXX`).

*   *Hint*: Use `LIKE` with character wildcards or count the occurrences of hyphens.

<details>
<summary>View Solution</summary>

```sql
SELECT sku
FROM inventory_products
-- Return rows that don't match pattern of text followed by hyphen, text, hyphen, 4 characters
WHERE sku NOT LIKE '%-%-%'
   OR LENGTH(sku) - LENGTH(REPLACE(sku, '-', '')) != 2;
```
</details>

---

## Section Recaps

*   Standardize user-submitted text fields using `LOWER()` or `UPPER()` to ensure consistent casing.
*   **Applying functions to columns** in filters disables standard database index usage. Use function-based indexes to optimize search queries.
*   Use `TRIM()` to remove outer trailing and leading spaces.
*   Standard SQL string concatenation using `||` returns `NULL` if any element in the sequence is `NULL`. Protect against this by using `CONCAT()` or `COALESCE()`.
*   Locate character indices dynamically using `POSITION()` or `CHARINDEX()`.
*   Perform pattern cleanups on phone numbers and addresses using `REGEXP_REPLACE()`.

---

## Common Interview Questions

### Q1: How do you extract the username and domain from an email?

**Answer:**
You can isolate these elements by finding the index of the `@` symbol using `POSITION()` (or `CHARINDEX()` in SQL Server) and passing it to the `SUBSTRING()` function:
*   **Username**: Extract characters from index 1 up to the index of `@` minus 1.
*   **Domain**: Extract characters starting from the index of `@` plus 1.

```sql
SELECT 
    SUBSTRING(email, 1, POSITION('@' IN email) - 1) AS username,
    SUBSTRING(email, POSITION('@' IN email) + 1) AS domain
FROM users;
```

---

### Q2: What happens if you concatenate a string with NULL? How do you prevent this?

**Answer:**
Under standard SQL rules, concatenating a string with `NULL` propagates the null value, returning `NULL` for the entire expression.
To prevent this, you can:
1.  Use `COALESCE(column, '')` to substitute a blank string for null values.
2.  Use the `CONCAT()` function, which ignores null values and joins the remaining strings.

---

### Q3: Compare the performance of `LIKE '%abc%'` versus `LIKE 'abc%'`.

**Answer:**
*   `LIKE 'abc%'` can utilize database indexes (index range scan). Because the string's prefix is known, the engine can quickly traverse the index tree to locate matching keys.
*   `LIKE '%abc%'` cannot utilize standard B-Tree indexes. Since the search pattern can begin anywhere in the string, the query engine is forced to perform a full-table scan, checking every single record.

---

### Q4: What is the difference between `LENGTH()` and `CHAR_LENGTH()` (or `DATALENGTH()`)?

**Answer:**
*   `LENGTH()` and `CHAR_LENGTH()` measure the number of characters in a string.
*   `DATALENGTH()` or `OCTET_LENGTH()` measures the number of bytes used to store the string in memory.
For standard ASCII characters, character count and byte count are identical. For multi-byte characters like emojis or special Unicode characters, byte count will be larger than character count.

---

### Q5: Write a query to capitalize the first letter of each word in a string if your database doesn't have `INITCAP`.

**Answer:**
If `INITCAP` is not available, you can extract the first letter of each word using substring logic, capitalize them using `UPPER()`, and combine them with the lowercased remaining text. For a simple two-word column (like `first_name` and `last_name` stored separately), you would write:

```sql
SELECT 
    CONCAT(
        UPPER(SUBSTRING(first_name, 1, 1)), 
        LOWER(SUBSTRING(first_name, 2)), 
        ' ', 
        UPPER(SUBSTRING(last_name, 1, 1)), 
        LOWER(SUBSTRING(last_name, 2))
    ) AS formatted_name
FROM users;
```
