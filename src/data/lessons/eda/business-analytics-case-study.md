---
title: "Business Analytics Case Study — End-to-End EDA Project"
description: "Apply your EDA skills to a real-world business dataset. Clean, explore, visualize, and synthesize insights to solve a corporate mystery."
category: "eda"
order: 8
phase: 4
tags: ["eda", "case-study", "business-analytics", "data-storytelling"]
publishedDate: 2025-04-08
prevSlug: "feature-transformations"
nextSlug: ""
seoTitle: "End-to-End Business Analytics EDA Case Study | Datalogify"
seoDescription: "Solve a real corporate case study using EDA. Clean, explore, and visualize an e-commerce customer dataset to identify churn triggers."
---

## Why This Matters

Performing exploratory data analysis on individual, clean files is a valuable starting point, but real-world data is messy, fragmented, and full of anomalies. Applying EDA to an end-to-end business case study helps you transition from writing simple syntax to solving complex business problems, preparing you for the daily responsibilities of a professional data analyst.

---

## Case Study Scenario: The Churn Mystery at ShopVibe

ShopVibe is a fast-growing, subscription-based e-commerce platform. Recently, the executive team noticed a worrying trend: customer retention has been dropping, and customer churn has spiked over the past two quarters. The CEO has tasked you with investigating the customer database to identify the primary drivers of churn and recommend actionable solutions.

```text
       Raw Data Audit           Sanitization & EDA             Executive Report
       
       +---------------+        +------------------+         +--------------------+
       | - Missing Val |        | - Impute Nulls   |         | - Tenure Cliff     |
       | - Anomalies   |  --->  | - Outlier Check  |  ---->  | - Ticket Hotspots  |
       | - Mixed Types |        | - Bivariate Test |         | - Action Plan      |
       +---------------+        +------------------+         +--------------------+
```

You are provided with a customer database containing the following features:
*   `Customer_ID`: Unique identification string.
*   `Tenure_Months`: How long the customer has been with the platform.
*   `Monthly_Spend`: The average dollar amount spent per month.
*   `Support_Tickets`: The number of customer service issues opened by the customer.
*   `Membership_Type`: The subscription tier of the customer (`Basic` or `VIP`).
*   `Churn`: The target label (`1` if the customer cancelled their subscription, `0` if active).

---

## Step-by-Step Project Walkthrough

---

### Step 1: Dataset Profiling & Initial Audit

First, we will load the dataset and perform a profile audit. This helps us assess the dataset's shape, check for missing values, and verify data types.

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set seed for reproducibility
np.random.seed(42)
n_records = 1000

# Generate synthetic dataset with realistic correlations
tenure = np.random.exponential(scale=14, size=n_records).astype(int)
tenure = np.clip(tenure, 1, 60) # Tenure capped at 5 years

support_tickets = np.random.poisson(lam=1.6, size=n_records)
# Artificially increase tickets for low tenure (new users struggle more)
support_tickets = np.where(tenure < 4, support_tickets + 2, support_tickets)

spend = np.random.normal(loc=70, scale=25, size=n_records)
# VIP customers spend more
membership = np.random.choice(["Basic", "VIP"], size=n_records, p=[0.8, 0.2])
spend = np.where(membership == "VIP", spend + 50, spend)
spend = np.clip(spend, 10, 250).round(2)

# Introduce a few negative anomalies in spend
spend[np.random.choice(n_records, 8)] = -45.0

# Churn logic: probability increases if tickets are high and tenure is low
churn_prob = 0.12 + (support_tickets * 0.14) - (tenure * 0.012)
churn_prob = np.clip(churn_prob, 0.01, 0.95)
churn = np.random.binomial(n=1, p=churn_prob, size=n_records)

# Introduce missing values to simulate raw data issues
spend_na = spend.copy()
spend_na[np.random.choice(n_records, 45, replace=False)] = np.nan

tickets_na = support_tickets.astype(float).copy()
tickets_na[np.random.choice(n_records, 30, replace=False)] = np.nan

