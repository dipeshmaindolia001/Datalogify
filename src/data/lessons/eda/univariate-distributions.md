---
title: "Univariate Distributions — Analyzing Single Variables"
description: "Understand the shape, center, and spread of individual variables. Explore histograms, KDE plots, QQ-plots, skewness, and kurtosis."
category: "eda"
order: 3
phase: 4
tags: ["eda", "statistics", "distributions", "histograms"]
publishedDate: 2025-04-03
prevSlug: "data-cleaning-pre-processing"
nextSlug: "bivariate-relationships"
seoTitle: "Univariate Distribution Analysis in Python | Datalogify"
seoDescription: "Analyze single variable distributions. Learn to plot histograms, KDEs, Violin plots, and verify normality using QQ-plots."
---

## Why This Matters

Before analyzing relationships between multiple features or building models, you must understand the distribution of each variable in isolation. Univariate analysis reveals the statistical signature of a column, including its central tendency, spread, and deviation from normality.

---

## The Visual Analogy: The Sand Sorting Sieves

Imagine you are analyzing soil samples for a construction project. You dump a bucket of raw sand into a stack of mesh sieves with progressively smaller holes. 

```text
       Sieve Stack (Histogram Bins)
  ┌─────────────────────────────────────────────────────────────┐
  │   [ 10mm Mesh ]  --> Coarse Gravel (Large values / Outliers)│
  ├─────────────────────────────────────────────────────────────┤
  │   [  5mm Mesh ]  --> Small Pebbles (Medium-high values)     │
  ├─────────────────────────────────────────────────────────────┤
  │   [  1mm Mesh ]  --> Standard Sand (The Median cluster)     │
  ├─────────────────────────────────────────────────────────────┤
  │   [ 0.1mm Mesh]  --> Fine Silt (Small values)               │
  └─────────────────────────────────────────────────────────────┘
```

When you shake the stack, the sand grains sort themselves into different layers based on size. By measuring the weight of the sand in each layer, you can construct a profile:
* **The Peak:** Which sieve caught the most sand? (This is your **mode** or highest density region).
* **The Range:** Are the grains mostly the same size, or is there a wide spread from fine dust to large pebbles? (This is your **variance** or **spread**).
* **The Skew:** Is the stack dominated by massive stones with a few grains of sand, or fine sand with a few large pebbles? (This represents the **skewness** of your distribution).

Univariate analysis is the mathematical equivalent of shaking your data through these sieves. By examining one column at a time, you map its physical shape before studying how it interacts with other variables.

---

## Visualizing Numerical Variables

We use several plotting tools to dissect numerical variables, each highlighting different characteristics of the distribution.

### 1. Histograms (Bin Size Sensitivity)
A histogram groups continuous numerical data into discrete intervals called **bins** and counts the number of data points in each bin.

> [!WARNING]
> Histograms are highly sensitive to **bin width**. 
> * If the bins are too wide, you will smooth out important details (such as a double peak).
> * If the bins are too narrow, the chart becomes jagged and noisy, making it hard to see the overall shape.

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Generate data: mixture of two groups (Bimodal)
group1 = np.random.normal(loc=20, scale=3, size=500)
group2 = np.random.normal(loc=40, scale=4, size=500)
bimodal_data = np.concatenate([group1, group2])

# Set up matplotlib figure
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Under-binned (too wide)
sns.histplot(bimodal_data, bins=5, ax=axes[0], color="skyblue")
axes[0].set_title("Too Few Bins (bins=5) - Hides Bimodality")

