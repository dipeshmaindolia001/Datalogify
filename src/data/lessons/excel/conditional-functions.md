---
title: "Conditional Functions — IF, SUMIF, COUNTIFS & Logic"
description: "Master IF, nested IF, IFS, SUMIF/SUMIFS, COUNTIF/COUNTIFS, AND/OR/NOT, IFERROR — the analyst's bread and butter formulas."
category: "excel"
order: 3
phase: 3
tags: ["excel", "if", "sumif", "countif", "conditional"]
publishedDate: 2025-03-17
prevSlug: "core-formulas"
nextSlug: "text-functions"
seoTitle: "Excel IF, SUMIF, COUNTIFS Tutorial | Datalogify"
seoDescription: "Master Excel conditional functions — IF, nested IF, IFS, SUMIF, SUMIFS, COUNTIF, COUNTIFS, AND, OR, IFERROR."
---

## Why This Matters

Real data isn't clean and uniform. You need to categorize, filter, and aggregate based on conditions — "sum revenue only for the East region," "count orders above $500," "classify customers into tiers." Conditional functions are how analysts turn raw data into business insights.

## The IF Function

The foundation of all conditional logic. It tests a condition and returns one value if TRUE, another if FALSE.

**Syntax:** `=IF(logical_test, value_if_true, value_if_false)`

### Sample Data: Sales Team Performance

| | A | B | C | D |
|---|---|---|---|---|
| **1** | Rep | Region | Revenue | Quota |
| **2** | Sarah Chen | East | 125000 | 100000 |
| **3** | Mike Patel | West | 78000 | 100000 |
| **4** | Lisa Nguyen | East | 156000 | 120000 |
| **5** | James Wilson | South | 92000 | 100000 |
| **6** | Amy Rodriguez | West | 143000 | 120000 |
| **7** | Tom Garcia | South | 67000 | 80000 |

```text
' In E2 — Did the rep hit quota?
=IF(C2>=D2, "Hit", "Missed")
```

```text
E2: Hit      (125000 >= 100000)
E3: Missed   (78000 < 100000)
E4: Hit      (156000 >= 120000)
E5: Missed   (92000 < 100000)
E6: Hit      (143000 >= 120000)
E7: Missed   (67000 < 80000)
```

### IF with Calculations

You can put formulas inside the IF — not just text.

```text
' In F2 — Calculate bonus: 5% of revenue if quota hit, otherwise $0
=IF(C2>=D2, C2*0.05, 0)
```

```text
F2: 6250    (125000 × 5%)
F3: 0       (missed quota)
F4: 7800    (156000 × 5%)
F5: 0       (missed quota)
F6: 7150    (143000 × 5%)
F7: 0       (missed quota)
```

## Nested IF — Multiple Conditions

When you need more than two outcomes, nest IF functions inside each other.

```text
' Classify reps into tiers based on revenue:
' Platinum: >= 150000
' Gold: >= 100000
' Silver: >= 75000
' Bronze: < 75000

=IF(C2>=150000, "Platinum", IF(C2>=100000, "Gold", IF(C2>=75000, "Silver", "Bronze")))
```

```text
Sarah:  Gold       (125000)
Mike:   Silver     (78000)
Lisa:   Platinum   (156000)
James:  Silver     (92000)
Amy:    Gold       (143000)
Tom:    Bronze     (67000)
```

**Warning:** Nested IFs get ugly fast. Excel allows up to 64 levels, but if you need more than 3, use IFS instead.

## IFS — The Clean Alternative (Excel 2019+/365)

Same logic, much cleaner syntax. Tests conditions in order and returns the first TRUE result.

**Syntax:** `=IFS(condition1, value1, condition2, value2, ...)`

```text
' Same tier classification, but readable:
=IFS(C2>=150000, "Platinum", C2>=100000, "Gold", C2>=75000, "Silver", TRUE, "Bronze")
```

```text
Same results as the nested IF above — but you can actually read this formula.
```

The `TRUE, "Bronze"` at the end acts as a catch-all default (like "else" in programming). Always include it — without a default, IFS returns `#N/A` if no conditions match.

<div class="interview-tip">

**Interview Tip:** When asked to classify data into tiers, use IFS if the company uses Excel 365, nested IF otherwise. Always mention you'd check conditions from highest to lowest (or most specific to least specific) to avoid logic errors. If conditions overlap, order matters.

</div>

## AND, OR, NOT — Combine Multiple Conditions

### AND — All Conditions Must Be True

```text
' Bonus only if quota hit AND revenue > 120000:
=IF(AND(C2>=D2, C2>120000), "Bonus", "No Bonus")
```

```text
Sarah:  Bonus      (hit quota AND > 120000)
Mike:   No Bonus   (missed quota)
Lisa:   Bonus      (hit quota AND > 120000)
James:  No Bonus   (missed quota)
Amy:    Bonus      (hit quota AND > 120000)
Tom:    No Bonus   (missed quota)
```

### OR — At Least One Condition Must Be True

