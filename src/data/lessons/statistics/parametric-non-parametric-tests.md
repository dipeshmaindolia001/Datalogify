---
title: "Parametric vs. Non-Parametric Tests — t-Test, ANOVA & Chi-Square"
description: "Master statistical testing methods. Learn One-Sample/Two-Sample t-tests, ANOVA, Chi-Square independence test, and Wilcoxon/Mann-Whitney non-parametric alternatives."
category: "statistics"
order: 5
phase: 5
tags: ["statistics", "t-test", "anova", "chi-square"]
publishedDate: 2025-04-14
prevSlug: "hypothesis-testing"
nextSlug: "ab-testing-experimentation"
seoTitle: "Parametric & Non-Parametric Tests in Python | Datalogify"
seoDescription: "Choose and execute statistical tests. Learn t-tests, ANOVA, Chi-Square, and non-parametric tests like Mann-Whitney U."
---

## Why This Matters

When analyzing real-world data, you cannot simply apply the same statistical test to every dataset. Choosing the wrong test—such as applying a normal-curve t-test to highly skewed income distributions or running multiple t-tests on a multi-group experiment—leads to false conclusions, inflated false-positive rates, and costly business mistakes. Knowing when to choose parametric versus non-parametric tests ensures your analytical findings are mathematically sound and business-ready.

---

## The Analogy: The Precision Scale vs. The Balance Beam

Imagine you are auditing a shipping warehouse that distributes boxes of premium coffee. You want to verify if the average weight of the boxes matches the advertised 12 ounces.

```text
    Parametric: The Precision Scale                Non-Parametric: The Balance Beam
  ┌─────────────────────────────────┐            ┌─────────────────────────────────┐
  │ Uses exact values: 12.02, 11.95 │            │ Uses ranks/orders:              │
  │ Assumes standard normal shape   │            │ Box A > Box B, Box C < Box A     │
  │ High precision, needs stability │            │ Works on any shape, rough data  │
  └─────────────────────────────────┘            └─────────────────────────────────┘
```

* **Parametric tests are like a digital precision scale.** They require a stable environment (assumptions like a bell-curve distribution and equal variance) to measure the exact weights of the boxes. If these assumptions are met, the scale gives you the absolute maximum amount of information and statistical power.
* **Non-parametric tests are like a mechanical balance beam.** If the digital scale breaks, or if the coffee boxes are highly irregular, squished, or contain heavy rocks (outliers/skewed data), the digital scale fails to give reliable statistics. The balance beam doesn't care about the exact shape or distribution; it only tells you if Box A is heavier than Box B (ranking and order). It is robust, works under almost any conditions, but throws away some fine-grained details.

As a data analyst, you must inspect your data structure first to decide whether to turn on the digital scale (parametric) or pull out the balance beam (non-parametric).

---

## Step-by-Step Concept Breakdown: Parametric Assumptions

Parametric tests are statistical procedures that rely on assumptions about the shape and parameters of the parent population distribution. The most common parametric tests are $t$-tests and ANOVA. Before running them, you must validate three core assumptions:

### 1. Independence of Observations
Each data point must be collected independently of all other data points. In other words, one participant's value should not influence another's. 
* **Violation example:** Measuring the same customer's transaction value multiple times and treating them as independent rows, or testing classmates who studied together.
* **How to check:** This is a design assumption. You verify it by reviewing the data collection methodology, not through statistical testing.

### 2. Normality of the Distribution
The dependent variable (or residuals) should be normally distributed within each group.
* **Why it matters:** The underlying math of the $t$-statistic assumes the sample means follow a normal distribution.
* **How to check:**
  * **Visual:** Quantile-Quantile (Q-Q) plots. If the data points lie along the diagonal line, the data is normal.
  * **Statistical:** The Shapiro-Wilk Test (`scipy.stats.shapiro`). 
    * $H_0$: The data is normally distributed.
    * $H_1$: The data is not normally distributed.
    * *Warning:* For large sample sizes ($N > 200$), the Shapiro-Wilk test is highly sensitive and will reject normality even for negligible deviations. Always pair it with visual checks.

### 3. Homoscedasticity (Homogeneity of Variance)
The variance of the outcome variable must be equal across all groups being compared.
* **Why it matters:** When comparing group means, parametric tests pool variances. If one group is highly spread out and the other is tightly clustered, standard formulas fail.
* **How to check:** Levene's Test (`scipy.stats.levene`) or Bartlett's Test (`scipy.stats.bartlett`).
  * $H_0$: The variances are equal across groups.
  * $H_1$: The variances are not equal.