# Correctly binned
sns.histplot(bimodal_data, bins=30, ax=axes[1], color="salmon")
axes[1].set_title("Correct Bins (bins=30) - Reveals Bimodality")
plt.show()
```

### 2. Kernel Density Estimate (KDE) Plots
A KDE plot displays the distribution of data using a continuous probability density curve. It is a smoothed version of a histogram, calculated by centering a kernel function (typically a Gaussian curve) over each data point and summing them.

The smoothness is controlled by the **bandwidth**. A low bandwidth mirrors the raw data closely (high variance), while a high bandwidth over-smoothes the curve (high bias).

```python
# Show KDE with varying bandwidth adjustment (bw_adjust)
plt.figure(figsize=(8, 4))
sns.kdeplot(bimodal_data, bw_adjust=0.2, label="Low Bandwidth (Noise)", color="red")
sns.kdeplot(bimodal_data, bw_adjust=1.0, label="Standard Bandwidth", color="blue")
sns.kdeplot(bimodal_data, bw_adjust=3.0, label="High Bandwidth (Over-smoothed)", color="green")
plt.legend()
plt.title("Bandwidth Effects on KDE Plot")
plt.show()
```

### 3. Box Plots (Box-and-Whisker)
Box plots are ideal for visualizing the five-number summary of a dataset:
1. **Minimum:** The lowest value (excluding outliers), defined as $Q_1 - 1.5 \times IQR$.
2. **First Quartile ($Q_1$):** 25th percentile.
3. **Median ($Q_2$):** 50th percentile.
4. **Third Quartile ($Q_3$):** 75th percentile.
5. **Maximum:** The highest value (excluding outliers), defined as $Q_3 + 1.5 \times IQR$.

Points extending beyond the whiskers are plotted as individual markers and represent outliers.

```text
               ┌───────────┐
     |─────────│     |     │─────────|     o (Outlier)
               └───────────┘
    Min       Q1   Median  Q3       Max
```

### 4. Violin Plots
A violin plot combines a box plot and a KDE plot. It displays a box plot inside a symmetrical, vertical KDE curve on both sides, providing a clear view of the probability density at different values.

```python
# Compare Box plot and Violin plot
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
sns.boxplot(y=bimodal_data, ax=axes[0], color="lightblue")
axes[0].set_title("Box Plot: Highlights Outliers and Quartiles")

sns.violinplot(y=bimodal_data, ax=axes[1], color="lightpink")
axes[1].set_title("Violin Plot: Shows Underlying Density Shape")
plt.show()
```

---

## Visualizing Categorical Variables

When exploring categorical columns, we focus on frequency and proportion.

### 1. Frequency Tables
Before plotting, always generate a raw frequency table using `value_counts()`. Combine absolute counts with percentages.

```python
categories = pd.Series(["Mobile", "Mobile", "Desktop", "Tablet", "Mobile", "Desktop", "Mobile"])

freq_table = pd.DataFrame({
    "Count": categories.value_counts(),
    "Percentage": categories.value_counts(normalize=True) * 100
})
print(freq_table)
```

```text
# Output:
         Count  Percentage
Mobile       4   57.142857
Desktop      2   28.571429
Tablet       1   14.285714
```

### 2. Bar Charts vs. Pie Charts
* **Bar Charts:** The industry standard for categorical frequency. They use the length of a rectangular bar to represent value, which is easy for the human eye to compare.
* **Pie Charts:** Strongly discouraged in professional data analytics (except when displaying very few categories, like 2 or 3, representing vastly different shares). Humans struggle to compare the areas and angles of pie slices accurately, especially with high-cardinality data.

```python
# Generate a high-cardinality categorical series
regions = pd.Series(["North", "South", "East", "West", "Midwest", "Northeast", "Southwest", "Northwest"])
# A bar chart is far easier to read than a pie chart with 8 slices!
```

---

## Descriptive Statistics for Distribution Shape

Visualizations are useful, but we need mathematical metrics to describe the shape of our distributions.

```text
       Symmetric (Skew = 0)         Positive Skew (Skew > 0)
             ┌─┐                                ┌─┐
           ┌─┘ └─┐                            ┌─┘ └──┐
         ┌─┘     └─┐                        ┌─┘      └───┐
        ─┴─────────┴─                      ─┴────────────┴──
       Mean = Median = Mode               Mode < Median < Mean
