---
title: "What-If Analysis — Goal Seek, Data Tables & Scenarios"
description: "Master sensitivity analysis and scenario planning in Excel — Goal Seek, one/two-variable data tables, and Scenario Manager for business planning."
category: "excel"
order: 103
phase: 3
tags: ["excel", "what-if", "goal-seek", "data-tables", "scenarios"]
publishedDate: 2025-03-25
prevSlug: "statistical-functions"
nextSlug: "advanced-formulas"
seoTitle: "Excel What-If Analysis Tutorial | Datalogify"
seoDescription: "Learn Excel What-If analysis tools. Step-by-step tutorial on Goal Seek, One/Two-Variable Data Tables, and Scenario Manager for business decision making."
---

## Why This Matters: The Flight Simulator for Business

Before a commercial pilot takes off with hundreds of passengers on board, they spend hours in a flight simulator. The simulator exposes them to different conditions: "What if there is a crosswind of 40 knots? What if the left engine fails? What if we encounter heavy icing?" The pilot can test these variables safely on the ground, seeing exactly how the aircraft responds, without risking a crash.

**What-If Analysis tools are the flight simulator for your business.**

Every business decision is based on a set of assumptions: growth rates, unit costs, pricing strategies, and customer demand. If you build a financial model and test these assumptions by manually overwriting cell values one-by-one, you are likely to make mistakes, lose your original inputs, and miss key insights. 

Excel's What-If Analysis tools allow you to stress-test your business model. You can run hundreds of different scenarios instantly, finding the inputs you need to hit your targets and mapping out the boundaries of profitability. Whether you are valuing a startup, structuring a commercial loan, or designing a pricing strategy, What-If analysis is the core of financial modeling.

---

## The What-If Toolkit Overview

Excel provides three primary built-in tools under the **Data → Forecast group → What-If Analysis** menu. Each is designed for a specific analytical workflow:

| Tool | Core Mechanism | Analytical Purpose | Business Question |
| :--- | :--- | :--- | :--- |
| **Goal Seek** | Iterative back-solving for a single variable | Find the required input to reach a specific target value | *"How many units must we sell to hit a net profit of ₹5,00,000?"* |
| **One-Variable Data Table** | Sensitivity analysis with one input and multiple outputs | Test a range of values for a single variable and see the impact on multiple metrics | *"How does changing our unit price from ₹200 to ₹600 impact our net profit, tax liability, and gross margin?"* |
| **Two-Variable Data Table** | Sensitivity matrix with two inputs and one output | Test combinations of two variables simultaneously to map a matrix of outcomes | *"What is our net profit at every combination of Unit Price (₹200-₹600) and Unit Volume (5,00,000-15,00,000)?"* |
| **Scenario Manager** | Multi-variable scenario comparison | Define and switch between named sets of up to 32 variables to compare cases | *"What does our budget look like under a Best Case, Base Case, and Worst Case economic scenario?"* |

---

## Goal Seek — Back-Solving for a Target

Goal Seek is a reverse-engineering tool. When you know the specific result you want from a formula, but don't know the input value required to achieve it, Goal Seek solves for it using an iterative approximation method.

### The Profit Model Setup

Let's build a basic profit-and-loss model for a new product launch:

| Cell | Label | Formula / Value | Initial Value |
| :--- | :--- | :--- | :--- |
| **B1** | Price per Unit | Value | ₹450 |
| **B2** | Units Sold | Value | 1,200 |
| **B3** | Revenue | `=B1*B2` | ₹5,40,000 |
| **B4** | Fixed Overhead Costs | Value | ₹1,80,000 |
| **B5** | Variable Cost per Unit | Value | ₹180 |
| **B6** | Total Variable Costs | `=B5*B2` | ₹2,16,000 |
| **B7** | Total Operating Costs | `=B4+B6` | ₹3,96,000 |
| **B8** | Net Profit | `=B3-B7` | ₹1,44,000 |

### Step-by-Step Walkthrough: Solving for Break-Even Volume

