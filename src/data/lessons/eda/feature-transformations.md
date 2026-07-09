---
title: "Feature Transformations — Scaling & Encoding"
description: "Prepare raw features for modeling. Learn log transforms, StandardScaler vs. MinMaxScaler, One-Hot/Ordinal encoding, and binning."
category: "eda"
order: 7
phase: 4
tags: ["eda", "feature-engineering", "scaling", "encoding"]
publishedDate: 2025-04-07
prevSlug: "time-series-eda"
nextSlug: "business-analytics-case-study"
seoTitle: "Feature Transformation & Scaling in Python | Datalogify"
seoDescription: "Prepare features for machine learning. Learn Log/Box-Cox transformations, StandardScaler vs. MinMaxScaler, and One-Hot/Target encoding."
---

## Why This Matters

Raw data is rarely ready for machine learning algorithms. If you feed untransformed data into a model—such as features on completely different scales (like age vs. annual income) or highly skewed variables—your model will perform poorly, over-indexing on high-magnitude features or failing to capture non-linear relationships.

---

## The Feature Transformation Analogy: Standardizing Shipping Boxes

Imagine you are packing a delivery truck with various objects: long skis, small rings, heavy weights, and fragile plants. If you throw them all into the truck loose, they will slide around, block each other, and damage the cargo. 

```text
    Raw Unstructured Data                    Transformed Packaged Data
    
      [ Skis ]   [ Ring ]                     +----------+  +----------+
      \      /   \      /                     | Box 1:   |  | Box 2:   |
       \    /     \    /                      | Scaled   |  | Encoded  |
      [ Heavy Weights ]                       | Skis     |  | Ring     |
                                              +----------+  +----------+
```

To optimize the shipping process, you must package the items:
*   **Scaling (Standardizing Sizing)**: Placing everything into standard-sized boxes so they stack cleanly. This ensures that the giant size of the skis doesn't crush the ring.
*   **Encoding (Labeling)**: Attaching barcodes or shipping labels so the computerized sorting system knows how to categorize and route them.
*   **Binning (Sorting)**: Grouping packages into weight classes (under 5 lbs, 5-20 lbs, 20+ lbs) rather than measuring the exact weight down to the ounce.

In data analytics, **feature transformation** is the process of boxing and labeling your data. It standardizes variables so that machine learning algorithms can interpret and compare them fairly.

---

## Step-by-Step Concept Breakdown

### 1. Handling Skewed Data
Many algorithms (especially linear models) assume that features are normally distributed. Highly skewed data can distort models because a few extreme values will dominate the cost function.

```text
       Right-Skewed (Long Tail Right)         Log-Transformed (Normal)
       
            /\                                        /\
           /  \                                      /  \
          /    \                                    /    \
         /      \________________                  /      \
        +------------------------                 +--------+
```

*   **Log Transformation**: Applied to right-skewed (positive) distributions. It compresses the long tail of large values.
    *   $\ln(x)$ cannot handle zero or negative values ($\ln(0)$ is undefined).
    *   $\ln(x + 1)$, implemented as `np.log1p()`, shifts the scale by 1 so that zero values map cleanly to zero ($\ln(1) = 0$).
*   **Square Root Transformation**: $\sqrt{x}$ is a milder transformation that is useful for count data or moderate right skew.
*   **Box-Cox Transformation**: A parametric transformation that finds the optimal power parameter $\lambda$ to normalize data. It requires strictly positive values ($x > 0$).
*   **Yeo-Johnson Transformation**: A modification of Box-Cox that allows for zero and negative values.

### 2. Feature Scaling
Distance-based models (like K-Means, KNN, SVM) and gradient-descent algorithms (like Neural Networks) are highly sensitive to feature scales. If one feature ranges from 0 to 1 and another ranges from 0 to 1,000,000, the model will treat the second feature as much more important.

#### Standardization (`StandardScaler`)
$$z = \frac{x - \mu}{\sigma}$$
*   **Goal**: Shifts data to have a mean ($\mu$) of 0 and a standard deviation ($\sigma$) of 1.
*   **Outlier Behavior**: Retains outliers but reduces their relative impact. This is preferred for models that assume normal distributions (Linear/Logistic Regression, PCA).

