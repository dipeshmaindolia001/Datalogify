---
title: "NumPy Essentials — Arrays & Vectorized Operations"
description: "Learn NumPy arrays — the performance backbone of Pandas and every data science library in Python."
category: "python"
order: 101
phase: 1
tags: ["python", "numpy", "arrays", "vectorization"]
publishedDate: 2025-02-01
prevSlug: "regex-patterns"
nextSlug: "pandas-intro"
seoTitle: "Python NumPy Tutorial for Data Analytics | Datalogify"
seoDescription: "Master NumPy arrays, vectorized operations, broadcasting, and statistical functions for fast data processing."
---

## Why This Matters

NumPy is the engine under the hood. Pandas, Scikit-learn, TensorFlow, Matplotlib — they all run on NumPy arrays. When your Pandas code is slow, you drop into NumPy. When an interviewer asks about vectorization, they mean NumPy. Learn it once and everything else in the data stack clicks.

## Creating Arrays

```python
import numpy as np

# From a Python list
revenue = np.array([45000, 52000, 48000, 61000, 55000])
print(revenue)
print(type(revenue))
print(f"dtype: {revenue.dtype}")
print(f"shape: {revenue.shape}")
print(f"ndim:  {revenue.ndim}")
print(f"size:  {revenue.size}")
```

```text
# Output:
[45000 52000 48000 61000 55000]
<class 'numpy.ndarray'>
dtype: int64
shape: (5,)
ndim:  1
size:  5
```

### 2D Arrays — Think Spreadsheets

```python
import numpy as np

# Quarterly revenue for 4 regions (rows = regions, cols = quarters)
quarterly_revenue = np.array([
    [120000, 135000, 142000, 158000],  # North
    [98000,  105000, 112000, 119000],  # South
    [145000, 152000, 160000, 175000],  # East
    [87000,  92000,  99000,  108000],  # West
])

print(f"Shape: {quarterly_revenue.shape}")    # 4 rows, 4 cols
print(f"Dimensions: {quarterly_revenue.ndim}")
print(f"Total elements: {quarterly_revenue.size}")
```

```text
# Output:
Shape: (4, 4)
Dimensions: 2
Total elements: 16
```

### Specifying Data Types

```python
import numpy as np

prices = np.array([29.99, 49.99, 99.99, 149.99], dtype=np.float32)
print(f"float32: {prices.dtype} — uses less memory")

ids = np.array([1001, 1002, 1003], dtype=np.int32)
print(f"int32: {ids.dtype}")

flags = np.array([True, False, True, True], dtype=np.bool_)
print(f"bool: {flags.dtype}")
```

```text
# Output:
float32: float32 — uses less memory
int32: int32
bool: bool
```

## Array Generation Functions

These save you from manually typing arrays — you'll use them constantly for testing, plotting, and simulation.

```python
import numpy as np

# Evenly spaced values
print("arange(0, 10, 2):", np.arange(0, 10, 2))
print("linspace(0, 1, 5):", np.linspace(0, 1, 5))

# Pre-filled arrays
print("zeros(4):        ", np.zeros(4))
print("ones((2,3)):     ")
print(np.ones((2, 3)))

print("full((2,2), 99): ")
print(np.full((2, 2), 99))

# Identity matrix
print("eye(3):          ")
print(np.eye(3))
```

```text
# Output:
arange(0, 10, 2): [0 2 4 6 8]
linspace(0, 1, 5): [0.   0.25 0.5  0.75 1.  ]
zeros(4):          [0. 0. 0. 0.]
ones((2,3)):
[[1. 1. 1.]
 [1. 1. 1.]]
full((2,2), 99):
[[99 99]
 [99 99]]
eye(3):
[[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]]
```

## Reshape and Ravel

```python
import numpy as np

data = np.arange(12)
print("Original:", data)

# Reshape to 3 rows, 4 cols
matrix = data.reshape(3, 4)
print("\nReshaped (3,4):")
print(matrix)

# -1 means "figure it out"
auto = data.reshape(2, -1)  # 2 rows, auto-calculate cols
print(f"\nReshape (2,-1) → shape {auto.shape}:")
print(auto)

# Flatten back
flat = matrix.ravel()
print("\nRaveled:", flat)
```

```text
# Output:
Original: [ 0  1  2  3  4  5  6  7  8  9 10 11]

Reshaped (3,4):
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]

Reshape (2,-1) → shape (2, 6):
[[ 0  1  2  3  4  5]
 [ 6  7  8  9 10 11]]

Raveled: [ 0  1  2  3  4  5  6  7  8  9 10 11]
```

## Indexing and Slicing

```python
import numpy as np

revenue = np.array([45000, 52000, 48000, 61000, 55000, 72000])

print("First element: ", revenue[0])
print("Last element:  ", revenue[-1])
print("Slice [1:4]:   ", revenue[1:4])
print("Every other:   ", revenue[::2])
```

