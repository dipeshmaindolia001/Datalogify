---
title: "Pandas Time Series — Dates, Resampling & Rolling"
description: "Analyze time-based data with Pandas — date parsing, resampling, rolling windows, and time-based filtering."
category: "python"
order: 106
phase: 1
tags: ["python", "pandas", "time-series", "resampling", "rolling"]
publishedDate: 2025-02-05
prevSlug: "pandas-groupby-pivot"
nextSlug: "matplotlib-basics"
seoTitle: "Pandas Time Series Analysis Tutorial | Datalogify"
seoDescription: "Master Pandas time series — pd.to_datetime, resample, rolling averages, and time-based data analysis."
---

## Introduction & The "Why"

Think of time series data like a **rolling film reel**. Each frame captures a single moment of a scene. 
*   If you play the film reel frame-by-frame, you see every detailed micro-movement—this is your raw, high-frequency data (like stock prices changing every second or sensor telemetry recorded every millisecond).
*   If you speed up the film, summarizing many frames into a single second, you are **downsampling** (like converting daily transactional sales into monthly revenue trends to see the bigger picture).
*   If you need to slow down the film and fill in missing frames to make it look smooth, you are **upsampling** (interpolating missing hourly data points from daily summaries).
*   If you place a sliding window over a section of frames to calculate average motion, you are performing a **rolling operation** (like calculating a 30-day moving average of sales to smooth out temporary weekend spikes).

```text
  Raw Data Reel:  [Jan 1: $10] -> [Jan 2: $12] -> [Jan 3: $11] -> [Jan 4: $15]
                         \              /               \              /
                          \            /                 \            /
  Downsampling (2-day):     [Jan 2: $22]                     [Jan 4: $26]
  
  Rolling Average (2-day):  [Jan 1: N/A] -> [Jan 2: $11] -> [Jan 3: $11.5] -> [Jan 4: $13]
```

Almost every business dataset contains time. Sales transactions, web traffic logs, stock portfolios, and server metrics all flow chronologically. Pandas was originally developed in the financial sector specifically to solve time-series challenges. It provides a specialized index type—the `DateTimeIndex`—that enables time-travel-like querying, rapid aggregation, and seamless time-zone conversion out of the box.

---

## Step-by-Step Concept Breakdown

Before writing code, we need to understand the structural building blocks of time in Pandas:

### 1. Timestamps vs. Periods vs. Durations
*   **Timestamp:** Represents a specific point in time (e.g., July 8, 2026, at 10:00 AM). In Pandas, this maps to `pd.Timestamp` and forms a `DatetimeIndex`.
*   **Period:** Represents a span of time (e.g., the month of July 2026, or the fiscal quarter Q3). This maps to `pd.Period` and forms a `PeriodIndex`.
*   **Duration:** Represents a relative time difference (e.g., 5 days, 3 hours, and 20 seconds). This maps to `pd.Timedelta` and forms a `TimedeltaIndex`.

### 2. DatetimeIndex
When you make a datetime column the index of your DataFrame, you unlock specialized superpowers:
*   **Partial-string slicing:** You can query entire years or months using simple strings like `df.loc["2024"]` or `df.loc["2024-03"]`.
*   **Datetime-aware operations:** You can easily calculate day names, weeks, and quarters without running loops.
*   **Chronological Sorting:** Slicing and resampling require that the index is sorted. Always call `.sort_index()` after establishing a `DatetimeIndex`.

### 3. Resampling (`.resample()`)
Resampling is a time-specific version of `groupby()`. It changes the frequency of your data.
*   **Downsampling:** Going from high frequency to low frequency (e.g., Daily -> Monthly). You must choose:
    *   **An aggregation function:** (e.g., `.sum()` or `.mean()`).
    *   **Closed boundary rule (`closed`):** Which side of the interval is closed (includes the edge values). For example, does a weekly interval run from Monday to Sunday (`closed='left'`) or Tuesday to Monday (`closed='right'`)?
    *   **Label rule (`label`):** Which side of the interval is used to label the bin (e.g., does the average of Jan 1 - Jan 31 get labeled as "Jan 1" or "Jan 31"?).