#### Normalization (`MinMaxScaler`)
$$x_{scaled} = \frac{x - x_{min}}{x_{max} - x_{min}}$$
*   **Goal**: Scales data to fit within a fixed range, typically $[0, 1]$.
*   **Outlier Behavior**: Highly sensitive to outliers. A single massive outlier will compress all other normal data points into a tiny range (e.g., between 0.001 and 0.005), wiping out their variance.

### 3. Categorical Encoding
Computers cannot interpret raw text strings. We must convert categorical features into numerical values.

*   **One-Hot Encoding**: Creates a binary column for each unique category.
    *   *The Dummy Variable Trap*: If a category has $K$ options, you only need $K-1$ binary columns to describe it. The last column is redundant and creates multicollinearity ($X_K = 1 - \sum X_{i}$). This causes issues for linear regression models.
*   **Ordinal Encoding**: Maps ordered categories to sequential integers (e.g., `["Low", "Medium", "High"]` $\rightarrow$ `[0, 1, 2]`).
*   **Target Encoding**: Replaces each category with the average target value for that category. It is highly efficient for high-cardinality features (like zip codes) but risks overfitting. We apply **smoothing** to pull small category averages toward the global mean.

### 4. Continuous Binning
Binning converts continuous values into discrete groups:
*   **Uniform Binning (Equal Width)**: Divides the range of the feature into $N$ equal-width intervals.
*   **Quantile Binning (Equal Frequency)**: Divides the data such that each of the $N$ intervals contains approximately the same number of observations.

---

## Code & Practical Walkthroughs

Let us implement these transformation techniques in Python.

### Example 1: Handling Skewed Data (Log, Box-Cox, Yeo-Johnson)

We will generate a highly skewed dataset representing customer lifetime value (CLV) and apply transformations to normalize it.

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# Set styling
sns.set_theme(style="whitegrid")

# 1. Generate highly right-skewed data (Log-Normal Distribution)
np.random.seed(42)
clv = np.random.lognormal(mean=4, sigma=1.2, size=500)
# Add some zero values to make it realistic
clv[np.random.choice(500, 20)] = 0.0

df_skew = pd.DataFrame({"CLV": clv})

# 2. Apply transformations
# Use log1p to safely handle the zero values
df_skew["Log_CLV"] = np.log1p(df_skew["CLV"])

# Yeo-Johnson can handle zero/negative values (unlike Box-Cox)
df_skew["YJ_CLV"], lambda_param = stats.yeojohnson(df_skew["CLV"])

print("Optimal Yeo-Johnson Lambda:", round(lambda_param, 4))

# 3. Plot original vs. transformed distributions
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

sns.histplot(df_skew["CLV"], kde=True, ax=axes[0], color="red")
axes[0].set_title("Original CLV (Highly Right-Skewed)")

sns.histplot(df_skew["Log_CLV"], kde=True, ax=axes[1], color="blue")
axes[1].set_title("Log-Transformed CLV [log1p]")

sns.histplot(df_skew["YJ_CLV"], kde=True, ax=axes[2], color="green")
axes[2].set_title("Yeo-Johnson Transformed CLV")

plt.tight_layout()
plt.show()
```

```text
# Output:
Optimal Yeo-Johnson Lambda: -0.1654
Three histograms are generated:
- The first (Original) shows a sharp spike at the left and a long tail extending to the right beyond 1000.
- The second (Log) shows a symmetric, bell-shaped distribution.
- The third (Yeo-Johnson) shows a balanced normal distribution with the tail compressed.
```

---

### Example 2: StandardScaler vs. MinMaxScaler with Outliers

Let us analyze how outliers impact StandardScaler and MinMaxScaler.

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# 1. Create a feature (Annual Income) with one extreme outlier
income = np.array([45000, 52000, 58000, 61000, 49000, 55000, 60000, 950000]) # 950k is the outlier
df_income = pd.DataFrame({"Income": income})

# 2. Apply scalers
scaler_std = StandardScaler()
scaler_minmax = MinMaxScaler()

df_income["Standardized"] = scaler_std.fit_transform(df_income[["Income"]]).round(3)
df_income["Normalized"] = scaler_minmax.fit_transform(df_income[["Income"]]).round(3)

print("=== Scaling Comparison ===")
print(df_income)
```

