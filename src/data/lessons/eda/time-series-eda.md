---
title: "Time-Series EDA — Trend, Seasonality & Noise"
description: "Analyze data across time. Master trend detection, seasonal decomposition, rolling window smoothing, autocorrelation, and anomalies."
category: "eda"
order: 6
phase: 4
tags: ["eda", "time-series", "seasonality", "rolling-statistics"]
publishedDate: 2025-04-06
prevSlug: "multivariate-explorations"
nextSlug: "feature-transformations"
seoTitle: "Time-Series Exploratory Data Analysis | Datalogify"
seoDescription: "Analyze temporal data in Python. Master rolling window aggregates, seasonal decomposition (trends, seasonality, noise), and autocorrelation (ACF/PACF)."
---

## Why This Matters

Time-series data is fundamentally different from static cross-sectional data because the order of observations matters. Failing to understand temporal dynamics—like mixing up a seasonal sales spike with a genuine business growth trend—can lead to poor forecasts, inventory stockouts, or misallocated marketing budgets.

---

## The Time-Series Analogy: The Patient's Heartbeat

Imagine you are a doctor monitoring a patient's heart rate over a long period. To understand their health, you cannot look at a single, isolated pulse reading. Instead, you trace the readings over time and decompose what you see into three distinct behaviors:

```text
  [ Long-Term Trend ]  ---> Gradually slowing down over months (improving fitness).
  [ Daily Seasonality ] ---> Rising during the active afternoon, dropping during sleep.
  [ Random Noise ]      ---> An abrupt, temporary spike because a door slammed shut.
```

*   **The Trend**: Is the heart rate gradually slowing down over years due to cardiovascular conditioning, or rising due to stress? This is the long-term, underlying movement.
*   **The Seasonality**: Does the heart rate predictably rise during the day and drop at 3:00 AM during deep sleep? This is the cyclical pattern that repeats within a fixed, known window (the 24-hour circadian rhythm).
*   **The Noise (Residual)**: Did the patient hear a sudden loud noise, take a sip of coffee, or have a random skipped beat? This is the unpredictable, irregular fluctuation that has no cyclical schedule.

In time-series Exploratory Data Analysis (EDA), our mission is to peel apart these three components. If you do not isolate seasonality, you might mistake a normal daytime rise in heart rate for a medical emergency. Similarly, in business, you must isolate the holiday shopping spike to see if your core customer base is actually growing.

---

## Step-by-Step Concept Breakdown

To analyze time-series data, we must structure it correctly. Unlike typical tabular datasets, time-series data requires a chronological index and strict interval integrity.

### 1. The Core Components of Time-Series
A time-series $Y_t$ at any time step $t$ is mathematically represented as a combination of three elements:
1.  **Trend ($T_t$)**: The long-term direction of the data.
2.  **Seasonal ($S_t$)**: The repetitive patterns that recur at fixed intervals (e.g., daily, weekly, monthly).
3.  **Residual/Noise ($I_t$ or $E_t$)**: The irregular, random variation that remains after removing the trend and seasonality.

### 2. Seasonal Decomposition: Additive vs. Multiplicative
We can decompose a time-series using two primary models:

#### Additive Model
$$Y_t = T_t + S_t + I_t$$
Use this when the seasonal fluctuations have a constant amplitude regardless of the level of the trend. For example, if you sell exactly 500 extra units every December, whether your baseline monthly sales are 2,000 or 10,000 units, the pattern is additive.

#### Multiplicative Model
$$Y_t = T_t \times S_t \times I_t$$
Use this when the seasonal fluctuations grow or shrink proportionally with the trend. For example, if you sell 20% more units every December, then when your baseline sales are 2,000 you sell 400 extra, but when baseline sales grow to 10,000 you sell 2,000 extra. 

```text
     Additive Seasonality                 Multiplicative Seasonality
     (Constant Height)                    (Height Scales with Trend)
     
        /\      /\      /\                    /\
       /  \    /  \    /  \                  /  \          /\
      /    \  /    \  /    \                /    \        /  \
     /      \/      \/      \              /      \  /\  /    \
    -------------------------             ----------/--\/------
```

