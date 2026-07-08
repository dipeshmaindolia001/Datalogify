---
title: "Date & Time Functions — Calculate Durations & Deadlines"
description: "Work with dates like a pro — TODAY, DATEDIF, EOMONTH, WORKDAY, NETWORKDAYS for business reporting and project tracking."
category: "excel"
order: 5
phase: 3
tags: ["excel", "dates", "time", "datedif", "workday", "networkdays"]
publishedDate: 2026-07-08
prevSlug: "text-functions"
nextSlug: "data-cleaning"
seoTitle: "Excel Date and Time Functions Tutorial | Datalogify"
seoDescription: "Master Excel's date and time functions: TODAY, NOW, DATEDIF, EOMONTH, WORKDAY, and NETWORKDAYS. Learn serial numbers, SLA tracking, and custom date formatting."
---

## Introduction & The "Why"

Imagine a project manager tracking a multi-million dollar construction project, or an HR analyst calculating employee tenure for retirement benefits. To do their jobs, they must answer questions like:
- *How many business days did it take to resolve this customer ticket?*
- *When is the exact deadline for a project if we have 15 working days, excluding weekends and public holidays?*
- *What is the customer's exact age in years, months, and days?*
- *Which fiscal quarter does a transaction date fall into?*

If you treat dates in Excel as mere static text strings (like `"2025-03-15"`), you cannot perform calculations. To Excel, that is just a label, no different from `"Apple"` or `"Blue shirt"`. 

To solve this, Excel uses a continuous coordinate system for time. Think of dates in Excel as a **chronological timeline grid** or a **tape measure** stretched across history. Every single day is a tick mark on that tape measure, numbered sequentially. This is Excel’s **Date Serial Numbering System**. Because dates are stored as numbers, calculating the difference between two dates is as simple as subtracting one coordinate from another.

```text
  [Jan 1, 1900] ─── [Jan 2, 1900] ─── [Jan 3, 1900] ─────── [Jul 8, 2026] ─── [Jul 9, 2026]
   Serial: 1         Serial: 2         Serial: 3             Serial: 46211       Serial: 46212
  └─────────────────── Time Math: 46212 - 46211 = 1 Day ────────────────────────────────┘
```

In this guide, we will unpack how Excel processes dates under the hood, and master the key formulas that allow you to track SLAs, calculate tenure, predict billing dates, and project milestones with absolute precision.

---

## Step-by-Step Concept Breakdown

### 1. Excel's Date Serial Numbering System
Excel stores dates as **positive serial numbers**. 
- **The Epoch:** Serial number `1` represents **January 1, 1900**.
- Every day that passes increments the serial number by `1`.
- For example, **July 8, 2026** is stored internally as the serial number `46211` because it is exactly 46,211 days after January 1, 1900.

#### Time as a Decimal Fraction
What about time? Hours, minutes, and seconds are represented as **decimal fractions of a day** (which is 24 hours):
- `0.5` represents 12:00 PM (noon) — half of a day.
- `0.25` represents 06:00 AM — a quarter of a day.
- `0.75` represents 06:00 PM — three-quarters of a day.
- A value like `46211.5` represents **July 8, 2026, 12:00 PM**.

```text
+-----------------------+---------------------+---------------------------------+
|     Human Date        | Internal Serial No. |          Description            |
+-----------------------+---------------------+---------------------------------+
| January 1, 1900       | 1.00000             | The starting point (Epoch)      |
| January 2, 1900       | 2.00000             | 1 day after epoch               |
| December 31, 1999     | 36525.00000         | Eve of the new millennium       |
| July 8, 2026 06:00 AM | 46211.25000         | 46,211 days and a quarter day  |
| July 8, 2026 06:00 PM | 46211.75000         | 46,211 days and three-quarter   |
+-----------------------+---------------------+---------------------------------+
```

> [!NOTE]
> If you ever see a strange five-digit number in a cell (e.g., `45678`) where you expected a date, don't panic! The date is stored correctly; the cell's formatting has simply been set to **General** or **Number**. Changing the cell format back to **Short Date** will display it in a human-readable format.

---

### 2. Fetching & Creating Dates: `TODAY()`, `NOW()`, and `DATE()`

To write dynamic dates, you must use Excel's built-in date generation functions.

#### `TODAY()` and `NOW()`
- `=TODAY()` takes no arguments and returns the current date based on your system clock.
- `=NOW()` takes no arguments and returns the current date and time.

