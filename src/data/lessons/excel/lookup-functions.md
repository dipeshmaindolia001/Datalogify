---
title: "Lookup Functions — VLOOKUP, INDEX-MATCH & XLOOKUP"
description: "Master all three lookup methods — VLOOKUP for basics, INDEX-MATCH for power, XLOOKUP for modern Excel. The #1 interview topic."
category: "excel"
order: 7
phase: 3
tags: ["excel", "vlookup", "index-match", "xlookup", "lookup"]
publishedDate: 2025-03-21
prevSlug: "data-cleaning"
nextSlug: "pivot-tables"
seoTitle: "Excel VLOOKUP, INDEX-MATCH, XLOOKUP Tutorial | Datalogify"
seoDescription: "Master VLOOKUP, INDEX-MATCH, and XLOOKUP — the #1 Excel interview topic for data analysts."
---

## Why This Matters

Lookup functions are the **#1 most-asked Excel topic in interviews**. They let you pull data from one table into another — like connecting an order ID to a customer name, or a product code to its price. You MUST know all three methods.

## The Setup — Two Tables

**Orders Table (Sheet1):**

| Order ID | Product Code | Qty |
|---|---|---|
| 1001 | P-100 | 5 |
| 1002 | P-203 | 2 |
| 1003 | P-100 | 10 |
| 1004 | P-315 | 1 |

**Product Table (Sheet2):**

| Product Code | Product Name | Price |
|---|---|---|
| P-100 | Widget Pro | ₹500 |
| P-203 | Gadget X | ₹1,200 |
| P-315 | Sensor Kit | ₹3,500 |
| P-420 | Module Z | ₹800 |

**Goal:** Pull Product Name and Price into the Orders table.

---

## Method 1: VLOOKUP (Vertical Lookup)

```text
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
```

| Argument | What It Means |
|---|---|
| `lookup_value` | The value to search for (e.g., Product Code) |
| `table_array` | The range to search IN (must include the lookup column as the FIRST column) |
| `col_index_num` | Which column to return (1 = first column of range, 2 = second, etc.) |
| `range_lookup` | FALSE = exact match (use this 99% of the time), TRUE = approximate |

**Get Product Name:**

```text
=VLOOKUP(B2, Sheet2!$A$2:$C$5, 2, FALSE)
```

```text
→ "Widget Pro" (looks up P-100, returns column 2 = Product Name)
```

**Get Price:**

```text
=VLOOKUP(B2, Sheet2!$A$2:$C$5, 3, FALSE)
```

```text
→ 500 (looks up P-100, returns column 3 = Price)
```

**Calculate Total:**

```text
=C2 * VLOOKUP(B2, Sheet2!$A$2:$C$5, 3, FALSE)
```

```text
→ 2500 (5 × ₹500)
```

### VLOOKUP Limitations (Interview Gold)

1. **Can only look RIGHT** — the lookup column must be the FIRST column in your table_array. If Product Name is to the LEFT of Product Code, VLOOKUP can't do it.
2. **Column index breaks** — if someone inserts a column in your lookup table, `col_index_num` shifts and returns wrong data silently.
3. **Only returns first match** — if there are duplicates in the lookup column, VLOOKUP returns the first one.
4. **No built-in error handling** — returns #N/A if the value isn't found. You must wrap with IFERROR.

```text
=IFERROR(VLOOKUP(B2, Sheet2!$A$2:$C$5, 3, FALSE), "Not Found")
```

### Approximate Match (TRUE) — Tiered Lookups

Use `TRUE` (or `1`) for grade tables, tax slabs, commission tiers:

**Tax Slab Table:**

| Min Income | Tax Rate |
|---|---|
| 0 | 0% |
| 250000 | 5% |
| 500000 | 20% |
| 1000000 | 30% |

```text
=VLOOKUP(A2, TaxTable, 2, TRUE)
```

For income ₹700,000 → returns 20% (finds the largest value ≤ 700,000, which is 500,000).

> **Critical:** For approximate match, the lookup column MUST be sorted in ascending order.

---

## Method 2: INDEX + MATCH (Industry Preferred)

INDEX returns a value at a specific row/column position. MATCH returns the position of a value in a range. Together they're more flexible than VLOOKUP.

### MATCH — Find Position

```text
=MATCH(lookup_value, lookup_range, match_type)
```

| match_type | Meaning |
|---|---|
| 0 | Exact match (use this) |
| 1 | Less than or equal (sorted ascending) |
| -1 | Greater than or equal (sorted descending) |

```text
=MATCH("P-203", Sheet2!$A$2:$A$5, 0)
```

```text
→ 2 (P-203 is at position 2 in the range)
```

### INDEX — Get Value at Position

```text
=INDEX(return_range, row_number)
```

```text
=INDEX(Sheet2!$B$2:$B$5, 2)
```

```text
→ "Gadget X" (value at position 2 in the Product Name range)
```

### Combining Them

```text
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
```

**Get Product Name:**

```text
=INDEX(Sheet2!$B$2:$B$5, MATCH(B2, Sheet2!$A$2:$A$5, 0))
```

```text
→ "Widget Pro"
```

**Get Price:**

```text
=INDEX(Sheet2!$C$2:$C$5, MATCH(B2, Sheet2!$A$2:$A$5, 0))
```

```text
→ 500
```

### Why INDEX-MATCH Is Better Than VLOOKUP