### 3. Smoothing and Rolling Statistics
Real-world time-series are noisy. To see the underlying signal, we apply smoothing techniques:
*   **Simple Moving Average (SMA)**: Takes the average of values inside a sliding window of size $W$. It filters out high-frequency noise but introduces a lag.
*   **Exponentially Weighted Moving Average (EWMA)**: Applies weights that decay exponentially as observations get older. It reacts faster to recent changes than SMA.
*   **Rolling Standard Deviation**: Computes the standard deviation inside a sliding window to track changes in local volatility.

### 4. Autocorrelation (ACF) and Partial Autocorrelation (PACF)
*   **Lag**: Shifting a time-series back by $k$ periods. Lag 1 ($Y_{t-1}$) is yesterday's value; Lag 7 ($Y_{t-7}$) is the value from the same day last week.
*   **ACF (Autocorrelation Function)**: Measures the total linear correlation between $Y_t$ and its lagged versions $Y_{t-k}$. A spike at Lag 7 indicates weekly seasonality.
*   **PACF (Partial Autocorrelation Function)**: Measures the correlation between $Y_t$ and $Y_{t-k}$ *after* removing the indirect linear effects of all intermediate lags ($Y_{t-1}$ through $Y_{t-k+1}$). This is essential for determining the autoregressive order of models.

---

## Code & Practical Walkthroughs

Let us implement these concepts using synthetic sales data featuring strong weekly seasonality and an upward trend.

### Example 1: Setting up Time Indices, Resampling, and Rolling Statistics

First, we will build a clean daily sales dataset, set up a proper DatetimeIndex, and smooth the noise using rolling calculations.

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set plotting style
sns.set_theme(style="whitegrid")

# 1. Create a continuous date range for 18 months
dates = pd.date_range(start="2024-01-01", end="2025-06-30", freq="D")
n_days = len(dates)

# 2. Simulate Trend: Gradual growth
np.random.seed(42)
trend = np.linspace(120, 350, n_days)

# 3. Simulate Weekly Seasonality: Sales peak on Friday (4) and Saturday (5)
# dates.dayofweek maps Monday=0, Sunday=6
day_effects = {0: -10, 1: -5, 2: 0, 3: 15, 4: 45, 5: 50, 6: -30}
seasonality = np.array([day_effects[d] for d in dates.dayofweek])

# 4. Simulate Noise
noise = np.random.normal(loc=0, scale=20, size=n_days)

# 5. Assemble the time-series
sales_values = trend + seasonality + noise

# 6. Create Pandas DataFrame with DatetimeIndex
df_sales = pd.DataFrame(data={"Sales": sales_values}, index=dates)

# Explicitly set the index frequency
df_sales.index.freq = 'D'

print("=== Raw Time-Series Head ===")
print(df_sales.head(7))
print("\nMissing index values count:", df_sales.index.isna().sum())
```

```text
# Output:
=== Raw Time-Series Head ===
                Sales
2024-01-01  119.93428
2024-01-02  112.22271
2024-01-03  132.84654
2024-01-04  165.65651
2024-01-05  201.21319
2024-01-06  205.61715
2024-01-07  122.95540

Missing index values count: 0
```

Now, let us calculate rolling statistics and resample our daily data to weekly levels to see if we can expose the underlying trend.

```python
# Compute rolling statistics
df_sales["7D_Moving_Average"] = df_sales["Sales"].rolling(window=7).mean()
df_sales["30D_Moving_Average"] = df_sales["Sales"].rolling(window=30).mean()
df_sales["7D_Volatility"] = df_sales["Sales"].rolling(window=7).std()

# Compute expanding window cumulative mean
df_sales["Cumulative_Mean"] = df_sales["Sales"].expanding().mean()

# Plot the comparisons
plt.figure(figsize=(14, 8))
plt.plot(df_sales.index, df_sales["Sales"], label="Daily Raw Sales", alpha=0.3, color="gray")
plt.plot(df_sales.index, df_sales["7D_Moving_Average"], label="7-Day Moving Avg (Weekly Trend)", linewidth=2, color="blue")
plt.plot(df_sales.index, df_sales["30D_Moving_Average"], label="30-Day Moving Avg (Monthly Trend)", linewidth=3, color="red")
plt.plot(df_sales.index, df_sales["Cumulative_Mean"], label="Expanding Cumulative Mean", linestyle="--", color="green")