Let's calculate the exact number of units we need to sell to break even (Net Profit = ₹0).

1. Ensure your spreadsheet contains the formulas as listed above.
2. Go to the ribbon: **Data → Forecast group → What-If Analysis → Goal Seek...**
3. In the Goal Seek dialog box, enter these three parameters:
   * **Set cell:** `B8` (The cell containing the formula you want to solve, which is Net Profit).
   * **To value:** `0` (The target value you want that formula to return).
   * **By changing cell:** `B2` (The input cell containing the variable you want to solve for, which is Units Sold).
4. Click **OK**.
5. Excel will run iterations and present a status box showing it has found a solution. Click **OK** to accept the changes.

```excel
=B2
```

```text
# Output:
Units Sold changes from 1,200 to 667.
Revenue: ₹3,00,150
Total Variable Costs: ₹1,20,060
Total Operating Costs: ₹3,00,060
Net Profit: ₹90 (effectively 0, allowing for rounding of unit counts)
```

This tells us our break-even volume is **667 units**. Any sales volume above this will generate profit, while sales below this will result in a loss.

<div class="interview-tip">
If asked about the limitations of Goal Seek, note that it can only change <strong>one variable cell at a time</strong>, it requires the target cell to contain a formula, and it can only solve for a single static value. If you need to optimize a cell (e.g., maximize profit) by changing multiple variables subject to constraints, you must use the <strong>Solver</strong> add-in instead.
</div>

---

## One-Variable Data Table — Testing Ranges with Multiple Outputs

A One-Variable Data Table allows you to test a range of values for a single input variable and see the impact on one or more output formulas. This is useful for sensitivity analysis, showing how sensitive your outputs are to changes in an input.

Unlike a two-variable table, a one-variable table allows you to track **multiple outputs simultaneously** in parallel columns.

### Setup: Testing Profit, Tax, and Margin at Various Price Points

Let's test how net profit, tax liability, and gross margin change at different price points, ranging from ₹300 to ₹700:

| Cell | Price Points (Input Column) | Net Profit (Output 1) | Tax Liability (Output 2) | Gross Margin % (Output 3) |
| :--- | :--- | :--- | :--- | :--- |
| **D1** | | `=B8` (Link to Profit) | `=B8*0.25` (Link to Tax) | `=(B3-B6)/B3` (Link to Margin) |
| **D2** | 300 | | | |
| **D3** | 350 | | | |
| **D4** | 400 | | | |
| **D5** | 450 | | | |
| **D6** | 500 | | | |
| **D7** | 550 | | | |
| **D8** | 600 | | | |
| **D9** | 650 | | | |
| **D10** | 700 | | | |

### Step-by-Step Walkthrough: Generating the Data Table

1. Set up the table as shown above. In cells `E1`, `F1`, and `G1`, reference the formulas you want to track.
2. Select the range `D1:G10` (including the formula headers in row 1 and the test values below them).
3. Go to the ribbon: **Data → Forecast group → What-If Analysis → Data Table...**
4. In the Data Table dialog box:
   * Leave **Row input cell** blank.
   * In **Column input cell**, enter `B1` (Price per Unit, because your test values are listed down a column).
5. Click **OK**.

```excel
=E2
```

```text
# Output:
Price ₹300 -> Profit: ₹-36,000, Tax: ₹0, Margin: 40.0%
Price ₹350 -> Profit: ₹24,000,  Tax: ₹6,000, Margin: 48.6%
Price ₹400 -> Profit: ₹84,000,  Tax: ₹21,000, Margin: 55.0%
Price ₹450 -> Profit: ₹1,44,000, Tax: ₹36,000, Margin: 60.0%
Price ₹500 -> Profit: ₹2,04,000, Tax: ₹51,000, Margin: 64.0%
Price ₹550 -> Profit: ₹2,64,000, Tax: ₹66,000, Margin: 67.3%
Price ₹600 -> Profit: ₹3,24,000, Tax: ₹81,000, Margin: 70.0%
```

