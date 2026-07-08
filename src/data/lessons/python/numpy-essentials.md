---
title: "NumPy Essentials — Arrays & Vectorized Operations"
description: "Master NumPy arrays, vectorized operations, broadcasting, and statistical functions for fast data processing."
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

## Why This Matters: The Engine Under the Hood

In data analytics, speed is everything. When you are analyzing a dataset with 100,000 rows, a slow script is a minor annoyance. When you scale that to 100 million rows, a slow script is a project-killing bottleneck. 

Vanilla Python is incredibly flexible and developer-friendly, but that friendliness comes at a steep performance cost. Python lists are generic containers that can hold any data type. To support this flexibility, Python stores lists as arrays of **pointers** to objects scattered all over your computer's memory. This design makes basic math operations on lists painfully slow.

This is where **NumPy** (Numerical Python) comes in. NumPy is the absolute bedrock of the Python data science stack. Pandas, Scikit-learn, SciPy, and TensorFlow are all built directly on top of NumPy. If Pandas is a slick sports car, NumPy is the high-performance engine under the hood. Understanding how NumPy works at a low level will make you a better programmer, help you write optimized Pandas queries, and allow you to pass technical data engineering interviews with ease.

---

## The Visual Analogy: The Locker Room Metaphor

To understand why NumPy is so much faster than vanilla Python, let's look at a visual metaphor.

### Vanilla Python List: The Scattered Address Book
Imagine you run a package delivery service. A Python list is like a directory of addresses pointing to lockers scattered all over town:
* Locker #1 is in the north side of the city (holding an integer).
* Locker #2 is in the south side (holding a float).
* Locker #3 is in the west side (holding a string).

Every time you want to inspect or modify the items in your list, the Python interpreter has to read an address, travel to that specific location, look up the object's type, unpack the value, perform the operation, and then travel to the next scattered address. This constant traveling and lookup process is known as **pointer dereferencing** and **dynamic type checking**.

### NumPy Array: The Identical Storage Grid
A NumPy array is like a single warehouse containing a highly organized, contiguous grid of identical storage lockers:
* Every locker is exactly the same size.
* Every locker contains the exact same type of item (e.g., only 64-bit integers).
* The lockers are packed side-by-side in a single, uninterrupted physical block of memory.

```text
Python List (Scattered Pointers):
[ List Object ] ---> Pointer 1 ---> [ Integer 45000 (Somewhere in memory) ]
                ---> Pointer 2 ---> [ Float 52.3    (Elsewhere in memory) ]
                ---> Pointer 3 ---> [ String "North" (Deep in memory)      ]

NumPy Array (Contiguous Blocks):
┌───────────┬───────────┬───────────┬───────────┬───────────┐
│  45000    │  52000    │  48000    │  61000    │  55000    │  <-- Raw values stored directly
└───────────┴───────────┴───────────┴───────────┴───────────┘
[   Int64   ][   Int64   ][   Int64   ][   Int64   ][   Int64   ]
```

Because the warehouse is uniform, you don't need an address book. If you know where the first locker is, and you know every locker is exactly 8 bytes wide, you can calculate the exact memory location of the 10,000th locker instantly using simple arithmetic:

$$\text{Memory Address} = \text{Base Address} + (\text{Index} \times \text{Locker Width})$$

This layout is the secret to NumPy's blazing speed. It allows the CPU to fetch large blocks of data into its ultra-fast L1/L2 cache all at once (cache locality) and perform calculations on multiple values simultaneously (vectorization).

---

## Speed Showdown: Lists vs. Arrays

Let's write a simple script to measure the speed difference between a vanilla Python list and a NumPy array when squaring 1,000,000 numbers.

```python
import time
import numpy as np

# Create a list of 1 million integers
size = 1_000_000
python_list = list(range(size))
numpy_array = np.arange(size)

# Time the Python list operation (using a list comprehension)
start_time = time.time()
python_list_squared = [x ** 2 for x in python_list]
python_duration = time.time() - start_time

# Time the NumPy array operation (vectorized)
start_time = time.time()
numpy_array_squared = numpy_array ** 2
numpy_duration = time.time() - start_time

print(f"Python list execution time: {python_duration:.5f} seconds")
print(f"NumPy array execution time: {numpy_duration:.5f} seconds")
print(f"NumPy is {python_duration / numpy_duration:.1f}x faster!")
```