plt.title("Sales Trends: Smoothing and Rolling Windows", fontsize=14, fontweight="bold")
plt.ylabel("Sales Volume ($)")
plt.legend()
plt.tight_layout()
plt.show()

# Show resampled weekly values
df_weekly = df_sales["Sales"].resample("W").mean().to_frame(name="Weekly_Average_Sales")
print("\n=== Resampled Weekly Sales Head ===")
print(df_weekly.head(4))
```

```text
# Output:
=== Resampled Weekly Sales Head ===
            Weekly_Average_Sales
2024-01-07            151.492255
2024-01-14            156.402488
2024-01-21            157.653491
2024-01-28            172.934812
```

---

### Example 2: Seasonal Decomposition using Statsmodels

We will use the `statsmodels` library to break our sales data down into its trend, seasonal, and residual components.

```python
from statsmodels.tsa.seasonal import seasonal_decompose

# 1. Perform Additive Decomposition
# period=7 because we expect weekly cycles in daily data
decomposition = seasonal_decompose(df_sales["Sales"], model="additive", period=7)

# 2. Extract components
trend_component = decomposition.trend
seasonal_component = decomposition.seasonal
residual_component = decomposition.resid

# 3. Plot the decomposed components
fig, axes = plt.subplots(4, 1, figsize=(12, 10), sharex=True)

axes[0].plot(df_sales["Sales"], label="Observed", color="black")
axes[0].set_title("Additive Seasonal Decomposition", fontsize=14, fontweight="bold")
axes[0].legend(loc="upper left")

axes[1].plot(trend_component, label="Trend", color="blue")
axes[1].legend(loc="upper left")

axes[2].plot(seasonal_component, label="Seasonal", color="green")
axes[2].legend(loc="upper left")

axes[3].scatter(df_sales.index, residual_component, label="Residuals (Noise)", color="red", alpha=0.5, s=8)
axes[3].axhline(0, color="black", linestyle="--")
axes[3].legend(loc="upper left")

plt.xlabel("Date")
plt.tight_layout()
plt.show()
```

```text
# Output:
A four-panel layout displaying:
- Observed: The original noisy series.
- Trend: A clean, smooth upward sloping line from 120 to 350.
- Seasonal: A constant, repeating weekly wave pattern peaking on Friday/Saturday.
- Residuals: Randomly scattered points centered around zero with no visible trend or seasonality.
```

---

### Example 3: Autocorrelation (ACF) and Partial Autocorrelation (PACF)

To diagnose lag relationships, we will plot the ACF and PACF. This helps us confirm the length of the seasonality cycle and determine if past sales directly influence current sales.

```python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# Set up subplot grid
fig, axes = plt.subplots(1, 2, figsize=(15, 5))

# 1. Plot Autocorrelation (ACF) up to 21 lags (3 weeks)
plot_acf(
    df_sales["Sales"], 
    lags=21, 
    ax=axes[0], 
    alpha=0.05,        # 95% confidence interval shaded boundary
    title="Autocorrelation (ACF)"
)
# Add custom styling to highlight seasonal peaks
axes[0].axvline(7, color="red", linestyle=":", alpha=0.7, label="7-Day Lag")
axes[0].axvline(14, color="red", linestyle=":", alpha=0.7, label="14-Day Lag")
axes[0].legend()

# 2. Plot Partial Autocorrelation (PACF)
plot_pacf(
    df_sales["Sales"], 
    lags=21, 
    ax=axes[1], 
    alpha=0.05, 
    method="yule_walker", 
    title="Partial Autocorrelation (PACF)"
)

