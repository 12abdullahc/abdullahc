<span id="top"></span>

# 13.3 Dynamic Programming — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 13, Section 13.3, printed pages 594–600 (the supplied PDF).<br>
> **Topic:** 13.3 Dynamic Programming; 13.3.1 Matrix Chain-Product; 13.3.2 DNA and Text Sequence Alignment.<br>
> **Domain Focus:** Transforming a square's vertex coordinates with matrices and comparing direction strings for squares of two sizes.<br>
> **User Prompt:** Reexplain [`Section 13.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Two Views of a Square](#background)
   - [1. Vertices as a matrix](#background-vertices)
   - [2. A route as a string](#background-routes)
2. [Part 1: 13.3 Dynamic Programming](#part-1)
   - [1. Why store answers to smaller problems?](#part-1-smaller)
   - [2. The two kinds of subproblems in this section](#part-1-two)
3. [Part 2: 13.3.1 Matrix Chain-Product](#part-2)
   - [1. Multiplication cost and parentheses](#part-2-cost)
   - [2. Define the best cost for a subchain](#part-2-subproblem)
   - [3. Fill the square-geometry cost table](#part-2-table)
   - [4. Python code and complexity](#part-2-code)
4. [Part 3: 13.3.2 DNA and Text Sequence Alignment](#part-3)
   - [1. Subsequence versus substring](#part-3-subsequence)
   - [2. The dynamic programming ingredients](#part-3-ingredients)
   - [3. Define the LCS recurrence](#part-3-recurrence)
   - [4. Fill a route-comparison table](#part-3-table)
   - [5. Recover an actual subsequence](#part-3-backtrack)
   - [6. Python code and complexity](#part-3-code)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Two Views of a Square

<span id="background-vertices"></span>

### 1. Vertices as a matrix

Continue the square-drawing activity from Sections 13.1 and 13.2. A unit square has four corners: `(0, 0)`, `(1, 0)`, `(1, 1)`, and `(0, 1)`. We can put one corner on each **row** of a matrix. For the matrix example, write each point as `(x, y, 1)`; the extra `1` lets a matrix express a translation such as “move right 2 and up 3.”

```text
V = [0 0 1]     four vertices, three numbers per vertex
    [1 0 1]
    [1 1 1]
    [0 1 1]
```

Thus `V` is a **4 × 3** matrix. With points written as **row vectors**, use this **3 × 3** translation matrix `T` and **3 × 2** projection matrix `Q`:

```text
T = [1 0 0]     Q = [1 0]
    [0 1 0]         [0 1]
    [2 3 1]         [0 0]
```

For any point, `(x, y, 1)T = (x + 2, y + 3, 1)`, and multiplying by `Q` keeps the first two coordinates. The product `VTQ` therefore gives a **4 × 2** matrix of translated points:

```text
(2, 3), (3, 3), (3, 4), (2, 4)
```

This is still a unit square, moved right 2 and up 3. We will ask **which multiplication order calculates those coordinates with fewer scalar multiplications**.

<span id="background-routes"></span>

### 2. A route as a string

We can also describe a square with unit-move letters: `E` east, `N` north, `W` west, and `S` south. Starting at the origin:

| Route | Meaning | Final position |
| :---- | :------ | :------------- |
| `X = "ENWS"` | Go once around a 1-by-1 square. | (0, 0) |
| `Y = "EENNWWSS"` | Go once around a 2-by-2 square. | (0, 0) |

`X` has four moves and `Y` has eight. The shapes have different side lengths and areas, but their **direction order** has something in common. We will ask **how long a sequence of moves can be found in both strings while keeping its order**.

The matrix and string questions look different. Both become manageable when we name smaller problems, save their answers in a table, and build larger answers from those saved values.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 13.3 Dynamic Programming

<span id="part-1-smaller"></span>

### 1. Why store answers to smaller problems?

**Dynamic programming** solves a problem by defining smaller, related problems and recording their answers. A larger answer is calculated from answers already stored. The section uses a **bottom-up table**: begin with the smallest cases, then fill the cases that depend on them.

The reason to save answers is **overlap**. A direct recursive search may ask for the same smaller answer in many branches. Saving it once can turn an exponential search into a polynomial-time calculation when the problem has suitable structure.

For our geometry activity, a small answer might be “the cheapest way to multiply `TQ`” or “the longest shared direction sequence between the first two characters of `X` and the first three of `Y`.” Each later cell reuses earlier cells.

<span id="part-1-two"></span>

### 2. The two kinds of subproblems in this section

| Problem | Small question stored in one cell | What the final cell answers |
| :------ | :-------------------------------- | :-------------------------- |
| Matrix chain-product | Cheapest way to multiply a **consecutive subchain** of matrices. | Minimum scalar-multiplication count for the whole chain. |
| Longest common subsequence (LCS) | Length of the best shared subsequence of **two prefixes**. | Length of a longest shared move sequence. |

In each case, an optimal full solution must contain optimal smaller solutions. Otherwise, replacing a suboptimal smaller part with a better one would improve the full solution. This is **optimal substructure**. Many candidate full solutions ask about the same subchain or prefix pair, giving us **overlapping subproblems**.

> **Mental model:** Decide what one table cell means, write how it depends on smaller cells, fill the cells in a safe order, and then read or reconstruct the final answer.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 13.3.1 Matrix Chain-Product

<span id="part-2-cost"></span>

### 1. Multiplication cost and parentheses

Multiplying an `a × b` matrix by a `b × c` matrix produces an `a × c` matrix. The **standard matrix multiplication algorithm** takes `a × b × c` scalar multiplications: each of the `a × c` output entries needs a dot product of length `b`.

Matrix multiplication is **associative**: `(AB)C` and `A(BC)` give the same result when the dimensions fit. Their intermediate matrix sizes, and therefore their costs, can differ. Parentheses change the calculation order; they do **not** rearrange the matrices.

The book's example uses a `2 × 10` matrix `B`, a `10 × 50` matrix `C`, and a `50 × 20` matrix `D`:

| Parentheses | First product | Second product | Total scalar multiplications |
| :---------- | :------------ | :------------- | ---------------------------: |
| `(BC)D` | `2 × 10 × 50 = 1,000` | `2 × 50 × 20 = 2,000` | **3,000** |
| `B(CD)` | `10 × 50 × 20 = 10,000` | `2 × 10 × 20 = 400` | **10,400** |

For our square, the chain is `VTQ`, with dimensions `4 × 3`, `3 × 3`, and `3 × 2`:

| Parentheses | First product | Second product | Total scalar multiplications |
| :---------- | :------------ | :------------- | ---------------------------: |
| `(VT)Q` | `4 × 3 × 3 = 36` | `4 × 3 × 2 = 24` | **60** |
| `V(TQ)` | `3 × 3 × 2 = 18` | `4 × 3 × 2 = 24` | **42** |

Both orders produce the same four translated vertices listed in the background. Multiplying `TQ` first saves **18 scalar multiplications** for these four points.

<span id="part-2-subproblem"></span>

### 2. Define the best cost for a subchain

For a longer chain, trying every legal placement of parentheses grows exponentially. We instead describe the matrices as `A₀, A₁, ..., Aₙ₋₁`, where `Aᵢ` has dimensions `dᵢ × dᵢ₊₁`. Define `N[i][j]` as the **minimum scalar-multiplication count** for the consecutive chain `Aᵢ ... Aⱼ`.

A single matrix needs no multiplication, so `N[i][i] = 0`. For `i < j`, consider each possible final split `k` between `i` and `j`. The left product `Aᵢ ... Aₖ` has dimensions `dᵢ × dₖ₊₁`; the right product `Aₖ₊₁ ... Aⱼ` has dimensions `dₖ₊₁ × dⱼ₊₁`. Their final multiplication costs `dᵢ × dₖ₊₁ × dⱼ₊₁`.

```text
N[i][i] = 0

N[i][j] = min over i ≤ k < j of
          N[i][k] + N[k+1][j] + d[i] × d[k+1] × d[j+1]
```

For every candidate `k`, the recurrence adds **the best left cost**, **the best right cost**, and **the final multiplication cost**. If either side of an optimal parenthesization were not itself optimal, we could replace it and lower the full cost.

<span id="part-2-table"></span>

### 3. Fill the square-geometry cost table

Our dimension list is `d = [4, 3, 3, 2]`, corresponding to `A₀ = V`, `A₁ = T`, and `A₂ = Q`. Fill one-matrix cases first, then two-matrix cases, then the three-matrix case:

| Cell | Calculation | Minimum cost |
| :--- | :---------- | -----------: |
| `N[0][0]`, `N[1][1]`, `N[2][2]` | One matrix needs no product. | 0 |
| `N[0][1]` for `VT` | `4 × 3 × 3` | 36 |
| `N[1][2]` for `TQ` | `3 × 3 × 2` | 18 |
| `N[0][2]`, split after `V` | `0 + 18 + 4 × 3 × 2` | **42** |
| `N[0][2]`, split after `T` | `36 + 0 + 4 × 3 × 2` | 60 |

The final cell is `N[0][2] = min(42, 60) = 42`. Its winning split is after `V`, giving `V(TQ)`. In a larger chain, each interval cell is filled only after the shorter intervals it needs.

<span id="part-2-code"></span>

### 4. Python code and complexity

```python
def matrix_chain_cost(dimensions):
    n = len(dimensions) - 1
    cost = [[0] * n for _ in range(n)]

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            cost[i][j] = min(
                cost[i][k]
                + cost[k + 1][j]
                + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]
                for k in range(i, j)
            )
    return cost


