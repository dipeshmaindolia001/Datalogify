---
title: "Text Functions — Clean, Split & Transform Data"
description: "Clean messy data with LEFT, RIGHT, MID, TRIM, SUBSTITUTE, TEXTJOIN, Text-to-Columns, and Flash Fill."
category: "excel"
order: 4
phase: 3
tags: ["excel", "text-functions", "data-cleaning", "trim"]
publishedDate: 2025-03-18
prevSlug: "conditional-functions"
nextSlug: "date-time-functions"
seoTitle: "Excel Text Functions for Data Cleaning | Datalogify"
seoDescription: "Master Excel text functions — LEFT, RIGHT, MID, TRIM, SUBSTITUTE, CONCATENATE, TEXTJOIN, Flash Fill."
---

## Why This Matters

Real-world data is messy. Names come in as "SMITH, JOHN   " with trailing spaces. Phone numbers arrive as "(555) 123-4567" when you need "5551234567." Product codes are buried inside long strings. Text functions are how you clean, split, and reshape data before any analysis can happen.

## Extracting Parts of Text — LEFT, RIGHT, MID

### LEFT — Pull Characters from the Start

**Syntax:** `=LEFT(text, num_chars)`

| | A | B |
|---|---|---|
| **1** | Employee ID | Department Code |
| **2** | ENG-4521 | |
| **3** | MKT-8834 | |
| **4** | FIN-2209 | |
| **5** | OPS-1167 | |

```text
' Extract the 3-letter department code:
=LEFT(A2, 3)
```

```text
B2: ENG
B3: MKT
B4: FIN
B5: OPS
```

### RIGHT — Pull Characters from the End

**Syntax:** `=RIGHT(text, num_chars)`

```text
' Extract the 4-digit employee number:
=RIGHT(A2, 4)
```

```text
B2: 4521
B3: 8834
B4: 2209
B5: 1167
```

**Watch out:** RIGHT returns text, not a number. If you need to do math with the result, wrap it in `VALUE()`: `=VALUE(RIGHT(A2, 4))`.

### MID — Pull Characters from Anywhere

**Syntax:** `=MID(text, start_position, num_chars)`

| | A |
|---|---|
| **1** | Invoice Number |
| **2** | INV-2025-03-00142 |
| **3** | INV-2025-01-00089 |
| **4** | INV-2024-12-00567 |

```text
' Extract the year (starts at position 5, 4 characters long):
=MID(A2, 5, 4)

' Extract the month (starts at position 10, 2 characters long):
=MID(A2, 10, 2)
```

```text
Year: 2025, 2025, 2024
Month: 03, 01, 12
```

### LEN — Count Characters

**Syntax:** `=LEN(text)`

```text
' Check length of each ID:
=LEN(A2)
```

```text
LEN("ENG-4521") → 8
LEN("INV-2025-03-00142") → 18
```

**Pro tip:** Use LEN to find trailing spaces. If `LEN(A2)` is 10 but the visible text is 8 characters, there are 2 hidden spaces.

## Cleaning Text — TRIM, UPPER, LOWER, PROPER

### TRIM — Remove Extra Spaces

The most-used cleaning function. Removes leading spaces, trailing spaces, and reduces multiple internal spaces to one.

| | A | B |
|---|---|---|
| **1** | Raw Name | Cleaned |
| **2** | &nbsp;&nbsp;&nbsp;John Smith&nbsp;&nbsp;&nbsp; | |
| **3** | Sarah&nbsp;&nbsp;&nbsp;&nbsp;Chen | |
| **4** | &nbsp;&nbsp;Mike&nbsp;&nbsp;Patel&nbsp;&nbsp; | |

```text
=TRIM(A2)
```

```text
B2: "John Smith"      (leading/trailing spaces removed)
B3: "Sarah Chen"      (extra internal spaces collapsed)
B4: "Mike Patel"      (all cleaned up)
```

