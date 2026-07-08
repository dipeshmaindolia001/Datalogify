---
title: "Pandas Data Cleaning — Handle Messy Real-World Data"
description: "Drop nulls, fill missing values, fix data types, remove duplicates — the skills you'll use in every single analytics project."
category: "python"
order: 102
phase: 1
tags: ["python", "pandas", "data-cleaning", "missing-data"]
publishedDate: 2025-02-02
prevSlug: "numpy-essentials"
nextSlug: "pandas-merging"
seoTitle: "Pandas Data Cleaning Tutorial | Datalogify"
seoDescription: "Master Pandas data cleaning — handle missing values, duplicates, data types, and outliers in real datasets."
---

## Why This Matters

Raw data is always messy. Missing values, wrong types, duplicate rows, inconsistent formatting — you'll spend 60-80% of your time cleaning data before you can analyze anything. Every analyst knows this. The ones who are fast at cleaning are the ones who ship reports on time.

## The Dataset We'll Clean

```python
import pandas as pd
import numpy as np

# Messy employee data — typical of what you'd get from HR exports
df = pd.DataFrame({
    "emp_id": [101, 102, 103, 104, 105, 106, 107, 108, 103, 109],
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim",
             "Lisa Wang", "  Tom Brown ", "ANNA TAYLOR", "bob smith", "Maria Garcia", "Rachel Lee"],
    "department": ["Sales", "Engineering", "Sales", "Marketing", np.nan,
                   "engineering", "SALES", "Marketing", "Sales", "Engineering"],
    "salary": ["75000", "92000", "68000", "71000", "85000",
               "88000", "not available", "77000", "68000", np.nan],
    "hire_date": ["2021-03-15", "2020-07-01", "2022-01-10", "2021-11-22",
                  "2023-06-05", "2019-08-20", "2022-04-15", "2023-01-01",
                  "2022-01-10", "2024-02-28"],
    "rating": [4.2, np.nan, 3.8, 4.5, np.nan, 4.0, 3.5, np.nan, 3.8, 4.1],
})

print(df)
print(f"\nShape: {df.shape}")
```

```text
# Output:
   emp_id           name   department        salary   hire_date  rating
0     101     Sarah Chen        Sales         75000  2021-03-15     4.2
1     102   James Wilson  Engineering         92000  2020-07-01     NaN
2     103   Maria Garcia        Sales         68000  2022-01-10     3.8
3     104      David Kim    Marketing         71000  2021-11-22     4.5
4     105      Lisa Wang          NaN         85000  2023-06-05     NaN
5     106    Tom Brown   engineering         88000  2019-08-20     4.0
6     107    ANNA TAYLOR        SALES  not available  2022-04-15     3.5
7     108      bob smith    Marketing         77000  2023-01-01     NaN
8     103   Maria Garcia        Sales         68000  2022-01-10     3.8
9     109     Rachel Lee  Engineering           NaN  2024-02-28     4.1

Shape: (10, 6)
```

Problems everywhere: missing values, duplicate rows, inconsistent casing, string in a numeric column, extra whitespace, wrong date types. Let's fix them all.

## Step 1: Detect Missing Values

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "emp_id": [101, 102, 103, 104, 105, 106, 107, 108, 103, 109],
    "name": ["Sarah Chen", "James Wilson", "Maria Garcia", "David Kim",
             "Lisa Wang", "  Tom Brown ", "ANNA TAYLOR", "bob smith", "Maria Garcia", "Rachel Lee"],
    "department": ["Sales", "Engineering", "Sales", "Marketing", np.nan,
                   "engineering", "SALES", "Marketing", "Sales", "Engineering"],
    "salary": ["75000", "92000", "68000", "71000", "85000",
               "88000", "not available", "77000", "68000", np.nan],
    "hire_date": ["2021-03-15", "2020-07-01", "2022-01-10", "2021-11-22",
                  "2023-06-05", "2019-08-20", "2022-04-15", "2023-01-01",
                  "2022-01-10", "2024-02-28"],
    "rating": [4.2, np.nan, 3.8, 4.5, np.nan, 4.0, 3.5, np.nan, 3.8, 4.1],
})

