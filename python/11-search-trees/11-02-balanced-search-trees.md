<span id="top"></span>

# 11.2 Balanced Search Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 11, Section 11.2, printed pages 475–480 ([supplied Chapter 11 PDF](<../Data Structures and Algorithms in Python - C11.pdf>)).<br>
> **Topic:** 11.2 Balanced Search Trees; rotations and trinode restructuring; 11.2.1 Python Framework for Balancing Search Trees, including its rebalancing hooks, rotation helpers, and node factory.<br>
> **Domain Focus:** The square-tile catalog from [Section 11.1](11-01-binary-search-trees.md): side lengths as keys, `(area, stock)` as values, and tree shapes that change without changing the tiles.<br>
> **User Prompt:** Reexplain Section 11.2 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Same Tiles, Two Tree Shapes](#background)
   - [1. Recall the square-tile catalog](#background-catalog)
   - [2. Compare a short tree with a chain](#background-shapes)
2. [Part 1: 11.2 Balanced Search Trees](#part-1)
   - [1. Why change a tree's shape?](#part-1-goal)
   - [2. A single rotation changes local links](#part-1-rotation)
   - [3. Move the middle subtree to keep keys ordered](#part-1-transfer)
   - [4. Restructure three positions](#part-1-trinode)
   - [5. Handle the four straight and bent cases](#part-1-cases)
3. [Part 2: 11.2.1 Python Framework for Balancing Search Trees](#part-2)
   - [1. Hooks for Rebalancing Operations](#part-2-hooks)
   - [2. Nonpublic Methods for Rotating and Restructuring](#part-2-methods)
   - [3. Factory for Creating Tree Nodes](#part-2-factory)
4. [Part 3: Simple Geometry Study Cases](#part-3)
5. [Part 4: Summary](#part-4)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Same Tiles, Two Tree Shapes

<span id="background-catalog"></span>

### 1. Recall the square-tile catalog

In [Section 11.1](11-01-binary-search-trees.md), the class stored square tiles in a map. Each **key** is a tile's side length in centimetres. Its **value** is `(area of one tile, number in stock)`. For a square, `area = side × side`. We return to the original seven-size catalog, with one tile of each size, before the later insertions and deletions in that guide.

| Side key | 2 cm | 4 cm | 6 cm | 8 cm | 10 cm | 12 cm | 14 cm |
| :------- | ---: | ---: | ---: | ---: | ----: | ----: | ----: |
| Area of one tile | 4 cm² | 16 cm² | 36 cm² | 64 cm² | 100 cm² | 144 cm² | 196 cm² |

The seven tiles have a combined area of `4 + 16 + 36 + 64 + 100 + 144 + 196 = 560 cm²`. A tree can change its **links** without changing any side length, area, stock count, or total area.

<span id="background-shapes"></span>

### 2. Compare a short tree with a chain

Inserting the same seven keys in different orders creates different ordinary binary search trees (BSTs):

```text
Order 8, 4, 12, 2, 6, 10, 14:      Order 2, 4, 6, 8, 10, 12, 14:

          8                            2
        /   \                           \
       4     12                          4
      / \   /  \                          \
     2   6 10   14                         6
                                           \
                                            8
                                             \
                                              10
                                                \
                                                 12
                                                   \
                                                    14
```

Both trees yield the same sorted keys `2, 4, 6, 8, 10, 12, 14` by inorder traversal. Their **heights** differ: the left tree has two edges on its longest root-to-leaf path; the chain has six. A lookup for the 14 cm tile follows `8 → 12 → 14` in the short tree, but visits all seven positions in the chain.

Section 11.2 introduces local operations that can change such paths while preserving the BST ordering rule. Later sections use those operations within particular balancing strategies.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 11.2 Balanced Search Trees

<span id="part-1-goal"></span>

### 1. Why change a tree's shape?

A BST search, insertion, or deletion follows a path whose length depends on tree height `h`, so one operation can take `O(h)` time. If a tree becomes a chain of `n` keys, `h = n − 1` and a lookup can take `O(n)`. A short tree has height on the order of `log n` and gives much shorter paths.

Randomly ordered updates can give an ordinary BST good **expected** height, but its worst-case shape is still a chain. The chapter goes on to develop AVL, splay, (2,4), and red-black search trees, which use different rules and guarantees. Here the book first explains the local link changes and a Python framework that later classes can use.

> **Mental model:** A rotation rearranges where positions sit in the tree. It keeps every tile's side key paired with its area and stock value, and it keeps the keys in sorted order.

<span id="part-1-rotation"></span>

### 2. A single rotation changes local links

Consider just three available tile sizes: 2, 4, and 6 cm. Their one-tile areas are 4, 16, and 36 cm². Suppose they form this rightward chain:

```text
Before:             After lifting 4 above 2:

2                       4
 \                     / \
  4                   2   6
   \
    6
```

This is a **left rotation at `2`**: its right child `4` moves above it, and `2` becomes the left child of `4`. The local height falls from two edges to one. The inorder key list is `2, 4, 6` both before and after, and the three tile areas still add to `4 + 16 + 36 = 56 cm²`.

A **right rotation** is the mirror operation: a left child moves above its parent. Rotations change only a constant number of parent and child links, so one rotation takes `O(1)` time in the linked-tree implementation. The rotation itself does not decide **when** a tree needs repair.

<span id="part-1-transfer"></span>

### 3. Move the middle subtree to keep keys ordered

When the promoted child has a subtree between its key and its parent's key, that subtree must move. Use six sizes from the same tile workshop, now including a 7 cm tile:

```text
Before right rotation:       After lifting 6 above 8:

       8                             6
      / \                           / \
     6  10                         4   8
    / \                           /   / \
   4   7                         2   7  10
  /
 2
```

Before the rotation, `7` is in the **right subtree of `6`**. After `6` rises, `7` becomes the **left subtree of `8`**. This is required by `6 < 7 < 8`; leaving `7` under the wrong link would break the BST rule.

The inorder keys remain `2, 4, 6, 7, 8, 10`. With one of each tile, their areas still total `4 + 16 + 36 + 49 + 64 + 100 = 269 cm²`. Here the subtree rooted at `4` moves one level shallower, `7` stays at the same depth, and `10` moves one level deeper. The overall height falls from three edges to two. A rotation chosen elsewhere could increase height, so a balancing policy must choose the location.

<span id="part-1-trinode"></span>

### 4. Restructure three positions

A **trinode restructuring** considers a position `x`, its parent `y`, and its grandparent `z`. Put their keys in increasing order and call them `a < b < c`. The restructuring makes the middle key `b` the root of this local subtree, with `a` on its left and `c` on its right:

```text
              b
            /   \
           a     c
          / \   / \
         T1 T2 T3 T4
```

The four hanging subtrees also stay in order: every key in `T1` is below `a`; keys in `T2` lie between `a` and `b`; keys in `T3` lie between `b` and `c`; and keys in `T4` are above `c`. The book's Figure 11.9 shows the same four regions. Reattaching their **roots** preserves all their internal entries, no matter how many tiles they contain.

For our simple three-size example, `a = 2`, `b = 4`, and `c = 6`; the hanging subtrees are empty. No area or stock value changes when the three positions move.

<span id="part-1-cases"></span>

### 5. Handle the four straight and bent cases

The path from `z` to `y` to `x` can turn left or right at each step. The table names each shape and the local repair. “Rotate `p`” means lift position `p` above its parent.

| Path from `z` to `x` | Tile keys `(z, y, x)` | Local repair | New local root |
| :----------------- | :-------------------- | :----------- | :------------- |
| Left–left | `(6, 4, 2)` | Rotate `4` above `6` once. | `4` |
| Right–right | `(2, 4, 6)` | Rotate `4` above `2` once. | `4` |
| Left–right | `(6, 2, 4)` | Rotate `4` above `2`, then above `6`. | `4` |
| Right–left | `(2, 6, 4)` | Rotate `4` above `6`, then above `2`. | `4` |

The left–left and right–right paths are **straight**: one rotation of `y` is enough. The left–right and right–left paths **bend**: two rotations of `x` are needed. In every case the final key order is `2, 4, 6`, the middle key `4` becomes local root, and the one-tile areas remain `4, 16, 36 cm²`.

For example, the right–left case takes these two steps:

```text
Start:          Rotate 4 above 6:     Rotate 4 above 2:

  2                  2                      4
   \                  \                    / \
    6                  4                  2   6
   /                    \
  4                      6
```

Each case uses at most two `O(1)` rotations. This makes restructuring a constant-time **local** operation; finding the place to restructure still follows a search or update path.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 11.2.1 Python Framework for Balancing Search Trees

The book's `TreeMap` inherits from `LinkedBinaryTree` and `MapBase`. The later `AVLTreeMap`, `SplayTreeMap`, and `RedBlackTreeMap` classes inherit from `TreeMap`. This subsection supplies points where a specialized tree can react to a change, plus the pointer operations that implement rotations. `TreeMap` remains usable as a basic BST when those reaction points do nothing.

<span id="part-2-hooks"></span>

### 1. Hooks for Rebalancing Operations

A **hook** is a method that the normal map operation calls at a useful moment. The basic `TreeMap` versions simply return without changing the tree; a later subclass can override them.

| Hook | When it is called | Tile-catalog example |
| :--- | :--------------- | :------------------- |
| `_rebalance_insert(p)` | After a **new** position `p` is added as a leaf. | Add a new side length `7` cm. |
| `_rebalance_delete(p)` | After a position is physically removed; `p` is its former parent, or `None` if the removed position was root. | Remove the entry for a tile size. |
| `_rebalance_access(p)` | After a tree position is accessed, including an existing key's value update. | Read side `6`, or change its stock from 1 to 3. |

Changing `6 → (36, 1)` to `6 → (36, 3)` changes a **value**, not the number of positions; it uses the access hook rather than the new-leaf hook. A missing-key search can also leave the last visited position for a subclass to consider. Section 11.2 defines the framework; the later sections choose what each hook should do.

<span id="part-2-methods"></span>

### 2. Nonpublic Methods for Rotating and Restructuring

The book adds three helpers to `TreeMap`. They work with positions and their underlying linked nodes, not with area formulas.

| Helper | Its job | Why it matters |
| :----- | :------ | :------------- |
| `_relink(parent, child, make_left_child)` | Set one child link of `parent` and, if `child` exists, set `child`'s parent link. | Keeps both directions consistent, including when the child is `None`. |
| `_rotate(p)` | Lift `p` above its parent; reconnect the old grandparent or replace the root; transfer the middle subtree. | Performs the single rotation shown with tile keys `6`, `7`, and `8`. |
| `_restructure(x)` | Inspect `x`, its parent, and grandparent; choose one or two rotations and return the new local root. | Turns any of the four tabled `2, 4, 6` cases into the same ordered shape. |

The choice inside `_restructure(x)` can be read as this short plan:

```text
If x and its parent lean the same way from their parents:
    lift the parent once; the parent becomes the new local root.
Otherwise:
    lift x twice; x becomes the new local root.
```

For the right–left example, `x = 4`, `y = 6`, and `z = 2`. The path bends, so the second branch lifts `4` twice. For the right–right chain, `x = 6`, `y = 4`, and `z = 2`; the first branch lifts `4` once. The helpers each change only a fixed number of links, so their local work is `O(1)`.

<span id="part-2-factory"></span>

### 3. Factory for Creating Tree Nodes

The linked binary tree creates a new node through `self._Node`. A subclass can provide its own `_Node` class, and inherited insertion code will then create that subclass's node. This is a small **factory**: the insertion method asks for the node type through the current tree object instead of hard-coding one node class.

Why is this useful? A specialized tree may need extra information on each position to decide whether or how to repair its shape. It can store that information in its node class while keeping the ordinary key–value entry intact. For our tiles, the key remains a side length and the value remains `(area, stock)`; any balancing metadata belongs to the implementation, not to the tile's geometry.

Those subclasses' actual balancing rules belong to Sections 11.3, 11.4, and 11.6.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Shorten a three-size search path</strong></summary>

**Scenario:** The 2, 4, and 6 cm square tiles form a rightward chain. Searching for side `6` visits all three positions.

**Problem:** The local height is two edges even though three positions can form a tree of height one edge.

**Fix:** Rotate right child `4` above parent `2`. The local tree becomes root `4`, with `2` left and `6` right.

**Result:** A search for `6` now visits `4 → 6`. The inorder sides stay `2, 4, 6`; the one-tile areas remain `4, 16, 36 cm²`, totaling 56 cm².

</details>

<details>
<summary><strong>Case Study 2: Do not lose a middle tile during rotation</strong></summary>

**Scenario:** In the six-size snapshot, side `7` is the right child of `6`, and `6` is the left child of `8`.

**Problem:** Lifting `6` above `8` without moving `7` would put that 7 cm key under the wrong branch or disconnect it.

**Fix:** Move the subtree rooted at `7` into the left-child slot of `8` while `6` takes the higher position.

**Result:** The ordered sides remain `2, 4, 6, 7, 8, 10`, and the one-tile areas still sum to 269 cm². The local height changes from three edges to two.

</details>

<details>
<summary><strong>Case Study 3: Straighten a bent three-position path</strong></summary>

**Scenario:** The tile keys form `2 → right 6 → left 4`. A lookup for side `4` takes three position checks.

**Problem:** One rotation of the parent `6` above `2` would not place the middle key `4` at the local root.

**Fix:** Rotate `4` above `6`, then rotate `4` above `2`.

**Result:** The local tree becomes `4` with children `2` and `6`. Side `4` maps to 16 cm² throughout; the sorted key list and the three one-tile areas stay unchanged.

</details>

<details>
<summary><strong>Case Study 4: A stock change uses a different hook from a new size</strong></summary>

**Scenario:** Starting again from the original seven-size catalog, the workshop receives two more 6 cm tiles, then introduces a new 7 cm size.

**Problem:** The first action changes an existing entry; the second adds a new tree position.

**Fix:** Update side `6` from `(36, 1)` to `(36, 3)`, which reaches the access hook. Insert `7 → (49, 1)`, which reaches the insertion hook for its new leaf.

**Result:** The three 6 cm tiles have total area `3 × 36 = 108 cm²`; the 7 cm tile has area 49 cm². The basic `TreeMap` hooks do not rotate anything by themselves.

</details>

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Summary

| Section 11.2 idea | Plain-language meaning | Square-tile example |
| :---------------- | :--------------------- | :------------------ |
| **Shape matters** | The same map entries can have short or long search paths. | Seven sizes form a height-2 tree or a height-6 chain. |
| **Rotation** | Lift a child above its parent and repair the nearby links. | Lift `4` above `2` in a `2 → 4 → 6` chain. |
| **Middle subtree** | A subtree between the two rotating keys must switch sides. | Move side `7` under `8` when `6` rises above `8`. |
| **Trinode restructuring** | Put the middle of three ordered keys at the local root. | Any `2, 4, 6` case ends with `4` above `2` and `6`. |
| **One or two rotations** | Straight paths take one; bent paths take two. | Right–left `2 → 6 → 4` lifts `4` twice. |
| **Hooks** | Give a subclass places to respond to insertion, deletion, or access. | Adding size `7` calls the insertion hook. |
| **Node factory** | Let a subclass create nodes with extra bookkeeping data. | Tile keys and `(area, stock)` values stay the same. |
| **Time** | A rotation or trinode restructuring changes a fixed number of links. | Each local operation is `O(1)`; finding its position still takes a path. |

[🔝 Back to Top](#top)