Both are **volatile functions**, meaning they recalculate every single time you edit *any* cell or open your workbook. 
*Best Practice:* If you need to lock a static timestamp that won't change, do not use these formulas. Instead, use these keyboard shortcuts:
- **Insert static current date:** `Ctrl` + `;` (semicolon)
- **Insert static current time:** `Ctrl` + `Shift` + `;` (semicolon)

#### `DATE(year, month, day)`
This function takes three integer arguments and returns a structured Excel date serial number.
```excel
=DATE(2026, 7, 8)
```
```text
# Output:
07/08/2026
```

Why use `DATE()` instead of typing `"07/08/2026"`?
1. **Regional Standards:** In the US, `"07/08/2026"` is July 8th. In the UK, it is August 7th. Typing dates as strings leads to parsing errors on other machines. `DATE(2026, 7, 8)` is globally unambiguous.
2. **Dynamic Argument Passing:** You can pass formulas as arguments inside `DATE()`. For example, to find the first day of the current year:
   `=DATE(YEAR(TODAY()), 1, 1)`

---

### 3. Extracting Date Parts: `YEAR()`, `MONTH()`, `DAY()`, and `WEEKDAY()`

If you have a cell containing a date, you can pull out its individual parts for reporting and grouping:

- `=YEAR(serial_number)`: Returns the 4-digit year (e.g., `2026`).
- `=MONTH(serial_number)`: Returns the month index from `1` (January) to `12` (December).
- `=DAY(serial_number)`: Returns the day of the month from `1` to `31`.
- `=WEEKDAY(serial_number, [return_type])`: Returns a number representing the day of the week.
  - If `return_type` is omitted or `1`, the week starts on Sunday (1) and ends on Saturday (7).
  - If `return_type` is `2`, the week starts on Monday (1) and ends on Sunday (7) — preferred for standard business math.

---

### 4. Calculating Tenure and Age: `DATEDIF()`

`DATEDIF` is Excel's "undocumented" function. It is a legacy compatibility function from Lotus 1-2-3. It doesn't appear in the auto-complete dropdown list when you start typing `=DATE...`, but it is fully functional.

#### Syntax
```excel
=DATEDIF(start_date, end_date, unit)
```
* **`start_date`**: The older date.
* **`end_date`**: The newer date (must be greater than or equal to `start_date`, otherwise returns a `#NUM!` error).
* **`unit`**: A string code defining how the difference should be calculated:

| Unit | Description | Analytical Use Case |
|---|---|---|
| `"Y"` | Full completed years | Age, employee tenure milestones |
| `"M"` | Full completed months | Subscription length, lease tracking |
| `"D"` | Total elapsed days | Standard age-in-days calculations |
| `"YM"` | Months remaining after subtracting full years | "X Years and Y Months" displays |
| `"YD"` | Days remaining after subtracting full years | Seasonal tracking (ignoring the calendar year) |
| `"MD"` | Days remaining after subtracting full months | Precise breakdown: "X Years, Y Months, Z Days" |

---

### 5. Advanced Business Calculations: `EOMONTH()`, `WORKDAY()`, and `NETWORKDAYS()`

Standard arithmetic (like `A2 + 30`) assumes all days are equal. But business operates on business calendars.

#### `EOMONTH(start_date, months)`
Returns the date of the **last day of the month**, shifted by a specified number of months.
- `=EOMONTH(A2, 0)`: Last day of the current month.
- `=EOMONTH(A2, 1)`: Last day of next month.
- `=EOMONTH(A2, -1)`: Last day of previous month.

*Analyst Trick — Days in a Month:* To dynamically calculate how many days are in a given month, extract the day of its last date:
```excel
=DAY(EOMONTH(A2, 0))
```

#### `WORKDAY(start_date, days, [holidays])`
Calculates a target date that is a specified number of working days in the future (or past), automatically skipping Saturdays, Sundays, and a custom list of holiday dates.
- Useful for determining: *"When will a ticket be resolved if our SLA is 10 business days?"*

#### `NETWORKDAYS(start_date, end_date, [holidays])`
Calculates the net number of working days between two dates, excluding weekends (Saturday/Sunday) and a custom list of holidays.
- Useful for determining: *"How many business days did this audit take?"*

---

### 6. Date Formatting with the `TEXT()` Function
Formatting cells using the Excel UI changes what you *see*, but it does not change the cell's underlying value. If you need to concatenate a date with a text string, Excel will output the raw serial number:
- `"Report Date: " & TODAY()` results in `"Report Date: 46211"`.

To convert a date to structured text, use:
```excel
=TEXT(value, format_code)
```