# Count nulls per column
print("=== Missing Values ===")
print(df.isnull().sum())
print(f"\nTotal missing: {df.isnull().sum().sum()}")
print(f"\n% missing per column:")
print((df.isnull().mean() * 100).round(1))
```

```text
# Output:
=== Missing Values ===
emp_id        0
name          0
department    1
salary        1
hire_date     0
rating        3

Total missing: 5

% missing per column:
emp_id         0.0
name           0.0
department    10.0
salary        10.0
hire_date      0.0
rating        30.0
dtype: float64
```

## Step 2: Handle Missing Values

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "department": ["Sales", np.nan, "Sales", "Marketing", "Engineering"],
    "salary": [75000, 82000, np.nan, 71000, 85000],
    "rating": [4.2, np.nan, 3.8, np.nan, 4.1],
})

print("Original:")
print(df)

# Drop rows with ANY null
dropped_any = df.dropna()
print(f"\ndropna(): {len(dropped_any)} rows remain")

# Drop rows where ALL values are null (rarely useful here, but good to know)
dropped_all = df.dropna(how="all")
print(f"dropna(how='all'): {len(dropped_all)} rows remain")

# Drop only if specific columns have nulls
dropped_salary = df.dropna(subset=["salary"])
print(f"dropna(subset=['salary']): {len(dropped_salary)} rows remain")

# Require at least N non-null values per row
dropped_thresh = df.dropna(thresh=4)
print(f"dropna(thresh=4): {len(dropped_thresh)} rows remain")
```

```text
# Output:
Original:
      name   department   salary  rating
0    Alice        Sales  75000.0     4.2
1      Bob          NaN  82000.0     NaN
2  Charlie        Sales      NaN     3.8
3    Diana    Marketing  71000.0     NaN
4      Eve  Engineering  85000.0     4.1

dropna(): 2 rows remain
dropna(how='all'): 5 rows remain
dropna(subset=['salary']): 4 rows remain
dropna(thresh=4): 3 rows remain
```

### Filling Missing Values

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "product": ["A", "B", "C", "D", "E", "F"],
    "revenue": [45000, np.nan, 52000, np.nan, 61000, 48000],
    "category": ["Electronics", np.nan, "Electronics", "Clothing", np.nan, "Clothing"],
    "units": [100, 85, np.nan, 120, 95, np.nan],
})

# Fill with a specific value
print("Fill with 0:")
print(df["revenue"].fillna(0).values)

# Fill with mean (most common for numeric columns)
mean_val = df["revenue"].mean()
print(f"\nFill with mean ({mean_val:,.0f}):")
print(df["revenue"].fillna(mean_val).values)

# Fill with median (better for skewed data)
median_val = df["revenue"].median()
print(f"\nFill with median ({median_val:,.0f}):")
print(df["revenue"].fillna(median_val).values)

# Forward fill — carry last known value forward
print("\nForward fill:")
print(df["category"].ffill().values)

# Back fill — use next known value
print("\nBack fill:")
print(df["category"].bfill().values)
```

```text
# Output:
Fill with 0:
[45000.     0. 52000.     0. 61000. 48000.]

Fill with mean (51,500):
[45000. 51500. 52000. 51500. 61000. 48000.]

Fill with median (50,000):
[45000. 50000. 52000. 50000. 61000. 48000.]

Forward fill:
['Electronics' 'Electronics' 'Electronics' 'Clothing' 'Clothing' 'Clothing']

Back fill:
['Electronics' 'Electronics' 'Electronics' 'Clothing' 'Clothing' 'Clothing']
```

<div class="interview-tip">

**Interview Tip:** "When do you drop vs fill missing values?" Drop when the missing data is random and you have plenty of rows (< 5% missing). Fill with **median** when data is skewed (income, prices). Fill with **mean** when data is normally distributed. Use **forward fill** for time series. Fill with **mode** for categorical columns. Never fill blindly — always understand _why_ the data is missing first.

</div>

## Step 3: Remove Duplicates

```python
import pandas as pd

