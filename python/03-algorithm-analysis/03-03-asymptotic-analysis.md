<span id="top"></span>

# 3.3 Asymptotic Analysis — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 3, Section 3.3, printed pages 123–136 (the supplied PDF).  
> **Topic:** 3.3 Asymptotic Analysis; 3.3.1 The “Big-Oh” Notation; 3.3.2 Comparative Analysis; 3.3.3 Examples of Algorithm Analysis.  
> **Domain Focus:** Rectangular cards measured in centimetres; largest area, running average area, shared areas across trays, and duplicate areas.  
> **User Prompt:** Reexplain [`Section 3.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: From Card Measurements to Growth Bounds](#background)
   - [1. The connected geometry problem](#background-cards)
   - [2. What is a bound on running time?](#background-bound)
2. [Part 1: 3.3 Asymptotic Analysis and 3.3.1 The “Big-Oh” Notation](#part-1)
   - [1. Study growth rather than one clock reading](#part-1-growth)
   - [2. The formal Big-Oh definition](#part-1-definition)
   - [3. Simplify operation-count formulas](#part-1-properties)
   - [4. Use the most informative simple bound](#part-1-simplest)
   - [5. Big-Omega and Big-Theta](#part-1-omega-theta)
3. [Part 2: 3.3.2 Comparative Analysis](#part-2)
   - [1. Compare the seven growth patterns](#part-2-order)
   - [2. Time budgets and faster hardware](#part-2-budgets)
   - [3. Constants, small inputs, and exponential work](#part-2-caution)
4. [Part 3: 3.3.3 Examples of Algorithm Analysis](#part-3)
   - [1. Constant-time list operations](#part-3-constant)
   - [2. Find the largest card area](#part-3-maximum)
   - [3. Compute prefix average areas three ways](#part-3-prefix)
   - [4. Test three trays for a shared area](#part-3-disjoint)
   - [5. Test whether all card areas are unique](#part-3-unique)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: From Card Measurements to Growth Bounds

<span id="background-cards"></span>

### 1. The connected geometry problem

Continue the rectangle-card workshop from [Section 3.1](03-01-experimental-studies.md) and [Section 3.2](03-02-the-seven-functions-used-in-this-book.md). Each card's **area is width × height**. We add a fourth card, `D`, so later examples have four measurements:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 5 cm | 4 cm | 20 cm² |

For one list of cards, **`n` means the number of cards**. The ordered areas of `A, B, C, D` are `S = [6, 8, 16, 20]`. We will find the largest area, calculate the average after each new card, and test whether two cards have equal areas. In the three-tray problem, each tray has `n` card areas, so the total input has `3n` values; this constant multiple does not change the growth comparisons.

These four cards are sample data. For larger `n`, the workshop can add cards with new dimensions and distinct areas. We follow the chapter's primitive-operation model, treating each area calculation and comparison as a fixed amount of work. Our `O`, `Ω`, and `Θ` statements concern the **number of algorithm steps as `n` grows**. Areas have units of cm²; step counts and input sizes do not.

<span id="background-bound"></span>

### 2. What is a bound on running time?

Section 3.1 timed particular runs. Section 3.2 named seven common growth functions. Now we ask whether a function such as `n`, `n²`, or `2^n` can **bound** an algorithm's work for every sufficiently large input size.

| Question | Card-workshop interpretation |
| :--- | :--- |
| What is the input size? | How many card records must be processed? |
| What work is counted? | Area calculations, comparisons, list accesses, and other basic steps. |
| Does input order matter? | It can affect some early exits or updates. |
| Which case is usually reported? | The **worst case** for each `n`, unless stated otherwise. |

The book mainly uses **worst-case running time**. A bound stated for worst-case work covers the easier inputs of that size too. We will say explicitly when we discuss an average over random input orders instead.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 3.3 Asymptotic Analysis and 3.3.1 The “Big-Oh” Notation

<span id="part-1-growth"></span>

### 1. Study growth rather than one clock reading

**Asymptotic analysis** studies how work changes as `n` becomes large. It sets aside machine-specific timing and fixed multipliers so that the main growth pattern is visible. A short Python instruction may cause several primitive operations, but a fixed number of steps per card still gives a count of the form `a + bn`, for constants `a` and `b`.

The book opens with a function that finds the maximum value in a list. In our workshop, the same scan finds the **largest card area**:

```python
def largest_card_area(cards):
    if not cards:
        raise ValueError("at least one card is required")

    width, height = cards[0]
    largest = width * height
    for width, height in cards:
        area = width * height
        if area > largest:
            largest = area
    return largest


cards = [(2, 3), (4, 2), (4, 4), (5, 4)]
print(largest_card_area(cards))  # 20 (area in cm²)
```

The initialization takes fixed work. The loop visits **all `n` cards**, making one area calculation and one comparison per card, with a possible assignment. Thus its work is at most `a + bn` for suitable fixed constants. This is the geometric version of the book's `find_max` example and Proposition 3.7.

<span id="part-1-definition"></span>

### 2. The formal Big-Oh definition

Let `T(n)` be a nonnegative work function and `g(n)` a positive reference function for sufficiently large `n`. We say **`T(n)` is `O(g(n))`** when there are constants `c > 0` and an integer `n₀ ≥ 1` such that:

```text
T(n) ≤ c · g(n)    for every integer n ≥ n₀.
```

Read `O(g(n))` as an **eventual upper bound up to a fixed multiplier**. The multiplier `c` and starting size `n₀` do not change with `n`. Figure 3.5 in the book pictures `T(n)` below the curve `c · g(n)` from `n₀` onward; what happens at smaller sizes does not defeat the bound.

Example 3.6 uses the function `T(n) = 8n + 5`. Think of it as an **illustrative** count for a card scan, not an exact count of the Python function above. To prove it is `O(n)`, choose `g(n) = n`:

```text
8n + 5 ≤ 9n  whenever n ≥ 5.
```

So `c = 9` and `n₀ = 5` work. Another valid choice is `c = 13` and `n₀ = 1`, because `8n + 5 ≤ 13n` whenever `n ≥ 1`. The constants are **witnesses for a bound**, not measured times. Many pairs of witnesses can prove the same Big-Oh statement.

The book prefers the wording “`T(n)` **is** `O(n)`.” Mathematically, `O(n)` is a collection of functions, so `T(n) ∈ O(n)` is also valid. Avoid reading `O(n)` as an exact time, or as a statement that every run takes precisely `n` steps.

<span id="part-1-properties"></span>

### 3. Simplify operation-count formulas

For `n ≥ 1`, lower powers satisfy `1 ≤ n ≤ n² ≤ n³ ≤ ...`. That makes it easy to bound a **polynomial** by its highest-degree term. The book's Example 3.8 is:

```text
5n⁴ + 3n³ + 2n² + 4n + 1 ≤ (5 + 3 + 2 + 4 + 1)n⁴ = 15n⁴.
```

Thus it is `O(n⁴)` with `c = 15` and `n₀ = 1`. Proposition 3.9 generalizes this: a degree-`d` polynomial with positive leading coefficient is `O(n^d)`. Taking the sum of the **absolute values** of its coefficients supplies one valid multiplier, even when some lower coefficients are negative.

The same idea handles our card-pair work model from Section 3.2. If `T(n) = 3 + 2n + n²`, then for `n ≥ 1`:

```text
3 + 2n + n² ≤ 3n² + 2n² + n² = 6n².
```

So this illustrative count is `O(n²)`. It does **not** mean that computing one card's area takes `n²` steps; the model also includes work on every ordered pair of cards.

The book gives further examples using `log n = log₂ n` and `log n ≤ n` for `n ≥ 1`:

| Function in the book | Simple Big-Oh bound | Why it works |
| :--- | :--- | :--- |
| `5n² + 3n log n + 2n + 5` | `O(n²)` | Every displayed term is at most its coefficient times `n²` when `n ≥ 1`; their coefficients sum to 15. |
| `20n³ + 10n log n + 5` | `O(n³)` | `n log n ≤ n² ≤ n³`; coefficients sum to 35. |
| `3 log n + 2` | `O(log n)` | For `n ≥ 2`, `log n ≥ 1`, so `3 log n + 2 ≤ 5 log n`. |
| `2^(n+2)` | `O(2^n)` | `2^(n+2) = 4 · 2^n`. |
| `2n + 100 log n` | `O(n)` | `log n ≤ n`, so the sum is at most `102n`. |

The `3 log n + 2` row needs `n₀ = 2`: at `n = 1`, `log₂ 1 = 0`, and no positive multiplier of `log₂ 1` can cover the extra `2`. This is why the definition allows a starting size.

<span id="part-1-simplest"></span>

### 4. Use the most informative simple bound

Big-Oh is an **upper** bound, so a loose statement can still be true. For example, `4n³ + 3n²` is `O(n⁵)`, `O(n⁴)`, and `O(n³)`. The useful simple description is **`O(n³)`**, because it matches the leading growth term. We normally leave fixed multipliers and lower-order terms out of the notation.

The same caution applies to algorithms: a function with a constant number of steps is also `O(n)` and `O(n²)`, but `O(1)` tells the reader more. An `O(n²)` upper bound alone does not prove that the function actually needs quadratic work.

<span id="part-1-omega-theta"></span>

### 5. Big-Omega and Big-Theta

**Big-Omega**, written `Ω(g(n))`, gives an eventual **lower bound**: there are `c > 0` and `n₀ ≥ 1` with `T(n) ≥ c · g(n)` for every `n ≥ n₀`. **Big-Theta**, written `Θ(g(n))`, means both an upper and a lower bound of that shape hold:

```text
c₁ · g(n) ≤ T(n) ≤ c₂ · g(n)    for all n ≥ n₀,
where c₁ and c₂ are positive constants.
```

For the illustrative card-scan count `T(n) = 8n + 5`, we already found the upper bound `T(n) ≤ 9n` for `n ≥ 5`. We also have `T(n) ≥ 8n` for every `n ≥ 1`. Together, these show **`T(n)` is `Θ(n)`**. For our actual unsorted largest-area task, a scan must inspect every card to know which is largest, so its worst-case work is also both `O(n)` and `Ω(n)` under this model.

The book's examples show the same reasoning with `n log n`:

| Statement | Simple witness when `n ≥ 2` |
| :--- | :--- |
| `3n log n − 2n` is `Ω(n log n)` | It is at least `1 · n log n` because `log n ≥ 1`. |
| `3n log n + 4n + 5 log n` is `Θ(n log n)` | It lies between `3n log n` and `12n log n`. |

> **Mental model:** `O` gives a ceiling, `Ω` gives a floor, and `Θ` pins growth between two constant multiples of the same reference function.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 3.3.2 Comparative Analysis

<span id="part-2-order"></span>

### 1. Compare the seven growth patterns

The seven functions from Section 3.2 appear in increasing **eventual growth** order:

```text
1,  log n,  n,  n log n,  n²,  n³,  2^n.
```

Table 3.2 in the book gives values at several sizes for the six nonconstant functions. Here are three of those sizes, with the constant function `1` added for completeness:

| Reference function | `n = 8` | `n = 16` | `n = 32` |
| :--- | ---: | ---: | ---: |
| `1` | 1 | 1 | 1 |
| `log₂ n` | 3 | 4 | 5 |
| `n` | 8 | 16 | 32 |
| `n log₂ n` | 24 | 64 | 160 |
| `n²` | 64 | 256 | 1,024 |
| `n³` | 512 | 4,096 | 32,768 |
| `2^n` | 256 | 65,536 | 4,294,967,296 |

Notice that `2⁸ = 256` is **less** than `8³ = 512`. The ordering concerns growth as `n` becomes large, not a strict row-by-row ranking at every small `n`.

To compare two algorithms that solve **the same card problem**, we need informative bounds. For instance, the rolling-total prefix-average method below has tight growth `Θ(n)`, while either repeated-sum method has tight growth `Θ(n²)`, so the rolling-total method eventually uses less work. Merely knowing that one method is `O(n)` and another is `O(n²)` would not prove the second actually grows quadratically; its `O(n²)` bound might be loose.

<span id="part-2-budgets"></span>

### 2. Time budgets and faster hardware

Table 3.3 asks how large an input fits within a time budget under **illustrative time formulas in microseconds (µs)**. These formulas are not timings of our Python card program. One second is `1,000,000 µs`:

| Illustrative time formula | Max `n` in 1 second | Max `n` in 1 minute | Max `n` in 1 hour |
| :--- | ---: | ---: | ---: |
| `400n µs` | 2,500 | 150,000 | 9,000,000 |
| `2n² µs` | 707 | 5,477 | 42,426 |
| `2^n µs` | 19 | 25 | 31 |

For the first column, `400n ≤ 1,000,000` gives `n ≤ 2,500`; `2n² ≤ 1,000,000` gives `n ≤ ⌊√500,000⌋ = 707`; and `2^n ≤ 1,000,000` gives `n ≤ 19`. In our geometry story, the exponential formula can model visiting every include-or-exclude card layout.

Table 3.4 then imagines a computer **256 times faster** with the same fixed time budget. Its scaling comparison assumes that size `m` exactly used the old budget and ignores rounding to whole input sizes:

| Work pattern | Old size | New size under the idealized model | Why |
| :--- | ---: | ---: | :--- |
| Linear | `m` | `256m` | 256 times as many single-card steps fit. |
| Quadratic | `m` | `16m` | `(16m)² = 256m²`. |
| Exponential, base 2 | `m` | `m + 8` | `2^(m+8) = 256 · 2^m`. |

Faster hardware helps, but it does not turn an exponential growth pattern into a linear one.

<span id="part-2-caution"></span>

### 3. Constants, small inputs, and exponential work

Asymptotic bounds hide **fixed multipliers**. Compare two *hypothetical exact* work formulas for the same card task: `400n` and `2n²`. At `n = 10`, the quadratic formula gives `200` steps while the linear one gives `4,000`; at `n = 1,000`, the linear one gives `400,000` while the quadratic one gives `2,000,000`. They cross at `n = 200`. A growth label alone does not tell us which implementation wins on a particular small input.

The book gives an extreme cautionary example with a linear formula multiplied by `10^100`. It also uses a chessboard story where grains of rice double from square to square. Our card subset task has the same doubling: `n` cards allow `2^n` include-or-exclude layouts. Polynomial work such as `n²` is usually more manageable than exponential work for large `n`, but **a polynomial such as `n^100` can still be impractical**. The input sizes and constants matter.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 3.3.3 Examples of Algorithm Analysis

The book now analyzes complete Python functions. We use the **card areas** as the numeric data so that the algorithms have the same geometry meaning throughout.

<span id="part-3-constant"></span>

### 1. Constant-time list operations

Before analyzing loops, the book explains two useful facts about Python lists. `len(cards)` is `O(1)` because a list stores its current length. `cards[j]` is `O(1)` for a valid integer index because list elements can be located directly by an array offset. Neither operation must scan the first `j` cards.

Other compact Python expressions can hide more work:

| Expression | Work for a list with `n` items | Why |
| :--- | :--- | :--- |
| `len(cards)` | `O(1)` | The length is stored. |
| `cards[j]` | `O(1)` | One indexed access, for valid `j`. |
| `[0.0] * n` | `O(n)` | Build and fill `n` list positions. |
| `cards[:k]` | `O(k)` | Copy `k` references into a new list. |
| `sum(areas[:k])` | `O(k)` | Copy and then visit the `k` values. |
| `sorted(areas)` | `O(n log n)` worst case | Make a sorted copy of `n` values. |

The `O(k)` row says the two tasks together are still bounded by a constant times `k`; it does **not** say slicing and summing cost only one primitive operation.

<span id="part-3-maximum"></span>

### 2. Find the largest card area

Revisit `largest_card_area` from Part 1. It initializes one best area, then visits all `n` cards. Each pass performs a fixed amount of work, including an area multiplication, a comparison, and possibly an assignment. The final return takes fixed work. Adding one fixed setup cost and `n` fixed-size passes gives **`O(n)` time**, as in the book's Proposition 3.7.

There is a subtler question: **how many times does the best-so-far value change?** If distinct card areas arrive in increasing order, the value is reassigned `n − 1` times after initialization. If every order of `n` distinct areas is equally likely, the `j`th area is the largest seen so far with probability `1/j`. Counting initialization as the first record, the expected number of records is:

```text
H_n = 1 + 1/2 + 1/3 + ... + 1/n, a harmonic sum that grows like log n.
```

For our four distinct areas, `H₄ = 1 + 1/2 + 1/3 + 1/4 = 25/12 ≈ 2.08` records, including the initial one. This is an **expected count of best-value updates**, not the total running time: the algorithm still visits all four cards, and for general `n` its total work remains linear.

<span id="part-3-prefix"></span>

### 3. Compute prefix average areas three ways

The **prefix average** at position `j` is the average of the first `j + 1` areas. With `S = [6, 8, 16, 20]` cm²:

| `j` | New card | Prefix sum | Prefix average |
| ---: | :--- | ---: | ---: |
| 0 | `A` | 6 cm² | 6 cm² |
| 1 | `B` | 14 cm² | 7 cm² |
| 2 | `C` | 30 cm² | 10 cm² |
| 3 | `D` | 50 cm² | 12.5 cm² |

In mathematical notation, `average[j] = (S[0] + ... + S[j])/(j + 1)`. The book presents three implementations. Here they are with runnable Python names and the same output:

```python
def prefix_averages1(areas):
    n = len(areas)
    averages = [0.0] * n
    for j in range(n):
        total = 0
        for i in range(j + 1):
            total += areas[i]
        averages[j] = total / (j + 1)
    return averages


def prefix_averages2(areas):
    n = len(areas)
    averages = [0.0] * n
    for j in range(n):
        averages[j] = sum(areas[:j + 1]) / (j + 1)
    return averages


def prefix_averages3(areas):
    n = len(areas)
    averages = [0.0] * n
    total = 0
    for j in range(n):
        total += areas[j]
        averages[j] = total / (j + 1)
    return averages


areas = [6, 8, 16, 20]
print(prefix_averages1(areas))  # [6.0, 7.0, 10.0, 12.5]
print(prefix_averages2(areas))  # same result
print(prefix_averages3(areas))  # same result
```

The first method recomputes a sum of length `1`, then `2`, then `3`, and so on. Its inner `total +=` statement runs **`1 + 2 + ... + n = n(n+1)/2` times**. At `n = 4`, that is 10 visits; at `n = 100`, it is 5,050. The list initialization and outer-loop work are `O(n)`, while the repeated inner work is `O(n²)`, so the whole method is `O(n²)`.

The second method looks shorter, but `areas[:j + 1]` creates a prefix copy and `sum(...)` visits that prefix. Each costs work proportional to `j + 1`. Across all `j`, the same triangular sum appears, so **the second method is also `O(n²)`**. A one-line expression is not automatically a constant-time operation.

The third method carries forward `total`. Each new card contributes its area **once**. There are `n` loop passes, each with fixed work, plus an `O(n)` output list, so **the third method is `O(n)`**. The different methods answer the same geometry question; their repeated work differs.

<span id="part-3-disjoint"></span>

### 4. Test three trays for a shared area

Suppose three trays each contain `n` cards, and **no tray repeats an area within itself**. We ask whether one area appears in **all three** trays. Equal area is the condition; cards may have different dimensions. For example, these trays have no area common to all three:

```text
Tray A:  6,  8, 12, 16  cm²
Tray B:  8, 10, 14, 18  cm²
Tray C:  5,  7,  9, 11  cm²
```

The book's first algorithm tries every triple, one area from each tray. The second checks Tray C **only when** an area from A matches one from B:

```python
def disjoint1(A, B, C):
    for a in A:
        for b in B:
            for c in C:
                if a == b == c:
                    return False
    return True


def disjoint2(A, B, C):
    for a in A:
        for b in B:
            if a == b:
                for c in C:
                    if a == c:
                        return False
    return True


tray_a = [6, 8, 12, 16]
tray_b = [8, 10, 14, 18]
tray_c = [5, 7, 9, 11]
print(disjoint1(tray_a, tray_b, tray_c))  # True: no shared area
print(disjoint2(tray_a, tray_b, tray_c))  # True: same answer
```

For `n = 4` and no common area, `disjoint1` visits **`4³ = 64` triples**. In general its worst-case work is `O(n³)`. `disjoint2` tests `n²` A/B pairs. Because areas within A and B are unique, each A area can match at most one B area, so **at most `n` pairs** trigger a scan of C. Those scans cost at most `n × n = n²` total, giving `O(n²)` worst-case work. In the displayed trays, only the pair of 8 cm² cards triggers a C scan.

The uniqueness assumption matters. If A and B each contained `n` copies of the same area and C had no match, all `n²` A/B pairs would trigger `n` C checks. The improved code would then do cubic work. The book explicitly rules out duplicates within each tray for its `O(n²)` analysis.

<span id="part-3-unique"></span>

### 5. Test whether all card areas are unique

Now consider **one** list of `n` card areas. We ask whether every area is different. A 2 cm × 3 cm card and a 1 cm × 6 cm card have different shapes but **the same area, 6 cm²**; for this task they count as a duplicate.

The first method checks each distinct pair of positions. The second sorts a copy of the areas, then checks neighboring values:

```python
def unique1(areas):
    n = len(areas)
    for j in range(n):
        for k in range(j + 1, n):
            if areas[j] == areas[k]:
                return False
    return True


def unique2(areas):
    ordered = sorted(areas)
    for j in range(1, len(ordered)):
        if ordered[j - 1] == ordered[j]:
            return False
    return True


print(unique1([6, 8, 16, 20]))  # True
print(unique2([6, 8, 16, 6]))   # False
```

With no duplicates, `unique1` checks `(n − 1) + (n − 2) + ... + 1 = n(n − 1)/2` pairs: **`O(n²)` worst-case time**. At `n = 4`, that is 6 pairs. `unique2` spends `O(n log n)` time sorting and then `O(n)` on one adjacent scan, giving **`O(n log n)` worst-case time**.

> **Printed-code correction:** Code Fragment 3.8 in the supplied PDF sorts into `temp` but compares adjacent entries of the original `S`. The working version above compares neighbors of the **sorted copy** (`ordered`); otherwise equal areas may remain apart in the original order.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How can two constants prove one Big-Oh bound?</strong></summary>

**Scenario:** An illustrative card-scan count is `T(n) = 8n + 5` steps.

**Check:** For every `n ≥ 5`, `8n + 5 ≤ 9n`, so `c = 9` and `n₀ = 5` prove `O(n)`. For every `n ≥ 1`, `8n + 5 ≤ 13n`, so `c = 13` and `n₀ = 1` also work.

**Lesson:** Big-Oh asks for **some fixed** witnesses. The witnesses are not unique, and the claim does not depend on how one small input behaves.

</details>

<details>
<summary><strong>Case Study 2: Is a staircase count only an upper bound?</strong></summary>

**Scenario:** For `n` workshop cards, make a triangular grid of area comparisons. Compare card 1 with cards 1 through `n`, card 2 with cards 2 through `n`, and so on. The grid has rows of `n, n − 1, ..., 1` comparison cells, so `T(n) = n(n+1)/2`.

**Check:** For `n ≥ 1`, `(1/2)n² ≤ T(n) ≤ n²`. The left inequality supplies `Ω(n²)`; the right supplies `O(n²)`.

**Result:** The exact count is **`Θ(n²)`**. The triangular comparison grid uses about half the cells of a full `n × n` grid, yet both grow quadratically with the number of cards.

</details>

<details>
<summary><strong>Case Study 3: Why does a built-in sum still cost time?</strong></summary>

**Scenario:** To report the average card area after every new card, a student writes `sum(areas[:j + 1])` for each prefix.

**Problem:** The slice copies `j + 1` values, and `sum` reads them. Prefix lengths 1 through 4 require `1 + 2 + 3 + 4 = 10` value visits by `sum`, plus copying.

**Fix:** Carry a running total; for four cards, add four areas once each. The two approaches return `[6.0, 7.0, 10.0, 12.5]`, but their work grows quadratically and linearly respectively.

</details>

<details>
<summary><strong>Case Study 4: What if a tray repeats the same area?</strong></summary>

**Scenario:** A and B each contain `n` copies of 6 cm², while C contains no 6 cm² card.

**Problem:** In `disjoint2`, **every one of the `n²` A/B pairs matches**, so each pair scans all `n` C values. That is `n³` C checks.

**Lesson:** The `O(n²)` proof uses the book's assumption that each tray has distinct values. If the input rules change, recheck the bound.

</details>

<details>
<summary><strong>Case Study 5: Can a loose Big-Oh label compare two methods?</strong></summary>

**Scenario:** One card-processing method has an exact work model `400n`; another has `2n²`.

**Check:** At `n = 10`, the second uses `200` model steps versus `4,000` for the first. At `n = 1,000`, it uses `2,000,000` versus `400,000`. The crossover is `n = 200`.

**Lesson:** Constants matter at practical sizes. A bare `O(n²)` upper bound does not say the second method truly needs quadratic work; use a tight count or lower bound when claiming eventual superiority.

</details>

<details>
<summary><strong>Case Study 6: Which list must the uniqueness check compare?</strong></summary>

**Scenario:** Card areas are `[6, 8, 16, 6]` cm². The equal 6 cm² values are separated in the original order.

**Problem:** Sorting creates `[6, 6, 8, 16]`. Comparing neighbors in the original list would miss the duplicate; the printed Code Fragment 3.8 makes this mistake.

**Fix:** Compare adjacent values in the **sorted copy**, as `unique2` does. It returns `False` for this list.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 3.3 idea | Meaning | Rectangle-card example |
| :--- | :--- | :--- |
| **Asymptotic analysis** | Study how work changes as input size grows. | Increase the number `n` of cards while keeping each area calculation simple. |
| **Big-Oh, `O(g(n))`** | Eventual upper bound up to a fixed multiplier. | `8n + 5` is `O(n)` because `8n + 5 ≤ 9n` for `n ≥ 5`. |
| **Big-Omega, `Ω(g(n))`** | Eventual lower bound up to a fixed multiplier. | Reading every unsorted card to find the maximum needs work that grows with `n`. |
| **Big-Theta, `Θ(g(n))`** | Matching upper and lower growth bounds. | `n(n+1)/2` card-area comparisons are `Θ(n²)`. |
| **Comparative analysis** | Compare growth and practical constants for the same task. | A rolling prefix average scales better than recomputing every prefix. |
| **Hidden list work** | One expression can copy or visit many values. | `sum(areas[:k])` costs work proportional to `k`. |
| **Prefix averages** | Reuse a sum to avoid repeated additions. | `[6, 8, 16, 20]` gives averages `[6, 7, 10, 12.5]`. |
| **Three-way disjointness** | Use input assumptions to skip unnecessary scans. | Distinct areas within each tray limit matching A/B pairs. |
| **Element uniqueness** | Sorting puts equal values together. | Check adjacent areas in a sorted copy, including two different shapes with equal area. |

**The section's progression:** define an eventual bound → simplify work formulas → compare growth with real constants in mind → analyze Python code line by line → improve algorithms by reusing results or avoiding needless comparisons.

[🔝 Back to Top](#top)