| Feature | VLOOKUP | INDEX-MATCH |
|---|---|---|
| Look left | ❌ No | ✅ Yes |
| Column insert-safe | ❌ Breaks | ✅ Safe |
| Performance (large data) | Slower | Faster |
| Multiple criteria | ❌ No | ✅ With array |
| Flexibility | Low | High |

**Look LEFT example** — get Product Code from Product Name (impossible with VLOOKUP):

```text
=INDEX(Sheet2!$A$2:$A$5, MATCH("Gadget X", Sheet2!$B$2:$B$5, 0))
```

```text
→ "P-203"
```

### Two-Criteria Lookup (Array Formula)

Find the price where Product Code = "P-100" AND Region = "North":

```text
=INDEX(Price_Range, MATCH(1, (ProductCode_Range=A2)*(Region_Range=B2), 0))
```

> In older Excel: press **Ctrl+Shift+Enter** (creates curly braces {}). In Excel 365: just press Enter.

---

## Method 3: XLOOKUP (Modern Excel 365)

```text
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
```

**Get Product Name:**

```text
=XLOOKUP(B2, Sheet2!$A$2:$A$5, Sheet2!$B$2:$B$5, "Not Found")
```

```text
→ "Widget Pro"
```

**Get Price:**

```text
=XLOOKUP(B2, Sheet2!$A$2:$A$5, Sheet2!$C$2:$C$5, 0)
```

### Why XLOOKUP Is the Best

| Feature | XLOOKUP |
|---|---|
| Look left or right | ✅ |
| Built-in error handling | ✅ (4th argument) |
| No column counting | ✅ (you specify the return range) |
| Search from bottom | ✅ (`-1` search mode) |
| Exact + next larger/smaller | ✅ |
| Returns arrays | ✅ |

**Return multiple columns at once:**

```text
=XLOOKUP(B2, Sheet2!$A$2:$A$5, Sheet2!$B$2:$C$5, {"Not Found", 0})
```

```text
→ Returns both Product Name AND Price in adjacent cells (spill)
```

---

## Comparison Table (Memorize This for Interviews)

| Feature | VLOOKUP | INDEX-MATCH | XLOOKUP |
|---|---|---|---|
| Look direction | Right only | Any | Any |
| Error handling | Manual (IFERROR) | Manual (IFERROR) | Built-in |
| Column insert safe | ❌ | ✅ | ✅ |
| Multiple criteria | ❌ | ✅ (array) | ✅ |
| Availability | All versions | All versions | Excel 365 only |
| Speed (large data) | Slow | Fast | Fast |
| Learning curve | Easy | Medium | Easy |

## CHOOSE Function

Returns a value from a list based on position:

```text
=CHOOSE(2, "Low", "Medium", "High")    → "Medium"
=CHOOSE(MONTH(A2), "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")
```

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Connecting order data to product master tables
- Pulling employee details from HR database into reports
- Building dynamic dashboards that update based on dropdown selections
- Enriching raw data with additional attributes from reference tables
- **In interviews:** "Write a VLOOKUP to get the price from this product table" + "What are VLOOKUP's limitations?" + "How would you do this with INDEX-MATCH?"

</div>

<div class="challenge">

**Mini-Challenge:**

Given an Orders table (Order ID, Customer ID, Product ID, Quantity) and two reference tables (Customers: ID, Name, City; Products: ID, Name, Price):

1. Use VLOOKUP to pull Customer Name into the Orders table
2. Use INDEX-MATCH to pull Product Price (show that it works even if the column order changes)
3. Use XLOOKUP to pull both Product Name and Price in one formula
4. Calculate Total = Quantity × Price using the looked-up price
5. Handle #N/A errors for any orders with unknown products

</div>

## Common Interview Questions

### Q1: What's the difference between VLOOKUP and INDEX-MATCH?

**Answer:** VLOOKUP searches for a value in the first column of a range and returns from a specified column number to the right. INDEX-MATCH separates the lookup (MATCH finds the position) from the return (INDEX retrieves the value), so it can look left, is column-insert safe, and is faster on large datasets. INDEX-MATCH is industry-preferred for production worksheets.

### Q2: When would you use VLOOKUP with TRUE (approximate match)?

**Answer:** For tiered/slab lookups — tax brackets, grading scales, commission tiers, shipping rate tables. The lookup column must be sorted ascending. Excel finds the largest value less than or equal to your lookup value. Example: tax slab where income 700,000 falls in the 500,000-999,999 bracket.

### Q3: Why does VLOOKUP return #N/A?

**Answer:** Three common causes: (1) The lookup value doesn't exist in the table — typo, extra spaces (use TRIM), case mismatch. (2) Using FALSE (exact match) when the value isn't exactly there. (3) The lookup column isn't the first column of the table_array range. Always wrap with `IFERROR` for production reports.

### Q4: Can VLOOKUP return a value from the left?

**Answer:** No — VLOOKUP only searches the first column and returns to the right. To look left, use INDEX-MATCH or XLOOKUP. This is VLOOKUP's biggest limitation and the #1 reason analysts prefer INDEX-MATCH. In interviews, always mention this limitation proactively.

### Q5: What is XLOOKUP and why is it better?

**Answer:** XLOOKUP (Excel 365) replaces both VLOOKUP and HLOOKUP. It looks in any direction, has built-in error handling (no IFERROR needed), doesn't require column counting, can search from the bottom, and can return arrays. The syntax is cleaner: `=XLOOKUP(what, where_to_look, what_to_return, if_not_found)`. Limitation: only available in Excel 365/2021+, so older organizations may still need VLOOKUP.
