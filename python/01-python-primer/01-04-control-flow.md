<span id="top"></span>

# 1.4 Control Flow — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.4, printed pages 18–22 (the supplied PDF).  
> **Topic:** 1.4 Control Flow; 1.4.1 Conditionals; 1.4.2 Loops, including while loops, for loops, index-based for loops, and break/continue.  
> **Domain Focus:** The rectangular cards from Sections 1.1–1.3: deciding which cards to accept, totaling their areas, and locating a card in a sequence.  
> **User Prompt:** Reexplain Section 1.4 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The same three card sizes](#background-cards)
   - [2. Why calculations need decisions and repetition](#background-flow)
2. [Part 1: 1.4 Control Flow](#part-1)
   - [1. A colon begins a control structure's body](#blocks)
   - [2. Indentation determines what runs together](#indentation)
3. [Part 2: 1.4.1 Conditionals](#part-2)
   - [1. Run a block only when a condition is true](#if)
   - [2. Choose among several outcomes with elif and else](#elif)
   - [3. Test whether a value is present](#truthiness)
   - [4. Put one decision inside another](#nested)
4. [Part 3: 1.4.2 Loops](#part-3)
   - [1. Repeat while a condition stays true](#while)
   - [2. Search safely with a while loop](#while-search)
   - [3. Visit each element with a for loop](#for)
   - [4. Use for loops to total and compare areas](#for-areas)
   - [5. Understand the loop variable](#loop-variable)
   - [6. Visit indices with range(len(...))](#index-for)
   - [7. Stop or skip with break and continue](#break-continue)
5. [Part 4: One Connected Geometry Program](#part-4)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The same three card sizes

Imagine students choosing rectangular cards for a display board. Width and height are measured in centimetres. **Area = width × height.**

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The choices `["A", "C", "A"]` mean three **physical cards**: two copies of A and one of C. Their areas add to **6 + 16 + 6 = 28 cm²**. There are only two *different labels*, but the running total must count both A cards.

<span id="background-flow"></span>

### 2. Why calculations need decisions and repetition

One multiplication computes one card's area. A workshop program also needs to answer:

| Workshop question | Python control flow |
| :--- | :--- |
| Is this a known label? | An `if` statement decides whether to accept it. |
| Is the area small, medium, or large? | An `if`–`elif`–`else` chain chooses a category. |
| How do we process every requested card? | A `for` loop visits each choice. |
| Where is the first C card? | A `while` loop searches until a match or the end. |
| Should we skip an invalid choice or stop searching? | `continue` skips one pass; `break` exits a loop. |

**Control flow** means the order in which the program's instructions run. A conditional chooses a path; a loop repeats a path. The examples below keep the geometry fixed so we can see the effect of each control structure.

> **Mental model:** Ask whether the next step is a decision, a repetition, or an instruction that should always run.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.4 Control Flow

<span id="blocks"></span>

### 1. A colon begins a control structure's body

In Python, the header of an `if`, `while`, or `for` statement ends in a **colon** (`:`). The indented lines beneath it are its **body**: the instructions governed by that header.

```python
area = 2 * 3  # A has area 6 cm²

if area < 8:
    print("A is a small card")
```

The comparison `area < 8` is `True`, so the indented `print` runs. Python technically allows a one-statement body after the colon on the same line, but an indented block is easier to read and works when the body grows.

<span id="indentation"></span>

### 2. Indentation determines what runs together

Python uses indentation to decide where a block ends. An instruction aligned with the `if` header is **outside** its body and runs after the decision.

```python
area = 16  # C

if area < 8:
    print("small card")
print("classification checked")
```

Here `"small card"` is not printed, because the condition is false. `"classification checked"` **is** printed, because that line is not indented inside the `if`. The same indentation rule controls nested blocks and, later in the book, the bodies of functions and classes.

| Line | Runs when? |
| :--- | :--- |
| `if area < 8:` | The condition is tested when execution reaches it. |
| Indented `print("small card")` | Only if the test is true. |
| Unindented `print("classification checked")` | After the `if`, regardless of its result. |

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.4.1 Conditionals

<span id="if"></span>

### 1. Run a block only when a condition is true

An `if` statement evaluates a condition at run time. If it is true, Python enters the indented body. If it is false, Python skips that body.

```python
card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
label = "A"

if label in card_sizes:
    width, height = card_sizes[label]
    print(width * height)  # 6
```

The membership test matters: looking up an unknown label in the dictionary would fail. Here the `if` ensures that the dimensions are read only for a known card.

<span id="elif"></span>

### 2. Choose among several outcomes with elif and else

Use `elif` (short for "else if") when the next test should happen **only if earlier tests failed**. The optional `else` handles every remaining case.

```python
area = 4 * 4  # C: 16 cm²

if area >= 12:
    category = "large"
elif area >= 8:
    category = "medium"
else:
    category = "small"

print(category)  # large
```

Python checks the branches from top to bottom. As soon as one condition is true, its body runs and the rest of the chain is skipped. For C, `area >= 12` is true, so Python never tests `area >= 8`. With a final `else`, **exactly one** body runs. Without `else`, it is possible for **none** to run. A chain may contain zero, one, or many `elif` clauses.

The order of the thresholds matters. If `area >= 8` came first, C would be called medium before Python reached the large-card test.

<span id="truthiness"></span>

### 3. Test whether a value is present

A condition does not have to be written as an explicit comparison. Python treats an empty string as false and a nonempty string as true.

```python
response = ""

if response:
    print("A label was entered")
else:
    print("No label was entered")
```

This prints `No label was entered`. For a string, `if response:` checks the same empty-versus-nonempty distinction as `if response != "":`. An empty list is also false, which will help us avoid dividing by zero when no cards were accepted.

**Present is not the same as valid.** A nonempty response such as `"Z"` passes `if response:` but is not a known card; use `if response in card_sizes:` to check that.

<span id="nested"></span>

### 4. Put one decision inside another

Indent a second `if` inside the first when the second question only makes sense after the first succeeds. This parallels the book's robot example: first check whether a door is closed, then whether that closed door is locked.

```python
card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
label = "A"
frame_width = 3
frame_height = 3

if label in card_sizes:
    width, height = card_sizes[label]
    if width <= frame_width and height <= frame_height:
        print("Place the card in the frame")
    print("Known card checked")
print("Request finished")
```

A is known and fits the 3 cm × 3 cm frame, so all three messages print. For C, the placement message is skipped but `"Known card checked"` and `"Request finished"` still print. For an unknown label, only `"Request finished"` prints. Each level of indentation tells us which decision controls a line.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.4.2 Loops

Python has two main loop forms in this section. A **`while` loop** repeats according to a condition that is checked again and again. A **`for` loop** visits values supplied by an iterable collection.

<span id="while"></span>

### 1. Repeat while a condition stays true

A `while` loop tests its condition **before** every pass. It runs the body, tests again, and leaves the loop when the test becomes false.

```python
choices = ["A", "C", "A"]
index = 0

while index < len(choices):
    print(index, choices[index])
    index += 1
```

The output is `0 A`, `1 C`, `2 A` on separate lines. The index starts at 0 and increases in the body. Once it reaches 3, `index < len(choices)` is false. If `choices` were empty, the body would run **zero** times. If we forgot `index += 1` here, the condition would stay true and the loop would never finish.

<span id="while-search"></span>

### 2. Search safely with a while loop

The book uses a `while` loop to find the first occurrence of a target in a sequence. For our cards, look for the first C:

```python
choices = ["A", "C", "A"]
target = "C"
index = 0

while index < len(choices) and choices[index] != target:
    index += 1

if index < len(choices):
    print("First C at index", index)  # 1
else:
    print("No C found")
```

The **order** of the two conditions protects the lookup. Python evaluates `and` from left to right. If `index < len(choices)` is false, it does **not** evaluate `choices[index]`, avoiding an out-of-range index. This is called **short-circuiting**.

| `choices` | Final `index` | Meaning |
| :--- | ---: | :--- |
| `["A", "C", "A"]` | 1 | First C is at index 1. |
| `["A", "B"]` | 2 | No C; index equals `len(choices)`. |
| `[]` | 0 | Empty list; body never runs, and index equals its length. |

The first match is returned because the loop stops as soon as the target is found. Reversing the tests would eventually try `choices[index]` after the index reached the end.

<span id="for"></span>

### 3. Visit each element with a for loop

When we already have a collection of choices, `for` gives us each element directly:

```python
choices = ["A", "C", "A"]

for label in choices:
    print(label)
```

The body runs three times, with `label` set to A, then C, then A. We do not need to create or update an index. A `for` loop works with any **iterable**, including lists, tuples, strings, sets, dictionaries, and files. A dictionary yields its keys in a direct `for` loop; a set has no numeric indexing and should not be used when the visit order matters.

<span id="for-areas"></span>

### 4. Use for loops to total and compare areas

The book illustrates a running sum and a search for the greatest value. Here the values are card areas:

```python
areas = [6, 16, 6]
total_area = 0

for area in areas:
    total_area += area

biggest_area = areas[0]  # Requires a nonempty list.
for area in areas:
    if area > biggest_area:
        biggest_area = area

print(total_area)    # 28
print(biggest_area)  # 16
```

The sum starts at zero because adding zero changes nothing. The maximum starts with the **first actual area** so it also works when every area is negative in a different problem. The maximum code requires at least one element; `areas[0]` is invalid for an empty list. Python's built-in `sum` and `max` can do these jobs, but writing the loops exposes how the running result changes.

<span id="loop-variable"></span>

### 5. Understand the loop variable

On each pass, `for` assigns the next element to the loop variable. Reassigning that name does **not** replace the corresponding element in the original list:

```python
areas = [6, 16, 6]

for area in areas:
    area = 0

print(areas)  # [6, 16, 6]
```

The name `area` now refers to a different integer, but the list still contains its original integers. By contrast, if an element itself is a mutable list, a method call through the loop variable can change that element:

```python
card_groups = [["A"], ["C"]]

for group in card_groups:
    group.append("A")

print(card_groups)  # [['A', 'A'], ['C', 'A']]
```

This distinction connects to Section 1.2: **rebinding a name** and **mutating an object** are different actions.

<span id="index-for"></span>

### 6. Visit indices with range(len(...))

An element-based loop gives us each value, but sometimes we need its **position**. `range(n)` supplies the integers `0` through `n - 1`, so `range(len(areas))` supplies every valid list index.

```python
areas = [6, 16, 8, 16]
big_index = 0  # Requires a nonempty list.

for index in range(len(areas)):
    if areas[index] > areas[big_index]:
        big_index = index

print(big_index)         # 1
print(areas[big_index])  # 16
```

The maximum area appears at indices 1 and 3. Because the update uses `>` rather than `>=`, the first maximum stays selected. Here `index` is a number, not an area; `areas[index]` retrieves the area. As with the earlier maximum example, guard or handle an empty list before starting with index 0.

<span id="break-continue"></span>

### 7. Stop or skip with break and continue

`break` ends the **nearest enclosing loop** immediately. `continue` ends only the **current pass** and proceeds with the next pass if one exists.

```python
card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
requests = ["A", "?", "C", "A"]

for label in requests:
    if label not in card_sizes:
        continue  # Skip the unknown label, then try the next request.
    print("Accepted", label)
```

This prints `Accepted A`, `Accepted C`, `Accepted A`. The unknown label skips the rest of its pass but does not stop the loop.

```python
requests = ["A", "?", "C", "A"]
target = "C"
found = False

for label in requests:
    if label == target:
        found = True
        break  # The later A is not examined.

print(found)  # True
```

The book advises using `break` and `continue` sparingly: they are useful when they make an exit or skip clear, but too many can make a loop harder to follow. In a `while` loop, be especially careful that `continue` does not skip the update needed to reach its stopping condition.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This program combines the section's ideas. It accepts known labels, skips an unknown request, classifies each accepted card by area, totals the **physical cards**, finds the largest accepted card, and searches for the first C. The `if accepted_labels:` guard handles the possibility that no valid cards were chosen.

```python
card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
requests = ["A", "C", "?", "A"]
accepted_labels = []
areas = []
total_area = 0

for label in requests:
    if label not in card_sizes:
        print("Skip unknown label:", label)
        continue

    width, height = card_sizes[label]
    area = width * height
    accepted_labels.append(label)
    areas.append(area)
    total_area += area

    if area >= 12:
        category = "large"
    elif area >= 8:
        category = "medium"
    else:
        category = "small"
    print(f"{label}: {area} cm², {category}")

if accepted_labels:
    largest_index = 0
    for index in range(len(areas)):
        if areas[index] > areas[largest_index]:
            largest_index = index

    target = "C"
    first_index = 0
    while (first_index < len(accepted_labels)
           and accepted_labels[first_index] != target):
        first_index += 1

    print("Accepted cards:", len(accepted_labels))
    print("Total area:", total_area, "cm²")
    print("Average area:", round(total_area / len(accepted_labels), 2), "cm²")
    print("Largest card:", accepted_labels[largest_index],
          "at position", largest_index + 1)
    if first_index < len(accepted_labels):
        print("First C at position", first_index + 1)
    else:
        print("No C card was accepted")
else:
    print("No known cards were accepted")
```

**Trace the requests in order:**

| Request | Decision | Accepted count | Running area |
| :--- | :--- | ---: | ---: |
| First `A` | Accept; 6 cm² is small. | 1 | 6 cm² |
| `C` | Accept; 16 cm² is large. | 2 | 22 cm² |
| `?` | Unknown; `continue` skips it. | 2 | 22 cm² |
| Second `A` | Accept another physical card. | 3 | 28 cm² |

The program reports **3 accepted cards**, **28 cm² total**, and **9.33 cm² average**. C is both the largest card and the first C, at **position 2** in the accepted sequence. Python list indices start at 0, so the printed position adds 1. If `requests` were empty or all labels were unknown, the final `else` would run instead of dividing by zero or reading an invalid index.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: A large card gets the wrong category</strong></summary>

**Scenario.** C has area 16 cm². A student tests `area >= 8` before `area >= 12`:

```python
area = 16
if area >= 8:
    category = "medium"
elif area >= 12:
    category = "large"
print(category)  # medium
```

**Why?** The first true branch wins; `elif` is never checked. Test the stricter threshold first:

```python
area = 16
if area >= 12:
    category = "large"
elif area >= 8:
    category = "medium"
else:
    category = "small"
print(category)  # large
```

</details>

<details>
<summary><strong>Case Study 2: A search reaches the end safely</strong></summary>

**Scenario.** Neither an empty selection nor `["A", "B"]` contains C. The guard must appear before the list lookup.

```python
for choices in ([], ["A", "B"], ["A", "C", "A"]):
    index = 0
    while index < len(choices) and choices[index] != "C":
        index += 1
    print(index, index < len(choices))

# 0 False
# 2 False
# 1 True
```

**Check.** A final index equal to `len(choices)` means "not found." With an empty list, the first test fails immediately, so `choices[0]` is never evaluated.

</details>

<details>
<summary><strong>Case Study 3: Two cards share the largest area</strong></summary>

**Scenario.** The accepted choices are `["A", "C", "B", "C"]`, so the areas are `[6, 16, 8, 16]`.

```python
choices = ["A", "C", "B", "C"]
areas = [6, 16, 8, 16]
largest_index = 0

for index in range(len(areas)):
    if areas[index] > areas[largest_index]:
        largest_index = index

print(choices[largest_index], largest_index)  # C 1
```

**Check.** Strict `>` keeps the first C as the maximum. Change the test to `>=` and the later C at index 3 replaces it. Either maximum area is 16 cm²; the tie rule decides which position is reported.

</details>

<details>
<summary><strong>Case Study 4: Skipping a card differs from stopping the scan</strong></summary>

**Scenario.** A label `"?"` should be ignored, while finding C should stop a search.

```python
requests = ["A", "?", "C", "A"]
valid = {"A", "B", "C"}

for label in requests:
    if label not in valid:
        continue
    print("Use", label)

for label in requests:
    if label == "C":
        print("Found C")
        break
    print("Checked", label)
```

**Check.** The first loop uses A, C, and A because `continue` skips only `?`. The second checks A and `?`, then finds C; `break` prevents it from checking the final A.

</details>

<details>
<summary><strong>Case Study 5: A break in nested loops stops only one loop</strong></summary>

**Scenario.** Two display-board rows contain card labels. Stop scanning a row at its first B, but still inspect the next row.

```python
rows = [["A", "B", "C"], ["C", "A"]]

for row in rows:
    for label in row:
        if label == "B":
            break
        print(label)

# A
# C
# A
```

**Check.** The `break` exits only the inner `for label in row` loop. The outer loop proceeds to the second row. C after B in the first row is never printed.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Construct | Workshop question | Key detail |
| :--- | :--- | :--- |
| Indented block after `:` | Which instructions belong to this decision or loop? | Dedenting ends the body. |
| `if` / `elif` / `else` | Which one category fits this card? | Test in order; only the first true branch runs. |
| Nested `if` | Does a known card also fit the frame? | The inner test runs only when its outer path runs. |
| `while` | Have we found C or reached the end? | Retest the condition; make progress toward stopping. |
| `for element in iterable` | What happens for each chosen card? | The loop variable receives each element. |
| `for index in range(len(data))` | At what position is the largest card? | Index is a position, not the element itself. |
| `break` / `continue` | Stop this search or skip this choice? | Stop the loop / skip one pass. |

[🔝 Back to Top](#top)
