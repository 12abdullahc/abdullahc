<span id="top"></span>

# 14.5 Directed Acyclic Graphs — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 14, Section 14.5, printed pages 655–658 ([supplied C14 PDF](<../Data Structures and Algorithms in Python - C14.pdf>)).<br>
> **Topic:** 14.5 Directed Acyclic Graphs; 14.5.1 Topological Ordering; topological sorting and its performance.<br>
> **Domain Focus:** Plan four corner-survey tasks on the 3 cm by 4 cm rectangular park from Sections 14.1–14.4.<br>
> **User Prompt:** Reexplain Section 14.5 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Survey the Park Corners](#background)
   - [1. Recall the rectangle and its walkways](#background-park)
   - [2. Turn the map into prerequisite tasks](#background-tasks)
2. [Part 1: 14.5 Directed Acyclic Graphs](#part-1)
   - [1. What a directed cycle would mean](#part-1-cycle)
   - [2. Use geometry to check this example is acyclic](#part-1-rank)
3. [Part 2: 14.5.1 Topological Ordering](#part-2)
   - [1. Put every arrow forward in the order](#part-2-definition)
   - [2. Why a topological order exists exactly for a DAG](#part-2-proof)
   - [3. An order is a schedule, not a walking route](#part-2-schedule)
4. [Part 3: Topological Sorting with In-Degrees](#part-3)
   - [1. Count unfinished prerequisites](#part-3-indegree)
   - [2. Trace the ready list](#part-3-trace)
   - [3. Recognize a cycle from an incomplete result](#part-3-cycle)
5. [Part 4: Performance of Topological Sorting](#part-4)
   - [1. Time and auxiliary space](#part-4-cost)
   - [2. The precise cycle guarantee](#part-4-clarification)
6. [Part 5: A Complete Park Scheduling Program](#part-5)
   - [1. Run the DAG and cycle examples](#part-5-program)
   - [2. Read the output](#part-5-output)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Survey the Park Corners

<span id="background-park"></span>

### 1. Recall the rectangle and its walkways

We use the [park graph from Section 14.1](14-01-graphs.md), its [representations from Section 14.2](14-02-data-structures-for-graphs.md), the [traversals from Section 14.3](14-03-graph-traversals.md), and the [one-way reachability example from Section 14.4](14-04-transitive-closure.md). Its corners are:

| Corner | Coordinate | Geometric role |
| :----- | :--------- | :------------- |
| `A` | $(0,0)$ | Starting corner and survey origin. |
| `B` | $(3,0)$ | 3 cm east of `A`. |
| `D` | $(0,4)$ | 4 cm north of `A`. |
| `C` | $(3,4)$ | Northeast corner. |

The physical walkways are `AB` = 3 cm, `BC` = 4 cm, `CD` = 3 cm, `DA` = 4 cm, and the diagonal `AC` = $\sqrt{3^2+4^2}=5$ cm. There is no `BD` walkway, even though the straight-line distance between those corners is 5 cm.

<span id="background-tasks"></span>

### 2. Turn the map into prerequisite tasks

Imagine a survey team preparing the park plan. It must establish origin `A` first, mark `B` and `D` from that origin, and verify `C` after the neighboring corners have been marked. The diagonal `AC` supplies one more direct check from the origin to `C`. Represent “finish the task at `u` before the task at `v`” with an arrow `u→v`:

```text
A: B, C, D
B: C
C: none
D: C
```

Each line lists **outgoing** arrows. These five arrows use the same five geometric corner pairs as the walkways: `A→B`, `A→C`, `A→D`, `B→C`, and `D→C`. They now describe **task dependencies** rather than visitor travel. No new physical connection is added.

> **Mental model:** An arrow means “the task at its tail must happen before the task at its head.” A topological order is any complete task list that respects every such arrow.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 14.5 Directed Acyclic Graphs

<span id="part-1-cycle"></span>

### 1. What a directed cycle would mean

A **directed acyclic graph**, or **DAG**, is a directed graph with **no directed cycle**. The book uses course prerequisites, class inheritance, and project schedules as examples. In a schedule, `u→v` means `u` must be completed before `v`.

Section 14.4's one-way travel map had the directed ring `A→B→C→D→A`. As task dependencies, that would demand `A` before `B` before `C` before `D` before `A`: no task could start. Our new arrow arrangement removes this circular requirement while retaining the same five physical corner pairs.

A DAG can have several outgoing arrows from a task, several incoming arrows to a task, or multiple independent tasks. “Acyclic” does **not** mean the underlying undirected drawing has no closed shape. Our rectangle still has geometric loops; what matters is whether the **arrow directions** permit a directed return to a starting vertex.

<span id="part-1-rank"></span>

### 2. Use geometry to check this example is acyclic

For this particular rectangle, define a simple progress score

$$
h(x,y)=\frac{x}{3}+\frac{y}{4}.
$$

| Corner | Calculation | Score |
| :----- | :---------- | ----: |
| `A` | $0/3+0/4$ | 0 |
| `B` | $3/3+0/4$ | 1 |
| `D` | $0/3+4/4$ | 1 |
| `C` | $3/3+4/4$ | 2 |

Every dependency arrow strictly **raises** this score: `A→B` and `A→D` go $0\to1$, `A→C` goes $0\to2$, and `B→C` and `D→C` go $1\to2$. A directed cycle would have to keep increasing $h$ and still return to its original score, which is impossible. Thus this park schedule is a DAG.

The score is a convenient **certificate for this example**, not a requirement in the definition of a DAG. It is neither a walkway length nor a travel time; `B` and `D` have the same score even though they are different corners.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 14.5.1 Topological Ordering

<span id="part-2-definition"></span>

### 1. Put every arrow forward in the order

A **topological ordering** lists each vertex exactly once so that, for every arrow $u\to v$, $u$ appears **earlier** than $v$. If vertex $v_i$ has position $i$, then every arrow $v_i\to v_j$ must satisfy $i<j$. The same is true along any directed path.

For the park schedule, both of these orders work:

| Valid order | Position of `A` | Positions of `B` and `D` | Position of `C` |
| :---------- | ---------------: | :------------------------ | ---------------: |
| `A, B, D, C` | 1 | 2 and 3 | 4 |
| `A, D, B, C` | 1 | 2 and 3 | 4 |

`A` must be first because it precedes every other corner. `C` must be last because it depends directly on `A`, `B`, and `D`. There is no arrow or directed path between `B` and `D`, so either may come first. These are the **only two** topological orders of this four-corner example.

<span id="part-2-proof"></span>

### 2. Why a topological order exists exactly for a DAG

**Proposition 14.21** says a directed graph has a topological ordering **if and only if** it is acyclic.

- **An order rules out a cycle.** Along every arrow, position numbers must rise. A directed cycle would require the first vertex's position to be smaller than itself after following the cycle, an impossibility.
- **A DAG admits an order.** Every finite DAG has a vertex with **in-degree 0**, meaning no arrows enter it. If every vertex had an incoming arrow, repeatedly following predecessors would eventually repeat a vertex and reveal a directed cycle. Put a zero-in-degree vertex first, remove it and its outgoing arrows, then repeat on the smaller DAG.

For our park, `A` starts with in-degree 0. Once its outgoing prerequisites are cleared, `B` and `D` can be selected; `C` becomes available only after both have been selected. This construction produces a valid topological order.

<span id="part-2-schedule"></span>

### 3. An order is a schedule, not a walking route

The valid list `A, D, B, C` does **not** say a visitor can walk `A→D→B→C`. In particular, the park has no `DB` walkway, and `D` has no dependency arrow to `B`. The list only says each task appears after its prerequisites.

Likewise, physical edge lengths do not determine a topological order. The 5 cm `AC` diagonal creates a direct precedence relation `A→C`, but it does not force `B` before `D` or `D` before `B`. A topological order answers a **sequencing** question, whereas Section 14.3's BFS answers a **fewest-walkways route** question.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Topological Sorting with In-Degrees

<span id="part-3-indegree"></span>

### 1. Count unfinished prerequisites

**Topological sorting** constructs an order rather than guessing one. Code Fragment 14.11 uses an `incount` dictionary: `incount[v]` is the number of incoming arrows from tasks **not yet placed** in the result. The book initializes it with `g.degree(v, False)`, the incoming degree. A `ready` list holds tasks whose current count is zero.

Initially our five arrows give:

| Corner | Incoming arrows | Initial `incount` |
| :----- | :-------------- | -----------------: |
| `A` | None | 0 |
| `B` | `A→B` | 1 |
| `C` | `A→C`, `B→C`, `D→C` | 3 |
| `D` | `A→D` | 1 |

The counts sum to $0+1+3+1=5$, the number of arrows: each arrow contributes one incoming end. Compare this with **geometric degree**: `A` touches three physical walkways but has **in-degree 0** in this directed task graph.

The algorithm repeatedly removes a ready vertex $u$, appends it to the result, and reduces `incount` by one for every arrow $u\to v$. A neighbor joins `ready` **exactly when** its count reaches zero. The book's implementation uses `ready.pop()`, so the last item added is selected first.

<span id="part-3-trace"></span>

### 2. Trace the ready list

To reproduce one particular order, scan vertices as `A, B, C, D`, scan each outgoing list alphabetically, and treat `ready` as a **last-in, first-out** list:

| Step | Take from `ready` | Remaining incoming counts `(A,B,C,D)` | `ready` after updates | Result so far |
| :--- | :---------------- | :------------------------------------- | :-------------------- | :------------ |
| Start | — | $(0,1,3,1)$ | `[A]` | `[]` |
| 1 | `A` | $(0,0,2,0)$ | `[B,D]` | `[A]` |
| 2 | `D` | $(0,0,1,0)$ | `[B]` | `[A,D]` |
| 3 | `B` | $(0,0,0,0)$ | `[C]` | `[A,D,B]` |
| 4 | `C` | $(0,0,0,0)$ | `[]` | `[A,D,B,C]` |

When `A` is processed, `B` and `D` both become ready. `D` is appended last, so `pop()` chooses it next. Choosing `B` first instead would yield the other valid order `A, B, D, C`. The different orders reflect a **tie**, not an error.

<span id="part-3-cycle"></span>

### 3. Recognize a cycle from an incomplete result

Suppose the survey plan adds the reverse requirement `C→B` while retaining `B→C`. These two arrows make a directed cycle `B→C→B` on the existing `BC` corner pair. `A` and then `D` can be processed, but `B` still waits for `C` and `C` waits for `B`. The ready list becomes empty with only `[A,D]` in the result.

Code Fragment 14.11 returns that **partial list**; it does not raise an exception. If the result contains fewer than $n$ vertices, the graph has a directed cycle somewhere in the unprocessed part, so no topological order of the **whole** graph exists. An empty result is also possible: the cyclic one-way ring from Section 14.4 has no initial zero-in-degree vertex.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Performance of Topological Sorting

<span id="part-4-cost"></span>

### 1. Time and auxiliary space

**Proposition 14.22** gives $O(n+m)$ time and $O(n)$ **auxiliary space** for the book's topological sort with an adjacency-list graph. Building or obtaining the $n$ in-degrees takes $O(n+m)$ at most. Each vertex enters and leaves `ready` at most once, and each outgoing edge of a processed vertex is examined once. The `incount` map, `ready` list, and result list together hold $O(n)$ entries beyond the graph itself.

The book's dictionary uses hash lookup with **expected** $O(1)$ time per counter update. Indexed counters or fields on vertex objects can avoid relying on expected hash behavior. Edge lengths do not enter this count: scanning the 5 cm diagonal arrow costs one edge examination, just like scanning a 3 cm side arrow.

<span id="part-4-clarification"></span>

### 2. The precise cycle guarantee

> **Source clarification:** The proof discussion on printed page 657 says a vertex not itself on a cycle will be processed. A vertex **downstream of a cycle** may remain blocked too. The sound conclusion is: if the algorithm stops before ordering every vertex, the unprocessed subgraph **contains** a directed cycle; it need not consist only of cycle vertices.

For a small connected park variant, use arrows `A→B`, `B→C`, `C→B`, and `C→D`. The `B↔C` pair is a cycle. `D` is not part of that cycle, but its task still waits for `C`, so it is omitted when the ready list empties. This distinction matters when interpreting a partial result: **missing** does not always mean **on a cycle**.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: A Complete Park Scheduling Program

<span id="part-5-program"></span>

### 1. Run the DAG and cycle examples

The program uses the same five prerequisite arrows as the main geometry example. It follows the book's `incount` and `ready.pop()` approach, with a fixed vertex and neighbor order so its trace is reproducible. It then adds `C→B` to test the cycle case.

```python
corners = "ABCD"
outgoing = {
    "A": ["B", "C", "D"],
    "B": ["C"],
    "C": [],
    "D": ["C"],
}

def topological_sort(vertices, arrows, show_steps=False):
    incount = {v: 0 for v in vertices}
    for u in vertices:
        for v in arrows[u]:
            incount[v] += 1

    ready = [v for v in vertices if incount[v] == 0]
    order = []
    if show_steps:
        print("initial in-degrees:", incount)

    while ready:
        u = ready.pop()                # last ready task first
        order.append(u)
        for v in arrows[u]:            # outgoing prerequisites cleared
            incount[v] -= 1
            if incount[v] == 0:
                ready.append(v)
        if show_steps:
            print(f"take {u}: ready={ready}")

    return order

print("DAG:")
dag_order = topological_sort(corners, outgoing, show_steps=True)
print("order:", dag_order)
print("complete:", len(dag_order) == len(corners))

with_cycle = {u: neighbors.copy() for u, neighbors in outgoing.items()}
with_cycle["C"].append("B")
cycle_order = topological_sort(corners, with_cycle)
print("with C->B:", cycle_order)
print("complete:", len(cycle_order) == len(corners))
```

<span id="part-5-output"></span>

### 2. Read the output

```text
DAG:
initial in-degrees: {'A': 0, 'B': 1, 'C': 3, 'D': 1}
take A: ready=['B', 'D']
take D: ready=['B']
take B: ready=['C']
take C: ready=[]
order: ['A', 'D', 'B', 'C']
complete: True
with C->B: ['A', 'D']
complete: False
```

The first run places every task and agrees with the table. The second stops after `A,D` because the added `C→B` makes `B` and `C` wait on each other. The `complete` comparison tells us whether the returned list is a topological order of the **entire** graph.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which corner can the survey team mark first?</strong></summary>

**Scenario:** The team starts at `A=(0,0)`, needs `B=(3,0)` and `D=(0,4)` before the final check at `C=(3,4)`, and also checks the diagonal `AC`.

**Check:** `A` has in-degree 0. Marking it clears prerequisites for `B` and `D`. The diagonal length is $\sqrt{3^2+4^2}=5$ cm; its arrow `A→C` is one prerequisite for `C`, while `B→C` and `D→C` are the other two.

**Result:** `A` is first, `C` is last, and the two middle tasks may trade places.

</details>

<details>
<summary><strong>Case Study 2: Is a topological order a route through the park?</strong></summary>

**Scenario:** The valid task order `A,D,B,C` puts `D` immediately before `B`.

**Check:** `D=(0,4)` and `B=(3,0)` are 5 cm apart in a straight line, but no `BD` walkway exists. The task graph has no `D→B` arrow, either.

**Result:** The order schedules work at corners; it does not claim one visitor can traverse those corners in that sequence.

</details>

<details>
<summary><strong>Case Study 3: What if two corner checks depend on each other?</strong></summary>

**Scenario:** Add `C→B` to the existing `B→C` requirement, using the same 4 cm `BC` corner pair.

**Check:** The two requirements form `B→C→B`. The algorithm schedules `A`, then `D`, then has no ready task. Neither `B` nor `C` can be placed first.

**Result:** The partial output `[A,D]` proves the amended task graph has no complete topological order.

</details>

<details>
<summary><strong>Case Study 4: Must every omitted corner be on a cycle?</strong></summary>

**Scenario:** Use the connected walkway chain `AB`, `BC`, `CD` with task arrows `A→B`, `B→C`, `C→B`, and `C→D`.

**Check:** After `A`, the `B↔C` cycle blocks both `B` and `C`. `D` is also blocked because `C→D` is unfinished. Yet `D` has no directed route back to itself through other corners, so `D` is not on a cycle.

**Result:** An incomplete sort means a cycle exists **among** the unprocessed vertices; it does not identify every unprocessed vertex as cyclic.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 14.5 idea | Plain-language meaning | Rectangle-park example |
| :---------------- | :--------------------- | :--------------------- |
| **DAG** | Directed graph with no directed cycle. | `A→B`, `A→D`, `A→C`, `B→C`, `D→C`. |
| **Prerequisite arrow** | Its tail task must happen before its head task. | Mark `B` before verifying `C`. |
| **Geometric progress score** | A strictly increasing value along arrows proves this example acyclic. | $h(A)=0$, $h(B)=h(D)=1$, $h(C)=2$. |
| **Topological order** | List all vertices with every arrow pointing forward. | `A,D,B,C` and `A,B,D,C` are both valid. |
| **Proposition 14.21** | A complete topological order exists exactly when there is no directed cycle. | Adding `C→B` makes `B↔C` impossible to schedule. |
| **In-degree and ready list** | Count unfinished incoming prerequisites; choose any count-zero task. | After `A`, both `B` and `D` are ready. |
| **Partial result** | Some tasks remain because the unprocessed graph contains a cycle. | With `C→B`, the algorithm returns `[A,D]`. |
| **Proposition 14.22** | Topological sort scans vertices and edges once with linear extra storage. | $O(n+m)$ time and $O(n)$ auxiliary space. |
| **Order versus route** | A task schedule need not trace physical walkways. | `A,D,B,C` is valid despite the absent `BD` walkway. |

[🔝 Back to Top](#top)
