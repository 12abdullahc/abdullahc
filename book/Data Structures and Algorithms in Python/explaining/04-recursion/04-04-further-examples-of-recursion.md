<span id="top"></span>

# Recursion — Section 4.4: Further Examples of Recursion

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.4 (printed pages 169–176).  
> **Topic:** Linear, binary, and multiple recursion through sequence sums, reversal, powers, and a choice puzzle.  
> **Domain focus:** The **MotoGP race at the 2026 San Marino and Rimini Riviera Grand Prix**, held at Misano on Sunday, 13 September 2026.  
> **Learning goal:** Trace what each recursive call receives, solve each small example, and distinguish total work from maximum active stack depth.  
> **User Prompt:** "Reexplain [Section 4.4] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]"

---

## Table of Contents

1. [Background & Conceptual Intuition: One Race, Several Call Shapes](#background-intuition)
   - [1. The verified race values](#background-race)
   - [2. What the call-shape labels mean](#background-shapes)
2. [Part 1: Section 4.4.1 — Linear Recursion](#part-1)
   - [1. Sum a sequence one value at a time](#part-1-sum)
   - [2. Reverse a row of rider cards](#part-1-reverse)
   - [3. Compute a power by reducing the exponent by one](#part-1-power-slow)
   - [4. Compute the same power by repeated squaring](#part-1-power-fast)
3. [Part 2: Section 4.4.2 — Binary Recursion](#part-2)
   - [1. Divide the same sum into disjoint halves](#part-2-sum)
   - [2. Count calls and active depth separately](#part-2-cost)
4. [Part 3: Section 4.4.3 — Multiple Recursion](#part-3)
   - [1. Follow every child or choice](#part-3-choices)
   - [2. Solve a rider-card order puzzle](#part-3-puzzle)
   - [3. Restore the state and count candidates](#part-3-backtrack)
5. [Part 4: Complete Runnable Comparison](#part-4)
   - [1. Program](#part-4-program)
   - [2. Read the output](#part-4-results)
6. [Part 5: Work Through Five Small Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Race, Several Call Shapes

<span id="background-race"></span>

### 1. The Verified Race Values

As in the [Section 4.1](04-01-illustrative-examples.md), [Section 4.2](04-02-analyzing-recursive-algorithms.md), and [Section 4.3](04-03-recursion-run-amok.md) explanations, every rider below comes from **Sunday's Misano MotoGP race on 13 September 2026**. This is a selection of four finishers, not the full classification. [MotoGP's race report](https://www.motogp.com/en/news/2026/09/13/marc-marquez-capitalises-on-bezzecchi-error-to-seize-title-race-lead/1089345) identifies their places and teams; [Ducati's Grand Prix results](https://www.ducati.com/ww/en/racing/motogp/calendar/misano) give their gaps to winner Marc Márquez. [Yamaha's race report](https://www.yamaha-motogp.com/2026/newsletter/race/en/260913132359254/13-09-2026-quartararo-secures-top-10-finish-in-san-marino-gp) also confirms Fabio Quartararo's P10 and `+23.229 s`.

| Place | Rider | Team | Gap to winner | Value used in code |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Marc Márquez | Ducati Lenovo Team | 0.000 s | 0 ms |
| P2 | Álex Márquez | BK8 Gresini Racing MotoGP | +0.657 s | 657 ms |
| P3 | Pedro Acosta | Red Bull KTM Factory Racing | +2.326 s | 2,326 ms |
| P10 | Fabio Quartararo | Monster Energy Yamaha MotoGP | +23.229 s | 23,229 ms |

One second is 1,000 milliseconds, so `23.229 s` becomes the integer `23229` in Python. Our **notebook checksum** adds these four selected gap values: `0 + 657 + 2326 + 23229 = 26212 ms`. The sum is an arithmetic exercise for comparing algorithms; it is **not** a combined race gap or an official MotoGP statistic. The rider-card order puzzle and the fan-photo doubling rule later in this explanation are also invented teaching tasks. Their riders and gap labels remain real.

**Why these values?** Marc and Fabio make the endpoints easy to recognize, and four numbers are enough to see both a single chain and a two-branch sum tree. **How will we solve the examples?** Keep the race values fixed, change only the recursive method, and check the result by ordinary arithmetic.

<span id="background-shapes"></span>

### 2. What the Call-Shape Labels Mean

Section 4.4 groups algorithms by the **maximum number of recursive calls one invocation can start**:

| Shape | Calls made by one invocation | Call trace | Example in this section |
| :--- | ---: | :--- | :--- |
| **Linear recursion** | At most one | A chain | `linear_sum`, `reverse`, and either `power` algorithm. |
| **Binary recursion** | At most two | A branching tree | `binary_sum`, which processes both halves. |
| **Multiple recursion** | Three or more are possible | A wider tree | `PuzzleSolve`, which can try every unused card. |

This describes **call structure**, not how fast the algorithm runs. Binary search is **linear recursion**: its code has two possible branches, but one invocation follows only one of them. It runs in `O(log n)` time because each chosen call receives about half the candidates. By contrast, `binary_sum` actually visits **both** halves and takes `O(n)` time. Section 4.3's slow Fibonacci and uniqueness examples also branch, but they repeat overlapping subproblems; the halves in `binary_sum` do not overlap.

**Why start here?** It prevents a misleading shortcut: “binary” in an algorithm's name does not tell us how many calls execute. **How to classify a function:** look at one actual invocation and count the recursive calls it may make before it returns.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 4.4.1 — Linear Recursion

<span id="part-1-sum"></span>

### 1. Sum a Sequence One Value at a Time

Code Fragment 4.9 asks for the sum of the **first `n` values** of a sequence `S`. The smallest question is “What is the sum of zero values?” Its answer is `0`. For any larger `n`, first sum the first `n - 1` values, then add the one value at index `n - 1`:

```text
linear_sum(S, 0) = 0
linear_sum(S, n) = linear_sum(S, n - 1) + S[n - 1], when n > 0
```

```python
def linear_sum(values, n):
    if n == 0:
        return 0
    return linear_sum(values, n - 1) + values[n - 1]


gap_ms = [0, 657, 2326, 23229]
print(linear_sum(gap_ms, len(gap_ms)))
```

```text
26212
```

The call chain goes **down** with `n = 4 → 3 → 2 → 1 → 0`. The answers then come **back up**:

| Returning call | Calculation | Returned checksum |
| :--- | :--- | ---: |
| `linear_sum(S, 0)` | Base case. | 0 ms |
| `linear_sum(S, 1)` | `0 + S[0] = 0 + 0` | 0 ms |
| `linear_sum(S, 2)` | `0 + S[1] = 0 + 657` | 657 ms |
| `linear_sum(S, 3)` | `657 + S[2] = 657 + 2326` | 2,983 ms |
| `linear_sum(S, 4)` | `2983 + S[3] = 2983 + 23229` | 26,212 ms |

**Why this example?** The real gap values have different sizes and include a zero, so the base case and each added value are visible. **How to solve it:** write the base answer first, follow the decreasing `n` values to zero, then add one list element while each call returns. Use `S[n - 1]`, because the first `n` elements have indices `0` through `n - 1`.

For `n` inputs, there are **`n + 1` calls**, including the base call. Thus this four-value run has five calls and a maximum of five active calls. Constant work per call gives `O(n)` time and `O(n)` additional call-stack space. The input list itself is excluded from that space count.

<span id="part-1-reverse"></span>

### 2. Reverse a Row of Rider Cards

Code Fragment 4.10 reverses a **half-open range** `S[start:stop]`: `start` is included and `stop` is excluded. If the range has at least two elements, swap the two ends and recurse on the inside. An empty or one-element range is already reversed.

```python
def reverse(values, start, stop):
    if start < stop - 1:
        values[start], values[stop - 1] = values[stop - 1], values[start]
        reverse(values, start + 1, stop - 1)


cards = ["Marc Márquez", "Álex Márquez", "Pedro Acosta", "Fabio Quartararo"]
reverse(cards, 0, len(cards))
print(cards)
```

```text
['Fabio Quartararo', 'Pedro Acosta', 'Álex Márquez', 'Marc Márquez']
```

```text
start:stop = 0:4   swap Marc ↔ Fabio  → [Fabio, Álex, Pedro, Marc]
start:stop = 1:3   swap Álex ↔ Pedro → [Fabio, Pedro, Álex, Marc]
start:stop = 2:2   empty range       → return without a swap
```

Every recursive call moves `start` one step right and `stop` one step left. The range shrinks by two. With four cards there are **two swaps but three calls**, because the last call checks the empty base case. For `n` elements, the book's routine makes `1 + ⌊n/2⌋` calls and uses `O(n)` time and `O(n)` additional stack space.

**Why this example?** A display row makes reversal tangible: only the **display order** changes; the official race classification does not. **How to solve it:** swap the outer pair, repeat on the inner range, and stop when fewer than two elements remain. If your cards also store a rider's team and gap, reverse each **whole record**; do not move names alone and leave their data behind. The complete program below does exactly that.

<span id="part-1-power-slow"></span>

### 3. Compute a Power by Reducing the Exponent by One

The book next computes `x` raised to a nonnegative integer `n`. Imagine an **invented fan-photo display** with one Marc or Fabio photo slot that doubles each round. After eight rounds the slot count is `2^8`; these are hypothetical display slots, not MotoGP attendance or points. Code Fragment 4.11 uses `x^0 = 1` and `x^n = x × x^(n−1)`:

```python
def power_linear(x, n):
    if n == 0:
        return 1
    return x * power_linear(x, n - 1)


print(power_linear(2, 8))
```

```text
256
```

The exponent chain is `8 → 7 → 6 → 5 → 4 → 3 → 2 → 1 → 0`. It has nine calls. Each return multiplies by two, yielding `1 → 2 → 4 → 8 → 16 → 32 → 64 → 128 → 256`. The method is linear recursion with `O(n)` time and `O(n)` stack space under the book's constant-cost arithmetic model.

**Why this example?** Doubling makes every multiplication easy to check. **How to solve it:** start at the base value `2^0 = 1`, then multiply by two once for each round. The call to exponent zero is part of both the reasoning and the call count.

<span id="part-1-power-fast"></span>

### 4. Compute the Same Power by Repeated Squaring

Code Fragment 4.12 reaches the base case faster. Let `k = n // 2`. Compute `x^k` **once** and save it as `partial`. Squaring it gives `x^(2k)`. If `n` is odd, `2k = n - 1`, so multiply by one extra `x`:

```text
n even: x^n = (x^(n//2))²
n odd:  x^n = x × (x^(n//2))²
```

```python
def power_fast(x, n):
    if n == 0:
        return 1
    partial = power_fast(x, n // 2)
    result = partial * partial
    if n % 2 == 1:
        result *= x
    return result


print(power_fast(2, 8))
```

```text
256
```

| Call on the way down | Saved value on return | Work at this level | Result |
| ---: | ---: | :--- | ---: |
| `n = 0` | — | Base answer. | 1 |
| `n = 1` | 1 | `1 × 1 × 2`, because 1 is odd. | 2 |
| `n = 2` | 2 | `2 × 2`. | 4 |
| `n = 4` | 4 | `4 × 4`. | 16 |
| `n = 8` | 16 | `16 × 16`. | 256 |

The call chain is `8 → 4 → 2 → 1 → 0`: **five calls**, versus nine for the one-step method. The book's Figure 4.12 uses a larger trace, `power(2, 13)`, following `13 → 6 → 3 → 1 → 0` and returning `8192`. Odd exponents need the extra factor of `x`.

**Why this example?** Both methods compute the **same** 256 display slots, so their different work is easy to compare. **How to solve it:** halve the exponent, save the one smaller answer, square it, and correct for an odd exponent. Writing `power_fast(x, n // 2) * power_fast(x, n // 2)` would recompute the same half-power twice and lose the `O(log n)` call bound. With one saved half-power, time and stack space are both `O(log n)` in the book's model. For very large Python integers, multiplication itself also has a cost; the bound here counts the recursive structure with arithmetic treated as constant cost.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 4.4.2 — Binary Recursion

<span id="part-2-sum"></span>

### 1. Divide the Same Sum into Disjoint Halves

Code Fragment 4.13 sums a half-open range `S[start:stop]`. An empty range sums to `0`; a one-value range returns that value. A longer range splits at `mid = (start + stop) // 2`, then **adds the answers from both halves**:

```python
def binary_sum(values, start, stop):
    if start >= stop:
        return 0
    if start == stop - 1:
        return values[start]
    mid = (start + stop) // 2
    return binary_sum(values, start, mid) + binary_sum(values, mid, stop)


gap_ms = [0, 657, 2326, 23229]
print(binary_sum(gap_ms, 0, len(gap_ms)))
```

```text
26212
```

```text
S[0:4] = 26,212
├── S[0:2] = 657
│   ├── S[0:1] = 0       Marc
│   └── S[1:2] = 657     Álex
└── S[2:4] = 25,555
    ├── S[2:3] = 2,326   Pedro
    └── S[3:4] = 23,229  Fabio
```

The left range ends **before** `mid`, and the right range starts **at** `mid`; together they cover every value exactly once. The two halves are disjoint. Adding their checksums gives `657 + 25555 = 26212 ms`, matching `linear_sum`.

**Why this example?** Reusing the same four official gap labels isolates the algorithmic difference: a chain versus a balanced tree. **How to solve it:** split until each nonempty piece holds one value, return those values, then add sibling results on the way back up. The empty-range base also makes `binary_sum([], 0, 0)` return zero safely.

<span id="part-2-cost"></span>

### 2. Count Calls and Active Depth Separately

For four values, the binary tree has four one-value leaves and three addition nodes: **seven calls** in total. But at most three calls are active at once: a root call, a half-range call, and a singleton call. A completed left branch has returned before the right branch is explored.

| Method on four gaps | Total calls | Maximum active calls | Time | Extra stack |
| :--- | ---: | ---: | :--- | :--- |
| `linear_sum` | 5 | 5 | `O(n)` | `O(n)` |
| `binary_sum` | 7 | 3 | `O(n)` | `O(log n)` |

For `n` a power of two, the book counts **`2n - 1` calls** and depth **`1 + log₂ n`**. The same `2n - 1` count also follows for any positive `n` in this exact implementation: every value becomes one leaf, and a full two-child tree with `n` leaves has `n - 1` internal nodes. The book uses powers of two to make the depth picture simple. The two methods both take linear time, while the balanced split reduces recursive stack depth.

**Why count both measures?** More calls do not necessarily mean a taller call stack. **How to check:** count **every node** for time, but count only the **longest root-to-leaf path** for simultaneous stack use. This is also why binary search, which explores just one half, has a different time cost from `binary_sum`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 4.4.3 — Multiple Recursion

<span id="part-3-choices"></span>

### 1. Follow Every Child or Choice

An invocation uses **multiple recursion** when it may make three or more recursive calls. Section 4.1's `disk_usage` can visit every direct child of a directory; a directory with four child directories can start four recursive calls. Those children represent different parts of the file system, so a visit-once traversal can still take `O(n)` time in the number of entries. The number of child calls alone does not prove an exponential running time.

Section 4.4's second example is a **combinatorial puzzle**. The book mentions letter-to-digit addition puzzles such as `pot + pan = bib`: each distinct letter receives one unused digit, and the finished assignment is tested. Its `PuzzleSolve(k, S, U)` works more generally. `S` is the chosen prefix, `U` is the unused set, and `k` is how many more positions to fill. At each step it tries each available `e`, making a smaller puzzle with `k - 1` positions left.

**Why use a card puzzle here?** Three distinct riders give a complete tree small enough to draw. **How to think about it:** each branch represents one choice for the next display position; return to the previous position to try a different choice.

<span id="part-3-puzzle"></span>

### 2. Solve a Rider-Card Order Puzzle

Take three **hypothetical display cards**, each printed with a rider and his real Misano winner-relative gap:

| Short label | Card | Printed gap |
| :---: | :--- | ---: |
| `M` | Marc Márquez — Ducati Lenovo Team | 0 ms |
| `P` | Pedro Acosta — Red Bull KTM Factory Racing | 2,326 ms |
| `F` | Fabio Quartararo — Monster Energy Yamaha MotoGP | 23,229 ms |

The invented display rule is: **left-to-right gap labels must increase strictly**. This is a desk-order exercise; it does not revise the actual race classification. Start with `S = []`, `U = [M, P, F]`, and `k = 3`. Choose a card, move it from `U` to the end of `S`, and continue until the final card can be tested.

```text
S = [], U = [M, P, F], k = 3
├── choose M → S = [M], U = [P, F], k = 2
│   ├── choose P → k = 1 with S = [M, P]; choose F → test M-P-F ✓
│   └── choose F → k = 1 with S = [M, F]; choose P → test M-F-P ✗
├── choose P → S = [P], U = [M, F], k = 2
│   ├── choose M → k = 1; choose F → test P-M-F ✗
│   └── choose F → k = 1; choose M → test P-F-M ✗
└── choose F → S = [F], U = [M, P], k = 2
    ├── choose M → k = 1; choose P → test F-M-P ✗
    └── choose P → k = 1; choose M → test F-P-M ✗
```

| Complete order | Gap labels, in ms | Passes the rule? |
| :--- | :--- | :---: |
| M-P-F | `0, 2326, 23229` | Yes |
| M-F-P | `0, 23229, 2326` | No |
| P-M-F | `2326, 0, 23229` | No |
| P-F-M | `2326, 23229, 0` | No |
| F-M-P | `23229, 0, 2326` | No |
| F-P-M | `23229, 2326, 0` | No |

**Why this particular rule?** It checks a completed order using only verified numbers and has one easy-to-verify answer. **How to solve it by hand:** list the three possibilities for the first card, then the two unused possibilities for the second; the final card is forced. Test each full order against the two `<` comparisons. The solution is **Marc → Pedro → Fabio** as a display arrangement.

<span id="part-3-backtrack"></span>

### 3. Restore the State and Count Candidates

The book's `PuzzleSolve` tests a completed order **inside a `k = 1` call** after choosing the final item. Its Figure 4.14 therefore shows **one** call at `k = 3`, **three** at `k = 2`, and **six** at `k = 1`: ten calls that test six completed orders if all branches are explored. An alternate implementation that recurses once more to `k = 0` would make six additional calls. The complete program below follows the book's `k = 1` placement and explores all solutions rather than stopping at the first one.

After testing one branch, remove its last card from `S` and put it back into `U`. This **backtracking** restores the exact state needed for the next trial:

```text
Before choosing P:  S = [M],    U = [P, F]
After choosing P:   S = [M, P], U = [F]
While testing M-P-F: S = [M, P, F], U = []
After restoring F:  S = [M, P], U = [F]
After restoring P:  S = [M],    U = [P, F]
```

With `m` distinct available choices and `k` positions, exhaustive search tests `m × (m-1) × ··· × (m-k+1) = m!/(m-k)!` completed arrangements. For three cards and three positions, that is `3 × 2 × 1 = 6`. An early success return or a rule that rejects partial prefixes may explore fewer. An exhaustive ordering puzzle can grow much faster than a directory visit, even though both are multiple recursion.

**Why restore after every trial?** Otherwise the next branch starts with a missing or duplicate choice and may skip a valid order. **How to implement it:** remove an unused card, append it to the chosen prefix, recurse or test, then undo both changes before continuing the loop. If a function returns early on success, restore before returning whenever its caller may reuse those lists. Our program collects solutions and restores on every branch.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Runnable Comparison

<span id="part-4-program"></span>

### 1. Program

This program keeps each rider's **name, team, and gap together** in one record. It adds counters solely to make the call trees visible; the counting helper is not included in the reported recursive call totals. It uses the same four Misano gaps for both sums and the same hypothetical doubling rule for both powers.

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
    mid = (start + stop) // 2
    return (binary_sum(values, start, mid, stats, depth + 1)
            + binary_sum(values, mid, stop, stats, depth + 1))


def puzzle_solve(k, chosen, available, gap_by_rider, solutions, stats, depth=1):
    """Test all k-card extensions of chosen, restoring both working lists."""
    enter(stats, depth)
    for index in range(len(available)):
        rider = available.pop(index)
        chosen.append(rider)
        if k == 1:
            stats["candidates"] += 1
            if all(gap_by_rider[chosen[i]] < gap_by_rider[chosen[i + 1]]
                   for i in range(len(chosen) - 1)):
                solutions.append(tuple(chosen))
        else:
            puzzle_solve(k - 1, chosen, available, gap_by_rider,
                         solutions, stats, depth + 1)
        chosen.pop()
        available.insert(index, rider)


# Sunday 13 September 2026 Misano MotoGP race. Gaps are milliseconds to Marc.
race = [
    ("Marc Márquez", "Ducati Lenovo Team", 0),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 657),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 2326),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP", 23229),
]
gaps = [record[2] for record in race]

linear_stats = new_stats()
linear_total = linear_sum(gaps, len(gaps), linear_stats)
print("linear checksum:", linear_total, "ms | calls:", linear_stats["calls"],
      "| depth:", linear_stats["max_depth"])

display = race.copy()
reverse_stats = new_stats()
reverse(display, 0, len(display), reverse_stats)
print("reversed display:", [record[0] for record in display],
      "| calls:", reverse_stats["calls"],
      "| depth:", reverse_stats["max_depth"])

slow_stats = new_stats()
fast_stats = new_stats()
slow_slots = power_linear(2, 8, slow_stats)
fast_slots = power_fast(2, 8, fast_stats)
print("fan-photo slots:", slow_slots, "| linear calls:", slow_stats["calls"],
      "| fast calls:", fast_stats["calls"])
assert slow_slots == fast_slots

binary_stats = new_stats()
binary_total = binary_sum(gaps, 0, len(gaps), binary_stats)
print("binary checksum:", binary_total, "ms | calls:", binary_stats["calls"],
      "| depth:", binary_stats["max_depth"])
assert binary_total == linear_total

available = ["Marc Márquez", "Pedro Acosta", "Fabio Quartararo"]
gap_by_rider = {record[0]: record[2] for record in race}
chosen = []
solutions = []
puzzle_stats = new_stats()
puzzle_solve(3, chosen, available, gap_by_rider, solutions, puzzle_stats)
print("card orders tested:", puzzle_stats["candidates"],
      "| puzzle calls:", puzzle_stats["calls"])
print("increasing-gap display:", solutions)
print("restored state:", chosen, available)
```

<span id="part-4-results"></span>

### 2. Read the Output

```text
linear checksum: 26212 ms | calls: 5 | depth: 5
reversed display: ['Fabio Quartararo', 'Pedro Acosta', 'Álex Márquez', 'Marc Márquez'] | calls: 3 | depth: 3
fan-photo slots: 256 | linear calls: 9 | fast calls: 5
binary checksum: 26212 ms | calls: 7 | depth: 3
card orders tested: 6 | puzzle calls: 10
increasing-gap display: [('Marc Márquez', 'Pedro Acosta', 'Fabio Quartararo')]
restored state: [] ['Marc Márquez', 'Pedro Acosta', 'Fabio Quartararo']
```

Both sums produce the same notebook checksum, but their call trees have different shapes and depths. Both power functions produce the same invented display count, while repeated squaring follows fewer exponent values. The card solver tests all six orders and leaves its working lists as they were. The displayed riders are real Misano finishers; the reversed row and increasing-gap row are **teaching displays**, not alternative race results.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Work Through Five Small Cases

<details>
<summary><strong>Case Study 1: What does an empty checksum return?</strong></summary>

**Scenario:** No gap values have been selected yet. **Why this case?** It tests the smallest valid input. **How to solve it:** `linear_sum([], 0)` returns `0` immediately; `binary_sum([], 0, 0)` also returns `0`. Neither algorithm reads a missing list element. Each makes one call.

</details>

<details>
<summary><strong>Case Study 2: What if a display has one rider?</strong></summary>

**Scenario:** The only card is Fabio Quartararo's. **Why this case?** It exposes reversal's implicit base case. **How to solve it:** call `reverse(cards, 0, 1)`. The test `0 < 1 - 1` is false, so no swap occurs. There is one call and the card remains in place.

</details>

<details>
<summary><strong>Case Study 3: Why does an odd exponent need one extra factor?</strong></summary>

**Scenario:** The invented photo display doubles for five rounds. **Why this case?** An even exponent would hide the final correction. **How to solve it:** `5 // 2 = 2`; compute `2² = 4` once, square it to get `16`, then multiply by `2` to get `2⁵ = 32`. The fast exponent chain is `5 → 2 → 1 → 0`.

</details>

<details>
<summary><strong>Case Study 4: Can seven calls use less stack than five?</strong></summary>

**Scenario:** Sum the four Misano gap labels. **Why this case?** It separates total work from simultaneous memory. **How to solve it:** the linear chain has five calls and depth five. The binary sum has seven calls overall but depth three, because the left half returns before the right half runs. Both answers are `26212 ms`.

</details>

<details>
<summary><strong>Case Study 5: What goes wrong if a chosen card is not restored?</strong></summary>

**Scenario:** After testing an order beginning with Marc, the solver forgets to put Marc back among unused cards. **Why this case?** It shows why backtracking includes an undo step. **How to solve it:** after each test or child call, remove the selected rider from `chosen` and reinsert him into `available` at the original index. Then all six distinct orders can be reached, and the initial lists are restored.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 4.4 idea | Question to ask | Misano teaching result |
| :--- | :--- | :--- |
| **Linear recursion** | Does one invocation start at most one recursive call? | `linear_sum` follows one five-call chain for four gaps. |
| **Sequence reversal** | Do the outer elements swap and the inner range shrink? | Four rider records reverse in two swaps and three calls. |
| **One-step power** | Does the exponent fall by one? | Hypothetical `2⁸ = 256` slots take nine calls. |
| **Repeated squaring** | Is the half-power computed once and reused? | The same 256 slots take five calls. |
| **Binary recursion** | Are both smaller subproblems actually visited? | `binary_sum` takes seven calls, depth three, and returns the same `26212 ms` checksum. |
| **Multiple recursion** | Can one invocation try three or more choices? | Three rider cards yield six complete orders; only Marc → Pedro → Fabio passes the invented increasing-gap rule. |
| **Time versus stack** | How many calls happen in total, and how many are active together? | Both sums take `O(n)` time, while the balanced sum uses `O(log n)` stack space. |

**The reusable method:** identify the base case, show what becomes smaller, draw the actual call shape, then count total calls and longest active path separately. Keep source race facts distinct from the checksum and display rules created for practice.

[🔝 Back to Top](#top)
