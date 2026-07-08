---
title: "Pandas Intro — DataFrames, Loading, and Exploration"
description: "Master Pandas Series and DataFrames, read data from multiple sources, and perform exploratory data analysis (EDA)."
category: "python"
order: 102
phase: 1
tags: ["python", "pandas", "dataframes", "eda"]
publishedDate: 2025-02-02
prevSlug: "numpy-essentials"
nextSlug: "pandas-data-cleaning"
seoTitle: "Pandas Intro Tutorial for Data Analytics | Datalogify"
seoDescription: "Master Pandas Series and DataFrames, read data from multiple sources, and perform exploratory data analysis (EDA)."
---

## Why This Matters: The Relational Bridge

In the previous lesson, we explored NumPy, which provides the memory-efficient foundation for numerical computations in Python. While NumPy arrays are incredibly fast, they have limitations when it comes to real-world data analysis:
1. **They must be homogeneous:** Every element in an array must share the same data type. You cannot easily store a database table containing customer names (strings), signup dates (datetimes), and order values (floats) in a single NumPy array.
2. **They lack labeled indexes:** Accessing columns by position (`data[:, 4]`) is prone to errors. If a column is added or rearranged, your entire pipeline breaks.

**Pandas** solves these issues. It introduces labeled, heterogeneous data structures that feel like a relational database table or spreadsheet, but with the full power of Python's ecosystem behind them.

Whether you are building machine learning models, cleaning dirty transactional records, or calculating business metrics, Pandas is the tool you will use for 90% of your workflow. Learning Pandas isn't just about syntax; it's about learning how to structure, slice, and query data in memory.

---

## The Visual Analogy: The Multi-Sheet Spreadsheet

Imagine you have a multi-sheet Microsoft Excel workbook loaded directly into your computer's high-speed memory.

```text
  Excel Worksheet (DataFrame)
  ┌─────────────────────────────────────────────────────────────┐
  │      Index      │  Customer_ID  │   Region   │  Order_Val   │ <-- Column Names
  ├─────────────────┼───────────────┼────────────┼──────────────┤
  │        0        │     C101      │   North    │    150.25    │
  ├─────────────────┼───────────────┼────────────┼──────────────┤
  │        1        │     C102      │   South    │     85.00    │
  ├─────────────────┼───────────────┼────────────┼──────────────┤
  │        2        │     C103      │   West     │    420.50    │
  └─────────────────┴───────────────┴────────────┴──────────────┘
           ^
       Row Labels (Index)
```

* **The Spreadsheet Tab** is your **DataFrame**. It is a two-dimensional grid with rows and columns.
* **A Single Column** is a **Series**. It is a one-dimensional array where every entry has a row label (called the **Index**).
* **The Row Index** (on the far left) is the set of labels for the rows. Unlike Excel, where rows are strictly 1, 2, 3, etc., a Pandas index can be integers, strings (e.g., store names), or timestamps.

---

## Series vs. DataFrames

Let's break down the two core data structures in Pandas.

### 1. Pandas Series
A Series is a one-dimensional labeled array capable of holding any data type (integers, strings, floats, Python objects). It has two main components:
* **The Index:** Labeled coordinates for the data.
* **The Values:** The underlying NumPy array containing the actual elements.

```python
import pandas as pd

# Creating a Series from a list
revenue = pd.Series([45000, 52000, 48000], index=["Q1", "Q2", "Q3"], name="Quarterly Sales")
print(revenue)
print("\nIndex: ", revenue.index)
print("Values:", revenue.values)
print("Dtype: ", revenue.dtype)
```

```text
# Output:
Q1    45000
Q2    52000
Q3    48000
Name: Quarterly Sales, dtype: int64

Index:  Index(['Q1', 'Q2', 'Q3'], dtype='object')
Values: [45000 52000 48000]
Dtype:  int64
```

### 2. Pandas DataFrame
A DataFrame is a two-dimensional, size-mutable, tabular data structure with labeled axes (rows and columns). Structurally, you can think of a DataFrame as **a dictionary of Series objects that share the same index**.

