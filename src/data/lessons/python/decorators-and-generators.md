---
title: "Decorators & Generators — Advanced Python Patterns"
description: "Level up your Python with decorators and generators — write memory-efficient, reusable code for large datasets."
category: "python"
order: 111
phase: 1
tags: ["python", "decorators", "generators", "advanced"]
publishedDate: 2025-02-10
prevSlug: "lambda-map-filter"
nextSlug: ""
seoTitle: "Python Decorators & Generators Tutorial | Datalogify"
seoDescription: "Master Python decorators and generators — timing functions, caching, lazy evaluation for big data processing."
---

## Why This Matters

As you move from writing simple scripts to building production-grade data pipelines, you run into two major challenges:
1.  **Code Duplication (The Cross-Cutting Concern Problem):** You want to time how long multiple functions take to run, or retry API requests if they fail. Copy-pasting timing or logging code into fifty different functions makes your codebase bloated and unmaintainable.
2.  **Memory Constraints (The Big Data Problem):** If you try to load a 10-gigabyte CSV log file into a standard Python list, your system will run out of RAM and crash.

Python provides two elegant, built-in features to solve these exact problems: **Decorators** and **Generators**. Together, they allow you to write clean, reusable, and memory-efficient data processing code.

### The Visual Analogies

*   **Decorators are like Gift Wrapping:**
    Imagine you bought a simple wooden box (the **Function**). It does its job perfectly: it stores items. Now, you wrap it in premium paper, tie a red ribbon around it, and stick a gift tag on top (the **Decorator**).
    
    The underlying wooden box has not changed at all; it still stores items. However, it now has extra visual features and metadata (ribbon, wrapping). You can wrap any other product (another function) in the exact same wrapping paper without altering the products themselves.
    
    ```text
    [Raw Function] 
         │
         ▼
    ┌──────────────────────┐
    │  Decorator Wrapper   │
    │  ┌────────────────┐  │
    │  │  Raw Function  │  │
    │  └────────────────┘  │
    └──────────────────────┘
    ```

*   **Generators are like a Water Dispenser vs. a Giant Water Tank:**
    Imagine you need to supply water to a construction site:
    *   **The List Approach (Water Tank):** You order a giant 10,000-liter water tank (a **List**). The truck dumps all 10,000 liters of water onto your floor at once. You need massive physical space (system **RAM**) to hold all that water, even if you only drink one glass at a time.
    *   **The Generator Approach (Water Dispenser):** You install a water dispenser. Every time you are thirsty, you press the lever (call `next()`), and exactly one cup of water pours out (**`yield`**). Once you finish that cup, you press the lever again for the next cup. The water dispenser only holds one cup of water at the nozzle at any given second. The memory footprint is virtually zero, regardless of whether you end up drinking 10 liters or 10,000 liters.

    ```text
    List (Whole Tank):
    RAM: [====================================] (Loads all 1,000,000 items at once)
    
    Generator (Dispenser):
    RAM: [=]                                     (Generates item 1 -> discards -> item 2 -> discards)
    ```

---

## Step-by-Step Concept Breakdown

Before building decorators and generators, we must examine the Python mechanics that make them possible.

### Part A: Python Decorators

#### 1. Functions as First-Class Citizens
In Python, functions are objects. This means:
*   You can assign a function to a variable.
*   You can pass a function as an argument to another function.
*   You can return a function from inside another function.

```python
def shout(text):
    return text.upper()

# Assigning to a variable
yell = shout 
print(yell("hello")) # HELLO
```

#### 2. Inner Functions and Closures
An **Inner Function** is a function defined inside another function. A **Closure** is an inner function that retains access to variables from its outer (enclosing) scope, even after the outer function has finished executing.

```python
def make_multiplier(factor):
    def multiplier(number):
        # Accesses 'factor' from the outer scope
        return number * factor 
    return multiplier

double = make_multiplier(2)
print(double(5)) # Output: 10
```

#### 3. Decorator Syntax Under the Hood
A decorator is simply a function that takes another function as an argument, defines a wrapper function that adds some behavior, and returns the wrapper function.

