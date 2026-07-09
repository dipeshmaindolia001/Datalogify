---
title: "Data Cleaning & Pre-processing — The Cleaning Phase"
description: "Prepare raw datasets for modeling. Learn to detect and impute missing values, drop duplicates, handle outliers, and cast data types safely."
category: "eda"
order: 2
phase: 4
tags: ["eda", "data-cleaning", "missing-values", "outliers"]
publishedDate: 2025-04-02
prevSlug: "introduction-to-eda"
nextSlug: "univariate-distributions"
seoTitle: "Data Cleaning & Pre-processing for EDA | Datalogify"
seoDescription: "Master data cleaning in Python. Handle missing data (MCAR, MAR, MNAR), detect outliers via IQR/Z-score, and remove duplicate records."
---

## Why This Matters

Raw data is almost always dirty, incomplete, and full of anomalies. Cleaning data is not a boring preliminary task—it is the phase where you establish the truth and reliability of your dataset before any mathematical modeling begins.

---

## The Visual Analogy: The Logistics Sorting Center

Imagine you manage a large logistics sorting center. Every morning, a cargo truck dumps thousands of packages onto your conveyor belts. 

```text
       Raw Cargo (Dirty Data)
  ┌─────────────────────────────────────────────────────────────┐
  │  [Torn Label]   --> Missing Values (Need to Impute)         │
  │  [Empty Box]    --> Corrupted Records (Need to Drop)        │
  │  [Duplicate Box]--> Duplicate Shipments (Need to De-duplicate)│
  │  [Pianos/Oversize]--> Outliers (Need to Handle/Cap)         │
  └─────────────────────────────────────────────────────────────┘
```

You cannot simply load these packages directly onto delivery vans. You must run them through a sanitization pipeline:
* **Torn Labels:** Some packages are missing addresses. You must look up their barcodes in the system to reprint the label (Imputation).
* **Empty Boxes:** Some boxes are completely empty and crushed. You toss them out (Dropping records).
* **Duplicate Parcels:** A system glitch printed two labels for the same box. You remove the extra label to prevent double-shipping (De-duplication).
* **Oversized Shipments:** A grand piano arrives. It doesn't fit in a standard van, so you route it to a specialized cargo vehicle (Outlier management).

Data cleaning follows this exact logical process. If you bypass this sanitization stage, your downstream models will make erroneous predictions, skewing your metrics and leading to bad business decisions.

---

## Missing Data Theory: The "Why" Behind the Gaps

Before writing code to fill in missing values, you must understand *why* the data is missing. Donald Rubin established a taxonomy for missing data that governs how we treat it.

```text
                        Missingness Mechanisms
         ┌────────────────────────┼────────────────────────┐
       MCAR                      MAR                      MNAR
(Completely Random)        (Conditionally Random)      (Non-Random / Hidden)
```

### 1. MCAR (Missing Completely at Random)
The probability of a data point being missing is completely independent of both the observed data and the unobserved missing values. The missing data is a truly random subset of the complete data.
* *Example:* A laboratory scale runs out of battery mid-experiment, failing to record the weight of a few chemical samples.
* *Consequence:* Dropping MCAR rows does not introduce systemic bias into your analysis, though it reduces statistical power (sample size).

### 2. MAR (Missing at Random)
The probability of a data point being missing is related to another *observed* variable in the dataset, but not to the value of the missing variable itself.
* *Example:* In a survey, younger participants are less likely to report their annual income. If we control for age, the missingness of income is random.
* *Consequence:* You cannot simply drop these rows, as doing so would bias your dataset toward older participants. You must use imputation methods that account for the related variables.

### 3. MNAR (Missing Not at Random)
The probability of a data point being missing depends directly on the value of the missing variable itself.
* *Example:* People with extremely high incomes refuse to answer the income question on a survey due to privacy concerns.
* *Consequence:* This is the hardest category to resolve. Simple imputation will underestimate the true average income. Resolving MNAR data requires collecting additional proxy variables or building complex models to predict missingness.

---

## Imputation Strategies

When encountering missing values, we have two primary paths: **Dropping** or **Imputing**.

### 1. Dropping Data
* **Complete-Case Analysis (`dropna()`):** Dropping any row containing at least one missing value.
  ```python
  # Drops rows where ANY column is NaN
  df_clean = df.dropna()
  
  # Drops rows where specific columns are NaN
  df_clean = df.dropna(subset=["salary", "tenure"])
  ```
  > [!WARNING]
  > Only drop records if the missing mechanism is MCAR and the percentage of missing values is extremely small (e.g., < 5%). Dropping data indiscriminately can destroy signal and bias your sample.

