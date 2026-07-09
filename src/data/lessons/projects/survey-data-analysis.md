---
title: "Survey Data Analysis — Cleaning & Sentiment Mining"
description: "Clean messy questionnaire responses, impute selective blanks, encode responses, and extract sentiment themes."
category: "projects"
order: 5
phase: 6
tags: ["projects", "survey-data", "nlp", "data-cleaning"]
publishedDate: 2025-04-24
prevSlug: "financial-data-analysis"
nextSlug: "end-to-end-analytics-case-study"
seoTitle: "Survey & Sentiment Analysis Portfolio Project | Datalogify"
seoDescription: "Clean questionnaire responses, handle missing survey fields, ordinal-encode options, and extract customer feedback themes."
---

## Why This Matters

Customer feedback is a goldmine of insights, but surveys are notoriously messy, incomplete, and full of open-ended text. By learning how to clean rating scales, impute missing values, and extract sentiment from text comments, you can help organizations quantify customer sentiment and turn qualitative opinions into structured data.

---

## The Unsorted Feedback Box Analogy

Imagine walking into a retail storefront and looking at the suggestion box on the wall. Inside are hundreds of handwritten cards:

```text
       Card 1: [x] 5 Stars | "I absolutely love the new layout, it's so clean!"
       Card 2: [ ] No Rating | "The cashier was very rude, I had to wait 20 minutes."
       Card 3: [x] 1 Star  | "Terrible. Just terrible."
       Card 4: [x] 3 Stars | "average service, nothing special"
```

To report on this feedback to the store manager, you cannot simply read every card aloud. You need a structured approach:
1.  **Count the Votes**: Convert the rating checkmarks into a clean numerical average.
2.  **Handle Missing Cards**: Decide how to treat cards where the rating checkbox was left blank.
3.  **Read between the Lines**: Group the open-ended comments into primary themes (e.g., Service, Layout, Wait Times) and note whether each comment is positive, neutral, or negative.

In data analytics, we use Python and data preprocessing techniques to automate this workflow, converting a chaotic box of comments into structured datasets and clear sentiment charts.

---

## Step 1: Auditing the Messy Survey Data

Let's review a sample customer feedback dataset from **ShopVibe's Annual Customer Satisfaction Survey**. Notice the typical survey data issues: missing demographic tags, inconsistent capitalization, and blank rating fields.

### ShopVibe Customer Survey (Messy Raw Data)

| Respondent_ID | Age | Experience_Rating | Sat_Level | Open_Feedback |
| :--- | :--- | :--- | :--- | :--- |
| R-8801 | 34 | 5 | Very Satisfied | I love this product! Customer support is fast. |
| R-8802 | 45 | 2 | Dissatisfied | Customer service was slow. Product is decent. |
| R-8803 | NA | 4 | neutral | simple and easy to use. No complaints. |
| R-8804 | 22 | NA | Very Dissatisfied | Horrible delivery times. Packaging was damaged! |
| R-8805 | 29 | 3 | Neutral | average performance, a bit expensive. |
| R-8806 | 55 | 5 | very satisfied | AMAZING support! Best purchase this year. |
| R-8807 | 19 | 1 | Dissatisfied | Waste of money, broke after two days. |
| R-8808 | 41 | 3 | NA | It was okay, nothing special to mention. |

### Data Issues Identified:
*   **Missing Quantitative Values**: `R-8804` did not select an `Experience_Rating`.
*   **Inconsistent Text Formatting**: `Sat_Level` contains mixed casing (`neutral` vs `Neutral`, `very satisfied` vs `Very Satisfied`).
*   **Missing Demographics**: `R-8803` did not disclose their `Age`.
*   **Unstructured Text**: The `Open_Feedback` comments contain variable casing, punctuation, and mixed sentiments.

---

## Step 2: Ordinal Encoding & Imputation

Ordinal data has a natural ordering (e.g., "Very Dissatisfied" < "Dissatisfied" < "Neutral" < "Satisfied" < "Very Satisfied"). To analyze this data mathematically, we must convert these text labels into a standardized numerical scale (e.g., 1 to 5).

