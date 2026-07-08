---
title: "Data Types — Strings, Numbers, Booleans & Type Casting"
description: "Understand Python data types and type casting — essential for cleaning messy data in analytics."
category: "python"
order: 2
phase: 1
tags: ["python", "data-types", "strings", "type-casting"]
publishedDate: 2025-01-16
prevSlug: "basics"
nextSlug: "loops-and-functions"
seoTitle: "Python Data Types for Data Analytics — Strings, Numbers, Booleans | Datalogify"
seoDescription: "Master Python data types, string methods for data cleaning, and type casting with practical analytics examples."
---

## Why This Matters

Messy data is the default. CSVs give you strings where you expect numbers. APIs send `"true"` instead of `True`. You'll spend more time fixing data types than writing algorithms. Know these cold.

## Core Data Types

Python has four types you'll use every single day.

```python
# int — whole numbers (counts, IDs, quantities)
total_orders = 4892
employee_id = 10042

# float — decimal numbers (money, rates, scores)
avg_order_value = 67.43
conversion_rate = 0.034

# str — text (names, categories, dates as text)
customer_name = "Sarah Chen"
product_category = "Electronics"

# bool — True or False (flags, filters)
is_returning_customer = True
has_churned = False

print(f"Orders: {total_orders} ({type(total_orders).__name__})")
print(f"AOV: ${avg_order_value} ({type(avg_order_value).__name__})")
print(f"Customer: {customer_name} ({type(customer_name).__name__})")
print(f"Returning: {is_returning_customer} ({type(is_returning_customer).__name__})")
```

```text
# Output:
Orders: 4892 (int)
AOV: $67.43 (float)
Customer: Sarah Chen (str)
Returning: True (bool)
```

### int vs float — When It Matters

```python
# Integer division vs float division
total_items = 17
box_size = 5

# True division — always returns float
print(f"17 / 5 = {total_items / box_size}")
print(f"Type: {type(total_items / box_size).__name__}")

# Floor division — returns int if both operands are int
print(f"17 // 5 = {total_items // box_size}")
print(f"Type: {type(total_items // box_size).__name__}")

# Float precision trap — this WILL bite you
print(f"0.1 + 0.2 = {0.1 + 0.2}")
print(f"0.1 + 0.2 == 0.3? {0.1 + 0.2 == 0.3}")
```

```text
# Output:
17 / 5 = 3.4
Type: float
17 // 5 = 3
Type: int
0.1 + 0.2 = 0.30000000000000004
0.1 + 0.2 == 0.3? False
```

**The fix for float comparison:**

```python
# Use round() or math.isclose() for float comparison
import math

a = 0.1 + 0.2
b = 0.3

print(f"round comparison: {round(a, 10) == round(b, 10)}")
print(f"math.isclose: {math.isclose(a, b)}")
```

```text
# Output:
round comparison: True
math.isclose: True
```

<div class="interview-tip">

**Where this is used in real jobs:** Financial calculations require exact precision. Production code uses Python's `decimal.Decimal` module for money. In analytics scripts, `round()` is usually sufficient — but know the trap exists.

</div>

## String Methods for Data Cleaning

This is where data analysts live. Raw data is always messy — extra spaces, inconsistent casing, garbage characters.

### .strip(), .lstrip(), .rstrip()

```python
# Data from a CSV with extra whitespace
raw_name = "   Sarah Chen   \n"
raw_email = "  sarah@example.com  "

clean_name = raw_name.strip()
clean_email = raw_email.strip()

print(f"Before: '{raw_name}'")
print(f"After:  '{clean_name}'")
print(f"Email:  '{clean_email}'")
```

```text
# Output:
Before: '   Sarah Chen   
'
After:  'Sarah Chen'
Email:  'sarah@example.com'
```

### .lower(), .upper(), .title()

