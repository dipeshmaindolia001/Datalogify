---
title: "Error Handling — Try, Except, Finally"
description: "Write robust code that handles errors gracefully — essential for production data pipelines and ETL scripts."
category: "python"
order: 10
phase: 1
tags: ["python", "errors", "try-except", "debugging"]
publishedDate: 2025-01-25
prevSlug: "file-handling"
nextSlug: "list-comprehensions"
seoTitle: "Python Error Handling Tutorial | Datalogify"
seoDescription: "Master Python try/except, custom exceptions, and debugging techniques for reliable data analytics code."
---

## Why This Matters

Data is messy. Files are missing, APIs time out, users enter garbage values. If your code crashes on the first bad row in a 100,000-row dataset, you've wasted hours. Error handling keeps your pipelines running.

## Common Python Errors

```python
# TypeError — wrong type
result = "revenue: " + 50000
# TypeError: can only concatenate str to str

# KeyError — missing dict key
data = {"name": "Alice"}
print(data["salary"])
# KeyError: 'salary'

# FileNotFoundError
with open("nonexistent.csv") as f:
    pass
# FileNotFoundError: No such file or directory

# ValueError — wrong value
num = int("not_a_number")
# ValueError: invalid literal for int()

# ZeroDivisionError
growth = 100 / 0
# ZeroDivisionError: division by zero

# IndexError — out of range
items = [1, 2, 3]
print(items[10])
# IndexError: list index out of range
```

## Try / Except Basics

```python
# Basic error handling
try:
    revenue = int("$50,000")  # This will fail
except ValueError:
    print("Could not convert revenue to integer")
    revenue = 0

print(f"Revenue: {revenue}")
```

```text
Could not convert revenue to integer
Revenue: 0
```

### Catching Specific Exceptions

```python
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print(f"Warning: Division by zero ({a}/{b}), returning 0")
        return 0
    except TypeError:
        print(f"Warning: Invalid types ({type(a)}, {type(b)}), returning None")
        return None
    return result

print(safe_divide(100, 5))     # Normal
print(safe_divide(100, 0))     # ZeroDivisionError
print(safe_divide("100", 5))   # TypeError
```

```text
20.0
Warning: Division by zero (100/0), returning 0
0
Warning: Invalid types (<class 'str'>, <class 'int'>), returning None
None
```

## Try / Except / Else / Finally

```python
def load_config(filepath):
    try:
        with open(filepath, "r") as f:
            config = f.read()
    except FileNotFoundError:
        print(f"Config file '{filepath}' not found, using defaults")
        config = "default_settings"
    except PermissionError:
        print(f"No permission to read '{filepath}'")
        config = "default_settings"
    else:
        # Only runs if NO exception occurred
        print(f"Successfully loaded config from '{filepath}'")
    finally:
        # ALWAYS runs, exception or not
        print("Config loading complete")
    
    return config

result = load_config("settings.ini")
print(f"Config: {result}")
```

```text
Config file 'settings.ini' not found, using defaults
Config loading complete
Config: default_settings
```

## Real-World: Processing Dirty Data

```python
# Processing a CSV where some rows have bad data
raw_sales = [
    {"product": "Widget A", "revenue": "50000", "units": "1200"},
    {"product": "Widget B", "revenue": "N/A", "units": "800"},
    {"product": "Widget C", "revenue": "28000", "units": ""},
    {"product": "Widget D", "revenue": "42000", "units": "950"},
]

clean_sales = []
errors = []

for i, row in enumerate(raw_sales):
    try:
        clean = {
            "product": row["product"],
            "revenue": int(row["revenue"]),
            "units": int(row["units"]),
        }
        clean_sales.append(clean)
    except (ValueError, KeyError) as e:
        errors.append({"row": i, "product": row.get("product", "Unknown"), "error": str(e)})

print(f"Successfully processed: {len(clean_sales)} rows")
print(f"Errors: {len(errors)} rows")
for err in errors:
    print(f"  Row {err['row']} ({err['product']}): {err['error']}")

total = sum(s["revenue"] for s in clean_sales)
print(f"\nTotal revenue (clean data): ${total:,}")
```

```text
Successfully processed: 2 rows
Errors: 2 rows
  Row 1 (Widget B): invalid literal for int() with base 10: 'N/A'
  Row 2 (Widget C): invalid literal for int() with base 10: ''

Total revenue (clean data): $92,000
```

## Raising Exceptions

