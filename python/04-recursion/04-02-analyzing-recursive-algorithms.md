<span id="top"></span>

# 4.2 Analyzing Recursive Algorithms — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.2, printed pages 161–164 (the supplied PDF).  
> **Topic:** 4.2 Analyzing Recursive Algorithms; Computing Factorials; Drawing an English Ruler; Performing a Binary Search; Computing Disk Space Usage.  
> **Domain Focus:** The rectangle-card workshop from Section 4.1; counts of recursive calls, ruler ticks, searched areas, and nodes in a nested card tray.  
> **User Prompt:** Reexplain [`Section 4.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Count Work in the Card Workshop](#background)
   - [1. Reuse the same geometry activity](#background-cards)
   - [2. Separate the answer from the work](#background-work)
2. [Part 1: 4.2 Analyzing Recursive Algorithms](#part-1)
   - [1. Count work across all calls](#part-1-count)
   - [2. Match a size measure to each problem](#part-1-size)
3. [Part 2: Computing Factorials](#part-2)
   - [1. Count the calls for card arrangements](#part-2-calls)
   - [2. Derive the linear bound](#part-2-bound)
4. [Part 3: Drawing an English Ruler](#part-3)
   - [1. Count ticks in one board interval](#part-3-recurrence)
   - [2. Prove the exact formula](#part-3-proof)
   - [3. Distinguish the earlier list-building adaptation](#part-3-adaptation)
5. [Part 4: Performing a Binary Search](#part-4)
   - [1. Track the candidate range](#part-4-range)
   - [2. Derive the logarithmic bound](#part-4-bound)
6. [Part 5: Computing Disk Space Usage](#part-5)
   - [1. Count nodes and parent-child visits](#part-5-tree)
   - [2. Explain the linear bound](#part-5-bound)
7. [Part 6: One Connected Work-Counting Program](#part-6)
   - [1. The complete program](#part-6-program)
   - [2. Compare measurements with formulas](#part-6-results)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: Count Work in the Card Workshop

<span id="background-cards"></span>

### 1. Reuse the same geometry activity

The Section 4.1 study guide used three distinct rectangular cards and four recursive questions. Keep the same measurements here:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The sorted area catalog is `[6, 8, 16]` cm². The cards also sit in a nested tray: `A` in the outer tray, and `B` and `C` in an inner tray. Their total physical card area is `6 + (8 + 16) = 30 cm²`. The first centimetre of the display board has recursively placed ruler marks.

Section 4.2 asks a **different** question about those same algorithms: how much work is required as the input grows? A returned number such as `3! = 6` or `30 cm²` describes the geometry task; it is not a count of operations.

<span id="background-work"></span>

### 2. Separate the answer from the work

For each recursive call, identify the work done **in that call** and the smaller calls it makes. Add the work over all calls. The book uses this approach to obtain a running-time bound; for the ruler it first proves an **exact number of printed lines**.

| Quantity | Question | Three-card example |
| :--- | :--- | :--- |
| **Answer** | What does the algorithm calculate? | `3! = 6` possible card orders. |
| **Work** | How many calls, comparisons, prints, or child visits occur? | Factorial makes four calls for `n = 3`. |
| **Maximum active depth** | How many calls are simultaneously waiting? | The factorial calls for `3, 2, 1, 0` can all be active. |

The first two quantities are Section 4.2's focus. Maximum active depth is an additional observation in our study program; the book treats recursive stack-space analysis later in the chapter. When we say that each call takes `O(1)` local work, we use the book's simple operation-count model. Actual Python costs can also depend on integer size, printing, and filesystem behavior.

> **Mental model:** A recursive result can grow very quickly while the number of calls grows slowly, or a small result can require many calls. Count the work the code performs, not the magnitude of its answer.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 4.2 Analyzing Recursive Algorithms

<span id="part-1-count"></span>

### 1. Count work across all calls

Each call has an **activation**: its parameter values, local work, and any smaller calls it starts. A useful accounting rule is:

```text
total work = local work in this call + work in its recursive calls
```

For one call that makes another call, the work forms a **chain**. For a call that makes two recursive calls, it forms a **branching tree**. For a folder or tray, each child is visited from its parent. We can count the nodes in these call structures instead of guessing from the final answer.

<span id="part-1-size"></span>

### 2. Match a size measure to each problem

The letter `n` does not have one universal meaning. We will use a different input measure when the problem changes:

| Algorithm | Input measure | What decreases or gets visited |
| :--- | :--- | :--- |
| Factorial | `n` distinct cards to order. | `n` falls by one per call. |
| Ruler interval | Tick level `c`. | Each of two child calls uses `c − 1`. |
| Binary search | `n` sorted candidate areas. | The remaining range is at most about half as large. |
| Disk usage | `n` file-system entries. | Each child path is visited once. |

The card tray is our geometry analogy for the file-system tree. Its nodes carry **cm²** areas, while real files and directories carry **byte** sizes. The traversal count depends on the tree shape, not on those numeric units.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Computing Factorials

<span id="part-2-calls"></span>

### 1. Count the calls for card arrangements

For `n` distinct cards, the number of left-to-right orders is `n!`. The recursive factorial rule is `0! = 1` and `n! = n × (n − 1)!` when `n > 0`. Each positive call makes **one** call with a value one smaller. The `n = 0` call returns immediately.

```text
factorial(3) → factorial(2) → factorial(1) → factorial(0)
```

| Cards `n` | Possible orders `n!` | Total function calls | Multiplications |
| --------: | -------------------: | -------------------: | --------------: |
| 0 | 1 | 1 | 0 |
| 1 | 1 | 2 | 1 |
| 2 | 2 | 3 | 2 |
| 3 | 6 | 4 | 3 |

The `3! = 6` answer does **not** mean six recursive calls. It takes four calls and three multiplications under this model.

<span id="part-2-bound"></span>

### 2. Derive the linear bound

Let `C(n)` count factorial invocations. The direct base call gives `C(0) = 1`, and each positive call adds one to the count for `n − 1`:

```text
C(n) = 1 + C(n − 1) = n + 1.
```

Each activation performs a constant amount of local work under the book's operation-count model. Thus factorial takes **`O(n)` time** in that model. The call count is exactly `n + 1`, so it is also `Θ(n)` as a count of activations. The four active calls in the `n = 3` trace give maximum depth four; that depth is a related observation, separate from the section's time proof.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Drawing an English Ruler

<span id="part-3-recurrence"></span>

### 1. Count ticks in one board interval

The book's `draw_interval(c)` draws the shorter left pattern, one center line of length `c`, and the shorter right pattern. At `c = 0`, it prints no line. On our display board, take the interval from `0` to `1 cm`. Its major endpoint ticks are handled outside `draw_interval`; only the **interior** ticks belong in this count.

Let `L(c)` be the number of interior lines printed by one `draw_interval(c)` call:

```text
L(0) = 0
L(c) = L(c − 1) + 1 + L(c − 1) = 2L(c − 1) + 1, for c > 0.
```

| Interior level `c` | Interior positions on the 1 cm edge | Lines `L(c)` |
| -----------------: | :--- | -----------: |
| 0 | None. | 0 |
| 1 | `1/2 cm`. | 1 |
| 2 | `1/4`, `1/2`, `3/4 cm`. | 3 |
| 3 | `1/8`, `2/8`, ..., `7/8 cm`. | 7 |

This is the exact output-line count in **Proposition 4.1**. It does not include the two major endpoint lines. The book uses printed lines as a natural efficiency benchmark because each nonzero interval call prints one line.

<span id="part-3-proof"></span>

### 2. Prove the exact formula

The pattern is `L(c) = 2^c − 1`. Check the base case: `L(0) = 0 = 2⁰ − 1`. For the next level, assume the formula holds at `c − 1`. Then:

```text
L(c) = 2L(c − 1) + 1
     = 2(2^(c − 1) − 1) + 1
     = 2^c − 1.
```

This is **induction**: the base case is true, and the recursive rule carries the formula from one level to the next. At level three, `2³ − 1 = 7` interior ticks. Equivalently, each extra level doubles the prior ticks and adds one new center tick.

If we additionally count **every invocation**, including base calls that print nothing, the count obeys `C(0) = 1` and `C(c) = 2C(c − 1) + 1`, giving `C(c) = 2^(c + 1) − 1`. Thus level three has 15 invocations but only seven printed interior lines. This call count is an added study measure; Proposition 4.1 is about the lines.

<span id="part-3-adaptation"></span>

### 3. Distinguish the earlier list-building adaptation

The Section 4.1 geometry program returned a list of tick positions by concatenating the left result, one middle-tick item, and the right result with `+`. Python copies list elements during `+`. Across level `c`, those copies add **`Θ(c · 2^c)` list-copy work**: roughly `2^c` copied elements at each of `c` levels. The book's interval routine prints its ticks directly; it does not build lists this way. Both versions produce `2^c − 1` interior ticks, but their implementation costs differ.

In the complete study program below, `marks.append(...)` records each tick once. It avoids repeated list concatenation while preserving left-to-right order.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Performing a Binary Search

<span id="part-4-range"></span>

### 1. Track the candidate range

Binary search needs a **sorted, indexable** sequence. In our sorted area catalog `[6, 8, 16]` cm², searching for `16 cm²` checks the middle value `8`, then the one remaining candidate `16`. Searching for `7 cm²` checks `8`, then `6`, then makes a final call with an empty range and returns `False`.

| Target | Candidate counts as calls proceed | Comparisons with stored areas | Result |
| :--- | :--- | ---: | :--- |
| `16 cm²` | `3 → 1` | 2 | Found. |
| `7 cm²` | `3 → 1 → 0` | 2 | Absent. |

The book's recursive search checks the middle index `(low + high) // 2`, then keeps only a left or right subrange. A match returns `True`; `low > high` means no candidates remain and returns `False`. The final empty-range call in a miss does no element comparison.

<span id="part-4-bound"></span>

### 2. Derive the logarithmic bound

Start with `n` candidates. After `j` halvings, at most about `n / 2^j` candidates remain. Once this quantity falls below one, no candidate is left. Solving `n / 2^j < 1` gives `j > log₂ n`, so only **`O(log n)`** narrowing steps are possible. Each step does constant work when indexing a list and comparing one element are treated as constant-time operations.

```text
n candidates → at most n/2 → at most n/4 → ... → 0 or a match
```

For a larger card catalog, doubling the number of sorted entries adds at most about **one** extra halving step. The `3 → 1 → 0` trace is small, but it follows the same rule. An unsuccessful search includes one final empty-range invocation; that detail does not change the logarithmic bound.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Computing Disk Space Usage

<span id="part-5-tree"></span>

### 1. Count nodes and parent-child visits

The book's `disk_usage(path)` visits a file or directory, obtains its immediate size, and recursively visits every direct child if it is a directory. Its answer is the path's cumulative disk usage in **bytes**. For analysis, let `n` be the number of file-system entries under the starting path, including that path.

Our card-area tree has the same parent-child structure:

```text
display tray
├── card A: 6 cm²
└── inner tray
    ├── card B: 8 cm²
    └── card C: 16 cm²
```

| Tree fact | Card-tray count | General tree with `n` nodes |
| :--- | ---: | ---: |
| Total nodes and recursive invocations | 5 | `n` |
| Parent-to-child visits in all loops | 4 | `n − 1` |
| Returned quantity | 30 cm² | Depends on node values. |

The tray's returned **area** is only an analogy. In the book, directory sizes also contribute their own immediate **byte** size. Our trays have zero card area, while each physical card leaf contributes its area.

<span id="part-5-bound"></span>

### 2. Explain the linear bound

Each node is reached **once** from its parent, except the root, which starts the calculation. Consequently there are exactly `n` invocations and `n − 1` parent-to-child loop visits in a tree. If the immediate processing at each node costs constant time apart from iterating through its children, the total is **`O(n)`**.

It would be too loose to count `n` loop iterations for **every** directory and conclude `O(n²)`. The child lists are not each the whole tree: summed over all directories, they contain only the `n − 1` parent-child links. The file-system total may be a large number of bytes, but its numerical size does not determine how many tree nodes the algorithm visits.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: One Connected Work-Counting Program

<span id="part-6-program"></span>

### 1. The complete program

This runnable program records each recursive algorithm's invocations and maximum active depth. Its ruler routine **appends** a mark in place instead of concatenating lists. Its tray function measures card area, matching the file-system algorithm's tree traversal without pretending that cm² are bytes. The counters exclude the small monitoring helper itself.

```python
def new_stats():
    return {"calls": 0, "max_depth": 0, "child_visits": 0}


def enter(stats, depth):
    stats["calls"] += 1
    stats["max_depth"] = max(stats["max_depth"], depth)


def count_orders(n, stats, depth=1):
    if n < 0:
        raise ValueError("the number of cards cannot be negative")
    enter(stats, depth)
    if n == 0:
        return 1
    return n * count_orders(n - 1, stats, depth + 1)


def mark_interval(left, right, level, marks, stats, depth=1):
    enter(stats, depth)
    if level <= 0:
        return
    middle = (left + right) / 2
    mark_interval(left, middle, level - 1, marks, stats, depth + 1)
    marks.append((middle, level))
    mark_interval(middle, right, level - 1, marks, stats, depth + 1)


def contains_area(areas, target, low, high, stats, depth=1):
    enter(stats, depth)
    if low > high:
        return False
    middle = (low + high) // 2
    if areas[middle] == target:
        return True
    if target < areas[middle]:
        return contains_area(areas, target, low, middle - 1, stats, depth + 1)
    return contains_area(areas, target, middle + 1, high, stats, depth + 1)


def total_card_area(node, stats, depth=1):
    enter(stats, depth)
    total = node.get("area", 0)
    for child in node.get("children", []):
        stats["child_visits"] += 1
        total += total_card_area(child, stats, depth + 1)
    return total


cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
areas = {label: width * height for label, (width, height) in cards.items()}
sorted_areas = sorted(areas.values())
tray = {
    "name": "display",
    "children": [
        {"name": "A", "area": areas["A"]},
        {
            "name": "inner",
            "children": [
                {"name": "B", "area": areas["B"]},
                {"name": "C", "area": areas["C"]},
            ],
        },
    ],
}

order_stats = new_stats()
orders = count_orders(len(cards), order_stats)
print("orders:", orders, "| calls:", order_stats["calls"], "| depth:", order_stats["max_depth"])

ruler_stats = new_stats()
marks = []
mark_interval(0.0, 1.0, 3, marks, ruler_stats)
print("ruler marks:", len(marks), "| calls:", ruler_stats["calls"], "| depth:", ruler_stats["max_depth"])
print("mark positions:", [position for position, _ in marks])

for target in (16, 7):
    search_stats = new_stats()
    found = contains_area(sorted_areas, target, 0, len(sorted_areas) - 1, search_stats)
    print("search {}:".format(target), found, "| calls:", search_stats["calls"], "| depth:", search_stats["max_depth"])

tray_stats = new_stats()
area_total = total_card_area(tray, tray_stats)
print("tray area:", area_total, "cm^2 | calls:", tray_stats["calls"],
      "| child visits:", tray_stats["child_visits"], "| depth:", tray_stats["max_depth"])
```

<span id="part-6-results"></span>

### 2. Compare measurements with formulas

```text
orders: 6 | calls: 4 | depth: 4
ruler marks: 7 | calls: 15 | depth: 4
mark positions: [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875]
search 16: True | calls: 2 | depth: 2
search 7: False | calls: 3 | depth: 3
tray area: 30 cm^2 | calls: 5 | child visits: 4 | depth: 3
```

The observations match `n + 1 = 4` factorial calls for `n = 3`, `2³ − 1 = 7` ruler marks and `2⁴ − 1 = 15` ruler invocations for level `3`, and `n − 1 = 4` child visits for a five-node tray. Binary search needs only two area comparisons for either target; the miss has a third call to confirm the range is empty. Maximum depth describes these particular runs, while the section's bounds come from the general argument for any valid input size.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does a larger factorial answer need that many calls?</strong></summary>

**Scenario:** Add a distinct fourth card `D` to the display row.

**Check:** The arrangement count becomes `4! = 24`, but factorial makes calls for `4, 3, 2, 1, 0`: only **five** invocations. In general the answer is `n!`, while this recursive algorithm makes `n + 1` calls and `n` multiplications under the book's model.

**Lesson:** The numerical answer and the amount of work have different growth patterns.

</details>

<details>
<summary><strong>Case Study 2: What does ruler level zero contribute?</strong></summary>

**Scenario:** The board interval still has endpoint ticks, but `draw_interval(0)` is asked for interior marks.

**Check:** It makes one base-case invocation and prints **zero** interior lines. At level `3`, it prints seven lines but makes 15 invocations when zero-level calls are counted. The endpoint ticks belong to the surrounding ruler routine, not to `draw_interval`.

**Lesson:** Define exactly what is being counted before comparing formulas.

</details>

<details>
<summary><strong>Case Study 3: Why is a missing area still quick to check?</strong></summary>

**Scenario:** Search sorted card areas `[6, 8, 16]` cm² for `7 cm²`.

**Check:** Compare with `8`, then `6`, then enter an empty range. There are two comparisons and three invocations. A larger sorted catalog still loses about half its candidates at each comparison.

**Lesson:** A failed binary search has an extra empty-range base call, yet remains `O(log n)`.

</details>

<details>
<summary><strong>Case Study 4: Does tray shape change the number of visits?</strong></summary>

**Scenario:** Rearrange the same five nodes—one outer tray, one inner tray, and cards `A`, `B`, `C`—into a different valid parent-child shape.

**Check:** The traversal still makes five node calls and four child visits, because every nonroot node has exactly one parent. The maximum active depth can change: the illustrated tree reaches depth three, while a five-node chain reaches depth five.

**Lesson:** The source's `O(n)` visit count depends on the number of nodes; depth is a separate measurement.

</details>

<details>
<summary><strong>Case Study 5: Does a larger area total require more traversal?</strong></summary>

**Scenario:** Make card `C` twice as wide, so its area changes from `16` to `32 cm²` without changing the tray tree.

**Check:** The tray total changes from `30` to `6 + 8 + 32 = 46 cm²`. The traversal still visits five nodes and four parent-child links.

**Lesson:** Changing stored values changes the returned total, while the tree's visit count stays the same.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 4.2 idea | Plain-language meaning | Rectangle-card reminder |
| :--- | :--- | :--- |
| **Work per activation** | Add local work over every recursive call. | Four factorial invocations compute `3! = 6`. |
| **Factorial** | One smaller call per positive `n` gives `n + 1` calls and `O(n)` time. | Three cards have six orders, found with four calls. |
| **English ruler** | Two smaller intervals plus one center line give exactly `2^c − 1` lines. | Level three puts seven interior marks in 1 cm. |
| **Binary search** | Keep at most about half the sorted candidates each step. | Searching `[6, 8, 16]` cm² takes logarithmic steps as the catalog grows. |
| **Disk usage** | Visit each tree entry once and each parent-child link once. | Five tray nodes take five calls and four child visits. |
| **Input measure** | Name what grows before stating a bound. | Cards `n`, ruler level `c`, catalog length `n`, and tree entries `n` are different measures. |

**Keep the source result and the study measurement distinct.** Proposition 4.1 counts the ruler's printed lines; the card-tray result is area in cm², whereas the source file-system result is disk size in bytes. Counting calls, prints, and child visits explains the section's efficiency claims.

[🔝 Back to Top](#top)
