---
title: "Decorators & Generators — Advanced Python Patterns"
description: "Level up your Python with decorators and generators — write memory-efficient, reusable code for large datasets."
category: "python"
order: 110
phase: 1
tags: ["python", "decorators", "generators", "advanced"]
publishedDate: 2025-02-10
prevSlug: "lambda-map-filter"
nextSlug: ""
seoTitle: "Python Decorators & Generators Tutorial | Datalogify"
seoDescription: "Master Python decorators and generators — timing functions, caching, lazy evaluation for big data processing."
---

## Why This Matters

Decorators let you add behavior to functions without changing them — perfect for logging, timing, and caching in data pipelines. Generators let you process datasets too large for memory. Together, they're what separates "writes scripts" from "builds production systems."

## Decorators — Wrap Functions

A decorator is a function that takes a function and returns an enhanced version.

```python
# Simple decorator
def uppercase(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@uppercase
def greet(name):
    return f"hello, {name}"

print(greet("analyst"))
```

```text
HELLO, ANALYST
```

### Timing Decorator (Most Common in Analytics)

```python
import time
from functools import wraps

def timer(func):
    """Measure how long a function takes to run."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"⏱ {func.__name__} took {elapsed:.3f}s")
        return result
    return wrapper

@timer
def process_sales_data(n_records):
    """Simulate processing sales records."""
    total = sum(i * 1.08 for i in range(n_records))
    return total

result = process_sales_data(1_000_000)
print(f"Total: ${result:,.2f}")
```

```text
⏱ process_sales_data took 0.127s
Total: $540,000,432,000.00
```

### Logging Decorator

```python
import logging
from functools import wraps

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")

def log_call(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"Calling {func.__name__}({args}, {kwargs})")
        result = func(*args, **kwargs)
        logging.info(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_call
def calculate_growth(current, previous):
    if previous == 0:
        return 0
    return round((current - previous) / previous * 100, 2)

growth = calculate_growth(150000, 120000)
print(f"Growth: {growth}%")
```

```text
2025-02-10 10:30:00 Calling calculate_growth((150000, 120000), {})
2025-02-10 10:30:00 calculate_growth returned 25.0
Growth: 25.0%
```

