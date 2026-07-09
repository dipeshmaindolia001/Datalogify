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
  order: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  starterCode: string;
  testCases: TestCase[];
}

export const challenges: Challenge[] = [
  {
    id: 'py-hello-world',
    title: 'Say Hello, Python',
    slug: 'say-hello-python',
    difficulty: 'basic',
    category: 'python',
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
    order: 2,
    description: 'Given an integer, determine if it is even or odd. If the number is even, print `Even`. If it is odd, print `Odd`.',
    inputFormat: 'A single line containing an integer `n`.',
    outputFormat: 'Print `Even` or `Odd` based on the number.',
    constraints: '-10^9 <= n <= 10^9',
    starterCode: `# Read the integer input
n = int(input())

# Write your conditional logic here
`,
    testCases: [
      { input: '4', expectedOutput: 'Even', isExample: true },
      { input: '7', expectedOutput: 'Odd' },
      { input: '-12', expectedOutput: 'Even' },
      { input: '0', expectedOutput: 'Even' }
    ]
  },
  {
    id: 'py-leap-year',
    title: 'Leap Year Calculator',
    slug: 'leap-year-calculator',
    difficulty: 'basic',
    category: 'python',
    order: 3,
    description: 'An extra day is added to the calendar almost every four years as a leap year. Write a program that checks whether a given year is a leap year according to the following rules:\n- The year can be evenly divided by 4, is a leap year, UNLESS:\n- The year can be evenly divided by 100, it is NOT a leap year, UNLESS:\n- The year is also evenly divided by 400. Then it is a leap year.',
    inputFormat: 'A single integer representing the year.',
    outputFormat: 'Print `Leap Year` if the year is a leap year; otherwise, print `Not a Leap Year`.',
    constraints: '1 <= year <= 10^5',
    starterCode: `# Read the year
year = int(input())

# Determine if the year is a leap year and print the output
`,
    testCases: [
      { input: '2000', expectedOutput: 'Leap Year', isExample: true },
      { input: '1900', expectedOutput: 'Not a Leap Year' },
      { input: '2024', expectedOutput: 'Leap Year' },
      { input: '2023', expectedOutput: 'Not a Leap Year' }
    ]
  },
  {
    id: 'py-fizzbuzz',
    title: 'The Classic FizzBuzz',
    slug: 'classic-fizzbuzz',
    difficulty: 'basic',
    category: 'python',
    order: 4,
    description: 'Given an integer `n`, write a loop that prints the numbers from 1 to `n` (inclusive) on new lines. However:\n- For multiples of 3, print `Fizz` instead of the number.\n- For multiples of 5, print `Buzz` instead of the number.\n- For numbers which are multiples of both 3 and 5, print `FizzBuzz`.',
    inputFormat: 'A single integer `n`.',
    outputFormat: 'Print numbers 1 to `n` line-by-line, substituting `Fizz`, `Buzz`, or `FizzBuzz` where appropriate.',
    constraints: '1 <= n <= 100',
    starterCode: `# Read the limit
n = int(input())

# Write your loop here
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
    difficulty: 'intermediate',
    category: 'python',
    order: 5,
    description: 'In data analytics, calculating aggregate sums and averages of lists is extremely common. Write a program that reads the number of elements `n`, followed by a line containing `n` space-separated integers, and prints their total sum and decimal average.',
    inputFormat: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    outputFormat: 'Print the aggregates in the format: `Sum: <total>, Average: <average>` (Average rounded to 1 decimal place).',
    constraints: '1 <= n <= 10^4',
    starterCode: `# Read number of elements
n = int(input())

# Read the space-separated integers
nums = list(map(int, input().split()))

# Calculate sum and average, and print the formatted output
`,
    testCases: [
      { input: '5\n10 20 30 40 50', expectedOutput: 'Sum: 150, Average: 30.0', isExample: true },
      { input: '3\n5 12 8', expectedOutput: 'Sum: 25, Average: 8.3' }
    ]
  },
  {
    id: 'py-char-frequency',
    title: 'Character Frequency Sorter',
    slug: 'character-frequency-sorter',
    difficulty: 'intermediate',
    category: 'python',
    order: 6,
    description: 'Write a program that takes a string input, counts the occurrence of each unique character (ignoring case, spaces, and punctuation), and prints the frequencies sorted in alphabetical order.',
    inputFormat: 'A single line containing a text string.',
    outputFormat: 'Print each unique character and its count in the format `<char>: <count>` on a new line, sorted alphabetically.',
    constraints: 'String length will be between 1 and 1000 characters.',
    starterCode: `# Read text string
text = input()

# Count characters and print sorted frequencies
`,
    testCases: [
      { input: 'banana', expectedOutput: 'a: 3\nb: 1\nn: 2', isExample: true },
      { input: 'Data Science!', expectedOutput: 'a: 2\nc: 1\nd: 1\ne: 1\ni: 1\nn: 1\ns: 1', isExample: false }
    ]
  },
  {
    id: 'py-palindrome-check',
    title: 'Palindrome Checker',
    slug: 'palindrome-checker',
    difficulty: 'intermediate',
    category: 'python',
    order: 7,
    description: 'A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward. Write a program that checks whether a given string is a palindrome, ignoring uppercase/lowercase distinctions, spaces, and non-alphanumeric punctuation characters.',
    inputFormat: 'A single line containing a string.',
    outputFormat: 'Print `True` if it is a palindrome; otherwise, print `False`.',
    constraints: '1 <= length <= 10^4',
    starterCode: `# Read string
text = input()

# Check for palindrome and print True/False
`,
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'True', isExample: true },
      { input: 'Data Analytics', expectedOutput: 'False' },
      { input: 'RaceCar', expectedOutput: 'True' }
    ]
  },
  {
    id: 'py-second-largest',
    title: 'Find Second Largest Number',
    slug: 'find-second-largest-number',
    difficulty: 'intermediate',
    category: 'python',
    order: 8,
    description: 'Given a list of integers, find the second largest value. Be careful: if the maximum value occurs multiple times, you must still find the value that is strictly less than the maximum value.',
    inputFormat: 'The first line contains an integer `n`.\nThe second line contains `n` space-separated integers.',
    outputFormat: 'Print the strictly second-largest integer.',
    constraints: '2 <= n <= 100\n-100 <= numbers[i] <= 100',
    starterCode: `# Read count and list
n = int(input())
arr = list(map(int, input().split()))

# Write your code to find the second largest unique value
`,
    testCases: [
      { input: '5\n2 3 6 6 5', expectedOutput: '5', isExample: true },
      { input: '4\n10 10 9 8', expectedOutput: '9' },
      { input: '3\n-5 -2 -2', expectedOutput: '-5' }
    ]
  },
  {
    id: 'py-missing-number',
    title: 'Find the Missing Number',
    slug: 'find-the-missing-number',
    difficulty: 'advanced',
    category: 'python',
    order: 9,
    description: 'You are given a list of `n-1` unique integers in the range of 1 to `n`. This means one integer in the range is missing. Write an efficient program to find the missing integer.',
    inputFormat: 'The first line contains the integer `n`.\nThe second line contains `n-1` space-separated integers in range [1, n].',
    outputFormat: 'Print the single missing integer.',
    constraints: '2 <= n <= 10^5',
    starterCode: `# Read n and the list of n-1 numbers
n = int(input())
arr = list(map(int, input().split()))

# Find and print the missing number
`,
    testCases: [
      { input: '5\n1 2 4 5', expectedOutput: '3', isExample: true },
      { input: '10\n1 2 3 4 5 6 7 8 10', expectedOutput: '9' }
    ]
  },
  {
    id: 'py-anagram-groups',
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'advanced',
    category: 'python',
    order: 10,
    description: 'An anagram is a word formed by rearranging the letters of another. Write a program that reads a list of space-separated words, groups all anagrams together, and prints the groups. To ensure consistent output verification, print each group as a comma-separated list sorted alphabetically, with each group printed on a new line. The groups themselves should also be printed in alphabetical order of their first words.',
    inputFormat: 'A single line containing space-separated words.',
    outputFormat: 'Print each anagram group (sorted alphabetically, comma-separated) on a new line. Print the groups themselves in alphabetical order.',
    constraints: '1 <= total words <= 100, word length <= 20',
    starterCode: `# Read space-separated words
words = input().split()

# Group anagrams and print in the specified format
`,
    testCases: [
      { input: 'eat tea tan ate nat bat', expectedOutput: 'ate,eat,tea\nbat\nnat,tan', isExample: true },
      { input: 'listen silent apple pale leap', expectedOutput: 'apple\nleap,pale\nlisten,silent' }
    ]
  },
  {
    id: 'py-regex-phone',
    title: 'Regex Phone Extractor',
    slug: 'regex-phone-extractor',
    difficulty: 'advanced',
    category: 'python',
    order: 11,
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
    order: 12,
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
