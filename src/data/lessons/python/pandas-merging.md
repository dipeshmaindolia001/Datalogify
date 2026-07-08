---
title: "Pandas Merging — Concat, Merge, and Join"
description: "Master combining datasets in Pandas using concat, SQL-like merges, index joins, and relationship validation."
category: "python"
order: 104
phase: 1
tags: ["python", "pandas", "merging", "joins"]
publishedDate: 2025-02-04
prevSlug: "pandas-data-cleaning"
nextSlug: "pandas-groupby-pivot"
seoTitle: "Pandas Merging and Joins Tutorial | Datalogify"
seoDescription: "Master combining datasets in Pandas using concat, SQL-like merges, index joins, and relationship validation."
---

## Why This Matters: The Normalized World

In modern data architectures, data is rarely stored in a single, massive flat table. Instead, databases are **normalized**—split into smaller, modular tables to reduce redundancy, maintain integrity, and save storage space. 

For example, a typical e-commerce database might have:
* A `transactions` table containing only order IDs, dates, prices, and a reference `customer_id`.
* A `customers` table containing customer contact info, signup dates, and country.
* A `products` table containing descriptions, categories, and manufacturing costs.

To build reports, run cohort analyses, or calculate profit margins, you must stitch these tables back together using matching keys.

Pandas provides a suite of tools to combine datasets: `pd.concat()`, `pd.merge()`, and `.join()`. Understanding these methods is key to integrating data from multiple sources and avoiding common data integration bugs like **row duplication** and **information loss**.

---

## The Visual Analogy: The Jigsaw Puzzle

Combining data is like putting together a jigsaw puzzle. You have separate pieces of information that only make sense when they are locked together along their matching edges.

```text
  Table A (Transactions)                    Table B (Customers)
  ┌───────────┬───────────────┐             ┌───────────────┬───────────┐
  │  Order_ID │  Customer_ID  │             │  Customer_ID  │   Name    │
  ├───────────┼───────────────┤             ├───────────────┼───────────┤
  │   1001    │     C101      │             │     C101      │   Alice   │
  └───────────┴───────────────┘             └───────────────┴───────────┘
                    │                               │
                    └────────── [ MATCH ] ──────────┘ (Customer_ID key)
                                    │
                                    ▼
                      Merged Output (Joined Table)
              ┌───────────┬───────────────┬───────────┐
              │  Order_ID │  Customer_ID  │   Name    │
              ├───────────┼───────────────┼───────────┤
              │   1001    │     C101      │   Alice   │
              └───────────┴───────────────┴───────────┘
```

* **Concatenation** is like stacking pages. You take quarterly sales reports with the same structure and stack them vertically to build a yearly report.
* **Merging** is like matching puzzle pieces. You look at a transaction, find the `Customer_ID`, search for the matching `Customer_ID` in the customer directory, and merge their information into a single row.

---

## Concatenating DataFrames: Stacking Data

Use `pd.concat()` to combine DataFrames along a specific axis.
* **`axis=0` (default):** Stacks DataFrames vertically (appends rows).
* **`axis=1`:** Aligns DataFrames horizontally (appends columns) based on their indexes.

```python
import pandas as pd

# Creating mock quarterly sales
sales_q1 = pd.DataFrame({
    "OrderID": [101, 102],
    "Revenue": [1200, 850]
})

sales_q2 = pd.DataFrame({
    "OrderID": [103, 104],
    "Revenue": [950, 1100]
})
```

### 1. Vertical Concatenation (axis=0)
By default, Pandas stacks DataFrames vertically. It aligns columns by name. Mismatched columns are filled with `NaN`.

```python
# Stack Q1 and Q2 sales. ignore_index=True resets the row index
yearly_sales = pd.concat([sales_q1, sales_q2], axis=0, ignore_index=True)
print(yearly_sales)
```

```text
# Output:
   OrderID  Revenue
0      101     1200
1      102      850
2      103      950
3      104     1100
```

#### Handling Mismatched Columns
If we concatenate tables with different columns, Pandas keeps all columns and inserts `NaN` for missing entries.

```python
sales_q3 = pd.DataFrame({
    "OrderID": [105],
    "Revenue": [1400],
    "PromoCode": ["SAVE10"]
})

mismatched_concat = pd.concat([yearly_sales, sales_q3], axis=0, ignore_index=True)
print(mismatched_concat)
```

```text
# Output:
   OrderID  Revenue PromoCode
0      101     1200       NaN
1      102      850       NaN
2      103      950       NaN
3      104     1100       NaN
4      105     1400    SAVE10
```

