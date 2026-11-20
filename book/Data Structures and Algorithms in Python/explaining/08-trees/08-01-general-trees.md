<span id="top"></span>

# Trees — Section 8.1: General Trees

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 8 PDF](<../../file/Data Structures and Algorithms in Python - C08.pdf>), Section 8.1 (printed pages 300–310).  
> **Topic:** General trees; tree definitions and properties; the Tree abstract data type; depth and height.  
> **Domain focus:** Selected riders and teams from the [official timing classification for the 21 March 2026 Brazilian Grand Prix MotoGP Tissot Sprint](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Sprint.pdf) at Goiânia.  
> **Learning goal:** Read a hierarchy, ask precise structural questions, and calculate depth and height by hand and in Python.  
> **User Prompt:** "Reexplain Section 8.1 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Sprint, Three Teams](#background-intuition)
   - [1. Read the selected results](#background-results)
   - [2. Turn the results into a tree](#background-tree)
2. [Part 1: Section 8.1 — General Trees](#part-1)
   - [1. Why a hierarchy instead of a sequence?](#part-1-hierarchy)
   - [2. What makes this a general tree?](#part-1-general)
3. [Part 2: Section 8.1.1 — Tree Definitions and Properties](#part-2)
   - [1. Root, parent, child, edge, and path](#part-2-basic)
   - [2. Siblings, ancestors, descendants, and subtrees](#part-2-relatives)
   - [3. Internal positions and leaves](#part-2-kinds)
   - [4. When does child order matter?](#part-2-order)
4. [Part 3: Section 8.1.2 — The Tree Abstract Data Type](#part-3)
   - [1. Positions and elements](#part-3-positions)
   - [2. Structural operations](#part-3-operations)
   - [3. An abstract base class](#part-3-base)
5. [Part 4: Section 8.1.3 — Computing Depth and Height](#part-4)
   - [1. Depth: walk up to the root](#part-4-depth)
   - [2. Height: work up from the leaves](#part-4-height)
   - [3. Why two height algorithms have different costs](#part-4-cost)
6. [Part 5: One Complete Worked Solution](#part-5)
   - [1. Solve structural questions](#part-5-questions)
   - [2. Check with a runnable Python model](#part-5-program)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Sprint, Three Teams

<span id="background-results"></span>

### 1. Read the Selected Results

The [official MotoGP timing sheet](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Sprint.pdf) identifies the **Brazilian Grand Prix Tissot Sprint on Saturday, 21 March 2026**. We will use **six classified riders from that one session**:

| Sprint place | Rider | Team |
| :---: | :--- | :--- |
| P1 | Marc Márquez | Ducati Lenovo Team |
| P8 | Francesco Bagnaia | Ducati Lenovo Team |
| P3 | Jorge Martín | Aprilia Racing |
| P4 | Marco Bezzecchi | Aprilia Racing |
| P6 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |
| P13 | Álex Rins | Monster Energy Yamaha MotoGP Team |

These are selected teaching records, **not the complete Sprint classification**. A place such as **P6** means sixth in the race result. A rider's **tree depth**, introduced later, counts connections from the tree's root. The two numbers answer different questions.

**Why this example?** Marc and Fabio are the requested focus. Their teammates provide sibling pairs, and Aprilia gives the root a third branch. One small set of real records can therefore illustrate several tree properties.

**How to set it up:** Identify the session first. Copy the verified rider, team, and place for each selected record. Decide what an edge will mean: **session contains a team; team contains a selected rider's result**.

<span id="background-tree"></span>

### 2. Turn the Results Into a Tree

```text
2026 Brazilian GP — MotoGP Tissot Sprint
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

Read an edge as "**belongs to this part of our selected-results view**." The edge from Yamaha to Fabio groups Fabio's result under his team. It does **not** say that Yamaha is Fabio's parent in ordinary language, or that Fabio finished directly after someone else in the drawing.

The diagram has **10 positions**: one session, three teams, and six riders. Its branches make the grouping visible. The top-to-bottom listing is a display choice; later we will state a rule that gives that order a meaning.

**Why this example?** It is small enough to trace by eye while including a root, internal positions, leaves, and more than two branches.

**How to read it:** Start at the session. Follow one edge to the team and another to the rider. Fabio's path is `Sprint → Monster Energy Yamaha MotoGP Team → Fabio Quartararo`.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 8.1 — General Trees

<span id="part-1-hierarchy"></span>

### 1. Why a Hierarchy Instead of a Sequence?

A sequence answers questions such as "which item comes before this one?" A tree also answers "which larger group contains this item?" The book uses trees for file systems, interfaces, databases, and documents. Here, a team collects its selected riders beneath one position.

If we stored only `[Marc, Francesco, Jorge, Marco, Fabio, Álex]`, we would need to look elsewhere for team membership. In the tree, **following one parent edge from Fabio** immediately identifies Yamaha. Following one more reaches the Sprint session.

**Why this example?** Sprint results have a natural finishing order, while team membership is a separate relationship. This makes the reason for a tree concrete.

**How to choose a structure:** State the question first. Use finishing-place order for "who finished ahead?" Use the session → team → rider tree for "which selected riders belong to this team?" Neither relation follows automatically from the other.

<span id="part-1-general"></span>

### 2. What Makes This a General Tree?

A **general tree** allows a position to have **zero, one, two, or more children**. Our session has **three** team children; each team has **two** rider children; each rider has **zero** children. The root's three children show why the same shape cannot be treated as a binary tree without changing its structure.

A tree may be empty. A nonempty tree has one root, and each other position is below exactly one parent. Branches cannot circle back to an earlier position.

**Why this example?** The three team branches show "general" without inventing extra session data.

**How to check:** Count direct child **positions**, not names or race places. The session has three children, regardless of how many words are in "Monster Energy Yamaha MotoGP Team."

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 8.1.1 — Tree Definitions and Properties

<span id="part-2-basic"></span>

### 1. Root, Parent, Child, Edge, and Path

The book defines a nonempty tree by giving it a **root with no parent** and giving every other position **exactly one parent**. A **child** is one step directly below its parent. An **edge** connects a parent and child. A **path** follows consecutive edges.

| Term | Meaning | Sprint example |
| :--- | :--- | :--- |
| Root | Only position with no parent. | The Sprint session. |
| Parent | Position one edge above. | Yamaha is Fabio's parent in this model. |
| Child | Position one edge below. | Fabio is a child of Yamaha. |
| Edge | One parent-child connection. | Yamaha—Fabio is one edge. |
| Path | Consecutive connected positions. | Sprint → Yamaha → Fabio has two edges. |

The Sprint is **not** Fabio's parent: it is two edges above him. If we placed the same Fabio position under both Yamaha and Ducati, it would have two parents and the drawing would cease to be a tree. It would also misstate Fabio's verified team membership.

There are **10 positions and 9 edges** in the diagram: three edges to teams and six to riders. Every nonroot position contributes exactly one parent edge, so any nonempty tree with `n` positions has **`n − 1` edges**.

**Why this example?** Fabio's two-edge path distinguishes a direct parent from a higher ancestor.

**How to solve a path question:** Follow one connection at a time and count **edges**, not labels. `Sprint → Yamaha → Fabio` visits three positions but crosses two edges.

<span id="part-2-relatives"></span>

### 2. Siblings, Ancestors, Descendants, and Subtrees

Two positions are **siblings** when they have the same parent. Fabio and Álex are siblings under Yamaha; Marc and Francesco are siblings under Ducati. Marc and Fabio are not siblings, even though they raced in the same session.

An **ancestor** is a position itself or one reached by repeatedly following parent links. Fabio's ancestors are **Fabio, Yamaha, and the Sprint**. His **proper ancestors** exclude Fabio himself: Yamaha and the Sprint. A **descendant** works downward and also includes the starting position. The **subtree rooted at Yamaha** contains Yamaha, Fabio, and Álex, so it has three positions.

| Question | Method | Answer |
| :--- | :--- | :--- |
| Are Marc and Fabio siblings? | Compare immediate parents. | No: Ducati versus Yamaha. |
| Is the Sprint a proper ancestor of Fabio? | Move up from Fabio twice. | Yes. |
| Is Yamaha its own descendant? | Apply the book's inclusive definition. | Yes; "proper descendant" excludes itself. |
| What is in Yamaha's subtree? | Start at Yamaha and follow every child branch. | Yamaha, Fabio, and Álex. |

**Why this example?** Marc and Fabio share a session but have different immediate parents, which prevents the common mistake of calling every rider in the Sprint a sibling.

**How to solve it:** For siblings, compare **one** parent step. For ancestors, keep moving **up** to the root. For a subtree, include the starting position and everything reachable **down** from it.

<span id="part-2-kinds"></span>

### 3. Internal Positions and Leaves

An **internal position** has at least one child. An **external position**, or **leaf**, has none. The Sprint and three teams are internal; the six riders are leaves. These are properties of **our model**: if we attached more details below a rider, that rider would no longer be a leaf.

| Position | Direct children | Kind |
| :--- | ---: | :--- |
| Sprint | 3 | Internal |
| Each selected team | 2 | Internal |
| Each selected rider | 0 | Leaf |

Adding the child counts gives `3 + 2 + 2 + 2 + 6 × 0 = 9`. This equals the edge count because each edge ends at one child.

**Why this example?** The real rider and team records supply both kinds of position. "Leaf" describes **children in the model**, not a rider's finish.

**How to solve it:** Count direct children. Zero means leaf; a positive count means internal. Do not decide from whether the label names a person or team.

<span id="part-2-order"></span>

### 4. When Does Child Order Matter?

The book calls a tree **ordered** when each parent's children have a meaningful first, second, third, and so on. A book's chapters are an example: swapping Chapter 1 and Chapter 2 changes the document. Team membership by itself does not require an order among teams or teammates.

For this **results view**, we can choose an order from the selected Sprint places:

1. Order team nodes by the best finish among their two selected riders: Ducati `min(1, 8) = 1`, Aprilia `min(3, 4) = 3`, then Yamaha `min(6, 13) = 6`.
2. Within each team, order rider nodes by place: Marc before Francesco, Jorge before Marco, and Fabio before Álex.

That rule explains the diagram's top-to-bottom listing. It is **our display rule**, not an official team ranking. Without it, listing the Yamaha branch first would not alter the underlying affiliation relationships.

**Why this example?** Race places give us a simple ordering rule to calculate, while team membership shows that order and hierarchy are separate ideas.

**How to solve an ordering question:** Ask whether swapping two siblings would change the modeled information. If yes, state the rule. If no, their order in the drawing is only a display choice.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 8.1.2 — The Tree Abstract Data Type

<span id="part-3-positions"></span>

### 1. Positions and Elements

The **Tree abstract data type (ADT)** says what a tree lets us ask without deciding how to store its nodes. A **position** identifies a location in one tree; an **element** is the data stored there. Let `p_fabio` be the position below the Yamaha team. Then `p_fabio.element()` might return `("Fabio Quartararo", "P6")`. The **6** is Fabio's Sprint finish; `p_fabio` is his location in this teaching hierarchy.

The book's abstract `Position` interface includes `element()` and equality methods for testing whether two positions represent the same location. Two positions could hold equal-looking data and still be different positions. For example, two separate result fields might both store the text `"Yamaha"`; that would not make them the same location.

**Why this example?** "Position" also appears in race results, so Fabio's **P6** makes the distinction important.

**How to solve a position question:** Find the node through its parent-child links first. Then read its element. Do not use the finishing place as a tree index or as the node's depth.

<span id="part-3-operations"></span>

### 2. Structural Operations

Write `T` for our selected-results tree and `p` for one of its positions. The book's read-only operations are:

| Operation | Question it answers | Sprint example |
| :--- | :--- | :--- |
| `p.element()` | What data is stored here? | Fabio's name and P6 result. |
| `T.root()` | Where does the tree start? | The Sprint position; `None` if empty. |
| `T.is_root(p)` | Is this the root? | True for the Sprint. |
| `T.parent(p)` | What is one step up? | `T.parent(p_fabio)` is Yamaha; the root's parent is `None`. |
| `T.num_children(p)` | How many direct children? | `T.num_children(T.root()) == 3`. |
| `T.children(p)` | Which positions are directly below? | Yamaha's children are Fabio and Álex. |
| `T.is_leaf(p)` | Are there no children? | True for Fabio. |
| `len(T)` | How many positions? | `10`. |
| `T.is_empty()` | Are there no positions? | False. |
| `T.positions()` | Which positions exist? | Iterates over all 10 positions. |
| `iter(T)` | Which elements are stored? | Iterates over elements, not position objects. |

For an ordered tree, `children(p)` follows its defined child order. A leaf's `children(p)` yields nothing. The book leaves the overall order of `positions()` and `iter(T)` for Section 8.4's traversal discussion. A concrete implementation should reject a position that is invalid for `T` with `ValueError`.

**Why this example?** Every query has an answer in the same small diagram, so we can connect the ADT's names to visible actions.

**How to solve a query:** Locate `p`, then answer only the requested relation. For `num_children(Yamaha)`, count Fabio and Álex: **2**. Do not count Yamaha itself or riders in other teams.

<span id="part-3-base"></span>

### 3. An Abstract Base Class

The book's abstract `Tree` class leaves **five structural methods** to a concrete subclass: `root`, `parent`, `num_children`, `children`, and `__len__`. Different implementations can store nodes differently yet provide the same behavior. The base class can then define:

```python
def is_root(self, p):
    return self.root() == p

def is_leaf(self, p):
    return self.num_children(p) == 0

def is_empty(self):
    return len(self) == 0
```

For instance, `is_leaf(p_fabio)` asks `num_children(p_fabio)`, gets `0`, and returns `True`. `is_empty()` checks `len(T) == 10` and returns `False`. Later, the book builds `positions()` and element iteration using tree traversals. Section 8.1 specifies **access**; creation and modification depend on a particular implementation.

**Why this example?** A concrete tree must explain how it counts children, but all implementations can reuse the same leaf test. That is the practical reason for a shared abstract base.

**How to solve a derived-method question:** Substitute its definition. For `T.is_leaf(p_fabio)`, evaluate `T.num_children(p_fabio) == 0`. For emptiness, evaluate `len(T) == 0`.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 8.1.3 — Computing Depth and Height

<span id="part-4-depth"></span>

### 1. Depth: Walk Up to the Root

The **depth** of `p` is the number of edges from the root to `p`. Equivalently, count `p`'s proper ancestors. The root has depth **0**; a child has depth **one more than its parent**.

| Position | Parent step | Depth |
| :--- | :--- | ---: |
| Sprint | No parent | 0 |
| Yamaha | Sprint | 1 |
| Fabio | Yamaha | 2 |

For Fabio, `depth(Fabio) = 1 + depth(Yamaha) = 1 + (1 + depth(Sprint)) = 2`. The book's recursive method expresses that rule:

```python
def depth(self, p):
    if self.is_root(p):
        return 0
    return 1 + self.depth(self.parent(p))
```

Every call moves one edge toward the root, so it stops. At depth `d`, it makes `d + 1` calls and takes `O(d + 1)` time if parent access is constant-time. In a long chain, `d` can be `n − 1`, giving an `O(n)` worst case.

**Why this example?** Fabio's P6 finish and depth **2** are visibly different. The short path also lets us trace every recursive call.

**How to solve it:** Move from Fabio to Yamaha and then to the Sprint. Count two parent moves. Check the root's depth is zero before adding the moves back.

<span id="part-4-height"></span>

### 2. Height: Work Up From the Leaves

The **height** of `p` is the number of edges on the longest downward path from `p` to a leaf in its subtree. A leaf's height is **0**. An internal position's height is **one plus the largest child height**.

| Position | Child heights | Height |
| :--- | :--- | ---: |
| Fabio or Álex | No children | 0 |
| Yamaha | `0, 0` | `1 + max(0, 0) = 1` |
| Sprint | `1, 1, 1` for the three teams | `1 + max(1, 1, 1) = 2` |

The height of this **nonempty tree** is the height of its root, **2**. Its deepest leaves have depth **2**, illustrating the book's rule: **tree height equals the maximum depth of a leaf**. Yamaha's depth and height both happen to be **1**, but they measure opposite directions.

```python
def _height2(self, p):
    if self.is_leaf(p):
        return 0
    return 1 + max(self._height2(c) for c in self.children(p))
```

The book's public `height(p=None)` uses the root when `p` is omitted, or computes a subtree's height when a position is supplied. These formulas assume a **nonempty** tree or a valid subtree position; an application must decide how to handle `height()` on an empty tree.

**Why this example?** The rider leaves provide an easy base case, and all three team branches show how `max` chooses one longest path rather than adding every branch.

**How to solve it:** Put **0** at each rider. Move upward to each team and add one. At the Sprint, take the largest team height and add one again.

<span id="part-4-cost"></span>

### 3. Why Two Height Algorithms Have Different Costs

The book first shows a direct method, `height1`: find each leaf, calculate its depth from the root, and take the maximum.

```python
max(T.depth(p) for p in T.positions() if T.is_leaf(p))
```

This gives the right answer for a **nonempty** tree. Here all six rider leaves have depth 2, so the maximum is 2. But calculating each depth separately can walk over the same upper edges again and again. A tree with many leaves at successively deeper levels can make this **`O(n²)`** in the worst case. A single chain has only one leaf, so a chain by itself does **not** cause that quadratic bound.

The recursive `_height2` method visits each position **once**, returns each subtree's height, and processes each child edge once. Across `n` positions, the child counts sum to `n − 1`, so the total time is **`O(n)`** when child iteration takes time proportional to the child count.

**Why this example?** The Sprint tree has six leaves. It lets us compare six separate upward traces with one calculation that reuses each subtree result.

**How to choose:** Compute height from the leaves upward for a large tree. Use maximum leaf depth as a way to check the answer.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Complete Worked Solution

<span id="part-5-questions"></span>

### 1. Solve Structural Questions

Suppose we are asked: **Who is Fabio's parent in the model? Is he a leaf? What are his depth, his team's subtree height, and the whole tree's height? How many positions and edges are there?**

| Step | Work | Result |
| :--- | :--- | :--- |
| Find Fabio's parent. | Follow one edge upward. | Monster Energy Yamaha MotoGP Team. |
| Test for a leaf. | Count Fabio's direct children. | `0`, so **yes**. |
| Find Fabio's depth. | Fabio → Yamaha → Sprint crosses two edges. | **2**. |
| Find Yamaha's subtree height. | Both rider leaves have height `0`. | `1 + max(0, 0) = 1`. |
| Find the whole height. | Each team has height `1`. | `1 + max(1, 1, 1) = 2`. |
| Count positions. | One session + three teams + six riders. | **10**. |
| Count edges. | One parent edge for every nonroot position. | `10 − 1 = 9`. |

**Why this example?** It ties the vocabulary, the ADT questions, and both recursive measures to the same Fabio-centered path.

**How to solve it:** Inspect the tree first. Answer one-edge questions before whole-path questions; calculate leaf heights before parent heights; then check the node and edge counts.

<span id="part-5-program"></span>

### 2. Check With a Runnable Python Model

This program uses unique string IDs as **stand-ins for positions**. `labels` holds their elements, `children` holds the chosen results-view order, and `parents` is derived from the edges. It models our selected tree; it is not the book's abstract `Position` class.

```python
labels = {
    "sprint": "2026 Brazilian GP MotoGP Tissot Sprint",
    "ducati": "Ducati Lenovo Team",
    "aprilia": "Aprilia Racing",
    "yamaha": "Monster Energy Yamaha MotoGP Team",
    "marc": "Marc Márquez (P1)",
    "bagnaia": "Francesco Bagnaia (P8)",
    "jorge": "Jorge Martín (P3)",
    "marco": "Marco Bezzecchi (P4)",
    "fabio": "Fabio Quartararo (P6)",
    "rins": "Álex Rins (P13)",
}

children = {
    "sprint": ("ducati", "aprilia", "yamaha"),
    "ducati": ("marc", "bagnaia"),
    "aprilia": ("jorge", "marco"),
    "yamaha": ("fabio", "rins"),
    "marc": (),
    "bagnaia": (),
    "jorge": (),
    "marco": (),
    "fabio": (),
    "rins": (),
}

parents = {}
for p, child_ids in children.items():
    for child in child_ids:
        parents[child] = p

def depth(p):
    if p == "sprint":
        return 0
    return 1 + depth(parents[p])

def height(p):
    if len(children[p]) == 0:
        return 0
    return 1 + max(height(child) for child in children[p])

print("Fabio's team:", labels[parents["fabio"]])
print("Fabio's depth:", depth("fabio"))
print("Fabio is a leaf:", len(children["fabio"]) == 0)
print("Yamaha subtree height:", height("yamaha"))
print("Sprint tree height:", height("sprint"))
print("Positions:", len(children))
print("Edges:", len(parents))
```

```text
Fabio's team: Monster Energy Yamaha MotoGP Team
Fabio's depth: 2
Fabio is a leaf: True
Yamaha subtree height: 1
Sprint tree height: 2
Positions: 10
Edges: 9
```

**Why this example?** The code mirrors the hand calculation without hiding the links inside a larger tree library. The unique IDs keep a structural position separate from its readable rider or team label.

**How to solve or modify it:** Use `"marc"` where a query uses `"fabio"` to inspect Marc. Pass `"ducati"` or `"aprilia"` to `height` to inspect another subtree. To add a selected rider, give them a new ID, place it in exactly one team's child tuple, and add a label and an empty child tuple. Then recheck `edges = positions − 1`.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section idea | Plain-language meaning | Sprint example |
| :--- | :--- | :--- |
| General tree | A position can have any number of children. | The Sprint has three selected team children. |
| Root and parent | The root has no parent; every other position has one. | Fabio's parent is Yamaha; the Sprint is the root. |
| Sibling and subtree | Siblings share a parent; a subtree includes a position and everything below it. | Fabio and Álex are siblings; Yamaha's subtree has three positions. |
| Leaf and internal position | A leaf has no children; an internal position has at least one. | Riders are leaves; teams are internal. |
| Ordered tree | Child order follows a stated rule. | Our display orders selected results by finishing place. |
| Position versus element | A position is a location; its element is stored data. | Fabio's position stores his name and P6 result. |
| Tree ADT | A common interface for asking structural questions. | `parent`, `children`, `num_children`, and `len` answer questions about the diagram. |
| Depth | Edges from the root down to a position. | Fabio has depth 2. |
| Height | Edges down to a farthest leaf. | Yamaha has height 1; the Sprint tree has height 2. |
| Efficient height | Calculate each subtree once. | Recursive `height` takes `O(n)` time with proportional child iteration. |

[🔝 Back to Top](#top)
