<span id="top"></span>

# 14.2 Data Structures for Graphs — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.2, printed pages 627–637 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** 14.2 Data Structures for Graphs; 14.2.1 Edge List Structure; 14.2.2 Adjacency List Structure; 14.2.3 Adjacency Map Structure; 14.2.4 Adjacency Matrix Structure; 14.2.5 Python Implementation.<br>
> **Domain Focus:** Store the same four-corner rectangular park in four ways; use walkway lengths, adjacency, and degree to see what each representation makes easy.<br>
> **User Prompt:** Reexplain Section 14.2 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Park, Several Storage Choices](#background)
   - [1. Recall the park graph](#background-park)
   - [2. Turn geometry questions into graph operations](#background-questions)
2. [Part 1: 14.2 Four Ways to Store the Same Graph](#part-1)
   - [1. What changes between representations?](#part-1-choices)
   - [2. What do the running-time symbols mean?](#part-1-symbols)
3. [Part 2: 14.2.1 Edge List Structure](#part-2)
   - [1. Put every vertex and edge in a global list](#part-2-storage)
   - [2. Why some operations scan every edge](#part-2-costs)
4. [Part 3: 14.2.2 Adjacency List Structure](#part-3)
   - [1. Give every corner an incidence list](#part-3-storage)
   - [2. Count references and find edges](#part-3-costs)
5. [Part 4: 14.2.3 Adjacency Map Structure](#part-4)
   - [1. Use a neighboring vertex as a key](#part-4-storage)
   - [2. Understand expected lookup time](#part-4-costs)
6. [Part 5: 14.2.4 Adjacency Matrix Structure](#part-5)
   - [1. Make a cell for every pair of corners](#part-5-grid)
   - [2. Compare fast lookup with space and updates](#part-5-costs)
7. [Part 6: 14.2.5 Python Implementation](#part-6)
   - [1. Vertex and Edge objects](#part-6-objects)
   - [2. Outgoing and incoming dictionaries](#part-6-dictionaries)
   - [3. Follow the methods on our park](#part-6-methods)
   - [4. A small executable storage sketch](#part-6-sketch)
   - [5. Read the printed code's boundaries carefully](#part-6-boundaries)
8. [Part 7: Compare the Operations](#part-7)
   - [1. Read the section's performance table](#part-7-table)
   - [2. Match a representation to a question](#part-7-choice)
9. [Part 8: Simple Geometry Study Cases](#part-8)
10. [Part 9: Summary](#part-9)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Park, Several Storage Choices

<span id="background-park"></span>

### 1. Recall the park graph

We continue the [Section 14.1 park example](14-01-graphs.md). Its corners are `A=(0,0)`, `B=(3,0)`, `C=(3,4)`, and `D=(0,4)`, with coordinates measured in centimetres. The five **two-way** walkways are:

| Edge object | Endpoints | Stored length | Geometry |
| :---------- | :-------- | ------------: | :------- |
| `e_AB` | `A`, `B` | 3 cm | Bottom side |
| `e_BC` | `B`, `C` | 4 cm | Right side |
| `e_CD` | `C`, `D` | 3 cm | Top side |
| `e_DA` | `D`, `A` | 4 cm | Left side |
| `e_AC` | `A`, `C` | 5 cm | Diagonal, because $3^2+4^2=5^2$ |

The names `e_AB` and so on identify **five Edge objects**. Each stores its endpoints and a length as its element. The graph has $n=4$ vertices and $m=5$ edges. Degrees are $\deg(A)=3$, $\deg(B)=2$, $\deg(C)=3$, and $\deg(D)=2$.

There is no `BD` edge. The straight-line distance from `B` to `D` is also 5 cm, but the park has no direct walkway between them. Every representation below must answer the same question: `get_edge(B, D)` returns `None`.

<span id="background-questions"></span>

### 2. Turn geometry questions into graph operations

Suppose we want to answer these questions repeatedly:

| Geometry question | Graph operation | Correct park answer |
| :---------------- | :-------------- | :------------------ |
| Is there a direct `A`–`C` walkway? | `get_edge(A, C)` | The edge object `e_AC`. |
| Is there a direct `B`–`D` walkway? | `get_edge(B, D)` | `None`. |
| How many walkways touch `A`? | `degree(A)` | `3`. |
| Which walkways touch `A`? | `incident_edges(A)` | `e_AB`, `e_DA`, `e_AC`. |
| What if corner `B` is removed? | `remove_vertex(B)` | Remove `B` and its two incident edges. |

All four representations preserve this **same graph**. They differ in where they put references to its five Edge objects, and therefore in the work needed to answer each question.

> **Mental model:** Choose a representation by asking which operation must be fast: scan all edges, list one corner's edges, look up one pair, or change the number of corners.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 14.2 Four Ways to Store the Same Graph

<span id="part-1-choices"></span>

### 1. What changes between representations?

Every structure stores the vertices. The difference is how it finds an edge:

| Representation | Where an edge is found | Park picture in memory |
| :------------- | :--------------------- | :--------------------- |
| **Edge list** | In one global list of all edges. | Search `e_AB`, `e_BC`, `e_CD`, `e_DA`, `e_AC`. |
| **Adjacency list** | In a list attached to each endpoint. | `A`'s list contains its three incident edges. |
| **Adjacency map** | In a map at each vertex, keyed by its neighbor. | At `A`, key `C` leads to `e_AC`. |
| **Adjacency matrix** | In a cell indexed by two vertices. | Row `A`, column `C` holds `e_AC`. |

The list and map structures may hold **two references** to one undirected edge, one at each endpoint. That does not create two walkways or two Edge objects. The matrix also uses two symmetric cells for an undirected edge.

<span id="part-1-symbols"></span>

### 2. What do the running-time symbols mean?

The section compares work as the graph grows. Let $n$ be the number of vertices, $m$ the number of edges, and $d_v$ the number of edges incident to vertex $v$. In our park, $n=4$, $m=5$, and $d_A=3$.

- $O(m)$ means a task may inspect the whole edge collection. For `get_edge(B, D)` in an edge list, all five edges must be ruled out.
- $O(d_v)$ means a task visits just the edges at $v$. Reporting `A`'s three walkways takes three reports, no matter how many other corners the park has.
- $O(n)$ means a task may inspect every vertex or every position in a matrix row.
- $O(n^2)$ means work or storage grows like the number of cells in an $n\times n$ grid.
- **Expected $O(1)$** describes a hash-map lookup under normal hashing assumptions. **Worst-case $O(1)$** for a matrix cell is a stronger guarantee.

Big-O describes how costs scale; it does not claim that a five-edge scan is slow in this tiny example.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 14.2.1 Edge List Structure

<span id="part-2-storage"></span>

### 1. Put every vertex and edge in a global list

The **edge list structure** keeps one unordered vertex list $V$ and one unordered edge list $E$:

```text
V: A, B, C, D
E: e_AB, e_BC, e_CD, e_DA, e_AC
```

Each Edge object refers to its two endpoint Vertex objects. In this structure, a Vertex object has **no direct list of its incident edges**. The book's version uses doubly linked positional lists. A Vertex stores its element and its position in $V$; an Edge stores its element, endpoints, and position in $E$. The stored positions make removal from the global lists quick once we know which object to remove.

<span id="part-2-costs"></span>

### 2. Why some operations scan every edge

To find `e_AC`, search $E$ until an edge has endpoints `A` and `C`. To prove `BD` is absent, inspect all five entries. To compute $\deg(A)$ or report `A`'s incident edges, inspect all five and keep the three touching `A`. On a large graph these operations take $O(m)$ time.

Adding one vertex or edge and removing a *known* Edge object each take $O(1)$ time in the book's positional-list design. The Edge stores its position in $E$, so `remove_edge(e_AC)` can remove that entry directly. Removing a vertex is different: `remove_vertex(B)` must first find `e_AB` and `e_BC` by scanning $E$, so it takes $O(m)$ time.

The lists and five small objects occupy $O(n+m)$ space. The edge list is simple to build and good at reporting **all** edges, but questions about **one vertex or pair** require a scan.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 14.2.2 Adjacency List Structure

<span id="part-3-storage"></span>

### 1. Give every corner an incidence list

An **adjacency list structure** gives each vertex $v$ a list $I(v)$ of **incident Edge references**. For the undirected park:

| Vertex | Its incidence list $I(v)$ | Length |
| :----- | :------------------------ | -----: |
| `A` | `e_AB`, `e_DA`, `e_AC` | 3 |
| `B` | `e_AB`, `e_BC` | 2 |
| `C` | `e_BC`, `e_CD`, `e_AC` | 3 |
| `D` | `e_CD`, `e_DA` | 2 |

This is a list of **edges**, not just neighboring corner names. For example, both $I(A)$ and $I(C)$ refer to the **same** `e_AC` object. The total number of incidence entries is $3+2+3+2=10=2m$; the five Edge objects have not been copied.

The primary vertex collection must give access to $I(v)$ in $O(1)$ time. The book suggests a positional vertex list with each Vertex holding a reference to its own list, or an indexed array when vertices are numbered. For directed graphs, use separate lists $I_{\mathrm{out}}(v)$ and $I_{\mathrm{in}}(v)$.

<span id="part-3-costs"></span>

### 2. Count references and find edges

Now `incident_edges(A)` reads only $I(A)$ and reports three entries: $O(d_A)$. This is as good as possible when three results must be reported. If a linked incidence list stores its size, `degree(A)` is $O(1)$.

For `get_edge(B, D)`, inspect the smaller of $I(B)$ and $I(D)$, each of length 2 here. In general the work is $O(\min(d_u,d_v))$. For a directed graph, the comparable choices are the outgoing list at $u$ and incoming list at $v$.

An undirected edge appears in **both** endpoint lists. To make `remove_edge(e_AC)` $O(1)$, the Edge object must remember its position in *both* lists; a bare Python list without such positions would not give the stated deletion bound. Then `remove_vertex(B)` can find and remove its two incident edges in $O(d_B)$ time.

The incidence lists use $2m$ references in an undirected graph, which is still $O(n+m)$ space. To report all edges in $O(m)$ without duplicates, the book's comparison assumes an auxiliary global edge list $E$. Without it, visiting all $n$ incidence lists takes $O(n+m)$ time and must avoid reporting each undirected edge twice.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 14.2.3 Adjacency Map Structure

<span id="part-4-storage"></span>

### 1. Use a neighboring vertex as a key

An **adjacency map** keeps the incidence idea but makes each $I(v)$ a hash-based map. A **neighboring vertex is the key** and the shared Edge object is the value:

| Vertex | Neighbor $\rightarrow$ Edge entries |
| :----- | :---------------------------------- |
| `A` | `B: e_AB`, `C: e_AC`, `D: e_DA` |
| `B` | `A: e_AB`, `C: e_BC` |
| `C` | `A: e_AC`, `B: e_BC`, `D: e_CD` |
| `D` | `A: e_DA`, `C: e_CD` |

At `A`, looking up key `C` returns `e_AC`. At `B`, there is no key `D`, so `get_edge(B, D)` returns `None`. The reverse `C`-to-`A` entry points to the **same** `e_AC` object, not a new edge.

<span id="part-4-costs"></span>

### 2. Understand expected lookup time

Hash lookup makes `get_edge(u, v)` **expected $O(1)$** instead of searching up to $\min(d_u,d_v)$ list entries. The book also notes that searching the smaller incidence map retains a worst-case $O(\min(d_u,d_v))$ fallback. The maps still use $O(n+m)$ space, because their total number of entries is proportional to the number of incidences. Iterating $I(A)$ still reports three incident edges in $O(d_A)$ time, and a map's stored size gives `degree(A)` in $O(1)$.

The book describes adjacency maps as a strong general-purpose choice: most graph operations have very good bounds without allocating a full $n\times n$ grid. Hash-map time is an **expectation**, so it should not be confused with the matrix's worst-case constant-time cell access.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 14.2.4 Adjacency Matrix Structure

<span id="part-5-grid"></span>

### 1. Make a cell for every pair of corners

An **adjacency matrix** assigns indices $0,1,2,3$ to `A`, `B`, `C`, `D`. Cell $M[i,j]$ contains an Edge reference if that pair has an edge; otherwise it contains `None`. For our undirected park:

| $M$ | `A` (0) | `B` (1) | `C` (2) | `D` (3) |
| :-- | :------ | :------ | :------ | :------ |
| **`A` (0)** | `None` | `e_AB` | `e_AC` | `e_DA` |
| **`B` (1)** | `e_AB` | `None` | `e_BC` | `None` |
| **`C` (2)** | `e_AC` | `e_BC` | `None` | `e_CD` |
| **`D` (3)** | `e_DA` | `None` | `e_CD` | `None` |

The matrix is **symmetric**: $M[A,C]$ and $M[C,A]$ reference the same `e_AC`. The main diagonal cells $M[A,A]$, $M[B,B]$, and so on are `None` because there are no self-loops. That *matrix diagonal* is different from the **geometric** diagonal walkway `AC`, which appears in the off-diagonal cells $M[A,C]$ and $M[C,A]$. In a directed version with `A→C` but no `C→A`, $M[A,C]$ holds `e_AC` while $M[C,A]$ is `None`.

The cells hold **Edge objects or `None`**, not numeric lengths. To obtain 5 cm, first retrieve `e_AC` from $M[A,C]$, then read its stored element.

<span id="part-5-costs"></span>

### 2. Compare fast lookup with space and updates

`get_edge(B, D)` inspects just cell $M[1,3]$ and finds `None` in **worst-case $O(1)$** time. But `incident_edges(A)` and `degree(A)` scan all $n$ cells of `A`'s row: $O(n)$ time, even though only three edges touch `A`. In a directed matrix, a row shows outgoing edges and a column shows incoming edges.

The $n\times n$ grid uses $O(n^2)$ space. Our four-corner matrix has $4^2=16$ cells regardless of whether it holds five edges or no edges. Adding a new corner requires expanding the grid; inserting or removing a vertex is $O(n^2)$ in the section's comparison. The book treats the matrix as an addition to the edge-list structure and assumes an auxiliary edge list so `edges()` can still report its $m$ edges in $O(m)$ time.

A dense graph can make the matrix's space reasonable relative to its many edges. A sparse graph leaves many cells empty. If a graph needs only yes/no connections and no Edge data, the book notes that a Boolean matrix can use a bit for each possible edge slot. Our park stores lengths, so its Edge references carry more information than a Boolean value.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 14.2.5 Python Implementation

The book implements a **variant of the adjacency map** with Python dictionaries. It supports a graph chosen as directed or undirected at construction; undirected is the default.

<span id="part-6-objects"></span>

### 1. Vertex and Edge objects

The nested `Vertex` class stores an element, such as `("A", (0, 0))`. The nested `Edge` class stores origin, destination, and an element such as the length `5`. Their `__slots__` declarations name these small sets of stored fields. An Edge's `endpoints()` and `opposite(v)` methods use its endpoint references. Both classes define `__hash__` so their instances can be used in dictionaries or sets. A Vertex is hashed by its identity in the printed code.

The graph stores **one Edge object per walkway**. For an undirected `AC`, two dictionary entries will refer to that same object.

<span id="part-6-dictionaries"></span>

### 2. Outgoing and incoming dictionaries

The top-level `_outgoing` dictionary maps each Vertex object to a second dictionary of **neighbor $\rightarrow$ Edge** entries. For a directed graph, a separate top-level `_incoming` dictionary records incoming edges. For an undirected graph, `_incoming` and `_outgoing` are **aliases of the same dictionary object**.

The book's `is_directed()` checks whether those top-level dictionaries are different objects. When `insert_edge(A, C, 5)` creates `e_AC`, it writes:

```text
_outgoing[A][C] = e_AC
_incoming[C][A] = e_AC
```

In the undirected case, the aliases make these the `A→C` and `C→A` entries of one shared top-level dictionary. In the directed case, the first is outgoing from `A` and the second is incoming to `C`; there is **no** outgoing `C→A` edge unless one is inserted separately.

The [Section 14.1 guide](14-01-graphs.md) uses the directed variant `A→B`, `B→C`, `C→D`, `D→A`, `A→C`. Its outgoing neighbors at `A` are `B` and `C`, while its incoming neighbor is only `D`. Thus `degree(A)` is 2 outgoing and `degree(A, outgoing=False)` is 1 incoming in the printed Python implementation. The Graph ADT in Section 14.1 calls this option `out`; the code fragment names it `outgoing`.

<span id="part-6-methods"></span>

### 3. Follow the methods on our park

| Printed Graph method | Dictionary idea | Undirected park result |
| :------------------- | :-------------- | :--------------------- |
| `vertex_count()` | Count top-level keys. | `4`. |
| `vertices()` | Iterate the top-level keys. | `A`, `B`, `C`, `D`. |
| `edge_count()` | Sum neighbor-map sizes; halve for undirected edges. | $(3+2+3+2)/2=5$. |
| `edges()` | Put all neighbor-map Edge values in a set to remove repeats. | Five unique Edge objects. |
| `get_edge(u,v)` | Look up key `v` inside `_outgoing[u]`. | `get_edge(B,D)` is `None`. |
| `degree(v, outgoing=True)` | Take the size of the selected neighbor map. | `degree(A)` is `3`. |
| `incident_edges(v, outgoing=True)` | Yield values from the selected neighbor map. | Three edges at `A`. |
| `insert_vertex(x)` | Add an empty neighbor map for a new Vertex. | A new `E` starts with degree 0. |
| `insert_edge(u,v,x)` | Put one Edge in the appropriate outgoing and incoming maps. | Add `CE` with length 3 cm. |

For a directed graph, the sum of outgoing-map sizes already equals $m$, so `edge_count()` does not halve it. The `edges()` set is needed for the undirected case because each edge is encountered at both endpoints.

<span id="part-6-sketch"></span>

### 4. A small executable storage sketch

This short Python program uses corner labels to make the dictionary structure visible. The book's complete implementation uses Vertex and Edge objects as its keys and values.

```python
from dataclasses import dataclass

@dataclass(eq=False)
class Walkway:
    u: str
    v: str
    cm: int

corners = {
    "A": (0, 0), "B": (3, 0),
    "C": (3, 4), "D": (0, 4),
}
walkways = [
    Walkway("A", "B", 3), Walkway("B", "C", 4),
    Walkway("C", "D", 3), Walkway("D", "A", 4),
    Walkway("A", "C", 5),
]

outgoing = {corner: {} for corner in corners}
incoming = outgoing                 # alias for an undirected graph
for edge in walkways:
    outgoing[edge.u][edge.v] = edge
    incoming[edge.v][edge.u] = edge

print(outgoing["A"]["C"].cm)          # 5
print(outgoing["B"].get("D"))          # None
print(len(outgoing["A"]))             # 3
print(sum(map(len, outgoing.values())) // 2)  # 5
print(len({edge for neighbors in outgoing.values()
           for edge in neighbors.values()}))  # 5
```

`eq=False` keeps each `Walkway` hashable by identity, so the set counts the five Edge-like objects once each. The two `AC` dictionary entries point to the **same** `Walkway` instance. This sketch illustrates the storage and calculations; it does not define the book's full Graph ADT.

<span id="part-6-boundaries"></span>

### 5. Read the printed code's boundaries carefully

The comparison in Table 14.1 assumes supporting structures such as a separate edge collection or stored counts. The concrete Python version **does not keep a separate edge list**:

| Operation | Comparison table | Printed dictionary code | Why |
| :-------- | :--------------- | :---------------------- | :-- |
| `edge_count()` | $O(1)$ | Expected $O(n)$ | It visits all $n$ vertices and sums each neighbor-map size. |
| `edges()` | $O(m)$ | Expected $O(n+m)$ | It visits all $n$ maps and inserts their Edge values into a set. |

The expected bounds use the usual assumption that dictionary access takes expected constant time. The printed fragments also leave `remove_vertex` and `remove_edge` for exercises and omit parameter checks. One small inconsistency is visible at the end of Code Fragment 14.3: the `insert_edge` docstring promises to return the new Edge, but the printed method ends after storing it in the maps, with **no `return e` line**. If you turn that fragment into runnable code and need the ADT's promised return value, add `return e`.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Compare the Operations

<span id="part-7-table"></span>

### 1. Read the section's performance table

The following restates the **representation-level** bounds from the section's Table 14.1. Let $d_u$ and $d_v$ be the endpoint degrees. “Expected” marks operations relying on hash maps.

| Operation | Edge list | Adjacency list | Adjacency map | Matrix |
| :-------- | :-------- | :------------- | :------------ | :----- |
| `vertex_count()`, `edge_count()` | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ |
| Iterate `vertices()` | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| Iterate `edges()` | $O(m)$ | $O(m)$ | $O(m)$ | $O(m)$ |
| `get_edge(u,v)` | $O(m)$ | $O(\min(d_u,d_v))$ | Expected $O(1)$ | Worst-case $O(1)$ |
| `degree(v)` | $O(m)$ | $O(1)$ | $O(1)$ | $O(n)$ |
| `incident_edges(v)` | $O(m)$ | $O(d_v)$ | $O(d_v)$ | $O(n)$ |
| `insert_vertex(x)` | $O(1)$ | $O(1)$ | $O(1)$ | $O(n^2)$ |
| `remove_vertex(v)` | $O(m)$ | $O(d_v)$ | $O(d_v)$ | $O(n^2)$ |
| `insert_edge(u,v,x)` | $O(1)$ | $O(1)$ | Expected $O(1)$ | $O(1)$ |
| `remove_edge(e)` | $O(1)$ | $O(1)$ | Expected $O(1)$ | $O(1)$ |
| **Space** | $O(n+m)$ | $O(n+m)$ | $O(n+m)$ | $O(n^2)$ |

The $O(m)$ `edges()` row for adjacency lists, maps, and matrices assumes the auxiliary edge collection described in the section. The printed Python implementation takes a different route, as shown in Part 6. Constant-time edge removal from linked lists also relies on stored positions; these are not general promises for ordinary Python lists.

<span id="part-7-choice"></span>

### 2. Match a representation to a question

| Frequent task | Structure that makes it direct | Reason |
| :------------ | :----------------------------- | :----- |
| Visit all five park walkways. | Edge list, or any version with an auxiliary $E$. | The edge objects are already gathered. |
| List walkways meeting `A`. | Adjacency list or map. | Only `A`'s three incidences are visited. |
| Ask whether `BD` exists. | Adjacency map or matrix. | One neighbor lookup or one cell access. |
| Add or remove corners often. | Edge list, adjacency list, or map. | The matrix must resize its $n\times n$ grid. |
| Require worst-case constant-time pair lookup in a dense graph. | Adjacency matrix. | A fixed cell gives the answer. |

This is a comparison of the book's specified structures. Actual performance also depends on details such as hash behavior, stored counts, and the cost of moving data when a matrix grows.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Is there a direct B–D walkway?</strong></summary>

**Scenario:** `B=(3,0)` and `D=(0,4)` are 5 cm apart in a straight line, but `BD` is absent from the five-edge park graph.

**Check:** The edge list inspects up to all five Edge objects. The adjacency list checks the smaller of the two degree-2 incidence lists. The adjacency map checks whether `D` is a key in `B`'s map. The matrix reads $M[B,D]$.

**Result:** All four return `None`. The map has expected $O(1)$ lookup and the matrix has worst-case $O(1)$ cell access. Storage changes the cost of the answer, not the answer itself.

</details>

<details>
<summary><strong>Case Study 2: Why does diagonal AC appear twice?</strong></summary>

**Scenario:** `e_AC` has endpoints `A` and `C` and stores length 5 cm.

**Check:** It appears once in `A`'s incidence list and once in `C`'s list. Likewise, `A`'s map has key `C` and `C`'s map has key `A`, each pointing to the same object. In the matrix, $M[A,C]$ and $M[C,A]$ point to it.

**Result:** Five undirected edges create ten incidence references, matching $3+2+3+2=2m=10$. The two references are needed for lookup from either endpoint; `edge_count()` must avoid counting them as ten different edges.

</details>

<details>
<summary><strong>Case Study 3: What work is needed to remove corner B?</strong></summary>

**Scenario:** `B` has degree 2. Removing it also removes `e_AB` and `e_BC`.

**Check:** An edge list scans its five edges to discover those two. An adjacency list or map starts with `B`'s two incident entries and removes the corresponding references. A matrix must rebuild or resize its grid after dropping the row and column for `B`.

**Result:** The remaining graph has `A`, `C`, `D` and edges `e_AC`, `e_CD`, `e_DA`: $n=3$, $m=3$. The book's idealized costs are $O(m)$, $O(d_B)$, $O(d_B)$, and $O(n^2)$ respectively. Its printed Python fragment leaves the removal method for an exercise.

</details>

<details>
<summary><strong>Case Study 4: Why does a long trail waste matrix cells?</strong></summary>

**Scenario:** Keep only `AB`, `BC`, and `CD` from the park, leaving out `DA` and `AC`. Extend this `A–B–C–D` path from `D=(0,4)` through six new markers `E=(0,5)`, `F=(0,6)`, `G=(0,7)`, `H=(0,8)`, `I=(0,9)`, and `J=(0,10)`. Connect consecutive markers only.

**Check:** This is one connected path with $n=10$ vertices and $m=9$ edges. The matrix allocates $10^2=100$ cells. Undirected incidence lists or maps hold $2m=18$ Edge references plus the vertex records, so their space grows with $n+m$.

**Result:** When the route has far fewer edges than possible vertex pairs, list and map structures avoid many empty matrix slots. The matrix still offers worst-case $O(1)$ lookup of any specific pair.

</details>

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Section 14.2 idea | Plain-language meaning | Rectangle-park example |
| :---------------- | :--------------------- | :--------------------- |
| **One graph, four representations** | Store the same vertices and edges in different layouts. | Four corners and five walkways keep the same answers. |
| **Edge list** | Gather every edge in one place. | Searching for absent `BD` may scan all five edges. |
| **Adjacency list** | Store incident Edge references at each vertex. | `A`'s list has three entries; all four lists have ten. |
| **Adjacency map** | Key each incidence collection by the neighboring vertex. | Key `C` at `A` gives `e_AC` in expected $O(1)$. |
| **Adjacency matrix** | Reserve a cell for every ordered pair of vertices. | $M[A,C]=e_{AC}$; $M[B,D]=\text{None}$. |
| **Sparse versus dense** | Compare $m$ with the possible $n^2$ cell positions. | A ten-marker trail has nine edges but needs 100 matrix cells. |
| **Directed dictionaries** | Keep outgoing and incoming neighbor maps separately. | `A→C` exists even when `C→A` does not. |
| **Shared undirected edge** | Two incidence entries can point to one Edge object. | `e_AC` appears at `A` and `C` but counts once. |
| **Implementation details matter** | A concrete class may have different costs from a comparison table. | The printed `edge_count()` scans four vertex maps. |

[🔝 Back to Top](#top)
