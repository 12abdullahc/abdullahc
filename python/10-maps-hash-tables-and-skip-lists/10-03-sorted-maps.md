<span id="top"></span>

# 10.3 Sorted Maps — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 10, Section 10.3, printed pages 427–436 ([supplied Chapter 10 PDF](<../Data Structures and Algorithms in Python - C10.pdf>)).<br>
> **Topic:** 10.3 Sorted Maps; 10.3.1 Sorted Search Tables; 10.3.2 Two Applications of Sorted Maps.<br>
> **Domain Focus:** The rectangle cards from [Sections 10.1](10-01-maps-and-dictionaries.md) and [10.2](10-02-hash-tables.md), searched by area, arranged on boards, and compared by area and border length.<br>
> **User Prompt:** Reexplain Section 10.3 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: An Ordered Card Catalog](#background)
   - [1. Keep the same rectangle cards](#background-cards)
   - [2. Ask for nearby areas](#background-questions)
2. [Part 1: 10.3 Sorted Maps](#part-1)
   - [1. What a sorted map adds](#part-1-operations)
   - [2. Strict, inclusive, and half-open searches](#part-1-bounds)
   - [3. Choose an ordered, unique key](#part-1-keys)
3. [Part 2: 10.3.1 Sorted Search Tables](#part-2)
   - [1. Store entries in key order](#part-2-table)
   - [2. Binary search for an insertion position](#part-2-search)
   - [3. Turn one position into neighbor searches](#part-2-neighbors)
   - [4. Insert, update, delete, and scan](#part-2-updates)
   - [5. Running time and space](#part-2-cost)
4. [Part 3: 10.3.2 Two Applications of Sorted Maps](#part-3)
   - [1. Flight databases and board catalogs](#part-3-flights)
   - [2. Maxima sets and rectangle trade-offs](#part-3-maxima)
   - [3. Maintain and query the frontier](#part-3-frontier)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. Build a small sorted-table map](#part-4-code)
   - [2. Run the card, board, and frontier queries](#part-4-demo)
   - [3. Read the output](#part-4-output)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: An Ordered Card Catalog

<span id="background-cards"></span>

### 1. Keep the same rectangle cards

Our class still cuts rectangular cards for a display board. [Section 10.1](10-01-maps-and-dictionaries.md) used labels as map keys; [Section 10.2](10-02-hash-tables.md) gave the sizes stable numeric IDs to study hashing. This time we want to search by **area**.

| Card | Fixed ID | Width | Height | Area | Border length |
| :--- | -------: | ----: | -----: | ---: | ------------: |
| D | 24 | 2 cm | 2 cm | 4 cm² | 8 cm |
| A | 3 | 2 cm | 3 cm | 6 cm² | 10 cm |
| B | 10 | 4 cm | 2 cm | 8 cm² | 12 cm |
| C | 17 | 4 cm | 4 cm | 16 cm² | 16 cm |

For width `w` and height `h`, **area = `w × h`** and **border length (perimeter) = `2(w + h)`**. A's area is `2 × 3 = 6` cm², while its border length is `2(2 + 3) = 10` cm. Its fixed ID is still `3`; an ID and a measurement have different jobs.

The four areas happen to be distinct. We can therefore make a map whose **key is area** and whose **value is the card label**:

```text
4 → D       6 → A       8 → B       16 → C
```

<span id="background-questions"></span>

### 2. Ask for nearby areas

An exact map lookup can answer “Which card has area 8 cm²?” But a student may ask “Which card has the smallest area **at least 7 cm²**?” The answer is B, whose area is 8 cm², even though key `7` is absent.

A hash table deliberately spreads keys among buckets; nearby areas need not be nearby in its storage. A **sorted map** keeps an ordering of keys so we can ask for neighbors, traverse in order, and report intervals of areas. These are the reasons to use an ordered catalog here.

> **Mental model:** An ordinary map answers “Which value belongs to this exact key?” A sorted map can also answer “Which stored key comes just before or after this point?”

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 10.3 Sorted Maps

A sorted map supports the ordinary map operations from Section 10.1: retrieve, insert or replace, delete, and iterate over key-value associations. It also assumes its keys can be compared in a **consistent total order**. For our first catalog, that order is ordinary numeric area order: `4 < 6 < 8 < 16`.

<span id="part-1-operations"></span>

### 1. What a sorted map adds

The extra operations return **`(key, value)` pairs**, except the two iterators, which yield keys. With our area-to-label map, they mean:

| Operation | Question | Result |
| :--- | :--- | :--- |
| `find_min()` | Smallest stored area? | `(4, "D")` |
| `find_max()` | Largest stored area? | `(16, "C")` |
| `find_lt(8)` | Largest area **less than** 8? | `(6, "A")` |
| `find_le(8)` | Largest area **at most** 8? | `(8, "B")` |
| `find_gt(8)` | Smallest area **greater than** 8? | `(16, "C")` |
| `find_ge(8)` | Smallest area **at least** 8? | `(8, "B")` |
| `find_range(6, 16)` | All areas from 6 up to, but excluding, 16? | `[(6, "A"), (8, "B")]` |
| `iter(M)` | Keys from smallest to largest? | `4, 6, 8, 16` |
| `reversed(M)` | Keys from largest to smallest? | `16, 8, 6, 4` |

`lt` and `gt` are **strict**: equal keys do not qualify. `le` and `ge` are **inclusive**: equality qualifies. If no pair fits, a neighbor or minimum/maximum search returns `None`. For example, `find_lt(4)` and `find_gt(16)` both return `None`. On an empty map, `find_min()` and `find_max()` also return `None`.

<span id="part-1-bounds"></span>

### 2. Strict, inclusive, and half-open searches

The range convention is **start inclusive, stop exclusive**:

```text
find_range(start, stop) reports keys k for which start ≤ k < stop.
```

Thus `find_range(6, 16)` reports A and B but not C. `find_range(6, 17)` includes C. If `start` is `None`, the range begins at the smallest key; if `stop` is `None`, it continues through the largest. For example, `find_range(None, 8)` reports D and A, while `find_range(8, None)` reports B and C.

The exclusive stop is useful when adjacent intervals must not overlap. The intervals `[4, 8)` and `[8, 17)` place key `8` in exactly one interval. When `start >= stop`, a bounded range reports no entries.

<span id="part-1-keys"></span>

### 3. Choose an ordered, unique key

A map has **one value per key**. If another card had area 6 cm², storing both under key `6` would replace one association rather than create two entries. To keep every physical design, use a compound key such as `(area, fixed_id)`, or make each area map to a list of cards. The fixed IDs from Section 10.2 are useful tie breakers because they are unique.

For instance, A's compound key would be `(6, 3)`. Python compares tuples from left to right, so area remains the primary order and ID breaks an area tie. All keys within one sorted map must use comparable fields in consistent positions. A sorted map of numeric areas and a sorted map of compound keys are separate catalogs with different query bounds.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 10.3.1 Sorted Search Tables

The book implements the sorted-map behavior with a **sorted search table**: an array-based sequence of entries, kept in increasing key order. This is one implementation of the sorted-map interface, not a claim that every sorted map uses an array.

<span id="part-2-table"></span>

### 1. Store entries in key order

Our table starts as:

| Index | 0 | 1 | 2 | 3 |
| ---: | :--- | :--- | :--- | :--- |
| Entry | `(4, "D")` | `(6, "A")` | `(8, "B")` | `(16, "C")` |

The key order is the **invariant** we must preserve after every update. Indexing an array-based sequence lets binary search inspect its middle entry directly. The table needs `O(n)` space for `n` entries.

<span id="part-2-search"></span>

### 2. Binary search for an insertion position

Instead of asking only “Was area 7 found?”, the book's search helper finds the position of the **first key greater than or equal to the target**. This is often called a *lower bound*. If the target is absent, the same position tells us where to insert it.

For keys `[4, 6, 8, 16]` and target `7`, use a half-open search interval `[low, high)`:

| Step | `low` | `high` | `mid` | Middle key | Decision |
| ---: | ---: | ---: | ---: | ---: | :--- |
| 1 | 0 | 4 | 2 | 8 | `8 ≥ 7`, so search left half: `high = 2` |
| 2 | 0 | 2 | 1 | 6 | `6 < 7`, so search right half: `low = 2` |
| End | 2 | 2 | — | — | First key `≥ 7` is at index `2` |

So `7` belongs between A's `6` and B's `8`. The same helper returns index `2` for the present key `8`. It returns `0` for `3` and `4` for `17`. Returning the table length for a target above the maximum is a valid insertion position, but it is **not** an existing entry.

The helper repeatedly halves the possible positions. After about `log₂(n)` comparisons, one position remains, giving `O(log n)` search time.

<span id="part-2-neighbors"></span>

### 3. Turn one position into neighbor searches

Let `j` be the first index whose key is at least the target `k`. The four neighbor operations need only a small check around `j`:

| Search | How to use `j` |
| :--- | :--- |
| `find_ge(k)` | Return entry `j` if `j` is inside the table. |
| `find_lt(k)` | Return entry `j - 1` if `j > 0`. |
| `find_le(k)` | Return entry `j` if its key equals `k`; otherwise return `j - 1` if it exists. |
| `find_gt(k)` | Skip entry `j` if it equals `k`, then return the next entry if it exists. |

For missing area `7`, `j = 2`. Both `find_ge(7)` and `find_gt(7)` return B at area 8; both `find_le(7)` and `find_lt(7)` return A at area 6. For present area `8`, the strict and inclusive versions differ: `find_lt(8) = (6, "A")`, but `find_le(8) = (8, "B")`.

The edge checks matter. If `j = 0`, there is no predecessor. If `j = n`, there is no successor. The book gives the same lower-bound idea with an inclusive `low/high` search interval; our program below uses a half-open interval and reaches the same position.

<span id="part-2-updates"></span>

### 4. Insert, update, delete, and scan

If we create a new design of area 5 cm², its key belongs at index `1`:

```text
Before: 4, 6, 8, 16
After:  4, 5, 6, 8, 16
```

Locating index `1` takes `O(log n)`, but inserting there shifts the old `6`, `8`, and `16` entries right. That makes a new-key insertion `O(n)` in the worst case. Replacing the value at existing key `8` changes one entry after the search, so it is `O(log n)`. Deleting a key can also shift later entries left and is `O(n)` in the worst case.

A range scan first finds the starting position by binary search, then walks forward until the stop key. It does constant work for each of the `s` reported entries, so the total is `O(log n + s)`. Full forward or reverse iteration simply walks all `n` entries and takes `O(n)` time.

<span id="part-2-cost"></span>

### 5. Running time and space

These are **worst-case bounds for the array-backed `SortedTableMap`**, not for all possible sorted-map implementations:

| Operation | Time | Reason |
| :--- | :--- | :--- |
| `len(M)`; `find_min()`; `find_max()` | `O(1)` | Size or an endpoint is directly available. |
| Exact lookup; `k in M`; four neighbor searches | `O(log n)` | One binary search plus a few checks. |
| Replace an existing key's value | `O(log n)` | Search, then overwrite one entry. |
| Insert a new key; delete a key | `O(n)` worst case | Array entries may shift. |
| `find_range(start, stop)` | `O(log n + s)` | Find the first result, then report `s` entries. |
| `iter(M)`; `reversed(M)` | `O(n)` | Visit each key once. |
| Storage | `O(n)` | One entry per key. |

This table fits a catalog that is searched often and updated less often. It also shows why a sorted map and a hash map solve different query needs: a hash map emphasizes exact-key access, while the sorted map keeps order available for neighbor and interval questions.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 10.3.2 Two Applications of Sorted Maps

The book's two applications show when the *meaning* of key order helps. We first state each application, then carry its idea into our rectangle-card activity.

<span id="part-3-flights"></span>

### 1. Flight databases and board catalogs

The book's flight key is `(origin, destination, date, time)`. Its value can hold the flight number, available seats, duration, and fare. A traveler wants the same route and a departure at or after a requested time, or all departures within a time interval. Lexicographic tuple order groups flights by the earlier fields before it orders their times. A sorted-map `find_ge` or `find_range` can start the search near the desired time.

For geometry, imagine storing cards placed on boards. Use the key `(board_name, area, fixed_id)` and the value `card_label`. The ID ensures that two equal-area designs can both appear on a board. A range can then select all cards on **Board-1** with area from 6 cm² up to, but excluding, 16 cm²:

```text
start = ("Board-1",  6, -1)
stop  = ("Board-1", 16, -1)
```

All our IDs are nonnegative, so `-1` sorts before any real ID at the same area. `find_range(start, stop)` reports A and B. It excludes C because C's area is exactly the stop area. It also excludes every Board-2 card because the board name comes first in the key.

A single `find_ge` needs a **group check**. If Board-1 has no card of area at least 17 cm², the next key might belong to Board-2. Likewise, the next flight in a global flight map might belong to another route. Inspect the board or route prefix before presenting such a result as a match.

<span id="part-3-maxima"></span>

### 2. Maxima sets and rectangle trade-offs

The book's second application compares **cost** with **performance**. A pair `(cost, performance)` dominates another pair if it costs no more and performs at least as well, with at least one strict improvement. A *maxima set* keeps only pairs that no other pair dominates. The book uses car price and speed.

For our cards, pretend border material is the cost. We want **less border length** but **more usable area**. Each rectangle gives the point `(border length, area)`:

| Design | Dimensions | Border cost | Area benefit | Interpretation |
| :--- | :--- | ---: | ---: | :--- |
| D | 2 × 2 | 8 cm | 4 cm² | Cheapest base card |
| A | 2 × 3 | 10 cm | 6 cm² | More area for more border |
| B | 4 × 2 | 12 cm | 8 cm² | Later beaten at the same cost |
| C | 4 × 4 | 16 cm | 16 cm² | Biggest area here |
| E | 3 × 3 | 12 cm | 9 cm² | Dominates B |
| F | 1 × 6 | 14 cm | 6 cm² | Dominated by A |

E dominates B: both use 12 cm of border, but E has `9 > 8` cm² of area. A dominates F: both have 6 cm² of area, while A uses `10 < 14` cm of border. By contrast, E does **not** dominate C: E is cheaper but C has more area. The useful frontier after considering all six designs is `(8, 4), (10, 6), (12, 9), (16, 16)`, corresponding to D, A, E, and C.

These points are mathematical rectangles, not a claim that area alone measures the quality of a real display. The exercise gives cost and benefit concrete formulas so we can test dominance exactly.

<span id="part-3-frontier"></span>

### 3. Maintain and query the frontier

Store **border cost as the sorted key** and **area benefit as the value**. On a correctly maintained frontier, area strictly increases as border cost increases. Therefore, for a border budget `b`, `find_le(b)` returns the best affordable pair. For `b = 12` cm, the result is `(12, 9)`: design E gives the most area within that budget.

When a new pair `(c, a)` arrives:

1. Find the pair with greatest cost `≤ c`. If its area is `≥ a`, it already dominates the new design; ignore the new pair.
2. Otherwise insert or replace the entry at cost `c`.
3. Remove successive, more expensive entries whose area is `≤ a`. The new design dominates them.

The order of steps is important. If E arrives after B, both have cost 12, but E replaces B because its area is larger. If A arrives after F, A removes F because it offers the same area at a lower cost. Equal performance at a higher cost is dominated.

The underlying map's individual insertion and deletion costs are as in Part 2. There is a subtle point in the book's complexity discussion: its printed `O(n)` worst-case statement for one `add` call does not cover the shown loop of repeated list-backed deletions. If `r` entries are removed, a list-backed implementation can take `O((r + 1)n)` for that call, and `O(n²)` when `r` grows with `n`. The book previews a skip-list implementation with `O(log n)` expected time for `best` and `O((1 + r) log n)` expected time for `add`, where `r` is the number of removed points.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

The code uses a small, original sorted table so the search and shifting ideas remain visible. Its keys must be mutually comparable. Run the first block, then the second block in the same Python session or file.

<span id="part-4-code"></span>

### 1. Build a small sorted-table map

```python
class SortedTableMap:
    """Keep unique key-value pairs in increasing key order."""

    def __init__(self):
        self._items = []

    def _lower_bound(self, key):
        """Return the first index whose stored key is >= key."""
        low, high = 0, len(self._items)
        while low < high:
            mid = (low + high) // 2
            if self._items[mid][0] < key:
                low = mid + 1
            else:
                high = mid
        return low

    def __len__(self):
        return len(self._items)

    def __contains__(self, key):
        j = self._lower_bound(key)
        return j < len(self._items) and self._items[j][0] == key

    def __getitem__(self, key):
        j = self._lower_bound(key)
        if j == len(self._items) or self._items[j][0] != key:
            raise KeyError(key)
        return self._items[j][1]

    def __setitem__(self, key, value):
        j = self._lower_bound(key)
        if j < len(self._items) and self._items[j][0] == key:
            self._items[j] = (key, value)
        else:
            self._items.insert(j, (key, value))

    def __delitem__(self, key):
        j = self._lower_bound(key)
        if j == len(self._items) or self._items[j][0] != key:
            raise KeyError(key)
        self._items.pop(j)

    def __iter__(self):
        for key, _ in self._items:
            yield key

    def __reversed__(self):
        for key, _ in reversed(self._items):
            yield key

    def find_min(self):
        return self._items[0] if self._items else None

    def find_max(self):
        return self._items[-1] if self._items else None

    def find_lt(self, key):
        j = self._lower_bound(key)
        return self._items[j - 1] if j > 0 else None

    def find_le(self, key):
        j = self._lower_bound(key)
        if j < len(self._items) and self._items[j][0] == key:
            return self._items[j]
        return self._items[j - 1] if j > 0 else None

    def find_gt(self, key):
        j = self._lower_bound(key)
        if j < len(self._items) and self._items[j][0] == key:
            j += 1
        return self._items[j] if j < len(self._items) else None

    def find_ge(self, key):
        j = self._lower_bound(key)
        return self._items[j] if j < len(self._items) else None

    def find_range(self, start, stop):
        j = 0 if start is None else self._lower_bound(start)
        while j < len(self._items):
            key, value = self._items[j]
            if stop is not None and key >= stop:
                break
            yield key, value
            j += 1
```

The `_lower_bound` method is the shared search step. The map raises `KeyError` for a missing exact key, as ordinary Python map access does; neighbor methods instead return `None` when no neighbor exists. A new key is inserted at its ordered position, while an existing key's value is replaced.

<span id="part-4-demo"></span>

### 2. Run the card, board, and frontier queries

```python
# label: (fixed ID, width, height)
cards = {
    "A": (3, 2, 3),
    "B": (10, 4, 2),
    "C": (17, 4, 4),
    "D": (24, 2, 2),
}

by_area = SortedTableMap()
by_board = SortedTableMap()

for label, (card_id, width, height) in cards.items():
    area = width * height
    by_area[area] = label
    by_board[("Board-1", area, card_id)] = label

# A second board makes the prefix-check issue visible.
by_board[("Board-2", 6, 31)] = "other-board-card"

print("Area keys:", list(by_area))
print("Area keys reversed:", list(reversed(by_area)))
print("At least 7:", by_area.find_ge(7))
print("Below 8:", by_area.find_lt(8))
print("At most 8:", by_area.find_le(8))
print("Above 16:", by_area.find_gt(16))
print("Areas [6, 16):", list(by_area.find_range(6, 16)))

board_range = by_board.find_range(
    ("Board-1", 6, -1),
    ("Board-1", 16, -1),
)
print("Board-1 areas [6, 16):",
      [(key[1], label) for key, label in board_range])

candidate = by_board.find_ge(("Board-1", 17, -1))
if candidate is None or candidate[0][0] != "Board-1":
    print("Board-1 area >= 17: none")


class BorderAreaFrontier:
    """Keep nondominated (border length, area) pairs."""

    def __init__(self):
        self.map = SortedTableMap()

    def best(self, border_budget):
        return self.map.find_le(border_budget)

    def add_rectangle(self, width, height):
        border = 2 * (width + height)
        area = width * height

        previous = self.map.find_le(border)
        if previous is not None and previous[1] >= area:
            return False

        self.map[border] = area
        following = self.map.find_gt(border)
        while following is not None and following[1] <= area:
            del self.map[following[0]]
            following = self.map.find_gt(border)
        return True


frontier = BorderAreaFrontier()
# F enters first; A later removes it. E later replaces B.
for width, height in [(1, 6), (2, 2), (2, 3),
                      (4, 2), (4, 4), (3, 3)]:
    frontier.add_rectangle(width, height)

print("Frontier:", list(frontier.map.find_range(None, None)))
print("Best with 12 cm border:", frontier.best(12))
print("Best with 9 cm border:", frontier.best(9))
```

<span id="part-4-output"></span>

### 3. Read the output

```text
Area keys: [4, 6, 8, 16]
Area keys reversed: [16, 8, 6, 4]
At least 7: (8, 'B')
Below 8: (6, 'A')
At most 8: (8, 'B')
Above 16: None
Areas [6, 16): [(6, 'A'), (8, 'B')]
Board-1 areas [6, 16): [(6, 'A'), (8, 'B')]
Board-1 area >= 17: none
Frontier: [(8, 4), (10, 6), (12, 9), (16, 16)]
Best with 12 cm border: (12, 9)
Best with 9 cm border: (8, 4)
```

The first set of results uses **area as the key**. The board range uses **`(board, area, ID)` as the key** so it can keep equal-area designs distinct. The frontier uses **border length as the key** and area as the value. These are three sorted maps over the same geometry activity, each ordered to answer a different question.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

Try each question before opening its answer. The cases reuse the cards, board catalog, and frontier above.

<details>
<summary><strong>Case Study 1: A missing area between A and B</strong></summary>

**Question:** A student requests exactly 7 cm². What do `find_lt(7)`, `find_le(7)`, `find_gt(7)`, and `find_ge(7)` return?

**Work:** The ordered keys are `4, 6, 8, 16`. There is no `7`, so both “less than” versions choose the largest lower key, `6`. Both “greater than” versions choose the smallest higher key, `8`.

**Answer:** `find_lt(7) = find_le(7) = (6, "A")` and `find_gt(7) = find_ge(7) = (8, "B")`. Exact lookup `by_area[7]` raises `KeyError`.

</details>

<details>
<summary><strong>Case Study 2: A boundary that belongs to only one range</strong></summary>

**Question:** Which cards occur in `find_range(4, 8)` and `find_range(8, 17)`?

**Work:** The first interval includes `4` but excludes `8`; the second includes `8` but excludes `17`.

**Answer:** `[4, 8)` contains D and A. `[8, 17)` contains B and C. B appears only in the second range, so the two ranges do not double-count area 8 cm².

</details>

<details>
<summary><strong>Case Study 3: Inserting a new area</strong></summary>

**Question:** A new card has dimensions `1 × 5` cm. Where does it enter the sorted area table, and what is the cost?

**Work:** Its area is `1 × 5 = 5` cm². Binary search returns insertion index `1` for the keys `[4, 6, 8, 16]`. Inserting at index `1` moves three old entries one place right.

**Answer:** The keys become `[4, 5, 6, 8, 16]`. Finding the position is `O(log n)`; the array insertion is `O(n)` worst case.

</details>

<details>
<summary><strong>Case Study 4: Equal areas need distinct identities</strong></summary>

**Question:** Another rectangle is `3 × 2` cm. Can an area-to-label map store it separately from A, which is `2 × 3` cm?

**Work:** Both areas are `6` cm². In a map, a second assignment to key `6` replaces the first value.

**Answer:** Not under the single key `6`. Give the new design a distinct fixed ID and use `(area, ID)` as its key, or store a list of labels as the value for area `6`. A compound-key range can still search primarily by area.

</details>

<details>
<summary><strong>Case Study 5: An inexact search must stay on its board</strong></summary>

**Question:** Why does the program check the board name after searching for a Board-1 card with area at least 17 cm²?

**Work:** Board-1's largest area is 16 cm². Lexicographic order places Board-2 keys after every Board-1 key. `find_ge(("Board-1", 17, -1))` can therefore return a Board-2 entry.

**Answer:** The returned pair is only a valid Board-1 answer if its key still starts with `"Board-1"`. Here it does not, so the answer is “none.”

</details>

<details>
<summary><strong>Case Study 6: Border budget and dominance</strong></summary>

**Question:** With at most 12 cm of border material, which of D, A, B, C, E, and F gives the greatest area? Why is B absent from the final frontier?

**Work:** Affordable designs include D `(8, 4)`, A `(10, 6)`, B `(12, 8)`, and E `(12, 9)`. E and B cost the same, but E has 1 cm² more area. F uses 14 cm of border, and C uses 16 cm.

**Answer:** E, the `3 × 3` cm card, gives 9 cm² of area. It dominates B, so the frontier stores `(12, 9)` and `best(12)` returns that pair.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Idea | Sorted-map meaning | Rectangle-card example |
| :--- | :--- | :--- |
| Key order | Keys have a consistent comparison order. | Areas `4 < 6 < 8 < 16`. |
| Exact versus inexact search | An exact key may be absent, yet neighbors exist. | `find_ge(7) = (8, "B")`. |
| Strict versus inclusive | `lt/gt` exclude equality; `le/ge` allow it. | `find_lt(8)` finds A; `find_le(8)` finds B. |
| Half-open range | Report `start ≤ key < stop`. | `find_range(6, 16)` finds A and B. |
| Sorted search table | Keep entries in an array ordered by key. | Binary search finds where area `7` would go. |
| Search and update cost | Search is `O(log n)`; array shifts can make updates `O(n)`. | Inserting area `5` shifts three entries. |
| Ordered compound key | Earlier tuple fields group later fields. | `(board, area, ID)` supports board-specific area ranges. |
| Maxima set | Keep pairs with no cheaper, equally good or better alternative. | E dominates B at the same border length. |

**Key takeaway:** Choose the map key to match the question. Use an ordered key when “nearest,” “within this range,” or “best within this budget” matters, and account for the array shifts if the catalog changes often.

[🔝 Back to Top](#top)
