---
title: "Intro to Pandas — Your Data Analytics Superpower"
description: "Get started with Pandas DataFrames — loading, exploring, filtering, and aggregating data like a pro."
category: "python"
order: 102
phase: 1
tags: ["python", "pandas", "dataframe", "data-analysis"]
publishedDate: 2025-01-19
prevSlug: "numpy-essentials"
nextSlug: "pandas-data-cleaning"
seoTitle: "Pandas for Data Analytics Beginners — DataFrames, Filtering, GroupBy | Datalogify"
seoDescription: "Learn Pandas DataFrames from scratch — create, explore, filter, and aggregate data with hands-on examples."
---

## Why This Matters

Pandas is the #1 Python library for data analytics. If Python is the language, Pandas is the verb. Every analyst job description lists it. Every data pipeline uses it. Let's get you productive fast.

## Creating DataFrames

A DataFrame is a table — rows and columns, like a spreadsheet or SQL table. The most common way to create one is from a dictionary.

```python
import pandas as pd

# Sales team data
df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, 112000, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

print(df)
```

```text
# Output:
            name region  q1_sales  q2_sales  deals_closed
0     Sarah Chen  North    142000    155000            28
1   James Wilson  South     98000    112000            19
2   Maria Garcia  North    175000    168000            32
3      David Kim   West    215000    228000            41
4      Lisa Wang  South    128000    135000            24
```

### From a List of Dicts

```python
import pandas as pd

# Each dict is a row — this is how API/JSON data usually looks
records = [
    {"product": "Laptop",   "category": "Electronics", "price": 999.99, "stock": 45},
    {"product": "Mouse",    "category": "Electronics", "price": 29.99,  "stock": 200},
    {"product": "Notebook", "category": "Stationery",  "price": 4.99,   "stock": 500},
    {"product": "Monitor",  "category": "Electronics", "price": 349.99, "stock": 30},
    {"product": "Pen Set",  "category": "Stationery",  "price": 12.99,  "stock": 150},
]

df = pd.DataFrame(records)
print(df)
```

```text
# Output:
    product     category   price  stock
0    Laptop  Electronics  999.99     45
1     Mouse  Electronics   29.99    200
2  Notebook  Stationery     4.99    500
3   Monitor  Electronics  349.99     30
4   Pen Set  Stationery    12.99    150
```

## Exploring Your Data

These are the first commands you run on any new dataset. Every single time.

### .head() and .tail()

```python
import pandas as pd

df = pd.DataFrame({
    "date": pd.date_range("2025-01-01", periods=20, freq="D"),
    "revenue": [1200, 1350, 980, 1500, 1420, 1680, 1100, 1750, 1320, 1890,
                1450, 1620, 1280, 1950, 1380, 1720, 1560, 2100, 1480, 1830]
})

print("=== First 5 rows ===")
print(df.head())
print()
print("=== Last 3 rows ===")
print(df.tail(3))
```

```text
# Output:
=== First 5 rows ===
        date  revenue
0 2025-01-01     1200
1 2025-01-02     1350
2 2025-01-03      980
3 2025-01-04     1500
4 2025-01-05     1420

=== Last 3 rows ===
         date  revenue
17 2025-01-18     2100
18 2025-01-19     1480
19 2025-01-20     1830
```

### .shape, .columns, .dtypes

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, 112000, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

print(f"Shape: {df.shape}")          # (rows, columns)
print(f"Rows: {df.shape[0]}")
print(f"Columns: {df.shape[1]}")
print()
print(f"Column names:\n{df.columns.tolist()}")
print()
print(f"Data types:\n{df.dtypes}")
```

```text
# Output:
Shape: (5, 5)
Rows: 5
Columns: 5

Column names:
['name', 'region', 'q1_sales', 'q2_sales', 'deals_closed']

Data types:
name            object
region          object
q1_sales         int64
q2_sales         int64
deals_closed     int64
dtype: object
```

### .info() — The Full Picture

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", None, "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, None, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

df.info()
```

```text
# Output:
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 5 entries, 0 to 4
Data columns (total 5 columns):
 #   Column        Non-Null Count  Dtype
---  ------        --------------  -----
 0   name          4 non-null      object
 1   region        5 non-null      object
 2   q1_sales      5 non-null      int64
 3   q2_sales      4 non-null      float64
 4   deals_closed  5 non-null      int64
dtypes: float64(1), int64(2), object(2)
memory usage: 328.0+ bytes
```

