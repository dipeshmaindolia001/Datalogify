---
title: "Modules & Packages — Organize Your Code"
description: "Import, create, and manage Python modules — structure your analytics projects like a professional developer."
category: "python"
order: 12
phase: 1
tags: ["python", "modules", "packages", "imports"]
publishedDate: 2025-01-27
prevSlug: "list-comprehensions"
nextSlug: "oop-basics"
seoTitle: "Python Modules and Packages Tutorial | Datalogify"
seoDescription: "Learn to import, create, and organize Python modules and packages for clean analytics code."
---

## Why This Matters

Every analytics project bigger than a single script needs organization. Modules let you split code into reusable files, import powerful built-in tools, and install third-party libraries. This is how professional data teams structure their work.

## Importing Modules — Three Ways

```python
# Method 1: import the whole module
import math
print(math.sqrt(144))
print(math.ceil(7.2))

# Method 2: import specific functions
from statistics import mean, median
sales = [50000, 35000, 28000, 42000, 67000]
print(f"Mean: ${mean(sales):,}")
print(f"Median: ${median(sales):,}")

# Method 3: alias with 'as'
import collections as col
dept_counts = col.Counter(["Engineering", "Sales", "Engineering", "Marketing", "Sales", "Sales"])
print(dept_counts)
```

```text
12.0
8
Mean: $44,400
Median: $42,000
Counter({'Sales': 3, 'Engineering': 2, 'Marketing': 1})
```

### What NOT to Do

```python
# Avoid: from math import *
# This dumps EVERYTHING into your namespace — you won't know where functions came from
# It also causes name collisions if two modules have the same function name

from math import *
from statistics import *
# Both have functions that could collide — debugging nightmare
```

<div class="interview-tip">

**Interview Insight:** If someone asks "why not `from x import *`?", the answer is namespace pollution. In a 2,000-line analytics script, you need to know whether `mean()` came from `statistics`, `numpy`, or your own code. Explicit imports make this obvious.

</div>

## Built-in Modules You'll Use Constantly

### os and sys — System Operations

```python
import os
import sys

# Current working directory
print(f"CWD: {os.getcwd()}")

# List files in a directory
files = os.listdir(".")
csv_files = [f for f in files if f.endswith(".csv")]
print(f"CSV files found: {len(csv_files)}")

# Environment variables (used for database credentials, API keys)
db_host = os.environ.get("DB_HOST", "localhost")
print(f"Database host: {db_host}")

# Python version
print(f"Python: {sys.version}")

# Check platform for cross-platform scripts
print(f"Platform: {sys.platform}")
```

```text
CWD: /home/analyst/projects
CSV files found: 3
Database host: localhost
Python: 3.11.5 (main, Sep 11 2023)
Platform: linux
```

### datetime — Dates and Times

```python
from datetime import datetime, timedelta

# Current timestamp for logging
now = datetime.now()
print(f"Report generated: {now.strftime('%Y-%m-%d %H:%M')}")

# Calculate deadline
deadline = now + timedelta(days=30)
print(f"Due date: {deadline.strftime('%B %d, %Y')}")

# Parse a date string from a CSV
date_str = "2025-01-15"
parsed = datetime.strptime(date_str, "%Y-%m-%d")
print(f"Parsed: {parsed.date()}, Day of week: {parsed.strftime('%A')}")
```

```text
Report generated: 2025-01-27 14:30
Due date: February 26, 2025
Parsed: 2025-01-15, Day of week: Wednesday
```

### math and random — Calculations

```python
import math
import random

# math — financial calculations
principal = 100000
rate = 0.07
years = 5
future_value = principal * math.pow(1 + rate, years)
print(f"Investment after {years} years: ${future_value:,.2f}")

# Log transformation (common in analytics for skewed data)
revenues = [500, 5000, 50000, 500000, 5000000]
log_revenues = [round(math.log10(r), 2) for r in revenues]
print(f"Log10 revenues: {log_revenues}")

# random — sampling and simulation
random.seed(42)  # Reproducible results
customers = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank"]
sample = random.sample(customers, 3)
print(f"Survey sample: {sample}")

# Simulate monthly revenue
monthly_rev = [random.randint(40000, 80000) for _ in range(6)]
print(f"Simulated revenue: {monthly_rev}")
```

```text
Investment after 5 years: $140,255.17
Log10 revenues: [2.7, 3.7, 4.7, 5.7, 6.7]
Survey sample: ['Hank', 'Carol', 'Grace']
Simulated revenue: [41055, 74540, 45603, 60868, 47339, 52634]
```

### collections — Power Data Structures