<div class="interview-tip">

**Interview Tip:** TRIM is the first thing you should do with imported data. Trailing spaces are invisible but cause VLOOKUP failures, COUNTIF mismatches, and join errors. When an interviewer's VLOOKUP doesn't work, say "I'd check for trailing spaces with LEN and clean with TRIM."

</div>

### UPPER, LOWER, PROPER — Change Case

```text
=UPPER("john smith")     ' → "JOHN SMITH"
=LOWER("JOHN SMITH")     ' → "john smith"
=PROPER("john smith")    ' → "John Smith"
```

**Real use case:** Standardizing data before comparison. "East" and "east" and "EAST" are three different values to VLOOKUP.

```text
' Normalize region names for consistent lookups:
=UPPER(TRIM(A2))
```

```text
"  east  " → "EAST"
"East"     → "EAST"
"EAST"     → "EAST"
```

## Combining Text — CONCATENATE, & Operator, TEXTJOIN

### The & Operator (Preferred)

The fastest way to combine text:

| | A | B | C |
|---|---|---|---|
| **1** | First Name | Last Name | Full Name |
| **2** | John | Smith | |
| **3** | Sarah | Chen | |

```text
' Combine first and last name:
=A2&" "&B2
```

```text
C2: John Smith
C3: Sarah Chen
```

### CONCATENATE (Legacy)

Does the same thing, just longer syntax:

```text
=CONCATENATE(A2, " ", B2)
```

```text
C2: John Smith
```

Use `&` instead — it's shorter and more flexible.

### TEXTJOIN — Join with a Delimiter (Excel 2019+/365)

**Syntax:** `=TEXTJOIN(delimiter, ignore_empty, text1, text2, ...)`

This is powerful because it handles delimiters and empty cells automatically.

| | A | B | C | D |
|---|---|---|---|---|
| **1** | City | State | Zip | Full Address |
| **2** | Austin | TX | 78701 | |
| **3** | Portland | OR | | |

```text
' Join with comma-space, ignoring blanks:
=TEXTJOIN(", ", TRUE, A2, B2, C2)
```

```text
D2: Austin, TX, 78701
D3: Portland, OR           (blank zip skipped — no trailing comma)
```

Without TEXTJOIN, handling blank fields requires ugly nested IF statements.

## Finding and Replacing Within Text — SUBSTITUTE, FIND, SEARCH

### SUBSTITUTE — Replace Text

**Syntax:** `=SUBSTITUTE(text, old_text, new_text, [instance_num])`

```text
' Clean phone numbers — remove parentheses, dashes, spaces:
=SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(A2, "(", ""), ")", ""), "-", ""), " ", "")
```

| | A | B |
|---|---|---|
| **1** | Raw Phone | Cleaned |
| **2** | (555) 123-4567 | 5551234567 |
| **3** | 555-987-6543 | 5559876543 |

```text
' Replace specific instance (4th argument):
=SUBSTITUTE("2025-01-01-backup", "-", "/", 1)
```

```text
Result: "2025/01-01-backup"  (only first dash replaced)
```

### FIND vs SEARCH

Both locate text within a string. The difference:

| Function | Case Sensitive | Wildcards |
|---|---|---|
| `FIND` | Yes | No |
| `SEARCH` | No | Yes (* and ?) |

```text
' Find the position of "@" in an email:
=FIND("@", "john.smith@company.com")
```

```text
Result: 11  (the @ is at position 11)
```

```text
' Extract domain from email (everything after @):
=MID(A2, FIND("@", A2)+1, LEN(A2))
```

```text
"john.smith@company.com" → "company.com"
```

### Splitting "Last, First" into Separate Columns

This is a classic data cleaning task. Exported data often comes as "SMITH, JOHN":

| | A |
|---|---|
| **1** | Full Name |
| **2** | SMITH, JOHN |
| **3** | CHEN, SARAH |
| **4** | PATEL, MIKE |

