<span id="top"></span>

# 11.4 Splay Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 11, Section 11.4, printed pages 490–501 ([supplied Chapter 11 PDF](<../Data Structures and Algorithms in Python - C11.pdf>)).<br>
> **Topic:** 11.4 Splay Trees; 11.4.1 Splaying; 11.4.2 When to Splay; 11.4.3 Python Implementation; 11.4.4 Amortized Analysis of Splaying.<br>
> **Domain Focus:** The square-tile catalog from [Section 11.1](11-01-binary-search-trees.md): side lengths as keys, `(area, stock)` as values, and repeated geometry lookups that change the tree's shape.<br>
> **User Prompt:** Reexplain Section 11.4 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Tile Size the Class Uses Often](#background)
   - [1. Reopen the square-tile catalog](#background-catalog)
   - [2. Let the tree respond to a lookup](#background-access)
2. [Part 1: 11.4 Splay Trees](#part-1)
   - [1. Self-adjustment instead of a fixed height rule](#part-1-purpose)
   - [2. What it means to splay a position](#part-1-splay)
3. [Part 2: 11.4.1 Splaying](#part-2)
   - [1. Zig-zig: two turns in the same direction](#part-2-zigzig)
   - [2. Zig-zag: the path changes direction](#part-2-zigzag)
   - [3. Zig: one final parent-child rotation](#part-2-zig)
   - [4. Trace a 14 cm lookup in the full catalog](#part-2-trace)
4. [Part 3: 11.4.2 When to Splay](#part-3)
   - [1. Search hits, misses, insertion, and deletion](#part-3-events)
   - [2. An unsuccessful 15 cm lookup](#part-3-miss)
   - [3. Insert 16 cm or delete 8 cm](#part-3-updates)
5. [Part 4: 11.4.3 Python Implementation](#part-4)
   - [1. Repeat rotations until the position is root](#part-4-loop)
   - [2. Connect the three rebalancing hooks](#part-4-hooks)
   - [3. Use `SplayTreeMap` through the map interface](#part-4-client)
6. [Part 5: 11.4.4 Amortized Analysis of Splaying](#part-5)
   - [1. Separate one expensive access from a whole sequence](#part-5-actual)
   - [2. Give each subtree a size and rank](#part-5-potential)
   - [3. Pay for rotations with rank changes](#part-5-steps)
   - [4. Add up operations from an empty tree](#part-5-sequence)
   - [5. Give frequently requested sizes a smaller average charge](#part-5-frequency)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Tile Size the Class Uses Often

<span id="background-catalog"></span>

### 1. Reopen the square-tile catalog

Begin again with the seven-size catalog from [Section 11.1](11-01-binary-search-trees.md), before its later updates. A tile's **side length in centimetres** is the key. The value is `(area of one tile in cm², number in stock)`. There is one tile of each size at the start:

| Side key | 2 cm | 4 cm | 6 cm | 8 cm | 10 cm | 12 cm | 14 cm |
| :------- | ---: | ---: | ---: | ---: | ----: | ----: | ----: |
| One-tile area | 4 cm² | 16 cm² | 36 cm² | 64 cm² | 100 cm² | 144 cm² | 196 cm² |

Their total area is `4 + 16 + 36 + 64 + 100 + 144 + 196 = 560 cm²`. As before, each area follows **side × side**; for example, a 14 cm square has area `14 × 14 = 196 cm²`.

Use this initial binary search tree (BST) as the starting snapshot for each independent example unless we say otherwise:

```text
             8
           /   \
          4     12
         / \   /  \
        2   6 10   14
```

The drawing shows keys only. Every position still carries its `(area, stock)` value. Rotating positions keeps the key order and every tile measurement intact.

<span id="background-access"></span>

### 2. Let the tree respond to a lookup

Suppose the class asks for the 14 cm tile several times while planning square cutouts. The first lookup follows `8 → 12 → 14`. If the tree moves the accessed position `14` to its root, the next lookup for the same side starts and ends at `14`.

The book compares this idea with moving an accessed list entry toward the front. A splay tree uses rotations to bring an accessed **tree position** to the root. Other tile sizes can move deeper in the process, so we must distinguish the cost of **one** lookup from the cost of a **sequence** of lookups.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 11.4 Splay Trees

<span id="part-1-purpose"></span>

### 1. Self-adjustment instead of a fixed height rule

The [AVL guide](11-03-avl-trees.md) kept every position's child heights within one level. A **splay tree** has no such height requirement and stores no height or balance field at its nodes. It adjusts after an operation by moving the position it reached toward the root.

This means an individual splay-tree search can still follow a chain of `n` positions and cost `O(n)`. The benefit is a guarantee across a **sequence**: the book proves `O(log n)` amortized time per operation, even though one operation may be much slower. Frequently requested sizes also tend to become easy to reach.

The values are unaffected by this adjustment. A 14 cm tile still has one-tile area 196 cm² whether key `14` is a leaf or the root.

> **Mental model:** AVL repairs a height violation after an update. Splaying responds to where an operation went, even when the tree still satisfies every ordinary BST rule.

<span id="part-1-splay"></span>

### 2. What it means to splay a position

To **splay** position `x`, repeat small rotations until `x` becomes the root. The choice depends on whether `x` has only a parent, or also a grandparent, and on the left/right shape of that short path. We use **depth** as the number of edges from the root: the root is at depth `0`.

| Shape near `x` | Name | Rotations in one splay step | How far `x` rises |
| :------------- | :--- | :-------------------------- | ----------------: |
| Parent, no grandparent | **Zig** | Lift `x` once. | 1 level |
| Parent and grandparent; both links lean the same way | **Zig-zig** | Lift the parent, then lift `x`. | 2 levels |
| Parent and grandparent; links lean opposite ways | **Zig-zag** | Lift `x` twice. | 2 levels |

Each rotation changes only a fixed number of links. The complete splay uses one rotation for each level `x` rises, so a position initially at depth `d` takes `d` rotations to reach the root. The search that found `x` also followed a path of length proportional to `d`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 11.4.1 Splaying

For the three small patterns, use tile sizes 4, 8, and 12 cm. Their one-tile areas are 16, 64, and 144 cm², totaling **224 cm²**. Each diagram is a separate local snapshot of these same three entries.

<span id="part-2-zigzig"></span>

### 1. Zig-zig: two turns in the same direction

Here `x = 12` is the right child of `y = 8`, and `y` is the right child of `z = 4`:

```text
Start:          Lift parent 8:       Lift x = 12:

4                    8                    12
 \                  / \                   /
  8                4  12                 8
   \                                    /
    12                                 4
```

The splay tree **first rotates the parent `8` above `4`**, then rotates `12` above `8`. That order matters. The accessed position `12` ends at the root, with `8` below it and `4` below `8`. The key order remains `4, 8, 12`, and the three areas still total 224 cm².

This is different from an AVL trinode repair of the same straight path. The AVL repair would stop after lifting the middle key `8` once; the splay step continues until the **accessed key `12`** has risen two levels. A splay tree may therefore remain tall after this step.

<span id="part-2-zigzag"></span>

### 2. Zig-zag: the path changes direction

Here `x = 8` is the left child of `y = 12`, while `y` is the right child of `z = 4`:

```text
Start:          Lift x above 12:     Lift x above 4:

  4                   4                    8
   \                   \                  / \
   12                   8                4  12
   /                     \
  8                      12
```

The path bends right–left. Rotate `8` above `12`, then rotate **the same position `8`** above `4`. The accessed key becomes root; `4 < 8 < 12` still holds. The one-tile areas remain 16, 64, and 144 cm².

The mirrored left–right case uses the same rule: rotate `x` twice. The four hanging subtrees, if present, are reattached in key order as in Section 11.2.

<span id="part-2-zig"></span>

### 3. Zig: one final parent-child rotation

When `x` has a parent but no grandparent, the parent is root. One rotation finishes the splay:

```text
Before:             After zig:

  8                   12
   \                  /
   12                8
```

For an access to side `12`, its depth changes from `1` to `0`. A second immediate access to side `12` finds it at the root and needs **no** rotation. Side `12` still maps to `(144, 1)`.

<span id="part-2-trace"></span>

### 4. Trace a 14 cm lookup in the full catalog

Reset to the seven-key tree in the background. Search for side `14`, following `8 → 12 → 14`. The last two links are right–right, so use one zig-zig step:

```text
Before:                  Lift 12 above 8:        Lift 14 above 12:

       8                       12                       14
      / \                     /  \                      /
     4   12                  8    14                   12
    / \  / \                / \                         /
   2   6 10 14             4  10                       8
                          / \                         / \
                         2   6                       4  10
                                                    / \
                                                   2   6
```

The result has root `14`, and its inorder keys are still `2, 4, 6, 8, 10, 12, 14`. The seven one-tile areas still total 560 cm². The first search compared three keys; the next search for `14` compares only the root.

Notice that the longest root-to-leaf path now has **four edges**, up from two in the starting tree. A splay improves access to `14` immediately but does not enforce AVL height balance or a short worst-case path for every key.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 11.4.2 When to Splay

<span id="part-3-events"></span>

### 1. Search hits, misses, insertion, and deletion

Splaying responds to the **position actually reached** by the map operation. The book applies it after the following events:

| Event | Position to splay | Tile example |
| :---- | :---------------- | :----------- |
| Successful search | The found position. | Find side `14`; move `14` to root. |
| Unsuccessful search | The last existing position visited before an empty child link. | Seek absent side `15`; move `14` to root. |
| New-key insertion | The newly attached position. | Add side `16`; move `16` to root. |
| Existing-key value update | The existing position reached through the access hook. | Change stock for side `6`; move `6` to root. |
| Deletion | The parent of the position physically removed by BST deletion, if one exists. | Delete side `8`; splay former parent `4` of the removed predecessor position. |

The book calls the failed-search stopping point a leaf position. In the linked `TreeMap` implementation, that means the **last existing node next to the missing child link**. There is no node at the empty link to rotate. Splaying after a failed lookup does not turn the absent key into an entry.

<span id="part-3-miss"></span>

### 2. An unsuccessful 15 cm lookup

From the starting tree, ask for a 15 cm tile. The search compares `15 > 8`, then `15 > 12`, then `15 > 14`, and stops at the empty right child of `14`. The last existing position is `14`, so splay it with the same zig-zig sequence used in Part 2.

The caller still learns that side `15` is **absent**; `catalog[15]` raises `KeyError`. The sorted keys remain `2, 4, 6, 8, 10, 12, 14`, and the one-tile area total remains 560 cm². A future nearby query may now reach `14` quickly.

<span id="part-3-updates"></span>

### 3. Insert 16 cm or delete 8 cm

These are two **independent** updates from the original seven-key snapshot.

**Insertion:** A new 16 cm tile has area `16² = 256 cm²`. Attach key `16` as the right child of `14`, then splay that new position to the root. The sorted keys become `2, 4, 6, 8, 10, 12, 14, 16`, and the one-tile area total becomes `560 + 256 = 816 cm²`. The splay changes its position, not its value `(256, 1)`.

**Deletion:** Remove key `8`, whose position has two children. Ordinary BST deletion copies its predecessor entry, key `6` with area 36 cm², into the root position; it then physically removes the old `6` leaf under parent `4`. Splay **parent `4`**, the position next to that physical removal:

```text
After physical removal:         After splaying 4:

        6                              4
      /   \                           / \
     4     12                        2   6
    /     /  \                            \
   2     10  14                            12
                                         /  \
                                        10  14
```

The final keys are `2, 4, 6, 10, 12, 14`; key `8` and its 64 cm² tile are gone. Their one-tile area total is `560 − 64 = 496 cm²`. Splaying `4` is different from splaying the requested key `8`, which no longer exists.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 11.4.3 Python Implementation

<span id="part-4-loop"></span>

### 1. Repeat rotations until the position is root

The book's `SplayTreeMap` subclasses `TreeMap` and reuses its ordinary map search, insertion, deletion, and `_rotate` helper. It adds a method `_splay(p)` that repeatedly examines `p`, its parent, and, if present, its grandparent:

| Situation | `_splay(p)` action | Three-size reminder |
| :-------- | :----------------- | :------------------- |
| No grandparent | Rotate `p` once. | Zig: `8 → 12` becomes root `12`. |
| Parent and `p` are on the same side of their parents | Rotate parent, then `p`. | Zig-zig: `4 → 8 → 12` ends with `12` root. |
| Parent and `p` are on opposite sides | Rotate `p` twice. | Zig-zag: `4 → 12 → 8` ends with `8` root. |

After each step, test whether `p` is root. The test and each one or two rotations use constant local work. `_splay` does not store an AVL-style height or balance number at a node.

<span id="part-4-hooks"></span>

### 2. Connect the three rebalancing hooks

`TreeMap` supplies hook points from [Section 11.2](11-02-balanced-search-trees.md). `SplayTreeMap` overrides all three:

| Hook | What the splay subclass does |
| :--- | :--------------------------- |
| `_rebalance_access(p)` | Splay the position reached by an access, including an existing-key value update. |
| `_rebalance_insert(p)` | Splay the new leaf after insertion. |
| `_rebalance_delete(p)` | Splay the former parent of the physically removed position, if `p` is not `None`. |

For a stock update from `6 → (36, 1)` to `6 → (36, 3)`, no second key `6` is created. The access hook splays the existing position `6`; the three 6 cm tiles now have combined area `3 × 36 = 108 cm²`. This is a separate snapshot from the insertion and deletion above.

<span id="part-4-client"></span>

### 3. Use `SplayTreeMap` through the map interface

Assuming the textbook's supporting classes have been defined, callers use the same map syntax as before. `SplayTreeMap` is a textbook class, **not** a Python built-in.

```python
catalog = SplayTreeMap()
for side in (8, 4, 12, 2, 6, 14, 10):
    catalog[side] = (side * side, 1)

print(catalog[14])    # (196, 1); access splays 14
print(catalog[14])    # (196, 1); 14 is already root
print(list(catalog))  # [2, 4, 6, 8, 10, 12, 14]
```

Because each **insertion** splays its new leaf, this insertion order does not necessarily produce the starting tree drawn in the background. That tree is a separate, valid initial snapshot used to trace rotations. Iterating over the map still gives sorted keys, regardless of its current shape.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 11.4.4 Amortized Analysis of Splaying

<span id="part-5-actual"></span>

### 1. Separate one expensive access from a whole sequence

If a reached position starts at depth `d`, splaying it uses `d` rotations: each zig-zig or zig-zag step raises it two levels with two rotations, and a final zig raises it one level with one. The search path also has length `O(d)`. In a chain of `n` positions, `d` can be `n − 1`, so **one** access can take `O(n)` time.

An **amortized** bound measures the total work across many operations and divides it among them. It is not a promise that every lookup takes logarithmic time. For example, the first access to side `14` in our seven-key tree uses three comparisons and two rotations, while the next access to `14` uses one comparison and no rotation. This is useful intuition, but the book's guarantee needs an accounting argument that works for **any** operation sequence.

<span id="part-5-potential"></span>

### 2. Give each subtree a size and rank

For the proof, let `size(w)` be the number of positions in the subtree rooted at position `w`. Give it a **rank** `rank(w) = log₂(size(w))`: for example, `log₂ 8 = 3` because `2³ = 8`. The tree's **potential** is the sum of all ranks:

```text
Φ(tree) = sum of log₂(size(w)) over every position w
```

These are imaginary accounting credits, **not** fields that the splay-tree implementation stores. They also are not tile areas. A 14 cm tile always has area 196 cm², but its subtree size can change as rotations move it.

Take a tiny catalog with side keys `4`, `8`, and `12` and one tile each. Before accessing `12`, root `8` has subtree size `3`, while leaves `4` and `12` each have size `1`. Thus `Φ_before = log₂3`. A zig moves `12` to root, with `8` and then `4` on its left. The new subtree sizes are `3`, `2`, and `1`, so `Φ_after = log₂3 + log₂2 = log₂3 + 1`.

The rotation's actual cost is `1`, and the potential increases by `1`, giving an **amortized charge** of `1 + (Φ_after − Φ_before) = 2`. The three physical tile areas still total `16 + 64 + 144 = 224 cm²`. Potential tracks future tree work; geometry tracks surface area.

<span id="part-5-steps"></span>

### 3. Pay for rotations with rank changes

Write `r(x)` for the accessed position's rank before a splay step and `r′(x)` for its rank after. Proposition 11.3 bounds how much the whole tree's potential can change in that step:

| Step | Rotations paid now | Bound on change in potential `ΔΦ` |
| :--- | -----------------: | :-------------------------------- |
| Zig-zig or zig-zag | 2 | `ΔΦ ≤ 3[r′(x) − r(x)] − 2` |
| Zig | 1 | `ΔΦ ≤ 3[r′(x) − r(x)]` |

The proof uses the logarithm of subtree sizes to show that the two rotations in a double step are offset by rank changes. For positive sizes `a` and `b` with `a + b < c`, the inequality `ab ≤ ((a + b)/2)² < (c/2)²` gives `log₂ a + log₂ b < 2 log₂ c − 2`. This explains the `−2` credit in the double-step bound. When the step bounds are added along the path, the intermediate ranks cancel. If `x` began at depth `d` in a tree of `n` positions, Proposition 11.4 yields:

```text
total potential change ≤ 3[log₂ n − log₂(size_before(x))] − d + 2

amortized rotation cost = d + total potential change
                        ≤ 3[log₂ n − log₂(size_before(x))] + 2
                        = O(log n)
```

For a leaf such as side `14` in the original catalog, `size_before(14) = 1` and its rank is `log₂1 = 0`; after splaying it, it is root and its rank is `log₂7`. The formula gives a logarithmic **accounting bound** even though its actual position changes and other tiles may move deeper. It does not say the resulting tree has logarithmic height.

<span id="part-5-sequence"></span>

### 4. Add up operations from an empty tree

For operation `i`, write `Φ_i` for the potential afterward. The amortized charge is `actual_i + Φ_i − Φ_(i−1)`. Across a sequence, the potential changes telescope:

```text
sum of actual costs = sum of amortized charges − (Φ_final − Φ_initial)
```

An empty tree starts with potential `0`, and all subtree ranks are nonnegative, so the amortized total bounds the actual total from above. Insertion can raise ancestor subtree ranks by at most an additional `O(log n)` charge; deletion does not need extra rank credits because removing a position cannot increase the old ancestor subtree sizes before splaying.

Let `n_i` be the number of stored entries after operation `i`, and let `n` be the total number of insertions. Proposition 11.5 gives the more precise total bound `O(m + Σᵢ log₂ n_i)` for `m` operations from an empty tree. To include an operation when `n_i = 0`, write the bound as `O(m + Σᵢ log₂(n_i + 1))`. Since each `n_i ≤ n`, a coarser bound is `O(m(1 + log₂(n + 1)))`, or `O(1 + log₂(n + 1))` **amortized** per operation. A particular operation can still take `O(n)`.

<span id="part-5-frequency"></span>

### 5. Give frequently requested sizes a smaller average charge

The book also states a **static optimality** result (Proposition 11.6). Start with an empty tree and perform `m` searches, insertions, or deletions. Let `f(i)` count the times entry `i` is accessed, with every entry under discussion accessed at least once. The total cost has the bound:

```text
O(m + sum over keys i of f(i) × log₂(m / f(i)))
```

For a tile-planning session, start empty, insert the seven sizes once each, then look up side `14` thirteen more times. This gives `m = 20` operations. For this example, count each insertion's splay as an access to its new entry; the proposition does not spell out that counting convention. Then `f(14) = 14` and each other size has frequency `1`. The frequent size's per-access logarithmic factor is `log₂(20/14)`, about `0.51`; a size accessed once has factor `log₂20`, about `4.32`. The formula multiplies each factor by its frequency, and the leading `O(m)` term pays for basic work. These numbers describe the theorem's **bound**, not exact measured lookup times.

The 14 cm tile's geometry remains 196 cm². Static optimality concerns how often a **key** is accessed and how the tree responds, not the physical size of the tile. The book states this stronger result without proving it in Section 11.4.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why does a second 14 cm lookup take fewer comparisons?</strong></summary>

**Scenario:** Start with the seven-key tile tree and look up side `14` twice.

**Problem:** The first lookup follows `8 → 12 → 14`; `14` begins two edges below root.

**Fix:** The first lookup uses a zig-zig step: rotate `12` above `8`, then `14` above `12`.

**Result:** The first lookup compares three keys; the second compares the root only. Side `14` still maps to `(196, 1)`, and the one-tile area total remains 560 cm².

</details>

<details>
<summary><strong>Case Study 2: A failed 15 cm search still adjusts the tree</strong></summary>

**Scenario:** Reset the original catalog and request a 15 cm square.

**Problem:** No key `15` exists. The search ends after comparing `8`, `12`, and `14`.

**Fix:** Splay the last existing position, `14`, which is next to the missing right-child link.

**Result:** The lookup still fails and does not add a 225 cm² tile. The catalog retains its seven sizes and 560 cm² one-tile total; `14` becomes root.

</details>

<details>
<summary><strong>Case Study 3: Adding a new size versus updating stock</strong></summary>

**Scenario:** Consider two separate updates to the original catalog: add one 16 cm tile, or receive two more 6 cm tiles.

**Problem:** The first creates a new side-length key; the second changes the stock value for an existing key.

**Fix:** Insert `16 → (256, 1)` and splay its new position. In the other snapshot, update `6 → (36, 3)` and splay the existing position through the access hook.

**Result:** The new-size catalog has one-tile area total `560 + 256 = 816 cm²`. The stock-update catalog has total physical tile area `560 + 2 × 36 = 632 cm²`. Both operations move the reached key to root without changing its one-tile area.

</details>

<details>
<summary><strong>Case Study 4: Which position is splayed after deleting 8 cm?</strong></summary>

**Scenario:** Reset to the original seven-key tree and delete side `8`, which has two children.

**Problem:** The old root position receives predecessor entry `6`; the old `6` leaf is the position physically removed. The requested key `8` is no longer available to splay.

**Fix:** Remove the old `6` leaf under parent `4`, then splay parent `4` with a zig rotation.

**Result:** The final keys are `2, 4, 6, 10, 12, 14`, with `4` at root. Removing the 8 cm square subtracts `8² = 64 cm²`, leaving `560 − 64 = 496 cm²` of one-tile area.

</details>

<details>
<summary><strong>Case Study 5: Does splaying guarantee a short tree immediately?</strong></summary>

**Scenario:** In the original seven-key tree, splay side `14` to root.

**Problem:** Key `14` becomes easy to access, but other keys move deeper; the longest path changes from two edges to four.

**Fix:** Use the right–right zig-zig sequence to splay `14`, then assess the cost across operations with the amortized bound.

**Result:** This individual result is taller than the starting tree. The sequence guarantee is amortized `O(log n)` per operation, while one operation can still take `O(n)` in a large chain. Every tile keeps its side, area, and stock value through the rotation.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 11.4 idea | Plain-language meaning | Square-tile example |
| :---------------- | :--------------------- | :------------------ |
| **Splaying** | Move the reached position to root through rotations. | A lookup moves key `14` from depth 2 to root. |
| **Zig-zig** | Same-direction path: rotate parent, then target. | `8 → 12 → 14` makes `14` root. |
| **Zig-zag** | Bent path: rotate the target twice. | `4 → 12 → 8` makes `8` root. |
| **Zig** | Target has no grandparent: rotate it once. | `8 → 12` makes `12` root. |
| **When to splay** | Respond to a hit, miss, insertion, update, or deletion. | A miss for `15` splays last visited key `14`. |
| **No fixed height rule** | A single search can still meet a long chain. | Splaying `14` raises the seven-key tree's height from 2 to 4 edges. |
| **Potential** | Add logarithms of subtree sizes to account for future work. | A leaf's rank is `0`; a seven-key root's rank is `log₂7`. |
| **Amortized bound** | A sequence has `O(log n)` amortized cost per operation. | Repeated tile lookups receive a logarithmic amortized bound. |
| **Static optimality** | Frequently accessed keys receive a smaller frequency-based bound. | Seven insertions and 13 further lookups for 14 cm give it 14 of 20 accesses. |

[🔝 Back to Top](#top)