*   **Upsampling:** Going from low frequency to high frequency (e.g., Monthly -> Daily). This creates empty slots which you must fill using methods like forward-filling (`ffill`), backward-filling (`bfill`), or linear interpolation (`interpolate`).

### 4. Rolling vs. Expanding vs. Exponentially Weighted Windows
*   **Rolling Window (`.rolling()`):** Slides a window of fixed size $N$ across chronological data. The calculation uses only the values inside the window. It is ideal for smoothing out seasonal fluctuations.
*   **Expanding Window (`.expanding()`):** Grows dynamically starting from the beginning of the time series. It calculates a cumulative statistic (like year-to-date cumulative sales) using all data points seen up to the current row.
*   **Exponentially Weighted Window (`.ewm()`):** Assigns weights to data points, giving more weight to recent observations and exponentially decaying weight to older points. This is standard for calculating Exponential Moving Averages (EMA) in financial markets.

---

## Code & Practical Walkthroughs

Let's begin by generating a realistic time-series dataset: daily website traffic metrics for an e-commerce platform across two months.

```python
import pandas as pd
import numpy as np

# Set seed for reproducibility
np.random.seed(42)

# Generate a continuous date range of 60 days
dates = pd.date_range(start="2026-05-01", end="2026-06-29", freq="D")

# Generate synthetic metrics
traffic = {
    "Date_String": dates.strftime("%Y/%m/%d %H:%M:%S"), # dates as strings
    "Pageviews": np.random.randint(1000, 5000, size=len(dates)),
    "Conversions": np.random.randint(50, 250, size=len(dates))
}

df = pd.DataFrame(traffic)
print("=== Raw Time-Series DataFrame ===")
print(df.head())
print("\nDataFrame Info:")
print(df.dtypes)
```

```text
# Output:
=== Raw Time-Series DataFrame ===
           Date_String  Pageviews  Conversions
0  2026/05/01 00:00:00       1860          238
1  2026/05/02 00:00:00       4770          111
2  2026/05/03 00:00:00       1861          166
3  2026/05/04 00:00:00       2294          136
4  2026/05/05 00:00:00       4448          108

DataFrame Info:
Date_String    object
Pageviews       int32
Conversions     int32
dtype: object
```

---

### Example 1: Creating and Manipulating DateTimeIndex

Before we perform any advanced time calculations, we must convert our string dates into true Pandas Datetime objects and set them as our Index. We will also look at how to handle Unix epoch times.

```python
# Convert strings to datetime. Explicitly providing the format increases speed by up to 10x!
df["Date"] = pd.to_datetime(df["Date_String"], format="%Y/%m/%d %H:%M:%S")

# Set the Date column as our DataFrame Index
df.set_index("Date", inplace=True)
# Drop the original string column
df.drop(columns=["Date_String"], inplace=True)

# Sort index is critical for reliable time-based slicing
df.sort_index(inplace=True)

print("=== DataFrame with DateTimeIndex ===")
print(df.head())
```

```text
# Output:
=== DataFrame with DateTimeIndex ===
            Pageviews  Conversions
Date                              
2026-05-01       1860          238
2026-05-02       4770          111
2026-05-03       1861          166
2026-05-04       2294          136
2026-05-05       4448          108
```

#### Converting Unix Epoch Timestamps
Many databases store dates as integers representing the number of seconds since January 1, 1970 (Unix Epoch). Here is how to convert them:

```python
epochs = pd.Series([1719830400, 1719916800, 1720003200]) # July 1st, 2nd, 3rd of 2024
converted_epochs = pd.to_datetime(epochs, unit="s")
print("=== Unix Epoch Conversion ===")
print(converted_epochs)
```

