<span id="top"></span>

# 8.5 Case Study: An Expression Tree — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 8, Section 8.5, printed pages 348–351 (the supplied PDF).<br>
> **Topic:** 8.5 Case Study: An Expression Tree; Composing a Parenthesized String Representation; Expression Tree Evaluation; Building an Expression Tree.<br>
> **Domain Focus:** A 12 cm × 8 cm board divided into rectangular strips; widths, height, and area expressions.<br>
> **User Prompt:** Reexplain [`Section 8.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Turn a Cut Plan into Arithmetic](#background)
   - [1. Recall the same rectangle board](#background-board)
   - [2. Separate a region tree from an expression tree](#background-trees)
2. [Part 1: 8.5 Case Study: An Expression Tree](#part-1)
   - [1. Give operands and operators different jobs](#part-1-nodes)
   - [2. Read the board's area tree](#part-1-board)
3. [Part 2: Construct an ExpressionTree from Smaller Trees](#part-2)
   - [1. Use the two constructor forms](#part-2-constructor)
   - [2. Assemble the board calculation](#part-2-assemble)
4. [Part 3: Composing a Parenthesized String Representation](#part-3)
   - [1. Why inorder tokens need parentheses](#part-3-inorder)
   - [2. Produce the expression one piece at a time](#part-3-string)
5. [Part 4: Expression Tree Evaluation](#part-4)
   - [1. Return values from leaves to the root](#part-4-postorder)
   - [2. Trace the board's arithmetic](#part-4-trace)
6. [Part 5: Building an Expression Tree](#part-5)
   - [1. Start with fully parenthesized tokens](#part-5-tokens)
   - [2. Combine subtrees with a stack](#part-5-stack)
   - [3. Know what the builder assumes](#part-5-limits)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Turn a Cut Plan into Arithmetic

<span id="background-board"></span>

### 1. Recall the same rectangle board

In Sections 8.2–8.4, we split a **12 cm × 8 cm** board into five vertical strips. Every strip is 8 cm high. The cuts produce this left-to-right order:

| Final strip | `LL` | `LR` | `RL` | `RRL` | `RRR` |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Width | 2 cm | 3 cm | 4 cm | 1 cm | 2 cm |
| Area | 16 cm² | 24 cm² | 32 cm² | 8 cm² | 16 cm² |

The cuts also group the widths. The left region `L` is `2 + 3 = 5 cm` wide. The right region `R` is `4 + (1 + 2) = 7 cm` wide. Therefore:

```text
whole width = (2 + 3) + (4 + (1 + 2)) = 12 cm
board area  = 8 × whole width = 8 × 12 = 96 cm²
```

The grouping matters: `1 + 2` belongs to region `RR`, that result joins `4` in region `R`, and only then do the left and right widths join.

<span id="background-trees"></span>

### 2. Separate a region tree from an expression tree

The earlier **region tree** stored rectangles such as `L`, `R`, and `RR`. An **expression tree** stores an arithmetic rule: a number at each leaf and an operator at each internal position. Its width-summing part has the same branching shape as the region tree, but the positions now hold `+`, `2`, `3`, and so on. An extra multiplication root connects the 8 cm height to the whole width.

The expression tree answers **how to calculate** area; the region tree answers **which pieces came from which cut**. We keep the board and its numbers the same while changing what each position represents.

> **Background link:** Section 8.4's postorder traversal finished child subtrees before their parent. Expression-tree evaluation uses exactly that timing: calculate both operands before applying their parent operator.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 8.5 Case Study: An Expression Tree

<span id="part-1-nodes"></span>

### 1. Give operands and operators different jobs

The book's `ExpressionTree` is a specialized **linked binary tree** (Code Fragment 8.35). Each internal position stores a binary operator such as `+`, `-`, `*`, or `/`. Each leaf stores a numeric token. For the book's Python class, **every token passed to the constructor must be a string**: use `"8"`, not `8`. Evaluation later converts a leaf token with `float(...)`.

Because every operator takes a left and a right operand, this is a **proper binary tree**: each internal position has exactly two children. Our complete area expression has six numeric leaves (`8, 2, 3, 4, 1, 2`) and five operators (four `+` signs and one `*`), so it has `6 + 5 = 11` positions. This also matches the proper-tree rule from Section 8.2: the number of leaves is one more than the number of internal positions.

<span id="part-1-board"></span>

### 2. Read the board's area tree

```text
*   board area
├── 8   height
└── +   whole width
    ├── +   L width
    │   ├── 2   LL width
    │   └── 3   LR width
    └── +   R width
        ├── 4   RL width
        └── +   RR width
            ├── 1   RRL width
            └── 2   RRR width
```

At the root, `*` means **left result times right result**: `8 × 12 = 96`. Within the right subtree, each `+` combines the widths below it. The left and right child positions are meaningful; swapping operands changes expressions that use `-` or `/`, even when some additions happen to keep the same value.

The numbers carry units in our reasoning: `8 cm × 12 cm = 96 cm²`. The textbook class calculates ordinary numbers and does not check units for us.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Construct an ExpressionTree from Smaller Trees

<span id="part-2-constructor"></span>

### 1. Use the two constructor forms

The class offers two ways to start a tree:

| Form | What it creates | Board example |
| :--- | :--- | :--- |
| `ExpressionTree(value)` | One leaf containing a value token. | `ExpressionTree("2")` |
| `ExpressionTree(op, left, right)` | An operator root with two existing expression trees as children. | `ExpressionTree("+", ExpressionTree("2"), ExpressionTree("3"))` |

The constructor first creates its root using the inherited `_add_root` operation. In the three-argument form it uses `_attach` from Section 8.3 to connect the two operand trees. **Attachment transfers their nodes and leaves the donor tree objects empty**, so create a separate leaf tree wherever a value appears twice. The book's class uses nonpublic update methods to build the expression tree; callers use the constructor forms shown here.

<span id="part-2-assemble"></span>

### 2. Assemble the board calculation

This method-call sketch assumes the textbook's `ExpressionTree` and `LinkedBinaryTree` classes have already been defined:

```python
left_width = ExpressionTree(
    "+", ExpressionTree("2"), ExpressionTree("3")
)
rightmost_width = ExpressionTree(
    "+", ExpressionTree("1"), ExpressionTree("2")
)
right_width = ExpressionTree(
    "+", ExpressionTree("4"), rightmost_width
)
whole_width = ExpressionTree("+", left_width, right_width)
area = ExpressionTree("*", ExpressionTree("8"), whole_width)

print(area)             # (8*((2+3)+(4+(1+2))))
print(area.evaluate())  # 96.0
```

The tree for `1 + 2` becomes the right child of the tree for `4 + (1 + 2)`. That tree becomes the right child of the whole-width tree. Finally, the whole-width tree becomes the right child of the area tree. This is **bottom-up composition**: make small expressions, then combine them.

After the final attachment, use `area` to inspect the result. The donor variables such as `whole_width` refer to tree objects that `_attach` has emptied.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Composing a Parenthesized String Representation

<span id="part-3-inorder"></span>

### 1. Why inorder tokens need parentheses

An inorder traversal visits **left subtree, operator, right subtree**. On our area tree, a plain inorder token stream would be:

```text
8 * 2 + 3 + 4 + 1 + 2
```

If read using ordinary arithmetic precedence, this means `(8 × 2) + 3 + 4 + 1 + 2 = 26`, not the board's `96 cm²`. The missing parentheses hide that the `*` root must multiply 8 by the **entire** width expression.

The tree itself has no ambiguity: its `*` root connects `8` to the whole-width subtree. The ambiguity appears only when we flatten that tree into a string without marking the subtree boundaries.

<span id="part-3-string"></span>

### 2. Produce the expression one piece at a time

The book's `__str__` method builds a fully parenthesized string (Code Fragment 8.35). At a leaf, append its value. At an operator, append `(`, recursively print the left subtree, append the operator, recursively print the right subtree, and append `)`.

```text
write(p):
    if p is a leaf: write its token
    otherwise:
        write "("
        write(left child)
        write p's operator
        write(right child)
        write ")"
```

For the board, `str(area)` is:

```text
(8*((2+3)+(4+(1+2))))
```

Each pair of parentheses encloses one operator position and both of its operand subtrees. The method collects short string pieces in a list, then joins them once. This takes **O(n)** time and output space for an `n`-position expression tree when each token has bounded length; recursive calls use **O(h)** stack space for tree height `h`.

The familiar traversal orders still describe the same tree:

| Order | Tokens from the board's area tree |
| :--- | :--- |
| Preorder (operator first) | `* 8 + + 2 3 + 4 + 1 2` |
| Inorder (without grouping) | `8 * 2 + 3 + 4 + 1 + 2` |
| Postorder (operator last) | `8 2 3 + 4 1 2 + + + *` |

Preorder and postorder here are useful connections to Section 8.4. The book's `__str__` specifically adds parentheses around the inorder form so the printed expression retains the tree's grouping.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Expression Tree Evaluation

<span id="part-4-postorder"></span>

### 1. Return values from leaves to the root

Evaluation is a **postorder-style recursion** (Code Fragments 8.36 and 8.37). A leaf returns its numeric value. An operator position asks its left and right subtrees for their values, applies its operator to those results, and returns the new value to its parent.

```text
evaluate(p):
    if p is a leaf: return its numeric value
    left_value  = evaluate(left child)
    right_value = evaluate(right child)
    return left_value (operator at p) right_value
```

The book's Python method uses `float(p.element())` at a leaf, which is why `area.evaluate()` returns `96.0`. It handles `+`, `-`, `/`, and multiplication. **Keep the left and right results in order**: `12 - 9` and `9 - 12` differ, as do `12 / 3` and `3 / 12`.

<span id="part-4-trace"></span>

### 2. Trace the board's arithmetic

| Operator subtree | Child values already known | Returned value |
| :--- | :--- | ---: |
| `2 + 3` (`L` width) | `2`, `3` cm | 5 cm |
| `1 + 2` (`RR` width) | `1`, `2` cm | 3 cm |
| `4 + (1 + 2)` (`R` width) | `4`, `3` cm | 7 cm |
| `(2 + 3) + (4 + (1 + 2))` (whole width) | `5`, `7` cm | 12 cm |
| `8 × whole width` (area) | `8 cm`, `12 cm` | 96 cm² |

The root cannot be evaluated until its whole-width child returns `12`. Likewise, the right-width `+` waits for `1 + 2`. Every position is processed once, so evaluation takes **O(n)** time and **O(h)** recursion space for `n` positions and height `h`, assuming constant-time arithmetic on these small numbers. Invalid numeric leaf strings and division by zero still cause ordinary Python errors; this algorithm does not make them meaningful measurements.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Building an Expression Tree

<span id="part-5-tokens"></span>

### 1. Start with fully parenthesized tokens

The constructor lets us assemble a tree by hand. Code Fragment 8.38 instead builds one from a **tokenized, fully parenthesized** expression. A *token* is one complete number, operator, or parenthesis. In particular, `12` must be one token, not separate `1` and `2` tokens.

For the board's `RR` region, the width is `12 − 9 = 3 cm` and the height is `8 cm`. Its area expression and token sequence are:

```text
((12-9)*8) = 24 cm²

["(", "(", "12", "-", "9", ")", "*", "8", ")"]
```

The printed expression has two operator positions: subtraction below multiplication. Compare the bare inorder tokens `12 - 9 * 8`: ordinary precedence would calculate `12 − 72 = −60`, which is not the rectangle's area.

<span id="part-5-stack"></span>

### 2. Combine subtrees with a stack

The builder scans tokens from left to right and uses a **last-in, first-out stack**. It ignores `(`. It pushes an operator string when it sees an operator, and it pushes a one-position `ExpressionTree` when it sees a number. A `)` means one subexpression has ended: pop its **right tree**, then its **operator**, then its **left tree**; make a new operator tree and push it back.

| Just processed | Stack from bottom to top | Meaning |
| :--- | :--- | :--- |
| `12`, `-`, `9` | `[tree(12), "-", tree(9)]` | Three pieces of `(12-9)` are ready. |
| First `)` | `[tree(12-9)]` | Combine them into one subtraction tree. |
| `*`, `8` | `[tree(12-9), "*", tree(8)]` | Three pieces of the outer product are ready. |
| Final `)` | `[tree((12-9)*8)]` | Combine them into the finished area tree. |

The pop order is important: `9` is the right operand of `-`, and `12` is its left operand. Reversing them would calculate a different width. The resulting tree prints `((12-9)*8)` and evaluates to `24.0` in the book's class.

For our full board, the same builder can scan tokens for `(8*((2+3)+(4+(1+2))))`. Each completed parenthesized piece becomes one subtree that can be used in a larger piece.

<span id="part-5-limits"></span>

### 3. Know what the builder assumes

The book states **O(n)** time for building a tree from `n` already prepared tokens: each token is scanned once, and stack pushes, pops, and linked-tree attachments take constant time per step. The stack may hold **O(n)** items. Preparing tokens, especially recognizing a multidigit number as one token, is a separate step.

This builder relies on complete parentheses to decide when to combine subtrees. It does **not** parse an ordinary unparenthesized expression using operator precedence. It also assumes valid input rather than supplying a full set of checks for missing operands, mismatched parentheses, or extra tokens. For learning the algorithm, start with a correct token list like the one above.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How does the tree recover the whole board's area?</strong></summary>

**Scenario:** The final strip widths are `2, 3, 4, 1, 2 cm`, and every strip is `8 cm` high.

**Method:** Combine widths in their cut-plan groups: `2 + 3 = 5`, `1 + 2 = 3`, `4 + 3 = 7`, then `5 + 7 = 12 cm`. Apply the root operator: `8 × 12 = 96 cm²`.

**Tree lesson:** The width subtrees return their results before the multiplication root runs.

</details>

<details>
<summary><strong>Case Study 2: Can a different expression tree give the same area?</strong></summary>

**Scenario:** Calculate each finished strip's area separately, then add them.

**Calculation:** `(2 × 8) + (3 × 8) + (4 × 8) + (1 × 8) + (2 × 8) = 16 + 24 + 32 + 8 + 16 = 96 cm²`.

**Tree lesson:** This expression has several multiplication positions and a different shape from `8 × ((2 + 3) + (4 + (1 + 2)))`. The distributive law makes their results equal; equal results do not require identical expression trees.

</details>

<details>
<summary><strong>Case Study 3: Why does the rightmost region need parentheses?</strong></summary>

**Scenario:** `RR` runs from `x = 9 cm` to `x = 12 cm` and has height `8 cm`.

**Calculation:** `((12 − 9) × 8) = 3 × 8 = 24 cm²`. Without the grouping, `12 − 9 × 8` evaluates to `−60` under standard arithmetic precedence.

**Tree lesson:** The subtree for subtraction must finish before its parent multiplication. The parenthesized string preserves that relationship.

</details>

<details>
<summary><strong>Case Study 4: Why must the token "12" stay together?</strong></summary>

**Scenario:** The `RR` expression begins with the coordinate `12 cm`.

**Result:** A leaf storing `"12"` evaluates to `12.0`. Leaves storing `"1"` and `"2"` would be two separate operands and would describe a different, malformed tree for `((12-9)*8)`. Tokenization must recognize the complete number before the stack builder runs.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 8.5 idea | Plain-language meaning | Board example |
| :--- | :--- | :--- |
| **Expression-tree positions** | Leaves hold operands; internal positions hold two-operand operators. | Widths `2, 3, 4, 1, 2` and height `8` join under `+` and `*`. |
| **Construction** | Combine small operand trees under new operator roots. | Build `1+2`, then `4+(1+2)`, then the whole width and area. |
| **Parenthesized display** | Print subtree boundaries as well as inorder tokens. | `(8*((2+3)+(4+(1+2))))`. |
| **Evaluation** | Calculate child results before applying the parent operator. | Width `12 cm` returns to the root, which gives `96 cm²`. |
| **Stack builder** | At `)`, combine right tree, operator, and left tree. | `((12-9)*8)` becomes an area tree for `RR`. |
| **Input preconditions** | Supply valid, fully parenthesized tokens. | Keep `"12"` as one token. |

[🔝 Back to Top](#top)
