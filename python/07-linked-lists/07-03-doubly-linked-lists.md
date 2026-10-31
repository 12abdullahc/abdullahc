<span id="top"></span>

# 7.3 Doubly Linked Lists — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.3, printed pages 270–276 (the supplied PDF).<br>
> **Topic:** 7.3 Doubly Linked Lists; Inserting and Deleting with a Doubly Linked List; 7.3.1 Basic Implementation of a Doubly Linked List; 7.3.2 Implementing a Deque with a Doubly Linked List.<br>
> **Domain Focus:** A two-ended tray of rectangular cards, their individual areas, and direct access to either end.<br>
> **User Prompt:** Reexplain [`Section 7.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Two-Ended Rectangle-Card Tray](#background)
   - [1. Keep the geometry measurements connected](#background-cards)
   - [2. Why a backward link helps](#background-backward)
2. [Part 1: 7.3 Doubly Linked Lists](#part-1)
   - [1. Give each node two directions](#part-1-two-links)
   - [2. Insert between known neighbors](#part-1-insert)
   - [3. Delete a known node](#part-1-delete)
3. [Part 2: 7.3.1 Basic Implementation of a Doubly Linked List](#part-2)
   - [1. Keep fixed header and trailer sentinels](#part-2-sentinels)
   - [2. Make one insertion helper work everywhere](#part-2-helper-insert)
   - [3. Make one deletion helper reconnect the neighbors](#part-2-helper-delete)
4. [Part 3: 7.3.2 Implementing a Deque with a Doubly Linked List](#part-3)
   - [1. Map the deque operations to the two sentinels](#part-3-operations)
   - [2. Trace the card tray and its area ledger](#part-3-trace)
   - [3. Handle empty ends and understand the costs](#part-3-cost)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Check the program's result](#part-4-result)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Two-Ended Rectangle-Card Tray

<span id="background-cards"></span>

### 1. Keep the geometry measurements connected

We keep the four physical cards from the [singly linked list guide](07-01-singly-linked-lists.md) and [circularly linked list guide](07-02-circularly-linked-lists.md). Their areas use **width × height**:

| Card | Width | Height | Individual area |
| :--- | ----: | -----: | --------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

All four have a combined **individual-area sum** of **6 + 8 + 16 + 4 = 34 cm²**. This sum does not assume that they form one solid shape. A tray stores their **order**. A separate dimension table supplies each area, and our activity maintains a running total for the cards currently in the tray.

<span id="background-backward"></span>

### 2. Why a backward link helps

Imagine the tray holds `[A, B, C]` from front to back. Their areas total **6 + 8 + 16 = 30 cm²**. We can add or take a card at either end, as in the [deque guide](../06-stacks-queues-and-deques/06-03-double-ended-queues.md).

In a **singly** linked list, a tail reference reaches `C`, but removing `C` requires finding `B` so we can end the chain after `B`. That search takes **O(n)** time for *n* cards. A **doubly** linked node has a reference to its predecessor. From `C`, we can reach `B` directly and update the neighboring links in **O(1) time**, once we have the `C` node.

> **Mental model:** A backward link lets a node name the neighbor before it. The tray still keeps card measurements separate from its links.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 7.3 Doubly Linked Lists

Section 7.3 gives every node three fields: a reference to its **element**, a `_prev` reference to the previous node, and a `_next` reference to the next node. The book's Figure 7.10 draws the structure with airport codes; here the elements are card labels.

<span id="part-1-two-links"></span>

### 1. Give each node two directions

```text
Front                                             Back
  A  ⇄  B  ⇄  C

A._next is B       B._prev is A
B._next is C       C._prev is B
```

The two arrows between neighbors stand for **two references**. They do not say that the physical cards touch or that their centers are a particular distance apart. We can walk forward with `_next` or backward with `_prev`. For example, after reaching `C`, one `_prev` step reaches `B`.

For a real node `x` between two neighbors, the links must agree: `x._prev._next is x` and `x._next._prev is x`. This agreement is what allows local insertion and deletion. It does **not** give direct access to the card at numeric index *j*: we must still follow links to find that node, which can take **O(n)** time.

<span id="part-1-insert"></span>

### 2. Insert between known neighbors

The book's unnumbered “Inserting and Deleting with a Doubly Linked List” discussion begins with a node inserted between a known predecessor and successor (Figure 7.11). Suppose we temporarily place `D` between `A` and `B`:

```text
Before: A ⇄ B ⇄ C                    area sum = 30 cm²
After:  A ⇄ D ⇄ B ⇄ C                area sum = 34 cm²
```

To make the new node `D`, set its `_prev` to `A` and its `_next` to `B`; then set `A._next` to `D` and `B._prev` to `D`. Only these neighboring references change. The tray's geometry ledger separately adds `D`'s **2 × 2 = 4 cm²**.

The insertion takes **O(1) time when the two adjacent nodes are already known**. The book's Figure 7.12 shows that adding at the front is the same local operation when fixed endpoint nodes are present.

<span id="part-1-delete"></span>

### 3. Delete a known node

To remove that same `D` from `[A, D, B, C]`, use `D._prev` to reach `A` and `D._next` to reach `B`. Reconnect the neighbors with `A._next = B` and `B._prev = A`:

```text
Before: A ⇄ D ⇄ B ⇄ C                area sum = 34 cm²
After:  A ⇄ B ⇄ C                    area sum = 30 cm²
```

This takes **O(1) time given the `D` node**, as in the book's Figure 7.13. If we know only the value `"D"` and have no node reference or index, finding it may still require an **O(n) traversal**. Removing `D` does not itself subtract 4 cm²; our geometry activity does that after the deletion returns its label.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 7.3.1 Basic Implementation of a Doubly Linked List

The book creates a nonpublic `_DoublyLinkedBase` class. It stores a fixed **header** node before the first real item, a fixed **trailer** node after the last real item, and `_size`, the number of real items. The endpoint nodes are **sentinels**: they simplify link updates and do not represent cards.

<span id="part-2-sentinels"></span>

### 1. Keep fixed header and trailer sentinels

```text
Empty:      header ⇄ trailer                 size = 0, area = 0 cm²
One card:   header ⇄ A ⇄ trailer             size = 1, area = 6 cm²
Three:      header ⇄ A ⇄ B ⇄ C ⇄ trailer     size = 3, area = 30 cm²
```

In the empty state, `header._next is trailer` and `trailer._prev is header`. With `A` alone, `header._next is A`, `A._prev is header`, `A._next is trailer`, and `trailer._prev is A`. The header's outer `_prev` and trailer's outer `_next` can be `None`; those outer fields are not used to reach real cards.

Because the sentinels **stay in place**, every real node has a predecessor and a successor, even when it is the only card. `_size` excludes the two sentinels. The front real card is `header._next`; the back real card is `trailer._prev`.

<span id="part-2-helper-insert"></span>

### 2. Make one insertion helper work everywhere

The base class's `_insert_between(element, predecessor, successor)` assumes its two given nodes are already **adjacent**. It creates a node between them, updates both neighbors, increases `_size`, and returns the new node:

```python
newest = _Node(element, predecessor, successor)
predecessor._next = newest
successor._prev = newest
size += 1
return newest
```

These lines are a sketch of the internal helper; the complete class below uses `self._Node` and `self._size`. To put `D` at the front of `[A, B, C]`, the adjacent pair is `(header, A)`. To put it at the back, the pair is `(C, trailer)`. Even an empty tray supplies an adjacent pair: `(header, trailer)`. No separate empty-list branch is needed inside this helper.

<span id="part-2-helper-delete"></span>

### 3. Make one deletion helper reconnect the neighbors

The base class's `_delete_node(node)` assumes `node` is a **real** node, not a sentinel. It finds the predecessor and successor through the node, links those two together, reduces `_size`, and returns the removed element:

```python
predecessor = node._prev
successor = node._next
predecessor._next = successor
successor._prev = predecessor
size -= 1
answer = node._element
node._element = node._prev = node._next = None
return answer
```

Clearing the removed node's fields marks it as no longer part of the list and releases its references. If the only real node was `A`, deleting it restores `header ⇄ trailer`. The helper itself does **not** check whether the deque is empty; the public deletion methods do that before choosing a node.

Both helpers use a fixed number of link changes, so each takes **O(1) worst-case time when its node arguments are already known**. The sentinels remove end-case branching from the helpers; they do not make searching for a card label constant time.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 7.3.2 Implementing a Deque with a Doubly Linked List

The [deque guide in Section 6.3](../06-stacks-queues-and-deques/06-03-double-ended-queues.md) defined the two-ended operations and used a circular array. Here `LinkedDeque` **inherits** the base class's storage and helpers, then exposes the same deque behavior through six public end operations. Section 6.3 calls its insertions `add_first` and `add_last`; this implementation names those same actions `insert_first` and `insert_last`.

<span id="part-3-operations"></span>

### 1. Map the deque operations to the two sentinels

For `[A, B, C]`, each row starts from that same three-card tray independently:

| Operation | How the linked deque performs it | Geometry result |
| :-------- | :------------------------------- | :-------------- |
| `first()` | Read `header._next._element`. | Return `A`; area stays 30 cm². |
| `last()` | Read `trailer._prev._element`. | Return `C`; area stays 30 cm². |
| `insert_first("D")` | Insert between header and old first node. | `[D, A, B, C]`; area becomes 34 cm². |
| `insert_last("D")` | Insert between old last node and trailer. | `[A, B, C, D]`; area becomes 34 cm². |
| `delete_first()` | Delete the node after header. | Return `A`; area becomes 24 cm². |
| `delete_last()` | Delete the node before trailer. | Return `C`; area becomes 14 cm². |

The deque methods change **order and membership**. The area effects in the last column are changes our separate application would make; the class itself knows only labels.

<span id="part-3-trace"></span>

### 2. Trace the card tray and its area ledger

Now continue one sequence of physical card moves. We start with `[A, B, C]` after the temporary interior-link example has been undone. The header and trailer stay fixed throughout.

| Action | Real cards, front to back | `first()` | `last()` | `len` | Individual-area sum |
| :----- | :------------------------ | :-------- | :------- | ----: | ------------------: |
| Start | `[A, B, C]` | `A` | `C` | 3 | 30 cm² |
| `insert_first("D")` | `[D, A, B, C]` | `D` | `C` | 4 | 34 cm² |
| `delete_last()` returns `C` | `[D, A, B]` | `D` | `B` | 3 | 18 cm² |
| `delete_first()` returns `D` | `[A, B]` | `A` | `B` | 2 | 14 cm² |
| `insert_last("C")` | `[A, B, C]` | `A` | `C` | 3 | 30 cm² |

The first deletion removes **C's 16 cm²** from 34, giving **18 cm²**. The second removes **D's 4 cm²**, leaving **14 cm²**. Putting the same physical `C` back restores **14 + 16 = 30 cm²**. The `delete_last()` step is especially important: `trailer._prev` finds `C` directly, and `C._prev` finds `B`, so there is no walk from the front.

<span id="part-3-cost"></span>

### 3. Handle empty ends and understand the costs

For an empty deque, `len(D)` is `0` and `D.is_empty()` is `True`. `first()`, `last()`, `delete_first()`, and `delete_last()` raise `Empty` because no real card exists. `insert_first()` and `insert_last()` work on an empty deque by inserting between the two sentinels.

All six end operations, `len`, and `is_empty` take **O(1) worst-case time**. For *n* cards, nodes use **O(n) space**, with two link references per real node plus the fixed sentinels. Unlike the circular-array deque, no resize step is needed. Neither a deque nor the back links provide constant-time lookup of an arbitrary card label in the middle; searching still takes **O(n)** time.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

This runnable version follows the book's `_DoublyLinkedBase` and `LinkedDeque` structure. The base maintains the links; the deque chooses which end to use. `CARD_SIZES` and `tray_area` belong to the geometry activity, not to either class.

```python
class Empty(Exception):
    """A requested item does not exist because the deque is empty."""


class _DoublyLinkedBase:
    class _Node:
        __slots__ = ("_element", "_prev", "_next")

        def __init__(self, element, prev_node=None, next_node=None):
            self._element = element
            self._prev = prev_node
            self._next = next_node

    def __init__(self):
        self._header = self._Node(None)
        self._trailer = self._Node(None)
        self._header._next = self._trailer
        self._trailer._prev = self._header
        self._size = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def _insert_between(self, element, predecessor, successor):
        newest = self._Node(element, predecessor, successor)
        predecessor._next = newest
        successor._prev = newest
        self._size += 1
        return newest

    def _delete_node(self, node):
        predecessor = node._prev
        successor = node._next
        predecessor._next = successor
        successor._prev = predecessor
        self._size -= 1
        answer = node._element
        node._element = node._prev = node._next = None
        return answer


class LinkedDeque(_DoublyLinkedBase):
    def first(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        return self._header._next._element

    def last(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        return self._trailer._prev._element

    def insert_first(self, element):
        self._insert_between(element, self._header, self._header._next)

    def insert_last(self, element):
        self._insert_between(element, self._trailer._prev, self._trailer)

    def delete_first(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        return self._delete_node(self._header._next)

    def delete_last(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        return self._delete_node(self._trailer._prev)


CARD_SIZES = {"A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2)}


def area_of(label):
    width, height = CARD_SIZES[label]
    return width * height


def report(action, tray, area):
    print("{}: first {}, last {}, {} cards, {} cm^2".format(
        action, tray.first(), tray.last(), len(tray), area
    ))


tray = LinkedDeque()
tray_area = 0
for label in ("A", "B", "C"):
    tray.insert_last(label)
    tray_area += area_of(label)
report("Start", tray, tray_area)

tray.insert_first("D")
tray_area += area_of("D")
report("Add D at front", tray, tray_area)

removed = tray.delete_last()
tray_area -= area_of(removed)
report("Take {} from back".format(removed), tray, tray_area)

removed = tray.delete_first()
tray_area -= area_of(removed)
report("Take {} from front".format(removed), tray, tray_area)

tray.insert_last("C")
tray_area += area_of("C")
report("Put C back", tray, tray_area)
```

`report` reads both ends without removing them; the tray is nonempty every time it is called. The same physical `C` card returns at the end, so there are never two copies of `C` in the tray.

<span id="part-4-result"></span>

### 2. Check the program's result

```text
Start: first A, last C, 3 cards, 30 cm^2
Add D at front: first D, last C, 4 cards, 34 cm^2
Take C from back: first D, last B, 3 cards, 18 cm^2
Take D from front: first A, last B, 2 cards, 14 cm^2
Put C back: first A, last C, 3 cards, 30 cm^2
```

The link operations select or reorder cards. The separate area ledger applies **30 + 4 = 34**, then **34 − 16 = 18**, **18 − 4 = 14**, and **14 + 16 = 30**. The sentinels are not counted as cards and contribute no area.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What do the sentinels do in an empty tray?</strong></summary>

**Scenario:** We start with no cards, insert `A`, and then delete it from the back.

**Link result:** Empty means `header ⇄ trailer`, but `len(tray) = 0`. Inserting `A` makes `header ⇄ A ⇄ trailer`; deleting that only real node reconnects `header ⇄ trailer`. No sentinel is added or removed.

**Geometry result:** The tray area changes **0 → 6 → 0 cm²**. The two sentinel nodes never contribute area.

</details>

<details>
<summary><strong>Case Study 2: Why is deleting the back card now quick?</strong></summary>

**Scenario:** The tray contains `[D, A, B, C]` with **34 cm²** of individual card area. We take `C` from the back.

**Link result:** `trailer._prev` reaches `C`, and `C._prev` reaches `B`. Reconnecting `B` to `trailer` takes a fixed number of updates, leaving `[D, A, B]`.

**Geometry result:** **34 − 16 = 18 cm²** remains. A singly linked tail node does not reveal its predecessor, so its general tail deletion would require a walk from the head.

</details>

<details>
<summary><strong>Case Study 3: Does a backward link make every search constant time?</strong></summary>

**Scenario:** We have `[A, D, B, C]` and want to remove interior card `D`.

**If we already hold `D`'s node:** Its neighbors are immediately available through `_prev` and `_next`; deleting it takes **O(1)** time, and the area sum changes **34 − 4 = 30 cm²**.

**If we know only the label `"D"`:** We first have to find its node by following links, which may take **O(n)** time. The deque interface here offers end operations, not a search-by-label method.

</details>

<details>
<summary><strong>Case Study 4: Does reading an end change the geometry?</strong></summary>

**Scenario:** In `[D, A, B, C]`, `first()` returns `D` and `last()` returns `C`.

**Geometry check:** A rectangle's perimeter is **2 × (width + height)**. `D` has perimeter **2 × (2 + 2) = 8 cm**; `C` has perimeter **2 × (4 + 4) = 16 cm**. Their individual areas are 4 cm² and 16 cm².

**Result:** Peeking at either end removes no card. The tray still contains all four cards, so its individual-area sum remains **34 cm²**.

</details>

<details>
<summary><strong>Case Study 5: What if the tray is empty when we read or delete?</strong></summary>

**Scenario:** All real cards have been removed, leaving only header and trailer.

**Problem:** `header._next` is the trailer sentinel, and `trailer._prev` is the header sentinel. Neither holds a card label to report or remove.

**Fix:** `first()`, `last()`, `delete_first()`, and `delete_last()` check `is_empty()` and raise `Empty`. A geometry program should not subtract any area when a removal fails; the tray's total stays **0 cm²**.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 7.3 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **`_prev` and `_next`** | A real node refers to both neighboring nodes. | From `C`, `_prev` reaches `B` directly. |
| **Known-node update** | Insert or delete locally in O(1) time when the relevant nodes are known. | Place `D` between `A` and `B`, then remove it. |
| **Search still costs** | Locating a node by label or index may need O(n) traversal. | Knowing only `"D"` is different from holding its node. |
| **Header and trailer** | Fixed dummy endpoints keep real nodes between neighbors. | Empty tray is `header ⇄ trailer`, with area 0 cm². |
| **Base helpers** | `_insert_between` and `_delete_node` maintain both directions and `_size`. | Add `D` at the front or remove `C` from the back. |
| **Linked deque** | Expose reading, inserting, and deleting at either end. | Start `[A, B, C]`, add `D` at front, take `C` from back. |
| **Empty behavior** | Reads and deletions raise `Empty` when no real node exists. | The sentinels are never returned as cards. |
| **Cost** | End operations take O(1) worst-case time; nodes use O(n) space. | Taking `C` from the back needs no front-to-back scan. |

The doubly linked structure maintains the **card order**. The application uses the cards' width and height to maintain a separate **area total** after each successful tray change.

[🔝 Back to Top](#top)