Use these custom formatting codes:
- **Days:** `"d"` (1), `"dd"` (01), `"ddd"` (Wed), `"dddd"` (Wednesday)
- **Months:** `"m"` (7), `"mm"` (07), `"mmm"` (Jul), `"mmmm"` (July)
- **Years:** `"yy"` (26), `"yyyy"` (2026)

```excel
="Report Date: " & TEXT(TODAY(), "dd-mmm-yyyy")
```
```text
# Output:
Report Date: 08-Jul-2026
```

---

## Code & Practical Walkthroughs

Let us examine real-world datasets and look at the exact formulas applied line-by-line.

### Walkthrough 1: Project SLA Deadline Tracker
A operations team needs to monitor customer support tickets. They need to calculate:
1. The deadline (5 business days from creation).
2. The actual business days taken to resolve the ticket.
3. Whether the ticket breached the SLA.

#### Input Data: Table `SupportTickets`
| TicketID (Col A) | DateCreated (Col B) | DateResolved (Col C) | HolidayList (Col G) |
| :--- | :--- | :--- | :--- |
| T-1001 | 2026-06-25 | 2026-07-03 | 2026-07-03 |
| T-1002 | 2026-06-29 | 2026-07-02 | |
| T-1003 | 2026-07-01 | In Progress | |

#### Formula 1: SLA Target Deadline (5 Business Days)
Show the markdown table before the formula:

| TicketID (Col A) | DateCreated (Col B) | DateResolved (Col C) |
| :--- | :--- | :--- |
| T-1001 | 2026-06-25 | 2026-07-03 |

Write this formula in Column D (`Deadline`):
```excel
=WORKDAY(B2, 5, $G$2:$G$10)
```
- **Step-by-Step Logic:**
  - Start at date in `B2` (`2026-06-25` - Thursday).
  - Add 5 working days. Skip Saturday (June 27) and Sunday (June 28).
  - Check the holiday list in `$G$2:$G$10`. `2026-07-03` is in that range, so skip it.
  - The fifth business day lands on **July 3, 2026**, but since it's a holiday, it shifts to **July 6, 2026**.

```text
# Output:
07/06/2026
```

#### Formula 2: Actual Business Days Taken
Show the markdown table before the formula:

| TicketID (Col A) | DateCreated (Col B) | DateResolved (Col C) |
| :--- | :--- | :--- |
| T-1001 | 2026-06-25 | 2026-07-03 |

Write this formula in Column E (`BusinessDays`):
```excel
=IF(C2="In Progress", NETWORKDAYS(B2, TODAY(), $G$2:$G$10), NETWORKDAYS(B2, C2, $G$2:$G$10))
```
- **Step-by-Step Logic:**
  - If the ticket is still open (`In Progress`), calculate working days from start date (`B2`) to `TODAY()`.
  - If completed, calculate working days between `B2` (Creation) and `C2` (Resolution), accounting for holidays.

```text
# Output:
6
```

---

### Walkthrough 2: Employee Tenure & Retrospective Review Dates
An HR Analyst must audit employee tenure to prepare a milestone rewards program.

#### Input Data: Table `Employees`
| EmpID (Col A) | Name (Col B) | HireDate (Col C) | CurrentDate (Col D) |
| :--- | :--- | :--- | :--- |
| E-405 | Diana Prince | 2018-04-15 | 2026-07-08 |
| E-406 | Bruce Wayne | 2021-11-01 | 2026-07-08 |

#### Formula 1: Calculate Total Tenure in Years, Months, and Days
Show the markdown table before the formula:

| EmpID (Col A) | Name (Col B) | HireDate (Col C) | CurrentDate (Col D) |
| :--- | :--- | :--- | :--- |
| E-405 | Diana Prince | 2018-04-15 | 2026-07-08 |

Write this formula in Column E (`TenureString`):
```excel
=DATEDIF(C2, D2, "Y") & " Years, " & DATEDIF(C2, D2, "YM") & " Months, " & DATEDIF(C2, D2, "MD") & " Days"
```
- **Step-by-Step Logic:**
  - `DATEDIF(C2, D2, "Y")` calculates the full integer years (8).
  - `DATEDIF(C2, D2, "YM")` extracts the remaining months left over (2).
  - `DATEDIF(C2, D2, "MD")` extracts the remaining days left over (23).
  - The `&` characters concatenate these numbers with clean descriptive labels.

```text
# Output:
8 Years, 2 Months, 23 Days
```