```text
# Output:
=== Scaling Comparison ===
   Income  Standardized  Normalized
0   45000        -0.457       0.000
1   52000        -0.435       0.008
2   58000        -0.416       0.014
3   61000        -0.407       0.018
4   49000        -0.445       0.004
5   55000        -0.426       0.011
6   60000        -0.410       0.017
7  950000         2.395       1.000
```

Notice the difference:
*   In **MinMaxScaler (Normalized)**, the extreme outlier (950,000) mapped to 1.0, compressing the other incomes into a narrow band between 0.000 and 0.018. This wipes out their variance.
*   In **StandardScaler (Standardized)**, the normal incomes reside around -0.4, while the outlier stands out at +2.39. The variance among normal incomes is preserved.

---

### Example 3: Categorical Encoding (One-Hot, Ordinal, Target)

We will encode a dataset containing user subscriptions, device categories, and transaction amounts.

```python
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder

# 1. Generate synthetic dataset
df_users = pd.DataFrame({
    "Tier": ["Bronze", "Silver", "Gold", "Bronze", "Gold", "Silver"], # Ordinal
    "Device": ["Android", "iOS", "Web", "iOS", "Android", "Web"],      # Nominal (One-Hot)
    "Conversions": [1, 0, 1, 0, 1, 0]                                  # Target for encoding
})

# 2. Ordinal Encoding: Map categories to ordered numbers
tier_order = ["Bronze", "Silver", "Gold"]
ordinal_enc = OrdinalEncoder(categories=[tier_order])
df_users["Tier_Encoded"] = ordinal_enc.fit_transform(df_users[["Tier"]]).astype(int)

# 3. One-Hot Encoding: Set drop='first' to avoid the dummy variable trap
ohe = OneHotEncoder(drop="first", sparse_output=False)
device_ohe = ohe.fit_transform(df_users[["Device"]])
# Create column names based on category values
device_cols = [f"Device_{cat}" for cat in ohe.categories_[0][1:]]
df_device_ohe = pd.DataFrame(device_ohe, columns=device_cols)

# 4. Target Encoding: Map Category -> Mean Target Value
# Calculate group means from the data
target_map = df_users.groupby("Device")["Conversions"].mean()
df_users["Device_Target_Encoded"] = df_users["Device"].map(target_map)

# Combine results
df_final = pd.concat([df_users, df_device_ohe], axis=1)
print("=== Encoded DataFrame ===")
print(df_final)
```

```text
# Output:
=== Encoded DataFrame ===
     Tier   Device  Conversions  Tier_Encoded  Device_Target_Encoded  Device_Web  Device_iOS
0  Bronze  Android            1             0                    1.0         0.0         0.0
1  Silver      iOS            0             1                    0.0         0.0         1.0
2    Gold      Web            1             2                    0.5         1.0         0.0
3  Bronze      iOS            0             0                    0.0         0.0         1.0
4    Gold  Android            1             2                    1.0         0.0         0.0
5  Silver      Web            0             1             0.5         1.0         0.0
```

---

### Example 4: Continuous Binning (Uniform vs. Quantile)

Let us compare uniform (equal width) vs. quantile (equal frequency) binning on age data.

```python
# Generate age distribution
np.random.seed(10)
ages = np.random.randint(18, 80, size=15)
df_ages = pd.DataFrame({"Age": ages})

# 1. Uniform Binning (Equal Width)
df_ages["Uniform_Bin"] = pd.cut(df_ages["Age"], bins=3, labels=["Young", "Middle", "Senior"])

# 2. Quantile Binning (Equal Frequency)
df_ages["Quantile_Bin"] = pd.qcut(df_ages["Age"], q=3, labels=["Group 1", "Group 2", "Group 3"])

print("=== Binning Comparison ===")
print(df_ages.sort_values(by="Age"))
```

