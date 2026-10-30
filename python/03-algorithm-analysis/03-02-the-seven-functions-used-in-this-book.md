<span id="top"></span>

# 3.2 The Seven Functions Used in This Book — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 3, Section 3.2, printed pages 115–122 (the supplied PDF).  
> **Topic:** The seven functions; logarithm and exponent rules; nested loops, polynomials, and summations; 3.2.1 Comparing Growth Rates.  
> **Domain Focus:** A workshop with `n` rectangular cards; area checks, sorted cards, card pairs and triples, and possible display layouts.  
> **User Prompt:** Reexplain [`Section 3.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: One Workshop, Seven Workloads](#background)
   - [1. The card workshop and input size](#background-cards)
   - [2. What is a growth function?](#background-growth)
2. [Part 1: The Constant and Logarithm Functions](#part-1)
   - [1. The Constant Function](#part-1-constant)
   - [2. The Logarithm Function](#part-1-logarithm)
   - [3. Logarithm rules](#part-1-log-rules)
3. [Part 2: The Linear and N-Log-N Functions](#part-2)
   - [1. The Linear Function](#part-2-linear)
   - [2. The N-Log-N Function](#part-2-nlogn)
4. [Part 3: The Quadratic Function and a Staircase of Rectangles](#part-3)
   - [1. The Quadratic Function](#part-3-quadratic)
   - [2. Nested loops and the triangular sum](#part-3-triangle)
5. [Part 4: The Cubic Function, Polynomials, and Summations](#part-4)
   - [1. The Cubic Function](#part-4-cubic)
   - [2. Polynomials](#part-4-polynomials)
   - [3. Summations](#part-4-summations)
6. [Part 5: The Exponential Function and Geometric Sums](#part-5)
   - [1. The Exponential Function](#part-5-exponential)
   - [2. Exponent rules](#part-5-exponent-rules)
   - [3. Geometric sums](#part-5-geometric)
7. [Part 6: 3.2.1 Comparing Growth Rates](#part-6)
   - [1. Compare all seven functions](#part-6-comparison)
   - [2. Read the book's growth chart](#part-6-chart)
   - [3. The Ceiling and Floor Functions](#part-6-rounding)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Workshop, Seven Workloads

<span id="background-cards"></span>

### 1. The card workshop and input size

Continue the rectangular-card workshop from [Section 3.1](03-01-experimental-studies.md). A card's **area is width × height**. Our small examples use these cards, measured in centimetres:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The workshop can also have cards with other dimensions. In every example below, **`n` is the number of physical cards in the input**. Two cards with the same dimensions still count as two cards. Their areas are measured in cm²; `n` and the number of algorithm steps are counts without area units.

Different tasks on the same `n` cards can require very different amounts of work. We might measure one card, scan all cards, sort by area, compare card pairs, try three-card arrangements, or consider every subset for a display board. These tasks give the seven growth patterns in this section.

<span id="background-growth"></span>

### 2. What is a growth function?

Section 3.1 used a function `f(n)` to describe how a count of basic operations changes with input size. Section 3.2 introduces seven **simple reference functions** for recognizing common patterns. The book uses them for nearly all its analysis and places extra mathematical facts in Appendix B. The functions describe shapes of growth; they are not automatically exact millisecond measurements or exact counts for every program.

| If the workshop task... | A useful first question is... |
| :--- | :--- |
| Touches one known card | Does the work stay fixed as more cards arrive? |
| Repeatedly halves a candidate range | How many halvings reduce `n` choices to one? |
| Processes each card | How many steps are repeated `n` times? |
| Compares combinations of cards | How many pairs, triples, or subsets are possible? |

We will connect each function to a concrete card task, then compare their values for the **same** `n`.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: The Constant and Logarithm Functions

<span id="part-1-constant"></span>

### 1. The Constant Function

A **constant function** has the form `f(n) = c`, where `c` is a fixed number. The book uses `f(n) = 1` as the standard representative. Multiplying that function by a fixed `c` gives any other constant function.

Suppose the first card is already in memory and we know its index. Calculating **that one card's area** takes one width lookup, one height lookup, and one multiplication, regardless of whether the list contains 3 cards or 3,000:

```python
def first_card_area(cards):
    width, height = cards[0]
    return width * height


print(first_card_area([(2, 3), (4, 2), (4, 4)]))  # 6 (area in cm²)
```

This example assumes a nonempty list and direct access to index `0`. If we had to **search** for a card first, that search would add work. A basic assignment, arithmetic operation, or comparison is also treated as constant work in the book's primitive-operation model.

<span id="part-1-logarithm"></span>

### 2. The Logarithm Function

The **logarithm** reverses an exponent. For a base `b > 1`, `log_b n = x` means exactly that `b^x = n`. In this book, a bare `log n` means **`log₂ n`**:

```text
2³ = 8, so log₂ 8 = 3.
2⁰ = 1, so log₂ 1 = 0.
```

Imagine that the cards are **already sorted by area**. To find the first card whose area is at least 16 cm² in this sorted lineup, we can inspect a middle card and keep only the relevant half of the remaining range. Halving 12 candidates until at most one remains looks like this:

| Halving round | Candidates still possible |
| ---: | ---: |
| Start | 12 |
| 1 | 6 |
| 2 | 3 |
| 3 | 1.5 in the arithmetic model; at most 2 whole candidates |
| 4 | 0.75 in the arithmetic model; at most 1 whole candidate |

The idealized division count is `⌈log₂ 12⌉ = 4`, because `2³ = 8 < 12 ≤ 16 = 2⁴`. A real search handles whole cards and may need a final comparison; the exact comparison count depends on its code. The key pattern is that **each step shrinks the remaining range by a fixed factor**. Sorting the cards first would have its own cost, and sorting changes the answer to Section 3.1's question about the first card in the *original* order.

For any base `b > 1`, `⌈log_b n⌉` is the number of idealized divisions by `b` needed to bring a positive integer `n` down to at most 1. A calculator's `LOG` key usually uses base 10; the base-2 convention here comes from repeated halving and binary representation.

<span id="part-1-log-rules"></span>

### 3. Logarithm rules

Proposition 3.1 gives five rules. For positive `x`, `y`, and `c`, and bases `b,d > 1`, they let us rewrite logarithms without changing their value:

| Rule | Formula | Small check |
| :--- | :--- | :--- |
| Product | `log_b(xy) = log_b x + log_b y` | `log₂(4 × 8) = 5 = 2 + 3` |
| Quotient | `log_b(x/y) = log_b x − log_b y` | `log₂(32/4) = 3 = 5 − 2` |
| Power | `log_b(x^c) = c log_b x` | `log₂(4³) = 6 = 3 × 2` |
| Change of base | `log_b x = (log_d x)/(log_d b)` | `log₄ 16 = 4/2 = 2`, using base 2 on the right |
| Exchange | `b^(log_d x) = x^(log_d b)` | `4^(log₂ 8) = 4³ = 8² = 8^(log₂ 4)` |

The product rule explains why doubling a quantity adds **one** to its base-2 logarithm: `log₂(2n) = 1 + log₂ n`. Likewise, halving subtracts one: `log₂(n/2) = log₂ n − 1`.

The logarithm and exponent undo each other: `log₂(2^n) = n`, and `2^(log₂ n) = n` for `n > 0`. The change-of-base rule also lets a base-10 calculator find `log₂ n` as `LOG(n)/LOG(2)`.

The notation matters. `log(n²)` means **take the logarithm after squaring `n`**, while `log² n` means **square the logarithm**. At `n = 8`, these are `log₂(8²) = 6` and `(log₂ 8)² = 9`. They are different functions.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: The Linear and N-Log-N Functions

<span id="part-2-linear"></span>

### 1. The Linear Function

The **linear function** is `f(n) = n`. It appears when a task performs a fixed amount of work for each of `n` items. For example, finding the **total area of all cards** requires reading every card:

```python
def total_area(cards):
    total = 0
    for width, height in cards:
        total += width * height
    return total


print(total_area([(2, 3), (4, 2), (4, 4)]))  # 30 (area in cm²)
```

The three card areas are `6 + 8 + 16 = 30 cm²`. With `n` cards, the loop has `n` passes, each doing one multiplication and one addition, plus other fixed work. Section 3.1's unsorted search for the first large card also has a **worst case of `n` card checks**. If a task must read all `n` input cards, even getting those cards into the computation already requires work that grows with `n`.

<span id="part-2-nlogn"></span>

### 2. The N-Log-N Function

The **n-log-n function** is `f(n) = n log₂ n`. Picture sorting cards of **arbitrary dimensions** by area with a merge-based method: split the cards into halves, sort the halves, then merge them. For `n = 8`, there are `log₂ 8 = 3` merge levels, and each level places all 8 cards into merged lists. That gives `8 × 3 = 24` card placements across the merge levels. The exact number of area comparisons can vary.

```text
8 cards
├─ 4 + 4
├─ 2 + 2 + 2 + 2
└─ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1

Merging back up: 3 levels × 8 card placements per level = 24.
```

The book uses sorting as a major example of this growth pattern. The lower-bound claim applies to **general comparison sorting of arbitrary values**. Our tiny `A`, `B`, `C` table has only three known area values, so a method designed specifically for those three types could behave differently. Also, if cards are already sorted, the logarithmic search above does not need to pay the sorting cost again.

For `n > 1`, `n log₂ n` grows faster than `n` but, eventually, slower than `n²`. At `n = 1`, its value is `0`; that is a reference function value, **not** a claim that a real one-card sorting program takes zero steps.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: The Quadratic Function and a Staircase of Rectangles

<span id="part-3-quadratic"></span>

### 1. The Quadratic Function

The **quadratic function** is `f(n) = n² = n × n`. Suppose we compare **every card with every card**, including each card with itself, to ask whether one rectangle could fit inside another. The outer loop chooses one of `n` cards; the inner loop chooses one of `n` cards. That makes exactly `n²` ordered pair visits in this simple model:

```python
def ordered_pair_count(cards):
    count = 0
    for first in cards:
        for second in cards:
            count += 1
    return count


print(ordered_pair_count([(2, 3), (4, 2), (4, 4)]))  # 9 pairs
```

This code counts pair visits; it does not yet test whether the rectangles fit. The count is `3² = 9` for three cards and `4² = 16` for four cards. Two loops do not *always* imply `n²`; what matters here is that **each loop runs `n` times**.

<span id="part-3-triangle"></span>

### 2. Nested loops and the triangular sum

Some nested loops do less than `n` inner steps on early outer passes. Imagine the `n` input cards cut as unit-width rectangular strips on the display board. Card 1 is 1 cm high, card 2 is 2 cm high, and so on. Their areas, in cm², are `1, 2, ..., n`. Rotated onto the page, the staircase looks like this:

```text
#
##
###
####       n = 4 strips; total = 1 + 2 + 3 + 4 = 10 unit squares
```

An algorithm that places one unit square at a time follows the same count:

```python
def staircase_tile_count(n):
    count = 0
    for row in range(1, n + 1):
        for column in range(row):
            count += 1
    return count


print(staircase_tile_count(4))  # 10
```

The column variable only tracks the inner loop. The **area of the drawn staircase** is a geometry picture for the **number of loop iterations**; area and runtime are not the same physical quantity.

Proposition 3.3 gives the exact sum:

```text
1 + 2 + ... + n = n(n + 1)/2 = n²/2 + n/2.
```

Figure 3.3 in the book explains this with the areas of unit-width rectangles. For even `n`, pair the shortest and tallest strips, then the next shortest and next tallest. At `n = 4`, the pairs have heights `1 + 4 = 5` and `2 + 3 = 5`, making a `2 cm × 5 cm` rectangle of area `10 cm²`. Another picture treats the staircase as a large triangular area `n²/2` plus `n` small half-unit triangles, adding `n/2`.

The triangular count is a little more than half of `n²`, but it still has a **quadratic growth pattern** as `n` increases. The formula is exact for the staircase; the growth label summarizes its shape.

For `n = 100`, the formula gives `100 × 101 ÷ 2 = 5,050`, the sum in the book's story about young Carl Gauss.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: The Cubic Function, Polynomials, and Summations

<span id="part-4-cubic"></span>

### 1. The Cubic Function

The **cubic function** is `f(n) = n³ = n × n × n`. Suppose a layout tester tries every ordered triple of indices into the `n` cards. Each index has `n` possibilities, so the tester visits `n³` triples. A triple with a repeated index can be rejected as an invalid physical layout after it is visited:

```text
n index choices for left × n for centre × n for right = n³ trials.
```

For `n = 4`, that is `4³ = 64` trials. Three nested loops over all card indices would visit each trial once. If we enumerate only triples with three distinct physical cards, the exact count becomes `n(n − 1)(n − 2)` for `n ≥ 3`; it still has a cubic growth pattern. The all-triples version makes the `n³` count especially easy to see.

<span id="part-4-polynomials"></span>

### 2. Polynomials

A **polynomial** combines fixed multiples of powers of `n`:

```text
f(n) = a₀ + a₁n + a₂n² + ... + a_dn^d, with a_d ≠ 0.
```

The numbers `a₀, a₁, ..., a_d` are **coefficients**. The highest power with a nonzero coefficient, `d`, is the **degree**. Constant (`1`), linear (`n`), quadratic (`n²`), and cubic (`n³`) functions are all polynomials of degrees 0, 1, 2, and 3.

For a made-up operation count in the card workshop, imagine 3 setup steps, 2 steps per card, and 1 step for every ordered card pair:

```text
f(n) = 3 + 2n + n².
f(4) = 3 + 2(4) + 4² = 27 selected steps.
```

This is a **degree-2 polynomial**, even though it also contains constant and linear terms. It illustrates a count model; it does not claim an actual Python program always performs exactly 27 machine instructions.

<span id="part-4-summations"></span>

### 3. Summations

The **summation sign** `Σ` is shorthand for adding a sequence of terms. If `a` and `b` are integers with `a ≤ b`, then:

```text
Σ_{i=a}^b f(i) = f(a) + f(a+1) + ... + f(b).
Σ_{i=1}^4 i    = 1 + 2 + 3 + 4 = 10.
```

The staircase formula can therefore be written `Σ_{i=1}^n i = n(n+1)/2`. The polynomial above can be written `Σ_{i=0}^2 a_i n^i` with `a₀ = 3`, `a₁ = 2`, and `a₂ = 1`. Summations are useful because a loop's work is often a sum of its work on each pass.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: The Exponential Function and Geometric Sums

<span id="part-5-exponential"></span>

### 1. The Exponential Function

An **exponential function** has the form `f(n) = a^n`, where the base `a > 1` is fixed and `n` is the exponent. The book most often uses `a = 2`.

Suppose each of the `n` **physical cards** can be either included on the display board or left out. Every card doubles the number of possible subsets. With `A`, `B`, and `C`, the choices are:

```text
∅, A, B, C, AB, AC, BC, ABC     → 2³ = 8 subsets.
```

The empty display is included. With 4 cards there are `2⁴ = 16` subsets; with 10 cards there are `2¹⁰ = 1,024`. Enumerating all subsets must at least visit each one, so the number of visits has this exponential pattern. If we also calculate each subset's total area from scratch, **additional work** is required; `2^n` here counts the subsets themselves.

With zero cards, there is still one subset—the empty display—so `2⁰ = 1`.

This is the same doubling behind binary digits: `n` bits represent `2^n` different values, from `0` through `2^n − 1`.

<span id="part-5-exponent-rules"></span>

### 2. Exponent rules

Proposition 3.4 gives three rules for powers of the same positive base. They explain how repeated choices combine:

| Rule | Formula | Small check |
| :--- | :--- | :--- |
| Power of a power | `(a^p)^q = a^(pq)` | `(2²)³ = 2⁶ = 64` |
| Multiply powers | `a^p × a^q = a^(p+q)` | `2² × 2³ = 2⁵ = 32` |
| Divide powers | `a^p / a^q = a^(p−q)` | `2⁵ / 2² = 2³ = 8` |

For instance, if one group has two cards and another has three, the independent yes/no choices combine as `2² × 2³ = 2⁵ = 32` possible subsets of the five cards.

The book also extends powers beyond positive whole-number exponents. A fractional exponent can mean a root: a square with area `16 cm²` has side length `16^(1/2) = 4 cm`. A negative exponent means a reciprocal, such as `2^(−3) = 1/8`. Real exponents can be defined by approximating them with fractions. These extensions help with algebra, even though a card count `n` itself is a nonnegative integer.

<span id="part-5-geometric"></span>

### 3. Geometric sums

If each stage has a fixed multiple of the previous stage's work, we add a **geometric sequence**. Proposition 3.5 says that for `a > 0`, `a ≠ 1`, and integer `m ≥ 0`:

```text
1 + a + a² + ... + a^m = (a^(m+1) − 1)/(a − 1).
```

Imagine cutting the `n` input cards into 1-cm-high strips and laying them in rows, doubling each card's width. Four cards have widths `1, 2, 4, 8 cm`, so their total area is `1 + 2 + 4 + 8 = 15 cm²`. We can picture each strip as a row of unit-square tiles. The formula gives `(2⁴ − 1)/(2 − 1) = 15`. More generally, `n` such cards contain `1 + 2 + ... + 2^(n−1) = 2^n − 1` tiles.

The area is a picture of the sum. A program that **draws or visits every tile** does that many steps; a program that merely adds `n` stored card widths does not. The work depends on what the algorithm actually does.

The subset decision tree gives another view: level `i` contains `2^i` partial include/leave-out choices. Through level `n`, it has `1 + 2 + ... + 2^n = 2^(n+1) − 1` nodes. The leaves alone number `2^n` complete subsets. Both counts grow exponentially; the geometric formula keeps the exact totals straight.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 3.2.1 Comparing Growth Rates

<span id="part-6-comparison"></span>

### 1. Compare all seven functions

Table 3.1 in the book lists the seven reference functions in this order: **constant, logarithm, linear, n-log-n, quadratic, cubic, exponential**. For the exponential function, its base `a` is any fixed value greater than 1. This table uses `a = 2` and shows exact **function values**, not measured seconds:

| Function | Workshop model | `n = 4` | `n = 8` | `n = 16` |
| :--- | :--- | ---: | ---: | ---: |
| `1` | Area of one known card | 1 | 1 | 1 |
| `log₂ n` | Halve an already sorted candidate range | 2 | 3 | 4 |
| `n` | Inspect every card | 4 | 8 | 16 |
| `n log₂ n` | Merge-sort card records | 8 | 24 | 64 |
| `n²` | Visit every ordered card pair | 16 | 64 | 256 |
| `n³` | Visit every ordered triple of card indices | 64 | 512 | 4,096 |
| `2^n` | Visit every card subset | 16 | 256 | 65,536 |

The rows name **growth patterns**. A program can have fixed setup costs or several kinds of work, so its exact operation count may be a combination such as `3 + 2n + n²`. At small `n`, numerical rankings can cross: `2⁸ = 256` is less than `8³ = 512`, but `2¹⁶ = 65,536` exceeds `16³ = 4,096`. The ordering is about how functions grow as `n` becomes large, not a promise that every row is larger than the one above it at every small input.

The book favors constant or logarithmic time for individual data-structure operations and linear or n-log-n time for algorithms that process many items. Quadratic and cubic work becomes costly sooner; exponential work grows especially quickly. This is a guide to scaling, not a substitute for measuring a particular implementation when exact performance matters.

<span id="part-6-chart"></span>

### 2. Read the book's growth chart

Figure 3.4 plots the seven functions with **logarithmic scales on both axes** and uses base 2 for the exponential curve. Equal spacing on a logarithmic axis represents equal multiplication factors, which lets the chart show values that differ by many powers of ten. The exponential curve eventually rises beyond what the chart can display.

When reading the figure, focus on how each curve changes as `n` grows. The chart compares mathematical functions, not timings from the rectangle-card program. A different constant cost per operation can shift measured times without changing the function's basic growth pattern.

<span id="part-6-rounding"></span>

### 3. The Ceiling and Floor Functions

An operation count is a whole number, while `log₂ n` need not be. The section ends by defining two ways to round a real number `x` to an integer:

| Function | Meaning | At `x = 3.6` |
| :--- | :--- | ---: |
| `⌊x⌋` (floor) | Greatest integer at most `x` | 3 |
| `⌈x⌉` (ceiling) | Smallest integer at least `x` | 4 |

For 12 cards, `log₂ 12` lies between 3 and 4. Thus `⌊log₂ 12⌋ = 3`, while `⌈log₂ 12⌉ = 4`: four idealized halvings are enough to reduce 12 candidates to at most one. For `n = 1`, `log₂ 1 = 0`; a real algorithm can still have setup or final-check work. `log₂ 0` is undefined, so handle an empty list separately. The reference function and the exact operation count are different things.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: One card or every card?</strong></summary>

**Scenario:** The workshop has `n = 8` cards. We want either the area of the known first card or the total area of all cards.

**Check:** `first_card_area` visits one card. `total_area` visits eight. At `n = 16`, the first task still visits one card, while the total-area task visits sixteen.

**Lesson:** The geometry formula is the same multiplication, but **how many cards need it** determines whether this part of the work is constant or linear.

</details>

<details>
<summary><strong>Case Study 2: Why must the logarithmic search start with sorted cards?</strong></summary>

**Scenario:** We want the first area of at least 16 cm² among 12 cards, and hope to discard half the list after each check.

**Problem:** In an arbitrary order, a large card may be in either half. Discarding half could lose the answer. Sorting by area also changes which card is first in the original lineup.

**Fix:** Use halving only for the new task on an **already sorted** area list. Its 12 candidates shrink in about four halving rounds; any sorting cost is separate. For the first qualifying card in original order, scan the original list.

</details>

<details>
<summary><strong>Case Study 3: Why does a staircase still count as quadratic?</strong></summary>

**Scenario:** Four unit-width strips have heights 1, 2, 3, and 4 cm. Their total area is `10 cm²`, not `4² = 16 cm²`.

**Check:** Pair heights `1 + 4 = 5` and `2 + 3 = 5`; the two pairs make a `2 cm × 5 cm` rectangle. For general `n`, the exact count is `n(n+1)/2 = n²/2 + n/2`.

**Result:** The leading squared term makes the staircase's loop count quadratic even though it does fewer steps than a full `n × n` grid.

</details>

<details>
<summary><strong>Case Study 4: What does sorting eight cards add?</strong></summary>

**Scenario:** A merge-based sort orders eight arbitrary card areas before repeated queries for the smallest area that meets a threshold.

**Check:** Three merge levels handle eight card records each, giving 24 placements in this model. A single unsorted scan handles at most eight cards; after the sort, each query on the sorted list can halve the candidate range.

**Lesson:** Include preparation work when comparing full solutions. The repeated queries may justify sorting once, but one query does not get a free sorted list. Sorting does not answer the different question of which qualifying card came first in the original order.

</details>

<details>
<summary><strong>Case Study 5: Three positions or any subset?</strong></summary>

**Scenario:** Four physical cards supply indices for three ordered trial positions, or each card can independently be included or excluded.

**Check:** The first task has `4³ = 64` index triples, including some that repeat a card and can later be rejected. The second has `2⁴ = 16` subsets. At `n = 8`, `n³ = 512` exceeds `2^n = 256`; at `n = 16`, `2^n = 65,536` exceeds `n³ = 4,096`.

**Lesson:** The base and exponent matter. `n³` and `2^n` are different growth patterns, and a small input may hide their eventual ordering.

</details>

<details>
<summary><strong>Case Study 6: How many tiles are in four doubling rows?</strong></summary>

**Scenario:** Four 1-cm-high rectangular cards have widths 1, 2, 4, and 8 cm. Each can be viewed as a row of unit-square tiles.

**Check:** Total area is `1 + 2 + 4 + 8 = 15 cm²`. The geometric-sum rule gives `2⁴ − 1 = 15` tiles. A fifth row would add 16 tiles, making `31 cm²` total.

**Lesson:** A doubling process creates an exponential number of tiles, and the geometric sum gives the exact accumulated total. Drawing every tile would require visiting them all; calculating the total from the formula need not.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 3.2 function | Plain-language pattern | Connected geometry task |
| :--- | :--- | :--- |
| **Constant: `1`** | Work stays fixed as `n` grows. | Measure one known card. |
| **Logarithmic: `log₂ n`** | Repeatedly reduce the candidate range by a fixed factor. | Search an already sorted list of card areas. |
| **Linear: `n`** | Do fixed work for each card. | Add the areas of all cards. |
| **N-log-n: `n log₂ n`** | Handle all cards at each of about `log₂ n` levels. | Merge-sort arbitrary card areas. |
| **Quadratic: `n²`** | Visit all ordered card pairs. | Compare every card with every card. |
| **Cubic: `n³`** | Visit three independent index choices. | Test all ordered triples of card indices. |
| **Exponential: `a^n`, usually `2^n`** | Each card adds a fixed number of choices. | Include or exclude each card from a display. |

The section also supplies **logarithm rules, exponent rules, polynomials, summation notation, geometric sums, and floor/ceiling** to calculate and compare these functions. The staircase identity `1 + ... + n = n(n+1)/2` and the doubling identity `1 + 2 + ... + 2^(n−1) = 2^n − 1` are two especially useful geometry pictures for their growth patterns.

[🔝 Back to Top](#top)
