<span id="top"></span>

# Algorithm Analysis — Section 3.2: The Seven Functions Used in This Book

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 3](<../../file/Data Structures and Algorithms in Python - C03.pdf>), Section 3.2, printed pages 115–122.  
> **Topic:** Seven growth functions; logarithms, powers, sums, and comparisons of growth rates.  
> **Domain focus:** The **2026 Brazilian Grand Prix MotoGP Q2 session** at Goiânia on 21 March 2026.  
> **Learning goal:** Recognize each function from a small rider-record task, calculate its value, and explain what the count does and does not measure.  
> **User Prompt:** "Reexplain [Section 3.2] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Q2 Session, Seven Kinds of Work](#background-intuition)
2. [Part 1: Constant and Logarithmic Functions](#part-1)
   - [1. The constant function](#part-1-constant)
   - [2. The logarithm function](#part-1-logarithm)
   - [3. Rules for logarithms](#part-1-log-rules)
3. [Part 2: Linear and N-Log-N Functions](#part-2)
   - [1. The linear function](#part-2-linear)
   - [2. The n-log-n function](#part-2-nlogn)
4. [Part 3: Quadratic Functions and Triangular Sums](#part-3)
   - [1. The quadratic function](#part-3-quadratic)
   - [2. A nested-loop staircase](#part-3-triangular)
5. [Part 4: Cubic Functions, Polynomials, and Summations](#part-4)
   - [1. The cubic function](#part-4-cubic)
   - [2. Polynomials](#part-4-polynomials)
   - [3. Summation notation](#part-4-summations)
6. [Part 5: Exponential Functions and Geometric Sums](#part-5)
   - [1. The exponential function](#part-5-exponential)
   - [2. Rules for exponents](#part-5-exponent-rules)
   - [3. The geometric sum](#part-5-geometric)
7. [Part 6: Section 3.2.1 — Comparing Growth Rates](#part-6)
   - [1. Compare the seven functions](#part-6-comparison)
   - [2. Read the book's growth chart](#part-6-chart)
   - [3. Floor and ceiling](#part-6-rounding)
8. [Part 7: Summary](#part-7)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Q2 Session, Seven Kinds of Work

[Section 3.1](03-01-experimental-studies.md) distinguished a rider's lap time from an algorithm's running time. We will keep that distinction. The [MotoGP session report](https://www.motogp.com/en/news/2026/03/21/di-giannantonio-heads-bezzecchi-after-dramatic-first-qualifying-in-brazil/1010237) and [published Q2 timing classification](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Qualifying2.pdf) give **12 Q2 rider records**. These are its first four, in official Q2 classification order:

| Q2 place | Rider | Team | Best Q2 lap | Seconds |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team | 1:17.410 | 77.410 |
| P2 | Marco Bezzecchi | Aprilia Racing | 1:17.480 | 77.480 |
| P3 | Marc Márquez | Ducati Lenovo Team | 1:17.491 | 77.491 |
| P4 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:17.561 | 77.561 |

`1:17.491` means `60 + 17.491 = 77.491` seconds. Marc's best Q2 lap was `77.561 − 77.491 = 0.070` seconds quicker than Fabio Quartararo's. These are **sporting results**. The functions in this section count hypothetical **computer work** on result records; their values are not lap times or measured milliseconds.

For the small code examples, copy these real records into a list:

```python
DIGI = ("Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", 77.410)
BEZ = ("Marco Bezzecchi", "Aprilia Racing", 77.480)
MARC = ("Marc Márquez", "Ducati Lenovo Team", 77.491)
QUARTARARO = ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 77.561)

top_four = [DIGI, BEZ, MARC, QUARTARARO]  # Official Q2 order, P1–P4.
```

Here, `n = 4` if the input is `top_four`; `n = 12` if the input is the full Q2 classification. **Input size is the number of records**, not a rider's lap time or place. A different algorithm can perform a different amount of work on the same `n` records. For growth beyond this fixed 12-rider session, imagine larger lists of the same kind; that is a mathematical extension, not a claim about extra Q2 participants.

**Why this example?** One verified session gives us a consistent set of riders, teams, and values while we change only the *computer task*. **How to solve later examples:** first say what one input item is, count items to get `n`, identify the operation being counted, and keep that count separate from the Q2 timing data.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Constant and Logarithmic Functions

<span id="part-1-constant"></span>

### 1. The Constant Function

The standard **constant function** is `f(n) = 1`. More generally, `f(n) = c` for a fixed number `c` is constant: its value does not grow when `n` grows.

If the Q2 records are already stored in classification order, Marc is at Python index `2`. Reading that known position uses one list access whether the list contains four records or the full 12:

```python
rider, team, best_lap = top_four[2]
print(rider, "|", team)
```

```text
Marc Márquez | Ducati Lenovo Team
```

This counts the **known-index lookup only**. Loading the list, finding Marc's position when it is unknown, or printing the result adds other work. It would be misleading to call a search for Marc constant just because the final `top_four[2]` access is constant.

**Why this example?** Marc's verified P3 position supplies a clear known index. **How to solve it:** confirm the list order, subtract one from the human place to get the Python index, then access that one element. The number of other records does not change the number of accesses.

<span id="part-1-logarithm"></span>

### 2. The Logarithm Function

A logarithm reverses exponentiation. `log_b n = x` means `b^x = n`, with `b > 1` and `n > 0`. The book uses **base 2** when it writes `log n` without a base: `log n = log₂ n`. Thus `2³ = 8` means `log₂ 8 = 3`.

The official Q2 order is sorted by best-lap time, from quicker to slower. On the four-record list, we can find the **first** lap at or above `77.500` seconds by discarding half of the remaining positions after each comparison:

```python
def first_at_or_above(sorted_records, cutoff):
    low, high = 0, len(sorted_records)  # Search within [low, high).
    while low < high:
        middle = (low + high) // 2
        if sorted_records[middle][2] < cutoff:
            low = middle + 1
        else:
            high = middle
    return low if low < len(sorted_records) else None

index = first_at_or_above(top_four, 77.500)
print(index, top_four[index][0])
```

```text
3 Fabio Quartararo
```

Trace the two comparisons here:

| Step | Remaining indexes before check | Middle rider | Decision |
| ---: | :--- | :--- | :--- |
| 1 | `0, 1, 2, 3` | Marc at `2`: `77.491 < 77.500` | Keep indexes from `3` onward. |
| 2 | `3` | Fabio Quartararo at `3`: `77.561 ≥ 77.500` | Keep index `3`; the loop ends and returns it. |

Repeated halving gives the **logarithmic pattern**. For 12 candidates, ideal sizes go `12 → 6 → 3 → at most 2 → at most 1`, so `⌈log₂ 12⌉ = 4` halvings suffice to reduce the candidate count to one. Exact comparisons depend on the search code and the input. A reference value such as `log₂ 1 = 0` does **not** say that checking one record costs zero operations.

**Why this example?** Marc's `77.491` and Fabio Quartararo's `77.561` sit on opposite sides of `77.500`, making each discard decision visible. **How to solve it:** verify the input is sorted, inspect the middle, discard the half that cannot contain the first qualifying value, and repeat. If the records were in arbitrary order, discarding half would be unjustified; sorting them first would have a separate cost.

<span id="part-1-log-rules"></span>

### 3. Rules for Logarithms

The book's Proposition 3.1 gives five identities. Assume `x, y, c > 0` and bases `b, d > 1`:

| Rule | Identity | Small check |
| :--- | :--- | :--- |
| Product | `log_b(xy) = log_b x + log_b y` | `log₂(4·8) = 5 = 2 + 3` |
| Quotient | `log_b(x/y) = log_b x − log_b y` | `log₂(32/4) = 3 = 5 − 2` |
| Power | `log_b(x^c) = c log_b x` | `log₂(4³) = 6 = 3·2` |
| Change of base | `log_b x = (log_d x)/(log_d b)` | `log₄ 16 = 4/2 = 2` using base 2 |
| Exchange | `b^(log_d x) = x^(log_d b)` | `4^(log₂ 8) = 4³ = 8² = 8^(log₂ 4)` |

For input sizes, the product rule says `log₂(2n) = 1 + log₂ n`: doubling the records adds **one** ideal halving level. The quotient rule gives `log₂(n/2) = log₂ n − 1`. The power rule gives `log₂(n³) = 3 log₂ n`. The logarithm and exponent undo each other: `log₂(2^n) = n` and `2^(log₂ n) = n`. Change of base lets us compute `log₄ n = (log₂ n)/2`, or use a base-10 calculator: `log₂ n = LOG(n)/LOG(2)`.

Watch the notation: `log(n²)` means `log n` **after squaring `n`**, while `log² n` means `(log n)²`. At `n = 8`, those values are `6` and `9`, respectively.

**Why these examples?** Powers of two make each identity checkable by hand and connect the algebra to repeated halving. **How to solve a log expression:** name the base, rewrite the logarithm as an exponent if needed, apply one rule at a time, then check the result with a small numeric value.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Linear and N-Log-N Functions

<span id="part-2-linear"></span>

### 1. The Linear Function

The **linear function** is `f(n) = n`. It describes one selected unit of work for each of `n` input items. Suppose the timing desk counts how many best Q2 laps in our four-record list are below `77.500` seconds:

```python
def count_below(records, cutoff):
    count = 0
    for record in records:
        if record[2] < cutoff:
            count += 1
    return count

print(count_below(top_four, 77.500))
```

```text
3
```

The loop compares **all four** records: Di Giannantonio, Bezzecchi, and Marc qualify; Fabio Quartararo does not. Its selected comparison count is exactly `n = 4` here, and exactly `n` for any list of length `n`. The full program also does setup, loop control, increments, and a return. Even reading all `n` separate input records takes work that grows with `n`. A search that stops when it finds a rider may use fewer comparisons on an easy input but still need `n` in its worst case.

**Why this example?** Marc and Fabio fall on opposite sides of the same cutoff, while counting requires visiting every record. **How to solve it:** set the count to zero, inspect each best-lap value once, increment for a value below the cutoff, and return the final count.

<span id="part-2-nlogn"></span>

### 2. The N-Log-N Function

The **n-log-n function** is `f(n) = n log₂ n`. A merge-based **comparison sort** gives a useful picture: split an unordered copy of the records in half until each piece has one record, then merge sorted pieces. The split produces about `log₂ n` merge levels; across each level, all `n` records are placed into merged lists.

Here is an **illustrative shuffled copy** of the same four published records. The official Q2 classification itself is already in time order.

```text
Unordered copy: [Quartararo 77.561, Marc 77.491, Bezzecchi 77.480, Di Giannantonio 77.410]
Split:          [Quartararo, Marc]             [Bezzecchi, Di Giannantonio]
Merge pairs:    [Marc, Quartararo]             [Di Giannantonio, Bezzecchi]
Final merge:    [Di Giannantonio, Bezzecchi, Marc, Quartararo]
```

With `n = 4`, two merge levels place four records each, giving `4·2 = 8` **record placements** in this simple model. With `n = 8`, three levels give `8·3 = 24` placements. Those are **not** exact comparison counts or Python instruction counts. The book also notes that sorting arbitrary values using only comparisons has an n-log-n lower bound; specialized input restrictions can change which methods are available. At `n = 1`, the mathematical reference function `n log₂ n` is zero, although even a one-record program may do setup work.

**Why this example?** Shuffling a copy creates a genuine sorting task without changing the real rider data or implying that the official classification was unordered. **How to solve it:** split into halves, sort each half, merge the two sorted halves by comparing their next entries, then count roughly `n` placements at each of about `log₂ n` levels. Sorting preparation must be included if a later binary search depends on sorted data.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Quadratic Functions and Triangular Sums

<span id="part-3-quadratic"></span>

### 1. The Quadratic Function

The **quadratic function** is `f(n) = n² = n·n`. Suppose a program visits **every ordered pair** of records in preparation for a best-lap-gap study, including a rider paired with themselves. The outer loop has `n` choices, and for each one the inner loop has `n` choices:

```python
def ordered_pair_count(records):
    count = 0
    for first in records:
        for second in records:
            count += 1
    return count

print(ordered_pair_count(top_four))
print(f"{abs(MARC[2] - QUARTARARO[2]):.3f} s")
```

```text
16
0.070 s
```

The code counts `4² = 16` visits; the second line shows one real Q2 best-lap gap that such a pairwise study could calculate. `(Marc, Fabio)` and `(Fabio, Marc)` are separate **ordered** visits, and self-pairs such as `(Marc, Marc)` are included. Two nested loops do not *automatically* imply `n²`: this count follows because **both loops each visit all `n` records**.

**Why this example?** Marc–Fabio is a concrete pair, while all-pairs comparison makes the multiplication `n·n` visible. **How to solve it:** count outer-loop choices, count inner-loop choices per outer choice, then multiply. State whether reversed and self-pairs are included.

<span id="part-3-triangular"></span>

### 2. A Nested-Loop Staircase

If we want each **unordered pair** only once, the inner loop becomes shorter on each pass. First include self-pairs so the number of visits is the book's triangular sum:

```python
def pairs_including_self(records):
    count = 0
    for i in range(len(records)):
        for j in range(i, len(records)):
            count += 1
    return count

print(pairs_including_self(top_four))
```

```text
10
```

For `n = 4`, the inner loops visit `4 + 3 + 2 + 1 = 10` pairs. Reversing that sum gives `1 + 2 + 3 + 4`. Proposition 3.3 states the general identity:

```text
1 + 2 + ⋯ + n = n(n + 1)/2 = n²/2 + n/2.
```

**How does the formula arise?** Flip a second copy so its row lengths run `n, n − 1, …, 1`, and place it beside the first. Each paired row has `n + 1` unit squares, making a rectangle with side lengths `n` and `n + 1`. Its area is `n(n + 1)`, so one staircase has half: `n(n + 1)/2`. The book also illustrates a rectangle of width `n/2` and height `n + 1` by pairing the shortest and longest rows when `n` is even.

To exclude self-pairs, subtract `n`: `n(n + 1)/2 − n = n(n − 1)/2`. That gives `6` distinct unordered pairs among our four riders and `66` among all 12 Q2 riders. The triangular count is less than `n²`, but its leading term is proportional to `n²`, so it still has a quadratic growth pattern.

**Why this example?** Pairing riders gives a natural reason for the second loop to shrink, and it shows why "two loops" needs closer inspection. **How to solve it:** write the number of inner visits on each outer pass, add them as a staircase, use the triangular formula, and subtract the self-pairs if the task excludes them.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Cubic Functions, Polynomials, and Summations

<span id="part-4-cubic"></span>

### 1. The Cubic Function

The **cubic function** is `f(n) = n³ = n·n·n`. Imagine a hypothetical comparison graphic with three ordered slots. A simple program tries every choice of a Q2 record for slot 1, every choice for slot 2, and every choice for slot 3:

```python
def ordered_triple_count(records):
    count = 0
    for first in records:
        for second in records:
            for third in records:
                count += 1
    return count

print(ordered_triple_count(top_four))
```

```text
64
```

The loop visits `4³ = 64` triples of the four selected records, **including repeated riders**. If we later reject repeats, the loop still made 64 visits. A method that generates only distinct **ordered** triples has `n(n − 1)(n − 2)` possibilities: `4·3·2 = 24` for our four records, or `12·11·10 = 1320` for all Q2 records. If order does not matter, divide by `3! = 6`: there are `4` three-rider groups from four records, or `220` from 12. These are hypothetical computer selections, not actual Q2 results or race podiums.

**Why this example?** Three independent slots visibly produce three factors of `n`, while excluding repeated riders shows how a task's rules affect the exact count. **How to solve it:** count choices for each slot, multiply, and then decide whether repeated riders and different slot orders count as distinct outcomes.

<span id="part-4-polynomials"></span>

### 2. Polynomials

A **polynomial** adds fixed multiples of nonnegative integer powers of `n`:

```text
f(n) = a₀ + a₁n + a₂n² + ⋯ + a_dn^d, with a_d ≠ 0.
```

The `a_i` values are **coefficients**. The highest nonzero exponent `d` is the **degree**. Constant `1` has degree 0, linear `n` degree 1, quadratic `n²` degree 2, and cubic `n³` degree 3.

For a made-up count of selected steps in a Q2 report program, suppose there are **3 setup steps**, **2 steps for each rider**, and **1 step for each ordered rider pair**:

```text
f(n) = 3 + 2n + n²
f(4) = 3 + 2(4) + 4² = 27 selected steps
```

This is a degree-2 polynomial even though it also contains constant and linear terms. The number `27` belongs to this stated model; it is not a stopwatch result or an exact count of Python machine instructions. For large `n`, the `n²` part grows faster than the lower-degree parts. Section 3.3 will formalize how we simplify such comparisons.

**Why this example?** It combines fixed work, per-rider work, and pair work in one familiar report task. **How to solve it:** count each category separately, multiply by the number of times it occurs, add the terms, and identify the highest nonzero power.

<span id="part-4-summations"></span>

### 3. Summation Notation

The symbol `Σ` abbreviates repeated addition. The index tells us which term to add; the lower and upper limits tell us where to start and stop. For integers `a ≤ b`, the general form is `Σ_{i=a}^b g(i) = g(a) + g(a+1) + ⋯ + g(b)`. For example:

```text
Σ_{i=1}^4 i = 1 + 2 + 3 + 4 = 10
Σ_{i=1}^n i = n(n + 1)/2
```

In the pair staircase, `i` can represent the number of remaining partners on a pass. The polynomial above can also be written `Σ_{i=0}^2 a_i n^i` with `a₀ = 3`, `a₁ = 2`, and `a₂ = 1`. Summation notation is useful whenever a loop's total work is the sum of its work on individual passes.

**Why this example?** The four-rider staircase turns an unfamiliar symbol into the familiar addition `1 + 2 + 3 + 4`. **How to solve it:** substitute each allowed index value, write out its term, add the terms, and then use a known formula when the pattern continues to `n`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Exponential Functions and Geometric Sums

<span id="part-5-exponential"></span>

### 1. The Exponential Function

An **exponential function** has the form `f(n) = a^n` for a fixed base `a > 1`. The book often uses `a = 2`. Suppose a Q2 results tool lets a fan **include or exclude** each rider in a hypothetical comparison chart. Each new rider doubles the number of possible selections.

For Marc and Fabio Quartararo alone, the possibilities are `{}`, `{Marc}`, `{Fabio Quartararo}`, and `{Marc, Fabio Quartararo}`: `2² = 4`. Adding Di Giannantonio and Bezzecchi gives `2⁴ = 16` selections. The empty selection is included.

This runnable code builds every selection from the four real records:

```python
def all_selections(records):
    selections = [()]  # The empty selection.
    for record in records:
        selections += [
            selection + (record[0],) for selection in selections
        ]
    return selections

print(len(all_selections(top_four)))
```

```text
16
```

The full Q2 classification has 12 riders, so the same yes/no choice would give `2¹² = 4096` subsets. That is a mathematical count of hypothetical selections, not 4096 real Q2 events. The code stores all subsets and copies rider names into tuples, so `2^n` counts the selections rather than the exact Python instructions or memory used. Calculating a score for every subset could add still more work.

**Why this example?** Every rider contributes one independent yes/no decision, making the factor of two easy to see. **How to solve it:** start with one choice (the empty set), double for each new rider, and include the empty selection unless the task explicitly excludes it. For nonempty selections, subtract one: `2^n − 1`.

<span id="part-5-exponent-rules"></span>

### 2. Rules for Exponents

The book's Proposition 3.4 supplies three rules for powers of the same positive base:

| Rule | Identity | Small check |
| :--- | :--- | :--- |
| Power of a power | `(a^p)^q = a^(pq)` | `(2²)³ = 2⁶ = 64` |
| Multiply powers | `a^p · a^q = a^(p+q)` | `2²·2² = 2⁴ = 16` |
| Divide powers | `a^p/a^q = a^(p−q)` | `2⁵/2² = 2³ = 8` |

For example, the independent selections from the two riders Marc and Fabio Quartararo (`2²`) combine with selections from Di Giannantonio and Bezzecchi (`2²`) to give `2²·2² = 2⁴ = 16` selections from all four.

The algebra also permits exponents that are not rider counts: `2^(−1) = 1/2` and `9^(1/2) = 3`. Negative powers mean reciprocals and fractional powers mean roots; arbitrary real exponents can be understood by approximating them with fractions. In the subset task, `n` itself remains a nonnegative whole number.

**Why this example?** Two groups of two verified riders show why multiplying independent choice counts adds exponents. **How to solve it:** keep the base fixed, apply the relevant rule to the exponents, and check a small case by direct multiplication.

<span id="part-5-geometric"></span>

### 3. The Geometric Sum

A **geometric sequence** multiplies by the same factor at each step. In the include/exclude decision tree, level `0` has `1` partial selection, level `1` has `2`, level `2` has `4`, and so on. Through four riders:

```text
Level:          0   1   2   3   4
Partial choices: 1 + 2 + 4 + 8 + 16 = 31 total tree nodes
Complete choices at the final level: 16
```

Proposition 3.5 gives the formula for `m + 1` terms when `a > 0` and `a ≠ 1`:

```text
Σ_{i=0}^m a^i = 1 + a + a² + ⋯ + a^m = (a^(m+1) − 1)/(a − 1).
```

With `a = 2` and `m = 4`, the total is `(2⁵ − 1)/(2 − 1) = 31`. The **leaves alone** number `2⁴ = 16`. For `n` riders, the first `n` levels from `0` through `n − 1` sum to `1 + 2 + ⋯ + 2^(n−1) = 2^n − 1`, while the full tree through level `n` has `2^(n+1) − 1` nodes.

**Why this example?** It uses the same subset task to distinguish the number of complete selections from the number of partial decisions visited on the way. **How to solve it:** identify the first term, the multiplier, and the last exponent; count the terms carefully; then substitute into the formula.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Section 3.2.1 — Comparing Growth Rates

<span id="part-6-comparison"></span>

### 1. Compare the Seven Functions

Table 3.1 in the book orders these reference functions: **constant, logarithmic, linear, n-log-n, quadratic, cubic, exponential**. Its exponential function is `a^n` for any fixed `a > 1`; the numerical table below chooses `a = 2`. Here `log` is base 2. The numbers are **function values**, not measured program times or Q2 lap times:

| Function | Q2-record task that suggests it | `n = 4` | `n = 8` | `n = 12` |
| :--- | :--- | ---: | ---: | ---: |
| `1` | Read one known position | 1 | 1 | 1 |
| `log₂ n` | Halve a sorted search range | 2 | 3 | ≈3.585 |
| `n` | Inspect every record | 4 | 8 | 12 |
| `n log₂ n` | Merge-sort an unordered copy | 8 | 24 | ≈43.020 |
| `n²` | Visit all ordered pairs | 16 | 64 | 144 |
| `n³` | Visit all ordered triples | 64 | 512 | 1,728 |
| `2^n` | Visit all rider subsets | 16 | 256 | 4,096 |

At `n = 8`, `2⁸ = 256` is **less** than `8³ = 512`. At `n = 12`, `2¹² = 4096` is **greater** than `12³ = 1728`. The long-run ordering does not mean every row exceeds the row above it at every small `n`. Real programs also have setup costs and different per-step costs.

**Why this example?** Four, eight, and twelve are sizes that fit within this 12-rider Q2 session, and the last two columns reveal a small-input crossover. **How to solve it:** hold `n` fixed within a column, substitute it into each formula, compare the resulting values, then repeat at a larger `n` before drawing conclusions about growth.

<span id="part-6-chart"></span>

### 2. Read the Book's Growth Chart

Figure 3.4 plots the seven mathematical functions with **logarithmic scales on both axes** and uses `2^n` for the exponential curve. Equal spacing on a logarithmic axis means equal multiplication factors, which makes very different values visible on one chart. The exponential function grows so quickly that its values eventually extend beyond the chart.

The chart is about **patterns as `n` grows**. It is not a MotoGP timing chart and does not show actual milliseconds spent processing the Q2 classification. If a real program combines work such as `3 + 2n + n²`, the quadratic term becomes the main growth source at sufficiently large `n`, even though the constant and linear terms still exist.

**Why this example?** The table's `n = 8` to `n = 12` crossover prepares us to read the curves as long-run behavior instead of a fixed ranking at one size. **How to solve it:** identify each axis and scale, follow a curve as `n` increases, and compare how many multiplicative steps the values take.

<span id="part-6-rounding"></span>

### 3. Floor and Ceiling

Counts of loop iterations are whole numbers, but logarithms need not be. The **floor** `⌊x⌋` is the greatest integer no larger than `x`; the **ceiling** `⌈x⌉` is the smallest integer no smaller than `x`.

For the full 12-rider Q2 classification, `log₂ 12 ≈ 3.585`:

```python
from math import ceil, floor, log2

print(floor(log2(12)), ceil(log2(12)))
```

```text
3 4
```

Four idealized halvings bring 12 candidates to at most one: `12 → 6 → 3 → 2 → 1` when partial candidates are rounded up. The exact number of comparisons for a particular binary-search program can differ. At `n = 1`, `log₂ 1 = 0` even though an implementation may still do work; at `n = 0`, `log₂ 0` is undefined, so handle an empty list separately.

**Why this example?** The real Q2 field size of 12 produces a noninteger logarithm, making the purpose of ceiling visible. **How to solve it:** locate the nearest powers of two (`2³ = 8 < 12 < 16 = 2⁴`), then round down for floor or up for ceiling according to the definition.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 3.2 function | Plain-language pattern | Q2-record example |
| :--- | :--- | :--- |
| **Constant `1`** | Access a fixed number of known positions. | Read Marc's record at index `2`. |
| **Logarithmic `log₂ n`** | Repeatedly discard a fixed fraction of candidates. | Find the first lap at or above `77.500` seconds: Fabio Quartararo. |
| **Linear `n`** | Do fixed work for every record. | Count all best laps below `77.500` seconds. |
| **N-log-n `n log₂ n`** | Handle all records at each of about `log₂ n` levels. | Merge-sort a shuffled copy of Q2 records. |
| **Quadratic `n²`** | Visit every ordered pair. | Count Marc–Fabio and all other ordered pair visits. |
| **Cubic `n³`** | Make three independent record choices. | Try every ordered three-slot comparison graphic. |
| **Exponential `a^n`**, often `2^n` | Multiply choices for each new item. | Include or exclude each Q2 rider. |

The section also gives logarithm and exponent rules, polynomial and summation notation, triangular and geometric sums, and floor and ceiling. For every proposed algorithm, first define `n` and the **operation being counted**. Then choose the matching growth pattern; do not mistake a reference function for a measured lap or program time.

[🔝 Back to Top](#top)
