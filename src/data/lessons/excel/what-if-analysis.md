---
title: "What-If Analysis — Goal Seek, Data Tables & Scenarios"
description: "Test different assumptions and find target values — Goal Seek, one/two-variable data tables, and Scenario Manager for business modeling."
category: "excel"
order: 103
phase: 3
tags: ["excel", "what-if", "goal-seek", "data-tables", "scenarios"]
publishedDate: 2025-03-25
prevSlug: "statistical-functions"
nextSlug: "advanced-formulas"
seoTitle: "Excel What-If Analysis Tutorial | Datalogify"
seoDescription: "Master Excel What-If analysis — Goal Seek, Data Tables, Scenario Manager for business modeling."
---

## Why This Matters

Every business decision is a bet on assumptions. "What if we raise prices 10%? What volume do we need to break even? What happens in a recession?" What-If analysis tools let you stress-test these assumptions in seconds instead of rebuilding spreadsheets from scratch. This is the core of financial modeling.

---

## The Three What-If Tools

| Tool | What It Does | When to Use |
|---|---|---|
| **Goal Seek** | Finds the INPUT needed to hit a TARGET output | "What sales volume do I need for ₹10L profit?" |
| **Data Table** | Tests MANY input values at once and shows all results | "Show me profit at every price point from ₹100 to ₹500" |
| **Scenario Manager** | Saves and compares NAMED sets of assumptions | "Compare Best Case, Worst Case, and Base Case side-by-side" |

---

## Goal Seek — Reverse Engineering

Goal Seek works backwards. You know the answer you want — it finds the input that gets you there.

### Business Setup: Break-Even Analysis

Build this simple profit model:

| Cell | Label | Value |
|---|---|---|
| B1 | Price per Unit | ₹500 |
| B2 | Units Sold | 1,000 |
| B3 | Revenue | (formula) |
| B4 | Fixed Costs | ₹2,00,000 |
| B5 | Variable Cost per Unit | ₹200 |
| B6 | Total Variable Costs | (formula) |
| B7 | Total Costs | (formula) |
| B8 | Profit | (formula) |

### Formulas

```text
B3: =B1*B2
```

```text
Revenue: ₹5,00,000
```

```text
B6: =B5*B2
```

```text
Total Variable Costs: ₹2,00,000
```

```text
B7: =B4+B6
```

```text
Total Costs: ₹4,00,000
```

```text
B8: =B3-B7
```

```text
Profit: ₹1,00,000
```

### Using Goal Seek

**Question:** "How many units do we need to sell for ₹3,00,000 profit?"

1. Go to **Data → What-If Analysis → Goal Seek**
2. Set cell: **B8** (Profit)
3. To value: **300000**
4. By changing cell: **B2** (Units Sold)
5. Click **OK**

```text
Result: Units Sold changes to 1,667

Verification: 1,667 × ₹500 = ₹8,33,500 revenue
             1,667 × ₹200 = ₹3,33,400 variable costs
             ₹2,00,000 fixed costs
             Profit = ₹8,33,500 - ₹5,33,400 = ₹3,00,100 ✓ (rounding)
```

### Another Goal Seek Example

**Question:** "What price per unit gives us exactly ₹0 profit?" (Break-even price)

1. Set cell: **B8** (Profit)
2. To value: **0**
3. By changing cell: **B1** (Price per Unit)

```text
Result: Price changes to ₹400

At ₹400 × 1,000 units = ₹4,00,000 revenue
Costs = ₹2,00,000 + (₹200 × 1,000) = ₹4,00,000
Profit = ₹0 ✓
```

<div class="interview-tip">
Goal Seek can only change ONE cell at a time. If you need to solve for multiple variables simultaneously, you need Solver (Data → Solver add-in). But Goal Seek handles 90% of "find the input" questions.
</div>

---

## One-Variable Data Table — Test Multiple Inputs

Goal Seek answers one question. A Data Table answers dozens at once.

