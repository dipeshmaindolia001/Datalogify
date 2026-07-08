---
title: "OOP Basics — Classes & Objects"
description: "Learn object-oriented programming fundamentals — classes, objects, methods, and properties for building reusable analytics tools."
category: "python"
order: 12
phase: 1
tags: ["python", "oop", "classes", "objects", "inheritance"]
publishedDate: 2025-01-28
prevSlug: "modules-and-packages"
nextSlug: "datetime-operations"
seoTitle: "Python OOP Tutorial — Classes & Objects | Datalogify"
seoDescription: "Learn Python classes, objects, methods, and properties with practical analytics examples."
---

## Introduction & The "Why"

In your programming journey so far, you have likely been writing code using a **procedural programming** paradigm. You define variables (data) and you write functions (logic) to transform that data. While this works well for simple workflows, it creates challenges when building complex data pipelines. Your data is separated from your functions. If you pass the wrong dictionary to a formatting function, your script crashes.

**Object-Oriented Programming (OOP)** is a paradigm that lets you group data (attributes) and actions (methods) together into a single, cohesive unit called an **object**.

### The Architect's Blueprint Metaphor

To understand OOP, think of the relationship between an architectural blueprint and an actual house:

```text
  [ Blueprint (Class) ]  -->  Defines structure, materials, and rooms.
          │
          ├─────────────────────────┬─────────────────────────┐
          ▼                         ▼                         ▼
  [ House 1 (Object) ]      [ House 2 (Object) ]      [ House 3 (Object) ]
  Address: 123 Main St      Address: 456 Oak Ave      Address: 789 Pine Rd
  Color: Blue               Color: Green              Color: Yellow
```

* **The Class is the Blueprint:** It is the conceptual design. The blueprint defines what a house looks like (it has walls, windows, a roof, and bedrooms) and what it can do (doors can open, heating can be turned on). However, you cannot live in a blueprint. It occupies no physical space.
* **The Object (or Instance) is the built House:** When an builder takes the blueprint and uses bricks and wood to build an actual physical structure on a plot of land, they are **instantiating** the blueprint. You can live in this house. It has its own unique address, paint color, and occupant history.

In data analytics, you might define a blueprint (class) called `DatasetAnalyzer`. This class defines the properties of any analyzer (like a file path or database connection) and the actions it can perform (like loading data, calculating means, or outputting reports). When you load a specific file, you instantiate an object of that analyzer class (e.g., `sales_analyzer` or `user_analyzer`).

---

## Step-by-Step Concept Breakdown

To master OOP in Python, we must understand the core jargon and the mechanics of class construction.

### 1. What is `self`?
If you look at class methods in Python, the first argument is almost always `self`:

```python
def print_details(self):
    print(self.name)
```

#### Why does it exist?
`self` represents the **specific object instance** currently calling the method. 

When you write `house1.open_door()`, Python automatically translates this call behind the scenes to: `House.open_door(house1)`. The instance `house1` is passed in as the first argument, which corresponds to `self`. This is how Python knows whose door to open (House 1's, not House 2's).

### 2. The Constructor: `__init__`
When you create a new object instance, Python automatically calls a special method named `__init__`. This is the constructor. It initializes the starting attributes of the object.

### 3. Instance Variables vs. Class Variables
Attributes can be defined at the class level or the instance level:
* **Instance Variables:** Unique to each individual object. (e.g., each customer has their own unique `email` and `account_balance`).
* **Class Variables:** Shared across **every single instance** of the class. If you change a class variable, it changes for all instances. (e.g., a bank class might have a class variable named `interest_rate = 0.05`).

### 4. Encapsulation: Properties (`@property` and `@setter`)
Encapsulation means restricting direct access to an object's data to prevent accidental corruption. In languages like Java, this is done with helper methods like `get_balance()` and `set_balance()`. 

Python uses a cleaner, built-in decorator pattern: `@property` (to get a value) and `@setter` (to validate and set a value). This allows attributes to be accessed like normal variables while still letting you run validation logic under the hood.

### 5. Inheritance and Polymorphism
* **Inheritance:** Creating a new class (child) that inherits all attributes and methods from an existing class (parent), reducing code duplication.
* **Polymorphism:** The ability of different object classes to share the same method names but execute different code. For example, a `CSVLoader` and a `DatabaseLoader` might both have a `.load()` method, but each handles loading differently under the hood.

---

## Code Walkthroughs & Practical Examples

Let's build class models from scratch to understand these concepts in action.

