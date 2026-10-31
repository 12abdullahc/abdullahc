<span id="top"></span>

# 9.4 Sorting with a Priority Queue — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.4, printed pages 385–389 (the supplied PDF).<br>
> **Topic:** 9.4 Sorting with a Priority Queue; 9.4.1 Selection-Sort and Insertion-Sort; 9.4.2 Heap-Sort; Implementing Heap-Sort In-Place.<br>
> **Domain Focus:** Sorting coordinate-grid points from nearest to farthest from the origin, using squared distance as a key.<br>
> **User Prompt:** Reexplain [`Section 9.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Put the Points in Distance Order](#background)
   - [1. Reuse the four-point map](#background-points)
   - [2. Repeatedly choosing the nearest point produces a sorted order](#background-sort)
2. [Part 1: 9.4 Sorting with a Priority Queue](#part-1)
   - [1. The book's two-phase sorting pattern](#part-1-template)
   - [2. Adapt the pattern to geometry](#part-1-geometry)
   - [3. Choose comparable keys](#part-1-comparison)
3. [Part 2: 9.4.1 Selection-Sort and Insertion-Sort](#part-2)
   - [1. An unsorted priority queue gives selection-sort](#part-2-selection)
   - [2. A sorted priority queue gives insertion-sort](#part-2-insertion)
   - [3. Compare where each algorithm spends time](#part-2-costs)
4. [Part 3: 9.4.2 Heap-Sort](#part-3)
   - [1. Sort by inserting into and removing from a heap](#part-3-process)
   - [2. Why the total time is `O(n log n)`](#part-3-analysis)
   - [3. Run the point example in Python](#part-3-program)
5. [Part 4: Implementing Heap-Sort In-Place](#part-4)
   - [1. Use a max-heap and a sorted suffix](#part-4-max)
   - [2. Trace the boundary across four point cards](#part-4-trace)
   - [3. What in-place means here](#part-4-space)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Put the Points in Distance Order

<span id="background-points"></span>

### 1. Reuse the four-point map

The [Section 9.1 guide](09-01-the-priority-queue-abstract-data-type.md) used a priority queue to choose the point nearest to `O = (0, 0)`. The [Section 9.2 guide](09-02-implementing-a-priority-queue.md) compared sorted and unsorted lists, and the [Section 9.3 guide](09-03-heaps.md) added a heap. We now use those same implementations to **sort all the points**.

The points arrive in the order `A`, `C`, `B`, `D`. For each point `(x, y)`, the numeric key is its **squared distance** `d² = x² + y²`. Comparing squared distances gives the same nearest-first order as comparing actual distances, without computing square roots.

| Arrival | Point | Key calculation | Squared-distance key |
| ---: | :--- | :--- | ---: |
| 1st | `A = (1, 2)` | `1² + 2²` | 5 |
| 2nd | `C = (0, 3)` | `0² + 3²` | 9 |
| 3rd | `B = (1, 1)` | `1² + 1²` | 2 |
| 4th | `D = (2, 2)` | `2² + 2²` | 8 |

<span id="background-sort"></span>

### 2. Repeatedly choosing the nearest point produces a sorted order

If all four points wait in a minimum-oriented priority queue, four calls to `remove_min()` return `B(2)`, `A(5)`, `D(8)`, and `C(9)`. Put each returned point at the **end of a result sequence**:

```text
arrival order:          A(5), C(9), B(2), D(8)
nearest-first result:  B(2), A(5), D(8), C(9)
```

The resulting keys `2 ≤ 5 ≤ 8 ≤ 9` are in **nondecreasing order**. Sorting asks for the entire sequence, so we continue removing minima until the priority queue is empty. That is the common idea behind every method in Section 9.4.

> **Mental model:** Put all point cards into a priority queue; repeatedly take the smallest-distance card and append it to the result. The queue's implementation determines how much work each phase takes.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 9.4 Sorting with a Priority Queue

<span id="part-1-template"></span>

### 1. The book's two-phase sorting pattern

Code Fragment 9.7 presents `pq_sort(C)` for a **positional list** `C`. It first saves `n = len(C)` and chooses a priority-queue implementation `P`. It then runs two phases:

| Phase | Action | State afterward |
| :--- | :--- | :--- |
| 1. Insert | Repeat `n` times: delete the first element of `C` and call `P.add(element, element)`. | `C` is empty; `P` holds all `n` entries. |
| 2. Extract | Repeat `n` times: call `P.remove_min()` and append the returned **value** to `C`. | `C` is rebuilt in nondecreasing order; `P` is empty. |

The book uses each element as **both key and value** because the elements in its example can be compared directly. Saving `n` before emptying `C` matters: the two loops each need the original number of elements. The same sorting pattern works with different concrete priority queues.

<span id="part-1-geometry"></span>

### 2. Adapt the pattern to geometry

Our point labels alone do not express distance order. When removing a point record from `C`, compute its squared distance and give that number to the queue as the **key**. Keep the complete point record as the **value** so it can be returned and appended to `C` later:

```text
book's directly comparable element:  P.add(element, element)
our geometry adaptation:             P.add(x*x + y*y, point_record)
```

For example, `A = ("A", 1, 2)` produces an entry with key `5` and value `("A", 1, 2)`. The queue compares `5` with other numeric keys; it returns the unchanged point record when `A` is selected. This is an **adaptation** of Code Fragment 9.7, whose literal code does not calculate a geometry key.

| Extraction call | Returned key | Point appended to `C` | `C` afterward |
| ---: | ---: | :--- | :--- |
| 1 | 2 | `B` | `B` |
| 2 | 5 | `A` | `B, A` |
| 3 | 8 | `D` | `B, A, D` |
| 4 | 9 | `C` | `B, A, D, C` |

<span id="part-1-comparison"></span>

### 3. Choose comparable keys

The priority queue needs a **consistent comparison rule** for its keys. The book discusses a strict weak order and highlights two properties: `k < k` is false, and if `a < b` and `b < c`, then `a < c`. Numeric squared distances satisfy the intended ordering. Equal distances form a tie; the priority-queue ADT does not promise which tied point comes out first.

The book also notes that strings are ordered **lexicographically**. For instance, `"12" < "4"` is true as a string comparison, though the number `12` exceeds `4`. Use numeric distance keys for geometry. The book suggests a custom key function for alternative orderings, but adding such a parameter to `pq_sort` is left as an exercise; it is **not** present in Code Fragment 9.7.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 9.4.1 Selection-Sort and Insertion-Sort

<span id="part-2-selection"></span>

### 1. An unsorted priority queue gives selection-sort

With the **unsorted-list priority queue** from Section 9.2, `add` appends each item in `O(1)` time. After phase 1, the queue's list still reflects arrival order: `A(5), C(9), B(2), D(8)`. Each `remove_min()` then **scans the waiting entries** to select the nearest point.

| Removal | Entries inspected during the scan | Selected point | Result sequence |
| ---: | ---: | :--- | :--- |
| 1 | 4 | `B(2)` | `B` |
| 2 | 3 | `A(5)` | `B, A` |
| 3 | 2 | `D(8)` | `B, A, D` |
| 4 | 1 | `C(9)` | `B, A, D, C` |

For our four points, the scans visit `4 + 3 + 2 + 1 = 10` entries in total. For `n` points, that sum is `n(n + 1)/2`, or `O(n²)`. The insertion phase takes `O(n)` total. The algorithm is called **selection-sort** because it repeatedly **selects** the minimum from the unsorted waiting items. Figure 9.7 in the book traces this pattern with the numbers `7, 4, 8, 2, 5, 3`.

<span id="part-2-insertion"></span>

### 2. A sorted priority queue gives insertion-sort

With the **sorted-list priority queue** from Section 9.2, each new item is placed into its key-ordered position. The cost moves to phase 1:

| Point inserted | Sorted priority queue afterward |
| :--- | :--- |
| `A(5)` | `A(5)` |
| `C(9)` | `A(5), C(9)` |
| `B(2)` | `B(2), A(5), C(9)` |
| `D(8)` | `B(2), A(5), D(8), C(9)` |

The queue is already in key order after all insertions. Phase 2 repeatedly removes its first item in `O(1)` time, yielding `B, A, D, C`. This is **insertion-sort** because each arriving item is **inserted into a sorted collection**. Figure 9.8 traces the same book numbers as Figure 9.7, but shows the ordering work during insertion.

In the worst case, one insertion can scan `O(n)` existing items; all insertions together take `O(n²)`. If the input is already in nondecreasing key order, each new item goes at the end after a constant amount of searching, giving the book's **`O(n)` best case** for this implementation.

<span id="part-2-costs"></span>

### 3. Compare where each algorithm spends time

| Priority-queue implementation | Phase 1: insert all | Phase 2: remove all | Total time |
| :--- | ---: | ---: | ---: |
| Unsorted list → selection-sort | `O(n)` | `O(n²)` | `O(n²)` |
| Sorted list → insertion-sort | `O(n²)` worst case | `O(n)` | `O(n²)` worst case; `O(n)` best case |

Both methods produce the same nearest-first order for our four **distinct** keys. Their names describe **when** they do the sorting work. The priority queue holds up to `n` extra entries while Code Fragment 9.7 empties and rebuilds `C`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 9.4.2 Heap-Sort

<span id="part-3-process"></span>

### 1. Sort by inserting into and removing from a heap

Use the **min-heap priority queue** from Section 9.3 in the same two-phase pattern. Every point first enters the heap with its squared-distance key. Then each `remove_min()` sends the nearest remaining point to the end of `C`.

After inserting our points in arrival order, one heap array is `[B(2), D(8), A(5), C(9)]`. The heap array itself is **not fully sorted**: `D(8)` appears before `A(5)`. Repeated removals create the sorted output:

```text
heap removal:  B(2) → A(5) → D(8) → C(9)
result C:      B(2), A(5), D(8), C(9)
```

This priority-queue sort using a heap is **heap-sort**. It uses the heap's minimum rule for each extraction, not the apparent left-to-right order of the heap array.

<span id="part-3-analysis"></span>

### 2. Why the total time is `O(n log n)`

For `n` points, each heap insertion takes at most `O(log n)` heap work, so inserting all `n` entries takes `O(n log n)`. Each of the `n` removals likewise takes at most `O(log n)`, making phase 2 `O(n log n)`. Therefore the complete sort is **`O(n log n)`** when comparing two keys takes `O(1)` time. This is Proposition 9.4 in the book.

The [bottom-up heap construction](09-03-heaps.md#part-7) from Section 9.3 can reduce **phase 1** to `O(n)` when all entries are available at once. Phase 2 still removes `n` minima, so the overall bound remains `O(n log n)`. The generic `pq_sort(C)` uses a separate priority queue with `O(n)` additional space.

<span id="part-3-program"></span>

### 3. Run the point example in Python

This runnable example uses Python's `heapq` functions to demonstrate the **same two phases** with our geometry keys. It is an illustration of the sorting pattern, not a copy of Code Fragment 9.7's positional-list implementation.

```python
import heapq

points = [("A", 1, 2), ("C", 0, 3), ("B", 1, 1), ("D", 2, 2)]
waiting = []

for point in points:        # Phase 1: insert
    label, x, y = point
    heapq.heappush(waiting, (x * x + y * y, point))

nearest_first = []
while waiting:              # Phase 2: remove minima
    key, point = heapq.heappop(waiting)
    nearest_first.append(point)

print([label for label, x, y in nearest_first])  # ['B', 'A', 'D', 'C']
```

The result retains each point's coordinates; the final line displays just the labels. The keys are distinct here. Python compares `(key, point_record)` tuples from left to right, so equal keys would compare the point records, starting with their labels. That adds a tie rule beyond the book's general priority-queue ADT.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Implementing Heap-Sort In-Place

<span id="part-4-max"></span>

### 1. Use a max-heap and a sorted suffix

The generic `pq_sort(C)` moves entries into a separate priority queue. Section 9.4.2 also describes a variation that rearranges an **array-based input sequence itself**. To get **ascending order** while placing finished entries at the **right end**, this variation uses a **max-heap**: its root has the largest key, or the point farthest from `O`.

Keep a boundary between two regions of the same array:

```text
[ max-heap prefix | sorted suffix ]
```

In phase 1, grow the max-heap prefix left to right, bubbling each newly included item upward as needed. In phase 2, swap the maximum at the root with the last position of the heap prefix. Shrink the prefix by one, leaving that maximum at the **front of the sorted suffix**. Down-heap the new root within the smaller prefix. Repeat until the prefix is empty.

The right suffix fills from **largest** toward **smallest** as its boundary moves left, so the completed array reads from nearest to farthest. A min-heap would place the nearest point at the right end under this same scheme, giving the opposite order.

<span id="part-4-trace"></span>

### 2. Trace the boundary across four point cards

Start with the arrival array `[A(5), C(9), B(2), D(8)]`. Phase 1 turns it into a max-heap; one valid result from inserting these entries left to right is `[C(9), D(8), B(2), A(5)]`. The vertical bar below separates the active heap from the finished suffix.

| Phase 2 action | Heap prefix after repair | Sorted suffix | Whole array |
| :--- | :--- | :--- | :--- |
| Start | `C(9), D(8), B(2), A(5)` | empty | `[C(9), D(8), B(2), A(5) \| ]` |
| Place farthest `C(9)` at the right. | `D(8), A(5), B(2)` | `C(9)` | `[D(8), A(5), B(2) \| C(9)]` |
| Place `D(8)` before `C(9)`. | `A(5), B(2)` | `D(8), C(9)` | `[A(5), B(2) \| D(8), C(9)]` |
| Place `A(5)` before `D(8)`. | `B(2)` | `A(5), D(8), C(9)` | `[B(2) \| A(5), D(8), C(9)]` |
| Finish with the remaining point. | empty | `B(2), A(5), D(8), C(9)` | `[ \| B(2), A(5), D(8), C(9)]` |

Figure 9.9 in the book illustrates the same shrinking-heap/growing-suffix idea with its own numeric example. The point cards and values in this table are **our** connected geometry study case.

<span id="part-4-space"></span>

### 3. What in-place means here

The variation reuses the input array for both the heap and the final sorted sequence, so it avoids a separate `n`-entry priority queue. The book calls this **in-place** because it needs only a small amount of memory beyond the input array. With iterative bubbling, the auxiliary space can be `O(1)`; reusing the **recursive** bubbling helpers shown earlier in Section 9.3 would use an `O(log n)` call stack.

The book describes this variant and its boundaries but does not give a complete code listing for it. Its time remains `O(n log n)` because heap repairs follow paths of logarithmic height across the sort.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does equal distance fix a point's output place?</strong></summary>

**Scenario:** Add `E = (-1, -1)` with key `(-1)² + (-1)² = 2` alongside `B = (1, 1)`, also key `2`.

**Problem:** Both are equally near `O`. The priority-queue ADT allows either tied minimum to be removed first, so a general priority-queue sort does not promise their original arrival order.

**Result:** Both appear before `A(5)`, `D(8)`, and `C(9)`, but `B` versus `E` needs an explicit tie rule if their relative order matters.

</details>

<details>
<summary><strong>Case Study 2: Why store a numeric squared-distance key?</strong></summary>

**Scenario:** Add `G = (0, 4)` with squared-distance key `16` alongside `D(8)`. Suppose their keys were stored as the strings `"16"` and `"8"`.

**Problem:** String comparison says `"16" < "8"` because the first character `"1"` precedes `"8"`. That would make farther `G` appear before nearer `D`. The book makes the same point with `"12"` and `"4"`.

**Fix:** Supply the numeric keys `16` and `8`; then `8 < 16`, so `D` is correctly sorted before `G`.

</details>

<details>
<summary><strong>Case Study 3: When is sorted-list insertion-sort quick?</strong></summary>

**Scenario:** Suppose the points arrive already ordered as `B(2), A(5), D(8), C(9)`.

**Result:** In the sorted-list priority queue, every new item belongs at the end. Each insertion needs only a constant amount of searching, so the complete sort takes `O(n)` time in this best case. The unsorted-list version still scans during every removal and takes `O(n²)` time for this implementation.

</details>

<details>
<summary><strong>Case Study 4: Why does the in-place version use a max-heap?</strong></summary>

**Scenario:** The final array must read `B(2), A(5), D(8), C(9)` from left to right. The in-place method fills final positions at the **right end** first.

**Reason:** The first point fixed at the far right must be `C(9)`, the farthest. A max-heap exposes `C` at its root. After placing `C`, the next maximum `D(8)` goes immediately to its left, and so on.

**Result:** The sorted suffix grows leftward while the remaining max-heap shrinks.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 9.4 idea | Plain-language meaning | Coordinate-grid example |
| :--- | :--- | :--- |
| **Priority-queue sort** | Insert all items, then repeatedly remove a minimum into the result. | `A, C, B, D` becomes `B, A, D, C`. |
| **Comparable key** | The queue needs a consistent way to rank entries. | Use numeric `x² + y²`, not a string representation. |
| **Selection-sort** | Cheap insertion into an unsorted queue; scan to select each minimum. | Repeatedly find `B`, then `A`, then `D`, then `C`; `O(n²)`. |
| **Insertion-sort** | Place each item into a sorted queue during insertion. | Insert `B` at the front and `D` between `A` and `C`; worst `O(n²)`, best `O(n)`. |
| **Heap-sort** | Use a heap to keep minimum removal efficient after each update. | Heap insertions and removals produce distance order in `O(n log n)`. |
| **Bottom-up build** | Build an initial heap in `O(n)` when all items are known. | Phase 2 still makes the whole heap sort `O(n log n)`. |
| **In-place heap-sort** | Reuse the array as a max-heap prefix and growing sorted suffix. | Move farthest `C` to the right, then `D`, `A`, and `B`. |
| **Tied keys** | A general priority queue need not preserve arrival order among equals. | `B(2)` and `E(2)` need a defined tie rule if order matters. |

[🔝 Back to Top](#top)