```python
# Standardizing category names from different sources
categories = ["ELECTRONICS", "electronics", "Electronics", "eLeCTRONICS"]

for cat in categories:
    print(f"'{cat}' → '{cat.lower()}'")

print()

# Title case for display
customer = "john doe"
print(f"Display name: {customer.title()}")
```

```text
# Output:
'ELECTRONICS' → 'electronics'
'electronics' → 'electronics'
'Electronics' → 'electronics'
'eLeCTRONICS' → 'electronics'

Display name: John Doe
```

### .replace()

```python
# Cleaning currency strings so you can convert to float
raw_revenue = "$1,234,567.89"

clean_revenue = raw_revenue.replace("$", "").replace(",", "")
revenue_float = float(clean_revenue)

print(f"Raw:   {raw_revenue} (type: {type(raw_revenue).__name__})")
print(f"Clean: {revenue_float} (type: {type(revenue_float).__name__})")
print(f"Formatted back: ${revenue_float:,.2f}")
```

```text
# Output:
Raw:   $1,234,567.89 (type: str)
Clean: 1234567.89 (type: float)
Formatted back: $1,234,567.89
```

### .split() and .join()

```python
# Parsing a log entry
log_entry = "2025-01-15|ERROR|database_timeout|retry_count=3"

parts = log_entry.split("|")
print(f"Date:    {parts[0]}")
print(f"Level:   {parts[1]}")
print(f"Message: {parts[2]}")
print(f"Detail:  {parts[3]}")

print()

# Joining cleaned tags
tags = ["python", "data-analysis", "pandas"]
tag_string = ", ".join(tags)
print(f"Tags: {tag_string}")
```

```text
# Output:
Date:    2025-01-15
Level:   ERROR
Message: database_timeout
Detail:  retry_count=3

Tags: python, data-analysis, pandas
```

### .startswith(), .endswith(), .find()

```python
filename = "sales_report_q4_2024.csv"

print(f"Is CSV?    {filename.endswith('.csv')}")
print(f"Is Excel?  {filename.endswith('.xlsx')}")
print(f"Is sales?  {filename.startswith('sales')}")
print(f"'q4' at position: {filename.find('q4')}")
print(f"'q3' at position: {filename.find('q3')}")  # -1 means not found
```

```text
# Output:
Is CSV?    True
Is Excel?  False
Is sales?  True
'q4' at position: 17
'q3' at position: -1
```

### String Slicing

```python
# Extracting parts of product codes
sku = "ELEC-US-2024-00458"

category = sku[:4]
region = sku[5:7]
year = sku[8:12]
item_id = sku[13:]

print(f"SKU:      {sku}")
print(f"Category: {category}")
print(f"Region:   {region}")
print(f"Year:     {year}")
print(f"Item ID:  {item_id}")
```

```text
# Output:
SKU:      ELEC-US-2024-00458
Category: ELEC
Region:   US
Year:     2024
Item ID:  00458
```

## Type Casting

Data from files, APIs, and databases often arrives as strings. You need to cast it to the right type before doing math.

```python
# Simulating data from a CSV row (everything comes as strings)
csv_row = {"revenue": "142500", "growth": "0.187", "active": "True", "employees": "85"}

revenue = int(csv_row["revenue"])
growth = float(csv_row["growth"])
employees = int(csv_row["employees"])

# Calculate revenue per employee
rev_per_employee = revenue / employees

print(f"Revenue: ${revenue:,}")
print(f"Growth: {growth:.1%}")
print(f"Employees: {employees}")
print(f"Rev/Employee: ${rev_per_employee:,.2f}")
```

```text
# Output:
Revenue: $142,500
Growth: 18.7%
Employees: 85
Rev/Employee: $1,676.47
```

### Casting Gotchas

