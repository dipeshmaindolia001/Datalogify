---
title: "Customer Churn Analysis — Subscriber Risk Profiling"
description: "Analyze subscriber usage, payment logs, and ticket data to identify why customers churn. Write SQL queries and Pandas profiling scripts."
category: "projects"
order: 2
phase: 6
tags: ["projects", "churn-analysis", "sql", "pandas"]
publishedDate: 2025-04-21
prevSlug: "sales-dashboard-analysis"
nextSlug: "marketing-campaign-analysis"
seoTitle: "Customer Churn Analysis Portfolio Project | Datalogify"
seoDescription: "Build a customer churn analysis portfolio project. Clean subscriber logs with SQL and Pandas, profile churn risk, and define key indicators."
---

## Why This Matters

Acquiring a new customer is up to five times more expensive than retaining an existing one. By building a customer churn analysis project, you show organizations how to identify early warning signs of customer departure, enabling targeted customer success interventions that save revenue before it walks out the door.

---

## The Leaky Bucket Analogy

Imagine running a subscription business is like trying to keep a wooden water bucket full. Water pours in from the top (customer acquisition/marketing), but there are holes in the bottom of the bucket where water drips out (customer churn). 

```text
               [ Customer Inflow (Marketing) ]
                     |       |
                     v       v
               +------------------+
               |                  |
               |   TELCOFLOW      |
               |   SUBSCRIBERS    |
               |                  |
               +------------------+
                 /      |       \
                v       v        v
             [ Hole 1 ] [ Hole 2 ] [ Hole 3 ]
             High Price  Bad Link   Support Issues
```

If you only focus on acquisition, you will spend your entire budget refilling a leaky bucket. To build a sustainable, profitable business, you must patch the holes. But to patch the holes, you must first answer:
*   *Where are the holes located?* (Which customer segments are churning?)
*   *Why is water leaking there?* (What experiences drive churn?)
*   *How big are the cracks?* (How much monthly revenue is lost?)

In this Datalogify project, we will analyze **TelcoFlow**, a telecommunications provider. We will integrate relational database tables, run cohort-based SQL joins, profile subscriber data with Python Pandas, and design a churn warning system.

---

## Step 1: SQL Cohort Querying

Our data resides in a relational database containing three core tables:
1.  `subscriptions`: Details account start dates, contract types, monthly fees, and payment channels.
2.  `usage_logs`: Tracks daily data download volume (GBs used) and voice call minutes.
3.  `support_tickets`: Logs issues raised, categories (billing, network speed, hardware), and days taken to resolve them.

### Database Schema Definition

```text
  subscriptions                  usage_logs                    support_tickets
  +------------------+           +------------------+          +------------------+
  | PK  customer_id  | <---+     | PK  log_id       |          | PK  ticket_id    |
  |     signup_date  |     +---  | FK  customer_id  |     +--->| FK  customer_id  |
  |     contract_type|           |     gb_used      |     |    |     category     |
  |     monthly_charges          |     call_minutes |     |    |     days_to_solve|
  |     payment_method           +------------------+     |    +------------------+
  |     churn_status |                                    |
  +------------------+------------------------------------+
```

Let's write a SQL query to consolidate these tables. The query will:
*   Calculate the lifetime tenure in months.
*   Sum total data usage (`gb_used`).
*   Count the total customer support tickets opened.
*   Calculate the average resolution time for those tickets.

```sql
-- Consolidate subscriber demographics, usage summaries, and support ticket history
SELECT 
    s.customer_id,
    s.contract_type,
    s.payment_method,
    s.monthly_charges,
    -- Calculate customer lifetime tenure in months as of a fixed report date (2024-12-31)
    DATEDIFF('month', CAST(s.signup_date AS DATE), CAST('2024-12-31' AS DATE)) AS tenure_months,
    -- Aggregate total usage logs
    COALESCE(SUM(u.gb_used), 0) AS total_gb_used,
    COALESCE(SUM(u.call_minutes), 0) AS total_call_mins,
    -- Aggregate ticket counts and average handling time
    COUNT(DISTINCT t.ticket_id) AS total_support_tickets,
    ROUND(COALESCE(AVG(t.days_to_solve), 0), 1) AS avg_ticket_solve_days,
    -- Binary indicator target
    s.churn_status
FROM subscriptions s
LEFT JOIN usage_logs u 
    ON s.customer_id = u.customer_id
LEFT JOIN support_tickets t 
    ON s.customer_id = t.customer_id
GROUP BY 
    s.customer_id,
    s.contract_type,
    s.payment_method,
    s.monthly_charges,
    s.signup_date,
    s.churn_status;
```

