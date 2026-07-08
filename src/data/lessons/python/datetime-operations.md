---
title: "Working with Dates & Times"
description: "Parse, format, and calculate with dates — critical for time-series analysis, reporting periods, and data pipelines."
category: "python"
order: 13
phase: 1
tags: ["python", "datetime", "time-series", "dates", "timezone"]
publishedDate: 2025-01-29
prevSlug: "oop-basics"
nextSlug: "regex-patterns"
seoTitle: "Python DateTime Tutorial for Analytics | Datalogify"
seoDescription: "Master Python datetime — parse dates, calculate differences, handle timezones, and work with time-series data."
---

## Introduction & The "Why"

Almost every dataset you encounter in data analytics has a temporal dimension. User signup logs, hourly server metrics, monthly financial reports, transactional histories — all rely on dates and times. 

Despite its importance, datetime manipulation is notorious for causing head-scratching bugs. Timezones shift, daylight saving adjustments add or subtract hours, formats change across regions, and leap years introduce extra days. A small miscalculation in date logic can skew reporting metrics, lead to billing errors, or corrupt time-series analyses.

### The Time Ruler Analogy

Think of time in Python as a **ruler**, and the `datetime` module as your set of drafting tools:

```text
               [ Time-scale Ruler ]
  ├──────────────┼──────────────┼──────────────┼──────────────┤
  2026-01-01   2026-04-01     2026-07-01     2026-10-01     2027-01-01
  [ Date Point ]  <─────── Timedelta Interval ───────>  [ Date Point ]
```

* **The Ruler (Date Points):** A specific point on the ruler represents a distinct moment in history (e.g., `July 8, 2026, at 10:30 AM`). In Python, this is represented by `date` or `datetime` objects.
* **The Distance (Intervals):** If you measure the distance between two marks on the ruler, you get a duration (e.g., `90 days and 4 hours`). In Python, this duration is represented by a `timedelta` object.
* **The Perspective (Timezones):** Depending on where you stand, the mark on the ruler represents different local times (e.g., a meeting at 3:00 PM in London occurs at 10:00 AM in New York). Timezones act as a lens that shifts the window of observation without altering the physical point of time.

---

## Step-by-Step Concept Breakdown

To work with dates in Python, you must import the built-in `datetime` module. Let's break down its core elements.

### 1. The Core Objects
* `datetime.date`: Represents a day containing year, month, and day (e.g., `2026-07-08`).
* `datetime.time`: Represents a time of day independent of any date (e.g., `10:30:15`).
* `datetime.datetime`: Combines date and time (e.g., `2026-07-08 10:30:15`).
* `datetime.timedelta`: Represents the difference between two date or datetime points.

### 2. Strptime vs. Strftime (Parsing vs. Formatting)
These two methods are the most common source of confusion for beginners.
* **`strptime` (String Parse Time):** Used to convert a raw **string** (like `"08-07-2026"`) into a Python **datetime object**.
* **`strftime` (String Format Time):** Used to convert a Python **datetime object** into a customized, human-readable **string** (like `"Wednesday, July 8, 2026"`).

#### Memory Trigger:
* `strptime` = String **P**arse Time (String ➔ Object)
* `strftime` = String **F**ormat Time (Object ➔ String)

### 3. Naive vs. Aware Datetime
* **Naive Datetime:** A datetime object containing no timezone information. Python doesn't know if the time represents London, Tokyo, or New York. It is simple to compute but risky in global networks.
* **Aware Datetime:** A datetime object containing a reference to a timezone timezone database, making it globally unique and safe for conversions. Since Python 3.9, the standard library includes `zoneinfo` to manage timezones natively.

---

## Code Walkthroughs & Practical Examples

Let's look at how to perform these operations in Python.

### 1. Creating and Combining Date Objects

```python
import datetime

# Create a date object (Year, Month, Day)
my_date = datetime.date(2026, 7, 8)
print("Date Object:", my_date)

# Create a time object (Hour, Minute, Second, Microsecond)
my_time = datetime.time(14, 30, 45)
print("Time Object:", my_time)

# Combine them into a datetime object
combined = datetime.datetime.combine(my_date, my_time)
print("Combined Datetime:", combined)

# Get current system time (Naive)
now = datetime.datetime.now()
print("Current System Datetime:", now)
```

```text
# Output:
Date Object: 2026-07-08
Time Object: 14:30:45
Combined Datetime: 2026-07-08 14:30:45
Current System Datetime: 2026-07-08 10:55:38.123456
```

---

### 2. Parsing and Formatting (strptime & strftime)

