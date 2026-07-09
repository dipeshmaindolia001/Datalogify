---
title: "Marketing Campaign Analysis — ROI & A/B Experimentation"
description: "Verify marketing campaign ROI and analyze campaign variations using statistical A/B testing. Evaluate conversion rates, ad spend, and cost per acquisition."
category: "projects"
order: 3
phase: 6
tags: ["projects", "marketing-analytics", "ab-testing", "roi"]
publishedDate: 2025-04-22
prevSlug: "customer-churn-analysis"
nextSlug: "financial-data-analysis"
seoTitle: "Marketing Campaign A/B Testing Project | Datalogify"
seoDescription: "Analyze marketing campaign variation ROI. Calculate conversion rates, ad spend margins, and run statistical A/B tests using scipy."
---

## Why This Matters

Marketing analytics ensures that every dollar spent on advertising drives real revenue rather than vanishing into internet white noise. By mastering marketing ROI calculations and statistical A/B testing, you can guide companies to cut low-performing campaigns, double down on validated winners, and prove the financial impact of their marketing spend.

---

## The Gold Prospector's Sieve Analogy

Imagine you are a gold prospector during the Gold Rush. You are working two different rivers: River A (Campaign A) and River B (Campaign B). 

To find gold, you scoop dirt into a sieve, shake it in the water, and count the gold flakes that remain. 

```text
       [ River A / Campaign A ]                 [ River B / Campaign B ]
       Scoops: 10,000                           Scoops: 10,000
       Flakes found: 150                        Flakes found: 175
       Observed Yield: 1.50%                    Observed Yield: 1.75%
       
       Is River B actually richer in gold, or did you just get lucky with those scoops?
```

At first glance, River B seems to yield more gold (1.75% vs. 1.50%). But before you pack up your entire operation and spend your life savings moving your equipment to River B, you must ask: *Is this difference statistically significant, or is it just random noise?* Did you happen to scoop from a lucky patch of dirt, or is River B consistently richer?

In digital marketing, we face this exact problem. If Campaign B converts at 1.75% and Campaign A converts at 1.50%, you cannot make a major budget decision based on raw numbers alone. You need statistical testing to prove that the performance difference is real and repeatable.

---

## Step 1: Marketing Metric Aggregation

To evaluate marketing performance, we use five core metrics:

1.  **Click-Through Rate (CTR)**: The percentage of ad impressions that resulted in clicks.
    $$\text{CTR} = \left( \frac{\text{Clicks}}{\text{Impressions}} \right) \times 100$$
2.  **Cost Per Click (CPC)**: The average cost of each ad click.
    $$\text{CPC} = \frac{\text{Ad Spend}}{\text{Clicks}}$$
3.  **Conversion Rate (CR)**: The percentage of clicks that resulted in a purchase.
    $$\text{CR} = \left( \frac{\text{Conversions}}{\text{Clicks}} \right) \times 100$$
4.  **Cost Per Acquisition (CPA)**: The average advertising cost to acquire one paying customer.
    $$\text{CPA} = \frac{\text{Ad Spend}}{\text{Conversions}}$$
5.  **Return on Ad Spend (ROAS) / ROI**: The revenue generated for every dollar spent on ads.
    $$\text{ROAS} = \frac{\text{Revenue}}{\text{Ad Spend}}$$

Let's write a Python script to aggregate these raw campaign performance statistics for **ClickScale Ad Agency**.

```python
import pandas as pd
import numpy as np

# Performance logs by ad channel
channel_data = {
    "Channel": ["Google Search", "Meta Ads", "YouTube Video", "LinkedIn Ads", "TikTok Spark"],
    "Ad_Spend": [12000.00, 15000.00, 8000.00, 6000.00, 5000.00],
    "Impressions": [850000, 1200000, 950000, 180000, 600000],
    "Clicks": [42500, 72000, 19000, 4500, 36000],
    "Conversions": [1700, 2160, 285, 135, 900],
    "Revenue": [34000.00, 39000.00, 11000.00, 18000.00, 12000.00]
}

df_channels = pd.DataFrame(channel_data)

# Compute marketing KPIs
df_channels["CTR_Pct"] = (df_channels["Clicks"] / df_channels["Impressions"]) * 100
df_channels["CPC"] = df_channels["Ad_Spend"] / df_channels["Clicks"]
df_channels["Conversion_Rate_Pct"] = (df_channels["Conversions"] / df_channels["Clicks"]) * 100
df_channels["CPA"] = df_channels["Ad_Spend"] / df_channels["Conversions"]
df_channels["ROAS"] = df_channels["Revenue"] / df_channels["Ad_Spend"]

# Format output for display
df_display = df_channels.copy()
df_display["Ad_Spend"] = df_display["Ad_Spend"].map("${:,.2f}".format)
df_display["CTR_Pct"] = df_display["CTR_Pct"].map("{:.2f}%".format)
df_display["CPC"] = df_display["CPC"].map("${:.2f}".format)
df_display["Conversion_Rate_Pct"] = df_display["Conversion_Rate_Pct"].map("{:.2f}%".format)
df_display["CPA"] = df_display["CPA"].map("${:.2f}".format)
df_display["ROAS"] = df_display["ROAS"].map("{:.2f}x".format)

print("--- Marketing Channel ROI Aggregation ---")
print(df_display[["Channel", "Ad_Spend", "CTR_Pct", "CPC", "Conversion_Rate_Pct", "CPA", "ROAS"]])
```