```

### 1. Skewness
Skewness measures the asymmetry of a distribution around its mean.
* **Symmetrical (Skewness $\approx$ 0):** The left and right tails are balanced. (e.g. Normal Distribution).
* **Positive / Right Skew (Skewness > 0):** The distribution's tail extends further to the right. The majority of the data is clustered at lower values.
  * *Relationship:* $\text{Mode} < \text{Median} < \text{Mean}$
  * *Examples:* Household income, house prices, web page loading times.
* **Negative / Left Skew (Skewness < 0):** The distribution's tail extends further to the left. The majority of the data is clustered at higher values.
  * *Relationship:* $\text{Mean} < \text{Median} < \text{Mode}$
  * *Examples:* Age of retirement, test scores where most students pass.

```python
# Calculate Skewness using Pandas
skew_val = pd.Series(bimodal_data).skew()
print(f"Skewness: {skew_val:.4f}")
```

```text
# Output:
Skewness: 0.1265
```

### 2. Kurtosis
Kurtosis measures the "tailedness" of a distribution relative to a normal distribution. It describes how often extreme values (outliers) occur in the tails.
* **Mesokurtic (Excess Kurtosis $\approx$ 0):** Tail behavior matches the normal distribution.
* **Leptokurtic (Excess Kurtosis > 0):** High, sharp peak with fat tails. This indicates a high concentration of data around the center combined with a higher probability of extreme values (outliers).
  * *Examples:* Financial asset returns (stock prices often experience extreme jumps).
* **Platykurtic (Excess Kurtosis < 0):** Flat, wide peak with thin tails. Outliers are rare.
  * *Examples:* Uniform distributions.

```python
# Calculate Excess Kurtosis using Pandas (Pandas uses Fisher's definition where normal = 0)
kurt_val = pd.Series(bimodal_data).kurt()
print(f"Excess Kurtosis: {kurt_val:.4f}")
```

```text
# Output:
Excess Kurtosis: -1.0425
```

---

## Normality Verification

Many statistical techniques and machine learning algorithms (like linear regression) assume that continuous variables follow a normal distribution. We verify normality using both visual and mathematical methods.

### 1. Quantile-Quantile (Q-Q) Plots
A Q-Q plot graphs the quantiles of your sample data against the theoretical quantiles of a standard normal distribution.
* **If the data is normal:** The points will fall along a straight diagonal reference line ($y = x$).
* **If the data is skewed:** The points will curve away from the diagonal reference line at the ends.

```python
import scipy.stats as stats
import matplotlib.pyplot as plt

# Generate normal and skewed data
normal_sample = np.random.normal(loc=0, scale=1, size=200)
skewed_sample = np.random.exponential(scale=2.0, size=200)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Normal Q-Q
stats.probplot(normal_sample, dist="norm", plot=axes[0])
axes[0].set_title("Q-Q Plot: Normally Distributed Data")

# Skewed Q-Q
stats.probplot(skewed_sample, dist="norm", plot=axes[1])
axes[1].set_title("Q-Q Plot: Skewed (Exponential) Data")
plt.show()
```

### 2. Statistical Normality Tests
While Q-Q plots are visual, statistical tests provide mathematical validation:
* **Shapiro-Wilk Test (`stats.shapiro`):** Tests the null hypothesis ($H_0$) that the data was drawn from a normal distribution.
  * *Usage:* If the p-value is $< 0.05$, you reject the null hypothesis and conclude the data is **not** normally distributed.
  * *Limitation:* It is highly sensitive to large sample sizes ($N > 5000$). For large datasets, even minor, non-consequential deviations from normality will result in a p-value $< 0.05$.
* **Kolmogorov-Smirnov Test (`stats.kstest`):** Compares the empirical cumulative distribution function (CDF) of your sample against a theoretical normal CDF.

```python
# Run Shapiro-Wilk Test
stat, p_val = stats.shapiro(normal_sample)
print(f"Normal Sample - Stat: {stat:.4f}, p-value: {p_val:.4f}")

stat_skew, p_val_skew = stats.shapiro(skewed_sample)
print(f"Skewed Sample - Stat: {stat_skew:.4f}, p-value: {p_val_skew:.4f}")
```

```text
# Output:
Normal Sample - Stat: 0.9934, p-value: 0.5218
Skewed Sample - Stat: 0.8143, p-value: 0.0000
```

* For the `normal_sample`, the p-value ($0.5218$) is $> 0.05$, so we fail to reject normality.
* For the `skewed_sample`, the p-value ($0.0000$) is $< 0.05$, so we reject normality.

---

## Code Walkthroughs: Real-World Scenarios

### Example 1: Website User Engagement Profiling
Let's analyze the distribution of session durations on an e-commerce site.

```python
import pandas as pd
import numpy as np
import scipy.stats as stats

# Generate session duration data (right-skewed exponential distribution)
np.random.seed(42)
sessions = pd.DataFrame({
    "session_id": [f"S_{i}" for i in range(500)],
    "duration_seconds": np.random.exponential(scale=180.0, size=500) + 10.0 # scale parameter
})

