<span id="top"></span>

# Trees — Section 8.2: Binary Trees

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 8 PDF](<../../file/Data Structures and Algorithms in Python - C08.pdf>), Section 8.2 (printed pages 311–316).  
> **Topic:** Binary-tree structure; proper and improper trees; decision and expression trees; the BinaryTree ADT; node, leaf, and height bounds.  
> **Domain focus:** Four selected riders from the [official 21 March 2026 Brazilian Grand Prix MotoGP Tissot Sprint classification](https://resources.motogp.com/files/results/2026/BRA/MotoGP/SPR/Classification.pdf) at Goiânia.  
> **Learning goal:** Label left and right children correctly, navigate a binary tree, and check its size and height properties with concrete examples.  
> **User Prompt:** "Reexplain Section 8.2 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Two-Team Sprint View](#background-intuition)
   - [1. Select verified riders from one session](#background-results)
   - [2. Draw the binary teaching tree](#background-tree)
2. [Part 1: Section 8.2 — Binary Trees](#part-1)
   - [1. Left, right, and at most two children](#part-1-shape)
   - [2. Proper versus improper binary trees](#part-1-proper)
   - [3. A yes-or-no decision tree](#part-1-decision)
   - [4. An arithmetic expression tree](#part-1-expression)
   - [5. The recursive definition](#part-1-recursive)
3. [Part 2: Section 8.2.1 — The Binary Tree Abstract Data Type](#part-2)
   - [1. Left, right, and sibling](#part-2-accessors)
   - [2. Build sibling and ordered children](#part-2-derived)
   - [3. What the abstract class provides](#part-2-base)
4. [Part 3: Section 8.2.2 — Properties of Binary Trees](#part-3)
   - [1. How many positions fit at each level?](#part-3-levels)
   - [2. General and proper tree bounds](#part-3-bounds)
   - [3. Why a proper tree has one extra leaf](#part-3-leaves)
5. [Part 4: One Complete Worked Solution](#part-4)
   - [1. Answer questions by hand](#part-4-questions)
   - [2. Check them with runnable Python](#part-4-program)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Two-Team Sprint View

<span id="background-results"></span>

### 1. Select Verified Riders From One Session

The [official MotoGP timing sheet](https://resources.motogp.com/files/results/2026/BRA/MotoGP/SPR/Classification.pdf) records the **Brazilian Grand Prix Tissot Sprint on Saturday, 21 March 2026**. We will model this **four-rider selection**, not the full field:

| Sprint place | Rider | Team |
| :---: | :--- | :--- |
| P1 | Marc Márquez | Ducati Lenovo Team |
| P8 | Francesco Bagnaia | Ducati Lenovo Team |
| P6 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |
| P13 | Álex Rins | Monster Energy Yamaha MotoGP Team |

The preceding [Section 8.1 explanation](08-01-general-trees.md) used three teams under one Sprint root. That shape has three children at the root. Here we select **two teams** so the session → team → rider grouping itself fits a binary tree. No official result is changed by choosing a smaller teaching view.

**Why this example?** Marc and Fabio are the requested riders. Their actual teammates give each team two children, allowing us to see a fully branched binary tree and later a one-child variation.

**How to set it up:** Verify the one session and each team membership. Select two team branches. Give every position a single parent except the session root.

<span id="background-tree"></span>

### 2. Draw the Binary Teaching Tree

```text
2026 Brazilian GP — MotoGP Tissot Sprint (selected view)
├── L: Ducati Lenovo Team
│   ├── L: Marc Márquez (P1)
│   └── R: Francesco Bagnaia (P8)
└── R: Monster Energy Yamaha MotoGP Team
    ├── L: Fabio Quartararo (P6)
    └── R: Álex Rins (P13)
```

`L` and `R` label a **left or right child of that child's parent**. They are structural labels, not race-side positions. We chose this order by placing the selected team with the better best finish on the left: Ducati's best is P1, Yamaha's is P6. Within each team, the better-placed rider is on the left. This is **our modeling rule**, not an official team ranking or a claim that the drawn riders finished next to one another.

This tree has **seven positions**: one session, two teams, and four riders. A rider's Sprint place, such as Fabio's **P6**, is stored data; it is not the rider's tree position or depth.

**Why this example?** The same tree can answer structural questions about Marc and Fabio and provide exact counts for Section 8.2's formulas.

**How to read it:** From the root, take the right child to Yamaha, then the left child to Fabio. Record the path as `R → L`; it has two edges, so Fabio's depth is 2.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 8.2 — Binary Trees

<span id="part-1-shape"></span>

### 1. Left, Right, and At Most Two Children

A **binary tree** is an **ordered tree** in which each position has at most two children. Every present child is specifically labeled **left** or **right**, and the left child comes before the right child. "At most two" allows **zero**, **one**, or **two** children. A position with only a right child is valid; its left slot is simply empty.

The subtree below a left child is the **left subtree** of its parent; likewise for the right. In our model, Ducati and its two riders form the root's left subtree. Yamaha and its two riders form the right subtree. Swapping Ducati and Yamaha would change this **ordered binary model**, even though the underlying team memberships would remain true.

| Position | Left child | Right child |
| :--- | :--- | :--- |
| Sprint root | Ducati | Yamaha |
| Ducati | Marc | Francesco |
| Yamaha | Fabio | Álex |
| Fabio | `None` | `None` |

**Why this example?** A table of left and right slots makes the labels explicit. Merely drawing two branches does not tell us which is which unless we state the rule.

**How to solve a child question:** Find the parent position, then inspect its **left** and **right** slots separately. For example, `right(Ducati)` is Francesco, while `left(Yamaha)` is Fabio.

<span id="part-1-proper"></span>

### 2. Proper Versus Improper Binary Trees

A binary tree is **proper**, also called **full**, when every position has either **zero or two** children. Every internal position then has exactly two children. Our main tree is proper: the session and both teams have two children; all four riders have none.

Now make a **smaller teaching selection** that omits Álex Rins's result card. Yamaha still has Fabio in its left slot but no right child. This six-position tree is still binary, because no position has more than two children, but it is **improper** because Yamaha has exactly one child. Álex remains a real P13 finisher in the official Sprint; we have only removed his card from this teaching copy.

```text
Yamaha in the smaller teaching selection
├── L: Fabio Quartararo (P6)
└── R: None
```

| View | Internal positions | Leaves | Proper? |
| :--- | ---: | ---: | :--- |
| Four selected riders | 3 | 4 | Yes: every internal position has two children. |
| Three selected riders | 3 | 3 | No: Yamaha has only one child. |

**Why this example?** A one-card difference isolates the rule "zero or two." It also prepares us to see which counting formulas require a proper tree.

**How to test:** Count the children of **every** position. If even one position has exactly one child, the binary tree is improper.

<span id="part-1-decision"></span>

### 3. A Yes-or-No Decision Tree

The book uses **decision trees** to model a sequence of yes-or-no questions. An internal position stores a question; its left and right edges represent the two answers; a leaf gives the outcome. For the **same four selected riders only**, use left = **Yes** and right = **No**:

```text
Is the rider on Ducati Lenovo Team?
├── L / Yes: Did the rider finish P1?
│   ├── L / Yes: Marc Márquez
│   └── R / No:  Francesco Bagnaia
└── R / No:  Did the rider finish P6?
    ├── L / Yes: Fabio Quartararo
    └── R / No:  Álex Rins
```

For Fabio, answer **No** to Ducati and **Yes** to P6: `R → L → Fabio`. The root's "No" branch means Yamaha **only within this selected four-rider set**; the full Sprint also had riders on other teams. Each question has two answer branches, so this decision tree is proper.

**Why this example?** It shows another use for the same binary shape: the internal positions now store questions rather than team names.

**How to solve a lookup:** Start at the first question. Follow exactly one Yes/No edge per answer. Stop at a leaf and check that its rider matches the answers.

<span id="part-1-expression"></span>

### 4. An Arithmetic Expression Tree

The book also represents arithmetic with a binary tree: leaves hold numbers or variables, and internal positions hold operators. An operator's **left and right** operands are its two children. Using our four riders' **Sprint places**, consider this teaching calculation:

```text
+
├── L: −
│   ├── L: Francesco Bagnaia (P8)
│   └── R: Marc Márquez (P1)
└── R: −
    ├── L: Álex Rins (P13)
    └── R: Fabio Quartararo (P6)
```

Read the left subtraction as `8 − 1 = 7` and the right subtraction as `13 − 6 = 7`. Then the root gives `7 + 7 = 14`. This is the **sum of two within-team differences in finishing-place numbers**, an illustration of expression evaluation, **not an official MotoGP statistic**. Reversing either subtraction's children changes its value, so left and right matter. Every operator here has two operands, making this expression tree proper. A unary operator, such as negation of one number, could create a one-child, improper tree.

**Why this example?** It uses the same four verified result places to show that binary-tree nodes can store **operations** as well as riders or teams.

**How to evaluate it:** Start at the numeric leaves. Calculate each internal subtraction from its left and right values, then calculate the root's addition. Work **bottom up**.

<span id="part-1-recursive"></span>

### 5. The Recursive Definition

The book gives a second way to define a binary tree. It is either **empty**, or it consists of a root plus a **left subtree** and a **right subtree**, either of which may be empty. The same rule applies recursively inside each subtree.

For our Sprint tree, the root is the session. Its left subtree starts at Ducati; its right subtree starts at Yamaha. At Marc, both subtrees are empty, so Marc is a leaf. In the three-rider teaching view, Yamaha's left subtree starts at Fabio and its right subtree is empty.

**Why this example?** It explains precisely how a one-child binary tree is possible: one subtree exists while the other is empty.

**How to use the definition:** Name a root, then identify its left and right subtrees. Repeat for each child until a subtree is empty. An empty subtree is a **missing child**, not an extra node.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 8.2.1 — The Binary Tree Abstract Data Type

<span id="part-2-accessors"></span>

### 1. Left, Right, and Sibling

The **BinaryTree ADT** adds three structural questions to the general Tree ADT from Section 8.1:

| Operation | Meaning | Four-rider tree |
| :--- | :--- | :--- |
| `T.left(p)` | Return `p`'s left child, or `None` if absent. | `T.left(Sprint)` is Ducati. |
| `T.right(p)` | Return `p`'s right child, or `None` if absent. | `T.right(Sprint)` is Yamaha. |
| `T.sibling(p)` | Return the other child of `p`'s parent, or `None` if absent. | `T.sibling(Marc)` is Francesco. |

Fabio's sibling is Álex; Marc's sibling is Francesco. The Sprint root has **no sibling** because it has no parent. In the smaller three-rider teaching tree, Fabio has **no sibling** because Yamaha's right slot is empty. Yet Fabio can still be Yamaha's **left child**: the absent right slot does not shift him.

All the general-tree operations still apply, including `root`, `parent`, `num_children`, `is_leaf`, and `depth`. For the full four-rider tree, `num_children(Yamaha) == 2`. For the smaller view, the same team has one child.

**Why this example?** Marc and Fabio let us test both the "other child" case and the "no sibling" case with a single session's selection.

**How to solve a sibling query:** Find `p`'s parent. If there is none, return `None`. Otherwise, check whether `p` is the left or right child and return the **opposite** slot, which may also be `None`.

<span id="part-2-derived"></span>

### 2. Build Sibling and Ordered Children

The book's `BinaryTree` base class leaves `left` and `right` abstract for a concrete subclass. It can still build `sibling` and `children` from them and the inherited `parent`:

```python
def sibling(self, p):
    q = self.parent(p)
    if q is None:                # p is the root
        return None
    if p == self.left(q):
        return self.right(q)     # may be None
    return self.left(q)          # may be None

def children(self, p):
    left_child = self.left(p)
    right_child = self.right(p)
    if left_child is not None:
        yield left_child
    if right_child is not None:
        yield right_child
```

On the Sprint root, `children` yields Ducati and then Yamaha. On Yamaha, it yields Fabio and then Álex. On Fabio, it yields nothing. The **left-before-right** yield order is part of the binary tree's ordered structure. In the smaller view, it yields only Fabio for Yamaha.

**Why this example?** The method has no special knowledge of teams or riders. It works for the decision and expression trees too, because it relies only on left and right slots.

**How to trace it:** Evaluate `left(p)`, then `right(p)`. Skip each `None`. For `sibling(Marc)`, find Ducati as Marc's parent, observe Marc is its left child, and return Ducati's right child, Francesco.

<span id="part-2-base"></span>

### 3. What the Abstract Class Provides

The book defines `BinaryTree` as a subclass of `Tree`. It inherits the general-tree interface and nested `Position` abstraction, adds the abstract `left` and `right` methods, and supplies the derived `sibling` and `children` methods above. A concrete binary tree must still decide **how nodes are stored** and implement the remaining abstract operations.

Section 8.2 defines **accessors**, not a standard operation for inserting or removing riders. Our smaller three-rider view is a separate teaching model; it does not imply a mutation of the official Sprint classification.

**Why this example?** The same abstract interface can describe a team hierarchy, a decision tree, or an expression tree despite their very different stored elements.

**How to use the ADT:** Ask `left` and `right` when the side matters. Ask `children` when you want all existing children in order. Ask `sibling` when you start from one child and need the other.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 8.2.2 — Properties of Binary Trees

<span id="part-3-levels"></span>

### 1. How Many Positions Fit at Each Level?

A **level** contains all positions at one depth. The root is level **0**. Since each position has at most two children, level `d` can contain at most **`2^d` positions**: one at level 0, two at level 1, four at level 2, eight at level 3, and so on.

| Level / depth `d` | Maximum `2^d` | Our selected Sprint tree |
| ---: | ---: | ---: |
| 0 | 1 | 1 session |
| 1 | 2 | 2 teams |
| 2 | 4 | 4 riders |
| 3 | 8 | 0; our tree stops at level 2 |

Our tree fills levels 0 through 2, so its **height is 2** and its node count is `1 + 2 + 4 = 7`. The general maximum for height `h` is the sum `1 + 2 + 4 + … + 2^h = 2^(h+1) − 1`. It is a **maximum**, not a promise that every binary tree is filled.

**Why this example?** The selected session happens to give one, two, and four positions on successive levels, making the doubling rule visible.

**How to solve a level-capacity question:** Start with one root. Double the maximum for every step downward, or calculate `2^d` directly. Then compare the actual count with that cap.

<span id="part-3-bounds"></span>

### 2. General and Proper Tree Bounds

The book's Proposition 8.8 concerns a **nonempty** binary tree. Let `n` be its total positions, `n_E` its leaves (external positions), `n_I` its internal positions, and `h` its edge-based height. All logarithms below have base **2**.

| Quantity | Any nonempty binary tree | If it is proper |
| :--- | :--- | :--- |
| Total positions `n` | `h + 1 ≤ n ≤ 2^(h+1) − 1` | `2h + 1 ≤ n ≤ 2^(h+1) − 1` |
| Leaves `n_E` | `1 ≤ n_E ≤ 2^h` | `h + 1 ≤ n_E ≤ 2^h` |
| Internal positions `n_I` | `h ≤ n_I ≤ 2^h − 1` | `h ≤ n_I ≤ 2^h − 1` |
| Height `h` from `n` | `log₂(n + 1) − 1 ≤ h ≤ n − 1` | `log₂(n + 1) − 1 ≤ h ≤ (n − 1)/2` |

The **lower** bound `h + 1 ≤ n` comes from a longest root-to-leaf path: height `h` means that path has `h + 1` positions. The **upper** bound adds the largest possible level counts through depth `h`. To bound leaves, a height-0 tree has one leaf; a height-`h` root has at most two child subtrees of height at most `h − 1`, each with at most `2^(h−1)` leaves. Therefore `n_E ≤ 2^h`. Along a longest path, all `h` positions before its leaf are internal, so `n_I ≥ h`. At most all positions in levels `0` through `h − 1` can be internal, giving `n_I ≤ 2^h − 1`.

Properness strengthens the lower counts. Each of the `h` internal positions on a longest path has a second child, and each of those off-path branches ends in at least one leaf. Together with the path's final leaf, that gives at least `h + 1` leaves and at least `2h + 1` total positions. The height bounds are the same size inequalities solved for `h`: a tree with more positions needs enough levels, while a proper tree needs at least two new positions for each added level.

For our proper Sprint view, `h = 2`, `n = 7`, `n_E = 4`, and `n_I = 3`:

```text
Total:    2h + 1 = 5 ≤ 7 ≤ 2^(h+1) − 1 = 7
Leaves:   h + 1 = 3 ≤ 4 ≤ 2^h = 4
Internal: h = 2 ≤ 3 ≤ 2^h − 1 = 3
Height:   log₂(7 + 1) − 1 = 2 ≤ 2 ≤ (7 − 1)/2 = 3
```

A **proper tree need not fill every level**. For the same four selected riders, imagine asking "Is it Marc?" at the root. A Yes leaf gives Marc; a No child asks "Is it Fabio?" A Yes leaf there gives Fabio; a No child asks "Is it Francesco?" Its Yes and No leaves give Francesco and Álex. Each question still has two children, but the four leaves are at depths 1, 2, 3, and 3. This proper tree has `h = 3`, `n_I = 3`, `n_E = 4`, and `n = 7`, meeting the proper lower bounds `n = 2h + 1` and `n_E = h + 1`. The questions identify riders only within our four-rider selection. At the other extreme, a single-node tree has `h = 0`, `n = n_E = 1`, and `n_I = 0`; it also satisfies all the bounds.

**Why this example?** The seven-position tree meets several upper bounds exactly, yet the table makes clear which inequalities continue to apply when a tree is less full.

**How to check a bound:** Count `n`, `n_E`, and `n_I`; compute `h` as the longest root-to-leaf edge count; substitute those values into the correct column. Use the proper column only after confirming every internal position has two children.

<span id="part-3-leaves"></span>

### 3. Why a Proper Tree Has One Extra Leaf

Proposition 8.9 says that every **nonempty proper binary tree** has

```text
n_E = n_I + 1
```

Our tree has four rider leaves and three internal positions (the session and two teams), so `4 = 3 + 1`. Here is a short edge-count explanation: each internal position in a proper binary tree has **two** child edges, giving `2n_I` edges. Any nonempty tree has `n − 1` edges, and `n = n_I + n_E`. Therefore

```text
2n_I = n − 1 = n_I + n_E − 1
so n_E = n_I + 1.
```

The book also proves the relation by repeatedly removing a leaf together with its parent, then reconnecting that leaf's former sibling to the grandparent (or making the sibling the new root). This keeps the smaller tree proper. Each step removes one leaf and one internal position, leaving one final leaf. The relation depends on **properness**. In our three-rider teaching view, Yamaha has one child: `n_I = 3` and `n_E = 3`, so `n_E = n_I + 1` is false. For the one-node proper tree, it reads `1 = 0 + 1`.

**Why this example?** The four-rider and three-rider views differ by one selected card. They show exactly why the extra-leaf equation is a special property, not a rule for every binary tree.

**How to solve a count question:** Confirm the tree is proper, count either internal positions or leaves, then use `n_E = n_I + 1`. To check the result, verify `n = n_I + n_E` and `edges = n − 1`.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Complete Worked Solution

<span id="part-4-questions"></span>

### 1. Answer Questions by Hand

Suppose we are asked: **In the four-rider teaching tree, what are the root's left and right children, Marc's and Fabio's siblings, Fabio's depth, the tree's height, and the internal/leaf counts? Is the tree proper?**

| Step | Work | Answer |
| :--- | :--- | :--- |
| Read the root slots. | Follow the edges labeled `L` and `R`. | Left: Ducati; right: Yamaha. |
| Find Marc's sibling. | Marc is Ducati's left child; take Ducati's right child. | Francesco Bagnaia. |
| Find Fabio's sibling. | Fabio is Yamaha's left child; take Yamaha's right child. | Álex Rins. |
| Find Fabio's depth. | Sprint → Yamaha → Fabio crosses two edges. | `2`. |
| Find height. | Riders have height `0`; teams `1`; root `2`. | `2`. |
| Count kinds of position. | Root and teams have children; riders do not. | `n_I = 3`, `n_E = 4`, `n = 7`. |
| Test properness. | Every internal position has two children. | Yes. |
| Check the special equation. | `n_I + 1 = 3 + 1`. | `n_E = 4`, so it holds. |

**Why this example?** Every requested answer comes from either a labeled child slot or a count on the same small tree. It connects the ADT methods to the mathematical properties.

**How to solve it:** Resolve left/right and sibling questions first. Count edges for depth, work upward from leaves for height, count internal and external positions, and apply the proper-tree equation only after checking properness.

<span id="part-4-program"></span>

### 2. Check With Runnable Python

This code uses short unique IDs as **stand-ins for positions** and readable strings as their stored labels. The `left` and `right` dictionaries represent child slots, including `None` for missing children. It is a small concrete teaching model of the four selected results, not the book's abstract `BinaryTree` implementation.

```python
labels = {
    "sprint": "2026 Brazilian GP MotoGP Tissot Sprint",
    "ducati": "Ducati Lenovo Team",
    "yamaha": "Monster Energy Yamaha MotoGP Team",
    "marc": "Marc Márquez (P1)",
    "bagnaia": "Francesco Bagnaia (P8)",
    "fabio": "Fabio Quartararo (P6)",
    "rins": "Álex Rins (P13)",
}

left = {
    "sprint": "ducati",
    "ducati": "marc",
    "yamaha": "fabio",
    "marc": None,
    "bagnaia": None,
    "fabio": None,
    "rins": None,
}
right = {
    "sprint": "yamaha",
    "ducati": "bagnaia",
    "yamaha": "rins",
    "marc": None,
    "bagnaia": None,
    "fabio": None,
    "rins": None,
}

parents = {}
for p in labels:
    for child in (left[p], right[p]):
        if child is not None:
            parents[child] = p

def children(p):
    for child in (left[p], right[p]):
        if child is not None:
            yield child

def sibling(p):
    q = parents.get(p)
    if q is None:
        return None
    return right[q] if left[q] == p else left[q]

def depth(p):
    if p == "sprint":
        return 0
    return 1 + depth(parents[p])

def height(p):
    child_ids = tuple(children(p))
    if not child_ids:
        return 0
    return 1 + max(height(child) for child in child_ids)

num_leaves = sum(
    1 for p in labels if left[p] is None and right[p] is None
)
num_internal = len(labels) - num_leaves
proper = all(
    (left[p] is None) == (right[p] is None) for p in labels
)

print("Left of Sprint:", labels[left["sprint"]])
print("Right of Sprint:", labels[right["sprint"]])
print("Marc's sibling:", labels[sibling("marc")])
print("Fabio's sibling:", labels[sibling("fabio")])
print("Root's sibling:", sibling("sprint"))
print("Fabio's depth:", depth("fabio"))
print("Tree height:", height("sprint"))
print("Internal / leaves / total:", num_internal, num_leaves, len(labels))
print("Proper:", proper)
print("Leaves = internal + 1:", num_leaves == num_internal + 1)
```

```text
Left of Sprint: Ducati Lenovo Team
Right of Sprint: Monster Energy Yamaha MotoGP Team
Marc's sibling: Francesco Bagnaia (P8)
Fabio's sibling: Álex Rins (P13)
Root's sibling: None
Fabio's depth: 2
Tree height: 2
Internal / leaves / total: 3 4 7
Proper: True
Leaves = internal + 1: True
```

**Why this example?** The program exposes the two child slots and then derives sibling, depth, height, and counts. Each printed line checks a hand-worked answer above.

**How to modify it:** To inspect the smaller, improper teaching view, set `right["yamaha"] = None`, remove `"rins"` from `labels` and both child dictionaries, then rebuild `parents`. Yamaha will have one child, `proper` will be `False`, and the internal/leaf counts will be `3` and `3`. The official Sprint result remains unchanged.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section idea | Plain-language meaning | Brazilian Sprint teaching view |
| :--- | :--- | :--- |
| Binary tree | Each position has a named left and right slot, with at most two children. | Sprint's left child is Ducati; right child is Yamaha. |
| Proper tree | Every position has either zero or two children. | Seven-position four-rider tree: proper. |
| Improper tree | At least one internal position has exactly one child. | Smaller view with only Fabio under Yamaha. |
| Decision tree | Follow Yes/No edges until an outcome leaf. | Fabio follows No → Yes among the selected four. |
| Expression tree | Evaluate operator positions from their two child values. | `(8 − 1) + (13 − 6) = 14`, an illustrative calculation. |
| BinaryTree ADT | Ask for `left`, `right`, `sibling`, and inherited tree operations. | Fabio's sibling is Álex. |
| Level cap | Level `d` has at most `2^d` positions. | Levels 0, 1, 2 contain 1, 2, 4 positions. |
| Height and size | A height-`h` binary tree has at most `2^(h+1) − 1` positions. | At height 2, the cap is 7 and our tree has 7. |
| Proper-tree leaf equation | `n_E = n_I + 1` for a nonempty proper tree. | Four rider leaves = three internal positions + one. |

[🔝 Back to Top](#top)