### 1. Basic Class Structure (Attributes and Methods)

Here, we will define a simple blueprint for tracking customer orders.

```python
class CustomerOrder:
    # Constructor: initializes instance variables
    def __init__(self, order_id, customer_name, total_amount):
        self.order_id = order_id                # Instance variable
        self.customer_name = customer_name      # Instance variable
        self.total_amount = total_amount        # Instance variable
        self.status = "Pending"                 # Default instance variable

    # Method to update order status
    def process_shipment(self):
        self.status = "Shipped"
        print(f"Order {self.order_id} has been processed.")

    # Method to format order summary
    def get_summary(self):
        return f"Order #{self.order_id} | Customer: {self.customer_name} | Amount: ${self.total_amount:.2f} | Status: {self.status}"


# Instantiate (create) two unique order objects
order_1 = CustomerOrder(101, "Alice Smith", 250.75)
order_2 = CustomerOrder(102, "Bob Jones", 45.00)

# Check their starting summaries
print(order_1.get_summary())
print(order_2.get_summary())

# Process the first shipment
order_1.process_shipment()

# View summaries again to see updated status
print(order_1.get_summary())
print(order_2.get_summary()) # Status of Bob's order remains unaffected
```

```text
# Output:
Order #101 | Customer: Alice Smith | Amount: $250.75 | Status: Pending
Order #102 | Customer: Bob Jones | Amount: $45.00 | Status: Pending
Order 101 has been processed.
Order #101 | Customer: Alice Smith | Amount: $250.75 | Status: Shipped
Order #102 | Customer: Bob Jones | Amount: $45.00 | Status: Pending
```

---

### 2. Class Variables vs. Instance Variables

Let's look at how class variables are shared across all instances.

```python
class BankAccount:
    # Class variable: shared by all bank accounts
    interest_rate = 0.02

    def __init__(self, account_holder, balance):
        self.account_holder = account_holder  # Instance variable
        self.balance = balance                # Instance variable

    def apply_interest(self):
        # We access class variables using self.interest_rate or BankAccount.interest_rate
        interest = self.balance * self.interest_rate
        self.balance += interest


# Create two accounts
acc_a = BankAccount("Alice", 1000)
acc_b = BankAccount("Bob", 2000)

print(f"Starting balance Alice: {acc_a.balance}, Bob: {acc_b.balance}")

# Apply interest
acc_a.apply_interest()
acc_b.apply_interest()
print(f"Balance after standard interest: Alice: {acc_a.balance}, Bob: {acc_b.balance}")

# The bank raises interest rates globally
BankAccount.interest_rate = 0.05

# Apply interest again
acc_a.apply_interest()
acc_b.apply_interest()
print(f"Balance after global interest rate hike: Alice: {acc_a.balance}, Bob: {acc_b.balance}")
```

```text
# Output:
Starting balance Alice: 1000, Bob: 2000
Balance after standard interest: Alice: 1020.0, Bob: 2040.0
Balance after global interest rate hike: Alice: 1071.0, Bob: 2142.0
```

---

### 3. Encapsulation: Properties (`@property` and `@setter`)

What if someone attempts to set a negative price for a product? We can prevent this using properties.

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        # Python will route this initialization through the setter method automatically
        self.price = price 

    # Getter: makes price accessible as product.price instead of product.get_price()
    @property
    def price(self):
        return self._price # Single underscore denotes a private variable by convention

    # Setter: runs validation logic when product.price = value is called
    @price.setter
    def price(self, value):
        if value < 0:
            raise ValueError("Price cannot be negative!")
        self._price = value


# Create product
item = Product("Mechanical Keyboard", 85.00)
print(f"Product: {item.name} | Price: ${item.price:.2f}")

# Attempting to assign a valid new price
item.price = 95.00
print(f"New Price: ${item.price:.2f}")

# Attempting to assign an invalid negative price
try:
    item.price = -10.00
except ValueError as e:
    print(f"Validation Error Caught: {e}")
```

```text
# Output:
Product: Mechanical Keyboard | Price: $85.00
New Price: $95.00
Validation Error Caught: Price cannot be negative!
```

---

### 4. Inheritance & Polymorphism

Let's build a hierarchy of data cleaners. We will create a base `Cleaner` parent class and inherit specialized cleaning methods.

```python
class BaseCleaner:
    def __init__(self, dataset_name):
        self.dataset_name = dataset_name

    def load(self):
        print(f"Loading base dataset: {self.dataset_name}")


