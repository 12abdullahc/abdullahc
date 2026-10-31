<span id="top"></span>

# 14.4 Transitive Closure — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.4, printed pages 651–654 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** 14.4 Transitive Closure; Floyd–Warshall rounds and correctness; performance; Python implementation.<br>
> **Domain Focus:** Reachability among the four corners of the same rectangular park used in Sections 14.1–14.3, with one-way walkways and simple route lengths.<br>
> **User Prompt:** Reexplain Section 14.4 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Park Route Question](#background)
   - [1. Recall the rectangular park](#background-park)
   - [2. Separate a direct arrow from a possible route](#background-route)
2. [Part 1: Why Compute Transitive Closure?](#part-1)
   - [1. One reachability question versus many](#part-1-queries)
   - [2. Define the closure and its matrix](#part-1-definition)
3. [Part 2: Floyd–Warshall Rounds](#part-2)
   - [1. Start with direct arrows](#part-2-start)
   - [2. Allow one more intermediate corner per round](#part-2-rule)
   - [3. Trace all four park rounds](#part-2-trace)
   - [4. Why the rule is correct](#part-2-proof)
4. [Part 3: Performance of the Floyd–Warshall Algorithm](#part-3)
   - [1. Count the work](#part-3-time)
   - [2. Compare with repeated graph traversals](#part-3-compare)
5. [Part 4: Python Implementation](#part-4)
   - [1. Relate the book's graph code to a Boolean matrix](#part-4-book)
   - [2. Run the park example](#part-4-program)
   - [3. Check the output](#part-4-output)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Park Route Question

<span id="background-park"></span>

### 1. Recall the rectangular park

We continue the [graph from Section 14.1](14-01-graphs.md), its [adjacency structures from Section 14.2](14-02-data-structures-for-graphs.md), and the [traversals from Section 14.3](14-03-graph-traversals.md). The park corners lie at:

| Corner | Coordinate |
| :----- | :--------- |
| `A` | $(0,0)$ |
| `B` | $(3,0)$ |
| `C` | $(3,4)$ |
| `D` | $(0,4)$ |

Its five physical walkways are the four sides and diagonal `AC`. The geometric lengths are `AB` = 3 cm, `BC` = 4 cm, `CD` = 3 cm, `DA` = 4 cm, and `AC` = $\sqrt{3^2+4^2}=5$ cm. There is **no** `BD` walkway, although the straight-line distance from `B` to `D` is also 5 cm.

For the main example, make these walkways **one-way**, as in Section 14.3:

```text
A: B, C
B: C
C: D
D: A
```

Each line lists the destinations of outgoing arrows. The arrows are `A→B`, `A→C`, `B→C`, `C→D`, and `D→A`; the coordinates and lengths above define the geometry. All four corners can reach one another by following arrows around the cycle.

<span id="background-route"></span>

### 2. Separate a direct arrow from a possible route

There is no direct `B→D` arrow, but `B→C→D` is a permitted directed route measuring $4+3=7$ cm. Similarly, there is no direct `D→B` arrow, but `D→A→B` measures $4+3=7$ cm. Thus an adjacency lookup and a reachability question ask different things:

| Question | Answer in the original one-way park |
| :------- | :----------------------------------- |
| Is `B→D` an actual walkway? | No. |
| Can a visitor travel from `B` to `D`? | Yes, through `C`. |
| Does a 5 cm straight line from `B` to `D` permit travel? | No; travel must follow existing directed walkways. |

> **Mental model:** A transitive closure is a precomputed **yes/no route map**. Its extra arrows say that a route exists; they are not new physical walkways and do not store route lengths.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Why Compute Transitive Closure?

<span id="part-1-queries"></span>

### 1. One reachability question versus many

To answer just one question such as “Can `B` reach `D`?”, run [DFS or BFS](14-03-graph-traversals.md) from `B`. With a suitable adjacency list or map, this costs $O(n+m)$ time for a graph with $n$ vertices and $m$ edges. The search finds `D` through `C`.

If we expect to ask about **many** ordered pairs of corners, we can precompute every answer. One straightforward method runs a traversal from each of the $n$ start vertices. Its total time is $O(n(n+m))$. After storing the results in a Boolean matrix, each later question about a particular ordered pair needs one cell lookup.

<span id="part-1-definition"></span>

### 2. Define the closure and its matrix

The **transitive closure** $\overline{G}$ has the same vertices as the original directed graph $G$. For two **distinct** vertices $u$ and $v$, $\overline{G}$ has an arrow $u\to v$ exactly when $G$ has a directed path from $u$ to $v$. Every original arrow remains, and reachability may add more arrows.

For example, original `B→C` and `C→D` establish a route `B→C→D`. The closure therefore has a **virtual** `B→D` arrow. This is a Boolean fact about reachability; it is not a new diagonal walkway and says nothing about the shortest route in centimetres.

We can record these answers in a matrix $R$, with $R[u,v]=1$ if $u$ can reach $v$ and $0$ otherwise. The book's Code Fragment 14.10 skips pairs with $u=v$, so the matrices below use **0 on the diagonal** and discuss distinct corners. Some definitions count a zero-edge route from a corner to itself and put 1 on every diagonal cell. That different convention does not change any distinct-corner result here; the book's implementation does not insert self-loop edges even when a directed cycle exists.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Floyd–Warshall Rounds

<span id="part-2-start"></span>

### 1. Start with direct arrows

The book numbers vertices in any fixed order. We choose $v_1=A$, $v_2=B$, $v_3=C$, and $v_4=D$. Let $G_0=G$: at first, only the five physical one-way walkways count as arrows. With rows as origins and columns as destinations, its adjacency matrix is:

| $G_0$ | `A` | `B` | `C` | `D` |
| :---- | --: | --: | --: | --: |
| **`A`** | 0 | 1 | 1 | 0 |
| **`B`** | 0 | 0 | 1 | 0 |
| **`C`** | 0 | 0 | 0 | 1 |
| **`D`** | 1 | 0 | 0 | 0 |

A row says where a visitor can go **in one step**. For example, row `B` has a 1 under `C` and a 0 under `D`. The final closure matrix will answer whether `B` can reach `D` in **any number of steps**.

<span id="part-2-rule"></span>

### 2. Allow one more intermediate corner per round

In round $k$, allow $v_k$ as one more possible **intermediate** corner. Begin with all arrows already known in $G_{k-1}$. If $G_{k-1}$ already says $v_i\to v_k$ and $v_k\to v_j$, add $v_i\to v_j$ to obtain $G_k$. For distinct endpoints, the Boolean form is:

$$
R^{(k)}[i,j]
=R^{(k-1)}[i,j]\ \lor\
\bigl(R^{(k-1)}[i,k]\ \land\ R^{(k-1)}[k,j]\bigr).
$$

Here $\lor$ means **or** and $\land$ means **and**. For example, if `D→A` and `A→B` are both known, round `A` can add `D→B`. No centimetre values are added by this rule: it answers **whether** a route exists.

**Proposition 14.18** gives the meaning of each round: after round $k$, $G_k$ contains $v_i\to v_j$ exactly when the original graph has a path from $v_i$ to $v_j$ whose intermediate vertices belong to $\{v_1,\ldots,v_k\}$, for the distinct endpoints shown here. After all $n$ corners are allowed, $G_n$ is the closure.

<span id="part-2-trace"></span>

### 3. Trace all four park rounds

The fixed order `A, B, C, D` makes the additions reproducible:

| Round | Newly allowed intermediate | New closure arrows | A route that explains each new arrow |
| :---- | :------------------------- | :----------------- | :------------------------------------ |
| $G_1$ | `A` | `D→B`, `D→C` | `D→A→B`; `D→A→C` |
| $G_2$ | `B` | None | Every route through `B` that can be formed is already recorded. |
| $G_3$ | `C` | `A→D`, `B→D` | `A→C→D`; `B→C→D` |
| $G_4$ | `D` | `B→A`, `C→A`, `C→B` | `B→C→D→A`; `C→D→A`; `C→D→A→B` |

The route for `B→A` needs both `C` and `D` as intermediate corners, so this arrow first appears in the **`D` round**. The initial five arrows plus seven new ones give all $4(4-1)=12$ ordered pairs of **different** corners.

The final matrix is:

| $G_4=\overline{G}$ | `A` | `B` | `C` | `D` |
| :---------------- | --: | --: | --: | --: |
| **`A`** | 0 | 1 | 1 | 1 |
| **`B`** | 1 | 0 | 1 | 1 |
| **`C`** | 1 | 1 | 0 | 1 |
| **`D`** | 1 | 1 | 1 | 0 |

Every off-diagonal cell is 1: each corner can reach every other corner. In the language of Section 14.3, this directed park is **strongly connected**.

<span id="part-2-proof"></span>

### 4. Why the rule is correct

The round meaning in Proposition 14.18 can be understood one step at a time:

1. **Before any rounds:** $G_0$ contains direct arrows. A direct arrow has no intermediate vertex, so the rule holds for $k=0$.
2. **If a path avoids $v_k$:** Its intermediate vertices were already allowed in round $k-1$, so its answer is already in $G_{k-1}$ and remains in $G_k$.
3. **If a path uses $v_k$:** Split a simple path at $v_k$. Its first part runs from $v_i$ to $v_k$; its second runs from $v_k$ to $v_j$. Their other intermediate vertices were allowed earlier, so both parts are represented in $G_{k-1}$. The rule adds $v_i\to v_j$.
4. **If the rule adds an arrow:** The two recorded parts can be joined through $v_k$, proving that a directed route really exists in the original graph.

Therefore each round records exactly the routes whose intermediate corners are now allowed. Allowing every corner yields every distinct-corner reachability answer. This is the Boolean reachability form of the **Floyd–Warshall algorithm** in Code Fragment 14.9, not a computation of route lengths.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Performance of the Floyd–Warshall Algorithm

<span id="part-3-time"></span>

### 1. Count the work

There are $n$ rounds, one per possible intermediate vertex. Each round considers up to $n^2$ ordered endpoint pairs. If the graph representation can check and insert an adjacency entry in $O(1)$ time, **Proposition 14.19** gives total time $O(n\cdot n^2)=O(n^3)$. An adjacency matrix provides constant-time access to a cell.

A Boolean reachability matrix has $n^2$ cells, so its storage is $O(n^2)$; if only yes/no answers matter, a cell can be a single bit. Once the matrix is ready, answering “Can $u$ reach $v$?” for two distinct indexed vertices is an $O(1)$ cell lookup. The precomputation pays off when many such questions will follow.

<span id="part-3-compare"></span>

### 2. Compare with repeated graph traversals

| Method | Precomputation with suitable storage | Useful situation |
| :----- | :----------------------------------- | :--------------- |
| One DFS or BFS from a chosen source | $O(n+m)$ for that search | Only a few reachability questions. |
| DFS or BFS from **each** vertex | $O(n(n+m))=O(n^2+nm)$ with adjacency lists or maps | Many queries on a sparse graph. |
| Floyd–Warshall | $O(n^3)$ with constant-time adjacency lookup and update | A dense graph or an adjacency matrix. |

For a sparse graph with $m=O(n)$, repeated traversal has $O(n^2)$ time, while Floyd–Warshall remains $O(n^3)$. For a dense graph with $m=\Theta(n^2)$, both bounds become $O(n^3)$. Even when the original graph is sparse, scanning a whole adjacency-matrix row during DFS can cost $O(n)$ per vertex; the book therefore notes that Floyd–Warshall matches repeated traversal asymptotically when the input is already a matrix.

The book notes that Floyd–Warshall is compact to implement and can have favorable practical constants. These time bounds describe **growth**, not a count of exact operations for our four-corner park.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Python Implementation

<span id="part-4-book"></span>

### 1. Relate the book's graph code to a Boolean matrix

Code Fragment 14.10 first makes a **deep copy** of the original graph, fixes a list of its vertices, and updates the copy during the rounds. It checks whether $v_i\to v_k$ exists **before** scanning candidate destinations $v_j$. It also skips $i=k$, $j=k$, and $i=j$, so it does not add self-pairs.

Although Code Fragment 14.9 describes separate graphs $G_{k-1}$ and $G_k$, the implementation can update one closure in place. During round $k$ it never inserts an arrow **into** or **out of** the pivot $v_k$. Thus the needed $i\to k$ column and $k\to j$ row do not change during that round, and the same round rule applies.

The program below uses a Boolean matrix instead of the book's `Graph` class so the reachability cells are easy to see. It copies the original matrix and leaves the original five arrows unchanged.

<span id="part-4-program"></span>

### 2. Run the park example

```python
vertices = "ABCD"
arrows = {
    ("A", "B"), ("A", "C"), ("B", "C"),
    ("C", "D"), ("D", "A"),
}

original = [[(u, v) in arrows for v in vertices] for u in vertices]
closure = [row.copy() for row in original]
added_by_round = {}

for k, via in enumerate(vertices):
    added = []
    for i, start in enumerate(vertices):
        if i == k or not closure[i][k]:
            continue
        for j, end in enumerate(vertices):
            if j == k or i == j or not closure[k][j]:
                continue
            if not closure[i][j]:
                closure[i][j] = True
                added.append(f"{start}->{end}")
    added_by_round[via] = added

for via, added in added_by_round.items():
    print(f"via {via}: {', '.join(added) if added else 'none'}")

print("closure rows in A, B, C, D order:")
for start, row in zip(vertices, closure):
    print(f"{start}: {''.join('1' if reachable else '0' for reachable in row)}")

print("original B->A:", original[1][0])
print("closure B->A:", closure[1][0])
```

<span id="part-4-output"></span>

### 3. Check the output

```text
via A: D->B, D->C
via B: none
via C: A->D, B->D
via D: B->A, C->A, C->B
closure rows in A, B, C, D order:
A: 0111
B: 1011
C: 1101
D: 1110
original B->A: False
closure B->A: True
```

The program reports the same seven additions as the round table. `B→A` is absent from the original graph but reachable through `B→C→D→A`. The closure matrix stores **True**, not that route or its $4+3+4=11$ cm length. If a route itself is needed, a traversal can record discovery edges as in Section 14.3.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Can B reach D without a BD walkway?</strong></summary>

**Scenario:** `B=(3,0)` and `D=(0,4)` are 5 cm apart in a straight line. The one-way park has no physical `BD` edge.

**Check:** `B→C→D` follows two allowed arrows and measures $4+3=7$ cm. When `C` is an allowed intermediate, the closure gains `B→D`.

**Result:** The new arrow answers **yes** to reachability. It does not shorten the real 7 cm route to 5 cm or create a new walkway.

</details>

<details>
<summary><strong>Case Study 2: Why does B→A appear only in the last round?</strong></summary>

**Scenario:** The original ring lets `B` reach `A` through `B→C→D→A`, a route measuring $4+3+4=11$ cm.

**Check:** This route needs both `C` and `D` as intermediate corners. Round `C` first adds `B→D`; round `D` can then combine `B→D` with original `D→A` to add `B→A`.

**Result:** The ordering of rounds controls **when** an answer appears, but after all four rounds every reachable pair is present.

</details>

<details>
<summary><strong>Case Study 3: What changes when the return arrow closes?</strong></summary>

**Scenario:** Close the 4 cm one-way walkway `D→A`. Keep `A→B`, `A→C`, `B→C`, and `C→D`.

**Check:** The closure now has those four direct arrows plus `A→D` and `B→D`, for **six** arrows between distinct corners. Row `D` is all zeros: a visitor at `D` cannot follow an arrow to another corner.

**Result:** The geometry still forms a connected drawing if arrow direction is ignored, but the directed graph is **not strongly connected**. A short geometric gap does not make a directed route.

</details>

<details>
<summary><strong>Case Study 4: What if every walkway works both ways?</strong></summary>

**Scenario:** Return to the original two-way park of Sections 14.1 and 14.2. Model each of its five walkways as **two** opposite arrows, so the directed version begins with 10 arrows.

**Check:** The only distinct-corner pair missing direct arrows is `B,D`. The closure adds `B→D` and `D→B`, reaching all 12 ordered pairs. Each direction can use a two-walkway route of 7 cm around the rectangle, even though the straight-line separation is 5 cm.

**Result:** In this connected two-way park, every distinct pair is reachable. The closure's two extra arrows still describe routes rather than physical `BD` walkways.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 14.4 idea | Plain-language meaning | Rectangle-park example |
| :---------------- | :--------------------- | :--------------------- |
| **Reachability** | Ask whether a directed route exists. | `B` reaches `D` through `C`, though `BD` is absent. |
| **Transitive closure** | Store the answer for every ordered pair of distinct vertices. | The one-way ring's closure has all 12 off-diagonal arrows. |
| **Virtual closure arrow** | A route exists in the original graph; no new physical edge is built. | `B→A` represents `B→C→D→A`. |
| **Round $k$** | Allow vertex $v_k$ as an intermediate point. | Round `A` adds `D→B` from `D→A→B`. |
| **Proposition 14.18** | After round $k$, all routes using only allowed intermediates are represented. | `B→A` waits until `D` is allowed. |
| **Floyd–Warshall time** | Check up to $n^2$ pairs in each of $n$ rounds. | $O(n^3)$ with constant-time matrix access. |
| **Repeated DFS alternative** | Search from each possible start vertex. | $O(n(n+m))$ with adjacency lists or maps. |
| **Boolean matrix** | One cell holds a yes/no reachability answer. | Final row `B` is `1011` for columns `A,B,C,D`. |
| **Self-pair convention** | The book's implementation skips self-loop edges. | Diagonal cells remain 0; other reachability answers are unaffected. |

[🔝 Back to Top](#top)