```text
' Flag for review if missed quota OR revenue below 80000:
=IF(OR(C2<D2, C2<80000), "Review", "OK")
```

```text
Sarah:  OK         (hit quota, above 80k)
Mike:   Review     (missed quota)
Lisa:   OK         (hit quota, above 80k)
James:  Review     (missed quota)
Amy:    OK         (hit quota, above 80k)
Tom:    Review     (both: missed quota AND below 80k)
```

### NOT — Reverse a Condition

```text
' Everyone who is NOT in the East region:
=IF(NOT(B2="East"), "Non-East", "East")
```

```text
Sarah:  East
Mike:   Non-East
Lisa:   East
James:  Non-East
Amy:    Non-East
Tom:    Non-East
```

## SUMIF — Conditional Sum (Single Condition)

**Syntax:** `=SUMIF(range, criteria, sum_range)`

Think of it as: "Look through this range, find matches, and sum the corresponding values."

```text
' Total revenue for East region:
=SUMIF(B2:B7, "East", C2:C7)
```

```text
Result: 281000  (125000 + 156000)
```

```text
' Total revenue above 100000:
=SUMIF(C2:C7, ">100000", C2:C7)
```

```text
Result: 424000  (125000 + 156000 + 143000)
```

```text
' Total revenue for reps with "a" in their name (wildcard):
=SUMIF(A2:A7, "*a*", C2:C7)
```

```text
Result: 661000  (Sarah + Lisa + James + Amy + Garcia — all contain "a")
```

### Wildcard Characters in SUMIF/COUNTIF

| Wildcard | Meaning | Example |
|---|---|---|
| `*` | Any number of characters | `"*son"` matches "Wilson", "Johnson" |
| `?` | Exactly one character | `"M?ke"` matches "Mike", "Make" |
| `~` | Escape a wildcard | `"~*"` matches a literal asterisk |

## SUMIFS — Multiple Conditions

**Syntax:** `=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)`

**Critical difference from SUMIF:** In SUMIFS, the sum_range comes FIRST. This trips up everyone.

```text
' Revenue for East region where revenue > 100000:
=SUMIFS(C2:C7, B2:B7, "East", C2:C7, ">100000")
```

```text
Result: 281000  (Sarah: 125000 + Lisa: 156000)
```

```text
' Revenue for West region reps who missed quota:
=SUMIFS(C2:C7, B2:B7, "West", C2:C7, "<"&D2)
```

```text
Result: 78000  (Mike: 78000 — West rep who missed quota)
```

## COUNTIF — Count with a Condition

**Syntax:** `=COUNTIF(range, criteria)`

```text
' How many reps in the East region?
=COUNTIF(B2:B7, "East")
```

```text
Result: 2
```

```text
' How many reps exceeded 100k in revenue?
=COUNTIF(C2:C7, ">100000")
```

```text
Result: 3
```

```text
' How many unique regions? (trick — count each region once)
' Count East + Count West + Count South:
=COUNTIF(B2:B7, "East")
=COUNTIF(B2:B7, "West")
=COUNTIF(B2:B7, "South")
```

```text
East: 2, West: 2, South: 2  → 3 unique regions
```

## COUNTIFS — Multiple Criteria

**Syntax:** `=COUNTIFS(criteria_range1, criteria1, criteria_range2, criteria2, ...)`

```text
' East region reps with revenue > 100000:
=COUNTIFS(B2:B7, "East", C2:C7, ">100000")
```

```text
Result: 2  (Sarah and Lisa)
```

```text
' Reps who hit quota AND have revenue > 120000:
=COUNTIFS(C2:C7, ">="&D2, C2:C7, ">120000")
```

```text
Result: 3
```

## AVERAGEIF and AVERAGEIFS

Same pattern, but for averages:

```text
' Average revenue for East reps:
=AVERAGEIF(B2:B7, "East", C2:C7)
```

```text
Result: 140500  ((125000 + 156000) / 2)
```

```text
' Average revenue for reps who hit quota:
=AVERAGEIF(C2:C7, ">="&D2, C2:C7)
```

```text
Result: 141333.33
```

## The SUMIF/COUNTIF/AVERAGEIF Pattern

All three follow the same pattern. Once you learn one, you know them all:

| Function | Single Condition | Multiple Conditions |
|---|---|---|
| Sum | `SUMIF(range, criteria, sum_range)` | `SUMIFS(sum_range, range1, criteria1, ...)` |
| Count | `COUNTIF(range, criteria)` | `COUNTIFS(range1, criteria1, range2, criteria2, ...)` |
| Average | `AVERAGEIF(range, criteria, avg_range)` | `AVERAGEIFS(avg_range, range1, criteria1, ...)` |

**Key difference:** In the "S" versions (SUMIFS, COUNTIFS, AVERAGEIFS), the result range comes FIRST. In the single versions (SUMIF, AVERAGEIF), it comes LAST. This is an Excel design inconsistency that everyone needs to memorize.

## IFERROR — Handle Errors Gracefully

Wraps any formula and catches errors. Essential for dashboards and reports.

