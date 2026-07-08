---
title: "Lists & Dictionaries — Store and Organize Data"
description: "Master Python lists and dictionaries — the data structures you'll use every day as a data analyst."
category: "python"
order: 4
phase: 1
tags: ["python", "lists", "dictionaries", "data-structures"]
publishedDate: 2025-01-18
prevSlug: "loops-and-functions"
nextSlug: "pandas-intro"
seoTitle: "Python Lists & Dictionaries for Data Analytics | Datalogify"
seoDescription: "Learn Python lists, dictionaries, slicing, and comprehensions with real data analytics examples."
---

## Why This Matters

Before data hits a DataFrame, it lives in lists and dicts. APIs return JSON (nested dicts). CSVs become lists of lists. Master these two data structures and you can handle any raw data source.

## Lists — Ordered, Mutable Collections

A list is an ordered sequence of values. Think: a column of data, a series of measurements, a queue of tasks.

```python
# Daily website visitors for a week
daily_visitors = [1240, 1185, 1390, 1520, 1445, 980, 870]

print(f"Data: {daily_visitors}")
print(f"Days tracked: {len(daily_visitors)}")
print(f"Type: {type(daily_visitors)}")
```

```text
# Output:
Data: [1240, 1185, 1390, 1520, 1445, 980, 870]
Days tracked: 7
Type: <class 'list'>
```

### Indexing — Access by Position

```python
sales = [42000, 38500, 51200, 47800, 55100, 49300]

# Positive indexing (from the start)
print(f"First month:  ${sales[0]:,}")
print(f"Third month:  ${sales[2]:,}")

# Negative indexing (from the end)
print(f"Last month:   ${sales[-1]:,}")
print(f"Second to last: ${sales[-2]:,}")
```

```text
# Output:
First month:  $42,000
Third month:  $51,200
Last month:   $49,300
Second to last: $55,100
```

### Slicing — Extract Subsets

```python
monthly_revenue = [42, 38, 51, 47, 55, 49, 61, 58, 52, 63, 71, 85]
#                  J   F   M   A   M   J   J   A   S   O   N   D

# First quarter (indices 0, 1, 2)
q1 = monthly_revenue[0:3]
print(f"Q1: {q1}")

# Last quarter (last 3 elements)
q4 = monthly_revenue[-3:]
print(f"Q4: {q4}")

# Q2 and Q3 (middle 6 months)
mid_year = monthly_revenue[3:9]
print(f"Mid-year: {mid_year}")

# Every other month
alternating = monthly_revenue[::2]
print(f"Alternating: {alternating}")

# Reversed
backward = monthly_revenue[::-1]
print(f"Reversed: {backward}")
```

```text
# Output:
Q1: [42, 38, 51]
Q4: [63, 71, 85]
Mid-year: [47, 55, 49, 61, 58, 52]
Alternating: [42, 51, 55, 61, 52, 71]
Reversed: [85, 71, 63, 52, 58, 61, 49, 55, 47, 51, 38, 42]
```

<div class="interview-tip">

**Where this is used in real jobs:** Slicing is everywhere — extracting recent data (`data[-30:]` for last 30 days), splitting train/test datasets, and grabbing header rows from raw files. Know the `[start:stop:step]` pattern cold.

</div>

## List Methods

### .append() and .extend()

```python
# Building a list of flagged transactions
flagged = []

flagged.append({"id": 1001, "amount": 9500})
flagged.append({"id": 1047, "amount": 12300})
print(f"After append: {len(flagged)} items")

# extend adds multiple items
more_flags = [{"id": 1102, "amount": 8700}, {"id": 1158, "amount": 15000}]
flagged.extend(more_flags)
print(f"After extend: {len(flagged)} items")
```

```text
# Output:
After append: 2 items
After extend: 4 items
```

### .sort() and sorted()

