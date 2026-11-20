<span id="top"></span>

# Recursion — Section 4.1: Illustrative Examples

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.1 (printed pages 150–160).  
> **Topic:** Factorial, drawing an English ruler, binary search, and file-system traversal.  
> **Domain focus:** The **MotoGP race at the 2026 San Marino and Rimini Riviera Grand Prix**, held at Misano on Sunday, 13 September 2026.  
> **Learning goal:** For each example, identify the smaller problem, the stopping condition, and how the answer is built; then trace a small Python example.  
> **User Prompt:** "Reexplain [Section 4.1] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Race, Four Recursive Questions](#background-intuition)
   - [1. The verified race data](#background-race)
   - [2. What every recursive solution needs](#background-recursion)
2. [Part 1: Section 4.1.1 — The Factorial Function](#part-1)
   - [1. Count possible orders of rider cards](#part-1-count)
   - [2. Trace the calls and the returns](#part-1-trace)
3. [Part 2: Section 4.1.2 — Drawing an English Ruler](#part-2)
   - [1. Split a one-second gap scale](#part-2-scale)
   - [2. Trace the left, middle, and right work](#part-2-trace)
4. [Part 3: Section 4.1.3 — Binary Search](#part-3)
   - [1. Search sorted race gaps](#part-3-search)
   - [2. Trace a match and a missing value](#part-3-trace)
5. [Part 4: Section 4.1.4 — File Systems](#part-4)
   - [1. Add the sizes in a folder tree](#part-4-tree)
   - [2. Translate the idea into Python's `os` calls](#part-4-code)
6. [Part 5: Work Through Four Small Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Race, Four Recursive Questions

<span id="background-race"></span>

### 1. The Verified Race Data

The real setting is the **Sunday MotoGP race at Misano on 13 September 2026**, not the Sprint or a practice session. Marc Márquez won; Fabio Quartararo finished tenth. The table below is a **selection of six finishers**, ordered by their gap behind Marc. A `+` gap measures the difference from the winner's finishing time, not a single-lap time. The placing, rider names, and full team names come from [MotoGP's race report](https://www.motogp.com/en/news/2026/09/13/marc-marquez-capitalises-on-bezzecchi-error-to-seize-title-race-lead/1089345); the exact gaps come from [Ducati's Misano GP classification](https://www.ducati.com/ww/en/racing/motogp/calendar/misano). [Yamaha's race report](https://www.yamaha-motogp.com/2026/newsletter/race/en/260913132359254/13-09-2026-quartararo-secures-top-10-finish-in-san-marino-gp) also confirms Fabio's P10 and `+23.229 s`.

| Race place | Rider | Team | Gap to winner | Gap in milliseconds |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Marc Márquez | Ducati Lenovo Team | 0.000 s | 0 |
| P2 | Álex Márquez | BK8 Gresini Racing MotoGP | +0.657 s | 657 |
| P3 | Pedro Acosta | Red Bull KTM Factory Racing | +2.326 s | 2,326 |
| P5 | Jorge Martín | Aprilia Racing | +14.021 s | 14,021 |
| P6 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | +18.252 s | 18,252 |
| P10 | Fabio Quartararo | Monster Energy Yamaha MotoGP | +23.229 s | 23,229 |

The conversions use `1 second = 1,000 milliseconds`; for example, Fabio's `23.229 s` is `23,229 ms`. We will use real results only where a race number matters. The card arrangement, printed ruler, and sample folder sizes below are **teaching examples**; they are not additional race results or official team files.

<span id="background-recursion"></span>

### 2. What Every Recursive Solution Needs

A **recursive function** solves a problem by calling itself on a smaller version of that problem. Before writing a call, answer three questions:

| Question | Meaning | Example from this section |
| :--- | :--- | :--- |
| **Base case** | What smallest input can be answered without another call? | Zero rider cards have one empty arrangement. |
| **Progress** | What gets smaller on every path? | Factorial changes `n` to `n - 1`. |
| **Combine** | What does the caller do with returned answers? | A folder adds each child's byte total to its own size. |

The four examples shrink different things: the number of unplaced cards, the length of a tick pattern, the range of possible search indices, and the remaining folder subtree. Python keeps a separate set of local values for each unfinished call. When a base case returns, the waiting calls can finish, often in reverse order.

**Why these four examples?** Together they show that recursion is a way to organize a solution, not a formula limited to factorials. **How to approach any of them:** name the smaller problem and base case first; only then write the recursive call and decide how its result is used.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 4.1.1 — The Factorial Function

<span id="part-1-count"></span>

### 1. Count Possible Orders of Rider Cards

Imagine three **distinct display cards** for Marc Márquez, Pedro Acosta, and Fabio Quartararo. We want to count ways to place the cards left to right on a desk. These are hypothetical card orders, **not possible revisions to the race classification**.

There are three choices for the first card. After choosing one, the remaining problem is exactly the same kind of question for **two** cards. That gives the rule

```text
ways to order n distinct cards = n × ways to order (n - 1) cards
ways to order 0 cards = 1
```

The second line says that an empty row has **one** arrangement: leave it empty. Mathematically, the count is the factorial `n!`, with `0! = 1` and `n! = n × (n - 1)!` for `n > 0`. For our three cards, `3! = 3 × 2 × 1 = 6`.

```python
def factorial(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    if n == 0:                 # base case
        return 1
    return n * factorial(n - 1)  # smaller problem, then combine


rider_cards = ["Marc Márquez", "Pedro Acosta", "Fabio Quartararo"]
print("Possible card orders:", factorial(len(rider_cards)))
```

```text
Possible card orders: 6
```

**Why this example?** Distinct rider cards make `n × (n - 1)!` tangible: choose the first card, then arrange those left. Marc and Fabio are real riders in the selected race, while the card-order question stays deliberately hypothetical. **How to solve it:** count the cards, use `1` for the empty case, and multiply `n` by the answer for `n - 1`. The negative-input check prevents a call such as `factorial(-1)` from moving farther away from zero forever.

<span id="part-1-trace"></span>

### 2. Trace the Calls and the Returns

For three cards, the calls go **down** until the base case:

```text
factorial(3) waits for 3 × factorial(2)
factorial(2) waits for 2 × factorial(1)
factorial(1) waits for 1 × factorial(0)
factorial(0) returns 1
```

Now the saved multiplications finish **back up**:

| Returning call | Calculation after its child returns | Returned value |
| :--- | :--- | ---: |
| `factorial(0)` | Base case | 1 |
| `factorial(1)` | `1 × 1` | 1 |
| `factorial(2)` | `2 × 1` | 2 |
| `factorial(3)` | `3 × 2` | 6 |

Each call has its own `n`. The `factorial(3)` call keeps its `3` while the smaller calls run; it does **not** start over when they return. This is the call-stack behavior illustrated by the book's factorial trace.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 4.1.2 — Drawing an English Ruler

<span id="part-2-scale"></span>

### 1. Split a One-Second Gap Scale

The book's English ruler has long ticks at whole inches, a shorter tick halfway between them, and still shorter ticks at quarters and eighths. For our race example, imagine printing a **one-second scale** from Marc's `0.000 s` winner gap to `1.000 s`. Álex Márquez's real `+0.657 s` lies between the half-second and three-quarter-second marks. The scale is a teaching drawing; its ticks do not claim to plot his exact gap.

The same pattern appears inside each half: draw the left half, draw the middle tick, then draw the right half. Only the tick length changes. Here the major ticks have length `3`; the interior midpoint tick has length `2`:

```python
def draw_line(length, label=""):
    print("-" * length + (" " + label if label else ""))


def draw_interval(length):
    if length <= 0:                 # no shorter ticks to draw
        return
    draw_interval(length - 1)      # left half
    draw_line(length)              # middle tick
    draw_interval(length - 1)      # right half


def draw_ruler(whole_seconds, major_length):
    draw_line(major_length, "0 s")
    for second in range(1, whole_seconds + 1):
        draw_interval(major_length - 1)
        draw_line(major_length, f"{second} s")


draw_ruler(1, 3)
```

```text
--- 0 s
-
--
-
--- 1 s
```

**Why this example?** The ruler has a self-similar shape: its left and right halves need the same instructions as the full interval. Factorial made **one** recursive call; `draw_interval` makes **two** smaller calls. **How to solve it:** draw a long starting tick, recursively draw the interior of each whole-second interval, then draw its long ending tick. The outer `for` loop repeats whole intervals; the recursive function handles the nested marks **within** one interval.

<span id="part-2-trace"></span>

### 2. Trace the Left, Middle, and Right Work

`draw_ruler(1, 3)` calls `draw_interval(2)` once. That call first draws the left `draw_interval(1)`, then a length-2 tick, then the right `draw_interval(1)`. Each length-1 call tries length `0` on both sides, but those calls immediately return without printing.

| Position on the one-second scale | Tick length | Reason |
| ---: | ---: | :--- |
| `0.00 s` | 3 | Start of the interval. |
| `0.25 s` | 1 | Middle of the left half. |
| `0.50 s` | 2 | Middle of the full interval. |
| `0.75 s` | 1 | Middle of the right half. |
| `1.00 s` | 3 | End of the interval. |

The printed dashes show **relative tick lengths**; a dash is not a unit of time. With a larger `major_length`, the same code adds finer subdivisions. The important stopping rule is `length == 0`, which prevents an endless sequence of shorter ticks.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 4.1.3 — Binary Search

<span id="part-3-search"></span>

### 1. Search Sorted Race Gaps

Suppose a timing notebook stores the six selected finishers from the opening table, **sorted by their gaps to Marc**. We are given Fabio's official gap, `23,229 ms`, and want to find the matching rider. Keeping times in whole milliseconds makes exact comparisons easy.

Binary search checks the middle item of a sorted, indexable list. If the target is larger, every item at or left of that middle is too small; if it is smaller, every item at or right of the middle is too large. The book's version returns `True` or `False`; this adaptation returns the rider name or `None` so we can see which entry matched.

```python
gaps = [
    (0, "Marc Márquez"),
    (657, "Álex Márquez"),
    (2326, "Pedro Acosta"),
    (14021, "Jorge Martín"),
    (18252, "Raúl Fernández"),
    (23229, "Fabio Quartararo"),
]


def rider_at_gap(rows, target_ms, low, high):
    if low > high:                         # no candidates remain
        return None

    mid = (low + high) // 2               # integer list index
    gap_ms, rider = rows[mid]
    if target_ms == gap_ms:
        return rider
    if target_ms < gap_ms:
        return rider_at_gap(rows, target_ms, low, mid - 1)
    return rider_at_gap(rows, target_ms, mid + 1, high)


print(rider_at_gap(gaps, 23229, 0, len(gaps) - 1))
print(rider_at_gap(gaps, 20000, 0, len(gaps) - 1))
```

```text
Fabio Quartararo
None
```

**Why this example?** Race gaps already have a useful numeric order, and Marc's zero gap and Fabio's `23,229 ms` anchor the ends of our small list. **How to solve it:** ensure the list is sorted by the value being searched, start with inclusive indices `0` and `len(gaps) - 1`, compare the target with the midpoint, and recurse into only the half that could still contain it. Removing `mid` with `mid - 1` or `mid + 1` guarantees the range shrinks.

<span id="part-3-trace"></span>

### 2. Trace a Match and a Missing Value

Searching for Fabio's `23,229 ms` uses these calls:

| Call | Candidate indices | Midpoint entry | Decision |
| ---: | :--- | :--- | :--- |
| 1 | `0..5` | `2 → Pedro, 2,326 ms` | Target is larger; keep `3..5`. |
| 2 | `3..5` | `4 → Raúl, 18,252 ms` | Target is larger; keep `5..5`. |
| 3 | `5..5` | `5 → Fabio, 23,229 ms` | Equal; return `Fabio Quartararo`. |

Now try a **hypothetical query** of `20,000 ms`; no rider in this six-row selection has that exact gap. The first two choices are the same. At index `5`, `20,000 < 23,229`, so the next range is `5..4`. Because `low > high`, the function returns `None` without indexing the list.

Sorted order is essential. If Fabio's row were placed first without sorting, the midpoint comparison could discard it even though it is present. A sequential scan can require `O(n)` checks for `n` entries; halving the candidates gives binary search `O(log n)` checks in the worst case. Our six-row match took three midpoint checks.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 4.1.4 — File Systems

<span id="part-4-tree"></span>

### 1. Add the Sizes in a Folder Tree

A directory can contain files and more directories. The book's question is: **How many bytes belong to a path, including all items beneath it?** For one path, add its **immediate size** to the totals returned by each child. A file is a leaf: it has no children to visit.

The following is an **invented folder tree for practice**. The names refer to the real Misano teams and riders, but the files and every byte size are imaginary. We assign each folder an immediate size of `4 B` solely to make the addition visible; actual folder sizes depend on the file system.

```text
Misano notes/ (own size: 4 B)
├── Ducati Lenovo Team/ (own size: 4 B)
│   └── Marc Márquez.txt (own size: 12 B)
└── Monster Energy Yamaha MotoGP/ (own size: 4 B)
    └── Fabio Quartararo.txt (own size: 20 B)
```

Start at the leaves and work upward:

| Path | Own size | Returned child totals | Cumulative total |
| :--- | ---: | :--- | ---: |
| `Marc Márquez.txt` | 12 B | None | 12 B |
| `Ducati Lenovo Team/` | 4 B | 12 B | 16 B |
| `Fabio Quartararo.txt` | 20 B | None | 20 B |
| `Monster Energy Yamaha MotoGP/` | 4 B | 20 B | 24 B |
| `Misano notes/` | 4 B | 16 B + 24 B | 44 B |

**Why this example?** A folder naturally contains smaller folder or file problems, so the recursive structure matches the data's structure. Marc and Fabio make the two branches easy to distinguish. **How to solve it:** get a path's own size, recursively compute every child's cumulative size if it is a folder, add those values, and return the sum. The final `44 B` belongs only to the invented tree above.

<span id="part-4-code"></span>

### 2. Translate the Idea into Python's `os` Calls

This book-style function works on a **real directory path**. It prints each cumulative total after visiting its children, so child lines appear before their parent line. `sorted` makes the visiting order predictable; it does not change the sum.

```python
import os


def disk_usage(path):
    total = os.path.getsize(path)             # this path's immediate size
    if os.path.isdir(path):                   # files have no children
        for name in sorted(os.listdir(path)):
            child_path = os.path.join(path, name)
            total += disk_usage(child_path)  # add the child's total
    print("{:>8} B  {}".format(total, path))
    return total


# Example after making a real folder:
# disk_usage("Misano notes")
```

| Operation | Purpose in the solution |
| :--- | :--- |
| `os.path.getsize(path)` | Read this file's or directory's own reported size. |
| `os.path.isdir(path)` | Decide whether to visit children. |
| `os.listdir(path)` | Get a directory's immediate child names. |
| `os.path.join(path, name)` | Make a valid child path. |

For a real folder, the returned number can differ from the sum of file contents because this algorithm also includes each directory's reported size. It assumes an ordinary finite directory tree that the program can read. If a path is missing or inaccessible, an `os` call raises an error; that is a file-access issue, not a different recursive rule.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Work Through Four Small Cases

| Question | First step | Smaller problem or stopping point | Answer |
| :--- | :--- | :--- | :--- |
| How many orders for just Marc's and Fabio's two display cards? | Choose either card first. | Arrange the one remaining card. | `2! = 2 × 1 = 2` orders. |
| What if the ruler's interior tick length is `0`? | Call `draw_interval(0)`. | Base case; there are no shorter marks. | Print nothing. |
| What if the gap list is empty? | Call `rider_at_gap([], 23229, 0, -1)`. | `low > high` is already true. | Return `None` without an index error. |
| What does an empty folder contribute? | Read its own reported size. | It has no children to visit. | Return its own size, which need not be zero. |

In each case, check **whether the base case is already true** before trying another recursive call. If it is not, verify that the next call moves closer to it. That check catches most accidental infinite recursions.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 4.1 example | Smaller input | Base case | Work done after or around smaller calls | Misano teaching example |
| :--- | :--- | :--- | :--- | :--- |
| Factorial | `n - 1` cards | `n == 0` returns `1` | Multiply by `n`. | Three rider display cards have six possible desk orders. |
| English ruler | Shorter left and right tick patterns | Length `0` draws nothing. | Print the middle tick between the two halves. | Subdivide a one-second winner-gap scale. |
| Binary search | One half of a sorted index range | Match found, or `low > high`. | Return the result from the chosen half. | Find Fabio's `23,229 ms` gap in six sorted rows. |
| File systems | Each child path | A file or empty directory has no child calls. | Add child totals to the path's own bytes. | Add fictional sizes in Marc's and Fabio's note folders. |

The key test for a recursive design is simple: **Does every path either stop now or make a smaller call that will eventually stop?** Once that is true, trace what each waiting caller does with the returned answer.

[🔝 Back to Top](#top)
