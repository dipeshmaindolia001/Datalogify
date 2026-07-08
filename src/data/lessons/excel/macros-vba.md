---
title: "Macros & VBA Basics — Automate Repetitive Tasks"
description: "Record macros, understand basic VBA, and automate formatting, reporting, and data processing tasks."
category: "excel"
order: 204
phase: 3
tags: ["excel", "macros", "vba", "automation"]
publishedDate: 2025-03-29
prevSlug: "power-pivot-dax"
nextSlug: "dashboard-project"
seoTitle: "Excel Macros & VBA Tutorial | Datalogify"
seoDescription: "Learn Excel macros and VBA basics — record macros, edit VBA code, automate reports and formatting."
---

## Why This Matters

Some tasks in Excel are painful because they're repetitive — reformatting a weekly report, cleaning the same data structure every month, copying data between sheets. Macros let you record those steps once and replay them with a single button click. You don't need to be a programmer — most analysts just record and lightly edit macros.

## Recording Your First Macro

**Steps:**
1. View → Macros → Record Macro (or Developer → Record Macro)
2. Name it: `FormatSalesReport` (no spaces!)
3. Shortcut key: Ctrl+Shift+F (optional)
4. Store in: This Workbook
5. Click OK — **everything you do is now being recorded**

**Do your formatting steps:**
- Select A1 → Bold, Font Size 14
- Select header row → Bold, Blue background, White text
- Select data range → Add borders
- AutoFit all column widths (Alt+H, O, I)
- Add filters (Ctrl+Shift+L)

6. View → Macros → Stop Recording

**Running it:**
- View → Macros → Select `FormatSalesReport` → Run
- Or press Ctrl+Shift+F (your shortcut)

That's it. Next month, paste your raw data and run the macro — formatting done in 1 second.

## Viewing the Generated VBA Code

**Alt+F11** opens the Visual Basic Editor (VBE).

In the left panel, find your workbook → Modules → Module1. Your recorded macro looks like:

```vba
Sub FormatSalesReport()
'
' FormatSalesReport Macro
' Formats the weekly sales report
'

    ' Title formatting
    Range("A1").Select
    With Selection.Font
        .Bold = True
        .Size = 14
    End With
    
    ' Header row formatting
    Rows("2:2").Select
    With Selection
        .Font.Bold = True
        .Font.Color = RGB(255, 255, 255)
        .Interior.Color = RGB(47, 85, 151)
    End With
    
    ' AutoFit columns
    Cells.Select
    Cells.EntireColumn.AutoFit
    
    ' Add filters
    Range("A2").Select
    Selection.AutoFilter

End Sub
```

## Understanding Basic VBA

### Key Concepts

```vba
Sub MacroName()
    ' This is a comment
    ' Code goes here
End Sub
```

- **Sub** = Subroutine (a macro)
- **Range("A1")** = refers to cell A1
- **Range("A1:D10")** = refers to a range
- **Cells(row, column)** = refers to a cell by row/column number: `Cells(1, 1)` = A1
- **ActiveSheet** = the currently selected sheet
- **Sheets("Sheet1")** = a specific sheet
- **Selection** = whatever is currently selected

### Variables

```vba
Sub CalculateBonus()
    Dim revenue As Double
    Dim bonusRate As Double
    Dim bonus As Double
    
    revenue = Range("B2").Value
    bonusRate = 0.05
    bonus = revenue * bonusRate
    
    Range("C2").Value = bonus
    MsgBox "Bonus calculated: " & Format(bonus, "₹#,##0")
End Sub
```

### If Statements

```vba
Sub ClassifySales()
    Dim lastRow As Long
    Dim i As Long
    
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    
    For i = 2 To lastRow
        If Cells(i, 4).Value > 50000 Then
            Cells(i, 5).Value = "High"
        ElseIf Cells(i, 4).Value > 20000 Then
            Cells(i, 5).Value = "Medium"
        Else
            Cells(i, 5).Value = "Low"
        End If
    Next i
    
    MsgBox "Classification complete! " & (lastRow - 1) & " rows processed."
End Sub
```

### For Loops

```vba
Sub HighlightAboveAverage()
    Dim lastRow As Long
    Dim avgRevenue As Double
    Dim i As Long
    
    lastRow = Cells(Rows.Count, 4).End(xlUp).Row
    
    ' Calculate average
    avgRevenue = Application.WorksheetFunction.Average(Range("D2:D" & lastRow))
    
    ' Loop through and highlight
    For i = 2 To lastRow
        If Cells(i, 4).Value > avgRevenue Then
            Cells(i, 4).Interior.Color = RGB(198, 239, 206)  ' Light green
        End If
    Next i
    
    MsgBox "Average revenue: " & Format(avgRevenue, "₹#,##0") & vbNewLine & _
           "Above-average rows highlighted in green."
End Sub
```

## Practical Macro Examples

### Auto-Format a Report

```vba
Sub FormatMonthlyReport()
    ' Find data dimensions
    Dim lastRow As Long, lastCol As Long
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    lastCol = Cells(1, Columns.Count).End(xlToLeft).Column
    
    Dim dataRange As Range
    Set dataRange = Range(Cells(1, 1), Cells(lastRow, lastCol))
    
    ' Header formatting
    With Range(Cells(1, 1), Cells(1, lastCol))
        .Font.Bold = True
        .Font.Color = vbWhite
        .Interior.Color = RGB(47, 85, 151)
        .HorizontalAlignment = xlCenter
    End With
    
    ' Add borders to all data
    With dataRange.Borders
        .LineStyle = xlContinuous
        .Weight = xlThin
        .Color = RGB(200, 200, 200)
    End With
    
    ' AutoFit
    dataRange.Columns.AutoFit
    
    ' Freeze header row
    Rows("2:2").Select
    ActiveWindow.FreezePanes = True
    
    ' Add filters
    Range("A1").AutoFilter
    
    ' Go back to A1
    Range("A1").Select
    
    MsgBox "Report formatted! " & (lastRow - 1) & " rows, " & lastCol & " columns."
End Sub
```

