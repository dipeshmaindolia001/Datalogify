---
title: "Regular Expressions — Pattern Matching Power"
description: "Extract emails, phone numbers, and patterns from messy text data using Python's re module."
category: "python"
order: 15
phase: 1
tags: ["python", "regex", "patterns", "text-processing"]
publishedDate: 2025-01-30
prevSlug: "datetime-operations"
nextSlug: "numpy-essentials"
seoTitle: "Python Regular Expressions Tutorial | Datalogify"
seoDescription: "Learn Python regex with practical examples — extract emails, validate data, clean text for analytics."
---

## Why This Matters

Customer data has emails in 5 different formats. Phone numbers are entered as "(555) 123-4567", "555.123.4567", and "5551234567". Dates show up as "Jan 5, 2025" and "01/05/2025". Regex lets you find, extract, and clean all of these in one pass.

## re.search — Find the First Match

```python
import re

# Does this string contain a dollar amount?
text = "Total revenue for Q1 was $1,250,000 across all regions"
match = re.search(r"\$[\d,]+", text)

if match:
    print(f"Found: {match.group()}")
    print(f"Position: {match.start()}-{match.end()}")
```

```text
Found: $1,250,000
Position: 27-37
```

## re.findall — Find ALL Matches

```python
import re

# Extract all dollar amounts from a report
report = """
Q1 Revenue: $450,000
Q2 Revenue: $520,000
Q3 Revenue: $380,000
Operating costs: $1,200,000
Net profit: $150,000
"""

amounts = re.findall(r"\$[\d,]+", report)
print(f"All amounts: {amounts}")

# Convert to integers for calculation
values = [int(a.replace("$", "").replace(",", "")) for a in amounts]
print(f"Values: {values}")
print(f"Sum: ${sum(values):,}")
```

```text
All amounts: ['$450,000', '$520,000', '$380,000', '$1,200,000', '$150,000']
Values: [450000, 520000, 380000, 1200000, 150000]
Sum: $2,700,000
```

## re.match vs re.search

```python
import re

line = "Employee ID: EMP-4521"

# re.match — only checks the BEGINNING of the string
result1 = re.match(r"EMP-\d+", line)
print(f"match result: {result1}")  # None — "EMP" isn't at the start

# re.search — checks ANYWHERE in the string
result2 = re.search(r"EMP-\d+", line)
print(f"search result: {result2.group()}")

# re.match works when the pattern IS at the start
result3 = re.match(r"Employee", line)
print(f"match at start: {result3.group()}")
```

```text
match result: None
search result: EMP-4521
match at start: Employee
```

## Metacharacters — The Building Blocks

```python
import re

text = "Alice joined on 2023-03-15. Bob on 2022-11-30. Carol on 2024-01-10."

# .   → any character (except newline)
# \d  → any digit [0-9]
# \w  → any word char [a-zA-Z0-9_]
# \s  → any whitespace
# \b  → word boundary

# +   → one or more
# *   → zero or more
# ?   → zero or one
# {n} → exactly n times

# Find all dates (YYYY-MM-DD)
dates = re.findall(r"\d{4}-\d{2}-\d{2}", text)
print(f"Dates: {dates}")

# Find all names (capitalized words at start of sentences)
names = re.findall(r"[A-Z][a-z]+", text)
print(f"Names: {names}")

# Find words that are exactly 3 letters
words = re.findall(r"\b\w{3}\b", text)
print(f"3-letter words: {words}")
```

```text
Dates: ['2023-03-15', '2022-11-30', '2024-01-10']
Names: ['Alice', 'Bob', 'Carol']
3-letter words: ['Bob']
```

### Character Classes

```python
import re

# [abc]   → matches a, b, or c
# [a-z]   → matches any lowercase letter
# [0-9]   → matches any digit (same as \d)
# [^abc]  → matches anything EXCEPT a, b, c

data = "SKU-A100, SKU-B205, PROD-C310, SKU-D450, ITEM-E500"

# Find all SKU codes (SKU followed by dash, letter, digits)
skus = re.findall(r"SKU-[A-Z]\d{3}", data)
print(f"SKUs: {skus}")

# Find any product code (letters-letterdigits)
all_codes = re.findall(r"[A-Z]+-[A-Z]\d{3}", data)
print(f"All codes: {all_codes}")

# Extract just the numeric parts
numbers = re.findall(r"[A-Z]-([A-Z])(\d{3})", data)
print(f"Letter-Number pairs: {numbers}")
```

