---
title: "Linear Regression — Correlation, Prediction & OLS"
description: "Understand regression modeling. Learn simple linear regression, Ordinary Least Squares (OLS), R-squared, multiple regression, and diagnostic checks."
category: "statistics"
order: 7
phase: 5
tags: ["statistics", "linear-regression", "ols", "r-squared"]
publishedDate: 2025-04-16
prevSlug: "ab-testing-experimentation"
nextSlug: "logistic-regression"
seoTitle: "Linear Regression & OLS Diagnostics in Python | Datalogify"
seoDescription: "Master linear regression modeling. Learn Ordinary Least Squares (OLS), R-squared, multiple regression, and regression assumptions check."
---

## Why This Matters

Linear regression is the foundational model of predictive analytics and causal inference. Whether you are estimating how marketing spend drives sales, predicting house prices, or quantifying the impact of employee training hours on productivity, regression provides a clear mathematical relationship between input factors and output outcomes. Mastering regression is not just about fitting lines; it is about interpreting statistical coefficients, validating assumptions, and auditing models to prevent misleading predictions.

---

## The Analogy: Adjusting the Knobs on a Machine

Imagine you are standing in front of an industrial machine that manufactures plastic bottles. Your goal is to maximize the speed at which bottles are produced.

```text
                  Inputs (X)                      Output (Y)
          ┌─────────────────────────┐         ┌────────────────┐
          │  [Knob 1: Temperature]  ├────────>│                │
          │  [Knob 2: Belt Speed ]  ├────────>│  Bottle Speed  │
          │  [Knob 3: Plastic Flow] ├────────>│  (Bottles/Min) │
          └─────────────────────────┘         └────────────────┘
```

* **Simple Linear Regression:** You focus on just one knob—**Temperature ($X$)**. You turn the temperature knob slightly to the right, and the machine speeds up ($Y$ increases). The regression line tells you exactly how many additional bottles per minute you get for every $1^\circ\text{C}$ increase in temperature (the slope, $\beta_1$), and how fast the machine runs if the temperature is set to zero (the intercept, $\beta_0$).
* **Multiple Linear Regression:** You look at all the knobs at the same time: Temperature, Belt Speed, and Plastic Flow. Now, the model tells you the unique impact of turning the Temperature knob *while keeping all other knobs fixed*.
* **Ordinary Least Squares (OLS):** This is the automatic calibration system that measures the distance between your predicted speeds and the actual speeds of the machine. It works by turning the knobs until the sum of all squared errors (the differences between predicted and actual output) is minimized.

---

## Step-by-Step Concept Breakdown: Simple Linear Regression

Simple linear regression models the relationship between a single independent variable $X$ and a dependent variable $Y$ using a straight line.

$$\text{Equation: } Y = \beta_0 + \beta_1 X + \epsilon$$

Where:
* $Y$: The dependent (target) variable.
* $X$: The independent (predictor) variable.
* $\beta_0$: The Y-intercept. The value of $Y$ when $X = 0$.
* $\beta_1$: The slope (coefficient). The change in $Y$ for a one-unit change in $X$.
* $\epsilon$: The error term (residuals). The random noise or variation not explained by the model.

### Fitting the Line: Ordinary Least Squares (OLS)
How do we find the "best" line? We define the error (residual) for each data point as:

$$e_i = Y_i - \hat{Y}_i$$

Where $Y_i$ is the actual value and $\hat{Y}_i$ is the predicted value on the line. OLS minimizes the **Sum of Squared Residuals (SSR)**:

$$\text{SSR} = \sum_{i=1}^{n} e_i^2 = \sum_{i=1}^{n} (Y_i - (\beta_0 + \beta_1 X_i))^2$$

Squaring the errors has two major mathematical benefits:
1. It eliminates negative signs so that positive and negative errors don't cancel each other out.
2. It penalizes larger errors more heavily (a residual of 4 becomes a penalty of 16, whereas a residual of 2 is only 4).

---

## Model Evaluation Metrics

Once we fit a line, we must measure how well it fits the data.

```text
               Total Variance in Data (SST)
  ┌────────────────────────────────────────────────────────┐
  │                                                        │
  │     Explained Variance (SSR)    │ Unexplained (SSE)     │
  │     (Model prediction power)    │ (Residual error)     │
  │                                 │                      │
  └─────────────────────────────────┴──────────────────────┘
                   R-Squared (R²) = SSR / SST
```

