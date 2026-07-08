---
title: "Advanced Formulas — Dynamic Arrays, LET, LAMBDA & FILTER"
description: "Unlock modern Excel's power — UNIQUE, SORT, FILTER, SORTBY, SEQUENCE, LET, LAMBDA, and array formulas for advanced analytics."
category: "excel"
order: 201
phase: 3
tags: ["excel", "dynamic-arrays", "filter", "unique", "lambda"]
publishedDate: 2025-03-26
prevSlug: "what-if-analysis"
nextSlug: "power-query"
seoTitle: "Excel Dynamic Arrays & Advanced Formulas | Datalogify"
seoDescription: "Master Excel 365 dynamic arrays — UNIQUE, SORT, FILTER, SORTBY, SEQUENCE, LET, LAMBDA functions."
---

## Why This Matters

If you're still writing VLOOKUP and manually filtering data, you're using 2010-era Excel in a 2025 world. Dynamic array functions (UNIQUE, SORT, FILTER, SORTBY) and modern formula tools (LET, LAMBDA) let you build entire reports with single formulas that auto-update. This is the skill gap between a junior and senior analyst.

---

## Dynamic Arrays — The Big Shift

Before Excel 365, a formula returned ONE value to ONE cell. Dynamic arrays changed everything — a single formula can now return results that **spill** across multiple cells automatically.

### The Spill Range Operator (#)

When a dynamic array formula returns multiple results, they "spill" into adjacent cells. You reference the entire spill range with the **#** operator.

```text
=UNIQUE(A2:A100)
```

```text
This might return 8 unique values, spilling into A2:A9.
Reference the entire result with: =UNIQUE(A2:A100)#
```

---

## UNIQUE — Extract Distinct Values

No more Remove Duplicates destroying your source data. UNIQUE gives you a live, auto-updating list.

### Example Data

| Order ID | Region | Product | Amount |
|---|---|---|---|
| 1001 | North | Laptop | 65,000 |
| 1002 | South | Phone | 25,000 |
| 1003 | North | Tablet | 32,000 |
| 1004 | East | Laptop | 65,000 |
| 1005 | South | Laptop | 65,000 |
| 1006 | West | Phone | 25,000 |
| 1007 | North | Phone | 25,000 |
| 1008 | East | Tablet | 32,000 |

### Get Unique Regions

```text
=UNIQUE(B2:B9)
```

```text
North
South
East
West
```

### Get Unique Region-Product Combinations

```text
=UNIQUE(B2:C9)
```

```text
North   Laptop
South   Phone
North   Tablet
East    Laptop
South   Laptop
West    Phone
North   Phone
East    Tablet
```

### Count of Unique Values

```text
=COUNTA(UNIQUE(B2:B9))
```

```text
Result: 4
```

<div class="interview-tip">
"How would you get unique values without using Remove Duplicates?" — UNIQUE() is the modern answer. It's non-destructive (doesn't touch source data), dynamic (auto-updates when new data arrives), and can handle multi-column uniqueness. In older Excel, you'd use Advanced Filter or a helper column with COUNTIF.
</div>

---

## SORT and SORTBY — Dynamic Sorting

Sort data with formulas — no manual Sort button needed. The result updates automatically when data changes.

### SORT — Basic Sorting

```text
=SORT(A2:D9, 4, -1)
```

```text
Sort by column 4 (Amount), descending (-1):

1001  North  Laptop  65,000
1004  East   Laptop  65,000
1005  South  Laptop  65,000
1003  North  Tablet  32,000
1008  East   Tablet  32,000
1002  South  Phone   25,000
1006  West   Phone   25,000
1007  North  Phone   25,000
```

Arguments: `SORT(array, sort_index, sort_order, by_col)`
- sort_order: **1** = ascending (default), **-1** = descending
- by_col: **FALSE** = sort by rows (default), **TRUE** = sort by columns

### SORTBY — Sort by a Different Column

SORTBY is more flexible — you can sort by a column that isn't even in your output.

```text
=SORTBY(A2:C9, D2:D9, -1)
```

```text
Sort columns A:C by column D (Amount) descending — but don't show Amount:

1001  North  Laptop
1004  East   Laptop
1005  South  Laptop
1003  North  Tablet
1008  East   Tablet
1002  South  Phone
1006  West   Phone
1007  North  Phone
```

### Multi-Level Sort

```text
=SORTBY(A2:D9, B2:B9, 1, D2:D9, -1)
```

