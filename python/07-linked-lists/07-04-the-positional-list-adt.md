<span id="top"></span>

# 7.4 The Positional List ADT — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.4, printed pages 277–284 (the supplied PDF).<br>
> **Topic:** 7.4 The Positional List ADT; 7.4.1 The Positional List Abstract Data Type; 7.4.2 Doubly Linked List Implementation.<br>
> **Domain Focus:** Ordering rectangular cards by area while keeping stable positions in the display.<br>
> **User Prompt:** Reexplain [`Section 7.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: An Area-Ordered Card Display](#background)
   - [1. Keep the rectangle measurements](#background-cards)
   - [2. Why remember a card's position?](#background-position)
2. [Part 1: 7.4 The Positional List ADT](#part-1)
   - [1. A position is a location, not an index](#part-1-location)
   - [2. Keep raw nodes behind the interface](#part-1-opaque)
   - [3. Follow one card's position through insertions](#part-1-trace)
3. [Part 2: 7.4.1 The Positional List Abstract Data Type](#part-2)
   - [1. Read positions and their neighbors](#part-2-access)
   - [2. Insert, replace, and delete at positions](#part-2-update)
   - [3. Traverse elements without numeric indices](#part-2-iterate)
4. [Part 3: 7.4.2 Doubly Linked List Implementation](#part-3)
   - [1. Wrap a node in a Position object](#part-3-wrapper)
   - [2. Validate positions and hide sentinels](#part-3-validate)
   - [3. Reuse the doubly linked helpers](#part-3-helpers)
   - [4. Understand the time costs](#part-3-cost)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Trace the result](#part-4-result)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: An Area-Ordered Card Display

<span id="background-cards"></span>

### 1. Keep the rectangle measurements

The [Section 7.3 guide](07-03-doubly-linked-lists.md) arranged rectangular cards in a two-ended tray. We keep its four physical cards and introduce one new card, `E`, for a later replacement. For each rectangle, **area = width × height**:

| Card | Width | Height | Individual area |
| :--- | ----: | -----: | --------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |
| `E` | 3 cm | 3 cm | 9 cm² |

The original `A`–`D` cards have an individual-area sum of **6 + 8 + 16 + 4 = 34 cm²**. `E` is a **different physical card**, not a second copy of one already in the display. These sums do not imply that the cards cover a board without gaps or overlap.

<span id="background-position"></span>

### 2. Why remember a card's position?

Suppose we want the display ordered by increasing area. We start with `[A, C]`, or **6 cm² before 16 cm²**. Later we discover smaller card `D` and intermediate card `B`. We want to insert them next to cards we already know:

```text
Start:          A(6) → C(16)                 total = 22 cm²
Add D before A: D(4) → A(6) → C(16)          total = 26 cm²
Add B after A:  D(4) → A(6) → B(8) → C(16)   total = 34 cm²
```

If we keep an integer index for `A`, inserting `D` before it changes that index from `0` to `1`. A **position** lets us continue to refer to the same `A` location while its numeric rank changes. The linked list stores the order; our geometry activity separately calculates each area and keeps the total.

> **Mental model:** A position is a bookmark attached to one place in the sequence. Other insertions can shift its rank without changing which node it identifies.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 7.4 The Positional List ADT

The [deque from Section 7.3](07-03-doubly-linked-lists.md) can edit either end but has no public operation for inserting beside a selected middle card. Section 7.4 adds a way to name a **location** in a sequence. The book's Figure 7.14 illustrates identifying a person in a line without relying on an integer index; our card display uses the same idea.

<span id="part-1-location"></span>

### 1. A position is a location, not an index

Let `p_A` denote the position containing card `A`. In `[A, C]`, its zero-based index would be `0`. After adding `D` before it, the index becomes `1`, yet `p_A.element()` still gives `A`. After adding `B` after `A`, `p_A` still names the same node.

| Display | Index of `A` | What `p_A` names |
| :------ | -----------: | :--------------- |
| `[A, C]` | 0 | Card `A` at its original node |
| `[D, A, C]` | 1 | The same `A` node |
| `[D, A, B, C]` | 1 | The same `A` node |

The position identifies a **particular occurrence** in the list. It is not the card's area, a coordinate on the board, or an integer slot. A position remains useful while other nodes are inserted or deleted; deleting **that position's own node** makes it invalid. Replacing its element changes what it contains but keeps the position.

<span id="part-1-opaque"></span>

### 2. Keep raw nodes behind the interface

The book asks whether we could expose a node reference directly as a position. It instead uses a separate `Position` object. Raw nodes reveal `_prev` and `_next` links, which callers could change and corrupt the sequence. They could also try to use a sentinel or a node from another list. Hiding nodes lets the list validate positions and change its internal representation without changing the public ADT.

```text
Public view:   p_A  ──element()──►  "A"
Internal view: p_A  ──wraps──────►  node("A", prev, next)
```

The user of a positional list asks for `before(p_A)` or `add_after(p_A, "B")`; it does not edit a node's links. This resembles an editor cursor: the cursor marks a place while text can be inserted around it.

<span id="part-1-trace"></span>

### 3. Follow one card's position through insertions

Our area-ordered display begins with positions `p_A` and `p_C`. `add_before(p_A, "D")` returns a new position for `D`; `add_after(p_A, "B")` returns one for `B`. The area total changes **22 → 26 → 34 cm²**. Meanwhile `p_A.element()` is still `"A"`, and `p_C.element()` is still `"C"`.

`p_C` has moved from zero-based index `1` to index `3`, but its position still reaches the same node. The list can make each **local** insertion without shifting all existing nodes. Finding a card **without already holding its position** can still require a traversal.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 7.4.1 The Positional List Abstract Data Type

An **abstract data type (ADT)** specifies operations and their results without telling callers how nodes are stored. Section 7.4.1 extends the earlier end-only interfaces with operations relative to a given position `p`.

<span id="part-2-access"></span>

### 1. Read positions and their neighbors

For a positional list `L`, the access operations are:

| Expression | Result | Card example for `[D, A, B, C]` |
| :--------- | :----- | :------------------------------- |
| `L.first()` | Position of the first element, or `None` if empty. | Position of `D`. |
| `L.last()` | Position of the last element, or `None` if empty. | Position of `C`. |
| `L.before(p)` | Position immediately before `p`, or `None` at the front. | `before(p_B)` is `p_A`. |
| `L.after(p)` | Position immediately after `p`, or `None` at the back. | `after(p_B)` is `p_C`. |
| `p.element()` | Element at position `p`. | `p_B.element()` is `"B"`. |
| `len(L)`, `L.is_empty()` | Number of elements; whether it is zero. | `4` and `False`. |

`first()` and `last()` return **positions**, not card labels. We call `.element()` to get a label. The boundary result `None` is not a position and does not represent a card; for example, `before(L.first())` is `None`.

<span id="part-2-update"></span>

### 2. Insert, replace, and delete at positions

These update operations use a known position when one is needed. Each row below starts independently from `[D, A, B, C]`, with individual-area sum **34 cm²**:

| Expression | Return or effect | Geometry consequence if our application updates its ledger |
| :--------- | :--------------- | :--------------------------------------------------------- |
| `L.add_first(e)` | Insert at front; return new position. | Adding a new card changes the total by its area. |
| `L.add_last(e)` | Insert at back; return new position. | Same rule at the other end. |
| `L.add_before(p_A, e)` | Insert just before `A`; return new position. | New card sits between `D` and `A`. |
| `L.add_after(p_A, e)` | Insert just after `A`; return new position. | New card sits between `A` and `B`. |
| `L.replace(p_B, "E")` | Return old element `"B"`; `p_B` remains valid and now contains `"E"`. | Replace 8 cm² by 9 cm²: **34 − 8 + 9 = 35 cm²**. |
| `L.delete(p_D)` | Remove `D`, return `"D"`, and invalidate `p_D`. | **34 − 4 = 30 cm²** if deletion is done before replacement. |

The table's rows are **independent**: applying both the replacement and deletion in sequence would give **35 − 4 = 31 cm²**, which is the program's final total below. The list does not calculate any of these areas; it returns elements so the application can update its ledger.

<span id="part-2-iterate"></span>

### 3. Traverse elements without numeric indices

The book shows traversal by moving from position to position:

```python
cursor = L.first()
while cursor is not None:
    print(cursor.element())
    cursor = L.after(cursor)
```

It also supports the simpler `for label in L:` form. The iterator yields **elements**, such as `"D"`, `"A"`, `"B"`, `"C"`, not `Position` objects. In our geometry activity, this makes a check of the area total easy to read:

```python
checked_area = sum(area_of(label) for label in L)
```

That sum visits every current card, so it takes **O(n)** time for *n* cards. A separate running total can be updated in O(1) after each successful single-card edit when the card's area is already known. The book's Example 7.1 similarly traces positions through additions, deletion, and replacement; our cards supply the geometry for that pattern.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 7.4.2 Doubly Linked List Implementation

The implementation extends the [doubly linked base from Section 7.3](07-03-doubly-linked-lists.md). Its fixed header and trailer sentinels surround the real nodes. Section 7.4.2 adds a `Position` wrapper and methods that translate between public positions and private nodes.

<span id="part-3-wrapper"></span>

### 1. Wrap a node in a Position object

A `Position` stores two private references: its **container** and its **node**. The container identifies which list owns it; the node identifies the location. `.element()` returns the node's current element.

Two different wrapper objects for the **same node** compare equal as positions. For example, after deleting `D` from the front, a fresh `L.first()` and the earlier saved `p_A` both name the same `A` node, so `L.first() == p_A` is `True`. They need not be the same Python wrapper object.

Replacing `B` with `E` changes the node's element. The saved middle position still refers to that node, so its `.element()` changes from `"B"` to `"E"`. This is why a position is best read as a **location** rather than a permanent label.

<span id="part-3-validate"></span>

### 2. Validate positions and hide sentinels

Before using `p` to edit or navigate, `_validate(p)` checks three things:

| Check | Failure | Why it matters |
| :---- | :------ | :------------- |
| `p` is a `Position` object | `TypeError` | An integer index or card label is not a position. |
| `p` belongs to **this** list | `ValueError` | A position from another display cannot edit this one. |
| Its node has not been deleted | `ValueError` | A removed location must not be reused. |

The [Section 7.3 base](07-03-doubly-linked-lists.md) clears a deleted node's `_next` field to `None`. The implementation uses that marker to reject a deleted position. `_make_position(node)` wraps a **real** node but returns `None` for the header or trailer sentinel. Thus `before(first())` and `after(last())` return `None` rather than exposing dummy endpoints.

Calling a list method such as `L.after(deleted_position)` is rejected. Do not expect `deleted_position.element()` itself to raise: in the book's class it directly reads a node field and does not call `_validate`. Once deleted, the position is invalid and should not be used.

<span id="part-3-helpers"></span>

### 3. Reuse the doubly linked helpers

The base class already knows how to `_insert_between(element, predecessor, successor)` and `_delete_node(node)` in O(1) time when the nodes are known. `PositionalList` overrides the insertion helper to wrap the returned node as a `Position`.

| Public operation | Nodes supplied to the helper or direct action |
| :--------------- | :-------------------------------------------- |
| `add_first(e)` | Insert between header and old first node. |
| `add_last(e)` | Insert between old last node and trailer. |
| `add_before(p, e)` | Validate `p`, then insert between `p`'s predecessor and its node. |
| `add_after(p, e)` | Validate `p`, then insert between its node and successor. |
| `delete(p)` | Validate `p`, then delete its node and return the old element. |
| `replace(p, e)` | Validate `p`, change only its element, and return the old one. |

`first`, `last`, `before`, and `after` similarly wrap the appropriate real node or return `None` at a sentinel. `__iter__` starts at `first()` and repeatedly calls `after()`, yielding each `.element()`.

<span id="part-3-cost"></span>

### 4. Understand the time costs

The book's Proposition 7.2 states that each individual positional-list ADT method runs in **O(1) worst-case time** with this doubly linked representation. Validation, neighbor access, and a local link update each use a fixed number of references. For *n* elements, the list's nodes use **O(n) space**; any `Position` wrappers saved by callers use additional space.

This bound assumes the caller **already has a position** for operations that require one. Locating a card by its label or numeric rank can take **O(n)** traversal. A complete `for` loop over all *n* elements also takes **O(n)** time, even though each step to the next position is O(1).

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

The code makes the guide runnable on its own. `_DoublyLinkedBase` maintains private links and sentinels; `PositionalList` exposes positions. The geometry table and `display_area` remain outside both classes.

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

    def delete(self, p):
        node = self._validate(p)
        return self._delete_node(node)

    def replace(self, p, element):
        node = self._validate(p)
        old = node._element
        node._element = element
        return old


CARD_SIZES = {
    "A": (2, 3), "B": (4, 2), "C": (4, 4),
    "D": (2, 2), "E": (3, 3),
}


def area_of(label):
    width, height = CARD_SIZES[label]
    return width * height


def report(action, display, total_area):
    print("{}: {}, {} cm^2".format(action, list(display), total_area))


display = PositionalList()
p_A = display.add_first("A")
p_C = display.add_last("C")
display_area = area_of("A") + area_of("C")
report("Start", display, display_area)

p_D = display.add_before(p_A, "D")
display_area += area_of("D")
report("Add D before A", display, display_area)

middle = display.add_after(p_A, "B")
display_area += area_of("B")
report("Add B after A", display, display_area)
print("Neighbors of B: {} and {}".format(
    display.before(middle).element(), display.after(middle).element()
))

old = display.replace(middle, "E")
display_area += area_of("E") - area_of(old)
report("Replace B with E", display, display_area)
print("Middle position now contains: {}".format(middle.element()))

removed = display.delete(p_D)
display_area -= area_of(removed)
report("Delete D", display, display_area)
print("Saved A and C positions: {}, {}".format(p_A.element(), p_C.element()))
print("Fresh first position equals saved A: {}".format(display.first() == p_A))
print("Recomputed area: {} cm^2".format(
    sum(area_of(label) for label in display)
))

try:
    display.after(p_D)
except ValueError:
    print("Deleted D position is invalid")
```

`display_area` changes only after a successful edit. `list(display)` uses `__iter__` to show elements in order. The saved `p_A`, `p_C`, and `middle` positions remain valid through the insertions and replacement; the deleted `p_D` does not.

<span id="part-4-result"></span>

### 2. Trace the result

| Action | Card order | Individual-area sum | What happens to positions |
| :----- | :--------- | ------------------: | :------------------------ |
| Start | `[A, C]` | 22 cm² | Save `p_A` and `p_C`. |
| Add `D` before `p_A` | `[D, A, C]` | 26 cm² | New `p_D`; `p_A` still names `A`. |
| Add `B` after `p_A` | `[D, A, B, C]` | 34 cm² | New `middle` names `B`; `p_C` still names `C`. |
| Replace at `middle` with `E` | `[D, A, E, C]` | 35 cm² | The **same** `middle` position now contains `E`. |
| Delete `p_D` | `[A, E, C]` | 31 cm² | `p_D` becomes invalid; the other positions remain valid. |

The exact printed result is:

```text
Start: ['A', 'C'], 22 cm^2
Add D before A: ['D', 'A', 'C'], 26 cm^2
Add B after A: ['D', 'A', 'B', 'C'], 34 cm^2
Neighbors of B: A and C
Replace B with E: ['D', 'A', 'E', 'C'], 35 cm^2
Middle position now contains: E
Delete D: ['A', 'E', 'C'], 31 cm^2
Saved A and C positions: A, C
Fresh first position equals saved A: True
Recomputed area: 31 cm^2
Deleted D position is invalid
```

The final area check uses **6 + 9 + 16 = 31 cm²**. It also shows that iteration visits the current elements after replacement and deletion, not earlier card labels or sentinel nodes.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What happens to an index when a smaller card is inserted?</strong></summary>

**Scenario:** The display is `[A, C]`, with areas 6 and 16 cm². We save `p_A`, then add 4 cm² card `D` before it.

**Index result:** `A` moves from zero-based index `0` to `1`. The positional-list interface does not require us to update `p_A`; it still identifies `A`.

**Geometry result:** The individual-area sum becomes **22 + 4 = 26 cm²**, and the order `[D, A, C]` remains increasing by area.

</details>

<details>
<summary><strong>Case Study 2: Does replacing a card erase its position?</strong></summary>

**Scenario:** The display is `[D, A, B, C]`, and `middle` names the position containing `B`.

**Operation:** `replace(middle, "E")` returns `"B"` and keeps the same node. `middle.element()` now returns `"E"`.

**Geometry result:** `B` contributes 8 cm² and new card `E` contributes 9 cm², so the total changes **34 − 8 + 9 = 35 cm²**. The order `[D, A, E, C]` is still increasing by area.

</details>

<details>
<summary><strong>Case Study 3: Can we reuse a deleted or foreign position?</strong></summary>

**Scenario:** We delete `p_D` from `[D, A, E, C]`, leaving `[A, E, C]` and **35 − 4 = 31 cm²**.

**Position rule:** A later `display.after(p_D)` raises `ValueError`: the node was deleted. Passing a position from a different `PositionalList` to `display.after(...)` also raises `ValueError`; passing a label or integer instead of a position raises `TypeError`.

**Geometry result:** Failed operations make no list change, so the area stays **31 cm²**. The saved positions of `A`, `E`, and `C` remain valid.

</details>

<details>
<summary><strong>Case Study 4: What do neighbors return at the ends?</strong></summary>

**Scenario:** The final display is `[A, E, C]`. We ask for the card before the first and after the last.

**Result:** `display.before(display.first())` and `display.after(display.last())` both return `None`. Empty lists also return `None` for `first()` and `last()`. The fixed header and trailer are never exposed as card positions.

**Geometry check:** The current display still has **6 + 9 + 16 = 31 cm²**; asking for neighbors does not add or remove a card.

</details>

<details>
<summary><strong>Case Study 5: Is summing area as fast as one local edit?</strong></summary>

**Scenario:** After deleting `D`, we compute `sum(area_of(label) for label in display)`.

**Result:** The iterator visits `A`, `E`, and `C`, giving **6 + 9 + 16 = 31 cm²**. For *n* cards, this complete check costs **O(n)** time. A single `add_before`, `replace`, or `delete` at an already known position costs **O(1)** time, apart from the application's own area lookup and arithmetic.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 7.4 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Position** | A handle to one location, independent of its numeric rank. | `p_A` still names `A` after `D` is inserted before it. |
| **Opaque wrapper** | Public positions hide nodes and record their owning list. | Call `p_A.element()` without editing `_prev` or `_next`. |
| **Neighbor access** | `before(p)` and `after(p)` return adjacent positions or `None` at an end. | `before(middle)` is `A`; `after(middle)` is `C`. |
| **Insertion** | Add a new element at an end or beside a known position. | Add `D` before `A`, then `B` after `A`. |
| **Replacement** | Change the element at a position and return the old one. | Replace 8 cm² `B` with 9 cm² `E`; `middle` stays valid. |
| **Deletion** | Remove an element, return it, and invalidate its position. | Delete `D`; the total goes 35 → 31 cm². |
| **Validation** | Reject wrong-type, foreign, or deleted positions. | `after(p_D)` fails after `D` is deleted. |
| **Iteration** | Yield current elements in order; a full pass takes O(n). | Visit `A`, `E`, `C` to check 31 cm². |
| **Local cost** | Each individual ADT operation is O(1) worst case with a known position. | Add `B` after `p_A` without shifting other cards. |

The positional list determines **where a card sits** and keeps that place available through nearby edits. The geometry activity determines **how much area each card contributes** and updates its separate total.

[🔝 Back to Top](#top)
