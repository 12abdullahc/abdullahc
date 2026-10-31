<span id="top"></span>

# 4.3 Recursion Run Amok — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.3, printed pages 165–168 (the supplied PDF).  
> **Topic:** 4.3 Recursion Run Amok; An Inefficient Recursion for Computing Fibonacci Numbers; An Efficient Recursion for Computing Fibonacci Numbers; 4.3.1 Maximum Recursive Depth in Python.  
> **Domain Focus:** Rectangle-card areas, Fibonacci-sized rows of cards on a display board, and a sorted area catalog.  
> **User Prompt:** Reexplain [`Section 4.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Card Workshop's New Problem](#background)
   - [1. Keep the same rectangles](#background-cards)
   - [2. Correct recursion can still repeat work](#background-work)
2. [Part 1: 4.3 Recursion Run Amok — Checking Uniqueness](#part-1)
   - [1. Ask whether card areas are all different](#part-1-unique)
   - [2. Trace overlapping calls and the worst case](#part-1-trace)
   - [3. Read the source code carefully](#part-1-source)
3. [Part 2: An Inefficient Recursion for Computing Fibonacci Numbers](#part-2)
   - [1. Define Fibonacci-sized card rows](#part-2-rows)
   - [2. See repeated subproblems and exponential calls](#part-2-calls)
4. [Part 3: An Efficient Recursion for Computing Fibonacci Numbers](#part-3)
   - [1. Return the current and previous counts together](#part-3-pair)
   - [2. Compare answers and work](#part-3-compare)
5. [Part 4: 4.3.1 Maximum Recursive Depth in Python](#part-4)
   - [1. Separate total calls from active depth](#part-4-depth)
   - [2. Fix a search range that does not shrink](#part-4-search)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace the output](#part-5-results)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Card Workshop's New Problem

<span id="background-cards"></span>

### 1. Keep the same rectangles

The earlier recursion guides used three distinct cards on a display board:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

Their areas are `[6, 8, 16]` cm². First we will test whether these **area values** are all different. Later, the workshop will plan rows made from copies of card `A`. Row 0 has zero copies, row 1 has one, and every later row uses the **sum of the copy counts in the previous two rows**. That is a chosen design rule for this study; rectangles do not inherently follow the Fibonacci sequence. Since each `A` has area `6 cm²`, a row with `F(n)` copies has card area `6F(n) cm²`.

<span id="background-work"></span>

### 2. Correct recursion can still repeat work

Section 4.2 counted the work done by recursive calls. Section 4.3 shows two ways recursion can cause trouble:

| Problem | What happens | Card-workshop example |
| :--- | :--- | :--- |
| **Repeated subproblems** | Separate branches solve the same smaller question again. | The area-uniqueness check revisits an overlapping range; naive Fibonacci recomputes earlier row counts. |
| **Missing progress** | A call repeats the same state instead of reaching a base case. | A mistaken binary-search bound keeps the same two candidate areas. |

The first problem wastes work even when the result is correct. The second prevents the recursion from finishing. A finite Python recursion limit eventually interrupts a nonterminating call chain, but it does not repair the algorithm.

> **Mental model:** Trace which smaller inputs each call receives. Repeated inputs waste work; an unchanged input can prevent the base case from being reached.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 4.3 Recursion Run Amok — Checking Uniqueness

<span id="part-1-unique"></span>

### 1. Ask whether card areas are all different

The book's `unique3` asks whether all elements in a sequence are distinct. It examines a **half-open range** `[start, stop)`: the first `n − 1` elements, then the last `n − 1` elements, then the two endpoints. A range of zero or one element is automatically unique.

```python
def unique3(areas, start, stop):
    if stop - start <= 1:
        return True
    if not unique3(areas, start, stop - 1):
        return False
    if not unique3(areas, start + 1, stop):
        return False
    return areas[start] != areas[stop - 1]
```

For `[6, 8, 16]` cm², the first two values are distinct, the last two values are distinct, and the endpoints `6` and `16` differ, so the answer is `True`. The method is logically complete: any pair is either inside one of the two shorter ranges or is the pair of endpoints.

<span id="part-1-trace"></span>

### 2. Trace overlapping calls and the worst case

The two ranges **overlap**. With three values, the middle singleton `[8]` is checked in both branches:

```text
[6, 8, 16]
├── [6, 8]
│   ├── [6]
│   └── [8]  ← first check
└── [8, 16]
    ├── [8]  ← same smaller question again
    └── [16]
```

When all values are distinct, neither recursive branch can stop early. If `C(n)` counts calls on a nonempty range of length `n`, then `C(1) = 1` and `C(n) = 1 + 2C(n − 1)`. Thus `C(n) = 2^n − 1`: three distinct areas need **seven calls**, and four distinct areas need **15 calls**. This is exponential worst-case work, `O(2^n)`. A duplicate can cause an early `False` and fewer calls, so the exact formula describes the **all-distinct case**, not every input.

<span id="part-1-source"></span>

### 3. Read the source code carefully

In the supplied PDF's Code Fragment 4.6, the function is named `unique3`, but its two recursive lines say `unique(...)`. The explanation and intended algorithm require self-calls, so the runnable study code above calls `unique3(...)`. This corrects the printed name mismatch rather than introducing a different algorithm.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: An Inefficient Recursion for Computing Fibonacci Numbers

<span id="part-2-rows"></span>

### 1. Define Fibonacci-sized card rows

The **Fibonacci numbers** start with `F(0) = 0` and `F(1) = 1`. For `n ≥ 2`, each is the sum of the previous two: `F(n) = F(n − 1) + F(n − 2)`. For our study, row `n` of the display board contains `F(n)` copies of card `A`. Each copy has area `6 cm²`.

| Row `n` | Copies of `A`: `F(n)` | Total card area |
| ------: | -------------------: | --------------: |
| 0 | 0 | 0 cm² |
| 1 | 1 | 6 cm² |
| 2 | 1 | 6 cm² |
| 3 | 2 | 12 cm² |
| 4 | 3 | 18 cm² |
| 5 | 5 | 30 cm² |
| 6 | 8 | 48 cm² |

This row rule supplies a geometric picture for the numbers. The book computes the Fibonacci **number**; multiplying by `6 cm²` afterward gives our row's total card area. For row 6, both algorithms below should return `F(6) = 8`, so its area is `8 × 6 = 48 cm²`.

<span id="part-2-calls"></span>

### 2. See repeated subproblems and exponential calls

The book's `bad_fibonacci(n)` directly follows the mathematical formula: for `n ≥ 2`, call itself for `n − 2` and again for `n − 1`, then add the answers. This is easy to read but recomputes the same smaller values.

```python
def bad_fibonacci(n):
    if n <= 1:
        return n
    return bad_fibonacci(n - 2) + bad_fibonacci(n - 1)
```

For `F(6)`, one branch computes `F(4)`, while the `F(5)` branch also computes `F(4)`:

```text
F(6)
├── F(4)
└── F(5)
    ├── F(3)
    └── F(4)  ← repeated, along with its smaller calls
```

Let `C(n)` count **all** calls. Then `C(0) = C(1) = 1` and `C(n) = 1 + C(n − 2) + C(n − 1)` for `n ≥ 2`.

| `n` | `F(n)` | Calls made by `bad_fibonacci(n)` |
| --: | -----: | -------------------------------: |
| 0 | 0 | 1 |
| 1 | 1 | 1 |
| 2 | 1 | 3 |
| 3 | 2 | 5 |
| 4 | 3 | 9 |
| 5 | 5 | 15 |
| 6 | 8 | 25 |

For `n ≥ 2`, the call counts increase with `n`, so `C(n) > 2C(n − 2)`: the count more than doubles over two steps. This is **exponential growth**. The book gives an exponential lower bound, and the direct call tree also has an `O(2^n)` upper bound. The large call count is caused by repeated work, not by the value `8` or by the `48 cm²` geometry result.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: An Efficient Recursion for Computing Fibonacci Numbers

<span id="part-3-pair"></span>

### 1. Return the current and previous counts together

The book's `good_fibonacci(n)` returns a **pair** `(F(n), F(n − 1))`, so the caller receives both values needed for its addition. For `n = 0`, the book uses the convention `F(−1) = 0`, making the base pair `(0, 0)`.

```python
def good_fibonacci(n):
    if n <= 1:
        return (n, 0)
    previous, before_previous = good_fibonacci(n - 1)
    return (previous + before_previous, previous)
```

For example, the call for `n = 5` returns `(5, 3)`. The caller for `n = 6` forms `(5 + 3, 5) = (8, 5)`. The first component gives eight copies of `A` for row 6; the second keeps the previous count ready. Each positive `n` makes **one** recursive call to `n − 1` until reaching `1`.

<span id="part-3-compare"></span>

### 2. Compare answers and work

| Method for row 6 | Returned value | Calls | Geometry result |
| :--- | :--- | ---: | :--- |
| `bad_fibonacci(6)` | `8` | 25 | Eight `A` cards total 48 cm². |
| `good_fibonacci(6)` | `(8, 5)` | 6 | First component gives the same 48 cm². |

For positive `n`, the pair-returning version follows the chain `n, n − 1, ..., 1`, so it makes exactly `n` calls and takes **`O(n)` time** under the book's simple operation-count model. It avoids the repeated branches of the direct version without changing the Fibonacci sequence. Both functions assume a nonnegative integer input; the complete study program below checks that requirement explicitly.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 4.3.1 Maximum Recursive Depth in Python

<span id="part-4-depth"></span>

### 1. Separate total calls from active depth

**Maximum recursive depth** counts the calls simultaneously active along one path. A call that returns frees its place before a different branch runs. This differs from the **total number of calls** across the entire computation.

| Card-workshop calculation | Total calls | Maximum active algorithm calls |
| :--- | ---: | ---: |
| `unique3([6, 8, 16], 0, 3)` | 7 | 3 |
| `bad_fibonacci(6)` | 25 | 6 |
| `good_fibonacci(6)` | 6 | 6 |

Python places a limit on active recursive calls to protect its execution stack. The book describes a typical limit of roughly 1000 and shows `sys.getrecursionlimit()` to inspect the actual setting and `sys.setrecursionlimit(...)` to change it. The limit can vary by interpreter and environment. The book uses the broader name `RuntimeError` for excessive depth; current Python reports **`RecursionError`**, which is a subclass of `RuntimeError`. Raising the limit cannot fix repeated work or a call that never makes progress, and an excessively high setting can exhaust stack or memory.

<span id="part-4-search"></span>

### 2. Fix a search range that does not shrink

The book revisits recursive binary search to show how a small bound error can keep calling the same problem. Suppose the sorted card areas are `[6, 8]` cm² and we search for `9 cm²`:

| Step | Inclusive range `[low, high]` | Middle index and area | Right branch |
| ---: | :--- | :--- | :--- |
| 1 | `[0, 1]` | `0 → 6 cm²` | Wrong: `[mid, high] = [0, 1]`. |
| 2 | `[0, 1]` again | `0 → 6 cm²` again | The same call repeats. |

The correct right range is **`[mid + 1, high]`**. It moves from `[0, 1]` to `[1, 1]`, checks `8`, then moves to empty range `[2, 1]` and returns `False`. The mistaken range is shown only as a trace; the runnable program below does **not** execute unbounded recursion.

An algorithm can make very many calls while still reaching its base cases, as `bad_fibonacci` does. The faulty search does not reach its base case at all. Both deserve attention, but they require different fixes: eliminate repeated subproblems in the first case and make the input shrink in the second.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. The complete program

This runnable version counts calls and maximum active depth while it checks card areas and computes Fibonacci row sizes. The `unique3` self-calls use the intended name, correcting the mismatch in the PDF. The final two lines **calculate** a bad and a good binary-search range without recursively running the bad one. The monitoring helper's own calls are excluded from the displayed algorithm counts.

```python
def new_stats():
    return {"calls": 0, "max_depth": 0}


def enter(stats, depth):
    stats["calls"] += 1
    stats["max_depth"] = max(stats["max_depth"], depth)


def unique3(values, start, stop, stats, depth=1):
    enter(stats, depth)
    if stop - start <= 1:
        return True
    if not unique3(values, start, stop - 1, stats, depth + 1):
        return False
    if not unique3(values, start + 1, stop, stats, depth + 1):
        return False
    return values[start] != values[stop - 1]


def bad_fibonacci(n, stats, depth=1):
    if n < 0:
        raise ValueError("row number cannot be negative")
    enter(stats, depth)
    if n <= 1:
        return n
    return (bad_fibonacci(n - 2, stats, depth + 1)
            + bad_fibonacci(n - 1, stats, depth + 1))


def good_fibonacci(n, stats, depth=1):
    if n < 0:
        raise ValueError("row number cannot be negative")
    enter(stats, depth)
    if n <= 1:
        return (n, 0)
    previous, before_previous = good_fibonacci(n - 1, stats, depth + 1)
    return (previous + before_previous, previous)


cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 4)}
areas = {label: width * height for label, (width, height) in cards.items()}
distinct_areas = [areas["A"], areas["B"], areas["C"]]
repeated_area = [areas["B"], areas["D"], areas["A"], areas["C"]]

