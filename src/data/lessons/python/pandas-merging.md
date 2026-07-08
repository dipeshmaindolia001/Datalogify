---
title: "Pandas Merge, Join & Concat — Combine DataFrames"
description: "Merge, join, and concatenate DataFrames like a pro — the Pandas equivalent of SQL JOINs."
category: "python"
order: 104
phase: 1
tags: ["python", "pandas", "merge", "join", "concat"]
publishedDate: 2025-02-03
prevSlug: "pandas-data-cleaning"
nextSlug: "pandas-groupby-pivot"
seoTitle: "Pandas Merge and Join Tutorial | Datalogify"
seoDescription: "Learn pd.merge(), .join(), pd.concat() — combine DataFrames with inner, left, right, and outer joins."
---

## Why This Matters

Real data lives in multiple tables. Customers in one table, orders in another, products in a third. You need to combine them to answer any meaningful question. This is the Pandas equivalent of SQL JOINs — and you'll use it in every analytics project.

## pd.merge() — The Main Tool

### Inner Join (Default)

Only keeps rows where the key exists in **both** DataFrames.

```python
import pandas as pd

# Employee table
employees = pd.DataFrame({
    "emp_id": [101, 102, 103, 104, 105],
    "name": ["Sarah", "James", "Maria", "David", "Lisa"],
    "dept_id": [1, 2, 1, 3, 2],
})

# Department table
departments = pd.DataFrame({
    "dept_id": [1, 2, 3, 4],
    "dept_name": ["Sales", "Engineering", "Marketing", "Finance"],
    "budget": [500000, 800000, 350000, 600000],
})

# Inner join — only matching dept_ids
merged = pd.merge(employees, departments, on="dept_id", how="inner")
print(merged)
```

```text
# Output:
   emp_id   name  dept_id    dept_name   budget
0     101  Sarah        1        Sales   500000
1     103  Maria        1        Sales   500000
2     102  James        2  Engineering   800000
3     105   Lisa        2  Engineering   800000
4     104  David        3    Marketing   350000
```

Notice: dept_id 4 (Finance) is gone — no employees matched it.

### Left Join

Keep **all** rows from the left DataFrame. Fill with NaN where no match exists on the right.

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1001, 1002, 1003, 1004, 1005],
    "customer_id": [201, 202, 203, 201, 205],
    "amount": [250, 180, 420, 310, 95],
})

customers = pd.DataFrame({
    "customer_id": [201, 202, 204],
    "name": ["Alice", "Bob", "Diana"],
    "segment": ["Enterprise", "SMB", "Enterprise"],
})

# Left join — keep all orders, attach customer info where available
result = pd.merge(orders, customers, on="customer_id", how="left")
print(result)
```

```text
# Output:
   order_id  customer_id  amount   name     segment
0      1001          201     250  Alice  Enterprise
1      1002          202     180    Bob         SMB
2      1003          203     420    NaN         NaN
3      1004          201     310  Alice  Enterprise
4      1005          205      95    NaN         NaN
```

Customer 203 and 205 don't exist in the customers table — their info shows as NaN, but the orders are preserved.

<div class="interview-tip">

**Interview Tip:** Left join is the most common join in analytics. You almost always want to keep all records from your primary table (orders, events, transactions) and enrich them with dimension data (customer names, product details). If rows don't match, you want to know — not silently drop them.

</div>

### Right Join

Keep **all** rows from the right DataFrame.

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1001, 1002, 1003],
    "customer_id": [201, 202, 201],
    "amount": [250, 180, 420],
})

customers = pd.DataFrame({
    "customer_id": [201, 202, 203, 204],
    "name": ["Alice", "Bob", "Charlie", "Diana"],
})

result = pd.merge(orders, customers, on="customer_id", how="right")
print(result)
```

```text
# Output:
   order_id  customer_id  amount     name
0    1001.0          201   250.0    Alice
1    1003.0          201   420.0    Alice
2    1002.0          202   180.0      Bob
3       NaN          203     NaN  Charlie
4       NaN          204     NaN    Diana
```

### Outer Join

Keep **everything** from both DataFrames.

