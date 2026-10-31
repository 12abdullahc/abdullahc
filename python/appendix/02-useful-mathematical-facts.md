<span id="top"></span>

# Appendix 02 (Appendix B): Useful Mathematical Facts — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Appendix B, printed pages 725–731 ([supplied PDF](<../Data Structures and Algorithms in Python - APPENDIX.pdf>)).<br>
> **Topic:** Logarithms and exponents; integer functions and relations; summations; basic probability; useful mathematical techniques.<br>
> **Domain Focus:** A workshop arranging rectangular cards and unit-square tiles, with measured area, random dimensions, and routines that split a tile strip.<br>
> **User Prompt:** Reexplain [Section Appendix 02] part by part, with background and simple, connected math-geometry study cases, in the format of [01-01-overview.md](../01-python-primer/01-01-overview.md).

---

## Table of Contents

1. [Background & Conceptual Intuition: The Tile-Board Workshop](#background)
   - [1. One setting for all five parts](#background-workshop)
   - [2. How to read formulas and growth notation](#background-notation)
2. [Part 1: Logarithms and Exponents](#part-1)
   - [1. Powers, logarithms, and eight rules](#part-1-rules)
   - [2. A rectangle bound (Proposition B.1)](#part-1-rectangle)
   - [3. The number e and growth bounds (Propositions B.2–B.4)](#part-1-natural)
3. [Part 2: Integer Functions and Relations](#part-2)
   - [1. Floor, ceiling, and remainder](#part-2-rounding)
   - [2. Factorials, combinations, and bounds (B.5–B.6)](#part-2-counting)
   - [3. Fibonacci growth (B.7)](#part-2-fibonacci)
4. [Part 3: Summations](#part-3)
   - [1. Rearranging and telescoping sums (B.8–B.11)](#part-3-basic)
   - [2. Power sums (B.12)](#part-3-powers)
   - [3. Geometric and harmonic sums (B.13–B.16)](#part-3-series)
5. [Part 4: Basic Probability](#part-4)
   - [1. Sample spaces and events (Examples B.17–B.18)](#part-4-space)
   - [2. Independence and conditional probability](#part-4-events)
   - [3. Random variables and expectations (B.19–B.22)](#part-4-expectation)
   - [4. A tail bound for marked tiles (B.23)](#part-4-tail)
6. [Part 5: Useful Mathematical Techniques](#part-5)
   - [1. Limits, split sums, and integral bounds (B.24)](#part-5-bounds)
   - [2. Three recursion patterns (B.25)](#part-5-master)
7. [Part 6: Connected Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Tile-Board Workshop

<span id="background-workshop"></span>

### 1. One setting for all five parts

Continue the rectangular-card workshop from [Section 1.1](../01-python-primer/01-01-overview.md). A rectangle's **area = width × height**. If a board is made from 1 cm × 1 cm tiles, its numeric area in cm² is also its number of tiles.

| Object | Dimensions | Area or count |
| :--- | :--- | :--- |
| Card `A` | 2 cm × 3 cm | 6 cm² |
| Card `B` | 4 cm × 2 cm | 8 cm² |
| A 4 cm × 4 cm tile board | 4 rows × 4 columns | 16 tiles = 16 cm² |

We will enlarge boards, arrange cards into strips, count design choices, shade tiles at random, and split a strip into smaller pieces. These are **study cases for the appendix's mathematics**. They are not claims that every geometry problem requires an algorithm.

<span id="background-notation"></span>

### 2. How to read formulas and growth notation

| Symbol | Read it as | Small example |
| :--- | :--- | :--- |
| `n` | A nonnegative count or input size. | `n = 4` rows. |
| `Σ_{i=1}^n f(i)` | Add `f(1)` through `f(n)`. | `Σ_{i=1}^4 i = 10`. |
| `log_b x` | The exponent that turns `b` into `x`. | `log₂ 8 = 3`. |
| `O(g(n))` | An eventual upper bound up to a constant factor. | `n + 3` is `O(n)`. |
| `Ω(g(n))` | An eventual lower bound up to a constant factor. | `n + 3` is `Ω(n)`. |
| `Θ(g(n))` | Both an upper and a lower bound. | `n + 3` is `Θ(n)`. |

An **exact identity** such as `1 + 2 + 3 + 4 = 10` gives a value. A **growth statement** such as `Σ i² = Θ(n³)` describes how values scale as `n` grows. Keep tile counts, lengths in cm, and areas in cm² distinct. When taking a logarithm of a measured length, use its **ratio to a reference length** (for example, width divided by 1 cm), so the logarithm receives a dimensionless number.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Logarithms and Exponents

<span id="part-1-rules"></span>

### 1. Powers, logarithms, and eight rules

For `b > 0`, `b ≠ 1`, and `x > 0`, the statement `log_b x = y` means `b^y = x`. If the side of a tile board doubles from 1 to 2 to 4 to 8 cm, it takes three doublings: `log₂ 8 = 3`. Because area is side squared, the final 8 cm square contains `8² = 64` unit tiles.

The book uses bare `log` for base 2; `ln` means base `e`. Its eight rules are collected here. In logarithm rules, the arguments must be positive and each base must be positive and different from 1.

| Rule | Identity | Tile-board check |
| :--- | :--- | :--- |
| Product | `log_b(xy) = log_b x + log_b y` | `log₂(2×4) = 1 + 2 = 3`. |
| Quotient | `log_b(x/y) = log_b x − log_b y` | `log₂(8/2) = 3 − 1 = 2`. |
| Power | `log_b(x^r) = r log_b x` | `log₂(4²) = 2×2 = 4`. |
| Change of base | `log_b x = log_c x / log_c b` | `log₂ 8 = ln 8 / ln 2 = 3`. |
| Exchange | `b^(log_c x) = x^(log_c b)` | `4^(log₂ 8) = 4³ = 8² = 64`. |
| Power of a power | `(b^u)^v = b^(uv)` | `(2²)³ = 2⁶ = 64`. |
| Multiply powers | `b^u b^v = b^(u+v)` | `2²×2³ = 2⁵ = 32`. |
| Divide powers | `b^u / b^v = b^(u−v)` | `2⁵/2² = 2³ = 8`. |

These identities explain repeated board scaling. For example, doubling a side length adds one to its base-2 logarithm, while squaring the side doubles that logarithm.

<span id="part-1-rectangle"></span>

### 2. A rectangle bound (Proposition B.1)

Imagine a rectangle whose side lengths are `a` and `b` one-centimetre segments. A square with the **same perimeter** has side `(a+b)/2` and area at least `ab`:

```text
ab = ((a+b)² − (a−b)²)/4 ≤ (a+b)²/4.
```

If another dimensionless count `c` is larger than `a+b`, then `ab < c²/4`. Taking base-2 logarithms gives the book's result:

```text
If a > 0, b > 0, c > a+b:
log₂ a + log₂ b < 2 log₂ c − 2.                 (B.1)
```

The `−2` comes from `log₂ 4 = 2`; this exact constant would differ with another log base. With `a = b = 2` and `c = 5`, the rectangle has area `4`, while the comparison square has area `5²/4 = 6.25`; the logarithmic inequality says `2 < log₂ 6.25 ≈ 2.64`.

<span id="part-1-natural"></span>

### 3. The number e and growth bounds (Propositions B.2–B.4)

The **natural logarithm** is `ln x = log_e x`, with `e ≈ 2.71828`. The appendix also lists infinite series. They explain where numerical approximations come from:

```text
e       = 1 + 1/1! + 1/2! + 1/3! + ...
e^x     = 1 + x/1! + x²/2! + x³/3! + ...
ln(1+x) = x − x²/2 + x³/3 − x⁴/4 + ...       for |x| < 1
```

**Source correction:** The supplied book prints factorial denominators in its `ln(1+x)` line. The correct logarithm series uses `2, 3, 4, ...` as shown in the [NIST Digital Library of Mathematical Functions](https://dlmf.nist.gov/4.6.E1); the factorial denominators belong to the exponential series.

Think of `1+x` as a **dimensionless width multiplier**. If a 2 cm card becomes 3 cm wide, then `x = 0.5` because `3/2 = 1.5 = 1+x`. The following bounds concern the multiplier and its logarithm; a square's area multiplier would be their square.

| Proposition | Conditions and bound | At `x = 0.5` |
| :--- | :--- | :--- |
| B.2 | If `x > −1`, `x/(1+x) ≤ ln(1+x) ≤ x`. | `1/3 ≤ ln 1.5 ≈ 0.405 ≤ 1/2`. |
| B.3 | If `0 ≤ x < 1`, `1+x ≤ e^x ≤ 1/(1−x)`. | `1.5 ≤ e^0.5 ≈ 1.649 ≤ 2`. |
| B.4 | If `x,n > 0`, `(1+x/n)^n ≤ e^x ≤ (1+x/n)^(n+x/2)`. | With `n = 2`: `1.5625 ≤ e^0.5 ≤ 1.25^2.25 ≈ 1.652`. |

The inequalities give lower and upper estimates without evaluating `ln` or `e^x` exactly. B.4 permits positive **real** `n`; when `n` is a whole number of compounding steps, `(1+x/n)^n` approaches `e^x` as `n` grows.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Integer Functions and Relations

<span id="part-2-rounding"></span>

### 1. Floor, ceiling, and remainder

The **floor** `⌊x⌋` is the greatest integer at most `x`; the **ceiling** `⌈x⌉` is the least integer at least `x`. Suppose a board has 10 columns of tiles, and we package columns in groups of 3:

```text
⌊10/3⌋ = 3 complete groups.
⌈10/3⌉ = 4 groups needed to hold all columns.
10 mod 3 = 10 − 3⌊10/3⌋ = 1 leftover column.
```

For nonnegative integers `a` and positive integer `b`, the appendix defines `a mod b = a − b⌊a/b⌋`. In Python, `10 // 3` is `3` and `10 % 3` is `1`. The identity `10 = 3×3 + 1` checks the quotient and remainder.

<span id="part-2-counting"></span>

### 2. Factorials, combinations, and bounds (B.5–B.6)

`n!` means `1×2×...×n`, with `0! = 1`. Four **distinct** cards can be placed in a row in `4! = 24` orders. If we only choose two of those four for a display, order no longer matters:

```text
C(4,2) = 4!/(2!2!) = 6 selections.
In general, C(n,k) = n!/[k!(n−k)!] for 0 ≤ k ≤ n.
```

The binomial expansion uses the same choice count. If each of two display positions offers `a = 2` blue designs or `b = 3` red designs, there are `(2+3)² = 25` complete designs. Grouping them by how many positions use blue gives:

```text
(a+b)^n = Σ_{k=0}^n C(n,k) a^k b^(n−k).
(2+3)² = C(2,0)3² + C(2,1)2×3 + C(2,2)2² = 9 + 12 + 4 = 25.
```

Proposition B.5 bounds the number of selections when `1 ≤ k ≤ n`:

```text
(n/k)^k ≤ C(n,k) ≤ n^k/k!.                      (B.5)
```

For four cards and two chosen, `4 ≤ 6 ≤ 8`. The printed proposition also mentions `k = 0`, but its lower expression divides by `k`; handle that endpoint separately with `C(n,0) = 1`.

Proposition B.6, **Stirling's approximation**, estimates a large factorial:

```text
n! = √(2πn) (n/e)^n [1 + 1/(12n) + ε(n)],
where ε(n) = O(1/n²).                          (B.6)
```

For `n = 5`, the leading estimate `√(10π)(5/e)^5` is about `118`, close to the exact `5! = 120`. The correction factor improves it. This is a growth estimate; use the exact factorial when counting a small set of cards.

<span id="part-2-fibonacci"></span>

### 3. Fibonacci growth (B.7)

The book defines `F₀ = 0`, `F₁ = 1`, and `Fₙ = Fₙ₋₁ + Fₙ₋₂`. Thus the values begin `0, 1, 1, 2, 3, 5, 8, ...`. One geometry picture is tiling a 1 cm × `n` cm strip with 1×1 squares and 1×2 dominoes. Let `Tₙ` count its tilings. The first tile is either a square or a domino, so:

```text
T₀ = 1, T₁ = 1, and Tₙ = Tₙ₋₁ + Tₙ₋₂.
T₄ = 5 = F₅.
```

The tiling sequence is **shifted**: `Tₙ = Fₙ₊₁`, rather than `Fₙ`. Proposition B.7 says `Fₙ = Θ(φ^n)` for `φ = (1+√5)/2 ≈ 1.618`. The symbol `Θ` describes growth for large `n`; it does not say each term equals `φ^n`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Summations

<span id="part-3-basic"></span>

### 1. Rearranging and telescoping sums (B.8–B.11)

Arrange unit tiles in a staircase with row lengths `1, 2, 3, 4`. Its area is `1+2+3+4 = 10 cm²`, written `Σ_{i=1}^4 i = 10`.

| Rule | Meaning in the workshop | Small check |
| :--- | :--- | :--- |
| B.8: `Σ_{i=1}^n a f(i) = a Σ_{i=1}^n f(i)` if `a` is constant | Double every row's tile count. | `2(1+2+3+4) = 20`. |
| B.9: `Σ_{i=1}^n Σ_{j=1}^m f(i,j) = Σ_{j=1}^m Σ_{i=1}^n f(i,j)` | Count a rectangular board by rows or columns. | A 2×3 board has `6` tiles either way. |
| Telescoping: `Σ_{i=1}^n [f(i)−f(i−1)] = f(n)−f(0)` | Add only the new tiles when a square grows. | `(1−0)+(4−1)+(9−4)+(16−9) = 16`. |
| B.10: `Σ_{i=1}^n i = n(n+1)/2` | Area of the tile staircase. | At `n = 4`, `4×5/2 = 10`. |
| B.11: `Σ_{i=1}^n i² = n(n+1)(2n+1)/6` | Stack square boards of sides `1` through `n`. | At `n = 4`, `1+4+9+16 = 30`. |

For the telescoping row, use `f(i) = i²`: the newly added L-shaped layer has `i²−(i−1)² = 2i−1` tiles. Most middle terms cancel when the layers are added. B.8 requires `a` to stay the same for every `i`; otherwise it cannot simply move outside the sum.

```python
n = 4
staircase = sum(range(1, n + 1))
new_square_tiles = sum(i*i - (i-1)*(i-1) for i in range(1, n + 1))
print(staircase, new_square_tiles)  # 10 16
```

<span id="part-3-powers"></span>

### 2. Power sums (B.12)

Proposition B.12 says that for a **fixed integer** `k ≥ 1`, `Σ_{i=1}^n i^k = Θ(n^(k+1))`. The staircase sum for `k = 1` grows quadratically. The stacked-square sum for `k = 2` grows cubically, even though each individual square has area `i²`.

```text
Exact at n = 4: 1² + 2² + 3² + 4² = 30.
Growth as n increases: Σ_{i=1}^n i² = Θ(n³).
```

The exponent `k` is fixed while `n` grows. The `Θ` statement gives a growth class, not the exact value `n^(k+1)`.

<span id="part-3-series"></span>

### 3. Geometric and harmonic sums (B.13–B.16)

**B.13, finite geometric sum.** Make four 1 cm-high rectangular strips with widths `1, 2, 4, 8 cm`. Their combined area is `15 cm²`:

```text
Σ_{i=0}^n a^i = (a^(n+1) − 1)/(a − 1), for a > 0 and a ≠ 1.
At a = 2, n = 3: 1 + 2 + 4 + 8 = (2⁴−1)/(2−1) = 15.
```

**B.14, infinite geometric sum.** Now use widths `1, 1/2, 1/4, 1/8, ... cm`. The total area approaches a limit:

```text
Σ_{i=0}^∞ a^i = 1/(1−a), for 0 < a < 1.
At a = 1/2: 1 + 1/2 + 1/4 + ... = 2; the strip area approaches 2 cm².
```

The infinitely many strips are an idealized limit; each **finite** group has area below `2 cm²`.

**B.15, weighted geometric sum.** If stage `i` has a rectangle of height `i cm` and width `(1/2)^i cm`, its area is `i(1/2)^i cm²`. The appendix gives the exact finite sum for integer `n ≥ 2`:

```text
Σ_{i=1}^n i a^i
  = [a − (n+1)a^(n+1) + n a^(n+2)]/(1−a)², for a > 0, a ≠ 1.
At a = 1/2, n = 3: 1/2 + 2/4 + 3/8 = 11/8; the area is 11/8 cm².
```

**B.16, harmonic sum.** Make 1 cm-high strips of widths `1, 1/2, 1/3, ... cm`. Their total area through strip `n` is the harmonic number `Hₙ`:

```text
Hₙ = Σ_{i=1}^n 1/i, and Hₙ = ln n + Θ(1).
H₄ = 1 + 1/2 + 1/3 + 1/4 = 25/12 ≈ 2.083; the area is about 2.083 cm².
```

The difference between `Hₙ` and `ln n` stays bounded as `n` grows; the formula does **not** say `Hₙ = ln n` exactly. Unlike the shrinking geometric strips in B.14, harmonic strip areas keep accumulating without a finite limit.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Basic Probability

<span id="part-4-space"></span>

### 1. Sample spaces and events (Examples B.17–B.18)

Use a 2×4 board of eight 1 cm² tiles. Each tile is independently shaded or left clear with equal probability. One **outcome** is a complete shading layout; the **sample space** `S` is the set of all layouts. Because each of eight positions has two choices, `S` has `2⁸ = 256` outcomes. This is the same counting idea as the book's Example B.17, where five coin flips give `2⁵ = 32` possible sequences.

```text
Tile positions:       1 2 3 4
                      5 6 7 8
One possible layout:  ■ □ ■ □
                      □ □ ■ □
```

An **event** is a set of outcomes, such as “tile 1 is shaded.” Example B.18 uses a different experiment that can continue indefinitely: repeat a fair shade/clear trial until the first marked result. Its terminating sequences are `M`, `UM`, `UUM`, and so on (`M` = marked, `U` = unmarked). There are infinitely many such finite sequences. The immediate success `M` is the zero-unmarked case. An endless run of unmarked results has probability zero, but it is also a possible path.

<span id="part-4-events"></span>

### 2. Independence and conditional probability

A probability assignment satisfies `Pr(∅)=0`, `Pr(S)=1`, and `0≤Pr(A)≤1`. For **disjoint** events `A` and `B`, `Pr(A∪B)=Pr(A)+Pr(B)`. For instance, “tile 1 is shaded” and “tile 1 is clear” are disjoint and together cover every layout, so their probabilities add to `1/2+1/2=1`.

Let `A` mean tile 1 is shaded and `B` mean tile 2 is shaded. Because their shade choices are independent, `Pr(A)=Pr(B)=1/2` and `Pr(A∩B)=1/4 = Pr(A)Pr(B)`. For three or more events, **mutual independence** requires the product rule for *every subset* of those events, not merely for each pair.

**Conditional probability** asks about `A` after learning `B` happened:

```text
Pr(A given B) = Pr(A∩B)/Pr(B), provided Pr(B) > 0.
Here, Pr(tile 1 shaded given tile 2 shaded) = (1/4)/(1/2) = 1/2.
```

We do not divide by `Pr(B)=0`: conditioning on an impossible event is undefined in this elementary formula.

<span id="part-4-expectation"></span>

### 3. Random variables and expectations (B.19–B.22)

A **random variable** maps each outcome to a number. Let `Iᵢ` be `1` if tile `i` is shaded and `0` otherwise. It is an **indicator**. The total number of shaded tiles is `X = I₁+...+I₈`, and its numeric value is also the shaded area in cm². For a discrete random variable, its **expected value** is the probability-weighted average:

```text
E[X] = Σ_x x Pr(X = x).
E[Iᵢ] = 1×(1/2) + 0×(1/2) = 1/2.
```

**B.19, linearity of expectation:** `E[X+Y]=E[X]+E[Y]` and `E[cX]=cE[X]`. Therefore `E[I₁+...+I₈]=8×(1/2)=4`. This addition rule does **not** require the indicators to be independent, although our shading choices happen to be independent.

The book's Examples B.20 and B.22 use two fair dice. Give them a geometry meaning: one die chooses a rectangle's width `W` in cm and the other independently chooses its height `H` in cm. Each die has mean `(1+2+3+4+5+6)/6 = 3.5 cm`.

| Book result | Rectangle interpretation | Expected value |
| :--- | :--- | :--- |
| B.20 and B.19: sum | `W+H`, the sum of two side lengths. | `3.5+3.5 = 7 cm`; expected perimeter `2(W+H)` is `14 cm`. |
| B.21 and B.22: independent product | `WH`, the rectangle's area. | `E[W]E[H] = 3.5² = 49/4 = 12.25 cm²`. |

The two dice have the **same distribution**, but their width and height outcomes need not be equal. The product rule `E[WH]=E[W]E[H]` requires independence; the sum rule does not.

<span id="part-4-tail"></span>

### 4. A tail bound for marked tiles (B.23)

If we ask how likely the shaded count is to be **much larger than its mean**, Proposition B.23 gives a Chernoff upper bound. It applies to a finite sum of independent 0/1 variables. For `X = Σ Iᵢ`, let `μ = E[X] > 0` and choose `δ > 0`:

```text
Pr(X > (1+δ)μ) < [e^δ / (1+δ)^(1+δ)]^μ.       (B.23)
```

Our eight tiles have `μ = 4`. With `δ = 1/2`, the event is `X > 6`, meaning seven or eight shaded tiles. We can count its exact probability for this tiny board:

```text
Pr(X > 6) = [C(8,7) + C(8,8)]/2⁸ = 9/256 ≈ 0.035.
```

```python
from math import comb

favorable_layouts = comb(8, 7) + comb(8, 8)
print(favorable_layouts, favorable_layouts / 2**8)  # 9 0.03515625
```

The bound's right side is about `0.649`, so it is valid but loose here. Its value is a guaranteed upper estimate, not the exact probability. Independence and the positive mean are essential conditions.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Useful Mathematical Techniques

<span id="part-5-bounds"></span>

### 1. Limits, split sums, and integral bounds (B.24)

**L'Hôpital's rule (B.24)** can compare functions that both grow without bound. Extend a square board's side `n` to a positive real variable `t`. Its perimeter is `4t`, its area is `t²`, and both tend to infinity. Differentiating numerator and denominator shows:

```text
lim_{t→∞} (4t)/(t²) = lim_{t→∞} 4/(2t) = 0.
```

The rule needs more than “both go to infinity”: the functions must be differentiable eventually, the denominator derivative must be nonzero there, and the derivative ratio must have a limit. It compares **limits**; `4t/t²` and `4/(2t)` are not equal at a fixed `t`.

To analyze a sum, choose a split point `j` between `1` and `n`:

```text
Σ_{i=1}^n f(i) = Σ_{i=1}^j f(i) + Σ_{i=j+1}^n f(i).
For four staircase rows split after row 2: 1+2+3+4 = (1+2)+(3+4).
```

The appendix also bounds a sum using the area under a **nondecreasing** function `f`, assuming the integrals exist over the indicated ranges:

```text
∫_{a−1}^b f(x) dx ≤ Σ_{i=a}^b f(i) ≤ ∫_a^{b+1} f(x) dx.
```

With `f(x)=x`, `a=1`, and `b=4`, the lower integral is `∫_0^4 x dx = 8`; the staircase sum is `10`; the upper integral is `∫_1^5 x dx = 12`. So `8 ≤ 10 ≤ 12`. The integrals are rectangle-area comparisons, not claims that a program ran for 8 or 12 steps.

<span id="part-5-master"></span>

### 2. Three recursion patterns (B.25)

Suppose a routine splits a strip of `n` unit tiles into `a` smaller strips of size `n/b`, recursively processes them, and then does `f(n)` extra work. Its recurrence is `T(n)=aT(n/b)+f(n)`, with constants `a≥1`, `b>1`, and a constant-size base case. The **master method** compares `f(n)` with `n^p`, where `p=log_b a`.

For a simple picture, split the strip into **two halves**, so `a=b=2` and `p=1`. Assume `n` is a power of 2:

| Work done at each split | Master-method case | Result |
| :--- | :--- | :--- |
| `f(n)=1`: inspect one seam. | B.25(1): `f(n)=O(n^(p−ε))` for some `ε>0`. | `T(n)=Θ(n^p)=Θ(n)`. |
| `f(n)=n`: scan every tile in this strip. | B.25(2): `f(n)=Θ(n^p log^k n)` with `k=0`. | `T(n)=Θ(n^p log^(k+1) n)=Θ(n log n)`. |
| `f(n)=n²`: compare every ordered tile pair. | B.25(3): `f(n)=Ω(n^(p+ε))` and `a f(n/b) ≤ c f(n)` for some `0<c<1` eventually. | `T(n)=Θ(f(n))=Θ(n²)`. |

For the last row, `2 f(n/2) = 2(n/2)² = n²/2`, so the regularity condition `a f(n/b) ≤ c f(n)` holds with `c = 1/2 < 1` for sufficiently large `n`. That `c < 1` requirement matters: fast growth of `f(n)` alone is not enough for the third case. The method describes **work performed by the routine**; the strip's physical area remains `n cm²` in every row.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Connected Geometry Study Cases

<details>
<summary><strong>Case Study 1: How many strips fit, and how many groups are needed?</strong></summary>

**Scenario:** A 10 cm-wide board is cut into groups of at most three 1 cm-wide columns.

**Calculation:** `10 = 3×3 + 1`. Thus `⌊10/3⌋ = 3` complete groups, `10 mod 3 = 1` leftover column, and `⌈10/3⌉ = 4` groups to hold all columns.

**Why the distinction matters:** Floor counts full groups; ceiling counts the containers required even when the final container is not full.

</details>

<details>
<summary><strong>Case Study 2: Can an infinite collection of strips have finite area?</strong></summary>

**Scenario:** Every new 1 cm-high strip is half as wide as the previous one: `1, 1/2, 1/4, ... cm`.

**Calculation:** The first four widths sum to `1+1/2+1/4+1/8 = 15/8`; their area is `1.875 cm²`. B.14 says the total area of the infinite idealized collection approaches `2 cm²`.

**Contrast within this geometry:** If widths are `1, 1/2, 1/3, ... cm` instead, B.16 gives a harmonic total that grows without a finite bound. The widths still shrink, but not fast enough for their areas to add to a finite limit.

</details>

<details>
<summary><strong>Case Study 3: When does multiplying two averages give an average area?</strong></summary>

**Scenario:** A die chooses width `W` and another independent die chooses height `H`, each from `1` through `6` cm. Then `E[WH] = 3.5×3.5 = 12.25 cm²`.

**Change one condition:** If the **same** die value sets both dimensions, the card is always square, so `W=H`. Its expected area is `E[W²] = (1²+2²+3²+4²+5²+6²)/6 = 91/6 ≈ 15.17 cm²`. The averages of width and height are still both `3.5 cm`, but their product `12.25 cm²` is no longer the expected area. B.21 needs independence.

</details>

<details>
<summary><strong>Case Study 4: Does a recursive board routine inherit the board's area growth?</strong></summary>

**Scenario:** A routine divides an `n`-tile strip into two half-strips until one tile remains.

**Result:** Checking one seam at each split takes `Θ(n)` total work. Scanning every tile at each split takes `Θ(n log n)` work. Comparing every ordered pair of tiles at each split takes `Θ(n²)` work. These are three different routines on the **same `n` tiles**.

**Lesson:** Write the actual recurrence `T(n)=2T(n/2)+f(n)` and identify `f(n)` before choosing a master-method case.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Appendix B part | Main mathematical tool | Connected geometry use |
| :--- | :--- | :--- |
| **Logarithms and exponents** | Reverse powers, simplify products and ratios, bound exponential growth. | Count side doublings and compare rectangle areas. |
| **Integer functions and relations** | Round group counts, count selections, estimate factorials, follow Fibonacci growth. | Package tile columns, choose cards, and tile a narrow strip. |
| **Summations** | Add staged areas; recognize telescoping, geometric, and harmonic patterns. | Build staircases, growing squares, and shrinking strips. |
| **Basic probability** | Specify outcomes and events; calculate expectation and upper-tail bounds. | Shade a tile board at random or choose rectangle dimensions with dice. |
| **Mathematical techniques** | Compare limits, bound sums by integrals, and solve recurrences. | Analyze a growing board and routines that repeatedly split a strip. |

The appendix's formulas serve different questions: **exact counts**, **bounds**, **probabilities**, or **long-run growth**. First identify which question the card or tile problem asks, then apply the formula with its stated conditions.

[🔝 Back to Top](#top)
