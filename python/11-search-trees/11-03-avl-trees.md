<span id="top"></span>

# 11.3 AVL Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 11, Section 11.3, printed pages 481–489 ([supplied Chapter 11 PDF](<../Data Structures and Algorithms in Python - C11.pdf>)).<br>
> **Topic:** 11.3 AVL Trees and their height bound; 11.3.1 Update Operations (insertion and deletion); Performance of AVL Trees; 11.3.2 Python Implementation.<br>
> **Domain Focus:** The square-tile catalog from [Section 11.1](11-01-binary-search-trees.md): side lengths as keys, `(area, stock)` as values, and AVL repairs that keep searches short while preserving each tile's measurements.<br>
> **User Prompt:** Reexplain Section 11.3 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Keep the Tile Catalog Short](#background)
   - [1. Return to the seven square sizes](#background-catalog)
   - [2. A short tree and a chain answer the same geometry questions](#background-shapes)
2. [Part 1: 11.3 AVL Trees](#part-1)
   - [1. Definition of an AVL Tree and its height convention](#part-1-definition)
   - [2. Check the starting tile tree](#part-1-check)
   - [3. Why AVL height grows logarithmically](#part-1-height)
3. [Part 2: 11.3.1 Update Operations](#part-2)
   - [1. What an insertion can disturb](#part-2-insert-rule)
   - [2. Insert 16 cm, then 18 cm: a straight repair](#part-2-insert-straight)
   - [3. Insert 18 cm, then 16 cm: a bent repair](#part-2-insert-bent)
   - [4. Why deletion can require more repairs](#part-2-delete-rule)
   - [5. Delete 2 cm, then 6 cm from the same catalog](#part-2-delete-example)
   - [6. Choose the outer grandchild on a deletion tie](#part-2-tie)
4. [Part 3: Performance of AVL Trees](#part-3)
   - [1. Worst-case operation costs](#part-3-costs)
   - [2. Account for the downward and upward paths](#part-3-paths)
5. [Part 4: 11.3.2 Python Implementation](#part-4)
   - [1. Store and recompute heights](#part-4-heights)
   - [2. Select the taller child and grandchild](#part-4-select)
   - [3. Rebalance upward through the update hooks](#part-4-hooks)
   - [4. Use `AVLTreeMap` as a map](#part-4-client)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Keep the Tile Catalog Short

<span id="background-catalog"></span>

### 1. Return to the seven square sizes

The class still catalogs square tiles by **side length**. A side of `s` centimetres gives one-tile area `s × s` square centimetres. The value stored with key `s` is `(area, stock count)`. Begin with the same seven sizes as [Section 11.1](11-01-binary-search-trees.md), one tile of each:

| Side key | 2 cm | 4 cm | 6 cm | 8 cm | 10 cm | 12 cm | 14 cm |
| :------- | ---: | ---: | ---: | ---: | ----: | ----: | ----: |
| Area of one tile | 4 cm² | 16 cm² | 36 cm² | 64 cm² | 100 cm² | 144 cm² | 196 cm² |

The total area is `4 + 16 + 36 + 64 + 100 + 144 + 196 = 560 cm²`. The tree stores **one position per side length**; stock counts physical tiles of that size. Rotating positions never changes a tile's key, area, or stock count.

<span id="background-shapes"></span>

### 2. A short tree and a chain answer the same geometry questions

The seven keys can form this short binary search tree (BST):

```text
             8
           /   \
          4     12
         / \   /  \
        2   6 10   14
```

Inserting those same keys in increasing order instead creates a seven-position chain. Both trees answer “What is the area of a 14 cm tile?” with `14 × 14 = 196 cm²`, but the short tree checks only `8 → 12 → 14`; the chain may check all seven keys. [Section 11.2](11-02-balanced-search-trees.md) introduced rotations and three-position restructuring. AVL trees add a **rule for when to use them**, keeping the tree short after updates.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 11.3 AVL Trees

<span id="part-1-definition"></span>

### 1. Definition of an AVL Tree and its height convention

An **AVL tree** is a BST in which, at **every** position, the heights of the left and right subtrees differ by at most one. The name comes from Adel’son-Vel’skii and Landis. It is not enough for only the root to look even; every smaller subtree must obey the same rule.

Section 11.3 measures height by the **number of positions on the longest downward path**. This differs by one from the edge-count height used in the earlier tree guides:

| Subtree | Height in this AVL section | Earlier edge-count view |
| :------ | -------------------------: | :---------------------- |
| Empty child | `0` | No edge-height value needed for this guide |
| A leaf | `1` | `0` edges |
| Root with leaf children | `2` | `1` edge |
| Starting seven-key tile tree | `3` | `2` edges |

For a position `p`, write `L` for the height of its left subtree and `R` for the height of its right. Then:

```text
height(p) = 1 + max(L, R)
balance difference = L − R
AVL requirement: |L − R| ≤ 1 at every position
```

The “balance difference” is a convenient number for our traces. A value of `0` means equal child heights; `+1` means the left is one level taller; `−1` means the right is one level taller. `+2` or `−2` signals an AVL violation.

> **Mental model:** A tile size may have more catalog entries below one side than the other. AVL controls the **longest paths**, requiring each position's two child heights to differ by no more than one.

<span id="part-1-check"></span>

### 2. Check the starting tile tree

In the seven-key tree, `2`, `6`, `10`, and `14` are leaves of height `1`. Positions `4` and `12` each have two leaf children, so their heights are `1 + max(1, 1) = 2`. The root `8` has child heights `2` and `2`, so its height is `3`.

| Position | Left height `L` | Right height `R` | `L − R` | AVL? |
| :------- | --------------: | ---------------: | ------: | :--- |
| Leaf `2`, `6`, `10`, or `14` | 0 | 0 | 0 | Yes |
| `4` or `12` | 1 | 1 | 0 | Yes |
| Root `8` | 2 | 2 | 0 | Yes |

Every position passes, so this tree is AVL. The increasing-order chain fails: its top position has an empty left child of height `0` and a right subtree of height `6`, giving a difference of `−6`.

<span id="part-1-height"></span>

### 3. Why AVL height grows logarithmically

Proposition 11.2 shows that an AVL tree with `n` positions has height `O(log n)`. The key idea is to ask: **How few positions can an AVL tree of height `h` have?** Call this minimum `N(h)`.

A one-position tree has height `1`, so `N(1) = 1`. The smallest height-`2` AVL tree has a root and one child, so `N(2) = 2`. For height `h ≥ 3`, one child must reach height `h − 1`. To keep the height difference at most one while using as few positions as possible, the other child reaches height `h − 2`:

```text
N(h) = 1 + N(h − 1) + N(h − 2)
       root   taller child  shorter child
```

| Height `h` measured in positions | 1 | 2 | 3 | 4 | 5 |
| :------------------------------- | -: | -: | -: | -: | --: |
| Minimum `N(h)` | 1 | 2 | 4 | 7 | 12 |

For example, height `4` needs at least `1 + N(3) + N(2) = 1 + 4 + 2 = 7` positions. The recurrence grows roughly like Fibonacci numbers. In particular, `N(h) > 2N(h − 2)`: every two extra levels require more than twice as many positions. Thus height can grow only on the order of the logarithm of the number of stored sizes. The book derives the more specific bound `h < 2 log₂(n) + 2` for `n ≥ 1`.

This bound concerns **tree positions**, not tile area. Whether a key is `2` or `200`, the number of positions and their heights determine the search-path bound.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 11.3.1 Update Operations

<span id="part-2-insert-rule"></span>

### 1. What an insertion can disturb

Insert a new tile size using the ordinary BST rule: compare side-length keys until an empty child slot is found. The new entry is a leaf. Only its **ancestors** can have changed height or become unbalanced; subtrees elsewhere are untouched.

Walk upward from the new leaf to the **first** unbalanced ancestor `z`. Let `y` be `z`'s taller child and `x` be `y`'s taller child. For insertion, these taller choices are unique and lead back toward the inserted leaf. Apply the trinode restructuring from Section 11.2 to `x`, `y`, and `z`.

One restructuring is enough for insertion. It gives the repaired subtree the same height it had **before** the new leaf was added, so ancestors above `z` return to their previous balance. The new tile's `(area, stock)` value remains attached to its key throughout.

<span id="part-2-insert-straight"></span>

### 2. Insert 16 cm, then 18 cm: a straight repair

Start from the seven-key AVL tree. Add `16 → (256, 1)` because `16 × 16 = 256 cm²`. The path is `8 → 12 → 14 → new right child 16`. The heights along it become `16: 1`, `14: 2`, `12: 3`, `8: 4`. Each position's child heights still differ by at most one, so **no rotation** is needed.

Now add `18 → (324, 1)` as the right child of `16`. Walking upward, the first violation is at `z = 14`: its left height is `0`, while its right subtree rooted at `16` has height `2`. The path from `z` to `y = 16` to `x = 18` goes right–right, so lift `16` above `14` with one left rotation:

```text
Local subtree before:       Local subtree after:

14                                16
  \                              /  \
   16                           14   18
     \
      18
```

The full catalog is then:

```text
             8
           /   \
          4     12
         / \   /  \
        2   6 10   16
                 /  \
                14  18
```

The subtree now rooted at `16` has height `2`, just as the subtree rooted at `14` did before inserting `18`. Position `12` has child heights `1` and `2`, and root `8` has child heights `2` and `3`; both satisfy AVL. The nine one-tile areas total `560 + 256 + 324 = 1140 cm²`, unchanged by the rotation.

<span id="part-2-insert-bent"></span>

### 3. Insert 18 cm, then 16 cm: a bent repair

Reset to the original seven-key tree. This time add `18 → (324, 1)` first, then `16 → (256, 1)`. The new `16` becomes the left child of `18`, which is the right child of `14`. The first unbalanced ancestor is again `z = 14`, but its path bends right–left: `z = 14`, `y = 18`, `x = 16`.

```text
Start:                Lift 16 above 18:     Lift 16 above 14:

14                    14                         16
  \                     \                       /  \
   18                    16                    14   18
  /                        \
 16                         18
```

The two rotations make `16` the local root with `14` and `18` as children. The **same nine-key tree** results as in the straight case, with total one-tile area 1140 cm². The arrival order changes the repair path, while the sorted keys and geometric values remain the same.

<span id="part-2-delete-rule"></span>

### 4. Why deletion can require more repairs

First remove the requested key using ordinary BST deletion. If the target has two children, that process replaces it with its predecessor and physically removes the predecessor's old position. AVL rebalancing starts from the **parent of the physically removed position**, because that is where a subtree may have become shorter.

Walk upward to an unbalanced position `z`. Let `y` be its taller child, then choose a taller child `x` of `y`. If `y`'s children have **equal** heights, choose the **outer** child: left when `y` is left of `z`, right when `y` is right of `z`. This gives the proper single-rotation choice on a tie. Restructure at `x`.

The book notes that the physical removal initially creates at most one unbalanced ancestor. Unlike insertion, the repaired subtree after deletion may be **one level shorter** than before deletion. Its parent can then become unbalanced, so keep checking upward and restructure again if needed. A single deletion can require several local repairs, though no more than a logarithmic number of ancestor levels are visited in an AVL tree.

<span id="part-2-delete-example"></span>

### 5. Delete 2 cm, then 6 cm from the same catalog

Continue from the nine-key tree obtained after either insertion order above. Delete the leaf key `2`. The left subtree rooted at `4` still has key `6` and remains height `2`, so no AVL violation appears.

Next delete leaf key `6`. Position `4` becomes a leaf of height `1`. At root `8`, the left subtree now has height `1` and the right subtree rooted at `12` has height `3`: `1 − 3 = −2`. Choose `z = 8`, its taller child `y = 12`, and `y`'s taller child `x = 16`. This is a right–right case, so rotate `12` above `8`:

```text
Before repairing root 8:       After lifting 12:

        8                              12
      /   \                           /  \
     4     12                        8    16
          /  \                      / \  /  \
         10   16                   4  10 14  18
             /  \
            14  18
```

The final inorder side lengths are `4, 8, 10, 12, 14, 16, 18` cm. Every leaf has height `1`; positions `8` and `16` have height `2`; root `12` has height `3` and equal-height children. The two deleted tiles remove `2² + 6² = 4 + 36 = 40 cm²`, so the seven remaining one-tile areas total `1140 − 40 = 1100 cm²`.

Here the repaired root has no ancestor to inspect. In a larger tree, a parent above it might need another repair because this subtree's height has dropped.

<span id="part-2-tie"></span>

### 6. Choose the outer grandchild on a deletion tie

To see the tie rule separately, take a smaller snapshot of the same workshop's sizes:

```text
Before deleting 2:         After deleting 2:       After lifting 8 above 4:

       4                        4                            8
      / \                        \                          / \
     2   8                        8                        4   10
        / \                      / \                        \
       6  10                    6  10                        6
```

After deleting `2`, position `4` has left height `0` and right height `2`, so `z = 4` is unbalanced. Its taller child is `y = 8`. Both children of `8`—keys `6` and `10`—have height `1`, so the tie is resolved toward the **right**, the same side on which `8` sits relative to `4`. Thus `x = 10`, and one left rotation lifts `8` above `4`. Key `6` moves under `4` because `4 < 6 < 8`.

This is a separate five-size snapshot, not the state after the preceding seven-size deletion example. It shows why the tie choice matters without changing any tile's square area.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Performance of AVL Trees

<span id="part-3-costs"></span>

### 1. Worst-case operation costs

The AVL height bound turns a path of length `O(h)` into a path of length `O(log n)` for `n` stored keys. Table 11.2 in the book summarizes the resulting **worst-case** costs:

| Operation | Time | Tile-catalog meaning |
| :-------- | :--- | :------------------- |
| Exact search, insert, delete | `O(log n)` | Find, add, or remove a side length. |
| First/last and predecessor/successor | `O(log n)` | Find the smallest tile or a neighboring size. |
| Other ordered searches | `O(log n)` | Find the first side at least 9 cm. |
| Range reporting of `s` entries | `O(log n + s)` | List all sizes in a requested side-length interval. |
| Full iteration | `O(n)` | Visit every stored size in order. |

The tree also uses `O(n)` space: each distinct size has one linked position with a height record. This is a storage observation in addition to the operation times in Table 11.2. Updating the stock for an **existing** size does not add a tree position. A range query must spend time reporting its `s` answers even when the tree is short.

<span id="part-3-paths"></span>

### 2. Account for the downward and upward paths

An update first follows one BST search path **down** to the affected position. Rebalancing then follows ancestors **up**. At each level, checking stored child heights and, if needed, restructuring uses `O(1)` local work. There are only `O(log n)` levels in an AVL tree, so the whole insertion or deletion is `O(log n)` in the worst case.

Insertion needs at most one restructuring, as the `14 → 16 → 18` example showed. Deletion can restructure at several ancestors, but each repair still costs `O(1)` and there are only logarithmically many ancestors. Rotations preserve the map's inorder keys and geometric values; their job is to control paths, not to recalculate tile area.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 11.3.2 Python Implementation

<span id="part-4-heights"></span>

### 1. Store and recompute heights

The book defines `AVLTreeMap` as a subclass of `TreeMap`. Its nested `_Node` adds a stored `_height` field, so balance checks do not have to traverse an entire subtree just to learn its height. The node's stored height begins at `0` when it is created; that is a **provisional implementation value**. Once the new leaf is processed, its mathematical AVL height is recomputed as `1`.

| Helper | Meaning | Example |
| :----- | :------ | :------ |
| `_Node.left_height()` / `_Node.right_height()` | Read that node's child height, or `0` if the child is absent. | At leaf `14`, both values are `0`. |
| `_recompute_height(p)` | Store `1 + max(left height, right height)` at `p`. | If `16` has leaf children `14` and `18`, store `2`. |
| `_isbalanced(p)` | Check whether the two child heights differ by at most one. | Before the straight repair, `14` has child heights `0` and `2`, so it fails. |

The stored height is **bookkeeping for the tree shape**. A tile's area remains `side × side` in the map value; it is not used to decide AVL balance.

<span id="part-4-select"></span>

### 2. Select the taller child and grandchild

`_tall_child(p, favorleft=False)` chooses whichever child has greater stored height. On equal heights, it normally chooses the right child; `favorleft=True` makes it choose the left. `_tall_grandchild(p)` first selects a taller child `y`, then chooses a child of `y`. If those grandchildren tie, it favors the **outer** one, aligned with `y`'s side of `p`.

In the five-size deletion snapshot, the imbalance is at `p = 4` and the taller child is `y = 8` on the right. Its children `6` and `10` tie, so `_tall_grandchild(4)` chooses right child `10`. That choice gives the one-rotation repair shown above.

<span id="part-4-hooks"></span>

### 3. Rebalance upward through the update hooks

The `TreeMap` framework from Section 11.2 calls hooks after updates. `AVLTreeMap` overrides `_rebalance_insert(p)` and `_rebalance_delete(p)` to call the same upward routine, `_rebalance(p)`. It does not need a special access repair for an ordinary lookup.

The routine can be read as this sequence:

1. At the current position, remember its old stored height.
2. If its child heights violate AVL, choose the tall grandchild and restructure. Recompute the heights of the new local root's two children.
3. Recompute the current local root's height.
4. If that height did **not** change, stop: higher ancestors see the same subtree height as before. Otherwise, move to the parent and repeat.

The insertion hook begins at the new leaf. The deletion hook begins at the parent of the physically removed position, which may be `None` if the root was removed. This one routine covers the single insertion repair and the possible series of deletion repairs.

<span id="part-4-client"></span>

### 4. Use `AVLTreeMap` as a map

Once the book's supporting classes and `AVLTreeMap` are defined, callers use the same map operations as for `TreeMap`. `AVLTreeMap` is a textbook class, **not** a Python built-in.

```python
catalog = AVLTreeMap()
for side in (8, 4, 12, 2, 6, 10, 14):
    catalog[side] = (side * side, 1)  # (area in cm², stock)

catalog[16] = (16 * 16, 1)
catalog[18] = (18 * 18, 1)
print(catalog[18])     # (324, 1)
print(list(catalog))   # [2, 4, 6, 8, 10, 12, 14, 16, 18]

del catalog[2]
del catalog[6]
print(list(catalog))   # [4, 8, 10, 12, 14, 16, 18]
```

The public interface reports the same sorted keys regardless of which rotations occurred. The diagrams above explain the internal shapes that produce logarithmic search paths.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Is the original tile tree AVL?</strong></summary>

**Scenario:** The original seven tile sizes form the tree rooted at `8`, with `4` and `12` below it and four leaves below them.

**Problem:** A tree can look balanced at its root while hiding an unbalanced lower subtree, so check every position.

**Fix:** Leaves have height `1`; `4` and `12` each have height `2`; `8` has height `3`. At every position, left and right child heights are equal.

**Result:** All balance differences are `0`, so the tree is AVL. It still maps side `14` to an area of 196 cm².

</details>

<details>
<summary><strong>Case Study 2: Why does adding 16 cm need no repair, but adding 18 cm does?</strong></summary>

**Scenario:** Add a 16 cm tile, then an 18 cm tile to the original catalog.

**Problem:** After the first insertion, the affected positions are taller but none has a child-height difference above one. After the second, position `14` has child heights `0` and `2`.

**Fix:** Do nothing after adding `16`. After adding `18`, use the right–right path `14 → 16 → 18` to rotate `16` above `14`.

**Result:** The repaired subtree rooted at `16` has keys `14, 16, 18` in order and height `2`. Their one-tile areas are `196, 256, 324 cm²`; the whole nine-size catalog totals 1140 cm².

</details>

<details>
<summary><strong>Case Study 3: Same sizes, different insertion path</strong></summary>

**Scenario:** Reset the original catalog and add 18 cm first, then 16 cm.

**Problem:** The path under `14` bends right–left: `14 → 18 → 16`. A single rotation of `18` above `14` would not place the middle key at the local root.

**Fix:** Lift `16` above `18`, then lift `16` above `14`.

**Result:** The final local root is `16` with children `14` and `18`, exactly as in Case Study 2. One-tile areas remain 196, 256, and 324 cm² for sides 14, 16, and 18; stock stays at one tile each.

</details>

<details>
<summary><strong>Case Study 4: Two deletions reveal an imbalance</strong></summary>

**Scenario:** From the nine-size AVL catalog, remove side `2`, then side `6`.

**Problem:** The first deletion leaves the tree AVL. The second makes left subtree of root `8` height `1` while the right subtree is height `3`.

**Fix:** Choose `z = 8`, `y = 12`, `x = 16` and lift `12` above `8`.

**Result:** The final root is `12`, all seven remaining positions satisfy AVL, and the remaining one-tile areas total `1140 − 4 − 36 = 1100 cm²`.

</details>

<details>
<summary><strong>Case Study 5: Which grandchild wins a deletion tie?</strong></summary>

**Scenario:** In the separate five-size snapshot rooted at `4`, remove left leaf `2`. The taller child of `4` is `8`, whose two children `6` and `10` have equal height.

**Problem:** The two grandchildren are equally tall, so height alone does not distinguish them.

**Fix:** Choose outer child `10`, on the same right side as `8` relative to `4`; rotate `8` above `4` once.

**Result:** The remaining key order is `4, 6, 8, 10`. Their one-tile areas total `16 + 36 + 64 + 100 = 216 cm²`, and every position again satisfies AVL.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 11.3 idea | Plain-language meaning | Square-tile example |
| :---------------- | :--------------------- | :------------------ |
| **AVL rule** | At every position, child subtree heights differ by at most one. | Original root `8` has child heights `2` and `2`. |
| **Height convention** | This section counts positions: empty `0`, leaf `1`. | Original seven-key tree has height `3` positions. |
| **Height bound** | Minimum AVL size grows quickly with height, so height is `O(log n)`. | Height `4` needs at least seven positions. |
| **Insertion repair** | Restructure at the first unbalanced ancestor; one repair suffices. | Adding `18` after `16` rotates under key `14`. |
| **Deletion repair** | Shrinking a subtree may require repairs up several ancestors. | Deleting `2` then `6` makes root `8` unbalanced. |
| **Tie rule** | On equal-height grandchildren after deletion, choose the outer one. | Choose `10` when `8`'s children `6` and `10` tie. |
| **Stored heights** | Keep each node's height for constant-time local checks. | A new leaf's provisional `0` becomes AVL height `1`. |
| **Map behavior** | Rebalancing changes links, not key–value entries. | Side `18` keeps area 324 cm² through rotation. |
| **Worst-case cost** | Paths have logarithmic height; each level takes constant local work. | Lookup, insertion, and deletion are `O(log n)`. |

[🔝 Back to Top](#top)
