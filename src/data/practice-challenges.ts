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
  // TIER 1 — SYNTAX & I/O (Q1–8)
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
# Write printing code below
`,
    testCases: [{ input: 'Alice', expectedOutput: 'Hello, Alice!', isExample: true }]
  },
  {
    id: 'py-basics-2',
    title: 'Print With sep and end',
    slug: 'print-with-sep-and-end',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 2,
    description: 'Read three values from separate lines. Print them on a single line separated by commas, with no trailing newline.',
    inputFormat: 'Three lines, each containing a string.',
    outputFormat: 'Comma-separated values with no trailing newline.',
    constraints: 'None.',
    starterCode: `val1 = input()
val2 = input()
val3 = input()
# Print using sep and end parameters
`,
    testCases: [{ input: 'apple\nbanana\ncherry', expectedOutput: 'apple,banana,cherry', isExample: true }]
  },
  {
    id: 'py-basics-3',
    title: 'Comments & Docstrings',
    slug: 'comments-and-docstrings',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 3,
    description: 'Write a function `greet` with a docstring containing `"Returns a greeting"`. Then print the docstring using the `__doc__` attribute. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Docstring content.',
    constraints: 'None.',
    starterCode: `def greet():
    # Write docstring here
    pass

# Print docstring below
`,
    testCases: [{ input: 'run', expectedOutput: 'Returns a greeting', isExample: true }]
  },
  {
    id: 'py-basics-4',
    title: 'f-string Basics',
    slug: 'f-string-basics',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 4,
    description: 'Read three values from separate lines: a product name (string), quantity (int), and unit price (float). Print a sentence in the format: `We bought <quantity> <product>s for $<price> total.` using an f-string.',
    inputFormat: 'Line 1: Product name\nLine 2: Quantity\nLine 3: Unit price',
    outputFormat: 'Sentence string.',
    constraints: 'None.',
    starterCode: `product = input()
qty = int(input())
price = float(input())
# Print using f-string
`,
    testCases: [{ input: 'apple\n5\n10.50', expectedOutput: 'We bought 5 apples for $10.5 total.', isExample: true }]
  },
  {
    id: 'py-basics-5',
    title: 'Basic Input Parsing',
    slug: 'basic-input-parsing',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 5,
    description: 'Read two space-separated integers on a single line and print their sum.',
    inputFormat: 'A line containing two space-separated integers.',
    outputFormat: 'Sum integer.',
    constraints: 'None.',
    starterCode: `# Read space-separated values, parse to integers, print sum
`,
    testCases: [{ input: '5 7', expectedOutput: '12', isExample: true }]
  },
  {
    id: 'py-basics-6',
    title: 'Formatting Numbers',
    slug: 'formatting-numbers',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 6,
    description: 'Read a float value from input and print it rounded to exactly 2 decimal places using string formatting.',
    inputFormat: 'A float number.',
    outputFormat: 'Float string with 2 decimal places.',
    constraints: 'None.',
    starterCode: `val = float(input())
# Print formatted float
`,
    testCases: [{ input: '3.14159', expectedOutput: '3.14', isExample: true }]
  },
  {
    id: 'py-basics-7',
    title: 'Multi-line Strings',
    slug: 'multi-line-strings',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 7,
    description: 'Print a 3-line string literal where the first line is `"Line 1"`, second line is `"Line 2"`, and third line is `"Line 3"` using a single triple-quoted string. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Three-line string.',
    constraints: 'None.',
    starterCode: `# Print triple-quoted string literal below
`,
    testCases: [{ input: 'run', expectedOutput: 'Line 1\nLine 2\nLine 3', isExample: true }]
  },
  {
    id: 'py-basics-8',
    title: 'Swap Two Variables',
    slug: 'swap-two-variables',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 8,
    description: 'Read two strings `a` and `b`. Swap their values in a single statement without using a temporary variable, and print them space-separated.',
    inputFormat: 'Line 1: string a\nLine 2: string b',
    outputFormat: 'Swapped values space-separated.',
    constraints: 'None.',
    starterCode: `a = input()
b = input()
# Swap values in a single statement, then print
`,
    testCases: [{ input: 'hello\nworld', expectedOutput: 'world hello', isExample: true }]
  },

  // ==========================================
  // TIER 2 — VARIABLES, TYPES & OPERATORS (Q9–18)
  // ==========================================
  {
    id: 'py-basics-9',
    title: 'Type Checking',
    slug: 'type-checking',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 9,
    description: 'Print the type name of these five values (in order, on new lines): `10`, `3.14`, `"hello"`, `[1, 2]`, and `True`. Use `type(x).__name__`. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Type names.',
    constraints: 'None.',
    starterCode: `# Print type names
`,
    testCases: [{ input: 'run', expectedOutput: 'int\nfloat\nstr\nlist\nbool', isExample: true }]
  },
  {
    id: 'py-basics-10',
    title: 'Type Conversion',
    slug: 'type-conversion',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 10,
    description: 'Read a string input. Attempt to convert it to an integer, then to a float. If conversion fails with a `ValueError`, print `"Invalid conversion"`. Otherwise, print the integer and float values space-separated.',
    inputFormat: 'A string representation of a number.',
    outputFormat: 'Integer and float, or error message.',
    constraints: 'None.',
    starterCode: `s = input()