```python
from collections import Counter, defaultdict, namedtuple

# Counter — frequency analysis
transactions = ["online", "store", "online", "phone", "online", "store", "online"]
channel_counts = Counter(transactions)
print(f"Channel mix: {channel_counts}")
print(f"Top 2: {channel_counts.most_common(2)}")

# defaultdict — grouping without KeyError
from collections import defaultdict
sales_by_region = defaultdict(list)
records = [
    ("North", 50000), ("South", 35000), ("North", 62000),
    ("East", 41000), ("South", 28000), ("East", 55000),
]
for region, amount in records:
    sales_by_region[region].append(amount)

for region, amounts in sales_by_region.items():
    print(f"{region}: {amounts} → Total: ${sum(amounts):,}")

# namedtuple — lightweight record type
Employee = namedtuple("Employee", ["name", "dept", "salary"])
team = [
    Employee("Alice", "Engineering", 95000),
    Employee("Bob", "Marketing", 72000),
    Employee("Carol", "Engineering", 98000),
]
for emp in team:
    print(f"{emp.name} ({emp.dept}): ${emp.salary:,}")
```

```text
Channel mix: Counter({'online': 4, 'store': 2, 'phone': 1})
Top 2: [('online', 4), ('store', 2)]
North: [50000, 62000] → Total: $112,000
South: [35000, 28000] → Total: $63,000
East: [41000, 55000] → Total: $96,000
Alice (Engineering): $95,000
Bob (Marketing): $72,000
Carol (Engineering): $98,000
```

## Creating Your Own Modules

Any `.py` file is a module. Here's how to structure analytics code across files.

### analytics_utils.py

```python
# analytics_utils.py — Reusable analytics functions
def calculate_growth(current, previous):
    """Calculate percentage growth between two periods."""
    if previous == 0:
        return float("inf")
    return round((current - previous) / previous * 100, 2)

def categorize_revenue(amount):
    """Classify revenue into tiers."""
    if amount >= 100000:
        return "Enterprise"
    elif amount >= 50000:
        return "Mid-Market"
    elif amount >= 10000:
        return "SMB"
    return "Micro"

def clean_currency(value):
    """Convert '$50,000' to 50000."""
    return int(value.replace("$", "").replace(",", ""))

# Module-level constant
TAX_RATE = 0.08
```

### Using Your Module

```python
# main_report.py
from analytics_utils import calculate_growth, categorize_revenue, clean_currency, TAX_RATE

# Growth calculation
q1_revenue = 250000
q2_revenue = 310000
growth = calculate_growth(q2_revenue, q1_revenue)
print(f"Q1→Q2 Growth: {growth}%")

# Categorize accounts
accounts = [120000, 55000, 8000, 75000, 15000]
for amt in accounts:
    print(f"${amt:,} → {categorize_revenue(amt)}")

# Clean raw data
raw = "$1,250,000"
clean = clean_currency(raw)
tax = clean * TAX_RATE
print(f"\nRevenue: ${clean:,}")
print(f"Tax ({TAX_RATE*100}%): ${tax:,.2f}")
```

```text
Q1→Q2 Growth: 24.0%
$120,000 → Enterprise
$55,000 → Mid-Market
$8,000 → Micro
$75,000 → Mid-Market
$15,000 → SMB

Revenue: $1,250,000
Tax (8.0%): $100,000.00
```

## The `__name__ == "__main__"` Guard

```python
# analytics_utils.py (with guard)
def calculate_growth(current, previous):
    if previous == 0:
        return float("inf")
    return round((current - previous) / previous * 100, 2)

# This only runs when you execute this file directly
# NOT when another file imports it
if __name__ == "__main__":
    # Quick test
    print("Testing calculate_growth:")
    print(f"  100 → 120: {calculate_growth(120, 100)}%")
    print(f"  100 → 80:  {calculate_growth(80, 100)}%")
    print(f"  0 → 50:    {calculate_growth(50, 0)}")
    print("All tests passed ✓")
```

```text
# Running directly: python analytics_utils.py
Testing calculate_growth:
  100 → 120: 20.0%
  100 → 80:  -20.0%
  0 → 50:    inf
All tests passed ✓

# Importing: from analytics_utils import calculate_growth
# → Nothing prints. The test code doesn't execute.
```

<div class="interview-tip">

**Interview Insight:** "What does `if __name__ == '__main__'` do?" is one of the most common Python interview questions. When Python runs a file directly, `__name__` is set to `"__main__"`. When a file is imported, `__name__` is set to the module name. This guard lets you put test/demo code in a module without it running on import.

</div>

## Packages — Organizing Multiple Modules

A package is a folder of modules with an `__init__.py` file.

