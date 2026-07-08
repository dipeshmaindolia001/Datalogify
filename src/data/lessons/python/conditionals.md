---
title: "If, Elif, Else — Making Decisions in Code"
description: "Master conditional logic in Python — the foundation of data filtering and business rule implementation."
category: "python"
order: 6
phase: 1
tags: ["python", "conditionals", "if-else", "logic"]
publishedDate: 2025-01-20
prevSlug: "pandas-intro"
nextSlug: "string-methods"
seoTitle: "Python If Else Statements Tutorial | Datalogify"
seoDescription: "Learn Python if, elif, else with real data analytics examples — filter data, apply business rules, handle edge cases."
---

## Why This Matters

Every data pipeline makes decisions. Should this transaction be flagged as fraud? Does this customer qualify for a discount? Is this sales rep hitting quota? Conditional logic is how you encode business rules into code — and you'll use it in literally every script you write.

## Basic if Statement

An `if` block runs only when its condition evaluates to `True`.

```python
monthly_revenue = 142000
target = 120000

if monthly_revenue >= target:
    print(f"Target hit! Revenue: ${monthly_revenue:,}")
    surplus = monthly_revenue - target
    print(f"Surplus: ${surplus:,}")
```

```text
# Output:
Target hit! Revenue: $142,000
Surplus: $22,000
```

**Indentation matters.** Python uses 4 spaces to define what's inside the `if` block. No braces, no keywords — just indentation.

## if / else — Two Paths

```python
actual_sales = 85000
quota = 100000

if actual_sales >= quota:
    status = "Met Quota"
    bonus = actual_sales * 0.10
else:
    status = "Below Quota"
    bonus = 0

print(f"Status: {status}")
print(f"Bonus:  ${bonus:,.2f}")
```

```text
# Output:
Status: Below Quota
Bonus:  $0.00
```

## if / elif / else — Multiple Conditions

This is where it gets real. Most business rules have more than two outcomes.

```python
# Customer segmentation based on annual spend
annual_spend = 12500

if annual_spend >= 50000:
    tier = "Platinum"
    discount = 0.20
elif annual_spend >= 25000:
    tier = "Gold"
    discount = 0.15
elif annual_spend >= 10000:
    tier = "Silver"
    discount = 0.10
elif annual_spend >= 5000:
    tier = "Bronze"
    discount = 0.05
else:
    tier = "Standard"
    discount = 0.0

print(f"Annual Spend: ${annual_spend:,}")
print(f"Tier:         {tier}")
print(f"Discount:     {discount:.0%}")
```

```text
# Output:
Annual Spend: $12,500
Tier:         Silver
Discount:     10%
```

**Order matters.** Python checks conditions top-to-bottom and stops at the first `True`. If you put `annual_spend >= 5000` first, a $50k customer would get the Bronze tier — wrong.

<div class="interview-tip">

**Where this is used in real jobs:** Customer segmentation, lead scoring, commission calculations, data quality flags, ETL pipeline branching — basically every business rule you'll ever implement starts with `if/elif/else`.

</div>

## Comparison Operators

These return `True` or `False`. You'll combine them constantly.

```python
revenue = 150000
target = 120000
last_year = 135000

print(f"revenue == target:  {revenue == target}")    # Equal
print(f"revenue != target:  {revenue != target}")    # Not equal
print(f"revenue > target:   {revenue > target}")     # Greater than
print(f"revenue < target:   {revenue < target}")     # Less than
print(f"revenue >= target:  {revenue >= target}")    # Greater or equal
print(f"revenue <= last_year: {revenue <= last_year}") # Less or equal
```

```text
# Output:
revenue == target:  False
revenue != target:  True
revenue > target:   True
revenue < target:   False
revenue >= target:  True
revenue <= last_year: False
```

## Logical Operators — and, or, not

Combine multiple conditions to build complex business rules.

```python
# Lead qualification: high-value AND in target region
deal_size = 75000
region = "West"
has_budget = True

# AND — both must be True
if deal_size > 50000 and region == "West":
    print("Qualified lead — assign to senior rep")

# OR — at least one must be True
if deal_size > 100000 or has_budget:
    print("Worth pursuing")

# NOT — inverts the condition
is_churned = False
if not is_churned:
    print("Active customer — include in campaign")
```

