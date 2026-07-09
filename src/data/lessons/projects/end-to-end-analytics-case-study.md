---
title: "End-to-End Analytics Case Study — Corporate Churn Project"
description: "A complete, portfolio-ready business analytics case study. Ingest raw tables, clean logs, model variables, and compile presentation decks."
category: "projects"
order: 6
phase: 6
tags: ["projects", "case-study", "portfolio", "data-storytelling"]
publishedDate: 2025-04-25
prevSlug: "survey-data-analysis"
nextSlug: ""
seoTitle: "End-to-End Data Analytics Case Study Project | Datalogify"
seoDescription: "A complete portfolio case study. Solve a corporate churn problem, clean logs, model variables, and outline slide deck structures."
---

## Why This Matters

A great data analyst does more than just write clean code; they present their findings in a way that drives action. By working through this end-to-end case study, you will practice the complete analytics lifecycle—from cleaning messy files to structuring a presentation deck that turns complex numbers into clear recommendations for company leaders.

---

## The Corporate Detective Analogy

Imagine you are a detective called in to investigate a crime scene. A large company has been losing money (customer churn), and the culprit is still at large.

```text
       [ The Crime Scene ]            [ The Investigation ]            [ The Trial ]
       
       +-----------------+            +--------------------+         +-------------------+
       | Messy Files     |   ----->   | Data Cleansing     |  ---->  | Slide Deck        |
       | Orphan Records  |            | Feature Modeling   |         | Executive Action  |
       +-----------------+            +--------------------+         +-------------------+
```

You do not solve the case by collecting every fingerprint, piece of dust, and hair strand and dumping them on the judge's desk in a giant cardboard box. If you do that, the judge will throw the case out.

Instead, you must clean the clues, connect the evidence, and present a clear, compelling story that points to the culprit and explains exactly how the crime occurred.

In data analytics, your stakeholders are the judges. They do not want to see your raw code or unorganized pivot tables. They need you to act as a detective: analyze the data, identify the root causes of the problem, and present a structured case with clear, actionable recommendations.

---

## Step 1: Scenario Setup & Raw Data Audit

Our client, **ShopVibe VIP**, is a premium e-commerce subscription service. Over the past year, the company has seen an unexpected increase in customer churn. The executive board wants to understand why subscribers are leaving and has provided three raw data files:

1.  `customer_demographics.csv`: Contains subscriber profiles, signup dates, and account tiers.
2.  `payment_history.csv`: Logs monthly invoice values, payment status, and payment methods.
3.  `web_engagement.csv`: Tracks user activity, including days since their last login and page views.

Let's audit these tables to identify potential issues like orphan records, missing keys, and duplicate transactions.

```python
import pandas as pd
import numpy as np

# Demographics Table
demo_data = {
    "customer_id": [101, 102, 103, 104, 105],
    "signup_date": ["2023-01-15", "2023-02-10", "2023-03-01", "2023-03-12", "2023-04-01"],
    "tier": ["VIP", "Standard", "VIP", "Standard", "VIP"]
}
df_demo = pd.DataFrame(demo_data)

# Payment Table (Contains a duplicate invoice and an orphan ID 999)
payment_data = {
    "customer_id": [101, 102, 103, 999, 101],
    "amount_paid": [49.99, 19.99, 49.99, 19.99, 49.99],
    "payment_status": ["Cleared", "Cleared", "Failed", "Cleared", "Cleared"]
}
df_payments = pd.DataFrame(payment_data)

# Engagement Table
engagement_data = {
    "customer_id": [101, 102, 103, 104, 105],
    "days_since_login": [2, 45, 12, 60, 3]
}
df_engagement = pd.DataFrame(engagement_data)

# Find Orphan Records (Payments for customers not in the demographics table)
orphans = df_payments[~df_payments["customer_id"].isin(df_demo["customer_id"])]
print("--- Orphan Payment Records Found ---")
print(orphans)
```