### Retry Decorator (For API Calls)

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=1):
    """Retry a function if it raises an exception."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        raise
                    print(f"Attempt {attempt} failed: {e}. Retrying in {delay}s...")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def fetch_data(url):
    """Simulate an API call that sometimes fails."""
    import random
    if random.random() < 0.6:
        raise ConnectionError("Server timeout")
    return {"status": "success", "records": 1500}

# This will retry up to 3 times
# result = fetch_data("https://api.example.com/sales")
```

### Caching with @lru_cache

```python
from functools import lru_cache
import time

@lru_cache(maxsize=128)
def expensive_query(customer_id):
    """Simulate a slow database query."""
    time.sleep(0.1)  # Simulates DB latency
    return {"id": customer_id, "name": f"Customer {customer_id}", "revenue": customer_id * 1000}

# First call — slow (hits "database")
start = time.time()
result1 = expensive_query(42)
print(f"First call: {time.time() - start:.3f}s — {result1}")

# Second call — instant (cached)
start = time.time()
result2 = expensive_query(42)
print(f"Cached call: {time.time() - start:.6f}s — {result2}")

print(f"\nCache info: {expensive_query.cache_info()}")
```

```text
First call: 0.101s — {'id': 42, 'name': 'Customer 42', 'revenue': 42000}
Cached call: 0.000002s — {'id': 42, 'name': 'Customer 42', 'revenue': 42000}

Cache info: CacheInfo(hits=1, misses=1, maxsize=128, currsize=1)
```

## Generators — Lazy Evaluation

Generators produce values one at a time using `yield`. They don't store everything in memory.

```python
# Regular function — stores ALL values
def get_squares_list(n):
    result = []
    for i in range(n):
        result.append(i ** 2)
    return result

# Generator — yields one value at a time
def get_squares_gen(n):
    for i in range(n):
        yield i ** 2

# Compare memory
import sys
list_result = get_squares_list(10000)
gen_result = get_squares_gen(10000)

print(f"List memory: {sys.getsizeof(list_result):,} bytes")
print(f"Generator memory: {sys.getsizeof(gen_result)} bytes")
```

```text
List memory: 87,624 bytes
Generator memory: 200 bytes
```

### Processing Large Files

```python
def read_sales_csv(filepath):
    """Generator that yields one clean row at a time from a large CSV."""
    with open(filepath) as f:
        header = f.readline().strip().split(",")
        for line in f:
            values = line.strip().split(",")
            row = dict(zip(header, values))
            try:
                row["revenue"] = float(row["revenue"])
                yield row
            except (ValueError, KeyError):
                continue  # Skip bad rows

# Process a 10GB file using only a few KB of memory
# total_revenue = sum(row["revenue"] for row in read_sales_csv("huge_file.csv"))
# print(f"Total: ${total_revenue:,.2f}")
```

### Generator Pipelines

```python
def read_numbers(data):
    """Stage 1: Parse raw data."""
    for item in data:
        try:
            yield float(item)
        except ValueError:
            continue

def filter_positive(numbers):
    """Stage 2: Keep only positive values."""
    for n in numbers:
        if n > 0:
            yield n

def calculate_tax(amounts, rate=0.08):
    """Stage 3: Add tax."""
    for amount in amounts:
        yield round(amount * (1 + rate), 2)

# Pipeline — data flows through stages without storing intermediate results
raw = ["100", "abc", "-50", "200", "N/A", "350", "0", "175"]

pipeline = calculate_tax(filter_positive(read_numbers(raw)))

for taxed in pipeline:
    print(f"${taxed}")

print(f"\nTotal: ${sum(calculate_tax(filter_positive(read_numbers(raw)))):,.2f}")
```

```text
$108.0
$216.0
$378.0
$189.0

Total: $891.00
```

### itertools — Generator Power Tools

```python
from itertools import chain, islice, groupby

# chain — combine multiple iterables
q1 = [50000, 52000, 48000]
q2 = [55000, 58000, 60000]
q3 = [45000, 47000, 51000]

all_months = list(chain(q1, q2, q3))
print(f"All months: {all_months}")
print(f"Total: ${sum(chain(q1, q2, q3)):,}")

# islice — take first N from generator
def infinite_ids():
    n = 1
    while True:
        yield f"TXN-{n:06d}"
        n += 1

first_5 = list(islice(infinite_ids(), 5))
print(f"First 5 IDs: {first_5}")

# groupby — group sorted data
sales = [
    ("East", 50000), ("East", 45000),
    ("West", 60000), ("West", 55000), ("West", 58000),
    ("North", 30000),
]

for region, group in groupby(sales, key=lambda x: x[0]):
    amounts = [g[1] for g in group]
    print(f"{region}: ${sum(amounts):,} ({len(amounts)} sales)")
```

```text
All months: [50000, 52000, 48000, 55000, 58000, 60000, 45000, 47000, 51000]
Total: $466,000
First 5 IDs: ['TXN-000001', 'TXN-000002', 'TXN-000003', 'TXN-000004', 'TXN-000005']
East: $95,000 (2 sales)
West: $173,000 (3 sales)
North: $30,000 (1 sales)
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- **Decorators:** Timing ETL steps, retrying API calls, caching expensive queries, logging data pipeline stages
- **Generators:** Processing multi-GB log files, streaming data from APIs, building ETL pipelines that don't run out of memory
- **itertools:** Combining data from multiple sources, batching API calls, deduplicating sorted streams

</div>

<div class="challenge">

**Mini-Challenge:**
1. Write a `@validate_positive` decorator that raises `ValueError` if any numeric argument is negative
2. Write a generator `batch(iterable, size)` that yields lists of `size` items from any iterable
3. Use your batch generator to process a list of 1000 items in groups of 100

</div>

## Common Interview Questions

### Q1: What is a decorator and when would you use one?

**Answer:** A decorator is a function that takes another function as input and returns a modified version. It's syntactic sugar for `func = decorator(func)`. Common uses: logging, timing, authentication, caching, input validation, and retry logic. In data analytics, timing decorators and caching are the most common.

### Q2: What's the difference between a generator and a list?

**Answer:** A list stores all values in memory at once. A generator produces values on-demand using `yield`, keeping only one value in memory at a time. Generators can't be indexed or sliced, and can only be iterated once. Use generators when the dataset is larger than available memory or when you only need each value once.

### Q3: What does `@wraps(func)` do and why is it important?

**Answer:** `@wraps(func)` from `functools` preserves the original function's `__name__`, `__doc__`, and other metadata. Without it, the decorated function looks like `wrapper` in error messages and documentation. It's essential for debugging and introspection in production code.

### Q4: Can a generator be restarted?

**Answer:** No. Once a generator is exhausted (all values yielded), it cannot be restarted. You must create a new generator instance. This is why generator functions are preferred over generator objects — you can call the function again to get a fresh generator.

### Q5: What's the difference between `yield` and `return`?

**Answer:** `return` exits the function permanently and sends back one value. `yield` pauses the function, sends back a value, and remembers where it left off. The next call to `next()` resumes from after the `yield`. A function with `yield` becomes a generator function. `return` in a generator raises `StopIteration`.
