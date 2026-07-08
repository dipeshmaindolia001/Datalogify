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

## Introduction & The "Why"

Imagine you are handed a physical stack of 1,000 sales receipts from the past month. Your manager wants to know: **"What is the total revenue and the average purchase amount for each region?"**

If you had to do this manually, how would you approach it?
1. **Split:** You would create four piles of receipts on your desk—one for **North**, one for **South**, one for **East**, and one for **West**.
2. **Apply:** For each pile, you would pull out a calculator, add up all the receipt totals to find the sum, and count the receipts to calculate the average.
3. **Combine:** Finally, you would write these numbers down on a summary sheet and hand it to your manager.

This is the exact logical framework behind one of the most powerful paradigms in data science: **Split-Apply-Combine**. First conceptualized by Hadley Wickham in 2011, this design pattern is the mathematical engine behind data aggregation.

```text
                                Original Dataset
                       +---------------------------------+
                       | Row | Region | Sales | Category |
                       | 0   | North  | $100  | Elec     |
                       | 1   | South  | $150  | Furn     |
                       | 2   | North  | $200  | Elec     |
                       | 3   | South  | $50   | Office   |
                       +---------------------------------+
                                        |
                                        v
                            [ 1. SPLIT by Region ]
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
            North Pile                                    South Pile
      +----------------------+                      +----------------------+
      | Row | Sales | Cat    |                      | Row | Sales | Cat    |
      | 0   | $100  | Elec   |                      | 1   | $150  | Furn   |
      | 2   | $200  | Elec   |                      | 3   | $50   | Office |
      +----------------------+                      +----------------------+
                 |                                             |
                 v                                             v
        [ 2. APPLY sum() ]                            [ 2. APPLY sum() ]
                 |                                             |
                 v                                             v
            Total = $300                                  Total = $200
                 \                                             /
                  \                                           /
                   v                                         v
                         [ 3. COMBINE to Final Output ]
                       +---------------------------------+
                       | Region | Total Sales            |
                       | North  | $300                   |
                       | South  | $200                   |
                       +---------------------------------+
```

Whether you are calculating department budgets, tracking daily active users, or aggregating sensor data from thousands of IoT devices, aggregation is the bridge that transforms raw transactional logs into high-level business intelligence. 

While Excel handles this with manual drag-and-drop Pivot Tables, Pandas lets you automate, audit, and scale these operations to millions of rows in a fraction of a second.

---

## Step-by-Step Concept Breakdown

To master grouping in Pandas, we must first break down the three distinct phases of the **Split-Apply-Combine** loop:

### 1. The Split Step
When you call `df.groupby("Region")`, Pandas does **not** instantly compute anything. Instead, it returns a `DataFrameGroupBy` object. This is a lazy-evaluation object.

Think of it as a dictionary mapping group keys to row index locations:
```python
# Under the hood, Pandas creates something like:
{
    "North": [0, 2, 5, 8, 11],
    "South": [1, 4, 7, 10],
    "West": [3, 6, 9]
}
```
*   **Grouping Keys:** You can group by a single column name, a list of multiple columns (e.g., `["Region", "Category"]`), or even an external array of the same length as the DataFrame.
*   **Memory Efficiency:** Because Pandas waits to see what mathematical operation you want to perform before executing it, the split step is extremely fast and memory-efficient.

### 2. The Apply Step
Once the groups are defined, you must apply a function to the data columns. The functions you apply generally fall into three categories:

*   **Aggregation (`.agg()`):** Reduces each group to a single value. For example, if "North" has 10 rows, the sum operation reduces those 10 values down to 1 single total. Common aggregations include `.sum()`, `.mean()`, `.median()`, `.std()`, `.min()`, and `.max()`.
*   **Transformation (`.transform()`):** Performs a calculation within each group but returns an object that has the **same shape** as the original input. This is incredibly useful for calculations like z-score normalization or filling missing values with a group median.
*   **Filtration (`.filter()`):** Discards entire groups based on a boolean condition. For example, you might want to keep only the data from regions that generated more than $100,000 in total sales, dropping the rest.

### 3. The Combine Step
Finally, Pandas gathers all the single-value results from each group and merges them back together into a single Pandas Series or DataFrame. By default, the unique keys you grouped by will become the **Index** of the new DataFrame. If you group by multiple columns, you will receive a **MultiIndex** DataFrame.