```text
Sort by Region ascending THEN by Amount descending:

1004  East   Laptop  65,000
1008  East   Tablet  32,000
1001  North  Laptop  65,000
1003  North  Tablet  32,000
1007  North  Phone   25,000
1005  South  Laptop  65,000
1002  South  Phone   25,000
1006  West   Phone   25,000
```

---

## FILTER — The Game Changer

FILTER replaces manual filtering, AutoFilter, and complex INDEX/MATCH combos. One formula extracts exactly the rows you need.

### Basic Filter

```text
=FILTER(A2:D9, B2:B9="North")
```

```text
1001  North  Laptop  65,000
1003  North  Tablet  32,000
1007  North  Phone   25,000
```

### Filter with Multiple Conditions (AND)

Use **\*** (multiply) for AND logic:

```text
=FILTER(A2:D9, (B2:B9="North") * (D2:D9>30000))
```

```text
1001  North  Laptop  65,000
1003  North  Tablet  32,000
```

### Filter with Multiple Conditions (OR)

Use **+** (add) for OR logic:

```text
=FILTER(A2:D9, (B2:B9="North") + (B2:B9="South"))
```

```text
1001  North  Laptop  65,000
1002  South  Phone   25,000
1003  North  Tablet  32,000
1005  South  Laptop  65,000
1007  North  Phone   25,000
```

### Filter with No Results Handling

```text
=FILTER(A2:D9, D2:D9>100000, "No results found")
```

```text
Result: "No results found" (no order exceeds ₹1L)
```

### Dynamic Filter from a Cell

Point the filter to a dropdown cell for interactive reports:

```text
=FILTER(A2:D9, B2:B9=G1)
```

```text
When G1 = "East":
1004  East  Laptop  65,000
1008  East  Tablet  32,000

Change G1 to "West":
1006  West  Phone  25,000
```

<div class="interview-tip">
FILTER is arguably the most important dynamic array function. In interviews, if asked "how would you extract all rows matching a condition without using a Pivot Table," FILTER is the answer. It's also faster than VLOOKUP for extracting multiple matching rows.
</div>

---

## SEQUENCE — Generate Number Series

SEQUENCE creates arrays of sequential numbers. Sounds simple — incredibly useful in practice.

```text
=SEQUENCE(5)
```

```text
1
2
3
4
5
```

### Arguments: SEQUENCE(rows, columns, start, step)

```text
=SEQUENCE(3, 4, 10, 5)
```

```text
10  15  20  25
30  35  40  45
50  55  60  65
```

### Practical: Generate Date Series

```text
=SEQUENCE(12, 1, DATE(2025,1,1), 30)
```

```text
01-Jan-2025
31-Jan-2025
02-Mar-2025
01-Apr-2025
... (every 30 days)
```

### Practical: Row Numbers for Filtered Data

```text
=SEQUENCE(COUNTA(FILTER(A2:A9, B2:B9="North")))
```

```text
1
2
3
(auto-numbered list for filtered results)
```

---

## LET — Name Your Intermediate Calculations

LET makes complex formulas readable by assigning names to intermediate values. No more debugging nested nightmares.

### Without LET (Unreadable)

```text
=IF(SUMIFS(D2:D9,B2:B9,"North")/COUNTIFS(B2:B9,"North")>SUMIFS(D2:D9,B2:B9,"South")/COUNTIFS(B2:B9,"South"),"North Wins","South Wins")
```

### With LET (Clear)

```text
=LET(
    north_avg, SUMIFS(D2:D9, B2:B9, "North") / COUNTIFS(B2:B9, "North"),
    south_avg, SUMIFS(D2:D9, B2:B9, "South") / COUNTIFS(B2:B9, "South"),
    IF(north_avg > south_avg, "North Wins", "South Wins")
)
```

```text
Result: "North Wins"
(North avg: ₹40,667 vs South avg: ₹45,000... wait, South wins!)
Actually: North = (65000+32000+25000)/3 = 40,667
          South = (25000+65000)/2 = 45,000
Result: "South Wins"
```

### Why LET Matters

1. **Readability** — Named variables are self-documenting
2. **Performance** — Each calculation runs once (not repeated in nested IFs)
3. **Debugging** — Change one variable definition instead of fixing it in 5 places

### Complex Example: Bonus Calculation

```text
=LET(
    revenue, SUMIFS(D2:D9, B2:B9, G1),
    target, 100000,
    achievement, revenue / target,
    bonus_rate, IF(achievement >= 1.2, 0.15, IF(achievement >= 1, 0.10, 0.05)),
    revenue * bonus_rate
)
```

