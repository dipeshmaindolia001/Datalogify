---
title: "Pandas GroupBy & Pivot Tables — Aggregate Like a Pro"
description: "Group, aggregate, and pivot your data — the Pandas operations that replace hours of Excel work in seconds."
category: "python"
order: 105
phase: 1
tags: ["python", "pandas", "groupby", "pivot-table", "aggregation"]
publishedDate: 2025-02-04
prevSlug: "pandas-merging"
nextSlug: "pandas-time-series"
seoTitle: "Pandas GroupBy and Pivot Table Tutorial | Datalogify"
seoDescription: "Master Pandas groupby, agg, transform, pivot_table, and crosstab for powerful data aggregation."
---

## Why This Matters

GroupBy is how you answer questions like "What's the average revenue by region?", "Who's our top rep per quarter?", and "Which product category is growing fastest?" It's the Python equivalent of SQL's GROUP BY — and pivot tables replace the drag-and-drop summaries you'd build in Excel. Faster, reproducible, and scriptable.

## The Dataset

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob",
            "Alice", "Charlie", "Bob", "Alice", "Charlie",
            "Bob", "Alice"],
    "region": ["North", "South", "North", "West", "South",
               "North", "West", "South", "North", "West",
               "South", "North"],
    "product": ["CRM", "Analytics", "Warehouse", "CRM", "CRM",
                "Analytics", "Warehouse", "Analytics", "CRM", "Analytics",
                "Warehouse", "Warehouse"],
    "quarter": ["Q1", "Q1", "Q1", "Q1", "Q2",
                "Q2", "Q2", "Q2", "Q3", "Q3",
                "Q3", "Q3"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
    "deals": [3, 2, 4, 3, 2, 2, 5, 3, 3, 1, 4, 3],
})

print(sales)
```

```text
# Output:
        rep region    product quarter  revenue  deals
0     Alice  North        CRM      Q1    15000      3
1       Bob  South  Analytics      Q1    12000      2
2     Alice  North  Warehouse      Q1    28000      4
3   Charlie   West        CRM      Q1    18000      3
4       Bob  South        CRM      Q2    14000      2
5     Alice  North  Analytics      Q2    11000      2
6   Charlie   West  Warehouse      Q2    32000      5
7       Bob  South  Analytics      Q2    13500      3
8     Alice  North        CRM      Q3    16000      3
9   Charlie   West  Analytics      Q3     9000      1
10      Bob  South  Warehouse      Q3    30000      4
11    Alice  North  Warehouse      Q3    25000      3
```

## Basic GroupBy

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob",
            "Alice", "Charlie", "Bob", "Alice", "Charlie",
            "Bob", "Alice"],
    "region": ["North", "South", "North", "West", "South",
               "North", "West", "South", "North", "West",
               "South", "North"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
    "deals": [3, 2, 4, 3, 2, 2, 5, 3, 3, 1, 4, 3],
})

# Total revenue per rep
print("=== Revenue by Rep ===")
print(sales.groupby("rep")["revenue"].sum().sort_values(ascending=False))

# Average deal size per region
print("\n=== Avg Deal Size by Region ===")
avg_deal = sales.groupby("region").apply(
    lambda x: (x["revenue"].sum() / x["deals"].sum()).round(0)
)
print(avg_deal)

# Count of deals per rep
print("\n=== Deal Count by Rep ===")
print(sales.groupby("rep")["deals"].sum())
```

```text
# Output:
=== Revenue by Rep ===
rep
Alice      95000
Bob        69500
Charlie    59000
Name: revenue, dtype: int64

=== Avg Deal Size by Region ===
region
North    5278.0
South    6318.0
West     6556.0
dtype: float64

=== Deal Count by Rep ===
rep
Alice      15
Bob        11
Charlie     9
Name: deals, dtype: int64
```

## Multi-Column GroupBy

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob",
            "Alice", "Charlie", "Bob", "Alice", "Charlie",
            "Bob", "Alice"],
    "region": ["North", "South", "North", "West", "South",
               "North", "West", "South", "North", "West",
               "South", "North"],
    "quarter": ["Q1", "Q1", "Q1", "Q1", "Q2",
                "Q2", "Q2", "Q2", "Q3", "Q3",
                "Q3", "Q3"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
})

# Revenue by rep AND quarter
result = sales.groupby(["rep", "quarter"])["revenue"].sum().reset_index()
print(result)
```

```text
# Output:
       rep quarter  revenue