```text
# Output:
--- Marketing Channel ROI Aggregation ---
         Channel    Ad_Spend CTR_Pct   CPC Conversion_Rate_Pct     CPA   ROAS
0  Google Search  $12,000.00   5.00% $0.28               4.00%   $7.06  2.83x
1       Meta Ads  $15,000.00   6.00% $0.21               3.00%   $6.94  2.60x
2  YouTube Video   $8,000.00   2.00% $0.42               1.50%  $28.07  1.38x
3   LinkedIn Ads   $6,000.00   2.50% $1.33               3.00%  $44.44  3.00x
4   TikTok Spark   $5,000.00   6.00% $0.14               2.50%   $5.56  2.40x
```

### Channel Insights:
*   **LinkedIn Ads** has the highest ROAS (**3.00x**) and CPC (**$1.33**). It targets a small but high-value audience, resulting in larger deal sizes that make up for the high click costs.
*   **YouTube Video** has the lowest ROAS (**1.38x**) and the highest CPA (**$28.07**), indicating that it is currently an inefficient channel for direct conversions.

---

## Step 2: Statistical Evaluation (A/B Test Design)

ClickScale Ad Agency runs an A/B test to optimize conversions on a high-traffic landing page. We want to test whether changing the call-to-action button color from Green (Control / Campaign A) to Orange (Treatment / Campaign B) increases the conversion rate.

```text
                   LANDING PAGE A/B TEST SETUP
                   
      [ Visitors (N=30,000) ] ---> [ Splitter (50/50) ]
                                          |
                        +-----------------+-----------------+
                        |                                   |
                        v                                   v
             [ Campaign A: Control ]             [ Campaign B: Treatment ]
                  Green Button                        Orange Button
             Clicks: 15,000                      Clicks: 15,000
             Conversions: 450                    Conversions: 510
             Conv. Rate: 3.0%                    Conv. Rate: 3.4%
```

### Establishing the Hypothesis:
*   **Null Hypothesis ($H_0$)**: The conversion rates of Campaign A and Campaign B are equal ($p_A = p_B$). Any observed difference is due to random chance.
*   **Alternative Hypothesis ($H_1$)**: The conversion rates of Campaign A and Campaign B are different ($p_A \neq p_B$).
*   **Significance Level ($\alpha$)**: We set this to `0.05` (5%). We will reject the null hypothesis if the p-value is less than 0.05, meaning there is less than a 5% chance the result occurred by accident.

---

## Step 3: Statistical Test Execution in Python

We will use the `scipy.stats` library to run a two-proportion Z-test. This test determines if the difference between two sample proportions is statistically significant.

```python
import numpy as np
import scipy.stats as stats

# A/B Test Parameters
conversions_A = 450
clicks_A = 15000

conversions_B = 510
clicks_B = 15000

# Proportions
p_A = conversions_A / clicks_A
p_B = conversions_B / clicks_B

print(f"Campaign A (Control) Conversion Rate: {p_A*100:.2f}%")
print(f"Campaign B (Treatment) Conversion Rate: {p_B*100:.2f}%")

# Pooled probability
p_pooled = (conversions_A + conversions_B) / (clicks_A + clicks_B)

# Standard Error (SE)
se = np.sqrt(p_pooled * (1 - p_pooled) * (1/clicks_A + 1/clicks_B))

# Calculate Z-statistic
z_stat = (p_B - p_A) / se

# Calculate Two-Tailed p-value
p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))

print(f"Calculated Z-Score: {z_stat:.4f}")
print(f"Calculated p-value: {p_value:.4f}")

# Evaluate hypothesis
alpha = 0.05
if p_value < alpha:
    print("Decision: Reject the Null Hypothesis. The conversion rate difference is statistically significant.")
else:
    print("Decision: Fail to Reject the Null Hypothesis. The conversion rate difference is not statistically significant.")
```

