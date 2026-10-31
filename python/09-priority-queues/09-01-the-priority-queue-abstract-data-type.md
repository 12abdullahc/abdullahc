<span id="top"></span>

# 9.1 The Priority Queue Abstract Data Type — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.1, printed pages 363–364 (the supplied PDF).<br>
> **Topic:** 9.1 The Priority Queue Abstract Data Type; 9.1.1 Priorities; 9.1.2 The Priority Queue ADT.<br>
> **Domain Focus:** Points on a coordinate grid, distance from the origin, and the order in which points are processed.<br>
> **User Prompt:** Reexplain [`Section 9.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Nearest Points First](#background)
   - [1. A small coordinate-grid problem](#background-points)
   - [2. Turn distance into a priority key](#background-key)
2. [Part 1: 9.1 The Priority Queue Abstract Data Type](#part-1)
   - [1. Arrival order and priority order answer different questions](#part-1-orders)
   - [2. What an abstract data type describes](#part-1-adt)
3. [Part 2: 9.1.1 Priorities](#part-2)
   - [1. Why ordinary queue order is sometimes insufficient](#part-2-motivation)
   - [2. The smallest key has first priority](#part-2-minimum)
   - [3. Keys must be comparable](#part-2-comparison)
4. [Part 3: 9.1.2 The Priority Queue ADT](#part-3)
   - [1. An entry has a key and a value](#part-3-entry)
   - [2. The five operations](#part-3-operations)
   - [3. Follow the book's Example 9.1](#part-3-book-example)
5. [Part 4: A Connected Geometry Trace](#part-4)
   - [1. Add, inspect, and remove the points](#part-4-trace)
   - [2. What the trace does and does not promise](#part-4-contract)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Nearest Points First

<span id="background-points"></span>

### 1. A small coordinate-grid problem

Imagine a class recording points on a map. Each point must be checked, and the class wants to check the point **nearest to the origin** `O = (0, 0)` first. Points arrive in this order: `A`, `C`, `B`, then `D`. The class adds all four points before requesting the first one to check.

```text
 y
 3  C  .  .
 2  .  A  D
 1  .  B  .
 0  O  .  .
    0  1  2  x
```

| Point | Coordinates | Arrival position |
| :--- | :--- | ---: |
| `A` | `(1, 2)` | 1st |
| `C` | `(0, 3)` | 2nd |
| `B` | `(1, 1)` | 3rd |
| `D` | `(2, 2)` | 4th |

An ordinary **first-in, first-out (FIFO) queue** would serve `A` first because it arrived first. The geometry task asks a different question: **which point is nearest?** That answer can change when a new point arrives.

<span id="background-key"></span>

### 2. Turn distance into a priority key

For a point `(x, y)`, the Pythagorean theorem gives its distance from the origin as `d = √(x² + y²)`. We can compare the simpler **squared distance** `d² = x² + y²` instead. Since square root increases as a nonnegative number increases, the point with the smallest `d²` is also the nearest point.

| Point | Squared-distance calculation | Priority key `d²` |
| :--- | :--- | ---: |
| `A = (1, 2)` | `1² + 2²` | 5 |
| `C = (0, 3)` | `0² + 3²` | 9 |
| `B = (1, 1)` | `1² + 1²` | 2 |
| `D = (2, 2)` | `2² + 2²` | 8 |

Thus the nearest-first order, if no more points arrive, is **`B`, `A`, `D`, `C`**. The priority queue will use the numbers `2`, `5`, `8`, and `9` to make that choice; it does not need to know how we calculated them.

```python
def squared_distance(point):
    x, y = point
    return x * x + y * y

print(squared_distance((1, 1)))  # 2, the key for B
```

The code prints `2`. Distance has units of grid lengths; squared distance has units of grid lengths squared. We use squared distance only to **compare** which point is closer.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 9.1 The Priority Queue Abstract Data Type

<span id="part-1-orders"></span>

### 1. Arrival order and priority order answer different questions

A FIFO queue removes the earliest arrival. A **priority queue** permits a new item to be added at any time, but removes an item with the highest priority. In this section's convention, **a smaller key means higher priority**.

| Collection | Rule for the next removal | First point in our example |
| :--- | :--- | :--- |
| FIFO queue | Earliest arrival | `A` |
| Priority queue | Smallest priority key | `B` |

The word *queue* does not mean the priority queue must store points in arrival order. The rule describes the **next item returned**, regardless of how a later implementation stores its entries.

<span id="part-1-adt"></span>

### 2. What an abstract data type describes

An **abstract data type (ADT)** gives the operations a collection supports and what each operation must do. It does not prescribe a list, tree, or other storage layout. Section 9.1 tells us what adding a point, asking for the nearest point, and removing the nearest point mean. Later sections of the chapter show ways to implement those behaviors.

> **Mental model:** Calculate a key from the geometry, give the key and its point to the priority queue, and ask the queue for an entry with the smallest key.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 9.1.1 Priorities

<span id="part-2-motivation"></span>

### 1. Why ordinary queue order is sometimes insufficient

The book first recalls a call-center line, where handling calls in arrival order makes sense. It then considers airplane landings and airline standby passengers. A landing decision may depend on distance, waiting time, or fuel; a standby decision may depend on check-in time, fare, or frequent-flyer status. In such situations, **arrival time alone does not define the desired next item**.

Our map problem has the same structure. `B` arrives after `A` and `C`, yet `B` is nearest to `O`. We can insert `B` when it arrives and still let it be the next point removed.

<span id="part-2-minimum"></span>

### 2. The smallest key has first priority

When an item is inserted, the caller supplies an associated **key**. Section 9.1 uses a *minimum-oriented* priority queue: a key of `2` precedes a key of `5`. The queue need only compare keys; it does not calculate distance or interpret point labels.

```text
Arrival:       A(5) → C(9) → B(2) → D(8)
Next minimum:  B(2)
```

Here `A(5)` means point `A` with squared-distance key `5`. The arrows on the first line show **arrival order**, not a promise about internal storage.

<span id="part-2-comparison"></span>

### 3. Keys must be comparable

Keys need not be numbers, but all keys in one priority queue must support a **consistent less-than comparison** (`<`). Our integer squared distances do. In Python 3, mixing an integer key such as `2` with a string key such as `"near"` would not give a meaningful `<` comparison and can raise `TypeError` when compared.

We choose one rule—`x² + y²`—and apply it to every point. The **point label** is separate from the key: `"B"` tells us *which* point won, while `2` tells the queue *why* it won.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 9.1.2 The Priority Queue ADT

<span id="part-3-entry"></span>

### 1. An entry has a key and a value

The priority queue stores **entries**, each a `(key, value)` pair. For our geometry task, the key is squared distance and the value is a point label. For example, `(2, "B")` means that `B` has priority key `2`. The value could instead be the whole point record; the ADT does not restrict it to a string.

The key controls priority. The value is the information we want back when that entry is chosen. Two different entries may have the same key.

<span id="part-3-operations"></span>

### 2. The five operations

| Operation | Meaning | Geometry example |
| :--- | :--- | :--- |
| `P.add(k, v)` | Insert an entry with key `k` and value `v`. | `P.add(5, "A")` records point `A`. |
| `P.min()` | Return a `(key, value)` pair with a minimum key **without removing it**; error if empty. | Inspect the nearest point. |
| `P.remove_min()` | Remove and return a `(key, value)` pair with a minimum key; error if empty. | Take the nearest point for processing. |
| `P.is_empty()` | Return whether there are no entries. | Check whether any points remain. |
| `len(P)` | Return the number of entries. | Count waiting points. |

`P` denotes a priority-queue object. The calls below show the **ADT's behavior**; this section has not chosen a concrete Python class to construct `P`.

If several entries share the minimum key, `min()` or `remove_min()` may return **any one of them**. Section 9.1 does not promise arrival order or alphabetical order among ties. Also, this initial ADT treats a key as **fixed after insertion**; changing a stored key is introduced later in Section 9.5.

<span id="part-3-book-example"></span>

### 3. Follow the book's Example 9.1

Example 9.1 starts with an empty priority queue and inserts `(5, A)`, `(9, C)`, `(3, B)`, and `(7, D)`. Its `min()` call returns `(3, B)` but leaves four entries. Repeated `remove_min()` calls then return `(3, B)`, `(5, A)`, `(7, D)`, and `(9, C)` in that order. After the first two removals, `len(P)` is `2`. After all four, `P.is_empty()` is `True`, and another `remove_min()` causes an error.

The book shows the remaining entries in key order so the example is easy to follow. That display is **not** a requirement for the queue's internal storage. Our point example below uses different numerical keys but exactly the same operation rules.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: A Connected Geometry Trace

<span id="part-4-trace"></span>

### 1. Add, inspect, and remove the points

Start with an empty `P`. Add the points in their arrival order `A`, `C`, `B`, `D`, using the squared-distance table from the background. The final column lists entries by **which would be removed next**, solely to help us reason about the result.

| Operation | Effect or returned result | Entries waiting, in minimum-key order |
| :--- | :--- | :--- |
| `P.add(5, "A")` | Inserts `A` | `A(5)` |
| `P.add(9, "C")` | Inserts `C` | `A(5), C(9)` |
| `P.add(2, "B")` | Inserts `B` | `B(2), A(5), C(9)` |
| `P.add(8, "D")` | Inserts `D` | `B(2), A(5), D(8), C(9)` |
| `P.min()` | `(2, "B")` | `B(2), A(5), D(8), C(9)` |
| `P.remove_min()` | `(2, "B")` | `A(5), D(8), C(9)` |
| `len(P)` | `3` | `A(5), D(8), C(9)` |
| `P.remove_min()` | `(5, "A")` | `D(8), C(9)` |
| `P.remove_min()` | `(8, "D")` | `C(9)` |
| `P.remove_min()` | `(9, "C")` | none |
| `P.is_empty()` | `True` | none |
| `P.remove_min()` | error: queue is empty | none |

The key difference is visible at `P.min()`: it **reports** `B` but does not take `B` out. The following `P.remove_min()` reports and removes `B`.

<span id="part-4-contract"></span>

### 2. What the trace does and does not promise

The table's last column is a **logical removal order**, not a picture of memory. A list implementation might physically rearrange entries; another implementation might use a tree. Either can satisfy the same ADT if it returns a minimum-key entry for `min()` and `remove_min()`.

The keys are calculated **before insertion**. If we changed `A`'s coordinates after calling `P.add(5, "A")`, that existing entry would still have key `5` under Section 9.1's fixed-key model. To keep the geometry and priorities consistent, use fixed coordinates while entries wait or use a later design that supports key changes.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Can a later point be processed first?</strong></summary>

**Scenario:** `A(5)` and `C(9)` are already waiting. We then add `B = (1, 1)` with key `2`.

**Question:** Must `A` be removed first because it arrived first?

**Result:** No. `P.remove_min()` returns `(2, "B")`. The priority queue uses the smaller distance key, even though `B` was added later.

</details>

<details>
<summary><strong>Case Study 2: What if two points are equally near?</strong></summary>

**Scenario:** Alongside `B = (1, 1)`, add `E = (-1, -1)`. Their squared distances are `1² + 1² = 2` and `(-1)² + (-1)² = 2`, respectively.

**Question:** Will `B` win because its name comes first or because it arrived earlier?

**Result:** Neither rule is guaranteed. The minimum key is `2`, so `P.remove_min()` may return `(2, "B")` **or** `(2, "E")`. After one is removed, the other still has minimum key `2`.

</details>

<details>
<summary><strong>Case Study 3: How do we avoid asking for a point when none remain?</strong></summary>

**Scenario:** All four original points have been removed.

**Problem:** `P.min()` and `P.remove_min()` raise an error on an empty priority queue.

**Fix:** Check `P.is_empty()` or `len(P) > 0` before requesting the next point:

```python
if not P.is_empty():
    key, label = P.remove_min()
    print(label, key)
```

Here `P` still stands for any concrete priority queue that follows the Section 9.1 ADT.

</details>

<details>
<summary><strong>Case Study 4: Does moving a point change its stored priority?</strong></summary>

**Scenario:** We inserted `A = (1, 2)` with key `5`, then changed its coordinates in our point table to `(0, 1)`, whose squared distance is `1`.

**Problem:** The existing priority-queue entry still has the supplied key `5`. Merely changing a separate point record does not recalculate the key inside `P`.

**Result:** In Section 9.1's model, treat the priority as fixed while the entry is waiting. Section 9.5 later extends the ADT to support changing a key.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 9.1 idea | Plain-language meaning | Coordinate-grid example |
| :--- | :--- | :--- |
| **Priority queue** | Add entries freely; return an entry with the smallest key next. | `B` is processed before earlier arrivals. |
| **Key** | Comparable information that determines priority. | `x² + y²`, the squared distance from `O`. |
| **Value** | Information returned with the chosen key. | The point label `"B"`. |
| **`add(k, v)`** | Insert one key–value entry. | `P.add(2, "B")`. |
| **`min()`** | Inspect a minimum-key entry without removing it. | See `(2, "B")`; `B` remains waiting. |
| **`remove_min()`** | Remove and return a minimum-key entry. | Take `B` for processing. |
| **`is_empty()` / `len(P)`** | Check whether entries remain or count them. | Avoid asking for a point after all are removed. |
| **Equal keys** | Any tied minimum entry may be chosen. | `B` and `E` are equally near. |
| **Fixed key** | The supplied key does not update by itself. | Moving `A` elsewhere does not change its stored key `5`. |

[🔝 Back to Top](#top)
