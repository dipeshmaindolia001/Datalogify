---
title: "Matplotlib — Create Professional Data Visualizations"
description: "Build bar charts, line plots, scatter plots, and histograms that tell a clear data story."
category: "python"
order: 106
phase: 1
tags: ["python", "matplotlib", "visualization", "charts"]
publishedDate: 2025-02-06
prevSlug: "pandas-time-series"
nextSlug: "seaborn-charts"
seoTitle: "Matplotlib Tutorial for Data Analytics | Datalogify"
seoDescription: "Create professional charts with Matplotlib — bar, line, scatter, histogram, subplots, and styling."
---

## Why This Matters

Numbers in a spreadsheet don't convince anyone. A clean chart does. Every data analyst builds visualizations daily — dashboards, reports, presentations. Matplotlib is the foundation of Python plotting. Seaborn, Plotly, even Pandas `.plot()` — they all sit on top of Matplotlib. Master it and you control every pixel.

## Your First Plot — plt.plot()

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
revenue = [42000, 45000, 48000, 46000, 53000, 58000]

plt.plot(months, revenue)
plt.title("Monthly Revenue — 2024 H1")
plt.xlabel("Month")
plt.ylabel("Revenue ($)")
plt.show()
```

```text
# Output:
A line chart with months on x-axis, revenue on y-axis.
Line rises from 42K in Jan to 58K in Jun with a dip in Apr.
```

That's 5 lines of code for a complete chart. But let's make it professional.

## Line Plot with Styling

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
revenue_2023 = [38000, 41000, 44000, 43000, 47000, 51000]
revenue_2024 = [42000, 45000, 48000, 46000, 53000, 58000]

plt.figure(figsize=(10, 6))
plt.plot(months, revenue_2023, marker="o", linestyle="--", color="#888888", label="2023")
plt.plot(months, revenue_2024, marker="s", linestyle="-", color="#2196F3", linewidth=2, label="2024")

plt.title("Monthly Revenue Comparison", fontsize=16, fontweight="bold")
plt.xlabel("Month", fontsize=12)
plt.ylabel("Revenue ($)", fontsize=12)
plt.legend(fontsize=11)
plt.grid(axis="y", alpha=0.3)
plt.tight_layout()
plt.show()
```

```text
# Output:
Two-line chart comparing 2023 (dashed gray) vs 2024 (solid blue).
2024 outperforms 2023 in every month. Markers at each data point.
Grid lines on y-axis for readability.
```

### Key Styling Parameters

```python
# Line styles: "-", "--", "-.", ":"
# Markers: "o" (circle), "s" (square), "^" (triangle), "D" (diamond), "x"
# Colors: named ("red"), hex ("#FF5733"), RGB tuple ((0.2, 0.4, 0.8))
# linewidth: thickness of line
# markersize: size of marker
# alpha: transparency (0.0 to 1.0)
```

## Bar Chart — plt.bar()

```python
import matplotlib.pyplot as plt

departments = ["Sales", "Engineering", "Marketing", "Support", "HR"]
headcount = [45, 82, 28, 35, 12]
colors = ["#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#F44336"]

plt.figure(figsize=(10, 6))
bars = plt.bar(departments, headcount, color=colors, edgecolor="white", width=0.6)

# Add value labels on top of each bar
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width() / 2, height + 1,
             str(int(height)), ha="center", fontsize=12, fontweight="bold")

plt.title("Headcount by Department", fontsize=16, fontweight="bold")
plt.ylabel("Employees", fontsize=12)
plt.ylim(0, 100)
plt.tight_layout()
plt.show()
```

```text
# Output:
Vertical bar chart — Engineering tallest at 82, HR shortest at 12.
Each bar is a different color with the count displayed above it.
```

### Horizontal Bar Chart

```python
import matplotlib.pyplot as plt

products = ["Product A", "Product B", "Product C", "Product D", "Product E"]
revenue = [120000, 95000, 78000, 65000, 52000]

plt.figure(figsize=(10, 5))
plt.barh(products, revenue, color="#2196F3", edgecolor="white")
plt.xlabel("Revenue ($)")
plt.title("Revenue by Product", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.show()
```

```text
# Output:
Horizontal bars sorted by value. Product A leads at $120K.
Horizontal bars are better when category labels are long.
```

<div class="interview-tip">

**Interview Tip:** Use horizontal bar charts when you have long category names or many categories. Vertical bars work for ≤7 categories with short labels. This shows you think about readability — interviewers notice that.

</div>

## Scatter Plot — plt.scatter()

