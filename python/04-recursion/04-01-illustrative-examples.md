<span id="top"></span>

# 4.1 Illustrative Examples — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.1, printed pages 150–160 (the supplied PDF).  
> **Topic:** 4.1 Illustrative Examples; 4.1.1 The Factorial Function; 4.1.2 Drawing an English Ruler; 4.1.3 Binary Search; 4.1.4 File Systems.  
> **Domain Focus:** Rectangular display cards, their arrangements and areas, marks along a display-board edge, and nested card groups.  
> **User Prompt:** Reexplain [`Section 4.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. One set of cards, four questions](#background-cards)
   - [2. What makes a solution recursive?](#background-recursion)
2. [Part 1: 4.1 Illustrative Examples](#part-1)
   - [1. The common pattern](#part-1-pattern)
   - [2. How a recursive call returns](#part-1-return)
3. [Part 2: 4.1.1 The Factorial Function](#part-2)
   - [1. Count arrangements of distinct cards](#part-2-count)
   - [2. Follow the calls and returns](#part-2-trace)
4. [Part 3: 4.1.2 Drawing an English Ruler](#part-3)
   - [1. Divide a board edge into smaller intervals](#part-3-divide)
   - [2. Calculate the tick positions](#part-3-trace)
5. [Part 4: 4.1.3 Binary Search](#part-4)
   - [1. Search a sorted area catalog](#part-4-search)
   - [2. Trace a hit and a miss](#part-4-trace)
6. [Part 5: 4.1.4 File Systems](#part-5)
   - [1. Add sizes through a folder tree](#part-5-files)
   - [2. Add areas through nested card groups](#part-5-geometry)
7. [Part 6: One Connected Geometry Program](#part-6)
   - [1. The complete program](#part-6-program)
   - [2. Read the results](#part-6-results)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. One set of cards, four questions

Imagine preparing a display board with three **distinct** rectangular cards. The labels identify physical cards; their measurements are in centimetres.

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

We will ask four connected questions. How many left-to-right orders can these cards have? Where should short ticks go along the first centimetre of the board's edge? Is a requested area in a sorted catalog? What is the total area when cards are stored in nested groups? Each question lets us solve a **smaller version of the same kind of problem**.

The book's fourth example counts **file-system space in bytes**. Our nested card groups use the same tree shape to count **area in cm²**. A file's byte size is not its card's geometric area; the two quantities remain separate.

<span id="background-recursion"></span>

### 2. What makes a solution recursive?

A recursive function calls itself on a smaller problem. To make that process finish, identify:

| Question | Meaning | Card-workshop example |
| :--- | :--- | :--- |
| **Base case** | Which smallest problem can we answer directly? | There is one way to arrange zero remaining cards: leave the row empty. |
| **Progress** | How does each call get closer to that case? | Arrange `n − 1` cards after selecting the first card. |
| **Combine** | How do smaller answers make the original answer? | Multiply the `n − 1` count by the `n` choices for the first card. |

Some recursive functions, such as factorial and binary search, make **one** recursive call at each step. The ruler and folder-tree examples can make **several**. A call waits for its smaller call to return before it finishes its own work.

> **Mental model:** Ask the same question about a smaller object, stop at a directly answerable object, and use the returned answer to finish the larger one.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 4.1 Illustrative Examples

Section 4.1 introduces recursion through four concrete algorithms. The examples differ in what becomes smaller: a number of remaining items, a ruler interval, a search range, or a subtree of a file system.

<span id="part-1-pattern"></span>

### 1. The common pattern

| Book example | Smaller problem | Stopping point | Card-workshop question |
| :--- | :--- | :--- | :--- |
| Factorial | Count arrangements of one fewer item. | No items remain. | How many orders of `A`, `B`, and `C`? |
| English ruler | Draw the left and right halves at one shorter tick length. | Tick length reaches zero. | Where are the eighth-centimetre marks? |
| Binary search | Keep only the half that could contain the target. | Find the target or exhaust the range. | Is 16 cm² in our sorted area catalog? |
| File systems | Visit each child folder or file. | Reach an item with no children. | What area is stored in a nested card group? |

The **input must actually shrink**. For example, calling `factorial(n)` again with the same `n` would never reach its base case.

<span id="part-1-return"></span>

### 2. How a recursive call returns

When a function calls itself, Python keeps each call's local values and the work still waiting to be done. For `3 × factorial(2)`, the multiplication by `3` waits while `factorial(2)` runs. Once the smallest call returns, the waiting multiplications finish in reverse order. We will trace this explicitly in Part 2.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 4.1.1 The Factorial Function

<span id="part-2-count"></span>

### 1. Count arrangements of distinct cards

The **factorial** of a nonnegative integer `n`, written `n!`, is the product `n × (n − 1) × ... × 1`. The book defines the recursive rule:

```text
0! = 1
n! = n × (n − 1)!   when n > 0
```

For three distinct cards, there are three choices for the first position, then two for the second, then one for the third: `3! = 3 × 2 × 1 = 6` orders. The `0! = 1` case means there is exactly **one empty arrangement** when no cards are left to place.

```python
def count_orders(n):
    if n < 0:
        raise ValueError("the number of cards cannot be negative")
    if n == 0:
        return 1
    return n * count_orders(n - 1)
```

The book's `factorial` computes the same mathematical rule. We call this study version `count_orders` to show why the rule fits our cards. The negative-input check makes the intended domain explicit; without it, a negative input would keep decreasing and never reach zero.

<span id="part-2-trace"></span>

### 2. Follow the calls and returns

For `count_orders(3)`, each call waits for the next one:

```text
count_orders(3) = 3 × count_orders(2)
count_orders(2) = 2 × count_orders(1)
count_orders(1) = 1 × count_orders(0)
count_orders(0) = 1              ← base case
```

The returns now travel back outward: `count_orders(1) = 1`, `count_orders(2) = 2`, and `count_orders(3) = 6`. Each call has its **own** `n`; the `n = 3` call keeps waiting with its factor `3` while the other calls run.

| Cards left | Answer | Geometry meaning |
| ---------: | -----: | :--- |
| 0 | 1 | One empty row. |
| 1 | 1 | Only one place order. |
| 2 | 2 | `AB` or `BA`. |
| 3 | 6 | `ABC`, `ACB`, `BAC`, `BCA`, `CAB`, or `CBA`. |

[🔝 Back to Top](#top)

---
<span id="part-3"></span>

## Part 3: 4.1.2 Drawing an English Ruler

<span id="part-3-divide"></span>

### 1. Divide a board edge into smaller intervals

The book draws an **English ruler**: long ticks mark whole inches, and shorter ticks mark halves, quarters, eighths, and so on. Between two equally long boundary ticks, the middle tick is the longest interior tick. The smaller ticks to its left and right follow the **same pattern**. This repeated shape is why recursion fits.

For our display board, use the first **1 cm** of an edge instead of one inch. Put long endpoint ticks at `0 cm` and `1 cm`. A middle tick goes at `1/2 cm`; the two halves then get middle ticks at `1/4 cm` and `3/4 cm`; their halves get ticks at eighths. The positions change units, but the subdivision rule is identical.

The book's recursive `draw_interval(L)` first draws the left smaller interval, then a middle tick of length `L`, then the right smaller interval. Its base case `L = 0` draws nothing. The surrounding `draw_ruler` routine uses a **loop** to handle multiple whole-inch intervals; only the interval routine is recursive.

Our version returns tick **positions** as well as lengths, making the geometry visible:

```python
def ruler_marks(left, right, length):
    if length <= 0:
        return []
    middle = (left + right) / 2
    return (
        ruler_marks(left, middle, length - 1)
        + [(middle, length)]
        + ruler_marks(middle, right, length - 1)
    )
```

Each call cuts its interval in half and reduces the tick length by one. It lists the left ticks **before** the middle tick and the right ticks **after**, so the returned positions run from left to right. The function does not include the two long endpoint ticks; we add those separately.

<span id="part-3-trace"></span>

### 2. Calculate the tick positions

With endpoint length `4` and interior call `ruler_marks(0, 1, 3)`, the first middle is `1/2 cm` with tick length `3`. The left half's middle is `1/4 cm` with length `2`; the right half's middle is `3/4 cm` with length `2`. The remaining positions have length `1`.

| Position from left edge | Tick length | How it arises |
| ----------------------: | ----------: | :--- |
| `0 cm` | 4 | Left endpoint; drawn separately. |
| `1/8 cm` | 1 | Middle of `0` to `1/4`. |
| `1/4 cm` | 2 | Middle of `0` to `1/2`. |
| `3/8 cm` | 1 | Middle of `1/4` to `1/2`. |
| `1/2 cm` | 3 | Middle of the full interval. |
| `5/8 cm` | 1 | Middle of `1/2` to `3/4`. |
| `3/4 cm` | 2 | Middle of `1/2` to `1`. |
| `7/8 cm` | 1 | Middle of `3/4` to `1`. |
| `1 cm` | 4 | Right endpoint; drawn separately. |

For interior level `L`, the number of ticks satisfies `T(0) = 0` and `T(L) = 2T(L − 1) + 1`: two smaller halves plus one middle tick. Thus `T(3) = 7` interior ticks. The recursive halves have the same structure at a smaller scale, which the book describes as a self-similar, or fractal, pattern.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 4.1.3 Binary Search

<span id="part-4-search"></span>

### 1. Search a sorted area catalog

Suppose the card workshop lists areas in **sorted order**: `[6, 8, 16]` cm². Binary search checks the middle entry. If the target is smaller, only the left part can still contain it; if larger, only the right part can. The book's routine uses inclusive indices `low` and `high` and returns a **Boolean** answer.

```python
def contains_area(areas, target, low, high):
    if low > high:
        return False
    middle = (low + high) // 2
    if areas[middle] == target:
        return True
    if target < areas[middle]:
        return contains_area(areas, target, low, middle - 1)
    return contains_area(areas, target, middle + 1, high)
```

The initial call is `contains_area(areas, target, 0, len(areas) - 1)`. The `//` operator gives an integer index. Removing the middle entry from the next range (`middle - 1` or `middle + 1`) guarantees progress. If `low > high`, no candidates remain.

**Sorted order is essential.** For an unsorted list such as `[16, 6, 8]`, comparing a target with the middle entry does not tell us which half can be discarded. The book also assumes data that can be accessed by index, as a Python list can. Repeatedly halving an indexable list takes `O(log n)` comparisons in the worst case, compared with `O(n)` for a sequential scan.

<span id="part-4-trace"></span>

### 2. Trace a hit and a miss

For target `16 cm²`, start with indices `0..2`:

| Call | Candidate indices | Middle index and area | Decision |
| ---: | :--- | :--- | :--- |
| 1 | `0..2` | `1 → 8 cm²` | `16 > 8`; search `2..2`. |
| 2 | `2..2` | `2 → 16 cm²` | Equal; return `True`. |

For target `7 cm²`, the middle area is `8`, so search index `0`. That area is `6`, so search indices `1..0`; because `low > high`, return `False`. The result says whether the **area value** occurs. Cards `B` and another card could have the same area; the Boolean answer would still be `True`, without identifying which card matched.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 4.1.4 File Systems

<span id="part-5-files"></span>

### 1. Add sizes through a folder tree

A file system groups files inside directories, and directories can contain other directories. The book's `disk_usage(path)` calculates **cumulative disk usage** for one path. It starts with that path's immediate size, then, if the path is a directory, adds the cumulative size returned by a recursive call for **each child**.

```text
cumulative size of path
    = immediate size of path
    + sum of cumulative sizes of its children
```

The book uses `os.path.getsize(path)` for the immediate size, `os.path.isdir(path)` to decide whether there are children, `os.listdir(path)` for child names, and `os.path.join(path, name)` to build each child's path. An ordinary file has no child calls; an empty directory also has no child calls, but its own immediate size still counts. A directory's cumulative answer is ready only **after** its children have returned. The Python implementation obtains sizes in bytes, including a directory's own size; the book's diagram displays larger totals in K.

The core of that procedure can be read as:

```python
import os

def disk_usage(path):
    total = os.path.getsize(path)
    if os.path.isdir(path):
        for name in os.listdir(path):
            child_path = os.path.join(path, name)
            total += disk_usage(child_path)
    return total
```

The book also prints each path's cumulative total just before returning it. Therefore, a child's result is printed before its parent directory's result.

<span id="part-5-geometry"></span>

### 2. Add areas through nested card groups

Now use the **same tree traversal** for our geometry activity. Put card `A` in the outer tray, and put `B` and `C` in an inner tray. A card leaf contributes its own area; a tray contributes the areas of its children. Trays themselves have **zero card area**.

```text
display tray
├── card A: 6 cm²
└── inner tray
    ├── card B: 8 cm²
    └── card C: 16 cm²
```

The inner tray returns `8 + 16 = 24 cm²`. The display tray then returns `6 + 24 = 30 cm²`. This is a sum of **physical card areas**, not a disk-usage measurement and not the area of the space occupied by a tray.

| Node | Its own card area | Children's returned area | Total returned |
| :--- | ---: | ---: | ---: |
| Card `B` | 8 cm² | 0 cm² | 8 cm² |
| Card `C` | 16 cm² | 0 cm² | 16 cm² |
| Inner tray | 0 cm² | 8 + 16 = 24 cm² | 24 cm² |
| Card `A` | 6 cm² | 0 cm² | 6 cm² |
| Display tray | 0 cm² | 6 + 24 = 30 cm² | 30 cm² |

The final answer depends on what the tree represents. If it represents **separate physical cards**, count each leaf once as above. If two folders merely point to the **same** physical card, the simple traversal would count it twice; that would require an explicit rule for shared items.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: One Connected Geometry Program

<span id="part-6-program"></span>

### 1. The complete program

This runnable study program answers all four questions for the same cards. The first three functions mirror the book's smaller-problem choices. `total_card_area` uses a nested in-memory tree instead of reading the real file system, so its result has **cm²** units.

```python
def count_orders(n):
    if n < 0:
        raise ValueError("the number of cards cannot be negative")
    if n == 0:
        return 1
    return n * count_orders(n - 1)


def ruler_marks(left, right, length):
    if length <= 0:
        return []
    middle = (left + right) / 2
    return (
        ruler_marks(left, middle, length - 1)
        + [(middle, length)]
        + ruler_marks(middle, right, length - 1)
    )


def contains_area(areas, target, low, high):
    if low > high:
        return False
    middle = (low + high) // 2
    if areas[middle] == target:
        return True
    if target < areas[middle]:
        return contains_area(areas, target, low, middle - 1)
    return contains_area(areas, target, middle + 1, high)


def total_card_area(node):
    subtotal = node.get("area", 0)
    for child in node.get("children", []):
        subtotal += total_card_area(child)
    return subtotal


cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
card_areas = {label: width * height for label, (width, height) in cards.items()}
sorted_areas = sorted(card_areas.values())
display = {
    "name": "display tray",
    "children": [
        {"name": "A", "area": card_areas["A"]},
        {
            "name": "inner tray",
            "children": [
                {"name": "B", "area": card_areas["B"]},
                {"name": "C", "area": card_areas["C"]},
            ],
        },
    ],
}

print("Card areas:", sorted_areas, "cm^2")
print("Possible card orders:", count_orders(len(cards)))
print("Board-edge ticks:")
print("0.000 cm: ----")
for position, length in ruler_marks(0.0, 1.0, 3):
    print(f"{position:.3f} cm: {'-' * length}")
print("1.000 cm: ----")
print("16 cm^2 present:", contains_area(sorted_areas, 16, 0, len(sorted_areas) - 1))
print("7 cm^2 present:", contains_area(sorted_areas, 7, 0, len(sorted_areas) - 1))
print("Area in display tray:", total_card_area(display), "cm^2")
```

<span id="part-6-results"></span>

### 2. Read the results

```text
Card areas: [6, 8, 16] cm^2
Possible card orders: 6
Board-edge ticks:
0.000 cm: ----
0.125 cm: -
0.250 cm: --
0.375 cm: -
0.500 cm: ---
0.625 cm: -
0.750 cm: --
0.875 cm: -
1.000 cm: ----
16 cm^2 present: True
7 cm^2 present: False
Area in display tray: 30 cm^2
```

The six orders come from `3!`. The seven interior ticks come from splitting one centimetre into eighths. Binary search finds `16` but exhausts the candidate range for `7`. The tray total is `6 + (8 + 16) = 30 cm²`. These are **four different questions** about the same three cards; the recursive pattern connects the methods, not their units or return types.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why is zero factorial one?</strong></summary>

**Scenario:** All three cards have been placed, so the remaining problem has zero cards.

**Check:** There is exactly one way to finish: leave the remaining row empty. Thus `count_orders(0) = 1`, and the waiting calls can multiply by that answer. If the base returned zero, every factorial result would incorrectly become zero.

</details>

<details>
<summary><strong>Case Study 2: How many ticks appear at a lower level?</strong></summary>

**Scenario:** We only need quarter-centimetre marks inside the `0` to `1 cm` board interval.

**Check:** Use `ruler_marks(0, 1, 2)`. The left half contributes `1/4 cm`, the center contributes `1/2 cm`, and the right half contributes `3/4 cm`. There are `2² − 1 = 3` interior ticks. Reducing the level from `3` to `2` removes the eighth-centimetre ticks.

</details>

<details>
<summary><strong>Case Study 3: What breaks binary search?</strong></summary>

**Scenario:** The same area values are accidentally stored as `[16, 6, 8]` instead of `[6, 8, 16]`.

**Check:** Searching for `16` checks middle value `6`, discards the left half, checks `8`, and returns `False`. Yet `16` is present at index `0`. Sort the areas before calling `contains_area`.

</details>

<details>
<summary><strong>Case Study 4: What if the catalog is empty?</strong></summary>

**Scenario:** No card areas have been recorded yet, so `areas = []`.

**Check:** The initial indices are `low = 0` and `high = len(areas) - 1 = -1`. The base test `low > high` immediately returns `False`, without trying to access an element.

</details>

<details>
<summary><strong>Case Study 5: Does moving a card between trays change the area?</strong></summary>

**Scenario:** Move card `B` from the inner tray to the outer display tray, leaving each card represented once.

**Check:** The inner tray now returns `16 cm²`; the outer tray returns `6 + 8 + 16 = 30 cm²`. The total is unchanged because grouping changes the **addition order**, not the set of card leaves. If the tree lists `B` in both trays, the function counts two `B` leaves and returns `38 cm²`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 4.1 idea | Plain-language meaning | Rectangle-card reminder |
| :--- | :--- | :--- |
| **Recursive call** | Solve a smaller instance using the same function. | Arrange one fewer card, split an interval, narrow a search, or enter a child tray. |
| **Base case** | Answer a smallest instance directly. | Zero cards have one empty order; ruler level zero draws no interior marks. |
| **Factorial** | Multiply the number of first choices by the arrangements of the rest. | Three distinct cards have `3! = 6` orders. |
| **English ruler** | Draw smaller left and right patterns around one middle tick. | Length-3 interior marks occur at eighth-centimetre positions. |
| **Binary search** | Use sorted order to discard half the candidates. | Search `[6, 8, 16]` cm² for `16` or `7`. |
| **File-system traversal** | Add each path's immediate size and its children's cumulative sizes. | The matching card-tree traversal adds `6 + 8 + 16 = 30 cm²`; real disk usage is measured in bytes. |
| **Returning from calls** | Finish waiting work after smaller calls provide answers. | Multiplications unwind for factorial; inner-tray area returns before the display-tray total. |

**Keep the source problems and the study analogy distinct.** The book's ruler uses inches and its file-system algorithm counts bytes. Our centimetre marks and card-area tree make their recursive shapes easier to see without changing what the original algorithms calculate.

[🔝 Back to Top](#top)

