<span id="top"></span>

# Appendix 01 (Appendix A): Character Strings in Python — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Appendix A, printed pages 721–724 ([supplied PDF](<../Data Structures and Algorithms in Python - APPENDIX.pdf>)).<br>
> **Topic:** Searching for substrings; constructing related strings; testing Boolean conditions; splitting and joining strings; string formatting.<br>
> **Domain Focus:** Rectangular cards measured in centimetres, with text labels, dimensions, areas, and a selection report.<br>
> **User Prompt:** Reexplain [Section Appendix 01] part by part, with background and simple, connected math-geometry study cases, in the format of [01-01-overview.md](../01-python-primer/01-01-overview.md).

---

## Table of Contents

1. [Background & Conceptual Intuition: From Card Labels to Areas](#background)
   - [1. The geometry activity](#background-problem)
   - [2. Why text processing matters](#background-text)
2. [Part 1: What a Python String Is](#part-1)
3. [Part 2: Searching for Substrings (Table A.1)](#part-2)
   - [1. Membership, counts, and positions](#part-2-search)
   - [2. Restricting a search to part of a string](#part-2-range)
4. [Part 3: Constructing Related Strings (Table A.2)](#part-3)
   - [1. Immutability, replacement, and letter case](#part-3-copy)
   - [2. Padding and trimming](#part-3-layout)
5. [Part 4: Testing Boolean Conditions (Table A.3)](#part-4)
   - [1. Checking a prefix or suffix](#part-4-ends)
   - [2. Checking what characters a string contains](#part-4-characters)
6. [Part 5: Splitting and Joining Strings (Table A.4)](#part-5)
   - [1. Divide a selection log](#part-5-split)
   - [2. Partition one card record](#part-5-partition)
   - [3. Join pieces into a report](#part-5-join)
7. [Part 6: String Formatting](#part-6)
   - [1. Placeholders and argument order](#part-6-fields)
   - [2. Alignment, number bases, and precision](#part-6-specs)
8. [Part 7: Connected Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: From Card Labels to Areas

<span id="background-problem"></span>

### 1. The geometry activity

We continue the rectangular-card activity from [Section 1.1](../01-python-primer/01-01-overview.md). A card's **area = width × height**.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

Suppose a student selects `A`, `B`, then another `A`. The three physical cards have total area **6 + 8 + 6 = 20 cm²** and average area **20 ÷ 3 ≈ 6.67 cm² per card**. Repeating `A` means selecting another card of the same size.

<span id="background-text"></span>

### 2. Why text processing matters

The selections might arrive as one line of text:

```python
log = "A:2x3|B:4x2|A:2x3"
```

The vertical bars separate records; each colon separates a label from its dimensions; `x` separates width from height. **All of these characters, including `2` and `3`, are text at first.** Python must locate and separate the text before `int("2") * int("3")` can calculate an area.

```text
"A:2x3|B:4x2|A:2x3"
      ↓ split at each |
"A:2x3", "B:4x2", "A:2x3"
      ↓ separate labels and dimensions; convert dimension text to numbers
6 cm², 8 cm², 6 cm² → total 20 cm²
```

The appendix is a reference for the string operations that make this pipeline possible. The geometry supplies a connected reason to use each operation.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: What a Python String Is

A **string** is an ordered sequence of text characters. Python's `str` type can hold ordinary letters, digits, punctuation, spaces, and Unicode characters such as `π` and `²`. The older book describes Unicode using a fixed 16-bit model; for current Python, think of `str` as Unicode text rather than assuming one fixed number of bits per character.

```python
label = "A"                 # a one-character string
dimensions = "2x3"         # three characters, not two measurements yet
unit = "cm²"               # Unicode superscript two
print(len(dimensions))      # 3
print("π" in "πr²")        # True
```

The book refers back to string literals, `str(obj)`, and `+` concatenation. They matter when we turn a calculated area into a label:

```python
area = 2 * 3               # the number 6
caption = "Area: " + str(area) + " cm²"
print(caption)              # Area: 6 cm²
```

`"2" + "3"` produces `"23"` because `+` joins strings. `2 + 3` produces the number `5`. We use `int("2")` when the text `"2"` should become a number for arithmetic.

> **Mental model:** Text methods help us find, clean, test, split, and present card information. Arithmetic happens after the dimension text is converted to numbers.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Searching for Substrings (Table A.1)

A **substring** is a continuous piece of a larger string. In `log`, `"B:4x2"` is a substring and begins at index `6`. Python counts string positions from `0`.

<span id="part-2-search"></span>

### 1. Membership, counts, and positions

| Index in `log` | Text |
| :--- | :--- |
| `0`–`4` | `A:2x3` |
| `5` | Vertical bar separator |
| `6`–`10` | `B:4x2` |
| `11` | Vertical bar separator |
| `12`–`16` | `A:2x3` |

| Operation on `log` | Result | What it answers |
| :--- | :--- | :--- |
| `"B:4x2" in log` | `True` | Does this record occur anywhere? |
| `log.count("A:2x3")` | `2` | How many non-overlapping copies occur? |
| `log.find("A:2x3")` | `0` | Where does the first copy start? |
| `log.rfind("A:2x3")` | `12` | Where does the last copy start? |
| `log.find("C:4x4")` | `-1` | No matching record was found. |
| `log.index("B:4x2")` | `6` | Find the first copy, requiring it to exist. |
| `log.rindex("A:2x3")` | `12` | Find the last copy, requiring it to exist. |

`find` and `rfind` return `-1` when the pattern is absent. `index` and `rindex` raise `ValueError` instead. Use `in` if you only need a yes-or-no answer. Use `find` if absence is normal and you need a position; use `index` if absence should be treated as an error.

`count` uses **non-overlapping** matches. For example, `"A|A|A".count("A|A")` is `1`: the possible matches share the middle `A`, so both cannot be counted.

<span id="part-2-range"></span>

### 2. Restricting a search to part of a string

The search and count methods accept optional `start` and `end` positions. They look within the same range as `log[start:end]`, where `end` is excluded, while any returned index still refers to the original `log`.

```python
log = "A:2x3|B:4x2|A:2x3"
print(log.find("A:2x3", 1))       # 12: skip the match at index 0
print(log.find("A:2x3", 1, 12))   # -1: the second match starts at 12
print(log.count("A:2x3", 6))     # 1: only the later A is in this range
```

The index `12` is excluded by the middle call's `end=12`. A restricted search is useful when a card label has already been processed and we want to continue scanning the remainder of the log.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Constructing Related Strings (Table A.2)

<span id="part-3-copy"></span>

### 1. Immutability, replacement, and letter case

Python strings are **immutable**: a method does not edit the original string. It returns a string with the requested change. Assign the result if you want to keep it.

```python
raw_label = " a "
clean_label = raw_label.strip().upper()
print(repr(raw_label))        # ' a '
print(repr(clean_label))      # 'A'
```

`repr(...)` makes surrounding spaces visible in the output. The following methods build related strings:

| Method | Geometry example | Result |
| :--- | :--- | :--- |
| `replace(old, new)` | `"A:2x3".replace("x", " × ")` | `"A:2 × 3"` |
| `capitalize()` | `"rECTANGLE".capitalize()` | `"Rectangle"` |
| `upper()` | `"card a".upper()` | `"CARD A"` |
| `lower()` | `"AREA".lower()` | `"area"` |

`capitalize()` changes the first character to uppercase and the remaining letters to lowercase. `replace` changes every non-overlapping match by default; its optional third argument limits how many replacements are made. For example, changing only the first selected `A` leaves the later `A` alone:

```python
log = "A:2x3|B:4x2|A:2x3"
print(log.replace("A:2x3", "A:3x3", 1))
# A:3x3|B:4x2|A:2x3
print(log)  # A:2x3|B:4x2|A:2x3 — unchanged
```

<span id="part-3-layout"></span>

### 2. Padding and trimming

Padding makes columns line up in a printed card report. Trimming removes unwanted text at the ends of a string.

| Method | Geometry example | Result shown with `repr` |
| :--- | :--- | :--- |
| `center(width)` | `"A".center(5, "-")` | `'--A--'` |
| `ljust(width)` | `"A".ljust(5, ".")` | `'A....'` |
| `rjust(width)` | `"A".rjust(5, ".")` | `'....A'` |
| `zfill(width)` | `"6".zfill(3)` | `'006'` |
| `strip()` | `"  A  ".strip()` | `'A'` |
| `lstrip()` | `"  A  ".lstrip()` | `'A  '` |
| `rstrip()` | `"  A  ".rstrip()` | `'  A'` |

The justification methods use spaces unless a fill character is supplied. Their `width` is a **minimum**: a longer string is not cut short. `zfill` pads a text number with leading zeros; `"-6".zfill(3)` is `"-06"`, keeping the sign at the front.

By default, `strip`, `lstrip`, and `rstrip` remove whitespace. With an argument, they remove **any of the listed characters** from the relevant ends, not one complete prefix or suffix. For example, `"mcm²".strip("cm")` becomes `"²"`: the initial `m`, `c`, and `m` are all eligible characters. This matters if a unit label is being cleaned.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Testing Boolean Conditions (Table A.3)

Each method in this part returns `True` or `False`. A check can guard the next step of our geometry calculation.

<span id="part-4-ends"></span>

### 1. Checking a prefix or suffix

```python
record = "A:2x3"
print(record.startswith("A:"))   # True: this is an A record
print(record.endswith("x3"))     # True: the written height is 3
```

These checks compare text. `endswith("x3")` does not calculate a height; it only recognizes the characters at the end.

<span id="part-4-characters"></span>

### 2. Checking what characters a string contains

| Method | Example | Result | Reading |
| :--- | :--- | :--- | :--- |
| `isspace()` | `" \t".isspace()` | `True` | Every character is whitespace. |
| `isalpha()` | `"A".isalpha()` | `True` | The label contains letters only. |
| `islower()` | `"cm".islower()` | `True` | Its cased letters are lowercase. |
| `isupper()` | `"CM".isupper()` | `True` | Its cased letters are uppercase. |
| `isdigit()` | `"23".isdigit()` | `True` | Its characters are digit characters. |
| `isdecimal()` | `"23".isdecimal()` | `True` | Its characters are decimal digits. |
| `isnumeric()` | `"²".isnumeric()` | `True` | Superscript two has a numeric value. |
| `isalnum()` | `"A2".isalnum()` | `True` | Letters and numeric characters are allowed. |

`"A:2".isalnum()` is `False` because `:` is punctuation. `"2.5".isdecimal()` is `False` because the decimal point is not a digit. The empty string fails the character-category checks; `islower()` and `isupper()` also need at least one cased letter, so `"2".islower()` is `False`.

The book's simple `0`–`9` description of `isdigit()` is too narrow for current Python. Unicode gives us a useful geometry example:

| Text | `isdecimal()` | `isdigit()` | `isnumeric()` |
| :--- | :---: | :---: | :---: |
| `"2"` | `True` | `True` | `True` |
| `"²"` | `False` | `True` | `True` |
| `"½"` | `False` | `False` | `True` |

Thus `"²".isdigit()` being `True` does **not** mean `int("²")` works. For the ASCII dimension notation used here, check the expected format before conversion. See the [current Python string-method reference](https://docs.python.org/3/library/stdtypes.html#string-methods) for the exact Unicode classifications.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Splitting and Joining Strings (Table A.4)

<span id="part-5-split"></span>

### 1. Divide a selection log

`split` turns one string into a list of strings. `rsplit` does the same but starts choosing separators from the right when a maximum number of splits is given.

```python
log = "A:2x3|B:4x2|A:2x3"
print(log.split("|"))       # ['A:2x3', 'B:4x2', 'A:2x3']
print(log.split("|", 1))    # ['A:2x3', 'B:4x2|A:2x3']
print(log.rsplit("|", 1))   # ['A:2x3|B:4x2', 'A:2x3']
```

The `1` is the **maximum number of splits**, not the maximum number of returned pieces. The text after an unsplit separator remains in the final piece.

If no separator is given, `split()` divides on runs of whitespace. With a literal space separator, repeated spaces create empty pieces:

```python
print("2  3".split())       # ['2', '3']
print("2  3".split(" "))    # ['2', '', '3']
print("A:2x3\nB:4x2".splitlines())  # ['A:2x3', 'B:4x2']
```

`splitlines()` is for a report with one card record on each line.

<span id="part-5-partition"></span>

### 2. Partition one card record

`partition` cuts at the **first** occurrence of a separator and always returns three strings: the text before, the separator itself, and the text after. `rpartition` cuts at the last occurrence.

```python
record = "B:4x2"
print(record.partition(":"))    # ('B', ':', '4x2')
print(record.rpartition(":"))   # ('B', ':', '4x2')
```

There is only one colon in this record, so both results match. If no colon occurs, the results differ:

```python
record = "B:4x2"
print(record.partition(";"))    # ('B:4x2', '', '')
print(record.rpartition(";"))   # ('', '', 'B:4x2')
```

The empty middle element tells us the separator was absent. To turn a valid record into measurements:

```python
label, colon, dimensions = "B:4x2".partition(":")
width_text, height_text = dimensions.split("x")
area = int(width_text) * int(height_text)
print(label, area)              # B 8
```

The two `int` calls are the point where text dimensions become numbers. This short example assumes the record uses the expected `label:widthxheight` format.

<span id="part-5-join"></span>

### 3. Join pieces into a report

`join` goes in the opposite direction: it combines a sequence of strings, placing a separator between neighboring pieces.

```python
cards = ["A: 6 cm²", "B: 8 cm²", "A: 6 cm²"]
print(" | ".join(cards))
# A: 6 cm² | B: 8 cm² | A: 6 cm²
```

The separator owns the method: `" | ".join(cards)`. Its spaces are part of the result; `"|".join(cards)` would put no spaces around each bar. Every item passed to `join` must already be a string, so convert a numeric area with `str(area)` or `format` first.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: String Formatting

<span id="part-6-fields"></span>

### 1. Placeholders and argument order

`format` fills the `{}` placeholders of a **formatting string**. The result is another string.

```python
label, width, height = "A", 2, 3
area = width * height
line = "{}: {} × {} = {} cm²".format(label, width, height, area)
print(line)  # A: 2 × 3 = 6 cm²
```

Unnumbered placeholders take arguments from left to right. Numbered placeholders can reuse or rearrange them:

```python
print("{0} has area {1}; another {0} also has area {1}.".format("A", "6 cm²"))
# A has area 6 cm²; another A also has area 6 cm².
```

<span id="part-6-specs"></span>

### 2. Alignment, number bases, and precision

The text after `:` inside a placeholder controls its display. Padding is useful for a neat geometry report:

| Formatting expression | Result | Meaning |
| :--- | :--- | :--- |
| `"{:-^8}".format("AREA")` | `'--AREA--'` | Center in width 8, filling with `-`. |
| `"{:.<5}".format("A")` | `'A....'` | Align left in width 5, filling with `.`. |
| `"{:0>3}".format(6)` | `'006'` | Align right and pad with zeros. |
| `"{:02d}x{:02d}".format(2, 3)` | `'02x03'` | Show two-digit dimensions. |

`<`, `>`, and `^` mean left, right, and center alignment. Space is the default fill character. A width is a minimum, so a longer value is not truncated.

The appendix also mentions `b`, `o`, and `x` for displaying an integer in binary, octal, and hexadecimal. These change the **written representation**, not the numeric value:

```python
print("{:b} {:o} {:x}".format(8, 8, 8))  # 1000 10 8
```

For our three selected cards, `20 / 3` is a repeating decimal. Formatting lets the report show a useful number of digits:

```python
average = 20 / 3
print("{:.2f}".format(average))  # 6.67: two decimal places
print("{:.2e}".format(average))  # 6.67e+00: scientific notation
print("{:.3}".format(average))   # 6.67: three significant digits
print("{:.3f}".format(average))  # 6.667: three decimal places
```

The book's example of `{:.3}` happens to display three digits after the decimal for a value below `1`, but the rule is **three significant digits**. Add `f` when you mean a fixed number of decimal places. See the [current Python format-specification reference](https://docs.python.org/3/library/string.html#format-specification-mini-language).

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Connected Geometry Study Cases

<details>
<summary><strong>Case Study 1: An unselected card is absent from the selection log</strong></summary>

**Scenario:** Card `C` exists in the size table, but the student selected `A`, `B`, and `A`.

```python
log = "A:2x3|B:4x2|A:2x3"
print("C:4x4" in log)       # False
print(log.find("C:4x4"))   # -1
```

`log.index("C:4x4")` would raise `ValueError`. Membership is the simplest check when only presence matters.

</details>

<details>
<summary><strong>Case Study 2: Extra spaces make a card label fail to match</strong></summary>

**Scenario:** The student types `" a "` instead of `"A"`.

```python
raw_label = " a "
print(raw_label == "A")              # False
clean_label = raw_label.strip().upper()
print(clean_label == "A")            # True
print(repr(raw_label))                # ' a '
```

`strip()` removes the outside spaces, `upper()` standardizes the letter, and the original input remains unchanged.

</details>

<details>
<summary><strong>Case Study 3: Turn the selection text into a complete area report</strong></summary>

**Scenario:** Read the three card records, calculate each area, and display the total and average. The input is known to follow the `label:widthxheight` pattern.

```python
raw_log = " A:2x3 | B:4x2 | A:2x3 "
lines = []
total_area = 0

for piece in raw_log.split("|"):
    label, colon, dimensions = piece.strip().partition(":")
    width_text, height_text = dimensions.split("x")
    area = int(width_text) * int(height_text)
    lines.append("{}: {} cm²".format(label, area))
    total_area += area

print(" | ".join(lines))
print("Total: {} cm²".format(total_area))
print("Average: {:.2f} cm²".format(total_area / len(lines)))
```

```text
A: 6 cm² | B: 8 cm² | A: 6 cm²
Total: 20 cm²
Average: 6.67 cm²
```

The `colon` variable receives the separator from `partition`; it is available to check if input validation is later needed. The total comes from numeric multiplication and addition, while `format` and `join` prepare text for display.

</details>

<details>
<summary><strong>Case Study 4: Why a numeric-looking area label is not a number</strong></summary>

**Scenario:** A display uses the text `"6 cm²"`. It describes an area but cannot be multiplied as a number.

```python
area_text = "6 cm²"
print(area_text.endswith("cm²"))  # True
print("6".isdecimal())             # True
print(int("6") * 2)                # 12
```

Keep numeric `area = 6` for calculations. Add `" cm²"` when formatting the result. A Unicode `²` is useful for the label, but it is not part of the integer `6`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Appendix A topic | Plain-language meaning | Rectangle-card use |
| :--- | :--- | :--- |
| **Strings and Unicode** | Store an ordered sequence of text characters. | Keep labels such as `A` and units such as `cm²`. |
| **Substring search** | Check whether text occurs, count it, or find its position. | Find the two `A:2x3` selections. |
| **Constructing strings** | Return cleaned, replaced, case-adjusted, or padded text. | Turn `" a "` into `"A"`; align labels in a report. |
| **Boolean checks** | Ask whether text has a prefix, suffix, or character property. | Recognize an `A:` record or decimal dimension text. |
| **Splitting and joining** | Divide a record into pieces or assemble a report. | Split at bars, colons, and `x`; join area lines. |
| **Formatting** | Place values into text with controlled alignment or precision. | Show `20 / 3` as `6.67 cm²` per card. |

**Full path from text to geometry:** `"A:2x3"` → label `"A"` and dimension strings `"2"`, `"3"` → integers `2`, `3` → area `6` → report text `"A: 6 cm²"`.

[🔝 Back to Top](#top)