df = pd.DataFrame({
    "order_id": [1001, 1002, 1003, 1002, 1004, 1003],
    "customer": ["Alice", "Bob", "Charlie", "Bob", "Diana", "Charlie"],
    "amount": [250, 180, 320, 180, 150, 320],
    "status": ["shipped", "pending", "shipped", "pending", "delivered", "shipped"],
})

print("Original:")
print(df)

# Find duplicates
print("\nDuplicate rows:", df.duplicated().sum())
print("Which rows are dupes:")
print(df[df.duplicated(keep=False)])  # Show ALL copies, not just the extras

# Drop duplicates
clean = df.drop_duplicates()
print(f"\nAfter drop_duplicates: {len(clean)} rows")

# Drop based on specific columns
deduped = df.drop_duplicates(subset=["order_id"], keep="first")
print(f"Deduped by order_id: {len(deduped)} rows")
print(deduped)
```

```text
# Output:
Original:
   order_id customer  amount     status
0      1001    Alice     250    shipped
1      1002      Bob     180    pending
2      1003  Charlie     320    shipped
3      1002      Bob     180    pending
4      1004    Diana     150  delivered
5      1003  Charlie     320    shipped

Duplicate rows: 2
Which rows are dupes:
   order_id customer  amount   status
1      1002      Bob     180  pending
2      1003  Charlie     320  shipped
3      1002      Bob     180  pending
5      1003  Charlie     320  shipped

After drop_duplicates: 4 rows
Deduped by order_id: 4 rows
   order_id customer  amount     status
0      1001    Alice     250    shipped
1      1002      Bob     180    pending
2      1003  Charlie     320    shipped
4      1004    Diana     150  delivered
```

## Step 4: Fix Data Types

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "revenue": ["45000", "52000", "not available", "61000", "48000"],
    "date": ["2024-01-15", "2024-02-20", "2024-03-10", "2024-04-05", "2024-05-18"],
    "is_active": [1, 0, 1, 1, 0],
    "quantity": [10.0, 25.0, 15.0, 30.0, 20.0],
})

print("Before:")
print(df.dtypes)

# Fix revenue: replace bad values, then convert
df["revenue"] = df["revenue"].replace("not available", np.nan)
df["revenue"] = pd.to_numeric(df["revenue"], errors="coerce")

# Fix date
df["date"] = pd.to_datetime(df["date"])

# Fix boolean
df["is_active"] = df["is_active"].astype(bool)

# Fix quantity to int (must handle NaN first if present)
df["quantity"] = df["quantity"].astype(int)

print("\nAfter:")
print(df.dtypes)
print()
print(df)
```

```text
# Output:
Before:
revenue      object
date         object
is_active     int64
quantity    float64
dtype: object

After:
revenue     float64
date         datetime64[ns]
is_active       bool
quantity       int32
dtype: object

   revenue       date  is_active  quantity
0  45000.0 2024-01-15       True        10
1  52000.0 2024-02-20      False        25
2      NaN 2024-03-10       True        15
3  61000.0 2024-04-05       True        30
4  48000.0 2024-05-18      False        20
```

## Step 5: Clean String Data

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["  Sarah Chen  ", "james wilson", "MARIA GARCIA", "David Kim  ", "  lisa wang"],
    "department": [" Sales", "engineering ", " MARKETING", "sales", "Engineering"],
    "email": ["sarah@co.com", "james@co.com", "N/A", "david@co.com", "n/a"],
    "phone": ["555-1234", "(555) 5678", "555.9012", "555-3456", "(555) 7890"],
})

print("Before:")
print(df)

# Strip whitespace
df["name"] = df["name"].str.strip()
df["department"] = df["department"].str.strip()

