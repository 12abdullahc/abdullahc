<span id="top"></span>

# 6.2 Queues — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.2, printed pages 239–246 (the supplied PDF).<br>
> **Topic:** 6.2 Queues; 6.2.1 The Queue Abstract Data Type; 6.2.2 Array-Based Queue Implementation.<br>
> **Domain Focus:** Processing rectangular display cards in arrival order while tracking their areas and the slots of a circular array.<br>
> **User Prompt:** Reexplain [`Section 6.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Card-Measurement Line](#background)
   - [1. Keep the rectangle measurements connected](#background-cards)
   - [2. Choose arrival order for measurement](#background-line)
2. [Part 1: 6.2 Queues](#part-1)
   - [1. Front, back, and first in, first out](#part-1-fifo)
   - [2. Trace the pending card areas](#part-1-trace)
3. [Part 2: 6.2.1 The Queue Abstract Data Type](#part-2)
   - [1. Specify the queue operations](#part-2-interface)
   - [2. Handle an empty queue](#part-2-empty)
4. [Part 3: 6.2.2 Array-Based Queue Implementation](#part-3)
   - [1. Why removing list index zero is costly](#part-3-naive)
   - [2. Reuse array slots with circular indices](#part-3-circular)
   - [3. Trace wraparound with the geometry cards](#part-3-wrap)
   - [4. Resize without changing queue order](#part-3-resize)
   - [5. Understand time and space costs](#part-3-cost)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Trace its result](#part-4-trace)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Card-Measurement Line

<span id="background-cards"></span>

### 1. Keep the rectangle measurements connected

The [Section 6.1 stacks guide](06-01-stacks.md) used four physical rectangle cards. We keep their dimensions and individual areas:

| Card | Width | Height | Area, width × height |
| :--- | ----: | -----: | -------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

Together, their individual areas sum to **6 + 8 + 16 + 4 = 34 cm²**. This is a sum of card areas, without assuming anything about a gap-free arrangement on a board.

<span id="background-line"></span>

### 2. Choose arrival order for measurement

Now imagine the cards waiting to be measured by one student. They arrive in order `A`, `B`, `C`, `D`. The student measures the **earliest arrival first**, so `A` leaves the waiting line before `B`. Later, new physical cards `E`, `F`, and `G` can join. `E` has the same dimensions as `A`, `F` as `B`, and `G` as `C`; they are separate cards with their own places in line.

| New card | Dimensions | Area |
| :------- | :--------- | ---: |
| `E` | 2 cm × 3 cm | 6 cm² |
| `F` | 4 cm × 2 cm | 8 cm² |
| `G` | 4 cm × 4 cm | 16 cm² |

The queue stores **labels in arrival order**. A separate dimension table supplies each area. We will maintain a separate `pending_area` total for the cards still waiting.

> **Mental model:** A stack answers “Which card arrived last?” A queue answers “Which card has waited longest?”

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 6.2 Queues

The book introduces a **queue** through lines of people and requests waiting to be served. A queue is **first in, first out**, or **FIFO**: insertion happens at the **back** and removal happens at the **front**.

<span id="part-1-fifo"></span>

### 1. Front, back, and first in, first out

```text
Front                                Back
  A        B        C        D
  ↑ process first                  ↑ newest arrival
```

Adding `E` puts it behind `D`, not ahead of `A`. Processing a card removes `A` from the front; `B` becomes the new front. This differs from the [stack in Section 6.1](06-01-stacks.md), where the most recently added `D` would be removed first.

The queue controls **which card is next**. It does not multiply dimensions or update the pending-area total on its own; our geometry program performs those calculations when cards enter or leave.

<span id="part-1-trace"></span>

### 2. Trace the pending card areas

The queue in this table is written **front to back**. `first()` looks at the front without removing it; `dequeue()` removes and returns it.

| Action | Queue afterward | Next card | Number waiting | Pending area |
| :----- | :-------------- | :-------- | -------------: | -----------: |
| Start | `[]` | none | 0 | 0 cm² |
| `enqueue(A)` | `[A]` | `A` | 1 | 6 cm² |
| `enqueue(B)` | `[A, B]` | `A` | 2 | 14 cm² |
| `enqueue(C)` | `[A, B, C]` | `A` | 3 | 30 cm² |
| `enqueue(D)` | `[A, B, C, D]` | `A` | 4 | 34 cm² |
| `first()` → `A` | `[A, B, C, D]` | `A` | 4 | 34 cm² |
| `dequeue()` → `A` | `[B, C, D]` | `B` | 3 | 28 cm² |
| `dequeue()` → `B` | `[C, D]` | `C` | 2 | 20 cm² |

The first removal subtracts `A`'s 6 cm²: **34 − 6 = 28 cm²**. The second subtracts `B`'s 8 cm²: **28 − 8 = 20 cm²**. The two measured cards total **6 + 8 = 14 cm²**, and **14 + 20 = 34 cm²** still accounts for the original four cards.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 6.2.1 The Queue Abstract Data Type

An **abstract data type (ADT)** defines behavior without requiring a particular storage layout. The queue rule says that the oldest waiting element leaves first; a later section chooses an array to implement that rule.

<span id="part-2-interface"></span>

### 1. Specify the queue operations

For a queue `Q`, Section 6.2.1 gives this interface. Each example row starts independently with `[A, B, C]` from front to back:

| Queue expression | Result or effect | Geometry example |
| :--------------- | :--------------- | :--------------- |
| `Q.enqueue(e)` | Add `e` at the back. | `Q.enqueue("D")` gives `[A, B, C, D]`. |
| `Q.dequeue()` | Remove and return the front. | Returns `A`, leaving `[B, C]`. |
| `Q.first()` | Return the front without removal. | Returns `A`; length stays `3`. |
| `Q.is_empty()` | Report whether nothing is waiting. | `False`. |
| `len(Q)` | Report the number waiting. | `3`. |

The queue ADT can store other types of values besides card labels and has no preset capacity limit. Physical memory still limits a real implementation. It does **not** offer an operation for taking `C` out of the middle while `A` and `B` remain ahead of it.

<span id="part-2-empty"></span>

### 2. Handle an empty queue

For a new queue, `len(Q)` is `0` and `Q.is_empty()` is `True`. Calling `first()` or `dequeue()` then is an error because no card is waiting. The book's `ArrayQueue` raises the `Empty` exception used for its stack.

```python
if not waiting.is_empty():
    next_card = waiting.dequeue()
    print("Measure", next_card)
else:
    print("No cards are waiting.")
```

Here the empty check also prevents our program from trying to subtract an area for a card that does not exist.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 6.2.2 Array-Based Queue Implementation

The book implements a queue with a Python list used as an underlying array. Three values describe its state:

| Name | Meaning | Example after `A` and `B` leave a four-slot array |
| :--- | :------ | :------------------------------------------------- |
| `_data` | The physical array of slots. | `[None, None, C, D]` |
| `_size` | Number of live queue elements. | `2` |
| `_front` | Physical index of the first live element. | `2`, the slot holding `C` |

The **logical queue** is `[C, D]`, even though `_data` has four slots. The leading underscore marks implementation details by Python convention; users of the queue should use the public methods.

<span id="part-3-naive"></span>

### 1. Why removing list index zero is costly

A first attempt might append new cards to a list and use `pop(0)` to take the oldest. Removing index `0` shifts every remaining reference one slot left, so one removal from a line of **n** cards costs **O(n)** time. The queue ADT should not require that shift.

Another attempt might keep a front index and move it right after each removal. That avoids shifts but eventually abandons many slots at the left. Over **m** arrivals, the storage could grow with **m** even when only a few cards are waiting. A **circular array** reuses the freed slots.

<span id="part-3-circular"></span>

### 2. Reuse array slots with circular indices

For an array with capacity **N**, its physical indices are `0` through `N − 1`. After the last index, we return to index `0`. The `%` operator gives the remainder: `4 % 4 = 0`, so advancing from slot `3` in a four-slot array wraps to slot `0`.

| Purpose | Formula | Four-slot example |
| :------ | :------ | :---------------- |
| New front after removing one card | `(_front + 1) % N` | If front is `3`, the next front is `0`. |
| Slot for a new card | `(_front + _size) % N` | If front is `2` and size is `2`, use slot `0`. |
| Slot for the k-th waiting card | `(_front + k) % N` | If front is `2`, card 2 is in slot `0`. |

The last row counts `k` from `0`, so card `0` is the front. The insertion formula uses `_size` **before** increasing it. When removing, the implementation sets the vacated slot to `None` to release its reference to the removed card label.

<span id="part-3-wrap"></span>

### 3. Trace wraparound with the geometry cards

We use **four slots only for the study example**, so the wrap happens quickly. The book's class starts with ten slots. After `A`, `B`, `C`, and `D` arrive, the four slots are full:

```text
Index:          0    1    2    3
Physical slot: [A]  [B]  [C]  [D]     _front = 0, _size = 4
Logical queue:  A →  B →  C →  D
```

After measuring `A` and `B`, slots `0` and `1` are free, `_front = 2`, and `_size = 2`. New card `E` joins at **(2 + 2) % 4 = 0**; `F` joins at **(2 + 3) % 4 = 1**.

```text
Index:          0    1    2    3
Physical slot: [E]  [F]  [C]  [D]     _front = 2, _size = 4
Logical queue:  C →  D →  E →  F
```

The physical left-to-right order is now `E, F, C, D`, but **`C` is still first**. The pending area is **16 + 4 + 6 + 8 = 34 cm²**. The index arithmetic changes where entries are stored; it never changes FIFO order.

<span id="part-3-resize"></span>

### 4. Resize without changing queue order

The queue is full when `G` arrives. The book's implementation doubles the array, copying existing elements in **logical front-to-back order** into the new array starting at index `0`. Then `_front` becomes `0`:

```text
Before growth, capacity 4: [E, F, C, D]                 front = 2
After growth, capacity 8:  [C, D, E, F, ·, ·, ·, ·]     front = 0
After enqueue(G):          [C, D, E, F, G, ·, ·, ·]     front = 0
```

Here `·` means an unused slot. The logical queue after the resize is `[C, D, E, F, G]`, and its area is **16 + 4 + 6 + 8 + 16 = 50 cm²**. The next card remains `C`; resizing does not serve anyone or change the arrival order.

<span id="part-3-cost"></span>

### 5. Understand time and space costs

Let **n** be the number of cards currently waiting. Reading the front, checking emptiness, and reading the length take **O(1)** worst-case time. A normal `enqueue` writes one slot and takes O(1), but an enqueue that doubles the array copies **n** elements and takes **O(n)**. Across many enqueues, the copying cost averages to **O(1) amortized** per enqueue.

The complete program below follows the book's main implementation: `dequeue` clears one slot and moves `_front`, so it takes **O(1) worst-case time**. This version does not shrink its array; after many removals, it may keep storage sized for its largest past queue.

The book also describes an **optional shrinking rule** after a removal:

```python
if 0 < self._size < len(self._data) // 4:
    self._resize(len(self._data) // 2)
```

Here `//` means whole-number division. In an eight-slot array, size `2` does not trigger a shrink because `2 < 8 // 4` is false; after one more removal, size `1` does, and the array becomes four slots. With this rule, a rare `dequeue` can copy O(n) elements, but `dequeue` remains **O(1) amortized**, and storage is **O(n)** for the current queue size (apart from a fixed minimum capacity). Shrinking at roughly one-quarter full leaves space before the next expansion, avoiding repeated full-array copies when arrivals and removals alternate near half capacity. The complete program uses the basic version without this optional rule.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

Save this as `rectangle_card_queue.py`. It uses an optional `initial_capacity` argument so this study run can start with four slots and show wraparound. The book's default starting capacity is ten; both versions use the same circular formulas and doubling rule.

```python
class Empty(Exception):
    """Raised when first or dequeue needs a card but the queue is empty."""


class ArrayQueue:
    def __init__(self, initial_capacity=10):
        if initial_capacity < 1:
            raise ValueError("Capacity must be positive")
        self._data = [None] * initial_capacity
        self._size = 0
        self._front = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def first(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        return self._data[self._front]

    def dequeue(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        answer = self._data[self._front]
        self._data[self._front] = None
        self._front = (self._front + 1) % len(self._data)
        self._size -= 1
        return answer

    def enqueue(self, item):
        if self._size == len(self._data):
            self._resize(2 * len(self._data))
        available = (self._front + self._size) % len(self._data)
        self._data[available] = item
        self._size += 1

    def _resize(self, new_capacity):
        old_data = self._data
        old_capacity = len(old_data)
        self._data = [None] * new_capacity
        for offset in range(self._size):
            old_index = (self._front + offset) % old_capacity
            self._data[offset] = old_data[old_index]
        self._front = 0


card_sizes = {
    "A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2),
    "E": (2, 3), "F": (4, 2), "G": (4, 4),
}


def card_area(label):
    width, height = card_sizes[label]
    return width * height


waiting = ArrayQueue(initial_capacity=4)
pending_area = 0
measured_area = 0

for label in ("A", "B", "C", "D"):
    waiting.enqueue(label)
    pending_area += card_area(label)

print(f"Start: {len(waiting)} waiting, {pending_area} cm^2; first = {waiting.first()}")

for _ in range(2):
    label = waiting.dequeue()
    area = card_area(label)
    pending_area -= area
    measured_area += area
    print(f"Measured {label}: {area} cm^2; pending = {pending_area} cm^2")

for label in ("E", "F"):
    waiting.enqueue(label)
    pending_area += card_area(label)

print(f"After E and F: {len(waiting)} waiting, {pending_area} cm^2; first = {waiting.first()}")

waiting.enqueue("G")
pending_area += card_area("G")
print(f"After G: {len(waiting)} waiting, {pending_area} cm^2; first = {waiting.first()}")
print(f"Accounted for: {measured_area} measured + {pending_area} pending = {measured_area + pending_area} cm^2")
```

The queue stores labels and controls the measurement order. `card_area` and the two running totals handle the geometry. By the end, all seven cards received have individual areas totaling **6 + 8 + 16 + 4 + 6 + 8 + 16 = 64 cm²**.

<span id="part-4-trace"></span>

### 2. Trace its result

```text
Start: 4 waiting, 34 cm^2; first = A
Measured A: 6 cm^2; pending = 28 cm^2
Measured B: 8 cm^2; pending = 20 cm^2
After E and F: 4 waiting, 34 cm^2; first = C
After G: 5 waiting, 50 cm^2; first = C
Accounted for: 14 measured + 50 pending = 64 cm^2
```

`first()` reports `C` after the circular wrap and again after resizing. The two measured cards have area **6 + 8 = 14 cm²**. The five waiting cards have area **16 + 4 + 6 + 8 + 16 = 50 cm²**, so all received area is accounted for: **14 + 50 = 64 cm²**.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which card should be measured first?</strong></summary>

**Scenario:** `A`, `B`, `C`, and `D` arrive in that order.

**Result:** `first()` returns `A`, and the queue stays `[A, B, C, D]` with 34 cm² pending. `dequeue()` then returns `A`, leaving `[B, C, D]` and **34 − 6 = 28 cm²** pending. The latest card `D` would be removed first by a stack, not by this queue.

</details>

<details>
<summary><strong>Case Study 2: Can a slot before the front be used again?</strong></summary>

**Scenario:** After measuring `A` and `B`, a four-slot array has `[None, None, C, D]`, `_front = 2`, and `_size = 2`.

**Calculation:** `E` goes to `(2 + 2) % 4 = 0`; `F` goes to `(2 + 3) % 4 = 1`.

**Result:** The physical array is `[E, F, C, D]`, but the waiting order is `[C, D, E, F]`. `C` remains first, and the pending area is **16 + 4 + 6 + 8 = 34 cm²**.

</details>

<details>
<summary><strong>Case Study 3: Does resizing change who is next?</strong></summary>

**Scenario:** The four slots are full in logical order `[C, D, E, F]`, and `G` arrives.

**Action:** Double the capacity to eight, copy `[C, D, E, F]` to the beginning, then add `G` at index `4`.

**Result:** The queue is `[C, D, E, F, G]`. `first()` still returns `C`, and the pending area is **34 + 16 = 50 cm²**.

</details>

<details>
<summary><strong>Case Study 4: Does the queue know the total area?</strong></summary>

**Scenario:** Two cards have been measured, and five are waiting after `G` arrives.

**Check:** `measured_area = 6 + 8 = 14 cm²`; `pending_area = 16 + 4 + 6 + 8 + 16 = 50 cm²`. The total received area is **14 + 50 = 64 cm²**.

**Meaning:** The queue determines FIFO order. The program must separately look up dimensions and maintain the area totals.

</details>

<details>
<summary><strong>Case Study 5: What if the measurement line is empty?</strong></summary>

**Scenario:** A new queue contains no cards.

**Result:** `len(waiting)` is `0` and `waiting.is_empty()` is `True`. Both `waiting.first()` and `waiting.dequeue()` raise `Empty`, because there is no first card. Check `is_empty()` before processing when an empty line is expected.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 6.2 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Queue / FIFO** | The oldest waiting element leaves first. | Measure `A` before `B`, `C`, or `D`. |
| **Queue ADT** | Define `enqueue`, `dequeue`, `first`, `is_empty`, and `len` without choosing storage. | Add `E` at the back; inspect `C` at the front. |
| **Circular array** | Reuse freed slots by wrapping indices with `%`. | Place `E` in slot `0` while `C` remains the front in slot `2`. |
| **Logical versus physical order** | Arrival order may differ from left-to-right array order. | Physical `[E, F, C, D]` means logical `[C, D, E, F]`. |
| **Resize** | Copy queue elements in front-to-back order into a larger array. | Grow to eight slots before adding `G`; `C` remains first. |
| **Amortized enqueue** | Most insertions are O(1); a rare resize is O(n). | Adding `G` copies four waiting labels first. |
| **Optional shrinking** | Halve storage below one-quarter full to bound retained space. | A much shorter waiting line need not keep its largest past array. |

[🔝 Back to Top](#top)
