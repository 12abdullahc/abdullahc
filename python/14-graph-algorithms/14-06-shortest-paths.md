<span id="top"></span>

# 14.6 Shortest Paths — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.6, printed pages 659–669 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** 14.6 Shortest Paths; 14.6.1 Weighted Graphs; 14.6.2 Dijkstra's Algorithm; running time, Python implementation, and shortest-path tree reconstruction.<br>
> **Domain Focus:** Find the least-distance routes around the four-corner rectangular park from Sections 14.1–14.5.<br>
> **User Prompt:** Reexplain Section 14.6 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Winding Park Walkway](#background)
   - [1. Recall the rectangle and its five edges](#background-park)
   - [2. Ask the right kind of shortest-route question](#background-questions)
2. [Part 1: 14.6.1 Weighted Graphs](#part-1)
   - [1. Put a number on each edge](#part-1-weights)
   - [2. Add edge weights along a path](#part-1-paths)
   - [3. Know when Dijkstra's assumptions apply](#part-1-assumptions)
3. [Part 2: 14.6.2 Dijkstra's Algorithm](#part-2)
   - [1. Tentative labels and the settled cloud](#part-2-labels)
   - [2. Relax an edge when it improves a route](#part-2-relax)
   - [3. Trace the four-corner search](#part-2-trace)
   - [4. Why the chosen label is final](#part-2-proof)
4. [Part 3: The Running Time of Dijkstra's Algorithm](#part-3)
   - [1. Count queue operations](#part-3-operations)
   - [2. Compare priority-queue choices](#part-3-choices)
5. [Part 4: Programming Dijkstra's Algorithm in Python](#part-4)
   - [1. Connect the book's code to a standalone version](#part-4-book)
   - [2. Run a complete park program](#part-4-program)
   - [3. Read the output](#part-4-output)
6. [Part 5: Reconstructing the Shortest-Path Tree](#part-5)
   - [1. Test the parent-edge equation](#part-5-equation)
   - [2. Recover a route and handle ties](#part-5-route)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Winding Park Walkway

<span id="background-park"></span>

### 1. Recall the rectangle and its five edges

We continue the [park graph from Section 14.1](14-01-graphs.md), its [storage choices from Section 14.2](14-02-data-structures-for-graphs.md), and the [BFS comparison from Section 14.3](14-03-graph-traversals.md). Sections [14.4](14-04-transitive-closure.md) and [14.5](14-05-directed-acyclic-graphs.md) used one-way variants; here the five walkways are **two-way** again.

| Corner | Coordinate | Corner | Coordinate |
| :----- | :--------- | :----- | :--------- |
| `A` | $(0,0)$ | `B` | $(3,0)$ |
| `C` | $(3,4)$ | `D` | $(0,4)$ |

The four straight sides keep their geometric lengths. For this study, reuse Section 14.3's **winding diagonal**: `A` and `C` are $\sqrt{3^2+4^2}=5$ cm apart in a straight line, but the permitted `AC` walkway winds for **9 cm**.

| Walkway | Graph weight: walking length | Geometric note |
| :------ | ---------------------------: | :------------- |
| `AB` | 3 cm | Bottom side. |
| `BC` | 4 cm | Right side. |
| `CD` | 3 cm | Top side. |
| `DA` | 4 cm | Left side. |
| `AC` | 9 cm | Winding walkway between endpoints 5 cm apart. |
| `BD` | Absent | Endpoints are 5 cm apart, but there is no walkway. |

All five existing weights are nonnegative. Changing only the `AC` walkway length keeps the graph connected and makes the difference between **fewest edges** and **least total length** visible.

<span id="background-questions"></span>

### 2. Ask the right kind of shortest-route question

From `A` to `C`, the direct `AC` walkway uses **one edge** but measures 9 cm. The perimeter routes `A–B–C` and `A–D–C` each use **two edges** and measure $3+4=7$ cm or $4+3=7$ cm. Thus BFS can give the one-edge answer while a weighted shortest-path search gives a 7 cm answer.

The 5 cm **straight-line** separation of `A` and `C` is neither route's length. It is a geometric lower bound here; the visitor must follow the actual walkways.

> **Mental model:** BFS counts edges. Dijkstra's algorithm adds their nonnegative weights and finds the smallest total from one chosen source.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 14.6.1 Weighted Graphs

<span id="part-1-weights"></span>

### 1. Put a number on each edge

A **weighted graph** gives each edge $e$ a numeric weight $w(e)$. Our weights are walkway lengths in centimetres. In another application they could be travel times or costs, so the unit and its meaning must be stated. An edge's weight need not equal the straight-line distance between its endpoint coordinates: `AC` weighs 9 cm even though its endpoints are 5 cm apart.

The book's airport example uses inter-city distances to motivate the same idea. For our park, a graph edge is a **permitted walkway** and its weight is the **length walked along that walkway**. The absent `BD` edge has no weight; its 5 cm straight-line separation does not make it an available route.

<span id="part-1-paths"></span>

### 2. Add edge weights along a path

For a path $P=(v_0,v_1,\ldots,v_k)$, its weight is the sum of its edge weights:

$$
w(P)=\sum_{i=0}^{k-1}w(v_i,v_{i+1}).
$$

The **distance** $d(s,v)$ is the minimum such sum over permitted paths from $s$ to $v$. If no path exists, we conventionally use $d(s,v)=\infty$. The empty route gives $d(s,s)=0$.

| Path from `A` to `C` | Edge count | Weight |
| :------------------ | ---------: | -----: |
| `A–C` | 1 | $9$ cm |
| `A–B–C` | 2 | $3+4=7$ cm |
| `A–D–C` | 2 | $4+3=7$ cm |

Therefore $d(A,C)=7$ cm. A shortest path is defined by the **minimum total weight**, not by the minimum number of edges. When every edge has unit weight, the two goals coincide and BFS solves the problem.

<span id="part-1-assumptions"></span>

### 3. Know when Dijkstra's assumptions apply

**Dijkstra's algorithm requires every edge weight to be nonnegative.** Physical lengths satisfy that requirement. Zero-weight edges are permitted, although they create some path-tree tie details discussed later. Negative costs can arise in other models, but Dijkstra's greedy choice is not generally valid for them.

A **negative-weight cycle** can make a minimum path cost undefined: repeat the cycle any number of times before proceeding to the destination, reducing the cost without limit. There is no negative-length walkway in our geometry example. Even a negative edge without a negative cycle is outside Dijkstra's stated guarantee.

We seek shortest paths from **one source** to every vertex reachable from it. The book's algorithm works with directed or undirected graphs, provided the edge weights meet this condition; for a directed graph, only outgoing edges may be relaxed.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 14.6.2 Dijkstra's Algorithm

<span id="part-2-labels"></span>

### 1. Tentative labels and the settled cloud

Dijkstra's algorithm grows a set of vertices whose shortest distances are **final**. The book calls that set the **cloud** $C$ and calls each tentative distance label $D[v]$. Because our park also has corners `C` and `D`, this guide writes the cloud as $S$ and the label as $L[v]$; the algorithm is otherwise the same.

Start at source `A` with $L[A]=0$, $L[B]=L[C]=L[D]=\infty$, and $S=\varnothing$. A finite $L[v]$ is the length of the **best route found so far**, so it is an **upper bound** on the true distance $d(A,v)$. A priority queue chooses the vertex outside $S$ with the smallest label. That vertex enters $S$; its label will never change again. Repeat until every reachable vertex is settled.

This is a greedy choice: select the currently cheapest unsettled vertex before examining ways to improve its unsettled neighbors. It resembles BFS's expanding frontier, but the order comes from **total weight**, not edge count.

<span id="part-2-relax"></span>

### 2. Relax an edge when it improves a route

After settling $u$, examine an edge from $u$ to an unsettled neighbor $v$. A route to $u$, followed by edge $(u,v)$, has tentative length $L[u]+w(u,v)$. **Relaxation** makes this comparison:

$$
\text{if }L[u]+w(u,v)<L[v],\quad
L[v]\leftarrow L[u]+w(u,v).
$$

For example, settling `A` first discovers the direct winding route to `C`, so $L[C]=9$. After `B` is settled at distance 3, its 4 cm edge to `C` offers $3+4=7<9$. Relaxation lowers $L[C]$ to 7. The priority queue must then reflect the new key for `C`.

The comparison is **strict**. When `D` later offers another 7 cm route to `C`, it ties the current label and does not change it. Either route is shortest.

<span id="part-2-trace"></span>

### 3. Trace the four-corner search

Use `A` as the source and inspect each corner's neighbors alphabetically. The table shows labels **after** relaxing the newly settled vertex:

| Step | Settle vertex | $L[A]$ | $L[B]$ | $L[C]$ | $L[D]$ | Settled set $S$ |
| :--- | :------------ | -----: | -----: | -----: | -----: | :-------------- |
| Start | None | 0 | $\infty$ | $\infty$ | $\infty$ | $\varnothing$ |
| 1 | `A` at 0 | 0 | 3 | 9 | 4 | $\{A\}$ |
| 2 | `B` at 3 | 0 | 3 | **7** | 4 | $\{A,B\}$ |
| 3 | `D` at 4 | 0 | 3 | 7 | 4 | $\{A,B,D\}$ |
| 4 | `C` at 7 | 0 | 3 | 7 | 4 | $\{A,B,C,D\}$ |

At step 2, `B` improves `C` from 9 to 7. At step 3, `D` gives $L[D]+w(D,C)=4+3=7$, an equal route, so the label stays 7. The final distances from `A` are $d(A,A)=0$, $d(A,B)=3$, $d(A,C)=7$, and $d(A,D)=4$ cm.

The settled order `A,B,D,C` happens to match one topological order of Section 14.5's **separate directed task graph**, but the two algorithms answer different questions. Dijkstra orders vertices by **computed distance**; topological sorting orders prerequisite tasks and does not use weights.

<span id="part-2-proof"></span>

### 4. Why the chosen label is final

**Proposition 14.23** states that when Dijkstra pulls a vertex $z$ into the cloud, $L[z]=d(s,z)$. The key reason is that all edge weights are **nonnegative**.

Suppose, for contradiction, that $z$ is the **first** vertex settled with a label larger than its true distance. On a shortest path from source $s$ to $z$, let $y$ be the first vertex not yet settled just before $z$ is chosen, and let $x$ be its predecessor. Since $x$ was settled earlier and was correct, relaxing $x\to y$ ensured $L[y]=d(s,y)$: the path through $x$ reaches $y$ with its true shortest cost.

The algorithm chose $z$ over $y$, so $L[z]\le L[y]=d(s,y)$. The rest of the shortest path from $y$ to $z$ cannot have negative weight, so $d(s,y)\le d(s,z)$. Hence $L[z]\le d(s,z)$, contradicting the claim that $L[z]$ was too large. Once a vertex is settled, its label is final.

If negative edges were allowed, the final inequality might fail: a path through an unsettled vertex could later lower an already settled label. That is why the nonnegative-weight requirement is part of the algorithm, not just a convenient property of our park.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: The Running Time of Dijkstra's Algorithm

<span id="part-3-operations"></span>

### 1. Count queue operations

With an adjacency list or map, processing all outgoing edges over the whole run takes $O(n+m)$ time: each vertex is settled once and each edge incidence is scanned a constant number of times. The book assumes weight addition and comparison take $O(1)$ time.

Code Fragment 14.12 maintains an **adaptable priority queue** of unsettled vertices. It needs $n$ initial insertions, $n$ minimum removals, and at most $O(m)$ key updates caused by successful relaxations. For a two-way edge, scanning both endpoints changes only a constant factor.

<span id="part-3-choices"></span>

### 2. Compare priority-queue choices

| Queue choice | Minimum removal | Key update | Total Dijkstra time |
| :----------- | :-------------- | :--------- | :------------------ |
| Adaptable **heap** with locators | $O(\log n)$ | $O(\log n)$ | $O((n+m)\log n)$ |
| Location-aware **unsorted sequence** | $O(n)$ | $O(1)$ | $O(n^2+m)=O(n^2)$ for a simple graph |
| Advanced **Fibonacci heap** | Amortized $O(\log n)$ | Amortized $O(1)$ | $O(m+n\log n)$ |

These are the alternatives discussed around **Proposition 14.24**. A heap is preferable by these bounds for a relatively sparse graph; the simple unsorted choice can be competitive for a dense graph. The four-corner program below uses a direct minimum scan to keep the mechanics visible, so it follows the **unsorted** approach rather than the book's adaptable-heap implementation.

An adjacency matrix can also find neighbors, but scanning a full row costs $O(n)$ even when a vertex has few edges. The bounds above assume the efficient incident-edge access of adjacency lists or maps. They are **growth bounds**, not exact operation counts for our four vertices.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Programming Dijkstra's Algorithm in Python

<span id="part-4-book"></span>

### 1. Connect the book's code to a standalone version

Code Fragment 14.13 keeps a tentative-distance dictionary `d`, a settled-distance dictionary `cloud`, and a `pqlocator` dictionary so an adaptable heap can update a vertex's priority. It starts the source at 0 and other vertices at `float('inf')`, then relaxes outgoing edges. Its intended result is a map from **reachable** vertices to distances.

> **Source clarification:** As printed, Code Fragment 14.13 initially puts **every** vertex in the queue and does not stop when the smallest key is infinity. On a disconnected graph, it can therefore also insert unreachable vertices into `cloud` with value $\infty$, despite the function description saying “reachable.” The standalone version below stops when the best remaining label is infinity.

Our program uses a simple minimum scan over unsettled vertices instead of the book's adaptable heap. That keeps the code self-contained and matches the unsorted priority-queue choice discussed in Part 3. It also records a parent whenever relaxation finds a **strictly better** route, so we can display an actual path later.

<span id="part-4-program"></span>

### 2. Run a complete park program

The two-way adjacency lists below store both directions of each physical walkway. The entries for `AC` use **9 cm along the winding path**, rather than the 5 cm straight-line separation of its endpoints.

```python
from math import inf

park = {
    "A": [("B", 3), ("C", 9), ("D", 4)],
    "B": [("A", 3), ("C", 4)],
    "C": [("A", 9), ("B", 4), ("D", 3)],
    "D": [("A", 4), ("C", 3)],
}

def shortest_paths(graph, source):
    for edges in graph.values():
        if any(weight < 0 for _, weight in edges):
            raise ValueError("Dijkstra requires nonnegative weights")

    bound = {v: inf for v in graph}
    bound[source] = 0
    parent = {}
    unsettled = set(graph)
    settled = {}

    while unsettled:
        u = min(unsettled, key=lambda v: (bound[v], v))
        if bound[u] == inf:
            break                         # remaining vertices are unreachable
        unsettled.remove(u)
        settled[u] = bound[u]

        changes = []
        for v, weight in graph[u]:         # only outgoing edges for directed graphs
            if v in unsettled and bound[u] + weight < bound[v]:
                bound[v] = bound[u] + weight
                parent[v] = u
                changes.append(f"{v}={bound[v]}")
        print(f"settle {u} at {bound[u]}: {', '.join(changes) or 'no change'}")

    return settled, parent

def route_to(source, target, distances, parent):
    if target not in distances:
        return []
    path = [target]
    while path[-1] != source:
        path.append(parent[path[-1]])
    return list(reversed(path))

distances, parent = shortest_paths(park, "A")
print("distances:", {v: distances[v] for v in "ABCD"})
print("parents:", {v: parent[v] for v in "BCD"})
print("route A->C:", route_to("A", "C", distances, parent), distances["C"])
```

<span id="part-4-output"></span>

### 3. Read the output

```text
settle A at 0: B=3, C=9, D=4
settle B at 3: C=7
settle D at 4: no change
settle C at 7: no change
distances: {'A': 0, 'B': 3, 'C': 7, 'D': 4}
parents: {'B': 'A', 'C': 'B', 'D': 'A'}
route A->C: ['A', 'B', 'C'] 7
```

The output matches the label table: `C` begins at 9 cm through the direct winding walkway, then improves to 7 cm through `B`. The equally good route through `D` does not replace `C`'s parent because the update test uses `<`, not `<=`. The returned `distances` dictionary contains only settled, reachable corners.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Reconstructing the Shortest-Path Tree

<span id="part-5-equation"></span>

### 1. Test the parent-edge equation

Distances alone answer **how long** the best route is; they do not explicitly give the route. Code Fragment 14.14 reconstructs a **shortest-path tree** by checking incoming edges to each reachable vertex $v$. An edge $u\to v$ from a reachable $u$ is a candidate parent edge when

$$
d(s,u)+w(u,v)=d(s,v).
$$

The selected candidate edges must also form a tree rooted at $s$; the equality alone does not guarantee that when zero-weight edges create ties.

For `C`, our distances give two qualifying incoming edges:

| Candidate parent of `C` | Calculation | Can parent `C`? |
| :---------------------- | :---------- | :-------------- |
| `A` via winding `AC` | $d(A,A)+w(A,C)=0+9=9$ | No; $9\ne d(A,C)=7$. |
| `B` via `BC` | $d(A,B)+w(B,C)=3+4=7$ | Yes. |
| `D` via `DC` | $d(A,D)+w(D,C)=4+3=7$ | Yes. |

Choosing `B` for `C`, together with parent `A` for `B` and `D`, produces tree edges `AB`, `BC`, and `AD`. Scanning all reachable vertices and their incoming edges takes $O(n+m)$ time with suitable adjacency storage, as Section 14.6 explains. For a directed graph, inspect **incoming**, not outgoing, edges when choosing a predecessor.

<span id="part-5-route"></span>

### 2. Recover a route and handle ties

Follow the parent map backward from `C`: `C→B→A`. Reverse that sequence to obtain `A→B→C`, whose weight is $3+4=7$ cm. The alternative `A→D→C` is also 7 cm; there may be more than one shortest-path tree. The strict improvement order in our program keeps `B` as `C`'s parent.

The book reconstructs parent edges **after** computing distances. Our standalone program records them during successful relaxation from a settled vertex. That choice also avoids a subtle problem if zero-weight edges are allowed: independently choosing arbitrary equal-distance incoming edges can make parent pointers cycle. With a reachable-only distance map, a separate reconstruction routine should also ignore incoming predecessors absent from that map. All weights in our park are positive, so the displayed tree is straightforward.

This **shortest-path tree from `A`** answers the best route from `A` to every reachable corner. It is a different optimization problem from the **minimum spanning tree** introduced in Section 14.7, which minimizes the total weight of edges used to connect all vertices.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Is the one-walkway route the shortest walk?</strong></summary>

**Scenario:** `A=(0,0)` and `C=(3,4)` are 5 cm apart in a straight line, but the winding `AC` walkway measures 9 cm. The side lengths stay `AB` = 3 cm and `BC` = 4 cm.

**Check:** BFS finds the direct `A–C` edge in one step. Its walking length is 9 cm. The two-edge `A–B–C` route weighs $3+4=7$ cm, and `A–D–C` also weighs $4+3=7$ cm.

**Result:** A shortest path by **edge count** need not be shortest by **total length**. Dijkstra reports $d(A,C)=7$ cm.

</details>

<details>
<summary><strong>Case Study 2: When does the estimated distance to C improve?</strong></summary>

**Scenario:** Start Dijkstra at `A` with all other labels at infinity. Inspect `A`'s outgoing walkways first.

**Check:** The direct winding edge sets $L[C]=9$. Settling `B` at 3 offers $3+4=7$, so relaxation changes $L[C]$ to 7. Settling `D` at 4 offers $4+3=7$, an equal value, so strict relaxation does not change `C`'s parent.

**Result:** A tentative label is the best route **found so far**; it can decrease before the vertex is settled. The final 7 cm label has two valid route witnesses.

</details>

<details>
<summary><strong>Case Study 3: What if the diagonal becomes straight?</strong></summary>

**Scenario:** Restore the original straight `AC` walkway. Its physical length now equals the endpoint distance $\sqrt{3^2+4^2}=5$ cm.

**Check:** The direct route weighs 5 cm, while both perimeter routes through `B` or `D` weigh 7 cm. Dijkstra settles `C` with distance 5; BFS also finds the one-edge route.

**Result:** BFS and Dijkstra agree **on this changed map** because the direct edge happens to be both the fewest-edge and the least-distance route. The guarantee that uses weights still belongs to Dijkstra.

</details>

<details>
<summary><strong>Case Study 4: Does closing AB make B unreachable?</strong></summary>

**Scenario:** Return to the winding 9 cm `AC` walkway, then close the 3 cm `AB` side. Keep `AD` = 4 cm, `DC` = 3 cm, and `CB` = 4 cm.

**Check:** The park remains connected through `A–D–C–B`. From `A` to `C`, `A–D–C` still measures $4+3=7$ cm, beating direct `AC` at 9 cm. From `A` to `B`, `A–D–C–B` weighs $4+3+4=11$ cm, shorter than `A–C–B` at $9+4=13$ cm.

**Result:** The graph's shortest paths change when an edge closes, but connectedness and the **nonnegative-weight** condition remain. Rerunning Dijkstra gives the new distances and routes.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 14.6 idea | Plain-language meaning | Rectangle-park example |
| :---------------- | :--------------------- | :--------------------- |
| **Edge weight** | A number attached to a permitted edge. | Winding `AC` weighs 9 cm, although its endpoints are 5 cm apart. |
| **Path weight** | Sum the weights of its edges. | `A–B–C` weighs $3+4=7$ cm. |
| **Shortest-path distance** | Minimum path weight from one source to a destination. | $d(A,C)=7$ cm on the winding-walkway map. |
| **BFS limit** | Minimizes edge count; handles unit-weight shortest paths. | BFS chooses one-edge `A–C`, 9 cm. |
| **Dijkstra requirement** | All edge weights must be nonnegative. | All park lengths are positive. |
| **Tentative label** | Best route length found so far, still able to improve. | $L[C]$ changes from 9 to 7. |
| **Relaxation** | Replace a label when a route through a settled vertex is shorter. | Through `B`, $3+4<9$. |
| **Settled cloud** | Vertices whose shortest distances are final. | Order from `A`: `A,B,D,C`. |
| **Heap versus unsorted queue** | Trade faster minimum selection against simpler key changes. | Book's heap: $O((n+m)\log n)$; unsorted: $O(n^2)$. |
| **Shortest-path tree** | Store one parent edge for each reachable non-source vertex. | `AB`, `AD`, `BC` give routes from `A`. |
| **Parent-edge equality** | A parent must satisfy $d(s,u)+w(u,v)=d(s,v)$. | Both `B` and `D` can parent `C` at 7 cm. |

[🔝 Back to Top](#top)