```text
# Output:
Python list execution time: 0.08241 seconds
NumPy array execution time: 0.00142 seconds
NumPy is 58.0x faster!
```

NumPy operations are implemented in highly optimized C. By bypassing the Python interpreter loop and dynamic type checking, NumPy can perform mathematical operations directly on raw memory blocks.

---

## Step-by-Step Concept Breakdown

To master NumPy, we must understand the core characteristics of its primary data structure: the $N$-dimensional array, or `ndarray`.

### 1. Homogeneity & Static Typing
Unlike Python lists, which can mix strings, integers, and objects, a NumPy array **must be homogeneous**—every single element must have the exact same data type (`dtype`). If you try to mix types, NumPy will automatically "upcast" them to the most flexible type to maintain consistency:

```python
import numpy as np

# Mixing float and int -> upcasts to float64
mixed_array = np.array([1, 2.5, 3])
print("Mixed array:", mixed_array)
print("Dtype:", mixed_array.dtype)

# Mixing number and string -> upcasts to Unicode string (U32)
string_mixed = np.array([42, "Data", 3.14])
print("String mixed:", string_mixed)
print("Dtype:", string_mixed.dtype)
```

```text
# Output:
Mixed array: [1.  2.5 3. ]
Dtype: float64
String mixed: ['42' 'Data' '3.14']
Dtype: <U32
```

### 2. Key Attributes of an Array
Every NumPy array contains metadata attributes that define its structure:
* `ndim`: The number of dimensions (axes).
* `shape`: A tuple of integers showing the size of the array along each axis.
* `size`: The total number of elements in the array (equal to the product of shape elements).
* `dtype`: The data type of the elements.
* `itemsize`: The size in bytes of each element.
* `nbytes`: The total memory occupied by the array (`size * itemsize`).

Let's examine these attributes in practice:

```python
import numpy as np

# A 2D array representing quarterly sales across 3 regions
sales = np.array([
    [100, 120, 150, 130],  # Region A
    [90,  110, 95,  100],  # Region B
    [200, 210, 220, 240]   # Region C
], dtype=np.int32)

print(f"Dimensions (ndim): {sales.ndim}")
print(f"Shape (rows, cols): {sales.shape}")
print(f"Total elements (size): {sales.size}")
print(f"Data type (dtype): {sales.dtype}")
print(f"Bytes per element (itemsize): {sales.itemsize} bytes")
print(f"Total memory usage (nbytes): {sales.nbytes} bytes")
```

```text
# Output:
Dimensions (ndim): 2
Shape (rows, cols): (3, 4)
Total elements (size): 12
Data type (dtype): int32
Bytes per element (itemsize): 4 bytes
Total memory usage (nbytes): 48 bytes
```

### 3. Strides: How NumPy Navigates Memory
How does NumPy represent a 2D grid in a 1D computer memory chip? It uses **strides**. Strides are a tuple of bytes to step in each dimension when traversing the array.

For our `sales` array of shape `(3, 4)` and `int32` type (4 bytes per number):
* To move to the next column in the same row, we jump 4 bytes.
* To move to the next row, we must jump past an entire row of 4 columns, which is $4 \times 4 \text{ bytes} = 16 \text{ bytes}$.
Therefore, the strides for this array are `(16, 4)`.

```python
print(f"Strides: {sales.strides}")
```

```text
# Output:
Strides: (16, 4)
```

This explains why reshaping an array in NumPy is nearly instantaneous and consumes no extra memory. It doesn't move data around; it simply updates the `shape` and `strides` metadata!

---

## Creation and Initialization Functions

You rarely write arrays by hand in production. NumPy provides highly optimized functions to initialize arrays of various shapes and values.

