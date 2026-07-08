---
id: "case-001"
topic: "case-study"
title: "Investigating a Drop in Active Users"
level: "intermediate"
type: "metrics-diagnosis"
tags: ["metrics", "investigation"]
order: 1
question: |
  Your product manager informs you that Weekly Active Users (WAU) dropped by 10% last week. How would you investigate this problem?
framework: "Hypothesis-driven metric decomposition framework (MECE)"
answer: |
  1. **Clarify the metric definition & verify tracking:** Is WAU defined as logins or actions? Has the tracking script changed?
  2. **Segment the drop:**
     - **By Platform:** iOS, Android, Desktop?
     - **By Region:** Particular country or global?
     - **By User Type:** New vs. Retained vs. Resurrected users?
  3. **Decompose WAU:**
     - \(WAU_t = WAU_{t-1} + NewUsers - ChurnedUsers\)
  4. **Analyze external factors:** Major holiday? Competitor launch? App store outage?
  5. **Analyze internal product changes:** Recent release? Bug? Marketing campaign ending?
explanation: |
  - Interviewers want to see that you do not panic or randomly list ideas.
  - They look for a structured, MECE (Mutually Exclusive, Collectively Exhaustive) approach.
  - Standardizing verification of tracking health before checking data queries shows real-world data analyst experience.
followUp: |
  Suppose you find the drop is entirely on Android in India. What are your next steps?
  - Check with the engineering team for any Android-specific crashes in India, check network latency/server load in that region, or audit if there was a localized play store update block.
---