class CSVCleaner(BaseCleaner):
    # Overriding the parent load method
    def load(self):
        print(f"Parsing CSV tabular data for: {self.dataset_name}")

    def remove_empty_rows(self):
        print("Trimming empty CSV rows...")


class JSONCleaner(BaseCleaner):
    # Overriding the parent load method
    def load(self):
        print(f"Parsing nested JSON tree structure for: {self.dataset_name}")

    def flatten_json(self):
        print("Flattening JSON structures...")


# Polymorphism in action: calling the same method name on different objects
cleaners = [
    CSVCleaner("q1_sales.csv"),
    JSONCleaner("api_logs.json")
]

for c in cleaners:
    c.load() # Executes custom load method based on class type
```

```text
# Output:
Parsing CSV tabular data for: q1_sales.csv
Parsing nested JSON tree structure for: api_logs.json
```

---

### 5. Custom Spreadsheet Analyzer Case Study

Let's apply OOP to build a custom data processor class designed to handle an in-memory database table (represented as a list of dictionaries).

```python
class DataAnalyzer:
    def __init__(self, dataset_name, data):
        self.dataset_name = dataset_name
        self.data = data # Expected to be a list of dictionaries

    def calculate_column_sum(self, column_name):
        """Calculates total value of a numerical column."""
        total = 0.0
        for row in self.data:
            if column_name in row and row[column_name] is not None:
                total += float(row[column_name])
        return total

    def calculate_column_mean(self, column_name):
        """Calculates average value of a numerical column."""
        valid_rows = [row[column_name] for row in self.data if column_name in row and row[column_name] is not None]
        if not valid_rows:
            return 0.0
        return sum(valid_rows) / len(valid_rows)

    def filter_records(self, column_name, threshold_val):
        """Filters dataset to return rows where column > threshold."""
        return [row for row in self.data if column_name in row and row[column_name] > threshold_val]

    def generate_report(self):
        """Prints a summary report of the dataset."""
        print(f"--- Data Analysis Report: {self.dataset_name} ---")
        print(f"Total Records: {len(self.data)}")


# Raw spreadsheet data
sales_records = [
    {"product": "Laptop", "revenue": 1200, "qty": 1},
    {"product": "Mouse", "revenue": 50, "qty": 2},
    {"product": "Keyboard", "revenue": 100, "qty": 1},
    {"product": "Monitor", "revenue": 300, "qty": 2}
]

# Instantiate the analyzer
analyzer = DataAnalyzer("Q2 Sales Spreadsheet", sales_records)

# Generate basic report
analyzer.generate_report()

# Run mathematical analysis
total_rev = analyzer.calculate_column_sum("revenue")
avg_rev = analyzer.calculate_column_mean("revenue")
large_transactions = analyzer.filter_records("revenue", 200)

print(f"Total Revenue: ${total_rev:,.2f}")
print(f"Average Revenue per Sale: ${avg_rev:,.2f}")
print(f"Transactions > $200: {large_transactions}")
```

```text
# Output:
--- Data Analysis Report: Q2 Sales Spreadsheet ---
Total Records: 4
Total Revenue: $1,650.00
Average Revenue per Sale: $412.50
Transactions > $200: [{'product': 'Laptop', 'revenue': 1200, 'qty': 1}, {'product': 'Monitor', 'revenue': 300, 'qty': 2}]
```

---

## Gotchas & Common Mistakes

### 1. Mutable Class Variables
This is one of the most common mistakes beginners make. If you initialize a mutable collection (like a list or dictionary) as a class variable, it is **shared** across all instances.

#### ❌ The Mistake:
```python
class DataPipeline:
    # Class variable: Shared by all pipeline instances!
    processed_files = []

    def add_file(self, filename):
        self.processed_files.append(filename)


pipeline1 = DataPipeline()
pipeline1.add_file("sales.csv")

pipeline2 = DataPipeline()
pipeline2.add_file("users.csv")

# pipeline2.processed_files will contain BOTH files!
print(pipeline2.processed_files)
```

```text
# Output:
['sales.csv', 'users.csv']
```

#### ✅ The Fix:
Always define mutable collections inside the `__init__` constructor so that they are bound as instance variables unique to each object.

```python
class DataPipeline:
    def __init__(self):
        # Instance variable: Unique to this instance
        self.processed_files = [] 

    def add_file(self, filename):
        self.processed_files.append(filename)
```

### 2. Forgetting `self` in Method Signatures
If you define a method inside a class without `self` as the first argument:

```python
# ❌ Will raise TypeError when called
def log_status():
    print("Working...")