```python
import pandas as pd

q1 = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Monitor"],
    "q1_revenue": [50000, 8000, 25000],
})

q2 = pd.DataFrame({
    "product": ["Mouse", "Monitor", "Keyboard"],
    "q2_revenue": [9500, 28000, 12000],
})

result = pd.merge(q1, q2, on="product", how="outer")
print(result)
```

```text
# Output:
    product  q1_revenue  q2_revenue
0    Laptop     50000.0         NaN
1     Mouse      8000.0      9500.0
2   Monitor     25000.0     28000.0
3  Keyboard         NaN     12000.0
```

## Different Column Names: left_on / right_on

When the join columns have different names in each table.

```python
import pandas as pd

sales = pd.DataFrame({
    "sale_id": [1, 2, 3, 4],
    "rep_code": ["R01", "R02", "R01", "R03"],
    "amount": [15000, 22000, 18000, 31000],
})

reps = pd.DataFrame({
    "employee_code": ["R01", "R02", "R03"],
    "rep_name": ["Alice", "Bob", "Charlie"],
    "region": ["North", "South", "West"],
})

# Column names differ — use left_on and right_on
result = pd.merge(sales, reps, left_on="rep_code", right_on="employee_code", how="left")
print(result)
```

```text
# Output:
   sale_id rep_code  amount employee_code rep_name region
0        1      R01   15000           R01    Alice  North
1        2      R02   22000           R02      Bob  South
2        3      R01   18000           R01    Alice  North
3        4      R03   31000           R03  Charlie   West
```

## Multi-Key Merges

Join on multiple columns when a single column isn't unique enough.

```python
import pandas as pd

revenue = pd.DataFrame({
    "year": [2023, 2023, 2024, 2024],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "revenue": [150000, 175000, 180000, 195000],
})

targets = pd.DataFrame({
    "year": [2023, 2023, 2024, 2024],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "target": [160000, 170000, 190000, 200000],
})

result = pd.merge(revenue, targets, on=["year", "quarter"])
result["vs_target"] = result["revenue"] - result["target"]
result["hit_target"] = result["vs_target"] >= 0
print(result)
```

```text
# Output:
   year quarter  revenue  target  vs_target  hit_target
0  2023      Q1   150000  160000     -10000       False
1  2023      Q2   175000  170000       5000        True
2  2024      Q1   180000  190000     -10000       False
3  2024      Q2   195000  200000      -5000       False
```

## Merge Indicator — Debug Your Joins

The `indicator=True` parameter shows you exactly which rows matched and which didn't.

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5],
    "product_id": [101, 102, 103, 101, 105],
})

products = pd.DataFrame({
    "product_id": [101, 102, 104],
    "product_name": ["Laptop", "Mouse", "Keyboard"],
})

result = pd.merge(orders, products, on="product_id", how="outer", indicator=True)
print(result)
print("\nMatch summary:")
print(result["_merge"].value_counts())
```

```text
# Output:
   order_id  product_id product_name      _merge
0       1.0         101       Laptop        both
1       4.0         101       Laptop        both
2       2.0         102        Mouse        both
3       3.0         103          NaN   left_only
4       5.0         105          NaN   left_only
5       NaN         104     Keyboard  right_only

Match summary:
_merge
both          3
left_only     2
right_only    1
Name: count, dtype: int64
```

<div class="interview-tip">

**Interview Tip:** Always use `indicator=True` when debugging unexpected merge results. If your row count explodes after a merge, you likely have a many-to-many join. If rows disappear, your keys don't match. The indicator column tells you exactly what happened.

</div>

## Validate Your Merges

Catch many-to-many joins before they blow up your data.

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3],
    "customer_id": [101, 102, 101],
})

customers = pd.DataFrame({
    "customer_id": [101, 102],
    "name": ["Alice", "Bob"],
})

# This should be many-to-one (many orders, one customer)
result = pd.merge(orders, customers, on="customer_id", validate="many_to_one")
print("Validation passed — merge is many-to-one")
print(result)
```

```text
# Output:
Validation passed — merge is many-to-one
   order_id  customer_id   name
0         1          101  Alice
1         3          101  Alice
2         2          102    Bob
```