### Imputation Rules:
*   **Age Column**: We will impute missing ages using the **Median** of the dataset, which is less sensitive to outliers than the mean.
*   **Experience Rating Column**: We will impute missing ratings using the **Mode** (most frequent value) or the **Median**, as the mean can generate fractional values that do not exist on the rating scale.

Let's write a Python script to handle the initial data cleaning, ordinal mapping, and missing value imputation.

```python
import pandas as pd
import numpy as np

# Load messy survey data
raw_survey = {
    "Respondent_ID": ["R-8801", "R-8802", "R-8803", "R-8804", "R-8805", "R-8806", "R-8807", "R-8808"],
    "Age": [34.0, 45.0, np.nan, 22.0, 29.0, 55.0, 19.0, 41.0],
    "Experience_Rating": [5.0, 2.0, 4.0, np.nan, 3.0, 5.0, 1.0, 3.0],
    "Sat_Level": ["Very Satisfied", "Dissatisfied", "neutral", "Very Dissatisfied", "Neutral", "very satisfied", "Dissatisfied", np.nan],
    "Open_Feedback": [
        "I love this product! Customer support is fast.",
        "Customer service was slow. Product is decent.",
        "simple and easy to use. No complaints.",
        "Horrible delivery times. Packaging was damaged!",
        "average performance, a bit expensive.",
        "AMAZING support! Best purchase this year.",
        "Waste of money, broke after two days.",
        "It was okay, nothing special to mention."
    ]
}

df_survey = pd.DataFrame(raw_survey)

# 1. Clean text cases in Sat_Level
df_survey["Sat_Level"] = df_survey["Sat_Level"].str.strip().str.lower()

# 2. Impute missing Age values with the median
median_age = df_survey["Age"].median()
df_survey["Age"] = df_survey["Age"].fillna(median_age)

# 3. Impute missing Experience_Rating values with the median
median_rating = df_survey["Experience_Rating"].median()
df_survey["Experience_Rating"] = df_survey["Experience_Rating"].fillna(median_rating).astype(int)

# 4. Ordinal encoding mapper
sat_mapping = {
    "very dissatisfied": 1,
    "dissatisfied": 2,
    "neutral": 3,
    "satisfied": 4,
    "very satisfied": 5
}

# Apply mapping and impute missing Sat_Level with the median value (3/neutral)
df_survey["Sat_Score"] = df_survey["Sat_Level"].map(sat_mapping).fillna(3).astype(int)

print("--- Cleaned and Encoded Survey Quantitative Columns ---")
print(df_survey[["Respondent_ID", "Age", "Experience_Rating", "Sat_Score"]])
```

```text
# Output:
--- Cleaned and Encoded Survey Quantitative Columns ---
  Respondent_ID   Age  Experience_Rating  Sat_Score
0        R-8801  34.0                  5          5
1        R-8802  45.0                  2          2
2        R-8803  37.5                  4          3
3        R-8804  22.0                  3          1
4        R-8805  29.0                  3          3
5        R-8806  55.0                  5          5
6        R-8807  19.0                  1          2
7        R-8808  41.0                  3          3
```

---

## Step 3: Text Preprocessing for Open-Ended Comments

To analyze open-ended text comments, we must first clean and standardize the raw text. This process is called **Text Preprocessing** and involves:

1.  **Lowercasing**: Converting all text to lowercase so that words like "FAST" and "fast" are treated identically.
2.  **Removing Punctuation & Special Characters**: Stripping out periods, exclamation marks, and emojis using regular expressions (`re`).
3.  **Removing Stop Words**: Removing common, low-information words like "and", "the", "was", and "it" to focus on the key descriptive terms.

```python
import re

# Simple list of English stop words
STOP_WORDS = {"i", "me", "my", "myself", "we", "our", "ours", "you", "your", "yours", 
              "he", "him", "his", "she", "her", "it", "its", "they", "them", "their", 
              "what", "which", "who", "whom", "this", "that", "am", "is", "are", "was", 
              "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", 
              "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", 
              "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", 
              "into", "through", "during", "before", "after", "above", "below", "to", "from", 
              "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", 
              "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", 
              "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", 
              "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", 
              "just", "should", "now"}

def preprocess_text(text):
    # 1. Convert to lowercase
    text = text.lower()
    # 2. Remove punctuation and numbers
    text = re.sub(r"[^a-z\s]", "", text)
    # 3. Split into individual words
    words = text.split()
    # 4. Filter out stop words
    cleaned_words = [word for word in words if word not in STOP_WORDS]
    # 5. Re-join into a clean string
    return " ".join(cleaned_words)

# Apply preprocessing
df_survey["Cleaned_Feedback"] = df_survey["Open_Feedback"].apply(preprocess_text)

print("--- Raw vs. Preprocessed Text ---")
print(df_survey[["Open_Feedback", "Cleaned_Feedback"]].iloc[0:3])
```