0    Alice      Q1    43000
1    Alice      Q2    11000
2    Alice      Q3    41000
3      Bob      Q1    12000
4      Bob      Q2    27500
5      Bob      Q3    30000
6  Charlie      Q1    18000
7  Charlie      Q2    32000
8  Charlie      Q3     9000
```

## .agg() — Multiple Aggregations at Once

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob",
            "Alice", "Charlie", "Bob", "Alice", "Charlie",
            "Bob", "Alice"],
    "region": ["North", "South", "North", "West", "South",
               "North", "West", "South", "North", "West",
               "South", "North"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
    "deals": [3, 2, 4, 3, 2, 2, 5, 3, 3, 1, 4, 3],
})

# Multiple aggregations per column
summary = sales.groupby("rep").agg(
    total_revenue=("revenue", "sum"),
    avg_revenue=("revenue", "mean"),
    max_deal=("revenue", "max"),
    total_deals=("deals", "sum"),
    avg_deals=("deals", "mean"),
).round(0)

print(summary)
```

```text
# Output:
         total_revenue  avg_revenue  max_deal  total_deals  avg_deals
rep
Alice          95000.0      19000.0     28000         15.0        3.0
Bob            69500.0      17375.0     30000         11.0        3.0
Charlie        59000.0      19667.0     32000          9.0        3.0
```

### Dict-Based Aggregation

```python
import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South",
               "North", "West", "South", "North", "West",
               "South", "North"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
    "deals": [3, 2, 4, 3, 2, 2, 5, 3, 3, 1, 4, 3],
})

# Different aggregations for different columns
result = sales.groupby("region").agg({
    "revenue": ["sum", "mean", "count"],
    "deals": ["sum", "max"]
}).round(0)

print(result)
```

```text
# Output:
       revenue                   deals
           sum     mean count     sum max
region
North    95000  19000.0     5      15   4
South    69500  17375.0     4      11   4
West     59000  19667.0     3       9   5
```

## .transform() — Keep Original Shape

`transform` returns a value for every row — same shape as the input. Perfect for adding group-level stats back to each row.

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice"],
    "revenue": [15000, 12000, 28000, 18000, 14000, 11000],
})

# Add each rep's average as a new column
sales["rep_avg"] = sales.groupby("rep")["revenue"].transform("mean")

# Calculate how each sale compares to rep's average
sales["vs_avg"] = sales["revenue"] - sales["rep_avg"]

# Rank within each rep's sales
sales["rank_in_rep"] = sales.groupby("rep")["revenue"].rank(ascending=False).astype(int)

print(sales)
```

```text
# Output:
       rep  revenue  rep_avg  vs_avg  rank_in_rep
0    Alice    15000  18000.0 -3000.0            2
1      Bob    12000  13000.0 -1000.0            2
2    Alice    28000  18000.0 10000.0            1
3  Charlie    18000  18000.0     0.0            1
4      Bob    14000  13000.0  1000.0            1
5    Alice    11000  18000.0 -7000.0            3
```

<div class="interview-tip">

**Interview Tip:** The difference between `agg()` and `transform()` trips up a lot of candidates. `agg()` reduces each group to one row (like SQL GROUP BY). `transform()` broadcasts the result back to every row in the group — same shape as input. Use `transform` when you want to add a group-level calculation as a new column without losing rows.

</div>

## .apply() on Groups

For complex logic that doesn't fit into standard aggregation functions.

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Alice", "Alice", "Bob", "Bob", "Bob",
            "Charlie", "Charlie", "Charlie"],
    "quarter": ["Q1", "Q2", "Q3", "Q1", "Q2", "Q3",
                "Q1", "Q2", "Q3"],
    "revenue": [43000, 11000, 41000, 12000, 27500, 30000,
                18000, 32000, 9000],
})

# Custom function: get the quarter with highest revenue per rep
def best_quarter(group):
    best_idx = group["revenue"].idxmax()
    return pd.Series({
        "best_quarter": group.loc[best_idx, "quarter"],
        "best_revenue": group.loc[best_idx, "revenue"],
        "total_revenue": group["revenue"].sum(),
        "consistency": group["revenue"].std().round(0),
    })

result = sales.groupby("rep").apply(best_quarter, include_groups=False).reset_index()
print(result)
```

```text
# Output:
       rep best_quarter  best_revenue  total_revenue  consistency
0    Alice           Q1       43000.0        95000.0      18330.0
1      Bob           Q3       30000.0        69500.0       9959.0
2  Charlie           Q2       32000.0        59000.0      11590.0
```