```text
# Output:
Campaign A (Control) Conversion Rate: 3.00%
Campaign B (Treatment) Conversion Rate: 3.40%
Calculated Z-Score: 1.9682
Calculated p-value: 0.0490
Decision: Reject the Null Hypothesis. The conversion rate difference is statistically significant.
```

### Result Analysis:
The p-value is **0.0490**, which is just below our **0.05** significance threshold. Because the p-value is less than $\alpha$, we reject the null hypothesis. The Orange button (Campaign B) provides a statistically significant improvement in conversion rate over the Green button (Campaign A).

<div class="interview-tip">
Always report the confidence interval along with the p-value. A p-value only tells you <i>if</i> there is a difference, while a confidence interval tells you the <i>magnitude</i> of that difference, helping stakeholders understand the business impact.
</div>

---

## Step 4: Budget Optimization

Now that we have confirmed Campaign B is the winner, we need to optimize our budget allocation. We will build a Python function that uses a simple decision matrix to allocate marketing spend based on ROAS and statistical confidence.

### Optimization Strategy:
1.  **Scale (Add 30% Budget)**: If the campaign has a statistically significant improvement and ROAS $> 2.0x$.
2.  **Maintain (No Change)**: If the campaign is statistically significant but ROAS is between $1.5x$ and $2.0x$, OR if the results are not yet statistically significant but ROAS $> 2.0x$ (we need to gather more data).
3.  **Reduce (Cut 50% Budget)**: If the campaign is not statistically significant and ROAS $< 1.5x$.
4.  **Pause (Stop Campaign)**: If the campaign shows a statistically significant decrease in performance, or if ROAS $< 1.0x$.

```python
def optimize_campaign_budget(roas, is_sig, trend):
    if is_sig and trend == "positive" and roas >= 2.0:
        return "Scale Budget (+30%)"
    elif (not is_sig and roas >= 2.0) or (is_sig and trend == "positive" and 1.5 <= roas < 2.0):
        return "Maintain Current Budget"
    elif not is_sig and roas < 1.5:
        return "Reduce Budget (-50%)"
    elif (is_sig and trend == "negative") or roas < 1.0:
        return "Pause Campaign"
    else:
        return "Maintain Current Budget"

# Test decision logic on campaign segments
print("Scenario 1 (Significant winner, ROAS 2.5):", optimize_campaign_budget(2.5, True, "positive"))
print("Scenario 2 (Not significant, ROAS 2.2):", optimize_campaign_budget(2.2, False, "positive"))
print("Scenario 3 (Not significant, ROAS 1.2):", optimize_campaign_budget(1.2, False, "positive"))
print("Scenario 4 (Low performance, ROAS 0.8):", optimize_campaign_budget(0.8, True, "negative"))
```

```text
# Output:
Scenario 1 (Significant winner, ROAS 2.5): Scale Budget (+30%)
Scenario 2 (Not significant, ROAS 2.2): Maintain Current Budget
Scenario 3 (Not significant, ROAS 1.2): Reduce Budget (-50%)
Scenario 4 (Low performance, ROAS 0.8): Pause Campaign
```

---

## Gotchas & Edge Cases

When running marketing experiments and analyzing ROI, keep these common traps in mind:

### 1. Sample Ratio Mismatch (SRM)
If you set up your testing tool to split traffic 50/50, but your final sample sizes are significantly different (e.g., 14,500 Control vs. 15,500 Treatment), your split is broken. This is known as Sample Ratio Mismatch and indicates that your randomization process is biased, which invalidates your test results.
*   **Fix**: Run a Chi-Square goodness-of-fit test on your sample counts. If the p-value is $< 0.001$, pause the test and investigate your traffic routing tool for bugs.

### 2. Simpson's Paradox
Simpson's Paradox occurs when a trend appears in different groups of data but reverses when those groups are combined. For example, Campaign B might outperform Campaign A in aggregate, but when you break the data down by device type, Campaign A actually performs better on both Mobile and Desktop individually.
*   **Fix**: Always segment your analysis by key user dimensions (such as country, device type, or traffic source) to verify that aggregate trends are consistent across your audience.

