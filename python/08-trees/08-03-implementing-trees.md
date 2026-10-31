<span id="top"></span>

# 8.3 Implementing Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 8, Section 8.3, printed pages 317–327 (the supplied PDF).<br>
> **Topic:** 8.3 Implementing Trees; 8.3.1 Linked Structure for Binary Trees; 8.3.2 Array-Based Representation of a Binary Tree; 8.3.3 Linked Structure for General Trees.<br>
> **Domain Focus:** A 12 cm × 8 cm board divided into rectangles; linked nodes, array indices, and area-preserving cuts.<br>
> **User Prompt:** Reexplain [`Section 8.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Store a Cut Plan](#background)
   - [1. Reuse the rectangle board](#background-board)
   - [2. Separate the tree from its storage](#background-storage)
2. [Part 1: 8.3 Implementing Trees](#part-1)
   - [1. Fill in the abstract operations](#part-1-abstract)
   - [2. Choose what a position means](#part-1-position)
3. [Part 2: 8.3.1 Linked Structure for Binary Trees](#part-2)
   - [1. Store one node and wrap it in a position](#part-2-node)
   - [2. Validate positions and navigate](#part-2-access)
   - [3. Build and attach a complete cut plan](#part-2-build)
   - [4. Replace, delete, and check the costs](#part-2-edit)
4. [Part 3: 8.3.2 Array-Based Representation of a Binary Tree](#part-3)
   - [1. Give each potential position an index](#part-3-formulas)
   - [2. Map our board into an array](#part-3-map)
   - [3. See where array space and editing time go](#part-3-cost)
5. [Part 4: 8.3.3 Linked Structure for General Trees](#part-4)
   - [1. Replace two child fields with a child list](#part-4-list)
   - [2. Revisit the three-strip board](#part-4-board)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Store a Cut Plan

<span id="background-board"></span>

### 1. Reuse the rectangle board

In Section 8.2, we cut a **12 cm × 8 cm** board into two pieces at a time. Every rectangle is 8 cm tall. The five final strips have widths `2`, `3`, `4`, `1`, and `2` cm, so their areas are `16`, `24`, `32`, `8`, and `16 cm²`. They add to the board's `96 cm²`.

```text
Board (96 cm²)
├── left:  L (40 cm²)
│   ├── left:  LL (16 cm²)
│   └── right: LR (24 cm²)
└── right: R (56 cm²)
    ├── left:  RL (32 cm²)
    └── right: RR (24 cm²)
        ├── left:  RRL (8 cm²)
        └── right: RRR (16 cm²)
```

The cuts occur at horizontal coordinates `x = 5`, `2`, `9`, and `10` cm, respectively. For example, `RR` spans `x = 9` to `x = 12`, so its area is `(12 − 9) × 8 = 24 cm²`. We can store a region's data as `(name, left_x, right_x, height)`, such as `("RR", 9, 12, 8)`. A region's **element** is this data; its **position** is its place in the tree.

<span id="background-storage"></span>

### 2. Separate the tree from its storage

The diagram says that `R` is the parent of `RR` and `RR` is the parent of `RRL`. A program still needs a way to store and retrieve those relationships. Section 8.3 compares three choices:

| Representation | How it remembers children | Geometry meaning |
| :--- | :--- | :--- |
| Linked binary tree | Each node points to its parent, left child, and right child. | The `RR` node points to `R`, `RRL`, and `RRR`. |
| Array-based binary tree | A position's index determines possible parent and child indices. | `RR` occupies index `6`; its children occupy `13` and `14`. |
| Linked general tree | Each node has a collection of child references. | One board region can be divided into three or more pieces. |

All three can describe a tree, but they use different memory and have different editing costs. The geometry gives us a concrete way to check whether each stored relationship is correct.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 8.3 Implementing Trees

<span id="part-1-abstract"></span>

### 1. Fill in the abstract operations

Sections 8.1 and 8.2 described what a tree should **do**: return its root, a position's parent and children, and so on. Their abstract `Tree` and `BinaryTree` classes cannot by themselves hold our board regions. At the `Tree` level, implementations must supply `root`, `parent`, `num_children`, `children`, and `__len__`; `BinaryTree` adds `left` and `right` and derives `children` from them. `LinkedBinaryTree` implements the remaining methods with linked storage, while inherited methods provide behavior such as `sibling`.

The Tree and BinaryTree abstract data types specify **access** operations, not a universal way to change every tree. Section 8.3 discusses useful edits for a linked tree, but its implementation gives them leading underscores, such as `_add_left` and `_delete`. Those are **nonpublic** methods so an application-specific subclass can decide which changes make sense. For our board, a structurally valid edit may still break the physical area partition; the tree class does not check rectangle arithmetic.

<span id="part-1-position"></span>

### 2. Choose what a position means

A position is a handle to a place, not just the element stored there. This matters because `LL` and `RRR` both have area `16 cm²` but occupy different places. It also matters when an element changes: renaming `RR` does not change its parent or children.

In the linked implementation, a public **Position** wraps a node together with the tree that owns it. In the array representation, an integer index can identify a position, provided the indexed slot actually contains a node. We will follow the same nine-position board through both implementations.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 8.3.1 Linked Structure for Binary Trees

<span id="part-2-node"></span>

### 1. Store one node and wrap it in a position

The book's linked binary node has four fields: `_element`, `_parent`, `_left`, and `_right` (Figure 8.11 and Code Fragment 8.8). A missing parent or child is stored as `None`. The tree object itself keeps `_root` and `_size`. In our finished board, `_size = 9` and `_root` points to the `Board` node.

| Node | `_element` | `_parent` | `_left` | `_right` |
| :--- | :--- | :--- | :--- | :--- |
| `Board` | `("Board", 0, 12, 8)` | `None` | `L` | `R` |
| `R` | `("R", 5, 12, 8)` | `Board` | `RL` | `RR` |
| `RR` | `("RR", 9, 12, 8)` | `R` | `RRL` | `RRR` |
| `RRL` | `("RRL", 9, 10, 8)` | `RR` | `None` | `None` |

The node is an internal storage object. A Position for `RR` carries two references: `_container → T` and `_node → RR node`. The wrapper exposes `element()` and position equality without making clients work directly with raw node pointers. Two Position wrappers can denote the same node and therefore compare equal.

<span id="part-2-access"></span>

### 2. Validate positions and navigate

Before following a position's node links, `LinkedBinaryTree` runs `_validate(p)`. It rejects an object that is not its Position type with `TypeError`, a position owned by a different tree with `ValueError`, and a deleted position with `ValueError`. Deletion marks a node as deprecated by setting its parent reference to itself. The helper `_make_position(node)` returns a Position for a real node and `None` when `node` is `None`.

Once a position is valid, navigation is direct, as in Code Fragment 8.9:

| Query | Link followed | Board result |
| :--- | :--- | :--- |
| `T.root()` | Tree's `_root` | `Board` |
| `T.parent(rr)` | `RR._parent` | `R` |
| `T.left(rr)` | `RR._left` | `RRL` |
| `T.right(rr)` | `RR._right` | `RRR` |
| `T.num_children(rr)` | Count non-`None` child links | `2` |
| `len(T)` | Tree's `_size` | `9` |

The `sibling` and `children` behavior from `BinaryTree` uses these links; the linked class does not need a separate traversal to answer them. The simple queries in this table take **O(1)** time.

<span id="part-2-build"></span>

### 3. Build and attach a complete cut plan

The book implements six nonpublic updates in Code Fragments 8.10–8.11. Their preconditions and results are important:

| Update | Required condition | Result |
| :--- | :--- | :--- |
| `T._add_root(e)` | `T` is empty. | Create the root; return its Position. |
| `T._add_left(p,e)` / `T._add_right(p,e)` | The chosen child slot is empty. | Create that child; return its Position. |
| `T._replace(p,e)` | `p` is valid. | Change its element; return the old element. |
| `T._delete(p)` | `p` has at most one child. | Remove `p`, promote its child if present, and return its old element. |
| `T._attach(p,t1,t2)` | `p` is a leaf; all three trees have the same concrete type. | Attach the donor roots as left and right children, then empty `t1` and `t2`. |

An occupied side or a second root raises `ValueError`; deleting a two-child position also raises `ValueError`. `_attach` rejects a nonleaf with `ValueError` and mismatched tree types with `TypeError`. Position-taking updates still validate that their position belongs to the receiving tree. Use **two distinct donor trees**, both different from `T`: the book's `_attach` code checks their types but does not guard against passing the same tree twice or passing `T` as a donor.

Here is a **method-call sketch** using the textbook's `LinkedBinaryTree` class after its definition. It starts with seven positions, leaving `RR` unsplit, then attaches two one-position donor trees:

```python
T = LinkedBinaryTree()
board = T._add_root(("Board", 0, 12, 8))
left = T._add_left(board, ("L", 0, 5, 8))
right = T._add_right(board, ("R", 5, 12, 8))
T._add_left(left, ("LL", 0, 2, 8))
T._add_right(left, ("LR", 2, 5, 8))
T._add_left(right, ("RL", 5, 9, 8))
rr = T._add_right(right, ("RR", 9, 12, 8))

t1 = LinkedBinaryTree()
t1._add_root(("RRL", 9, 10, 8))
t2 = LinkedBinaryTree()
t2._add_root(("RRR", 10, 12, 8))
T._attach(rr, t1, t2)
```

Before attachment, `len(T) = 7` and the leaf areas are `16 + 24 + 32 + 24 = 96 cm²`. After attachment, `len(T) = 9`, and `RR`'s two child areas add to its area: `8 + 16 = 24 cm²`. Both donor tree objects become empty. Earlier donor Positions still retain their old container references and should not be reused; obtain fresh recipient-tree Positions with `T.left(rr)` and `T.right(rr)`.

<span id="part-2-edit"></span>

### 4. Replace, delete, and check the costs

`T._replace(rr, ("RR revised", 9, 12, 8))` returns the old element `("RR", 9, 12, 8)`. The node remains in the same position, and its area stays `24 cm²`. Changing the coordinates instead could make the stored areas disagree even though the tree links remain valid.

`T._delete(p)` can remove a leaf or a position with one child; it reconnects that child to the deleted position's parent. It cannot remove `R` or `RR` from our completed tree because both have two children. After a successful deletion, an old Position for the removed node is invalid. On a **separate edit copy**, removing leaf `RL` makes `R` a one-child position; deleting `R` then promotes `RR` under `Board`. The `Board` node's `_right` link changes from `R` to `RR`, and the `RR` node's `_parent` link changes from `R` to `Board`. That edited tree no longer represents all 96 cm², because the 32 cm² `RL` piece was removed. A generic tree edit changes the structure; it does not redraw the board.

The book's Table 8.1 gives linked storage **O(n)** space. Its basic accessors and all six updates take **O(1)** time; `depth(p)` takes **O(depth(p) + 1)**, while computing the whole tree's height takes **O(n)**. For our nine-position board, the links follow exactly the nine regions, with no placeholders for missing branches.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 8.3.2 Array-Based Representation of a Binary Tree

<span id="part-3-formulas"></span>

### 1. Give each potential position an index

An array representation can use the position of an entry in a Python-list-like array instead of stored parent and child pointers (Figures 8.12–8.13). The book numbers the **possible** slots level by level, starting at zero. For a position at index `i`:

```text
root index          = 0
left child index    = 2i + 1
right child index   = 2i + 2
parent index        = (i − 1) // 2       for i > 0
```

The formula gives a *possible* slot; a child exists only if that slot is occupied. For `RR` at index `6`, its possible left and right indices are `2 × 6 + 1 = 13` and `2 × 6 + 2 = 14`. For `RRR` at index `14`, its parent index is `(14 − 1) // 2 = 6`.

<span id="part-3-map"></span>

### 2. Map our board into an array

| Index | Region | Reason |
| ---: | :--- | :--- |
| 0 | `Board` | Root |
| 1, 2 | `L`, `R` | Left and right of index 0 |
| 3, 4 | `LL`, `LR` | Left and right of index 1 |
| 5, 6 | `RL`, `RR` | Left and right of index 2 |
| 7–12 | Empty | The three leaves at indices 3, 4, and 5 have no children. |
| 13, 14 | `RRL`, `RRR` | Left and right of index 6 |

There are **nine real positions**, but the largest occupied index is `14`, so the array needs **15 slots**, numbered `0` through `14`: its length is `1 +` the largest occupied index. Six slots (`7` through `12`) are holes. The 8 cm² strip `RRL` is at index `13`; its index is about its location in the tree, not its area. Section 8.3 sketches this representation but leaves a complete array-tree class to an exercise.

<span id="part-3-cost"></span>

### 3. See where array space and editing time go

An array is compact when every slot before the final entry is occupied, as in the complete shapes used for heaps. For a sparse shape, it must leave room for missing earlier slots. A four-position chain using **only right children** occupies indices `0, 2, 6, 14`, needing 15 slots. With `n` positions in such a chain, the last index is `2^n − 2`, so the required array length is `2^n − 1`: far more space than the `n` linked nodes.

An edit can also force index changes. On the separate edit copy from Part 2, after deleting `RL`, removing its one-child parent `R` promotes `RR` under `Board`. In a linked tree, a few references change. In an array representation, `RR` moves from index `6` to `2`, and `RRL` and `RRR` move from `13` and `14` to `5` and `6`. A large promoted subtree can require **O(n)** moves. The book treats this as a representation tradeoff, not as a finished array implementation.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 8.3.3 Linked Structure for General Trees

<span id="part-4-list"></span>

### 1. Replace two child fields with a child list

A general tree may have any number of children. Its linked node therefore stores an element, a parent reference, and **one list or other collection of child references** instead of fixed `_left` and `_right` fields (Figure 8.14). A child list can preserve a meaningful order when the tree is ordered. The book sketches this structure rather than giving a full general-tree class.

For a position with `c_p` children, iterating the list takes **O(c_p + 1)** time, including the small fixed cost for an empty list. Table 8.2 gives **O(1)** for simple size/root/parent/root-or-leaf tests, **O(depth(p) + 1)** for depth, **O(n)** for whole-tree height, and **O(n)** total space. Each nonroot position occupies one parent's child list, so a whole-tree walk examines `n − 1` child entries in total. In a Python list, `len(children)` can also answer the number of children in constant time.

<span id="part-4-board"></span>

### 2. Revisit the three-strip board

The Section 8.1 version of the same 12 × 8 cm board had **three** direct strips: `A` was 3 × 8 cm, `B` was 4 × 8 cm, and `C` was 5 × 8 cm. Their areas check the whole board: `24 + 32 + 40 = 96 cm²`. Conceptually, its child lists are:

```text
Board.children → [A, B, C]
Board          → 12×8, 96 cm²
A              → 3×8, 24 cm²
B              → 4×8, 32 cm²
C              → 5×8, 40 cm²
```

Here `num_children(Board) = 3`. Further down the same general tree, `B.children = [B1, B2]` with areas `12 + 20 = 32 cm²`, and `C.children = [C1, C2, C3]` with areas `10 + 10 + 20 = 40 cm²`. Two fixed child fields cannot directly hold the three-way splits, while one child list can. The **tree relationship** is still parent-to-child, just as it was in the binary board; only the representation of a node's children changes.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Can the board have a second left child?</strong></summary>

**Scenario:** `Board` already has `L` as its left child. A new cut-plan step tries `T._add_left(board, ("New", 0, 1, 8))`.

**Result:** `_add_left` raises `ValueError` because the left slot is occupied. The new 1 × 8 cm strip would need a new subdivision under an existing region, not another child in the same left slot.

</details>

<details>
<summary><strong>Case Study 2: Can an internal region be removed?</strong></summary>

**Scenario:** Try `T._delete(rr)` on the completed board tree. `RR` has both `RRL` and `RRR` below it.

**Result:** The linked method raises `ValueError` for a two-child position. If a separate draft tree had only one child under `RR`, deletion could promote that child; its old Position would become invalid. Any such edit would also need a new geometry check before calling the plan a complete partition.

</details>

<details>
<summary><strong>Case Study 3: What happens when two cut subtrees are attached?</strong></summary>

**Scenario:** A seven-position plan leaves `RR` as one 3 × 8 cm final strip. Two one-position donor trees describe 1 × 8 cm and 2 × 8 cm pieces.

**Calculation:** `_attach(rr, t1, t2)` changes the plan from `7` to `7 + 1 + 1 = 9` positions. The new child areas are `8 + 16 = 24 cm²`, equal to `RR`'s area. The donor tree objects are emptied, and the two new children can be reached through `T.left(rr)` and `T.right(rr)`.

</details>

<details>
<summary><strong>Case Study 4: Why does the array have empty slots?</strong></summary>

**Scenario:** `RR` has children but `LL`, `LR`, and `RL` do not.

**Calculation:** The numbering rule places `RR` at `6` and its children at `13` and `14`; the possible child slots `7` through `12` remain empty. Thus the same nine rectangles occupy 15 array slots. Linked storage needs nodes only for the nine actual rectangles.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 8.3 idea | Plain-language meaning | Rectangle-board example |
| :--- | :--- | :--- |
| **Concrete tree** | Supplies storage and the abstract navigation methods. | `LinkedBinaryTree` stores nine board regions. |
| **Linked node** | Holds an element plus parent and child references. | `RR` points to `R`, `RRL`, and `RRR`. |
| **Position wrapper** | Identifies a node within its owning tree. | An `RR` Position refers to `RR`'s node, not merely 24 cm². |
| **Linked updates** | Add, replace, delete, or attach nodes under stated conditions. | Attach 8 and 16 cm² pieces under 24 cm² `RR`. |
| **Array indices** | Compute child and parent slots by arithmetic. | `RR` at `6` has children at `13` and `14`. |
| **Sparse-array cost** | Missing positions can leave unused slots. | Nine regions require 15 slots in this layout. |
| **General-tree child list** | Holds as many child references as needed. | `Board.children = [A, B, C]` for a three-strip split. |

[🔝 Back to Top](#top)
