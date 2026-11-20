<span id="top"></span>

# Linked Lists — Section 7.1: Singly Linked Lists

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 7 PDF](<../../file/Data Structures and Algorithms in Python - C07.pdf>), Section 7.1 (printed pages 256–265).  
> **Topic:** Singly linked lists, a linked stack, and a linked queue.  
> **Domain focus:** Selected results from the **10 October 2026 Indonesian Grand Prix MotoGP Sprint** at Mandalika.  
> **Learning goal:** Explain each link change, choose the right end for a stack or queue, and trace a complete Python program.  
> **User Prompt:** "Reexplain Section 7.1 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: Three Sprint Result Cards](#background-intuition)
2. [Part 1: Section 7.1 — Singly Linked Lists](#part-1)
   - [1. Why link nodes?](#part-1-why)
   - [2. Nodes, head, tail, and traversal](#part-1-nodes)
   - [3. Insert at the head](#part-1-head)
   - [4. Insert at the tail](#part-1-tail)
   - [5. Remove the head; understand the tail limit](#part-1-remove)
   - [6. Check the list's invariants](#part-1-invariants)
3. [Part 2: Section 7.1.1 — A Linked Stack](#part-2)
   - [1. Put the top at the head](#part-2-top)
   - [2. Solve `push`, `top`, and `pop`](#part-2-operations)
   - [3. Empty stacks and costs](#part-2-cost)
4. [Part 3: Section 7.1.2 — A Linked Queue](#part-3)
   - [1. Put the front at the head and the back at the tail](#part-3-ends)
   - [2. Solve `enqueue`, `first`, and `dequeue`](#part-3-operations)
   - [3. Handle the last and first node correctly](#part-3-empty)
5. [Part 4: One Complete Worked Program](#part-4)
   - [1. Plan the two collections](#part-4-plan)
   - [2. Run the program](#part-4-program)
   - [3. Trace and check its output](#part-4-trace)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Three Sprint Result Cards

The [official Sprint classification](https://www.motogp.com/en/gp-results/2026/ina/motogp/spr/classification) and [MotoGP's session report](https://www.motogp.com/en/news/2026/10/10/menangi-sprint-mandalika-marc-marquez-kembali-puncaki-klasemen-motogp/1174849) give these real entries from one session:

| Sprint place | Rider | Team |
| :----------- | :---- | :--- |
| P1 | Marc Márquez | Ducati Lenovo Team |
| P2 | Ai Ogura | SuperFile Trackhouse MotoGP Team |
| P9 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |

We will make **teaching copies of these three result cards**. The linked list contains only these selected riders. An arrow from Ai's card to Fabio's card means "the next card in our *selected* list"; it does **not** claim that Fabio finished immediately behind Ai in the full Sprint. Inserting, removing, or undoing a card below changes our practice data structure, never the official result.

**Why these three?** Marc and Fabio are the requested focus. Ai supplies a middle node, so we can see what happens to both ends and what it means to follow a link. Their P1, P2, P9 order is easy to check against the source.

An array-based sequence stores references in numbered positions. It can reach position `i` directly, but inserting near the front may require moving many references. A linked list stores each element in a **node** with a reference to the following node. We can change the first link without shifting all later elements, though reaching a distant element requires following links.

```text
Array idea:       slot 0: Marc | slot 1: Ai | slot 2: Fabio
Linked-list idea: head → Marc → Ai → Fabio → None
```

The arrows show **references and order**, not physical closeness in memory. A node may live anywhere in memory. The final `None` means there is no next node.

**How to read the linked version:** begin at `head`, read Marc, follow Marc's next reference to Ai, then follow Ai's next reference to Fabio. Stop when the next reference is `None`.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 7.1 — Singly Linked Lists

<span id="part-1-why"></span>

### 1. Why Link Nodes?

The book starts with a tradeoff. Python's array-based `list` is useful when we need a numbered position quickly. Its underlying array may reserve extra capacity; when that fills, a resize can copy its references. A singly linked list allocates separate nodes as needed. Inserting or removing at its **head** changes only a few references, and appending at its **tail** is similarly quick when we keep a tail reference. We still need one node and one next reference per element, so the list uses **O(n) space** for `n` elements. It cannot jump straight to its middle by index, and removing its tail is not quick in general.

**Why this example?** A small result archive may receive a new card at the front or back. That makes link updates visible. The rider's finishing position is data *inside* a card; it is not a Python array index.

**How to choose:** ask which operation matters. For "read the first selected rider," keep a head reference. For "append another selected rider quickly," also keep a tail reference. For "read the 50th rider-like record by number," a singly linked list must follow links from the head, taking O(n) time in general.

<span id="part-1-nodes"></span>

### 2. Nodes, Head, Tail, and Traversal

A node has two fields: `_element` holds a reference to a result card, and `_next` holds a reference to another node (or `None`). Our code uses this shape:

```python
class _Node:
    __slots__ = ("_element", "_next")

    def __init__(self, element, next_node=None):
        self._element = element
        self._next = next_node
```

`__slots__` says that these are the node's two instance fields. The leading underscores mark implementation details by Python convention. The element itself can be a string or another object; the node's next link points to a **node**, not to the next rider's name.

The short diagrams below use `head`, `tail`, `Node`, and `next` as conceptual names. The complete Python program names those implementation details `_head`, `_tail`, `_Node`, and `_next`.

```text
head                                                 tail
 ↓                                                    ↓
[Marc result | next] → [Ai result | next] → [Fabio result | None]
```

To find Fabio **by walking from the head**, inspect Marc's node, follow one link to Ai, then a second link to Fabio. If there are `n` nodes, finding an arbitrary element or visiting all elements can take **O(n)** time. A stored `tail` reference can reach the final node directly in O(1), but it cannot reveal the node *before* that final node.

**Why this example?** Three nodes show the first, middle, and last roles without hiding a link in a long chain. **How to solve a traversal:** set a cursor to `head`, inspect its element, replace the cursor with `cursor._next`, and stop at `None`. Do not confuse a rider's P9 finish with nine link steps in this three-node teaching list.

<span id="part-1-head"></span>

### 3. Insert at the Head

Start with two selected cards: `Ai → Fabio`. We want Marc's P1 card first, giving `Marc → Ai → Fabio`. The two assignments must happen in this order:

```text
Before: head → [Ai] → [Fabio] → None

1. new = Node(Marc, head)   # new.next refers to the old head, Ai
2. head = new               # head now refers to Marc

After:  head → [Marc] → [Ai] → [Fabio] → None
```

If we changed `head` before preserving the old head in `new._next`, we could lose the path to Ai and Fabio. The old tail remains Fabio. If the list had been empty, the new node would become **both head and tail**.

**Why Marc?** His real P1 result belongs before the P2 and P9 cards in our selected finishing-order list. **How to solve it:** create the node, point its `_next` at the old head, update `head`, update `tail` only for an originally empty list, and increase the size. These are a fixed number of reference changes: **O(1) time**.

<span id="part-1-tail"></span>

### 4. Insert at the Tail

Start with `Marc → Ai` and append Fabio's P9 card:

```text
Before: head → [Marc] → [Ai | None] ← tail

1. newest = Node(Fabio)     # newest.next is None
2. tail.next = newest       # old last node, Ai, now points to Fabio
3. tail = newest            # Fabio is the new last node

After:  head → [Marc] → [Ai] → [Fabio | None] ← tail
```

The order of steps matters: we must still have the **old** tail in step 2. For an empty list, set `head = newest` instead of accessing `tail.next`; then set `tail = newest`. Increase the size in either case.

**Why Fabio?** P9 follows P1 and P2 among our selected cards, so appending preserves their relative classification order. **How to solve it:** use the saved tail reference to attach the new node, then move tail. This is **O(1)** only because the list stores `tail`; without it, finding the last node requires a traversal.

<span id="part-1-remove"></span>

### 5. Remove the Head; Understand the Tail Limit

Removing Marc's card from `Marc → Ai → Fabio` leaves `Ai → Fabio`:

```text
answer = head._element   # remember Marc's card
head = head._next         # Ai becomes first
size -= 1
if size == 0:
    tail = None
return answer
```

The old Marc node is no longer reachable from the list. Python can reclaim it when nothing else refers to it. If Marc had been the only node, `head` would become `None` and we must also clear `tail`. A removal must first check that the list is nonempty.

**Why remove Marc?** A head removal changes just one primary link and makes the new first card obvious. **How to solve it:** save the element before moving head, move head once, reduce the count, and clear tail if the count becomes zero. This takes **O(1)** time.

Now imagine removing **Fabio**, the tail, instead. A direct tail reference finds Fabio, but a singly linked node has no "previous" link. We must find Ai to set `Ai._next = None` and then make Ai the tail. In the general `n`-node case that predecessor search takes **O(n)** time. This explains why the stack and queue below remove from the **head**.

<span id="part-1-invariants"></span>

### 6. Check the List's Invariants

An **invariant** is a fact that must remain true after every operation. These checks catch the common empty-list and one-node mistakes:

| State | `head` | `tail` | Last node's `_next` | `size` |
| :---- | :----- | :----- | :------------------ | -----: |
| Empty | `None` | `None` | No node | 0 |
| One card, e.g. Marc | Marc's node | Same Marc node | `None` | 1 |
| Three selected cards | Marc's node | Fabio's node | `None` | 3 |

For every nonempty state, following `_next` from head must reach exactly `size` nodes and finish at tail. A stale tail that points to a removed node violates this rule.

**Why this check?** Looking only at the returned rider can miss a broken link that fails on the next operation. **How to solve an edge case:** draw the empty, one-node, and many-node states; update references; then verify the table before trusting the result.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 7.1.1 — A Linked Stack

A **stack** is last-in, first-out. The book's `LinkedStack` stores `_head` and `_size` and treats head as the stack's top. It does not need a tail: every stack operation happens at the head.

<span id="part-2-top"></span>

### 1. Put the Top at the Head

Suppose we enter the selected Sprint result cards in P1, P2, P9 order: Marc, Ai, then Fabio. Each `push` adds at the head:

```text
After push Marc:          top/head → [Marc] → None
After push Ai:            top/head → [Ai] → [Marc] → None
After push Fabio:         top/head → [Fabio] → [Ai] → [Marc] → None
```

The stack chain is the **reverse of entry order**. That is correct for last-in, first-out: Fabio's card was entered last, so it is the first card an "undo last entry" action removes. This is a hypothetical record-entry exercise, not a change to the Sprint classification.

**Why this example?** It makes the difference between sporting order (P1, P2, P9) and stack order (last entered first) visible. **How to solve it:** for each card, make a new node whose next link points to the current head, then move head to the new node.

<span id="part-2-operations"></span>

### 2. Solve `push`, `top`, and `pop`

| Operation | What the implementation does | Result after all three pushes |
| :-------- | :--------------------------- | :---------------------------- |
| `push(card)` | Make a node linked to the old head; move head; add 1 to size. | `push(Fabio)` makes Fabio top. |
| `top()` | Read `head._element` without changing a link or size. | Returns Fabio's card; size stays 3. |
| `pop()` | Save `head._element`; move head to `head._next`; subtract 1. | Returns Fabio's card; Ai becomes top; size is 2. |

**Why read before moving head?** After moving it, the stack no longer has a path to the removed node. **How to trace it:** record `head` and `size` before and after each call. For `top()`, both stay the same. For `pop()`, the returned value is the *old* head's element.

<span id="part-2-cost"></span>

### 3. Empty Stacks and Costs

An empty stack has `_head = None` and `_size = 0`. `top()` and `pop()` raise an `Empty` exception instead of attempting `None._element`. `len(stack)` returns 0; `stack.is_empty()` returns `True`.

The book's Table 7.1 gives **O(1) worst-case time** for `push`, `top`, `pop`, `len`, and `is_empty`. None traverses the chain. The stack's nodes use **O(n) space** for `n` cards.

**Why this example?** An empty result-entry history is a normal state. **How to solve it:** check `is_empty()` before reading the head in `top` or `pop`, and raise `Empty` when there is no card.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 7.1.2 — A Linked Queue

A **queue** is first-in, first-out. The book's `LinkedQueue` stores `_head`, `_tail`, and `_size`. The first waiting result card is at head; a new card joins at tail.

<span id="part-3-ends"></span>

### 1. Put the Front at the Head and the Back at the Tail

Enqueue Marc, Ai, and Fabio in that order:

```text
front/head                                         back/tail
     ↓                                                 ↓
   [Marc] → [Ai] → [Fabio | None]
     first entered       last entered
```

The queue keeps the selected card entry order. `first()` reads Marc without removing him. `dequeue()` removes Marc, so Ai becomes first. `enqueue()` adds to the tail, so neither operation has to find a middle node.

**Why this example?** Reading the selected classification cards in entered order is a natural first-in, first-out job. **How to solve it:** keep both ends. Use head for removal and tail for insertion.

<span id="part-3-operations"></span>

### 2. Solve `enqueue`, `first`, and `dequeue`

| Operation | Link change | Example result |
| :-------- | :---------- | :------------- |
| `enqueue(Fabio)` | Make a node with `_next = None`; link the old tail to it; move tail; add 1 to size. | `Marc → Ai → Fabio`. |
| `first()` | No link change; read `head._element`. | Marc's card; size remains 3. |
| `dequeue()` | Save head's element; move head to its next node; subtract 1; clear tail if empty. | Return Marc; `Ai → Fabio` remains. |

**Why save the old head's element?** It is the card the queue must return. **How to solve it:** check for emptiness, save the element, advance head, update size, then check whether the removal emptied the queue. All three operations take **O(1) worst-case time** with stored head and tail references. The nodes use **O(n) space**.

<span id="part-3-empty"></span>

### 3. Handle the Last and First Node Correctly

The one-node transition is the easiest place to leave a stale reference:

```text
empty:          head = None, tail = None, size = 0
enqueue Marc:   head → [Marc | None] ← tail, size = 1
dequeue Marc:   head = None, tail = None, size = 0
enqueue Fabio:  head → [Fabio | None] ← tail, size = 1
```

When enqueuing into an empty queue, the new node becomes **both** head and tail. When dequeuing the only node, moving head sets it to `None`; the implementation must also set tail to `None`. Otherwise a later enqueue might link to a removed node.

`first()` and `dequeue()` raise `Empty` if the queue is empty. `len(queue)` and `queue.is_empty()` remain safe.

**Why this example?** The full three-card diagram does not reveal the special one-node case. **How to solve it:** trace a single Marc node through enqueue and dequeue, verify both references become `None`, then enqueue Fabio into the freshly empty queue.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Complete Worked Program

<span id="part-4-plan"></span>

### 1. Plan the Two Collections

**Problem:** Save our three verified Sprint result cards in both a queue and a stack. Which card does each collection show first? Which card remains at its front or top after one removal?

1. Use one string per selected result card. The rider, team, and official finishing place travel together as the node's element.
2. Create **separate** queue and stack objects; adding a card to one does not change the other.
3. Enter Marc, Ai, Fabio into both. The queue keeps the entry order; the stack reverses it.
4. Read each end without removing it. Then remove one card from each and read again.
5. Drain the queue and reuse it to confirm the empty-to-one-node transition.

**Why this problem?** It uses the *same factual cards* to isolate the only difference we are studying: which end receives and releases a node. No lap arithmetic or race simulation distracts from the links.

<span id="part-4-program"></span>

### 2. Run the Program

Save this as `sprint_links.py` and run `python sprint_links.py` with Python 3. The book nests a small `_Node` class in each collection; this teaching program shares the same two-field node shape between them.

```python
class Empty(Exception):
    """A collection has no element to read or remove."""


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


# A selected subset of the 10 October 2026 Indonesian GP Sprint classification.
selected_cards = (
    "P1 Marc Márquez — Ducati Lenovo Team",
    "P2 Ai Ogura — SuperFile Trackhouse MotoGP Team",
    "P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team",
)

waiting = LinkedQueue()
history = LinkedStack()
for card in selected_cards:
    waiting.enqueue(card)
    history.push(card)

print("Queue first: {}".format(waiting.first()))
print("Stack top: {}".format(history.top()))
print("Queue removes: {}".format(waiting.dequeue()))
print("Queue first now: {}".format(waiting.first()))
print("Stack removes: {}".format(history.pop()))
print("Stack top now: {}".format(history.top()))
print("Sizes: queue {}, stack {}".format(len(waiting), len(history)))

while not waiting.is_empty():
    waiting.dequeue()
print("Queue empty after draining: {}".format(waiting.is_empty()))
waiting.enqueue(selected_cards[2])
print("Queue first after reuse: {}".format(waiting.first()))
```

The tuple `selected_cards` is simply the program's fixed input. `waiting` and `history` are the linked collections being studied. The `selected_cards[2]` lookup indexes that input tuple, not the linked queue; our `LinkedQueue` has no numeric-index operation. The final reuse step deliberately enqueues Fabio into an empty queue; it does not represent an additional Sprint result.

<span id="part-4-trace"></span>

### 3. Trace and Check Its Output

```text
Queue first: P1 Marc Márquez — Ducati Lenovo Team
Stack top: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Queue removes: P1 Marc Márquez — Ducati Lenovo Team
Queue first now: P2 Ai Ogura — SuperFile Trackhouse MotoGP Team
Stack removes: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Stack top now: P2 Ai Ogura — SuperFile Trackhouse MotoGP Team
Sizes: queue 2, stack 2
Queue empty after draining: True
Queue first after reuse: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
```

| Step | Queue, front → back | Stack, top → bottom | Reason |
| :--- | :------------------ | :------------------ | :----- |
| After all three entries | Marc → Ai → Fabio | Fabio → Ai → Marc | Queue appends; stack prepends. |
| After one removal from each | Ai → Fabio | Ai → Marc | Queue returns oldest; stack returns newest. |
| After draining and reusing queue | Fabio | Ai → Marc | The fresh queue node is both head and tail. |

**How to check the answer:** trace the queue and stack separately; do not reuse one collection's head for the other. For each call, mark the old head, new head, tail if present, returned element, and size. The two `first/top` calls do not change either structure. The later `dequeue/pop` calls each reduce their own size from 3 to 2.

The setup loop performs `n` enqueues and `n` pushes for `n` selected cards, so building both collections takes **O(n) total time**. Draining the queue also takes **O(n) total time**: each individual dequeue is O(1), and the loop performs one per card.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 7.1 idea | Meaning | Selected Sprint card example |
| :--------------- | :------ | :--------------------------- |
| Node | Holds an element reference and one next-node reference. | Marc's card points to Ai's node in our selected list. |
| Head and tail | References to the first and last nodes. | Marc is first; Fabio is last before removals. |
| Traversal | Follow next references from head. | Reach Fabio from Marc through Ai. |
| Head insertion/removal | Change the beginning with a fixed number of link updates: O(1). | Prepend or remove Marc's card. |
| Tail insertion | Attach a node in O(1) when tail is stored. | Append Fabio after Ai. |
| Tail removal | Find the predecessor first: O(n) in general. | To remove Fabio, locate Ai. |
| Linked stack | Top is head; push and pop there. | Last entered Fabio card comes off first. |
| Linked queue | Front is head; back is tail. | First entered Marc card comes off first. |
| Empty state | No head; a queue also has no tail. | After the last dequeue, both queue references are `None`. |

All stack and queue methods shown above run in **O(1) worst-case time** in the book's model; each collection uses **O(n) space** for `n` cards. The Sprint positions and teams are real; the card operations are exercises in how a singly linked list stores and changes order.

[🔝 Back to Top](#top)