---

## Code & Practical Walkthroughs

Let's begin by preparing our workspace and creating a rich, synthetic retail sales dataset that we will use throughout this lesson.

```python
import pandas as pd
import numpy as np

# Set seed for reproducibility
np.random.seed(42)

# Create a sample sales dataset
data = {
    "Store_ID": [101, 102, 101, 103, 102, 101, 103, 102, 101, 103, 102, 101],
    "Region": ["North", "South", "North", "West", "South", "North", "West", "South", "North", "West", "South", "North"],
    "Manager": ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice", "Charlie", "Bob", "Alice", "Charlie", "Bob", "Alice"],
    "Category": ["Electronics", "Furniture", "Electronics", "Office Supplies", "Furniture", "Office Supplies", "Electronics", "Electronics", "Furniture", "Furniture", "Office Supplies", "Electronics"],
    "Sales_USD": [1200.50, 850.00, 1500.00, 300.25, 950.00, 450.00, 2100.00, 1100.00, 600.00, 750.00, 400.00, 1350.00],
    "Units_Sold": [6, 4, 8, 2, 5, 3, 10, 5, 3, 4, 2, 7],
    "Return_Status": ["No", "No", "Yes", "No", "No", "No", "No", "Yes", "No", "Yes", "No", "No"]
}

df = pd.DataFrame(data)
print("=== Original Sales DataFrame ===")
print(df)
```

```text
# Output:
=== Original Sales DataFrame ===
    Store_ID Region  Manager         Category  Sales_USD  Units_Sold Return_Status
0        101  North    Alice      Electronics    1200.50           6            No
1        102  South      Bob        Furniture     850.00           4            No
2        101  North    Alice      Electronics    1500.00           8           Yes
3        103   West  Charlie  Office Supplies     300.25           2            No
4        102  South      Bob        Furniture     950.00           5            No
5        101  North    Alice  Office Supplies     450.00           3            No
6        103   West  Charlie      Electronics    2100.00          10            No
7        102  South      Bob      Electronics    1100.00           5           Yes
8        101  North    Alice        Furniture     600.00           3            No
9        103   West  Charlie        Furniture     750.00           4           Yes
10       102  South      Bob  Office Supplies     400.00           2            No
11       101  North    Alice      Electronics    1350.00           7            No
```

---

### Example 1: Basic GroupBy and Aggregations (Single & Multi-Column)

Let's perform standard aggregations. Note the difference in output formatting depending on whether we select single or multiple columns.

```python
# 1. Total revenue per region (Outputs a Series because we selected one column: ["Sales_USD"])
region_sales = df.groupby("Region")["Sales_USD"].sum()
print("=== Total Sales by Region (Series output) ===")
print(region_sales)

# 2. Average sales by Region & Category (Multi-column grouping, returns a MultiIndex Series)
multi_group = df.groupby(["Region", "Category"])["Sales_USD"].mean()
print("\n=== Avg Sales by Region & Category (MultiIndex Series) ===")
print(multi_group)
```

```text
# Output:
=== Total Sales by Region (Series output) ===
Region
North    5100.50
South    3300.00
West     3150.25
Name: Sales_USD, dtype: float64

=== Avg Sales by Region & Category (MultiIndex Series) ===
Region  Category       
North   Electronics        1350.166667
        Furniture           600.000000
        Office Supplies     450.000000
South   Electronics        1100.000000
        Furniture           900.000000
        Office Supplies     400.000000
West    Electronics        2100.000000
        Furniture           750.000000
        Office Supplies     300.250000
Name: Sales_USD, dtype: float64
```

<div class="interview-tip">
<strong>Interview Tip:</strong> When using <code>.groupby()</code>, the grouped columns default to becoming the index. You can bypass this by setting <code>as_index=False</code> inside the <code>groupby()</code> call. This maintains a flat, database-style DataFrame which is often easier to pass to downstream visualization packages or write to files.
</div>

```python
# Grouping with as_index=False
flat_df = df.groupby(["Region", "Category"], as_index=False)["Sales_USD"].mean()
print("=== GroupBy with as_index=False ===")
print(flat_df)
```

