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

## Introduction & The "Why"

Data in the real world is rarely uniform. It is messy, volatile, and full of outliers. As a data analyst, you cannot treat every row of data identically. You need to make decisions dynamically based on specific rules:
- *If* a customer is in the "Enterprise" tier, *then* apply a 20% discount; otherwise, apply no discount.
- *If* a transaction occurred in the "East" region *and* the revenue exceeded $10,000, *then* add it to the regional performance bucket.
- *If* a cell contains a division error due to missing data, *then* display a blank space instead of a scary `#DIV/0!` warning.

To perform these tasks, Excel relies on **Conditional Functions**. These functions allow you to introduce logic, decision-making, and targeted queries into your models.

### The Metaphor: The Railway Switch Router

Think of conditional functions as a **Railway Switch Router**. 

Imagine a train (representing your data row) rolling down a track. Up ahead, the track splits into multiple directions. There is a mechanical switch (representing your logical test) sitting at the junction:

```text
               ┌── [Track A: "Approve Bonus"] (Condition is TRUE)
               │
══ [Data Row] ═┼─ [Switch: "Did Sales exceed $100k?"]
               │
               └── [Track B: "No Bonus"]      (Condition is FALSE)
```

As the train approaches, the switch checks a specific attribute of the cargo (e.g., *"Is sales revenue greater than or equal to $100,000?"*). 
- If the cargo meets the condition (`TRUE`), the lever pulls and the train is redirected down **Track A** (where it receives a bonus calculation).
- If the cargo fails the condition (`FALSE`), the lever stays put and the train travels down **Track B** (where it receives zero bonus).

By chaining these switches together, you can build incredibly complex, automated pathways that sort, calculate, and clean your data with zero manual intervention.

---

## Step-by-Step Concept Breakdown

To build effective switches, we must understand the structure of logical tests and how Excel processes logical operators.

### 1. The Anatomy of an IF Function

The core `IF` function is the foundation of all logical statements. It requires three arguments:

```excel
=IF(logical_test, value_if_true, value_if_false)
```

1. **`logical_test`:** A statement or comparison that evaluates to either `TRUE` or `FALSE` (e.g., `C2 >= 100000`).
2. **`value_if_true`:** What Excel should output if the test is `TRUE`. This can be a text string (like `"Hit"`), a number (like `500`), a calculation (like `C2 * 10%`), or even another formula.
3. **`value_if_false`:** What Excel should output if the test is `FALSE`.

### 2. Nested IF Statements vs. The Modern IFS Function

What happens if you have more than two possible outcomes? For example, you need to classify sales reps into **four** performance tiers: Platinum, Gold, Silver, and Bronze.

#### Nested IF (The Traditional Approach)
To handle multiple branches, you must place an `IF` function inside the `value_if_false` argument of another `IF` function. This is called "nesting":

```excel
=IF(C2>=150000, "Platinum", IF(C2>=100000, "Gold", IF(C2>=75000, "Silver", "Bronze")))
```

Excel evaluates this from left to right. As soon as it finds a logical test that evaluates to `TRUE`, it stops evaluating and returns that value. If none of the tests are `TRUE`, it defaults to the final argument (`"Bronze"`).

*The Problem:* Nested IFs are notoriously difficult to read, write, and audit. If you miss a single closing parenthesis at the end, the entire formula breaks.

#### The IFS Function (Excel 2019+ and Office 365)
The `IFS` function allows you to test multiple conditions without nesting. The syntax is a clean pairing of conditions and values:

```excel
=IFS(condition1, value1, condition2, value2, condition3, value3, ...)
```

Excel tests the conditions in the order they are written. 

> [!IMPORTANT]
> The `IFS` function does not have a built-in default/else argument. If none of the conditions evaluate to `TRUE`, the formula will return a `#N/A` error. To prevent this, you must add a catch-all condition at the very end of your formula: write `TRUE` as the final condition, followed by your default value (e.g., `..., TRUE, "Bronze"`).

---

## Combining Logical Operators: AND, OR, NOT

Sometimes a single comparison isn't enough. You might need to check if a sales rep hit their quota **and** has more than 5 years of experience, or if a transaction occurred in the North region **or** the South region.

Unlike programming languages where you write `X and Y` or `X or Y`, Excel wraps the comparisons inside functions.

### 1. The AND Function
Returns `TRUE` only if **all** arguments inside evaluate to `TRUE`.

```excel
=AND(C2>=D2, E2>5)
```
*Evaluates to:* `TRUE` if C2 is greater than or equal to D2 **and** E2 is greater than 5. Otherwise, returns `FALSE`.