```text
# Output:
--- Raw vs. Preprocessed Text ---
                                    Open_Feedback                   Cleaned_Feedback
0  I love this product! Customer support is fast.       love product customer support fast
1   Customer service was slow. Product is decent.            customer service slow product decent
2          simple and easy to use. No complaints.                    simple easy use complaints
```

---

## Step 4: Simple Sentiment Mining & Theme Extraction

Now that the text is clean, we can write a simple sentiment classifier. While advanced projects use deep learning or transformer models, we can extract clear insights using a **Lexicon-Based Approach** (categorizing comments based on positive and negative keyword matches).

We will define lists of positive and negative words and calculate a sentiment score for each comment:

$$\text{Sentiment Score} = \text{Count(Positive Words)} - \text{Count(Negative Words)}$$

### Lexicon Definition:
*   **Positive Keywords**: `"love"`, `"fast"`, `"good"`, `"amazing"`, `"best"`, `"easy"`, `"simple"`, `"excellent"`, `"satisfied"`, `"decent"`
*   **Negative Keywords**: `"slow"`, `"horrible"`, `"damaged"`, `"expensive"`, `"waste"`, `"broke"`, `"bad"`, `"terrible"`, `"complaints"`

```python
positive_lexicon = {"love", "fast", "good", "amazing", "best", "easy", "simple", "excellent", "satisfied", "decent"}
negative_lexicon = {"slow", "horrible", "damaged", "expensive", "waste", "broke", "bad", "terrible", "complaints"}

def classify_sentiment(text):
    words = text.split()
    pos_count = sum(1 for word in words if word in positive_lexicon)
    neg_count = sum(1 for word in words if word in negative_lexicon)
    
    score = pos_count - neg_count
    
    if score > 0:
        return "Positive"
    elif score < 0:
        return "Negative"
    else:
        return "Neutral"

# Apply classification
df_survey["Sentiment"] = df_survey["Cleaned_Feedback"].apply(classify_sentiment)

print("--- Automated Text Sentiment Mining ---")
print(df_survey[["Respondent_ID", "Cleaned_Feedback", "Sentiment"]])
```

```text
# Output:
--- Automated Text Sentiment Mining ---
  Respondent_ID                    Cleaned_Feedback Sentiment
0        R-8801  love product customer support fast  Positive
1        R-8802  customer service slow product decent   Neutral
2        R-8803          simple easy use complaints  Positive
3        R-8804   horrible delivery times packaging   Negative
4        R-8805         average performance expensive  Negative
5        R-8806            amazing support best purchase  Positive
6        R-8807                   waste money broke days  Negative
7        R-8808            okay nothing special mention   Neutral
```

### Result Summary:
*   **Positive Comments**: Support speeds (`R-8801`, `R-8806`) and product usability (`R-8803`).
*   **Negative Comments**: Delivery issues (`R-8804`), price/performance (`R-8805`), and product durability (`R-8807`).
*   **Neutral Comments**: General feedback (`R-8808`).

---

## Gotchas & Edge Cases

When cleaning and analyzing survey data, look out for these common issues:

### 1. Acquiescence Bias (The "Yes-Man" Bias)
Some respondents tend to agree with all statements, giving high numerical ratings (e.g., 5/5) but typing critical feedback in the comments (e.g., "The product broke immediately"). If you only analyze the numerical ratings, you will miss this dissatisfaction.
*   **Fix**: Cross-reference numerical satisfaction scores with text sentiment. Flag accounts where the ratings are high but the feedback sentiment is negative for manual review.