# Consistent casing
df["name"] = df["name"].str.title()
df["department"] = df["department"].str.title()

# Replace bad values
df["email"] = df["email"].replace({"N/A": pd.NA, "n/a": pd.NA})

# Standardize phone format
df["phone"] = df["phone"].str.replace(r"[^\d]", "", regex=True)
df["phone"] = df["phone"].str.replace(r"(\d{3})(\d{4})", r"\1-\2", regex=True)

print("\nAfter:")
print(df)
```

```text
# Output:
Before:
              name   department         email       phone
0    Sarah Chen       Sales    sarah@co.com    555-1234
1   james wilson  engineering   james@co.com  (555) 5678
2   MARIA GARCIA    MARKETING           N/A    555.9012
3    David Kim       sales    david@co.com    555-3456
4     lisa wang   Engineering           n/a  (555) 7890

After:
           name department         email    phone
0    Sarah Chen      Sales  sarah@co.com  555-1234
1  James Wilson  Engineering  james@co.com  555-5678
2  Maria Garcia   Marketing          <NA>  555-9012
3     David Kim      Sales  david@co.com  555-3456
4     Lisa Wang  Engineering          <NA>  555-7890
```

## Step 6: Replace and Rename

```python
import pandas as pd

df = pd.DataFrame({
    "emp_name": ["Alice", "Bob", "Charlie", "Diana"],
    "dept_code": ["S", "E", "M", "S"],
    "perf_score": [1, 3, 2, 4],
})

# Replace codes with readable values
df["dept_code"] = df["dept_code"].replace({
    "S": "Sales",
    "E": "Engineering",
    "M": "Marketing"
})

# Replace numeric scores with labels
df["perf_score"] = df["perf_score"].replace({
    1: "Needs Improvement",
    2: "Meets Expectations",
    3: "Exceeds",
    4: "Outstanding"
})

# Rename columns
df = df.rename(columns={
    "emp_name": "employee",
    "dept_code": "department",
    "perf_score": "performance",
})

print(df)
```

```text
# Output:
  employee   department         performance
0    Alice        Sales   Needs Improvement
1      Bob  Engineering             Exceeds
2  Charlie    Marketing  Meets Expectations
3    Diana        Sales         Outstanding
```

## Step 7: Apply Custom Transformations

```python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie", "Diana", "Eve"],
    "salary": [55000, 72000, 48000, 95000, 61000],
    "years": [2, 5, 1, 8, 3],
})

# Simple apply with lambda
df["salary_band"] = df["salary"].apply(
    lambda x: "Senior" if x >= 70000 else "Mid" if x >= 55000 else "Junior"
)

# Apply with a regular function for complex logic
def calculate_bonus(row):
    base_rate = 0.10 if row["years"] >= 5 else 0.05
    performance_mult = 1.2 if row["salary"] > 60000 else 1.0
    return round(row["salary"] * base_rate * performance_mult)

df["bonus"] = df.apply(calculate_bonus, axis=1)

# Vectorized alternative (faster for large datasets)
df["tax_bracket"] = np.where(
    df["salary"] >= 80000, "High",
    np.where(df["salary"] >= 55000, "Mid", "Low")
)

print(df)
```

```text
# Output:
      name  salary  years salary_band  bonus tax_bracket
0    Alice   55000      2         Mid   2750         Mid
1      Bob   72000      5      Senior   8640         Mid
2  Charlie   48000      1      Junior   2400         Low
3    Diana   95000      8      Senior  11400        High
4      Eve   61000      3         Mid   3660         Mid
```

## Full Cleaning Pipeline

```python
import pandas as pd
import numpy as np