```

When you call `object.log_status()`, Python automatically passes the object instance as the first argument, causing it to crash with `TypeError: log_status() takes 0 positional arguments but 1 was given`.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Build a Customer Profiler Class
**Scenario:** You need to build a user profiling tool for marketing. Create a class called `CustomerProfile` that requires:
* `username` (string)
* `email` (string)
* `signup_year` (int)

Implement a property for `email` that raises a `ValueError` if the value does not contain an `@` symbol. Implement a method `is_legacy_user()` that returns `True` if the signup year is before 2020, and `False` otherwise.

```python
# Write your CustomerProfile class here
```

#### Solution:
```python
class CustomerProfile:
    def __init__(self, username, email, signup_year):
        self.username = username
        self.email = email
        self.signup_year = signup_year

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        if "@" not in value:
            raise ValueError("Invalid email format! Missing '@' symbol.")
        self._email = value

    def is_legacy_user(self):
        return self.signup_year < 2020


# Test the class
try:
    user = CustomerProfile("data_junkie", "analytics_at_datalogify.com", 2018)
except ValueError as e:
    print(e)

# This will trigger the validation error
try:
    invalid_user = CustomerProfile("hacker", "invalid_email_domain", 2021)
except ValueError as e:
    print(f"Validation success: {e}")
```

```text
# Output:
Validation success: Invalid email format! Missing '@' symbol.
```

---

## Section Recaps

* **Classes vs. Objects:** A class is the architectural blueprint; an object is the physical instance built from that blueprint.
* **`self`:** Represents the specific object instance calling a method. It maps instance data to the active function namespace.
* **Constructor (`__init__`):** Special initialization method called automatically when an object is instantiated.
* **Properties:** `@property` and `@setter` allow you to implement validation checks and protect access to variables while preserving a clean, variable-like syntax.
* **Class Variables:** Variables declared directly in the class block. They are shared globally among all class instances, so avoid using mutable types (lists/dicts) here.

---

## Common Interview Questions

### Q1: What is the difference between a class variable and an instance variable?
**Answer:**
* **Instance Variable:** Declared inside constructor methods (using `self.variable_name`). They belong to a specific instance of the class. If you change its value on one object, it does not affect any other objects of that class.
* **Class Variable:** Declared directly inside the class body, outside of any methods. They are shared by all instances of that class. Changing the value of a class variable (e.g., `Class.variable = value`) updates it for all existing and future object instances.

### Q2: What is the purpose of `super()` in inheritance?
**Answer:** The `super()` function returns a proxy object that delegates method calls to a parent (superclass). It is commonly used inside a child class's `__init__` constructor to run the initialization logic of the parent class, ensuring that all parental attributes are properly set up without writing redundant code.
For example:
```python
class CSVAnalyzer(BaseAnalyzer):
    def __init__(self, filename, separator):
        super().__init__(filename)  # Run parent init
        self.separator = separator  # Run custom child assignment
```

### Q3: What is name mangling in Python, and how does it relate to private attributes?
**Answer:** Python does not have a strict `private` keyword. Instead, it relies on naming conventions:
* A **single underscore prefix** (e.g., `self._balance`) signals to other developers that the attribute is intended for internal use only (protected).
* A **double underscore prefix** (e.g., `self.__balance`) triggers **name mangling**. Under the hood, Python renames the attribute to `_ClassName__attributeName`. This makes it harder for external scripts to access or overwrite the attribute directly, protecting it from accidental namespace collisions.

### Q4: How does `@property` differ from standard getter/setter methods?
**Answer:** In traditional languages, you access private attributes via methods: `obj.get_price()` or `obj.set_price(100)`.
In Python, `@property` allows you to wrap getter/setter logic inside methods, but lets users access them using clean, standard variable syntax: `obj.price` and `obj.price = 100`. This maintains visual simplicity while keeping the underlying data validated and secure.

### Q5: What is polymorphism, and how is it implemented in Python?
**Answer:** Polymorphism is the concept that different classes can define methods with the exact same name but execute different behaviors. 
In Python, which uses dynamic typing (often called "duck typing"), polymorphism does not require complex interfaces or class structures. As long as different objects implement a method with the same signature (e.g., `.load()`), Python will execute it happily, letting you process diverse object classes uniformly within loops or functions.

<div class="interview-tip">
When coding a class in an interview, remember to initialize collections inside __init__. Using mutable objects like lists as class variables is a classic trap interviewers watch for.
</div>