## pd.concat() — Stack DataFrames

Use `concat` when you have the **same structure** and want to stack vertically or horizontally.

```python
import pandas as pd

jan = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Monitor"],
    "revenue": [50000, 8000, 25000],
    "month": ["Jan", "Jan", "Jan"],
})

feb = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard"],
    "revenue": [55000, 7500, 12000],
    "month": ["Feb", "Feb", "Feb"],
})

mar = pd.DataFrame({
    "product": ["Laptop", "Monitor", "Keyboard"],
    "revenue": [48000, 28000, 15000],
    "month": ["Mar", "Mar", "Mar"],
})

# Vertical stack
combined = pd.concat([jan, feb, mar], ignore_index=True)
print(combined)
```

```text
# Output:
    product  revenue month
0    Laptop    50000   Jan
1     Mouse     8000   Jan
2   Monitor    25000   Jan
3    Laptop    55000   Feb
4     Mouse     7500   Feb
5  Keyboard    12000   Feb
6    Laptop    48000   Mar
7   Monitor    28000   Mar
8  Keyboard    15000   Mar
```

### Horizontal Concat

```python
import pandas as pd

info = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "department": ["Sales", "Engineering", "Marketing"],
})

metrics = pd.DataFrame({
    "revenue": [85000, 72000, 61000],
    "deals": [15, 8, 12],
})

# Side by side
combined = pd.concat([info, metrics], axis=1)
print(combined)
```

```text
# Output:
      name   department  revenue  deals
0    Alice        Sales    85000     15
1      Bob  Engineering    72000      8
2  Charlie    Marketing    61000     12
```

## Real-World Example: Full Sales Report

```python
import pandas as pd

# Three separate data sources — typical in real analytics
orders = pd.DataFrame({
    "order_id": [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008],
    "customer_id": [201, 202, 203, 201, 204, 202, 205, 203],
    "product_id": [301, 302, 301, 303, 302, 301, 304, 303],
    "quantity": [2, 1, 3, 1, 2, 1, 4, 2],
    "order_date": pd.to_datetime(["2024-01-05", "2024-01-08", "2024-01-12",
                                   "2024-01-15", "2024-01-20", "2024-01-22",
                                   "2024-01-25", "2024-01-28"]),
})

customers = pd.DataFrame({
    "customer_id": [201, 202, 203, 204],
    "name": ["Alice Corp", "Bob LLC", "Charlie Inc", "Diana Co"],
    "segment": ["Enterprise", "SMB", "Enterprise", "Mid-Market"],
})

products = pd.DataFrame({
    "product_id": [301, 302, 303, 304],
    "product_name": ["CRM Pro", "Analytics Lite", "Data Warehouse", "AI Suite"],
    "unit_price": [5000, 2000, 15000, 8000],
})

# Build the full report
report = (
    orders
    .merge(customers, on="customer_id", how="left")
    .merge(products, on="product_id", how="left")
)
report["total"] = report["quantity"] * report["unit_price"]

print("=== Full Sales Report ===")
print(report[["order_id", "name", "product_name", "quantity", "unit_price", "total", "segment"]])

print(f"\n=== Revenue by Segment ===")
print(report.groupby("segment")["total"].sum().sort_values(ascending=False))

print(f"\n=== Revenue by Product ===")
print(report.groupby("product_name")["total"].sum().sort_values(ascending=False))
```

```text
# Output:
=== Full Sales Report ===
   order_id         name    product_name  quantity  unit_price  total     segment
0      1001   Alice Corp         CRM Pro         2        5000  10000  Enterprise
1      1002      Bob LLC  Analytics Lite         1        2000   2000         SMB
2      1003  Charlie Inc         CRM Pro         3        5000  15000  Enterprise
3      1004   Alice Corp  Data Warehouse         1       15000  15000  Enterprise
4      1005     Diana Co  Analytics Lite         2        2000   4000  Mid-Market
5      1006      Bob LLC         CRM Pro         1        5000   5000         SMB
6      1007          NaN        AI Suite         4        8000  32000         NaN
7      1008  Charlie Inc  Data Warehouse         2       15000  30000  Enterprise

=== Revenue by Segment ===
segment
Enterprise    70000
Mid-Market     4000
SMB            7000
Name: total, dtype: int64

=== Revenue by Product ===
product_name
AI Suite          32000
Data Warehouse    45000
CRM Pro           30000
Analytics Lite     6000
Name: total, dtype: int64
```

