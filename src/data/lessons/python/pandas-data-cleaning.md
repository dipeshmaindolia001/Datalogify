---
title: "Pandas Data Cleaning — Handling Missing Data, Duplicates, and Types"
description: "Learn how to detect and clean missing values, remove duplicate rows, format string data, and cast types in Pandas."
category: "python"
order: 103
phase: 1
tags: ["python", "pandas", "data-cleaning", "data-wrangling"]
publishedDate: 2025-02-03
prevSlug: "pandas-intro"
nextSlug: "pandas-merging"
seoTitle: "Pandas Data Cleaning Tutorial for Data Analytics | Datalogify"
seoDescription: "Learn how to detect and clean missing values, remove duplicate rows, format string data, and cast types in Pandas."
---

## Why This Matters: The Reality of Raw Data

In every data science textbook, the datasets are clean, structured, and complete. In the real world, data is messy, incomplete, duplicate-ridden, and poorly formatted. Experienced data analysts often spend up to 80% of their time cleaning and formatting data. 

Running statistical models, generating business reports, or training machine learning algorithms on uncleaned data is a recipe for disaster. This is summarized by the classic industry saying: **Garbage in, garbage out**. 

* If your transactional database has duplicate rows, your revenue reports will be overinflated.
* If your date columns are stored as text strings instead of datetime objects, you won't be able to run time-series forecasts.
* If you have missing data and handle it incorrectly, your models can become biased.

This lesson covers the core data cleaning techniques in Pandas. You will learn how to build automated pipelines to clean dirty data, convert types, and format strings efficiently.

---

## The Visual Analogy: The Inventory Quality Control Crew

Imagine you manage a large logistics warehouse. A delivery truck arrives and drops off a massive shipping container filled with boxes. Your quality control team must sort through this inventory before it goes onto the shelves.

```text
    Incoming Raw Data                    Quality Control Actions
┌─────────────────────────────┐       ┌──────────────────────────────────────┐
│  [ Empty Box ]              │  ───> │  Fill with default OR discard box    │ (Missing Values)
├─────────────────────────────┤       ├──────────────────────────────────────┤
│  [ Duplicate Box ]          │  ───> │  Identify and send to recycle bin    │ (Duplicate Rows)
├─────────────────────────────┤       ├──────────────────────────────────────┤
│  [ "120" written on Label ] │  ───> │  Rewrite as an actual integer count  │ (Type Casting)
├─────────────────────────────┤       ├──────────────────────────────────────┤
│  [  john @ EMAIL . com   ]  │  ───> │  Format to lowercase and trim spaces │ (String Cleaning)
└─────────────────────────────┘       └──────────────────────────────────────┘
```

* **Missing Values:** You find empty boxes. Do you throw the boxes away (dropping data)? Or do you fill them with a default item (imputing values)?
* **Duplicates:** You find identical boxes shipped twice. You must identify the duplicates and keep only one of them.
* **Type Conversion:** You find boxes labeled `"120"` in text. You must convert these text labels into actual numbers so you can perform arithmetic on your inventory.
* **String Sanitization:** Some box labels are dirty, with leading/trailing spaces or inconsistent capitalizations. You must format them to a standard layout.

---

## Detecting and Handling Missing Values

Pandas represents missing values using different markers depending on the data type:
* `np.nan` (Not a Number): The standard floating-point representation for missing numeric or categorical data.
* `None`: Python's built-in singleton, typically used for object columns.
* `pd.NA`: The modern Pandas-specific representation for missing values across integer, boolean, and string columns.

Let's work with a mock dataset containing missing values:

```python
import numpy as np
import pandas as pd

df = pd.DataFrame({
    "OrderID": [2001, 2002, 2003, 2004, 2005],
    "Customer": ["Alice", "Bob", np.nan, "Diana", "Evan"],
    "Age": [25, np.nan, 42, 31, np.nan],
    "Revenue": [150.00, 200.50, 95.00, np.nan, 310.00],
    "Notes": [np.nan, "Late Delivery", np.nan, np.nan, "Promo Used"]
})
```

### 1. Detecting Missing Values
Use `.isna()` (or its alias `.isnull()`) to create a boolean mask of missing values. Combining `.isna()` with `.sum()` gives a quick report of missing values per column.

