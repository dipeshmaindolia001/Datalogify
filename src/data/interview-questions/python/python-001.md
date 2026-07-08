---
id: "python-001"
topic: "python"
title: "Reverse a String Without Built-ins"
level: "beginner"
type: "programming"
tags: ["strings", "programming"]
order: 1
question: |
  Write a Python function to reverse a string without using built-in methods like `reversed()` or slice step manipulations (like `s[::-1]`).
answer: |
  Using a loop:
  ```python
  def reverse_string(s: str) -> str:
      reversed_chars = []
      for i in range(len(s) - 1, -1, -1):
          reversed_chars.append(s[i])
      return "".join(reversed_chars)
  ```
explanation: |
  - We initialize an empty list `reversed_chars` to collect character values.
  - We iterate through the string indices backwards from `len(s) - 1` to `0` (inclusive).
  - We append each character at index `i` to the list.
  - Finally, we join the list of characters back into a single string. This avoids the cost of string concatenation inside the loop, which has \(O(N^2)\) complexity due to string immutability in Python.
followUp: |
  What is the time complexity of this solution?
  - It runs in \(O(N)\) time where \(N\) is the length of the string, and uses \(O(N)\) auxiliary space to store characters.
---