---

## Practice Exercises

<div class="challenge">
<h3>Exercise 1: Chi-Square Test for Multi-Variant Ads</h3>
<p><strong>Scenario:</strong> You are testing three ad variations (Creative A, Creative B, and Creative C) and track their conversions.</p>
<p><strong>Your Task:</strong> Using the data below, write a Python script using <code>scipy.stats.chi2_contingency</code> to determine if conversion rates vary significantly across the three designs. Report the Chi-Square statistic and the p-value.</p>
<ul>
  <li>Creative A: 120 conversions, 4,000 clicks</li>
  <li>Creative B: 155 conversions, 4,200 clicks</li>
  <li>Creative C: 90 conversions, 3,800 clicks</li>
</ul>
</div>

<div class="challenge">
<h3>Exercise 2: Calculate ROI with Attribution Lag</h3>
<p><strong>Scenario:</strong> Customers click your ads in January but do not purchase until February. If you evaluate January's ROI on January 31st, your ad spend will look high while your revenue looks low, leading to an artificially low ROI calculation.</p>
<p><strong>Your Task:</strong> Write a Python function that takes a list of transactions containing <code>Click_Date</code>, <code>Purchase_Date</code>, and <code>Purchase_Value</code>, and calculates the true ROI for January clicks, accounting for conversions that occurred within a 30-day window.</p>
</div>

---

## Section Recaps

*   **Standardize Metrics**: Ensure your team calculates CTR, CPC, CPA, and ROAS consistently across all channels.
*   **Test for Significance**: Never declare a campaign winner based on raw percentages alone. Use Z-tests or Chi-Square tests to rule out random chance.
*   **Watch for Biases**: Routinely check for Sample Ratio Mismatch (SRM) and Simpson's Paradox to keep your test results clean and accurate.
*   **Optimize Systematically**: Use clear rules to scale, adjust, or pause campaign budgets based on statistical confidence and ROAS targets.

---

## Common Interview Questions

### Q1: What is statistical power in an A/B test, and why does it matter?
**Answer:** Statistical power is the probability that a test will correctly reject the null hypothesis when there is a real difference to detect (i.e., avoiding a Type II error or false negative). A standard target for statistical power is 80%. If your test has low power—often due to a small sample size—you risk running the test, seeing no statistically significant difference, and missing out on a valuable design improvement because you did not gather enough data.

### Q2: What is the difference between a Type I error and a Type II error in marketing experiments?
**Answer:** A Type I error (false positive) occurs when you reject the null hypothesis when it is actually true—for example, concluding that a new ad creative improves conversions when the difference was just random noise. A Type II error (false negative) occurs when you fail to reject the null hypothesis when it is false—for example, concluding that a new headline has no impact when it actually would have improved conversions. We control Type I errors using our significance level ($\alpha$, usually 5%) and Type II errors by ensuring our sample size is large enough to achieve sufficient statistical power (usually 80%).

### Q3: How does a multi-touch attribution model differ from a last-touch attribution model, and how does it affect ROI calculations?
**Answer:** A last-touch attribution model assigns 100% of the conversion credit to the very last ad or link the customer clicked before purchasing. This approach under-credits top-of-funnel channels (like video ads or social media) and over-credits bottom-of-funnel channels (like brand search ads). A multi-touch attribution model distributes credit across all touchpoints in the customer journey (e.g., first touch, lead creation, last touch). This provides a more balanced view of how different channels work together, though it requires more complex data tracking.

### Q4: When running an A/B test, why is it bad practice to stop the test early as soon as the p-value drops below 0.05?
**Answer:** Stopping a test early as soon as it looks significant is known as "peeking" and is a form of p-hacking. The p-value fluctuates naturally as data accumulates. If you check the results repeatedly and stop the test the moment it looks successful, you dramatically increase your false positive rate. You should always determine your required sample size *before* starting the test and only run the statistical analysis once you have gathered the target amount of data.

### Q5: How do you calculate the Minimum Detectable Effect (MDE) for an A/B test, and how does it impact your project timeline?
**Answer:** The Minimum Detectable Effect (MDE) is the smallest change in conversion rate that you want to detect with your test. A smaller MDE requires a much larger sample size to detect, which extends your testing window. MDE is calculated based on your baseline conversion rate, desired statistical power (typically 80%), and significance level (typically 5%). If you set your MDE too low, you may need to run your test for months to collect enough data, whereas a higher MDE lets you complete the test faster but means you will miss smaller, incremental performance improvements.
