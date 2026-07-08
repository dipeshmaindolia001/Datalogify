---
title: "Core Formulas & Operators — SUM, AVERAGE, COUNT & More"
description: "Master arithmetic operators, comparison operators, PEMDAS, and essential aggregate functions — SUM, AVERAGE, MAX, MIN, COUNT, COUNTA, COUNTBLANK."
category: "excel"
order: 2
phase: 3
tags: ["excel", "formulas", "sum", "average", "count"]
publishedDate: 2025-03-16
prevSlug: "fundamentals"
nextSlug: "conditional-functions"
seoTitle: "Excel Formulas Tutorial — SUM, AVERAGE, COUNT | Datalogify"
seoDescription: "Learn Excel arithmetic, comparison operators, PEMDAS, and aggregate functions with business analytics examples."
---

## Introduction & The "Why"

In our previous lesson, we explored the anatomy of Excel and how coordinates are mapped. Now, we are ready to write formulas. Excel is not a passive database or a static document editor; it is a calculation engine. Without formulas, it is just a digital paper grid. 

To make sense of business operations, you must summarize and query data. If your company processes 10,000 sales transactions a day, no executive wants to scroll through 10,000 rows of raw data. They need summaries:
- What was our total revenue today?
- What was our average transaction value?
- How many items did we sell?
- Who was our highest-performing salesperson?

### The Metaphor: The Team Captain

To understand aggregate functions in Excel, use the analogy of a **Team Captain**. 

Imagine a classroom filled with 30 students. The school principal walks in and asks, *"How did this class perform on the standardized math test?"* 

The principal does not want to stand there and listen to 30 individual grades read aloud. That is overwhelming and useless. Instead, the principal wants a single person—the **Team Captain**—to stand up and report a summary score for the entire group:

```text
Classroom (Data Range: A1:A30)
   ├── Principal: "Give me the summary!"
   └── Team Captain (Aggregate Function):
          ├── "The total class score is 2,400 points."     ← `=SUM(A1:A30)`
          ├── "The class average was 80%."                 ← `=AVERAGE(A1:A30)`
          ├── "The highest score was 100%."                ← `=MAX(A1:A30)`
          ├── "The lowest score was 55%."                  ← `=MIN(A1:A30)`
          └── "Exactly 30 students took this test."         ← `=COUNT(A1:A30)`
```

In Excel, functions like `SUM`, `AVERAGE`, `COUNT`, `MAX`, and `MIN` are your Team Captains. They take a large range of individual data points and aggregate them into a single, understandable metric.

---

## Step-by-Step Concept Breakdown

Before we can use aggregate functions, we must understand the core operators that make up formulas and the strict mathematical rules Excel uses to compute values.

### 1. Arithmetic Operators

Arithmetic operators are the mathematical building blocks of Excel. Every formula must start with an equals sign (`=`). If you type `10 + 5` into a cell, Excel treats it as text and displays `10 + 5`. But if you type `=10+5`, Excel activates its calculation engine and displays `15`.

Here is the list of arithmetic operators in Excel:

| Operator | Operation | Mathematical Example | Excel Formula | Evaluated Result |
| :--- | :--- | :--- | :--- | :--- |
| `+` | Addition | $10 + 5$ | `=10+5` | `15` |
| `-` | Subtraction | $10 - 5$ | `=10-5` | `5` |
| `*` | Multiplication | $10 \times 5$ | `=10*5` | `50` |
| `/` | Division | $10 \div 5$ | `=10/5` | `2` |
| `^` | Exponentiation | $10^2$ | `=10^2` | `100` |
| `%` | Percentage | $50\% \text{ (or } 0.5\text{)}$ | `=50%` | `0.5` |

> [!TIP]
> The percent operator (`%`) is a fast way to write decimals. Typing `=B2*15%` is identical to typing `=B2*0.15`. It saves keystrokes and makes your formulas much easier to read for non-technical stakeholders.

### 2. Comparison Operators

Comparison operators compare two values and return a logical value: either `TRUE` or `FALSE` (known as Boolean values). These are critical when building conditional logic in your analysis.