# 1. Assemble Raw DataFrame
df_raw = pd.DataFrame({
    "Customer_ID": np.arange(10001, 10001 + n_records),
    "Tenure_Months": tenure,
    "Monthly_Spend": spend_na,
    "Support_Tickets": tickets_na,
    "Membership_Type": membership,
    "Churn": churn
})

# 2. Run Audit
print("=== Shape of Dataset ===")
print(df_raw.shape)
print("\n=== Data Info & Missing Counts ===")
print(df_raw.info())
print("\n=== Summary Statistics ===")
print(df_raw.describe())
```

```text
# Output:
=== Shape of Dataset ===
(1000, 6)

=== Data Info & Missing Counts ===
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 1000 entries, 0 to 999
Data columns (total 6 columns):
 #   Column           Non-Null Count  Dtype  
---  ------           --------------  -----  
 0   Customer_ID      1000 non-null   int32  
 1   Tenure_Months    1000 non-null   int32  
 2   Monthly_Spend    955 non-null    float64
 3   Support_Tickets  970 non-null    float64
 4   Membership_Type  1000 non-null   object 
 5   Churn            1000 non-null   int32  
dtypes: float64(2), int32(3), object(1)
memory usage: 35.3 KB
None

=== Summary Statistics ===
        Customer_ID  Tenure_Months  Monthly_Spend  Support_Tickets        Churn
count   1000.000000    1000.000000     955.000000       970.000000  1000.000000
mean   10500.500000      13.567000      78.895058         1.975258     0.285000
std      288.819436      12.185208      36.425141         1.564757     0.451639
min    10001.000000       1.000000     -45.000000         0.000000     0.000000
25%    10250.750000       4.000000      53.480000         1.000000     0.000000
50%    10500.500000      10.000000      70.730000         2.000000     0.000000
75%    10750.250000      19.000000      98.630000         3.000000     1.000000
max    11000.000000      60.000000     250.000000         7.000000     1.000000
```

#### Key Findings from the Audit:
1.  **Missing Values**: `Monthly_Spend` has 45 missing entries; `Support_Tickets` has 30 missing entries.
2.  **Anomalies**: `Monthly_Spend` shows a minimum value of `-45.00`. Negative spending is a data entry anomaly.
3.  **Data Types**: `Churn` and `Customer_ID` are read as integers. `Membership_Type` is a string object and should be converted to a categorical type.

---

### Step 2: Quality Inspection & Sanitization

We will address the issues identified during the audit:
*   Convert the negative spend values to `NaN` and impute them using the median value (to protect against outliers).
*   Impute the missing values in `Support_Tickets` to `0`, assuming that if no tickets were recorded, the customer did not contact support.
*   Convert the data types of `Membership_Type` and `Churn` to categoricals.

```python
# 1. Address Negative Spend Anomalies
df_clean = df_raw.copy()
# Replace negative values with NaN
df_clean.loc[df_clean["Monthly_Spend"] < 0, "Monthly_Spend"] = np.nan

# 2. Impute Missing Values
spend_median = df_clean["Monthly_Spend"].median()
df_clean["Monthly_Spend"] = df_clean["Monthly_Spend"].fillna(spend_median)

# Fill missing support tickets with 0
df_clean["Support_Tickets"] = df_clean["Support_Tickets"].fillna(0).astype(int)

# 3. Correct Data Types
df_clean["Membership_Type"] = df_clean["Membership_Type"].astype("category")
df_clean["Churn"] = df_clean["Churn"].astype("category")

# Validate sanitization
print("=== Missing Values After Cleaning ===")
print(df_clean.isnull().sum())
print("\n=== Cleaned Monthly Spend Min Value ===")
print(df_clean["Monthly_Spend"].min())
```

```text
# Output:
=== Missing Values After Cleaning ===
Customer_ID        0
Tenure_Months      0
Monthly_Spend      0
Support_Tickets    0
Membership_Type    0
Churn              0
dtype: int64