To use these methods, we must pass formatting directives. Here are the most common tokens:

| Directive | Description | Example |
| :--- | :--- | :--- |
| `%Y` | Year (4-digit) | `2026` |
| `%y` | Year (2-digit) | `26` |
| `%m` | Month (2-digit) | `07` |
| `%B` | Month Name (Full) | `July` |
| `%b` | Month Name (Abbreviated) | `Jul` |
| `%d` | Day of the Month (2-digit) | `08` |
| `%H` | Hour (24-hour clock) | `14` |
| `%I` | Hour (12-hour clock) | `02` |
| `%M` | Minute (2-digit) | `30` |
| `%S` | Second (2-digit) | `45` |
| `%p` | AM or PM | `PM` |
| `%A` | Weekday Name (Full) | `Wednesday` |

#### Parsing Strings into Datetime Objects (`strptime`)
```python
# Raw dates in different formats
raw_date_1 = "2026-07-08 14:30:00"
raw_date_2 = "08/07/2026"
raw_date_3 = "Jul 8, 2026 2:30 PM"

# Parse them (Must match the exact structure of the string)
dt1 = datetime.datetime.strptime(raw_date_1, "%Y-%m-%d %H:%M:%S")
dt2 = datetime.datetime.strptime(raw_date_2, "%d/%m/%Y")
dt3 = datetime.datetime.strptime(raw_date_3, "%b %d, %Y %I:%M %p")

print("Parsed 1:", dt1)
print("Parsed 2 (Date only):", dt2.date())
print("Parsed 3:", dt3)
```

```text
# Output:
Parsed 1: 2026-07-08 14:30:00
Parsed 2 (Date only): 2026-07-08
Parsed 3: 2026-07-08 14:30:00
```

#### Formatting Datetime Objects to Custom Strings (`strftime`)
```python
# Starting datetime object
dt = datetime.datetime(2026, 7, 8, 14, 30, 0)

# Format to various styles
style_a = dt.strftime("%A, %B %d, %Y")
style_b = dt.strftime("%d-%m-%y")
style_c = dt.strftime("%I:%M %p (%H:%M)")

print("Style A:", style_a)
print("Style B:", style_b)
print("Style C:", style_c)
```

```text
# Output:
Style A: Wednesday, July 08, 2026
Style B: 08-07-26
Style C: 02:30 PM (14:30)
```

---

### 3. Date Math with `timedelta`

`timedelta` represents durations. You can add or subtract them from dates to calculate future/past dates or check intervals.

```python
from datetime import datetime, timedelta

start_date = datetime(2026, 7, 8, 10, 0, 0)

# Define offsets
offset_days = timedelta(days=30)
offset_hours = timedelta(hours=4, minutes=30)

# Calculate new datetimes
future_date = start_date + offset_days
exact_future_time = start_date + offset_hours

print("Start Date:", start_date)
print("30 Days Later:", future_date)
print("4h 30m Later:", exact_future_time)

# Calculate difference between two dates
delivery_date = datetime(2026, 7, 15, 18, 0, 0)
duration = delivery_date - start_date

print(f"Time to Delivery: {duration}")
print(f"Total Days: {duration.days}")
print(f"Total Seconds: {duration.total_seconds():,.0f}")
```

```text
# Output:
Start Date: 2026-07-08 10:00:00
30 Days Later: 2026-08-07 10:00:00
4h 30m Later: 2026-07-08 14:30:00
Time to Delivery: 7 days, 8:00:00
Total Days: 7
Total Seconds: 633,600
```

---

### 4. Working with Timezones (`zoneinfo`)

Since Python 3.9, the standard library includes `zoneinfo` to provide full support for the IANA Time Zone Database.

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Create a datetime localized to UTC
utc_time = datetime(2026, 7, 8, 12, 0, 0, tzinfo=ZoneInfo("UTC"))
print("UTC time:", utc_time)

# Convert to Eastern Time (New York)
ny_time = utc_time.astimezone(ZoneInfo("America/New_York"))
print("NY time:", ny_time)

# Convert to Tokyo Time (Tokyo)
tokyo_time = utc_time.astimezone(ZoneInfo("Asia/Tokyo"))
print("Tokyo time:", tokyo_time)

