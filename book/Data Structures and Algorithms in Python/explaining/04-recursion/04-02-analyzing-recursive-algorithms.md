<span id="top"></span>

# Recursion — Section 4.2: Analyzing Recursive Algorithms

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.2 (printed pages 161–164).  
> **Topic:** Count the work in recursive factorial, ruler drawing, binary search, and disk-usage traversal.  
> **Domain focus:** The **MotoGP race at the 2026 San Marino and Rimini Riviera Grand Prix**, held at Misano on Sunday, 13 September 2026.  
> **Learning goal:** Separate an algorithm's answer from the work needed to produce it, then derive its running-time bound by counting work across recursive calls.  
> **User Prompt:** "Reexplain [Section 4.2] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]"

---

## Table of Contents

1. [Background & Conceptual Intuition: Measure Work, Not the Answer](#background-intuition)
   - [1. One verified MotoGP race](#background-race)
   - [2. Results and work are different quantities](#background-work)
2. [Part 1: Section 4.2 — How to Analyze Recursion](#part-1)
   - [1. Count local work in each activation](#part-1-activations)
   - [2. Choose an input-size measure](#part-1-input)
3. [Part 2: Computing Factorials](#part-2)
   - [1. Trace a small card-order problem](#part-2-trace)
   - [2. Derive the linear bound](#part-2-bound)
4. [Part 3: Drawing an English Ruler](#part-3)
   - [1. Count the printed interior ticks](#part-3-lines)
   - [2. Prove the exact formula](#part-3-proof)
   - [3. Separate printed lines from function calls](#part-3-calls)
5. [Part 4: Performing a Binary Search](#part-4)
   - [1. Trace searches in sorted race gaps](#part-4-trace)
   - [2. Derive the logarithmic bound](#part-4-bound)
6. [Part 5: Computing Disk Space Usage](#part-5)
   - [1. Count entries and child visits](#part-5-tree)
   - [2. Add loop work across the whole tree](#part-5-bound)
7. [Part 6: Complete Runnable Work-Counting Program](#part-6)
   - [1. Program](#part-6-program)
   - [2. Interpret the output](#part-6-results)
8. [Part 7: Work Through Four Small Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Measure Work, Not the Answer

<span id="background-race"></span>

### 1. One Verified MotoGP Race

We use the **Sunday MotoGP race at Misano on 13 September 2026**, the same session used in the [Section 4.1 explanation](04-01-illustrative-examples.md). Marc Márquez won and Fabio Quartararo finished tenth. This is a **six-rider selection** from the race classification, ordered by each rider's gap to Marc. The positions and full team names are in [MotoGP's race report](https://www.motogp.com/en/news/2026/09/13/marc-marquez-capitalises-on-bezzecchi-error-to-seize-title-race-lead/1089345); the gaps are in [Ducati's GP results](https://www.ducati.com/ww/en/racing/motogp/calendar/misano). [Yamaha's race report](https://www.yamaha-motogp.com/2026/newsletter/race/en/260913132359254/13-09-2026-quartararo-secures-top-10-finish-in-san-marino-gp) confirms Fabio's P10 and `+23.229 s`.

| Place | Rider | Team | Gap to winner | Gap in milliseconds |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Marc Márquez | Ducati Lenovo Team | 0.000 s | 0 |
| P2 | Álex Márquez | BK8 Gresini Racing MotoGP | +0.657 s | 657 |
| P3 | Pedro Acosta | Red Bull KTM Factory Racing | +2.326 s | 2,326 |
| P5 | Jorge Martín | Aprilia Racing | +14.021 s | 14,021 |
| P6 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | +18.252 s | 18,252 |
| P10 | Fabio Quartararo | Monster Energy Yamaha MotoGP | +23.229 s | 23,229 |

The gaps are **race-finish gaps**, not best-lap times. Converting seconds to integer milliseconds preserves the classification's three-decimal precision: `23.229 × 1,000 = 23,229`. The rider and result facts are real; the card arrangement, ruler scale, and sample files used below are teaching constructions.

<span id="background-work"></span>

### 2. Results and Work Are Different Quantities

Section 4.1 asked **what** each recursive algorithm returns or prints. Section 4.2 asks **how much work** it performs as its input grows. For example, three distinct rider display cards have `3! = 6` possible orders, but evaluating `factorial(3)` makes **four function calls**, for `3, 2, 1, 0`. The answer `6` is not the call count.

| Quantity | Question | Example |
| :--- | :--- | :--- |
| **Result** | What value or output do we want? | `3! = 6` card orders. |
| **Work** | How many calls, comparisons, printed lines, or child visits are needed? | Four factorial calls. |
| **Input size** | What grows when we consider larger problems? | Number `n` of cards. |

The book counts **primitive operations** and uses big-Oh notation to describe their growth. We will follow its abstract model: a list index lookup, a comparison, or a simple arithmetic step counts as constant local work. Actual elapsed time can depend on Python's large integers, printing, and file-system I/O; the bounds here describe the algorithms under the stated model.

**Why this setup?** The same race facts can support all four examples without changing sessions or mixing race gaps with lap times. **How to use it:** label each result and each unit first, then separately count the operations needed to obtain that result.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 4.2 — How to Analyze Recursion

<span id="part-1-activations"></span>

### 1. Count Local Work in Each Activation

An **activation** is one invocation of a function, with its own parameters and local variables. The caller pauses while a recursive child call runs. To analyze time, charge each operation to the activation that performs it, then add the charges over **all** activations:

```text
total work = local work in the starting call
           + local work in every recursive call it starts
```

If each call does constant local work and there are `C(n)` calls, the total is `O(C(n))`. This shortcut needs care: the disk-usage function has a loop over a directory's children, so its local work can vary from call to call. We will add those loop iterations across the whole traversal instead.

**Why this example of accounting?** It gives one method for algorithms with very different call shapes: factorial makes a chain, the ruler branches twice, binary search keeps one half, and disk usage follows a tree. **How to solve an analysis:** write down the work done in one call, count how many such calls or loop iterations occur, and sum them.

<span id="part-1-input"></span>

### 2. Choose an Input-Size Measure

The symbol `n` means something different for each problem. A running-time bound is meaningful only after we say what input is growing.

| Algorithm | Size measure | What happens in a recursive call? |
| :--- | :--- | :--- |
| Factorial | Number `n` of cards to arrange. | `n` decreases by one. |
| Ruler | Interior tick level `c`. | Two calls use `c - 1`. |
| Binary search | Number `n` of sorted candidates. | At most half remain. |
| Disk usage | Number `n` of file-system entries, including the starting entry. | Visit each child entry. |

The magnitude of a stored value is not automatically the input size. Fabio's `23,229 ms` gap is the **search target**; the number of stored rider rows controls the search work. Similarly, a file may contain millions of bytes but still counts as one entry in this traversal analysis.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Computing Factorials

<span id="part-2-trace"></span>

### 1. Trace a Small Card-Order Problem

Use three distinct **display cards** labeled Marc Márquez (Ducati Lenovo Team), Pedro Acosta (Red Bull KTM Factory Racing), and Fabio Quartararo (Monster Energy Yamaha MotoGP). Counting their possible desk orders is hypothetical; it does not alter their actual race places. Factorial computes `3! = 6` orders using one smaller call at each positive input:

```text
factorial(3) → factorial(2) → factorial(1) → factorial(0)
```

| Input `n` | Possible orders `n!` | Calls made by `factorial(n)` | Multiplications |
| ---: | ---: | ---: | ---: |
| 0 | 1 | 1 | 0 |
| 1 | 1 | 2 | 1 |
| 2 | 2 | 3 | 2 |
| 3 | 6 | 4 | 3 |

The `n = 0` call returns `1` without multiplying. The `n = 3` call waits for the smaller result before multiplying it by `3`. This trace counts **activations**, including the base case, rather than counting the numeric answer.

**Why this example?** Three named cards give a result small enough to check by hand while showing that result size and work differ. **How to solve it:** list the call parameters from `n` down to `0`, count that list, and count one multiplication for every positive parameter.

<span id="part-2-bound"></span>

### 2. Derive the Linear Bound

Let `C(n)` be the number of factorial calls. There is one base-case call when `n = 0`; otherwise the current call adds one to all calls made for `n - 1`:

```text
C(0) = 1
C(n) = 1 + C(n - 1), for n > 0
     = n + 1.
```

Each call does `O(1)` local work in the book's primitive-operation model. Therefore `n + 1` calls take **`O(n)` time**. The exact call count is `n + 1`; big-Oh describes its growth as `n` increases. This does not say that the value `n!` grows linearly—it grows much faster. In real Python, multiplying increasingly large integers adds cost, so `O(n)` is the book's simplified operation count rather than a wall-clock guarantee for arbitrarily large `n`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Drawing an English Ruler

<span id="part-3-lines"></span>

### 1. Count the Printed Interior Ticks

The book analyzes **one call to `draw_interval(c)`**, where `c` is the middle tick's length. It asks how many **interior lines** that call prints. In our teaching scale, the interval is one second of winner-relative race gap. Álex Márquez's real `+0.657 s` lies between the `0.5 s` and `0.75 s` marks; the marks themselves are a hypothetical scale, not measured race data.

At level `0`, `draw_interval` prints nothing. At a positive level, it draws a left pattern of level `c - 1`, prints one center tick, then draws a right pattern of level `c - 1`. If `L(c)` counts printed interior lines:

```text
L(0) = 0
L(c) = L(c - 1) + 1 + L(c - 1)
     = 2L(c - 1) + 1, for c > 0.
```

| Interior level `c` | Interior positions in one second | Printed lines `L(c)` |
| ---: | :--- | ---: |
| 0 | None | 0 |
| 1 | `1/2 s` | 1 |
| 2 | `1/4, 1/2, 3/4 s` | 3 |
| 3 | `1/8, 2/8, ..., 7/8 s` | 7 |

**Why this example?** Unlike factorial's one-call chain, each positive interval makes **two** smaller calls. The resulting branching makes output grow quickly. **How to solve it:** count what the left child prints, add the one center line, then add what the right child prints; stop with zero lines at level `0`.

<span id="part-3-proof"></span>

### 2. Prove the Exact Formula

The first few counts suggest the book's **Proposition 4.1**: `L(c) = 2^c - 1` for `c ≥ 0`. We can prove it by induction.

1. **Base:** `L(0) = 0 = 2^0 - 1`.
2. **Assume:** At level `c - 1`, the count is `2^(c - 1) - 1`.
3. **Apply the recursive rule:**

   ```text
   L(c) = 2L(c - 1) + 1
        = 2(2^(c - 1) - 1) + 1
        = 2^c - 1.
   ```

This proves the formula for every nonnegative level. In the earlier Section 4.1 code, `draw_ruler(1, 3)` uses major ticks of length `3`, so it calls `draw_interval(2)`: **three interior lines plus two major endpoint lines**, or five lines total. Raising the major length to `4` calls `draw_interval(3)`: **seven** interior lines plus two endpoints. Proposition 4.1 counts only the interior lines, not the endpoints.

<span id="part-3-calls"></span>

### 3. Separate Printed Lines from Function Calls

Zero-level calls print nothing, but they are still function calls. If `A(c)` counts **all** `draw_interval` activations, then `A(0) = 1` and `A(c) = 1 + 2A(c - 1)`. Solving that recurrence gives `A(c) = 2^(c + 1) - 1`. At level `3`, the algorithm prints **7 lines** but makes **15 calls**, including 8 base-case calls. This call count is an extra measurement; Proposition 4.1 is specifically about lines of output.

Under the book's operation-count model, the call count and printed output both grow as **`O(2^c)`** for one interval. The function needs time to produce every line, so its running time cannot grow more slowly than its output count.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Performing a Binary Search

<span id="part-4-trace"></span>

### 1. Trace Searches in Sorted Race Gaps

The six gaps in the opening table are **sorted and indexable**. Imagine searching them for the official gap of Fabio Quartararo, `23,229 ms`. Binary search maintains inclusive indices `low` and `high`. The current number of candidates is `high - low + 1` when `low ≤ high`; an empty range has no candidates.

| Call | Candidate indices | Candidate count | Midpoint entry | Next step |
| ---: | :--- | ---: | :--- | :--- |
| 1 | `0..5` | 6 | Pedro: `2,326 ms` at index 2 | Keep `3..5`; Fabio's gap is larger. |
| 2 | `3..5` | 3 | Raúl: `18,252 ms` at index 4 | Keep `5..5`; Fabio's gap is larger. |
| 3 | `5..5` | 1 | Fabio: `23,229 ms` at index 5 | Match; stop. |

Marc's `0 ms` gap is found in two midpoint checks: index `2` is too large, then index `0` matches. For a **hypothetical** target of `20,000 ms`, the first three midpoint comparisons examine Pedro, Raúl, and Fabio. The next call receives the empty range `5..4` and returns "absent." That is **three comparisons but four activations**; the last activation makes no comparison. The six-row selection need not include every rider in the race, so an absent result means absent **from this list**.

**Why this example?** Marc and Fabio anchor a small, genuinely sorted numeric list, and a missing target exposes the empty-range base case. **How to solve it:** count the candidates, inspect the midpoint, discard the half that cannot contain the target, and repeat. Check sorted order before using this argument.

<span id="part-4-bound"></span>

### 2. Derive the Logarithmic Bound

After one unsuccessful midpoint comparison, at most half the candidates remain. Starting with `n` rows, after `j` such reductions the remaining count is at most about `n / 2^j`. To get below one candidate, choose `j` so that `n / 2^j < 1`, or equivalently `j > log₂ n`.

```text
n → at most n/2 → at most n/4 → ... → 0 or a match
```

Each nonempty call performs `O(1)` local work on an indexable sequence. Hence the book's **Proposition 4.2** concludes that binary search takes **`O(log n)` time**. An unsuccessful search can add one final empty-range activation, which does not change the bound. This analysis measures the **number of stored rider rows**, not the size of a gap in milliseconds.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Computing Disk Space Usage

<span id="part-5-tree"></span>

### 1. Count Entries and Child Visits

The book's `disk_usage(path)` asks for a path's **cumulative bytes**: its immediate reported size plus every child's cumulative size. For time analysis, let `n` be the number of file-system entries under the starting path, **including that starting path**. In an ordinary finite folder tree, each child has one parent, so the recursive function visits each entry once.

Here is the **fictional practice folder tree** from our Section 4.1 explanation. The team and rider names are real Misano entries; the files and byte sizes are invented. The fabricated total is `4 + (4 + 12) + (4 + 20) = 44 B`.

```text
Misano notes/ (own size: 4 B)
├── Ducati Lenovo Team/ (own size: 4 B)
│   └── Marc Márquez.txt (own size: 12 B)
└── Monster Energy Yamaha MotoGP/ (own size: 4 B)
    └── Fabio Quartararo.txt (own size: 20 B)
```

| What to count | This five-entry tree | A tree with `n` entries |
| :--- | ---: | ---: |
| Recursive activations | 5 | `n` |
| Parent-to-child loop iterations | 4 | `n - 1` |
| Returned byte total | 44 B, invented | Depends on the file sizes |

The 44-byte answer is **not** the five-call work count. If we change a file's size but keep the same five entries, the returned byte total changes while the number of calls stays five.

**Why this example?** Marc's and Fabio's two note branches make it easy to see every parent-child link exactly once. **How to solve the counting problem:** mark each entry when its function starts, then mark each child edge when the parent's loop reaches it. Do not infer work from the final byte total.

<span id="part-5-bound"></span>

### 2. Add Loop Work Across the Whole Tree

A directory call is **not always `O(1)`**: it loops over its immediate children. A directory with many files can have many iterations. Treating every one of `n` calls as if it had `n` children produces an `O(n²)` upper bound, but that is too loose: all directories cannot each own the same child entries.

Instead, sum loop iterations across **all** calls. Every entry except the root appears once in its parent's child loop. Therefore the total number of loop iterations is exactly `n - 1`. There are exactly `n` activations, each with `O(1)` other local work in the book's model:

```text
total work = O(n) local work across n entries
           + O(n - 1) child-loop work
           = O(n).
```

A five-entry tree shaped like one folder with four children has four loop iterations at the root. A five-entry chain has one loop iteration at each of four folders. Both have **four iterations in total**. This aggregate way of charging work is the **amortization** idea mentioned by the book; the structure being traversed is a tree.

The `O(n)` proof describes the book's traversal **without optional sorting**. The Section 4.1 teaching code used `sorted(os.listdir(path))` to make its printed order predictable. Sorting adds work; in a directory with `n - 1` children, that step can cost `O(n log n)`. It does not change the cumulative byte result, but it must be counted if analyzing that exact sorted implementation. Actual file-system I/O costs also vary beyond the primitive-operation model.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Complete Runnable Work-Counting Program

<span id="part-6-program"></span>

### 1. Program

This small program measures the four examples. It uses real race gaps for binary search and clearly fictional data for display-card orders, ruler marks, and note-file bytes. The folder structure is kept **in memory** so the invented byte sizes give reproducible output; the visit count follows the same tree traversal as `disk_usage`.

```python
def factorial_with_calls(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    calls = 0

    def factorial(k):
        nonlocal calls
        calls += 1
        if k == 0:
            return 1
        return k * factorial(k - 1)

    return factorial(n), calls


def ruler_counts(level):
    calls = 0
    lines = 0

    def draw_interval(k):
        nonlocal calls, lines
        calls += 1
        if k <= 0:
            return
        draw_interval(k - 1)
        lines += 1                  # one center line would be printed
        draw_interval(k - 1)

    draw_interval(level)
    return lines, calls


def find_gap(rows, target_ms):
    calls = 0
    comparisons = 0

    def search(low, high):
        nonlocal calls, comparisons
        calls += 1
        if low > high:
            return None
        mid = (low + high) // 2
        gap_ms, rider = rows[mid]
        comparisons += 1
        if target_ms == gap_ms:
            return rider
        if target_ms < gap_ms:
            return search(low, mid - 1)
        return search(mid + 1, high)

    found = search(0, len(rows) - 1)
    return found, calls, comparisons


def usage_counts(root):
    calls = 0
    child_visits = 0

    def visit(entry):
        nonlocal calls, child_visits
        calls += 1
        total = entry["own_bytes"]
        for child in entry.get("children", []):
            child_visits += 1
            total += visit(child)
        return total

    total = visit(root)
    return total, calls, child_visits


rider_cards = ["Marc Márquez", "Pedro Acosta", "Fabio Quartararo"]
gaps_ms = [
    (0, "Marc Márquez"),
    (657, "Álex Márquez"),
    (2326, "Pedro Acosta"),
    (14021, "Jorge Martín"),
    (18252, "Raúl Fernández"),
    (23229, "Fabio Quartararo"),
]
notes = {
    "name": "Misano notes",
    "own_bytes": 4,
    "children": [
        {
            "name": "Ducati Lenovo Team", "own_bytes": 4,
            "children": [{"name": "Marc Márquez.txt", "own_bytes": 12}],
        },
        {
            "name": "Monster Energy Yamaha MotoGP", "own_bytes": 4,
            "children": [{"name": "Fabio Quartararo.txt", "own_bytes": 20}],
        },
    ],
}

orders, factorial_calls = factorial_with_calls(len(rider_cards))
print("card orders:", orders, "| factorial calls:", factorial_calls)

lines, ruler_calls = ruler_counts(3)
print("ruler interior lines:", lines, "| interval calls:", ruler_calls)

for target in (0, 23229, 20000):
    rider, calls, comparisons = find_gap(gaps_ms, target)
    print("gap", target, "ms:", rider, "| calls:", calls,
          "| comparisons:", comparisons)

byte_total, entry_calls, child_visits = usage_counts(notes)
print("invented note bytes:", byte_total, "| entry calls:", entry_calls,
      "| child visits:", child_visits)
```

<span id="part-6-results"></span>

### 2. Interpret the Output

```text
card orders: 6 | factorial calls: 4
ruler interior lines: 7 | interval calls: 15
gap 0 ms: Marc Márquez | calls: 2 | comparisons: 2
gap 23229 ms: Fabio Quartararo | calls: 3 | comparisons: 3
gap 20000 ms: None | calls: 4 | comparisons: 3
invented note bytes: 44 | entry calls: 5 | child visits: 4
```

The program makes each bound concrete: `3 + 1 = 4` factorial activations, `2^3 - 1 = 7` ruler lines, and `2^(3 + 1) - 1 = 15` ruler activations. Fabio's six-row binary search needs three midpoint checks; the missing value adds an empty-range call. The five-entry note tree has exactly four parent-to-child visits. These measurements are examples of the general arguments above, not proofs by themselves.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Work Through Four Small Cases

| Question | Work-counting steps | Answer |
| :--- | :--- | :--- |
| Add a fourth **hypothetical rider display card**. What happens to factorial? | The call chain becomes `4, 3, 2, 1, 0`. | `4! = 24` orders, but only **5 calls**. |
| Set ruler interior level to `0`. What is counted? | The one base-case call prints nothing. | **0 lines**, **1 call**; endpoint ticks belong to the wrapper. |
| Search an empty gap list. How much work? | Initial indices are `0..-1`, so the base case fires before indexing. | **1 call**, **0 comparisons**. |
| Change Fabio's invented note file from `20 B` to `200 B`. What changes? | The folder tree still has five entries and four parent-child links. | Total becomes **224 B**; calls remain **5**. |

For the last row, `4 + (4 + 12) + (4 + 200) = 224 B`. The key habit is to count **the structure visited** and **the local work in each visit**, then keep that count separate from the value returned.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 4.2 idea | Counting rule | Bound or exact count | Misano example |
| :--- | :--- | :--- | :--- |
| Factorial | One call for each integer from `n` down to `0`. | `n + 1` calls; `O(n)` time in the book's model. | Three rider cards: six orders, four calls. |
| Ruler interval | Two smaller intervals plus one printed middle line. | `2^c - 1` interior lines; `O(2^c)` work for one interval. | Level 3: seven marks on a one-second teaching scale. |
| Binary search | Keep at most half of a sorted index range. | `O(log n)` time. | Fabio's `23,229 ms` gap found in three checks among six rows. |
| Disk usage | One call per entry; one child-loop iteration per nonroot entry. | `n` calls, `n - 1` child visits; `O(n)` time without sorting. | Five invented note entries: four child visits. |

**The answer is not the work count.** Identify the growing input, account for work in each activation, and sum across the call chain or tree. For a loop inside recursion, sum its iterations across all calls instead of assuming every call incurs the worst possible loop length.

[🔝 Back to Top](#top)