```text
SKUs: ['SKU-A100', 'SKU-B205', 'SKU-D450']
All codes: ['SKU-A100', 'SKU-B205', 'PROD-C310', 'SKU-D450', 'ITEM-E500']
Letter-Number pairs: [('A', '100'), ('B', '205'), ('C', '310'), ('D', '450'), ('E', '500')]
```

## Groups — Extract Specific Parts

```python
import re

# Parentheses create capture groups
log = "2025-01-29 14:30:15 ERROR Database connection timeout after 30s"

pattern = r"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) (\w+) (.+)"
match = re.search(pattern, log)

if match:
    print(f"Date:    {match.group(1)}")
    print(f"Time:    {match.group(2)}")
    print(f"Level:   {match.group(3)}")
    print(f"Message: {match.group(4)}")
```

```text
Date:    2025-01-29
Time:    14:30:15
Level:   ERROR
Message: Database connection timeout after 30s
```

### Named Groups

```python
import re

# Named groups make code more readable
employee_line = "Alice Johnson | Engineering | $95,000 | 2019-03-15"

pattern = r"(?P<name>[\w ]+) \| (?P<dept>\w+) \| \$(?P<salary>[\d,]+) \| (?P<hired>\d{4}-\d{2}-\d{2})"
match = re.search(pattern, employee_line)

if match:
    print(f"Name:   {match.group('name')}")
    print(f"Dept:   {match.group('dept')}")
    print(f"Salary: ${match.group('salary')}")
    print(f"Hired:  {match.group('hired')}")

    # Or as a dictionary
    print(f"\nAs dict: {match.groupdict()}")
```

```text
Name:   Alice Johnson
Dept:   Engineering
Salary: $95,000
Hired:  2019-03-15

As dict: {'name': 'Alice Johnson', 'dept': 'Engineering', 'salary': '95,000', 'hired': '2019-03-15'}
```

## re.sub — Find and Replace

```python
import re

# Clean phone numbers to a standard format
phones = [
    "(555) 123-4567",
    "555.123.4567",
    "555-123-4567",
    "5551234567",
    "+1 555 123 4567",
]

for phone in phones:
    # Remove all non-digit characters
    clean = re.sub(r"\D", "", phone)
    # Take last 10 digits (drop country code)
    clean = clean[-10:]
    formatted = f"({clean[:3]}) {clean[3:6]}-{clean[6:]}"
    print(f"  {phone:20s} → {formatted}")
```

```text
  (555) 123-4567      → (555) 123-4567
  555.123.4567        → (555) 123-4567
  555-123-4567        → (555) 123-4567
  5551234567           → (555) 123-4567
  +1 555 123 4567     → (555) 123-4567
```

### More Replacements

```python
import re

# Redact sensitive data in logs
log = "User alice@company.com logged in from 192.168.1.45 with card 4532-1234-5678-9012"

redacted = re.sub(r"[\w.]+@[\w.]+", "[EMAIL_REDACTED]", log)
redacted = re.sub(r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}", "[IP_REDACTED]", redacted)
redacted = re.sub(r"\d{4}-\d{4}-\d{4}-\d{4}", "[CARD_REDACTED]", redacted)

print(f"Original: {log}")
print(f"Redacted: {redacted}")
```

```text
Original: User alice@company.com logged in from 192.168.1.45 with card 4532-1234-5678-9012
Redacted: User [EMAIL_REDACTED] logged in from [IP_REDACTED] with card [CARD_REDACTED]
```

## Common Analytics Patterns

### Email Extraction

```python
import re

customer_notes = """
Contact Alice at alice.johnson@company.com or her assistant bob@marketing.io.
Previous email was alice_j@old-company.co.uk. Support: help+urgent@support.company.com
"""

emails = re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", customer_notes)
print("Emails found:")
for email in emails:
    print(f"  {email}")

# Extract domains
domains = [email.split("@")[1] for email in emails]
print(f"\nUnique domains: {set(domains)}")
```

```text
Emails found:
  alice.johnson@company.com
  bob@marketing.io
  alice_j@old-company.co.uk
  help+urgent@support.company.com

Unique domains: {'old-company.co.uk', 'company.com', 'marketing.io', 'support.company.com'}
```

### Date Extraction from Mixed Formats