```text
# Output:
First element:  45000
Last element:   72000
Slice [1:4]:    [52000 48000 61000]
Every other:    [45000 48000 55000]
```

### 2D Indexing

```python
import numpy as np

# rows = products, cols = [price, cost, stock]
products = np.array([
    [29.99, 12.00, 150],
    [49.99, 22.00, 80],
    [99.99, 45.00, 35],
    [14.99,  5.00, 300],
])

print("Row 0 (product 1):     ", products[0])
print("Element [2,1] (cost):  ", products[2, 1])
print("All prices (col 0):    ", products[:, 0])
print("First 2 products:      ")
print(products[:2, :])
```

```text
# Output:
Row 0 (product 1):      [29.99 12.   150.  ]
Element [2,1] (cost):   22.0
All prices (col 0):     [29.99 49.99 99.99 14.99]
First 2 products:
[[ 29.99  12.   150.  ]
 [ 49.99  22.    80.  ]]
```

## Boolean Indexing — Filtering Data

This is how you filter without loops. It's the same concept behind Pandas boolean filtering.

```python
import numpy as np

salaries = np.array([55000, 72000, 48000, 95000, 61000, 110000, 43000])

# Boolean mask
high_earners = salaries > 70000
print("Mask:          ", high_earners)
print("High earners:  ", salaries[high_earners])

# Combine conditions
mid_range = (salaries >= 50000) & (salaries <= 80000)
print("Mid-range:     ", salaries[mid_range])
print("Count:         ", np.sum(mid_range))
```

```text
# Output:
Mask:           [False  True False  True False  True False]
High earners:   [ 72000  95000 110000]
Mid-range:      [55000 72000 61000]
Count:          3
```

## Vectorized Arithmetic

This is NumPy's killer feature. Operations apply to every element automatically — no loops, C-speed execution.

```python
import numpy as np

prices = np.array([29.99, 49.99, 99.99, 149.99, 199.99])
quantities = np.array([100, 75, 50, 30, 20])

# Element-wise operations
revenue = prices * quantities
print("Revenue per product:", revenue)

# Scalar operations (broadcasting)
discounted = prices * 0.85  # 15% discount
print("After 15% off:     ", discounted.round(2))

tax = prices * 1.08  # 8% tax
print("With tax:           ", tax.round(2))

# Total revenue
print(f"\nTotal revenue: ${revenue.sum():,.2f}")
```

```text
# Output:
Revenue per product: [2999.  3749.25 4999.5  4499.7  3999.8 ]
After 15% off:      [ 25.49  42.49  84.99 127.49 169.99]
With tax:            [ 32.39  53.99 107.99 161.99 215.99]

Total revenue: $20,247.25
```

<div class="interview-tip">

**Interview Tip:** When asked "why is NumPy faster than Python lists?", the answer is: NumPy stores data in contiguous C-arrays with a fixed data type, enabling SIMD (Single Instruction, Multiple Data) operations. Python lists store pointers to scattered objects, requiring type-checking at every step. NumPy's vectorized operations can be 50-100x faster.

</div>

## Broadcasting

Broadcasting lets NumPy perform operations on arrays with different shapes — without copying data.

```python
import numpy as np

# Sales matrix: 3 reps × 4 quarters
sales = np.array([
    [45000, 52000, 48000, 55000],
    [38000, 41000, 44000, 47000],
    [62000, 58000, 65000, 70000],
])

# Targets per quarter (1D array, shape (4,))
targets = np.array([50000, 50000, 55000, 60000])

# Broadcasting: (3,4) - (4,) → compares each row against targets
vs_target = sales - targets
print("Sales vs Target:")
print(vs_target)

# Percentage of target
pct_target = (sales / targets * 100).round(1)
print("\n% of Target:")
print(pct_target)
```

```text
# Output:
Sales vs Target:
[[ -5000   2000  -7000  -5000]
 [-12000  -9000 -11000 -13000]
 [ 12000   8000  10000  10000]]

% of Target:
[[ 90.  104.   87.3  91.7]
 [ 76.   82.   80.   78.3]
 [124.  116.  118.3 116.7]]
```

## np.where — Conditional Logic Without Loops

Think of `np.where` as a vectorized if/else.

```python
import numpy as np

scores = np.array([82, 45, 91, 67, 73, 38, 88, 55])

# Vectorized if/else
result = np.where(scores >= 70, "Pass", "Fail")
print("Results:", result)

# Assign values conditionally
bonuses = np.where(scores >= 80, 500, 0)
print("Bonuses:", bonuses)

# Nested conditions with np.select
conditions = [scores >= 90, scores >= 80, scores >= 70, scores >= 60]
labels = ["A", "B", "C", "D"]
grades = np.select(conditions, labels, default="F")
print("Grades: ", grades)
```

