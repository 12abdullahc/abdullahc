<span id="top"></span>

# 4.6 Eliminating Tail Recursion — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.6, printed pages 178–179 (the supplied PDF).  
> **Topic:** 4.6 Eliminating Tail Recursion; iterative binary search (Code Fragment 4.15) and sequence reversal (Code Fragment 4.16).  
> **Domain Focus:** Rectangular-card areas, sorted area searches, reversed card displays, and arrangements of distinct cards.  
> **User Prompt:** Reexplain [`Section 4.6`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Same Card Workshop](#background)
   - [1. Reuse three rectangles](#background-cards)
   - [2. What costs memory during recursion?](#background-memory)
2. [Part 1: Recognize Tail Recursion](#part-1)
   - [1. Test the exact final-operation rule](#part-1-rule)
   - [2. Distinguish tail recursion from other linear recursion](#part-1-linear)
3. [Part 2: Replace Tail Calls with Loop Updates](#part-2)
   - [1. Apply the general conversion](#part-2-conversion)
   - [2. Search sorted card areas iteratively](#part-2-search)
   - [3. Reverse the card display iteratively](#part-2-reverse)
   - [4. Compare time and extra space](#part-2-cost)
4. [Part 3: Other Linear Recursions Can Use Different Loops](#part-3)
   - [1. Count card orders and sum card areas](#part-3-accumulator)
   - [2. Carry Fibonacci row counts in loop variables](#part-3-fibonacci)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Follow the results](#part-4-results)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Same Card Workshop

<span id="background-cards"></span>

### 1. Reuse three rectangles

We keep the three physical cards from the earlier sections. Each card's area is width times height.

| Card | Width | Height | Area |
| :--- | ---: | ---: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The sorted area catalog is `[6, 8, 16]` cm². All three cards together have `6 + 8 + 16 = 30 cm²` of combined area. We will search the catalog for an area, reverse the display `ABC`, and count how many orders of these distinct cards are possible.

<span id="background-memory"></span>

### 2. What costs memory during recursion?

A recursive call asks the Python interpreter to keep an **activation record** for the current call while the next one runs. That record retains the local state needed when the call resumes. A chain of many active calls therefore uses call-stack memory.

Section 4.6 explains two ways to remove recursion:

| Situation | How a nonrecursive version can work | Memory point |
| :--- | :--- | :--- |
| General recursion | Manage pending work with an explicit stack. | This may shift nesting information into our own stack, though storing less information may save memory. |
| Tail recursion | Repeat the function body in a loop, updating its changing parameters. | The loop can avoid an auxiliary stack and keep only a fixed number of variables. |

For our sorted area search, the changing parameters are the candidate indices `low` and `high`. For reversing the display, they are `start` and `stop`. Once a recursive call is the very last action, the current call has no further card work to resume after its child returns. That observation leads to the loop conversion.

> **Mental model:** If a recursive call passes its result straight back with no later work, keep the current state in loop variables and repeat with the new values.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Recognize Tail Recursion

Section 4.6 has no numbered subsections. We first identify its exact tail-recursion rule, then apply the book's two loop examples.

<span id="part-1-rule"></span>

### 1. Test the exact final-operation rule

A recursion is **tail recursion** when **every recursive call it makes is the final operation in its context**. If that call returns a value, the enclosing call returns the value immediately. In an area search, a branch can end like this:

```python
return _search_recursive(areas, target, middle + 1, high)
```

There is no addition, multiplication, swap, or other calculation after `_search_recursive` returns. The in-place reversal from Section 4.4 also qualifies: it swaps the outer cards **before** its recursive call, then immediately finishes when that call does.

Tail recursion must be **linear recursion**: a call cannot make a second recursive call after it has immediately returned the first call's result. The reverse implication does not hold; some linear recursions still perform work after their single recursive call.

<span id="part-1-linear"></span>

### 2. Distinguish tail recursion from other linear recursion

| Chapter example | What happens after its recursive call returns? | Tail recursion? |
| :--- | :--- | :--- |
| Binary search | Immediately return the found-or-not-found result. | **Yes.** |
| In-place `reverse` | Nothing; the end swap happened before the call. | **Yes.** |
| `factorial(n)` | Multiply the returned value by `n`. | **No.** |
| `linear_sum(S, n)` | Add `S[n - 1]` to the returned sum. | **No.** |
| `good_fibonacci(n)` | Combine two returned numbers into a new pair. | **No.** |

The expression `return n * factorial(n - 1)` is on the function's final line, yet it is **not** a tail call. The multiplication occurs **after** `factorial(n - 1)` returns. In our card workshop, `factorial(3) = 3 × factorial(2) = 3 × 2 = 6` counts the possible display orders of `A`, `B`, and `C`.

Likewise, `linear_sum([6, 8, 16], 3)` waits for the first two areas to sum to `14 cm²`, then adds `16 cm²` to obtain `30 cm²`. That waiting addition makes the original function non-tail even though each activation makes only one recursive call.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Replace Tail Calls with Loop Updates

<span id="part-2-conversion"></span>

### 1. Apply the general conversion

The book's tail-recursion conversion has two steps:

1. Initialize the state variables before a loop.
2. Put the repeated body inside the loop. Where the recursive version would call itself with new parameters, assign those values to the existing variables and continue the loop.

The base-case condition becomes a way to leave the loop. This works directly when no unfinished calculation needs to wait for the next call's result. The loop must keep the same progress rule as the recursion: search bounds narrow, and reversal bounds move inward.

<span id="part-2-search"></span>

### 2. Search sorted card areas iteratively

Code Fragment 4.15 turns the chapter's recursive binary search into a `while` loop. Its bounds are **inclusive**: begin with `low = 0`, `high = len(areas) - 1`, and continue while `low <= high`.

```python
def contains_area_iterative(areas, target):
    low, high = 0, len(areas) - 1
    while low <= high:
        middle = (low + high) // 2
        if target == areas[middle]:
            return True
        if target < areas[middle]:
            high = middle - 1
        else:
            low = middle + 1
    return False
```

With `[6, 8, 16]` cm², searching for `16` follows the same decisions as the recursive version:

| Loop pass | Candidate indices `[low, high]` | Middle area | Next action |
| ---: | :--- | ---: | :--- |
| 1 | `[0, 2]` | `8 cm²` at index `1` | Set `low = 2`. |
| 2 | `[2, 2]` | `16 cm²` at index `2` | Return `True`. |

Searching for `7 cm²` follows `[0, 2] → [0, 0] → [1, 0]`. When `low > high`, the loop stops and the final `return False` reports the missing area. An empty catalog starts at `[0, -1]`, so the loop never enters. Sorted order remains essential: comparing with the middle only identifies a safe half to discard when the areas are ordered.

<span id="part-2-reverse"></span>

### 3. Reverse the card display iteratively

Code Fragment 4.16 converts the chapter's in-place `reverse` to a loop. Here `stop` is **exclusive**, so the active portion is `[start, stop)`. While at least two cards remain, swap the two ends and move both bounds inward.

```python
def reverse_iterative(labels):
    start, stop = 0, len(labels)
    while start < stop - 1:
        labels[start], labels[stop - 1] = labels[stop - 1], labels[start]
        start, stop = start + 1, stop - 1
```

| Step | Active indices `[start, stop)` | Display | Action |
| :--- | :--- | :--- | :--- |
| Start | `[0, 3)` | `A B C` | Swap `A` and `C`. |
| After swap | `[1, 2)` | `C B A` | One middle card remains; stop. |

The cards change positions, but their combined area remains `30 cm²`. The middle card `B` needs no swap. The recursive version also swaps before its final recursive call; the loop merely keeps the next `start` and `stop` in the current frame.

<span id="part-2-cost"></span>

### 4. Compare time and extra space

The following bounds are a study analysis of the book's algorithms. **Extra space** excludes the input list itself; reversal modifies that list in place.

| Method | Time | Extra space | Why |
| :--- | :--- | :--- | :--- |
| Recursive binary search | `O(log n)` | `O(log n)` call stack | One roughly halved candidate range per call. |
| Iterative binary search | `O(log n)` | `O(1)` | The loop reuses `low`, `high`, and `middle`. |
| Recursive in-place reverse | `O(n)` | `O(n)` call stack | About `n/2` nested calls swap pairs of cards. |
| Iterative in-place reverse | `O(n)` | `O(1)` | The loop reuses two bounds and a swap. |

The benefit is clearest for a much larger catalog or display: both versions do essentially the same comparisons or swaps, while the loop does not accumulate nested activation records. Neither loop copies the input sequence.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Other Linear Recursions Can Use Different Loops

The section closes by observing that factorial, sequence sum, and Fibonacci calculations can also have efficient iterative implementations, even though the chapter's recursive versions are **not tail recursions**. Their loops must carry forward the information that the original functions calculated *after* a recursive return.

<span id="part-3-accumulator"></span>

### 1. Count card orders and sum card areas

For three distinct cards, the number of display orders is `3! = 6`. The recursive calculation `3 × factorial(2)` waits to multiply; an iterative version carries a running product instead:

| Number of cards considered | Running product | Meaning |
| ---: | ---: | :--- |
| 0 | 1 | One empty arrangement. |
| 1 | 1 | One order of `A`. |
| 2 | 2 | Two orders of `A` and `B`. |
| 3 | 6 | Six orders of `A`, `B`, and `C`. |

The same accumulator idea sums card areas: start at `0 cm²`, then update `0 → 6 → 14 → 30 cm²`. The chapter's original `linear_sum` adds each area *after* its smaller call returns, so its loop is another iterative design rather than the simple tail-call replacement used for binary search and reversal.

<span id="part-3-fibonacci"></span>

### 2. Carry Fibonacci row counts in loop variables

Earlier, `good_fibonacci(n)` returned the pair `(F(n), F(n - 1))`. Its recursive call returns first; the function then adds those two values to make a new pair, so that version is not tail recursive. A loop can retain the two most recent counts and update them together. The book also recalls its Fibonacci generator from Section 1.8: each next value takes `O(1)` time, so generating the `n`th value takes `O(n)` time under the chapter's operation-count model.

For the card-row rule, row 0 has zero `A` cards and row 1 has one. Row 6 has `F(6) = 8` copies, whose combined area is `8 × 6 = 48 cm²`. This is the Fibonacci row rule from Section 4.3; Section 4.4's doubling activity uses a separate rule.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

The two search functions return Booleans and assume a sorted area list. The two reversal functions change their supplied lists in place; separate copies let us compare their results. The remaining functions demonstrate iterative designs for the non-tail examples.

```python
def _search_recursive(areas, target, low, high):
    if low > high:
        return False
    middle = (low + high) // 2
    if target == areas[middle]:
        return True
    if target < areas[middle]:
        return _search_recursive(areas, target, low, middle - 1)
    return _search_recursive(areas, target, middle + 1, high)


def contains_area_recursive(areas, target):
    return _search_recursive(areas, target, 0, len(areas) - 1)


def contains_area_iterative(areas, target):
    low, high = 0, len(areas) - 1
    while low <= high:
        middle = (low + high) // 2
        if target == areas[middle]:
            return True
        if target < areas[middle]:
            high = middle - 1
        else:
            low = middle + 1
    return False


def _reverse_recursive(labels, start, stop):
    if start >= stop - 1:
        return
    labels[start], labels[stop - 1] = labels[stop - 1], labels[start]
    return _reverse_recursive(labels, start + 1, stop - 1)


def reverse_recursive(labels):
    _reverse_recursive(labels, 0, len(labels))


def reverse_iterative(labels):
    start, stop = 0, len(labels)
    while start < stop - 1:
        labels[start], labels[stop - 1] = labels[stop - 1], labels[start]
        start, stop = start + 1, stop - 1


def factorial_recursive(n):
    if n < 0:
        raise ValueError("number of cards must be nonnegative")
    if n == 0:
        return 1
    return n * factorial_recursive(n - 1)  # multiplication follows the call


def factorial_iterative(n):
    if n < 0:
        raise ValueError("number of cards must be nonnegative")
    product = 1
    for choices in range(2, n + 1):
        product *= choices
    return product


def total_area_iterative(areas):
    total = 0
    for area in areas:
        total += area
    return total


def fibonacci_pair_iterative(n):
    if n < 0:
        raise ValueError("row number must be nonnegative")
    if n <= 1:
        return (n, 0)
    before_previous, previous = 0, 1
    for row in range(2, n + 1):
        before_previous, previous = previous, before_previous + previous
    return (previous, before_previous)


cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
area_by_card = {label: width * height for label, (width, height) in cards.items()}
areas = sorted(area_by_card.values())
labels = ["A", "B", "C"]

print("sorted areas:", areas, "cm^2")
for target in (16, 7):
    print(f"search {target} cm^2: recursive={contains_area_recursive(areas, target)}, "
          f"iterative={contains_area_iterative(areas, target)}")
print("empty search:", contains_area_recursive([], 6), contains_area_iterative([], 6))

recursive_display = labels.copy()
iterative_display = labels.copy()
reverse_recursive(recursive_display)
reverse_iterative(iterative_display)
print("recursive display:", recursive_display)
print("iterative display:", iterative_display)
print("area after reversal:", total_area_iterative(areas), "cm^2")

print("card orders:", factorial_recursive(len(labels)),
      factorial_iterative(len(labels)))
row_6_pair = fibonacci_pair_iterative(6)
print("Fibonacci row 6:", row_6_pair,
      "| A-card area:", row_6_pair[0] * area_by_card["A"], "cm^2")
```

<span id="part-4-results"></span>

### 2. Follow the results

Running the complete program prints:

```text
sorted areas: [6, 8, 16] cm^2
search 16 cm^2: recursive=True, iterative=True
search 7 cm^2: recursive=False, iterative=False
empty search: False False
recursive display: ['C', 'B', 'A']
iterative display: ['C', 'B', 'A']
area after reversal: 30 cm^2
card orders: 6 6
Fibonacci row 6: (8, 5) | A-card area: 48 cm^2
```

The matching search and reversal results show what the loop conversion must preserve. Factorial and the Fibonacci pair also have loop versions here, but their original recursive calculations do work after the recursive call; they require a running product or two running counts.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Where does a missing area return False?</strong></summary>

**Scenario:** Search the sorted areas `[6, 8, 16]` cm² for `7 cm²`.

**Check:** Both versions inspect `8`, then `6`. The recursive version reaches its `low > high` base case on `[1, 0]`; the iterative version leaves its `while low <= high` loop and then returns `False`.

**Lesson:** A loop's exit condition can express the recursive base case with the opposite test.

</details>

<details>
<summary><strong>Case Study 2: What happens to the middle card during reversal?</strong></summary>

**Scenario:** Reverse the display `A B C` while keeping all three cards.

**Check:** Both versions swap `A` and `C`, giving `C B A`. Their next active range is `[1, 2)`, containing only `B`, so neither swaps again. The combined area is still `30 cm²`.

**Lesson:** The loop repeats the recursive swap and bound update, including the same one-card stopping point.

</details>

<details>
<summary><strong>Case Study 3: Is a recursive call on the final line always tail recursion?</strong></summary>

**Scenario:** Count the display orders of the three distinct cards using `factorial(3)`.

**Check:** `factorial(2)` returns `2`; the waiting `factorial(3)` call multiplies by `3` to return `6`. The expression `return 3 * factorial(2)` is on the final line, but multiplication occurs after the call returns.

**Lesson:** Look for work after the recursive call, even inside a final `return` expression.

</details>

<details>
<summary><strong>Case Study 4: Can a non-tail card calculation still use a loop?</strong></summary>

**Scenario:** We want the total area and the number of display orders without recursive calls.

**Check:** Area accumulation follows `0 → 6 → 14 → 30 cm²`. Product accumulation follows `1 → 1 → 2 → 6` orders for zero through three cards.

**Lesson:** Iteration is possible for these examples, but it carries a running result that their original recursive versions computed after returning.

</details>

<details>
<summary><strong>Case Study 5: How can two counts replace a Fibonacci return pair?</strong></summary>

**Scenario:** Continue the workshop's Fibonacci rule to row 6 and find the total area of its `A` cards.

**Check:** The iterative pair updates reach `(F(5), F(4)) = (5, 3)` and then `(F(6), F(5)) = (8, 5)`. Eight `A` cards cover `8 × 6 = 48 cm²`.

**Lesson:** Two loop variables can carry the information that `good_fibonacci` combines after its recursive call.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 4.6 idea | Plain-language meaning | Rectangle-card reminder |
| :--- | :--- | :--- |
| **Activation records** | Nested recursive calls keep state on the call stack. | Repeatedly narrowing an area search creates nested calls. |
| **Tail recursion** | Every recursive call is the final operation in its context. | Binary search returns its next search result directly; reversal swaps before its final call. |
| **Tail implies linear** | A call that immediately returns its child's answer cannot then make another recursive call. | Each area-search activation chooses only one next range. |
| **Linear need not be tail** | One recursive call can still be followed by more work. | `factorial(3)` multiplies after `factorial(2)` to count six card orders. |
| **Loop conversion** | Reassign changing parameters and repeat the body. | Search updates inclusive `low/high`; reversal updates half-open `start/stop`. |
| **Space benefit** | A loop can avoid growing a recursive call stack. | Iterative search and in-place reversal use `O(1)` extra space. |
| **Other iterative designs** | Carry running values when the original recursion does post-call work. | Accumulate `30 cm²`, six orders, or the row-6 pair `(8, 5)`. |

The book supplies the tail-recursion definition and the binary-search and reversal loop patterns. The area catalog, card display, and card-order calculations are connected geometry study examples built around those patterns.

[🔝 Back to Top](#top)