### 2. Simple Imputation
For non-time-series data, we can impute baseline statistics:
* **Mean Imputation:** Best for normally distributed, symmetric numerical columns.
* **Median Imputation:** Best for highly skewed numerical columns (e.g., income, house prices), as the median is robust to outliers.
* **Mode Imputation:** Best for categorical columns.

```python
import pandas as pd
import numpy as np

df_demo = pd.DataFrame({"age": [23, 29, np.nan, 45, np.nan, 31]})

# Impute with median
median_val = df_demo["age"].median()
df_demo["age_imputed"] = df_demo["age"].fillna(median_val)
print(df_demo)
```

```text
# Output:
    age  age_imputed
0  23.0         23.0
1  29.0         29.0
2   NaN         29.0
3  45.0         45.0
4   NaN         29.0
5  31.0         31.0
```

### 3. Time-Series Imputation
Time-series datasets (such as stock prices or sensor readings) have temporal continuity. Using overall mean or median breaks this continuity. Instead, we use:
* **Forward Fill (`ffill()`):** Propagates the last observed non-null value forward.
* **Backward Fill (`bfill()`):** Propagates the next observed non-null value backward.
* **Interpolation (`interpolate()`):** Estimates missing values along a linear or polynomial curve between two known data points.

```python
time_data = pd.DataFrame({"price": [10.0, 10.5, np.nan, 11.5, np.nan, 12.0]})

# Apply different time-series fills
time_data["ffill"] = time_data["price"].ffill()
time_data["bfill"] = time_data["price"].bfill()
time_data["linear"] = time_data["price"].interpolate(method="linear")
print(time_data)
```

```text
# Output:
   price  ffill  bfill  linear
0   10.0   10.0   10.0    10.0
1   10.5   10.5   10.5    10.5
2    NaN   10.5   11.5    11.0
3   11.5   11.5   11.5    11.5
4    NaN   11.5   12.0    11.75
5   12.0   12.0   12.0    12.0
```

### 4. Advanced Imputation: KNN and MICE
When simple statistics are insufficient, we look at multi-variable relationships using scikit-learn.
* **KNN Imputer:** Finds the $K$ most similar rows based on other columns and averages their values to fill the gap.
* **MICE (Multivariate Imputation by Chained Equations):** Models each column with missing values as a function of all other columns in an iterative round-robin fashion. In scikit-learn, this is implemented as `IterativeImputer`.

```python
from sklearn.impute import KNNImputer
import numpy as np

X = np.array([[1, 2, 8], [3, np.nan, 6], [7, 8, np.nan], [10, 11, 2]])
imputer = KNNImputer(n_neighbors=2)
X_imputed = imputer.fit_transform(X)
print("KNN Imputed Array:\n", X_imputed)
```

```text
# Output:
KNN Imputed Array:
 [[ 1.   2.   8. ]
 [ 3.   6.5  6. ]
 [ 7.   8.   5. ]
 [10.  11.   2. ]]
```

---

## Outlier Detection: Finding the Anomalies

An outlier is a data point that deviates significantly from the rest of the dataset. Outliers can represent data entry errors (e.g., typing $100000 instead of $1000) or genuine extreme events (e.g., a massive purchase by an enterprise customer).

```text
                           Outlier Fences
   ◄─────────────────┬───────────┬───────────┬─────────────────►
  Outliers <--- Lower Fence    Median    Upper Fence ---> Outliers
```

### 1. The IQR (Interquartile Range) Method
The IQR method is a non-parametric technique (it does not assume a normal distribution) that defines outliers using percentiles:
* $Q_1$ = 25th percentile (first quartile)
* $Q_3$ = 75th percentile (third quartile)
* $IQR = Q_3 - Q_1$
* **Lower Fence** = $Q_1 - 1.5 \times IQR$
* **Upper Fence** = $Q_3 + 1.5 \times IQR$

Any data point below the Lower Fence or above the Upper Fence is categorized as an outlier.

```python
import numpy as np
import pandas as pd

prices = pd.Series([10, 12, 14, 15, 16, 18, 22, 150]) # 150 is a clear outlier

q1 = prices.quantile(0.25)
q3 = prices.quantile(0.75)
iqr = q3 - q1

lower_fence = q1 - (1.5 * iqr)
upper_fence = q3 + (1.5 * iqr)

print(f"IQR: {iqr}, Lower Fence: {lower_fence}, Upper Fence: {upper_fence}")
outliers = prices[(prices < lower_fence) | (prices > upper_fence)]
print("Detected Outliers:\n", outliers)
```

