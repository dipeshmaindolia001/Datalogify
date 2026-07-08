---
title: "Seaborn — Statistical Data Visualization"
description: "Create beautiful statistical charts with Seaborn — heatmaps, box plots, violin plots, and pair plots for EDA."
category: "python"
order: 108
phase: 1
tags: ["python", "seaborn", "visualization", "statistical-charts"]
publishedDate: 2025-02-07
prevSlug: "matplotlib-basics"
nextSlug: "api-and-web-scraping"
seoTitle: "Seaborn Tutorial for Data Analytics | Datalogify"
seoDescription: "Master Seaborn — heatmaps, box plots, violin plots, pair plots, and styled statistical visualizations."
---

## Why This Matters

Matplotlib gives you control. Seaborn gives you speed. One line of Seaborn produces a publication-quality statistical chart that would take 20+ lines of Matplotlib. Heatmaps, box plots, pair plots — the charts you need for exploratory data analysis are all built in. Every analyst uses Seaborn for EDA because it's fast and it looks good by default.

## Setting Up — Themes and Sample Data

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Set the default Seaborn theme
sns.set_theme(style="whitegrid")

# Check version
print(f"Seaborn version: {sns.__version__}")

# Built-in datasets for learning
print(sns.get_dataset_names()[:10])
```

```text
# Output:
Seaborn version: 0.13.2
['anagrams', 'anscombe', 'attention', 'brain_networks', 'car_crashes',
 'diamonds', 'dots', 'dowjones', 'exercise', 'flights']
```

## Bar Plot — sns.barplot()

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

df = pd.DataFrame({
    "department": ["Sales", "Sales", "Sales", "Engineering", "Engineering",
                   "Engineering", "Marketing", "Marketing", "Marketing",
                   "Support", "Support", "Support"],
    "quarter": ["Q1", "Q2", "Q3"] * 4,
    "revenue": [85000, 92000, 98000, 120000, 135000, 142000,
                45000, 52000, 48000, 30000, 28000, 35000],
})

plt.figure(figsize=(10, 6))
sns.barplot(data=df, x="department", y="revenue", hue="quarter", palette="viridis")
plt.title("Revenue by Department & Quarter", fontsize=14, fontweight="bold")
plt.ylabel("Revenue ($)")
plt.tight_layout()
plt.show()
```

```text
# Output:
Grouped bar chart — 4 departments, 3 bars each (Q1/Q2/Q3).
Engineering leads all quarters. Color-coded by quarter using viridis palette.
Error bars (confidence intervals) shown by default on each bar.
```

<div class="interview-tip">

**Interview Tip:** Seaborn's barplot shows the **mean** with a **95% confidence interval** by default. That's statistical — not just a simple bar chart. If you want plain totals without CI bars, use `estimator=sum` and `errorbar=None`. Knowing this distinction shows statistical awareness.

</div>

## Count Plot — sns.countplot()

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    "job_level": np.random.choice(
        ["Junior", "Mid", "Senior", "Lead", "Manager"],
        size=200,
        p=[0.35, 0.30, 0.20, 0.10, 0.05],
    ),
})

plt.figure(figsize=(10, 6))
order = ["Junior", "Mid", "Senior", "Lead", "Manager"]
sns.countplot(data=df, x="job_level", order=order, palette="Blues_d")
plt.title("Employee Distribution by Level", fontsize=14, fontweight="bold")
plt.ylabel("Count")
plt.tight_layout()
plt.show()
```

```text
# Output:
Bar chart showing counts — Junior: ~70, Mid: ~60, Senior: ~40,
Lead: ~20, Manager: ~10. Typical pyramid distribution.
Blues palette gets darker with seniority.
```

## Scatter Plot with Hue — sns.scatterplot()

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
n = 100
df = pd.DataFrame({
    "experience_years": np.random.uniform(1, 20, n),
    "salary": np.random.uniform(40000, 150000, n),
    "department": np.random.choice(["Engineering", "Sales", "Marketing"], n),
    "performance": np.random.choice(["High", "Medium", "Low"], n),
})
# Make salary correlate loosely with experience
df["salary"] = 35000 + df["experience_years"] * 5000 + np.random.normal(0, 10000, n)

plt.figure(figsize=(10, 7))
sns.scatterplot(
    data=df, x="experience_years", y="salary",
    hue="department", style="performance",
    s=100, alpha=0.8,
)
plt.title("Salary vs Experience by Department", fontsize=14, fontweight="bold")
plt.xlabel("Years of Experience")
plt.ylabel("Salary ($)")
plt.tight_layout()
plt.show()
```