### 2. The OR Function
Returns `TRUE` if **at least one** argument inside evaluates to `TRUE`.

```excel
=OR(B2="East", B2="West")
```
*Evaluates to:* `TRUE` if the region is East **or** West. Returns `FALSE` only if the region is something else (like South or North).

### 3. The NOT Function
Inverts the logical outcome. It turns `TRUE` into `FALSE` and `FALSE` into `TRUE`.

```excel
=NOT(B2="East")
```
*Evaluates to:* `TRUE` if the region is NOT East.

---

## Conditional Aggregations: SUMIFS, COUNTIFS, AVERAGEIFS

Standard aggregate functions look at a whole column. But what if you want to sum revenue *only* if the region is "East"? Or count the number of orders *only* if the transaction is over $5,000?

Excel provides a suite of conditional aggregation functions. 

> [!CAUTION]
> Excel contains legacy single-condition functions (`SUMIF`, `COUNTIF`, `AVERAGEIF`) and multi-condition functions (`SUMIFS`, `COUNTIFS`, `AVERAGEIFS`). 
> The order of arguments is **different** between them! 
> - In `SUMIF`, the range to sum is the **last** argument: `=SUMIF(range, criteria, sum_range)`.
> - In `SUMIFS`, the range to sum is the **first** argument: `=SUMIFS(sum_range, criteria_range1, criteria1, ...)`.
> 
> Because `SUMIFS` can do everything `SUMIF` does (even with a single condition) and maintains a cleaner syntax for scaling, modern database analysts recommend **always using the plural versions (SUMIFS, COUNTIFS, AVERAGEIFS)**.

---

## Code / Practical Walkthroughs

Let's work through hands-on examples using realistic corporate datasets.

### Walkthrough 1: Customer Tiering & Bonus Calculations

You are a business analyst. You need to assign performance tiers and calculate commission bonuses for the following sales team.

#### Example Data Table

| | A (Rep Name) | B (Region) | C (Sales Revenue) | D (Quota) | E (Tier) | F (Bonus) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Rep Name** | **Region** | **Revenue** | **Quota** | **Tier** | **Bonus** |
| **2** | Sarah Chen | West | 125000 | 100000 | | |
| **3** | Mike Patel | East | 89000 | 100000 | | |
| **4** | Lisa Nguyen | West | 156000 | 120000 | | |
| **5** | James Wilson | South | 92000 | 100000 | | |
| **6** | Amy Rodriguez | East | 143000 | 120000 | | |
| **7** | Tom Garcia | South | 67000 | 80000 | | |

#### Formulas

We will write two formulas:
1. In Column E, use `IFS` to classify each rep into a tier based on their revenue:
   - `>= 150000` → `"Platinum"`
   - `>= 100000` → `"Gold"`
   - `>= 75000` → `"Silver"`
   - Anything less → `"Bronze"`
2. In Column F, calculate a bonus. A rep receives a bonus *only* if they hit or exceeded their Quota **AND** their revenue is greater than $100,000. The bonus is `5%` of their revenue; otherwise, they receive `$0`.

```excel
' 1. Classify Tier (in cell E2):
=IFS(C2>=150000, "Platinum", C2>=100000, "Gold", C2>=75000, "Silver", TRUE, "Bronze")

' 2. Calculate Bonus using AND inside IF (in cell F2):
=IF(AND(C2>=D2, C2>100000), C2*0.05, 0)
```

#### Tracing Excel’s Calculations

Let's walk through row-by-row evaluations of the formulas:

- **Sarah Chen (Row 2):**
  - **Tier:** `=IFS(125000>=150000 (False), 125000>=100000 (True) → "Gold")`. Stops evaluation. Output: `"Gold"`.
  - **Bonus:** `=IF(AND(125000>=100000 (True), 125000>100000 (True)) (AND is True) → 125000*0.05)`. Output: `6250`.
- **Mike Patel (Row 3):**
  - **Tier:** `=IFS(89000>=150000 (False), 89000>=100000 (False), 89000>=75000 (True) → "Silver")`. Output: `"Silver"`.
  - **Bonus:** `=IF(AND(89000>=100000 (False), 89000>100000 (False)) (AND is False) → 0)`. Output: `0`.
- **Lisa Nguyen (Row 4):**
  - **Tier:** `=IFS(156000>=150000 (True) → "Platinum")`. Output: `"Platinum"`.
  - **Bonus:** `=IF(AND(156000>=120000 (True), 156000>100000 (True)) (AND is True) → 156000*0.05)`. Output: `7800`.
