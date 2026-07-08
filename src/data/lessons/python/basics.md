---
title: "Python Basics — Variables, Print & Input"
description: "Master Python variables, print statements, f-strings, and user input — the building blocks every data analyst needs."
category: "python"
order: 1
phase: 1
tags: ["python", "basics", "variables", "print"]
publishedDate: 2025-01-15
prevSlug: ""
nextSlug: "data-types"
seoTitle: "Python Basics for Data Analytics — Variables, Print, Input | Datalogify"
seoDescription: "Learn Python variables, print, f-strings, and input with hands-on code examples for data analytics beginners."
---

## Why This Matters

Every data analytics workflow starts here. Variables hold your data. Print shows your results. Master these and everything else — Pandas, SQL, dashboards — clicks into place.

## Variables and Assignment

A variable is a name that points to a value. You'll use them to store revenue numbers, customer counts, product names — everything.

```python
# Storing sales data
monthly_revenue = 142500
product_name = "Wireless Headphones"
units_sold = 3800
return_rate = 0.042

print(monthly_revenue)
print(product_name)
```

```text
# Output:
142500
Wireless Headphones
```

Variable names follow simple rules: start with a letter or underscore, use `snake_case`, and make them descriptive.

```python
# Good variable names — a senior analyst can read your code
total_revenue = 850000
avg_order_value = 47.50
is_profitable = True
q2_target = 1000000

# Bad variable names — don't do this
x = 850000
tr = 850000
TotalRevenue = 850000  # This is CamelCase, not Pythonic
```

### Multiple Assignment

```python
# Assign multiple variables in one line
region, sales, quota = "West", 285000, 300000

print(region)
print(sales)
print(quota)
```

```text
# Output:
West
285000
300000
```

## print() with f-strings

`print()` is how you display results. f-strings (formatted string literals) are the modern way to embed variables in text.

```python
product = "Laptop Stand"
price = 49.99
quantity = 1250
revenue = price * quantity

print(f"Product: {product}")
print(f"Revenue: ${revenue:,.2f}")
print(f"Units sold: {quantity:,}")
```

```text
# Output:
Product: Laptop Stand
Revenue: $62,487.50
Units sold: 1,250
```

### Formatting Numbers Like an Analyst

```python
total_revenue = 2847563.789
growth_rate = 0.1847
customer_count = 48392

# Currency formatting
print(f"Revenue: ${total_revenue:,.2f}")

# Percentage formatting
print(f"Growth: {growth_rate:.1%}")

# Thousands separator
print(f"Customers: {customer_count:,}")

# Padding/alignment (useful for reports)
print(f"{'Region':<15} {'Sales':>12}")
print(f"{'North':<15} {'$142,500':>12}")
print(f"{'South':<15} {'$98,300':>12}")
print(f"{'West':<15} {'$215,800':>12}")
```

```text
# Output:
Revenue: $2,847,563.79
Growth: 18.5%
Customers: 48,392
Region               Sales
North             $142,500
South              $98,300
West              $215,800
```

<div class="interview-tip">

**Where this is used in real jobs:** Every report, every dashboard, every Slack message you auto-generate from a script uses f-string formatting. Analysts format currency, percentages, and aligned tables daily.

</div>

## input() — Getting User Input

`input()` pauses your script and waits for the user to type something. It always returns a string.

```python
# Quick script to look up a product
product_id = input("Enter product ID: ")
print(f"Looking up product: {product_id}")
print(f"Type of input: {type(product_id)}")
```

```text
# Output:
Enter product ID: SKU-4421
Looking up product: SKU-4421
Type of input: <class 'str'>
```

**Important:** `input()` always returns a string. If you need a number, you must convert it:

```python
target = input("Enter sales target: ")  # Returns "50000" as a string
target = int(target)                     # Now it's an integer
print(f"Target: {target:,}")
print(type(target))
```

```text
# Output:
Enter sales target: 50000
Target: 50,000
<class 'int'>
```

## type() — Checking Data Types

When data comes from a CSV, API, or database, you need to verify types before doing math on them. `type()` tells you what you're working with.

```python
revenue = 142500
growth = 18.7
company = "Acme Corp"
is_active = True
missing_data = None

print(type(revenue))
print(type(growth))
print(type(company))
print(type(is_active))
print(type(missing_data))
```

```text
# Output:
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

You can also use `isinstance()` for cleaner checks:

```python
revenue = 142500

if isinstance(revenue, (int, float)):
    print(f"Revenue is numeric: ${revenue:,}")
else:
    print("Warning: Revenue is not a number")
```

```text
# Output:
Revenue is numeric: $142,500
```

## Basic Arithmetic — Real Analytics Math

Every analyst calculates margins, growth rates, and averages. Here's how Python handles it.

```python
# Profit margin calculation
revenue = 450000
cost_of_goods = 285000
operating_expenses = 72000

gross_profit = revenue - cost_of_goods
net_profit = gross_profit - operating_expenses
gross_margin = gross_profit / revenue
net_margin = net_profit / revenue

print(f"Gross Profit:  ${gross_profit:,.2f}")
print(f"Net Profit:    ${net_profit:,.2f}")
print(f"Gross Margin:  {gross_margin:.1%}")
print(f"Net Margin:    {net_margin:.1%}")
```

```text
# Output:
Gross Profit:  $165,000.00
Net Profit:    $93,000.00
Gross Margin:  36.7%
Net Margin:    20.7%
```

### Year-over-Year Growth

```python
last_year_revenue = 1_200_000  # Underscores for readability
this_year_revenue = 1_458_000