cost = matrix_chain_cost([4, 3, 3, 2])
print(cost[0][2])  # 42
```

`length` increases from 2 to `n`, so every shorter subchain needed by a cell has already been solved. There are `O(n²)` interval cells, and a cell can try `O(n)` split positions. The total time is **`O(n³)`**, and the table uses **`O(n²)` space**.

Like the book's `matrix_chain` function, this code returns a **cost table**, not a parenthesized expression. For our three matrices we can see the winning split by hand. To recover parentheses for a longer chain, also record the minimizing `k` for each cell or reconstruct it from the completed costs.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 13.3.2 DNA and Text Sequence Alignment

The section next uses dynamic programming to compare sequences such as DNA and versions of a text file. We will compare the square routes `X = "ENWS"` and `Y = "EENNWWSS"` in the same way.

<span id="part-3-subsequence"></span>

### 1. Subsequence versus substring

A **subsequence** keeps the original order of selected characters but may skip characters between them. A **substring** must be consecutive. The route `"ENWS"` is a subsequence of `"EENNWWSS"`: choose one `E`, then one `N`, then one `W`, then one `S`. It is **not** a substring, because those four characters are not adjacent in `Y`.

```text
Y:  E E N N W W S S     2-by-2 square route
X:  - E - N - W - S     select one move in each direction
```

The dashes mark characters skipped from `Y`; they are not robot moves. Interpreting the selected `ENWS` as a **new route** gives a 1-by-1 square, while the full `Y` draws a 2-by-2 square. A common subsequence describes **shared symbol order**, not equal geometric size or area.

A **longest common subsequence (LCS)** of `X` and `Y` is a common subsequence with as many characters as possible. Here `X` itself is common, so the LCS length is **4**. The book contrasts a brute-force search through up to `2ⁿ` subsequences of a length-`n` string, potentially `O(2ⁿm)` work when testing each against a length-`m` string, with the dynamic programming table below.

<span id="part-3-ingredients"></span>

### 2. The dynamic programming ingredients

The book identifies three useful ingredients for a dynamic programming solution. The LCS problem has all three:

| Ingredient | Meaning for LCS | Square-route example |
| :--------- | :-------------- | :------------------- |
| Simple indexed subproblems | Use two prefix lengths `j` and `k`. | Compare `X[:2] = "EN"` with `Y[:3] = "EEN"`. |
| Optimal substructure | A best answer comes from a best answer for shorter prefixes. | After matching the last `N`, add it to the best earlier `E` match. |
| Overlapping subproblems | Different choices ask for the same prefix pair. | Store each `L[j][k]` once instead of recalculating it. |

We store **lengths** in the table first. A separate walk through that table recovers an actual sequence of letters.

<span id="part-3-recurrence"></span>

### 3. Define the LCS recurrence

Let `L[j][k]` be the LCS length for prefixes `X[:j]` and `Y[:k]`. If either prefix is empty, the common length is zero. Otherwise, look at their **last** characters, `X[j-1]` and `Y[k-1]`:

```text
L[0][k] = 0, and L[j][0] = 0.