```python
revenues = [142000, 98500, 215000, 67300, 185000]

# sorted() returns a NEW list — original unchanged
ascending = sorted(revenues)
descending = sorted(revenues, reverse=True)
print(f"Original:   {revenues}")
print(f"Ascending:  {ascending}")
print(f"Descending: {descending}")

print()

# .sort() modifies the list IN PLACE — returns None
revenues.sort(reverse=True)
print(f"After .sort(): {revenues}")
```

```text
# Output:
Original:   [142000, 98500, 215000, 67300, 185000]
Ascending:  [67300, 98500, 142000, 185000, 215000]
Descending: [215000, 185000, 142000, 98500, 67300]

After .sort(): [215000, 185000, 142000, 98500, 67300]
```

### .remove(), .pop(), .insert()

```python
products = ["Laptop", "Mouse", "Keyboard", "Monitor", "Webcam"]

# .remove() — remove by value (first occurrence)
products.remove("Mouse")
print(f"After remove: {products}")

# .pop() — remove by index, returns the removed item
removed = products.pop(0)
print(f"Popped: {removed}")
print(f"After pop: {products}")

# .insert() — add at specific position
products.insert(0, "Desktop")
print(f"After insert: {products}")
```

```text
# Output:
After remove: ['Laptop', 'Keyboard', 'Monitor', 'Webcam']
Popped: Laptop
After pop: ['Keyboard', 'Monitor', 'Webcam']
After insert: ['Desktop', 'Keyboard', 'Monitor', 'Webcam']
```

### Useful Built-in Functions with Lists

```python
sales = [42000, 38500, 51200, 47800, 55100, 49300]

print(f"Count:   {len(sales)}")
print(f"Sum:     ${sum(sales):,}")
print(f"Min:     ${min(sales):,}")
print(f"Max:     ${max(sales):,}")
print(f"Average: ${sum(sales)/len(sales):,.2f}")

# Check membership
print(f"42000 in list? {42000 in sales}")
print(f"99999 in list? {99999 in sales}")
```

```text
# Output:
Count:   6
Sum:     $283,900
Min:     $38,500
Max:     $55,100
Average: $47,316.67
42000 in list? True
99999 in list? False
```

## Dictionaries — Key-Value Pairs

A dictionary maps keys to values. Think: a row of data where column names point to values.

```python
# An employee record
employee = {
    "name": "Sarah Chen",
    "department": "Data Analytics",
    "salary": 95000,
    "years": 3,
    "is_manager": False
}

print(f"Name: {employee['name']}")
print(f"Dept: {employee['department']}")
print(f"Salary: ${employee['salary']:,}")
```

```text
# Output:
Name: Sarah Chen
Dept: Data Analytics
Salary: $95,000
```

### Adding and Updating Values

```python
product = {
    "sku": "ELEC-001",
    "name": "Wireless Mouse",
    "price": 29.99
}

# Add new key
product["stock"] = 450
product["category"] = "Electronics"

# Update existing key
product["price"] = 34.99

print(product)
```

```text
# Output:
{'sku': 'ELEC-001', 'name': 'Wireless Mouse', 'price': 34.99, 'stock': 450, 'category': 'Electronics'}
```

## Dict Methods

### .get() — Safe Access

```python
employee = {"name": "Alex Rivera", "department": "Engineering"}

# Direct access — raises KeyError if key missing
print(employee["name"])

# .get() — returns None (or a default) if key missing
print(employee.get("salary"))             # None
print(employee.get("salary", "Not set"))  # Custom default
```

```text
# Output:
Alex Rivera
None
Not set
```

### .keys(), .values(), .items()

```python
quarterly_sales = {
    "Q1": 285000,
    "Q2": 312000,
    "Q3": 298000,
    "Q4": 345000
}

print(f"Quarters: {list(quarterly_sales.keys())}")
print(f"Sales:    {list(quarterly_sales.values())}")
print(f"Total:    ${sum(quarterly_sales.values()):,}")

print()

# .items() gives you key-value pairs — best for iteration
for quarter, sales in quarterly_sales.items():
    pct = sales / sum(quarterly_sales.values())
    print(f"  {quarter}: ${sales:>10,} ({pct:.1%})")
```

