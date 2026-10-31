<span id="top"></span>

# 4.5 Designing Recursive Algorithms — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.5, printed page 177 (the supplied PDF).  
> **Topic:** 4.5 Designing Recursive Algorithms; its unnumbered heading, “Parameterizing a Recursion.”  
> **Domain Focus:** Rectangular-card areas, sorted area searches, display order, and Fibonacci-sized rows of cards.  
> **User Prompt:** Reexplain [`Section 4.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Design Around the Same Cards](#background)
   - [1. Reuse the rectangle cards](#background-cards)
   - [2. Name the changing problem state](#background-state)
2. [Part 1: 4.5 Designing Recursive Algorithms](#part-1)
   - [1. Answer base cases directly](#part-1-base)
   - [2. Make progress on every recursive path](#part-1-progress)
3. [Part 2: Parameterizing a Recursion](#part-2)
   - [1. Describe a smaller problem of the same kind](#part-2-subproblem)
   - [2. Search by changing bounds, without copying the list](#part-2-bounds)
   - [3. Keep the public call simple](#part-2-wrapper)
   - [4. Recognize other parameter and return-value designs](#part-2-other)
4. [Part 3: One Connected Geometry Program](#part-3)
   - [1. The complete program](#part-3-program)
   - [2. Follow the results](#part-3-results)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Design Around the Same Cards

<span id="background-cards"></span>

### 1. Reuse the rectangle cards

Our card workshop has the same three rectangles as the earlier sections. Each area is width times height.

| Card | Width | Height | Area |
| :--- | ---: | ---: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The total area is `6 + 8 + 16 = 30 cm²`. The sorted area catalog is `[6, 8, 16]` cm². We can search that catalog for a requested area, reverse the card display `ABC`, or sum a smaller portion of the catalog.

Section 4.5 gives a **design recipe** for recursive algorithms. We will use these familiar card tasks to see how to choose a stopping point and describe the smaller question passed to each call. The card calculations are study examples; the book's advice applies to problems beyond geometry.

<span id="background-state"></span>

### 2. Name the changing problem state

A recursive function needs enough information to say **which part of the problem remains**. That information may be a count, index bounds, or a richer return value.

| Workshop question | Changing information | Smallest direct answer |
| :--- | :--- | :--- |
| What is the sum of the first `n` card areas? | `n` decreases. | The first zero areas total `0 cm²`. |
| Is a target in the sorted catalog? | Inclusive indices `low` and `high` enclose possible matches. | If `low > high`, no candidates remain, so return `False`. |
| What is the reversed display? | Half-open indices `[start, stop)` move inward. | Zero or one remaining card needs no swap. |

The **inclusive** search interval `[low, high]` contains both endpoints. The **half-open** reversal interval `[start, stop)` includes `start` and excludes `stop`. The choice of interval convention determines the correct base test and updated bounds.

> **Mental model:** Write down the state of the current question, give its smallest cases direct answers, and show how every continuing call reduces that state.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 4.5 Designing Recursive Algorithms

The section first describes a two-step design: test for base cases, then make recursive calls on smaller problems. A branch may choose among several possible calls, but **every possible chain of calls** must eventually reach a base case.

<span id="part-1-base"></span>

### 1. Answer base cases directly

A **base case** is a situation whose answer the function can give without another recursive call. There may be more than one base case. For the card area tasks:

| Task | Base case | Direct answer |
| :--- | :--- | :--- |
| Sum the first `n` areas | `n == 0` | `0 cm²` |
| Search the sorted areas | `low > high` | `False` |
| Reverse `[start, stop)` | `stop - start <= 1` | Leave the display as it is. |

For example, a sum of three areas asks for the sum of two, then one, then zero: `3 → 2 → 1 → 0`. The zero-card case returns `0`; the waiting calls add `6`, `8`, and `16` as they return, giving `30 cm²`.

The base case must cover the smallest input too. Searching an empty catalog starts with `low = 0` and `high = -1`; `low > high` returns `False` before accessing a list element.

<span id="part-1-progress"></span>

### 2. Make progress on every recursive path

After ruling out the base case, a call may make one or more recursive calls. Each one must move toward a direct answer. A useful design check is to name a whole-number **measure** that strictly decreases:

| Task | Measure before a continuing call | How it decreases |
| :--- | :--- | :--- |
| Sum a prefix | `n` remaining areas | Recur with `n - 1`. |
| Search an inclusive range | `high - low + 1` candidates | Exclude the checked middle position and keep one smaller side. |
| Reverse a half-open range | `stop - start` positions | Swap the ends, then use `start + 1` and `stop - 1`. |

For target `16` in `[6, 8, 16]`, binary search first checks the middle area `8`. Because `16 > 8`, the next range is `[2, 2]`, which contains only `16`. For target `7`, the ranges are `[0, 2] → [0, 0] → [1, 0]`; the final interval is empty and returns `False`.

The middle index must leave the next range. On a two-card catalog `[6, 8]`, searching for `9` checks index `0`. Calling again with `[middle, high] = [0, 1]` would repeat the same question forever. The correct right range is `[middle + 1, high] = [1, 1]`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Parameterizing a Recursion

Section 4.5's unnumbered heading, **“Parameterizing a Recursion,”** asks us to find subproblems with the same general structure as the original problem. Trying a few concrete inputs can reveal what information a recursive call needs. Sometimes the original function must be restated with additional parameters.

<span id="part-2-subproblem"></span>

### 1. Describe a smaller problem of the same kind

The public question “Does this sorted catalog contain area `16 cm²`?” appears to need just a list and a target. A recursive call asks a more precise version of the *same* question: “Does the portion from index `low` through index `high` contain `16 cm²`?”

```text
Public question:       contains_area(areas, target)
Recursive subproblem:  _contains_area(areas, target, low, high)
```

The list and target stay fixed. The two bounds say which entries remain eligible. The book develops this idea with `binary_search(data, target, low, high)` instead of only `binary_search(data, target)`; `contains_area` is our card-workshop name for the same search pattern.

| Search for `16 cm²` | Inclusive bounds | Middle area | Action |
| :--- | :--- | ---: | :--- |
| First call | `[0, 2]` | `8 cm²` at index `1` | Keep the right portion. |
| Second call | `[2, 2]` | `16 cm²` at index `2` | Return `True`. |

The bounds make the smaller question explicit while retaining the same sorted list.

<span id="part-2-bounds"></span>

### 2. Search by changing bounds, without copying the list

Python can create a half-list using a slice, but a slice copies its selected entries. If each recursive step copies about half its current list, the copies across one search path involve about `n/2 + n/4 + n/8 + ⋯` entries, which grows as **`O(n)`**. The comparisons still take `O(log n)` steps, but this repeated copying makes the whole slicing version `O(n)` time in the worst case. This cost calculation explains the book's warning that copying a half-list loses binary search's intended benefit.

Passing `low` and `high` reuses the **same indexable list** at every step. Each call performs a constant amount of local work and cuts the remaining candidate range roughly in half, giving **`O(log n)`** search time and **`O(log n)`** recursive stack space in the worst case. Sorted order is required: comparing with the middle cannot safely discard a half of an unsorted catalog.

<span id="part-2-wrapper"></span>

### 3. Keep the public call simple

A caller should not need to calculate the first bounds for an ordinary search. A **public wrapper** can set those bounds once and call a **nonpublic recursive helper**:

```python
def contains_area(areas, target):
    return _contains_area(areas, target, 0, len(areas) - 1)
```

The leading underscore in `_contains_area` is a Python naming convention indicating an internal helper. The helper receives the changing bounds; the caller writes `contains_area([6, 8, 16], 16)`. For an empty list, the wrapper passes `(0, -1)`, which immediately reaches the helper's base case.

<span id="part-2-other"></span>

### 4. Recognize other parameter and return-value designs

The book also points back to these chapter examples. Their changing parameters identify the smaller problem without building a fresh list for every call:

| Book example | What its extra information means | Card-workshop view |
| :--- | :--- | :--- |
| `linear_sum(S, n)` | The first `n` sequence values. | Sum the first `n` of `[6, 8, 16]`. |
| `reverse(S, start, stop)` | A half-open interval `[start, stop)`. | Swap the two outer cards, then move inward. |
| `binary_sum(S, start, stop)` | A half-open interval that can split in two. | Sum left and right portions of the same area list. |

Another design move is to strengthen the **returned answer**. The book refers to `good_fibonacci(n)`, which returns both `(F(n), F(n - 1))` so the next call can form a new value from one recursive result. At `n = 0`, its base pair is `(0, 0)` by the chapter's convention. In our earlier card-row activity, row 0 has zero `A` cards, row 1 has one, and each later row has the sum of the previous two counts. Thus `good_fibonacci(6) = (8, 5)` says row 6 uses eight `A` cards, with total area `8 × 6 = 48 cm²`. This Fibonacci row rule is separate from Section 4.4's doubling activity.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: One Connected Geometry Program

<span id="part-3-program"></span>

### 1. The complete program

The program applies Section 4.5's design advice to the same cards. The binary search assumes `areas` is sorted and returns a Boolean, as in the book. The reversal changes the supplied display list in place. The Fibonacci count is a separate card-row rule that illustrates the pair-return design.

```python
def _sum_prefix(areas, n):
    if n == 0:
        return 0
    return _sum_prefix(areas, n - 1) + areas[n - 1]


def total_area(areas):
    return _sum_prefix(areas, len(areas))


def _contains_area(areas, target, low, high):
    if low > high:
        return False
    middle = (low + high) // 2
    if areas[middle] == target:
        return True
    if target < areas[middle]:
        return _contains_area(areas, target, low, middle - 1)
    return _contains_area(areas, target, middle + 1, high)


def contains_area(areas, target):
    return _contains_area(areas, target, 0, len(areas) - 1)


def _reverse_display(labels, start, stop):
    if stop - start <= 1:
        return
    labels[start], labels[stop - 1] = labels[stop - 1], labels[start]
    _reverse_display(labels, start + 1, stop - 1)


def reverse_display(labels):
    _reverse_display(labels, 0, len(labels))


def good_fibonacci(n):
    if n < 0:
        raise ValueError("row number must be nonnegative")
    if n <= 1:
        return (n, 0)
    previous, before_previous = good_fibonacci(n - 1)
    return (previous + before_previous, previous)


cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
labels = ["A", "B", "C"]
areas = [cards[label][0] * cards[label][1] for label in labels]

print("sorted areas:", areas, "cm^2")
print("total area:", total_area(areas), "cm^2")
print("contains 16 cm^2:", contains_area(areas, 16))
print("contains 7 cm^2:", contains_area(areas, 7))
print("empty catalog contains 6 cm^2:", contains_area([], 6))

reverse_display(labels)
print("reversed display:", labels)

row_6_pair = good_fibonacci(6)
print("row 6 count pair:", row_6_pair)
print("row 6 A-card area:", row_6_pair[0] * areas[0], "cm^2")
```

<span id="part-3-results"></span>

### 2. Follow the results

Running the complete program prints:

```text
sorted areas: [6, 8, 16] cm^2
total area: 30 cm^2
contains 16 cm^2: True
contains 7 cm^2: False
empty catalog contains 6 cm^2: False
reversed display: ['C', 'B', 'A']
row 6 count pair: (8, 5)
row 6 A-card area: 48 cm^2
```

`total_area` reaches its zero-area base case. `contains_area` retains the same sorted list while its helper shrinks the inclusive bounds. `reverse_display` moves its half-open bounds inward. `good_fibonacci` carries two related counts upward in one return value; multiplying its first component by `A`'s `6 cm²` area gives `48 cm²` for row 6.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What happens when there are no cards?</strong></summary>

**Scenario:** The area catalog is empty, so we ask for its total and search it for `6 cm²`.

**Check:** `total_area([])` reaches `n = 0` and returns `0 cm²`. `contains_area([], 6)` starts its helper with `low = 0`, `high = -1`, and returns `False` immediately.

**Lesson:** A direct base answer should handle the smallest valid input without reading an element that is absent.

</details>

<details>
<summary><strong>Case Study 2: How does a missing area prove progress?</strong></summary>

**Scenario:** Search the sorted `[6, 8, 16]` cm² catalog for `7 cm²`.

**Check:** The middle area `8` leaves the inclusive range `[0, 0]`. The area `6` then leaves `[1, 0]`. The candidate counts go `3 → 1 → 0`, so the base case returns `False`.

**Lesson:** Track a shrinking measure on each possible branch; a missing target must still terminate.

</details>

<details>
<summary><strong>Case Study 3: Why keep the catalog sorted?</strong></summary>

**Scenario:** Store the same areas as `[16, 6, 8]` and ask whether `16 cm²` is present.

**Check:** Binary search sees middle value `6`, follows the right side, checks `8`, and returns `False` even though `16` is at index `0`. Sorting the values to `[6, 8, 16]` restores the search's assumption.

**Lesson:** Correct recursive bounds depend on the problem's preconditions, including sorted order here.

</details>

<details>
<summary><strong>Case Study 4: Why carry bounds instead of slicing?</strong></summary>

**Scenario:** Imagine a much larger sorted catalog of card areas. Each search step either passes the original list with new bounds or creates a sliced half-list.

**Check:** Bounds require only two changed integers per call. Slicing copies roughly `n/2`, then `n/4`, then `n/8`, and so on, for `O(n)` copied entries along a worst-case path.

**Lesson:** Parameters can express a smaller problem while preserving the work saved by halving the search range.

</details>

<details>
<summary><strong>Case Study 5: Why return two card-row counts?</strong></summary>

**Scenario:** Find the number of `A` cards in Fibonacci row 6 and the area those cards cover.

**Check:** `good_fibonacci(5)` returns `(5, 3)`. One addition makes row 6's pair `(5 + 3, 5) = (8, 5)`. Eight `A` cards cover `8 × 6 = 48 cm²` of combined card area.

**Lesson:** Returning the current and previous values together can supply the information the next recursive step needs without a second recursive branch.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 4.5 idea | Plain-language meaning | Rectangle-card reminder |
| :--- | :--- | :--- |
| **Base cases** | Answer smallest inputs directly, without recursion. | Zero areas sum to `0 cm²`; an empty search interval returns `False`. |
| **Progress on every path** | Every continuing call moves closer to a base case. | Search ranges for `7 cm²` shrink from three candidates to one to zero. |
| **Same-shaped subproblem** | Keep asking the original kind of question about a smaller portion. | Search one portion of `[6, 8, 16]` for the same target. |
| **Extra parameters** | Carry the state needed to identify that portion. | `low` and `high` mark the current inclusive search range. |
| **Wrapper and helper** | Let callers use a simple signature while an internal function manages changing state. | `contains_area(areas, 16)` initializes helper bounds to `[0, 2]`. |
| **Richer return value** | Return related information that a later step needs. | `good_fibonacci(6) = (8, 5)` gives eight `A` cards and a `48 cm²` row area. |

The book's Section 4.5 presents the general design method and names earlier chapter algorithms. The rectangle calculations and wrapper names here make that method concrete; they are study adaptations of the source ideas.

[🔝 Back to Top](#top)
