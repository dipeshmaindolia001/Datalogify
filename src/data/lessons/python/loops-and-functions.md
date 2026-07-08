---
title: "Loops & Functions — Automate Repetitive Analysis"
description: "Write for loops, while loops, and reusable functions to automate your data analytics workflows."
category: "python"
order: 4
phase: 1
tags: ["python", "loops", "functions", "automation"]
publishedDate: 2025-01-17
prevSlug: "conditionals"
nextSlug: "lists-and-dicts"
seoTitle: "Python Loops & Functions for Data Analytics | Datalogify"
seoDescription: "Learn for loops, while loops, and Python functions with real data analytics automation examples."
---

## Why This Matters

Data analytics is fundamentally about repetition. Whether you are calculating the growth rate of 50 different countries, cleaning 10,000 messy customer emails, or retrying a connection to a database that keeps dropping, you are performing the same steps over and over again. 

If you had to write a separate line of code for every single row of data, you would never get any analysis done. **Loops** are the constructs that handle this repetition for you, instructing the computer to repeat a block of code across thousands of values in milliseconds. 

However, writing loops everywhere makes code messy and hard to maintain. That is where **functions** come in. Functions allow you to package a specific set of instructions, give it a name, and reuse it anywhere in your project. Together, loops and functions form the engine of data automation: loops drive the repetition, and functions handle the logic.

---

## Conceptual Analogies

To truly understand loops and functions, let's look at two physical analogies.

### The Loop Analogy: The Factory Assembly Line

Think of a `for` loop as a **factory assembly line**. 

```text
  [ Raw Material ] ──► [ Item 1 ] ──► [ Item 2 ] ──► [ Item 3 ] ──► ...
                            │              │              │
                            ▼              ▼              ▼
                     ┌─────────────┐┌─────────────┐┌─────────────┐
                     │ Assembly    ││ Assembly    ││ Assembly    │
                     │ Worker      ││ Worker      ││ Worker      │
                     │ (Loop Body) ││ (Loop Body) ││ (Loop Body) │
                     └─────────────┘└─────────────┘└─────────────┘
                            │              │              │
                            ▼              ▼              ▼
  [ Finished Goods] ──► [ Prod 1 ] ──► [ Prod 2 ] ──► [ Prod 3 ] ──► ...
```

* **The Iterable (The Conveyor Belt):** A list of items (like transactions or customer names) sits on the conveyor belt, waiting to be processed.
* **The Loop Variable (The Current Item):** The conveyor belt moves one item at a time to the workstation. The variable represents whichever item is currently in front of the worker.
* **The Loop Body (The Assembly Worker):** The worker performs the exact same operation on every item that arrives (e.g., checks if a transaction is over $10,000, formats a phone number, or adds tax).
* **The Termination (End of the Belt):** Once the conveyor belt runs out of items, the assembly line stops automatically.

### The Function Analogy: The Juice Blender

Think of a function as a **juice blender**.

```text
       Input (Arguments)
     [ Apples & Bananas ]
              │
              ▼
    ┌──────────────────┐
    │     Blender      │
    │ (Function Logic) │
    └──────────────────┘
              │
              ▼
       Output (Return)
        [ Fruit Smoothie ]
```

* **Defining the Function (The Blender Manual):** When you buy a blender, its capabilities are pre-defined. You don't have to rebuild the motor every time you want juice; you just push the button. Similarly, you write function logic once, and it is ready to run whenever you call its name.
* **Arguments (The Raw Fruit):** You feed ingredients into the blender. The blender doesn't care if you feed it apples, berries, or kale; it applies its blending process to whatever inputs you provide.
* **Return Value (The Smoothie):** The blender grinds the ingredients and outputs a fresh beverage. If you blend fruit but keep the lid sealed and never pour the juice out, it is useless to the rest of your kitchen. In coding, returning a value is the act of pouring the finished product out so other parts of your program can use it. If you only `print()` inside a function, it is like looking at the juice through the glass pitcher but never pouring it into a cup to drink.

