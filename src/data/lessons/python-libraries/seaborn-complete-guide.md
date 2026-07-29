---
title: "Seaborn for Data Analytics & Machine Learning — The Complete Practical Guide"
description: "Master Seaborn statistical graphics: figure-level vs axes-level functions, relational, distribution, categorical, matrix plots, grids, styling, and ML workflows."
category: "python-libraries"
order: 4
phase: 2
tags: ["seaborn", "python", "data-visualization", "statistics", "charts"]
publishedDate: 2025-02-18
prevSlug: "matplotlib-complete-guide"
nextSlug: ""
seoTitle: "Seaborn Complete Practical Guide for Data Analytics & ML | Datalogify"
seoDescription: "Master Seaborn figure-level vs axes-level functions, relplot, catplot, heatmaps, pairplots, styling, and ML workflows with this code-first guide."
---

# Seaborn: The Complete Practical Guide
### For Data Analytics & Machine Learning

Every Seaborn function you need — from your first statistical plot to publication-quality figures. Built on top of Matplotlib, designed around Pandas DataFrames. Code-first, practical, no fluff.

---

## Contents
1. [Section 1 — Why Seaborn? Setup & the Grammar](#section-1--why-seaborn-setup--the-grammar)
2. [Section 2 — Relational Plots](#section-2--relational-plots)
3. [Section 3 — Distribution Plots](#section-3--distribution-plots)
4. [Section 4 — Categorical Plots](#section-4--categorical-plots)
5. [Section 5 — Regression & Statistical Estimation](#section-5--regression--statistical-estimation)
6. [Section 6 — Matrix Plots](#section-6--matrix-plots)
7. [Section 7 — Multi-Plot Grids](#section-7--multi-plot-grids)
8. [Section 8 — Styling, Themes & Color Palettes](#section-8--styling-themes--color-palettes)
9. [Section 9 — Combining Seaborn with Matplotlib](#section-9--combining-seaborn-with-matplotlib)
10. [Section 10 — Seaborn for ML](#section-10--seaborn-for-ml)
11. [Section 11 — Quick Reference Card](#section-11--quick-reference-card)

---

## Section 1 — Why Seaborn? Setup & the Grammar

### What Seaborn Architecture Adds to Matplotlib
Seaborn is built on top of Matplotlib and works directly with Pandas DataFrames. Instead of manually computing statistics and colors, you pass a DataFrame and column names — Seaborn handles grouping, aggregation, confidence intervals, and color mapping for you.

### Setup & the Long-Form Data Concept

> **Definition — Long-Form (Tidy) Data**: Long-form data means **one row per observation**, and **one column per variable**. Seaborn expects long-form DataFrames for its automatic grouping, palette mapping, and faceting features (which is exactly what `df.melt()` produces).

```python
# pip install seaborn
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

# Seaborn ships built-in example datasets — great for testing
tips = sns.load_dataset("tips")
print(tips.head())
#    total_bill   tip     sex smoker  day    time  size
# 0       16.99  1.01  Female     No  Sun  Dinner     2

# Seaborn uses "long-form" (tidy) data: one row per observation, one column per variable
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="day")
plt.show()
```

### Figure-Level vs Axes-Level Functions
This is **THE core concept** in Seaborn. Every plotting function is one of two kinds:

1. **AXES-LEVEL**: Draws into a single Matplotlib `Axes` object. Works directly inside standard `plt.subplots()` grids and accepts the `ax=` parameter.
2. **FIGURE-LEVEL**: Manages its **OWN Figure**, returns a `FacetGrid` object, and supports automatic row/column multi-chart faceting (`row=`, `col=`). Does **NOT** take an `ax=` parameter.

| Chart Family | Figure-Level Function (returns `FacetGrid`) | Axes-Level Equivalents |
| :--- | :--- | :--- |
| **Relational** | `relplot()` | `scatterplot()`, `lineplot()` |
| **Distribution** | `displot()` | `histplot()`, `kdeplot()`, `ecdfplot()`, `rugplot()` |
| **Categorical** | `catplot()` | `barplot()`, `boxplot()`, `violinplot()`, `stripplot()`, `swarmplot()` |

```python
# AXES-LEVEL — draws into a single matplotlib Axes, works with subplots
fig, ax = plt.subplots(figsize=(7, 5))
sns.scatterplot(data=tips, x="total_bill", y="tip", ax=ax)   # accepts ax=

# FIGURE-LEVEL — manages its OWN figure, returns a FacetGrid, supports faceting
g = sns.relplot(data=tips, x="total_bill", y="tip", col="time", kind="scatter") # NO ax= parameter
```

> **Figure-Level vs Axes-Level Rule**: Use **figure-level functions** (`relplot`, `displot`, `catplot`) when you want automatic grid faceting with `row=` or `col=`. Use **axes-level functions** (`scatterplot`, `boxplot`, `histplot`, etc.) when you need to place a chart inside your own custom `plt.subplots()` layout alongside other Matplotlib elements.

---

## Section 2 — Relational Plots

Show the relationship between two numeric variables — the core EDA workhorse.

### `sns.scatterplot()` — All Key Encodings
```python
fig, ax = plt.subplots(figsize=(8, 6))

sns.scatterplot(
    data=tips, 
    x="total_bill", 
    y="tip",
    hue="day",        # color by category (or numeric -> color gradient)
    size="size",      # marker size mapped to a column
    style="time",     # marker shape mapped to a column
    palette="viridis", # color palette
    sizes=(20, 200),  # min/max marker size range
    alpha=0.75,
    ax=ax
)

ax.set_title("Tip vs Total Bill with Multi-Variable Encodings", fontweight="bold")
plt.tight_layout()
plt.show()
```

### `sns.lineplot()` — Automatic Aggregation & Confidence Intervals
```python
flights = sns.load_dataset("flights")

fig, ax = plt.subplots(figsize=(9, 5))

sns.lineplot(
    data=flights, 
    x="year", 
    y="passengers",
    hue="month",
    estimator="mean",     # aggregate method for repeated x values
    errorbar=("ci", 95), # shaded 95% confidence band (auto-computed!)
    marker="o",
    ax=ax
)

# If x has repeated values, lineplot AUTOMATICALLY aggregates
# and draws a shaded confidence interval — no manual groupby needed!
ax.set_title("Passenger Volume Trends Over Time", fontweight="bold")
ax.legend(bbox_to_anchor=(1.02, 1), loc="upper left")
plt.tight_layout()
plt.show()
```

### `sns.relplot()` — Figure-Level Facet Grid
```python
# relplot() = scatterplot/lineplot + automatic small-multiples via row= / col=
g = sns.relplot(
    data=tips, 
    x="total_bill", 
    y="tip",
    kind="scatter",      # or "line"
    hue="smoker", 
    col="time", 
    row="sex",          # facet grid: rows x cols
    height=3.5, 
    aspect=1.1,         # aspect ratio per facet
    facet_kws=dict(margin_titles=True)
)

g.set_axis_labels("Total Bill ($)", "Tip ($)")
g.fig.suptitle("Tips by Time and Sex", y=1.03, fontweight="bold")
```

> **`hue` vs `size` vs `style` Encoding Rule**: You can encode up to three extra variables in a single scatterplot: color (`hue`), marker size (`size`), and marker shape (`style`). Beyond three variables, split data into clean facets with `relplot(col=, row=)` instead of overcrowding one plot.

---

## Section 3 — Distribution Plots

Understand how a variable is spread — histograms, densities, and cumulative views.

### `sns.histplot()` — Modern Histogram
```python
fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))

# Single distribution with KDE overlay
sns.histplot(
    data=tips, 
    x="total_bill",
    bins=25, 
    kde=True,            # kde=True overlays smooth density curve
    color="#7C3AED", 
    ax=axes[0]
)
axes[0].set_title("Total Bill Distribution with KDE")

# Compare groups — stacked or overlaid
sns.histplot(
    data=tips, 
    x="total_bill", 
    hue="time",
    multiple="stack",   # options: "stack", "dodge", "layer", "fill"
    palette="Set2", 
    ax=axes[1]
)
axes[1].set_title("Stacked Distribution by Meal Time")

plt.tight_layout()
plt.show()
```

### `sns.kdeplot()` — Smooth Density Estimates
```python
fig, ax = plt.subplots(figsize=(8, 5))

# 1D Overlaid Density Curves
sns.kdeplot(
    data=tips, 
    x="total_bill", 
    hue="time",
    fill=True, 
    alpha=0.4,
    common_norm=False, # normalize each group independently
    ax=ax
)

# 2D KDE — Bivariate Density Contour (Smooth heatmap style)
sns.kdeplot(
    data=tips, 
    x="total_bill", 
    y="tip",
    cmap="viridis", 
    fill=True, 
    thresh=0.05, 
    ax=ax
)
ax.set_title("2D Bivariate Density Contour", fontweight="bold")
```

### `displot()`, `rugplot()`, `ecdfplot()`
```python
# displot() — figure-level wrapper for hist / kde / ecdf
g = sns.displot(data=tips, x="total_bill", col="time", kind="hist", kde=True, height=4)

fig, ax = plt.subplots(figsize=(8, 4))

# rugplot — tick marks showing every individual raw observation along an axis
sns.rugplot(data=tips, x="total_bill", ax=ax, color="#EA580C")

# ecdfplot — Empirical Cumulative Distribution Function (great for percentile comparisons)
sns.ecdfplot(data=tips, x="total_bill", hue="time", ax=ax)
ax.set_title("Empirical Cumulative Distribution Function (ECDF)")
```

> **`histplot` vs `kdeplot`**: Use `histplot` for an accurate look at raw counts and bin structures. Use `kdeplot` when you want a smooth curve to compare multiple distributions simultaneously — overlapping histograms become cluttered fast, whereas overlapping KDE curves remain clean.

---

## Section 4 — Categorical Plots

Compare numerical values across discrete categories — the most used chart family in business analytics.

### `barplot()` & `countplot()`
```python
fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))

# barplot — displays summary statistics (mean by default) + 95% CI error bars
sns.barplot(
    data=tips, 
    x="day", 
    y="total_bill",
    estimator="mean", 
    errorbar=("ci", 95),
    palette="Blues_d", 
    ax=axes[0]
)
axes[0].set_title("Mean Total Bill per Day (with 95% CI)")

# countplot — bar chart of raw category FREQUENCIES (no y= parameter needed)
sns.countplot(
    data=tips, 
    x="day", 
    hue="sex",
    palette="pastel", 
    ax=axes[1]
)
axes[1].set_title("Transaction Count by Day & Gender")

plt.tight_layout()
plt.show()
```

### `boxplot()`, `violinplot()`, `boxenplot()`
```python
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))

# Boxplot — median, quartiles & outlier points
sns.boxplot(data=tips, x="day", y="total_bill", palette="Set2", ax=axes[0])
axes[0].set_title("Box Plot (Quartiles & Outliers)")

# Violinplot — side-by-side KDE density shape + boxplot quartiles
sns.violinplot(data=tips, x="day", y="total_bill", hue="sex", split=True, palette="muted", ax=axes[1])
axes[1].set_title("Split Violin Plot (Density Shape)")

# Boxenplot — Letter-value box plot for large datasets (detailed tail quantiles)
sns.boxenplot(data=tips, x="day", y="total_bill", palette="Purples", ax=axes[2])
axes[2].set_title("Boxen Plot (Enhanced Quantiles)")

plt.tight_layout()
plt.show()
```

### `stripplot()` & `swarmplot()` — Showing Every Data Point
```python
fig, ax = plt.subplots(figsize=(8, 5))

# Stripplot — jittered points showing raw distribution
sns.stripplot(data=tips, x="day", y="total_bill", jitter=True, alpha=0.5, color="#2563EB", ax=ax)

# Swarmplot — non-overlapping points (best for smaller datasets N < 500)
sns.swarmplot(data=tips, x="day", y="total_bill", color="#0F172A", size=3, ax=ax)

# POPULAR PATTERN: Overlay strip/swarm points ON TOP of a semi-transparent boxplot
sns.boxplot(data=tips, x="day", y="total_bill", ax=ax, boxprops=dict(alpha=0.4))
sns.stripplot(data=tips, x="day", y="total_bill", ax=ax, color="black", size=3)
ax.set_title("Boxplot with Raw Overlay Points", fontweight="bold")
```

### `catplot()` — Figure-Level Categorical Wrapper
```python
g = sns.catplot(
    data=tips, 
    x="day", 
    y="total_bill",
    hue="sex", 
    col="time",
    kind="box", # options: "strip", "swarm", "box", "violin", "boxen", "bar", "count", "point"
    height=4, 
    aspect=0.9
)
g.fig.suptitle("Categorical Facets across Meal Times", y=1.03, fontweight="bold")
```

---

## Section 5 — Regression & Statistical Estimation

Fit and visualize trend lines with confidence intervals automatically.

### `sns.regplot()` — Scatter + Linear Fit Line + Confidence Interval
```python
fig, ax = plt.subplots(figsize=(8, 6))

sns.regplot(
    data=tips, 
    x="total_bill", 
    y="tip",
    scatter_kws=dict(alpha=0.5, color="#2563EB"),
    line_kws=dict(color="#EA580C", lw=2),
    ci=95,      # shaded 95% confidence interval band around regression line
    order=1,    # 1 = linear fit, 2+ = polynomial fit
    ax=ax
)
ax.set_title("Tip vs Total Bill — Linear Regression Fit", fontweight="bold")
plt.tight_layout()
plt.show()
```

### `sns.lmplot()` — Figure-Level Regression Facets
```python
# lmplot() = regplot() + automatic faceting across groups
g = sns.lmplot(
    data=tips, 
    x="total_bill", 
    y="tip",
    hue="smoker", # separate regression line and color per group
    col="time",
    height=4.5, 
    aspect=1,
    scatter_kws=dict(alpha=0.5)
)
g.fig.suptitle("Regression Trends by Smoker & Meal Time", y=1.03, fontweight="bold")
```

### `sns.residplot()` — Residual Diagnostics
```python
fig, ax = plt.subplots(figsize=(8, 5))

# Check whether linear fit assumptions hold (residuals should be randomly scattered around 0)
sns.residplot(
    data=tips, 
    x="total_bill", 
    y="tip",
    lowess=True, # overlay locally weighted scatterplot smoothing curve
    line_kws=dict(color="#EA580C"), 
    ax=ax
)

ax.axhline(0, color="gray", linestyle=":")
ax.set_title("Residual Plot (Random scatter indicates good linear model fit)", fontweight="bold")
```

> **Under the Hood**: `regplot()` and `lmplot()` use bootstrap resampling to compute the shaded confidence band around the fit line. For huge datasets, pass `ci=None` to skip bootstrap calculations and speed up rendering.

---

## Section 6 — Matrix Plots

Visualize 2D grids of numbers — correlation matrices, confusion matrices, and pivot tables.

### `sns.heatmap()` — Heatmap Parameters & Correlation Matrix
```python
flights_wide = sns.load_dataset("flights").pivot(index="month", columns="year", values="passengers")

fig, ax = plt.subplots(figsize=(10, 6))

sns.heatmap(
    flights_wide,
    annot=True,     # display cell numerical values
    fmt="d",        # format as integer
    cmap="YlGnBu",   # sequential colormap for magnitude data
    linewidths=0.5, # gridlines between cells
    cbar_kws=dict(label="Passengers"),
    ax=ax
)

ax.set_title("Monthly Airline Passengers (1949–1960)", fontweight="bold")
plt.tight_layout()
plt.show()

# Correlation Matrix — #1 Heatmap Use Case
corr = tips.corr(numeric_only=True)
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", vmin=-1, vmax=1, center=0, square=True)
```

### Masking Upper Triangle (Clean Correlation Matrix)
```python
import numpy as np

# Mask upper triangle to avoid redundant mirrored values
mask = np.triu(np.ones_like(corr, dtype=bool)) # True = hide cell

fig, ax = plt.subplots(figsize=(7, 5))
sns.heatmap(
    corr, 
    mask=mask, 
    annot=True, 
    fmt=".2f",
    cmap="coolwarm", 
    center=0, 
    square=True,
    linewidths=1, 
    cbar_kws=dict(shrink=0.8),
    ax=ax
)
ax.set_title("Lower-Triangle Feature Correlation Matrix", fontweight="bold")
```

### `sns.clustermap()` — Hierarchical Clustering Heatmap
```python
# Reorders rows and columns based on hierarchical clustering dendrograms
g = sns.clustermap(
    corr, 
    cmap="vlag", 
    center=0,
    method="average", # linkage method
    figsize=(7, 7), 
    annot=True
)
```

---

## Section 7 — Multi-Plot Grids

The tools that make Seaborn indispensable for Exploratory Data Analysis (EDA).

### `sns.pairplot()` — Pairwise EDA Grid
```python
iris = sns.load_dataset("iris")

g = sns.pairplot(
    iris, 
    hue="species",
    palette="husl",
    diag_kind="kde",  # diagonal charts: "hist" or "kde"
    corner=True,     # show lower triangle only (eliminates redundant panels)
    plot_kws=dict(alpha=0.7, s=30)
)
g.fig.suptitle("Iris Pairwise Relationships Grid", y=1.02, fontweight="bold")
```

### `sns.jointplot()` — Bivariate + Marginal Distributions
```python
g = sns.jointplot(
    data=tips, 
    x="total_bill", 
    y="tip",
    kind="scatter", # options: "scatter", "kde", "hist", "hex", "reg"
    hue="time",
    height=7,
    marginal_kws=dict(fill=True)
)
g.set_axis_labels("Total Bill ($)", "Tip ($)")
```

### `sns.FacetGrid` — Manual Small Multiples
```python
# FacetGrid is the low-level object relplot/displot/catplot build on internally.
# Use it directly when wrapping custom Matplotlib function calls.
g = sns.FacetGrid(tips, col="time", row="smoker", height=3.5, aspect=1.2, margin_titles=True)
g.map_dataframe(sns.scatterplot, x="total_bill", y="tip", hue="day")
g.add_legend()
g.set_titles(col_template="{col_name}", row_template="Smoker: {row_name}")
```

> **Performance Tip for `pairplot`**: `pairplot()` draws an N × N grid for N numerical columns. For datasets with > 8 columns, select a subset of target columns first (`sns.pairplot(df[['c1', 'c2', 'c3']], hue='target')`) to prevent performance lag.

---

## Section 8 — Styling, Themes & Color Palettes

One line of setup makes every plot in your script look clean and professional.

### `sns.set_theme()` — Global Style Setup
```python
# Call once at the top of your notebook/script
sns.set_theme(
    style="whitegrid",   # options: "white", "dark", "whitegrid", "darkgrid", "ticks"
    palette="deep",       # default color palette for all plots
    context="notebook",   # scaling options: "paper", "notebook", "talk", "poster"
    font_scale=1.1,
    rc={"figure.figsize": (8, 5)}
)
```

| Style Parameter | Aesthetic Appearance & Recommended Purpose |
| :--- | :--- |
| `"whitegrid"` | White background with grey gridlines — **best default for analytics & reports** |
| `"darkgrid"` | Grey background with white gridlines — high screen contrast |
| `"white"` / `"dark"` | Clean background without gridlines — best for slide presentations |
| `"ticks"` | White background with axis tick marks — clean journal format |

### Color Palette Selection
```python
# 1. Qualitative Palettes — Distinct categories with no numeric order
sns.set_palette("Set2")     # options: "tab10", "husl", "deep", "pastel", "bright"

# 2. Sequential Palettes — Numerical ordering (Low -> High)
sns.set_palette("viridis")  # options: "rocket", "mako", "Blues", "flare"

# 3. Diverging Palettes — Numerical data centered on a zero/midpoint
sns.set_palette("coolwarm") # options: "vlag", "icefire", "RdBu"

# Custom Hex Palette
custom_palette = sns.color_palette(["#7C3AED", "#EA580C", "#16A34A", "#2563EB"])
sns.set_palette(custom_palette)
```

### `sns.despine()` — Remove Chart Spines
```python
fig, ax = plt.subplots(figsize=(7, 4))
sns.lineplot(data=tips, x="total_bill", y="tip", ax=ax)

# Remove top and right axis spines (signature Seaborn clean look)
sns.despine()
sns.despine(left=True) # optionally remove left spine
```

---

## Section 9 — Combining Seaborn with Matplotlib

Seaborn draws Matplotlib `Artists` — everything you know about Matplotlib still applies!

### Axes-Level Functions inside Subplot Grids
```python
fig, axes = plt.subplots(2, 2, figsize=(12, 9))

sns.scatterplot(data=tips, x="total_bill", y="tip", hue="day", ax=axes[0, 0])
sns.boxplot(data=tips, x="day", y="total_bill", ax=axes[0, 1])
sns.histplot(data=tips, x="tip", kde=True, ax=axes[1, 0])
sns.heatmap(tips.corr(numeric_only=True), annot=True, ax=axes[1, 1])

# Standard Matplotlib methods work seamlessly on individual axes
axes[0, 0].axhline(5, color="red", linestyle="--", label="Target Tip")
axes[0, 0].legend()

fig.suptitle("Restaurant Analytics Dashboard", fontsize=16, fontweight="bold")
plt.tight_layout()
plt.show()
```

### Saving Figures
```python
# Axes-level: save Matplotlib figure object as usual
fig.savefig("dashboard.png", dpi=300, bbox_inches="tight")

# Figure-level (relplot, catplot, displot, lmplot, pairplot, jointplot):
# Access .fig attribute or call .savefig directly on the Grid object
g = sns.relplot(data=tips, x="total_bill", y="tip", col="time")
g.savefig("relplot.png", dpi=300, bbox_inches="tight")
```

> **Common Gotcha**: Figure-level functions (`relplot`, `catplot`, `displot`, `lmplot`, `pairplot`, `jointplot`) manage their own figure, do **NOT** accept an `ax=` parameter, and cannot be nested inside `plt.subplots()`. Use Axes-level functions (`scatterplot`, `boxplot`, `histplot`, `regplot`) when inserting charts into your own subplot grids.

---

## Section 10 — Seaborn for ML

Essential plots during feature engineering, EDA, and model evaluation.

### Feature Selection Correlation Heatmap
```python
numeric_df = df.select_dtypes(include="number")
corr = numeric_df.corr()

fig, ax = plt.subplots(figsize=(9, 8))
sns.heatmap(
    corr, 
    annot=True, 
    fmt=".2f", 
    cmap="coolwarm",
    center=0, 
    vmin=-1, 
    vmax=1, 
    square=True,
    cbar_kws=dict(label="Correlation"), 
    ax=ax
)
ax.set_title("Feature Correlation Matrix (Spot Multicollinearity |r| > 0.9)", fontsize=14, fontweight="bold")
```

### Target Class Balance & Feature Distribution Checks
```python
fig, axes = plt.subplots(1, 2, figsize=(11, 4))

# 1. Target Class Imbalance Check
sns.countplot(data=df, x="target", palette="Set2", ax=axes[0])
axes[0].set_title("Class Imbalance Check")

# 2. Feature Separability by Target Class
sns.kdeplot(data=df, x="feature_1", hue="target", fill=True, common_norm=False, ax=axes[1])
axes[1].set_title("Feature Distribution by Target Class")
```

### Confusion Matrix Heatmap
```python
# Real World ML Evaluation: Confusion Matrix Heatmap
cm = np.array([[85, 12, 3],
               [8, 76, 16],
               [2, 9, 89]])
labels = ["Cat", "Dog", "Bird"]

fig, ax = plt.subplots(figsize=(6, 5))
sns.heatmap(
    cm, 
    annot=True, 
    fmt="d", 
    cmap="Blues",
    xticklabels=labels, 
    yticklabels=labels, 
    ax=ax
)
ax.set_xlabel("Predicted Label", fontweight="bold")
ax.set_ylabel("True Label", fontweight="bold")
ax.set_title("Multi-class Classification Confusion Matrix", fontweight="bold")
```

---

## Section 11 — Quick Reference Card

### Setup & Styling
| Function / Parameter | Action & Purpose |
| :--- | :--- |
| `import seaborn as sns` | Standard import statement |
| `sns.set_theme(style=, palette=)` | Global theme & palette configuration |
| `sns.load_dataset('tips')` | Load built-in example dataset |
| `sns.despine()` | Remove top and right plot borders |
| `sns.color_palette('viridis')` | Preview / return color palette |

### Relational Plots
| Function | Purpose & Key Encodings |
| :--- | :--- |
| `sns.scatterplot(x=, y=, hue=, size=, style=)` | Bivariate scatter with multi-variable encodings |
| `sns.lineplot(x=, y=, hue=, errorbar=)` | Time-series line chart with automatic CI band |
| `sns.relplot(kind='scatter'/'line', col=)` | Figure-level relational faceting |

### Distribution Plots
| Function | Purpose & Key Encodings |
| :--- | :--- |
| `sns.histplot(x=, bins=, kde=True)` | Histogram with optional density curve |
| `sns.kdeplot(x=, hue=, fill=True)` | Smooth Kernel Density Estimate curve |
| `sns.ecdfplot(x=, hue=)` | Empirical Cumulative Distribution Function |
| `sns.rugplot(x=)` | Individual observation tick marks |
| `sns.displot(kind=, col=)` | Figure-level distribution faceting |

### Categorical Plots
| Function | Purpose & Key Encodings |
| :--- | :--- |
| `sns.barplot(x=, y=, estimator=)` | Bar chart of summary statistic + 95% CI |
| `sns.countplot(x=, hue=)` | Frequency bar chart of category counts |
| `sns.boxplot(x=, y=, hue=)` | Quartiles, median, and outlier detection |
| `sns.violinplot(x=, y=, split=True)` | Boxplot combined with KDE shape |
| `sns.stripplot()` / `sns.swarmplot()` | Plot every individual data point |
| `sns.catplot(kind=, col=)` | Figure-level categorical faceting |

### Regression & Matrix Plots
| Function | Purpose & Key Encodings |
| :--- | :--- |
| `sns.regplot(x=, y=, order=, ci=)` | Scatter plot + linear fit + confidence band |
| `sns.lmplot(x=, y=, hue=, col=)` | Figure-level regression with faceting |
| `sns.residplot(x=, y=, lowess=True)` | Plot model fit residuals |
| `sns.heatmap(data, annot=, cmap=)` | 2D color grid for correlation / confusion matrices |
| `sns.clustermap(data, method=)` | Heatmap with hierarchical clustering dendrograms |

### Grids & ML Workflows
| Function | Purpose & Key Encodings |
| :--- | :--- |
| `sns.pairplot(df, hue=, vars=)` | All pairwise numerical relationships in one grid |
| `sns.jointplot(x=, y=, kind=)` | Bivariate plot with marginal distribution axes |
| `sns.FacetGrid(df, col=).map_dataframe()` | Low-level custom small multiples grid |
| `g.savefig('out.png', dpi=300)` | Save figure-level grid object |

> **Top 5 Patterns to Master First**:
> 1. `sns.set_theme()` at the top of every notebook.
> 2. `sns.scatterplot(hue=)` for two-variable EDA.
> 3. `sns.boxplot()` / `sns.violinplot()` for numerical comparisons across categories.
> 4. `sns.heatmap()` for correlation matrices.
> 5. Figure-level `col=` / `row=` faceting (`relplot`, `catplot`, `displot`) instead of manual subplot loops.
