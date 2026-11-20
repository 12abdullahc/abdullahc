<span id="top"></span>

# Linked Lists — Section 7.2: Circularly Linked Lists

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 7 PDF](<../../file/Data Structures and Algorithms in Python - C07.pdf>), Section 7.2 (printed pages 266–269).  
> **Topic:** Circularly linked lists, round-robin scheduling, and a circularly linked queue.  
> **Domain focus:** Selected result cards from the **10 October 2026 Indonesian Grand Prix MotoGP Sprint** at Mandalika.  
> **Learning goal:** Follow a cycle without looping forever, explain how rotation works, and implement a queue with one tail reference.  
> **User Prompt:** "Reexplain Section 7.2 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rotating Set of Sprint Cards](#background-intuition)
2. [Part 1: Section 7.2 — Circularly Linked Lists](#part-1)
   - [1. Close the last link](#part-1-cycle)
   - [2. Choose a front and rotate the viewpoint](#part-1-rotate)
   - [3. Visit exactly one lap](#part-1-traverse)
   - [4. Recognize the empty and one-node cycles](#part-1-edge)
3. [Part 2: Section 7.2.1 — Round-Robin Schedulers](#part-2)
   - [1. Give each unfinished task a turn](#part-2-rule)
   - [2. See why rotation replaces removal and reinsertion](#part-2-compare)
   - [3. Solve a five-turn review schedule](#part-2-trace)
4. [Part 3: Section 7.2.2 — A Circularly Linked Queue](#part-3)
   - [1. Store only tail and size](#part-3-state)
   - [2. Enqueue into an empty or nonempty cycle](#part-3-enqueue)
   - [3. Read and remove the front](#part-3-dequeue)
   - [4. Rotate and count the cost](#part-3-rotate)
5. [Part 4: One Complete Worked Program](#part-4)
   - [1. Plan the input and turns](#part-4-plan)
   - [2. Run the program](#part-4-program)
   - [3. Trace its output and test the edge cases](#part-4-check)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Rotating Set of Sprint Cards

We will reuse three real entries from the [official 2026 Indonesian GP Sprint classification](https://www.motogp.com/en/gp-results/2026/ina/motogp/spr/classification). [MotoGP's report for the 10 October session](https://www.motogp.com/en/news/2026/10/10/menangi-sprint-mandalika-marc-marquez-kembali-puncaki-klasemen-motogp/1174849) confirms the finishing places and teams.

| Sprint place | Rider | Team |
| :----------- | :---- | :--- |
| P1 | Marc Márquez | Ducati Lenovo Team |
| P2 | Ai Ogura | SuperFile Trackhouse MotoGP Team |
| P9 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |

Imagine an analyst reviewing **copies** of these result cards. The analyst keeps only these three cards and revisits unfinished ones in turns. Marc's P1, Ai's P2, and Fabio's P9 are facts from the Sprint. The review schedule and "checks remaining" numbers below are **made-up teaching data**. A link from Ai to Fabio means "next in our selected-card cycle"; it does not mean they were adjacent in the full classification, and the repeated cycle is not a race lap order.

The [Section 7.1 singly linked list](07-01-singly-linked-lists.md) ended at `None`:

```text
head → Marc → Ai → Fabio → None
```

For a **circularly linked list**, the final node instead links back to the first:

```text
Marc → Ai → Fabio ──┐
 ↑                  │
 └──────────────────┘
```

Starting at Marc and following three next links returns to Marc. The nodes can be in separate memory locations; the arrows are references, not positions on a track.

**Why this example?** A result card can need another review turn, so we need a clear way to return to the first waiting card after reaching the last. **How to read it:** follow one next reference at a time and count the cards visited. Do not wait for `None` in a nonempty cycle: it will never appear.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 7.2 — Circularly Linked Lists

<span id="part-1-cycle"></span>

### 1. Close the Last Link

For our selected three-card set, the node references are:

```text
Marc._next  → Ai's node
Ai._next    → Fabio's node
Fabio._next → Marc's node
```

The final line is what makes the structure circular. In the linear list from Section 7.1, `Fabio._next` would be `None`. A circular link is different from the **circular array** in Chapter 6: the array used modular arithmetic to reuse numbered slots, while these nodes really point to one another in a cycle.

A cycle has no natural first or last node. The book first calls an arbitrarily designated node `current`: if `current` is Marc, then `current = current._next` moves the reference to Ai, then Fabio, then back to Marc. For a **queue**, we give the designated reference a specific role: **tail** means "back," and `tail._next` means "front." Here tail is Fabio and front is Marc.

**Why this example?** It changes just one reference from the Section 7.1 diagram, making the new idea easy to isolate. **How to solve a link diagram:** write each node's next target, check that every target is a node in the set, and follow links from Marc until they return to Marc.

<span id="part-1-rotate"></span>

### 2. Choose a Front and Rotate the Viewpoint

Suppose `tail` refers to Fabio. The front is `tail._next`, which is Marc. Move the **tail reference** one link forward:

```text
Before: tail = Fabio; front = Marc; view = [Marc, Ai, Fabio]
Move:   tail = tail._next
After:  tail = Marc;  front = Ai;   view = [Ai, Fabio, Marc]
```

All three node links remain exactly as they were. Only the reference that marks "back" changes. The old front Marc is now treated as the back; Ai gets the next turn. Two more rotations give front Fabio, then front Marc again.

**Why this example?** It explains how the same physical cycle can represent different queue orders without unlinking or copying a card. **How to solve a rotation:** move tail to its current next node; then compute the new front as `tail._next`. The number of nodes stays the same.

<span id="part-1-traverse"></span>

### 3. Visit Exactly One Lap

A traversal such as `while cursor is not None` cannot finish in a nonempty circular list. Instead, use the stored size to visit each node **once**:

```python
# Sketch inside a nonempty circular queue:
cursor = tail._next                 # current front
for _ in range(size):
    print(cursor._element)
    cursor = cursor._next
```

If `size == 3`, this prints Marc, Ai, Fabio and leaves `cursor` back at Marc. Visiting one more node would repeat Marc; it would not reveal a fourth selected rider. Traversal takes **O(n) time** for `n` nodes.

**Why this example?** A cycle makes a familiar "stop at `None`" loop incorrect. **How to solve it:** either count exactly `size` visits, as above, or remember the start node and stop when you return to it *after* the first visit. For an empty queue, check for emptiness before evaluating `tail._next`.

<span id="part-1-edge"></span>

### 4. Recognize the Empty and One-Node Cycles

| State | Tail | Tail's next | Front |
| :---- | :--- | :---------- | :---- |
| Empty | `None` | Cannot be read | No card |
| One Marc card | Marc's node | Marc's own node | Marc |
| Three selected cards | Fabio's node | Marc's node | Marc |

A one-node circle is **self-linked**: `tail._next is tail`. Rotating it moves tail to itself, so the same card stays at the front. After its removal, tail must become `None`; there is no node left to point to.

**Why this example?** Empty and one-node states reveal bugs hidden by a three-node picture. **How to solve them:** draw the exact references before and after each operation, then check that an empty queue has no tail and a one-node queue points back to itself.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 7.2.1 — Round-Robin Schedulers

The book motivates a circular list with **round-robin scheduling**: each waiting task receives a limited turn. If it still needs work, it goes to the back; if finished, it leaves. A computer scheduler can use a fixed time slice. Our analyst's analogous turn performs **one result-card check**. This is a software exercise; the riders are subjects of the cards, not workers in a real scheduler.

In the book's basic repeating schedule, an ordinary queue performs `e = Q.dequeue(); service(e); Q.enqueue(e)`. The circular version reads the front, services it, and calls `rotate()`, leaving the existing node in place. The book's scheduling prose calls the read operation `front()`; its `CircularQueue` class names that method `first()`, which is the name used below. **Removing completed cards** is our finite review exercise's added rule.

<span id="part-2-rule"></span>

### 1. Give Each Unfinished Task a Turn

For this exercise, set the fictional checks remaining to Marc: **2**, Ai: **1**, Fabio: **2**. One turn performs one check on the front card:

1. Read the front card with `first()`.
2. Decrease that card's remaining-check count by one.
3. If zero remain, remove it with `dequeue()`.
4. Otherwise, move it behind the other waiting cards with `rotate()`.
5. Repeat until the queue is empty.

The checks are stored in a separate dictionary in Part 4. The circular queue knows card order and links; it does not know what a review check means.

**Why these counts?** They force both outcomes in a short trace: Marc and Fabio need another turn, while Ai finishes immediately. **How to solve a turn:** inspect the front, do one unit of work, update its count, and choose **one** queue action based on whether work remains.

<span id="part-2-compare"></span>

### 2. See Why Rotation Replaces Removal and Reinsertion

An ordinary queue can move an unfinished front card to the back by dequeuing it and enqueuing it again. That changes the linked structure and may create a replacement node. A circular queue can get the same logical order by moving just its tail reference:

```text
Start:               [Marc, Ai, Fabio]  front Marc, tail Fabio
Dequeue + enqueue:   [Ai, Fabio, Marc]  remove then add a card node
Circular rotate:     [Ai, Fabio, Marc]  move tail to Marc; links stay put
```

Both methods give Ai the next turn. For the circular rotation, `tail = tail._next` is **O(1)** and leaves the size at 3. The review check itself changes the separate remaining-work count; rotation alone performs no check.

**Why compare them?** It shows what the circular link saves: we can represent the next turn without removing and rebuilding a node. **How to solve it:** follow the tail link once, then read `tail._next` to identify the next front.

<span id="part-2-trace"></span>

### 3. Solve a Five-Turn Review Schedule

Start with queue order `[Marc, Ai, Fabio]` and remaining checks `{Marc: 2, Ai: 1, Fabio: 2}`. Each row continues from the previous one:

| Turn | Front card checked | Checks left on that card | Queue action | Queue afterward, front to back |
| ---: | :----------------- | -----------------------: | :----------- | :----------------------------- |
| 1 | Marc | 1 | Rotate Marc | Ai → Fabio → Marc |
| 2 | Ai | 0 | Dequeue Ai | Fabio → Marc |
| 3 | Fabio | 1 | Rotate Fabio | Marc → Fabio |
| 4 | Marc | 0 | Dequeue Marc | Fabio |
| 5 | Fabio | 0 | Dequeue Fabio | Empty |

On turn 1, Marc's card still needs one check, so Marc becomes the tail. Ai's card finishes on turn 2, so it is removed instead of rotated. The final turn removes the only node and sets tail to `None`.

**Why this trace?** It includes a three-node rotation, a two-node rotation, a removal, and the one-node-to-empty transition. **How to check it:** after every row, confirm that the listed front is `tail._next`, the listed back is tail, and only unfinished cards remain.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 7.2.2 — A Circularly Linked Queue

The book's `CircularQueue` uses a lightweight node class with `_element` and `_next`, plus queue fields `_tail` and `_size`. It does **not** store a separate head. The diagrams and short steps below use `tail` and `size` as conceptual names; the complete code uses `self._tail` and `self._size`.

<span id="part-3-state"></span>

### 1. Store Only Tail and Size

For every nonempty queue:

```text
front node = tail._next
number of reachable nodes in one lap = size
after exactly size links from front, we return to front
```

For the three-card example, `tail` points to Fabio; `tail._next` points to Marc. If the queue is empty, `tail is None` and `size == 0`. If it contains just Marc, `tail._next is tail` and `size == 1`. These are **invariants**: each operation must preserve them.

**Why store tail?** One reference identifies both ends: tail itself is the back, and its next link is the front. **How to check the representation:** compare `size` with one complete traversal and verify that the last visited node is tail.

<span id="part-3-enqueue"></span>

### 2. Enqueue Into an Empty or Nonempty Cycle

To append Fabio to `[Marc, Ai]`, the old tail is Ai and the old front is Marc:

```text
newest = Node(Fabio)
newest.next = old_tail.next    # Fabio points to old front Marc
old_tail.next = newest        # Ai points to Fabio
tail = newest                 # Fabio marks the back
size += 1
```

The order matters. If we overwrite Ai's next link before using it to find Marc, we may lose the old front reference. For an **empty** queue, there is no old tail: set `newest._next = newest`, then set tail to newest and size to 1.

**Why append Fabio?** P9 follows the P1 and P2 cards in the selected input order, so the resulting front-to-back view is easy to verify. **How to solve it:** distinguish empty from nonempty, close the new node's link to the front, attach the old tail to the new node, and move tail. The operation takes **O(1) worst-case time**.

<span id="part-3-dequeue"></span>

### 3. Read and Remove the Front

`first()` returns `tail._next._element` without changing a link or size. For `dequeue()`, save that element before bypassing the node:

```text
old_front = tail.next
answer = old_front.element
if size == 1:
    tail = None               # the only node has gone
else:
    tail.next = old_front.next  # old second node becomes front
size -= 1
return answer
```

From `[Marc, Ai, Fabio]`, this returns Marc and leaves `[Ai, Fabio]`. From `[Fabio]`, it returns Fabio and leaves an empty queue with tail `None`. Both `first()` and `dequeue()` must check emptiness first and raise `Empty` when no card exists.

**Why use both cases?** Bypassing the front of a many-node cycle differs from removing its sole node. **How to solve it:** determine the old size before changing links; for size 1 clear tail, otherwise relink tail directly to the second node. This is **O(1) worst-case time**.

<span id="part-3-rotate"></span>

### 4. Rotate and Count the Cost

`rotate()` needs no node relinking:

```text
if size > 0:
    tail = tail.next
```

With three nodes, this makes the old front the new tail. With one node, tail moves to itself. With zero nodes, the method does nothing. No element is removed; size is unchanged.

| Operation | Effect | Worst-case time |
| :-------- | :----- | --------------: |
| `enqueue(e)` | Add a new back node. | O(1) |
| `first()` | Read the front; raise `Empty` if empty. | O(1) |
| `dequeue()` | Remove the front; raise `Empty` if empty. | O(1) |
| `rotate()` | Make the old front the new back. | O(1) |
| `len(queue)`, `is_empty()` | Read the stored size. | O(1) |

The queue uses **O(n) space** for `n` nodes. A full traversal takes O(n) time. Across `t` turns, `t` queue operations take O(t) total time, plus whatever work each task's service requires.

**Why list the costs?** "One quick rotation" and "finish every task" are different claims. **How to solve a cost question:** count the work in one operation, then multiply by how many times the surrounding loop performs it.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Complete Worked Program

<span id="part-4-plan"></span>

### 1. Plan the Input and Turns

**Problem:** Review the three selected Sprint result cards with one fictional check per turn. Keep unfinished cards in a circular queue. Print the turns and the empty state.

1. Store each real result as a card label containing its official place, rider, and team.
2. Keep the fictional remaining-check counts **outside** the queue.
3. Enqueue Marc, Ai, Fabio, creating a three-node cycle.
4. On each turn, read the front card, decrement its count, then dequeue it if done or rotate it if unfinished.
5. Stop when the queue is empty; never read `first()` after that point.

**Why this program?** It exercises every Section 7.2 queue method and lets the five-turn table predict the output before we run the code.

<span id="part-4-program"></span>

### 2. Run the Program

Save this as `sprint_review_rotation.py` and run `python sprint_review_rotation.py` with Python 3. The nested `_Node` matches the book's lightweight node design.

```python
class Empty(Exception):
    """A queue has no element to read or remove."""


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
        old_front = self._tail._next
        answer = old_front._element
        if self._size == 1:
            self._tail = None
        else:
            self._tail._next = old_front._next
        self._size -= 1
        return answer

    def rotate(self):
        if not self.is_empty():
            self._tail = self._tail._next


# Official Sprint results, selected for this teaching example.
marc = "P1 Marc Márquez — Ducati Lenovo Team"
ai = "P2 Ai Ogura — SuperFile Trackhouse MotoGP Team"
fabio = "P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team"

# Fictional review workload; these numbers are not MotoGP results.
checks_remaining = {marc: 2, ai: 1, fabio: 2}
waiting = CircularQueue()
for card in (marc, ai, fabio):
    waiting.enqueue(card)

print("Initial front: {}".format(waiting.first()))
turn = 0
while not waiting.is_empty():
    card = waiting.first()
    checks_remaining[card] -= 1
    turn += 1

    if checks_remaining[card] == 0:
        waiting.dequeue()
        action = "remove"
    else:
        waiting.rotate()
        action = "rotate"

    print("Turn {}: {} | remaining checks {} | {}".format(
        turn, card, checks_remaining[card], action
    ))

print("Queue empty: {} (size {})".format(waiting.is_empty(), len(waiting)))
```

The queue holds only card labels and their circular order. The dictionary holds the exercise's review workload. After the final dequeue, `waiting.first()` would raise `Empty`; the loop stops before that call.

<span id="part-4-check"></span>

### 3. Trace Its Output and Test the Edge Cases

```text
Initial front: P1 Marc Márquez — Ducati Lenovo Team
Turn 1: P1 Marc Márquez — Ducati Lenovo Team | remaining checks 1 | rotate
Turn 2: P2 Ai Ogura — SuperFile Trackhouse MotoGP Team | remaining checks 0 | remove
Turn 3: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team | remaining checks 1 | rotate
Turn 4: P1 Marc Márquez — Ducati Lenovo Team | remaining checks 0 | remove
Turn 5: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team | remaining checks 0 | remove
Queue empty: True (size 0)
```

| Moment | Queue from front to back | Tail link that identifies front |
| :----- | :----------------------- | :------------------------------ |
| Before turn 1 | Marc → Ai → Fabio | Fabio → Marc |
| After turn 1 rotation | Ai → Fabio → Marc | Marc → Ai |
| After turn 2 removal | Fabio → Marc | Marc → Fabio |
| After turn 4 removal | Fabio only | Fabio → Fabio |
| After turn 5 removal | Empty | Tail is `None` |

**How to verify the trace:** after each turn, check the remaining count and choose exactly one action. A rotation changes the queue's front but not its size; a dequeue reduces size by one. The final one-node removal must set tail to `None`. With three initial cards and two rotations, the loop performs five turns.

The following small edge checks can be run after the program above in the same file:

```python
single = CircularQueue()
single.enqueue(fabio)
single.rotate()                         # one-node cycle: same front
assert single.first() == fabio
assert len(single) == 1
assert single.dequeue() == fabio
assert single.is_empty() and single._tail is None
single.rotate()                         # empty rotation: no change
```

**Why this separate check?** The five-turn program removes a one-node queue but does not rotate one. This check confirms that one-node and empty rotations are harmless without adding fictitious turns to the Sprint-card review.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 7.2 idea | Plain-language meaning | Sprint-card example |
| :--------------- | :--------------------- | :------------------ |
| Circular link | The final node points back to the first. | Fabio's node points to Marc's node in the selected cycle. |
| Chosen front | A cycle needs a reference to define the queue view. | With tail Fabio, front is Marc. |
| One-lap traversal | Count nodes or stop when returning to the start. | Visit Marc, Ai, Fabio once, then stop. |
| Round-robin turn | Unfinished work rotates; finished work leaves. | Marc rotates after his first fictional review check. |
| Tail-only queue | Tail's next link identifies the front. | `_tail._next` identifies the card to review. |
| One-node cycle | The node links to itself. | Fabio alone remains at the front after rotation. |
| Empty queue | No tail node exists. | After the last review check, `_tail is None`. |
| Cost | Each queue method is O(1); processing many turns takes time proportional to the turns. | Five teaching turns call five O(1) queue actions. |

The riders, teams, and finishing places come from one real MotoGP session. The repeating links and review workload are a worked example of the data structure, not a claim about the race.

[🔝 Back to Top](#top)