```python
# Creating a DataFrame from a dictionary of lists
data = {
    "Region": ["North", "South", "East", "West"],
    "Sales": [120000, 98000, 145000, 87000],
    "Active": [True, True, False, True]
}

df = pd.DataFrame(data)
print(df)
```

```text
# Output:
  Region   Sales  Active
0  North  120000    True
1  South   98000    True
2   East  145000   False
3   West   87000    True
```

Notice that Pandas automatically assigned an integer index starting at `0` for the rows.

---

## Ingesting Data from External Sources

In real-world analytics, data resides in databases, CSV files, cloud storage, or third-party APIs. Pandas provides robust reader functions to ingest these sources.

```text
              ┌───────────────┐
              │  CSV Files    │ ───> pd.read_csv()
              ├───────────────┤
              │  Excel Files  │ ───> pd.read_excel()
 Sources ───> ├───────────────┤                      ───> Pandas DataFrame
              │  JSON Payloads│ ───> pd.read_json()
              ├───────────────┤
              │  SQL DB / DW  │ ───> pd.read_sql()
              └───────────────┘
```

### 1. Reading CSV Files
CSV (Comma-Separated Values) is the most common format. The `pd.read_csv` function has dozens of parameters to help parse files correctly.

```python
import pandas as pd

# Standard CSV read with custom options
df_csv = pd.read_csv(
    "dataset.csv",          # File path or URL
    sep=",",                # Column delimiter (defaults to comma)
    header=0,               # Use row 0 as column headers
    index_col="customer_id",# Set a specific column as the row index
    usecols=["customer_id", "signup_date", "revenue"], # Only load these columns
    parse_dates=["signup_date"]  # Automatically parse this column as a datetime
)
```

### 2. Reading Excel Files
Excel workbooks often contain multiple sheets. We can specify which sheet to load.

```python
# Read sheet 'Q4_2025' using the openpyxl engine
df_excel = pd.read_excel(
    "financial_report.xlsx",
    sheet_name="Q4_2025",
    engine="openpyxl"
)
```

### 3. Reading JSON Payloads
JSON is the standard format for web APIs and modern log files. You can configure how the nested key-value pairs are translated to a table using the `orient` parameter.

```python
# Reading records-oriented JSON (list of dictionaries)
# Example JSON: [{"id": 1, "val": 10}, {"id": 2, "val": 20}]
df_json = pd.read_json("api_response.json", orient="records")
```

### 4. Reading from SQL Databases
To query databases directly, you combine Pandas with SQLAlchemy, Python's SQL toolkit.

```python
from sqlalchemy import create_engine
import pandas as pd

# 1. Establish database connection using SQLAlchemy
# Dialect: PostgreSQL, User: analyst, Host: localhost, Database: analytics
engine = create_engine("postgresql://analyst:secure_pwd@localhost:5432/analytics")

# 2. Write the SQL query
sql_query = """
    SELECT customer_id, country, order_value
    FROM transactions
    WHERE order_date >= '2026-01-01'
"""

# 3. Load directly into a DataFrame
df_sql = pd.read_sql(sql_query, con=engine)
```

---

## Basic Data Exploration: Checking the Vitals

Before cleaning or modeling, you must inspect the structure and properties of your DataFrame. Let's look at five essential commands for exploratory data analysis (EDA).

Suppose we have loaded the following retail transactions dataset:

```python
import numpy as np
import pandas as pd

# Creating a mock retail DataFrame
df = pd.DataFrame({
    "OrderID": [1001, 1002, 1003, 1004, 1005],
    "Date": pd.to_datetime(["2026-07-01", "2026-07-02", "2026-07-02", "2026-07-03", "2026-07-04"]),
    "Region": ["North", "South", "North", "West", np.nan],
    "Revenue": [250.50, 89.99, 1200.00, 450.00, 310.25],
    "Items": [3, 1, 12, np.nan, 4]
})
```

### 1. Shape: Checking the Grid Dimensions
`.shape` returns a tuple showing the number of rows and columns. It is an attribute, not a method, so you do not call it with parentheses.