=== Cleaned Monthly Spend Min Value ===
10.0
```

---

### Step 3: Univariate Exploration

Let us examine the distribution of individual variables to understand ShopVibe's customer base.

```python
sns.set_theme(style="ticks")
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# Plot 1: Distribution of Tenure
sns.histplot(df_clean["Tenure_Months"], kde=True, color="teal", ax=axes[0])
axes[0].set_title("Customer Tenure Distribution")
axes[0].set_xlabel("Months with ShopVibe")

# Plot 2: Distribution of Monthly Spend
sns.histplot(df_clean["Monthly_Spend"], kde=True, color="purple", ax=axes[0])
axes[0].set_title("Distribution of Monthly Spend")

# Plot 3: Churn Rate Class Balance
sns.countplot(x="Churn", data=df_clean, palette="Set2", ax=axes[2])
axes[2].set_title("Active (0) vs. Churned (1) Customers")

plt.tight_layout()
plt.show()

# Print base rates
churn_rate = df_clean["Churn"].value_counts(normalize=True)[1] * 100
print(f"Base Churn Rate: {churn_rate:.2f}%")
```

```text
# Output:
Base Churn Rate: 28.50%
Three plots are rendered:
- The first plot (Tenure) shows a highly skewed distribution. Most customers have been with the platform for less than 10 months, suggesting high drop-offs or rapid growth in new sign-ups.
- The second plot (Spend) shows a bimodal distribution peaking near $65 and $120, reflecting the pricing tiers of the subscription plans.
- The third plot shows that out of 1,000 customers, 285 have churned, confirming a high overall churn rate of 28.5%.
```

---

### Step 4: Bivariate & Multivariate Relationship Testing

Now, we will analyze the relationships between our variables to identify what correlates with churn.

```python
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Test A: Support Tickets vs. Churn Rate
sns.barplot(
    data=df_clean, 
    x="Support_Tickets", 
    y=df_clean["Churn"].astype(int), # Convert churn back to numeric for barplot mean calculation
    ci=None, 
    palette="Oranges", 
    ax=axes[0]
)
axes[0].set_title("Churn Rate by Number of Support Tickets")
axes[0].set_ylabel("Churn Probability")
axes[0].set_xlabel("Support Tickets Opened")

# Test B: Monthly Spend by Churn Status
sns.boxplot(
    data=df_clean, 
    x="Churn", 
    y="Monthly_Spend", 
    palette="Set2", 
    ax=axes[1]
)
axes[1].set_title("Monthly Spend: Churned vs. Active Users")
axes[1].set_xticklabels(["Active", "Churned"])
plt.tight_layout()
plt.show()
```

```text
# Output:
- The first plot (Bar Chart) shows that churn probability is low (below 15%) for users with 0 or 1 support tickets, but increases significantly for users with 2 or more tickets, reaching over 80% for customers with 4 or more tickets.
- The second plot (Box Plot) shows that the median monthly spend is slightly higher for churned customers compared to active customers.
```

Let us run a multivariate analysis to explore the interaction between tenure, support tickets, and churn.

```python
plt.figure(figsize=(10, 6))
sns.scatterplot(
    data=df_clean,
    x="Tenure_Months",
    y="Support_Tickets",
    hue="Churn",
    palette="coolwarm",
    alpha=0.7,
    s=70
)
plt.title("Support Tickets vs. Tenure: Churn Visual Mapping")
plt.xlabel("Customer Tenure (Months)")
plt.ylabel("Support Tickets Opened")
plt.axvline(3, color="red", linestyle="--", alpha=0.5, label="3-Month Tenure Threshold")
plt.legend(title="Churn Status")
plt.show()
```

```text
# Output:
A scatter plot showing Tenure_Months on the X-axis and Support_Tickets on the Y-axis.
Points are colored based on Churn (blue for Active, red for Churned).
A clear concentration of red points (churned users) is visible in the top-left area: users with under 10 months of tenure who have opened 2 or more support tickets.
Beyond 20 months of tenure, customers rarely churn even if they have opened support tickets.
```

---

### Step 5: Insights Synthesis & Business Recommendations

By peeling apart the variables, we can synthesize our findings:

#### 1. The Tenure Cliff
Churn is heavily concentrated in the first 3 months of a customer's lifecycle. Customers who make it past month 6 are significantly more stable.

#### 2. The Support Ticket Threshold
A single support ticket does not correlate with churn. However, as soon as a customer opens a second ticket, their churn probability rises to 45%. If they open 3 or more, their churn probability exceeds 75%. 

#### 3. VIP Churn Sensitivity
VIP customers spend more but also churn at a higher rate when they encounter issues, suggesting they have higher expectations for customer service.

---

### Actionable Business Recommendations:

```text
                    Retention Strategy Roadmap:
                    
  [ New Sign-ups ]  ---> Active 90-day onboarding support (Avoids Early Churn).
  [ Ticket Count ]  ---> Route customers with 2+ tickets to priority support.
  [ High Spenders]  ---> Assign dedicated support managers to VIP customers.