| Operator | Comparison | Example | Result |
| :--- | :--- | :--- | :--- |
| `=` | Equal to | `=10=10` | `TRUE` |
| `>` | Greater than | `=10>5` | `TRUE` |
| `<` | Less than | `=10<5` | `FALSE` |
| `>=` | Greater than or equal to | `=10>=10` | `TRUE` |
| `<=` | Less than or equal to | `=5<=3` | `FALSE` |
| `<>` | Not equal to | `=10<>5` | `TRUE` |

*Note on `<>` (Not equal to):* Think of this as the "less than" and "greater than" signs facing away from each other. It translates to: *"is this value not equal to that value?"* For instance, `=A2<>"Closed"` returns `TRUE` if cell `A2` contains `"Active"` or `"Pending"`.

---

## PEMDAS — Order of Operations

Excel follows standard algebraic precedence rules. If you write a formula containing multiple operators, Excel does not calculate them from left to right. Instead, it evaluates them in the order of **PEMDAS**:

1. **P**arentheses `()`
2. **E**xponents `^`
3. **M**ultiplication `*` and **D**ivision `/` (evaluated left to right)
4. **A**ddition `+` and **S**ubtraction `-` (evaluated left to right)

### Tricky Math Examples That Beginners Get Wrong

Getting the order of operations wrong is the most dangerous error an analyst can make. It does not trigger an error code like `#VALUE!`. Instead, Excel returns a valid number that is **mathematically incorrect**. You might report a 90% profit margin to your boss when the actual margin is 20%.

Let’s dissect three common formulas where PEMDAS trips people up:

#### Case A: Profit Margin Calculation
You want to calculate profit margin. Your revenue is `$100` and your cost is `$20`. 
*Mathematical definition: (Revenue - Cost) / Revenue*

```excel
' The Wrong Way:
=100-20/100
```
- **How Excel evaluates it:** Under PEMDAS, division happens before subtraction. Excel calculates `20 / 100 = 0.2` first. Then it subtracts `0.2` from `100` to get **`99.8`**. This represents a 9,980% margin!
- **The Correct Way:** Wrap the subtraction in parentheses to force it to calculate first.
  ```excel
  =(100-20)/100
  ```
  Excel calculates `(100 - 20) = 80` first, then divides `80 / 100` to get **`0.8`** (which formats as a correct 80% profit margin).

#### Case B: Compound Interest
You want to calculate compound interest on a principal of `$1000` at a `5%` rate for `2` years.
*Mathematical definition: Principal * (1 + Rate)^Years*

```excel
' The Wrong Way:
=1000*1+0.05^2
```
- **How Excel evaluates it:** 
  1. Exponent first: `0.05^2` = `0.0025`
  2. Multiplication next: `1000 * 1` = `1000`
  3. Addition last: `1000 + 0.0025` = **`1000.0025`**
- **The Correct Way:** Use parentheses to isolate the growth rate base.
  ```excel
  =1000*(1+0.05)^2
  ```
  Excel calculates `(1 + 0.05) = 1.05` first. Then it applies the exponent: `1.05^2` = `1.1025`. Finally, it multiplies by the principal: `1000 * 1.1025` = **`1102.50`**.

---

## Detailed Comparison of COUNT, COUNTA, and COUNTBLANK

Counting cells is a common data validation step. Beginners often get confused about which counting function to use. Here is the definitive guide:

| Function | What it Counts | What it Ignores | Typical Use Case |
| :--- | :--- | :--- | :--- |
| **`COUNT`** | Cells containing **numeric values** only (including dates, decimals, and percentages). | Text strings, blank cells, logical booleans, and error codes. | Counting actual completed financial transactions. |
| **`COUNTA`** | Cells that are **not empty**. This includes numbers, text, formulas that return blank spaces, booleans, and errors. | Truly empty cells. | Counting the total number of entries in a customer database. |
| **`COUNTBLANK`** | Cells that are **empty** or return an empty string `""` from a formula. | Cells containing text, numbers, or spaces. | Finding missing information in a dataset (e.g., missing phone numbers). |

---

## Code / Practical Walkthroughs

Let’s apply these concepts to real business sales data. We will work with the following dataset containing sales registrations.

### Master Dataset: Q1 Sales Registrations

| | A | B | C | D |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Rep Name** | **Region** | **Revenue** | **Units Sold** |
| **2** | Sarah Chen | West | 125000 | 250 |
| **3** | Mike Patel | East | 89000 | 178 |
| **4** | Lisa Nguyen | West | 156000 | 312 |
| **5** | James Wilson | South | 0 | 0 |
| **6** | Amy Rodriguez | East | 143000 | 286 |
| **7** | | North | (blank) | (blank) |
| **8** | Dave Kim | East | 95000 | 190 |
| **9** | "Pending" | West | (blank) | (blank) |

