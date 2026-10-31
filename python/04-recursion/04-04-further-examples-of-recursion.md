<span id="top"></span>

# 4.4 Further Examples of Recursion — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.4, printed pages 169–176 (the supplied PDF).  
> **Topic:** 4.4 Further Examples of Recursion; 4.4.1 Linear Recursion; 4.4.2 Binary Recursion; 4.4.3 Multiple Recursion.  
> **Domain Focus:** Rectangular-card areas, display order, doubling rows of cards, balanced area sums, and arrangements of distinct cards.  
> **User Prompt:** Reexplain [`Section 4.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: One Card Workshop, Different Call Shapes](#background)
   - [1. Reuse the same rectangles](#background-cards)
   - [2. What does a call shape describe?](#background-shapes)
2. [Part 1: 4.4 Further Examples of Recursion](#part-1)
   - [1. Linear, binary, and multiple recursion](#part-1-kinds)
   - [2. Shape does not by itself give the running time](#part-1-work)
3. [Part 2: 4.4.1 Linear Recursion](#part-2)
   - [1. Sum card areas one at a time](#part-2-sum)
   - [2. Reverse the display order](#part-2-reverse)
   - [3. Compute powers by one-step recursion](#part-2-power-linear)
   - [4. Compute powers by repeated squaring](#part-2-power-fast)
4. [Part 3: 4.4.2 Binary Recursion](#part-3)
   - [1. Split an area list into two halves](#part-3-split)
   - [2. Compare work and active depth](#part-3-analysis)
5. [Part 4: 4.4.3 Multiple Recursion](#part-4)
   - [1. Visit many children or choices](#part-4-choices)
   - [2. Solve a card-order puzzle by backtracking](#part-4-puzzle)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Follow the results](#part-5-results)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Card Workshop, Different Call Shapes

<span id="background-cards"></span>

### 1. Reuse the same rectangles

We continue the display-board activity from Sections 4.1–4.3. Three distinct rectangular cards have these measurements:

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

Their card areas total `6 + 8 + 16 = 30 cm²`. We will add a **second physical copy of `A`** only when a four-item list makes the two-halves example easier to see; that list totals `36 cm²`. Two copies contribute two areas, even though both have value `6 cm²`.

For this doubling activity, **round 0 starts with one copy of `A`**. Each round doubles the number of copies, so after `n` rounds there are `2^n` copies, and their combined area is `6 × 2^n cm²`. This is a chosen workshop rule used to give the book's power algorithm a geometric meaning.

<span id="background-shapes"></span>

### 2. What does a call shape describe?

A recursive call may start no smaller calls, one smaller call, two smaller calls, or a choice-dependent number. The **shape** of the call tree tells us how many child calls an activation can start. Its **depth** tells us how many calls can be waiting at once. The **total work** depends on all activations and the work inside each one.

```text
one branch:    problem → smaller → smaller → base
two branches:  problem → left and right halves
many branches: choose A, B, or C → continue each possible order
```

These shapes help us read code, but they do not replace an analysis of the actual input sizes and operations.

> **Mental model:** Count how many recursive calls each activation can make, how much smaller their inputs are, and how deep the calls can go.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 4.4 Further Examples of Recursion

<span id="part-1-kinds"></span>

### 1. Linear, binary, and multiple recursion

The book classifies recursion by the **maximum recursive calls made by one activation**:

| Kind | Recursive calls per activation | Book example | Card-workshop use |
| :--- | :--- | :--- | :--- |
| **Linear** | At most one. | `linear_sum`, `reverse`, `power`, or binary search. | Add the next card area or move inward from both ends of a row. |
| **Binary** | Two in a non-base case. | `binary_sum`. | Add the left and right halves of an area list. |
| **Multiple** | Potentially more than two. | File-system traversal or `PuzzleSolve`. | Explore each available card as the next display position. |

**Binary search is linear recursion:** it has a possible left branch and a possible right branch in its code, but each activation chooses only **one** of them. The word “binary” in binary search describes its two-way decision and halved candidate range, not two recursive calls from one activation.

<span id="part-1-work"></span>

### 2. Shape does not by itself give the running time

| Algorithm | Call shape | Why its work grows as stated |
| :--- | :--- | :--- |
| `linear_sum` | One call on `n − 1` entries. | `O(n)` calls and time. |
| Binary search | One call on about half the candidates. | `O(log n)` calls and time. |
| Repeated-squaring `power` | One call on exponent `n // 2`. | `O(log n)` calls and time. |
| `binary_sum` | Two calls on disjoint halves. | `O(n)` total calls and time. |

These bounds use the book's simple operation-count model. A linear **chain of calls** can have logarithmic time when the problem halves at each step. A binary **tree of calls** can still have linear total time when its leaves divide the original data without repeating work.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 4.4.1 Linear Recursion

<span id="part-2-sum"></span>

### 1. Sum card areas one at a time

The book's `linear_sum(S, n)` adds the **first `n` elements** of a sequence. For `n = 0`, the sum is `0`. Otherwise, sum the first `n − 1` elements and add the last of the `n` elements:

```python
def linear_sum(areas, n):
    if n == 0:
        return 0
    return linear_sum(areas, n - 1) + areas[n - 1]
```

With card areas `[6, 8, 16]` cm², the calls go from `n = 3` to `2`, `1`, and `0`. The returns build the answer upward:

| Returning call | Added area | Returned total |
| :--- | ---: | ---: |
| `linear_sum(areas, 0)` | None | 0 cm² |
| `linear_sum(areas, 1)` | `A`: 6 cm² | 6 cm² |
| `linear_sum(areas, 2)` | `B`: 8 cm² | 14 cm² |
| `linear_sum(areas, 3)` | `C`: 16 cm² | 30 cm² |

There are `n + 1` calls including the base call. With constant local work per call, time is **`O(n)`**; because all calls can be active before any returns, the call stack also uses **`O(n)`** space. The area `30 cm²` is the result, not a count of calls.

<span id="part-2-reverse"></span>

### 2. Reverse the display order

The book's `reverse(S, start, stop)` uses a **half-open range** `[start, stop)`. Swap the two ends, then recurse on the range with both ends removed. A range containing zero or one item needs no swap.

```python
def reverse(labels, start, stop):
    if start < stop - 1:
        labels[start], labels[stop - 1] = labels[stop - 1], labels[start]
        reverse(labels, start + 1, stop - 1)
```

Starting with `['A', 'B', 'C']`, the call `(0, 3)` swaps `A` and `C`, giving `['C', 'B', 'A']`. The next call `(1, 2)` sees the single middle card `B` and stops. The left-to-right display changes, while the total card area remains **30 cm²**.

For `n` items, this routine makes `1 + ⌊n/2⌋` calls, including the final base call, and at most `⌊n/2⌋` swaps. Its time and recursive stack use are both **`O(n)`**.

<span id="part-2-power-linear"></span>

### 3. Compute powers by one-step recursion

To calculate `x^n` for nonnegative `n`, the book first uses `x⁰ = 1` and `x^n = x × x^(n − 1)`. Give this version a distinct name so we can compare it with the faster version:

```python
def power_linear(x, n):
    if n == 0:
        return 1
    return x * power_linear(x, n - 1)
```

If the number of `A` cards doubles each round, after five rounds there are `2⁵ = 32` copies. Their combined area is `32 × 6 = 192 cm²`. `power_linear(2, 5)` follows `5 → 4 → 3 → 2 → 1 → 0`, making six calls and five multiplications. Generally it makes `n + 1` calls, with **`O(n)`** time and stack use under the book's arithmetic model.

<span id="part-2-power-fast"></span>

### 4. Compute powers by repeated squaring

The faster version uses `x^n = (x^(⌊n/2⌋))²` when `n` is even. When `n` is odd, multiply that square by one more `x`. It computes the half-power **once** and saves it as `partial`:

```python
def power_fast(x, n):
    if n == 0:
        return 1
    partial = power_fast(x, n // 2)
    result = partial * partial
    if n % 2 == 1:
        result *= x
    return result
```

For the same five doubling rounds, the exponents on the call chain are `5 → 2 → 1 → 0`. Returning gives `1`, then `2`, then `4`, then `4² × 2 = 32` copies of `A`, still **192 cm²**. Halving the exponent gives **`O(log n)`** time and stack use for positive `n`, assuming each arithmetic operation has constant cost.

Calling `power_fast(x, n // 2)` **twice** would recompute the same half-power and lose this logarithmic call count. The book explicitly warns about that tempting expression. Both versions compute the same mathematical power; the saved `partial` changes how much work is repeated.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 4.4.2 Binary Recursion

<span id="part-3-split"></span>

### 1. Split an area list into two halves

The book's `binary_sum(S, start, stop)` sums a **half-open range** `[start, stop)`. An empty range gives `0`, and a single item gives that item. Otherwise, the function splits at the middle and makes **two** recursive calls, one for each half:

```python
def binary_sum(areas, start, stop):
    if start >= stop:
        return 0
    if start == stop - 1:
        return areas[start]
    middle = (start + stop) // 2
    return binary_sum(areas, start, middle) + binary_sum(areas, middle, stop)
```

Add one more physical copy of `A` to make four area entries: `[6, 8, 16, 6]` cm². The last `6` is another card, so it must be included in the total.

```text
areas[0:4] = 36 cm²
├── areas[0:2] = 6 + 8 = 14 cm²
│   ├── areas[0:1] = 6 cm²
│   └── areas[1:2] = 8 cm²
└── areas[2:4] = 16 + 6 = 22 cm²
    ├── areas[2:3] = 16 cm²
    └── areas[3:4] = 6 cm²
```

This tree has four single-item leaves and three combining calls: **seven calls** in all. A path from the root to a leaf has **three active calls**.

<span id="part-3-analysis"></span>

### 2. Compare work and active depth

For `n` elements when `n` is a power of two, the book counts `2n − 1` calls, **`O(n)` time**, and **`O(log n)`** recursive stack space. Splitting both halves produces about `log₂ n` levels; the total work remains linear because every element appears in one leaf, and the halves do not overlap.

| Method on four card areas | Returned total | Calls including base calls | Maximum active calls |
| :--- | ---: | ---: | ---: |
| `linear_sum(areas, 4)` | 36 cm² | 5 | 5 |
| `binary_sum(areas, 0, 4)` | 36 cm² | 7 | 3 |

The binary version makes more calls on this small input, but its balanced call tree is shallower. Both methods take `O(n)` total time under the book's model. For an empty input, the binary routine's explicit base case returns `0` in one call.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 4.4.3 Multiple Recursion

<span id="part-4-choices"></span>

### 1. Visit many children or choices

**Multiple recursion** allows an activation to make more than two recursive calls. The earlier `disk_usage` example can visit every child of a directory, however many there are. Section 4.4 also gives `PuzzleSolve(k, S, U)`: `S` holds the choices already made, `U` holds unused choices, and `k` is the number of positions still to fill. For each available choice, it tries a smaller puzzle with `k − 1` positions left.

The number of children depends on the problem. A directory traversal still visits each file-system entry once. A choice puzzle can branch into many **different arrangements**. The branching count alone therefore does not determine one universal time bound for multiple recursion.

<span id="part-4-puzzle"></span>

### 2. Solve a card-order puzzle by backtracking

Arrange the distinct cards `A`, `B`, and `C` left to right. Our workshop's **solution rule** is that card areas must increase strictly from left to right. The book's general puzzle routine tests completed candidates; the increasing-area rule is our geometry test.

```text
Start: S = [], U = [A, B, C], k = 3
Choose a card → append it to S → remove it from U → solve k − 1
After that branch → remove it from S → restore it to U
At k = 0 → test the completed order
```

Restoring the state after a branch is **backtracking**. It lets the next branch choose from the same set of remaining cards. The six full orders are `ABC`, `ACB`, `BAC`, `BCA`, `CAB`, and `CBA`. All use the same three cards and sum to `30 cm²`; only `ABC` has areas `6 < 8 < 16` from left to right.

| Chosen positions | Candidate prefixes explored | Count |
| ---: | :--- | ---: |
| 0 | Empty prefix. | 1 |
| 1 | `A`, `B`, or `C`. | 3 |
| 2 | Two distinct cards in order. | 6 |
| 3 | All three cards in order. | 6 |

Our study version explores **all six** complete candidates and collects the valid ones, making `1 + 3 + 6 + 6 = 16` puzzle calls. The book tests a completed candidate inside the `k = 1` call, after choosing its final item, and can return as soon as it finds a solution. Our program makes one extra call at `k = 0` for each completed candidate before testing it. Thus, the book's three-card call tree has `1 + 3 + 6 = 10` calls, while this program has 16. More generally, trying all ordered, nonrepeating length-`k` choices from `m` distinct items has `m! / (m − k)!` complete candidates. This is a **derived count for exhaustive search**, not a complexity claim stated for `PuzzleSolve` in the book; an early return or pruning rule can visit fewer candidates.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. The complete program

This runnable version adds a `stats` argument to count **algorithm calls** and maximum active depth. The helper `enter` only records those measurements; its own calls are excluded. The card-order routine uses `pop` and `insert` to restore available choices after each branch, making the book's backtracking idea safe and deterministic in Python.

```python
def new_stats():
    return {"calls": 0, "max_depth": 0, "candidates": 0}


def enter(stats, depth):
    stats["calls"] += 1
    stats["max_depth"] = max(stats["max_depth"], depth)


def linear_sum(values, n, stats, depth=1):
    enter(stats, depth)
    if n == 0:
        return 0
    return linear_sum(values, n - 1, stats, depth + 1) + values[n - 1]


def reverse(values, start, stop, stats, depth=1):
    enter(stats, depth)
    if start < stop - 1:
        values[start], values[stop - 1] = values[stop - 1], values[start]
        reverse(values, start + 1, stop - 1, stats, depth + 1)


def power_linear(x, n, stats, depth=1):
    enter(stats, depth)
    if n == 0:
        return 1
    return x * power_linear(x, n - 1, stats, depth + 1)


def power_fast(x, n, stats, depth=1):
    enter(stats, depth)
    if n == 0:
        return 1
    partial = power_fast(x, n // 2, stats, depth + 1)
    result = partial * partial
    if n % 2 == 1:
        result *= x
    return result


def binary_sum(values, start, stop, stats, depth=1):
    enter(stats, depth)
    if start >= stop:
        return 0
    if start == stop - 1:
        return values[start]
    middle = (start + stop) // 2
    return (binary_sum(values, start, middle, stats, depth + 1)
            + binary_sum(values, middle, stop, stats, depth + 1))


def solve_orders(k, chosen, available, area_by_card, solutions, stats, depth=1):
    enter(stats, depth)
    if k == 0:
        stats["candidates"] += 1
        if all(area_by_card[chosen[i]] < area_by_card[chosen[i + 1]]
               for i in range(len(chosen) - 1)):
            solutions.append(tuple(chosen))
        return
    for index in range(len(available)):
        card = available.pop(index)
        chosen.append(card)
        solve_orders(k - 1, chosen, available, area_by_card,
                     solutions, stats, depth + 1)
        chosen.pop()
        available.insert(index, card)


cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
area_by_card = {label: width * height for label, (width, height) in cards.items()}
areas = [area_by_card[label] for label in ("A", "B", "C")]

linear_stats = new_stats()
linear_total = linear_sum(areas, len(areas), linear_stats)
print("linear total:", linear_total, "cm^2 | calls:", linear_stats["calls"],
      "| depth:", linear_stats["max_depth"])

display = ["A", "B", "C"]
reverse_stats = new_stats()
reverse(display, 0, len(display), reverse_stats)
print("reversed display:", display, "| calls:", reverse_stats["calls"],
      "| depth:", reverse_stats["max_depth"])

linear_power_stats = new_stats()
fast_power_stats = new_stats()
copies_linear = power_linear(2, 5, linear_power_stats)
copies_fast = power_fast(2, 5, fast_power_stats)
print("doubling copies:", copies_linear, "| linear calls:", linear_power_stats["calls"],
      "| fast calls:", fast_power_stats["calls"])
print("doubled-row area:", copies_fast * area_by_card["A"], "cm^2")

four_areas = areas + [area_by_card["A"]]  # a second physical A card
binary_stats = new_stats()
binary_total = binary_sum(four_areas, 0, len(four_areas), binary_stats)
print("binary total:", binary_total, "cm^2 | calls:", binary_stats["calls"],
      "| depth:", binary_stats["max_depth"])

chosen = []
available = ["A", "B", "C"]
solutions = []
puzzle_stats = new_stats()
solve_orders(3, chosen, available, area_by_card, solutions, puzzle_stats)
print("card orders tested:", puzzle_stats["candidates"], "| puzzle calls:", puzzle_stats["calls"])
print("increasing-area order:", solutions)
print("restored state:", chosen, available)
```

<span id="part-5-results"></span>

### 2. Follow the results

```text
linear total: 30 cm^2 | calls: 4 | depth: 4
reversed display: ['C', 'B', 'A'] | calls: 2 | depth: 2
doubling copies: 32 | linear calls: 6 | fast calls: 4
doubled-row area: 192 cm^2
binary total: 36 cm^2 | calls: 7 | depth: 3
card orders tested: 6 | puzzle calls: 16
increasing-area order: [('A', 'B', 'C')]
restored state: [] ['A', 'B', 'C']
```

The output separates **geometric answers** from call counts. The `30 cm²` and `36 cm²` totals count three and four physical cards respectively. Both power methods find 32 copies, but halving the exponent reduces the call chain. The puzzle explores six completed card orders and restores its working lists before finishing.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What is the total area of no cards?</strong></summary>

**Scenario:** The selected card list is empty.

**Check:** `linear_sum([], 0)` returns `0` from its direct base case. `binary_sum([], 0, 0)` also returns `0` from its empty-range base case. Neither tries to read a card that is not present.

**Lesson:** A base case should give the mathematically correct answer for the smallest input.

</details>

<details>
<summary><strong>Case Study 2: What happens to the middle card when reversing?</strong></summary>

**Scenario:** The display row is `A, B, C`.

**Check:** Swap `A` with `C`; the recursive range then contains only `B`, so no further swap is needed. The row becomes `C, B, A`, while its total physical card area remains `6 + 8 + 16 = 30 cm²`.

**Lesson:** The implicit zero-or-one-item base keeps the middle item in place.

</details>

<details>
<summary><strong>Case Study 3: Why save the half-power?</strong></summary>

**Scenario:** Double copies of card `A` for five rounds.

**Check:** `power_fast(2, 5)` follows exponents `5 → 2 → 1 → 0`, returns `32`, and gives `32 × 6 = 192 cm²` of card area. Saving the result for exponent `2` lets the caller square it. Calling that half-power function twice would repeat the same recursion and lose the logarithmic work bound.

**Lesson:** Reuse a returned value when both sides of a formula need the same smaller answer.

</details>

<details>
<summary><strong>Case Study 4: Can more calls still mean a smaller stack?</strong></summary>

**Scenario:** Sum four physical cards with areas `[6, 8, 16, 6]` cm².

**Check:** `linear_sum` makes five calls on a chain and reaches depth five. `binary_sum` makes seven calls across a tree but reaches depth three. Both return `36 cm²` and have `O(n)` time; the balanced version uses `O(log n)` recursive stack space.

**Lesson:** Total calls and maximum active depth measure different costs.

</details>

<details>
<summary><strong>Case Study 5: Why restore cards after a trial order?</strong></summary>

**Scenario:** The puzzle tests all left-to-right orders of `A`, `B`, and `C` for strictly increasing area.

**Check:** Every branch chooses a card, tries the rest, then restores the chosen and available lists. This reaches all six distinct orders. Only `ABC` passes `6 < 8 < 16`. If a branch failed to restore a card, later branches would start with an incomplete choice set and could miss valid orders.

**Lesson:** Backtracking must leave the state ready for the next alternative.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 4.4 idea | Plain-language meaning | Rectangle-card reminder |
| :--- | :--- | :--- |
| **Linear recursion** | Each activation makes at most one recursive call. | `linear_sum` adds one area at a time; binary search is also linear recursion. |
| **Sequence sum** | Add the first `n − 1` values, then the last value. | `6 + 8 + 16 = 30 cm²`, with four calls for three cards. |
| **Sequence reversal** | Swap both ends and recurse inward. | `ABC` becomes `CBA`; total card area stays 30 cm². |
| **Repeated squaring** | Reuse one half-power and square it. | `2⁵ = 32` copies of `A` occupy 192 cm² of combined card area. |
| **Binary recursion** | Split into two recursive subproblems. | `binary_sum([6, 8, 16, 6]) = 36 cm²` in seven calls with depth three. |
| **Multiple recursion** | Try every child or available choice. | The card-order puzzle explores six complete orders and accepts `ABC`. |
| **Time versus stack space** | Count all work for time; count active depth for recursive stack use. | Linear and binary sums both take `O(n)` time, but their stack depths differ. |

**Keep the source algorithms and the geometry study cases distinct.** The book's sequence algorithms work on general values, and `PuzzleSolve` uses a general solution test. Card areas supply concrete values and one clearly stated layout rule so each recursive step can be checked.

[🔝 Back to Top](#top)