```text
# Output:
Qualified lead — assign to senior rep
Worth pursuing
Active customer — include in campaign
```

### Combining Multiple Conditions

```python
# Complex business rule: commission calculation
sales = 280000
quota = 200000
tenure_years = 3
region = "Northeast"

if sales >= quota * 1.5 and tenure_years >= 2:
    commission_rate = 0.12
    label = "Superstar"
elif sales >= quota and (region == "Northeast" or region == "West"):
    commission_rate = 0.08
    label = "Strong Performer"
elif sales >= quota:
    commission_rate = 0.06
    label = "Met Quota"
else:
    commission_rate = 0.03
    label = "Developing"

commission = sales * commission_rate
print(f"Rep Status:  {label}")
print(f"Sales:       ${sales:,}")
print(f"Rate:        {commission_rate:.0%}")
print(f"Commission:  ${commission:,.2f}")
```

```text
# Output:
Rep Status:  Superstar
Sales:       $280,000
Rate:        12%
Commission:  $33,600.00
```

## Truthiness — What Python Considers True or False

Python evaluates many things as `True` or `False`, not just booleans. This matters when checking if data exists.

```python
# These are all "falsy" — they evaluate to False
falsy_values = [0, 0.0, "", [], {}, set(), None, False]

for val in falsy_values:
    if not val:
        print(f"{str(val):<10} → Falsy  (type: {type(val).__name__})")
```

```text
# Output:
0          → Falsy  (type: int)
0.0        → Falsy  (type: float)
           → Falsy  (type: str)
[]         → Falsy  (type: list)
{}         → Falsy  (type: dict)
set()      → Falsy  (type: set)
None       → Falsy  (type: NoneType)
False      → Falsy  (type: bool)
```

### Practical Use — Checking for Missing Data

```python
customer_name = ""
email = "sarah@example.com"
phone = None

# Pythonic way to check for missing data
if not customer_name:
    print("Warning: Customer name is missing")

if email:
    print(f"Email found: {email}")

if phone is None:
    print("Phone: Not provided")
```

```text
# Output:
Warning: Customer name is missing
Email found: sarah@example.com
Phone: Not provided
```

<div class="interview-tip">

**Interview favorite:** "What's the difference between `== None` and `is None`?"

Use `is None` (identity check), not `== None` (equality check). `is` checks if it's the same object in memory. `None` is a singleton in Python, so `is` is both faster and more correct. PEP 8 requires `is None`.

</div>

## Nested Conditionals

Sometimes you need decisions inside decisions. Keep nesting shallow — 2 levels max.

```python
# Order processing logic
order_total = 350
is_member = True
has_coupon = True

if order_total > 0:
    if is_member:
        discount = 0.10
        if has_coupon:
            discount += 0.05  # Stack coupon on top
        final = order_total * (1 - discount)
        print(f"Member price: ${final:.2f} ({discount:.0%} off)")
    else:
        if has_coupon:
            discount = 0.05
            final = order_total * (1 - discount)
            print(f"Coupon price: ${final:.2f} ({discount:.0%} off)")
        else:
            print(f"Full price: ${order_total:.2f}")
else:
    print("Invalid order total")
```

```text
# Output:
Member price: $297.50 (15% off)
```

**Better approach:** Flatten nested conditionals when possible.

```python
order_total = 350
is_member = True
has_coupon = True

# Flat version — much easier to read
discount = 0
if is_member:
    discount += 0.10
if has_coupon:
    discount += 0.05

final = order_total * (1 - discount)
print(f"Final price: ${final:.2f} ({discount:.0%} off)")
```

```text
# Output:
Final price: $297.50 (15% off)
```

## Ternary Expression — One-Line Conditionals

When you just need to assign a value based on a condition:

```python
revenue = 95000
target = 100000

# Ternary: value_if_true if condition else value_if_false
status = "On Track" if revenue >= target else "Behind"
print(f"Status: {status}")

# Great for quick labels in data processing
growth = -0.03
direction = "up" if growth > 0 else "down" if growth < 0 else "flat"
print(f"Revenue is {direction} ({growth:.1%})")
```

