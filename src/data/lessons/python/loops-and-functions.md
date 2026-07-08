---
title: "Loops & Functions — Automate Repetitive Analysis"
description: "Write for loops, while loops, and reusable functions to automate your data analytics workflows."
category: "python"
order: 3
phase: 1
tags: ["python", "loops", "functions", "automation"]
publishedDate: 2025-01-17
prevSlug: "data-types"
nextSlug: "lists-and-dicts"
seoTitle: "Python Loops & Functions for Data Analytics | Datalogify"
seoDescription: "Learn for loops, while loops, and Python functions with real data analytics automation examples."
---

## Why This Matters

Analytics = doing the same calculation across thousands of rows. Loops handle the repetition. Functions make your code reusable. Together, they turn a one-off analysis into a repeatable workflow.

## for Loops with range()

`range()` generates a sequence of numbers. You'll use it when you need to iterate a specific number of times or generate indices.

```python
# Calculate compound growth over 5 years
revenue = 100000
annual_growth = 0.15

print(f"Year 0: ${revenue:>12,.2f}")

for year in range(1, 6):
    revenue = revenue * (1 + annual_growth)
    print(f"Year {year}: ${revenue:>12,.2f}")
```

```text
# Output:
Year 0: $  100,000.00
Year 1: $  115,000.00
Year 2: $  132,250.00
Year 3: $  152,087.50
Year 4: $  174,900.63
Year 5: $  201,135.72
```

### range() Variants

```python
# range(stop) — 0 to stop-1
print("range(5):", list(range(5)))

# range(start, stop) — start to stop-1
print("range(2, 7):", list(range(2, 7)))

# range(start, stop, step) — with step size
print("range(0, 20, 5):", list(range(0, 20, 5)))

# Counting backwards
print("range(10, 0, -2):", list(range(10, 0, -2)))
```

```text
# Output:
range(5): [0, 1, 2, 3, 4]
range(2, 7): [2, 3, 4, 5, 6]
range(0, 20, 5): [0, 5, 10, 15]
range(10, 0, -2): [10, 8, 6, 4, 2]
```

## for Loops Over Lists and Strings

This is where loops get practical. Most of your data lives in lists.

```python
# Processing monthly sales data
monthly_sales = [42000, 38500, 51200, 47800, 55100, 49300,
                 61000, 58200, 52400, 63500, 71200, 85000]

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

total = 0
best_month = ""
best_sales = 0

for i in range(len(monthly_sales)):
    total += monthly_sales[i]
    if monthly_sales[i] > best_sales:
        best_sales = monthly_sales[i]
        best_month = months[i]

avg = total / len(monthly_sales)
print(f"Total Annual Sales: ${total:>12,}")
print(f"Monthly Average:    ${avg:>12,.2f}")
print(f"Best Month:         {best_month} (${best_sales:,})")
```

```text
# Output:
Total Annual Sales: $  675,200
Monthly Average:    $   56,266.67
Best Month:         Dec ($85,000)
```

### Use enumerate() — The Pythonic Way

```python
# enumerate gives you index AND value — cleaner than range(len())
products = ["Laptop", "Mouse", "Keyboard", "Monitor", "Webcam"]
prices = [999.99, 29.99, 79.99, 349.99, 89.99]

print(f"{'#':<4} {'Product':<12} {'Price':>8}")
print("-" * 26)

for i, product in enumerate(products):
    print(f"{i+1:<4} {product:<12} ${prices[i]:>7.2f}")
```

```text
# Output:
#    Product         Price
--------------------------
1    Laptop         $999.99
2    Mouse           $29.99
3    Keyboard        $79.99
4    Monitor        $349.99
5    Webcam          $89.99
```

### zip() — Iterate Over Multiple Lists

```python
regions = ["North", "South", "East", "West"]
q1_sales = [142000, 98000, 175000, 215000]
q2_sales = [155000, 112000, 168000, 228000]

print(f"{'Region':<10} {'Q1':>10} {'Q2':>10} {'Growth':>8}")
print("-" * 40)

for region, q1, q2 in zip(regions, q1_sales, q2_sales):
    growth = (q2 - q1) / q1
    print(f"{region:<10} ${q1:>9,} ${q2:>9,} {growth:>7.1%}")
```