distinct_stats = new_stats()
distinct = unique3(distinct_areas, 0, len(distinct_areas), distinct_stats)
print(f"distinct areas: {distinct} | calls: {distinct_stats['calls']} | depth: {distinct_stats['max_depth']}")

repeated_stats = new_stats()
repeated = unique3(repeated_area, 0, len(repeated_area), repeated_stats)
print(f"with D: {repeated} | calls: {repeated_stats['calls']} | depth: {repeated_stats['max_depth']}")

bad_stats = new_stats()
bad_count = bad_fibonacci(6, bad_stats)
print(f"bad F(6): {bad_count} | calls: {bad_stats['calls']} | depth: {bad_stats['max_depth']}")

good_stats = new_stats()
good_pair = good_fibonacci(6, good_stats)
print(f"good F(6): {good_pair} | calls: {good_stats['calls']} | depth: {good_stats['max_depth']}")
print("row 6 card area:", good_pair[0] * areas["A"], "cm^2")

small_areas = [areas["A"], areas["B"]]
target_area = 9
low, high = 0, len(small_areas) - 1
middle = (low + high) // 2
# The target is larger than the middle area, so compare right ranges.
wrong_range = (middle, high)
correct_range = (middle + 1, high)
print("search", target_area, "cm^2 range:", (low, high), "| wrong:", wrong_range,
      "| correct:", correct_range)