## pivot_table() — Excel Pivot Tables in Python

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob",
            "Alice", "Charlie", "Bob", "Alice", "Charlie",
            "Bob", "Alice"],
    "product": ["CRM", "Analytics", "Warehouse", "CRM", "CRM",
                "Analytics", "Warehouse", "Analytics", "CRM", "Analytics",
                "Warehouse", "Warehouse"],
    "quarter": ["Q1", "Q1", "Q1", "Q1", "Q2",
                "Q2", "Q2", "Q2", "Q3", "Q3",
                "Q3", "Q3"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
})

# Revenue by rep and quarter
pivot = pd.pivot_table(
    sales,
    values="revenue",
    index="rep",
    columns="quarter",
    aggfunc="sum",
    fill_value=0,
    margins=True,        # Add row/column totals
    margins_name="Total"
)

print("=== Revenue Pivot: Rep × Quarter ===")
print(pivot)
```

```text
# Output:
=== Revenue Pivot: Rep × Quarter ===
quarter     Q1     Q2     Q3   Total
rep
Alice    43000  11000  41000   95000
Bob      12000  27500  30000   69500
Charlie  18000  32000   9000   59000
Total    73000  70500  80000  223500
```

### Multi-Value Pivot

```python
import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South",
               "North", "West", "South", "North", "West",
               "South", "North"],
    "product": ["CRM", "Analytics", "Warehouse", "CRM", "CRM",
                "Analytics", "Warehouse", "Analytics", "CRM", "Analytics",
                "Warehouse", "Warehouse"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
    "deals": [3, 2, 4, 3, 2, 2, 5, 3, 3, 1, 4, 3],
})

pivot = pd.pivot_table(
    sales,
    values=["revenue", "deals"],
    index="region",
    columns="product",
    aggfunc={"revenue": "sum", "deals": "sum"},
    fill_value=0
)

print(pivot)
```

```text
# Output:
            deals                  revenue
product Analytics CRM Warehouse Analytics   CRM Warehouse
region
North           2   6         7     11000 31000     53000
South           5   2         4     25500 14000     30000
West            1   3         5      9000 18000     32000
```

## pd.crosstab() — Quick Frequency Tables

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob",
            "Alice", "Charlie", "Bob", "Alice", "Charlie",
            "Bob", "Alice"],
    "region": ["North", "South", "North", "West", "South",
               "North", "West", "South", "North", "West",
               "South", "North"],
    "product": ["CRM", "Analytics", "Warehouse", "CRM", "CRM",
                "Analytics", "Warehouse", "Analytics", "CRM", "Analytics",
                "Warehouse", "Warehouse"],
})

# How many deals does each rep have per product?
ct = pd.crosstab(sales["rep"], sales["product"], margins=True)
print("=== Deal Count: Rep × Product ===")
print(ct)

# Percentages
print("\n=== Percentage by Rep ===")
print(pd.crosstab(sales["rep"], sales["product"], normalize="index").round(2) * 100)
```

```text
# Output:
=== Deal Count: Rep × Product ===
product  Analytics  CRM  Warehouse  All
rep
Alice            1    2          2    5
Bob              2    1          1    4
Charlie          1    1          1    3
All              4    4          4   12

=== Percentage by Rep ===
product  Analytics   CRM  Warehouse
rep
Alice        20.0  40.0       40.0
Bob          50.0  25.0       25.0
Charlie      33.0  33.0       33.0
```

## Stack and Unstack

```python
import pandas as pd

sales = pd.DataFrame({
    "rep": ["Alice", "Bob", "Alice", "Charlie", "Bob",
            "Alice", "Charlie", "Bob", "Alice", "Charlie",
            "Bob", "Alice"],
    "quarter": ["Q1", "Q1", "Q1", "Q1", "Q2",
                "Q2", "Q2", "Q2", "Q3", "Q3",
                "Q3", "Q3"],
    "revenue": [15000, 12000, 28000, 18000, 14000,
                11000, 32000, 13500, 16000, 9000,
                30000, 25000],
})

# GroupBy with multi-index
grouped = sales.groupby(["rep", "quarter"])["revenue"].sum()
print("Multi-index result:")
print(grouped)

# Unstack — pivot the inner index level to columns
print("\nUnstacked:")
print(grouped.unstack(fill_value=0))

# Stack — reverse operation, back to multi-index
wide = grouped.unstack(fill_value=0)
print("\nStacked back:")
print(wide.stack())
```

