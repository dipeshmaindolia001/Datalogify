---
title: "APIs & Web Scraping — Get Data from the Web"
description: "Pull data from REST APIs and scrape web pages — automate your data collection pipeline."
category: "python"
order: 109
phase: 1
tags: ["python", "api", "web-scraping", "requests", "beautifulsoup"]
publishedDate: 2025-02-08
prevSlug: "seaborn-charts"
nextSlug: "lambda-map-filter"
seoTitle: "Python API & Web Scraping Tutorial | Datalogify"
seoDescription: "Learn to fetch data from REST APIs with requests and scrape web pages with BeautifulSoup."
---

## Why This Matters

In the real world, data rarely arrives on a silver platter as a clean, pre-packaged CSV file. Instead, it is scattered across the internet: locked behind databases, hosted on remote servers, or displayed on public web pages. 

As a data analyst or engineer, your ability to extract this data automatically is what separates you from someone who manually copy-pastes data into Excel. 

We acquire this external web data through two main methods:
1. **APIs (Application Programming Interfaces):** The official, structured gateway provided by a software system to share its data.
2. **Web Scraping:** The unofficial fallback where we write scripts to parse the raw HTML code of a web page and extract the data displayed to human visitors.

### The Visual Analogies

*   **APIs are like a Restaurant Waiter:**
    Imagine you are dining at a restaurant. You (the **Client**) cannot walk directly into the kitchen (the **Database/Server**) to grab food. Instead, you look at a menu (the **API Documentation**). You tell the waiter (the **API**) what you want (your **Request**). The waiter walks to the kitchen, gives the order to the chef, retrieves the prepared food on a clean, structured plate, and returns it to your table (the **Response**). You do not need to know how the chef cooked the meal; you just need to know how to order it from the menu.
    
    ```text
    +----------+                  +------------+                  +------------+
    |  Client  | === Request ===> | API Waiter | === Request ===> |   Server   |
    | (Python) | <=== Response == |   (JSON)   | <=== Response == | (Database) |
    +----------+                  +------------+                  +------------+
    ```

*   **Web Scraping is like a Super-Fast, Automated Copy-Paste Robot:**
    Imagine there is no waiter and no menu. The food is locked behind a glass display window (the **Web Page HTML**). To get the food, you have to look at it, manually write down the ingredients, and copy them to a notebook. Web scraping is building a high-speed robot that clicks, copies, and formats that information thousands of times faster than a human could, turning unstructured visual elements into clean rows and columns.

---

## Step-by-Step Concept Breakdown

Before writing any Python code, we must understand the language of the web: **HTTP (Hypertext Transfer Protocol)**.

### 1. The Anatomy of an HTTP Request
Every time your browser or Python script communicates with a web server, it sends an HTTP request containing:
*   **URL (Uniform Resource Locator):** The address where the resource lives (e.g., `https://api.github.com/users`).
*   **HTTP Method:** The action you want to perform.
    *   `GET`: Retrieve data (95% of data analytics tasks).
    *   `POST`: Submit new data (e.g., sending credentials or submitting a form).
    *   `PUT`/`PATCH`: Update existing data.
    *   `DELETE`: Remove data.
*   **Headers:** Metadata about the request (e.g., authorization keys, your identity, or the format you want to receive).
*   **Query Parameters:** Key-value pairs appended to the URL to filter or modify the request (e.g., `?limit=10&sort=desc`).
*   **Body (Payload):** The data sent with `POST` or `PUT` requests (usually structured as JSON).

### 2. HTTP Status Codes: The Server's Report Card
When a server responds, it includes a three-digit status code. As an analyst, you must recognize these:
*   **`200 OK`:** Success! The server processed the request and returned the data.
*   **`201 Created`:** Success! A new resource was successfully created (common in `POST` requests).
*   **`400 Bad Request`:** The server did not understand your request (check your parameters or JSON format).
*   **`401 Unauthorized`:** You forgot to provide an API key, or your key is invalid.
*   **`403 Forbidden`:** You are authenticated but do not have permission to access this resource.
*   **`404 Not Found`:** The URL does not exist.
*   **`429 Too Many Requests` (Rate Limited):** You sent too many requests in a short period. The server is blocking you temporarily to protect its resources.
*   **`500 Internal Server Error`:** The server crashed. The problem is on their end, not yours.

