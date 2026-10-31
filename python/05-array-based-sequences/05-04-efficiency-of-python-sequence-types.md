<span id="top"></span>

# 5.4 Efficiency of Python's Sequence Types — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.4, printed pages 202–209 (the supplied PDF).<br>
> **Topic:** 5.4 Efficiency of Python's Sequence Types; 5.4.1 Python's List and Tuple Classes; 5.4.2 Python's String Class.<br>
> **Domain Focus:** Searching, rearranging, and reporting the areas of the same rectangular display cards used in the earlier Chapter 5 guides.<br>
> **User Prompt:** Reexplain [`Section 5.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Board](#background)
   - [1. Keep the measurements connected](#background-cards)
   - [2. What does a running-time bound count?](#background-cost)
2. [Part 1: 5.4 Efficiency of Python's Sequence Types](#part-1)
   - [1. One sequence, different costs](#part-1-question)
   - [2. Read the cost symbols](#part-1-notation)
3. [Part 2: 5.4.1 Python's List and Tuple Classes — Reading Sequences](#part-2)
   - [1. Length and indexed access](#part-2-access)
   - [2. Count, index, and membership](#part-2-search)
   - [3. Lexicographic comparisons](#part-2-comparison)
   - [4. Slices, concatenation, and repetition](#part-2-copy)
4. [Part 3: 5.4.1 Python's List and Tuple Classes — Changing Lists](#part-3)
   - [1. Set an item or append a card](#part-3-set-append)
   - [2. Insert a card and shift entries](#part-3-insert)
   - [3. Pop, delete, or remove a card](#part-3-remove)
   - [4. Extend, reverse, and sort](#part-3-extend)
   - [5. Construct a new list efficiently](#part-3-construct)
5. [Part 4: 5.4.2 Python's String Class](#part-4)
   - [1. Scan or create a string](#part-4-scan)
   - [2. Look for a pattern in a string](#part-4-pattern)
   - [3. Compose a report with `join`](#part-4-join)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace its result and costs](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Board

<span id="background-cards"></span>

### 1. Keep the measurements connected

The [Section 5.1](05-01-python-sequence-types.md), [Section 5.2](05-02-low-level-arrays.md), and [Section 5.3](05-03-dynamic-arrays-and-amortization.md) guides use rectangular cards. Each card's area is **width × height**.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

The first four cards have total area **6 + 8 + 16 + 4 = 34 cm²**. Five more *physical* cards repeat some dimensions: `E` is like `A`, `F` like `B`, `G` like `C`, `H` like `D`, and `I` like `A`. Their areas, in display order, are:

```text
Card:   A  B   C  D  E  F   G  H  I
Area:   6  8  16  4  6  8  16  4  6   cm²
Index:  0  1   2  3  4  5   6  7  8
```

Thus nine card areas sum to **34 + 34 + 6 = 74 cm²**. Repeated dimensions do not make two physical cards the same card; labels keep their identities distinct.

<span id="background-cost"></span>

### 2. What does a running-time bound count?

Suppose we want to find a card with area 16 cm². We could inspect the list from the left until we see `16`. Or, if we already know card `C` occupies index `2`, we could read `areas[2]`. Both yield 16, but they do different amounts of work as the list grows.

**Time complexity** describes how the work grows with the input size, rather than giving seconds for one computer. For this guide, a basic comparison, assignment, or reference move counts as one constant-size step. The formulas assume these small integer areas and simple card records; an element with an expensive custom comparison can add its own cost.

> **Mental model:** Ask what the operation must inspect, shift, or copy. The answer usually explains its cost.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 5.4 Efficiency of Python's Sequence Types

<span id="part-1-question"></span>

### 1. One sequence, different costs

A Python `list` supports reading, searching, inserting, deleting, and rearranging. A `tuple` supports many of the same **nonmutating** operations, but its positions cannot be assigned or inserted into. A `str` is also immutable, yet its elements are characters and its methods include text searching and composition.

The book notes that a tuple generally needs less storage than a list of the same length because the tuple does not reserve spare slots for future appends. Exact byte counts depend on the Python implementation and the objects stored in the sequence.

The [Section 5.3 guide](05-03-dynamic-arrays-and-amortization.md) explains why an occasional resize makes one `append` costly while a long series of appends still has constant **amortized** cost per call. Section 5.4 applies that idea to more operations. A front insertion still moves all later entries, even when spare capacity exists; a middle slice still copies its selected entries, even though indexing one entry is constant time.

<span id="part-1-notation"></span>

### 2. Read the cost symbols

| Symbol | Meaning here | Geometry example |
| :----- | :----------- | :--------------- |
| `n` | Number of entries in the sequence before an operation | Nine card areas means `n = 9`. |
| `k` | An index or, in a search, the first matching position | Card `C`'s area first appears at index `2`. |
| `r` | Number of entries in a new slice | `areas[2:5]` has `r = 3` entries. |
| `m` | Length of a second sequence or a string pattern | The pattern `"C16"` has `m = 3`. |
| `O(1)` | Work bounded independently of `n` | Read `areas[2]`. |
| `O(n)` | Work grows at most proportionally to `n` | Inspect every card area once. |
| `O(n log n)` | Typical worst-case sorting bound | Sort many card areas. |

An **amortized** bound applies to a *series* of operations: it spreads occasional resizing work across many cheap calls. It does not promise that every individual call has that bound. `Θ(n)` below means a linear amount of work is both necessary and sufficient in the stated case. These bounds describe growth; they do not predict exact microseconds.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 5.4.1 Python's List and Tuple Classes — Reading Sequences

The operations in this part apply to both `list` and `tuple` when their elements can be compared as needed. The book's Table 5.3 collects their costs. For examples, use `areas = [6, 8, 16, 4]` unless nine cards are named.

<span id="part-2-access"></span>

### 1. Length and indexed access

```python
areas = [6, 8, 16, 4]
fixed_areas = (6, 8, 16, 4)
print(len(areas))       # 4
print(areas[2])        # 16: card C
print(fixed_areas[2])  # 16: same position in a tuple
```

`len` is **O(1)** because the sequence keeps track of its length. Reading `data[j]` is **O(1)** because a position in an array-based sequence can be reached directly. The number of earlier entries does not have to be scanned. Turning a list into a *new* tuple with `tuple(areas)`, however, copies its `n` references and costs **O(n)**; fast tuple indexing begins *after* construction. Calling `tuple` on an existing tuple can return that same tuple in **O(1)**.

<span id="part-2-search"></span>

### 2. Count, index, and membership

```python
areas = [6, 8, 16, 4, 6, 8, 16, 4, 6]
print(areas.count(6))  # 3: cards A, E, and I
print(areas.index(16)) # 2: card C is the first match
print(16 in areas)     # True
print(9 in areas)      # False
```

`count(6)` must inspect all `n` entries to know there is no later match: **Θ(n)**. `index(16)` and `16 in areas` may stop at the first match. If that first match is at index `k`, they inspect at most `k + 1` entries: **O(k + 1)**. If there is no match, set `k = n`: they take **O(n)**; `in` returns `False`, whereas `index` raises `ValueError`.

`index` answers *where* the first match is; `count` answers *how many* matches there are. Neither turns a list into a constant-time lookup structure. The same reasoning holds for a tuple of these areas.

<span id="part-2-comparison"></span>

### 3. Lexicographic comparisons

Sequences compare from left to right. At the first differing pair, that pair decides the ordering. If every shared position matches, the shorter sequence comes first.

```python
areas = [6, 8, 16, 4]
print(areas < [6, 9, 1, 1])  # True: 6 matches, then 8 < 9
print([6, 8] < areas)        # True: matching prefix, shorter list
print(areas == [6, 8, 16, 4])  # True: all four positions match
```

If the first difference is at index `k`, comparison needs **O(k + 1)** element comparisons. If the sequences share an entire prefix, work can reach **O(min(n₁, n₂) + 1)**. Equality and the ordering operators `!=`, `<`, `<=`, `>`, `>=` follow the same left-to-right idea for compatible element types. This is *sequence order*, not a comparison of total card area: `[6, 9]` is greater than `[8, 4]` by total area, but is lexicographically smaller because `6 < 8`.

<span id="part-2-copy"></span>

### 4. Slices, concatenation, and repetition

```python
areas = [6, 8, 16, 4]
print(areas[1:3])       # [8, 16]: two copied entries
print(areas + [6, 8])   # [6, 8, 16, 4, 6, 8]
print(areas * 2)        # [6, 8, 16, 4, 6, 8, 16, 4]
print(areas)            # [6, 8, 16, 4]: unchanged
```

| Operation | Work done | Cost |
| :-------- | :-------- | :--- |
| `data[j:k]` with unit step | Select `r = max(0, k − j)` entries after normalizing bounds; ordinary list and proper tuple slices copy their references | **O(r + 1)**; the book writes **O(k − j + 1)** for ordinary valid bounds. |
| `data1 + data2` | Create a new sequence and copy `n₁ + n₂` references | **O(n₁ + n₂)**. |
| `c * data` | Create a sequence with `c n` references for nonnegative `c` | **O(cn + 1)**, commonly written **O(cn)** when the result is nonempty. |

The slice's **stop index is excluded**. `areas[1:3]` copies positions 1 and 2; it does not inspect every earlier entry. When a slice creates a new sequence, it is a **shallow** copy: if entries were mutable card records, the result would contain references to the same records. A full tuple slice such as `fixed_areas[:]` can reuse the original tuple in CPython. The list-copy behavior was explored in [Section 5.2](05-02-low-level-arrays.md).

For immutable tuples, `+`, repetition, and ordinary nonempty slices also produce tuple results. A tuple cannot grow in place. The core cost lesson is that creating a result with many entries takes time proportional to that result's size.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 5.4.1 Python's List and Tuple Classes — Changing Lists

Only lists support the mutations here. The book's Table 5.4 summarizes these costs. Use the four original card areas to make the shifts easy to see; the same rules apply when `n` is large.

<span id="part-3-set-append"></span>

### 1. Set an item or append a card

Setting `areas[2] = 16` changes one existing position: **O(1)**. It does not insert a new position. If card `E` (area 6 cm²) is added at the end, `areas.append(6)` takes **O(1) amortized** time. Most appends use reserved space; an occasional append must allocate a larger underlying array and move references, which can make that one call **O(n)**.

```text
Before append: [ 6 ][ 8 ][ 16 ][ 4 ]
After append:  [ 6 ][ 8 ][ 16 ][ 4 ][ 6 ]
              A    B     C    D    E
```

For `n` consecutive appends starting from an empty dynamic list, the total is **O(n)** under the amortized model. The exact CPython capacity changes are not assumed here.

<span id="part-3-insert"></span>

### 2. Insert a card and shift entries

`areas.insert(k, value)` makes a new position at index `k`. For an original length `n`, entries from `k` through `n − 1` move one cell right, so there are **n − k shifts**. To avoid overwriting a value, an array implementation shifts from the rightmost entry backward. This is the point of the book's Figure 5.16 and its simplified `DynamicArray.insert` code.

```text
Start:               [ A ][ B ][ C ][ D ]
Insert E at index 2: [ A ][ B ][ E ][ C ][ D ]
Shifted:                         C     D
```

| Insert position in four entries | Entries shifted | Growth with `n` |
| :------------------------------ | --------------: | :-------------- |
| Front, `k = 0` | 4 | **Θ(n)**. |
| Middle, `k = 2` | 2 | **Θ(n)** when `k` stays near the middle. |
| End, `k = 4` | 0 | **O(1) amortized**, like append. |

The book states the general cost as **O(n − k + 1) amortized**. The `+ 1` includes the insertion itself when there are no shifts. A resize may add work to one call, so the bound is amortized over a series of dynamic-array operations. For insertions near the front, shifting already dominates.

The book's Table 5.5 reports historical timings for repeated insertions: front and middle insertion times rise with `n`, while end insertion stays roughly steady on that experiment. The recorded microseconds are measurements from the book's environment, not timing promises for a current interpreter.

<span id="part-3-remove"></span>

### 3. Pop, delete, or remove a card

`pop()` removes and **returns** the last entry, with no left shifts: **O(1) amortized**. An occasional shrink of the underlying array can make one call more costly. `pop(k)` removes and returns the entry at index `k`; the `n − k − 1` later entries shift left. Its cost is **O(n − k) amortized**, including the constant removal work. `del areas[k]` has the same shift pattern but does not return the removed value.

The book's Figure 5.17 illustrates that left shift. Its simplified `DynamicArray.remove` code in Code Fragment 5.6 first searches for a matching value, then shifts the remaining entries to close the gap; that teaching version leaves out array shrinking.

```text
Before pop(1): [ A ][ B ][ C ][ D ]
After pop(1):  [ A ][ C ][ D ]
                       C     D move left
```

`remove(value)` is different: it searches for the **first matching value**, then shifts later entries left. With `n` entries, finding a match at index `k` takes about `k + 1` comparisons and closing the gap takes `n − k − 1` shifts. Their sum grows linearly with `n`; an absent value also requires scanning all `n` entries before `ValueError` is raised. Thus there is no fast position for `remove` in the ordinary model: **Θ(n)**.

```python
areas = [6, 8, 16, 4, 6]
areas.remove(6)
print(areas)  # [8, 16, 4, 6]: removes A's area, not E's
```

If a card's identity matters, store its label with its dimensions. Removing by *area alone* cannot distinguish two physical 6 cm² cards.

<span id="part-3-extend"></span>

### 4. Extend, reverse, and sort

| List operation | What happens to our cards? | Cost |
| :------------- | :------------------------- | :--- |
| `areas.extend(extra)` or `areas += extra` | Append all `m = len(extra)` entries to the existing list. | **O(m) amortized** for a list or similarly sized source. |
| `areas.reverse()` | Swap ends, then work inward. | **O(n)**. |
| `areas.sort()` | Arrange values in ascending order, in place. | **O(n log n)** worst case for ordinary constant-cost comparisons. |

```python
areas = [6, 8, 16, 4]
areas.extend([6, 8])
print(areas)  # [6, 8, 16, 4, 6, 8]
areas.reverse()
print(areas)  # [8, 6, 4, 16, 8, 6]
areas.sort()
print(areas)  # [4, 6, 6, 8, 8, 16]
```

`extend` and a loop of `append` calls have the same **O(m) amortized** growth, but a single `extend` call can have lower overhead and can plan for the incoming list's size. In the book's known-size list model, this means at most one resize for that `extend` call. `areas + extra` instead creates a **new** list and copies both inputs, taking **O(n + m)**. `reverse` and `sort` change the original list; neither returns the sorted or reversed list. The worst-case sorting bound need not describe every input: an already ordered list can be handled more cheaply.

<span id="part-3-construct"></span>

### 5. Construct a new list efficiently

The book also discusses building lists rather than modifying an existing one. If each card record has `(label, width, height)`, a comprehension computes all `n` areas in **O(n)** time when one multiplication is constant cost:

```python
cards = [("A", 2, 3), ("B", 4, 2), ("C", 4, 4), ("D", 2, 2)]
areas = [width * height for _, width, height in cards]
print(areas)  # [6, 8, 16, 4]
```

A loop that calls `append` for each card is also **O(n) total amortized**. The comprehension is often faster in practice because it has less Python-level loop and call overhead. To make `n` zero-valued slots, `[0] * n` creates the list in **O(n)** time. These are new entries that require storage, so construction is not O(1). With mutable elements, repetition shares references rather than making independent inner objects; [Section 5.2](05-02-low-level-arrays.md) explains that aliasing.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 5.4.2 Python's String Class

The card board also has text: labels such as `"ABCD"` and a report such as `"A=6, B=8, C=16, D=4"`. A `str` cannot be changed at a character position. Section 5.4.2 highlights scanning, pattern matching, and assembling a new report.

<span id="part-4-scan"></span>

### 1. Scan or create a string

Let `N` be the number of characters in a string. A condition such as `notes.islower()` can stop once an uppercase character proves the answer is `False`, but in the worst case it may inspect all `N` characters: **O(N)**. String comparisons similarly stop at the first difference and can take **O(N)** when long prefixes match. Methods that create transformed text, such as `capitalize`, `center`, and `strip`, may need to scan the input and allocate output; allow **O(N + L)** when the output has length `L`. In particular, `strip` can read a long input even if its result is short.

```python
notes = "A=6, B=8, C=16, D=4"
print(notes.islower())  # False: the first A is uppercase
print(notes.strip())    # A=6, B=8, C=16, D=4
```

The exact cost of a named string method depends on what it does. The book does not give a separate bound for every string method; it gives these scanning and output-size principles.

<span id="part-4-pattern"></span>

### 2. Look for a pattern in a string

Suppose `labels = "A6|B8|C16|D4"` and we seek the three-character pattern `"C16"`. A straightforward algorithm tries each possible starting position and compares up to `m` pattern characters there. With text length `N` and pattern length `m ≤ N`, there are `N − m + 1` possible starts, giving a worst-case bound **O(m(N − m + 1))**, usually written **O(mN)**.

```python
labels = "A6|B8|C16|D4"
print(labels.find("C16"))  # 6: where the pattern begins
print("C16" in labels)     # True
```

The book lists pattern-related behaviors such as membership, `find`, `index`, `count`, `replace`, and `split`, then previews Chapter 13's better pattern-matching algorithms. A linear-time pattern-search algorithm can achieve **O(N + m)**, or **O(N)** when `m ≤ N`. The **O(mN)** calculation describes the naive algorithm, *not* Python's built-in forward search. The [current CPython complexity table](https://docs.python.org/3.14/builtins/time-complexity.html#str-bytes-bytearray) lists `pattern in text`, `text.find(pattern)`, and `text.index(pattern)` as **O(N)**; other implementations may differ.

<span id="part-4-join"></span>

### 3. Compose a report with `join`

Imagine taking only the alphabetic card labels from a geometry note. A tempting approach starts with `letters = ""` and repeatedly does `letters += character`. In the general immutable-string model, each concatenation builds a new result and copies the growing prefix. For `q` accepted single-character labels, copied lengths add up to

**1 + 2 + ⋯ + q = q(q + 1)/2 = Θ(q²).**

Some CPython versions optimize certain `+=` cases, so a timing experiment need not show a quadratic curve. The general cost model and the book's portable construction method are still useful. Collect pieces, then call `"".join(...)` once:

```python
notes = "A=6, B=8, C=16, D=4"
pieces = [character for character in notes if character.isalpha()]
letters = "".join(pieces)
print(letters)  # ABCD
```

Scanning the `N` input characters costs **O(N)**. The list contains at most `N` accepted characters, and joining them costs time proportional to their total length, at most `N` here. Overall this is **O(N)**. The book also shows `"".join(character for character in notes if character.isalpha())`, which avoids writing an explicit temporary list; an implementation may still buffer pieces internally before joining them.

> **Mental model:** A string cannot be extended in place as a general promise. Build the pieces, then construct the final string once.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. The complete program

This program uses the same nine physical cards. It reads and searches their areas, plans changes with a mutable list, and extracts labels from a short written report. `J`, `K`, and `L` are additional rectangles with areas 10, 9, and 5 cm².

```python
def area(card):
    _, width, height = card
    return width * height


base_cards = [
    ("A", 2, 3), ("B", 4, 2), ("C", 4, 4), ("D", 2, 2)
]
extra_cards = [
    ("E", 2, 3), ("F", 4, 2), ("G", 4, 4),
    ("H", 2, 2), ("I", 2, 3)
]
cards = base_cards + extra_cards
areas = [area(card) for card in cards]
fixed_areas = tuple(areas)

print("areas:", areas)
print("total area:", sum(areas), "cm^2")
print("6 cm^2 cards:", areas.count(6))
print("first 16 cm^2 index:", areas.index(16))
print("C through E areas:", areas[2:5])
print("tuple index 2:", fixed_areas[2])

plan = cards.copy()
plan.insert(0, ("J", 5, 2))
print("front label after insert:", plan[0][0])
removed = plan.pop(0)
plan.remove(("E", 2, 3))
plan.extend([("K", 3, 3), ("L", 5, 1)])
plan.reverse()
plan.sort(key=area)
print("popped label:", removed[0])
print("planned areas:", [area(card) for card in plan])
print("planned total:", sum(area(card) for card in plan), "cm^2")

notes = "A=6, B=8, C=16, D=4"
labels = "".join(character for character in notes if character.isalpha())
print("labels in note:", labels)
```

<span id="part-5-trace"></span>

### 2. Trace its result and costs

```text
areas: [6, 8, 16, 4, 6, 8, 16, 4, 6]
total area: 74 cm^2
6 cm^2 cards: 3
first 16 cm^2 index: 2
C through E areas: [16, 4, 6]
tuple index 2: 16
front label after insert: J
popped label: J
planned areas: [4, 4, 5, 6, 6, 8, 8, 9, 16, 16]
planned total: 82 cm^2
labels in note: ABCD
```

The list concatenation copies four plus five references; the area comprehension then computes nine products. `tuple(areas)` copies nine references once, while `fixed_areas[2]` reads one position. `count(6)` scans all nine areas, but `index(16)` finds `C` after three positions. The slice copies `C`, `D`, and `E`'s areas.

The plan starts with a shallow copy of the nine card records. Front insertion shifts nine references; popping that front entry shifts the nine originals back. Removing `E` searches by its full `(label, width, height)` record, so it does not accidentally remove `A` or `I`, which have the same area. Then `K` and `L` are appended, the list is reversed, and `sort(key=area)` orders the cards by area. Its final area is **74 − 6 + 9 + 5 = 82 cm²**; temporary card `J` was added and then popped, so it contributes nothing to that total.

The final `join` builds `ABCD` from the four letter characters in the note. The examples use small lists so each result can be checked by hand; the complexity statements explain what would happen if the display used thousands of cards.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why is finding card C different from reading index 2?</strong></summary>

With `areas = [6, 8, 16, 4]`, `areas[2]` directly reads 16 in **O(1)**. `areas.index(16)` checks 6, then 8, then 16: three checks. A search for 99 checks all four entries and then raises `ValueError`. For a long list, the known index stays cheap while a search may scan almost everything.

</details>

<details>
<summary><strong>Case Study 2: Does a matching area mean a matching physical card?</strong></summary>

In the nine-card list, `areas.count(6)` is 3 because `A`, `E`, and `I` each measure 6 cm². `areas.index(6)` returns only `0`, the first matching position. If the request is to remove card `E`, remove its labeled record `("E", 2, 3)` from a card-record list. Calling `areas.remove(6)` would remove the first **area value**, associated with `A` in the original order.

</details>

<details>
<summary><strong>Case Study 3: How much work does inserting card E require at each position?</strong></summary>

Start with four cards `A`–`D`. Inserting `E` at index `0` shifts four references; at index `2`, two; at index `4`, none. For `n` cards, the shift count is `n − k`. The result still has one new entry, and an occasional capacity change can add resize work, so the general bound is **O(n − k + 1) amortized**. The geometry area calculation for `E` is the same in all three cases; only its insertion position changes the list work.

</details>

<details>
<summary><strong>Case Study 4: Why can removing the first match take linear time even when it is found immediately?</strong></summary>

For `[6, 8, 16, 4]`, `remove(6)` finds 6 at the first position, then shifts three later values left. `remove(4)` finds the value only after four comparisons, then shifts nothing. Either way the work grows with the four-card list's length; with `n` cards, search plus shifting is **Θ(n)** for ordinary fixed-cost comparisons.

</details>

<details>
<summary><strong>Case Study 5: Which operation should add another group of cards?</strong></summary>

If `areas` has `n` values and `extra` has `m`, `areas + extra` builds a **new** list of `n + m` values in **O(n + m)**. `areas.extend(extra)` changes `areas` and costs **O(m) amortized** when `extra` is a list. Starting empty and repeating `areas = areas + [new_area]` for `q` cards recopies prefixes of lengths 1 through `q`, for **Θ(q²)** total work. A series of `q` `append` calls has **O(q)** total amortized cost.

</details>

<details>
<summary><strong>Case Study 6: How should the label-only report be assembled?</strong></summary>

From `"A=6, B=8, C=16, D=4"`, keep alphabetic characters to obtain `"ABCD"`. Repeated immutable concatenation models copy lengths 1 + 2 + 3 + 4 = 10 for these four letters, and **Θ(q²)** over `q` accepted letters in the general case. Scanning the note and joining its selected characters once takes **O(N)** for a note of `N` characters. Some CPython concatenation cases are optimized, so the formula is a general model rather than a promised benchmark result.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Question to ask | Section 5.4 answer |
| :-------------- | :----------------- |
| Is the position known? | `len(data)` and `data[j]` are **O(1)**; searching may scan **O(n)** entries. |
| Does it create a new sequence? | Slicing, `+`, and repetition take time proportional to the result's size. |
| Does a list edit move later entries? | Front and middle insertions or deletions shift entries; inserting or popping by index at the end is **O(1) amortized**. |
| Is a value removed by index or by match? | `pop(k)` knows its position; `remove(value)` must search and then close the gap. |
| Is an existing list being extended or a new one built? | `extend` is **O(m) amortized** for `m` incoming entries; list `+` copies both operands. |
| Is text being accumulated repeatedly? | In the general immutable-string model, repeated concatenation can be quadratic; collect pieces and `join` once for linear construction. |

The costs in the book are algorithmic models. Current [Python documentation on built-in operation complexity](https://docs.python.org/3.14/builtins/time-complexity.html) lists CPython's exact built-in types and notes that other implementations or subclasses can differ. The [Python FAQ on string concatenation](https://docs.python.org/3.14/faq/programming.html#what-is-the-most-efficient-way-to-concatenate-many-strings-together) likewise recommends collecting pieces and using `join` for the general case.

> **Final mental model:** A known position is direct; an unknown value requires a search; changing the middle shifts entries; making a new sequence copies entries; and assembling immutable text repeatedly may copy the growing result again and again.

[🔝 Back to Top](#top)
