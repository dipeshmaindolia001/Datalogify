---
title: "Data Cleaning & Preparation — Duplicates, Validation & Formatting"
description: "Prepare raw data for analysis — remove duplicates, validate inputs, apply conditional formatting, and handle blanks and errors."
category: "excel"
order: 6
phase: 3
tags: ["excel", "data-cleaning", "validation", "conditional-formatting"]
publishedDate: 2025-03-20
prevSlug: "date-time-functions"
nextSlug: "lookup-functions"
seoTitle: "Excel Data Cleaning Tutorial | Datalogify"
seoDescription: "Clean and prepare data in Excel — remove duplicates, data validation, conditional formatting, handle blanks."
---

## Why This Matters

Raw data is always messy — extra spaces, duplicates, wrong data types, blanks everywhere. Before you build a single chart or pivot table, you clean the data. This is where analysts spend 60-80% of their time.

## Remove Duplicates

**Path:** Data tab → Remove Duplicates

Before removing, you need to decide: what makes a row a "duplicate"?

| Name | Email | City | Amount |
|---|---|---|---|
| Alice | alice@mail.com | Mumbai | ₹5,000 |
| Bob | bob@mail.com | Delhi | ₹3,000 |
| Alice | alice@mail.com | Mumbai | ₹5,000 |
| Alice | alice@mail.com | Mumbai | ₹8,000 |

- Check **all columns** → removes row 3 only (exact duplicate)
- Check **Name + Email** only → removes rows 3 AND 4 (same person, different amounts — be careful!)

**Steps:**
1. Select your data range (or click any cell in the table)
2. Data → Remove Duplicates
3. Select which columns to check for duplicates
4. Click OK — Excel tells you how many were removed

> **Pro tip:** Before removing, use `=COUNTIF(A:A, A2)` to flag duplicates first. Review before deleting.

**Finding duplicates without removing:**

```text
=COUNTIF($A$2:$A$500, A2)
```

If result > 1, that value appears more than once. Combine with Conditional Formatting to highlight them.

## Data Validation — Prevent Bad Data Entry

**Path:** Data tab → Data Validation

Data Validation restricts what users can type into cells. Essential for shared workbooks and input forms.

### Dropdown List

1. Select the cells you want to restrict
2. Data → Data Validation
3. Allow: **List**
4. Source: `North,South,East,West` (comma-separated) or point to a range like `=$F$2:$F$5`

Now those cells only accept values from the list — no typos!

### Number Range

- Allow: **Whole Number** or **Decimal**
- Between: 0 and 100 (for percentage inputs)
- This prevents someone from typing 500 in a percentage field

### Date Range

- Allow: **Date**
- Between: 01/01/2024 and 12/31/2025
- Prevents future/historical dates that don't make sense

### Custom Formula

- Allow: **Custom**
- Formula: `=LEN(A2)=10` (must be exactly 10 characters — phone numbers)
- Formula: `=AND(A2>=0, A2<=100)` (must be 0-100)
- Formula: `=ISNUMBER(A2)` (must be a number)

### Input Message & Error Alert

- **Input Message:** Shows a tooltip when the cell is selected ("Enter region: North, South, East, or West")
- **Error Alert:** Shows when invalid data is entered. Choose Stop (blocks entry), Warning (asks to continue), or Information (just notifies)

## Conditional Formatting — Visual Data Analysis

**Path:** Home tab → Conditional Formatting

Makes patterns jump off the screen without writing a single formula.

### Highlight Cells Rules

| Rule | Use Case |
|---|---|
| Greater Than | Revenue above target |
| Less Than | Scores below passing |
| Between | Values in a specific range |
| Equal To | Specific status ("Pending") |
| Text That Contains | Names containing "Ltd" |
| Duplicate Values | Find duplicates instantly |

**Example:** Highlight all revenue cells above ₹50,000:
1. Select D2:D500
2. Conditional Formatting → Highlight Cells Rules → Greater Than
3. Enter 50000 → Choose green fill

### Color Scales (Heatmaps)

Select a range → Conditional Formatting → Color Scales

This creates an instant heatmap:
- **Green-Yellow-Red:** Best for performance metrics (green = good)
- **Red-Yellow-Green:** Best for risk/error metrics

Perfect for: regional sales comparison, student grades, KPI dashboards.

### Data Bars

In-cell mini bar charts. Select range → Conditional Formatting → Data Bars.

Each cell gets a proportional bar showing its value relative to the range. Great for quick visual comparison without building a chart.

### Icon Sets

Arrows (↑ → ↓), traffic lights (🟢🟡🔴), flags, stars.

Use for: status indicators, trend direction, rating systems.

### Custom Formula Rules (Most Powerful)

For complex conditions, use a custom formula:

**Highlight entire row where Region = "North":**
1. Select the entire data range A2:D500
2. Conditional Formatting → New Rule → "Use a formula"
3. Formula: `=$B2="North"` (note: $ on column only, not row!)
4. Choose formatting (fill color, bold, etc.)