```text
# Output:
--- Orphan Payment Records Found ---
   customer_id  amount_paid payment_status
3          999        19.99        Cleared
```

We identified an orphan record (`customer_id: 999`) in our payment log. This indicates a data mismatch between our tables, meaning we must use an inner join or clean our payment logs before running our final analysis.

---

## Step 2: Data Ingestion & SQL Joining

Let's write a SQL query using Common Table Expressions (CTEs) to join these tables, filter out orphan records, and calculate key performance indicators (KPIs) for each customer.

```sql
-- Consolidate customer demographics, payments, and engagement logs
WITH cleaned_payments AS (
    SELECT 
        customer_id,
        SUM(amount_paid) AS total_revenue,
        -- Count failed payments
        SUM(CASE WHEN payment_status = 'Failed' THEN 1 ELSE 0 END) AS failed_payment_count
    FROM payment_history
    -- Exclude orphan ID 999
    WHERE customer_id != 999
    GROUP BY customer_id
)
SELECT 
    d.customer_id,
    d.signup_date,
    d.tier,
    COALESCE(p.total_revenue, 0) AS total_revenue,
    COALESCE(p.failed_payment_count, 0) AS failed_payments,
    e.days_since_login,
    -- Determine churn risk based on activity
    CASE 
        WHEN e.days_since_login > 30 THEN 1 
        ELSE 0 
    END AS churned
FROM customer_demographics d
LEFT JOIN cleaned_payments p 
    ON d.customer_id = p.customer_id
LEFT JOIN web_engagement e 
    ON d.customer_id = e.customer_id;
```

---

## Step 3: Data Cleaning & Exploratory Transformations

Now that our SQL query has structured the data, we load the results into Python to handle outliers and transform highly skewed variables.

```python
import pandas as pd
import numpy as np

# Load our consolidated SQL output
consolidated_data = {
    "customer_id": [101, 102, 103, 104, 105],
    "total_revenue": [599.88, 239.88, 49.99, 0.00, 1200.00],
    "failed_payments": [0, 1, 3, 0, 0],
    "days_since_login": [2, 45, 12, 60, 3],
    "churned": [0, 1, 0, 1, 0]
}
df_model = pd.DataFrame(consolidated_data)

# Log-transform highly skewed variables (like revenue) to reduce the effect of outliers
df_model["log_revenue"] = np.log1p(df_model["total_revenue"])

# Calculate a relative risk metric: ratio of failed payments to activity
df_model["payment_risk_ratio"] = df_model["failed_payments"] / (df_model["days_since_login"] + 1)

print("--- Cleaned and Transformed Dataset ---")
print(df_model[["customer_id", "total_revenue", "log_revenue", "payment_risk_ratio", "churned"]])
```

```text
# Output:
--- Cleaned and Transformed Dataset ---
  customer_id  total_revenue  log_revenue  payment_risk_ratio  churned
0          101         599.88     6.398395            0.000000        0
1          102         239.88     5.484299            0.021739        1
2          103          49.99     3.931629            0.230769        0
3          104           0.00     0.000000            0.000000        1
4          105        1200.00     7.090910            0.000000        0
```

---

## Step 4: Data Storytelling & Presentation Deck Outline

To present these findings to ShopVibe's board, we will structure our insights into a 6-slide presentation deck. This structure focuses on clarity and actionable business recommendations.

```text
  +-------------------------------------------------------------------------+
  |                        SLIDE DECK STRUCTURE                             |
  +-------------------------------------------------------------------------+
  |  [ Slide 1 ] Executive Summary (The Bottom Line)                        |
  |  [ Slide 2 ] The Problem (Our Retention Cliff)                           |
  |  [ Slide 3 ] Root Cause Analysis (Payment Failures & Inactivity)        |
  |  [ Slide 4 ] High-Risk Segments (Where the Leaks Are)                   |
  |  [ Slide 5 ] Financial Impact (The Cost of Churn)                       |
  |  [ Slide 6 ] Action Plan (Next Steps for Retention)                     |
  +-------------------------------------------------------------------------+
```