```python
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
ad_spend = np.random.uniform(1000, 10000, 50)
revenue = ad_spend * np.random.uniform(2.5, 5.5, 50) + np.random.normal(0, 3000, 50)

plt.figure(figsize=(10, 6))
plt.scatter(ad_spend, revenue, alpha=0.7, c="#2196F3", edgecolors="white", s=80)

plt.title("Ad Spend vs Revenue", fontsize=16, fontweight="bold")
plt.xlabel("Ad Spend ($)", fontsize=12)
plt.ylabel("Revenue ($)", fontsize=12)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()
```

```text
# Output:
50 blue dots showing positive correlation between ad spend and revenue.
Higher ad spend generally corresponds to higher revenue with some noise.
```

### Scatter with Color and Size Encoding

```python
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
n = 30
customers = {
    "spend": np.random.uniform(500, 5000, n),
    "visits": np.random.randint(5, 50, n),
    "satisfaction": np.random.uniform(3.0, 5.0, n),
    "tenure_months": np.random.randint(1, 60, n),
}

plt.figure(figsize=(10, 7))
scatter = plt.scatter(
    customers["spend"],
    customers["visits"],
    c=customers["satisfaction"],    # color = satisfaction score
    s=customers["tenure_months"] * 5,  # size = tenure
    cmap="RdYlGn",
    alpha=0.8,
    edgecolors="gray",
)

plt.colorbar(scatter, label="Satisfaction Score")
plt.title("Customer Analysis — 4 Dimensions in 1 Chart", fontsize=14, fontweight="bold")
plt.xlabel("Total Spend ($)")
plt.ylabel("Number of Visits")
plt.tight_layout()
plt.show()
```

```text
# Output:
Scatter plot where x=spend, y=visits, color=satisfaction (red-green),
size=tenure. Encodes 4 variables in a single chart.
Colorbar on the right shows the satisfaction score gradient.
```

## Histogram — plt.hist()

```python
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
salaries = np.concatenate([
    np.random.normal(55000, 8000, 200),   # Junior
    np.random.normal(85000, 10000, 150),  # Mid
    np.random.normal(120000, 15000, 50),  # Senior
])

plt.figure(figsize=(10, 6))
plt.hist(salaries, bins=30, color="#2196F3", edgecolor="white", alpha=0.8)

plt.title("Employee Salary Distribution", fontsize=16, fontweight="bold")
plt.xlabel("Annual Salary ($)", fontsize=12)
plt.ylabel("Number of Employees", fontsize=12)
plt.axvline(np.median(salaries), color="red", linestyle="--", label=f"Median: ${np.median(salaries):,.0f}")
plt.legend(fontsize=11)
plt.tight_layout()
plt.show()
```

```text
# Output:
Histogram showing bimodal salary distribution — peak around $55K (juniors)
and another around $85K (mid-level). Red dashed line at median ~$67K.
Long right tail from senior salaries above $100K.
```

## Pie Chart — plt.pie()

```python
import matplotlib.pyplot as plt

channels = ["Organic Search", "Paid Ads", "Social Media", "Email", "Referral"]
traffic = [42, 25, 18, 10, 5]
explode = [0.05, 0, 0, 0, 0]  # Slightly separate the largest slice
colors = ["#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#F44336"]

plt.figure(figsize=(8, 8))
plt.pie(traffic, labels=channels, autopct="%1.1f%%", startangle=90,
        explode=explode, colors=colors, textprops={"fontsize": 11})
plt.title("Website Traffic Sources", fontsize=16, fontweight="bold")
plt.tight_layout()
plt.show()
```

```text
# Output:
Pie chart — Organic Search dominates at 42.0%, slightly pulled out.
Paid Ads 25.0%, Social 18.0%, Email 10.0%, Referral 5.0%.
```

<div class="interview-tip">

**Interview Tip:** Pie charts get criticized a lot. Use them only for 3–5 categories that add up to 100%. For anything more complex, a horizontal bar chart is easier to read. Knowing *when not* to use a chart type is as important as knowing how to build one.

</div>

## Subplots — Multiple Charts in One Figure