### 1. R-Squared ($R^2$ - Coefficient of Determination)
The proportion of variance in the dependent variable that is predictable from the independent variable(s).
* *Formula:* $R^2 = 1 - \frac{\text{SSE}}{\text{SST}}$ (where SSE is Sum of Squared Errors, SST is Total Sum of Squares).
* *Interpretation:* An $R^2$ of 0.80 means 80% of the variance in $Y$ is explained by the features in your model.

### 2. Adjusted R-Squared
Every time you add a new predictor variable to a model, the $R^2$ will **always increase or stay the same**, even if that variable is complete gibberish (e.g., adding "daily rainfall in London" to predict "house prices in New York"). 

Adjusted $R^2$ penalizes you for adding variables that do not add predictive value.

$$\text{Formula: } R^2_{adj} = 1 - \left[ \frac{(1 - R^2)(n - 1)}{n - p - 1} \right]$$

Where $n$ is the sample size and $p$ is the number of predictors. If Adjusted $R^2$ decreases when you add a feature, drop that feature!

### 3. Mean Squared Error (MSE) & Root Mean Squared Error (RMSE)
* **MSE:** The average of the squared residuals: $\frac{1}{n} \sum e_i^2$.
* **RMSE:** The square root of MSE: $\sqrt{\text{MSE}}$. RMSE is in the same unit as your target variable $Y$, making it highly interpretable.

---

## Code Walkthrough: Simple & Multiple Linear Regression

We will use `statsmodels` to run a regression analyzing how marketing spend (TV and Radio ads) affects sales.

```python
import numpy as np
import pandas as pd
import statsmodels.api as sm

# Generate synthetic dataset
np.random.seed(42)
n = 100
tv_spend = np.random.uniform(10, 100, n)
radio_spend = np.random.uniform(5, 50, n)
# Sales = 5 + 0.3*TV + 0.15*Radio + noise
sales = 5 + 0.3 * tv_spend + 0.15 * radio_spend + np.random.normal(0, 2.5, n)

df = pd.DataFrame({'Sales': sales, 'TV': tv_spend, 'Radio': radio_spend})

# --- Simple Linear Regression (Sales vs. TV) ---
X_simple = sm.add_constant(df['TV']) # Add intercept term
y = df['Sales']

model_simple = sm.OLS(y, X_simple).fit()
print("=== SIMPLE LINEAR REGRESSION SUMMARY ===")
print(model_simple.summary().tables[1])
print(f"R-squared: {model_simple.rsquared:.4f}")
print(f"Adj R-squared: {model_simple.rsquared_adj:.4f}\n")
```

```text
# Output:
=== SIMPLE LINEAR REGRESSION SUMMARY ===
==============================================================================
                 coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
const         10.5985      0.941     11.269      0.000       8.732      12.465
TV             0.2974      0.015     19.260      0.000       0.267       0.328
==============================================================================
R-squared: 0.7909
Adj R-squared: 0.7888
```

Now let's run a **Multiple Linear Regression** by adding Radio spend.

```python
# --- Multiple Linear Regression (Sales vs. TV & Radio) ---
X_multiple = sm.add_constant(df[['TV', 'Radio']])
model_multiple = sm.OLS(y, X_multiple).fit()

print("=== MULTIPLE LINEAR REGRESSION SUMMARY ===")
print(model_multiple.summary().tables[1])
print(f"R-squared: {model_multiple.rsquared:.4f}")
print(f"Adj R-squared: {model_multiple.rsquared_adj:.4f}")
```

```text
# Output:
=== MULTIPLE LINEAR REGRESSION SUMMARY ===
==============================================================================
                 coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
const          5.6427      0.725      7.781      0.000       4.204       7.082
TV             0.2975      0.009     33.864      0.000       0.280       0.315
Radio          0.1386      0.019      7.369      0.000       0.101       0.176
==============================================================================
R-squared: 0.8651
Adj R-squared: 0.8624
```

* **Interpretation:** 
  * The simple model shows that for every \$1 unit increase in TV spend, Sales increase by 0.297 units.
  * In the multiple regression model, when keeping Radio spend constant, a \$1 unit increase in TV spend yields a 0.297 unit increase in sales. Adding Radio improved our $R^2_{adj}$ from 0.7888 to 0.8624, showing it is an important predictor.

---

## Diagnostic Assumptions of OLS

To trust the coefficients and p-values from your OLS summary, you must check the **four core assumptions (LINE)**:

```text
       L - Linearity                     I - Independence
    ┌───────────────────────┐         ┌───────────────────────┐
    │ Residuals fluctuate   │         │ No correlation        │
    │ randomly around zero  │         │ between consecutive e │
    └───────────────────────┘         └───────────────────────┘
       N - Normality                     E - Equal Variance
    ┌───────────────────────┐         ┌───────────────────────┐
    │ Histogram of errors   │         │ Spread of residuals   │
    │ forms a bell curve    │         │ is constant           │
    └───────────────────────┘         └───────────────────────┘
```

### 1. Linearity
The relationship between $X$ and the mean of $Y$ is linear.
* **Diagnostic:** Plot Residuals vs. Fitted Values. The points should be randomly scattered around a horizontal line at 0. If you see a U-shape or curve, the relationship is non-linear (you might need polynomial terms or log transformations).

### 2. Independence of Residuals
The residuals must be independent of each other (no autocorrelation).
* **Diagnostic:** The Durbin-Watson statistic (shown in `statsmodels` summary).
  * $d \approx 2$: No autocorrelation.
  * $d < 1.5$: Positive autocorrelation (often in time-series data).
  * $d > 2.5$: Negative autocorrelation.

### 3. Normality of Residual Errors
The error terms should be normally distributed.
* **Diagnostic:** Normal Q-Q plot or Shapiro-Wilk test on the residuals.

### 4. Homoscedasticity (Equal Variance)
The variance of residual errors must be constant across all levels of the independent variables.
* **Diagnostic:** Plot Residuals vs. Fitted Values. If you see a "funnel" shape (errors get wider as predictions get larger), you have heteroscedasticity.
* **Implications:** Coefficients remain unbiased, but standard errors are calculated incorrectly, making p-values and confidence intervals untrustworthy.

---

## Code Walkthrough: Diagnosing Assumptions

Let's test these assumptions in Python:

```python
import matplotlib.pyplot as plt
import scipy.stats as stats

# Calculate residuals
residuals = model_multiple.resid
fitted = model_multiple.fittedvalues

# Set up subplots
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# 1. Residuals vs Fitted Plot (checks Linearity & Homoscedasticity)
axes[0].scatter(fitted, residuals, alpha=0.7, color='purple')
axes[0].axhline(0, color='red', linestyle='--')
axes[0].set_xlabel('Fitted Values')
axes[0].set_ylabel('Residuals')
axes[0].set_title('Residuals vs. Fitted')

# 2. Q-Q Plot (checks Normality of residuals)
sm.qqplot(residuals, line='45', ax=axes[1], fit=True)
axes[1].set_title('Normal Q-Q Plot')

plt.show()
```

---

## Multicollinearity & Variance Inflation Factor (VIF)

### What is Multicollinearity?
Multicollinearity occurs when two or more independent variables are highly correlated with each other (e.g., trying to predict weight using height in inches and height in centimeters).

### Why it's a problem:
If $X_1$ and $X_2$ move together, the OLS math cannot isolate the individual impact of $X_1$ vs. $X_2$. It causes:
1. Massive variance in coefficient estimates (estimates become highly unstable).
2. Inflated standard errors and deflated t-statistics (important variables show up as non-significant).

### Detection: Variance Inflation Factor (VIF)
VIF measures how much the variance of an estimated regression coefficient is increased because of collinearity.

$$\text{Formula for } X_j: \text{VIF}_j = \frac{1}{1 - R_j^2}$$

Where $R_j^2$ is the $R^2$ obtained by regressing $X_j$ against all other independent variables.
* **VIF = 1:** No correlation.
* **VIF > 5:** Moderate correlation (investigate).
* **VIF > 10:** Severe multicollinearity. You must drop or merge one of the variables.

#### Code Walkthrough: Checking VIF

```python
from statsmodels.stats.outliers_influence import variance_inflation_factor

# Generate collinear data
df['TV_duplicated'] = df['TV'] * 1.05 + np.random.normal(0, 0.2, n)

# Prepare feature matrix
X_collinear = df[['TV', 'Radio', 'TV_duplicated']]
X_collinear = sm.add_constant(X_collinear)

# Calculate VIF for each feature
vif_data = pd.DataFrame()
vif_data["Feature"] = X_collinear.columns
vif_data["VIF"] = [variance_inflation_factor(X_collinear.values, i) for i in range(X_collinear.shape[1])]

print(vif_data[vif_data['Feature'] != 'const'])
```