```text
If G1 = "North": Revenue = ₹1,22,000, Achievement = 122%, Rate = 15%
Bonus = ₹18,300
```

---

## LAMBDA — Create Custom Reusable Functions

LAMBDA lets you define your own functions — like writing a mini-program inside Excel.

### Basic LAMBDA

```text
=LAMBDA(x, x * 1.18)(1000)
```

```text
Result: 1180 (adds 18% GST)
```

### Making It Reusable with Name Manager

1. Go to **Formulas → Name Manager → New**
2. Name: **AddGST**
3. Refers to: `=LAMBDA(amount, amount * 1.18)`
4. Click OK

Now use it like a built-in function:

```text
=AddGST(5000)
```

```text
Result: 5,900
```

### Multi-Parameter LAMBDA

Define **ProfitMargin**:

```text
=LAMBDA(revenue, cost, (revenue - cost) / revenue * 100)
```

Name it as **ProfitMargin**, then:

```text
=ProfitMargin(500000, 350000)
```

```text
Result: 30 (30% profit margin)
```

### LAMBDA with FILTER — Custom Report Function

Define **RegionSales**:

```text
=LAMBDA(region, FILTER(A2:D9, B2:B9=region, "No data"))
```

```text
=RegionSales("East")
```

```text
1004  East  Laptop  65,000
1008  East  Tablet  32,000
```

---

## INDEX + MATCH — The Classic Power Combo

Before XLOOKUP existed, INDEX+MATCH was the gold standard. You'll still see it everywhere in legacy workbooks.

### Left Lookup (VLOOKUP Can't Do This)

| Emp ID | Name | Department | Salary |
|---|---|---|---|
| E101 | Amit | Sales | 6,00,000 |
| E102 | Priya | Marketing | 7,50,000 |
| E103 | Raj | Sales | 5,50,000 |
| E104 | Sneha | Engineering | 9,00,000 |

"Given a name, find their Emp ID" — VLOOKUP can't look left. INDEX+MATCH can.

```text
=INDEX(A2:A5, MATCH("Priya", B2:B5, 0))
```

```text
Result: E102
```

### Two-Way Lookup (Row + Column)

| | Q1 | Q2 | Q3 | Q4 |
|---|---|---|---|---|
| North | 45 | 52 | 48 | 61 |
| South | 38 | 41 | 43 | 55 |
| East | 29 | 35 | 40 | 42 |
| West | 51 | 58 | 53 | 66 |

"Find East's Q3 value:"

```text
=INDEX(B2:E5, MATCH("East", A2:A5, 0), MATCH("Q3", B1:E1, 0))
```

```text
Result: 40
```

### Array Formula (Legacy: Ctrl+Shift+Enter)

In older Excel (pre-365), some formulas needed Ctrl+Shift+Enter to work as array formulas. You'd see curly braces `{}` around them:

```text
{=INDEX(B2:B5, MATCH(MAX(D2:D5), D2:D5, 0))}
```

```text
Result: Sneha (the name of the person with the highest salary)
```

In Excel 365, you don't need Ctrl+Shift+Enter — it handles arrays natively.

---

## TEXTJOIN with IF — Conditional Concatenation

Combine text from cells that match a condition — perfect for summary reports.

### Example: List All Products Sold in North Region

```text
=TEXTJOIN(", ", TRUE, IF(B2:B9="North", C2:C9, ""))
```

```text
Result: Laptop, Tablet, Phone
```

In older Excel, press **Ctrl+Shift+Enter** for this. In 365, just press Enter.

### List Employees Earning Above ₹7L

```text
=TEXTJOIN(", ", TRUE, IF(D2:D5>700000, B2:B5, ""))
```

```text
Result: Priya, Sneha
```

---

## Combining Dynamic Array Functions

The real power comes from chaining these functions together.

### Top 3 Regions by Revenue

```text
=TAKE(SORTBY(UNIQUE(B2:B9), SUMIFS(D2:D9, B2:B9, UNIQUE(B2:B9)), -1), 3)
```

```text
North    (₹1,22,000)
East     (₹97,000)
South    (₹90,000)
```

### Filtered + Sorted Report

```text
=SORT(FILTER(A2:D9, D2:D9>=30000), 4, -1)
```

```text
1001  North  Laptop  65,000
1004  East   Laptop  65,000
1005  South  Laptop  65,000
1003  North  Tablet  32,000
1008  East   Tablet  32,000
(All orders ≥ ₹30K, sorted by amount descending)
```