- **James Wilson (Row 5):**
  - **Tier:** `=IFS(92000>=150000 (False), 92000>=100000 (False), 92000>=75000 (True) → "Silver")`. Output: `"Silver"`.
  - **Bonus:** `=IF(AND(92000>=100000 (False), 92000>100000 (False)) (AND is False) → 0)`. Output: `0`.
- **Amy Rodriguez (Row 6):**
  - **Tier:** `=IFS(143000>=150000 (False), 143000>=100000 (True) → "Gold")`. Output: `"Gold"`.
  - **Bonus:** `=IF(AND(143000>=120000 (True), 143000>100000 (True)) (AND is True) → 143000*0.05)`. Output: `7150`.
- **Tom Garcia (Row 7):**
  - **Tier:** `=IFS(67000>=150000 (False), 67000>=100000 (False), 67000>=75000 (False), TRUE (True) → "Bronze")`. Output: `"Bronze"`.
  - **Bonus:** `=IF(AND(67000>=80000 (False), 67000>100000 (False)) (AND is False) → 0)`. Output: `0`.

The resulting table looks like this:

```text
# Output:
[E2:F7]
Sarah Chen:    Tier = Gold,     Bonus = 6250
Mike Patel:    Tier = Silver,   Bonus = 0
Lisa Nguyen:   Tier = Platinum, Bonus = 7800
James Wilson:  Tier = Silver,   Bonus = 0
Amy Rodriguez: Tier = Gold,     Bonus = 7150
Tom Garcia:    Tier = Bronze,   Bonus = 0
```

---

### Walkthrough 2: Multi-Criteria Sales Summary (SUMIFS, COUNTIFS, AVERAGEIFS)

Now, suppose you are asked to generate a summary dashboard to analyze performance. You have a transaction database of purchases.

#### Example Data Table

| | A | B | C | D |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Date** | **Region** | **Product** | **Revenue** |
| **2** | 2026-01-05 | East | Laptop | 1500 |
| **3** | 2026-01-08 | West | Phone | 800 |
| **4** | 2026-01-12 | East | Tablet | 600 |
| **5** | 2026-01-15 | East | Laptop | 1500 |
| **6** | 2026-01-18 | West | Laptop | 1500 |
| **7** | 2026-01-22 | East | Phone | 800 |
| **8** | 2026-01-25 | West | Tablet | 600 |
| **9** | 2026-01-28 | East | Laptop | 1500 |

#### Tasks:
1. Calculate the total Laptop revenue generated *only* in the **East** region.
2. Count the number of Laptop transactions that occurred in the **East** region.
3. Calculate the average purchase revenue for **all products** in the **West** region.

#### Formulas

```excel
' 1. Total East Laptop Revenue (SUMIFS):
=SUMIFS(D2:D9, B2:B9, "East", C2:C9, "Laptop")

' 2. Count East Laptop Transactions (COUNTIFS):
=COUNTIFS(B2:B9, "East", C2:C9, "Laptop")

' 3. Average West Revenue (AVERAGEIFS):
=AVERAGEIFS(D2:D9, B2:B9, "West")
```

#### Tracing Excel’s Calculations

1. **`SUMIFS(D2:D9, B2:B9, "East", C2:C9, "Laptop")`**:
   - Excel scans Column B for `"East"` and Column C for `"Laptop"`.
   - Match found in Row 2 (1500), Row 5 (1500), and Row 9 (1500).
   - Calculation: `1500 + 1500 + 1500` = `4500`.
   - *Result:* `4500`

2. **`COUNTIFS(B2:B9, "East", C2:C9, "Laptop")`**:
   - Excel scans Column B for `"East"` and Column C for `"Laptop"`.
   - Matches found in Row 2, Row 5, and Row 9.
   - *Result:* `3`

3. **`AVERAGEIFS(D2:D9, B2:B9, "West")`**:
   - Excel scans Column B for `"West"`.
   - Match found in Row 3 (800), Row 6 (1500), and Row 8 (600).
   - Calculation: `(800 + 1500 + 600) / 3` = `2900 / 3` = `966.67`.
   - *Result:* `966.67`

The summary metrics evaluate as:

```text
# Output:
East Laptop Revenue:  4500
East Laptop Count:    3
West Average Revenue: 966.67
```

---

### Walkthrough 3: Error Isolation (IFERROR and IFNA)

You are pulling employee designations using a lookup table. However, some designations are missing, which creates `#N/A` errors, and some calculations division-by-zero errors.

#### Example Data Table

