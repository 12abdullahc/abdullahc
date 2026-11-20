<span id="top"></span>

# Priority Queues — Section 9.3: Heaps

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.3 (printed pages 370–384).  
> **Topic:** The heap data structure, heap-based priority queues, array representation, bottom-up construction, and Python's `heapq`.  
> **Domain focus:** MotoGP Q2 qualifying at the 2026 French Grand Prix, Le Mans, on 9 May 2026.  
> **Learning goal:** Trace heap insertion, removal, and construction; connect the tree to array indexes and operation costs.  
> **User Prompt:** "Reexplain [Section 9.3] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Fastest Lap at the Root](#background-intuition)
   - [1. One verified Q2 session](#background-session)
   - [2. The heap's two rules](#background-rules)
2. [Part 1: Section 9.3 — Why Use a Heap?](#part-1)
3. [Part 2: Section 9.3.1 — The Heap Data Structure](#part-2)
   - [1. Heap order gives a minimum root](#part-2-order)
   - [2. Complete shape keeps paths short](#part-2-shape)
4. [Part 3: Section 9.3.2 — Implementing a Priority Queue with a Heap](#part-3)
   - [1. Add and bubble upward](#part-3-add)
   - [2. Inspect and remove the minimum](#part-3-remove)
5. [Part 4: Section 9.3.3 — Array-Based Representation](#part-4)
   - [1. Store the complete tree in level order](#part-4-array)
   - [2. Calculate parent and child indexes](#part-4-indexes)
6. [Part 5: Section 9.3.4 — Python Heap Implementation](#part-5)
   - [1. Connect the private helpers to the public ADT](#part-5-helpers)
   - [2. Run a complete heap priority queue](#part-5-program)
7. [Part 6: Section 9.3.5 — Analysis of a Heap-Based Priority Queue](#part-6)
8. [Part 7: Section 9.3.6 — Bottom-Up Heap Construction](#part-7)
   - [1. Repair an unordered array from the bottom](#part-7-trace)
   - [2. Explain the linear-time result](#part-7-cost)
9. [Part 8: Section 9.3.7 — Python's `heapq` Module](#part-8)
   - [1. Match the module's operations to the ADT](#part-8-api)
   - [2. Distinguish push-then-pop from replace](#part-8-combined)
   - [3. Handle equal keys deliberately](#part-8-ties)
10. [Part 9: Summary](#part-9)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Fastest Lap at the Root

<span id="background-session"></span>

### 1. One Verified Q2 Session

We will use selected best-lap records from **MotoGP Q2 qualifying at the 2026 French Grand Prix**, held at Le Mans on Saturday, 9 May. The rider, team, position, and lap-time facts below come from the [official MotoGP timing sheet](https://resources.motogp.com/files/results/2026/FRA/MotoGP/Q2/Classification.pdf); the [official session report](https://www.motogp.com/en/news/2026/05/07/motogp-q2-bagnaia-de-retour-aux-affaires/1064614) confirms the session and front-row riders.

| Q2 place | Rider | Team | Best lap | Key in milliseconds |
| ---: | :--- | :--- | ---: | ---: |
| 1 | Francesco Bagnaia | Ducati Lenovo Team | `1:29.634` | `89_634` |
| 2 | Marc Márquez | Ducati Lenovo Team | `1:29.646` | `89_646` |
| 3 | Marco Bezzecchi | Aprilia Racing | `1:29.657` | `89_657` |
| 5 | Pedro Acosta | Red Bull KTM Factory Racing | `1:29.817` | `89_817` |
| 6 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | `1:29.831` | `89_831` |

A lap such as Marc's `1:29.646` becomes `1 × 60_000 + 29 × 1_000 + 646 = 89_646` milliseconds. **Smaller key means faster lap.** The underscores in Python integer literals are visual separators: `89_646` and `89646` are the same integer. Using one session and one unit makes every comparison meaningful.

The teaching insertion order throughout this guide is **Marc, Bezzecchi, Pedro, Bagnaia, Fabio**. It was chosen to reveal the heap operations. It is not a claim about when these laps were set or how MotoGP's timing system stores them.

**Why this example?** Marc and Fabio provide a familiar comparison; Bagnaia supplies a new minimum after several entries already wait. **How to solve it:** convert each official time to milliseconds, keep its rider/team record with the key, and request the smallest key.

<span id="background-rules"></span>

### 2. The Heap's Two Rules

A **min-heap** is a binary tree that follows two rules:

1. **Heap order:** every parent's key is less than or equal to each child's key.
2. **Complete shape:** fill every level except possibly the last; fill the last level from left to right without gaps.

After adding our five records, one valid heap is:

```text
                  Bagnaia (89,634)
                 /                \
     Marc (89,646)              Pedro (89,817)
       /        \
Bezzecchi     Fabio
 (89,657)    (89,831)
```

Bagnaia is at the root because his key is smallest. The tree does **not** require every level to be sorted from left to right: Pedro's `89_817` is shown before Bezzecchi's smaller `89_657`, yet each parent-child comparison is valid. The last level fills the left child of Marc before the right child.

**Why this example?** It shows the two independent invariants: priority controls parent-child order, while completeness controls positions. **How to solve it:** check every parent against its children, then check that occupied positions fill levels left to right.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 9.3 — Why Use a Heap?

The [Section 9.1 guide](09-01-the-priority-queue-abstract-data-type.md) defined what a priority queue returns. The [Section 9.2 guide](09-02-implementing-a-priority-queue.md) compared two linked-list implementations: unsorted storage makes `add` fast but scans for the minimum; sorted storage pays during `add` but keeps the minimum at the front. A heap keeps the minimum at its root while repairing order along a **single short tree path** after an update.

| Representation | `add` | `min` | `remove_min` |
| :--- | ---: | ---: | ---: |
| Unsorted positional list | `O(1)` | `O(n)` | `O(n)` |
| Sorted positional list | `O(n)` | `O(1)` | `O(1)` |
| Array-based heap | `O(log n)` amortized | `O(1)` | `O(log n)` amortized |

Here `n` is the number of waiting entries. The heap only promises parent-child order; it does not pay to sort every pair of riders. This use of *heap* means a tree data structure, separate from the term *heap memory* in memory management.

**Why this example?** The same Q2 records let us compare the cost of different storage choices without changing the priority rule. **How to solve it:** ask which operation repeats most often, then use the operation costs while remembering that all three must return a minimum key.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 9.3.1 — The Heap Data Structure

<span id="part-2-order"></span>

### 1. Heap Order Gives a Minimum Root

For every nonroot node, its parent's key is no larger than its own. In our heap:

```text
89,634 ≤ 89,646       Bagnaia above Marc
89,634 ≤ 89,817       Bagnaia above Pedro
89,646 ≤ 89,657       Marc above Bezzecchi
89,646 ≤ 89,831       Marc above Fabio
```

Following any branch downward can never reveal a key below the root's key. Therefore `min()` can read the root directly. Heap order is a **partial order**: it does not compare Pedro with Bezzecchi because neither is the other's parent. A heap is not a fully sorted array or a binary search tree. Figure 9.1 in the book illustrates the same rule with a larger heap.

**Why this example?** The parent-child checks explain why Bagnaia must be a valid minimum even though the rest of the tree is not sorted. **How to solve it:** check each edge from parent to child; do not demand an order between unrelated nodes.

<span id="part-2-shape"></span>

### 2. Complete Shape Keeps Paths Short

A complete binary tree fills levels in this order:

| Level | Possible positions | Occupied positions in our heap |
| ---: | ---: | :--- |
| 0 | 1 | Bagnaia |
| 1 | 2 | Marc, Pedro |
| 2 | 4 | Bezzecchi, Fabio, then two empty positions |

The next insertion occupies the **third** position on level 2, the left child of Pedro. It may then swap **items** upward, but the position layout stays complete. We must swap each entire key–value item; swapping keys alone would attach a rider to somebody else's lap time.

A complete tree with `n ≥ 1` entries has height `h = floor(log₂ n)`, where height counts edges from root to a deepest leaf. Proposition 9.2 follows from `2^h ≤ n ≤ 2^(h+1) − 1`. For `n = 5`, `4 ≤ 5 ≤ 7`, so `h = 2`. A new item or a replacement root can traverse at most those two edges in our example.

**Why this example?** Five records are enough to show an incomplete last level and a two-edge path. **How to solve it:** fill the next open level-order position, then count levels to bound the possible upward or downward swaps.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 9.3.2 — Implementing a Priority Queue with a Heap

<span id="part-3-add"></span>

### 1. Add and Bubble Upward

To add a `(key, value)` entry, first put it at the **next open position**. That preserves complete shape. If its key is smaller than its parent's, swap the **whole items**. Continue until the parent is no larger or the new item reaches the root. This repair is called **up-heap bubbling**.

The arrays below list heap entries in **level order**: root, then each level left to right. Part 4 explains why array indexes match tree positions.

| Teaching insertion | Array after appending, before repair | Array after up-heap |
| :--- | :--- | :--- |
| Marc `89_646` | `[Marc]` | `[Marc]` |
| Bezzecchi `89_657` | `[Marc, Bezzecchi]` | `[Marc, Bezzecchi]` |
| Pedro `89_817` | `[Marc, Bezzecchi, Pedro]` | `[Marc, Bezzecchi, Pedro]` |
| Bagnaia `89_634` | `[Marc, Bezzecchi, Pedro, Bagnaia]` | `[Bagnaia, Marc, Pedro, Bezzecchi]` |
| Fabio `89_831` | `[Bagnaia, Marc, Pedro, Bezzecchi, Fabio]` | Same: Fabio is not smaller than Marc. |

Bagnaia is first appended as Bezzecchi's left child. Since `89_634 < 89_657`, those items swap. Bagnaia is then Marc's child; since `89_634 < 89_646`, they swap again. He reaches the root after **two** upward swaps. Figure 9.2 in the book demonstrates up-heap on a larger tree.

Each swap moves at most one level, so the number of comparisons and swaps is `O(log n)`. The exact array order among other riders is not the objective; restoring both heap rules is.

**Why this example?** Bagnaia's later insertion demonstrates a two-level repair, while Fabio's larger key demonstrates a no-swap insertion. **How to solve it:** append at the next open position, compare with the parent, and swap upward only while the new key is smaller.

<span id="part-3-remove"></span>

### 2. Inspect and Remove the Minimum

`min()` reads Bagnaia's root entry and **does not remove it**. To implement `remove_min()`, save the root for the return value, swap its item with the **last occupied** item's position, pop the old root from the end, and repair the new root by **down-heap bubbling**. At each step, choose the smaller-key child; swap with that child only if it is smaller than the current item.

Starting from `[Bagnaia, Marc, Pedro, Bezzecchi, Fabio]`:

| Step | Level-order array | Reason |
| :--- | :--- | :--- |
| Swap root Bagnaia with last Fabio; pop Bagnaia. | `[Fabio, Marc, Pedro, Bezzecchi]` | The complete shape is preserved. |
| Compare Marc `89_646` with Pedro `89_817`; swap Fabio with Marc. | `[Marc, Fabio, Pedro, Bezzecchi]` | Marc is the smaller child. |
| Fabio now has only Bezzecchi as a child; swap with Bezzecchi. | `[Marc, Bezzecchi, Pedro, Fabio]` | `89_657 < 89_831`. |

The operation **returns Bagnaia's saved `(key, value)` pair**. The new root is Marc. Swapping Fabio with Pedro at the first step would put Pedro above the faster Marc and break heap order. If two children have equal keys, either is a valid smaller-child choice under the ADT. Figure 9.3 in the book follows a larger downward repair.

**Why this example?** It shows both the choice between two children and the case where only a left child remains. **How to solve it:** move the last item to the root, repeatedly choose the smaller existing child, and stop when the current key is no greater than that child or there are no children. At most one root-to-leaf path is followed, so the repair is `O(log n)`.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 9.3.3 — Array-Based Representation

<span id="part-4-array"></span>

### 1. Store the Complete Tree in Level Order

A complete shape needs no explicit tree links. Store the root at index `0`, then the next level from left to right, then the next. After our five insertions:

| Index | 0 | 1 | 2 | 3 | 4 |
| ---: | :--- | :--- | :--- | :--- | :--- |
| Item | Bagnaia `89_634` | Marc `89_646` | Pedro `89_817` | Bezzecchi `89_657` | Fabio `89_831` |

The occupied indexes are always `0` through `n - 1`; the last tree position is index `n - 1`. `append` creates the next open position and `pop` at the end removes the last one. Figure 9.4 maps the book's larger heap to an array.

Notice that index `2` holds Pedro's `89_817`, while index `3` holds Bezzecchi's smaller `89_657`. This **does not** violate heap order: Pedro and Bezzecchi have different parents. The array is a heap, not a sorted list.

**Why this example?** It prevents a common mistake: treating the whole array as sorted just because index `0` is minimal. **How to solve it:** interpret each index as a tree position and check only parent-child comparisons.

<span id="part-4-indexes"></span>

### 2. Calculate Parent and Child Indexes

For an entry at index `j` in a heap of length `n`:

| Relative | Formula | When it exists |
| :--- | :--- | :--- |
| Parent | `(j - 1) // 2` | `j > 0` |
| Left child | `2*j + 1` | Index `< n` |
| Right child | `2*j + 2` | Index `< n` |

Marc is at index `1`. His parent is `(1 - 1) // 2 = 0` (Bagnaia), his left child is `2*1 + 1 = 3` (Bezzecchi), and his right child is `2*1 + 2 = 4` (Fabio). Pedro is at index `2`; his left-child index would be `5`, beyond the array, so he is a leaf.

Bagnaia was appended at index `3`, whose parent is `(3 - 1) // 2 = 1`. After one swap, his new index was `1`, whose parent is `0`. Those formulas explain both upward swaps without drawing a new tree each time.

**Why this example?** The same index arithmetic drives the book's private `_parent`, `_left`, and `_right` helpers. **How to solve it:** compute candidate indexes, check their bounds, then compare the corresponding items.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Section 9.3.4 — Python Heap Implementation

<span id="part-5-helpers"></span>

### 1. Connect the Private Helpers to the Public ADT

Code Fragments 9.4 and 9.5 implement `HeapPriorityQueue` using a Python list named `_data`. It reuses the `_Item` type from `PriorityQueueBase` in Section 9.2, so each item carries a key and value and compares **only by key**. The helpers enforce heap order:

| Helper or method | Job |
| :--- | :--- |
| `_parent`, `_left`, `_right` | Compute relatives from indexes. |
| `_has_left`, `_has_right` | Check whether child indexes are inside `_data`. |
| `_swap` | Exchange whole `_Item` objects. |
| `_upheap` | Repair upward after appending a new item. |
| `_downheap` | Repair downward after moving the last item to the root. |
| `add(k, v)` | Append an item and call `_upheap`. |
| `min()` | Return the root `(key, value)` without deletion. |
| `remove_min()` | Swap root and last, pop the old root, call `_downheap`, and return it. |

The book's bubbling helpers use recursion; the standalone program below uses loops that perform the same comparisons and swaps. Both `min()` and `remove_min()` raise `Empty` if no entry exists. If the heap has only one entry, `remove_min()` pops it and has no remaining child to repair.

**Why this example?** It links each conceptual step from Parts 3 and 4 to the method that performs it. **How to solve it:** keep tree shape with append/pop at the **end** and keep heap order with the appropriate bubbling helper.

<span id="part-5-program"></span>

### 2. Run a Complete Heap Priority Queue

Save this as `q2_heap_priority_queue.py` and run `python q2_heap_priority_queue.py`. The program uses the five verified Q2 records and constructs the heap both by repeated `add` calls and by the bottom-up constructor explained in Part 7.

```python
class Empty(Exception):
    pass


class PriorityQueueBase:
    class _Item:
        __slots__ = ("_key", "_value")

        def __init__(self, key, value):
            self._key = key
            self._value = value

        def __lt__(self, other):
            return self._key < other._key

    def is_empty(self):
        return len(self) == 0


class HeapPriorityQueue(PriorityQueueBase):
    def __init__(self, contents=()):
        self._data = [self._Item(key, value) for key, value in contents]
        if len(self._data) > 1:
            self._heapify()

    def __len__(self):
        return len(self._data)

    def _parent(self, j):
        return (j - 1) // 2

    def _left(self, j):
        return 2 * j + 1

    def _right(self, j):
        return 2 * j + 2

    def _has_left(self, j):
        return self._left(j) < len(self)

    def _has_right(self, j):
        return self._right(j) < len(self)

    def _swap(self, i, j):
        self._data[i], self._data[j] = self._data[j], self._data[i]

    def _upheap(self, j):
        while j > 0:
            parent = self._parent(j)
            if self._data[j] < self._data[parent]:
                self._swap(j, parent)
                j = parent
            else:
                break

    def _downheap(self, j):
        while self._has_left(j):
            left = self._left(j)
            smaller = left
            if self._has_right(j):
                right = self._right(j)
                if self._data[right] < self._data[left]:
                    smaller = right
            if self._data[smaller] < self._data[j]:
                self._swap(j, smaller)
                j = smaller
            else:
                break

    def _heapify(self):
        for j in range((len(self) - 2) // 2, -1, -1):
            self._downheap(j)

    def add(self, key, value):
        self._data.append(self._Item(key, value))
        self._upheap(len(self) - 1)

    def min(self):
        if self.is_empty():
            raise Empty("priority queue is empty")
        item = self._data[0]
        return item._key, item._value

    def remove_min(self):
        if self.is_empty():
            raise Empty("priority queue is empty")
        self._swap(0, len(self) - 1)
        item = self._data.pop()
        if not self.is_empty():
            self._downheap(0)
        return item._key, item._value


def lap_to_ms(lap):
    minutes, rest = lap.split(":")
    seconds, milliseconds = rest.split(".")
    return int(minutes) * 60_000 + int(seconds) * 1_000 + int(milliseconds)


def heap_view(queue):
    return [(item._key, item._value[0]) for item in queue._data]


# Official Q2 best laps; this insertion order is chosen for teaching.
riders = [
    ("Marc Márquez", "Ducati Lenovo Team", "1:29.646"),
    ("Marco Bezzecchi", "Aprilia Racing", "1:29.657"),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", "1:29.817"),
    ("Francesco Bagnaia", "Ducati Lenovo Team", "1:29.634"),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", "1:29.831"),
]

P = HeapPriorityQueue()
for name, team, lap in riders:
    P.add(lap_to_ms(lap), (name, team, lap))

print("Incremental heap:", heap_view(P))
key, (name, team, lap) = P.min()
print("Peek: {} | {} | {} | {} ms; count = {}".format(
    name, team, lap, key, len(P)
))
key, (name, _, _) = P.remove_min()
print("Removed: {} | {} ms".format(name, key))
print("After removal:", heap_view(P))

contents = (
    (lap_to_ms(lap), (name, team, lap))
    for name, team, lap in riders
)
Q = HeapPriorityQueue(contents)
print("Bottom-up heap:", heap_view(Q))
order = []
while not Q.is_empty():
    _, (name, _, _) = Q.remove_min()
    order.append(name)
print("Bottom-up removal order:", " -> ".join(order))
```

Expected output:

```text
Incremental heap: [(89634, 'Francesco Bagnaia'), (89646, 'Marc Márquez'), (89817, 'Pedro Acosta'), (89657, 'Marco Bezzecchi'), (89831, 'Fabio Quartararo')]
Peek: Francesco Bagnaia | Ducati Lenovo Team | 1:29.634 | 89634 ms; count = 5
Removed: Francesco Bagnaia | 89634 ms
After removal: [(89646, 'Marc Márquez'), (89657, 'Marco Bezzecchi'), (89817, 'Pedro Acosta'), (89831, 'Fabio Quartararo')]
Bottom-up heap: [(89634, 'Francesco Bagnaia'), (89646, 'Marc Márquez'), (89817, 'Pedro Acosta'), (89657, 'Marco Bezzecchi'), (89831, 'Fabio Quartararo')]
Bottom-up removal order: Francesco Bagnaia -> Marc Márquez -> Marco Bezzecchi -> Pedro Acosta -> Fabio Quartararo
```

**Why this example?** It checks the complete add/min/remove sequence and shows that bottom-up construction can produce the same valid heap for this input. **How to solve it:** preserve each rider/team/lap record as a value, compare integer millisecond keys, and inspect `heap_view` only to study the internal layout. Use the public methods to retrieve entries; another valid heap layout could give the same minimum and removal order.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Section 9.3.5 — Analysis of a Heap-Based Priority Queue

Table 9.3 gives these bounds for `n` entries, assuming a key comparison takes `O(1)` time:

| Operation | Cost | Reason |
| :--- | ---: | :--- |
| `len(P)` | `O(1)` | Read the list length. |
| `P.is_empty()` | `O(1)` | Check whether length is zero. |
| `P.min()` | `O(1)` | Read index `0`; no resizing occurs. |
| `P.add(k, v)` | `O(log n)` amortized | Append, then up-heap along one path. |
| `P.remove_min()` | `O(log n)` amortized | Pop at the end, then down-heap along one path. |
| Space | `O(n)` | One stored item per entry. |

A complete heap has height `floor(log₂ n)`, so either repair visits at most one logarithmic-length path. `min()` only reads the root. Python's underlying list may occasionally resize during append or pop, so the update bounds are **amortized** across a sequence of calls; an individual resize can cost more. A linked-tree implementation can provide worst-case logarithmic updates. The fixed-time key-comparison assumption matters if keys themselves are expensive to compare.

For our five-rider heap, Bagnaia's insertion moves two edges upward, and removing him makes Fabio move two edges downward. The small trace is a concrete example of the height bound, not a proof that every operation always takes two swaps.

**Why this example?** It connects the earlier trace to the general `O(log n)` result and distinguishes the root read from updates. **How to solve a running-time question:** bound the number of levels an item can move, then account for the array's occasional resizing separately.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Section 9.3.6 — Bottom-Up Heap Construction

<span id="part-7-trace"></span>

### 1. Repair an Unordered Array from the Bottom

If all `n` entries are already available, inserting them one by one can take `O(n log n)` total time. Code Fragment 9.6 instead accepts an iterable of `(key, value)` pairs, builds an array, and calls `_heapify()`. Leaves need no repair. Starting from the **last internal node**, visit internal indexes backward through index `0`, calling `_downheap` at each one.

```text
For n ≥ 2:
last internal index = parent(n - 1) = (n - 2) // 2
visit: last internal, ..., 1, 0
```

The raw array in our chosen teaching order is `[Marc, Bezzecchi, Pedro, Bagnaia, Fabio]`. It is **not** a heap: Bezzecchi at index `1` has key `89_657`, but his child Bagnaia at index `3` has the smaller key `89_634`.

| Repair | Array before | Action | Array after |
| :--- | :--- | :--- | :--- |
| `_downheap(1)` | `[Marc, Bezzecchi, Pedro, Bagnaia, Fabio]` | Swap Bezzecchi with smaller child Bagnaia. | `[Marc, Bagnaia, Pedro, Bezzecchi, Fabio]` |
| `_downheap(0)` | `[Marc, Bagnaia, Pedro, Bezzecchi, Fabio]` | Swap Marc with smaller child Bagnaia. | `[Bagnaia, Marc, Pedro, Bezzecchi, Fabio]` |

For `n = 5`, the last internal index is `(5 - 2) // 2 = 1`; indexes `2`, `3`, and `4` are leaves. By the time index `0` is repaired, both of its child subtrees already satisfy heap order. Our bottom-up result happens to match the incremental result in Part 5, but heap layouts are not generally unique. Figure 9.5 shows the same bottom-up idea with 15 entries.

**Why this example?** The raw records and the two repairs make "bottom-up" concrete. **How to solve it:** put all entries in level order, skip leaves, and call down-heap on internal indexes from right to left until the root is repaired.

<span id="part-7-cost"></span>

### 2. Explain the Linear-Time Result

It is tempting to multiply `n` calls by the worst-case `O(log n)` cost of one down-heap. That overcounts: **most starting nodes are near the leaves** and cannot move far. For a full 15-node heap, the possible downward work is easy to see:

| Nodes at a given height above a leaf | Count | Maximum steps per node | Total possible steps |
| ---: | ---: | ---: | ---: |
| 0 | 8 leaves | 0 | 0 |
| 1 | 4 | 1 | 4 |
| 2 | 2 | 2 | 4 |
| 3 | 1 root | 3 | 3 |

The total is at most `11` downward steps for this 15-node example. In larger complete heaps, the number of nodes able to move `d` levels falls geometrically as `d` grows. That geometric total is proportional to `n`, so **bottom-up heap construction takes `O(n)` time**.

Proposition 9.3 makes the bound formal by assigning each nonleaf a downward path to a leaf that bounds how far its item could move. The paths are chosen so that they share no edges, as Figure 9.6 illustrates. A tree with `n` nodes has `n - 1` edges, so the sum of those path lengths—and therefore the total down-heap work—is `O(n)`.

The `O(n)` build creates a **heap**, not sorted output. Repeatedly removing all `n` entries still takes `O(n log n)` in general because each removal can follow a logarithmic path.

**Why this example?** The 15-node count explains why many calls to down-heap do not imply `O(n log n)` construction. **How to solve it:** count work according to each node's available downward height, rather than assigning the root's worst-case height to every node.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Section 9.3.7 — Python's `heapq` Module

<span id="part-8-api"></span>

### 1. Match the Module's Operations to the ADT

Python's [`heapq` documentation](https://docs.python.org/3/library/heapq.html) describes functions that maintain a min-heap **inside an ordinary list**. The elements themselves are compared; `heapq` does not create the book's `_Item` class for us.

| Function | Action | Book's stated cost |
| :--- | :--- | ---: |
| `heapq.heappush(L, item)` | Add an item to an existing heap. | `O(log n)` |
| `heapq.heappop(L)` | Remove and return the minimum. | `O(log n)` |
| `heapq.heappushpop(L, item)` | Push, then return the minimum; the new item may come straight back. | `O(log n)` |
| `heapq.heapreplace(L, item)` | Return the old minimum, then put the new item in its place. | `O(log n)` |
| `heapq.heapify(L)` | Turn an unordered list into a heap in place. | `O(n)` |
| `heapq.nsmallest(k, items)` / `nlargest(k, items)` | Select the `k` smallest / largest elements. | The book says `O(n + k log n)` **can be achieved**. |

For `heappush`, `heappop`, `heappushpop`, and `heapreplace`, `L` must already satisfy the heap invariant. A new list can start empty; use `heapify` on an unordered populated list. To inspect without removal, check that `L` is nonempty and read `L[0]`. On an empty list, `heappop` and `heapreplace` raise `IndexError`, while the book's class raises `Empty`. The current Python documentation describes these behaviors directly.

**Why this example?** It maps the book's class ideas to functions available in Python. **How to solve it:** choose a list representation for each entry, call `heapify` if it begins unordered, and preserve the heap invariant between operations.

<span id="part-8-combined"></span>

### 2. Distinguish Push-Then-Pop from Replace

Start with a two-entry heap containing Marc `89_646` and Fabio `89_831`. Consider adding Bagnaia `89_634`, who has the **smaller** key. Make a fresh copy of the starting heap for each operation:

| Call with Bagnaia | Returned entry | Entries left waiting |
| :--- | :--- | :--- |
| `heappushpop` | Bagnaia, the newly supplied minimum. | Marc and Fabio remain. |
| `heapreplace` | Marc, the old minimum. | Bagnaia and Fabio remain. |

```python
import heapq

original = [(89_646, "Marc Márquez"), (89_831, "Fabio Quartararo")]
heapq.heapify(original)

push_then_pop = original.copy()
replace = original.copy()
print(heapq.heappushpop(push_then_pop, (89_634, "Francesco Bagnaia")))
print(heapq.heapreplace(replace, (89_634, "Francesco Bagnaia")))
```

```text
(89634, 'Francesco Bagnaia')
(89646, 'Marc Márquez')
```

`heapreplace` requires a nonempty heap because it must return an **old** item. `heappushpop` can return the new item immediately if it is smaller than the old minimum. The [Python documentation](https://docs.python.org/3/library/heapq.html) explains the distinction.

**Why this example?** Bagnaia's real Q2 key is smaller than Marc's, so the two combined calls visibly return different riders. **How to solve it:** decide whether the operation must remove the old minimum (`heapreplace`) or the minimum after considering the new entry (`heappushpop`).

<span id="part-8-ties"></span>

### 3. Handle Equal Keys Deliberately

The official Q2 millisecond keys above are distinct. A separate teaching exercise could round Pedro's `89.817` seconds and Fabio's `89.831` seconds to `89.8` seconds, creating equal keys. A `heapq` tuple such as `(key, rider_record)` compares the second field when keys tie. If those records are dictionaries or other unorderable objects, the comparison can raise `TypeError`.

A sequence number avoids comparing the values:

```python
from itertools import count
from heapq import heappush

arrival = count()
waiting = []
heappush(waiting, (898, next(arrival), {"rider": "Pedro Acosta"}))
heappush(waiting, (898, next(arrival), {"rider": "Fabio Quartararo"}))
```

Here `898` means **tenths of a second**, not the official millisecond key. The sequence numbers give this particular representation an insertion-order tie rule. The priority-queue ADT itself allows either equal-key entry. Python's [`heapq` priority-queue notes](https://docs.python.org/3/library/heapq.html#priority-queue-implementation-notes) discuss this pattern.

**Why this example?** It separates a tie caused by deliberately reduced precision from the real Q2 order and prevents a Python tuple-comparison error. **How to solve it:** keep exact millisecond keys when exact timing matters; if ties are possible, decide a tie rule and include a comparable secondary field.

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Section 9.3 idea | Plain-language meaning | French GP Q2 example |
| :--- | :--- | :--- |
| Heap order | Every parent key is no greater than its children. | Bagnaia's `89_634` ms key reaches the root. |
| Complete shape | Fill levels and the last row from left to right. | Fabio occupies index `4`, the right child of Marc. |
| Partial order | The whole array need not be sorted. | Pedro at index `2` has a larger key than Bezzecchi at index `3`. |
| Up-heap | Move a newly added small item toward the root. | Bagnaia swaps past Bezzecchi and Marc. |
| Down-heap | Move a replacement root toward its smaller child. | Fabio swaps past Marc and Bezzecchi after Bagnaia leaves. |
| Array indexes | Derive relatives from `j`, not pointers. | Marc at index `1` has children at `3` and `4`. |
| Heap costs | `min` is `O(1)`; updates follow `O(log n)` paths. | Five entries have height `2`. |
| Bottom-up construction | Repair internal nodes from last to first in `O(n)`. | The raw five-record array needs two down-heap calls. |
| `heapq` | Python functions maintain a heap in a list. | `heappushpop` and `heapreplace` return different Q2 riders. |

[🔝 Back to Top](#top)