---

### Walkthrough 1: Basic Revenue and Performance Metrics

Let's write a summary card to calculate total revenue, average deal size, maximum deal size, and minimum deal size from the dataset above.

#### Example Data Table
We reference the revenue values in range `C2:C9`.

#### Formulas

```excel
' 1. Calculate Total Revenue:
=SUM(C2:C9)

' 2. Calculate Average Revenue per Rep:
=AVERAGE(C2:C9)

' 3. Identify the Highest Sales Revenue:
=MAX(C2:C9)

' 4. Identify the Lowest Sales Revenue:
=MIN(C2:C9)
```

#### Tracing Excel’s Calculations

1. **`SUM(C2:C9)`**:
   - Excel looks at: `125000 + 89000 + 156000 + 0 + 143000 + (blank) + 95000 + (blank)`.
   - The blank cells are ignored. The zero value is added but doesn't change the sum.
   - *Result:* `608,000`

2. **`AVERAGE(C2:C9)`**:
   - Excel ignores the blanks (rows 7 and 9). The active range of values evaluated contains 6 cells: `{125000, 89000, 156000, 0, 143000, 95000}`.
   - Sum = `608,000`. Count of cells with numbers = `6` (the `0` in cell C5 is a number!).
   - Calculation: `608,000 / 6`.
   - *Result:* `101,333.33`
   - *Warning:* If row 5 had been blank instead of `0`, Excel would divide by `5` instead of `6`, returning `121,600`. This is the blank vs. zero trap!

3. **`MAX(C2:C9)`**:
   - Scans the set `{125000, 89000, 156000, 0, 143000, 95000}`.
   - *Result:* `156,000`

4. **`MIN(C2:C9)`**:
   - Scans the set `{125000, 89000, 156000, 0, 143000, 95000}`.
   - *Result:* `0` (Since row 5 contains `0`, it is evaluated as the minimum value. If row 5 was blank, the minimum would be `89,000`).

```text
# Output:
Total Revenue:        608000
Average Revenue:      101333.33
Maximum Revenue:      156000
Minimum Revenue:      0
```

---

### Walkthrough 2: Database Integrity Audit (COUNT, COUNTA, COUNTBLANK)

You are tasked with auditing the database above to identify missing information. We want to know:
- How many sales reps are registered (Column A)?
- How many numeric revenue inputs exist (Column C)?
- How many missing entries are in Column C?

#### Example Data Table
We reference the active data range `Row 2` to `Row 9` (8 total records).

#### Formulas

```excel
' 1. Count the number of sales rep names registered:
=COUNTA(A2:A9)

' 2. Count the number of numeric revenue rows:
=COUNT(C2:C9)

' 3. Count the number of blank revenue rows:
=COUNTBLANK(C2:C9)
```

#### Tracing Excel’s Calculations

1. **`COUNTA(A2:A9)`**:
   - Evaluates Column A:
     - `A2` ("Sarah Chen") = Has value (1)
     - `A3` ("Mike Patel") = Has value (2)
     - `A4` ("Lisa Nguyen") = Has value (3)
     - `A5` ("James Wilson") = Has value (4)
     - `A6` ("Amy Rodriguez") = Has value (5)
     - `A7` (blank) = Ignored (5)
     - `A8` ("Dave Kim") = Has value (6)
     - `A9` ("Pending") = Has value (7)
   - *Result:* `7` (Note that it counted the text `"Pending"` as a registered entry).

2. **`COUNT(C2:C9)`**:
   - Evaluates Column C:
     - `C2` (`125000`) = Numeric (1)
     - `C3` (`89000`) = Numeric (2)
     - `C4` (`156000`) = Numeric (3)
     - `C5` (`0`) = Numeric (4)
     - `C6` (`143000`) = Numeric (5)
     - `C7` (blank) = Ignored (5)
     - `C8` (`95000`) = Numeric (6)
     - `C9` (blank) = Ignored (6)
   - *Result:* `6`

3. **`COUNTBLANK(C2:C9)`**:
   - Evaluates Column C:
     - Finds empty cells in `C7` and `C9`.
   - *Result:* `2`

