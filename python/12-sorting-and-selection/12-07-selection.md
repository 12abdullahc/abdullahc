<span id="top"></span>

# 12.7 Selection — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 12, Section 12.7, printed pages 571–573 ([supplied Chapter 12 PDF](<../Data Structures and Algorithms in Python - C12.pdf>)).<br>
> **Topic:** 12.7 Selection; 12.7.1 Prune-and-Search; 12.7.2 Randomized Quick-Select; 12.7.3 Analyzing Randomized Quick-Select.<br>
> **Domain Focus:** The same six rectangular cards from [Section 12.1](12-01-why-study-sorting-algorithms.md); find one ranked area without fully sorting all the cards.<br>
> **User Prompt:** Reexplain Section 12.7 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Ask for One Area](#background)
   - [1. Reuse the six rectangle cards](#background-cards)
   - [2. Tell sorting apart from selection](#background-question)
2. [Part 1: 12.7 Selection](#part-1)
   - [1. Define a rank and an order statistic](#part-1-rank)
   - [2. Understand what “median” means for six cards](#part-1-median)
3. [Part 2: 12.7.1 Prune-and-Search](#part-2)
   - [1. Discard a portion that cannot hold the answer](#part-2-pattern)
   - [2. Shrink a geometry question without sorting](#part-2-example)
4. [Part 3: 12.7.2 Randomized Quick-Select](#part-3)
   - [1. Partition around a randomly chosen pivot](#part-3-groups)
   - [2. Keep the correct rank when recursing](#part-3-ranks)
   - [3. Trace the fourth-smallest area](#part-3-trace)
   - [4. Run an original Python version](#part-3-code)
5. [Part 4: 12.7.3 Analyzing Randomized Quick-Select](#part-4)
   - [1. Count one partition's work](#part-4-cost)
   - [2. Find how often a useful pivot appears](#part-4-good)
   - [3. Add the expected work across smaller groups](#part-4-sum)
   - [4. Separate expected time from worst-case time](#part-4-worst)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Ask for One Area

<span id="background-cards"></span>

### 1. Reuse the six rectangle cards

The cards arrive as `D, C, A, B, E, F`. Each area is **width × height**, measured in square centimetres:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `D` | 4 cm | 4 cm | 16 cm² |
| `C` | 3 cm | 4 cm | 12 cm² |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 2 cm | 4 cm | 8 cm² |
| `E` | 1 cm | 8 cm | 8 cm² |
| `F` | 4 cm | 5 cm | 20 cm² |

The arrival-order area list is `[16, 12, 6, 8, 8, 20]`. If we fully sort by area, the values become `[6, 8, 8, 12, 16, 20]`. We will use that sorted list to **check answers**, but the selection algorithm below will not construct it.

<span id="background-question"></span>

### 2. Tell sorting apart from selection

Suppose a teacher asks, “What is the **fourth-smallest area**?” The answer is **12 cm²**. The teacher has not asked us to put every card in order. That is the distinction:

| Task | Output | With our six cards |
| :--- | :----- | :----------------- |
| **Sorting** | Every item in order. | `[6, 8, 8, 12, 16, 20]` |
| **Selection** | The value at one requested rank. | Rank 4 gives `12 cm²`. |

Selection is also different from **selection-sort**, the full sorting method compared in [Section 12.5](12-05-comparing-sorting-algorithms.md). The name is similar, but the output here is only **one** rank's value. The [quick-sort guide](12-03-quick-sort.md) supplies the idea of partitioning around a pivot; quick-select uses that partition to discard work.

> **Mental model:** To find one ranked area, partition the cards, identify which group contains that rank, and continue only with that group.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 12.7 Selection

<span id="part-1-rank"></span>

### 1. Define a rank and an order statistic

An **order statistic** is an item specified by its position in sorted order, such as the smallest, largest, or median. The book's **selection problem** asks for the `k`th-smallest item from `n` unsorted comparable items, with **1 ≤ k ≤ n**. Here `k` is a **1-based rank**; if we checked a fully sorted Python list, its index would be `k − 1`.

| 1-based rank `k` | Sorted index `k − 1` | Area | Card label if area identifies one card |
| ---------------: | -------------------: | ---: | :------------------------------------- |
| 1 | 0 | 6 cm² | `A` |
| 2 | 1 | 8 cm² | `B` or `E` by area alone |
| 3 | 2 | 8 cm² | `B` or `E` by area alone |
| 4 | 3 | 12 cm² | `C` |
| 5 | 4 | 16 cm² | `D` |
| 6 | 5 | 20 cm² | `F` |

The two 8 cm² cards occupy two **rank positions** even though their values tie. An area-only selection returns `8` for either rank 2 or rank 3; it does not identify which physical card is “the” second or third unless we define a separate tie-breaking rule.

We could sort all six areas and read `sorted(areas)[k - 1]`, taking O(n log n) comparison-sort time. If we need only one rank, the book asks whether we can do less work. Finding just the minimum or maximum already takes O(n) by scanning once; the interesting question is whether **any** valid rank can be found in linear time.

<span id="part-1-median"></span>

### 2. Understand what “median” means for six cards

For an even number of measurements, different questions use the word *median* differently. The book's selection convention uses `k = ⌈n/2⌉`; with `n = 6`, that is **rank 3**, whose area is **8 cm²**. Rank 4, the upper middle position, is **12 cm²**.

If a statistics exercise asks for the **arithmetic median** of the six numeric areas, it averages the two middle values: `(8 + 12) / 2 = 10 cm²`. No card in this stack has area 10 cm². Quick-select returns an **existing ranked value** for a specified `k`; to compute that arithmetic median, we would request both middle ranks and average them.

With five distinct-area cards `A, B, C, D, F`, the sorted areas are `[6, 8, 12, 16, 20]`. The one middle position is rank 3, giving `12 cm²` without this even-size ambiguity.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 12.7.1 Prune-and-Search

<span id="part-2-pattern"></span>

### 1. Discard a portion that cannot hold the answer

**Prune-and-search**, also called *decrease-and-conquer*, reduces the current problem by ruling out items that cannot contain the answer, then searches **one** remaining subproblem. When the remaining set is small enough, solve it directly. The book cites binary search as another example of this design pattern, although binary search starts with **sorted** data and the selection problem here starts with **unsorted** data.

This differs from the [quick-sort](12-03-quick-sort.md) recursion: quick-sort must sort *both* sides of a partition to produce a full ordered list. Quick-select needs only the side containing the requested rank—or it can stop immediately if the rank falls in the pivot's equal group.

<span id="part-2-example"></span>

### 2. Shrink a geometry question without sorting

Imagine placing card `C:12` at the center of a comparison. Three cards have **less** area (`A:6`, `B:8`, `E:8`), one has **equal** area (`C:12`), and two have **greater** area (`D:16`, `F:20`). The groups need not be sorted internally.

If the teacher asks for rank **5**, we can discard the three smaller cards and the pivot card. The answer is the **first-smallest** value among `[D:16, F:20]`, so it is **16 cm²**. The rank changed from `5` in all six cards to `5 − 3 − 1 = 1` in the surviving group. That subtraction is the key bookkeeping step.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 12.7.2 Randomized Quick-Select

<span id="part-3-groups"></span>

### 1. Partition around a randomly chosen pivot

The book's Code Fragment 12.9 chooses a **random item** from the current sequence as pivot `x`, then makes three groups:

| Group | Area relationship to `x` | With pivot area 8 cm² |
| :---- | :----------------------- | :--------------------- |
| `L` | Strictly less than `x`. | `[A:6]` |
| `E` | Equal to `x`. | `[B:8, E:8]` |
| `G` | Strictly greater than `x`. | `[D:16, C:12, F:20]` |

The pivot is chosen from **physical input items** (or positions), so either `B` or `E` can supply area 8. This partition covers every card exactly once. Equal-area cards stay together in `E` and do not need another recursive search if the requested rank lands there. In this six-card example, choosing an area-8 pivot has probability `2/6` because two of the six cards have that area.

<span id="part-3-ranks"></span>

### 2. Keep the correct rank when recursing

Let `ℓ = |L|` and `e = |E|`. In the current problem, `L` contains ranks `1..ℓ`, `E` contains ranks `ℓ+1..ℓ+e`, and `G` contains all larger ranks. The rule is:

| Requested 1-based rank | Action | Rank in the next group |
| :--------------------- | :----- | :--------------------- |
| `k ≤ ℓ` | Search `L`. | Keep `k`. |
| `ℓ < k ≤ ℓ + e` | Return the pivot **value**. | Stop; no next group. |
| `k > ℓ + e` | Search `G`. | Use `k − ℓ − e`. |

For the area-8 partition above, `ℓ = 1` and `e = 2`. Rank 1 is in `L`; ranks **2 and 3** are both in `E`; ranks 4, 5, and 6 are in `G`. If we seek rank 4, its **new** rank within `G` is `4 − 1 − 2 = 1`.

<span id="part-3-trace"></span>

### 3. Trace the fourth-smallest area

The pivot choices below are **one possible random run**, selected to make the rank changes visible. We ask for `k = 4` from the original arrival-order areas:

| Current cards and requested rank | Chosen pivot | `L` / `E` / `G` | Decision |
| :------------------------------- | :----------- | :-------------- | :------- |
| `[D:16, C:12, A:6, B:8, E:8, F:20]`, `k=4` | `B:8` | `[A:6]` / `[B:8, E:8]` / `[D:16, C:12, F:20]` | Search `G` with new rank `4−1−2=1`. |
| `[D:16, C:12, F:20]`, `k=1` | `D:16` | `[C:12]` / `[D:16]` / `[F:20]` | Search `L` with rank 1. |
| `[C:12]`, `k=1` | — | One item remains. | Return **12 cm²**. |

No step sorted all six cards. If the first request had instead been `k = 2` or `k = 3`, the first pivot's equal group would have answered **8 cm²** immediately.

<span id="part-3-code"></span>

### 4. Run an original Python version

This teaching version accepts **area numbers** and returns the area at the requested 1-based rank. It follows the book's three-group logic but forms the groups in one pass. It creates lists for its groups, so it is not an in-place implementation.

```python
import random


def select_area(values, rank):
    if not 1 <= rank <= len(values):
        raise ValueError("rank must be from 1 through the number of values")

    def search(current, wanted):
        if len(current) == 1:
            return current[0]

        pivot = random.choice(current)
        smaller, equal, larger = [], [], []
        for area in current:
            if area < pivot:
                smaller.append(area)
            elif area > pivot:
                larger.append(area)
            else:
                equal.append(area)

        if wanted <= len(smaller):
            return search(smaller, wanted)
        if wanted <= len(smaller) + len(equal):
            return pivot
        new_rank = wanted - len(smaller) - len(equal)
        return search(larger, new_rank)

    return search(list(values), rank)


areas = [16, 12, 6, 8, 8, 20]
print(select_area(areas, 1))  # 6
print(select_area(areas, 3))  # 8
print(select_area(areas, 4))  # 12
print(select_area(areas, 6))  # 20
print(areas)                  # [16, 12, 6, 8, 8, 20]
```

The printed answers do not depend on which valid random pivots happen to be chosen. The final line shows that this version leaves the input list's order unchanged. Since it selects **numeric areas**, rank 2 or 3 yields `8` without deciding whether card `B` or `E` is the named result.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 12.7.3 Analyzing Randomized Quick-Select

<span id="part-4-cost"></span>

### 1. Count one partition's work

For a current group of `m` cards, choosing one item and classifying all `m` areas into `L`, `E`, and `G` takes **O(m)** time if comparing two areas takes O(1) time. Quick-select then recurses into **at most one** group. This is the difference from quick-sort, which must process both outer groups.

If the selected group were always a fixed fraction smaller, the total work would already be a decreasing geometric sum. A random pivot does not guarantee that on every call, so the book asks how often a **good** split appears.

<span id="part-4-good"></span>

### 2. Find how often a useful pivot appears

Call a split **good** when both `|L|` and `|G|` are at most `3m/4`. Then whichever side contains the requested rank has no more than three quarters of the current items. For our original six cards, `3m/4 = 4.5`, so a side of at most **4 cards** qualifies:

| Pivot card(s) | Pivot area | `|L|` | `|G|` | Good? |
| :------------ | ---------: | ----: | ----: | :---- |
| `A` | 6 | 0 | 5 | No. |
| `B` or `E` | 8 | 1 | 3 | Yes; two pivot choices. |
| `C` | 12 | 3 | 2 | Yes. |
| `D` | 16 | 4 | 1 | Yes. |
| `F` | 20 | 5 | 0 | No. |

Four of the six **physical pivot choices** are good, giving probability `4/6 = 2/3` for this one partition. The general proof needs only **at least 1/2**: at least half the item positions are sufficiently central in sorted order, and ties can only shrink the strict `L` and `G` groups. Each new random choice has that lower-bounded success chance for its *current* group.

<span id="part-4-sum"></span>

### 3. Add the expected work across smaller groups

Let `b·m` bound one partition's work for a group of size `m`. Because the chance of a good pivot on each current group is at least `1/2`, the **expected number of attempts until a good split is at most 2**. We may pessimistically charge each attempt as though it still scanned all `m` items, even though unsuccessful pivots can also remove items. That gives at most `2b·m` expected work before the next group is at most `3m/4` in size.

Writing `T(m)` for expected time, the book's argument becomes

```text
T(m) ≤ T(3m/4) + 2b·m.
```

Expand it over successively smaller groups:

```text
T(n) ≤ 2b·n × [1 + 3/4 + (3/4)² + ...] + a constant
     ≤ 2b·n × 4 + a constant
     = O(n).
```

The bracketed geometric series sums to 4. This establishes Proposition 12.7's **O(n) expected running time**, provided area comparisons are O(1). The expectation is over the algorithm's random pivot choices for **any fixed input**; we do not assume the cards arrive in a random order.

<span id="part-4-worst"></span>

### 4. Separate expected time from worst-case time

An unlucky sequence of pivots can repeatedly leave nearly all items in the one group we still need. For five **distinct-area** cards already ordered as `[6, 8, 12, 16, 20]`, repeatedly choosing the largest pivot while asking for rank 1 leaves groups of sizes `4, 3, 2, 1`. The scans of sizes `5 + 4 + 3 + 2` illustrate a pattern that grows as **O(n²)** in the worst case.

Randomization makes that pattern unlikely in aggregate; it does not make it impossible in a single run. The book mentions a more elaborate deterministic method with O(n) worst-case time as an exercise, but Section 12.7 implements and analyzes the simpler randomized method. Its three-group Python code also allocates lists, so the **O(n) claim here is expected time**, not a claim that this implementation uses no extra storage.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Is rank 1 the same as Python index 1?</strong></summary>

**Scenario:** The teacher requests the **first-smallest** area from our six cards.

**Problem:** The selection rank is 1-based, but Python list indices start at 0. In the checking list `[6, 8, 8, 12, 16, 20]`, rank 1 is at index `1−1=0`.

**Result:** Rank 1 is **6 cm²**, card `A`; rank 6 is **20 cm²**, card `F`.

</details>

<details>
<summary><strong>Case Study 2: Which card is the third-smallest by area?</strong></summary>

**Scenario:** Cards `B` and `E` both have area 8 cm², occupying ranks 2 and 3 by value.

**Reasoning:** Area-only comparisons say `8 = 8`. The value at rank 3 is fixed, but the physical card at that rank is not specified without a tie rule.

**Result:** Quick-select returns **8 cm²**. To name exactly `B` or `E`, define a second key such as arrival position or label.

</details>

<details>
<summary><strong>Case Study 3: How does a pivot of 12 change rank 5?</strong></summary>

**Scenario:** Choose card `C:12` as pivot. Then `L=[A:6, B:8, E:8]`, `E=[C:12]`, and `G=[D:16, F:20]`.

**Reasoning:** Four cards have area no greater than the pivot. The fifth-smallest overall is therefore the **first-smallest in `G`**, with new rank `5−3−1=1`.

**Result:** Search only `G` and obtain **16 cm²**. For rank 4, the same pivot would answer **12 cm²** immediately.

</details>

<details>
<summary><strong>Case Study 4: Why can a selected median differ from an arithmetic median?</strong></summary>

**Scenario:** The sorted area values are `[6, 8, 8, 12, 16, 20]`.

**Reasoning:** The book's selected median uses `k=⌈6/2⌉=3`, returning **8 cm²**. A statistics calculation averages the two middle values, `(8+12)/2=10 cm²`.

**Result:** Both calculations answer valid but different questions. Specify whether the task wants a **ranked card area** or the **numeric midpoint** of two central areas.

</details>

<details>
<summary><strong>Case Study 5: Does a good first pivot guarantee the entire run is fast?</strong></summary>

**Scenario:** An area-8 pivot gives groups of sizes `1`, `2`, and `3`; it is good because each outer group has at most `3×6/4=4.5` cards.

**Reasoning:** If the requested rank lies in `G`, quick-select still has to select from its three cards. The later random pivots could be helpful or unlucky. The first split alone does not fix every later choice.

**Result:** The O(n) statement is an **expectation over pivot choices**, while one individual run may take more work.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 12.7 idea | Plain-language meaning | Rectangle-card example |
| :---------------- | :--------------------- | :--------------------- |
| **Selection** | Find one item by its 1-based rank in sorted order. | Rank 4 gives area **12 cm²** without producing a full sort. |
| **Order statistic** | A value described by rank, such as minimum or median. | Rank 1 is 6 cm²; the book's lower median rank 3 is 8 cm². |
| **Prune-and-search** | Discard groups that cannot contain the requested rank. | Pivot 12 and rank 5 leave only the greater group `[16, 20]`. |
| **Three groups** | Split areas into smaller `L`, equal `E`, and greater `G`. | Pivot 8 gives `L=[6]`, `E=[8,8]`, `G=[16,12,20]`. |
| **Rank adjustment** | Subtract the sizes of `L` and `E` when entering `G`. | Rank 4 with pivot 8 becomes rank `4−1−2=1` in `G`. |
| **Duplicate keys** | Equal areas fill multiple rank positions but have one selected value. | Ranks 2 and 3 both return 8 cm², with no unique card label. |
| **Expected time** | Random pivots give O(n) time on average over pivot choices. | Four of six physical cards are good first pivots. |
| **Worst case** | Repeated extreme pivots can cost O(n²). | On five sorted distinct areas, always selecting the largest leaves nearly all cards to search. |

[🔝 Back to Top](#top)
