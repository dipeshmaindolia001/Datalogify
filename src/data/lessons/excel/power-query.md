---
title: "Power Query — Automate Data Cleaning & Transformation"
description: "Import, clean, reshape, and merge data automatically with Power Query — the modern analyst's secret weapon."
category: "excel"
order: 202
phase: 3
tags: ["excel", "power-query", "etl", "data-transformation"]
publishedDate: 2025-03-27
prevSlug: "advanced-formulas"
nextSlug: "power-pivot-dax"
seoTitle: "Excel Power Query Tutorial | Datalogify"
seoDescription: "Master Power Query — import, clean, merge, unpivot, and automate data transformation in Excel."
---

## Why This Matters

Power Query is what real analysts use instead of manually cleaning data with formulas. You define your cleaning steps once, and Power Query replays them automatically every time the data refreshes. It's the difference between spending 2 hours cleaning a monthly report vs clicking one button.

## What Is Power Query?

Power Query is a **data transformation engine** built into Excel (Data → Get & Transform). Think of it as an ETL (Extract, Transform, Load) tool inside your spreadsheet.

**How it works:**
1. **Connect** to data (CSV, Excel files, databases, web pages, APIs)
2. **Transform** — clean, reshape, merge, filter (recorded as steps)
3. **Load** — output clean data to a worksheet or Data Model
4. **Refresh** — click "Refresh" and all steps replay on new data

## Opening Power Query

**Path:** Data tab → Get Data (or Get & Transform section)

Common sources:
- **From File** → CSV, Excel workbook, Text, JSON
- **From Database** → SQL Server, MySQL, PostgreSQL
- **From Web** → scrape HTML tables from websites
- **From Table/Range** → transform data already in your workbook

## The Power Query Editor Interface

When you load data into Power Query, the Editor opens:

| Panel | What It Does |
|---|---|
| **Query Settings** (right) | Shows query name and Applied Steps |
| **Preview** (center) | Shows your data with transformations applied |
| **Formula Bar** (top) | Shows the M code for the current step |
| **Ribbon** (top) | Transform, Add Column, View, Home tabs |

**Applied Steps** = your recorded transformation recipe. Each step you do (remove column, change type, filter rows) gets added to this list. You can:
- Click any step to see the data at that point
- Delete a step to undo it
- Reorder steps by dragging
- Edit a step's settings

## Core Transformations

### Remove Columns

Right-click column header → Remove (or select multiple → Remove Columns button).

**Better approach:** Right-click → "Remove Other Columns" — keeps only the columns you selected. This is safer because if new columns appear in the source data, they're automatically excluded.

### Change Data Types

Power Query auto-detects types, but often gets them wrong. Fix them:

Click the icon next to the column header (ABC = text, 123 = number, 📅 = date):
- Whole Number
- Decimal Number
- Text
- Date
- Date/Time
- True/False

Or: Transform → Data Type dropdown

### Filter Rows

Click the dropdown arrow on any column header:
- Uncheck values to exclude them
- Text Filters → Contains, Starts With, Does Not Contain
- Number Filters → Greater Than, Between
- Date Filters → After, Before, Between, Last N Days

### Remove Duplicates

Right-click column → Remove Duplicates

Or select multiple columns → Home → Remove Rows → Remove Duplicates

### Split Columns

Transform → Split Column → By Delimiter (comma, space, dash, custom)

**Example:** "John Smith" → "John" | "Smith"

### Replace Values

Right-click column → Replace Values
- Replace "N/A" with null
- Replace "Y" with "Yes"
- Replace errors with null

### Add Custom Columns

Add Column → Custom Column:

```
= [Revenue] - [Cost]
```

```
= if [Revenue] > 50000 then "High" else "Standard"
```

```
= Text.Upper([Region])
```

### Trim & Clean Text

Transform → Format → Trim (removes leading/trailing spaces), Clean (removes non-printable characters), UPPER/LOWER/Capitalize.

## Merge Queries (= SQL JOIN)

This is Power Query's killer feature. It lets you JOIN tables without VLOOKUP.

**Steps:**
1. Home → Merge Queries
2. Select the primary table
3. Select the matching column (click it in both tables)
4. Select the lookup table
5. Choose join type:

| Join Kind | SQL Equivalent | What It Returns |
|---|---|---|
| Left Outer | LEFT JOIN | All rows from left + matches from right |
| Right Outer | RIGHT JOIN | All rows from right + matches from left |
| Full Outer | FULL JOIN | All rows from both |
| Inner | INNER JOIN | Only matching rows |
| Left Anti | NOT IN / LEFT JOIN WHERE IS NULL | Rows in left with NO match in right |
| Right Anti | NOT IN reversed | Rows in right with NO match in left |

6. Click OK → A new column appears containing a Table
7. Click the expand icon → select which columns to bring in
8. Uncheck "Use original column name as prefix" for cleaner names

## Append Queries (= SQL UNION)

Combine rows from multiple tables with the same structure.

Home → Append Queries → Select tables to stack on top of each other.