---

## Step 2: Python DataFrame Profiling & Correlation

Now that our SQL database query has structured the data, we load this aggregated view into Python. We will calculate the statistical correlations between our variables and identify which features correlate most strongly with customer churn.

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Generate a synthetic sample dataset of TelcoFlow subscribers
np.random.seed(101)
n_subscribers = 500

tenure = np.random.randint(1, 48, size=n_subscribers)
contract = np.random.choice(["Month-to-month", "One year", "Two year"], size=n_subscribers, p=[0.5, 0.3, 0.2])
payment = np.random.choice(["Electronic check", "Mailed check", "Credit card", "Bank transfer"], size=n_subscribers)
charges = np.random.uniform(20.0, 110.0, size=n_subscribers)

# Churn logic depends on charges, contract, and support history
tickets = np.random.poisson(lam=1.2, size=n_subscribers)
# Month-to-month contracts with high tickets are likely to churn
tickets = np.where(contract == "Month-to-month", tickets + np.random.choice([0, 1, 2], p=[0.4, 0.4, 0.2]), tickets)

# Target Churn generation
churn_prob = 0.05 + (charges * 0.003) + (tickets * 0.15) - (tenure * 0.01)
churn_prob = np.where(contract == "Month-to-month", churn_prob + 0.2, churn_prob)
churn_prob = np.clip(churn_prob, 0.0, 1.0)
churn = np.random.binomial(n=1, p=churn_prob)

# Create DataFrame
df_subscribers = pd.DataFrame({
    "customer_id": [f"TF-{i:05d}" for i in range(1, n_subscribers + 1)],
    "contract_type": contract,
    "payment_method": payment,
    "monthly_charges": charges.round(2),
    "tenure_months": tenure,
    "total_support_tickets": tickets,
    "churn": churn
})

# Calculate correlation matrix for numeric features
numeric_cols = ["monthly_charges", "tenure_months", "total_support_tickets", "churn"]
correlation_matrix = df_subscribers[numeric_cols].corr()

print("--- Correlation Matrix with Churn Target ---")
print(correlation_matrix["churn"].sort_values(ascending=False))
```

```text
# Output:
--- Correlation Matrix with Churn Target ---
churn                    1.000000
total_support_tickets    0.509893
monthly_charges          0.198305
tenure_months           -0.344445
Name: churn, dtype: float64
```

### Analysis of the Correlation Matrix:
*   **Total Support Tickets (`0.51`)**: Strong positive correlation. As the number of support tickets increases, the likelihood of customer churn increases significantly.
*   **Tenure Months (`-0.34`)**: Moderate negative correlation. Long-term subscribers (higher tenure) are less likely to churn, indicating high early-stage risk.
*   **Monthly Charges (`0.20`)**: Soft positive correlation. Higher monthly fees moderately increase the likelihood of churn, suggesting price sensitivity.

---

## Step 3: Segment Analysis

Let's drill down into specific cohorts. We will compare active profiles against churned profiles across categorical dimensions: Contract Type and Payment Method.

```python
# 1. Compare Contract Type Churn Rates
contract_summary = df_subscribers.groupby("contract_type").agg(
    total_customers=("customer_id", "count"),
    churn_count=("churn", "sum"),
    churn_rate=("churn", "mean")
).reset_index()

contract_summary["churn_rate"] = (contract_summary["churn_rate"] * 100).round(2)
print("--- Churn Analysis by Contract Type ---")
print(contract_summary)

# 2. Compare Payment Method Churn Rates
payment_summary = df_subscribers.groupby("payment_method").agg(
    total_customers=("customer_id", "count"),
    churn_count=("churn", "sum"),
    churn_rate=("churn", "mean")
).reset_index()