---

## Step-by-Step Concept Breakdown

---

### 1. for Loops and the `range()` Function

A `for` loop is used when you want to iterate over a pre-determined sequence. In data analytics, you will use it to iterate over lists of numbers, filenames in a directory, keys in a dictionary, or database columns.

The `range()` function is Python's built-in sequence generator. It creates sequences of integers on the fly without consuming massive memory. It is "lazy"—it doesn't actually create a massive list in memory; it generates the next number only when the loop requests it.

There are three ways to invoke `range()`:
* `range(stop)`: Generates numbers starting at `0` up to, but not including, `stop`.
* `range(start, stop)`: Generates numbers starting at `start` up to, but not including, `stop`.
* `range(start, stop, step)`: Generates numbers starting at `start`, incrementing by `step`, up to but not including `stop`.

Let's look at how these three variants execute:

```python
# 1. Single argument: stop (0 to 4)
for i in range(5):
    print(f"Step {i}")
```
```text
# Output:
Step 0
Step 1
Step 2
Step 3
Step 4
```

```python
# 2. Two arguments: start and stop (5 to 9)
for i in range(5, 10):
    print(f"Index: {i}")
```
```text
# Output:
Index: 5
Index: 6
Index: 7
Index: 8
Index: 9
```

```python
# 3. Three arguments: start, stop, and step (0, 2, 4, 6, 8)
for i in range(0, 10, 2):
    print(f"Even number: {i}")
```
```text
# Output:
Even number: 0
Even number: 2
Even number: 4
Even number: 6
Even number: 8
```

---

### 2. Element-Based vs Index-Based Iteration

When iterating over an collection (like a list), you can loop in two primary ways:

#### A. Iterating directly over elements (Element-Based)
This is the most Pythonic and readable way. Use this when you only need the data values and do not care about their positions.

```python
temperatures = [72, 75, 78, 68, 71]
for temp in temperatures:
    print(f"Recorded temperature: {temp}°F")
```
```text
# Output:
Recorded temperature: 72°F
Recorded temperature: 75°F
Recorded temperature: 78°F
Recorded temperature: 68°F
Recorded temperature: 71°F
```

#### B. Iterating using indices (Index-Based)
Use this when you need to know the index position of each item, when you need to modify the list in place, or when you are accessing parallel lists of the same length.

```python
temperatures = [72, 75, 78, 68, 71]
# We use len() to get the size of the list, and range() to generate indices
for i in range(len(temperatures)):
    print(f"Day {i+1} Temperature: {temperatures[i]}°F")
```
```text
# Output:
Day 1 Temperature: 72°F
Day 2 Temperature: 75°F
Day 3 Temperature: 78°F
Day 4 Temperature: 68°F
Day 5 Temperature: 71°F
```

#### C. The Best of Both Worlds: `enumerate()`
Instead of writing `range(len(...))`, Python provides a built-in function called `enumerate()` that returns both the index and the element at the same time. This is the industry standard for index-aware loops.

```python
cities = ["New York", "London", "Tokyo", "Paris"]
for index, city in enumerate(cities):
    print(f"Rank {index + 1}: {city}")
```
```text
# Output:
Rank 1: New York
Rank 2: London
Rank 3: Tokyo
Rank 4: Paris
```

#### D. Iterating Parallel Lists: `zip()`
If you have two or more related lists of data, you can use `zip()` to stitch them together and loop through them simultaneously.

```python
products = ["Monitor", "Mouse", "Keyboard"]
prices = [320.00, 25.50, 75.00]
quantities = [5, 20, 12]

for product, price, qty in zip(products, prices, quantities):
    inventory_val = price * qty
    print(f"Product: {product:<10} | Value in Stock: ${inventory_val:,.2f}")
```
```text
# Output:
Product: Monitor    | Value in Stock: $1,600.00
Product: Mouse      | Value in Stock: $510.00
Product: Keyboard   | Value in Stock: $900.00
```