```python
import numpy as np

# 1. Evenly spaced values in an interval
print("arange(0, 10, 2):", np.arange(0, 10, 2))  # Start, stop (exclusive), step

# 2. Linear spacing (great for graphing and binning)
print("linspace(0, 1, 5):", np.linspace(0, 1, 5))  # Start, stop (inclusive), num_elements

# 3. Placeholders
print("Zeros:\n", np.zeros((2, 3)))  # Shape as tuple
print("Ones:\n", np.ones((2, 2), dtype=np.int16))
print("Constant array:\n", np.full((2, 3), 99.9))

# 4. Identity Matrix (essential for linear algebra)
print("Identity Matrix:\n", np.eye(3))

# 5. Random number generation
np.random.seed(42)  # Seed for reproducibility
print("Uniform Random [0,1):\n", np.random.rand(2, 2))
print("Standard Normal (mean=0, std=1):\n", np.random.randn(2, 2))
print("Random Integers [10, 50):\n", np.random.randint(10, 50, size=(2, 3)))
```

```text
# Output:
arange(0, 10, 2): [0 2 4 6 8]
linspace(0, 1, 5): [0.   0.25 0.5  0.75 1.  ]
Zeros:
 [[0. 0. 0.]
 [0. 0. 0.]]
Ones:
 [[1 1]
 [1 1]]
Constant array:
 [[99.9 99.9 99.9]
 [99.9 99.9 99.9]]
Identity Matrix:
 [[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]]
Uniform Random [0,1):
 [[0.37454012 0.95071431]
 [0.73199394 0.59865848]]
Standard Normal (mean=0, std=1):
 [[-0.10128311 -2.23078482]
 [ 0.12289023  0.40486737]]
Random Integers [10, 50):
 [[16 28 32]
 [20 20 33]]
```

---

## Vectorization: Ditching the For-Loop

The core philosophy of NumPy is **vectorization**. Vectorization means applying operations to an entire array at once rather than looping over individual elements. 

In pure Python, if you want to add 5 to every element in a list, you must write a loop:

```python
prices = [10, 20, 30, 40]
new_prices = []
for p in prices:
    new_prices.append(p + 5)
```

In NumPy, you simply write:

```python
import numpy as np
prices = np.array([10, 20, 30, 40])
new_prices = prices + 5
print(new_prices)
```

```text
# Output:
[15 25 35 45]
```

### Under the Hood: SIMD
When you write `prices + 5`, NumPy leverages a CPU technology called **SIMD** (Single Instruction, Multiple Data). Instead of executing one instruction per number, the CPU registers can load multiple numbers at once and execute the addition instruction on all of them in a single clock cycle.

```text
Without SIMD (Looping):
Cycle 1: Load 10  -> Add 5 -> Store 15
Cycle 2: Load 20  -> Add 5 -> Store 25
Cycle 3: Load 30  -> Add 5 -> Store 35
Cycle 4: Load 40  -> Add 5 -> Store 45

With SIMD (Vectorized):
Cycle 1: Load [10, 20, 30, 40] -> Add [5, 5, 5, 5] -> Store [15, 25, 35, 45]
```

### Universal Functions (ufuncs)
NumPy provides vectorized implementations of common mathematical functions, known as **universal functions** or **ufuncs**. These include `np.log`, `np.exp`, `np.sqrt`, `np.sin`, and many more.

```python
import numpy as np

arr = np.array([1, 2, 3, 4])

print("Square root:       ", np.sqrt(arr))
print("Natural Logarithm: ", np.log(arr))
print("Exponential (e^x): ", np.exp(arr))
```

```text
# Output:
Square root:        [1.         1.41421356 1.73205081 2.        ]
Natural Logarithm:  [0.         0.69314718 1.09861229 1.38629436]
Exponential (e^x):  [ 2.71828183  7.3890561  20.08553692 54.59815003]
```

---

## Array Broadcasting

What happens if we try to perform operations on arrays of different shapes? This is where **broadcasting** comes in. Broadcasting is the set of rules NumPy uses to perform arithmetic operations on arrays of different dimensions.

### The Two Rules of Broadcasting
When operating on two arrays, NumPy compares their shapes element-wise, starting from the **rightmost (trailing) dimensions** and working its way left. Two dimensions are compatible if:
1. **They are equal.**
2. **One of them is exactly 1.**

If these conditions are not met, NumPy throws a `ValueError: operands could not be broadcast together`.

Let's look at a step-by-step example. Suppose we want to add a 1D array of shape `(3,)` to a 2D array of shape `(4, 3)`.

```text
Array A (2D): 4 x 3
Array B (1D):     3
```
* Compare trailing dimensions: Array A has 3, Array B has 3. They are equal! (Compatible)
* Compare next dimension: Array A has 4, Array B has no dimension (implicit 1). (Compatible)
* Resulting shape: `(4, 3)`