```python
# These work
print(int("42"))        # str → int
print(float("3.14"))    # str → float
print(str(42))          # int → str
print(bool(1))          # int → bool (True)
print(bool(0))          # int → bool (False)

print()

# Truthy and falsy values
print(f"bool(''):     {bool('')}")       # Empty string → False
print(f"bool('hi'):   {bool('hi')}")     # Non-empty string → True
print(f"bool(0):      {bool(0)}")        # Zero → False
print(f"bool(42):     {bool(42)}")       # Non-zero → True
print(f"bool([]):     {bool([])}")       # Empty list → False
print(f"bool([1,2]):  {bool([1, 2])}")   # Non-empty list → True
print(f"bool(None):   {bool(None)}")     # None → False
```

```text
# Output:
42
3.14
42
True
False

bool(''):     False
bool('hi'):   True
bool(0):      False
bool(42):     True
bool([]):     False
bool([1,2]):  True
bool(None):   False
```

### Safe Casting with Error Handling

```python
def safe_to_float(value):
    """Convert a value to float, return None if it fails."""
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

# Testing with messy data
test_values = ["142.5", "N/A", "", "85", None, "$200"]

for val in test_values:
    result = safe_to_float(val)
    print(f"'{val}' → {result}")
```

```text
# Output:
'142.5' → 142.5
'N/A' → None
'' → None
'85' → 85.0
'None' → None
'$200' → None
```

<div class="interview-tip">

**Where this is used in real jobs:** Every ETL pipeline, every data cleaning script uses type casting. When you load a CSV with `pandas.read_csv()`, Pandas guesses types — but it gets it wrong regularly. You'll manually cast columns with `.astype()` constantly.

</div>

## None — The Missing Data Type

`None` represents the absence of a value. It's Python's equivalent of `NULL` in SQL or `NA` in R.

```python
# Customer record with missing data
customer = {
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "phone": None,          # No phone on file
    "company": None,        # No company on file
    "lifetime_value": 2340.50
}

for key, value in customer.items():
    if value is None:
        print(f"  {key}: ⚠ MISSING")
    else:
        print(f"  {key}: {value}")
```

```text
# Output:
  name: Alex Rivera
  email: alex@example.com
  phone: ⚠ MISSING
  company: ⚠ MISSING
  lifetime_value: 2340.5
```

### None Comparison

```python
# Always use 'is' and 'is not' with None, never ==
value = None

# Correct
print(f"value is None: {value is None}")
print(f"value is not None: {value is not None}")

# Works but NOT recommended
print(f"value == None: {value == None}")
```

```text
# Output:
value is None: True
value is not None: False
value == None: True
```

### Default Values with None

```python
def calculate_discount(price, discount_rate=None):
    """Apply discount if provided, otherwise return full price."""
    if discount_rate is None:
        return price
    return price * (1 - discount_rate)

print(f"No discount:  ${calculate_discount(100):,.2f}")
print(f"20% off:      ${calculate_discount(100, 0.20):,.2f}")
```

```text
# Output:
No discount:  $100.00
20% off:      $80.00
```

<div class="interview-tip">

**Mutable vs Immutable — a classic interview trap:**

**Immutable types** (cannot be changed after creation): `int`, `float`, `str`, `bool`, `tuple`
**Mutable types** (can be changed in place): `list`, `dict`, `set`

Why it matters: If you pass a mutable object to a function, the function can modify the original. With immutable objects, it can't.

```python
# Immutable — string operations create NEW strings
name = "hello"
upper_name = name.upper()
print(f"Original: {name}")    # Still "hello"
print(f"Upper: {upper_name}") # New string "HELLO"

# Mutable — list is modified in place
sales = [100, 200, 300]
sales.append(400)
print(f"Sales: {sales}")  # [100, 200, 300, 400] — original changed
```

**Bonus interview point:** String concatenation in a loop is O(n²) because each `+=` creates a new string. Use `"".join()` instead — it's O(n).

</div>

## Practical Example: Cleaning a Data Record