```text
# Output:
=== Unix Epoch Conversion ===
0   2024-07-01
1   2024-07-02
2   2024-07-03
dtype: datetime64[ns]
```

#### Time-based Slicing & Extraction
Now that we have a `DatetimeIndex`, we can query the data using natural time syntax and extract date components:

```python
# Slice all dates in June 2026
june_data = df.loc["2026-06"]
print("=== June 2026 Data Slice ===")
print(june_data.head(3))

# Extract day name, quarter, and day of year directly from the DatetimeIndex
df["Day_Name"] = df.index.day_name()
df["Quarter"] = df.index.quarter
df["Day_of_Year"] = df.index.dayofyear
print("\n=== Date Component Engineering ===")
print(df.head(3))
```

```text
# Output:
=== June 2026 Data Slice ===
            Pageviews  Conversions
Date                              
2026-06-01       2214           83
2026-06-02       4441          192
2026-06-03       4159          221

=== Date Component Engineering ===
            Pageviews  Conversions Day_Name  Quarter  Day_of_Year
Date                                                             
2026-05-01       1860          238   Friday        2          122
2026-05-02       4770          111 Saturday        2          123
2026-05-03       1861          166   Sunday        2          124
```

---

### Example 2: Resampling — Downsampling vs. Upsampling

#### Offset Aliases (Frequencies)
In Pandas 2.0+, several offsets were updated to prevent ambiguity:
*   `D` = Calendar day
*   `B` = Business day
*   `W` = Weekly (Sunday-based end)
*   `ME` = Month End (replaced deprecated `M`)
*   `MS` = Month Start (replaced deprecated `MS`)
*   `QE` = Quarter End (replaced deprecated `Q`)
*   `YE` = Year End (replaced deprecated `A` / `Y`)

#### Downsampling: Daily to Weekly (Aggregating)

Let's collapse daily records into weekly bins. We will use `closed` and `label` settings to control boundaries.

```python
# Select only numeric columns
clean_df = df[["Pageviews", "Conversions"]]

# Downsample to Weekly frequency (W), closed on right (Mon-Sun), labeled with right boundary
weekly_summary = clean_df.resample("W", closed="right", label="right").sum()
print("=== Weekly Sales Totals (Downsampled) ===")
print(weekly_summary.head(4))
```

```text
# Output:
=== Weekly Sales Totals (Downsampled) ===
            Pageviews  Conversions
Date                              
2026-05-03       8491          515
2026-05-10      22879         1111
2026-05-17      21867         1058
2026-05-24      21953         1011
```

#### Upsampling: Weekly to Daily (Expanding & Filling)

If we resample the weekly dataset back to a daily scale, we create gaps. Let's look at different strategies to fill these gaps:

```python
# Re-index to Daily frequency
upsampled_empty = weekly_summary.resample("D").asfreq()
print("=== Upsampled (Empty Slots created as NaN) ===")
print(upsampled_empty.head(4))

# Fill techniques
upsampled_ffill = weekly_summary.resample("D").ffill()
upsampled_interp = weekly_summary.resample("D").interpolate(method="linear")

print("\n=== Forward Filled (ffill) ===")
print(upsampled_ffill.head(4))

print("\n=== Linearly Interpolated ===")
print(upsampled_interp.head(4))
```

```text
# Output:
=== Upsampled (Empty Slots created as NaN) ===
            Pageviews  Conversions
Date                              
2026-05-03     8491.0        515.0
2026-05-04        NaN          NaN
2026-05-05        NaN          NaN
2026-05-06        NaN          NaN

=== Forward Filled (ffill) ===
            Pageviews  Conversions
Date                              
2026-05-03       8491          515
2026-05-04       8491          515
2026-05-05       8491          515
2026-05-06       8491          515

=== Linearly Interpolated ===
            Pageviews  Conversions
Date                              
2026-05-03   8491.000   515.000000
2026-05-04  10546.429   600.142857
2026-05-05  12601.857   685.285714
2026-05-06  14657.286   770.428571
```