During this operation, NumPy logically "stretches" Array B along the rows so it matches Array A's shape, copying the values without actually allocating duplicate memory.

```text
Array A (4, 3)            Array B (3,)            Broadcasted addition
┌───┬───┬───┐             ┌───┬───┬───┐           ┌───┬───┬───┐
│ 1 │ 2 │ 3 │             │10 │20 │30 │           │11 │22 │33 │
├───┼───┼───┤             ├───┼───┼───┤           ├───┼───┼───┤
│ 4 │ 5 │ 6 │      +      │10 │20 │30 │     =     │14 │25 │36 │
├───┼───┼───┤             ├───┼───┼───┤           ├───┼───┼───┤
│ 7 │ 8 │ 9 │             │10 │20 │30 │           │17 │28 │39 │
├───┼───┼───┤             ├───┼───┼───┤           ├───┼───┼───┤
│10 │11 │12 │             │10 │20 │30 │           │20 │31 │42 │
└───┴───┴───┘             └───┴───┴───┘           └───┴───┴───┘
```

Let's verify this in code:

```python
import numpy as np

matrix = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12]
])

row_vector = np.array([10, 20, 30])

result = matrix + row_vector
print(result)
```

```text
# Output:
[[11 22 33]
 [14 25 36]
 [17 28 39]
 [20 31 42]]
```

### The Trickier Case: Column Vector Broadcasting
What if we want to add values to columns instead? We have a column vector of shape `(4, 1)` and want to add it to a `(4, 3)` matrix.

