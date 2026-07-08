---
title: "OOP Basics — Classes & Objects"
description: "Learn object-oriented programming fundamentals — classes, objects, methods, and properties for building reusable analytics tools."
category: "python"
order: 13
phase: 1
tags: ["python", "oop", "classes", "objects"]
publishedDate: 2025-01-28
prevSlug: "modules-and-packages"
nextSlug: "datetime-operations"
seoTitle: "Python OOP Tutorial — Classes & Objects | Datalogify"
seoDescription: "Learn Python classes, objects, methods, and properties with practical analytics examples."
---

## Why This Matters

OOP lets you bundle data and behavior together — instead of passing 10 variables to 5 functions, you create one object that knows its own data and how to analyze it. Every major Python library (Pandas, Matplotlib, Scikit-learn) is built on classes.

## Creating a Class

```python
class Employee:
    """Represents an employee record."""
    
    def __init__(self, name, department, salary):
        self.name = name
        self.department = department
        self.salary = salary
    
    def annual_salary(self):
        return self.salary * 12
    
    def __str__(self):
        return f"{self.name} ({self.department}) - ${self.salary:,}/mo"

# Create objects
alice = Employee("Alice Johnson", "Engineering", 9500)
bob = Employee("Bob Smith", "Marketing", 7200)

print(alice)
print(f"Annual: ${alice.annual_salary():,}")
print(bob)
```

```text
Alice Johnson (Engineering) - $9,500/mo
Annual: $114,000
Bob Smith (Marketing) - $7,200/mo
```

## Instance vs Class Variables

```python
class SalesTeam:
    # Class variable — shared by ALL instances
    company = "Datalogify"
    team_count = 0
    
    def __init__(self, name, region, quota):
        # Instance variables — unique to each instance
        self.name = name
        self.region = region
        self.quota = quota
        self.actual_sales = 0
        SalesTeam.team_count += 1
    
    def log_sale(self, amount):
        self.actual_sales += amount
    
    def quota_pct(self):
        if self.quota == 0:
            return 0
        return round(self.actual_sales / self.quota * 100, 1)
    
    def __repr__(self):
        return f"SalesTeam('{self.name}', '{self.region}', quota={self.quota})"

east = SalesTeam("East Coast", "East", 500000)
west = SalesTeam("West Coast", "West", 600000)

east.log_sale(120000)
east.log_sale(95000)
west.log_sale(250000)

print(f"Company: {SalesTeam.company}")
print(f"Teams: {SalesTeam.team_count}")
print(f"{east.name}: {east.quota_pct()}% of quota")
print(f"{west.name}: {west.quota_pct()}% of quota")
```

```text
Company: Datalogify
Teams: 2
East Coast: 43.0% of quota
West Coast: 41.7% of quota
```

## Properties — Controlled Access

```python
class Product:
    def __init__(self, name, cost, markup_pct):
        self.name = name
        self._cost = cost
        self._markup_pct = markup_pct
    
    @property
    def price(self):
        """Calculated price — always up to date."""
        return round(self._cost * (1 + self._markup_pct / 100), 2)
    
    @property
    def margin(self):
        return round(self.price - self._cost, 2)
    
    @property
    def cost(self):
        return self._cost
    
    @cost.setter
    def cost(self, value):
        if value < 0:
            raise ValueError("Cost cannot be negative")
        self._cost = value

widget = Product("Widget Pro", 25.00, 60)
print(f"{widget.name}: cost=${widget.cost}, price=${widget.price}, margin=${widget.margin}")

widget.cost = 30.00  # Uses the setter
print(f"After cost increase: price=${widget.price}, margin=${widget.margin}")
```

```text
Widget Pro: cost=25.0, price=$40.0, margin=$15.0
After cost increase: price=$48.0, margin=$18.0
```

## Inheritance

```python
class DataSource:
    """Base class for all data sources."""
    
    def __init__(self, name, record_count):
        self.name = name
        self.record_count = record_count
        self.is_loaded = False
    
    def load(self):
        self.is_loaded = True
        print(f"Loaded {self.name}: {self.record_count:,} records")
    
    def summary(self):
        status = "✓ loaded" if self.is_loaded else "✗ not loaded"
        return f"{self.name} ({status}): {self.record_count:,} records"

class CSVSource(DataSource):
    """CSV file data source."""
    
    def __init__(self, name, filepath, record_count):
        super().__init__(name, record_count)
        self.filepath = filepath
    
    def load(self):
        print(f"Reading CSV: {self.filepath}")
        super().load()

class APISource(DataSource):
    """REST API data source."""
    
    def __init__(self, name, endpoint, record_count):
        super().__init__(name, record_count)
        self.endpoint = endpoint
    
    def load(self):
        print(f"Calling API: {self.endpoint}")
        super().load()

# Usage
sources = [
    CSVSource("Sales Data", "data/sales.csv", 50000),
    APISource("Weather Data", "https://api.weather.com/v1", 365),
    CSVSource("Customer Data", "data/customers.csv", 12000),
]

for source in sources:
    source.load()
    print(f"  → {source.summary()}\n")
```

```text
Reading CSV: data/sales.csv
Loaded Sales Data: 50,000 records
  → Sales Data (✓ loaded): 50,000 records

Calling API: https://api.weather.com/v1
Loaded Weather Data: 365 records
  → Weather Data (✓ loaded): 365 records

Reading CSV: data/customers.csv
Loaded Customer Data: 12,000 records
  → Customer Data (✓ loaded): 12,000 records
```