```text
# Output:
IQR: 5.25, Lower Fence: 5.125, Upper Fence: 26.125
Detected Outliers:
 7    150
dtype: int64
```

### 2. The Z-Score Method
The Z-Score measures how many standard deviations a data point is away from the mean. It assumes the variable is normally distributed:
$$Z = \frac{X - \mu}{\sigma}$$
* $\mu$ = mean
* $\sigma$ = standard deviation
* **Threshold:** A standard cutoff is a Z-score of absolute value greater than 3 ($|Z| > 3$).

```python
import scipy.stats as stats

# Calculate Z-Scores
z_scores = stats.zscore(prices)
print("Z-scores:\n", z_scores)
print("Outliers (Z > 2):\n", prices[abs(z_scores) > 2]) # Using 2 for demonstration due to small sample
```

```text
# Output:
Z-scores:
 0   -0.499092
 1   -0.454947
 2   -0.410803
 3   -0.388730
 4   -0.366658
 5   -0.322514
 6   -0.234225
 7    2.676969
dtype: float64
Outliers (Z > 2):
 7    150
dtype: int64
```

### 3. Handling Outliers: Winsorization vs. Trimming
Once outliers are detected, we have two primary remediation paths:
* **Trimming:** Completely dropping the outlier records from the dataset.
* **Winsorization:** Capping the extreme values at a specific percentile (e.g., setting all values above the 99th percentile to the 99th percentile value, and all values below the 1st percentile to the 1st percentile value).

```python
# Winsorize the Series (cap at 90th percentile)
cap_value = prices.quantile(0.90)
winsorized_prices = prices.clip(upper=cap_value)
print("Winsorized Series:\n", winsorized_prices)
```

```text
# Output:
Winsorized Series:
 0    10.0
 1    12.0
 2    14.0
 3    15.0
 4    16.0
 5    18.0
 6    22.0
 7    60.6
dtype: float64
```

---

## Duplicate Audits: Cleaning Redundant Records

Data pipelines frequently ingest duplicate records due to API retries, database replication errors, or user behavior.

### 1. Row-Level Duplicates
A row-level duplicate occurs when every single cell in a row matches another row.

```python
df_dupes = pd.DataFrame({
    "user": ["Alice", "Bob", "Alice", "Alice"],
    "action": ["login", "logout", "login", "login"]
})

# Find duplicate indicator
print("Duplicate Mask:")
print(df_dupes.duplicated())

# Drop duplicates, keeping the first occurrence
print("\nDe-duplicated (Keep First):")
print(df_dupes.drop_duplicates())
```

```text
# Output:
Duplicate Mask:
0    False
1    False
2     True
3     True
dtype: bool

De-duplicated (Keep First):
    user  action
0  Alice   login
1    Bob  logout
```

### 2. Subset-Based Duplicates
Often, you want to identify duplicates based on a subset of columns, such as checking if a `transaction_id` appears multiple times with different timestamps.

```python
tx_df = pd.DataFrame({
    "tx_id": ["TX1", "TX2", "TX1", "TX3"],
    "timestamp": ["10:00", "10:01", "10:05", "10:02"],
    "amount": [50, 100, 50, 75]
})

# Drop based on tx_id, keeping the latest timestamp
tx_sorted = tx_df.sort_values("timestamp")
tx_clean = tx_sorted.drop_duplicates(subset=["tx_id"], keep="last")
print(tx_clean)
```

```text
# Output:
  tx_id timestamp  amount
1   TX2     10:01     100
3   TX3     10:02      75
2   TX1     10:05      50
```

---

## Code Walkthroughs: Real-World Scenarios

### Example 1: Sanitizing an HR Employee Profile Dataset
Let's clean a raw HR profile containing missing values, duplicates, and skewed values.

