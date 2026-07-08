---
title: "Lists & Dictionaries — Store and Organize Data"
description: "Master Python lists and dictionaries — the data structures you'll use every day as a data analyst."
category: "python"
order: 5
phase: 1
tags: ["python", "lists", "dictionaries", "data-structures"]
publishedDate: 2025-01-18
prevSlug: "loops-and-functions"
nextSlug: "tuples-and-sets"
seoTitle: "Python Lists & Dictionaries for Data Analytics | Datalogify"
seoDescription: "Learn Python lists, dictionaries, slicing, and comprehensions with real data analytics examples."
---

## Why This Matters

Before data is loaded into a Pandas DataFrame, it exists in raw formats. APIs return nested JSON, database drivers return arrays of rows, and CSV readers extract text as tables of values. In Python, these raw data feeds are managed using **lists** and **dictionaries**. 

As a data analyst, you will work with these two data structures constantly. If you don't master how to index, slice, merge, and search them, you will struggle to clean and reshape raw data. Understanding lists and dictionaries is the foundation of data preparation.

---

## Conceptual Analogies

To understand lists and dictionaries, let's explore two physical analogies.

### The List Analogy: The Passenger Train

A **list** is like a **passenger train** with numbered cars.

```text
       Index 0      Index 1      Index 2      Index 3      Index 4
     ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
     │  Car 0  │  │  Car 1  │  │  Car 2  │  │  Car 3  │  │  Car 4  │
     │ [Alice] │──│  [Bob]  │──│ [Charlie]│──│  [Dave] │──│  [Eve]  │
     └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

* **Ordered sequence:** The train cars are linked in a specific, fixed order. `Car 0` is always at the front, followed by `Car 1`, then `Car 2`.
* **Zero-Indexed Positions:** To find passenger Charlie, you go to index `2`. You can access any car immediately if you know its position.
* **Duplicates Allowed:** You can have two passengers named "Alice" sitting in different cars. The train keeps track of them by their car number.
* **Mutable Structure:** You can detach cars from the middle, add cars to the end, or swap passengers out.

### The Dictionary Analogy: The Phone Book

A **dictionary** is like a **digital contacts app**.

```text
            Key                      Value
     ┌──────────────┐          ┌──────────────┐
     │   "Alice"    │─────────►│ "555-010-234"│
     ├──────────────┤          ├──────────────┤
     │    "Bob"     │─────────►│ "555-019-876"│
     ├──────────────┤          ├──────────────┤
     │  "Charlie"   │─────────►│ "555-022-111"│
     └──────────────┘          └──────────────┘
```

* **Key-Value Mapping:** You don't find a phone number by scrolling through positions 0, 1, or 2. Instead, you search for a unique name (the **Key**), which maps directly to a phone number (the **Value**).
* **Key Uniqueness:** You cannot have two identical keys ("Alice"). If you try to add another "Alice", the old contact's number will be overwritten.
* **Unordered Nature:** In a phone book, you do not care where the record is physically located on the hard drive; you only care that searching for the key instantly retrieves the value.

---

## Step-by-Step Concept Breakdown

---

### 1. In-Depth Indexing and Slicing Guide

Lists in Python are ordered and zero-indexed. This means the first element is at index `0`. Python also supports **negative indexing**, which counts backward from the end of the list (`-1` represents the last element).

```text
  List Elements:   ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  Positive Index:     0      1      2      3      4      5
  Negative Index:    -6     -5     -4     -3     -2     -1
```

#### Slicing Syntax
To extract a subset of a list, use the slicing syntax:
```python
sub_list = original_list[start:stop:step]
```
* `start`: The index where the slice begins (inclusive). Defaults to `0`.
* `stop`: The index where the slice ends (**exclusive**—does not include the element at this index). Defaults to the end of the list.
* `step`: The increment value between elements. Defaults to `1`.

Let's look at how slicing works in practice:

```python
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

# 1. Extract Q1 (Index 0, 1, 2)
print(f"Q1 (0:3): {months[0:3]}")

# 2. Extract H2 (Index 6 to the end)
print(f"H2 (6:):  {months[6:]}")

# 3. Last 3 months (using negative indexing)
print(f"Q4 (-3:): {months[-3:]}")