# Show offsets
print("New York Offset:", ny_time.utcoffset())
```

```text
# Output:
UTC time: 2026-07-08 12:00:00+00:00
NY time: 2026-07-08 08:00:00-04:00
Tokyo time: 2026-07-08 21:00:00+09:00
New York Offset: -1 day, 20:00:00
```

---

### 5. Real Business Metrics Calculations

Let's look at three real-world calculations analysts use daily.

#### A. Calculating User Age (Handling Leap Years)
To accurately calculate age, we compare the current year against the birth year, adjusting by -1 if the current date is calendar-wise before the birthday.

```python
def calculate_age(birth_date_str):
    birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
    today = datetime.today().date()
    
    # Calculate age base
    age = today.year - birth_date.year
    
    # Adjust down if birthday has not occurred yet this calendar year
    has_birthday_occurred = (today.month, today.day) >= (birth_date.month, birth_date.day)
    if not has_birthday_occurred:
        age -= 1
        
    return age


print("Age of User A (born 1995-02-15):", calculate_age("1995-02-15"))
print("Age of User B (born 2010-09-22):", calculate_age("2010-09-22"))
```

```text
# Output:
Age of User A (born 1995-02-15): 31
Age of User B (born 2010-09-22): 15
```

#### B. Subscription Durations & Expired Flags
A system flags subscriptions as expired if they exceed the duration limit.

```python
def get_subscription_status(signup_date_str, plan_days=30):
    signup_dt = datetime.strptime(signup_date_str, "%Y-%m-%d")
    today = datetime.now()
    
    expiration_date = signup_dt + timedelta(days=plan_days)
    days_remaining = (expiration_date - today).days
    
    status = "Active" if days_remaining > 0 else "Expired"
    return {
        "signup": signup_dt.strftime("%Y-%m-%d"),
        "expires": expiration_date.strftime("%Y-%m-%d"),
        "days_remaining": max(0, days_remaining),
        "status": status
    }


print(get_subscription_status("2026-07-01", plan_days=30))
print(get_subscription_status("2026-05-10", plan_days=30))
```

```text
# Output:
{'signup': '2026-07-01', 'expires': '2026-07-31', 'days_remaining': 22, 'status': 'Active'}
{'signup': '2026-05-10', 'expires': '2026-06-09', 'days_remaining': 0, 'status': 'Expired'}
```

#### C. Period Indicators (Financial Quarters)
Frequently, analysts need to assign quarters to transactions.

```python
def get_quarter(date_str):
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    # Determine quarter based on month
    quarter = (dt.month - 1) // 3 + 1
    return f"{dt.year}-Q{quarter}"


transactions = ["2026-01-15", "2026-05-22", "2026-08-11", "2026-12-30"]
quarter_mapping = {tx: get_quarter(tx) for tx in transactions}
print("Financial Quarters:", quarter_mapping)
```

```text
# Output:
Financial Quarters: {'2026-01-15': '2026-Q1', '2026-05-22': '2026-Q2', '2026-08-11': '2026-Q3', '2026-12-30': '2026-Q4'}
```

---

## Gotchas & Common Mistakes

### 1. Mixing Timezone-Naive and Timezone-Aware Datetimes
This is the most common datetime runtime error in Python. If you attempt to subtract a naive datetime from an aware datetime, Python will throw a `TypeError`.

#### ❌ The Mistake:
```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Naive datetime
start = datetime.now()

# Aware datetime
end = datetime.now(ZoneInfo("UTC"))

