---
title: "Working with Dates & Times"
description: "Parse, format, and calculate with dates — critical for time-series analysis, reporting periods, and data pipelines."
category: "python"
order: 14
phase: 1
tags: ["python", "datetime", "time-series", "dates"]
publishedDate: 2025-01-29
prevSlug: "oop-basics"
nextSlug: "regex-patterns"
seoTitle: "Python DateTime Tutorial for Analytics | Datalogify"
seoDescription: "Master Python datetime — parse dates, calculate differences, handle timezones, and work with time-series data."
---

## Why This Matters

Sales by month, user signups by week, revenue trends by quarter — almost every analytics task involves dates. Mess up a timezone or date format and your numbers are wrong. This lesson makes sure that doesn't happen.

## Creating Dates and Times

```python
from datetime import date, time, datetime

# Date only
today = date.today()
print(f"Today: {today}")

# Specific date
launch_date = date(2025, 3, 15)
print(f"Launch: {launch_date}")

# Date and time
now = datetime.now()
print(f"Now: {now}")

# Specific datetime
meeting = datetime(2025, 1, 29, 14, 30, 0)
print(f"Meeting: {meeting}")

# Access individual components
print(f"Year: {now.year}, Month: {now.month}, Day: {now.day}")
print(f"Hour: {now.hour}, Minute: {now.minute}")
print(f"Day of week: {now.strftime('%A')}")
```

```text
Today: 2025-01-29
Launch: 2025-03-15
Now: 2025-01-29 14:30:45.123456
Meeting: 2025-01-29 14:30:00
Year: 2025, Month: 1, Day: 29
Hour: 14, Minute: 30
Day of week: Wednesday
```

## Formatting Dates — strftime

`strftime` = "string format time". Converts datetime objects to strings.

```python
from datetime import datetime

now = datetime(2025, 1, 29, 14, 30, 0)

# Common formats
print(now.strftime("%Y-%m-%d"))           # ISO format
print(now.strftime("%m/%d/%Y"))           # US format
print(now.strftime("%d-%b-%Y"))           # Day-Month-Year
print(now.strftime("%B %d, %Y"))          # Full month name
print(now.strftime("%Y-%m-%d %H:%M:%S"))  # With time
print(now.strftime("%I:%M %p"))           # 12-hour time
print(now.strftime("%A, %B %d"))          # Day name + month

# For filenames and logs
print(now.strftime("report_%Y%m%d.csv"))
print(now.strftime("backup_%Y%m%d_%H%M.sql"))
```

```text
2025-01-29
01/29/2025
29-Jan-2025
January 29, 2025
2025-01-29 14:30:00
02:30 PM
Wednesday, January 29
report_20250129.csv
backup_20250129_1430.sql
```

### Quick Reference

```text
%Y → 2025    (4-digit year)
%m → 01      (zero-padded month)
%d → 29      (zero-padded day)
%H → 14      (24-hour)
%I → 02      (12-hour)
%M → 30      (minute)
%S → 00      (second)
%p → PM      (AM/PM)
%A → Wednesday  (full day name)
%a → Wed        (short day name)
%B → January    (full month name)
%b → Jan        (short month name)
```

## Parsing Dates — strptime

`strptime` = "string parse time". Converts strings to datetime objects.

```python
from datetime import datetime

# Parse various date formats from CSVs and APIs
date1 = datetime.strptime("2025-01-29", "%Y-%m-%d")
date2 = datetime.strptime("01/29/2025", "%m/%d/%Y")
date3 = datetime.strptime("29-Jan-2025", "%d-%b-%Y")
date4 = datetime.strptime("January 29, 2025 2:30 PM", "%B %d, %Y %I:%M %p")

print(f"Parsed 1: {date1}")
print(f"Parsed 2: {date2}")
print(f"Parsed 3: {date3}")
print(f"Parsed 4: {date4}")

# Real scenario: parsing dates from messy CSV data
raw_dates = ["2025-01-15", "2025-02-20", "2025-03-10"]
parsed = [datetime.strptime(d, "%Y-%m-%d") for d in raw_dates]
months = [d.strftime("%B") for d in parsed]
print(f"Months: {months}")
```

```text
Parsed 1: 2025-01-29 00:00:00
Parsed 2: 2025-01-29 00:00:00
Parsed 3: 2025-01-29 00:00:00
Parsed 4: 2025-01-29 14:30:00
Months: ['January', 'February', 'March']
```

<div class="interview-tip">

**Interview Insight:** The difference between `strftime` and `strptime` trips people up. Memory trick: strftime = "**f**ormat" (object → string), strptime = "**p**arse" (string → object). You'll use `strptime` constantly when loading CSV dates and API timestamps.