```python
def my_decorator(func):
    def wrapper():
        print("Something before the function runs.")
        func()
        print("Something after the function runs.")
    return wrapper
```

When you use the `@` syntactic sugar:
```python
@my_decorator
def greet():
    print("Hello World!")
```
Python is executing this behind the scenes:
```python
greet = my_decorator(greet)
```

#### 4. The Boilerplate: Handling Arguments and Metadata
To make a decorator reusable for *any* function, the inner wrapper must accept `*args` (positional arguments) and `**kwargs` (keyword arguments) and pass them to the decorated function.

Additionally, decorating a function replaces its metadata (like its name and docstring) with the wrapper's metadata. To prevent this, we use **`functools.wraps`**.

```python
from functools import wraps

def professional_decorator(func):
    @wraps(func) # Preserves name and docstring of the original function
    def wrapper(*args, **kwargs):
        # Do something before
        result = func(*args, **kwargs)
        # Do something after
        return result
    return wrapper
```

---

### Part B: Python Generators

#### 1. The `yield` Keyword
A regular function runs until it hits a `return` statement or reaches the end. It then discards all its local variables.

A **Generator Function** contains the `yield` keyword. When Python compiles a function containing `yield`, it marks it as a generator. When you call the function, it does not run the code; instead, it returns a **Generator Object**.

```python
def simple_generator():
    print("Starting...")
    yield 1
    print("Resuming...")
    yield 2
```

#### 2. The Execution Lifecycle
When you call `next(gen_object)`:
1.  The generator runs from its current position until it hits a `yield` statement.
2.  It pauses execution, saves all its local variables and state, and returns the yielded value.
3.  The next time you call `next(gen_object)`, the generator resumes *exactly* where it was paused.
4.  If the generator reaches the end without hitting another `yield`, it raises a `StopIteration` exception, which signals loops to stop.

#### 3. Generator Expressions
Just like List Comprehensions build lists, **Generator Expressions** build generators. They use parentheses `()` instead of brackets `[]`:

```python
# List Comprehension (Loads everything into RAM)
list_comp = [x ** 2 for x in range(1000000)]

# Generator Expression (Calculates numbers on-the-fly)
gen_expr = (x ** 2 for x in range(1000000))
```

---

## Code / Practical Walkthroughs

Let's implement these patterns in practical analytics and data pipeline scenarios.

### Example 1: Execution Timer and Logging Decorator
In data pipelines, we must monitor performance. We will build a decorator that measures and logs the execution time of any function.

```python
import time
from functools import wraps

def time_and_log(func):
    """Decorator that measures execution time and prints arguments."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        
        print(f"[LOG] Executing '{func.__name__}' with args={args} kwargs={kwargs}")
        
        # Execute the actual function
        result = func(*args, **kwargs)
        
        duration = time.time() - start_time
        print(f"[LOG] Finished '{func.__name__}' in {duration:.4f} seconds")
        
        return result
    return wrapper

@time_and_log
def run_heavy_calculation(elements):
    """Simulates an expensive statistical operation."""
    total = 0
    for i in range(elements):
        total += i ** 0.5
    return total

# Run the decorated function
val = run_heavy_calculation(5000000)
print(f"Result: {val:,.2f}")
```

```text
# Output:
[LOG] Executing 'run_heavy_calculation' with args=(5000000,) kwargs={}
[LOG] Finished 'run_heavy_calculation' in 0.3120 seconds
Result: 7,453,559,365.17
```

---

### Example 2: API Retry Decorator with Exponential Backoff
When calling web APIs, connections occasionally fail due to brief network hiccups. We will write a decorator that automatically retries a function if it raises an exception, increasing the delay between retries.