---

### 3. while Loops and Infinite Loop Risks

A `while` loop runs as long as a specified condition remains `True`. Unlike `for` loops, which run a fixed number of times, `while` loops are used when you don't know ahead of time how many iterations will be required.

```python
# Basic while loop
counter = 5
while counter > 0:
    print(f"Countdown: {counter}")
    counter -= 1  # Crucial: modifying the control variable
print("Blast off!")
```
```text
# Output:
Countdown: 5
Countdown: 4
Countdown: 3
Countdown: 2
Countdown: 1
Blast off!
```

#### The Danger: Infinite Loops
An infinite loop occurs when the loop condition never evaluates to `False`. This will freeze your script, consume 100% of your CPU core, and potentially crash your system.

```python
# DANGEROUS CODE - DO NOT RUN
# counter = 5
# while counter > 0:
#     print(counter)
#     # Missing: counter -= 1. The condition (5 > 0) is always True!
```

#### Safe Loop Management: break and continue
* `break`: Immediately exits the loop, ignoring the condition.
* `continue`: Skips the rest of the current loop body and jumps directly to the next iteration (re-evaluating the condition).

```python
# Using break and continue to clean data
raw_scores = [85, 92, -1, 78, 999, 88] # -1 is a placeholder, 999 is corrupt

for score in raw_scores:
    if score == -1:
        print("Missing value detected. Skipping...")
        continue  # Skip to next iteration
    
    if score > 100:
        print(f"Fatal error: Invalid score '{score}' found. Halting calculation.")
        break  # Terminate loop completely
        
    print(f"Processing score: {score}")
```
```text
# Output:
Processing score: 85
Processing score: 92
Missing value detected. Skipping...
Processing score: 78
Fatal error: Invalid score '999' found. Halting calculation.
```

---

### 4. Anatomy of a Function

A function is defined using the `def` keyword, followed by the function name, parentheses containing parameters, a colon, and an indented block of code.

```python
def calculate_net_revenue(gross_revenue, tax_rate):
    """
    Calculate the net revenue after applying taxes.
    This docstring explains what the function does.
    """
    tax_amount = gross_revenue * tax_rate
    net_revenue = gross_revenue - tax_amount
    return net_revenue
```

* **Parameters vs. Arguments:** Parameters are the placeholders listed in the function definition (e.g., `gross_revenue`, `tax_rate`). Arguments are the actual values passed to the function when calling it (e.g., `calculate_net_revenue(10000, 0.08)`).
* **Return vs. Print:** 
  * `print()` displays text on the screen for human viewing. It does not save the value or return it. A function that only prints returns `None` by default.
  * `return` halts execution of the function and hands the output value back to the caller. This allows the output to be stored in variables or passed to other calculations.

Let's illustrate the difference:

```python
def print_sum(a, b):
    print(a + b)  # Only outputs to screen

def return_sum(a, b):
    return a + b  # Returns value to program

# Testing print_sum
result_print = print_sum(10, 5)
# Testing return_sum
result_return = return_sum(10, 5)

print(f"Result from print_sum: {result_print}")  # None, because nothing was returned
print(f"Result from return_sum: {result_return}") # 15, which can be reused
```
```text
# Output:
15
Result from print_sum: None
Result from return_sum: 15
```

---

### 5. Scope: Local vs. Global

In Python, variables are restricted to specific regions of code. This is called **scope**. 

* **Global Scope:** Variables defined outside of any function are global. They are accessible anywhere in the script.
* **Local Scope:** Variables created inside a function are local to that function. They are born when the function starts and are destroyed when the function returns. You cannot access local variables from outside the function.

Python uses the **LEGB rule** to look up variables in order:
1. **L**ocal: Variables defined inside the current function.
2. **E**nclosing: Variables inside a parent (outer) function if functions are nested.
3. **G**lobal: Variables defined at the top level of the script.
4. **B**uilt-in: Python's reserved functions (like `len`, `sum`, `range`).