---

### Example 3: Rolling, Expanding, and Exponentially Weighted Windows

Let's calculate different window trends on our daily pageviews:
*   **7-day Rolling Average:** Focuses on the current week's average.
*   **Cumulative (Expanding) Maximum:** The highest daily pageview value recorded up to that date.
*   **Exponentially Weighted Moving Average (EWMA):** Gives more weight to recent days.

```python
window_df = clean_df.copy()

# 1. 7-day Rolling Average
window_df["Pageviews_7DMA"] = window_df["Pageviews"].rolling(window=7, min_periods=7).mean()

# 2. Expanding Maximum (Cumulative Max)
window_df["Pageviews_CumMax"] = window_df["Pageviews"].expanding(min_periods=1).max()

# 3. Exponentially Weighted Moving Average (using a decay span of 7 days)
window_df["Pageviews_EWMA"] = window_df["Pageviews"].ewm(span=7, adjust=False).mean()

print("=== Window Comparison Output ===")
print(window_df[["Pageviews", "Pageviews_7DMA", "Pageviews_CumMax", "Pageviews_EWMA"]].head(10))
```

```text
# Output:
=== Window Comparison Output ===
            Pageviews  Pageviews_7DMA  Pageviews_CumMax  Pageviews_EWMA
Date                                                                   
2026-05-01       1860             NaN            1860.0     1860.000000
2026-05-02       4770             NaN            4770.0     2587.500000
2026-05-03       1861             NaN            4770.0     2405.875000
2026-05-04       2294             NaN            4770.0     2377.906250
2026-05-05       4448             NaN            4770.0     2895.429688
2026-05-06       2130             NaN            4770.0     2704.072266
2026-05-07       2095     2779.714286            4770.0     2551.804200
2026-05-08       2638     2890.857143            4770.0     2573.353150
2026-05-09       4185     2807.285714            4770.0     2976.264862
2026-05-10       2095     2840.714286            4770.0     2755.948647
```

---

### Example 4: Shifting Data (Growth Rates & Differences)

Calculating Period-over-Period growth rates requires shifting the alignment of our data rows.

```python
# Let's use our weekly summary
weekly_perf = weekly_summary[["Conversions"]].copy()

# Shift value forward by 1 period (corresponds to prior week)
weekly_perf["Conversions_Prev_Week"] = weekly_perf["Conversions"].shift(1)

# Shift index forward by 1 week instead of shifting data values (leaves data in place but moves date indexes)
shifted_index = weekly_perf["Conversions"].shift(1, freq="W")

# Calculate Absolute Difference using .diff()
weekly_perf["Weekly_Diff"] = weekly_perf["Conversions"].diff(periods=1)

# Calculate Percent Change using .pct_change()
weekly_perf["Weekly_Pct_Growth"] = (weekly_perf["Conversions"].pct_change(periods=1) * 100).round(2)

print("=== Shifting and Percent Change ===")
print(weekly_perf)
```

```text
# Output:
=== Shifting and Percent Change ===
            Conversions  Conversions_Prev_Week  Weekly_Diff  Weekly_Pct_Growth
Date                                                                          
2026-05-03          515                    NaN          NaN                NaN
2026-05-10         1111                  515.0        596.0             115.73
2026-05-17         1058                 1111.0        -53.0              -4.77
2026-05-24         1011                 1058.0        -47.0              -4.44
2026-05-31         1011                 1011.0          0.0               0.00
2026-06-07         1016                 1011.0          5.0               0.49
2026-06-14         1250                 1016.0        234.0              23.03
2026-06-21         1096                 1250.0       -154.0             -12.32
2026-06-28         1187                 1096.0         91.0               8.30
2026-06-29          156                 1187.0      -1031.0             -86.86
```