**Use case:** You get monthly data in separate files (Jan.xlsx, Feb.xlsx, Mar.xlsx). Append them all into one consolidated table.

### Append from Folder (Power Move)

Data → Get Data → From File → From Folder → Select the folder

Power Query automatically imports ALL files in that folder and appends them. When you add a new file next month, just click Refresh.

## Group By (= SQL GROUP BY)

Transform → Group By:

| Column | Operation | New Column Name |
|---|---|---|
| Region | Sum | Total Revenue |
| Region | Count | Transaction Count |
| Region | Average | Avg Revenue |

Advanced: Group by multiple columns (Region + Product), add multiple aggregations.

## Unpivot Columns (Wide → Long Format)

**Before (wide):**

| Product | Jan | Feb | Mar |
|---|---|---|---|
| Widget A | 50000 | 45000 | 55000 |
| Widget B | 35000 | 38000 | 40000 |

**After unpivot:**

| Product | Month | Revenue |
|---|---|---|
| Widget A | Jan | 50000 |
| Widget A | Feb | 45000 |
| Widget A | Mar | 55000 |
| Widget B | Jan | 35000 |
| Widget B | Feb | 38000 |
| Widget B | Mar | 40000 |

**Steps:**
1. Select the columns you DON'T want to unpivot (Product)
2. Transform → Unpivot Other Columns

This is incredibly useful. Many real-world reports come in wide format but analysis needs long format.

## Pivot Columns (Long → Wide)

The reverse of Unpivot. Transform → Pivot Column → select the values column and aggregation.

## Loading Options

When you're done transforming, Close & Load:

| Option | Best For |
|---|---|
| Close & Load (Table) | You want the clean data on a worksheet |
| Close & Load To → Connection Only | You're feeding a pivot table or Power Pivot (no worksheet needed) |
| Close & Load To → Data Model | You're building a multi-table model |

## Refresh Workflow

1. Source data changes (new CSV, updated database)
2. Click **Refresh All** (Data tab) or right-click query → Refresh
3. All transformation steps replay automatically
4. Clean data appears in your worksheet
5. Pivot tables/charts linked to this data also refresh

**Schedule refresh:** If connected to SharePoint/OneDrive, you can set up automatic daily/hourly refresh.

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- "We get a messy CSV export from the CRM every Monday. Can you automate the cleaning?" → Power Query
- Combining monthly sales files from 12 Excel workbooks → Append from Folder
- Replacing VLOOKUP chains with Merge Queries (faster, cleaner, auto-refreshing)
- Building ETL pipelines that non-technical colleagues can refresh with one click
- Converting cross-tab reports (wide format) to database-friendly long format

</div>

<div class="challenge">

**Mini-Challenge:** You receive monthly sales reports as separate CSVs with messy data:

1. Import one CSV into Power Query
2. Remove unnecessary columns (keep only: Date, Region, Product, Revenue)
3. Change data types (Date to date, Revenue to decimal)
4. Replace blank regions with "Unknown"
5. Trim whitespace from the Product column
6. Remove rows where Revenue ≤ 0
7. Add a custom column: Month-Year = `Text.From(Date.Month([Date])) & "-" & Text.From(Date.Year([Date]))`
8. Group by Region to get Total Revenue per region
9. Load to a worksheet
10. Then set up Append from Folder so future monthly files load automatically

</div>

## Common Interview Questions

### Q1: What is Power Query and how is it different from formulas?

**Answer:** Power Query is a data transformation engine in Excel that imports, cleans, and reshapes data through a series of recorded steps. Unlike formulas (which operate cell-by-cell on worksheet data), Power Query works on the data source before it reaches the worksheet, handles millions of rows, and replays all transformations automatically on refresh. It's Excel's ETL tool.

### Q2: How do you combine data from multiple Excel files?

**Answer:** Use Power Query's "Get Data → From File → From Folder." Select the folder containing all files, Power Query imports and appends them automatically. Alternatively, use "Append Queries" to stack individual tables. This replaces manually copying and pasting from multiple workbooks.

### Q3: What's the difference between Merge and Append in Power Query?

**Answer:** Merge = SQL JOIN. Combines columns from two tables based on a matching key (like VLOOKUP but better). Append = SQL UNION. Stacks rows from multiple tables on top of each other (same columns, more rows). Merge adds width; Append adds height.

### Q4: What is Unpivot and when would you use it?

**Answer:** Unpivot converts wide-format data (months as columns: Jan, Feb, Mar) into long-format data (one Month column, one Value column). Long format is needed for pivot tables, charts, database imports, and most analysis tools. It's the opposite of a Pivot Table — it normalizes cross-tab reports into a clean structure.

### Q5: How do you handle errors in Power Query?

**Answer:** Right-click a column → Replace Errors (replace with null or a default value). Or use Transform → Replace Errors. For row-level filtering: Home → Remove Rows → Remove Errors. In custom columns, use `try [Column] otherwise null` syntax in M code to handle errors gracefully.
