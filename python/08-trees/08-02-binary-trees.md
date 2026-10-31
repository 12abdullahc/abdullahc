<span id="top"></span>

# 8.2 Binary Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 8, Section 8.2, printed pages 311–316 (the supplied PDF).<br>
> **Topic:** 8.2 Binary Trees; 8.2.1 The Binary Tree Abstract Data Type; 8.2.2 Properties of Binary Trees.<br>
> **Domain Focus:** A 12 cm × 8 cm board cut into pairs of vertical rectangles; area, point location, and tree counts.<br>
> **User Prompt:** Reexplain [`Section 8.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Cutting a Board in Two](#background)
   - [1. Make a sequence of two-piece cuts](#background-cuts)
   - [2. Draw the cut history as a tree](#background-tree)
2. [Part 1: 8.2 Binary Trees](#part-1)
   - [1. A left child and a right child](#part-1-definition)
   - [2. Proper and improper binary trees](#part-1-proper)
   - [3. Recursive subtrees and the book's examples](#part-1-recursive)
3. [Part 2: 8.2.1 The Binary Tree Abstract Data Type](#part-2)
   - [1. The extra navigation operations](#part-2-operations)
   - [2. How sibling and children work](#part-2-derived)
4. [Part 3: 8.2.2 Properties of Binary Trees](#part-3)
   - [1. Count positions by depth](#part-3-levels)
   - [2. Bound the size and height](#part-3-bounds)
   - [3. Count leaves in a proper tree](#part-3-leaves)
5. [Part 4: Two More Views of the Same Geometry](#part-4)
   - [1. An expression tree adds the final areas](#part-4-expression)
   - [2. A decision tree locates a point](#part-4-decision)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Cutting a Board in Two

<span id="background-cuts"></span>

### 1. Make a sequence of two-piece cuts

Start with a fresh **12 cm × 8 cm** rectangular board, as in the Section 8.1 guide. Its area is `12 × 8 = 96 cm²`. Measure `x` from the board's left edge. Every cut is vertical and makes **two** smaller rectangles:

| Cut | Rectangle being cut | Left piece | Right piece | Area check |
| :--- | :--- | :--- | :--- | :--- |
| `x = 5` | `Board`, 12 × 8 | `L`, 5 × 8 | `R`, 7 × 8 | `40 + 56 = 96 cm²` |
| `x = 2` | `L`, 5 × 8 | `LL`, 2 × 8 | `LR`, 3 × 8 | `16 + 24 = 40 cm²` |
| `x = 9` | `R`, 7 × 8 | `RL`, 4 × 8 | `RR`, 3 × 8 | `32 + 24 = 56 cm²` |
| `x = 10` | `RR`, 3 × 8 | `RRL`, 1 × 8 | `RRR`, 2 × 8 | `8 + 16 = 24 cm²` |

All widths and heights are in centimetres. For example, `RR` runs from `x = 9` to `x = 12`, so its width is `12 − 9 = 3 cm` and its area is `3 × 8 = 24 cm²`.

<span id="background-tree"></span>

### 2. Draw the cut history as a tree

Connect each rectangle to the two pieces made by its next cut:

```text
Board (12×8, 96 cm²)
├── left:  L (5×8, 40 cm²)
│   ├── left:  LL (2×8, 16 cm²)
│   └── right: LR (3×8, 24 cm²)
└── right: R (7×8, 56 cm²)
    ├── left:  RL (4×8, 32 cm²)
    └── right: RR (3×8, 24 cm²)
        ├── left:  RRL (1×8, 8 cm²)
        └── right: RRR (2×8, 16 cm²)
```

The five final pieces are `LL`, `LR`, `RL`, `RRL`, and `RRR`. Their areas add to `16 + 24 + 32 + 8 + 16 = 96 cm²`. The other positions represent larger rectangles **before** further cuts, so adding the areas at every position would count the same board space several times.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 8.2 Binary Trees

<span id="part-1-definition"></span>

### 1. A left child and a right child

A **binary tree** is an ordered tree in which each position has at most two children. One child, if present, is designated **left**; the other, if present, is designated **right**. Left comes before right when we list the children. The two roles are distinct even when a position has only one child: it may have a left child with no right child, or a right child with no left child.

Our cuts make the roles literal: the physical piece on the left is the left child, and the piece on the right is the right child. For example, `left(R) = RL` and `right(R) = RR`. The **left subtree of `R`** begins at `RL`; the **right subtree of `R`** begins at `RR` and includes `RRL` and `RRR`.

> **Mental model:** A binary position has two named child slots. Either slot may be empty; the names identify the slots, not just the order in which we drew branches.

<span id="part-1-proper"></span>

### 2. Proper and improper binary trees

A binary tree is **proper** (also called **full** by some authors) when every position has either **zero or two** children. If any position has exactly one child, the tree is **improper**. The board tree is proper: `Board`, `L`, `R`, and `RR` each have two children; every other position has none.

“Proper” does **not** mean every possible position at every depth is occupied. Our tree has height `3`, but only two positions at depth `3`, even though that depth could hold up to eight. A single-child tree is still a binary tree; it simply fails the proper-tree condition.

<span id="part-1-recursive"></span>

### 3. Recursive subtrees and the book's examples

The recursive definition says a binary tree is either **empty**, or it has a root with a left binary subtree and a right binary subtree. Either subtree may be empty. In our plan, `RR` is the root of a small binary subtree with leaves `RRL` and `RRR`. `LL` has two empty child subtrees.

The book uses two other kinds of binary tree. A **decision tree** puts a yes/no question at each internal position and an outcome at each leaf. An **expression tree** puts a two-input arithmetic operator at each internal position and a number or variable at each leaf. We will turn our board into both kinds of example in Part 4.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 8.2.1 The Binary Tree Abstract Data Type

<span id="part-2-operations"></span>

### 1. The extra navigation operations

The binary-tree abstract data type keeps the general-tree operations from Section 8.1, such as `root`, `parent`, `num_children`, and `is_leaf`. It adds explicit navigation to the two child slots. Here `T` is the board tree and a name such as `RR` denotes one of its positions:

| Operation | Meaning | Board result |
| :--- | :--- | :--- |
| `T.left(p)` | Left child, or `None` if absent. | `T.left(RR) = RRL`; `T.left(RRL) = None`. |
| `T.right(p)` | Right child, or `None` if absent. | `T.right(RR) = RRR`. |
| `T.sibling(p)` | The other child of the same parent, or `None` if none. | `T.sibling(RRL) = RRR`; `T.sibling(Board) = None`. |
| `T.children(p)` | The existing children, left before right. | `T.children(R)`: `RL`, then `RR`. |
| `T.num_children(p)` | How many child slots are occupied: 0, 1, or 2. | `T.num_children(R) = 2`; `T.num_children(RRL) = 0`. |

These operations talk about **positions**, not their area values. `LL` and `RRR` both store 16 cm², yet they are different positions with different parents and siblings.

<span id="part-2-derived"></span>

### 2. How sibling and children work

The book's abstract `BinaryTree` class inherits `Tree` and its `Position` interface. A concrete implementation must supply `left`, `right`, and the remaining abstract `Tree` operations. The `sibling` operation can then use `left`, `right`, and `parent`; `children` yields a present left child first, then a present right child. These small sketches assume `T` already implements the tree operations:

```python
def sibling(T, p):
    parent = T.parent(p)
    if parent is None:
        return None
    if p == T.left(parent):
        return T.right(parent)
    return T.left(parent)

def children(T, p):
    left = T.left(p)
    right = T.right(p)
    if left is not None:
        yield left
    if right is not None:
        yield right
```

For `RRL`, its parent is `RR`, and it matches `left(RR)`, so `sibling(RRL)` returns `right(RR)`, which is `RRR`. At the root there is no parent and no sibling. Section 8.2 specifies these access operations; later sections explain concrete storage and updates.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 8.2.2 Properties of Binary Trees

<span id="part-3-levels"></span>

### 1. Count positions by depth

Let `n` be the number of positions, `n_E` the number of external positions (**leaves**), `n_I` the number of internal positions, and `h` the height of a **nonempty** binary tree. Thus `n = n_E + n_I`. Depth counts edges from the root; height is the greatest root-to-leaf depth.

| Depth `d` | Board positions | Actual count | Maximum `2^d` |
| ---: | :--- | ---: | ---: |
| 0 | `Board` | 1 | 1 |
| 1 | `L`, `R` | 2 | 2 |
| 2 | `LL`, `LR`, `RL`, `RR` | 4 | 4 |
| 3 | `RRL`, `RRR` | 2 | 8 |

Our board has `n = 1 + 2 + 4 + 2 = 9`, `n_I = 4`, `n_E = 5`, and `h = 3`. Each position has at most two children, so depth `d` can hold at most `2^d` positions. Adding the largest possible counts from depth `0` through `h` gives `1 + 2 + ⋯ + 2^h = 2^(h+1) − 1`.

<span id="part-3-bounds"></span>

### 2. Bound the size and height

The book's **Proposition 8.8** collects these limits. The first column applies to every nonempty binary tree; the second gives stronger lower or upper limits when the tree is proper.

| Quantity | Any binary tree | If proper | Our board (`h=3`, `n=9`) |
| :--- | :--- | :--- | :--- |
| All positions `n` | `h+1 ≤ n ≤ 2^(h+1)−1` | `2h+1 ≤ n ≤ 2^(h+1)−1` | `7 ≤ 9 ≤ 15` |
| Leaves `n_E` | `1 ≤ n_E ≤ 2^h` | `h+1 ≤ n_E ≤ 2^h` | `4 ≤ 5 ≤ 8` |
| Internal positions `n_I` | `h ≤ n_I ≤ 2^h−1` | Same bound | `3 ≤ 4 ≤ 7` |
| Height `h` from `n` | `log₂(n+1)−1 ≤ h ≤ n−1` | `log₂(n+1)−1 ≤ h ≤ (n−1)/2` | `log₂(10)−1 ≈ 2.32 ≤ 3 ≤ 4` |

Here `log₂` means **base-two logarithm**: it reverses raising `2` to a power. The longest root-to-leaf path contains `h+1` positions and `h` internal positions. Those facts give the basic lower bounds. The per-depth limit gives the upper bounds on all positions and on internal positions. The leaf limit `n_E ≤ 2^h` needs one more step: each of the root's at most two subtrees has height at most `h−1`, so each can have at most `2^(h−1)` leaves; together they have at most `2^h`. A height-zero tree starts with one leaf, so this argument works upward from the base case. Rearranging `n ≤ 2^(h+1)−1` gives the logarithmic lower bound on `h`.

For a proper tree, each internal position has two children. As the next part shows, that forces `n_E = n_I + 1`. Together with `n_I ≥ h`, it gives `n_E ≥ h+1`, `n ≥ 2h+1`, and `h ≤ (n−1)/2`.

<span id="part-3-leaves"></span>

### 3. Count leaves in a proper tree

The book's **Proposition 8.9** says that a nonempty **proper** binary tree has exactly **one more leaf than internal position**:

```text
n_E = n_I + 1
n = n_E + n_I = 2n_I + 1 = 2n_E − 1
```

Our four cuts created four internal positions and five final strips: `5 = 4 + 1`, and `9 = 2 × 4 + 1`. Each new cut turns one former leaf into an internal position and gives it two new leaf children. The internal count rises by one and the leaf count also rises by one; the original one-position tree started with one leaf and zero internal positions.

The book proves this relationship by repeatedly removing a leaf and its parent and reconnecting the parent's other child. Each removal takes away one leaf and one internal position; at the end, one leaf remains. Another counting explanation uses edges: every nonroot position has one parent edge, so there are `n−1` edges; in a proper tree, two edges leave each internal position, so there are also `2n_I` edges. Hence `n_I + n_E − 1 = 2n_I`, which gives `n_E = n_I + 1`. The relationship need not hold for an improper tree.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Two More Views of the Same Geometry

<span id="part-4-expression"></span>

### 1. An expression tree adds the final areas

The rectangle tree stores regions. We can build a **separate expression tree with the same shape**: put `+` at each cut and put each final strip's area at a leaf. Then read the calculation from the bottom up:

```text
                  + (96)
                 /      \
             + (40)     + (56)
             /    \      /    \
           16     24   32    + (24)
                            /      \
                           8       16
```

The expression is `((16 + 24) + (32 + (8 + 16))) = 96 cm²`. At the `+` corresponding to `RR`, calculate `8 + 16 = 24`; at the `+` corresponding to `R`, calculate `32 + 24 = 56`; at the root, calculate `40 + 56 = 96`. In the book's expression-tree example, internal positions can contain binary operators such as `+`, `−`, `×`, and `/`, while leaves contain numbers or variables. Our area calculation needs only addition because each pair of pieces covers its parent without overlap.

Left and right also determine **operand order**. To find how much more area `R` has than `L`, an expression tree with `−` at its root, left leaf `56`, and right leaf `40` gives `56 − 40 = 16 cm²`. Swapping those children gives `40 − 56 = −16 cm²`. The earlier addition tree would hide this difference because swapping the inputs to `+` does not change a sum.

<span id="part-4-decision"></span>

### 2. A decision tree locates a point

The same cut history can instead be read as a **decision tree**. At each internal position, ask whether the point's `x` coordinate is left of that cut. A **yes** answer takes the left child; a **no** answer takes the right child. The leaves name the final strips.

| Position | Question | Yes → left | No → right |
| :--- | :--- | :--- | :--- |
| `Board` | Is `x < 5`? | `L` | `R` |
| `L` | Is `x < 2`? | `LL` | `LR` |
| `R` | Is `x < 9`? | `RL` | `RR` |
| `RR` | Is `x < 10`? | `RRL` | `RRR` |

For the point `(9.5 cm, 4 cm)`, `9.5 < 5` is false, `9.5 < 9` is false, and `9.5 < 10` is true. Follow `Board → R → RR → RRL`. The point lies in the 1 cm wide strip `RRL`, between `x = 9` and `x = 10`. The book's decision-tree example asks yes/no investment questions; our geometry questions use the same two-branch structure.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What if only the right child is recorded?</strong></summary>

**Scenario:** The cut plan for `RR` records `RRR` as its right child but has not yet recorded `RRL` as its left child.

**Tree rule:** `left(RR) = None` and `right(RR) = RRR`. This is a valid binary tree shape, but it is **improper** because `RR` has only one child. Removing `RRL` from our nine-position tree leaves four internal positions and four leaves, so `n_E = n_I + 1` no longer holds.

**Geometry limit:** The recorded child has area 16 cm² while `RR` has area 24 cm². The missing 8 cm² piece means the *partial plan* no longer represents a complete partition of the board.

</details>

<details>
<summary><strong>Case Study 2: Does proper mean every level is full?</strong></summary>

**Scenario:** Every cut in our board tree has two pieces, so every internal position has two children.

**Check:** The tree is proper, but its depth-3 level has only `RRL` and `RRR`. The upper limit at that depth is `2^3 = 8`. Proper requires two children **where a position is internal**; it does not require all possible positions at the deepest level.

</details>

<details>
<summary><strong>Case Study 3: Are equal-area strips the same position?</strong></summary>

**Scenario:** `LL` and `RRR` each have area `16 cm²`. Also, `LR` and `RR` each have area `24 cm²`.

**Check:** Equal areas do not identify a tree position. `LL` is a leaf under `L`; `RRR` is a leaf under `RR`. `LR` is a leaf, while `RR` is internal. A position is identified by its place in the hierarchy, not just its measurement.

</details>

<details>
<summary><strong>Case Study 4: Which strip contains a point on a cut?</strong></summary>

**Scenario:** A point has `x = 9 cm`, exactly on the cut between `RL` and `RR`.

**Convention:** For point lookup, use `0 ≤ x < 12` and half-open strip intervals: `RL` covers `[5, 9)` and `RR` covers `[9, 12)`. Thus `9 < 9` is false and the decision tree follows the right child to `RR`; then `9 < 10` is true, so it reaches `RRL`.

**Result:** The convention assigns a boundary point to one strip instead of two. It does not change the strips' areas.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 8.2 idea | Plain-language meaning | Rectangle-board example |
| :--- | :--- | :--- |
| **Binary tree** | Each position has a left slot and a right slot, with at most one child in each. | `R` has left child `RL` and right child `RR`. |
| **Proper binary tree** | Every position has zero or two children. | Four cuts yield four internal positions and five leaves. |
| **Recursive subtree** | A root with possibly empty left and right binary subtrees. | `RR` has subtrees rooted at `RRL` and `RRR`. |
| **Binary-tree ADT** | Navigate to left, right, or sibling positions. | `sibling(RRL) = RRR`; `children(R) = (RL, RR)`. |
| **Level bound** | Depth `d` holds at most `2^d` positions. | Depth `3` has `2`, within the limit of `8`. |
| **Size and height bounds** | The number of positions limits possible tree height, and vice versa. | For proper height `3`, `7 ≤ n = 9 ≤ 15`. |
| **Leaf count** | A nonempty proper tree has one more leaf than internal position. | `n_E = 5 = 4 + 1 = n_I + 1`. |
| **Expression / decision trees** | The same shape can store calculations or yes/no questions. | Add leaf areas to get 96 cm²; compare `x` to locate a strip. |

[🔝 Back to Top](#top)