| | A | B | C | D |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Rep Name** | **Lookup Designation** | **Raw Commission** | **Sales Transactions** |
| **2** | Sarah Chen | Gold | 15000 | 25 |
| **3** | Mike Patel | #N/A | 12000 | 0 |
| **4** | Lisa Nguyen | Platinum | 20000 | 40 |

#### Formulas

```excel
' 1. Gracefully handle lookup errors in Column B (in cell B2):
=IFNA(B2, "Designation Pending")

' 2. Calculate Comm per Transaction and handle zero division errors (in cell E2):
=IFERROR(C2/D2, 0)
```

#### Tracing Excel’s Calculations

- **Mike Patel (Row 3):**
  - Designation: `=IFNA(#N/A, "Designation Pending")` → Returns `"Designation Pending"` (It caught the lookup failure and output a clean string).
  - Comm per Transaction: `=IFERROR(12000 / 0, 0)` → Returns `0` (Instead of showing `#DIV/0!`, Excel returned `0` because it detected a math error).

```text
# Output:
Mike Patel Designation: Designation Pending
Mike Patel Comm/Trans:  0
```

---

## Edge Cases & Common Mistakes

Even intermediate users can fall into logic traps. Here are the gotchas to look out for.

### 1. Tier Logic Evaluation Order
When using `IFS` or nested `IF` statements with inequalities (`>`, `>=`, `<`, `<=`), **the order of conditions is critical.**

```excel
' BAD LOGIC:
=IFS(C2>=50000, "Silver", C2>=100000, "Gold", C2>=150000, "Platinum")
```

If cell `C2` contains `160,000`:
- Excel checks `160,000 >= 50,000`. This is `TRUE`.
- Excel immediately stops and outputs **`"Silver"`**! The rep has missed out on their Platinum status because the check for Silver happened first.
- **Rule:** When using `>=` (greater than or equal to), always sort your conditions from **highest to lowest** value. When using `<=` (less than or equal to), sort from **lowest to highest** value.

### 2. Double Quotes for Strings in Criteria
When using criteria in `SUMIFS` or `COUNTIFS`, any math operators (like `>`, `<`, `<>`) must be enclosed in double quotes. If you are comparing against a cell reference, you must use the ampersand (`&`) to join the operator string with the cell.

```excel
' BAD: Will throw a name error or fail to parse:
=SUMIFS(D2:D9, B2:B9, West)
=SUMIFS(D2:D9, D2:D9, >1000)

' GOOD: Correct quote wrapping:
=SUMIFS(D2:D9, B2:B9, "West")
=SUMIFS(D2:D9, D2:D9, ">1000")

' GOOD: Dynamic cell reference syntax:
=SUMIFS(D2:D9, D2:D9, ">"&F1)
```

### 3. The Blanket IFERROR Trap
Wrapping an entire workbook's calculations in `IFERROR` is a dangerous practice. 

```excel
' DANGEROUS:
=IFERROR(SUMIFS(D2:D9, B2:B9, "East") / F1, 0)
```

If you make a typo inside the `SUMIFS` function name, or if you delete a column creating a `#REF!` error, `IFERROR` will catch it and return `0`. You will never know that your formula is completely broken under the hood.
- **Rule:** Use `IFNA` specifically for lookups to catch missing records. Only use `IFERROR` on highly targeted calculations (like division) where you have predicted and verified the specific error case.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Building a Tiered Commission Plan
You are designing a payroll sheet for a retail sales team. 

| Employee | Total Sales | Commission |
| :--- | :--- | :--- |
| Frank | 12000 | |
| Grace | 45000 | |
| Heidi | 85000 | |
| Ivan | 150000 | |

**Task:**
1. Write a formula to calculate a tiered commission using these rules:
   - Sales up to `$20,000` get a **1%** commission.
   - Sales between `$20,001` and `$80,000` get a **3%** commission.
   - Sales over `$80,000` get a **5%** commission.
2. Ensure you use cell references for the thresholds and rates rather than hardcoding them, and lock them so they can be dragged down.

---

### Exercise 2: Dashboard Metrics for a Regional Manager
Using this transaction dataset:

| Date | Store ID | Manager | Sales | Returns | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-02-01 | Store-A | Julia | 25000 | 1200 | Active |
| 2026-02-02 | Store-B | Carlos | 18000 | 0 | Active |
| 2026-02-03 | Store-A | Julia | 32000 | 4500 | Active |
| 2026-02-04 | Store-C | Lin | 12000 | 800 | Pending |
| 2026-02-05 | Store-B | Carlos | 21000 | 1500 | Active |

