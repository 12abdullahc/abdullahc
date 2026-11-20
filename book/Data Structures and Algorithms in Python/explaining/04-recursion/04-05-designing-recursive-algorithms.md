<span id="top"></span>

# Recursion — Section 4.5: Designing Recursive Algorithms

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.5 (printed page 177).  
> **Topic:** Base cases, progress toward a base case, useful recursive parameters, public wrappers, and richer return values.  
> **Domain focus:** The **MotoGP race at the 2026 San Marino and Rimini Riviera Grand Prix**, held at Misano on Sunday, 13 September 2026.  
> **Learning goal:** Design a correct recursive search from a plain-language question, explain why its bounds shrink without copying the list, and recognize the same design choices in earlier chapter examples.  
> **User Prompt:** "Reexplain [Section 4.5] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]"

---

## Table of Contents

1. [Background & Conceptual Intuition: Design Around a Smaller Question](#background-intuition)
   - [1. One verified race and one sorted catalog](#background-race)
   - [2. Name what changes from call to call](#background-state)
2. [Part 1: Section 4.5 — The Two Design Steps](#part-1)
   - [1. Give every base case a direct answer](#part-1-base)
   - [2. Make every continuing call smaller](#part-1-progress)
   - [3. Try concrete cases before writing code](#part-1-concrete)
3. [Part 2: Parameterizing a Recursion](#part-2)
   - [1. Add bounds to describe the same kind of search](#part-2-bounds)
   - [2. Trace Marc, Fabio, and an absent gap](#part-2-trace)
   - [3. Preserve the benefit of halving without list copies](#part-2-slices)
   - [4. Hide recursive state behind a public wrapper](#part-2-wrapper)
   - [5. Reuse the idea in sums, reversal, and Fibonacci](#part-2-other)
4. [Part 3: Complete Runnable Misano Example](#part-3)
   - [1. Program](#part-3-program)
   - [2. Read the output](#part-3-results)
5. [Part 4: Work Through Five Small Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Design Around a Smaller Question

<span id="background-race"></span>

### 1. One Verified Race and One Sorted Catalog

This explanation continues the [Section 4.1](04-01-illustrative-examples.md), [Section 4.2](04-02-analyzing-recursive-algorithms.md), [Section 4.3](04-03-recursion-run-amok.md), and [Section 4.4](04-04-further-examples-of-recursion.md) examples using **Sunday's MotoGP race at Misano on 13 September 2026**. The four riders below are a **selection** from that race, not a full classification. [MotoGP's race report](https://www.motogp.com/en/news/2026/09/13/marc-marquez-capitalises-on-bezzecchi-error-to-seize-title-race-lead/1089345) identifies the riders, places, and teams; [Ducati's GP results](https://www.ducati.com/ww/en/racing/motogp/calendar/misano) give their gaps to winner Marc Márquez. [Yamaha's race report](https://www.yamaha-motogp.com/2026/newsletter/race/en/260913132359254/13-09-2026-quartararo-secures-top-10-finish-in-san-marino-gp) confirms Fabio Quartararo's P10 finish and `+23.229 s` gap.

| Place | Rider | Team | Gap to winner | Integer gap used in code |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Marc Márquez | Ducati Lenovo Team | 0.000 s | 0 ms |
| P2 | Álex Márquez | BK8 Gresini Racing MotoGP | +0.657 s | 657 ms |
| P3 | Pedro Acosta | Red Bull KTM Factory Racing | +2.326 s | 2,326 ms |
| P10 | Fabio Quartararo | Monster Energy Yamaha MotoGP | +23.229 s | 23,229 ms |

These are **winner-relative gaps**, stored as whole milliseconds to make comparisons exact. The selected values form the sorted list `[0, 657, 2326, 23229]`. We will ask whether a gap appears in that small catalog. This is a **teaching lookup**, not a MotoGP classification procedure. Later, a checksum and display examples are also teaching constructions; they are not published race measures.

**Why these riders?** Marc and Fabio mark opposite ends of a short sorted list, while Álex and Pedro give the search useful middle values. **How do we use the data?** Compare an integer target with the middle gap, then keep only the part where it could still appear.

<span id="background-state"></span>

### 2. Name What Changes from Call to Call

The public question sounds simple: “Does this selected gap list contain Fabio's `23229 ms`?” A recursive search must also know **which part of the list remains possible**. The list and target stay the same; two index bounds change.

```text
Public question:    binary_search(gaps, 23229)
Smaller question:   _binary_search(gaps, 23229, low, high)
```

Here `[low, high]` is an **inclusive** range: both endpoint indices are candidates. For four values, the initial range is `[0, 3]`. If `low > high`, it contains no candidates. Other algorithms from this chapter describe their remaining work differently:

| Question | Changing state | Smallest direct answer |
| :--- | :--- | :--- |
| Sum the first `n` selected gaps. | `n` decreases. | Zero values sum to `0`. |
| Search a sorted range for one gap. | `[low, high]` narrows. | An empty range means `False`. |
| Reverse a row of rider records. | Half-open `[start, stop)` moves inward. | Zero or one record needs no swap. |

The search's inclusive `[low, high]` and reversal's half-open `[start, stop)` use **different endpoint rules**. State the rule before writing the base case or changing an endpoint.

**Why name this state?** The recursive call must identify a smaller problem of the **same kind**, not an unrelated calculation. **How to find it:** describe exactly which candidates remain after one step, then choose parameters that express that description.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 4.5 — The Two Design Steps

Section 4.5 gives a general recipe: **test base cases**, then **recur on a problem that moves toward a base case**. It asks us to check every possible call path, not only the successful one. The section is design guidance and refers back to earlier chapter algorithms; it introduces no new code fragment or figure.

<span id="part-1-base"></span>

### 1. Give Every Base Case a Direct Answer

A **base case** returns without another recursive call. A function may need several direct answers. For our binary search, two outcomes are immediate:

| Situation | Direct answer | Why it is safe |
| :--- | :--- | :--- |
| `low > high` | `False` | No list position remains to inspect. |
| `data[mid] == target` | `True` | The value is present at `mid`. |

Check the empty range **before** reading `data[mid]`. For an empty list, the public wrapper supplies `low = 0` and `high = -1`; the helper returns `False` without indexing. A found midpoint returns `True` without making another call.

The other chapter examples have their own smallest inputs. The first zero gaps sum to `0`, regardless of the fact that Marc's **actual** gap is also zero. Those are different reasons for the same numeric answer: `linear_sum(gaps, 0)` uses an empty-prefix base case, while `linear_sum(gaps, 1)` adds Marc's `0 ms` value. A one-card display is already its own reversal.

**Why these base cases?** They cover both success and failure and avoid reading an element that is absent. **How to choose them:** ask what the answer must be when no work remains or when the requested result is already known. Return that answer directly.

<span id="part-1-progress"></span>

### 2. Make Every Continuing Call Smaller

After a base-case check fails, a recursive call must move closer to one. A useful proof is to name a nonnegative whole-number **measure** that strictly decreases on **every** recursive branch:

| Algorithm | Measure of remaining work | Change in a continuing call |
| :--- | :--- | :--- |
| Binary search | Number of candidates, `high - low + 1`. | Discard `mid` and one side; keep at most about half. |
| Prefix sum | Number of values, `n`. | Recur with `n - 1`. |
| Reversal | Range length, `stop - start`. | Recur with `start + 1, stop - 1`, shrinking by two. |

For binary search, a target smaller than `data[mid]` must use `[low, mid - 1]`; a larger target must use `[mid + 1, high]`. The `- 1` and `+ 1` exclude the middle position already checked. This matters even with two entries:

```text
data = [0, 23229]     # Marc and Fabio's real gaps, in ms
target = 1000         # hypothetical gap, absent from this two-row list
range [0, 1] → mid = 0 → data[0] = 0 → target is larger
wrong right range [mid, high]     = [0, 1]  ← unchanged; cannot reach a base case
correct right range [mid+1, high] = [1, 1]  ← one candidate remains
```

The correct search next checks Fabio's `23229 ms`, finds that `1000` is smaller, and calls `[1, 0]`; `low > high` returns `False`. We only **trace** the wrong bound, so none of the runnable code loops forever. This is the same progress issue highlighted in [Section 4.3](04-03-recursion-run-amok.md).

**Why this two-rider case?** It is the smallest example where a wrong bound visibly repeats the same question. **How to verify progress:** calculate the candidate count before and after each possible call. A continuing call with an unchanged count needs a different bound.

<span id="part-1-concrete"></span>

### 3. Try Concrete Cases Before Writing Code

The book recommends working out small examples when the repeating structure is hard to see. For a sorted gap list, try one target at the left end, one at the right end, and one absent target:

| Target | First middle gap | What the smaller question must ask |
| :--- | ---: | :--- |
| Marc's `0 ms` | Álex's `657 ms` | Search only the lower-index portion. |
| Fabio's `23229 ms` | Álex's `657 ms` | Search only the higher-index portion. |
| Hypothetical `1000 ms` | Álex's `657 ms` | Go right first, then possibly go left. |

Each follow-up remains the **same question**—“Does the target occur in this sorted list?”—but over a narrower range. These examples tell us that the changing state is a pair of bounds. They also reveal all three outcomes the code must handle: go left, go right, or stop.

**Why try all three?** A single successful search might hide a broken branch or a missing failure base case. **How to use the trials:** write the current bounds and middle value on each line; check that the next range excludes the middle and contains every still-possible answer.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Parameterizing a Recursion

<span id="part-2-bounds"></span>

### 1. Add Bounds to Describe the Same Kind of Search

The natural public signature `binary_search(data, target)` does not itself say **which half** a child call should search. Section 4.5 explains why the chapter's recursive version adds `low` and `high`. The bounds describe a smaller question without changing the list:

```python
def _binary_search(data, target, low, high):
    if low > high:
        return False
    mid = (low + high) // 2
    if data[mid] == target:
        return True
    if target < data[mid]:
        return _binary_search(data, target, low, mid - 1)
    return _binary_search(data, target, mid + 1, high)
```

This helper assumes `data` is sorted in increasing order. If the target is smaller than the middle value, sorted order rules out the middle and every value to its right. If larger, it rules out the middle and every value to its left. Without sorted order, discarding either side would be unjustified.

The helper's invariant is: **if the target is present among the original candidates, it is present somewhere in `data[low:high+1]`**. The notation names the eligible positions; the helper itself does **not** create that Python slice. Each recursive call keeps the invariant and reduces `high - low + 1`.

**Why this signature?** The original list stays available, while the bounds name the current subproblem precisely. **How to derive it:** keep the fixed data and target as parameters; add only the state that changes when the range is narrowed.

<span id="part-2-trace"></span>

### 2. Trace Marc, Fabio, and an Absent Gap

Use the four sorted real gap labels `[0, 657, 2326, 23229]`. Python indices are `0, 1, 2, 3`, and `mid = (low + high) // 2` rounds down.

| Target | Inclusive bounds | Middle index and value | Next action |
| :--- | :---: | :--- | :--- |
| Fabio, `23229` | `[0, 3]` | `1`: Álex, `657` | Larger; keep `[2, 3]`. |
| Fabio, `23229` | `[2, 3]` | `2`: Pedro, `2326` | Larger; keep `[3, 3]`. |
| Fabio, `23229` | `[3, 3]` | `3`: Fabio, `23229` | Match; return `True`. |
| Marc, `0` | `[0, 3]` | `1`: Álex, `657` | Smaller; keep `[0, 0]`. |
| Marc, `0` | `[0, 0]` | `0`: Marc, `0` | Match; return `True`. |
| Hypothetical `1000` | `[0, 3]` | `1`: Álex, `657` | Larger; keep `[2, 3]`. |
| Hypothetical `1000` | `[2, 3]` | `2`: Pedro, `2326` | Smaller; keep `[2, 1]`. |
| Hypothetical `1000` | `[2, 1]` | No middle: empty range | Return `False`. |

For the absent value, the candidate counts are `4 → 2 → 0`; the final helper call is the failure base case. Fabio's search checks three values; Marc's checks two. An absent gap of `1000 ms` is invented solely to test the algorithm and is **not** assigned to a race finisher.

**Why these three searches?** Together they exercise the right branch, left branch, match, and empty-range return. **How to solve each one:** compare only with the middle of the current range, choose the side allowed by sorted order, exclude the middle, and repeat until a direct answer applies.

<span id="part-2-slices"></span>

### 3. Preserve the Benefit of Halving Without List Copies

One could retain a two-argument recursive signature by passing `data[:mid]` or `data[mid+1:]` to a child call. In Python, those slices create **new lists**. On a long search path, the copies contain about `n/2`, then `n/4`, then `n/8`, and so on: their total length is `O(n)`. The search still makes `O(log n)` comparisons, but copying can make its **worst-case total time `O(n)`**. The live slices can also occupy `O(n)` total additional list storage along that path.

With bounds, every call reuses the same list. It changes only two integers and compares one middle value, giving **`O(log n)` worst-case time** and **`O(log n)` recursive stack space** under the book's constant-cost comparison model. The two methods answer the same question, but parameterizing the range preserves the benefit of binary search.

**Why discuss copying?** A recursive definition can be correct yet lose the efficiency that motivated it. **How to choose:** if the smaller problem is a **portion of the same sequence**, pass its bounds when random access is available, instead of making a fresh sequence at every level.

<span id="part-2-wrapper"></span>

### 4. Hide Recursive State Behind a Public Wrapper

A caller should not have to calculate `0` and `len(data) - 1` every time. The book proposes a simple public function that calls an internal recursive helper with those initial bounds:

```python
def binary_search(data, target):
    return _binary_search(data, target, 0, len(data) - 1)


print(binary_search([0, 657, 2326, 23229], 23229))
```

```text
True
```

The leading underscore in `_binary_search` is a Python convention for an internal helper. The wrapper has the public two-argument call; the helper has the four parameters needed to express each subproblem. For an empty list, the wrapper passes `(low, high) = (0, -1)`, so the helper returns `False` immediately.

**Why this example?** It shows how a clean interface and a useful recursive signature can coexist. **How to solve the interface problem:** let the wrapper set the full initial range once, then let the helper update bounds in its own calls. The printed line assumes the `_binary_search` definition just above is already loaded.

<span id="part-2-other"></span>

### 5. Reuse the Idea in Sums, Reversal, and Fibonacci

Section 4.5 points back to other chapter examples that were **reparameterized**. Their extra parameters name the part of the original problem still to solve:

| Earlier algorithm | Changing parameter | Base case | Smaller same-kind problem |
| :--- | :--- | :--- | :--- |
| `linear_sum(S, n)` | Prefix length `n`. | `n == 0` gives `0`. | Sum the first `n - 1` values, then add the last. |
| `reverse(S, start, stop)` | Half-open interval `[start, stop)`. | At most one item needs no swap. | Reverse the inside after swapping the ends. |
| `binary_sum(S, start, stop)` | Half-open interval `[start, stop)`. | Empty gives `0`; one value gives that value. | Sum each of two disjoint smaller intervals. |

For the selected Misano gaps, `linear_sum([0, 657, 2326, 23229], 4)` produces a **notebook checksum** of `26212 ms`. That total is a teaching calculation, not a combined race gap. Reversing the four rider **records** changes only a hypothetical display order; it does not change race positions or detach a rider from his team and gap.

The book also names a different design move: **strengthen what a recursive call returns**. Section 4.3's `good_fibonacci(n)` returns a pair, rather than only one number. For `n > 0`, the pair is `(F(n), F(n - 1))`. At `n = 0`, the chapter uses `(0, 0)` as a convenient base convention, without needing a negative-index Fibonacci number. One call for `n - 1` supplies both values needed to produce the pair for `n`:

```text
good_fibonacci(5) returns (5, 3)
good_fibonacci(6) returns (5 + 3, 5) = (8, 5)
```

Think of row 6 as **eight invented Marc/Fabio fan-photo slots** and row 5 as five. This is the Fibonacci row rule from Section 4.3, separate from Section 4.4's doubling display. Neither count is a MotoGP result.

**Why include the pair?** It shows that better recursion can come from changing the **answer supplied by a child call**, not only from adding input parameters. **How to design such a return:** ask what the caller needs next. If one smaller call can return those related pieces together, it may avoid a second call that repeats work.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Complete Runnable Misano Example

<span id="part-3-program"></span>

### 1. Program

The code below applies the design steps to the same four race entries. The search uses **sorted numeric gaps** and returns a Boolean, as in the book. The checksum and reversed record row are explicitly teaching tasks. The Fibonacci slots follow an invented fan-display rule from the preceding explanation.

```python
def _binary_search(data, target, low, high):
    if low > high:
        return False
    mid = (low + high) // 2
    if data[mid] == target:
        return True
    if target < data[mid]:
        return _binary_search(data, target, low, mid - 1)
    return _binary_search(data, target, mid + 1, high)


def binary_search(data, target):
    """Return whether target occurs in an increasing numeric list."""
    return _binary_search(data, target, 0, len(data) - 1)


def _sum_prefix(values, n):
    if n == 0:
        return 0
    return _sum_prefix(values, n - 1) + values[n - 1]


def gap_checksum(values):
    """Teaching sum of selected winner-relative gap labels."""
    return _sum_prefix(values, len(values))


def _reverse_display(records, start, stop):
    if start < stop - 1:
        records[start], records[stop - 1] = records[stop - 1], records[start]
        _reverse_display(records, start + 1, stop - 1)


def reverse_display(records):
    """Reverse a hypothetical row of whole rider records in place."""
    _reverse_display(records, 0, len(records))


def good_fibonacci(n):
    """Return current and previous invented photo-row slot counts."""
    if n < 0:
        raise ValueError("row number must be nonnegative")
    if n <= 1:
        return (n, 0)
    previous, before_previous = good_fibonacci(n - 1)
    return (previous + before_previous, previous)


# Sunday 13 September 2026 Misano MotoGP race; gaps are to winner Marc.
race = [
    ("Marc Márquez", "Ducati Lenovo Team", 0),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 657),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 2326),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP", 23229),
]
gaps = [record[2] for record in race]  # increasing order is required

print("selected gaps (ms):", gaps)
print("Fabio gap present:", binary_search(gaps, 23229))
print("Marc gap present:", binary_search(gaps, 0))
print("hypothetical 1000 ms gap present:", binary_search(gaps, 1000))
print("empty catalog contains Fabio gap:", binary_search([], 23229))
print("selected gap checksum:", gap_checksum(gaps), "ms")

display = race.copy()
reverse_display(display)
print("reversed display:", [record[0] for record in display])

print("Fibonacci photo rows 6 and 5:", good_fibonacci(6))
```

<span id="part-3-results"></span>

### 2. Read the Output

```text
selected gaps (ms): [0, 657, 2326, 23229]
Fabio gap present: True
Marc gap present: True
hypothetical 1000 ms gap present: False
empty catalog contains Fabio gap: False
selected gap checksum: 26212 ms
reversed display: ['Fabio Quartararo', 'Pedro Acosta', 'Álex Márquez', 'Marc Márquez']
Fibonacci photo rows 6 and 5: (8, 5)
```

The first four search lines exercise both direct answers and both directions of progress. The helper never copies `gaps`. The reversed display moves whole `(rider, team, gap)` records, so Fabio's name stays paired with his Yamaha team and `23229 ms` gap even though the printed line shows names only. The final pair represents **invented** Fibonacci photo-row counts, not a race statistic.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Work Through Five Small Cases

<details>
<summary><strong>Case Study 1: What if the search catalog is empty?</strong></summary>

**Scenario:** Call `binary_search([], 23229)`. **Why this case?** It checks whether the failure base works before any indexing. **How to solve it:** the wrapper sets `low = 0` and `high = -1`; the helper immediately sees `low > high` and returns `False`.

</details>

<details>
<summary><strong>Case Study 2: Can a zero result mean two different things?</strong></summary>

**Scenario:** Sum no selected gaps, then sum only Marc's real `0 ms` winner gap. **Why this case?** It separates the empty-prefix base from an actual data value. **How to solve it:** `_sum_prefix(gaps, 0)` directly returns `0`; `_sum_prefix(gaps, 1)` makes one child call for zero values and adds `gaps[0] = 0`. Both return numeric zero, but the second input contains one rider.

</details>

<details>
<summary><strong>Case Study 3: What if the selected gaps are unsorted?</strong></summary>

**Scenario:** Reverse the numeric list to `[23229, 2326, 657, 0]`, then search it for Fabio's `23229`. **Why this case?** A shrinking range alone does not guarantee a correct answer. **How to solve it:** with bounds `[0, 3]`, the middle is `2326` at index `1`. The helper would discard the left side because `23229 > 2326`, incorrectly losing Fabio's value at index `0`. Keep numeric search data increasing; reversing the separate display does not reverse `gaps`.

</details>

<details>
<summary><strong>Case Study 4: Why pass bounds instead of sliced halves?</strong></summary>

**Scenario:** Search a much longer sorted list of gap labels. **Why this case?** It shows that a correct subproblem description can still be expensive to build. **How to solve it:** compare `data, low, high` with making `data[:mid]` or `data[mid+1:]`. Bounds pass the same list and change two integers; repeated slices copy a total of `O(n)` entries along a worst-case path, losing the intended `O(log n)` time.

</details>

<details>
<summary><strong>Case Study 5: Why return two Fibonacci counts?</strong></summary>

**Scenario:** Find invented fan-photo row 6's count after row 5. **Why this case?** It illustrates a design change to the return value rather than the arguments. **How to solve it:** one child call gives `good_fibonacci(5) = (5, 3)`; form `(5 + 3, 5) = (8, 5)`. The caller receives both row 6 and row 5 counts without recomputing row 5 in a second branch.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 4.5 design choice | Question to ask | Misano teaching example |
| :--- | :--- | :--- |
| **Base cases** | Can the smallest or already-solved inputs return directly? | Empty gap range returns `False`; a matched midpoint returns `True`. |
| **Progress** | Does every continuing call reduce a nonnegative measure? | Inclusive candidate count shrinks when search excludes `mid`. |
| **Same-shaped subproblem** | Is the child solving the same question on less input? | Search the same sorted gap list over a narrower index range. |
| **Extra parameters** | What state identifies that smaller range? | `low` and `high` carry the current inclusive bounds without a copy. |
| **Wrapper and helper** | Can callers use a simple interface? | `binary_search(gaps, 23229)` initializes the helper at `[0, 3]`. |
| **Richer return value** | What information will the caller need next? | `good_fibonacci(6) = (8, 5)` carries consecutive invented photo-row counts. |

**A practical design check:** write the base answers, name a measure that shrinks on every branch, specify the smaller question, and verify the function's input assumptions. Then choose parameters or return values that express that question without unnecessary repeated work.

[🔝 Back to Top](#top)