```text
# Output:
Quarters: ['Q1', 'Q2', 'Q3', 'Q4']
Sales:    [285000, 312000, 298000, 345000]
Total:    $1,240,000

  Q1: $   285,000 (23.0%)
  Q2: $   312,000 (25.2%)
  Q3: $   298,000 (24.0%)
  Q4: $   345,000 (27.8%)
```

### .update() — Merge Dictionaries

```python
# Base config
config = {"region": "US", "currency": "USD", "tax_rate": 0.08}

# Override with user settings
user_settings = {"tax_rate": 0.10, "discount": 0.05}
config.update(user_settings)

print(config)
```

```text
# Output:
{'region': 'US', 'currency': 'USD', 'tax_rate': 0.1, 'discount': 0.05}
```

### Python 3.9+ Merge Operator

```python
defaults = {"theme": "dark", "page_size": 25, "currency": "USD"}
overrides = {"page_size": 50, "region": "EU"}

# | creates a new merged dict
merged = defaults | overrides
print(merged)
```

```text
# Output:
{'theme': 'dark', 'page_size': 50, 'currency': 'USD', 'region': 'EU'}
```

## Nested Structures — Lists of Dicts

This is how real data looks. A list of dictionaries is essentially a table — each dict is a row, each key is a column.

```python
employees = [
    {"name": "Sarah Chen",    "dept": "Analytics",   "salary": 95000},
    {"name": "James Wilson",  "dept": "Engineering", "salary": 110000},
    {"name": "Maria Garcia",  "dept": "Analytics",   "salary": 88000},
    {"name": "David Kim",     "dept": "Marketing",   "salary": 78000},
    {"name": "Lisa Wang",     "dept": "Engineering", "salary": 105000},
]

# Total headcount
print(f"Total employees: {len(employees)}")

# Average salary
avg_salary = sum(e["salary"] for e in employees) / len(employees)
print(f"Average salary: ${avg_salary:,.2f}")

# Filter: Analytics team only
analytics_team = [e for e in employees if e["dept"] == "Analytics"]
print(f"\nAnalytics team ({len(analytics_team)}):")
for e in analytics_team:
    print(f"  {e['name']}: ${e['salary']:,}")

# Find highest paid
top_earner = max(employees, key=lambda e: e["salary"])
print(f"\nTop earner: {top_earner['name']} (${top_earner['salary']:,})")
```

```text
# Output:
Total employees: 5
Average salary: $95,200.00

Analytics team (2):
  Sarah Chen: $95,000
  Maria Garcia: $88,000

Top earner: James Wilson ($110,000)
```

### Grouping Data by Category

```python
employees = [
    {"name": "Sarah Chen",    "dept": "Analytics",   "salary": 95000},
    {"name": "James Wilson",  "dept": "Engineering", "salary": 110000},
    {"name": "Maria Garcia",  "dept": "Analytics",   "salary": 88000},
    {"name": "David Kim",     "dept": "Marketing",   "salary": 78000},
    {"name": "Lisa Wang",     "dept": "Engineering", "salary": 105000},
]

# Group salaries by department
dept_salaries = {}
for emp in employees:
    dept = emp["dept"]
    if dept not in dept_salaries:
        dept_salaries[dept] = []
    dept_salaries[dept].append(emp["salary"])

# Report
print(f"{'Department':<15} {'Count':>6} {'Avg Salary':>12}")
print("-" * 35)

for dept, salaries in dept_salaries.items():
    avg = sum(salaries) / len(salaries)
    print(f"{dept:<15} {len(salaries):>6} ${avg:>11,.2f}")
```

```text
# Output:
Department       Count   Avg Salary
-----------------------------------
Analytics            2  $ 91,500.00
Engineering          2  $107,500.00
Marketing            1  $ 78,000.00
```

<div class="interview-tip">

**Where this is used in real jobs:** When you call a REST API, the JSON response is a nested dict. When you read a CSV without Pandas, you get a list of lists (or list of dicts with `csv.DictReader`). This pattern — list of dicts → group → aggregate — is the precursor to Pandas `groupby()`.