```text
    ┌───────────────────────────────────────────────┐
    │ Global Scope                                  │
    │   x = "Global Value"                          │
    │                                               │
    │   ┌─────────────────────────────────────┐     │
    │   │ Local Scope (inside function)       │     │
    │   │   y = "Local Value"                 │     │
    │   │                                     │     │
    │   │   Can see: y, x (Global)            │     │
    │   └─────────────────────────────────────┘     │
    │                                               │
    │   Can see: x                                  │
    │   Cannot see: y (raises NameError)            │
    └───────────────────────────────────────────────┘
```

Let's test this in code:

```python
global_revenue = 500000  # Global variable

def calculate_local_revenue():
    local_revenue = 15000  # Local variable
    print(f"Inside function: Can read global: {global_revenue}")
    print(f"Inside function: Can read local: {local_revenue}")

calculate_local_revenue()

print(f"Outside function: Can read global: {global_revenue}")

try:
    print(local_revenue)
except NameError as e:
    print(f"Outside function Error: {e}")
```
```text
# Output:
Inside function: Can read global: 500000
Inside function: Can read local: 15000
Outside function: Can read global: 500000
Outside function Error: name 'local_revenue' is not defined
```

---

## Code Walkthroughs

---

### Walkthrough 1: Element-Based vs Index-Based loops for Data Auditing
Let's see how an auditor would process transactions, flags anomalies, and record the index positions where errors occur.

```python
# Raw list of transaction amounts
transactions = [120.50, 450.00, -99.00, 15000.00, 300.25, -5.00, 20000.00]

print("--- Approach A: Simple Element-Based Loop ---")
# Good for quick summaries
total_revenue = 0
for amount in transactions:
    if amount > 0:
        total_revenue += amount
print(f"Total Valid Revenue: ${total_revenue:,.2f}\n")

print("--- Approach B: Index-Based Auditing Loop ---")
# Essential when you need to know WHERE the errors are located
error_indices = []
for index in range(len(transactions)):
    amount = transactions[index]
    if amount < 0:
        print(f"Flagged negative amount: ${amount} at index {index}")
        error_indices.append(index)
        
print(f"Auditing complete. Flagged indices: {error_indices}")
```
```text
# Output:
--- Approach A: Simple Element-Based Loop ---
Total Valid Revenue: $35,870.75

--- Approach B: Index-Based Auditing Loop ---
Flagged negative amount: $-99.0 at index 2
Flagged negative amount: $-5.0 at index 5
Auditing complete. Flagged indices: [2, 5]
```

---

### Walkthrough 2: Safe API Polling with Exponential Backoff
When querying databases or APIs, connections fail. Using a `while` loop is perfect here because we keep retrying until a connection succeeds or we hit a max limit. We use `break` to exit early upon success.

```python
import time
import random

def mock_api_call():
    """Simulates an API call. Returns True if success, False if failure."""
    # Simulating 80% failure rate for demonstration
    return random.random() > 0.8

def poll_database_api(max_retries=5):
    retries = 0
    wait_time = 1  # Start with a 1-second delay
    
    print("Initiating API data sync...")
    
    while retries < max_retries:
        retries += 1
        print(f"Attempt {retries} of {max_retries}...")
        
        success = mock_api_call()
        if success:
            print("  Connection successful! Downloading dataset...")
            break  # Break out of the while loop immediately
        else:
            print(f"  Connection failed. Retrying in {wait_time}s...")
            time.sleep(wait_time)
            wait_time *= 2  # Exponential backoff: 1s, 2s, 4s, 8s...
    else:
        # The 'else' block of a while loop runs ONLY if the loop finishes
        # without encountering a 'break' statement.
        print("\nFatal Error: Maximum API retries exhausted. Pipeline aborted.")
        return None
        
    return {"status": "SUCCESS", "records_pulled": 1250}

# Run the polling pipeline
pipeline_result = poll_database_api()
print(f"Pipeline Result: {pipeline_result}")
```
```text
# Output:
Initiating API data sync...
Attempt 1 of 5...
  Connection failed. Retrying in 1s...
Attempt 2 of 5...
  Connection failed. Retrying in 2s...
Attempt 3 of 5...
  Connection successful! Downloading dataset...
Pipeline Result: {'status': 'SUCCESS', 'records_pulled': 1250}
```