```python
print("DataFrame Shape:", df.shape)
```

```text
# Output:
DataFrame Shape: (5, 5)
```

### 2. Head and Tail: Quick Visual Inspections
`.head(n)` returns the first $n$ rows, and `.tail(n)` returns the last $n$ rows. This is useful for checking if headers loaded correctly and scanning the data structure.

```python
print("First 2 rows:")
print(df.head(2))
```

```text
# Output:
First 2 rows:
   OrderID       Date Region  Revenue  Items
0     1001 2026-07-01  North   250.50    3.0
1     1002 2026-07-02  South    89.99    1.0
```

### 3. Info: Inspecting Data Types and Missing Values
`.info()` provides a comprehensive summary of the DataFrame:
* The index type and number of entries.
* The column names and counts of non-null values.
* The data type (`dtype`) of each column.
* The memory usage.

```python
df.info()
```

```text
# Output:
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 5 entries, 0 to 4
Data columns (total 5 columns):
 #   Column   Non-Null Count  Dtype         
---  ------   --------------  -----         
 0   OrderID  5 non-null      int64         
 1   Date     5 non-null      datetime64[ns]
 2   Region   4 non-null      object        
 3   Revenue  5 non-null      float64       
 4   Items    4 non-null      float64       
dtypes: datetime64[ns](1), float64(2), int64(1), object(1)
memory usage: 328.0 + bytes
```

<div class="interview-tip">
In <code>df.info()</code>, pay close attention to columns with type <code>object</code>. In Pandas, <code>object</code> typically indicates string data, mixed types, or complex Python objects. If a column that should be numeric (like Revenue) shows as <code>object</code>, it means there are dirty text characters (like "$" or commas) preventing Pandas from treating it as a float.
</div>

### 4. Describe: Calculating Summary Statistics
`.describe()` calculates summary statistics. By default, it runs on numeric columns, showing count, mean, standard deviation, min, percentiles, and max.

```python
print(df.describe())
```

```text
# Output:
           OrderID      Revenue      Items
count     5.000000     5.000000   4.000000
mean   1003.000000   460.148000   5.000000
std       1.581139   434.908488   4.760952
min    1001.000000    89.990000   1.000000
25%    1002.000000   250.500000   2.500000
50%    1003.000000   310.250000   3.500000
75%    1004.000000   450.000000   6.000000
max    1005.000000  1200.000000  12.000000
```

To describe non-numeric columns, use the `include` parameter:

```python
print(df.describe(include=["object", "datetime"]))
```

```text
# Output:
                       Date Region
count                     5      4
unique                    4      3
top     2026-07-02 00:00:00  North
freq                      2      2
```

---

## Selecting Columns: Bracket vs. Dot Notation

There are two primary ways to select a single column from a DataFrame. While both return a Pandas Series, they have different limitations.

### 1. Dot Notation (`df.column_name`)
This is clean and easy to read, but it has three major limitations:
* **No spaces:** If a column name has spaces (e.g. `"Order Value"`), dot notation is invalid syntax (`df.Order Value` causes a SyntaxError).
* **Conflict with methods:** If a column is named `mean`, `count`, or `shape`, `df.mean` will access the DataFrame's built-in `mean` method rather than your column!
* **No assignment:** You cannot create a new column using dot notation (e.g., `df.new_col = [1,2,3]` will add an attribute to the DataFrame object rather than a database column).

### 2. Bracket Notation (`df['column_name']`)
This is the preferred approach for production code. It works with spaces, column names that match methods, and allows you to create new columns.

```python
# Creating a new column using bracket notation
df["SalesTax"] = df["Revenue"] * 0.08
print(df[["OrderID", "Revenue", "SalesTax"]])
```

```text
# Output:
   OrderID  Revenue  SalesTax
0     1001   250.50    20.040
1     1002    89.99     7.199
2     1003  1200.00    96.000
3     1004   450.00    36.000
4     1005   310.25    24.820
```

To select multiple columns, pass a list of column names inside the brackets: `df[['col1', 'col2']]`.

