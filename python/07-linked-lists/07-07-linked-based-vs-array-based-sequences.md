<span id="top"></span>

# 7.7 Link-Based vs. Array-Based Sequences — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.7, printed pages 292–293 (the supplied PDF).<br>
> **Topic:** 7.7 Link-Based vs. Array-Based Sequences; Advantages of Array-Based Sequences; Advantages of Link-Based Sequences.<br>
> **Domain Focus:** Choosing a sequence representation for the same rectangular cards by comparing lookup, editing, appending, and storage costs.<br>
> **User Prompt:** Reexplain [`Section 7.7`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: One Card Order, Two Representations](#background)
   - [1. Keep the same rectangles and area total](#background-cards)
   - [2. Ask what work an operation requires](#background-work)
2. [Part 1: 7.7 Link-Based vs. Array-Based Sequences](#part-1)
   - [1. Compare operations on the same logical sequence](#part-1-sequence)
   - [2. Separate a known location from a search](#part-1-location)
3. [Part 2: Advantages of Array-Based Sequences](#part-2)
   - [1. Read any index directly](#part-2-index)
   - [2. Account for constant factors](#part-2-constants)
   - [3. Count reference storage carefully](#part-2-memory)
4. [Part 3: Advantages of Link-Based Sequences](#part-3)
   - [1. Distinguish worst-case and amortized time](#part-3-bounds)
   - [2. Edit quickly at a known position](#part-3-edit)
   - [3. Choose according to the work being done](#part-3-choice)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Check the trace](#part-4-result)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Card Order, Two Representations

<span id="background-cards"></span>

### 1. Keep the same rectangles and area total

The [Section 7.5 guide](07-05-sorting-a-positional-list.md) left four physical rectangle cards in increasing area order: `[D, A, B, C]`. We can store that **same logical sequence** in a Python list backed by a dynamic array, or in a doubly linked positional list.

| Card | Width | Height | Individual area |
| :--- | ----: | -----: | --------------: |
| `D` | 2 cm | 2 cm | 4 cm² |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The four-card individual-area sum is **4 + 6 + 8 + 16 = 34 cm²**. Each representation gives the same card order and area arithmetic. Section 7.7 compares the **work needed to access or change that order**, not different geometry formulas.

<span id="background-work"></span>

### 2. Ask what work an operation requires

An array stores references in numbered slots. A linked list stores each reference in a node, with links to neighboring nodes:

```text
Array slots:     0:D   1:A   2:B   3:C

Linked nodes:    D ↔ A ↔ B ↔ C
```

To read slot 2, an array computes its address directly. To reach the third linked node from the front, we follow two links. To insert near a known node, linked neighbors can be rewired; an array may have to shift later references to open a slot.

> **Mental model:** The important question is whether the next task names an **integer index**, a **known node position**, or only a **card label that must first be found**.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 7.7 Link-Based vs. Array-Based Sequences

Section 7.7 closes the chapter by comparing the strengths of array-based and link-based sequences. It has two unnumbered headings, one for each set of advantages. It does not introduce a new data structure or a code fragment. We will use `n` for the number of stored cards and `k` for a zero-based index.

<span id="part-1-sequence"></span>

### 1. Compare operations on the same logical sequence

Both representations can hold `[D, A, B, C]` and answer “what is the total area?” with **34 cm²**. Calculating the total still requires looking at all four cards in either representation; for `n` cards, that scan is O(n). The representation matters more when the task asks for **one card at a chosen index** or **an edit at a chosen place**.

The earlier [Section 5.4 guide](../05-array-based-sequences/05-04-efficiency-of-python-sequence-types.md) explains why Python list insertion and deletion may shift references. The [Section 7.4 guide](07-04-the-positional-list-adt.md) explains how a linked `Position` identifies a node even when other nodes are inserted before it.

<span id="part-1-location"></span>

### 2. Separate a known location from a search

Suppose a student asks for card `B` by its label. Neither a plain array nor a plain linked list has a direct label-to-location map: finding `B` may take O(n) comparisons. If we already know `B` is at **index 2**, an array reads `array_cards[2]` in O(1). If we already saved a linked **position for B**, reading that position and editing beside it take O(1).

Those two “already know” conditions are different. A linked list does **not** make arbitrary label search or arbitrary index lookup constant time. In the [Section 7.6 favorites example](07-06-case-study-maintaining-access-frequencies.md), searching for a card label still scans the linked list even though a move at a known position changes links locally.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Advantages of Array-Based Sequences

<span id="part-2-index"></span>

### 1. Read any index directly

The book's first array advantage is **O(1) access by integer index**. In our sequence, index `2` contains `B` with area **8 cm²**. The array accesses that slot directly regardless of how many cards precede it.

From the front of a singly or doubly linked list, reaching zero-based index `k` takes `k` link hops and **O(k + 1)** total time, including the first-node access when `k = 0`. A doubly linked list may instead walk backward from its end in O(n − k) time. For `[D, A, B, C]`, reaching `B` takes **two steps from D** or **one step backward from C**. A previously saved position for `B` is a different situation: it lets us read `B` directly.

<span id="part-2-constants"></span>

### 2. Account for constant factors

Two operations can both be O(1) and still do different amounts of work. Section 7.7 compares adding an element to an array-based queue with adding one to a linked queue, **setting aside array resizing**. An array queue calculates a slot, updates a size, and stores a reference. A linked queue also creates a new node and connects it to its neighbors.

For a queue of card labels, enqueueing `E` would preserve the same logical queue order in either implementation. The book's point is that an array implementation is **typically faster by a constant factor** for comparable operations. Big-O alone does not say how many instructions or allocations one particular operation performs; it also does not guarantee a fixed timing result on every Python runtime.

<span id="part-2-memory"></span>

### 3. Count reference storage carefully

Both approaches can store references to the **same element objects**; in our program, those elements are card labels. The difference is extra storage for slots or links. The book gives an illustrative reference count for `n` items:

| Representation | Illustrative reference storage | For `n = 4` |
| :------------- | -----------------------------: | ----------: |
| Recently resized dynamic array | Up to about `2n` allocated reference slots | 8 slots |
| Singly linked nodes | `n` element + `n` next references = `2n` | 8 references |
| Doubly linked nodes | `n` element + `n` previous + `n` next references = `3n` | 12 references |

The array may have unused capacity, yet a linked node must hold its link fields. These figures are **not measured Python bytes**: they leave out the card objects, node and container overhead, and any sentinel nodes. Both structures use O(n) storage overall. The 34 cm² card-area sum measures geometry, not computer memory.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Advantages of Link-Based Sequences

<span id="part-3-bounds"></span>

### 1. Distinguish worst-case and amortized time

A dynamic array may occasionally need to grow or shrink its allocated storage, copying many references in **one operation**. Appending is therefore typically **amortized O(1)**: across a long series of appends, the average cost per append stays constant, while an individual resize can cost O(n). The [Section 5.3 guide](../05-array-based-sequences/05-03-dynamic-arrays-and-amortization.md) develops this accounting.

A linked queue or list with a known tail can attach one new node by changing a fixed number of links. Its local append has an **O(1) worst-case structural bound**. The book notes why this distinction can matter when one operation's response time must be predictable. It does **not** mean every linked-list task is O(1): finding an unknown card can still require a scan.

<span id="part-3-edit"></span>

### 2. Edit quickly at a known position

Let `E` be a new **3 cm × 3 cm** card with area **9 cm²**. Insert it after `B`:

```text
Before: D(4) → A(6) → B(8) → C(16)          total 34 cm²
After:  D(4) → A(6) → B(8) → E(9) → C(16)    total 43 cm²
```

If we already hold `B`'s linked `Position`, inserting `E` after it changes a fixed number of links: **O(1)**. In an array, `C` must move one slot right to make room. Deleting `B` next makes `E` and `C` shift left in the array, while the linked list changes neighboring links in O(1) using the saved `B` position. The resulting area is **43 − 8 = 35 cm²**.

In general, Python list `insert(k, e)` or `pop(k)` takes **O(n − k + 1)** in the book's comparison because later references shift; this bound sets aside resizing. At the end, with no resizing, insertion or deletion is O(1). For the linked edit, **finding the position first may cost O(n)**; the O(1) claim applies once the position is available. This is the same condition as the book's text-editor cursor example.

<span id="part-3-choice"></span>

### 3. Choose according to the work being done

| Task with `n` cards | Array-based sequence | Doubly linked positional list |
| :------------------ | :------------------- | :---------------------------- |
| Read index `k` | O(1) | O(k + 1) from front, or O(n − k) from end |
| Find a label without a location map | O(n) scan | O(n) scan |
| Insert or delete at a known interior location | O(n − k + 1) for shifting | O(1) with a valid `Position` |
| Append at a known end | Amortized O(1); resize may be O(n) | O(1) worst-case structural work |
| Extra representation storage | Slots, sometimes unused | Nodes and link fields |

The table describes the **sequence operations**, not area calculations or a guarantee about measured wall-clock speed. A workload dominated by indexed reads favors arrays; frequent edits at saved positions favor a positional list. If every edit starts by searching for a label, include that search cost before choosing.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

Section 7.7 has no code fragment, so this **teaching program** builds a small positional list beside a Python list. It reports **logical link hops and array tail shifts**, not CPU timings. The tail-shift counts ignore possible dynamic-array resizing, as in the book's edit comparison.

```python
class PositionalList:
    class _Node:
        __slots__ = ("_element", "_prev", "_next")

        def __init__(self, element, prev_node=None, next_node=None):
            self._element = element
            self._prev = prev_node
            self._next = next_node

    class Position:
        def __init__(self, container, node):
            self._container = container
            self._node = node

        def element(self):
            return self._node._element

    def __init__(self):
        self._header = self._Node(None)
        self._trailer = self._Node(None)
        self._header._next = self._trailer
        self._trailer._prev = self._header
        self._size = 0

    def __len__(self):
        return self._size

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

    def after(self, p):
        node = self._validate(p)
        return self._make_position(node._next)

    def _insert_between(self, element, predecessor, successor):
        newest = self._Node(element, predecessor, successor)
        predecessor._next = newest
        successor._prev = newest
        self._size += 1
        return self._make_position(newest)

    def add_last(self, element):
        return self._insert_between(element, self._trailer._prev, self._trailer)

    def add_after(self, p, element):
        node = self._validate(p)
        return self._insert_between(element, node, node._next)

    def delete(self, p):
        node = self._validate(p)
        node._prev._next = node._next
        node._next._prev = node._prev
        self._size -= 1
        answer = node._element
        node._element = node._prev = node._next = None
        return answer

    def __iter__(self):
        walk = self.first()
        while walk is not None:
            yield walk.element()
            walk = self.after(walk)


CARD_SIZES = {
    "D": (2, 2), "A": (2, 3), "B": (4, 2),
    "C": (4, 4), "E": (3, 3),
}


def area_of(label):
    width, height = CARD_SIZES[label]
    return width * height


def total_area(labels):
    return sum(area_of(label) for label in labels)


def linked_at_from_front(cards, index):
    if not 0 <= index < len(cards):
        raise IndexError("card index out of range")
    position = cards.first()
    hops = 0
    for _ in range(index):
        position = cards.after(position)
        hops += 1
    return position.element(), hops


array_cards = ["D", "A", "B", "C"]
linked_cards = PositionalList()
for label in array_cards:
    position = linked_cards.add_last(label)
    if label == "B":
        saved_B = position

print("Start: {} and {}, area {} cm^2".format(
    array_cards, list(linked_cards), total_area(array_cards)
))
linked_label, hops = linked_at_from_front(linked_cards, 2)
print("Index 2: array {}; linked {} after {} hops; saved position {}".format(
    array_cards[2], linked_label, hops, saved_B.element()
))

insert_index = 3
insert_shifts = len(array_cards) - insert_index
array_cards.insert(insert_index, "E")
linked_cards.add_after(saved_B, "E")
assert array_cards == list(linked_cards)
print("Insert E: {}, area {} cm^2, array tail shifts {}".format(
    array_cards, total_area(array_cards), insert_shifts
))

delete_index = 2
delete_shifts = len(array_cards) - delete_index - 1
removed_array = array_cards.pop(delete_index)
removed_linked = linked_cards.delete(saved_B)
assert removed_array == removed_linked == "B"
assert array_cards == list(linked_cards)
print("Delete B: {}, area {} cm^2, array tail shifts {}".format(
    array_cards, total_area(array_cards), delete_shifts
))
try:
    linked_cards.after(saved_B)
except ValueError:
    print("Saved B position is invalid after deletion")

# Return the same physical B card at the end of each display.
array_cards.append("B")
linked_cards.add_last("B")
assert array_cards == list(linked_cards)
print("Append B: {}, area {} cm^2".format(
    array_cards, total_area(array_cards)
))
```

<span id="part-4-result"></span>

### 2. Check the trace

```text
Start: ['D', 'A', 'B', 'C'] and ['D', 'A', 'B', 'C'], area 34 cm^2
Index 2: array B; linked B after 2 hops; saved position B
Insert E: ['D', 'A', 'B', 'E', 'C'], area 43 cm^2, array tail shifts 1
Delete B: ['D', 'A', 'E', 'C'], area 35 cm^2, array tail shifts 2
Saved B position is invalid after deletion
Append B: ['D', 'A', 'E', 'C', 'B'], area 43 cm^2
```

The array and linked display contain the same labels after each edit. The small shift counts illustrate why the general array cost grows with the number of later elements. They are **not a timing benchmark**; for a longer list, the same middle edit could shift many more references. The saved linked position stops being valid when its node is deleted. The final append deliberately leaves the cards **out of area order**: `C(16)` now comes before `B(8)`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How do we read the third card?</strong></summary>

**Scenario:** The area-ordered display is `[D, A, B, C]`. The third card is at zero-based index `2`.

**Array:** Read slot `2` directly to get `B`, then calculate **4 × 2 = 8 cm²**. The indexed read is O(1).

**Linked list:** Starting at `D`, follow links to `A` and then `B`: two hops. For general zero-based index `k`, this takes `k` hops and O(k + 1) total time from the front; a doubly linked list can sometimes start nearer the end. A saved `B` position also gives direct access.

</details>

<details>
<summary><strong>Case Study 2: What happens when E is inserted after B?</strong></summary>

**Scenario:** Add a new 3 cm × 3 cm card `E` after `B`. The display becomes `[D, A, B, E, C]` and its area sum becomes **34 + 9 = 43 cm²**.

**Array:** `insert(3, "E")` shifts `C` one slot right; in a longer list, all later references may move.

**Linked list:** `add_after(saved_B, "E")` changes local links in O(1), because `saved_B` was kept when the list was built. Searching for `B` by label first would add O(n) work.

</details>

<details>
<summary><strong>Case Study 3: What happens when B is deleted?</strong></summary>

**Scenario:** Delete `B` from `[D, A, B, E, C]`. The area sum becomes **43 − 8 = 35 cm²**.

**Array:** `pop(2)` shifts the later `E` and `C` references left: two tail shifts, ignoring any resize.

**Linked list:** `delete(saved_B)` rewires neighbors in O(1). The old `saved_B` position is invalid afterward; a new search would be needed if `B` were inserted elsewhere later.

</details>

<details>
<summary><strong>Case Study 4: What if B returns at the end?</strong></summary>

**Scenario:** Put the same physical `B` card back after `C`, producing `[D, A, E, C, B]`. The area sum returns to **35 + 8 = 43 cm²**.

**Array:** `append("B")` is amortized O(1), but a resize may make one append O(n).

**Linked list:** With a known tail, `add_last("B")` changes a fixed number of links in O(1) worst-case structural work.

</details>

<details>
<summary><strong>Case Study 5: Do two O(1) queue operations take identical work?</strong></summary>

**Scenario:** A queue stores card labels waiting for area measurement. Add `E` to its rear.

**Array queue:** With room already allocated, it calculates the next slot, stores a reference, and updates its size.

**Linked queue:** It allocates a node, stores the reference, connects the node at the rear, and updates its size.

**Result:** Both are O(1) without resizing, but the linked version typically has a larger constant cost. Big-O does not claim identical elapsed time.

</details>

<details>
<summary><strong>Case Study 6: Is card area the same as storage size?</strong></summary>

**Scenario:** Store the same four reference cards in either representation. Their individual-area sum is **34 cm²** in both.

**Array:** In the book's illustrative recently resized case, space may be allocated for **8 reference slots** even though only 4 are used.

**Linked list:** Four singly linked nodes need **8 reference fields** for elements and next links; four doubly linked nodes need **12** for elements and both directions, before object headers and sentinels.

**Result:** The representations have O(n) storage, but the reference overhead differs. A card's square centimetres do not measure computer memory.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Question | Array-based answer | Link-based answer |
| :------- | :----------------- | :---------------- |
| **Read card at index k** | Direct O(1) indexed access. | Traverse O(k + 1) from the front, or O(n − k) from a doubly linked tail. |
| **Edit at a known interior location** | Shift later references: O(n − k + 1). | Rewire links: O(1) with a valid `Position`. |
| **Append at a known end** | Amortized O(1), with occasional O(n) resize. | O(1) worst-case local link work. |
| **Store n references** | O(n) slots, possibly with unused capacity. | O(n) nodes and link fields. |
| **Choose for the card display** | Useful when students request cards by index. | Useful when edits happen at saved positions. |

For our connected display, both representations produce the same sequence and area totals: **34 cm²** initially, **43 cm²** after inserting `E`, **35 cm²** after removing `B`, and **43 cm²** when `B` returns. The better representation depends on how the program locates cards and which operations it repeats.

[🔝 Back to Top](#top)