Notice: `name` has 4 non-null (one is `None`), and `q2_sales` became `float64` because `None` forced the column from int to float. This is a common Pandas gotcha.

### .describe() — Statistical Summary

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang",
             "Tom Brown", "Amy Lee", "John Park", "Emma Davis", "Mike Chen"],
    "region": ["North", "South", "North", "West", "South",
               "East", "West", "North", "East", "South"],
    "salary": [95000, 78000, 88000, 110000, 72000,
               83000, 105000, 92000, 76000, 81000],
    "years_exp": [5, 2, 4, 8, 1, 3, 7, 4, 2, 3]
})

print(df.describe())
```

```text
# Output:
            salary   years_exp
count    10.000000   10.000000
mean     88000.000    3.900000
std      12537.926    2.183046
min      72000.000    1.000000
25%      78750.000    2.250000
50%      85500.000    3.500000
75%      95750.000    5.250000
max     110000.000    8.000000
```

What each stat means:
- **count** — non-null values (check for missing data)
- **mean** — average
- **std** — standard deviation (spread of data)
- **min/max** — range of values
- **25%/50%/75%** — quartiles (50% = median)

<div class="interview-tip">

**Where this is used in real jobs:** `.describe()` is step one of any exploratory data analysis (EDA). Before building a model or dashboard, you check for outliers (compare min/max to mean), missing data (count vs expected rows), and data distribution (is std large relative to mean?).

</div>

## Selecting Columns

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, 112000, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

# Single column — returns a Series
names = df["name"]
print(type(names))
print(names)
```

```text
# Output:
<class 'pandas.core.series.Series'>
0      Sarah Chen
1    James Wilson
2    Maria Garcia
3       David Kim
4       Lisa Wang
Name: name, dtype: object
```

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, 112000, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

# Multiple columns — returns a DataFrame
sales_data = df[["name", "q1_sales", "q2_sales"]]
print(type(sales_data))
print(sales_data)
```

```text
# Output:
<class 'pandas.core.frame.DataFrame'>
            name  q1_sales  q2_sales
0     Sarah Chen    142000    155000
1   James Wilson     98000    112000
2   Maria Garcia    175000    168000
3      David Kim    215000    228000
4      Lisa Wang    128000    135000
```

### Creating New Columns

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, 112000, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

# Add calculated columns
df["total_sales"] = df["q1_sales"] + df["q2_sales"]
df["growth"] = (df["q2_sales"] - df["q1_sales"]) / df["q1_sales"]
df["avg_deal_size"] = (df["total_sales"] / df["deals_closed"]).round(0)

print(df[["name", "total_sales", "growth", "avg_deal_size"]])
```

```text
# Output:
            name  total_sales    growth  avg_deal_size
0     Sarah Chen       297000  0.091549        10607.0
1   James Wilson       210000  0.142857        11053.0
2   Maria Garcia       343000 -0.040000        10719.0
3      David Kim       443000  0.060465        10805.0
4      Lisa Wang       263000  0.054688        10958.0
```

## Filtering Rows

Filtering is how you ask questions about your data. "Show me all reps who beat their target." "Which products had negative growth?"

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, 112000, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

df["total_sales"] = df["q1_sales"] + df["q2_sales"]

# Single condition
high_performers = df[df["total_sales"] > 300000]
print("High performers (>$300K total):")
print(high_performers[["name", "total_sales"]])
```

```text
# Output:
High performers (>$300K total):
            name  total_sales
2   Maria Garcia       343000
3      David Kim       443000
```

### Multiple Conditions

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "q1_sales": [142000, 98000, 175000, 215000, 128000],
    "q2_sales": [155000, 112000, 168000, 228000, 135000],
    "deals_closed": [28, 19, 32, 41, 24]
})

df["total_sales"] = df["q1_sales"] + df["q2_sales"]

# AND condition — use & and wrap each condition in parentheses
result = df[(df["total_sales"] > 250000) & (df["region"] == "North")]
print("North region, >$250K:")
print(result[["name", "region", "total_sales"]])

print()

# OR condition — use |
result = df[(df["region"] == "North") | (df["region"] == "West")]
print("North or West:")
print(result[["name", "region", "total_sales"]])

print()

# isin() — cleaner than multiple OR conditions
result = df[df["region"].isin(["North", "West"])]
print("Using isin():")
print(result[["name", "region", "total_sales"]])
```

