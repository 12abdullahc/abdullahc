<span id="top"></span>

# 1.9 Additional Python Conveniences — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.9, printed pages 42–45 (the supplied PDF).  
> **Topic:** 1.9.1 Conditional Expressions; 1.9.2 Comprehension Syntax; 1.9.3 Packing and Unpacking of Sequences, including simultaneous assignments.  
> **Domain Focus:** Choosing how to describe rectangular cards, collecting their areas, and assigning dimensions clearly.  
> **User Prompt:** Reexplain Section 1.9 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The same cards and choices](#background-cards)
   - [2. Why shorter expressions can help](#background-conveniences)
2. [Part 1: 1.9 Additional Python Conveniences](#part-1)
   - [1. Familiar steps written more directly](#overview)
3. [Part 2: 1.9.1 Conditional Expressions](#part-2)
   - [1. Choose one value with a condition](#conditional-value)
   - [2. Use the chosen value in a calculation or call](#conditional-use)
   - [3. Keep the expression readable](#conditional-readability)
4. [Part 3: 1.9.2 Comprehension Syntax](#part-3)
   - [1. Build a list with a loop and a filter](#list-comprehension)
   - [2. Square areas and factor widths](#squares-factors)
   - [3. List, set, generator, and dictionary forms](#four-forms)
   - [4. Count every physical card; stream a total when possible](#comprehension-choices)
5. [Part 4: 1.9.3 Packing and Unpacking of Sequences](#part-4)
   - [1. Commas pack values into a tuple](#packing)
   - [2. Unpack the expected number of values](#unpacking)
   - [3. Unpack pairs during a loop](#loop-unpacking)
   - [4. Simultaneous assignment and a rectangle rotation](#simultaneous)
   - [5. Update two Fibonacci values from the old pair](#fibonacci-update)
6. [Part 5: One Connected Geometry Program](#part-5)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The same cards and choices

Students cut rectangular cards for a display board. **Area = width × height**, with lengths in centimetres.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The requests `["A", "C", "A"]` mean **three physical cards**, including two A cards. Their areas are `[6, 16, 6]` cm², so the total is `28` cm² and the average is about `9.33` cm². An unknown label `"?"` is skipped.

<span id="background-conveniences"></span>

### 2. Why shorter expressions can help

The previous sections already gave us `if` statements, loops, functions, and generators. Suppose we want to:

1. Choose a description for a card based on its area.
2. Make a list of areas for accepted requests.
3. Receive or exchange a card's width and height.

We can do all three with statements learned earlier. Section 1.9 introduces shorter forms for them. They are useful when the shorter form still makes the geometry rule easy to see.

> **Mental model:** A conditional expression **chooses one value**. A comprehension **builds or streams values from an iterable**. Packing and unpacking **group and name related values**.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.9 Additional Python Conveniences

<span id="overview"></span>

### 1. Familiar steps written more directly

The new syntax in this section does not change the arithmetic. A 2 cm by 3 cm card still has area 6 cm². The conveniences change how we **express** choices, repeated calculations, and assignments.

| Task | Earlier way | Section 1.9 way |
| :--- | :--- | :--- |
| Choose a label for one area | `if` / `else` with assignments | Conditional expression |
| Build accepted areas | Empty list, `for`, `if`, `append` | List comprehension |
| Produce areas for a sum | Build a list first | Generator expression |
| Separate width and height | Read positions `[0]` and `[1]` | Unpack into two names |
| Exchange width and height | Save one in a temporary name | Simultaneous assignment |

The goal is **clearer code**, not the shortest possible line. We will keep using the same three card sizes to see when each form helps.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.9.1 Conditional Expressions

<span id="conditional-value"></span>

### 1. Choose one value with a condition

A conditional expression has this shape:

```text
value_when_true if condition else value_when_false
```

It gives **one result**. For example, our workshop calls a card “large” if its area is at least 10 cm². With an `if` statement, we could write:

```python
area = 16

if area >= 10:
    description = "large"
else:
    description = "small"

print(description)  # large
```

The same choice fits in an expression:

```python
area = 16
description = "large" if area >= 10 else "small"
print(description)  # large
```

Read it as: use `"large"` **if** the area meets the condition; **otherwise** use `"small"`. A's area of 6 cm² would choose `"small"`.

<span id="conditional-use"></span>

### 2. Use the chosen value in a calculation or call

Because it produces a value, a conditional expression can appear directly as a function argument:

```python
area = 16
print("C is a", "large" if area >= 10 else "small", "card")
# C is a large card
```

Only the selected side is evaluated. This lets an expected empty request list avoid division by zero:

```python
total_area = 0
accepted_count = 0

average = total_area / accepted_count if accepted_count > 0 else None
print(average)  # None
```

`None` means there is no average yet. Since the condition is false, Python chooses `None` and does not evaluate `total_area / accepted_count`. This is the same count guard used in earlier guides, written as one expression.

<span id="conditional-readability"></span>

### 3. Keep the expression readable

The book recommends conditional expressions when they make a simple choice easier to read. Put the usual result first and a less common alternative after `else`. In our program, an accepted request is the usual case:

```python
accepted_count = 3
total_area = 28

average = total_area / accepted_count if accepted_count > 0 else None
print(round(average, 2))  # 9.33
```

If the alternatives require several steps or explanations, an ordinary `if` / `else` block is clearer. A conditional expression chooses a **value**; it is not a replacement for every multi-line decision.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.9.2 Comprehension Syntax

<span id="list-comprehension"></span>

### 1. Build a list with a loop and a filter

Suppose the requests are `["A", "C", "?", "A"]`. We want the area of each **known** card. The longer version starts an empty list and appends each accepted result:

```python
areas_by_label = {"A": 6, "B": 8, "C": 16}
requests = ["A", "C", "?", "A"]

areas = []
for label in requests:
    if label in areas_by_label:
        areas.append(areas_by_label[label])

print(areas)  # [6, 16, 6]
```

A **list comprehension** combines the result, loop, and optional filter:

```python
areas_by_label = {"A": 6, "B": 8, "C": 16}
requests = ["A", "C", "?", "A"]

areas = [areas_by_label[label] for label in requests if label in areas_by_label]
print(areas)  # [6, 16, 6]
```

At runtime, Python takes each label, tests `label in areas_by_label`, and only then looks up and appends its area. The result expression is written first in the syntax, but the `for` and optional `if` decide which labels reach it. The unknown `"?"` is omitted, while the second A remains because it is another physical card.

<span id="squares-factors"></span>

### 2. Square areas and factor widths

The book uses square numbers to show a comprehension without a filter. A square tile with side length `side` has area `side * side`:

```python
square_areas = [side * side for side in range(1, 5)]
print(square_areas)  # [1, 4, 9, 16]
```

The factor example from Section 1.8 adds a filter. A positive whole-number width is possible for a 16 cm² rectangle when it divides 16 evenly:

```python
area = 16
widths = [width for width in range(1, area + 1) if area % width == 0]
print(widths)  # [1, 2, 4, 8, 16]
```

For each width, the matching height is `area // width`. For example, width 2 cm gives height 8 cm. Card C itself is 4 cm by 4 cm; the other pairs describe *different* rectangles with the same area.

<span id="four-forms"></span>

### 3. List, set, generator, and dictionary forms

Python uses similar syntax to produce four kinds of results. The following examples use square tiles with side lengths 1–4 cm:

```python
sides = range(1, 5)

area_list = [side * side for side in sides]
area_set = {side * side for side in sides}
area_stream = (side * side for side in sides)
area_by_side = {side: side * side for side in sides}

print(area_list)          # [1, 4, 9, 16]
print(sorted(area_set))   # [1, 4, 9, 16]
print(list(area_stream))  # [1, 4, 9, 16]
print(area_by_side)       # {1: 1, 2: 4, 3: 9, 4: 16}
```

| Form | Result | Use in the workshop |
| :--- | :--- | :--- |
| `[expression for ...]` | List | Keep each area in order, including repeats. |
| `{expression for ...}` | Set | Keep distinct values; order is not the point. |
| `(expression for ...)` | Generator expression | Calculate each value when asked for it. |
| `{key: value for ...}` | Dictionary | Map each side length to its square area. |

The parentheses in the third form make a **generator expression**, like the generator function from Section 1.8. It is consumed by `list(area_stream)` above. The braces in the dictionary form contain a colon between each key and value.

<span id="comprehension-choices"></span>

### 4. Count every physical card; stream a total when possible

A set keeps distinct values; a dictionary keeps one value per distinct key. They are useful for catalog questions, but neither represents the two A **requests** as two physical cards:

```python
requests = ["A", "C", "A"]

print(len(requests))       # 3 physical cards
print(len(set(requests)))  # 2 card types
```

When the program needs only a total, a generator expression can feed `sum` without first making a list:

```python
areas_by_label = {"A": 6, "B": 8, "C": 16}
requests = ["A", "C", "?", "A"]

total_area = sum(areas_by_label[label] for label in requests
                 if label in areas_by_label)
print(total_area)  # 28
```

This follows the book's `sum` example. Use a list comprehension when the individual areas will be needed again; use a generator expression when a consumer such as `sum` can use each result once.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 1.9.3 Packing and Unpacking of Sequences

<span id="packing"></span>

### 1. Commas pack values into a tuple

The dimensions of A belong together. Commas pack them into a **tuple**, even when we omit parentheses:

```python
dimensions = 2, 3

print(dimensions)        # (2, 3)
print(type(dimensions))  # <class 'tuple'>
```

A function can return two values with the same syntax. It formally returns **one tuple** containing both values:

```python
def card_dimensions(label):
    sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
    width, height = sizes[label]
    return width, height

result = card_dimensions("A")
print(result)        # (2, 3)
print(type(result))  # <class 'tuple'>
```

Parentheses are often written for clarity, but the comma is what groups these values here.

<span id="unpacking"></span>

### 2. Unpack the expected number of values

**Unpacking** assigns the elements of an iterable to separate names:

```python
dimensions = (2, 3)
width, height = dimensions

print(width)   # 2
print(height)  # 3
print(width * height)  # 6
```

The right side need not be a tuple; for example, `width, height = range(2, 4)` also assigns 2 and 3. The number of supplied elements must match the number of target names. If only one measurement is present, `width, height = [2]` raises `ValueError`.

The built-in `divmod` returns a quotient and a remainder as a tuple. A 28 cm² display laid out with width 4 cm needs height 7 cm and leaves no area over:

```python
total_area = 28
display_width = 4

display_height, remainder = divmod(total_area, display_width)
print(display_height, remainder)  # 7 0
```

Because the remainder is zero, `4 × 7` is a whole-number rectangle with area 28 cm².

<span id="loop-unpacking"></span>

### 3. Unpack pairs during a loop

A loop can unpack one pair on each pass:

```python
rectangles = [(2, 3), (4, 2), (4, 4)]

for width, height in rectangles:
    print(width * height)

# 6
# 8
# 16
```

A dictionary's `items()` method supplies `(key, value)` pairs. For the card catalog, the key is a label and the value is a pair of dimensions:

```python
sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}

for label, dimensions in sizes.items():
    width, height = dimensions
    print(label, width * height)

# A 6
# B 8
# C 16
```

Each loop pass gives a meaningful name to each part. The same idea appears in `for label, area in records:` in the connected program below.

<span id="simultaneous"></span>

### 4. Simultaneous assignment and a rectangle rotation

In `width, height = 4, 2`, Python evaluates the right-hand values before assigning them to the names on the left. We can therefore swap the measurements without losing either original value:

```python
width, height = 4, 2
print(width, height, width * height)  # 4 2 8

width, height = height, width
print(width, height, width * height)  # 2 4 8
```

The first B orientation is 4 cm by 2 cm. After a quarter-turn it is 2 cm by 4 cm, still 8 cm². If we assigned `width = height` first and then `height = width`, the original width would already be lost; simultaneous assignment uses the old right-hand values for both targets.

<span id="fibonacci-update"></span>

### 5. Update two Fibonacci values from the old pair

Section 1.8 used Fibonacci numbers for an endless sequence. The book returns to that generator here because simultaneous assignment replaces a temporary variable:

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

values = fibonacci()
for _ in range(7):
    print(next(values), end=" ")
print()

# 0 1 1 2 3 5 8
```

For example, if the old pair is `a = 2` and `b = 3`, then `a, b = b, a + b` produces the new pair `3, 5`. The expression `a + b` uses the **old** values. Positive Fibonacci terms can suggest side lengths for future square tiles; the initial zero is a sequence term, not a physical tile.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

The program combines the section's three conveniences. A comprehension keeps each accepted request, pair unpacking gives names to dimensions and records, a generator expression adds areas, and a conditional expression handles the average. Finally, `divmod` and a simultaneous swap show two orientations of a 28 cm² display rectangle.

```python
CARD_SIZES = {
    "A": (2, 3),
    "B": (4, 2),
    "C": (4, 4),
}

def card_area(label):
    width, height = CARD_SIZES[label]
    return width * height

requests = ["A", "C", "?", "A"]
records = [(label, card_area(label)) for label in requests
           if label in CARD_SIZES]

for label, area in records:
    print(label, "area:", area, "cm²")

accepted_count = len(records)
total_area = sum(area for label, area in records)
average = round(total_area / accepted_count, 2) if accepted_count > 0 else None
average_text = f"{average} cm²" if average is not None else "(none)"

print("Skipped unknown requests:", len(requests) - accepted_count)
print("Accepted cards:", accepted_count)
print("Total area:", total_area, "cm²")
print("Average area:", average_text)

if accepted_count > 0:
    display_width = 4
    display_height, remainder = divmod(total_area, display_width)
    if remainder == 0:
        print("Display:", display_width, "cm ×", display_height, "cm")
        display_width, display_height = display_height, display_width
        print("Rotated display:", display_width, "cm ×", display_height, "cm")

# A area: 6 cm²
# C area: 16 cm²
# A area: 6 cm²
# Skipped unknown requests: 1
# Accepted cards: 3
# Total area: 28 cm²
# Average area: 9.33 cm²
# Display: 4 cm × 7 cm
# Rotated display: 7 cm × 4 cm
```

`records` keeps both A requests, so the count is 3 and the total is 28 cm². The generator expression inside `sum` visits their three area values without constructing another list. `divmod(28, 4)` gives height 7 and remainder 0; swapping width and height rotates that display rectangle while preserving its area.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: no accepted cards means no average</strong></summary>

**Scenario.** The only request is the unknown label `"?"`.

```python
areas = {"A": 6, "B": 8, "C": 16}
requests = ["?"]
accepted = [areas[label] for label in requests if label in areas]

average = sum(accepted) / len(accepted) if accepted else None
print(accepted)  # []
print(average)   # None
```

**Check.** The conditional expression selects `None`. It does not attempt division by zero.

</details>

<details>
<summary><strong>Case Study 2: a set loses a repeated physical card</strong></summary>

**Scenario.** A, C, and A are three cards, but only two distinct labels.

```python
areas = {"A": 6, "B": 8, "C": 16}
requests = ["A", "C", "A"]

area_list = [areas[label] for label in requests]
unique_labels = {label for label in requests}

print(area_list, sum(area_list))  # [6, 16, 6] 28
print(len(unique_labels))        # 2
```

**Check.** Use the list of requests or areas for physical-card counts and totals. A set answers “which card *types* appeared?”

</details>

<details>
<summary><strong>Case Study 3: factor widths for the total display area</strong></summary>

**Scenario.** A single rectangle has the same 28 cm² area as the three requested cards.

```python
total_area = 28
widths = [width for width in range(1, total_area + 1)
          if total_area % width == 0]

print(widths)  # [1, 2, 4, 7, 14, 28]
for width in widths:
    print(width, "by", total_area // width)
```

**Check.** Every reported pair multiplies to 28. The filter excludes widths that would leave a fractional height.

</details>

<details>
<summary><strong>Case Study 4: unpacking requires the expected number of measurements</strong></summary>

**Scenario.** A card record contains only one side length.

```python
measurements = [2]

try:
    width, height = measurements
except ValueError:
    print("A card needs exactly two measurements.")
```

**Check.** Two target names need two supplied elements. The same rule applies when unpacking a tuple returned by a function or a pair from a loop.

</details>

<details>
<summary><strong>Case Study 5: swap an orientation without changing area</strong></summary>

**Scenario.** B is placed horizontally, then turned so its longer side is vertical.

```python
width, height = 4, 2
area_before = width * height

width, height = height, width
area_after = width * height

print(width, height)                 # 2 4
print(area_before == area_after)     # True
```

**Check.** Both right-hand expressions are evaluated using the old dimensions before either target changes. Rotation preserves the 8 cm² area.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 1.9 idea | What it means | Rectangle-card example |
| :--- | :--- | :--- |
| Conditional expression | Choose one value with `true_result if condition else false_result`. | Call a 16 cm² card “large.” |
| Selected branch only | Evaluate only the chosen result expression. | Use `None` for an average when no card was accepted. |
| List comprehension | Build an ordered list, optionally filtering entries. | `["A", "C", "?", "A"]` gives areas `[6, 16, 6]`. |
| Set comprehension | Keep distinct results without a meaningful order. | Record that card types A and C appeared, but do not count physical cards with it. |
| Generator expression | Produce values as a consumer asks for them. | `sum(area for ...)` totals accepted card areas without another list. |
| Dictionary comprehension | Map keys to computed values. | Map square side lengths to their areas. |
| Packing | Commas group values into one tuple. | `dimensions = 2, 3` holds A's two measurements. |
| Unpacking | Give separate names to the elements of an iterable. | `width, height = (2, 3)`; `height, remainder = divmod(28, 4)`. |
| Loop unpacking | Assign each part of a pair on every pass. | `for label, area in records:` reads each accepted card. |
| Simultaneous assignment | Evaluate the right side before assigning the left side. | `width, height = height, width` turns B while preserving area. |
| Fibonacci update | Use old values to make the next pair. | `a, b = b, a + b` produces the next possible square-tile size. |

[🔝 Back to Top](#top)