#### Formula 2: Determine Next Annual Review Date
Annual reviews always happen on the first business day of the month after their hiring anniversary.
Show the markdown table before the formula:

| EmpID (Col A) | Name (Col B) | HireDate (Col C) | CurrentDate (Col D) |
| :--- | :--- | :--- | :--- |
| E-405 | Diana Prince | 2018-04-15 | 2026-07-08 |

Write this formula in Column F (`NextReview`):
```excel
=WORKDAY(EOMONTH(DATE(YEAR(D2), MONTH(C2), DAY(C2)), 0), 1)
```
- **Step-by-Step Logic:**
  - `DATE(YEAR(D2), MONTH(C2), DAY(C2))` recreates the hire date in the current calendar year (`2026-04-15`).
  - `EOMONTH(..., 0)` moves to the last calendar day of that anniversary month (`2026-04-30`).
  - `WORKDAY(..., 1)` moves forward by exactly 1 business day, bypassing weekends. The next review occurs on `2026-05-03` (since May 1st, 2026 is a Friday, and May 2nd is Saturday, this will step cleanly forward based on standard workday calendar).

```text
# Output:
05/03/2026
```

---

### Walkthrough 3: Fiscal Period & Financial Reporting
A retail financial analyst needs to group transactions into standard corporate fiscal quarters. The fiscal year starts on **April 1st** rather than January 1st.

#### Input Data: Table `SalesTransactions`
| SalesID (Col A) | TransactionDate (Col B) | Revenue (Col C) |
| :--- | :--- | :--- |
| S-99211 | 2026-02-14 | $12,450 |
| S-99212 | 2026-05-18 | $8,900 |

#### Formula 1: Assign Fiscal Quarter
Show the markdown table before the formula:

| SalesID (Col A) | TransactionDate (Col B) | Revenue (Col C) |
| :--- | :--- | :--- |
| S-99211 | 2026-02-14 | $12,450 |

Write this formula in Column D (`FiscalQuarter`):
```excel
="Q" & CHOOSE(MONTH(B2), 4, 4, 4, 1, 1, 1, 2, 2, 2, 3, 3, 3)
```
- **Step-by-Step Logic:**
  - `MONTH(B2)` extracts the month index (2 for February).
  - `CHOOSE()` maps that index (1 to 12) to corresponding fiscal quarter numbers. Since February is index 2, CHOOSE selects the 2nd value in its list, which is 4.

```text
# Output:
Q4
```

#### Formula 2: Create a Formatted Period ID (e.g., "FY26-Q1")
Show the markdown table before the formula:

| SalesID (Col A) | TransactionDate (Col B) | FiscalQuarter (Col D) |
| :--- | :--- | :--- |
| S-99212 | 2026-05-18 | Q1 |

Write this formula in Column E (`FiscalPeriod`):
```excel
="FY" & RIGHT(YEAR(B2) + IF(MONTH(B2) < 4, -1, 0), 2) & "-" & D2
```
- **Step-by-Step Logic:**
  - If the sales month is Jan, Feb, or Mar (less than 4), it belongs to the previous year's fiscal budget cycle. `IF(MONTH(B2) < 4, -1, 0)` adjusts the year.
  - `YEAR(B2) + 0` computes `2026`.
  - `RIGHT(..., 2)` extracts the final two digits: `26`.
  - Concatenates the string: `FY` + `26` + `-` + `Q1` = `FY26-Q1`.

```text
# Output:
FY26-Q1
```

---

## Edge Cases & Common Mistakes

### 1. The Undocumented `#NUM!` Error in `DATEDIF`
The most common mistake in `DATEDIF` is putting the dates in the wrong chronological order.
* **Error:** `=DATEDIF(TODAY(), C2, "Y")` where `C2` is the employee's hire date in the past.
* **Fix:** Always write `=DATEDIF(older_date, newer_date, unit)`.

