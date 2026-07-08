---
id: "stats-001"
topic: "statistics"
title: "Explain p-value to a Business Stakeholder"
level: "beginner"
type: "theory"
tags: ["hypothesis-testing", "communication"]
order: 1
question: |
  How would you explain what a "p-value" is to a non-technical business stakeholder (e.g. product manager or marketing lead)?
answer: |
  "Imagine we run an A/B test changing a button from blue to green, and the green button shows higher sales. A p-value tells us how likely we would see a sales difference that big purely by random luck, even if the button color actually made zero difference.
  
  If the p-value is very small (like 1% or 0.01), it means there is only a 1% chance we got lucky by accident. This gives us confidence that the green button really is driving the sales lift. If the p-value is large (like 25% or 0.25), it means there is a 25% chance this result is just random noise, so we shouldn't trust it yet."
explanation: |
  - Avoid technical definitions like "probability of obtaining test results at least as extreme as the observed results, assuming that the null hypothesis is correct." This confuses business partners.
  - Frame it as a measure of "random luck" or "noise".
  - Give examples of what high vs. low p-values mean in terms of taking action.
followUp: |
  What is alpha level (significance level) and why is it usually set to 5% (0.05)?
  - The alpha level is the threshold we set *before* running the test to decide if the p-value is small enough to accept. 5% means we are willing to accept a 5% risk of committing a Type I error (declaring a difference exists when it doesn't).
---
