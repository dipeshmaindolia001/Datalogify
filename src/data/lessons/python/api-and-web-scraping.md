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

Not all data lives in CSV files. Analysts constantly pull data from REST APIs (weather, finance, social media) and scrape data from websites (pricing, job listings, competitor analysis). This is how you automate data collection instead of copy-pasting from browsers.

## Making API Requests with `requests`

```python
import requests

# Simple GET request
response = requests.get("https://api.github.com/users/pandas-dev")
print(f"Status: {response.status_code}")

data = response.json()
print(f"Name: {data['name']}")
print(f"Public repos: {data['public_repos']}")
print(f"Followers: {data['followers']}")
```

```text
Status: 200
Name: pandas-dev
Public repos: 28
Followers: 3200
```

### Understanding HTTP Status Codes

```python
import requests

def check_api(url):
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            print(f"✓ {url} — Success")
        elif r.status_code == 404:
            print(f"✗ {url} — Not Found")
        elif r.status_code == 429:
            print(f"⏳ {url} — Rate Limited, slow down")
        elif r.status_code >= 500:
            print(f"✗ {url} — Server Error")
        return r
    except requests.exceptions.Timeout:
        print(f"⏱ {url} — Timed out")
    except requests.exceptions.ConnectionError:
        print(f"✗ {url} — Connection failed")

check_api("https://api.github.com")
```

```text
✓ https://api.github.com — Success
```

## Working with JSON APIs

```python
import requests

# Fetch exchange rates (free API)
url = "https://api.exchangerate-api.com/v4/latest/USD"
response = requests.get(url)
rates = response.json()

# Extract useful data
print(f"Base: {rates['base']}")
print(f"Date: {rates['date']}")
print(f"EUR: {rates['rates']['EUR']}")
print(f"GBP: {rates['rates']['GBP']}")
print(f"JPY: {rates['rates']['JPY']}")

# Convert amounts
amount_usd = 10000
for currency in ["EUR", "GBP", "JPY", "INR"]:
    converted = amount_usd * rates["rates"][currency]
    print(f"${amount_usd:,} USD = {converted:,.2f} {currency}")
```

```text
Base: USD
Date: 2025-02-08
EUR: 0.92
GBP: 0.79
JPY: 149.5
$10,000 USD = 9,200.00 EUR
$10,000 USD = 7,900.00 GBP
$10,000 USD = 1,495,000.00 JPY
$10,000 USD = 830,000.00 INR
```

## Query Parameters

```python
import requests

# Search GitHub repositories
params = {
    "q": "data analytics python",
    "sort": "stars",
    "order": "desc",
    "per_page": 5
}

response = requests.get("https://api.github.com/search/repositories", params=params)
data = response.json()

print(f"Total results: {data['total_count']:,}\n")
for repo in data["items"]:
    print(f"⭐ {repo['stargazers_count']:,} | {repo['full_name']}")
    print(f"  {repo['description'][:80] if repo['description'] else 'No description'}")
    print()
```

```text
Total results: 12,450

⭐ 45,200 | pandas-dev/pandas
  Flexible and powerful data analysis / manipulation library for Python

⭐ 32,100 | numpy/numpy
  The fundamental package for scientific computing with Python

⭐ 28,700 | matplotlib/matplotlib
  matplotlib: plotting with Python
```

## API Authentication

```python
import requests

# Bearer token authentication
headers = {
    "Authorization": "Bearer YOUR_API_KEY_HERE",
    "Content-Type": "application/json"
}

# API key as query parameter (common pattern)
params = {
    "api_key": "YOUR_KEY",
    "location": "New York",
    "units": "imperial"
}

# Example with basic auth
# response = requests.get(url, auth=("username", "password"))

# NEVER hardcode API keys in your code!
# Use environment variables instead:
import os
api_key = os.environ.get("API_KEY", "demo_key")
```

## Handling Pagination

```python
import requests

def fetch_all_pages(base_url, params=None, max_pages=5):
    """Fetch multiple pages of API results."""
    if params is None:
        params = {}
    
    all_results = []
    
    for page in range(1, max_pages + 1):
        params["page"] = page
        params["per_page"] = 100
        
        response = requests.get(base_url, params=params)
        
        if response.status_code != 200:
            print(f"Error on page {page}: {response.status_code}")
            break
        
        data = response.json()
        
        if not data:  # Empty page = no more results
            break
        
        all_results.extend(data)
        print(f"Page {page}: fetched {len(data)} items (total: {len(all_results)})")
    
    return all_results

# Usage:
# all_users = fetch_all_pages("https://api.example.com/users")
```

## API to DataFrame Pipeline

```python
import requests

# Fetch data from API and convert to structured format
def fetch_country_data():
    """Fetch country population data and return as list of dicts."""
    url = "https://restcountries.com/v3.1/region/europe"
    params = {"fields": "name,population,area,capital"}
    
    response = requests.get(url, params=params)
    countries = response.json()
    
    clean_data = []
    for c in countries[:10]:  # First 10 for demo
        clean_data.append({
            "country": c["name"]["common"],
            "population": c.get("population", 0),
            "area_km2": c.get("area", 0),
            "capital": c.get("capital", ["N/A"])[0] if c.get("capital") else "N/A",
        })
    
    return clean_data

# In production, you'd load this into Pandas:
# import pandas as pd
# data = fetch_country_data()
# df = pd.DataFrame(data)
# df["density"] = df["population"] / df["area_km2"]
# print(df.sort_values("population", ascending=False).head())
```