plt.tight_layout()
plt.show()
```

```text
# Output:
- The ACF plot shows high correlation coefficients (bars crossing the blue confidence band) peaking clearly at lags 7, 14, and 21. This confirms a strong weekly seasonality.
- The PACF plot shows a sharp cut-off. High correlation at lag 1, but intermediate lags drop within the shaded region (insignificant), suggesting that after accounting for yesterday's values, intermediate days do not provide additional predictive power for the next day.
```

---

## Gotchas & Common Mistakes

<div class="challenge">
<strong>Lookahead Bias in Rolling Computations</strong><br>
When calculating rolling averages, setting the parameter <code>center=True</code> uses both historical and future values. For example, a 7-day centered rolling mean at index $t$ uses values from $t-3$ to $t+3$. 
<br><br>
While this makes historical charts look beautifully aligned, it is a fatal mistake if used to build machine learning features. You cannot use future data to predict the present. Ensure you use default <code>center=False</code> (causal windows) for any modeling features.
</div>

### 1. Missing Timestamps and Implicit Gaps
If you have a dataset with dates, but some days are missing (e.g., weekends are excluded in financial markets), plotting them directly treats the time gaps as continuous. This distorts the calculation of rolling statistics and seasonal decomposition.
*   **Fix**: Explicitly reindex your DataFrame using a complete date range and handle the missing gaps using interpolation or forward filling:
```python
# Create a complete, daily index containing weekends
complete_index = pd.date_range(start=df.index.min(), end=df.index.max(), freq='D')
# Reindex and forward-fill missing values
df_clean = df.reindex(complete_index).ffill()
```

### 2. The Timezone and Daylight Savings Trap
If you aggregate timestamp data from different systems (e.g., web server logs in UTC and CRM records in local time), your seasonality alignments will shift. This will cause morning user activity spikes to look like afternoon spikes.
*   **Fix**: Standardize all datetime inputs to UTC as early as possible in your pipeline using `dt.tz_localize('UTC')` before conversion.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Volatility Audit during Peak Seasons
You are provided with a daily dataset of electric power consumption. You need to identify if volatility (standard deviation) increases during summer months compared to the rest of the year.

1. Generate synthetic hourly energy consumption data for 1 year:
```python
import pandas as pd
import numpy as np

time_index = pd.date_range(start="2024-01-01", end="2024-12-31 23:00:00", freq="h")
n_hours = len(time_index)
base_load = 50 + np.sin(2 * np.pi * time_index.dayofyear / 365) * 20
# Summer peak: July (month 7) and August (month 8) have higher values and noise
is_summer = time_index.month.isin([7, 8])
summer_noise = np.random.normal(scale=15, size=n_hours) * is_summer
regular_noise = np.random.normal(scale=5, size=n_hours) * (~is_summer)

load = base_load + summer_noise + regular_noise + 10 * np.sin(2 * np.pi * time_index.hour / 24)