```python
# Pass a list of columns -> returns a DataFrame
sub_df = df[["Date", "Revenue"]]
print(sub_df)
```

```text
# Output:
        Date  Revenue
0 2026-07-01   250.50
1 2026-07-02    89.99
2 2026-07-02  1200.00
3 2026-07-03   450.00
4 2026-07-04   310.25
```

---

## Slicing & Indexing Rows: `.loc` vs. `.iloc`

Selecting rows in Pandas is done using `.loc` and `.iloc`. Understanding the difference between these two indexers is key to writing clean, bug-free data pipelines.

```text
         Loc vs. Iloc Comparison
  ┌─────────────────────────────────────────────────────────────┐
  │       Feature      │      .loc[]       │      .iloc[]       │
  ├────────────────────┼───────────────────┼────────────────────┤
  │ Indexing type      │ Label-based       │ Position-based     │
  │ Reference key      │ Column/Row names  │ Integer indexes    │
  │ Slice bounds       │ Inclusive of stop │ Exclusive of stop  │
  │                    │ e.g., 'A':'C'     │ e.g., 0:3          │
  │                    │ (includes C)      │ (excludes index 3) │
  └────────────────────┴───────────────────┴────────────────────┘
```

Let's illustrate the difference. We will define a custom index for our DataFrame:

```python
# Set the Row Index to string labels
df_indexed = df.set_index("Region")
print(df_indexed)
```

```text
# Output:
        OrderID       Date  Revenue  Items  SalesTax
Region                                              
North      1001 2026-07-01   250.50    3.0    20.040
South      1002 2026-07-02    89.99    1.0     7.199
North      1003 2026-07-02  1200.00   12.0    96.000
West       1004 2026-07-03   450.00    NaN    36.000
NaN        1005 2026-07-04   310.25    4.0    24.820
```

### 1. Label-Based Indexing with `.loc`
`.loc` references the explicit labels of your index and columns.

```python
# Get the row labeled 'West' (returns a Series)
print(df_indexed.loc["West"])
```

```text
# Output:
OrderID                  1004
Date      2026-07-03 00:00:00
Revenue                 450.0
Items                     NaN
SalesTax                 36.0
Name: West, dtype: object
```

You can slice using label boundaries. **Unlike standard Python slicing, label slicing includes the stop value.**

```python
# Slice rows from 'South' to 'West', and select 'Date' through 'Revenue' columns
print(df_indexed.loc["South":"West", "Date":"Revenue"])
```

```text
# Output:
             Date  Revenue
Region                    
South  2026-07-02    89.99
North  2026-07-02  1200.00
West   2026-07-03   450.00
```

### 2. Position-Based Indexing with `.iloc`
`.iloc` references the 0-indexed integer position of your data, ignoring label names.

```python
# Get the first row (index position 0)
print(df_indexed.iloc[0])
```

```text
# Output:
OrderID                  1001
Date      2026-07-01 00:00:00
Revenue                 250.5
Items                     3.0
SalesTax                20.04
Name: North, dtype: object
```

Slicing with `.iloc` behaves like standard Python slicing. **The stop integer is exclusive.**

```python
# Slice rows from index position 1 up to (but excluding) 4
# Slice columns from index position 1 up to (but excluding) 3
print(df_indexed.iloc[1:4, 1:3])
```

```text
# Output:
             Date  Revenue
Region                    
South  2026-07-02    89.99
North  2026-07-02  1200.00
West   2026-07-03   450.00
```

### 3. Boolean Indexing with `.loc`
You can pass boolean expressions directly into `.loc` to filter rows:

```python
# Filter rows where Revenue > 300, return only OrderID and Revenue columns
high_value = df_indexed.loc[df_indexed["Revenue"] > 300, ["OrderID", "Revenue"]]
print(high_value)
```

```text
# Output:
        OrderID  Revenue
Region                  
North      1003  1200.00
West       1004   450.00
NaN        1005   310.25
```

---

## Common Gotchas & Best Practices