### Clean Data Automatically

```vba
Sub CleanRawData()
    Dim lastRow As Long
    Dim i As Long
    Dim deletedCount As Long
    
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    
    ' Work backwards when deleting rows
    For i = lastRow To 2 Step -1
        ' Delete blank rows
        If Application.WorksheetFunction.CountA(Range(Cells(i, 1), Cells(i, 10))) = 0 Then
            Rows(i).Delete
            deletedCount = deletedCount + 1
        End If
    Next i
    
    ' Trim spaces in text columns (A, B, C)
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    For i = 2 To lastRow
        Cells(i, 1).Value = Trim(Cells(i, 1).Value)
        Cells(i, 2).Value = Trim(Cells(i, 2).Value)
        Cells(i, 3).Value = Application.WorksheetFunction.Proper(Trim(Cells(i, 3).Value))
    Next i
    
    MsgBox "Data cleaned! " & deletedCount & " blank rows removed." & vbNewLine & _
           (lastRow - 1) & " rows remaining."
End Sub
```

## Assigning Macros to Buttons

1. Insert → Shapes → Rectangle (draw it on your sheet)
2. Add text: "Format Report" or "Clean Data"
3. Right-click the shape → Assign Macro → select your macro
4. Now anyone can click the button to run the macro

Or: Developer → Insert → Button (Form Control) → draw → assign macro.

## Personal Macro Workbook

Store macros you use across ALL workbooks:

When recording, set "Store macro in:" → **Personal Macro Workbook**

This creates a hidden workbook (PERSONAL.XLSB) that opens automatically every time Excel starts. Your macros are always available.

## Security and Trust Settings

Excel blocks macros by default (security). To manage:

File → Options → Trust Center → Trust Center Settings → Macro Settings:
- **Disable all macros with notification** (recommended — asks you each time)
- Disable without notification (blocked silently)
- Enable all macros (dangerous — only for development)

Save macro-enabled workbooks as **.xlsm** (not .xlsx — which strips macros).

## When to Use Macros vs Power Query

| Task | Use Macro | Use Power Query |
|---|---|---|
| Format a report | ✅ | ❌ |
| Clean/reshape data | Possible but harder | ✅ (much easier) |
| Combine multiple files | Possible | ✅ (much easier) |
| Automate button clicks / UI | ✅ | ❌ |
| Send emails automatically | ✅ | ❌ |
| Data transformation pipeline | ❌ | ✅ |
| One-off formatting task | ✅ | ❌ |

<div class="interview-tip">

**Where This Shows Up in Real Jobs:**
- Automating weekly/monthly report formatting (most common use)
- Building one-click data cleanup buttons for non-technical colleagues
- Automating email distribution of reports (VBA + Outlook)
- Not usually required for fresher data analyst roles, but it's a strong differentiator
- "Can you automate this process?" → Macros for formatting, Power Query for data

</div>

<div class="challenge">

**Mini-Challenge:** Record and edit a macro that:

1. Formats the header row (bold, blue background, white text)
2. Adds borders to all data cells
3. AutoFits all columns
4. Adds filters
5. Creates a SUM row at the bottom for numeric columns
6. Assigns the macro to a button shape
7. Test it by pasting new raw data and clicking the button

</div>

## Common Interview Questions

### Q1: What is a macro and when would you use one?

**Answer:** A macro is a recorded or written sequence of Excel actions that can be replayed with one click. Use macros for repetitive formatting tasks (weekly report formatting), automated data processing steps, and building buttons that non-technical users can click. They're written in VBA (Visual Basic for Applications) but you don't need to write code — recording captures your actions.

### Q2: What's the difference between .xlsx and .xlsm?

**Answer:** `.xlsx` is a standard Excel file that does NOT support macros. `.xlsm` is a macro-enabled workbook that CAN contain VBA code. If you save a workbook with macros as .xlsx, the macros are stripped out. Always save as .xlsm when you have macros, and be aware that some organizations block .xlsm files for security reasons.

### Q3: How do you make a macro available in all workbooks?

**Answer:** Store it in the Personal Macro Workbook (PERSONAL.XLSB). When recording a macro, change "Store macro in" to "Personal Macro Workbook." This hidden workbook opens automatically whenever Excel starts, making your macros available globally across all workbooks.

### Q4: Is VBA the same as Python for data analytics?

**Answer:** No. VBA is specifically for automating Excel/Office tasks — formatting, moving data between sheets, sending Outlook emails. Python is a general-purpose programming language with powerful data analytics libraries (Pandas, NumPy, Matplotlib). For data analysis and machine learning, Python is far superior. For Excel-specific automation (formatting reports, UI buttons), VBA is the right tool. Many modern organizations are replacing VBA with Python via libraries like `openpyxl`.

### Q5: Are macros secure?

**Answer:** Macros can be a security risk because VBA can access your file system, send emails, and modify files — malware has been distributed via macro-enabled Excel files. Excel blocks macros by default and shows a security warning. Best practice: only enable macros from trusted sources, keep "Disable with notification" setting, and never enable macros in files from unknown senders.