# 4. Every second month (Step of 2)
print(f"Alternating (::2): {months[::2]}")

# 5. Reverse the list (Negative step of 1)
print(f"Reversed (::-1):   {months[::-1]}")
```
```text
# Output:
Q1 (0:3): ['Jan', 'Feb', 'Mar']
H2 (6:):  ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
Q4 (-3:): ['Oct', 'Nov', 'Dec']
Alternating (::2): ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov']
Reversed (::-1):   ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan']
```

---

### 2. Common List Methods

Lists are mutable, meaning you can change them in place without creating a new list. Here are the core methods you will use to modify lists:

* `.append(item)`: Adds a single item to the end of the list.
* `.extend(iterable)`: Appends elements from another sequence to the end of the list.
* `.insert(index, item)`: Inserts an item at a specific index, shifting subsequent elements right.
* `.remove(value)`: Removes the first occurrence of a specific value. Raises `ValueError` if the value is missing.
* `.pop(index)`: Removes and returns the item at a specific index. If no index is provided, it removes the last item.
* `.sort(reverse=False)`: Sorts the list in-place. Use the built-in function `sorted(list)` if you want to keep the original list unchanged.

Let's compare how these methods work:

```python
# Start with a list of regions
regions = ["North", "South"]

# Append vs Extend
regions.append("East")
print(f"After Append: {regions}")

# Extend adds multiple elements individually
regions.extend(["West", "Midwest"])
print(f"After Extend: {regions}")

# Insert at index 1
regions.insert(1, "Northeast")
print(f"After Insert: {regions}")

# Pop the element at index 2
popped_region = regions.pop(2)
print(f"Popped: {popped_region} | List: {regions}")

# Remove by value
regions.remove("South")
print(f"After Remove: {regions}")
```
```text
# Output:
After Append: ['North', 'South', 'East']
After Extend: ['North', 'South', 'East', 'West', 'Midwest']
After Insert: ['North', 'Northeast', 'South', 'East', 'West', 'Midwest']
Popped: Northeast | List: ['North', 'South', 'East', 'West', 'Midwest']
After Remove: ['North', 'East', 'West', 'Midwest']
```

---

### 3. Time Complexity: List Lookup vs. Dict Lookup

One of the most important concepts in programming is time complexity, which measures how the execution time of an algorithm scales with the amount of input data. We express this using **Big O notation**.

| Operation | List | Dictionary | Explanation |
| :--- | :--- | :--- | :--- |
| **Search by index/key** | **O(1)** | **O(1)** | Accessing a list by index or a dict by key is instant, regardless of size. |
| **Search by value** | **O(n)** | **O(n)** | Finding a value requires scanning elements one by one (linearly). |
| **Check Membership** | **O(n)** | **O(1)** | `x in list` scans the list. `x in dict` uses hashing and is instant. |
| **Insert at end** | **O(1)** | **O(1)** | Appending to a list or adding a new key-value pair is instant. |
| **Insert at start** | **O(n)** | **N/A** | Inserting at index 0 of a list requires shifting every element. |

#### Why Dictionaries are O(1) for Lookups: Hash Tables
If a list has 1 million customer IDs and you want to check if a specific ID is present using `if customer_id in customer_list`, Python has to scan the list from the beginning. In the worst case, it will make 1 million checks. This is **$O(n)$** (Linear Time).

A dictionary uses a concept called a **Hash Table**. Under the hood:
1. When you define a key like `"customer_105"`, Python passes this key to a **hash function**.
2. The hash function converts the text key into an integer index.
3. This integer points directly to a specific memory slot (bucket) where the value is stored.
4. When you request `my_dict["customer_105"]`, Python hashes the key again, calculates the memory address, and jumps straight to that location.

It doesn't matter if the dictionary has 10 entries or 10 million; lookup is **$O(1)$** (Constant Time).

```text
   Key: "customer_105" ──► [ Hash Function ] ──► Address: 0x7ffd ──► Value: {"name": "Sarah"}