</div>

## timedelta — Date Arithmetic

```python
from datetime import datetime, timedelta

today = datetime(2025, 1, 29)

# Add/subtract days
tomorrow = today + timedelta(days=1)
last_week = today - timedelta(weeks=1)
print(f"Tomorrow: {tomorrow.date()}")
print(f"Last week: {last_week.date()}")

# Business scenarios
invoice_date = datetime(2025, 1, 15)
due_date = invoice_date + timedelta(days=30)
print(f"Invoice: {invoice_date.date()} → Due: {due_date.date()}")

# Difference between dates
start = datetime(2025, 1, 1)
end = datetime(2025, 3, 31)
duration = end - start
print(f"Q1 duration: {duration.days} days")

# Hours and minutes
shift_start = datetime(2025, 1, 29, 9, 0)
shift_end = datetime(2025, 1, 29, 17, 30)
worked = shift_end - shift_start
hours = worked.total_seconds() / 3600
print(f"Hours worked: {hours}")
```

```text
Tomorrow: 2025-01-30
Last week: 2025-01-22
Invoice: 2025-01-15 → Due: 2025-02-14
Q1 duration: 89 days
Hours worked: 8.5
```

## Real Analytics: Date Ranges and Periods

```python
from datetime import datetime, timedelta

# Generate a date range (like Pandas date_range)
def date_range(start, end):
    current = start
    dates = []
    while current <= end:
        dates.append(current)
        current += timedelta(days=1)
    return dates

start = datetime(2025, 1, 1)
end = datetime(2025, 1, 7)
week = date_range(start, end)
print("First week of 2025:")
for d in week:
    print(f"  {d.strftime('%a %b %d')}")
```

```text
First week of 2025:
  Wed Jan 01
  Thu Jan 02
  Fri Jan 03
  Sat Jan 04
  Sun Jan 05
  Mon Jan 06
  Tue Jan 07
```

### Grouping Sales by Month

```python
from datetime import datetime
from collections import defaultdict

sales = [
    ("2025-01-05", 12000), ("2025-01-18", 15000), ("2025-01-22", 9000),
    ("2025-02-03", 18000), ("2025-02-14", 11000),
    ("2025-03-01", 22000), ("2025-03-15", 14000), ("2025-03-28", 19000),
]

monthly = defaultdict(int)
for date_str, amount in sales:
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    month_key = dt.strftime("%Y-%m")
    monthly[month_key] += amount

print("Monthly Revenue:")
for month, total in sorted(monthly.items()):
    print(f"  {month}: ${total:,}")

# Calculate month-over-month growth
months = sorted(monthly.keys())
for i in range(1, len(months)):
    prev = monthly[months[i-1]]
    curr = monthly[months[i]]
    growth = (curr - prev) / prev * 100
    print(f"  {months[i-1]} → {months[i]}: {growth:+.1f}%")
```

```text
Monthly Revenue:
  2025-01: $36,000
  2025-02: $29,000
  2025-03: $55,000

  2025-01 → 2025-02: -19.4%
  2025-02 → 2025-03: +89.7%
```

## Fiscal Quarters

```python
from datetime import datetime

def get_fiscal_quarter(dt, fiscal_start_month=1):
    """Get fiscal quarter. Default: calendar year (Jan start).
    For Apr fiscal year (like many companies): fiscal_start_month=4
    """
    adjusted_month = (dt.month - fiscal_start_month) % 12
    quarter = adjusted_month // 3 + 1
    fiscal_year = dt.year if dt.month >= fiscal_start_month else dt.year - 1
    return f"FY{fiscal_year} Q{quarter}"

# Calendar year quarters
dates = [
    datetime(2025, 1, 15), datetime(2025, 4, 20),
    datetime(2025, 7, 10), datetime(2025, 10, 5),
]
print("Calendar year quarters:")
for d in dates:
    print(f"  {d.strftime('%b %d')} → {get_fiscal_quarter(d)}")

# April fiscal year (common in finance)
print("\nApril fiscal year quarters:")
for d in dates:
    print(f"  {d.strftime('%b %d')} → {get_fiscal_quarter(d, fiscal_start_month=4)}")
```

```text
Calendar year quarters:
  Jan 15 → FY2025 Q1
  Apr 20 → FY2025 Q2
  Jul 10 → FY2025 Q3
  Oct 05 → FY2025 Q4

April fiscal year quarters:
  Jan 15 → FY2024 Q4
  Apr 20 → FY2025 Q1
  Jul 10 → FY2025 Q2
  Oct 05 → FY2025 Q3
```

## Timezone Handling

