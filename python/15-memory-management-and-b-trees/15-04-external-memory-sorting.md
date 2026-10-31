<span id="top"></span>

# 15.4 External-Memory Sorting — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 15, Section 15.4, printed pages 715–716 ([supplied PDF](../Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C15.pdf)).<br>
> **Topic:** 15.4 External-Memory Sorting; Multiway Merge-Sort; 15.4.1 Multiway Merging; Proposition 15.3.<br>
> **Domain Focus:** Sorting square-plot records by side length, with area calculations and a connected trace of disk blocks and merge buffers.<br>
> **User Prompt:** Reexplain [`Section 15.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Square Plots Too Large for Memory](#background)
   - [1. The geometry problem](#background-geometry)
   - [2. The block and memory model](#background-storage)
2. [Part 1: 15.4 External-Memory Sorting and Multiway Merge-Sort](#part-1)
   - [1. Why sort with blocks in mind?](#part-1-problem)
   - [2. Divide, sort small runs, and merge](#part-1-process)
   - [3. Work through all 18 square plots](#part-1-runs)
   - [4. Count merge levels with a recurrence](#part-1-recurrence)
3. [Part 2: 15.4.1 Multiway Merging](#part-2)
   - [1. Choose the smallest current head](#part-2-heads)
   - [2. Reserve three input buffers and one output buffer](#part-2-buffers)
   - [3. Trace the first output blocks](#part-2-trace)
   - [4. Read the book's Figure 15.5](#part-2-figure)
4. [Part 3: Transfer Counts and Proposition 15.3](#part-3)
   - [1. Why one merge is a scan](#part-3-merge-cost)
   - [2. Count every pass in the plot example](#part-3-total)
   - [3. General I/O and computation bounds](#part-3-bound)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Square Plots Too Large for Memory

<span id="background-geometry"></span>

### 1. The geometry problem

Continue the square-plot catalogue from Section 15.3. Each record has a **positive side length** `s` in centimetres and the square's **area** `s²` in square centimetres. This time, 18 plot records arrive in a mixed order. We want the records ordered by side length so that a list of plots goes from smallest to largest.

| Side length | Area | Position in the sorted catalogue |
| :---------- | ---: | :------------------------------- |
| `1 cm` | `1 cm²` | First |
| `5 cm` | `25 cm²` | Fifth |
| `18 cm` | `324 cm²` | Last |

Because every side length is positive, **`s < t` implies `s² < t²`**. Sorting these records by side length also puts their areas in increasing order. Each side length and its area travel as **one record** during sorting; we never separate a plot from its geometry.

<span id="background-storage"></span>

### 2. The block and memory model

For this teaching case, use the following small capacities:

| Symbol | Meaning | Value in our example |
| :----- | :------ | -------------------: |
| `n` | Number of plot records | `18` |
| `B` | Plot records per disk block | `2` |
| `M` | Plot records that fit in main memory | `8` |
| `M/B` | Disk-block-sized buffers that fit in memory | `8/2 = 4` |
| `n/B` | Blocks holding the original compact sequence | `18/2 = 9` |

The 18 records are stored **compactly in nine aligned disk blocks**. A **block transfer** reads one block from disk into memory or writes one block back. Since `18 > 8`, all records cannot be in memory at once. We will count both reads and writes when a complete sorted run is materialized on disk. The small numbers are a model for studying I/O, not actual hardware capacities.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 15.4 External-Memory Sorting and Multiway Merge-Sort

<span id="part-1-problem"></span>

### 1. Why sort with blocks in mind?

Section 15.4 considers algorithms whose input is too large for internal memory. The important cost is how often an algorithm moves blocks between disk and memory. Sorting all the plots still means comparing side lengths, but an external-memory method also needs a plan for **which blocks to read, when to write sorted results, and how many times to scan the data**.

The book adapts merge-sort by merging **many** sorted sequences at once. Each merge level reads the data in order and writes a longer sorted run. Merging more runs per level reduces the number of levels.

<span id="part-1-process"></span>

### 2. Divide, sort small runs, and merge

Let `d` be the number of input runs combined by one merge. The algorithm divides a sequence into `d` roughly equal subsequences, sorts each recursively, and merges the `d` sorted results. Recursion stops when a subsequence fits in one block: load it into memory and sort it there.

We have room for **four block buffers**, so we choose **`d = M/B − 1 = 4 − 1 = 3`**. Three buffers can hold the current input blocks of a three-way merge; the fourth collects output. Our recursion has this shape:

```text
18 plot records
  → 3 groups of 6 records
  → 9 groups of 2 records (one disk block each)
  → sort each 2-record block in memory
  → 3 sorted runs of 6 records
  → 1 sorted run of 18 records
```

There are **nine base runs** and **two merge levels**: nine runs become three, then three become one. With a two-way merge, nine base runs would require more merge levels.

<span id="part-1-runs"></span>

### 3. Work through all 18 square plots

Here are the original disk blocks, grouped into three six-record subsequences. Each number labels a plot by its side length in centimetres; its area stays attached to that record. Brackets mark the **two-record blocks**.

```text
Group A: [17, 2] [ 8,11] [14, 5]
Group B: [18, 3] [ 9,12] [15, 6]
Group C: [16, 1] [ 7,10] [13, 4]
```

First, sort each block in memory. Next, merge each group of three sorted blocks into one six-record run:

```text
Group A: [ 2,17] [ 8,11] [ 5,14]  →  [ 2, 5, 8,11,14,17]
Group B: [ 3,18] [ 9,12] [ 6,15]  →  [ 3, 6, 9,12,15,18]
Group C: [ 1,16] [ 7,10] [ 4,13]  →  [ 1, 4, 7,10,13,16]
```

Finally, merge the three six-record runs. The sorted output occupies nine disk blocks:

```text
[1,2] [3,4] [5,6] [7,8] [9,10] [11,12] [13,14] [15,16] [17,18]
```

For example, plot `5` still has area **`5² = 25 cm²`** after moving from Group A into the fifth output position. The algorithm sorts complete plot records by their side-length keys.

<span id="part-1-recurrence"></span>

### 4. Count merge levels with a recurrence

The book writes the transfer cost for `n > B` as

```text
t(n) = d · t(n/d) + c(n/B),        for a constant c ≥ 1,
t(n) = 1,                          when n ≤ B.
```

The first term sorts `d` smaller groups. The second term covers a merge that scans `n/B` blocks a constant number of times. The base case says a one-block group needs **constant I/O** to bring it into memory and sort it.

Starting with about `n/B` base runs, each merge level reduces their count by a factor of about `d`. Therefore, the number of merge levels is about **`log_d(n/B)`**, and the book gives the large-input bound

```text
t(n) = O((n/B) · log_d(n/B))
     = O((n/B) · log(n/B) / log d).
```

For our plots, `n/B = 9` and `d = 3`, so **`log₃ 9 = 2`** merge levels, exactly as the run diagram shows. When `n ≤ B`, the separate base case applies; its cost is not zero just because `log_d(n/B)` is zero.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 15.4.1 Multiway Merging

<span id="part-2-heads"></span>

### 1. Choose the smallest current head

A sorted run's **head** is its smallest record that has not yet been output. To merge `d` runs, repeatedly compare their current heads, append the smallest whole record to the output, and advance only that run. If a run ends, remove it from consideration.

For the final geometry merge, the three run heads start at **`A: 2`, `B: 3`, `C: 1`**. Choose `1` from C. The next C head is `4`, so the heads become `2, 3, 4`; choose `2` from A. This produces the first sorted output block `[1,2]`.

<span id="part-2-buffers"></span>

### 2. Reserve three input buffers and one output buffer

Main memory can hold `M/B = 4` blocks. During the final three-way merge, it contains one current block from each input run **A, B, and C**, plus one output block **Q**:

```text
Input A [2,5]    Input B [3,6]    Input C [1,4]    Output Q [  ,  ]
      2 records        2 records        2 records           2 records
```

That is **`3B + B = 4 × 2 = 8` record-buffer slots**, exactly our simplified capacity; a real implementation also keeps a few counters or references. When an input buffer is exhausted, read its run's next disk block. When Q fills, write it as the next output block and reuse Q. The algorithm does **not** load all three six-record runs at once.

For capacities divisible by `B`, the book chooses **`d = M/B − 1`** to reserve that output buffer. If `M/B` is not an integer, the corresponding whole-block choice is `⌊M/B⌋ − 1`, provided at least two input buffers fit.

<span id="part-2-trace"></span>

### 3. Trace the first output blocks

| Next choice | Current heads before choice `(A, B, C)` | Output buffer and block action |
| ----------: | :-------------------------------------- | :----------------------------- |
| `1` from C | `(2, 3, 1)` | Q becomes `[1]`; C advances to `4`. |
| `2` from A | `(2, 3, 4)` | Q becomes `[1,2]`; write this full block. |
| `3` from B | `(5, 3, 4)` | Q becomes `[3]`; B advances to `6`. |
| `4` from C | `(5, 6, 4)` | Q becomes `[3,4]`; write it and refill C with `[7,10]`. |
| `5` from A | `(5, 6, 7)` | Q becomes `[5]`; refill A with `[8,11]`. |
| `6` from B | `(8, 6, 7)` | Q becomes `[5,6]`; write it and refill B with `[9,12]`. |

The next heads are `(8, 9, 7)`, so side length `7` comes next. Repeating the same rule writes all nine sorted output blocks. Notice that **refills occur only when a current input block is used up**; choosing a new record does not automatically cause a disk read.

<span id="part-2-figure"></span>

### 4. Read the book's Figure 15.5

Figure 15.5 shows a larger **five-way merge** with `B = 4`: five current input blocks and one output buffer `Q` are in memory. Its output block contains `7, 8, 10, 11`, while the current input heads are `12, 25, 30, 13, 17`. The next selected value is **`12`**, the smallest head. Our three-way square-plot merge follows the same rule with smaller buffers.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Transfer Counts and Proposition 15.3

<span id="part-3-merge-cost"></span>

### 1. Why one merge is a scan

During a merge, each input block is read **once** as its run advances, and each completed output block is written **once**. For `n` compact, block-aligned records, that is about `n/B` input reads plus `n/B` output writes: **`O(n/B)` block transfers** for one merge level.

The comparisons between buffered heads happen in memory. They affect **internal computation time**, not the block-transfer count. If a block is already cached, a physical read may be avoided; the worked count below assumes the input blocks must be read from disk and all output runs are written there.

<span id="part-3-total"></span>

### 2. Count every pass in the plot example

For an exact teaching count, assume each sorted base block and each merged run is written to disk, all runs start on block boundaries, and there is separate space for each pass's output.

| Phase | Input reads | Output writes | Transfers | Result |
| :---- | ----------: | ------------: | --------: | :----- |
| Sort the nine two-record blocks | `9` | `9` | `18` | Nine sorted base runs |
| Merge each group of three blocks | `9` | `9` | `18` | Three sorted six-record runs |
| Merge the three six-record runs | `9` | `9` | `18` | One sorted 18-record run |
| **Total** | **`27`** | **`27`** | **`54`** | Plots ordered from `1` to `18` cm |

The book's base case `t(n) = 1` for `n ≤ B` counts the **constant cost** of loading and sorting a block. This explicit trace also counts writing each sorted base block, so its base phase has two transfers per block. That changes a constant, not the asymptotic bound. The 54-transfer count belongs to the stated materialization and alignment assumptions; it is not a universal count for every implementation.

<span id="part-3-bound"></span>

### 3. General I/O and computation bounds

Choosing `d = M/B − 1` makes `d` proportional to `M/B` when the memory holds enough blocks. Substitute that choice into the recurrence to obtain **Proposition 15.3** for a compact array-based sequence:

```text
Block transfers:       O((n/B) · log(n/B) / log(M/B))
Internal computations: O(n log n)
```

The first bound counts disk I/O; the second counts work on records already in memory. For many input runs, testing all `d` heads from scratch would take `O(d)` comparisons per output record. The book uses a **priority queue** for the heads: extracting the smallest and replacing it with the next head takes `O(log d)` internal work, so a merge takes `O(n log d)` internal work. Across the merge levels, this leads to the stated `O(n log n)` computation bound, including the in-memory base sorts. A priority queue also needs `O(d)` small bookkeeping space; our exact four-buffer toy trace simply compares its three heads directly.

> **Mental model:** `B` controls how many plot records travel in one transfer. `M/B − 1` controls how many sorted runs can be read at once while leaving a block for output. Those two choices determine the number of full-data merge passes.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does sorting by side length also sort area?</strong></summary>

**Scenario:** Two square plots have side lengths `5 cm` and `8 cm`.

**Work:** Their areas are `5² = 25 cm²` and `8² = 64 cm²`. For positive side lengths, a larger side always has a larger square area.

**Answer:** Yes. Sorting these complete records by side length puts both **side lengths and areas** in increasing order.

</details>

<details>
<summary><strong>Case Study 2: How does Group A become a sorted run?</strong></summary>

**Scenario:** Group A starts in three disk blocks: `[17,2] [8,11] [14,5]`.

**Work:** Sort each block in memory to get `[2,17] [8,11] [5,14]`. Compare the three heads and merge them into `[2,5,8,11,14,17]`.

**Answer:** Three sorted two-record runs become **one six-record run**, written in three output blocks.

</details>

<details>
<summary><strong>Case Study 3: How can the merge process three runs at once?</strong></summary>

**Scenario:** A disk block holds two plots and main memory holds eight plots.

**Work:** `M/B = 8/2 = 4` block buffers fit. Three hold current input blocks; one holds output. The records in the three whole runs total 18, but only their current blocks need to be resident.

**Answer:** The merge fan-in is **`d = 4 − 1 = 3`**, with one output buffer reserved.

</details>

<details>
<summary><strong>Case Study 4: When does an input refill occur?</strong></summary>

**Scenario:** In the final merge, run C's first input block is `[1,4]` and its next block is `[7,10]`.

**Work:** Choosing side `1` leaves `4` in C's current block. Choosing `4` later exhausts that block; only then does the merge read `[7,10]`.

**Answer:** C is refilled **after `4` is consumed**, and `7` becomes its next head. The output `[3,4]` fills and is written as a separate block.

</details>

<details>
<summary><strong>Case Study 5: How many transfers sort all 18 plots?</strong></summary>

**Scenario:** The original nine blocks and every intermediate run are block-aligned. Each phase writes its result to disk.

**Work:** Base sorting reads and writes nine blocks: `18` transfers. The first merge level costs another `18`, and the final merge costs another `18`.

**Answer:** **`18 + 18 + 18 = 54` block transfers** in this explicit storage plan. The general result expresses growth as `O((n/B) log(n/B) / log(M/B))` rather than fixing this constant for every plan.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 15.4 idea | Plain-language meaning | Square-plot example |
| :---------------- | :--------------------- | :------------------ |
| **External sorting** | Sort a sequence that cannot all fit in main memory. | Eighteen plot records exceed eight memory slots. |
| **Block size `B`** | Records moved in one disk transfer. | Two plots per block; nine original blocks. |
| **Memory size `M`** | Records that fit in main memory. | Eight plots, or four block buffers. |
| **Multiway merge-sort** | Sort small pieces, then merge several sorted runs at once. | Nine base runs become three runs, then one. |
| **Merge fan-in `d`** | Input buffers that fit after reserving an output buffer. | `d = M/B − 1 = 3`. |
| **One merge level** | Read each input block and write each output block once. | Nine reads and nine writes: 18 transfers. |
| **Recurrence** | `t(n) = d·t(n/d) + c(n/B)` accounts for subproblems and one merge. | `log₃ 9 = 2` merge levels. |
| **Figure 15.5** | Keep the current blocks of each input run and one output block in memory. | Our three input blocks plus Q use four buffers. |
| **Proposition 15.3** | `O((n/B) log(n/B)/log(M/B))` transfers and `O(n log n)` internal work. | The worked three-pass plan uses 54 transfers under its exact assumptions. |

[🔝 Back to Top](#top)
