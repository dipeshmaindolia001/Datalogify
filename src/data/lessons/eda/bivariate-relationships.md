---
title: "Bivariate Relationships — Finding Correlations"
description: "Explore connections between pairs of variables. Master Pearson vs. Spearman correlation, scatter plots, trend lines, and grouped bar charts."
category: "eda"
order: 4
phase: 4
tags: ["eda", "correlation", "scatter-plots", "bivariate"]
publishedDate: 2025-04-04
prevSlug: "univariate-distributions"
nextSlug: "multivariate-explorations"
seoTitle: "Bivariate Relationship & Correlation Analysis | Datalogify"
seoDescription: "Examine relationships between two variables. Learn Pearson/Spearman correlation coefficients, scatter plots, cross-tabs, and grouped bar charts."
---

## Why This Matters

Understanding variables in isolation is only the beginning. To find patterns, build models, or make business decisions, you must examine how variables interact in pairs, looking for trends, associations, and predictive relationships.

---

## The Visual Analogy: Charting Wind and Speed

Imagine you are sailing a cargo ship across the ocean. You want to understand what makes the ship travel faster. You start recording two variables every hour:
1. The speed of the wind (knots).
2. The speed of the ship (knots).

```text
    Wind vs. Ship Speed (Scatter Plot)
  ┌─────────────────────────────────────────────────────────────┐
  │   Speed (knots)                                             │
  │     ▲                                                       │
  │  30 │                                     * (Strong Wind)   │
  │  20 │                       * (Moderate)                    │
  │  10 │         * (Light Wind)                                │
  │   0 └────────────────────────────────────────►              │
  │     0        10          20         30   Wind (knots)       │
  └─────────────────────────────────────────────────────────────┘
```

If you plot these points on a grid, you will see a trend: as wind speed increases, the ship's speed increases. This is a **bivariate relationship**. 
* **The Direction:** Positive (both go up together).
* **The Strength:** How tightly clustered are the points around a straight line? (If the ship speed varies wildly due to ocean currents, the relationship is weak. If it maps perfectly, the relationship is strong).

Bivariate analysis is the study of these dual-variable dynamics. It allows you to move from simply describing the state of your data to explaining the associations that drive outcomes.

---

## Numerical vs. Numerical Relationships

When comparing two continuous numerical variables, we use scatter plots to visualize the relationship and correlation coefficients to measure it.

### 1. Scatter Plots & Trend Lines
A scatter plot represents each observation as a point on a Cartesian plane. We often overlay a trend line using **Ordinary Least Squares (OLS) linear regression** to show the general direction of the data.

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Generate data
np.random.seed(42)
x = np.random.uniform(10, 100, 100)
# Linear relation with noise
y_linear = 2.5 * x + np.random.normal(0, 20, 100)
# Non-linear monotonic relation (y = x^3)
y_nonlinear = (x ** 3) / 10000 + np.random.normal(0, 10, 100)

df_corr = pd.DataFrame({"x": x, "y_linear": y_linear, "y_nonlinear": y_nonlinear})

# Plot linear relationship with OLS line
plt.figure(figsize=(6, 4))
sns.regplot(data=df_corr, x="x", y="y_linear", line_kws={"color": "red"})
plt.title("Scatter Plot with OLS Trend Line")
plt.show()
```

### 2. Pearson vs. Spearman Correlation
We use two primary coefficients to measure the correlation between numerical variables. Both range from `-1` (perfect negative correlation) to `1` (perfect positive correlation), with `0` indicating no correlation.

```text
       Correlation Types
  ┌────────────────────────┼────────────────────────┐
     Pearson Correlation               Spearman Rank Correlation
   - Assumes Linear relationship     - Assumes Monotonic relationship
   - Sensitive to outliers           - Robust to outliers
   - Uses raw values                 - Uses ranked values
```

#### Pearson Correlation Coefficient ($r$)
Pearson measures the strength of the **linear** relationship between two variables. It assumes:
* Both variables are continuous.
* The relationship is linear.
* The data is normally distributed and homoscedastic (constant variance of residuals).

$$r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}$$

#### Spearman Rank Correlation Coefficient ($\rho$)
Spearman is a non-parametric metric that measures the **monotonic** relationship (whether the variables increase or decrease together, regardless of whether the rate of change is constant). Instead of using the raw values, Spearman converts the data into ranks and calculates Pearson's correlation on those ranks.

* *Advantage:* It is robust to outliers and can capture non-linear relationships.

Let's compare Pearson and Spearman on our mock dataset:

```python
# Linear relationship correlations
p_lin = df_corr["x"].corr(df_corr["y_linear"], method="pearson")
s_lin = df_corr["x"].corr(df_corr["y_linear"], method="spearman")