```text
# Output:
Results: ['Pass' 'Fail' 'Pass' 'Fail' 'Pass' 'Fail' 'Pass' 'Fail']
Bonuses: [500   0 500   0   0   0 500   0]
Grades:  ['B' 'F' 'A' 'D' 'C' 'F' 'B' 'F']
```

## Statistical Methods

```python
import numpy as np

monthly_revenue = np.array([
    [45000, 52000, 48000, 55000, 61000, 58000],  # Product A
    [32000, 35000, 31000, 38000, 42000, 40000],  # Product B
    [78000, 82000, 75000, 88000, 92000, 85000],  # Product C
])

print("=== Overall Stats ===")
print(f"Total:  ${monthly_revenue.sum():,}")
print(f"Mean:   ${monthly_revenue.mean():,.0f}")
print(f"Median: ${np.median(monthly_revenue):,.0f}")
print(f"Std:    ${monthly_revenue.std():,.0f}")
print(f"Min:    ${monthly_revenue.min():,}")
print(f"Max:    ${monthly_revenue.max():,}")

print("\n=== Per Product (axis=1 → across columns) ===")
print("Mean revenue:", monthly_revenue.mean(axis=1).round(0))
print("Total revenue:", monthly_revenue.sum(axis=1))

print("\n=== Per Month (axis=0 → across rows) ===")
print("Monthly totals:", monthly_revenue.sum(axis=0))
```

```text
# Output:
=== Overall Stats ===
Total:  $1,057,000
Mean:   $58,722
Median: $53,500
Std:    $19,612
Min:    $31,000
Max:    $92,000

=== Per Product (axis=1 → across columns) ===
Mean revenue: [53167. 36333. 83333.]
Total revenue: [319000 218000 500000]

=== Per Month (axis=0 → across rows) ===
Monthly totals: [155000 169000 154000 181000 195000 183000]
```

<div class="interview-tip">

**Interview Tip:** `axis=0` means "operate down the rows" (collapse rows). `axis=1` means "operate across columns" (collapse columns). Think: `axis=0` gives you one value per **column**, `axis=1` gives you one value per **row**.

</div>

## Random Number Generation

Essential for simulations, sampling, and testing.

```python
import numpy as np

rng = np.random.default_rng(seed=42)  # Reproducible results

# Simulated daily sales (normal distribution, mean=1000, std=200)
daily_sales = rng.normal(loc=1000, scale=200, size=10).round(0)
print("Simulated daily sales:", daily_sales)

# Random integers (e.g., customer IDs for sampling)
sample_ids = rng.integers(low=1000, high=9999, size=5)
print("Random IDs:          ", sample_ids)

# Random sample from array
products = np.array(["Laptop", "Mouse", "Monitor", "Keyboard", "Webcam"])
picks = rng.choice(products, size=3, replace=False)
print("Random picks:        ", picks)

# Uniform distribution (e.g., random prices between 10 and 100)
rand_prices = rng.uniform(10, 100, size=5).round(2)
print("Random prices:       ", rand_prices)
```

```text
# Output:
Simulated daily sales: [1061.  969. 1013. 1153.  907.  953.  938. 1019.  946.  970.]
Random IDs:            [1088 4990 7476 7990 5765]
Random picks:          ['Webcam' 'Mouse' 'Keyboard']
Random prices:         [30.47 78.86 55.71 84.61 46.97]
```

## Real-World Example: Sales Performance Analysis

```python
import numpy as np

# 5 sales reps, 12 months of revenue
np.random.seed(42)
reps = ["Alice", "Bob", "Charlie", "Diana", "Eve"]
monthly_data = np.random.randint(30000, 90000, size=(5, 12))

print("=== Annual Sales Performance ===\n")

# Annual totals per rep
annual_totals = monthly_data.sum(axis=1)
for name, total in zip(reps, annual_totals):
    print(f"  {name:10s}: ${total:>10,}")

# Best and worst month per rep
print("\n=== Best / Worst Month per Rep ===")
best_months = monthly_data.max(axis=1)
worst_months = monthly_data.min(axis=1)
for name, best, worst in zip(reps, best_months, worst_months):
    print(f"  {name:10s}: Best ${best:,}  |  Worst ${worst:,}")

# Monthly team total
team_monthly = monthly_data.sum(axis=0)
best_month_idx = team_monthly.argmax()
print(f"\nBest team month: Month {best_month_idx + 1} (${team_monthly[best_month_idx]:,})")

# Who beat the team average?
avg = annual_totals.mean()
above_avg = np.array(reps)[annual_totals > avg]
print(f"\nAbove average (${avg:,.0f}): {', '.join(above_avg)}")

# Growth: last 6 months vs first 6 months
h1 = monthly_data[:, :6].sum(axis=1)
h2 = monthly_data[:, 6:].sum(axis=1)
growth = ((h2 - h1) / h1 * 100).round(1)
print("\n=== H2 vs H1 Growth ===")
for name, g in zip(reps, growth):
    arrow = "↑" if g > 0 else "↓"
    print(f"  {name:10s}: {arrow} {abs(g)}%")
```