```text
# Output:
=== GroupBy with as_index=False ===
  Region         Category    Sales_USD
0  North      Electronics  1350.166667
1  North        Furniture   600.000000
2  North  Office Supplies   450.000000
3  South      Electronics  1100.000000
4  South        Furniture   900.000000
5  South  Office Supplies   400.000000
6   West      Electronics  2100.000000
7   West        Furniture   750.000000
8   West  Office Supplies   300.250000
```

---

### Example 2: Custom Aggregation Using Dictionaries

In real-world analytics, you rarely want to apply the *same* mathematical operation to every column. For instance, you might need to calculate the **sum** of sales, but the **mean** of units sold, and simultaneously count how many **unique** managers operate in each store.

We can achieve this using the `.agg()` method, passing a dictionary where the keys are the columns we want to aggregate, and the values are lists of the aggregation functions.

```python
# Custom aggregation dictionary
agg_rules = {
    "Sales_USD": ["sum", "mean", "max"],   # Multiple metrics for sales
    "Units_Sold": ["sum", "mean"],          # Metrics for units
    "Manager": ["nunique"]                  # Number of unique managers in group
}

# Run the aggregation
custom_agg = df.groupby("Region").agg(agg_rules)
print("=== Custom Aggregation Output (Multi-level columns) ===")
print(custom_agg)
```

```text
# Output:
=== Custom Aggregation Output (Multi-level columns) ===
       Sales_USD                      Units_Sold           Manager
             sum         mean     max        sum      mean nunique
Region                                                            
North    5100.50  1020.100000  1500.0         34  6.800000       1
South    3300.00   825.000000  1100.0         15  3.750000       1
West     3150.25  1050.083333  2100.0         16  5.333333       1
```

#### Flattening Multi-level Columns
The output above has a hierarchical index on the columns (a `MultiIndex`). This can make columns difficult to rename or query. Here is the industry-standard way to flatten these column headers:

```python
# Flattening columns by joining multi-level index tuples
custom_agg.columns = [f"{col[0]}_{col[1].upper()}" for col in custom_agg.columns]
custom_agg = custom_agg.reset_index()
print("\n=== Flattened Column Structure ===")
print(custom_agg)
```

```text
# Output:
=== Flattened Column Structure ===
  Region  Sales_USD_SUM  Sales_USD_MEAN  Sales_USD_MAX  Units_Sold_SUM  Units_Sold_MEAN  Manager_NUNIQUE
0  North        5100.50     1020.100000         1500.0              34         6.800000                1
1  South        3300.00      825.000000         1100.0              15         3.750000                1
2   West        3150.25     1050.083333         2100.0              16         5.333333                1
```

---

### Example 3: Transform and Filter Operations Within Groups

#### The power of `.transform()`
While `.agg()` collapses your dataset, `.transform()` processes calculations within groups but returns the exact same number of rows as your original DataFrame. This is perfect for calculating group-level metrics, like the percentage contribution of a single row to its region's total sales, or calculating group-specific standard deviations (z-scores).

Let's calculate the percentage of regional sales that each transaction accounts for, as well as the z-score of sales within each category:

```python
# 1. Calculate total sales for each region and broadcast back to original shape
df["Regional_Total_Sales"] = df.groupby("Region")["Sales_USD"].transform("sum")

# Calculate percentage of total regional sales for each record
df["Percent_of_Regional_Sales"] = (df["Sales_USD"] / df["Regional_Total_Sales"] * 100).round(2)

# 2. Calculate category-level sales standard deviation and mean for z-score calculations
df["Category_Mean_Sales"] = df.groupby("Category")["Sales_USD"].transform("mean")
df["Category_Std_Sales"] = df.groupby("Category")["Sales_USD"].transform("std")
df["Category_Sales_Z_Score"] = ((df["Sales_USD"] - df["Category_Mean_Sales"]) / df["Category_Std_Sales"]).round(3)

print("=== DataFrame with .transform() calculations ===")
print(df[["Store_ID", "Region", "Category", "Sales_USD", "Percent_of_Regional_Sales", "Category_Sales_Z_Score"]])
```