### 2. The 1900 Leap Year Bug
In Excel, **1900 is treated as a leap year** (meaning February 29, 1900 exists in Excel's serial system). In reality, 1900 was *not* a leap year. 
* **Impact:** This bug was intentionally introduced in the first version of Excel to ensure compatibility with Lotus 1-2-3.
* **Workaround:** For dates after March 1, 1900, Excel's system is perfectly aligned. If you are analyzing historical data from before March 1, 1900, be aware that day counts may be off by exactly 1 day.

### 3. Date Formatting vs. Underlying Date Value
Changing a date format from `MM/DD/YYYY` to `YYYY-MM-DD` via the format dropdown changes nothing about how Excel evaluates formulas. If you try to run `=VLOOKUP` matching on a custom formatted date cell, it checks the underlying serial number value, not the display string. If lookups fail, verify that both columns are true dates (serial numbers) or both are plain text.

### 4. Text Conversions Breaking Regionally
If you write `=DATEVALUE("12/03/2026")`, Excel will convert this string into a serial number. However, if a colleague in London opens this workbook, their system will parse this as **March 12**, whereas a US user parses it as **December 3**.
* **Rule:** Never hardcode dates as text strings inside formulas. Always use `=DATE(2026, 12, 3)`.

---

## Practice Exercises & Mini-Projects

<div class="challenge">

### Challenge 1: Employee Probation Status Tracker
You are given a list of new hires. The company has a strict **90-day calendar probation period**. However, the review must occur on the nearest Friday *after* the 90th day. If the Friday falls on a company holiday, it must shift to the preceding Thursday.

Write a formula that calculates:
1. The exact end of the 90-day probation window.
2. The next calendar Friday.
3. The adjusted review date accounting for a list of holidays in range `H2:H10`.
</div>

<div class="challenge">

### Challenge 2: Dynamic Project Phase Planner
Create a tracker that automatically calculates the starting dates of project phases. Each phase is dependent on the end date of the previous phase. Phase 2 starts exactly 3 business days after Phase 1 finishes. Write a system using `WORKDAY` that automatically cascades start and end dates through 5 sequential phases, accounting for weekends and public holidays.
</div>

---

## Section Recaps

* **Date Serial Numbers:** Excel stores dates as whole integers starting with January 1, 1900. Time is stored as a decimal fraction of a day.
* **Volatility:** `TODAY()` and `NOW()` recalculate with every cell update. Use keyboard shortcuts `Ctrl + ;` to capture static stamps.
* **DATEDIF:** The syntax `=DATEDIF(start, end, unit)` is the standard way to calculate years (`"Y"`), months (`"M"`), and remaining intervals (`"YM"`, `"MD"`).
* **Business Math:** `NETWORKDAYS` and `WORKDAY` are essential for scheduling because they skip weekends and custom lists of holidays.
* **Text Formatting:** Use `=TEXT(date, "format")` to safely merge dates with descriptive text blocks.

---

## Common Interview Questions

### Q1: How does Excel store dates and times under the hood, and why is this design beneficial?
**Answer:** 
Excel stores dates as sequential integers (serial numbers) starting with January 1, 1900 as `1`. Times are stored as decimal fractions of a 24-hour day (e.g., `0.25` is 6:00 AM). 

This design is beneficial because it simplifies calculations. To find the number of days between two dates, Excel subtracts the smaller serial number from the larger one, avoiding complex calendar arithmetic.

<div class="interview-tip">
Always mention that because dates are numbers, you can easily add numbers to them (e.g., `=A2 + 7` to get the date one week later) without using functions.
</div>

### Q2: What is the difference between `WORKDAY` and `NETWORKDAYS`?
**Answer:**
* **`WORKDAY(start_date, days, [holidays])`** outputs a **specific date** in the future or past after adding or subtracting a set number of business days.
* **`NETWORKDAYS(start_date, end_date, [holidays])`** outputs the **integer count of working days** between two existing dates.

Use `WORKDAY` to find deadlines, and `NETWORKDAYS` to measure productivity or turnaround times.

### Q3: When writing a formula like `="Created on " & TODAY()`, the result looks like `Created on 46211`. How do you resolve this?
**Answer:**
The concatenation operator `&` forces the output to be a text string, which displays the date's underlying serial number. To display the date correctly, wrap it in the `TEXT` function to define a specific format:
```excel
="Created on " & TEXT(TODAY(), "yyyy-mm-dd")
```

### Q4: Why would a `DATEDIF` formula return a `#NUM!` error, and how would you fix it?
**Answer:**
A `#NUM!` error occurs when the `start_date` argument is chronologically later than the `end_date`. To fix this, swap the arguments so the older date is first:
```excel
=DATEDIF(HireDate, TODAY(), "Y")
```
Alternatively, wrap the calculation in an `IF` statement to check that the start date is before the end date.

### Q5: How do you calculate the number of days in the current month using formulas?
**Answer:**
You can find the number of days in a month by using the `EOMONTH` function to find the last day of the month, and then wrapping it in the `DAY` function to extract the day number:
```excel
=DAY(EOMONTH(TODAY(), 0))
```
If `TODAY()` is July 8th, `EOMONTH(..., 0)` returns July 31st, and `DAY(...)` returns `31`.
