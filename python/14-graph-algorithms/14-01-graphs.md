<span id="top"></span>

# 14.1 Graphs — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.1, printed pages 620–626 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** 14.1 Graphs; 14.1.1 The Graph ADT.<br>
> **Domain Focus:** Four corners of a rectangular park, five walkways, and their lengths in centimetres.<br>
> **User Prompt:** Reexplain Section 14.1 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rectangle of Walkways](#background)
   - [1. Start with points and distances](#background-points)
   - [2. Decide which pairs are connected](#background-edges)
2. [Part 1: What a Graph Represents](#part-1)
   - [1. Vertices, edges, and the graph model](#part-1-model)
   - [2. Undirected, directed, and mixed edges](#part-1-direction)
3. [Part 2: Local Graph Vocabulary](#part-2)
   - [1. Endpoints, adjacency, and incidence](#part-2-neighbors)
   - [2. Degree and arrow counts](#part-2-degree)
   - [3. Parallel edges, self-loops, and simple graphs](#part-2-simple)
4. [Part 3: Paths and Cycles](#part-3)
   - [1. Paths and simple paths](#part-3-paths)
   - [2. Cycles, direction, and acyclic graphs](#part-3-cycles)
5. [Part 4: Reachability and Graphs Inside Graphs](#part-4)
   - [1. Reachability and connectivity](#part-4-reachability)
   - [2. Subgraphs and connected components](#part-4-subgraphs)
   - [3. Forests, trees, and spanning trees](#part-4-trees)
6. [Part 5: Four Counting Facts](#part-5)
   - [1. Proposition 14.8: Sum of degrees](#part-5-degrees)
   - [2. Proposition 14.9: Incoming and outgoing totals](#part-5-arrows)
   - [3. Proposition 14.10: Maximum edges in a simple graph](#part-5-maximum)
   - [4. Proposition 14.11: Edges in connected graphs and forests](#part-5-forests)
7. [Part 6: 14.1.1 The Graph ADT](#part-6)
   - [1. Vertex and Edge objects](#part-6-objects)
   - [2. Graph queries](#part-6-queries)
   - [3. Changing the graph](#part-6-changes)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rectangle of Walkways

<span id="background-points"></span>

### 1. Start with points and distances

Imagine a small rectangular park drawn on a coordinate grid. Four corners are marked in centimetres:

| Corner | Coordinate | Position |
| :----- | :--------- | :------- |
| `A` | `(0, 0)` | Bottom left |
| `B` | `(3, 0)` | Bottom right |
| `C` | `(3, 4)` | Top right |
| `D` | `(0, 4)` | Top left |

Here is the walkway layout; the slanted line is diagonal `AC`:

```text
D────────────C
│          ╱ │
│        ╱   │
│      ╱     │
│    ╱       │
│  ╱         │
A────────────B
```

The rectangle is **3 cm wide** and **4 cm high**. Its diagonal from `A` to `C` is **5 cm**, by the Pythagorean theorem:

$$
AC=\sqrt{(3-0)^2+(4-0)^2}=\sqrt{9+16}=5\text{ cm}.
$$

These small measurements keep the geometry easy. The same ideas work for a real park measured in metres.

<span id="background-edges"></span>

### 2. Decide which pairs are connected

The park has walkways along its four sides **and** along diagonal `AC`:

| Walkway | Length | How we know |
| :------ | -----: | :---------- |
| `AB` | 3 cm | Bottom side |
| `BC` | 4 cm | Right side |
| `CD` | 3 cm | Top side |
| `DA` | 4 cm | Left side |
| `AC` | 5 cm | Diagonal |

There is **no** walkway directly from `B` to `D`, although their straight-line distance is also 5 cm. Coordinates tell us where the corners are; the walkway list tells us which direct trips are possible. We will keep this same map while changing its rules or choosing some of its walkways.

> **Mental model:** A graph records the connections we specify. A drawing helps us see them, but nearby points do not become connected just because they are nearby.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: What a Graph Represents

<span id="part-1-model"></span>

### 1. Vertices, edges, and the graph model

Section 14.1 uses a **graph** to represent relationships between pairs of objects. The objects are **vertices** (also called nodes elsewhere); the connections are **edges**. The book's examples include coauthors, class inheritance, streets, wires and pipes, flights, and Internet connections. Our objects are park corners and our connections are walkways.

Mathematically, write the graph as $G=(V,E)$:

$$
V=\{A,B,C,D\},\qquad E=\{AB,BC,CD,DA,AC\}.
$$

Here $V$ is the set of vertices and $E$ is the collection of edges. The graph has $n=|V|=4$ vertices and $m=|E|=5$ edges. An edge joins **two specified endpoints**. The letters and coordinates help us identify vertices, but the graph definition is about connections, not about plotting a function on axes.

<span id="part-1-direction"></span>

### 2. Undirected, directed, and mixed edges

If a walkway allows travel both ways, model it as an **undirected edge**. For example, the undirected edge `AB` can be used from `A` to `B` or from `B` to `A`; $(A,B)$ and $(B,A)$ name the same undirected edge.

If a path allows travel only one way, model it as a **directed edge**, or arrow. $A\to B$ has origin `A` and destination `B`; it does not allow the trip $B\to A$. A graph with all undirected edges is **undirected**; one with all directed edges is a **directed graph** or **digraph**. A graph with both kinds is **mixed**, like the book's city map with two-way and one-way streets.

| Park rule | Graph interpretation |
| :-------- | :------------------- |
| All five walkways are two-way. | An undirected graph. |
| Every walkway has one permitted direction. | A directed graph. |
| `AB` is two-way but `B→C` is one-way. | A mixed graph. |

An undirected `AB` can be **represented** in a directed graph by two arrows, $A\to B$ and $B\to A$. This is useful when a graph interface supports only an all-directed or all-undirected choice. The two arrows remain two directed edges, while the original undirected `AB` is one edge.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Local Graph Vocabulary

<span id="part-2-neighbors"></span>

### 1. Endpoints, adjacency, and incidence

The **endpoints** of `AC` are `A` and `C`. Those vertices are **adjacent** because `AC` joins them. `B` and `D` are not adjacent: `BD` is absent from $E$. An edge is **incident** to either of its endpoints, so `AC` is incident to `A` and `C`, but not to `B`.

| Question | Answer on the park map |
| :------- | :--------------------- |
| Which vertices are adjacent to `A`? | `B`, `C`, and `D`. |
| Which edges are incident to `A`? | `AB`, `DA`, and `AC`. |
| Is `B` adjacent to `D`? | No, even though $BD=5$ cm as a straight line. |

For a directed edge, its first endpoint is the **origin** and its second is the **destination**. A directed edge $A\to B$ still has `A` and `B` as endpoints. Calling them adjacent says an edge connects them; it does **not** grant travel against the arrow.

<span id="part-2-degree"></span>

### 2. Degree and arrow counts

The **degree** $\deg(v)$ of a vertex is the number of edges incident to it in this simple undirected map. Count the walkway ends at each corner:

| Vertex | Incident edges | Degree |
| :----- | :------------- | -----: |
| `A` | `AB`, `DA`, `AC` | 3 |
| `B` | `AB`, `BC` | 2 |
| `C` | `BC`, `CD`, `AC` | 3 |
| `D` | `CD`, `DA` | 2 |

For directed edges, count arrows **leaving** a vertex as its **out-degree** and arrows **entering** it as its **in-degree**. For example, if `AB` becomes $A\to B$, that arrow adds one to `A`'s out-degree and one to `B`'s in-degree. We will orient all five edges in Part 5 and check both totals.

<span id="part-2-simple"></span>

### 3. Parallel edges, self-loops, and simple graphs

The edge group can be a **collection**, so two different edges may have the same endpoints. Suppose the park builds a second, separate `A`–`B` walkway. Those two walkways are **parallel edges**. An edge that begins and ends at `A` is a **self-loop**. In a directed graph, two arrows with the **same origin and destination** are parallel; $A\to B$ and $B\to A$ are different directions, so they are not parallel.

The original park graph has neither parallel edges nor self-loops. It is a **simple graph**, which is the chapter's default unless stated otherwise. Simplicity matters for the edge-count limits in Part 5: with unrestricted parallel edges, four vertices could have arbitrarily many separate `A`–`B` walkways.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Paths and Cycles

<span id="part-3-paths"></span>

### 1. Paths and simple paths

A **path** alternates vertices and edges: start at a vertex, cross an edge incident to it, reach the next vertex, and continue. One park path is

```text
B — AB — A — AC — C — CD — D
```

The shorter vertex-only form is `B–A–C–D` because this simple graph has only one edge for each connected pair. It is a **simple path**: no vertex appears twice. A route such as `B–A–C–A–D` is a path, but it is not simple because it revisits `A`.

The path `B–A–C–D` uses **three edges** and covers $3+5+3=11$ cm. These are different measurements: *edge count* describes how many connections we cross; *geometric length* adds their centimetre values. A path's existence does not tell us that it is the shortest route.

<span id="part-3-cycles"></span>

### 2. Cycles, direction, and acyclic graphs

A **cycle** is a path with at least one edge that returns to its starting vertex. The park has the simple cycle `A–B–C–A`: it visits `A` again only at the end. Its three edges form a 3–4–5 triangle, so its geometric length is $3+4+5=12$ cm. The outer cycle `A–B–C–D–A` has four edges and length $3+4+3+4=14$ cm, the rectangle's perimeter.

For a **directed path** or **directed cycle**, every step must follow its arrow. Orient the outer sides as follows, and orient the diagonal as $A\to C$:

```text
A → B → C → D → A
```

This is a directed cycle, and anyone starting at one corner can follow the arrows around the rectangle. If the arrow $D\to A$ is removed, this particular directed cycle breaks. With only $A\to B$, $B\to C$, $C\to D$, and $A\to C$ remaining, there is **no directed cycle**; the directed graph is **acyclic**.

Two opposite arrows can themselves make a directed cycle: $A\to C\to A$. They are distinct directed edges and can occur in a simple directed graph.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Reachability and Graphs Inside Graphs

<span id="part-4-reachability"></span>

### 1. Reachability and connectivity

A vertex $u$ **reaches** $v$ if some path goes from $u$ to $v$. In the original two-way park, `B` reaches `D` via `B–A–D` or `B–C–D`, even though no direct `BD` edge exists. Because every corner can reach every other corner, the undirected graph is **connected**.

Direction changes the question. With arrows $A\to B$, $B\to C$, $C\to D$, $D\to A$, and $A\to C$, every corner can reach every other by following the outer ring. The directed graph is **strongly connected**. If we remove $D\to A$, `A` still reaches `D`, but `D` cannot reach `A`; strong connectivity is lost. The underlying two-way walkway layout still joins the corners, but the allowed one-way trips do not work in both directions.

<span id="part-4-subgraphs"></span>

### 2. Subgraphs and connected components

A **subgraph** chooses some vertices and some of the original edges between the chosen vertices. For example, $V_H=\{A,B,C\}$ and $E_H=\{AB,BC,AC\}$ form a triangular subgraph. A **spanning subgraph** keeps *all four* vertices, though it may keep fewer edges.

To see **connected components**, remove `AB` and `BC` from the original park graph. `B` is then isolated, while `A`, `C`, and `D` remain connected through `AC`, `CD`, and `DA`. The two maximal connected pieces are $\{B\}$ and $\{A,C,D\}$. A component is maximal: adding another vertex from the graph would break its connectedness.

<span id="part-4-trees"></span>

### 3. Forests, trees, and spanning trees

A **forest** has no cycles. A **tree** is a connected forest. Choose only `AB`, `BC`, and `CD`: the result is the path `A–B–C–D`. It reaches every corner, has no cycle, and therefore is a **spanning tree** of the original graph. It has all four vertices and just three edges.

Choose instead only `AB` and `CD`, while retaining all four vertices. The result is a disconnected forest with two tree components, `A–B` and `C–D`. A graph-theory tree in this section has **no required root**; it need not have a distinguished parent vertex as in rooted tree data structures.

The book's Internet example highlights a consequence: if a network contains only the edges of a spanning tree, removing **any one** of those edges disconnects it. In the full park graph, other walkways can sometimes provide a detour.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Four Counting Facts

Let $n$ be the number of vertices and $m$ the number of edges. Our original park graph has $n=4$ and $m=5$.

<span id="part-5-degrees"></span>

### 1. Proposition 14.8: Sum of degrees

For a graph, adding every vertex's degree counts each edge **twice**, once at each endpoint:

$$
\sum_{v\in V}\deg(v)=2m.
$$

The park gives $3+2+3+2=10=2(5)$. This is often called the *handshake* count: five walkways have ten ends at corners. For a directed graph, total degree counts both incoming and outgoing edges, so the same total applies. If self-loops are allowed, the usual degree convention counts a loop twice; our simple example needs no special handling.

<span id="part-5-arrows"></span>

### 2. Proposition 14.9: Incoming and outgoing totals

Orient the five original edges as $A\to B$, $B\to C$, $C\to D$, $D\to A$, and $A\to C$. Every arrow has exactly one origin and one destination:

$$
\sum_{v\in V}\operatorname{outdeg}(v)
=\sum_{v\in V}\operatorname{indeg}(v)=m.
$$

| Vertex | In-degree | Out-degree |
| :----- | --------: | ---------: |
| `A` | 1 | 2 |
| `B` | 1 | 1 |
| `C` | 2 | 1 |
| `D` | 1 | 1 |
| **Total** | **5** | **5** |

One arrow contributes one to each **total**, even though it contributes at different vertices.

<span id="part-5-maximum"></span>

### 3. Proposition 14.10: Maximum edges in a simple graph

With $n$ vertices, a **simple undirected** graph can connect each unordered pair at most once. A **simple directed** graph can use each ordered pair at most once:

$$
m\leq\frac{n(n-1)}{2}\quad\text{(undirected)},\qquad
m\leq n(n-1)\quad\text{(directed)}.
$$

For the four corners, these bounds are $4(3)/2=6$ undirected edges or $4(3)=12$ directed edges. The original park has five undirected edges; `BD` is its one missing pair. The directed maximum is twice as large because $A\to B$ and $B\to A$ are different permitted edges. Both bounds grow on the order of $n^2$, written $O(n^2)$.

<span id="part-5-forests"></span>

### 4. Proposition 14.11: Edges in connected graphs and forests

For a **nonempty undirected** graph with $n$ vertices:

| Condition | Edge-count fact | Four-corner example |
| :-------- | :-------------- | :------------------ |
| Connected | $m\geq n-1$ | Original map: $5\geq3$. |
| Tree | $m=n-1$ | `AB`, `BC`, `CD`: $3=4-1$. |
| Forest | $m\leq n-1$ | `AB`, `CD`: $2\leq3$. |

Why does a connected graph need at least $n-1$ edges? Starting from one vertex, each edge can bring at most one new vertex into the connected group. Reaching all $n$ vertices therefore needs at least $n-1$ edges. A tree has exactly that many because an extra edge between already connected vertices would make a cycle. A forest may have fewer because it can have several components. In fact, if a forest has $c$ components, adding the tree counts inside each component gives $m=n-c$.

The edge count **alone** does not prove that a graph is a tree. Removing `AB` and `BC` from the original map leaves exactly three edges (`AC`, `CD`, `DA`) on four vertices, yet `B` is isolated and `A–C–D–A` is a cycle.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 14.1.1 The Graph ADT

An **abstract data type (ADT)** says which operations a graph offers and what each operation means. Section 14.1.1 describes the interface; the next section of the book discusses ways to store a graph. The interface uses `Vertex`, `Edge`, and `Graph` objects. A `Graph` is chosen as directed or undirected when it is created.

<span id="part-6-objects"></span>

### 1. Vertex and Edge objects

A `Vertex` can store an arbitrary **element**, retrieved with `element()`. For our park, the element could be a corner label and coordinate, such as `("A", (0, 0))`. An `Edge` can also store an element; for `AC`, it could store the measured length `5` cm.

| Edge operation | Meaning | Park example |
| :------------- | :------ | :----------- |
| `element()` | Return the value stored with the edge. | The length `5` for `AC`. |
| `endpoints()` | Return the two endpoints, origin first if directed; either order is allowed if undirected. | `A` and `C` for `AC`. |
| `opposite(v)` | Return the other endpoint of an edge incident to `v`. | `AC.opposite(A)` returns `C`. |

For a directed edge $C\to D$, `opposite(D)` still identifies `C` as the other endpoint. It does **not** mean a directed trip can go backward from `D` to `C`.

<span id="part-6-queries"></span>

### 2. Graph queries

The Graph ADT offers these ways to inspect the park graph:

| Operation | What it returns | Original park example |
| :-------- | :-------------- | :-------------------- |
| `vertex_count()` | Number of vertices. | `4`. |
| `vertices()` | Iteration over all vertices. | `A`, `B`, `C`, `D` in no required order. |
| `edge_count()` | Number of edges. | `5`. |
| `edges()` | Iteration over all edges. | `AB`, `BC`, `CD`, `DA`, `AC` in no required order. |
| `get_edge(u, v)` | Edge from `u` to `v`, or `None` if absent. | `get_edge(A, C)` gives `AC`; `get_edge(B, D)` gives `None`. |
| `degree(v, out=True)` | Number of incident edges; for directed graphs, outgoing by default or incoming when `out=False`. | `degree(A)` is `3` in the undirected map. |
| `incident_edges(v, out=True)` | Iteration over incident edges; for directed graphs, outgoing by default or incoming when `out=False`. | At `A`: `AB`, `DA`, `AC`. |

In an undirected graph, `get_edge(A, C)` and `get_edge(C, A)` refer to the same edge. In a directed graph, order matters. In our five-edge directed map, `degree(A)` is `2` outgoing, while `degree(A, out=False)` is `1` incoming. The `out` choice works the same way for `incident_edges`.

<span id="part-6-changes"></span>

### 3. Changing the graph

| Operation | Meaning | Park example |
| :-------- | :------ | :----------- |
| `insert_vertex(x=None)` | Create a vertex storing `x` and return it. | Add a new corner `E` at `(6, 4)`. |
| `insert_edge(u, v, x=None)` | Create an edge from `u` to `v` (or between them if undirected), storing `x`, and return it. | Add `CE` with length `3` cm. |
| `remove_edge(e)` | Remove one edge. | Close diagonal `AC`; the four sides still connect the park. |
| `remove_vertex(v)` | Remove a vertex **and all its incident edges**. | Remove `B`; both `AB` and `BC` also disappear. |

If we add `E` and `CE` to the original map, the counts become five vertices and six edges. The element stored in an edge is supplied by the caller; the ADT does not promise to calculate a geometric length automatically. A mixed map can be modeled with a directed Graph by representing every two-way walkway with a pair of opposite arrows.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why can we not go straight from B to D?</strong></summary>

**Scenario:** `B=(3,0)` and `D=(0,4)` are opposite corners. The straight-line distance is $\sqrt{3^2+4^2}=5$ cm.

**Problem:** There is no `BD` edge in the park graph. A geometric distance by itself does not create a walkway.

**Route:** `B–A–D` measures $3+4=7$ cm; `B–C–D` measures $4+3=7$ cm. Both use two real edges and reach `D` without a direct `BD` edge.

**Result:** `B` and `D` are reachable but not adjacent. Their 5 cm straight-line separation is different from a 7 cm walkway route.

</details>

<details>
<summary><strong>Case Study 2: Can four corners have a seventh distinct two-way edge?</strong></summary>

**Scenario:** The five original walkways have degrees `3, 2, 3, 2`.

**Check:** Their degree sum is $10=2m$, so $m=5$. Four vertices have only $\binom{4}{2}=6$ unordered pairs. Adding `BD` would create the sixth possible edge.

**Result:** A seventh two-way edge would have to repeat a pair or be a self-loop, so the graph would no longer be simple. If the drawn `BD` line crossed `AC`, the crossing would become a graph vertex only if the map explicitly added a junction there.

</details>

<details>
<summary><strong>Case Study 3: What changes when walkways become one-way?</strong></summary>

**Scenario:** Use arrows $A\to B$, $B\to C$, $C\to D$, $D\to A$, and $A\to C$.

**Check:** The outer ring lets each corner reach every other, so this directed graph is strongly connected. The in-degrees total `5`, and the out-degrees total `5`.

**Change:** Close $D\to A$. Now `A` reaches `D`, but `D` has no outgoing route back. The remaining arrows make no directed cycle.

**Result:** Direction can change reachability and cycles even when the same physical corners remain.

</details>

<details>
<summary><strong>Case Study 4: Which map survives a walkway closure?</strong></summary>

**Scenario:** Compare the full five-edge map with its spanning tree `AB`, `BC`, `CD`.

**Problem:** Close `BC` in both. In the tree, `A–B` and `C–D` become separate components. It had exactly $n-1=3$ edges, so no extra route was available.

**Result:** In the full map, `B` can still reach `C` through `B–A–C` ($3+5=8$ cm). The diagonal and other sides provide a detour. The same closure has a different effect because the graphs have different edge sets.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 14.1 idea | Plain-language meaning | Rectangle-park example |
| :---------------- | :--------------------- | :--------------------- |
| **Graph $G=(V,E)$** | Objects and their specified pairwise connections. | Four corners and five walkways. |
| **Direction** | An edge may allow one-way or two-way travel. | `AB` versus $A\to B$. |
| **Adjacency / incidence** | Adjacent vertices share an edge; an incident edge touches a vertex. | `A` is adjacent to `C`; `AC` is incident to both. |
| **Degree** | Count edges at a vertex, or incoming/outgoing arrows. | `A` has undirected degree `3`. |
| **Simple graph** | No parallel edges and no self-loops. | The five original walkways are all distinct pairs. |
| **Path / cycle** | Follow edges between vertices; a cycle returns to its start. | `B–A–C–D`; triangle `A–B–C–A`. |
| **Reachability / connectivity** | Ask whether a permitted route exists. | `B` reaches `D` without a direct edge. |
| **Subgraph / component** | Keep selected vertices and edges; components are maximal connected pieces. | Remove `AB` and `BC` to isolate `B`. |
| **Forest / tree / spanning tree** | No cycles; a tree is connected; a spanning tree keeps every vertex. | `AB`, `BC`, `CD` form a spanning tree. |
| **Counting facts** | Degree sums and edge bounds check a graph's structure. | Degrees total `10`; a simple four-vertex undirected graph has at most `6` edges. |
| **Graph ADT** | Standard operations for inspecting and changing vertices and edges. | `get_edge(B, D)` returns `None`; `remove_vertex(B)` removes its two incident edges. |

[🔝 Back to Top](#top)