```text
# Output:
Reps Registered:      7
Revenue Entries:      6
Missing Revenues:     2
```

---

### Walkthrough 3: Price per Unit and Margin Calculations

Let's calculate the price per unit for individual reps and verify performance against target pricing using comparison operators.

#### Example Data Table
We reference the revenue values in Column C and Units Sold in Column D.

#### Formulas

```excel
' In Cell E2, calculate Average Price Per Unit for Sarah Chen:
=C2/D2

' In Cell F2, check if the average unit price is greater than or equal to target price of $490:
=E2>=490
```

#### Tracing Excel’s Calculations

1. **Sarah Chen (Row 2):**
   - E2: `=C2/D2` → `125000 / 250` = `500`
   - F2: `=E2>=490` → `500 >= 490` = `TRUE`
2. **Mike Patel (Row 3):**
   - E3: `=C3/D3` → `89000 / 178` = `500`
   - F3: `=E3>=490` → `500 >= 490` = `TRUE`
3. **James Wilson (Row 5):**
   - E5: `=C5/D5` → `0 / 0` = `#DIV/0!` error!
   - F5: `=E5>=490` → `#DIV/0! >= 490` = `#DIV/0!` error propagation!

To fix Row 5's division error, we would modify cell E5 to handle division by zero (which we will cover using conditional functions in the next lesson).

```text
# Output:
[E2:F3]
E2: 500       F2: TRUE
E3: 500       F3: TRUE
```

---

## Edge Cases & Common Mistakes

Even simple arithmetic can go wrong in complex worksheets. Here are the primary edge cases to look out for.

### 1. The SUM Silent Text-Ignore Bug
If you use the plus operator to add cells: `=A2+B2`, and cell `B2` contains text like `"NA"`, Excel will return a `#VALUE!` error.
However, if you write `=SUM(A2:B2)`, and cell `B2` contains text, **Excel will ignore the text and calculate the sum using only the numeric cells.**
- While this prevents formulas from breaking, it is dangerous. If you import numbers formatted as text, `=SUM()` will silently return a value that is missing data. 
- **Audit Step:** Always check your row counts with `COUNT` vs `COUNTA` to ensure you aren't summing ranges containing text-formatted numbers.

### 2. Space vs. Blank
A cell that looks blank on your screen might actually contain a single space character (`" "`).
- `COUNTA` will evaluate this cell as containing a value, so it will count it.
- `COUNTBLANK` will **not** count this cell as blank in older Excel versions, or it will count it as empty in newer versions, but it can skew logical formulas.
- **Fix:** If your counting formulas are returning incorrect results, select the column, press `Ctrl + H` (Find & Replace), type a single space in the "Find what" box, leave the "Replace with" box completely empty, and click "Replace All."

---

## Practice Exercises & Mini-Projects

### Exercise 1: Building a Web Marketing Performance Sheet
You are a digital marketing analyst. You have a table tracking traffic and sales from different ad campaigns:

| Campaign | Clicks | Purchases | Conversion Rate | Cost | Revenue | ROI |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Search Ads | 15000 | 450 | | 5000 | 12500 | |
| Social Ads | 22000 | 330 | | 8000 | 9500 | |
| Email Promo | 8000 | 240 | | 1200 | 6000 | |
| Display Banner | 12000 | 24 | | 2500 | 1100 | |

**Tasks:**
1. Calculate the **Conversion Rate** for each campaign: `Purchases / Clicks`. Format as percentage.
2. Calculate the **ROI** (Return on Investment) for each campaign: `(Revenue - Cost) / Cost`. Format as percentage.
3. In a summary block below the table, write formulas to calculate:
   - Total Clicks (SUM)
   - Total Revenue (SUM)
   - Average Campaign Cost (AVERAGE)
   - Maximum ROI achieved (MAX)
   - Minimum ROI achieved (MIN)

---

### Exercise 2: Auditing Employee Submissions
An HR analyst receives training completion counts from different regional offices.

| Region | Active Employees | Completed Training | Completion Rate |
| :--- | :--- | :--- | :--- |
| North | 120 | 120 | |
| South | 85 | 0 | |
| East | 90 | (blank) | |
| West | 110 | 95 | |

