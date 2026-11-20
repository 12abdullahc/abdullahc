<span id="top"></span>

# Linked Lists — Section 7.5: Sorting a Positional List

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 7 PDF](<../../file/Data Structures and Algorithms in Python - C07.pdf>), Section 7.5 (printed page 285).  
> **Topic:** Insertion sort using `Position` handles, a sorted prefix, and local list updates.  
> **Domain focus:** Selected result cards from the **10 October 2026 Indonesian Grand Prix MotoGP Sprint** at Mandalika.  
> **Learning goal:** Trace `marker`, `pivot`, and `walk`; explain why each pass preserves order; and run the sort on a positional list.  
> **User Prompt:** "Reexplain Section 7.5 part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of 01-01-overview.md. Use real riders and teams from a specific 2026 MotoGP session, prioritizing Marc Márquez and Fabio Quartararo."

---

## Table of Contents

1. [Background & Conceptual Intuition: Shuffled Sprint Cards](#background-intuition)
2. [Part 1: Section 7.5 — Grow a Sorted Prefix](#part-1)
   - [1. Choose the value being sorted](#part-1-key)
   - [2. Give marker, pivot, and walk different jobs](#part-1-roles)
   - [3. State the sorted-prefix rule](#part-1-invariant)
3. [Part 2: Work Through the Book's Insertion Step](#part-2)
   - [1. Read Figure 7.15](#part-2-figure)
   - [2. Keep a pivot that is already in order](#part-2-keep)
   - [3. Relocate a pivot that belongs earlier](#part-2-move)
   - [4. Explain why the step works](#part-2-correctness)
4. [Part 3: Solve the Sprint-Card Trace](#part-3)
   - [1. Trace every pass](#part-3-trace)
   - [2. Track positions and special cases](#part-3-positions)
   - [3. Count the work](#part-3-cost)
5. [Part 4: One Complete Worked Program](#part-4)
   - [1. Plan the program](#part-4-plan)
   - [2. Run the program](#part-4-program)
   - [3. Check the output](#part-4-check)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Shuffled Sprint Cards

The [official 2026 Indonesian GP Sprint classification](https://www.motogp.com/en/gp-results/2026/ina/motogp/spr/classification) and [MotoGP's 10 October report](https://www.motogp.com/en/news/2026/10/10/menangi-sprint-mandalika-marc-marquez-kembali-puncaki-klasemen-motogp/1174849) identify these riders, teams, and finishing places. Imagine that we entered five of their result cards into a practice list in the **shuffled order** shown here:

| Initial card order | Official Sprint finish | Rider | Team |
| -----------------: | :--------------------- | :---- | :--- |
| 1 | P1 | Marc Márquez | Ducati Lenovo Team |
| 2 | P9 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |
| 3 | P3 | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team |
| 4 | P8 | Francesco Bagnaia | Ducati Lenovo Team |
| 5 | P2 | Ai Ogura | SuperFile Trackhouse MotoGP Team |

The **initial card order is invented for the exercise**. The race finishes and team memberships are real. This is a selected subset, so P4–P7 are absent. Sorting these cards changes our software list only; it does not change the Sprint classification.

We want the selected cards in increasing finish-number order:

```text
Before: P1 Marc → P9 Quartararo → P3 Di Giannantonio → P8 Bagnaia → P2 Ogura
After:  P1 Marc → P2 Ogura → P3 Di Giannantonio → P8 Bagnaia → P9 Quartararo
```

Here **P9 is Fabio Quartararo's fixed race finish**, while a `Position` from the [Section 7.4 positional list](07-04-the-positional-list-adt.md) is a handle to a node in our practice list. A card's current list index can change during sorting without changing its P-label.

**Why these cards?** Marc and Fabio Quartararo are the requested focus. Placing Fabio's P9 card early and mixing P2, P3, and P8 afterward creates both an already-ordered step and several moves to the left. **How do we solve it?** Read each card's numeric finish, maintain a sorted prefix, and insert each new card where that number belongs.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 7.5 — Grow a Sorted Prefix

Section 7.5 applies the insertion-sort idea from Section 5.5.2 to a `PositionalList`. The book presents it as one continuous section, with Figure 7.15 and Code Fragment 7.17. A positional list can find a neighbor of a known position and edit beside that position in O(1) time; the algorithm still has to search for the correct insertion point.

<span id="part-1-key"></span>

### 1. Choose the Value Being Sorted

The book sorts **comparable elements** into nondecreasing order. For the Sprint cards, use a tuple whose **first item is the official numeric finish**:

```python
marc = (1, "Marc Márquez", "Ducati Lenovo Team")
fabio = (9, "Fabio Quartararo", "Monster Energy Yamaha MotoGP Team")
print(marc < fabio)  # True, because 1 < 9
```

Python compares tuples from left to right. All five finish numbers in this example are distinct, so the first item alone decides their order. A smaller finish number comes first: P1 precedes P2, and P2 precedes P9. The team and rider text travel with the number as one element.

**Why use a whole card?** Sorting bare numbers would hide which rider and team a number belongs to. **How to choose a key:** put the field that determines order first, keep each card together, and check that the values can be compared. If you instead sorted rider-name strings, you would get alphabetical order, not Sprint finish order.

<span id="part-1-roles"></span>

### 2. Give `marker`, `pivot`, and `walk` Different Jobs

The algorithm uses three **position handles**:

| Handle | What it names | First Sprint-card example |
| :----- | :------------ | :------------------------ |
| `marker` | Last node in the already sorted prefix. | Marc's P1 node at the start. |
| `pivot` | Node immediately after `marker`, whose value is being placed. | Fabio Quartararo's P9 node on the first pass. |
| `walk` | A node in the sorted prefix used while looking left for an insertion point. | It starts at the marker on a move pass. |

The suffix after `pivot` has not been processed yet. The word **position** here means a list-node handle, not a rider's finishing place. `L.after(marker)` finds the next node without a numeric index.

**Why assign separate jobs?** It prevents a common mistake: moving `marker` left while searching would lose the boundary of the sorted prefix. **How to trace a pass:** mark the sorted prefix, circle the next pivot, and move only `walk` left while searching.

<span id="part-1-invariant"></span>

### 3. State the Sorted-Prefix Rule

An **invariant** is a fact that remains true before and after each pass:

> Every element from `L.first()` through `marker` is in nondecreasing order. Every element after `marker` is still waiting to be considered.

At the start, the first card alone is sorted, so `marker = L.first()`. Each pass takes the card immediately after `marker` and incorporates it into the sorted prefix. The loop ends when `marker == L.last()`: no unprocessed card remains.

For our example, the first prefix is `[1]`. After considering Fabio's P9 card, it is `[1, 9]`. After considering Di Giannantonio's P3 card, it becomes `[1, 3, 9]`.

**Why state the invariant?** It tells us which part may be searched safely and what each pass must achieve. **How to check a proposed step:** write down the prefix through `marker` after the step; if its numbers are not sorted, the step is wrong.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Work Through the Book's Insertion Step

<span id="part-2-figure"></span>

### 1. Read Figure 7.15

The book's Figure 7.15 shows a sorted prefix followed by unprocessed values:

```text
Sorted prefix through marker      Unprocessed
15 → 22 → 25 → 29 → 36            23 → 53 → 11 → 42
                     marker        pivot
```

The pivot is `23`. It belongs after `22` and before `25`. Starting at the marker (`36`), `walk` moves left through `29` and `25`. It stops at `25` because the value immediately before `25` is `22`, which is not greater than `23`. The algorithm inserts `23` **before `walk`**:

```text
15 → 22 → 23 → 25 → 29 → 36 | 53 → 11 → 42
```

**Why this example?** The pivot has to pass more than one predecessor, so it reveals what the backward search does. **How to solve it:** compare the pivot with each preceding value, move `walk` left while that value is greater, then insert the pivot just before the final `walk` node.

<span id="part-2-keep"></span>

### 2. Keep a Pivot That Is Already in Order

Code Fragment 7.17 first obtains `pivot = L.after(marker)` and `value = pivot.element()`. If `value > marker.element()`, the pivot is larger than the greatest value in the sorted prefix. It is already in the right place, so only the boundary changes:

```python
if value > marker.element():
    marker = pivot
```

In our first pass, `marker` is Marc's P1 card and `pivot` is Fabio Quartararo's P9 card. Since `9 > 1`, the prefix `[1, 9]` is sorted. No node is deleted or reinserted.

**Why use Marc and Fabio here?** Their known finishes make the fast path easy to see. **How to solve the decision:** compare the pivot's key with the marker's key. If the pivot is greater, advance `marker` to `pivot` and leave the links alone.

<span id="part-2-move"></span>

### 3. Relocate a Pivot That Belongs Earlier

Otherwise, the code starts `walk` at `marker`. It steps left while the node **before** `walk` has a value greater than the pivot:

```python
walk = marker
while walk != L.first() and L.before(walk).element() > value:
    walk = L.before(walk)
L.delete(pivot)
L.add_before(walk, value)
```

For Di Giannantonio's P3 card, `marker` names Fabio Quartararo's P9 card. The predecessor of P9 is Marc's P1 card, and `1 > 3` is false. So `walk` stays at P9. Delete the old P3 node and insert its **card value** before P9:

```text
Before: P1 Marc → P9 Quartararo → P3 Di Giannantonio
After:  P1 Marc → P3 Di Giannantonio → P9 Quartararo
```

The condition `walk != L.first()` is checked first. Python's `and` then prevents `L.before(walk).element()` from being called when `walk` is already first and has no predecessor. `L.add_before(walk, value)` returns a **new position** for the reinserted card; the book's sort does not need to save it.

**Why delete and reinsert?** The public positional-list ADT has local insertion and deletion but no public “move this node” operation. **How to solve a move:** save the pivot's value, find the insertion position, delete the old pivot position, and add the value before `walk`.

<span id="part-2-correctness"></span>

### 4. Explain Why the Step Works

When `walk` stops, all sorted-prefix values **before `walk`** are at most the pivot value, and the values from `walk` through `marker` are at least the pivot value. Inserting the pivot before `walk` keeps that prefix sorted. Because the pivot came from immediately after `marker`, removing it also pulls the next unprocessed node directly after `marker`.

The saved `marker` still names the same node in the move branch. The sorted prefix has gained the newly inserted value **before** that node, so `marker` remains its right boundary. In the keep branch, `marker = pivot` extends the prefix by one node. Either way, exactly one pivot becomes sorted per pass.

**Why explain this?** A trace shows that one example worked; the invariant explains every pass. **How to check it:** verify the values on each side of the insertion point, then verify that the sorted prefix has grown by one.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Solve the Sprint-Card Trace

<span id="part-3-trace"></span>

### 1. Trace Every Pass

Start with the shuffled rank keys `[1, 9, 3, 8, 2]`. A vertical bar in the table separates the sorted prefix (left) from cards still waiting (right):

| Pass | Pivot | Decision and backward search | State after pass |
| ---: | :---- | :--------------------------- | :--------------- |
| Start | — | Marc P1 alone is sorted; `marker` is P1. | `[1] │ [9, 3, 8, 2]` |
| 1 | Quartararo P9 | `9 > 1`; keep it and advance `marker` to P9. | `[1, 9] │ [3, 8, 2]` |
| 2 | Di Giannantonio P3 | `3 > 9` is false; Marc P1 is not greater than P3, so insert P3 before P9. | `[1, 3, 9] │ [8, 2]` |
| 3 | Bagnaia P8 | `8 > 9` is false; P3 is not greater than P8, so insert P8 before P9. | `[1, 3, 8, 9] │ [2]` |
| 4 | Ogura P2 | Walk left past P8 and P3; P1 is not greater than P2. Insert P2 before P3. | `[1, 2, 3, 8, 9]` |

The final selected-card order is Marc, Ai, Di Giannantonio, Bagnaia, Quartararo. The gaps between P3 and P8 are expected because this is a **subset** of the Sprint results.

**Why trace all passes?** It exposes both branches, including a pivot that moves across two nodes. **How to solve a similar trace:** write the sorted prefix after each pass, compare the next pivot with `marker`, walk left only if needed, and mark the new prefix boundary.

<span id="part-3-positions"></span>

### 2. Track Positions and Special Cases

The move branch calls `L.delete(pivot)`, so the **old pivot position becomes invalid**. `L.add_before(walk, value)` creates a new node and a new position containing the same card. This is a change to the card's location in our software list, not to its official Sprint finish. A saved position for Marc remains valid throughout. A saved position for Fabio Quartararo also remains valid in this trace because his node is never deleted; he becomes the `marker` after pass 1.

The sort also handles an empty list or a one-card list: `if len(L) > 1` skips the loop. In a move branch, the `walk != L.first()` guard prevents a step past the front. The code assumes all elements support the `>` comparison; our card tuples do.

**Equal-key detail:** The book uses a strict `>` in the keep branch. If two cards compared equal under a chosen sort key (for example, Marc and Bagnaia if sorting only by their shared Ducati Lenovo Team name), the later card would enter the move branch and could be inserted before the earlier one. The book's version is therefore **not stable** for equal keys. If preserving their original order matters, change the keep condition to `value >= marker.element()` while leaving the backward test strict (`>`). Our finish-number keys are unique, so this issue does not affect the Sprint trace.

**Why mention handles and ties?** The list may look correctly sorted while a saved handle has gone stale or equal records have changed relative order. **How to check both:** test whether each saved node was deleted, and decide whether equal-key order matters for the task.

<span id="part-3-cost"></span>

### 3. Count the Work

The following bounds follow from Code Fragment 7.17 and the O(1) positional-list operations in Section 7.4:

| Situation | Work |
| :-------- | :--- |
| Strictly increasing keys | **Θ(n)**: each pivot passes the first comparison and `marker` advances. |
| Decreasing keys | **Θ(n²)**: successive pivots scan farther left through the sorted prefix. |
| General worst case | **O(n²)** time. |
| Additional working storage | **O(1)** handles and values beyond the list, even though a move replaces one node with another. |

Deleting and inserting at **known positions** each take O(1). Finding where a pivot belongs can take O(n) in one pass, and the repeated searches cause the quadratic worst case. Sorting a linked list does not make the search free.

**Why separate these costs?** It prevents “constant-time insertion” from being mistaken for “constant-time sorting.” **How to analyze the algorithm:** count how many pivots there are (at most `n - 1`), then count the backward comparisons made for each pivot.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Complete Worked Program

<span id="part-4-plan"></span>

### 1. Plan the Program

**Problem:** Enter the five verified Sprint cards in shuffled order, sort the selected view by official finish number, and check which saved positions remain valid.

1. Store each card as `(finish_number, rider, team)`.
2. Build a positional list with sentinels and the access/update methods the sorter uses. The [full ADT explanation is in Section 7.4](07-04-the-positional-list-adt.md); this compact class includes the methods needed here.
3. Implement Code Fragment 7.17's `marker`, `pivot`, and `walk` logic.
4. Print the before and after order. Confirm Marc and Fabio Quartararo's unchanged node handles and the deleted Ai handle.

**Why this program?** It keeps real session facts attached to their riders while showing both the logical sort and the physical delete-and-reinsert behavior.

<span id="part-4-program"></span>

### 2. Run the Program

Save the following as `sprint_positional_sort.py` and run `python sprint_positional_sort.py` with Python 3. The small `PositionalList` is included so this example runs on its own.

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

    def _insert_between(self, element, predecessor, successor):
        newest = self._Node(element, predecessor, successor)
        predecessor._next = newest
        successor._prev = newest
        self._size += 1
        return self._make_position(newest)

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


def insertion_sort(L):
    """Sort a PositionalList of comparable elements into nondecreasing order."""
    if len(L) > 1:
        marker = L.first()
        while marker != L.last():
            pivot = L.after(marker)
            value = pivot.element()
            if value > marker.element():
                marker = pivot
            else:
                walk = marker
                while walk != L.first() and L.before(walk).element() > value:
                    walk = L.before(walk)
                L.delete(pivot)
                L.add_before(walk, value)


def short_order(sequence):
    return " | ".join("P{} {}".format(rank, rider)
                      for rank, rider, _ in sequence)


# A shuffled subset of the 10 October 2026 Indonesian GP Sprint results.
marc = (1, "Marc Márquez", "Ducati Lenovo Team")
fabio = (9, "Fabio Quartararo", "Monster Energy Yamaha MotoGP Team")
di_giannantonio = (3, "Fabio Di Giannantonio",
                   "Pertamina Enduro VR46 Racing Team")
bagnaia = (8, "Francesco Bagnaia", "Ducati Lenovo Team")
ai = (2, "Ai Ogura", "SuperFile Trackhouse MotoGP Team")

cards = PositionalList()
p_marc = cards.add_last(marc)
p_fabio = cards.add_last(fabio)
cards.add_last(di_giannantonio)
cards.add_last(bagnaia)
p_ai = cards.add_last(ai)

print("Before:", short_order(cards))
insertion_sort(cards)
print("After:")
for rank, rider, team in cards:
    print("  P{} {} — {}".format(rank, rider, team))

print("Marc handle still first:", p_marc == cards.first())
print("Fabio Quartararo handle still last:", p_fabio == cards.last())
try:
    cards.after(p_ai)
except ValueError:
    print("Old Ai handle rejected: ValueError")
```

The tuples are compared by their first item because their finish numbers are distinct. The sort uses `L.delete(pivot)` and `L.add_before(walk, value)` exactly as the book's method does. It keeps the **card value** intact but does not preserve a handle to a moved node. The two Fabio riders are printed with their full names to keep their records distinct.

<span id="part-4-check"></span>

### 3. Check the Output

```text
Before: P1 Marc Márquez | P9 Fabio Quartararo | P3 Fabio Di Giannantonio | P8 Francesco Bagnaia | P2 Ai Ogura
After:
  P1 Marc Márquez — Ducati Lenovo Team
  P2 Ai Ogura — SuperFile Trackhouse MotoGP Team
  P3 Fabio Di Giannantonio — Pertamina Enduro VR46 Racing Team
  P8 Francesco Bagnaia — Ducati Lenovo Team
  P9 Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Marc handle still first: True
Fabio Quartararo handle still last: True
Old Ai handle rejected: ValueError
```

**How to check the answer:** read the finish numbers in the final list (`1, 2, 3, 8, 9`), confirm that every rider keeps the team from the official Sprint result, then compare saved positions. Marc and Fabio Quartararo still occupy their original nodes; Ai's original node was deleted during sorting, so `cards.after(p_ai)` raises `ValueError`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 7.5 idea | Plain-language meaning | Sprint-card example |
| :--------------- | :--------------------- | :------------------ |
| Comparable values | Decide what field sets the order. | Numeric finish is first in each card tuple. |
| Sorted prefix | The portion through `marker` is already ordered. | `[1, 9]` after Fabio Quartararo's pass. |
| `pivot` | Next card to place. | Di Giannantonio's P3 after the P1, P9 prefix. |
| `walk` | Search left within the sorted prefix. | Ogura's P2 passes P8 and P3. |
| Local relocation | Delete old pivot node; insert its value before `walk`. | P2 ends up between P1 and P3. |
| Saved handles | A deleted pivot position is invalid; untouched nodes remain valid. | Old Ai handle fails, Fabio Quartararo's handle remains valid. |
| Time | Local edits are O(1), but repeated leftward scans may total O(n²). | The shuffled cards need three relocations. |

The official Sprint ranks remain P1, P2, P3, P8, and P9 throughout. Only their order in this selected practice list changes.

[🔝 Back to Top](#top)