```python
# Summing boolean True values (which evaluate to 1) per column
print("Missing values per column:")
print(df.isna().sum())
```

```text
# Output:
Missing values per column:
OrderID     0
Customer    1
Age         2
Revenue     1
Notes       3
dtype: int64
```

### 2. Strategy 1: Dropping Missing Values (`.dropna`)
If a column or row has too many missing values, you can drop them. Use the `subset` parameter to only look at specific columns when dropping rows.

```python
# Drop rows where BOTH Customer AND Revenue are missing
df_dropped = df.dropna(subset=["Customer", "Revenue"])
print(df_dropped)
```

```text
# Output:
   OrderID Customer   Age  Revenue         Notes
0     2001    Alice  25.0    150.0           NaN
1     2002      Bob   NaN    200.5  Late Delivery
4     2005     Evan   NaN    310.0    Promo Used
```

Other parameters for `.dropna()`:
* `axis=0` (default): Drops rows.
* `axis=1`: Drops columns containing missing values.
* `how='any'` (default): Drops rows if at least one column has a missing value.
* `how='all'`: Drops rows only if all columns are missing.

### 3. Strategy 2: Imputing Missing Values (`.fillna`)
Instead of dropping data, you can fill in missing values with a default value, mean, median, or using index-based fills.

```python
# Fill missing Notes with a placeholder string
df["Notes"] = df["Notes"].fillna("No notes provided")

# Fill missing Revenue with the column average (mean)
mean_revenue = df["Revenue"].mean()
df["Revenue"] = df["Revenue"].fillna(mean_revenue)

# Fill missing Age with the column median
median_age = df["Age"].median()
df["Age"] = df["Age"].fillna(median_age)

print(df)
```

```text
# Output:
   OrderID Customer   Age  Revenue              Notes
0     2001    Alice  25.0   150.00  No notes provided
1     2002      Bob  31.0   200.50      Late Delivery
2     2003      NaN  42.0    95.00  No notes provided
3     2004    Diana  31.0   188.875  No notes provided
4     2005     Evan  31.0   310.00         Promo Used
```

#### Sequence Filling: Forward-Fill and Backward-Fill
For time-series data, it is common to carry forward the last valid reading (`ffill`) or use the next valid reading (`bfill`).

```python
temperatures = pd.Series([18.5, 19.0, np.nan, np.nan, 21.0, 20.5])

print("Forward-Fill:")
print(temperatures.fillna(method="ffill"))
```

```text
# Output:
Forward-Fill:
0    18.5
1    19.0
2    19.0
3    19.0
4    21.0
5    20.5
dtype: float64
```

---

## Identifying and Removing Duplicates

Duplicate records occur due to network retries, logging bugs, or file merging operations.

```python
# DataFrame containing duplicates
df_dupes = pd.DataFrame({
    "UserID": [101, 102, 101, 103, 101],
    "LoginTime": ["08:00", "08:15", "08:00", "09:00", "12:00"]
})
```

### 1. Detecting Duplicates (`.duplicated`)
The `.duplicated()` method returns a boolean Series indicating whether a row is a duplicate of a previous row.
* `keep='first'` (default): Flags all occurrences as duplicates except for the first one.
* `keep='last'`: Flags all occurrences as duplicates except for the last one.
* `keep=False`: Flags all occurrences of duplicate rows as `True`.

```python
# Show which rows are duplicated
print("Duplicated mask (keep='first'):")
print(df_dupes.duplicated())

print("\nDuplicated mask (keep=False):")
print(df_dupes.duplicated(keep=False))
```

```text
# Output:
Duplicated mask (keep='first'):
0    False
1    False
2     True
3    False
4    False
dtype: bool

Duplicated mask (keep=False):
0     True
1    False
2     True
3    False
4    False
dtype: bool
```

### 2. Dropping Duplicates (`.drop_duplicates`)
You can drop duplicate rows using `.drop_duplicates()`. Use the `subset` parameter to focus on specific key columns instead of matching the entire row.

```python
# Keep only the latest log record for each user
# Sort by LoginTime descending, then drop duplicates on UserID keeping the first record (which is the latest)
df_sorted = df_dupes.sort_values(by="LoginTime", ascending=False)
df_cleaned = df_sorted.drop_duplicates(subset=["UserID"], keep="first")
print(df_cleaned)
```

