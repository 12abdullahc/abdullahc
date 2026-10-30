<span id="top"></span>

# 3.5 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 3, Section 3.5, printed pages 141–147 (the supplied PDF).  
> **Topic:** Reinforcement R-3.1–R-3.34; Creativity C-3.35–C-3.54; Projects P-3.55–P-3.58.  
> **Domain Focus:** Rectangular cards, area lists, staircase strips, comparison counts, growth bounds, and timed experiments.  
> **User Prompt:** Reexplain [`Section 3.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Exercises as Analysis Problems](#background)
   - [1. Keep the rectangle-card workshop in view](#background-cards)
   - [2. Read the three exercise groups](#background-groups)
2. [Part 1: Reinforcement — Plots, Crossovers, and Growth, R-3.1–R-3.8](#part-1)
   - [1. Plot work and find crossover sizes, R-3.1–R-3.5](#part-1-plots)
   - [2. Sum, bound, and rank work, R-3.6–R-3.8](#part-1-ranking)
3. [Part 2: Reinforcement — Asymptotic Rules, R-3.9–R-3.22](#part-2)
   - [1. Combine and compare bounds, R-3.9–R-3.15](#part-2-rules)
   - [2. Handle powers, logarithms, and rounding, R-3.16–R-3.22](#part-2-functions)
4. [Part 3: Reinforcement — Code Costs and Time Budgets, R-3.23–R-3.34](#part-3)
   - [1. Analyze five sample algorithms, R-3.23–R-3.27](#part-3-code)
   - [2. Convert budgets and combine costs, R-3.28–R-3.32](#part-3-budgets)
   - [3. Explain crossovers and record events, R-3.33–R-3.34](#part-3-records)
5. [Part 4: Creativity — Better Algorithms and Counting Proofs, C-3.35–C-3.43](#part-4)
   - [1. Sort, select, and challenge a growth label, C-3.35–C-3.37](#part-4-algorithms)
   - [2. Bound sums and change logarithm bases, C-3.38–C-3.40](#part-4-sums)
   - [3. Pair comparisons and draw an odd staircase, C-3.41–C-3.43](#part-4-counting)
6. [Part 5: Creativity — Harder Proofs and Data Problems, C-3.44–C-3.54](#part-5)
   - [1. Factor, find a missing label, and inspect an induction, C-3.44–C-3.47](#part-5-first)
   - [2. Repair a growth proof and evaluate a polynomial, C-3.48–C-3.50](#part-5-fibonacci)
   - [3. Bound logs, encode a test, and find a mode, C-3.51–C-3.54](#part-5-last)
7. [Part 6: Projects — Measure Algorithms, P-3.55–P-3.58](#part-6)
   - [1. Compare prefix sums, sample functions, and sorting, P-3.55–P-3.57](#part-6-benchmarks)
   - [2. Specify all uniqueness methods before timing, P-3.58](#part-6-uniqueness)
8. [Part 7: One Connected Geometry Program](#part-7)
   - [1. The complete program](#part-7-program)
   - [2. Trace the output and work](#part-7-trace)
9. [Part 8: Simple Geometry Study Cases](#part-8)
10. [Part 9: Summary](#part-9)

---

<span id="background"></span>

## Background & Conceptual Intuition: Exercises as Analysis Problems

<span id="background-cards"></span>

### 1. Keep the rectangle-card workshop in view

The earlier guides measured work ([Section 3.1](03-01-experimental-studies.md)), named growth functions ([Section 3.2](03-02-the-seven-functions-used-in-this-book.md)), applied asymptotic bounds ([Section 3.3](03-03-asymptotic-analysis.md)), and justified claims ([Section 3.4](03-04-simple-justification-techniques.md)). We will reuse four cards measured in centimetres:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 5 cm | 4 cm | 20 cm² |

Their area list is `S = [6, 8, 16, 20]`. Later examples can add cards with new dimensions. **`n` counts input records** unless an exercise explicitly defines another input size, as the factoring question does. Area has units of cm²; comparison counts and running times do not. An asymptotic statement concerns a family of growing inputs, not just these four cards.

<span id="background-groups"></span>

### 2. Read the three exercise groups

Section 3.5 contains **58 prompts**: 34 Reinforcement exercises, 20 Creativity exercises, and 4 Projects. They are tasks to solve, so this guide explains **what each asks, the main reasoning move, and a small check**. The geometry cases are added practice; they do not change an exercise about meals, a website, integers, or line intersections into a card problem.

| Book group | Main work | Workshop connection |
| :--- | :--- | :--- |
| **Reinforcement** | Calculate a bound, compare growth, or trace a given function. | Count card comparisons or sums of card areas. |
| **Creativity** | Design an algorithm or build a proof from the chapter’s ideas. | Sort card areas, pair comparisons, or draw a staircase. |
| **Projects** | Collect timing evidence and explain its limits. | Run several algorithms on the same growing area inputs. |

For every bound, ask **which quantity is the input size, which work is counted, whether the claim is an upper or lower bound, and whether the constants are fixed across all inputs**. Here `log n` means `log₂ n` unless a different base is written.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement — Plots, Crossovers, and Growth, R-3.1–R-3.8

<span id="part-1-plots"></span>

### 1. Plot work and find crossover sizes, R-3.1–R-3.5

Treat each formula below as a **hypothetical operation count** for processing `n` cards, not a measured time for our four-card Python example. On a log-log plot, a point with ordinary coordinates `(n, f(n))` becomes `(log₂ n, log₂ f(n))`.

**R-3.1 — Plot five functions.** Graph `8n`, `4n log n`, `2n²`, `n³`, and `2^n` on logarithmic axes. If `x = log₂ n`, then `8n` becomes `y = x + 3`, `2n²` becomes `y = 2x + 1`, and `n³` becomes `y = 3x`. The `4n log₂ n` curve has `y = x + log₂ x + 2` for `n > 1`, while `2^n` has `y = n = 2^x`; neither is a straight line on these axes. Start at `n > 1` for `4n log n`, because its value is zero at `n = 1` and `log 0` is undefined. Label both transformed axes before comparing slopes.

**R-3.2 — Find where linear-log work beats quadratic work.** Compare `8n log₂ n` with `2n²` by dividing their positive common factor `2n`: the first is smaller when `4 log₂ n < n`. At `n = 16` they tie; at `n = 17` the first is strictly smaller. The gap then keeps growing: for every integer `n ≥ 16`, increasing `n` by 1 increases `4 log₂ n` by less than 1 because `(1 + 1/n)^4 ≤ (17/16)^4 < 2`. Thus `n₀ = 17` works for **all** larger integers. This compares the stated **exact operation formulas**; Big-Oh labels alone would not give a numerical crossover.

**R-3.3 — Find a quadratic–cubic crossover.** `40n² < 2n³` is equivalent to `20 < n` for positive `n`. The formulas tie at `n = 20`, and the quadratic one wins for integer `n ≥ 21`. In a card workshop, one formula might represent pair work with a large fixed setup factor and the other triple work with a small factor.

**R-3.4 — Find a graph unchanged by the axis transform.** The function `f(n) = n` plots as `y = x` on ordinary axes. Its transformed points also satisfy `log₂ f(n) = log₂ n`, so they lie on the same diagonal `y = x` when drawn on log-log axes. “Same” refers to the graph’s equation in its respective coordinates.

**R-3.5 — Explain a straight line.** For `f(n) = n^c` with fixed `c`, logarithms give `log f(n) = c log n`. Thus log-log coordinates satisfy `y = cx`, a straight line of slope `c`. A full `n × n` grid of card comparisons has `c = 2`; a triangular grid also has quadratic growth but its lower-order term means its log-log plot is only **approximately** a slope-2 line for large `n`.

<span id="part-1-ranking"></span>

### 2. Sum, bound, and rank work, R-3.6–R-3.8

**R-3.6 — Add the even numbers.** The even values from `0` through `2n` are `0, 2, 4, ..., 2n`. Factor out 2 and use the staircase identity from Section 3.2:

```text
0 + 2 + 4 + ... + 2n = 2(1 + 2 + ... + n) = n(n + 1).
```

For four even-height strips, `2 + 4 + 6 + 8 = 20` unit squares, matching `4(5) = 20`. The zero term changes neither count nor area.

**R-3.7 — Compare all-input and worst-case language.** A uniform `O(f(n))` bound on **every** input of size `n` is equivalent to the same bound on the **maximum** work among inputs of that size. If the maximum is bounded, each run is bounded; if every run is bounded by the **same constants**, its maximum is bounded. Allowing a different hidden constant for each card list would not establish one worst-case Big-Oh bound.

**R-3.8 — Rank nine expressions by eventual growth.** Simplify each expression before ranking it. The PDF’s superscripts matter: `2^10` is constant, and `2^(log₂ n) = n`; the `4n` in the second row is **linear**, while `2^n` is exponential.

| Growth class | Functions from the exercise, in any order within a tie |
| :--- | :--- |
| `Θ(1)` | `2^10` |
| `Θ(n)` | `2^(log₂ n)`, `3n + 100 log₂ n`, `4n` |
| `Θ(n log n)` | `n log n`, `4n log n + 2n` |
| `Θ(n²)` | `n² + 10n` |
| `Θ(n³)` | `n³` |
| `Θ(2^n)` | `2^n` |

The card interpretation is the same one used in Section 3.2: one card at a time is linear, sorting or repeated splitting can be `n log n`, pairs are quadratic, triples cubic, and all card subsets exponential. Constants such as `4` and `100` do not change the eventual class.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement — Asymptotic Rules, R-3.9–R-3.22

<span id="part-2-rules"></span>

### 1. Combine and compare bounds, R-3.9–R-3.15

The exercises ask for **proofs from the definitions**, not rules to memorize without conditions. Think of `d(n)` and `e(n)` as nonnegative card-work counts, bounded eventually by positive reference functions `f(n)` and `g(n)`. If `d ≤ c₁f` and `e ≤ c₂g` beyond suitable starting sizes, a new fixed constant can often combine the bounds.

| Exercise | Reasoning move | Small workshop reading |
| :--- | :--- | :--- |
| **R-3.9** | Multiplying `d` by a fixed `a > 0` changes the witness from `c₁` to `ac₁`. | Doing each card check `a` times keeps its growth class. |
| **R-3.10** | Multiply nonnegative inequalities: `de ≤ c₁c₂fg`. | Two independent choice counts multiply, as in ordered card pairs. |
| **R-3.11** | Add inequalities: `d + e ≤ c₁f + c₂g ≤ max(c₁,c₂)(f + g)`. | A scan followed by a sort pays for both stages. |
| **R-3.12** | **Do not subtract bounds.** Take `d=n+1`, `e=1`, `f=n+1`, `g=n`: `d=O(f)` and `e=O(g)`, but `d−e=n` is not `O(f−g)=O(1)`. | Subtracting two loose card-work ceilings can erase the growing work. |
| **R-3.13** | Chain witnesses: if `d ≤ c₁f` and `f ≤ c₂g`, then `d ≤ c₁c₂g` beyond the later start size. | A pair count bounded by `n²` is also bounded by a larger suitable reference. |
| **R-3.14** | For nonnegative `f,g`, `max(f,g) ≤ f+g ≤ 2max(f,g)`, so their Big-Oh classes agree. | Paying for a scan and a sort grows like the larger stage. |
| **R-3.15** | Reverse `d ≤ cg`: this says `g ≥ (1/c)d`, so `d=O(g)` exactly when `g=Ω(d)`. | An upper ceiling for one work count is a lower floor when viewed from the reference function. |

All constants in these proofs must be independent of `n`; use the larger of the starting sizes when two assumptions have different thresholds.

<span id="part-2-functions"></span>

### 2. Handle powers, logarithms, and rounding, R-3.16–R-3.22

| Exercise | Useful inequality or identity | Geometry check |
| :--- | :--- | :--- |
| **R-3.16** | If a polynomial has positive degree and is eventually positive, then `p(n)>1` eventually and `p(n) ≤ Cn^d`, so `log p(n) ≤ log C + d log n = O(log n)`. A positive constant polynomial has a bounded logarithm; if that constant is below 1, its negative log needs an absolute-value interpretation outside the chapter’s positive-function convention. | A polynomial count of card layouts does not gain a higher growth class merely by taking its log. |
| **R-3.17** | For `n ≥ 1`, `(n+1)^5 ≤ (2n)^5 = 32n^5`. | Adding one extra card option to five independent positions changes a fixed multiplier. |
| **R-3.18** | `2^(n+1) = 2·2^n`. | One extra include-or-exclude card doubles the subset count. |
| **R-3.19** | For `n ≥ 2`, `log₂ n ≥ 1`, hence `n ≤ n log₂ n`. | A single pass is bounded above by a repeated-level workload. |
| **R-3.20** | For `n ≥ 1`, `log₂ n ≤ n`, hence `n² ≥ n log₂ n`. | All card pairs give at least a constant multiple of an `n log n` reference for large `n`. |
| **R-3.21** | For `n ≥ 2`, `log₂ n ≥ 1`, hence `n log₂ n ≥ n`. | Work at each of several levels is at least linear overall. |
| **R-3.22** | The exercise assumes `f` is positive, nondecreasing, and always greater than 1. It uses the **ceiling** `⌈f(n)⌉`. Since `f(n) > 1`, `⌈f(n)⌉ ≤ f(n)+1 ≤ 2f(n)`; rounding up preserves `O(f(n))`. | If a card schedule needs a whole number of passes, rounding a positive pass estimate adds at most one. |

For R-3.16, a polynomial that is negative at large `n` would make `log p(n)` undefined in ordinary real arithmetic. For R-3.20, the stated inequality at `n=1` includes `log₂ 1=0`; the lower-bound claim remains valid, and the meaningful growth comparison begins for larger `n`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Reinforcement — Code Costs and Time Budgets, R-3.23–R-3.34

<span id="part-3-code"></span>

### 1. Analyze five sample algorithms, R-3.23–R-3.27

Code Fragment 3.10 supplies five functions. Use `S = [6, 8, 16, 20]` to trace their **outputs**, but count loop iterations for their growth. The prefix sums of `S` are `[6, 14, 30, 50]`, whose total is `100`. For `example5`, let its second length-4 sequence be `B = [100, 6, 100, 20]`.

| Exercise and source function | What the code computes | Four-card check | Time bound |
| :--- | :--- | :--- | :--- |
| **R-3.23, `example1`** | Sum every entry of `S`. | `6+8+16+20 = 50` | `O(n)`; one pass. |
| **R-3.24, `example2`** | Sum entries at **even indices** `0, 2, ...`. | `6+16 = 22` | `O(n)`; about half a pass is still linear. |
| **R-3.25, `example3`** | Recompute and add every prefix sum. | `6+14+30+50 = 100` | `O(n²)`; `1+...+n` inner visits. |
| **R-3.26, `example4`** | Carry a running prefix and add it once per entry. | `100` again | `O(n)`; each entry is read once. |
| **R-3.27, `example5`** | For each `B[i]`, recompute the **full** sum of A’s prefix sums and test equality once. | `100` appears twice in `B`, so the count is `2`. | `O(n³)`; `n` outer repeats of quadratic work. |

The `if B[i] == total` test in `example5` follows the complete prefix-summing loop for each `i`; its location matters. The program in Part 7 reproduces this distinction on card areas.

<span id="part-3-budgets"></span>

### 2. Convert budgets and combine costs, R-3.28–R-3.32

**R-3.28 — Fill a time-budget table.** If `f(n)` is measured in microseconds and the budget is `T` microseconds, find the **largest integer** `n` satisfying `f(n) ≤ T`. One second supplies `T = 1,000,000`:

| Time formula `f(n)` | Work to solve | Largest `n` in one second |
| :--- | :--- | ---: |
| `log₂ n` | `n ≤ 2^T` | `2^1,000,000` |
| `n` | `n ≤ T` | 1,000,000 |
| `n log₂ n` | Solve the increasing inequality numerically. | 62,746 |
| `n²` | `n ≤ ⌊√T⌋` | 1,000 |
| `2^n` | `n ≤ ⌊log₂ T⌋` | 19 |

The book also asks for one hour, one month, and one century. The following completes those columns using a **30-day month** and **365-day years**; different calendar assumptions alter some numerical entries. The budgets are `3,600,000,000`, `2,592,000,000,000`, and `3,153,600,000,000,000` microseconds:

| Time formula | Largest `n` in 1 hour | Largest `n` in 30 days | Largest `n` in 100 years |
| :--- | ---: | ---: | ---: |
| `log₂ n` | `2^3,600,000,000` | `2^2,592,000,000,000` | `2^3,153,600,000,000,000` |
| `n` | 3,600,000,000 | 2,592,000,000,000 | 3,153,600,000,000,000 |
| `n log₂ n` | 133,378,058 | 71,870,856,404 | 68,610,956,750,570 |
| `n²` | 60,000 | 1,609,968 | 56,156,922 |
| `2^n` | 31 | 41 | 51 |

The book’s already-filled `log n` cell is a rough enormous value; with base 2 the exact one-second limit is `2^1,000,000 ≈ 10^301030`. These are **model** times, not measurements of Python on card lists.

| Exercise | Composition rule | Card-workshop interpretation |
| :--- | :--- | :--- |
| **R-3.29** | `n` entries × `O(log n)` work each gives `O(n log n)`. | Search a sorted area index for each of `n` cards. |
| **R-3.30** | `log n` sampled entries × `O(n)` work each gives `O(n log n)` worst-case work. | Re-scan all card areas after each selected sample; randomness in the choice does not shorten the stated per-sample worst-case bound. |
| **R-3.31** | If every value is odd, the stated per-value bound gives `O(n log n)`; if every value is even, it gives `O(n²)`. | Odd/even whole-number **area values** select the cheap or expensive branch. These are upper bounds; tight best/worst `Θ` claims need matching lower bounds. |
| **R-3.32** | Treat the call at index `0` as constant work. With one fixed per-index constant `c`, total work is at most `c₀ + cΣ_{i=1}^{n−1}i = O(n²)`. | Card at index `i` may trigger work proportional to earlier positions; the triangular sum is `n(n−1)/2`. |

<span id="part-3-records"></span>

### 3. Explain crossovers and record events, R-3.33–R-3.34

**R-3.33 — Explain surprising measured times.** A method labeled `O(n²)` may run faster for `n < 100` than one labeled `O(n log n)` because their fixed costs, setup, and input details differ. The labels describe eventual upper growth, not exact time at every size; upper bounds alone do not prove an eventual ordering unless they are informative about actual growth. Compare complete implementations on the same card inputs.

**R-3.34 — Count expected “best so far” events.** The book’s meal story is the same record process as scanning shuffled, **distinct** card areas. The `j`th item is the best so far with probability `1/j` under a uniformly random order, so the expected count is the harmonic sum `H_n = 1 + 1/2 + ... + 1/n`. For four distinct areas, `H₄ = 25/12 ≈ 2.08`. This is the expected number of record events, **not** the number of items scanned; a full scan still reads `n` items.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Creativity — Better Algorithms and Counting Proofs, C-3.35–C-3.43

<span id="part-4-algorithms"></span>

### 1. Sort, select, and challenge a growth label, C-3.35–C-3.37

**C-3.35 — Improve three-way set disjointness.** The source problem asks whether three size-`n` sets share any value. Sort all three lists in `O(n log n)` time, then advance a pointer in whichever sorted list has the smallest current value. Equal current values in all three lists reveal a common element; exhausting one list proves there is none. The pointer walk is `O(n)`, so sorting dominates. For card practice, use three trays of area measurements, including the no-common-area trays from Section 3.3.

**C-3.36 — Find the ten largest values.** Keep a sorted collection of at most ten best-so-far card areas. For each new area, place it among those ten and discard the smallest if needed. Ten is a **fixed constant**, so each insertion takes at most a fixed amount of work and the full scan is `O(n)` time with `O(1)` extra storage relative to `n`. If fewer than ten cards exist, keep them all. Sorting all `n` values would also work but costs more asymptotically.

**C-3.37 — Construct a function that is neither `O(n)` nor `Ω(n)`.** A positive example is:

```text
f(n) = n² when n is even, and f(n) = 1 when n is odd.
```

For even card counts, `f(n)/n = n` grows without bound, so `f` is not `O(n)`. For odd counts, `f(n)/n = 1/n` approaches zero, so `f` is not `Ω(n)`. This is an **abstract work function** chosen to test the definitions, not a rule for a card’s physical area.

<span id="part-4-sums"></span>

### 2. Bound sums and change logarithm bases, C-3.38–C-3.40

**C-3.38 — Bound a sum of squares.** Draw `n` square cards with side lengths `1, 2, ..., n` unit lengths. Their total area is `Σ_{i=1}^n i²`. Since each `i² ≤ n²`, adding `n` such terms gives `Σ i² ≤ n³`, proving `O(n³)`. At `n = 4`, the exact area is `1+4+9+16=30` unit squares, below `4³=64`.

**C-3.39 — Bound a weighted geometric sum.** Picture strip `i` as a rectangle of height `i` cm and width `1/2^i` cm, so its area is `i/2^i` cm². Each new strip is taller but half as wide. The exercise asks why the first `n` such areas sum to less than `2 cm²`. A useful identity is:

```text
Σ_{i=1}^n i/2^i = 2 − (n + 2)/2^n < 2.
```

One way to derive it is to halve the sum and subtract the shifted terms. For `n = 4`, the areas total `1/2 + 2/4 + 3/8 + 4/16 = 13/8 = 1.625 cm²`. The exercise’s bound is about a **finite** sum; the missing positive tail keeps it strictly below 2.

**C-3.40 — Change a logarithm’s base.** For fixed `b > 1` and `f(n) > 1` eventually, `log_b f(n) = log₂ f(n) / log₂ b`. The denominator is a positive constant, so the functions are `Θ` of each other. Counting the levels needed to halve candidate card areas and counting levels using another fixed reduction factor differ only by a constant multiplier.

<span id="part-4-counting"></span>

### 3. Pair comparisons and draw an odd staircase, C-3.41–C-3.43

**C-3.41 — Find both minimum and maximum efficiently.** Compare card areas in **pairs**. In each pair, send the smaller value to a minimum-candidate group and the larger to a maximum-candidate group, then find each group’s extreme. For even `n`, this uses `n/2 + (n/2−1) + (n/2−1) = 3n/2−2` comparisons. For odd `n`, initialize both extrema from one unpaired value, then use three comparisons per remaining pair: `3(n−1)/2`. Both counts are below `3n/2`. For our four areas, pair `(6,8)` and `(16,20)`; four comparisons suffice to return `6` and `20`.

**C-3.42 — Find a forced-capacity threshold.** In the original website story, friend `i` may make at most `i` visits. Without anyone reaching their personal limit, friend `i` can make at most `i−1` visits, so the largest total without a filled limit is `Σ_{i=1}^n(i−1) = n(n−1)/2`. **One more visit**, `n(n−1)/2 + 1`, forces at least one friend to reach a limit. As a card-tray analogy, bins with capacities `1,2,3,4` can hold at most `0+1+2+3=6` items while all remain below capacity; a seventh forces a full bin.

**C-3.43 — Draw the odd-`n` staircase proof.** Figure 3.3(b) pairs short and tall unit-width strips for even `n`. For odd `n = 2k+1`, pair `k` short/tall pairs of heights summing to `n+1`; one middle strip of height `k+1=(n+1)/2` remains. The total is `k(n+1)+(n+1)/2 = n(n+1)/2`. With five strips, pair `1+5=6` and `2+4=6`, then add the middle `3`, giving `15` unit squares. Draw those rows to make the algebra visible.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Creativity — Harder Proofs and Data Problems, C-3.44–C-3.54

<span id="part-5-first"></span>

### 1. Factor, find a missing label, and inspect an induction, C-3.44–C-3.47

**C-3.44 — Analyze trial division under the book’s model.** The original exercise transmits `r = p·q` for primes `p < q` and tests candidate divisors starting at 2. A rectangle with `r` unit squares can have side lengths `p` and `q`; knowing only its area does not immediately reveal those sides. Because the first divisor is `p < √r`, a 100-bit `r` may require nearly `2^50` divisions. At **one microsecond per division**, that scale is about **35.7 years**. For part (b), the exercise defines input length `n = ⌊(log₂ r)/8⌋ + 1` bytes and division cost `O(n)`. The literal loop gives a loose `O(n·2^(8n))` upper bound; using the stated two-prime promise and stopping at the first divisor sharpens it to `O(n·2^(4n))`. State which assumption your bound uses.

**C-3.45 — Find one missing integer with constant extra space.** The original list contains `n−1` distinct labels from `0` through `n−1`. Their expected sum is `n(n−1)/2`; subtract the observed sum while scanning once. With labels `[0,1,3,4]` and `n=5`, the missing value is `10−8=2`. The labels could number workshop cards, but **0 is a label**, not a positive rectangle area. The scan is `O(n)` time and uses `O(1)` extra variables under the chapter’s arithmetic model.

**C-3.46 — Find the gap in the all-sheep-same-color induction.** The claimed step removes one sheep, then another, and assumes the two remaining groups share a sheep that transfers the color equality. At `n=2`, the groups are different single sheep and have **no overlap**; the step fails exactly where it first needs to extend the base case. Two cards `A` and `B` with areas 6 and 8 cm² make the same faulty “all cards have equal area” argument visibly false.

**C-3.47 — Count line intersections by induction.** For `n` lines in the plane with **no parallel pair** and **no three through one point**, each new line crosses the previous `n−1` lines at distinct new points. Starting from zero points for one line gives `1+2+...+(n−1)=n(n−1)/2 = Θ(n²)`. Four ruler lines in this general position make six intersections. Ordinary rectangle edges would violate the no-parallel-lines assumption, so draw separate lines across the workshop board.

<span id="part-5-fibonacci"></span>

### 2. Repair a growth proof and evaluate a polynomial, C-3.48–C-3.50

**C-3.48 — Diagnose a false Fibonacci bound.** The exercise presents an apparent induction that the Section 3.4 card-grouping count `F(n)` is `O(n)`. Its hidden constants are the problem: saying each smaller fixed `F(j)` is `O(j)` does **not** produce one constant that bounds `F(n)/n` for all `n`. A valid Big-Oh proof needs a uniform constant independent of the size. The claimed linear bound is false; the next exercise supplies an exponential lower bound.

**C-3.49 — Prove an exponential lower bound.** Keep the same grouping recurrence `F(1)=1`, `F(2)=2`, and `F(n)=F(n−1)+F(n−2)`. To show `F(n)=Ω((3/2)^n)`, choose the fixed witness `c=2/3`. The bases hold: `F(1)=1=c(3/2)` and `F(2)=2 ≥ c(3/2)² = 3/2`. Then strong induction gives `F(n) ≥ c[(3/2)^(n−1)+(3/2)^(n−2)] = (5/2)c(3/2)^(n−2)`, at least `c(3/2)^n` because `5/2 > 9/4`. The card-row groupings therefore grow faster than a linear count.

**C-3.50 — Evaluate a polynomial three ways.** The original polynomial is `p(x)=Σ_{i=0}^n a_i x^i`; here `n` is its **degree**, so there are `n+1` coefficients. If coefficients are card areas in cm² and `x` is a **dimensionless copy multiplier**, then for positive integer `x` the term `a_i x^i` is the area of `x^i` copies of card type `i`. Recomputing each power `x^i` from scratch gives an `O(n²)` method; computing each power by repeated squaring gives an `O(n log n)` method; Horner’s nested form uses **`O(n)` arithmetic operations**. With coefficients `[6,8,16,20]` and `x=2`, all three evaluate `6+8(2)+16(4)+20(8)=246 cm²`. The formal exercise must also handle arbitrary coefficients and numeric `x`.

<span id="part-5-last"></span>

### 3. Bound logs, encode a test, and find a mode, C-3.51–C-3.54

**C-3.51 — Prove an upper bound on log sums.** Every `log₂ i` for `1 ≤ i ≤ n` is at most `log₂ n`. There are `n` terms, so `Σ_{i=1}^n log₂ i ≤ n log₂ n`, an `O(n log n)` bound. As a card analogy, one binary search in an **already sorted** prefix of length `i` has logarithmic search depth; any preparation of that sorted prefix is separate work.

**C-3.52 — Prove the matching lower bound.** At least half the integers `i` in `1,...,n` are at least `n/2`; each of their logarithms is at least `log₂(n/2)`. For `n ≥ 4`, `log₂(n/2) ≥ (1/2)log₂ n`, so `Σ log₂ i ≥ (n/4)log₂ n`. This is `Ω(n log n)`. Together with C-3.51, it gives `Θ(n log n)`; using only an upper bound would not establish tight growth.

**C-3.53 — Encode one unknown choice in one round.** The original one-month bottle puzzle has exactly one poisoned item and asks for `O(log n)` testers. Give each of the `n` items a distinct binary label of length `k=⌈log₂ n⌉`. Assign tester `j` to the items whose `j`th label bit is 1, and run the tests **in parallel**; the resulting outcome bits identify the marked label after the month. Eight labeled cards need only three binary outcome positions, `000` through `111`; the all-zero label is valid because exactly one item is known to be marked. The card-label model explains the information count while the exercise retains its one-month testing constraint.

**C-3.54 — Find the most frequent integer.** The source values lie in `[0,4n]`, so use a frequency array with `4n+1` counters. Scan the `n` values once, increment their counters, then scan the counters to find a value with maximum frequency: `O(n)` time and `O(n)` extra space. The integers could label completed tile counts, including zero; they need not be positive card areas. If several values tie, any maximizer satisfies the stated task unless a tie rule is added.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Projects — Measure Algorithms, P-3.55–P-3.58

<span id="part-6-benchmarks"></span>

### 1. Compare prefix sums, sample functions, and sorting, P-3.55–P-3.57

An experiment uses a **fixed definition of input size**, the same input distribution for methods being compared, several sizes, repeated trials, and a clock precise enough for the work. Validate the outputs first. A log-log plot displays measured time against `n`; it does not turn a finite experiment into a proof for all `n`.

**P-3.55 — Compare three prefix-average algorithms.** Time the source’s `prefix_average1`, `prefix_average2`, and `prefix_average3` on the **same growing area lists**. Plot positive measured times against list length on log-log axes. Section 3.3 predicts quadratic work for the first two and linear work for the running-total third, but record actual times and input conditions rather than drawing the theoretical labels as data.

**P-3.56 — Compare Code Fragment 3.10.** Time `example1` through `example5` on controlled inputs and relate their curves to the loop counts in R-3.23–R-3.27. The functions do **different tasks**, so verify each output separately; equal input sizes do not imply equal answers. `example5` also needs a second list of equal length.

**P-3.57 — Test a sorting hypothesis.** Generate card-area lists under a stated random-order model, time Python’s `sorted` repeatedly, and examine growth against `n log n` (for example by plotting time or the ratio `time/(n log n)`). “On average” requires specifying how lists are sampled. A finite timing study can support or challenge the book’s hypothesis, but cannot mathematically prove an asymptotic bound.

<span id="part-6-uniqueness"></span>

### 2. Specify all uniqueness methods before timing, P-3.58

**P-3.58 — Find the one-minute input limit.** The project asks for the largest `n` on which `unique1`, `unique2`, and `unique3` finish within one minute. The supplied chapter defines `unique1` (compare every pair) and `unique2` (sort, then compare neighbors), but it **does not define `unique3`**. Obtain or state a third implementation before trying to reproduce this comparison; a hash-set scan could be an explicitly **new study variant**, not a function supplied by this PDF. Use the corrected sorted-copy comparison for `unique2` explained in Section 3.3, and verify results before timing. Use the same input rule for all methods, because an early duplicate can make a uniqueness test return much sooner than an all-distinct input. Search for the time threshold with repeated trials and report the machine, input distribution, and uncertainty near one minute.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: One Connected Geometry Program

<span id="part-7-program"></span>

### 1. The complete program

This small program turns Code Fragment 3.10 into an area-record exercise. The first four functions receive the same card areas. The fifth receives a separate list of **target display areas** of equal length and counts targets equal to the sum of all prefixes. Its loops deliberately recompute that sum for each target, matching the source algorithm’s work pattern.

```python
def example1(areas):
    total = 0
    for area in areas:
        total += area
    return total


def example2(areas):
    total = 0
    for j in range(0, len(areas), 2):
        total += areas[j]
    return total


def example3(areas):
    total = 0
    for j in range(len(areas)):
        for k in range(j + 1):
            total += areas[k]
    return total


def example4(areas):
    prefix = 0
    total = 0
    for area in areas:
        prefix += area
        total += prefix
    return total


def example5(areas, target_areas):
    if len(areas) != len(target_areas):
        raise ValueError("both lists must have equal length")
    count = 0
    for target in target_areas:
        total = 0
        for j in range(len(areas)):
            for k in range(j + 1):
                total += areas[k]
        if target == total:
            count += 1
    return count


cards = [(2, 3), (4, 2), (4, 4), (5, 4)]
areas = [width * height for width, height in cards]
target_areas = [100, 6, 100, 20]

print("areas:", areas)
print("example1:", example1(areas))
print("example2:", example2(areas))
print("example3:", example3(areas))
print("example4:", example4(areas))
print("example5:", example5(areas, target_areas))
```

<span id="part-7-trace"></span>

### 2. Trace the output and work

```text
areas: [6, 8, 16, 20]
example1: 50
example2: 22
example3: 100
example4: 100
example5: 2
```

The four prefix sums are `6, 14, 30, 50`, totaling `100 cm²` when their area values are added. The `example2` answer uses **positions 0 and 2**, not “even area values”: all four displayed areas happen to be even.

| Function | Inner area additions at `n=4` | General count or growth |
| :--- | ---: | :--- |
| `example1` | 4 | `n`, so `Θ(n)`. |
| `example2` | 2 | `⌈n/2⌉`, so `Θ(n)`. |
| `example3` | 10 | `1+...+n = n(n+1)/2`, so `Θ(n²)`. |
| `example4` | 8 | Two additions on each of `n` passes, so `Θ(n)`. |
| `example5` | 40 | `n·n(n+1)/2` repeated inner additions, so `Θ(n³)`. |

These counts cover the displayed addition statements, not every Python primitive operation. They are enough to explain the growth difference because the remaining fixed work per pass does not change the dominant class. The program’s small input verifies outputs; the loop structure supplies the all-`n` reasoning.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Where do two work formulas cross?</strong></summary>

**Scenario:** Two ways to process `n` cards have exact model counts `8n log₂ n` and `2n²`.

**Check:** At `n=16`, both counts are `512`. At `n=17`, `8·17·log₂17 ≈ 556`, while `2·17² = 578`.

**Lesson:** The first method is strictly better from integer size 17 onward. An asymptotic label alone does not give this crossover; the fixed factors do.

</details>

<details>
<summary><strong>Case Study 2: Why can two area totals cost different work?</strong></summary>

**Scenario:** We need the sum of every prefix sum of `[6,8,16,20]` cm².

**Check:** Recomputing prefixes adds `1+2+3+4=10` area values. Carrying a running prefix performs four prefix updates and four total updates. Both give `6+14+30+50=100 cm²`.

**Lesson:** Equal answers do not imply equal running time. For general `n`, the methods grow quadratically and linearly.

</details>

<details>
<summary><strong>Case Study 3: How do paired comparisons save work?</strong></summary>

**Scenario:** Find both the smallest and largest among card areas `6, 8, 16, 20`.

**Check:** Compare `(6,8)` and `(16,20)` within their pairs. Compare the pair losers `6,16` for the minimum, then the pair winners `8,20` for the maximum: **four comparisons**. Two independent scans from the first value would use six.

**Result:** The extrema are `6` and `20`; the paired method stays below `3n/2` comparisons for general `n`.

</details>

<details>
<summary><strong>Case Study 4: What changes when a staircase has an odd number of strips?</strong></summary>

**Scenario:** Five unit-width rectangular strips have heights `1,2,3,4,5` cm.

**Check:** Pair the outer heights: `1+5=6` and `2+4=6`. The middle strip has height `3`. Total area is `6+6+3=15 cm² = 5(6)/2 cm²`.

**Lesson:** The even-`n` pairing picture needs one **unpaired middle strip** when `n` is odd; the same formula still holds.

</details>

<details>
<summary><strong>Case Study 5: Where does a tempting induction fail?</strong></summary>

**Scenario:** Someone claims all rectangular cards have the same area because every single card matches itself and two overlapping groups of `n−1` cards each supposedly have one common area.

**Check:** At `n=2`, removing `A` leaves only `B` (area 8), while removing `B` leaves only `A` (area 6). The groups have **no shared card**, so no equality can be transferred.

**Lesson:** Check that an induction step really works immediately after its base case; a missing overlap can invalidate the whole proof.

</details>

<details>
<summary><strong>Case Study 6: When does every line pair give a new crossing?</strong></summary>

**Scenario:** Draw four infinite ruler lines across the card-workshop plane, with no two parallel and no three meeting at one point.

**Check:** Each pair makes one crossing, and the no-three-together rule keeps all pair crossings distinct: `4·3/2 = 6`. A fifth line adds four new crossings, making ten.

**Lesson:** The exact `n(n−1)/2` count depends on both geometric assumptions. Rectangle edges usually include parallel pairs, so they are not a valid replacement for these lines.

</details>

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Exercise range | Main question | Rectangle-card reminder |
| :--- | :--- | :--- |
| **R-3.1–R-3.8** | How do formulas plot, cross, sum, and rank? | Exact operation counts can cross even when their eventual growth differs. |
| **R-3.9–R-3.22** | Which Big-Oh and Big-Omega rules follow from fixed witnesses? | Scale, add, and multiply bounds carefully; subtracting them is unsafe. |
| **R-3.23–R-3.34** | What do loops, budgets, and random records actually count? | The same prefix-area total can take linear or quadratic work. |
| **C-3.35–C-3.43** | Can sorting, pairing, or a visual sum improve a proof or algorithm? | Three sorted trays, paired extrema, and odd staircases expose useful structure. |
| **C-3.44–C-3.54** | Which assumptions make harder counting and induction arguments valid? | Label ranges, line geometry, and uniform constants must match the original claim. |
| **P-3.55–P-3.58** | How should measured growth be compared? | Use common inputs, check outputs, repeat timings, and identify every implementation. |

**Keep the source task and study case distinct.** Card areas supply small numbers and pictures; the book’s original input rules and requested outputs still govern each exercise.

[🔝 Back to Top](#top)
