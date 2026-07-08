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

## Why This Matters

Formulas are why Excel exists. Without them, it's just a grid. Every report, every dashboard, every quick analysis starts with these core functions. Nail these and you can answer 80% of business questions thrown at you in your first week.

## Arithmetic Operators

Every formula starts with `=`. Here are the operators you'll use constantly:

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` | Addition | `=10+5` | 15 |
| `-` | Subtraction | `=10-5` | 5 |
| `*` | Multiplication | `=10*5` | 50 |
| `/` | Division | `=10/5` | 2 |
| `^` | Exponentiation | `=2^3` | 8 |
| `%` | Percent | `=50%` | 0.5 |

### Real Example: Revenue Calculation

| | A | B | C | D |
|---|---|---|---|---|
| **1** | Product | Units Sold | Unit Price | Revenue |
| **2** | Laptop | 150 | 999 | |
| **3** | Mouse | 2400 | 25 | |
| **4** | Keyboard | 800 | 75 | |

```text
' In D2, calculate revenue:
=B2*C2
```

```text
D2: 149850
D3: 60000
D4: 60000
```

## Comparison Operators

These return `TRUE` or `FALSE`. You'll use them inside IF, SUMIF, COUNTIF, and conditional formatting rules.

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `=` | Equal to | `=10=10` | TRUE |
| `>` | Greater than | `=10>5` | TRUE |
| `<` | Less than | `=10<5` | FALSE |
| `>=` | Greater than or equal | `=10>=10` | TRUE |
| `<=` | Less than or equal | `=5<=3` | FALSE |
| `<>` | Not equal to | `=10<>5` | TRUE |

```text
' Check if a sales rep hit their quota:
=C2>=D2

' If C2 (actual sales) = 125000 and D2 (quota) = 100000:
```

```text
Result: TRUE
```

## PEMDAS — Order of Operations

Excel follows math order of operations. Get this wrong and your formulas silently return wrong numbers — the worst kind of bug.

**P**arentheses → **E**xponents → **M**ultiplication/**D**ivision → **A**ddition/**S**ubtraction

```text
' What does this return?
=2+3*4
```

```text
Result: 14  (NOT 20 — multiplication happens first)
```

```text
' Force addition first with parentheses:
=(2+3)*4
```

```text
Result: 20
```

### Tricky PEMDAS Examples That Trip People Up

```text
' Example 1: Profit margin calculation
=100-20/100
```

```text
Result: 99.8  (Division first: 20/100=0.2, then 100-0.2=99.8)
Intended: =(100-20)/100 → 0.8 (80% margin)
```

```text
' Example 2: Compound interest
=1000*1+0.05^2
```

```text
Result: 1000.0025  (Exponent first, then multiply, then add)
Intended: =1000*(1+0.05)^2 → 1102.50
```

```text
' Example 3: Average of two percentages — wrong way
=50%+30%/2
```

```text
Result: 0.65  (30%/2 = 0.15, then 0.50+0.15 = 0.65)
Intended: =(50%+30%)/2 → 0.40 (40%)
```

<div class="interview-tip">

**Interview Tip:** If an interviewer gives you a formula and asks "what does this return?" — they're testing PEMDAS. Walk through the order of operations step by step, out loud. Showing your reasoning matters more than getting the right number.

</div>

## The Core Aggregate Functions

These are the workhorses. You'll use them in every single report.

### Sample Data: Regional Sales

| | A | B | C | D |
|---|---|---|---|---|
| **1** | Date | Region | Product | Revenue |
| **2** | 2025-01-05 | East | Laptop | 14985 |
| **3** | 2025-01-08 | West | Mouse | 1250 |
| **4** | 2025-01-12 | East | Keyboard | 3750 |
| **5** | 2025-01-15 | South | Laptop | 9990 |
| **6** | 2025-01-18 | West | Monitor | 4190 |
| **7** | 2025-01-22 | East | Mouse | 875 |
| **8** | 2025-01-25 | South | Keyboard | 2250 |
| **9** | 2025-01-28 | West | Laptop | 19980 |
| **10** | 2025-02-02 | East | Monitor | 6980 |
| **11** | 2025-02-05 | South | Mouse | 500 |

### SUM — Total a Range

```text
' Total revenue:
=SUM(D2:D11)
```

```text
Result: 64750
```

```text
' Sum non-contiguous ranges:
=SUM(D2:D5, D8:D11)
```

```text
Result: 58705
```

**Pro tip:** Select a range and look at the status bar (bottom-right). Excel shows Sum, Average, and Count automatically — no formula needed for quick checks.

### AVERAGE — Mean Value

```text
' Average revenue per transaction:
=AVERAGE(D2:D11)
```

```text
Result: 6475
```

Watch out — AVERAGE ignores blank cells but NOT zeros. If you have zero-revenue rows, they'll drag your average down.

```text
' Average that ignores zeros (trick using AVERAGEIF — covered next lesson):
=AVERAGEIF(D2:D11, "<>0")
```

### MAX and MIN — Find Extremes

```text
' Highest single transaction:
=MAX(D2:D11)