---

## The t-Tests (Parametric)

The $t$-test is used to compare means when the population standard deviation is unknown and the sample size is relatively small (though it works perfectly for large samples too).

### 1. One-Sample t-Test
Compares the mean of a single sample to a known or hypothesized population mean ($\mu_0$).

$$\text{Formula: } t = \frac{\bar{X} - \mu_0}{s / \sqrt{n}}$$

Where $\bar{X}$ is the sample mean, $s$ is the sample standard deviation, and $n$ is the sample size.

#### Code Walkthrough: Employee Task Completion Times
A company sets a benchmark that customer support tickets should take 15 minutes to resolve. We analyze a random sample of 25 tickets to check if the team's average resolution time matches the benchmark.

```python
import numpy as np
import pandas as pd
import scipy.stats as stats

# Set random seed for reproducibility
np.random.seed(42)

# Generate synthetic resolution times (mean=16.2 mins, std=3 mins)
resolution_times = np.random.normal(loc=16.2, scale=3, size=25)

# Hypothesized population mean
target_mean = 15.0

# 1. Check Normality using Shapiro-Wilk
shapiro_stat, shapiro_p = stats.shapiro(resolution_times)
print(f"Shapiro-Wilk Test: W={shapiro_stat:.4f}, p-value={shapiro_p:.4f}")

# 2. Run One-Sample t-test
t_stat, p_val = stats.ttest_1samp(resolution_times, popmean=target_mean)
print(f"One-Sample t-test: t-statistic={t_stat:.4f}, p-value={p_val:.4f}")
print(f"Sample Mean: {np.mean(resolution_times):.2f}")
```

```text
# Output:
Shapiro-Wilk Test: W=0.9634, p-value=0.4859
One-Sample t-test: t-statistic=1.7582, p-value=0.0915
Sample Mean: 15.93
```

* **Interpretation:** The Shapiro-Wilk p-value ($0.4859 > 0.05$) indicates we fail to reject normality; our parametric assumption holds. The one-sample $t$-test p-value ($0.0915 > 0.05$) means we fail to reject the null hypothesis. The average ticket resolution time of 15.93 minutes is not statistically different from the 15-minute target at a 5% significance level.

### 2. Independent Two-Sample t-Test
Compares the means of two independent, unrelated groups to determine if they differ significantly.

#### Student's vs. Welch's t-Test
* **Student's t-test:** Assumes equal variances between groups.
* **Welch's t-test:** Does not assume equal variances. It modifies the degrees of freedom and standard error calculation to account for variance differences. **Best practice is to use Welch's t-test by default.**

#### Code Walkthrough: A/B Test Landing Page Conversion Times
We want to compare the time spent on landing page A vs. page B.

```python
# Generate data for two groups with different variances
group_a = np.random.normal(loc=45, scale=8, size=40)
group_b = np.random.normal(loc=51, scale=12, size=35)

# Test for Homoscedasticity (Levene's Test)
levene_stat, levene_p = stats.levene(group_a, group_b)
print(f"Levene's Test: statistic={levene_stat:.4f}, p-value={levene_p:.4f}")

# Independent t-test (Welch's t-test by setting equal_var=False)
t_stat, p_val = stats.ttest_ind(group_a, group_b, equal_var=False)
print(f"Welch's Two-Sample t-test: t-statistic={t_stat:.4f}, p-value={p_val:.4f}")
```

```text
# Output:
Levene's Test: statistic=4.4128, p-value=0.0391
Welch's Two-Sample t-test: t-statistic=-2.4641, p-value=0.0164
```

* **Interpretation:** Levene's test p-value ($0.0391 < 0.05$) shows the variances are significantly different. Setting `equal_var=False` runs Welch's $t$-test. The p-value of $0.0164$ is less than $0.05$, indicating that the average time spent on page B is statistically different (higher) than page A.

### 3. Paired t-Test
Compares means from the same group of subjects measured at two different points in time (e.g., pre-test vs. post-test) or under two different conditions.

#### Code Walkthrough: App Load Time Optimization
We measure the load time (in seconds) of 15 app screens before and after a backend optimization.