```text
analytics_project/
├── main.py
├── utils/
│   ├── __init__.py
│   ├── cleaning.py
│   ├── calculations.py
│   └── reporting.py
└── data/
    ├── sales_q1.csv
    └── sales_q2.csv
```

```python
# utils/__init__.py — controls what's available when you import the package
from .cleaning import clean_currency, remove_duplicates
from .calculations import calculate_growth, moving_average

# Now in main.py you can do:
# from utils import clean_currency, calculate_growth
```

## Installing Third-Party Packages with pip

```python
# Install packages
# pip install pandas numpy matplotlib

# Install a specific version
# pip install pandas==2.1.0

# Install from requirements.txt
# pip install -r requirements.txt

# Check installed packages
# pip list
# pip show pandas

# After installing, use like any module
import pandas as pd
import numpy as np

data = {"product": ["Widget A", "Widget B"], "revenue": [50000, 35000]}
df = pd.DataFrame(data)
print(df)
print(f"\nTotal revenue: ${df['revenue'].sum():,}")
```

```text
     product  revenue
0  Widget A    50000
1  Widget B    35000

Total revenue: $85,000
```

## Virtual Environments — Isolate Your Projects

```text
# Create a virtual environment
python -m venv analytics_env

# Activate it (Windows)
analytics_env\Scripts\activate

# Activate it (Mac/Linux)
source analytics_env/bin/activate

# Now pip installs go ONLY into this environment
pip install pandas numpy matplotlib

# Deactivate when done
deactivate
```

### Why Virtual Environments Matter

```text
Project A needs: pandas 1.5, numpy 1.24
Project B needs: pandas 2.1, numpy 1.26

Without venvs → version conflicts, broken code
With venvs    → each project has its own isolated packages
```

## requirements.txt — Lock Your Dependencies

```text
# requirements.txt — pin exact versions for reproducibility
pandas==2.1.4
numpy==1.26.2
matplotlib==3.8.2
scikit-learn==1.3.2
sqlalchemy==2.0.23
python-dotenv==1.0.0
```

```python
# Generate from your current environment
# pip freeze > requirements.txt

# Install all dependencies at once
# pip install -r requirements.txt

# This is how teams ensure everyone runs the same versions
# It's also how deployment servers know what to install
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Structuring data pipeline code across multiple files and packages
- Using `collections.Counter` for quick frequency analysis before spinning up Pandas
- Setting up virtual environments for each client project
- Managing `requirements.txt` for reproducible analytics environments
- Using `os.environ` to load database credentials securely (never hardcode passwords)

</div>

<div class="challenge">

**Mini-Challenge:** Create a module called `sales_utils.py` with these functions:
1. `parse_amount(raw)` — converts strings like "$1,500.50" to float
2. `classify_customer(total_spent)` — returns "Gold" (>$10k), "Silver" (>$5k), or "Bronze"
3. `summarize(amounts)` — returns a dict with "total", "average", "min", "max", "count"

Then write a `main.py` that imports and uses all three functions on sample data.

</div>

## Common Interview Questions

### Q1: What's the difference between `import module` and `from module import func`?

**Answer:** `import module` imports the entire module — you access its contents with `module.func()`. `from module import func` imports only `func` directly into your namespace — you call it as `func()`. The first keeps your namespace clean and makes it obvious where functions come from. The second is convenient for frequently-used functions. In analytics, `import pandas as pd` is the convention — it's a middle ground.

### Q2: What does `if __name__ == "__main__"` do?

**Answer:** When Python runs a file directly, it sets `__name__` to `"__main__"`. When a file is imported as a module, `__name__` is set to the module's filename. The guard ensures code inside it only runs during direct execution, not on import. It's used for test code, demo scripts, and CLI entry points.

### Q3: What's the difference between a module and a package?

**Answer:** A module is a single `.py` file containing functions, classes, and variables. A package is a directory containing multiple modules plus an `__init__.py` file. Packages let you organize related modules hierarchically — like `utils.cleaning` and `utils.calculations`. In Python 3.3+, `__init__.py` is technically optional (namespace packages), but it's still best practice.

### Q4: Why use virtual environments?

**Answer:** Virtual environments isolate project dependencies. Without them, all projects share one global Python installation — upgrading a library for one project can break another. With `venv`, each project gets its own `site-packages` directory. This is essential for reproducibility, deployment, and team collaboration. Combined with `requirements.txt`, it ensures everyone runs identical versions.

### Q5: How does Python find modules when you import them?

**Answer:** Python searches in order: (1) the current directory, (2) directories in the `PYTHONPATH` environment variable, (3) the standard library, (4) `site-packages` (where pip installs). You can inspect this with `sys.path`. If a module isn't found in any of these locations, you get `ModuleNotFoundError`. This is why activating the correct virtual environment matters.
