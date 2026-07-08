---
title: "List Comprehensions & Generators"
description: "Write Pythonic one-liners that transform, filter, and process data — the technique that separates beginners from intermediates."
category: "python"
order: 11
phase: 1
tags: ["python", "comprehensions", "generators", "pythonic"]
publishedDate: 2025-01-26
prevSlug: "error-handling"
nextSlug: "modules-and-packages"
seoTitle: "Python List Comprehensions Guide | Datalogify"
seoDescription: "Master list, dict, and set comprehensions plus generators — write cleaner, faster Python for data analytics."
---

## Why This Matters

List comprehensions let you create lists in one line instead of five. They're faster than for loops, more readable once you learn them, and used constantly in Pandas data transformations.

## Basic List Comprehension

```python
# Without comprehension (4 lines)
squares = []
for n in range(1, 6):
    squares.append(n ** 2)
print(squares)

# With comprehension (1 line)
squares = [n ** 2 for n in range(1, 6)]
print(squares)
```

```text
[1, 4, 9, 16, 25]
[1, 4, 9, 16, 25]
```

## With Conditions (Filtering)

```python
revenues = [50000, 12000, 85000, 7500, 95000, 3000, 67000]

# Only keep revenues above $10,000
high_revenue = [r for r in revenues if r > 10000]
print(f"High revenue: {high_revenue}")

# Count them
print(f"Count: {len(high_revenue)} of {len(revenues)}")
```

```text
High revenue: [50000, 12000, 85000, 95000, 67000]
Count: 5 of 7
```

### If-Else in Comprehensions

```python
scores = [92, 67, 85, 43, 78, 95, 55]

# Categorize each score
grades = ["Pass" if s >= 60 else "Fail" for s in scores]
print(grades)

# With more complex logic
tiers = [
    "A" if s >= 90 else "B" if s >= 80 else "C" if s >= 70 else "F"
    for s in scores
]
print(dict(zip(scores, tiers)))
```

```text
['Pass', 'Pass', 'Pass', 'Fail', 'Pass', 'Pass', 'Fail']
{92: 'A', 67: 'F', 85: 'B', 43: 'F', 78: 'C', 95: 'A', 55: 'F'}
```

## Real Analytics Examples

```python
# Clean product names
raw_names = [" Widget A ", "WIDGET B", "widget c ", " Widget D"]
clean = [name.strip().title() for name in raw_names]
print(clean)

# Extract numbers from strings
data = ["Revenue: $50000", "Revenue: $35000", "Revenue: $28000"]
amounts = [int(s.split("$")[1]) for s in data]
print(f"Amounts: {amounts}")
print(f"Total: ${sum(amounts):,}")

# Filter employees by salary
employees = [
    {"name": "Alice", "salary": 95000},
    {"name": "Bob", "salary": 72000},
    {"name": "Carol", "salary": 98000},
    {"name": "Dave", "salary": 55000},
]

senior = [e["name"] for e in employees if e["salary"] > 80000]
print(f"Senior (>$80k): {senior}")
```

```text
['Widget A', 'Widget B', 'Widget C', 'Widget D']
Amounts: [50000, 35000, 28000]
Total: $113,000
Senior (>$80k): ['Alice', 'Carol']
```

## Dictionary Comprehensions

```python
# Basic dict comprehension
products = ["Widget A", "Widget B", "Widget C"]
prices = [50, 35, 28]

catalog = {product: price for product, price in zip(products, prices)}
print(catalog)

# Transform values
in_euros = {k: round(v * 0.92, 2) for k, v in catalog.items()}
print(f"EUR prices: {in_euros}")

# Filter by value
affordable = {k: v for k, v in catalog.items() if v < 40}
print(f"Under $40: {affordable}")

# From list of dicts — create lookup
employees = [
    {"id": 101, "name": "Alice"},
    {"id": 102, "name": "Bob"},
    {"id": 103, "name": "Carol"},
]
lookup = {e["id"]: e["name"] for e in employees}
print(f"Employee 102: {lookup[102]}")
```

```text
{'Widget A': 50, 'Widget B': 35, 'Widget C': 28}
EUR prices: {'Widget A': 46.0, 'Widget B': 32.2, 'Widget C': 25.76}
Under $40: {'Widget B': 35, 'Widget C': 28}
Employee 102: Bob
```

## Set Comprehensions

```python
# Unique departments from employee data
employees = [
    {"name": "Alice", "dept": "Engineering"},
    {"name": "Bob", "dept": "Marketing"},
    {"name": "Carol", "dept": "Engineering"},
    {"name": "Dave", "dept": "Sales"},
    {"name": "Eve", "dept": "Marketing"},
]

departments = {e["dept"] for e in employees}
print(f"Departments: {departments}")
```

```text
Departments: {'Engineering', 'Marketing', 'Sales'}
```

## Nested Comprehensions