### Unique + Count Combo (Frequency Table)

```text
=LET(
    products, UNIQUE(C2:C9),
    counts, COUNTIF(C2:C9, products),
    SORTBY(HSTACK(products, counts), counts, -1)
)
```

```text
Laptop   3
Phone    3
Tablet   2
```

---

## Where This Is Used in Real Jobs

| Function | Real-World Use |
|---|---|
| FILTER | Extract transactions by date range, customer, status |
| UNIQUE | Build dropdown lists, get distinct customer lists |
| SORT/SORTBY | Dynamic leaderboards, ranked reports |
| LET | Readable financial models, complex KPI formulas |
| LAMBDA | Reusable custom calculations shared across workbooks |
| SEQUENCE | Generate date calendars, invoice numbers, test data |
| TEXTJOIN+IF | Summarize categories, build dynamic email lists |

---

<div class="challenge">

### Challenge: Build a Dynamic Sales Report

**Dataset:** Create a table with 20 rows: Order ID, Date, Region (North/South/East/West), Sales Rep, Product (5 products), Quantity, Unit Price, Total Amount.

**Build these formulas:**
1. Use UNIQUE to extract all distinct Sales Reps
2. Use FILTER to show all orders from a specific region (use a cell reference)
3. Use SORT to rank orders by Total Amount descending
4. Use FILTER + SORT combined to show "Top 5 orders from South region"
5. Use LET to calculate: Average order value, compare to target, return "Above Target" or "Below Target"
6. Create a LAMBDA named **CalcCommission** that takes (amount, rate) and returns the commission. Use it in a column.
7. Use TEXTJOIN+IF to list all reps who sold "Laptop"
8. Use SEQUENCE to auto-generate a column of row numbers that adjusts when filters change

**Bonus:** Build a mini-dashboard where changing a Region dropdown (Data Validation) automatically updates a FILTER-based report, a UNIQUE product list, and a SUMIFS total — all with zero Pivot Tables.

</div>

---

## Common Interview Questions

### Q1: What are dynamic arrays in Excel and how do they differ from regular formulas?

**Answer:** Dynamic arrays are formulas that return multiple results that "spill" into adjacent cells automatically. Traditional formulas return one value per cell. For example, `=UNIQUE(A2:A100)` returns all distinct values at once, filling as many cells as needed. The spill range updates automatically when source data changes. You reference the entire spill range with the # operator (e.g., `=COUNTA(UNIQUE(A2:A100)#)`). This was introduced in Excel 365 and fundamentally changed how formulas work.

### Q2: How does FILTER differ from AutoFilter or VLOOKUP for extracting data?

**Answer:** FILTER is a formula that returns all matching rows dynamically — it auto-updates when data changes, can handle multiple AND/OR conditions, and works inside other formulas. AutoFilter is a manual UI action that hides rows (not a formula). VLOOKUP returns only ONE value from the first match. FILTER returns ALL matches with ALL columns. For example, `=FILTER(A:D, B:B="North")` instantly returns every North region row — no manual clicking, no limitations on number of results.

### Q3: What is LET and why should you use it?

**Answer:** LET assigns names to intermediate calculations within a formula. Instead of repeating `SUMIFS(...)` three times in a nested IF, you calculate it once with `=LET(total, SUMIFS(...), IF(total>100000, total*0.1, total*0.05))`. Benefits: formulas are readable (named variables), faster (each calculation runs once), and easier to debug (change one definition, not five). It's essential for any formula longer than one line.

### Q4: How would you create a custom function in Excel without VBA?

**Answer:** Use LAMBDA. Define the function logic as `=LAMBDA(param1, param2, formula_using_params)` and save it in Name Manager with a descriptive name. For example, name "GST" referring to `=LAMBDA(amount, amount*1.18)`. Then use `=GST(5000)` anywhere in the workbook. LAMBDAs are portable, shareable, and don't require macro-enabled files. They can also be recursive for advanced calculations.

### Q5: What's the difference between SORT and SORTBY?

**Answer:** SORT sorts an array by one of its own columns — `=SORT(A2:D9, 4, -1)` sorts by the 4th column. SORTBY sorts an array based on a separate array — `=SORTBY(A2:C9, D2:D9, -1)` sorts columns A:C by values in column D (which might not be included in the output). SORTBY also supports multi-level sorting with additional array/order pairs. Use SORT for simple cases, SORTBY when you need to sort by a column not in your output or need multiple sort levels.
