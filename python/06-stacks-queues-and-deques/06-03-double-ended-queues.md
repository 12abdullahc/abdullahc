<span id="top"></span>

# 6.3 Double-Ended Queues — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.3, printed pages 247–249 (the supplied PDF).<br>
> **Topic:** 6.3 Double-Ended Queues; 6.3.1 The Deque Abstract Data Type; 6.3.2 Implementing a Deque with a Circular Array; 6.3.3 Deques in the Python Collections Module.<br>
> **Domain Focus:** A tray of rectangular cards that can receive or release cards at either end, with separate area accounting.<br>
> **User Prompt:** Reexplain [`Section 6.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Two-Ended Card Tray](#background)
   - [1. Keep the rectangle-card measurements](#background-cards)
   - [2. Why both ends are useful](#background-tray)
2. [Part 1: 6.3 Double-Ended Queues](#part-1)
   - [1. Connect deques to stacks and queues](#part-1-connection)
   - [2. Trace one card sequence](#part-1-trace)
3. [Part 2: 6.3.1 The Deque Abstract Data Type](#part-2)
   - [1. Name the eight operations](#part-2-interface)
   - [2. Keep peeking separate from deleting](#part-2-empty)
4. [Part 3: 6.3.2 Implementing a Deque with a Circular Array](#part-3)
   - [1. Locate the front and back](#part-3-indices)
   - [2. Add and delete at either end](#part-3-operations)
   - [3. Trace physical slots and a resize](#part-3-trace)
   - [4. Understand the costs](#part-3-cost)
5. [Part 4: 6.3.3 Deques in the Python Collections Module](#part-4)
   - [1. Translate the ADT into Python methods](#part-4-map)
   - [2. Understand extra operations and bounded deques](#part-4-extra)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace its result](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Two-Ended Card Tray

<span id="background-cards"></span>

### 1. Keep the rectangle-card measurements

The [Section 6.1 stacks guide](06-01-stacks.md) and [Section 6.2 queues guide](06-02-queues.md) use the same physical rectangular cards. We keep their dimensions and individual areas:

| Card | Width | Height | Area, width × height |
| :--- | ----: | -----: | -------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |
| `E` | 2 cm | 3 cm | 6 cm² |
| `F` | 4 cm | 2 cm | 8 cm² |
| `G` | 4 cm | 4 cm | 16 cm² |

`E`, `F`, and `G` are new physical cards, even though their dimensions repeat those of `A`, `B`, and `C`. The original four cards total **6 + 8 + 16 + 4 = 34 cm²**. All seven total **34 + 6 + 8 + 16 = 64 cm²**. These are sums of individual card areas, without assuming the cards form a gap-free board.

<span id="background-tray"></span>

### 2. Why both ends are useful

Imagine a tray used while checking the card measurements. The student can take the card at the **front** for routine measurement, or take the card at the **back** to correct the most recent placement. An urgent new card can enter at the front; a routine new card can enter at the back.

```text
Front                                      Back
  A        B        C        D
  ↑ first card                         ↑ last card
```

The student chooses which end to use. The data structure does not decide that a card is urgent or sort cards by area. It stores their **order**; a separate dimension table and running total handle the geometry.

> **Mental model:** A deque exposes both ends of a sequence. Each insertion or deletion names the end it uses.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 6.3 Double-Ended Queues

A **double-ended queue**, usually called a **deque** and pronounced “deck,” supports adding and deleting at both its front and its back. The book's restaurant wait-list example shows why access to both ends can be useful; our card tray uses the same rule.

<span id="part-1-connection"></span>

### 1. Connect deques to stacks and queues

| Restricted deque use | Behavior | Card example |
| :------------------- | :------- | :----------- |
| Add at back, delete at front | Queue, first in first out (FIFO) | `A` leaves before `D`. |
| Add and delete at the same end | Stack, last in first out (LIFO) | If the back is the top, `D` leaves before `A`. |
| Add and delete at either end | Deque | Remove `A` from the front or `D` from the back. |

The deque's two ends are useful, but they do not make every item directly available. If `[A, B, C, D]` is stored, the core deque operations cannot delete `C` while leaving the cards on both sides in place. That would require more general sequence operations.

<span id="part-1-trace"></span>

### 2. Trace one card sequence

Start with `[A, B, C, D]` from **front to back**. The pending-area total is maintained by the surrounding program, not by the deque itself.

| Action | Deque afterward, front → back | Pending area |
| :----- | :---------------------------- | -----------: |
| Start with `A`, `B`, `C`, `D` | `[A, B, C, D]` | 34 cm² |
| `first()` → `A`; `last()` → `D` | `[A, B, C, D]` | 34 cm² |
| `delete_first()` → `A` | `[B, C, D]` | 28 cm² |
| `delete_last()` → `D` | `[B, C]` | 24 cm² |
| `add_first(E)` | `[E, B, C]` | 30 cm² |
| `add_last(F)` | `[E, B, C, F]` | 38 cm² |
| `add_first(G)` | `[G, E, B, C, F]` | 54 cm² |

The removals account for **area(`A`) + area(`D`) = 6 + 4 = 10 cm²**. The five cards still in the tray account for **16 + 6 + 8 + 16 + 8 = 54 cm²** when listed as `G, E, B, C, F`. Thus **10 + 54 = 64 cm²**, the area of all seven distinct cards that entered this study case.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 6.3.1 The Deque Abstract Data Type

An **abstract data type (ADT)** states what operations mean without choosing storage. The deque ADT has operations at **both** ends. Each example row below starts independently with `[A, B, C, D]` from front to back:

<span id="part-2-interface"></span>

### 1. Name the eight operations

| Deque expression | Result or effect | Geometry example |
| :--------------- | :--------------- | :--------------- |
| `D.add_first(e)` | Insert `e` at the front. | `add_first(E)` gives `[E, A, B, C, D]`. |
| `D.add_last(e)` | Insert `e` at the back. | `add_last(F)` gives `[A, B, C, D, F]`. |
| `D.delete_first()` | Remove and return the front. | Returns `A`, leaving `[B, C, D]`. |
| `D.delete_last()` | Remove and return the back. | Returns `D`, leaving `[A, B, C]`. |
| `D.first()` | Read the front without removal. | Returns `A`; length remains `4`. |
| `D.last()` | Read the back without removal. | Returns `D`; length remains `4`. |
| `D.is_empty()` | Report whether the deque has no elements. | `False`. |
| `len(D)` | Report its number of elements. | `4`. |

The ADT can hold arbitrary elements and does not prescribe a maximum capacity. A concrete computer still has finite memory.

<span id="part-2-empty"></span>

### 2. Keep peeking separate from deleting

`first()` and `last()` only **peek**. They do not subtract any card area or change the number of waiting cards. `delete_first()` and `delete_last()` remove an element, so the program must subtract that card's area if it maintains a pending-area total.

On an empty deque, either peek or deletion is an error: there is no front or back card. A book-style implementation may raise its `Empty` exception. Python's `collections.deque` instead raises `IndexError` when `popleft()`, `pop()`, `D[0]`, or `D[-1]` is attempted on an empty deque.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 6.3.2 Implementing a Deque with a Circular Array

The book extends the [Section 6.2 circular queue](06-02-queues.md). It keeps `_data` for physical slots, `_size` for the number of live entries, and `_front` for the physical index of the first entry. The full array-backed deque class is left as an exercise in the book; the formulas below explain its design.

<span id="part-3-indices"></span>

### 1. Locate the front and back

Let **N** be the array capacity. `% N` wraps an index back to the start after slot `N − 1`.

| What to locate | Formula | Four-slot example |
| :------------- | :------ | :---------------- |
| Front | `_front` | If `_front = 1`, the first card is in slot `1`. |
| Back | `(_front + _size − 1) % N` | With front `1` and size `3`, the back is slot `3`. |
| Insertion slot before the front, when `_size < N` | `(_front − 1) % N` | With front `0` and size `3`, slot `3` is free. |
| Insertion slot after the back, when `_size < N` | `(_front + _size) % N` | With front `1` and size `2`, slot `3` is free. |

For a nonempty deque, the k-th logical card from the front is in slot `(_front + k) % N`, counting `k` from `0`. An empty deque has no meaningful back card, so `last()` must check `_size` before using the back formula. When `_size = N`, neither insertion slot is free; resize before adding at either end.

<span id="part-3-operations"></span>

### 2. Add and delete at either end

`add_last` and `delete_first` work like the queue's `enqueue` and `dequeue`. The new operations work at the other ends:

```python
# Sketches of methods inside an array-backed deque class.
def add_first(self, item):
    if self._size == len(self._data):
        self._resize(2 * len(self._data))
    self._front = (self._front - 1) % len(self._data)
    self._data[self._front] = item
    self._size += 1

def delete_last(self):
    if self.is_empty():
        raise Empty("Deque is empty")
    back = (self._front + self._size - 1) % len(self._data)
    answer = self._data[back]
    self._data[back] = None
    self._size -= 1
    return answer
```

Before writing into a full array, `add_first` doubles capacity and copies the current logical order into the larger array, just as the queue did. Clearing a deleted slot to `None` releases its reference. The snippets are **method sketches**; the complete program in Part 5 uses Python's standard-library deque.

<span id="part-3-trace"></span>

### 3. Trace physical slots and a resize

Use a four-slot **teaching array**, starting with `A`, `B`, `C`, `D`. This is a trace of the circular-array design, not the physical layout of `collections.deque`.

| Action | Physical slots `0, 1, 2, 3` | `_front` | `_size` | Logical deque, front → back |
| :----- | :-------------------------- | -------: | ------: | :-------------------------- |
| Start | `[A, B, C, D]` | 0 | 4 | `[A, B, C, D]` |
| Delete front `A` | `[·, B, C, D]` | 1 | 3 | `[B, C, D]` |
| Delete back `D` | `[·, B, C, ·]` | 1 | 2 | `[B, C]` |
| Add front `E` | `[E, B, C, ·]` | 0 | 3 | `[E, B, C]` |
| Add back `F` | `[E, B, C, F]` | 0 | 4 | `[E, B, C, F]` |

Here `·` means an unused slot. When `G` arrives at the front, the four-slot array is full. The resize copies the logical order `[E, B, C, F]` into slots `0` through `3` of an eight-slot array and sets `_front = 0`. Then `add_first(G)` moves `_front` to **(0 − 1) % 8 = 7** and places `G` there:

```text
Index:          0  1  2  3  4  5  6  7
Physical slot:  E  B  C  F  ·  ·  ·  G
Logical deque:  G → E → B → C → F
Front index:    7
```

Physical left-to-right order and logical front-to-back order differ. The first card is `G` in slot `7`, and the last is `F` in slot `3`. The same logical sequence and **54 cm²** pending area appeared in Part 1.

<span id="part-3-cost"></span>

### 4. Understand the costs

`first`, `last`, `is_empty`, and `len` read a fixed amount of state, so each is **O(1) worst-case**. An insertion or deletion at either end changes only one slot and an index in the normal case. A resize can copy **n** entries, so end operations that trigger resizing are **O(1) amortized** over a long sequence and can take **O(n)** individually.

As with the [array queue](06-02-queues.md), a design that only grows may retain capacity based on its largest past size after many deletions. Optional shrinking can keep storage proportional to the current number of entries while making some deletions trigger a resize. The book leaves the full array-deque implementation to Exercise P-6.32.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 6.3.3 Deques in the Python Collections Module

Python's `collections` module provides a ready-to-use `deque`. Its method names differ from the abstract names in Part 2, but the two ends behave the same way.

<span id="part-4-map"></span>

### 1. Translate the ADT into Python methods

| Deque ADT operation | `collections.deque` expression | Effect |
| :------------------ | :----------------------------- | :----- |
| `add_first(e)` | `d.appendleft(e)` | Add at the front. |
| `add_last(e)` | `d.append(e)` | Add at the back. |
| `delete_first()` | `d.popleft()` | Remove and return the front. |
| `delete_last()` | `d.pop()` | Remove and return the back. |
| `first()` | `d[0]` | Read the front without removal. |
| `last()` | `d[-1]` | Read the back without removal. |
| `is_empty()` | `len(d) == 0` | Test whether it has no entries. |
| `len(D)` | `len(d)` | Count its entries. |

The names `append` and `pop` match Python lists' right-end methods; the `left` variants name the front. The book describes efficient operations at both ends. It also notes that indexing near the **middle** of a `collections.deque` can take **O(n)** time; it is not an array with equally fast access to every index. Our program below uses only the ends.

<span id="part-4-extra"></span>

### 2. Understand extra operations and bounded deques

The Python class also offers operations beyond the core deque ADT. `rotate(1)` moves the back element to the front, so `[A, B, C, D]` becomes `[D, A, B, C]` without changing the **34 cm²** area sum. `clear()` removes all entries; `count("A")` counts matching labels; `remove("C")` can remove a matching entry even from the middle. Python also permits indexed replacement such as `d[1] = "E"`; finding a middle index can take O(n). Those extras have their own costs and are not the core eight ADT operations.

A `deque(maxlen=4)` has a **fixed maximum length**. When it is full, `append` discards one element from the opposite, front end; `appendleft` discards one from the back. For example:

| Action on a bounded deque | Contents, front → back | Pending area |
| :------------------------ | :--------------------- | -----------: |
| Start with `[A, B, C, D]` | `[A, B, C, D]` | 34 cm² |
| `append(E)` | `[B, C, D, E]` (`A` discarded) | 34 − 6 + 6 = 34 cm² |
| `appendleft(F)` | `[F, B, C, D]` (`E` discarded) | 34 − 6 + 8 = 36 cm² |

This automatic discard is a feature of a **bounded Python deque**, not a rule of the unbounded deque ADT. An area-tracking program using `maxlen` must account for the discarded card as well as the new one. The complete program below uses an unbounded deque so no card disappears automatically.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. The complete program

Save this as `rectangle_card_deque.py`. It follows the Part 1 card sequence using `collections.deque`. The card dimensions, pending area, and removed area are kept outside the deque.

```python
from collections import deque


card_sizes = {
    "A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2),
    "E": (2, 3), "F": (4, 2), "G": (4, 4),
}


def card_area(label):
    width, height = card_sizes[label]
    return width * height


tray = deque(["A", "B", "C", "D"])
pending_area = sum(card_area(label) for label in tray)
removed_area = 0

print(f"Start: {list(tray)}; pending = {pending_area} cm^2")
print(f"Peeks: first = {tray[0]}, last = {tray[-1]}; pending = {pending_area} cm^2")

left_card = tray.popleft()
left_area = card_area(left_card)
pending_area -= left_area
removed_area += left_area
print(f"Removed front {left_card}: {list(tray)}; pending = {pending_area} cm^2")

right_card = tray.pop()
right_area = card_area(right_card)
pending_area -= right_area
removed_area += right_area
print(f"Removed back {right_card}: {list(tray)}; pending = {pending_area} cm^2")

tray.appendleft("E")
pending_area += card_area("E")
print(f"Added front E: {list(tray)}; pending = {pending_area} cm^2")

tray.append("F")
pending_area += card_area("F")
print(f"Added back F: {list(tray)}; pending = {pending_area} cm^2")

tray.appendleft("G")
pending_area += card_area("G")
print(f"Added front G: {list(tray)}; pending = {pending_area} cm^2")

print(f"Accounted for: {removed_area} removed + {pending_area} pending = {removed_area + pending_area} cm^2")
```

`list(tray)` is used only to show the current order for this small study trace. Converting the whole deque for display takes O(n) time; the program's end operations use the deque directly.

<span id="part-5-trace"></span>

### 2. Trace its result

```text
Start: ['A', 'B', 'C', 'D']; pending = 34 cm^2
Peeks: first = A, last = D; pending = 34 cm^2
Removed front A: ['B', 'C', 'D']; pending = 28 cm^2
Removed back D: ['B', 'C']; pending = 24 cm^2
Added front E: ['E', 'B', 'C']; pending = 30 cm^2
Added back F: ['E', 'B', 'C', 'F']; pending = 38 cm^2
Added front G: ['G', 'E', 'B', 'C', 'F']; pending = 54 cm^2
Accounted for: 10 removed + 54 pending = 64 cm^2
```

The two peeks do not change the tray. Each deletion removes a card's area from `pending_area`; each addition increases it. The final equality **10 + 54 = 64 cm²** checks that the areas of all seven cards are accounted for.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Are the first and last cards the same operation?</strong></summary>

**Scenario:** The tray contains `[A, B, C, D]`, with 34 cm² pending.

**Check:** `first()` reads `A` (6 cm²) and `last()` reads `D` (4 cm²). Neither removes a card, so the tray still has four cards and 34 cm² pending. Python's corresponding reads are `tray[0]` and `tray[-1]`.

</details>

<details>
<summary><strong>Case Study 2: How do removals at opposite ends affect area?</strong></summary>

**Scenario:** Start from `[A, B, C, D]` with 34 cm² pending.

**Calculation:** Remove front `A`: **34 − 6 = 28 cm²**. Then remove back `D`: **28 − 4 = 24 cm²**.

**Result:** `[B, C]` remains, and its area is **8 + 16 = 24 cm²**. The two removed cards total 10 cm².

</details>

<details>
<summary><strong>Case Study 3: What does a wrapped front index mean?</strong></summary>

**Scenario:** The four-slot teaching array is full at `[E, B, C, F]`. A resize to eight slots occurs before adding `G` at the front.

**Calculation:** The resized front starts at `0`, so the slot before it is **(0 − 1) % 8 = 7**.

**Result:** Slot `7` stores `G`; the logical order is `[G, E, B, C, F]`, not the physical left-to-right order. `G` is first even though its physical slot has the highest index.

</details>

<details>
<summary><strong>Case Study 4: Can a deque pick the largest card from the middle?</strong></summary>

**Scenario:** The core deque contains `[E, B, C, F]`. Card `C` has area 16 cm², larger than either end card.

**Result:** Core deque deletion can remove only `E` or `F` next. It does not sort by area or directly delete middle `C`. Python's `collections.deque` has extra methods such as `remove`, but those are outside the core ADT.

</details>

<details>
<summary><strong>Case Study 5: What changes when `maxlen=4`?</strong></summary>

**Scenario:** A bounded Python deque contains `[A, B, C, D]` at capacity four, with 34 cm² pending.

**Action:** `append(E)` discards `A` from the front and adds `E` at the back, leaving `[B, C, D, E]`.

**Result:** The area remains **34 − 6 + 6 = 34 cm²**. If the program only adds `E`'s area and forgets the discarded `A`, its total is wrong. An unbounded deque does not discard `A` here.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 6.3 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Deque** | A sequence that supports adding and deleting at both ends. | Insert `E` at the front or `F` at the back. |
| **Stack / queue connection** | Restrict which ends are used to obtain LIFO or FIFO behavior. | Remove `D` from the back or `A` from the front. |
| **Deque ADT** | Define eight end and status operations without choosing storage. | `first()` reads `A`; `delete_last()` removes `D`. |
| **Circular array** | Wrap physical indices while keeping logical order. | `G` goes in slot `7` but is the logical front. |
| **Resize** | Copy entries in logical order before using a larger array. | `[E, B, C, F]` stays in that order before adding `G`. |
| **`collections.deque`** | Python supplies end operations with different method names. | `appendleft("E")` and `pop()` change opposite ends. |
| **Bounded `maxlen`** | A full deque discards from the opposite end when adding. | Adding `E` to `[A, B, C, D]` discards `A`. |

[🔝 Back to Top](#top)