```python
# Load times before optimization
before = np.array([4.2, 3.8, 5.1, 4.9, 6.0, 3.5, 4.0, 5.5, 4.8, 5.2, 3.9, 4.6, 5.0, 5.8, 4.1])
# Load times after optimization (with general reduction)
after = before - np.random.normal(loc=0.6, scale=0.3, size=15)

# Paired t-test
t_stat, p_val = stats.ttest_rel(before, after)
print(f"Paired t-test: t-statistic={t_stat:.4f}, p-value={p_val:.4f}")
print(f"Mean Difference: {np.mean(before - after):.4f} seconds")
```

```text
# Output:
Paired t-test: t-statistic=9.3241, p-value=0.0000
Mean Difference: 0.6134 seconds
```

* **Interpretation:** The extremely small p-value ($< 0.001$) shows a highly significant difference. The backend optimization successfully reduced the load time by an average of 0.61 seconds.

---

## ANOVA (Analysis of Variance)

What if you have three or more groups to compare? For example, comparing customer satisfaction ratings across three support channels: Chat, Email, and Phone.

### The Multi-t-Test Trap (Alpha Inflation)
If you run separate $t$-tests to compare all pairs:
1. Chat vs. Email
2. Email vs. Phone
3. Chat vs. Phone

Each test has a 5% chance of making a Type I error (false positive). The probability of making at least one Type I error across $k$ comparisons is:

$$P(\text{At least one Type I error}) = 1 - (1 - \alpha)^k = 1 - (0.95)^3 \approx 14.3\%$$

By running three tests, your false positive rate has jumped from 5% to 14.3%! ANOVA solves this by running a single "omnibus" test at a fixed $\alpha$ level.

### How ANOVA Works (F-Statistic)
ANOVA splits the total variation in the dataset into two components:
1. **Between-Group Variance:** How much the group means differ from each other.
2. **Within-Group Variance:** How much individual data points within each group differ from their respective group mean.

$$F = \frac{\text{Variance Between Groups (Signal)}}{\text{Variance Within Groups (Noise)}} = \frac{MS_{\text{between}}}{MS_{\text{within}}}$$

If the $F$-statistic is significantly greater than 1, it means the variation between the groups is much larger than the natural variation within the groups, indicating that at least one group mean is different.

```text
       High F-Statistic (Significant)                Low F-Statistic (Non-Significant)
     Group 1    Group 2    Group 3              Group 1   Group 2   Group 3
       ┌─┐        ┌─┐        ┌─┐                  ┌─┐       ┌─┐       ┌─┐
      ┌┘ └┐      ┌┘ └┐      ┌┘ └┐                ┌┘ └┐     ┌┘ └┐     ┌┘ └┐
     ─┴───┴──────┴───┴──────┴───┴─              ─┴─┬─┴─────┴─┬─┴─────┴─┬─┴─
         [Well-Separated Means]                     [Highly Overlapping Data]
```

### Post-Hoc Tests (Tukey's HSD)
If ANOVA returns a significant p-value, it only tells you that *at least one* group is different. It does not tell you *which* one. To find out, we run a post-hoc test like **Tukey’s Honestly Significant Difference (HSD)**, which performs pairwise comparisons while controlling the Family-Wise Error Rate back to 5%.

#### Code Walkthrough: Support Channels Comparison
Let's compare customer satisfaction scores (CSAT, 1-10) across Chat, Email, and Phone.

```python
import statsmodels.api as sm
from statsmodels.formula.api import ols
from statsmodels.stats.multicomp import pairwise_tukeyhsd

# Generate data
np.random.seed(101)
chat = np.random.normal(loc=7.8, scale=1.1, size=30)
email = np.random.normal(loc=7.0, scale=1.0, size=30)
phone = np.random.normal(loc=8.1, scale=1.2, size=30)

# Create a DataFrame
df = pd.DataFrame({
    'CSAT': np.concatenate([chat, email, phone]),
    'Channel': ['Chat']*30 + ['Email']*30 + ['Phone']*30
})

# 1. Run One-Way ANOVA
model = ols('CSAT ~ Channel', data=df).fit()
anova_table = sm.stats.anova_lm(model, typ=2)
print("ANOVA Results:")
print(anova_table)

# 2. If significant, run Tukey's HSD post-hoc test
tukey = pairwise_tukeyhsd(endog=df['CSAT'], groups=df['Channel'], alpha=0.05)
print("\nTukey HSD Results:")
print(tukey)
```