```text
# Output:
   UserID LoginTime
4     101     12:00
3     103     09:00
1     102     08:15
```

---

## Type Conversion and Parsing Messy Columns

A common cause of analysis errors is incorrect data types. For example, dates loaded as strings, or currencies loaded as strings because of dollar signs and commas.

```python
dirty_data = pd.DataFrame({
    "Price": ["$12.50", "$45.00", "N/A", "$99.99"],
    "Date": ["2026-07-01", "2026-07-02", "2026/07/03", "Invalid Date"],
    "Active": [1, 0, 1, 0]
})
```

### 1. Numeric Conversions (`pd.to_numeric` and `.astype`)
To convert columns containing invalid numeric strings, use `pd.to_numeric` with `errors='coerce'`. This converts non-numeric strings (like `"N/A"`) into `NaN` instead of raising an error.

```python
# First remove the '$' sign
dirty_data["Price"] = dirty_data["Price"].str.replace("$", "", regex=False)

# Convert to numeric, turning 'N/A' into NaN
dirty_data["Price"] = pd.to_numeric(dirty_data["Price"], errors="coerce")
print(dirty_data)
print(dirty_data.dtypes)
```

```text
# Output:
   Price          Date  Active
0  12.50    2026-07-01       1
1  45.00    2026-07-02       0
2    NaN    2026-07-03       1
3  99.99  Invalid Date       0
Price     float64
Date       object
Active      int64
dtype: object
```

### 2. Parsing Datetimes (`pd.to_datetime`)
To convert strings into datetime objects, use `pd.to_datetime`. Setting `errors='coerce'` converts unparseable dates (like `"Invalid Date"`) into `NaT` (Not a Time).

```python
dirty_data["Date"] = pd.to_datetime(dirty_data["Date"], errors="coerce")
print(dirty_data)
print(dirty_data.dtypes)
```

```text
# Output:
   Price       Date  Active
0  12.50 2026-07-01       1
1  45.00 2026-07-02       0
2    NaN 2026-07-03       1
3  99.99        NaT       0
Price            float64
Date      datetime64[ns]
Active             int64
dtype: object
```

### 3. Converting Boolean and Categorical Types
Converting integer flags to booleans, and low-cardinality strings to categories, helps reduce memory usage.

```python
# Cast Active column to boolean
dirty_data["Active"] = dirty_data["Active"].astype(bool)
print(dirty_data.dtypes)
```

```text
# Output:
Price            float64
Date      datetime64[ns]
Active              bool
dtype: object
```

---

## Vectorized String Operations (`.str` Accessor)

If a column contains strings, you can access vectorized string operations using the `.str` accessor. This allows you to perform operations on the entire column at once.

```python
users = pd.DataFrame({
    "FullName": ["  alice Smith ", "BOB Jones  ", "Charlie brown"],
    "Email": ["ALICE@gmail.com", "  bob@Yahoo.com  ", "CHARLIE@outlook.com"]
})
```

Let's clean this user registration data:
1. Strip leading and trailing whitespace from names and emails.
2. Standardize names to Title Case.
3. Convert emails to lowercase.
4. Extract the email domain names.

```python
# 1. Clean whitespace and capitalization
users["FullName"] = users["FullName"].str.strip().str.title()
users["Email"] = users["Email"].str.strip().str.lower()

# 2. Extract domains using split
# split("@") splits the email into [username, domain]. .str[1] gets the second element.
users["Domain"] = users["Email"].str.split("@").str[1]

# 3. Check for specific domains using contains
users["IsGmail"] = users["Email"].str.contains("gmail.com", regex=False)

print(users)
```

```text
# Output:
        FullName                Email       Domain  IsGmail
0    Alice Smith      alice@gmail.com    gmail.com     True
1      Bob Jones        bob@yahoo.com    yahoo.com    False
2  Charlie Brown  charlie@outlook.com  outlook.com    False
```

---

## Mapping and Replacing Values

To normalize categories, align spelling variations, or map keys to values, use `.replace()` and `.map()`.