## Where This Is Used on the Job

- **Enriching transaction data** — merging orders with customer demographics, product catalogs
- **Building fact tables** — combining dimensions in star/snowflake schemas
- **Consolidating reports** — concatenating monthly CSVs into annual datasets
- **Cross-referencing sources** — matching CRM records with payment data
- **Data migration** — merging old and new system data during transitions

<div class="challenge">

### Challenge: Multi-Table Sales Analysis

```python
import pandas as pd

transactions = pd.DataFrame({
    "txn_id": range(1, 11),
    "rep_id": [1, 2, 1, 3, 2, 1, 3, 4, 2, 1],
    "product_id": [10, 20, 30, 10, 20, 30, 10, 20, 30, 10],
    "amount": [5000, 3000, 8000, 4500, 3200, 7500, 5500, 2800, 9000, 4000],
})

reps = pd.DataFrame({
    "rep_id": [1, 2, 3],
    "rep_name": ["Alice", "Bob", "Charlie"],
    "region": ["North", "South", "West"],
})

products = pd.DataFrame({
    "product_id": [10, 20, 30],
    "product_name": ["CRM", "Analytics", "Warehouse"],
    "category": ["SaaS", "SaaS", "Infrastructure"],
})
```

Tasks:
1. Merge all three tables into one report (use left joins to keep all transactions)
2. Which rep had the highest total revenue?
3. Which product generated the most revenue?
4. Find transactions from rep_id 4 — why don't they have a name? How would you handle this?
5. Calculate revenue by region and product category using the merged data

</div>

## Common Interview Questions

### Q1: What is the difference between merge, join, and concat in Pandas?

**Answer:** `pd.merge()` combines DataFrames based on common columns (like SQL JOINs) — it's the most flexible and commonly used. `.join()` is a convenience method that merges on the index by default — useful when your join key is the index. `pd.concat()` stacks DataFrames either vertically (appending rows with `axis=0`) or horizontally (adding columns with `axis=1`) — it doesn't match on keys, just aligns by position or index. Use `merge` for relational joins, `concat` for stacking similar datasets.

### Q2: What happens when a merge produces more rows than either input?

**Answer:** This indicates a many-to-many join — the key columns have duplicates in both DataFrames. Each matching combination creates a row, causing a Cartesian product on the matching keys. For example, if customer_id 101 appears 3 times in orders and 2 times in customers, you'll get 3×2 = 6 rows for that customer. This is usually a bug. Use `validate="many_to_one"` or `validate="one_to_many"` to catch it early, or deduplicate one table before merging.

### Q3: How do you handle mismatched keys in a merge?

**Answer:** Use a left join (`how="left"`) to keep all rows from your primary table and fill non-matching rows with NaN. Add `indicator=True` to see which rows matched and which didn't. After merging, check `result["_merge"].value_counts()` to understand the match rate. If many rows are `left_only`, your keys may need cleaning — check for whitespace, case mismatches, or different ID formats between tables.

### Q4: When would you use `pd.concat()` instead of `pd.merge()`?

**Answer:** Use `concat` when combining DataFrames with the same structure — stacking monthly reports into an annual dataset, combining CSVs from different regions, or appending new data to existing data. Use `merge` when combining DataFrames with different structures that share a common key — like adding customer names to an orders table. `concat` is about appending; `merge` is about enriching.

### Q5: How do you merge DataFrames when the key columns have different names?

**Answer:** Use the `left_on` and `right_on` parameters: `pd.merge(df1, df2, left_on="emp_id", right_on="employee_id")`. This creates both columns in the result — drop the duplicate with `.drop(columns=["employee_id"])`. Alternatively, rename the column before merging: `df2.rename(columns={"employee_id": "emp_id"})` then use the standard `on="emp_id"` parameter.
