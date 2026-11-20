<span id="top"></span>

# Linked Lists — Section 7.3: Doubly Linked Lists

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 7 PDF](<../../file/Data Structures and Algorithms in Python - C07.pdf>), Section 7.3 (printed pages 270–276).  
> **Topic:** Two-way links, insertion and deletion, sentinel nodes, and a linked deque.  
> **Domain focus:** Selected results from the **10 October 2026 Indonesian Grand Prix MotoGP Sprint** at Mandalika.  
> **Learning goal:** Update both neighboring links safely, understand why sentinels simplify the ends, and trace a complete deque implementation.  
> **User Prompt:** "Reexplain Section 7.3 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Two-Ended Sprint Card Tray](#background-intuition)
2. [Part 1: Section 7.3 — Doubly Linked Lists](#part-1)
   - [1. Give each node a previous and next link](#part-1-links)
   - [2. Mark the ends with sentinels](#part-1-sentinels)
   - [3. Insert between known neighbors](#part-1-insert)
   - [4. Delete a known node](#part-1-delete)
   - [5. Separate finding a node from changing its links](#part-1-search)
3. [Part 2: Section 7.3.1 — The Basic Implementation](#part-2)
   - [1. Initialize header and trailer sentinels](#part-2-sentinels)
   - [2. Use one insertion helper at every position](#part-2-insert)
   - [3. Use one deletion helper and preserve the invariants](#part-2-delete)
4. [Part 3: Section 7.3.2 — A Linked Deque](#part-3)
   - [1. Map the public operations to the sentinels](#part-3-operations)
   - [2. Trace changes at both ends](#part-3-trace)
   - [3. Handle empty ends and count the cost](#part-3-cost)
5. [Part 4: One Complete Worked Program](#part-4)
   - [1. Plan the result-card tray](#part-4-plan)
   - [2. Run the program](#part-4-program)
   - [3. Check the output and one-node case](#part-4-check)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Two-Ended Sprint Card Tray

These four real entries come from the [official 2026 Indonesian GP Sprint classification](https://www.motogp.com/en/gp-results/2026/ina/motogp/spr/classification). [MotoGP's report for 10 October](https://www.motogp.com/en/news/2026/10/10/menangi-sprint-mandalika-marc-marquez-kembali-puncaki-klasemen-motogp/1174849) also describes the finishing order.

| Sprint place | Rider | Team |
| :----------- | :---- | :--- |
| P1 | Marc Márquez | Ducati Lenovo Team |
| P2 | Ai Ogura | SuperFile Trackhouse MotoGP Team |
| P8 | Francesco Bagnaia | Ducati Lenovo Team |
| P9 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |

We will keep **copies of selected result cards** in a software tray. The selected order `Marc → Ai → Bagnaia → Fabio` preserves these riders' relative finishing order, but it leaves out P3–P7. A link between Ai and Bagnaia means they are neighbors in *our selected tray*, not adjacent finishers in the full classification. Inserting or removing a card below changes this teaching tray, never the official result.

The [singly linked list in Section 7.1](07-01-singly-linked-lists.md) could follow `_next` forward. Removing its last node took O(n) time in general because the tail did not know its predecessor. A **doubly linked node** remembers both neighbors:

```text
front                                            back
Marc ⇄ Ai ⇄ Bagnaia ⇄ Fabio
```

Each `⇄` stands for **two references**: the left node's `_next` points right, and the right node's `_prev` points left. The arrows describe links in memory, not movement on the track. From Fabio's node, one `_prev` step reaches Bagnaia's node directly.

**Why these riders?** Marc and Fabio are the requested focus; Ai and Bagnaia give us middle nodes. Bagnaia's P8 card also belongs immediately before Fabio's P9 card in the real finishing order, making the local insert-and-delete example easy to check. **How to read the tray:** follow `_next` from the front or `_prev` from the back. Stop at the chosen endpoint; adding backward links does not create an array index.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 7.3 — Doubly Linked Lists

<span id="part-1-links"></span>

### 1. Give Each Node a Previous and Next Link

A node stores three references: `_element` for its result card, `_prev` for the preceding **node**, and `_next` for the following **node**. For two adjacent real nodes, the links must agree:

```text
Ai._next is Bagnaia
Bagnaia._prev is Ai
```

The same idea applies all along the tray. If `x` is a real node between two neighbors, `x._prev._next is x` and `x._next._prev is x`. We can walk forward or backward, but reaching an arbitrary rider by name still requires a search unless we already hold that rider's node.

**Why this example?** Ai and Bagnaia let us inspect the two references across one pair instead of guessing from the whole chain. **How to check a pair:** follow the forward link from Ai and then the backward link from the reached node. It must bring you back to Ai.

<span id="part-1-sentinels"></span>

### 2. Mark the Ends With Sentinels

The book next places a permanent **header** node before the first rider card and a permanent **trailer** node after the last. These nodes carry no rider result:

```text
header ⇄ Marc ⇄ Ai ⇄ Fabio ⇄ trailer
```

Now Marc has a predecessor (`header`) and Fabio has a successor (`trailer`). Even an empty list has two adjacent nodes, `header ⇄ trailer`. This is the book's key reason for using **sentinels**: the same insertion and deletion pattern can work near either end without special cases inside the link-changing helper.

**Why add two empty nodes?** They make every *real* card sit between two existing nodes. **How to use them:** keep the sentinels fixed, put rider nodes only between them, and count only rider nodes in the size. Part 2 shows their initialization in Python.

<span id="part-1-insert"></span>

### 3. Insert Between Known Neighbors

Start with selected cards `Marc ⇄ Ai ⇄ Fabio`. Suppose we already have **adjacent node references** for Ai and Fabio and want to place Bagnaia's P8 card between them:

```text
Before: Marc ⇄ Ai ⇄ Fabio
After:  Marc ⇄ Ai ⇄ Bagnaia ⇄ Fabio
```

Make a new Bagnaia node, then update four references in this order:

1. `new._prev = Ai`.
2. `new._next = Fabio`.
3. `Ai._next = new`.
4. `Fabio._prev = new`.

The new node first remembers both old neighbors. Then each neighbor is changed to point back to the new node. The final list still has matching forward and backward links.

**Why Bagnaia?** His verified P8 card fits between the selected P2 and P9 cards while preserving their relative order. **How to solve it:** identify the two adjacent nodes, connect the new node to them, then connect them to the new node. With both neighbors already known, insertion changes a fixed number of references: **O(1) time**.

<span id="part-1-delete"></span>

### 4. Delete a Known Node

Now suppose we hold the **Bagnaia node itself** in `Marc ⇄ Ai ⇄ Bagnaia ⇄ Fabio`. Its `_prev` gives Ai and its `_next` gives Fabio. Reconnect those two neighbors:

```text
predecessor = Bagnaia._prev     # Ai
successor = Bagnaia._next       # Fabio
predecessor._next = successor   # Ai points forward to Fabio
successor._prev = predecessor   # Fabio points back to Ai
```

The selected tray becomes `Marc ⇄ Ai ⇄ Fabio` again. Save the removed node's element, clear its fields, then return that saved element. The official result still includes Bagnaia at P8; only our practice tray has changed.

**Why delete the same card?** It reverses the insertion and exposes exactly which links must be repaired. **How to solve it:** save both neighbors, connect them to each other, reduce the size, save the element, clear the removed node's references, and return the saved element. Given the node, these steps take **O(1) time**.

<span id="part-1-search"></span>

### 5. Separate Finding a Node From Changing Its Links

If someone gives us only the text "Francesco Bagnaia," we may have to inspect nodes until we find that card. Such a **search** can take **O(n)** time for `n` cards. The O(1) insertion or deletion claim begins **after** the required node or adjacent pair has been located. Backward links help when a node is already known; they do not make arbitrary numeric indexing or name lookup constant time.

**Why make this distinction?** Otherwise "delete Bagnaia in O(1)" could wrongly sound like a claim about finding him from scratch. **How to analyze the full task:** count finding time and link-change time separately. A scan plus deletion is O(n) overall; deleting a known node is O(1).

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 7.3.1 — The Basic Implementation

The book's nonpublic `_DoublyLinkedBase` stores two fixed **sentinel** nodes: `_header` before all real elements and `_trailer` after them. It also stores `_size`, the number of real elements. Sentinels have no rider card and are not included in the size.

<span id="part-2-sentinels"></span>

### 1. Initialize Header and Trailer Sentinels

The nested `_Node` class has `_element`, `_prev`, and `_next` fields. Its `__slots__` declaration lists those three fields. The constructor creates two nodes with no rider element and connects them:

```python
self._header = self._Node(None)
self._trailer = self._Node(None)
self._header._next = self._trailer
self._trailer._prev = self._header
self._size = 0
```

In this empty state, `header._next is trailer` and `trailer._prev is header`. After one Marc card is inserted, the order is `header ⇄ Marc ⇄ trailer`: Marc's predecessor and successor are both available. The front real node is `header._next` when nonempty; the back real node is `trailer._prev`. The header's outer `_prev` and trailer's outer `_next` are unused and can be `None`.

**Why use nodes with no rider?** They supply neighbors even at the ends, so insertion and deletion can use the same local pattern throughout the list. **How to check the empty case:** confirm that the sentinels point to each other and `_size == 0`; never count either sentinel as a result card.

<span id="part-2-insert"></span>

### 2. Use One Insertion Helper at Every Position

The base class's `_insert_between(element, predecessor, successor)` assumes its two node arguments are **already adjacent**. It creates a node that points to both, redirects the two neighbors toward it, increments size, and returns the new node:

```python
newest = self._Node(element, predecessor, successor)
predecessor._next = newest
successor._prev = newest
self._size += 1
return newest
```

These are the key lines *inside* the helper; the complete runnable class appears in Part 4. The predecessor–successor pair can be `(header, first node)`, `(last node, trailer)`, or `(header, trailer)` for an empty deque.

**Why this helper?** The same four link relationships apply when Bagnaia goes between Ai and Fabio or when Marc is put at the front of an empty tray. **How to solve an insertion:** choose the correct adjacent pair, call the helper, then verify both directions through the new node. No special empty-list branch is required inside the helper.

<span id="part-2-delete"></span>

### 3. Use One Deletion Helper and Preserve the Invariants

The base class's `_delete_node(node)` assumes `node` is **real**, not a sentinel. It saves the node's neighbors, reconnects them, reduces size, saves the element for return, and clears the removed node's fields:

```python
predecessor = node._prev
successor = node._next
predecessor._next = successor
successor._prev = predecessor
self._size -= 1
answer = node._element
node._element = node._prev = node._next = None
return answer
```

Clearing the fields releases the removed node's references and marks it as detached. If it was the only real node, the two sentinels point directly to each other again. The **public** deque methods check for an empty deque before calling this helper, so the helper is never asked to delete a sentinel.

For every real node `x`, its neighbors' links must agree with it: `x._prev._next is x` and `x._next._prev is x`. Starting at header and following `_next` must reach trailer through exactly `_size` real nodes; going backward must reach header through those same nodes in reverse order.

**Why this helper?** It makes the edge case of removing the sole real card use the same reconnection rule as removing a middle card. **How to solve a deletion:** pass a known real node, reconnect its neighbors in both directions, update size, then check the invariants. The helper takes **O(1) worst-case time** once the node is known.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 7.3.2 — A Linked Deque

A **deque** ("deck") permits insertion, reading, and deletion at **both ends**. The [Section 6.3 deque guide](../06-stacks-queues-and-deques/06-03-double-ended-queues.md) used a circular array. Here `LinkedDeque` inherits `_DoublyLinkedBase` and uses its two sentinels and helpers. The linked implementation names its insertion methods `insert_first` and `insert_last`.

<span id="part-3-operations"></span>

### 1. Map the Public Operations to the Sentinels

The table starts from the same independent selected tray `[Marc, Ai, Bagnaia, Fabio]` for each row:

| Operation | Which real node or adjacent pair is used? | Example result |
| :-------- | :----------------------------------------- | :------------- |
| `first()` | Read `header._next._element`. | Marc, with no removal. |
| `last()` | Read `trailer._prev._element`. | Fabio, with no removal. |
| `insert_first(e)` | Insert between header and the old first node. | A new card becomes first. |
| `insert_last(e)` | Insert between the old last node and trailer. | A new card becomes last. |
| `delete_first()` | Delete `header._next`. | Return Marc; Ai becomes first. |
| `delete_last()` | Delete `trailer._prev`. | Return Fabio; Bagnaia becomes last. |

The insertion rows describe **where** an arbitrary new element would go; they are not new MotoGP results. Reading an end changes no links. Deleting either end returns the stored card and reduces size by one.

**Why this mapping?** It shows that all six public operations are short uses of the same two helpers. **How to solve a deque call:** choose the header side for "first" and the trailer side for "last"; read the adjacent node or insert/delete next to the appropriate sentinel.

<span id="part-3-trace"></span>

### 2. Trace Changes at Both Ends

Now follow **one connected sequence** using only the four verified cards. The order shown is the current software tray, not a revised race classification:

| Action | Real cards, front to back | First | Last | Size |
| :----- | :------------------------ | :---- | :--- | ---: |
| Start empty | [] | none | none | 0 |
| `insert_last(Ai)` | [Ai] | Ai | Ai | 1 |
| `insert_first(Marc)` | [Marc, Ai] | Marc | Ai | 2 |
| `insert_last(Bagnaia)` | [Marc, Ai, Bagnaia] | Marc | Bagnaia | 3 |
| `insert_last(Fabio)` | [Marc, Ai, Bagnaia, Fabio] | Marc | Fabio | 4 |
| `delete_last()` returns Fabio | [Marc, Ai, Bagnaia] | Marc | Bagnaia | 3 |
| `delete_first()` returns Marc | [Ai, Bagnaia] | Ai | Bagnaia | 2 |

After the four insertions, reading `first()` and `last()` returns Marc and Fabio without changing size 4. Deleting the back card is now quick: `trailer._prev` reaches Fabio, and `Fabio._prev` reaches Bagnaia. The singly linked list from Section 7.1 would have needed a predecessor search for a tail deletion.

**Why this sequence?** It starts with empty and one-card states, builds both ends, and then removes from both ends. **How to check each row:** name the two sentinel-adjacent real nodes and verify that the number of real nodes equals size.

<span id="part-3-cost"></span>

### 3. Handle Empty Ends and Count the Cost

For an empty deque, `len(d) == 0` and `d.is_empty()` is `True`. `first()`, `last()`, `delete_first()`, and `delete_last()` raise `Empty` because there is no real node to read or remove. Both insertion methods work on an empty deque by placing the new node between header and trailer.

| Method group | Worst-case time | Why |
| :----------- | --------------: | :-- |
| `first`, `last` | O(1) | Read a sentinel's adjacent real node. |
| `insert_first`, `insert_last` | O(1) | Call `_insert_between` with known neighbors. |
| `delete_first`, `delete_last` | O(1) | Call `_delete_node` on a known end node. |
| `len`, `is_empty` | O(1) | Read the stored size. |

For `n` cards, the deque uses **O(n) space**: one node per card, two link references per real node, and two fixed sentinels. A search by rider name remains O(n) in general. The added backward reference enables constant-time **known-node deletion** and deletion at the back; it does not make every possible operation constant time.

**Why test empty methods?** Accidentally reading `header._next._element` in an empty deque would read the **trailer sentinel**, not a rider card. **How to solve it:** check `is_empty()` before public reads or deletions and raise `Empty`.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Complete Worked Program

<span id="part-4-plan"></span>

### 1. Plan the Result-Card Tray

**Problem:** Build the selected Sprint card tray through both ends, read its two ends, remove the back and front cards, and verify the one-card and empty cases.

1. Use one string per card with its real Sprint place, rider, and team.
2. Let `_DoublyLinkedBase` own the sentinel links and size.
3. Let `LinkedDeque` choose which sentinel side each public operation uses.
4. Print the returned cards after deletions; read the new ends to check the links.
5. In a separate one-card tray, remove the only card and confirm an empty read raises `Empty`.

**Why this program?** It exercises all six deque end operations while making the sentinel behavior visible through returned values and sizes.

<span id="part-4-program"></span>

### 2. Run the Program

Save this as `sprint_card_deque.py` and run `python sprint_card_deque.py` with Python 3.

```python
class Empty(Exception):
    """A deque has no element to read or remove."""


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


# One selected subset of the 10 October 2026 Indonesian GP Sprint.
marc = "P1 Marc Márquez — Ducati Lenovo Team"
ai = "P2 Ai Ogura — SuperFile Trackhouse MotoGP Team"
bagnaia = "P8 Francesco Bagnaia — Ducati Lenovo Team"
fabio = "P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team"

tray = LinkedDeque()
print("Start: empty {}, size {}".format(tray.is_empty(), len(tray)))
tray.insert_last(ai)
tray.insert_first(marc)
tray.insert_last(bagnaia)
tray.insert_last(fabio)

print("First: {}".format(tray.first()))
print("Last: {}".format(tray.last()))
print("Size after insertions: {}".format(len(tray)))
print("Delete last: {}".format(tray.delete_last()))
print("New last: {}".format(tray.last()))
print("Delete first: {}".format(tray.delete_first()))
print("New first: {}".format(tray.first()))
print("Remaining size: {}".format(len(tray)))

# Independent edge check: one card is both first and last.
single = LinkedDeque()
single.insert_first(fabio)
print("One-card ends match: {}".format(single.first() == single.last()))
single.delete_last()
print("Empty after one-card deletion: {}".format(single.is_empty()))
try:
    single.first()
except Empty:
    print("Reading the empty deque raises Empty.")
```

The public methods do not expose sentinel nodes as rider cards. The separate `single` deque is an edge check, not another copy added to `tray`.

<span id="part-4-check"></span>

### 3. Check the Output and One-Node Case

```text
Start: empty True, size 0
First: P1 Marc Márquez — Ducati Lenovo Team
Last: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Size after insertions: 4
Delete last: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
New last: P8 Francesco Bagnaia — Ducati Lenovo Team
Delete first: P1 Marc Márquez — Ducati Lenovo Team
New first: P2 Ai Ogura — SuperFile Trackhouse MotoGP Team
Remaining size: 2
One-card ends match: True
Empty after one-card deletion: True
Reading the empty deque raises Empty.
```

The main tray ends with `[Ai, Bagnaia]` and size 2. In the independent one-card tray, Fabio's node has **both** sentinels as neighbors. Deleting it reconnects header directly to trailer and leaves size 0; the next `first()` call raises `Empty`.

**How to check the answer:** compare each printed end with the connected trace in Part 3. After `delete_last()`, Bagnaia must be at the back. After `delete_first()`, Ai must be at the front. The sentinels stay present throughout but are never returned or counted.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 7.3 idea | Plain-language meaning | Sprint-card example |
| :--------------- | :--------------------- | :------------------ |
| Doubly linked node | References to its element, predecessor, and successor. | Bagnaia's node links back to Ai and forward to Fabio in the selected tray. |
| Insert between nodes | Connect a new node to two known adjacent neighbors, then connect them back. | Insert Bagnaia between Ai and Fabio in O(1) once both nodes are known. |
| Delete a known node | Reconnect its predecessor and successor. | Remove Bagnaia's teaching card in O(1) given its node. |
| Search | Follow links until the desired element is found. | Finding Bagnaia by name can take O(n). |
| Sentinels | Fixed empty endpoint nodes, excluded from size. | Header and trailer still point to each other when no rider cards remain. |
| Linked deque | Read, insert, or delete at either end. | Remove Fabio from the back or Marc from the front in O(1). |
| Empty protection | Public reads and deletions raise `Empty` when size is zero. | An empty tray has no rider card to return. |

The riders, teams, and finishing places are real Sprint results. The tray operations are exercises in how doubly linked lists and deques work.

[🔝 Back to Top](#top)