## Web Scraping with BeautifulSoup

When there's no API, you scrape the HTML. **Always check the site's robots.txt and terms of service first.**

```python
from bs4 import BeautifulSoup

# Example HTML (normally you'd fetch this with requests.get)
html = """
<html>
<body>
  <h1>Q1 Sales Report</h1>
  <table class="sales-table">
    <tr><th>Product</th><th>Revenue</th><th>Units</th></tr>
    <tr><td>Widget A</td><td>$50,000</td><td>1,200</td></tr>
    <tr><td>Widget B</td><td>$35,000</td><td>800</td></tr>
    <tr><td>Widget C</td><td>$28,000</td><td>650</td></tr>
  </table>
</body>
</html>
"""

soup = BeautifulSoup(html, "html.parser")

# Extract title
title = soup.find("h1").text
print(f"Report: {title}\n")

# Extract table data
table = soup.find("table", class_="sales-table")
rows = table.find_all("tr")

for row in rows[1:]:  # Skip header
    cols = row.find_all("td")
    product = cols[0].text
    revenue = cols[1].text
    units = cols[2].text
    print(f"{product}: {revenue} ({units} units)")
```

```text
Report: Q1 Sales Report

Widget A: $50,000 (1,200 units)
Widget B: $35,000 (800 units)
Widget C: $28,000 (650 units)
```

### Scraping a Real Page

```python
import requests
from bs4 import BeautifulSoup

def scrape_job_listings(url):
    """Scrape job titles and companies from a listings page."""
    headers = {"User-Agent": "Mozilla/5.0 (Data Analytics Student)"}
    
    response = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(response.text, "html.parser")
    
    jobs = []
    for listing in soup.find_all("div", class_="job-card"):
        title = listing.find("h2", class_="title")
        company = listing.find("span", class_="company")
        location = listing.find("span", class_="location")
        
        if title:
            jobs.append({
                "title": title.text.strip(),
                "company": company.text.strip() if company else "N/A",
                "location": location.text.strip() if location else "N/A",
            })
    
    return jobs

# Note: This is a template. Actual CSS classes vary per website.
# Always respect robots.txt and rate limits!
```

## Rate Limiting and Being a Good Citizen

```python
import requests
import time

def rate_limited_fetch(urls, delay=1.0):
    """Fetch multiple URLs with a delay between requests."""
    results = []
    
    for i, url in enumerate(urls):
        print(f"Fetching {i+1}/{len(urls)}: {url[:50]}...")
        
        try:
            response = requests.get(url, timeout=10)
            results.append({
                "url": url,
                "status": response.status_code,
                "size": len(response.content),
            })
        except Exception as e:
            results.append({
                "url": url,
                "status": "error",
                "error": str(e),
            })
        
        if i < len(urls) - 1:  # Don't sleep after last request
            time.sleep(delay)
    
    return results

# Usage:
# results = rate_limited_fetch(list_of_urls, delay=0.5)
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Pulling marketing/advertising data from APIs (Google Analytics, Facebook Ads)
- Fetching financial data for analysis (stock prices, exchange rates)
- Scraping competitor pricing data for market research
- Building automated data pipelines that collect data on a schedule
- Enriching internal datasets with external API data (weather, demographics)

</div>

<div class="challenge">

**Mini-Challenge:** Build a data collection script that:
1. Fetches the top 10 most popular Python repos from GitHub API
2. Extracts: name, stars, forks, language, description
3. Stores results as a list of dictionaries
4. Prints a formatted summary table
5. Add error handling for network failures

</div>

## Common Interview Questions

### Q1: What's the difference between an API and web scraping?

**Answer:** An API is a structured, official interface provided by a service — you send a request and get structured data back (usually JSON). Web scraping extracts data from HTML pages meant for humans. APIs are preferred: they're faster, more reliable, and the data is cleaner. Scraping is a fallback when no API exists, but it's fragile (breaks when the site changes) and may violate terms of service.

### Q2: How do you handle API rate limits?

**Answer:** Add delays between requests with `time.sleep()`, implement exponential backoff (wait longer after each failure), cache responses to avoid re-fetching, respect `Retry-After` headers, and batch requests when the API supports it. In production, use libraries like `tenacity` for retry logic.

### Q3: What HTTP methods should you know?

**Answer:** `GET` retrieves data (most common). `POST` sends data (creating records, submitting forms). `PUT` updates entire records. `PATCH` partially updates records. `DELETE` removes records. For data analytics, you'll mostly use `GET` and occasionally `POST` for authentication or complex queries.

### Q4: How do you parse JSON responses in Python?

**Answer:** Use `response.json()` with the `requests` library, or `json.loads(string)` for raw JSON strings. Access nested data with chained brackets: `data["results"][0]["name"]`. Use `.get()` for safe access: `data.get("key", "default")` to avoid KeyErrors on missing fields.

### Q5: Is web scraping legal?

**Answer:** It depends. Scraping publicly available data is generally legal, but violating a site's Terms of Service or scraping copyrighted/personal data can create legal issues. Always check `robots.txt`, respect rate limits, identify yourself with a User-Agent header, and never scrape login-protected content without permission. When in doubt, contact the site owner or use their official API.
