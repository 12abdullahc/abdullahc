<span id="top"></span>

# Recursion — Section 4.6: Eliminating Tail Recursion

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.6 (printed pages 178–179).  
> **Topic:** Recognizing tail calls, replacing them with loop updates, and comparing recursive and iterative binary search and reversal.  
> **Domain focus:** The **MotoGP race at the 2026 San Marino and Rimini Riviera Grand Prix**, held at Misano on Sunday, 13 September 2026.  
> **Learning goal:** Decide whether a recursive call is truly final, turn its changing parameters into loop variables, and explain the time and stack-space consequences.  
> **User Prompt:** "Reexplain [Section 4.6] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]"

---

## Table of Contents

1. [Background & Conceptual Intuition: A Call That Has Nothing Left to Do](#background-intuition)
   - [1. One verified race](#background-race)
   - [2. Why nested calls use memory](#background-memory)
2. [Part 1: Recognize Tail Recursion](#part-1)
   - [1. Test the final-operation rule](#part-1-rule)
   - [2. Distinguish tail recursion from other linear recursion](#part-1-compare)
3. [Part 2: Replace a Tail Call with a Loop](#part-2)
   - [1. Translate parameters into loop state](#part-2-method)
   - [2. Preserve the base case and progress](#part-2-progress)
4. [Part 3: Code Fragment 4.15 — Iterative Binary Search](#part-3)
   - [1. Search the sorted Misano gaps](#part-3-search)
   - [2. Trace a found and a missing gap](#part-3-trace)
5. [Part 4: Code Fragment 4.16 — Iterative Reversal](#part-4)
   - [1. Reverse whole rider cards](#part-4-reverse)
   - [2. Compare time and extra space](#part-4-cost)
6. [Part 5: Loops for Linear Recursions That Are Not Tail Recursion](#part-5)
7. [Part 6: Complete Runnable Comparison](#part-6)
   - [1. Program](#part-6-program)
   - [2. Read the output](#part-6-results)
8. [Part 7: Work Through Five Small Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Call That Has Nothing Left to Do

<span id="background-race"></span>

### 1. One Verified Race

This explanation continues the [Section 4.1](04-01-illustrative-examples.md), [Section 4.2](04-02-analyzing-recursive-algorithms.md), [Section 4.3](04-03-recursion-run-amok.md), [Section 4.4](04-04-further-examples-of-recursion.md), and [Section 4.5](04-05-designing-recursive-algorithms.md) examples using **Sunday's Misano MotoGP race on 13 September 2026**. These four rows are a **selection** of finishers, not the full classification. [MotoGP's race report](https://www.motogp.com/en/news/2026/09/13/marc-marquez-capitalises-on-bezzecchi-error-to-seize-title-race-lead/1089345) identifies their places and teams; [Ducati's Grand Prix results](https://www.ducati.com/ww/en/racing/motogp/calendar/misano) give their gaps to winner Marc Márquez. [Yamaha's race report](https://www.yamaha-motogp.com/2026/newsletter/race/en/260913132359254/13-09-2026-quartararo-secures-top-10-finish-in-san-marino-gp) confirms Fabio Quartararo's P10 and `+23.229 s`.

| Place | Rider | Team | Gap to winner | Integer gap used in code |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Marc Márquez | Ducati Lenovo Team | 0.000 s | 0 ms |
| P2 | Álex Márquez | BK8 Gresini Racing MotoGP | +0.657 s | 657 ms |
| P3 | Pedro Acosta | Red Bull KTM Factory Racing | +2.326 s | 2,326 ms |
| P10 | Fabio Quartararo | Monster Energy Yamaha MotoGP | +23.229 s | 23,229 ms |

The sorted values `[0, 657, 2326, 23229]` let us search for Marc's and Fabio's gaps. We will also reverse copies of the four **whole rider records** as a hypothetical card display. That display does **not** change the official finishing order. A `1000 ms` search target, a selected-gap checksum, and photo-row counts below are teaching constructions, not published race statistics.

**Why these examples?** Searching needs one changing range; reversal needs two moving ends. They make the book's two tail-to-loop conversions visible with real rider data. **How will we solve them?** Follow the changing indices in the recursive version, then keep those same indices in loop variables.

<span id="background-memory"></span>

### 2. Why Nested Calls Use Memory

Recursion can express a repeated structure in a short, readable function. When a function calls itself, Python keeps an **activation record** for the current call while the child runs. It includes the local state needed when control returns. A long chain of nested calls therefore holds many frames at once, even if each frame does only a small amount of work.

For general recursion, we could manage pending calls ourselves with an explicit stack. That often **moves** the saved state from Python's call stack into our own data structure; it need not remove the need to remember the state. It can save memory if we store only the minimal state each pending task needs. Section 4.6 identifies a simpler case: if the current call has **nothing left to do after its child returns**, a loop can reuse the same variables instead of keeping another frame.

```text
Recursive search: frame with [0, 3] waits for frame with [2, 3],
                  which waits for frame with [3, 3].
Loop search:      one frame updates [0, 3] → [2, 3] → [3, 3].
```

**Why show the frames?** It separates the answer from the memory used to reach it: both paths can find Fabio's `23229 ms` gap. **How to read the example:** each bracketed pair is the current inclusive index range; the loop overwrites it after each comparison.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Recognize Tail Recursion

<span id="part-1-rule"></span>

### 1. Test the Final-Operation Rule

A function is **tail recursive** when **every recursive call it can make is the final operation in that call's context**. If the child returns a value, the parent returns that value immediately. For a binary-search branch:

```python
return _search_recursive(gaps, target, mid + 1, high)
```

After `_search_recursive(...)` returns, this parent performs no comparison, addition, or other operation. The in-place `reverse` from Section 4.4 is also tail recursive: it swaps the outer records **before** calling itself on the inner range, and then it is done. The call need not return a useful value for the rule to apply.

Tail recursion is necessarily **linear recursion**. If the first child call is the last operation, there is no opportunity to start a second child call afterward. Binary search has two possible branches in its code, but one invocation follows only one. Its “binary” name refers to halving the candidate range, not making two recursive calls.

**Why check the operation, not the line number?** A final source-code line can still contain work that occurs **after** a child returns. **How to decide:** imagine the child has just produced its answer. If the parent must calculate or start another call before returning, that recursive call was not in tail position.

<span id="part-1-compare"></span>

### 2. Distinguish Tail Recursion from Other Linear Recursion

| Chapter function | What happens after the child returns? | Tail recursive? |
| :--- | :--- | :---: |
| Recursive binary search | Immediately pass the child's Boolean result back. | Yes |
| In-place `reverse` | Nothing; the swap happened before the child call. | Yes |
| `factorial(n)` | Multiply by `n`. | No |
| `linear_sum(S, n)` | Add `S[n - 1]`. | No |
| `good_fibonacci(n)` | Combine returned values into a new pair. | No |

The book's factorial example ends with `return n * factorial(n - 1)`. It contains only **one** recursive call, yet the multiplication by `n` happens when that call returns. Thus it is linear recursion, **not** tail recursion. For a hypothetical desk display with three distinct cards labeled Marc, Pedro, and Fabio, `factorial(3) = 3 × factorial(2) = 3 × 2 = 6` counts six possible card orders. Those orders are not race results.

Similarly, `linear_sum([0, 657, 2326, 23229], 4)` first waits for the smaller sum, then adds Fabio's `23229 ms` value. Its result, `26212 ms`, is only a **notebook checksum** of selected official gap labels. `good_fibonacci` waits for a pair such as `(5, 3)`, then forms `(5 + 3, 5) = (8, 5)` for invented Marc/Fabio fan-photo rows 6 and 5. This Fibonacci rule is separate from Section 4.4's doubling display.

**Why use these contrasts?** They show that “one recursive call” is not enough to qualify as tail recursion. **How to check each function:** put a mark immediately after the recursive call returns and name every operation still required at that mark.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Replace a Tail Call with a Loop

<span id="part-2-method"></span>

### 1. Translate Parameters into Loop State

The book's conversion is mechanical once a call is truly final:

1. Initialize variables to the first call's parameters.
2. Repeat the function body in a loop.
3. Where the recursive version would call itself with new parameters, **assign those values to the existing variables**.
4. Let a direct answer return, or let the loop end when the recursive base case would apply.

| Tail-recursive call would use | Loop updates instead | State being reused |
| :--- | :--- | :--- |
| Search left with `(low, mid - 1)`. | `high = mid - 1`. | Same sorted list and target; smaller inclusive range. |
| Search right with `(mid + 1, high)`. | `low = mid + 1`. | Same sorted list and target; smaller inclusive range. |
| Reverse inside `(start + 1, stop - 1)`. | `start, stop = start + 1, stop - 1`. | Same mutable display; shorter half-open range. |

No saved computation is waiting for the child in these examples. Updating the loop state preserves the next subproblem without creating another nested call. The search and reversal loops still need exactly the **same input assumptions** as their recursive versions: sorted values for search and a mutable sequence for in-place reversal.

**Why this table?** It makes the conversion about state, rather than merely replacing a function call with `while`. **How to apply it:** list every parameter that changes in the recursive call, then write the equivalent assignments and keep the unchanged data available.

<span id="part-2-progress"></span>

### 2. Preserve the Base Case and Progress

For binary search, the recursive failure base is `low > high`: no candidates remain. The loop therefore continues under the **opposite** condition, `while low <= high`, and returns `False` after that condition becomes false. A middle-value match still returns `True` immediately. Both updates exclude the middle index already checked, using `mid - 1` or `mid + 1`, so the range shrinks.

For reversal, the active range is **half-open** `[start, stop)`. It needs a swap only while `start < stop - 1`, meaning at least two records remain. The recursive function stops when that test is false; the loop uses the same test as its continuation condition. After each swap, moving both bounds inward reduces `stop - start` by two.

| Algorithm | Recursive stopping condition | Loop condition | Progress measure |
| :--- | :--- | :--- | :--- |
| Binary search | `low > high` means absent. | `low <= high` means keep looking. | Candidate count `high - low + 1` falls. |
| Reversal | `start >= stop - 1` means zero or one item. | `start < stop - 1` means swap again. | Active length `stop - start` falls by two. |

**Why recheck progress?** A loop with unchanged bounds can run forever just as a recursive call with unchanged bounds can. **How to verify:** compare the old and new range sizes on every branch and make sure a match or empty range ends the process.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Code Fragment 4.15 — Iterative Binary Search

<span id="part-3-search"></span>

### 1. Search the Sorted Misano Gaps

The book's Code Fragment 4.15 converts its recursive binary search to a loop. Here is the same algorithm on our selected, **increasing** winner-relative gaps. `low` and `high` are inclusive indices:

```python
def binary_search_iterative(data, target):
    low, high = 0, len(data) - 1
    while low <= high:
        mid = (low + high) // 2
        if target == data[mid]:
            return True
        if target < data[mid]:
            high = mid - 1
        else:
            low = mid + 1
    return False


gaps = [0, 657, 2326, 23229]
print(binary_search_iterative(gaps, 23229))  # Fabio's real gap
print(binary_search_iterative(gaps, 1000))   # hypothetical, absent
```

```text
True
False
```

The `return False` belongs **after** the loop: inside the loop, a narrower range may still contain the target. An empty input starts with `(low, high) = (0, -1)`, skips the loop, and returns `False`. The list must be sorted; otherwise comparing with the middle does not justify discarding a side.

**Why this example?** Fabio's gap is at one end of a short catalog, so we can watch the range move right. The invented `1000 ms` target makes the loop exit path visible. **How to solve it:** check the current middle gap, return on a match, or assign one bound to exclude the middle and the impossible half.

<span id="part-3-trace"></span>

### 2. Trace a Found and a Missing Gap

| Search | Loop pass | Inclusive range | Middle gap | Action |
| :--- | ---: | :---: | ---: | :--- |
| Fabio, `23229` | 1 | `[0, 3]` | Álex, `657` | Set `low = 2`. |
| Fabio, `23229` | 2 | `[2, 3]` | Pedro, `2326` | Set `low = 3`. |
| Fabio, `23229` | 3 | `[3, 3]` | Fabio, `23229` | Return `True`. |
| Hypothetical `1000` | 1 | `[0, 3]` | Álex, `657` | Set `low = 2`. |
| Hypothetical `1000` | 2 | `[2, 3]` | Pedro, `2326` | Set `high = 1`. |
| Hypothetical `1000` | Exit | `[2, 1]` | None | `low <= high` is false; return `False`. |

Marc's `0 ms` takes the other branch: from `[0, 3]`, the midpoint is Álex's `657`, so set `high = 0`; the next midpoint at `[0, 0]` matches Marc. Notice that an unsuccessful **recursive** search would make one final base-case call on `[2, 1]`, while the loop simply exits there without another pass.

**Why trace both outcomes?** They prove that the loop preserves the recursive function's success and failure behavior. **How to check the trace:** recompute `mid = (low + high) // 2` on each pass, then confirm the next range excludes that `mid` and contains only possible matches.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Code Fragment 4.16 — Iterative Reversal

<span id="part-4-reverse"></span>

### 1. Reverse Whole Rider Cards

The book's Code Fragment 4.16 uses `start` and **exclusive** `stop` to reverse a mutable sequence in place. Imagine a desk row of four cards, each carrying a rider's **name, team, and official gap**. The algorithm moves whole list elements, so we can keep those facts paired:

```python
def reverse_iterative(records):
    start, stop = 0, len(records)
    while start < stop - 1:
        records[start], records[stop - 1] = records[stop - 1], records[start]
        start, stop = start + 1, stop - 1


cards = [
    ("Marc Márquez", "Ducati Lenovo Team", 0),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 657),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 2326),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP", 23229),
]
reverse_iterative(cards)
print([card[0] for card in cards])
```

```text
['Fabio Quartararo', 'Pedro Acosta', 'Álex Márquez', 'Marc Márquez']
```

The short code block prints names so the swaps are easy to read, but it reverses **whole records** containing teams and gaps. Neither version creates a new race classification. This is only a hypothetical display arrangement.

| Loop state before test | Display before swap | Action | Display afterward |
| :---: | :--- | :--- | :--- |
| `[0, 4)` | Marc, Álex, Pedro, Fabio | Swap Marc and Fabio. | Fabio, Álex, Pedro, Marc |
| `[1, 3)` | Fabio, Álex, Pedro, Marc | Swap Álex and Pedro. | Fabio, Pedro, Álex, Marc |
| `[2, 2)` | Fabio, Pedro, Álex, Marc | Test is false; stop. | No change |

The loop makes **two passes** for four records. The recursive Section 4.4 version makes **three calls**: one for each swap and one final call that sees an empty inner range. With an odd number of cards, the final active range contains one middle card, which stays in place.

**Why this example?** Moving two visible endpoints shows why the recursive call is final: the parent has already done its swap. **How to solve it:** swap the first and last active records, move both bounds inward, and stop when fewer than two remain.

<span id="part-4-cost"></span>

### 2. Compare Time and Extra Space

The following bounds analyze the algorithms under the book's constant-cost comparison and swap model. **Extra space** here excludes the input sequence and any copies made solely to compare outputs in our demonstration program.

| Task | Recursive version | Iterative version | Why the loop saves stack space |
| :--- | :--- | :--- | :--- |
| Binary search | `O(log n)` time; `O(log n)` active frames. | `O(log n)` time; `O(1)` extra variables. | One frame repeatedly updates `low` or `high`. |
| In-place reversal | `O(n)` time; `O(n)` active frames. | `O(n)` time; `O(1)` extra variables. | One frame repeatedly updates `start` and `stop`. |

Both search versions compare the same middle values in the same order. Both reversal versions perform the same swaps. The memory gain is from avoiding nested activation records. Building our separate `gaps` list and the two display copies in the complete program takes `O(n)` **setup storage**; that does not change the extra-space bound for either loop itself.

**Why compare both costs?** Removing recursion does not automatically make the search or reversal do less work. **How to analyze:** count comparisons or swaps for time, then count simultaneously stored frames or loop variables for additional space.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Loops for Linear Recursions That Are Not Tail Recursion

The section closes by noting that **factorial, sequence sum, and Fibonacci** can also be implemented efficiently with loops. Their chapter versions are not tail recursive, so the direct “replace the final call with assignments” recipe does not describe the whole change. A loop must carry the value that the recursive parent would have calculated **after** its child returned.

| Teaching task | Original waiting work | Loop state to carry | Small answer |
| :--- | :--- | :--- | :--- |
| Count orders of three distinct rider cards. | Multiply `3 * factorial(2)` after the child returns. | Running `product`: `1 → 1 → 2 → 6`. | Six hypothetical card orders. |
| Add four selected official gap labels. | Add the next gap after the smaller sum returns. | Running `total`: `0 → 0 → 657 → 2983 → 26212` ms. | `26212 ms` teaching checksum. |
| Count invented Fibonacci photo slots. | Combine a returned pair to form the next pair. | Two running counts, such as `(5, 3) → (8, 5)`. | Row 6 has eight invented slots. |

For a nonnegative integer `n`, the original factorial is not tail recursive, but a product accumulator makes its loop simple:

```python
def factorial_iterative(n):
    product = 1
    for choice_count in range(2, n + 1):
        product *= choice_count
    return product


print(factorial_iterative(3))
```

```text
6
```

The `3` represents three **distinct rider cards**, not three race positions or an official statistic. The book also recalls its Fibonacci generator from Section 1.8: under its operation-count model, each next value takes `O(1)` work, so generating through the `n`th value takes `O(n)` work.

**Why include non-tail examples?** They prevent an incorrect conclusion that only tail-recursive algorithms can use loops. **How to convert one:** identify the result that the parent was waiting to compute, then store and update that result explicitly as the loop proceeds.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Complete Runnable Comparison

<span id="part-6-program"></span>

### 1. Program

This program compares each loop with its recursive counterpart. Its factorial and Fibonacci counts use nonnegative inputs. It keeps every rider's **name, team, and gap together** in a record. Two display copies let us compare reversal results without one run changing the other's input; those copies belong to the demonstration setup, not to the reversal algorithms' extra-space analysis.

```python
def _search_recursive(data, target, low, high):
    if low > high:
        return False
    mid = (low + high) // 2
    if target == data[mid]:
        return True
    if target < data[mid]:
        return _search_recursive(data, target, low, mid - 1)
    return _search_recursive(data, target, mid + 1, high)


def binary_search_recursive(data, target):
    return _search_recursive(data, target, 0, len(data) - 1)


def binary_search_iterative(data, target):
    low, high = 0, len(data) - 1
    while low <= high:
        mid = (low + high) // 2
        if target == data[mid]:
            return True
        if target < data[mid]:
            high = mid - 1
        else:
            low = mid + 1
    return False


def _reverse_recursive(records, start, stop):
    if start < stop - 1:
        records[start], records[stop - 1] = records[stop - 1], records[start]
        _reverse_recursive(records, start + 1, stop - 1)


def reverse_recursive(records):
    _reverse_recursive(records, 0, len(records))


def reverse_iterative(records):
    start, stop = 0, len(records)
    while start < stop - 1:
        records[start], records[stop - 1] = records[stop - 1], records[start]
        start, stop = start + 1, stop - 1


def factorial_recursive(n):
    if n == 0:
        return 1
    return n * factorial_recursive(n - 1)


def factorial_iterative(n):
    product = 1
    for choice_count in range(2, n + 1):
        product *= choice_count
    return product


def linear_sum_recursive(values, n):
    if n == 0:
        return 0
    return linear_sum_recursive(values, n - 1) + values[n - 1]


def sum_iterative(values):
    total = 0
    for value in values:
        total += value
    return total


def good_fibonacci(n):
    if n <= 1:
        return (n, 0)
    previous, before_previous = good_fibonacci(n - 1)
    return (previous + before_previous, previous)


def fibonacci_pair_iterative(n):
    if n <= 1:
        return (n, 0)
    previous, before_previous = 1, 0
    for row in range(2, n + 1):
        previous, before_previous = previous + before_previous, previous
    return (previous, before_previous)


# Sunday 13 September 2026 Misano MotoGP race; gaps are to winner Marc.
race = [
    ("Marc Márquez", "Ducati Lenovo Team", 0),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 657),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 2326),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP", 23229),
]
gaps = [record[2] for record in race]  # increasing order for binary search

print("selected gaps (ms):", gaps)
for label, target in (("Fabio", 23229), ("Marc", 0),
                      ("hypothetical 1000 ms", 1000)):
    print("{} gap: recursive={}, iterative={}".format(
        label, binary_search_recursive(gaps, target),
        binary_search_iterative(gaps, target)))
print("empty search: recursive={}, iterative={}".format(
    binary_search_recursive([], 23229), binary_search_iterative([], 23229)))

recursive_display = race.copy()
iterative_display = race.copy()
reverse_recursive(recursive_display)
reverse_iterative(iterative_display)
print("recursive display:", [record[0] for record in recursive_display])
print("iterative display:", [record[0] for record in iterative_display])

print("three rider-card orders: recursive={}, iterative={}".format(
    factorial_recursive(3), factorial_iterative(3)))
print("selected gap checksum: recursive={} ms, iterative={} ms".format(
    linear_sum_recursive(gaps, len(gaps)), sum_iterative(gaps)))
print("Fibonacci photo rows 6 and 5: recursive={}, iterative={}".format(
    good_fibonacci(6), fibonacci_pair_iterative(6)))
```

<span id="part-6-results"></span>

### 2. Read the Output

```text
selected gaps (ms): [0, 657, 2326, 23229]
Fabio gap: recursive=True, iterative=True
Marc gap: recursive=True, iterative=True
hypothetical 1000 ms gap: recursive=False, iterative=False
empty search: recursive=False, iterative=False
recursive display: ['Fabio Quartararo', 'Pedro Acosta', 'Álex Márquez', 'Marc Márquez']
iterative display: ['Fabio Quartararo', 'Pedro Acosta', 'Álex Márquez', 'Marc Márquez']
three rider-card orders: recursive=6, iterative=6
selected gap checksum: recursive=26212 ms, iterative=26212 ms
Fibonacci photo rows 6 and 5: recursive=(8, 5), iterative=(8, 5)
```

The matching answers confirm that the loop versions preserve the small examples' behavior. The first two tasks are the book's direct tail-call conversions. Factorial, summation, and Fibonacci use running loop values because their original recursive versions had unfinished work after a child call. The checksum, card orders, and photo rows remain **teaching calculations** built around real rider identities and gaps.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Work Through Five Small Cases

<details>
<summary><strong>Case Study 1: Where does a missing gap return False?</strong></summary>

**Scenario:** Search the four selected gaps for a hypothetical `1000 ms`. **Why this case?** It shows how a recursive base case becomes a loop exit. **How to solve it:** compare with `657`, then `2326`; update bounds from `[0, 3]` to `[2, 3]` to `[2, 1]`. The recursive version makes a final base-case call on `[2, 1]`; the loop exits before another pass and returns `False`.

</details>

<details>
<summary><strong>Case Study 2: What happens with no cards or only Fabio's card?</strong></summary>

**Scenario:** Reverse `[]` and a one-record display containing Fabio. **Why this case?** It checks both stopping shapes for reversal. **How to solve it:** for `[]`, `start = stop = 0`; for one card, `start = 0`, `stop = 1`. In both cases `start < stop - 1` is false, so the loop makes no swap and leaves the display unchanged.

</details>

<details>
<summary><strong>Case Study 3: Why do Marc and Fabio stay with their teams?</strong></summary>

**Scenario:** Reverse the four-card display. **Why this case?** A name-only reversal could accidentally associate Fabio with Marc's `0 ms` gap. **How to solve it:** store each card as a whole `(name, team, gap_ms)` tuple and swap tuples. The display becomes Fabio, Pedro, Álex, Marc, while each tuple's facts remain attached to its rider.

</details>

<details>
<summary><strong>Case Study 4: Is `return 3 * factorial(2)` a tail call?</strong></summary>

**Scenario:** Count hypothetical orders of three distinct rider cards. **Why this case?** The recursive call appears on the last line and can look final. **How to solve it:** `factorial(2)` returns `2`; the waiting parent still multiplies `3 * 2 = 6`. Since work follows the child return, that call is not tail recursive. A product loop can still compute six orders.

</details>

<details>
<summary><strong>Case Study 5: Does removing recursion change the result or just the saved state?</strong></summary>

**Scenario:** Search for Fabio's `23229 ms` gap in four sorted values. **Why this case?** Both methods make the same three midpoint comparisons. **How to solve it:** compare `657`, then `2326`, then `23229`. The recursive version has up to three active search frames; the loop makes three passes in one frame and returns the same `True`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 4.6 idea | Question to ask | Misano teaching example |
| :--- | :--- | :--- |
| **Activation records** | What state waits while a child call runs? | Recursive gap search nests candidate ranges. |
| **Tail recursion** | Is every recursive call the final operation in its context? | Search passes its Boolean back; reversal swaps before its last call. |
| **Tail implies linear** | Could a second child call happen after the first returns? | A tail call immediately ends its parent's work. |
| **Linear need not be tail** | Does the parent still multiply, add, or build a pair? | Factorial, selected-gap sum, and `good_fibonacci` do. |
| **Loop conversion** | Which parameters would the next call receive? | Reassign search's inclusive `low/high` or reversal's half-open `start/stop`. |
| **Space benefit** | Can one frame retain the changing state? | Iterative search and in-place reversal use `O(1)` extra variables. |
| **Other iterative designs** | What result must a loop carry forward? | A running product, checksum, or Fibonacci pair. |

**The reusable method:** identify the work left after each recursive call, convert truly final calls into loop-state updates, and keep base cases and shrinking ranges intact. When work remains after a call, carry that work's result explicitly in an iterative design.

[🔝 Back to Top](#top)