```

---

### 4. Dictionaries: Core Methods and Safe Access

To manage key-value pairs, Python dictionaries provide several built-in methods:

* `.keys()`: Returns a list-like view of all keys in the dictionary.
* `.values()`: Returns a list-like view of all values.
* `.items()`: Returns a list-like view of key-value tuples, perfect for looping.
* `.get(key, default=None)`: Accesses a key safely. If the key is missing, it returns the default value instead of raising a `KeyError`.
* `.update(other_dict)`: Merges another dictionary into the current one, overwriting matching keys.

#### Safe Access with `.get()`
Using bracket notation `dict[key]` on a missing key raises a `KeyError` and crashes your code. Using `.get()` prevents this.

```python
campaign = {"id": "CMP-90", "budget": 12000, "channel": "Paid Search"}

# Safe retrieval of existing key
print(f"Channel: {campaign.get('channel')}")

# Safe retrieval of missing key (returns None by default)
print(f"End Date: {campaign.get('end_date')}")

# Custom default value if key is missing
print(f"Status:   {campaign.get('status', 'Draft')}")

# Direct lookup of missing key would crash:
try:
    print(campaign["end_date"])
except KeyError as e:
    print(f"Caught expected crash! Key missing: {e}")
```
```text
# Output:
Channel: Paid Search
End Date: None
Status:   Draft
Caught expected crash! Key missing: 'end_date'
```

---

### 5. Nested Structures: List of Dicts (Vanilla Tabular Data)

Before loading data into Pandas, tabular datasets are represented as a **list of dictionaries**. Each dictionary in the list represents a row of data, and the dictionary keys represent the column headers.

```text
  [
    {"id": 1, "name": "Laptop",   "price": 999.00},  <── Row 0
    {"id": 2, "name": "Mouse",    "price": 25.00},   <── Row 1
    {"id": 3, "name": "Keyboard", "price": 75.00}    <── Row 2
  ]
```

Let's look at how to navigate, filter, and extract values from this representation:

```python
# A tabular dataset represented as a list of dicts
sales_data = [
    {"date": "2025-01-01", "store": "North", "revenue": 1500.00},
    {"date": "2025-01-01", "store": "South", "revenue": 2100.00},
    {"date": "2025-01-02", "store": "North", "revenue": 1800.00},
    {"date": "2025-01-02", "store": "South", "revenue": 950.00}
]

# 1. Access the store value of the second row
print(f"Row index 1, Store: {sales_data[1]['store']}")

# 2. Calculate the total revenue
total_revenue = sum(row["revenue"] for row in sales_data)
print(f"Total Revenue: ${total_revenue:,.2f}")

# 3. Filter rows where store is "North"
north_sales = [row for row in sales_data if row["store"] == "North"]
print(f"North sales reports: {north_sales}")
```
```text
# Output:
Row index 1, Store: South
Total Revenue: $6,350.00
North sales reports: [{'date': '2025-01-01', 'store': 'North', 'revenue': 1500.0}, {'date': '2025-01-02', 'store': 'North', 'revenue': 1800.0}]
```

---

### 6. List and Dict Comprehensions

Comprehensions provide a clean syntax for transforming or filtering collections in a single line of code.

#### List Comprehension
Syntax: `[expression for item in iterable if condition]`

```python
# Convert Fahrenheit temperatures to Celsius
temps_f = [32, 50, 68, 86, 104]
temps_c = [round((temp - 32) * 5/9, 1) for temp in temps_f]
print(f"Celsius temps: {temps_c}")
```
```text
# Output:
Celsius temps: [0.0, 10.0, 20.0, 30.0, 40.0]
```

#### Dict Comprehension
Syntax: `{key_expression: value_expression for item in iterable if condition}`

```python
# Convert a list of key-value tuples into a dictionary price index
raw_items = [("Laptop", 1200), ("Mouse", 30), ("Keyboard", 80), ("Monitor", 350)]

# Filter out items under $100 and build lookup dictionary
premium_products = {name: price for name, price in raw_items if price >= 100}
print(f"Premium Lookup: {premium_products}")
```
```text
# Output:
Premium Lookup: {'Laptop': 1200, 'Monitor': 350}
```

---

## Code Walkthroughs

---

### Walkthrough 1: Clickstream Slicing and Session Tracing
Let's see how an analyst would slice a sequence of user page views (clickstream data) to inspect recent interactions and check for specific landing page errors.

```python
# Log of web page views in chronological order (oldest to newest)
clickstream = [
    "landing_page", "pricing", "sign_up_form", "verification_sent", 
    "dashboard", "billing_setup", "error_page_500", "help_center"
]

