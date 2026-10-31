<span id="top"></span>

# 5.1 Python's Sequence Types — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.1, printed page 184 (the supplied PDF).<br>
> **Topic:** 5.1 Python's Sequence Types; Public Behaviors; Implementation Details; Asymptotic and Experimental Analyses.<br>
> **Domain Focus:** Four rectangular display cards arranged in two rows; their dimensions, areas, and total area.<br>
> **User Prompt:** Reexplain [`Section 5.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Board](#background)
   - [1. One geometry activity, several kinds of data](#background-cards)
   - [2. Why positions matter](#background-positions)
2. [Part 1: 5.1 Python's Sequence Types](#part-1)
   - [1. The three built-in sequence types](#part-1-types)
   - [2. A shared operation does not mean identical behavior](#part-1-differences)
3. [Part 2: Public Behaviors](#part-2)
   - [1. Read a position or a slice](#part-2-index-slice)
   - [2. Tell an alias from a copy](#part-2-copy)
   - [3. Understand a list of lists](#part-2-grid)
4. [Part 3: Implementation Details](#part-3)
   - [1. Use the public interface correctly](#part-3-interface)
   - [2. Look inside when efficiency matters](#part-3-efficiency)
5. [Part 4: Asymptotic and Experimental Analyses](#part-4)
   - [1. Predict growth as the board gets larger](#part-4-growth)
   - [2. Measure a run and interpret it carefully](#part-4-experiment)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace its result](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Board

<span id="background-cards"></span>

### 1. One geometry activity, several kinds of data

Continue the rectangle-card activity from the [Section 1.1 study guide](../01-python-primer/01-01-overview.md). Cards `A`, `B`, and `C` keep their original dimensions; we add card `D`. The four cards are placed on a display board: `A` and `B` in the top row, then `C` and `D` in the bottom row. Each card's **area = width × height**.

| Card | Board position | Width | Height | Area |
| :--- | :------------- | ----: | -----: | ---: |
| `A` | Top left       | 2 cm | 3 cm | 6 cm² |
| `B` | Top right      | 4 cm | 2 cm | 8 cm² |
| `C` | Bottom left    | 4 cm | 4 cm | 16 cm² |
| `D` | Bottom right   | 2 cm | 2 cm | 4 cm² |

The sum of the four card areas is **6 + 8 + 16 + 4 = 34 cm²**. This is the total area of the *cards*, not necessarily the area of a solid rectangular board: gaps or overlaps would need separate geometry rules.

We can describe the activity with three related Python values:

```python
labels = "ABCD"                                  # a string
dimensions = [(2, 3), (4, 2), (4, 4), (2, 2)]  # a list of tuples
areas = [6, 8, 16, 4]                           # a list
```

The string gives the card labels in order. Each tuple keeps one card's width and height together. The lists keep an ordered collection of measurements. Numbers in the code have no built-in units; **we** interpret the dimensions as centimetres and the areas as square centimetres.

<span id="background-positions"></span>

### 2. Why positions matter

A **sequence** is a collection whose elements have an order. Python starts counting positions at **0**, so the four positions are `0`, `1`, `2`, and `3`.

| Position `k` | `labels[k]` | `dimensions[k]` | `areas[k]` |
| ----------: | :---------- | :-------------- | ---------: |
| `0` | `"A"` | `(2, 3)` | `6` |
| `1` | `"B"` | `(4, 2)` | `8` |
| `2` | `"C"` | `(4, 4)` | `16` |
| `3` | `"D"` | `(2, 2)` | `4` |

For example, position `2` connects card `C` with `(4, 4)` and area `4 × 4 = 16 cm²`. These three sequences must stay in the same order; otherwise a label could point to another card's measurements. The notation `seq[k]` means “give me the element at position `k` of sequence `seq`.”

This small board supplies the same data for every part below. Section 5.1 itself is a **roadmap** for the chapter. The geometry data, Python snippets, and worked operation costs in this guide are added explanations, not examples or complexity claims printed in Section 5.1.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 5.1 Python's Sequence Types

The section opens with three common Python sequence classes: **`list`, `tuple`, and `str`**. All support indexed access such as `seq[k]`. All have an array-based representation at a low level, yet they offer different public behavior and use different internal representations. They are common building blocks for later data structures, so the chapter studies both what users can do with them and why their operations have particular costs.

<span id="part-1-types"></span>

### 1. The three sequence types studied here

| Type | Card-board example | What the positions contain | Can an element be replaced? |
| :--- | :----------------- | :------------------------- | :--------------------------- |
| `list` | `areas = [6, 8, 16, 4]` | Area numbers | Yes; a list is mutable. |
| `tuple` | `dimensions[0]` gives `(2, 3)` | A width and a height | No; a tuple is immutable. |
| `str` | `labels = "ABCD"` | Characters | No; a string is immutable. |

**Mutable** means an existing object can be changed. For example, `areas[0] = 7` legally replaces one list element, although `7` is not the area of the stated 2 cm × 3 cm card. A real measurement change would require updating the dimensions and recomputing the area. In contrast, `dimensions[0][0] = 7` attempts to alter the tuple `(2, 3)` and raises `TypeError`. We could replace the **whole tuple** at `dimensions[0]`, because the outer `dimensions` object is a list. The string also does not allow `labels[0] = "Z"`; we would create a new string instead.

Those mutability rules are useful background for the chapter's roadmap. Section 5.1 names the three classes but leaves their detailed operations to later discussion.

<span id="part-1-differences"></span>

### 2. A shared operation does not mean identical behavior

The expression `seq[0]` works with each sequence, but it returns different kinds of elements here:

```python
labels[0]      # "A": one character
dimensions[0]  # (2, 3): one tuple
areas[0]       # 6: one area number
```

Think of **public behavior** as the operations and results a programmer can observe. Think of **internal representation** as how Python stores and manages the values to produce those results. Shared indexing does not imply that lists, tuples, and strings have the same rules for changes, copies, or storage.

> **Mental model:** The position `k` connects corresponding data, but each sequence type decides what operations are allowed on its own elements.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Public Behaviors

The book stresses **precise outward behavior**, especially copies and slices. A mistaken assumption can produce a bug even when every line of Python runs. It points to a list of lists as an example where a good mental model becomes especially valuable.

<span id="part-2-index-slice"></span>

### 1. Read a position or a slice

An **index** selects one position. A **slice** selects a range. In `seq[start:stop]`, the `start` position is included and the `stop` position is excluded:

```python
areas[2]     # 16: card C's area
areas[0:2]   # [6, 8]: cards A and B
labels[0:2]  # "AB": their labels
dimensions[2:4]  # [(4, 4), (2, 2)]: cards C and D
```

Thus `sum(areas[0:2])` is **6 + 8 = 14 cm²**, the top row's total card area. A list slice makes a new outer list; a string slice returns a string. The same notation is convenient, but we must still know what the operation actually returns.

<span id="part-2-copy"></span>

### 2. Tell an alias from a copy

Two names can refer to **the same list**. Assigning a list to another name does not copy it:

```python
areas = [6, 8, 16, 4]
same_areas = areas
same_areas[0] = 7
print(areas)  # [7, 8, 16, 4]
```

Here `same_areas` is an **alias** for `areas`. Changing either name's list changes what both names see. For a separate list of these numbers, slice the whole list:

```python
areas = [6, 8, 16, 4]
copied_areas = areas[:]
copied_areas[0] = 7
print(areas)         # [6, 8, 16, 4]
print(copied_areas)  # [7, 8, 16, 4]
```

This works for our flat list of numbers. The original card `A` still has area `6 cm²`; the changed value `7` exists only in the study copy.

<span id="part-2-grid"></span>

### 3. Understand a list of lists

Arrange the four areas as a two-dimensional table. The **outer list** contains rows; each **inner list** contains the left and right card areas in that row:

```python
grid = [[6, 8], [16, 4]]
grid[0]     # [6, 8]: top row
grid[1][0]  # 16: bottom row, left card C
```

Now a whole-list slice makes a new *outer* list, but it does not create new inner rows:

```python
grid = [[6, 8], [16, 4]]
outer_copy = grid[:]
outer_copy[0][0] = 99
print(grid[0][0])  # 99: the original top row changed too
```

The `99` is a deliberately incorrect area that exposes the copying bug. `outer_copy[0]` and `grid[0]` still refer to the same inner list. If we want independent rows for this table of numbers, copy each row as well:

```python
grid = [[6, 8], [16, 4]]
independent_rows = [row[:] for row in grid]
independent_rows[0][0] = 99
print(grid[0][0])  # 6: the original stays correct
```

The last expression is a **list comprehension**: it makes a new list from a slice of each row. It copies both levels used in this simple table. If rows contained further mutable objects, those deeper objects would need separate attention.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Implementation Details

Section 5.1 recalls **encapsulation** from Section 2.1.2: a class presents a public interface, while its implementation can be hidden. Knowing the interface is enough to use a class **correctly**. Understanding how an operation is carried out helps us judge whether using it repeatedly will be **efficient**.

<span id="part-3-interface"></span>

### 1. Use the public interface correctly

To calculate card `C`'s area, we only need the public indexing rules and the rectangle formula:

```python
width, height = dimensions[2]
area_c = width * height  # 4 * 4 = 16
```

We do not need to know Python's memory layout to see that this is legal and produces `16`. Likewise, knowing that `grid[:]` shares inner rows is a **public behavior** we must account for when making a working copy.

<span id="part-3-efficiency"></span>

### 2. Look inside when efficiency matters

Suppose the board grows from four cards to thousands. Then we might repeat indexing, slicing, or copying many times. The time and memory used by the complete program depend on the cost of those component operations. Internal design helps explain those costs.

| Question | What we need to understand |
| :------- | :------------------------- |
| “Will `dimensions[2]` give card `C`?” | The public indexing rule and our ordering of cards. |
| “Will `grid[:]` protect the original inner rows?” | The public copying behavior of a nested list. |
| “How will repeated slices or copies affect a much larger board?” | The work done by those operations, analyzed in later sections. |

The section does **not** give a memory diagram or an operation-by-operation cost table. It explains why the chapter will study such details even though a user can often write correct code from the public interface alone.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Asymptotic and Experimental Analyses

The section says the chapter will use two complementary methods: **asymptotic analysis** from Chapter 3 to describe how operation costs grow, and **experiments** to observe actual performance. It gives no specific complexity bound in Section 5.1. The following board calculation is a small illustration of the method.

<span id="part-4-growth"></span>

### 1. Predict growth as the board gets larger

Let `n` be the number of cards. To total all their areas with a straightforward loop, we add each area once:

```python
total = 0
for area in areas:
    total += area
```

| Number of cards `n` | Additions in this loop |
| ------------------: | ---------------------: |
| `4` | `4` |
| `8` | `8` |
| `16` | `16` |

This simple loop performs `n` additions, so its work grows **linearly**, written **O(n)**. For our four-card board it gives `6 + 8 + 16 + 4 = 34 cm²`. The O(n) statement describes this illustrated loop, **not** a bound stated by the book in Section 5.1. It tells us about growth as `n` increases, not the exact number of seconds on a particular computer.

<span id="part-4-experiment"></span>

### 2. Measure a run and interpret it carefully

We can also time an operation on lists made by repeating the same four-card area pattern. This is a small **experimental analysis**:

```python
from timeit import timeit

def total_area(values):
    total = 0
    for area in values:
        total += area
    return total

for n in (100, 1_000, 10_000):
    larger_areas = [6, 8, 16, 4] * (n // 4)
    seconds = timeit(lambda: total_area(larger_areas), number=1_000)
    print(n, seconds)
```

The function uses the same loop analyzed above. The code reports the time for **1,000 totals** at each size; the exact seconds will vary by computer and run. The repeated pattern keeps the geometry data connected to our board, while `n` changes the amount of data. A measured trend can support a growth prediction, but a few measurements alone do not prove an asymptotic bound. Timing also includes costs such as calling the function, so compare results thoughtfully.

> **Mental model:** Mathematical analysis predicts how work scales; an experiment checks how a particular implementation behaves when run.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

This short program links the sequence types to the original four cards. It uses public indexing and slicing rules, then computes each rectangle's area and the total.

<span id="part-5-program"></span>

### 1. The complete program

```python
labels = "ABCD"
dimensions = [(2, 3), (4, 2), (4, 4), (2, 2)]
areas = []
total = 0

for width, height in dimensions:
    area = width * height
    areas.append(area)
    total += area

grid = [areas[:2], areas[2:]]

for k in range(len(labels)):
    width, height = dimensions[k]
    print("{}: {} x {} = {} cm^2".format(labels[k], width, height, areas[k]))

print("Board rows:", grid)
print("Total area: {} cm^2".format(total))
```

The first loop calculates one area for each `(width, height)` tuple. `append` adds that result to the end of the `areas` list, preserving the same order as `labels` and `dimensions`. The two slices make the top and bottom rows. The second loop uses `k` to connect each label, dimension pair, and area. `range(len(labels))` supplies the positions `0` through `3`.

<span id="part-5-trace"></span>

### 2. Trace its result

| Step | Label at this position | Dimensions | New area | Running total |
| ---: | :--------------------- | :--------- | -------: | ------------: |
| `0` | `A` | `(2, 3)` | 6 cm² | 6 cm² |
| `1` | `B` | `(4, 2)` | 8 cm² | 14 cm² |
| `2` | `C` | `(4, 4)` | 16 cm² | 30 cm² |
| `3` | `D` | `(2, 2)` | 4 cm² | 34 cm² |

The program prints:

```text
A: 2 x 3 = 6 cm^2
B: 4 x 2 = 8 cm^2
C: 4 x 4 = 16 cm^2
D: 2 x 2 = 4 cm^2
Board rows: [[6, 8], [16, 4]]
Total area: 34 cm^2
```

This result follows from the four stored dimensions. The program does not test whether the cards physically fit together without gaps or overlaps; it sums the areas of four individual rectangles.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which area belongs to card C?</strong></summary>

**Scenario:** `labels = "ABCD"`, `dimensions = [(2, 3), (4, 2), (4, 4), (2, 2)]`, and `areas = [6, 8, 16, 4]`.

**Problem:** Card `C` is the third label, but Python positions start at zero.

**Solution:** Use position `2`: `labels[2]` is `"C"`, `dimensions[2]` is `(4, 4)`, and `areas[2]` is `16`.

**Result:** `4 × 4 = 16 cm²`, so the aligned sequences describe the same card.

</details>

<details>
<summary><strong>Case Study 2: Why is the top row only two areas?</strong></summary>

**Scenario:** The top row contains cards `A` and `B`.

**Problem:** A student expects `areas[0:2]` to include position `2` as well.

**Fix:** The stop position in a slice is excluded. `areas[0:2]` is `[6, 8]`; position `2` belongs to card `C` in the bottom row.

**Result:** The top row's total card area is `6 + 8 = 14 cm²`.

</details>

<details>
<summary><strong>Case Study 3: Why did editing a copied grid alter the original?</strong></summary>

**Scenario:** `grid = [[6, 8], [16, 4]]` and `trial = grid[:]`.

**Problem:** Setting `trial[0][0] = 99` also makes `grid[0][0]` equal `99`.

**Fix:** The slice copied only the outer list; its row lists are shared. For this table of numbers, use `trial = [row[:] for row in grid]` before editing a row.

**Result:** An experimental change to `trial` no longer corrupts the original board data.

</details>

<details>
<summary><strong>Case Study 4: Can we change one dimension inside a tuple?</strong></summary>

**Scenario:** Card `A` was entered as `(2, 3)` in the `dimensions` list, but a new measurement says its width is `5 cm`.

**Problem:** `dimensions[0][0] = 5` tries to modify an immutable tuple and raises `TypeError`.

**Fix:** Replace the tuple in the mutable outer list: `dimensions[0] = (5, 3)`. Then recalculate the area from the updated dimensions.

**Result:** Card `A`'s new area is `5 × 3 = 15 cm²`; any previously computed `areas` list must also be updated or recomputed.

</details>

<details>
<summary><strong>Case Study 5: Does one fast timing tell us how the algorithm grows?</strong></summary>

**Scenario:** A four-card sum finishes too quickly to notice.

**Problem:** One short timing cannot establish how work grows when the board has hundreds or thousands of cards.

**Fix:** First count the additions in the simple loop as a function of `n`; then measure several input sizes repeatedly to see whether the observations fit the prediction.

**Result:** The loop has `n` additions, an O(n) worked example. Timing supplies evidence for a particular run, with values that vary by environment.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 5.1 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Sequence types** | `list`, `tuple`, and `str` store ordered elements and support indexed access. | `areas[2]`, `dimensions[2]`, and `labels[2]` all describe card `C`. |
| **Different public behaviors** | Similar notation does not make the types interchangeable. | A list element can be replaced; a tuple item or string character cannot. |
| **Copies and slices** | Know which new objects are made and which parts remain shared. | `areas[:]` separates a flat list, while `grid[:]` still shares its inner rows. |
| **Multidimensional data** | A list can contain other lists to represent rows and columns. | `grid[1][0]` finds card `C`'s area, `16 cm²`. |
| **Encapsulation** | Public rules support correct use; implementation details help explain cost. | We can compute `4 × 4` without knowing storage layout, then examine costs if the board grows. |
| **Asymptotic analysis** | Describe how work grows with input size. | Adding `n` card areas in the illustrated loop takes `n` additions: O(n). |
| **Experimental analysis** | Time actual operations to compare observations with a prediction. | Time repeated totals for 100, 1,000, and 10,000 card areas. |

Section 5.1 introduces these themes; later parts of Chapter 5 develop the detailed sequence operations, representations, and cost analyses.

[🔝 Back to Top](#top)