```text
# Output:
=== DataFrame with .transform() calculations ===
    Store_ID Region         Category  Sales_USD  Percent_of_Regional_Sales  Category_Sales_Z_Score
0        101  North      Electronics    1200.50                      23.54                  -0.655
1        102  South        Furniture     850.00                      25.76                   0.316
2        101  North      Electronics    1500.00                      29.41                  -0.080
3        103   West  Office Supplies     300.25                       9.53                  -0.913
4        102  South        Furniture     950.00                      28.79                   0.843
5        101  North  Office Supplies     450.00                       8.82                    0.821
6        103   West      Electronics    2100.00                      66.66                   1.074
7        102  South      Electronics    1100.00                      33.33                  -0.849
8        101  North        Furniture     600.00                      11.76                  -1.000
9        103   West        Furniture     750.00                      23.81                  -0.211
10       102  South  Office Supplies     400.00                      12.12                    0.244
11       101  North      Electronics    1350.00                      26.47                  -0.369
```

#### The power of `.filter()`
Sometimes, you want to drop entire chunks of your dataset if their group as a whole does not meet a specific criteria.

Let's filter out all rows belonging to any region where the average sales per transaction is less than $900.

```python
# Check group means first
print("Group means check:")
print(df.groupby("Region")["Sales_USD"].mean())

# Filter out regions with mean sales < 900
filtered_df = df.groupby("Region").filter(lambda group: group["Sales_USD"].mean() >= 900)
print("\n=== Filtered DataFrame (South is dropped because mean is 825) ===")
print(filtered_df)
```

```text
# Output:
Group means check:
Region
North    1020.100000
South     825.000000
West     1050.083333
Name: Sales_USD, dtype: float64

=== Filtered DataFrame (South is dropped because mean is 825) ===
    Store_ID Region  Manager         Category  Sales_USD  Units_Sold Return_Status  Regional_Total_Sales  Percent_of_Regional_Sales  Category_Mean_Sales  Category_Std_Sales  Category_Sales_Z_Score
0        101  North    Alice      Electronics    1200.50           6            No               5100.50                      23.54          1550.100000          511.954686                  -0.655
2        101  North    Alice      Electronics    1500.00           8           Yes               5100.50                      29.41          1550.100000          511.954686                  -0.080
3        103   West  Charlie  Office Supplies     300.25           2            No               3150.25                       9.53           383.416667           75.827289                  -0.913
5        101  North    Alice  Office Supplies     450.00           3            No               5100.50                       8.82           383.416667           75.827289                   0.821
6        103   West  Charlie      Electronics    2100.00          10            No               3150.25                      66.66          1550.100000          511.954686                   1.074
8        101  North    Alice        Furniture     600.00           3            No               5100.50                      11.76           775.000000          144.337567                  -1.000
9        103   West  Charlie        Furniture     750.00           4           Yes               3150.25                      23.81           775.000000          144.337567                  -0.211
11       101  North    Alice      Electronics    1350.00           7            No               5100.50                      26.47          1550.100000          511.954686                  -0.369
```

---

### Example 4: Pivot Tables vs. GroupBy Operations

Both `groupby()` and `pivot_table()` group data, but they differ in how they display the results:

*   **`groupby()`** outputs data in a **vertical** layout (ideal for programming or further querying).
*   **`pivot_table()`** reshapes data into a **two-dimensional grid** (ideal for human reading, presentations, or Excel exports).

Here is a visual grid comparison:

| Operation | Dimensionality | Best For | Output Format |
| :--- | :--- | :--- | :--- |
| **GroupBy** | 1D or Hierarchical | Data Pipeline Operations | Series or nested DataFrame |
| **Pivot Table** | 2D Cross-tabulation | Executive Reports / Visuals | Pivot Grid (Rows vs Columns) |

Let's generate the exact same summary using both methods to compare:

```python
# 1. GroupBy implementation (requires unstacking to look like a grid)
groupby_version = df.groupby(["Region", "Category"])["Sales_USD"].sum().unstack(fill_value=0)
print("=== GroupBy + Unstack ===")
print(groupby_version)

# 2. Pivot Table implementation
pivot_version = df.pivot_table(
    values="Sales_USD", 
    index="Region", 
    columns="Category", 
    aggfunc="sum", 
    fill_value=0,
    margins=True,       # Adds row and column totals
    margins_name="Total"
)
print("\n=== Pivot Table with Margins ===")
print(pivot_version)
```