```python
# Flatten a list of lists
quarterly_sales = [
    [50000, 52000, 48000],  # Q1 months
    [55000, 58000, 60000],  # Q2 months
    [45000, 47000, 51000],  # Q3 months
]

all_months = [sale for quarter in quarterly_sales for sale in quarter]
print(f"All monthly sales: {all_months}")
print(f"Total: ${sum(all_months):,}")

# Matrix creation
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
print(f"Multiplication table: {matrix}")
```

```text
All monthly sales: [50000, 52000, 48000, 55000, 58000, 60000, 45000, 47000, 51000]
Total: $466,000
Multiplication table: [[1, 2, 3], [2, 4, 6], [3, 6, 9]]
```

## Generator Expressions

Generators produce values on-the-fly without storing them all in memory. Use `()` instead of `[]`.

```python
# List comprehension — stores ALL values in memory
big_list = [x ** 2 for x in range(1_000_000)]
print(f"List size: ~{big_list.__sizeof__() // 1024} KB")

# Generator — produces values one at a time
big_gen = (x ** 2 for x in range(1_000_000))
print(f"Generator size: ~{big_gen.__sizeof__()} bytes")

# Use generator directly in functions
total = sum(x ** 2 for x in range(1_000_000))
print(f"Sum of squares: {total:,}")
```

```text
List size: ~8192 KB
Generator size: ~200 bytes
Sum of squares: 333,332,833,333,500,000
```

### When to Use Generators

```python
# Processing large files line by line
def parse_revenue_lines(filepath):
    """Generator that yields parsed revenue values from a large file."""
    with open(filepath) as f:
        for line in f:
            parts = line.strip().split(",")
            try:
                yield int(parts[1])
            except (IndexError, ValueError):
                continue

# With a generator, you can process a 10GB file without running out of memory
# total = sum(parse_revenue_lines("massive_sales.csv"))

# Another example: infinite sequence
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Get first 10 fibonacci numbers
fib = fibonacci()
first_10 = [next(fib) for _ in range(10)]
print(f"Fibonacci: {first_10}")
```

```text
Fibonacci: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Performance: Comprehension vs Loop

```python
import time

n = 1_000_000

# For loop
start = time.time()
result1 = []
for i in range(n):
    result1.append(i ** 2)
loop_time = time.time() - start

# List comprehension
start = time.time()
result2 = [i ** 2 for i in range(n)]
comp_time = time.time() - start

print(f"For loop:      {loop_time:.3f}s")
print(f"Comprehension: {comp_time:.3f}s")
print(f"Speedup:       {loop_time / comp_time:.1f}x")
```

```text
For loop:      0.182s
Comprehension: 0.112s
Speedup:       1.6x
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Transforming column values across DataFrames (list comp inside `.apply()` or vectorized)
- Building lookup dictionaries from database results
- Filtering and cleaning data in one concise line
- Processing large log files with generators (memory-safe)
- Pandas `.pipe()` chains often use comprehension-like patterns

</div>

<div class="challenge">

**Mini-Challenge:** Given this data:
```python
transactions = [
    {"id": 1, "amount": 150, "type": "sale"},
    {"id": 2, "amount": -30, "type": "refund"},
    {"id": 3, "amount": 200, "type": "sale"},
    {"id": 4, "amount": -50, "type": "refund"},
    {"id": 5, "amount": 75, "type": "sale"},
]
```
1. Use a list comprehension to get all sale amounts
2. Use a dict comprehension to create `{id: amount}` for sales only
3. Use a generator to calculate total refund amount without storing in a list

</div>

## Common Interview Questions

### Q1: List comprehension vs `map()` + `lambda` — which is better?

**Answer:** List comprehensions are generally preferred in Python because they're more readable and Pythonic. `[x**2 for x in nums]` is clearer than `list(map(lambda x: x**2, nums))`. However, `map()` can be faster for simple built-in functions like `map(str, nums)` since it avoids the overhead of a Python-level loop.

### Q2: When should you use a generator instead of a list comprehension?

**Answer:** Use generators when: (1) the dataset is large and you don't need all values in memory at once, (2) you only need to iterate once, (3) you're passing results to a function like `sum()`, `max()`, or `any()`. Use list comprehensions when you need to access items by index, iterate multiple times, or need the length.

### Q3: Can you nest comprehensions? Is it readable?

**Answer:** Yes, you can nest them: `[x for sublist in matrix for x in sublist]`. The rule of thumb: one level of nesting is fine and common (flattening lists). Two or more levels becomes unreadable — use a regular for loop instead. Readability trumps cleverness.

### Q4: What's the difference between `[expr for x in iter]` and `(expr for x in iter)`?

**Answer:** Square brackets `[]` create a list comprehension — it builds and returns a full list in memory. Parentheses `()` create a generator expression — it produces values lazily, one at a time. Generators use O(1) memory regardless of size. You can use generators directly in `sum()`, `min()`, `max()`, `any()`, `all()`.

### Q5: How do you handle exceptions inside a comprehension?

**Answer:** You can't use try/except directly in a comprehension. The common pattern is to define a helper function: `def safe_int(x): try: return int(x) except: return 0` then use `[safe_int(x) for x in data]`. Alternatively, use a conditional: `[int(x) for x in data if x.isdigit()]`.