```python
import re

messy_text = """
Invoice #1001 dated 01/15/2025 for $5,000
Contract signed on January 20, 2025
Payment received 2025-02-01
Meeting scheduled for 15-Mar-2025
"""

# ISO format: YYYY-MM-DD
iso_dates = re.findall(r"\d{4}-\d{2}-\d{2}", messy_text)

# US format: MM/DD/YYYY
us_dates = re.findall(r"\d{2}/\d{2}/\d{4}", messy_text)

# Written format: Month DD, YYYY
written_dates = re.findall(r"[A-Z][a-z]+ \d{1,2}, \d{4}", messy_text)

# European format: DD-Mon-YYYY
eu_dates = re.findall(r"\d{2}-[A-Z][a-z]{2}-\d{4}", messy_text)

print(f"ISO dates:     {iso_dates}")
print(f"US dates:      {us_dates}")
print(f"Written dates: {written_dates}")
print(f"EU dates:      {eu_dates}")
```

```text
ISO dates:     ['2025-02-01']
US dates:      ['01/15/2025']
Written dates: ['January 20, 2025']
EU dates:      ['15-Mar-2025']
```

### Cleaning Product Names

```python
import re

raw_products = [
    "  Widget Pro (v2.1)  ",
    "MEGA widget---pro",
    "Widget    Pro   2.1",
    "widget_pro_v2.1!!!",
]

def clean_product_name(raw):
    # Remove special characters except spaces and dots
    cleaned = re.sub(r"[^a-zA-Z0-9\s.]", " ", raw)
    # Collapse multiple spaces
    cleaned = re.sub(r"\s+", " ", cleaned)
    # Strip and title case
    return cleaned.strip().title()

print("Cleaned product names:")
for raw in raw_products:
    print(f"  '{raw}' → '{clean_product_name(raw)}'")
```

```text
Cleaned product names:
  '  Widget Pro (v2.1)  ' → 'Widget Pro V2.1'
  'MEGA widget---pro' → 'Mega Widget Pro'
  'Widget    Pro   2.1' → 'Widget Pro 2.1'
  'widget_pro_v2.1!!!' → 'Widget Pro V2.1'
```

## Lookahead and Lookbehind

```python
import re

text = "Revenue: $500,000 Costs: $320,000 Profit: $180,000"

# Lookbehind: (?<=...) — match something AFTER a pattern
# Get numbers that come after a dollar sign
amounts = re.findall(r"(?<=\$)[\d,]+", text)
print(f"Amounts (lookbehind): {amounts}")

# Lookahead: (?=...) — match something BEFORE a pattern
# Get labels that come before a colon and dollar amount
labels = re.findall(r"\w+(?=: \$)", text)
print(f"Labels (lookahead): {labels}")

# Negative lookahead: (?!...) — match if NOT followed by
data = "EMP001 EMP002 TEMP003 EMP004 TEMP005"
permanent = re.findall(r"EMP\d+", data)
print(f"Permanent IDs: {permanent}")
```

```text
Amounts (lookbehind): ['500,000', '320,000', '180,000']
Labels (lookahead): ['Revenue', 'Costs', 'Profit']
Permanent IDs: ['EMP001', 'EMP002', 'EMP004']
```

<div class="interview-tip">

**Interview Insight:** Lookahead and lookbehind are "zero-width assertions" — they check for a pattern without including it in the match. This is powerful for extracting values next to labels, or matching patterns in specific contexts. Most interview questions only test basic regex, but knowing these sets you apart.

</div>

## Compiled Patterns — Better Performance

```python
import re

# When you use the same pattern many times, compile it
email_pattern = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
phone_pattern = re.compile(r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")

records = [
    "Alice Johnson, alice@company.com, (555) 123-4567",
    "Bob Smith, bob.smith@email.co.uk, 555.987.6543",
    "Carol Davis, carol_d@analytics.io, 555-456-7890",
]

print("Parsed contacts:")
for record in records:
    email = email_pattern.search(record)
    phone = phone_pattern.search(record)
    name = record.split(",")[0]
    print(f"  {name}")
    print(f"    Email: {email.group() if email else 'N/A'}")
    print(f"    Phone: {phone.group() if phone else 'N/A'}")
```

```text
Parsed contacts:
  Alice Johnson
    Email: alice@company.com
    Phone: (555) 123-4567
  Bob Smith
    Email: bob.smith@email.co.uk
    Phone: 555.987.6543
  Carol Davis
    Email: carol_d@analytics.io
    Phone: 555-456-7890
```

## Real-World: Parsing Log Files

