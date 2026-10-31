<span id="top"></span>

# 7.5 Sorting a Positional List — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.5, printed page 285 (the supplied PDF).<br>
> **Topic:** 7.5 Sorting a Positional List; insertion sort with a marker, pivot, and backward walk (Figure 7.15 and Code Fragment 7.17).<br>
> **Domain Focus:** Sorting the same rectangular cards by their individual areas while preserving the total area.<br>
> **User Prompt:** Reexplain [`Section 7.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: An Unsorted Card Display](#background)
   - [1. Keep the rectangle measurements](#background-cards)
   - [2. Grow a sorted part from the front](#background-sorted)
2. [Part 1: 7.5 Sorting a Positional List](#part-1)
   - [1. Name the marker, pivot, and walk](#part-1-names)
   - [2. Choose whether to advance or move the pivot](#part-1-steps)
   - [3. Trace the four cards](#part-1-trace)
3. [Part 2: Why the Sort Works and What It Costs](#part-2)
   - [1. Keep the sorted-prefix invariant](#part-2-invariant)
   - [2. Understand positions during a move](#part-2-positions)
   - [3. Count best and worst cases](#part-2-cost)
   - [4. Check equal-area cards carefully](#part-2-equal)
4. [Part 3: One Connected Geometry Program](#part-3)
   - [1. The complete program](#part-3-program)
   - [2. Check the result and equal-area case](#part-3-result)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: An Unsorted Card Display

<span id="background-cards"></span>

### 1. Keep the rectangle measurements

The [Section 7.4 guide](07-04-the-positional-list-adt.md) used positions to arrange rectangle cards. We keep the same physical `A`–`D` cards, but begin with them **out of area order**:

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

The display starts `[B, D, C, A]`, with areas `[8, 4, 16, 6]` cm². The cards' **individual-area sum** is always **8 + 4 + 16 + 6 = 34 cm²**. Sorting changes their order, not their dimensions or the number of physical cards. This sum does not assert that the cards form one gap-free shape.

<span id="background-sorted"></span>

### 2. Grow a sorted part from the front

The [array-based insertion sort in Section 5.5.2](../05-array-based-sequences/05-05-using-array-based-sequences.md) grows an ordered part of a sequence. Section 7.5 applies the same idea to a **positional list**. At any moment, the cards up to a chosen `marker` are sorted by area; the next card is tested and placed where it belongs in that part.

```text
Start:   [ B(8) | D(4), C(16), A(6) ]
           sorted    not processed yet

Finish:  [ D(4), A(6), B(8), C(16) ]
```

The divider is a teaching aid, not a stored list element. The positional list stores labels and links; a separate dimension table supplies the areas used in comparisons.

> **Mental model:** Treat the front part as already sorted. Take the next card and either extend that part or insert the card into its correct place within it.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 7.5 Sorting a Positional List

Section 7.5 presents insertion sort on the [positional-list ADT](07-04-the-positional-list-adt.md). Its Figure 7.15 shows a shaded sorted prefix, a following pivot value, and a backward search for the pivot's new place. Code Fragment 7.17 uses the same three roles in the algorithm.

<span id="part-1-names"></span>

### 1. Name the marker, pivot, and walk

| Name | Meaning | First moment for `[B, D, C, A]` |
| :--- | :------ | :-------------------------------- |
| `marker` | Position of the **last card in the sorted prefix**. | Position holding `B` (8 cm²). |
| `pivot` | Position immediately **after** `marker`; this card is next to process. | Position holding `D` (4 cm²). |
| `walk` | A position that moves **left through the sorted prefix** to find an insertion place. | Starts at `B` when `D` must move. |

These are positions, not integer indices. `L.after(marker)` obtains the pivot even when previous insertions have shifted numeric ranks. `L.before(walk)` takes one backward step in the doubly linked structure.

<span id="part-1-steps"></span>

### 2. Choose whether to advance or move the pivot

For a list with more than one element, the book starts `marker` at `L.first()` and repeats until it reaches `L.last()`:

1. Set `pivot = L.after(marker)` and save its element as `value`.
2. If `value` is **strictly greater** than the marker's element, the pivot already belongs after the sorted prefix. Set `marker = pivot`.
3. Otherwise, start `walk` at the marker. Move `walk` left while its predecessor is **strictly greater** than `value`.
4. Delete the pivot position, then insert its saved value **before** `walk`. Keep `marker` at its current node.

The printed algorithm compares elements directly. In our geometry version, “greater” means **larger area**, so each comparison uses `area_of(label)`. We keep the book's **strict `>`** comparisons. The positional-list `delete` and `add_before` operations adjust neighboring links; they do not shift a whole array of references.

<span id="part-1-trace"></span>

### 3. Trace the four cards

Each row continues from the previous one. The shaded idea in Figure 7.15 becomes the **sorted prefix** column here. The area total remains 34 cm² after each completed move.

| Pass | Pivot | Decision or backward search | List afterward | Sorted prefix afterward | Total area |
| ---: | :---- | :-------------------------- | :------------- | :---------------------- | ---------: |
| Start | — | Marker is `B(8)`. | `[B, D, C, A]` | `[B]` | 34 cm² |
| 1 | `D(4)` | 4 < 8; insert `D` before `B`. | `[D, B, C, A]` | `[D, B]`, marker `B` | 34 cm² |
| 2 | `C(16)` | 16 > 8; advance marker to `C`. | `[D, B, C, A]` | `[D, B, C]` | 34 cm² |
| 3 | `A(6)` | 6 < 16; walk from `C` to `B(8)`, then insert before `B`. | `[D, A, B, C]` | `[D, A, B, C]`, marker `C` | 34 cm² |

On pass 3, `L.before(C)` is `B`, whose area 8 is greater than 6, so `walk` moves to `B`. The node before `B` is `D`, whose area 4 is **not** greater than 6. Inserting `A` before `B` therefore puts **4, 6, 8, 16** in ascending order.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Why the Sort Works and What It Costs

<span id="part-2-invariant"></span>

### 1. Keep the sorted-prefix invariant

An **invariant** is a fact that remains true through every pass. Here, every card from the front through `marker` is in nondecreasing area order.

- Initially, the prefix contains just `B`; one card is sorted.
- If the pivot area exceeds the marker area, the pivot is no smaller than any earlier prefix card. Advancing `marker` extends the sorted prefix by one.
- Otherwise, `walk` moves left past predecessors with areas strictly greater than the pivot's. It stops at the front or just after a predecessor whose area is no greater. Inserting the pivot before `walk` keeps the enlarged prefix sorted; `marker` still names its last node.

Each pass incorporates one previously unprocessed card. When `marker == L.last()`, the prefix is the whole list, so sorting is finished. The source's Figure 7.15 uses the same idea: place the next value into the already sorted section.

<span id="part-2-positions"></span>

### 2. Understand positions during a move

In the move branch, `L.delete(pivot)` removes its node and **invalidates that old pivot position**. `L.add_before(walk, value)` makes a **new node and position** for the same saved element. A caller who had kept the old pivot position cannot use it afterward. `marker` and `walk` still name nodes that were not deleted.

For our cards, pass 1 removes `D`'s old node and reinserts the `D` label before `B`. It is still the **same physical card** in the geometry activity: no area is added or lost after the move completes. The list briefly has one fewer node between the two operations, but the final sorted list contains the same four labels.

<span id="part-2-cost"></span>

### 3. Count best and worst cases

With a known position, each `before`, `after`, `delete`, and `add_before` operation takes **O(1)** time in the [doubly linked positional list](07-04-the-positional-list-adt.md). The backward walk can visit many earlier positions, so it determines the overall cost.

| Input condition | What happens | Time for *n* cards |
| :-------------- | :----------- | -----------------: |
| Already increasing by area | Every pivot extends the prefix without a backward walk. | **Θ(n)** |
| Decreasing by area | Each new pivot moves toward the front through the growing prefix. | **Θ(n²)** |

In the decreasing case, the backward steps across all passes can total **0 + 1 + ⋯ + (n − 2) = (n − 1)(n − 2)/2**. There are also *n − 1* initial pivot comparisons. The algorithm holds only a fixed number of positions and one saved value at a time, so its **extra working space is O(1)** beyond the list. These bounds are derived from the loops in Code Fragment 7.17; Section 7.5 does not state them explicitly.

<span id="part-2-equal"></span>

### 4. Check equal-area cards carefully

The book's first comparison is **`>`**, not `>=`. If the pivot has the **same area** as the marker, it enters the move branch. With just two equal-area cards `[B, F]`, the pivot `F` is deleted and reinserted before marker `B`, giving `[F, B]`. The printed positional-list algorithm is therefore **not stable**: equal keys can change relative order.

For a concrete geometry tie, `B` is 4 cm × 2 cm and has area **8 cm²**; let new physical card `F` be 1 cm × 8 cm, also **8 cm²**. They have different shapes even though the sort key is equal. The [array-based insertion sort guide](../05-array-based-sequences/05-05-using-array-based-sequences.md) shifts only strictly larger preceding values and keeps an equal pair in order. To make this positional version stable, use `>=` in the **first** comparison while keeping the backward-walk comparison strict; the complete program below preserves the book's printed `>` behavior.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: One Connected Geometry Program

<span id="part-3-program"></span>

### 1. The complete program

This standalone program includes the positional-list methods needed by the sort. The [Section 7.4 guide](07-04-the-positional-list-adt.md) gives the full ADT. The sorting function follows Code Fragment 7.17's control flow, but compares `area_of(label)` because our list stores card labels rather than numbers.

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


CARD_SIZES = {
    "A": (2, 3), "B": (4, 2), "C": (4, 4),
    "D": (2, 2), "F": (1, 8),
}


def area_of(label):
    width, height = CARD_SIZES[label]
    return width * height


def insertion_sort_by_area(cards):
    if len(cards) > 1:
        marker = cards.first()
        while marker != cards.last():
            pivot = cards.after(marker)
            value = pivot.element()
            if area_of(value) > area_of(marker.element()):
                marker = pivot
            else:
                walk = marker
                while (walk != cards.first() and
                       area_of(cards.before(walk).element()) > area_of(value)):
                    walk = cards.before(walk)
                cards.delete(pivot)
                cards.add_before(walk, value)


cards = PositionalList()
cards.add_last("B")
old_D = cards.add_last("D")
saved_C = cards.add_last("C")
cards.add_last("A")
print("Before: {} (areas {}), total {} cm^2".format(
    list(cards), [area_of(label) for label in cards],
    sum(area_of(label) for label in cards)
))

insertion_sort_by_area(cards)
print("After: {} (areas {}), total {} cm^2".format(
    list(cards), [area_of(label) for label in cards],
    sum(area_of(label) for label in cards)
))
print("Saved C position still contains: {}".format(saved_C.element()))
try:
    cards.after(old_D)
except ValueError:
    print("Old D position is invalid after the move")

equal_cards = PositionalList()
equal_cards.add_last("B")
equal_cards.add_last("F")
print("Equal-area order before: {}".format(list(equal_cards)))
insertion_sort_by_area(equal_cards)
print("Equal-area order after: {}".format(list(equal_cards)))
```

`F` appears only in the small equal-area check; it is a different 1 cm × 8 cm card with the same area as `B`. The main sort uses the original four cards. `old_D` becomes invalid when the algorithm deletes `D`'s old node, while `saved_C` stays valid because `C` is not deleted.

<span id="part-3-result"></span>

### 2. Check the result and equal-area case

```text
Before: ['B', 'D', 'C', 'A'] (areas [8, 4, 16, 6]), total 34 cm^2
After: ['D', 'A', 'B', 'C'] (areas [4, 6, 8, 16]), total 34 cm^2
Saved C position still contains: C
Old D position is invalid after the move
Equal-area order before: ['B', 'F']
Equal-area order after: ['F', 'B']
```

The final area order is **4 ≤ 6 ≤ 8 ≤ 16**, and the total remains **34 cm²**. The equal-area pair shows the printed algorithm's lack of stability; both `B` and `F` still have area **8 cm²** after their order flips.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What if the cards already increase by area?</strong></summary>

**Scenario:** The cards are `[D, A, B, C]`, with areas `[4, 6, 8, 16]` cm².

**Algorithm:** Every pivot is larger than the marker. The marker advances three times, and no card is deleted or reinserted.

**Result:** The order remains `[D, A, B, C]`; the individual-area sum stays **4 + 6 + 8 + 16 = 34 cm²**. For *n* already increasing cards, the work grows as **Θ(n)**.

</details>

<details>
<summary><strong>Case Study 2: What if the cards decrease by area?</strong></summary>

**Scenario:** The cards start `[C, B, A, D]`, with areas `[16, 8, 6, 4]` cm².

**Algorithm:** Each new pivot belongs ahead of the sorted prefix. The leftward search passes more earlier cards as that prefix grows.

**Result:** The cards finish `[D, A, B, C]`, still totaling **34 cm²**. For *n* cards in decreasing order, the accumulated backward work is quadratic: **Θ(n²)**.

</details>

<details>
<summary><strong>Case Study 3: Do two equal-area rectangles keep their order?</strong></summary>

**Scenario:** `B` is 4 cm × 2 cm and `F` is 1 cm × 8 cm. Both have area **8 cm²**, so `[B, F]` is already sorted by area.

**Algorithm:** The source's strict `>` test treats `F` as a pivot to move when it equals `B`. It deletes `F` and inserts it before `B`.

**Result:** The list becomes `[F, B]`, with the same **16 cm²** individual-area sum. The sort is **not stable**. Using `>=` for the first comparison would keep this equal pair in its original order.

</details>

<details>
<summary><strong>Case Study 4: Why can a saved position fail after sorting?</strong></summary>

**Scenario:** We saved `old_D` before sorting `[B, D, C, A]`.

**Algorithm:** Pass 1 deletes the node wrapped by `old_D` and creates a new `D` node before `B`. The card label and its area survive, but the old node does not.

**Result:** `cards.after(old_D)` raises `ValueError`. A saved position for `C` remains valid because the algorithm merely advances the marker to `C`; it never deletes that node.

</details>

<details>
<summary><strong>Case Study 5: What about zero or one card?</strong></summary>

**Scenario:** The display is empty, or it contains only `A` with area **6 cm²**.

**Algorithm:** The initial `if len(cards) > 1:` guard skips the sorting loop.

**Result:** The empty display remains empty with area **0 cm²**; `[A]` remains `[A]` with area **6 cm²**. No pivot or backward walk is needed.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 7.5 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Sorted prefix** | Cards through `marker` are already in area order. | Begin with `[B]`; finish with `[D, A, B, C]`. |
| **Pivot** | The first unprocessed card follows the marker. | First pivot is `D(4)` after `B(8)`. |
| **Backward walk** | Step left through known positions to find the insertion place. | Move `A(6)` past `B(8)` but not `D(4)`. |
| **Local move** | Delete the old pivot node and insert its saved value before `walk`. | `D` moves before `B`; total area stays 34 cm². |
| **Position validity** | A moved pivot's old position is invalid; untouched nodes keep their positions. | `old_D` fails, while `saved_C` still contains `C`. |
| **Time cost** | Already increasing input is Θ(n); decreasing input is Θ(n²). | More leftward steps are needed when smaller cards arrive late. |
| **Equal keys** | The book's strict `>` can reorder equal-area elements. | `[B, F]` becomes `[F, B]`, though both are 8 cm². |
| **Area conservation** | Sorting changes order, not the set of physical cards. | The main four cards total 34 cm² before and after. |

The positional-list operations determine **where each card goes**. The rectangle formula supplies the **area key** used for comparisons; the cards' individual-area sum remains the same after sorting.

[🔝 Back to Top](#top)