payment_summary["churn_rate"] = (payment_summary["churn_rate"] * 100).round(2)
print("\n--- Churn Analysis by Payment Method ---")
print(payment_summary)
```

```text
# Output:
--- Churn Analysis by Contract Type ---
    contract_type  total_customers  churn_count  churn_rate
0  Month-to-month              234          146       62.39
1        One year              166           37       22.29
2        Two year              100            7        7.00

--- Churn Analysis by Payment Method ---
     payment_method  total_customers  churn_count  churn_rate
0     Bank transfer              131           43       32.82
1       Credit card              109           30       27.52
2  Electronic check              136           69       50.74
3      Mailed check              124           48       38.71
```

### Segment Takeaways:
1.  **Month-to-month contracts are highly unstable**: The churn rate stands at a staggering **62.39%**, compared to just **7.0%** for customers committed to two-year terms. Month-to-month contracts are the largest leak in our bucket.
2.  **Electronic checks correlate with high churn**: Subscribers paying via Electronic Check churn at **50.74%**, while credit card auto-pay subscribers churn at **27.52%**. Electronic check failures and manual monthly payments create recurring opportunities for customers to reconsider their subscription.

---

## Step 4: Building a Subscriber Risk Profiling Ruleset

Using our data insights, we can construct a **churn risk scoring system**. We will flag accounts that meet high-risk criteria so our retention teams can proactively address their issues.

### Risk Tier Definitions:
*   **Red Alert (High Risk)**: Customer on a Month-to-Month contract with $\ge 3$ support tickets OR tenure $< 6$ months and monthly charges $> \$80$.
*   **Amber Alert (Medium Risk)**: Customer on a Month-to-Month contract with $1$-$2$ support tickets, OR a One-Year contract with $\ge 2$ support tickets.
*   **Green Alert (Low Risk)**: All other subscribers.

Let's write a Python function to assign risk profiles and verify the churn rate within those assigned risk tiers.

```python
def assign_risk_tier(row):
    # Rule 1: High Risk Criteria
    if (row["contract_type"] == "Month-to-month" and row["total_support_tickets"] >= 3) or \
       (row["tenure_months"] < 6 and row["monthly_charges"] > 80.00):
        return "High (Red)"
    
    # Rule 2: Medium Risk Criteria
    elif (row["contract_type"] == "Month-to-month" and row["total_support_tickets"] in [1, 2]) or \
         (row["contract_type"] == "One year" and row["total_support_tickets"] >= 2):
        return "Medium (Amber)"
    
    # Default Rule
    else:
        return "Low (Green)"

# Apply ruleset
df_subscribers["risk_profile"] = df_subscribers.apply(assign_risk_tier, axis=1)

# Validate the accuracy of our risk profiling model
risk_validation = df_subscribers.groupby("risk_profile").agg(
    subscribers=("customer_id", "count"),
    actual_churns=("churn", "sum"),
    actual_churn_rate=("churn", "mean")
).reset_index()

risk_validation["actual_churn_rate"] = (risk_validation["actual_churn_rate"] * 100).round(2)
print("--- Churn Risk Profiling Model Validation ---")
print(risk_validation)
```

```text
# Output:
--- Churn Risk Profiling Model Validation ---
     risk_profile  subscribers  actual_churns  actual_churn_rate