### 3. Understanding JSON (JavaScript Object Notation)
REST APIs almost always return data in **JSON** format. JSON looks almost identical to Python's native data structures:
*   JSON **Objects** map directly to Python **Dictionaries** (`{key: value}`).
*   JSON **Arrays** map directly to Python **Lists** (`[value1, value2]`).

Here is a typical API response representation:
```json
{
  "status": "active",
  "users": [
    {"id": 101, "username": "danalyzer", "skills": ["Python", "SQL"]},
    {"id": 102, "username": "pandas_guru", "skills": ["Pandas", "R"]}
  ]
}
```

### 4. BeautifulSoup and HTML Mechanics
When APIs are unavailable, we parse HTML (Hypertext Markup Language). HTML is organized as a nested tree of nodes (the **DOM - Document Object Model**).

```html
<div class="product-card" id="prod-99">
    <h2 class="title">Wireless Mouse</h2>
    <span class="price">$29.99</span>
</div>
```

In the tag above:
*   `div`, `h2`, and `span` are **Tags**.
*   `class` and `id` are **Attributes**.
*   `"product-card"` and `"Wireless Mouse"` are **Values** and **Text**.

**BeautifulSoup** parses this text document and allows us to search by tags (e.g., "Find all `span` tags") or by attributes (e.g., "Find the `div` with `class='product-card'"`).

### 5. Scraping Ethics and Rules (Crucial!)
Scraping is powerful but can easily get your IP address banned, or even lead to legal trouble if done irresponsibly. Always follow these rules:
1.  **Check `robots.txt`:** Add `/robots.txt` to any domain (e.g., `https://example.com/robots.txt`) to see what paths the website owner forbids bots from crawling.
2.  **Define a User-Agent:** By default, Python's `requests` library identifies itself as `python-requests/2.XX`. Many servers block this automatically. Customize your header to look like a real browser or identify your scraper (e.g., `{'User-Agent': 'Data Analytics Study Project (contact@email.com)'}`).
3.  **Respect Rate Limits:** Do not spam servers with thousands of requests per second. Use `time.sleep()` to pause between requests.
4.  **Do Not Scrape Private/Login Walls:** Scraping behind a login wall often violates terms of service and requires specialized authentication cookies.

---

## Code / Practical Walkthroughs

Let's walk through concrete implementations of retrieving data from the web.

### Example 1: Making API Requests & Parsing JSON (No Authentication)
We will query a public exchange rate API, parse the JSON payload, extract key values, and perform currency conversions.

```python
import requests

# 1. Define the API endpoint URL
url = "https://open.er-api.com/v6/latest/USD"

# 2. Send the HTTP GET request
response = requests.get(url, timeout=10)

# 3. Verify the status code before parsing
if response.status_code == 200:
    # 4. Parse the JSON response directly into a Python dictionary
    data = response.json()
    
    # 5. Extract values from the dictionary
    base_currency = data.get("base_code")
    update_time = data.get("time_last_update_utc")
    rates = data.get("rates", {})
    
    print(f"Base Currency: {base_currency}")
    print(f"Last Updated: {update_time}")
    print(f"EUR Rate: {rates.get('EUR')}")
    print(f"GBP Rate: {rates.get('GBP')}")
    
    # 6. Apply logic: Convert $500 USD to EUR and GBP
    usd_amount = 500.00
    eur_amount = usd_amount * rates.get("EUR", 1.0)
    gbp_amount = usd_amount * rates.get("GBP", 1.0)
    
    print(f"\nConversion Results:")
    print(f"  ${usd_amount:,.2f} USD = €{eur_amount:,.2f} EUR")
    print(f"  ${usd_amount:,.2f} USD = £{gbp_amount:,.2f} GBP")
else:
    print(f"Failed to fetch data. Status code: {response.status_code}")
```

```text
# Output:
Base Currency: USD
Last Updated: Wed, 08 Jul 2026 00:00:00 +0000
EUR Rate: 0.92
GBP Rate: 0.78

Conversion Results:
  $500.00 USD = €460.00 EUR
  $500.00 USD = £390.00 GBP
```

---

### Example 2: API Authentication, Headers, and Pagination
Most commercial APIs require authentication and divide search results across multiple pages (pagination). In this script, we will simulate a multi-page API fetching pipeline using headers.

```python
import requests
import time
import os

def fetch_github_repos(search_query, max_pages=2):
    """
    Fetches public repositories from the GitHub Search API across multiple pages.
    Demonstrates headers, query parameters, and pagination.
    """
    api_url = "https://api.github.com/search/repositories"
    
    # Retrieve API key from environment variable (Best Practice)
    # If not set, we run unauthenticated (subject to lower rate limits)
    github_token = os.environ.get("GITHUB_TOKEN")
    
    # Set headers. GitHub API requires a User-Agent.
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "DatalogifyAnalyticsTutorial/1.0"
    }
    
    if github_token:
        headers["Authorization"] = f"token {github_token}"
        
    all_repositories = []
    
    for page in range(1, max_pages + 1):
        print(f"Requesting Page {page}...")
        
        # Define query parameters
        params = {
            "q": search_query,
            "sort": "stars",
            "order": "desc",
            "page": page,
            "per_page": 5 # Limit to 5 results per page for demonstration
        }
        
        # Send the GET request with headers and parameters
        response = requests.get(api_url, headers=headers, params=params, timeout=10)
        
        # Gracefully handle rate limits (HTTP 429 or 403 on GitHub API)
        if response.status_code == 403 or response.status_code == 429:
            print("Rate limit reached. Stopping pagination.")
            break
        elif response.status_code != 200:
            print(f"Error fetching data on page {page}: {response.status_code}")
            break
            
        data = response.json()
        items = data.get("items", [])
        
        # Break loop if no more items are returned
        if not items:
            print("No more data available.")
            break
            
        # Extract and clean relevant details
        for item in items:
            repo_info = {
                "name": item.get("name"),
                "owner": item.get("owner", {}).get("login"),
                "stars": item.get("stargazers_count"),
                "forks": item.get("forks_count"),
                "url": item.get("html_url")
            }
            all_repositories.append(repo_info)
            
        # Respect API servers by pausing briefly between pages
        time.sleep(1.0)
        
    return all_repositories

# Execute search
repos = fetch_github_repos("pandas", max_pages=2)
for idx, repo in enumerate(repos, 1):
    print(f"{idx}. {repo['owner']}/{repo['name']} - ⭐ {repo['stars']:,} stars (Url: {repo['url']})")
```

```text
# Output:
Requesting Page 1...
Requesting Page 2...
1. pandas-dev/pandas - ⭐ 45,200 stars (Url: https://github.com/pandas-dev/pandas)
2. tebelorg/RPA-Python - ⭐ 4,100 stars (Url: https://github.com/tebelorg/RPA-Python)
3. toddmotto/public-apis - ⭐ 3,850 stars (Url: https://github.com/toddmotto/public-apis)
4. jakevdp/PythonDataScienceHandbook - ⭐ 39,800 stars (Url: https://github.com/jakevdp/PythonDataScienceHandbook)
5. wesm/pydata-book - ⭐ 15,200 stars (Url: https://github.com/wesm/pydata-book)
6. dynamic-pipeline/pandas-pipeline - ⭐ 850 stars (Url: https://github.com/dynamic-pipeline/pandas-pipeline)
```

---

### Example 3: Scraping & Importing HTML Tables directly into Pandas
Web pages often store structured data in HTML `<table>` elements. While we can use BeautifulSoup to parse them, **Pandas** contains a built-in function `pd.read_html()` that scrapes all tables on a page under the hood. We will show how to do both.

```python
import pandas as pd
from bs4 import BeautifulSoup
import io

# Mock HTML content representing a sales summary table
html_markup = """
<html>
<body>
    <h2>Quarterly Sales Performance</h2>
    <table class="report-table" id="sales-2026">
        <thead>
            <tr>
                <th>Region</th>
                <th>Representative</th>
                <th>Quarterly Revenue</th>
                <th>Target Met</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>North</td>
                <td>Sarah Connor</td>
                <td>$125,000</td>
                <td>Yes</td>
            </tr>
            <tr>
                <td>South</td>
                <td>John Doe</td>
                <td>$98,500</td>
                <td>No</td>
            </tr>
            <tr>
                <td>East</td>
                <td>Ellen Ripley</td>
                <td>$150,000</td>
                <td>Yes</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
"""

# --- Method A: Parsing manually with BeautifulSoup ---
print("--- Method A: BeautifulSoup Parsing ---")
soup = BeautifulSoup(html_markup, "html.parser")
table = soup.find("table", {"id": "sales-2026"})
rows = table.find("tbody").find_all("tr")

parsed_rows = []
for row in rows:
    columns = row.find_all("td")
    row_data = {
        "region": columns[0].text.strip(),
        "rep": columns[1].text.strip(),
        "revenue_str": columns[2].text.strip(),
        "target_met": columns[3].text.strip()
    }
    parsed_rows.append(row_data)

print("BeautifulSoup Extracted Records:")
print(parsed_rows)

# --- Method B: Using Pandas to Auto-Scrape ---
print("\n--- Method B: Pandas Auto-Scraping ---")
# Use io.StringIO to avoid FutureWarnings with raw strings in read_html
df_list = pd.read_html(io.StringIO(html_markup), attrs={"id": "sales-2026"})
df = df_list[0]

# Clean revenue column ($125,000 -> 125000.0)
df["Cleaned Revenue"] = df["Quarterly Revenue"].str.replace("$", "").str.replace(",", "").astype(float)

print("Pandas DataFrame Cleaned:")
print(df)
```

```text
# Output:
--- Method A: BeautifulSoup Parsing ---
BeautifulSoup Extracted Records:
[{'region': 'North', 'rep': 'Sarah Connor', 'revenue_str': '$125,000', 'target_met': 'Yes'}, {'region': 'South', 'rep': 'John Doe', 'revenue_str': '$98,500', 'target_met': 'No'}, {'region': 'East', 'rep': 'Ellen Ripley', 'revenue_str': '$150,000', 'target_met': 'Yes'}]

--- Method B: Pandas Auto-Scraping ---
Pandas DataFrame Cleaned:
  Region Representative Quarterly Revenue Target Met  Cleaned Revenue
0  North    Sarah Connor         $125,000        Yes         125000.0
1  South        John Doe          $98,500         No          98500.0
2   East    Ellen Ripley         $150,000        Yes         150000.0
```

---

### Example 4: BeautifulSoup CSS Selectors and Attribute Mining
Standard tags are easy, but real web pages contain deeply nested nodes. Here, we demonstrate using CSS selectors (`select` and `select_one`) to extract text and links (`href` attributes) from a mock web page.

```python
from bs4 import BeautifulSoup

html_doc = """
<div class="news-container">
    <article class="news-item featured">
        <a class="story-link" href="/stories/ai-trends-2026">AI Trends in 2026</a>
        <p class="author">By <span>Jane Smith</span></p>
    </article>
    <article class="news-item">
        <a class="story-link" href="/stories/pandas-tips">Pandas Speed Tricks</a>
        <p class="author">By <span>Bob Johnson</span></p>
    </article>
</div>
"""

soup = BeautifulSoup(html_doc, "html.parser")

# Use CSS Selectors to target items
# .select() returns a list of all matches, similar to find_all()
# .select_one() returns the first match, similar to find()
articles = soup.select("div.news-container article.news-item")

print("Extracted Articles:")
for article in articles:
    # Get the title text and link
    link_element = article.select_one("a.story-link")
    title = link_element.text
    path = link_element["href"] # Access tag attribute like a dict
    
    # Get nested author span
    author = article.select_one("p.author > span").text
    
    print(f"Title: {title}")
    print(f"  Path: {path}")
    print(f"  Author: {author}")
    print("-" * 20)
```

```text
# Output:
Extracted Articles:
Title: AI Trends in 2026
  Path: /stories/ai-trends-2026
  Author: Jane Smith
--------------------
Title: Pandas Speed Tricks
  Path: /stories/pandas-tips
  Author: Bob Johnson
--------------------
```

---

## Edge Cases & Common Mistakes

### 1. Hardcoding API Keys in Scripts
**The Mistake:** Writing your secret API key directly into the code and pushing it to GitHub. Hackers scan GitHub repositories for keys and will steal them within seconds.
**The Fix:** Use environment variables. Store your keys in a local `.env` file (and add it to `.gitignore`), and load them using Python's `os` module:
```python
import os
api_key = os.environ.get("MY_API_KEY")
```

### 2. Failing to Handle API Timeouts and Exceptions
**The Mistake:** Writing requests without timeouts. If a server is down, your program can hang indefinitely, locking up your data pipeline.
**The Fix:** Always specify a `timeout` (in seconds) and wrap network requests in a `try-except` block.
```python
import requests

try:
    # Timeout set to 5 seconds
    response = requests.get("https://api.example.com/data", timeout=5)
    # Raise an exception automatically for 4xx or 5xx codes
    response.raise_for_status() 
    data = response.json()
except requests.exceptions.Timeout:
    print("The server took too long to respond.")
except requests.exceptions.HTTPError as err:
    print(f"HTTP Error: {err}")
except requests.exceptions.RequestException as err:
    print(f"Network connection failed: {err}")
```

### 3. The Scraping Fragility Trap (Dynamic Classes)
**The Mistake:** Websites change their structure frequently. If you scrape elements by relying on highly specific class names like `<div class="x-card__title_bold_red_42">`, your script will break the next time the site changes its layout or updates its styling.
**The Fix:** Rely on elements that are less likely to change:
*   Semantic HTML tags (`<h1>`, `<article>`, `<table>`).
*   Stable IDs or structures (e.g., finding the table inside `#sales-container`).
*   Custom data attributes (like `data-testid`).

### 4. Dynamic Pages and Single Page Applications (SPAs)
**The Mistake:** Trying to scrape dynamic websites (built with React, Angular, Vue) using `requests`. When you load these sites, `requests.get()` only downloads a blank shell of HTML while JavaScript runs in the browser to load the actual data.
**The Fix:** If you look in your browser's Developer Tools (Network Tab), you will often find that the website itself makes a clean API call to load the data. You can copy that API URL and query it directly! If that fails, you must use browser automation tools like **Playwright** or **Selenium** which run a real browser instance to execute JavaScript before parsing.

---

## Practice Exercises & Mini-Projects

### Exercise 1: Build a Multi-City Weather Aggregator
**Objective:** Fetch weather data from an API, handle errors, and aggregate statistics.
1.  Use the public, unauthenticated API: `https://api.open-meteo.com/v1/forecast`
2.  Query the temperature for the following coordinates:
    *   New York: Latitude `40.71`, Longitude `-74.00`
    *   London: Latitude `51.50`, Longitude `-0.12`
    *   Tokyo: Latitude `35.67`, Longitude `139.65`
3.  Write a script that loops through these coordinates, sends a request to the API (e.g., `https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.00&current_weather=true`), extracts the current temperature, and prints a summary.
4.  Include a network timeout and error-handling routines.

### Exercise 2: Scraping and Cleaning Product Catalogs
**Objective:** Extract clean records from nested structured HTML and structure it into a CSV.
Given the following raw HTML representing an online catalog, write a BeautifulSoup script to:
1.  Extract the product name, price, availability status, and average rating.
2.  Clean the price to be a float value (remove `$`).
3.  Filter out products that are "Out of Stock".
4.  Load the final, clean list of dictionaries into a Pandas DataFrame and save it as `clean_catalog.csv`.

```python
html_catalog = """
<div class="store-grid">
    <div class="product-item" data-id="101">
        <h3 class="name">Advanced Python Programming Book</h3>
        <p class="status instock">In Stock</p>
        <span class="price">$49.99</span>
        <div class="rating" value="4.8">4.8 out of 5 stars</div>
    </div>
    <div class="product-item" data-id="102">
        <h3 class="name">Mechanical Keyboard</h3>
        <p class="status outofstock">Out of Stock</p>
        <span class="price">$120.00</span>
        <div class="rating" value="4.5">4.5 out of 5 stars</div>
    </div>
    <div class="product-item" data-id="103">
        <h3 class="name">USB-C Hub</h3>
        <p class="status instock">In Stock</p>
        <span class="price">$19.95</span>
        <div class="rating" value="4.2">4.2 out of 5 stars</div>
    </div>
</div>
"""
```

---

## Section Recaps

*   **API Fundamentals:** APIs provide structured communication channels using HTTP requests and JSON responses. They are cleaner, faster, and more reliable than web scraping.
*   **HTTP Methods & Codes:** GET requests read data, POST sends data. Always check for status codes like `200 OK` for success, `401` for authorization issues, and `429` for rate limits before trying to parse payloads.
*   **JSON Handling:** APIs return JSON, which Python decodes directly into nested dictionaries and lists. Access items safely using the `.get()` method to avoid crashes due to missing keys.
*   **Web Scraping Basics:** When no API exists, BeautifulSoup enables searching through raw HTML. Search tags using `.find()` and `.find_all()`, or use CSS selectors with `.select()` and `.select_one()`.
*   **Ethics & Scraping Best Practices:** Check `robots.txt`, set a custom browser-like `User-Agent` header, introduce delay loops (`time.sleep()`), and avoid overloading target web servers.

---

## Common Interview Questions

### Q1: When would you choose Web Scraping over an API, and vice versa?
**Answer:** You should always prefer an official API if it is available. APIs are officially supported, faster, return clean data (usually JSON), and have documentation. Web scraping is a fallback of last resort when no API exists. Scraping is fragile because it breaks the moment a site updates its layout, it is slower, and it places more load on the target server.

### Q2: How do you handle HTTP 429 status codes in a web scraping or API collection script?
**Answer:** An HTTP 429 status code indicates that you have hit a rate limit. To handle this:
1.  Read the response headers to look for a `Retry-After` field, which specifies the number of seconds you must wait.
2.  Implement an **Exponential Backoff** algorithm. If a request fails, wait 2 seconds; if it fails again, wait 4 seconds, then 8 seconds, etc.
3.  Inject a static delay (e.g., `time.sleep(1.0)`) into your request loops to prevent triggering the rate limits in the first place.

<div class="interview-tip">
<strong>Interview Tip:</strong> Mentioning "Exponential Backoff" and looking for "Retry-After" in headers demonstrates to interviewers that you have built actual production data pipelines.
</div>

### Q3: What is the difference between `.find()` and `.find_all()` in BeautifulSoup?
**Answer:** 
*   `.find()` searches the HTML document and returns the **first matching tag object**. If no match is found, it returns `None`. You can call further BeautifulSoup methods directly on the result (e.g., `element.find("span")`).
*   `.find_all()` searches the entire document and returns a **list-like ResultSet of all matching tag objects**. If no match is found, it returns an empty list `[]`. You cannot call tag methods on the list directly; you must iterate over the list with a loop or list comprehension.

### Q4: Why is it important to set a custom User-Agent in your request headers?
**Answer:** Many web servers block requests that carry the default Python User-Agent string (`python-requests/2.XX`) to prevent scraping bots from consuming their bandwidth. By setting a custom User-Agent that mimics a standard web browser (e.g., Chrome or Firefox) or by identifying your bot responsibly, you bypass automated barriers and ensure your requests are processed.

### Q5: How do you handle websites that load data dynamically using Javascript (like React or Angular applications) when scraping?
**Answer:** 
First, open your browser's Developer Tools and inspect the **Network** tab while refreshing or scrolling the page. Look for XHR/Fetch requests. Quite often, the site is pulling its data from an internal API. If you find this API endpoint, you can request it directly with Python, avoiding scraping altogether. 

If there is no direct API, or it is locked behind complex session security, you must use a headless browser automation library like **Playwright** or **Selenium**. These tools spin up an actual Chromium or Firefox engine to execute Javascript, and then let you extract the rendered HTML.