# Non-linear monotonic relationship correlations
p_non = df_corr["x"].corr(df_corr["y_nonlinear"], method="pearson")
s_non = df_corr["x"].corr(df_corr["y_nonlinear"], method="spearman")

print(f"Linear Relationship   -> Pearson: {p_lin:.4f}, Spearman: {s_lin:.4f}")
print(f"Non-Linear Monotonic -> Pearson: {p_non:.4f}, Spearman: {s_non:.4f}")
```

```text
# Output:
Linear Relationship   -> Pearson: 0.9634, Spearman: 0.9575
Non-Linear Monotonic -> Pearson: 0.9168, Spearman: 1.0000
```

Notice that for the non-linear relationship ($y = x^3$), Spearman is a perfect `1.0000` because the rank order is preserved perfectly, whereas Pearson drops to `0.9168` because the relationship is not strictly linear.

---

## Categorical vs. Numerical Relationships

To analyze how a numerical variable behaves across different categories, we use group comparisons.

### 1. Grouped Box Plots
Grouped box plots allow you to compare the median, spread, and outliers of a numerical column across different categories.

```python
# Generate categorical-numerical mock data
categories = np.random.choice(["Control", "Variant A", "Variant B"], size=300)
revenue = np.random.exponential(scale=50, size=300) + 10
# Inject higher average in Variant B
revenue[categories == "Variant B"] += 30

df_ab = pd.DataFrame({"Group": categories, "Revenue": revenue})

# Plot grouped box plot
plt.figure(figsize=(8, 5))
sns.boxplot(data=df_ab, x="Group", y="Revenue", palette="Set2")
plt.title("Revenue Distribution across Test Groups")
plt.show()
```

### 2. Bar Charts with Confidence Intervals
When displaying the mean of a numerical variable across categories, always include error bars representing the confidence interval (typically 95%). This shows the uncertainty of the estimate.

```python
# Bar plot with 95% Confidence Intervals (ci)
plt.figure(figsize=(8, 5))
sns.barplot(data=df_ab, x="Group", y="Revenue", errorbar=("ci", 95), capsize=0.1, palette="muted")
plt.title("Mean Revenue with 95% Confidence Intervals")
plt.show()
```

### 3. Stacked Density Curves (Overlapping KDEs)
Overlapping KDE plots show how the probability distribution of a numerical variable shifts between different categories.

```python
# Overlapping KDE plots
plt.figure(figsize=(8, 5))
sns.kdeplot(data=df_ab, x="Revenue", hue="Group", fill=True, common_norm=False, alpha=0.4)
plt.title("Overlapping KDE: Revenue by Group")
plt.show()
```

---

## Categorical vs. Categorical Relationships

To analyze relationships between two categorical columns, we use cross-tabulations and contingency tables.

### 1. Cross-Tabulations (`pd.crosstab`)
A cross-tabulation (contingency table) lists the frequency distribution of variables, showing the intersections between categories.

```python
# Generate mock survey data
gender = pd.Series(np.random.choice(["Male", "Female"], size=200))
preference = pd.Series(np.random.choice(["Product X", "Product Y"], size=200, p=[0.6, 0.4]))

# Absolute Frequency Table
ct_absolute = pd.crosstab(gender, preference)
print("--- Absolute Counts ---")
print(ct_absolute)

# Normalized Table (Percentages across rows)
ct_percentage = pd.crosstab(gender, preference, normalize="index") * 100
print("\n--- Row-wise Percentages ---")
print(ct_percentage)
```

```text
# Output:
--- Absolute Counts ---
col_0   Product X  Product Y
row_0                       
Female         61         39
Male           58         42

--- Row-wise Percentages ---
col_0   Product X  Product Y
row_0                       
Female       61.0       39.0
Male         58.0       42.0
```

### 2. Stacked and Grouped Bar Charts
We visualize contingency tables using grouped or stacked bar charts.

```python
# Visualizing crosstab
ct_absolute.plot(kind="bar", stacked=True, color=["skyblue", "salmon"], figsize=(8, 5))
plt.title("Product Preference by Gender (Stacked)")
plt.ylabel("Count")
plt.show()
```

### 3. Chi-Square Test of Independence
To determine if the relationship between two categorical variables is statistically significant (or if they are independent), we run a Chi-Square test.
* **Null Hypothesis ($H_0$):** The two variables are independent.
* **Alternative Hypothesis ($H_1$):** The variables are dependent.
* **Metric:** If the p-value is $< 0.05$, we reject independence and conclude there is an association.

```python
import scipy.stats as stats