```text
Array A (2D): 4 x 3
Array B (2D): 4 x 1
```
* Trailing dimension: Array A has 3, Array B has 1. (Compatible because B's dimension is 1)
* Next dimension: Array A has 4, Array B has 4. (Compatible because they are equal)
* Resulting shape: `(4, 3)`

Let's test this:

```python
col_vector = np.array([[10], [20], [30], [40]])  # Shape (4, 1)
print("Column vector shape:", col_vector.shape)

result_col = matrix + col_vector
print("\nResult of adding column vector:\n", result_col)
```

```text
# Output:
Column vector shape: (4, 1)

Result of adding column vector:
 [[11 12 13]
 [24 25 26]
 [37 38 39]
 [50 51 52]]
```

<div class="interview-tip">
Interviewers love to test you on broadcasting compatibility. Remember the simple rule: Align shapes to the right, and check if each pair of dimensions is equal or contains a 1.
For example, can shape <code>(3, 1, 5)</code> broadcast with shape <code>(2, 5)</code>?
Let's align them:
<code>(3, 1, 5)</code> and <code>(   2, 5)</code>.
Looking right to left:
- 5 and 5: equal (compatible)
- 1 and 2: one of them is 1 (compatible)
- 3 and (implicit 1): one of them is 1 (compatible)
Resulting shape: <code>(3, 2, 5)</code>. Yes, they can broadcast!
</div>

---

## Indexing, Slicing, and Boolean Masking

Extracting, filtering, and updating specific subsets of data is the bread and butter of data analytics. NumPy provides highly expressive ways to index and slice arrays.

### 1D and 2D Slicing
Slicing in NumPy follows the standard Python syntax `[start:stop:step]`, extended to multiple dimensions using commas: `[row_slice, column_slice]`.

```python
import numpy as np

# Monthly revenue data for 3 products across 5 regions
# Rows: Product A, Product B, Product C
# Columns: Region 1, Region 2, Region 3, Region 4, Region 5
revenue = np.array([
    [120, 150, 180, 90,  110],
    [85,  95,  115, 130, 140],
    [210, 240, 250, 270, 300]
])

# Get Region 2 revenue for all products (Column index 1)
print("Region 2 revenue:", revenue[:, 1])

# Get Product C revenue for Regions 3, 4, and 5 (Row index 2, Column indices 2 to 4)
print("Product C (Regions 3-5):", revenue[2, 2:5])

# Get a 2x2 sub-matrix (First two rows, last two columns)
print("Sub-matrix:\n", revenue[0:2, -2:])
```

```text
# Output:
Region 2 revenue: [150  95 240]
Product C (Regions 3-5): [250 270 300]
Sub-matrix:
 [[ 90 110]
 [130 140]]
```

### The Critical Warning: Views vs. Copies
In Python, if you slice a list, you get a new copy of the list. **In NumPy, slicing returns a VIEW of the original array.** If you modify a slice, you will modify the original array!

```python
import numpy as np

original = np.array([1, 2, 3, 4, 5])
slice_view = original[1:4]  # Slicing creates a view
slice_view[0] = 99         # Modify the view

print("Modified slice:", slice_view)
print("Original array:", original)  # The original is modified!
```

```text
# Output:
Modified slice: [99  3  4]
Original array: [ 1 99  3  4  5]
```

This behavior exists to prevent unnecessary memory copying when working with huge datasets. If you explicitly want a copy of the data, you must use the `.copy()` method:

```python
original = np.array([1, 2, 3, 4, 5])
slice_copy = original[1:4].copy()  # Explicit copy
slice_copy[0] = 99

print("Original array (unaffected):", original)
```

```text
# Output:
Original array (unaffected): [1 2 3 4 5]
```

### Advanced Boolean Masking (Logical Filtering)
You can filter arrays by applying conditional statements, which produce a boolean mask. This mask can then be passed back to the array to filter out elements that evaluate to `True`.

```python
import numpy as np

scores = np.array([78, 92, 54, 88, 61, 95, 40, 85])

# Find scores greater than 80
mask = scores > 80
print("Boolean Mask:", mask)
print("Passing scores:", scores[mask])
```

```text
# Output:
Boolean Mask: [False  True False  True False  True False  True]
Passing scores: [92 88 95 85]
```

### Multi-Conditional Filtering (Logical Gates)
To combine multiple filters, you must use bitwise operators:
* `&` for `and`
* `|` for `or`
* `~` for `not`

Additionally, you **must wrap each condition in parentheses** because bitwise operators have higher operator precedence than comparison operators in Python.

```python
# Pass score if it is between 60 and 90
in_range = scores[(scores >= 60) & (scores <= 90)]
print("Scores between 60 and 90:", in_range)

# Flag scores that are either failing (< 50) OR exceptional (> 90)
extreme_scores = scores[(scores < 50) | (scores > 90)]
print("Failing or exceptional scores:", extreme_scores)
```

```text
# Output:
Scores between 60 and 90: [78 88 61 85]
Failing or exceptional scores: [92 95 40]
```

---

## Common Statistical & Mathematical Functions

NumPy has built-in statistical functions that allow you to aggregate datasets over rows or columns.

### Understanding the `axis` Parameter
The `axis` parameter is a common point of confusion for beginners.
* `axis=0` refers to the rows. When performing an aggregation with `axis=0`, you collapse the rows, performing the calculation **column-wise** (vertically).
* `axis=1` refers to the columns. When performing an aggregation with `axis=1`, you collapse the columns, performing the calculation **row-wise** (horizontally).

```text
        axis = 1 (horizontal) --->
          Col 0  Col 1  Col 2  Col 3
Row 0:  [  10,    20,    30,    40  ]  ===> Mean = 25.0
Row 1:  [  50,    60,    70,    80  ]  ===> Mean = 65.0
          ||     ||     ||     ||
          \/     \/     \/     \/
Mean:    30.0   40.0   50.0   60.0    <=== axis = 0 (vertical)
```

Let's run this in Python:

```python
import numpy as np

data = np.array([
    [10, 20, 30, 40],
    [50, 60, 70, 80]
])

print("Overall mean:          ", np.mean(data))
print("Column-wise mean (axis=0):", np.mean(data, axis=0))
print("Row-wise mean (axis=1):   ", np.mean(data, axis=1))
```

```text
# Output:
Overall mean:           45.0
Column-wise mean (axis=0): [30. 40. 50. 60.]
Row-wise mean (axis=1):    [25. 65.]
```

### Conditional Updates with `np.where`
The `np.where(condition, value_if_true, value_if_false)` function is a vectorized ternary operator. It is incredibly useful for label encoding and binning tasks.

```python
import numpy as np

salaries = np.array([45000, 120000, 85000, 38000, 150000])

# Classify as "High" if salary > 90,000, else "Standard"
classes = np.where(salaries > 90000, "High", "Standard")
print(classes)

# Increase salaries under 50,000 by 10%, leave others unchanged
adjusted_salaries = np.where(salaries < 50000, salaries * 1.10, salaries)
print(adjusted_salaries)
```

```text
# Output:
['Standard' 'High' 'Standard' 'Standard' 'High']
[ 49500. 120000.  85000.  41800. 150000.]
```

---

## Edge Cases, Gotchas, and Best Practices

### 1. Integer Division vs. Float Division
In Python 3 and NumPy, `/` always performs float division. If you want integer (floor) division, you must use `//`.

```python
import numpy as np
a = np.array([5, 10, 15])
print("Division (/): ", a / 2)
print("Floor division (//):", a // 2)
```

```text
# Output:
Division (/):  [2.5 5.  7.5]
Floor division (//): [2 5 7]
```

### 2. NaN (Not a Number) Calculations
If your array contains missing data represented by `np.nan` (which is technically a floating-point value), standard aggregate functions will fail and return `nan`. You must use the `nan`-safe alternatives:

```python
import numpy as np

ratings = np.array([4.5, 3.8, np.nan, 5.0, 4.2])

# Standard mean fails
print("Standard mean:", np.mean(ratings))

# NaN-safe mean succeeds
print("NaN-safe mean:", np.nanmean(ratings))
```

```text
# Output:
Standard mean: nan
NaN-safe mean: 4.375
```

### 3. Matrix Multiplication: Element-wise vs. Dot Product
* The `*` operator performs **element-wise multiplication** (Hadamard product).
* The `@` operator (or `np.dot()`) performs **matrix multiplication** (dot product) from linear algebra.

```python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("Element-wise multiplication:\n", A * B)
print("Matrix multiplication:\n", A @ B)
```

```text
# Output:
Element-wise multiplication:
 [[ 5 12]
 [21 32]]
Matrix multiplication:
 [[19 22]
 [43 50]]
```

---

## Practice Exercises

### Exercise 1: Z-score Normalization (Standardization)
In machine learning, features are often standardized so they have a mean of 0 and a standard deviation of 1.
$$\text{Z-score} = \frac{X - \mu}{\sigma}$$
Given the following array of house prices, write a vectorized script to calculate their Z-scores.

```python
import numpy as np

prices = np.array([250000, 310000, 450000, 190000, 890000, 370000])

# Write your solution here
mean = np.mean(prices)
std = np.std(prices)
z_scores = (prices - mean) / std

print("Mean:", round(mean, 2))
print("Standard Dev:", round(std, 2))
print("Z-Scores:\n", z_scores)
```

```text
# Output:
Mean: 410000.0
Standard Dev: 227742.54
Z-Scores:
 [-0.7025477  -0.43909231  0.17563692 -0.96600309  2.10764309 -0.17563692]
```

### Exercise 2: Sensor Calibration & Outlier Detection
You have a 2D array representing hourly temperature readings from 3 distinct sensors over 24 hours.
1. The sensors have a calibration offset: Sensor 1 reads 0.5 degrees too high, Sensor 2 is correct, Sensor 3 reads 0.8 degrees too low. Adjust the matrix using broadcasting.
2. Find all corrected readings that are outliers (defined as readings greater than 35 degrees). Replace outliers with the sensor's mean temperature.

```python
import numpy as np

# Seed for reproducibility
np.random.seed(10)
temperatures = np.random.uniform(20.0, 38.0, size=(3, 24))

# 1. Calibration offsets (Sensor 1: -0.5, Sensor 2: 0, Sensor 3: +0.8)
offsets = np.array([[-0.5], [0.0], [0.8]])
calibrated = temperatures + offsets

# 2. Find outliers (> 35) and replace with sensor mean
sensor_means = np.mean(calibrated, axis=1, keepdims=True)  # keepdims prevents shape collapse to (3,)
outliers = calibrated > 35.0

# Create updated copy
cleaned_temps = np.where(outliers, sensor_means, calibrated)

print("Original shape:", temperatures.shape)
print("Offsets shape:", offsets.shape)
print("Number of outliers detected:", np.sum(outliers))
```

```text
# Output:
Original shape: (3, 24)
Offsets shape: (3, 1)
Number of outliers detected: 14
```

---

## Section Recaps

* **NumPy arrays vs. Python lists**: Arrays are stored in contiguous memory blocks with homogeneous types, eliminating lookup overhead and leveraging CPU cache locality.
* **Vectorization**: Performing array-wide mathematical operations without writing explicit loops, using underlying C code and SIMD processor features.
* **Broadcasting rules**: Trailing dimensions are compared right-to-left. Dimensions are compatible if they are equal or if one of them is 1.
* **Views vs. Copies**: Slicing an array creates a memory view. Modifying a view changes the original array unless you explicitly invoke `.copy()`.
* **The Axis Parameter**: `axis=0` aggregates vertically down the rows (column-wise). `axis=1` aggregates horizontally across the columns (row-wise).

---

## Common Interview Questions

### Q1: What is the difference between a view and a copy in NumPy, and why does this distinction exist?
**Answer:**
A **view** is a new array object that points to the exact same memory buffer as the original array. Modifying elements in a view directly alters the original array's elements. A view is returned when you slice an array (e.g., `arr[1:5]`). 

A **copy** is a complete duplication of the data into a brand-new memory buffer. Modifying a copy has no impact on the original array. A copy is created using the `.copy()` method or during advanced integer/boolean indexing.

This distinction exists for memory efficiency. By defaulting to views for slices, NumPy avoids allocating memory and copying large blocks of data when you are examining smaller parts of a massive dataset.

---

### Q2: What is "broadcasting" in NumPy, and what are the two main conditions that must be met for broadcasting to occur?
**Answer:**
Broadcasting is NumPy's capability to perform arithmetic operations on arrays of different shapes. It "stretches" the smaller array across the larger array's dimensions to perform element-wise calculations without copying data.

For broadcasting to be valid, NumPy compares dimensions element-wise starting from the rightmost (trailing) dimension:
1. **The dimensions must be equal**, OR
2. **One of the dimensions must be exactly 1**.

If neither condition is met for any compared dimension, NumPy raises a `ValueError`.

---

### Q3: Explain why NumPy is dramatically faster than standard Python lists for numeric computations. Refer to memory layout and execution model.
**Answer:**
NumPy's performance advantage boils down to three architectural differences:
1. **Contiguous Memory:** NumPy arrays store elements sequentially in one block of memory. Standard Python lists store pointers to objects scattered across memory. Contiguous storage enables the CPU to utilize cache locality and pre-fetch data.
2. **Homogeneous Data Types:** Every element in a NumPy array is of the same type. This allows NumPy to bypass runtime type-checking and lookup overhead during iterations.
3. **Compiled C Implementation:** Operations are executed in pre-compiled C routines. This allows NumPy to bypass the slow Python interpreter loop and leverage hardware optimizations like SIMD (Single Instruction Multiple Data) to process multiple numbers in a single clock cycle.

---

### Q4: If you have a 2D array representing user ratings (rows = users, columns = movies), how do you calculate the average rating for each user, ignoring missing ratings (NaNs)? Write the code snippet.
**Answer:**
To calculate the average rating for each user (row-wise), you aggregate along `axis=1`. Because there are missing values (`NaN`), you must use the `nan`-safe aggregation function `np.nanmean()`.

```python
import numpy as np

ratings = np.array([
    [4.0, 3.5, np.nan, 5.0],
    [np.nan, 2.0, 3.0, np.nan],
    [5.0, 5.0, 4.8, 5.0]
])

# Aggregate horizontally across columns
user_averages = np.nanmean(ratings, axis=1)
print(user_averages)
```
```text
# Output:
[4.16666667 2.5        4.95      ]
```

---

### Q5: What is the difference between `arr * arr` and `np.dot(arr, arr)` (or `arr @ arr`) for a 2D square matrix?
**Answer:**
* The `*` operator performs **element-wise multiplication** (also called the Hadamard product). The value at position `(i, j)` in the result is the product of elements at `(i, j)` in the inputs. Both arrays must be broadcastable to the same shape.
* The `@` operator (and the `np.dot()` function) performs formal **matrix multiplication** (dot product) from linear algebra. The value at position `(i, j)` is the dot product of row `i` of the first matrix and column `j` of the second matrix. The number of columns in the first matrix must match the number of rows in the second matrix.
