---
title: "Date & Time Functions — Calculate Durations & Deadlines"
description: "Work with dates like a pro — TODAY, DATEDIF, EOMONTH, WORKDAY, NETWORKDAYS for business reporting and project tracking."
category: "excel"
order: 5
phase: 3
tags: ["excel", "dates", "time", "datedif", "workday"]
publishedDate: 2025-03-19
prevSlug: "text-functions"
nextSlug: "data-cleaning"
seoTitle: "Excel Date Functions Tutorial | Datalogify"
seoDescription: "Master Excel date functions — TODAY, DATEDIF, EOMONTH, WORKDAY, NETWORKDAYS for business analytics."
---

## Why This Matters

Every business report revolves around time — monthly revenue, quarterly targets, customer tenure, project deadlines. If you can't manipulate dates in Excel, you can't build a single useful report.

## How Excel Stores Dates

Excel stores dates as **serial numbers** starting from January 1, 1900 (= serial number 1). This is why you can do math with dates.

| What You See | What Excel Stores |
|---|---|
| 01/01/2025 | 45658 |
| 06/15/2025 | 45823 |
| 12/31/2025 | 46022 |

This means `=B2 - A2` gives you the **number of days** between two dates. It just works.

## Getting Today's Date

```text
=TODAY()          → Returns today's date (updates automatically)
=NOW()            → Returns today's date AND current time
```

```text
TODAY() → 07/02/2025
NOW()  → 07/02/2025 14:35:22
```

> **Pro tip:** `TODAY()` and `NOW()` are volatile — they recalculate every time the sheet changes. Don't use them in thousands of cells.

## Extracting Date Parts

| Formula | What It Returns | Example (for 03/15/2025) |
|---|---|---|
| `=YEAR(A2)` | Year | 2025 |
| `=MONTH(A2)` | Month (1-12) | 3 |
| `=DAY(A2)` | Day (1-31) | 15 |
| `=WEEKDAY(A2)` | Day of week (1=Sun) | 7 (Saturday) |
| `=WEEKDAY(A2,2)` | Day of week (1=Mon) | 6 |

**Real use case — Group sales by month:**

| Date | Region | Revenue | Month | Quarter |
|---|---|---|---|---|
| 01/15/2025 | North | ₹45,000 | Jan | Q1 |
| 02/20/2025 | South | ₹38,000 | Feb | Q1 |
| 04/10/2025 | East | ₹52,000 | Apr | Q2 |

```text
=TEXT(A2,"MMM")                        → "Jan", "Feb", "Apr"
="Q"&ROUNDUP(MONTH(A2)/3,0)           → "Q1", "Q1", "Q2"
=YEAR(A2)&"-"&TEXT(A2,"MM")           → "2025-01", "2025-02", "2025-04"
```

## DATEDIF — Days, Months, Years Between Two Dates

`DATEDIF` is Excel's hidden gem — it's undocumented but works perfectly.

```text
=DATEDIF(start_date, end_date, unit)
```

| Unit | Returns |
|---|---|
| `"Y"` | Complete years |
| `"M"` | Complete months |
| `"D"` | Days |
| `"YM"` | Months after subtracting years |
| `"MD"` | Days after subtracting months |
| `"YD"` | Days after subtracting years |

**Example — Employee tenure calculation:**

| Employee | Join Date | Tenure |
|---|---|---|
| Alice | 03/15/2020 | 5 years, 3 months |
| Bob | 11/01/2022 | 2 years, 8 months |
| Carol | 07/22/2024 | 0 years, 11 months |

```text
=DATEDIF(B2,TODAY(),"Y")&" years, "&DATEDIF(B2,TODAY(),"YM")&" months"
```

**Example — Customer age from birthdate:**

```text
=DATEDIF(A2,TODAY(),"Y")     → 28 (age in years)
```

## EOMONTH — End of Month

Returns the last day of a month, offset by N months.

```text
=EOMONTH(A2, 0)     → Last day of same month as A2
=EOMONTH(A2, 1)     → Last day of NEXT month
=EOMONTH(A2, -1)    → Last day of PREVIOUS month
=EOMONTH(A2, 3)     → Last day of month 3 months from now
```

**Real use case — Invoice due dates:**

| Invoice Date | Due Date (End of Next Month) |
|---|---|
| 01/15/2025 | 02/28/2025 |
| 02/20/2025 | 03/31/2025 |
| 11/05/2025 | 12/31/2025 |

```text
=EOMONTH(A2, 1)
```

**First day of current month:**

```text
=EOMONTH(TODAY(),-1)+1
```

## WORKDAY & NETWORKDAYS — Business Days Only

These exclude weekends (and optionally holidays).

```text
=WORKDAY(start_date, days, [holidays])
→ Date that is N working days from start

=NETWORKDAYS(start_date, end_date, [holidays])
→ Number of working days between two dates
```

**Example — Project deadline tracker:**