</div>

## Dict and List Comprehensions

### Dict Comprehension

```python
# Convert a list of tuples to a price lookup
products = [("Laptop", 999), ("Mouse", 30), ("Keyboard", 80), ("Monitor", 350)]

price_lookup = {name: price for name, price in products}
print(f"Lookup: {price_lookup}")
print(f"Laptop price: ${price_lookup['Laptop']}")

print()

# Apply a 20% discount to everything over $100
discounted = {name: round(price * 0.8, 2) if price > 100 else price
              for name, price in products}
print(f"Discounted: {discounted}")
```

```text
# Output:
Lookup: {'Laptop': 999, 'Mouse': 30, 'Keyboard': 80, 'Monitor': 350}
Laptop price: $999

Discounted: {'Laptop': 799.2, 'Mouse': 30, 'Keyboard': 80, 'Monitor': 280.0}
```

### Inverting a Dictionary

```python
region_codes = {"US": "United States", "UK": "United Kingdom",
                "DE": "Germany", "JP": "Japan"}

# Swap keys and values
code_lookup = {name: code for code, name in region_codes.items()}

print(code_lookup["Germany"])
print(code_lookup["Japan"])
```

```text
# Output:
DE
JP
```

### Counting with Dicts

```python
# Count product categories in order data
orders = ["Electronics", "Books", "Electronics", "Clothing",
          "Books", "Electronics", "Clothing", "Books", "Electronics"]

# Manual counting
category_counts = {}
for cat in orders:
    category_counts[cat] = category_counts.get(cat, 0) + 1

print("Category counts:")
for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {cat}: {count}")
```

```text
# Output:
Category counts:
  Electronics: 4
  Books: 3
  Clothing: 2
```

<div class="interview-tip">

**Time complexity — a classic interview topic:**

| Operation | List | Dict |
|-----------|------|------|
| Access by index/key | O(1) | O(1) |
| Search for value | O(n) | O(1) for keys |
| Insert at end | O(1) | O(1) |
| Insert at start | O(n) | N/A |
| Delete by value | O(n) | O(1) |

**When to use which:** Use a **list** when order matters and you're accessing by position. Use a **dict** when you need fast lookups by a key. If you're checking `if item in my_list` repeatedly, convert to a set or dict first — it's the difference between O(n) and O(1) per lookup.

</div>

## Practical Example: Simple Sales Dashboard Data

```python
# Raw transaction data
transactions = [
    {"date": "2025-01-15", "product": "Laptop",   "region": "North", "amount": 999},
    {"date": "2025-01-15", "product": "Mouse",    "region": "South", "amount": 30},
    {"date": "2025-01-16", "product": "Laptop",   "region": "West",  "amount": 999},
    {"date": "2025-01-16", "product": "Monitor",  "region": "North", "amount": 350},
    {"date": "2025-01-17", "product": "Keyboard", "region": "South", "amount": 80},
    {"date": "2025-01-17", "product": "Laptop",   "region": "North", "amount": 999},
    {"date": "2025-01-17", "product": "Mouse",    "region": "West",  "amount": 30},
    {"date": "2025-01-18", "product": "Monitor",  "region": "South", "amount": 350},
]

# 1. Total revenue
total = sum(t["amount"] for t in transactions)
print(f"Total Revenue: ${total:,}")

# 2. Revenue by region
region_rev = {}
for t in transactions:
    region_rev[t["region"]] = region_rev.get(t["region"], 0) + t["amount"]

print(f"\nRevenue by Region:")
for region in sorted(region_rev, key=region_rev.get, reverse=True):
    pct = region_rev[region] / total
    print(f"  {region:<8} ${region_rev[region]:>8,}  ({pct:.1%})")

# 3. Top selling product
product_rev = {}
for t in transactions:
    product_rev[t["product"]] = product_rev.get(t["product"], 0) + t["amount"]

top_product = max(product_rev, key=product_rev.get)
print(f"\nTop Product: {top_product} (${product_rev[top_product]:,})")

# 4. Revenue by date
daily_rev = {}
for t in transactions:
    daily_rev[t["date"]] = daily_rev.get(t["date"], 0) + t["amount"]

print(f"\nDaily Revenue:")
for date in sorted(daily_rev):
    print(f"  {date}: ${daily_rev[date]:>8,}")
```

