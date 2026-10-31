<span id="top"></span>

# 15.5 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 15, Section 15.5, printed pages 717–719 ([supplied PDF](../Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C15.pdf)).<br>
> **Topic:** Reinforcement R-15.1–R-15.8; Creativity C-15.9–C-15.21; Projects P-15.22–P-15.24.<br>
> **Domain Focus:** One archive of square plots, their side lengths and areas, its disk pages, and groups of plots.<br>
> **User Prompt:** Reexplain [`Section 15.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Square-Plot Archive](#background)
   - [1. Nine plots, one set of measurements](#background-plots)
   - [2. Identify what each exercise asks you to prove or build](#background-tasks)
2. [Part 1: Reinforcement R-15.1–R-15.4](#part-1)
   - [1. Physical memory and tree updates](#part-1-memory-tree)
   - [2. Check the tree parameters carefully](#part-1-parameters)
3. [Part 2: Reinforcement R-15.5–R-15.8](#part-2)
   - [1. Trace three cache policies on the book's requests](#part-2-cache)
   - [2. Insert the book's keys into an order-7 B-tree](#part-2-btree)
4. [Part 3: Creativity C-15.9–C-15.12](#part-3)
   - [1. Deduplicate and buffer stacks and queues](#part-3-sequences)
   - [2. Keep positional-list handles valid](#part-3-positions)
5. [Part 4: Creativity C-15.13–C-15.16](#part-4)
   - [1. Connect tree representations and block occupancy](#part-4-trees)
   - [2. Pack skip lists and join plot groups](#part-4-structures)
6. [Part 5: Creativity C-15.17–C-15.21](#part-5)
   - [1. Match colored plots and find a majority](#part-5-scans)
   - [2. Reason about offline and LFU caching](#part-5-caching)
   - [3. Separate node computation from disk I/O](#part-5-search)
7. [Part 6: Projects P-15.22–P-15.24](#part-6)
   - [1. Build and test the requested data structures](#part-6-projects)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Square-Plot Archive

<span id="background-plots"></span>

### 1. Nine plots, one set of measurements

Use the square-plot setting from Sections 15.3 and 15.4 with a new nine-record dataset. Each **physical plot** has a distinct ID, a positive side length `s` in centimetres, an area `s²` in square centimetres, and a red or blue survey label. Several plots can have the same side length.

| Plot ID | Side `s` | Area `s²` | Color | Disk page |
| :------ | -------: | --------: | :---- | :-------- |
| `A` | `2 cm` | `4 cm²` | blue | `P1` |
| `B` | `4 cm` | `16 cm²` | red | `P1` |
| `C` | `2 cm` | `4 cm²` | red | `P2` |
| `D` | `6 cm` | `36 cm²` | blue | `P2` |
| `E` | `4 cm` | `16 cm²` | red | `P3` |
| `F` | `4 cm` | `16 cm²` | blue | `P3` |
| `G` | `8 cm` | `64 cm²` | blue | `P4` |
| `H` | `4 cm` | `16 cm²` | blue | `P4` |
| `I` | `4 cm` | `16 cm²` | blue | `P5` |

The **side-length sequence** is `[2, 4, 2, 6, 4, 4, 8, 4, 4]`. It has repeated integer values, even though the nine physical plot IDs are distinct. Sorting the side lengths gives `[2, 2, 4, 4, 4, 4, 4, 6, 8]`; keeping only distinct side lengths gives `[2, 4, 6, 8]`. Side `4 cm` occurs five times and has area `16 cm²`.

For the cache exercises, a toy disk page holds up to **two plot records**: `P1` holds `A,B`, `P2` holds `C,D`, and so on; `P5` holds `I`. The book's page-request numbers `1` through `5` can therefore be read as requests for pages `P1` through `P5`. A **page ID** is not a side length, an area, or a plot ID.

<span id="background-tasks"></span>

### 2. Identify what each exercise asks you to prove or build

Section 15.5 contains **24 exercises**: 8 reinforcement tasks, 13 creativity tasks, and 3 projects. The tables below paraphrase each numbered prompt and give a way to start. They are a study guide, not a substitute for the PDF's exact wording or a completed solution sheet for every open-ended design project.

| Kind of request | What a good response needs |
| :-------------- | :------------------------- |
| **Trace** | State the initial state and show each update in order. |
| **Prove a bound** | Define the counted resource, justify the invariant, and include boundary cases. |
| **Design a structure** | Specify its records, operations, rebalancing or buffering, and I/O cost. |
| **Implement or experiment** | Provide working behavior, test inputs, observed results, and the assumptions behind a comparison. |

Here `B` is records per disk block, `M` is internal-memory capacity, `m` is a cache's number of pages, `n` is a number of records or requests as stated by each prompt, and `k` is an operation count. **CPU comparisons and block transfers are different costs.** A four-page cache is used for R-15.5–R-15.7; it does not mean every exercise uses four memory blocks.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement R-15.1–R-15.4

<span id="part-1-memory-tree"></span>

### 1. Physical memory and tree updates

| Exercise | Reexplanation and square-plot starting point |
| :------- | :------------------------------------------ |
| **R-15.1** | Compare a 64-bit address space with the number of physical bits needed to realize every address. Imagine one address per cell in a huge grid, then ask which physical upper bound would actually prove the book's “never” claim. |
| **R-15.2** | Give the complete `(a,b)`-tree insertion and deletion procedures for plot keys. Include search, split and median promotion, internal-key replacement, sibling transfer or fusion, and root changes. |
| **R-15.3** | Test which `(a,b)` parameters accommodate nodes with **5–8 children**. Check the parameter inequality and equal external depth, not only the child counts. |
| **R-15.4** | Use the book's order-`d` B-tree definition, `(⌈d/2⌉, d)`, on the same 5–8-child tree. Determine which orders are guaranteed by those degree limits, conditional on equal external depth. |

For R-15.1, `2⁶⁴` addresses do **not** by themselves establish physical impossibility. If each address names one byte, filling the address space takes `2⁶⁷` bits and at least `2⁶⁷` distinct atoms under the exercise's one-atom-per-bit premise. That is a **lower bound on atoms needed**; the prompt gives no upper bound on atoms Julia could obtain. The “never in her life” conclusion needs additional engineering, resource, or time assumptions. Keep that logical gap visible in your answer.

For R-15.2, an insertion descends to an external gap. An overflowed `b`-child node has `b + 1` children, so split it around a median and promote that median; repeat upward if needed. A deletion of an internal key first exchanges it with a suitable neighboring key at the bottom level. If a nonroot node then has only `a − 1` children, borrow through the parent from a sibling with more than `a` children, or fuse with a minimum-size sibling. Contract a root left with one child. The [Section 15.3 guide](15-03-external-searching-and-b-trees.md) traces these operations with plot side lengths.

<span id="part-1-parameters"></span>

### 2. Check the tree parameters carefully

For R-15.3, the `(a,b)` rule requires **`2 ≤ a ≤ (b + 1)/2`**. If every nonroot node has 5–8 children, `(4,8)` is one safe choice and `(5,9)` is another: both permit every count from 5 through 8. `(5,8)` fails because `5 > (8 + 1)/2`. More generally, **`a ≤ 5`**, **`b ≥ 8`**, and **`2a − 1 ≤ b`** suffice for the stated degree range. The child-count statement alone says nothing about whether all external nodes have the same depth, so no `(a,b)` validity follows without that additional depth property.

For R-15.4, `b = d` and `a = ⌈d/2⌉`. The degree range 5–8 is guaranteed to fit for **`d = 8, 9, or 10`**: `d` must allow eight children, while `⌈d/2⌉` must be no more than five. This answer still assumes equal external depth. A particular tree whose actual minimum and maximum degrees are tighter than the stated range might fit other orders too.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement R-15.5–R-15.8

<span id="part-2-cache"></span>

### 1. Trace three cache policies on the book's requests

For R-15.5–R-15.7, the cache starts empty, holds **four pages**, and receives this exact request sequence:

```text
position:  1  2  3  4  5  6  7  8  9 10 11 12 13
page:      2  3  4  1  2  5  1  3  5  4  1  2  3
```

| Exercise | Reexplanation and checked result |
| :------- | :------------------------------- |
| **R-15.5** | Under **LRU**, evict the page whose *last request* is oldest. Misses occur at positions `1,2,3,4,6,8,10,12,13`: **9 misses**. |
| **R-15.6** | Under **FIFO**, evict the page that *entered the cache* earliest; hits do not renew its age. Misses occur at `1,2,3,4,6,12,13`: **7 misses**. |
| **R-15.7** | Maximize misses over legal **random eviction outcomes** and give the choices. Position 5 must hit because page `2` is still cached; all other 12 requests can miss, so the maximum is **12 misses**. |

For one R-15.7 witness, at the misses in positions **6 through 13**, evict pages **`1, 3, 5, 4, 1, 2, 3, 1`**, respectively. Each page is resident when selected, and the next requested page is absent. “Maximum” means a possible unfavorable sequence of random choices, **not** the expected number of misses. The geometry archive gives the pages a meaning: requesting page `5` loads the block holding plot `I`, but the cache policy depends only on page IDs and request order.

<span id="part-2-btree"></span>

### 2. Insert the book's keys into an order-7 B-tree

**R-15.8** asks for the resulting tree after inserting the book's 18 keys in their given order. Read each integer as the side length of a new square plot; its area can be computed as `s²` but is not used to choose a tree branch.

```text
4, 40, 23, 50, 11, 34, 62, 78, 66, 22, 90, 59, 25, 72, 64, 77, 39, 12
```

Order `7` means `a = ⌈7/2⌉ = 4`, `b = 7`: a nonroot node holds **3–6 keys**. A temporary seventh key overflows and causes a split. For example, the seventh insertion (`62`) promotes `34` from `[4,11,23,34,40,50,62]`. A later split promotes `62`. The final tree is:

```text
                         [34 | 62]
                       /     |      \
 [4 | 11 | 12 | 22 | 23 | 25]  [39 | 40 | 50 | 59]  [64 | 66 | 72 | 77 | 78 | 90]
```

Count **2 + 6 + 4 + 6 = 18** keys, and check that every bottom node has 3–6 keys. The exercise asks for the **resulting tree**; sketching intermediate trees at the two split checkpoints is a useful way to verify that result.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Creativity C-15.9–C-15.12

<span id="part-3-sequences"></span>

### 1. Deduplicate and buffer stacks and queues

| Exercise | Reexplanation and square-plot starting point |
| :------- | :------------------------------------------ |
| **C-15.9** | Remove duplicate **entries** from an external array. If entries are the archive's integer side lengths, externally sort them, then scan equal neighbors and write one copy: `[2,4,2,6,4,4,8,4,4] → [2,4,6,8]`. State what equality means if entries are whole plot records. |
| **C-15.10** | Build an external-memory stack so `k` pushes/pops from empty use `O(k/B)` total transfers. Keep a buffered suffix of the most recent plot records; flush and refill whole blocks with enough slack to prevent thrashing. |
| **C-15.11** | Build an external-memory queue with the same `O(k/B)` total I/O. Keep separate front and rear buffers around disk-resident middle blocks; dequeues use the front, enqueues use the rear. |

For C-15.9, sorting costs `Sort(n) = O((n/B) log(n/B)/log(M/B))` transfers under Section 15.4's model. One additional compact scan and buffered output cost `O(n/B)` transfers, so deduplication is **`O(Sort(n) + n/B)`** I/O. If plot IDs are part of equality, `A` and `C` are different records despite having the same side; specify the intended key before removing anything.

For C-15.10, a **single top block with immediate spill/refill can oscillate** if a push and a pop alternate at a block boundary. One robust design keeps up to `2B` top entries in RAM: when it reaches `2B`, write its oldest `B` entries as one disk block, leaving `B`; reload a disk block only when the RAM suffix becomes empty. Between successive disk transfers there are enough pushes or pops to pay for the transfer, giving the amortized `O(k/B)` total from an empty stack. The queue uses analogous block-sized front/rear batching and an in-memory handoff when its disk middle is empty.

<span id="part-3-positions"></span>

### 2. Keep positional-list handles valid

**C-15.12** asks for a PositionalList that iterates over `n` entries in **`O(n/B)` worst-case transfers**, while every other ADT method uses **`O(1)` transfers**. A useful starting design is an **unrolled doubly linked list**: each disk block holds `Θ(B)` neighboring plot positions, and blocks link to adjacent blocks. Local insertion/deletion may split, borrow from, or fuse a constant number of neighboring blocks; sequential iteration reads each block once.

The hard part is the **position handle**. A raw `(block, slot)` handle becomes stale when a split moves that plot to another block. A complete design must say how handles remain stable or are updated without causing extra random disk transfers. This is a proof obligation, not a detail that an `O(n/B)` scan alone settles.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Creativity C-15.13–C-15.16

<span id="part-4-trees"></span>

### 1. Connect tree representations and block occupancy

| Exercise | Reexplanation and square-plot starting point |
| :------- | :------------------------------------------ |
| **C-15.13** | Modify red-black coloring rules so black-rooted, red-connected groups correspond to **(4,8)-tree nodes**. Such a nonroot group needs 3–7 plot keys, hence 4–8 child exits, and every path must cross the same number of groups. |
| **C-15.14** | When a B-tree insertion overflows, redistribute keys among the affected node's siblings and analyze the **minimum fill fraction**. Count the parent separators and integer rounding, and handle a first root split separately. |

For C-15.13, the ordinary red-black rule that forbids a red child of a red node encodes smaller `(2,4)` groups. A route to `(4,8)` is to allow bounded **red-connected microtrees**: each has one black root and enough red descendants to store 3–7 ordered keys, with 4–8 child links to the next black roots. Collapse each microtree into one multiway node, or expand a `(4,8)` node into such a microtree. Define a root exception and equal black-group depth, then show the correspondence in both directions.

For C-15.14, the familiar **roughly two-thirds-full** intuition comes from sharing two full sibling pages across three pages after an overflow. It is not an unconditional exact fraction: the number of keys is discrete, separators move through the parent, and the **first split of a root** can leave a new child near half full. An order-6 root with five key slots can overflow to six keys and split into children with two and three keys, so one has only **`2/5` of its key slots** occupied. State the modified invariant and its root exception before claiming a minimum for *every* block.

<span id="part-4-structures"></span>

### 2. Pack skip lists and join plot groups

| Exercise | Reexplanation and square-plot starting point |
| :------- | :------------------------------------------ |
| **C-15.15** | Pack consecutive skip-list nodes at each level into blocks of `⌈d/2⌉` to `d` nodes, and modify insertion/removal to split, borrow, or fuse blocks. Choose promotion probability around `1/d = Θ(1/B)` so the **expected** tower height is `O(log n/log B)`. |
| **C-15.16** | Support `union` and `find` for arbitrary plot groups using a B-tree-shaped tree per group. Keep a stable handle from a plot to its leaf; `find` climbs to the root, while `union` joins two height-balanced group trees and repairs one spine. Justify `O(log n/log B)` transfers for each. |

For C-15.15, grouping nodes into disk blocks addresses the **horizontal** I/O cost, while changing the promotion probability addresses the **number of levels**. Both are needed for an external skip list. For C-15.16, a plain B-tree map from each plot to a parent ID is insufficient: following many parent IDs would require a separate B-tree search per hop. The group-tree design needs parent links, stable member positions, and a height-aware join; it is a design task, not just a choice of key order.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Creativity C-15.17–C-15.21

<span id="part-5-scans"></span>

### 1. Match colored plots and find a majority

| Exercise | Reexplanation and square-plot starting point |
| :------- | :------------------------------------------ |
| **C-15.17** | Find **all red–blue pairs with equal integer keys**. Sort colored plot records by side length, process each equal-side group, and emit every red × blue combination. Include the cost of writing the pairs. |
| **C-15.19** | Decide whether some integer occurs **more than `n/2` times** in an external array. Use one sequential pass to cancel unequal candidates, then another pass to verify the remaining candidate's count. |

At side length `4 cm`, plots `B,E` are red and `F,H,I` are blue. They form **`2 × 3 = 6` distinct pairs**, each linking plots of area `16 cm²`. If side `s` has `r_s` red and `b_s` blue records, the total output size is **`K = Σ_s r_s b_s`**. A blocked algorithm can use `O(Sort(n) + n/B + K/B)` transfers, where `K/B` accounts for the possibly very large output. The output term cannot be omitted when the request is to produce every pair.

In the nine-value side sequence, `4` occurs **5 times**, and `5 > 9/2`, so it is a strict majority. The candidate-cancellation pass may leave a value even when no majority exists; the second scan checks the count. Both passes are sequential, for **`O(n/B)` transfers** and constant-size candidate state.

<span id="part-5-caching"></span>

### 2. Reason about offline and LFU caching

| Exercise | Reexplanation and square-plot starting point |
| :------- | :------------------------------------------ |
| **C-15.18** | With an `m`-page cache and only `m + 1` possible pages, use **farthest-next-use** eviction with the full future request sequence known. Prove at most `m + n/m` misses from an empty cache. |
| **C-15.20** | Construct a request sequence where **LFU** misses on a linear fraction of requests but an optimal offline cache misses only `O(m)` times. Use old high-frequency plot pages and two alternating new pages. |

For C-15.18, after the cache is full, a miss brings in the only absent page. Evict the **old resident page whose next use is farthest away**. If that page is requested again, every other old resident page must be requested first; those `m − 1` requests are hits. Thus consecutive later misses are at least `m` request positions apart. If the evicted page is never requested again, there is no later miss among the `m + 1` possible pages. Allow up to `m` initial fills, then at most `n/m` further misses. This is an **offline** argument because the eviction decision uses future requests.

For C-15.20 with `m = 4`, request `P1, P2, P3` twice each, then alternate `P4, P5` for a long time. Under LFU counts **since a page entered the cache**, the old pages have frequency 2, while the newest of `P4` or `P5` has frequency 1 and is evicted on the next alternating request. LFU then misses repeatedly. An offline cache keeps both `P4` and `P5` after the warm-up and never needs a dropped old page again, so it has only a constant number of misses (`O(m)`). State the frequency-reset convention when presenting the example.

<span id="part-5-search"></span>

### 3. Separate node computation from disk I/O

**C-15.21** changes the cost of searching **inside one order-`d` B-tree node** from `f(d) = 1` to `f(d) = log d`. The tree still has `O(log_d n)` levels, so the stated node-search work becomes

```text
O(log d) per level × O(log_d n) levels = O(log n).
```

If a whole node still fits in one disk block, its **I/O** remains `O(log_B n)` block transfers; `O(log n)` is the internal search-work bound under the changed `f(d)`. Searching for a plot's side length can involve several comparisons within one loaded node without another disk read.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Projects P-15.22–P-15.24

<span id="part-6-projects"></span>

### 1. Build and test the requested data structures

| Exercise | Reexplanation and geometry-based test idea |
| :------- | :----------------------------------------- |
| **P-15.22** | Implement a simulator for **first-fit, next-fit, best-fit, and worst-fit** memory allocation, then compare them on the same allocate/free traces. A plot raster of side `s` might request `s²` memory units; sides `2, 3, 4` request `4, 9, 16` units. Record failed requests, free-hole sizes, and scan work; no policy is universally best from one trace. |
| **P-15.23** | Implement the complete **ordered map ADT** with an `(a,b)` tree, taking valid integer `a,b` in the constructor. Plot side length can be a key and area its value. Test search, insertion, deletion, predecessor/successor, minimum/maximum, and ordered iteration across split/fusion cases. |
| **P-15.24** | Implement a **B-tree** for integer keys with the exercise's **1024-sized block** and measure simulated transfers on map operations. Use plot side lengths as keys; state whether 1024 counts bytes or slots, how many keys and child references fit, and what a read or write costs in the simulator. |

For P-15.22, a fair experiment replays **identical** request and release sequences for all four policies, beginning from the same free-memory layout. For P-15.23, reject parameters outside `2 ≤ a ≤ (b + 1)/2` and test root growth and contraction. For P-15.24, the numerical fan-out and transfer count depend on a specified block layout and cache assumption; “1024” alone does not determine them. These projects ask for implementations and evidence, so a hand trace is a starting test rather than a replacement for running the programs.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Three questions about the same nine plots</strong></summary>

**Scenario:** Use side lengths `[2,4,2,6,4,4,8,4,4]` and the colors in the archive table.

**Work:** Sort and deduplicate the integer sides to get `[2,4,6,8]` (C-15.9). Count side `4`: it occurs `5` of `9` times, so it is a strict majority (C-15.19). Among those side-4 plots, two are red and three blue, giving `2 × 3 = 6` pairs (C-15.17).

**Answer:** The three tasks produce **four distinct side lengths**, **one majority side length `4 cm`**, and **six colored plot pairs**. Each asks for a different result even though the geometry data is shared.

</details>

<details>
<summary><strong>Case Study 2: Which tree parameters fit 5–8 children?</strong></summary>

**Scenario:** A multiway tree of plot side lengths has between five and eight children at each nonroot node.

**Work:** `(4,8)` satisfies `4 ≤ (8+1)/2` and permits 5–8 children. `(5,8)` violates that inequality. For a B-tree of order `d`, require `d ≥ 8` and `⌈d/2⌉ ≤ 5`, which gives `d = 8,9,10`.

**Answer:** `(4,8)` is a valid **parameter choice** and orders **8–10** fit the degree range, **provided all external gaps have equal depth**. The stated child counts alone cannot prove the depth property.

</details>

<details>
<summary><strong>Case Study 3: Why do three cache answers differ?</strong></summary>

**Scenario:** A four-page cache loads pages of plot records in the book's 13-request order.

**Work:** LRU renews a page's age on a hit, FIFO does not, and the random policy may make an unfavorable legal eviction each time. The checked miss totals are `9`, `7`, and a possible maximum of `12`.

**Answer:** **LRU 9, FIFO 7, random worst outcome 12.** The random maximum is possible because every request except the fifth can be made a miss; it is not the average result of random replacement.

</details>

<details>
<summary><strong>Case Study 4: Why keep more than one stack block in RAM?</strong></summary>

**Scenario:** A stack of plot records is near a disk-block boundary; an operator alternates one push and one pop.

**Work:** If every crossing immediately writes or reads a single top block, each operation could cause I/O. Keeping a top buffer with `B` entries of slack after a flush and refilling only when it empties lets the alternating operations stay in RAM.

**Answer:** A buffered stack can charge each block transfer to about **`B` intervening updates**, supporting the required `O(k/B)` amortized total from empty.

</details>

<details>
<summary><strong>Case Study 5: Why can LFU repeatedly reload plot pages?</strong></summary>

**Scenario:** Four cache slots hold frequently used `P1,P2,P3`; requests then alternate `P4,P5`.

**Work:** Request `P1,P2,P3` twice each first. Resident LFU counts for them are 2. `P4` and `P5` each enter with count 1, so the newest of the alternating pair is the least frequent resident when the other arrives and gets evicted. An offline cache keeps both after their first loads.

**Answer:** With resident counts reset on reload, **LFU misses on each later alternation**, while an offline policy needs only `O(m)` initial misses. The page labels refer to the same plot archive used in the other cases.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Exercise group | Main idea | Square-plot connection |
| :------------- | :-------- | :--------------------- |
| **R-15.1–R-15.4** | Test the physical premise, then apply `(a,b)` and B-tree invariants. | Plot side lengths serve as ordered keys; 5–8 children need a legal parameter pair and equal depth. |
| **R-15.5–R-15.7** | Trace exact cache policies and distinguish a worst random outcome from an average. | Pages `P1`–`P5` hold plot records; the same request string yields 9, 7, or up to 12 misses. |
| **R-15.8** | Draw the resulting order-7 B-tree after the stated insertions. | The book's integers can be square side-length keys; the final root contains `34` and `62`. |
| **C-15.9–C-15.12** | Sort/deduplicate and batch stack, queue, and positional-list I/O. | Repeated side lengths and neighboring plot records occupy compact blocks. |
| **C-15.13–C-15.16** | Generalize balanced structures while proving occupancy and transfer costs. | Plot keys form microtrees, B-tree pages, skip-list blocks, and joined plot groups. |
| **C-15.17–C-15.21** | Account for output pairs, majority scans, cache behavior, and within-node work. | Two red and three blue side-4 plots make six pairs; five of nine sides are `4`. |
| **P-15.22–P-15.24** | Implement and measure allocator, ordered-map, and B-tree designs. | Plot areas can supply allocation sizes; side lengths supply map keys and test data. |

[🔝 Back to Top](#top)