```python
import time
import random
from functools import wraps

def retry_request(max_attempts=3, initial_delay=1):
    """Decorator factory that retries a function upon failure using backoff."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as err:
                    if attempt == max_attempts:
                        print(f"[RETRY] Attempt {attempt} failed permanently.")
                        raise err # Re-raise exception if all attempts fail
                    
                    # Randomize delay slightly to prevent simultaneous retry thundering herd
                    sleep_time = delay + random.uniform(0, 0.5)
                    print(f"[RETRY] Attempt {attempt} failed: '{err}'. Retrying in {sleep_time:.2f}s...")
                    time.sleep(sleep_time)
                    delay *= 2 # Double the delay for exponential backoff
        return wrapper
    return decorator

# Simulate an unstable API fetch
attempt_counter = 0

@retry_request(max_attempts=3, initial_delay=1.0)
def fetch_api_data():
    global attempt_counter
    attempt_counter += 1
    if attempt_counter < 3:
        raise ConnectionError("Server timed out")
    return {"status": "success", "data": [10, 20, 30]}

result = fetch_api_data()
print(f"API Result: {result}")
```

```text
# Output:
[RETRY] Attempt 1 failed: 'Server timed out'. Retrying in 1.25s...
[RETRY] Attempt 2 failed: 'Server timed out'. Retrying in 2.12s...
API Result: {'status': 'success', 'data': [10, 20, 30]}
```

---

### Example 3: Memory Caching Decorator
If you query a database or API for the same parameter repeatedly, you waste bandwidth and database resources. We can cache the results using `functools.lru_cache` (Least Recently Used cache).

```python
from functools import lru_cache
import time

@lru_cache(maxsize=4)
def query_db_customer_sales(customer_id):
    """Simulates a heavy SQL query checking customer sales totals."""
    print(f"[DB Query] Executing SELECT SUM(sales) FOR customer {customer_id}...")
    time.sleep(1.5) # Simulate database network latency
    
    # Mock data lookup
    sales_db = {101: 45000.00, 102: 12500.00, 103: 98000.00}
    return sales_db.get(customer_id, 0.0)

# First lookup - Slow (forces execution)
start = time.time()
print(f"Sales: ${query_db_customer_sales(101):,.2f} | Time: {time.time() - start:.4f}s")

# Second lookup (same ID) - Instant (reads from memory cache)
start = time.time()
print(f"Sales: ${query_db_customer_sales(101):,.2f} | Time: {time.time() - start:.4f}s")

# Third lookup (different ID) - Slow
start = time.time()
print(f"Sales: ${query_db_customer_sales(102):,.2f} | Time: {time.time() - start:.4f}s")

# Check cache diagnostics
print(query_db_customer_sales.cache_info())
```

```text
# Output:
[DB Query] Executing SELECT SUM(sales) FOR customer 101...
Sales: $45,000.00 | Time: 1.5020s
Sales: $45,000.00 | Time: 0.0001s
[DB Query] Executing SELECT SUM(sales) FOR customer 102...
Sales: $12,500.00 | Time: 1.5030s
CacheInfo(hits=1, misses=2, maxsize=4, currsize=2)
```

---

### Example 4: Processing Large Log Files with Generators
Suppose you have a production server log containing millions of lines. You want to extract lines that contain "ERROR". Instead of loading the whole file into memory, you stream it line-by-line.

```python
import io

# We will simulate a large log file using io.StringIO
mock_log_file = io.StringIO("""2026-07-08 10:00:00 INFO User login success
2026-07-08 10:01:05 WARNING CPU Usage exceeded 80%
2026-07-08 10:02:10 ERROR Database connection pool exhausted
2026-07-08 10:03:00 INFO Cron job started
2026-07-08 10:04:15 ERROR API Gateway timeout
""")

def stream_logs(file_obj):
    """Generator that yields lines from a log file object one at a time."""
    for line in file_obj:
        yield line.strip()

def filter_errors(log_lines):
    """Generator that filters out non-error lines."""
    for line in log_lines:
        if "ERROR" in line:
            yield line

# Set up the pipeline: Raw Stream -> Error Filter
raw_stream = stream_logs(mock_log_file)
error_stream = filter_errors(raw_stream)

# Consume the final generator
print("Streaming error logs:")
for error in error_stream:
    print(f"  Alert: {error}")
```