**Highlight above-average sales:**

```text
=$D2>AVERAGE($D$2:$D$500)
```

**Highlight rows with blanks:**

```text
=COUNTBLANK($A2:$D2)>0
```

## Handling Blanks and Errors

### Check for Blanks

```text
=ISBLANK(A2)                    → TRUE if empty
=IF(ISBLANK(A2),"Missing",A2)  → Replace blank with "Missing"
=COUNTA(A2:A500)                → Count non-empty cells
=COUNTBLANK(A2:A500)            → Count empty cells
```

### Handle Errors

```text
=IFERROR(D2/E2, 0)              → Returns 0 instead of #DIV/0!
=IFERROR(VLOOKUP(A2,Table,2,FALSE), "Not Found")  → Clean lookup errors
=IFNA(VLOOKUP(A2,Table,2,FALSE), "N/A")           → Only catches #N/A
```

### Go To Special — Find All Blanks

1. Select your range
2. Ctrl+G → Special → Blanks
3. All blank cells are now selected
4. Type a value (e.g., 0 or "N/A") → Ctrl+Enter to fill all at once

## Convert Range to Table (Ctrl+T)

This is one of the most underused features. Converting your data to an Excel Table gives you:

- **Auto-expanding ranges** — new rows are automatically included in formulas
- **Structured references** — `=SUM(Table1[Revenue])` instead of `=SUM(D2:D500)`
- **Auto-filter** on every column
- **Banded rows** for readability
- **Total row** toggle (right-click → Table → Totals Row)

```text
Structured Reference Examples:
=SUM(SalesTable[Revenue])                  → Sum entire Revenue column
=SUMIFS(SalesTable[Revenue], SalesTable[Region], "North")  → Sum North revenue
```

## Power Query Preview (Data → Get & Transform)

For serious data cleaning, Power Query is the modern approach. It records your cleaning steps and replays them automatically when data refreshes. We cover Power Query in detail in a later lesson, but here's a preview:

- Remove duplicates without losing your raw data
- Split columns (e.g., "John Smith" → "John" | "Smith")
- Merge queries (JOIN tables like SQL)
- Unpivot columns (wide → long format)
- Change data types automatically
- Combine multiple Excel files/sheets in one click

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- First step of literally every analytics project: "clean the data"
- Building input forms with Data Validation for non-technical teams
- Creating dashboards with conditional formatting for quick visual analysis
- Setting up Ctrl+T tables so formulas auto-expand as data grows
- QA checks: finding duplicates, blanks, outliers before reporting

</div>

<div class="challenge">

**Mini-Challenge:** Take this messy dataset and clean it:

| Name | Region | Revenue | Date |
|---|---|---|---|
| alice johnson | North | 45000 | 01/15/2025 |
| BOB SMITH | south | | 02/20/2025 |
| Alice Johnson | North | 45000 | 01/15/2025 |
| Carol Davis | East | -5000 | 13/32/2025 |

1. Fix name formatting with PROPER()
2. Standardize region names
3. Flag the duplicate row
4. Flag the blank revenue
5. Flag the negative revenue (likely data entry error)
6. Flag the invalid date
7. Add Data Validation to prevent these issues in the future

</div>

## Common Interview Questions

### Q1: How do you find and remove duplicates in Excel?

**Answer:** Two approaches: (1) Data → Remove Duplicates — select which columns define a duplicate, click OK. (2) For review first: use `=COUNTIF($A$2:$A$500, A2)>1` to flag duplicates, add Conditional Formatting to highlight them, review manually, then decide what to remove. Always keep a backup before removing.

### Q2: What's the difference between IFERROR and IFNA?

**Answer:** `IFERROR` catches ALL error types (#N/A, #VALUE!, #REF!, #DIV/0!, #NAME?, #NUM!, #NULL!). `IFNA` only catches #N/A errors. Use IFNA for lookups (VLOOKUP/XLOOKUP) when you specifically want to handle "not found" but still want other errors to surface — they indicate formula bugs.

### Q3: How would you prevent incorrect data entry in a shared workbook?

**Answer:** Use Data Validation: dropdown lists for categorical fields (regions, departments), number ranges for quantities/percentages, date ranges for valid periods, custom formulas for complex rules (phone number format). Add Input Messages to guide users and Error Alerts to block invalid entries.

### Q4: What's the advantage of converting data to an Excel Table?

**Answer:** Tables auto-expand when you add rows (formulas, charts, pivot tables update automatically), provide structured references (`Table1[Revenue]` instead of `D2:D500`), include built-in filters, banded row formatting, and a toggle-able totals row. They're essential for dynamic dashboards.

### Q5: What's Conditional Formatting and when would you use it?

**Answer:** Conditional Formatting applies visual formatting (colors, bars, icons) based on cell values or formulas. Use it for: heatmaps (color scales on performance data), highlighting outliers (above/below thresholds), flagging duplicates, traffic-light status indicators on KPI dashboards, and data bars for quick visual comparison.