```python
def validate_salary(salary):
    if not isinstance(salary, (int, float)):
        raise TypeError(f"Salary must be a number, got {type(salary).__name__}")
    if salary < 0:
        raise ValueError(f"Salary cannot be negative: {salary}")
    if salary > 10_000_000:
        raise ValueError(f"Salary exceeds maximum: {salary}")
    return salary

# Test it
try:
    validate_salary(95000)
    print("Valid salary ✓")
    
    validate_salary(-5000)
except ValueError as e:
    print(f"Validation error: {e}")
except TypeError as e:
    print(f"Type error: {e}")
```

```text
Valid salary ✓
Validation error: Salary cannot be negative: -5000
```

## Custom Exceptions

```python
class DataQualityError(Exception):
    """Raised when data fails quality checks."""
    def __init__(self, column, value, reason):
        self.column = column
        self.value = value
        self.reason = reason
        super().__init__(f"Column '{column}': {reason} (got: {value})")

class MissingDataError(DataQualityError):
    """Raised when required data is missing."""
    pass

def validate_row(row):
    if not row.get("email"):
        raise MissingDataError("email", row.get("email"), "Required field is empty")
    if "@" not in row["email"]:
        raise DataQualityError("email", row["email"], "Invalid email format")

# Usage
rows = [
    {"name": "Alice", "email": "alice@company.com"},
    {"name": "Bob", "email": ""},
    {"name": "Carol", "email": "carol-at-company"},
]

for row in rows:
    try:
        validate_row(row)
        print(f"{row['name']}: Valid ✓")
    except MissingDataError as e:
        print(f"{row['name']}: MISSING — {e}")
    except DataQualityError as e:
        print(f"{row['name']}: INVALID — {e}")
```

```text
Alice: Valid ✓
Bob: MISSING — Column 'email': Required field is empty (got: )
Carol: INVALID — Column 'email': Invalid email format (got: carol-at-company)
```

## Logging Instead of Print

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def process_file(filepath):
    logging.info(f"Starting to process: {filepath}")
    
    try:
        with open(filepath) as f:
            data = f.read()
        logging.info(f"Loaded {len(data)} characters")
    except FileNotFoundError:
        logging.error(f"File not found: {filepath}")
        return None
    except Exception as e:
        logging.critical(f"Unexpected error: {e}")
        raise
    
    logging.info("Processing complete")
    return data
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Building resilient ETL pipelines that handle bad data without crashing
- Logging errors for debugging production data issues
- Validating user inputs before processing
- Handling API failures with retry logic
- Writing data quality checks that report issues instead of silently failing

</div>

<div class="challenge">

**Mini-Challenge:** Write a function `safe_parse_revenue(value)` that:
1. Accepts strings like "$50,000", "50000", "N/A", "", None
2. Returns the numeric value as an int when possible
3. Returns 0 for any value that can't be parsed
4. Logs a warning with the original value when it falls back to 0

</div>

## Common Interview Questions

### Q1: What's the difference between `except Exception` and a bare `except:`?

**Answer:** `except Exception` catches all standard exceptions but NOT system-exiting ones like `KeyboardInterrupt` and `SystemExit`. A bare `except:` catches literally everything, including those — which can make your program impossible to stop with Ctrl+C. Always use `except Exception` at minimum, and prefer catching specific exceptions.

### Q2: When should you use `else` in try/except?

**Answer:** The `else` block runs only when `try` succeeds without exceptions. Use it to separate the "risky" code (in `try`) from the "success path" code (in `else`). This makes it clear which code might raise exceptions and prevents accidentally catching exceptions from the success code.

### Q3: What does `finally` guarantee?

**Answer:** `finally` always executes — whether `try` succeeded, `except` caught an error, or even if `return` was called inside `try` or `except`. It's used for cleanup: closing files, database connections, releasing locks. The `with` statement is preferred for file/resource cleanup, but `finally` is useful for custom cleanup logic.

### Q4: Should you catch all exceptions with a generic `except Exception`?

**Answer:** Generally no. Catch specific exceptions you expect and can handle meaningfully. Generic `except Exception` should only be at the outermost level (e.g., main function of a script) to log unexpected errors before exiting. Catching too broadly hides bugs and makes debugging harder.

### Q5: How do you re-raise an exception after logging it?

**Answer:** Use `raise` without arguments inside an `except` block: `except ValueError as e: logging.error(e); raise`. This preserves the original traceback. If you do `raise e`, you lose the original stack trace. You can also use `raise NewException() from e` to chain exceptions.