Excel generates an array formula `{=TABLE(,B1)}` in the results cells. These values update automatically if you change the underlying profit model formulas.

---

## Two-Variable Data Table — The Sensitivity Matrix

A Two-Variable Data Table tests combinations of two input variables simultaneously, displaying the outcomes for a single output metric in a grid or matrix layout.

### Setup: Price vs. Volume Sensitivity Matrix

Let's analyze Net Profit across different combinations of **Price per Unit** and **Units Sold**:

| | 800 | 1,000 | 1,200 | 1,400 | 1,600 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **₹300** | | | | | |
| **₹400** | | | | | |
| **₹500** | | | | | |
| **₹600** | | | | | |
| **₹700** | | | | | |

### Step-by-Step Walkthrough: Building the Matrix

1. Set up the matrix layout. The column values (`D2:D6`) represent the price points. The row values (`E1:I1`) represent the volume counts.
2. In the top-left corner cell of the matrix (`D1`), link to the output cell: `=B8`.
3. Select the range `D1:I6` (the entire matrix, including the formula in cell `D1`).
4. Go to **Data → Forecast group → What-If Analysis → Data Table...**
5. In the Data Table dialog:
   * **Row input cell:** `B2` (Units Sold, since the volume values run horizontally across the row).
   * **Column input cell:** `B1` (Price per Unit, since the price values run vertically down the column).
6. Click **OK**.

```excel
=F4
```

```text
# Output (Net Profit Matrix in ₹):
            800 Units   1,00,0 Units  1,200 Units   1,400 Units   1,600 Units
Price ₹300  -84,000     -60,000       -36,000       -12,000       12,000
Price ₹400  -4,000      40,000        84,000        1,28,000      1,72,000
Price ₹500  76,000      1,40,000      2,04,000      2,68,000      3,32,000
Price ₹600  1,56,000    2,40,000      3,24,000      4,08,000      4,92,000
Price ₹700  2,36,000    3,40,000      4,44,000      5,48,000      6,52,000
```

---

## Scenario Manager — Multi-Variable Modeling

Scenario Manager allows you to define, save, and switch between named sets of input assumptions. It is useful for presenting different operational projections (such as Best, Base, and Worst Case scenarios) to stakeholders.

### The Budget Model Setup

Let's build a budget model that uses four variable cells:

| Cell | Variable | Base Case |
| :--- | :--- | :--- |
| **B1** | Revenue Growth Rate | 12% |
| **B2** | Cost Inflation Rate | 6% |
| **B3** | Operational Headcount | 15 |
| **B4** | Marketing Budget | ₹3,50,000 |

We also have a calculated output cell:
* **B8 (Projected Cash Flow):** `=PreviousCash*(1+B1) - PreviousCosts*(1+B2) - (B3*AverageSalary) - B4`

### Step-by-Step Walkthrough: Setting Up Scenarios

1. Go to **Data → Forecast group → What-If Analysis → Scenario Manager...**
2. Click the **Add...** button.
3. In the **Add Scenario** window:
   * **Scenario name:** `"Best Case"`
   * **Changing cells:** Select the range `B1:B4`.
   * Click **OK**.
4. Enter the values for this scenario:
   * B1 (Growth): `0.20` (20%)
   * B2 (Inflation): `0.04` (4%)
   * B3 (Headcount): `18`
   * B4 (Marketing): `450000`
   * Click **Add** to save it and start another.
5. Repeat the process to create the **Worst Case** scenario:
   * Scenario name: `"Worst Case"`
   * Changing cells: `B1:B4`
   * Enter values: B1 = `0.04` (4%), B2 = `0.09` (9%), B3 = `12`, B4 = `150000`.
6. Click **OK** to return to the main Scenario Manager dialog.

### Generating a Scenario Summary Report

To compare these scenarios side-by-side:
1. In the Scenario Manager dialog, click the **Summary...** button.
2. Under Report type, select **Scenario summary**.
3. In the **Result cells** box, enter `B8` (the cell containing the calculated cash flow formula).
4. Click **OK**.