```python
# Raw data from a form submission
raw_record = {
    "name": "  john DOE  ",
    "email": "  John.Doe@EMAIL.COM  ",
    "revenue": "$45,200.00",
    "signup_date": "2024-03-15",
    "is_premium": "true"
}

# Clean it
clean_record = {
    "name": raw_record["name"].strip().title(),
    "email": raw_record["email"].strip().lower(),
    "revenue": float(raw_record["revenue"].replace("$", "").replace(",", "")),
    "signup_date": raw_record["signup_date"],
    "is_premium": raw_record["is_premium"].lower() == "true"
}

for key, value in clean_record.items():
    print(f"  {key}: {value} ({type(value).__name__})")
```

```text
# Output:
  name: John Doe (str)
  email: john.doe@email.com (str)
  revenue: 45200.0 (float)
  signup_date: 2024-03-15 (str)
  is_premium: True (bool)
```

<div class="challenge">

### Challenge: Clean a Messy Customer Name

You receive this raw string from a database export:

```python
raw = "   jAnE    sMITH   |  VIP  | $12,450.00  |  inactive  "
```

Write code that:
1. Splits on `|` to get each field
2. Strips whitespace from every field
3. Converts the name to title case → `"Jane Smith"`
4. Keeps the tier as uppercase → `"VIP"`
5. Converts revenue to a float → `12450.0`
6. Converts status to a boolean (`True` if "active", `False` otherwise) → `False`
7. Prints each cleaned field with its type

**Expected output:**
```text
Name:    Jane Smith (str)
Tier:    VIP (str)
Revenue: 12450.0 (float)
Active:  False (bool)
```

</div>

## Common Interview Questions

### Q1: What is the difference between mutable and immutable types in Python?

**A:** Immutable types (`int`, `float`, `str`, `bool`, `tuple`, `frozenset`) cannot be changed after creation — any operation that seems to modify them actually creates a new object. Mutable types (`list`, `dict`, `set`) can be changed in place. This matters for function arguments: if you pass a list to a function and the function modifies it, the caller's list changes too. Immutable types are also hashable, which is why strings can be dict keys but lists cannot.

### Q2: Why should you use `is` instead of `==` when checking for `None`?

**A:** `is` checks identity (same object in memory), while `==` checks equality (same value). `None` is a singleton — there's exactly one `None` object. Using `is None` is faster and more correct because a class could override `__eq__` to return `True` when compared to `None`, which would be a bug. PEP 8 explicitly recommends `is` / `is not` for `None` checks.

### Q3: What is the difference between `int()` and `float()` for type casting?

**A:** `int()` converts to a whole number — it truncates decimals (`int(3.9)` → `3`, not `4`). It also parses integer strings (`int("42")` → `42`) but fails on decimal strings (`int("3.14")` raises `ValueError`). `float()` converts to a decimal number and is more forgiving — `float("3.14")` → `3.14` and `float("42")` → `42.0`. When cleaning data, it's safer to convert to `float` first, then to `int` if needed: `int(float("3.14"))` → `3`.

### Q4: What are falsy values in Python?

**A:** Falsy values evaluate to `False` in a boolean context: `False`, `0`, `0.0`, `""` (empty string), `[]` (empty list), `{}` (empty dict), `set()`, `None`, and `0j`. Everything else is truthy. This is critical for data validation — `if not value:` catches empty strings, zero, None, and empty lists all at once. Be careful: `if not revenue:` will trigger for both `None` (missing data) and `0` (legitimate zero revenue).

### Q5: Why is string concatenation in a loop bad for performance?

**A:** Strings are immutable, so every `+=` creates a brand-new string object and copies all previous characters. For n concatenations, this is O(n²) total work. The fix is `"".join(list_of_strings)`, which pre-allocates memory and copies each string once — O(n) total. Example: building a report line-by-line with `result += line` in a loop over 100K rows is dramatically slower than `result = "\n".join(lines)`. In data analytics, this matters when generating large text outputs.