```text
# Output:
Streaming error logs:
  Alert: 2026-07-08 10:02:10 ERROR Database connection pool exhausted
  Alert: 2026-07-08 10:04:15 ERROR API Gateway timeout
```

---

### Example 5: Generator Pipelines (ETL Pipeline)
Generator functions can be chained together to form highly efficient ETL (Extract, Transform, Load) pipelines. The data flows through the pipeline element-by-element without creating intermediate lists.

```python
# Raw stream of dirty transaction strings
raw_transactions = [
    "tx_id:1001,amount:150.00,status:completed",
    "tx_id:1002,amount:abc,status:failed",
    "tx_id:1003,amount:320.50,status:completed",
    "tx_id:1004,amount:-50.00,status:completed",
    "tx_id:1005,amount:12.99,status:completed"
]

def extract(records):
    """Extract fields from raw transaction strings."""
    for record in records:
        parts = record.split(",")
        data = {}
        for part in parts:
            key, val = part.split(":")
            data[key] = val
        yield data

def transform(transactions):
    """Clean data types and filter anomalies."""
    for tx in transactions:
        try:
            amount = float(tx["amount"])
            # Remove negative amounts and failed transactions
            if amount > 0 and tx["status"] == "completed":
                tx["amount"] = amount
                yield tx
        except ValueError:
            continue # Skip records with bad numeric amounts

def load(transactions):
    """Yield a formatted report row."""
    for tx in transactions:
        yield f"TXN {tx['tx_id']} is VALID for ${tx['amount']:.2f}"

# Build the pipeline
extracted = extract(raw_transactions)
transformed = transform(extracted)
pipeline = load(transformed)

# Execute pipeline
for report_row in pipeline:
    print(report_row)
```

```text
# Output:
TXN 1001 is VALID for $150.00
TXN 1003 is VALID for $320.50
TXN 1005 is VALID for $12.99
```

---

## Edge Cases & Common Mistakes

### 1. Forgetting to Use `@wraps`
**The Mistake:** If you forget to add `@wraps(func)` to your decorator's wrapper function, the original function's name and documentation will be overwritten by the wrapper's details. This makes debugging difficult and breaks inspection libraries.
```python
def bad_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@bad_decorator
def calculate_average(nums):
    """Calculates mean value."""
    return sum(nums) / len(nums)

# The name is ruined!
print(calculate_average.__name__) # Prints: 'wrapper' instead of 'calculate_average'
print(calculate_average.__doc__)  # Prints: None
```

### 2. Generator Exhaustion
**The Mistake:** Trying to loop through a generator a second time. Once a generator has yielded all its values, it is **exhausted** (empty). Calling `next()` on it will only raise `StopIteration`.
```python
my_gen = (x for x in range(3))
list_a = list(my_gen) # list_a = [0, 1, 2]
list_b = list(my_gen) # list_b = [] (empty! The generator is spent)
```
**The Fix:** If you need to process the data multiple times, you must either:
*   Cast the generator to a list immediately (which loads it all into memory).
*   Create a fresh generator by calling the generator function again.

### 3. Generators Do Not Support Indexing or `len()`
**The Mistake:** Attempting to run `len(generator)` or access `generator[0]`. Because generators do not store their elements, Python has no way of knowing how many elements they contain, or what element is at an index, without running them to exhaustion.
**The Fix:** If you need indexing or sizing, convert the elements to a list: `list(generator)`. If you only need to look at the first item without exhausting the generator, use `next(generator)`.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Build a Type-Checking Decorator
**Objective:** Enforce type safety on functions.
Write a decorator named `@require_ints` that:
1.  Inspects all arguments passed to the decorated function.
2.  If any argument is not an instance of `int`, raises a `TypeError` with an informative message.
3.  If all arguments are integers, executes the function normally.

```python
# Expected Behavior:
@require_ints
def sum_two(a, b):
    return a + b

sum_two(5, 10)     # Returns 15
sum_two(5, "ten")  # Raises TypeError: 'All arguments must be integers.'
```