```python
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
revenue = [42000, 45000, 48000, 46000, 53000, 58000]
expenses = [38000, 37000, 40000, 42000, 41000, 43000]
profit = [r - e for r, e in zip(revenue, expenses)]
customers = [320, 345, 360, 350, 390, 420]

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Top-left: Revenue line
axes[0, 0].plot(months, revenue, marker="o", color="#2196F3", linewidth=2)
axes[0, 0].set_title("Revenue Trend", fontweight="bold")
axes[0, 0].set_ylabel("Revenue ($)")

# Top-right: Expenses bar
axes[0, 1].bar(months, expenses, color="#F44336", edgecolor="white")
axes[0, 1].set_title("Monthly Expenses", fontweight="bold")
axes[0, 1].set_ylabel("Expenses ($)")

# Bottom-left: Profit bar
colors = ["#4CAF50" if p > 0 else "#F44336" for p in profit]
axes[1, 0].bar(months, profit, color=colors, edgecolor="white")
axes[1, 0].set_title("Monthly Profit", fontweight="bold")
axes[1, 0].set_ylabel("Profit ($)")
axes[1, 0].axhline(0, color="black", linewidth=0.5)

# Bottom-right: Customers scatter
axes[1, 1].scatter(months, customers, s=100, color="#9C27B0", zorder=5)
axes[1, 1].plot(months, customers, color="#9C27B0", alpha=0.3)
axes[1, 1].set_title("Active Customers", fontweight="bold")
axes[1, 1].set_ylabel("Customers")

fig.suptitle("Q1-Q2 2024 Business Dashboard", fontsize=18, fontweight="bold", y=1.02)
plt.tight_layout()
plt.show()
```

```text
# Output:
2x2 grid of charts:
  Top-left: rising revenue line from $42K to $58K
  Top-right: expenses bar chart, relatively flat around $38-43K
  Bottom-left: profit bars, all green (positive), growing trend
  Bottom-right: customer count scatter, upward trend from 320 to 420
Main title "Q1-Q2 2024 Business Dashboard" spans the top.
```

## Figure and Axes — The Object-Oriented Way

```python
import matplotlib.pyplot as plt
import numpy as np

# The OO approach gives you full control
fig, ax = plt.subplots(figsize=(10, 6))

quarters = ["Q1", "Q2", "Q3", "Q4"]
region_a = [150, 180, 165, 200]
region_b = [130, 155, 170, 190]

x = np.arange(len(quarters))
width = 0.35

bars1 = ax.bar(x - width/2, region_a, width, label="Region A", color="#2196F3")
bars2 = ax.bar(x + width/2, region_b, width, label="Region B", color="#FF9800")

ax.set_xlabel("Quarter")
ax.set_ylabel("Revenue ($K)")
ax.set_title("Regional Revenue Comparison", fontweight="bold", fontsize=14)
ax.set_xticks(x)
ax.set_xticklabels(quarters)
ax.legend()
ax.grid(axis="y", alpha=0.3)

plt.tight_layout()
plt.show()
```

```text
# Output:
Grouped bar chart with two bars per quarter.
Region A (blue) and Region B (orange) side by side.
Region A leads in Q1 and Q4, Region B closes the gap in Q3.
```

## Styling and Themes — plt.style.use()

```python
import matplotlib.pyplot as plt

# See all available styles
print(plt.style.available)
```

```text
# Output:
['Solarize_Light2', '_classic_test_patch', '_mpl-gallery', '_mpl-gallery-nogrid',
 'bmh', 'classic', 'dark_background', 'fast', 'fivethirtyeight', 'ggplot',
 'grayscale', 'seaborn-v0_8', 'seaborn-v0_8-bright', 'seaborn-v0_8-colorblind',
 'seaborn-v0_8-dark', 'seaborn-v0_8-darkgrid', 'seaborn-v0_8-deep',
 'seaborn-v0_8-muted', 'seaborn-v0_8-notebook', 'seaborn-v0_8-paper',
 'seaborn-v0_8-pastel', 'seaborn-v0_8-poster', 'seaborn-v0_8-talk',
 'seaborn-v0_8-ticks', 'seaborn-v0_8-white', 'seaborn-v0_8-whitegrid',
 'tableau-colorblind10']
```

```python
import matplotlib.pyplot as plt

plt.style.use("fivethirtyeight")

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
values = [42, 45, 48, 46, 53, 58]

plt.figure(figsize=(10, 6))
plt.plot(months, values, marker="o", linewidth=2)
plt.title("Revenue with FiveThirtyEight Style")
plt.ylabel("Revenue ($K)")
plt.tight_layout()
plt.show()

# Reset to default
plt.style.use("default")
```

```text
# Output:
Same line chart but with FiveThirtyEight style — gray background,
thicker grid lines, clean typography. Matches the data journalism aesthetic.
```

## Annotations — Highlight Key Data Points

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
revenue = [42, 45, 48, 46, 53, 58, 55, 62, 71]

plt.figure(figsize=(12, 6))
plt.plot(months, revenue, marker="o", color="#2196F3", linewidth=2)

# Annotate the peak
plt.annotate(
    "New record: $71K",
    xy=("Sep", 71),
    xytext=("Jul", 74),
    fontsize=12,
    fontweight="bold",
    arrowprops=dict(arrowstyle="->", color="red", lw=2),
    color="red",
)

# Annotate the dip
plt.annotate(
    "Campaign ended",
    xy=("Apr", 46),
    xytext=("Feb", 40),
    fontsize=11,
    arrowprops=dict(arrowstyle="->", color="gray"),
    color="gray",
)

