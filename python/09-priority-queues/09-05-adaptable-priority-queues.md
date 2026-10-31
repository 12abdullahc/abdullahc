<span id="top"></span>

# 9.5 Adaptable Priority Queues — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.5, printed pages 390–394 (the supplied PDF).<br>
> **Topic:** 9.5 Adaptable Priority Queues; 9.5.1 Locators; 9.5.2 Implementing an Adaptable Priority Queue.<br>
> **Domain Focus:** Moving or withdrawing points waiting to be processed nearest-first on a coordinate grid.<br>
> **User Prompt:** Reexplain [`Section 9.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Points Can Change While They Wait](#background)
   - [1. Reuse the four-point map](#background-points)
   - [2. A stored key cannot follow a moving point by itself](#background-change)
2. [Part 1: 9.5 Adaptable Priority Queues](#part-1)
   - [1. Why the book extends the priority queue](#part-1-motivation)
   - [2. The new operations and their geometry meanings](#part-1-operations)
3. [Part 2: 9.5.1 Locators](#part-2)
   - [1. Keep the token returned by `add`](#part-2-token)
   - [2. A locator identifies an entry, not a fixed array position](#part-2-identity)
   - [3. Know when a locator is valid](#part-2-validity)
4. [Part 3: 9.5.2 Implementing an Adaptable Priority Queue](#part-3)
   - [1. Put the current heap index in each locator](#part-3-layout)
   - [2. Update both indices whenever entries swap](#part-3-swap)
   - [3. Repair the heap in the direction the key requires](#part-3-bubble)
   - [4. Add, update, and remove through locators](#part-3-methods)
   - [5. Count the running time and space](#part-3-costs)
5. [Part 4: A Connected Geometry Trace](#part-4)
   - [1. Build the original heap and save its locators](#part-4-build)
   - [2. Move A nearer and bubble it upward](#part-4-nearer)
   - [3. Withdraw D and repair the gap](#part-4-remove)
   - [4. Move A farther and bubble it downward](#part-4-farther)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Points Can Change While They Wait

<span id="background-points"></span>

### 1. Reuse the four-point map

The [Section 9.1 guide](09-01-the-priority-queue-abstract-data-type.md) introduced points waiting to be processed nearest-first from `O = (0, 0)`. The [Section 9.3 guide](09-03-heaps.md) stored them in a min-heap. We use the same arrival order and the same numeric priority key, **squared distance** `d² = x² + y²`:

| Arrival | Point | Squared-distance calculation | Key |
| ---: | :--- | :--- | ---: |
| 1st | `A = (1, 2)` | `1² + 2²` | 5 |
| 2nd | `C = (0, 3)` | `0² + 3²` | 9 |
| 3rd | `B = (1, 1)` | `1² + 1²` | 2 |
| 4th | `D = (2, 2)` | `2² + 2²` | 8 |

With those insertions, the heap array from Section 9.3 is `[B(2), D(8), A(5), C(9)]`. Its root `B(2)` is nearest. The array is **heap-ordered**, so it need not read in fully sorted order.

<span id="background-change"></span>

### 2. A stored key cannot follow a moving point by itself

The [Section 9.1 moving-point case](09-01-the-priority-queue-abstract-data-type.md#part-4-contract) observed that if `A` moves from `(1, 2)` to `(0, 1)`, its distance key should change from `5` to `1`. Merely changing our separate map of coordinates does **not** change the key already stored in the queue. We need a way to identify `A`'s waiting entry and update **both** its key and its point record.

Likewise, `D(8)` might withdraw before it reaches the front. `remove_min()` would remove `B(2)`, the wrong point. We need to identify and remove `D` directly. Section 9.5 adds these two abilities.

> **Mental model:** A locator is a ticket for one waiting entry. Keep the ticket even when heap swaps move that entry; use it to change or remove the entry later.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 9.5 Adaptable Priority Queues

<span id="part-1-motivation"></span>

### 1. Why the book extends the priority queue

The book starts with **airline standby passengers**. One passenger leaves the waiting list before boarding, requiring removal of an arbitrary entry. Another shows a gold frequent-flyer card, requiring a change to that passenger's priority. The original priority-queue operations can find or remove a **minimum**, but they cannot directly name a different waiting entry for removal or update.

Our geometry task has the same shape: withdraw `D` while `B` is nearer, or update `A` after it moves. The book calls a priority queue with these additional operations an **adaptable priority queue**. It also points ahead to graph algorithms that use adaptable queues in Sections 14.6.2 and 14.7.1.

<span id="part-1-operations"></span>

### 2. The new operations and their geometry meanings

For an adaptable priority queue `P`, insertion returns a **locator** `loc`. Keep it for a later call concerning that same entry:

| Operation | Meaning | Geometry example |
| :--- | :--- | :--- |
| `loc = P.add(k, v)` | Insert `(k, v)` and return a locator for it. | Keep `loc_A` for the point record `("A", 1, 2)` with key `5`. |
| `P.update(loc, newkey, newval)` | Replace **both** key and value of the located entry. | Change `A` to record `("A", 0, 1)` and key `1`. |
| `P.remove(loc)` | Remove that particular entry and return its `(key, value)` pair. | Withdraw `D(8)` even though it is not nearest. |

The ordinary `min()`, `remove_min()`, `len(P)`, and `is_empty()` operations still work. `update` does not calculate a new distance for us: **we** calculate `x² + y²` from the new coordinates and supply it with the new point record.

```python
# Illustration using the class in the book's Code Fragments 9.8–9.9.
P = AdaptableHeapPriorityQueue()
loc_A = P.add(5, ("A", 1, 2))
P.update(loc_A, 1, ("A", 0, 1))
```

The snippet shows how to use the book's class; that class must be defined or imported before running it. The **same** `loc_A` is used after `A` changes position.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 9.5.1 Locators

<span id="part-2-token"></span>

### 1. Keep the token returned by `add`

Without a locator, finding a specific point in an unsorted heap array could require examining every entry: `O(n)` work before an update or removal even begins. Returning a locator when `add` inserts the point gives the caller a direct reference to the point's **entry object**. In the book, the caller hands that locator back to `update` or `remove`.

```text
loc_A  ──references──>  the entry for A
loc_D  ──references──>  the entry for D
```

The caller uses the locator as a token; the heap implementation manages where that entry currently sits. This is related to the book's earlier **Position** abstraction for lists and trees, but a locator does **not** promise a permanent placement inside the heap.

<span id="part-2-identity"></span>

### 2. A locator identifies an entry, not a fixed array position

The heap swaps entries whenever it restores heap order. A locator must therefore stay with its **entry**, while its stored array index changes. For our starting heap, `loc_A` refers to the `A(5)` entry at index `2`. After `A` becomes the nearest point, that same locator will refer to `A(1)` at index `0`.

Figures 9.10 and 9.11 in the book use a **separate letter-and-number heap**, not our coordinates. Their illustrated token still identifies the same locator after `remove_min()`, even though its entry changes array position. The book also traces a different entry, `(16, X)`, moving from index `7` to index `4`. The heap updates locator index fields instead of asking callers to obtain new tokens.

<span id="part-2-validity"></span>

### 3. Know when a locator is valid

A locator remains usable **while its entry remains in that same queue**. The implementation checks two things before `update` or `remove`: its stored index `j` is within the current heap array, and `P._data[j] is loc`. The `is` test checks that the array holds the **very same object**, not merely an entry with equal contents.

After `P.remove(loc_D)`, `loc_D` no longer names a live entry. Reusing that removed locator is rejected by the book's validation. A locator from a different queue also fails the bounds-and-identity validation. Code Fragment 9.9 omits a preliminary type check, so it does not promise a particular error for an object that is not a locator at all.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 9.5.2 Implementing an Adaptable Priority Queue

<span id="part-3-layout"></span>

### 1. Put the current heap index in each locator

The book's `AdaptableHeapPriorityQueue` extends its earlier `HeapPriorityQueue`. Code Fragment 9.8 defines a public nested `Locator` class that extends the heap's `_Item`. Each locator holds **key**, **value**, and one extra field, **`_index`**. The heap array holds references to those locator objects:

| Heap index | Locator object in our initial heap | Locator's `_index` |
| ---: | :--- | ---: |
| 0 | `loc_B` for `B(2)` | 0 |
| 1 | `loc_D` for `D(8)` | 1 |
| 2 | `loc_A` for `A(5)` | 2 |
| 3 | `loc_C` for `C(9)` | 3 |

The third column repeats the index where each object is currently stored. That small piece of information lets `update(loc_A, ...)` find `A` without searching the entire heap.

<span id="part-3-swap"></span>

### 2. Update both indices whenever entries swap

In the original heap class, all element moves go through a `_swap(i, j)` helper. The adaptable subclass overrides it. After exchanging the two array references, it writes the new array positions into **both** locator objects:

```text
swap the objects at heap[i] and heap[j]
set heap[i]._index to i
set heap[j]._index to j
```

For example, swapping `A` at index `2` with `B` at index `0` makes `loc_A._index = 0` and `loc_B._index = 2`. The caller's `loc_A` and `loc_B` references still point to their original objects. The inherited `remove_min()` also gets the correct index updates because it uses this overridden `_swap`.

<span id="part-3-bubble"></span>

### 3. Repair the heap in the direction the key requires

Changing an entry's key, or replacing a removed entry with the last heap item, might break the min-heap rule. Code Fragment 9.8 uses a `_bubble(j)` helper to choose the repair direction:

| Condition at index `j` | Repair | Geometry meaning |
| :--- | :--- | :--- |
| `j > 0` and the entry is smaller than its parent | `_upheap(j)` | A moved point became closer than the point above it. |
| Otherwise | `_downheap(j)` | A point may have become farther than a child, or the current order is already valid. |

The comparison is **child key `<` parent key** for the upward case. If the key change leaves the heap order valid, `_downheap` checks but performs no swap. Either direction follows at most one path through the complete binary tree, whose height is `O(log n)`.

<span id="part-3-methods"></span>

### 4. Add, update, and remove through locators

Code Fragment 9.9 supplies the public methods. The table paraphrases their steps; `j` is the current index stored in the locator.

| Method | Steps | Result |
| :--- | :--- | :--- |
| `add(k, v)` | Create a locator with `_index = len(P)`, append it, then up-heap it. | Return the locator, whose index tracks any swaps. |
| `update(loc, k, v)` | Validate `loc`; replace its key **and** value; call `_bubble(j)`. | The same live locator now describes the updated entry. |
| `remove(loc)` | Validate `loc`. If it is last, pop it. Otherwise swap it with the last entry, pop it, and bubble the replacement at `j`. | Return the removed `(key, value)` pair. |

For validation, the displayed code tests `0 <= j < len(P)` **and** `P._data[j] is loc`. After a non-last removal, bubbling repairs the **replacement** entry, not the entry that was popped. A last-item removal needs no bubbling. The old `remove_min()` method is inherited unchanged; the overridden swap helper supplies its locator bookkeeping.

<span id="part-3-costs"></span>

### 5. Count the running time and space

Table 9.4 gives the following costs for an adaptable **array-based min-heap** of `n` entries:

| Operation | Time | Why |
| :--- | :--- | :--- |
| `len(P)`, `is_empty()`, `min()` | `O(1)` | Read the size or root. |
| `add(k, v)` | `O(log n)` amortized | Append, then possibly up-heap. |
| `update(loc, k, v)` | `O(log n)` worst case | Find the entry through its locator and bubble along one path. |
| `remove(loc)` | `O(log n)` amortized | Swap with the last entry, pop, and possibly bubble. |
| `remove_min()` | `O(log n)` amortized | Remove the root and down-heap the replacement. |

The heap and its locators use `O(n)` space. The **amortized** qualification on adding and removing accounts for occasional resizing of the underlying Python list; `update` changes no list length. Locator lookup itself uses the stored index and identity check, so it does not add a linear search.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: A Connected Geometry Trace

The following point movements and withdrawal are **our study case**. The book uses standby passengers and the separate letter-and-number heap in Figures 9.10–9.11.

<span id="part-4-build"></span>

### 1. Build the original heap and save its locators

Insert `A(5)`, `C(9)`, `B(2)`, and `D(8)` in that order, keeping `loc_A`, `loc_C`, `loc_B`, and `loc_D` from the four `add` calls. Then add `H = (3, 1)` with key `3² + 1² = 10`, keeping `loc_H`. The heap is:

| Index | 0 | 1 | 2 | 3 | 4 |
| ---: | :--- | :--- | :--- | :--- | :--- |
| Entry | `B(2)` | `D(8)` | `A(5)` | `C(9)` | `H(10)` |
| Locator | `loc_B` | `loc_D` | `loc_A` | `loc_C` | `loc_H` |

Each locator's `_index` equals the number at the top of its column. In particular, `loc_A._index` is `2` and `loc_D._index` is `1`. We keep these objects; we do **not** save `2` and `1` as permanent positions.

<span id="part-4-nearer"></span>

### 2. Move A nearer and bubble it upward

Move `A` from `(1, 2)` to `(0, 1)`. Its key changes from `1² + 2² = 5` to `0² + 1² = 1`. Call `P.update(loc_A, 1, ("A", 0, 1))`. Since `A(1)` at index `2` is now smaller than its parent `B(2)` at index `0`, `_upheap` swaps them:

```text
before update:  [B(2), D(8), A(5), C(9), H(10)]
after update:   [A(1), D(8), B(2), C(9), H(10)]
                   ↑                ↑
                loc_A: 0         loc_B: 2
```

The heap now reports `A` as nearest. `loc_A` is the **same object** returned by the first insertion, but its `_index` changed from `2` to `0`.

<span id="part-4-remove"></span>

### 3. Withdraw D and repair the gap

Suppose `D(8)` withdraws. `D` is at index `1`, while `A(1)` is the minimum. `P.remove(loc_D)` targets `D` directly and returns `(8, ("D", 2, 2))`. The method swaps `D` with the last item `H(10)`, pops `D`, then repairs the position where `H` landed:

| Step | Heap array | What happened to the locators? |
| :--- | :--- | :--- |
| Before removal | `[A(1), D(8), B(2), C(9), H(10)]` | `loc_D` is at 1; `loc_H` is at 4. |
| Swap 1 and 4 | `[A(1), H(10), B(2), C(9), D(8)]` | `loc_H` becomes 1; `loc_D` becomes 4. |
| Pop the last item | `[A(1), H(10), B(2), C(9)]` | `loc_D` is no longer valid. |
| Down-heap the replacement | `[A(1), C(9), B(2), H(10)]` | `C(9)` and `H(10)` swap; `loc_C` becomes 1 and `loc_H` becomes 3. |

The final heap still has nearest point `A(1)`. The call removed the chosen point `D`, rather than taking the minimum `A`.

<span id="part-4-farther"></span>

### 4. Move A farther and bubble it downward

Later, move that **same** point `A` from `(0, 1)` to `(4, 0)`. Its new key is `4² + 0² = 16`. Call `P.update(loc_A, 16, ("A", 4, 0))`. At the root, `A(16)` is larger than both children `C(9)` and `B(2)`. `_downheap` swaps it with the **smaller child**, `B(2)`:

```text
before update:  [A(1), C(9), B(2), H(10)]
after update:   [B(2), C(9), A(16), H(10)]
                   ↑                ↑
                loc_B: 0         loc_A: 2
```

`B` becomes nearest again. Across both moves, `loc_A` stayed the same object while its index went `2 → 0 → 2`; its key **and** coordinate record changed with each `update`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why did moving A in the map not change the heap's answer?</strong></summary>

**Scenario:** A separate point table says `A` is now `(0, 1)`, but the queue still contains its old key `5` and value `("A", 1, 2)`.

**Problem:** The heap compares stored keys. It cannot discover that an outside table changed, so it may still report `B(2)` as nearest.

**Fix:** Compute the new key `1` and call `P.update(loc_A, 1, ("A", 0, 1))`. This updates the stored priority and record together.

</details>

<details>
<summary><strong>Case Study 2: Can we withdraw D without taking the nearest point?</strong></summary>

**Scenario:** `A(1)` is the current minimum, but `D(8)` no longer needs processing.

**Result:** `P.remove(loc_D)` returns `D`'s `(8, ("D", 2, 2))` pair. `A` remains in the heap. Calling `remove_min()` instead would take `A`.

</details>

<details>
<summary><strong>Case Study 3: Does a removed locator work again?</strong></summary>

**Scenario:** After removing `D`, we accidentally call `P.update(loc_D, 1, ("D", 1, 0))`.

**Result:** The book's index-and-identity validation rejects this **removed locator** with `ValueError`. To add `D` as a new waiting entry, call `P.add(1, ("D", 1, 0))` and save its **new** locator.

</details>

<details>
<summary><strong>Case Study 4: Can a value change without changing its distance?</strong></summary>

**Scenario:** Before the main trace, turn `A = (1, 2)` into `A = (2, 1)`. Both positions have key `5`.

**Result:** `P.update(loc_A, 5, ("A", 2, 1))` changes the stored point record. The key still satisfies the heap rule, so `_bubble` need not swap any entries. The same locator remains valid.

</details>

<details>
<summary><strong>Case Study 5: What if two points are equally near?</strong></summary>

**Scenario:** Add `E = (-1, -1)`, whose key is `2`, the same as `B = (1, 1)`.

**Result:** Once no smaller-key point is waiting, the queue may return either tied point first through `min()` or `remove_min()`. Nevertheless, `loc_E` still identifies **E's own entry**, so `P.update(loc_E, ...)` or `P.remove(loc_E)` targets `E` specifically.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 9.5 idea | Plain-language meaning | Coordinate-grid example |
| :--- | :--- | :--- |
| **Adaptable priority queue** | A priority queue that can change or remove a specified waiting entry. | Move `A` or withdraw `D` before the next minimum removal. |
| **Locator** | A token for one entry that remains valid while the entry is in its queue. | Keep `loc_A` across both moves of `A`. |
| **Key and value update** | Replace the priority and the data returned with it. | `A: (1, 2), key 5` becomes `A: (0, 1), key 1`. |
| **Arbitrary removal** | Remove the entry named by its locator, even if it is not minimum. | Remove `D(8)` while `A(1)` remains. |
| **Stored index** | Each locator records its current heap-array location. | `loc_A._index` changes from `2` to `0` after up-heap. |
| **Overridden swap** | Keep locator indices correct when heap entries trade places. | Swapping `A` and `B` updates both `_index` fields. |
| **Up-heap or down-heap** | Repair the min-heap after a key change or removal. | `A(1)` rises; later `A(16)` sinks. |
| **Cost** | Locator lookup avoids a scan; heap repair follows one tree path. | `update` is `O(log n)` worst case; `add`, `remove`, and `remove_min` are `O(log n)` amortized with a dynamic array. |

[🔝 Back to Top](#top)
