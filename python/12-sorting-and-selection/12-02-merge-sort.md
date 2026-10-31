<span id="top"></span>

# 12.2 Merge-Sort — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 12, Section 12.2, printed pages 538–549 ([supplied Chapter 12 PDF](<../Data Structures and Algorithms in Python - C12.pdf>)).<br>
> **Topic:** 12.2 Merge-Sort; 12.2.1 Divide-and-Conquer; 12.2.2 Array-Based Implementation of Merge-Sort; 12.2.3 The Running Time of Merge-Sort; 12.2.4 Merge-Sort and Recurrence Equations; 12.2.5 Alternative Implementations of Merge-Sort.<br>
> **Domain Focus:** The same six rectangular cards from the [Section 12.1 guide](12-01-why-study-sorting-algorithms.md); divide their area measurements, merge sorted halves, and count the work.<br>
> **User Prompt:** Reexplain Section 12.2 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Sorting the Rectangle Cards](#background)
   - [1. Reuse one measured stack](#background-cards)
   - [2. Why a sorted half is useful](#background-halves)
2. [Part 1: 12.2.1 Divide-and-Conquer](#part-1)
   - [1. Divide, conquer, and combine](#part-1-pattern)
   - [2. Follow the six-card recursion tree](#part-1-tree)
   - [3. Merge the answers on the way back](#part-1-return)
3. [Part 2: 12.2.2 Array-Based Implementation of Merge-Sort](#part-2)
   - [1. Compare the next unconsumed areas](#part-2-merge)
   - [2. Trace the final merge](#part-2-trace)
   - [3. Run a complete Python-list version](#part-2-code)
4. [Part 3: 12.2.3 The Running Time of Merge-Sort](#part-3)
   - [1. One merge takes linear time](#part-3-merge)
   - [2. Add the work across the recursion tree](#part-3-tree)
5. [Part 4: 12.2.4 Merge-Sort and Recurrence Equations](#part-4)
   - [1. Turn the recursive work into an equation](#part-4-equation)
   - [2. Expand the equation until the cards are singletons](#part-4-expand)
6. [Part 5: 12.2.5 Alternative Implementations of Merge-Sort](#part-5)
   - [1. Sort linked queues](#part-5-queues)
   - [2. Merge runs bottom-up without recursion](#part-5-bottom-up)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Sorting the Rectangle Cards

<span id="background-cards"></span>

### 1. Reuse one measured stack

The [Section 12.1 guide](12-01-why-study-sorting-algorithms.md) introduced six physical cards in the order `D, C, A, B, E, F`. A rectangle's **area = width × height**, so their measurements give this list:

| Card, in arrival order | Width | Height | Area |
| :--------------------- | ----: | -----: | ---: |
| `D` | 4 cm | 4 cm | 16 cm² |
| `C` | 3 cm | 4 cm | 12 cm² |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 2 cm | 4 cm | 8 cm² |
| `E` | 1 cm | 8 cm | 8 cm² |
| `F` | 4 cm | 5 cm | 20 cm² |

We will sort the **numeric areas** `[16, 12, 6, 8, 8, 20]` into `[6, 8, 8, 12, 16, 20]`. Both 8 cm² cards must remain. When a diagram names a card, its label travels with its area; the Python program below sorts area numbers only.

<span id="background-halves"></span>

### 2. Why a sorted half is useful

Imagine the stack split into its first and last three area measurements:

```text
Left:  [16, 12, 6]     Right: [8, 8, 20]
```

Each half is a smaller sorting problem. After sorting them separately, we have `[6, 12, 16]` and `[8, 8, 20]`. The **first unused value** in each sorted half is its smallest remaining value. Comparing just those two values tells us which one to place next in the combined answer. Repeating that choice is called **merging**.

Simply joining the two sorted halves would give `[6, 12, 16, 8, 8, 20]`, which is not sorted because 16 comes before 8. Merge-sort gets its name from the careful combine step that fixes this.

> **Mental model:** Break the area list into small lists, let each small list become sorted, then weave the sorted lists together by repeatedly taking the smaller front value.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 12.2.1 Divide-and-Conquer

<span id="part-1-pattern"></span>

### 1. Divide, conquer, and combine

**Divide-and-conquer** solves a large problem through smaller problems of the same kind. Merge-sort applies its three steps to a sequence `S`:

| Step | General idea | Our card areas |
| :--- | :----------- | :------------- |
| **Divide** | If `S` has zero or one item, it is already sorted. Otherwise split it into two nearly equal halves. | Split six areas into two groups of three. |
| **Conquer** | Recursively sort both halves. | Sort `[16, 12, 6]` and `[8, 8, 20]` separately. |
| **Combine** | Merge the two sorted halves into `S`. | Obtain `[6, 8, 8, 12, 16, 20]`. |

**Recursively** means that the sorting procedure calls itself on each smaller half. The zero-or-one-item rule is its **base case**: it stops the splitting. A one-card stack is already in order, and an empty stack has nothing to rearrange.

The high-level description in the book allows the first half to receive `⌈n/2⌉` items and the second `⌊n/2⌋` items. Its Python-list implementation later uses `n // 2` as the cut, giving the **first** half `⌊n/2⌋` items instead. Both choices keep the halves almost equal; with our even-sized six-card stack, both give `3 + 3`.

<span id="part-1-tree"></span>

### 2. Follow the six-card recursion tree

The **merge-sort tree** shows one recursive call at each node. A leaf has one area and needs no further sorting:

```text
                       [16, 12, 6, 8, 8, 20]
                       /                   \
               [16, 12, 6]              [8, 8, 20]
                /       \                 /      \
             [16]      [12, 6]          [8]     [8, 20]
                       /    \                   /    \
                    [12]    [6]               [8]   [20]
```

Read the tree **downward** for dividing. The two `[8]` leaves represent two different physical cards, `B` and `E`; the numeric tree does not label which leaf is which. The longest path from the root to a leaf has three edges, so this tree's height is `3 = ⌈log₂ 6⌉`. Proposition 12.1 gives `⌈log₂ n⌉` for a merge-sort tree of `n` items.

<span id="part-1-return"></span>

### 3. Merge the answers on the way back

Read upward to see each call return a sorted result:

```text
[12] + [6]             → [6, 12]
[16] + [6, 12]         → [6, 12, 16]
[8]  + [20]            → [8, 20]
[8]  + [8, 20]         → [8, 8, 20]
[6, 12, 16] + [8, 8, 20] → [6, 8, 8, 12, 16, 20]
```

The single-item lists are already sorted. Every later line merges **two sorted inputs**, so it can produce a sorted result. The final line solves the original six-card problem.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 12.2.2 Array-Based Implementation of Merge-Sort

<span id="part-2-merge"></span>

### 1. Compare the next unconsumed areas

For Python lists, the book uses two indices into the sorted halves. Call them `i` for the left half and `j` for the right. Initially both are zero. Each time we copy one area into the output, exactly one index increases. Therefore, after `i + j` areas have been copied, the next output position is `i + j`.

The merge follows one rule until the output is full:

1. If one half is exhausted, copy the next value from the other half.
2. Otherwise compare the two current values, copy the smaller one, and advance only its index.

For example, with left `[6, 12, 16]` and right `[8, 8, 20]`, compare `6` and `8`. Copy `6` first. The left index becomes `1`, while the right index stays `0`; the next comparison is `12` against `8`.

The book's array, queue, and bottom-up merge code all use **strict `<`** when both halves still have a value. On equal areas, that rule takes the value from the **right** half. The area numbers will be sorted either way, but the choice can change the order of cards with equal areas. We return to `B` and `E` in Case Study 4.

<span id="part-2-trace"></span>

### 2. Trace the final merge

Here is the combine step at the root. Each row consumes one area from a sorted half:

| Step | Current left | Current right | Copy next | Output so far |
| ---: | -----------: | ------------: | --------: | :------------ |
| 1 | 6 | 8 | 6 from left | `[6]` |
| 2 | 12 | 8 | 8 from right | `[6, 8]` |
| 3 | 12 | 8 | 8 from right | `[6, 8, 8]` |
| 4 | 12 | 20 | 12 from left | `[6, 8, 8, 12]` |
| 5 | 16 | 20 | 16 from left | `[6, 8, 8, 12, 16]` |
| 6 | exhausted | 20 | 20 from right | `[6, 8, 8, 12, 16, 20]` |

The final row needs no area comparison: only the right half has a value left. There are six output writes, one for each original card area. No measurement disappears, including the repeated 8.

<span id="part-2-code"></span>

### 3. Run a complete Python-list version

This teaching version uses the same split, recursion, and **right-on-equality** merge decision as the book's list implementation. It sorts one list of numeric areas and writes the result back into that list:

```python
def merge_areas(left, right, output):
    i = j = 0
    for slot in range(len(output)):
        if j == len(right):
            take_left = True
        elif i == len(left):
            take_left = False
        else:
            take_left = left[i] < right[j]

        if take_left:
            output[slot] = left[i]
            i += 1
        else:
            output[slot] = right[j]
            j += 1


def merge_sort_areas(areas):
    if len(areas) < 2:
        return

    middle = len(areas) // 2
    left = areas[:middle]
    right = areas[middle:]
    merge_sort_areas(left)
    merge_sort_areas(right)
    merge_areas(left, right, areas)


areas = [16, 12, 6, 8, 8, 20]
merge_sort_areas(areas)
print(areas)  # [6, 8, 8, 12, 16, 20]
```

`//` is integer division, so `len(areas) // 2` chooses the cut. The slices create **copies** of the halves. Each recursive call sorts its copy, and `merge_areas` copies values back into the caller's list. The argument list is changed, although the procedure also uses temporary lists. For everyday Python code, the built-in `areas.sort()` from [Section 12.1](12-01-why-study-sorting-algorithms.md) is the practical choice; this version is for understanding the algorithm.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 12.2.3 The Running Time of Merge-Sort

<span id="part-3-merge"></span>

### 1. One merge takes linear time

Let the two sorted halves contain `n₁` and `n₂` values. A merge makes exactly `n₁ + n₂` output writes, because each pass copies one value and never revisits it. With constant-time numeric comparisons and list indexing, the merge takes **O(n₁ + n₂)** time. Our final merge writes `3 + 3 = 6` card areas.

The list version also makes slices when it divides a subproblem. Copying a subproblem of size `m` into its two halves takes **O(m)** time in total. Merging those halves also takes **O(m)** time. Thus a call handling `m` values does **O(m)** work of its own, apart from the work done by its two recursive calls.

<span id="part-3-tree"></span>

### 2. Add the work across the recursion tree

At a given depth, the subproblems contain different parts of the original list. Their sizes add to at most `n`. Our six-card tree makes that concrete:

| Depth | Subproblem sizes still present at that depth | Total values |
| ----: | :------------------------------------------- | -----------: |
| 0 | `6` | 6 |
| 1 | `3 + 3` | 6 |
| 2 | `1 + 2 + 1 + 2` | 6 |
| 3 | `1 + 1 + 1 + 1` | 4 |

For an exact power of two, depth `d` has `2ᵈ` equal subproblems of size `n / 2ᵈ`, so their total is `2ᵈ × (n / 2ᵈ) = n`. That is **O(n) work per level**. Proposition 12.1 says the tree height is `⌈log₂ n⌉`, giving about `log₂ n` levels. Multiplying levels by work per level gives the book's Proposition 12.2: **O(n log n) time**, assuming each item comparison is O(1).

Our `n = 6` tree is uneven near the leaves, but it still has height `⌈log₂ 6⌉ = 3` and no level holds more than six values. The bound applies beyond powers of two as well. It measures sorting **after** the rectangle areas have been calculated; multiplying width by height once per card is a separate O(n) preparation step.

> **Mental model:** Each level handles no more than one full stack's worth of areas, and the stack can be halved only about `log₂ n` times.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 12.2.4 Merge-Sort and Recurrence Equations

The book marks this mathematical subsection with a star. It gives another way to obtain the same O(n log n) bound from the recursive calls.

<span id="part-4-equation"></span>

### 1. Turn the recursive work into an equation

Let `t(n)` be the worst-case running time for `n` already measured areas. To keep the algebra simple, first suppose `n` is a power of two. Each non-base call sorts two halves and spends time proportional to `n` on splitting and merging:

```text
t(n) = b,              for n ≤ 1
t(n) = 2t(n/2) + cn,   for n > 1
```

Here `b` represents constant work for a zero- or one-area list, and `c` is a constant factor for the nonrecursive work. This is a **recurrence equation** because `t` appears on both sides. Our six cards do not have a power-of-two count: sorting them makes two size-3 calls plus work proportional to six values. The two halves are still nearly equal.

<span id="part-4-expand"></span>

### 2. Expand the equation until the cards are singletons

Substitute the same rule into the smaller calls:

```text
t(n) = 2t(n/2) + cn
     = 4t(n/4) + 2cn
     = 2ⁱt(n/2ⁱ) + icn       after i expansions
```

Stop when each subproblem has one area: `n / 2ⁱ = 1`, so `i = log₂ n`. Substituting `t(1) = b` gives:

```text
t(n) = n b + c n log₂ n = O(n log n)
```

The `n b` term accounts for the one-area base cases. The `c n log₂ n` term is the repeated, linear-size work across the levels. This algebra says the same thing as the tree in Part 3; it just expresses the work as an equation.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 12.2.5 Alternative Implementations of Merge-Sort

<span id="part-5-queues"></span>

### 1. Sort linked queues

The first alternative stores the areas in a **linked queue** like the one from Section 7.1.2. Instead of taking Python-list slices and reading `left[i]`, it moves items from the front of one queue to another:

| Merge-sort step | Python-list version | Linked-queue version |
| :-------------- | :------------------ | :------------------- |
| Divide | Copy the first and second list slices. | Dequeue the first half into one queue and the rest into another. |
| See the next value | Read `left[i]` or `right[j]`. | Inspect each queue's front item. |
| Combine | Write the chosen value at an output index. | Dequeue the chosen front item and enqueue it into the output queue. |

For our final merge, the queue fronts begin at 6 cm² and 8 cm². Move 6 to the output, then compare the new left front 12 with the right front 8. The numerical result is the same `[6, 8, 8, 12, 16, 20]`. The book's queue version also chooses the right front on equal areas because it tests strict `<`.

With a linked queue, each basic front, dequeue, and enqueue operation takes O(1) time, so this version retains the **O(n log n)** bound. It is a change in **how the sequence is stored and moved**, while the divide/conquer/combine plan stays the same.

<span id="part-5-bottom-up"></span>

### 2. Merge runs bottom-up without recursion

The second alternative starts with each area as a sorted **run of length 1**. It merges neighboring runs to make runs of length 2, then 4, then 8, continuing until one run covers the whole list. No call needs to wait for recursive children.

| Width of runs being merged | Runs after the pass | Area list after the pass |
| -------------------------: | :------------------ | :----------------------- |
| 1 | `[12, 16]` · `[6, 8]` · `[8, 20]` | `[12, 16, 6, 8, 8, 20]` |
| 2 | `[6, 8, 12, 16]` · `[8, 20]` | `[6, 8, 12, 16, 8, 20]` |
| 4 | `[6, 8, 8, 12, 16, 20]` | `[6, 8, 8, 12, 16, 20]` |

After the width-2 pass, the first four areas are sorted **as a run**, but the entire list is not yet sorted: the remaining 8 still follows 16. The width-4 pass merges that shorter tail with the first run. The book's implementation uses a second array to hold each pass's result, swaps the source and destination roles for the next pass, and copies back if the final answer is in the second array.

The bottom-up method still takes **O(n log n)** time. It uses an extra array with `n` slots and avoids recursive-call overhead; the book notes that it can be a little faster in practice than the recursive array version.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: A single measured card stops the recursion</strong></summary>

**Scenario:** Only card `A` remains, with area `2 × 3 = 6 cm²`.

**Question:** What smaller problem should merge-sort create?

**Reasoning:** `[6]` already has its sole area in order. The `len(areas) < 2` base case returns immediately; no split or merge is needed. An empty area list also satisfies that base case.

**Result:** The sorted output remains `[6]`.

</details>

<details>
<summary><strong>Case Study 2: Two sorted halves cannot simply be joined</strong></summary>

**Scenario:** The first three cards have sorted areas `[6, 12, 16]`; the last three have sorted areas `[8, 8, 20]`.

**Problem:** Concatenating the halves produces `[6, 12, 16, 8, 8, 20]`, with 16 before 8.

**Fix:** Compare the first unused value of each half, taking 6, then 8, then 8, then 12, then 16, then the remaining 20.

**Result:** Merging produces `[6, 8, 8, 12, 16, 20]`.

</details>

<details>
<summary><strong>Case Study 3: Five cards split unevenly but still sort</strong></summary>

**Scenario:** Remove card `F`, leaving `[16, 12, 6, 8, 8]`.

**Question:** How does the Python-list version divide five measurements?

**Reasoning:** `middle = 5 // 2 = 2`, so the left slice is `[16, 12]` and the right slice is `[6, 8, 8]`. The book's high-level description could put three in the first half instead. Both choices reduce the problem to nearly equal halves.

**Result:** After recursive sorting and merging, the areas are `[6, 8, 8, 12, 16]`.

</details>

<details>
<summary><strong>Case Study 4: Equal-area cards can change relative order</strong></summary>

**Scenario:** Card `B` (2 × 4 cm) arrives before card `E` (1 × 8 cm). Both have area 8 cm².

**Problem:** In the recursive right half, `B` is the left input `[B:8]` and `E` begins the right input `[E:8, F:20]`. The book's strict `<` test asks whether `8 < 8`; it is false, so the merge takes `E` first.

**Result:** If card identities travel with their areas, the book's tie rule can produce `E` before `B`. The numeric output is still correct. A left-on-equality rule would preserve their arrival order in this merge; the printed code uses right-on-equality.

</details>

<details>
<summary><strong>Case Study 5: An intermediate bottom-up list can look unsorted</strong></summary>

**Scenario:** The width-2 pass has produced `[6, 8, 12, 16, 8, 20]`.

**Problem:** It looks as though merge-sort failed because 8 appears after 16.

**Reasoning:** At this stage `[6, 8, 12, 16]` and `[8, 20]` are two individually sorted runs. The algorithm has not yet merged those runs with each other.

**Result:** The next width-4 pass produces `[6, 8, 8, 12, 16, 20]`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 12.2 idea | Plain-language meaning | Rectangle-card example |
| :---------------- | :--------------------- | :--------------------- |
| **Divide and conquer** | Split, recursively solve each half, then combine. | Split six areas into two groups of three. |
| **Base case** | A zero- or one-item list needs no work. | `[6]` is already sorted. |
| **Merge-sort tree** | Each node is a sorting call; leaves are base cases. | Six areas give height `⌈log₂ 6⌉ = 3`. |
| **Merge** | Repeatedly take the smaller next area from two sorted halves. | `[6, 12, 16]` and `[8, 8, 20]` become `[6, 8, 8, 12, 16, 20]`. |
| **List implementation** | Slice two halves, sort them recursively, and write the merged values back. | `merge_sort_areas(areas)` changes the original area list. |
| **Time bound** | O(n) work per level across O(log n) levels. | The six-card tree has four levels counting the root. |
| **Recurrence** | Write the cost in terms of two smaller sorting calls. | `t(n) = 2t(n/2) + cn` for power-of-two counts. |
| **Linked queues** | Move front items with queue operations instead of list indices. | Dequeue 6 before the next 8. |
| **Bottom-up version** | Merge runs of length 1, 2, 4, and so on. | Three passes sort the six areas. |
| **Equal areas** | The book's strict `<` merge takes from the right on a tie. | `E` can move before `B`, while both 8 cm² values remain. |

[🔝 Back to Top](#top)
