<span id="top"></span>

# 14.7 Minimum Spanning Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.7, printed pages 670–685 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** Minimum spanning trees and the cut property; 14.7.1 Prim–Jarník Algorithm; 14.7.2 Kruskal's Algorithm; 14.7.3 Disjoint Partitions and Union–Find Structures.<br>
> **Domain Focus:** Connect every corner of the same rectangular park with the least total length of built walkway.<br>
> **User Prompt:** Reexplain Section 14.7 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Connect the Whole Park](#background)
   - [1. Keep the geometry and walkway lengths](#background-park)
   - [2. Change the question from a route to a network](#background-question)
2. [Part 1: Minimum Spanning Trees and the Cut Property](#part-1)
   - [1. Define a spanning tree and its total weight](#part-1-tree)
   - [2. Understand a cut and its lightest crossing edge](#part-1-cut)
   - [3. Prove the safe-edge rule by an exchange](#part-1-exchange)
   - [4. Handle ties and the assumptions](#part-1-ties)
3. [Part 2: 14.7.1 Prim–Jarník Algorithm](#part-2)
   - [1. Grow one tree from a starting corner](#part-2-rule)
   - [2. Trace Prim on the park](#part-2-trace)
   - [3. Explain correctness and running time](#part-2-time)
4. [Part 3: 14.7.2 Kruskal's Algorithm](#part-3)
   - [1. Grow separate clusters without making a cycle](#part-3-rule)
   - [2. Trace the ordered park edges](#part-3-trace)
   - [3. Explain correctness and running time](#part-3-time)
5. [Part 4: 14.7.3 Disjoint Partitions and Union–Find Structures](#part-4)
   - [1. Name the three partition operations](#part-4-operations)
   - [2. Represent groups as sequences](#part-4-sequences)
   - [3. Represent groups as rooted trees](#part-4-trees)
   - [4. Follow union by size and path compression](#part-4-park)
6. [Part 5: Program Both Algorithms in Python](#part-5)
   - [1. Relate the book's fragments to the program](#part-5-book)
   - [2. Run the complete park program](#part-5-program)
   - [3. Read the output and its complexity](#part-5-output)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Connect the Whole Park

<span id="background-park"></span>

### 1. Keep the geometry and walkway lengths

We continue the [four-corner park from Section 14.1](14-01-graphs.md) and the [weighted routes from Section 14.6](14-06-shortest-paths.md). The corners form a 3 cm by 4 cm rectangle:

| Corner | Coordinate | Corner | Coordinate |
| :----- | :--------- | :----- | :--------- |
| `A` | $(0,0)$ | `B` | $(3,0)$ |
| `C` | $(3,4)$ | `D` | $(0,4)$ |

Each available walkway is a **two-way, undirected edge**. Its weight is the physical length walked along it. We write `AD` for the same left-side edge that earlier guides may call `DA`.

| Walkway | Length | Geometric meaning |
| :------ | -----: | :---------------- |
| `AB` | 3 cm | Bottom side. |
| `BC` | 4 cm | Right side. |
| `CD` | 3 cm | Top side. |
| `AD` | 4 cm | Left side. |
| `AC` | 9 cm | Winding diagonal walkway; its endpoints are only $\sqrt{3^2+4^2}=5$ cm apart in a straight line. |
| `BD` | Absent | A 5 cm straight-line separation does not create a walkway. |

Thus our graph has $n=4$ vertices and $m=5$ edges. It is **connected**: all corners can be reached using the available walkways. The 9 cm diagonal is a real edge, but a route's or tree's cost uses its **walkway length**, not its straight-line endpoint separation.

<span id="background-question"></span>

### 2. Change the question from a route to a network

In Section 14.6, the question was: “What is the shortest walk from `A` to each corner?” Here the construction crew asks: “Which walkways should we keep or build so that **every** corner is connected, while the **sum of selected walkway lengths** is as small as possible?”

A network can have short **total** length yet give a long route between particular corners. For example, selecting `AB`, `BC`, and `CD` costs $3+4+3=10$ cm altogether, but travel from `A` to `D` within that selected network takes $3+4+3=10$ cm. In the full park, the direct `AD` walkway is only 4 cm. This distinction between **network cost** and **one travel distance** drives the whole section.

> **Mental model:** A shortest-path tree optimizes routes from a chosen source. A minimum spanning tree optimizes the **total weight of the connecting network**.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Minimum Spanning Trees and the Cut Property

<span id="part-1-tree"></span>

### 1. Define a spanning tree and its total weight

A **spanning tree** of a connected, undirected graph includes every vertex, connects them all, and has **no cycle**. A tree on $n$ vertices always has exactly $n-1$ edges. For the four-corner park, we must choose exactly three edges. Choosing fewer cannot connect all four corners; adding a fourth edge to an already connected tree would make a cycle.

For a selected edge set $T$, define its weight by **adding its edge weights**:

$$
w(T)=\sum_{e\in T}w(e).
$$

A **minimum spanning tree** (MST) is a spanning tree with the smallest possible $w(T)$. The original five-walkway park weighs $3+4+3+4+9=23$ cm if all edges are included. Two spanning trees each weigh only 10 cm:

| Selected tree edges | Arithmetic | Total |
| :------------------ | :--------- | ----: |
| `AB`, `BC`, `CD` | $3+4+3$ | 10 cm |
| `AB`, `AD`, `CD` | $3+4+3$ | 10 cm |

We will prove below why 10 cm is minimal, instead of merely guessing from the drawing.

<span id="part-1-cut"></span>

### 2. Understand a cut and its lightest crossing edge

A **cut** splits the vertex set into two nonempty groups $V_1$ and $V_2$. An edge **crosses** the cut if one endpoint lies in each group. Any connected spanning tree must contain at least one crossing edge; otherwise, the two groups would remain disconnected.

For the cut $\{\text{A}\}\mid\{\text{B,C,D}\}$, the crossing walkways are `AB` at 3 cm, `AD` at 4 cm, and `AC` at 9 cm. The lightest is `AB`. For $\{\text{A,B}\}\mid\{\text{C,D}\}$, the crossing walkways are `BC` at 4 cm, `AD` at 4 cm, and `AC` at 9 cm. The lightest weight is 4 cm, with **two** possible edges.

**Proposition 14.25, the cut property:** If $e$ is a minimum-weight edge crossing a cut, then **some** MST contains $e$. This is the rule both Prim and Kruskal use to accept an edge safely.

<span id="part-1-exchange"></span>

### 3. Prove the safe-edge rule by an exchange

Take an MST $T$. If it already contains a lightest crossing edge $e$, we are done. Otherwise:

1. Add $e$ to $T$. Because $T$ already connects its endpoints, this creates one cycle.
2. That cycle must cross the cut again on another edge $f$; a trip that goes from one side to the other must get back.
3. Remove $f$. The cycle disappears, and all vertices remain connected, so $T'=T+e-f$ is another spanning tree.
4. Since $e$ is a lightest crossing edge, $w(e)\leq w(f)$. Therefore $w(T')=w(T)+w(e)-w(f)\leq w(T)$.

The original $T$ was already minimum, so $T'$ is also an MST. This exchange explains **why** a locally lightest cut edge is safe to choose.

In the park, `AB` is uniquely lightest across the cut at `A`. If a purported MST omitted it, the exchange would strictly lower the total. Hence **every** park MST contains `AB`. Similarly, `CD` is uniquely lightest across $\{\text{D}\}\mid\{\text{A,B,C}\}$, so every MST contains `CD`. These two edges form separate pairs. The cheapest way to join the pairs is one 4 cm crossing edge, either `BC` or `AD`. Thus the minimum total is $3+3+4=10$ cm.

<span id="part-1-ties"></span>

### 4. Handle ties and the assumptions

Across $\{\text{A,B}\}\mid\{\text{C,D}\}$, both `BC` and `AD` weigh 4 cm. The cut property promises that **each tied minimum can appear in some MST**; it does not say each must appear in **every** MST. The two 10 cm trees above show this directly. If all edge weights in a connected graph are distinct, its MST is unique.

The usual MST problem assumes a **connected, undirected, weighted graph**. If the graph is disconnected, no spanning tree of **all** vertices exists; one can instead find a minimum spanning **forest**, one tree per connected component. Unlike Dijkstra's shortest-path algorithm, MST algorithms do **not** require nonnegative weights. A negative cost could make sense in an abstract model, although a physical length in centimetres cannot be negative.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 14.7.1 Prim–Jarník Algorithm

<span id="part-2-rule"></span>

### 1. Grow one tree from a starting corner

Prim–Jarník, often shortened to **Prim's algorithm**, starts at one vertex and grows a single connected **cloud** of vertices. At each step, choose the cheapest edge with **one endpoint in the cloud and one outside**, add that edge, and bring its outside endpoint into the cloud. Because the edge joins a new vertex, it cannot create a cycle. Because it is lightest across the current cloud cut, the cut property says the choice remains compatible with an MST.

The book keeps a tentative key for each outside vertex $v$: the **weight of the cheapest single edge** currently joining $v$ to a cloud vertex. It also remembers which edge supplies that key. When the cloud grows, those keys may decrease.

This is different from [Dijkstra's labels](14-06-shortest-paths.md): Dijkstra keys $v$ by a **whole route length from the source**. Prim keys $v$ by **one joining edge's weight**. For example, after `B` enters the cloud, Prim offers `BC` to `C` at key 4, not the source-route value $3+4=7$.

<span id="part-2-trace"></span>

### 2. Trace Prim on the park

Start at `A`. When several outside vertices have the same best edge weight, this study chooses the **alphabetically first destination corner**. This tie rule makes the trace reproducible; another tie rule can give another valid MST.

| Cloud before selection | Cheapest joining edge for each outside corner | Choose next | Tree edges afterward |
| :--------------------- | :-------------------------------------------- | :---------- | :------------------- |
| $\{A\}$ | $B:3$ via `AB`; $C:9$ via `AC`; $D:4$ via `AD` | `AB`, bringing in `B` | `AB` |
| $\{A,B\}$ | $C:4$ via `BC`; $D:4$ via `AD` | `BC`, bringing in `C`; `C` wins the tie | `AB`, `BC` |
| $\{A,B,C\}$ | $D:3$ via `CD`, improving its old 4 cm key | `CD`, bringing in `D` | `AB`, `BC`, `CD` |

All four vertices are now in the cloud. Prim returns `AB`, `BC`, `CD` with total $3+4+3=10$ cm. The winding `AC` edge enters no selected tree because a cheaper connection to `C` becomes available.

<span id="part-2-time"></span>

### 3. Explain correctness and running time

**Correctness:** At each step, the current cloud and the outside vertices form a cut. Prim picks a minimum-weight crossing edge and adds a previously outside vertex. Repeating the cut-property argument preserves a minimum completion, and after $n-1$ edges the result is a spanning tree.

The book's Code Fragment 14.15 gives the idea, and 14.16 implements it with an **adaptable priority queue**. A locator stores where each outside vertex lives in the queue; when a cheaper joining edge is found, its key can be decreased. With a heap, the $n$ removals and up to $m$ key updates cost $O((n+m)\log n)$ time. Since a connected graph has $m\geq n-1$, this is $O(m\log n)$. An unsorted priority queue gives $O(n^2)$ time for a simple graph: the minimum scans dominate. Our small program below uses that transparent scanning version.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 14.7.2 Kruskal's Algorithm

<span id="part-3-rule"></span>

### 1. Grow separate clusters without making a cycle

**Kruskal's algorithm** begins with each corner in its own cluster. Consider all edges from **lightest to heaviest**. Accept an edge if its endpoints currently belong to **different** clusters; then merge those clusters. Reject an edge whose endpoints are already in the same cluster, because adding it would create a cycle. Stop after accepting $n-1$ edges.

Prim maintains one growing cloud. Kruskal may grow several disconnected pieces at once, and only later join them. A **disjoint-partition**, or **union–find**, structure answers whether two endpoints are already in the same cluster.

<span id="part-3-trace"></span>

### 2. Trace the ordered park edges

For equal weights, sort by the canonical edge name after sorting by weight. Our order is `AB` (3), `CD` (3), `AD` (4), `BC` (4), `AC` (9). This tie rule makes Kruskal choose a different valid 10 cm MST from Prim.

| Next edge | Endpoint clusters before it | Action | Clusters afterward |
| :-------- | :-------------------------- | :----- | :----------------- |
| `AB`, 3 cm | $\{A\}$ and $\{B\}$ | Accept. | $\{A,B\},\{C\},\{D\}$ |
| `CD`, 3 cm | $\{C\}$ and $\{D\}$ | Accept. | $\{A,B\},\{C,D\}$ |
| `AD`, 4 cm | $\{A,B\}$ and $\{C,D\}$ | Accept. | $\{A,B,C,D\}$ |

Kruskal has accepted $n-1=3$ edges, so it **stops** with `AB`, `CD`, `AD` and total $3+3+4=10$ cm. It does not need to examine `BC` or `AC` afterward. If the scan continued only for illustration, both would be rejected because their endpoints are already connected. If the 4 cm tie were resolved in favor of `BC` first, it would instead finish with Prim's 10 cm tree.

<span id="part-3-time"></span>

### 3. Explain correctness and running time

**Correctness:** Separate either endpoint's current cluster from all other vertices to make a cut. The edge Kruskal is considering crosses that cut. If a lighter edge crossed this cut, it was considered earlier. Its endpoints were in different clusters then (clusters only merge, and they are still in different clusters now), so Kruskal would have accepted it. They would now share a cluster, a contradiction. Therefore the chosen edge is lightest across this cut and is safe by the cut property. Joining distinct clusters never creates a cycle. After $n-1$ accepted edges in a connected graph, there is one spanning tree.

Code Fragments 14.17 and 14.18 give the book's pseudocode and Python version. A sorted list or edge priority queue presents edges in order. Sorting costs $O(m\log m)$. There are at most $2m$ `find` calls and $n-1$ successful `union` calls. For a simple graph, $m=O(n^2)$, so $\log m=O(\log n)$; with the union–find structure below, the whole algorithm is $O(m\log n)$ on a connected graph.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 14.7.3 Disjoint Partitions and Union–Find Structures

<span id="part-4-operations"></span>

### 1. Name the three partition operations

Kruskal repeatedly needs to answer: “Are these two corners already connected by accepted edges?” Its **disjoint partition** keeps every vertex in exactly one cluster. The clusters never overlap, and merging them never separates them again.

| Operation in the book | Plain meaning | Park example |
| :-------------------- | :------------ | :----------- |
| `make_group(x)` | Create a one-element group containing $x$. | Start with $\{A\},\{B\},\{C\},\{D\}$. |
| `find(p)` | Return the leader of the group containing position $p$. | After `AB` is accepted, `A` and `B` have the same leader. |
| `union(p,q)` | Merge the two groups identified by $p$ and $q$. | Accepting `CD` merges $\{C\}$ and $\{D\}$. |

To decide whether edge `AD` would make a cycle, compare the leaders returned by `find(A)` and `find(D)`. If they differ, `union(A,D)` is safe. A leader is merely a **representative identifier**; its letter is not geometrically special.

<span id="part-4-sequences"></span>

### 2. Represent groups as sequences

One representation stores each group as a sequence of its elements. Each element also stores a reference to its group, so `make_group` and `find` take $O(1)$ time. Merging two groups requires changing those group references for elements that move.

Move the **smaller** sequence into the larger one. If a corner moves from a group of size $s$, its new group contains at least $2s$ corners. A corner therefore moves at most $\lfloor\log_2 n\rfloor$ times as the group size doubles toward $n$. For our four corners, a corner can move at most twice.

For $k$ total partition operations on at most $n$ elements, the book's **Proposition 14.26** gives $O(k+n\log n)$ total time. The $k$ term counts individual operations; the $n\log n$ term bounds all element moves across all unions. This is a **total sequence bound**, not the time of every single union.

<span id="part-4-trees"></span>

### 3. Represent groups as rooted trees

The book's other representation gives each element a **parent pointer**. The root is its own parent and acts as the group's leader. `find(x)` follows parents until it reaches the root. A union attaches one root below another root, keeping the groups as rooted trees.

Two improvements make this fast:

1. **Union by size:** attach the root of the smaller tree below the root of the larger tree. Only one parent pointer changes. If sizes tie, either root can win.
2. **Path compression:** while finding a root, make every element along the searched path point directly to that root. Later finds on those elements need fewer steps.

The book's **Proposition 14.27** states that $k$ operations take $O(k\log^* n)$ **amortized total time** with these improvements. Here $\log^* n$ counts how many times one must repeatedly take a base-2 logarithm to reach a value at most 1. For example, $\log^*4=2$ because $4\to2\to1$. It grows so slowly that these operations are very cheap in practice, but the bound is still stated over a **sequence** of operations, not as a promise that each separate `find` is constant time.

<span id="part-4-park"></span>

### 4. Follow union by size and path compression

Kruskal's accepted park edges produce these groups:

$$
\{A\},\{B\},\{C\},\{D\}
\;\xrightarrow{AB}\;
\{A,B\},\{C\},\{D\}
\;\xrightarrow{CD}\;
\{A,B\},\{C,D\}
\;\xrightarrow{AD}\;
\{A,B,C,D\}.
$$

For one concrete **parent-pointer** trace, resolve equal-size unions in favor of the first root passed to `union`. After `union(A,B)`, let `B` point to `A`. After `union(C,D)`, let `D` point to `C`. Finally, `union(A,D)` finds roots `A` and `C`; both groups have size 2, so let root `C` point to `A`:

| Moment | `parent[A]` | `parent[B]` | `parent[C]` | `parent[D]` |
| :----- | :---------- | :---------- | :---------- | :---------- |
| After the three accepted edges | `A` | `A` | `A` | `C` |
| After `find(D)` compresses `D→C→A` | `A` | `A` | `A` | `A` |

Before compression, `D` is already in the right group: following its parents reaches leader `A`. Compression changes the **shape of the data structure**, not the selected walkways or the 10 cm MST. Code Fragment 14.19 implements this tree-based partition idea in the book.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Program Both Algorithms in Python

<span id="part-5-book"></span>

### 1. Relate the book's fragments to the program

The book's Prim implementation (Code Fragment 14.16) uses its own `Graph` and adaptable priority-queue classes. Its Kruskal implementation (Code Fragment 14.18) uses a partition structure like Code Fragment 14.19. The complete program below uses ordinary Python objects so it can run by itself:

| Book idea | Standalone program choice |
| :-------- | :------------------------ |
| Vertex and weighted edge objects | Corner letters and `Edge` records with lengths. |
| Prim's best crossing edge for each outside vertex | `best` and `connector` dictionaries. |
| Adaptable priority queue | Scan `outside` with `min`; this is simple for four corners. |
| Kruskal's ordered edges | `sorted` by `(length, name)`. |
| Partition `find` and `union` | `UnionFind` with union by size and path compression. |

The program checks for a disconnected map and reports an error instead of calling a partial tree an MST.

<span id="part-5-program"></span>

### 2. Run the complete park program

```python
from dataclasses import dataclass
from math import inf


@dataclass(frozen=True)
class Edge:
    name: str
    u: str
    v: str
    length: int

    def other(self, corner):
        if corner == self.u:
            return self.v
        if corner == self.v:
            return self.u
        raise ValueError(f"{corner} is not an endpoint of {self.name}")


corners = "ABCD"
edges = [
    Edge("AB", "A", "B", 3),
    Edge("BC", "B", "C", 4),
    Edge("CD", "C", "D", 3),
    Edge("AD", "A", "D", 4),
    Edge("AC", "A", "C", 9),
]


def prim(vertices, available_edges, start):
    if start not in vertices:
        raise ValueError("Start corner is absent")
    incident = {v: [] for v in vertices}
    for edge in available_edges:
        incident[edge.u].append(edge)
        incident[edge.v].append(edge)

    outside = set(vertices)
    best = {v: inf for v in vertices}
    connector = {v: None for v in vertices}
    best[start] = 0
    tree = []

    while outside:
        # A vertex-letter tie rule makes the displayed trace reproducible.
        u = min(outside, key=lambda v: (best[v], v))
        if best[u] == inf:
            raise ValueError("The park is disconnected")
        outside.remove(u)
        if connector[u] is not None:
            tree.append(connector[u])

        for edge in incident[u]:
            v = edge.other(u)
            if v in outside and edge.length < best[v]:
                best[v] = edge.length
                connector[v] = edge

    return tree


class UnionFind:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.size = {v: 1 for v in vertices}

    def find(self, v):
        if self.parent[v] != v:
            self.parent[v] = self.find(self.parent[v])
        return self.parent[v]

    def union(self, u, v):
        root_u = self.find(u)
        root_v = self.find(v)
        if root_u == root_v:
            return False
        # On an equal-size tie, keep the first argument's root.
        if self.size[root_u] < self.size[root_v]:
            root_u, root_v = root_v, root_u
        self.parent[root_v] = root_u
        self.size[root_u] += self.size[root_v]
        return True


def kruskal(vertices, available_edges):
    groups = UnionFind(vertices)
    tree = []
    for edge in sorted(available_edges, key=lambda e: (e.length, e.name)):
        if groups.union(edge.u, edge.v):
            tree.append(edge)
            if len(tree) == len(vertices) - 1:
                break
    if len(tree) != len(vertices) - 1:
        raise ValueError("The park is disconnected")
    return tree, groups


def names(tree):
    return [edge.name for edge in tree]


def total(tree):
    return sum(edge.length for edge in tree)


prim_tree = prim(corners, edges, "A")
kruskal_tree, groups = kruskal(corners, edges)
print("Prim:", names(prim_tree), "=", total(prim_tree), "cm")
print("Kruskal:", names(kruskal_tree), "=", total(kruskal_tree), "cm")
print("D parent before find:", groups.parent["D"])
print("D leader:", groups.find("D"))
print("D parent after find:", groups.parent["D"])
```

<span id="part-5-output"></span>

### 3. Read the output and its complexity

```text
Prim: ['AB', 'BC', 'CD'] = 10 cm
Kruskal: ['AB', 'CD', 'AD'] = 10 cm
D parent before find: C
D leader: A
D parent after find: A
```

The two lists differ because of the 4 cm tie, but both connect all four corners with three edges and minimum total length. The last three lines expose the parent-pointer change explained above: `find(D)` reaches the same leader while shortening `D`'s path to it.

This **demonstration** scans all outside vertices to select Prim's next one, so its time is $O(n^2+m)$, or $O(n^2)$ for a simple graph. Substituting the book's adaptable heap gives Prim's $O(m\log n)$ bound on connected graphs. Kruskal uses Python's sort and the size-and-compression partition; the sorting step gives the book's overall $O(m\log n)$ bound for a simple connected graph.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which walkway is forced at corner A?</strong></summary>

**Scenario:** Use the original winding-diagonal park. Split its corners into $\{A\}$ and $\{B,C,D\}$.

**Check:** The only crossing edges are `AB` at 3 cm, `AD` at 4 cm, and `AC` at 9 cm. `AB` is the **unique** lightest crossing edge.

**Result:** The cut property and its exchange proof force `AB` into **every** MST. A drawing can suggest this, but the cut gives the reason.

</details>

<details>
<summary><strong>Case Study 2: Can two different crews both be optimal?</strong></summary>

**Scenario:** `AB` and `CD`, each 3 cm, have been chosen. The two components are $\{A,B\}$ and $\{C,D\}$.

**Check:** The crossing choices are `BC` at 4 cm, `AD` at 4 cm, and winding `AC` at 9 cm. Choosing either 4 cm edge connects all corners with no cycle. Each completed network weighs $3+3+4=10$ cm.

**Result:** Both `{AB,BC,CD}` and `{AB,AD,CD}` are MSTs. A tied lightest crossing edge is safe to choose, but neither 4 cm edge is individually required in every MST.

</details>

<details>
<summary><strong>Case Study 3: Is the cheapest network also the best route map?</strong></summary>

**Scenario:** Restore a **straight** `AC` walkway of $\sqrt{3^2+4^2}=5$ cm, keeping the four sides unchanged.

**Check:** An MST still selects `AB`, `CD`, and either `AD` or `BC` for $3+3+4=10$ cm. In either such tree, the route from `A` to `C` measures 7 cm. In the full graph, direct `AC` measures 5 cm. A shortest-path tree rooted at `A` therefore uses `AB` (3), `AD` (4), and `AC` (5), with **total selected-edge weight 12 cm**.

**Result:** The 10 cm MST minimizes **network construction length**, while the 12 cm shortest-path tree preserves shortest routes **from A**. Their optimization goals differ.

</details>

<details>
<summary><strong>Case Study 4: What changes when the 3 cm bottom side closes?</strong></summary>

**Scenario:** Return to the winding 9 cm `AC` walkway, but remove `AB`. Keep `BC` at 4 cm, `CD` at 3 cm, and `AD` at 4 cm.

**Check:** The park is still connected through `A–D–C–B`. The three edges `AD`, `CD`, and `BC` form a spanning tree weighing $4+3+4=11$ cm. Corner `B` can join only through `BC`; `A`'s cheapest connection is `AD`; `CD` completes the connection between them. Using 9 cm `AC` cannot improve the total.

**Result:** Rerunning either algorithm gives an 11 cm MST on the changed graph. A closed edge changes the answer, but does not make a spanning tree impossible while the graph stays connected.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 14.7 idea | Plain-language meaning | Rectangle-park example |
| :---------------- | :--------------------- | :--------------------- |
| **Spanning tree** | Connect every vertex without a cycle, using $n-1$ edges. | Four corners require three selected walkways. |
| **Minimum spanning tree** | Minimize the sum of selected edge weights. | Two different park trees each total 10 cm. |
| **Cut property** | A lightest edge crossing a cut can belong to an MST. | `AB` is lightest across $\{A\}\mid\{B,C,D\}$. |
| **Tied edges** | Equal lightest edges can lead to multiple MSTs. | Choose `BC` or `AD` at 4 cm. |
| **Prim–Jarník** | Grow one tree by the cheapest edge leaving its current cloud. | From `A`: accept `AB`, `BC`, `CD`. |
| **Prim's key** | Cheapest **single edge** connecting an outside vertex. | `C`'s key changes from 9 via `AC` to 4 via `BC`. |
| **Kruskal** | Scan edges by weight, joining distinct clusters. | Accept `AB`, `CD`, `AD` and stop after three edges. |
| **Union–find** | Track which vertices already share a cluster. | `find(A)` and `find(D)` agree after the third union. |
| **Union by size** | Attach the smaller group's root to the larger group's root. | Two pairs of size 2 merge into one group of size 4. |
| **Path compression** | Make searched vertices point directly to their leader. | `D→C→A` becomes `D→A` after `find(D)`. |
| **Running time** | Heap Prim and Kruskal each take $O(m\log n)$ on a simple connected graph. | Sorting five edges and joining four corners is small, but the rule scales. |
| **Different goal from shortest paths** | Low total network cost need not give the shortest individual routes. | With straight `AC`, the MST is 10 cm but an `A`-rooted shortest-path tree totals 12 cm. |

[🔝 Back to Top](#top)
