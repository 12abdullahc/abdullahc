<span id="top"></span>

# 8.4 Tree Traversal Algorithms — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 8, Section 8.4, printed pages 328–347 (the supplied PDF).<br>
> **Topic:** 8.4 Tree Traversal Algorithms; 8.4.1 Preorder and Postorder Traversals of General Trees; 8.4.2 Breadth-First Tree Traversal; 8.4.3 Inorder Traversal of a Binary Tree; 8.4.4 Implementing Tree Traversals in Python; 8.4.5 Applications of Tree Traversals; 8.4.6 Euler Tours and the Template Method Pattern.<br>
> **Domain Focus:** A 12 cm × 8 cm board divided into rectangles; cut order, final areas, cut coordinates, and tree-drawing positions.<br>
> **User Prompt:** Reexplain [`Section 8.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Visit Every Region](#background)
   - [1. Reuse the rectangle tree](#background-board)
   - [2. What does a traversal choose?](#background-traversal)
2. [Part 1: 8.4 Tree Traversal Algorithms](#part-1)
   - [1. Positions, elements, and child order](#part-1-order)
3. [Part 2: 8.4.1 Preorder and Postorder Traversals of General Trees](#part-2)
   - [1. Preorder visits the parent first](#part-2-preorder)
   - [2. Postorder visits the children first](#part-2-postorder)
   - [3. Why both take linear time](#part-2-cost)
4. [Part 3: 8.4.2 Breadth-First Tree Traversal](#part-3)
   - [1. Use a first-in, first-out queue](#part-3-queue)
   - [2. Trace the board's queue](#part-3-trace)
5. [Part 4: 8.4.3 Inorder Traversal of a Binary Tree](#part-4)
   - [1. Visit between left and right](#part-4-inorder)
   - [2. Read cut coordinates with a search tree](#part-4-bst)
   - [3. Read an area expression](#part-4-expression)
6. [Part 5: 8.4.4 Implementing Tree Traversals in Python](#part-5)
   - [1. Yield positions, then elements](#part-5-generators)
   - [2. Know the default iteration order](#part-5-defaults)
7. [Part 6: 8.4.5 Applications of Tree Traversals](#part-6)
   - [1. Print an indented or numbered cut plan](#part-6-outline)
   - [2. Preserve the structure with parentheses](#part-6-parentheses)
   - [3. Calculate final area from the leaves](#part-6-area)
8. [Part 7: 8.4.6 Euler Tours and the Template Method Pattern](#part-7)
   - [1. Walk each edge down and back](#part-7-walk)
   - [2. Customize the previsit and postvisit hooks](#part-7-hooks)
   - [3. Add an in-visit and lay out the tree](#part-7-binary)
9. [Part 8: Simple Geometry Study Cases](#part-8)
10. [Part 9: Summary](#part-9)

---

<span id="background"></span>

## Background & Conceptual Intuition: Visit Every Region

<span id="background-board"></span>

### 1. Reuse the rectangle tree

Sections 8.2 and 8.3 used a **12 cm × 8 cm** board, cut vertically into smaller rectangles. Each parent region is divided into its left and right children:

```text
Board (96 cm²)
├── L (40 cm²)
│   ├── LL (16 cm²)
│   └── LR (24 cm²)
└── R (56 cm²)
    ├── RL (32 cm²)
    └── RR (24 cm²)
        ├── RRL (8 cm²)
        └── RRR (16 cm²)
```

The five final rectangles, or **leaves**, are `LL`, `LR`, `RL`, `RRL`, and `RRR`. Their widths are `2`, `3`, `4`, `1`, and `2 cm`; every height is `8 cm`. Their areas add to `16 + 24 + 32 + 8 + 16 = 96 cm²`. Internal regions already include their descendants, so adding the area at **every** position would count board space repeatedly.

<span id="background-traversal"></span>

### 2. What does a traversal choose?

A **traversal** visits the positions of a tree in a systematic order. The same nine regions can be read as a cut plan, a list by depth, or a calculation from final pieces. The tree's shape does not change; only the **visit order** changes.

| Task | Useful order | Why |
| :--- | :--- | :--- |
| Show a parent region before its pieces. | Preorder | Visit the parent before descending. |
| Compute a parent area from its final pieces. | Postorder | Finish children before their parent. |
| Inspect every depth of the cut plan. | Breadth-first | Visit one level before the next. |
| Place each parent between its left and right parts. | Inorder | Visit left, parent, then right. |

We will use this one board to compare the orders, then connect them to the book's Python generators and Euler tours.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 8.4 Tree Traversal Algorithms

<span id="part-1-order"></span>

### 1. Positions, elements, and child order

Each visit reaches a **position**. Reading `p.element()` then gives the data stored there, such as the rectangle name and dimensions. In our board, a position's element can be `(name, left_x, right_x, height)` as in Section 8.3. Two positions may store the same area: `LL` and `RRR` are both 16 cm², but they are not the same position.

The left child comes before the right child in this binary tree. For a general tree, a chosen child order plays the same role. Preorder, postorder, and breadth-first work with any tree whose children can be iterated. **Inorder needs the separate left and right slots of a binary tree.** If a general tree's children have no defined order, different sibling orders can produce different traversal lists.

> **Mental model:** Traversal is a rule for when to record a region while walking its parent–child links. It does not cut the board again.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 8.4.1 Preorder and Postorder Traversals of General Trees

<span id="part-2-preorder"></span>

### 1. Preorder visits the parent first

**Preorder** records a position, then recursively visits each child subtree in child order (Code Fragment 8.12). On our board:

```text
Board → L → LL → LR → R → RL → RR → RRL → RRR
```

Begin with `Board`. Its left subtree produces `L, LL, LR`; only after that do we enter its right subtree and produce `R, RL, RR, RRL, RRR`. A cut-plan outline uses this order because the containing region appears before the regions it contains.

```text
preorder(p):
    visit p
    for each child c of p, in child order:
        preorder(c)
```

<span id="part-2-postorder"></span>

### 2. Postorder visits the children first

**Postorder** recursively visits every child subtree before recording the parent (Code Fragment 8.13):

```text
LL → LR → L → RL → RRL → RRR → RR → R → Board
```

For `RR`, visit `RRL` and `RRR` first. Their areas are `8` and `16 cm²`, so we can compute `RR`'s area as `8 + 16 = 24 cm²` when we reach it. Continue upward: `RL` has 32 cm², so `R` has `32 + 24 = 56 cm²`; finally `Board` has `40 + 56 = 96 cm²`. This is a bottom-up calculation on the same tree.

```text
postorder(p):
    for each child c of p, in child order:
        postorder(c)
    visit p
```

<span id="part-2-cost"></span>

### 3. Why both take linear time

If recording one position costs **O(1)** and iterating a position's `c_p` children costs **O(c_p + 1)**, each traversal takes **O(n)** time for `n` positions. Every nonroot position appears in exactly one parent's child list, so the sum of all child counts is `n − 1`; there are also `n` visits. Recursion keeps one root-to-leaf path active at a time, at most `h + 1` calls for tree height `h`.

The book shows preorder and postorder on a structured document. Our region outline uses the same parent-before-pieces or pieces-before-parent rules.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 8.4.2 Breadth-First Tree Traversal

<span id="part-3-queue"></span>

### 1. Use a first-in, first-out queue

**Breadth-first traversal** visits every position at depth `d` before any at depth `d + 1` (Code Fragment 8.14). Put the root in a **first-in, first-out (FIFO) queue**. Repeatedly remove its front position, visit it, and add its children to the back. The book uses a game tree to illustrate this level-by-level order.

For the board, the depths are:

```text
Depth 0: Board
Depth 1: L, R
Depth 2: LL, LR, RL, RR
Depth 3: RRL, RRR
```

The breadth-first sequence is therefore:

```text
Board → L → R → LL → LR → RL → RR → RRL → RRR
```

<span id="part-3-trace"></span>

### 2. Trace the board's queue

| Action | Queue afterward, front on the left |
| :--- | :--- |
| Start | `[Board]` |
| Visit `Board`; enqueue `L`, `R` | `[L, R]` |
| Visit `L`; enqueue `LL`, `LR` | `[R, LL, LR]` |
| Visit `R`; enqueue `RL`, `RR` | `[LL, LR, RL, RR]` |
| Visit `LL` | `[LR, RL, RR]` |
| Later visit `RR`; enqueue `RRL`, `RRR` | `[RRL, RRR]` |

Each position enters and leaves the queue once, so the traversal takes **O(n)** time when queue operations take O(1). This board's queue holds at most four positions at once. A larger tree can require O(n) queue space in the worst case.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 8.4.3 Inorder Traversal of a Binary Tree

<span id="part-4-inorder"></span>

### 1. Visit between left and right

**Inorder** visits the left subtree, then the position, then the right subtree (Code Fragment 8.15). It applies to a **binary** tree because “between” needs distinct left and right sides. Our full sequence is:

```text
LL → L → LR → Board → RL → R → RRL → RR → RRR
```

For example, `Board` appears after all of `L`'s subtree and before all of `R`'s. Filtering this sequence down to leaves gives the physical strip order `LL, LR, RL, RRL, RRR`, from the board's left edge to its right edge. The full sequence includes internal regions too, so it is not a list of only final strips.

<span id="part-4-bst"></span>

### 2. Read cut coordinates with a search tree

The book introduces a **binary search tree (BST)** here: every element in a position's left subtree is smaller than its element, and every element in its right subtree is larger. Inorder then reports its values in increasing order. This rule does **not** describe the areas stored in our region tree. For a connected geometry example, build a **separate** BST containing just the cut coordinates:

```text
        5
       / \
      2   9
           \
           10
```

Inorder produces `2, 5, 9, 10` cm, the cuts from left to right. Searching for cut `10` compares with `5`, goes right to `9`, then right to `10`. A search follows one path, taking **O(height)** time: near logarithmic for a short balanced tree, but as much as **O(n)** for a tall chain. The book develops search trees further in Chapter 11.

<span id="part-4-expression"></span>

### 3. Read an area expression

We can also make an **expression tree** with the same shape as the region tree: put `+` at every internal position and the five final areas at its leaves. Its complete calculation is:

```text
((16 + 24) + (32 + (8 + 16))) = 96 cm²
```

Inorder visits operands and operators in **infix** order, giving `16 + 24 + 32 + 8 + 16`. That token list omits the parentheses that reveal the tree's grouping. For addition the value stays 96, but with subtraction or division the omitted grouping could change the answer. The book likewise notes that inorder expression output needs parentheses to preserve meaning.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 8.4.4 Implementing Tree Traversals in Python

<span id="part-5-generators"></span>

### 1. Yield positions, then elements

The book implements traversals as **generators**: they produce positions one at a time with `yield`. A subtree preorder helper can be expressed like this, assuming `p` is a valid starting position:

```python
def subtree_preorder(T, p):
    yield p
    for child in T.children(p):
        yield from subtree_preorder(T, child)
```

`yield p` produces the parent before the recursive child results. A postorder helper moves `yield p` **after** the child loop. An inorder helper for `BinaryTree` yields the left subtree, then `p`, then the right subtree. The book's public `preorder()`, `postorder()`, `breadthfirst()`, and binary `inorder()` check for an empty tree, so they yield no positions when there is no root.

Breadth-first uses a queue rather than recursion. The book uses its `LinkedQueue`; this equivalent sketch uses Python's `deque`:

```python
from collections import deque

def breadthfirst_positions(T):
    if T.is_empty():
        return
    queue = deque([T.root()])
    while queue:
        p = queue.popleft()
        yield p
        queue.extend(T.children(p))
```

These functions yield **positions**. Element iteration then reads each position's element, as in the book's `Tree.__iter__`:

```python
def elements(T):
    for p in T.positions():
        yield p.element()
```

<span id="part-5-defaults"></span>

### 2. Know the default iteration order

The book makes `Tree.positions()` return a preorder iterator by default (Code Fragment 8.18). It also shows `BinaryTree.positions()` overridden to return an inorder iterator (Code Fragment 8.22). Thus `for p in T.positions()` visits **positions** in that class's chosen default order, while `for element in T` visits their **elements** in the same order.

For our binary board, the inorder default would start with `LL`, `L`, `LR`, `Board`, and so on. Calling `T.preorder()` explicitly still starts with `Board`. The underlying links and areas stay the same; the chosen iterator changes only the sequence delivered to the caller.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 8.4.5 Applications of Tree Traversals

<span id="part-6-outline"></span>

### 1. Print an indented or numbered cut plan

Preorder prints a parent before its pieces. Carry the current depth `d` into each recursive call and print `d` levels of indentation:

```text
Board
  L
    LL
    LR
  R
    RL
    RR
      RRL
      RRR
```

For the tuple elements from Section 8.3, this sketch prints that outline when called with `T.root()` and `d = 0`:

```python
def print_cut_plan(T, p, d=0):
    print("  " * d + p.element()[0])
    for child in T.children(p):
        print_cut_plan(T, child, d + 1)
```

Calling `T.depth(p)` afresh for every position can repeat long upward walks and take **O(n²)** in the worst case. Passing `d + 1` down the recursion gives **O(n)** traversal overhead. Producing many long indentation strings adds output work beyond that count.

The book also carries a child-index path to print numbered headings. Let the root be unnumbered, then label its children `1` and `2`; `R` is `2`, `RR` is `2.2`, and `RRR` is `2.2.2`. The traversal maintains one shared zero-index path and displays each component plus one, separated by dots. For `RRR`, the stored path `[1, 1, 1]` becomes label `2.2.2`.

<span id="part-6-parentheses"></span>

### 2. Preserve the structure with parentheses

A plain preorder list names the positions but does not show where each child group ends. The book's parenthetic traversal adds `(` before a position's children, commas between siblings, and `)` after the last child. Our board becomes:

```text
Board(L(LL,LR),R(RL,RR(RRL,RRR)))
```

The parentheses reveal that `RRL` and `RRR` belong to `RR`, not directly to `R`. Producing this representation requires actions **before, between, and after** child subtrees; a simple list of preorder positions does not by itself insert those marks.

<span id="part-6-area"></span>

### 3. Calculate final area from the leaves

The book's disk-space example uses a postorder-style recursion: obtain each child's total first, then add the current node's own space. Geometry needs a small adjustment. Each internal rectangle already covers its children, so we add **only leaf areas**:

```python
def final_area(T, p):
    if T.is_leaf(p):
        _, left_x, right_x, height = p.element()
        return (right_x - left_x) * height
    return sum(final_area(T, child) for child in T.children(p))
```

At `RR`, the result is `8 + 16 = 24`; at `R`, it is `32 + 24 = 56`; at the root, it is `40 + 56 = 96 cm²`. If we summed the stored area of **all nine** region positions instead, the result would be `312 cm²` because the same physical area appears in a region and its descendants. The function returns child totals to their parent; a plain postorder iterator alone does not group those return values.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: 8.4.6 Euler Tours and the Template Method Pattern

<span id="part-7-walk"></span>

### 1. Walk each edge down and back

An **Euler tour** of a tree starts at the root, follows an edge down to a child, and later follows the same edge back up. It can perform work **before** a position's children (previsit) and **after** them (postvisit). Our nine-position board has `9 − 1 = 8` edges, so a full tour walks edges `2 × 8 = 16` times. The walk itself is **O(n)**; work done by a chosen visit action can add cost.

Recording each previsit gives the board's preorder list. Recording each postvisit gives its postorder list. That is why one traversal framework can support several applications.

<span id="part-7-hooks"></span>

### 2. Customize the previsit and postvisit hooks

The book's `EulerTour` class fixes the walk but lets a subclass replace **hooks**. Its `execute()` starts at the root with depth `0` and an empty path, then returns the root's postvisit result. At a position `p`, the framework performs:

```text
previsit(p, depth, path)
for each child, in order:
    tour that child and collect its returned result
postvisit(p, depth, path, child_results)
return the postvisit result to p's parent
```

The path is a shared list of **zero-based child indices**. The framework appends an index before descending, updates it between siblings, and removes it when returning. For `RRR`, the path is `[1, 1, 1]`: right from `Board`, right from `R`, right from `RR`. Its depth is `3`. The previsit result is not used; the postvisit can return a calculated value such as area. An empty tree has no root tour, so `execute()` returns `None`.

This is the **template method pattern**: the framework controls *when* visits happen; subclasses choose *what* happens there. The book uses hooks for indented printing, numbered printing, parenthetic text, and disk-space totals. Our `final_area` calculation can likewise use a postvisit hook that returns a leaf's area or the sum of child results.

<span id="part-7-binary"></span>

### 3. Add an in-visit and lay out the tree

For a binary tree, `BinaryEulerTour` adds an **in-visit** between the left and right subtrees:

```text
previsit → left subtree → invisit → right subtree → postvisit
```

Recording in-visits produces inorder. Even a leaf reaches previsit, in-visit, and postvisit in that sequence. The binary framework keeps separate left and right result slots; a lone right child still uses slot `1` and path index `1`.

The book's `BinaryLayout` example assigns drawing coordinates from the in-visits: `x` is a position's **inorder rank**, starting at `0`, and `y` is its **depth** (drawn downward). On our board:

| Region | Inorder-rank `x` | Depth `y` | Physical board interval |
| :--- | ---: | ---: | :--- |
| `LL` | 0 | 2 | `[0, 2)` cm |
| `Board` | 3 | 0 | `[0, 12)` cm |
| `RR` | 7 | 2 | `[9, 12)` cm |
| `RRR` | 8 | 3 | `[10, 12)` cm |

These `x, y` values place **nodes in a tree drawing**; they are not centimetre coordinates on the board. The textbook's layout class expects stored elements that can receive `setX` and `setY` calls. Our tuple elements would need a suitable drawable object to run that class unchanged.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which traversal can check areas from the bottom up?</strong></summary>

**Scenario:** We know only the five final strip areas and want the board's area.

**Method:** Use postorder recursion. Calculate `RR = 8 + 16 = 24`, `R = 32 + 24 = 56`, `L = 16 + 24 = 40`, then `Board = 40 + 56 = 96 cm²`.

**Reason:** Each parent receives its child results after the children have been processed.

</details>

<details>
<summary><strong>Case Study 2: Why does an all-position area sum give 312?</strong></summary>

**Scenario:** A loop visits every position and adds its stored rectangle area.

**Calculation:** Depth 0 contributes `96`, depth 1 contributes `40 + 56 = 96`, depth 2 contributes `16 + 24 + 32 + 24 = 96`, and depth 3 contributes `8 + 16 = 24`; total `96 + 96 + 96 + 24 = 312 cm²`.

**Fix:** Add only **leaf** areas to measure the finished partition. Traversal order alone does not decide which values should be counted.

</details>

<details>
<summary><strong>Case Study 3: Does inorder sort the region areas?</strong></summary>

**Scenario:** The region tree's inorder sequence begins `LL, L, LR, Board, ...`, with areas `16, 40, 24, 96, ...`.

**Result:** Those areas are not sorted. Inorder gives sorted values **only when the tree satisfies the BST ordering rule for those values**. Our separate cut-coordinate BST does satisfy that rule and returns `2, 5, 9, 10` cm.

</details>

<details>
<summary><strong>Case Study 4: Is a tree-layout x-coordinate a board measurement?</strong></summary>

**Scenario:** The layout gives `RR` drawing coordinate `x = 7`, while its rectangle starts at physical board coordinate `x = 9 cm`.

**Result:** The `7` is `RR`'s zero-based inorder rank among nine tree positions. The `9 cm` is where its physical strip starts. They describe different drawings and use different units.

</details>

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Section 8.4 idea | Plain-language meaning | Rectangle-board example |
| :--- | :--- | :--- |
| **Preorder** | Record a parent before its children. | Start `Board, L, LL, LR`. |
| **Postorder** | Record children before their parent. | Calculate `RRL + RRR = RR` before `R`. |
| **Breadth-first** | Visit all of one depth before the next. | Levels contain `1, 2, 4, 2` regions. |
| **Inorder** | For a binary tree, visit left, parent, right. | `LL, L, LR, Board, ...`. |
| **BST inorder** | Returns sorted values when the BST ordering rule holds. | Cut coordinates `2, 5, 9, 10` cm. |
| **Generator / iterator** | Yield positions, or yield their stored elements. | `positions()` supplies region positions; `iter(T)` supplies data. |
| **Traversal application** | Use visit timing for printing or calculation. | Print an outline or sum leaf areas to 96 cm². |
| **Euler tour** | Walk each edge down and back, with visit hooks. | Eight edges give 16 edge traversals. |
| **Binary layout** | Use inorder rank and depth to place drawn nodes. | `RR` is drawn at `(7, 2)`, separate from its board interval. |

[🔝 Back to Top](#top)