```text
# Output:
Total Revenue: $3,837

Revenue by Region:
  North    $  2,348  (61.2%)
  South    $    460  (12.0%)
  West     $  1,029  (26.8%)

Top Product: Laptop ($2,997)

Daily Revenue:
  2025-01-15: $  1,029
  2025-01-16: $  1,349
  2025-01-17: $  1,109
  2025-01-18: $    350
```

<div class="challenge">

### Challenge: Build a Simple Inventory Tracker

Create an inventory system using a list of dictionaries. Your code should:

1. Start with this inventory:
```python
inventory = [
    {"sku": "LAP-001", "name": "Laptop",   "price": 999.99, "stock": 45},
    {"sku": "MOU-002", "name": "Mouse",    "price": 29.99,  "stock": 200},
    {"sku": "KEY-003", "name": "Keyboard", "price": 79.99,  "stock": 150},
    {"sku": "MON-004", "name": "Monitor",  "price": 349.99, "stock": 30},
    {"sku": "WEB-005", "name": "Webcam",   "price": 89.99,  "stock": 75},
]
```

2. Write a function `total_inventory_value(inventory)` that returns the total value (price × stock for each item)
3. Write a function `low_stock_items(inventory, threshold=50)` that returns items with stock below the threshold
4. Print a formatted report showing all items, total value, and low-stock warnings

**Expected output should look like:**
```text
=== Inventory Report ===
SKU       Name         Price     Stock     Value
LAP-001   Laptop      $999.99      45   $44,999.55
MOU-002   Mouse        $29.99     200    $5,998.00
...
Total Inventory Value: $XX,XXX.XX

⚠ Low Stock (below 50 units):
  LAP-001 Laptop: 45 units
  MON-004 Monitor: 30 units
```

</div>

## Common Interview Questions

### Q1: What is the difference between a list and a tuple?

**A:** Lists are mutable (can be changed after creation) — you can append, remove, and modify elements. Tuples are immutable (cannot be changed). Use tuples for data that shouldn't change (coordinates, database row results, function return values). Tuples are also hashable, so they can be dict keys and set members, unlike lists. Tuples use slightly less memory and are marginally faster to create.

### Q2: How do you remove duplicates from a list while preserving order?

**A:** Use `dict.fromkeys()`: `list(dict.fromkeys(my_list))`. This works because dicts preserve insertion order (Python 3.7+) and automatically remove duplicate keys. The alternative `list(set(my_list))` removes duplicates but does NOT preserve order. For large lists, both are O(n).

### Q3: What happens when you access a key that doesn't exist in a dictionary?

**A:** Using bracket notation (`d["missing_key"]`) raises a `KeyError`. Use `.get("key", default)` for safe access — it returns `None` (or your default) if the key is missing. In production code, `collections.defaultdict` auto-creates missing keys with a factory function: `defaultdict(list)` creates an empty list for any new key.

### Q4: Explain the difference between shallow copy and deep copy.

**A:** A shallow copy (`list.copy()` or `dict.copy()`) creates a new container but the nested objects inside still reference the originals. A deep copy (`copy.deepcopy()`) recursively copies everything. This matters with nested structures: if you shallow-copy a list of dicts and modify a dict in the copy, the original changes too. For flat lists/dicts, shallow copy is fine and much faster.

### Q5: How would you merge two dictionaries in Python?

**A:** Three ways: (1) `{**dict1, **dict2}` — unpacking, works in Python 3.5+. (2) `dict1 | dict2` — merge operator, Python 3.9+. (3) `dict1.update(dict2)` — modifies dict1 in place. In all cases, if both dicts have the same key, the second dict's value wins. For analytics, you'll use this when merging configuration settings, combining results from multiple API calls, or consolidating partial data from different sources.