## Building a DataAnalyzer Class

```python
class DataAnalyzer:
    """Simple data analysis tool using lists of dictionaries."""
    
    def __init__(self, data, name="Dataset"):
        self.data = data
        self.name = name
    
    @property
    def row_count(self):
        return len(self.data)
    
    @property
    def columns(self):
        if not self.data:
            return []
        return list(self.data[0].keys())
    
    def describe_column(self, col):
        """Get basic stats for a numeric column."""
        values = [row[col] for row in self.data if isinstance(row.get(col), (int, float))]
        if not values:
            return {"count": 0}
        return {
            "count": len(values),
            "mean": round(sum(values) / len(values), 2),
            "min": min(values),
            "max": max(values),
            "sum": sum(values),
        }
    
    def filter(self, condition):
        """Return a new DataAnalyzer with filtered data."""
        filtered = [row for row in self.data if condition(row)]
        return DataAnalyzer(filtered, f"{self.name} (filtered)")
    
    def group_by(self, key_col, value_col, agg="sum"):
        """Group by a column and aggregate another."""
        groups = {}
        for row in self.data:
            key = row[key_col]
            val = row.get(value_col, 0)
            groups.setdefault(key, []).append(val)
        
        if agg == "sum":
            return {k: sum(v) for k, v in groups.items()}
        elif agg == "mean":
            return {k: round(sum(v) / len(v), 2) for k, v in groups.items()}
        elif agg == "count":
            return {k: len(v) for k, v in groups.items()}
    
    def __repr__(self):
        return f"DataAnalyzer('{self.name}', rows={self.row_count}, cols={self.columns})"

# Use it
sales = [
    {"product": "Widget A", "region": "East", "revenue": 50000},
    {"product": "Widget B", "region": "West", "revenue": 35000},
    {"product": "Widget A", "region": "West", "revenue": 45000},
    {"product": "Widget C", "region": "East", "revenue": 28000},
    {"product": "Widget B", "region": "East", "revenue": 32000},
]

analyzer = DataAnalyzer(sales, "Q1 Sales")
print(analyzer)
print(f"\nRevenue stats: {analyzer.describe_column('revenue')}")
print(f"\nBy region: {analyzer.group_by('region', 'revenue')}")
print(f"By product: {analyzer.group_by('product', 'revenue')}")

# Filter and re-analyze
east = analyzer.filter(lambda r: r["region"] == "East")
print(f"\n{east}")
print(f"East revenue: {analyzer.group_by('region', 'revenue')['East']:,}")
```

```text
DataAnalyzer('Q1 Sales', rows=5, cols=['product', 'region', 'revenue'])

Revenue stats: {'count': 5, 'mean': 38000.0, 'min': 28000, 'max': 50000, 'sum': 190000}

By region: {'East': 110000, 'West': 80000}
By product: {'Widget A': 95000, 'Widget B': 67000, 'Widget C': 28000}

DataAnalyzer('Q1 Sales (filtered)', rows=3, cols=['product', 'region', 'revenue'])
East revenue: 110,000
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Every Pandas DataFrame is an object with methods (`.groupby()`, `.merge()`, `.describe()`)
- Scikit-learn models are classes (`model.fit()`, `model.predict()`)
- Building reusable data pipeline components and ETL frameworks
- Custom validators, transformers, and data connectors

</div>

<div class="challenge">

**Mini-Challenge:** Create a `Portfolio` class that:
1. Stores stock holdings as a list of dicts: `{"ticker": "AAPL", "shares": 10, "price": 150.0}`
2. Has a `total_value` property that calculates portfolio worth
3. Has a `buy(ticker, shares, price)` method
4. Has a `top_holdings(n)` method that returns the n most valuable positions
5. Has a `__str__` method that shows a summary

</div>

## Common Interview Questions

### Q1: What's the difference between a class and an object?

**Answer:** A class is a blueprint/template — it defines what attributes and methods instances will have. An object (instance) is a specific realization of that class with actual data. `Employee` is a class; `alice = Employee("Alice", "Eng", 9500)` creates an object. You can create many objects from one class.

### Q2: What does `self` refer to?

**Answer:** `self` refers to the specific instance of the class that called the method. When you call `alice.annual_salary()`, Python passes `alice` as `self` automatically. It's how the method knows which instance's data to work with.

### Q3: What's the difference between `__str__` and `__repr__`?

**Answer:** `__str__` is for human-readable output (what users see). `__repr__` is for unambiguous, developer-facing output (what appears in the console, logs, debuggers). Ideally, `__repr__` output could recreate the object. If only one is defined, `__repr__` is the fallback for `str()`.

### Q4: When should you use inheritance vs composition?

**Answer:** Use inheritance for "is-a" relationships: `CSVSource is-a DataSource`. Use composition for "has-a": `DataPipeline has-a DataSource`. Composition is generally preferred because it's more flexible — you can swap components at runtime. Inheritance creates tight coupling.

### Q5: What are class methods and static methods?

**Answer:** `@classmethod` receives the class (`cls`) as its first argument — used for alternative constructors like `Employee.from_dict(data)`. `@staticmethod` receives neither `self` nor `cls` — it's a regular function that logically belongs to the class namespace but doesn't need access to instance or class data.