# 1. Compute Descriptive Statistics
mean_dur = sessions["duration_seconds"].mean()
median_dur = sessions["duration_seconds"].median()
skew_dur = sessions["duration_seconds"].skew()
kurt_dur = sessions["duration_seconds"].kurt()

print(f"Mean Session Duration: {mean_dur:.2f} seconds")
print(f"Median Session Duration: {median_dur:.2f} seconds")
print(f"Skewness: {skew_dur:.4f}")
print(f"Excess Kurtosis: {kurt_dur:.4f}")

# 2. Run Shapiro-Wilk Normality Test
stat, p_val = stats.shapiro(sessions["duration_seconds"])
print(f"Shapiro Test p-value: {p_val:.6f}")

if p_val < 0.05:
    print("Conclusion: Session duration is significantly non-normal.")
```

```text
# Output:
Mean Session Duration: 187.69 seconds
Median Session Duration: 130.64 seconds
Skewness: 2.1388
Excess Kurtosis: 6.2737
Shapiro Test p-value: 0.000000
Conclusion: Session duration is significantly non-normal.
```

The median ($130.64$s) is much lower than the mean ($187.69$s), and the high positive skewness ($2.1388$) mathematically confirms the right tail of long sessions.

---

## Edge Cases, Gotchas & Industry Best Practices

### 1. Multi-modal Distributions Masked by Statistics
A common mistake is relying solely on summary statistics like mean and median. If a distribution is bimodal (has two distinct peaks), the mean and median will fall in the valley between the peaks, representing a value that rarely occurs in the dataset.

```python
# Generate bimodal height data (e.g. mixture of two biological groups)
group_a = np.random.normal(160, 5, 500)
group_b = np.random.normal(185, 5, 500)
heights = pd.Series(np.concatenate([group_a, group_b]))

print(f"Mean Height: {heights.mean():.2f} cm")
print(f"Median Height: {heights.median():.2f} cm")
```

```text
# Output:
Mean Height: 172.54 cm
Median Height: 172.50 cm
```

An analyst looking only at these numbers would assume the typical height is around 172.5 cm. However, plotting the distribution reveals that very few individuals are actually 172.5 cm tall; the population is split into groups centered at 160 cm and 185 cm.

### 2. Shapiro-Wilk Sample Size Limit
The Shapiro-Wilk test is mathematically structured such that its power increases with sample size. When testing large datasets (e.g., $N > 10,000$), the test will flag even tiny, trivial deviations from normality as statistically significant (p-value $< 0.05$).

**Best Practice:** For large datasets, prioritize visual inspection via Q-Q plots over formal statistical tests to assess normality.

---

## Practice Exercises

<div class="challenge">
<h3>Challenge 1: The Histogram Bin Audit</h3>
<p>Create a script that takes a highly skewed dataset and plots a single figure with three subplots. Each subplot should display a histogram of the dataset using:
1. Too few bins (e.g., 3).
2. Too many bins (e.g., 100).
3. The optimal number of bins using the Freedman-Diaconis rule.</p>
<p>The Freedman-Diaconis rule is calculated as:
$$\text{Bin Width} = 2 \times \frac{IQR(x)}{\sqrt[3]{n}}$$
$$\text{Number of Bins} = \frac{\max(x) - \min(x)}{\text{Bin Width}}$$
</p>
</div>

#### Solution Walkthrough:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Generate exponential data
np.random.seed(42)
data = np.random.exponential(scale=10, size=500)

# Calculate Freedman-Diaconis bins
q75, q25 = np.percentile(data, [75 ,25])
iqr = q75 - q25
bin_width = 2 * iqr / (len(data) ** (1/3))
optimal_bins = int(np.ceil((data.max() - data.min()) / bin_width))
print(f"Optimal Bins calculated: {optimal_bins}")

# Plotting
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
axes[0].hist(data, bins=3, color="red", alpha=0.7)
axes[0].set_title("Under-binned (bins=3)")

axes[1].hist(data, bins=100, color="orange", alpha=0.7)
axes[1].set_title("Over-binned (bins=100)")

axes[2].hist(data, bins=optimal_bins, color="green", alpha=0.7)
axes[2].set_title(f"Optimal Bins ({optimal_bins})")
plt.show()
```