```text
# Output:
Scatter plot with 100 points. Color = department (3 colors),
shape = performance level (circle, square, triangle).
Clear upward trend — more experience → higher salary.
Legend shows both hue and style categories.
```

## Box Plot — sns.boxplot()

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
data = {
    "department": (["Engineering"] * 50 + ["Sales"] * 50 +
                   ["Marketing"] * 50 + ["Support"] * 50),
    "salary": np.concatenate([
        np.random.normal(95000, 15000, 50),
        np.random.normal(72000, 12000, 50),
        np.random.normal(68000, 10000, 50),
        np.random.normal(55000, 8000, 50),
    ]),
}
df = pd.DataFrame(data)

plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x="department", y="salary", palette="Set2",
            order=["Engineering", "Sales", "Marketing", "Support"])
plt.title("Salary Distribution by Department", fontsize=14, fontweight="bold")
plt.ylabel("Salary ($)")
plt.tight_layout()
plt.show()
```

```text
# Output:
4 box plots — Engineering has highest median (~$95K) and widest spread.
Support has lowest median (~$55K) and tightest distribution.
Outlier dots visible beyond the whiskers.
Box = IQR (25th-75th percentile), line = median, whiskers = 1.5×IQR.
```

## Violin Plot — sns.violinplot()

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    "region": (["North"] * 80 + ["South"] * 80 +
               ["East"] * 80 + ["West"] * 80),
    "deal_size": np.concatenate([
        np.random.exponential(15000, 80),    # Right-skewed
        np.random.normal(20000, 5000, 80),   # Normal
        np.random.uniform(5000, 35000, 80),  # Uniform
        np.concatenate([np.random.normal(10000, 3000, 40),
                        np.random.normal(30000, 3000, 40)]),  # Bimodal
    ]),
})

plt.figure(figsize=(10, 6))
sns.violinplot(data=df, x="region", y="deal_size", palette="muted", inner="quartile")
plt.title("Deal Size Distribution by Region", fontsize=14, fontweight="bold")
plt.ylabel("Deal Size ($)")
plt.tight_layout()
plt.show()
```

```text
# Output:
4 violin shapes — each shows the full distribution:
  North: right-skewed (most deals small, few large)
  South: symmetric bell curve
  East: flat/uniform spread
  West: bimodal (two peaks — small deals and large deals)
Inner quartile lines show the 25th, 50th, 75th percentiles.
```

<div class="interview-tip">

**Interview Tip:** When asked "box plot vs violin plot?" — box plots show summary statistics (median, IQR, outliers). Violin plots show the **full distribution shape** — they reveal bimodality, skewness, and multi-peaked distributions that box plots completely hide. Use violin when the shape of the distribution matters.

</div>

## Heatmap — sns.heatmap()

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    "revenue": np.random.uniform(50000, 200000, 100),
    "ad_spend": np.random.uniform(5000, 50000, 100),
    "customers": np.random.randint(100, 1000, 100),
    "avg_order": np.random.uniform(50, 200, 100),
    "return_rate": np.random.uniform(0.02, 0.15, 100),
})

# Correlation matrix
corr = df.corr().round(2)

plt.figure(figsize=(8, 7))
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0,
            square=True, linewidths=0.5, fmt=".2f",
            vmin=-1, vmax=1)