If X[j-1] == Y[k-1]:
    L[j][k] = 1 + L[j-1][k-1]
Otherwise:
    L[j][k] = max(L[j-1][k], L[j][k-1])
```

When the last characters match, extend a best subsequence of the two shorter prefixes by that character. When they differ, a common subsequence cannot use **both** last characters, so try omitting the last character of `X` or omitting the last character of `Y` and take the better result.

The indexes are easy to mix up: `j` and `k` are **prefix lengths** and table coordinates, while `j-1` and `k-1` are the zero-based string indexes of their last characters.

<span id="part-3-table"></span>

### 4. Fill a route-comparison table

Fill the zero row and column, then each remaining cell from its already computed left, upper, or diagonal neighbor. The table for `X = "ENWS"` and `Y = "EENNWWSS"` is:

```text
              Y characters →   -  E  E  N  N  W  W  S  S
X prefix / last character
empty                          0  0  0  0  0  0  0  0  0
E                              0  1  1  1  1  1  1  1  1
EN                             0  1  1  2  2  2  2  2  2
ENW                            0  1  1  2  2  3  3  3  3
ENWS                           0  1  1  2  2  3  3  4  4
```

For a **matching** example, `L[2][3]` compares `"EN"` with `"EEN"`. Their last characters are both `N`, so `L[2][3] = 1 + L[1][2] = 2`. For a **mismatch**, `L[2][5]` compares `"EN"` with `"EENNW"`. The last characters are `N` and `W`, so `L[2][5] = max(L[1][5], L[2][4]) = max(1, 2) = 2`.

The lower-right cell gives **`L[4][8] = 4`**, the LCS length of the full routes. The table contains lengths, not the actual letters of a chosen LCS.

<span id="part-3-backtrack"></span>

### 5. Recover an actual subsequence

Start at the lower-right cell and move toward the zero row or column. If the last characters match, record that character and move **diagonally**. If they differ, move to the neighbor whose LCS length equals the current best value. In a tie, the code below moves **up** by reducing `j`.

| Current cell | Decision | Characters collected in reverse order |
| :----------- | :------- | :------------------------------------ |
| `(4, 8)` | `S == S`: record `S`, move diagonally. | `S` |
| `(3, 7)` | `W != S`: move left to `(3, 6)`. | `S` |
| `(3, 6)` | `W == W`: record `W`. | `SW` |
| `(2, 5)` | `N != W`: move left to `(2, 4)`. | `SW` |
| `(2, 4)` | `N == N`: record `N`. | `SWN` |
| `(1, 3)` | `E != N`: move left to `(1, 2)`. | `SWN` |
| `(1, 2)` | `E == E`: record `E`. | `SWNE` |

Reverse the collected letters to obtain **`ENWS`**. It has length 4, matching the table's final value. The PDF's solution-code docstring uses the word “substring,” but this backtracking allows skipped characters and therefore constructs a **subsequence**.

<span id="part-3-code"></span>

### 6. Python code and complexity

```python
def lcs_table(x, y):
    n, m = len(x), len(y)
    table = [[0] * (m + 1) for _ in range(n + 1)]

    for j in range(1, n + 1):
        for k in range(1, m + 1):
            if x[j - 1] == y[k - 1]:
                table[j][k] = 1 + table[j - 1][k - 1]
            else:
                table[j][k] = max(table[j - 1][k], table[j][k - 1])
    return table


