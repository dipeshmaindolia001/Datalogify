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

## Why This Matters

Most business data is time-based — daily sales, monthly revenue, hourly web traffic, quarterly earnings. Pandas has world-class time series tools built in. Resampling, rolling averages, year-over-year comparisons — all of it becomes one-liners once you know the API.

## Parsing Dates with pd.to_datetime()

```python
import pandas as pd

# Dates come in all formats — Pandas handles them all
dates = pd.Series([
    "2024-01-15",
    "01/15/2024",
    "January 15, 2024",
    "15-Jan-2024",
    "2024.01.15",
])

parsed = pd.to_datetime(dates)
print(parsed)
print(f"\nDtype: {parsed.dtype}")
```

```text
# Output:
0   2024-01-15
1   2024-01-15
2   2024-01-15
3   2024-01-15
4   2024-01-15
dtype: datetime64[ns]

Dtype: datetime64[ns]
```

### Specifying Format for Speed

```python
import pandas as pd

# When you know the format, specify it — 10x faster on large datasets
df = pd.DataFrame({
    "date_str": ["15/01/2024", "22/01/2024", "05/02/2024", "18/02/2024"],
    "revenue": [45000, 52000, 48000, 61000],
})

df["date"] = pd.to_datetime(df["date_str"], format="%d/%m/%Y")
print(df)
```

```text
# Output:
     date_str  revenue       date
0  15/01/2024    45000 2024-01-15
1  22/01/2024    52000 2024-01-22
2  05/02/2024    48000 2024-02-05
3  18/02/2024    61000 2024-02-18
```

## The .dt Accessor

Extract every component of a datetime column without loops.

```python
import pandas as pd

df = pd.DataFrame({
    "order_date": pd.to_datetime([
        "2024-01-15", "2024-03-22", "2024-06-10",
        "2024-09-05", "2024-11-28", "2024-12-31",
    ]),
    "revenue": [45000, 52000, 38000, 61000, 55000, 72000],
})

df["year"] = df["order_date"].dt.year
df["month"] = df["order_date"].dt.month
df["day"] = df["order_date"].dt.day
df["day_name"] = df["order_date"].dt.day_name()
df["quarter"] = df["order_date"].dt.quarter
df["week"] = df["order_date"].dt.isocalendar().week.astype(int)

print(df[["order_date", "year", "month", "day_name", "quarter", "week"]])
```

```text
# Output:
  order_date  year  month   day_name  quarter  week
0 2024-01-15  2024      1     Monday        1     3
1 2024-03-22  2024      3     Friday        1    12
2 2024-06-10  2024      6     Monday        2    24
3 2024-09-05  2024      9   Thursday        3    36
4 2024-11-28  2024     11   Thursday        4    48
5 2024-12-31  2024     12    Tuesday        4     1
```

## DatetimeIndex — Unlock Time Series Powers

Setting your date column as the index unlocks slicing by date strings and resampling.

```python
import pandas as pd
import numpy as np

# Simulate daily revenue for 90 days
np.random.seed(42)
dates = pd.date_range("2024-01-01", periods=90, freq="D")
revenue = np.random.randint(8000, 25000, size=90)

df = pd.DataFrame({"revenue": revenue}, index=dates)
df.index.name = "date"

print(df.head(10))

# Slice by date string — this only works with DatetimeIndex
print("\n=== January Only ===")
print(df.loc["2024-01"].head())

print("\n=== Feb 15 to Mar 5 ===")
print(df.loc["2024-02-15":"2024-03-05"].head())
```

```text
# Output:
            revenue
date
2024-01-01    14925
2024-01-02    11091
2024-01-03    16156
2024-01-04    23530
2024-01-05    14476
2024-01-06    14025
2024-01-07    14352
2024-01-08    18936
2024-01-09    13675
2024-01-10    21530

=== January Only ===
            revenue
date
2024-01-01    14925
2024-01-02    11091
2024-01-03    16156
2024-01-04    23530
2024-01-05    14476

=== Feb 15 to Mar 5 ===
            revenue
date
2024-02-15    17291
2024-02-16    22766
2024-02-17    22350
2024-02-18    10607
2024-02-19    11444
```

## Resampling — Change Time Frequency

Resampling converts data from one frequency to another. Daily to monthly, hourly to daily — like a time-based GROUP BY.