' Lowest single transaction:
=MIN(D2:D11)
```

```text
MAX Result: 19980
MIN Result: 500
```

```text
' Range (spread) of revenue:
=MAX(D2:D11)-MIN(D2:D11)
```

```text
Result: 19480
```

### COUNT vs COUNTA vs COUNTBLANK

This is where people get confused. Here's the definitive breakdown:

| Function | What It Counts | Ignores |
|---|---|---|
| `COUNT` | Cells with **numbers** only | Text, blanks, errors |
| `COUNTA` | Cells with **any value** (numbers + text) | Blanks only |
| `COUNTBLANK` | **Empty** cells | Everything with content |

Consider this data:

| | A |
|---|---|
| **1** | 100 |
| **2** | Hello |
| **3** | |
| **4** | 200 |
| **5** | |
| **6** | TRUE |
| **7** | 300 |

```text
=COUNT(A1:A7)
=COUNTA(A1:A7)
=COUNTBLANK(A1:A7)
```

```text
COUNT:      3   (only 100, 200, 300 — the numbers)
COUNTA:     5   (100, Hello, 200, TRUE, 300 — anything non-blank)
COUNTBLANK: 2   (rows 3 and 5 — the empties)
```

### Putting It All Together: Sales Summary

Back to our regional sales data. Build a summary section below the data:

```text
' In F2: Total Revenue
=SUM(D2:D11)

' In F3: Average Transaction
=AVERAGE(D2:D11)

' In F4: Number of Transactions
=COUNT(D2:D11)

' In F5: Highest Transaction
=MAX(D2:D11)

' In F6: Lowest Transaction
=MIN(D2:D11)