### 2. Horizontal Concatenation (axis=1)
Use `axis=1` to stack columns side-by-side. Pandas aligns the rows based on their index labels.

```python
# User info and user activity tracking
user_info = pd.DataFrame({"Username": ["Alice", "Bob"]}, index=[101, 102])
user_activity = pd.DataFrame({"Logins": [15, 4]}, index=[101, 102])

horizontal = pd.concat([user_info, user_activity], axis=1)
print(horizontal)
```

```text
# Output:
    Username  Logins
101    Alice      15
102      Bob       4
```

---

## Merging DataFrames: SQL-Style Joins

The `pd.merge()` function is the equivalent of SQL joins. It matches rows from two DataFrames based on one or more key columns.

```python
# Transaction ledger (Left Table)
tx = pd.DataFrame({
    "TxID": [1, 2, 3, 4],
    "CustID": [101, 102, 101, 104],
    "Amount": [150.0, 45.0, 220.0, 99.0]
})

# Customer directory (Right Table)
cust = pd.DataFrame({
    "CustID": [101, 102, 103],
    "Name": ["Alice", "Bob", "Charlie"]
})
```

There are four primary join types (`how` parameter):

```text
      Inner Join                  Left Join                   Outer Join
 ┌─────────┬─────────┐       ┌─────────┬─────────┐       ┌─────────┬─────────┐
 │ Left    │ Right   │       │ Left    │ Right   │       │ Left    │ Right   │
 │         │         │       │         │         │       │         │         │
 │     ┌───┼───┐     │       │ ┌───────┼───┐     │       │ ┌───────┼───────┐ │
 │     │Match  │     │       │ │Match  │   │     │       │ │Match  │Match  │ │
 │     └───┼───┘     │       │ └───────┼───┘     │       │ └───────┴───────┘ │
 │         │         │       │         │         │       │         │         │
 └─────────┴─────────┘       └─────────┴─────────┘       └─────────┴─────────┘
   Matching keys only          All left keys +             All keys from 
                               matching right keys         both tables
```

### 1. Inner Join (`how='inner'`)
Keeps only the rows where the join keys match in **both** DataFrames.

```python
# CustID 104 (left) and 103 (right) are excluded because they do not exist in both tables
inner_df = pd.merge(tx, cust, on="CustID", how="inner")
print(inner_df)
```

```text
# Output:
   TxID  CustID  Amount   Name
0     1     101   150.0  Alice
1     3     101   220.0  Alice
2     2     102    45.0    Bob
```

### 2. Left Join (`how='left'`)
Keeps all rows from the left DataFrame. If a key is missing in the right DataFrame, the right columns are filled with `NaN`.

```python
# CustID 104 is kept, but the Name column is filled with NaN
left_df = pd.merge(tx, cust, on="CustID", how="left")
print(left_df)
```

```text
# Output:
   TxID  CustID  Amount   Name
0     1     101   150.0  Alice
1     2     102    45.0    Bob
2     3     101   220.0  Alice
3     4     104    99.0    NaN
```

### 3. Right Join (`how='right'`)
Keeps all rows from the right DataFrame. If a key is missing in the left DataFrame, the left columns are filled with `NaN`.

```python
# CustID 103 (Charlie) is kept, but the TxID and Amount columns are filled with NaN
right_df = pd.merge(tx, cust, on="CustID", how="right")
print(right_df)
```

```text
# Output:
   TxID  CustID  Amount     Name
0   1.0     101   150.0    Alice
1   3.0     101   220.0    Alice
2   2.0     102    45.0      Bob
3   NaN     103     NaN  Charlie
```

### 4. Outer Join (`how='outer'`)
Keeps all rows from both DataFrames. Missing matches on either side are filled with `NaN`.

```python
outer_df = pd.merge(tx, cust, on="CustID", how="outer")
print(outer_df)
```

```text
# Output:
   TxID  CustID  Amount     Name
0   1.0     101   150.0    Alice
1   3.0     101   220.0    Alice
2   2.0     102    45.0      Bob
3   4.0     104    99.0      NaN
4   NaN     103     NaN  Charlie
```

---

## Overlapping Columns and Suffixes

If the tables contain columns with the same name that are not used as the join key, Pandas appends suffixes to identify them.

```python
# Both tables have a 'Rating' column
products = pd.DataFrame({"ProdID": [1, 2], "Rating": [4.5, 3.8]})
reviews = pd.DataFrame({"ProdID": [1, 2], "Rating": [5.0, 4.0]})

# Specify custom suffixes to clarify column origins
merged_suffixes = pd.merge(products, reviews, on="ProdID", suffixes=("_prod", "_rev"))
print(merged_suffixes)
```