# Messy raw data — straight from a CSV export
raw = pd.DataFrame({
    "ID": [101, 102, 103, 104, 105, 106, 103, 107],
    "Employee Name": ["  Sarah Chen", "JAMES WILSON", "maria garcia",
                      "David Kim  ", "Lisa Wang", " tom brown",
                      "maria garcia", "Anna Taylor"],
    "Dept": ["Sales", "engineering", "SALES", "Marketing",
             np.nan, "Engineering", "Sales", "marketing"],
    "Annual Salary": ["75000", "92000", "68k", "71000",
                      "85000", "88000", "68000", "not listed"],
    "Rating (1-5)": [4.2, np.nan, 3.8, 4.5, np.nan, 4.0, 3.8, 3.5],
    "Start Date": ["2021-03-15", "2020-07-01", "2022-01-10",
                    "2021-11-22", "2023-06-05", "2019-08-20",
                    "2022-01-10", "invalid"],
})

print("=== RAW DATA ===")
print(raw)
print(f"Shape: {raw.shape}")
print(f"Missing: {raw.isnull().sum().sum()}")

# Step 1: Rename columns
raw = raw.rename(columns={
    "Employee Name": "name",
    "Dept": "department",
    "Annual Salary": "salary",
    "Rating (1-5)": "rating",
    "Start Date": "start_date",
})
raw.columns = raw.columns.str.lower().str.replace(" ", "_")

# Step 2: Remove duplicates
raw = raw.drop_duplicates(subset=["id"], keep="first")

# Step 3: Clean strings
raw["name"] = raw["name"].str.strip().str.title()
raw["department"] = raw["department"].str.strip().str.title()

# Step 4: Fix salary (handle non-numeric)
raw["salary"] = raw["salary"].replace({"68k": "68000", "not listed": np.nan})
raw["salary"] = pd.to_numeric(raw["salary"], errors="coerce")

# Step 5: Fix dates
raw["start_date"] = pd.to_datetime(raw["start_date"], errors="coerce")

# Step 6: Fill missing values
raw["department"] = raw["department"].fillna("Unknown")
raw["rating"] = raw["rating"].fillna(raw["rating"].median())
# Don't fill salary — better to leave it as NaN than guess

# Step 7: Add derived columns
raw["tenure_years"] = ((pd.Timestamp.now() - raw["start_date"]).dt.days / 365.25).round(1)

print("\n=== CLEAN DATA ===")
print(raw)
print(f"\nShape: {raw.shape}")
print(f"Missing: {raw.isnull().sum().sum()}")
print(f"\nData types:")
print(raw.dtypes)
```

```text
# Output:
=== RAW DATA ===
    ID Employee Name         Dept Annual Salary  Rating (1-5)  Start Date
0  101    Sarah Chen        Sales        75000           4.2  2021-03-15
1  102  JAMES WILSON  engineering        92000           NaN  2020-07-01
2  103  maria garcia        SALES          68k           3.8  2022-01-10
3  104    David Kim    Marketing        71000           4.5  2021-11-22
4  105     Lisa Wang          NaN        85000           NaN  2023-06-05
5  106    tom brown   Engineering        88000           4.0  2019-08-20
6  103  maria garcia        Sales        68000           3.8  2022-01-10
7  107   Anna Taylor    marketing   not listed           3.5     invalid
Shape: (8, 6)
Missing: 4

=== CLEAN DATA ===
    id          name   department   salary  rating start_date  tenure_years
0  101    Sarah Chen        Sales  75000.0     4.2 2021-03-15           4.3
1  102  James Wilson  Engineering  92000.0     4.0 2020-07-01           5.0
2  103  Maria Garcia        Sales  68000.0     3.8 2022-01-10           3.5
3  104     David Kim    Marketing  71000.0     4.5 2021-11-22           3.6
4  105     Lisa Wang      Unknown  85000.0     4.0 2023-06-05           2.1
5  106    Tom Brown   Engineering  88000.0     4.0 2019-08-20           5.9
6  107   Anna Taylor    Marketing      NaN     3.5        NaT           NaN

Shape: (7, 7)
Missing: 3