### Slide 1: Executive Summary
*   **Header**: ShopVibe Retention Action Plan
*   **Visual Layout**: Three key metric callouts:
    *   **Churn Rate**: Up **14%** year-over-year.
    *   **Lost Revenue**: **$48,000** last quarter.
    *   **Key Driver**: **72%** of churned customers had a failed payment or went inactive for $> 30$ days.
*   **Talking Points**: "Our retention rate has dropped over the past year. This presentation outlines the key drivers of this trend and proposes three targeted interventions to recover $48,000 in monthly revenue."

### Slide 2: The Problem (The Retention Cliff)
*   **Header**: Customer Retention Decline
*   **Visual Layout**: A line chart showing retention rates by customer tenure.
*   **Key Takeaway**: A sharp drop in retention occurs at **Month 3**, where retention falls from **92%** to **64%**.
*   **Talking Points**: "Our retention drops sharply at Month 3, which aligns with the end of our promotional pricing. We need to focus our engagement efforts on this critical window."

### Slide 3: Root Cause Analysis
*   **Header**: Drivers of Customer Churn
*   **Visual Layout**: A scatter plot comparing billing failures against days since last login.
*   **Key Takeaway**: Customers who experience billing failures and go inactive for more than 15 days have an **80%** churn rate.
*   **Talking Points**: "Our analysis shows that billing failures and low app activity are the strongest predictors of churn. When these issues occur together, customers are highly likely to leave."

### Slide 4: High-Risk Segments
*   **Header**: Segmenting Churn Risk
*   **Visual Layout**: A horizontal bar chart showing churn rates by subscription tier and payment method.
*   **Key Takeaway**: Standard tier customers paying via manual check have a **58%** churn rate, while VIP auto-pay customers remain highly stable.
*   **Talking Points**: "Our highest-risk customers are Standard tier subscribers paying via manual check. Encouraging auto-pay signups is a clear opportunity to improve retention."

### Slide 5: The Financial Impact
*   **Header**: The Cost of Inaction
*   **Visual Layout**: A waterfall chart showing current losses and the potential revenue recovery from our proposed retention programs.
*   **Key Takeaway**: Recovering just 15% of our high-risk subscribers would save **$7,200** monthly.
*   **Talking Points**: "If we do not address these retention issues, we stand to lose $48,000 next quarter. Implementing a targeted recovery campaign will help us protect this revenue."

### Slide 6: Action Plan & Next Steps
*   **Header**: Actionable Retention Strategies
*   **Visual Layout**: Three columns with clear owners and timelines:
    *   **Auto-Pay Campaign**: Transition manual payers to auto-pay (Marketing / Month 1).
    *   **Billing Recovery**: Implement automated email alerts for failed payments (Billing / Month 1).
    *   **Engagement Triggers**: Set up automated email reminders for inactive users (Product / Month 2).
*   **Talking Points**: "We recommend implementing three targeted programs: transitioning users to auto-pay, setting up automated alerts for failed payments, and building automated email triggers for inactive accounts. We will launch these initiatives over the next two months."

---

## Gotchas & Edge Cases

When compiling an end-to-end business case study, watch out for these common presentation and data traps:

### 1. Data Leakage
Data leakage occurs when you use information from the future to build features for your model. For example, if you include `total_lifetime_transactions` as a feature to predict whether a customer will churn in Month 3, your model will look highly accurate because customers who stayed longer naturally made more transactions.
*   **Fix**: Always partition your data and calculate features based only on the history available *before* the prediction window opens.

### 2. Over-Complicating the Slides
Presenting raw regression formulas, p-values, or crowded data tables to business leaders can lead to confusion. If the board does not understand your slides, they are unlikely to approve your recommendations.
*   **Fix**: Focus on the business impact. Use simple, clean charts, highlight the key metric, and keep technical details in the appendix for reference.

---

## Practice Exercises