```python
feedback = pd.DataFrame({
    "User": ["U1", "U2", "U3", "U4"],
    "Rating": ["Good", "Very Good", "G", "Bad"]
})
```

### 1. Replacing Values (`.replace`)
Use `.replace()` to swap specific values. You can pass a dictionary of replacement values. Values not specified in the dictionary are left unchanged.

```python
# Normalize 'G' to 'Good'
feedback["Rating"] = feedback["Rating"].replace({"G": "Good"})
print(feedback)
```

```text
# Output:
  User     Rating
0   U1       Good
1   U2  Very Good
2   U3       Good
3   U4        Bad
```

### 2. Mapping Values (`.map`)
Use `.map()` to apply a translation dictionary across a column. **Important: `.map()` will replace any values not found in your dictionary with `NaN`.**

```python
# Convert text ratings to numeric scores
score_mapping = {
    "Bad": 1,
    "Good": 3,
    "Very Good": 5
}

feedback["Score"] = feedback["Rating"].map(score_mapping)
print(feedback)
```

```text
# Output:
  User     Rating  Score
0   U1       Good      3
1   U2  Very Good      5
2   U3       Good      3
3   U4        Bad      1
```

---

## Common Gotchas & Best Practices

### 1. Avoid `inplace=True`
Many Pandas methods include an `inplace` parameter (e.g., `df.dropna(inplace=True)`). Using `inplace=True` is generally discouraged in production code:
* **No performance benefit:** In most cases, Pandas still creates a copy of the data in memory before updating the reference.
* **Breaks Method Chaining:** You cannot chain operations together if you use `inplace=True`, since it returns `None`.

Instead, use standard assignment:
```python
# Recommended
df = df.dropna()
```

### 2. Upcasting Issues with Missing Values
If you have an integer column containing missing values, Pandas will automatically upcast the column's data type to `float64`. This is because standard NumPy integer types do not support `NaN`.

```python
# Integer column with NaN -> automatically upcast to float64
ages = pd.Series([25, 30, np.nan])
print("Ages dtype:", ages.dtype)
```

```text
# Output:
Ages dtype: float64
```

To keep it as an integer type, you can use the nullable integer type (`Int64` with a capital I) introduced in newer versions of Pandas:

```python
ages_nullable = pd.Series([25, 30, np.nan], dtype="Int64")
print("Nullable integer dtype:", ages_nullable.dtype)
```

```text
# Output:
Nullable integer dtype: Int64
```

---

## Practice Exercises

### Exercise 1: Clean a Messy User Profile DataFrame
You have a DataFrame containing dirty registration data. Write a cleaning pipeline to:
1. Strip spaces and lowercase the emails.
2. Replace invalid email records (e.g. string missing `@`) with `NaN`.
3. Drop rows with missing emails.
4. Remove duplicate signups based on email, keeping only the first signup.
5. Parse the signup date into a datetime format.

```python
import numpy as np
import pandas as pd

dirty_users = pd.DataFrame({
    "Name": [" Alice ", "Bob", "Alice", "Charlie"],
    "Email": [" alice@GMAIL.com ", "bob-yahoo.com", "ALICE@gmail.com", "charlie@outlook.com"],
    "SignUp": ["2026-01-15", np.nan, "2026/01/15", "2026-02-10"]
})

# Write your solution below:
# 1. Clean strings
dirty_users["Email"] = dirty_users["Email"].str.strip().str.lower()
dirty_users["Name"] = dirty_users["Name"].str.strip()

# 2. Invalidate emails without '@' using np.where or boolean masking
has_at_symbol = dirty_users["Email"].str.contains("@", regex=False)
dirty_users["Email"] = np.where(has_at_symbol, dirty_users["Email"], np.nan)

# 3. Drop rows with missing emails
cleaned = dirty_users.dropna(subset=["Email"])

# 4. Remove duplicate emails
cleaned = cleaned.drop_duplicates(subset=["Email"], keep="first")

# 5. Parse signup date
cleaned["SignUp"] = pd.to_datetime(cleaned["SignUp"], errors="coerce")

print(cleaned)
```

```text
# Output:
      Name                Email     SignUp
0    Alice      alice@gmail.com 2026-01-15
3  Charlie  charlie@outlook.com 2026-02-10
```