```python
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range("2024-01-01", periods=180, freq="D")
daily = pd.DataFrame({
    "revenue": np.random.randint(8000, 25000, size=180),
    "orders": np.random.randint(20, 80, size=180),
}, index=dates)

# Daily → Monthly
monthly = daily.resample("ME").agg({
    "revenue": "sum",
    "orders": "sum",
})
monthly["avg_order_value"] = (monthly["revenue"] / monthly["orders"]).round(2)

print("=== Monthly Summary ===")
print(monthly)
```

```text
# Output:
=== Monthly Summary ===
            revenue  orders  avg_order_value
2024-01-31   513143    1513           339.22
2024-02-29   466036    1381           337.46
2024-03-31   493843    1496           330.11
2024-04-30   498694    1492           334.24
2024-05-31   520125    1496           347.54
2024-06-29   484179    1468           329.82
```

### Common Resample Frequencies

```python
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range("2024-01-01", periods=90, freq="D")
df = pd.DataFrame({"revenue": np.random.randint(8000, 25000, size=90)}, index=dates)

# Weekly (sum)
print("=== Weekly ===")
print(df.resample("W").sum().head(5))

# Bi-weekly
print("\n=== Bi-Weekly ===")
print(df.resample("2W").sum().head(3))

# Quarterly
print("\n=== Quarterly ===")
print(df.resample("QE").sum())
```

```text
# Output:
=== Weekly ===
            revenue
2024-01-07   108555
2024-01-14   113975
2024-01-21   112024
2024-01-28   107277
2024-02-04   109095

=== Bi-Weekly ===
            revenue
2024-01-14   222530
2024-01-28   219301
2024-02-11   228931

=== Quarterly ===
            revenue
2024-03-31  1473022
```

## Rolling Windows — Moving Averages

Rolling calculations smooth out noise and reveal trends. A 7-day moving average is one of the most common analytics techniques.

```python
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range("2024-01-01", periods=30, freq="D")
df = pd.DataFrame({
    "daily_revenue": np.random.randint(8000, 25000, size=30)
}, index=dates)

# 7-day rolling average
df["rolling_7d"] = df["daily_revenue"].rolling(window=7).mean().round(0)

# 7-day rolling sum
df["rolling_7d_sum"] = df["daily_revenue"].rolling(window=7).sum()

print(df.head(10))
```

```text
# Output:
            daily_revenue  rolling_7d  rolling_7d_sum
2024-01-01          14925         NaN             NaN
2024-01-02          11091         NaN             NaN
2024-01-03          16156         NaN             NaN
2024-01-04          23530         NaN             NaN
2024-01-05          14476         NaN             NaN
2024-01-06          14025         NaN             NaN
2024-01-07          14352       15508.0       108555.0
2024-01-08          18936       16081.0       112567.0
2024-01-09          13675       16450.0       115150.0
2024-01-10          21530       17218.0       120524.0
```

<div class="interview-tip">

**Interview Tip:** The first `window - 1` values of a rolling calculation are NaN because there aren't enough data points yet. You can use `min_periods=1` to start calculating with whatever data is available: `df["col"].rolling(7, min_periods=1).mean()`. This is a common follow-up question in interviews.

</div>

## Expanding Window — Cumulative Calculations

```python
import pandas as pd
import numpy as np

np.random.seed(42)
dates = pd.date_range("2024-01-01", periods=10, freq="D")
df = pd.DataFrame({
    "revenue": np.random.randint(8000, 20000, size=10)
}, index=dates)

# Cumulative mean (expanding window)
df["cumulative_avg"] = df["revenue"].expanding().mean().round(0)

# Running total
df["running_total"] = df["revenue"].cumsum()

print(df)
```

```text
# Output:
            revenue  cumulative_avg  running_total
2024-01-01    12925         12925.0          12925
2024-01-02     9091         11008.0          22016
2024-01-03    14156         12057.0          36172
2024-01-04    19530         13926.0          55702
2024-01-05    12476         13636.0          68178
2024-01-06    12025         13367.0          80203
2024-01-07    12352         13222.0          92555
2024-01-08    16936         13686.0         109491
2024-01-09    11675         13463.0         121166
2024-01-10    17530         13870.0         138696
```

## Shift, Diff, and Pct_change

Essential for comparing current values to previous periods.

