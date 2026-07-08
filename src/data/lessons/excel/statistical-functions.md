---
title: "Statistical Functions — MEDIAN, STDEV, CORREL & Forecasting"
description: "Apply statistical analysis in Excel — median, standard deviation, correlation, percentiles, ranking, trendlines, and FORECAST."
category: "excel"
order: 102
phase: 3
tags: ["excel", "statistics", "median", "stdev", "correlation"]
publishedDate: 2025-03-24
prevSlug: "charts-visualization"
nextSlug: "what-if-analysis"
seoTitle: "Excel Statistical Functions Tutorial | Datalogify"
seoDescription: "Master Excel statistics — MEDIAN, STDEV, CORREL, PERCENTILE, RANK, trendlines, FORECAST.LINEAR."
---

## Why This Matters

"What's our average deal size?" is a beginner question. "What's the median deal size, and is the distribution skewed by outliers?" is what gets you promoted. Statistical functions help you move from describing data to actually understanding it — and that's where real business decisions happen.

---

## Central Tendency — AVERAGE vs. MEDIAN vs. MODE

These three functions answer the same question differently: "What's a typical value?"

### Example Data: Monthly Sales per Rep

| Sales Rep | Monthly Sales (₹) |
|---|---|
| Amit | 3,20,000 |
| Priya | 4,80,000 |
| Raj | 2,10,000 |
| Sneha | 15,00,000 |
| Vikram | 3,60,000 |
| Neha | 2,80,000 |
| Karan | 3,90,000 |

### Formulas

```text
=AVERAGE(B2:B8)
```

```text
Result: ₹5,05,714
```

```text
=MEDIAN(B2:B8)
```

```text
Result: ₹3,60,000
```

```text
=MODE.SNGL(B2:B8)
```

```text
Result: #N/A (no repeating values in this dataset)
```

### Why the Difference Matters

The average is ₹5.05L but the median is ₹3.60L. Why? Because Sneha's ₹15L is an outlier pulling the average up. **Six out of seven reps** sell less than the average — making it a misleading "typical" value.

<div class="interview-tip">
This is a classic interview question: "When would you use median instead of average?" Answer: When the data is skewed — salaries (CEO pay skews the average), house prices (luxury homes), deal sizes (one enterprise deal vs. many small ones). Median is resistant to outliers. ALWAYS check both.
</div>

---

## Spread — STDEV and VAR

Knowing the center isn't enough. Two datasets can have the same average but wildly different spreads.

### Sample vs. Population

| Function | Use When |
|---|---|
| STDEV.S / VAR.S | Your data is a **sample** from a larger population (most common in business) |
| STDEV.P / VAR.P | Your data IS the entire **population** (rare — e.g., all 5 stores you own) |

### Example: Delivery Times (in days)

| Order | Delivery Days |
|---|---|
| 1 | 3 |
| 2 | 5 |
| 3 | 4 |
| 4 | 7 |
| 5 | 3 |
| 6 | 4 |
| 7 | 6 |
| 8 | 2 |
| 9 | 5 |
| 10 | 4 |

```text
=AVERAGE(B2:B11)
```

```text
Result: 4.3 days
```

```text
=STDEV.S(B2:B11)
```

```text
Result: 1.49 days
```

```text
=VAR.S(B2:B11)
```

```text
Result: 2.23
```

### Interpreting Standard Deviation

Standard deviation tells you how far values typically fall from the average.

- **Average ± 1 STDEV** → ~68% of data falls here: 2.81 to 5.79 days
- **Average ± 2 STDEV** → ~95% of data falls here: 1.32 to 7.28 days

A delivery of 8+ days would be outside 2 standard deviations — statistically unusual.

```text
=STDEV.P(B2:B11)
```

```text
Result: 1.42 days (slightly smaller — population formula divides by N, not N-1)
```

<div class="interview-tip">
"What's the difference between STDEV.S and STDEV.P?" — STDEV.S divides by (n-1) and is used for samples (most real data). STDEV.P divides by n and is for entire populations. In practice, always use STDEV.S unless you're absolutely certain you have all the data that will ever exist.
</div>

---

## CORREL — Correlation Coefficient

CORREL measures the linear relationship between two variables. Returns a value from **-1 to +1**.