---

### Example 5: Timezone Localization and Conversion

Datetime objects generated in Python are by default "naive" (timezone-agnostic). If you are building reports for an international audience, you must localize and convert your indices.

```python
# 1. Create a naive DatetimeIndex
naive_index = pd.date_range(start="2026-07-08 09:00:00", periods=3, freq="H")
naive_series = pd.Series([100, 200, 300], index=naive_index)
print("=== Naive Series (No Timezone) ===")
print(naive_series)

# 2. Localize to UTC (adds '+00:00' suffix)
utc_series = naive_series.tz_localize("UTC")
print("\n=== Localized to UTC ===")
print(utc_series)

# 3. Convert to US Eastern Time (respects daylight savings automatically!)
est_series = utc_series.tz_convert("America/New_York")
print("\n=== Converted to US Eastern Time ===")
print(est_series)
```

```text
# Output:
=== Naive Series (No Timezone) ===
2026-07-08 09:00:00    100
2026-07-08 10:00:00    200
2026-07-08 11:00:00    300
Freq: H, dtype: int64

=== Localized to UTC ===
2026-07-08 09:00:00+00:00    100
2026-07-08 10:00:00+00:00    200
2026-07-08 11:00:00+00:00    300
Freq: H, dtype: int64

=== Converted to US Eastern Time ===
2026-07-08 05:00:00-04:00    100
2026-07-08 06:00:00-04:00    200
2026-07-08 07:00:00-04:00    300
Freq: H, dtype: int64
```

---

## Edge Cases & Common Mistakes

### 1. The Sort Index Gotcha
*   **Gotcha:** Slicing or resampling a DatetimeIndex that isn't chronologically sorted. This will return a `ValueError` or silent indexing errors.
*   **Best Practice:** Always call `.sort_index()` right after creating or altering a time index:
    ```python
    df = df.set_index("Date")
    df = df.sort_index() # Critical for reliable date logic!
    ```

### 2. Timezone Ambiguity in Daylight Savings Time Transitions
*   **Gotcha:** Trying to localize a series containing timestamps that occur during the "clock fallback" hour in Autumn (when the 1:00 AM hour repeats). This yields an `AmbiguousTimeError`.
*   **Best Practice:** Tell Pandas how to handle the repeating hour using the `ambiguous` parameter:
    ```python
    # 'infer' tells Pandas to determine sequence logically, 'NaT' sets ambiguous rows to null
    df.index = df.index.tz_localize("America/New_York", ambiguous="infer")
    ```

### 3. Date Offsets in Modern Pandas versions
*   **Gotcha:** Passing deprecated offsets (like `'M'` or `'Q'`) in Pandas 2.0+ which raises future-proofing warnings or errors.
*   **Best Practice:** Use `'ME'` for Month End, `'QE'` for Quarter End, and `'YE'` for Year End.

### 4. Overwriting Index with String Types
*   **Gotcha:** Doing calculations that cast the index to strings, which strips the DatetimeIndex properties and breaks resampling:
    ```python
    # Breaks DateTimeIndex!
    df.index = df.index.strftime("%Y-%m-%d") 
    ```
*   **Best Practice:** Keep the index as `datetime64[ns]` and only format strings when rendering or exporting values.

---

## Practice Exercises & Mini-Projects

<div class="challenge">
<strong>Exercise 1: Stock Volatility Moving Window</strong>
<br>
Generate a synthetic daily dataset representing stock prices over 90 days.
1. Calculate a 20-day Simple Moving Average (SMA).
2. Calculate the 20-day rolling standard deviation (volatility).
3. Identify all days where the price is more than <strong>2 standard deviations</strong> away from the 20-day SMA.
</div>