# Will crash: TypeError: can't subtract offset-naive and offset-aware datetimes
duration = end - start
```

#### ✅ The Fix:
Always ensure both datetimes are either timezone-naive or localized to the same timezone before doing subtraction or comparison operations.

```python
# Force start to be aware in UTC
start_aware = start.astimezone(ZoneInfo("UTC"))
duration = end - start_aware
```

### 2. Time Math: Adding Months with `timedelta`
A `timedelta` object supports offsets in `days`, `seconds`, `microseconds`, `milliseconds`, `minutes`, `hours`, and `weeks`. It does **not** support `months` or `years` because months have varying lengths (28, 29, 30, or 31 days).
If you attempt to do `timedelta(months=1)`, Python will raise a `TypeError`.

To add months, use a custom function or the external `dateutil` library.

#### ✅ Custom monthly increment logic:
```python
def add_months(source_date, months_to_add):
    month = source_date.month - 1 + months_to_add
    year = source_date.year + month // 12
    month = month % 12 + 1
    # Handle end-of-month day rollover (e.g., Jan 31 + 1 month -> Feb 28)
    day = min(source_date.day, [31, 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
    return datetime(year, month, day, source_date.hour, source_date.minute, source_date.second)


my_dt = datetime(2026, 1, 31)
print("Jan 31 + 1 Month:", add_months(my_dt, 1))
```

```text
# Output:
Jan 31 + 1 Month: 2026-02-28 00:00:00
```

---

## Practice Exercises & Mini-Projects

### Exercise 1: Build a Subscription Billing Schedule Generator
**Scenario:** A client purchases a monthly subscription. You need to write a function that takes a signup date (string) and prints the scheduled payment dates for the next 6 months.

```python
# Create a script that prints a billing schedule (6 dates) starting 1 month after signup.
```

#### Solution:
```python
def generate_billing_schedule(signup_date_str, total_months=6):
    start_dt = datetime.strptime(signup_date_str, "%Y-%m-%d")
    
    print(f"Generating billing schedule for signup: {signup_date_str}")
    current = start_dt
    for i in range(1, total_months + 1):
        # We can increment by adding approximately 30 days, or use our add_months utility
        current = add_months(current, 1)
        print(f"Billing Invoice #{i}: {current.strftime('%Y-%m-%d')}")


# Run
generate_billing_schedule("2026-07-08")
```

```text
# Output:
Generating billing schedule for signup: 2026-07-08
Billing Invoice #1: 2026-08-08
Billing Invoice #2: 2026-09-08
Billing Invoice #3: 2026-10-08
Billing Invoice #4: 2026-11-08
Billing Invoice #5: 2026-12-08
Billing Invoice #6: 2027-01-08
```

---

## Section Recaps

* **Core Objects:** `date` holds day coordinates, `time` holds daily clock values, `datetime` holds both, and `timedelta` measures the math gap between two events.
* **Format vs. Parse:** Use `strptime` to interpret unstructured text strings as datetime objects. Use `strftime` to output datetimes into presentation-ready strings.
* **Timezones:** Naive datetimes carry no context. Use the `zoneinfo` module to localize date structures globally.
* **Comparisons:** Never compare naive and aware datetimes. Use `astimezone()` to align them first.
* **Math Limits:** Timedelta cannot calculate month or year offsets directly due to leap-calendar shifts. Use custom functions or third-party wrappers to adjust these.

---

## Common Interview Questions

### Q1: What is the difference between `strptime` and `strftime`? How do you remember which is which?
**Answer:** 
* `strptime` is used to **parse** a string into a datetime object. The "p" stands for **Parse**.
  * Syntax: `datetime.strptime("2026-07-08", "%Y-%m-%d")`
* `strftime` is used to **format** a datetime object into a readable string. The "f" stands for **Format**.
  * Syntax: `dt_object.strftime("%d %B %Y")`

### Q2: What happens if you try to subtract a timezone-naive datetime from a timezone-aware datetime? How do you fix it?
**Answer:** It raises a `TypeError` stating `can't subtract offset-naive and offset-aware datetimes`.
To resolve this, you must make the naive datetime aware of the timezone (typically UTC or the target timezone) before executing subtraction:
```python
from zoneinfo import ZoneInfo
naive_dt = naive_dt.replace(tzinfo=ZoneInfo("UTC"))
# Or convert using astimezone
naive_dt = naive_dt.astimezone(ZoneInfo("UTC"))
```

### Q3: Why does `timedelta` support arguments like `days` and `weeks` but not `months` or `years`?
**Answer:** Months and years do not represent a fixed, unchanging quantity of time. A month can contain 28, 29, 30, or 31 days. A year can contain 365 or 366 days. Since the length is variable and depends on the specific starting point in the calendar, Python's `timedelta` object refuses to accept `months` or `years` arguments to prevent silent errors.

### Q4: How does Python 3.9's `zoneinfo` module improve timezone handling compared to historical methods?
**Answer:** Historically, Python relied on third-party libraries like `pytz` for timezone support. However, `pytz` had non-standard behaviors that required developers to use its custom `.localize()` and `.normalize()` methods instead of standard constructors, which caused subtle conversion bugs.
Python 3.9's built-in `zoneinfo` integrates directly with Python's standard `tzinfo` API. It lets you pass timezone labels directly into `datetime` constructors and handles standard calendar arithmetic safely using system zone databases.

### Q5: Write a function to check if a given year is a leap year.
**Answer:** A year is a leap year if it is divisible by 4, except for end-of-century years (ending in 00), which must also be divisible by 400.
```python
def is_leap_year(year):
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    return year % 4 == 0
```
Alternatively, Python provides a built-in function in the `calendar` module:
```python
import calendar
print(calendar.isleap(2026)) # False
```

<div class="interview-tip">
When writing dates in analytics portfolios, standardizing all databases to UTC is the industry best practice. Always perform math operations in UTC and convert to the user's local timezone only when presenting reports or visual charts.
</div>