```text
# Output:
Optimal Bins calculated: 26
```

---

## Section Recaps

* **The Sieve Rule:** Histograms bin continuous data; always tune bin counts or use the Freedman-Diaconis rule to prevent oversmoothing or noise.
* **Density Curves:** KDE plots display continuous density; adjust the bandwidth parameter to balance variance and bias.
* **Skewness Signatures:** Positive skew features a right tail ($\text{Mean} > \text{Median}$). Negative skew features a left tail ($\text{Mean} < \text{Median}$).
* **Kurtosis Tails:** Leptokurtic distributions have fat tails and high outliers (kurtosis $> 0$). Platykurtic distributions have thin tails (kurtosis $< 0$).
* **Normality Auditing:** Combine Q-Q plots with Shapiro-Wilk tests, but ignore Shapiro p-values on very large datasets.

---

## Common Interview Questions

### Q1: Why can a histogram look completely different depending on the bin size chosen, and how do you determine the optimal number of bins?
**Answer:**
A histogram's shape depends on how continuous data is grouped. If the bin width is too large, data is over-aggregated, masking multi-modal patterns or skewness. If the bin width is too small, minor random fluctuations appear as significant peaks, obscuring the true distribution shape. 

To determine the optimal number of bins, analysts use rules of thumb:
* **Sturges' Rule:** Optimal bins = $\log_2(n) + 1$. Best for normally distributed data.
* **Freedman-Diaconis Rule:** $\text{Bin Width} = 2 \times \frac{IQR}{\sqrt[3]{n}}$. This is robust to outliers and does not assume a normal distribution, making it the industry standard for skewed datasets.

---

### Q2: What does a Q-Q plot do, and what does it mean if the points curve upward at both ends?
**Answer:**
A Quantile-Quantile (Q-Q) plot compares the empirical quantiles of a sample dataset against the theoretical quantiles of a specified reference distribution (usually the standard normal distribution). 

If the points curve upward at the right end (above the reference diagonal line) and curve upward at the left end (above the reference diagonal line), it indicates that the sample data has a **positive (right) skew**. The right-tail quantiles are larger than expected for a normal distribution, and the left-tail quantiles are also closer to the center than expected.

---

### Q3: Explain why a p-value of less than 0.05 in a Shapiro-Wilk test on a dataset of 100,000 rows might not mean you should reject algorithms that assume normality.
**Answer:**
The Shapiro-Wilk test has high statistical power. As the sample size ($N$) increases, the standard error of the test statistic decreases. Consequently, even tiny, practically negligible deviations from a perfect normal distribution (such as a slight tail asymmetry) will trigger a statistically significant result (p-value $< 0.05$). 

In large datasets, these minor deviations do not violate the normality assumptions of models (like linear regression or ANOVA) in a way that impacts their performance. In these scenarios, analysts rely on Q-Q plots to visually assess if the distribution is approximately normal.

---

### Q4: What is the difference between Leptokurtic and Platykurtic distributions, and how does this affect risk in financial modeling?
**Answer:**
* **Leptokurtic distributions** (excess kurtosis $> 0$) have fat tails and a sharp, tall peak. This indicates that while values are generally clustered tightly around the mean, extreme outlier events occur more frequently than expected under a normal distribution.
* **Platykurtic distributions** (excess kurtosis $< 0$) have thin tails and a flatter peak, indicating that extreme outliers are rare.

In financial modeling, a leptokurtic distribution indicates higher risk. If stock returns are modeled as normal but are actually leptokurtic, the model will underestimate the frequency and severity of extreme market crashes (black swan events).

---

### Q5: How can summary statistics (mean, median, standard deviation) lead you astray when analyzing a bimodal distribution?
**Answer:**
Summary statistics assume a single central concentration of data. In a bimodal distribution (two peaks), the mean and median will fall in the valley between the two peaks. 

For example, if you analyze customer purchasing times and find a mean of 2:00 PM, you might focus marketing campaigns at that time. However, if the distribution is bimodal with peaks at 9:00 AM (morning commuters) and 7:00 PM (after-work shoppers), 2:00 PM represents a period of low traffic. The summary statistics fail to capture the two distinct sub-populations, which can only be identified by visualizing the distribution.