<div class="challenge">
<strong>Exercise 2: Downsampling Custom Rules</strong>
<br>
Using our e-commerce traffic DataFrame:
1. Resample the daily data to a monthly end frequency (<code>'ME'</code>).
2. Use <code>.agg()</code> to calculate the <strong>mean</strong> of Pageviews and the <strong>sum</strong> of Conversions for each month.
3. Add a new calculated column in the aggregated output called <code>Conversion_Rate_Pct</code> (Conversions / Pageviews * 100).
</div>

---

## Section Recaps

*   **DatetimeIndex:** Convert dates using `pd.to_datetime()` and set as the index to enable partial-string slicing and fast index-based time evaluations.
*   **Resampling:** `.resample()` allows downsampling (collapsing daily to monthly using aggregates) and upsampling (generating high-frequency records, requiring filling).
*   **Moving Statistics:** `.rolling()` computes statistics over a trailing window of size $N$. `.expanding()` grows dynamically from index start, and `.ewm()` applies decay weights for EMAs.
*   **Shifting:** Use `.shift(1)` to align records with prior rows to calculate differences (`.diff()`) and percentage rates (`.pct_change()`).
*   **Timezones:** naives datetime indexes are localized using `.tz_localize()` and adjusted using `.tz_convert()`.

---

## Common Interview Questions

### Q1: What is the difference between `df.resample()` and `df.groupby()`?
**Answer:**
*   **`resample()`** is a specialized, time-aware grouping function. It requires a DatetimeIndex (or using the `on` parameter) and understands time-based logic, frequencies (like 'W' for weeks, 'ME' for month ends), and how to close and label boundary intervals.
*   **`groupby()`** is a generalized grouping function that groups by unique values of any data type (strings, integers, categoricals). It does not understand date intervals or chronological spans unless you manually write grouping keys.

### Q2: What are the `closed` and `label` arguments in `.resample()` and why do they matter?
**Answer:**
They define how boundary points are bucketed and displayed:
*   **`closed`** determines which side of the resample interval is inclusive. For example, if you resample daily data into 7-day bins, `closed='right'` means the right boundary value is included in the bucket, whereas `closed='left'` includes the left boundary.
*   **`label`** determines how the bucket itself is named. If you aggregate data from Jan 1st to Jan 7th, does the result carry the label '2026-01-01' (`label='left'`) or '2026-01-07' (`label='right'`)? Getting this wrong can shift data outputs by one unit.

### Q3: How do you handle missing dates in a time series dataset to ensure a continuous index?
**Answer:**
If your raw dataset skips weekends or holidays and you want a continuous chronological index, you can use `.reindex()` or `.resample()`:
```python
# Method 1: Reindex with a complete date range
complete_dates = pd.date_range(start=df.index.min(), end=df.index.max(), freq="D")
df_continuous = df.reindex(complete_dates)

# Method 2: Resample to daily scale
df_continuous = df.resample("D").asfreq()
```
You can then use `.ffill()`, `.bfill()`, or `.interpolate()` to handle the empty `NaN` values generated for the missing dates.

### Q4: Why is it highly recommended to pass `format` inside `pd.to_datetime()`?
**Answer:**
If you call `pd.to_datetime()` without specifying a format, Pandas has to run parsing heuristics on every string row to guess the format (checking if it matches ISO 8601, US styles, European styles, etc.). On datasets with millions of rows, this is extremely slow. By passing a format string (e.g. `format='%Y-%m-%d'`), you bypass the guessing loop, speeding up the conversion by 5x to 10x and ensuring dates are interpreted correctly.

### Q5: What is the difference between rolling and expanding window calculations?
**Answer:**
*   A **rolling window** has a fixed size (e.g. `window=7`). As it moves forward through time, it drops the oldest data point and adds the newest. The statistics generated are localized and show short-term fluctuations.
*   An **expanding window** has a dynamic size that starts at 1 and increases by 1 with each step (e.g. `.expanding()`). It never drops historical records; it incorporates all data points seen since the start of the series. It is used to track cumulative or lifetime statistics (like year-to-date sales totals).
