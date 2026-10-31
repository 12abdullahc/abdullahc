<span id="top"></span>

# 10.4 Skip Lists — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 10, Section 10.4, printed pages 437–445 ([supplied Chapter 10 PDF](<../Data Structures and Algorithms in Python - C10.pdf>)).<br>
> **Topic:** 10.4 Skip Lists; 10.4.1 Search and Update Operations in a Skip List; 10.4.2 Probabilistic Analysis of Skip Lists.<br>
> **Domain Focus:** The rectangle-card area catalog from [Section 10.3](10-03-sorted-maps.md), now searched and updated through linked levels of shortcuts.<br>
> **User Prompt:** Reexplain Section 10.4 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Card Catalog with Shortcuts](#background)
   - [1. Reuse the rectangle cards](#background-cards)
   - [2. Why add levels to an ordered map?](#background-why)
2. [Part 1: 10.4 Skip Lists](#part-1)
   - [1. Levels, sentinels, and towers](#part-1-levels)
   - [2. What the coin flips decide](#part-1-coins)
   - [3. How positions connect](#part-1-links)
3. [Part 2: 10.4.1 Search and Update Operations in a Skip List](#part-2)
   - [1. Follow a search for area 7](#part-2-search)
   - [2. Use the search result for map questions](#part-2-lookup)
   - [3. Insert and promote a new rectangle](#part-2-insert)
   - [4. Replace and delete an entry](#part-2-delete)
   - [5. Keep a sentinel-only top level](#part-2-top)
4. [Part 3: 10.4.2 Probabilistic Analysis of Skip Lists](#part-3)
   - [1. Probability of reaching a level](#part-3-level-probability)
   - [2. Why height and search are usually small](#part-3-height)
   - [3. Expected space and operation costs](#part-3-cost)
   - [4. Expected time is not a worst-case promise](#part-3-worst)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. Implement a linked skip-list map](#part-4-code)
   - [2. Run the rectangle-card trace](#part-4-demo)
   - [3. Read the output](#part-4-output)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Card Catalog with Shortcuts

<span id="background-cards"></span>

### 1. Reuse the rectangle cards

Our class still cuts rectangular cards for a display board. [Section 10.3](10-03-sorted-maps.md) made an ordered map with **area as key** and **card label as value**. The cards have distinct areas, so every area is a unique key.

| Card | Fixed ID from Section 10.2 | Dimensions | Area key |
| :--- | ---: | :--- | ---: |
| D | 24 | 2 × 2 cm | 4 cm² |
| A | 3 | 2 × 3 cm | 6 cm² |
| B | 10 | 4 × 2 cm | 8 cm² |
| C | 17 | 4 × 4 cm | 16 cm² |

The area formula is `width × height`. The fixed IDs still identify designs; they are **not** the area keys in this guide. For example, C has ID `17` but area key `16`.

We will also add card **G**, a `3 × 4` cm rectangle with area `12` cm². It fits between B and C in area order. Section 10.3 used other example designs E and F for a border-budget study; G is a new design here.

<span id="background-why"></span>

### 2. Why add levels to an ordered map?

The [sorted search table in Section 10.3](10-03-sorted-maps.md#part-2) keeps the keys in an array. Binary search finds a key or insertion position in `O(log n)` worst-case time, but inserting or deleting near the front can shift `O(n)` entries.

A linked ordered list can insert or remove an entry with a few link changes **once its position is known**. Finding that position by scanning one long list can still take `O(n)` time. A skip list adds shorter lists above the complete bottom list. They act as **shortcuts** for finding a position; linked nodes then allow local updates.

```text
Higher levels: fewer area keys, longer jumps
Bottom level:  every area key, in order
```

> **Mental model:** A skip list is an ordered map with a full ground-floor path and randomly chosen express paths above it.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 10.4 Skip Lists

The book calls the bottom level `S₀`, the next level `S₁`, and so on up to `Sₕ`. Each level is ordered from a left sentinel `−∞` to a right sentinel `+∞`. Sentinels mark boundaries; neither is a real rectangle area or map key.

<span id="part-1-levels"></span>

### 1. Levels, sentinels, and towers

Here is **one possible** skip-list arrangement for our four area keys. The higher-level copies line up vertically with the same keys below them.

```text
S₃    −∞                             +∞
S₂    −∞             8               +∞
S₁    −∞       6     8          16   +∞
S₀    −∞   4   6     8          16   +∞
             D   A     B           C
```

| Level | Real area keys | Job |
| :--- | :--- | :--- |
| `S₀` | `4, 6, 8, 16` | Contains **every** map entry. |
| `S₁` | `6, 8, 16` | Shorter route through some entries. |
| `S₂` | `8` | Higher shortcut. |
| `S₃` | none | Top level contains only sentinels. |

The copies of area `8` at `S₀`, `S₁`, and `S₂` form B's **tower**. A tower starts at the bottom and has no gaps: if a key appears on `S₂`, it also appears on `S₁` and `S₀`. The bottom level holds each map association once in the logical map, even though the drawing shows extra index positions higher up.

This particular drawing has three real positions on `S₁` and one on `S₂`. A random skip list does not require exactly half the keys on each higher level.

<span id="part-1-coins"></span>

### 2. What the coin flips decide

A new entry always goes into `S₀`. Then a fair coin is flipped:

- **Tails:** stop; the tower has no new higher copy.
- **Heads:** add a copy one level higher and flip again.

For the pictured arrangement, possible illustrative outcomes are:

| Card | Area | Flip sequence | Real levels reached |
| :--- | ---: | :--- | :--- |
| D | 4 | T | `S₀` |
| A | 6 | H, T | `S₀, S₁` |
| B | 8 | H, H, T | `S₀, S₁, S₂` |
| C | 16 | H, T | `S₀, S₁` |

These flips are **chosen to make a trace**, not evidence that particular keys tend to become tall. Key order determines left-to-right position. The coin flips determine tower height, independently of area.

<span id="part-1-links"></span>

### 3. How positions connect

In the book's linked picture, a position can move with `next(p)` or `prev(p)` on one level, and `above(p)` or `below(p)` in one tower. Given a position, each move can take `O(1)` time. The top-left `−∞` position is the starting point for a search.

The code later uses **one node per tower with an array of forward links**, an optimization also discussed in the section. Its `None` link means “end of this level,” playing the role of the right `+∞` sentinel. The diagram retains both explicit sentinels because they make the search rule easier to see.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 10.4.1 Search and Update Operations in a Skip List

The book's `SkipSearch(k)` starts at the top-left sentinel. At each lower level it moves right while the **next** key is `≤ k`. At `S₀` it returns the rightmost position whose key is `≤ k`. This may be the left sentinel if every real key is larger than `k`.

<span id="part-2-search"></span>

### 1. Follow a search for area 7

Area `7` is missing. Use the levels from Part 1:

| Step | Level | Position after moving down and right | Why stop there? |
| ---: | :--- | :--- | :--- |
| Start | `S₃` | `−∞` | The top level has no real keys. |
| 1 | `S₂` | `−∞` | The next key, `8`, is greater than `7`. |
| 2 | `S₁` | `6` | Move past `6`; the next key is `8 > 7`. |
| 3 | `S₀` | `6` | The next key is still `8 > 7`. |

Thus `SkipSearch(7)` returns A's bottom position at key `6`. That is the **predecessor**. Its next bottom position is B at key `8`, the **successor**. If we search for present area `8`, the scan is allowed to land on `8` because the rule uses `≤`.

For a target below `4`, the search ends at bottom `−∞`. For a target above `16`, it ends at C's `16`. These boundary results let the map report “no matching key” or “no successor” safely.

<span id="part-2-lookup"></span>

### 2. Use the search result for map questions

A skip list implements the **sorted map** from Section 10.3. It does not change what `find_le`, `find_ge`, exact lookup, or range search mean.

| Question | Search result and next action | Answer |
| :--- | :--- | :--- |
| `M[8]` | `SkipSearch(8)` lands on key `8`; return its value. | B |
| `M[7]` | `SkipSearch(7)` lands on key `6`, not `7`. | Raise `KeyError`. |
| `find_le(7)` | Use the returned bottom position. | `(6, "A")` |
| `find_ge(7)` | Use the next bottom position after `6`. | `(8, "B")` |
| `find_range(6, 16)` | Find the start, then walk along `S₀` while key `< 16`. | A and B |

Strict searches check whether the found key equals the target before choosing a neighbor. A bounded range still uses the **start-inclusive, stop-exclusive** rule `start ≤ key < stop`. Each entry in the result is encountered on the bottom level in sorted order.

<span id="part-2-insert"></span>

### 3. Insert and promote a new rectangle

Card G has dimensions `3 × 4` cm, so its area key is `12`. Searching for `12` ends at B's key `8`. The next bottom key is C's `16`. G is inserted **between** them at `S₀`.

For a worked trace, suppose G's flips are **H, H, T**. The first two heads add G to `S₁` and `S₂`. Tails stops. The level order becomes:

```text
S₃    −∞                             +∞
S₂    −∞             8      12       +∞
S₁    −∞       6     8      12  16   +∞
S₀    −∞   4   6     8      12  16   +∞
             D   A     B       G   C
```

G is placed after `8` and before `16` on every level it reaches. A real insertion changes nearby links rather than shifting every later card entry. If a key already exists, `M[k] = v` **replaces its value**; it does not add a second tower or require fresh coin flips.

The book's insertion procedure searches once, inserts at the bottom, then uses upward and backward links to locate the higher insertion points. The code in Part 4 gathers predecessor links during a top-down search and splices the tower into those links. Both preserve the same level order.

<span id="part-2-delete"></span>

### 4. Replace and delete an entry

Suppose B's label is revised. Assigning a new value at area key `8` changes B's value but leaves its tower on `S₀`, `S₁`, and `S₂`. The key order and height do not change.

Deleting G means finding key `12` and unlinking its position on **each level in its tower**: `S₀`, `S₁`, and `S₂`. The levels return to the first diagram. Deleting an absent key, such as `13`, raises `KeyError`. The book explains this tower removal but leaves detailed removal pseudocode as an exercise.

<span id="part-2-top"></span>

### 5. Keep a sentinel-only top level

The top `Sₕ` has only `−∞` and `+∞`. If a new tower grows past the current highest data level, the structure adds a higher sentinel level. After deleting a tall tower, an implementation may remove empty upper levels while keeping one sentinel-only top.

The book discusses two height policies: impose a cap based on the number of entries, or allow heads to keep adding levels. Its insertion pseudocode uses the second approach. Either policy has the expected performance discussed next when implemented as described. A long run of heads is possible, so “expected” must not be read as a fixed height limit.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 10.4.2 Probabilistic Analysis of Skip Lists

This subsection uses elementary probability to explain why the shortcuts are usually effective. **Expected time** averages over the random coin outcomes used to build the skip list; it does not require the input keys to arrive in a random order.

<span id="part-3-level-probability"></span>

### 1. Probability of reaching a level

To reach `S₁`, a card needs one head: probability `1/2`. To reach `S₂`, it needs two heads in a row: probability `(1/2)² = 1/4`. In general,

```text
P(a particular key appears on Sᵢ) = (1/2)ⁱ.
Expected real entries on Sᵢ = n / 2ⁱ.
```

For four cards, the expected real-entry counts are `4` on `S₀`, `2` on `S₁`, and `1` on `S₂`. Our drawing has `4, 3, 1` instead. The expectation describes many random outcomes, not a rule that every single skip list must meet.

| Outcome for one new card | Probability | Real levels reached |
| :--- | ---: | :--- |
| T | `1/2` | `S₀` only |
| H, T | `1/4` | `S₀, S₁` |
| H, H, T | `1/8` | `S₀, S₁, S₂` |
| At least two heads | `1/4` | Reaches `S₂` or higher |

Notice the difference between **exactly two promotions** (`1/8` because a tail follows) and **at least two promotions** (`1/4`).

<span id="part-3-height"></span>

### 2. Why height and search are usually small

The chance that **any** of `n` keys reaches level `i` is at most `n/2ⁱ`. This is an upper bound obtained by adding the individual chances; it is not an exact probability. If `i` is about `3 log₂ n`, the bound is about `1/n²`. Tall towers are therefore unlikely as `n` grows.

A search drops through the levels and scans right at each one. Viewed backward, a short run of keys on a level ends when a key also belongs to the level above. Each key has a `1/2` chance of promotion, so the expected number of horizontal steps per level is constant. With about `O(log n)` levels, searching takes `O(log n)` **expected** time.

For our four-card trace, `SkipSearch(7)` takes only a few steps, but four keys are too small to demonstrate an asymptotic speedup. The analysis explains the behavior as the catalog grows.

<span id="part-3-cost"></span>

### 3. Expected space and operation costs

At level `i`, the expected number of real positions is `n/2ⁱ`. Adding over levels gives a geometric series:

```text
n + n/2 + n/4 + n/8 + ... = 2n.
```

The infinite series gives `2n` expected real positions with uncapped fair flips; any finite partial sum is less than `2n`. Sentinel and link overhead also stays within expected `O(n)` space. For `n = 4`, the limiting expectation is `8` positions. Our drawn sample also has `4 + 3 + 1 = 8` real positions, a coincidence rather than a requirement.

The book's performance summary for a **linked skip-list sorted map** is:

| Operation | Expected time | Why |
| :--- | :--- | :--- |
| `len(M)`; `find_min()`; `find_max()` | `O(1)` | Keep the size and bottom endpoints directly available. |
| Exact lookup; `k in M`; `find_lt/le/gt/ge(k)` | `O(log n)` | Search down the linked levels. |
| `M[k] = v`; `del M[k]` | `O(log n)` | Search, then splice or unlink a tower. |
| `find_range(start, stop)` | `O(log n + s)` | Find the first entry, then report `s` bottom entries. |
| `iter(M)`; `reversed(M)` | `O(n)` | Visit all `n` keys. |
| Storage | `O(n)` expected | The expected total number of positions is linear. |

The `O(1)` maximum operation assumes a direct reference to the last bottom entry. Reverse iteration needs backward bottom links or an `O(n)` temporary list of keys. The compact program below uses the temporary-list approach.

<span id="part-3-worst"></span>

### 4. Expected time is not a worst-case promise

Unlucky flips can create poor shortcut levels. With a finite height cap `h`, the book gives `O(n + h)` worst-case time for a lookup, insertion, or deletion. Without a cap, a run of heads can make one insertion arbitrarily tall, although a never-ending run has probability zero.

| Representation | Search | Insert or delete | What makes the bound hold? |
| :--- | :--- | :--- | :--- |
| Sorted array from Section 10.3 | `O(log n)` worst case | `O(n)` worst case | Binary search; array shifts on updates. |
| Linked skip list | `O(log n)` expected | `O(log n)` expected | Randomly promoted shortcuts; local link changes. |

The distinction matters for implementation. A drawing made from ordinary Python lists at each level can explain the shape, but `list.insert` and `list.pop` still shift elements. That drawing alone would **not** achieve the skip list's expected update bound. The program below stores links between tower nodes.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This is a compact linked implementation of the sorted-map operations used in our card activity. Each tower is one node with one forward link for every level it reaches. The program uses `None` at the end of a level instead of allocating a right `+∞` node. A head node represents the left sentinel on every level, so actual keys must be comparable and cannot be `None`.

<span id="part-4-code"></span>

### 1. Implement a linked skip-list map

```python
from random import randrange


class _Tower:
    def __init__(self, key, value, level_count):
        self.key = key
        self.value = value
        self.next = [None] * level_count


class SkipListMap:
    """A sorted map with linked shortcut levels."""

    def __init__(self, coin=None):
        self._head = _Tower(None, None, 1)  # left sentinel
        self._top = 0                        # always sentinel-only
        self._last = None                    # last entry on S0
        self._size = 0
        self._coin = coin if coin is not None else lambda: bool(randrange(2))

    def _path(self, key, inclusive):
        """Return the last <= key (or < key) position on every level."""
        before = [self._head] * (self._top + 1)
        p = self._head
        for level in range(self._top, -1, -1):
            q = p.next[level]
            while q is not None and (
                q.key <= key if inclusive else q.key < key
            ):
                p = q
                q = p.next[level]
            before[level] = p
        return before

    @staticmethod
    def _pair(node):
        if node is None or node.key is None:  # end or left sentinel
            return None
        return node.key, node.value

    def __len__(self):
        return self._size

    def __contains__(self, key):
        p = self._path(key, True)[0]
        return p is not self._head and p.key == key

    def __getitem__(self, key):
        p = self._path(key, True)[0]
        if p is self._head or p.key != key:
            raise KeyError(key)
        return p.value

    def __setitem__(self, key, value):
        before = self._path(key, True)
        p = before[0]
        if p is not self._head and p.key == key:
            p.value = value
            return

        height = 0  # S0 is always present
        while self._coin():  # each heads adds one higher level
            height += 1

        while self._top <= height:
            self._head.next.append(None)
            before.append(self._head)
            self._top += 1

        new = _Tower(key, value, height + 1)
        for level in range(height + 1):
            new.next[level] = before[level].next[level]
            before[level].next[level] = new

        if new.next[0] is None:
            self._last = new
        self._size += 1

    def __delitem__(self, key):
        before = self._path(key, False)
        target = before[0].next[0]
        if target is None or target.key != key:
            raise KeyError(key)

        for level in range(len(target.next)):
            before[level].next[level] = target.next[level]
        if target is self._last:
            self._last = None if before[0] is self._head else before[0]
        self._size -= 1

        while self._top > 0 and self._head.next[self._top - 1] is None:
            self._head.next.pop()  # remove an unused top sentinel level
            self._top -= 1

    def __iter__(self):
        p = self._head.next[0]
        while p is not None:
            yield p.key
            p = p.next[0]

    def __reversed__(self):
        yield from reversed(list(self))

    def find_min(self):
        return self._pair(self._head.next[0])

    def find_max(self):
        return self._pair(self._last)

    def find_lt(self, key):
        return self._pair(self._path(key, False)[0])

    def find_le(self, key):
        return self._pair(self._path(key, True)[0])

    def find_gt(self, key):
        return self._pair(self._path(key, True)[0].next[0])

    def find_ge(self, key):
        return self._pair(self._path(key, False)[0].next[0])

    def find_range(self, start, stop):
        if start is None:
            p = self._head.next[0]
        else:
            p = self._path(start, False)[0].next[0]
        while p is not None and (stop is None or p.key < stop):
            yield p.key, p.value
            p = p.next[0]

    def levels(self):
        """Report level keys for a teaching trace."""
        for level in range(self._top, -1, -1):
            keys = []
            p = self._head.next[level]
            while p is not None:
                keys.append(p.key)
                p = p.next[level]
            yield level, keys
```

The book's `SkipSearch` stops at the bottom predecessor `≤ key`. Here `_path(key, True)[0]` returns that same position, while `_path(key, False)` handles strict predecessor and insertion-link cases. Updating an existing key returns before flipping a coin. The bottom and maximum references support `O(1)` minimum and maximum queries.

<span id="part-4-demo"></span>

### 2. Run the rectangle-card trace

This block follows the class definition in the same Python session or file. The fixed outcomes make the **example** repeatable. Constructing `SkipListMap()` with no `coin` argument uses random fair flips instead.

```python
def show_levels(m):
    for level, keys in m.levels():
        middle = " → ".join(str(key) for key in keys)
        print(f"S{level}: -∞" + (f" → {middle}" if middle else "") + " → +∞")


# D: T; A: H,T; B: H,H,T; C: H,T; G: H,H,T.
flips = iter([False, True, False, True, True, False,
              True, False, True, True, False])
areas = SkipListMap(coin=lambda: next(flips))

for area, label in [(4, "D"), (6, "A"), (8, "B"), (16, "C")]:
    areas[area] = label

print("Initial levels:")
show_levels(areas)
original_levels = list(areas.levels())
print("Keys:", list(areas))
print("Predecessor of 7:", areas.find_le(7))
print("Successor of 7:", areas.find_ge(7))
print("Exact area 8:", areas[8])
print("Range [6, 16):", list(areas.find_range(6, 16)))

areas[12] = "G"  # 3 × 4 cm rectangle
print("After adding G:")
show_levels(areas)
print("First area >= 10:", areas.find_ge(10))

areas[8] = "B revised"  # replace, with no new coin flips
print("Revised area 8:", areas[8])
del areas[12]
print("Keys after removing G:", list(areas))
print("Original towers restored:", list(areas.levels()) == original_levels)
print("Smallest and largest:", areas.find_min(), areas.find_max())
```

<span id="part-4-output"></span>

### 3. Read the output

```text
Initial levels:
S3: -∞ → +∞
S2: -∞ → 8 → +∞
S1: -∞ → 6 → 8 → 16 → +∞
S0: -∞ → 4 → 6 → 8 → 16 → +∞
Keys: [4, 6, 8, 16]
Predecessor of 7: (6, 'A')
Successor of 7: (8, 'B')
Exact area 8: B
Range [6, 16): [(6, 'A'), (8, 'B')]
After adding G:
S3: -∞ → +∞
S2: -∞ → 8 → 12 → +∞
S1: -∞ → 6 → 8 → 12 → 16 → +∞
S0: -∞ → 4 → 6 → 8 → 12 → 16 → +∞
First area >= 10: (12, 'G')
Revised area 8: B revised
Keys after removing G: [4, 6, 8, 16]
Original towers restored: True
Smallest and largest: (4, 'D') (16, 'C')
```

The returned pairs still follow the sorted-map rules from Section 10.3. The visible change is how the map reaches and updates an ordered position. The fixed flip stream is solely for this trace; the expected complexity in Part 3 concerns fair random flips.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

Try each question before opening its answer. All cases use the same area keys and tower rules.

<details>
<summary><strong>Case Study 1: Search for an absent area</strong></summary>

**Question:** Before G is inserted, what does `SkipSearch(7)` return, and what would `M[7]` do?

**Work:** On `S₂`, the next key `8` is too large. On `S₁`, move to `6`. On `S₀`, the next key is `8`, so stay at `6`.

**Answer:** The search returns A's bottom position, key `6`. Exact lookup `M[7]` raises `KeyError` because `6 ≠ 7`. `find_ge(7)` can use the next bottom entry, B at `8`.

</details>

<details>
<summary><strong>Case Study 2: One new tower from three flips</strong></summary>

**Question:** G is `3 × 4` cm. If its insertion flips are H, H, T, where does it appear?

**Work:** G's area is `3 × 4 = 12` cm². It enters `S₀` between `8` and `16`. The first head promotes it to `S₁`; the second promotes it to `S₂`; tails stops.

**Answer:** G appears at key `12` on `S₀`, `S₁`, and `S₂`. `S₃` remains sentinel-only. The probability of **exactly** this height with fair flips is `1/8`.

</details>

<details>
<summary><strong>Case Study 3: Equal-area designs need distinct keys</strong></summary>

**Question:** A new `3 × 2` cm rectangle has the same area as A. Does a second assignment to area key `6` create a second tower?

**Work:** Both areas are `6` cm². A map allows only one value per key. The search lands on the existing key before any promotion flips.

**Answer:** No. The value at `6` is replaced, and the tower height stays the same. To keep both designs, use a key such as `(area, fixed_id)`, as in Section 10.3, or store a list of designs as the value.

</details>

<details>
<summary><strong>Case Study 4: Remove every copy of a card</strong></summary>

**Question:** After inserting G, can we delete just its `S₀` position and leave its `S₁` and `S₂` positions?

**Work:** A higher level must be a subset of every lower level. Leaving higher copies without the bottom entry would break the skip-list invariant and could make searches land on a deleted key.

**Answer:** Delete G's whole tower at area `12`. Its three positions are unlinked, and the original four-card level diagram is restored.

</details>

<details>
<summary><strong>Case Study 5: Probability is about possible runs</strong></summary>

**Question:** For four cards, must `S₁` contain exactly two real keys because `4/2 = 2`?

**Work:** Each key reaches `S₁` with probability `1/2`, so the **expected** count is `2`. The four promotion choices can yield zero, one, two, three, or four keys there.

**Answer:** No. Our worked arrangement has A, B, and C on `S₁`: three real keys. That is a possible outcome even though the expectation is two.

</details>

<details>
<summary><strong>Case Study 6: A range after the insertion</strong></summary>

**Question:** After G is added, what does `find_range(6, 16)` report?

**Work:** The lower bound includes A at `6`. Walking `S₀` then reaches B at `8` and G at `12`. C at `16` equals the exclusive stop.

**Answer:** `[(6, "A"), (8, "B"), (12, "G")]`. The range scan starts with an expected logarithmic search and then visits the three reported entries.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Idea | Skip-list meaning | Rectangle-card example |
| :--- | :--- | :--- |
| Bottom level | Stores every key in sorted order. | `S₀: 4, 6, 8, 16`. |
| Higher levels | Store promoted subsets as shortcuts. | B's area `8` appears through `S₂`. |
| Sentinels | Mark the left and right ends; top has only sentinels. | `S₃: −∞, +∞`. |
| Search result | Bottom position with largest key `≤ k`. | `SkipSearch(7)` ends at A's `6`. |
| Insertion | Insert at bottom; each head adds one higher copy. | G at area `12` reaches `S₂` after H, H, T. |
| Replacement | Existing key gets a new value, not a new tower. | Revising B keeps its levels. |
| Deletion | Remove the entire tower. | Deleting G unlinks `12` from three levels. |
| Probability | A key reaches level `i` with probability `2⁻ⁱ`. | Reaching `S₂` requires two heads. |
| Performance | Search and updates are `O(log n)` expected; space is `O(n)` expected. | Shortcuts locate a card without shifting an array of entries. |

**Key takeaway:** Skip lists preserve the sorted-map questions from Section 10.3 while using random shortcut levels and linked updates. Their logarithmic search and update bounds are **expected over coin flips**, and the bottom level always remains the complete ordered catalog.

[🔝 Back to Top](#top)
