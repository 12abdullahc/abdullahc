<span id="top"></span>

# 15.3 External Searching and B-Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 15, Section 15.3, printed pages 711–714 ([supplied PDF](../Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C15.pdf)).<br>
> **Topic:** 15.3 External Searching and B-Trees; 15.3.1 (a,b) Trees; 15.3.2 B-Trees.<br>
> **Domain Focus:** A catalogue of square plots, indexed by side length; area, perimeter, and the disk blocks needed to find or change a plot.<br>
> **User Prompt:** Reexplain [`Section 15.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Square-Plot Catalogue](#background)
   - [1. The geometry problem](#background-geometry)
   - [2. From a catalogue entry to a disk transfer](#background-storage)
2. [Part 1: 15.3 External Searching and B-Trees](#part-1)
   - [1. Count block transfers](#part-1-io)
   - [2. Why familiar layouts can be expensive](#part-1-layouts)
   - [3. The target: fewer levels to visit](#part-1-target)
3. [Part 2: 15.3.1 (a,b) Trees](#part-2)
   - [1. Keys, children, and search intervals](#part-2-intervals)
   - [2. The (a,b) rules](#part-2-rules)
   - [3. Search for a square plot](#part-2-search)
   - [4. Why the height is small: Proposition 15.1](#part-2-height)
   - [5. Local maps and operation costs](#part-2-costs)
   - [6. Insert a plot: overflow and split](#part-2-insert)
   - [7. Remove a plot: transfer or fusion](#part-2-delete)
4. [Part 3: 15.3.2 B-Trees](#part-3)
   - [1. Order d and one node per block](#part-3-order)
   - [2. Disk-transfer and storage bounds: Proposition 15.2](#part-3-bounds)
   - [3. What the small example shows](#part-3-example)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Square-Plot Catalogue

<span id="background-geometry"></span>

### 1. The geometry problem

Imagine a catalogue of square display plots. A plot's **key** is its unique side length `s` in centimetres. Its **value** is its area, `s²` in square centimetres. We can also calculate its perimeter as `4s` centimetres. A request for side length `16` should find the entry and report **area `16² = 256 cm²`** and **perimeter `4 × 16 = 64 cm`**.

| Side-length key `s` | Area `s²` | Perimeter `4s` |
| :------------------ | --------: | -------------: |
| `4 cm` | `16 cm²` | `16 cm` |
| `10 cm` | `100 cm²` | `40 cm` |
| `16 cm` | `256 cm²` | `64 cm` |

The catalogue may eventually be too large for main memory. We therefore want a way to find, add, and remove a plot while moving only a few **blocks** between disk and memory. The examples below keep the geometry easy so the data movement is visible.

<span id="background-storage"></span>

### 2. From a catalogue entry to a disk transfer

A **disk block** is a group of stored bytes transferred as a unit. A **disk transfer** moves one block between secondary storage and main memory. We count these transfers as I/O cost; comparisons and multiplications done after a block is in memory are separate work. The book uses `B` for how many data entries can fit in a block when discussing a compact array.

For one **toy serialized layout**, suppose a block holds 128 bytes, a plot entry (side length and area) uses 16 bytes, and a child reference uses 8 bytes. A block-aligned compact array can hold **`B = 128/16 = 8` plot entries per block**. An order-6 tree node can fit **five entries and six references**, using `5 × 16 + 6 × 8 = 128` bytes. These sizes describe the teaching layout, not Python object sizes.

For the worked tree, assume **one tree node fits in one disk block** and the needed blocks are not already cached. Reading a node then costs one block transfer. A node may hold several side-length keys, so one transfer gives us several comparisons at once. This is an abstract layout: the `cm` and `cm²` units describe plots, while blocks and transfers describe storage.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 15.3 External Searching and B-Trees

<span id="part-1-io"></span>

### 1. Count block transfers

Section 15.3 assumes the catalogue is held in **external memory** because it cannot all reside in fast main memory. Its main question is: **How many disk transfers does a search or update require?** This is **I/O complexity**. Reading one block containing several plot entries counts as one transfer, while reading several separate blocks counts as several transfers.

If the answer is found after loading a root node and one child node, that search needs **two node-block reads** under our cold-cache assumption. It may compare several side lengths within those nodes, but those comparisons do not add disk transfers.

<span id="part-1-layouts"></span>

### 2. Why familiar layouts can be expensive

Suppose the catalogue has `n` side-length entries. The book compares these representations when their data is on disk:

| Representation | Search transfers under the stated guarantee | Why |
| :------------- | :-------------------------- | :-- |
| Unordered doubly linked list | Up to `n` | Consecutive nodes may live in different blocks. |
| Compact, unsorted array | `O(n/B)` | A sequential scan examines up to `B` adjacent entries per block. |
| Compact, sorted array | `O(log₂ n)` for straightforward binary search | Each probe may require a different block; inserting can require shifting many entries. |
| Balanced binary search tree (AVL or red-black) | Worst-case `O(log₂ n)` | A search crosses logarithmically many nodes that may occupy different blocks. |
| Skip list or splay tree | Expected `O(log₂ n)` for a randomized skip list; amortized `O(log₂ n)` for a splay tree | These also visit separate nodes in the basic disk layout; a single search can take linear time. |

For a **block-aligned compact array** of our 14 plots in the toy layout, `B = 8` entries per block, so a full sequential scan loads `⌈14/8⌉ = 2` blocks. The linked-list worst case could load 14 separate node blocks. A sorted array may search quickly, yet adding a new side length in order can move many later entries.

A standard Python `list` stores **references** contiguously; it does not promise that the objects those references point to are packed together. Thus the compact-array `O(n/B)` scan bound should not be assumed for an ordinary list of separately stored plot objects. The toy serialized array and the order-6 node both fit the same 128-byte block assumed above.

<span id="part-1-target"></span>

### 3. The target: fewer levels to visit

A binary tree chooses between two child directions per level. A disk block has room for more than one key, so a **multiway** tree can choose among many directions after a single block read. The goal is `O(log_B n)` disk transfers, where

```text
log_B n = (log₂ n) / (log₂ B).
```

When `B` is large, dividing by `log₂ B` means far fewer levels than a one-key-per-node binary tree. The following (a,b) tree rules keep those levels balanced during updates.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 15.3.1 (a,b) Trees

<span id="part-2-intervals"></span>

### 1. Keys, children, and search intervals

An **(a,b) tree** is a multiway search tree. A key-bearing node with `c` child positions holds `c − 1` sorted keys. Those keys divide possible search values into `c` intervals. Our first square-plot catalogue looks like this:

```text
                        [10 | 20]                 root
                     /      |       \
       [2 | 4 | 6 | 8]  [12 | 14 | 16 | 18]  [22 | 24 | 26 | 28]
```

Each number is a **side-length key** with its plot entry. The root's two keys make three routes:

| Requested side length `s` | Route from the root |
| :------------------------ | :------------------ |
| `s < 10` | Left child |
| `10 < s < 20` | Middle child |
| `s > 20` | Right child |

An exact match with `10` or `20` is found **in the root**. The bottom key-bearing nodes have conceptual **external child positions** for values that are absent. These are null search gaps, not extra disk blocks full of plot entries.

<span id="part-2-rules"></span>

### 2. The (a,b) rules

The book requires integer parameters satisfying **`2 ≤ a ≤ (b + 1)/2`**. Every **nonroot** key-bearing node has from `a` to `b` child positions, and all external positions occur at the same depth. The root has an exception to the minimum-child rule; when it is an internal root, it has at least two children.

Our diagram uses **`a = 3` and `b = 6`**. Therefore, each nonroot node may have **3–6 children**, or equivalently **2–5 keys**. Each drawn bottom node has four keys and five external child positions. The root has two keys and three children. All the external positions are one step below the drawn bottom nodes, so they are equally deep.

The parameter condition is also `2a − 1 ≤ b`. For `a = 3`, a fusion can make a node with `2a − 1 = 5` children, which is still within the maximum `b = 6`. We will use that fact when deleting a plot.

<span id="part-2-search"></span>

### 3. Search for a square plot

Search for side length `16`:

1. Read root `[10 | 20]`. Since `10 < 16 < 20`, follow its middle child.
2. Read `[12 | 14 | 16 | 18]` and find `16`.
3. Return its geometry: **area `256 cm²`** and **perimeter `64 cm`**.

The cold search reads **two node blocks**. Searching for `17` follows the same path and reaches an external gap between `16` and `18`, so the catalogue reports no such plot. An absent key does not require reading a physical “external-node block.”


<span id="part-2-height"></span>

### 4. Why the height is small: Proposition 15.1

The **height `h`** in the book is the depth of the external positions, with the root at depth 0. A nonempty search through our diagram visits key-bearing nodes at depths 0 and 1, then conceptually reaches an external position at depth **`h = 2`** if the key is absent.

For `n` stored entries, a multiway search tree has **`n + 1` external search gaps**. The minimum and maximum branching allowed by the (a,b) rules give

```text
2a^(h−1) ≤ n + 1 ≤ b^h.
```

Taking logarithms yields the book's height bound:

```text
log_b(n + 1) ≤ h ≤ 1 + log_a((n + 1)/2).
```

Our tree has `n = 14`: two entries in the root and four in each of three children. It therefore has `n + 1 = 15` external gaps. With `a = 3`, `b = 6`, and `h = 2`, the branch-count check is **`2 × 3^(2−1) = 6 ≤ 15 ≤ 6² = 36`**. The bound applies to every valid tree with these parameters, even when its exact shape differs.

This is why the search path grows like **`O(log_a n)`** levels. The minimum branching factor `a`, rather than the maximum `b`, controls the worst-case height.

<span id="part-2-costs"></span>

### 5. Local maps and operation costs

The book views each node as a small **secondary map** `M(v)`. Let `f(b)` be the cost of finding a key or child route within one node, and `g(b)` the cost of local restructuring such as a split or fusion. Table 15.1 summarizes search as `O(f(b) log_a n)` and updates as `O(g(b) log_a n)` under its local-cost abstraction. An implementation also has to locate the update position, so its search work must be included when accounting for total work.

For **disk transfers**, one node per block makes each local access or change use `O(1)` block transfers. A search follows one root-to-bottom path. A split or fusion can climb that path, but it cannot affect more than `O(log_a n)` levels. We count reads and writes of blocks as transfers; the exact number for a particular update depends on which blocks are already in memory and which are written back.

<span id="part-2-insert"></span>

### 6. Insert a plot: overflow and split

Starting with the 14-plot tree, insert side length `1` (area `1 cm²`) into the left child. That child becomes `[1 | 2 | 4 | 6 | 8]`: **five keys, six child positions**, so it is full but valid. Now insert side length `3` (area `9 cm²`). The same child temporarily has `[1 | 2 | 3 | 4 | 6 | 8]`: **six keys, seven child positions**, exceeding `b = 6`.

Split the overflowing node around its median key `3` and **promote** that key to the parent:

```text
Before split:  root [10 | 20]    left child [1 | 2 | 3 | 4 | 6 | 8]
After split:   root [3 | 10 | 20]
               children [1 | 2]  [4 | 6 | 8]  [12 | 14 | 16 | 18]  [22 | 24 | 26 | 28]
```

The two replacement nodes have **3 and 4 child positions**, both allowed for a (3,6) tree. The root has four child routes. If promoting a median makes the parent overflow, the same split can continue upward. A new root may be needed, increasing the height by one. Keys move **with their plot values**, so side length `3` still means area `9 cm²` after promotion.

<span id="part-2-delete"></span>

### 7. Remove a plot: transfer or fusion

Continue from the tree after the split. Delete side length `1` from `[1 | 2]`. Its remaining `[2]` has only **two child positions**, below `a = 3`. Its right sibling `[4 | 6 | 8]` has four positions and can lend one. A **transfer** moves the parent's separator `3` down to the short node and moves sibling key `4` up to the parent:

```text
Before: root [3 | 10 | 20]   neighbors [1 | 2] and [4 | 6 | 8]
After:  root [4 | 10 | 20]   neighbors [2 | 3] and [6 | 8]
```

Now delete side length `2`. The left node becomes `[3]` and underflows again. Its right sibling `[6 | 8]` is already at the **minimum** three child positions, so it cannot lend. A **fusion** combines the short node, the separating parent key `4`, and that sibling:

```text
[3] + parent key [4] + [6 | 8]  →  [3 | 4 | 6 | 8]

New root:     [10 | 20]
New children: [3 | 4 | 6 | 8]   [12 | 14 | 16 | 18]   [22 | 24 | 26 | 28]
```

The fused node has **five child positions** (`2a − 1`), so it is legal. Fusion removes one key and one child route from the parent. If the parent then underflows, repair may continue toward the root; if the root is left with a single child, that child becomes the new root. For deletion of a key held above the bottom level, an implementation first replaces it with a suitable neighboring key, then repairs the bottom-level removal in the same way.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 15.3.2 B-Trees

<span id="part-3-order"></span>

### 1. Order d and one node per block

In **this book**, a **B-tree of order `d`** is an `(⌈d/2⌉, d)` tree. Here “order” means the **maximum number of child positions** in a node; other texts sometimes use different conventions. Our `(3,6)` square-plot tree is therefore a **B-tree of order 6**.

Choose `d` so that a node's **up to `d` child references and `d − 1` keys with their values** fit in one disk block. The order is proportional to block capacity: **`d = Θ(B)`**. `B` and `d` are related design quantities, not necessarily the same number: key/value entries and child references may have different byte sizes. Each node block then offers many search routes per transfer.

The book's Figure 15.4 gives a separate **order-6** B-tree example. Our square-plot tree uses the same order but smaller, geometry-based keys so we can trace every operation.

<span id="part-3-bounds"></span>

### 2. Disk-transfer and storage bounds: Proposition 15.2

For an order-`d` B-tree, `a = ⌈d/2⌉ = Θ(B)`. Substituting this into the (a,b) height bound gives **`O(log_B n)`** levels. Search loads at most a constant number of node blocks per level. Insertion and deletion may split, transfer, or fuse nodes on the path, again using a constant number of node-block transfers per level. Proposition 15.2 states:

| Resource | B-tree bound | Meaning for the plot catalogue |
| :------- | :----------- | :----------------------------- |
| Search or update I/O | `O(log_B n)` disk transfers | Read or change only a short path of plot-index blocks. |
| Storage | `O(n/B)` disk blocks | Nonroot nodes have a minimum occupancy, so the catalogue does not use one block per plot. |

The root is exempt from the nonroot minimum, and real block usage includes key, value, and pointer sizes. The `O(n/B)` statement is an asymptotic block bound, not a promise that each physical block is exactly half full by bytes. CPU comparisons within a loaded node are also outside this disk-transfer bound.

<span id="part-3-example"></span>

### 3. What the small example shows

The original 14-plot tree uses **four node blocks**: one root and three bottom nodes. A cold search for `16` loads two of them. At this tiny size, a compact array can also use very few blocks; the tree's advantage is its **growth rate** while it continues to support insertion and deletion without shifting a long sorted array.

For scale, imagine **1,000,000 distinct square side lengths** in a B-tree of order `d = 100`, with each 100-way node fitting one block. Here `a = 50`. The height inequalities force `h = 4`: `n + 1 = 1,000,001` is greater than `100³ = 1,000,000`, so `h` cannot be 3 or less; it is less than `2 × 50⁴ = 12,500,000`, so `h` cannot be 5 or more. A cold unsuccessful search, or one finding a key in a bottom node, reads **four** key-bearing node blocks; a key found higher up needs fewer. The area formula stays `s²`; only the index layout changes.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How many blocks does a plot search read?</strong></summary>

**Scenario:** Use the original 14-plot tree. The cache is empty, and each node occupies one disk block. Find side length `16` and calculate its area and perimeter.

**Work:** Compare `16` with root keys `10` and `20`, then follow the middle child. Find `16` in `[12 | 14 | 16 | 18]`. Two blocks were read. Compute `16² = 256 cm²` and `4 × 16 = 64 cm` in memory.

**Answer:** **2 block reads**, **256 cm²** area, and **64 cm** perimeter. A later search may read fewer physical blocks if a needed node remains cached.

</details>

<details>
<summary><strong>Case Study 2: When is a node full, and when does it overflow?</strong></summary>

**Scenario:** In our order-6 tree, the left child starts `[2 | 4 | 6 | 8]`. Add side lengths `1` and then `3`.

**Work:** Adding `1` gives five keys and six child positions, exactly the allowed maximum. Adding `3` gives six keys and seven positions, one too many. Promote median `3`, leaving `[1 | 2]` and `[4 | 6 | 8]` below root `[3 | 10 | 20]`.

**Answer:** The first insertion fills the node; the second causes a **split**. The new square plot of side `3 cm` has area `9 cm²` even though its entry moves to the root.

</details>

<details>
<summary><strong>Case Study 3: Why does the first deletion borrow?</strong></summary>

**Scenario:** After Case Study 2, remove side length `1`.

**Work:** `[1 | 2]` becomes `[2]`, with only two child positions. Its right sibling `[4 | 6 | 8]` has four and can spare one. Move parent key `3` down and sibling key `4` up.

**Answer:** Root `[4 | 10 | 20]` has neighboring children `[2 | 3]` and `[6 | 8]`. Every nonroot node again has at least three child positions.

</details>

<details>
<summary><strong>Case Study 4: Why does the next deletion fuse?</strong></summary>

**Scenario:** Continue from Case Study 3 and remove side length `2`.

**Work:** `[2 | 3]` becomes `[3]`. The sibling `[6 | 8]` already has its minimum of three child positions. Combine `[3]`, parent key `4`, and `[6 | 8]` into `[3 | 4 | 6 | 8]`.

**Answer:** The resulting node has five child positions, within the 3–6 rule; root `[10 | 20]` again has three children. The catalogue now contains 14 plots: it gained sides `1` and `3`, then lost sides `1` and `2`.

</details>

<details>
<summary><strong>Case Study 5: Does an absent side length need another disk block?</strong></summary>

**Scenario:** Search the original tree for side length `17`.

**Work:** Root `[10 | 20]` directs `17` to `[12 | 14 | 16 | 18]`. The search ends in the conceptual gap between `16` and `18`. That external position stores no plot record and needs no separate node-block read.

**Answer:** The unsuccessful cold search reads **2 node blocks** and reports that no `17 cm` square plot is indexed.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 15.3 idea | Plain-language meaning | Square-plot example |
| :---------------- | :--------------------- | :------------------ |
| **Disk transfer and I/O complexity** | Count blocks moved between disk and memory. | Search for side `16` reads a root block and a child block. |
| **Compact array** | Nearby entries can share a block. | A block-aligned 14-entry scan with eight entries per block needs two reads. |
| **(a,b) tree** | Nodes hold several sorted keys; occupancy limits keep external positions equally deep. | Our `(3,6)` tree stores 14 side lengths at height 2. |
| **Proposition 15.1** | Branching bounds the height by logarithms in `a` and `b`. | Fifteen external gaps satisfy `2 × 3^(h−1) ≤ 15 ≤ 6^h` for `h = 2`. |
| **Split** | Promote a median when a node exceeds `b` children. | Adding sides `1` and `3` promotes `3`. |
| **Transfer** | Borrow through a parent from a sibling with spare capacity. | Deleting `1` moves `4` up and `3` down. |
| **Fusion** | Join a short node, separator, and minimum-size sibling. | Deleting `2` forms `[3 | 4 | 6 | 8]`. |
| **B-tree of order d** | An `(⌈d/2⌉, d)` tree sized so each node fits one block. | The order-6 square-plot tree has `a = 3`. |
| **Proposition 15.2** | Searches and updates take `O(log_B n)` transfers; storage takes `O(n/B)` blocks. | Many plot entries remain searchable through a short path of node blocks. |

[🔝 Back to Top](#top)