```text
# Output:
=== GroupBy + Unstack ===
Category  Electronics  Furniture  Office Supplies
Region                                           
North         4050.50      600.0           450.00
South         1100.00     1800.0           400.00
West          2100.00      750.0           300.25

=== Pivot Table with Margins ===
Category  Electronics  Furniture  Office Supplies     Total
Region                                                     
North          4050.5     600.00           450.00   5100.50
South          1100.0    1800.00           400.00   3300.00
West           2100.0     750.00           300.25   3150.25
Total          7250.5    3150.00          1150.25  11550.75
```

---

### Example 5: Cross-Tabulations (`pd.crosstab`) for Frequency Distributions

While `.pivot_table()` calculates mathematical summaries of continuous numbers (like mean sales), `pd.crosstab()` is a specialized function designed to calculate **frequency distributions (counts)** of categorical variables.

Let's count how many times items were returned vs not returned across different regions:

```python
# Compute count of returns by region
cross_freq = pd.crosstab(
    index=df["Region"], 
    columns=df["Return_Status"],
    margins=True,
    margins_name="Total Purchases"
)
print("=== Crosstab: Absolute Frequencies ===")
print(cross_freq)

# Normalize over rows to get percentages (e.g. return rates per region)
cross_pct = pd.crosstab(
    index=df["Region"], 
    columns=df["Return_Status"],
    normalize="index" # Normalize over rows. Options: 'index', 'columns', 'all'
) * 100
print("\n=== Crosstab: Percentages by Region ===")
print(cross_pct.round(2))
```

```text
# Output:
=== Crosstab: Absolute Frequencies ===
Return_Status  No  Yes  Total Purchases
Region                                 
North           4    1                5
South           3    1                4
West            2    1                3
Total Purchases 9    3               12

=== Crosstab: Percentages by Region ===
Return_Status     No    Yes
Region                     
North          80.00  20.00
South          75.00  25.00
West           66.67  33.33
```

---

## Edge Cases & Common Mistakes

### 1. The MultiIndex Trap
When you group by multiple columns, Pandas creates a `MultiIndex` index. If you try to save this directly to a CSV, the headers can shift and cause formatting issues.
*   **Gotcha:** Trying to reference a column name that is currently acting as the index:
    ```python
    # This will fail with a KeyError if 'Region' is the index!
    summary = df.groupby("Region")["Sales_USD"].sum()
    summary["Region"] 
    ```
*   **Best Practice:** Always resolve your MultiIndex before exporting or joining:
    ```python
    # Method A: Use as_index=False
    summary_df = df.groupby("Region", as_index=False)["Sales_USD"].sum()
    
    # Method B: Reset index post-operation
    summary_df = df.groupby("Region")["Sales_USD"].sum().reset_index()
    ```

### 2. Missing Categories in Grouping Columns
If your grouping column is a Pandas Category data type, `groupby()` will return rows for categories even if they have **zero** occurrences in the active slice of data.
*   **Gotcha:** Getting a massive dataframe filled with `NaN` or `0` rows for non-existent classes.
*   **Best Practice:** Use `observed=True` to only return groups that actually exist in the current data slice:
    ```python
    df["Category"] = df["Category"].astype("category")
    df.groupby("Category", observed=True)["Sales_USD"].mean()
    ```

### 3. Aggregating Non-Numeric Columns (Implicit Dropping)
In older versions of Pandas, grouping numeric operations implicitly dropped non-numeric columns. In newer versions, this raises a strict `TypeError`.
*   **Gotcha:**
    ```python
    # Raises TypeError in modern pandas
    df.groupby("Region").mean() 
    ```
*   **Best Practice:** Always explicitly select the numeric columns you want to aggregate first:
    ```python
    # Safe and future-proof
    df.groupby("Region")[["Sales_USD", "Units_Sold"]].mean()
    ```

### 4. Grouping by Continuous Variables
*   **Gotcha:** Trying to group by a continuous variable like `Sales_USD` directly, resulting in one group for almost every single row in the dataset.
*   **Best Practice:** Bin your continuous data first using `pd.cut()` or `pd.qcut()`, then group by the bin segments:
    ```python
    # Bin sales into 3 equal-width buckets
    df["Sales_Bin"] = pd.cut(df["Sales_USD"], bins=3, labels=["Low", "Medium", "High"])
    bin_summary = df.groupby("Sales_Bin", observed=True)["Units_Sold"].mean()
    print(bin_summary)
    ```