```text
' Extract Last Name (everything before the comma):
=LEFT(A2, FIND(",", A2)-1)

' Extract First Name (everything after the comma and space):
=MID(A2, FIND(",", A2)+2, LEN(A2))

' Clean it up with PROPER case:
=PROPER(MID(A2, FIND(",", A2)+2, LEN(A2)))
```

```text
Last Name:  SMITH     CHEN     PATEL
First Name: JOHN      SARAH    MIKE
Proper:     John      Sarah    Mike
```

## TEXT — Format Numbers as Strings

**Syntax:** `=TEXT(value, format_code)`

Converts numbers to formatted text. Essential for building dynamic labels and reports.

```text
=TEXT(45000, "$#,##0")           ' → "$45,000"
=TEXT(0.085, "0.0%")             ' → "8.5%"
=TEXT(45731, "MM/DD/YYYY")       ' → "03/15/2025"
=TEXT(45731, "MMMM YYYY")        ' → "March 2025"
=TEXT(45731, "DDD")              ' → "Sat"
```

### Building Dynamic Report Headers

```text
' Dynamic header that updates automatically:
="Sales Report — "&TEXT(TODAY(), "MMMM DD, YYYY")
```

```text
Result: "Sales Report — March 15, 2025"
```

```text
' Summary sentence with formatted numbers:
="Total revenue: "&TEXT(SUM(D2:D100), "$#,##0")&" across "&TEXT(COUNTA(A2:A100), "#,##0")&" transactions"
```

```text
Result: "Total revenue: $64,750 across 10 transactions"
```

## Text-to-Columns — Split Data Without Formulas

When you have data like "Austin, TX, 78701" and need it in three separate columns, Text-to-Columns is faster than formulas.

**Steps:**
1. Select the column with combined data
2. Go to **Data tab → Text to Columns**
3. Choose **Delimited** (split by a character) or **Fixed width** (split by position)
4. Select your delimiter (comma, tab, space, semicolon, or custom)
5. Set data format for each column (General, Text, Date)
6. Click **Finish**

```text
Before:                          After:
A                                A         B      C
Austin, TX, 78701     →         Austin    TX     78701
Portland, OR, 97201             Portland  OR     97201
Denver, CO, 80201               Denver    CO     80201
```

**Warning:** Text-to-Columns overwrites data in adjacent columns. Always check that the columns to the right are empty before running it.

## Flash Fill — Excel's Pattern Recognition (Ctrl+E)

Flash Fill watches what you type and figures out the pattern. It works like magic for simple transformations.

### Example: Extracting First Names

| | A | B |
|---|---|---|
| **1** | Full Name | First Name |
| **2** | John Smith | John |
| **3** | Sarah Chen | |
| **4** | Mike Patel | |

1. Type "John" in B2 (the first example)
2. Move to B3 and press `Ctrl+E`
3. Excel fills the rest automatically

```text
B2: John
B3: Sarah    ← Flash Fill figured it out
B4: Mike     ← Pattern applied
```

### Flash Fill Works for Complex Patterns Too

| | A | B | C |
|---|---|---|---|
| **1** | Email | Username | Domain |
| **2** | john.smith@company.com | john.smith | company.com |
| **3** | sarah.chen@startup.io | | |

Type the first example, go to the next row, press `Ctrl+E`:

```text
B3: sarah.chen    ← Flash Fill extracted username
C3: startup.io    ← Flash Fill extracted domain (do C column separately)
```

**Limitation:** Flash Fill creates static values, not formulas. If the source data changes, Flash Fill results won't update. Use formulas when you need dynamic results.

<div class="interview-tip">

**Interview Tip:** Real analyst work is 60-80% data cleaning. When asked "how do you handle messy data in Excel?" — walk through your process: "First TRIM to remove spaces, then standardize case with UPPER or PROPER, split combined fields with Text-to-Columns or LEFT/MID/RIGHT, and validate with LEN checks. For one-off cleanup, Flash Fill is fastest."