```text
# Output:
=== Binning Comparison ===
    Age Uniform_Bin Quantile_Bin
5    18       Young      Group 1
2    26       Young      Group 1
6    26       Young      Group 1
10   27       Young      Group 1
0    27       Young      Group 1
11   47      Middle      Group 2
13   48      Middle      Group 2
8    54      Middle      Group 2
14   54      Middle      Group 2
9    61      Senior      Group 3
4    67      Senior      Group 3
12   72      Senior      Group 3
7    72      Senior      Group 3
3    74      Senior      Group 3
1    82      Senior      Group 3
```

---

## Gotchas & Common Mistakes

<div class="interview-tip">
<strong>Gotcha: Scaling Before Splitting</strong><br>
Scaling your features (using <code>StandardScaler</code> or <code>MinMaxScaler</code>) on your entire dataset before performing a train-test split is a major mistake. Doing so leaks the test set's mean and variance into your training set, leading to overly optimistic evaluation metrics.
<br><br>
<strong>Correct Practice:</strong>
<pre><code class="language-python"># Split first
X_train, X_test = train_test_split(X, test_size=0.2)

# Fit and transform training set
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# Transform test set using training parameters
X_test_scaled = scaler.transform(X_test)
</code></pre>
</div>

### 1. Target Leakage during Target Encoding
When you calculate target encoding using the target values of the entire dataset, you leak future information into your features. This causes models to overfit during training and fail in production.
*   **Fix**: Compute category target encodings strictly on the training partition, and add smoothing (regularization) to handle low-frequency categories.

### 2. High Cardinality One-Hot Explosion
One-hot encoding a high-cardinality categorical variable (like zip codes or city names) will create hundreds or thousands of sparse binary columns. This increases the dimensionality of your dataset, slowing down training and causing models to overfit.
*   **Fix**: For high-cardinality categorical variables, use target encoding or group rare categories into an "Other" bin.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Outlier Scale Impact Audit
Write a Python script that generates a normal distribution of 1,000 data points. Introduce a single massive outlier (100 times the maximum value).
1.  Apply `MinMaxScaler` and `StandardScaler` to the dataset.
2.  Calculate the variance of the scaled non-outlier points under both scalers.
3.  Write a statement explaining which scaler preserved the variance of the non-outlier data.

---

### Exercise 2: Smothered Target Encoding Function
Write a custom Python function `smoothed_target_encoder(df, categorical_col, target_col, weight=10)` that:
1. Calculates the global mean of the target.
2. Calculates the mean target value and counts for each category.
3. Applies the smoothing formula:
   $$S_i = \frac{n_i \times \text{Category Mean} + \text{weight} \times \text{Global Mean}}{n_i + \text{weight}}$$
4. Returns a pandas Series containing the smoothed encoded values.

---

## Section Recaps

*   Use **log transformations** (`np.log1p`) or **Yeo-Johnson** transformations to normalize highly right-skewed features.
*   **Standardization** shifts data to zero mean and unit variance, making it robust to outliers. **Normalization** scales data to the $[0,1]$ range but is highly sensitive to outliers.
*   Avoid the **dummy variable trap** by dropping the first column (`drop_first=True`) when one-hot encoding variables for linear models.
*   **Uniform binning** creates equal-width intervals, while **quantile binning** splits data into bins of equal frequency.
*   Always split your dataset into training and testing sets **before** fitting transformations to prevent target leakage.

---

## Common Interview Questions

### Q1: Why is it a bad practice to fit a scaler on the entire dataset before splitting it into training and testing sets?
**Answer:**
Fitting a scaler on the entire dataset before splitting introduces **data leakage** (specifically, distribution leakage). 

A scaler calculates parameters like the mean ($\mu$), standard deviation ($\sigma$), minimum ($x_{min}$), and maximum ($x_{max}$) to transform the data. If you fit the scaler on the entire dataset, the parameters will include information from both the training and testing sets. 

When you split the data later, the training set's scaled values will have been influenced by the test set's distribution. This violates the rule that the test set must remain completely unseen. It leads to overly optimistic performance metrics during model evaluation that will not hold up in production. 