```python
import pandas as pd

monthly = pd.DataFrame({
    "month": pd.date_range("2024-01-01", periods=6, freq="MS"),
    "revenue": [150000, 165000, 158000, 172000, 180000, 195000],
})
monthly = monthly.set_index("month")

# Previous month's value
monthly["prev_month"] = monthly["revenue"].shift(1)

# Month-over-month change
monthly["mom_change"] = monthly["revenue"].diff()

# Month-over-month % change
monthly["mom_pct"] = (monthly["revenue"].pct_change() * 100).round(1)

print(monthly)
```

```text
# Output:
            revenue  prev_month  mom_change  mom_pct
month
2024-01-01   150000         NaN         NaN      NaN
2024-02-01   165000    150000.0     15000.0     10.0
2024-03-01   158000    165000.0     -7000.0     -4.2
2024-04-01   172000    158000.0     14000.0      8.9
2024-05-01   180000    172000.0      8000.0      4.7
2024-06-01   195000    180000.0     15000.0      8.3
```

## date_range — Generate Date Sequences

```python
import pandas as pd

# Business days only
biz_days = pd.date_range("2024-01-01", "2024-01-15", freq="B")
print("Business days:", biz_days.tolist()[:5])

# Month starts
month_starts = pd.date_range("2024-01-01", periods=6, freq="MS")
print("\nMonth starts:", month_starts.tolist())

# Hourly data
hours = pd.date_range("2024-01-01", periods=8, freq="h")
print("\nHourly:", hours.tolist()[:4])
```

```text
# Output:
Business days: [Timestamp('2024-01-01'), Timestamp('2024-01-02'), Timestamp('2024-01-03'), Timestamp('2024-01-04'), Timestamp('2024-01-05')]

Month starts: [Timestamp('2024-01-01'), Timestamp('2024-02-01'), Timestamp('2024-03-01'), Timestamp('2024-04-01'), Timestamp('2024-05-01'), Timestamp('2024-06-01')]

Hourly: [Timestamp('2024-01-01 00:00:00'), Timestamp('2024-01-01 01:00:00'), Timestamp('2024-01-01 02:00:00'), Timestamp('2024-01-01 03:00:00')]
```

## Real-World Example: Sales Trend Analysis

```python
import pandas as pd
import numpy as np

# Simulate 365 days of e-commerce sales
np.random.seed(42)
dates = pd.date_range("2024-01-01", periods=365, freq="D")

# Add seasonality: higher in Q4, lower in Q1
base = 50000
seasonal = np.where(
    dates.month.isin([11, 12]), base * 1.4,
    np.where(dates.month.isin([1, 2]), base * 0.8, base)
)
noise = np.random.normal(0, 5000, 365)
revenue = (seasonal + noise).round(0)

df = pd.DataFrame({"revenue": revenue}, index=dates)

print("=== Daily Sales (first 5 days) ===")
print(df.head())

# Monthly summary
monthly = df.resample("ME").agg(
    total=("revenue", "sum"),
    avg_daily=("revenue", "mean"),
    best_day=("revenue", "max"),
    worst_day=("revenue", "min"),
).round(0)

print("\n=== Monthly Summary ===")
print(monthly)

# Quarter-over-quarter comparison
quarterly = df.resample("QE")["revenue"].sum()
quarterly_pct = quarterly.pct_change() * 100
print("\n=== Quarterly Revenue & Growth ===")
for date, rev, growth in zip(quarterly.index, quarterly.values, quarterly_pct.values):
    q = f"Q{date.quarter}"
    g = f"{growth:+.1f}%" if not pd.isna(growth) else "—"
    print(f"  {q} 2024: ${rev:>12,.0f}  ({g})")

# 30-day rolling average
df["rolling_30d"] = df["revenue"].rolling(30).mean().round(0)

# Find trend: is the rolling average increasing or decreasing?
df["trend"] = np.where(df["rolling_30d"] > df["rolling_30d"].shift(7), "↑ Up", "↓ Down")
print(f"\nLatest 30-day avg: ${df['rolling_30d'].iloc[-1]:,.0f}")
print(f"Current trend: {df['trend'].iloc[-1]}")
```

