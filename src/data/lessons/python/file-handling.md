---
title: "File Handling — Read & Write CSV, JSON, Text"
description: "Read and write files like a pro — CSV, JSON, and text files are the bread and butter of analytics data pipelines."
category: "python"
order: 9
phase: 1
tags: ["python", "files", "csv", "json", "io"]
publishedDate: 2025-01-24
prevSlug: "tuples-and-sets"
nextSlug: "error-handling"
seoTitle: "Python File Handling — CSV, JSON, Text | Datalogify"
seoDescription: "Read and write CSV, JSON, and text files in Python — essential for every data analytics workflow."
---

## Why This Matters

Every analytics project starts with loading data from a file. Whether it's a CSV export from a database, a JSON response from an API, or a plain text log — you need to know how to read it, process it, and write results back.

## Reading Text Files

The `open()` function is your entry point to file I/O. Always use `with` to auto-close files.

```python
# Reading a file
with open("sales_report.txt", "r") as f:
    content = f.read()
    print(content)
```

```text
Q1 Sales Report
Total Revenue: $1,250,000
Units Sold: 8,432
Top Product: Widget Pro
```

### Read Methods

```python
# Read entire file as string
with open("data.txt", "r") as f:
    full_text = f.read()

# Read all lines into a list
with open("data.txt", "r") as f:
    lines = f.readlines()
    print(lines)  # ['line1\n', 'line2\n', ...]

# Read line by line (memory efficient for large files)
with open("data.txt", "r") as f:
    for line in f:
        print(line.strip())
```

```text
['Q1 Sales Report\n', 'Total Revenue: $1,250,000\n', 'Units Sold: 8,432\n']
Q1 Sales Report
Total Revenue: $1,250,000
Units Sold: 8,432
```

## Writing Text Files

```python
# Write (overwrites existing file)
with open("output.txt", "w") as f:
    f.write("Monthly Report\n")
    f.write(f"Generated: 2025-01-24\n")

# Append to existing file
with open("log.txt", "a") as f:
    f.write("2025-01-24: Job completed successfully\n")

# Write multiple lines
lines = ["Product A: $50,000\n", "Product B: $35,000\n", "Product C: $28,000\n"]
with open("breakdown.txt", "w") as f:
    f.writelines(lines)
```

## Working with CSV Files

CSV is the most common data format in analytics. Python's built-in `csv` module handles it.

### Reading CSV

```python
import csv

# Basic CSV reading
with open("employees.csv", "r") as f:
    reader = csv.reader(f)
    header = next(reader)  # Skip header row
    print(f"Columns: {header}")
    
    for row in reader:
        print(f"{row[0]} - {row[1]} - ${row[2]}")
```

```text
Columns: ['name', 'department', 'salary']
Alice Johnson - Engineering - $95000
Bob Smith - Marketing - $72000
Carol Davis - Engineering - $98000
```

### DictReader — The Better Way

```python
import csv

# DictReader gives you column names as keys
with open("employees.csv", "r") as f:
    reader = csv.DictReader(f)
    
    for row in reader:
        name = row["name"]
        dept = row["department"]
        salary = int(row["salary"])
        print(f"{name} ({dept}): ${salary:,}")
```

```text
Alice Johnson (Engineering): $95,000
Bob Smith (Marketing): $72,000
Carol Davis (Engineering): $98,000
```

### Writing CSV

```python
import csv

# Writing CSV with header
sales_data = [
    {"product": "Widget A", "revenue": 50000, "units": 1200},
    {"product": "Widget B", "revenue": 35000, "units": 800},
    {"product": "Widget C", "revenue": 28000, "units": 650},
]

with open("sales_output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["product", "revenue", "units"])
    writer.writeheader()
    writer.writerows(sales_data)

print("CSV written successfully!")
```

```text
CSV written successfully!
```

The file would contain:
```text
product,revenue,units
Widget A,50000,1200
Widget B,35000,800
Widget C,28000,650
```

## Working with JSON Files

JSON is everywhere — API responses, config files, NoSQL databases.

```python
import json

# Sample data
employee = {
    "name": "Alice Johnson",
    "department": "Engineering",
    "skills": ["Python", "SQL", "Pandas"],
    "salary": 95000,
    "is_active": True
}

# Write JSON to file
with open("employee.json", "w") as f:
    json.dump(employee, f, indent=2)

# Read JSON from file
with open("employee.json", "r") as f:
    data = json.load(f)

print(f"Name: {data['name']}")
print(f"Skills: {', '.join(data['skills'])}")
print(f"Salary: ${data['salary']:,}")
```

