<span id="top"></span>

# 12.6 Python's Built-In Sorting Functions — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 12, Section 12.6, printed pages 569–570 ([supplied Chapter 12 PDF](<../Data Structures and Algorithms in Python - C12.pdf>)).<br>
> **Topic:** 12.6 Python's Built-In Sorting Functions; 12.6.1 Sorting According to a Key Function; Decorate-Sort-Undecorate Design Pattern.<br>
> **Domain Focus:** The six rectangular cards introduced in [Section 12.1](12-01-why-study-sorting-algorithms.md); order them by area, perimeter, and a two-part geometry key while preserving each card's label.<br>
> **User Prompt:** Reexplain Section 12.6 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Choose the Measurement to Order](#background)
   - [1. Reuse the same six rectangle cards](#background-cards)
   - [2. Separate a card from its sorting key](#background-key)
2. [Part 1: 12.6 Python's Built-In Sorting Functions](#part-1)
   - [1. Understand Python's default order](#part-1-default)
   - [2. Change a list with `list.sort()`](#part-1-sort)
   - [3. Make a new list with `sorted()`](#part-1-sorted)
3. [Part 2: 12.6.1 Sorting According to a Key Function](#part-2)
   - [1. Supply a one-argument key function](#part-2-key)
   - [2. Run the area and perimeter examples](#part-2-code)
   - [3. Keep ties in order, even when reversing](#part-2-stable)
   - [4. Use a tuple when one measurement breaks a tie](#part-2-composite)
4. [Part 3: Decorate-Sort-Undecorate Design Pattern](#part-3)
   - [1. Follow the book's three steps](#part-3-pattern)
   - [2. Trace the decorations on our cards](#part-3-trace)
   - [3. Make a safe manual version in Python](#part-3-code)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Choose the Measurement to Order

<span id="background-cards"></span>

### 1. Reuse the same six rectangle cards

Our card records still arrive in the order `D, C, A, B, E, F`. Each record stores a label, width, and height. We can calculate **area = width × height** or **perimeter = 2 × (width + height)** from those measurements.

| Card | Width | Height | Area | Perimeter |
| :--- | ----: | -----: | ---: | --------: |
| `D` | 4 cm | 4 cm | 16 cm² | 16 cm |
| `C` | 3 cm | 4 cm | 12 cm² | 14 cm |
| `A` | 2 cm | 3 cm | 6 cm² | 10 cm |
| `B` | 2 cm | 4 cm | 8 cm² | 12 cm |
| `E` | 1 cm | 8 cm | 8 cm² | 18 cm |
| `F` | 4 cm | 5 cm | 20 cm² | 18 cm |

By **area**, the desired ascending label order is `A, B, E, C, D, F`. By **perimeter**, it is `A, B, C, D, E, F`. Card `E` illustrates the difference: a thin 1-by-8 rectangle has area 8 cm² but perimeter 18 cm.

<span id="background-key"></span>

### 2. Separate a card from its sorting key

A **card record** is the whole object we want to keep. A **key** is just the value we compare to decide where that record belongs. Sorting by area means moving the entire record according to `width × height`; sorting by perimeter means using `2 × (width + height)` instead. The labels travel with the records.

The book begins with a list of color names to show Python's natural string order, then uses string length as a new key. Our geometry version makes the same shift: from ordering a record by its default fields to ordering it by a calculated measurement.

| Card | Area key | Perimeter key |
| :--- | -------: | ------------: |
| `B` | 8 | 12 |
| `E` | 8 | 18 |

Cards `B` and `E` **tie by area** but not by perimeter. That tie lets us see whether a sorting method keeps equal-key records in their original order.

> **Mental model:** `sort()` and `sorted()` move complete records. The `key` function tells Python which measurement of each record to compare.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 12.6 Python's Built-In Sorting Functions

<span id="part-1-default"></span>

### 1. Understand Python's default order

Without a `key`, Python sorts values according to their normal `<` order. In the book's example, strings such as `"blue"` and `"green"` are placed in string order. For our records represented as tuples `(label, width, height)`, tuple comparison starts with the **label**. Thus, `sorted(cards)` gives label order `A, B, C, D, E, F`, regardless of area.

Default order is useful only when it matches the question. If the teacher asks for cards from smallest **area** to largest, sorting the tuple records without `key=` answers a different question. Some record types have no natural `<` order at all; supplying a comparable numeric key also solves that problem.

<span id="part-1-sort"></span>

### 2. Change a list with `list.sort()`

`list.sort()` is a **method on a list**. It rearranges that same list in place. It returns `None`, so assign a name to the list **before** sorting rather than expecting the call to produce a new list. The [Python reference for `list.sort()`](https://docs.python.org/3/library/stdtypes.html#list.sort) confirms this behavior.

```python
areas = [16, 12, 6, 8, 8, 20]
result = areas.sort()
print(areas)   # [6, 8, 8, 12, 16, 20]
print(result)  # None
```

The area numbers move inside `areas`. In Part 2, we will sort the **card records** so the labels and measurements move together.

<span id="part-1-sorted"></span>

### 3. Make a new list with `sorted()`

`sorted(iterable)` collects an iterable's items and returns a **new list** in sorted order. When the input is an existing list, that list keeps its original element order. Unlike `list.sort()`, `sorted()` also works with tuples, strings, and other iterables: the book's `sorted("green")` example returns `['e', 'e', 'g', 'n', 'r']`. The [Python reference for `sorted()`](https://docs.python.org/3/library/functions.html#sorted) documents its return type.

```python
areas = [16, 12, 6, 8, 8, 20]
ordered = sorted(areas)
print(ordered)                 # [6, 8, 8, 12, 16, 20]
print(areas)                   # [16, 12, 6, 8, 8, 20]
print(sorted(tuple(areas)))    # [6, 8, 8, 12, 16, 20]
```

The tuple example also returns a **list**. If the iterable is a one-use iterator, `sorted()` consumes it while making that list; the unchanged-input statement above concerns an existing list's element order.

| Call | Input it accepts | What it changes | Return value |
| :--- | :--------------- | :-------------- | :----------- |
| `cards.sort()` | A list | Rearranges `cards`. | `None` |
| `sorted(cards)` | Any iterable | Leaves a list input's order alone. | A new list |

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 12.6.1 Sorting According to a Key Function

<span id="part-2-key"></span>

### 1. Supply a one-argument key function

Both built-in sorting forms accept `key=...`. The value after `key=` must be a **callable** that accepts one record and returns the comparison key. The book uses `len` to sort color names by length. For a card tuple `(label, width, height)`, these functions return our geometry measurements:

```python
def area(card):
    return card[1] * card[2]


def perimeter(card):
    return 2 * (card[1] + card[2])
```

In `sorted(cards, key=area)`, pass the **function** `area`, without parentheses. Writing `key=area()` would try to call it immediately without a card argument. Python calls the supplied function on each record and orders the records by the returned numbers. In the book, `key=len` reorders its color names as `red, blue, cyan, green, yellow, magenta`; Figure 12.16 pictures each name with its length. Our `area` function fills the same role for cards. The current [Python sorting guide](https://docs.python.org/3/howto/sorting.html) says the key callable is evaluated once per input item.

<span id="part-2-code"></span>

### 2. Run the area and perimeter examples

This complete program uses the same six cards for default order, area order, perimeter order, descending area order, and in-place sorting:

```python
cards = [
    ("D", 4, 4), ("C", 3, 4), ("A", 2, 3),
    ("B", 2, 4), ("E", 1, 8), ("F", 4, 5),
]


def area(card):
    return card[1] * card[2]


def perimeter(card):
    return 2 * (card[1] + card[2])


def labels(card_list):
    return [card[0] for card in card_list]


print(labels(sorted(cards)))                          # ['A', 'B', 'C', 'D', 'E', 'F']
print(labels(sorted(cards, key=area)))                # ['A', 'B', 'E', 'C', 'D', 'F']
print(labels(sorted(cards, key=perimeter)))           # ['A', 'B', 'C', 'D', 'E', 'F']
print(labels(sorted(cards, key=area, reverse=True)))  # ['F', 'D', 'C', 'B', 'E', 'A']
print(labels(cards))                                  # ['D', 'C', 'A', 'B', 'E', 'F']

working = cards.copy()
answer = working.sort(key=area)
print(answer)          # None
print(labels(working))  # ['A', 'B', 'E', 'C', 'D', 'F']
```

The first and third outputs happen to have the same label order, but for different reasons: the first compares labels, while the third compares perimeters. The **area** output moves `E` ahead of `C` and `D`, so it differs visibly.

<span id="part-2-stable"></span>

### 3. Keep ties in order, even when reversing

Python's `list.sort()` and `sorted()` are **stable**: records with equal keys stay in their original relative order. In the area sort, `B:8` arrives before `E:8`, so the result has `B` before `E`. In the perimeter sort, `E:18` arrives before `F:18`, so it has `E` before `F`. The [official sorting guide](https://docs.python.org/3/howto/sorting.html#sort-stability-and-complex-sorts) documents this guarantee.

Both functions also accept `reverse=True` for descending **key order**. It does not reverse equal-key arrival order: descending area gives `F, D, C, B, E, A`, with `B` still before `E`. Simply reversing an already ascending output would give `F, D, C, E, B, A` and change that tie order. The same [Python guide](https://docs.python.org/3/howto/sorting.html#odds-and-ends) confirms that `reverse=True` preserves stability.

<span id="part-2-composite"></span>

### 4. Use a tuple when one measurement breaks a tie

Sometimes the teacher wants **area first, then width**. Return both measurements as a tuple:

```python
by_area_then_width = sorted(cards, key=lambda card: (area(card), card[1]))
print(labels(by_area_then_width))  # ['A', 'E', 'B', 'C', 'D', 'F']
```

Python compares tuple keys **lexicographically**: compare area first; if areas tie, compare width. Both `E` and `B` have area 8, but `E` has width 1 and `B` has width 2, so `E` now comes first. This is a **different key** from area alone, not a failure of sort stability. The [Section 12.4 guide](12-04-studying-sorting-through-an-algorithmic-lens.md) used this same primary-then-secondary idea for radix-sort. Run the short code above after the complete card program.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Decorate-Sort-Undecorate Design Pattern

<span id="part-3-pattern"></span>

### 1. Follow the book's three steps

The book explains `key=` through a **decorate–sort–undecorate** pattern:

1. **Decorate:** Calculate a key for each record and temporarily pair the key with the record.
2. **Sort:** Order those decorated items by their keys.
3. **Undecorate:** Remove the temporary keys and keep the records in sorted order.

In Code Fragment 12.8, the book demonstrates this by wrapping each item in an `_Item` holding a key and value, calling its earlier `merge_sort`, then extracting the original values. Decoration is skipped when no key function is supplied. This is a teaching implementation around the book's merge-sort; for ordinary Python code, `key=` on a built-in sort already expresses the desired operation.

The pattern explains why a card can be compared by a calculated area while the **whole card record** moves. It also avoids recalculating a costly key at every comparison. The current Python sorting guide states that built-in key functions run once per input record; the conceptual pattern does not require Python to expose temporary wrappers in the list.

<span id="part-3-trace"></span>

### 2. Trace the decorations on our cards

Use **area** as the decoration, keeping arrival order visible with an index:

| Original position | Card | Area decoration |
| ----------------: | :--- | --------------: |
| 0 | `D` | 16 |
| 1 | `C` | 12 |
| 2 | `A` | 6 |
| 3 | `B` | 8 |
| 4 | `E` | 8 |
| 5 | `F` | 20 |

The decorated records can be pictured as `(area, original_position, card)`:

```text
(16,0,D)  (12,1,C)  (6,2,A)  (8,3,B)  (8,4,E)  (20,5,F)
    ↓ sort by area, using position to order ties
(6,2,A)  (8,3,B)  (8,4,E)  (12,1,C)  (16,0,D)  (20,5,F)
    ↓ remove area and position decorations
A  B  E  C  D  F
```

The position is an **extra safeguard in our manual example**: it keeps `B` before `E` even if the sorting algorithm used for the decorated records does not itself preserve ties. The book's `_Item` compares by key; its particular right-on-tie merge code from [Section 12.2](12-02-merge-sort.md) does not automatically give that stability guarantee. Python's built-in sorts do guarantee it when you use `key=area` directly.

<span id="part-3-code"></span>

### 3. Make a safe manual version in Python

Run this after the complete card program in Part 2. The index separates equal keys before tuple comparison could reach the card record:

```python
decorated = [(area(card), index, card) for index, card in enumerate(cards)]
decorated.sort()
manual_area_order = [card for _, _, card in decorated]
print(labels(manual_area_order))  # ['A', 'B', 'E', 'C', 'D', 'F']
```

If we used only `(area, card)` as a tuple decoration, equal areas could make Python compare the **card records** as a second field. That could change tie order or fail for records without their own `<` operation. Adding the unique original index avoids both problems. For this ordinary card task, `sorted(cards, key=area)` is shorter and already stable; manual decoration is useful here to understand the book's design pattern.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why does sorting the card tuples give the wrong display?</strong></summary>

**Scenario:** The class runs `sorted(cards)` but wants ascending area.

**Reasoning:** Each tuple begins with a label, so Python first orders the labels `A, B, C, D, E, F`. The desired area order is `A, B, E, C, D, F`; `E` has area 8 even though its label is near the alphabet's end.

**Fix:** Use `sorted(cards, key=area)` so Python compares the calculated areas while keeping each complete tuple attached.

</details>

<details>
<summary><strong>Case Study 2: Why did assigning `sort()` lose the sorted list?</strong></summary>

**Scenario:** A student writes `answer = cards.sort(key=area)` and then examines `answer`.

**Problem:** `answer` is `None`; `sort()` changed `cards` itself. To keep the original arrival-order list, use `answer = sorted(cards, key=area)` instead.

**Result:** Choose the call by whether the original list should be rearranged or a new sorted list is needed.

</details>

<details>
<summary><strong>Case Study 3: Can one thin card move when the geometry key changes?</strong></summary>

**Scenario:** `E` is 1 cm by 8 cm. Its area is 8 cm², and its perimeter is `2 × (1 + 8) = 18 cm`.

**Reasoning:** By area, `E` sits with `B:8` before `C:12`. By perimeter, `E:18` sits with `F:18` after `D:16`.

**Result:** `key=area` gives `A, B, E, C, D, F`; `key=perimeter` gives `A, B, C, D, E, F`. The card records stay the same; the measurement used for order changes.

</details>

<details>
<summary><strong>Case Study 4: Does descending area reverse the two equal-area cards?</strong></summary>

**Scenario:** `B:8` arrives before `E:8`, and the display needs largest area first.

**Reasoning:** `sorted(cards, key=area, reverse=True)` orders the areas downward but remains stable on the 8 cm² tie.

**Result:** The labels are `F, D, C, B, E, A`. Reversing the ascending list by hand would put `E` before `B`, so use `reverse=True` for a stable descending sort.

</details>

<details>
<summary><strong>Case Study 5: What if width must break an area tie?</strong></summary>

**Scenario:** `B` and `E` both have area 8 cm², but widths 2 cm and 1 cm.

**Reasoning:** A key `(area, width)` compares area first and width second. `E` must precede `B` because `1 < 2` for their widths.

**Result:** `A, E, B, C, D, F` is correct for the **two-part** key. It does not contradict the stable area-only result `A, B, E, C, D, F`.

</details>

<details>
<summary><strong>Case Study 6: Why attach the arrival position in manual decoration?</strong></summary>

**Scenario:** We manually decorate each card as `(area, position, card)` before sorting.

**Reasoning:** The equal-area cards become `(8, 3, B)` and `(8, 4, E)`. The positions decide their order before Python could compare the card objects themselves.

**Result:** After sorting and removing decorations, `B` remains before `E`. The built-in `key=area` handles the simple task without this manual step.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 12.6 idea | Plain-language meaning | Rectangle-card example |
| :---------------- | :--------------------- | :--------------------- |
| **Natural order** | Without `key`, compare records by their normal `<` behavior. | Tuples beginning with labels sort as `A, B, C, D, E, F`. |
| **`list.sort()`** | Rearrange an existing list and return `None`. | `working.sort(key=area)` changes `working`, not `cards`. |
| **`sorted()`** | Return a new list from an iterable. | `sorted(cards, key=area)` leaves the original card list in arrival order. |
| **Key function** | Compute one comparison value for each record. | `area(card)` returns `width × height`; `perimeter(card)` returns `2(width + height)`. |
| **Stability** | Equal-key records retain arrival order. | Area ties keep `B` before `E`; perimeter ties keep `E` before `F`. |
| **`reverse=True`** | Sort descending while retaining equal-key order. | Descending area is `F, D, C, B, E, A`. |
| **Composite key** | Use a tuple when a second measurement breaks a tie. | `(area, width)` puts `E:8` before `B:8`. |
| **Decorate–sort–undecorate** | Attach keys, sort by them, then recover the original records. | `(8, 3, B)` and `(8, 4, E)` preserve the area tie's arrival order. |

[🔝 Back to Top](#top)