</div>

## Where This Gets Used on the Job

- **CRM data cleanup:** Names in "LAST, FIRST" format need splitting and proper casing
- **Importing vendor data:** Phone numbers, addresses, product codes in inconsistent formats
- **Building report labels:** TEXT() to format numbers as "$1.2M" for executive dashboards
- **Email list processing:** Extracting domains, standardizing formats before mail merges
- **Preparing data for database import:** Consistent formatting required before loading

<div class="challenge">

**Challenge: Clean a Messy Employee Export**

You received this data from an old HR system. Clean it up:

| Raw Data |
|---|
| &nbsp;&nbsp;SMITH, JOHN&nbsp;&nbsp;&nbsp; |
| CHEN,SARAH |
| &nbsp;&nbsp;PATEL,&nbsp;&nbsp;MIKE&nbsp; |
| WILSON, LISA&nbsp;&nbsp; |
| &nbsp;GARCIA, TOM |

Create a clean sheet with these columns:
1. **First Name** — Proper case, no spaces (John, Sarah, Mike, Lisa, Tom)
2. **Last Name** — Proper case, no spaces (Smith, Chen, Patel, Wilson, Garcia)
3. **Email** — firstname.lastname@company.com format (john.smith@company.com)
4. **Employee ID** — Format: first 2 letters of last name (uppercase) + "-" + row number with leading zeros (SM-001, CH-002, etc.)

**Hints:** Use TRIM, FIND, LEFT, MID, PROPER, LOWER, UPPER, & operator, and TEXT with "000" format code.

</div>

## Common Interview Questions

### Q1: How do you remove leading and trailing spaces from text in Excel?

**Answer:** Use `=TRIM(A2)`. TRIM removes leading spaces, trailing spaces, and collapses multiple internal spaces to a single space. It's the first function I apply to any imported data because invisible spaces cause VLOOKUP failures, COUNTIF mismatches, and incorrect joins. I also check for non-breaking spaces (char 160) which TRIM doesn't remove — use `=SUBSTITUTE(A2, CHAR(160), " ")` first, then TRIM.

### Q2: What's the difference between FIND and SEARCH?

**Answer:** FIND is case-sensitive and doesn't support wildcards. SEARCH is case-insensitive and supports `*` and `?` wildcards. Both return the position of a substring within text. I use FIND when exact case matching matters (like searching for "ID" without matching "idea"), and SEARCH for general text lookups where case doesn't matter.

### Q3: How would you extract the domain name from a list of email addresses?

**Answer:** `=MID(A2, FIND("@", A2)+1, LEN(A2))`. This finds the position of "@", starts one character after it, and pulls everything to the end. For "john@company.com", FIND returns 5, so MID starts at position 6 and extracts "company.com". In Excel 365, you could also use `=TEXTAFTER(A2, "@")`.

### Q4: What is Flash Fill and when would you use it?

**Answer:** Flash Fill (`Ctrl+E`) is Excel's pattern recognition feature. You type one or two examples of the transformation you want, and Excel figures out the pattern and fills the rest. I use it for quick one-off transformations like extracting first names, reformatting phone numbers, or building email addresses. The limitation is that it creates static values — if the source data changes, Flash Fill results don't update. For dynamic results, I use formulas instead.

### Q5: How do you combine text from multiple cells, and what's the best approach?

**Answer:** Three methods: the `&` operator (`=A2&" "&B2`), CONCATENATE (`=CONCATENATE(A2, " ", B2)`), or TEXTJOIN (`=TEXTJOIN(", ", TRUE, A2, B2, C2)`). I prefer `&` for simple joins — it's concise and flexible. For joining many cells with a delimiter, TEXTJOIN is best because it handles delimiters automatically and can skip blank cells with the `TRUE` argument. CONCATENATE is legacy — I only use it for compatibility with older Excel versions.