# 1. Get the most recent 3 pages viewed
recent_pages = clickstream[-3:]
print(f"Recent pages visited: {recent_pages}")

# 2. Get the customer's initial navigation path (excluding the landing page)
middle_path = clickstream[1:5]
print(f"Initial navigation path: {middle_path}")

# 3. Reverse the clickstream to view the path in reverse chronological order
reverse_path = clickstream[::-1]
print(f"Reverse path tracking: {reverse_path}")

# 4. Check if the user hit the error page during their session
if "error_page_500" in clickstream:
    error_idx = clickstream.index("error_page_500")
    print(f"User encountered 500 server error at step index {error_idx}.")
```
```text
# Output:
Recent pages visited: ['billing_setup', 'error_page_500', 'help_center']
Initial navigation path: ['pricing', 'sign_up_form', 'verification_sent', 'dashboard']
Reverse path tracking: ['help_center', 'error_page_500', 'billing_setup', 'dashboard', 'verification_sent', 'sign_up_form', 'pricing', 'landing_page']
User encountered 500 server error at step index 6.
```

---

### Walkthrough 2: flattening a Nested JSON API Payload
Web APIs often return deeply nested JSON configurations. Let's write a parser to extract details and flatten a payload into a single-level dictionary.

```python
# Nested JSON object representing an API response
api_response = {
    "user_id": 9021,
    "personal_details": {
        "first_name": "Marcus",
        "last_name": "Aurelius",
        "contact": {
            "email": "marcus@rome.com",
            "phone": "555-123-4567"
        }
    },
    "subscription": {
        "plan": "Enterprise Premium",
        "billing_period": "annual"
    }
}

# Cleanly extract nested values
first_name = api_response.get("personal_details", {}).get("first_name", "Unknown")
email = api_response.get("personal_details", {}).get("contact", {}).get("email", "N/A")
plan = api_response.get("subscription", {}).get("plan", "Free")

print(f"User: {first_name} | Email: {email} | Plan: {plan}")

# Flattening the nested JSON payload programmatically
flattened_user = {
    "user_id": api_response.get("user_id"),
    "first_name": api_response["personal_details"]["first_name"],
    "last_name": api_response["personal_details"]["last_name"],
    "email": api_response["personal_details"]["contact"]["email"],
    "phone": api_response["personal_details"]["contact"]["phone"],
    "sub_plan": api_response["subscription"]["plan"],
    "billing": api_response["subscription"]["billing_period"]
}

print("\nFlattened User Dictionary:")
for k, v in flattened_user.items():
    print(f"  {k:<12}: {v}")
```
```text
# Output:
User: Marcus | Email: marcus@rome.com | Plan: Premium
Flattened User Dictionary:
  user_id     : 9021
  first_name  : Marcus
  last_name   : Aurelius
  email       : marcus@rome.com
  phone       : 555-123-4567
  sub_plan    : Enterprise Premium
  billing     : annual
```

---

### Walkthrough 3: Group-by Aggregation (Vanilla Pivot Table)
Let's aggregate a transactional table to find total sales by product type without using Pandas.

```python
transactions = [
    {"product": "Laptop", "amount": 1200.00, "region": "North"},
    {"product": "Mouse", "amount": 30.00, "region": "North"},
    {"product": "Laptop", "amount": 1200.00, "region": "South"},
    {"product": "Monitor", "amount": 350.00, "region": "East"},
    {"product": "Mouse", "amount": 30.00, "region": "South"},
    {"product": "Monitor", "amount": 350.00, "region": "North"}
]

# We want to calculate the total revenue and count of sales per product
pivot_data = {}

for tx in transactions:
    product = tx["product"]
    amount = tx["amount"]
    
    if product not in pivot_data:
        pivot_data[product] = {"total_revenue": 0.0, "sales_count": 0}
        
    pivot_data[product]["total_revenue"] += amount
    pivot_data[product]["sales_count"] += 1

