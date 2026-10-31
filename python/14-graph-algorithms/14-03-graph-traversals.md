<span id="top"></span>

# 14.3 Graph Traversals — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.3, printed pages 638–650 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** 14.3 Graph Traversals; 14.3.1 Depth-First Search; 14.3.2 DFS Implementation and Extensions; 14.3.3 Breadth-First Search.<br>
> **Domain Focus:** Explore the four-corner rectangular park from Sections 14.1–14.2, using walkway routes, cycles, and one-way variants.<br>
> **User Prompt:** Reexplain Section 14.3 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Explore the Park](#background)
   - [1. Recall the connected park graph](#background-park)
   - [2. Set an order for the study traces](#background-order)
2. [Part 1: Why Traverse a Graph?](#part-1)
   - [1. Reachability questions](#part-1-questions)
   - [2. The two exploration strategies](#part-1-strategies)
3. [Part 2: 14.3.1 Depth-First Search](#part-2)
   - [1. Go deep, then backtrack](#part-2-steps)
   - [2. Discovery edges and other edge types](#part-2-edges)
   - [3. What DFS guarantees](#part-2-properties)
   - [4. When DFS runs in linear time](#part-2-time)
4. [Part 3: 14.3.2 DFS Implementation and Extensions](#part-3)
   - [1. The discovery dictionary](#part-3-dictionary)
   - [2. Reconstruct a path](#part-3-path)
   - [3. Test connectivity](#part-3-connectivity)
   - [4. Cover all components and detect cycles](#part-3-complete)
5. [Part 4: 14.3.3 Breadth-First Search](#part-4)
   - [1. Explore one level at a time](#part-4-levels)
   - [2. Why BFS finds a minimum-edge path](#part-4-shortest)
   - [3. Nontree edges, time, and a queue](#part-4-time)
6. [Part 5: A Complete Park Traversal Program](#part-5)
   - [1. Run both searches](#part-5-program)
   - [2. Read the output](#part-5-output)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Explore the Park

<span id="background-park"></span>

### 1. Recall the connected park graph

We continue the same [park graph from Section 14.1](14-01-graphs.md), stored in the [representations from Section 14.2](14-02-data-structures-for-graphs.md). Its four corners and five **two-way** walkways are:

| Corner | Coordinate | Incident walkways |
| :----- | :--------- | :---------------- |
| `A` | $(0,0)$ | `AB`, `AC`, `DA` |
| `B` | $(3,0)$ | `AB`, `BC` |
| `C` | $(3,4)$ | `AC`, `BC`, `CD` |
| `D` | $(0,4)$ | `CD`, `DA` |

| Walkway | Length | Walkway | Length |
| :------ | -----: | :------ | -----: |
| `AB` | 3 cm | `BC` | 4 cm |
| `CD` | 3 cm | `DA` | 4 cm |
| `AC` | 5 cm | `BD` | **Absent** |

The diagonal `AC` measures $\sqrt{3^2+4^2}=5$ cm. The **straight-line distance** from `B` to `D` is also 5 cm, but there is no direct `BD` walkway. A traversal must follow the edges that actually exist.

<span id="background-order"></span>

### 2. Set an order for the study traces

From a corner, more than one walkway may be available. DFS and BFS remain correct with any edge order, but their **visit order and discovery tree can change**. To make every trace below reproducible, inspect a corner's neighboring vertices in **alphabetical order**:

```text
A: B, C, D
B: A, C
C: A, B, D
D: A, C
```

Our main search starts at `B`. The park has $n=4$ vertices and $m=5$ edges. Its geometry supplies easy route lengths, while the traversal algorithms decide which vertices and edges to explore.

> **Mental model:** A graph traversal systematically follows permitted edges and remembers which vertices it has already reached. DFS follows one branch before returning; BFS reaches all vertices one edge away before going farther.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Why Traverse a Graph?

<span id="part-1-questions"></span>

### 1. Reachability questions

A **traversal** explores a graph systematically. The book motivates it with a labyrinth and a thread that helps an explorer retrace a route. In our park, exploring from `B` answers whether another corner is **reachable** by walkways, and can record a route to it.

| Question about the park | What traversal can provide |
| :---------------------- | :------------------------- |
| Can `B` reach `D` without a direct `BD` edge? | A path, or a report that none exists. |
| Can we reach every corner from `B`? | A connectivity test. |
| Which walkways first discover corners? | A spanning tree if the graph is connected. |
| Do any walkways make a closed route? | A cycle test. |
| If the map breaks into pieces, what are they? | Connected components. |
| Which route uses the fewest walkways? | A BFS tree path. |

With **one-way** walkways, direction matters: a search can find vertices reachable from a source, help test strong connectivity, or find a directed cycle. An efficient traversal should take time proportional to the vertices and edges it examines.

<span id="part-1-strategies"></span>

### 2. The two exploration strategies

| Strategy | What happens at a newly reached corner | Park intuition |
| :------- | :------------------------------------- | :------------- |
| **Depth-first search (DFS)** | Continue through a new neighbor immediately; return when that branch has no new corner. | Follow a walkway as far as possible, then retrace your steps. |
| **Breadth-first search (BFS)** | Save newly reached neighbors for the next round. | Explore all corners one walkway away, then all corners two walkways away. |

Both can discover every vertex reachable from the start. Their **discovery edges** record how each new vertex was first reached. BFS additionally guarantees a path with the fewest **edges** from the start; DFS does not.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 14.3.1 Depth-First Search

<span id="part-2-steps"></span>

### 1. Go deep, then backtrack

DFS first marks its start `B` as visited. At the current vertex it checks each outgoing edge; when an edge leads to an **unvisited** vertex, DFS marks that vertex and recursively continues there. When there is no unvisited neighbor left, the call ends and control returns to the previous vertex. This is **backtracking**.

With the stated alphabetical order, the undirected park trace is:

| Step | Current decision | Newly discovered vertex | Discovery edge |
| :--- | :--------------- | :---------------------- | :------------- |
| Start | Mark `B`. | `B` | None; it is the root. |
| 1 | From `B`, choose `A`. | `A` | `AB` |
| 2 | From `A`, skip visited `B` and choose `C`. | `C` | `AC` |
| 3 | From `C`, skip visited `A` and `B`; choose `D`. | `D` | `CD` |
| 4 | At `D`, both `A` and `C` are visited. Return through `C`, `A`, then `B`. | None | None |

The **discovery order** is `B, A, C, D`. The discovery edges `AB`, `AC`, `CD` form the DFS tree `B–A–C–D`. It has $n-1=3$ edges. DFS does not stop permanently at the first dead end: it returns until it finds an unexplored edge or finally returns to the start.

<span id="part-2-edges"></span>

### 2. Discovery edges and other edge types

A **discovery edge** (or tree edge) first reaches an unvisited vertex. A **nontree edge** is an edge that did not discover a new vertex; seeing a discovery edge again from its other endpoint does not change its type. In an undirected DFS, a nontree edge links the current vertex to an **ancestor** in the DFS tree and is called a **back edge**.

On our DFS tree rooted at `B`:

| Edge | Classification | Why |
| :--- | :------------- | :-- |
| `AB`, `AC`, `CD` | Discovery/tree edges | Each first reaches `A`, `C`, or `D`. |
| `BC` | Back edge | From `C` it reaches ancestor `B`. |
| `DA` | Back edge | From `D` it reaches ancestor `A`. |

An undirected tree edge is seen from both endpoints in an incidence structure. Looking from `A` back over the **same** `AB` edge to its parent `B` does not create a new back edge or a cycle. Cycle detection must ignore that parent discovery edge or mark the Edge object as already explored.

For **directed DFS**, nontree edges have three possible relationships to the DFS tree:

| Type | Where its arrow points | Park example |
| :--- | :--------------------- | :----------- |
| **Back** | To an ancestor still on the recursive path. | With `A→B→C→D→A` and `A→C`, DFS from `A` makes `D→A` a back edge. |
| **Forward** | To a descendant already discovered through other edges. | In that same search, `A→C` is forward after `C` was found through `A→B→C`. |
| **Cross** | To a vertex in another DFS branch: neither ancestor nor descendant. | Reorient the five walkways as `A→B`, `B→C`, `A→C`, `A→D`, `D→C`. DFS from `A` explores `B` first, then later `D`; `D→C` is cross. |

The reoriented cross-edge example changes only the **directions** of existing park walkways. It adds no `BD` edge.

<span id="part-2-properties"></span>

### 3. What DFS guarantees

**Proposition 14.12 (undirected):** Starting at `B`, DFS visits every vertex in `B`'s connected component. The discovery edges form a **spanning tree of that component**. Our park is connected, so `AB`, `AC`, and `CD` span all four corners. Each discovery edge brings in a new vertex, so these edges cannot make a cycle.

Why can DFS not miss a reachable corner? If a path from `B` led to a missed vertex, consider the **first** missed vertex on that path. Its preceding vertex was visited, and DFS would have checked their connecting edge, a contradiction.

**Proposition 14.13 (directed):** DFS follows outgoing arrows and visits every vertex reachable from its source. Each discovery edge points from an already reached vertex to a new one, so the directed DFS tree contains a directed path from the source to each discovered vertex. A vertex unreachable by following arrows is not discovered just because it is nearby on the drawing.

<span id="part-2-time"></span>

### 4. When DFS runs in linear time

DFS calls its recursive procedure at most once per vertex. In an undirected graph, an edge can be examined once from **each** endpoint; in a directed graph, it is examined from its origin. Thus a search of the reachable region takes $O(n_s+m_s)$ time, where $n_s$ and $m_s$ describe the reached vertices and relevant edge incidences. Exploring a whole graph takes $O(n+m)$ under these conditions:

1. We can iterate the edges incident to $v$ in $O(d_v)$ time and find an edge's opposite endpoint in $O(1)$ time. An adjacency list or map supports this; scanning a matrix row costs $O(n)$ even for a low-degree vertex.
2. We can mark and test a vertex as visited in $O(1)$ time. The book's Python dictionary gives **expected** constant time; an indexed array or fields on Vertex objects can provide a stricter bound.

The book's Propositions 14.14 and 14.15 use DFS, sometimes with extensions, for paths, connectivity, components, spanning trees, cycles, directed reachability, and strong connectivity in $O(n+m)$ time.

> **Source clarification:** Proposition 14.15 also prints *full transitive closure* in that $O(n+m)$ list. Section 14.4 (printed page 651) gives $O(n(n+m))$ for computing the full closure with one traversal from **each** of the $n$ vertices. A **single-source** reachability search is linear; the full all-sources closure has the larger bound.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 14.3.2 DFS Implementation and Extensions

<span id="part-3-dictionary"></span>

### 1. The discovery dictionary

The Python DFS in Code Fragment 14.5 uses a dictionary named `discovered`. Its **keys** are visited vertices. Each **value** is the Edge object that first reached that vertex. The caller seeds the source with `None` before invoking DFS:

```python
discovered = {B: None}
DFS(g, B, discovered)
```

Here `B` means a Vertex object in the book's Graph class. For our alphabetical park trace, the final dictionary means:

| Vertex key | Discovering Edge value | Parent found by `edge.opposite(vertex)` |
| :--------- | :---------------------- | :---------------------------------------- |
| `B` | `None` | Root; no parent. |
| `A` | `e_AB` | `B` |
| `C` | `e_AC` | `A` |
| `D` | `e_CD` | `C` |

The dictionary does **two jobs**: `v in discovered` tests whether `v` was visited, and `discovered[v]` later tells us how to retrace the DFS tree. The hash-based membership and insertion steps take expected $O(1)$ time.

<span id="part-3-path"></span>

### 2. Reconstruct a path

Code Fragment 14.6, `construct_path(u, v, discovered)`, starts at destination $v$ and follows each recorded discovery edge backward to its parent. It then reverses the collected vertex list. If $v$ is absent from `discovered`, it returns an empty list.

For `construct_path(B, D, discovered)` after our DFS:

```text
Backward from D: D ← C ← A ← B
Reverse the list: B → A → C → D
```

This is a valid **DFS-tree route** with three edges and length $3+5+3=11$ cm. There are shorter park routes from `B` to `D`: `B–A–D` and `B–C–D` each use two edges and measure $3+4=7$ cm or $4+3=7$ cm. DFS guarantees a route when one exists, **not** a minimum-edge or minimum-length route. Reconstruction takes time proportional to the returned path, at most $O(n)$ after DFS has already run.

<span id="part-3-connectivity"></span>

### 3. Test connectivity

For an **undirected** graph, run DFS from any vertex and compare the number of discovered keys with `vertex_count()`. Our search from `B` finds all $4$ of $4$ corners, so the park is connected.

For a **directed** graph, reaching everyone **from** one source is only half of strong connectivity. The book uses two searches from an arbitrary source $s$:

1. Follow outgoing arrows from $s$. Every vertex must be reachable **from** $s$.
2. Follow incoming arrows from $s$, which is equivalent to following outgoing arrows in a graph with every edge reversed. This finds every vertex that can reach $s$ in the original graph.

If both searches visit all vertices, any $u$ can reach any $v$ by the route $u\to s\to v$. Each search is linear, so the test is $O(n+m)$. For the one-way park ring `A→B→C→D→A` with diagonal `A→C`, both searches from `A` reach all corners. Remove `D→A`: the first search still reaches all, but the incoming-edge search from `A` reaches only `A`. The graph is no longer strongly connected.

<span id="part-3-complete"></span>

### 4. Cover all components and detect cycles

One DFS finds only vertices reachable from its start. Code Fragment 14.7's `DFS_complete(g)` loops over **every** vertex. Whenever it finds an undiscovered vertex, it records `None` for that new root and starts another DFS using the **same** dictionary. The result is a **DFS forest**:

```text
for each vertex u:
    if u is not yet in forest:
        forest[u] = None
        DFS(g, u, forest)
```

In an undirected graph, each root corresponds to one connected component. For example, remove `AB` and `BC` from the park. `B` becomes isolated, while `A`, `C`, and `D` remain connected. A complete DFS now has **two roots**. Sharing the dictionary means each vertex is processed once and each edge a constant number of times, for $O(n+m)$ total work.

For a directed graph, roots of this DFS forest do **not** by themselves identify strongly connected components. The book notes that a two-pass linear-time method exists, but does not develop it here.

DFS also helps detect **cycles**: a graph has a cycle if and only if a DFS finds a back edge. A back edge from descendant to ancestor closes a cycle with the tree path between them. In our undirected trace, `BC` closes `B–A–C–B`, a triangle with perimeter $3+5+4=12$ cm. In a directed search, a visited endpoint might instead be reached by a **forward or cross** edge; to identify a back edge, track which ancestors still have active recursive calls. The parent discovery edge in an undirected search must not be mistaken for a separate back edge.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 14.3.3 Breadth-First Search

<span id="part-4-levels"></span>

### 1. Explore one level at a time

BFS starts at source $s$ in **level 0**. Its neighbors enter **level 1**; newly reached neighbors of level 1 enter **level 2**, and so on. Code Fragment 14.8 begins with `level = [s]`, scans all vertices in the current level, puts each newly discovered neighbor in `next_level`, then moves to that next level.

With source `B` and alphabetical neighbor order:

| Level | Corners | How they were first reached |
| ----: | :------ | :-------------------------- |
| 0 | `B` | Source. |
| 1 | `A`, `C` | `AB` and `BC` from `B`. |
| 2 | `D` | `DA` from `A`, which is processed before `C`. |

So the **BFS tree** uses `AB`, `BC`, and `DA`. When BFS later sees `CD` from `C`, `D` is already discovered; it is not added again. Recording a vertex as discovered **when it joins the next level** prevents duplicate discoveries.

<span id="part-4-shortest"></span>

### 2. Why BFS finds a minimum-edge path

**Proposition 14.16:** BFS visits all vertices reachable from its source. A vertex at level $i$ has a BFS-tree path of exactly $i$ edges, and no graph path from the source can use fewer than $i$ edges. Otherwise BFS would have found that vertex in an earlier round.

`D` is at level 2, so `B–A–D` is a minimum-**edge** path with two walkways. Another two-edge path, `B–C–D`, is equally short by edge count. Both happen to measure 7 cm on this park. The DFS-tree route `B–A–C–D` uses three edges and measures 11 cm.

The proposition also says that for any nontree directed edge $(u,v)$, $\operatorname{level}(v)\leq\operatorname{level}(u)+1$: an edge from $u$ would have discovered $v$ by the next level at the latest. For an undirected edge, applying the same idea in both directions gives $|\operatorname{level}(u)-\operatorname{level}(v)|\leq1$.

**Fewest edges is not automatically shortest geometric distance.** BFS ignores the centimetre values stored on edges; a one-edge walkway could wind farther than a route using two shorter walkways. Weighted shortest paths are studied later in the chapter.

<span id="part-4-time"></span>

### 3. Nontree edges, time, and a queue

With undirected BFS, every nontree edge is a **cross edge** between BFS-tree branches. In our trace, `AC` joins the two level-1 vertices `A` and `C`, while `CD` joins `C` at level 1 to `D` at level 2 in another branch. A directed BFS can have **back** or **cross** nontree edges, but no forward nontree edge.

Like DFS, BFS reaches its source's region in $O(n_s+m_s)$ time when incident-edge iteration and visited tests are efficient. **Proposition 14.17** gives $O(n+m)$ for a graph stored with adjacency lists. BFS can restart at undiscovered vertices to cover a disconnected graph; the same `construct_path` function works with BFS's discovery dictionary.

The book's code uses a list for each level. An equivalent implementation keeps the search fringe in a **FIFO queue**: remove the oldest vertex from the front and add each new neighbor to the back. Both arrangements ensure that vertices one edge away are processed before vertices two edges away.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: A Complete Park Traversal Program

<span id="part-5-program"></span>

### 1. Run both searches

This small executable program models the same five park edges. It uses a dictionary of incidence lists and an `Edge.opposite` method, matching the operations used in the book's DFS and BFS. Neighbor lists are sorted alphabetically for the traces above.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Edge:
    name: str
    u: str
    v: str
    cm: int

    def opposite(self, vertex):
        if vertex == self.u:
            return self.v
        if vertex == self.v:
            return self.u
        raise ValueError("vertex is not an endpoint")

edges = [
    Edge("AB", "A", "B", 3), Edge("BC", "B", "C", 4),
    Edge("CD", "C", "D", 3), Edge("DA", "D", "A", 4),
    Edge("AC", "A", "C", 5),
]
incident = {corner: [] for corner in "ABCD"}
for edge in edges:
    incident[edge.u].append(edge)
    incident[edge.v].append(edge)
for corner in incident:
    incident[corner].sort(key=lambda edge: edge.opposite(corner))

def dfs(u, discovered, order):
    order.append(u)
    for edge in incident[u]:
        v = edge.opposite(u)
        if v not in discovered:
            discovered[v] = edge
            dfs(v, discovered, order)

def bfs(source, discovered):
    level = [source]
    levels = []
    while level:
        levels.append(level)
        next_level = []
        for u in level:
            for edge in incident[u]:
                v = edge.opposite(u)
                if v not in discovered:
                    discovered[v] = edge
                    next_level.append(v)
        level = next_level
    return levels

def tree_path(source, target, discovered):
    if target not in discovered:
        return []
    path = [target]
    while path[-1] != source:
        vertex = path[-1]
        path.append(discovered[vertex].opposite(vertex))
    path.reverse()
    return path

dfs_tree = {"B": None}
dfs_order = []
dfs("B", dfs_tree, dfs_order)
bfs_tree = {"B": None}
bfs_levels = bfs("B", bfs_tree)

dfs_route = tree_path("B", "D", dfs_tree)
bfs_route = tree_path("B", "D", bfs_tree)
print("DFS order:", dfs_order)
print("DFS route:", dfs_route, sum(dfs_tree[v].cm for v in dfs_route[1:]))
print("BFS levels:", bfs_levels)
print("BFS route:", bfs_route, sum(bfs_tree[v].cm for v in bfs_route[1:]))
```

<span id="part-5-output"></span>

### 2. Read the output

```text
DFS order: ['B', 'A', 'C', 'D']
DFS route: ['B', 'A', 'C', 'D'] 11
BFS levels: [['B'], ['A', 'C'], ['D']]
BFS route: ['B', 'A', 'D'] 7
```

The final numbers are **centimetres**. Both searches mark each corner once, but the paths come from different discovery trees. `tree_path` follows recorded parent edges backward and reverses the list, just as the book's `construct_path` does.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How can B reach D without a BD walkway?</strong></summary>

**Scenario:** `B=(3,0)` and `D=(0,4)` are 5 cm apart in a straight line, but the graph has no `BD` edge.

**DFS trace:** Alphabetical DFS follows `B–A–C–D`. Its discovery-tree route uses three edges and measures $3+5+3=11$ cm.

**BFS trace:** Alphabetical BFS reaches `D` at level 2 through `B–A–D`. That route uses two edges and measures $3+4=7$ cm. `B–C–D` also uses two edges and measures 7 cm.

**Result:** Both prove reachability. BFS guarantees the minimum **number of edges**; the physical straight-line distance is not itself a graph route.

</details>

<details>
<summary><strong>Case Study 2: Which edge proves the park has a cycle?</strong></summary>

**Scenario:** In DFS from `B`, `AB`, `AC`, and `CD` first discover new corners.

**Check:** When `C` examines `BC`, it sees ancestor `B`. That back edge closes `B–A–C–B`, a triangle of length $3+5+4=12$ cm. The reverse view of parent edge `AC` is still the same discovery edge and is ignored for cycle detection.

**Change:** Close `BC` and `DA`. The remaining `AB`, `AC`, and `CD` form the connected path `B–A–C–D` with no cycle.

**Result:** The original graph has back edges; the changed graph is a tree with $n-1=3$ edges.

</details>

<details>
<summary><strong>Case Study 3: Are one-way park routes strongly connected?</strong></summary>

**Scenario:** Orient the four sides `A→B→C→D→A` and the diagonal `A→C`.

**Check:** Outgoing DFS from `A` reaches every corner, and incoming-edge DFS from `A` also reaches every corner. The directed ring lets each corner travel to every other.

**Change:** Close `D→A`. `A` still reaches `B`, `C`, and `D`, but `D` cannot reach `A`. One outgoing DFS alone would miss this failure.

**Result:** Strong connectivity needs the two-way reachability test, even though each **edge** remains one-way.

</details>

<details>
<summary><strong>Case Study 4: Can fewer walkways mean more centimetres?</strong></summary>

**Scenario:** Keep the same corners and connections, but imagine diagonal `AC` is rebuilt as a **winding 9 cm walkway**. Its endpoints remain 5 cm apart in a straight line. Side walkways `AB` and `BC` still measure 3 and 4 cm.

**Check:** Starting at `A`, BFS reaches `C` directly via `AC` at level 1: one edge, 9 cm. The alternative `A–B–C` uses two edges but measures $3+4=7$ cm.

**Result:** BFS chooses a minimum-**edge** path, not a minimum-**centimetre** path. Edge weights require a different shortest-path algorithm.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 14.3 idea | Plain-language meaning | Rectangle-park example |
| :---------------- | :--------------------- | :--------------------- |
| **Traversal** | Explore reachable vertices and edges systematically. | Start at `B` and inspect permitted walkways. |
| **DFS** | Follow one new branch until a dead end, then backtrack. | Visit `B, A, C, D` in that order. |
| **DFS discovery tree** | Edges that first reach new vertices. | `AB`, `AC`, `CD` span the connected park. |
| **Back / forward / cross** | Classify nontree edges by their relationship to the DFS tree. | `BC` is an undirected back edge; directed variants show the others. |
| **`discovered` dictionary** | Map each visited vertex to its parent discovery edge. | `D` maps to `e_CD` after DFS. |
| **Path reconstruction** | Follow discovery edges backward, then reverse. | DFS gives `B–A–C–D`, 11 cm. |
| **Components / cycles** | Repeat DFS for unvisited regions; back edges reveal cycles. | Isolating `B` makes two components; `BC` closes a triangle in the original graph. |
| **BFS levels** | Visit vertices in order of increasing edge count from the source. | `B` at level 0; `A,C` at 1; `D` at 2. |
| **BFS route guarantee** | The tree path uses the fewest edges, independent of weights. | `B–A–D` uses two edges and measures 7 cm. |
| **Efficiency conditions** | Fast incidence iteration and visited tests yield linear traversal. | Adjacency lists support $O(n+m)$ DFS and BFS. |

[🔝 Back to Top](#top)
