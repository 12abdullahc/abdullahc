<span id="top"></span>

# Linked Lists — Section 7.4: The Positional List ADT

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 7 PDF](<../../file/Data Structures and Algorithms in Python - C07.pdf>), Section 7.4 (printed pages 277–284).  
> **Topic:** Positions as stable list handles, the positional-list interface, and its doubly linked implementation.  
> **Domain focus:** Selected result cards from the **10 October 2026 Indonesian Grand Prix MotoGP Sprint** at Mandalika.  
> **Learning goal:** Use a position instead of a numeric index, edit beside a known position, and recognize valid, foreign, and deleted positions.  
> **User Prompt:** "Reexplain Section 7.4 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Selected Sprint Result View](#background-intuition)
2. [Part 1: Section 7.4 — Why Positions?](#part-1)
   - [1. A position identifies a node, not an index](#part-1-location)
   - [2. Keep node references behind the interface](#part-1-opaque)
   - [3. Follow Fabio's saved position through insertions](#part-1-trace)
3. [Part 2: Section 7.4.1 — The Positional List ADT](#part-2)
   - [1. Read positions and their neighbors](#part-2-access)
   - [2. Insert, replace, and delete](#part-2-update)
   - [3. Traverse and handle the ends](#part-2-iterate)
4. [Part 3: Section 7.4.2 — Doubly Linked Implementation](#part-3)
   - [1. Wrap a private node in a Position](#part-3-wrapper)
   - [2. Validate positions and hide sentinels](#part-3-validate)
   - [3. Reuse local link helpers](#part-3-helpers)
   - [4. Count costs without hiding search time](#part-3-cost)
5. [Part 4: One Complete Worked Program](#part-4)
   - [1. Plan the selected-result view](#part-4-plan)
   - [2. Run the program](#part-4-program)
   - [3. Trace and check its output](#part-4-check)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Selected Sprint Result View

The [official 2026 Indonesian GP Sprint classification](https://www.motogp.com/en/gp-results/2026/ina/motogp/spr/classification) and [MotoGP's 10 October report](https://www.motogp.com/en/news/2026/10/10/menangi-sprint-mandalika-marc-marquez-kembali-puncaki-klasemen-motogp/1174849) identify these real riders, teams, and finishing places:

| Sprint finish | Rider | Team |
| :------------ | :---- | :--- |
| P1 | Marc Márquez | Ducati Lenovo Team |
| P2 | Ai Ogura | SuperFile Trackhouse MotoGP Team |
| P8 | Francesco Bagnaia | Ducati Lenovo Team |
| P9 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |

Our software list holds **copies of selected result cards**. It omits P3–P7, so links between Ai, Bagnaia, and Fabio represent neighbors in this *selected view*, not adjacency in the full classification. Insertion, replacement, or deletion below changes only this practice list; it does not change the Sprint results.

The word **position** has two unrelated meanings here. "P9" is Fabio's **fixed race finishing place**. A `PositionalList.Position` is a **software handle to a particular list node**. If we insert another card before Fabio, his selected-list index changes, but his official finishing place remains P9 and the saved handle still reaches his node.

The [linked deque in Section 7.3](07-03-doubly-linked-lists.md) can edit both ends. A positional list also lets us edit **beside a known middle node**. Imagine first storing Marc and Fabio, then adding Ai after Marc and Bagnaia before Fabio:

```text
Start:                 Marc(P1) → Fabio(P9)
Add Ai after Marc:     Marc(P1) → Ai(P2) → Fabio(P9)
Add Bagnaia before Fabio:
                       Marc(P1) → Ai(P2) → Bagnaia(P8) → Fabio(P9)
```

**Why these cards?** Marc and Fabio are the requested focus. Ai and Bagnaia make the same saved Fabio handle survive two insertions before it. **How to read the example:** compare Fabio's *zero-based index in this selected list* (1, then 2, then 3) with his unchanged P9 race label. A position handle follows the node, not the integer index.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 7.4 — Why Positions?

<span id="part-1-location"></span>

### 1. A Position Identifies a Node, Not an Index

Suppose `p_fabio` names the list node containing Fabio's card. The positions of other nodes can change as cards are inserted, but `p_fabio.element()` continues to read Fabio's card until that node is deleted or its element is replaced.

| Selected-list state | Fabio's zero-based index | What `p_fabio` names |
| :------------------ | -----------------------: | :------------------- |
| Marc, Fabio | 1 | The Fabio node |
| Marc, Ai, Fabio | 2 | The same Fabio node |
| Marc, Ai, Bagnaia, Fabio | 3 | The same Fabio node |

The position is a handle to a **particular occurrence** in this list. It is not the rider's P9 finishing place, the node's current numeric rank, or a permanent promise that the node will always contain the same text. `replace(p_fabio, e)` changes the element at that node while keeping the position valid; `delete(p_fabio)` removes the node and invalidates the position.

**Why save Fabio's position?** It lets us insert Bagnaia immediately before Fabio even after earlier edits have shifted Fabio's index. **How to solve a local edit:** obtain a position once, keep it while other nodes are inserted, and pass it to `add_before` or `add_after` instead of guessing an updated integer index.

<span id="part-1-opaque"></span>

### 2. Keep Node References Behind the Interface

The book considers whether callers could use raw node references as positions. It wraps each node in a separate `Position` object instead. That boundary has three benefits:

1. Callers can read `p.element()` without reaching into `_prev` or `_next` and accidentally breaking links.
2. The list can reject a handle from another list or a deleted node, and it can keep its header and trailer **sentinels** private.
3. The public interface can stay the same if the internal representation changes.

```text
Public:   p_fabio.element() → Fabio's selected result card
Private:  p_fabio → Position(container, node) → node(prev, element, next)
```

**Why this example?** A rider card is easy to recognize, so the difference between a public card read and a private node link is visible. **How to use the interface:** call `before(p_fabio)` or `add_before(p_fabio, bagnaia_card)`. Do not edit `p_fabio._node._prev` yourself.

<span id="part-1-trace"></span>

### 3. Follow Fabio's Saved Position Through Insertions

Start with `p_marc = L.add_first(marc_card)` and `p_fabio = L.add_last(fabio_card)`. Then:

1. `p_ai = L.add_after(p_marc, ai_card)` inserts Ai between Marc and Fabio.
2. `p_bagnaia = L.add_before(p_fabio, bagnaia_card)` inserts Bagnaia before Fabio.
3. `L.before(p_fabio)` returns a position for Bagnaia; `L.after(p_marc)` returns one for Ai.
4. A fresh `L.last()` and the saved `p_fabio` refer to the **same node**, so the positions compare equal.

The list changed from two to four nodes, but `p_fabio` was never recomputed. If Bagnaia's node is later deleted, `p_fabio` remains valid because Fabio's own node was not deleted.

**Why this trace?** It connects the ADT idea to the exact operations we will implement. **How to check it:** draw the selected order after each insertion, mark the saved node handles, then ask which node each neighbor operation returns. The race labels P1, P2, P8, P9 never change.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 7.4.1 — The Positional List ADT

An **abstract data type (ADT)** describes which operations a list offers and what they return. It does not require callers to know how the nodes and sentinels are represented. Here `L` is a positional list and `p` is one of its valid positions.

<span id="part-2-access"></span>

### 1. Read Positions and Their Neighbors

| Expression | Result | Selected-card example |
| :--------- | :----- | :-------------------- |
| `L.first()` | First `Position`, or `None` if empty. | Position for Marc. |
| `L.last()` | Last `Position`, or `None` if empty. | Position for Fabio. |
| `L.before(p)` | Preceding `Position`, or `None` at the front. | `before(p_fabio)` is Bagnaia's position. |
| `L.after(p)` | Following `Position`, or `None` at the back. | `after(p_marc)` is Ai's position. |
| `p.element()` | Element stored at that position. | `p_fabio.element()` reads Fabio's card. |
| `len(L)`, `L.is_empty()` | Count and whether it is zero. | `4` and `False` after both insertions. |

`first()` and `last()` return **positions**, not rider-card strings. To read a card, call `L.first().element()` after checking that the list is nonempty. At a boundary, `before(L.first())` and `after(L.last())` return `None`, not a sentinel node.

**Why this table?** It separates a *handle* from the element that the handle refers to. **How to solve a neighbor question:** start with a valid position, move one step with `before` or `after`, test whether the result is `None`, then call `.element()` only on a real position.

<span id="part-2-update"></span>

### 2. Insert, Replace, and Delete

| Expression | What it does | Return value |
| :--------- | :----------- | :----------- |
| `L.add_first(e)` | Insert `e` at the front. | New position. |
| `L.add_last(e)` | Insert `e` at the back. | New position. |
| `L.add_before(p, e)` | Insert `e` just before `p`. | New position. |
| `L.add_after(p, e)` | Insert `e` just after `p`. | New position. |
| `L.replace(p, e)` | Change the element at `p` without changing its node. | Old element. |
| `L.delete(p)` | Remove the node at `p`. | Removed element; `p` becomes invalid. |

The first four operations **return positions**, which can be saved for later edits. `replace` returns the old card, leaves the list size unchanged, and keeps `p` valid; the position now reads the new element. `delete` returns the removed card, decreases size by one, and makes that position unusable.

The book's Example 7.1 traces the same rules with small numbers. Superscripts below show which saved position names each element, rather than a numeric index:

| Operation | List after the operation | Returned value |
| :-------- | :----------------------- | :------------- |
| `p = L.add_last(8)` | `8ᵖ` | New position `p`. |
| `q = L.add_after(p, 5)` | `8ᵖ, 5ᑫ` | New position `q`. |
| `r = L.add_before(q, 3)` | `8ᵖ, 3ʳ, 5ᑫ` | New position `r`. |
| `s = L.add_first(9)` | `9ˢ, 8ᵖ, 3ʳ, 5ᑫ` | New position `s`. |
| `L.delete(L.last())` | `9ˢ, 8ᵖ, 3ʳ` | Removed element `5`; `q` is invalid. |
| `L.replace(p, 7)` | `9ˢ, 7ᵖ, 3ʳ` | Old element `8`; `p` remains valid. |

**How to solve the trace:** keep each letter attached to its node as elements are inserted. At the fifth step, `L.last()` is the node named by `q`, so deletion returns `5`. At the sixth step, `p` still names its original node, so replacement returns the old `8` and leaves that node named by `p`. Our Sprint cards provide named values for the same reasoning.

**Why show replace and delete separately?** Both return an old element, but only deletion removes a node. **How to solve an update:** decide whether the location should remain. Use `replace` for a corrected record at the same node; use `delete` to remove that selected-view node.

<span id="part-2-iterate"></span>

### 3. Traverse and Handle the Ends

The ADT can visit every element by moving through positions:

```python
cursor = L.first()
while cursor is not None:
    print(cursor.element())
    cursor = L.after(cursor)
```

The implementation also makes `for card in L:` work. That iteration yields **elements** (the result-card strings), not `Position` wrappers. It starts at `first()` and repeatedly calls `after()` until the result is `None`.

**Why this example?** It shows how to scan a list without numeric indexes and why a boundary result of `None` matters. **How to solve a traversal:** test the current position before reading it, yield or print its element, then advance exactly once. Visiting `n` cards takes **O(n) total time**, even though each move to the next position takes O(1).

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 7.4.2 — Doubly Linked Implementation

The implementation extends the [doubly linked base from Section 7.3](07-03-doubly-linked-lists.md). Its header and trailer sentinels surround the real nodes. `PositionalList` adds public `Position` objects while keeping those nodes private.

<span id="part-3-wrapper"></span>

### 1. Wrap a Private Node in a Position

Each `Position` stores `_container` (which list owns it) and `_node` (which location it identifies). `p.element()` reads that node's current element. Two different wrapper objects for the **same node** compare equal. For example, after building the selected list, `p_fabio == L.last()` is `True` even if the two wrapper objects are not the same Python object.

`replace(p_fabio, corrected_card)` changes the element in Fabio's node. The saved position still reaches that node and now returns `corrected_card`. A position is thus a handle to a location, not a permanent copy of its old element.

**Why this example?** Saving Fabio's handle before the two insertions lets us test node identity afterward. **How to check it:** compare the saved handle with a newly returned handle for the same last node, then read its element.

<span id="part-3-validate"></span>

### 2. Validate Positions and Hide Sentinels

Before a list method follows a position, `_validate(p)` checks three cases:

| Check | Error when it fails | Reason |
| :---- | :------------------ | :----- |
| `p` is a `Position` object | `TypeError` | An integer index or card string is not a position. |
| `p` belongs to this list | `ValueError` | A handle from another list cannot edit this one. |
| Its node has not been deleted | `ValueError` | A removed location cannot be used again. |

The base class clears a deleted node's `_next` to `None`. `_validate` uses that marker to reject the stale handle. A separate `_make_position(node)` wraps **real** nodes and returns `None` for the header or trailer sentinel. That is why `L.first()` on an empty list and `L.before(L.first())` at the front return `None` instead of exposing a dummy node.

There is a subtle limit: in the book's implementation, `p.element()` directly reads the node and does **not** call `_validate`. After deletion, a stale `p.element()` may return `None`; it is not a valid way to use the position. List methods such as `L.after(p)` do reject it.

**Why these checks?** A private node reference alone would let callers mix lists or reuse a detached node. **How to solve an invalid-position case:** identify whether the input has the wrong type, belongs to another list, or was deleted; then expect the specified error from a list method.

<span id="part-3-helpers"></span>

### 3. Reuse Local Link Helpers

The base class already has `_insert_between(e, predecessor, successor)` and `_delete_node(node)`. Both change a fixed number of links when their nodes are known. `PositionalList` overrides the insertion helper so it returns a **Position** around the newly created node, rather than exposing the raw node.

| Public operation | Internal action |
| :--------------- | :-------------- |
| `add_first(e)` | Insert between header and the old first node. |
| `add_last(e)` | Insert between the old last node and trailer. |
| `add_before(p, e)` | Validate `p`; insert between its predecessor and its node. |
| `add_after(p, e)` | Validate `p`; insert between its node and successor. |
| `replace(p, e)` | Validate `p`; change only its node's element. |
| `delete(p)` | Validate `p`; unlink its node and return the old element. |

`before(p)` and `after(p)` also validate `p`, step to one neighboring node, and wrap it unless it is a sentinel. The header and trailer make front, back, and middle insertion use the same link-changing helper.

**Why this mapping?** It explains how the ADT can expose middle edits without giving callers raw links. **How to solve an implementation question:** validate the public position, obtain its private node, apply one local helper, then wrap any returned node for the caller.

<span id="part-3-cost"></span>

### 4. Count Costs Without Hiding Search Time

The book's Proposition 7.2 gives **O(1) worst-case time** for an individual positional-list ADT operation in this doubly linked representation. Each validation, neighbor step, replacement, or local link change uses a fixed number of references, provided the caller already has any required position.

For `n` stored elements, the list uses **O(n) space** for its nodes; positions saved by callers are additional wrapper objects. Finding a rider by name or finding a numeric rank without a saved position can require **O(n)** traversal. A complete iteration over all `n` elements also takes **O(n)** total time.

**Why make the distinction?** "Insert before Fabio" is quick once `p_fabio` exists; finding Fabio's card from scratch is a separate task. **How to analyze a whole algorithm:** add the search or traversal cost to the local edit cost. One search plus one insertion is O(n) overall in general.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Complete Worked Program

<span id="part-4-plan"></span>

### 1. Plan the Selected-Result View

**Problem:** Keep a saved handle to Fabio's card while inserting other verified Sprint cards before it. Correct an incomplete draft card with `replace`, then remove Bagnaia's card from this selected view and test position validation.

1. Build the list with Marc's complete card and a draft Fabio card that has no team yet.
2. Save the returned Marc and Fabio positions.
3. Add Ai after Marc and Bagnaia before Fabio; retain the new positions.
4. Read neighbors and compare saved positions with fresh ones.
5. Replace Fabio's **incomplete draft text** with his verified full rider-and-team card. This is a data-entry correction in our view, not a change to the real result.
6. Delete Bagnaia from the teaching view, then try a deleted position, a foreign position, and a non-position input.

**Why this problem?** The same Fabio node survives index shifts and replacement, while the deleted Bagnaia position becomes invalid. Those are the distinctions Section 7.4 asks us to understand.

<span id="part-4-program"></span>

### 2. Run the Program

Save this as `sprint_positions.py` and run `python sprint_positions.py` with Python 3. The nested `Position` and the three validation checks follow the book's implementation pattern.

```python
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


class PositionalList(_DoublyLinkedBase):
    class Position:
        def __init__(self, container, node):
            self._container = container
            self._node = node

        def element(self):
            return self._node._element

        def __eq__(self, other):
            return type(other) is type(self) and other._node is self._node

        def __ne__(self, other):
            return not (self == other)

    def _validate(self, p):
        if not isinstance(p, self.Position):
            raise TypeError("p must be a Position")
        if p._container is not self:
            raise ValueError("p belongs to a different list")
        if p._node._next is None:
            raise ValueError("p is no longer valid")
        return p._node

    def _make_position(self, node):
        if node is self._header or node is self._trailer:
            return None
        return self.Position(self, node)

    def first(self):
        return self._make_position(self._header._next)

    def last(self):
        return self._make_position(self._trailer._prev)

    def before(self, p):
        node = self._validate(p)
        return self._make_position(node._prev)

    def after(self, p):
        node = self._validate(p)
        return self._make_position(node._next)

    def __iter__(self):
        cursor = self.first()
        while cursor is not None:
            yield cursor.element()
            cursor = self.after(cursor)

    def _insert_between(self, element, predecessor, successor):
        node = super()._insert_between(element, predecessor, successor)
        return self._make_position(node)

    def add_first(self, element):
        return self._insert_between(element, self._header, self._header._next)

    def add_last(self, element):
        return self._insert_between(element, self._trailer._prev, self._trailer)

    def add_before(self, p, element):
        node = self._validate(p)
        return self._insert_between(element, node._prev, node)

    def add_after(self, p, element):
        node = self._validate(p)
        return self._insert_between(element, node, node._next)

    def replace(self, p, element):
        node = self._validate(p)
        old = node._element
        node._element = element
        return old

    def delete(self, p):
        node = self._validate(p)
        return self._delete_node(node)


def show(label, sequence):
    print("{}:".format(label))
    for card in sequence:
        print("  {}".format(card))


# One selected subset of the 10 October 2026 Indonesian GP Sprint.
marc = "P1 Marc Márquez — Ducati Lenovo Team"
ai = "P2 Ai Ogura — SuperFile Trackhouse MotoGP Team"
bagnaia = "P8 Francesco Bagnaia — Ducati Lenovo Team"
fabio_draft = "P9 Fabio Quartararo"
fabio_verified = "P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team"

selected = PositionalList()
p_marc = selected.add_first(marc)
p_fabio = selected.add_last(fabio_draft)
show("Start", selected)

p_ai = selected.add_after(p_marc, ai)
p_bagnaia = selected.add_before(p_fabio, bagnaia)
show("After two insertions", selected)
print("Size: {}".format(len(selected)))
print("Fabio handle equals last: {}".format(p_fabio == selected.last()))
print("Ai handle equals after Marc: {}".format(p_ai == selected.after(p_marc)))
print("Before Fabio: {}".format(selected.before(p_fabio).element()))

old = selected.replace(p_fabio, fabio_verified)
print("Replaced draft: {}".format(old))
print("Fabio card now: {}".format(p_fabio.element()))

removed = selected.delete(p_bagnaia)
print("Deleted from selected view: {}".format(removed))
show("After deletion", selected)
print("Fabio handle still valid: {}".format(
    p_fabio == selected.last() and p_fabio.element() == fabio_verified
))
print("Boundary neighbors are None: {}".format(
    selected.before(selected.first()) is None
    and selected.after(selected.last()) is None
))

try:
    selected.after(p_bagnaia)
except ValueError:
    print("Deleted position rejected: ValueError")

other = PositionalList()
foreign = other.add_first(marc)
try:
    selected.before(foreign)
except ValueError:
    print("Foreign position rejected: ValueError")

try:
    selected.after(0)
except TypeError:
    print("Integer index rejected: TypeError")
```

The initial `fabio_draft` intentionally omits the team; `replace` fills in the verified team at the **same node**. `show` traverses elements using `__iter__`. The final list contains Marc, Ai, and Fabio; Bagnaia remains P8 in the actual Sprint classification.

<span id="part-4-check"></span>

### 3. Trace and Check Its Output

```text
Start:
  P1 Marc Márquez — Ducati Lenovo Team
  P9 Fabio Quartararo
After two insertions:
  P1 Marc Márquez — Ducati Lenovo Team
  P2 Ai Ogura — SuperFile Trackhouse MotoGP Team
  P8 Francesco Bagnaia — Ducati Lenovo Team
  P9 Fabio Quartararo
Size: 4
Fabio handle equals last: True
Ai handle equals after Marc: True
Before Fabio: P8 Francesco Bagnaia — Ducati Lenovo Team
Replaced draft: P9 Fabio Quartararo
Fabio card now: P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Deleted from selected view: P8 Francesco Bagnaia — Ducati Lenovo Team
After deletion:
  P1 Marc Márquez — Ducati Lenovo Team
  P2 Ai Ogura — SuperFile Trackhouse MotoGP Team
  P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Fabio handle still valid: True
Boundary neighbors are None: True
Deleted position rejected: ValueError
Foreign position rejected: ValueError
Integer index rejected: TypeError
```

| Moment | Selected-list order | What happened to saved handles |
| :----- | :------------------ | :----------------------------- |
| Start | Marc → Fabio draft | Save `p_marc` and `p_fabio`. |
| After both insertions | Marc → Ai → Bagnaia → Fabio draft | `p_fabio` still names Fabio's node; its zero-based index is now 3. |
| After `replace` | Marc → Ai → Bagnaia → Fabio verified | `p_fabio` names the same node with corrected text. |
| After `delete(p_bagnaia)` | Marc → Ai → Fabio verified | `p_bagnaia` is invalid; the other saved handles remain valid. |

**How to check the answer:** count the real nodes after each update, compare saved positions with fresh `first()` or `last()` results, and distinguish a changed **element** from a removed **node**. A foreign handle and an integer fail validation before any link changes.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 7.4 idea | Plain-language meaning | Sprint-card example |
| :--------------- | :--------------------- | :------------------ |
| `Position` | Handle to one list node, not an integer index or race place. | `p_fabio` survives insertions even as Fabio's selected-list index changes. |
| `element()` | Read the node's current element. | After `replace`, `p_fabio.element()` has the complete team name. |
| Neighbor access | `before` and `after` return positions or `None` at an end. | `before(p_fabio)` names Bagnaia before deletion. |
| Local insertion | Add before or after a known position. | Insert Ai after Marc and Bagnaia before Fabio. |
| Replacement | Change the element but keep the node and position. | Complete Fabio's draft card. |
| Deletion | Remove a node, return its element, invalidate its position. | Remove Bagnaia from the teaching view. |
| Validation | Reject wrong-type, foreign, or deleted positions. | `selected.after(0)` raises `TypeError`. |
| Cost | Each ADT operation is O(1) with a known position; a full scan is O(n). | Finding an unknown rider still requires traversal. |

The Sprint places, riders, and teams are real; the selected-list edits are exercises in the positional-list ADT.

[🔝 Back to Top](#top)