print(f"{'Product':<12} | {'Sales Count':>11} | {'Total Revenue':>14}")
print("-" * 45)
for product, stats in pivot_data.items():
    print(f"{product:<12} | {stats['sales_count']:>11} | ${stats['total_revenue']:>13,.2f}")
```
```text
# Output:
Product      | Sales Count | Total Revenue
---------------------------------------------
Laptop       |           2 | $     2,400.00
Mouse        |           2 | $        60.00
Monitor      |           2 | $       700.00
```

---

## Edge Cases, Gotchas, and Common Mistakes

### Gotcha 1: Shallow Copy vs. Deep Copy
When you copy a list or dictionary using `.copy()`, Python performs a **shallow copy**. This means a new outer container is created, but any nested objects (like dictionaries inside a list) still reference the exact same memory locations as the original.

```python
import copy

original = [{"client": "Acme Corp", "balance": 5000}]

# 1. Create a shallow copy
shallow_copy = original.copy()

# 2. Create a deep copy
deep_copy = copy.deepcopy(original)

# Modify the nested dictionary in the shallow copy
shallow_copy[0]["balance"] = 9999

print(f"Original:     {original}")
print(f"Shallow Copy: {shallow_copy}  <── Original changed too!")
print(f"Deep Copy:    {deep_copy}  <── Original protected!")
```
```text
# Output:
Original:     [{'client': 'Acme Corp', 'balance': 9999}]
Shallow Copy: [{'client': 'Acme Corp', 'balance': 9999}]
Deep Copy:    [{'client': 'Acme Corp', 'balance': 5000}]
```

**How to avoid:** If your list contains nested dictionaries, sets, or lists, always import the `copy` library and use `copy.deepcopy()` to clone the data safely.

---

### Gotcha 2: Modifying Dictionary Keys During Iteration
You cannot add or remove keys from a dictionary while directly looping over it. This changes the hash bucket layout and raises a `RuntimeError`.

```python
# BUGGY CODE
revenue = {"store_a": 500, "store_b": 0, "store_c": 1200}

try:
    for store, sales in revenue.items():
        if sales == 0:
            del revenue[store]  # Raises RuntimeError
except RuntimeError as e:
    print(f"Error: {e}")
```
```text
# Output:
Error: dictionary changed size during iteration
```

**The Clean Fix:** Convert the keys to a list first. This creates a static snapshot of the keys, allowing you to modify the dictionary safely.

```python
# CORRECT CODE
revenue = {"store_a": 500, "store_b": 0, "store_c": 1200}

# Iterate over a list snapshot of the keys
for store in list(revenue.keys()):
    if revenue[store] == 0:
        del revenue[store]