```text
# Output:
Status: Behind
Revenue is down (-3.0%)
```

### Ternary in Real Data Pipelines

```python
# Processing a batch of transactions
transactions = [
    {"id": "T001", "amount": 4500, "type": "sale"},
    {"id": "T002", "amount": -200, "type": "refund"},
    {"id": "T003", "amount": 12000, "type": "sale"},
    {"id": "T004", "amount": 800, "type": "sale"},
]

for txn in transactions:
    flag = "HIGH" if txn["amount"] > 10000 else "NORMAL"
    sign = "+" if txn["amount"] > 0 else ""
    print(f"{txn['id']} | {sign}${abs(txn['amount']):>8,} | {txn['type']:<8} | {flag}")
```

```text
# Output:
T001 | +$   4,500 | sale     | NORMAL
T002 | -$     200 | refund   | NORMAL
T003 | +$  12,000 | sale     | HIGH
T004 | +$     800 | sale     | NORMAL
```

## Data Validation Patterns

This is what you'll actually write at work — validating data before processing it.

```python
def validate_employee_record(record):
    """Validate an employee record before loading into the database."""
    errors = []

    # Check required fields
    if not record.get("name"):
        errors.append("Missing employee name")

    if not record.get("email"):
        errors.append("Missing email")
    elif "@" not in record["email"]:
        errors.append("Invalid email format")

    salary = record.get("salary")
    if salary is None:
        errors.append("Missing salary")
    elif not isinstance(salary, (int, float)):
        errors.append("Salary must be numeric")
    elif salary < 0:
        errors.append("Salary cannot be negative")

    department = record.get("department", "")
    valid_depts = ["Engineering", "Sales", "Marketing", "Finance", "HR"]
    if department and department not in valid_depts:
        errors.append(f"Invalid department: {department}")

    return errors

# Test with sample records
records = [
    {"name": "Alice Chen", "email": "alice@company.com", "salary": 95000, "department": "Engineering"},
    {"name": "", "email": "bob@company.com", "salary": -5000, "department": "Sales"},
    {"name": "Carol Davis", "email": "bad-email", "salary": 72000, "department": "Unknown"},
]

for i, rec in enumerate(records):
    issues = validate_employee_record(rec)
    name = rec.get("name") or f"Record {i+1}"
    if issues:
        print(f"✗ {name}: {', '.join(issues)}")
    else:
        print(f"✓ {name}: Valid")
```

```text
# Output:
✓ Alice Chen: Valid
✗ Record 2: Missing employee name, Salary cannot be negative
✗ Carol Davis: Invalid email format, Invalid department: Unknown
```

## Membership Checks with `in`

The `in` keyword works beautifully with conditionals for checking membership.

```python
# Check if a value exists in a collection
premium_regions = ["Northeast", "West Coast", "Chicago"]
customer_region = "West Coast"

if customer_region in premium_regions:
    print(f"{customer_region} gets priority shipping")

# Check substrings
email = "user@company.com"
if "@company.com" in email:
    print("Internal employee email detected")

# Combine with not
status = "cancelled"
active_statuses = ["active", "pending", "trial"]
if status not in active_statuses:
    print(f"Status '{status}' — skip this record")
```

```text
# Output:
West Coast gets priority shipping
Internal employee email detected
Status 'cancelled' — skip this record
```

## Putting It All Together — Sales Pipeline Processor