```text
# Output:
Region           Q1         Q2   Growth
----------------------------------------
North      $142,000  $155,000    9.2%
South       $98,000  $112,000   14.3%
East       $175,000  $168,000   -4.0%
West       $215,000  $228,000    6.0%
```

### Looping Through Strings

```python
# Counting specific characters — useful for parsing
email = "data.analyst@company.com"
char_counts = {}

for char in email:
    char_counts[char] = char_counts.get(char, 0) + 1

# Show top characters
sorted_chars = sorted(char_counts.items(), key=lambda x: x[1], reverse=True)
for char, count in sorted_chars[:5]:
    display = repr(char) if char == '.' else char
    print(f"  '{char}': {count}")
```

```text
# Output:
  'a': 4
  't': 2
  '.': 2
  'n': 2
  'o': 2
```

## while Loops

`while` loops run until a condition becomes `False`. Use them when you don't know how many iterations you need upfront.

```python
# Simulating: how many months to reach $1M at 8% monthly growth?
revenue = 50000
target = 1_000_000
growth_rate = 0.08
months = 0

while revenue < target:
    revenue *= (1 + growth_rate)
    months += 1

print(f"Months to reach ${target:,}: {months}")
print(f"Final revenue: ${revenue:,.2f}")
```

```text
# Output:
Months to reach $1,000,000: 40
Final revenue: $1,086,226.08
```

### break and continue

```python
# break — exit the loop early
transactions = [250, 180, 5200, 320, 90, 1100, 780]

print("Scanning for transactions over $5,000...")
for i, amount in enumerate(transactions):
    if amount > 5000:
        print(f"  ⚠ Flag found at index {i}: ${amount:,}")
        break
else:
    print("  No flagged transactions")

print()

# continue — skip current iteration
print("Transactions over $200:")
for amount in transactions:
    if amount <= 200:
        continue
    print(f"  ${amount:,}")
```

```text
# Output:
Scanning for transactions over $5,000...
  ⚠ Flag found at index 2: $5,200

Transactions over $200:
  $250
  $5,200
  $320
  $1,100
  $780
```

<div class="interview-tip">

**Where this is used in real jobs:** `while` loops power retry logic for API calls, convergence algorithms, and polling systems. In analytics, you'll mostly use `for` loops. But when scraping paginated API results ("keep fetching until no more pages"), `while` is the right tool.

</div>

## Writing Functions with def

Functions make your code reusable. Write a calculation once, call it anywhere.

```python
def calculate_margin(revenue, costs):
    """Calculate profit margin as a percentage."""
    profit = revenue - costs
    margin = profit / revenue
    return margin

# Use it across different products
products = [
    ("Laptop", 999, 650),
    ("Mouse", 30, 8),
    ("Keyboard", 80, 25),
    ("Monitor", 350, 180),
]

print(f"{'Product':<12} {'Revenue':>8} {'Cost':>8} {'Margin':>8}")
print("-" * 38)

for name, rev, cost in products:
    margin = calculate_margin(rev, cost)
    print(f"{name:<12} ${rev:>7} ${cost:>7} {margin:>7.1%}")
```

```text
# Output:
Product       Revenue     Cost   Margin
--------------------------------------
Laptop          $999     $650    34.9%
Mouse            $30       $8    73.3%
Keyboard         $80      $25    68.8%
Monitor         $350     $180    48.6%
```

## Default Arguments

```python
def format_currency(amount, currency="USD", decimals=2):
    """Format a number as currency."""
    symbols = {"USD": "$", "EUR": "€", "GBP": "£"}
    symbol = symbols.get(currency, currency + " ")
    return f"{symbol}{amount:,.{decimals}f}"

# Using defaults
print(format_currency(142500))

# Overriding defaults
print(format_currency(142500, "EUR"))
print(format_currency(142500, "GBP", 0))
```

```text
# Output:
$142,500.00
€142,500.00
£142,500
```

## Multiple Return Values

```python
def analyze_sales(sales_data):
    """Return key stats from a list of sales figures."""
    total = sum(sales_data)
    average = total / len(sales_data)
    highest = max(sales_data)
    lowest = min(sales_data)
    return total, average, highest, lowest

quarterly_sales = [285000, 312000, 298000, 345000]

total, avg, high, low = analyze_sales(quarterly_sales)

print(f"Total:   ${total:>12,}")
print(f"Average: ${avg:>12,.2f}")
print(f"Highest: ${high:>12,}")
print(f"Lowest:  ${low:>12,}")
```