### Business Question

"What's our profit at different price points — from ₹300 to ₹700?"

### Setup (Using the Same Profit Model)

1. In column **D**, list the price values you want to test:

| D | E |
|---|---|
| **Price Points** | **Profit** |
| 300 | |
| 350 | |
| 400 | |
| 450 | |
| 500 | |
| 550 | |
| 600 | |
| 650 | |
| 700 | |

2. In cell **E1**, enter a formula that references the profit cell:

```text
E1: =B8
```

3. Select the entire range **D1:E10** (headers through last price)
4. Go to **Data → What-If Analysis → Data Table**
5. **Column input cell:** B1 (Price per Unit — because your test values are in a column)
6. Leave **Row input cell** blank
7. Click **OK**

```text
Results:
Price ₹300  → Profit: -₹1,00,000 (loss!)
Price ₹350  → Profit: -₹50,000
Price ₹400  → Profit: ₹0 (break-even)
Price ₹450  → Profit: ₹50,000
Price ₹500  → Profit: ₹1,00,000
Price ₹550  → Profit: ₹1,50,000
Price ₹600  → Profit: ₹2,00,000
Price ₹650  → Profit: ₹2,50,000
Price ₹700  → Profit: ₹3,00,000
```

### What Just Happened

Excel substituted each price value into cell B1 (one at a time), recalculated the entire model, and captured the profit. You get a complete sensitivity analysis in one click.

### Reading the Results

```text
Key Insights:
- Break-even price is ₹400
- Every ₹50 price increase adds ₹50,000 profit (linear relationship here)
- Below ₹400, we're losing money
- At ₹700, profit triples compared to ₹500
```

---

## Two-Variable Data Table — The Power Matrix

This is where it gets really powerful. Test TWO variables simultaneously.

### Business Question

"What's profit at different combinations of Price AND Units Sold?"

### Setup

1. Create a matrix layout:

|  | 500 | 750 | 1000 | 1250 | 1500 |
|---|---|---|---|---|---|
| **₹300** | | | | | |
| **₹400** | | | | | |
| **₹500** | | | | | |
| **₹600** | | | | | |
| **₹700** | | | | | |

- **Row headers** (top): Units Sold values → in cells E1:I1
- **Column headers** (left): Price values → in cells D2:D6
- **Corner cell** (D1): Must contain the profit formula:

```text
D1: =B8
```

2. Select the entire range **D1:I6**
3. **Data → What-If Analysis → Data Table**
4. **Row input cell:** B2 (Units Sold — values run across the row)
5. **Column input cell:** B1 (Price — values run down the column)
6. Click **OK**

```text
Results (Profit in ₹):

              500 units   750 units   1,000 units   1,250 units   1,500 units
Price ₹300   -1,50,000   -1,25,000    -1,00,000      -75,000      -50,000
Price ₹400   -1,50,000     -50,000            0       50,000     1,00,000
Price ₹500     -50,000      25,000     1,00,000     1,75,000     2,50,000
Price ₹600      50,000    1,00,000     2,00,000     3,00,000     4,00,000
Price ₹700    1,50,000    1,75,000     3,00,000     4,25,000     5,50,000
```

### Reading the Matrix

```text
Key Insights:
- At ₹300, you LOSE money at every volume level (red zone)
- Break-even requires ₹400+ price AND 1,000+ units
- The "sweet spot" depends on what's realistic for your market
- ₹600 × 1,250 units = ₹3L profit (same as ₹700 × 1,000 units — trade-off!)
```

<div class="interview-tip">
Two-variable Data Tables are incredibly powerful for pricing analysis, loan amortization (interest rate × term), and capacity planning (headcount × utilization). If an interviewer asks about sensitivity analysis, this is the tool to mention.
</div>

---

## Formatting Data Tables for Presentations

Raw numbers are hard to scan. Add conditional formatting:

1. Select the data table results (not headers)
2. **Home → Conditional Formatting → Color Scales**
3. Choose Red-Yellow-Green (red = loss, green = profit)

Or use icon sets:

1. **Conditional Formatting → Icon Sets → 3 Arrows**
2. Green arrow ↑ for profit > 0
3. Yellow dash → for breakeven (= 0)
4. Red arrow ↓ for loss < 0

```text
Result: The matrix is now a heat map. Green cells jump out instantly — 
that's where the profitable combinations are.
```

---

## Scenario Manager — Named Assumption Sets

Scenario Manager lets you save different sets of assumptions and switch between them.

### Business Case: Annual Budget Planning

Your budget model has these variable cells:

| Cell | Assumption | Base Case |
|---|---|---|
| B1 | Revenue Growth Rate | 15% |
| B2 | Cost Inflation Rate | 8% |
| B3 | New Hires | 5 |
| B4 | Marketing Budget | ₹20,00,000 |

Your output cell:

```text
B10: =PreviousRevenue*(1+B1) - PreviousCosts*(1+B2) - B3*AvgSalary - B4
```

### Creating Scenarios

1. Go to **Data → What-If Analysis → Scenario Manager**
2. Click **Add**
3. **Scenario name:** "Best Case"
4. **Changing cells:** B1:B4
5. Enter values:

| Scenario | Growth | Inflation | Hires | Marketing |
|---|---|---|---|---|
| Base Case | 15% | 8% | 5 | ₹20,00,000 |
| Best Case | 25% | 5% | 8 | ₹30,00,000 |
| Worst Case | 5% | 12% | 2 | ₹10,00,000 |

6. Repeat for "Base Case" and "Worst Case"
7. Click **Show** to switch between scenarios — the spreadsheet updates instantly

### Scenario Summary Report

Click **Summary** in Scenario Manager:

```text
                      Base Case    Best Case    Worst Case
Revenue Growth          15%          25%           5%
Cost Inflation           8%           5%          12%
New Hires                 5            8            2
Marketing Budget    ₹20,00,000   ₹30,00,000   ₹10,00,000
─────────────────────────────────────────────────────────
Net Profit          ₹18,50,000   ₹42,30,000    ₹3,20,000
```

```text
Key Insight: Profit ranges from ₹3.2L (worst) to ₹42.3L (best).
The base case of ₹18.5L is the planning target.
The worst case is still profitable — the business is resilient.
```

---

## When to Use Each Tool

| Situation | Tool | Why |
|---|---|---|
| "What input gives me this output?" | Goal Seek | Reverse-solves one variable |
| "Show me results for many values of one input" | One-Variable Data Table | Sensitivity analysis |
| "Show me a matrix of two inputs" | Two-Variable Data Table | Pricing / volume / rate analysis |
| "Compare named scenarios side-by-side" | Scenario Manager | Board presentations, budget reviews |
| "Optimize with constraints" | Solver (add-in) | Complex optimization beyond What-If |

---

## Real-World Financial Modeling Example

### Loan Payment Analysis

You're evaluating a business loan:

| Cell | Item | Value |
|---|---|---|
| B1 | Loan Amount | ₹50,00,000 |
| B2 | Annual Interest Rate | 10% |
| B3 | Loan Term (Years) | 5 |
| B4 | Monthly Payment | (formula) |

```text
B4: =PMT(B2/12, B3*12, -B1)
```

```text
Monthly Payment: ₹1,06,235
```

### Goal Seek: "What rate gives me ₹90,000/month payment?"

```text
Set cell: B4
To value: 90000
By changing: B2

Result: Interest rate = 5.87%
You need a rate below 5.87% to keep payments under ₹90K/month.
```

### Two-Variable Data Table: Rate × Term Matrix

