<span id="top"></span>

# 7.2 Circularly Linked Lists — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.2, printed pages 266–269 (the supplied PDF).<br>
> **Topic:** 7.2 Circularly Linked Lists; 7.2.1 Round-Robin Schedulers; 7.2.2 Implementing a Queue with a Circularly Linked List.<br>
> **Domain Focus:** Four rectangular cards taking turns to color their 1 cm² squares.<br>
> **User Prompt:** Reexplain [`Section 7.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rotating Rectangle-Card Activity](#background)
   - [1. Keep the same four rectangles](#background-cards)
   - [2. Give each unfinished card another turn](#background-turns)
2. [Part 1: 7.2 Circularly Linked Lists](#part-1)
   - [1. Close the chain into a cycle](#part-1-cycle)
   - [2. Choose a current node; rotate the viewpoint](#part-1-current)
   - [3. Know when a traversal has made one lap](#part-1-traversal)
3. [Part 2: 7.2.1 Round-Robin Schedulers](#part-2)
   - [1. Share turns with a fixed work budget](#part-2-budget)
   - [2. Compare removal and reinsertion with rotation](#part-2-rotate)
   - [3. Trace the first lap of the geometry activity](#part-2-first-lap)
4. [Part 3: 7.2.2 Implementing a Queue with a Circularly Linked List](#part-3)
   - [1. Store only the tail and the size](#part-3-state)
   - [2. Enqueue without losing the front](#part-3-enqueue)
   - [3. Read or remove the front](#part-3-front)
   - [4. Rotate, handle empty states, and count the cost](#part-3-rotate-cost)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Trace all nine turns](#part-4-trace)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rotating Rectangle-Card Activity

<span id="background-cards"></span>

### 1. Keep the same four rectangles

The [Section 7.1 guide](07-01-singly-linked-lists.md) used four physical rectangle cards. Imagine each card ruled into **1 cm × 1 cm squares**. Its area tells us how many such squares it contains:

| Card | Width | Height | Area = number of 1 cm² squares |
| :--- | ----: | -----: | -----------------------------: |
| `A` | 2 cm | 3 cm | 6 cm² = 6 squares |
| `B` | 4 cm | 2 cm | 8 cm² = 8 squares |
| `C` | 4 cm | 4 cm | 16 cm² = 16 squares |
| `D` | 2 cm | 2 cm | 4 cm² = 4 squares |

Together the cards contain **6 + 8 + 16 + 4 = 34** unit squares. We are counting the cards' individual areas, without assuming that they form one gap-free shape. The queue below stores **card labels**; a separate table stores dimensions and the number of squares left to color.

<span id="background-turns"></span>

### 2. Give each unfinished card another turn

Suppose a student colors **at most four 1 cm² squares per turn**. The cards start in order `A, B, C, D`. After a turn, an unfinished card moves logically to the back so the next card can go. A finished card leaves the activity.

For example, `A` begins with 6 squares. Its first turn colors 4, leaving **6 − 4 = 2**. The next card is `B`, while `A` waits behind `D`:

```text
Before A's turn: front → A → B → C → D ← back
After A's turn:  front → B → C → D → A ← back
```

Only **4 of 34 squares** have been colored; **30** remain. Changing the queue order does not color anything by itself. The geometry activity updates its own remaining-area numbers after each turn.

> **Mental model:** A circular link lets us revisit unfinished work. One pointer can mark where the next turn starts.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 7.2 Circularly Linked Lists

The [singly linked list in Section 7.1](07-01-singly-linked-lists.md) ended with a node whose `_next` was `None`. A **circularly linked list** instead makes the final node's `_next` refer to the first node. The book's Figures 7.7–7.8 show this with stops on a repeating route.

<span id="part-1-cycle"></span>

### 1. Close the chain into a cycle

For our four card nodes, the links are:

```text
A.next = B     B.next = C     C.next = D     D.next = A

Follow links from A:  A → B → C → D → A → B → ...
```

The last link is a **real reference back to `A`**; it is not `None`. The arrows describe node references, not positions on the classroom table or geometric distances. A one-node circular list points back to itself: `A.next = A`.

This differs from the [circular array in the queue guide](../06-stacks-queues-and-deques/06-02-queues.md). That array reused numbered slots with `%` arithmetic; its last slot did not contain a reference to its first slot. Here the nodes themselves form a cycle.

<span id="part-1-current"></span>

### 2. Choose a current node; rotate the viewpoint

A cycle has **no intrinsic first or last node**. We choose a reference named `current` when we need to say whose turn it is. If `current` refers to `A`, one step makes `current = current._next`, which refers to `B`. Repeating the step gives `C`, `D`, and then `A` again.

For a **queue**, we choose a different but useful reference: `tail` means the back, and `tail._next` means the front. With `tail` at `D`, the front is `A`:

```text
tail = D                front = tail._next = A
Queue order:            A → B → C → D → A → ...

After one rotation:     tail = A, front = B
Queue order:            B → C → D → A → B → ...
```

The four links are **unchanged** by that rotation. Only the chosen tail reference moves from `D` to `A`. Queue size stays `4`; the cards still contain **34 cm²** in total, with 4 cm² colored only if the geometry activity actually did that work.

<span id="part-1-traversal"></span>

### 3. Know when a traversal has made one lap

Following `_next` until `None` would **never stop** in a nonempty circular list. A queue that stores its size can visit exactly that many nodes:

```python
walk = tail._next                 # front node in a nonempty queue
for _ in range(size):
    print(walk._element)
    walk = walk._next
```

With `size = 4`, this prints `A`, `B`, `C`, `D` once, and `walk` is back at `A`. A second lap would visit the **same four cards again**. If we incorrectly added their areas on both laps, we would calculate **68 cm²** even though the four cards still contain only **34 cm²**.

The code is a sketch **inside** the data structure; user code should normally use the queue's public operations.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 7.2.1 Round-Robin Schedulers

A **round-robin scheduler** gives each waiting task a turn, then returns an unfinished task to the back. The book discusses this for tasks sharing a resource, such as CPU time. Our cards are the tasks, and coloring up to four unit squares is one turn. If each square takes the same amount of work, four squares form a fixed maximum work budget per turn.

<span id="part-2-budget"></span>

### 1. Share turns with a fixed work budget

The card sizes differ, but a large card such as `C` cannot color all 16 squares in one turn: the other waiting cards get turns before `C` is served again. `C` needs **16 ÷ 4 = 4** full turns; `D` needs **4 ÷ 4 = 1**. `A` needs one full turn and a final turn for its remaining **2** squares.

The rule for one turn is:

1. Look at the front card without removing it.
2. Color the smaller of **4** and that card's remaining number of squares.
3. If no squares remain, remove the front card. Otherwise, rotate it to the back.

This keeps the queue for **unfinished** cards only. A finished card must leave rather than keep receiving empty turns.

<span id="part-2-rotate"></span>

### 2. Compare removal and reinsertion with rotation

An ordinary linked queue can move an unfinished front card to the back by **dequeueing** its label and **enqueueing** it again. The book's Figure 7.9 shows those ordinary queue steps. The following text gives the circular alternative: service the front element, then call `rotate()`. Both give the same next-card order, but rotation only moves the tail reference and keeps the existing node.

```text
Start:             [A, B, C, D]   front A, tail D
Dequeue + enqueue: [B, C, D, A]   A leaves and a new node is added
Rotate:            [B, C, D, A]   nodes and links stay in place
```

In the book's scheduling discussion the front element is sometimes called `front`; the executable queue class names the read-only method `first()`. We use `first()` in the program below. Neither `first()` nor `rotate()` changes the area remaining; coloring does.

<span id="part-2-first-lap"></span>

### 3. Trace the first lap of the geometry activity

Each row continues from the preceding one. The card at the front gets up to four squares colored. If it still has squares left, `rotate()` moves it behind the other active cards.

| Turn | Card | Squares colored this turn | Squares left on that card | Queue afterward, front to back | Squares colored in total |
| ---: | :--- | ------------------------: | ------------------------: | :----------------------------- | -----------------------: |
| 1 | `A` | 4 | 2 | `[B, C, D, A]` | 4 |
| 2 | `B` | 4 | 4 | `[C, D, A, B]` | 8 |
| 3 | `C` | 4 | 12 | `[D, A, B, C]` | 12 |
| 4 | `D` | 4 | 0 | `[A, B, C]` | 16 |

`D` finishes on turn 4, so the program **dequeues** it rather than rotating it. After this lap, **34 − 16 = 18** unit squares remain across `A`, `B`, and `C`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 7.2.2 Implementing a Queue with a Circularly Linked List

The book implements `CircularQueue` with the same queue operations as the linked queue from Section 7.1, plus `rotate()`. Its Code Fragments 7.9–7.10 store a `_tail` node reference and a `_size` count; no separate `_head` is needed.

<span id="part-3-state"></span>

### 1. Store only the tail and the size

| State | `_tail` | Front node | Important link |
| :---- | :------ | :--------- | :------------- |
| Empty | `None` | none | There is no node to follow. |
| One card `A` | `A` | `A` | `A._next is A`. |
| Four cards `[A, B, C, D]` | `D` | `A` | `D._next is A`. |

For every nonempty queue, **front = `_tail._next`**. Following exactly `_size` links from the front returns to that same front node. `rotate()` does not change `_size`; `enqueue()` increases it by one and `dequeue()` decreases it by one. These facts are the representation's invariants.

<span id="part-3-enqueue"></span>

### 2. Enqueue without losing the front

When the queue is empty, a new node must point to **itself**. When the queue already contains cards, a new node joins after the old tail and before the front. The next short sketches use `tail` and `size` for the queue's internal fields; the complete class below uses `self._tail` and `self._size`:

```python
newest = _Node("D")
if tail is None:
    newest._next = newest          # one-node cycle
else:
    newest._next = tail._next      # preserve old front
    tail._next = newest           # old tail now points to new node
tail = newest
size += 1
```

For `[A, B, C]`, this yields `[A, B, C, D]`: `A` stays at the front and `D` becomes the tail. The order of link assignments matters. If we overwrote the old tail's link before saving the old front, we could lose the reference needed to complete the cycle. Each assignment is constant time, so `enqueue()` is **O(1) worst-case**.

<span id="part-3-front"></span>

### 3. Read or remove the front

`first()` returns `_tail._next._element` without changing the queue. `dequeue()` saves that front element and bypasses its node:

```python
if tail is None:
    raise Empty("Queue is empty")
old_head = tail._next
answer = old_head._element
if size == 1:
    tail = None                    # no nodes remain
else:
    tail._next = old_head._next    # old second becomes front
size -= 1
return answer
```

From `[A, B, C, D]`, `dequeue()` returns `A` and makes `B` the front. From `[D]`, it returns `D`, leaves `_tail = None`, and makes the size `0`. The queue itself does not subtract card area; our geometry activity does that when it finishes coloring a card. Both `first()` and `dequeue()` are **O(1) worst-case**.

<span id="part-3-rotate-cost"></span>

### 4. Rotate, handle empty states, and count the cost

Rotation is the extra operation that makes this queue useful for turns:

```python
if size > 0:
    tail = tail._next
```

With four cards, the old front `A` becomes the new tail, and `B` becomes the new front. With **one** card, `tail._next is tail`, so rotation changes nothing. With an **empty** queue, rotation is a no-op. It never creates or removes a node and never changes `_size`.

| Operation | Result | Worst-case time |
| :-------- | :----- | --------------: |
| `enqueue(e)` | Add at the back. | O(1) |
| `first()` | Read the front; raise `Empty` if empty. | O(1) |
| `dequeue()` | Remove the front; raise `Empty` if empty. | O(1) |
| `rotate()` | Move the front logically to the back. | O(1) |
| `len(Q)`, `Q.is_empty()` | Read the stored size. | O(1) |

The *n* nodes use **O(n) space** for *n* waiting cards. There is no array to resize, but each node needs a link reference.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

This implementation follows the book's tail-only design. The queue stores only labels; `remaining` and `colored_total` belong to the geometry activity. Each turn colors at most **four 1 cm² squares**. An unfinished card rotates, and a finished card is removed.

```python
class Empty(Exception):
    """A requested item does not exist because the queue is empty."""


class CircularQueue:
    class _Node:
        __slots__ = ("_element", "_next")

        def __init__(self, element, next_node=None):
            self._element = element
            self._next = next_node

    def __init__(self):
        self._tail = None
        self._size = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def first(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        return self._tail._next._element

    def enqueue(self, element):
        newest = self._Node(element)
        if self.is_empty():
            newest._next = newest
        else:
            newest._next = self._tail._next
            self._tail._next = newest
        self._tail = newest
        self._size += 1

    def dequeue(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        old_head = self._tail._next
        answer = old_head._element
        if self._size == 1:
            self._tail = None
        else:
            self._tail._next = old_head._next
        self._size -= 1
        return answer

    def rotate(self):
        if not self.is_empty():
            self._tail = self._tail._next


CARD_SIZES = {"A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2)}
SQUARES_PER_TURN = 4
waiting = CircularQueue()
remaining = {}

for label in ("A", "B", "C", "D"):
    width, height = CARD_SIZES[label]
    remaining[label] = width * height
    waiting.enqueue(label)

colored_total = 0
turn = 0
while not waiting.is_empty():
    label = waiting.first()
    colored_now = min(SQUARES_PER_TURN, remaining[label])
    remaining[label] -= colored_now
    colored_total += colored_now
    turn += 1

    if remaining[label] == 0:
        waiting.dequeue()
        print("Finished {} on turn {}; {} cm^2 colored".format(
            label, turn, colored_total
        ))
    else:
        waiting.rotate()

print("All cards complete: {} cm^2 in {} turns".format(colored_total, turn))
```

The program uses `min` so `A` colors only its remaining **2** squares on its last turn, rather than trying to color four. Its fixed card order comes from the explicit `("A", "B", "C", "D")` tuple.

<span id="part-4-trace"></span>

### 2. Trace all nine turns

The queue column shows the order **after** each turn. A completed card is removed; an unfinished card rotates to the back.

| Turn | Card served | Squares colored | Squares left on that card | Queue afterward | Cumulative colored area |
| ---: | :---------- | --------------: | ------------------------: | :-------------- | ----------------------: |
| 1 | `A` | 4 | 2 | `[B, C, D, A]` | 4 cm² |
| 2 | `B` | 4 | 4 | `[C, D, A, B]` | 8 cm² |
| 3 | `C` | 4 | 12 | `[D, A, B, C]` | 12 cm² |
| 4 | `D` | 4 | 0 | `[A, B, C]` | 16 cm² |
| 5 | `A` | 2 | 0 | `[B, C]` | 18 cm² |
| 6 | `B` | 4 | 0 | `[C]` | 22 cm² |
| 7 | `C` | 4 | 8 | `[C]` | 26 cm² |
| 8 | `C` | 4 | 4 | `[C]` | 30 cm² |
| 9 | `C` | 4 | 0 | `[]` | 34 cm² |

The program prints only completed cards and the final total:

```text
Finished D on turn 4; 16 cm^2 colored
Finished A on turn 5; 18 cm^2 colored
Finished B on turn 6; 22 cm^2 colored
Finished C on turn 9; 34 cm^2 colored
All cards complete: 34 cm^2 in 9 turns
```

The four completed areas add to **34 cm²** exactly: `A` contributes 6, `B` 8, `C` 16, and `D` 4. Each rotation changes the next label to serve but leaves the total area and number of nodes unchanged; only coloring changes `remaining` and `colored_total`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What does a one-card cycle look like?</strong></summary>

**Scenario:** Only card `C`, a 4 cm × 4 cm rectangle, is waiting.

**Link result:** Its node is both the tail and the front, and `tail._next is tail`. Calling `rotate()` leaves that same node at the front and keeps the size at `1`.

**Geometry result:** Each turn colors 4 of `C`'s 16 unit squares. It takes **16 ÷ 4 = 4** turns. The first three turns rotate the one-node cycle; the fourth finishes `C` and dequeues it.

</details>

<details>
<summary><strong>Case Study 2: What happens after the last card finishes?</strong></summary>

**Scenario:** Card `D` is the only waiting card, and its four squares are colored.

**Link result:** `dequeue()` sets `_tail = None` and `_size = 0`. An empty `rotate()` does nothing. A later `enqueue("A")` makes a fresh one-node cycle in which `A._next` refers to `A`.

**Geometry result:** The remaining area changes **4 → 0 cm²** when `D` finishes. The newly added, separate `A` card would bring **6 cm²** of new work; the old `D` is not still waiting.

</details>

<details>
<summary><strong>Case Study 3: Why not traverse until a None link?</strong></summary>

**Scenario:** The queue is `[A, B, C, D]`, and we want to sum each card's area once.

**Problem:** Every `_next` refers to another node, so a `while walk is not None:` loop would keep visiting the same four cards. It would never reach a stopping value.

**Fix:** Visit exactly `len(queue) = 4` nodes, or stop when the traversal returns to its starting node. One lap gives **6 + 8 + 16 + 4 = 34 cm²**; a second lap would double-count the same cards.

</details>

<details>
<summary><strong>Case Study 4: Does rotation color the next card?</strong></summary>

**Scenario:** At the start of turn 5 in the trace, `A` has 2 squares left and is at the front of `[A, B, C]`.

**Problem:** Calling `rotate()` only makes `B` the front. `A` still has 2 squares left; the colored total is unchanged.

**Fix:** Color up to four squares first, update the geometry totals, and then either `dequeue()` a finished `A` or `rotate()` an unfinished one. Here coloring 2 finishes `A`, so it leaves the queue and `B` becomes front.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 7.2 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Circular link** | The last node points back to the first, so a nonempty chain has no `None` link. | `A → B → C → D → A`. |
| **Current node** | A chosen reference marks where a repeating activity starts. | `A` goes first, then `B`, `C`, `D`, and `A` again if unfinished. |
| **Tail-only queue** | Store the back node; its `_next` is the front. | Tail `D` gives front `A`. |
| **Enqueue** | Insert after the old tail and make the new node the tail. | Add `D` after `C` while keeping `A` in front. |
| **Dequeue** | Bypass the front node; clear tail if it was the only node. | Finished `D` leaves the activity on turn 4. |
| **Rotate** | Advance the tail reference by one link without changing any node. | After `A`'s first turn, `B` is next and `A` waits at the back. |
| **Round robin** | Give each active task a bounded turn, then revisit unfinished work. | Color up to four unit squares per card per turn. |
| **Traversal limit** | Stop after one full lap; no link leads to `None`. | Count four cards once for 34 cm², not twice for 68 cm². |
| **Cost** | Queue operations and rotation take O(1) worst-case time; storage is O(n). | Rotating never copies all four card nodes. |

The cycle controls **who goes next**. The geometry activity controls **how many squares remain**, while the queue stores the labels and their repeating order.

[🔝 Back to Top](#top)
