<span id="top"></span>

# 9.3 Heaps — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.3, printed pages 370–384 (the supplied PDF).<br>
> **Topic:** 9.3 Heaps; 9.3.1 The Heap Data Structure; 9.3.2 Implementing a Priority Queue with a Heap; 9.3.3 Array-Based Representation of a Complete Binary Tree; 9.3.4 Python Heap Implementation; 9.3.5 Analysis of a Heap-Based Priority Queue; 9.3.6 Bottom-Up Heap Construction; 9.3.7 Python's `heapq` Module.<br>
> **Domain Focus:** Points on a coordinate grid, squared distance from the origin, and choosing the nearest waiting point.<br>
> **User Prompt:** Reexplain [`Section 9.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Nearest-Point Heap](#background)
   - [1. Reuse the coordinate-grid problem](#background-points)
   - [2. What the heap improves](#background-bridge)
2. [Part 1: 9.3 Heaps](#part-1)
   - [1. A tree with just enough order](#part-1-idea)
   - [2. Keep each point with its key](#part-1-item)
3. [Part 2: 9.3.1 The Heap Data Structure](#part-2)
   - [1. Heap order puts a minimum at the root](#part-2-order)
   - [2. Complete shape keeps the tree short](#part-2-shape)
   - [3. Why the height is logarithmic](#part-2-height)
4. [Part 3: 9.3.2 Implementing a Priority Queue with a Heap](#part-3)
   - [1. Add a point and bubble it upward](#part-3-add)
   - [2. Read the minimum without removal](#part-3-min)
   - [3. Remove the minimum and bubble downward](#part-3-remove)
5. [Part 4: 9.3.3 Array-Based Representation of a Complete Binary Tree](#part-4)
   - [1. Store tree positions in level order](#part-4-array)
   - [2. Find relatives with index arithmetic](#part-4-indexes)
6. [Part 5: 9.3.4 Python Heap Implementation](#part-5)
   - [1. Represent entries and tree positions](#part-5-data)
   - [2. Restore heap order with helper methods](#part-5-helpers)
   - [3. Connect helpers to the public operations](#part-5-methods)
7. [Part 6: 9.3.5 Analysis of a Heap-Based Priority Queue](#part-6)
   - [1. Count work along one tree path](#part-6-costs)
   - [2. Compare the three implementations](#part-6-compare)
8. [Part 7: 9.3.6 Bottom-Up Heap Construction](#part-7)
   - [1. Build when all points are known](#part-7-build)
   - [2. Heapify our four points](#part-7-trace)
   - [3. Why bottom-up construction is linear](#part-7-linear)
9. [Part 8: 9.3.7 Python's `heapq` Module](#part-8)
   - [1. Use a list as a heap](#part-8-api)
   - [2. Run the point example with `heapq`](#part-8-example)
   - [3. Distinguish push-then-pop from replace](#part-8-combined)
10. [Part 9: Simple Geometry Study Cases](#part-9)
11. [Part 10: Summary](#part-10)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Nearest-Point Heap

<span id="background-points"></span>

### 1. Reuse the coordinate-grid problem

The [Section 9.1 guide](09-01-the-priority-queue-abstract-data-type.md) asks us to process the point nearest to the origin `O = (0, 0)` first. The [Section 9.2 guide](09-02-implementing-a-priority-queue.md) stores the waiting points in either an unsorted or a sorted positional list. We keep the same four points here, adding all of them before the first removal.

For a point `(x, y)`, its **squared distance** from `O` is `d² = x² + y²`. The smallest `d²` belongs to the nearest point, so this number is our priority key.

| Arrival | Point | Key calculation | Key |
| ---: | :--- | :--- | ---: |
| 1st | `A = (1, 2)` | `1² + 2²` | 5 |
| 2nd | `C = (0, 3)` | `0² + 3²` | 9 |
| 3rd | `B = (1, 1)` | `1² + 1²` | 2 |
| 4th | `D = (2, 2)` | `2² + 2²` | 8 |

Our expected removal order, if no new points arrive, is **`B(2), A(5), D(8), C(9)`**. The number in parentheses is the point's fixed priority key.

<span id="background-bridge"></span>

### 2. What the heap improves

An unsorted list makes `add` fast but searches for the minimum. A sorted list keeps the minimum at the front but searches during insertion. A **heap** keeps only enough order to put a minimum at its **root**, while its complete tree shape keeps paths short.

After our four insertions, one valid heap looks like this:

```text
         B(2)
        /    \
     D(8)    A(5)
     /
   C(9)
```

`B` is nearest to `O`. `D(8)` and `A(5)` are siblings; the heap does **not** require the smaller sibling to appear on the left. It requires each **parent** to have a key no greater than its children. The fourth node `C` occupies the next open place, the left child of `D`, so the shape stays complete.

> **Mental model:** A heap keeps the nearest point at the root. Other points need only be ordered relative to their parents, leaving much less to rearrange after an insertion or removal.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 9.3 Heaps

<span id="part-1-idea"></span>

### 1. A tree with just enough order

Section 9.3 introduces the **heap data structure** to implement the same priority-queue ADT from Section 9.1. The book's heap is a *min-heap*: the entry with a minimum key is at the root. Two rules make that possible:

1. **Heap order:** every parent key is less than or equal to each child key.
2. **Complete shape:** levels fill from top to bottom, and the last level fills from left to right.

Together, those rules support `min()` in `O(1)` time and insertion and minimum removal in `O(log n)` time for `n` entries, subject to the array-resizing detail in Part 6. This use of *heap* names a tree data structure; it is separate from the term *heap memory* in memory management.

<span id="part-1-item"></span>

### 2. Keep each point with its key

As in Section 9.2, each stored item pairs a **key** with a **value**. For `B`, the key is `2` and the value can be its label `"B"`. When two heap locations exchange items, the **whole item** moves. Swapping only the keys would give a point another point's distance.

The priority queue still returns `(key, value)` pairs. For unique keys in this example, `min()` gives `(2, "B")` without removing it, and `remove_min()` returns and removes `(2, "B")`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 9.3.1 The Heap Data Structure

<span id="part-2-order"></span>

### 1. Heap order puts a minimum at the root

For every entry except the root, its key must be **at least its parent's key**. In our small heap, `2 ≤ 8`, `2 ≤ 5`, and `8 ≤ 9`. Following any branch downward never decreases the key. Therefore no descendant can have a key smaller than the root's key, and the root holds a minimum.

```text
root → left → left:   B(2) → D(8) → C(9)
root → right:         B(2) → A(5)
```

The heap rule gives **partial order**. It says nothing about the order between `D(8)` and its sibling `A(5)` or between entries in different branches. The heap is neither a fully sorted sequence nor a binary search tree. Figure 9.1 in the book illustrates these same rules with a larger, 13-entry heap.

<span id="part-2-shape"></span>

### 2. Complete shape keeps the tree short

A **complete binary tree** has every level before the last completely filled. The last level has no gaps before its rightmost occupied position. Our four-entry heap has one root, two entries on the next level, and `C` in the leftmost place of the third level:

| Level | Capacity | Our occupied positions |
| ---: | ---: | :--- |
| 0 | 1 | `B` |
| 1 | 2 | `D`, `A` |
| 2 | 4 | `C` in the first position |

Adding a fifth point first creates the **right child of `D`**, the next open position. Its key may then move upward, but the tree's positions still keep the complete shape. The last occupied position is always the rightmost occupied place on the bottom level.

<span id="part-2-height"></span>

### 3. Why the height is logarithmic

The **height** `h` counts edges from the root down to a deepest leaf. A complete binary tree with `n ≥ 1` entries satisfies

```text
2^h ≤ n ≤ 2^(h+1) − 1, so h = floor(log₂ n).
```

The left bound counts all nodes needed to reach level `h`: the full levels above it plus at least one node on it. The right bound is the capacity through level `h`. For our four points, `4 ≤ 4 ≤ 7`, so `h = 2`. Doubling the number of entries adds **at most about one level**, which limits the number of parent-child steps in later algorithms. This is Proposition 9.2 in the book.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 9.3.2 Implementing a Priority Queue with a Heap

<span id="part-3-add"></span>

### 1. Add a point and bubble it upward

To add `(k, v)`, first put its item in the **next open position** of the complete tree. This preserves shape. If its key is smaller than its parent's key, swap the two whole items. Repeat until the new item reaches a parent with a key no greater than its own, or reaches the root. This repair is called **up-heap bubbling**.

The following lists show entries in **level order** (root first, then each level left to right). Part 4 explains the array indexes for this order.

| Add | Before repair | After up-heap repair | Why |
| :--- | :--- | :--- | :--- |
| `A(5)` | `[A(5)]` | `[A(5)]` | It is the root. |
| `C(9)` | `[A(5), C(9)]` | `[A(5), C(9)]` | `9 ≥ 5`. |
| `B(2)` | `[A(5), C(9), B(2)]` | `[B(2), C(9), A(5)]` | Swap `B` above `A`. |
| `D(8)` | `[B(2), C(9), A(5), D(8)]` | `[B(2), D(8), A(5), C(9)]` | Swap `D` above `C`. |

Each swap moves the new item **one level up**. A heap of height `h` permits at most `h` such swaps, so adding an item takes `O(log n)` comparison-and-swap work. The book's Figure 9.2 shows a larger insertion with three upward swaps.

<span id="part-3-min"></span>

### 2. Read the minimum without removal

`min()` reads the root item. For our four-point heap it returns `(2, "B")`. It does not change the tree, so another `min()` still returns `B` unless another operation changes the heap. This is `O(1)` work because the root is directly available.

<span id="part-3-remove"></span>

### 3. Remove the minimum and bubble downward

To remove the minimum, save the root item for the return value. Move the item from the **last occupied position** to the root, then remove that last position. This keeps the complete shape. The replacement root may be too large, so compare its children and swap with the **smaller-key child** when that child has a smaller key. Repeat downward until heap order is restored. This repair is **down-heap bubbling**.

Starting from `[B(2), D(8), A(5), C(9)]`:

| Step | Level-order entries | Explanation |
| :--- | :--- | :--- |
| Save and remove `B(2)`; move last `C(9)` to root. | `[C(9), D(8), A(5)]` | Shape remains complete. |
| Compare root's children `D(8)` and `A(5)`. | `[C(9), D(8), A(5)]` | `A(5)` is the smaller child. |
| Swap `C(9)` with `A(5)`. | `[A(5), D(8), C(9)]` | Both parent-child comparisons now satisfy heap order. |

The operation returns the **saved** pair `(2, "B")`. Choosing `D(8)` instead would leave `A(5)` below a root of `8`, violating heap order. If a position has only one child, that child is the candidate. Down-heap takes at most one root-to-leaf path, or `O(log n)` comparison-and-swap work. Figure 9.3 in the book traces a larger removal and three downward swaps.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 9.3.3 Array-Based Representation of a Complete Binary Tree

<span id="part-4-array"></span>

### 1. Store tree positions in level order

Completeness lets us represent the heap with a Python list. Put the root at index `0`, then store each level from left to right. No explicit parent or child pointers are needed. Our heap after four insertions is:

| List index | 0 | 1 | 2 | 3 |
| ---: | :--- | :--- | :--- | :--- |
| Item | `B(2)` | `D(8)` | `A(5)` | `C(9)` |

The occupied indexes are always `0` through `n − 1`; the last tree position is index `n − 1`. Appending at the end creates the next open position, and popping from the end removes the last position. Figure 9.4 in the book shows the array for its 13-entry heap.

The array is a **heap**, not a globally sorted array. `D(8)` appears before `A(5)` even though `8 > 5`. The guarantee is that index `0` has a minimum and each parent has a key no greater than its children.

<span id="part-4-indexes"></span>

### 2. Find relatives with index arithmetic

For an item at index `j`, the complete-tree layout gives these formulas:

| Relative | Index formula | Valid when |
| :--- | :--- | :--- |
| Parent | `(j − 1) // 2` | `j > 0` |
| Left child | `2j + 1` | Result is `< n` |
| Right child | `2j + 2` | Result is `< n` |

For example, `D(8)` is at index `1`. Its parent is `(1 − 1) // 2 = 0`, which holds `B(2)`. Its left child is `2(1) + 1 = 3`, which holds `C(9)`. Its right-child index would be `4`, outside the four-item list, so it has no right child yet. Code Fragment 9.4 turns these formulas into helper methods.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 9.3.4 Python Heap Implementation

<span id="part-5-data"></span>

### 1. Represent entries and tree positions

Code Fragments 9.4 and 9.5 define `HeapPriorityQueue(PriorityQueueBase)`. It reuses the base class's `_Item`, which pairs a key with a value and compares items by key. Its `_data` is a Python **list of `_Item` objects**. In the heap methods, a variable such as `j` is a **list index**, not a `PositionalList` position from Section 9.2.

The constructor starts with an empty list. `__len__` returns `len(self._data)`, and the inherited `is_empty()` checks whether that length is zero. These operations do not need to walk the tree.

<span id="part-5-helpers"></span>

### 2. Restore heap order with helper methods

The class turns the formulas from Part 4 into `_parent(j)`, `_left(j)`, and `_right(j)`. `_has_left(j)` and `_has_right(j)` check whether those indexes are within the list. `_swap(i, j)` exchanges **whole `_Item` objects** at two indexes.

| Helper | Work it performs | Four-point example |
| :--- | :--- | :--- |
| `_upheap(j)` | Compare item `j` with its parent; swap upward while smaller. | Newly added `D(8)` swaps with `C(9)`. |
| `_downheap(j)` | Choose the smaller child; swap downward while that child is smaller. | After removing `B`, `C(9)` swaps with `A(5)`. |

The book implements these bubbling helpers recursively: after a swap, the helper calls itself at the item's new index. Each call moves one level, so the recursion has at most the heap's height in levels. When two children have equal keys, the book's `_downheap` selects the left one; the priority-queue ADT itself does not specify how equal keys are handled.

<span id="part-5-methods"></span>

### 3. Connect helpers to the public operations

| Public operation | Main steps in the book's `HeapPriorityQueue` |
| :--- | :--- |
| `add(k, v)` | Append `_Item(k, v)` to `_data`, then `_upheap` the last index. |
| `min()` | If empty, raise `Empty`; otherwise return the root item's `(key, value)` without removing it. |
| `remove_min()` | If empty, raise `Empty`; otherwise swap root with last, pop and save the old root, `_downheap` the replacement root, and return the saved pair. |

For a one-item heap, `remove_min()` swaps index `0` with itself, pops that item, and leaves an empty list; there is no child to bubble down. For our four-point heap, the steps produce `[A(5), D(8), C(9)]` after removing `B`.

The implementation's private helpers enforce **heap order**. Appending and popping at the **end** enforce the complete-tree shape. The public methods together satisfy the ADT behavior from Section 9.1.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 9.3.5 Analysis of a Heap-Based Priority Queue

<span id="part-6-costs"></span>

### 1. Count work along one tree path

Table 9.3 in the book gives these bounds for `n` entries, assuming each key comparison takes `O(1)` time:

| Operation | Heap cost | Why |
| :--- | ---: | :--- |
| `len(P)` | `O(1)` | Read the list length. |
| `P.is_empty()` | `O(1)` | Compare the length with zero. |
| `P.min()` | `O(1)` | Read index `0`. |
| `P.add(k, v)` | `O(log n)` amortized | Append, then bubble up at most the tree height. |
| `P.remove_min()` | `O(log n)` amortized | Remove at the end, then bubble down at most the tree height. |
| Space | `O(n)` | Store one item per entry. |

An up-heap or down-heap follows **one path**, whose length is at most `floor(log₂ n)`. The word **amortized** accounts for occasional resizing of Python's underlying array when appending or popping. A single resize can take longer; across a sequence of operations, the stated `O(log n)` bounds hold on average per operation in the amortized sense. `min()` only reads the root, so its `O(1)` bound does not depend on resizing. The book notes that a linked-tree representation can give worst-case logarithmic update bounds.

<span id="part-6-compare"></span>

### 2. Compare the three implementations

For the same point entries, the list choices from Section 9.2 and this heap have different operation costs:

| Implementation | `add` | `min` | `remove_min` |
| :--- | ---: | ---: | ---: |
| Unsorted positional list | `O(1)` | `O(n)` | `O(n)` |
| Sorted positional list | `O(n)` | `O(1)` | `O(1)` |
| Array-based heap | `O(log n)` amortized | `O(1)` | `O(log n)` amortized |

The heap keeps the minimum directly available while limiting updates to a short root-to-leaf path. All three use `O(n)` space. Their different layouts do **not** change which of our distinct-key points is nearest.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: 9.3.6 Bottom-Up Heap Construction

<span id="part-7-build"></span>

### 1. Build when all points are known

If entries arrive one at a time, we can repeatedly call `add`. For `n` entries, the worst-case total is `O(n log n)`. If **all entries are known in advance**, we can put them into an array in any order and repair the array **bottom-up** in `O(n)` time. Code Fragment 9.6 adds a constructor that accepts an iterable of `(key, value)` pairs and calls `_heapify()` when needed.

Leaves already satisfy heap order because they have no children. Start at the **last internal node**, the parent of index `n − 1`, and call `_downheap` on each internal index from right to left back to index `0`. Each node's child subtrees are heaps by the time that node is repaired.

```text
last internal index = (n − 2) // 2, for n ≥ 2
downheap(last internal), downheap(previous), ..., downheap(0)
```

This construction is shown with 15 entries in Figure 9.5 of the book. It produces a heap, not a fully sorted array.

<span id="part-7-trace"></span>

### 2. Heapify our four points

Suppose we receive the four entries together in arrival order. The raw level-order array is `[A(5), C(9), B(2), D(8)]`. It is **not yet a heap**, because root `A(5)` has child `B(2)` with a smaller key.

For `n = 4`, the last internal index is `(4 − 2) // 2 = 1`. Indexes `2` and `3` are leaves and need no repair.

| Repair | Before | Action | After |
| :--- | :--- | :--- | :--- |
| `_downheap(1)` | `[A(5), C(9), B(2), D(8)]` | Swap `C(9)` with its child `D(8)`. | `[A(5), D(8), B(2), C(9)]` |
| `_downheap(0)` | `[A(5), D(8), B(2), C(9)]` | Choose smaller child `B(2)` and swap with `A(5)`. | `[B(2), D(8), A(5), C(9)]` |

The final heap has the same contents and minimum as the incremental heap in Part 3. These particular four entries even reach the same array layout; a heap's internal layout is generally **not unique**.

<span id="part-7-linear"></span>

### 3. Why bottom-up construction is linear

It may seem that calling an `O(log n)` helper for many nodes must cost `O(n log n)`. Most nodes are near the bottom, however: about half are leaves and do no work, about a quarter can move at most one level, about an eighth at most two levels, and so on. Only a few nodes near the root can move far.

```text
total downward steps are bounded by roughly
n × (1/4 + 2/8 + 3/16 + ···) = O(n).
```

The parenthesized series stays below a constant. Proposition 9.3 gives a formal `O(n)` proof; Figure 9.6 visualizes it with paths whose edges do not overlap. Building the heap in `O(n)` time does not make **removing all points in sorted order** linear: each later `remove_min()` may still travel a logarithmic path.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: 9.3.7 Python's `heapq` Module

<span id="part-8-api"></span>

### 1. Use a list as a heap

Python's [`heapq` module](https://docs.python.org/3/library/heapq.html) provides **functions that maintain a heap in an ordinary list**. Section 9.3.7 describes these functions. The module treats each list element as the object to compare; it does not itself create the book's separate key–value `_Item` class.

| Function | What it does | Time stated in Section 9.3.7 |
| :--- | :--- | :--- |
| `heapq.heappush(L, e)` | Insert `e` into an existing heap. | `O(log n)` |
| `heapq.heappop(L)` | Remove and return its minimum. | `O(log n)` |
| `heapq.heappushpop(L, e)` | Push `e`, then return the minimum; `e` itself may be returned. | `O(log n)` |
| `heapq.heapreplace(L, e)` | Remove the old minimum, then insert `e`; requires a nonempty heap. | `O(log n)` |
| `heapq.heapify(L)` | Rearrange an unordered list into a heap in place. | `O(n)` |
| `heapq.nsmallest(k, items)` / `nlargest(k, items)` | Select the `k` smallest / largest items. | A possible `O(n + k log n)` implementation. |

For the last row, `n` is the number of input items. The book says either selection task **can be implemented** in `O(n + k log n)` time; it does not promise that bound for every version of the library functions. The `O(log n)` push/pop bounds count ordinary heap work; Python-list resizing gives `heappush` and `heappop` the same amortized qualification discussed in Part 6.

The book's `HeapPriorityQueue.min()` corresponds to reading `L[0]` after checking that `L` is nonempty. `heapq.heappop` raises `IndexError` on an empty list, whereas the book's priority-queue class raises its `Empty` exception. `heapq` functions expect the list to keep its heap invariant between calls.

<span id="part-8-example"></span>

### 2. Run the point example with `heapq`

To carry a geometry key together with a point label, we can put a `(key, label)` tuple into the list. Here is a complete, runnable version of our four insertions:

```python
import heapq

points = [("A", 1, 2), ("C", 0, 3), ("B", 1, 1), ("D", 2, 2)]
waiting = []

for label, x, y in points:
    heapq.heappush(waiting, (x * x + y * y, label))

print(waiting[0])                 # (2, 'B'): inspect, do not remove
print(heapq.heappop(waiting))    # (2, 'B'): remove and return
```

Python compares tuples from left to right. With our distinct distance keys, the labels do not affect the order. If two keys tie, a `(key, label)` tuple also compares the labels, adding an **alphabetical tie rule** that the book's key-only `_Item` and the priority-queue ADT do not require. Use a deliberate tie rule when an application needs one.

<span id="part-8-combined"></span>

### 3. Distinguish push-then-pop from replace

Start each operation below with a separate copy of the four-point heap whose minimum is `B(2)`. Let `F = (0, 1)` be a new point with key `1`.

| Operation | Returned point | Waiting afterward | Why |
| :--- | :--- | :--- | :--- |
| `heappushpop(L, (1, "F"))` | `F(1)` | Original four points remain. | Add `F`, then take the new minimum, which is `F`. |
| `heapreplace(L, (1, "F"))` | `B(2)` | `F` replaces `B`; four points remain. | Take the **old** minimum before adding `F`. |

The two calls both combine insertion and removal, but they answer different questions. `heapreplace` requires an existing item to remove. The [Python documentation](https://docs.python.org/3/library/heapq.html) makes this distinction explicit.

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why is the heap array not fully sorted?</strong></summary>

**Scenario:** After adding `A`, `C`, `B`, and `D`, the heap array is `[B(2), D(8), A(5), C(9)]`. The second key, `8`, is greater than the third key, `5`.

**Question:** Is this a broken heap?

**Result:** No. `D(8)` and `A(5)` are siblings, so their relative order is unrestricted. The required comparisons are parent to child: `2 ≤ 8`, `2 ≤ 5`, and `8 ≤ 9`. The root still has the minimum key.

</details>

<details>
<summary><strong>Case Study 2: A new nearest point bubbles to the root</strong></summary>

**Scenario:** With all four original points still waiting, add `F = (0, 1)` with key `1`.

**Step 1:** Append `F(1)` at index `4`: `[B(2), D(8), A(5), C(9), F(1)]`. Its parent is index `(4 − 1) // 2 = 1`, holding `D(8)`.

**Step 2:** Swap `F` with `D`: `[B(2), F(1), A(5), C(9), D(8)]`. Now compare `F` with its parent `B(2)` at index `0`.

**Result:** Swap once more to get `[F(1), B(2), A(5), C(9), D(8)]`. The point nearest to `O` is again at the root, and the tree still has complete shape.

</details>

<details>
<summary><strong>Case Study 3: Why choose the smaller child during down-heap?</strong></summary>

**Scenario:** Removing root `B(2)` moves last item `C(9)` to the root. Its children are `D(8)` and `A(5)`.

**Problem:** Swapping `C` with `D(8)` would make `D(8)` the root while `A(5)` remained its child. The new root would violate heap order.

**Fix:** Choose the smaller child `A(5)` and swap with it. The heap becomes `[A(5), D(8), C(9)]`.

</details>

<details>
<summary><strong>Case Study 4: Can raw arrival order be read as a heap?</strong></summary>

**Scenario:** We put the four point entries straight into `[A(5), C(9), B(2), D(8)]` and read index `0` as if it were a heap.

**Problem:** Index `0` gives `A(5)`, while `B(2)` is nearer. The raw array violates heap order.

**Fix:** Use repeated heap insertions or bottom-up `heapify` before reading the minimum. Bottom-up repair gives `[B(2), D(8), A(5), C(9)]` for these entries.

</details>

<details>
<summary><strong>Case Study 5: What happens when two points are equally near?</strong></summary>

**Scenario:** With the original four points waiting, add `E = (-1, -1)` with key `2` while `B(2)` is still in the heap.

**Result:** `B` and `E` share the minimum key among these five points. The priority-queue ADT permits either tied entry to be returned. The book's `_Item` compares **keys only**. A `heapq` list of `(key, label)` tuples also compares the labels when keys tie, so that tuple representation adds a separate label-based rule.

</details>

[🔝 Back to Top](#top)

---

<span id="part-10"></span>

## Part 10: Summary

| Section 9.3 idea | Plain-language meaning | Coordinate-grid example |
| :--- | :--- | :--- |
| **Heap order** | Every parent key is no greater than each child key. | Root `B(2)` is nearest, though `D(8)` appears before `A(5)` in the array. |
| **Complete shape** | Fill levels top to bottom and the last level left to right. | Fourth point occupies index `3`, the left child of index `1`. |
| **Heap height** | A complete tree with `n` items has height `floor(log₂ n)`. | Four points make a tree of height `2`. |
| **Up-heap** | Repair order by moving a newly added small item upward. | Adding `F(1)` takes two swaps to reach the root. |
| **Down-heap** | Repair order by moving a replacement root toward its smaller child. | After removing `B`, `C(9)` swaps with `A(5)`. |
| **Array indexes** | Compute parent and children from integer indexes. | Index `1` has left child `3`. |
| **Operation costs** | Read minimum in `O(1)`; add and remove minimum in `O(log n)` amortized. | Find `B` at index `0`; updates follow short paths. |
| **Bottom-up build** | Repair internal nodes from the bottom to build a heap in `O(n)`. | Raw `[A,C,B,D]` becomes a heap without four separate insertions. |
| **`heapq`** | Python functions maintain a heap in a list; each element is compared as a value. | Push `(2, "B")` to carry a distance key and label together. |

[🔝 Back to Top](#top)