### Exercise 2: Build a Batch Streaming Generator
**Objective:** Group streamed data for bulk loading operations (e.g. database inserts).
In production data engineering, you do not write records to a database one-by-one (too slow), nor do you write millions at once (too much memory). Instead, you write in batches.
Write a generator function `batch_stream(iterable, batch_size)` that:
1.  Takes an input iterable (like a list or another generator) and a `batch_size`.
2.  Yields a list containing at most `batch_size` items.
3.  Ensures that the final batch is yielded, even if it contains fewer than `batch_size` items.

```python
# Expected Behavior:
data = range(1, 8)
for chunk in batch_stream(data, batch_size=3):
    print(chunk)

# Output:
# [1, 2, 3]
# [4, 5, 6]
# [7]
```

---

## Section Recaps

*   **Decorator Basics:** A decorator wraps a function to modify its behavior without altering its source code. Implement it using an inner function closure, and always use `@wraps` to preserve function metadata.
*   **Decorator Boilerplate:** Use `*args` and `**kwargs` in your wrappers to make them compatible with functions of any parameter signature.
*   **Generator Basics:** Generators use `yield` instead of `return`. They produce values lazily on-demand, which reduces memory consumption when handling large datasets.
*   **State Suspension:** A generator remembers its place in code between invocations, restoring local variables whenever `next()` is called.
*   **Generator Pipelines:** By passing one generator as input to another, you construct memory-safe data engineering pipelines that process large datasets element-by-element.

---

## Common Interview Questions

### Q1: What is a closure, and how does it relate to decorators?
**Answer:** A closure is an inner function that retains access to variables from its outer (enclosing) lexical scope, even after the outer function has finished executing. 

Decorators rely entirely on closures. The decorator function acts as the outer function, accepting the target function as a parameter. The nested `wrapper` function acts as the closure, retaining a reference to the target function and executing it when the wrapper itself is called.

### Q2: What's the difference between `yield` and `return`?
**Answer:** 
*   **`return`** terminates the function execution completely and returns a value to the caller. The function's stack frame and local variables are immediately destroyed.
*   **`yield`** pauses function execution and sends a value back to the caller. It keeps the function's stack frame in memory, saving the state of all local variables. The next time the generator is queried, it resumes execution immediately after the `yield` statement.

### Q3: When would you use a generator instead of a list comprehension in a data pipeline?
**Answer:** You should use a generator when:
1.  **Memory is limited:** The dataset is extremely large (e.g., millions of log rows, database records, or image files) and loading it into memory would cause a memory crash.
2.  **Infinite Streams:** You are processing data that has no defined end, like live social media feeds, sensor streams, or continuous transaction feeds.
3.  **Intermediate Processing:** You want to chain multiple processing steps (filtering, cleaning, parsing) without generating intermediate lists in memory.

You should prefer a list comprehension only when you need to index, slice, or access elements repeatedly, or if the dataset is small and you need to perform actions that require looking at all elements simultaneously (like sorting).

<div class="interview-tip">
<strong>Interview Tip:</strong> Emphasize that a generator is a <em>one-pass</em> data structure. If you need to loop through the data multiple times, a list is required (or you must recreate the generator).
</div>

### Q4: How do you write a decorator that accepts its own configuration arguments (e.g. `@retry(max_attempts=5)`)?
**Answer:** To make a decorator accept arguments, you must write a **Decorator Factory**. This is a three-level nested function:
1.  The outermost function accepts the configuration arguments (e.g., `max_attempts`) and returns the actual decorator.
2.  The middle function accepts the target function (`func`) and returns the wrapper.
3.  The innermost function (`wrapper`) handles the execution logic and arguments (`*args`, `**kwargs`).

```python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator
```

### Q5: What is generator delegation, and how do you implement it?
**Answer:** Generator delegation is the process of yielding values from another generator or iterable from inside a generator function. It is implemented using the **`yield from`** statement. 

Instead of writing a loop to yield items one-by-one, `yield from` handles it natively and more efficiently:

```python
# Instead of:
for item in sub_generator():
    yield item

# You write:
yield from sub_generator()
```
This is highly useful for nesting generators or clean-up patterns.