0      High (Red)          126            105              83.33
1     Low (Green)          185             14               7.57
2  Medium (Amber)          189             71              37.57
```

Our simple heuristic model works exceptionally well:
*   The **High Risk (Red)** cohort represents subscribers with an actual churn rate of **83.33%**.
*   The **Low Risk (Green)** cohort represents a stable base with a churn rate of only **7.57%**.

---

## Gotchas & Edge Cases

When profiling subscription churn, pay close attention to these data and methodology traps:

### 1. Survivorship Bias
If you only analyze active subscribers to determine what features lead to longevity, you ignore customers who churned early in the lifecycle. 
*   **Fix**: Always structure your training records to include historical profiles of lost customers frozen at their time of cancellation.

### 2. Class Imbalance
In healthy subscription businesses, the churn rate is typically low (e.g., 2% to 5% per month). If you train a predictive model on a dataset where 95% of the customers are active, a naive model that predicts "Nobody will churn" will be 95% accurate but useless.
*   **Fix**: Evaluate your analysis using **Precision, Recall, and F1-Scores** rather than raw accuracy. Use down-sampling or over-sampling (SMOTE) to balance your target distribution.

---

## Practice Exercises

<div class="challenge">
<h3>Exercise 1: SQL Monthly Retention Cohort Table</h3>
<p><strong>Scenario:</strong> You need to calculate retention rate cohorts by signup month.</p>
<p><strong>Your Task:</strong> Write a SQL query that groups customers by their signup year-month (e.g., <code>2024-01</code>) and calculates the percentage of customers who are still active (<code>churn_status = 0</code>) at 3, 6, and 12 months post-signup. Use a combination of CTEs or subqueries to structure the output table.</p>
</div>

<div class="challenge">
<h3>Exercise 2: Class Imbalance Evaluation</h3>
<p><strong>Scenario:</strong> A colleague runs a churn prediction model and boasts an accuracy rating of 94% on a dataset containing 10,000 customers, where only 600 churned.</p>
<p><strong>Your Task:</strong> Calculate the precision and recall of a default baseline model that classifies every single customer as "Not Churned". Write a Python calculation snippet to show how a 94% accurate model can have a 0% recall rate for churners.</p>
</div>

---

## Section Recaps

*   **Leaky Bucket Principle**: Focus retention efforts on high-risk segments to keep acquisition costs from going to waste.
*   **Key Churn Indicators**: Support ticket count, payment type (manual vs automatic), and contract length (month-to-month vs annual) are key drivers of churn.
*   **Decoupled SQL Pipelines**: Use CTEs and aggregates to process logs before loading data into Python to avoid performance bottlenecks.
*   **Evaluate Correctly**: Rely on metrics like Recall and F1-score rather than raw accuracy to measure prediction success.

---

## Common Interview Questions

### Q1: What is the difference between voluntary and involuntary churn, and how do you distinguish them in your data?
**Answer:** Voluntary churn occurs when a customer actively decides to cancel their subscription (e.g., clicking "Cancel," or calling support to close their account). Involuntary churn occurs when a customer's subscription is terminated due to payment failures, expired credit cards, or system billing errors. In the database, we distinguish them by analyzing payment transaction logs. If an account is closed immediately after 3 failed credit card charges, it is flagged as involuntary. If it is closed after a cancellation request with zero billing failures, it is flagged as voluntary.

### Q2: Why is the correlation coefficient between monthly charges and churn sometimes deceptively low?
**Answer:** Correlation measures linear relationships. However, price sensitivity is often non-linear. Customers may be comfortable paying up to a certain price threshold (e.g., $80), but once pricing exceeds that limit, churn probability spikes exponentially. A simple linear correlation coefficient might miss this step-change behavior, requiring you to bucket monthly charges into categorical bins to reveal the true risk trend.

### Q3: If a company has a low churn rate but a high revenue churn rate, what does that tell you about the business?
**Answer:** A low customer churn rate coupled with high revenue churn indicates that the company is retaining its low-value, low-paying customers while losing its highest-paying enterprise or VIP accounts. This is a critical risk, as it means a small number of cancellations can significantly impact overall revenue, even if the overall customer count looks stable.

### Q4: How would you determine the optimal time to send a retention offer to a subscriber?
**Answer:** I would analyze the **Tenure Hazard Rate** using survival analysis. By plotting the probability of a customer churning at specific tenure intervals, we can identify peak churn windows. For example, if a major churn spike occurs at month 3 (when promotional rates end), the optimal time to send a retention offer or target them with a customer success campaign is between days 75 and 80, just before that risk window opens.

### Q5: How do support ticket resolution times impact churn, and how do you calculate this threshold?
**Answer:** Slow ticket resolution increases customer frustration and directly drives voluntary churn. To calculate the threshold where resolution delay becomes a risk factor, we group historical tickets by duration deciles (e.g., 0-1 days, 1-2 days, etc.) and calculate the churn rate for each group. We then identify the point where the churn rate starts to rise significantly—for example, when resolution time exceeds 3 days—which becomes our operational threshold for the support team.
