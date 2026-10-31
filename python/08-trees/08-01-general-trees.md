<span id="top"></span>

# 8.1 General Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 8, Section 8.1, printed pages 300–310 (the supplied PDF).<br>
> **Topic:** 8.1 General Trees; 8.1.1 Tree Definitions and Properties; 8.1.2 The Tree Abstract Data Type; 8.1.3 Computing Depth and Height.<br>
> **Domain Focus:** A 12 cm × 8 cm board divided into nested rectangles; area, depth, and height.<br>
> **User Prompt:** Reexplain [`Section 8.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rectangle Board](#background)
   - [1. Start with a rectangle](#background-board)
   - [2. Record how the board is divided](#background-tree)
2. [Part 1: 8.1 General Trees](#part-1)
   - [1. From a line of items to a hierarchy](#part-1-hierarchy)
   - [2. Read our region tree](#part-1-picture)
3. [Part 2: 8.1.1 Tree Definitions and Properties](#part-2)
   - [1. Root, parent, child, edge, and path](#part-2-basic)
   - [2. Siblings, ancestors, descendants, and subtrees](#part-2-relatives)
   - [3. Internal positions, leaves, and ordered children](#part-2-kinds)
4. [Part 3: 8.1.2 The Tree Abstract Data Type](#part-3)
   - [1. Positions and their elements](#part-3-positions)
   - [2. Ask the tree about its structure](#part-3-operations)
   - [3. Build simple queries from basic operations](#part-3-derived)
5. [Part 4: 8.1.3 Computing Depth and Height](#part-4)
   - [1. Depth counts edges from the root](#part-4-depth)
   - [2. Height counts edges down to a farthest leaf](#part-4-height)
   - [3. Compute height without repeating paths](#part-4-efficiency)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rectangle Board

<span id="background-board"></span>

### 1. Start with a rectangle

Imagine drawing a plan for a **12 cm × 8 cm** display board. Its area is `12 × 8 = 96 cm²`. Divide it into three vertical strips, from left to right:

| Region | Width × height | Area |
| :--- | :--- | ---: |
| `A` | 3 cm × 8 cm | 24 cm² |
| `B` | 4 cm × 8 cm | 32 cm² |
| `C` | 5 cm × 8 cm | 40 cm² |

The widths add to `3 + 4 + 5 = 12 cm`, and the areas add to `24 + 32 + 40 = 96 cm²`. Next, divide `B` into `B1` (4 × 3) above `B2` (4 × 5); divide `B2` into `B2a` (1 × 5) beside `B2b` (3 × 5). Divide `C` into `C1` (5 × 2), `C2` (5 × 2), and `C3` (5 × 4), from top to bottom. Every child region is wholly inside its parent, and a parent's children cover it without overlap.

<span id="background-tree"></span>

### 2. Record how the board is divided

The arrows in this plan mean **“was divided into,”** not “touches on the drawing.” The resulting hierarchy is a **tree**:

```text
Board (12×8, 96 cm²)
├── A (3×8, 24 cm²)
├── B (4×8, 32 cm²)
│   ├── B1 (4×3, 12 cm²)
│   └── B2 (4×5, 20 cm²)
│       ├── B2a (1×5, 5 cm²)
│       └── B2b (3×5, 15 cm²)
└── C (5×8, 40 cm²)
    ├── C1 (5×2, 10 cm²)
    ├── C2 (5×2, 10 cm²)
    └── C3 (5×4, 20 cm²)
```

`Board` is the whole shape. `B` is one part of it; `B2` is one part of `B`; `B2a` is one part of `B2`. The hierarchy keeps **how parts were made**. A flat list of the final rectangles would lose that information. We will use this same plan throughout Section 8.1.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 8.1 General Trees

<span id="part-1-hierarchy"></span>

### 1. From a line of items to a hierarchy

In a sequence, items have a before-and-after order. In a hierarchy, one item can lead to **several** items. The book uses family relationships to introduce words such as parent, child, ancestor, and descendant; it also points to file systems, graphical interfaces, databases, and websites as places where hierarchies appear.

A **general tree** permits any number of children at a position, including zero. Our `Board` and `C` each have **three** children. A binary tree, discussed in Section 8.2, has a stricter limit; no binary-tree rule is needed for this board.

<span id="part-1-picture"></span>

### 2. Read our region tree

Start at `Board`, then follow branches down to the region you want. To reach `B2b`, follow:

```text
Board → B → B2 → B2b
```

This tells us that `B2b` belongs to `B2`, which belongs to `B`, which belongs to the board. It does **not** tell us that `B2b` is geometrically adjacent to every region on the path. The edges record the subdivision relationship.

> **Mental model:** A tree records one starting point and nested branches. In this example, each branch goes from a region to one of its direct pieces.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 8.1.1 Tree Definitions and Properties

<span id="part-2-basic"></span>

### 1. Root, parent, child, edge, and path

A tree may be **empty**. In a nonempty tree, one position is the **root**. The root has no parent. Every other position has **exactly one parent** and may have zero or more children. You can also define a tree recursively: a root with zero or more smaller trees attached below it.

| Term | Meaning | Board example |
| :--- | :--- | :--- |
| **Root** | The starting position, with no parent. | `Board` |
| **Parent / child** | One direct step in the hierarchy. | `B2` is the parent of `B2a`; `B2a` is its child. |
| **Edge** | A connection between a parent and one child. | `B2`—`B2a` is one edge. |
| **Path** | Positions connected by consecutive edges. | `Board → B → B2 → B2a` has three edges. |

Although `Board` contains `B2a`, it is **not** `B2a`'s parent. The parent is only the next position directly above it, `B2`.

<span id="part-2-relatives"></span>

### 2. Siblings, ancestors, descendants, and subtrees

| Term | Meaning | Board example |
| :--- | :--- | :--- |
| **Siblings** | Positions with the same parent. | `B1` and `B2` are siblings. |
| **Ancestor** | A position itself or one reached by repeatedly moving to its parent. | `B2a`, `B2`, `B`, and `Board` are ancestors of `B2a`. |
| **Proper ancestor** | An ancestor other than the position itself. | `B2`, `B`, and `Board` are proper ancestors of `B2a`. |
| **Descendant** | A position itself or one below it. | `B2a` and `B2b` are descendants of `B`. |
| **Subtree at a position** | That position and all its descendants. | The subtree at `B` has `B`, `B1`, `B2`, `B2a`, and `B2b`. |

The book's use of **ancestor** includes the position itself; **proper ancestor** excludes it. The same distinction applies to descendant and proper descendant. For example, `B1` is not a descendant of `B2`, even though both are inside `B`.

<span id="part-2-kinds"></span>

### 3. Internal positions, leaves, and ordered children

An **external position**, also called a **leaf**, has no children. An **internal position** has at least one child. Here the internal positions are `Board`, `B`, `B2`, and `C`; the seven leaves are `A`, `B1`, `B2a`, `B2b`, `C1`, `C2`, and `C3`. The leaves are the final rectangles after every planned cut.

The book connects these terms to other hierarchies:

| Book example | How its tree works | Board connection |
| :--- | :--- | :--- |
| File and directory hierarchy | In the pictured example, directories with contents are internal; regular files are leaves. | A divided region is internal; a final rectangle is a leaf. |
| Python exception classes | The pictured single-inheritance links go from a base class to its subclasses. | Every region except `Board` has one direct parent. |
| Structured book | Chapters and sections have a meaningful order. | We can choose an order for the board's regions. |

Some trees also give each parent's children a meaningful **order**. We chose left-to-right order for `Board` (`A`, `B`, `C`) and for `B2` (`B2a`, `B2b`). We chose top-to-bottom order for `B` (`B1`, `B2`) and `C` (`C1`, `C2`, `C3`). This makes our example an **ordered tree**. In an unordered tree, drawing two children in a particular left-to-right arrangement does not make that order part of the data.

The book illustrates that difference with a structured book, where chapter and section order matters, versus hierarchies where siblings need not have an inherent order. The board's order is a decision in **our model**, not a rule every tree must follow.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 8.1.2 The Tree Abstract Data Type

<span id="part-3-positions"></span>

### 1. Positions and their elements

The **tree abstract data type (ADT)** describes what we can ask about the hierarchy without fixing how it is stored in memory. A **position** identifies a place in the tree; its **element** is the data stored there. For our model, a position such as `C1` can hold its label and measurements `(5 cm, 2 cm)`.

Two positions can hold equal measurements and still be different positions. `C1` and `C2` are both 5 × 2 cm and both have area 10 cm², but they occupy separate places in the tree. Thus comparing areas is not the same as comparing positions.

The book's abstract `Position` interface provides `element()` and ways to compare whether two positions are the same (`==` and `!=`). A concrete tree implementation supplies the actual position representation and equality test. This lets the general `Tree` class share methods that depend only on the tree operations, even when different implementations store their nodes differently.

<span id="part-3-operations"></span>

### 2. Ask the tree about its structure

The book writes `T` for a tree and `p` for one of its positions. The main operations have these meanings:

| Operation | What it returns | Board example |
| :--- | :--- | :--- |
| `p.element()` | The data stored at `p`. | `B2a`'s label and 1 × 5 cm measurements. |
| `T.root()` | The root, or `None` if empty. | `Board` |
| `T.parent(p)` | The parent, or `None` at the root. | `T.parent(B2b)` is `B2`. |
| `T.num_children(p)` | Number of direct children. | `T.num_children(C)` is `3`. |
| `T.children(p)` | An iteration over direct children. | `B1`, then `B2` for ordered `B`. |
| `T.is_root(p)` | Whether `p` is the root. | True for `Board`. |
| `T.is_leaf(p)` | Whether `p` has no children. | True for `A`, false for `B`. |
| `len(T)` / `T.is_empty()` | Number of positions / whether it is zero. | `len(T)` is `11`; `T.is_empty()` is false. |
| `T.positions()` | An iteration over positions. | Includes all 11 regions. |
| `iter(T)` | An iteration over stored elements. | Yields the regions' data, not their positions. |

`T.children(p)` yields no positions when `p` is a leaf. In an ordered tree, it follows the defined child order. The overall iteration order of `T.positions()` and `iter(T)` is a separate choice developed with traversal algorithms in Section 8.4. A position from the wrong tree or an otherwise invalid position should raise `ValueError` when passed to a position-taking operation.

<span id="part-3-derived"></span>

### 3. Build simple queries from basic operations

The book's abstract `Tree` class requires five structural methods from an implementation: `root`, `parent`, `num_children`, `children`, and `__len__`. The following useful questions can then be answered from those methods:

```python
def is_root(self, p):
    return self.root() == p

def is_leaf(self, p):
    return self.num_children(p) == 0

def is_empty(self):
    return len(self) == 0
```

For example, `C` is internal because `num_children(C) == 3`, while `C3` is a leaf because `num_children(C3) == 0`. These methods describe **behavior**; they do not require us to choose a particular node or array representation yet.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 8.1.3 Computing Depth and Height

<span id="part-4-depth"></span>

### 1. Depth counts edges from the root

The **depth** of `p` is its number of **proper ancestors**, equivalently the number of edges from the root to `p`. The root's depth is `0`. Every other position is one level deeper than its parent:

```text
depth(root) = 0
depth(p) = 1 + depth(parent(p))       when p is not the root
```

Using the Tree ADT, the calculation can be written:

```python
def depth(T, p):
    if T.is_root(p):
        return 0
    return 1 + depth(T, T.parent(p))
```

For `B2a`, the calls climb `B2a → B2 → B → Board`, then return `0 + 1 + 1 + 1 = 3`. Assuming the root check and parent lookup each take constant time, this costs **O(depth(p) + 1)**, at worst **O(n)** for an `n`-position tree.

<span id="part-4-height"></span>

### 2. Height counts edges down to a farthest leaf

The **height** of `p` is the greatest number of edges from `p` down to a leaf in its subtree. A leaf has height `0`. An internal position must look at all its children and take the **largest** child height:

```text
height(leaf) = 0
height(p) = 1 + max(height(c) for each child c of p)
```

| Position | Depth | Height | Why |
| :--- | ---: | ---: | :--- |
| `Board` | 0 | 3 | The longest downward path ends at `B2a` or `B2b`. |
| `A` | 1 | 0 | It has no children. |
| `B` | 1 | 2 | `1 + max(height(B1), height(B2)) = 1 + max(0, 1)`. |
| `B2` | 2 | 1 | Its children are leaves. |
| `B2a` | 3 | 0 | It is a leaf. |
| `C` | 1 | 1 | `C1`, `C2`, and `C3` are leaves. |

The **height of a nonempty tree** is the height of its root. It is also the greatest depth of any leaf (the book's Proposition 8.4), so our board tree has height `3`. The longest root-to-leaf path contains **four positions but three edges**; depth and height count edges, not positions.

Notice the difference between two calculations on the *same* tree. Because our rectangles partition their parents, `area(Board) = 24 + 32 + 40 = 96 cm²`. Height instead follows the longest branch: `height(Board) = 1 + max(0, 2, 1) = 3`. Adding the child heights would give the wrong height.

<span id="part-4-efficiency"></span>

### 3. Compute height without repeating paths

One way to find tree height is to compute the depth of every leaf and take the maximum. That gives the right answer, but `depth` repeatedly walks shared paths back to the root. In a worst-case tree with many leaves at increasing depths, the repeated work can total **O(n²)**.

Instead, start at the leaves and let each parent reuse its children's heights:

```python
def height_from(T, p):
    if T.is_leaf(p):
        return 0
    return 1 + max(height_from(T, child) for child in T.children(p))

# For a nonempty tree, its height is height_from(T, T.root()).
```

The board calculation flows upward: `height(B2a) = height(B2b) = 0`, so `height(B2) = 1`; then `height(B) = 2`, `height(C) = 1`, and finally `height(Board) = 3`. The recursion visits each position in the chosen subtree once. For a whole tree with `n` positions it takes **O(n)** time, assuming the leaf check takes constant time and iteration over a position's `c_p` children takes **O(c_p + 1)** time.

The book's public `T.height(p=None)` method uses the root when `p` is omitted, so `T.height()` gives the height of the entire tree. Passing a position asks for the height of its subtree: `T.height(B) = 2` and `T.height(B2a) = 0`. These calls assume a nonempty tree when no position is supplied.

Why does visiting all children still cost O(n)? The `+ 1` includes the small fixed cost at a leaf. Each nonroot position appears **once** as somebody's child, so the total number of children is `n − 1` (the book's Proposition 8.5). On our board, the four internal positions have `3 + 2 + 2 + 3 = 10` children altogether, matching `11 − 1 = 10` edges. This is the counting fact behind the book's linear-time height result. Height is defined here for a **nonempty** tree; an empty tree has no root or leaf from which to measure it.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Are touching rectangles necessarily siblings?</strong></summary>

**Scenario:** `B1` and `C1` touch along part of the border between strips `B` and `C`.

**Test:** Check whether the two regions have the same parent.

**Result:** They are not siblings. `parent(B1) = B`, while `parent(C1) = C`. Tree edges describe subdivision, not which rectangles touch.

</details>

<details>
<summary><strong>Case Study 2: Which areas add to the board's area?</strong></summary>

**Scenario:** We want to check the 96 cm² area using the final cut pieces.

**Calculation:** The leaf areas add to `24 + 12 + 5 + 15 + 10 + 10 + 20 = 96 cm²`. We can also add just the board's direct children: `24 + 32 + 40 = 96 cm²`.

**Pitfall:** Adding the area stored at *every* tree position counts the same physical space again at each subdivision level. The tree contains regions and their smaller parts, not 11 separate pieces to lay side by side.

</details>

<details>
<summary><strong>Case Study 3: Why are depth and height different?</strong></summary>

**Scenario:** Compare `B2a`, `B2`, and `Board`.

**Calculation:** `B2a` is three edges below the root, so its depth is `3`; it is a leaf, so its height is `0`. `B2` has depth `2` and height `1`. `Board` has depth `0` and height `3`.

**Rule:** Depth looks **up** toward the root. Height looks **down** toward the farthest leaf. Neither one is a measurement in centimetres.

</details>

<details>
<summary><strong>Case Study 4: Why compute height from the bottom up?</strong></summary>

**Scenario:** Keep cutting a remaining rectangle into one finished strip and one smaller rectangle to cut again. The resulting tree has leaves at successively greater depths.

**Problem:** Finding each leaf's depth independently retraces the same upper branches many times; over a long chain of cuts, the total work can grow quadratically.

**Fix:** Compute each finished strip's height as `0`, then calculate each remaining rectangle's height once from its children. The work grows linearly with the number of tree positions.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 8.1 idea | Plain-language meaning | Rectangle-board example |
| :--- | :--- | :--- |
| **General tree** | A root with positions that may have any number of children. | `Board` and `C` each have three children. |
| **Parent / child** | One direct subdivision step. | `B2` is the parent of `B2a`. |
| **Ancestor / subtree** | A position above another / a position with everything below it. | `B` is an ancestor of `B2a`; its subtree has five positions. |
| **Leaf / internal position** | A final position / one with children. | `B2a` is a leaf; `B2` is internal. |
| **Ordered tree** | Each parent's children have a defined sequence. | `A`, `B`, `C` are ordered left to right. |
| **Tree ADT** | Operations for asking about positions and relationships. | `num_children(C) = 3`; `parent(B2b) = B2`. |
| **Depth** | Number of edges from the root. | `depth(B2a) = 3`. |
| **Height** | Longest number of edges down to a leaf. | `height(Board) = 3`; `height(B2a) = 0`. |
| **Efficient height calculation** | Reuse children's heights, visiting each position once. | `height(Board) = 1 + max(0, 2, 1) = 3`. |

[🔝 Back to Top](#top)
