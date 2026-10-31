<span id="top"></span>

# 12.8 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 12, Section 12.8, printed pages 574–580 ([supplied Chapter 12 PDF](<../Data Structures and Algorithms in Python - C12.pdf>)).<br>
> **Topic:** Reinforcement R-12.1–R-12.24; Creativity C-12.25–C-12.55; Projects P-12.56–P-12.62.<br>
> **Domain Focus:** The six rectangle cards from [Section 12.1](12-01-why-study-sorting-algorithms.md), ordered by area, with their labels retained to study ties and correctness.<br>
> **User Prompt:** Reexplain Section 12.8 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Card Set, Many Questions](#background)
   - [1. Keep the six rectangle cards](#background-cards)
   - [2. Read an exercise as a request for evidence](#background-evidence)
2. [Part 1: Reinforcement, R-12.1–R-12.24](#part-1)
   - [1. Merge-sort, stability, and union: R-12.1–R-12.7](#part-1-merge)
   - [2. Quick-sort and comparison bounds: R-12.8–R-12.16](#part-1-quick)
   - [3. Bounded keys, special inputs, and selection: R-12.17–R-12.24](#part-1-other)
3. [Part 2: Creativity, C-12.25–C-12.55](#part-2)
   - [1. Verify, merge, and partition: C-12.25–C-12.33](#part-2-design)
   - [2. Count, stabilize, and use bounded keys: C-12.34–C-12.41](#part-2-keys)
   - [3. Inversions, sums, and middle values: C-12.42–C-12.46](#part-2-inversions)
   - [4. Selection and stronger guarantees: C-12.47–C-12.55](#part-2-selection)
4. [Part 3: Projects, P-12.56–P-12.62](#part-3)
   - [1. Implement and benchmark sorts: P-12.56–P-12.60](#part-3-benchmarks)
   - [2. Build a bucket sort or an animation: P-12.61–P-12.62](#part-3-build)
5. [Part 4: One Connected Geometry Check](#part-4)
   - [1. Verify a proposed sort and count small-case inversions](#part-4-code)
   - [2. Read the output and its limits](#part-4-output)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Card Set, Many Questions

<span id="background-cards"></span>

### 1. Keep the six rectangle cards

As in [Section 12.1](12-01-why-study-sorting-algorithms.md) and the later Chapter 12 guides, cards arrive in the order `D, C, A, B, E, F`. A rectangle's **area = width × height**:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `D` | 4 cm | 4 cm | 16 cm² |
| `C` | 3 cm | 4 cm | 12 cm² |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 2 cm | 4 cm | 8 cm² |
| `E` | 1 cm | 8 cm | 8 cm² |
| `F` | 4 cm | 5 cm | 20 cm² |

Their arrival-order areas are `[16, 12, 6, 8, 8, 20]`. A correct numeric sort is `[6, 8, 8, 12, 16, 20]`. The two area-8 cards make **stability** visible: a stable area sort keeps `B` before `E`, whereas an unstable sort may reverse them without changing the sorted area values.

When an exercise requires **distinct keys**, use the five-card subset `A, B, C, D, F` with areas `{6, 8, 12, 16, 20}`. When it requires a special key range, a binary flag, or a different application such as voting, treat the card example as a warm-up and then use the exercise's specified input rules.

<span id="background-evidence"></span>

### 2. Read an exercise as a request for evidence

Section 12.8 contains **62 exercises**, rather than new textbook exposition. It groups them into **Reinforcement** (24), **Creativity** (31), and **Projects** (7). Each row below paraphrases one exercise and gives a starting point; the worked card cases teach methods without claiming to finish all 62 assignments.

| Exercise asks you to… | Evidence your answer needs | Six-card starting point |
| :-------------------- | :------------------------- | :---------------------- |
| **Trace** | Record the sequence or partition after each meaningful step. | Split six cards into two groups of three, then merge them. |
| **Prove or analyze** | State the invariant or cost model, then count work across all steps. | A merge level processes six cards; there are about `log₂ 6` levels. |
| **Design or implement** | Give the data representation, steps, edge cases, and time/space bounds. | Decide how equal-area cards move through a partition. |
| **Benchmark** | Fix the same input for each method, vary input size, repeat trials, and report measurements. | Scale the card-area pattern beyond six entries before timing. |

Here `n` usually counts items; `N` is often an integer-key range size; `k` may mean a rank, a number of groups, or the number of candidates depending on the particular exercise. A **stable** sort preserves input order among equal keys. An **in-place** method uses the input storage for the main rearrangement, although a recursive implementation may still use stack space. A timing result illustrates performance but does not prove an asymptotic bound.

> **Mental model:** Keep the cards and area rule fixed. For each exercise, change only the question: prove the cost, preserve ties, choose a pivot, count disorder, select a rank, or measure a program.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-12.1–R-12.24

<span id="part-1-merge"></span>

### 1. Merge-sort, stability, and union: R-12.1–R-12.7

These exercises revisit [merge-sort](12-02-merge-sort.md). A downward edge in its recursion tree **splits** a problem; an upward edge returns a **merged** result. With six cards, a longest split path has sizes `6 → 3 → 2 → 1`, or three edges, matching `⌈log₂ 6⌉ = 3`.

| Exercise | Reexplanation and rectangle-card starting point |
| :------- | :--------------------------------------------- |
| **R-12.1** | Prove the merge-sort tree height is `⌈log₂ n⌉`, including non-powers of two. Track the largest child at each split; the six-card path above is a check, not the general proof. |
| **R-12.2** | Explain the arrows in the book's merge-sort figures: downward arrows pass smaller inputs into recursive calls; upward arrows return sorted pieces for merging. Trace `[D,C,A]` and `[B,E,F]`. |
| **R-12.3** | Extend the `O(n log n)` merge-sort analysis beyond powers of two. At every depth, the current pieces together contain at most `n` cards, and the height stays `O(log n)`. |
| **R-12.4** | Test **array-based** merge-sort for stability. The printed merge compares with strict `<`, so equal fronts choose the **right** half; place `B:8` on the left and `E:8` on the right. |
| **R-12.5** | Repeat the stability check for the book's **linked-queue** merge. Its front comparison is also strict `<`; follow `B` and `E` through a tie. |
| **R-12.6** | Make a sort **straggling**, meaning equal-key entries appear in reverse input order. A right-on-tie rule at *every* merge does this; check the printed code first, because its strict `<` already chooses the right side on ties. |
| **R-12.7** | Merge two sorted, individually duplicate-free sequences into one sorted union without duplicates in `O(n)` time. For `[6,8,12]` and `[8,16,20]`, compare the two fronts and emit area `8` only once. |

The tie rule is about **card identity**, not numeric order. Both `[A:6, B:8, E:8, …]` and `[A:6, E:8, B:8, …]` have correctly sorted areas. For R-12.6, if starting from a stable left-on-tie merge, changing to right-on-tie reverses each equal-key group; the textbook's two printed merge implementations already use right-on-tie. For R-12.7, advance both input fronts when their values match, and do not emit a value already emitted.

<span id="part-1-quick"></span>

### 2. Quick-sort and comparison bounds: R-12.8–R-12.16

The [quick-sort guide](12-03-quick-sort.md) distinguishes its three-group description from Code Fragment 12.6's **in-place, two-way** partition. That distinction matters for duplicates and pointer-boundary exercises.

| Exercise | Reexplanation and rectangle-card starting point |
| :------- | :--------------------------------------------- |
| **R-12.8** | On already sorted data, a **middle-index** pivot also has a middle value, giving balanced quick-sort calls and `Θ(n log n)` time. Try `[6,8,12,16,20]`; this conclusion depends on the input being sorted. |
| **R-12.9** | Construct an adversarial arrangement where the middle **position** repeatedly holds an extreme **value** in each recursive subproblem. The splits become highly uneven and can cause `Ω(n²)` work. |
| **R-12.10** | Show even the best case of distinct-key quick-sort needs `Ω(n log n)` work: balanced partition levels each inspect a linear total number of cards, and there are logarithmically many levels. |
| **R-12.11** | Prove Code Fragment 12.6 still sorts duplicate keys, and analyze an all-equal input. Its equal-to-pivot items can fall on both sides; this two-way implementation takes `Θ(n log n)` on all equal keys, unlike a three-way equal group that stops. |
| **R-12.12** | Find why changing the *outer* scan loop from `left <= right` to `left < right` fails. With the two-card sorted input `[1,2]`, skipping the scan when the markers coincide causes the final pivot swap to reverse them. |
| **R-12.13** | Find why changing the *swap conditional* to `left < right` fails. With `[1,1]`, the markers coincide on a value equal to the pivot; neither inner scan moves, and skipping the equal-index case leaves the loop stuck. |
| **R-12.14** | For one fixed item and one size group, show the probability it belongs to **more than `2 log n`** randomized quick-sort subproblems is at most **`1/n²`**. Use the book's good-pivot probability and repeated-trial bound. |
| **R-12.15** | In a comparison decision tree, `n` binary comparisons can reach at most `2ⁿ` leaves, so at most that many distinct input orders can be certified with that comparison budget (and never more than `n!`). For three distinct card areas, two comparisons give four leaves but there are six orders. |
| **R-12.16** | Sorting a prefix of `k` distinct items needs `Ω(k log k)` comparisons. Under an `O(n)` total budget, the largest possible scale is **`k = Θ(n/log n)`**; the deterministic linear-time selection studied in C-12.55 followed by sorting the chosen `k` items matches that scale. |

For R-12.11, the exact **partition code** determines the all-equal behavior. The area-8 `B` and `E` cards help trace two equal keys; six cards do not by themselves prove a complexity bound. R-12.14 asks for a bound about one element in **one size group**, while a whole-algorithm high-probability statement appears later in C-12.54.

<span id="part-1-other"></span>

### 3. Bounded keys, special inputs, and selection: R-12.17–R-12.24

The chapter next asks when a finite key range changes the sorting method, when input order helps, and why the [quick-select](12-07-selection.md) worst case differs from its expected time.

| Exercise | Reexplanation and rectangle-card starting point |
| :------- | :--------------------------------------------- |
| **R-12.17** | Check whether the chapter's bucket-sort is in-place. Its buckets require separate storage; count that storage as well as the final output. |
| **R-12.18** | Lexicographically sort bounded integer triplets with **stable** radix passes from last field to first. For a geometry key `(area, width, height)`, process height, then width, then area; extend the pattern to `d` fields. |
| **R-12.19** | Analyze merge-sort and quick-sort on keys restricted to `0` or `1`. Merge-sort remains `O(n log n)`; three-way quick-sort groups each distinct key in `O(n)` total, while the book's in-place two-way version can behave differently on ties. Name the version used. |
| **R-12.20** | Stably bucket-sort binary keys. Set a flag to `0` for area `≤ 8` and `1` for area `> 8`; append cards to each bucket in arrival order, then join the buckets in `O(n)` time. |
| **R-12.21** | Sort those same bits **in place** with two moving boundaries or a counting pass and writes. Check whether your method preserves `B` before `E`; in-place does not automatically mean stable. |
| **R-12.22** | Use already sorted distinct areas `[6,8,12,16,20]`: insertion-sort scans almost nothing, while the chapter's merge-sort and heap-sort still perform their `Θ(n log n)` pattern. Reverse the input and count insertion shifts again. |
| **R-12.23** | Choose a sorting method for general objects, long strings, fixed-width integers, floating-point values, and bytes. State each representation, comparison cost, key range, stability need, and memory budget; one method need not win every category. |
| **R-12.24** | Give an `Ω(n²)` worst-case quick-select run. On five distinct areas with requested rank 1, repeatedly choose the largest pivot: partition scans of sizes `5+4+3+2`, then a constant-time size-one base case, illustrate quadratic growth as `n` increases. |

For the binary flag example, arrival-order bits are `[1,1,0,0,0,1]`. A **stable** result is `[A,B,E,D,C,F]`: all three zero-flag cards retain their relative order, as do the three one-flag cards. If the original exercise gives only numbers, the card labels are extra information that lets us inspect stability.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity, C-12.25–C-12.55

<span id="part-2-design"></span>

### 1. Verify, merge, and partition: C-12.25–C-12.33

These tasks ask for algorithms and proofs, often with a constraint stronger than “eventually produce sorted values.” Read requirements such as **no new nodes**, **in place**, or **linear-time verification** as part of the problem.

| Exercise | Reexplanation and rectangle-card starting point |
| :------- | :--------------------------------------------- |
| **C-12.25** | Checking that output areas are nondecreasing does **not** prove the output contains exactly the input cards. `[6,8,8,12,16,16]` is sorted but drops `F:20`. An output list of original input positions can certify a permutation in `O(n)` time. |
| **C-12.26** | Remove duplicate values efficiently. From six areas, a distinct-area result is `[6,8,12,16,20]`; specify whether card identity matters and whether hashing is allowed before choosing a method and bound. |
| **C-12.27** | Merge two sorted `PositionalList` objects by **relinking their existing nodes**: all nodes end in the first list and the second becomes empty. A Python-list merge that copies values does not meet this constraint. |
| **C-12.28** | Sort a `PositionalList` by relinking its existing nodes, creating no new nodes. Use the card areas as keys and trace which physical node moves rather than merely rewriting its value. |
| **C-12.29** | Do bottom-up merge-sort by making one queue per card, then repeatedly merge pairs of sorted queues until one remains. Track both the queue contents and the number of merge rounds. |
| **C-12.30** | Randomize Code Fragment 12.6's in-place quick-sort pivot. Choose a position uniformly within the active range, move its item to the pivot slot, then use the same partition logic. |
| **C-12.31** | Choosing the median of the last fixed odd number `d` of items does not guarantee balanced splits of the full input. Construct recursive inputs where that sample's median stays near an extreme; the worst-case growth remains `Θ(n²)`. |
| **C-12.32** | Prove expected `O(n log n)` randomized quick-sort from the supplied good/bad-split recurrence. Show how a guessed bound survives both recursive branches and the `O(n)` partition cost. |
| **C-12.33** | Implement the requested in-place **three-way** partition, keeping `S[0:i] < pivot`, `S[i:j] = pivot`, `S[j:k] > pivot`, and `S[k:n]` unclassified. Each pass classifies one more item using only a constant number of swaps. |

For C-12.25, a certificate such as original positions `[2,3,4,1,0,5]` maps the arrival list to `A,B,E,C,D,F`. A verifier can mark each index exactly once, confirm the output card at that position matches the claimed input card, and check adjacent output areas. This takes `O(n)` time and an `O(n)` seen array. The verifier below makes that distinction concrete.

For C-12.33, `B` and `E` both belong in the **equal** slice when the pivot area is 8. The four-slice invariant is stronger than the book's two-way in-place partition: it identifies ties explicitly and prevents them from entering recursive calls.

<span id="part-2-keys"></span>

### 2. Count, stabilize, and use bounded keys: C-12.34–C-12.41

The voting exercises have their **own** domain: an integer names a candidate, and each occurrence is a vote. Card labels can help explain repeated IDs, but a card's geometric area is not itself a presidential vote.

| Exercise | Reexplanation and rectangle-card starting point |
| :------- | :--------------------------------------------- |
| **C-12.34** | Count votes with arbitrary integer IDs in `O(n log n)` time. Sorting IDs first makes equal votes adjacent; then scan runs to find the largest count. |
| **C-12.35** | If only `k < n` candidates occur but IDs are still arbitrary, keep counts in an ordered map of at most `k` IDs so each update costs `O(log k)`, totaling `O(n log k)`. |
| **C-12.36** | If IDs are guaranteed in `1..k`, use an indexed count array. Since `k < n`, setup plus `n` vote updates is `O(n + k) = O(n)`. |
| **C-12.37** | Stabilize a comparison sort by decorating each item with its original position as a tie-breaker, then remove that decoration after sorting. For `B:8` before `E:8`, compare `(8,3)` with `(8,4)`. |
| **C-12.38** | Decide whether two sequences contain the same **set** of elements, not necessarily the same multiplicities. `[8,8,12]` and `[8,12,12]` have the same set `{8,12}`; sort and skip duplicates, or state a hashing assumption. |
| **C-12.39** | Sort integers in `[0,n²−1]` in `O(n)` time by writing each as two base-`n` digits and using two stable bounded-key passes. A card area is only a toy key; the required numeric range drives the proof. |
| **C-12.40** | Sort `k` separate sequences with total `n` bounded-range keys in `O(n+N)` time. Use one shared key-bucketing pass that retains each item's sequence ID, then route items back; allocating `N` buckets **per sequence** costs too much. |
| **C-12.41** | Detect whether a totally ordered sequence has any equal pair. Sort and compare adjacent keys in `O(n log n)` time; `B` and `E` reveal equality at area 8. |

The bounds in C-12.34–C-12.36 come from **different promises about IDs**, not different meanings of a vote. For C-12.40, if empty sequence containers must be created from scratch, count that setup too; a stated `O(n+N)` bound presumes the `k` sequence identities are already available or `k = O(n+N)`.

<span id="part-2-inversions"></span>

### 3. Inversions, sums, and middle values: C-12.42–C-12.46

An **inversion** is a pair of positions `i < j` whose keys are out of order, `area[i] > area[j]`. Equal areas are **not** inversions. In `[16,12,6,8,8,20]`, `D:16` forms four inversions and `C:12` forms three, for **7** total.

| Exercise | Reexplanation and rectangle-card starting point |
| :------- | :--------------------------------------------- |
| **C-12.42** | Count inversions in `O(n log n)` time by modifying merge-sort: count left-half and right-half inversions recursively, then count cross-half inversions during merge. Check that the six-card answer is 7. |
| **C-12.43** | **Print** every inversion pair in output-sensitive `O(n+q)` time, where `q` is the number printed. An insertion-sort-style shift can report each crossed greater value; counting alone is insufficient. |
| **C-12.44** | For a uniformly random permutation of distinct values, argue that insertion-sort has expected `Ω(n²)` work. Every pair is an inversion with probability `1/2`, so expected inversions are `n(n−1)/4`. |
| **C-12.45** | For two `n`-integer sequences and target `m`, sort each and use opposing pointers to find `a+b=m` in `O(n log n)` overall. With area lists `[6,8,12]` and `[8,16,20]`, target 28 has `8+20` and `12+16`. |
| **C-12.46** | Find `⌈log₂ n⌉` integers **closest in numeric value** to the median of a set. On distinct areas `[6,8,12,16,20]`, the median is 12 and the three closest are `12,8,16`; analyze a method that avoids sorting everything if possible. |

The little `O(n²)` double loop in the program below is useful to **check** the six-card inversion count, but it is not C-12.42's required `O(n log n)` algorithm or C-12.43's `O(n+q)` printing algorithm. In C-12.46, “closest” means smallest absolute difference from the median value, so state how ties in distance are handled.

<span id="part-2-selection"></span>

### 4. Selection and stronger guarantees: C-12.47–C-12.55

These exercises combine [selection](12-07-selection.md), restricted comparisons, deterministic pivots, and probability. A small partition trace demonstrates a rule; proving its time bound requires an argument for arbitrary `n`.

| Exercise | Reexplanation and rectangle-card starting point |
| :------- | :--------------------------------------------- |
| **C-12.47** | Match nuts to bolts when only a **nut–bolt** comparison is allowed. Imagine matching rectangle cutouts to slots using only cross-set fit tests; sorting either set by ordinary within-set comparisons would violate the model. |
| **C-12.48** | Reduce quick-select's extra lists: first count items `<`, `=`, and `>` the pivot, then materialize only the group containing the requested rank. Keep the rank subtraction from Section 12.7. |
| **C-12.49** | Describe quick-select using one mutable array and an active `[a,b]` range. Partition in place, update the rank/window, and keep only the side containing the answer. |
| **C-12.50** | Sort with a deterministic **worst-case** `O(n)` selector: find a median pivot, partition, then sort both sides. Balanced recursive halves give `O(n log n)` worst-case sorting. |
| **C-12.51** | Find the items at ranks `⌈n/k⌉, 2⌈n/k⌉, 3⌈n/k⌉, …` in expected `O(n log k)` time by reusing partitions among roughly `k` selections. With six cards and `k=3`, ranks `2,4,6` check as areas `8,12,20`. |
| **C-12.52** | Use the given `O(n)` `alien_split` that makes `k` ordered groups of size **at most `⌈n/k⌉`**. Recursively sort each group; `logₖ n` levels of linear work give **`O(n log n / log k)`** time. |
| **C-12.53** | Explain `reverse=True` with decorate-sort-undecorate **without assuming numeric keys**. A reversed-comparison key wrapper can work for strings or objects where unary negation is undefined; preserve tie order when required. |
| **C-12.54** | Strengthen expected-time quick-sort analysis to an `O(n log n)` result with probability at least `1−1/n`. Follow the exercise's indicator variables, Chernoff bound, and final bound across all input items. |
| **C-12.55** | Build a deterministic linear-time selector by taking medians of groups of five, selecting the median of those medians, and partitioning. Show why a constant fraction is discarded and why the recurrence has an `O(n)` worst-case solution. |

The [Python sorting guide](https://docs.python.org/3/howto/sorting.html) confirms that `reverse=True` preserves equal-key order, the behavior C-12.53's alternative must reproduce. In C-12.55, `[6,8,12,16,20]` has median 12, but **one** five-card group does not prove the algorithm's guarantee. With many groups, the chosen median of medians ensures that enough whole groups lie on each side. Ignoring rounding, the standard size accounting leads to `T(n) ≤ T(n/5) + T(7n/10) + O(n)`; the recursive fractions sum to less than 1. This is a **worst-case** guarantee, stronger than randomized quick-select's expected `O(n)` time.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Projects, P-12.56–P-12.62

<span id="part-3-benchmarks"></span>

### 1. Implement and benchmark sorts: P-12.56–P-12.60

Projects require a working artifact or measurements. Six cards make a readable trace, but they are too few to establish a useful timing comparison. Generate larger inputs and make each method process the **same values** at each size.

| Exercise | What to build or measure | Geometry test plan |
| :------- | :----------------------- | :----------------- |
| **P-12.56** | Nonrecursive, in-place quick-sort using an explicit stack of subarray ranges. | Trace each `[a,b]` range of the six cards; push the larger range **first** and the smaller range **second** so the next pop handles the smaller one and stack depth stays `O(log n)`. |
| **P-12.57** | Compare in-place quick-sort with a version that builds separate partition lists. | Copy the same area array for each run; report time and extra-storage behavior. |
| **P-12.58** | Benchmark merge-sort against quick-sort on random and almost-sorted inputs. | Shuffle card records for one family; make only a few swaps in sorted records for another. |
| **P-12.59** | Benchmark deterministic versus randomized quick-sort on random-looking and almost-sorted inputs. | Fix and report random seeds; repeat trials because a randomized pivot has variable timing. |
| **P-12.60** | Find measured sizes where in-place quick-sort tends to beat in-place insertion-sort. | Try increasing `n` and the same copied records; distinguish observed crossover from asymptotic guarantees. |

For an almost-sorted test, start with many area-keyed cards in sorted order and exchange a **small, stated number** of positions. For a random test, shuffle a copy using a recorded seed. Include duplicate-heavy and distinct-key families when the implementations respond differently to equal pivots. Record Python version, machine, input sizes, repetitions, and a summary such as median elapsed time; do not announce a universal winner from one run.

<span id="part-3-build"></span>

### 2. Build a bucket sort or an animation: P-12.61–P-12.62

| Exercise | What to build or show | Geometry test plan |
| :------- | :--------------------- | :----------------- |
| **P-12.61** | Bucket-sort integer keys in `[0,N−1]` in `O(n+N)` time. | Use integer area values as keys with `N > 20`; place `B` and `E` together in bucket 8 and preserve their order if stability is desired. |
| **P-12.62** | Animate one chapter sorting algorithm so its key property is visible. | Draw each labeled rectangle at its current position; highlight comparisons, swaps or merges, equal-area ties, and the finished prefix or suffix. |

For P-12.61, initializing `N` buckets and placing `n` records explains the `O(n+N)` bound. In P-12.62, animation frames should follow the same algorithm state that a hand trace would show; a visually attractive sequence that skips the decisive partition or merge would not explain the method.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Check

<span id="part-4-code"></span>

### 1. Verify a proposed sort and count small-case inversions

This original program demonstrates C-12.25's **sortedness versus permutation** distinction and checks the small inversion count used for C-12.42. The certificate lists each output card's integer position in the original arrival list. For these fixed-size card records, comparisons take constant time, so its verifier is linear; the explicit inversion list is quadratic and serves only as a six-card study trace.

```python
cards = [
    ("D", 4, 4), ("C", 3, 4), ("A", 2, 3),
    ("B", 2, 4), ("E", 1, 8), ("F", 4, 5),
]


def area(card):
    return card[1] * card[2]


def is_sorted_by_area(items):
    return all(area(items[j - 1]) <= area(items[j])
               for j in range(1, len(items)))


def verify_sort(source, result, original_positions):
    n = len(source)
    if len(result) != n or len(original_positions) != n:
        return False
    seen = [False] * n
    for j, i in enumerate(original_positions):
        if type(i) is not int or not 0 <= i < n or seen[i] or result[j] != source[i]:
            return False
        seen[i] = True
    return is_sorted_by_area(result)


ordered = sorted(cards, key=area)
certificate = [2, 3, 4, 1, 0, 5]
wrong = ordered[:-1] + [ordered[-2]]  # repeat D, omit F
inversions = [(cards[i][0], cards[j][0])
              for i in range(len(cards))
              for j in range(i + 1, len(cards))
              if area(cards[i]) > area(cards[j])]

print([card[0] for card in ordered])
print(is_sorted_by_area(wrong))
print(verify_sort(cards, ordered, certificate))
print(verify_sort(cards, wrong, certificate))
print(len(inversions))
```

<span id="part-4-output"></span>

### 2. Read the output and its limits

```text
['A', 'B', 'E', 'C', 'D', 'F']
True
True
False
7
```

`wrong` is **sorted** but repeats `D` and omits `F`, so checking adjacent areas alone accepts it. The certificate check rejects it because its final card does not match original position 5. The inversion count is **7**; because the loop compares every pair, this program is a checker for a small example, not the efficient merge-count algorithm requested in C-12.42.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why does six-card merge-sort have three split edges?</strong></summary>

**Scenario:** Start with `D,C,A,B,E,F` and recursively split each sequence roughly in half.

**Reasoning:** A longest path has group sizes `6 → 3 → 2 → 1`. The path uses three split edges, and `⌈log₂ 6⌉ = 3`. At each merge depth, all active groups together still contain six cards.

**Result:** The small tree illustrates the `O(log n)` height and `O(n)` work per level behind R-12.1 and R-12.3. A general proof must handle every `n`.

</details>

<details>
<summary><strong>Case Study 2: What happens when two equal-area cards meet during merge?</strong></summary>

**Scenario:** `B:8` is the left front and `E:8` is the right front.

**Reasoning:** The book's strict `<` comparison asks whether `8 < 8`; it is false, so it takes `E` first. A stable merge would take `B` first on equality. Repeating right-on-tie at every level reverses the order of equal-key cards, the “straggling” behavior in R-12.6.

**Result:** Both outputs have sorted areas. Card labels reveal whether stability or reversed-tie order was preserved.

</details>

<details>
<summary><strong>Case Study 3: How do equal cards change a pivot partition?</strong></summary>

**Scenario:** Partition `[D:16,C:12,A:6,B:8,E:8,F:20]` around pivot area 8.

**Reasoning:** A three-way partition gives `L=[A:6]`, `E=[B:8,E:8]`, and `G=[D:16,C:12,F:20]`. Quick-sort must process `L` and `G`; quick-select seeking rank 4 keeps only `G`, where the new rank is `4−1−2=1`.

**Result:** Both 8 cm² cards are already accounted for. Code Fragment 12.6's two-way in-place partition handles equal values differently, as R-12.11 asks you to analyze.

</details>

<details>
<summary><strong>Case Study 4: Can an in-place binary sort also be stable?</strong></summary>

**Scenario:** Mark each area `≤ 8` as `0` and each larger area as `1`. Arrival flags are `[1,1,0,0,0,1]`.

**Reasoning:** A stable two-bucket pass yields `A,B,E,D,C,F`, preserving the arrival order within both flag groups. A two-pointer in-place partition can put all zeros before ones with constant extra storage, but its swaps may change that order.

**Result:** Check **correct grouping**, **stability**, and **extra space** separately for R-12.20 and R-12.21.

</details>

<details>
<summary><strong>Case Study 5: Where do the seven inversions come from?</strong></summary>

**Scenario:** The arrival areas are `[16,12,6,8,8,20]`.

**Reasoning:** `D:16` exceeds the later values `12,6,8,8`, contributing four pairs. `C:12` exceeds `6,8,8`, contributing three. `B:8` and `E:8` tie, so their pair is not inverted.

**Result:** The count is `4+3=7`. It checks a future merge-count implementation, while the printed pairs require output-sensitive analysis in C-12.43.

</details>

<details>
<summary><strong>Case Study 6: What does a group-of-five pivot teach?</strong></summary>

**Scenario:** Use the distinct-area cards `[A:6,B:8,C:12,D:16,F:20]` as one five-card group.

**Reasoning:** Its median is `C:12`, leaving two smaller and two larger areas. In C-12.55, many groups produce many such baby medians; the median of those medians is selected as the full problem's pivot.

**Result:** This group makes the pivot rule visible. The `O(n)` worst-case proof comes from counting how many *whole groups* are guaranteed to fall on each side, not from this one balanced example.

</details>

<details>
<summary><strong>Case Study 7: How should the rectangle data be timed?</strong></summary>

**Scenario:** You want to compare merge-sort and quick-sort for P-12.58.

**Reasoning:** Make many card records with known area keys. At each input size, save one shuffled list and one almost-sorted list, then hand identical copies to both algorithms. Repeat timings on fresh copies and report the seed and summary statistic.

**Result:** The six original cards teach the trace; larger controlled inputs supply the benchmark. A measured winner for one setup does not establish a universal winner.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Book group or idea | What to practice | Rectangle-card check |
| :----------------- | :--------------- | :------------------- |
| **Reinforcement, R-12.1–R-12.24** | Explain chapter algorithms, tie rules, bounds, and special inputs. | Six-card merge path has three split edges; `B` and `E` expose ties. |
| **Creativity, C-12.25–C-12.55** | Design, prove, or adapt algorithms under exact constraints. | A sorted but wrong card list fails a permutation check; arrival order has seven inversions. |
| **Projects, P-12.56–P-12.62** | Build working sorts, benchmark them fairly, or animate their steps. | Scale the same area-keyed card records to repeatable larger inputs. |
| **Stability** | Keep equal-key items in arrival order. | Stable area order keeps `B` before `E`. |
| **In-place behavior** | Count storage used beyond the original sequence. | Buckets allocate storage; a two-pointer partition rearranges the input. |
| **Selection** | Return specified ranks and analyze pivot quality. | Rank 4 is 12 cm²; poor extreme pivots can make work quadratic. |
| **Evidence** | Distinguish a trace, a proof, and a measurement. | Six cards check arithmetic; an asymptotic claim needs a general argument. |

[🔝 Back to Top](#top)