```text
# Output:
   ProdID  Rating_prod  Rating_rev
0       1          4.5         5.0
1       2          3.8         4.0
```

---

## Mismatched Key Names: `left_on` and `right_on`

If the join columns have different names in the two tables, use `left_on` and `right_on`.

```python
tx_diff = pd.DataFrame({"TxID": [1, 2], "CustomerKey": [101, 102]})
cust_diff = pd.DataFrame({"CustID": [101, 102], "Name": ["Alice", "Bob"]})

# Merge on CustomerKey (left) and CustID (right)
merged_diff = pd.merge(tx_diff, cust_diff, left_on="CustomerKey", right_on="CustID")
print(merged_diff)
```

```text
# Output:
   TxID  CustomerKey  CustID   Name
0     1          101     101  Alice
1     2          102     102    Bob
```

Notice that both join key columns are kept in the final DataFrame. You can drop the duplicate key column using `.drop()`:

```python
cleaned_diff = merged_diff.drop(columns="CustID")
print(cleaned_diff)
```

```text
# Output:
   TxID  CustomerKey   Name
0     1          101  Alice
1     2          102    Bob
```

---

## Joining on Indexes (`.join`)

The `.join()` method is a shorthand for joining DataFrames on their indexes. By default, it performs a **left join**.

```python
# Set index for both tables
tx_indexed = tx.set_index("CustID")
cust_indexed = cust.set_index("CustID")

# Join on row indexes
joined = tx_indexed.join(cust_indexed, how="inner")
print(joined)
```

```text
# Output:
        TxID  Amount   Name
CustID                     
101        1   150.0  Alice
101        3   220.0  Alice
102        2    45.0    Bob
```

---

## Merge Validation: Preventing Row Explosions

A common bug in data pipelines is the **row explosion**. This occurs when you perform a merge expecting a one-to-many relationship, but the key has duplicates in both tables. This causes a many-to-many join, creating a cartesian product of matching rows that inflates your data.

To prevent this, use the `validate` parameter. It checks the relationship type and raises a `MergeError` if the assertion is violated:
* `"one_to_one"` (or `"1:1"`)
* `"one_to_many"` (or `"1:m"`)
* `"many_to_one"` (or `"m:1"`)
* `"many_to_many"` (or `"m:m"`)

```python
import pandas as pd

# Transaction ledger (many transactions per customer)
tx_data = pd.DataFrame({"CustID": [101, 101, 102], "Amount": [50.0, 75.0, 20.0]})

# Customer list (should contain unique customer records)
cust_data = pd.DataFrame({"CustID": [101, 101], "Name": ["Alice", "Alice Dup"]})  # Bug: Duplicate customer record
```

If we merge these datasets expecting a many-to-one relationship (many transactions to one unique customer), we can catch the duplicate customer bug using `validate`:

```python
try:
    result = pd.merge(tx_data, cust_data, on="CustID", validate="many_to_one")
except Exception as e:
    print(f"Validation failed: {e}")
```

```text
# Output:
Validation failed: Merge keys are not unique in right dataset; not a many-to-one merge
```

This check prevents dirty data from propagating through your pipeline.

---

## Practice Exercises

### Exercise 1: Multi-Table Ingestion Pipeline
You have three datasets:
1. `q1_orders`: Order list for Q1.
2. `q2_orders`: Order list for Q2.
3. `customers`: User information database.

Write a pipeline to:
1. Concatenate Q1 and Q2 orders.
2. Left join the user profiles onto the combined order list.
3. Validate that the merge is a `many_to_one` relationship (orders to customers).

```python
import pandas as pd

q1_orders = pd.DataFrame({"OrderID": [1001, 1002], "CustID": [201, 202], "Total": [500.0, 120.0]})
q2_orders = pd.DataFrame({"OrderID": [1003, 1004], "CustID": [201, 203], "Total": [300.0, 450.0]})
customers = pd.DataFrame({"CustID": [201, 202, 203], "Country": ["USA", "CAN", "UK"]})

# Write your solution below:
# 1. Combine orders
all_orders = pd.concat([q1_orders, q2_orders], axis=0, ignore_index=True)

# 2. Left join customers with validation
integrated_report = pd.merge(
    all_orders,
    customers,
    on="CustID",
    how="left",
    validate="many_to_one"
)

print(integrated_report)
```

```text
# Output:
   OrderID  CustID  Total Country
0     1001     201  500.0     USA
1     1002     202  120.0     CAN
2     1003     201  300.0     USA
3     1004     203  450.0      UK
```

