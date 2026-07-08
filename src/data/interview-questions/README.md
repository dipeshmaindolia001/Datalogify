# How to Add New Interview Questions

To add a new question to the Datalogify interview prep database, follow these simple steps. The website will automatically update the question lists, filters, tags, and dynamic schemas!

## Step 1: Create a Markdown File
Create a new `.md` file inside the appropriate topic directory:
- `src/data/interview-questions/sql/`
- `src/data/interview-questions/python/`
- `src/data/interview-questions/statistics/`
- `src/data/interview-questions/case-study/`
- `src/data/interview-questions/behavioral/`
- `src/data/interview-questions/take-home/`

Give the file a unique name, e.g., `sql-007.md`.

## Step 2: Fill in the Content Structure
Copy-paste the template below and edit the fields. Make sure to use `|` (block scalars) for multiline content so you can write normal Markdown paragraphs, list items, and code blocks.

```markdown
---
id: "sql-007"                                          # Unique ID matching the filename
topic: "sql"                                           # Must be one of: python | sql | statistics | case-study | behavioral | take-home
title: "Find Duplicate Emails"                         # Title displayed in the card header
level: "beginner"                                      # Must be one of: beginner | intermediate | advanced
type: "query-writing"                                  # Category identifier (e.g. joins, STAR, metrics-diagnosis)
tags: ["filtering", "basic-syntax"]                    # Any relevant tags for tag-based filtering
order: 7                                               # Sorting order sequence (defaults to 999 if omitted)
question: |
  Write a SQL query to find all duplicate emails in a table named `Person`.
sampleData: |
  `Person` table:
  | id | email |
  |---|---|
  | 1 | a@b.com |
  | 2 | c@d.com |
  | 3 | a@b.com |
answer: |
  ```sql
  SELECT email
  FROM Person
  GROUP BY email
  HAVING COUNT(email) > 1;
  ```
explanation: |
  - We group the table rows by `email` to collect identical emails together.
  - The `HAVING` clause filters out groups that have a count of 1, leaving only emails that appear more than once.
followUp: |
  What if the email values contain trailing whitespaces or are in different cases?
  - You would wrap `TRIM(LOWER(email))` in both the `GROUP BY` and the `SELECT` statements.
---
```

## Field Definitions
- **topic**: Tells Astro which topic page to display the question on.
- **level**: Filters questions dynamically (Beginner / Intermediate / Advanced).
- **type**: The main question category.
- **tags**: Auxiliary sub-topics for dynamic search/filter.
- **question**: The problem statement.
- **sampleData** *(optional)*: Database schemas, tabular grids, or context data.
- **answer**: The worked solution (supporting formatted code blocks).
- **explanation**: An E-E-A-T friendly description of why this query/method is selected.
- **followUp** *(optional)*: Harder variants or hypothetical follow-up prompts.
- **starExample** *(optional)*: STAR method framework description (mostly used for behavioral questions).
- **framework** *(optional)*: Case study structures or guidelines (mostly used for case studies).
