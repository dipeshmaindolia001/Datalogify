  // NUMPY CHALLENGES — 50 questions across 6 tiers

  // ==========================================
  // TIER 1 — Array Creation & Basics (Q1–8)
  // ==========================================
  {
    id: 'py-numpy-1',
    title: 'Creating Arrays from Lists',
    slug: 'creating-arrays-from-lists',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 91,
    description: 'Convert a Python list `[1, 2, 3, 4, 5]` into a 1-D NumPy array and a nested list `[[1,2,3],[4,5,6],[7,8,9]]` into a 2-D array using `np.array()`. Print the 1-D array space-separated on the first line, then print each row of the 2-D array space-separated on subsequent lines.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '1-D array on line 1, then one row per line for the 2-D array.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Create 1D and 2D arrays and print them
`,
    testCases: [{ input: 'run', expectedOutput: '1 2 3 4 5\n1 2 3\n4 5 6\n7 8 9', isExample: true }]
  },
  {
    id: 'py-numpy-2',
    title: 'Zeros, Ones, and Full',
    slug: 'zeros-ones-and-full',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 92,
    description: 'Create a 3×3 zero matrix with `np.zeros`, a 2×4 ones matrix with `np.ones`, and a 3×3 matrix filled with 7 using `np.full`. Print each matrix\'s shape on a separate line.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Three lines, each showing a shape tuple.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Create zero, ones, and full matrices and print their shapes
`,
    testCases: [{ input: 'run', expectedOutput: '(3, 3)\n(2, 4)\n(3, 3)', isExample: true }]
  },
  {
    id: 'py-numpy-3',
    title: 'arange and linspace',
    slug: 'arange-and-linspace',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 93,
    description: 'Use `np.arange` to generate numbers from 0 to 20 (inclusive) in steps of 2, and `np.linspace` to generate 10 evenly spaced points between 0 and 1. Print the arange result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'The arange array, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Generate arange and linspace arrays, print arange result
`,
    testCases: [{ input: 'run', expectedOutput: '0 2 4 6 8 10 12 14 16 18 20', isExample: true }]
  },
  {
    id: 'py-numpy-4',
    title: 'Array Data Types',
    slug: 'array-data-types',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 94,
    description: 'Create an integer array `[1, 2, 3]` and a float array `[1.5, 2.5, 3.5]` using `np.array()`. Print both arrays\' `dtype` on separate lines.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Two lines, each showing a dtype.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Create int and float arrays and print their dtypes
`,
    testCases: [{ input: 'run', expectedOutput: 'int32\nfloat64', isExample: true }]
  },
  {
    id: 'py-numpy-5',
    title: 'Identity and Eye Matrices',
    slug: 'identity-and-eye-matrices',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 95,
    description: 'Create a 4×4 identity matrix using `np.eye(4)`. Extract the diagonal values and print them space-separated as integers.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Diagonal values space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Create 4x4 identity matrix and print diagonal values
`,
    testCases: [{ input: 'run', expectedOutput: '1 1 1 1', isExample: true }]
  },
  {
    id: 'py-numpy-6',
    title: 'Seeded Random Arrays',
    slug: 'seeded-random-arrays',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 96,
    description: 'Set the random seed to 42 using `np.random.seed(42)`. Generate a 3×3 array of random integers between 1 and 100 (inclusive) using `np.random.randint(1, 101, size=(3,3))`. Print the first row space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'First row of the random matrix, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Set seed and generate random array, print first row
`,
    testCases: [{ input: 'run', expectedOutput: '52 93 15', isExample: true }]
  },
  {
    id: 'py-numpy-7',
    title: 'Shape, Size, Ndim',
    slug: 'shape-size-ndim',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 97,
    description: 'For the array `np.array([[1,2,3],[4,5,6]])`, print its `shape`, `size`, and `ndim` each on a separate line.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Three lines: shape tuple, size integer, ndim integer.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([[1, 2, 3], [4, 5, 6]])
# Print shape, size, and ndim
`,
    testCases: [{ input: 'run', expectedOutput: '(2, 3)\n6\n2', isExample: true }]
  },
  {
    id: 'py-numpy-8',
    title: 'Copy vs View',
    slug: 'copy-vs-view',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 98,
    description: 'Create array `[10, 20, 30, 40, 50]`. Take a slice `arr[1:4]` and set its first element to 999. This mutates the original array because slices are views. Print the original array space-separated to observe the mutation.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'The mutated original array, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([10, 20, 30, 40, 50])
# Create a slice, modify it, print original array
`,
    testCases: [{ input: 'run', expectedOutput: '10 999 30 40 50', isExample: true }]
  },

  // ==========================================
  // TIER 2 — Indexing & Slicing (Q9–16)
  // ==========================================
  {
    id: 'py-numpy-9',
    title: 'Basic 1D Indexing and Slicing',
    slug: 'basic-1d-indexing-and-slicing',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 99,
    description: 'Create array `[10, 20, 30, 40, 50, 60, 70]`. Print the first 3 elements space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'First 3 elements, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([10, 20, 30, 40, 50, 60, 70])
# Print first 3 elements
`,
    testCases: [{ input: 'run', expectedOutput: '10 20 30', isExample: true }]
  },
  {
    id: 'py-numpy-10',
    title: '2D Array Indexing',
    slug: '2d-array-indexing',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 100,
    description: 'Create matrix `[[1,2,3],[4,5,6],[7,8,9]]`. Print the element at row 1, column 2.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'A single integer.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
# Print element at row 1, col 2
`,
    testCases: [{ input: 'run', expectedOutput: '6', isExample: true }]
  },
  {
    id: 'py-numpy-11',
    title: 'Negative Indexing',
    slug: 'negative-indexing',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 101,
    description: 'Create array `[[10,20,30],[40,50,60],[70,80,90]]`. Use negative indexing to access the last row and print it space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Last row, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([[10, 20, 30], [40, 50, 60], [70, 80, 90]])
# Print last row using negative indexing
`,
    testCases: [{ input: 'run', expectedOutput: '70 80 90', isExample: true }]
  },
  {
    id: 'py-numpy-12',
    title: 'Step Slicing',
    slug: 'step-slicing',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 102,
    description: 'Create array `[1, 2, 3, 4, 5, 6, 7, 8]`. Print every 2nd element (step slicing with `::2`) space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Every other element, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8])
# Print every 2nd element
`,
    testCases: [{ input: 'run', expectedOutput: '1 3 5 7', isExample: true }]
  },
  {
    id: 'py-numpy-13',
    title: 'Boolean Masking',
    slug: 'boolean-masking',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 103,
    description: 'Create array `[15, 3, 22, 8, 41, 7, 18]`. Use boolean masking to extract all values greater than 10 and print them space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Filtered values, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([15, 3, 22, 8, 41, 7, 18])
# Use boolean masking to filter values > 10
`,
    testCases: [{ input: 'run', expectedOutput: '15 22 41 18', isExample: true }]
  },
  {
    id: 'py-numpy-14',
    title: 'Fancy Indexing',
    slug: 'fancy-indexing',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 104,
    description: 'Create array `[100, 200, 300, 400, 500]`. Use fancy indexing with indices `[0, 2, 4]` to extract elements. Print the extracted values space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Extracted elements, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([100, 200, 300, 400, 500])
# Use fancy indexing with [0, 2, 4]
`,
    testCases: [{ input: 'run', expectedOutput: '100 300 500', isExample: true }]
  },
  {
    id: 'py-numpy-15',
    title: 'Conditional Replacement',
    slug: 'conditional-replacement',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 105,
    description: 'Create array `[-5, 3, -2, 8, -1, 6]`. Use `np.where` to replace all negative values with 0, keeping positive values unchanged. Print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Modified array, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([-5, 3, -2, 8, -1, 6])
# Replace negatives with 0 using np.where
`,
    testCases: [{ input: 'run', expectedOutput: '0 3 0 8 0 6', isExample: true }]
  },
  {
    id: 'py-numpy-16',
    title: 'Multi-Condition Filtering',
    slug: 'multi-condition-filtering',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 106,
    description: 'Create array `[5, 12, 3, 18, 7, 20, 14, 9]`. Extract elements that are both greater than 10 AND even using `&` operator. Print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Filtered elements, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([5, 12, 3, 18, 7, 20, 14, 9])
# Filter elements > 10 and even
`,
    testCases: [{ input: 'run', expectedOutput: '12 18 20 14', isExample: true }]
  },

  // ==========================================
  // TIER 3 — Operations & Broadcasting (Q17–24)
  // ==========================================
  {
    id: 'py-numpy-17',
    title: 'Element-wise Arithmetic',
    slug: 'element-wise-arithmetic',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 107,
    description: 'Create arrays `[10, 20, 30]` and `[1, 2, 3]`. Compute their element-wise product and print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Element-wise product, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([10, 20, 30])
b = np.array([1, 2, 3])
# Compute and print element-wise product
`,
    testCases: [{ input: 'run', expectedOutput: '10 40 90', isExample: true }]
  },
  {
    id: 'py-numpy-18',
    title: 'Broadcasting Basics',
    slug: 'broadcasting-basics',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 108,
    description: 'Create matrix `[[10,20,30],[40,50,60]]` and vector `[1,2,3]`. Add the vector to each row of the matrix using broadcasting. Print the result, one row per line, space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Result matrix, one row per line.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[10, 20, 30], [40, 50, 60]])
vector = np.array([1, 2, 3])
# Add vector to matrix and print rows
`,
    testCases: [{ input: 'run', expectedOutput: '11 22 33\n41 52 63', isExample: true }]
  },
  {
    id: 'py-numpy-19',
    title: 'Broadcasting Edge Case',
    slug: 'broadcasting-edge-case',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 109,
    description: 'Create a column vector `[[1],[2],[3]]` (shape 3×1) and a row vector `[[10,20]]` (shape 1×2). Add them together using broadcasting. Print the shape of the result.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Shape tuple of the result.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
col = np.array([[1], [2], [3]])
row = np.array([[10, 20]])
# Add and print result shape
`,
    testCases: [{ input: 'run', expectedOutput: '(3, 2)', isExample: true }]
  },
  {
    id: 'py-numpy-20',
    title: 'Universal Functions',
    slug: 'universal-functions',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 110,
    description: 'Create array `[1.0, 4.0, 9.0, 16.0]`. Apply `np.sqrt` and print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Square roots, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1.0, 4.0, 9.0, 16.0])
# Apply np.sqrt and print
`,
    testCases: [{ input: 'run', expectedOutput: '1.0 2.0 3.0 4.0', isExample: true }]
  },
  {
    id: 'py-numpy-21',
    title: 'Comparison Operators on Arrays',
    slug: 'comparison-operators-on-arrays',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 111,
    description: 'Create arrays `[1, 5, 3, 7]` and `[2, 4, 6, 1]`. Compute the element-wise greater-than comparison (`a > b`) and print the boolean result array.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Boolean array as printed by NumPy.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([1, 5, 3, 7])
b = np.array([2, 4, 6, 1])
# Print element-wise a > b
`,
    testCases: [{ input: 'run', expectedOutput: '[False  True False  True]', isExample: true }]
  },
  {
    id: 'py-numpy-22',
    title: 'Clipping Values',
    slug: 'clipping-values',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 112,
    description: 'Create array `[-10, 5, 150, 42, 200, -3, 75]`. Use `np.clip` to restrict all values to the range [0, 100]. Print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Clipped values, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([-10, 5, 150, 42, 200, -3, 75])
# Clip to [0, 100] and print
`,
    testCases: [{ input: 'run', expectedOutput: '0 5 100 42 100 0 75', isExample: true }]
  },
  {
    id: 'py-numpy-23',
    title: 'Rounding Functions',
    slug: 'rounding-functions',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 113,
    description: 'Create array `[1.2, 2.5, 3.7, -1.3]`. Apply `np.floor` and print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Floor values, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1.2, 2.5, 3.7, -1.3])
# Apply np.floor and print
`,
    testCases: [{ input: 'run', expectedOutput: '1.0 2.0 3.0 -2.0', isExample: true }]
  },
  {
    id: 'py-numpy-24',
    title: 'In-place vs New-array Operations',
    slug: 'in-place-vs-new-array-operations',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 114,
    description: 'Create `arr = np.array([1, 2, 3])`. Store `id(arr)` before and after performing `arr = arr + 1`. Since `arr + 1` creates a new array, the ids will differ. Print `Different` if the ids differ, or `Same` if they are the same.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`Different` or `Same`.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1, 2, 3])
# Compare ids before and after arr = arr + 1
`,
    testCases: [{ input: 'run', expectedOutput: 'Different', isExample: true }]
  },

  // ==========================================
  // TIER 4 — Aggregation & Statistics (Q25–32)
  // ==========================================
  {
    id: 'py-numpy-25',
    title: 'Sum, Mean, Std, Var',
    slug: 'sum-mean-std-var',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 115,
    description: 'Create array `[10, 20, 30, 40, 50]`. Compute and print the mean.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'The mean value.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([10, 20, 30, 40, 50])
# Print the mean
`,
    testCases: [{ input: 'run', expectedOutput: '30.0', isExample: true }]
  },
  {
    id: 'py-numpy-26',
    title: 'Axis-wise Aggregation',
    slug: 'axis-wise-aggregation',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 116,
    description: 'Create matrix `[[1,2],[3,4],[5,6]]`. Compute the column sums using `axis=0` and print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Column sums, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[1, 2], [3, 4], [5, 6]])
# Print column sums (axis=0)
`,
    testCases: [{ input: 'run', expectedOutput: '9 12', isExample: true }]
  },
  {
    id: 'py-numpy-27',
    title: 'argmin and argmax',
    slug: 'argmin-and-argmax',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 117,
    description: 'Create array `[23, 45, 12, 67, 34]`. Use `np.argmax` to find the index of the maximum value and print it.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Index of the maximum value.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([23, 45, 12, 67, 34])
# Print index of max value
`,
    testCases: [{ input: 'run', expectedOutput: '3', isExample: true }]
  },
  {
    id: 'py-numpy-28',
    title: 'Cumulative Sum and Product',
    slug: 'cumulative-sum-and-product',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 118,
    description: 'Create array `[1, 2, 3, 4, 5]`. Compute the cumulative sum using `np.cumsum` and print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Cumulative sum, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1, 2, 3, 4, 5])
# Print cumulative sum
`,
    testCases: [{ input: 'run', expectedOutput: '1 3 6 10 15', isExample: true }]
  },
  {
    id: 'py-numpy-29',
    title: 'Percentiles and Median',
    slug: 'percentiles-and-median',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 119,
    description: 'Create array `[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`. Compute and print the median using `np.median`.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'The median value.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
# Print the median
`,
    testCases: [{ input: 'run', expectedOutput: '55.0', isExample: true }]
  },
  {
    id: 'py-numpy-30',
    title: 'Correlation Coefficient',
    slug: 'correlation-coefficient',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 120,
    description: 'Create arrays `[1, 2, 3, 4, 5]` and `[2, 4, 6, 8, 10]`. Compute the Pearson correlation coefficient using `np.corrcoef` and print it rounded to 2 decimal places. Extract the coefficient from position `[0, 1]` of the correlation matrix.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Correlation coefficient rounded to 2 decimals.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
x = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 6, 8, 10])
# Compute and print correlation coefficient
`,
    testCases: [{ input: 'run', expectedOutput: '1.0', isExample: true }]
  },
  {
    id: 'py-numpy-31',
    title: 'Histogram Computation',
    slug: 'histogram-computation',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 121,
    description: 'Create array `[1, 2, 2, 3, 3, 3, 4, 4, 5]`. Compute a histogram with 5 bins using `np.histogram`. Print the bin counts space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Bin counts, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1, 2, 2, 3, 3, 3, 4, 4, 5])
# Compute histogram with 5 bins and print counts
`,
    testCases: [{ input: 'run', expectedOutput: '1 2 3 2 1', isExample: true }]
  },
  {
    id: 'py-numpy-32',
    title: 'Weighted Average',
    slug: 'weighted-average',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 122,
    description: 'Create values `[80, 90, 70, 100]` and weights `[0.1, 0.3, 0.2, 0.4]`. Compute and print the weighted average using `np.average`.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Weighted average value.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
values = np.array([80, 90, 70, 100])
weights = np.array([0.1, 0.3, 0.2, 0.4])
# Print weighted average
`,
    testCases: [{ input: 'run', expectedOutput: '89.0', isExample: true }]
  },

  // ==========================================
  // TIER 5 — Reshaping, Stacking & Sorting (Q33–40)
  // ==========================================
  {
    id: 'py-numpy-33',
    title: 'Reshape and Flatten',
    slug: 'reshape-and-flatten',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 123,
    description: 'Create array `[1, 2, 3, 4, 5, 6]`. Reshape it to shape `(2, 3)` and print the shape.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Shape tuple.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1, 2, 3, 4, 5, 6])
# Reshape to (2, 3) and print shape
`,
    testCases: [{ input: 'run', expectedOutput: '(2, 3)', isExample: true }]
  },
  {
    id: 'py-numpy-34',
    title: 'Transpose',
    slug: 'transpose',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 124,
    description: 'Create matrix `[[1,2,3],[4,5,6]]`. Transpose it using `.T` and print the shape of the transposed matrix.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Shape tuple of the transposed matrix.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[1, 2, 3], [4, 5, 6]])
# Transpose and print shape
`,
    testCases: [{ input: 'run', expectedOutput: '(3, 2)', isExample: true }]
  },
  {
    id: 'py-numpy-35',
    title: 'Vertical and Horizontal Stacking',
    slug: 'vertical-and-horizontal-stacking',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 125,
    description: 'Create arrays `[1, 2, 3]` and `[4, 5, 6]`. Use `np.vstack` to stack them vertically. Print the shape of the result.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Shape tuple.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
# Vstack and print shape
`,
    testCases: [{ input: 'run', expectedOutput: '(2, 3)', isExample: true }]
  },
  {
    id: 'py-numpy-36',
    title: 'Splitting Arrays',
    slug: 'splitting-arrays',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 126,
    description: 'Create array `[10, 20, 30, 40, 50, 60]`. Split it into 3 equal chunks using `np.array_split`. Print the first chunk space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'First chunk, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([10, 20, 30, 40, 50, 60])
# Split into 3 chunks and print first chunk
`,
    testCases: [{ input: 'run', expectedOutput: '10 20', isExample: true }]
  },
  {
    id: 'py-numpy-37',
    title: 'Concatenate Along an Axis',
    slug: 'concatenate-along-an-axis',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 127,
    description: 'Create two 2×2 arrays `[[1,2],[3,4]]` and `[[5,6],[7,8]]`. Concatenate them along `axis=0` using `np.concatenate`. Print the shape of the result.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Shape tuple.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
# Concatenate along axis=0 and print shape
`,
    testCases: [{ input: 'run', expectedOutput: '(4, 2)', isExample: true }]
  },
  {
    id: 'py-numpy-38',
    title: 'Sorting Arrays',
    slug: 'sorting-arrays',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 128,
    description: 'Create array `[30, 10, 50, 20, 40]`. Sort it using `np.sort` and print the sorted array space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Sorted array, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([30, 10, 50, 20, 40])
# Sort and print
`,
    testCases: [{ input: 'run', expectedOutput: '10 20 30 40 50', isExample: true }]
  },
  {
    id: 'py-numpy-39',
    title: 'Unique Values and Counts',
    slug: 'unique-values-and-counts',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 129,
    description: 'Create array `[3, 1, 2, 3, 1, 3, 2, 1, 1]`. Use `np.unique` to find unique values and print them space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Unique values, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([3, 1, 2, 3, 1, 3, 2, 1, 1])
# Find and print unique values
`,
    testCases: [{ input: 'run', expectedOutput: '1 2 3', isExample: true }]
  },
  {
    id: 'py-numpy-40',
    title: 'Set Operations on Arrays',
    slug: 'set-operations-on-arrays',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 130,
    description: 'Create arrays `[1, 2, 3, 4, 5]` and `[3, 4, 5, 6, 7]`. Use `np.intersect1d` to find common elements. Print the intersection space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Intersection elements, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([1, 2, 3, 4, 5])
b = np.array([3, 4, 5, 6, 7])
# Find and print intersection
`,
    testCases: [{ input: 'run', expectedOutput: '3 4 5', isExample: true }]
  },

  // ==========================================
  // TIER 6 — Advanced, Linear Algebra & Real-World (Q41–50)
  // ==========================================
  {
    id: 'py-numpy-41',
    title: 'Matrix Multiplication',
    slug: 'matrix-multiplication',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 131,
    description: 'Create matrices `[[1,2],[3,4]]` and `[[2,0],[1,2]]`. Compute the matrix product using `np.dot` or the `@` operator. Print the result, one row per line, space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Result matrix rows.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([[1, 2], [3, 4]])
b = np.array([[2, 0], [1, 2]])
# Matrix multiply and print rows
`,
    testCases: [{ input: 'run', expectedOutput: '4 4\n10 8', isExample: true }]
  },
  {
    id: 'py-numpy-42',
    title: 'Matrix Inverse',
    slug: 'matrix-inverse',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 132,
    description: 'Create matrix `[[1,2],[3,4]]`. Compute its inverse using `np.linalg.inv`. Print the first row with values rounded to 2 decimal places, space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'First row of inverse matrix, rounded to 2 decimals.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[1, 2], [3, 4]], dtype=float)
# Compute inverse and print first row rounded to 2 decimals
`,
    testCases: [{ input: 'run', expectedOutput: '-2.0 1.0', isExample: true }]
  },
  {
    id: 'py-numpy-43',
    title: 'Determinant and Rank',
    slug: 'determinant-and-rank',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 133,
    description: 'Create matrix `[[1,2],[3,4]]`. Compute the determinant using `np.linalg.det` and print it rounded to 1 decimal place.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Determinant rounded to 1 decimal.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[1, 2], [3, 4]], dtype=float)
# Compute and print determinant rounded to 1 decimal
`,
    testCases: [{ input: 'run', expectedOutput: '-2.0', isExample: true }]
  },
  {
    id: 'py-numpy-44',
    title: 'Solving Linear Equations',
    slug: 'solving-linear-equations',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 134,
    description: 'Solve the system of linear equations: `2x + y = 5` and `x + 3y = 10` using `np.linalg.solve`. Print x and y space-separated, rounded to 2 decimal places.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'x and y values, space-separated, rounded to 2 decimals.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Define coefficient matrix and constants vector
# Solve and print x and y
`,
    testCases: [{ input: 'run', expectedOutput: '1.0 3.0', isExample: true }]
  },
  {
    id: 'py-numpy-45',
    title: 'Eigenvalues and Eigenvectors',
    slug: 'eigenvalues-and-eigenvectors',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 135,
    description: 'Create matrix `[[4,2],[1,3]]`. Compute eigenvalues using `np.linalg.eig`. Print the eigenvalues sorted in descending order, space-separated, rounded to 1 decimal place.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Eigenvalues in descending order, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[4, 2], [1, 3]], dtype=float)
# Compute eigenvalues and print sorted descending
`,
    testCases: [{ input: 'run', expectedOutput: '5.0 2.0', isExample: true }]
  },
  {
    id: 'py-numpy-46',
    title: 'Handling NaN Values',
    slug: 'handling-nan-values',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 136,
    description: 'Create array `[1.0, np.nan, 3.0, np.nan, 5.0]`. Compute the mean of non-NaN values using `np.nanmean` and print it.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'The nanmean value.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1.0, np.nan, 3.0, np.nan, 5.0])
# Print nanmean
`,
    testCases: [{ input: 'run', expectedOutput: '3.0', isExample: true }]
  },
  {
    id: 'py-numpy-47',
    title: 'Vectorization vs Loops',
    slug: 'vectorization-vs-loops',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 137,
    description: 'Create array `[1, 2, 3, 4, 5]`. Use vectorized operations (not loops) to compute the squares of each element. Print the result space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Squared values, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1, 2, 3, 4, 5])
# Compute squares using vectorization and print
`,
    testCases: [{ input: 'run', expectedOutput: '1 4 9 16 25', isExample: true }]
  },
  {
    id: 'py-numpy-48',
    title: 'Meshgrid for Coordinate Grids',
    slug: 'meshgrid-for-coordinate-grids',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 138,
    description: 'Create a meshgrid from x-values `[0, 1, 2]` and y-values `[0, 1]` using `np.meshgrid`. Print the shape of the X grid.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Shape tuple of the X grid.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
x = np.array([0, 1, 2])
y = np.array([0, 1])
# Create meshgrid and print X shape
`,
    testCases: [{ input: 'run', expectedOutput: '(2, 3)', isExample: true }]
  },
  {
    id: 'py-numpy-49',
    title: 'Saving and Loading Arrays',
    slug: 'saving-and-loading-arrays',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 139,
    description: 'Create array `[10, 20, 30]`. Save it to a file using `np.save`, then load it back using `np.load`. Print the loaded array space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Loaded array, space-separated.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([10, 20, 30])
# Save to file, load back, and print
`,
    testCases: [{ input: 'run', expectedOutput: '10 20 30', isExample: true }]
  },
  {
    id: 'py-numpy-50',
    title: 'Normalizing a Dataset',
    slug: 'normalizing-a-dataset',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 140,
    description: 'Create array `[10, 20, 30, 40, 50]` as floats. Apply min-max normalization: `(x - min) / (max - min)`. Print the normalized values space-separated, rounded to 2 decimal places.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Normalized values, space-separated, rounded to 2 decimals.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([10, 20, 30, 40, 50], dtype=float)
# Apply min-max normalization and print rounded to 2 decimals
`,
    testCases: [{ input: 'run', expectedOutput: '0.0 0.25 0.5 0.75 1.0', isExample: true }]
  },