---

### Walkthrough 3: Reusable Data Pipeline and Cleaning Functions
Let's build a mini data-cleaning pipeline that parses raw user inputs, sanitizes strings, checks for errors, and categorizes users by revenue.

```python
def sanitize_string(text):
    """Strip whitespace and convert to title case."""
    if not isinstance(text, str):
        return ""
    return text.strip().title()

def parse_currency(value):
    """Extract float from dirty currency strings (e.g. '$1,200.50')."""
    if isinstance(value, (int, float)):
        return float(value)
    
    # Strip symbols
    clean_val = value.replace("$", "").replace(",", "").strip()
    try:
        return float(clean_val)
    except ValueError:
        return 0.0

def calculate_tier(revenue, tier_limits=None):
    """
    Categorize clients by revenue tier.
    Uses default arguments for tier boundaries.
    """
    if tier_limits is None:
        tier_limits = {"Enterprise": 100000, "Mid-Market": 25000}
        
    if revenue >= tier_limits["Enterprise"]:
        return "Enterprise"
    elif revenue >= tier_limits["Mid-Market"]:
        return "Mid-Market"
    else:
        return "SMB"

# Dirty input data
raw_leads = [
    {"name": "   alpha corp   ", "revenue": "$125,000.00"},
    {"name": "beta inc.  ", "revenue": "45,000"},
    {"name": "gamma ltd", "revenue": "invalid_data"},
    {"name": "  delta tech", "revenue": "$8,500.50"}
]

# Run pipeline
cleaned_leads = []
for lead in raw_leads:
    clean_name = sanitize_string(lead["name"])
    clean_revenue = parse_currency(lead["revenue"])
    client_tier = calculate_tier(clean_revenue)
    
    cleaned_leads.append({
        "client": clean_name,
        "revenue": clean_revenue,
        "tier": client_tier
    })

print(f"{'Client':<15} | {'Revenue':>12} | {'Tier':<12}")
print("-" * 46)
for lead in cleaned_leads:
    print(f"{lead['client']:<15} | ${lead['revenue']:>11,.2f} | {lead['tier']:<12}")
```
```text
# Output:
Client          |      Revenue | Tier        
----------------------------------------------
Alpha Corp      |  $125,000.00 | Enterprise  
Beta Inc.       |   $45,000.00 | Mid-Market  
Gamma Ltd       |        $0.00 | SMB         
Delta Tech      |    $8,500.50 | SMB         
```

---

## Edge Cases, Gotchas, and Common Mistakes

### Gotcha 1: Modifying an Iterable While Iterating Over It
This is a classic trap. When you delete elements from a list while looping over it, Python shifts the remaining elements left. This changes the indexing on the fly, causing the loop to skip the next item or crash.

```python
# BAD CODE: Deleting items while looping
numbers = [10, 15, 20, 25, 30]
for num in numbers:
    if num % 10 == 0:
        numbers.remove(num)  # Modifying list in-place
print(f"Erroneous result: {numbers}") 
# Note that 20 was skipped!
```
```text
# Output:
Erroneous result: [15, 25, 30]
```

**Why it happened:** 
1. The loop starts at index `0` (`10`). `10` is divisible by 10, so it is removed.
2. The list is now `[15, 20, 25, 30]`. 
3. The loop moves to index `1`. In the new list, the item at index `1` is `20` (since `15` shifted to index `0`). The value `15` is skipped entirely!

**The Clean Fix:** Loop over a copy of the list, or use a list comprehension to build a new list instead.