yoy_growth = (this_year_revenue - last_year_revenue) / last_year_revenue

print(f"Last Year:  ${last_year_revenue:>12,}")
print(f"This Year:  ${this_year_revenue:>12,}")
print(f"YoY Growth: {yoy_growth:.2%}")
```

```text
# Output:
Last Year:  $   1,200,000
This Year:  $   1,458,000
YoY Growth: 21.50%
```

### Python Arithmetic Operators

```python
a, b = 17, 5

print(f"Add:            {a} + {b} = {a + b}")
print(f"Subtract:       {a} - {b} = {a - b}")
print(f"Multiply:       {a} * {b} = {a * b}")
print(f"True divide:    {a} / {b} = {a / b}")
print(f"Floor divide:   {a} // {b} = {a // b}")
print(f"Modulo:         {a} % {b} = {a % b}")
print(f"Exponent:       {a} ** {b} = {a ** b}")
```

```text
# Output:
Add:            17 + 5 = 22
Subtract:       17 - 5 = 12
Multiply:       17 * 5 = 85
True divide:    17 / 5 = 3.4
Floor divide:   17 // 5 = 3
Modulo:         17 % 5 = 2
Exponent:       17 ** 5 = 1419857
```

### Compound Assignment Operators

```python
# Running total — common in data processing
running_total = 0
running_total += 15000   # Same as: running_total = running_total + 15000
running_total += 22000
running_total += 18500

print(f"Running total: ${running_total:,}")
```

```text
# Output:
Running total: $55,500
```

<div class="interview-tip">

**Interview favorite:** "What's the difference between `=` and `==`?"

`=` is **assignment** — it stores a value: `revenue = 50000`

`==` is **comparison** — it checks equality and returns `True` or `False`: `revenue == 50000`

This trips up beginners constantly. In an `if` statement, using `=` instead of `==` raises a `SyntaxError`.

</div>

## Putting It All Together

```python
# Quick sales performance report
store_name = "Downtown Branch"
q1_sales = 285000
q2_sales = 312000
q3_sales = 298000
q4_sales = 345000

total_annual = q1_sales + q2_sales + q3_sales + q4_sales
avg_quarterly = total_annual / 4
best_quarter = max(q1_sales, q2_sales, q3_sales, q4_sales)
q4_vs_q1_growth = (q4_sales - q1_sales) / q1_sales

print(f"=== {store_name} Annual Report ===")
print(f"Total Sales:      ${total_annual:>12,}")
print(f"Avg per Quarter:  ${avg_quarterly:>12,.2f}")
print(f"Best Quarter:     ${best_quarter:>12,}")
print(f"Q4 vs Q1 Growth:  {q4_vs_q1_growth:>11.1%}")
```

```text
# Output:
=== Downtown Branch Annual Report ===
Total Sales:      $   1,240,000
Avg per Quarter:  $  310,000.00
Best Quarter:     $     345,000
Q4 vs Q1 Growth:        21.1%
```

<div class="challenge">

### Challenge: Build a Profit Margin Calculator

Create a script that:
1. Stores revenue as `275000` and total costs as `198000`
2. Calculates gross profit and profit margin percentage
3. Prints a formatted report showing all three values
4. Determines if the business is "Healthy" (margin > 20%) or "Needs attention" (margin <= 20%)

**Expected output:**
```text
Revenue:       $275,000.00
Total Costs:   $198,000.00
Gross Profit:  $77,000.00
Profit Margin: 28.0%
Status:        Healthy
```

**Hint:** Use an f-string with `:.1%` for the margin and a simple `if/else` for the status.

</div>

## Common Interview Questions

### Q1: What are Python's naming conventions for variables?

**A:** Use `snake_case` for variables and functions (`total_revenue`, `calculate_margin`). Use `UPPER_SNAKE_CASE` for constants (`MAX_RETRIES`, `TAX_RATE`). Use `PascalCase` for class names (`DataProcessor`). Never start a variable name with a number. Avoid single-letter names except in short loops (`for i in range(10)`).

### Q2: What is the difference between `=` and `==`?

**A:** `=` is the assignment operator — it binds a value to a name (`x = 5`). `==` is the comparison operator — it checks if two values are equal and returns `True` or `False` (`x == 5` → `True`). Using `=` inside an `if` condition raises a `SyntaxError` in Python (unlike C/Java where it's a common bug).

### Q3: What does `type()` return, and when would you use it?

**A:** `type()` returns the class of an object — e.g., `type(42)` returns `<class 'int'>`. You use it when debugging data pipelines to verify that values coming from CSVs, APIs, or databases are the expected type before performing calculations. In production code, `isinstance()` is preferred for type checks because it also handles inheritance.

### Q4: Why does `input()` always return a string?

**A:** By design, `input()` captures raw user text from stdin. Python doesn't guess whether `"42"` should be an int or a string, so it returns everything as `str`. You must explicitly cast with `int()`, `float()`, etc. This prevents silent type errors — if someone types `"forty two"`, `int("forty two")` raises a clear `ValueError` instead of silently corrupting your data.

### Q5: What is the difference between `/` and `//` in Python?

**A:** `/` is true division — it always returns a float (`17 / 5` → `3.4`). `//` is floor division — it rounds down to the nearest integer (`17 // 5` → `3`). Floor division is useful when you need whole units: "How many full boxes of 12 can we fill with 50 items?" → `50 // 12` → `4`. The remainder is `50 % 12` → `2`.