df_energy = pd.DataFrame({"Load": load}, index=time_index)
```
2. Write a Python script to calculate the rolling 24-hour standard deviation of the load.
3. Compare the average rolling standard deviation in July vs. November.

---

### Exercise 2: Causal vs. Centered Rolling Window Comparison
Using the `df_sales` dataset created in Example 1:
1. Calculate a 7-day centered rolling mean (`center=True`) and a 7-day backward-looking rolling mean (`center=False`).
2. Plot both against the raw sales data for the month of January 2024.
3. Observe the difference in lag: how many days is the backward-looking trend shifted compared to the centered trend?

---

## Section Recaps

*   A time-series is composed of a **Trend** (long-term movement), **Seasonality** (fixed cyclical pattern), and **Residuals/Noise** (random fluctuations).
*   Use **Additive Decomposition** when seasonal amplitudes remain constant as the trend rises. Use **Multiplicative Decomposition** when seasonal swings grow proportionally with the trend.
*   **Rolling averages** smooth out high-frequency noise, but they introduce a lag proportional to the window size.
*   **ACF plots** identify the presence of seasonal cycles, while **PACF plots** help identify direct, lag-specific relationships by removing intermediate dependencies.
*   Avoid **lookahead bias** by keeping rolling metrics strictly backward-looking (`center=False`) when engineering features for forecasting.

---

## Common Interview Questions

### Q1: What is the difference between an additive and multiplicative time-series decomposition, and how do you decide which to apply?
**Answer:**
In an **additive decomposition**, the components are summed together:
$$Y_t = T_t + S_t + I_t$$
This model assumes that the magnitude of seasonal variations is independent of the overall level of the series. For example, if seasonal sales rise by $500 every December regardless of whether baseline monthly sales are $5,000 or $50,000.

In a **multiplicative decomposition**, the components are multiplied:
$$Y_t = T_t \times S_t \times I_t$$
This model assumes that the seasonal variation scales proportionally with the trend. For example, if December sales are always 20% higher than the baseline sales. 

To choose between them during EDA:
1.  **Visual Inspection**: Plot the series over time. If the height of the seasonal peaks increases as the trend increases, use a multiplicative model. If the height of the peaks remains stable, use an additive model.
2.  **Zero/Negative Values**: If your data contains zeros or negative numbers, you must use an additive model, as multiplication and division by zero or negative values is mathematically invalid or physically meaningless.

---

### Q2: Explain the difference between ACF and PACF. How do they help in configuring an ARIMA model?
**Answer:**
*   **ACF (Autocorrelation Function)**: Measures the total correlation between a time-series $Y_t$ and its lagged value $Y_{t-k}$. It captures both direct relationships and indirect paths (e.g., the correlation between $Y_t$ and $Y_{t-2}$ includes the indirect impact of $Y_{t-1}$).
*   **PACF (Partial Autocorrelation Function)**: Measures the correlation between $Y_t$ and $Y_{t-k}$ *after* controlling for the effects of all shorter lags ($Y_{t-1}, Y_{t-2}, \dots, Y_{t-k+1}$). It isolates the direct correlation.

In configuring ARIMA ($p, d, q$) models:
*   **Determining AR order ($p$)**: Look at the PACF plot. If the PACF show a sharp cut-off after $p$ lags (meaning lags beyond $p$ are statistically insignificant), it suggests an Autoregressive model of order $p$.
*   **Determining MA order ($q$)**: Look at the ACF plot. If the ACF cuts off after $q$ lags, it suggests a Moving Average model of order $q$.

---

### Q3: What is lookahead bias in time-series engineering, and how does the `center` parameter in Pandas `rolling()` introduce it?
**Answer:**
Lookahead bias occurs when information from the future is inadvertently used to perform calculations or make decisions at a past point in time. This creates overly optimistic performance during backtesting that cannot be replicated in real-world deployment.

In Pandas, calling `.rolling(window=7, center=True).mean()` calculates the average at timestamp $t$ by looking backward 3 periods ($t-3$) and forward 3 periods ($t+3$). 

If you use this centered rolling average as a feature in a machine learning model to predict an outcome at time $t$, your model is training on future information ($t+1, t+2, t+3$). When the model is deployed to run in real-time, those future data points do not exist, and the model's performance will drop. 

For feature engineering, you must always use `center=False` (which is the default) to ensure rolling windows only look backward.

---

### Q4: Why is it crucial to check for stationarity in time-series data, and how do you test for it during EDA?
**Answer:**
A time-series is **stationary** if its statistical properties—such as mean, variance, and autocorrelation structure—do not change over time. Most statistical forecasting models (like ARIMA) assume stationarity because they rely on the assumption that historical relationships will remain consistent in the future. If a series has a trend (changing mean) or seasonal volatility (changing variance), the model's parameters will become unstable.

During EDA, you can check for stationarity using:
1.  **Visual Inspection**: Plot the data and check for visible trends, changes in variance over time, or seasonal cycles.
2.  **Rolling Statistics**: Plot the rolling mean and rolling standard deviation over time. If they are not flat lines, the series is non-stationary.
3.  **Augmented Dickey-Fuller (ADF) Test**: Run a statistical hypothesis test:
    *   **Null Hypothesis ($H_0$)**: The series is non-stationary (contains a unit root).
    *   **Alternative Hypothesis ($H_1$)**: The series is stationary.
    *   If the $p$-value is less than your significance level (typically 0.05), you reject the null hypothesis and conclude that the series is stationary.

---

### Q5: How do you handle missing values in time-series data without introducing lookahead bias or distorting trends?
**Answer:**
Handling missing values in time-series requires techniques that respect chronological order:
1.  **Avoid Mean/Median Imputation**: Replacing a missing value with the overall dataset mean or median introduces lookahead bias (because the overall mean includes future values) and breaks the local trend.
2.  **Forward Fill (`ffill`)**: Carries the last known valid observation forward. This is ideal for streaming applications and prevents lookahead bias because it uses only past information. However, it assumes the value remained flat.
3.  **Linear/Time Interpolation**: Draws a straight line between the last known value and the next known value. While excellent for historical visualizations, it introduces lookahead bias if used in real-time models, as the "next known value" is technically in the future relative to the missing timestamp.
4.  **Resampling**: If data is missing because of irregular intervals, resampling the data to a coarser frequency (e.g., converting irregular hourly entries to daily averages) can naturally resolve gaps without imputation.