| Task | Start Date | Working Days | Deadline |
|---|---|---|---|
| Data Collection | 01/06/2025 | 10 | 01/20/2025 |
| Analysis | 01/20/2025 | 15 | 02/10/2025 |
| Report | 02/10/2025 | 5 | 02/17/2025 |

```text
=WORKDAY(B2, C2)
```

**With holidays excluded:**

Set up a holiday list in cells F2:F5:

| Holidays |
|---|
| 01/26/2025 |
| 03/14/2025 |
| 08/15/2025 |
| 10/02/2025 |

```text
=WORKDAY(B2, C2, $F$2:$F$5)
=NETWORKDAYS(A2, B2, $F$2:$F$5)
```

## DATEADD Patterns (Excel Doesn't Have DATEADD)

Excel doesn't have a DATEADD function like SQL, but you can build it:

```text
=A2 + 30                        → Add 30 days
=DATE(YEAR(A2),MONTH(A2)+3,DAY(A2))  → Add 3 months
=DATE(YEAR(A2)+1,MONTH(A2),DAY(A2))  → Add 1 year
=EDATE(A2, 6)                   → Add exactly 6 months
```

## DATE Function — Build Dates from Parts

```text
=DATE(2025, 6, 15)               → 06/15/2025
=DATE(YEAR(A2), 1, 1)            → Jan 1 of same year (fiscal year start)
=DATE(YEAR(A2), MONTH(A2), 1)    → First day of same month
```

## Formatting Dates with TEXT()

```text
=TEXT(A2, "MM/DD/YYYY")          → "03/15/2025"
=TEXT(A2, "DD-MMM-YYYY")         → "15-Mar-2025"
=TEXT(A2, "MMMM YYYY")           → "March 2025"
=TEXT(A2, "DDD")                 → "Sat"
=TEXT(A2, "DDDD")                → "Saturday"
```

**Dynamic report title:**

```text
="Sales Report — "&TEXT(TODAY(),"MMMM YYYY")
→ "Sales Report — July 2025"
```

## Fiscal Year / Quarter Calculations

Most companies don't use Jan-Dec fiscal years. Here's how to handle April-March fiscal year (common in India):

```text
=IF(MONTH(A2)>=4, YEAR(A2), YEAR(A2)-1)          → Fiscal year
="FY"&IF(MONTH(A2)>=4,YEAR(A2)&"-"&YEAR(A2)+1,YEAR(A2)-1&"-"&YEAR(A2))  → "FY2025-2026"
=IF(MONTH(A2)>=4,"Q"&ROUNDUP((MONTH(A2)-3)/3,0),"Q"&ROUNDUP((MONTH(A2)+9)/3,0))  → Fiscal quarter
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Building monthly/quarterly/yearly reports with correct period grouping
- Calculating customer tenure, subscription renewal dates, contract expiry
- Project management — estimating deadlines in working days
- Financial modeling — fiscal year/quarter calculations
- SLA tracking — counting business days for response time compliance

</div>

<div class="challenge">

**Mini-Challenge:** You have employee data with join dates. Build a sheet that calculates:
1. Tenure in years and months using DATEDIF
2. Next work anniversary date
3. Number of working days since joining (excluding public holidays)
4. Fiscal quarter they joined in (April-March fiscal year)
5. A dynamic title: "HR Report — [Month] [Year]"

</div>

## Common Interview Questions

### Q1: How does Excel store dates internally?

**Answer:** Excel stores dates as serial numbers starting from January 1, 1900 (serial 1). This is why date arithmetic works — subtracting two dates gives you the number of days between them. Time is stored as a decimal fraction of a day (0.5 = noon).

### Q2: What's the difference between NETWORKDAYS and WORKDAY?

**Answer:** `NETWORKDAYS(start, end)` counts the number of working days between two dates. `WORKDAY(start, days)` returns the date that is N working days from a start date. Both exclude weekends and can optionally exclude holidays. NETWORKDAYS is for measurement; WORKDAY is for projection.

### Q3: How do you calculate someone's age in Excel?

**Answer:** `=DATEDIF(birthdate, TODAY(), "Y")` returns the age in complete years. DATEDIF is undocumented (doesn't appear in autocomplete) but works reliably. Alternative: `=INT((TODAY()-A2)/365.25)` but DATEDIF is more accurate for edge cases.

### Q4: How do you extract the quarter from a date?

**Answer:** `=ROUNDUP(MONTH(A2)/3,0)` gives calendar quarter (1-4). For fiscal quarters (e.g., April-March), adjust: `=ROUNDUP(MOD(MONTH(A2)-4+12,12)/3+0.01,0)` or use a nested IF formula. The `CEILING` function also works: `=CEILING(MONTH(A2)/3,1)`.

### Q5: Why might a date show as a number like 45658?

**Answer:** The cell is formatted as General or Number instead of Date. Select the cell → Ctrl+1 → Format as Date. This is a common issue when importing data from CSV/text files where Excel doesn't auto-detect the date format.
