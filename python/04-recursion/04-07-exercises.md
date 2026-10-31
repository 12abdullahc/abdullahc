<span id="top"></span>

# 4.7 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 4, Section 4.7, printed pages 180–182 (the supplied PDF).  
> **Topic:** 4.7 Exercises: Reinforcement R-4.1–R-4.8, Creativity C-4.9–C-4.22, and Projects P-4.23–P-4.27.  
> **Domain Focus:** Rectangle-card areas, card arrangements, a workshop ruler, size-ranked disks, and nested card records.  
> **User Prompt:** Reexplain [`Section 4.7`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: One Workshop, Many Recursive Questions](#background)
   - [1. Fix the card data and study extensions](#background-cards)
   - [2. Read each exercise as a design question](#background-checklist)
2. [Part 1: Reinforcement Exercises, R-4.1–R-4.8](#part-1)
   - [1. Recursion traces and choices, R-4.1–R-4.5](#part-1-traces)
   - [2. Numbers and level-by-level sums, R-4.6–R-4.8](#part-1-numbers)
   - [3. Why pairwise reduction is linear](#part-1-pairwise)
3. [Part 2: Creativity Exercises, C-4.9–C-4.22](#part-2)
   - [1. Numeric, counting, and branching tasks, C-4.9–C-4.15](#part-2-numeric)
   - [2. Strings, partitions, and search, C-4.16–C-4.22](#part-2-strings)
   - [3. Two worked geometry checks](#part-2-checks)
4. [Part 3: Projects, P-4.23–P-4.27](#part-3)
   - [1. Search nested records and test arrangements, P-4.23–P-4.24](#part-3-search)
   - [2. Build complete iterative and recursive tools, P-4.25–P-4.27](#part-3-tools)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Follow the results](#part-4-results)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Workshop, Many Recursive Questions

<span id="background-cards"></span>

### 1. Fix the card data and study extensions

We continue with the rectangle cards used throughout Chapter 4. The first three cards have `6 + 8 + 16 = 30 cm²` of combined area.

| Card | Width | Height | Area | Role here |
| :--- | ---: | ---: | ---: | :--- |
| `A` | 2 cm | 3 cm | 6 cm² | Core card. |
| `B` | 4 cm | 2 cm | 8 cm² | Core card. |
| `C` | 4 cm | 4 cm | 16 cm² | Core card. |
| `D` | 3 cm | 5 cm | 15 cm² | Added study card for four distinct choices and odd-area examples. |

Two different four-entry examples will appear. **A second physical copy of `A`** gives `[6, 8, 16, 6]` and total `36 cm²`, which helps with pairwise summation and duplicate detection. Four **distinct** cards `A` through `D` have sorted areas `[6, 8, 15, 16]` and total `45 cm²`, which helps with search and choice exercises.

Section 4.7 consists of exercise prompts rather than worked explanations. The exercise IDs and task goals below come from the book; the card calculations, starting methods, and runnable program are study additions. Some source exercises concern strings, disks, a ruler, or files, so we use matching small workshop examples where those objects matter.

<span id="background-checklist"></span>

### 2. Read each exercise as a design question

For a recursive task, ask the same five questions each time:

| Design question | Card-workshop example |
| :--- | :--- |
| **State:** What smaller problem does a call describe? | The first `n` card areas, a subrange of a list, or the remaining unused cards. |
| **Base:** What can be answered directly? | One area has itself as maximum; an empty subset choice yields one empty subset. |
| **Progress:** What strictly shrinks? | `n` decreases, bounds move inward, or one card leaves the unused set. |
| **Combine:** How do smaller answers make this answer? | Take a maximum, add two partial sums, or prepend the chosen card. |
| **Cost:** How much work occurs over all calls? | Count all pairwise additions, comparison steps, generated subsets, or legal moves. |

**Reinforcement** asks you to trace or adapt familiar algorithms. **Creativity** asks you to design a new recursive method under stated restrictions. **Projects** ask for complete working programs or generators. A sample case checks an idea; a full solution must still handle the exercise's general inputs and constraints.

> **Mental model:** First identify the smaller question and its stopping case; then trace a tiny card example and count all work, not just the number of recursion levels.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement Exercises, R-4.1–R-4.8

<span id="part-1-traces"></span>

### 1. Recursion traces and choices, R-4.1–R-4.5

| Exercise | What to work out | Connected study check |
| :--- | :--- | :--- |
| **R-4.1** | Find a sequence maximum recursively, then analyze running time and stack space. Use the maximum of the first `n - 1` values and the last value, with a one-value base case. | `max([6, 8, 16]) = 16 cm²`; a simple prefix recursion takes `O(n)` time and `O(n)` call-stack space. |
| **R-4.2** | Trace the chapter's traditional `power(2, 5)`, including calls and returns. | Exponents descend `5 → 4 → 3 → 2 → 1 → 0`; answers rise `1 → 2 → 4 → 8 → 16 → 32`. Five rounds of doubling give 32 copies of `A`, covering `192 cm²`. |
| **R-4.3** | Trace repeated-squaring `power(2, 18)`. Compute one half-power per call, then square it and handle an odd exponent. | Exponents descend `18 → 9 → 4 → 2 → 1 → 0`; answers rise `1 → 2 → 4 → 16 → 512 → 262144`. The answer represents `2¹⁸` copies under the workshop's doubling rule. |
| **R-4.4** | Trace the book's in-place `reverse(S, 0, 5)` on `[4, 3, 6, 2, 6]`, moving half-open bounds inward. | Book input ends as `[6, 2, 6, 3, 4]`; the same outer-swap idea changes card order `ABC → CBA` without changing the `30 cm²` total. |
| **R-4.5** | Trace `PuzzleSolve(3, S, U)` with empty `S` and `U = {a, b, c, d}`. Follow each choice, test, and restoration. | With cards `A`–`D` as four choices, a full no-match search tests `4 × 3 × 2 = 24` completed orders. A match returns from the current `k = 1` call. |

For **R-4.4**, the book's bounds and list change as follows. The final call reaches a one-element range and makes no swap.

| Call bounds `[start, stop)` | Action | List after action |
| :--- | :--- | :--- |
| `[0, 5)` | Swap indices `0` and `4`. | `[6, 3, 6, 2, 4]` |
| `[1, 4)` | Swap indices `1` and `3`. | `[6, 2, 6, 3, 4]` |
| `[2, 3)` | One element remains; return. | `[6, 2, 6, 3, 4]` |

For **R-4.5**, the book uses a **set** of available letters, so its iteration order is unspecified. An illustrative `A, B, C, D` branch chooses `A`, then `B`; its `k = 1` call tests `ABC` and, if that test fails, restores `C` before testing `ABD`. On a full no-match trace, the call tree has `1 + 4 + 12 = 17` activations and tests 24 three-letter candidates within those calls. On a match, the printed pseudocode returns from the current `k = 1` call but does not explicitly propagate that result through its callers. The actual continuation therefore cannot be inferred from the candidate count alone.

<span id="part-1-numbers"></span>

### 2. Numbers and level-by-level sums, R-4.6–R-4.8

| Exercise | What to work out | Connected study check |
| :--- | :--- | :--- |
| **R-4.6** | Give a recursive rule for the harmonic number `Hₙ = 1 + 1/2 + ⋯ + 1/n`. Start with `H₀ = 0`; add `1/n` after solving the smaller case. | `H₃ = 11/6`. If paper copies of `A` contribute a full area, a half, and a third, they cover `6 × 11/6 = 11 cm²` together. |
| **R-4.7** | Convert a string of decimal digits to an integer recursively. The source example maps `'13531'` to `13,531`. | For a card-area label, parse `'16'` as `10 × 1 + 6 = 16`, matching `C`'s area. A smaller prefix plus the final digit gives the recurrence. |
| **R-4.8** | Analyze Isabel's method: replace a power-of-two-length sequence with adjacent pair sums until one value remains. | The second-`A` list becomes `[6, 8, 16, 6] → [14, 22] → [36]`; the total is `36 cm²`. |

The harmonic number is a dimensionless sum; multiplying by `A`'s `6 cm²` area gives the workshop's combined cut-paper area. For digit conversion, the recursive step can use `value(prefix) × 10 + last_digit`, while its base handles one digit or an empty prefix.

<span id="part-1-pairwise"></span>

### 3. Why pairwise reduction is linear

**R-4.8** has only `log₂ n` rounds, yet its running time depends on all additions in all rounds. For `n = 4`, the two rounds perform `2 + 1 = 3` additions. In general, they perform

```text
n/2 + n/4 + n/8 + ... + 1 = n - 1 additions.
```

Making each new level also touches that many values, so the total running time is **`O(n)`** under the book's operation-count model. The sequence length halves each round; the total work forms a geometric series rather than `n` work on every round.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity Exercises, C-4.9–C-4.22

<span id="part-2-numeric"></span>

### 1. Numeric, counting, and branching tasks, C-4.9–C-4.15

| Exercise | What to design or prove | Connected study check |
| :--- | :--- | :--- |
| **C-4.9** | Return both minimum and maximum recursively **without loops**; carry a pair of results from a smaller sequence. | Areas `[6, 8, 16]` yield `(6, 16)` cm². |
| **C-4.10** | Compute `⌊log₂ n⌋` using addition and integer division. Halve a positive integer until it reaches `1`, counting the halvings. | Card `C` covers 16 one-square-centimetre grid squares; `16 → 8 → 4 → 2 → 1` gives `⌊log₂ 16⌋ = 4`. |
| **C-4.11** | Test element uniqueness recursively within `O(n²)` worst-case time, without sorting. Compare one value with the rest, then recurse. | `[6, 8, 16, 6]` fails because the two physical `A` cards share area `6 cm²`. |
| **C-4.12** | Multiply positive integers using only addition and subtraction. Reduce one factor by one and add the other factor on return. | `A`'s area `2 × 3` becomes `2 + 2 + 2 = 6 cm²`. |
| **C-4.13** | Prove the total number of **dash characters** printed by `draw_interval(c)` is `2^(c+1) - c - 2`. | A level-3 workshop ruler has seven tick lines of lengths `1, 2, 1, 3, 1, 2, 1`, totaling **11 dashes**. |
| **C-4.14** | Describe the recursive Towers of Hanoi move rule: move `n - 1` disks aside, move the largest, then move the smaller stack onto it. | Three size-ranked demonstration disks labeled for `A`, `B`, and `C` take `2³ - 1 = 7` legal moves. |
| **C-4.15** | Output every subset once by branching on include/exclude for each element. | Three card labels give `2³ = 8` subsets, including the empty set and `{A, B, C}`. |

For **C-4.13**, let `D(c)` count dash characters in the *interval* drawn with center tick length `c`. The two smaller intervals and the center tick give `D(0) = 0` and `D(c) = 2D(c - 1) + c`. Assuming `D(c - 1) = 2^c - c - 1`, substitution gives `D(c) = 2^(c+1) - c - 2`. This proves the requested formula by induction, beginning at `c = 0`. The number of **lines** is instead `2^c - 1`; lines and dash characters are different counts.

<span id="part-2-strings"></span>

### 2. Strings, partitions, and search, C-4.16–C-4.22

| Exercise | What to design | Connected study check |
| :--- | :--- | :--- |
| **C-4.16** | Reverse a string recursively by reducing the remaining character range. | Card-label string `'ABC'` becomes `'CBA'`. The source's separate string example is `'pots&pans' → 'snap&stop'`. |
| **C-4.17** | Decide whether a string is a palindrome by comparing its two ends and recursing inward. | `'ABA'`, using a second physical `A`, reads the same in both directions. |
| **C-4.18** | Decide recursively whether a string has more vowels than consonants; maintain counts or a running difference. | Geometry word `'AREA'` has three vowels (`A`, `E`, `A`) and one consonant (`R`). |
| **C-4.19** | Rearrange integer values so evens precede odds; use recursive bounds or partitioning. | Card side lengths `[2, 3, 4, 2, 4, 4]` can become `[2, 4, 2, 4, 4, 3]`. |
| **C-4.20** | Recursively partition an **unsorted** integer sequence around `k`, with values `<= k` before values `> k`; analyze the time. | Unsorted card areas `[16, 6, 15, 8]`, with `k = 8`, can become `[6, 8 | 15, 16]`. An inward two-pointer method can use `O(n)` time. |
| **C-4.21** | In a **sorted sequence of distinct integers**, recursively find two different entries that sum to `k`; analyze the time. | In `[6, 8, 15, 16]`, target `23` has pair `(8, 15)`. Move two endpoints inward according to whether their sum is too small or too large. |
| **C-4.22** | Reimplement repeated-squaring `power` without recursion. Keep a running result, base, and exponent. | `2⁵ = 32` copies of `A` occupy `32 × 6 = 192 cm²` of combined card area. |

The parity example uses **side lengths** because the original three card areas are all even. For **C-4.20**, a partition only needs the two groups in the correct order; it does not need to sort within either group. An in-place inward scan can settle at least one position per step and take `O(n)` time. For **C-4.21**, the sorted, distinct input permits a recursive two-pointer search in `O(n)` time and `O(n)` call-stack space.

<span id="part-2-checks"></span>

### 3. Two worked geometry checks

**Two-pointer sum for C-4.21:** Start with the smallest and largest areas in sorted `[6, 8, 15, 16]`, seeking `23 cm²`.

| Current endpoints | Sum | What to do |
| :--- | ---: | :--- |
| `6` and `16` | 22 | Too small; move the left endpoint right. |
| `8` and `16` | 24 | Too large; move the right endpoint left. |
| `8` and `15` | 23 | Return this pair. |

Each call eliminates one endpoint, so at most `n - 1` endpoint moves are needed. The two values come from different indices; a single entry cannot be used twice.

**Ruler count for C-4.13:** The level-3 dash-length sequence is `1, 2, 1, 3, 1, 2, 1`. It has `7 = 2³ - 1` lines but `11 = 2⁴ - 3 - 2` dash characters. This small case checks both formulas before the induction above handles all nonnegative `c`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Projects, P-4.23–P-4.27

<span id="part-3-search"></span>

### 1. Search nested records and test arrangements, P-4.23–P-4.24

| Project | What a complete program must do | Connected study starting point |
| :--- | :--- | :--- |
| **P-4.23** | Implement recursive `find(path, filename)` and report every matching filesystem entry below `path`. | Put `area.txt` in both `workshop/A/` and `workshop/archive/A/`; descend into both folders and report both matches. |
| **P-4.24** | Enumerate and test assignments for the three Section 4.4.3 summation puzzles: `pot + pan = bib`, `dog + cat = pig`, and `boy + girl = baby`. | First practice the same choose/test/restore pattern on card orders, accepting only orders with increasing areas. The actual puzzle test uses digit assignments and arithmetic. |

The summation puzzles assign a **different digit to each different letter**. A search branch picks an unused digit, checks a candidate, and restores the available digits before trying another branch. A complete solver should define whether it reports one solution or all solutions, and propagate results and restore state consistently. The book's printed `PuzzleSolve` returns from its current `k = 1` call on a match; it does not show that return passing through outer calls. That immediate return also skips the current call's restoration, so an implementation should clean up before returning or avoid shared mutable state.

<span id="part-3-tools"></span>

### 2. Build complete iterative and recursive tools, P-4.25–P-4.27

| Project | What a complete program must do | Connected study starting point |
| :--- | :--- | :--- |
| **P-4.25** | Draw an English-ruler interval **without recursion**. For center length `c`, print exactly `2^c - 1` tick lines; counter `j = 0, ..., 2^c - 2` determines a line's dashes as `1 +` its trailing binary `1` bits. | At `c = 3`, counters `0` through `6` give dash lengths `1, 2, 1, 3, 1, 2, 1`. |
| **P-4.26** | Implement a solver for the Towers of Hanoi from C-4.14, outputting legal moves for a given number of disks. | Three size-ranked disks labeled with card names need seven moves from the source peg to the target peg. |
| **P-4.27** | Implement an `os.walk`-like generator that yields `(dirpath, dirnames, filenames)` for each visited directory. | A `workshop/` folder can yield its child folder names and card-measurement filenames, then recursively yield each child's tuple. |

The project ruler's **zero-based counter** matters. For `c = 3`, binary counters `0, 1, 10, 11, 100, 101, 110` have trailing-one counts `0, 1, 0, 2, 0, 1, 0`; adding one gives the seven tick lengths. This agrees with the recursive ruler used in C-4.13. A workshop ruler marked in centimetres is our geometry adaptation; the book's original English ruler uses inches.

For the file projects, traversal must visit nested directories, not just the top folder. P-4.23 reports matching entries; P-4.27 **yields a tuple for each directory**. Those are different output contracts even though both descend a directory tree.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

This study program runs representative ideas from all three exercise groups: a recursive maximum and pair search, exhaustive card subsets, Isabel's pairwise area reduction, recursive and iterative ruler patterns, and a small Hanoi solver. It uses the card data defined above.

```python
def maximum_area(values):
    if not values:
        raise ValueError("at least one area is required")

    def prefix_max(n):
        if n == 1:
            return values[0]
        return max(prefix_max(n - 1), values[n - 1])

    return prefix_max(len(values))


def pair_with_sum(sorted_values, target, left=0, right=None):
    if right is None:
        right = len(sorted_values) - 1
    if left >= right:
        return None
    total = sorted_values[left] + sorted_values[right]
    if total == target:
        return (sorted_values[left], sorted_values[right])
    if total < target:
        return pair_with_sum(sorted_values, target, left + 1, right)
    return pair_with_sum(sorted_values, target, left, right - 1)


def card_subsets(labels):
    def from_index(i):
        if i == len(labels):
            return [()]
        smaller = from_index(i + 1)
        return smaller + [(labels[i],) + subset for subset in smaller]

    return from_index(0)


def pairwise_area_rows(values):
    if not values:
        raise ValueError("a nonempty sequence is required")
    rows = [list(values)]
    while len(rows[-1]) > 1:
        current = rows[-1]
        if len(current) % 2:
            raise ValueError("the sequence length must be a power of two")
        rows.append([current[i] + current[i + 1]
                     for i in range(0, len(current), 2)])
    return rows


def ruler_lengths_recursive(c):
    if c < 0:
        raise ValueError("tick length must be nonnegative")
    if c == 0:
        return []
    shorter = ruler_lengths_recursive(c - 1)
    return shorter + [c] + shorter


def ruler_lengths_iterative(c):
    if c < 0:
        raise ValueError("tick length must be nonnegative")
    lengths = []
    for counter in range(2**c - 1):
        bits = counter
        dashes = 1
        while bits % 2 == 1:
            dashes += 1
            bits //= 2
        lengths.append(dashes)
    return lengths


def hanoi_moves(n, source, spare, target):
    if n < 0:
        raise ValueError("disk count must be nonnegative")
    if n == 0:
        return []
    return (hanoi_moves(n - 1, source, target, spare)
            + [(source, target)]
            + hanoi_moves(n - 1, spare, source, target))


cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (3, 5)}
area = {label: width * height for label, (width, height) in cards.items()}
core_areas = [area[label] for label in ("A", "B", "C")]
four_distinct_areas = sorted(area.values())
second_a_areas = core_areas + [area["A"]]

print("maximum core area:", maximum_area(core_areas), "cm^2")
print("pair totaling 23 cm^2:", pair_with_sum(four_distinct_areas, 23))

subsets = card_subsets(("A", "B", "C"))
ordered_subsets = sorted(subsets, key=lambda group: (len(group), group))
print("card subsets:", ["".join(group) or "(empty)" for group in ordered_subsets])

print("pairwise area rows:", pairwise_area_rows(second_a_areas))
recursive_ticks = ruler_lengths_recursive(3)
iterative_ticks = ruler_lengths_iterative(3)
print("ruler level 3:", iterative_ticks,
      "| lines:", len(iterative_ticks), "| dashes:", sum(iterative_ticks))
print("ruler methods agree:", recursive_ticks == iterative_ticks)
print("three-disk Hanoi moves:", len(hanoi_moves(3, "a", "b", "c")))
```

<span id="part-4-results"></span>

### 2. Follow the results

Running the complete program prints:

```text
maximum core area: 16 cm^2
pair totaling 23 cm^2: (8, 15)
card subsets: ['(empty)', 'A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC']
pairwise area rows: [[6, 8, 16, 6], [14, 22], [36]]
ruler level 3: [1, 2, 1, 3, 1, 2, 1] | lines: 7 | dashes: 11
ruler methods agree: True
three-disk Hanoi moves: 7
```

The maximum and pair use the same area data but answer different questions. The second physical `A` makes the pairwise total `36 cm²`, while four distinct cards supply the sorted pair `(8, 15)`. The ruler checks both a recursive pattern and P-4.25's counter rule. The Hanoi result counts legal moves; its disks are size-ranked teaching pieces labeled for the cards, not the rectangular cards themselves.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why is pairwise summation linear with several rounds?</strong></summary>

**Scenario:** Isabel combines areas from `A`, `B`, `C`, and a second physical `A`.

**Check:** `[6, 8, 16, 6] → [14, 22] → [36]` uses two additions in the first round and one in the second. For a power-of-two length `n`, the total is `n/2 + n/4 + ⋯ + 1 = n - 1` additions.

**Lesson:** Count work across every level; a logarithmic number of rounds can still perform linear total work.

</details>

<details>
<summary><strong>Case Study 2: How many ruler marks and dashes are there?</strong></summary>

**Scenario:** Draw a level-3 interval on a workshop ruler beside the cards.

**Check:** The recursive lengths `1, 2, 1, 3, 1, 2, 1` give seven printed tick lines and `11` dash characters. The nonrecursive counters `0` through `6` reproduce exactly those lengths using trailing binary ones.

**Lesson:** A line count and a character count answer different questions, and the same drawing can be generated recursively or iteratively.

</details>

<details>
<summary><strong>Case Study 3: Why must the two-sum input be sorted?</strong></summary>

**Scenario:** Find two different card areas adding to `23 cm²`.

**Check:** In sorted `[6, 8, 15, 16]`, endpoint sums go `22 → 24 → 23`, ending at `(8, 15)`. An unsorted sequence does not let an endpoint comparison tell us safely which side to discard.

**Lesson:** The recursive two-pointer search relies on sorted order and never uses one entry twice.

</details>

<details>
<summary><strong>Case Study 4: Why can a puzzle test fewer than 24 orders?</strong></summary>

**Scenario:** Choose three positions from four distinct cards as an analogy for `PuzzleSolve(3, S, U)`.

**Check:** A full no-match trace tests `4 × 3 × 2 = 24` completed orders. If a `k = 1` call finds a match on its first final choice, its `return` skips its other final choice. The printed pseudocode does not explicitly propagate that return to ancestor calls. The available choices form a set, so their trial order is unspecified.

**Lesson:** Count possible configurations separately from actual tests, and follow each `return` through the specific call where it appears.

</details>

<details>
<summary><strong>Case Study 5: How does a small Hanoi instance guide the project?</strong></summary>

**Scenario:** Move three size-ranked demonstration disks labeled `A`, `B`, and `C` from peg `a` to peg `c`.

**Check:** Move the two smaller disks to peg `b`, move the largest to peg `c`, then move the two from `b` to `c`. The recursive move count is `2 × 3 + 1 = 7`, and each move places a smaller disk above a larger one or on an empty peg.

**Lesson:** State the legal-move invariant and solve the same kind of problem for `n - 1` disks twice.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 4.7 group | Main practice | Rectangle-card reminder |
| :--- | :--- | :--- |
| **Reinforcement, R-4.1–R-4.8** | Trace known recursions, give direct base cases, and count time/space across calls. | Maximum `16 cm²`; a second `A` gives pairwise rows ending at `36 cm²`. |
| **Creativity, C-4.9–C-4.22** | Design recursive rules for numbers, choices, strings, partitions, and sorted searches. | Three labels yield eight subsets; four distinct areas contain pair `(8, 15)` summing to `23 cm²`. |
| **Projects, P-4.23–P-4.27** | Build complete traversal, search, ruler, and Hanoi programs. | Nested card records, seven level-3 ruler marks, and seven moves for three ranked disks give small verification cases. |
| **Proving progress** | Make each call or loop step reduce a count, interval, or choice set. | Prefix length drops, search endpoints move, and unused cards decrease. |
| **Counting output and work** | Separate levels, calls, printed lines, printed characters, and candidates. | The ruler has seven lines and 11 dashes; a full 3-of-4 choice search tests 24 orders. |

Each exercise ID above identifies the corresponding book prompt. The geometry checks and program provide small ways to reason about those prompts while keeping their general inputs and constraints in view.

[🔝 Back to Top](#top)