**Syntax:** `=IFERROR(formula, value_if_error)`

```text
' Division that might fail:
=IFERROR(C2/D2, "N/A")

' VLOOKUP that might not find a match:
=IFERROR(VLOOKUP(A2, LookupTable, 2, FALSE), "Not Found")

' Return 0 instead of division error:
=IFERROR(B2/C2, 0)
```

### IFNA — Catch Only #N/A

If you only want to handle `#N/A` (not other errors), use IFNA. This is better for lookups because you still want to see real errors like `#REF!` or `#VALUE!`.

```text
' Only catch #N/A, let other errors show:
=IFNA(VLOOKUP(A2, Products, 2, FALSE), "Product not found")
```

<div class="interview-tip">

**Interview Tip:** Using IFERROR everywhere is lazy — it hides real bugs. Tell interviewers: "I prefer IFNA for lookups because I want to catch only missing matches. If there's a #REF! or #VALUE! error, I need to see it so I can fix the root cause, not mask it."

</div>

## Where This Gets Used on the Job

- **Customer segmentation:** IF/IFS to classify customers into tiers based on spend
- **Regional reports:** SUMIFS to total revenue by region AND product AND date range
- **Data quality:** COUNTIF to find duplicates (`COUNTIF(A:A, A2) > 1`)
- **KPI dashboards:** IFERROR to ensure dashboards never show ugly errors to stakeholders
- **Commission calculations:** Nested IF for tiered commission structures

<div class="challenge">

**Challenge: Build a Commission Calculator**

Using this sales data:

| Rep | Region | Q1 Revenue | Q2 Revenue |
|---|---|---|---|
| Alice | East | 85000 | 112000 |
| Bob | West | 62000 | 78000 |
| Carol | East | 145000 | 168000 |
| Dave | South | 98000 | 95000 |
| Eve | West | 110000 | 132000 |

Build these calculations:
1. **Total Revenue** per rep (Q1 + Q2)
2. **Tier** using IFS: Platinum (>250k), Gold (>180k), Silver (>150k), Bronze (<=150k)
3. **Commission Rate**: Platinum=8%, Gold=6%, Silver=4%, Bronze=2%
4. **Commission Amount**: Total Revenue × Rate
5. Use SUMIF to find: Total East revenue, Total West revenue
6. Use COUNTIF to find: How many Platinum reps, how many Bronze reps
7. Use AVERAGEIFS to find: Average revenue for East reps with revenue > 200000

**Expected:** Carol is Platinum (313k), Eve is Gold (242k), Alice is Silver (197k), Dave and Bob are Bronze.

</div>

## Common Interview Questions

### Q1: What is the difference between SUMIF and SUMIFS?

**Answer:** SUMIF handles a single condition: `=SUMIF(range, criteria, sum_range)`. SUMIFS handles multiple conditions: `=SUMIFS(sum_range, range1, criteria1, range2, criteria2)`. The critical syntax difference is that SUMIFS puts the sum_range first, while SUMIF puts it last. For example, to sum revenue for East region in Q1: `=SUMIFS(Revenue, Region, "East", Quarter, "Q1")`.

### Q2: How would you classify customers into tiers based on their spending?

**Answer:** For 2-3 tiers, I'd use nested IF: `=IF(spend>=10000, "Platinum", IF(spend>=5000, "Gold", "Silver"))`. For more tiers, I'd use IFS in Excel 365: `=IFS(spend>=10000, "Platinum", spend>=5000, "Gold", spend>=1000, "Silver", TRUE, "Bronze")`. The conditions must go from highest to lowest to work correctly, and IFS needs a `TRUE` catch-all at the end.

### Q3: What's the difference between IFERROR and IFNA?

**Answer:** IFERROR catches ALL error types — #N/A, #VALUE!, #REF!, #DIV/0!, etc. IFNA catches only #N/A errors. I prefer IFNA for lookup formulas because #N/A means "not found," which is expected and should be handled. But #REF! or #VALUE! indicate real bugs that I want to see and fix. IFERROR masks everything, which can hide problems.

### Q4: How would you use COUNTIF to find duplicate values in a column?

**Answer:** Use `=COUNTIF(A:A, A2)` next to each value. If the result is greater than 1, that value appears more than once — it's a duplicate. To flag duplicates: `=IF(COUNTIF(A:A, A2)>1, "Duplicate", "Unique")`. You can also use conditional formatting with the formula `=COUNTIF($A:$A, $A2)>1` to highlight duplicates visually.

### Q5: Write a formula to calculate a tiered commission: 3% on first $50k, 5% on next $50k, 8% above $100k.

**Answer:** `=IF(revenue<=50000, revenue*0.03, IF(revenue<=100000, 50000*0.03+(revenue-50000)*0.05, 50000*0.03+50000*0.05+(revenue-100000)*0.08))`. For $120,000 revenue: first 50k at 3% = $1,500, next 50k at 5% = $2,500, remaining 20k at 8% = $1,600. Total commission = $5,600. This is a common payroll/finance interview question.