<div class="challenge">
<h3>Exercise 1: Feature Importance Analysis</h3>
<p><strong>Scenario:</strong> You need to identify which customer behaviors correlate most strongly with churn.</p>
<p><strong>Your Task:</strong> Write a Python script that calculates the correlation of features (such as <code>total_revenue</code>, <code>failed_payments</code>, and <code>days_since_login</code>) with the <code>churned</code> target, and sort the features from highest correlation to lowest.</p>
</div>

<div class="challenge">
<h3>Exercise 2: Presentation Pitch Script</h3>
<p><strong>Scenario:</strong> You are presenting your churn findings to the CEO, but your meeting has been cut from 20 minutes to 2 minutes.</p>
<p><strong>Your Task:</strong> Write a 150-word elevator pitch that summarizes the core problem, the main driver, the financial impact, and your recommended action plan. Focus only on the most critical details.</p>
</div>

---

## Section Recaps

*   **Audit Data Connections**: Always check for orphan records and duplicates when combining demographics, payments, and engagement logs.
*   **Structure Your Analysis**: Clean and prepare your data by standardizing timestamps, removing failed records, and handling outliers before modeling.
*   **Focus on Business Impact**: Translate complex statistical models into clear trends, risk tiers, and financial projections.
*   **Keep Slides Actionable**: Structure your executive presentations to outline the problem, explain the root causes, show the financial impact, and propose clear next steps.

---

## Common Interview Questions

### Q1: How do you handle missing values in key demographic fields when preparing a dataset for an executive presentation?
**Answer:** I start by analyzing the mechanism behind the missing data (e.g., whether it is missing at random). For demographic fields like Age, I typically impute missing values using the median of the cohort to prevent outliers from skewing the results. For categorical fields like Region or Gender, I fill missing entries with an "Unknown" or "Prefer Not to Say" category to keep the sample size consistent without making assumptions. I also document these imputation steps in the appendix so the methodology is clear.

### Q2: What is the risk of using a simple correlation analysis to identify the drivers of customer churn?
**Answer:** Correlation measures linear relationships, but churn is often driven by non-linear factors or combinations of events. For example, a customer with high monthly charges might be stable, but if they also experience a billing failure, their churn risk spikes. A simple correlation analysis might miss these interactions. To capture them, I segment the data into specific risk cohorts and use decision trees or feature importance analyses to identify how variables interact to drive churn.

### Q3: How do you explain the difference between statistical significance and practical significance to a business leader?
**Answer:** Statistical significance tells us if a result is unlikely to have occurred by random chance (e.g., a p-value $< 0.05$). Practical significance tells us if that result actually matters to the business. For example, a website change might increase conversions by 0.01%, which is statistically significant due to a large sample size, but generates only $10 in additional monthly revenue. In this case, the change has statistical significance but lacks practical significance, as the cost to implement it outweighs the return.

### Q4: When joining transactional payment logs to customer profiles, how do you handle duplicate records without losing revenue information?
**Answer:** I handle duplicates by aggregating the transactional logs before joining them to the customer profile. Instead of joining raw, duplicate invoice rows directly to a customer record—which would inflate the customer count—I write a query to group payments by customer ID, sum the revenue, count the transactions, and then join this single, aggregated summary row to the demographic table.

### Q5: How do you structure an executive deck to ensure your data insights lead to actual business decisions?
**Answer:** I structure the presentation to tell a clear story using the SCIP framework:
1.  **Situation (S)**: State the current state of the business (e.g., "Retention has dropped 14% this year").
2.  **Complication (C)**: Highlight the risk of inaction (e.g., "This represents a $48,000 monthly revenue leak").
3.  **Insight (I)**: Explain the root cause discovered in the data (e.g., "Month 3 billing failures are the primary driver").
4.  **Proposal (P)**: Detail the action plan, timeline, and expected ROI of our recommendations.
This keeps the presentation focused on what the numbers mean and what decisions need to be made.