```python
# Clean solution A: Loop over a slice copy [:]
numbers = [10, 15, 20, 25, 30]
for num in numbers[:]:  # [:] creates a shallow copy
    if num % 10 == 0:
        numbers.remove(num)
print(f"Correct result (copy): {numbers}")

# Clean solution B: List Comprehension (Preferred Pythonic Way)
numbers = [10, 15, 20, 25, 30]
filtered_numbers = [num for num in numbers if num % 10 != 0]
print(f"Correct result (comprehension): {filtered_numbers}")
```
```text
# Output:
Correct result (copy): [15, 25]
Correct result (comprehension): [15, 25]
```

---

### Gotcha 2: Mutable Default Arguments (The Classic `target=[]` Bug)
In Python, default function arguments are evaluated **once**, when the function is first defined, not every time the function is called. If you use a mutable object (like a list or dictionary) as a default parameter, that single object will be shared across every function call!

```python
# BUGGY CODE
def append_transaction(amount, ledger=[]):
    ledger.append(amount)
    return ledger

# Let's call the function
weekly_ledger = append_transaction(250)
print(f"Week 1 Ledger: {weekly_ledger}")

monthly_ledger = append_transaction(500)
# Expectation: [500]
# Reality: [250, 500]
print(f"Week 2 Ledger: {monthly_ledger}")
```
```text
# Output:
Week 1 Ledger: [250]
Week 2 Ledger: [250, 500]
```

**The Clean Fix:** Always use `None` as the default value for mutable parameters, and instantiate a new list/dictionary inside the function scope.

```python
# CORRECT CODE
def append_transaction_safe(amount, ledger=None):
    if ledger is None:
        ledger = []  # A brand new list is created here at runtime
    ledger.append(amount)
    return ledger

week1 = append_transaction_safe(250)
print(f"Safe Week 1: {week1}")

week2 = append_transaction_safe(500)
print(f"Safe Week 2: {week2}")
```
```text
# Output:
Safe Week 1: [250]
Safe Week 2: [500]
```

---

## Practice Exercises & Mini-Projects

### Exercise 1: Transaction Audit & Anomaly Reporter
**Problem Statement:**
You are analyzing a log of daily merchant transactions. Write a script that checks each transaction:
1. Ignore any transactions that are exactly `$0` (skip using `continue`).
2. Halt the entire loop if you encounter a transaction higher than `$100,000` (terminate using `break` because it suggests fraud or system malfunction).
3. If the transaction is negative, flag it with its index position and add its absolute value to a list of refunds.
4. Otherwise, add the amount to a running total of gross sales.

Use the following transaction list:
```python
merchant_txs = [120.00, 0.00, 450.50, -30.00, 1050.00, 150000.00, -15.00, 850.00]
```

---

### Exercise 2: Reusable E-commerce Shipping Fees Calculator
**Problem Statement:**
Create a reusable function `calculate_shipping(order_value, destination="US", express=False)`:
1. If the destination is "US":
   * Default shipping is $5.99.
   * Free shipping if `order_value` is $50.00 or higher.
   * If `express=True`, add $10.00 to the shipping cost.
2. If the destination is "INTL" (International):
   * Default shipping is $24.99.
   * If `order_value` is $150.00 or higher, international shipping drops to $9.99.
   * If `express=True`, add $25.00 to the shipping cost.
3. Test your function with:
   * Order value: $35.00, US, standard (express=False)
   * Order value: $65.00, US, express (express=True)
   * Order value: $160.00, INTL, standard (express=False)

---

## Section Recaps