| Value | Meaning |
|---|---|
| +0.7 to +1.0 | Strong positive (both go up together) |
| +0.3 to +0.7 | Moderate positive |
| -0.3 to +0.3 | Weak or no correlation |
| -0.7 to -0.3 | Moderate negative |
| -1.0 to -0.7 | Strong negative (one up, other down) |

### Example: Ad Spend vs. Revenue

| Month | Ad Spend (₹) | Revenue (₹) |
|---|---|---|
| Jan | 1,00,000 | 8,50,000 |
| Feb | 1,20,000 | 9,20,000 |
| Mar | 1,50,000 | 10,50,000 |
| Apr | 1,30,000 | 9,80,000 |
| May | 1,80,000 | 11,00,000 |
| Jun | 2,00,000 | 12,30,000 |

```text
=CORREL(B2:B7, C2:C7)
```

```text
Result: 0.987
```

That's a very strong positive correlation — as ad spend increases, revenue increases almost proportionally.

### R-Squared (Coefficient of Determination)

```text
=CORREL(B2:B7, C2:C7)^2
```

```text
Result: 0.974
```

R² = 0.974 means 97.4% of revenue variation is "explained" by ad spend variation. The remaining 2.6% is from other factors.

---

## RANK — Where Does Each Value Stand?

### Example: Employee Performance Scores

| Employee | Score |
|---|---|
| Amit | 87 |
| Priya | 92 |
| Raj | 78 |
| Sneha | 95 |
| Vikram | 85 |
| Neha | 91 |
| Karan | 88 |

```text
=RANK.EQ(B2, $B$2:$B$8, 0)
```

```text
Result for Amit (87): Rank 5
```