```text
# Output:
             Feature         VIF
1                 TV  282.802144
2              Radio    1.002821
3      TV_duplicated  282.781845
```

* **Interpretation:** The VIF scores for `TV` and `TV_duplicated` are extremely high ($> 280$). You must drop one of these variables to build a stable model.

---

## Gotchas & Common Mistakes

### 1. Correlation vs. Regression Coefficients
A correlation of 0.80 between $X$ and $Y$ shows they move together. However, a regression coefficient $\beta_1 = 0.80$ means that a one-unit change in $X$ results in a 0.80-unit change in $Y$, **controlling for other variables**. Adding variables can change a coefficient from positive to negative due to confounding (Simpson's Paradox).

### 2. Extrapolation Danger
Do not predict values outside the range of your training data. If your data only contains TV spend between \$10k and \$100k, predicting sales for a \$1,000k TV spend is highly dangerous, as the relationship may become non-linear or plateau at higher spend levels.

---

## Practice Exercises & Mini-Projects

<div class="challenge">
### Challenge 1: Advertising Attribution Review
Use the provided code block to generate the Sales, TV, and Radio dataset. 
1. Fit a model predicting `Sales` using only `Radio`.
2. Compare the Radio coefficient and Adjusted R-squared of this simple model to the multiple regression model (Sales vs. TV + Radio).
3. Explain why the coefficient of Radio changed.
</div>

<div class="challenge">
### Challenge 2: Auditing Housing Data
A dataset contains:
* `SquareFeet` (VIF = 12)
* `NumBedrooms` (VIF = 8)
* `NumBathrooms` (VIF = 9)

Identify the issue, explain how it impacts your interpretation of features, and outline 3 methods to fix it.
</div>

---

## Section Recaps

* **OLS** fits a line by minimizing the sum of squared differences between observed and predicted values.
* **Adjusted R-squared** scales $R^2$ to account for the number of predictors, penalizing complex models that add no value.
* **LINE assumptions** must be validated before you trust the p-values and confidence intervals of your coefficients.
* **Heteroscedasticity** distorts standard errors; you can diagnose it using residual plots and resolve it using robust standard errors or log transforms.
* **Multicollinearity** inflates variance and makes coefficients unstable. Detect it using **VIF** and drop redundant variables.

---

## Common Interview Questions

### Q1: What is the difference between $R^2$ and Adjusted $R^2$? Why is Adjusted $R^2$ preferred in multiple linear regression?
**Answer:**
* **$R^2$ (Coefficient of Determination)** measures the proportion of total variance in the dependent variable explained by the model:
  $$R^2 = 1 - \frac{\text{SSE}}{\text{SST}}$$
  A critical limitation of $R^2$ is that it will mathematically increase (or remain constant) whenever any new feature is added to the model, even if that feature is completely uncorrelated random noise. This incentivizes overfitting.
* **Adjusted $R^2$** addresses this limitation by introducing a penalty for each additional independent variable added to the model:
  $$R^2_{adj} = 1 - \left[ \frac{(1 - R^2)(n - 1)}{n - p - 1} \right]$$
  Where $n$ is the sample size and $p$ is the number of predictors. 
  
As $p$ increases, the denominator $(n - p - 1)$ decreases, which increases the penalty term. If the added variable does not improve $R^2$ by an amount sufficient to offset this penalty, the Adjusted $R^2$ will decrease. In multiple regression, Adjusted $R^2$ is preferred because it allows analysts to compare models with different numbers of predictors and guards against overfitting.

### Q2: List the four primary assumptions of Ordinary Least Squares (OLS) regression and explain how you would diagnose violations for each.
**Answer:**
The four OLS assumptions can be remembered using the acronym **LINE**:
1. **L - Linearity:** The relationship between the independent and dependent variables is linear.
   * *Diagnosis:* Plot residual values against fitted values. The scatter should be randomly distributed around the horizontal line $y=0$ without forming curved patterns.
2. **I - Independence:** The residuals (errors) are independent and do not exhibit autocorrelation.
   * *Diagnosis:* Check the **Durbin-Watson statistic** in the model summary. A value close to 2.0 indicates independence. Values below 1.5 indicate positive autocorrelation (common in time-series data).
3. **N - Normality:** The residual errors are normally distributed.
   * *Diagnosis:* Create a **Q-Q plot** of the residuals and check if the points lie along the 45-degree diagonal reference line. Alternatively, perform a Shapiro-Wilk test on the residuals.
4. **E - Equal Variance (Homoscedasticity):** The variance of the error terms is constant across all levels of the predictors.
   * *Diagnosis:* Examine the residual vs. fitted plot. If the spread of residuals increases or decreases as a function of the fitted values (forming a funnel or megaphone shape), homoscedasticity is violated.

### Q3: What is multicollinearity? Why is it a problem in multiple linear regression, and how do you detect and resolve it?
**Answer:**
**Multicollinearity** occurs when two or more independent variables in a multiple regression model are highly correlated with each other, meaning one can be linearly predicted from the others with a high degree of accuracy.

**Why it is a problem:**
It does not affect the model's overall predictive power or the Adjusted $R^2$, but it severely degrades the ability to interpret individual features. OLS calculates coefficients by looking at the marginal effect of $X_1$ while holding all other variables constant. If $X_1$ and $X_2$ are highly collinear, the model cannot isolate their individual effects. This leads to:
1. Highly unstable coefficient estimates (small changes in the data can flip signs or shift values dramatically).
2. Inflated standard errors, which reduces the t-statistic and makes true predictors appear statistically insignificant.

**Detection:**
* Calculate the **Variance Inflation Factor (VIF)** for each predictor. A VIF value above 5 indicates moderate multicollinearity, and a VIF above 10 indicates severe multicollinearity.

**Resolution:**
1. Drop the redundant predictor with the highest VIF.
2. Combine the correlated variables into a single composite feature (e.g., using principal component analysis or averaging them).
3. Use regularization techniques like Ridge or Lasso regression, which penalize large coefficients.

### Q4: Explain the difference between a confidence interval and a prediction interval in linear regression. Which one is always wider and why?
**Answer:**
Both intervals provide range estimates around a regression prediction, but they estimate different values:
1. **Confidence Interval:** Estimates the range of the **expected mean value** of $Y$ for a given value of $X$. For example, "What is the average sales volume for all stores with a marketing spend of \$50k?"
2. **Prediction Interval:** Estimates the range of an **individual new observation** of $Y$ for a given value of $X$. For example, "If we open one new store and spend \$50k on marketing, what is the range of sales for this specific store?"

**Which is wider:**
The **prediction interval** is always wider than the confidence interval.

**Why:**
The variance of the estimate for the mean response (confidence interval) is driven purely by the uncertainty in estimating the model parameters ($\beta_0$ and $\beta_1$):

$$\text{Var}(\hat{\mu}_{Y|X}) = \sigma^2 \left[ \frac{1}{n} + \frac{(X_0 - \bar{X})^2}{\sum (X_i - \bar{X})^2} \right]$$

However, when predicting a single individual value (prediction interval), we must account for both the uncertainty in estimating the model parameters *and* the inherent, random variation of individual data points around the regression line (represented by the error term $\epsilon$, with variance $\sigma^2$):

$$\text{Var}(\hat{Y}_{\text{individual}|X}) = \sigma^2 \left[ 1 + \frac{1}{n} + \frac{(X_0 - \bar{X})^2}{\sum (X_i - \bar{X})^2} \right]$$

The addition of the "1" in the bracket represent the irreducible error, making the prediction interval wider.

### Q5: If your model residuals show heteroscedasticity, what are the implications for your OLS estimates, and how can you fix this issue?
**Answer:**
**Implications of Heteroscedasticity:**
1. **Coefficients remain unbiased:** The OLS estimates of the slopes ($\beta$) are still mathematically unbiased and consistent.
2. **Efficiency is lost:** OLS is no longer the Best Linear Unbiased Estimator (BLUE) because it does not have the minimum variance.
3. **Invalid Standard Errors:** The standard error formulas assume equal variance. Under heteroscedasticity, standard errors are calculated incorrectly (typically underestimated). This inflates t-statistics and leads to artificially low p-values, causing you to reject null hypotheses when you shouldn't.

**How to resolve it:**
1. **Log/Power Transformations:** Apply a mathematical transformation (like a natural logarithm or Box-Cox) to the dependent variable $Y$. This compresses the scale of larger values and stabilizes the variance.
2. **Use Robust Standard Errors:** Calculate **Huber-White Sandwich Standard Errors** (e.g., setting `cov_type='HC3'` in statsmodels). This does not change the coefficients, but it adjusts the standard errors to be heteroscedasticity-consistent, fixing your p-values and confidence intervals.
3. **Weighted Least Squares (WLS):** If you know how the variance scales, you can weight each observation by the inverse of its variance, giving less weight to high-variance data points.
