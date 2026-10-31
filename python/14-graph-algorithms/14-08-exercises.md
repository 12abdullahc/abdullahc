<span id="top"></span>

# 14.8 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.8, printed pages 686–696 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** Reinforcement R-14.1–R-14.36; Creativity C-14.37–C-14.73; Projects P-14.74–P-14.81.<br>
> **Domain Focus:** Reuse a four-corner rectangular park to study graph storage, traversal, reachability, directed schedules, weighted paths, spanning trees, and maze design.<br>
> **User Prompt:** Reexplain Section 14.8 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Park, Several Graph Questions](#background)
   - [1. Recall the park and its measurements](#background-park)
   - [2. Read the three exercise groups](#background-tasks)
2. [Part 1: Reinforcement, R-14.1–R-14.11 — Models and Storage](#part-1)
   - [1. Draw and count graphs: R-14.1–R-14.5](#part-1-models)
   - [2. Choose a representation: R-14.6–R-14.11](#part-1-storage)
3. [Part 2: Reinforcement, R-14.12–R-14.22 — Search and Order](#part-2)
   - [1. Trace DFS and BFS: R-14.12–R-14.16](#part-2-search)
   - [2. Reachability and transitive closure: R-14.17–R-14.20](#part-2-closure)
   - [3. Directed acyclic graphs: R-14.21–R-14.22](#part-2-dag)
4. [Part 3: Reinforcement, R-14.23–R-14.36 — Weights and Figures](#part-3)
   - [1. Shortest paths and minimum spanning trees: R-14.23–R-14.27](#part-3-weighted)
   - [2. Read algorithm drawings: R-14.28–R-14.35](#part-3-figures)
   - [3. Count a slow path-compression method: R-14.36](#part-3-compression)
5. [Part 4: Creativity, C-14.37–C-14.52 — Graphs and Traversals](#part-4)
   - [1. Edit and index a graph: C-14.37–C-14.39](#part-4-storage)
   - [2. Use DFS for paths and structure: C-14.40–C-14.46](#part-4-dfs)
   - [3. Use BFS for levels and coloring: C-14.47–C-14.52](#part-4-bfs)
6. [Part 5: Creativity, C-14.53–C-14.60 — Tours, Trees, and DAGs](#part-5)
   - [1. Build tours and measure tree paths: C-14.53–C-14.56](#part-5-trees)
   - [2. Recognize and optimize directed graphs: C-14.57–C-14.60](#part-5-directed)
7. [Part 6: Creativity, C-14.61–C-14.73 — Weighted Decisions](#part-6)
   - [1. Test shortest-path assumptions: C-14.61–C-14.64](#part-6-paths)
   - [2. Vary spanning-tree goals: C-14.65–C-14.69](#part-6-spanning)
   - [3. Connect DAGs, matrices, and union–find: C-14.70–C-14.73](#part-6-other)
8. [Part 7: Projects, P-14.74–P-14.81](#part-7)
   - [1. Implement graph representations: P-14.74–P-14.77](#part-7-representations)
   - [2. Compare algorithms and build applications: P-14.78–P-14.81](#part-7-applications)
9. [Part 8: One Connected Park Program](#part-8)
   - [1. Run four graph questions on the same data](#part-8-program)
   - [2. Check the output](#part-8-output)
10. [Part 9: Simple Geometry Study Cases](#part-9)
11. [Part 10: Summary](#part-10)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Park, Several Graph Questions

<span id="background-park"></span>

### 1. Recall the park and its measurements

The [earlier Chapter 14 guides](14-01-graphs.md) use four corners of a 3 cm by 4 cm rectangular park. For this guide, keep the **undirected** walkway map from [Section 14.7](14-07-minimum-spanning-trees.md):

| Corner | Coordinate | Available walkway | Walking length |
| :----- | :--------- | :----------------- | -------------: |
| `A` | $(0,0)$ | `AB` | 3 cm |
| `B` | $(3,0)$ | `BC` | 4 cm |
| `C` | $(3,4)$ | `CD` | 3 cm |
| `D` | $(0,4)$ | `AD` | 4 cm |
|  |  | `AC` | 9 cm, along a winding path |
|  |  | `BD` | No walkway |

The straight-line separation from `A` to `C` is $\sqrt{3^2+4^2}=5$ cm, but the existing `AC` walkway winds for **9 cm**. The graph has $n=4$ vertices, $m=5$ edges, and is connected. When an exercise calls for arrows, we will **orient** some of these same corner pairs and say which direction is allowed. A route through edges can differ from a straight-line measurement.

<span id="background-tasks"></span>

### 2. Read the three exercise groups

Section 14.8 contains **81 exercises**, organized as 36 Reinforcement tasks, 37 Creativity tasks, and 8 Projects. It supplies problems rather than another algorithm exposition. The numbered entries below put **every exercise** into plain language and suggest a first check; the smaller park examples explain the ideas without pretending to satisfy an exercise that specifically requires eight or twelve vertices.

| If the prompt asks you to… | Your work should show… |
| :------------------------- | :--------------------- |
| **Draw or trace** | The vertices and edges, a stated neighbor/tie order, and every relevant algorithm state. |
| **Implement or design** | A representation, the operation or invariant, edge cases, and time and space costs. |
| **Prove or justify** | Why an operation is safe or necessary, then a bound counted from actual work. |
| **Experiment** | Correctness checks, controlled graph sizes/densities, repeated measurements, and a fair comparison. |

Here $n$ is the number of vertices, $m$ the number of edges, and $\deg(v)$ the number of edges incident to $v$ in an undirected graph. A **hop** counts one edge; a **weighted length** adds edge weights. DFS and BFS use adjacency, while Dijkstra and MST algorithms use the weights too. A directed arrow can represent a permitted one-way route or a prerequisite; state which interpretation applies.

> **Mental model:** Fix the graph and ask one precise question at a time: “Who is adjacent?”, “Who is reachable?”, “How many hops?”, “How much walking length?”, or “What is the cheapest network?”

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-14.1–R-14.11 — Models and Storage

<span id="part-1-models"></span>

### 1. Draw and count graphs: R-14.1–R-14.5

These questions use the [definitions from Section 14.1](14-01-graphs.md): a component is a maximal connected piece; a **simple** graph has no parallel edges or self-loops; degree counts incident edges. Directed in-degree and out-degree count entering and leaving arrows separately.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **R-14.1** | Construct 12 vertices, 18 undirected edges, and exactly three components. One checkable construction is three separate groups of four vertices, each with all $\binom{4}{2}=6$ possible edges; the totals are $3\cdot4=12$ vertices and $3\cdot6=18$ edges. |
| **R-14.2** | Maximize the number of edges while keeping 12 vertices in three components. Concentrate vertices in one complete component and leave two isolated: sizes $10,1,1$ give $\binom{10}{2}=45$ edges. |
| **R-14.3** | Convert the book's **Figure 14.1**, edge by edge, into a symmetric adjacency matrix. On our park, row `A` has 1 under `B`, `C`, and `D`; row `B` has 0 under `D` because `BD` is absent. |
| **R-14.4** | Convert the **same book figure** to an adjacency list. For the park, `A: B,C,D` and `B: A,C`; each undirected edge appears in the lists of both endpoints. |
| **R-14.5** | Build the requested eight-vertex, 16-arrow directed graph with in-degree and out-degree 2 at every vertex, then give one directed Euler tour using all arrows. A smaller analogue is the four-sided park perimeter with **both directions** on each side: eight arrows, two in and two out at every corner. |

The park's unweighted adjacency matrix is a quick check on R-14.3 and R-14.4; the entries record **presence**, not centimetres:

```text
      A B C D
  A   0 1 1 1
  B   1 0 1 0
  C   1 1 0 1
  D   1 0 1 0
```

For the smaller Euler example in R-14.5, `A→B→C→D→A→D→C→B→A` uses each of the eight directed perimeter arrows exactly once. It illustrates the method; the book's requested drawing still needs **eight vertices and 16 arrows**.

<span id="part-1-storage"></span>

### 2. Choose a representation: R-14.6–R-14.11

The [Section 14.2 guide](14-02-data-structures-for-graphs.md) compares an edge list, adjacency lists/maps, and an adjacency matrix. The same park stores five edges in any representation, but the cost of a lookup or an update changes.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **R-14.6** | In an edge list, adding a vertex appends one item in $O(1)$ time; removing one requires finding all its incident edges among $m$ stored edges, so it takes $O(m)$. |
| **R-14.7** | For matrix insertion of `(u,v)`, place a new edge reference in the known cell `M[u,v]`; also update `M[v,u]` for an undirected graph and the edge collection/count. These are a constant number of operations. |
| **R-14.8** | For adjacency-list insertion, add the edge reference to each endpoint's incidence list, plus the graph's edge collection/count. With the chapter's linked-list model, insertion is $O(1)$. |
| **R-14.9** | Ask what is lost if the matrix's separate edge collection $E$ disappears. Enumerating edges then scans $n^2$ cells, even if only a few edges exist; this does not preserve the table's $O(m)$ `edges()` bound. |
| **R-14.10** | Without $E$, adjacency lists can enumerate edges by scanning every vertex and its incident edges, taking $O(n+m)$ and avoiding duplicates. An $O(m)$ bound alone fails when many vertices are isolated. |
| **R-14.11** | Choose a list/map for a sparse 10,000-vertex, 20,000-edge graph; compare it with a 20,000,000-edge graph, where matrix space is more competitive. For fastest `get_edge(u,v)` regardless of space, the matrix gives a direct $O(1)$ cell lookup. |

An adjacency matrix needs $\Theta(n^2)$ cells even if the graph has only the park's five edges. An adjacency list or map uses $O(n+m)$ space. “Space efficient” and “fast pair lookup” are separate goals, so name the goal before choosing a structure.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement, R-14.12–R-14.22 — Search and Order

<span id="part-2-search"></span>

### 1. Trace DFS and BFS: R-14.12–R-14.16

[DFS and BFS](14-03-graph-traversals.md) both visit reachable vertices, but DFS follows one branch deeply and BFS finishes one hop-level before the next. State the order in which neighbors are examined; otherwise, a drawing may allow several correct search trees.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **R-14.12** | With an $n\times n$ matrix, discovering one vertex's neighbors scans its whole row. Up to $n$ rows give $O(n^2)$ DFS time. |
| **R-14.13** | Redraw the book's Figure 14.8b as a DFS tree, with tree edges downward and nontree edges dashed; check which dashed edges point to ancestors. |
| **R-14.14** | In a complete graph, DFS can always visit an unvisited neighbor until all vertices are reached; its discovery tree is one **path** of $n-1$ edges. |
| **R-14.15** | In the same complete graph, BFS discovers every other vertex directly from the source; its tree is a **star** with $n-1$ spokes. |
| **R-14.16** | Draw the book's given eight-vertex graph, then follow **its listed neighbor order** exactly for DFS and BFS from vertex 1. Mark vertices when discovered, so neither search inserts a vertex twice. |

On our park, examine neighbors alphabetically. Both searches happen to visit in the sequence `A,B,C,D`, yet their **trees differ**: DFS uses `AB,BC,CD`, while BFS discovers `B,C,D` directly from `A` and uses `AB,AC,AD`. Equal visit sequences do not imply equal search behavior.

<span id="part-2-closure"></span>

### 2. Reachability and transitive closure: R-14.17–R-14.20

A [transitive closure](14-04-transitive-closure.md) records whether a directed route exists between distinct vertices. Its added arrows are **reachability facts**, not new walkways or distance measurements.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **R-14.17** | For the book's Figure 14.2, add `u→v` whenever a directed path already goes from `u` to `v`. Keep the original arrows and check each ordered pair. |
| **R-14.18** | In Figure 14.11, label the seven airport vertices in the order specified by the exercise, then record which new reachabilities appear at each Floyd–Warshall intermediate-vertex round. The round order matters to the requested trace. |
| **R-14.19** | In a simple directed path of $n$ vertices, each earlier vertex reaches every later one. Under the chapter's distinct-vertex convention, the closure has $\binom{n}{2}=n(n-1)/2$ arrows. |
| **R-14.20** | Direct a complete binary tree from parent to child. A closure arrow joins an ancestor to a descendant. Its count is the sum of vertex depths, at most $n\lfloor\log_2 n\rfloor=O(n\log n)$. |

For a smaller check, orient the park pairs as `A→B`, `B→C`, `C→D`, `A→C`, and `A→D`. The new closure arrow `B→D` follows from `B→C→D`. It is a **virtual** reachability arrow; no `BD` walkway has been built.

<span id="part-2-dag"></span>

### 3. Directed acyclic graphs: R-14.21–R-14.22

In a [directed acyclic graph](14-05-directed-acyclic-graphs.md), a topological order places every arrow's tail before its head. Read an arrow here as a **prerequisite**, not as a physical walking direction.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **R-14.21** | Follow only the **solid** arrows in the book's Figure 14.3d; repeatedly choose a zero-in-degree vertex and remove its outgoing arrows. More than one valid topological order may exist. |
| **R-14.22** | Turn each named course prerequisite into an arrow from prerequisite to dependent course. A course can be taken only after all of its incoming prerequisite arrows are satisfied. |

For R-14.22, `LA15` and `LA22` can start because neither has a listed prerequisite. One valid order of the nine courses is `LA15, LA22, LA16, LA31, LA32, LA127, LA141, LA126, LA169`. Verify each course appears **after** every listed prerequisite; a different valid order is also acceptable.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Reinforcement, R-14.23–R-14.36 — Weights and Figures

<span id="part-3-weighted"></span>

### 1. Shortest paths and minimum spanning trees: R-14.23–R-14.27

[Dijkstra](14-06-shortest-paths.md) minimizes a route from one start. [Prim and Kruskal](14-07-minimum-spanning-trees.md) minimize the **sum of edges in a connecting tree**. Keep those totals separate when tracing an algorithm.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **R-14.23** | Draw the specified **eight-vertex, 16-edge** connected weighted graph with distinct edge weights; choose a start and show Dijkstra's tentative and settled distances. The four-corner park is a smaller practice run, not the requested graph. |
| **R-14.24** | Modify Dijkstra for a directed graph by relaxing only **outgoing** edges from each settled vertex. An incoming arrow cannot be used backward. Keep the nonnegative-weight assumption. |
| **R-14.25** | On an eight-vertex, 16-edge graph with distinct weights, trace Prim's cheapest edge leaving its current cloud. Record the cloud, each outside vertex's cheapest joining edge, and the selected edge. |
| **R-14.26** | Use the **same** eight-vertex weighted graph for Kruskal. Sort all edges, accept an edge only when its endpoints are in different clusters, and stop after seven accepted edges. |
| **R-14.27** | Treat the book's eight islands and pair distances as a complete weighted graph. Choose seven bridges with minimum **total** length, using a spanning-tree algorithm rather than individually choosing each island's nearest neighbor. |

The park supplies a short check for R-14.23–R-14.26: from `A`, weighted shortest distances are `A:0, B:3, C:7, D:4`; Prim can select `AB,BC,CD`, while Kruskal can select `AB,CD,AD`. Both selected trees weigh 10 cm. In the book's **separate** island table for R-14.27, Kruskal's seven selected bridges are $(3,5)$, $(1,8)$, $(2,8)$, $(4,5)$, $(5,8)$, $(6,7)$, and $(2,6)$, totaling **1075 distance units**. The equal-length candidate $(2,4)$ at 175 is skipped once its endpoints already share a cluster.

<span id="part-3-figures"></span>

### 2. Read algorithm drawings: R-14.28–R-14.35

These eight exercises ask you to interpret **specific figures in the supplied chapter**. For each figure, identify what a thick or thin line, arrow, or dashed line denotes **in that figure's stage of the algorithm**. A park sketch is a useful rehearsal, but it does not replace examining the named figure.

| Exercise | Book figure(s) | What to explain |
| :------- | :------------- | :-------------- |
| **R-14.28** | 14.9 | The DFS tree, search direction, and edges outside that tree. |
| **R-14.29** | 14.8 | The corresponding distinctions for **directed** DFS. |
| **R-14.30** | 14.10 | BFS layers, discovery edges, and other edges. |
| **R-14.31** | 14.11 | The current Floyd–Warshall reachability stage and newly implied arrows. |
| **R-14.32** | 14.13 | Which vertices are ready or processed during topological sorting. |
| **R-14.33** | 14.15–14.16 | Settled vertices, tentative distances, and selected shortest-path edges in Dijkstra. |
| **R-14.34** | 14.20–14.21 | Prim's growing cloud and current candidate connections. |
| **R-14.35** | 14.22–14.24 | Kruskal's components and accepted or rejected edges. |

For example, a line marking a **tree edge** means that the algorithm chose that edge for a search or spanning tree; a dashed edge may still exist in the original graph. State what the figure's visual convention communicates before inferring any graph property from it.

<span id="part-3-compression"></span>

### 3. Count a slow path-compression method: R-14.36

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **R-14.36** | Count every parent rewrite in George's growing list, not just the links he follows. The total on a length-$h$ path is quadratic. |

George's proposed union–find procedure grows a list $L$ while walking a parent path of length $h$. Each time it sees another node, it rewrites the parent of **every** node already in $L$. A path with $h$ links therefore causes work proportional to

$$
1+2+\cdots+h=\frac{h(h+1)}{2}=\Theta(h^2).
$$

The lesson is to count **all repeated rewrites**, not just the $h$ parent links followed. The usual path-compression `find` follows the path once and then redirects its nodes once.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Creativity, C-14.37–C-14.52 — Graphs and Traversals

<span id="part-4-storage"></span>

### 1. Edit and index a graph: C-14.37–C-14.39

These tasks extend the [graph ADT](14-02-data-structures-for-graphs.md). For directed graphs, distinguish an edge's **outgoing** record at its tail from its **incoming** record at its head. The book's adjacency-map implementation stores both, so removing a vertex can find all of its incident edges.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.37** | Implement `remove_vertex(v)` for directed and undirected adjacency maps: remove each incident edge from every place it is stored, then remove $v$. Count each edge once and target $O(\deg(v))$ time, where directed degree includes incoming and outgoing edges. |
| **C-14.38** | Implement `remove_edge(e)` by deleting its endpoint-map entries and reducing the edge count. With direct edge and hash-map access, this is expected $O(1)$ time. |
| **C-14.39** | Keep the edge-list design but index edge pairs $(u,v)$ by a balanced search tree. A pair lookup takes $O(\log m)=O(\log n)$ in a simple $n$-vertex graph because $m=O(n^2)$. |

If `AB` closes in the park, remove its one undirected edge object from both `A`'s and `B`'s incidence maps. The remaining park is still connected; a later BFS can verify that separately from the update operation.

<span id="part-4-dfs"></span>

### 2. Use DFS for paths and structure: C-14.40–C-14.46

DFS maintains a path of active recursive calls. In an undirected graph, encountering an already discovered endpoint on an edge outside the DFS tree leads back to an ancestor. Several exercises turn that fact into a design or proof.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.40** | Justify why every nontree edge of an **undirected** DFS joins a vertex to an ancestor in the DFS tree. Use the active recursion stack and the fact that the opposite endpoint would otherwise have been discovered through this edge. |
| **C-14.41** | Stop the `u`-to-`v` DFS path search as soon as $v$ is discovered; propagate a found flag or path upward so sibling branches are not explored afterward. |
| **C-14.42** | In each connected component that has edges, replace every undirected edge by two opposite directed traversals and find a directed Euler tour of them. Processing all components uses each edge once **in each direction** in $O(n+m)$ time; one continuous tour of the entire graph requires its edge-bearing vertices to be connected. |
| **C-14.43** | In a directed DFS, an edge to an active **gray** ancestor reveals a directed cycle. Keep parent pointers to reconstruct and return that cycle. |
| **C-14.44** | Start a DFS or BFS at each still-unassigned vertex, assigning one component ID to all vertices found in that search. The resulting dictionary groups vertices exactly by connected component. |
| **C-14.45** | Treat an $n\times n$ maze's cells as vertices and open passages as edges. “Every cell reachable, one start-to-finish path, no loops” means the passage graph is a **tree**. A grid has $O(n^2)$ cells and passages, so a DFS tree check takes $O(n^2)$. |
| **C-14.46** | Guarantee biconnectivity by adding the missing edges of a cycle through **all $n$ vertices** in any chosen order. This adds at most $n$ edges; after removing any one vertex, the rest of that cycle is a connected path. Checking each required pair in its endpoint's adjacency list scans $O(n+m)$ entries in total. |

For C-14.45, merely finding one route from entrance to exit is insufficient: isolated cells or a separate loop would still make the maze invalid. For C-14.46, the added spanning cycle is a direct witness that no single remaining vertex is a point of failure; existing edges may shorten the list of additions.

<span id="part-4-bfs"></span>

### 3. Use BFS for levels and coloring: C-14.47–C-14.52

BFS discovers all vertices at hop level $i$ before beginning level $i+1$. That layer invariant is the basis for shortest **hop-count** routes, edge classification, and two-coloring.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.47** | Explain why an undirected nontree edge in a BFS tree joins vertices discovered on neighboring or equal levels and is classified as a **cross edge**, rather than a DFS-style back edge. |
| **C-14.48** | For a directed BFS, show why a nontree edge cannot go forward to a deeper **descendant**: such an edge would have discovered that descendant from the earlier vertex. |
| **C-14.49** | Prove that a vertex at BFS level $i$ has a tree path of exactly $i$ edges from the source and no graph path with fewer than $i$ edges. |
| **C-14.50** | Justify all of Proposition 14.16: BFS finds every reachable vertex, its levels are minimum hop counts, and a nontree arrow `u→v` satisfies $\operatorname{level}(v)\leq\operatorname{level}(u)+1$. |
| **C-14.51** | Implement BFS with a FIFO queue. Enqueue a vertex **when discovered**, then dequeue it once to inspect its neighbors; this produces the same layers as the book's level-by-level version. |
| **C-14.52** | Test bipartiteness by giving each BFS start one color and every neighbor the opposite color. An edge whose endpoints require the same color proves the graph is not bipartite. Restart in every component. |

The four **perimeter** edges make a bipartite cycle with groups $\{A,C\}$ and $\{B,D\}$. Adding winding `AC` makes triangle `A–B–C–A`, an odd cycle, so the full park is **not** bipartite. The edge's 9 cm length does not affect this yes/no property.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Creativity, C-14.53–C-14.60 — Tours, Trees, and DAGs

<span id="part-5-trees"></span>

### 1. Build tours and measure tree paths: C-14.53–C-14.56

These prompts move from visiting **edges** to measuring paths in a **tree**. Unless a prompt supplies weights, path length here means **number of edges**, not centimetres.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.53** | Find a directed Euler tour by following unused outgoing edges, then splice in further tours at vertices that still have unused edges. Balanced in/out degrees and connectedness make a complete tour possible; scan each vertex and edge only $O(1)$ times for $O(n+m)$ time. |
| **C-14.54** | From each station, run BFS but stop expanding after hop level 4. Record every station at levels 0 through 4. Repeating this for all $n$ starts gives an $O(n(n+m))$ worst-case bound with adjacency lists. |
| **C-14.55** | For a tree, run BFS from any vertex to a farthest vertex $a$, then BFS from $a$ to a farthest vertex $b$. The $a$–$b$ distance is the tree's **diameter**; both searches take $O(n)$. |
| **C-14.56** | A **center** minimizes its farthest-node hop distance. Find a diameter path and take its middle vertex, or its two middle vertices if its edge count is odd. A tree has one or two centers. |

On the tree `AB,BC,CD`, the only route from `A` to `D` has **three hops**. Its diameter is three, and the two middle corners `B` and `C` are centers: each is at most two hops from every corner. This example uses hops; the edges' 3 cm and 4 cm lengths belong to a different weighted question.

<span id="part-5-directed"></span>

### 2. Recognize and optimize directed graphs: C-14.57–C-14.60

A [DAG](14-05-directed-acyclic-graphs.md) permits a topological order. Once vertices are in that order, a path calculation can process each arrow from earlier to later without revisiting a vertex.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.57** | Detect a **compact** DAG: under some ordering, every earlier vertex has an arrow to every later vertex. Compute a topological order, then check all $\binom{n}{2}$ forward pairs in $O(n^2)$ time with a matrix or adjacency map. |
| **C-14.58** | Adapt Floyd–Warshall from Boolean reachability to weighted **all-pairs shortest lengths**: for each allowed intermediate $k$, update $D[i,j]$ with $\min(D[i,j],D[i,k]+D[k,j])$. This is $O(n^3)$ when finite shortest lengths exist. |
| **C-14.59** | Find a **longest** weighted path from $s$ to $t$ in a DAG. In topological order, keep the best known total to each vertex and relax outgoing arrows with `max`; adjacency lists give $O(n+m)$ time. |
| **C-14.60** | Build a **maximal** independent set by choosing an available vertex and excluding all of its neighbors, until none remain. With adjacency lists this takes $O(n+m)$ time. Check that no chosen pair is adjacent and that every unchosen vertex neighbors a chosen one; the result need not have **maximum size**. |

For C-14.57, a topological order alone is insufficient: the graph must contain **every** forward arrow, not just enough arrows to be acyclic. For C-14.58, a negative cycle can make some shortest lengths undefined, so specify or check the input conditions before reporting finite answers.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Creativity, C-14.61–C-14.73 — Weighted Decisions

<span id="part-6-paths"></span>

### 1. Test shortest-path assumptions: C-14.61–C-14.64

Dijkstra's algorithm depends on **nonnegative** edge weights and chooses the globally smallest tentative route, not the locally lightest next edge. These exercises test the cost bound and both assumptions.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.61** | Construct a dense graph with $\Theta(n^2)$ edges and weights that force many successful decreases of tentative distances. To prove the requested $\Omega(n^2\log n)$ time for the specified heap, count the **heap work** caused by those decreases; density alone proves only $\Omega(n^2)$ edge examinations. |
| **C-14.62** | Give a directed negative-edge counterexample without a negative cycle. For example, `s→a` costs 2, `s→b` costs 5, and `b→a` costs $-4$. Dijkstra settles $a$ at 2 before $b$, though the true route `s→b→a` costs 1. These are abstract costs, not physical lengths. |
| **C-14.63** | Test the rule “always take the lightest edge to an unvisited neighbor.” On the park from `A` to `D`, it takes `AB` (3), `BC` (4), `CD` (3), totaling 10 cm; direct `AD` is only 4 cm. |
| **C-14.64** | Remove the numeric infinity sentinel from Dijkstra: put only the source in the priority queue at first, then add a vertex when an edge first makes it reachable. Unseen vertices simply have no tentative label yet. |

The negative example is directed and acyclic, so its failure cannot be blamed on a negative cycle. The park example stays physical and nonnegative; its failure comes from confusing a **locally cheapest next step** with a **globally shortest route**.

<span id="part-6-spanning"></span>

### 2. Vary spanning-tree goals: C-14.65–C-14.69

An MST connects all vertices with $n-1$ edges and minimum **sum** of weights. Related prompts change the assumptions, the sorting method, or even what “best” means.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.65** | Prove that distinct edge weights give a unique MST. If two proposed MSTs differ, use the lightest edge in their difference and the cut property to show one choice can be improved. |
| **C-14.66** | In Borůvka's method, each current component chooses its lightest outgoing edge. The cut property makes those choices safe; each phase reduces the number of components by at least half, so $O(\log n)$ scans of $m$ edges give $O(m\log n)$. |
| **C-14.67** | With integer weights in $[1,n]$, replace comparison sorting by $n$ weight buckets. Scan buckets from light to heavy and use union–find as in Kruskal; sorting is $O(m+n)$, while union–find gives the stated $O(m\log^*n)$ total for a connected graph. |
| **C-14.68** | A route's bandwidth is its **smallest** edge bandwidth; maximize that bottleneck between $a$ and $b$. A maximum spanning tree preserves a widest-bottleneck route between every pair, or a widest-path variant of Dijkstra can solve one pair. |
| **C-14.69** | If the objective is maximum **sum** of selected bandwidths while connecting all stations with $n-1$ links, compute a **maximum spanning tree** by running Kruskal in descending weight order; sorting dominates at $O(m\log n)$ for a simple connected graph. |

Our park's `AB` and `CD` must both appear in each minimum tree; either 4 cm side completes one of two 10 cm MSTs. That tie shows why the **distinct-weight** assumption in C-14.65 matters. The bandwidth tasks use their own weight meaning: maximizing a route's weakest link in C-14.68 is a different calculation from maximizing a network's total in C-14.69.

<span id="part-6-other"></span>

### 3. Connect DAGs, matrices, and union–find: C-14.70–C-14.73

The final Creativity tasks revisit three chapter tools in new forms: a longest path in a DAG, a time-respecting route, matrix products for path information, and parent-pointer shortcuts.

| Exercise | Reexplanation and starting check |
| :------- | :------------------------------- |
| **C-14.70** | Treat the one-way, loop-free maze as a DAG whose corridor weights are coin amounts. A topological `max`-path calculation from entrance to exit finds the most collectable coins without retracing. |
| **C-14.71** | Label each airport with its earliest known arrival time. At an intermediate airport $u$, flight $f$ is feasible only when $\operatorname{departure}(f)\geq\operatorname{arrival}[u]+c(u)$; at the source, require only departure at or after the given start time $t$. With adjacency lists and an adaptable heap holding one label per airport, an earliest-arrival search takes $O((n+m)\log n)$ under a consistent chronological timetable. |
| **C-14.72** | Under Boolean matrix multiplication, $(M^p)[i,j]=1$ means a walk of **exactly $p$ arrows** from $i$ to $j$. Under min-plus multiplication with $0$ diagonal entries, $(M^p)[i,j]$ is the cheapest walk using **at most $p$ edges**, because shorter walks can be padded by zero-cost diagonal steps. |
| **C-14.73** | Karen repeatedly changes each parent on a path to its **grandparent**. One pass shortens every remaining root distance by at least about half; $O(\log h)$ scans of $O(h)$ positions give $O(h\log h)$ time on a length-$h$ path. |

The matrix distinction in C-14.72 is easy to miss. Boolean multiplication counts an **exact number of arrows** unless self-loops are included. The weighted subproblem explicitly puts zero on the diagonal, so its product can stand for **up to** that many real edges. For our park's weighted matrix, $(M^2)[A,C]=7$ cm through `A–B–C` or `A–D–C`, improving on the winding direct edge's 9 cm.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Projects, P-14.74–P-14.81

<span id="part-7-representations"></span>

### 1. Implement graph representations: P-14.74–P-14.77

The first four projects ask for the **same graph operations** under different storage layouts. Before timing them, make their answers agree on vertex and edge counts, adjacency, directedness, and iteration.

| Project | Reexplanation and starting check |
| :------ | :------------------------------- |
| **P-14.74** | Build the simplified graph ADT from collections of vertex elements and endpoint pairs using an **adjacency matrix**. Decide a stable vertex-to-row index mapping; update methods are not required here. |
| **P-14.75** | Implement the same simplified ADT with an **edge list**. Pair lookup now scans stored edges unless an additional index is supplied. |
| **P-14.76** | Implement the same simplified ADT with **adjacency lists**. Each vertex keeps its incident edges; an undirected edge appears at both endpoints. |
| **P-14.77** | Extend the P-14.76 class with insertion and removal operations. Maintain both endpoint lists and global counts together, including when a vertex with incident edges is removed. |

Initialize each version with the park's four corners and five edges. All versions should report $n=4$, $m=5$, `get_edge(A,C)` present, and `get_edge(B,D)` absent. The matrix, edge list, and adjacency lists are **representations of the same graph**, not different geometric maps.

<span id="part-7-applications"></span>

### 2. Compare algorithms and build applications: P-14.78–P-14.81

These projects ask for complete programs or experiments. Use the same generated graph for both algorithms in a comparison, and check the **result** before trusting a timing.

| Project | Reexplanation and starting check |
| :------ | :------------------------------- |
| **P-14.78** | Compare transitive closure by DFS from every vertex with Floyd–Warshall. Generate directed graphs at several sizes and densities, verify identical reachability answers, and then measure time and memory under the same setup. |
| **P-14.79** | Compare Prim and Kruskal on connected random weighted graphs. For each input, verify both return $n-1$ edges and **equal minimum total weight**; vary $n$ and $m$, repeat trials, and report timing spread. |
| **P-14.80** | Model each cell of an $n\times n$ grid as a dual-graph vertex and each shared internal wall as an edge. Give walls random weights, find an MST, remove its walls, then draw and solve the resulting maze. The removed walls make a connected, cycle-free passage graph. |
| **P-14.81** | Build each network node's hop-count routing table. Run BFS from each source; for a destination, follow its BFS-tree parents to find the **first hop** after the source. Handle multiple equal-hop routes with a stated neighbor order and mark unreachable destinations. |

For P-14.80, the exterior entrance and exit openings are separate from the **internal** dual edges. Removing a tree's internal walls creates exactly one passage route between any two cells. For P-14.81, hop count ignores centimetres: on the full park, `A→C` is one hop despite its winding 9 cm length.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: One Connected Park Program

<span id="part-8-program"></span>

### 1. Run four graph questions on the same data

This small program makes the exercise distinctions concrete. It uses alphabetical neighbor order, the five physical park walkways, and their **walking lengths**. DFS and BFS examine connectivity; Dijkstra uses lengths; Kruskal selects a minimum network; two-coloring checks whether the graph is bipartite.

```python
from collections import deque
from heapq import heappop, heappush
from math import inf


corners = "ABCD"
edges = [
    ("AB", "A", "B", 3),
    ("BC", "B", "C", 4),
    ("CD", "C", "D", 3),
    ("AD", "A", "D", 4),
    ("AC", "A", "C", 9),
]
adjacency = {v: {} for v in corners}
for name, u, v, length in edges:
    adjacency[u][v] = length
    adjacency[v][u] = length


def dfs(start):
    seen = set()
    order = []

    def visit(u):
        seen.add(u)
        order.append(u)
        for v in sorted(adjacency[u]):
            if v not in seen:
                visit(v)

    visit(start)
    return order


def bfs(start):
    queue = deque([start])
    hops = {start: 0}
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in sorted(adjacency[u]):
            if v not in hops:
                hops[v] = hops[u] + 1
                queue.append(v)
    return order, hops


def dijkstra(start):
    distance = {start: 0}
    heap = [(0, start)]
    settled = set()
    while heap:
        length, u = heappop(heap)
        if u in settled:
            continue
        settled.add(u)
        for v, edge_length in adjacency[u].items():
            proposal = length + edge_length
            if v not in settled and proposal < distance.get(v, inf):
                distance[v] = proposal
                heappush(heap, (proposal, v))
    return distance


def kruskal():
    parent = {v: v for v in corners}
    size = {v: 1 for v in corners}

    def find(v):
        if parent[v] != v:
            parent[v] = find(parent[v])
        return parent[v]

    chosen = []
    for edge in sorted(edges, key=lambda e: (e[3], e[0])):
        name, u, v, length = edge
        root_u, root_v = find(u), find(v)
        if root_u == root_v:
            continue
        if size[root_u] < size[root_v]:
            root_u, root_v = root_v, root_u
        parent[root_v] = root_u
        size[root_u] += size[root_v]
        chosen.append(edge)
        if len(chosen) == len(corners) - 1:
            break
    return [edge[0] for edge in chosen], sum(edge[3] for edge in chosen)


def bipartite(selected_edges):
    neighbors = {v: [] for v in corners}
    for name, u, v, length in selected_edges:
        neighbors[u].append(v)
        neighbors[v].append(u)

    color = {}
    for start in corners:
        if start in color:
            continue
        color[start] = 0
        queue = deque([start])
        while queue:
            u = queue.popleft()
            for v in neighbors[u]:
                if v not in color:
                    color[v] = 1 - color[u]
                    queue.append(v)
                elif color[v] == color[u]:
                    return False
    return True


bfs_order, hops = bfs("A")
distances = dijkstra("A")
mst_edges, mst_length = kruskal()
print("DFS:", dfs("A"))
print("BFS:", bfs_order, "hops:", {v: hops[v] for v in corners})
print("Dijkstra:", {v: distances[v] for v in corners})
print("Kruskal:", mst_edges, "total:", mst_length, "cm")
print("Perimeter bipartite:", bipartite(edges[:4]))
print("Full park bipartite:", bipartite(edges))
```

<span id="part-8-output"></span>

### 2. Check the output

```text
DFS: ['A', 'B', 'C', 'D']
BFS: ['A', 'B', 'C', 'D'] hops: {'A': 0, 'B': 1, 'C': 1, 'D': 1}
Dijkstra: {'A': 0, 'B': 3, 'C': 7, 'D': 4}
Kruskal: ['AB', 'CD', 'AD'] total: 10 cm
Perimeter bipartite: True
Full park bipartite: False
```

The same vertex order in DFS and BFS hides different **discovery edges**: DFS walks deeper through `A–B–C–D`, while BFS reaches `B`, `C`, and `D` from `A` in one hop. Dijkstra finds a 7 cm route to `C` along two sides, shorter than direct winding `AC` at 9 cm. Kruskal chooses three edges totaling 10 cm. Finally, the diagonal `AC` turns the bipartite perimeter into a graph containing triangle `A–B–C–A`.

The program is a small **study trace**. The graph representation, separate functions, and stated tie orders make it possible to check the result before extending an implementation to the larger graphs requested by the exercises.

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why do one hop and seven centimetres give different answers?</strong></summary>

**Scenario:** Use the full undirected park: `AB=3`, `BC=4`, `CD=3`, `AD=4`, and winding `AC=9` cm. The geometric straight line from `A` to `C` is 5 cm, but only actual walkways are usable.

**Check:** BFS from `A` discovers `C` across direct `AC` at **one hop**. The length of that particular walkway is 9 cm. Dijkstra instead compares `A–B–C` at $3+4=7$ cm and `A–D–C` at $4+3=7$ cm, so its weighted distance is 7 cm.

**Result:** BFS is right for hop-count routing in P-14.81, while Dijkstra is right for least walking length in R-14.23. The 5 cm straight-line separation is not a route.

</details>

<details>
<summary><strong>Case Study 2: Can a one-way park be scheduled and closed for reachability?</strong></summary>

**Scenario:** Orient the five corner pairs as `A→B`, `B→C`, `C→D`, `A→C`, and `A→D`. Read arrows as survey-task prerequisites for scheduling, or as permitted one-way moves for reachability.

**Check:** `A,B,C,D` is a topological order because every arrow points forward. The direct arrows already record five reachable ordered pairs. `B→C→D` adds the sixth distinct-corner reachability `B→D`; the transitive closure records that virtual arrow without building a `BD` walkway.

**Result:** Topological order addresses **when tasks can occur**; closure addresses **whether a directed route exists**. Their answers use the same arrows but ask different questions.

</details>

<details>
<summary><strong>Case Study 3: Should a walker and a bridge crew make the same greedy choice?</strong></summary>

**Scenario:** Return to the original undirected, weighted park. A walker wants to reach `D` from `A`; a crew wants to connect all four corners with minimum total built length.

**Check:** A locally greedy walker takes `AB` (3), then `BC` (4), then `CD` (3), totaling **10 cm**, while direct `AD` is **4 cm**. For the crew, `AB` and `CD` are both 3 cm; either `BC` or `AD` at 4 cm connects their two components. Both possible spanning trees total **10 cm**.

**Result:** “Take the lightest next edge” can fail for a **shortest route**, while a cut-based lightest crossing edge is safe for an **MST**. The 10 cm network total is not the walker's `A`-to-`D` distance.

</details>

<details>
<summary><strong>Case Study 4: How does a two-by-two cell maze become a tree?</strong></summary>

**Scenario:** Regard `A,B,C,D` as a $2\times2$ arrangement of **maze cells**, with only the four shared-wall adjacencies `AB`, `BC`, `CD`, and `AD`. Diagonal `AC` touches at a corner, so it is **not** a shared wall in this dual graph.

**Check:** The four-wall perimeter is connected and bipartite with parts $\{A,C\}$ and $\{B,D\}$. Assign the shared walls selection weights `AB=3`, `BC=4`, `CD=3`, and `AD=4`; these are **random priorities**, while each physical wall is one unit long. An MST can select `AB`, `BC`, and `CD`, totaling 10 priority units. Removing those three walls creates the unique passage chain `A–B–C–D`. The unselected `AD` wall stays closed. Exterior entrance and exit openings can be placed separately.

**Result:** The open-passage graph reaches every cell and has no cycle, so it has **exactly one path** between any two cells. This connects the maze-tree test in C-14.45 with the MST generator in P-14.80.

</details>

[🔝 Back to Top](#top)

---

<span id="part-10"></span>

## Part 10: Summary

| Section 14.8 exercise idea | Plain-language meaning | Rectangle-park example |
| :------------------------- | :--------------------- | :--------------------- |
| **Graph drawing and counts** | Check vertices, edges, degrees, and components against the prompt. | Four corners and five walkways form one connected graph. |
| **Graph representation** | Store the same connections as edges, neighbor lists/maps, or matrix cells. | `AB` appears in two undirected neighbor lists and two symmetric matrix cells. |
| **DFS versus BFS** | DFS goes deep; BFS discovers by hop level. | Both visit `A,B,C,D` here, but choose different discovery edges. |
| **Transitive closure** | Add virtual arrows for existing directed routes. | `B→C→D` implies virtual `B→D` in the one-way variant. |
| **Topological order** | Schedule arrows so every tail precedes its head. | `A,B,C,D` respects the case-study prerequisite arrows. |
| **Shortest weighted path** | Add edge lengths along one route. | `A–B–C` is 7 cm, beating winding direct `AC` at 9 cm. |
| **Minimum spanning tree** | Connect all corners with the least **total** edge length. | `AB,BC,CD` and `AB,AD,CD` each weigh 10 cm. |
| **Union–find** | Track components while considering edges. | Kruskal merges two pairs and then joins them. |
| **Tree and maze paths** | A connected, acyclic graph has one path between each pair. | Opening three walls in the $2\times2$ dual makes a passage tree. |
| **Bipartite check** | Color neighbors oppositely; an odd cycle obstructs it. | Perimeter is bipartite; adding `AC` makes a triangle. |
| **Matrix powers** | Keep exact arrow count separate from padded weighted walks. | Boolean $M^2$ checks two-arrow routes; min-plus $M^2[A,C]=7$ cm. |
| **Experiments** | Compare correct implementations on matched inputs at several scales. | Prim and Kruskal may select different park MSTs but must agree on 10 cm. |

[🔝 Back to Top](#top)