# Attempt conversion, handle ValueError
`,
    testCases: [{ input: '12', expectedOutput: '12 12.0', isExample: true }, { input: 'abc', expectedOutput: 'Invalid conversion' }]
  },
  {
    id: 'py-basics-11',
    title: 'Arithmetic Operators',
    slug: 'arithmetic-operators',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 11,
    description: 'Read two integers `a` and `b`. Print the results of: `+`, `-`, `*`, `/`, `//`, `%`, and `**` on separate lines.',
    inputFormat: 'Line 1: int a\nLine 2: int b',
    outputFormat: 'Arithmetic results.',
    constraints: 'None.',
    starterCode: `a = int(input())
b = int(input())
# Print arithmetic operations
`,
    testCases: [{ input: '5\n2', expectedOutput: '7\n3\n10\n2.5\n2\n1\n25', isExample: true }]
  },
  {
    id: 'py-basics-12',
    title: 'Comparison Operators',
    slug: 'comparison-operators',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 12,
    description: 'Read two integers `a` and `b`. Print the boolean results of: `==`, `!=`, `>`, `<`, `>=`, and `<=` on separate lines.',
    inputFormat: 'Line 1: int a\nLine 2: int b',
    outputFormat: 'Boolean comparison results.',
    constraints: 'None.',
    starterCode: `a = int(input())
b = int(input())
# Print comparisons
`,
    testCases: [{ input: '5\n2', expectedOutput: 'False\nTrue\nTrue\nFalse\nTrue\nFalse', isExample: true }]
  },
  {
    id: 'py-basics-13',
    title: 'Logical Operators',
    slug: 'logical-operators',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 13,
    description: 'Read three booleans (convert string representations "True" or "False"). Print the boolean result of the expression: `(a and b) or not c`.',
    inputFormat: 'Three lines of booleans.',
    outputFormat: '`True` or `False`.',
    constraints: 'None.',
    starterCode: `a = input() == 'True'
b = input() == 'True'
c = input() == 'True'
# Print logical result
`,
    testCases: [{ input: 'True\nFalse\nFalse', expectedOutput: 'True', isExample: true }]
  },
  {
    id: 'py-basics-14',
    title: 'Bitwise Operators',
    slug: 'bitwise-operators',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 14,
    description: 'Read two integers `a` and `b`. Print the results of bitwise operations: `a & b`, `a | b`, `a ^ b`, `a << 1`, and `b >> 1` on separate lines.',
    inputFormat: 'Line 1: int a\nLine 2: int b',
    outputFormat: 'Bitwise operation results.',
    constraints: 'None.',
    starterCode: `a = int(input())
b = int(input())
# Print bitwise results
`,
    testCases: [{ input: '5\n3', expectedOutput: '1\n7\n6\n10\n1', isExample: true }]
  },
  {
    id: 'py-basics-15',
    title: 'Chained Comparisons',
    slug: 'chained-comparisons',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 15,
    description: 'Read three integers `a`, `x`, and `b`. Check if `x` falls strictly between `a` and `b` using chained comparisons (`a < x < b`). Print `True` or `False`.',
    inputFormat: 'Line 1: int a\nLine 2: int x\nLine 3: int b',
    outputFormat: '`True` or `False`.',
    constraints: 'None.',
    starterCode: `a = int(input())
x = int(input())
b = int(input())
# Print chained comparison result
`,
    testCases: [{ input: '5\n10\n15', expectedOutput: 'True', isExample: true }, { input: '5\n3\n10', expectedOutput: 'False' }]
  },
  {
    id: 'py-basics-16',
    title: 'Ternary Expression',
    slug: 'ternary-expression',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 16,
    description: 'Read an integer `score`. Print `"Pass"` if score >= 50, else `"Fail"` using a single-line ternary condition.',
    inputFormat: 'Integer score.',
    outputFormat: '`Pass` or `Fail`.',
    constraints: 'None.',
    starterCode: `score = int(input())
# Print result using ternary expression
`,
    testCases: [{ input: '75', expectedOutput: 'Pass', isExample: true }, { input: '40', expectedOutput: 'Fail' }]
  },
  {
    id: 'py-basics-17',
    title: 'Multiple Assignment',
    slug: 'multiple-assignment',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 17,
    description: 'Assign three variables in a single line: `a, b, c = 1, 2, 3` and print them space-separated. Then unpack a tuple `(10, 20)` into `x` and `y` and print them space-separated. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Assigned values.',
    constraints: 'None.',
    starterCode: `# Perform multiple assignments and unpacking, print outputs
`,
    testCases: [{ input: 'run', expectedOutput: '1 2 3\n10 20', isExample: true }]
  },
  {
    id: 'py-basics-18',
    title: 'is vs ==',
    slug: 'is-vs-equals',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 18,
    description: 'Create two distinct list instances `x` and `y` with equal values `[1, 2]`. Print the results of `x == y` and `x is y` on separate lines. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`True` and `False` values.',
    constraints: 'None.',
    starterCode: `# Demonstrate equals vs identity
`,
    testCases: [{ input: 'run', expectedOutput: 'True\nFalse', isExample: true }]
  },

  // ==========================================
  // TIER 3 — CONTROL FLOW (Q19–28)
  // ==========================================
  {
    id: 'py-basics-19',
    title: 'Even or Odd Number',
    slug: 'even-or-odd-number',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 19,
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
    id: 'py-basics-20',
    title: 'Leap Year Calculator',
    slug: 'leap-year-calculator',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 20,
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
    id: 'py-basics-21',
    title: 'The Classic FizzBuzz',
    slug: 'classic-fizzbuzz',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 21,
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
    id: 'py-basics-22',
    title: 'Grade Calculator',
    slug: 'grade-calculator',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 22,
    description: 'Map a numeric score to a letter grade: score >= 90 is `A`, >= 80 is `B`, >= 70 is `C`, >= 60 is `D`, else `F`.',
    inputFormat: 'Integer score.',
    outputFormat: 'Letter grade.',
    constraints: '0 <= score <= 100.',
    starterCode: `score = int(input())
# Print letter grade
`,
    testCases: [{ input: '85', expectedOutput: 'B', isExample: true }, { input: '55', expectedOutput: 'F' }]
  },
  {
    id: 'py-basics-23',
    title: 'Guess-the-Number Loop',
    slug: 'guess-the-number-loop',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 23,
    description: 'Given a target number 7, read guesses from input until the guess matches the target. Print the total count of attempts.',
    inputFormat: 'Guesses on separate lines.',
    outputFormat: 'Integer attempts count.',
    constraints: 'None.',
    starterCode: `target = 7
# Loop inputs until guess matches target, print count of attempts
`,
    testCases: [{ input: '1\n5\n7', expectedOutput: '3', isExample: true }]
  },
  {
    id: 'py-basics-24',
    title: 'Loop-Else Clause',
    slug: 'loop-else-clause',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 24,
    description: 'Iterate through integers 1 to 5. If input `target` is found in the sequence, print `"Found"` and break the loop. If the loop completes without breaking, print `"Not Found"` inside the `else` block.',
    inputFormat: 'Integer target.',
    outputFormat: '`Found` or `Not Found`.',
    constraints: 'None.',
    starterCode: `target = int(input())
# Write for...else loop
`,
    testCases: [{ input: '3', expectedOutput: 'Found', isExample: true }, { input: '10', expectedOutput: 'Not Found' }]
  },
  {
    id: 'py-basics-25',
    title: 'Multiplication Table',
    slug: 'multiplication-table',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 25,
    description: 'Read an integer `n`. Print its multiplication table values from 1 to 5 space-separated.',
    inputFormat: 'Integer n.',
    outputFormat: 'Space-separated multiples.',
    constraints: 'None.',
    starterCode: `n = int(input())
# Print table values
`,
    testCases: [{ input: '3', expectedOutput: '3 6 9 12 15', isExample: true }]
  },
  {
    id: 'py-basics-26',
    title: 'break and continue',
    slug: 'break-and-continue',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 26,
    description: 'Iterate from 1 to 20. If the number is a multiple of 3, skip it. If the number is 18, break the loop entirely. Print remaining numbers space-separated.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Space-separated numbers.',
    constraints: 'None.',
    starterCode: `# break and continue loop
`,
    testCases: [{ input: 'run', expectedOutput: '1 2 4 5 7 8 10 11 13 14 16 17', isExample: true }]
  },
  {
    id: 'py-basics-27',
    title: 'Right-Triangle Pattern',
    slug: 'right-triangle-pattern',
    difficulty: 'intermediate',
    section: 'basics',
    category: 'python',
    order: 27,
    description: 'Read an integer `n`. Print a right triangle of stars (`*`), `n` rows tall.',
    inputFormat: 'Integer n.',
    outputFormat: 'Triangle pattern.',
    constraints: 'None.',
    starterCode: `n = int(input())
# Print star pattern
`,
    testCases: [{ input: '3', expectedOutput: '*\n**\n***', isExample: true }]
  },
  {
    id: 'py-basics-28',
    title: 'Simple State Machine',
    slug: 'simple-state-machine',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 28,
    description: 'State starts as `"OFF"`. Read commands from input on separate lines. If `"ON"`, change state to `"ON"`. If `"OFF"`, change state to `"OFF"`. If `"toggle"`, flip the state. If `"quit"`, stop. Print final state.',
    inputFormat: 'Commands list.',
    outputFormat: 'Final state.',
    constraints: 'None.',
    starterCode: `# Loop commands, modify state, print final state
`,
    testCases: [{ input: 'ON\ntoggle\nquit', expectedOutput: 'OFF', isExample: true }]
  },

  // ==========================================
  // TIER 4 — STRINGS (Q29–38)
  // ==========================================
  {
    id: 'py-basics-29',
    title: 'Indexing & Slicing',
    slug: 'indexing-slicing-strings',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 29,
    description: 'Read a word. Print its first 3 characters, last 3 characters, and the middle character (index `length // 2`) on separate lines.',
    inputFormat: 'A word string.',
    outputFormat: 'Three lines of characters.',
    constraints: 'Word length >= 3.',
    starterCode: `word = input()
# Print slices
`,
    testCases: [{ input: 'datalogify', expectedOutput: 'dat\nify\nl', isExample: true }]
  },
  {
    id: 'py-basics-30',
    title: 'Reverse a String',
    slug: 'reverse-a-string',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 30,
    description: 'Read a string. Reverse it using slicing `[::-1]` and print.',
    inputFormat: 'A string.',
    outputFormat: 'Reversed string.',
    constraints: 'None.',
    starterCode: `s = input()
# Reverse and print
`,
    testCases: [{ input: 'python', expectedOutput: 'nohtyp', isExample: true }]
  },
  {
    id: 'py-basics-31',
    title: 'Palindrome Checker',
    slug: 'palindrome-checker',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 31,
    description: 'Read a phrase. Check if it is a palindrome, ignoring case and spaces. Print `True` or `False`.',
    inputFormat: 'A phrase string.',
    outputFormat: '`True` or `False`.',
    constraints: 'None.',
    starterCode: `s = input()
# Palindrome checking
`,
    testCases: [{ input: 'A man a plan a canal Panama', expectedOutput: 'True', isExample: true }]
  },
  {
    id: 'py-basics-32',
    title: 'Count Vowels',
    slug: 'count-vowels',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 32,
    description: 'Read a sentence. Print the total count of vowels (a, e, i, o, u), case-insensitive.',
    inputFormat: 'A sentence string.',
    outputFormat: 'Integer vowels count.',
    constraints: 'None.',
    starterCode: `s = input()
# Count vowels
`,
    testCases: [{ input: 'Hello World', expectedOutput: '3', isExample: true }]
  },
  {
    id: 'py-basics-33',
    title: 'Case Methods',
    slug: 'case-methods',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 33,
    description: 'Read a string. Print it in Title Case, Capitalized, and with Swapped Cases on separate lines.',
    inputFormat: 'A string.',
    outputFormat: 'Three lines of formatted strings.',
    constraints: 'None.',
    starterCode: `s = input()
# Print case conversions
`,
    testCases: [{ input: 'pyTHon PrActiCe', expectedOutput: 'Python Practice\nPython practice\nPYthON pRaCTIcE', isExample: true }]
  },
  {
    id: 'py-basics-34',
    title: 'Split and Join',
    slug: 'split-and-join',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 34,
    description: 'Read a space-separated sentence. Split it by spaces, and rejoin it with hyphens. Print result.',
    inputFormat: 'Space-separated sentence.',
    outputFormat: 'Hyphenated string.',
    constraints: 'None.',
    starterCode: `s = input()
# Split and join
`,
    testCases: [{ input: 'Split this sentence', expectedOutput: 'Split-this-sentence', isExample: true }]
  },
  {
    id: 'py-basics-35',
    title: '.format() Method',
    slug: 'format-method',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 35,
    description: 'Read two lines containing name and item. Build and print the sentence `"Hello {name}, your {item} is ready."` using the `.format()` method.',
    inputFormat: 'Line 1: name\nLine 2: item',
    outputFormat: 'Formatted string.',
    constraints: 'None.',
    starterCode: `name = input()
item = input()
# Format and print
`,
    testCases: [{ input: 'Bob\norder', expectedOutput: 'Hello Bob, your order is ready.', isExample: true }]
  },
  {
    id: 'py-basics-36',
    title: 'Anagram Checker',
    slug: 'anagram-checker',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 36,
    description: 'Read two space-separated words on a single line. Check if they are anagrams (contain identical character frequencies). Print `True` or `False`.',
    inputFormat: 'Two space-separated words.',
    outputFormat: '`True` or `False`.',
    constraints: 'None.',
    starterCode: `w1, w2 = input().split()
# Anagram checking
`,
    testCases: [{ input: 'listen silent', expectedOutput: 'True', isExample: true }, { input: 'hello world', expectedOutput: 'False' }]
  },
  {
    id: 'py-basics-37',
    title: 'Longest Word in a Sentence',
    slug: 'longest-word-in-sentence',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 37,
    description: 'Read a sentence. Find and print the longest word in it (split by spaces, ignoring punctuation).',
    inputFormat: 'A sentence string.',
    outputFormat: 'Longest word.',
    constraints: 'None.',
    starterCode: `s = input()
# Find longest word
`,
    testCases: [{ input: 'Learning Python is absolutely amazing', expectedOutput: 'absolutely', isExample: true }]
  },
  {
    id: 'py-basics-38',
    title: 'Character Frequency Sorter',
    slug: 'character-frequency-sorter',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 38,
    description: 'Read a string. Count character frequencies and print them in `char:count` format, sorted by count descending, then alphabetically on tie. One character per line.',
    inputFormat: 'A word string.',
    outputFormat: 'Frequencies list.',
    constraints: 'None.',
    starterCode: `s = input()
# Count, sort, and print
`,
    testCases: [{ input: 'banana', expectedOutput: 'a:3\nn:2\nb:1', isExample: true }]
  },

  // ==========================================
  // TIER 5 — LISTS & TUPLES (Q39–48)
  // ==========================================
  {
    id: 'py-basics-39',
    title: 'Append, Insert, Remove',
    slug: 'append-insert-remove',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 39,
    description: 'Start with an empty list. Read three inputs in order. Append the 1st input, insert the 2nd input at index 0, and remove the 3rd input. Print the final list.',
    inputFormat: 'Three lines of strings.',
    outputFormat: 'List representation.',
    constraints: 'None.',
    starterCode: `val1 = input()
val2 = input()
val3 = input()
# Perform append, insert, remove
`,
    testCases: [{ input: 'apple\nbanana\napple', expectedOutput: "['banana']", isExample: true }]
  },
  {
    id: 'py-basics-40',
    title: 'List Slicing Drills',
    slug: 'list-slicing-drills',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 40,
    description: 'Given list `[10, 20, 30, 40, 50, 60]`. Extract first 3 elements, last 2 elements, and every 2nd element. Print on separate lines. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Slices.',
    constraints: 'None.',
    starterCode: `lst = [10, 20, 30, 40, 50, 60]
# Print slices
`,
    testCases: [{ input: 'run', expectedOutput: '[10, 20, 30]\n[50, 60]\n[10, 30, 50]', isExample: true }]
  },
  {
    id: 'py-basics-41',
    title: 'List Sum and Average',
    slug: 'list-sum-and-average',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 41,
    description: 'Read space-separated floats. Calculate and print their sum and the average rounded to 2 decimal places, space-separated.',
    inputFormat: 'Space-separated floats.',
    outputFormat: '`<sum> <average>`.',
    constraints: 'None.',
    starterCode: `nums = [float(x) for x in input().split()]
# Calculate sum, average and print
`,
    testCases: [{ input: '10.5 20.0 30.5', expectedOutput: '61.0 20.33', isExample: true }]
  },
  {
    id: 'py-basics-42',
    title: 'Max/Min Without Built-ins',
    slug: 'max-min-without-built-ins',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 42,
    description: 'Find the maximum and minimum numbers in a list of space-separated integers without using `max()` or `min()`. Print them space-separated: `max min`.',
    inputFormat: 'Space-separated integers.',
    outputFormat: '`max min`.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]
# Loop and find max and min
`,
    testCases: [{ input: '5 3 9 1 7', expectedOutput: '9 1', isExample: true }]
  },
  {
    id: 'py-basics-43',
    title: 'Remove Duplicates, Keep Order',
    slug: 'remove-duplicates-keep-order',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 43,
    description: 'Remove duplicate numbers from a list of space-separated integers while preserving original order. Print result space-separated.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Deduplicated space-separated values.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]
# Remove duplicates preserving order
`,
    testCases: [{ input: '3 1 3 2 1', expectedOutput: '3 1 2', isExample: true }]
  },
  {
    id: 'py-basics-44',
    title: 'Flatten a Nested List',
    slug: 'flatten-nested-list',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 44,
    description: 'Write a recursive function to fully flatten a nested list of elements. Print the flattened list space-separated.',
    inputFormat: 'A nested list string representation.',
    outputFormat: 'Space-separated numbers.',
    constraints: 'None.',
    starterCode: `lst = eval(input())
def flatten(l):
    # Flatten list l recursively
    pass
`,
    testCases: [{ input: '[1, [2, [3, 4]], 5]', expectedOutput: '1 2 3 4 5', isExample: true }]
  },
  {
    id: 'py-basics-45',
    title: 'Second Largest Number',
    slug: 'second-largest-number-basics',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 45,
    description: 'Find the second largest number in a list of space-separated integers, skipping duplicate maximums. If none exists, print `None`.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Integer or `None`.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]
# Find second largest
`,
    testCases: [{ input: '2 3 6 6 5', expectedOutput: '5', isExample: true }, { input: '10 10', expectedOutput: 'None' }]
  },
  {
    id: 'py-basics-46',
    title: 'Rotate a List',
    slug: 'rotate-a-list',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 46,
    description: 'Read an integer `k` on the first line, then space-separated integers on the second line. Rotate the list to the right by `k` positions. Print space-separated.',
    inputFormat: 'Line 1: k\nLine 2: space-separated integers',
    outputFormat: 'Rotated list values.',
    constraints: 'None.',
    starterCode: `k = int(input())
lst = [int(x) for x in input().split()]
# Rotate and print
`,
    testCases: [{ input: '2\n1 2 3 4 5', expectedOutput: '4 5 1 2 3', isExample: true }]
  },
  {
    id: 'py-basics-47',
    title: 'Tuple Unpacking',
    slug: 'tuple-unpacking',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 47,
    description: 'Read space-separated strings, unpack them, and print values on separate lines.',
    inputFormat: 'Space-separated strings.',
    outputFormat: 'Unpacked values.',
    constraints: 'None.',
    starterCode: `vals = input().split()
# Unpack values and print
`,
    testCases: [{ input: 'apple banana cherry', expectedOutput: 'apple\nbanana\ncherry', isExample: true }]
  },
  {
    id: 'py-basics-48',
    title: 'Zip Two Lists',
    slug: 'zip-two-lists',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 48,
    description: 'Read two lines. Line 1: Space-separated names. Line 2: Space-separated scores. Zip them into pairs and print `name:score` on separate lines.',
    inputFormat: 'Line 1: Names\nLine 2: Scores',
    outputFormat: 'Key-value pairs.',
    constraints: 'None.',
    starterCode: `names = input().split()
scores = input().split()
# Zip and print
`,
    testCases: [{ input: 'Alice Bob\n95 88', expectedOutput: 'Alice:95\nBob:88', isExample: true }]
  },

  // ==========================================
  // TIER 6 — SETS & DICTIONARIES (Q49–56)
  // ==========================================
  {
    id: 'py-basics-49',
    title: 'Set Operations Explorer',
    slug: 'set-operations-explorer',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 49,
    description: 'Read two lines of space-separated integers. Print: union, intersection, difference (`set1 - set2`), and symmetric difference of the two sets as sorted lists on separate lines.',
    inputFormat: 'Line 1: set1 integers\nLine 2: set2 integers',
    outputFormat: 'Lists of operations.',
    constraints: 'None.',
    starterCode: `s1 = set(int(x) for x in input().split())
s2 = set(int(x) for x in input().split())
# Compute set operations and print
`,
    testCases: [{ input: '1 2 3\n3 4 5', expectedOutput: '[1, 2, 3, 4, 5]\n[3]\n[1, 2]\n[1, 2, 4, 5]', isExample: true }]
  },
  {
    id: 'py-basics-50',
    title: 'Common Elements via Sets',
    slug: 'common-elements-via-sets',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 50,
    description: 'Find the common elements of two lists of space-separated integers using set intersection. Print them sorted, space-separated.',
    inputFormat: 'Line 1: list1\nLine 2: list2',
    outputFormat: 'Common elements.',
    constraints: 'None.',
    starterCode: `l1 = [int(x) for x in input().split()]
l2 = [int(x) for x in input().split()]
# Print common elements
`,
    testCases: [{ input: '1 2 3 4\n3 4 5 6', expectedOutput: '3 4', isExample: true }]
  },
  {
    id: 'py-basics-51',
    title: 'Dictionary Word Counter',
    slug: 'dictionary-word-counter',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 51,
    description: 'Read a space-separated sentence. Build a dictionary mapping each word to its occurrence count. Print key-value mappings sorted alphabetically in format `word:count`.',
    inputFormat: 'Space-separated words.',
    outputFormat: 'Frequencies list.',
    constraints: 'None.',
    starterCode: `words = input().split()
# Count and print sorted
`,
    testCases: [{ input: 'apple banana apple', expectedOutput: 'apple:2\nbanana:1', isExample: true }]
  },
  {
    id: 'py-basics-52',
    title: 'Nested Dictionary Lookup',
    slug: 'nested-dictionary-lookup',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 52,
    description: 'Read a nested dictionary string mapping student name to subjects and marks. Print each student name and their average marks rounded to 1 decimal place.',
    inputFormat: 'Dictionary string.',
    outputFormat: 'Averages list.',
    constraints: 'None.',
    starterCode: `data = eval(input())
# Print student averages
`,
    testCases: [{ input: "{'Alice': {'Math': 90, 'Science': 80}, 'Bob': {'Math': 70}}", expectedOutput: 'Alice:85.0\nBob:70.0', isExample: true }]
  },
  {
    id: 'py-basics-53',
    title: 'Merge Two Dictionaries',
    slug: 'merge-two-dictionaries',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 53,
    description: "Read two dictionary strings on separate lines. Merge them (second overrides first on key conflict). Print the merged dictionary representation sorted by keys.",
    inputFormat: 'Line 1: dict1\nLine 2: dict2',
    outputFormat: 'Merged dictionary representation.',
    constraints: 'None.',
    starterCode: `d1 = eval(input())
d2 = eval(input())
# Merge and print sorted
`,
    testCases: [{ input: "{'a': 1, 'b': 2}\n{'b': 3, 'c': 4}", expectedOutput: "{'a': 1, 'b': 3, 'c': 4}", isExample: true }]
  },
  {
    id: 'py-basics-54',
    title: 'Invert a Dictionary',
    slug: 'invert-a-dictionary',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 54,
    description: 'Read a dictionary string where values are unique. Swap keys and values, and print the inverted dictionary representation sorted by keys.',
    inputFormat: 'Dictionary string.',
    outputFormat: 'Inverted dictionary.',
    constraints: 'None.',
    starterCode: `d = eval(input())
# Invert and print
`,
    testCases: [{ input: "{'a': 'x', 'b': 'y'}", expectedOutput: "{'x': 'a', 'y': 'b'}", isExample: true }]
  },
  {
    id: 'py-basics-55',
    title: 'Dictionary Comprehension',
    slug: 'dictionary-comprehension',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 55,
    description: 'Read two space-separated lines. Line 1: keys, Line 2: values. Create a dictionary using a comprehension. Print it sorted by keys.',
    inputFormat: 'Line 1: Keys\nLine 2: Values',
    outputFormat: 'Dictionary representation.',
    constraints: 'None.',
    starterCode: `keys = input().split()
vals = input().split()
# Create dictionary using comprehension, print sorted
`,
    testCases: [{ input: 'a b\n1 2', expectedOutput: "{'a': '1', 'b': '2'}", isExample: true }]
  },
  {
    id: 'py-basics-56',
    title: 'Missing Number via Sets',
    slug: 'missing-number-via-sets',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 56,
    description: 'Find the missing number in range 0 to n from a list of space-separated integers using set difference.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Integer.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]
# Find missing number
`,
    testCases: [{ input: '3 0 1', expectedOutput: '2', isExample: true }]
  },

  // ==========================================
  // TIER 7 — FUNCTIONS & SCOPE (Q57–66)
  // ==========================================
  {
    id: 'py-basics-57',
    title: 'Define & Call a Function',
    slug: 'define-call-function',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 57,
    description: 'Write a function `square(n)` that returns the square of n. Read n and print the result.',
    inputFormat: 'Integer n.',
    outputFormat: 'Squared value.',
    constraints: 'None.',
    starterCode: `def square(n):
    # Write logic below
    pass

val = int(input())
print(square(val))
`,
    testCases: [{ input: '4', expectedOutput: '16', isExample: true }]
  },
  {
    id: 'py-basics-58',
    title: 'Default & Keyword Args',
    slug: 'default-keyword-args',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 58,
    description: 'Write a function `greet(name, greeting="Hello")` returning `f"{greeting}, {name}!"`. Read name and optional greeting; print output.',
    inputFormat: 'Line 1: Name\nLine 2: Greeting',
    outputFormat: 'Greeting string.',
    constraints: 'None.',
    starterCode: `def greet(name, greeting="Hello"):
    # Write logic below
    pass

name = input()
greeting = input()
print(greet(name, greeting))
`,
    testCases: [{ input: 'Alice\nHi', expectedOutput: 'Hi, Alice!', isExample: true }]
  },
  {
    id: 'py-basics-59',
    title: '*args and **kwargs',
    slug: 'args-and-kwargs',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 59,
    description: 'Implement a function `process_data(*args, **kwargs)` that returns the sum of `args` plus the sum of values of `kwargs`.',
    inputFormat: 'Line 1: args space-separated\nLine 2: kwargs dict representation',
    outputFormat: 'Sum integer.',
    constraints: 'None.',
    starterCode: `args = [int(x) for x in input().split()]
kwargs = eval(input())

def process_data(*args, **kwargs):
    # Write logic below
    pass

print(process_data(*args, **kwargs))
`,
    testCases: [{ input: '1 2\n{"x": 3, "y": 4}', expectedOutput: '10', isExample: true }]
  },
  {
    id: 'py-basics-60',
    title: 'Return Multiple Values',
    slug: 'return-multiple-values',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 60,
    description: 'Write a function `stats(lst)` returning min, max, and average as a tuple. Print them space-separated.',
    inputFormat: 'Space-separated integers.',
    outputFormat: '`<min> <max> <average>`.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]

def stats(lst):
    # Return stats tuple
    pass

print(" ".join(str(x) for x in stats(nums)))
`,
    testCases: [{ input: '10 20 30', expectedOutput: '10 30 20.0', isExample: true }]
  },
  {
    id: 'py-basics-61',
    title: 'Local vs Global Scope',
    slug: 'local-vs-global-scope',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 61,
    description: 'Increment a global variable `counter` inside a function `increment()`. Print the counter before and after calling the function. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Counter values.',
    constraints: 'None.',
    starterCode: `counter = 0

def increment():
    # Modify global counter
    pass

print(counter)
increment()
print(counter)
`,
    testCases: [{ input: 'run', expectedOutput: '0\n1', isExample: true }]
  },
  {
    id: 'py-basics-62',
    title: 'Recursive Factorial',
    slug: 'recursive-factorial',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 62,
    description: 'Write a recursive function `factorial(n)`. Print result.',
    inputFormat: 'Integer n.',
    outputFormat: 'Factorial value.',
    constraints: 'None.',
    starterCode: `n = int(input())

def factorial(n):
    # Recursive calculation
    pass

print(factorial(n))
`,
    testCases: [{ input: '5', expectedOutput: '120', isExample: true }]
  },
  {
    id: 'py-basics-63',
    title: 'Recursive Fibonacci',
    slug: 'recursive-fibonacci',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 63,
    description: 'Write a recursive function `fib(n)` returning the nth Fibonacci number (fib(0)=0, fib(1)=1, fib(2)=1, etc.). Print output.',
    inputFormat: 'Integer n.',
    outputFormat: 'Fibonacci value.',
    constraints: 'None.',
    starterCode: `n = int(input())

def fib(n):
    # Recursive calculation
    pass

print(fib(n))
`,
    testCases: [{ input: '6', expectedOutput: '8', isExample: true }]
  },
  {
    id: 'py-basics-64',
    title: 'Recursion: Sum of Digits',
    slug: 'recursion-sum-of-digits-basics',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 64,
    description: 'Recursively sum digits of an integer `n` down to one digit.',
    inputFormat: 'Integer n.',
    outputFormat: 'Single digit.',
    constraints: 'None.',
    starterCode: `n = int(input())

def sum_digits(n):
    # Recursive summation
    pass

print(sum_digits(n))
`,
    testCases: [{ input: '9875', expectedOutput: '2', isExample: true }]
  },
  {
    id: 'py-basics-65',
    title: 'Higher-Order Functions',
    slug: 'higher-order-functions',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 65,
    description: 'Write a function `apply_func(func, lst)` that applies function `func` to every element in list `lst`. Use it to double a list of space-separated integers. Print result space-separated.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Doubled integers.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]

def double(x):
    return x * 2

def apply_func(func, lst):
    # Apply function and return list
    pass

print(" ".join(str(x) for x in apply_func(double, nums)))
`,
    testCases: [{ input: '1 2 3', expectedOutput: '2 4 6', isExample: true }]
  },
  {
    id: 'py-basics-66',
    title: 'Lambda With sorted()',
    slug: 'lambda-with-sorted',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 66,
    description: 'Read tuple string list. Sort the list of tuples by their second element using `key=lambda x: x[1]`. Print sorted list representation.',
    inputFormat: 'Tuples list.',
    outputFormat: 'Sorted tuples.',
    constraints: 'None.',
    starterCode: `lst = eval(input())
# Sort list using lambda key and print
`,
    testCases: [{ input: "[('A', 10), ('B', 5)]", expectedOutput: "[('B', 5), ('A', 10)]", isExample: true }]
  },

  // ==========================================
  // TIER 8 — COMPREHENSIONS & FUNCTIONAL TOOLS (Q67–72)
  // ==========================================
  {
    id: 'py-basics-67',
    title: 'List Comprehension Drills',
    slug: 'list-comprehension-drills-basics',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 67,
    description: 'Create a list comprehension that filters even numbers from space-separated input, squares them, and prints them space-separated.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Squared evens.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]
# List comprehension output
`,
    testCases: [{ input: '1 2 3 4 5', expectedOutput: '4 16', isExample: true }]
  },
  {
    id: 'py-basics-68',
    title: 'Set & Dict Comprehensions',
    slug: 'set-dict-comprehensions-basics',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 68,
    description: 'Generate a set of lengths of words from space-separated input, and a dict of `word:len` using comprehensions. Print sorted set and sorted dict representation.',
    inputFormat: 'Space-separated words.',
    outputFormat: 'Set and dict.',
    constraints: 'None.',
    starterCode: `words = input().split()
# Set and Dict comprehensions
`,
    testCases: [{ input: 'apple boy cat', expectedOutput: '[3, 5]\n{"apple": 5, "boy": 3, "cat": 3}', isExample: true }]
  },
  {
    id: 'py-basics-69',
    title: 'map() and filter()',
    slug: 'map-and-filter',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 69,
    description: 'Double every number in space-separated input with `map()`, then keep only evens with `filter()`. Print space-separated list of results.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Mapped and filtered values.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]
# Use map and filter
`,
    testCases: [{ input: '1 2 3 4', expectedOutput: '2 4 6 8', isExample: true }]
  },
  {
    id: 'py-basics-70',
    title: 'reduce() from functools',
    slug: 'reduce-from-functools-basics',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 70,
    description: 'Compute the product of a list of space-separated integers using `functools.reduce`.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Product value.',
    constraints: 'None.',
    starterCode: `from functools import reduce
nums = [int(x) for x in input().split()]
# Use reduce
`,
    testCases: [{ input: '1 2 3 4', expectedOutput: '24', isExample: true }]
  },
  {
    id: 'py-basics-71',
    title: 'Nested Comprehensions',
    slug: 'nested-comprehensions',
    difficulty: 'advanced',
    category: 'python',
    section: 'basics',
    order: 71,
    description: 'Flatten a 2D matrix (represented as list of lists) into a 1D list using a single nested comprehension. Print space-separated.',
    inputFormat: '2D matrix representation.',
    outputFormat: '1D flat list.',
    constraints: 'None.',
    starterCode: `matrix = eval(input())
# Flatten and print
`,
    testCases: [{ input: '[[1, 2], [3, 4]]', expectedOutput: '1 2 3 4', isExample: true }]
  },
  {
    id: 'py-basics-72',
    title: 'Conditional Comprehension',
    slug: 'conditional-comprehension',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 72,
    description: 'Build a list comprehension that labels each number in space-separated input as `"even"` or `"odd"`. Print space-separated.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Labels.',
    constraints: 'None.',
    starterCode: `nums = [int(x) for x in input().split()]
# Conditional comprehension
`,
    testCases: [{ input: '1 2 3', expectedOutput: 'odd even odd', isExample: true }]
  },

  // ==========================================
  // TIER 9 — OBJECT-ORIENTED PROGRAMMING (Q73–80)
  // ==========================================
  {
    id: 'py-basics-73',
    title: 'Classes & Objects 101',
    slug: 'oop-classes-objects',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 73,
    description: 'Define a class `User` with a name attribute initialized in `__init__`, and a method `greet()` returning `"Hello <name>"`. Print result of `greet()`.',
    inputFormat: 'Name string.',
    outputFormat: 'Greeting string.',
    constraints: 'None.',
    starterCode: `name = input()
# Define User class and print greeting
`,
    testCases: [{ input: 'Alice', expectedOutput: 'Hello Alice', isExample: true }]
  },
  {
    id: 'py-basics-74',
    title: 'Instance vs Class Attributes',
    slug: 'instance-vs-class-attributes',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 74,
    description: 'Define a class `Counter` with a class attribute `count = 0` incremented every time `__init__` is called, and an instance attribute `name`. Create 2 counters and print the class `Counter.count`. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Count value.',
    constraints: 'None.',
    starterCode: `# Define Counter class and create instances
`,
    testCases: [{ input: 'run', expectedOutput: '2', isExample: true }]
  },
  {
    id: 'py-basics-75',
    title: 'Inheritance & Override',
    slug: 'oop-inheritance-override',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 75,
    description: 'Define base class `Shape` with `draw()` returning `"Shape"`. Define subclass `Circle` that overrides `draw()` to return `"Circle"`. Call both and print outputs on separate lines. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Two lines of text.',
    constraints: 'None.',
    starterCode: `# Inheritance overrides
`,
    testCases: [{ input: 'run', expectedOutput: 'Shape\nCircle', isExample: true }]
  },
  {
    id: 'py-basics-76',
    title: 'super() Usage',
    slug: 'oop-super-usage',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 76,
    description: 'Call parent `__init__` from subclass using `super()`. Subclass adds `color` attribute. Return string format `"{name} is {color}"`. Print result.',
    inputFormat: 'Line 1: Name\nLine 2: Color',
    outputFormat: 'Unpacked values.',
    constraints: 'None.',
    starterCode: `name = input()
color = input()
# Define Parent and Subclass calling super
`,
    testCases: [{ input: 'Dog\nBlack', expectedOutput: 'Dog is Black', isExample: true }]
  },
  {
    id: 'py-basics-77',
    title: 'Properties (@property)',
    slug: 'oop-properties',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 77,
    description: 'Define a class `Square` with a side attribute and a property `area` returning `side * side`. Print area.',
    inputFormat: 'Integer side.',
    outputFormat: 'Area value.',
    constraints: 'None.',
    starterCode: `side = int(input())
# Define Square with area property
`,
    testCases: [{ input: '4', expectedOutput: '16', isExample: true }]
  },
  {
    id: 'py-basics-78',
    title: 'Magic Methods',
    slug: 'magic-methods',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 78,
    description: 'Define a class `Book` with title and author attributes. Implement `__str__` returning `"Title by Author"`. Print the string representation of Book.',
    inputFormat: 'Line 1: Title\nLine 2: Author',
    outputFormat: 'Formatted string.',
    constraints: 'None.',
    starterCode: `title = input()
author = input()
# Implement Book class with __str__
`,
    testCases: [{ input: 'Hamlet\nShakespeare', expectedOutput: 'Hamlet by Shakespeare', isExample: true }]
  },
  {
    id: 'py-basics-79',
    title: 'Operator Overloading',
    slug: 'operator-overloading',
    difficulty: 'advanced',
    category: 'python',
    section: 'basics',
    order: 79,
    description: 'Overload `+` for a custom `Vector` class representing `(x, y)`. Adding two Vectors returns a new Vector. Print string representation.',
    inputFormat: 'Line 1: x1 y1\nLine 2: x2 y2',
    outputFormat: 'Vector string representation.',
    constraints: 'None.',
    starterCode: `x1, y1 = [int(i) for i in input().split()]
x2, y2 = [int(i) for i in input().split()]
# Implement Vector class overloading __add__
`,
    testCases: [{ input: '1 2\n3 4', expectedOutput: '(4, 6)', isExample: true }]
  },
  {
    id: 'py-basics-80',
    title: 'Polymorphism in Practice',
    slug: 'oop-polymorphism',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 80,
    description: 'Loop over animal instances (`Dog`, `Cat`) having `speak()` method returning `"Woof"` and `"Meow"` respectively. Call uniformly and print. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: 'Speak outputs.',
    constraints: 'None.',
    starterCode: `# Polymorphism speak loop
`,
    testCases: [{ input: 'run', expectedOutput: 'Woof\nMeow', isExample: true }]
  },

  // ==========================================
  // TIER 10 — ERRORS, FILES & MODULES (Q81–86)
  // ==========================================
  {
    id: 'py-basics-81',
    title: 'Exception Handling Basics',
    slug: 'exception-handling-basics-101',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 81,
    description: 'Divide a by b. Catch `ZeroDivisionError` (print `"ZeroDivisionError"`) and `ValueError` (print `"ValueError"`).',
    inputFormat: 'Line 1: input a\nLine 2: input b',
    outputFormat: 'Result or error.',
    constraints: 'None.',
    starterCode: `try:
    a = float(input())
    b = float(input())
    print(a / b)
except Exception as e:
    # Handle specific exceptions
    pass
`,
    testCases: [{ input: '10\n0', expectedOutput: 'ZeroDivisionError', isExample: true }, { input: 'abc\n2', expectedOutput: 'ValueError' }]
  },
  {
    id: 'py-basics-82',
    title: 'Multiple Except + finally',
    slug: 'multiple-except-finally',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 82,
    description: 'Try converting input to integer. Catch `ValueError` (print `ValueError`), but always run `finally` block (print `Done`).',
    inputFormat: 'Input string.',
    outputFormat: 'Converted value or error, followed by Done.',
    constraints: 'None.',
    starterCode: `s = input()
# Exception and finally blocks
`,
    testCases: [{ input: 'abc', expectedOutput: 'ValueError\nDone', isExample: true }, { input: '10', expectedOutput: '10\nDone' }]
  },
  {
    id: 'py-basics-83',
    title: 'Custom Exceptions',
    slug: 'custom-exceptions-custom',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 83,
    description: 'Define and raise a custom exception `NegativeNumberError` if input integer is negative. Catch and print its message.',
    inputFormat: 'Integer n.',
    outputFormat: 'Value or exception message.',
    constraints: 'None.',
    starterCode: `class NegativeNumberError(Exception):
    pass

# Read integer, raise and catch NegativeNumberError
`,
    testCases: [{ input: '-5', expectedOutput: 'Negative input not allowed', isExample: true }]
  },
  {
    id: 'py-basics-84',
    title: 'File Read & Write',
    slug: 'file-read-and-write',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 84,
    description: 'Write input text to a file named `temp.txt`, read it back, and print the count of lines written.',
    inputFormat: 'Multi-line text.',
    outputFormat: 'Line count integer.',
    constraints: 'None.',
    starterCode: `text = input()
# File read and write, print line count
`,
    testCases: [{ input: 'Line1\nLine2', expectedOutput: '2', isExample: true }]
  },
  {
    id: 'py-basics-85',
    title: 'Working with CSV Files',
    slug: 'working-with-csv-files',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 85,
    description: 'Read a simple CSV line string from input, parse it, and print each field value on a new line.',
    inputFormat: 'CSV string.',
    outputFormat: 'CSV fields list.',
    constraints: 'None.',
    starterCode: `import csv
# Parse csv and print
`,
    testCases: [{ input: 'apple,banana,cherry', expectedOutput: 'apple\nbanana\ncherry', isExample: true }]
  },
  {
    id: 'py-basics-86',
    title: 'Modules & Imports',
    slug: 'modules-and-imports-basics',
    difficulty: 'basic',
    category: 'python',
    section: 'basics',
    order: 86,
    description: 'Import `math` and print the value of `math.sqrt(16)` as an integer. Ignore stdin.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`4`.',
    constraints: 'None.',
    starterCode: `# Import modules
`,
    testCases: [{ input: 'run', expectedOutput: '4', isExample: true }]
  },

  // ==========================================
  // TIER 11 — ITERATORS, GENERATORS, DECORATORS, REGEX (Q87–90)
  // ==========================================
  {
    id: 'py-basics-87',
    title: 'Custom Iterator Class',
    slug: 'custom-iterator-class',
    difficulty: 'advanced',
    category: 'python',
    section: 'basics',
    order: 87,
    description: 'Create an iterator class `Range3` that returns multiples of 3 up to n. Print them space-separated.',
    inputFormat: 'Integer n.',
    outputFormat: 'Space-separated multiples.',
    constraints: 'None.',
    starterCode: `n = int(input())
# Custom iterator Range3
`,
    testCases: [{ input: '10', expectedOutput: '3 6 9', isExample: true }]
  },
  {
    id: 'py-basics-88',
    title: 'Generators with yield',
    slug: 'generators-with-yield',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 88,
    description: 'Write a generator function `squares(n)` yielding the squares of numbers from 1 to `n`. Print the yielded values space-separated.',
    inputFormat: 'Integer n.',
    outputFormat: 'Space-separated squares.',
    constraints: 'None.',
    starterCode: `n = int(input())
# Generator squares
`,
    testCases: [{ input: '5', expectedOutput: '1 4 9 16 25', isExample: true }]
  },
  {
    id: 'py-basics-89',
    title: 'Decorators: Timing',
    slug: 'decorators-timing',
    difficulty: 'advanced',
    category: 'python',
    section: 'basics',
    order: 89,
    description: 'Create a decorator `@verify` that prints `"Invalid"` if the first argument is negative, else calls decorated function.',
    inputFormat: 'Integer n.',
    outputFormat: 'Function output, or Invalid.',
    constraints: 'None.',
    starterCode: `n = int(input())
# Timing / verify decorator
`,
    testCases: [{ input: '-10', expectedOutput: 'Invalid', isExample: true }]
  },
  {
    id: 'py-basics-90',
    title: 'Regex Validation',
    slug: 'regex-email-validation',
    difficulty: 'intermediate',
    category: 'python',
    section: 'basics',
    order: 90,
    description: 'Validate if an input string is a valid email format containing letters/numbers, `@` symbol, and a domain name. Print `True` or `False`.',
    inputFormat: 'Email string.',
    outputFormat: '`True` or `False`.',
    constraints: 'None.',
    starterCode: `import re
# Regex email verification
`,
    testCases: [{ input: 'test@datalogify.com', expectedOutput: 'True', isExample: true }, { input: 'invalid-email', expectedOutput: 'False' }]
  },

  // ==========================================
  // SECTION 2: 📚 PRACTICE LIBRARIES (TIERS 12-14)
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
    order: 91,
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
    order: 92,
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
    order: 93,
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
    order: 94,
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
    order: 95,
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
    order: 96,
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
    order: 97,
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
    order: 98,
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
    order: 99,
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
    order: 100,
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
    order: 101,
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
    order: 102,
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
    order: 103,
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
    order: 104,
    description: 'Group sales by category and sum them. Print Category and sum space-separated, sorted alphabetically.',
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
    order: 105,
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
    order: 106,
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
    order: 107,
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
    order: 108,
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
    order: 109,
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
    order: 110,
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
    order: 111,
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
    order: 112,
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
    order: 113,
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
    order: 114,
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
    order: 115,
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
    order: 116,
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
    order: 117,
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
    order: 118,
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
    order: 119,
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
    order: 120,
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
    order: 121,
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
    order: 122,
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
    order: 123,
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
    order: 124,
    description: 'Use Seaborn to generate a histogram distribution plot of value series using `sns.histplot(data)`. Verify plotting.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
data = [1, 2, 2, 3, 3, 3, 4, 4, 5]

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
    order: 125,
    description: 'Create a vertical boxplot using `sns.boxplot(y=values)`. Verify box structure.',
    inputFormat: 'Ignore stdin.',
    outputFormat: '`PLOT_OK`.',
    constraints: 'None.',
    starterCode: `import seaborn as sns
import matplotlib.pyplot as plt
_ = input()
values = [10, 20, 15, 30, 25]

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
    order: 126,
    description: 'Generate a countplot of category occurrences using `sns.countplot(x="category", data=df)`. Verify.',
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
    order: 127,
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
    order: 128,
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
    order: 129,
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
    order: 130,
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
    order: 131,
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
    order: 132,
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
    order: 133,
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
    order: 134,
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
      { input: '10', expectedOutput: '0 1 1 2 3 5 8 13 21 34', isExample: true },
      { input: '1', expectedOutput: '0' }
    ]
  }
];