The third argument: **0** = descending (highest is #1), **1** = ascending (lowest is #1).

Copy this formula down for all employees:

```text
Sneha: Rank 1 (95)
Priya: Rank 2 (92)
Neha:  Rank 3 (91)
Karan: Rank 4 (88)
Amit:  Rank 5 (87)
Vikram: Rank 6 (85)
Raj:   Rank 7 (78)
```

---

## PERCENTILE and QUARTILE

Percentiles tell you what percentage of values fall below a given point.

### Using the Sales Rep Data

| Sales Rep | Monthly Sales (₹) |
|---|---|
| Raj | 2,10,000 |
| Neha | 2,80,000 |
| Amit | 3,20,000 |
| Vikram | 3,60,000 |
| Karan | 3,90,000 |
| Priya | 4,80,000 |
| Sneha | 15,00,000 |

```text
=PERCENTILE.INC(B2:B8, 0.25)
```

```text
Result: ₹2,80,000 (25th percentile — Q1)
```

```text
=PERCENTILE.INC(B2:B8, 0.50)
```

```text
Result: ₹3,60,000 (50th percentile — same as MEDIAN)
```

```text
=PERCENTILE.INC(B2:B8, 0.75)
```

```text
Result: ₹4,80,000 (75th percentile — Q3)
```

```text
=PERCENTILE.INC(B2:B8, 0.90)
```

```text
Result: ₹11,04,000 (90th percentile — top 10% threshold)
```

### Quartiles Shortcut

```text
=QUARTILE.INC(B2:B8, 1)
```

```text
Result: ₹2,80,000 (Q1 — same as 25th percentile)
```

```text
=QUARTILE.INC(B2:B8, 3)
```

```text
Result: ₹4,80,000 (Q3 — same as 75th percentile)
```

### IQR (Interquartile Range)

```text
=QUARTILE.INC(B2:B8, 3) - QUARTILE.INC(B2:B8, 1)
```

```text
Result: ₹2,00,000 (the middle 50% of values spans ₹2L)
```

---

## Outlier Detection — The Practical Formula

Outliers can skew your analysis. Here's the standard statistical approach using Mean ± 2×STDEV.

### Formula: Flag Outliers

Given sales data in B2:B8:

```text
=IF(OR(B2 > AVERAGE($B$2:$B$8) + 2*STDEV.S($B$2:$B$8),
       B2 < AVERAGE($B$2:$B$8) - 2*STDEV.S($B$2:$B$8)),
   "OUTLIER", "Normal")
```

### Calculation Walkthrough

```text
Average: ₹5,05,714
STDEV.S: ₹4,37,297

Upper Bound: 5,05,714 + 2 × 4,37,297 = ₹13,80,309
Lower Bound: 5,05,714 - 2 × 4,37,297 = negative (so effectively 0)

Sneha (₹15,00,000) > ₹13,80,309 → OUTLIER
Everyone else → Normal
```

### IQR Method (Alternative — More Robust)

```text
=IF(OR(B2 > QUARTILE.INC($B$2:$B$8,3) + 1.5*(QUARTILE.INC($B$2:$B$8,3)-QUARTILE.INC($B$2:$B$8,1)),
       B2 < QUARTILE.INC($B$2:$B$8,1) - 1.5*(QUARTILE.INC($B$2:$B$8,3)-QUARTILE.INC($B$2:$B$8,1))),
   "OUTLIER", "Normal")
```

```text
Q1: ₹2,80,000   Q3: ₹4,80,000   IQR: ₹2,00,000
Upper fence: 4,80,000 + 1.5 × 2,00,000 = ₹7,80,000
Lower fence: 2,80,000 - 1.5 × 2,00,000 = negative → 0

Sneha (₹15,00,000) > ₹7,80,000 → OUTLIER
```

<div class="interview-tip">
"How do you handle outliers?" Don't just delete them. First, investigate WHY they're outliers. Sneha's ₹15L could be a data entry error (fix it), a one-time enterprise deal (separate it), or genuinely exceptional performance (celebrate it). The method matters less than the business context.
</div>

---

## Trendlines in Charts

Trendlines fit a mathematical line to your data points. They're visual forecasting tools.

### Types of Trendlines

| Trendline | Use When | Formula Shape |
|---|---|---|
| Linear | Steady, consistent growth | y = mx + b |
| Exponential | Growth that accelerates | y = ae^(bx) |
| Polynomial | Data rises and falls | y = ax² + bx + c |
| Moving Average | Smooth out noise | Average of last N points |

### Adding a Trendline

1. Create a scatter or line chart
2. Right-click any data point → **Add Trendline**
3. Choose **Linear** (most common for business data)
4. Check ✅ **Display Equation on chart**
5. Check ✅ **Display R-squared value**

```text
Equation: y = 7,200x + 7,94,000
R² = 0.974

Interpretation: For every ₹1 increase in ad spend, revenue increases by ₹7.20.
Base revenue (with zero ad spend) would theoretically be ₹7.94L.
```

### Forecasting with Trendline

Check **Forward: 3 periods** in trendline options to visually extend the line and see projected values.

---

## FORECAST.LINEAR — Formula-Based Projections

When you need the actual number (not just a visual trendline):

### Example: Predicting July Revenue

| Month (Number) | Revenue (₹) |
|---|---|
| 1 (Jan) | 8,50,000 |
| 2 (Feb) | 9,20,000 |
| 3 (Mar) | 10,50,000 |
| 4 (Apr) | 9,80,000 |
| 5 (May) | 11,00,000 |
| 6 (Jun) | 12,30,000 |

```text
=FORECAST.LINEAR(7, B2:B7, A2:A7)
```

```text
Result: ₹12,76,667 (predicted July revenue)
```

```text
=FORECAST.LINEAR(12, B2:B7, A2:A7)
```

```text
Result: ₹16,13,333 (predicted December revenue)
```

### How It Works

FORECAST.LINEAR fits a least-squares regression line through the known data and extrapolates. Arguments:

```text
=FORECAST.LINEAR(x_new, known_y_values, known_x_values)
```

### Important Caveats

- **Only works for linear trends** — if growth is exponential, use GROWTH() or LOGEST() instead
- **Assumes the pattern continues** — external shocks (new competitor, market crash) break forecasts
- **More data = better forecast** — 6 months is the minimum; 12+ months is better

---

## Business Case: Sales Performance Analysis

Let's put it all together. You're analyzing quarterly sales data for a 20-person team.

### Key Metrics to Calculate

```text
=AVERAGE(B2:B21)
```

```text
Average quarterly sales: ₹4,20,000
```

```text
=MEDIAN(B2:B21)
```

```text
Median quarterly sales: ₹3,85,000 (skewed right — a few top performers pull the average up)
```

```text
=STDEV.S(B2:B21)
```

```text
Standard deviation: ₹1,80,000 (wide spread — performance varies a lot)
```

```text
=PERCENTILE.INC(B2:B21, 0.90)
```

```text
90th percentile: ₹7,10,000 (top 10% sell above this)
```

```text
=COUNTIF(B2:B21, ">" & AVERAGE(B2:B21) + 2*STDEV.S(B2:B21))
```

```text
Outliers (above 2 STDEV): 1 person
```

### Analyst Recommendations

```text
1. Median (₹3.85L) is a better "target" than average (₹4.20L) for most reps
2. High STDEV (₹1.8L) suggests inconsistent performance — investigate training needs
3. 90th percentile (₹7.1L) is the benchmark for top performer recognition
4. 1 outlier above 2 STDEV — verify if it's sustainable or a one-time deal
```

---

## Where This Is Used in Real Jobs

| Role | Statistical Function Used |
|---|---|
| Sales Analyst | MEDIAN deal size, PERCENTILE for quotas, RANK for leaderboards |
| Financial Analyst | STDEV for risk assessment, CORREL for portfolio analysis |
| HR Analyst | PERCENTILE for salary benchmarking, outlier detection in attrition |
| Marketing Analyst | CORREL between spend and conversions, FORECAST for budgeting |
| Operations Analyst | STDEV for process variation (Six Sigma), control charts |

---

<div class="challenge">

### Challenge: Analyze Customer Acquisition Cost

**Dataset:** 15 months of data with columns: Month, Marketing Spend (₹), New Customers, Revenue from New Customers.

**Calculate:**
1. CAC (Customer Acquisition Cost) = Marketing Spend / New Customers for each month
2. AVERAGE, MEDIAN, and STDEV of CAC across all months
3. CORREL between Marketing Spend and New Customers
4. PERCENTILE at 25th, 50th, 75th, and 90th for CAC
5. Flag any months where CAC is an outlier (Mean ± 2×STDEV)
6. Use FORECAST.LINEAR to predict next month's New Customers based on planned spend
7. Create a scatter plot of Spend vs. New Customers with a trendline and R²

**Bonus:** Is average or median CAC more appropriate for reporting to leadership? Why?

</div>

---

## Common Interview Questions

### Q1: When should you use MEDIAN instead of AVERAGE?

**Answer:** Use MEDIAN when data is skewed by outliers. Salary data is the classic example — a CEO earning ₹5Cr pulls the average way above what most employees earn. MEDIAN gives the "middle person" value, which is more representative. In general, always calculate both and compare. If they're significantly different, the data is skewed and MEDIAN is more informative.

### Q2: What's the difference between STDEV.S and STDEV.P?

**Answer:** STDEV.S (sample) divides by n-1 and is used when your data is a sample from a larger population — which is almost always the case in business. STDEV.P (population) divides by n and is used only when you have the complete population. The difference shrinks as n gets large. In practice, default to STDEV.S.

### Q3: How do you detect outliers in Excel?

**Answer:** Two common methods: (1) Mean ± 2 standard deviations — flags values outside 95% of the expected range. (2) IQR method — values below Q1 - 1.5×IQR or above Q3 + 1.5×IQR. The IQR method is more robust because it uses percentiles, which aren't affected by the outliers themselves. After detection, always investigate the business reason before removing.

### Q4: What does a CORREL value of -0.85 tell you?

**Answer:** It indicates a strong negative linear relationship between two variables. As one increases, the other decreases proportionally. For example, CORREL between price increases and units sold might be -0.85 — raising prices strongly correlates with fewer units sold. But correlation ≠ causation. You'd need further analysis (controlled experiments, regression) to establish that the price change actually caused the sales decline.

### Q5: How does FORECAST.LINEAR work and what are its limitations?

**Answer:** FORECAST.LINEAR fits a straight line (least-squares regression) through known X-Y data and predicts Y for a new X value. Limitations: it only works for linear trends (not exponential or cyclical), it assumes historical patterns continue unchanged, it's sensitive to outliers in the training data, and accuracy degrades the further you forecast from your known data range. For non-linear data, consider GROWTH() or LOGEST().
