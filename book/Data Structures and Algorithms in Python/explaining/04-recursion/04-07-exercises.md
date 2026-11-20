<span id="top"></span>

# Recursion — Section 4.7: Exercises

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.7 (printed pages 180–182).  
> **Topic:** Reinforcement R-4.1–R-4.8, Creativity C-4.9–C-4.22, and Projects P-4.23–P-4.27.  
> **Domain focus:** The **MotoGP race at the 2026 San Marino and Rimini Riviera Grand Prix**, held at Misano on Sunday, 13 September 2026.  
> **Learning goal:** Turn every exercise into a small base case, a smaller subproblem, a checkable answer, and an honest time and space analysis.  
> **User Prompt:** "Reexplain [Section 4.7] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]"

---

## Table of Contents

1. [Background & Conceptual Intuition: One Race, Many Small Problems](#background-intuition)
   - [1. Verified race data and teaching values](#background-race)
   - [2. A five-question method for every exercise](#background-method)
2. [Part 1: Reinforcement, R-4.1–R-4.8](#part-1)
   - [1. Maximum, powers, and reversal](#part-1-traces)
   - [2. Choices, numbers, and pairwise work](#part-1-more)
3. [Part 2: Creativity, C-4.9–C-4.22](#part-2)
   - [1. Numeric results and branching](#part-2-numeric)
   - [2. Strings, partitions, and search](#part-2-sequences)
4. [Part 3: Projects, P-4.23–P-4.27](#part-3)
   - [1. Traverse entries and solve letter puzzles](#part-3-search)
   - [2. Draw ruler ticks, move disks, and yield directories](#part-3-tools)
5. [Part 4: Complete Runnable Study Program](#part-4)
   - [1. Program](#part-4-program)
   - [2. Read the output](#part-4-results)
6. [Part 5: Work Through Five Boundary Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Race, Many Small Problems

<span id="background-race"></span>

### 1. Verified Race Data and Teaching Values

As in the [Sections 4.1–4.6 explanations](04-01-illustrative-examples.md), the setting is **Sunday's MotoGP race at Misano on 13 September 2026**. The four riders below are a **selection** from that race. [MotoGP's race report](https://www.motogp.com/en/news/2026/09/13/marc-marquez-capitalises-on-bezzecchi-error-to-seize-title-race-lead/1089345) identifies their places and teams; [Ducati's final Grand Prix results](https://www.ducati.com/ww/en/racing/motogp/calendar/misano) give the gaps to winner Marc Márquez. [Yamaha's race report](https://www.yamaha-motogp.com/2026/newsletter/race/en/260913132359254/13-09-2026-quartararo-secures-top-10-finish-in-san-marino-gp) independently confirms Fabio Quartararo's P10 and `+23.229 s`.

| Place | Rider | Team | Gap to winner | Integer gap |
| ---: | :--- | :--- | ---: | ---: |
| P1 | Marc Márquez | Ducati Lenovo Team | 0.000 s | 0 ms |
| P2 | Álex Márquez | BK8 Gresini Racing MotoGP | +0.657 s | 657 ms |
| P3 | Pedro Acosta | Red Bull KTM Factory Racing | +2.326 s | 2,326 ms |
| P10 | Fabio Quartararo | Monster Energy Yamaha MotoGP | +23.229 s | 23,229 ms |

The selected winner-relative gaps form `[0, 657, 2326, 23229]` milliseconds. Their sum, `26212 ms`, is a **teaching checksum**, not a combined race gap or a MotoGP statistic. Card orders, photo counts, rank weights, file trees, rulers, and Hanoi disks below are also invented exercises. Actual rider identities and teams stay attached to their real race results.

Section 4.7 contains **questions**, not a supplied set of worked answers. Its Reinforcement, Creativity, and Projects groups ask for different levels of design. The exercise IDs and original numeric/string puzzles below identify the book's questions; the solutions and Misano teaching cases are our explanations. The Chapter Notes after P-4.27 are historical reading, not another exercise to solve.

**Why use one race?** Reusing the same four records lets us change the algorithm without silently changing the input facts. **How to use the examples:** keep the official gaps in milliseconds for arithmetic, and label every invented rule before computing with it.

<span id="background-method"></span>

### 2. A Five-Question Method for Every Exercise

| Ask | Example from the selected race |
| :--- | :--- |
| **State:** What does one call still need to solve? | The first `n` gaps, an index interval, or unused rider cards. |
| **Base:** What can be answered immediately? | One value is its own maximum; an empty subset has one arrangement. |
| **Progress:** What becomes smaller? | `n` drops, bounds move inward, or an unused card is chosen. |
| **Combine:** How is the smaller answer used? | Take `max`, add a last value, or place one disk after two smaller moves. |
| **Cost:** What happens across all calls? | Count leaves, additions, printed output, and maximum active depth separately. |

A tiny example checks the idea but does not replace a general argument. For instance, four gap labels make Isabel's pairwise sum easy to trace, while `n/2 + n/4 + ⋯ + 1` explains the running time for every power-of-two input size.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-4.1–R-4.8

<span id="part-1-traces"></span>

### 1. Maximum, Powers, and Reversal

#### R-4.1 — Find a Maximum Recursively

**Problem.** Find the maximum in a sequence of `n` values and give running time and extra space. For a **nonempty** sequence, let `M(n)` mean the maximum of its first `n` values:

```text
M(1) = S[0]
M(n) = max(M(n - 1), S[n - 1]) for n > 1.
```

On the four selected gap labels, the return values are `0 → 657 → 2326 → 23229`; the maximum of **this selected list** is Fabio's `23229 ms`. The recurrence makes `n` calls, each with one comparison, so time is `Θ(n)` and additional call-stack space is `Θ(n)`. An empty list has no maximum unless the caller specifies a special convention; a runnable function should reject it.

**Why this example?** The increasing real gaps let us verify every returned maximum by sight. **How to solve it:** answer the one-value case, find the maximum of the shorter prefix, then compare it with the last value. State the nonempty-input precondition.

#### R-4.2 — Trace the Traditional `power(2, 5)`

Code Fragment 4.11 decreases the exponent by one per call. The exact requested trace is:

```text
Calls down:      power(2,5) → power(2,4) → power(2,3)
                 → power(2,2) → power(2,1) → power(2,0)
Returns upward:  1 → 2 → 4 → 8 → 16 → 32
```

There are **six calls** and five multiplications. Imagine a hypothetical Marc/Fabio photo display starting with one slot and doubling for five rounds; it has `2^5 = 32` slots. That display is not official attendance or race points.

**Why this example?** Doubling makes each unwinding multiplication visible. **How to solve it:** include the exponent-zero base call, then multiply its result by two at every return.

#### R-4.3 — Trace Repeated Squaring for `power(2, 18)`

Code Fragment 4.12 computes the half-power **once**, squares it, and adds one factor of `2` only when the current exponent is odd. The exact requested exponent path is `18 → 9 → 4 → 2 → 1 → 0`:

| Returning exponent | Saved half-power | Calculation | Answer |
| ---: | ---: | :--- | ---: |
| `0` | — | Base case. | 1 |
| `1` | 1 | `1² × 2` | 2 |
| `2` | 2 | `2²` | 4 |
| `4` | 4 | `4²` | 16 |
| `9` | 16 | `16² × 2` | 512 |
| `18` | 512 | `512²` | 262,144 |

Six calls reach `2^18 = 262144`, compared with 19 calls for the traditional version at exponent 18. This is a calculation about an exponent; it does not represent an actual MotoGP crowd or record. It can be pictured as a very large **invented** photo display.

**Why this example?** Exponent 9 forces the odd-case correction, while 18 shows the benefit of halving. **How to solve it:** trace calls down first, then use each saved half-power exactly once on the way up.

#### R-4.4 — Trace the Book's Reversal

The exercise specifies the book's list `S = [4, 3, 6, 2, 6]` and `reverse(S, 0, 5)`. The `stop` bound is exclusive:

| Call's range | Action | List afterward |
| :---: | :--- | :--- |
| `[0, 5)` | Swap indices 0 and 4. | `[6, 3, 6, 2, 4]` |
| `[1, 4)` | Swap indices 1 and 3. | `[6, 2, 6, 3, 4]` |
| `[2, 3)` | One middle item remains; return. | `[6, 2, 6, 3, 4]` |

The trace has **three calls and two swaps**. As a separate Misano teaching check, reversing a row of the four **whole** rider cards gives Fabio, Pedro, Álex, Marc. It changes a display, not their finishing positions or paired team/gap facts.

**Why keep the book's exact list?** Its repeated `6` tests whether we follow indices instead of guessing from values. **How to solve it:** swap the active ends, advance `start`, reduce `stop`, and stop when fewer than two positions remain.

<span id="part-1-more"></span>

### 2. Choices, Numbers, and Pairwise Work

#### R-4.5 — Trace `PuzzleSolve(3, [], {a,b,c,d})`

The source asks for the **call tree**, not just the number of possible words. Choose `a,b,c,d` as an illustrative iteration order; the source's set does not promise that order. With no early successful test, the tree levels are:

| Level | Calls at that level | What each call does |
| :--- | ---: | :--- |
| `k = 3` | 1 | Start with an empty prefix. |
| `k = 2` | 4 | One call for each first letter. |
| `k = 1` | `4 × 3 = 12` | One call per two-letter prefix; test either remaining third letter inside this call. |

Thus the full tree has **17 calls**, maximum depth 3, and **`4 × 3 × 2 = 24` completed three-letter tests**. The twelve `k = 1` prefixes are `ab, ac, ad; ba, bc, bd; ca, cb, cd; da, db, dc`. For example, prefix `ab` tests `abc` and `abd`; those tests do **not** add `k = 0` calls in the book's pseudocode. If a puzzle test succeeds early, fewer calls or tests may run.

Four distinct Misano rider cards—Marc, Álex, Pedro, Fabio—would likewise have 24 possible ordered three-card displays. Those arrangements are invented. To implement the pseudocode in Python, do not remove an item from a set **while iterating that same set**; iterate a stable snapshot or use an indexable list, and restore shared state before an early return.

**Why this example?** It separates **function calls** from **candidate tests**, which happen inside the `k = 1` calls. **How to solve it:** draw three levels of prefixes, multiply the available choices at each step, and keep early-stop behavior separate from the full potential tree.

#### R-4.6 — Build the Harmonic Number

The harmonic number is `H_n = 1 + 1/2 + ⋯ + 1/n`. Use `H_0 = 0` and, for `n ≥ 1`, `H_n = H_(n−1) + 1/n`. For three terms, `H_3 = 1 + 1/2 + 1/3 = 11/6`. This can be imagined as **invented rank weights** for Marc, Álex, and Pedro, not as MotoGP points.

**Why three terms?** Fractions `1`, `1/2`, and `1/3` are easy to add by hand and show the base case clearly. **How to solve it:** recurse to zero, then add `1/n` as each call returns. There are `n + 1` calls, `Θ(n)` time, and `Θ(n)` stack space under constant-cost arithmetic.

#### R-4.7 — Convert a Digit String to an Integer

The source's example is the string `"13531"`, whose integer value is `13,531`. To connect it to the race, parse Fabio's **real** gap label `"23229"` as `23229` milliseconds. Let `D(n)` parse the first `n` ASCII digits:

```text
D(0) = 0
D(n) = 10 × D(n - 1) + value_of_digit(s[n - 1]).
```

For `"23229"`, the shorter prefix `"2322"` gives `2322`, then `10 × 2322 + 9 = 23229`. A helper with an index `n` avoids making new substring copies; it takes `Θ(n)` time and `Θ(n)` call-stack space in the usual unit-cost model. The public input should be a nonempty string of ASCII digits; the internal empty prefix is its base case. Leading zeroes naturally disappear in the resulting integer.

**Why this example?** Fabio's published gap already has a five-digit millisecond spelling. **How to solve it:** parse one fewer digit, shift that value left one decimal place by multiplying by ten, then add the last digit.

#### R-4.8 — Count Isabel's Pairwise Summation Work

For a power-of-two sequence length, Isabel replaces adjacent pairs by their sums until one value remains. On our four selected gaps:

```text
[0, 657, 2326, 23229]
       ↓ 2 additions
[657, 25555]
       ↓ 1 addition
[26212]
```

The last value is our **teaching checksum**, not a meaningful combined finishing gap. For `n` values, the rounds perform `n/2 + n/4 + ⋯ + 1 = n - 1` additions. Equivalently, `T(n) = T(n/2) + Θ(n)` gives **`Θ(n)` time**, despite only `log₂ n` rounds. If `n = 1`, return its one value immediately instead of trying to build a half-length list.

**Why this example?** Four values show every pair and both rounds. **How to solve the cost question:** sum the work over *all* rounds; counting rounds alone misses the additions inside them.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity, C-4.9–C-4.22

These exercises ask you to design an algorithm, not merely trace one. State what a recursive call promises to return, then make every call shrink its input. The race data remain the selected Misano records above; any photo cards, thresholds, or strings used for teaching are identified as such.

<span id="part-2-numeric"></span>

### 1. Numeric Results and Branching

#### C-4.9 — Find Minimum and Maximum Without Loops

For a nonempty sequence `S`, let `extremes(S, n)` return `(smallest, largest)` among its first `n` values. One item is both extremes. Otherwise solve the first `n-1` values, then compare `S[n-1]` with each answer:

```text
extremes(S, 1) = (S[0], S[0])
extremes(S, n) = (min(low, S[n-1]), max(high, S[n-1]))
                 where (low, high) = extremes(S, n-1)
```

For `[0, 657, 2326, 23229]`, the result is `(0, 23229)`: Marc Márquez has the smallest selected winner-relative gap, and Fabio Quartararo the largest. There are `n-1` recursive reductions and a constant number of comparisons per reduction, so time and call stack are both **`Θ(n)`**.

**Why this example?** The endpoints are easy to verify against the race table. **How to solve it:** return *both* answers from one smaller call; do not make a separate full traversal for each extreme, and do not use a loop because the question forbids loops.

#### C-4.10 — Compute `⌊log₂ n⌋` with Addition and Integer Division

For positive integer `n`, halving discards one binary place. Thus:

```text
log_floor(1) = 0
log_floor(n) = 1 + log_floor(n // 2)  for n ≥ 2
```

Eight hypothetical photo slots take `8 → 4 → 2 → 1`, so `⌊log₂ 8⌋ = 3`. For `n = 23229`, Fabio's gap expressed as an integer millisecond count, the result is `14`, because `2¹⁴ ≤ 23229 < 2¹⁵`. The result is a calculation *on* a race value, not a MotoGP statistic. The recursion uses **`Θ(log n)` time and stack**; `n = 0` is outside its stated positive-input domain.

**Why this example?** The tiny power of two exposes exactly when the recursion stops. **How to solve it:** use `// 2`, add one on return, and never try to compute a floating-point logarithm.

#### C-4.11 — Decide Whether All Entries Are Unique

With sorting excluded, test a new entry against the entries before it, then recurse on the shorter prefix. An index helper avoids copying slices:

```text
unique_prefix(1) = True
unique_prefix(n) = unique_prefix(n-1)
                   and S[n-1] differs from every S[0..n-2]
```

The four selected integer gaps are unique. The surname list `["Márquez", "Márquez", "Acosta", "Quartararo"]` is not, even though Marc and Álex are different riders. In the all-distinct case the comparisons total `1 + 2 + ⋯ + (n-1) = n(n-1)/2`, so **`O(n²)` time** and **`O(n)` active recursion stack**. A recursive inner scan can meet the no-sorting goal without a loop.

**Why this example?** It shows that uniqueness depends on the chosen field. **How to solve it:** decide what counts as an entry first, compare the last one with all earlier ones, and stop early on a duplicate.

#### C-4.12 — Multiply Using Only Addition and Subtraction

For positive integers `m` and `n`, repeated addition gives `product(m, 1) = m` and `product(m, n) = m + product(m, n-1)`. With the natural extension `product(m, 0) = 0`, the same recurrence also handles zero. Two chosen rider labels printed on three **hypothetical** photo cards each make `2 + 2 + 2 = 6` labels.

**Why this example?** A 2-by-3 situation makes multiplication as repeated addition visible. **How to solve it:** subtract one from the second argument at each call and add `m` while returning. For positive `n`, this uses **`Θ(n)` additions and stack frames**. No multiplication operator is needed in the algorithm.

#### C-4.13 — Count Dashes in a Ruler Interval

The book's `draw_interval(c)` prints two order-`c-1` intervals around one central tick of `c` dash characters. Let `D(c)` count **dash characters**, not printed lines:

```text
D(0) = 0
D(c) = 2D(c-1) + c
D(c) = 2^(c+1) - c - 2
```

At `c = 3`, the seven interior tick lengths are `1, 2, 1, 3, 1, 2, 1`. They contain `1+2+1+3+1+2+1 = 11` dashes. To prove the formula by induction, assume `D(c-1) = 2^c - c - 1`; substitution gives `2(2^c-c-1)+c = 2^(c+1)-c-2`. The number of lines is instead `2^c-1`. Printing takes **`Θ(2^c)` output work** and **`O(c)` stack depth**.

**Why this example?** Order three is small enough to count every dash. **How to solve it:** identify exactly what is counted, write the two-smaller-pieces recurrence, then check a small `c` before simplifying it.

#### C-4.14 — Design Towers of Hanoi

Treat three **hypothetical** disks carrying Marc, Pedro, and Fabio photo labels as different sizes; the labels do not imply any comparison of riders. To move `n` disks from peg `A` to peg `C`, move the top `n-1` from `A` to `B`, move the largest from `A` to `C`, then move the `n-1` from `B` to `C`.

The move count is `M(0)=0` and `M(n)=2M(n-1)+1=2^n-1`; three disks take seven moves. Each recursive call decreases `n`, so the process ends. It uses **`Θ(2^n)` time/output** and **`O(n)` active stack** when moves are printed as they happen.

**Why this example?** Three labeled disks make the seven moves checkable. **How to solve it:** describe the movement of the smaller stack *before* writing code; the middle move can happen only after the largest disk is exposed.

#### C-4.15 — Generate Every Subset

For each distinct input item, choose **exclude** or **include**, then recurse on the next index. At the end, output the current subset. With the ordered teaching set `[Marc Márquez, Pedro Acosta, Fabio Quartararo]`, the eight possible groups include `∅`, each singleton, each pair, and all three. These are rider-card groups, not race results.

There are `2^n` subsets. Copying or printing each subset costs up to `O(n)` per leaf, giving **`O(n2^n)` total time**, **`O(n)` recursion stack**, and up to `O(n2^n)` storage if all subsets are retained instead of streamed.

**Why this example?** Three items expose the complete choice tree without a long list. **How to solve it:** make exactly two branches per item and output only when the index reaches `n`; include the empty subset.

<span id="part-2-sequences"></span>

### 2. Strings, Partitions, and Search

#### C-4.16 — Output a String in Reverse

To **output** characters without repeatedly copying strings, recurse to the end and print the current character while calls unwind:

```python
def print_reverse(text, index=0):
    if index == len(text):
        return
    print_reverse(text, index + 1)
    print(text[index], end="")
```

`print_reverse("FABIO")` outputs `OIBAF`; this is a string demonstration, not a new rider name. The empty string prints nothing. This index version takes **`Θ(n)` time and `Θ(n)` stack**. A version that recursively builds `text[1:]` and concatenates strings is simpler to read but can take `Θ(n²)` time in Python because it copies characters repeatedly.

**Why this example?** Five letters make the unwind order visible. **How to solve it:** postpone printing until after the smaller recursive call.

#### C-4.17 — Test a Palindrome

Compare the first and last characters. If they match, recurse on the interval inside them; if they differ, return `False` immediately. Empty and one-character intervals are `True`.

```text
pal(text, left, right):
    if left >= right: True
    if text[left] != text[right]: False
    otherwise: pal(text, left+1, right-1)
```

`"FABIO"` is false; the invented symmetric code `"FABIOIBAF"` is true. Here comparison is exact, with no case folding or punctuation removal. At most half the characters are compared, giving **`Θ(n)` worst-case time and stack**.

**Why this example?** The two strings differ only in the property being tested. **How to solve it:** move both bounds inward and use `left >= right` as the stopping case.

#### C-4.18 — More Vowels Than Consonants?

For this exercise, treat `a, e, i, o, u` (either case) as vowels, other English letters as consonants, and ignore spaces and punctuation. Recursively add `+1` for a vowel, `-1` for a consonant, or `0` otherwise. Return whether the final score is **strictly positive**.

`"Fabio"` scores `+1`: three vowels (`a`, `i`, `o`) and two consonants (`F`, `b`). `"Marc"` scores `-2`: one vowel and three consonants. The scan takes **`Θ(n)` time and stack**.

**Why this example?** Two real first names produce opposite answers with very short traces. **How to solve it:** define the alphabet rule first, then carry one count difference through the recursion; a tie must return `False`.

#### C-4.19 — Put Even Integers Before Odd Integers

Use two indices on an integer sequence: move `left` past even values and `right` past odd values; if both stop, swap the misplaced values and recurse on the smaller interval. For selected winner-relative gaps, `[0, 657, 2326, 23229]` can become `[0, 2326, 657, 23229]`. Here `0` and `2326` are even, while `657` and `23229` are odd. Parity is only a teaching grouping, never a race ranking.

Each bound advances across the sequence at most once, so **`O(n)` time** and **`O(n)` recursive stack** suffice. The order *inside* the two groups need not be preserved. If using rider records rather than bare gaps, swap complete `(gap, rider, team)` records so a gap never loses its rider.

**Why this example?** The existing race numbers happen to contain both parities. **How to solve it:** write the partition condition first, then only swap a wrong-side even value with a wrong-side odd value.

#### C-4.20 — Partition an Unsorted Sequence Around `k`

The input is **unsorted**. Use the same two-bound method, but accept values `≤ k` on the left and values `> k` on the right. With the intentionally shuffled teaching order `[23229, 0, 657, 2326]` and chosen threshold `k=1000 ms`, one valid partition is `[657, 0, 23229, 2326]`. The elements within each side need no order.

At each step at least one bound moves, so the algorithm takes **`O(n)` time and `O(n)` stack**. Equality belongs to the left group. If the sequence consists of race records, move whole records, not gap values alone.

**Why this example?** The shuffled input prevents us from accidentally relying on sorted order. **How to solve it:** scan past already-correct values, swap two wrong-side values, and stop once the bounds cross.

#### C-4.21 — Find Two Distinct Entries with Sum `k`

Here the input **is sorted** and its integers are **distinct**. Begin at both ends. If `S[left] + S[right]` is too small, increase `left`; if it is too large, decrease `right`; if equal, return the two entries. Stop with no answer when `left >= right`.

For `[0, 657, 2326, 23229]` and invented arithmetic target `k=2983`, the checks are `0+23229` (too large), `0+2326` (too small), then `657+2326=2983`. The match is Álex Márquez's and Pedro Acosta's **gaps**, not a combined race result. Each bound moves at most `n-1` times, giving **`O(n)` time and `O(n)` recursive stack**.

**Why this example?** It requires both pointer directions and returns two different positions. **How to solve it:** use sortedness to discard one impossible endpoint per call; never let one item pair with itself.

#### C-4.22 — Replace Recursive Repeated Squaring with a Loop

Keep `result * base^exponent` equal to the original `x^n`. Start with `(result, base, exponent) = (1, x, n)`. If the exponent is odd, multiply `result` by `base`; then square `base` and halve the exponent with `// 2`. When the exponent reaches zero, `result` is the answer.

```python
def power_iterative(x, n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    result, base, exponent = 1, x, n
    while exponent:
        if exponent % 2:
            result *= base
        base *= base
        exponent //= 2
    return result
```

For the invented doubling example `2^5`, the states finish with `32`; for `n=0`, the loop is skipped and returns `1`. There are **`Θ(log n)` loop iterations** for positive `n` and **`O(1)` auxiliary variables** under the usual unit-cost arithmetic model.

**Why this example?** An odd exponent makes the conditional step visible. **How to solve it:** translate each recursive half-size step into an update of `base` and `exponent`, while `result` stores contributions already removed from the exponent.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Projects, P-4.23–P-4.27

Projects turn a recurrence into a usable program. For filesystem tasks, the directory examples here are **imaginary study folders**; the code below does not create or change any files. For the letter puzzles, the words belong to the book and are not race data.

<span id="part-3-search"></span>

### 1. Traverse Entries and Solve Letter Puzzles

#### P-4.23 — Report Every Matching Name Below a Directory

Suppose an invented study folder has both `Ducati Lenovo Team/lap-notes.txt` and `Monster Energy Yamaha MotoGP/lap-notes.txt`. A search for `lap-notes.txt` should print **both** paths. The recursive step checks each immediate entry, then searches every child directory:

```python
import os

def find_all(root, target_name):
    with os.scandir(root) as entries:
        for entry in entries:
            if entry.name == target_name:
                print(entry.path)
            if entry.is_dir(follow_symlinks=False):
                find_all(entry.path, target_name)
```

For a directory tree with `N` entries and maximum depth `h`, checking names takes **`Θ(N)` entry visits** and **`O(h)` active recursive calls**, plus the cost of constructing and printing matching paths. The code does not follow directory symlinks, which keeps a link from sending the search around a cycle. Directory traversal order is filesystem dependent.

**Why this example?** Duplicate filenames in two team folders expose the key requirement: report *all* matches. **How to solve it:** visit the current directory once, print every matching entry, and recurse into every child directory even after finding a match.

#### P-4.24 — Solve Three Cryptarithms by Backtracking

The book asks for digit assignments in `POT + PAN = BIB`, `DOG + CAT = PIG`, and `BOY + GIRL = BABY`. Each distinct letter gets a distinct decimal digit. We also use the standard convention that a multi-digit word cannot start with zero; the source's explicit constraint is distinct digits. Assign one letter at a time, try unused digits, and undo the assignment when returning from a branch.

```python
def solve_cryptarithm(first, second, total):
    letters = sorted(set(first + second + total))
    if len(letters) > 10:
        return None
    leading = {first[0], second[0], total[0]}
    assigned = {}
    used = set()

    def number(word):
        result = 0
        for letter in word:
            result = 10 * result + assigned[letter]
        return result

    def search(index):
        if index == len(letters):
            if number(first) + number(second) == number(total):
                return assigned.copy()
            return None
        letter = letters[index]
        for digit in range(10):
            if digit in used or (digit == 0 and letter in leading):
                continue
            assigned[letter] = digit
            used.add(digit)
            answer = search(index + 1)
            used.remove(digit)
            del assigned[letter]
            if answer is not None:
                return answer
        return None

    return search(0)
```

Here is **one valid solution to each puzzle**, checked by addition; the program may find different valid assignments because it returns the first one in its search order:

| Book puzzle | One valid numeric equation |
| :--- | :--- |
| `POT + PAN = BIB` | `137 + 105 = 242` |
| `DOG + CAT = PIG` | `364 + 210 = 574` |
| `BOY + GIRL = BABY` | `345 + 2790 = 3135` |

If there are `L` distinct letters, an unpruned exhaustive search considers at most `10!/(10-L)!` complete digit assignments. Testing an assignment scans the puzzle words, so this simple solver can be expensive for eight letters. Its recursion and assignment state use `O(L)` space. A faster extension can reject partial assignments whenever a completed units, tens, or hundreds column fails, but that pruning is not needed for correctness.

**Why this example?** The three given puzzles test the same backtracking rule on different word lengths. **How to solve it:** maintain an assignment and used-digit set, check the full equation at a leaf, and always restore both pieces of state before returning from a candidate branch.

<span id="part-3-tools"></span>

### 2. Draw Ruler Ticks, Move Disks, and Yield Directories

#### P-4.25 — Draw an Interval Without Recursion

For ruler order `c`, number the interior positions from `1` to `2^c-1`. The tick at a position has one dash plus one for every factor of two in that position. This yields the same order as the recursive ruler algorithm:

```python
def draw_interval_iterative(c):
    if c < 0:
        raise ValueError("c must be nonnegative")
    for position in range(1, 1 << c):
        tick = 1
        value = position
        while value % 2 == 0:
            tick += 1
            value //= 2
        print("-" * tick)
```

For `c=3`, it prints `-`, `--`, `-`, `---`, `-`, `--`, `-` on seven lines, containing eleven dashes as C-4.13 predicted. For `c=0`, it prints no interior ticks. Printing costs **`Θ(2^c)` characters** overall; the loop uses **`O(1)` auxiliary variables**.

**Why this example?** It directly checks the dash-count proof. **How to solve it:** use the position's factors of two to recover each tick height, then print ticks in increasing position order.

#### P-4.26 — Print a Towers of Hanoi Solution

The plan from C-4.14 becomes a three-line recursive movement pattern. The function below prints a move only after it has moved the smaller stack out of the way:

```python
def hanoi(n, source, target, spare):
    if n < 0:
        raise ValueError("n must be nonnegative")
    if n == 0:
        return
    hanoi(n - 1, source, spare, target)
    print(f"{source} -> {target}")
    hanoi(n - 1, spare, target, source)
```

`hanoi(3, "A", "C", "B")` emits these seven moves:

```text
A -> C
A -> B
C -> B
A -> C
B -> A
B -> C
A -> C
```

The order obeys the rule that no larger disk rests on a smaller one. For `n` disks the program prints `2^n-1` moves, taking **`Θ(2^n)` time** and **`O(n)` stack**.

**Why this example?** Seven lines are short enough to check manually against three disks. **How to solve it:** keep `source`, `target`, and `spare` roles explicit in the two recursive calls.

#### P-4.27 — Reimplement the Recursive Part of `os.walk`

The generator yields one triple for the current directory, then triples for every child directory. Each triple contains the path, immediate subdirectory names, and immediate nondirectory names:

```python
import os

def walk_recursive(root):
    dirs, files = [], []
    with os.scandir(root) as entries:
        for entry in entries:
            if entry.is_dir():
                dirs.append(entry.name)
            else:
                files.append(entry.name)
    yield root, dirs, files
    for dirname in dirs:
        child = os.path.join(root, dirname)
        if not os.path.islink(child):  # match os.walk's default no-follow behavior
            yield from walk_recursive(child)
```

For the invented folder in P-4.23, the root yield lists its two team directories; each team directory yields its own `lap-notes.txt`. Even an empty directory yields a triple with two empty lists. With `N` entries and depth `h`, entry visits are **`Θ(N)`**; active recursion takes `O(h)` stack space, plus the lists retained by active calls. The filesystem decides the unsorted yield order. The generator skips descent through directory symlinks like `os.walk` does by default.

**Why this example?** It distinguishes visiting individual matching entries from yielding a summary of *every directory*. **How to solve it:** collect one directory's immediate names, yield its triple, then recursively yield each child directory.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Runnable Study Program

This program combines representative techniques from the 27 exercises. The remaining exercises have their own algorithms or code in Parts 1–3. The program uses the four **selected** Misano race records and labels its invented arithmetic targets and rider-card sets.

<span id="part-4-program"></span>

### 1. Program

```python
# Selected riders from the Sunday 13 September 2026 Misano MotoGP race.
# Each gap is to winner Marc Márquez and is stored in milliseconds.
results = [
    ("Marc Márquez", "Ducati Lenovo Team", 0),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 657),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 2326),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP", 23229),
]
gaps = [gap for _, _, gap in results]


def maximum_prefix(values, n):                 # R-4.1
    if n == 1:
        return values[0]
    earlier = maximum_prefix(values, n - 1)
    return earlier if earlier >= values[n - 1] else values[n - 1]


def parse_digits(text, index=0, value=0):     # R-4.7
    if index == len(text):
        return value
    digit = ord(text[index]) - ord("0")
    return parse_digits(text, index + 1, 10 * value + digit)


def pairwise_total(values):                    # R-4.8, power-of-two length
    if len(values) == 1:
        return values[0]
    shorter = [values[i] + values[i + 1]
               for i in range(0, len(values), 2)]
    return pairwise_total(shorter)


def extremes(values, n):                      # C-4.9
    if n == 1:
        return values[0], values[0]
    low, high = extremes(values, n - 1)
    last = values[n - 1]
    return min(low, last), max(high, last)


def all_subsets(items):                       # C-4.15
    answer = []

    def choose(index, current):
        if index == len(items):
            answer.append(tuple(current))
            return
        choose(index + 1, current)            # exclude this card
        current.append(items[index])
        choose(index + 1, current)            # include this card
        current.pop()                          # restore for other branches

    choose(0, [])
    return answer


def two_sum_sorted(values, target, left, right):  # C-4.21
    if left >= right:
        return None
    total = values[left] + values[right]
    if total == target:
        return values[left], values[right]
    if total < target:
        return two_sum_sorted(values, target, left + 1, right)
    return two_sum_sorted(values, target, left, right - 1)


def power_iterative(base, exponent):          # C-4.22
    if exponent < 0:
        raise ValueError("exponent must be nonnegative")
    result = 1
    while exponent:
        if exponent % 2:
            result *= base
        base *= base
        exponent //= 2
    return result


def ruler_ticks(order):                       # P-4.25
    ticks = []
    for position in range(1, 1 << order):
        height, value = 1, position
        while value % 2 == 0:
            height += 1
            value //= 2
        ticks.append("-" * height)
    return ticks


def hanoi_moves(n, source, target, spare):    # P-4.26
    if n == 0:
        return
    yield from hanoi_moves(n - 1, source, spare, target)
    yield f"{source} -> {target}"
    yield from hanoi_moves(n - 1, spare, target, source)


largest = maximum_prefix(gaps, len(gaps))
largest_rider = next(name for name, _, gap in results if gap == largest)
cards = ["Marc Márquez", "Pedro Acosta", "Fabio Quartararo"]
moves = list(hanoi_moves(3, "A", "C", "B"))

print("Selected Misano winner-relative gaps:", gaps)
print("Largest selected gap:", largest, "ms —", largest_rider)
print("Parsed Fabio gap:", parse_digits("23229"), "ms")
print("Pairwise teaching checksum:", pairwise_total(gaps), "ms")
print("Selected minimum and maximum:", extremes(gaps, len(gaps)))
print("Three rider cards form", len(all_subsets(cards)), "subsets")
print("Invented target 2983 ms:",
      two_sum_sorted(gaps, 2983, 0, len(gaps) - 1))
print("Invented doubling example 2^5:", power_iterative(2, 5))
print("Order-3 ruler ticks:", ruler_ticks(3))
print("Three-disk Hanoi move count:", len(moves))
```

<span id="part-4-results"></span>

### 2. Read the Output

```text
Selected Misano winner-relative gaps: [0, 657, 2326, 23229]
Largest selected gap: 23229 ms — Fabio Quartararo
Parsed Fabio gap: 23229 ms
Pairwise teaching checksum: 26212 ms
Selected minimum and maximum: (0, 23229)
Three rider cards form 8 subsets
Invented target 2983 ms: (657, 2326)
Invented doubling example 2^5: 32
Order-3 ruler ticks: ['-', '--', '-', '---', '-', '--', '-']
Three-disk Hanoi move count: 7
```

The values labeled **teaching** or **invented** are checks of algorithms, not race classifications. `all_subsets` stores every generated group and `list(hanoi_moves(...))` stores every move, so these particular demonstrations use output-size memory. The streaming versions described earlier avoid retaining all output.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Work Through Five Boundary Cases

| Case | What to check | Correct handling |
| :--- | :--- | :--- |
| **Empty input** | What is the maximum of `[]`? What are the subsets of `[]`? | Maximum/minimum need a stated nonempty precondition or a chosen error. Subset generation outputs **one** subset, `∅`. A palindrome test on `""` is `True`. |
| **One item** | What happens to `[23229]`? | Its minimum, maximum, and pairwise total are all `23229`. No comparison or pair addition is needed. |
| **Zero argument** | What do `x^0`, `draw_interval(0)`, and `hanoi(0, ...)` do? | Return `1`, print no interior ruler ticks, and make no disk moves. `⌊log₂ 0⌋` is outside C-4.10's positive-input domain. |
| **Duplicate field or endpoint** | Are Marc and Álex's surnames unique? May C-4.21 use the same element twice? | The surname field contains a duplicate, while the four selected gap integers are distinct. Two-sum requires `left < right`, so one entry cannot pair with itself. |
| **No match or empty folder** | What should the two filesystem projects produce? | P-4.23 prints no path when nothing matches. P-4.27 still yields `(path, [], [])` for an empty directory. Both examples skip symlink descent. |

**Why these cases?** They force every base case and input promise to be explicit. **How to check your solution:** run the smallest admissible input, one input just beyond it, and one input that should fail or return no answer before trying a large race list.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Exercise group | Main habit to practice | Cost lesson |
| :--- | :--- | :--- |
| **R-4.1–R-4.8** | Trace the base case, recursive calls, and returned values exactly. | Count work inside each call and each level; shallow depth alone does not mean low total work. |
| **C-4.9–C-4.22** | Define a smaller state and an answer it promises to return; honor restrictions such as no loops or no sorting. | Linear scans, quadratic pair checks, logarithmic halving, and exponential branching arise from different call structures. |
| **P-4.23–P-4.27** | Turn the recurrence into a program that handles all required outputs and restores state during backtracking. | Reporting or storing output has a cost beyond the recursion stack. |

The same selected Misano results can support several algorithm questions, but each question needs its own interpretation: a rider's gap is an official result; a sum, parity group, card set, ruler, or disk move built from it is a teaching device. When designing your own solution, write the **input promise**, **base case**, **smaller call**, **combination rule**, and **time/space count** in that order.

[🔝 Back to Top](#top)