```text
# Output:
North region, >$250K:
            name region  total_sales
0     Sarah Chen  North       297000
2   Maria Garcia  North       343000

North or West:
            name region  total_sales
0     Sarah Chen  North       297000
2   Maria Garcia  North       343000
3      David Kim   West       443000

Using isin():
            name region  total_sales
0     Sarah Chen  North       297000
2   Maria Garcia  North       343000
3      David Kim   West       443000
```

### String Filtering

```python
import pandas as pd

df = pd.DataFrame({
    "product": ["Wireless Mouse", "USB Keyboard", "Wireless Headphones",
                "USB Hub", "Wireless Charger", "Wired Mouse"],
    "price": [29.99, 49.99, 79.99, 19.99, 34.99, 14.99]
})

# Filter products containing "Wireless"
wireless = df[df["product"].str.contains("Wireless")]
print("Wireless products:")
print(wireless)
```

```text
# Output:
Wireless products:
               product  price
0       Wireless Mouse  29.99
2  Wireless Headphones  79.99
4      Wireless Charger  34.99
```

## .groupby() and .agg() — Aggregation

This is the Pandas equivalent of SQL's `GROUP BY`. It's how you summarize data by categories.

```python
import pandas as pd

df = pd.DataFrame({
    "rep": ["Sarah", "James", "Maria", "David", "Lisa",
            "Sarah", "James", "Maria", "David", "Lisa"],
    "region": ["North", "South", "North", "West", "South",
               "North", "South", "North", "West", "South"],
    "product": ["Laptop", "Mouse", "Laptop", "Monitor", "Keyboard",
                "Monitor", "Laptop", "Mouse", "Laptop", "Monitor"],
    "amount": [999, 30, 999, 350, 80,
               350, 999, 30, 999, 350]
})

# Group by region
region_summary = df.groupby("region")["amount"].agg(["sum", "mean", "count"])
print("Sales by Region:")
print(region_summary)
```

```text
# Output:
Sales by Region:
         sum   mean  count
region
North   2378  594.5      4
South   1459  364.75     4
West    1349  674.5      2
```

### Multiple Aggregations

```python
import pandas as pd

df = pd.DataFrame({
    "rep": ["Sarah", "James", "Maria", "David", "Lisa",
            "Sarah", "James", "Maria", "David", "Lisa"],
    "region": ["North", "South", "North", "West", "South",
               "North", "South", "North", "West", "South"],
    "product": ["Laptop", "Mouse", "Laptop", "Monitor", "Keyboard",
                "Monitor", "Laptop", "Mouse", "Laptop", "Monitor"],
    "amount": [999, 30, 999, 350, 80,
               350, 999, 30, 999, 350]
})

# Custom aggregation per column
summary = df.groupby("region").agg(
    total_revenue=("amount", "sum"),
    avg_deal=("amount", "mean"),
    num_deals=("amount", "count"),
    biggest_deal=("amount", "max")
).reset_index()

print(summary)
```

```text
# Output:
  region  total_revenue  avg_deal  num_deals  biggest_deal
0  North           2378    594.50          4           999
1  South           1459    364.75          4           999
2   West           1349    674.50          2           999
```

### Group by Multiple Columns

```python
import pandas as pd

df = pd.DataFrame({
    "rep": ["Sarah", "James", "Maria", "David", "Lisa",
            "Sarah", "James", "Maria", "David", "Lisa"],
    "region": ["North", "South", "North", "West", "South",
               "North", "South", "North", "West", "South"],
    "product": ["Laptop", "Mouse", "Laptop", "Monitor", "Keyboard",
                "Monitor", "Laptop", "Mouse", "Laptop", "Monitor"],
    "amount": [999, 30, 999, 350, 80,
               350, 999, 30, 999, 350]
})

product_region = df.groupby(["region", "product"])["amount"].sum().reset_index()
product_region.columns = ["region", "product", "total_sales"]
print(product_region)
```

```text
# Output:
  region   product  total_sales
0  North    Laptop         1998
1  North   Monitor          350
2  North     Mouse           30
3  South  Keyboard           80
4  South    Laptop          999
5  South   Monitor          350
6  South     Mouse           30
7   West    Laptop          999
8   West   Monitor          350
```

<div class="interview-tip">

**Where this is used in real jobs:** `groupby()` is the single most-used Pandas method in analytics. "Revenue by region," "average order value by customer segment," "churn rate by signup month" — every business question that starts with "by" maps to a `groupby()`.