Excel will generate a new sheet named **Scenario Summary** containing a structured comparison table:

```excel
=ScenarioSummary!$C$10
```

```text
# Output (Scenario Summary Report):
                       Current Values    Best Case    Worst Case
Changing Cells:
  Revenue Growth               12.0%        20.0%          4.0%
  Cost Inflation                6.0%         4.0%          9.0%
  Headcount                       15           18            12
  Marketing Budget        ₹3,50,000    ₹4,50,000     ₹1,50,000
Result Cells:
  Projected Cash Flow    ₹18,20,000   ₹32,40,000     ₹4,10,000
```

---

## Elite Modeling: Building a Dynamic Scenario Switcher

While Scenario Manager is useful, it is menu-driven and hard to link directly to interactive dashboard elements. Professional financial modelers often bypass Scenario Manager entirely, building dynamic scenario switchers using the `CHOOSE` or `INDEX` formulas.

### Setup: The Scenario Matrix

Create a scenario table in cells `A12:D15`:

| Index (Row) | Scenario Name | Growth Rate | Variable Cost per Unit | Marketing Spend |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Conservative | 5% | ₹210 | ₹1,50,000 |
| **2** | Moderate | 12% | ₹180 | ₹3,50,000 |
| **3** | Aggressive | 20% | ₹150 | ₹5,50,000 |

Create an interactive selector cell:
* **Cell F1:** A dropdown list containing the values `1`, `2`, and `3`.

### The Dynamic Formulas

Link your model inputs directly to the switcher cell using `INDEX`:

```excel
B1 (Growth Rate): =INDEX(C13:C15, $F$1)
```

```excel
B5 (Variable Cost): =INDEX(D13:D15, $F$1)
```

```excel
B4 (Marketing Spend): =INDEX(E13:E15, $F$1)
```

```text
# Output:
When F1 = 1 (Conservative), cell B1 changes to 5%, B5 to ₹210, and B4 to ₹1,50,000.
The entire profit-and-loss model updates instantly.
This approach makes your workbook dynamic, allowing stakeholders to switch scenarios 
using a dropdown menu without accessing the What-If Analysis dialog box.
```

---

## Edge Cases & Common Mistakes (Gotchas)

### 1. Data Tables Do Not Recalculate
**The Problem:** You change the values in your model, but the values in your Data Table do not update.
**The Fix:** Go to **Formulas → Calculation Options** and check if it is set to **Automatic Except Tables**. Excel default settings sometimes disable automatic recalculation for data tables because large tables can slow down performance. Change this option to **Automatic**, or press **F9** to manually force a recalculation.

### 2. Goal Seek Fails to Converge
**The Problem:** Goal Seek runs through hundreds of iterations but cannot find a solution, returning a value that is far off from your target.
**The Fix:** This occurs when there is a break in the formula chain between your input cell and your output cell, or if the relationship is non-linear. Check that all formulas are linked correctly, or increase the maximum iterations and accuracy in **File → Options → Formulas → Calculation options**.

### 3. Overwriting Data Table Formulas
**The Problem:** Trying to delete a single cell's value inside a generated data table returns the error *"You cannot change part of a data table."*
**The Fix:** Data tables are created as array formulas. To change them, you must select the entire results range (e.g., `E2:I6`) and press **Delete** to clear the table, then recreate it.

---

## Practice Exercises

### Exercise 1: Loan Amortization Sensitivity
**Dataset:** You are modeling a commercial property loan with these parameters:

| Cell | Parameter | Value |
| :--- | :--- | :--- |
| **B1** | Loan Principal | ₹1,50,00,000 |
| **B2** | Annual Interest Rate | 8.5% |
| **B3** | Loan Term (Years) | 15 |
| **B4** | Monthly Payment | `=PMT(B2/12, B3*12, -B1)` |