**Tasks:**
1. Write a formula to calculate the **Completion Rate**: `Completed Training / Active Employees`.
2. Write a formula to count how many regions submitted numerical data for training completions.
3. Write a formula to count how many regions have missing submissions.
4. Calculate the average completion rate across only the regions that submitted completions (hint: ensure blank rows do not affect the result).

---

## Section Recaps

- **Arithmetic Operators:** Understand your basic symbols (`+`, `-`, `*`, `/`, `^`, `%`).
- **PEMDAS Rules:** Parentheses dictate calculations. Always group additions and subtractions inside parentheses if they must happen before multiplication or division.
- **Aggregate functions:** Think of SUM, AVERAGE, COUNT, MAX, and MIN as a Team Captain reporting on a class. They ignore blank cells but include zeros.
- **COUNT vs COUNTA vs COUNTBLANK:** `COUNT` reads numbers, `COUNTA` reads any data (numbers, text, errors), and `COUNTBLANK` checks for empty cells.

---

## Common Interview Questions

### Q1: What is the risk of using `=AVERAGE(A1:A10)` if some cells contain the number `0`?

**Answer:** 
The risk is that cell values of `0` are evaluated as valid numeric data points by the `AVERAGE` function. This means they are added to the sum and count towards the denominator. 

For example, if you have five cells with values `{10, 20, 30, blank, 0}`:
- The blank cell is completely ignored.
- The average is calculated as `(10 + 20 + 30 + 0) / 4 = 15`.

If the `0` was intended to represent "no data available" or "not applicable" rather than a literal value of zero, the average will be artificially dragged down. If you want to average only cells that are greater than zero, you must use a conditional average formula like `=AVERAGEIF(A1:A10, ">0")`.

---

### Q2: Why does `=SUM(A1:A5)` return `100` even though cell `A3` contains a text warning `#VALUE!` inside it?

**Answer:** 
The `SUM` function (and other aggregate functions like `AVERAGE` and `MIN`) is designed to ignore non-numeric values—including text strings—within a referenced cell range. If cell `A3` contains text, `SUM` simply skips it during calculation.

However, if you had written this sum using addition operators, like `=A1+A2+A3+A4+A5`, the formula would fail and display a `#VALUE!` error. This happens because the addition operator (`+`) expects all its inputs to be numbers and cannot handle text strings.

---

### Q3: What is the evaluated output of the formula `=10+5*2^3/4-2`? Show the step-by-step order of operations.

**Answer:** 
Following the rules of PEMDAS, the formula is evaluated step-by-step as follows:

1. **Exponents (E):** `2^3` = `8`.
   - The formula becomes: `=10+5*8/4-2`
2. **Multiplication and Division (MD) from left to right:**
   - First, multiply `5 * 8` = `40`. Formula is now `=10+40/4-2`
   - Next, divide `40 / 4` = `10`. Formula is now `=10+10-2`
3. **Addition and Subtraction (AS) from left to right:**
   - First, add `10 + 10` = `20`. Formula is now `=20-2`
   - Finally, subtract `2` = `18`.

The evaluated output is **`18`**.

---

### Q4: An analyst wants to count the total number of transaction IDs in a list. Should they use `COUNT` or `COUNTA`? Why?

**Answer:** 
It depends on how the transaction IDs are formatted. 

If the transaction IDs contain letters or special characters (for example, `"TXN-10024"`), they are stored as text. In this case, `COUNT` will return `0` because it only counts numbers. The analyst must use `COUNTA` to count non-empty text strings.

If the transaction IDs are strictly numeric (for example, `10024`), either function will work. However, using `COUNTA` is considered a safer best practice for ID columns to prevent errors if the formatting changes or contains mixed characters.

---

### Q5: How does the behavior of `COUNTBLANK` differ from `ISBLANK` in Excel?

**Answer:** 
`COUNTBLANK` is an aggregate function that counts the number of empty cells in a specified range. `ISBLANK` is a logical check that evaluates only a single cell and returns `TRUE` or `FALSE`.

Furthermore, there is a difference in how they handle formulas that return empty strings:
- If a cell contains a formula like `=IF(A1="", "", A1)` and the output is `""` (an empty string), `COUNTBLANK` will evaluate that cell as blank and count it.
- `ISBLANK`, however, checks if the cell is truly empty. Because the cell contains a formula (even if the formula returns nothing), `ISBLANK` will return `FALSE`.
