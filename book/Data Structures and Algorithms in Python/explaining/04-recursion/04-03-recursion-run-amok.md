<span id="top"></span>

# Recursion — Section 4.3: Recursion Run Amok

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.3 (printed pages 165–168).  
> **Topic:** An inefficient uniqueness test, slow and improved Fibonacci recursion, and Python's maximum recursive depth.  
> **Domain focus:** The **MotoGP race at the 2026 San Marino and Rimini Riviera Grand Prix**, held at Misano on Sunday, 13 September 2026.  
> **Learning goal:** Recognize repeated subproblems and calls that make no progress, count calls separately from active depth, and choose a better recursive design.  
> **User Prompt:** "Reexplain [Section 4.3] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]"

---

## Table of Contents

1. [Background & Conceptual Intuition: Two Ways Recursion Goes Wrong](#background-intuition)
   - [1. One verified race](#background-race)
   - [2. Repeated work versus no progress](#background-problems)
2. [Part 1: Section 4.3 — An Inefficient Uniqueness Test](#part-1)
   - [1. Check exactly which field is unique](#part-1-unique)
   - [2. Trace the overlapping calls](#part-1-trace)
   - [3. Count the worst-case work](#part-1-bound)
3. [Part 2: An Inefficient Recursion for Fibonacci Numbers](#part-2)
   - [1. Define a small photo-display pattern](#part-2-pattern)
   - [2. Find the repeated subproblems](#part-2-repeats)
4. [Part 3: An Efficient Recursion for Fibonacci Numbers](#part-3)
   - [1. Return two useful values together](#part-3-pair)
   - [2. Compare the answers and the work](#part-3-compare)
5. [Part 4: Section 4.3.1 — Maximum Recursive Depth in Python](#part-4)
   - [1. Total calls are different from active depth](#part-4-depth)
   - [2. Diagnose a binary-search call that cannot finish](#part-4-search)
   - [3. Understand Python's recursion limit](#part-4-limit)
6. [Part 5: Complete Runnable Comparison](#part-5)
   - [1. Program](#part-5-program)
   - [2. Read the output](#part-5-results)
7. [Part 6: Work Through Four Small Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Two Ways Recursion Goes Wrong

<span id="background-race"></span>

### 1. One Verified Race

As in the [Section 4.1](04-01-illustrative-examples.md) and [Section 4.2](04-02-analyzing-recursive-algorithms.md) explanations, the setting is the **Sunday MotoGP race at Misano on 13 September 2026**. The table is a **selection** from that single race, not a complete classification. [MotoGP's race report](https://www.motogp.com/en/news/2026/09/13/marc-marquez-capitalises-on-bezzecchi-error-to-seize-title-race-lead/1089345) identifies the riders, teams, and places; [Ducati's GP results](https://www.ducati.com/ww/en/racing/motogp/calendar/misano) give the gaps. [Yamaha's race report](https://www.yamaha-motogp.com/2026/newsletter/race/en/260913132359254/13-09-2026-quartararo-secures-top-10-finish-in-san-marino-gp) confirms Fabio's P10 and `+23.229 s`.

| Place | Rider | Team | Gap to winner |
| ---: | :--- | :--- | ---: |
| P1 | Marc Márquez | Ducati Lenovo Team | 0.000 s |
| P2 | Álex Márquez | BK8 Gresini Racing MotoGP | +0.657 s |
| P3 | Pedro Acosta | Red Bull KTM Factory Racing | +2.326 s |
| P10 | Fabio Quartararo | Monster Energy Yamaha MotoGP | +23.229 s |

Marc and Álex have the same **surname**, while their full names and finishing gaps differ. We will exploit that distinction in a uniqueness check. Later, a Fibonacci photo display uses these real rider identities but **invented display counts**. The display is not a race result.

<span id="background-problems"></span>

### 2. Repeated Work Versus No Progress

Section 4.2 taught us to count work across recursive calls. Section 4.3 shows two ways a recursive design can fail:

| Problem | What happens | Example here |
| :--- | :--- | :--- |
| **Repeated subproblems** | The same smaller input is solved again in another branch. The algorithm finishes, but can take far too many calls. | The uniqueness test revisits an overlapping slice; naive Fibonacci recomputes earlier values. |
| **No progress** | A child call receives the same problem as its parent, so it never reaches the base case. | A faulty binary-search bound keeps the same two candidates. |

Two recursive calls do **not** automatically mean wasted work. The ruler in Section 4.1 draws different left and right intervals. The problem here is **overlap**: a branch recomputes something another branch already solved. An unchanged recursive input is a different, more serious error because there is no path to termination.

**Why these examples?** They show both a performance problem and a correctness problem. **How to diagnose either one:** write down the input passed to each child call. Ask whether it is smaller and whether another branch has already solved it.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 4.3 — An Inefficient Uniqueness Test

<span id="part-1-unique"></span>

### 1. Check Exactly Which Field Is Unique

The book's `unique3` asks whether all values in a sequence are different. It uses a **half-open slice** `S[start:stop]`: `start` belongs to the slice, while `stop` does not. A slice with zero or one value is automatically unique. For a longer slice, the algorithm checks its first `n - 1` values, its last `n - 1` values, and finally its two endpoints.

Why are those checks enough? Every pair of positions is either wholly inside the first shorter slice, wholly inside the last shorter slice, or is the one pair made from the two endpoints. The code below uses the intended self-calls to `unique3`:

```python
def unique3(values, start, stop):
    if stop - start <= 1:
        return True
    if not unique3(values, start, stop - 1):
        return False
    if not unique3(values, start + 1, stop):
        return False
    return values[start] != values[stop - 1]


full_names = ["Marc Márquez", "Álex Márquez", "Fabio Quartararo"]
surnames = ["Márquez", "Márquez", "Quartararo"]
print("Full names unique:", unique3(full_names, 0, len(full_names)))
print("Surnames unique:", unique3(surnames, 0, len(surnames)))
```

```text
Full names unique: True
Surnames unique: False
```

The answer depends on **what the list contains**. Marc and Álex are distinct riders, so their full names are distinct. Their surnames are equal, so the surname list is not unique. Both lists use real riders from the selected race.

**Why this example?** It supplies a genuine duplicate without inventing a second finishing result, and it forces us to name the field being compared. **How to solve it:** first decide whether you are comparing full rider names, surnames, teams, or gaps; then trace the two shorter slices and the endpoint comparison. Code Fragment 4.6 in the supplied book labels the function `unique3` but prints `unique(...)` on its recursive lines. The runnable version above calls `unique3(...)` consistently.

<span id="part-1-trace"></span>

### 2. Trace the Overlapping Calls

For the three distinct full names, both shorter slices must be checked:

```text
[Marc, Álex, Fabio]
├── [Marc, Álex]
│   ├── [Marc]
│   └── [Álex]  ← first check of this singleton
└── [Álex, Fabio]
    ├── [Álex]  ← the same smaller question again
    └── [Fabio]
```

That is **7 function calls** for only 3 names. The duplicated `[Álex]` slice is the visible overlap. The surname list takes a shorter path: its first two values are both `Márquez`, so the first shorter slice returns `False` and Python skips the second recursive branch. That run makes **4 calls**.

| List examined | Result | Total calls | Why |
| :--- | :--- | ---: | :--- |
| Three distinct full names | `True` | 7 | Both branches run at each non-base call. |
| `Márquez, Márquez, Quartararo` | `False` | 4 | The duplicate in the first shorter slice stops the search early. |

**How to trace it:** count every invocation, including single-item base calls. When a recursive call returns `False`, follow the `if not ...: return False` line immediately; do not count a branch that is skipped.

<span id="part-1-bound"></span>

### 3. Count the Worst-Case Work

For an all-distinct input of length `n ≥ 1`, let `U(n)` count calls. The two recursive slices each have length `n - 1`, and the current call adds one:

```text
U(1) = 1
U(n) = 1 + 2U(n - 1)
     = 2^n - 1, for n ≥ 1.
```

Thus `U(3) = 7`, `U(4) = 15`, and `U(6) = 63`. The book gives **`O(2^n)` worst-case time** under constant local work per call. A duplicate may short-circuit the computation earlier, so `2^n - 1` is **not** the call count for every input. The code also accepts an empty slice and returns `True` in one call; the formula above starts at `n = 1`.

The lesson is not that branching recursion is inherently bad. The ruler's left and right intervals have distinct work. Here, the two `n - 1` slices overlap heavily, so the algorithm rechecks values it already examined.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: An Inefficient Recursion for Fibonacci Numbers

<span id="part-2-pattern"></span>

### 1. Define a Small Photo-Display Pattern

The Fibonacci sequence begins `F(0) = 0`, `F(1) = 1`, and `F(n) = F(n - 2) + F(n - 1)` for `n > 1`. Imagine a **hypothetical fan display** that alternates photos of Marc Márquez and Fabio Quartararo. Row `n` has `F(n)` photo slots. These row sizes are a teaching rule; they are **not** MotoGP points, laps, positions, or official attendance figures.

| Row `n` | Slots `F(n)` | How the count is obtained |
| ---: | ---: | :--- |
| 0 | 0 | Starting value. |
| 1 | 1 | Starting value. |
| 2 | 1 | `0 + 1`. |
| 3 | 2 | `1 + 1`. |
| 4 | 3 | `1 + 2`. |
| 5 | 5 | `2 + 3`. |
| 6 | 8 | `3 + 5`. |

The direct recursive program follows that equation literally:

```python
def bad_fibonacci(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    if n <= 1:
        return n
    return bad_fibonacci(n - 2) + bad_fibonacci(n - 1)


print("Photo slots in row 6:", bad_fibonacci(6))
```

```text
Photo slots in row 6: 8
```

**Why this example?** A row rule that uses the previous two counts naturally tempts us to write two recursive calls. Marc and Fabio make the invented display concrete, while the arithmetic remains the book's Fibonacci sequence. **How to solve the numeric problem:** use the two starting values and add the results for `n - 2` and `n - 1`; then inspect whether those subproblems are solved more than once.

<span id="part-2-repeats"></span>

### 2. Find the Repeated Subproblems

When computing `F(6)`, the left branch computes `F(4)`. The right branch computes `F(5)`, which asks for `F(4)` **again**:

```text
F(6)
├── F(4)
└── F(5)
    ├── F(3)
    └── F(4)  ← repeated, along with its smaller calls
```

Let `C(n)` count calls to `bad_fibonacci(n)`. Each non-base call adds itself and both child trees:

```text
C(0) = C(1) = 1
C(n) = 1 + C(n - 2) + C(n - 1), for n ≥ 2.
```

| `n` | Returned `F(n)` | Calls `C(n)` |
| ---: | ---: | ---: |
| 2 | 1 | 3 |
| 3 | 2 | 5 |
| 4 | 3 | 9 |
| 5 | 5 | 15 |
| 6 | 8 | 25 |
| 7 | 13 | 41 |

The book observes that the call count **more than doubles over every two indices**: for example, `C(6) = 25 > 2 × C(4) = 18`. Repeated recomputation gives **exponential growth** in calls. The result for row 6 is only `8`, but the direct program makes **25 calls** to obtain it. The problem is duplicated work, not an incorrect Fibonacci value.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: An Efficient Recursion for Fibonacci Numbers

<span id="part-3-pair"></span>

### 1. Return Two Useful Values Together

To avoid recomputing a previous value, change what the function returns. Instead of returning only `F(n)`, return the pair **`(F(n), F(n - 1))`**. One recursive call supplies both values the caller needs:

```python
def good_fibonacci(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    if n <= 1:
        return (n, 0)
    previous, before_previous = good_fibonacci(n - 1)
    return (previous + before_previous, previous)


print("Row 6 and row 5 slots:", good_fibonacci(6))
```

```text
Row 6 and row 5 slots: (8, 5)
```

For the base input `n = 0`, the book uses `(0, 0)` as a **pair-return convention** so the recursion has a simple starting value. We do not need a separate calculation of a negative-index Fibonacci number. For `n = 5`, the returned pair is `(5, 3)`; the `n = 6` caller makes `(5 + 3, 5) = (8, 5)`.

| Call returns from | Pair returned | What the next caller can do |
| ---: | :--- | :--- |
| `n = 1` | `(1, 0)` | Add `1 + 0` to get `F(2)`. |
| `n = 2` | `(1, 1)` | Add `1 + 1` to get `F(3)`. |
| `n = 3` | `(2, 1)` | Add `2 + 1` to get `F(4)`. |
| `n = 4` | `(3, 2)` | Add `3 + 2` to get `F(5)`. |
| `n = 5` | `(5, 3)` | Add `5 + 3` to get `F(6)`. |
| `n = 6` | `(8, 5)` | First value is the eight slots in row 6. |

**Why this example?** The two-value return preserves a result that the naive version throws away and later recomputes. **How to solve it:** ask one smaller call for `(F(n - 1), F(n - 2))`, add those values for the new first component, and carry the old first component into the new second component.

<span id="part-3-compare"></span>

### 2. Compare the Answers and the Work

For `n > 0`, `good_fibonacci` follows one chain: `n, n - 1, ..., 1`. It makes exactly **`n` calls**, so its time is **`O(n)`** in the book's constant-cost arithmetic model. At `n = 0`, it makes one base call. Both versions return the same `F(n)` as the first or only result:

| Row | Direct `bad_fibonacci` | Pair-returning `good_fibonacci` |
| :--- | :--- | :--- |
| `n = 6` result | `8` slots | `(8, 5)` slots for rows 6 and 5 |
| Total calls | 25 | 6 |
| Growth in calls | Exponential | Linear in `n` |

The improvement comes from the information returned by each call. The Python recursion limit can still matter for a very large `n`, because the efficient version has a chain of `n` active calls; it reduces **total repeated work**, not the length of that chain.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 4.3.1 — Maximum Recursive Depth in Python

<span id="part-4-depth"></span>

### 1. Total Calls Are Different from Active Depth

**Total calls** count every invocation during the whole run. **Maximum active depth** counts only the calls waiting on one path at the same time. After a branch returns, a later branch can reuse stack space. For our small examples:

| Calculation | Total calls | Maximum simultaneously active algorithm calls |
| :--- | ---: | ---: |
| `unique3` on the three distinct full names | 7 | 3 |
| `bad_fibonacci(6)` | 25 | 6 |
| `good_fibonacci(6)` | 6 | 6 |

The slow Fibonacci tree spreads work across many branches, yet its deepest chain is only six calls here. The efficient version has far fewer calls but the same deepest chain for `n = 6`. **Why this comparison?** It prevents us from treating an exponential call count as an exponential stack depth. **How to solve a depth question:** trace only the **longest parent-to-child path** that can be active before a return, not every branch added together.

<span id="part-4-search"></span>

### 2. Diagnose a Binary-Search Call That Cannot Finish

The book revisits binary search with a faulty right-side recursive bound. Use two **real winner-relative gaps** from Misano, sorted as `[(0, Marc Márquez), (23229, Fabio Quartararo)]` in milliseconds. Search for a **hypothetical** `20,000 ms` gap, which is absent from this two-row list.

| Step | Current inclusive range | Midpoint | What happens |
| ---: | :--- | :--- | :--- |
| 1 | `[0, 1]` | Index `0`: Marc, `0 ms` | Target is larger; go right. |
| Wrong next step | `[mid, high] = [0, 1]` | Index `0` again | **Exactly the same state** repeats. |
| Correct next step | `[mid + 1, high] = [1, 1]` | Index `1`: Fabio, `23,229 ms` | Target is smaller; next range is empty `[1, 0]`. |

The wrong call does not reduce the number of candidates from two. It can keep calling itself until Python interrupts it. The correct `mid + 1` excludes the midpoint already checked and reaches the empty-range base case. We only **trace** the wrong call; the runnable code below does not execute an endless recursion.

**Why this example?** Marc and Fabio provide a two-entry sorted list—the smallest range in which this off-by-one error is easy to see. **How to fix it:** for a right search, use `mid + 1`; for a left search, use `mid - 1`. After every non-base recursive call, verify that `high - low + 1` decreases.

<span id="part-4-limit"></span>

### 3. Understand Python's Recursion Limit

Python limits how deeply calls can be nested. The book gives **about 1,000** as a typical default and shows `sys.getrecursionlimit()` to inspect the current interpreter's setting. It also shows `sys.setrecursionlimit(...)`, but a larger limit does not remove repeated subproblems or make an unchanged search range shrink. Python's [current exception documentation](https://docs.python.org/3/builtins/exceptions.html#RecursionError) calls the depth error **`RecursionError`**, a subclass of the `RuntimeError` named in the book; the [official `sys` documentation](https://docs.python.org/3/library/sys.html#sys.getrecursionlimit) explains that the limit is interpreter-specific and warns that setting it too high can crash a program.

```python
import sys

print(sys.getrecursionlimit())  # inspect your interpreter; the value may vary
```

This inspection is safe and has no fixed output to memorize. A recursion limit is a **guard**, not a proof that an algorithm is correct. First fix a call that makes no progress. For a legitimate algorithm with a very deep chain, choose an iterative design when suitable or evaluate the depth and platform constraints before changing the limit.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Complete Runnable Comparison

<span id="part-5-program"></span>

### 1. Program

The program below counts calls and maximum active depth for the two uniqueness inputs and the two Fibonacci implementations. It then **calculates** the wrong and right binary-search ranges without running the faulty recursion. The counters record only calls to the algorithm being examined.

```python
def new_stats():
    return {"calls": 0, "max_depth": 0}


def record_call(stats, depth):
    stats["calls"] += 1
    stats["max_depth"] = max(stats["max_depth"], depth)


def unique3(values, start, stop, stats, depth=1):
    record_call(stats, depth)
    if stop - start <= 1:
        return True
    if not unique3(values, start, stop - 1, stats, depth + 1):
        return False
    if not unique3(values, start + 1, stop, stats, depth + 1):
        return False
    return values[start] != values[stop - 1]


def bad_fibonacci(n, stats, depth=1):
    if n < 0:
        raise ValueError("n must be nonnegative")
    record_call(stats, depth)
    if n <= 1:
        return n
    return (bad_fibonacci(n - 2, stats, depth + 1)
            + bad_fibonacci(n - 1, stats, depth + 1))


def good_fibonacci(n, stats, depth=1):
    if n < 0:
        raise ValueError("n must be nonnegative")
    record_call(stats, depth)
    if n <= 1:
        return (n, 0)
    previous, before_previous = good_fibonacci(n - 1, stats, depth + 1)
    return (previous + before_previous, previous)


full_names = ["Marc Márquez", "Álex Márquez", "Fabio Quartararo"]
surnames = ["Márquez", "Márquez", "Quartararo"]
for label, values in (("full names", full_names), ("surnames", surnames)):
    stats = new_stats()
    result = unique3(values, 0, len(values), stats)
    print("{} unique: {} | calls: {} | depth: {}".format(
        label, result, stats["calls"], stats["max_depth"]))

bad_stats = new_stats()
bad_result = bad_fibonacci(6, bad_stats)
print("bad F(6): {} | calls: {} | depth: {}".format(
    bad_result, bad_stats["calls"], bad_stats["max_depth"]))

good_stats = new_stats()
good_result = good_fibonacci(6, good_stats)
print("good F(6): {} | calls: {} | depth: {}".format(
    good_result, good_stats["calls"], good_stats["max_depth"]))

low, high = 0, 1           # two sorted rows: Marc 0 ms, Fabio 23,229 ms
mid = (low + high) // 2   # mid is 0 for this range
wrong_right = (mid, high)
correct_right = (mid + 1, high)
print("right range: wrong {} | correct {}".format(wrong_right, correct_right))
```

<span id="part-5-results"></span>

### 2. Read the Output

```text
full names unique: True | calls: 7 | depth: 3
surnames unique: False | calls: 4 | depth: 3
bad F(6): 8 | calls: 25 | depth: 6
good F(6): (8, 5) | calls: 6 | depth: 6
right range: wrong (0, 1) | correct (1, 1)
```

The duplicate surname stops `unique3` early. Both Fibonacci functions agree on `F(6) = 8` invented photo slots, while their call counts differ sharply. The last line exposes a search call that would repeat `[0, 1]` and a corrected call that shrinks to `[1, 1]`. The measured runs illustrate the earlier arguments; the recurrences explain what happens as input size grows.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Work Through Four Small Cases

| Question | Check | Answer |
| :--- | :--- | :--- |
| Is an empty list unique? | `stop - start = 0`, so `unique3` takes its base case. | `True` after one call. |
| What happens if all four full rider names in the opening table are distinct? | With no early `False`, use `U(4) = 2^4 - 1`. | `15` calls to return `True`. |
| How many calls are needed for invented photo row 7? | `bad_fibonacci`: `1 + C(5) + C(6) = 1 + 15 + 25`; `good_fibonacci`: one chain down to `1`. | Both return `F(7) = 13`; the first makes **41 calls**, the second **7**. |
| Will a larger recursion limit repair the wrong search range? | `[0, 1]` still produces `[0, 1]`. | No. Exclude the midpoint with `mid + 1`. |

For each new recursive problem, check **both** questions: Does every continuing call move toward a base case? Does it recompute a smaller answer that another branch already found? The first question governs termination; the second helps control running time.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 4.3 idea | Plain-language meaning | Misano teaching example |
| :--- | :--- | :--- |
| Overlapping uniqueness slices | Rechecking the same smaller slice can make work grow exponentially. | Three distinct rider full names take seven calls; repeated Márquez surnames stop early. |
| Direct Fibonacci recursion | Two branches recompute previous values. | Row 6 has eight invented Marc/Fabio photo slots but takes 25 calls. |
| Pair-returning Fibonacci recursion | Carry both consecutive values back from one smaller call. | `(8, 5)` for rows 6 and 5 needs six calls. |
| Total calls versus depth | Count all invocations separately from the longest active path. | Both Fibonacci methods reach depth six for row 6, despite 25 versus 6 total calls. |
| Missing progress | An unchanged recursive range cannot reach its base case. | Searching between Marc's and Fabio's gaps requires `mid + 1` on the right. |
| Python recursion limit | A depth guard interrupts an overly deep call chain. | Inspect the limit with `sys.getrecursionlimit()`; fix the recursive logic first. |

Efficient recursion depends on the **shape of the subproblems** and the information each call returns. Trace inputs, identify repeated work, and verify that every path toward another call still moves closer to a base case.

[🔝 Back to Top](#top)
