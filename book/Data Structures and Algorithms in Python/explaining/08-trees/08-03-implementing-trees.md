<span id="top"></span>

# Trees — Section 8.3: Implementing Trees

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 8 PDF](<../../file/Data Structures and Algorithms in Python - C08.pdf>), Section 8.3 (printed pages 317–327).<br>
> **Topic:** Linked binary trees, their positions and updates; array-based binary trees; linked general trees.<br>
> **Domain focus:** Selected riders and teams from the [official 21 March 2026 Brazilian Grand Prix MotoGP Tissot Sprint classification](https://resources.motogp.com/files/results/2026/BRA/MotoGP/SPR/Classification.pdf) at Goiânia.<br>
> **Learning goal:** Turn the tree interfaces from Sections 8.1–8.2 into concrete storage, trace pointer and index changes, and choose a representation for a tree's shape.<br>
> **User Prompt:** "Reexplain Section 8.3 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Tree, Different Storage](#background-intuition)
   - [1. Start with the same Sprint results](#background-results)
   - [2. Separate the visible tree from its representation](#background-storage)
2. [Part 1: Section 8.3 — From Interface to Storage](#part-1)
   - [1. What a concrete class must provide](#part-1-abstract)
   - [2. Position, node, and element](#part-1-position)
3. [Part 2: Section 8.3.1 — Linked Structure for Binary Trees](#part-2)
   - [1. Store links in each node](#part-2-node)
   - [2. Validate positions and navigate](#part-2-validate)
   - [3. Create, attach, and replace](#part-2-build)
   - [4. Delete and repair the links](#part-2-delete)
   - [5. Understand the running costs](#part-2-cost)
4. [Part 3: Section 8.3.2 — Array-Based Representation of a Binary Tree](#part-3)
   - [1. Calculate the index of each position](#part-3-formulas)
   - [2. Store the Sprint tree in an array](#part-3-map)
   - [3. Explain holes, space, and editing cost](#part-3-cost)
5. [Part 4: Section 8.3.3 — Linked Structure for General Trees](#part-4)
   - [1. Use a list of child links](#part-4-list)
   - [2. Restore the three-team Sprint view](#part-4-example)
6. [Part 5: One Complete Worked Python Example](#part-5)
   - [1. Plan and trace the edits](#part-5-plan)
   - [2. Run a small linked binary tree](#part-5-program)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Tree, Different Storage

<span id="background-results"></span>

### 1. Start With the Same Sprint Results

The [official MotoGP timing sheet](https://resources.motogp.com/files/results/2026/BRA/MotoGP/SPR/Classification.pdf) identifies the **Brazilian Grand Prix Tissot Sprint on Saturday, 21 March 2026**. As in the [Section 8.2 explanation](08-02-binary-trees.md), start with **four selected classified riders**:

| Sprint place | Rider | Team |
| :---: | :--- | :--- |
| P1 | Marc Márquez | Ducati Lenovo Team |
| P8 | Francesco Bagnaia | Ducati Lenovo Team |
| P6 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |
| P13 | Álex Rins | Monster Energy Yamaha MotoGP Team |

This is a **teaching subset**, not the complete Sprint classification. The tree below groups result records by team. We choose the team with the better best finish for the left branch; within each team, the better-placed rider goes left. These left/right labels are **our model**, not an official team ranking.

```text
Sprint (root)
├── L: Ducati Lenovo Team
│   ├── L: Marc Márquez (P1)
│   └── R: Francesco Bagnaia (P8)
└── R: Monster Energy Yamaha MotoGP Team
    ├── L: Fabio Quartararo (P6)
    └── R: Álex Rins (P13)
```

**Why this example?** The seven-position shape is small enough to store twice and compare directly. Marc and Fabio each have a teammate, so both team positions have left and right children.

**How to set it up:** Copy the verified rider/team/place data from this one session. Give the root two team children and each team its two selected rider children. Keep **P1** and **P6** as result data, separate from structural positions and array indices.

<span id="background-storage"></span>

### 2. Separate the Visible Tree From Its Representation

The diagram tells us **which position is related to which**. A program still needs a way to store and recover those relations. Section 8.3 compares:

| Representation | How it finds children | Best teaching question |
| :--- | :--- | :--- |
| Linked binary tree | Each node stores parent, left, and right references. | How does changing a few links edit the tree? |
| Array-based binary tree | Arithmetic on an index gives possible parent and child slots. | Which indices represent Marc and Fabio? |
| Linked general tree | Each node stores a collection of child references. | How can the Sprint root hold three or more teams? |

The first two can store our two-team **binary** view. For the general-tree view, we will restore a third verified team from this same Sprint. The data facts stay the same; the representations and teaching selections change.

**Why this example?** Seeing one set of results in different storage forms separates a tree's **logical shape** from its **physical representation**.

**How to compare them:** For each form, locate the root, locate Fabio's parent and children, count occupied positions, and ask what must change if one selected card is removed.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 8.3 — From Interface to Storage

<span id="part-1-abstract"></span>

### 1. What a Concrete Class Must Provide

Sections 8.1 and 8.2 defined what `Tree` and `BinaryTree` should **do**. Those abstract classes do not yet specify where nodes live in memory. A concrete tree must supply `root`, `parent`, `num_children`, `children`, and `__len__`; a binary tree must also supply `left` and `right`. In the book, `BinaryTree` already derives `children` from its two child accessors, so a binary subclass can inherit that method.

The linked implementation in Section 8.3.1 fills in those missing pieces with node references. The array approach in 8.3.2 uses index arithmetic. Section 8.3.3 changes the linked node shape to support any number of children.

**Why this example?** The question `parent(Fabio)` should return Yamaha regardless of which representation stores the tree. The interface stays familiar while the storage changes.

**How to solve an implementation problem:** List the required operations first. Decide what data each node or slot must hold to answer them, then check the boundary cases: an empty tree, the root's absent parent, and a leaf's absent children.

<span id="part-1-position"></span>

### 2. Position, Node, and Element

These three words have different jobs:

| Word | Role | Sprint example |
| :--- | :--- | :--- |
| **Element** | Stored user data. | `"Fabio Quartararo (P6)"`. |
| **Node** | The private storage record holding data and links. | A record with Fabio's label and a parent link to Yamaha. |
| **Position** | A public handle to a location in one tree. | A handle that lets a caller ask for Fabio's element or parent. |

In the book's linked design, a `Position` wraps **both** its owning tree and its node. That matters after an edit: replacing the element can leave the position at the same location, but deleting the node makes the old position invalid. Two positions compare equal when they represent the **same node**, not merely when their labels happen to match.

**Why this example?** Fabio's **P6** is a race finishing place, while a `Position` is a structural handle. Distinguishing them prevents mistakes when we later assign Fabio array index `5`.

**How to read a method call:** For `T.parent(p_fabio)`, validate `p_fabio` as a position in `T`, follow its node's parent link (or calculate its parent index), then return a position for Yamaha. Do not treat the string `"P6"` as the position.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 8.3.1 — Linked Structure for Binary Trees

<span id="part-2-node"></span>

### 1. Store Links in Each Node

The book's `LinkedBinaryTree` gives each private node four fields: `_element`, `_parent`, `_left`, and `_right`. A missing link is `None`. The tree object itself keeps `_root` and a cached `_size`, so `len(T)` does not need to traverse the tree.

```text
Tree object: _root → Sprint node, _size = 7

Ducati node:
    _element → "Ducati Lenovo Team"
    _parent  → Sprint node
    _left    → Marc node
    _right   → Francesco node

Fabio node:
    _element → "Fabio Quartararo (P6)"
    _parent  → Yamaha node
    _left    → None
    _right   → None
```

For the root, `_parent is None`. These are **references to nodes**, not copies of the rider records. The fields let us move from a node to its parent or either child in constant time.

**Why this example?** Ducati shows all four fields in use; Fabio shows the two missing child links of a leaf.

**How to draw a linked node:** Start with its element. Add one parent field and exactly two labeled child fields. For each absent relation write `None`. Set the tree's root reference and size separately.

<span id="part-2-validate"></span>

### 2. Validate Positions and Navigate

A caller receives a public `Position`, not the private `_Node`. The book's position wrapper holds `_container` (the owning tree) and `_node` (the stored record). `p.element()` returns that node's element. Two wrappers for the same node compare equal, even if a method creates a fresh wrapper each time.

The helper `_validate(p)` unwraps a position only after checking it. A wrong object type raises `TypeError`; a position naming a different tree or a deleted node raises `ValueError`. On deletion, the book sets the removed node's parent link to the node itself as a **deprecated-node marker**. The companion `_make_position(node)` wraps a real node and returns `None` when its input is `None`.

```python
def parent(self, p):
    node = self._validate(p)
    return self._make_position(node._parent)

def left(self, p):
    node = self._validate(p)
    return self._make_position(node._left)

def right(self, p):
    node = self._validate(p)
    return self._make_position(node._right)
```

Similarly, `num_children(p)` counts whether `_left` and `_right` are non-`None`. `root()` wraps `_root`; an empty tree has `_root = None`, `_size = 0`, and `root() is None`. For our full tree, `parent(Fabio)` returns Yamaha, `left(Yamaha)` returns Fabio, and `right(Yamaha)` returns Álex.

**Why this example?** It shows the boundary between the safe public handle and the private pointers. That boundary becomes essential when a rider card is removed from a teaching tree.

**How to solve an accessor call:** Validate the input position, read one field from its node, and wrap the resulting node. If that field is `None`, the accessor returns `None`.

<span id="part-2-build"></span>

### 3. Create, Attach, and Replace

The book offers six **nonpublic** linked-tree update methods. These four create or change stored data:

| Method | Required condition | Effect in our teaching tree |
| :--- | :--- | :--- |
| `_add_root(e)` | The tree is empty. | Create the Sprint root; size becomes 1. |
| `_add_left(p, e)` | `p` has no left child. | Add Ducati to the root's left slot. |
| `_add_right(p, e)` | `p` has no right child. | Add Yamaha to the root's right slot. |
| `_replace(p, e)` | `p` is valid. | Change `"Marc Márquez"` to `"Marc Márquez (P1)"` and return the old label. |

Each new node points back to its parent; the parent's corresponding child field points to the new node; `_size` increases by one. Trying `_add_root` on a nonempty tree or inserting into an occupied left/right slot raises an error. `_replace` changes an **element**, not the node's location or links.

The fifth method, `_attach(p, t1, t2)`, transfers the roots of two same-type donor trees into the left and right slots of **leaf** `p`. For example, first build the Sprint root, its two teams, Marc, and Francesco: size **5**, with Yamaha still a leaf. Let `t1` contain just Fabio and `t2` contain just Álex. Attach them at Yamaha:

```text
Before: receiver size 5; Fabio donor size 1; Álex donor size 1
After:  receiver size 7; Fabio donor size 0; Álex donor size 0
        Yamaha._left → Fabio; Yamaha._right → Álex
        Fabio._parent → Yamaha; Álex._parent → Yamaha
```

The nodes are **relinked**, not copied. The donor tree objects become empty. The book requires matching concrete tree types and rejects a target that is not a leaf. The worked program also rejects using the receiving tree as a donor or using one donor twice. After transfer, obtain positions for the attached nodes through the **receiving tree**; do not continue using positions saved from donor trees.

**Why this example?** Attaching Fabio and Álex builds the verified Yamaha branch while showing why moving whole subtrees can take constant time with pointers.

**How to attach:** Check the receiver position is a leaf; check the donors' types and identities; add donor sizes to the receiver; connect each nonempty donor root to the correct side and set its parent; finally clear each donor's root and size.

<span id="part-2-delete"></span>

### 4. Delete and Repair the Links

The sixth update, `_delete(p)`, removes a node **only if it has at most one child**. If it has one, that child takes its place. The method returns the removed element, decreases `_size` by one, and marks the old node as deleted so a saved position for it fails validation.

| Case | Link repair |
| :--- | :--- |
| `p` is a leaf. | Set the matching parent child field to `None`. |
| `p` has one child. | Connect that child to `p`'s parent; also change the child's parent link. |
| `p` is the root with at most one child. | Point `_root` to the child (or `None`). |
| `p` has two children. | Reject the edit; one child cannot take the slot without losing the other. |

For a simple example, delete **Francesco's card from a teaching copy**. Ducati's right link becomes `None`, size goes from 7 to 6, and Marc remains its left child. Francesco still finished **P8** in the official Sprint. If we next deleted the now one-child Ducati node in a **shape-only copy**, Marc would be promoted to the Sprint root's left slot. That pointer change is valid for the data structure, but the resulting session → Marc edge would no longer preserve our team-grouping meaning.

This is why the book keeps updates **nonpublic**. An application may need stricter rules than the storage class. For example, an expression tree may require every internal element to remain an operator, so a public unrestricted `replace` would be inappropriate.

**Why this example?** The leaf deletion has only one parent link to repair, while the possible Ducati promotion makes the application's semantic rule visible.

**How to delete safely:** Count `p`'s children first. Reject two. Find the surviving child, if any. Repair the root or the correct parent side, repair the child's parent, decrement size, then invalidate the removed node.

<span id="part-2-cost"></span>

### 5. Understand the Running Costs

The book's Table 8.1 gives the linked binary implementation **`O(n)` space** for `n` actual nodes. It does not allocate placeholders for missing branches. Its operation costs are:

| Operation | Time | Reason |
| :--- | :--- | :--- |
| `len(T)`, `is_empty()` | `O(1)` | Use cached `_size`. |
| `root`, `parent`, `left`, `right`, `num_children` | `O(1)` | Read a fixed number of links. |
| `sibling`, `children`, `is_root`, `is_leaf` | `O(1)` | Use a fixed number of basic accessors. |
| `depth(p)` | `O(d_p + 1)` | Follow `d_p` parent links toward the root. |
| Whole-tree `height()` | `O(n)` | Visit each node once. |
| Six nonpublic updates above | `O(1)` each | Change only a fixed number of references and counters. |

The `O(1)` cost of `_attach` assumes the two donor trees already maintain their sizes. It changes only their root links, not every descendant link. The binary `children(p)` yields at most two positions, which is why its full iteration is constant-time.

**Why this example?** The seven-node tree lets us see exactly what each update touches, while the table tells us how the same work scales to a much larger tree.

**How to analyze a method:** Count pointer reads, pointer writes, and node visits. A fixed number of link changes is `O(1)`; walking to the root depends on depth; visiting every node depends on `n`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 8.3.2 — Array-Based Representation of a Binary Tree

<span id="part-3-formulas"></span>

### 1. Calculate the Index of Each Position

Instead of saving explicit links, the array representation assigns an index `f(p)` to each possible binary-tree position `p`. Start at index 0 for the root. For a position at index `i`:

| Relation | Index formula | Example for Yamaha at index 2 |
| :--- | :--- | :--- |
| Left child | `2i + 1` | Fabio's slot is `2(2) + 1 = 5`. |
| Right child | `2i + 2` | Álex's slot is `2(2) + 2 = 6`. |
| Parent, if `i > 0` | `(i - 1) // 2` | Yamaha's parent is `(2 - 1) // 2 = 0`. |

The root has no parent. An index formula identifies a **possible slot**, not proof that a node exists there. After calculating an index, check that it lies within the array **and** that the slot is occupied. For example, index 5 has parent index `(5 - 1) // 2 = 2`, so Fabio's parent is Yamaha. The `5` is an array index; Fabio's Sprint finish remains **P6**.

**Why this example?** Fabio at index 5 gives us a real child-to-parent calculation, while Yamaha shows both child formulas with one small pair of numbers.

**How to solve an index question:** Locate the position's index, substitute it into the appropriate formula, then check whether the resulting slot contains a node. Keep the result place in the label; never use P6 as an array index.

<span id="part-3-map"></span>

### 2. Store the Sprint Tree in an Array

For the complete seven-position teaching tree, breadth-first order fills every slot:

```python
slots = [
    "Sprint",                         # 0
    "Ducati Lenovo Team",             # 1
    "Monster Energy Yamaha MotoGP Team",  # 2
    "Marc Márquez (P1)",              # 3
    "Francesco Bagnaia (P8)",         # 4
    "Fabio Quartararo (P6)",          # 5
    "Álex Rins (P13)",                # 6
]
```

| Index | Stored position | Parent index |
| :---: | :--- | :---: |
| 0 | Sprint | — |
| 1 | Ducati Lenovo Team | 0 |
| 2 | Monster Energy Yamaha MotoGP Team | 0 |
| 3 | Marc Márquez (P1) | 1 |
| 4 | Francesco Bagnaia (P8) | 1 |
| 5 | Fabio Quartararo (P6) | 2 |
| 6 | Álex Rins (P13) | 2 |

The array length here equals the number of nodes: `N = n = 7`. That happens because this particular shape fills all its early slots. To see why **array length and tree size are different concepts**, make a second *teaching selection* that omits Francesco's card:

```text
index:  0        1        2        3       4       5       6
slot:   Sprint   Ducati   Yamaha   Marc    empty   Fabio   Álex
```

There are six actual positions (`n = 6`), but the array must still have seven slots (`N = 7`) to reach Álex at index 6. Moving Fabio into the empty index 4 would falsely make Fabio Ducati's right child. A Python implementation could use `None` for an empty slot **only if** `None` cannot also be a valid element; otherwise use a distinct sentinel.

**Why this example?** One removed card creates a single visible hole without changing the real session facts: Francesco remains P8 in the official results. The hole shows why indices encode **shape**, not just an ordered list of labels.

**How to solve a storage problem:** Draw the binary tree first, put its root at 0, repeatedly apply the child formulas, and reserve every slot up through the largest occupied index. Count actual positions separately from allocated slots.

<span id="part-3-cost"></span>

### 3. Explain Holes, Space, and Editing Cost

The book defines the required array length as `N = 1 + max f(p)`, where the maximum is over **actual positions**. The formula can waste a great deal of space for a sparse shape. In a four-node tree made by following only right children, the indices are:

```text
root 0 → right 2 → right 6 → right 14
```

That needs `N = 15` slots for `n = 4` nodes. Extending the same right-only pattern to `n` nodes reaches index `2^n - 2` and needs `N = 2^n - 1` slots. A complete or nearly complete shape, such as a heap, keeps the occupied slots packed and has `N = n` when there are no holes before the last node.

Calculating a parent or child index takes `O(1)` time; checking an array slot is also `O(1)`. **Editing can be more expensive.** Suppose the six-position teaching selection above deletes the one-child Ducati node and promotes Marc. Marc's index must change from 3 to 1. If Marc had descendants, their indices would also change; moving a whole promoted subtree can take `O(n)` time. As with linked-tree deletion, this is a *shape exercise*: promoting a rider past its team would break our team-grouping meaning.

**Why this example?** The right-only chain exposes the worst space use; the Marc promotion exposes why a formula that makes navigation cheap can make structural changes costly.

**How to choose a representation:** If the binary tree stays complete or nearly complete, array slots are compact and index arithmetic is convenient. If branches are sparse or subtrees are often moved, examine a linked representation's space and update costs instead.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 8.3.3 — Linked Structure for General Trees

<span id="part-4-list"></span>

### 1. Use a List of Child Links

A general-tree position may have **any number of children**. Its node therefore stores an element, a parent reference, and a *collection* of child references. The book suggests a Python list for that collection:

```python
class GeneralNode:
    def __init__(self, element, parent=None):
        self.element = element
        self.parent = parent
        self.children = []

def add_child(parent, element):
    child = GeneralNode(element, parent)
    parent.children.append(child)
    return child
```

This short sketch shows the storage idea, **not** a complete implementation of the book's public `Tree` interface or its protected `Position` validation. To visit all children of a position `p`, iterate over its child-reference list. If `c_p` is the number of children, that iteration takes `O(c_p + 1)` time. Python's `len(node.children)` takes `O(1)` time, so counting children is constant-time even when there are many of them.

**Why this example?** Two fixed fields, `_left` and `_right`, cannot represent a third direct child. A list grows with the actual number of children.

**How to add a child:** Make a node with its parent set to the existing node, then append the new node to the parent's child list. Both directions of the relationship must agree.

<span id="part-4-example"></span>

### 2. Restore the Three-Team Sprint View

The same [Brazilian Sprint classification](https://resources.motogp.com/files/results/2026/BRA/MotoGP/SPR/Classification.pdf) also lists **Jorge Martín (P3)** and **Marco Bezzecchi (P4)** for **Aprilia Racing**. Add Aprilia as a third selected team:

```text
Sprint
├── Ducati Lenovo Team
│   ├── Marc Márquez (P1)
│   └── Francesco Bagnaia (P8)
├── Aprilia Racing
│   ├── Jorge Martín (P3)
│   └── Marco Bezzecchi (P4)
└── Monster Energy Yamaha MotoGP Team
    ├── Fabio Quartararo (P6)
    └── Álex Rins (P13)
```

The root now has **three** children and the selected tree has `1 + 3 + 6 = 10` positions. We list teams by their best selected result (P1, P3, P6) and teammates by finish. This order is our explanatory choice, not an official team ranking. The general-tree links store just the children that exist; they do not reserve absent binary slots.

Using the small sketch above, the first level is:

```python
sprint = GeneralNode("2026 Brazilian GP Tissot Sprint")
ducati = add_child(sprint, "Ducati Lenovo Team")
aprilia = add_child(sprint, "Aprilia Racing")
yamaha = add_child(sprint, "Monster Energy Yamaha MotoGP Team")
assert len(sprint.children) == 3
assert yamaha.parent is sprint
```

A linked general-tree representation uses `O(n)` space for `n` actual nodes. Its `root`, `parent`, `num_children`, `len`, `is_empty`, `is_root`, and `is_leaf` operations take `O(1)`; iterating `children(p)` takes `O(c_p + 1)`; `depth(p)` takes `O(d_p + 1)`; and whole-tree `height()` takes `O(n)`. These are the book's Table 8.2 access costs. The table does not claim that every possible general-tree edit is constant-time.

**Why this example?** The third verified team gives the root exactly the child count that a binary tree cannot have, while keeping Marc and Fabio visible in their real teams.

**How to solve a general-tree representation question:** Count each position's children. Allocate one child reference per actual child, set each child's parent, and choose an application-specific sibling order only if one is needed. For time analysis, count the children iterated, ancestors followed, or total nodes visited.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Complete Worked Python Example

<span id="part-5-plan"></span>

### 1. Plan and Trace the Edits

Build the binary teaching tree with the linked representation from Part 2. These edits show the difference between creating a node, moving existing subtrees, changing an element, and removing a node:

| Step | Operation | Resulting size | What changes? |
| :---: | :--- | :---: | :--- |
| 1 | Add Sprint root. | 1 | Save the root node. |
| 2 | Add Ducati and Yamaha. | 3 | Set root's left and right links. |
| 3 | Add Marc and Francesco under Ducati. | 5 | Set Ducati's two child links. |
| 4 | Attach Fabio and Álex as one-node donor trees under Yamaha. | 7 | Splice two roots; empty donors. |
| 5 | Replace Marc's label with one that includes P1. | 7 | Change one element; keep the same position. |
| 6 | Delete Francesco's leaf card. | 6 | Clear Ducati's right link; invalidate its old position. |

**Why this example?** Each step changes a different part of the representation, and the two named riders make it easy to verify that a stored position still points to the intended person.

**How to solve it:** Maintain `_size` whenever nodes enter or leave a tree. After each pointer change, check the reverse parent link. Get a *new destination position* for Fabio after `_attach`, and expect an old position for Francesco to fail after `_delete`.

<span id="part-5-program"></span>

### 2. Run a Small Linked Binary Tree

This standalone program includes the position wrapper, validation, basic navigation, and all six nonpublic update methods from the linked-tree discussion. It adds a donor-identity guard to make the teaching implementation safe when both donor arguments refer to the same tree.

```python
class LinkedBinaryTree:
    class _Node:
        __slots__ = ("_element", "_parent", "_left", "_right")

        def __init__(self, element, parent=None):
            self._element = element
            self._parent = parent
            self._left = None
            self._right = None

    class Position:
        __slots__ = ("_container", "_node")

        def __init__(self, container, node):
            self._container = container
            self._node = node

        def element(self):
            return self._node._element

        def __eq__(self, other):
            return type(other) is type(self) and self._node is other._node

    def __init__(self):
        self._root = None
        self._size = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return len(self) == 0

    def _validate(self, p):
        if not isinstance(p, self.Position):
            raise TypeError("p must be a Position")
        if p._container is not self:
            raise ValueError("p belongs to another tree")
        if p._node._parent is p._node:
            raise ValueError("p was deleted")
        return p._node

    def _make_position(self, node):
        return self.Position(self, node) if node is not None else None

    def root(self):
        return self._make_position(self._root)

    def parent(self, p):
        return self._make_position(self._validate(p)._parent)

    def left(self, p):
        return self._make_position(self._validate(p)._left)

    def right(self, p):
        return self._make_position(self._validate(p)._right)

    def num_children(self, p):
        node = self._validate(p)
        return int(node._left is not None) + int(node._right is not None)

    def children(self, p):
        for child in (self.left(p), self.right(p)):
            if child is not None:
                yield child

    def is_root(self, p):
        return p == self.root()

    def is_leaf(self, p):
        return self.num_children(p) == 0

    def sibling(self, p):
        parent = self.parent(p)
        if parent is None:
            return None
        return self.right(parent) if p == self.left(parent) else self.left(parent)

    def _add_root(self, element):
        if self._root is not None:
            raise ValueError("root already exists")
        self._root = self._Node(element)
        self._size = 1
        return self._make_position(self._root)

    def _add_left(self, p, element):
        node = self._validate(p)
        if node._left is not None:
            raise ValueError("left child already exists")
        node._left = self._Node(element, node)
        self._size += 1
        return self._make_position(node._left)

    def _add_right(self, p, element):
        node = self._validate(p)
        if node._right is not None:
            raise ValueError("right child already exists")
        node._right = self._Node(element, node)
        self._size += 1
        return self._make_position(node._right)

    def _replace(self, p, element):
        node = self._validate(p)
        old = node._element
        node._element = element
        return old

    def _delete(self, p):
        node = self._validate(p)
        if node._left is not None and node._right is not None:
            raise ValueError("cannot delete a node with two children")
        child = node._left if node._left is not None else node._right
        if child is not None:
            child._parent = node._parent
        if node is self._root:
            self._root = child
        elif node is node._parent._left:
            node._parent._left = child
        else:
            node._parent._right = child
        self._size -= 1
        node._parent = node  # Mark this node as deleted.
        return node._element

    def _attach(self, p, left_tree, right_tree):
        node = self._validate(p)
        if node._left is not None or node._right is not None:
            raise ValueError("target must be a leaf")
        if type(self) is not type(left_tree) or type(self) is not type(right_tree):
            raise TypeError("all three trees must have the same type")
        if self is left_tree or self is right_tree or left_tree is right_tree:
            raise ValueError("trees must be distinct objects")
        self._size += len(left_tree) + len(right_tree)
        if left_tree._root is not None:
            node._left = left_tree._root
            node._left._parent = node
            left_tree._root = None
            left_tree._size = 0
        if right_tree._root is not None:
            node._right = right_tree._root
            node._right._parent = node
            right_tree._root = None
            right_tree._size = 0


tree = LinkedBinaryTree()
sprint = tree._add_root("2026 Brazilian GP Tissot Sprint")
ducati = tree._add_left(sprint, "Ducati Lenovo Team")
yamaha = tree._add_right(sprint, "Monster Energy Yamaha MotoGP Team")
marc = tree._add_left(ducati, "Marc Márquez")
francesco = tree._add_right(ducati, "Francesco Bagnaia (P8)")

fabio_tree = LinkedBinaryTree()
fabio_tree._add_root("Fabio Quartararo (P6)")
rins_tree = LinkedBinaryTree()
rins_tree._add_root("Álex Rins (P13)")
tree._attach(yamaha, fabio_tree, rins_tree)

fabio = tree.left(yamaha)  # Get a position from the receiving tree.
print("size:", len(tree))
print("Fabio's parent:", tree.parent(fabio).element())
print("Fabio's sibling:", tree.sibling(fabio).element())
print("donor sizes:", len(fabio_tree), len(rins_tree))

print("replaced:", tree._replace(marc, "Marc Márquez (P1)"))
print("Marc's current label:", marc.element())
print("deleted:", tree._delete(francesco))
print("size after deletion:", len(tree))
print("Ducati's children:", tree.num_children(ducati))
try:
    tree.parent(francesco)
except ValueError:
    print("deleted position rejected")
try:
    tree._delete(yamaha)
except ValueError:
    print("two-child deletion rejected")
```

Expected output:

```text
size: 7
Fabio's parent: Monster Energy Yamaha MotoGP Team
Fabio's sibling: Álex Rins (P13)
donor sizes: 0 0
replaced: Marc Márquez
Marc's current label: Marc Márquez (P1)
deleted: Francesco Bagnaia (P8)
size after deletion: 6
Ducati's children: 1
deleted position rejected
two-child deletion rejected
```

**How to check the result:** Fabio's parent and sibling confirm both directions of the attached links. The unchanged size after `_replace` confirms a label edit does not add a node. The final size and failed old position confirm deletion and invalidation. Yamaha's two children make its deletion fail as required.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Question | Linked binary tree | Array-based binary tree | Linked general tree |
| :--- | :--- | :--- | :--- |
| Where are child relationships stored? | In each node's left/right references. | In index formulas and occupied slots. | In each node's child-reference list. |
| How many direct children can a position have? | At most two, with distinct left/right roles. | At most two, with distinct index formulas. | Any number. |
| What happens with sparse branches? | No placeholder nodes are stored. | Holes may consume substantial space. | No placeholder nodes are stored. |
| Best fit in our session model | Two selected teams, each with two riders. | The same compact seven-position shape. | Three selected teams under one Sprint root. |

The choice of representation changes **how a tree is stored and edited**, not the real Sprint results. Marc remains Ducati's P1 rider and Fabio remains Yamaha's P6 rider in each teaching view. To answer a new Section 8.3 problem, draw the shape, identify its positions, choose the appropriate storage rule, and then trace either the links or the array indices one step at a time.

[🔝 Back to Top](#top)