```text
Name: Alice Johnson
Skills: Python, SQL, Pandas
Salary: $95,000
```

### JSON with Lists of Records

```python
import json

# Multiple records (like a database export)
employees = [
    {"id": 1, "name": "Alice", "dept": "Engineering", "salary": 95000},
    {"id": 2, "name": "Bob", "dept": "Marketing", "salary": 72000},
    {"id": 3, "name": "Carol", "dept": "Engineering", "salary": 98000},
]

# Write
with open("team.json", "w") as f:
    json.dump(employees, f, indent=2)

# Read and process
with open("team.json", "r") as f:
    team = json.load(f)

avg_salary = sum(e["salary"] for e in team) / len(team)
print(f"Team size: {len(team)}")
print(f"Average salary: ${avg_salary:,.0f}")

# Filter engineers
engineers = [e for e in team if e["dept"] == "Engineering"]
print(f"Engineers: {len(engineers)}")
```

```text
Team size: 3
Average salary: $88,333
Engineers: 2
```

## File Paths with pathlib

The modern way to handle file paths in Python.

```python
from pathlib import Path

# Current directory
cwd = Path.cwd()
print(f"Working directory: {cwd}")

# Build paths safely (works on Windows, Mac, Linux)
data_dir = Path("data")
csv_file = data_dir / "sales" / "q1_report.csv"
print(f"File path: {csv_file}")

# Check if file/directory exists
print(f"Exists: {csv_file.exists()}")
print(f"Is file: {csv_file.is_file()}")

# Get file info
p = Path("employees.csv")
if p.exists():
    print(f"File size: {p.stat().st_size} bytes")
    print(f"Extension: {p.suffix}")
    print(f"Name without ext: {p.stem}")

# List all CSV files in a directory
for csv in Path(".").glob("*.csv"):
    print(f"Found: {csv}")
```

```text
Working directory: /home/analyst/projects
File path: data/sales/q1_report.csv
Exists: False
Is file: False
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Loading daily data dumps (CSV/JSON) into analytics pipelines
- Writing ETL scripts that process and transform files
- Parsing API responses (JSON) for reporting dashboards
- Generating automated CSV/Excel reports for stakeholders
- Reading configuration files for data pipeline parameters

</div>

<div class="challenge">

**Mini-Challenge:** Write a script that:
1. Creates a list of 5 sales records (dicts with product, revenue, region)
2. Writes them to a CSV file
3. Reads the CSV back
4. Calculates total revenue per region
5. Writes the summary to a JSON file

</div>

## Common Interview Questions

### Q1: What's the difference between `read()`, `readline()`, and `readlines()`?

**Answer:** `read()` returns the entire file as a single string. `readline()` returns one line at a time (useful for processing line by line without loading everything into memory). `readlines()` returns a list of all lines. For large files, iterate directly: `for line in file:` — it's the most memory-efficient approach.

### Q2: Why use `with open()` instead of just `open()`?

**Answer:** The `with` statement (context manager) automatically closes the file when the block ends, even if an exception occurs. Without it, you must manually call `f.close()`, and if your code crashes before that line, the file stays open — which can cause data corruption or resource leaks.

### Q3: How do you handle CSV files with different delimiters?

**Answer:** Pass the `delimiter` parameter: `csv.reader(f, delimiter='\t')` for tab-separated, or `delimiter='|'` for pipe-separated. You can also use `csv.Sniffer()` to auto-detect the delimiter: `dialect = csv.Sniffer().sniff(f.read(1024))`.

### Q4: What's the difference between `json.dump()` and `json.dumps()`?

**Answer:** `json.dump(data, file)` writes JSON directly to a file object. `json.dumps(data)` returns a JSON string. Use `dump` when writing to files, `dumps` when you need the JSON as a string (e.g., for API requests or logging).

### Q5: How do you read a very large file without running out of memory?

**Answer:** Don't use `read()` or `readlines()` — they load the entire file into memory. Instead, iterate line by line: `for line in open('big.csv')`. For CSV, use `csv.reader()` which also reads lazily. For truly massive files, consider `pandas.read_csv(chunksize=10000)` to process in chunks.