plt.title("Feature Correlation Heatmap", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.show()
```

```text
# Output:
5x5 grid — each cell shows correlation between two features.
Diagonal is 1.00 (self-correlation). Red = positive, blue = negative.
Numbers annotated inside each cell. Square cells with clean grid lines.
Helps identify which features move together (multicollinearity check).
```

### Heatmap — Pivot Table Style

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
products = ["Product A", "Product B", "Product C", "Product D"]

data = []
for m in months:
    for p in products:
        data.append({"month": m, "product": p, "sales": np.random.randint(50, 300)})

df = pd.DataFrame(data)
pivot = df.pivot(index="product", columns="month", values="sales")
pivot = pivot[months]  # Ensure correct column order

plt.figure(figsize=(10, 5))
sns.heatmap(pivot, annot=True, fmt="d", cmap="YlGnBu", linewidths=0.5)
plt.title("Monthly Sales by Product", fontsize=14, fontweight="bold")
plt.ylabel("")
plt.tight_layout()
plt.show()
```

```text
# Output:
4 rows (products) × 6 columns (months) heatmap.
Each cell shows the sales count with color intensity.
Darker blue = higher sales. Quickly spots best/worst product-month combos.
```

## Pair Plot — sns.pairplot()

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
n = 150
df = pd.DataFrame({
    "salary": np.concatenate([
        np.random.normal(55000, 8000, 50),
        np.random.normal(80000, 10000, 50),
        np.random.normal(110000, 12000, 50),
    ]),
    "experience": np.concatenate([
        np.random.uniform(1, 5, 50),
        np.random.uniform(4, 10, 50),
        np.random.uniform(8, 20, 50),
    ]),
    "satisfaction": np.concatenate([
        np.random.uniform(3, 5, 50),
        np.random.uniform(3.5, 5, 50),
        np.random.uniform(2.5, 4.5, 50),
    ]),
    "level": ["Junior"] * 50 + ["Mid"] * 50 + ["Senior"] * 50,
})

sns.pairplot(df, hue="level", palette="Set1", diag_kind="kde",
             plot_kws={"alpha": 0.6, "s": 40})
plt.suptitle("Employee Metrics Pair Plot", y=1.02, fontsize=14, fontweight="bold")
plt.tight_layout()
plt.show()
```

```text
# Output:
3×3 grid of scatter plots — every numeric column vs every other column.
Diagonal shows KDE (density) curves instead of histograms.
Points colored by job level (Junior=red, Mid=blue, Senior=green).
Instantly reveals: salary↔experience strong positive correlation,
seniors cluster in high-salary/high-experience corner.
```

## FacetGrid — Small Multiples

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    "month": np.tile(["Jan", "Feb", "Mar", "Apr", "May", "Jun"], 60),
    "revenue": np.random.uniform(20000, 80000, 360),
    "region": np.repeat(["North", "South", "East"], 120),
    "channel": np.tile(np.repeat(["Online", "Store"], 60), 3),
})

g = sns.FacetGrid(df, col="region", row="channel", height=4, aspect=1.3)
g.map_dataframe(sns.barplot, x="month", y="revenue", palette="viridis",
                order=["Jan", "Feb", "Mar", "Apr", "May", "Jun"], errorbar=None)
g.set_titles("{col_name} — {row_name}")
g.set_axis_labels("Month", "Revenue ($)")
g.fig.suptitle("Revenue by Region & Channel", y=1.02, fontsize=16, fontweight="bold")
plt.tight_layout()
plt.show()
```

```text
# Output:
2 rows × 3 columns = 6 small bar charts.
Rows = channel (Online / Store), Columns = region (North / South / East).
Each mini-chart shows monthly revenue. Easy to compare any combination.
FacetGrid is the fastest way to slice data across two categorical dimensions.
```

## Color Palettes

```python
import seaborn as sns
import matplotlib.pyplot as plt

# Built-in palette categories
palettes = {
    "Qualitative": "Set2",      # Distinct categories
    "Sequential": "Blues",       # Low → High
    "Diverging": "coolwarm",    # Negative ← 0 → Positive
}

fig, axes = plt.subplots(1, 3, figsize=(15, 2))
for ax, (name, palette) in zip(axes, palettes.items()):
    sns.palplot(sns.color_palette(palette, 8), ax=ax)
    ax.set_title(name, fontweight="bold")

plt.tight_layout()
plt.show()

# Useful palettes to know:
# Qualitative: "Set1", "Set2", "tab10", "Paired"
# Sequential: "Blues", "Reds", "viridis", "YlGnBu"
# Diverging: "coolwarm", "RdBu", "RdYlGn"
```

```text
# Output:
3 rows of color swatches:
  Qualitative (Set2): 8 distinct pastel colors — for categories
  Sequential (Blues): light to dark blue gradient — for magnitude
  Diverging (coolwarm): blue → white → red — for +/- values
```

## Seaborn Themes

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

data = pd.DataFrame({
    "month": ["Jan", "Feb", "Mar", "Apr", "May"],
    "sales": [42, 45, 48, 46, 53],
})

styles = ["whitegrid", "darkgrid", "white", "dark", "ticks"]

fig, axes = plt.subplots(1, 5, figsize=(20, 4))
for ax, style in zip(axes, styles):
    with sns.axes_style(style):
        ax.plot(data["month"], data["sales"], marker="o")
        ax.set_title(style, fontweight="bold")
        ax.set_ylim(35, 60)

plt.tight_layout()
plt.show()
```

```text
# Output:
5 small line charts, each with a different Seaborn style.
whitegrid: white background + horizontal grid lines (most common for reports)
darkgrid: gray background + grid lines
white: clean white background, no grid
dark: gray background, no grid
ticks: white background with tick marks on all sides
```

## Where This Is Used on the Job

- **Exploratory data analysis** — pair plots and histograms to understand data before modeling
- **Correlation analysis** — heatmaps to find multicollinearity before regression
- **Distribution analysis** — box/violin plots for salary benchmarks, price comparisons
- **Stakeholder reports** — polished charts that look professional without manual tweaking
- **Feature engineering** — FacetGrid to spot interaction effects across categories

<div class="challenge">

### Challenge: Employee Analytics Dashboard

```python
import pandas as pd
import numpy as np

np.random.seed(42)
n = 200
df = pd.DataFrame({
    "department": np.random.choice(["Engineering", "Sales", "Marketing", "Support"], n),
    "salary": np.random.normal(75000, 15000, n).round(0),
    "experience": np.random.uniform(1, 20, n).round(1),
    "satisfaction": np.random.uniform(2.5, 5.0, n).round(1),
    "performance_score": np.random.randint(1, 6, n),
})
```

Tasks:
1. Create a correlation heatmap of all numeric columns (annotated, coolwarm palette)
2. Create a violin plot of salary by department — which department has the widest spread?
3. Create a pair plot colored by department
4. Create a FacetGrid of box plots: performance_score (x) vs salary (y), one column per department
5. Which Seaborn theme looks best for your charts? Set it globally.

</div>

## Common Interview Questions

### Q1: What is the difference between Matplotlib and Seaborn?

**Answer:** Matplotlib is a low-level library — you build charts element by element (axes, labels, colors). Seaborn is a high-level wrapper built on top of Matplotlib — it creates statistical visualizations in one line with beautiful defaults. Use Matplotlib when you need pixel-level control. Use Seaborn for fast EDA, statistical charts (box plots, violin plots, heatmaps), and when you want good-looking plots with minimal code. They're complementary, not competing.

### Q2: How do you create a correlation heatmap?

**Answer:** First compute the correlation matrix with `df.corr()`, then pass it to `sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)`. Set `center=0` so the color scale is symmetric around zero. Use `fmt=".2f"` for decimal formatting. This is a standard first step in EDA — it reveals which features are linearly related and flags multicollinearity before building regression models.

### Q3: When would you use a violin plot instead of a box plot?

**Answer:** Use a violin plot when the **shape** of the distribution matters. Box plots only show five summary statistics (min, Q1, median, Q3, max) and outliers. Violin plots reveal bimodality, skewness, and multiple peaks — distributions that box plots completely miss. For example, if salaries in a department cluster around two levels (junior and senior), a violin plot shows two bulges while a box plot just shows one wide box.

### Q4: What is a pair plot and when do you use it?

**Answer:** A pair plot (`sns.pairplot()`) creates a matrix of scatter plots for every pair of numeric columns, with distributions on the diagonal. It's the fastest way to spot correlations, clusters, and outliers across all features simultaneously. Use it in early EDA with the `hue` parameter to color by a categorical variable. Practical warning: don't use it on datasets with more than ~8 numeric columns — the grid becomes unreadable.

### Q5: How do you handle Seaborn color palettes for different data types?

**Answer:** Use **qualitative** palettes (Set2, tab10) for unordered categories (departments, regions). Use **sequential** palettes (Blues, viridis) for ordered magnitude (low→high revenue). Use **diverging** palettes (coolwarm, RdBu) for data with a meaningful center point (profit/loss, correlation coefficients). Set palettes globally with `sns.set_palette()` or per-plot with the `palette=` parameter. Use `sns.color_palette()` to preview colors before committing.