### Exercise 2: Debugging a Failed Join (Data Type Mismatch)
Try to run the following merge:

```python
user_profiles = pd.DataFrame({"UserID": [101, 102, 103], "Email": ["a@test.com", "b@test.com", "c@test.com"]})
logins = pd.DataFrame({"UserID": ["101", "102", "101"], "Timestamp": ["10:00", "10:15", "10:30"]})

# Try to merge
failed_merge = pd.merge(logins, user_profiles, on="UserID", how="inner")
print(failed_merge)
```

```text
# Output:
Empty DataFrame
Columns: [UserID, Timestamp, Email]
Index: []
```

#### Why did this merge fail?
The `UserID` column in `user_profiles` contains integers (`int64`), while the `UserID` column in `logins` contains strings (`object`). Pandas cannot match keys across different data types.

#### Write the fix below:
```python
# Convert UserID to integer in logins
logins["UserID"] = logins["UserID"].astype(int)

# Re-run merge
fixed_merge = pd.merge(logins, user_profiles, on="UserID", how="inner")
print(fixed_merge)
```

```text
# Output:
   UserID Timestamp       Email
0     101     10:00  a@test.com
1     101     10:30  a@test.com
2     102     10:15  b@test.com
```

---

## Section Recaps

* **`pd.concat()`**: Stacks DataFrames vertically (`axis=0`) or horizontally (`axis=1`). Resets row index values using `ignore_index=True`.
* **`pd.merge()`**: Joins DataFrames using matching keys. Supports `inner` (intersection), `left` (keep all left rows), `right` (keep all right rows), and `outer` (union) joins.
* **Suffix Handling**: When non-key column names overlap, use the `suffixes` parameter to distinguish column origins.
* **Non-Matching Keys**: Use `left_on` and `right_on` when the join columns have different names in the two tables.
* **Relationship Validation**: Use the `validate` parameter to verify relationship cardinality (e.g. `many_to_one`) and prevent row duplication.

---

## Common Interview Questions

### Q1: What is the difference between `pd.concat()` and `pd.merge()` in Pandas?
**Answer:**
* **`pd.concat()` is positional.** It combines DataFrames by stacking them along an axis (rows or columns). It aligns data based on column headers (`axis=0`) or row index positions (`axis=1`), without checking row content.
* **`pd.merge()` is relational.** It joins DataFrames based on matching values in specified key columns, similar to an SQL JOIN. It matches rows where key values are equal, regardless of their position in the dataset.

---

### Q2: What is the difference between `.merge()` and `.join()`?
**Answer:**
* **`.merge()` is a DataFrame method and a module-level function.** It is highly flexible and joins on columns, indexes, or a combination of both.
* **`.join()` is a DataFrame method.** It is a convenience function for joining DataFrames on their indexes (row labels). By default, it performs a left join. You can replicate `.join()` behavior using `.merge(..., left_index=True, right_index=True)`.

---

### Q3: Explain what a "row explosion" is during a merge and how you can prevent it.
**Answer:**
A row explosion occurs when you expect a one-to-many relationship (where one table has unique keys, and the other has duplicate keys), but the keys in both tables contain duplicates. This results in a many-to-many join, creating a cartesian product of matching rows that inflates your data.

To prevent this:
1. **Deduplicate keys before merging:** Ensure the lookup table contains unique keys using `.drop_duplicates(subset=['key'])`.
2. **Use the `validate` parameter:** Pass `validate='one_to_many'` or `validate='many_to_one'` to `pd.merge()`. Pandas will raise a `MergeError` if the keys are not unique in the expected lookup table.

---

### Q4: How do you handle a join when the key columns have different names in the two DataFrames? Write the syntax.
**Answer:**
Use the `left_on` and `right_on` parameters in `pd.merge()` to specify the key columns for each DataFrame:

```python
pd.merge(df_left, df_right, left_on="left_key_name", right_on="right_key_name")
```
This keeps both key columns in the output DataFrame. You can drop the duplicate key column using `.drop(columns='right_key_name')` after the merge.

---

### Q5: What happens during a merge if one key column is integer and the other is a string representation of the same number? How does Pandas handle this?
**Answer:**
Pandas requires the data types of the join keys to match. If you try to merge an integer column with a string column, Pandas will return an **empty DataFrame** without raising an error. This is because integers and strings are not equal in Python (e.g. `101 == "101"` evaluates to `False`).

To fix this, you must convert the key columns to the same data type before merging:
```python
df_right["key"] = df_right["key"].astype(int)
pd.merge(df_left, df_right, on="key")
```
