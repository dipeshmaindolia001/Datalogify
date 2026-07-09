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
  order: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  starterCode: string;
  testCases: TestCase[];
}

export const challenges: Challenge[] = [
  // SECTION 1: BASICS FOUNDATIONS
  {
    id: 'py-hello-world',
    title: 'Say Hello, Python',
    slug: 'say-hello-python',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 1,
    description: 'Welcome to the Python Practice Arena! In this challenge, your task is to read a string from standard input (stdin) representing a person\'s name, and print a custom greeting to standard output (stdout) in the format `Hello, <name>!`.',
    inputFormat: 'A single line containing a name string.',
    outputFormat: 'Print `Hello, <name>!` to stdout.',
    constraints: 'The name string will be between 1 and 100 characters long and contain only alphabetical characters.',
    starterCode: `# Read input from stdin
name = input()

# Write your code here to print the greeting
`,
    testCases: [
      { input: 'Alice', expectedOutput: 'Hello, Alice!', isExample: true },
      { input: 'Bob', expectedOutput: 'Hello, Bob!' },
      { input: 'Datalogify', expectedOutput: 'Hello, Datalogify!' }
    ]
  },
  {
    id: 'py-even-odd',
    title: 'Even or Odd Number',
    slug: 'even-or-odd-number',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 2,
    description: 'Given an integer `n`, write a program to check if the number is Even or Odd. Print `Even` or `Odd` accordingly.',
    inputFormat: 'A single integer `n`.',
    outputFormat: 'Print `Even` if the number is even, else print `Odd`.',
    constraints: '-10^9 <= n <= 10^9',
    starterCode: `# Read integer from input
n = int(input())

# Write conditional checks here
`,
    testCases: [
      { input: '4', expectedOutput: 'Even', isExample: true },
      { input: '7', expectedOutput: 'Odd' },
      { input: '0', expectedOutput: 'Even' }
    ]
  },
  {
    id: 'py-leap-year',
    title: 'Leap Year Calculator',
    slug: 'leap-year-calculator',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 3,
    description: 'An extra day is added to the calendar almost every four years as February 29, and the day is called a leap day. It corrects the calendar for the fact that our planet takes approximately 365.25 days to orbit the sun. A leap year is divisible by 4, except for end-of-century years, which must also be divisible by 400. Write a program to check if a given year is a leap year. Print `True` or `False`.',
    inputFormat: 'A single integer year.',
    outputFormat: 'Print `True` if it is a leap year, else `False`.',
    constraints: '1000 <= year <= 9999',
    starterCode: `# Read year
year = int(input())

# Determine leap year logic
`,
    testCases: [
      { input: '2024', expectedOutput: 'True', isExample: true },
      { input: '1900', expectedOutput: 'False' },
      { input: '2000', expectedOutput: 'True' }
    ]
  },
  {
    id: 'py-fizzbuzz',
    title: 'The Classic FizzBuzz',
    slug: 'classic-fizzbuzz',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 4,
    description: 'Write a program that reads an integer `n`. For all integers from 1 to `n` (inclusive), print:\n- `Fizz` if the number is divisible by 3.\n- `Buzz` if the number is divisible by 5.\n- `FizzBuzz` if the number is divisible by both 3 and 5.\n- The number itself (as a string) if it is not divisible by 3 or 5.\nPrint each value on a new line.',
    inputFormat: 'A single integer `n`.',
    outputFormat: 'Print the FizzBuzz sequence up to `n`, one value per line.',
    constraints: '1 <= n <= 100',
    starterCode: `# Read upper limit
n = int(input())

# Iterate and evaluate FizzBuzz
`,
    testCases: [
      { input: '5', expectedOutput: '1\n2\nFizz\n4\nBuzz', isExample: true },
      { input: '15', expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }
    ]
  },
  {
    id: 'py-list-sum-avg',
    title: 'List Sum and Average',
    slug: 'list-sum-and-average',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 5,
    description: 'Read a space-separated sequence of numbers, calculate their total sum and their average, and print them as two space-separated values. The average should be rounded to 2 decimal places.',
    inputFormat: 'A single line containing space-separated integers.',
    outputFormat: 'Print `<sum> <average>` where average is rounded to 2 decimal places.',
    constraints: 'List contains between 1 and 1000 integers.',
    starterCode: `# Read line of inputs
numbers = [int(x) for x in input().split()]

# Calculate sum and average
`,
    testCases: [
      { input: '4 8 15 16 23 42', expectedOutput: '108 18.0', isExample: true },
      { input: '10 20 30', expectedOutput: '60 20.0' }
    ]
  },
  {
    id: 'py-freq-sorter',
    title: 'Character Frequency Sorter',
    slug: 'character-frequency-sorter',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 6,
    description: 'Read a string and count the frequency of each unique character. Print the character-frequency pairs formatted as `char:count` sorted in descending order of frequency. If two characters have the same frequency, sort them alphabetically.',
    inputFormat: 'A single string.',
    outputFormat: 'Print each `char:count` pair on a new line.',
    constraints: 'String contains only lowercase letters.',
    starterCode: `# Read string
text = input()

# Count frequencies, sort, and print
`,
    testCases: [
      { input: 'banana', expectedOutput: 'a:3\nn:2\nb:1', isExample: true },
      { input: 'test', expectedOutput: 't:2\ne:1\ns:1' }
    ]
  },
  {
    id: 'py-palindrome',
    title: 'Palindrome Checker',
    slug: 'palindrome-checker',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 7,
    description: 'Check if a given input string is a palindrome. A palindrome is a word that reads the same backward as forward. Ignore casing and spaces when checking. Print `True` or `False`.',
    inputFormat: 'A single string containing text.',
    outputFormat: 'Print `True` if it is a palindrome, else `False`.',
    constraints: 'String length <= 500 characters.',
    starterCode: `# Read input string
text = input()

# Palindrome validation logic
`,
    testCases: [
      { input: 'A man a plan a canal Panama', expectedOutput: 'True', isExample: true },
      { input: 'hello', expectedOutput: 'False' }
    ]
  },

  // SECTION 2: PRACTICE LIBRARIES (NUMPY, PANDAS)
  {
    id: 'py-numpy-analysis',
    title: 'NumPy Array Analysis',
    slug: 'numpy-array-analysis',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    order: 21,
    description: 'Write a program using NumPy to calculate statistical metrics. Read a space-separated list of float values representing data points, convert them into a NumPy array, and print the calculated arithmetic mean and sample standard deviation rounded to 2 decimal places, space-separated.',
    inputFormat: 'A single line containing space-separated numbers.',
    outputFormat: 'Print `<mean> <std_dev>` rounded to 2 decimal places.',
    constraints: 'Between 2 and 1000 float values.',
    starterCode: `import numpy as np

# Read inputs
numbers = np.array([float(x) for x in input().split()])

# Calculate mean and standard deviation, then print them
`,
    testCases: [
      { input: '10.0 20.0 30.0 40.0 50.0', expectedOutput: '30.0 14.14', isExample: true },
      { input: '1.5 2.5 3.5 4.5', expectedOutput: '3.0 1.12' }
    ]
  },
  {
    id: 'py-numpy-masking',
    title: 'NumPy Boolean Masking',
    slug: 'numpy-boolean-masking',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    order: 22,
    description: 'Write a program using NumPy to filter data. Read a threshold value on the first line, and a list of space-separated numbers on the second line. Find all numbers strictly greater than the threshold, square them, and print the resulting values as space-separated numbers.',
    inputFormat: 'Line 1: Threshold float.\nLine 2: Space-separated floats.',
    outputFormat: 'Print space-separated squared floats.',
    constraints: 'Numbers list length <= 1000.',
    starterCode: `import numpy as np

# Read inputs
threshold = float(input())
numbers = np.array([float(x) for x in input().split()])

# Apply boolean mask, square the filtered numbers, and print
`,
    testCases: [
      { input: '25\n10 20 30 40 50', expectedOutput: '900.0 1600.0 2500.0', isExample: true },
      { input: '5.5\n2.2 4.4 6.6 8.8', expectedOutput: '43.56 77.44' }
    ]
  },
  {
    id: 'py-pandas-querying',
    title: 'Pandas DataFrame Querying',
    slug: 'pandas-dataframe-querying',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    order: 23,
    description: 'Write a program using Pandas. Read a salary threshold integer. Using a pre-defined Pandas DataFrame containing employee names and salaries, filter the DataFrame to extract all employees earning strictly more than the threshold. Print their names, one per line, in order of appearance.',
    inputFormat: 'A single integer representing the salary threshold.',
    outputFormat: 'Print names of employees earning more than the threshold, one per line.',
    constraints: 'Salary threshold >= 0.',
    starterCode: `import pandas as pd

# Read salary threshold
threshold = int(input())

# Predefined dataset
data = {
    'Employee': ['Alice', 'Bob', 'Charlie', 'David'],
    'Department': ['HR', 'Engineering', 'Engineering', 'Marketing'],
    'Salary': [50000, 80000, 95000, 60000]
}
df = pd.DataFrame(data)

# Query DataFrame and print results
`,
    testCases: [
      { input: '70000', expectedOutput: 'Bob\nCharlie', isExample: true },
      { input: '55000', expectedOutput: 'Bob\nCharlie\nDavid' }
    ]
  },
  {
    id: 'py-pandas-groupby',
    title: 'Pandas GroupBy Aggregation',
    slug: 'pandas-groupby-aggregation',
    difficulty: 'intermediate',
    category: 'python',
    section: 'libraries',
    order: 24,
    description: 'Write a program using Pandas. Given a pre-defined DataFrame containing e-commerce transaction categories and sales figures, group the data by category, calculate the total sum of sales for each category, and print the results sorted alphabetically by category name in the format `<Category> <TotalSales>`, one per line.',
    inputFormat: 'A dummy string (ignore input).',
    outputFormat: 'Print `<Category> <TotalSales>` sorted alphabetically by category.',
    constraints: 'Sales values > 0.',
    starterCode: `import pandas as pd

# Ignore stdin
_ = input()

# Predefined transaction dataset
data = {
    'Category': ['Electronics', 'Furniture', 'Electronics', 'Furniture', 'Office Supplies'],
    'Sales': [200.50, 350.00, 150.25, 120.00, 45.75]
}
df = pd.DataFrame(data)

# Run GroupBy aggregator and print
`,
    testCases: [
      { input: 'run', expectedOutput: 'Electronics 350.75\nFurniture 470.0\nOffice Supplies 45.75', isExample: true }
    ]
  },

  // SECTION 3: INTERMEDIATE & ADVANCED ALGORITHMS
  {
    id: 'py-second-largest',
    title: 'Find Second Largest Number',
    slug: 'find-second-largest-number',
    difficulty: 'intermediate',
    category: 'python',
    section: 'algorithms',
    order: 31,
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
    order: 32,
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
    order: 33,
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
    order: 34,
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
    order: 35,
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