' In F7: Revenue Range
=MAX(D2:D11)-MIN(D2:D11)
```

```text
Total Revenue:       64750
Average Transaction: 6475
Transactions:        10
Highest Transaction: 19980
Lowest Transaction:  500
Revenue Range:       19480
```

## Combining Operators with Functions

Real formulas combine everything. Here's a profit margin calculation:

| | A | B | C |
|---|---|---|---|
| **1** | Product | Revenue | Cost |
| **2** | Laptop | 14985 | 8500 |
| **3** | Mouse | 1250 | 400 |
| **4** | Keyboard | 3750 | 1800 |

```text
' Profit margin percentage in D2:
=(B2-C2)/B2
```

```text
D2: 0.4328  → Format as % → 43.28%
D3: 0.6800  → 68.00%
D4: 0.5200  → 52.00%
```

```text
' Total margin across all products:
=(SUM(B2:B4)-SUM(C2:C4))/SUM(B2:B4)
```

```text
Result: 0.4644 → 46.44%
```

<div class="interview-tip">

**Interview Tip:** Know the difference between margin and markup. Margin = (Revenue - Cost) / Revenue. Markup = (Revenue - Cost) / Cost. Interviewers love asking this because getting it wrong means every financial report is wrong.

</div>

## Quick Aggregation Without Formulas

Select any range of numbers. Look at the **status bar** at the bottom of Excel:

```text
Average: 6475    Count: 10    Sum: 64750
```

Right-click the status bar to add MIN, MAX, and Numerical Count. This is the fastest way to spot-check data without writing a single formula.

## Where This Gets Used on the Job

- **Daily sales reports:** SUM revenue by day, AVERAGE transaction size, COUNT orders
- **Variance analysis:** Compare this month's MAX vs last month's MAX
- **Data quality checks:** COUNTA to verify all rows have data, COUNTBLANK to find missing values
- **KPI dashboards:** Every metric tile is a SUM, AVERAGE, or COUNT formula

<div class="challenge">

**Challenge: Build a Monthly Sales Summary**

Using this dataset:

| Date | Region | Product | Units | Revenue |
|---|---|---|---|---|
| 2025-01-03 | East | Widget A | 50 | 2500 |
| 2025-01-07 | West | Widget B | 30 | 4500 |
| 2025-01-12 | East | Widget A | 75 | 3750 |
| 2025-01-15 | South | Widget C | 20 | 6000 |
| 2025-01-20 | West | Widget A | 60 | 3000 |
| 2025-01-25 | East | Widget B | 40 | 6000 |
| 2025-01-28 | South | Widget A | 35 | 1750 |

Build a summary section with:
1. Total Revenue (SUM)
2. Average Revenue per transaction (AVERAGE)
3. Total Units Sold (SUM)
4. Number of Transactions (COUNT or COUNTA)
5. Highest Revenue transaction (MAX)
6. Lowest Revenue transaction (MIN)
7. Average Units per transaction (AVERAGE)
8. Revenue per Unit — Total Revenue / Total Units

**Expected answers:** Total Revenue = 27500, Avg Revenue = 3928.57, Total Units = 310, Transactions = 7, Max = 6000, Min = 1750, Avg Units = 44.29, Revenue/Unit = 88.71

</div>

## Common Interview Questions

### Q1: What is the difference between COUNT, COUNTA, and COUNTBLANK?

**Answer:** `COUNT` counts only cells containing numbers. `COUNTA` counts all non-empty cells — numbers, text, booleans, errors. `COUNTBLANK` counts empty cells. For example, if a column has 100 rows with 80 numbers, 10 text values, and 10 blanks: COUNT returns 80, COUNTA returns 90, COUNTBLANK returns 10. In data quality checks, I use COUNTA to verify completeness and COUNTBLANK to find missing values.

### Q2: What does PEMDAS mean and why does it matter in Excel?

**Answer:** PEMDAS stands for Parentheses, Exponents, Multiplication/Division, Addition/Subtraction — the order Excel evaluates operations. It matters because `=2+3*4` returns 14, not 20. If you want addition first, you need parentheses: `=(2+3)*4` = 20. In financial formulas like profit margin, getting the order wrong means silently wrong numbers — there's no error message, just a bad answer.

### Q3: How does AVERAGE handle blank cells versus cells with zero?

**Answer:** AVERAGE skips blank cells entirely — they don't affect the count or the sum. But cells containing zero ARE included. So if you have values 10, 20, blank, 0 — AVERAGE returns (10+20+0)/3 = 10, not (10+20)/2 = 15. This matters when analyzing data where zero is meaningfully different from "no data." If you need to exclude zeros, use `AVERAGEIF(range, "<>0")`.

### Q4: What's the fastest way to check the sum of a column without writing a formula?

**Answer:** Select the range and look at the status bar at the bottom of Excel — it shows Sum, Average, and Count automatically. You can right-click the status bar to add Min, Max, and Numerical Count. This is the go-to method for quick data validation before building formal reports.

### Q5: Write a formula to calculate profit margin percentage.

**Answer:** `=(Revenue-Cost)/Revenue` or in cell terms: `=(B2-C2)/B2`. This gives a decimal like 0.43, which you format as percentage to show 43%. For total margin across multiple products: `=(SUM(B2:B10)-SUM(C2:C10))/SUM(B2:B10)`. Always use parentheses around the numerator to ensure subtraction happens before division — without them, you'd get the wrong result due to PEMDAS.