def lcs_solution(x, y, table):
    j, k = len(x), len(y)
    backward = []

    while j > 0 and k > 0 and table[j][k] > 0:
        if x[j - 1] == y[k - 1]:
            backward.append(x[j - 1])
            j -= 1
            k -= 1
        elif table[j - 1][k] >= table[j][k - 1]:
            j -= 1
        else:
            k -= 1
    return "".join(reversed(backward))


x, y = "ENWS", "EENNWWSS"
table = lcs_table(x, y)
print(table[len(x)][len(y)])  # 4
print(lcs_solution(x, y, table))  # ENWS
```

The table has `(n + 1)(m + 1)` cells and takes **`O(nm)` time and space** to fill. Backtracking moves up, left, or diagonally on every step, so it takes **`O(n + m)` additional time**. Like the book's code, `lcs_table` returns the **length table**; `lcs_solution` separately returns one actual longest common subsequence. When several LCS strings exist, the tie rule determines which one this implementation returns.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does the best matrix order depend on the number of vertices?</strong></summary>

**Scenario:** Instead of translating four square corners, we translate just **one** point with the same `T` and `Q`. Its vertex matrix is now `1 × 3`.

**Problem:** `V(TQ)` was cheaper for four vertices, so it is tempting to assume it is always cheaper.

**Fix:** Recalculate with dimensions `[1, 3, 3, 2]`. `(VT)Q` costs `1 × 3 × 3 + 1 × 3 × 2 = 9 + 6 = 15`. `V(TQ)` costs `3 × 3 × 2 + 1 × 3 × 2 = 18 + 6 = 24`.

**Result:** With one point, **`(VT)Q` is cheaper**. The same transformation can have a different best parenthesization when matrix dimensions change.

</details>

<details>
<summary><strong>Case Study 2: Why does `find` miss a common square route?</strong></summary>

**Scenario:** `X = "ENWS"` is the unit-square route and `Y = "EENNWWSS"` is the 2-by-2-square route.

**Problem:** `Y.find(X)` returns `-1`, which might seem to say the routes have nothing in common.

**Fix:** `find` requires a **contiguous substring**. LCS allows skips: select the second `E`, second `N`, second `W`, and second `S` from `Y`.

**Result:** `X` is a common **subsequence** of length 4, even though it is not a substring of `Y`.

</details>

<details>
<summary><strong>Case Study 3: Do closed routes with a large LCS draw the same shape?</strong></summary>

**Scenario:** Compare `"ENWS"` with `"EWNS"`. Both routes start and end at (0, 0).

**Problem:** Equal endpoints and many shared letters might be mistaken for equal drawings.

**Fix:** Trace the paths. `ENWS` encloses a 1-by-1 square; `EWNS` moves east then west, north then south, retracing two line segments. Their LCS length is 3, with `"ENS"` and `"EWS"` both valid longest common subsequences.

**Result:** LCS measures **ordered text similarity**. It does not calculate enclosed area or prove two routes have the same geometry.

</details>

<details>
<summary><strong>Case Study 4: What happens with an empty route?</strong></summary>

**Scenario:** A drawing has no instructions, `X = ""`, while `Y = "ENWS"` traces a unit square.

**Problem:** There are no characters in `X` to match, and a table lookup must still have a defined answer.

**Fix:** Use the base case `L[0][k] = 0` for every prefix length `k` of `Y`.

**Result:** The LCS length is **0**, and `lcs_solution` returns `""`. Geometrically, the empty instruction sequence makes no moves.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 13.3 idea | Smaller answer saved | Rule for a larger answer | Geometry result |
| :---------------- | :------------------- | :----------------------- | :-------------- |
| **Dynamic programming** | Answers to indexed subproblems. | Reuse stored answers in a bottom-up table. | Repeated matrix subchains or route-prefix pairs are solved once. |
| **Matrix chain-product** | `N[i][j]`: cheapest cost for a consecutive matrix subchain. | Try each final split and choose the smallest total cost. | `V(TQ)` takes **42** scalar multiplications versus **60** for `(VT)Q`. |
| **Longest common subsequence** | `L[j][k]`: LCS length for two prefixes. | Matching last letters add 1 diagonally; mismatches take the larger neighbor. | `ENWS` is an LCS of `ENWS` and `EENNWWSS`, of length **4**. |
| **Backtracking** | The completed LCS length table. | Follow matching letters and best neighboring cells. | Recover the actual move sequence `ENWS`. |

The two applications share one central idea: **define a precise smaller problem and save its answer**. The matrix table minimizes arithmetic work without changing the transformed square. The LCS table finds ordered similarity between route strings without assuming their drawn shapes are identical.

[🔝 Back to Top](#top)