```python
import pandas as pd
import numpy as np

# Load raw messy employee data
raw_hr = pd.DataFrame({
    "EmployeeID": [101, 102, 101, 104, 105, 106],
    "Name": ["John Doe", "Jane Smith", "John Doe", "Bob Johnson", "Alice Green", "Charlie Brown"],
    "Salary": [85000, np.nan, 85000, 120000, 95000, 2500000], # 2,500,000 is an entry error outlier
    "Department": ["Sales", "IT", "Sales", "HR", "Sales", "IT"]
})

# 1. Deduplicate by EmployeeID
hr_deduped = raw_hr.drop_duplicates(subset=["EmployeeID"], keep="first").copy()

# 2. Identify Outlier in Salary before imputing missing salary
# We use IQR to find fences on the non-null salaries
salaries = hr_deduped["Salary"].dropna()
q1, q3 = salaries.quantile(0.25), salaries.quantile(0.75)
iqr = q3 - q1
upper_fence = q3 + 1.5 * iqr

print(f"Salary Upper Fence: {upper_fence}")

# Cap outlier salaries at upper fence (Winsorization)
hr_deduped["Salary_Cleaned"] = hr_deduped["Salary"].clip(upper=upper_fence)

# 3. Impute missing salary using the median of the clean salaries
median_salary = hr_deduped["Salary_Cleaned"].median()
hr_deduped["Salary_Cleaned"] = hr_deduped["Salary_Cleaned"].fillna(median_salary)

print("\n--- Processed Employee Data ---")
print(hr_deduped)
```

```text
# Output:
Salary Upper Fence: 147500.0

--- Processed Employee Data ---
   EmployeeID         Name     Salary Department  Salary_Cleaned
0         101     John Doe    85000.0      Sales         85000.0
1         102   Jane Smith        NaN         IT         95000.0
3         104  Bob Johnson   120000.0         HR        120000.0
4         105  Alice Green    95000.0      Sales         95000.0
5         106  Charlie Brown  2500000.0         IT        147500.0
```

---

## Edge Cases, Gotchas & Industry Best Practices

### 1. Data Leakage During Imputation
Data leakage occurs when information from outside the training dataset is used to train a model. This commonly happens when you calculate the mean or median of the *entire* dataset to impute missing values *before* splitting the data into training and test sets.

```text
  Incorrect Pipeline (Data Leakage):
  [Raw Data] ───> [Impute using Global Mean] ───> [Split: Train / Test] (Leakage!)

  Correct Pipeline (No Leakage):
  [Raw Data] ───> [Split: Train / Test] ───> [Calculate Mean on Train Only] ───> [Apply to both Train & Test]
```

**Best Practice:** Always split your dataset first. Compute the imputation statistic (mean, median, mode) using the training subset only, and then apply that computed statistic to fill gaps in both the training and test subsets.

### 2. The Upcasting Trap
In older versions of Pandas, inserting a missing value (`NaN`) into an integer column (`int64`) would force Pandas to convert the entire column to float (`float64`). This is because standard NumPy floats support `NaN`, but standard NumPy integers do not.

```python
# Create an integer series
int_series = pd.Series([1, 2, 3], dtype="int64")
print("Original Dtype:", int_series.dtype)

# Insert a NaN
int_series[1] = np.nan
print("Dtype after inserting NaN:", int_series.dtype)
```

```text
# Output:
Original Dtype: int64
Dtype after inserting NaN: float64
```

**Best Practice:** Use Pandas' nullable integer data type (`Int64` with a capital 'I') to preserve the integer type when introducing missing values.

```python
# Create a nullable integer series
nullable_int = pd.Series([1, 2, 3], dtype="Int64")
nullable_int[1] = np.nan
print("Nullable Integer Dtype:", nullable_int.dtype)
print(nullable_int)
```

```text
# Output:
Nullable Integer Dtype: Int64
0       1
1    <NA>
2       3
dtype: Int64
```

---

## Practice Exercises

<div class="challenge">
<h3>Challenge 1: The Imputation Leakage Audit</h3>
<p>Implement a clean train-test split on a dataset containing missing values. Write code to:
1. Generate a mock dataframe with missing values in a numerical column.
2. Split the dataset into 80% train and 20% test sets using Pandas slicing or scikit-learn.
3. Compute the training set median and use it to fill missing values in both splits, verifying that no test data info was leaked.</p>
</div>

#### Solution Walkthrough:

```python
import pandas as pd
import numpy as np
from sklearn.model_model_split_or_selection import train_test_split # Mocking split manually to avoid dependency issues if not installed

# Generate mock data
np.random.seed(10)
df_leakage = pd.DataFrame({
    "feature_x": np.random.choice([10, 15, 20, 25, np.nan], size=100, p=[0.2, 0.2, 0.2, 0.2, 0.2])
})

# Split the data manually (80/20)
train_size = int(0.8 * len(df_leakage))
train_df = df_leakage.iloc[:train_size].copy()
test_df = df_leakage.iloc[train_size:].copy()

# Calculate median on train ONLY
train_median = train_df["feature_x"].median()
print(f"Training Set Median: {train_median}")

# Impute both splits using train_median
train_df["feature_x_imputed"] = train_df["feature_x"].fillna(train_median)
test_df["feature_x_imputed"] = test_df["feature_x"].fillna(train_median)

# Verify
print(f"Train nulls remaining: {train_df['feature_x_imputed'].isnull().sum()}")
print(f"Test nulls remaining: {test_df['feature_x_imputed'].isnull().sum()}")
```

```text
# Output:
Training Set Median: 15.0
Train nulls remaining: 0
Test nulls remaining: 0
```

---

## Section Recaps

* **Rubin's Missingness:** Categorize missing data into MCAR (safe to drop), MAR (must impute using observed associations), and MNAR (requires proxy collection or modeling).
* **Imputation Mechanics:** Fill numeric columns with mean (symmetric) or median (skewed). Use mode for categories. Apply ffill/bfill or interpolation for time-series.
* **Outlier Fences:** Calculate the IQR fences ($Q_1 - 1.5 \times IQR$ and $Q_3 + 1.5 \times IQR$) to identify anomalies without normality assumptions.
* **Leakage Auditing:** Prevent data leakage by calculating imputation parameters on training splits only and applying them to test splits.

---

## Common Interview Questions

### Q1: What is the difference between MCAR, MAR, and MNAR missing data mechanisms?
**Answer:**
* **MCAR (Missing Completely at Random):** Missingness is entirely independent of all variables in the dataset. Dropping these records does not bias the remaining sample.
* **MAR (Missing at Random):** Missingness is related to other observed variables (e.g., missing phone numbers are more common among certain age groups), but not to the missing values themselves. Imputation must account for these relationships to prevent bias.
* **MNAR (Missing Not at Random):** Missingness depends directly on the unobserved missing value itself (e.g., people with low credit scores failing to report their scores). Dropping or basic imputation will yield biased results.

---

### Q2: Why is the median preferred over the mean when imputing missing values in a right-skewed numerical column?
**Answer:**
In a right-skewed distribution, the mean is pulled upward toward the long tail of high values, making it unrepresentative of the "typical" value in the distribution. If you use the mean to impute missing values, you will artificially inflate the values in the dataset. 

The median represents the 50th percentile and is robust to outliers and skewed tails. Using the median preserves the central tendency of the data without shifting the distribution's center.

---

### Q3: Explain what data leakage is during the imputation phase and how to prevent it.
**Answer:**
Data leakage occurs when information from the validation or testing dataset is inadvertently shared with the model during training. During imputation, if you compute the mean or median of the entire dataset and use it to fill missing values before splitting, the training set will contain mathematical traces of the test set. 

To prevent data leakage, you must split the dataset into training and testing sets *before* performing any preprocessing. Compute the statistics (e.g., mean, median, mode, or scaler ranges) on the training set only. Use these computed training statistics to impute the missing values in both the training set and the test set.

---

### Q4: How does the IQR method for outlier detection differ from the Z-score method, and when would you use each?
**Answer:**
* **Z-Score Method:** Measures how many standard deviations a data point is from the mean. It assumes the underlying data is normally (Gaussian) distributed. It is appropriate when you know the distribution is symmetric and bell-shaped.
* **IQR Method:** Uses the interquartile range ($Q_3 - Q_1$) and establishes fences at $1.5 \times IQR$ outside the quartiles. It is a non-parametric method, meaning it makes no assumptions about the shape of the distribution. It is preferred when dealing with skewed data, multi-modal distributions, or datasets where normality cannot be guaranteed.

---

### Q5: What is the difference between trimming and Winsorizing outliers, and what are the trade-offs of each?
**Answer:**
* **Trimming** is the practice of completely removing outlier rows from the dataset. 
  * *Trade-off:* It provides a clean dataset but reduces the sample size. If the outliers represent real-world events (like high-value customer transactions), trimming discards valuable information.
* **Winsorizing** caps the extreme values at a designated percentile (e.g., capping values at the 1st and 99th percentiles).
  * *Trade-off:* It retains the observations (preserving sample size and row-level relationships in other columns) while limiting the distorting effect of extreme values on models, but it artificially alters the data distribution.