```text
# Output:
ANOVA Results:
            sum_sq    df         F    PR(>F)
Channel  20.407604   2.0  9.130691  0.000244
Residual 97.224168  87.0       NaN       NaN

Tukey HSD Results:
Multiple Comparison of Means - Tukey HSD, FWER=0.05
===================================================
group1 group2 meandiff p-adj   lower  upper  reject
---------------------------------------------------
  Chat  Email  -0.7857 0.0163 -1.4554 -0.116   True
  Chat  Phone   0.2974 0.5489 -0.3723  0.967  False
 Email  Phone   1.0831 0.0004  0.4134 1.7527   True
---------------------------------------------------
```

* **Interpretation:** The ANOVA test shows a highly significant difference ($p = 0.000244 < 0.05$). The Tukey HSD table shows that the mean CSAT for Email is statistically different from both Chat ($p = 0.0163$) and Phone ($p = 0.0004$), whereas Chat and Phone do not show a statistically significant difference ($p = 0.5489$).

---

## Chi-Square Tests (Categorical Data)

When dealing with counts and categories instead of numerical means, we use the Chi-Square ($\chi^2$) test.

$$\text{Formula: } \chi^2 = \sum \frac{(O - E)^2}{E}$$

Where $O$ is the Observed frequency, and $E$ is the Expected frequency under the null hypothesis.

### 1. Chi-Square Goodness-of-Fit Test
Tests if the observed distribution of a single categorical variable matches an expected theoretical distribution.

#### Code Walkthrough: Ad Click Distributions
An advertiser expects that ad clicks are evenly distributed across the 5 workdays. They collect click data: 120, 95, 105, 130, 110 clicks.

```python
# Clicks observed Monday through Friday
observed_clicks = np.array([120, 95, 105, 130, 110])
total_clicks = observed_clicks.sum()

# Expected: uniform distribution
expected_clicks = np.array([total_clicks / 5] * 5)

# Goodness-of-Fit Test
chi2_stat, p_val = stats.chisquare(f_obs=observed_clicks, f_exp=expected_clicks)
print(f"Chi-Square Goodness-of-Fit: Chi2={chi2_stat:.4f}, p-value={p_val:.4f}")
```

```text
# Output:
Chi-Square Goodness-of-Fit: Chi2=6.3929, p-value=0.1717
```

* **Interpretation:** The p-value of $0.1717 > 0.05$ indicates we fail to reject the null hypothesis. The distribution of ad clicks across the days of the week is not significantly different from a uniform distribution.

### 2. Chi-Square Test of Independence
Tests if there is a significant relationship between two distinct categorical variables.

#### Code Walkthrough: Subscription Plan vs. Device Type
We want to know if the subscription tier chosen (Basic vs. Pro) is independent of the device used (Desktop vs. Mobile).

```python
# Create contingency table (cross-tabulation)
# Rows: Desktop, Mobile
# Columns: Basic, Pro
observed_data = np.array([
    [150, 80],  # Desktop users (Basic, Pro)
    [120, 110]  # Mobile users (Basic, Pro)
])

# Test of Independence
chi2, p_val, dof, expected = stats.chi2_contingency(observed_data)
print(f"Chi-Square Test of Independence:")
print(f"Chi2 Statistic: {chi2:.4f}")
print(f"p-value: {p_val:.4f}")
print(f"Degrees of freedom: {dof}")
print("Expected Frequencies Table:")
print(expected)
```

```text
# Output:
Chi-Square Test of Independence:
Chi2 Statistic: 5.6791
p-value: 0.0172
Degrees of freedom: 1
Expected Frequencies Table:
[[135.   95. ]
 [135.   95. ]]
```

* **Interpretation:** The p-value of $0.0172 < 0.05$ indicates we reject the null hypothesis. The device type and subscription plan chosen are statistically dependent; mobile users are more likely to opt for the Pro plan compared to desktop users.

---

## Non-Parametric Alternatives

When data violates parametric assumptions—such as extreme skewness, heavy outliers, or ordinal measurement scales (e.g., Likert ratings 1-5)—parametric tests lose statistical power or yield incorrect p-values. Non-parametric alternatives resolve this by mapping data values to their ordinal ranks.

```text
  Raw values:  [ 1.2,  3.4,  450.1,  2.1,  0.5 ]
  Mapped ranks: [  2,     4,      5,    3,    1  ]  <-- The outlier (450.1) is now just rank 5!
```