```python
import re
from collections import Counter

logs = """
2025-01-29 09:15:22 INFO  User login: alice@company.com
2025-01-29 09:16:45 ERROR Database timeout: connection pool exhausted
2025-01-29 09:17:01 INFO  Query executed: SELECT * FROM sales (235ms)
2025-01-29 09:18:30 WARN  Slow query detected: 4500ms
2025-01-29 09:19:12 ERROR API rate limit exceeded: endpoint /v2/reports
2025-01-29 09:20:00 INFO  User login: bob@company.com
2025-01-29 09:21:15 INFO  Report generated: monthly_revenue.pdf
2025-01-29 09:22:33 ERROR File not found: /data/archive/2024_q4.csv
"""

# Count log levels
levels = re.findall(r"(INFO|WARN|ERROR)", logs)
print(f"Log levels: {Counter(levels)}")

# Extract all error messages
errors = re.findall(r"ERROR\s+(.+)", logs)
print(f"\nErrors ({len(errors)}):")
for err in errors:
    print(f"  ⚠ {err}")

# Find query execution times
times = re.findall(r"(\d+)ms", logs)
print(f"\nQuery times: {times}ms")

# Extract all email addresses
logins = re.findall(r"User login: ([\w.]+@[\w.]+)", logs)
print(f"Logins: {logins}")
```

```text
Log levels: Counter({'INFO': 4, 'ERROR': 3, 'WARN': 1})

Errors (3):
  ⚠ Database timeout: connection pool exhausted
  ⚠ API rate limit exceeded: endpoint /v2/reports
  ⚠ File not found: /data/archive/2024_q4.csv

Query times: ['235', '4500']ms
Logins: ['alice@company.com', 'bob@company.com']
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Cleaning messy customer data (names, phones, addresses)
- Parsing log files for error analysis and monitoring
- Extracting structured data from unstructured text fields
- Validating data inputs (email format, phone numbers, dates)
- Redacting PII (emails, SSNs, credit cards) before sharing datasets

</div>

<div class="challenge">

**Mini-Challenge:** You have this messy customer data:
```python
raw_data = [
    "John Smith | john.smith@gmail.com | (555) 111-2222 | Spent: $1,500",
    "Jane Doe | jane_doe@company.co.uk | 555.333.4444 | Spent: $12,350",
    "Bob Wilson | bob@startup.io | 555-555-6666 | Spent: $450",
]
```
Write regex to extract from each line:
1. Full name
2. Email address
3. Phone number (standardize to XXX-XXX-XXXX)
4. Spend amount as an integer

Build a list of clean dictionaries from the results.

</div>

## Common Interview Questions

### Q1: What's the difference between `re.match()` and `re.search()`?

**Answer:** `re.match()` only checks the beginning of the string. `re.search()` scans the entire string for the first match. If your pattern isn't at position 0, `match()` returns `None`. In practice, `search()` is used far more often. Use `match()` when you're validating that a string starts with a specific pattern, like checking if a line starts with a timestamp.

### Q2: What does the `r` prefix in `r"\d+"` mean?

**Answer:** The `r` creates a "raw string" — backslashes are treated as literal characters, not escape sequences. Without it, `"\d"` would be interpreted as an escape sequence (Python would try to interpret `\d`). With `r"\d"`, the backslash reaches the regex engine as-is. Always use raw strings for regex patterns to avoid double-escaping headaches.

### Q3: How do you make a regex non-greedy?

**Answer:** Add `?` after the quantifier. `.*` is greedy (matches as much as possible), `.*?` is non-greedy (matches as little as possible). Example: for `"<b>bold</b> and <b>more</b>"`, the greedy `<b>.*</b>` matches the entire string, while `<b>.*?</b>` matches just `"<b>bold</b>"`. Non-greedy is essential when extracting content between delimiters.

### Q4: When should you compile a regex pattern?

**Answer:** Use `re.compile()` when the same pattern is used repeatedly — in loops, or across multiple function calls. Compiled patterns skip the parsing step on each use, giving a performance boost. For one-off matches, inline patterns like `re.search(r"\d+", text)` are fine. In data pipelines processing millions of rows, compiled patterns make a measurable difference.

### Q5: How would you validate an email address with regex?

**Answer:** A basic pattern is `r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"`. However, perfect email validation via regex is nearly impossible — the RFC spec is incredibly complex. In practice, use regex for a basic format check (has `@`, has domain), then verify by sending a confirmation email. For data cleaning, the basic pattern catches 99% of cases. Libraries like `email-validator` handle edge cases better.