```python
# Process a sales pipeline and categorize deals
pipeline = [
    {"deal": "Acme Corp", "value": 120000, "stage": "proposal", "days_open": 45},
    {"deal": "Beta Inc", "value": 35000, "stage": "negotiation", "days_open": 90},
    {"deal": "Gamma LLC", "value": 8000, "stage": "closed_won", "days_open": 15},
    {"deal": "Delta Co", "value": 250000, "stage": "discovery", "days_open": 120},
    {"deal": "Echo Ltd", "value": 52000, "stage": "closed_lost", "days_open": 60},
]

total_pipeline = 0
at_risk_count = 0

print(f"{'Deal':<15} {'Value':>10} {'Stage':<14} {'Action'}")
print("-" * 60)

for deal in pipeline:
    value = deal["value"]
    stage = deal["stage"]
    days = deal["days_open"]

    # Determine action based on multiple factors
    if stage == "closed_won":
        action = "✓ Booked"
    elif stage == "closed_lost":
        action = "✗ Lost"
    elif days > 90 and value > 100000:
        action = "⚠ Escalate to VP"
        at_risk_count += 1
    elif days > 60:
        action = "⚠ Follow up ASAP"
        at_risk_count += 1
    else:
        action = "→ On track"

    # Only count open deals in pipeline
    if stage not in ["closed_won", "closed_lost"]:
        total_pipeline += value

    size = "Enterprise" if value >= 100000 else "Mid-Market" if value >= 25000 else "SMB"
    print(f"{deal['deal']:<15} ${value:>8,} {stage:<14} {action}")

print("-" * 60)
print(f"Open Pipeline:  ${total_pipeline:,}")
print(f"At-Risk Deals:  {at_risk_count}")
```

```text
# Output:
Deal              Value Stage          Action
------------------------------------------------------------
Acme Corp       $120,000 proposal       → On track
Beta Inc         $35,000 negotiation    ⚠ Follow up ASAP
Gamma LLC         $8,000 closed_won     ✓ Booked
Delta Co        $250,000 discovery      ⚠ Escalate to VP
Echo Ltd         $52,000 closed_lost    ✗ Lost
------------------------------------------------------------
Open Pipeline:  $405,000
At-Risk Deals:  2
```

<div class="challenge">

### Challenge: Build a Tax Calculator

Create a function that calculates US federal income tax using these brackets:

| Income Range | Rate |
|---|---|
| $0 — $11,000 | 10% |
| $11,001 — $44,725 | 12% |
| $44,726 — $95,375 | 22% |
| $95,376 — $182,100 | 24% |
| Over $182,100 | 32% |

Test with incomes of `$55,000`, `$120,000`, and `$200,000`. Print the tax bracket and total tax owed.

**Hint:** This is a progressive tax — each bracket only applies to income within that range, not the entire income.

</div>

## Common Interview Questions

### Q1: What's the difference between `if/elif` and multiple `if` statements?

**A:** `if/elif` is mutually exclusive — once one condition is `True`, the rest are skipped. Multiple `if` statements are independent — every single one is evaluated. Use `if/elif` when categories don't overlap (customer tiers). Use multiple `if` when conditions can stack (applying multiple discounts). Wrong choice means bugs: using separate `if` blocks for tax brackets would apply multiple rates to the same income.

### Q2: How does Python evaluate `and` and `or` in short-circuit fashion?

**A:** Python short-circuits: with `and`, if the first condition is `False`, it skips the second (result is already `False`). With `or`, if the first is `True`, it skips the second (result is already `True`). This is useful for safe checks: `if data and len(data) > 0` won't crash on `None` because `None` is falsy, so `len()` is never called.

### Q3: What values are "falsy" in Python?

**A:** `False`, `None`, `0`, `0.0`, empty string `""`, empty list `[]`, empty dict `{}`, empty set `set()`, and empty tuple `()`. Everything else is truthy. This is critical in data work: checking `if row["name"]` catches both `None` and empty strings, which are the two most common forms of missing text data.

### Q4: When should you use a ternary expression vs. a full if/else block?

**A:** Use ternary for simple, single-value assignments: `status = "active" if days < 30 else "stale"`. Use full `if/else` when you have multiple statements, side effects, or complex logic. Never nest ternaries more than one level deep — it becomes unreadable. In data pipelines, ternaries are perfect for creating flag columns or labels.

### Q5: What is the difference between `is` and `==`?

**A:** `==` checks value equality — do two objects have the same content? `is` checks identity — are they the exact same object in memory? Use `is` only for `None`, `True`, and `False` (singletons). For everything else, use `==`. Common mistake: `if x is 1` may work for small integers (Python caches -5 to 256) but breaks for larger numbers. Always use `x == 1` for value comparison.