```text
# Output:
Total:   $   1,240,000
Average: $  310,000.00
Highest: $     345,000
Lowest:  $     285,000
```

### Functions with Validation

```python
def calculate_growth_rate(current, previous):
    """Calculate growth rate with division-by-zero protection."""
    if previous == 0:
        return None
    return (current - previous) / previous

# Normal case
rate = calculate_growth_rate(150000, 120000)
print(f"Growth rate: {rate:.1%}")

# Edge case — previous period was zero
rate = calculate_growth_rate(50000, 0)
if rate is None:
    print("Growth rate: N/A (no prior period data)")
else:
    print(f"Growth rate: {rate:.1%}")
```

```text
# Output:
Growth rate: 25.0%
Growth rate: N/A (no prior period data)
```

## List Comprehensions vs for Loops

List comprehensions are a compact way to create lists. They're not just syntactic sugar — they're faster than equivalent for loops.

```python
# for loop version
revenues = [42000, 38500, 51200, 47800, 55100]
above_average = []
avg = sum(revenues) / len(revenues)

for rev in revenues:
    if rev > avg:
        above_average.append(rev)

print(f"Average: ${avg:,.2f}")
print(f"Above average (loop): {above_average}")

# List comprehension version — same result, one line
above_average_lc = [rev for rev in revenues if rev > avg]
print(f"Above average (comp): {above_average_lc}")
```

```text
# Output:
Average: $46,920.00
Above average (loop): [51200, 47800, 55100]
Above average (comp): [51200, 47800, 55100]
```

### Comprehension Patterns

```python
# Transform: apply a calculation to every item
prices = [10.50, 23.99, 45.00, 8.75, 32.50]
with_tax = [round(p * 1.08, 2) for p in prices]
print(f"With 8% tax: {with_tax}")

# Filter + transform: clean and convert data
raw_values = ["100", "N/A", "250", "", "180", "error", "320"]
clean_values = [int(v) for v in raw_values if v.isdigit()]
print(f"Clean values: {clean_values}")

# Conditional expression: apply different logic
scores = [92, 67, 85, 44, 78, 95, 53]
grades = ["Pass" if s >= 60 else "Fail" for s in scores]
print(f"Grades: {grades}")
```

```text
# Output:
With 8% tax: [11.34, 25.91, 48.6, 9.45, 35.1]
Clean values: [100, 250, 180, 320]
Grades: ['Pass', 'Pass', 'Pass', 'Fail', 'Pass', 'Pass', 'Fail']
```

<div class="interview-tip">

**Interview favorite: "List comprehension vs map/filter — when to use which?"**

Use **list comprehensions** for most cases — they're readable and Pythonic. Use `map()` when you're applying a single function to every element without filtering: `list(map(str, numbers))`. Use `filter()` when you only need to filter without transforming: `list(filter(None, data))` removes falsy values.

In practice, list comprehensions cover 95% of use cases. `map`/`filter` are mainly seen in functional programming patterns and older codebases.

```python
nums = [1, 2, 3, 4, 5]

# List comprehension — most readable
squares = [n ** 2 for n in nums]

# map — equivalent but less readable for complex logic
squares_map = list(map(lambda n: n ** 2, nums))

print(f"Comprehension: {squares}")
print(f"Map:           {squares_map}")
```

</div>

## Nested Loops — Processing Tabular Data

```python
# Sales data: regions × quarters
regions = ["North", "South", "West"]
quarters = ["Q1", "Q2", "Q3", "Q4"]
sales = [
    [120, 135, 142, 158],  # North
    [98, 105, 112, 128],   # South
    [175, 182, 195, 210],  # West
]

print(f"{'Region':<8}", end="")
for q in quarters:
    print(f"{q:>8}", end="")
print(f"{'Total':>10}")
print("-" * 44)

for i, region in enumerate(regions):
    print(f"{region:<8}", end="")
    row_total = 0
    for sale in sales[i]:
        print(f"${sale:>7,}", end="")
        row_total += sale
    print(f"${row_total:>9,}")
```

```text
# Output:
Region       Q1      Q2      Q3      Q4     Total
--------------------------------------------
North     $120   $135   $142   $158     $555
South      $98   $105   $112   $128     $443
West      $175   $182   $195   $210     $762
```