```python
from datetime import datetime, timezone, timedelta

# UTC timestamp — always use this for storage
utc_now = datetime.now(timezone.utc)
print(f"UTC: {utc_now.strftime('%Y-%m-%d %H:%M %Z')}")

# Create timezone-aware datetimes manually
est = timezone(timedelta(hours=-5))
pst = timezone(timedelta(hours=-8))
ist = timezone(timedelta(hours=5, minutes=30))

meeting_utc = datetime(2025, 1, 29, 18, 0, tzinfo=timezone.utc)
meeting_est = meeting_utc.astimezone(est)
meeting_pst = meeting_utc.astimezone(pst)
meeting_ist = meeting_utc.astimezone(ist)

print(f"\nTeam meeting at {meeting_utc.strftime('%H:%M %Z')}:")
print(f"  New York:  {meeting_est.strftime('%I:%M %p')}")
print(f"  San Fran:  {meeting_pst.strftime('%I:%M %p')}")
print(f"  Mumbai:    {meeting_ist.strftime('%I:%M %p')}")
```

```text
UTC: 2025-01-29 14:30 UTC

Team meeting at 18:00 UTC:
  New York:  01:00 PM
  San Fran:  10:00 AM
  Mumbai:    11:30 PM
```

### Using zoneinfo (Python 3.9+)

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Named timezones — handles daylight saving automatically
utc = ZoneInfo("UTC")
eastern = ZoneInfo("America/New_York")
pacific = ZoneInfo("America/Los_Angeles")
london = ZoneInfo("Europe/London")

now_utc = datetime.now(utc)
print(f"UTC:      {now_utc.strftime('%Y-%m-%d %I:%M %p %Z')}")
print(f"New York: {now_utc.astimezone(eastern).strftime('%I:%M %p %Z')}")
print(f"LA:       {now_utc.astimezone(pacific).strftime('%I:%M %p %Z')}")
print(f"London:   {now_utc.astimezone(london).strftime('%I:%M %p %Z')}")
```

```text
UTC:      2025-01-29 02:30 PM UTC
New York: 09:30 AM EST
LA:       06:30 AM PST
London:   02:30 PM GMT
```

<div class="interview-tip">

**Interview Insight:** Always store datetimes in UTC. Convert to local time only for display. This prevents bugs when data comes from multiple timezones. In databases, use `TIMESTAMP WITH TIME ZONE`. In Python, always attach `tzinfo` to avoid "naive vs aware" comparison errors.

</div>

## Calendar Module

```python
import calendar

# Days in a month (useful for reporting periods)
days_feb = calendar.monthrange(2025, 2)  # (weekday of 1st, days in month)
print(f"Feb 2025: starts on {calendar.day_name[days_feb[0]]}, {days_feb[1]} days")

# Check leap year
print(f"2024 leap year: {calendar.isleap(2024)}")
print(f"2025 leap year: {calendar.isleap(2025)}")

# Get last day of each month (for end-of-month reporting)
for month in range(1, 13):
    _, last_day = calendar.monthrange(2025, month)
    print(f"  {calendar.month_abbr[month]} 2025: {last_day} days", end="")
    print()
```

```text
Feb 2025: starts on Saturday, 28 days
2024 leap year: True
2025 leap year: False
  Jan 2025: 31 days
  Feb 2025: 28 days
  Mar 2025: 31 days
  Apr 2025: 30 days
  May 2025: 31 days
  Jun 2025: 30 days
  Jul 2025: 31 days
  Aug 2025: 31 days
  Sep 2025: 30 days
  Oct 2025: 31 days
  Nov 2025: 30 days
  Dec 2025: 31 days
```

## Real-World: Reporting Period Calculator

```python
from datetime import datetime, timedelta
import calendar

def get_reporting_period(dt):
    """Get the full reporting period info for a given date."""
    _, last_day = calendar.monthrange(dt.year, dt.month)

    period_start = dt.replace(day=1)
    period_end = dt.replace(day=last_day)
    days_elapsed = (dt - period_start).days + 1
    days_remaining = (period_end - dt).days
    pct_complete = (days_elapsed / last_day) * 100

    return {
        "current_date": dt.strftime("%Y-%m-%d"),
        "period": dt.strftime("%B %Y"),
        "start": period_start.strftime("%Y-%m-%d"),
        "end": period_end.strftime("%Y-%m-%d"),
        "days_elapsed": days_elapsed,
        "days_remaining": days_remaining,
        "pct_complete": round(pct_complete, 1),
    }

report = get_reporting_period(datetime(2025, 1, 20))
print("Current Reporting Period:")
for key, val in report.items():
    print(f"  {key}: {val}")