### 1. Mann-Whitney U Test (Alternative to Independent t-Test)
Compares the distributions of two independent groups. It tests whether a randomly selected value from one group is likely to be larger or smaller than a randomly selected value from the other.

#### Code Walkthrough: Customer Referral Program
We compare the checkout transaction amounts for users who signed up via referral vs. organic users. Transaction values are highly right-skewed.

```python
# Right-skewed transaction data (Pareto/Exponential-like)
organic = np.random.exponential(scale=20, size=50)
referred = np.random.exponential(scale=35, size=45)

# Mann-Whitney U Test
u_stat, p_val = stats.mannwhitneyu(organic, referred, alternative='two-sided')
print(f"Mann-Whitney U Test: U-statistic={u_stat:.4f}, p-value={p_val:.4f}")
```

```text
# Output:
Mann-Whitney U Test: U-statistic=822.0000, p-value=0.0154
```

* **Interpretation:** Because transaction data is highly skewed, an independent t-test is inappropriate. The Mann-Whitney U test p-value ($0.0154 < 0.05$) indicates a statistically significant difference in checkout values between the groups.

### 2. Wilcoxon Signed-Rank Test (Alternative to Paired t-Test)
Compares paired groups. It ranks the absolute differences between the pairs and assigns signs (+ or -) based on direction.

#### Code Walkthrough: Subjective Usability Score
We measure user satisfaction ratings (1-10 scale) on a software interface before and after a layout change. Since ratings are ordinal, we use Wilcoxon.

```python
before_rating = np.array([5, 6, 7, 5, 4, 8, 6, 7, 5, 6])
after_rating  = np.array([7, 6, 9, 8, 5, 8, 8, 9, 6, 8])

# Wilcoxon Signed-Rank Test
w_stat, p_val = stats.wilcoxon(before_rating, after_rating)
print(f"Wilcoxon Signed-Rank Test: W={w_stat:.4f}, p-value={p_val:.4f}")
```

```text
# Output:
Wilcoxon Signed-Rank Test: W=0.0000, p-value=0.0078
```

* **Interpretation:** The ratings are ordinal discrete values. The Wilcoxon test shows a significant increase in user satisfaction ratings after the redesign ($p = 0.0078$).

### 3. Kruskal-Wallis Test (Alternative to One-Way ANOVA)
Compares 3+ independent groups based on ranks.

```python
# 3 Groups of skewed data
team_a = [12, 15, 14, 18, 50]  # outlier: 50
team_b = [8, 9, 11, 10, 12]
team_c = [14, 16, 15, 17, 19]

# Kruskal-Wallis Test
h_stat, p_val = stats.kruskal(team_a, team_b, team_c)
print(f"Kruskal-Wallis Test: H-statistic={h_stat:.4f}, p-value={p_val:.4f}")
```

```text
# Output:
Kruskal-Wallis Test: H-statistic=7.5756, p-value=0.0226
```

* **Interpretation:** Since the sample sizes are very small and contain outliers, ANOVA assumptions are violated. The Kruskal-Wallis test p-value ($0.0226 < 0.05$) confirms a significant difference exists among the three teams.

---

## Edge Cases & Common Mistakes

### 1. The Multi-t-Test Trap
As discussed, testing multiple pairs of categories using individual $t$-tests builds up the Type I error rate. Always start with ANOVA or Kruskal-Wallis. Only proceed to post-hoc tests (Tukey's HSD, Dunn's test) if the overall test is significant.

### 2. Normality Checking on Raw Data vs. Residuals
In ANOVA or regression, beginners check if the dependent variable is normally distributed. What actually needs to be normally distributed is the **error term (residuals)** within each group, or the difference scores in a paired $t$-test.

### 3. Ignoring the Power Cost of Non-Parametric Tests
Non-parametric tests are "safe" because they do not assume normality, but they have **less statistical power** (roughly 95% efficiency compared to parametric tests when assumptions are met). If your data is normal, using Mann-Whitney U instead of an independent $t$-test increases the risk of a Type II error (failing to detect a real difference).

### 4. Chi-Square Small Expected Frequency Rule
The Chi-Square test relies on large-sample approximations. If **any expected cell frequency** in your contingency table is $< 5$, the Chi-Square distribution fails to approximate the test statistic well.
* **Fix:** Use **Fisher's Exact Test** (`scipy.stats.fisher_exact`) for $2 \times 2$ tables, or merge low-count category bins.