</div>

## .sort_values()

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim", "Lisa Wang"],
    "region": ["North", "South", "North", "West", "South"],
    "total_sales": [297000, 210000, 343000, 443000, 263000],
    "deals_closed": [28, 19, 32, 41, 24]
})

# Sort by total sales, descending
top_sellers = df.sort_values("total_sales", ascending=False)
print("Top Sellers:")
print(top_sellers[["name", "total_sales"]].to_string(index=False))

print()

# Sort by multiple columns
sorted_df = df.sort_values(["region", "total_sales"], ascending=[True, False])
print("By Region, then Sales:")
print(sorted_df[["name", "region", "total_sales"]].to_string(index=False))
```

```text
# Output:
Top Sellers:
          name  total_sales
     David Kim       443000
  Maria Garcia       343000
    Sarah Chen       297000
     Lisa Wang       263000
  James Wilson       210000

By Region, then Sales:
          name region  total_sales
  Maria Garcia  North       343000
    Sarah Chen  North       297000
     Lisa Wang  South       263000
  James Wilson  South       210000
     David Kim   West       443000
```

### Getting Top N Results

```python
import pandas as pd

df = pd.DataFrame({
    "product": ["Laptop", "Mouse", "Keyboard", "Monitor", "Webcam",
                "Headset", "Charger", "Cable", "Stand", "Hub"],
    "revenue": [45000, 6000, 12000, 10500, 6750,
                8200, 3500, 1200, 4800, 2100]
})

# Top 3 products by revenue
top3 = df.nlargest(3, "revenue")
print("Top 3 Products:")
print(top3.to_string(index=False))

print()

# Bottom 3
bottom3 = df.nsmallest(3, "revenue")
print("Bottom 3 Products:")
print(bottom3.to_string(index=False))
```

```text
# Output:
Top 3 Products:
 product  revenue
  Laptop    45000
Keyboard    12000
 Monitor    10500

Bottom 3 Products:
 product  revenue
   Cable     1200
     Hub     2100
 Charger     3500
```

<div class="interview-tip">

**Pandas vs SQL — when to use which:**

| Task | Pandas | SQL |
|------|--------|-----|
| Data lives in a database | ❌ Query with SQL first | ✅ |
| Exploratory analysis | ✅ Faster iteration | ❌ |
| Joins on < 10M rows | ✅ | ✅ |
| Joins on > 100M rows | ❌ Too slow | ✅ |
| Complex transformations | ✅ Full Python available | ⚠️ Possible but clunky |
| Quick visualizations | ✅ `.plot()` built-in | ❌ |
| Production pipeline | ⚠️ Depends on scale | ✅ |

**Common Pandas gotcha:** Chained indexing like `df[df["x"] > 5]["y"] = 10` silently fails (SettingWithCopyWarning). Use `.loc[]` instead: `df.loc[df["x"] > 5, "y"] = 10`.

</div>

## Putting It All Together — Full Analysis

```python
import pandas as pd

# Sales dataset
df = pd.DataFrame({
    "rep": ["Sarah", "James", "Maria", "David", "Lisa",
            "Sarah", "James", "Maria", "David", "Lisa",
            "Sarah", "James", "Maria", "David", "Lisa"],
    "region": ["North", "South", "North", "West", "South",
               "North", "South", "North", "West", "South",
               "North", "South", "North", "West", "South"],
    "quarter": ["Q1", "Q1", "Q1", "Q1", "Q1",
                "Q2", "Q2", "Q2", "Q2", "Q2",
                "Q3", "Q3", "Q3", "Q3", "Q3"],
    "revenue": [42000, 28000, 51000, 65000, 38000,
                48000, 32000, 47000, 72000, 41000,
                55000, 35000, 58000, 68000, 45000]
})

# 1. Overview
print(f"Dataset: {df.shape[0]} rows × {df.shape[1]} columns")
print(f"Total Revenue: ${df['revenue'].sum():,}")
print(f"Average Deal: ${df['revenue'].mean():,.2f}")
print()

# 2. Top performer
rep_totals = df.groupby("rep")["revenue"].sum().sort_values(ascending=False)
print("Revenue by Rep:")
for rep, rev in rep_totals.items():
    print(f"  {rep:<8} ${rev:>10,}")
print()

