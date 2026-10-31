<span id="top"></span>

# 7.6 Case Study: Maintaining Access Frequencies — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.6, printed pages 286–291 (the supplied PDF).<br>
> **Topic:** 7.6 Case Study: Maintaining Access Frequencies; 7.6.1 Using a Sorted List; 7.6.2 Using a List with the Move-to-Front Heuristic.<br>
> **Domain Focus:** Tracking how often students consult the same rectangular cards, while keeping card area separate from access frequency.<br>
> **User Prompt:** Reexplain [`Section 7.6`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: Revisit the Rectangle Cards](#background)
   - [1. Area describes a card; frequency describes its use](#background-cards)
   - [2. Give each card a count](#background-counts)
2. [Part 1: 7.6 Maintaining Access Frequencies](#part-1)
   - [1. Define the favorites-list operations](#part-1-adt)
   - [2. Understand what top means](#part-1-top)
3. [Part 2: 7.6.1 Using a Sorted List](#part-2)
   - [1. Keep each value and count together](#part-2-composition)
   - [2. Restore frequency order after an access](#part-2-update)
   - [3. Read the costs and ties](#part-2-cost)
4. [Part 3: 7.6.2 Using a List with the Move-to-Front Heuristic](#part-3)
   - [1. Put the most recent access at the front](#part-3-move)
   - [2. Recover the true top k](#part-3-top)
   - [3. Compare the two orders and their costs](#part-3-compare)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Check the trace and results](#part-4-result)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Revisit the Rectangle Cards

<span id="background-cards"></span>

### 1. Area describes a card; frequency describes its use

The [Section 7.5 guide](07-05-sorting-a-positional-list.md) ended with four cards ordered by **area** as `[D, A, B, C]`. Section 7.6 asks a different question: **Which card's measurements are consulted most often?** We keep the same four reference cards:

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

One copy of each card has an individual-area sum of **6 + 8 + 16 + 4 = 34 cm²**. That total does not say how often anyone looks up a card. A small card can be popular, and a large card can be rarely consulted.

<span id="background-counts"></span>

### 2. Give each card a count

Suppose students request card measurements in this order:

```text
A → A → A → B → C → B → D
```

An **access** means one lookup of a card's measurements. It does not create another physical reference card. The request counts are **A: 3**, **B: 2**, **C: 1**, and **D: 1**, for **7 accesses** in all. If we add the area *referenced by each lookup*, we get **3 × 6 + 2 × 8 + 1 × 16 + 1 × 4 = 54 cm²** of cumulative referenced area. That is a workload sum, not the area occupied by the four physical cards.

The favorites list begins **empty**. It gains a record for a label when that label is first accessed. Each record needs both a card label and its count:

```text
(card label, number of accesses)
       A, 3        B, 2        C, 1        D, 1
```

> **Mental model:** Area is a property of the rectangle. Frequency is a count of requests for that rectangle. A favorites list reorders records to make some future operations easier.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 7.6 Maintaining Access Frequencies

Section 7.6 uses a **favorites list ADT** to keep elements and their access counts. The book gives web pages and songs as examples; our elements are geometry card labels. A positional list supplies the underlying order, as introduced in the [Section 7.4 guide](07-04-the-positional-list-adt.md).

<span id="part-1-adt"></span>

### 1. Define the favorites-list operations

| Operation | Meaning for card labels | Example |
| :-------- | :---------------------- | :------ |
| `access(e)` | Add `e` with count 1 if new, or increase its count by 1. | Three calls for `A` give count 3. |
| `remove(e)` | Delete `e`'s record if present. | Removing `C` removes its count too. |
| `top(k)` | Iterate over the `k` labels with the largest counts. | After all seven requests, `top(2)` gives `A` and `B`. |
| `len(favorites)` / `is_empty()` | Count distinct stored labels / check whether there are none. | Seven requests create four records. |

`remove(e)` does nothing when `e` is absent. If a removed label is accessed later, it starts a **new** record at count 1. The book's code accepts `top(k)` only when **1 ≤ k ≤ the number of stored labels**; `k = 0` is not accepted.

<span id="part-1-top"></span>

### 2. Understand what top means

`top(k)` ranks **frequency**, not area or recency. After the seven lookups, `A(3)` is first even though its area is only 6 cm²; `C(1)` has the largest area, 16 cm², but is not in the top two. The values returned to a caller are card labels, not internal count records.

`C` and `D` both have count 1. The ADT asks for most accessed elements; it does not require a particular order between equal counts. The two concrete implementations below can therefore return either label first when a requested `k` cuts through that tie.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 7.6.1 Using a Sorted List

The first implementation stores records in **nonincreasing frequency order**: larger counts are earlier. This is a new sort key. The area-sorted order `[D, A, B, C]` from Section 7.5 does not determine the favorites-list order.

<span id="part-2-composition"></span>

### 1. Keep each value and count together

Code Fragments 7.18–7.19 define a private `_Item` holding `_value` and `_count`. This is the book's **composition pattern**: each item combines a card label and its access count in one object. A `PositionalList` stores these combined item objects.

```text
FavoritesList
  └── PositionalList of _Item records
        [(_value=A, _count=3), (_value=B, _count=2), ...]
```

Keeping the count inside the same item object as its label matters when a record moves. We relocate the **same item object**, so the count travels with the label. The private record is an implementation detail; `top(k)` yields labels to the caller.

<span id="part-2-update"></span>

### 2. Restore frequency order after an access

The sorted implementation handles `access(e)` in this order:

1. `_find_position(e)` scans the positional list for the label.
2. If absent, append a new `_Item(e)` with count 0.
3. Increase that item's count by 1.
4. If the preceding count is smaller, `_move_up(position)` walks left over **strictly smaller** counts and reinserts the accessed item before the leftmost one it passed. Otherwise, the item stays in place.

For our requests, after the first five accesses the list is `[A(3), B(1), C(1)]`. The next request is `B`: its count becomes 2. It stays after `A(3)` but before `C(1)`, giving `[A(3), B(2), C(1)]`. When `D` is first accessed, it is appended at count 1; it does not jump ahead of `C(1)`.

To see an actual relocation, continue after the seven requests with **two more** accesses to `C`. The first raises `C` from 1 to 2, tying `B(2)`, so the order stays `[A(3), B(2), C(2), D(1)]`. The second raises `C` to 3 and moves it ahead of `B(2)` but not ahead of tied `A(3)`: `[A(3), C(3), B(2), D(1)]`.

This backward step resembles the [insertion sort in Section 7.5](07-05-sorting-a-positional-list.md), but it repairs the position of just the **one count that increased**. The invariant after each access is:

> From front to back, counts never increase.

<span id="part-2-cost"></span>

### 3. Read the costs and ties

`_move_up` crosses a predecessor only when the updated count is **strictly greater**. Equal-count records do not cross during that move. Our `C(1)` therefore remains before the newly appended `D(1)`. The source's implementation has this tie behavior; the favorites-list ADT itself does not promise it.

The position search may inspect every stored record. For `n` distinct labels, **`access` and `remove` are O(n) in the worst case**. An access to a record currently at rank `k` costs **O(k)** in this sorted list, as the book notes. Once sorted, `top(k)` simply visits the first `k` positions, so it takes **O(k)** time. These bounds count list operations, not the separate constant-time multiplication of two card dimensions.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 7.6.2 Using a List with the Move-to-Front Heuristic

The second implementation tries to benefit from **locality of reference**: a recently requested item may be requested again soon. It keeps counting accesses, but it orders records by their **latest access**, rather than by count.

<span id="part-3-move"></span>

### 1. Put the most recent access at the front

`FavoritesListMTF` inherits the sorted class's search, count update, and remove operations. Code Fragment 7.20 overrides `_move_up`: after any access, it moves the accessed item to the front unless it is already there. The move deletes its old position and inserts the **same item object** at a new front position.

After our sixth request, `B` is at the front because `B` was just accessed: `[B(2), C(1), A(3)]`. After the final `D` request, the move-to-front order is `[D(1), B(2), C(1), A(3)]`. `D` is the **most recent** card, while `A` remains the **most frequent** card.

<span id="part-3-top"></span>

### 2. Recover the true top k

The first `k` positions of a move-to-front list are not necessarily the most frequent. The overridden `top(k)` in Code Fragment 7.20:

1. Copies references to all item records into a temporary positional list.
2. Scans that temporary list for the highest remaining count.
3. Yields its label and deletes that **temporary position**.
4. Repeats the scan until `k` labels have been yielded.

The original favorites list and its counts stay in place. For our final move-to-front order, the first two **positions** are `[D, B]`, but `top(2)` correctly yields `[A, B]`. When counts tie, its strict `>` maximum test keeps the first tied item it encounters in the temporary list. Thus `top(3)` yields `[A, B, D]` here, while the frequency-sorted version yields `[A, B, C]`. Both third labels have count 1.

<span id="part-3-compare"></span>

### 3. Compare the two orders and their costs

Each row follows the previous row's request. The two columns contain the **same counts** but different list orders:

| Request just made | Sorted by count | Move to front |
| :---------------- | :-------------- | :------------ |
| `A` | `[A(1)]` | `[A(1)]` |
| `A` | `[A(2)]` | `[A(2)]` |
| `A` | `[A(3)]` | `[A(3)]` |
| `B` | `[A(3), B(1)]` | `[B(1), A(3)]` |
| `C` | `[A(3), B(1), C(1)]` | `[C(1), B(1), A(3)]` |
| `B` | `[A(3), B(2), C(1)]` | `[B(2), C(1), A(3)]` |
| `D` | `[A(3), B(2), C(1), D(1)]` | `[D(1), B(2), C(1), A(3)]` |

Move to front still needs a linear search to locate a distant label, so one `access` can take **O(n)**. Its `top(k)` copies `n` records and scans up to `n` records `k` times: **O(kn)** time and **O(n)** extra temporary storage. For fixed `k` this is O(n); when `k` grows proportionally with `n` it is O(n²). The frequency-sorted list spends more effort maintaining order during access but has O(k) `top(k)`.

The book gives a grouped-access example: `n` labels, each accessed `n` times before moving to the next label. The sorted version can take **O(n³)** total work, while move to front takes **O(n²)** for that pattern because repeated accesses hit the front. The book calls move to front a **heuristic**; other request patterns can make it slower.

The book also points ahead to faster `top(k)` approaches: O(n + k log n), O(n + k log k), O(n log n) by sorting a temporary collection, and a specialized O(n) sort that exploits integer counts. It identifies sorting the temporary collection as preferable to repeated scans when `k = Ω(log n)`. The program below implements the book's repeated-scan method.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

This standalone version includes the positional-list methods needed by both favorites classes. It follows the control flow of Code Fragments 7.18–7.20 and uses card labels as user values. `show_order` is a **teaching helper** that inspects private records to show the internal order; ordinary callers use `top(k)` for frequency results.

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

        def __eq__(self, other):
            return type(other) is type(self) and other._node is self._node

        def __ne__(self, other):
            return not (self == other)

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

    def last(self):
        return self._make_position(self._trailer._prev)

    def before(self, p):
        node = self._validate(p)
        return self._make_position(node._prev)

    def after(self, p):
        node = self._validate(p)
        return self._make_position(node._next)

    def _insert_between(self, element, predecessor, successor):
        newest = self._Node(element, predecessor, successor)
        predecessor._next = newest
        successor._prev = newest
        self._size += 1
        return self._make_position(newest)

    def add_first(self, element):
        return self._insert_between(element, self._header, self._header._next)

    def add_last(self, element):
        return self._insert_between(element, self._trailer._prev, self._trailer)

    def add_before(self, p, element):
        node = self._validate(p)
        return self._insert_between(element, node._prev, node)

    def delete(self, p):
        node = self._validate(p)
        node._prev._next = node._next
        node._next._prev = node._prev
        self._size -= 1
        answer = node._element
        node._element = node._prev = node._next = None
        return answer

    def __iter__(self):
        cursor = self.first()
        while cursor is not None:
            yield cursor.element()
            cursor = self.after(cursor)


class FavoritesList:
    class _Item:
        __slots__ = ("_value", "_count")

        def __init__(self, value):
            self._value = value
            self._count = 0

    def __init__(self):
        self._data = PositionalList()

    def __len__(self):
        return len(self._data)

    def is_empty(self):
        return len(self) == 0

    def _find_position(self, value):
        walk = self._data.first()
        while walk is not None and walk.element()._value != value:
            walk = self._data.after(walk)
        return walk

    def _move_up(self, p):
        if p != self._data.first():
            count = p.element()._count
            walk = self._data.before(p)
            if count > walk.element()._count:
                while (walk != self._data.first() and
                       count > self._data.before(walk).element()._count):
                    walk = self._data.before(walk)
                self._data.add_before(walk, self._data.delete(p))

    def access(self, value):
        p = self._find_position(value)
        if p is None:
            p = self._data.add_last(self._Item(value))
        p.element()._count += 1
        self._move_up(p)

    def remove(self, value):
        p = self._find_position(value)
        if p is not None:
            self._data.delete(p)

    def top(self, k):
        if not 1 <= k <= len(self):
            raise ValueError("Illegal value for k")
        walk = self._data.first()
        for _ in range(k):
            yield walk.element()._value
            walk = self._data.after(walk)


class FavoritesListMTF(FavoritesList):
    def _move_up(self, p):
        if p != self._data.first():
            self._data.add_first(self._data.delete(p))

    def top(self, k):
        if not 1 <= k <= len(self):
            raise ValueError("Illegal value for k")
        temp = PositionalList()
        for item in self._data:
            temp.add_last(item)
        for _ in range(k):
            high = temp.first()
            walk = temp.after(high)
            while walk is not None:
                if walk.element()._count > high.element()._count:
                    high = walk
                walk = temp.after(walk)
            yield high.element()._value
            temp.delete(high)


CARD_SIZES = {"A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2)}


def area_of(label):
    width, height = CARD_SIZES[label]
    return width * height


def show_order(favorites):
    # Teaching helper: inspect internal items, not part of the public ADT.
    return [(item._value, item._count) for item in favorites._data]


requests = ["A", "A", "A", "B", "C", "B", "D"]
sorted_favorites = FavoritesList()
recent_favorites = FavoritesListMTF()
referenced_area = 0
for label in requests:
    sorted_favorites.access(label)
    recent_favorites.access(label)
    referenced_area += area_of(label)
    print("{} -> sorted {}; MTF {}".format(
        label, show_order(sorted_favorites), show_order(recent_favorites)
    ))

print("One of each card: {} cm^2".format(
    sum(area_of(label) for label in CARD_SIZES)
))
print("Seven lookups reference {} cm^2 cumulatively".format(referenced_area))
print("Sorted top(2): {}".format(list(sorted_favorites.top(2))))
print("MTF top(2): {}".format(list(recent_favorites.top(2))))
print("Sorted top(3): {}".format(list(sorted_favorites.top(3))))
print("MTF top(3): {}".format(list(recent_favorites.top(3))))
print("MTF first two positions: {}".format(
    [label for label, count in show_order(recent_favorites)[:2]]
))

# A separate follow-on experiment exercises sorted-list relocation.
repair_demo = FavoritesList()
for label in requests:
    repair_demo.access(label)
repair_demo.access("C")
print("C ties B: {}".format(show_order(repair_demo)))
repair_demo.access("C")
print("C passes B: {}".format(show_order(repair_demo)))
```

<span id="part-4-result"></span>

### 2. Check the trace and results

```text
A -> sorted [('A', 1)]; MTF [('A', 1)]
A -> sorted [('A', 2)]; MTF [('A', 2)]
A -> sorted [('A', 3)]; MTF [('A', 3)]
B -> sorted [('A', 3), ('B', 1)]; MTF [('B', 1), ('A', 3)]
C -> sorted [('A', 3), ('B', 1), ('C', 1)]; MTF [('C', 1), ('B', 1), ('A', 3)]
B -> sorted [('A', 3), ('B', 2), ('C', 1)]; MTF [('B', 2), ('C', 1), ('A', 3)]
D -> sorted [('A', 3), ('B', 2), ('C', 1), ('D', 1)]; MTF [('D', 1), ('B', 2), ('C', 1), ('A', 3)]
One of each card: 34 cm^2
Seven lookups reference 54 cm^2 cumulatively
Sorted top(2): ['A', 'B']
MTF top(2): ['A', 'B']
Sorted top(3): ['A', 'B', 'C']
MTF top(3): ['A', 'B', 'D']
MTF first two positions: ['D', 'B']
C ties B: [('A', 3), ('B', 2), ('C', 2), ('D', 1)]
C passes B: [('A', 3), ('C', 3), ('B', 2), ('D', 1)]
```

The two `top(2)` answers agree because their counts agree. The different `top(3)` answers are both valid because `C` and `D` tie at count 1. The final two lines come from a **separate follow-on experiment** with two more `C` accesses. The 34 cm² sum counts each reference card once; 54 cm² counts its area once per lookup in the **original seven-request sequence**.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What happens on the first access and on a repeat?</strong></summary>

**Scenario:** Start with an empty favorites list and request `A` three times. `A` has area **2 × 3 = 6 cm²**.

**Algorithm:** The first access creates `A(1)`. The next two accesses find the same record and change its count to 2, then 3; they do not create duplicate records.

**Result:** `len(favorites) = 1` and `top(1) = [A]`. The three lookups reference **3 × 6 = 18 cm²** cumulatively, while the one physical reference card still has area **6 cm²**.

</details>

<details>
<summary><strong>Case Study 2: Can the largest card move into the top two?</strong></summary>

**Scenario:** After `A, A, A, B, C, B, D`, card `C` has area **16 cm²**, the largest of the four, but has count 1.

**Algorithm:** At first, both classes rank `top(2)` using counts **A: 3** and **B: 2**. In a separate frequency-sorted follow-on, two more `C` requests raise `C` to count 3. It first ties `B(2)` without crossing it, then moves before `B` while remaining after tied `A(3)`.

**Result:** The original seven requests give `top(2) = [A, B]`. After the two extra `C` requests, the sorted list is `[A(3), C(3), B(2), D(1)]` and `top(2) = [A, C]`. Card area and access frequency answer different questions.

</details>

<details>
<summary><strong>Case Study 3: What if two cards have equal counts?</strong></summary>

**Scenario:** `C` and `D` each have count 1 after the seven lookups.

**Algorithm:** The sorted list does not move `D` past equal-count `C`, so its `top(3)` ends in `C`. The move-to-front list is `[D, B, C, A]`; its repeated maximum scan encounters `D` before `C` when their counts tie.

**Result:** Sorted `top(3) = [A, B, C]` and move-to-front `top(3) = [A, B, D]`. Either third place is correct because both candidates have count 1.

</details>

<details>
<summary><strong>Case Study 4: What does removal do to a card's count?</strong></summary>

**Scenario:** The frequency-sorted records are `[A(3), B(2), C(1), D(1)]`. Remove `C`, then request `C` again.

**Algorithm:** `remove("C")` deletes its item; the later access creates a fresh `C(1)` at the end. Removing an unknown label makes no change.

**Result:** The sorted records become `[A(3), B(2), D(1), C(1)]`. The old count is not restored. Both `D` and `C` are still 1-access cards.

</details>

<details>
<summary><strong>Case Study 5: What if top is asked for an invalid number?</strong></summary>

**Scenario:** A new favorites list has no card records. Someone asks for `top(1)`, or asks the four-record list for `top(0)` or `top(5)`.

**Algorithm:** Both classes require **1 ≤ k ≤ len(favorites)** and raise `ValueError` otherwise. Because `top` is a Python generator, its body runs when the result is iterated; `list(favorites.top(k))` triggers the validation.

**Result:** All three requests raise `ValueError`. For the four-record list, `top(4)` is valid and returns all four labels by nonincreasing frequency.

</details>

<details>
<summary><strong>Case Study 6: When can move to front help?</strong></summary>

**Scenario:** Imagine `n` different rectangle labels, each requested `n` times in one consecutive group before the next label's group begins.

**Algorithm:** In a frequency-sorted list, the next group's label stays behind earlier groups with larger or equal counts, so repeated searches can reach rank 2, then rank 3, and so on. With move to front, only the first access to a new group searches far; the remaining requests hit the front.

**Result:** The book's grouped pattern costs **O(n³)** with frequency order and **O(n²)** with move to front. The gain depends on the request pattern, not on the rectangles' dimensions.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Idea | Meaning | Rectangle-card result |
| :--- | :------ | :-------------------- |
| **Access count** | Number of lookups for one label. | `A` is accessed 3 times; `C` once. |
| **Composed record** | Keep label and count in one private item. | Moving `B` keeps its count 2. |
| **Sorted favorites** | Keep records in nonincreasing count order. | `[A(3), B(2), C(1), D(1)]`. |
| **Move to front** | Put the most recently accessed item first. | After the final request: `[D(1), B(2), C(1), A(3)]`. |
| **True top k** | Rank counts, even when list order shows recency. | Both versions give `[A, B]` for `top(2)`. |
| **Area versus frequency** | Dimensions and lookup counts are separate data. | Four cards total 34 cm²; seven lookups reference 54 cm² cumulatively. |

The sorted representation makes `top(k)` cheap; the move-to-front representation can favor clustered repeated requests. The right choice depends on the access sequence and which operations the program performs most often.

[🔝 Back to Top](#top)
