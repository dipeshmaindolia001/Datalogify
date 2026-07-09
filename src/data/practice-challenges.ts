export interface TestCase {
  input: string;
  expectedOutput: string;
  isExample?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: 'python';
  section: 'basics' | 'libraries' | 'algorithms';
  subCategory?: 'numpy' | 'pandas' | 'matplotlib' | 'seaborn';
  order: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  starterCode: string;
  testCases: TestCase[];
}

export const challenges: Challenge[] = [
  // ==========================================
  // SECTION 1: 🌱 LANGUAGE FOUNDATIONS (BASICS)
  // ==========================================
  {
    id: 'py-basics-1',
    title: 'Say Hello, Python',
    slug: 'say-hello-python',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 1,
    description: 'Read a name from stdin and print a custom greeting in the format `Hello, <name>!`.',
    inputFormat: 'A single line containing a name.',
    outputFormat: 'Print `Hello, <name>!`.',
    constraints: 'Name length between 1 and 100.',
    starterCode: `name = input()
print(f"Hello, {name}!")
`,
    testCases: [{ input: 'Alice', expectedOutput: 'Hello, Alice!', isExample: true }]
  },
  {
    id: 'py-basics-2',
    title: 'Even or Odd Number',
    slug: 'even-or-odd-number',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 2,
    description: 'Given an integer `n`, print `Even` if the number is even, else print `Odd`.',
    inputFormat: 'An integer `n`.',
    outputFormat: '`Even` or `Odd`.',
    constraints: '-10^9 <= n <= 10^9',
    starterCode: `n = int(input())
# Write logic below
`,
    testCases: [{ input: '4', expectedOutput: 'Even', isExample: true }, { input: '7', expectedOutput: 'Odd' }]
  },
  {
    id: 'py-basics-3',
    title: 'Leap Year Calculator',
    slug: 'leap-year-calculator',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 3,
    description: 'Check if a given year is a leap year. Print `True` if it is, else `False`. Leap year is divisible by 4, except end-of-century years which must also be divisible by 400.',
    inputFormat: 'Integer year.',
    outputFormat: '`True` or `False`.',
    constraints: '1000 <= year <= 9999',
    starterCode: `year = int(input())
# Write logic below
`,
    testCases: [{ input: '2024', expectedOutput: 'True', isExample: true }, { input: '1900', expectedOutput: 'False' }]
  },
  {
    id: 'py-basics-4',
    title: 'The Classic FizzBuzz',
    slug: 'classic-fizzbuzz',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 4,
    description: 'Print integers from 1 to `n` on new lines. Print `Fizz` if divisible by 3, `Buzz` if divisible by 5, `FizzBuzz` if divisible by both, else the number itself.',
    inputFormat: 'Integer n.',
    outputFormat: 'FizzBuzz output.',
    constraints: '1 <= n <= 50',
    starterCode: `n = int(input())
# Write loop below
`,
    testCases: [{ input: '5', expectedOutput: '1\n2\nFizz\n4\nBuzz', isExample: true }]
  },
  {
    id: 'py-basics-5',
    title: 'List Sum and Average',
    slug: 'list-sum-and-average',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 5,
    description: 'Read a list of space-separated integers. Print their sum and average (rounded to 2 decimal places) space-separated.',
    inputFormat: 'Space-separated integers.',
    outputFormat: '`<sum> <average>`.',
    constraints: 'List length <= 500.',
    starterCode: `numbers = [int(x) for x in input().split()]
# Write logic below
`,
    testCases: [{ input: '4 8 15 16 23 42', expectedOutput: '108 18.0', isExample: true }]
  },
  {
    id: 'py-basics-6',
    title: 'Character Frequency Sorter',
    slug: 'character-frequency-sorter',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 6,
    description: 'Count unique character frequencies. Print `char:count` sorted by frequency descending, then alphabetically.',
    inputFormat: 'A string.',
    outputFormat: 'Sorted frequencies.',
    constraints: 'Lowercase letters.',
    starterCode: `text = input()
# Write logic below
`,
    testCases: [{ input: 'banana', expectedOutput: 'a:3\nn:2\nb:1', isExample: true }]
  },
  {
    id: 'py-basics-7',
    title: 'Palindrome Checker',
    slug: 'palindrome-checker',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 7,
    description: 'Check if a string is a palindrome, ignoring casing and spaces. Print `True` or `False`.',
    inputFormat: 'A string.',
    outputFormat: '`True` or `False`.',
    constraints: 'Length <= 500.',
    starterCode: `text = input()
# Write logic below
`,
    testCases: [{ input: 'A man a plan a canal Panama', expectedOutput: 'True', isExample: true }]
  },
  {
    id: 'py-basics-8',
    title: 'Type Conversion Playground',
    slug: 'type-conversion-playground',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 8,
    description: 'Read a float string. Try to convert it to float, then convert that to int, and check if it is non-zero (bool). Print each conversion state space-separated.',
    inputFormat: 'A float string.',
    outputFormat: '`<float_val> <int_val> <bool_val>`.',
    constraints: 'Valid float input.',
    starterCode: `val_str = input()
# Write conversion logic
`,
    testCases: [{ input: '12.5', expectedOutput: '12.5 12 True', isExample: true }]
  },
  {
    id: 'py-basics-9',
    title: 'Temperature Converter',
    slug: 'temperature-converter',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 9,
    description: 'Read a temperature value in Celsius and convert it to Fahrenheit and Kelvin. Print the space-separated results rounded to 2 decimal places.',
    inputFormat: 'Celsius float.',
    outputFormat: '`<Fahrenheit> <Kelvin>`.',
    constraints: 'Celsius >= -273.15',
    starterCode: `c = float(input())
# Write conversion functions and print results
`,
    testCases: [{ input: '25.0', expectedOutput: '77.0 298.15', isExample: true }]
  },
  {
    id: 'py-basics-10',
    title: 'Tuple Unpacking Basics',
    slug: 'tuple-unpacking-basics',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 10,
    description: 'Read coordinate data in format `x,y,z`. Create a tuple, unpack it, increment each coordinate by 1, and print the new coordinates as a comma-separated tuple.',
    inputFormat: '`x,y,z` floats.',
    outputFormat: '`(new_x, new_y, new_z)`.',
    constraints: 'Valid coordinates.',
    starterCode: `coords = tuple(float(x) for x in input().split(','))
# Unpack, increment, and print
`,
    testCases: [{ input: '1.5,2.5,3.5', expectedOutput: '(2.5, 3.5, 4.5)', isExample: true }]
  },
  {
    id: 'py-basics-11',
    title: 'Set Operations Explorer',
    slug: 'set-operations-explorer',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 11,
    description: 'Read two lines of space-separated strings. Convert them to sets and print: 1) Intersection 2) Union 3) Symmetric Difference. Sort each set before printing.',
    inputFormat: 'Two lines of space-separated elements.',
    outputFormat: 'Print each sorted set as list representation.',
    constraints: 'Between 1 and 100 elements per set.',
    starterCode: `set_a = set(input().split())
set_b = set(input().split())
# Perform set operations and print sorted lists
`,
    testCases: [{ input: 'apple banana cherry\nbanana grape apple', expectedOutput: "['apple', 'banana']\n['apple', 'banana', 'cherry', 'grape']\n['cherry', 'grape']", isExample: true }]
  },
  {
    id: 'py-basics-12',
    title: 'Dictionary Word Counter',
    slug: 'dictionary-word-counter',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 12,
    description: 'Build a word-count dictionary from an input sentence. Print each word and count formatted as `word:count` sorted alphabetically by word.',
    inputFormat: 'A sentence string.',
    outputFormat: '`word:count` on new lines.',
    constraints: 'Only letters and spaces.',
    starterCode: `sentence = input().lower().split()
# Count and print alphabetically
`,
    testCases: [{ input: 'to be or not to be', expectedOutput: 'be:2\nnot:1\nor:1\nto:2', isExample: true }]
  },
  {
    id: 'py-basics-13',
    title: 'Nested Dictionary Lookup',
    slug: 'nested-dictionary-lookup',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 13,
    description: 'Given a nested dictionary of student marks, calculate the average marks for the student name read from standard input. Print the average rounded to 2 decimal places.',
    inputFormat: 'Student name.',
    outputFormat: 'Average mark.',
    constraints: 'Valid student name in marksheet.',
    starterCode: `student = input()
marksheet = {
    'Alice': {'Math': 90, 'Science': 85, 'English': 92},
    'Bob': {'Math': 75, 'Science': 80, 'English': 72},
    'Charlie': {'Math': 95, 'Science': 98, 'English': 92}
}
# Calculate average for the specified student
`,
    testCases: [{ input: 'Alice', expectedOutput: '89.0', isExample: true }]
  },
  {
    id: 'py-basics-14',
    title: 'Function Basics: Args & Kwargs',
    slug: 'function-basics-args-kwargs',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 14,
    description: 'Create a function `process_data(*args, **kwargs)` that returns the sum of all elements in args, and the concatenated string values of kwargs sorted alphabetically by key, space-separated.',
    inputFormat: 'Dummy input.',
    outputFormat: '`<args_sum> <kwargs_values>`.',
    constraints: 'None.',
    starterCode: `def process_data(*args, **kwargs):
    # Calculate sum of args and space-separated kwargs values
    pass

# Read dummy input and run function
_ = input()
print(process_data(10, 20, 30, a="Hello", b="World"))
`,
    testCases: [{ input: 'run', expectedOutput: '60 Hello World', isExample: true }]
  },
  {
    id: 'py-basics-15',
    title: 'Default & Keyword Arguments',
    slug: 'default-keyword-arguments',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 15,
    description: 'Define a function `calculate_price(price, tax=0.05, discount=0.0)` that returns the final price: `(price * (1 + tax)) - discount`. Read input price and call it.',
    inputFormat: 'Float price.',
    outputFormat: 'Final price float rounded to 2 decimal places.',
    constraints: 'price >= 0',
    starterCode: `price = float(input())
# Define calculate_price and call it
`,
    testCases: [{ input: '100.0', expectedOutput: '105.0', isExample: true }]
  },
  {
    id: 'py-basics-16',
    title: 'Lambda & Map/Filter/Reduce',
    slug: 'lambda-map-filter-reduce',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 16,
    description: 'Read space-separated integers. Use lambda functions to double all even numbers (filtered via filter(), mapped via map()) and sum them up using reduce() (or sum()). Print the final sum.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Sum integer.',
    constraints: 'List size <= 500.',
    starterCode: `from functools import reduce
numbers = [int(x) for x in input().split()]
# Apply lambda, filter, map, reduce
`,
    testCases: [{ input: '1 2 3 4 5 6', expectedOutput: '24', isExample: true }]
  },
  {
    id: 'py-basics-17',
    title: 'List Comprehension Drills',
    slug: 'list-comprehension-drills',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 17,
    description: 'Read integers. Create a list comprehension that squares all odd integers, prints them space-separated.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Space-separated squared odd numbers.',
    constraints: 'Numbers <= 1000.',
    starterCode: `numbers = [int(x) for x in input().split()]
# List comprehension
`,
    testCases: [{ input: '1 2 3 4 5', expectedOutput: '1 9 25', isExample: true }]
  },
  {
    id: 'py-basics-18',
    title: 'Dict & Set Comprehensions',
    slug: 'dict-set-comprehensions',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 18,
    description: 'Read words list. Generate a dictionary mapping `word:len(word)` using a dictionary comprehension. Print the dictionary representation sorted by keys.',
    inputFormat: 'Space-separated words.',
    outputFormat: 'Sorted dict mapping.',
    constraints: 'Word count <= 100.',
    starterCode: `words = input().split()
# Dict comprehension, print sorted dict representation
`,
    testCases: [{ input: 'apple boy cat', expectedOutput: "{'apple': 5, 'boy': 3, 'cat': 3}", isExample: true }]
  },
  {
    id: 'py-basics-19',
    title: 'Recursion: Factorial & Power',
    slug: 'recursion-factorial-power',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 19,
    description: 'Implement a recursive function `factorial(n)` and recursive `power(base, exp)`. Read base and exp from input and print `factorial(base) power(base, exp)`.',
    inputFormat: 'Integers base and exp.',
    outputFormat: '`<factorial> <power>`.',
    constraints: '1 <= base <= 8, 1 <= exp <= 5.',
    starterCode: `base, exp = [int(x) for x in input().split()]
# Recursive functions
`,
    testCases: [{ input: '5 3', expectedOutput: '120 125', isExample: true }]
  },
  {
    id: 'py-basics-20',
    title: 'Recursion: Sum of Digits',
    slug: 'recursion-sum-of-digits',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 20,
    description: 'Recursively sum the digits of an integer `n` until the result is a single digit, and print the single digit.',
    inputFormat: 'A large integer `n`.',
    outputFormat: 'Single digit integer.',
    constraints: '0 <= n <= 10^18.',
    starterCode: `n = int(input())
# Recursive digit sum
`,
    testCases: [{ input: '9875', expectedOutput: '2', isExample: true }]
  },
  {
    id: 'py-basics-21',
    title: 'Exception Handling Basics',
    slug: 'exception-handling-basics',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 21,
    description: 'Read two numbers a and b. Try to divide a/b. Handle `ZeroDivisionError` by printing `ZeroDivisionError` and `ValueError` (if floats aren\'t entered) by printing `ValueError`. If clean, print results.',
    inputFormat: 'Two inputs, each on a new line.',
    outputFormat: 'Division output, or exception message.',
    constraints: 'None.',
    starterCode: `try:
    a_str = input()
    b_str = input()
    # Write exception wrapper
except Exception as e:
    pass
`,
    testCases: [{ input: '10.0\n0.0', expectedOutput: 'ZeroDivisionError', isExample: true }, { input: '10.0\nhello', expectedOutput: 'ValueError' }]
  },
  {
    id: 'py-basics-22',
    title: 'Custom Exceptions',
    slug: 'custom-exceptions',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 22,
    description: 'Define a custom exception `NegativeNumberError`. Write a program that reads an integer; if it is negative, raise `NegativeNumberError("Negative input not allowed")` and catch it. Otherwise, print the number.',
    inputFormat: 'An integer.',
    outputFormat: 'Number or exception message.',
    constraints: 'None.',
    starterCode: `# Define exception class and raise/catch
`,
    testCases: [{ input: '-5', expectedOutput: 'Negative input not allowed', isExample: true }]
  },
  {
    id: 'py-basics-23',
    title: 'File Read & Write',
    slug: 'file-read-write',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 23,
    description: 'Write the input text into a local file named `sample.txt`. Then read the file back, counting its lines, and print the line count.',
    inputFormat: 'A text block.',
    outputFormat: 'Line count integer.',
    constraints: 'None.',
    starterCode: `text = input()
# Write to sample.txt, read back, print line count
`,
    testCases: [{ input: 'Hello World\nNew Line', expectedOutput: '2', isExample: true }]
  },
  {
    id: 'py-basics-24',
    title: 'Modules & Imports',
    slug: 'modules-imports',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 24,
    description: 'Read an integer angle in degrees. Import the `math` module, convert degrees to radians, calculate the sine value, and print it rounded to 2 decimal places.',
    inputFormat: 'Integer degrees.',
    outputFormat: 'Sine float.',
    constraints: '0 <= degrees <= 360.',
    starterCode: `import math
deg = int(input())
# Convert to radians, compute sin and print
`,
    testCases: [{ input: '90', expectedOutput: '1.0', isExample: true }]
  },
  {
    id: 'py-basics-25',
    title: 'Classes & Objects 101',
    slug: 'classes-objects-101',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 25,
    description: 'Create a class `Car` with attributes `make`, `model`, and a method `get_desc()` that returns `make + " " + model`. Read inputs and print get_desc() result.',
    inputFormat: 'Make and model values, space-separated.',
    outputFormat: 'Description string.',
    constraints: 'String values.',
    starterCode: `# Define Car class, read inputs, initialize, print description
`,
    testCases: [{ input: 'Tesla Model3', expectedOutput: 'Tesla Model3', isExample: true }]
  },
  {
    id: 'py-basics-26',
    title: 'Inheritance & Method Override',
    slug: 'inheritance-method-override',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 26,
    description: 'Define base class `Animal` with method `speak()` returning `Sound`. Define subclass `Dog` overriding `speak()` to return `Woof`. Read input dog name, call speak().',
    inputFormat: 'String name.',
    outputFormat: '`Woof`.',
    constraints: 'None.',
    starterCode: `# Define Animal and Dog. Call speak()
`,
    testCases: [{ input: 'Buddy', expectedOutput: 'Woof', isExample: true }]
  },
  {
    id: 'py-basics-27',
    title: 'Iterators & Generators',
    slug: 'iterators-generators',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 27,
    description: 'Write a generator function `squares(n)` yielding the squares of numbers from 1 to `n`. Read `n` and print the yielded values space-separated.',
    inputFormat: 'Integer n.',
    outputFormat: 'Space-separated squares.',
    constraints: '1 <= n <= 50.',
    starterCode: `n = int(input())
# Define squares generator and output results
`,
    testCases: [{ input: '5', expectedOutput: '1 4 9 16 25', isExample: true }]
  },
  {
    id: 'py-basics-28',
    title: 'Decorators: Timing a Function',
    slug: 'decorators-timing-function',
    difficulty: 'advanced',
    category: 'python',
    section: 'basics',
    order: 28,
    description: 'Create a decorator `@verify` that checks if the first argument is positive. If not, print `Invalid`. If positive, call the decorated function.',
    inputFormat: 'Integer n.',
    outputFormat: 'Function result, or `Invalid`.',
    constraints: 'None.',
    starterCode: `# Define decorator verify, apply it to a function and call it
`,
    testCases: [{ input: '-10', expectedOutput: 'Invalid', isExample: true }]
  },
  {
    id: 'py-basics-29',
    title: 'Intro to Regex',
    slug: 'intro-regex',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 29,
    description: 'Validate if an input string is a valid email format (containing letter characters, `@` symbol, domain name). Print `True` or `False`.',
    inputFormat: 'String email.',
    outputFormat: '`True` or `False`.',
    constraints: 'None.',
    starterCode: `import re
email = input()
# Apply re validation and print
`,
    testCases: [{ input: 'test@datalogify.com', expectedOutput: 'True', isExample: true }, { input: 'invalid-email', expectedOutput: 'False' }]
  },

  // ==========================================
  // SECTION 2: 📚 PRACTICE LIBRARIES
  // ==========================================

  // NUMPY TIERS
  {
    id: 'py-numpy-1',
    title: 'NumPy Array Analysis',
    slug: 'numpy-array-analysis',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 1,
    description: 'Read a space-separated float array. Convert to NumPy, print its mean and sample standard deviation rounded to 2 decimal places, space-separated.',
    inputFormat: 'Space-separated floats.',
    outputFormat: '`<mean> <std_dev>`.',
    constraints: 'Length >= 2.',
    starterCode: `import numpy as np
arr = np.array([float(x) for x in input().split()])
# Calculate mean, std dev and print
`,
    testCases: [{ input: '10.0 20.0 30.0 40.0 50.0', expectedOutput: '30.0 14.14', isExample: true }]
  },
  {
    id: 'py-numpy-2',
    title: 'NumPy Boolean Masking',
    slug: 'numpy-boolean-masking',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 2,
    description: 'Read threshold float, and space-separated floats. Filter numbers > threshold, square them, and print space-separated.',
    inputFormat: 'Line 1: Threshold.\nLine 2: Floats.',
    outputFormat: 'Space-separated squared numbers.',
    constraints: 'None.',
    starterCode: `import numpy as np
threshold = float(input())
arr = np.array([float(x) for x in input().split()])
# Mask, square and print
`,
    testCases: [{ input: '25.0\n10 20 30 40 50', expectedOutput: '900.0 1600.0 2500.0', isExample: true }]
  },
  {
    id: 'py-numpy-3',
    title: 'Array Indexing & Slicing',
    slug: 'array-indexing-slicing',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 3,
    description: 'Given a 3x3 matrix, extract and print the 2x2 sub-matrix from the top-right corner. Output each row space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Submatrix rows.',
    constraints: 'None.',
    starterCode: `import numpy as np
# Ignore input
_ = input()
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
# Slice and print top-right 2x2 sub-matrix
`,
    testCases: [{ input: 'run', expectedOutput: '2 3\n5 6', isExample: true }]
  },
  {
    id: 'py-numpy-4',
    title: 'Broadcasting Basics',
    slug: 'broadcasting-basics',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 4,
    description: 'Add a 1D array `[1, 2, 3]` to each row of a 3x3 matrix. Print the resulting matrix rows space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Result matrix rows.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
matrix = np.array([[10, 20, 30], [40, 50, 60], [70, 80, 90]])
add_vector = np.array([1, 2, 3])
# Apply broadcasting and print
`,
    testCases: [{ input: 'run', expectedOutput: '11 22 33\n41 52 63\n71 82 93', isExample: true }]
  },
  {
    id: 'py-numpy-5',
    title: 'Array Reshaping & Flattening',
    slug: 'array-reshaping-flattening',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 5,
    description: 'Reshape a 1D array of 6 elements into a 2D array of size 2x3. Print its shape representation.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`(2, 3)`.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([1, 2, 3, 4, 5, 6])
# Reshape and print shape
`,
    testCases: [{ input: 'run', expectedOutput: '(2, 3)', isExample: true }]
  },
  {
    id: 'py-numpy-6',
    title: 'Stacking & Splitting Arrays',
    slug: 'stacking-splitting-arrays',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 6,
    description: 'Vertically stack two 1D arrays `[1, 2]` and `[3, 4]`. Print the shape of the stacked array.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Stacked array shape.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([1, 2])
b = np.array([3, 4])
# vstack and print shape
`,
    testCases: [{ input: 'run', expectedOutput: '(2, 2)', isExample: true }]
  },
  {
    id: 'py-numpy-7',
    title: 'Element-wise Math Operations',
    slug: 'element-wise-math-operations',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 7,
    description: 'Apply square root element-wise to array `[4.0, 9.0, 16.0]`. Print the results space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Floats.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([4.0, 9.0, 16.0])
# Square root and print
`,
    testCases: [{ input: 'run', expectedOutput: '2.0 3.0 4.0', isExample: true }]
  },
  {
    id: 'py-numpy-8',
    title: 'Aggregations by Axis',
    slug: 'aggregations-by-axis',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 8,
    description: 'Calculate the sum along columns (axis=0) of matrix `[[1, 2], [3, 4]]`. Print the space-separated result array.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Column sums.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([[1, 2], [3, 4]])
# Compute column sums and print
`,
    testCases: [{ input: 'run', expectedOutput: '4 6', isExample: true }]
  },
  {
    id: 'py-numpy-9',
    title: 'Sorting & Argsort',
    slug: 'sorting-argsort',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 9,
    description: 'Given array `[30, 10, 20]`, print the original indices in sorted order (using argsort) space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Indices integers.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
arr = np.array([30, 10, 20])
# argsort indices and print
`,
    testCases: [{ input: 'run', expectedOutput: '1 2 0', isExample: true }]
  },
  {
    id: 'py-numpy-10',
    title: 'Random Number Generation',
    slug: 'random-number-generation',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 10,
    description: 'Set random seed to `42`. Generate an array of 3 random integers between 1 and 100. Print the generated array values space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Random numbers.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Seed and random numbers
`,
    testCases: [{ input: 'run', expectedOutput: '52 93 15', isExample: true }]
  },
  {
    id: 'py-numpy-11',
    title: 'Linear Algebra Basics',
    slug: 'linear-algebra-basics',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 11,
    description: 'Compute matrix dot product of two arrays `[[1, 2], [3, 4]]` and `[[2, 0], [1, 2]]`. Print the resulting matrix rows space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Matrix rows.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
a = np.array([[1, 2], [3, 4]])
b = np.array([[2, 0], [1, 2]])
# Dot product and print
`,
    testCases: [{ input: 'run', expectedOutput: '4 4\n10 8', isExample: true }]
  },
  {
    id: 'py-numpy-12',
    title: 'Handling NaN in Arrays',
    slug: 'handling-nan-arrays',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'numpy',
    order: 12,
    description: 'Given an array `[1.0, np.nan, 3.0]`, replace the NaN value with the mean of the valid values. Print the resulting array space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Floats.',
    constraints: 'None.',
    starterCode: `import numpy as np
_ = input()
# Replace NaN and print
`,
    testCases: [{ input: 'run', expectedOutput: '1.0 2.0 3.0', isExample: true }]
  },

  // PANDAS TIERS
  {
    id: 'py-pandas-1',
    title: 'Pandas DataFrame Querying',
    slug: 'pandas-dataframe-querying',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 1,
    description: 'Query employee names earning strictly more than input threshold.',
    inputFormat: 'Salary threshold.',
    outputFormat: 'Employee names.',
    constraints: 'None.',
    starterCode: `import pandas as pd
threshold = int(input())
data = {
    'Employee': ['Alice', 'Bob', 'Charlie', 'David'],
    'Salary': [50000, 80000, 95000, 60000]
}
df = pd.DataFrame(data)
# Filter and print names
`,
    testCases: [{ input: '70000', expectedOutput: 'Bob\nCharlie', isExample: true }]
  },
  {
    id: 'py-pandas-2',
    title: 'Pandas GroupBy Aggregation',
    slug: 'pandas-groupby-aggregation',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 2,
    description: 'Group sales by category and sum them. PrintCategory and sum space-separated, sorted alphabetically.',
    inputFormat: 'Dummy text.',
    outputFormat: 'Categories and sums.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
data = {
    'Category': ['Electronics', 'Furniture', 'Electronics', 'Furniture', 'Office Supplies'],
    'Sales': [200.50, 350.00, 150.25, 120.00, 45.75]
}
df = pd.DataFrame(data)
# GroupBy sum and print
`,
    testCases: [{ input: 'run', expectedOutput: 'Electronics 350.75\nFurniture 470.0\nOffice Supplies 45.75', isExample: true }]
  },
  {
    id: 'py-pandas-3',
    title: 'Series & DataFrame Creation',
    slug: 'series-dataframe-creation',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 3,
    description: 'Create a DataFrame from dict `{"A": [1, 2], "B": [3, 4]}`. Print the shape representation.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Shape tuple.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
# Create df and print shape
`,
    testCases: [{ input: 'run', expectedOutput: '(2, 2)', isExample: true }]
  },
  {
    id: 'py-pandas-4',
    title: 'Reading CSV & Basic Inspection',
    slug: 'reading-csv-basic-inspection',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 4,
    description: 'Load a csv format string from input. Print the shape of the loaded DataFrame.',
    inputFormat: 'CSV string.',
    outputFormat: 'Shape representation.',
    constraints: 'None.',
    starterCode: `import io
import pandas as pd
csv_data = input()
# Load via StringIO and print shape
`,
    testCases: [{ input: 'Col1,Col2\n1,2\n3,4\n5,6', expectedOutput: '(3, 2)', isExample: true }]
  },
  {
    id: 'py-pandas-5',
    title: 'loc vs iloc Drills',
    slug: 'loc-vs-iloc-drills',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 5,
    description: 'Given employee dataframe, use `iloc` to select the name of the second employee (index 1). Print the name.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Name string.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
df = pd.DataFrame({'Name': ['Alice', 'Bob', 'Charlie'], 'Age': [25, 30, 35]})
# Select Bob and print
`,
    testCases: [{ input: 'run', expectedOutput: 'Bob', isExample: true }]
  },
  {
    id: 'py-pandas-6',
    title: 'Handling Missing Data',
    slug: 'handling-missing-data',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 6,
    description: 'Find all missing values in Salary. Fill the missing values with the column mean. Print the modified column.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Float salaries.',
    constraints: 'None.',
    starterCode: `import pandas as pd
import numpy as np
_ = input()
df = pd.DataFrame({'Salary': [10.0, np.nan, 30.0]})
# Fill NaN with mean and print column values space-separated
`,
    testCases: [{ input: 'run', expectedOutput: '10.0 20.0 30.0', isExample: true }]
  },
  {
    id: 'py-pandas-7',
    title: 'Sorting & Ranking',
    slug: 'sorting-ranking',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 7,
    description: 'Sort employees DataFrame by Salary in descending order, and print the sorted names space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Names.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
df = pd.DataFrame({'Name': ['Alice', 'Bob', 'Charlie'], 'Salary': [50, 90, 70]})
# Sort and print names
`,
    testCases: [{ input: 'run', expectedOutput: 'Bob Charlie Alice', isExample: true }]
  },
  {
    id: 'py-pandas-8',
    title: 'Apply & Lambda on Columns',
    slug: 'apply-lambda-columns',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 8,
    description: 'Use `apply` and a lambda function to double the Salary values. Print the doubled column values space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Integers.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
df = pd.DataFrame({'Salary': [10, 20, 30]})
# Double values and print
`,
    testCases: [{ input: 'run', expectedOutput: '20 40 60', isExample: true }]
  },
  {
    id: 'py-pandas-9',
    title: 'Merging & Joining DataFrames',
    slug: 'merging-joining-dataframes',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 9,
    description: 'Merge employee details DataFrame and salaries DataFrame on `EmpID` using inner join. Print names of matched employees sorted alphabetically.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Names.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
df1 = pd.DataFrame({'EmpID': [1, 2, 3], 'Name': ['Alice', 'Bob', 'Charlie']})
df2 = pd.DataFrame({'EmpID': [2, 3, 4], 'Salary': [80, 90, 100]})
# Merge and print names
`,
    testCases: [{ input: 'run', expectedOutput: 'Bob\nCharlie', isExample: true }]
  },
  {
    id: 'py-pandas-10',
    title: 'Pivot Tables',
    slug: 'pivot-tables',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 10,
    description: 'Generate a pivot table of total sales, indexed by Product and columns by Region. Print the sales value at Product="A" and Region="West".',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Float sales.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
data = {
    'Product': ['A', 'A', 'B', 'B'],
    'Region': ['East', 'West', 'East', 'West'],
    'Sales': [100.0, 250.0, 300.0, 400.0]
}
df = pd.DataFrame(data)
# Pivot table, extract and print A, West sales
`,
    testCases: [{ input: 'run', expectedOutput: '250.0', isExample: true }]
  },
  {
    id: 'py-pandas-11',
    title: 'String Methods on Columns',
    slug: 'string-methods-columns',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 11,
    description: 'Clean employee names in column `Name` by removing leading/trailing spaces and converting them to uppercase. Print the cleaned names space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Names.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
df = pd.DataFrame({'Name': [' alice ', ' bob  ', 'charlie']})
# Clean and print
`,
    testCases: [{ input: 'run', expectedOutput: 'ALICE BOB CHARLIE', isExample: true }]
  },
  {
    id: 'py-pandas-12',
    title: 'DateTime Handling',
    slug: 'datetime-handling',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 12,
    description: 'Convert date string column to datetime, extract and print the unique years space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Years.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
df = pd.DataFrame({'Date': ['2023-01-01', '2024-05-12', '2023-08-20']})
# Parse datetime, extract years and print unique sorted years
`,
    testCases: [{ input: 'run', expectedOutput: '2023 2024', isExample: true }]
  },
  {
    id: 'py-pandas-13',
    title: 'Multi-column GroupBy + Agg',
    slug: 'multi-column-groupby-agg',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'pandas',
    order: 13,
    description: 'Group sales data by Region and Category. Calculate aggregate sum of Sales. Print the sum of Region="East" and Category="Electronics".',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Float sum.',
    constraints: 'None.',
    starterCode: `import pandas as pd
_ = input()
data = {
    'Region': ['East', 'East', 'West', 'East'],
    'Category': ['Electronics', 'Furniture', 'Electronics', 'Electronics'],
    'Sales': [100, 200, 150, 300]
}
df = pd.DataFrame(data)
# GroupBy Region and Category, sum sales, print East, Electronics aggregate
`,
    testCases: [{ input: 'run', expectedOutput: '400', isExample: true }]
  },

  // MATPLOTLIB TIERS
  {
    id: 'py-matplotlib-1',
    title: 'Your First Line Plot',
    slug: 'your-first-line-plot',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 1,
    description: 'Generate a simple line plot using `plt.plot(x, y)`. Set title to "Growth", xlabel to "Time", and ylabel to "Value". Verify settings programmatically.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()
x = [1, 2, 3]
y = [10, 20, 30]

# Write plotting code below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-matplotlib-2',
    title: 'Bar Chart from Data',
    slug: 'bar-chart-from-data',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 2,
    description: 'Create a bar chart using `plt.bar(categories, values)`. Set title to "Categories". Verify bar structure programmatically.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()
categories = ['A', 'B', 'C']
values = [10, 25, 15]

# Write plotting code below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-matplotlib-3',
    title: 'Scatter Plot with Colors',
    slug: 'scatter-plot-with-colors',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 3,
    description: 'Generate a scatter plot using `plt.scatter(x, y)`. Verify scatter collection programmatically.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()
x = [1, 2, 3, 4]
y = [5, 7, 8, 10]

# Write plotting code below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-matplotlib-4',
    title: 'Multiple Series on One Plot',
    slug: 'multiple-series-on-one-plot',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 4,
    description: 'Plot two lines on the same plot. Call `plt.legend()` to show legends. Verify legend presence programmatically.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()
x = [1, 2, 3]
y1 = [10, 20, 30]
y2 = [15, 25, 35]

# Write plotting code below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-matplotlib-5',
    title: 'Subplots Grid',
    slug: 'subplots-grid',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 5,
    description: 'Create a 2x2 grid of subplots using `fig, axes = plt.subplots(2, 2)`. Verify 4 axes exist.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()

# Create subplots grid below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-matplotlib-6',
    title: 'Customizing Styles',
    slug: 'customizing-styles',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 6,
    description: 'Plot a line with specific styling: color="red", linestyle="--", marker="o". Verify plot presence.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()
x = [1, 2, 3]
y = [4, 5, 6]

# Write custom styled plotting below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-matplotlib-7',
    title: 'Saving Figures to File',
    slug: 'saving-figures-to-file',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 7,
    description: 'Plot a line, save the figure locally as `plot.png` using `plt.savefig("plot.png")`. Verify file creation.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()
x = [1, 2]
y = [3, 4]

# Save figure below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-matplotlib-8',
    title: 'Histogram of a Distribution',
    slug: 'histogram-distribution',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'matplotlib',
    order: 8,
    description: 'Generate a histogram of data points using `plt.hist(data, bins=5)`. Verify patches.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import matplotlib.pyplot as plt
_ = input()
data = [1, 2, 2, 3, 3, 3, 4, 4, 5]

# Generate histogram below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },

  // SEABORN TIERS
  {
    id: 'py-seaborn-1',
    title: 'Distribution Plot Basics',
    slug: 'distribution-plot-basics',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'seaborn',
    order: 1,
    description: 'Use Seaborn to generate a histogram distribution plot of value series using `sns.histplot(data)`. Verify plotting.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
data = [1, 1.5, 2, 2.5, 3, 3.5, 4]

# Generate histplot below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-seaborn-2',
    title: 'Categorical Plot: Boxplot',
    slug: 'categorical-plot-boxplot',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'seaborn',
    order: 2,
    description: 'Generate a boxplot of values categorized by group using `sns.boxplot(x="group", y="value", data=df)`. Verify.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
df = pd.DataFrame({
    'group': ['A', 'A', 'B', 'B'],
    'value': [10, 15, 20, 25]
})

# Generate boxplot below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-seaborn-3',
    title: 'Bar & Count Plots',
    slug: 'bar-count-plots',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'seaborn',
    order: 3,
    description: 'Use `sns.countplot(x="category", data=df)` to plot categories frequencies. Verify plotting.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
df = pd.DataFrame({'category': ['A', 'A', 'B', 'C', 'C', 'C']})

# Generate countplot below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-seaborn-4',
    title: 'Correlation Heatmap',
    slug: 'correlation-heatmap',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    subCategory: 'seaborn',
    order: 4,
    description: 'Calculate correlation matrix of DataFrame columns, and plot it using `sns.heatmap(corr)`. Verify.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
df = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6],
    'C': [7, 5, 9]
})

# Generate correlation heatmap below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-seaborn-5',
    title: 'Pairplot for EDA',
    slug: 'pairplot-eda',
    difficulty: 'advanced',
    category: 'python',
    section: 'libraries',
    subCategory: 'seaborn',
    order: 5,
    description: 'Plot pairwise numerical relationships in the DataFrame using `sns.pairplot(df)`. Verify execution.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
df = pd.DataFrame({
    'A': [1, 2, 3],
    'B': [4, 5, 6]
})

# Generate pairplot below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },
  {
    id: 'py-seaborn-6',
    title: 'Styling & Themes',
    slug: 'styling-themes',
    difficulty: 'basic',
    category: 'python',
    section: 'libraries',
    subCategory: 'seaborn',
    order: 6,
    description: 'Apply dark theme using `sns.set_theme(style="dark")` and generate a simple histplot. Verify.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
data = [1, 2, 3]

# Apply theme and plot below
`,
    testCases: [{ input: 'run', expectedOutput: 'PLOT_OK', isExample: true }]
  },

  // ==========================================
  // SECTION 3: 🧠 INTERMEDIATE & ADVANCED ALGORITHMS
  // ==========================================
  {
    id: 'py-second-largest',
    title: 'Find Second Largest Number',
    slug: 'find-second-largest-number',
    difficulty: 'intermediate',
    category: 'python',
    section: 'algorithms',
    order: 1,
    description: 'Given a space-separated list of integers, find and print the second largest number in the list. Note: Duplicate maximums should be skipped. For example, in `[10, 10, 8]`, the second largest is `8`.',
    inputFormat: 'A single line containing space-separated integers.',
    outputFormat: 'Print the second largest integer.',
    constraints: 'List contains between 2 and 500 integers. Numbers can be negative.',
    starterCode: `# Read input integers
numbers = [int(x) for x in input().split()]

# Find second largest
`,
    testCases: [
      { input: '2 3 6 6 5', expectedOutput: '5', isExample: true },
      { input: '10 10 10', expectedOutput: 'None' }
    ]
  },
  {
    id: 'py-missing-number',
    title: 'Find the Missing Number',
    slug: 'find-the-missing-number',
    difficulty: 'intermediate',
    category: 'python',
    section: 'algorithms',
    order: 2,
    description: 'You are given an unsorted list of integers containing unique numbers from `0` to `n`. One number in the range `[0, n]` is missing. Write a program to find and print the missing number.',
    inputFormat: 'A single line of space-separated integers.',
    outputFormat: 'Print the missing integer.',
    constraints: '1 <= n <= 10^5',
    starterCode: `# Read unsorted numbers
numbers = [int(x) for x in input().split()]

# Find missing number
`,
    testCases: [
      { input: '3 0 1', expectedOutput: '2', isExample: true },
      { input: '9 6 4 2 3 5 7 0 1', expectedOutput: '8' }
    ]
  },
  {
    id: 'py-group-anagrams',
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'advanced',
    category: 'python',
    section: 'algorithms',
    order: 3,
    description: 'Given a space-separated list of words, group the anagrams together. An anagram is a word formed by rearranging the letters of another word. Print each group sorted alphabetically, and print all groups sorted alphabetically by their first word, one group per line.',
    inputFormat: 'A single line of space-separated strings.',
    outputFormat: 'Print each sorted anagram group as space-separated words, one group per line.',
    constraints: 'Words contain only lowercase letters.',
    starterCode: `# Read list of words
words = input().split()

# Group anagrams and print
`,
    testCases: [
      { input: 'eat tea tan ate nat bat', expectedOutput: 'ate eat tea\nbat\nnat tan', isExample: true },
      { input: 'hello world', expectedOutput: 'hello\nworld' }
    ]
  },
  {
    id: 'py-regex-phone',
    title: 'Regex Phone Extractor',
    slug: 'regex-phone-extractor',
    difficulty: 'advanced',
    category: 'python',
    section: 'algorithms',
    order: 4,
    description: 'Write a program that uses regular expressions (`re` module) to extract all valid US phone numbers from a messy text block. The phone numbers can be in the formats `123-456-7890`, `(123) 456-7890`, or `123.456.7890`. Print each extracted phone number in a standardized `123-456-7890` hyphenated format, one per line.',
    inputFormat: 'A line containing messy text with embedded phone numbers.',
    outputFormat: 'Print each standardized phone number (`XXX-XXX-XXXX`) on a new line in order of appearance.',
    constraints: 'Text length <= 5000 characters.',
    starterCode: `import re

# Read text line
text = input()

# Extract, standardize and print the phone numbers
`,
    testCases: [
      { input: 'Call me at 123-456-7890 or office at (987) 654-3210. Email is contact@test.com.', expectedOutput: '123-456-7890\n987-654-3210', isExample: true },
      { input: 'No numbers here!', expectedOutput: '' }
    ]
  },
  {
    id: 'py-fibonacci',
    title: 'Fibonacci Sequence Generator',
    slug: 'fibonacci-sequence-generator',
    difficulty: 'advanced',
    category: 'python',
    section: 'algorithms',
    order: 5,
    description: 'The Fibonacci sequence is defined such that each number is the sum of the two preceding ones, starting from 0 and 1. Write a program that reads an integer `n` and prints the first `n` numbers of the Fibonacci sequence as a space-separated string.',
    inputFormat: 'A single integer `n`.',
    outputFormat: 'Print the first `n` space-separated Fibonacci numbers.',
    constraints: '1 <= n <= 30',
    starterCode: `# Read sequence limit
n = int(input())

# Calculate and print the first n Fibonacci numbers
`,
    testCases: [
      { input: '5', expectedOutput: '0 1 1 2 3', isExample: true },
      { input: '10', expectedOutput: '0 1 1 2 3 5 8 13 21 34' },
      { input: '1', expectedOutput: '0' }
    ]
  }
];