print(f"Cleaned revenue dict: {revenue}")
```
```text
# Output:
Cleaned revenue dict: {'store_a': 500, 'store_c': 1200}
```

---

## Practice Exercises & Mini-Projects

### Exercise 1: Search Performance Comparison Test
**Problem Statement:**
Let's prove the difference between list lookups and dictionary lookups.
1. Write a script that generates a list containing integers from `0` to `9,999,999` (10 million integers).
2. Generate a dictionary containing key-value pairs where keys are strings like `"ID_X"` and values are `X`, for `X` in range `0` to `9,999,999`.
3. Perform a lookup for the value `9,999,998` in the list using `in`. Time how long it takes using `time.perf_counter()`.
4. Perform a lookup for the key `"ID_9999998"` in the dictionary. Time how long it takes.
5. Print the time difference.

---

### Exercise 2: API JSON Sanitizer & Metric Aggregator
**Problem Statement:**
Given a list of transaction records retrieved from an API:
```python
api_records = [
    {"tx_id": "T1", "details": {"category": "Tech", "price": "1,200.50", "tax": "0.08"}},
    {"tx_id": "T2", "details": {"category": "Office", "price": "45.00", "tax": "0.05"}},
    {"tx_id": "T3", "details": {"category": "Tech", "price": "350.00", "tax": "N/A"}},
    {"tx_id": "T4", "details": {"category": "Furniture", "price": "N/A", "tax": "0.10"}},
]
```
Write a script to clean and aggregate this data:
1. Parse the string value `"price"` into a float. If the price is `"N/A"`, default it to `0.0`.
2. Parse the string value `"tax"` into a float. If the tax is `"N/A"`, default it to `0.0`.
3. Compute the `total_cost = price * (1 + tax)` for each record.
4. Calculate the sum of `total_cost` grouped by category (using a dictionary).
5. Output the cleaned list of records and the category totals.

---

## Section Recaps

* **Lists** are ordered collections accessed by zero-based positive indexes or negative indexes (counting back from the end).
* **Slicing syntax** follows `list[start:stop:step]` to extract subsets of data without modifying the original collection.
* **Lists use O(n) linear search** for checking membership, which degrades in performance as the list size grows.
* **Dictionaries map unique keys to values** using hash tables, enabling **O(1) constant-time** key lookups regardless of dictionary size.
* **.get()** is a safer way to access dictionary values than bracket notation, preventing application crashes due to `KeyError`.
* **Nested lists of dicts** are the standard vanilla Python layout for storing row-based tabular data.
* **Shallow Copy Gotcha:** Modifying nested records in a shallow-copied list changes the values inside the original list. Use `deepcopy` instead.

---

## Common Interview Questions

### Q1: Explain why dictionary lookups are $O(1)$ while list lookups are $O(n)$. How does hashing make this possible?

**Answer:**
A list is stored as a contiguous sequence of elements in memory. To find a specific value, Python has to scan the list element-by-element from the beginning. In the worst case, this requires checking all $n$ items, giving it a time complexity of $O(n)$ (Linear Time).

A dictionary uses a hash table. When a key is inserted, Python converts the key into an integer using a hash function. This integer is mapped to a specific memory address (index bucket) where the value is stored. 

When looking up a key, Python computes its hash value, goes directly to the corresponding memory slot, and retrieves the value in a single step. Since it does not scan other keys, lookup takes $O(1)$ (Constant Time) regardless of dictionary size.

---

### Q2: What is the difference between `list.append(item)` and `list.extend(iterable)`? Show what happens when you pass a list to both.

**Answer:**
* `list.append(item)` adds the argument as a single element to the end of the list, regardless of the object's type.
* `list.extend(iterable)` iterates over the argument and appends each element to the list individually.

If you pass a list to both methods, the differences are clear:
```python
list_a = [1, 2]
list_b = [1, 2]

# append a list
list_a.append([3, 4])
# Result: [1, 2, [3, 4]] (length is 3)

# extend a list
list_b.extend([3, 4])
# Result: [1, 2, 3, 4] (length is 4)
```

---

### Q3: How does `dict.get()` handle missing keys compared to bracket notation `dict[key]`? When should you use each?

**Answer:**
* Bracket notation `dict[key]` looks up a key directly. If the key is missing from the dictionary, Python raises a `KeyError`, crashing the script.
* The `.get(key, default)` method checks if the key exists. If it does not, it returns the custom default value (or `None` if no default is specified) instead of crashing.

**When to use:**
* Use `.get()` when the key is optional or might be missing, such as when parsing external API payloads or dealing with sparse database records.
* Use bracket notation `dict[key]` when the key **must** be present for the code to run correctly, as raising an error is preferable to propagating a silent missing value bug.

---

### Q4: What is the difference between a shallow copy and a deep copy of a list/dictionary? How do you create both in Python?

**Answer:**
* A **shallow copy** creates a new outer collection, but populates it with references to the child objects stored in the original collection. If the collection contains nested lists or dictionaries, modifying them in the copy changes the original. You create it using `original.copy()` or `list(original)`.
* A **deep copy** recursively duplicates the outer collection and all nested objects inside it. Modifying nested structures inside a deep copy has no effect on the original collection. You create it by importing the `copy` module and running `copy.deepcopy(original)`.

---

### Q5: How do you invert a dictionary (swap keys and values) using a dictionary comprehension? What happens if duplicate values exist in the original dictionary?

**Answer:**
You can invert a dictionary using the following comprehension:
```python
inverted_dict = {value: key for key, value in original_dict.items()}
```
If duplicate values exist in the original dictionary, the inversion will overwrite keys. Since dictionary keys must be unique, when two keys have the same value (e.g. `{"A": 1, "B": 1}`), the dict comprehension iterates in order. The key that is processed last will overwrite any previous key linked to that value, resulting in a single value-to-key mapping (e.g., `{1: "B"}`).
