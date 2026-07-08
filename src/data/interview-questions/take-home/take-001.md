---
id: "take-001"
topic: "take-home"
title: "Analyzing Customer Lifetime Value (LTV) and CAC Payback"
level: "advanced"
type: "business-operations"
tags: ["ltv", "cac", "payback-period"]
order: 1
question: |
  You are given a raw transactional database showing purchases made by customers over 2 years, alongside marketing channel costs. You need to calculate the average Customer Acquisition Cost (CAC) per channel and the LTV-to-CAC payback period (months).
answer: |
  1. **Clean transactional data:** aggregate total order value per customer ID, filtering out refunds.
  2. **Compute CAC per channel:**
     $$\text{CAC} = \frac{\text{Total Channel Spend}}{\text{Total New Customers Acquired}}$$
  3. **Calculate LTV (Lifetime Value):**
     $$\text{LTV} = \text{Average Order Value} \times \text{Purchase Frequency} \times \text{Gross Margin} \times \text{Customer Lifespan}$$
  4. **Calculate Payback Period:**
     $$\text{Payback Period (months)} = \frac{\text{CAC}}{\text{Average Monthly Contribution Margin}}$$
explanation: |
  - Companies grading take-home assignments care about how cleanly you structure your code or sheets.
  - Showing mathematical models and formula variables demonstrates deep analytical rigor.
  - Adding a summary one-pager with visual metrics usually yields higher grading scores than complex formulas alone.
followUp: |
  What if the customer retention rate drops over time? How does it affect your payback period calculations?
  - A dropping retention rate shortens the customer lifespan and reduces long-term LTV, meaning you need to shorten the target payback period to prevent losing money on marketing spend.
---