```text
# Output:
Multi-index result:
rep      quarter
Alice    Q1         43000
         Q2         11000
         Q3         41000
Bob      Q1         12000
         Q2         27500
         Q3         30000
Charlie  Q1         18000
         Q2         32000
         Q3          9000
Name: revenue, dtype: int64

Unstacked:
quarter     Q1     Q2     Q3
rep
Alice    43000  11000  41000
Bob      12000  27500  30000
Charlie  18000  32000   9000

Stacked back:
rep      quarter
Alice    Q1         43000
         Q2         11000
         Q3         41000
Bob      Q1         12000
         Q2         27500
         Q3         30000
Charlie  Q1         18000
         Q2         32000
         Q3          9000
dtype: int64
```

## Where This Is Used on the Job

- **Monthly/quarterly reports** — summarize KPIs by team, region, product line
- **Cohort analysis** — group users by signup month, track retention
- **Financial analysis** — pivot revenue by business unit and time period
- **A/B testing** — aggregate metrics by test group, calculate lift
- **Executive dashboards** — pre-aggregate data before visualization

<div class="challenge">

### Challenge: Employee Performance Dashboard

```python
import pandas as pd

performance = pd.DataFrame({
    "employee": ["Alice", "Bob", "Charlie", "Diana", "Eve"] * 4,
    "department": ["Sales", "Sales", "Engineering", "Engineering", "Marketing"] * 4,
    "quarter": ["Q1"]*5 + ["Q2"]*5 + ["Q3"]*5 + ["Q4"]*5,
    "revenue": [45000, 38000, 52000, 61000, 28000,
                48000, 41000, 55000, 58000, 31000,
                42000, 44000, 59000, 65000, 35000,
                51000, 39000, 62000, 70000, 33000],
    "projects": [3, 2, 4, 5, 2, 3, 3, 4, 4, 2,
                 2, 3, 5, 5, 3, 4, 2, 4, 6, 2],
})
```

Tasks:
1. Create a pivot table showing total revenue by employee × quarter
2. Which department had the highest average quarterly revenue?
3. Use `transform` to add each employee's annual average to every row
4. Find the top performer (highest total revenue) per department
5. Create a crosstab of department × quarter showing total projects

</div>

## Common Interview Questions

### Q1: Explain the split-apply-combine pattern in Pandas.

**Answer:** It's how `groupby()` works internally: (1) **Split** — divide the DataFrame into groups based on key values. (2) **Apply** — run a function independently on each group (sum, mean, custom function). (3) **Combine** — merge the results back into a single DataFrame. Example: `df.groupby("region")["revenue"].sum()` splits by region, applies sum to each group's revenue, and combines into a Series. This is the same pattern as SQL's GROUP BY clause.

### Q2: What is the difference between `.agg()` and `.transform()`?

**Answer:** `.agg()` reduces each group to a single row — it changes the shape of your data. `df.groupby("dept")["salary"].agg("mean")` returns one mean per department. `.transform()` returns a value for every original row — same shape as input. `df.groupby("dept")["salary"].transform("mean")` adds the department average to every employee row. Use `agg` for summary tables, `transform` when you need group-level calculations as new columns.

### Q3: How do you create a pivot table in Pandas?

**Answer:** Use `pd.pivot_table(df, values="revenue", index="region", columns="quarter", aggfunc="sum")`. `values` is what you're measuring, `index` becomes rows, `columns` becomes columns, `aggfunc` is the aggregation function. Add `margins=True` for row/column totals, `fill_value=0` for missing combinations. It's the programmatic equivalent of Excel pivot tables — but reproducible and part of your data pipeline.

### Q4: What does `reset_index()` do after a `groupby()`?

**Answer:** After `groupby().agg()`, the grouping columns become the index. `reset_index()` converts them back to regular columns, giving you a flat DataFrame that's easier to work with, merge, or export. Without it, you'd have a multi-level index that makes subsequent operations awkward. It's standard practice to chain `.reset_index()` after groupby aggregations unless you specifically need the hierarchical index.

### Q5: How do you aggregate with multiple functions on different columns?

**Answer:** Use named aggregation: `df.groupby("region").agg(total_rev=("revenue", "sum"), avg_deals=("deals", "mean"))`. Or use a dict: `df.groupby("region").agg({"revenue": ["sum", "mean"], "deals": "count"})`. Named aggregation is cleaner — it produces single-level column names. The dict approach creates MultiIndex columns that you may need to flatten with `df.columns = ["_".join(col) for col in df.columns]`.
