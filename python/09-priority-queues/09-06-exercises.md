<span id="top"></span>

# 9.6 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.6, printed pages 395–400 (the supplied PDF).<br>
> **Topic:** Reinforcement R-9.1–R-9.25; Creativity C-9.26–C-9.52; Projects P-9.53–P-9.58.<br>
> **Domain Focus:** Coordinate-grid points ordered by squared distance, with short transfers to the book's scheduling, trading, and spatial-search settings.<br>
> **User Prompt:** Reexplain [`Section 9.6`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: One Point Set, Many Priority-Queue Questions](#background)
   - [1. Keep the chapter's point cards](#background-points)
   - [2. Read each exercise as a request for evidence](#background-evidence)
2. [Part 1: 9.6 Exercises at a Glance](#part-1)
   - [1. Three groups, 58 exercises](#part-1-groups)
   - [2. Separate the book's inputs from our study case](#part-1-source)
3. [Part 2: Reinforcement, R-9.1–R-9.25](#part-2)
   - [1. Priority-queue operations and costs, R-9.1–R-9.6](#part-2-operations)
   - [2. Sorting and heap positions, R-9.7–R-9.13](#part-2-sorting)
   - [3. Heap shape, traversals, and summations, R-9.14–R-9.20](#part-2-shape)
   - [4. Locator and construction traces, R-9.21–R-9.25](#part-2-traces)
4. [Part 3: Creativity, C-9.26–C-9.52](#part-3)
   - [1. Adapt one queue and its storage, C-9.26–C-9.29](#part-3-adapters)
   - [2. Change heap links and analyze work, C-9.30–C-9.38](#part-3-structure)
   - [3. Heap operations and top-k selection, C-9.39–C-9.46](#part-3-selection)
   - [4. In-place sorting and changing priorities, C-9.47–C-9.52](#part-3-systems)
5. [Part 4: Projects, P-9.53–P-9.58](#part-4)
   - [1. Sort, rank, and match, P-9.53–P-9.55](#part-4-sorting)
   - [2. Spatial search, scheduling, and locators, P-9.56–P-9.58](#part-4-spatial)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. Find nearby points and remove the nearest or farthest](#part-5-program)
   - [2. Read the output and costs](#part-5-output)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Point Set, Many Priority-Queue Questions

<span id="background-points"></span>

### 1. Keep the chapter's point cards

The [Section 9.1 guide](09-01-the-priority-queue-abstract-data-type.md) introduced points waiting to be processed nearest-first from the origin `O = (0, 0)`, and Sections 9.2–9.5 reused them. For a point `(x, y)`, its key is the **squared distance** `d² = x² + y²`. Smaller keys mean nearer points; comparing these keys gives the same order as comparing distances.

| Arrival | Point | Key calculation | Key `d²` |
| ---: | :--- | :--- | ---: |
| 1st | `A = (1, 2)` | `1² + 2²` | 5 |
| 2nd | `C = (0, 3)` | `0² + 3²` | 9 |
| 3rd | `B = (1, 1)` | `1² + 1²` | 2 |
| 4th | `D = (2, 2)` | `2² + 2²` | 8 |
| 5th, when needed | `H = (3, 1)` | `3² + 1²` | 10 |

The first four insertions produce the min-heap array `[B(2), D(8), A(5), C(9)]` from [Section 9.3](09-03-heaps.md). Repeated minimum removals give `B, A, D, C`. When we ask for **farthest** points instead, the key order reverses: among all five, `H(10)` and `C(9)` come first. We retain the earlier conventions `E = (-1, -1)` with key `2` for a tie and `F = (0, 1)` with key `1` for a newly closer point.

<span id="background-evidence"></span>

### 2. Read each exercise as a request for evidence

Section 9.6 is a list of exercises, so its parts are the book's **Reinforcement**, **Creativity**, and **Projects** groups. Before working on one, identify the requested result:

| Request | Evidence to prepare | Example with point cards |
| :--- | :--- | :--- |
| **Trace** an algorithm | Show the state after each operation. | Record each heap array while `A` bubbles upward. |
| **Prove** a cost or property | State an invariant and count work. | A heap path has at most `O(log n)` edges. |
| **Design** an operation | State its representation and what each step preserves. | Keep a locator's index correct after swaps. |
| **Implement and compare** | Give working code, then repeat fair measurements. | Compare two heap sorts on the same distance keys. |

> **Mental model:** Keep the points and key rule fixed, then change one question: nearest, farthest, sorted order, key update, or a proof about the heap's shape.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 9.6 Exercises at a Glance

<span id="part-1-groups"></span>

### 1. Three groups, 58 exercises

| Book group | Exercise IDs | What to practice | Geometry bridge |
| :--- | :--- | :--- | :--- |
| Reinforcement | R-9.1–R-9.25 | Trace, classify, or prove the chapter's core behavior. | Use the four-point heap and distance sort. |
| Creativity | C-9.26–C-9.52 | Adapt an ADT, change storage, or design a faster operation. | Reuse point locators, threshold queries, and farthest-point selection. |
| Projects | P-9.53–P-9.58 | Build and evaluate a complete implementation. | Use point records as test inputs where the project's domain permits. |

The book's exercise statements are the **subjects being explained**. The rows below paraphrase each request and give a first step; they do not substitute our geometry inputs for a numerical sequence, figure, or application explicitly required by the book.

<span id="part-1-source"></span>

### 2. Separate the book's inputs from our study case

For example, R-9.7 and R-9.8 prescribe the sequence `(22, 15, 36, 44, 10, 3, 9, 13, 29, 25)`. Practice the idea first with `A(5), C(9), B(2), D(8)`, then trace the **specified** sequence for the exercise. R-9.21 and R-9.22 refer to the book's **Figure 9.1** heap, where `(16, X)` and `(5, A)` are book entries; our geometry `A(5)` is merely a connected teaching example.

Likewise, the stock-order and CPU-job problems ask for their own application rules. Squared distance is a way to understand key ordering, while a stock price or job priority supplies the key in those original tasks.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement, R-9.1–R-9.25

<span id="part-2-operations"></span>

### 1. Priority-queue operations and costs, R-9.1–R-9.6

| Exercise | What it asks you to establish | First step or geometry check |
| :--- | :--- | :--- |
| R-9.1 | Cost of removing `log n` minima from an `n`-entry heap. | Multiply `log n` removals by `O(log n)` work each: `O((log n)²)`. |
| R-9.2 | When preorder-rank keys make a binary tree a heap. | Parent ranks precede child ranks, so check the **complete-tree shape** as well as heap order. |
| R-9.3 | Results of six `remove_min()` calls mixed with insertions. | Keep a key table after every book-specified call; the removal labels are `D, J, B, A, H, L`. |
| R-9.4 | Choose a structure for timestamped airport events. | A min-priority queue returns the earliest event, like our nearest-point queue returns the smallest distance key. |
| R-9.5 | Make `min()` constant time in an unsorted priority queue. | Cache the current minimum entry; update the cache on insertions and reconsider it after a removal. |
| R-9.6 | Decide whether the same cache gives constant-time `remove_min()`. | Removing a cached minimum is easy, but finding the **next** minimum in an unsorted remainder still requires a scan. |

For R-9.3, trace the book's exact sequence: `add(5,A), add(4,B), add(7,F), add(1,D), remove_min(), add(3,J), add(6,L), remove_min(), remove_min(), add(8,G), remove_min(), add(2,H), remove_min(), remove_min()`. The six removal labels in the table are checkpoints for that sequence.

The `O((log n)²)` bound in R-9.1 is for repeated removals **after the heap already exists**. If building the initial heap is part of a different problem, count that construction separately. In R-9.2, preorder ranks alone do not make an incomplete tree into the complete binary tree required by this chapter's heap definition.

<span id="part-2-sorting"></span>

### 2. Sorting and heap positions, R-9.7–R-9.13

| Exercise | What it asks you to establish | First step or geometry check |
| :--- | :--- | :--- |
| R-9.7 | Trace selection-sort on the book's ten numbers. | Repeatedly select the minimum of the unsorted remainder; our points leave as `B, A, D, C`. |
| R-9.8 | Trace insertion-sort on those **same** ten numbers. | After every insertion, draw the sorted portion; for points, insert `B(2)` ahead of `A(5)` and `C(9)`. |
| R-9.9 | Give a worst-case insertion-sort order and show quadratic work. | Feed keys in decreasing order, such as `9, 8, 5, 2`; each new point crosses all earlier ones. |
| R-9.10 | Find possible positions of the third-smallest heap key. | With distinct keys, count how many smaller ancestors a candidate can have; test children and grandchildren. |
| R-9.11 | Find possible positions of the largest heap key. | A **unique** largest key must be at a leaf; if maxima tie, an internal node can also carry a maximum. |
| R-9.12 | Use a numeric min-priority queue as a max-priority queue. | Insert `-d²`: `H(10)` has key `-10` and leaves before `B(2)` with key `-2`. |
| R-9.13 | Trace in-place heap-sort on the book's ten numbers. | Build a **max-heap**, then mark the growing right-hand sorted suffix after each removal-by-swap. |

For R-9.9, the ordered-list implementation from [Section 9.4](09-04-sorting-with-a-priority-queue.md) places every newly smaller item at the front. Its shifts or positional scans total `1 + 2 + ··· + (n−1) = Θ(n²)` in the worst case.

R-9.13 prescribes the input `(2, 5, 16, 4, 10, 23, 39, 18, 26, 15)`. Use our four point cards to learn the heap/suffix boundary, then show every state for **those** numbers.

<span id="part-2-shape"></span>

### 3. Heap shape, traversals, and summations, R-9.14–R-9.20

| Exercise | What it asks you to establish | First step or geometry check |
| :--- | :--- | :--- |
| R-9.14 | Test level-number keys on a complete binary tree. | Each child is one level deeper than its parent, so its level key is larger. |
| R-9.15 | Explain why down-heap need not handle a right-only child. | A complete tree fills left positions first; a right child implies a left child. |
| R-9.16 | Test sorted preorder, inorder, and postorder on a seven-entry distinct-key heap. | Draw all seven positions and check the root's visit position in each traversal before trying key assignments. |
| R-9.17 | List preorder, inorder, and postorder **indices** of a 15-entry array heap. | Start at index `0`; children of index `i` are `2i+1` and `2i+2`. |
| R-9.18 | Prove `Σ(i=1..n) log i = Θ(n log n)`. | Upper-bound every term by `log n`; lower-bound the last half by roughly `log(n/2)`. |
| R-9.19 | Refute the claim that heap preorder is always nondecreasing. | Try the valid heap `[B(2), A(5), D(8), C(9)]`; preorder keys are `2, 5, 9, 8`. |
| R-9.20 | Refute the claim that heap postorder is always nonincreasing. | The same heap has postorder keys `9, 5, 8, 2`. |

A **heap-order** rule compares a parent with its children; it does not sort every pair of nodes. That is why traversal order need not match numeric key order. R-9.18's lower and upper bounds connect to the `Θ(n log n)` cost of repeated heap insertions and removals.

<span id="part-2-traces"></span>

### 4. Locator and construction traces, R-9.21–R-9.25

| Exercise | What it asks you to establish | First step or geometry check |
| :--- | :--- | :--- |
| R-9.21 | Remove `(16, X)` from the book's Figure 9.1 heap through a locator. | Identify its array/tree position, exchange it with the last entry, delete it, and repair the replacement. |
| R-9.22 | Change `(5, A)` to key `18` in Figure 9.1 through a locator. | The key increases, so inspect children and down-heap as needed; update locator indices on swaps. |
| R-9.23 | Place odd keys `1..59` so adding `32` rises to a child of the root. | Arrange a path below root key `1` whose existing keys are all greater than `32`. |
| R-9.24 | Give `n` heap insertions needing `Ω(n log n)` total time. | Insert successively **smaller** keys so each new point climbs nearly the full heap height. |
| R-9.25 | Finish every array and heap state of the book's Figure 9.9 in-place sort. | Keep a max-heap prefix and sorted suffix boundary; record each swap and down-heap repair. |

For locator exercises, the point case from [Section 9.5](09-05-adaptable-priority-queues.md) is a small warm-up: `A` moves from key `5` to `1`, while `D` can be removed although it is not the minimum. Use the **book's** Figure 9.1 entries for the actual R-9.21 and R-9.22 traces.

[🔝 Back to Top](#top)

---
<span id="part-3"></span>

## Part 3: Creativity, C-9.26–C-9.52

<span id="part-3-adapters"></span>

### 1. Adapt one queue and its storage, C-9.26–C-9.29

| Exercise | Design request | First step or geometry check |
| :--- | :--- | :--- |
| C-9.26 | Build a LIFO stack from a priority queue and one integer. | Give later point cards **smaller** counter-based keys so the last arrival leaves first. |
| C-9.27 | Build a FIFO queue from a priority queue and one integer. | Give later cards **larger**, never-reused counter keys so the first arrival leaves first. |
| C-9.28 | Test whether using the queue's current size as each key gives FIFO order. | After removals, size can fall; a newly added card can receive a key smaller than an older waiting card. |
| C-9.29 | Rebuild `SortedPriorityQueue` with a Python list while keeping `remove_min()` at `O(1)`. | Keep the minimum at the **end** for `pop()`; account for shifting work on insertion. |

These artificial counter keys encode **arrival order**, not squared distance. The same point cards can play stack or FIFO roles, but a different key rule changes which card is next. For C-9.28, insert three cards with size keys `0, 1, 2`, remove the first two, then insert a fourth card: it receives key `1` and can jump ahead of the older card with key `2`.

<span id="part-3-structure"></span>

### 2. Change heap links and analyze work, C-9.30–C-9.38

| Exercise | Design or proof request | First step or geometry check |
| :--- | :--- | :--- |
| C-9.30 | Write iterative `_upheap` for the array heap. | While a new point key is below its parent, swap and move the index to that parent. |
| C-9.31 | Write iterative `_downheap` for the array heap. | Choose the smaller existing child, swap only if it beats the current point, and continue downward. |
| C-9.32 | Maintain the last-node reference in a **linked** complete tree after add/remove in `O(log n)`. | Use parent and child links to cross from the old last node to the next complete-tree position. |
| C-9.33 | Maintain special next-leaf links in a linked heap in `O(1)` per operation. | Identify the few frontier links affected when the last leaf changes; preserve their rightward order. |
| C-9.34 | Find the last node in `O(log n)` without storing its reference. | Use the **one-based breadth-first node number** `n` in binary, drop its leading `1`, then follow `0` left and `1` right from the root. |
| C-9.35 | Report all heap entries with key `≤ k` in time proportional to output, without changing the heap. | Visit a subtree only while its root key `≤ k`; a larger root excludes every descendant. |
| C-9.36 | Justify the operation costs in Table 9.4. | Separate constant-time locator lookup from one `O(log n)` bubble path and occasional array resizing. |
| C-9.37 | Show `Σ(i=1..h) i/2^i = O(1)`. | Compare with the infinite weighted geometric series, which sums to `2`. |
| C-9.38 | Merge two heap-ordered binary trees in `O(h₁+h₂)` without requiring completeness. | Compare roots and recurse along a spine while preserving the smaller root above the larger one. |

The linked-tree questions C-9.32–C-9.34 concern the **complete shape**, independent of whether the nodes hold our point distances or other keys. In C-9.35, if `t` entries are reported, a pruning traversal takes `O(t+1)` time; the `+1` accounts for checking the root when the answer is empty. This is the precise meaning of the exercise's output-proportional goal.

<span id="part-3-selection"></span>

### 3. Heap operations and top-k selection, C-9.39–C-9.46

| Exercise | Design request | First step or geometry check |
| :--- | :--- | :--- |
| C-9.39 | Add `heappushpop` to the heap class. | Insert then remove a minimum as one operation: if new `F(1)` is smaller than old root `B(2)`, return `F` and leave the old heap intact. |
| C-9.40 | Add `heapreplace` to the heap class. | Remove the old minimum **first**, then insert the new item: with `B(2)` and `F(1)`, return `B` and retain `F`. |
| C-9.41 | Find the top `log n` frequent flyers in `O(n)`, improving on full sorting. | Bottom-up build a max-heap in `O(n)`, then remove `log n` maxima in `O((log n)²)`. |
| C-9.42 | Find the `k` largest of `n` values in `O(n + k log n)`. | Build a max-heap from all point distances, then remove the `k` farthest points. |
| C-9.43 | Find the `k` largest in `O(n log k)` with `O(k)` extra space. | Keep only the current `k` largest in a **min-heap of size `k`**. |
| C-9.44 | Adapt an unknown min-priority-queue implementation to a max-priority queue for arbitrary comparable keys. | Wrap keys with reversed comparison; numeric negation works only when keys are numeric. |
| C-9.45 | Define a key for nonnegative integers by the number of `1` bits in binary. | Count set bits before comparing; this ordering differs from the integer's magnitude. |
| C-9.46 | Add an optional key function to the book's `pq_sort`. | For point records, calculate `x² + y²` as the key while preserving the whole point as the value. |

For C-9.41, `O(n + (log n)²) = O(n)`: taking only logarithmically many maxima is much cheaper than sorting all `n` entries. C-9.43's printed `O(n log k)` is normally read for `k ≥ 2`; for `k = 1`, one scan is `O(n)`. These top-k designs use the **same distance keys**, but choose different storage sizes and cost targets.

<span id="part-3-systems"></span>

### 4. In-place sorting and changing priorities, C-9.47–C-9.52

| Exercise | Design request | First step or geometry check |
| :--- | :--- | :--- |
| C-9.47 | Make selection-sort operate inside its input array with `O(1)` extra variables. | At each boundary, find the nearest remaining point and swap it into place. |
| C-9.48 | Make insertion-sort use only its input array and constant extra variables. | Hold the next point card while shifting larger keys right within the sorted prefix. |
| C-9.49 | Describe in-place heap-sort using a **min-heap** instead of a max-heap. | Swapping each minimum to the right produces descending order; reverse the array in place if ascending order is required. |
| C-9.50 | Match arriving stock buy/sell orders in `O(log n)` per order. | Keep highest waiting buy and lowest waiting sell accessible; a sell at `y` matches a buy at `x` when `y ≤ x`. |
| C-9.51 | Permit price updates for orders still waiting in C-9.50. | Keep a locator for each unprocessed order so its queue key can change without scanning. |
| C-9.52 | Support a game transferring half the richest child's money to the poorest. | Access **both** extremes and update both balances after every transfer. |

The in-place sort questions keep the array's entries in that same array. The stock and money exercises use the book's own values as keys: prices and balances are **not** squared distances. Their shared idea with our point cards is that the next decision depends on a changing minimum or maximum.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Projects, P-9.53–P-9.58

<span id="part-4-sorting"></span>

### 1. Sort, rank, and match, P-9.53–P-9.55

| Exercise | Deliverable | Useful check |
| :--- | :--- | :--- |
| P-9.53 | Implement in-place heap-sort and experimentally compare it with a separate-heap version. | Use the same input arrays, sizes, and repeated timing method; verify both outputs are sorted. |
| P-9.54 | Reimplement `FavoritesListMTF.top` using a top-k method from C-9.42 or C-9.43. | Keep favorite counts as keys and emit results from **largest to smallest**. |
| P-9.55 | Implement the stock-order processor described in C-9.50. | Test immediately matched orders, orders that must wait, and later matches in both directions. |

For P-9.53, the two heap-sort versions have the same `O(n log n)` time bound but different auxiliary-space needs. A timing comparison measures actual runs; it does not by itself prove an asymptotic bound.

<span id="part-4-spatial"></span>

### 2. Spatial search, scheduling, and locators, P-9.56–P-9.58

| Exercise | Deliverable | Useful check |
| :--- | :--- | :--- |
| P-9.56 | Given a **complete binary tree** whose external nodes already hold points ordered by x, label it as a priority search tree in linear time. | Each point has distinct **integer** x and y coordinates; reason about the highest available y in each subtree. |
| P-9.57 | Simulate nonpreemptive CPU jobs, one command and one time slice at a time. | A waiting-job min-queue uses priority `−20` as highest and `19` as lowest; once a job starts, keep it for its full length. |
| P-9.58 | Implement an adaptable priority queue using an unsorted, location-aware list. | Return a locator on insertion; use it to update or remove that specific entry while `min()` still scans for the smallest key. |

For P-9.57, each job's length is an integer from `1` to `100` time slices. Each slice supplies a command of the form `add job name with length n and priority p` or `no new job this slice`; print the running job's name for every slice. A waiting job cannot interrupt the job already running.

The four-point map from earlier sections does **not** satisfy P-9.56's distinct-coordinate condition: `A` and `B` share `x = 1`, while `A` and `D` share `y = 2`. For a separate spatial example, use `J = (1, 4)`, `K = (2, 1)`, `L = (3, 3)`, and `M = (4, 2)`. Their integer x and y coordinates are each distinct; the x order is `J, K, L, M`, and `J` has the greatest y value. The project's linear-time target begins with that x-ordered leaf tree already given; sorting an unordered point list would add work.

> **Source wording for P-9.56:** The printed nonroot clause says `top(r)` where `top(v)` appears intended. Its parent-only exclusion wording is also ambiguous for deeper descendants if a point chosen by an ancestor could be selected again. When designing a unique-label interpretation, state explicitly that a point already assigned above a node is unavailable below it. This is an interpretation of the exercise wording, not an extra claim made by the book.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. Find nearby points and remove the nearest or farthest

This runnable example connects several exercises without changing their original statements. It uses the five point cards from the background. The threshold search illustrates C-9.35, the repeated minimum removals illustrate R-9.1, and the negative numeric keys illustrate R-9.12 and C-9.42.

```python
import heapq
from math import ceil, log2

points = [
    ("A", 1, 2), ("C", 0, 3), ("B", 1, 1),
    ("D", 2, 2), ("H", 3, 1),
]

def distance_squared(point):
    label, x, y = point
    return x * x + y * y

min_heap = [(distance_squared(p), p[0], p) for p in points]
heapq.heapify(min_heap)

def report_at_most(heap, index, limit, found):
    if index >= len(heap):
        return
    key, label, point = heap[index]
    if key > limit:             # Every descendant has key >= this key.
        return
    found.append((label, key))
    report_at_most(heap, 2 * index + 1, limit, found)
    report_at_most(heap, 2 * index + 2, limit, found)

within_8 = []
report_at_most(min_heap, 0, 8, within_8)

take = ceil(log2(len(points)))  # A concrete count for "log n".
nearest = []
for _ in range(take):
    key, label, point = heapq.heappop(min_heap)
    nearest.append((label, key))

max_heap = [(-distance_squared(p), p[0], p) for p in points]
heapq.heapify(max_heap)
farthest = []
for _ in range(2):
    negative_key, label, point = heapq.heappop(max_heap)
    farthest.append((label, -negative_key))

print("key <= 8:", within_8)
print("nearest:", nearest)
print("farthest two:", farthest)
```

The threshold search visits only a node whose key is at most `8`, then explores its children. If a node is farther than the threshold, all its descendants can be skipped because a min-heap parent is no larger than its descendants. The search **reads** `min_heap`; the following removals are the operations that change it.

<span id="part-5-output"></span>

### 2. Read the output and costs

```text
key <= 8: [('B', 2), ('D', 8), ('A', 5)]
nearest: [('B', 2), ('A', 5), ('D', 8)]
farthest two: [('H', 10), ('C', 9)]
```

For this run, the first line is **not sorted**: the threshold traversal reports qualifying heap nodes in its own visit order, as C-9.35 permits. Another valid heap layout could report those same points in a different order. The second line removes the three smallest keys, where `3 = ceil(log₂ 5)`. The last line uses a min-heap of **negative numeric keys** to act as a max-heap; C-9.44 asks for a more general adapter that also works when negation is unavailable.

For `n` entries and `t` reported entries, the pruning traversal takes `O(t+1)` time without changing the heap. Once the heap is built, `ceil(log₂ n)` removals cost `O((log n)²)`. Building the separate max-heap bottom-up costs `O(n)`, and removing two farthest entries costs `O(log n)` each.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why does a size key fail to preserve FIFO order?</strong></summary>

**Scenario:** Treat point cards `A`, `C`, and `B` as arrivals in a FIFO queue. Give them keys equal to the queue size at insertion: `0`, `1`, and `2`. Remove `A` and `C`; only older `B(2)` remains. Now add `D`, which receives the current-size key `1`.

**Result:** The priority queue returns newer `D(1)` before older `B(2)`. This violates FIFO even without a tie. A counter that **only increases** gives the intended arrival order. These counter keys are not the points' squared distances.

</details>

<details>
<summary><strong>Case Study 2: Does a min-heap traversal sort point distances?</strong></summary>

**Scenario:** Arrange our four entries in the valid complete min-heap `[B(2), A(5), D(8), C(9)]`.

**Result:** Preorder visits keys `2, 5, 9, 8`, which is not nondecreasing. Postorder visits `9, 5, 8, 2`, which is not nonincreasing. The heap compares each parent to its children; it does not order `C(9)` against the separate branch holding `D(8)`.

</details>

<details>
<summary><strong>Case Study 3: When may a threshold search skip a whole subtree?</strong></summary>

**Scenario:** In `[B(2), D(8), A(5), C(9), H(10)]`, ask for every point with key `≤ 5`.

**Result:** Report `B(2)`, skip the subtree rooted at `D(8)`, then report `A(5)`. The skipped `C(9)` and `H(10)` cannot qualify because they are below `D` in a min-heap. The heap is left unchanged.

</details>

<details>
<summary><strong>Case Study 4: How do push-pop and replace differ for a nearer point?</strong></summary>

**Scenario:** The current minimum is `B(2)`. A newly offered point `F = (0, 1)` has key `1`.

**Result:** `heappushpop(F)` returns `F(1)` and leaves the old heap as it was. `heapreplace(F)` removes and returns `B(2)` and retains `F(1)` in the heap. The operation order changes which point stays waiting.

</details>

<details>
<summary><strong>Case Study 5: Which two points are farthest?</strong></summary>

**Scenario:** Use all five points `A(5), C(9), B(2), D(8), H(10)` and ask for the largest two distance keys.

**Result:** `H(10)` and `C(9)` are farthest. C-9.42 builds a max-heap of all five and extracts twice; C-9.43 keeps only two candidates in a size-two min-heap while scanning. Both select the same two points, but use different space.

</details>

<details>
<summary><strong>Case Study 6: Which coordinates fit the priority-search-tree project?</strong></summary>

**Scenario:** P-9.56 requires no two points to share an x-coordinate or a y-coordinate. Our original `A, B, C, D` set fails. Use the companion set `J=(1,4), K=(2,1), L=(3,3), M=(4,2)` instead.

**Result:** The leaf order by x is `J, K, L, M`; the highest y in the full set belongs to `J`, and the highest y in the right half belongs to `L`. Before assigning labels lower in the tree, state how ancestor-selected points are excluded so a point is not selected twice under a unique-label interpretation.

</details>

<details>
<summary><strong>Case Study 7: What does a locator add to the point queue?</strong></summary>

**Scenario:** The queue holds the original four points. `A` moves from `(1,2)` with key `5` to `(0,1)` with key `1`; later `D(8)` withdraws.

**Result:** Use `update(loc_A, 1, ("A", 0, 1))` so `A` rises toward the heap root, then `remove(loc_D)` to withdraw `D` without taking the current minimum. A locator keeps identifying its own entry even when the heap rearranges it.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Exercise family | Main question | Geometry study result |
| :--- | :--- | :--- |
| **Priority-queue traces** | Which key is selected next, and what remains? | Minima of the first four points leave as `B, A, D, C`. |
| **Heap shape and traversals** | Which relationships does a heap actually guarantee? | Parents have no larger key than children; preorder need not be sorted. |
| **Sorting** | When is ordering work done, and how much space is used? | Selection-, insertion-, and heap-sort all sort the distance keys by different mechanisms. |
| **Locators and updates** | How can a specified waiting entry change or leave? | Update `A`'s key and coordinates; remove `D` directly. |
| **Top-k and threshold queries** | Can we avoid sorting or scanning irrelevant entries? | Report keys `≤ 8` by pruning, or select farthest `H` and `C` with a heap. |
| **Alternative ADTs** | Can key order represent another rule? | A monotone counter encodes FIFO/LIFO; negative numeric distance keys encode farthest-first. |
| **Projects** | What should a complete implementation demonstrate? | Verify output, invariants, stated cost, and the original problem's application rules. |

> **Final mental model:** Keep the key rule, heap invariant, and requested output separate. A small point trace checks behavior; a path-length or summation argument checks cost; a project also needs a working implementation and evidence from its original domain.

[🔝 Back to Top](#top)