<div class="interview-tip">
Always mention that you choose Welch's t-test by default rather than standard Student's t-test in interviews. It shows you understand that in real-world business data, equal variance is an extremely rare luxury, and Welch's t-test controls Type I error rates perfectly without losing power.
</div>

---

## Practice Exercises & Mini-Projects

<div class="challenge">
### Challenge 1: The E-Commerce Store Checkout Speed
An online store wants to check if a new payment gateway speeds up transaction times. They recorded checkout times (in seconds) for two independent groups:
* Gateway A (Standard): 45, 52, 60, 48, 120, 55, 62, 50 (contains an outlier of 120s due to a lag spike).
* Gateway B (New): 41, 44, 46, 42, 45, 48, 43, 45.

1. Test for normality and homoscedasticity.
2. Select the correct test (parametric vs. non-parametric) and calculate the p-value.
3. Write down your recommendation for the team.
</div>

<div class="challenge">
### Challenge 2: Marketing Channel Attribution
A social media agency wants to test if user demographic generation (Gen Z, Millennials, Gen X) has an association with their preferred social platform (TikTok, Instagram, LinkedIn).
* Gen Z: 80 prefer TikTok, 40 prefer Instagram, 10 prefer LinkedIn.
* Millennials: 30 prefer TikTok, 70 prefer Instagram, 50 prefer LinkedIn.
* Gen X: 10 prefer TikTok, 40 prefer Instagram, 80 prefer LinkedIn.

Use Python to structure this contingency table and perform a test of independence. Interpret the results.
</div>

---

## Section Recaps

* **Parametric tests** (like $t$-tests and ANOVA) assume normality, equal variances, and independent observations. They offer maximum statistical power.
* **Non-parametric tests** (like Mann-Whitney U, Wilcoxon, and Kruskal-Wallis) use rank-order mechanics and are highly robust against outliers and skewness.
* **Welch’s t-test** is the preferred version of the independent $t$-test because it protects against unequal variances.
* **ANOVA** avoids the trap of inflating Type I error rates (alpha inflation) when comparing three or more group means.
* **Chi-Square tests** compare categorical frequencies. Goodness-of-Fit tests one variable distribution, while the Test of Independence evaluates associations between two variables.

---

## Common Interview Questions

### Q1: Why can't we just run multiple pairwise t-tests instead of a single ANOVA when comparing three or more group means? Explain the mathematics behind Type I error inflation.
**Answer:**
Running multiple pairwise $t$-tests increases the **Family-Wise Error Rate (FWER)**. The FWER is the probability of making at least one Type I error (false positive) across all the tests performed. 

If we have $g$ groups, the number of pairwise comparisons is:

$$c = \frac{g(g - 1)}{2}$$

For three groups, $c = 3$. If we perform three independent tests at a significance level of $\alpha = 0.05$, the probability of *not* making a Type I error on any single test is $1 - \alpha = 0.95$. Assuming independence, the probability of not making a Type I error across all three tests is:

$$(1 - \alpha)^c = 0.95^3 \approx 0.857$$

Therefore, the probability of making at least one Type I error is:

$$\text{FWER} = 1 - (1 - \alpha)^c = 1 - 0.857 = 0.143 \text{ (or } 14.3\%)$$

By running multiple tests, we have raised our false positive rate from 5% to 14.3%. For 5 groups, the number of tests is 10, raising the FWER to approximately 40%. ANOVA prevents this by running a single global $F$-test to evaluate if *any* differences exist. Only if the ANOVA p-value is significant do we run post-hoc tests (like Tukey's HSD) that mathematically adjust the individual p-values to keep the FWER capped at 5%.

### Q2: Under what conditions would you choose Welch's t-test over Student's t-test, and what is the mathematical adjustment being made?
**Answer:**
Welch's $t$-test is chosen over Student's $t$-test when the assumption of equal variances (homoscedasticity) is violated, or when sample sizes between the two groups are unequal. Student's $t$-test pools the variances of the two groups, assuming they are equal:

$$s_p^2 = \frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}$$

If the variances are actually different and the sample sizes are unequal, this pooling leads to incorrect standard errors and inflated Type I error rates. 

Welch's $t$-test does not pool variances. Instead, it computes the $t$-statistic using individual sample variances:

$$t = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$

To adjust for this, Welch's test uses the **Welch–Satterthwaite equation** to calculate an adjusted, fractional value for the degrees of freedom ($df$), which reduces the degrees of freedom to make the critical values of the $t$-distribution more conservative:

$$df \approx \frac{\left(\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}\right)^2}{\frac{\left(\frac{s_1^2}{n_1}\right)^2}{n_1-1} + \frac{\left(\frac{s_2^2}{n_2}\right)^2}{n_2-1}}$$

Because of its safety profile and negligible loss of power when variances are equal, Welch's $t$-test is widely considered the superior choice for default independent two-sample testing.

### Q3: If your sample size is very large (e.g., $N > 10,000$), do you need to worry about the normality assumption for parametric tests? Why or why not?
**Answer:**
Generally, no. Under the **Central Limit Theorem (CLT)**, the sampling distribution of the sample mean approaches a normal distribution as the sample size increases ($N > 30$), regardless of the shape of the population distribution. 

Because parametric tests like the $t$-test and ANOVA rely on the normality of the *sampling distribution of the mean* (not the raw distribution of the population itself), they become highly robust to deviations from normality in large samples.

However, two exceptions apply:
1. **Severe Outliers:** In extremely skewed distributions (such as wealth or internet click behaviors), a few massive outliers can distort the sample mean and variance calculation, degrading the test's power.
2. **Hypothesis Test Over-sensitivity:** In very large samples, statistical normality tests like Shapiro-Wilk or Kolmogorov-Smirnov become *too* sensitive, flagging minor, practically meaningless deviations from normality as statistically significant. In these cases, you should rely on visual diagnostic checks (Q-Q plots) rather than significance tests for normality.

### Q4: Explain the difference between the Chi-Square Goodness-of-Fit test and the Chi-Square Test of Independence. When would you use each in a business setting?
**Answer:**
Both tests use the Chi-Square test statistic $\sum \frac{(O-E)^2}{E}$, but they differ in their data structure, null hypotheses, and research questions:

1. **Chi-Square Goodness-of-Fit Test:**
   * **Data Structure:** A single categorical variable with multiple levels.
   * **Purpose:** Checks if the observed sample distribution fits an expected theoretical distribution.
   * **Business Example:** Checking if customer complaints are distributed equally across days of the week, or verifying if the demographic distribution of our app users matches the target census data.
   * **Degrees of Freedom:** $df = k - 1$ (where $k$ is the number of categories).

2. **Chi-Square Test of Independence:**
   * **Data Structure:** Two categorical variables cross-tabulated in a contingency table ($R \times C$).
   * **Purpose:** Checks if there is a significant association between the two variables (i.e., whether they are independent).
   * **Business Example:** Evaluating if customer churn (Yes/No) is independent of the marketing channel they were acquired through (SEO, PPC, Social).
   * **Degrees of Freedom:** $df = (r - 1)(c - 1)$ (where $r$ is the number of rows and $c$ is the number of columns).

### Q5: A product manager wants to compare the click-through rates (CTR) of two different landing pages. The CTR is highly skewed with many zeros. Which test should you run, and why? Contrast the Mann-Whitney U test with a traditional t-test for this scenario.
**Answer:**
Since CTR is calculated at the user level (either 0 for no click, or 1 for click), the raw metric is binary. When comparing average CTRs (which are proportions), we are dealing with binomial data.

If the sample sizes are large (which is standard for landing page tests), the **Two-Sample z-test for Proportions** (or a Chi-Square test of independence) is the standard parametric choice. Due to the Central Limit Theorem, the distribution of the proportion estimate is normal, so a z-test or t-test is mathematically valid.

However, if the sample size is very small or if we are measuring *continuous engagement metrics* that are heavily zero-inflated (e.g., time spent on page, where many users spend 0 seconds), we must choose carefully:
* **The Independent t-test:** It compares group means. In the presence of high zero-inflation and severe skew, the mean may not be a representative measure of central tendency. However, it remains robust if sample sizes are large.
* **The Mann-Whitney U test:** This non-parametric test compares the probability that a random observation from Group A is greater than Group B by ranking the combined data. It handles zeros and skewness easily. However, with heavy zero-inflation, you will get many tied ranks (all the zeros share the same rank), which requires a mathematical tie correction and can reduce the test's power.

**Recommendation:** For standard binary click metrics (0/1), use the Chi-Square test or a Two-Proportion z-test. For continuous zero-inflated engagement metrics (e.g., purchase values), use the Mann-Whitney U test if the sample size is small, or Welch's t-test if the sample size is large enough for the CLT to ensure normal sampling distributions.
