<span id="top"></span>

# 12.5 Comparing Sorting Algorithms — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 12, Section 12.5, printed pages 567–568 ([supplied Chapter 12 PDF](<../Data Structures and Algorithms in Python - C12.pdf>)).<br>
> **Topic:** 12.5 Comparing Sorting Algorithms: Considering Running Time and Other Factors; Insertion-Sort; Heap-Sort; Quick-Sort; Merge-Sort; Bucket-Sort and Radix-Sort.<br>
> **Domain Focus:** The six rectangular cards introduced in [Section 12.1](12-01-why-study-sorting-algorithms.md); compare sorting choices for their areas, equal-area ties, dimensions, and key ranges.<br>
> **User Prompt:** Reexplain Section 12.5 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Stack, Different Needs](#background)
   - [1. Reuse the six measured cards](#background-cards)
   - [2. Decide what a useful sort must provide](#background-needs)
2. [Part 1: Considering Running Time and Other Factors](#part-1)
   - [1. Read the time claims carefully](#part-1-time)
   - [2. Compare more than running time](#part-1-factors)
3. [Part 2: Insertion-Sort](#part-2)
   - [1. Count out-of-order pairs](#part-2-inversions)
   - [2. See why nearly sorted cards are easier](#part-2-nearly)
4. [Part 3: Heap-Sort](#part-3)
   - [1. Get a worst-case bound with little extra array space](#part-3-bound)
   - [2. Notice what swaps can do to ties](#part-3-ties)
5. [Part 4: Quick-Sort](#part-4)
   - [1. Separate expected time from worst-case time](#part-4-time)
   - [2. Account for in-place partitioning and stability](#part-4-space)
6. [Part 5: Merge-Sort](#part-5)
   - [1. Trade a temporary array for a worst-case bound](#part-5-array)
   - [2. Follow long, sequential merge streams](#part-5-streams)
   - [3. Check the tie rule and the book's library examples](#part-5-context)
7. [Part 6: Bucket-Sort and Radix-Sort](#part-6)
   - [1. Use restricted integer keys when available](#part-6-keys)
   - [2. Compare the key-range cost with comparison sorting](#part-6-cost)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Stack, Different Needs

<span id="background-cards"></span>

### 1. Reuse the six measured cards

The [Section 12.1 guide](12-01-why-study-sorting-algorithms.md) introduced these physical cards in arrival order `D, C, A, B, E, F`. Keep each label attached to its measurements:

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `D` | 4 cm | 4 cm | 16 cm² |
| `C` | 3 cm | 4 cm | 12 cm² |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 2 cm | 4 cm | 8 cm² |
| `E` | 1 cm | 8 cm | 8 cm² |
| `F` | 4 cm | 5 cm | 20 cm² |

The starting area sequence is `[16, 12, 6, 8, 8, 20]`. Any correct area sort produces `[6, 8, 8, 12, 16, 20]`. If arrival order among equal-area cards matters, the labeled result should be `[A, B, E, C, D, F]`, because `B` arrived before `E`.

<span id="background-needs"></span>

### 2. Decide what a useful sort must provide

Suppose the class must prepare different displays from the same card measurements. The task changes which property matters most:

| Display need | Question to ask about a sorting method |
| :----------- | :-------------------------------------- |
| Finish quickly on an almost ordered stack | Does it benefit from few out-of-order pairs? |
| Require predictable worst-case growth | What is its **worst-case** running time? |
| Use little working storage | Does it need another array or many buckets? |
| Keep equal-area cards in arrival order | Is this **implementation** stable? |
| Sort bounded integer areas or dimension pairs | Can it use keys directly instead of only comparing pairs? |

Section 12.5 compares methods through these different needs. The fastest method on one kind of input may be a poor fit for another; asymptotic time is one part of the decision.

> **Mental model:** First specify the key and constraints. Then compare guarantees, extra storage, tie behavior, and the shape of the input before choosing an algorithm.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Considering Running Time and Other Factors

<span id="part-1-time"></span>

### 1. Read the time claims carefully

Let `n` be the number of cards. The book starts by grouping familiar algorithms by how their work grows, then qualifies the claims for each method:

| Method | Time statement relevant to this section | Important condition |
| :----- | :-------------------------------------- | :------------------ |
| **Insertion-sort** | O(n²) worst case; O(n + m) when well implemented. | `m` is the number of out-of-order pairs. |
| **Selection-sort** | O(n²) even on an already sorted input. | The standard method repeatedly scans the unsorted portion. |
| **Heap-sort** | O(n log n) worst case. | Comparison-based, with a strong guarantee. |
| **Quick-sort** | O(n log n) expected; O(n²) worst case. | The expected bound needs suitable pivot selection, such as random pivots. |
| **Merge-sort** | O(n log n) worst case. | Array versions normally use temporary storage. |
| **Bucket/radix-sort** | O(d(n + N)) for the stated restricted keys. | `d` is the number of key components; values lie in `0..N−1`. |

Here `O` describes how a bound grows as input sizes grow; it does **not** give an exact number of operations for our six cards. The [Section 12.4 guide](12-04-studying-sorting-through-an-algorithmic-lens.md) explains why comparison sorting needs Ω(n log n) comparisons on some distinct-key input, while direct-index sorting can use special key information.

For a straightforward selection-sort, the six-card stack requires `5 + 4 + 3 + 2 + 1 = 15` area comparisons to find successive minima, even if the cards start sorted. That explains the book's unfavorable comparison with the other methods; selection-sort does not gain much from an already ordered stack.

<span id="part-1-factors"></span>

### 2. Compare more than running time

The book asks about **memory** and **stability** as well as speed. An algorithm that swaps inside one array uses less auxiliary array storage than one that copies items into another array. A *stable* implementation keeps `B` before `E` when both are sorted by area alone; a method can get the numeric answer right while reversing those two labels.

When the stack has only six cards, setup cost and implementation details can dominate the abstract growth rates. The book's comparisons are guides to choosing a method under stated conditions, not measured timing results for these particular cards.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Insertion-Sort

<span id="part-2-inversions"></span>

### 1. Count out-of-order pairs

Insertion-sort builds a sorted prefix one card at a time. When the next area is smaller than areas just before it, those larger cards shift right to make room. The book describes a well-implemented insertion-sort as **O(n + m)**, where `m` counts *inversions*: pairs that appear in the wrong order.

For area sorting, positions `i < j` form an inversion when `area[i] > area[j]`. **Equal** areas are not inversions. In our original arrival order:

| Earlier card | Later cards with smaller area | Inversions contributed |
| :----------- | :---------------------------- | ---------------------: |
| `D:16` | `C:12`, `A:6`, `B:8`, `E:8` | 4 |
| `C:12` | `A:6`, `B:8`, `E:8` | 3 |
| `A`, `B`, `E`, `F` | None | 0 |
| **Total** | | **7** |

This small program checks the count and a nearly sorted rearrangement. It counts inversions; it is not an insertion-sort implementation.

```python
def inversion_count(areas):
    return sum(
        areas[i] > areas[j]
        for i in range(len(areas))
        for j in range(i + 1, len(areas))
    )


original = [16, 12, 6, 8, 8, 20]  # D, C, A, B, E, F
nearly_sorted = [6, 8, 8, 16, 12, 20]  # A, B, E, D, C, F
print(inversion_count(original))       # 7
print(inversion_count(nearly_sorted))  # 1
```

<span id="part-2-nearly"></span>

### 2. See why nearly sorted cards are easier

In `A, B, E, D, C, F`, the **only** wrong-order pair is `D:16` before `C:12`. Insertion-sort can move `C` left past `D` once, while the rest of the prefix is already in order. With `m = 1`, its O(n + m) bound is close to linear in `n`. If all five distinct-area cards arrived in reverse order, the number of inversions would be `5 × 4 / 2 = 10`, illustrating why insertion-sort can instead grow quadratically.

The book suggests insertion-sort for short sequences (roughly fewer than 50 items) and for nearly sorted inputs. That number is an illustrative implementation threshold, not a universal cutoff. Its simplicity can help on six cards, but the O(n²) worst case is a concern for a large, disordered stack.

An insertion-sort that shifts only **strictly larger** areas also keeps the equal-area `B` and `E` cards in arrival order. Stability still depends on that tie rule in the implementation.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Heap-Sort

<span id="part-3-bound"></span>

### 1. Get a worst-case bound with little extra array space

Heap-sort organizes the active cards as a **heap**, repeatedly puts an extreme area into its final place, and shrinks the active portion. The important comparison in this section is its **O(n log n) worst-case time**. It can be implemented *in place* in an array, using the input positions for the heap rather than allocating a second full array.

Imagine that the six card records occupy one fixed display board and there is room only for a few markers. An in-place heap-sort fits that storage constraint while still giving a worst-case comparison-based bound. The book presents it as a reasonable in-memory choice, while noting that quick-sort and merge-sort outperformed it in some larger-input experiments. That performance observation is not a guarantee for every dataset or implementation.

<span id="part-3-ties"></span>

### 2. Notice what swaps can do to ties

A standard heap-sort exchanges cards as it moves the root and repairs the heap. Those swaps do **not** promise to keep equal-area cards in arrival order. `B:8` and `E:8` may end in either relative order, even though the resulting numeric area list is sorted. If the teacher's display requires `B` before `E`, standard in-place heap-sort alone does not supply that stability guarantee.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Quick-Sort

<span id="part-4-time"></span>

### 1. Separate expected time from worst-case time

Quick-sort partitions cards around a pivot area and recursively handles the two sides. With randomized pivot selection, its **expected** running time is O(n log n), but an unlucky run can still take O(n²). The fixed *last-item* pivot from the [Section 12.3 guide](12-03-quick-sort.md) can be especially poor for already sorted, distinct areas: on `[6, 8, 12, 16, 20]`, each pivot is the largest remaining item, leaving side sizes `4 + 0`, then `3 + 0`, then `2 + 0`.

The book reports that quick-sort has been fast in many experiments, yet its quadratic worst case makes it a weaker choice when a strong worst-case growth bound is required. An *expected* bound averages over random pivot choices; it does not describe every individual run.

<span id="part-4-space"></span>

### 2. Account for in-place partitioning and stability

The book's practical array version partitions **in place**, so it need not copy all six cards into left and right arrays. Recursive calls still use stack space: the [Section 12.3 guide](12-03-quick-sort.md) explains how its depth depends on pivot balance. Calling it in-place describes the partition's array use, not zero total auxiliary memory.

Swapping during that partition does not naturally preserve ties. On the three-card input `[B:8, A:6, E:8]`, the book-style in-place partition can produce `[A:6, E:8, B:8]`, reversing `B` and `E`. The earlier guide's three-queue version handles equal cards differently, so **stability depends on the implementation**, not the name “quick-sort” alone.

The book's mentions of C `qsort`, Unix sorting, and older Java arrays describe quick-sort's historical use. They illustrate why a widely used default can change; they are not specifications for current library implementations.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Merge-Sort

<span id="part-5-array"></span>

### 1. Trade a temporary array for a worst-case bound

Merge-sort splits a sequence, recursively sorts both parts, and merges the sorted results. Its time is **O(n log n) even in the worst case**, regardless of whether our cards arrive ordered, reversed, or mixed. The array-based method in [Section 12.2](12-02-merge-sort.md) uses a temporary array to hold merged items, so a typical array implementation needs O(n) extra array space.

For six cards, a temporary array holding up to six card records may be easy to afford. For a very large display dataset, copying and allocating that storage are real costs. The book notes that making array merge-sort truly in-place is difficult; this is one reason an in-place quick-sort or heap-sort can be attractive when everything fits in main memory.

<span id="part-5-streams"></span>

### 2. Follow long, sequential merge streams

Merge-sort has a different strength when data spans caches, main memory, or external storage. It reads sorted **runs** in order and writes a combined run in order. For instance, the original left and right groups can be represented by sorted *area* runs `[6, 12, 16]` and `[8, 8, 20]`. Read forward through those runs to produce `[6, 8, 8, 12, 16, 20]`. This numeric trace leaves the two 8 cm² cards unnamed; the implementation's tie rule determines their labeled order.

The two input cursors mainly move forward. When data arrives in blocks from a slower storage level, this sequential access can make better use of each transferred block. The book emphasizes **fewer memory transfers** as the reason merge-sort variants are useful across memory levels. The six-card sketch explains the access pattern; it does not measure a real storage device.

<span id="part-5-context"></span>

### 3. Check the tie rule and the book's library examples

Merge-sort can be written to preserve equal-key order by choosing the **left** item when two merge-front areas tie. But the book's specific array code uses a strict `<` test and takes the **right** item on a tie. For `[B:8, A:6, E:8]`, the split can place `B` in the left run and `E` in the right run; choosing right on the 8-versus-8 tie gives `[A, E, B]`. Thus, do not assume that every merge-sort implementation is stable.

As book-era examples, the authors cite a multiway merge variant in GNU sorting and describe Python's Tim-sort as a hybrid that uses existing ordered runs and insertion-sort to build additional runs. They also cite Tim-sort's adoption for Java 7 arrays. These examples connect the earlier algorithms to practical libraries; the exact choices of a library depend on its version and data type.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Bucket-Sort and Radix-Sort

<span id="part-6-keys"></span>

### 1. Use restricted integer keys when available

The [Section 12.4 guide](12-04-studying-sorting-through-an-algorithmic-lens.md) introduced bucket-sort for **integer keys** in `0..N−1` and radix-sort for `d` such key components. Both exploit the key format instead of learning order entirely through pairwise comparisons.

For our cards, areas in cm² are integers from 0 through 20, so an area bucket-sort can use `N = 21` buckets and `d = 1` pass. If we instead sort the geometric pairs `(width, height)` lexicographically, stable radix passes use height first and width second; `d = 2` and the measurements fit `0..8`, so `N = 9`. The resulting dimension order `E, A, B, C, D, F` differs from area order because the **key** changed.

<span id="part-6-cost"></span>

### 2. Compare the key-range cost with comparison sorting

The book states the time as **O(d(n + N))**, with `d = 1` for bucket-sort. It becomes linear in `n` when `d` stays fixed and `N = O(n)`. The direct bucket-array approach also uses O(n + N) auxiliary storage; radix passes can reuse that workspace. The range size matters: if the same cards are measured in mm², their areas are 100 times larger numerically, and direct area buckets from `0` through `2000` need `N = 2001` slots. That creates far more bucket work for the same six physical cards.

The expression `d(n + N)` describes growth, **not** an exact timing prediction. On six cards, creating 21 or 9 buckets may cost more than a short comparison sort. Bucket/radix-sort becomes a compelling option when the key restrictions hold *and* the range and pass costs suit the data.

| If the display especially needs... | A method worth considering | Check before choosing |
| :---------------------------------- | :------------------------- | :-------------------- |
| Fast handling of a short or almost sorted stack | Insertion-sort | Inversion count stays small. |
| In-place array use with a worst-case bound | Heap-sort | Equal-card order may change. |
| Good expected in-memory performance | Randomized quick-sort | O(n²) runs remain possible; in-place version may change ties. |
| A worst-case bound and sequential processing of large runs | Merge-sort | Array copy space and tie rule. |
| Compact integer area keys | Stable bucket-sort | `N` is small enough; preserve order inside buckets. |
| Bounded multi-part geometry keys | Stable radix-sort | Passes run from last component to first. |

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How nearly sorted is the original card stack?</strong></summary>

**Scenario:** Areas arrive as `[16, 12, 6, 8, 8, 20]`.

**Reasoning:** `D:16` is ahead of four smaller cards, and `C:12` is ahead of three. The two 8 cm² cards are equal, so their pair is not an inversion. Thus `m = 4 + 3 = 7`.

**Result:** The O(n + m) insertion-sort bound reflects seven out-of-order pairs in this input; it is not an exact seven-operation count.

</details>

<details>
<summary><strong>Case Study 2: Which method benefits when only two cards are out of place?</strong></summary>

**Scenario:** The cards arrive `A, B, E, D, C, F`, with areas `[6, 8, 8, 16, 12, 20]`.

**Reasoning:** Only `D:16` before `C:12` is inverted, so `m = 1`. A well-implemented insertion-sort shifts `D` once when inserting `C`. A straightforward selection-sort still makes `5 + 4 + 3 + 2 + 1 = 15` comparisons to choose successive minima.

**Result:** For this nearly sorted six-card input, insertion-sort can exploit the existing order. The comparison count illustrates a standard selection-sort, not every possible implementation.

</details>

<details>
<summary><strong>Case Study 3: What if worst-case growth and extra space both matter?</strong></summary>

**Scenario:** A larger collection of card records must fit in one array, and the sorting method needs O(n log n) worst-case growth.

**Reasoning:** Heap-sort offers that bound and can work in place. In-place quick-sort usually has good expected time with appropriate pivots but admits O(n²) worst-case runs. Array merge-sort guarantees O(n log n) time but uses a temporary array.

**Result:** Heap-sort matches these stated time and storage constraints if preserving equal-area arrival order is not required. An actual wall-clock deadline would still need implementation and hardware timing analysis.

</details>

<details>
<summary><strong>Case Study 4: Can sorted areas hide a changed card order?</strong></summary>

**Scenario:** `B:8` arrives before `E:8`. We sort by **area only**, so their labels do not break the tie.

**Reasoning:** Stable bucket-sort appends both to area bucket 8 as `[B, E]`. The book-style in-place quick-sort or right-on-tie array merge can instead produce `E` before `B` on a suitable input.

**Result:** Check the implementation's tie behavior whenever equal-area card order matters. Both labeled orders have the same sorted numeric areas.

</details>

<details>
<summary><strong>Case Study 5: Are bucket and radix sorts automatically faster?</strong></summary>

**Scenario:** Six cards have area keys within `0..20` in cm², or within `0..2000` in mm²; the same cards also have `(width, height)` keys.

**Reasoning:** Area buckets require `N = 21` in cm² but `N = 2001` in mm². A dimension radix-sort uses two stable passes with `N = 9`. The formulas are O(n + N) and O(2(n + N)), respectively, under these key choices; neither formula gives an exact six-card runtime.

**Result:** Key range, pass count, and setup cost determine whether a non-comparison method is useful here.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 12.5 idea | Plain-language meaning | Rectangle-card example |
| :---------------- | :--------------------- | :--------------------- |
| **Choose by constraints** | Time, extra memory, stability, and key format all matter. | Decide whether `B` must stay before `E` and whether extra buckets fit. |
| **Insertion-sort** | O(n + m) when well implemented; strongest on short or nearly sorted input. | Original stack has `m = 7`; `A, B, E, D, C, F` has `m = 1`. |
| **Selection-sort** | Standard scans remain quadratic even on ordered input. | Six cards require 15 successive-minimum comparisons. |
| **Heap-sort** | Worst-case O(n log n), implementable in place, normally unstable. | Meets a time-and-space constraint but may reverse `B` and `E`. |
| **Quick-sort** | Expected O(n log n) with suitable pivots; O(n²) worst case. | Last-item pivots are extreme on sorted distinct areas. |
| **Merge-sort** | Worst-case O(n log n); arrays use temporary space; merging reads runs sequentially. | Merge the sorted left and right card groups by moving cursors forward. |
| **Stability is implementation-specific** | Tie choices and swaps determine equal-key order. | Right-on-tie merge may place `E` before `B`; stable area buckets retain `B, E`. |
| **Bucket/radix-sort** | O(d(n + N)) for bounded integer key components. | Area buckets use `N = 21`; two dimension passes use `d = 2, N = 9`. |

[🔝 Back to Top](#top)
