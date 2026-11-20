<span id="top"></span>

# Algorithm Analysis — Section 3.3: Asymptotic Analysis

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 3](<../../file/Data Structures and Algorithms in Python - C03.pdf>), Section 3.3, printed pages 123–136.  
> **Topic:** Big-Oh, Big-Omega, Big-Theta, comparative analysis, and analysis of Python algorithms.  
> **Domain focus:** The **2026 Brazilian Grand Prix MotoGP Q2 session** at Goiânia on 21 March 2026.  
> **Learning goal:** Prove growth bounds with explicit constants, compare algorithms fairly, and trace the work in each of the section's algorithm examples.  
> **User Prompt:** "Reexplain [Section 3.3] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: From Q2 Results to Growth Bounds](#background-intuition)
2. [Part 1: Section 3.3.1 — Big-Oh Notation](#part-1)
   - [1. What asymptotic analysis measures](#part-1-growth)
   - [2. Formal Big-Oh definition and a proof](#part-1-definition)
   - [3. Simplify formulas](#part-1-simplify)
   - [4. Choose an informative upper bound](#part-1-informative)
   - [5. Big-Omega and Big-Theta](#part-1-omega-theta)
3. [Part 2: Section 3.3.2 — Comparative Analysis](#part-2)
   - [1. Compare growth rates for the same task](#part-2-rates)
   - [2. Solve a time-budget question](#part-2-budget)
   - [3. Faster hardware and fixed multipliers](#part-2-hardware)
   - [4. Read growth claims with care](#part-2-caution)
4. [Part 3: Section 3.3.3 — Examples of Algorithm Analysis](#part-3)
   - [1. Recognize constant-time and hidden list work](#part-3-list)
   - [2. Find a maximum](#part-3-maximum)
   - [3. Compute prefix averages three ways](#part-3-prefix)
   - [4. Test three rider lists for a common member](#part-3-disjoint)
   - [5. Test whether values are unique](#part-3-unique)
5. [Part 4: Summary](#part-4)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: From Q2 Results to Growth Bounds

[Section 3.1](03-01-experimental-studies.md) timed particular runs; [Section 3.2](03-02-the-seven-functions-used-in-this-book.md) introduced common growth patterns. Section 3.3 asks how to **prove** that an algorithm's work fits one of those patterns as its input gets larger.

The [MotoGP session report](https://www.motogp.com/en/news/2026/03/21/di-giannantonio-heads-bezzecchi-after-dramatic-first-qualifying-in-brazil/1010237) and [published Q2 timing classification](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Qualifying2.pdf) give 12 rider records for **one session**, Qualifying 2 at the 2026 Brazilian GP. We will use these first four, in official classification order:

| Q2 place | Rider | Team | Best Q2 lap | Seconds |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team | 1:17.410 | 77.410 |
| P2 | Marco Bezzecchi | Aprilia Racing | 1:17.480 | 77.480 |
| P3 | Marc Márquez | Ducati Lenovo Team | 1:17.491 | 77.491 |
| P4 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:17.561 | 77.561 |

Marc's best Q2 lap was `77.561 − 77.491 = 0.070` seconds quicker than Fabio Quartararo's. These are **rider lap times**. Below, `T(n)` counts hypothetical **computer operations**, and the book's microsecond formulas are teaching models; neither is a MotoGP timing result.

Use this shared setup for the runnable examples:

```python
DIGI = ("Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", 77.410)
BEZ = ("Marco Bezzecchi", "Aprilia Racing", 77.480)
MARC = ("Marc Márquez", "Ducati Lenovo Team", 77.491)
QUARTARARO = ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 77.561)

top_four = [DIGI, BEZ, MARC, QUARTARARO]
```

For `top_four`, **`n = 4` records**. The full published Q2 classification has `n = 12`. The chapter analyzes how a method would behave for **arbitrarily large lists of the same kind**; sizes above 12 are mathematical extensions, not claims that this Q2 session had more riders. Unless stated otherwise, a bound concerns the **worst-case input of each size `n`** under the book's constant-cost primitive-operation model. We treat one lap-value or fixed-length rider/team-label comparison as constant work; if label lengths also grow, their comparison costs need separate analysis.

**Why this example?** The one verified session keeps the rider data fixed while the computer task changes. **How to solve a growth question:** define one input item, define `n`, identify which steps repeat, and separate their count from the published lap times.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 3.3.1 — Big-Oh Notation

<span id="part-1-growth"></span>

### 1. What Asymptotic Analysis Measures

**Asymptotic analysis** studies the work needed as `n` becomes large. It keeps the growth pattern and sets aside fixed multipliers and small setup costs. Suppose a program scans a list to find its **largest best-lap time**. It must inspect every record, even if the current largest value appears early, because a later value could be larger. The code for this task appears in Part 3.

If setup costs `a` primitive steps and each of `n` records costs at most `b` more, then the work has an upper bound of the form `a + bn` for fixed `a` and `b`. Different machines may take different milliseconds per primitive step, but the repeated `n` passes are the same structural fact.

**Why this example?** Scanning the four published records makes the source of `n` visible before any formal notation. **How to solve it:** separate one-time setup from work repeated per record, then write `setup + (work per record)·n`.

<span id="part-1-definition"></span>

### 2. Formal Big-Oh Definition and a Proof

For nonnegative `T(n)` and a positive comparison function `g(n)` at sufficiently large `n`, we say **`T(n)` is `O(g(n))`** if there exist fixed constants `c > 0` and `n₀ ≥ 1` such that:

```text
T(n) ≤ c · g(n)    for every integer n ≥ n₀.
```

`c` and `n₀` are **witnesses**: give actual values and check the inequality. Figure 3.5 in the book shows `T(n)` lying below `c·g(n)` from `n₀` onward. The definition allows smaller inputs to behave differently.

Write **"`T(n)` is `O(g(n))`"** to state membership in a growth class. The book warns against reading `T(n) = O(g(n))` as an ordinary numerical equality or writing `T(n) ≤ O(g(n))` as though `O(g(n))` were a single number.

Consider the **illustrative** record-processing count `T(n) = 8n + 5`. It is a teaching formula, not a measured cost for our Python code. To prove `T(n)` is `O(n)`, choose `g(n) = n`. When `n ≥ 5`, we have `5 ≤ n`, so:

```text
8n + 5 ≤ 8n + n = 9n.
Choose c = 9 and n₀ = 5.
```

At the actual Q2 field size `n = 12`, the check is `8(12)+5 = 101 ≤ 108 = 9(12)`. At `n = 4`, `37 > 36`, which shows why this particular pair of witnesses starts at `5`. Another pair can also work: `c = 13` and `n₀ = 1`, because `8n+5 ≤ 13n` for every `n ≥ 1`.

**Why this example?** Its small constant term makes the purpose of `n₀` easy to prove rather than memorize. **How to solve it:** choose `g(n)`, rearrange the inequality, find a fixed threshold after which it always holds, and state both witnesses.

<span id="part-1-simplify"></span>

### 3. Simplify Formulas

For `n ≥ 1`, `1 ≤ n ≤ n² ≤ n³ ≤ ⋯`. This lets us replace lower polynomial powers by a suitable multiple of the highest power. The book's Example 3.8 gives:

```text
5n⁴ + 3n³ + 2n² + 4n + 1
≤ (5 + 3 + 2 + 4 + 1)n⁴
= 15n⁴                         for n ≥ 1.
```

Thus the polynomial is `O(n⁴)` with witnesses `c = 15` and `n₀ = 1`. Proposition 3.9 generalizes this: a degree-`d` polynomial with a positive leading coefficient is `O(n^d)`. For a bound that also tolerates negative lower coefficients, use the sum of the coefficients' **absolute values** as a multiplier.

For a hypothetical Q2 report with three setup steps, two steps per rider, and one step per ordered rider pair **including a rider paired with themself**, `T(n) = 3 + 2n + n²`. When `n ≥ 1`:

```text
3 + 2n + n² ≤ 3n² + 2n² + n² = 6n².
```

So this **stated operation model** is `O(n²)`. It does not claim that one rider lookup takes quadratic time. Other common simplifications in the section use `log n = log₂ n`:

| Function | Informative upper bound | Reason |
| :--- | :--- | :--- |
| `3 log n + 2` | `O(log n)`, for `n ≥ 2` | `log₂ n ≥ 1`, so the sum is at most `5 log n`. |
| `2^(n+2)` | `O(2^n)` | It equals `4·2^n`. |
| `2n + 100 log n` | `O(n)` | `log₂ n ≤ n` for `n ≥ 1`, so it is at most `102n`. |
| `5n² + 3n log n + 2n + 5` | `O(n²)` | Each term is at most its coefficient times `n²` for `n ≥ 1`. |
| `20n³ + 10n log n + 5` | `O(n³)` | For `n ≥ 1`, `n log₂ n ≤ n³` and `5 ≤ 5n³`, giving at most `35n³`. |

The first row cannot use `n₀ = 1` with `g(n) = log₂ n`, because `log₂ 1 = 0` cannot cover the added `2`.

**Why these examples?** The pair-work model ties the polynomial to Q2 records; the other formulas expose fixed factors, lower-order terms, and a needed threshold. **How to solve one:** choose the proposed dominant function, bound every other term by a fixed multiple of it for large enough `n`, then add the multipliers.

<span id="part-1-informative"></span>

### 4. Choose an Informative Upper Bound

Big-Oh gives an **upper** bound, so loose claims can be true. For `T(n) = 4n³ + 3n²`, all of `O(n⁵)`, `O(n⁴)`, and `O(n³)` are valid. The simplest **informative** choice among those is `O(n³)`: it follows the leading term. Likewise, a known-position list access can be called `O(n²)`, but `O(1)` better describes it.

An `O(n²)` claim **alone** does not prove an algorithm actually needs quadratic work. It might also be `O(n)`. That matters when comparing two implementations; we will use tight bounds or explicit formulas for that purpose.

**Why this example?** It separates "a bound is valid" from "a bound tells us the useful growth shape." **How to solve it:** prove an upper bound, try a smaller familiar function, and avoid treating the first loose bound as exact.

<span id="part-1-omega-theta"></span>

### 5. Big-Omega and Big-Theta

**Big-Omega**, `Ω(g(n))`, is an eventual **lower bound**: for fixed `c > 0` and `n₀`, `T(n) ≥ c·g(n)` whenever `n ≥ n₀`. **Big-Theta**, `Θ(g(n))`, gives both an upper and a lower bound of the same shape:

```text
c₁·g(n) ≤ T(n) ≤ c₂·g(n)    for all n ≥ n₀,
where c₁ and c₂ are fixed positive constants.
```

For our illustrative `T(n) = 8n + 5`, `T(n) ≥ 8n` for `n ≥ 1` and `T(n) ≤ 9n` for `n ≥ 5`. Using `c₁ = 8`, `c₂ = 9`, and `n₀ = 5` proves **`T(n)` is `Θ(n)`**. The lower and upper witnesses need not have the same value.

A concrete quadratic count comes from checking **every pair of distinct rider positions** when no duplicate is found: `T(n) = n(n−1)/2` equality checks. For `n ≥ 2`, `n−1 ≥ n/2`, so:

```text
n²/4 ≤ n(n−1)/2 ≤ n²/2.
```

Thus this no-early-exit count is `Θ(n²)`. At `n = 12`, it is `12·11/2 = 66` comparisons. If an algorithm exits when it finds a duplicate, an **easy input** can take fewer comparisons; the `Θ(n²)` statement applies to the worst case or to the all-distinct input.

The book's Examples 3.15 and 3.16 show the same proof method when logarithms appear. For `n ≥ 2`, `log₂ n ≥ 1`, so:

```text
3n log₂ n − 2n ≥ n log₂ n
    because 2n log₂ n ≥ 2n.
```

This proves `3n log₂ n − 2n` is `Ω(n log n)` with `c = 1` and `n₀ = 2`. For `F(n) = 3n log₂ n + 4n + 5 log₂ n`, every term is nonnegative, giving `F(n) ≥ 3n log₂ n`. Also, `4n ≤ 4n log₂ n` and `5 log₂ n ≤ 5n log₂ n` for `n ≥ 2`. Therefore:

```text
3n log₂ n ≤ F(n) ≤ (3 + 4 + 5)n log₂ n = 12n log₂ n.
```

The explicit witnesses `c₁ = 3`, `c₂ = 12`, and `n₀ = 2` prove `F(n)` is `Θ(n log n)`. Here `n` could count records in an extended Q2-style dataset; these formulas are operation-count illustrations, not lap times.

**Why these examples?** The linear formula shows how two inequalities combine, while rider-pair checks show that a triangular count can still be tightly quadratic. **How to solve it:** prove one eventual inequality on each side, keep their assumptions and `n₀` clear, then combine them into `Θ` only when both apply.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 3.3.2 — Comparative Analysis

<span id="part-2-rates"></span>

### 1. Compare Growth Rates for the Same Task

The seven reference patterns from Section 3.2 have this **eventual** order:

```text
1,  log n,  n,  n log n,  n²,  n³,  2^n.
```

Table 3.2 of the book shows how their values separate as `n` grows. Here are three of its sizes, with the constant row added:

| Reference function | `n = 8` | `n = 16` | `n = 32` |
| :--- | ---: | ---: | ---: |
| `1` | 1 | 1 | 1 |
| `log₂ n` | 3 | 4 | 5 |
| `n` | 8 | 16 | 32 |
| `n log₂ n` | 24 | 64 | 160 |
| `n²` | 64 | 256 | 1,024 |
| `n³` | 512 | 4,096 | 32,768 |
| `2^n` | 256 | 65,536 | 4,294,967,296 |

At `n = 8`, `2⁸ = 256` is **less** than `8³ = 512`. The ordering describes what happens **eventually**, not a strict ranking at every small size. Only `n = 8` in this table fits within the actual 12-rider Q2 field; `16` and `32` are hypothetical larger record lists.

When comparing algorithms, make sure they solve **the same problem**. Also use **tight growth claims** or exact cost formulas: knowing only that method A is `O(n)` and method B is `O(n²)` does not prove B needs quadratic work, because B's upper bound could be loose.

**Why this example?** The early crossover between `n³` and `2^n` prevents us from reading the list of functions as a small-input scoreboard. **How to solve a comparison:** fix the task and `n`, evaluate both formulas, then check how their ratio behaves as `n` grows.

<span id="part-2-budget"></span>

### 2. Solve a Time-Budget Question

Table 3.3 uses **illustrative computer time formulas in microseconds (µs)**. They are not measured times for the Q2 program. One second is `1,000,000 µs`:

| Illustrative formula | Largest `n` in 1 second | In 1 minute | In 1 hour |
| :--- | ---: | ---: | ---: |
| `400n µs` | 2,500 | 150,000 | 9,000,000 |
| `2n² µs` | 707 | 5,477 | 42,426 |
| `2^n µs` | 19 | 25 | 31 |

For the first column, solve each inequality against `1,000,000`:

```text
400n ≤ 1,000,000   → n ≤ 2,500.
2n² ≤ 1,000,000   → n ≤ ⌊√500,000⌋ = 707.
2^n ≤ 1,000,000   → n ≤ 19, because 2^19 ≤ 1,000,000 < 2^20.
```

The exponential formula can model visiting every possible include-or-exclude subset of rider records. With the actual 12 Q2 riders, there are `2¹² = 4096` such **hypothetical subsets**. A larger `n` in the table represents a larger invented dataset, not more participants in this session.

**Why this example?** A fixed budget turns abstract growth into a concrete "how many items fit?" question. **How to solve it:** convert the budget to the formula's unit, solve for real `n`, then round **down** because `n` must be a whole number that stays within the budget.

<span id="part-2-hardware"></span>

### 3. Faster Hardware and Fixed Multipliers

Table 3.4 imagines a computer **256 times faster** for the same time budget. If an old maximum size `m` exactly used that budget, the idealized new maximum scales as follows:

| Work model | Old size | New size | Check |
| :--- | ---: | ---: | :--- |
| `400n` | `m` | `256m` | `400(256m) = 256·400m` |
| `2n²` | `m` | `16m` | `2(16m)² = 256·2m²` |
| `2^n` | `m` | `m + 8` | `2^(m+8) = 256·2^m` |

These are scaling relationships; whole-number rounding can change a particular budget's exact maximum. Faster hardware helps, but the **growth function stays the same**.

Fixed multipliers also matter at practical sizes. Compare the book's illustrative `400n` and `2n²` formulas for **the same hypothetical rider-record task**. At `n = 12`, they give `4,800` versus `288` model microseconds; the quadratic formula is smaller. Solve `400n = 2n²` for positive `n` to get a crossover at `n = 200`. At `n = 1,000`, the linear formula gives `400,000` while the quadratic gives `2,000,000`. The 1,000-record input is an extension beyond the real Q2 field.

**Why this example?** It shows why an eventual growth advantage need not win at the session's small `n`, and why faster hardware helps growth patterns by different amounts. **How to solve it:** keep the formulas' units and constants, equate exact models to find a crossover, and use the 256-fold budget equation separately for each pattern.

<span id="part-2-caution"></span>

### 4. Read Growth Claims with Care

The book ends its comparison with two cautions. First, **constants still matter for finite inputs**. Even a linear formula can be unusable if its multiplier is huge. Compare the book's illustrative `10^100 n` operations with `10n log₂ n` operations for the same task. The linear formula has the better eventual growth class, but it becomes smaller only when `log₂ n > 10^99`, or `n > 2^(10^99)`. That threshold is far beyond any practical Q2-record list. Always examine the actual constants and input sizes when deciding which implementation to run.

Second, **"polynomial" does not automatically mean practical**. A bound of `O(n^100)` is polynomial yet can be enormous even for modest `n`. Conversely, an exponential pattern such as `2^n` eventually exceeds every fixed-degree polynomial as `n` grows. Enumerating all subsets of the actual 12 Q2 riders would visit `2^12 = 4096` subsets; adding one hypothetical record doubles that count. Repeated doubling is why the chapter's chessboard-and-rice illustration grows so quickly.

**Why these examples?** They keep asymptotic notation from being mistaken for a stopwatch reading or a blanket verdict on practical speed. **How to solve a real comparison:** write the two cost formulas, find the crossover, evaluate them at the input sizes that matter, and then use the growth class to understand what happens if the dataset keeps growing.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 3.3.3 — Examples of Algorithm Analysis

The book now applies its notation to whole Python functions. In each example, state what the function computes, count work inside repeated statements, and include any work hidden inside a Python expression.

<span id="part-3-list"></span>

### 1. Recognize Constant-Time and Hidden List Work

For a Python list that is already in memory, `len(data)` uses its stored length and `data[j]` directly accesses a valid index. Each is treated as `O(1)` in the book's model. Reading Marc's known P3 record as `top_four[2]` is one such access. **Finding** Marc's index when it is unknown requires a separate search.

| Python expression | Work for a list of `n` records | Reason |
| :--- | :--- | :--- |
| `len(data)` | `O(1)` | The length is stored. |
| `data[j]` | `O(1)` for a valid index | Direct indexed access. |
| `[0.0] * n` | `O(n)` | Create `n` list positions. |
| `data[:k]` | `O(k)` | Copy `k` references. |
| `sum(laps[:k])` | `O(k)` | Copy and visit `k` lap values. |
| `sorted(data)` | `O(n log n)` worst case | Sort a copy by comparisons. |

The compact expression `sum(laps[:k])` contains two separate operations that each scale with `k`. Their **sum** is still `O(k)`, not `O(1)`.

**Why this example?** The later prefix-average and uniqueness algorithms use slicing, summing, and sorting; their costs are easy to miss if we count source-code lines. **How to solve it:** ask what data an expression must read or create, then include that work when adding up the surrounding loop.

<span id="part-3-maximum"></span>

### 2. Find a Maximum

The book's `find_max` scans an unsorted list. Here we find the **largest best-lap time** in a deliberately shuffled copy of the four Q2 records. A larger lap time means a slower best lap, so this is an algorithm example rather than a claim about who led qualifying.

```python
def largest_best_lap(records):
    if not records:
        raise ValueError("at least one record is required")
    largest = records[0]
    for j in range(1, len(records)):
        if records[j][2] > largest[2]:
            largest = records[j]
    return largest

study_order = [MARC, QUARTARARO, DIGI, BEZ]  # Teaching order, not Q2 rank.
result = largest_best_lap(study_order)
print(result[0], f"{result[2]:.3f} s")
```

```text
Fabio Quartararo 77.561 s
```

The function makes `n − 1` best-lap comparisons after one initial list access. It must inspect every remaining record because an unseen one might be larger. Its worst-case work is `O(n)`. Since an arbitrary unsorted input can hide its maximum at the final position, reading all `n` records is also necessary for a guaranteed answer in this model; the scan has **`Θ(n)` worst-case work**.

The number of times `largest` changes is different from the number of comparisons. If the `n` best-lap values are distinct and **every order is equally likely**, the value at one-based position `j` is a new record high with probability `1/j`. The expected number of record highs, **including the initial assignment**, is the harmonic sum `H_n = 1 + 1/2 + ⋯ + 1/n`, which grows logarithmically. For four values, `H₄ = 25/12 ≈ 2.083`. The expected number of later updates inside the loop is `H₄ − 1 = 13/12`. The scan still makes `n − 1` comparisons on every input, so its total running time remains linear.

**Why this example?** Marc and Fabio are both in the real Q2 data, while a shuffled copy makes the need for a scan clear. **How to solve it:** keep the first record as the current largest, compare each later value once, update only when larger, and keep the comparison count separate from the update count.

<span id="part-3-prefix"></span>

### 3. Compute Prefix Averages Three Ways

For a list `S` of best Q2 lap times, the **prefix average** at position `j` is the mean of `S[0]` through `S[j]`:

```text
A[j] = (S[0] + S[1] + ⋯ + S[j]) / (j + 1).
```

Using the first four riders in official Q2 order produces this **teaching statistic**, which is not an official MotoGP classification measure:

| `j` | New rider | Prefix sum (s) | Prefix average (s) |
| ---: | :--- | ---: | ---: |
| 0 | Di Giannantonio | 77.410 | 77.4100 |
| 1 | Bezzecchi | 154.890 | 77.4450 |
| 2 | Marc | 232.381 | 77.4603… |
| 3 | Fabio Quartararo | 309.942 | 77.4855 |

The book presents three ways to compute every prefix average. These runnable versions use the same lap values:

```python
def prefix_averages1(values):
    n = len(values)
    averages = [0.0] * n
    for j in range(n):
        total = 0.0
        for i in range(j + 1):
            total += values[i]
        averages[j] = total / (j + 1)
    return averages

def prefix_averages2(values):
    n = len(values)
    averages = [0.0] * n
    for j in range(n):
        averages[j] = sum(values[:j + 1]) / (j + 1)
    return averages

def prefix_averages3(values):
    n = len(values)
    averages = [0.0] * n
    total = 0.0
    for j in range(n):
        total += values[j]
        averages[j] = total / (j + 1)
    return averages

laps = [record[2] for record in top_four]
for method in (prefix_averages1, prefix_averages2, prefix_averages3):
    print([f"{value:.4f}" for value in method(laps)])
```

```text
['77.4100', '77.4450', '77.4603', '77.4855']
['77.4100', '77.4450', '77.4603', '77.4855']
['77.4100', '77.4450', '77.4603', '77.4855']
```

Each method returns the same values. The **work** differs:

| Method | What is repeated? | Selected work across `n` prefixes | Growth |
| :--- | :--- | :--- | :--- |
| `prefix_averages1` | Re-add the first `j+1` values in an inner loop. | `1 + 2 + ⋯ + n = n(n+1)/2` additions | `Θ(n²)` |
| `prefix_averages2` | Copy `values[:j+1]` and sum that copy. | Two passes over each prefix; total proportional to `1 + ⋯ + n` | `Θ(n²)` |
| `prefix_averages3` | Carry one running total forward. | One addition per new value, `n` additions | `Θ(n)` |

For four riders, the repeated-sum methods process prefix lengths `1 + 2 + 3 + 4 = 10`; the running-total method adds four new lap values. For a mathematical 12-record case, the repeated prefix lengths sum to `12·13/2 = 78`, while the running total adds 12 values. The actual work also includes output-list creation and divisions, which fit within the stated growth bounds.

**Why this example?** All three programs produce the same Q2-based teaching numbers, so the comparison isolates **how** they compute them. **How to solve it:** write the prefix formula, trace the first four sums, count inner-loop or hidden slice/sum work, then reuse a running total to avoid repeating earlier additions.

<span id="part-3-disjoint"></span>

### 4. Test Three Rider Lists for a Common Member

The book asks whether three length-`n` collections have **one value common to all three**. Our collections are hypothetical analyst shortlists drawn from the **same** Q2 session. Besides the four riders above, they use Jorge Martín (**Aprilia Racing**, P5) and Ai Ogura (**Trackhouse MotoGP Team**, P6), as listed in the [Q2 timing classification](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Qualifying2.pdf).

| List | Three distinct Q2 riders |
| :--- | :--- |
| A | Marc Márquez; Fabio Quartararo; Jorge Martín |
| B | Fabio Quartararo; Marco Bezzecchi; Ai Ogura |
| C | Marc Márquez; Ai Ogura; Fabio Di Giannantonio |

A and B both contain Fabio Quartararo, but C does not, so **no rider belongs to all three lists**. Each list has `n = 3` names and has **no duplicate within itself**. The two book algorithms are:

```python
def disjoint1(A, B, C):
    for a in A:
        for b in B:
            for c in C:
                if a == b == c:
                    return False  # A common member exists.
    return True

def disjoint2(A, B, C):
    for a in A:
        for b in B:
            if a == b:
                for c in C:
                    if a == c:
                        return False
    return True

A = [MARC[0], QUARTARARO[0], "Jorge Martín"]
B = [QUARTARARO[0], BEZ[0], "Ai Ogura"]
C = [MARC[0], "Ai Ogura", DIGI[0]]
print(disjoint1(A, B, C))
print(disjoint2(A, B, C))
```

```text
True
True
```

`disjoint1` visits `n³` triples in its no-common-member worst case: `3³ = 27` here. `disjoint2` first tests `n²` A/B pairs. Because names are distinct **within A and within B**, each A name can match at most one B name, giving at most `n` matching pairs. Each such match may scan up to `n` C names, so the extra work is at most `n·n = n²`. The total worst-case bound is **`O(n²)`**. In the displayed lists, only Fabio Quartararo matches between A and B: `disjoint2` makes `3² = 9` A/B equality tests and then `3` C equality tests.

If A and B each had `n` copies of the same name and C lacked it, **all `n²` A/B pairs** would trigger a length-`n` C scan. The improved algorithm would then be cubic. The no-duplicates-within-a-list assumption is essential to the book's quadratic proof.

**Why this example?** Marc and Fabio appear across the shortlists, but no name occurs in all three; this makes both algorithms finish their full negative case. **How to solve it:** check the common-member condition, count the triple visits in the first method, then use uniqueness within A and B to bound how often the inner C scan can run in the second.

<span id="part-3-unique"></span>

### 5. Test Whether Values Are Unique

Now the question is whether one list contains **any repeated value**. We use teams from the same Q2 classification. Marc Márquez and **Francesco Bagnaia (P11)** both rode for **Ducati Lenovo Team**; Fabio Quartararo rode for **Monster Energy Yamaha MotoGP Team**, and Marco Bezzecchi for **Aprilia Racing**. Thus this four-value list contains one real repeated team:

```python
def unique1(values):
    n = len(values)
    for j in range(n):
        for k in range(j + 1, n):
            if values[j] == values[k]:
                return False
    return True

def unique2(values):
    ordered = sorted(values)
    for j in range(1, len(ordered)):
        if ordered[j - 1] == ordered[j]:
            return False
    return True

teams = [
    MARC[1],
    QUARTARARO[1],
    BEZ[1],
    "Ducati Lenovo Team",  # Francesco Bagnaia, Q2 P11.
]
print(unique1(teams))
print(unique2(teams))
```

```text
False
False
```

`unique1` compares each distinct pair of positions. With **no duplicate**, it makes `(n−1)+(n−2)+⋯+1 = n(n−1)/2` equality checks: `6` for four values or `66` for an all-distinct 12-value input. An early duplicate can make one run shorter, but its worst-case work is **`Θ(n²)`**.

`unique2` sorts a copy in `O(n log n)` worst-case time and then checks at most `n−1` neighboring pairs. Equal values become adjacent after sorting, so the total worst-case work is **`O(n log n)`**. The original order `[Ducati, Yamaha, Aprilia, Ducati]` has its equal teams separated; the sorted order brings the two Ducati entries together.

> **Printed-code correction:** Code Fragment 3.8 in the supplied chapter assigns `temp = sorted(S)` but then compares neighbors of the original `S`. To make the algorithm correct, compare `temp[j-1]` with `temp[j]`, as `unique2` does with `ordered`. Sorting helps only when the later check actually uses the sorted copy.

**Why this example?** Marc and Bagnaia provide a **real** repeated team within this Q2 session, while Fabio's different team keeps the original list's duplicates apart. **How to solve it:** either check each distinct pair, or sort a copy and compare adjacent values **in that copy**; include sorting cost in the second method's bound.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Summary

| Section 3.3 idea | Meaning | Q2-record example |
| :--- | :--- | :--- |
| **Asymptotic analysis** | Study how operation counts change as `n` grows. | Extend a rider-record task beyond the fixed 12-rider session mathematically. |
| **Big-Oh `O(g(n))`** | Eventual upper bound up to a fixed multiplier. | `8n+5 ≤ 9n` from `n = 5` onward. |
| **Big-Omega `Ω(g(n))`** | Eventual lower bound up to a fixed multiplier. | An all-distinct pair check makes at least `n²/4` comparisons for `n ≥ 2`. |
| **Big-Theta `Θ(g(n))`** | Matching eventual upper and lower growth. | The all-distinct pair count is `Θ(n²)`. |
| **Comparative analysis** | Compare the same task using tight bounds or exact formulas. | `400n` and `2n²` cross at `n = 200`. |
| **Hidden list work** | A short expression can read or create many items. | `sum(laps[:k])` costs work proportional to `k`. |
| **Prefix averages** | Reuse earlier sums to avoid repeated work. | Rolling total: `Θ(n)`; recomputed prefixes: `Θ(n²)`. |
| **Three-way disjointness** | Input assumptions can limit nested-loop work. | Distinct names within A and B limit C scans. |
| **Uniqueness** | Sort a copy to place equal values together. | Marc and Bagnaia share Ducati Lenovo Team. |

**Section 3.3's path:** define an eventual bound → prove it with constants → compare growth carefully → count all work in Python code → use previously computed information to avoid needless repetition.

[🔝 Back to Top](#top)