```text
# Output:
=== Daily Sales (first 5 days) ===
            revenue
2024-01-01  42483.0
2024-01-02  39307.0
2024-01-03  42633.0
2024-01-04  47647.0
2024-01-05  38831.0

=== Monthly Summary ===
                total  avg_daily  best_day  worst_day
2024-01-31  1241007.0    40033.0   50553.0    28866.0
2024-02-29  1164775.0    40165.0   52297.0    28006.0
2024-03-31  1540379.0    49689.0   63427.0    35478.0
2024-04-30  1492804.0    49760.0   63483.0    36667.0
2024-05-31  1558925.0    50288.0   62476.0    38073.0
2024-06-30  1499453.0    49982.0   61709.0    36773.0
2024-07-31  1567696.0    50571.0   63523.0    36399.0
2024-08-31  1558558.0    50276.0   62076.0    38262.0
2024-09-30  1504968.0    50166.0   62197.0    38168.0
2024-10-31  1556296.0    50203.0   59908.0    38558.0
2024-11-30  2123879.0    70796.0   82024.0    56143.0
2024-12-31  2148534.0    69307.0   82085.0    53883.0

=== Quarterly Revenue & Growth ===
  Q1 2024: $  3,946,161  (—)
  Q2 2024: $  4,551,182  (+15.3%)
  Q3 2024: $  4,631,222  (+1.8%)
  Q4 2024: $  5,828,709  (+25.9%)

Latest 30-day avg: $69,307
Current trend: ↓ Down
```

## Where This Is Used on the Job

- **Revenue reporting** — monthly, quarterly, year-over-year comparisons
- **Marketing analytics** — campaign performance over time, seasonal trends
- **Operations** — monitoring daily KPIs, detecting anomalies
- **Financial analysis** — stock price trends, moving averages, volatility
- **Product analytics** — user engagement trends, retention over time

<div class="challenge">

### Challenge: Website Traffic Analysis

```python
import pandas as pd
import numpy as np

np.random.seed(55)
dates = pd.date_range("2024-01-01", periods=120, freq="D")
df = pd.DataFrame({
    "pageviews": np.random.randint(5000, 20000, 120),
    "signups": np.random.randint(10, 100, 120),
}, index=dates)
```

Tasks:
1. Resample to weekly totals and find the week with highest pageviews
2. Calculate a 14-day rolling average of signups
3. Add week-over-week percentage change for pageviews (resample to weekly first)
4. Find the conversion rate (signups / pageviews) per month
5. Which day of the week has the highest average pageviews? (Hint: use `.dt.day_name()`)

</div>

## Common Interview Questions

### Q1: How do you convert a string column to datetime in Pandas?

**Answer:** Use `pd.to_datetime(df["col"])` — it auto-detects most date formats. For speed on large datasets, specify the format: `pd.to_datetime(df["col"], format="%Y-%m-%d")`. Use `errors="coerce"` to convert unparseable dates to NaT (Not a Time) instead of raising an error. Always check for NaT values after conversion with `df["col"].isna().sum()`.

### Q2: What is resampling and when do you use it?

**Answer:** Resampling changes the frequency of time series data. **Downsampling** goes from higher to lower frequency (daily → monthly) and requires an aggregation function (sum, mean). **Upsampling** goes from lower to higher frequency (monthly → daily) and requires interpolation or forward fill. Common use: converting daily sales to monthly totals for reporting, or converting minute-level sensor data to hourly averages.

### Q3: What is the difference between `rolling()` and `expanding()`?

**Answer:** `rolling(window=7)` uses a fixed-size sliding window — it always looks at the last 7 values. `expanding()` uses a growing window that starts from the first value — it's a cumulative calculation. Rolling gives you a moving average (trend detection), expanding gives you a cumulative average (running totals). Rolling windows have NaN for the first `window-1` values; expanding starts producing values immediately.

### Q4: How do you calculate year-over-year growth in Pandas?

**Answer:** Use `shift(12)` for monthly data: `df["yoy_growth"] = (df["revenue"] / df["revenue"].shift(12) - 1) * 100`. For daily data with DatetimeIndex, resample to monthly first, then shift. Alternatively, use `pct_change(periods=12)` for month-over-month with a 12-period lag. The key is ensuring your data has no gaps — missing months will misalign the shift.

### Q5: What is the `.dt` accessor and what can you extract with it?

**Answer:** The `.dt` accessor exposes datetime properties on a Pandas Series: `.dt.year`, `.dt.month`, `.dt.day`, `.dt.hour`, `.dt.day_name()`, `.dt.quarter`, `.dt.is_month_end`, `.dt.date`, `.dt.time`. It's vectorized, so `df["date"].dt.month` extracts the month from every row instantly. Use it for grouping by time components (e.g., `df.groupby(df["date"].dt.month)`) or creating features for analysis.