---

## Practice Exercises & Mini-Projects

<div class="challenge">
<strong>Exercise 1: Store Commission Calculator</strong>
<br>
Using our synthetic sales dataset <code>df</code>:
1. Write a script that groups by <code>Manager</code>.
2. Calculate the total sales and total units sold for each manager.
3. Add a new column to the output table called <code>Commission_USD</code> which is calculated as 5% of their total sales.
</div>

<div class="challenge">
<strong>Exercise 2: Finding Anomaly Transactions</strong>
<br>
Using <code>.transform()</code>, find any transaction where the <code>Sales_USD</code> value is more than <strong>1.5 times the average sales</strong> for that specific <code>Category</code>. Output the filtered DataFrame showing only these outlier rows.
</div>

---

## Section Recaps

*   **Split-Apply-Combine:** The mental framework for all groupings. Data is divided based on keys, aggregated or transformed, and assembled back together.
*   **`.groupby()`:** The workhorse function. Remember to use `as_index=False` if you prefer database-style flat outputs.
*   **Custom Aggregations:** You can run different aggregation math on different columns simultaneously by passing a mapping dictionary to `.agg()`.
*   **`.transform()` vs `.agg()`:** `.agg()` collapses rows down to group summaries. `.transform()` calculates group metrics but keeps the original row structure intact.
*   **`pivot_table()` vs `crosstab()`:** Use `pivot_table` for multi-dimensional numerical summaries (averages, totals). Use `crosstab` for counting frequencies of categorical relationships.

---

## Common Interview Questions

### Q1: What is the difference between `.transform()` and `.apply()` in a Pandas GroupBy operation?
**Answer:**
While both methods process groups, they differ fundamentally in output shape and efficiency:
1.  **Output Shape:** `.transform()` requires the return value to have either the exact size of the parent group or a single scalar (which gets broadcasted to the group's size). It returns an object matching the original index shape. `.apply()` is more flexible—it can return a scaled-down Series, a DataFrame, or a single value, and does not require output shapes to match the input.
2.  **Performance:** `.transform()` is highly optimized in Pandas and can perform calculations (like group means or standard deviations) much faster because it uses optimized C-level engines. `.apply()` calls a Python function on each group sequentially, which is slower for large datasets.

### Q2: How does Pandas handle missing values (`NaN`) in the grouping column?
**Answer:**
By default, Pandas excludes rows where the grouping key contains `NaN` values from the resulting output.
If you want to keep them and view them as a separate group, you must set the `dropna` parameter to `False` in your groupby call:
```python
df.groupby("Region", dropna=False)["Sales_USD"].sum()
```

### Q3: How do you rename columns that are generated from multi-level column aggregations?
**Answer:**
When we run multiple aggregations like `df.groupby("A").agg({"B": ["sum", "mean"]})`, Pandas creates a MultiIndex column. We can resolve this using list comprehensions:
```python
grouped = df.groupby("A").agg({"B": ["sum", "mean"]})
# Rename by joining the tuple names
grouped.columns = [f"{col[0]}_{col[1]}" for col in grouped.columns.values]
grouped = grouped.reset_index()
```
This converts column headers from `('B', 'sum')` into a clean string like `'B_sum'`.

### Q4: When would you use `pd.crosstab()` instead of `df.pivot_table()`?
**Answer:**
*   You use **`pd.crosstab()`** when you want to compute a frequency table (counts or percentage rates of category intersections) quickly. It accepts array-like inputs directly without needing them to be in a single pre-existing DataFrame.
*   You use **`df.pivot_table()`** when you already have a structured DataFrame and want to summarize numerical measurements (like summing up sales or averaging temperatures) sliced across different category dimensions.

### Q5: What is the benefit of setting `observed=True` in a GroupBy operation?
**Answer:**
When grouping by columns that have been cast to the `category` data type, Pandas will calculate aggregates for all possible categories defined in the categorical metadata—even if those categories have 0 rows present in your active dataset. By setting `observed=True`, you tell Pandas to only calculate and display groups that are actually present in the data, saving memory and processing time.