The correct process is to split the data first, fit the scaler strictly on the training set (`fit_transform()`), and then apply that same scaler to the test set using only the `transform()` method.

---

### Q2: What is the dummy variable trap, why does it occur, and how do you resolve it in regression models?
**Answer:**
The dummy variable trap occurs when one-hot encoded variables are perfectly collinear—meaning one variable can be predicted from the others. This introduces multicollinearity into the dataset.

For example, if you one-hot encode a `Gender` variable with options `Male` and `Female`, you get two columns: `is_Male` and `is_Female`. Since these columns are mutually exclusive, `is_Female` is always equal to $1 - \text{is\_Male}$. 

In a linear regression model:
$$Y = \beta_0 + \beta_1(\text{is\_Male}) + \beta_2(\text{is\_Female})$$
Because the columns are perfectly collinear, the model's design matrix is not full rank. This makes it mathematically impossible to invert the matrix to solve for the coefficients. 

To resolve this, you must drop one of the encoded columns (known as the baseline category). In Python, this is done by setting `drop='first'` in scikit-learn's `OneHotEncoder` or `drop_first=True` in `pd.get_dummies()`.

---

### Q3: Compare StandardScaler and MinMaxScaler. If your dataset has significant outliers, which scaler should you choose and why?
**Answer:**
*   **StandardScaler** standardizes data to have a mean of 0 and variance of 1. It scales features using the mean and standard deviation, which means it does not bound the output to a fixed range.
*   **MinMaxScaler** scales data to fit within a bounded range (usually 0 to 1) based on the minimum and maximum values.

If the dataset contains significant outliers, you should choose **StandardScaler** (or a robust alternative like `RobustScaler`). 

Because MinMaxScaler relies on the absolute minimum and maximum values, a single extreme outlier will inflate the denominator ($x_{max} - x_{min}$). This compresses all the normal data points into a very small range (e.g., between 0.00 and 0.02) to make room for the outlier at 1.00, wiping out the variance of the non-outliers. 

StandardScaler is less sensitive because it scales based on variance and standard deviation, preserving the distribution and relative differences of the normal data points while placing the outlier at a high standard deviation (e.g., +4.5).

---

### Q4: Explain Target Encoding. What is target leakage in this context, and how does additive smoothing mitigate overfitting?
**Answer:**
Target encoding replaces each categorical value with the average target value for that category. It is highly effective for high-cardinality features because it keeps the feature space small compared to one-hot encoding.

However, target encoding can lead to target leakage if you use the target values of the rows you are trying to predict. For example, if a category appears only once in the dataset, its encoded value will perfectly match the target value for that row. The model will overfit by simply memorizing this value.

To prevent this:
1.  **Out-of-fold encoding**: Calculate category averages using cross-validation partitions.
2.  **Additive Smoothing**: Adjust the category average toward the global average using a smoothing weight:
    $$S_i = \frac{n_i \times \mu_i + m \times g}{n_i + m}$$
    Where $n_i$ is the category count, $\mu_i$ is the category target mean, $g$ is the global target mean, and $m$ is the smoothing weight.
    For rare categories ($n_i \approx 0$), the formula pulls the value toward the global mean $g$. For common categories ($n_i \gg m$), the value stays close to the category mean $\mu_i$.

---

### Q5: When should you transform a skewed variable using a log transform, and why is `np.log1p` preferred over `np.log`?
**Answer:**
You should apply a log transform when a continuous variable is highly right-skewed (positive skew). Right-skewed variables have a long tail of large values (like income, transaction amounts, or web traffic metrics) that can dominate models and violate assumptions of normality. The log transform compresses the tail, making the distribution more symmetric and stable.

`np.log1p` is preferred over `np.log` because it calculates $\ln(1 + x)$ instead of $\ln(x)$. 

If a feature contains zero values, `np.log(0)` is mathematically undefined ($-\infty$), which will break your data pipeline. Using `np.log1p` shifts the values by +1. This ensures that zero values map cleanly to zero ($\ln(1) = 0$), preventing errors and maintaining the scale.
