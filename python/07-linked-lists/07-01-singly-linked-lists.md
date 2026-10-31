<span id="top"></span>

# 7.1 Singly Linked Lists — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.1, printed pages 256–265 (the supplied PDF).<br>
> **Topic:** 7.1 Singly Linked Lists; 7.1.1 Implementing a Stack with a Singly Linked List; 7.1.2 Implementing a Queue with a Singly Linked List.<br>
> **Domain Focus:** Four rectangular cards, their individual areas, and two ways to keep the cards in order.<br>
> **User Prompt:** Reexplain [`Section 7.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Chain](#background)
   - [1. Keep one set of geometry measurements](#background-cards)
   - [2. Why give each card a link?](#background-links)
2. [Part 1: 7.1 Singly Linked Lists](#part-1)
   - [1. Nodes, head, tail, and traversal](#part-1-nodes)
   - [2. Insert at the head](#part-1-head-insert)
   - [3. Insert at the tail](#part-1-tail-insert)
   - [4. Remove from the head; understand the tail limit](#part-1-remove)
   - [5. Trace the chain and its areas](#part-1-trace)
3. [Part 2: 7.1.1 Implementing a Stack with a Singly Linked List](#part-2)
   - [1. Put the stack top at the head](#part-2-top)
   - [2. Push, top, and pop](#part-2-operations)
   - [3. Time, space, and empty-stack behavior](#part-2-cost)
4. [Part 3: 7.1.2 Implementing a Queue with a Singly Linked List](#part-3)
   - [1. Put the queue front at the head and back at the tail](#part-3-ends)
   - [2. Enqueue, first, and dequeue](#part-3-operations)
   - [3. Keep head and tail correct when the queue empties](#part-3-empty)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Trace its result](#part-4-trace)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Chain

<span id="background-cards"></span>

### 1. Keep one set of geometry measurements

We keep the four physical rectangle cards from the [stack guide](../06-stacks-queues-and-deques/06-01-stacks.md) and [queue guide](../06-stacks-queues-and-deques/06-02-queues.md). For each card, **area = width × height**:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

The sum of their **individual** areas is **6 + 8 + 16 + 4 = 34 cm²**. This sum does not claim that the cards cover a board without gaps or overlap. In this guide, the list stores card labels in order; a separate table of dimensions supplies the areas.

<span id="background-links"></span>

### 2. Why give each card a link?

The [array-based queue guide](../06-stacks-queues-and-deques/06-02-queues.md) stored references in numbered array slots. Adding or removing near the front of a plain array can require shifting many references. An array may also reserve unused capacity and occasionally need to grow. A **linked list** uses one **node** per element. Each node contains a reference to a card label and a reference to the next node.

```text
head                                      tail
 ↓                                         ↓
[A | next] → [B | next] → [C | next] → [D | None]
```

The arrows mean **Python references**, not touching cards or distances in centimetres. A node can be elsewhere in memory from its neighbor. The final node has no next node, so its link is `None`. The card dimensions and the area formula are unchanged; only the way we remember order has changed.

> **Mental model:** An array finds an element by its slot number. A singly linked list finds later elements by following `next` links from the head.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 7.1 Singly Linked Lists

Section 7.1 first explains the chain itself. The book's figures use airport codes as elements; our nodes hold rectangle-card labels. A **list element** is the value we care about (`A`, for example). A **node** is the separate object that holds a reference to that element and a link to the next node.

<span id="part-1-nodes"></span>

### 1. Nodes, head, tail, and traversal

The list keeps a reference to its first node, called `head`. It may also keep `tail`, a reference to its last node, and `size`, the number of nodes. For `[A, B, C, D]`, `head` reaches `A`, `tail` reaches `D`, and `size` is `4`. For an empty chain, both ends are `None` and `size` is `0`. With one node, head and tail refer to that **same node**.

To visit every card, start at the head and follow each `_next` link until it is `None`:

```python
walk = head
while walk is not None:
    print(walk._element)
    walk = walk._next
```

This is a sketch of code **inside** a linked-list implementation; `head` and node fields are private details. It prints `A`, `B`, `C`, `D` in order. Reaching the card at **zero-based index** *k* requires following *k* links from the head, so reading that card takes **O(k + 1)** time; a full traversal is **O(n)** for *n* cards. Having a tail reference makes the **last** node easy to reach, but it does not tell us which node comes immediately before it.

<span id="part-1-head-insert"></span>

### 2. Insert at the head

Start with `[B, C]`, whose individual areas total **8 + 16 = 24 cm²**. To put `A` first, make a new node whose `_next` refers to the old head, then move `head` to the new node:

```text
Before: head → [B] → [C] → None
Link:   new A.next → old head B
After:  head → [A] → [B] → [C] → None
```

In Python-like form, the order of assignments is:

```python
newest = _Node("A", head)  # first preserve the old chain
head = newest             # then expose A as the new first node
size += 1
```

If the list was empty, the old `head` was `None`, so this also creates a valid one-node chain. A list that stores a `tail` reference must then set `tail = newest` as well. No old nodes move, so insertion at the head takes **O(1) worst-case time**. The area total, if our geometry application keeps one, becomes **24 + 6 = 30 cm²**; changing a link by itself does not perform that arithmetic.

<span id="part-1-tail-insert"></span>

### 3. Insert at the tail

Now `[A, B, C]` has area **30 cm²**. To append `D`, make its node with `_next = None`, connect the **old** tail (`C`) to it, and then make `D` the new tail:

```text
Before: head → [A] → [B] → [C] → None   tail → C
After:  head → [A] → [B] → [C] → [D] → None   tail → D
```

```python
newest = _Node("D")
if tail is None:           # empty list
    head = newest
else:
    tail._next = newest    # connect old last node first
tail = newest
size += 1
```

The `tail` reference lets us append in **O(1) worst-case time**; without it, we would have to traverse from `head` to find the last node. The individual-area sum becomes **30 + 4 = 34 cm²**. The empty-list branch matters because there is no old tail to link from.

<span id="part-1-remove"></span>

### 4. Remove from the head; understand the tail limit

Removing the first node means saving its element and advancing `head` to its `_next`:

```python
if head is None:
    raise Empty("List is empty")
answer = head._element
head = head._next
size -= 1
if head is None:
    tail = None            # the removed node was the only node
```

For `[A, B, C, D]`, this returns `A` and leaves `[B, C, D]`. The individual-area sum, if tracked by the application, becomes **34 − 6 = 28 cm²**. Advancing one reference takes **O(1) worst-case time**. The last-node check keeps both end references correct when the list becomes empty.

Removing `D` **from the tail** is different. We can reach `D` directly through `tail`, but to disconnect it we must change `C._next` to `None`. A singly linked node has no link back to `C`, so finding `C` requires a walk from the head: **O(n) time** in general. Section 7.3 will introduce doubly linked lists for operations that need a backward link.

<span id="part-1-trace"></span>

### 5. Trace the chain and its areas

Each row continues from the one above. The area column is maintained by our **geometry activity**, not automatically by the linked list.

| Action | Chain from head to tail | `head` | `tail` | `size` | Sum of individual areas |
| :----- | :---------------------- | :----- | :----- | -----: | ----------------------: |
| Start with `B`, `C` | `[B, C]` | `B` | `C` | 2 | 24 cm² |
| Insert `A` at head | `[A, B, C]` | `A` | `C` | 3 | 30 cm² |
| Insert `D` at tail | `[A, B, C, D]` | `A` | `D` | 4 | 34 cm² |
| Remove head `A` | `[B, C, D]` | `B` | `D` | 3 | 28 cm² |

At every step, the `size` equals the number of nodes reachable from `head`; the last reachable node is `tail` and has `_next = None`. These are useful **invariants**: facts the implementation must keep true after every change.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 7.1.1 Implementing a Stack with a Singly Linked List

The [stack guide](../06-stacks-queues-and-deques/06-01-stacks.md) defined a stack's last-in, first-out behavior using an array. Section 7.1.1 keeps the **same operations** but changes how the stack stores its elements. The book calls this class `LinkedStack`.

<span id="part-2-top"></span>

### 1. Put the stack top at the head

Both `push` and `pop` act at one end. The **head** is the useful end because insertion and removal there each change only one link. After pushing `A`, `B`, `C`, and `D`, the chain is:

```text
top/head → [D] → [C] → [B] → [A] → None
             newest                 oldest
```

The chain is written **top to bottom**, so it looks reversed from the push order. `D` is still the card to undo first. All four physical cards have a combined individual area of **34 cm²**.

<span id="part-2-operations"></span>

### 2. Push, top, and pop

The book's stack stores `_head` and `_size`. Each node stores `_element` and `_next`. Its three main operations work like this:

| Stack operation | Link action | Card result |
| :-------------- | :---------- | :---------- |
| `push("D")` | Create `D` with `_next` set to the old head; make `D` the head. | `D` becomes the newest placement. |
| `top()` | Read `head._element`; change no links. | Return `D`, leaving all four cards. |
| `pop()` | Save `D`; move head to `D._next`. | Return `D`; `C` becomes top. |

Our application subtracts `D`'s 4 cm² **after** the pop, so the area of cards still placed is **34 − 4 = 30 cm²**. The stack itself stores labels and order; it does not know the rectangle formula.

<span id="part-2-cost"></span>

### 3. Time, space, and empty-stack behavior

For *n* stored cards, `push`, `pop`, `top`, `len`, and `is_empty` all take **O(1) worst-case time**, as summarized in the book's Table 7.1. The nodes use **O(n) space**. A linked stack allocates one node per card and does not need an array-resize step; each node also uses memory for its link.

For an empty stack, `_head` is `None` and `_size` is `0`. There is no top card to return, so `top()` and `pop()` raise `Empty`. `len(stack)` is `0`, and `stack.is_empty()` is `True`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 7.1.2 Implementing a Queue with a Singly Linked List

The [queue guide](../06-stacks-queues-and-deques/06-02-queues.md) processed cards in first-in, first-out order with a circular array. Section 7.1.2 implements that same queue behavior with nodes. The book calls this class `LinkedQueue`.

<span id="part-3-ends"></span>

### 1. Put the queue front at the head and back at the tail

The oldest card leaves from the **head**; a new card joins at the **tail**. Both ends need references so that neither operation has to traverse the chain:

```text
head/front ↓                 ↓ tail/back
          [A] → [B] → [C] → [D] → None
           oldest             newest
```

With `A`, `B`, `C`, `D` waiting, the pending individual areas sum to **34 cm²**. The list records arrival order; our geometry activity separately maintains `pending_area`.

<span id="part-3-operations"></span>

### 2. Enqueue, first, and dequeue

| Queue operation | Link action | Card result |
| :-------------- | :---------- | :---------- |
| `enqueue("D")` | Create `D`; set the old tail's `_next` to `D`; make `D` the tail. | `D` joins after `C`. |
| `first()` | Read `head._element`; change no links. | Return `A`; four cards still wait. |
| `dequeue()` | Save the head element; advance head to its `_next`. | Return `A`; `B` is now first. |

After `dequeue()` returns `A`, the geometry activity subtracts **6 cm²**, leaving **34 − 6 = 28 cm²** waiting. The next dequeue returns `B` and leaves **28 − 8 = 20 cm²** waiting. As with the stack, `first`, `dequeue`, `enqueue`, `len`, and `is_empty` all take **O(1) worst-case time**; the queue uses **O(n) space** for *n* cards.

<span id="part-3-empty"></span>

### 3. Keep head and tail correct when the queue empties

When we enqueue into an empty queue, the new node must become **both** `_head` and `_tail`. When we dequeue the only node, both must return to `None`:

```text
empty:     head = None, tail = None
enqueue A: head → [A | None] ← tail
dequeue A: head = None, tail = None
enqueue B: head → [B | None] ← tail
```

If `_tail` still pointed to the removed `A` node, the queue would claim to be empty while retaining a stale reference. The book's `LinkedQueue.dequeue` explicitly clears `_tail` when the size reaches zero. An empty queue raises `Empty` for `first()` or `dequeue()` because there is no waiting card.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

This runnable example uses one private `_Node` class for both collections. The book nests an equivalent node class inside each implementation. The program makes **two separate runs using the same four card measurements**: a board with an Undo stack, then a measurement line with a queue. Thus the area totals describe their own runs and are not added together.

```python
class Empty(Exception):
    """A requested item does not exist because the collection is empty."""


class _Node:
    __slots__ = ("_element", "_next")

    def __init__(self, element, next_node=None):
        self._element = element
        self._next = next_node


class LinkedStack:
    def __init__(self):
        self._head = None
        self._size = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def push(self, element):
        self._head = _Node(element, self._head)
        self._size += 1

    def top(self):
        if self.is_empty():
            raise Empty("Stack is empty")
        return self._head._element

    def pop(self):
        if self.is_empty():
            raise Empty("Stack is empty")
        answer = self._head._element
        self._head = self._head._next
        self._size -= 1
        return answer


class LinkedQueue:
    def __init__(self):
        self._head = None
        self._tail = None
        self._size = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def first(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        return self._head._element

    def enqueue(self, element):
        newest = _Node(element)
        if self.is_empty():
            self._head = newest
        else:
            self._tail._next = newest
        self._tail = newest
        self._size += 1

    def dequeue(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        answer = self._head._element
        self._head = self._head._next
        self._size -= 1
        if self.is_empty():
            self._tail = None
        return answer


CARD_SIZES = {"A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2)}


def area_of(label):
    width, height = CARD_SIZES[label]
    return width * height


# Run 1: place cards on a board and undo the latest placement.
history = LinkedStack()
board_area = 0
for label in ("A", "B", "C", "D"):
    history.push(label)
    board_area += area_of(label)

print("Stack: {} cards, {} cm^2".format(len(history), board_area))
print("Stack top: {}".format(history.top()))
undone = history.pop()
board_area -= area_of(undone)
print("Undo {}: {} cards, {} cm^2".format(undone, len(history), board_area))

# Run 2: let the same cards wait for measurement in arrival order.
waiting = LinkedQueue()
pending_area = 0
for label in ("A", "B", "C", "D"):
    waiting.enqueue(label)
    pending_area += area_of(label)

print("Queue: {} cards, {} cm^2 waiting".format(len(waiting), pending_area))
print("Queue front: {}".format(waiting.first()))
for _ in range(2):
    measured = waiting.dequeue()
    pending_area -= area_of(measured)
    print("Measure {}: {} cards, {} cm^2 waiting".format(
        measured, len(waiting), pending_area
    ))
print("Queue front now: {}".format(waiting.first()))
```

The leading underscore marks node and link details as internal by Python convention. `__slots__` limits each `_Node` to its two named fields. The card measurements remain in `CARD_SIZES`; neither collection class knows what an area is.

<span id="part-4-trace"></span>

### 2. Trace its result

```text
Stack: 4 cards, 34 cm^2
Stack top: D
Undo D: 3 cards, 30 cm^2
Queue: 4 cards, 34 cm^2 waiting
Queue front: A
Measure A: 3 cards, 28 cm^2 waiting
Measure B: 2 cards, 20 cm^2 waiting
Queue front now: C
```

The stack removes the **latest** card `D`; the queue removes the **earliest** cards `A` and then `B`. The arithmetic checks the same fixed dimensions: **34 − 4 = 30**, and **34 − 6 − 8 = 20**. Following links determines *which label* leaves; `area_of` determines *how much area* to subtract.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Add the first card to an empty chain</strong></summary>

**Scenario:** We start a fresh measurement line and enqueue `A`, a 2 cm × 3 cm card.

**Link result:** The new node's `_next` is `None`, and **both** `head` and `tail` refer to it. The size becomes `1`.

**Geometry result:** The pending individual-area sum becomes **0 + 2 × 3 = 6 cm²**. A later `enqueue("B")` attaches `B` after `A`, giving `[A, B]` and **6 + 8 = 14 cm²** waiting.

</details>

<details>
<summary><strong>Case Study 2: Remove the only waiting card, then start again</strong></summary>

**Scenario:** The queue contains only `A`. We measure it and later enqueue `B`.

**Link result:** Dequeuing `A` makes `head = None`, `tail = None`, and `size = 0`. Enqueuing `B` then makes both ends refer to `B`, so `first()` returns `B`.

**Geometry result:** Pending area changes **6 → 0 → 8 cm²**. Clearing the old tail is essential to make the fresh queue reachable from its head.

</details>

<details>
<summary><strong>Case Study 3: Can a tail reference remove the last card quickly?</strong></summary>

**Scenario:** The general chain is `[A, B, C, D]`, and we want to remove `D` while keeping `[A, B, C]`.

**Problem:** `tail` finds `D`, but `D` has no link back to `C`. To set `C._next = None`, we must locate `C` by following links from `head`.

**Result:** The linked-list edit takes **O(n)** time in general. Once `D` is removed, our separate area total changes **34 − 4 = 30 cm²**. The stack avoids this cost by removing from the **head**, not the tail.

</details>

<details>
<summary><strong>Case Study 4: What if we ask an empty collection for a card?</strong></summary>

**Scenario:** We have undone every placement or measured every waiting card.

**Problem:** There is no element for `top()`, `pop()`, `first()`, or `dequeue()` to return. Reading `head._element` when `head` is `None` would fail.

**Fix:** The implementations check `is_empty()` and raise `Empty`. The geometry activity should leave its area total at **0 cm²** and only subtract an area after a successful removal.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 7.1 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Node and `next`** | Store an element reference and a reference to the following node. | `A → B → C → D`; arrows describe order, not distance. |
| **Head and tail** | Remember the first and last nodes. | `A` is first and `D` is last in the original chain. |
| **Traversal** | Follow links from head to visit later elements. | Finding `C` from `A` follows two links. |
| **Head insertion/removal** | Update the head; insertion also sets the new node's next link. Both take O(1) worst-case time. | Add `A` before `B`, or remove `A` to leave `B` first. |
| **Tail insertion** | Use a tail reference to append in O(1) worst-case time. | Add `D` after `C`. |
| **Tail removal limit** | Find the predecessor by walking from the head: O(n). | To remove `D`, locate `C` first. |
| **Linked stack** | Use the head as the last-in, first-out top. | Undo `D`; area of placed cards goes 34 → 30 cm². |
| **Linked queue** | Remove at head and add at tail for first-in, first-out order. | Measure `A`, then `B`; pending area goes 34 → 20 cm². |
| **Empty state** | Both queue ends are `None`; an empty stack has no head. | No card can be read or removed until one is added. |

The linked collections control **order and access**. The rectangle formula supplies the geometry, while the application updates its area totals after successful insertions and removals.

[🔝 Back to Top](#top)