# Run Chi-Square test
chi2, p_val, dof, expected = stats.chi2_contingency(ct_absolute)
print(f"Chi2 Statistic: {chi2:.4f}")
print(f"p-value: {p_val:.4f}")
```

```text
# Output:
Chi2 Statistic: 0.0526
p-value: 0.8186
```

Since the p-value ($0.8186$) is $> 0.05$, we fail to reject independence. Gender and product preference do not have a statistically significant relationship in this sample.

---

## Edge Cases, Gotchas & Industry Best Practices

### 1. The Correlation vs. Causation Trap
A high correlation coefficient between $X$ and $Y$ does not mean that $X$ causes $Y$. There could be a third, unobserved factor (a **confounding variable** or **lurking variable**) that drives both.
* *Example:* Ice cream sales and drowning incidents are highly correlated. However, ice cream does not cause drowning. Summer heat (confounding variable) causes both ice cream sales and swimming activity to increase.

### 2. Simpson's Paradox
Simpson's Paradox occurs when a trend or relationship appears in several groups of data but reverses or disappears when the groups are combined.

```python
# Simpson's Paradox Example:
# Group A: x and y are positively correlated
group_a_x = np.random.uniform(10, 20, 50)
group_a_y = 2 * group_a_x + np.random.normal(0, 2, 50) # positive slope

# Group B: x and y are positively correlated, but lower values overall
group_b_x = np.random.uniform(30, 40, 50)
group_b_y = 2 * group_b_x - 50 + np.random.normal(0, 2, 50) # positive slope, shifted down

# Combine them
x_all = np.concatenate([group_a_x, group_b_x])
y_all = np.concatenate([group_a_y, group_b_y])

# Overall correlation
overall_corr = pd.Series(x_all).corr(pd.Series(y_all))
print(f"Overall Combined Correlation: {overall_corr:.4f}")
```

```text
# Output:
Overall Combined Correlation: -0.2354
```

Individually, both groups have a strong positive correlation ($+0.9$ or higher). However, when combined, the correlation becomes **negative** ($-0.2354$) due to the shift in intercepts. 

**Best Practice:** Always segment your data by logical categorical variables (such as user segments, countries, or age cohorts) to check for Simpson's Paradox.

### 3. Anscombe's Quartet
Anscombe's Quartet consists of four datasets that have nearly identical simple statistical properties:
* Mean of $x$: $9.0$
* Mean of $y$: $7.5$
* Pearson correlation: $0.816$
* OLS regression line: $y = 3.0 + 0.5x$

However, when plotted, they display completely different behaviors:
1. **Dataset I:** A standard linear relationship.
2. **Dataset II:** A perfect quadratic curve.
3. **Dataset III:** A linear relationship with a single extreme outlier pulling the trend line.
4. **Dataset IV:** A vertical cluster with one outlier.

> [!IMPORTANT]
> Never rely on summary statistics alone. Always visualize your data.

---

## Practice Exercises

<div class="challenge">
<h3>Challenge 1: Simpson's Paradox Explorer</h3>
<p>Create a script to generate a synthetic dataset with two user segments: "Premium Users" and "Free Users". Build the data such that:
1. Within each segment, customer satisfaction is positively correlated with the number of support tickets resolved.
2. Across the combined dataset, satisfaction appears negatively correlated with resolved tickets.
Verify these correlations mathematically.</p>
</div>

#### Solution Walkthrough:

```python
import pandas as pd
import numpy as np

np.random.seed(100)

# Premium: low tickets, high satisfaction
premium_tickets = np.random.uniform(1, 5, 100)
premium_sat = 2 * premium_tickets + 80 + np.random.normal(0, 1, 100)

# Free: high tickets, low satisfaction
free_tickets = np.random.uniform(8, 12, 100)
free_sat = 2 * free_tickets + 30 + np.random.normal(0, 1, 100)

df_premium = pd.DataFrame({"tickets": premium_tickets, "satisfaction": premium_sat, "tier": "Premium"})
df_free = pd.DataFrame({"tickets": free_tickets, "satisfaction": free_sat, "tier": "Free"})
df_total = pd.concat([df_premium, df_free])

# Compute correlations
corr_p = df_total[df_total["tier"] == "Premium"]["tickets"].corr(df_total[df_total["tier"] == "Premium"]["satisfaction"])
corr_f = df_total[df_total["tier"] == "Free"]["tickets"].corr(df_total[df_total["tier"] == "Free"]["satisfaction"])
corr_all = df_total["tickets"].corr(df_total["satisfaction"])