**Task:**
1. Calculate the total Sales for manager `Julia` (SUMIFS).
2. Count the number of active transactions where returns were greater than `$1,000`.
3. Calculate the average sales for store `Store-B` when the Status is `"Active"`.

---

## Section Recaps

- **IF Statements:** Act as logic switches. Syntax: `=IF(test, true_output, false_output)`.
- **IFS:** Simplifies multiple logical tests. Always add `TRUE, "Default"` at the end to catch edge cases and prevent `#N/A` errors.
- **AND/OR/NOT:** Combine comparisons. Remember to nest them inside the function call, e.g., `=IF(AND(A, B), TrueVal, FalseVal)`.
- **SUMIFS / COUNTIFS / AVERAGEIFS:** Put the result range first (except for `COUNTIFS`, which has no result range). Criteria parameters require quotation marks for operators: `">50"`.

---

## Common Interview Questions

### Q1: Why does `IFS` return a `#N/A` error and how do you prevent it?

**Answer:** 
The `IFS` function evaluates conditions sequentially. If none of the conditions you wrote evaluate to `TRUE`, Excel does not know what to output and throws a `#N/A` (Not Available) error.

To prevent this, you must write a default catch-all argument at the very end of your condition list. By writing `TRUE` as the final condition, Excel will always evaluate that final check as true if all previous checks failed. You then pair it with your default value:
`=IFS(Condition1, Value1, Condition2, Value2, TRUE, "Default Value")`.

---

### Q2: What is the syntax difference between `SUMIF` and `SUMIFS`? Why is this difference important to remember?

**Answer:** 
The syntax difference lies in the position of the `sum_range` argument:
- **`SUMIF` (Single condition):** `=SUMIF(range, criteria, [sum_range])` -> The sum range is at the **end**.
- **`SUMIFS` (Multiple conditions):** `=SUMIFS(sum_range, criteria_range1, criteria1, ...)` -> The sum range is at the **beginning**.

This difference is important because if you attempt to convert a `SUMIF` formula to a `SUMIFS` formula by simply adding criteria parameters at the end, Excel will throw a formula syntax error or attempt to evaluate your criteria range as the sum range, returning incorrect numbers. Modern best practice is to use `SUMIFS` exclusively to maintain syntax consistency.

---

### Q3: How do you check if a cell contains duplicate records using `COUNTIF`?

**Answer:** 
You can use `COUNTIF` to check for duplicates by referencing the entire column range and checking if the output is greater than 1.

For example, if you have user IDs in Column A starting in cell `A2`, you write this formula in an adjacent column:
`=COUNTIF(A:A, A2) > 1`
- If the ID is unique, the function returns `FALSE`.
- If the ID appears elsewhere in the column, the function returns `TRUE`.

You can wrap this in an `IF` statement to display `"Duplicate"` or `"Unique"`, or apply it inside a Conditional Formatting custom rule to automatically highlight duplicate cells in red.

---

### Q4: Explain the difference in behavior between `AND()` and `OR()` functions when combined with an `IF` statement.

**Answer:** 
The difference lies in how many conditions must pass to trigger the `value_if_true` path:
- **`AND()`:** Expects all logical arguments inside it to evaluate to `TRUE`. If even one argument is `FALSE`, the entire `AND()` evaluates to `FALSE`, and the `IF` statement triggers the `value_if_false` output.
- **`OR()`:** Expects at least one of the logical arguments inside it to evaluate to `TRUE`. The only way the `OR()` function evaluates to `FALSE` is if every single argument inside it is `FALSE`.

For example, `=IF(AND(Region="East", Sales>1000), "Yes", "No")` requires **both** conditions to be met for a "Yes". `=IF(OR(Region="East", Sales>1000), "Yes", "No")` returns "Yes" if the region is East (regardless of sales size) OR if sales are above 1000 (regardless of region).

---

### Q5: If an interviewer asks you to write a formula to calculate commission where employees are paid 10% on sales *over* their quota, but nothing if they miss quota, what formula would you write?

**Answer:** 
I would write a formula combining a logical comparison and arithmetic subtraction:
`=IF(Sales > Quota, (Sales - Quota) * 10%, 0)`
- **`Sales > Quota`:** Evaluates if the employee qualified for the commission.
- **`(Sales - Quota) * 10%`:** Calculates the commission rate specifically on the surplus sales amount above quota (using parentheses to ensure subtraction happens before multiplication).
- **`0`:** Ensures that employees who missed or exactly met their quota receive `$0` commission rather than a negative payout.