# Forecast based on pace
actual_revenue = 450000
projected = actual_revenue / (report["pct_complete"] / 100)
print(f"\nRevenue pace: ${actual_revenue:,} actual")
print(f"Month-end projection: ${projected:,.0f}")
```

```text
Current Reporting Period:
  current_date: 2025-01-20
  period: January 2025
  start: 2025-01-01
  end: 2025-01-31
  days_elapsed: 20
  days_remaining: 11
  pct_complete: 64.5

Revenue pace: $450,000 actual
Month-end projection: $697,674
```

## Comparing Dates and Sorting

```python
from datetime import datetime

# Employee hire dates
employees = [
    {"name": "Alice", "hired": "2019-03-15", "salary": 95000},
    {"name": "Bob", "hired": "2022-07-01", "salary": 72000},
    {"name": "Carol", "hired": "2018-11-20", "salary": 98000},
    {"name": "Dave", "hired": "2023-01-10", "salary": 65000},
]

today = datetime(2025, 1, 29)

for emp in employees:
    hire_date = datetime.strptime(emp["hired"], "%Y-%m-%d")
    tenure = (today - hire_date).days / 365.25
    emp["tenure_years"] = round(tenure, 1)
    emp["hire_dt"] = hire_date

# Sort by tenure (longest first)
by_tenure = sorted(employees, key=lambda e: e["tenure_years"], reverse=True)

print("Employees by tenure:")
for emp in by_tenure:
    print(f"  {emp['name']}: {emp['tenure_years']} years (since {emp['hired']})")

# Who's been here 5+ years?
senior = [e for e in employees if e["tenure_years"] >= 5]
print(f"\n5+ years tenure: {[e['name'] for e in senior]}")
```

```text
Employees by tenure:
  Carol: 6.2 years (since 2018-11-20)
  Alice: 5.9 years (since 2019-03-15)
  Bob: 2.6 years (since 2022-07-01)
  Dave: 2.1 years (since 2023-01-10)

5+ years tenure: ['Alice', 'Carol']
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Calculating reporting periods (MTD, QTD, YTD) for dashboards
- Parsing mixed date formats from CSV exports and API responses
- Building time-series aggregations (daily → weekly → monthly)
- Handling timezone conversions for global analytics
- Computing SLA windows, invoice due dates, and retention periods

</div>

<div class="challenge">

**Mini-Challenge:** Write a function `business_days_between(start, end)` that:
1. Accepts two date strings in "YYYY-MM-DD" format
2. Counts only weekdays (Monday–Friday) between them
3. Returns the count

Test it: how many business days between "2025-01-01" and "2025-01-31"? (Answer: 23)

Bonus: Add a `holidays` parameter that accepts a list of date strings to exclude.

</div>

## Common Interview Questions

### Q1: What's the difference between `strftime` and `strptime`?

**Answer:** `strftime` formats a datetime object into a string — "f" for format. `strptime` parses a string into a datetime object — "p" for parse. Example: `datetime.now().strftime("%Y-%m-%d")` gives you `"2025-01-29"`. `datetime.strptime("2025-01-29", "%Y-%m-%d")` gives you a datetime object. You'll use `strptime` when loading data from CSVs and APIs, and `strftime` when generating reports and filenames.

### Q2: How do you handle timezone-aware vs naive datetimes?

**Answer:** A "naive" datetime has no timezone info (`datetime.now()`). An "aware" datetime includes timezone (`datetime.now(timezone.utc)`). You can't compare naive and aware datetimes — Python raises a `TypeError`. Best practice: always work in UTC internally, convert to local time only for display. Use `zoneinfo.ZoneInfo` (Python 3.9+) for named timezones with automatic DST handling.

### Q3: How do you calculate the difference between two dates?

**Answer:** Subtract them: `delta = date2 - date1` returns a `timedelta` object. Access the difference with `delta.days` for total days, or `delta.total_seconds()` for total seconds. For months and years, there's no built-in — you calculate manually or use `dateutil.relativedelta`. Note that `timedelta` only stores days and seconds internally, not months or years.

### Q4: How would you get the first and last day of a month?

**Answer:** First day: `date.replace(day=1)`. Last day: use `calendar.monthrange(year, month)` which returns a tuple of (weekday of first day, number of days in month). Then `date.replace(day=last_day)`. This correctly handles February, leap years, and all month lengths without hardcoding.

### Q5: What's the best way to parse dates from messy data that has mixed formats?

**Answer:** Use `dateutil.parser.parse()` which auto-detects most formats: `"Jan 5, 2025"`, `"2025-01-05"`, `"05/01/2025"`. For performance-critical code, try known formats in order with `strptime` wrapped in try/except. In Pandas, `pd.to_datetime()` handles mixed formats with `format='mixed'`. Always validate parsed results — `"01/02/2025"` could be Jan 2 or Feb 1 depending on locale.