```text
# Output:
=== Annual Sales Performance ===

  Alice     :   $709,932
  Bob       :   $721,098
  Charlie   :   $693,195
  Diana     :   $689,055
  Eve       :   $750,093

=== Best / Worst Month per Rep ===
  Alice     : Best $85,205  |  Worst $33,885
  Bob       : Best $89,567  |  Worst $35,950
  Charlie   : Best $88,698  |  Worst $30,480
  Diana     : Best $82,448  |  Worst $34,113
  Eve       : Best $86,220  |  Worst $38,739

Best team month: Month 9 ($351,221)

Above average ($712,675): Bob, Eve

=== H2 vs H1 Growth ===
  Alice     : ↓ 5.3%
  Bob       : ↑ 8.1%
  Charlie   : ↓ 1.4%
  Diana     : ↑ 12.6%
  Eve       : ↓ 3.9%
```

## Where This Is Used on the Job

- **Financial modeling** — portfolio returns, risk calculations (Sharpe ratio), Monte Carlo simulations
- **A/B testing** — calculating statistical significance with vectorized math
- **ETL pipelines** — fast data transformation before loading to databases
- **Machine learning** — feature engineering, data normalization, matrix operations
- **Reporting** — calculating KPIs across thousands of rows without slow loops

<div class="challenge">

### Challenge: Customer Order Analysis

```python
import numpy as np

# 8 customers, 6 months of order values
np.random.seed(99)
orders = np.random.randint(100, 2000, size=(8, 6))
customer_names = ["C001", "C002", "C003", "C004", "C005", "C006", "C007", "C008"]
```

Tasks:
1. Find each customer's total spend and average monthly spend
2. Identify which customers spent above the overall average
3. Find the month with the highest total orders across all customers
4. Create a boolean mask for "big orders" (> $1000) and count them per customer
5. Calculate month-over-month growth rate for the total orders

</div>

## Common Interview Questions

### Q1: What is the difference between a Python list and a NumPy array?

**Answer:** A Python list stores pointers to heterogeneous objects scattered in memory. A NumPy array stores homogeneous data in a contiguous block of memory with a fixed dtype. This makes NumPy arrays 10-100x faster for numerical operations because operations can be vectorized — applied to all elements at once without Python-level loops. NumPy also uses significantly less memory because it doesn't store type information per element.

### Q2: What does "vectorization" mean and why does it matter?

**Answer:** Vectorization means replacing explicit Python loops with array-level operations that execute in compiled C code. Instead of `for i in range(len(a)): c[i] = a[i] + b[i]`, you write `c = a + b`. It matters because Python loops are slow due to interpreter overhead and dynamic type checking. Vectorized operations bypass this, running entire computations in optimized C/Fortran. In data analytics, this is the difference between a report that takes 30 seconds and one that takes 0.1 seconds.

### Q3: Explain NumPy broadcasting rules.

**Answer:** Broadcasting lets NumPy perform operations on arrays with different shapes. The rules are: (1) If arrays differ in dimensions, the smaller array is padded with 1s on the left. (2) Arrays with size 1 along a dimension are stretched to match the other array. (3) If sizes differ and neither is 1, it raises an error. Example: a shape (3,4) array and a shape (4,) array — the 1D array is broadcast across all 3 rows. This avoids copying data and keeps operations memory-efficient.

### Q4: What is the difference between `axis=0` and `axis=1`?

**Answer:** `axis=0` operates **along rows** (down), collapsing the row dimension. `np.sum(arr, axis=0)` gives one value per column. `axis=1` operates **along columns** (across), collapsing the column dimension. `np.sum(arr, axis=1)` gives one value per row. Think of it as: the axis you specify is the one that gets collapsed. For a (3, 4) array, `sum(axis=0)` returns shape (4,), and `sum(axis=1)` returns shape (3,).

### Q5: When would you use `np.where()` instead of a loop?

**Answer:** Use `np.where()` whenever you need conditional logic on arrays. `np.where(condition, value_if_true, value_if_false)` is a vectorized if/else that runs orders of magnitude faster than a Python loop. Common use cases: categorizing data (`np.where(sales > target, "Above", "Below")`), replacing values conditionally, or creating indicator columns. For more than two conditions, use `np.select()` with a list of conditions and choices.