```

<span id="part-5-results"></span>

### 2. Trace the output

```text
distinct areas: True | calls: 7 | depth: 3
with D: False | calls: 5 | depth: 4
bad F(6): 8 | calls: 25 | depth: 6
good F(6): (8, 5) | calls: 6 | depth: 6
row 6 card area: 48 cm^2
search 9 cm^2 range: (0, 1) | wrong: (0, 1) | correct: (1, 1)
```

The duplicate list starts with areas `8, 8`, so its first shorter range finds a duplicate and the larger call skips its second branch. Both Fibonacci versions give eight `A` cards and therefore `48 cm²`, but they do very different amounts of work. The equal old and wrong search ranges show exactly why that bound fails to progress.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Can distinct cards have repeated areas?</strong></summary>

**Scenario:** Add card `D`, measuring `2 × 4 cm`, beside card `B`, measuring `4 × 2 cm`.

**Check:** Both have area `8 cm²`, even though they are distinct cards with different orientations. The area list `[8, 8, 6, 16]` is therefore **not unique**. `unique3` finds the duplicate in its first shorter range and makes five calls in this order; four all-distinct areas would require 15 calls.

**Lesson:** State what is being compared—area values or physical card identities—and remember that early `False` results can shorten the run.

</details>

<details>
<summary><strong>Case Study 2: What changes when one Fibonacci row is added?</strong></summary>

**Scenario:** Row 6 has eight copies of card `A`, totaling `48 cm²`. The design rule makes row 7 use the counts from rows 6 and 5.

**Check:** `F(7) = 8 + 5 = 13`, so row 7 has `13 × 6 = 78 cm²` of card area. The direct recursion makes `C(7) = 1 + C(6) + C(5) = 1 + 25 + 15 = 41` calls. The pair-returning version makes seven calls.

**Lesson:** The returned count grows to 13 while the two algorithms' work grows very differently.

</details>

<details>
<summary><strong>Case Study 3: Why does the efficient function return a pair?</strong></summary>

**Scenario:** We want row 6's count from the previous row.

**Check:** `good_fibonacci(5)` gives `(5, 3)`. One addition produces `(8, 5)` for row 6. The caller gets both the current count and the count it will need at the next step, so it does not start a separate recursion for `F(4)`.

**Lesson:** A richer return value can prevent repeated subproblems while preserving the same final Fibonacci number.

</details>

<details>
<summary><strong>Case Study 4: Why does a two-area search never finish?</strong></summary>

**Scenario:** Search sorted areas `[6, 8]` cm² for `9 cm²`, but recurse right with `[mid, high]`.

**Check:** At range `[0, 1]`, `mid = 0` and area `6` is too small. The incorrect next range is again `[0, 1]`, so the state repeats. Using `[mid + 1, high]` gives `[1, 1]`, then an empty range after checking `8`.

**Lesson:** Every non-base recursive call must move toward a base case; raising Python's recursion limit would only delay this error.

</details>

<details>
<summary><strong>Case Study 5: Are total calls and maximum depth the same?</strong></summary>

**Scenario:** Compute the count for Fibonacci row 6 by both methods.

**Check:** The direct method makes 25 calls across its branching tree, but at most six are active on one path. The pair-returning method makes six calls in one chain, also reaching depth six. Both give eight copies of `A` and `48 cm²` of card area.

**Lesson:** Branching can multiply total work without increasing the length of the deepest active call chain.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 4.3 idea | Plain-language meaning | Rectangle-card reminder |
| :--- | :--- | :--- |
| **Overlapping uniqueness ranges** | Two recursive branches can recheck the same elements. | Three distinct areas `[6, 8, 16]` need seven `unique3` calls. |
| **Worst-case `unique3` work** | All-distinct input runs both branches and makes `2^n − 1` calls. | Four distinct card areas would need 15 calls. |
| **Direct Fibonacci recursion** | Computing `F(n − 2)` and `F(n − 1)` repeats smaller calculations. | `bad_fibonacci(6)` makes 25 calls to find eight copies of `A`. |
| **Pair-returning Fibonacci recursion** | Return `(F(n), F(n − 1))` from one smaller call. | `good_fibonacci(6)` makes six calls and gives `(8, 5)`. |
| **Maximum recursive depth** | Count simultaneous active calls along one path. | Both Fibonacci methods reach depth six for row 6, despite different total calls. |
| **Progress toward a base case** | Each continuing call must change its input enough to finish. | For `[6, 8]`, the correct right search range after `mid = 0` is `[1, 1]`. |

**Keep the book's algorithms and the geometry analogy distinct.** Fibonacci numbers define the chosen card-row sizes; the area multiplication is added for study. The source's intended `unique3` self-calls are written correctly here despite the printed name mismatch, and the mistaken binary-search range is traced without executing it.

[🔝 Back to Top](#top)