* **for Loops** are best when looping over collections with a known size. Use `range()` to loop a specific number of times.
* **enumerate()** should always be preferred over `range(len())` when you need both list values and their respective index coordinates.
* **while Loops** execute dynamically based on a condition. Always make sure the condition has a guaranteed path to becoming `False` to prevent infinite loops.
* **break** exits loops instantly, while **continue** skips the remaining statements in the current iteration and starts the next loop cycle.
* **Functions** encapsulate code blocks. Use `return` to feed calculations back into the main program flow, and avoid confusing it with `print()`.
* **Variables Scope** is governed by the LEGB rule. Variables defined inside a function are local to that function and cannot be read from the outside.
* **Gotcha Warning:** Never edit a list's items (append or remove) while directly looping over it.
* **Gotcha Warning:** Never use mutable defaults (`list=[]` or `dict={}`) inside function signatures. Use `=None` instead.

---

## Common Interview Questions

### Q1: What is the difference between a for loop and a while loop, and when should you use each?

**Answer:**
A `for` loop is designed for iterating over an iterable collection (like a list, tuple, or string) or a known sequence generator like `range()`. You know the boundary conditions and the maximum number of iterations at the beginning of the loop. 

A `while` loop runs indefinitely until a condition evaluates to `False`. It is used when the number of cycles depends on runtime events (like waiting for user input, polling an API endpoint, or iterating until a mathematical calculation converges). 

In data analytics, `for` loops are much more common because we usually iterate over columns, arrays, or data chunks of pre-defined sizes.

---

### Q2: What is the difference between return and print in a function, and why is writing a function that only prints bad practice?

**Answer:**
`print()` is an I/O operation that outputs characters to the system console for human inspection. It does not return data. Once printed, the value is gone from the code execution stream; you cannot save it to a database, filter it, or feed it into another calculation. A function that does not contain a `return` statement returns `None` implicitly.

`return` is how a function hands a value back to the caller. It immediately terminates the function execution and passes the computed object back, allowing the result to be captured in a variable and used further down a pipeline. 

Writing functions that only print makes them non-reusable and impossible to unit-test, breaking basic data-engineering pipeline design.

---

### Q3: Explain why mutable default arguments (like `def add_item(item, list_=[])`) behave unexpectedly in Python and how to fix them.

**Answer:**
In Python, default arguments are evaluated only once at definition time (when the module is loaded), not at call time. If you use a mutable object like a list (`[]`) or a dictionary (`{}`) as a default argument, Python creates a single instance of that object and associates it with the function. 

Every subsequent call to that function that uses the default argument will modify that same shared object. This leads to cumulative data bugs where arguments from previous function calls carry over to later calls.

The correct pattern is to set the default argument to `None` and instantiate the mutable object inside the function body:
```python
def add_item(item, list_=None):
    if list_ is None:
        list_ = []
    list_.append(item)
    return list_
```

---

### Q4: What is variable scope, and how does the LEGB rule determine which variable is accessed?

**Answer:**
Variable scope defines the region of a program where a variable name is recognized and accessible. Python determines variable visibility using the **LEGB** rule, checking namespaces in the following order:
1. **Local (L):** Inside the currently executing function (defined via `def` or `lambda`).
2. **Enclosing (E):** Inside any enclosing (outer) functions if the current function is nested.
3. **Global (G):** At the top level of the module/script.
4. **Built-in (B):** Reserved names built into Python (e.g., `sum`, `max`, `ValueError`).

If Python searches all four namespaces and cannot find the variable name, it raises a `NameError`.

---

### Q5: Why is modifying a list while iterating over it dangerous, and what is the Pythonic way to filter a list?

**Answer:**
Modifying a list (adding or removing elements) while iterating over it shifts the internal index positions of the remaining elements. Because Python keeps track of the iteration by incrementing an internal counter index, any deletion shifts the elements left, causing the next item to skip the loop entirely. This results in skipped elements and silent data corruption.

The Pythonic way to filter a list is to use a **list comprehension** to generate a new, filtered list, leaving the original list unmodified:
```python
# The Pythonic way to filter out negative numbers
cleaned_data = [x for x in original_data if x >= 0]
```
Alternatively, you can iterate over a copy of the list (e.g., `for item in original_list[:]`), but list comprehensions are cleaner, faster, and more readable.