**Your Task:**
1. Use **Goal Seek** to find: What annual interest rate is required to keep the monthly payment at exactly **₹1,00,000**? Record the rate.
2. Reset the rate to 8.5%. Build a **Two-Variable Data Table** displaying the monthly payment across different combinations of Interest Rate (**6.0% to 11.0%** in 1% steps) and Loan Term (**10, 15, 20, 25, and 30 years**).
3. Apply conditional formatting to highlight payments under ₹1,20,000 in green.

### Exercise 2: Capital Budgeting NPV Sensitivity Analysis
**Dataset:** You are evaluating an infrastructure project:
* Initial Investment: ₹5,00,00,000
* Annual Cash Inflow (Years 1-5): ₹1,50,00,000
* Cost of Capital (Discount Rate): 10%
* NPV formula: `=NPV(DiscountRate, Inflows) - Investment`

**Your Task:**
1. Set up this model in a worksheet.
2. Build a **One-Variable Data Table** displaying the NPV at discount rates ranging from **6% to 15%** in 1% steps.
3. Use Goal Seek to find the exact **Internal Rate of Return (IRR)** where NPV is exactly 0. Verify the result using the `=IRR()` function.

---

## Section Recaps

* **Goal Seek:** Reverse-solves formulas by changing one input to hit a target output.
* **One-Variable Data Tables:** Test variations of a single input to see the impact on multiple output formulas.
* **Two-Variable Data Tables:** Create a matrix showing the output of a single formula across combinations of two inputs.
* **Scenario Manager:** Saves and compares named sets of input assumptions (e.g., Best, Base, and Worst Case) and generates comparison summary sheets.
* **Scenario Switchers:** A formula-based alternative using `INDEX` and dropdowns that makes models dynamic.

---

## Common Interview Questions

### Q1: When would you use a Data Table instead of Goal Seek?
**Answer:** Use **Goal Seek** when you have a specific target output in mind and need to find the single input value that achieves it. 

Use a **Data Table** when you want to run a sensitivity analysis, testing a wide range of input values to see how they impact your outputs. Goal Seek returns a single solution, while Data Tables generate a range of outcomes, helping you identify trends, risk boundaries, and break-even points.

### Q2: What does the error message "You cannot change part of a data table" mean, and how do you resolve it?
**Answer:** This error occurs because Excel handles the results of a Data Table as a single array formula (using the `{=TABLE()}` function). Excel does not allow you to modify or delete individual cells within an array's output range to protect the mathematical integrity of the table. 

To resolve this, you must select the **entire range** of cells populated by the table, delete the entire block, make your changes, and then recreate the data table.

### Q3: How do you configure a Two-Variable Data Table? What goes in the Row and Column input cells?
**Answer:** To configure a Two-Variable Data Table:
1. Place the formula you want to test in the top-left corner cell of your table grid (e.g., cell `D1`).
2. List the values for your first input variable horizontally in the top row (e.g., `E1:I1`).
3. List the values for your second input variable vertically in the left column (e.g., `D2:D6`).
4. Select the entire range (`D1:I6`).
5. Open the Data Table dialog box. Set the **Row input cell** to the model cell linked to the variables in the top row. Set the **Column input cell** to the model cell linked to the variables in the left column.

### Q4: What is the limitation of the Scenario Manager compared to writing custom formulas for scenario analysis?
**Answer:** The primary limitation of Scenario Manager is that it is a menu-driven tool rather than a formula-driven one. 

Switching between scenarios requires opening the dialog box and clicking "Show", which makes it less dynamic. The inputs are also hardcoded into the Scenario Manager, so they do not update automatically if the rest of your model changes. For dynamic models, analysts often build scenario switchers using the `CHOOSE` or `XLOOKUP` functions linked to a dropdown list cell.

### Q5: How does the Solver add-in differ from Goal Seek?
**Answer:** While Goal Seek can only change a single variable to reach a specific target value, **Solver** is a linear and non-linear optimization tool. 

Solver can change **multiple variables** simultaneously to find an optimal value (such as maximizing profit or minimizing cost). It also allows you to define **constraints** (e.g., production capacity cannot exceed 10,000 units, or advertising spend must be at least ₹50,000).