### Exercise 2: Cleaning Transactional Sales Data
Given the transactional sales data below, clean the `Amount` column so it is a valid float, and parse the `Date` column.

```python
sales_data = pd.DataFrame({
    "TxID": [101, 102, 103],
    "Amount": ["$1,250.50", "890.00", "$15,000.00"],
    "Date": ["01-July-2026", "02-July-2026", "03/07/2026"]
})

# Write your solution below:
sales_data["Amount"] = sales_data["Amount"].str.replace("$", "", regex=False).str.replace(",", "", regex=False)
sales_data["Amount"] = pd.to_numeric(sales_data["Amount"])
sales_data["Date"] = pd.to_datetime(sales_data["Date"], errors="coerce")

print(sales_data)
print(sales_data.dtypes)
```

```text
# Output:
   TxID   Amount       Date
0   101   1250.5 2026-07-01
1   102    890.0 2026-07-02
2   103  15000.0 2026-07-03
TxID               int64
Amount           float64
Date      datetime64[ns]
dtype: object
```

---

## Section Recaps

* **Missing Values**: Identify missing values using `.isna().sum()`. Drop rows containing missing values with `.dropna()`, or fill them with `.fillna()`.
* **Duplicates**: Find duplicate rows using `.duplicated()` and drop them using `.drop_duplicates()`. Specify key columns using the `subset` parameter.
* **Type Conversion**: Convert data types using `pd.to_numeric()`, `pd.to_datetime()`, and `.astype()`. Use `errors='coerce'` to handle messy or corrupted strings.
* **String Operations**: Apply vectorized string methods on a column using the `.str` accessor.
* **Mappings**: Use `.replace()` to swap specific values, and `.map()` to apply a dictionary-based translation across a column.

---

## Common Interview Questions

### Q1: What is the difference between `.isna()` and `.isnull()` in Pandas?
**Answer:**
There is no functional difference. `.isna()` and `.isnull()` are aliases for the exact same function. Both return a boolean DataFrame or Series indicating whether each cell is missing. 

The two aliases exist because Pandas is built on top of NumPy (which uses `NaN` - Not a Number) and integrates with SQL databases (which use `Null`). Having both aliases makes the library intuitive for both communities.

---

### Q2: Why is the use of `inplace=True` generally discouraged in Pandas?
**Answer:**
Using `inplace=True` is discouraged for two main reasons:
1. **No performance improvement:** Under the hood, Pandas rarely performs in-place memory modifications. Instead, it creates a copy of the data, performs the operation on the copy, and updates the reference.
2. **Method Chaining:** `inplace=True` returns `None`. This prevents you from chaining operations together (e.g. `df.dropna().drop_duplicates().reset_index()`).

---

### Q3: What is the difference between `.map()` and `.replace()` when applying dictionary mapping to a column?
**Answer:**
* **`.replace()` only swaps matching values.** If a value is not in the replacement dictionary, it is left unchanged in the output.
* **`.map()` transforms all values.** If a value is not in the mapping dictionary, it is replaced with `NaN` in the output.

Use `.replace()` to normalize specific spelling variations or categories without affecting the rest of the column. Use `.map()` when you want to apply a strict translation key and flag unmapped values as missing.

---

### Q4: How does Pandas handle missing values when casting an integer column to float, and how can you keep it as integer?
**Answer:**
By default, standard NumPy integer types do not support missing values (`NaN`). If you introduce a missing value into an integer column, Pandas will automatically cast the column's data type to `float64`.

To keep the column as an integer type with missing values, you must use the Pandas nullable integer type (`Int64` with a capital I) during creation or conversion:
```python
df["id"] = df["id"].astype("Int64")
```

---

### Q5: How do you parse date strings with different formats in the same column without throwing errors?
**Answer:**
To parse dates with mixed formats, use `pd.to_datetime()` with `errors='coerce'`. If Pandas encounters an unparseable or corrupted date string, it will convert it to `NaT` (Not a Time) instead of raising an error:

```python
df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
```
For custom formats, you can pass a format string, or let Pandas infer the format:
```python
df["Date"] = pd.to_datetime(df["Date"], format="mixed")
```
This converts valid dates into a standard `datetime64` format and flags invalid strings as missing values.
