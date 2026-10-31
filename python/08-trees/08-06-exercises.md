<span id="top"></span>

# 8.6 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 8, Section 8.6, printed pages 352–361 (the supplied PDF).<br>
> **Topic:** Reinforcement R-8.1–R-8.30; Creativity C-8.31–C-8.63; Projects P-8.64–P-8.70.<br>
> **Domain Focus:** One 12 cm × 8 cm rectangle board, its cut tree, traversal orders, path lengths, expression tree, and a slicing-floor-plan variant.<br>
> **User Prompt:** Reexplain [`Section 8.6`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Use One Tree for Many Questions](#background)
   - [1. Keep the rectangle board in view](#background-board)
   - [2. Decide what an exercise is measuring](#background-method)
2. [Part 1: 8.6 Exercises at a Glance](#part-1)
   - [1. Read the three exercise groups](#part-1-groups)
   - [2. Prepare a solution before writing code](#part-1-prepare)
3. [Part 2: Reinforcement, R-8.1–R-8.30](#part-2)
   - [1. General-tree vocabulary and height, R-8.1–R-8.4](#part-2-general)
   - [2. Binary-tree shape and counts, R-8.5–R-8.10](#part-2-binary)
   - [3. Expression trees, R-8.11–R-8.13](#part-2-expression)
   - [4. Linked and array representations, R-8.14–R-8.19](#part-2-storage)
   - [5. Traversals and Euler tours, R-8.20–R-8.29](#part-2-traversals)
   - [6. Expression tokens, R-8.30](#part-2-tokens)
4. [Part 3: Creativity, C-8.31–C-8.63](#part-3)
   - [1. Paths, counts, and shapes, C-8.31–C-8.37](#part-3-shapes)
   - [2. Structural updates and encodings, C-8.38–C-8.43](#part-3-structure)
   - [3. Measures and traversal relations, C-8.44–C-8.50](#part-3-measures)
   - [4. Iterators, drawings, and output, C-8.51–C-8.56](#part-3-drawings)
   - [5. Ancestors and distance, C-8.57–C-8.60](#part-3-ancestors)
   - [6. Expression-tree extensions, C-8.61–C-8.63](#part-3-expressions)
5. [Part 4: Projects, P-8.64–P-8.70](#part-4)
   - [1. Implement tree storage, P-8.64–P-8.66](#part-4-storage)
   - [2. Compact a slicing floor plan, P-8.67](#part-4-floor)
   - [3. Build game and general-tree systems, P-8.68–P-8.70](#part-4-other)
6. [Part 5: One Connected Geometry Practice Program](#part-5)
   - [1. Calculate path lengths and area](#part-5-program)
   - [2. Read the output](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Use One Tree for Many Questions

<span id="background-board"></span>

### 1. Keep the rectangle board in view

The [earlier Chapter 8 guides](08-01-general-trees.md) use a **12 cm × 8 cm** board divided by vertical cuts. Its five final strips have widths `2, 3, 4, 1, 2 cm` and total area `96 cm²`.

```text
Board (12 × 8)
├── L (5 × 8)
│   ├── LL (2 × 8)
│   └── LR (3 × 8)
└── R (7 × 8)
    ├── RL (4 × 8)
    └── RR (3 × 8)
        ├── RRL (1 × 8)
        └── RRR (2 × 8)
```

There are **9 positions**, including **4 internal regions** and **5 leaves**. The root has depth `0`; the deepest leaves have depth `3`, so the tree height is `3`. The final-strip areas are `16, 24, 32, 8, 16 cm²`. Their sum is `96 cm²`; summing every region's area would count shared physical space repeatedly.

The book's exercises use their own figures, strings, and applications. This board is a **new, connected practice case**. The tables below paraphrase what all 70 numbered exercises are testing and suggest how to begin. Consult the supplied PDF for each exercise's exact data and restrictions.

<span id="background-method"></span>

### 2. Decide what an exercise is measuring

The same tree supports different measurements. A **position** identifies a place in the tree; an **element** stores a label or value. Depth counts edges from the root, height counts the longest downward path to a leaf, and a subtree includes its own root. A traversal determines visit order; it does not alter the tree.

| Question about the board | Useful calculation | Result |
| :--- | :--- | ---: |
| How many final pieces? | Count leaves. | 5 |
| How deep is `RRR`? | Count `Board → R → RR → RRR` edges. | 3 |
| How many positions lie below `R`, including `R`? | Count `R, RL, RR, RRL, RRR`. | 5 |
| What is the total area? | Sum leaf widths, then multiply by height. | `(2+3+4+1+2) × 8 = 96 cm²` |

Many questions ask for a **proof**, **trace**, **algorithm**, or **implementation**. Record which one before working: an example alone is not a proof, and a correct result alone is not an algorithm or its time analysis.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 8.6 Exercises at a Glance

Section 8.6 contains three exercise groups, rather than new explanatory subsections. Parts 2–4 give a brief study map for **every numbered prompt**. They are not replacements for the exercises or complete solutions to all of them.

<span id="part-1-groups"></span>

### 1. Read the three exercise groups

| Group | Number range | Main work | Good first move |
| :--- | :--- | :--- | :--- |
| **Reinforcement** | R-8.1–R-8.30 | Apply tree definitions, storage formulas, and traversal rules. | Label a small tree before calculating. |
| **Creativity** | C-8.31–C-8.63 | Prove bounds or design new traversals and updates. | State the invariant and boundary cases. |
| **Projects** | P-8.64–P-8.70 | Build complete tree-based structures or applications. | Define the representation and operations first. |

<span id="part-1-prepare"></span>

### 2. Prepare a solution before writing code

```text
Identify the tree type → mark the root, children, and leaves
→ choose preorder, postorder, breadth-first, or a parent path
→ state what each visit returns or changes → check the cost
```

On our board, an array representation has **9 occupied indices** but reaches index `14`; a linked representation has **9 actual nodes**. That distinction matters for storage exercises. For area, count only the **five final rectangles**. For path length, count depths of **positions**. For a drawing, an inorder-rank `x` is a tree-layout coordinate, not a centimetre mark on the board.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement, R-8.1–R-8.30

These exercises mainly check that definitions and traversal rules can be applied to a specific figure or implementation. Use the board for practice, then return to the book's exact figure or input when answering its prompt.

<span id="part-2-general"></span>

### 1. General-tree vocabulary and height, R-8.1–R-8.4

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **R-8.1** | Root, relatives, subtree, depth, and height in Figure 8.3. | Mark parent links, then trace each requested path. |
| **R-8.2** | A worst-case shape for `depth`. | Use a one-child chain; count the upward steps. |
| **R-8.3** | Why tree height is the greatest leaf depth. | Extend any deepest path until it reaches a leaf. |
| **R-8.4** | Cost of `_height2(p)` when `p` is not the root. | Count positions in **p's subtree**, not automatically in all of `T`. |

For our board, `depth(RRR) = 3`, `height(R) = 2`, and `height(Board) = 3`. A one-child chain with nine positions would have a leaf at depth `8`; it illustrates a worst case for upward depth calculation, but it is a different tree from the physical two-way cut plan.

<span id="part-2-binary"></span>

### 2. Binary-tree shape and counts, R-8.5–R-8.10

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **R-8.5** | Leaves that occupy a parent's left-child slot. | Test both `is_leaf(p)` and whether `p` equals its parent's left child. |
| **R-8.6** | Convert a possibly improper binary tree to a proper one. | Give every one-child position a second, placeholder child; count additions. |
| **R-8.7** | Internal/leaf bounds for a **strictly improper** binary tree. | Let `U` count one-child positions and use the `n−1` parent–child edges. |
| **R-8.8** | Proper-tree height and leaf bounds. | Compare a long proper comb with a perfect binary tree. |
| **R-8.9** | The proper-tree identity `leaves = internal + 1`. | Induct by adding or removing one two-child branch. |
| **R-8.10** | Direct `BinaryTree.num_children(p)`. | Count non-`None` left and right children. |

Our board is **proper**: every internal region has two children, and `5 = 4 + 1` verifies R-8.9's identity. Its left-child leaves are `LL`, `RL`, and `RRL`. R-8.7 needs an **improper** tree with at least one one-child position; the board itself does not meet that condition.

<span id="part-2-expression"></span>

### 3. Expression trees, R-8.11–R-8.13

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **R-8.11** | Values of the subexpressions in Figure 8.8. | Evaluate leaves first, then each operator after its two children. |
| **R-8.12** | A four-leaf arithmetic tree with a target value. | Work backward from the target; verify every subtree bottom-up. |
| **R-8.13** | Tree shape of a given nested expression. | Find the outer operation, then recurse on its operands. |

Our own area expression from [Section 8.5](08-05-case-study-an-expression-tree.md) is `(8*((2+3)+(4+(1+2))))`. Its width subtrees return `5`, `3`, `7`, and `12 cm`; the multiplication root returns `96 cm²`. This is a practice model for the method, not the book's expression in R-8.11–R-8.13.

<span id="part-2-storage"></span>

### 4. Linked and array representations, R-8.14–R-8.19

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **R-8.14** | Linked-tree operation costs in Table 8.2. | Separate constant pointer work from subtree or whole-tree walks. |
| **R-8.15** | Public wrappers for inherited linked-tree updates. | Delegate to the existing mutators and preserve their checks. |
| **R-8.16** | Largest zero-based array index in an `n`-position binary tree. | Follow right edges: `i → 2i+2`; an all-right chain reaches `2^n−2`. |
| **R-8.17** | Array indices through an Euler tour. | Start at `0`; pass `2i+1` left and `2i+2` right. |
| **R-8.18** | Array-backed root, parent, child, and leaf tests. | Check index bounds **and occupied slots** before returning a position. |
| **R-8.19** | The same operations with root numbered `1`. | Use parent `i//2`, left `2i`, and right `2i+1`. |

For the board's zero-based layout, `Board=0`, `L=1`, `R=2`, `LL=3`, `LR=4`, `RL=5`, `RR=6`, `RRL=13`, and `RRR=14`. Slots `7–12` are empty. Thus nine positions require an array reaching index `14`, while the linked representation stores just the nine nodes. The bound in R-8.16 has an **exponent**: a seven-position all-right chain reaches `2^7−2 = 126`.

<span id="part-2-traversals"></span>

### 5. Traversals and Euler tours, R-8.20–R-8.29

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **R-8.20** | Rebuild a binary tree from preorder and inorder lists. | First preorder item is the root; split inorder around it. |
| **R-8.21** | Figure 8.8 in preorder. | Record parent before left and right subtrees. |
| **R-8.22** | Figure 8.8 in postorder. | Finish left and right subtrees before parent. |
| **R-8.23** | When preorder and postorder of an ordered tree match or reverse. | Compare root positions; try a one-child chain for reversal. |
| **R-8.24** | The same comparison for a proper binary tree. | Its first branch has two children, restricting reversal. |
| **R-8.25** | Queue states for Figure 8.17's breadth-first walk. | Write the queue before each loop: remove front, then append children. |
| **R-8.26** | Breadth-first traversal using `deque.extend`. | Use `popleft()` and extend by the current position's children. |
| **R-8.27** | Parenthetic output for Figure 8.8. | Place opening/closing marks around each child group. |
| **R-8.28** | Cost of parenthetic output. | Count node/edge work and the characters actually printed. |
| **R-8.29** | Descendant counts using an Euler tour. | Postvisit returns subtree size `1 + sum(child sizes)`. |

For our board, preorder is `Board, L, LL, LR, R, RL, RR, RRL, RRR`; postorder is `LL, LR, L, RL, RRL, RRR, RR, R, Board`. Breadth-first begins `Board, L, R`, and the queue reaches four positions after visiting `R`. The subtree at `RR` contains three positions, so `RR` has **two descendants excluding itself**.

<span id="part-2-tokens"></span>

### 6. Expression tokens, R-8.30

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **R-8.30** | Convert raw expression text into tokens. | Skip spaces; keep each run of digits together; emit operators and parentheses separately. |

The geometry expression `((12-9)*8)` for region `RR` should yield `['(', '(', '12', '-', '9', ')', '*', '8', ')']`. Splitting `12` into `'1'` and `'2'` would change the expression tree. The parser in Section 8.5 assumes tokenization has already happened.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Creativity, C-8.31–C-8.63

These prompts ask for proofs, new algorithms, or modifications to a tree representation. State what a recursive call **returns** and what a visit **does**. For a claimed time bound, count visits, child-list scans, and any work performed at each position.

<span id="part-3-shapes"></span>

### 1. Paths, counts, and shapes, C-8.31–C-8.37

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **C-8.31** | Internal and external depth sums in a proper binary tree. | Compare what each parent–child edge contributes; test `E = I + n − 1`. |
| **C-8.32** | Leaf-count extremes and the sum of leaf depths. | Test the stated bound against a tall, maximally leafy tree; see note below. |
| **C-8.33** | A tree with quadratic leaf-depth sum. | Repeatedly branch off one leaf and continue down the other branch. |
| **C-8.34** | Leaf count when every internal position has three children. | Equate `3 × internal` child edges with `total positions − 1`. |
| **C-8.35** | Ordered-tree isomorphism. | Compare child counts and corresponding child subtrees recursively. |
| **C-8.36** | Many distinct improper binary-tree shapes. | Vary left/right unary links and a final branch; check the small case. |
| **C-8.37** | Four-leaf proper binary-tree shapes. | Split four leaves across left and right subtrees and count ordered shapes. |

On our proper board, internal depths total `I = 0 + 1 + 1 + 2 = 4`, and leaf depths total `E = 2 + 2 + 2 + 3 + 3 = 12`. With `n = 9`, C-8.31's relation reads `12 = 4 + 9 − 1`.

> **Source check for C-8.32:** The printed exercise says a binary tree with the maximum possible number of leaves must have leaf-depth sum `O(n log n)`. That is false without a balance or height condition. A proper **comb** with `m` internal positions and `m+1` leaves has `n = 2m+1` positions and the maximum possible leaf count, but leaf depths `1, 2, …, m−1, m, m`. Their sum is `(m²+3m)/2 = Θ(n²)`. Do not try to prove the printed bound for arbitrary trees.

> **Small-case check for C-8.36:** Section 8.2 defines *improper* as **not proper**. With just one internal position, there are exactly two such ordered shapes: one left child or one right child. Thus the exercise's strict “more than `2^n`” claim needs `n ≥ 2` under that definition.

<span id="part-3-structure"></span>

### 2. Structural updates and encodings, C-8.38–C-8.43

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **C-8.38** | Delete an entire linked subtree. | Detach its root, count removed positions, and update tree size. |
| **C-8.39** | Swap two linked-tree positions. | Save adjacent links first; handle root and parent–child cases explicitly. |
| **C-8.40** | Replace missing links with one sentinel. | Rewrite delete/attach while keeping sentinel parent and child rules valid. |
| **C-8.41** | Clone a proper binary tree using `_attach`. | Recursively clone both children, then attach the two fresh trees. |
| **C-8.42** | Clone any binary tree using child insertions. | Add a left or right child only when that original child exists. |
| **C-8.43** | Encode an ordered general tree as a binary tree. | Let `left` mean first child and `right` mean next sibling; compare traversals. |

The board's `RR` subtree has three positions. Removing it from the **abstract tree** removes `RR`, `RRL`, and `RRR`, leaving six positions. That is a valid data-structure count, but the remaining region labels no longer describe a complete physical partition of the original board. Tree updates and geometry constraints must both be checked when the tree represents real cuts.

For C-8.43, reuse the earlier general-tree version with three direct strips `A`, `B`, and `C`: `Board.left = A`, `A.right = B`, `B.right = C` in the first-child/next-sibling encoding. Those `right` links mean **sibling**, not a geometric right-hand cut.

<span id="part-3-measures"></span>

### 3. Measures and traversal relations, C-8.44–C-8.50

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **C-8.44** | Height of every rooted subtree. | Postorder returns `1 + max(child heights)`; leaf height is `0`. |
| **C-8.45** | Depth of every position in linear time. | Preorder carries `depth + 1` to children. |
| **C-8.46** | Total path length. | Sum the carried depth once at each position. |
| **C-8.47** | Balance factor at proper binary internal positions. | Postorder obtains right and left heights before subtracting. |
| **C-8.48** | Reflection and traversal reversal. | Swap left/right recursively, then compare preorder with reversed postorder. |
| **C-8.49** | A relation among preorder rank, postorder rank, depth, and subtree size. | Track the block occupied by each subtree in both traversals. |
| **C-8.50** | The next position in three binary-tree traversals. | Look for a child first where appropriate, then climb to an ancestor. |

For the board, the total path length is the sum of all nine depths: `I + E = 4 + 12 = 16`. The root's left subtree has height `1`, and its right subtree has height `2`, so its right-minus-left balance factor is `2 − 1 = 1`. These are **tree-edge** measurements; they are not centimetres.

<span id="part-3-drawings"></span>

### 4. Iterators, drawings, and output, C-8.51–C-8.56

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **C-8.51** | Preorder without a generator. | Keep an explicit iterator stack; push right before left. |
| **C-8.52** | Draw a binary tree using preorder rank as `x`. | Assign each subtree a contiguous run of ranks and use depth for `y`. |
| **C-8.53** | Draw a binary tree using postorder rank as `x`. | Repeat the interval argument with children ranked before parents. |
| **C-8.54** | Draw an ordered general tree. | Reserve separate horizontal spans for child subtrees; place parent above them. |
| **C-8.55** | Compare `os.walk` with tree traversals. | `topdown=True` yields a directory before subdirectories; `False` after them. |
| **C-8.56** | Indented parenthetic tree output. | Combine preorder labels, depth-based indentation, and closing marks. |

The board's inorder drawing in Section 8.4 puts `RR` at rank `x = 7`, depth `y = 2`. C-8.52 and C-8.53 change the **ranking traversal**, so their `x` values differ. None of these drawing coordinates is the physical `x = 9 cm` where rectangle `RR` begins. For C-8.55, see the [Python `os.walk` documentation](https://docs.python.org/3/library/os.html#os.walk) for the exact directory-yield behavior.

<span id="part-3-ancestors"></span>

### 5. Ancestors and distance, C-8.57–C-8.60

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **C-8.57** | Find first subtree roots that fail the stated left/right descendant-balance test. | Postorder returns subtree sizes and whether all descendants pass. |
| **C-8.58** | Lowest common ancestor (LCA) of two positions. | Align depths, then climb both parent paths until they meet. |
| **C-8.59** | The greatest distance between two binary-tree positions. | Combine deepest child paths and child diameters bottom-up. |
| **C-8.60** | LCA using only level-number labels. | Repeatedly map the deeper label to its parent. |

For example, `RL` has depth `2`, `RRL` has depth `3`, and their LCA is `R` at depth `1`. The distance is `2 + 3 − 2(1) = 3` edges. A longest board-tree path goes from `LL` or `LR` to `RRL` or `RRR`, crossing `5` edges through `Board`; thus the tree diameter is `5`. This is a distance **through tree links**, not a physical distance across the board.

<span id="part-3-expressions"></span>

### 6. Expression-tree extensions, C-8.61–C-8.63

| Exercise | What to study | How to start |
| :--- | :--- | :--- |
| **C-8.61** | Build an expression tree recursively rather than with an explicit stack. | Consume `(`, left expression, operator, right expression, `)` in order. |
| **C-8.62** | Evaluate variable leaves using a supplied dictionary. | Look up variables; parse numeric leaves; combine child values. |
| **C-8.63** | Produce postfix notation. | Postorder outputs left tokens, right tokens, then operator. |

Replace the height leaf `8` in our expression with a variable `h`. A variable-aware evaluator gives `96 cm²` when `h = 8 cm` and `120 cm²` when `h = 10 cm`, while the width remains `12 cm`. For the original numeric expression, postfix is `8 2 3 + 4 1 2 + + + *`. Separate tokens with spaces so multidigit operands remain readable.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Projects, P-8.64–P-8.70

The projects turn the chapter's abstractions into complete systems. Check **invariants after each update**, test empty and one-position trees, and distinguish a correct representation from a correct geometric or game interpretation.

<span id="part-4-storage"></span>

### 1. Implement tree storage, P-8.64–P-8.66

| Project | What to build | First design decision |
| :--- | :--- | :--- |
| **P-8.64** | A binary-tree ADT backed by level-numbered array slots. | Define how empty slots differ from absent array indices. |
| **P-8.65** | A linked general-tree ADT with useful updates. | Store an ordered child list and maintain parent/size links. |
| **P-8.66** | A linked binary tree without a parent field on each node. | Put root-to-node paths in `Position` objects and analyze the tradeoff. |

The board shows the tradeoff in P-8.64: its nine positions occupy indices `0–6, 13, 14`, leaving slots `7–12` unused. For P-8.66, a path to `RRR` has three child steps. A stored `Position` may need that whole path; retaining many such Positions can use more memory or make updates more involved than a simple parent pointer. The project asks you to make that representation work, not merely remove one field.

<span id="part-4-floor"></span>

### 2. Compact a slicing floor plan, P-8.67

**P-8.67** is especially close to our board. A **slicing tree** has a basic rectangle at each leaf and a horizontal or vertical cut at each internal position. Each leaf declares a **minimum width and height**. A postorder calculation finds the minimum dimensions required by every larger region:

| Cut at a parent | Minimum parent width | Minimum parent height |
| :--- | :--- | :--- |
| Vertical cut, left/right children | `w_left + w_right` | `max(h_left, h_right)` |
| Horizontal cut, top/bottom children | `max(w_top, w_bottom)` | `h_top + h_bottom` |

All cuts in our original five-strip board are vertical. With leaf minima `2×8`, `3×8`, `4×8`, `1×8`, and `2×8 cm`, postorder gives the root minimum `12×8 cm`.

To practice a horizontal cut, make a **variant**: replace the `LL` strip (`2×8 cm`) with a top rectangle needing `2×3 cm` and a bottom rectangle needing `2×5 cm`. The new `LL` minimum is `(max(2,2), 3+5) = (2,8)`, so the whole plan still compacts to `12×8 cm`. If the bottom rectangle instead needs width `3 cm`, `LL` needs `(3,8)`, `L` needs `(6,8)`, and the board needs `(13,8)`. The altered plan is a new minimum-size layout, not the original 12 cm-wide physical board.

The complete project also needs operations to create a rectangle, cut a leaf, set leaf minima, draw the tree, and draw the compacted plan. Compute sizes **bottom-up**; assign physical positions to rectangles **top-down** after sizes are known.

<span id="part-4-other"></span>

### 3. Build game and general-tree systems, P-8.68–P-8.70

| Project | What to build | Key distinction |
| :--- | :--- | :--- |
| **P-8.68** | A Tic-Tac-Toe game tree and minimax move choice. | A node is a **game state** on a 3×3 grid; postorder alternates max and min scores. |
| **P-8.69** | A general-tree ADT using first-child/next-sibling binary links. | A binary right link may mean **next sibling**, not right geometric piece. |
| **P-8.70** | Reroot a general tree at a chosen position while keeping the same adjacencies. | Parent/child directions change, even though undirected links stay. |

P-8.68's grid supplies geometry, but its tree represents **possible moves**, not cuts in our rectangle board. The root is at depth `0`; **even depths are A's turn** and **odd depths are B's turn**. Terminal positions score `+1`, `0`, or `−1` for an A win, draw, or loss. Working upward, an A-turn position takes the **maximum** child score and a B-turn position takes the **minimum**. For example, if two B-turn children can force scores `0` and `−1`, A chooses the move valued `0`. For P-8.70, rerooting the abstract board tree at `L` preserves its nine positions and eight edges, but `L` would no longer be a sensible “whole board” root. A graph transformation need not preserve the original cut-plan meaning.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Practice Program

<span id="part-5-program"></span>

### 1. Calculate path lengths and area

This small, complete Python program represents the board with nested `(name, children)` tuples. It practices a preorder walk and the depth sums used above. It is a study model, not an implementation of the textbook's full `Tree` ADT.

```python
board = ("Board", (
    ("L", (("LL", ()), ("LR", ()))),
    ("R", (
        ("RL", ()),
        ("RR", (("RRL", ()), ("RRR", ()))),
    )),
))
leaf_widths = {"LL": 2, "LR": 3, "RL": 4, "RRL": 1, "RRR": 2}
height_cm = 8


def walk(node, depth=0):
    name, children = node
    is_leaf = len(children) == 0
    yield name, depth, is_leaf
    for child in children:
        yield from walk(child, depth + 1)


rows = list(walk(board))
n = len(rows)
internal_path = sum(d for name, d, leaf in rows if not leaf)
external_path = sum(d for name, d, leaf in rows if leaf)
width_cm = sum(leaf_widths[name] for name, d, leaf in rows if leaf)
area_cm2 = width_cm * height_cm

print("positions:", n)
print("internal path:", internal_path)
print("external path:", external_path)
print("path identity:", internal_path + n - 1 == external_path)
print("board area (cm²):", area_cm2)
```

<span id="part-5-trace"></span>

### 2. Read the output

```text
positions: 9
internal path: 4
external path: 12
path identity: True
board area (cm²): 96
```

The walk yields each region once. The internal and external sums together give total tree path length `16`. The program sums **leaf widths only** for physical area; it does not add the widths or areas of internal regions again. On this board, `external_path = internal_path + n − 1` checks C-8.31's proper-tree identity, but one successful check is not its general proof.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How many leaves and internal regions does the board have?</strong></summary>

**Scenario:** Count the five final strips and the four regions that were cut again.

**Calculation:** `n_E = 5`, `n_I = 4`, and `n = 9`; therefore `n_E = n_I + 1`. Each cut position has exactly two children, so this is a proper binary tree.

**Exercise connection:** R-8.8–R-8.9 and C-8.31 ask for general statements about such trees. A board count checks an example; it does not replace a proof.

</details>

<details>
<summary><strong>Case Study 2: Why is a leaf-depth sum different from area?</strong></summary>

**Scenario:** The leaf depths are `2, 2, 2, 3, 3`, while the leaf areas are `16, 24, 32, 8, 16 cm²`.

**Calculation:** External path length is `2+2+2+3+3 = 12` tree edges counted across leaves. Physical area is `16+24+32+8+16 = 96 cm²`.

**Exercise connection:** C-8.31–C-8.33 concern depth sums. The geometry labels help identify leaves, but centimetres squared are not part of the path-length formula.

</details>

<details>
<summary><strong>Case Study 3: What does the array index 14 mean?</strong></summary>

**Scenario:** `RR` occupies zero-based index `6`; `RRL` is its left child and `RRR` its right child.

**Calculation:** `left(6)=2(6)+1=13`; `right(6)=2(6)+2=14`. These indices leave holes `7–12` in a 15-slot prefix of the array.

**Exercise connection:** R-8.16–R-8.19 and P-8.64 concern **storage indices**, not the physical strip coordinates `x=9,10,12 cm`.

</details>

<details>
<summary><strong>Case Study 4: Which region joins two final strips?</strong></summary>

**Scenario:** Find the lowest common ancestor of `RL` and `RRL`.

**Method:** Parent paths are `RL → R → Board` and `RRL → RR → R → Board`. The first common position upward is `R`.

**Calculation:** Their tree distance is `depth(RL)+depth(RRL)−2depth(R) = 2+3−2 = 3` edges.

**Exercise connection:** C-8.58–C-8.60 use ancestors and distances; the answer describes tree links, not horizontal centimetres between strips.

</details>

<details>
<summary><strong>Case Study 5: How does a horizontal cut change minimum dimensions?</strong></summary>

**Scenario:** In a variant plan, split `LL` into top `2×3 cm` and bottom `3×5 cm` minimum rectangles.

**Calculation:** A horizontal cut needs `LL` width `max(2,3)=3 cm` and height `3+5=8 cm`. The left side becomes `3+3=6 cm` wide; the right side remains `7 cm`; the compact root becomes `13×8 cm`.

**Exercise connection:** P-8.67 combines minimum dimensions bottom-up. This variant cannot fit the unchanged 12 cm-wide board without relaxing a minimum.

</details>

<details>
<summary><strong>Case Study 6: Can the same expression tree use another height?</strong></summary>

**Scenario:** Write board area as `h*((2+3)+(4+(1+2)))` and supply `h` during evaluation.

**Calculation:** The width subtree is always `12 cm`. With `h=8 cm`, area is `96 cm²`; with `h=10 cm`, area is `120 cm²`.

**Exercise connection:** C-8.62 adds variable lookup; C-8.63 prints the expression in postfix order. A numeric evaluator must obtain `h` from a mapping before multiplying.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Exercise group | Main question | Board anchor |
| :--- | :--- | :--- |
| **R-8.1–R-8.30** | Can you identify, trace, and implement the chapter's basic tree rules? | Nine positions, five leaves, height three, and four traversal orders. |
| **C-8.31–C-8.63** | Can you prove or extend those rules efficiently? | `I=4`, `E=12`, path length `16`, LCA and diameter checks. |
| **P-8.64–P-8.70** | Can you build a complete tree representation or application? | Array slots, linked nodes, slicing-plan compaction, and separate game-tree states. |
| **C-8.32 source caveat** | Does the claimed bound follow without a shape condition? | A tall proper comb has maximal leaves and quadratic leaf-depth sum. |

Use the board to understand a method, then apply that method to the **specific figure, expression, or implementation constraints** in the printed exercise. Keep tree structure, physical geometry, and algorithm cost as separate quantities.

[🔝 Back to Top](#top)