plt.title("Monthly Revenue with Annotations", fontsize=14, fontweight="bold")
plt.ylabel("Revenue ($K)")
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()
```

```text
# Output:
Line chart with two annotations:
  - Red arrow pointing to Sep peak: "New record: $71K"
  - Gray arrow pointing to Apr dip: "Campaign ended"
Annotations explain WHY the data changed — this is storytelling with data.
```

## Saving Figures — plt.savefig()

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
revenue = [42000, 45000, 48000, 46000, 53000, 58000]

fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(months, revenue, marker="o", color="#2196F3", linewidth=2)
ax.set_title("Monthly Revenue — 2024 H1", fontweight="bold")
ax.set_ylabel("Revenue ($)")

# Save as PNG (high resolution for presentations)
fig.savefig("revenue_chart.png", dpi=300, bbox_inches="tight", facecolor="white")

# Save as PDF (vector — scales perfectly for print)
fig.savefig("revenue_chart.pdf", bbox_inches="tight")

# Save as SVG (vector — perfect for web)
fig.savefig("revenue_chart.svg", bbox_inches="tight")

print("Charts saved: revenue_chart.png, .pdf, .svg")
```

```text
# Output:
Charts saved: revenue_chart.png, .pdf, .svg

# bbox_inches="tight" removes whitespace padding
# dpi=300 gives print-quality resolution (default is 100)
```

## Where This Is Used on the Job

- **Weekly reports** — revenue trends, KPI charts embedded in slides and emails
- **Dashboards** — automated chart generation for stakeholder reporting
- **EDA** — quick scatter plots and histograms to understand distributions
- **Presentations** — polished, publication-quality charts for leadership
- **Data storytelling** — annotated charts that explain the "why" behind trends

<div class="challenge">

### Challenge: Sales Dashboard

```python
import numpy as np

np.random.seed(42)
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
online_sales = np.random.randint(30000, 70000, 12)
store_sales = np.random.randint(20000, 50000, 12)
```

Tasks:
1. Create a 2x2 subplot figure (figsize 14x10)
2. **Top-left:** Line plot comparing online vs store sales with a legend
3. **Top-right:** Stacked bar chart showing total sales per month (online + store)
4. **Bottom-left:** Histogram of online_sales with 8 bins and a median line
5. **Bottom-right:** Scatter plot of online_sales vs store_sales — is there a correlation?
6. Add a main title, save as PNG at 300 DPI

</div>

## Common Interview Questions

### Q1: What is the difference between plt.plot() and ax.plot()?

**Answer:** `plt.plot()` is the pyplot (procedural) interface — quick and easy for simple charts. `ax.plot()` is the object-oriented interface where you create figure and axes objects explicitly with `fig, ax = plt.subplots()`. The OO approach is better for subplots, customization, and production code because you have direct references to each axes object. In interviews, mention that you prefer the OO approach for anything beyond a quick exploratory plot.

### Q2: How do you create subplots in Matplotlib?

**Answer:** Use `fig, axes = plt.subplots(nrows, ncols, figsize=(w, h))`. Access individual plots with `axes[row, col]` for 2D grids, or `axes[i]` for single rows/columns. Each axes object has its own `.set_title()`, `.set_xlabel()`, `.plot()`, etc. Use `fig.suptitle()` for a main title and `plt.tight_layout()` to prevent overlapping. For unequal subplot sizes, use `GridSpec`.

### Q3: When would you use a histogram vs a bar chart?

**Answer:** A histogram shows the **distribution** of a single continuous variable (e.g., salary distribution, age distribution) — the x-axis is numerical ranges (bins), y-axis is frequency. A bar chart compares **categories** (e.g., revenue by department) — the x-axis is discrete labels. Histograms have no gaps between bars; bar charts do. This distinction comes up often in data visualization interviews.

### Q4: How do you save a Matplotlib figure with good quality?

**Answer:** Use `fig.savefig("chart.png", dpi=300, bbox_inches="tight", facecolor="white")`. `dpi=300` gives print quality. `bbox_inches="tight"` removes excess whitespace. `facecolor="white"` ensures the background isn't transparent. For scalable vector graphics (web or print), save as SVG or PDF instead — they scale without pixelation.

### Q5: How do you add annotations and labels to highlight key data points?

**Answer:** Use `plt.annotate(text, xy=(x, y), xytext=(tx, ty), arrowprops=dict(...))` to add labeled arrows pointing to specific data points. For simple value labels on bars, loop through the bar objects and use `plt.text(x, y, label)`. Annotations are critical for data storytelling — they turn a chart from "here's data" into "here's what the data means." Always annotate outliers, peaks, trend changes, or business events.
