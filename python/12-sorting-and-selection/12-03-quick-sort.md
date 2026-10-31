<span id="top"></span>

# 12.3 Quick-Sort — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 12, Section 12.3, printed pages 550–561 ([supplied Chapter 12 PDF](<../Data Structures and Algorithms in Python - C12.pdf>)).<br>
> **Topic:** 12.3 Quick-Sort; 12.3.1 Randomized Quick-Sort; 12.3.2 Additional Optimizations for Quick-Sort.<br>
> **Domain Focus:** The six rectangular cards from the [Section 12.1 guide](12-01-why-study-sorting-algorithms.md); partition their areas around a pivot, then study how pivot choices affect the work.<br>
> **User Prompt:** Reexplain Section 12.3 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Sort Cards Around One Area](#background)
   - [1. Reuse the six measured cards](#background-cards)
   - [2. Compare quick-sort with merge-sort](#background-bridge)
2. [Part 1: 12.3 Quick-Sort](#part-1)
   - [1. Choose a pivot and form three groups](#part-1-partition)
   - [2. Trace the book's last-item pivot choice](#part-1-trace)
   - [3. Understand the first-item queue version](#part-1-queue)
   - [4. Run a small three-group Python version](#part-1-code)
   - [5. Relate the running time to the tree's height](#part-1-time)
3. [Part 2: 12.3.1 Randomized Quick-Sort](#part-2)
   - [1. Pick a random card as pivot](#part-2-choice)
   - [2. Understand the expected-time argument](#part-2-expected)
4. [Part 3: 12.3.2 Additional Optimizations for Quick-Sort](#part-3)
   - [1. Partition the original list with two scans](#part-3-in-place)
   - [2. Trace swaps on the same cards](#part-3-trace)
   - [3. Run an in-place Python-list version](#part-3-code)
   - [4. Account for the recursion stack](#part-3-stack)
   - [5. Choose pivots and handle small ranges](#part-3-practical)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Sort Cards Around One Area

<span id="background-cards"></span>

### 1. Reuse the six measured cards

The [Section 12.1 guide](12-01-why-study-sorting-algorithms.md) gave us six cards in arrival order `D, C, A, B, E, F`. Their areas are the values we compare:

| Card, in arrival order | Width | Height | Area = width × height |
| :--------------------- | ----: | -----: | --------------------: |
| `D` | 4 cm | 4 cm | 16 cm² |
| `C` | 3 cm | 4 cm | 12 cm² |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 2 cm | 4 cm | 8 cm² |
| `E` | 1 cm | 8 cm | 8 cm² |
| `F` | 4 cm | 5 cm | 20 cm² |

The area list is `[16, 12, 6, 8, 8, 20]`; the desired result is `[6, 8, 8, 12, 16, 20]`. The two 8 cm² values belong to separate physical cards. Our Python examples sort **numbers**; when a diagram names cards, imagine their labels traveling with the area measurements. Compare by area alone, so the labels do not break an area tie.

<span id="background-bridge"></span>

### 2. Compare quick-sort with merge-sort

The [Section 12.2 guide](12-02-merge-sort.md) split the list by **position** into two nearly equal halves, sorted each half, then did the important work of **merging** them. Quick-sort instead first chooses a **pivot** area and groups values by their relationship to it. Once the groups have been sorted, combining them is just placing them in order.

For a first picture, choose card `E`'s area, **8 cm²**, as the pivot:

```text
Smaller than 8: [6]            Equal to 8: [8, 8]            Greater than 8: [16, 12, 20]
```

The greater-than group is still unsorted, so it needs the same treatment again. The equal group already has the correct position between all smaller and all greater areas; neither 8 needs another recursive sort.

| Divide-and-conquer step | Merge-sort | Quick-sort |
| :---------------------- | :--------- | :--------- |
| Divide | Split by position into near halves. | Partition by comparison with a pivot. |
| Conquer | Sort both halves recursively. | Sort only the smaller and greater groups recursively. |
| Combine | Merge two sorted halves. | Put the sorted smaller group, equal group, and sorted greater group together. |

> **Mental model:** A pivot puts one area value—and every card tied with it—between all smaller and all greater areas before the recursive calls begin.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 12.3 Quick-Sort

<span id="part-1-partition"></span>

### 1. Choose a pivot and form three groups

In the book's high-level description, a sequence `S` of zero or one item is already sorted. Otherwise, select a pivot `x`—the **last item** is the example choice—and divide all items into three groups:

| Group | Meaning | With pivot area 8 cm² |
| :---- | :------ | :--------------------- |
| `L` | Areas **less than** `x`. | `[6]` |
| `E` | Areas **equal to** `x`. | `[8, 8]` from cards `B` and `E`. |
| `G` | Areas **greater than** `x`. | `[16, 12, 20]` |

Only `L` and `G` need recursive sorting. The combine step is **sorted `L` + `E` + sorted `G`**. Every value in `L` is below every value in `E`, and every value in `G` is above it, so that order is valid once the two outer groups are sorted. If every area is distinct, `E` contains only the pivot; our two 8 cm² cards show why `E` can be larger.

<span id="part-1-trace"></span>

### 2. Trace the book's last-item pivot choice

Now follow the high-level rule of taking the **last area of each current group** as its pivot. The first pivot is `F`'s 20 cm², which happens to be the largest area:

| Current unsorted group | Pivot | `L`: smaller | `E`: equal | `G`: greater |
| :--------------------- | ----: | :----------- | :--------- | :----------- |
| `[16, 12, 6, 8, 8, 20]` | 20 | `[16, 12, 6, 8, 8]` | `[20]` | `[]` |
| `[16, 12, 6, 8, 8]` | 8 | `[6]` | `[8, 8]` | `[16, 12]` |
| `[16, 12]` | 12 | `[]` | `[12]` | `[16]` |

The one-item groups `[6]` and `[16]`, and the empty groups, stop at the base case. Rebuild the result from the smallest recursive problem upward:

```text
[] + [12] + [16]                 → [12, 16]
[6] + [8, 8] + [12, 16]         → [6, 8, 8, 12, 16]
[6, 8, 8, 12, 16] + [20] + []  → [6, 8, 8, 12, 16, 20]
```

In the first partition, choosing 20 leaves five values on one side and none on the other. A different pivot can give a shorter recursion tree: choosing card `C`'s **12 cm²** at the root would give three smaller areas `[6, 8, 8]`, one equal area `[12]`, and two greater areas `[16, 20]`.

<span id="part-1-queue"></span>

### 3. Understand the first-item queue version

The book next implements the three-group method using `LinkedQueue` from Section 7.1.2. A queue exposes its **first** item, so this concrete version takes the first item as pivot. For our original arrival order, that pivot is `D`'s **16 cm²**, giving:

```text
L = [12, 6, 8, 8]       E = [16]       G = [20]
```

The procedure dequeues every item from the input queue into `L`, `E`, or `G`, recursively sorts `L` and `G`, then enqueues their items back into the input queue in `L`, `E`, `G` order. A card belongs in `E` when it is neither less than nor greater than the pivot. This uses only the strict `<` comparison in both directions.

Each basic `LinkedQueue` operation is O(1). The queue groups also retain their arrival order as items are enqueued, so when `B` and `E` eventually meet in one equal-area group, both remain present in their original `B`-then-`E` order. The book's earlier [merge-sort list code](12-02-merge-sort.md) used a different tie decision, so its equal-area card order could change.

<span id="part-1-code"></span>

### 4. Run a small three-group Python version

This teaching version uses Python lists and the **last** item as pivot, as in the high-level description. It returns a new list; it is not the book's queue implementation.

```python
def quick_sort_areas(source):
    if len(source) < 2:
        return source[:]

    pivot = source[-1]
    smaller, equal, greater = [], [], []
    for area in source:
        if area < pivot:
            smaller.append(area)
        elif pivot < area:
            greater.append(area)
        else:
            equal.append(area)

    return quick_sort_areas(smaller) + equal + quick_sort_areas(greater)


areas = [16, 12, 6, 8, 8, 20]
ordered = quick_sort_areas(areas)
print(ordered)  # [6, 8, 8, 12, 16, 20]
print(areas)    # [16, 12, 6, 8, 8, 20]
```

The `else` branch handles equality: an area goes there when neither `area < pivot` nor `pivot < area` is true. The original `areas` list stays in arrival order because this version builds new lists.

<span id="part-1-time"></span>

### 5. Relate the running time to the tree's height

Partitioning a group of `m` areas looks at each area, so it takes O(m) time; the queue version's final concatenation is also O(m). Across any one depth of the recursion tree, the groups contain at most the original `n` areas. If the tree has height `h`, the total work is **O(nh)**.

Pivot choice controls `h`:

| Pivot pattern | Shape of the recursive work | Time |
| :------------ | :-------------------------- | :--- |
| Near-balanced smaller/greater groups | Height O(log n). | O(n log n). |
| A largest or smallest pivot at every call on distinct areas | One child has one fewer area each time; height n − 1. | O(n²) worst case. |

For a concrete bad case, remove duplicate-area card `E` and line up the five distinct areas as `[6, 8, 12, 16, 20]`. Choosing the last item each time gives group sizes `5, 4, 3, 2, 1`. The partition loops alone inspect `5 + 4 + 3 + 2 = 14` card areas before the one-item base case. For general `n`, that descending sum grows quadratically. Even a consistent **one-quarter/three-quarters** split keeps the tree height O(log n); perfect halves are unnecessary.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 12.3.1 Randomized Quick-Sort

<span id="part-2-choice"></span>

### 1. Pick a random card as pivot

Taking the last item is simple, but an already sorted list of distinct areas makes that choice repeatedly extreme. **Randomized quick-sort** instead selects a uniformly random **item** from the current group at each partition. Our six-card stack shows how much the first split can vary:

| Pivot area | Card choice(s) | `L` size | `E` size | `G` size |
| ---------: | :------------- | -------: | -------: | -------: |
| 6 cm² | `A` | 0 | 1 | 5 |
| 8 cm² | `B` or `E` | 1 | 2 | 3 |
| 12 cm² | `C` | 3 | 1 | 2 |
| 16 cm² | `D` | 4 | 1 | 1 |
| 20 cm² | `F` | 5 | 1 | 0 |

Because there are two physical 8 cm² cards, a random card gives area 8 with probability `2/6`; every other area in the table has probability `1/6`. A 12 cm² pivot makes two fairly balanced recursive groups, while a 20 cm² pivot makes one group of five. Random selection does **not** promise a good split on every call.

<span id="part-2-expected"></span>

### 2. Understand the expected-time argument

Proposition 12.3 says randomized quick-sort has **expected O(n log n) time**, assuming comparisons take O(1). The expectation is over the algorithm's random pivot choices for a fixed input, so it does not require the incoming cards to arrive in random order. A particular unlucky run can still take O(n²) time.

The book's proof calls a split **good** when both recursive sides have between about `n/4` and `3n/4` items. For **distinct** area values, roughly the middle half of pivot ranks yield such splits, apart from rounding for small `n`. Thus a random choice has a constant chance of being good, and the expected number of choices until a good split is constant. Each good split reduces the remaining problem by a fixed fraction. There are O(log n) geometric size groups, with O(n) expected total work in each, giving O(n log n) overall.

Our six-card table has a repeated 8, so the simple “half the pivot ranks are good” count is not a literal probability calculation for this example. Both 8s enter `E` together and are excluded from further recursive work. The table illustrates pivot effects; the general proof explains the expected bound.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 12.3.2 Additional Optimizations for Quick-Sort

<span id="part-3-in-place"></span>

### 1. Partition the original list with two scans

The queue and teaching-list versions create extra `L`, `E`, and `G` containers. The book's **in-place list version** rearranges values inside the original Python list using swaps. A current subproblem is identified by inclusive indices `a` and `b`; the pivot is the area at index `b`.

Two markers partition that range:

1. Move a **left marker** rightward while its area is strictly below the pivot.
2. Move a **right marker** leftward while its area is strictly above the pivot.
3. If they have not crossed, swap the two areas and move both markers inward.
4. After they cross, swap the pivot into the left marker's position and recurse on the ranges before and after it.

The pivot is then in its final sorted **position**. The ranges on either side still need sorting. Unlike the three-group method, this two-scan method does not collect all equal areas in one `E` group: another area equal to the pivot may land on either side. Strict comparisons and moving both markers after a swap also make progress when two areas equal the pivot.

<span id="part-3-trace"></span>

### 2. Trace swaps on the same cards

With our original list, the last area is 20 cm². It is already the largest, so the first partition leaves `F` at the right end. The next active range is `[D:16, C:12, A:6, B:8, E:8]`, with `E`'s area 8 as pivot. The markers find a too-large value on the left and a value no larger than 8 on the right:

| Action in the active range | Full card order after the action |
| :------------------------- | :------------------------------- |
| Start; `E:8` is the pivot at index 4. | `[D:16, C:12, A:6, B:8, E:8, F:20]` |
| Swap `D:16` with `B:8`. | `[B:8, C:12, A:6, D:16, E:8, F:20]` |
| Swap `C:12` with `A:6`. | `[B:8, A:6, C:12, D:16, E:8, F:20]` |
| Markers cross; swap pivot `E:8` with `C:12`. | `[B:8, A:6, E:8, D:16, C:12, F:20]` |

Now `E:8` is at index `2`. The left range `[B:8, A:6]` contains values **at most** 8; the right range `[D:16, C:12]` contains values **at least** 8. Neither range is yet ordered internally. Recursive calls sort them, producing `[A:6, B:8, E:8, C:12, D:16, F:20]`.

<span id="part-3-code"></span>

### 3. Run an in-place Python-list version

This version follows the book's two-marker partition behavior while using a different loop structure. It changes the input list and does not allocate three partition lists:

```python
def quick_sort_in_place(data, first=0, last=None):
    if last is None:
        last = len(data) - 1
    if first >= last:
        return

    pivot = data[last]
    low, high = first, last - 1
    while low <= high:
        if data[low] < pivot:
            low += 1
            continue
        if pivot < data[high]:
            high -= 1
            continue
        data[low], data[high] = data[high], data[low]
        low += 1
        high -= 1

    data[low], data[last] = data[last], data[low]
    quick_sort_in_place(data, first, low - 1)
    quick_sort_in_place(data, low + 1, last)


areas = [16, 12, 6, 8, 8, 20]
quick_sort_in_place(areas)
print(areas)  # [6, 8, 8, 12, 16, 20]
```

`first` and `last` bound the **current** part of the same list; the recursive calls pass smaller index ranges rather than copied sublists. The final swap puts the pivot at index `low`. This code handles equal areas because, when neither strict comparison advances a marker, it swaps the encountered values and moves both markers.

<span id="part-3-stack"></span>

### 4. Account for the recursion stack

The partition step uses only a few markers and one pivot value besides the original list. The complete recursive algorithm also uses a **call stack**. Its depth follows the quick-sort tree: it can be O(n) after repeated poor splits, and it is O(log n) in expectation with randomized pivots.

The book sketches an iterative alternative with an explicit stack of index ranges. Pushing the **larger** subproblem first and the **smaller** one second makes the smaller range the next one processed; that ordering can keep the pending stack to O(log n) entries. This is a separate optimization to stack usage, not a change to the pivot-partition rule.

<span id="part-3-practical"></span>

### 5. Choose pivots and handle small ranges

The last-item rule is vulnerable on already sorted, reverse-sorted, or nearly sorted distinct values. The book offers two pivot-selection ideas:

| Idea | How it chooses | What to remember |
| :--- | :------------- | :--------------- |
| **Random pivot** | Select an item uniformly at random. | Expected O(n log n), but an unlucky sequence of choices remains possible. |
| **Median of three** | Take the median of the first, middle, and last candidate values. | A practical heuristic; it does not guarantee the best split. |

For our original areas, the first value is 16, a middle value is 8, and the last is 20, so their median is **16 cm²**. That gives four smaller areas, one equal area, and one greater area. Choosing 12 would give a more even `3 + 1 + 2` partition. The example shows why median-of-three is a useful guess, not a promise.

The section also describes a **hybrid**: keep quick-sort for large ranges, then use insertion sort when a range is short enough. For only six cards, the overhead of more partitioning may outweigh the benefit; a practical threshold is an implementation choice. The book gives a possible threshold near 50 items and compares sorting tradeoffs further in Section 12.5.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Both 8 cm² cards must enter the equal group</strong></summary>

**Scenario:** In the high-level trace, card `E` supplies an 8 cm² pivot, and card `B` also has area 8 cm².

**Problem:** Putting `B` in the smaller or greater group would contradict the numeric comparison: neither `8 < 8` nor `8 > 8` is true.

**Fix:** Put **both** cards in `E`. The partition of `[16, 12, 6, 8, 8]` is `L = [6]`, `E = [8, 8]`, `G = [16, 12]`.

**Result:** Neither card is lost, and neither 8 needs another recursive call in the three-group method.

</details>

<details>
<summary><strong>Case Study 2: Sorted, distinct areas can be a slow input</strong></summary>

**Scenario:** Use cards `A, B, C, D, F` once each, with already ordered areas `[6, 8, 12, 16, 20]`.

**Problem:** Choosing the last value as pivot repeatedly selects the largest remaining area.

**Reasoning:** The active group sizes are `5, 4, 3, 2, 1`. Partitioning the first four groups checks `5 + 4 + 3 + 2 = 14` values before reaching a singleton. With `n` distinct values, the analogous sum grows as Θ(n²).

**Result:** The list is sorted correctly, but its starting order makes this deterministic pivot rule inefficient.

</details>

<details>
<summary><strong>Case Study 3: Pivot placement does not finish the two side ranges</strong></summary>

**Scenario:** The in-place partition has placed card `E`'s 8 cm² pivot between `[B:8, A:6]` and `[D:16, C:12]`.

**Problem:** The left side reads `8, 6` and the right side reads `16, 12`; both are internally out of order.

**Fix:** Recursively sort the left and right index ranges while leaving the pivot in place.

**Result:** `[B:8, A:6, E:8, D:16, C:12, F:20]` becomes `[A:6, B:8, E:8, C:12, D:16, F:20]`.

</details>

<details>
<summary><strong>Case Study 4: The in-place version may change equal-card order</strong></summary>

**Scenario:** Consider just `[B:8, A:6, E:8]`, with `E`'s area as the last-item pivot.

**Problem:** The two-scan version has no separate equal group. It swaps `B:8` and `A:6`, then swaps the pivot `E:8` into the middle position.

**Result:** The area output is `[6, 8, 8]`, but the card order is `[A, E, B]`: `E` now precedes `B`. Sorting numeric areas alone cannot reveal this change. The three-queue version groups equal cards in FIFO order; the in-place version does not promise that order.

</details>

<details>
<summary><strong>Case Study 5: A random pivot is a probability, not a guarantee</strong></summary>

**Scenario:** Select one of the six physical cards uniformly as the first pivot.

**Question:** Is an 8 cm² pivot as likely as a 20 cm² pivot?

**Reasoning:** Two cards, `B` and `E`, have area 8, so the chance of choosing area 8 is `2/6`. Only `F` has area 20, so its chance is `1/6`. Either choice is possible, and later recursive calls make new choices.

**Result:** Randomization supports an expected-time bound over many possible choices; it cannot guarantee a balanced first partition or a fast individual run.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 12.3 idea | Plain-language meaning | Rectangle-card example |
| :---------------- | :--------------------- | :--------------------- |
| **Pivot** | One area used to divide a current group. | High-level last pivot begins with `F:20`; queue first pivot begins with `D:16`. |
| **Three groups** | `L` is smaller, `E` equal, and `G` greater than the pivot. | Pivot 8 puts `A` in `L`, `B` and `E` in `E`, and `D`, `C`, `F` in `G`. |
| **Recursive work** | Sort only `L` and `G`, then join `L + E + G`. | `[16, 12]` becomes `[12, 16]` before the final result is assembled. |
| **Queue version** | Move items through three linked queues and restore the input queue. | Pivot `D:16` yields `L=[12, 6, 8, 8]`, `E=[16]`, `G=[20]`. |
| **Tree height** | Pivot balance controls the number of recursive levels. | A 12 cm² pivot gives groups of 3 and 2; an extreme pivot gives 5 and 0. |
| **Worst case** | Repeated extreme pivots yield O(n²) time. | Sorted distinct areas with last-item pivots shrink one card at a time. |
| **Randomized pivot** | Choose an item randomly to get expected O(n log n) time. | Area 8 has probability `2/6` in our six-card stack. |
| **In-place partition** | Swap inside one list and recurse on index ranges. | Pivot `E:8` ends at index 2, with unsorted ranges on each side. |
| **Equal values** | The two-scan version can scatter ties across its sides. | On `[B:8, A:6, E:8]`, `E` can finish before `B`. |
| **Practical choices** | Consider stack depth, pivot heuristics, and insertion sort for short ranges. | Median-of-three chooses 16 from the first, middle, and last areas. |

[🔝 Back to Top](#top)