Data types:
id                int64
name             object
department       object
salary          float64
rating          float64
start_date       datetime64[ns]
tenure_years    float64
dtype: object
```

## Where This Is Used on the Job

- **Every single project.** Seriously. No dataset arrives clean.
- **ETL pipelines** — automated cleaning scripts that run daily
- **Data validation** — checking imports for quality before loading to a data warehouse
- **Client reporting** — cleaning CRM exports before building dashboards
- **Compliance** — standardizing records for audit trails

<div class="challenge">

### Challenge: Clean This Customer Dataset

```python
import pandas as pd
import numpy as np

messy = pd.DataFrame({
    "cust_id": [1, 2, 3, 4, 5, 3, 6],
    "name": ["  john doe", "JANE SMITH", "bob jones  ", "alice wong", "  CHARLIE B  ", "bob jones", "diana r"],
    "email": ["john@mail.com", "N/A", "bob@mail.com", "alice@mail.com", "charlie@mail.com", "bob@mail.com", "not provided"],
    "revenue": ["5000", "12000", "bad_data", "8500", "3200", "7200", "9500"],
    "signup_date": ["2023-01-15", "2023/02/20", "March 10, 2023", "2023-04-01", "invalid", "2023-03-10", "2023-05-22"],
    "segment": ["enterprise", "SMB", "enterprise", np.nan, "SMB", "Enterprise", "smb"],
})
```

Tasks:
1. Remove duplicate customers (keep first occurrence)
2. Clean all names to Title Case and strip whitespace
3. Replace "N/A" and "not provided" emails with NaN
4. Convert revenue to numeric (coerce errors to NaN)
5. Parse all dates (coerce errors to NaT)
6. Standardize segment to Title Case and fill NaN with "Unknown"

</div>

## Common Interview Questions

### Q1: How do you handle missing data in a real project?

**Answer:** First, understand _why_ data is missing — is it random (MCAR), dependent on other columns (MAR), or dependent on the missing value itself (MNAR)? For random missing data under 5%, dropping rows is fine. For numeric columns, fill with median (robust to outliers) or mean (normal distributions). For categorical columns, fill with mode or "Unknown". For time series, use forward fill. Never fill without domain context — blindly filling salary with 0 creates wrong analysis.

### Q2: What is the difference between `dropna()` and `fillna()`?

**Answer:** `dropna()` removes rows (or columns) containing missing values — use it when you can afford to lose data and the missingness is random. `fillna()` replaces missing values with a specified value — use it when losing rows would bias your analysis or when you have a reasonable imputation strategy. `dropna(subset=["critical_col"])` lets you drop only when specific important columns are null, keeping more data intact.

### Q3: How do you detect and handle duplicate data?

**Answer:** Use `df.duplicated()` to get a boolean mask of duplicate rows and `df.duplicated().sum()` to count them. `df.drop_duplicates()` removes exact duplicates. For partial duplicates, use `df.drop_duplicates(subset=["id_col"])` to deduplicate by key columns. The `keep` parameter controls which copy survives: `"first"`, `"last"`, or `False` (drop all copies). Always investigate duplicates before deleting — they might indicate a real data quality issue upstream.

### Q4: What does `pd.to_numeric(errors='coerce')` do?

**Answer:** It converts a column to numeric type, and any value that cannot be parsed (like "N/A", "not available", empty strings) is replaced with `NaN` instead of raising an error. This is essential when dealing with dirty data where numeric columns have been polluted with text. After coercion, you can check `df["col"].isnull()` to find which rows had bad values. The same pattern works with `pd.to_datetime(errors='coerce')` for dates.

### Q5: What is the `.str` accessor and when do you use it?

**Answer:** The `.str` accessor exposes string methods on Pandas Series — `.str.strip()`, `.str.lower()`, `.str.contains()`, `.str.replace()`, `.str.split()`, `.str.extract()`. Use it whenever you need to clean or manipulate text columns. It's vectorized, so it's much faster than applying string functions with `.apply()`. Common patterns: `df["name"].str.strip().str.title()` for cleaning names, `df["col"].str.contains("pattern")` for filtering, `df["phone"].str.replace(r"\D", "", regex=True)` for extracting digits.