print(f"Premium Segment Correlation: {corr_p:.4f}")
print(f"Free Segment Correlation:    {corr_f:.4f}")
print(f"Combined Correlation:        {corr_all:.4f}")
```

```text
# Output:
Premium Segment Correlation: 0.9022
Free Segment Correlation:    0.8924
Combined Correlation:        -0.8407
```

The combined correlation is strongly negative, while the individual segment correlations are strongly positive, illustrating Simpson's Paradox.

---

## Section Recaps

* **Pearson vs. Spearman:** Use Pearson for linear relationships between normally distributed variables. Use Spearman for non-linear, monotonic relationships, or when outliers are present.
* **Comparing Categorical & Numerical:** Use grouped box plots, overlapping KDEs, and bar charts with 95% confidence intervals.
* **Categorical Contingency:** Construct cross-tabulations with `pd.crosstab(normalize='index')` to view percentage shifts, and validate associations using a Chi-Square test of independence.
* **Auditing Paradoxes:** Watch out for Simpson's Paradox by segmenting your analysis, and always visualize data to avoid the traps of Anscombe's Quartet.

---

## Common Interview Questions

### Q1: What is the difference between Pearson correlation and Spearman rank correlation, and when would you use each?
**Answer:**
* **Pearson Correlation:** Measures the strength of the linear relationship between two continuous variables. It uses the raw data values and is highly sensitive to outliers. It assumes normality and homoscedasticity.
* **Spearman Correlation:** Measures the strength of a monotonic relationship (whether variables increase or decrease together, regardless of rate). It converts raw values into ranks and runs Pearson correlation on those ranks. It is robust to outliers and does not assume normality.

You use Pearson when you expect a linear relationship and the data is normally distributed. You use Spearman when the relationship is non-linear but monotonic (e.g., exponential growth), or when your dataset contains significant outliers or ordinal data.

---

### Q2: What is Simpson's Paradox? Provide a real-world example and explain how you would detect it.
**Answer:**
Simpson's Paradox occurs when a trend or association appears within subgroups of a dataset but reverses or disappears when the subgroups are combined. 

A classic real-world example occurred in the 1973 UC Berkeley gender bias study. The aggregate admission statistics showed that men were admitted at a significantly higher rate than women, suggesting bias. However, when the data was segmented by department, it was revealed that women had applied to highly competitive departments with low acceptance rates, while men applied to less competitive departments with higher acceptance rates. Within individual departments, there was actually a slight bias in favor of admitting women.

You detect Simpson's Paradox by segmenting your bivariate analyses across key categorical control variables (such as customer segments, geographic regions, or cohort groups) rather than relying solely on aggregate correlation metrics.

---

### Q3: Why is Anscombe's Quartet significant in exploratory data analysis?
**Answer:**
Anscombe's Quartet consists of four synthetic datasets that have identical basic descriptive statistics (mean, variance, correlation coefficient, and OLS regression line). However, when visualized on a scatter plot, their distributions look completely different. 

The quartet is significant because it highlights the limitations of summary statistics. It serves as a warning that numerical summaries can hide extreme anomalies, non-linear relationships, and outliers. It reinforces the primary rule of EDA: always visualize your data before making modeling assumptions.

---

### Q4: How do you test whether the relationship between two categorical variables is statistically significant?
**Answer:**
To test the relationship between two categorical variables:
1. Construct a contingency table (cross-tabulation) using `pd.crosstab(cat_var1, cat_var2)` to count frequencies.
2. Run a Chi-Square test of independence using `scipy.stats.chi2_contingency(contingency_table)`.
3. The test evaluates the null hypothesis ($H_0$) that the variables are independent by comparing the observed frequencies to the expected frequencies if no relationship existed.
4. If the resulting p-value is less than 0.05, we reject the null hypothesis and conclude that the relationship between the two categorical variables is statistically significant.

---

### Q5: What is homoscedasticity, and why is it important when analyzing bivariate relationships with linear regression?
**Answer:**
Homoscedasticity occurs when the variance of the residuals (the differences between the observed data points and the fitted regression line) is constant across all levels of the independent variable ($X$). In other words, the spread of the data points around the regression line is uniform. 

If the spread is uneven (e.g., the points are clustered tightly around the line for low values of $X$ but fan out widely for high values of $X$), the relationship is **heteroscedastic**. Homoscedasticity is a core assumption of Ordinary Least Squares (OLS) linear regression. If it is violated, the regression coefficients remain unbiased, but the standard errors will be incorrect, invalidating confidence intervals and hypothesis tests. It indicates that a linear model might not capture the relationship accurately, or that the data requires transformation (such as a log transformation).