```text
Monthly Payment at different Rate × Term combinations:

           3 Years     5 Years     7 Years     10 Years
Rate 8%    ₹1,56,688   ₹1,01,380   ₹77,866    ₹60,664
Rate 10%   ₹1,61,337   ₹1,06,235   ₹83,014    ₹66,075
Rate 12%   ₹1,66,073   ₹1,11,221   ₹88,327    ₹71,735
Rate 14%   ₹1,70,895   ₹1,16,335   ₹93,797    ₹77,629

Insight: Going from 5-year to 7-year term at 10% saves ₹23K/month
but costs ₹13.7L extra in total interest.
```

---

## Where This Is Used in Real Jobs

| Role | What-If Analysis Used For |
|---|---|
| Financial Analyst | Revenue projections, loan analysis, budget scenarios |
| Business Analyst | Break-even analysis, pricing strategy, demand modeling |
| FP&A Analyst | Best/worst/base case scenarios for board decks |
| Operations Manager | Capacity planning — staff × utilization × cost |
| Startup Founder | Runway analysis — burn rate × revenue × funding scenarios |

---

<div class="challenge">

### Challenge: Build a Startup Runway Model

**Setup:** Create a model with these inputs:
- Starting Cash: ₹1,00,00,000
- Monthly Revenue: ₹3,00,000
- Monthly Revenue Growth: 10%
- Monthly Burn (Costs): ₹8,00,000
- Monthly Cost Increase: 3%

**Output formula:** Calculate months until cash = 0 (runway)

**Tasks:**
1. Use **Goal Seek** to find: What monthly revenue growth rate gives you 24 months of runway?
2. Build a **One-Variable Data Table** showing runway at growth rates from 5% to 20%
3. Build a **Two-Variable Data Table** showing runway at different Revenue Growth × Burn Rate combinations
4. Create **three Scenarios** (Conservative: 5% growth/₹10L burn, Moderate: 10%/₹8L, Aggressive: 20%/₹6L) and generate a Summary report

**Bonus:** Add conditional formatting to highlight any scenario with runway < 12 months in red.

</div>

---

## Common Interview Questions

### Q1: What is Goal Seek and when would you use it?

**Answer:** Goal Seek is a What-If tool that finds the input value needed to achieve a specific output. For example, "What unit price do I need to achieve ₹5L profit?" You set the target cell (Profit), the desired value (500000), and which cell to change (Price). Excel iterates to find the answer. Use it when you know the desired result but need to find the required input.

### Q2: What's the difference between a one-variable and two-variable Data Table?

**Answer:** A one-variable Data Table tests multiple values for ONE input (e.g., profit at 10 different price points). A two-variable Data Table creates a matrix testing every combination of TWO inputs (e.g., profit at every Price × Volume combination). One-variable gives a list; two-variable gives a grid. Two-variable is more powerful but limited to exactly two inputs and one output.

### Q3: How would you present Best/Worst/Base Case analysis to leadership?

**Answer:** Use Scenario Manager to define three named scenarios with different assumptions (revenue growth, costs, headcount). Generate a Scenario Summary report showing all inputs and outputs side-by-side. Present the base case as the planning target, use worst case to show the floor (is it survivable?), and best case to show upside opportunity. Always clearly state which assumptions drive the biggest variance between scenarios.

### Q4: Can a Data Table be used for sensitivity analysis?

**Answer:** Yes — Data Tables are the primary Excel tool for sensitivity analysis. A one-variable table shows how output changes as one input varies. A two-variable table is a full sensitivity matrix. The key advantage over manual what-if testing is speed and completeness — you see ALL combinations at once, making it easy to identify break-even points, thresholds, and optimal ranges. Add conditional formatting to make the sensitivity heat map visual.

### Q5: What are the limitations of Goal Seek?

**Answer:** Goal Seek can only change one input cell at a time and finds only one solution (it may miss multiple valid answers). It requires a formula-based relationship between the input and output cells. It uses iterative approximation, so results may be slightly off due to rounding. For problems with multiple variables, constraints, or optimization objectives, you need the Solver add-in instead. Also, Goal Seek changes the actual cell value — there's no undo history, so note down original values.