### The SettingWithCopyWarning
This is the most common warning in Pandas. It occurs when you perform a modification on an object that was sliced from another DataFrame. This is known as **chained assignment**.

```python
# DANGER: Avoid this!
df_high = df[df["Revenue"] > 300]
df_high["Flag"] = "VIP"  # This triggers the warning
```

#### Why does this happen?
When you write `df[df["Revenue"] > 300]`, Pandas has to decide whether to return a new copy of the data or a view pointing back to the original memory layout. If it returns a view, modifying `df_high` will alter `df`. If it returns a copy, your modification won't touch `df`. 

Because this behavior can be unpredictable, Pandas issues a warning.

#### The Solutions:
1. **If you want to modify a subset and keep it separate**, explicitly copy it using `.copy()`:
   ```python
   df_high = df[df["Revenue"] > 300].copy()
   df_high["Flag"] = "VIP"  # Safe!
   ```
2. **If you want to modify the original DataFrame**, use `.loc` in a single assignment step:
   ```python
   df.loc[df["Revenue"] > 300, "Flag"] = "VIP"  # Safe and clean!
   ```

---

## Practice Exercises

### Exercise 1: Load and Query an HR Dataset
You have a DataFrame of employee records.
1. Load the data.
2. Display the general properties of the dataset (columns, rows, data types).
3. Find the median salary.
4. Extract the name and department of all employees who earn more than the median salary.

```python
import pandas as pd

# Creating mock HR dataset
hr_df = pd.DataFrame({
    "EmployeeID": [101, 102, 103, 104, 105],
    "Name": ["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince", "Evan Wright"],
    "Department": ["HR", "Engineering", "Engineering", "Marketing", "HR"],
    "Salary": [65000, 115000, 95000, 78000, 62000]
})

# Write your solution below:
# 1. General properties
print(f"Shape: {hr_df.shape}")
print(hr_df.info())

# 2. Median salary
median_sal = hr_df["Salary"].median()
print(f"Median Salary: {median_sal}")

# 3. High earners using .loc
high_earners = hr_df.loc[hr_df["Salary"] > median_sal, ["Name", "Department"]]
print("\nHigh Earners:")
print(high_earners)
```

```text
# Output:
Shape: (5, 4)
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 5 entries, 0 to 4
Data columns (total 4 columns):
 #   Column      Non-Null Count  Dtype 
---  ------      --------------  ----- 
 0   EmployeeID  5 non-null      int64 
 1   Name        5 non-null      object
 2   Department  5 non-null      object
 3   Salary      5 non-null      int64 
dtypes: int64(2), object(2)
memory usage: 288.0 + bytes
None
Median Salary: 78000.0

High Earners:
            Name   Department
1      Bob Jones  Engineering
2  Charlie Brown  Engineering
```

### Exercise 2: Row Slicing Challenge
Given the HR DataFrame above, set the index to `EmployeeID` and complete the following slices:
1. Extract rows with positions 1 through 3 (using `.iloc`).
2. Extract the name and salary of Employee IDs 102 and 104 (using `.loc`).

```python
# Set index
hr_indexed = hr_df.set_index("EmployeeID")

# 1. Extract rows by position
print("iloc[1:4]:")
print(hr_indexed.iloc[1:4])

# 2. Extract specific records by label
print("\nloc[[102, 104], ['Name', 'Salary']]:")
print(hr_indexed.loc[[102, 104], ["Name", "Salary"]])
```

```text
# Output:
iloc[1:4]:
                     Name   Department  Salary
EmployeeID                                    
102             Bob Jones  Engineering  115000
103         Charlie Brown  Engineering   95000
104          Diana Prince    Marketing   78000

loc[[102, 104], ['Name', 'Salary']]:
                    Name  Salary
EmployeeID                      
102            Bob Jones  115000
104         Diana Prince   78000
```

---

## Section Recaps