## Practical Example: Data Processing Pipeline

```python
def clean_name(name):
    """Standardize a name string."""
    return name.strip().title()

def parse_revenue(rev_string):
    """Convert revenue string to float."""
    try:
        return float(rev_string.replace("$", "").replace(",", ""))
    except (ValueError, AttributeError):
        return 0.0

def classify_customer(revenue):
    """Classify customer by revenue tier."""
    if revenue >= 100000:
        return "Enterprise"
    elif revenue >= 25000:
        return "Mid-Market"
    else:
        return "SMB"

# Raw data from export
raw_customers = [
    ("  ACME CORP  ", "$142,500"),
    ("  globex inc", "$28,900"),
    ("INITECH  ", "$8,200"),
    ("  Umbrella Corp  ", "$315,000"),
    ("stark industries", "$95,400"),
]

print(f"{'Customer':<20} {'Revenue':>12} {'Tier':<12}")
print("-" * 46)

for raw_name, raw_rev in raw_customers:
    name = clean_name(raw_name)
    revenue = parse_revenue(raw_rev)
    tier = classify_customer(revenue)
    print(f"{name:<20} ${revenue:>11,.2f} {tier:<12}")
```

```text
# Output:
Customer               Revenue Tier
----------------------------------------------
Acme Corp           $142,500.00 Enterprise
Globex Inc           $28,900.00 Mid-Market
Initech               $8,200.00 SMB
Umbrella Corp       $315,000.00 Enterprise
Stark Industries     $95,400.00 Mid-Market
```

<div class="challenge">

### Challenge: Write a Running Average Function

Create a function `running_average(sales_list)` that:
1. Takes a list of monthly sales numbers
2. Returns a list of running averages (average of all values up to that point)
3. Each average should be rounded to 2 decimal places

```python
monthly = [42000, 38500, 51200, 47800, 55100, 49300]
```

**Expected output:**
```text
Month 1: $42,000 → Avg: $42,000.00
Month 2: $38,500 → Avg: $40,250.00
Month 3: $51,200 → Avg: $43,900.00
Month 4: $47,800 → Avg: $44,875.00
Month 5: $55,100 → Avg: $46,920.00
Month 6: $49,300 → Avg: $47,316.67
```

**Hint:** Keep a running total and divide by the current index + 1.

</div>

## Common Interview Questions

### Q1: What is the difference between a for loop and a while loop?

**A:** A `for` loop iterates over a known sequence (list, range, string) — you know upfront how many iterations will happen. A `while` loop runs until a condition becomes `False` — use it when the number of iterations is unknown. Example: iterating over CSV rows → `for`. Retrying a failed API call up to 5 times → `while`. In data analytics, `for` loops are far more common.

### Q2: What is a list comprehension, and when should you use one?

**A:** A list comprehension is a concise syntax for creating lists: `[expression for item in iterable if condition]`. Use it for simple transforms and filters that fit on one line. If the logic requires multiple statements, nested conditions, or side effects (like printing), use a regular for loop. List comprehensions are slightly faster than equivalent for loops because they're optimized at the bytecode level.

### Q3: What does `*args` and `**kwargs` mean in a function definition?

**A:** `*args` collects extra positional arguments into a tuple. `**kwargs` collects extra keyword arguments into a dictionary. They let functions accept variable numbers of arguments. Example: `def log(message, *tags, **metadata)` can be called as `log("Error", "db", "critical", user="admin", code=500)`. In analytics, you'll see this in wrapper functions and decorators more than in day-to-day scripts.

### Q4: What happens if you modify a list while iterating over it?

**A:** It causes bugs. If you remove items from a list while iterating with `for`, you'll skip elements because indices shift. The safe approach is to iterate over a copy (`for item in list_copy:`) or build a new list with a comprehension. Example: `cleaned = [x for x in data if x is not None]` instead of removing `None` values during iteration.

### Q5: What is a lambda function, and when would you use one?

**A:** A lambda is an anonymous one-line function: `lambda x: x * 2`. Use them for short throwaway functions, typically as arguments to `sorted()`, `map()`, or `filter()`. Example: `sorted(employees, key=lambda e: e["salary"])` sorts a list of dicts by salary. Don't use lambdas for complex logic — write a named function for readability and debugging. In Pandas, you'll use lambdas constantly with `.apply()`.