# 3. Regional performance
region_stats = df.groupby("region").agg(
    total=("revenue", "sum"),
    avg=("revenue", "mean"),
    deals=("revenue", "count")
).sort_values("total", ascending=False)

print("Regional Summary:")
print(region_stats)
print()

# 4. Quarter-over-quarter trend
quarterly = df.groupby("quarter")["revenue"].sum()
print("Quarterly Trend:")
for q, rev in quarterly.items():
    print(f"  {q}: ${rev:>10,}")
```

```text
# Output:
Dataset: 15 rows × 4 columns
Total Revenue: $745,000
Average Deal: $49,666.67

Revenue by Rep:
  David    $   205,000
  Maria    $   156,000
  Sarah    $   145,000
  Lisa     $   124,000
  James    $    95,000

Regional Summary:
         total        avg  deals
region
West    205000  68333.333      3
North   301000  50166.667      6
South   219000  36500.000      6

Quarterly Trend:
  Q1: $   224,000
  Q2: $   240,000
  Q3: $   261,000
```

<div class="challenge">

### Challenge: Sales Analysis with Pandas

Create a DataFrame with this data and answer the questions below:

```python
import pandas as pd

df = pd.DataFrame({
    "employee": ["Alice", "Bob", "Charlie", "Diana", "Eve",
                 "Alice", "Bob", "Charlie", "Diana", "Eve"],
    "department": ["Sales", "Sales", "Marketing", "Marketing", "Sales",
                   "Sales", "Sales", "Marketing", "Marketing", "Sales"],
    "month": ["Jan", "Jan", "Jan", "Jan", "Jan",
              "Feb", "Feb", "Feb", "Feb", "Feb"],
    "revenue": [45000, 38000, 22000, 31000, 52000,
                48000, 41000, 25000, 28000, 55000],
    "expenses": [12000, 9500, 8000, 11000, 14000,
                 13000, 10000, 7500, 12000, 15500]
})
```

Tasks:
1. Add a `profit` column (revenue - expenses)
2. Add a `margin` column (profit / revenue, as a decimal)
3. Find the top 3 employees by total profit across both months
4. Calculate average margin by department
5. Find which department had higher total revenue

**Print each answer with clear labels.**

</div>

## Common Interview Questions

### Q1: What is the difference between a Series and a DataFrame?

**A:** A Series is a one-dimensional labeled array — essentially a single column with an index. A DataFrame is a two-dimensional table — a collection of Series sharing the same index. When you select one column from a DataFrame (`df["col"]`), you get a Series. When you select multiple columns (`df[["col1", "col2"]]`), you get a DataFrame. Most Pandas operations return one or the other.

### Q2: How do you handle missing values in Pandas?

**A:** Detection: `df.isnull().sum()` counts missing values per column. Removal: `df.dropna()` drops rows with any NaN. Filling: `df.fillna(0)` replaces NaN with a value, or `df.fillna(df.mean())` fills with column means. Forward/back fill: `df.ffill()` propagates the last valid value. The right approach depends on context — dropping is fine for small amounts of missing data; filling with median is better for skewed distributions.

### Q3: What is the difference between `.loc[]` and `.iloc[]`?

**A:** `.loc[]` selects by **label** (column names, index values): `df.loc[0:3, "name"]` includes row 3. `.iloc[]` selects by **integer position**: `df.iloc[0:3, 0]` excludes position 3 (standard Python slicing). The most common mistake is confusing the two when the index is non-numeric. Use `.loc[]` for label-based access, `.iloc[]` for position-based access.

### Q4: How does `groupby()` work internally?

**A:** `groupby()` follows a split-apply-combine pattern: (1) **Split** the data into groups based on the grouping key, (2) **Apply** a function to each group independently (sum, mean, custom function), (3) **Combine** results into a new DataFrame. It's lazy — the split doesn't actually happen until you call an aggregation. `df.groupby("region")` creates a GroupBy object; `.sum()` triggers the computation. This is analogous to SQL's `GROUP BY` clause.

### Q5: When would you use Pandas `.apply()` vs vectorized operations?

**A:** Always prefer vectorized operations (`df["a"] + df["b"]`) — they run in C under the hood and are 10-100x faster than `.apply()`. Use `.apply()` only when you need complex row-by-row logic that can't be expressed as vector operations (e.g., calling an external API per row, complex conditional logic spanning multiple columns). For column-level transforms, `np.where()` or `pd.cut()` are faster alternatives to `.apply()` with a lambda.