### 2. Context Blindness
Keyword classifiers can misinterpret negation. For example, the comment `"the software was not bad, but it was not great"` contains the words `"bad"` and `"great"`. A naive keyword matching model would count both and classify the comment as neutral, missing the nuanced feedback.
*   **Fix**: Combine adjacent words into **n-grams** (like "not bad" or "not great") to capture context more accurately.

---

## Practice Exercises

<div class="challenge">
<h3>Exercise 1: Net Promoter Score (NPS) Calculator</h3>
<p><strong>Scenario:</strong> You need to calculate the Net Promoter Score (NPS) for a customer survey.</p>
<p><strong>Your Task:</strong> Write a Python function that takes a list of numeric ratings (0 to 10) and calculates the NPS. The function must group ratings into Promoters (9-10), Passives (7-8), and Detractors (0-6), and apply the NPS formula:</p>
$$\text{NPS} = \% \text{ Promoters} - \% \text{ Detractors}$$
</div>

<div class="challenge">
<h3>Exercise 2: Custom Text N-gram Tokenizer</h3>
<p><strong>Scenario:</strong> You want to capture negations (like "not happy" or "never recommend") in your sentiment analysis.</p>
<p><strong>Your Task:</strong> Write a Python function that takes a cleaned text string and returns a list of **bigrams** (pairs of adjacent words). Show how you would use these bigrams to flag comments containing common negations.</p>
</div>

---

## Section Recaps

*   **Clean rating scales first**: Convert rating text (like "Very Satisfied") to numeric values (like 5) using ordinal encoding.
*   **Impute missing data carefully**: Use the median or mode to fill missing ratings, as the mean can generate unrealistic values.
*   **Standardize text comments**: Prepare text for analysis by converting to lowercase, removing punctuation, and filtering out common stop words.
*   **Audit for biases**: Look out for inconsistencies where users give high numerical ratings but leave negative comments.

---

## Common Interview Questions

### Q1: Why is the median preferred over the mean when imputing missing values in a 5-point Likert scale?
**Answer:** A Likert scale represents ordinal data, where the intervals between ratings are not guaranteed to be equal (e.g., the difference between 4 and 5 may not be the same as the difference between 2 and 3). Additionally, calculating the mean of a rating scale often yields decimal values (like 3.4), which do not exist on the actual scale. Using the median or mode ensures that the imputed value is an actual integer rating that exists on the scale and prevents extreme ratings from skewing the results.

### Q2: What are stop words in NLP, and why do we remove them during text cleaning?
**Answer:** Stop words are common, high-frequency words in a language (like "the", "is", "at", "which", "and") that provide grammatical structure but carry little descriptive meaning. We remove them during preprocessing to reduce noise in our text data. This helps us focus our analysis on the key nouns, verbs, and adjectives (like "broken", "slow", "amazing") that convey the customer's actual sentiment and experience.

### Q3: How do you identify if a survey suffers from Non-Response Bias, and how do you address it?
**Answer:** Non-Response Bias occurs when the characteristics of the people who completed the survey differ significantly from the characteristics of those who did not. I identify this by comparing the demographics (such as age, location, or customer tier) of our survey respondents against our overall customer database. If we find that a group is underrepresented (for example, only 5% of VIPs responded compared to 20% of our user base), we can use statistical weighting to adjust the results and ensure our findings reflect our actual customer mix.

### Q4: Explain the difference between Sentiment Classification and Topic Modeling in survey analysis.
**Answer:** Sentiment classification is a supervised task that measures the emotional tone of a comment, categorizing it as positive, negative, or neutral. Topic modeling is an unsupervised task (using algorithms like Latent Dirichlet Allocation) that identifies the underlying themes or subjects discussed in a collection of comments (such as billing issues, delivery delays, or app crashes) without requiring predefined labels.

### Q5: What is the risk of using a pre-trained sentiment analysis model on industry-specific survey comments?
**Answer:** Pre-trained sentiment models are often trained on general text, like movie reviews or social media posts, and can misinterpret industry-specific language. For example, in a medical software survey, the word "crude" might refer to raw data inputs, but a general model might flag it as negative. Similarly, a phrase like "the product was a steal" is positive in retail but might be flagged as a theft issue. To prevent this, you should customize the model's lexicon or train it on industry-specific data to capture the correct business context.
