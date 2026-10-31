<span id="top"></span>

# 9.2 Implementing a Priority Queue — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.2, printed pages 365–369 (the supplied PDF).<br>
> **Topic:** 9.2 Implementing a Priority Queue; 9.2.1 The Composition Design Pattern; 9.2.2 Implementation with an Unsorted List; 9.2.3 Implementation with a Sorted List; Comparing the Two List-Based Implementations.<br>
> **Domain Focus:** Points on a coordinate grid, squared distance from the origin, and the cost of finding the nearest point.<br>
> **User Prompt:** Reexplain [`Section 9.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Same Points, Two Storage Orders](#background)
   - [1. Revisit the nearest-point task](#background-points)
   - [2. Separate the answer from the storage order](#background-storage)
2. [Part 1: 9.2 Implementing a Priority Queue](#part-1)
   - [1. Keep the Section 9.1 behavior](#part-1-contract)
   - [2. Why a positional list matters](#part-1-list)
3. [Part 2: 9.2.1 The Composition Design Pattern](#part-2)
   - [1. Keep a key and its point together](#part-2-item)
   - [2. Share common behavior in a base class](#part-2-base)
4. [Part 3: 9.2.2 Implementation with an Unsorted List](#part-3)
   - [1. Add each point at the end](#part-3-add)
   - [2. Scan to find the minimum](#part-3-find)
   - [3. Inspect, remove, and count the cost](#part-3-cost)
5. [Part 4: 9.2.3 Implementation with a Sorted List](#part-4)
   - [1. Maintain nondecreasing key order](#part-4-order)
   - [2. Search backward to insert a new point](#part-4-add)
   - [3. Read or remove the first entry](#part-4-min)
6. [Part 5: Comparing the Two List-Based Implementations](#part-5)
   - [1. The operation-cost table](#part-5-table)
   - [2. Choose according to the work being done](#part-5-choice)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Same Points, Two Storage Orders

<span id="background-points"></span>

### 1. Revisit the nearest-point task

The [Section 9.1 guide](09-01-the-priority-queue-abstract-data-type.md) introduced a class checking points nearest to the origin `O = (0, 0)` first. The points arrive in the order `A`, `C`, `B`, `D`. We add all four before asking for the first point to check.

For a point `(x, y)`, use **squared distance** `d² = x² + y²` as its priority key. The smallest squared distance belongs to the nearest point because square root preserves the order of nonnegative numbers.

| Arrival | Point | Squared-distance calculation | Key |
| ---: | :--- | :--- | ---: |
| 1st | `A = (1, 2)` | `1² + 2²` | 5 |
| 2nd | `C = (0, 3)` | `0² + 3²` | 9 |
| 3rd | `B = (1, 1)` | `1² + 1²` | 2 |
| 4th | `D = (2, 2)` | `2² + 2²` | 8 |

Our entries are `(key, point label)`: `(5, "A")`, `(9, "C")`, `(2, "B")`, and `(8, "D")`. Both implementations in this section must identify `B` as the minimum because `2` is the smallest key.

<span id="background-storage"></span>

### 2. Separate the answer from the storage order

Section 9.1 specified *what* a priority queue returns. Section 9.2 asks *how* to store the entries so those operations work. The book tries two arrangements of a **positional list**:

| Arrangement after four insertions | Entries from first to last | Where is minimum `B(2)`? |
| :--- | :--- | :--- |
| Unsorted | `A(5) ↔ C(9) ↔ B(2) ↔ D(8)` | In the middle; search for it. |
| Sorted | `B(2) ↔ A(5) ↔ D(8) ↔ C(9)` | At the first position. |

The arrows show neighboring positions in a doubly linked list. The sorted row is ordered by **key**, not by point label. Both arrangements represent the same four waiting points and produce the same minimum for these distinct keys.

> **Mental model:** An unsorted list spends its work when asking for the nearest point. A sorted list spends its work when inserting a point into the correct place.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 9.2 Implementing a Priority Queue

<span id="part-1-contract"></span>

### 1. Keep the Section 9.1 behavior

The priority queue still supports `add(k, v)`, `min()`, `remove_min()`, `is_empty()`, and `len(P)`. `min()` returns a minimum-key entry **without removing it**; `remove_min()` removes and returns one. Both `min()` and `remove_min()` signal an error when the queue is empty. Section 9.2 changes the **implementation**, not those meanings.

The two concrete classes in the book are `UnsortedPriorityQueue` and `SortedPriorityQueue`. Each contains a `PositionalList` in its `_data` field. Each list position holds one composite item containing a key and a value.

<span id="part-1-list"></span>

### 2. Why a positional list matters

The book's `PositionalList` is backed by a **doubly linked list**. A *position* identifies a place in that list; the *element at that position* is our key–value item. The implementation can move from one position to its neighbor and can delete a known position without shifting all later entries.

| Positional-list operation | Meaning here | Cost assumed in Section 9.2 |
| :--- | :--- | ---: |
| `first()`, `last()` | Find an end position. | `O(1)` |
| `before(p)`, `after(p)` | Move one position backward or forward. | `O(1)` |
| `add_first(item)`, `add_last(item)`, `add_after(p, item)` | Insert at a known place. | `O(1)` |
| `delete(p)` | Remove a known position. | `O(1)` |
| `len(L)` | Count entries. | `O(1)` |

These costs depend on the **linked positional list**. A Python built-in `list` is array based; removing its first element with `pop(0)` shifts later elements and takes `O(n)` time. We must keep the book's data structure in mind when reading its `O(1)` claims.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 9.2.1 The Composition Design Pattern

<span id="part-2-item"></span>

### 1. Keep a key and its point together

**Composition** builds a larger object from contained objects. Here, a priority queue contains a positional list, and each list element is an `_Item` that holds a **key** together with its **value**. For our point `B`, the item keeps `2` and `"B"` paired. If an item is inserted or deleted, the key cannot accidentally be separated from the point label.

Code Fragment 9.1 defines `_Item` inside `PriorityQueueBase`. It stores `_key` and `_value` (declared in `__slots__`) and gives items a less-than comparison based **only on their keys**:

```python
def __lt__(self, other):
    return self._key < other._key
```

Thus the item for `B` compares below the item for `A` because `2 < 5`; the letters `"B"` and `"A"` do not decide their priority. `__slots__` limits the item's declared instance fields, but the important priority rule here is the key comparison.

<span id="part-2-base"></span>

### 2. Share common behavior in a base class

Both concrete priority queues **inherit** from `PriorityQueueBase`. The base class supplies the `_Item` type and this common check:

```python
def is_empty(self):
    return len(self) == 0
```

Each concrete class supplies its own `__len__`, which returns the length of its `_data` positional list. Therefore the same `is_empty()` method works for both implementations, and it takes `O(1)` time because the list length is available in `O(1)` time.

| Object | Its job in the geometry example |
| :--- | :--- |
| Priority queue | Accept points and return the nearest waiting point. |
| Positional list in `_data` | Hold the waiting items in one of two orders. |
| `_Item` | Keep one point label with its squared-distance key. |
| Position | Identify an item's location for traversal or deletion. |

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 9.2.2 Implementation with an Unsorted List

<span id="part-3-add"></span>

### 1. Add each point at the end

`UnsortedPriorityQueue` creates an empty `PositionalList`. Its `add(k, v)` wraps the pair in `_Item` and calls `add_last`. It does **not** search for the correct key order during insertion. Code Fragment 9.2 therefore makes each insertion `O(1)`.

| Call | Unsorted `_data` afterward |
| :--- | :--- |
| `add(5, "A")` | `A(5)` |
| `add(9, "C")` | `A(5) ↔ C(9)` |
| `add(2, "B")` | `A(5) ↔ C(9) ↔ B(2)` |
| `add(8, "D")` | `A(5) ↔ C(9) ↔ B(2) ↔ D(8)` |

The list currently happens to match arrival order because every new item was appended. Its order does **not** tell us which key is smallest.

<span id="part-3-find"></span>

### 2. Scan to find the minimum

The nonpublic helper `_find_min()` begins with the **first position** as its best candidate. It visits each later position using `after(p)`. When it finds an item with a **strictly smaller** key, that position becomes the new candidate. It returns the winning **position**, allowing `remove_min()` to delete exactly that position later.

| Position visited | Key comparison | Best candidate afterward |
| :--- | :--- | :--- |
| `A(5)` | Starting candidate. | `A(5)` |
| `C(9)` | `9 < 5` is false. | `A(5)` |
| `B(2)` | `2 < 5` is true. | `B(2)` |
| `D(8)` | `8 < 2` is false. | `B(2)` |

With `n` nonempty entries, this scan makes `n − 1` key comparisons: it starts with one candidate and compares each of the other entries once. For our four points, that is **three** comparisons. In big-O notation, the scan takes `O(n)` time.

<span id="part-3-cost"></span>

### 3. Inspect, remove, and count the cost

`min()` calls `_find_min()`, reads the winning item's key and value, and leaves the item in the list. In our example it returns `(2, "B")`; the list still contains four entries.

`remove_min()` calls `_find_min()` again, then calls `delete(p)` on the returned position. It returns `(2, "B")`, leaving `A(5) ↔ C(9) ↔ D(8)`. The deletion itself is `O(1)` because the position is known, but the preceding scan makes the complete operation **`O(n)`**. Calling `min()` just before `remove_min()` performs **two scans** in this book implementation; `min()` does not cache the candidate.

Both methods raise the book's `Empty` exception on an empty queue. `len(P)` and `is_empty()` take `O(1)` time, and storing `n` items takes `O(n)` space.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 9.2.3 Implementation with a Sorted List

<span id="part-4-order"></span>

### 1. Maintain nondecreasing key order

`SortedPriorityQueue` also uses a `PositionalList`, but its `_data` always stays in **nondecreasing key order**: each key is less than or equal to the next. This is an **invariant**, a rule the class restores after every insertion or removal.

```text
first → B(2) ↔ A(5) ↔ D(8) ↔ C(9) ← last
```

The first position therefore holds a minimum-key entry. That fact makes `min()` and `remove_min()` quick, but inserting a new item can require a search for its place.

<span id="part-4-add"></span>

### 2. Search backward to insert a new point

Code Fragment 9.3 creates a new `_Item`, starts at the **last position**, and walks backward with `before(p)` while the new item's key is strictly less than the current key. It stops at an item with key **less than or equal to** the new key and inserts after that item. If it walks past the first position, it inserts at the front.

| New item | Backward checks | Sorted `_data` afterward |
| :--- | :--- | :--- |
| `A(5)` | List is empty. | `A(5)` |
| `C(9)` | `9 < 5` is false; insert after `A`. | `A(5) ↔ C(9)` |
| `B(2)` | `2 < 9`, then `2 < 5`; insert first. | `B(2) ↔ A(5) ↔ C(9)` |
| `D(8)` | `8 < 9`, then `8 < 5` is false; insert after `A`. | `B(2) ↔ A(5) ↔ D(8) ↔ C(9)` |

The point `B` arrived third but was inserted at the front because its key is smallest. A new point with an even smaller key can make the algorithm inspect **every existing item**. If there are `n` items before insertion, `add` is `O(n)` in the worst case. When a new key is at least the last key, the backward walk stops immediately, so that particular insertion takes `O(1)`.

<span id="part-4-min"></span>

### 3. Read or remove the first entry

`min()` checks that the list is nonempty, reads `first()`, and returns its key–value pair without deletion. `remove_min()` checks the same condition, deletes `first()`, and returns its item. With our points, both identify `(2, "B")`; after removal, `A(5)` becomes first.

Finding or deleting the first position of the book's doubly linked positional list takes `O(1)` time. Thus **both `min()` and `remove_min()` take `O(1)`**, as do `len(P)` and `is_empty()`. The sorted implementation still uses `O(n)` space and raises `Empty` when either minimum operation is called on an empty queue.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Comparing the Two List-Based Implementations

<span id="part-5-table"></span>

### 1. The operation-cost table

Tables 9.1 and 9.2 in the book summarize the worst-case costs for `n` stored entries. The bounds assume the same linked `PositionalList` for both classes.

| Priority-queue operation | Unsorted list | Sorted list | Why they differ |
| :--- | ---: | ---: | :--- |
| `len(P)` | `O(1)` | `O(1)` | Both lists maintain their lengths. |
| `P.is_empty()` | `O(1)` | `O(1)` | Base method checks `len(P) == 0`. |
| `P.add(k, v)` | `O(1)` | `O(n)` | Append versus search for an ordered place. |
| `P.min()` | `O(n)` | `O(1)` | Scan all entries versus read the first. |
| `P.remove_min()` | `O(n)` | `O(1)` | Scan then delete versus delete the first. |
| Space for `n` entries | `O(n)` | `O(n)` | Each stores one item per entry. |

The `n − 1` comparisons in the unsorted scan are still `O(n)`. The sorted insertion's backward walk is also `O(n)` in the worst case, even though some individual insertions stop after one comparison.

<span id="part-5-choice"></span>

### 2. Choose according to the work being done

Suppose a map has many newly recorded points but the class asks for the nearest point only once. The unsorted implementation adds each point in `O(1)` time and pays for one scan when needed. Repeated `min()` requests with few new points favor the sorted implementation, which reads the first position in `O(1)` time each time. Fast `remove_min()` alone does not settle the total cost: if every point is added and later removed, sorted insertion may cost `O(n)` per point, while unsorted removal may cost `O(n)` per point.

The choice is about **which operation happens often**, not which order looks nicer in a drawing. Both implementations satisfy the priority queue ADT from Section 9.1. For our four distinct keys, they return points in the same nearest-first order: `B`, `A`, `D`, `C`.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: A closer point arrives after the list is built</strong></summary>

**Scenario:** The four original points are still waiting. Add `F = (0, 1)`, so its squared-distance key is `0² + 1² = 1`.

**Unsorted list:** Append `F(1)` at the end in `O(1)` time. A later `_find_min()` scan discovers `F` among the five entries.

**Sorted list:** Starting at the last item `C(9)`, compare `F(1)` with `C(9)`, `D(8)`, `A(5)`, and `B(2)`. All four checks move backward, so `F` is inserted at the front. This insertion takes `O(n)` time for `n = 4` existing entries.

**Result:** Both implementations return `(1, "F")` as the next minimum.

</details>

<details>
<summary><strong>Case Study 2: Does looking at the nearest point use it up?</strong></summary>

**Scenario:** With the original four points waiting, call `min()` three times and then `remove_min()` once.

**Result:** Each call returns `(2, "B")`. The three `min()` calls leave `B` in the queue; only `remove_min()` deletes it. The unsorted implementation scans four positions for **each** call. The sorted implementation reads or deletes its first position for each call.

</details>

<details>
<summary><strong>Case Study 3: What if two points have the same distance?</strong></summary>

**Scenario:** Add `E = (-1, -1)` with key `(-1)² + (-1)² = 2` while `B(2)` is still waiting.

**Observation:** For this insertion sequence, both of the book's algorithms return `B(2)` first. Their strict `<` comparisons leave the earlier `B(2)` before the later `E(2)`: the unsorted scan keeps its first equal minimum, and sorted insertion places `E` after an equal key.

**Rule:** The **ADT** allows either tied minimum to be returned. Code that needs a particular tie order must define that rule explicitly rather than assume every priority-queue implementation behaves like these two.

</details>

<details>
<summary><strong>Case Study 4: Why does the sorted list remove the first point in constant time?</strong></summary>

**Scenario:** After the original four insertions, `B(2)` is the first sorted entry. We remove it.

**Reason:** The linked positional list already knows its first position and can unlink that position in `O(1)` time. The remaining first item is `A(5)`.

**Caution:** Replacing the positional list with a Python built-in list and calling `pop(0)` would shift the remaining elements. That different storage choice would change the removal cost to `O(n)`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 9.2 idea | Plain-language meaning | Coordinate-grid example |
| :--- | :--- | :--- |
| **Composition** | Build the priority queue from a positional list of paired key–value items. | Keep `2` with point label `"B"`. |
| **`_Item.__lt__`** | Compare items by their keys. | `B(2)` precedes `A(5)`. |
| **Unsorted list** | Append quickly; scan when asking for the minimum. | Store `A, C, B, D`, then find `B`. |
| **Sorted list** | Search during insertion; keep a minimum at the front. | Store `B, A, D, C` by key. |
| **`min()`** | Return the minimum without deletion. | Return `B` while it remains waiting. |
| **`remove_min()`** | Return and delete the minimum. | Unlink `B` after finding its position. |
| **Running-time tradeoff** | Unsorted favors quick additions; sorted favors quick minimum requests. | Adding close `F` is cheap unsorted; taking `F` is cheap sorted. |
| **Positional-list assumption** | Linked positions make deletion at a known place constant time. | Delete sorted first position `B` in `O(1)`. |

[🔝 Back to Top](#top)
