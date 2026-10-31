<span id="top"></span>

# 11.6 Red-Black Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 11, Section 11.6, printed pages 512–527 ([supplied Chapter 11 PDF](<../Data Structures and Algorithms in Python - C11.pdf>)).<br>
> **Topic:** 11.6 Red-Black Trees; 11.6.1 Red-Black Tree Operations; 11.6.2 Python Implementation.<br>
> **Domain Focus:** The square-tile catalog from [Section 11.1](11-01-binary-search-trees.md): side lengths as keys, `(area, stock)` as values, and red-black repairs that preserve each tile's geometry.<br>
> **User Prompt:** Reexplain Section 11.6 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Color the Tile Catalog](#background)
   - [1. Reopen the seven square sizes](#background-catalog)
   - [2. Add colors to a familiar binary search tree](#background-colors)
2. [Part 1: 11.6 Red-Black Trees](#part-1)
   - [1. State the root, red, and depth rules](#part-1-rules)
   - [2. See a (2,4) node inside red-black links](#part-1-bridge)
   - [3. Bound the height](#part-1-height)
3. [Part 2: 11.6.1 Red-Black Tree Operations](#part-2)
   - [1. Insert a red position and locate a double red](#part-2-insert)
   - [2. Insertion Case 1: black uncle and trinode restructuring](#part-2-insert-black)
   - [3. Insertion Case 2: red uncle and recoloring](#part-2-insert-red)
   - [4. Delete an entry and identify the physical removal](#part-2-delete)
   - [5. Recognize a missing black level](#part-2-deficit)
   - [6. Deletion Case 1: black sibling with a red child](#part-2-delete-transfer)
   - [7. Deletion Case 2: black sibling without a red child](#part-2-delete-fusion)
   - [8. Deletion Case 3: red sibling](#part-2-delete-red)
   - [9. Count recolorings and structural repairs](#part-2-costs)
4. [Part 3: 11.6.2 Python Implementation](#part-3)
   - [1. Store one color bit and test missing children](#part-3-node)
   - [2. Connect insertion and deletion hooks](#part-3-hooks)
   - [3. Use the sorted map interface](#part-3-client)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Color the Tile Catalog

<span id="background-catalog"></span>

### 1. Reopen the seven square sizes

The class still keeps one entry per square-tile **side length**. For a side `s` centimetres, one tile has area `s × s = s²` square centimetres. The entry's value is `(one-tile area, stock count)`. Begin with one tile of each size:

| Side key | 2 cm | 4 cm | 6 cm | 8 cm | 10 cm | 12 cm | 14 cm |
| :------- | ---: | ---: | ---: | ---: | ----: | ----: | ----: |
| One-tile area | 4 cm² | 16 cm² | 36 cm² | 64 cm² | 100 cm² | 144 cm² | 196 cm² |

Their one-tile areas total `4 + 16 + 36 + 64 + 100 + 144 + 196 = 560 cm²`. Looking up key `12` returns `(144, 1)` because `12² = 144`. Red-black repairs may change **where** that entry sits, not its key, area, or stock.

<span id="background-colors"></span>

### 2. Add colors to a familiar binary search tree

[Section 11.5](<11-05-(2,4)-trees.md>) grouped these seven keys into root `[8]` with child boxes `[2 | 4 | 6]` and `[10 | 12 | 14]`. We can draw the **same entries** as a binary search tree and color each position. Write `B` for black and `R` for red:

```text
                  8B
                /    \
              4B      12B
             /  \     /   \
           2R   6R  10R  14R
```

This is one valid starting snapshot, not a promise that a particular insertion order produces this exact coloring. Every left key remains smaller than its parent, and every right key remains larger. A search still follows ordinary binary search tree comparisons. For example, side `14` follows `8B → 12B → 14R` and returns `14² = 196 cm²`.

Colors are bookkeeping for the tree. The suffix `R` does **not** mean a red-colored physical tile, and the value at `14R` is still `(196, 1)`. Unless a case says otherwise, the worked seven-size examples reset to this coloring.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 11.6 Red-Black Trees

<span id="part-1-rules"></span>

### 1. State the root, red, and depth rules

A **red-black tree** is a binary search tree whose internal positions are marked red or black. Section 11.6 gives three properties:

| Book's property | Rule | What it says in the tile tree |
| :-------------- | :--- | :----------------------------- |
| **Root Property** | The root is black. | `8B` is black. |
| **Red Property** | Every child of a red node, if present, is black. | The red leaves `2R, 6R, 10R, 14R` have no child to violate the rule. |
| **Depth Property** | Every node with zero or one child has the same **black depth**. | All four red leaves have black depth `2`. |

A node's **black depth** counts its black ancestors, **including the node itself if it is black**. On our starting tree, `8B` has black depth `1`; `4B` and `12B` have depth `2`; their red children also have black depth `2`. The book applies the depth rule to nodes with **zero or one child**, not only to leaves. A missing child shown as `∅` is an empty link and is not counted as an extra black node in these numbers.

For example, the small tree `8B` with only right child `12R` is valid: the one-child root `8B` and leaf `12R` both have black depth `1`. Red and black links can therefore give different root-to-node **edge lengths** while the required black depths agree.

<span id="part-1-bridge"></span>

### 2. See a (2,4) node inside red-black links

Merge each red position into its black parent while keeping the keys in sorted order. A black position with zero, one, or two red children becomes a (2,4)-tree node with one, two, or three entries:

| Black parent plus red children | Multiway result | Tile example |
| :----------------------------- | :-------------- | :----------- |
| No red child | 2-node with one entry | `8B → [8]` |
| One red child | 3-node with two entries | `8B` with red right child `12R → [8 | 12]` |
| Two red children | 4-node with three entries | `4B` with `2R` and `6R → [2 | 4 | 6]` |

Our full starting tree therefore becomes exactly the earlier (2,4) grouping:

```text
red-black tree:             grouped (2,4) tree:

       8B                           [8]
      /  \                         /   \
     4B  12B                [2 | 4 | 6] [10 | 12 | 14]
    / \  /  \
   2R 6R 10R 14R
```

A 3-node can be represented with its red entry on either side of the black parent, so the binary coloring is not unique. Rotations can change the orientation without changing sorted keys or tile areas. The red property prevents a chain of red positions from being merged into one oversized node.

<span id="part-1-height"></span>

### 3. Bound the height

Merging red children produces a (2,4) tree, whose common external depth is logarithmic in its number `n` of entries. A red-black path has at most one red position between black positions because red cannot follow red. Its binary-tree height is therefore logarithmic too.

**Proposition 11.9** states the sharper bound for a nonempty red-black tree, with height `h` measured in **edges**:

```text
log₂(n + 1) − 1 ≤ h ≤ 2 log₂(n + 1) − 2
```

For the seven-size catalog, `n = 7` and the longest root-to-node path has `h = 2` edges. The bound reads `2 ≤ 2 ≤ 4`. Search checks one key at each visited binary position, so it takes worst-case `O(log n)` time for a nontrivial tree. A lookup does not recolor the tree; repairs occur after updates.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 11.6.1 Red-Black Tree Operations

<span id="part-2-insert"></span>

### 1. Insert a red position and locate a double red

First search by the ordinary binary search rule. If the key is absent, replace the empty child link with a new position `x` carrying the whole `(key, value)` entry. Color `x` **red**, except that a new root must be black.

Adding a red leaf does not add a black level to any path. If its parent is black, the three properties already hold. If its parent `y` is red, the edge `yR → xR` breaks the red property; the book calls this a **double red**. Its grandparent `z` is black, and the color of `y`'s sibling, the **uncle** `s`, selects the repair.

| Uncle `s` | Repair | What can continue? |
| :-------- | :----- | :----------------- |
| Black or missing | Restructure the three positions `x, y, z`. | This repair finishes the insertion. |
| Red | Recolor the parent, uncle, and grandparent. | A double red may move upward. |

<span id="part-2-insert-black"></span>

### 2. Insertion Case 1: black uncle and trinode restructuring

When `s` is black or missing, the three positions `x, y, z` have sorted keys `a < b < c`. A **trinode restructuring** puts middle key `b` above the other two and colors `b` black, `a` and `c` red. This preserves the black depth of paths through that part of the tree.

The shape can be straight or bent. Use a small subset of tile sides:

```text
straight path:           bent path:             same repaired tree:

    8B                      8B                       12B
      \                       \                      /   \
      12R                     14R                   8R   14R
        \                     /
        14R                 12R
```

In the straight path, insert `14` beneath existing `8B → 12R`. In the bent path, insert `12` beneath existing `8B → 14R`. Both have a missing black uncle and finish as `12B` with red children `8R` and `14R`. The final three-tile area is `8² + 12² + 14² = 64 + 144 + 196 = 404 cm²`. The color case depends on the **uncle**, while the restructuring routine handles either shape.

<span id="part-2-insert-red"></span>

### 3. Insertion Case 2: red uncle and recoloring

When `s` is red, color both `y` and `s` black and color their black parent `z` red. If `z` is the root, keep it black. No rotation is needed at this level. A newly red `z` may now touch a red parent, so repeat the double-red check upward.

From the full seven-tile starting tree, insert `16 → (256, 1)` as the right child of `14R`. Its parent `14R` is red, and the uncle `10R` is red. Recolor `10` and `14` black and `12` red:

```text
before insertion:                 after inserting 16 and recoloring:

          8B                                  8B
        /    \                              /    \
      4B      12B                         4B      12R
     /  \     /   \                       /  \     /   \
   2R   6R  10R  14R                    2R   6R  10B  14B
                                                      \
                                                      16R
```

The root `8B` is black, no red parent has a red child, and all terminal nodes still have black depth `2`. The new square adds `16² = 256 cm²`, so the one-tile total becomes `560 + 256 = 816 cm²`.

This recoloring corresponds to a **valid** (2,4)-tree split: merging its red links gives root `[8 | 12]` with child boxes `[2 | 4 | 6]`, `[10]`, and `[14 | 16]`. Section 11.5's particular four-key split promoted `14` and produced a **different valid grouping**. The two algorithms preserve the same ordered keys and balance rules without requiring an identical shape.

<span id="part-2-delete"></span>

### 4. Delete an entry and identify the physical removal

Deletion begins like ordinary binary search tree deletion. If the requested position has two children, replace its **key-value entry** with its predecessor's entry from the left subtree, then physically remove that predecessor position. The colors stay with the **positions** during the entry swap.

In the seven-tile tree, deleting root key `8` uses predecessor `6R`. The root position receives `6 → (36, 1)`, and the old `8 → (64, 1)` entry is removed at the red leaf. The new root is `6B`; left child `4B` has `2R` on its left, and right child `12B` still has `10R, 14R`. No color repair is needed because the physically removed position was red. The one-tile area is `560 − 8² = 496 cm²`.

There are two other easy outcomes:

| Physical removal | Repair | Tile example |
| :--------------- | :----- | :----------- |
| Red leaf | Remove it; black depths stay the same. | Removing `2R` from the original tree leaves `560 − 4 = 556 cm²`. |
| Black node with one child | Its child must be a red leaf; promote and color that child black. | From `8B` with right child `12R`, delete `8` and make `12B` the root. |

<span id="part-2-deficit"></span>

### 5. Recognize a missing black level

The hard case is physically removing a **nonroot black leaf**. Its former side now has one fewer black position than its sibling's side. Call the parent `z`, the lighter child side the **deficit**, and the other child `y` the **heavy sibling**. “Double black” is a useful temporary accounting phrase for the deficit; it is not a permanent third node color.

For example, root `8B` with black leaf children `4B` and `12B` is valid: both leaves have black depth `2`. Removing `4B` leaves the right side with an extra black position. The repair examines sibling `12B` and, if needed, its children.

The book gives three cases. Cases 1 and 2 finish or move the deficit upward; Case 3 changes a red sibling into a black-sibling situation before applying one of the others.

<span id="part-2-delete-transfer"></span>

### 6. Deletion Case 1: black sibling with a red child

If heavy sibling `y` is black and has a red child `x`, restructure `x, y, z`. With sorted positions `a < b < c`, color `a` and `c` black and give `b` the former color of `z`. The deficit disappears. This corresponds to a **transfer** in the associated (2,4) tree.

Use sides `4, 8, 12, 14`:

```text
before deleting 4:             after deleting 4 and restructuring:

         8B                                 12B
        /  \                               /   \
      4B    12B                           8B   14B
               \
               14R
```

The removed black leaf `4B` creates a deficit to the left of `8B`. Sibling `12B` has red child `14R`, so middle key `12` rises; `8` and `14` become black children. The black depth of the remaining leaves is `2`. Area changes from `4² + 8² + 12² + 14² = 420 cm²` to `8² + 12² + 14² = 404 cm²`.

<span id="part-2-delete-fusion"></span>

### 7. Deletion Case 2: black sibling without a red child

If `y` is black and has no red child, color `y` red. If `z` was red, color `z` black and finish. If `z` was black, the deficit moves up to `z`'s parent. A root absorbs the final deficit. This is the red-black form of a (2,4)-tree **fusion**.

Use the three-tile subset from Section 11.5's fusion example:

```text
before deleting 4:              after recoloring at the root:

         8B                               8B
        /  \                                \
      4B    12B                             12R
```

Removing `4B` leaves sibling `12B` black with no red child. Recolor `12` red; the black root absorbs the deficit. Both terminal nodes, `8B` with one child and leaf `12R`, now have black depth `1`. The remaining tile area is `8² + 12² = 64 + 144 = 208 cm²`, down from `224 cm²`. Merging the red link gives (2,4) root `[8 | 12]`, exactly the fusion result.

<span id="part-2-delete-red"></span>

### 8. Deletion Case 3: red sibling

If the heavy sibling `y` is red, parent `z` must be black. Rotate `y` above `z`, color `y` black and `z` red, and keep the deficit at `z`. Its new sibling is black, so Case 1 or Case 2 can finish the repair.

A five-size tile subset shows both steps. Begin with `8B`, black left leaf `4B`, and red right child `12R` whose children are `10B` and `14B`. Delete `4B`. Rotate `12` above `8` and exchange their colors; the deficit is now left of `8R`, whose black sibling `10B` has no red child. Apply Case 2, coloring `10R` and `8B`:

```text
before deleting 4:                final tree:

          8B                          12B
         /  \                        /   \
       4B   12R                    8B     14B
           /   \                     \
         10B   14B                   10R
```

The final terminal black depth is `2`. The tile subset loses only the 4 cm tile: `4² + 8² + 10² + 12² + 14² = 520 cm²` before and `520 − 16 = 504 cm²` after.

<span id="part-2-costs"></span>

### 9. Count recolorings and structural repairs

The tree height is `O(log n)`, so finding an entry and walking upward through repairs takes `O(log n)`. **Proposition 11.10** gives insertion `O(log n)` time, with at most `O(log n)` recolorings and **one trinode restructuring**. **Proposition 11.11** gives deletion `O(log n)` time, with at most `O(log n)` recolorings and **two restructuring operations**: a red-sibling rotation followed, if needed, by a trinode restructuring.

A trinode restructuring can use one or two primitive rotations depending on its shape. Thus “one or two restructuring operations” counts repair events, not individual pointer rotations. Searches take `O(log n)` worst-case time and do not trigger color repairs. Ordered first/last and neighbor queries also take `O(log n)` time; reporting `s` entries in a range takes `O(log n + s)`, matching the bounds for AVL and (2,4) trees.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 11.6.2 Python Implementation

<span id="part-3-node"></span>

### 1. Store one color bit and test missing children

The book's `RedBlackTreeMap` subclasses `TreeMap`. Its nested node class adds one Boolean field, `_red`, and a newly created node starts red; the root is changed to black. The position still stores the same key-value entry, such as `14 → (196, 1)`.

| Helper | Purpose |
| :----- | :------ |
| `_set_red(p)`, `_set_black(p)`, `_set_color(p, make_red)` | Change the color at a position. |
| `_is_red(p)` | Test a position; a missing child `None` counts as black for this test. |
| `_is_red_leaf(p)` | Recognize a red position with no children. |
| `_get_red_child(p)` | Return a red left or right child if one exists. |

The `None` test is how the linked implementation handles an absent uncle or sibling child without storing an explicit colored external node. The physical area in a value is unrelated to the `_red` flag.

<span id="part-3-hooks"></span>

### 2. Connect insertion and deletion hooks

`TreeMap` supplies the search, ordinary BST update, rotation, and trinode-restructuring machinery. The red-black subclass uses the update hooks:

| Hook or routine | What it does |
| :-------------- | :----------- |
| `_rebalance_insert(p)` → `_resolve_red(p)` | Make a new root black; otherwise repair a double red with a black-uncle restructuring or a red-uncle recoloring. |
| `_rebalance_delete(p)` | Receive the **parent of the physically removed position** and determine whether color repair is needed. |
| `_fix_deficit(z, y)` | Repair a lighter child side using heavy sibling `y` and the three deletion cases. |

The deletion hook uses the parent's **number of children after removal** to infer what happened. If it has no child, a red leaf was removed and no further work is needed. If it has one child, the code checks whether that child is a red leaf; otherwise it repairs a black deficit using that child as heavy sibling. If it has two children, a red child of a removed black node was promoted, so that red child is recolored black. The special one-entry tree case makes the surviving root black; an empty tree has no root to recolor.

The repair routine examines whether `y` is black with a red child, black without one, or red. It calls inherited `_restructure` for the first case and `_rotate` for the red-sibling conversion. Color changes and rotations never alter the tile's stored side or area.

<span id="part-3-client"></span>

### 3. Use the sorted map interface

Assuming the textbook's supporting `TreeMap` and `RedBlackTreeMap` classes are defined, a caller uses the same key-value map operations as in earlier sections. `RedBlackTreeMap` is a textbook class, not a Python built-in.

```python
catalog = RedBlackTreeMap()
for side in (8, 4, 12, 2, 6, 10, 14):
    catalog[side] = (side * side, 1)

print(catalog[12])    # (144, 1)
catalog[16] = (256, 1)
print(list(catalog))  # [2, 4, 6, 8, 10, 12, 14, 16]
```

The insertion order in this client example need not create the exact coloring drawn in the background. The drawing is a valid snapshot for tracing repairs. Every valid coloring answers the same geometry lookups and iterates over the same sorted keys.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Read colors without changing a tile's area</strong></summary>

**Scenario:** Use the seven-key colored tree from the background and look up side `14`.

**Problem:** Color suffixes add information to a binary search tree but must not change the side-to-area mapping.

**Fix:** Follow ordinary comparisons `8B → 12B → 14R`. Count black ancestors separately: `8B` and `12B` give terminal `14R` black depth `2`.

**Result:** The lookup returns `(196, 1)` because `14² = 196 cm²`. No color changes, and the seven one-tile areas remain 560 cm².

</details>

<details>
<summary><strong>Case Study 2: A black uncle repairs both path shapes</strong></summary>

**Scenario:** Work with a small tile subset. Either start with `8B → 12R` and insert `14` on the right, or start with `8B → 14R` and insert `12` on the left.

**Problem:** In either path, a newly red position has a red parent and a missing black uncle.

**Fix:** Trinode-restructure the sorted sides `8 < 12 < 14`. Make middle side `12` black root and outer sides `8` and `14` red children.

**Result:** Both paths end in the same valid colored tree. The three one-tile areas total `64 + 144 + 196 = 404 cm²`; no measurement changes during rotations.

</details>

<details>
<summary><strong>Case Study 3: Add 16 cm when the uncle is red</strong></summary>

**Scenario:** Reset the full seven-tile tree and attach new red key `16` to red parent `14R`.

**Problem:** `14R → 16R` is double red. Uncle `10R` is also red.

**Fix:** Recolor `10` and `14` black and their parent `12` red. Its parent `8B` is black, so the repair stops.

**Result:** The black depth of terminal nodes remains `2`, and the new tile raises one-tile area from `560` to `560 + 16² = 816 cm²`. The resulting (2,4) grouping is valid even though it differs from the specific split drawn in Section 11.5.

</details>

<details>
<summary><strong>Case Study 4: Two deletions that need little color work</strong></summary>

**Scenario:** Consider two independent snapshots: the original seven-key tree, and a small tree `8B` with only right child `12R`.

**Problem:** Deleting a key does not always create a missing black level.

**Fix:** In the full tree, delete internal key `8` by moving predecessor entry `6 → (36, 1)` to its root position and physically removing the red predecessor position. In the small tree, delete black root `8` and recolor its promoted red child `12` black.

**Result:** The first catalog has six keys and one-tile area `560 − 64 = 496 cm²`. The small catalog keeps only a 12 cm tile of area `144 cm²`. Both final trees meet the color and depth rules.

</details>

<details>
<summary><strong>Case Study 5: A black sibling lends through restructuring</strong></summary>

**Scenario:** Start with `8B`, left black leaf `4B`, and right black sibling `12B` with red right child `14R`.

**Problem:** Deleting black leaf `4B` leaves the left side short by one black position.

**Fix:** Use deletion Case 1: restructure keys `8, 12, 14`. Put `12B` at root with `8B` and `14B` as children.

**Result:** The remaining terminal nodes have black depth `2`. Removing the 4 cm square changes area from `420` to `420 − 16 = 404 cm²`.

</details>

<details>
<summary><strong>Case Study 6: A black sibling with no red child leads to fusion</strong></summary>

**Scenario:** Begin with the three-tile tree `8B` and black children `4B` and `12B`.

**Problem:** Delete `4B`. Sibling `12B` has no red child to support a transfer.

**Fix:** Use deletion Case 2: recolor `12` red; root `8B` absorbs the deficit. In the equivalent (2,4) tree, `8` and `12` fuse into one box.

**Result:** Root `8B` and red leaf `12R` both have black depth `1`. The two remaining tile areas total `64 + 144 = 208 cm²` instead of `224 cm²`.

</details>

<details>
<summary><strong>Case Study 7: Rotate a red sibling before finishing</strong></summary>

**Scenario:** Use sides `4, 8, 10, 12, 14` as `8B` with left `4B` and right `12R`; `12R` has black children `10B` and `14B`.

**Problem:** Deleting `4B` creates a deficit beside a **red** sibling `12R`.

**Fix:** Use deletion Case 3: rotate `12` above `8`, making `12B` and `8R`. Then apply Case 2 at `8`: recolor `10R` and `8B`.

**Result:** The final tree has root `12B`, left `8B` with right `10R`, and right `14B`. All terminal black depths are `2`. Area changes from `520` to `520 − 4² = 504 cm²`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 11.6 idea | Plain-language meaning | Square-tile example |
| :---------------- | :--------------------- | :------------------ |
| **Red-black rules** | Keep the root black, forbid red-red edges, and equalize terminal black depths. | `8B` is root; the four red leaves have black depth `2`. |
| **(2,4) correspondence** | Merge each red position into its black parent. | `4B` with `2R, 6R` becomes `[2 | 4 | 6]`. |
| **Height bound** | The longest binary path has `O(log n)` edges. | Seven entries have `h = 2` in the starting coloring. |
| **New entry** | Insert red so existing black depths stay unchanged. | Add `16R` below `14R`. |
| **Black uncle** | Trinode-restructure and color the middle key black. | Both `8, 12, 14` path shapes end with `12B` root. |
| **Red uncle** | Recolor parent and uncle black; check upward. | Adding `16` recolors `10, 14` black and `12` red. |
| **Easy deletion** | Removing red, or promoting a red child as black, needs no deficit walk. | Deleting `8` physically removes predecessor position `6R`. |
| **Black sibling with red child** | Restructure to transfer black depth toward the light side. | Deleting `4B` from the four-key subset makes `12B` root. |
| **Black sibling with no red child** | Recolor and possibly move the deficit upward. | Three-tile deletion leaves `8B` with red child `12R`. |
| **Red sibling** | Rotate to expose a black sibling, then finish the repair. | Five-tile deletion makes `12B` root. |
| **Worst-case cost** | Searches and updates use a logarithmic path; recoloring can follow that path. | Search, insert, and delete are each `O(log n)`. |

[🔝 Back to Top](#top)