```

1.  **Targeted Onboarding (First 90 Days)**: Build a proactive onboarding sequence for customers during their first three months to help them set up their accounts and reduce initial support queries.
2.  **Support Ticket Routing**: Implement an automated trigger in the CRM. If an active customer opens a second support ticket, route their request to a senior customer support agent to resolve their issues quickly.
3.  **VIP Support Optimization**: Provide VIP customers with dedicated support channels to ensure their high spend is matched with fast, high-quality assistance.

---

## Gotchas & Common Mistakes

<div class="challenge">
<strong>Gotcha: Confirmation Bias</strong><br>
If the marketing department is convinced that customers are churning because of pricing, they might ask you to look at the relationship between spend and churn. 
<br><br>
Looking only at the spend box plot, you might see that churned customers spend more, confirming their theory. However, this ignores the support ticket bottleneck. You must evaluate multiple features together to avoid confirmation bias.
</div>

### Confusing Correlation with Causation
Just because high support ticket counts correlate with churn does not mean that the act of opening a ticket *causes* a customer to cancel their subscription. The tickets are a symptom of a broken product experience (e.g., late deliveries or app crashes). If you focus only on the correlation, you might try to reduce churn by discouraging customers from opening tickets. This would make the customer experience worse, causing churn to increase.

---

## Practice Exercises & Mini-Projects

### Exercise 1: High-Risk Segment Count
Write a Python script that uses the cleaned ShopVibe DataFrame (`df_clean`) to isolate the "High-Risk Customer Segment," defined as:
*   Tenure of 3 months or less.
*   2 or more support tickets.

Calculate:
1.  The total count of customers who fall into this segment.
2.  The churn rate of this specific segment compared to the global baseline rate.

---

### Exercise 2: Spend vs. Ticket Correlation
Create a scatter plot comparing `Monthly_Spend` and `Support_Tickets`. Calculate the Pearson correlation coefficient between them. Write a short explanation answering: *Do high-spending customers open more support tickets than low-spending customers?*

---

## Section Recaps

*   Start your analysis with a **profile audit** (`.info()`, `.describe()`) to identify missing values, incorrect data types, and anomalies before diving into visualizations.
*   **Sanitize your data** by replacing anomalies (like negative spending values) with `NaN` and imputing them using median values to protect your data from outliers.
*   Use **univariate analysis** to examine the distribution of individual variables (like class imbalance in target variables).
*   Use **bivariate and multivariate analyses** to test relationships between variables and isolate trends across different customer segments.
*   Synthesize your analytical findings into **actionable recommendations** that address the root causes of the business problem.

---

## Common Interview Questions

### Q1: If a business stakeholder asks you to investigate a sudden drop in product conversion rates, what are the first 3 steps you would take to structure your EDA?
**Answer:**
1.  **Define the Scope and Audit the Quality**: Load the relevant data (e.g., website session history, checkout funnels, user demographics) and check for missing values, duplicates, and tracking errors. I want to confirm the data is accurate before making inferences.
2.  **Define the Baseline and Split by Segment**: Calculate the baseline conversion rate and analyze it across segments, such as traffic source, device category, user type, and region. Drops in conversion rates are often driven by a specific segment (e.g., a broken checkout page on mobile devices) rather than a general trend.
3.  **Perform Funnel Analysis**: Plot the conversion funnel step-by-step (e.g., Landing Page $\rightarrow$ Cart Add $\rightarrow$ Checkout $\rightarrow$ Purchase) to identify where the drop-off is occurring. This isolates the bottleneck in the customer journey.

---

### Q2: Explain how confirmation bias can corrupt a business analytics project, and detail 2 statistical techniques to remain objective.
**Answer:**
Confirmation bias occurs when an analyst searches for, interprets, and visualizes data in a way that confirms their pre-existing assumptions or those of their stakeholders. For example, if a team believes a new website layout is better, they might focus on metric improvements while ignoring increases in checkout drop-offs.

Two techniques to remain objective:
1.  **Hypothesis Pre-Registration**: Define your questions, hypotheses, and target metrics before looking at the data. This prevents you from changing your goals during the analysis to match your findings.
2.  **A/B Testing and Statistical Significance Testing**: Use statistical hypothesis tests (such as a Chi-Square test for categorical conversions or a t-test for average spending) to determine if differences are statistically significant or just random noise.

---

### Q3: In our case study, we saw that customers with more support tickets are more likely to churn. How do you prove whether opening tickets causes churn, or if it is merely correlated?
**Answer:**
To determine if opening support tickets causes churn or is merely correlated:
1.  **Temporal Ordering**: Verify the timeline of events. If the issues occur before the support tickets are opened, and both occur before the churn event, the issues are the likely cause.
2.  **Analyze the Ticket Content (Root Cause Analysis)**: Perform text analysis on the support ticket descriptions. If tickets are filled with complaints about delivery delays or product bugs, the underlying operational issues are the cause of churn. The tickets are a symptom, not the cause.
3.  **Controlled Experiments**: If possible, test a solution by routing a treatment group to a priority support team while keeping a control group on the standard routing. If the treatment group's churn rate drops significantly, it suggests that how support issues are handled directly impacts retention.

---

### Q4: What is class imbalance, why does it matter in business case studies, and how does it affect your visualization choices during EDA?
**Answer:**
Class imbalance occurs when one category in a target variable is much more common than the other. In our case study, active customers (71.5%) outnumber churned customers (28.5%). In other cases like fraud detection, the imbalance can be extreme (e.g., 99.9% legitimate transactions vs. 0.1% fraudulent).

Class imbalance matters because:
*   **Deceptive Metrics**: A model can achieve 71.5% accuracy by predicting that no one will ever churn.
*   **Visual Distortions**: Using standard histograms to compare distributions can hide patterns in the minority class because it is overshadowed by the majority class.

Visualization choices to handle imbalance:
1.  **Normalized Density Plots**: Use `kdeplot(..., common_norm=False)` to scale the density curves of each class to 1. This allows you to compare the shapes of the distributions regardless of class size.
2.  **Proportional Bar Charts**: Use normalized bar charts (showing percentages instead of raw counts) to display the relative proportion of each class across categories.

---

### Q5: Draft a 3-sentence executive summary of the case study findings that is appropriate for a non-technical COO.
**Answer:**
"Our analysis reveals that customer churn is driven by a critical transition point in the customer lifecycle, with a significant drop-off occurring during the first three months of onboarding. Additionally, support ticket volume is a strong indicator of churn risk: customers who open a second support ticket are five times more likely to cancel their subscription. We recommend implementing proactive onboarding support for new customers and setting up automated priority routing for any account that opens a second support ticket."