* **Pandas Data Structures**: A Series is a 1D labeled array. A DataFrame is a 2D labeled grid where columns are Series objects sharing a common index.
* **Data Ingestion**: Use `pd.read_csv`, `pd.read_excel`, `pd.read_json`, and `pd.read_sql` to import data from various storage systems.
* **Data Exploration**: Run `.shape` for table dimensions, `.head()` for visual verification, `.info()` to check non-null counts and memory usage, and `.describe()` for summary statistics.
* **Column Selection**: Use bracket notation `df['col']` to avoid syntax conflicts and support column creation.
* **Row Access**: Use label-based selection `.loc` (inclusive of boundaries) and position-based selection `.iloc` (exclusive of the stop boundary).
* **SettingWithCopyWarning**: Avoid chained assignment (`df[df['val'] > 1]['flag'] = True`). Use `.loc[condition, 'col'] = True` to modify values in place.

---

## Common Interview Questions

### Q1: What is the difference between a Pandas Series and a 1D NumPy array?
**Answer:**
A Pandas Series is built on top of a 1D NumPy array, but they differ in two main ways:
1. **Index Labels:** A NumPy array is indexed using only zero-based integers. A Series has a labeled index, allowing you to access elements using strings, datetimes, or non-consecutive integers.
2. **Alignment:** When you perform arithmetic operations on two Series, Pandas automatically aligns the data based on index labels rather than positions. If the indexes do not match, Pandas inserts `NaN` for missing labels instead of throwing an error.

---

### Q2: What is the difference between `.loc` and `.iloc` in Pandas?
**Answer:**
* **`.loc` is label-based.** You reference rows and columns using their string labels or index values. Slices in `.loc` are **inclusive** of both start and stop boundaries (e.g. `df.loc['A':'C']` returns 'A', 'B', and 'C').
* **`.iloc` is integer position-based.** You reference elements using their 0-indexed integer position, similar to standard Python lists. Slices in `.iloc` are **exclusive** of the stop boundary (e.g. `df.iloc[0:2]` returns rows at position 0 and 1).

---

### Q3: Why does Pandas throw a `SettingWithCopyWarning`, and how do you resolve it?
**Answer:**
The `SettingWithCopyWarning` is triggered when you try to modify a DataFrame that was created by slicing another DataFrame (chained assignment, such as `df[df['col'] > 5]['flag'] = 1`). 

Pandas throws this warning because it cannot guarantee whether the slice is a copy or a view of the original memory buffer. If it's a copy, the modification won't affect the original DataFrame, which can lead to hard-to-detect bugs.

To resolve this warning:
1. Use `.loc` to perform the filtering and assignment in a single, explicit step:
   ```python
   df.loc[df["col"] > 5, "flag"] = 1
   ```
2. If you explicitly want to create a new, independent DataFrame, use the `.copy()` method:
   ```python
   sub_df = df[df["col"] > 5].copy()
   sub_df["flag"] = 1
   ```

---

### Q4: How would you optimize memory usage when loading a massive CSV file into Pandas?
**Answer:**
To load large CSV files efficiently, you can:
1. **Specify column data types:** Use the `dtype` parameter in `pd.read_csv` to load numeric columns into smaller integer or float types (e.g. `int8`, `float32`) instead of the default `int64` or `float64`.
2. **Filter columns on load:** Use the `usecols` parameter to read only the columns needed for your analysis, skipping unused data.
3. **Load in chunks:** Use the `chunksize` parameter to process the file in smaller batches of rows rather than loading the entire file into memory at once.
4. **Categorical type conversion:** Set low-cardinality string columns to the `category` data type to save memory.

---

### Q5: What is the risk of using dot notation (`df.column_name`) to reference or create columns?
**Answer:**
Using dot notation carries three main risks:
1. **Syntax Conflicts:** If a column name contains spaces or special characters, dot notation is invalid Python syntax.
2. **Namespace Overlaps:** If a column name matches an existing DataFrame method or attribute (such as `mean`, `count`, `plot`, or `shape`), Pandas will reference the method rather than the column data.
3. **Creation Limitations:** You cannot create a new column using dot notation (e.g. `df.new_col = 1`). It will simply attach a temporary property to the Python object without adding the column to the underlying DataFrame.
