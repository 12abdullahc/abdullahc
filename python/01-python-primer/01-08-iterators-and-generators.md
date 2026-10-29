<span id="top"></span>

# 1.8 Iterators and Generators — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.8, printed pages 39–41 (the supplied PDF).  
> **Topic:** Iterables and iterators; lazy `range` and dictionary views; generators, factors, and Fibonacci numbers.  
> **Domain Focus:** Reading rectangular-card requests one at a time and generating possible integer dimensions for an area.  
> **User Prompt:** Reexplain Section 1.8 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The same cards and requests](#background-cards)
   - [2. Two kinds of one-at-a-time work](#background-streams)
2. [Part 1: 1.8 Iterators and Generators — The Iteration Mechanism](#part-1)
   - [1. Many objects can supply a sequence of values](#iterable-sources)
   - [2. An iterable supplies an iterator](#iterable-iterator)
   - [3. The for loop handles the stopping point](#for-loop)
   - [4. Separate iterators have separate positions](#independent-iterators)
3. [Part 2: Lazy Iterable Objects](#part-2)
   - [1. range represents many positions without a list](#range)
   - [2. Dictionary views show current contents](#dictionary-views)
4. [Part 3: Generators](#part-3)
   - [1. Return a whole list or yield one result at a time](#list-versus-generator)
   - [2. A generator pauses and resumes](#yield)
   - [3. Find factor pairs more efficiently](#paired-factors)
   - [4. A generator can describe an endless sequence](#fibonacci)
5. [Part 4: One Connected Geometry Program](#part-4)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The same cards and requests

Students cut rectangular cards for a display board. For each card, **area = width × height**.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The request `["A", "C", "A"]` names **three physical cards**, not two different card types. Its total area is `6 + 16 + 6 = 28` cm²; its average area is about `9.33` cm² per card. We will also see `"?"` as an unknown label that gets skipped.

<span id="background-streams"></span>

### 2. Two kinds of one-at-a-time work

A program can **read existing requests** one at a time: first A, then C, then A. It can also **calculate new answers** one at a time. For example, an area of 16 cm² can be formed by integer side-length pairs `1 × 16`, `2 × 8`, and `4 × 4` (and the reversed orientations).

A factor of an area is a positive whole number that divides the area evenly. If `width` is a factor of `area`, then `height = area // width` is a whole number. The operator `//` means integer division, and `area % width == 0` tests whether the division has no remainder.

| Question | One-at-a-time source |
| :--- | :--- |
| Which card is requested next? | An iterator over the request list. |
| Which integer side length works next? | A generator testing factors of the area. |

> **Mental model:** An **iterable** can hand out a cursor. An **iterator** is the cursor that remembers the next position. A **generator** is an iterator whose code calculates the next result when asked.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.8 Iterators and Generators — The Iteration Mechanism

<span id="iterable-sources"></span>

### 1. Many objects can supply a sequence of values

Section 1.4 used `for element in iterable:`. An **iterable** is an object from which Python can obtain an iterator. It need not be a list.

| Iterable | What a card program receives when it loops |
| :--- | :--- |
| List or tuple | Each requested card label in sequence. |
| Set | Each distinct label, with no promised order. |
| String | Each character; `"ACA"` gives `"A"`, `"C"`, `"A"`. |
| Dictionary | Each key; a card catalog yields labels such as `"A"`. |
| File | Each text line, such as a saved card record. |
| `range` | Each position in a numerical range. |

User-defined classes can also support iteration. For now, the list of requests is the simplest example:

```python
requests = ["A", "C", "A"]

for label in requests:
    print(label)

# A
# C
# A
```

The repeated A remains present because a list keeps both requests. A set would discard that repetition, which would give the wrong physical-card count.

<span id="iterable-iterator"></span>

### 2. An iterable supplies an iterator

An **iterator** manages progress through values. `iter(requests)` gets one for the list; each `next(cursor)` asks for the following label. When nothing remains, `next` raises `StopIteration`.

```python
requests = ["A", "C", "A"]
cursor = iter(requests)

print(next(cursor))  # A
print(next(cursor))  # C
print(next(cursor))  # A

try:
    print(next(cursor))
except StopIteration:
    print("There are no more requests.")
```

The list is **iterable**, but the list itself is not an iterator. Thus `next(requests)` raises `TypeError`; `next(iter(requests))` works. The iterator remembers where it stopped. These two calls show the distinction:

```python
requests = ["A", "C", "A"]

try:
    next(requests)
except TypeError:
    print("A list needs iter() before next().")

print(next(iter(requests)))  # A
```

A fresh call to `iter(requests)` makes a fresh cursor at the beginning.

<span id="for-loop"></span>

### 3. The for loop handles the stopping point

A `for` loop gets an iterator, repeatedly asks it for the next element, and stops when the iterator is exhausted. Conceptually, this manual loop does the same work:

```python
requests = ["A", "C", "A"]
cursor = iter(requests)

while True:
    try:
        label = next(cursor)
    except StopIteration:
        break
    print(label)

# A
# C
# A
```

In ordinary code, `for label in requests:` is clearer. Python handles the `StopIteration` internally, so reaching the end of a normal `for` loop does not display an error. The exception becomes visible when we call `next` ourselves without handling exhaustion.

<span id="independent-iterators"></span>

### 4. Separate iterators have separate positions

Two calls to `iter` on the same list create two cursors. Advancing one does not advance the other.

```python
requests = ["A", "C", "A"]
first = iter(requests)
second = iter(requests)

print(next(first))   # A
print(next(first))   # C
print(next(second))  # A: second is still near the beginning.
print(next(first))   # A
```

A list iterator normally refers back to its original list rather than copying every item. If an unvisited list entry changes, the iterator can see the new value:

```python
requests = ["A", "C"]
cursor = iter(requests)

print(next(cursor))  # A
requests[1] = "B"
print(next(cursor))  # B
```

This is useful for understanding what the iterator holds, but changing a collection during a traversal can make results surprising. Keep the requests stable while processing them when predictable results matter.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Lazy Iterable Objects

<span id="range"></span>

### 1. range represents many positions without a list

`range(1_000_000)` is an iterable `range` object, not a list containing one million integers. It stores the information needed to produce positions as they are requested. This is called **lazy evaluation**: do work only when a value is needed.

```python
positions = range(1_000_000)
cursor = iter(positions)

print(type(positions).__name__)  # range
print(len(positions))            # 1000000
print(next(cursor))              # 0
print(next(cursor))              # 1
```

If a card program stops after the first two positions, it has not built a million-element list. `list(range(1_000_000))` would explicitly build that list. `tuple(iterable)` and `set(iterable)` can also collect results; a set removes repeats, so it would lose a second A request. For three requests, `range(len(requests))` can provide positions `0`, `1`, and `2`; a direct `for label in requests` is simpler when positions are not needed.

<span id="dictionary-views"></span>

### 2. Dictionary views show current contents

Dictionary methods `keys()`, `values()`, and `items()` return iterable **views** of labels, values, and label-value pairs. A view is connected to the dictionary. It is not a separate list of its entries.

```python
areas = {"A": 6, "B": 8}
current_areas = areas.values()
saved_areas = list(current_areas)

areas["C"] = 16

print(list(current_areas))  # [6, 8, 16]
print(saved_areas)           # [6, 8]
print(list(areas.keys()))    # ['A', 'B', 'C']
print(list(areas.items()))   # [('A', 6), ('B', 8), ('C', 16)]
```

The view sees C because we changed the dictionary **before** traversing the view. The earlier list remains a snapshot. If you add or remove dictionary keys *during* an active traversal, Python may raise `RuntimeError`; finish or restart that traversal instead.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Generators

<span id="list-versus-generator"></span>

### 1. Return a whole list or yield one result at a time

The book introduces generators by finding the factors of a positive integer. In our geometry setting, factors are possible **integer side lengths** for a rectangle of that area. C's area is 16 cm², so valid lengths include 1, 2, 4, 8, and 16 cm. C itself is still the `4 × 4` card; other pairs describe other rectangles with the same area.

A regular function can build and return all widths at once. A generator function uses `yield` to provide each width as requested:

```python
def widths_as_list(area):
    widths = []
    for width in range(1, area + 1):
        if area % width == 0:
            widths.append(width)
    return widths

def widths_as_generator(area):
    for width in range(1, area + 1):
        if area % width == 0:
            yield width

print(widths_as_list(16))             # [1, 2, 4, 8, 16]
print(list(widths_as_generator(16)))  # [1, 2, 4, 8, 16]
```

Both produce the same values here. The first builds a list before returning. The second returns a generator object immediately; `list(...)` then asks it for every value and builds a list. Without `list(...)`, a loop can use each width as it arrives.

<span id="yield"></span>

### 2. A generator pauses and resumes

A function containing `yield` is a **generator function**. Calling it creates a generator object but does not run its body yet. `next` begins execution until the first `yield`. The generator then pauses, remembering its local values and where to resume.

```python
def selected_widths():
    print("Reading A")
    yield 2
    print("Reading C")
    yield 4

cursor = selected_widths()
print("Generator created")
print(next(cursor))
print(next(cursor))

# Generator created
# Reading A
# 2
# Reading C
# 4
```

The first `next` prints “Reading A” and yields A's width, 2 cm. The second resumes **after** that `yield`, prints “Reading C,” and yields 4 cm. A further `next` raises `StopIteration` because the function has reached its end. A `for` loop stops there automatically.

A bare `return` can end a generator early. The book says that a generator cannot use `return` with a value; that restriction is historical. In current Python, `return value` is allowed: it ends the generator and places the value in `StopIteration.value`. The value is **not** another item yielded to a normal `for` loop. See the [Python language reference](https://docs.python.org/3/reference/simple_stmts.html#the-return-statement).

<span id="paired-factors"></span>

### 3. Find factor pairs more efficiently

The first factor generator tests every number up to the area. Factors come in pairs: if `width` divides `area`, then `area // width` is its partner. In each pair, at least one factor is at or below the square root; otherwise their product would exceed the area. We therefore test only that far. For a perfect square such as 16, the middle factor 4 must be yielded **once**. Here `area` is assumed to be a positive whole number.

```python
def factor_widths(area):
    width = 1
    while width * width < area:
        if area % width == 0:
            yield width
            yield area // width
        width += 1
    if width * width == area:
        yield width

print(list(factor_widths(16)))  # [1, 16, 2, 8, 4]
print(list(factor_widths(28)))  # [1, 28, 2, 14, 4, 7]
```

For 16 cm², the output corresponds to widths 1, 16, 2, 8, and 4 cm. Each gives an integer height via `16 // width`. The order is **not sorted** because each small factor is followed immediately by its larger partner. For 28 cm², the factors give possible integer dimensions for a single display rectangle with the same area as our three selected cards.

<span id="fibonacci"></span>

### 4. A generator can describe an endless sequence

Because values are calculated only when requested, a generator can describe a sequence with no planned end. The book's example is the Fibonacci sequence: each new number is the sum of the previous two.

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

numbers = fibonacci()
for _ in range(7):
    print(next(numbers), end=" ")
print()

# 0 1 1 2 3 5 8
```

The loop asks for only seven terms, so it finishes even though the generator could continue. Positive Fibonacci numbers could serve as side lengths for a series of square tiles; the initial zero is a mathematical term, not a physical tile. An unrestricted `for` loop or `list(fibonacci())` would not finish on its own.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This program reads requests one at a time, yields accepted card areas, and uses another generator to find integer dimensions for a display rectangle with the same **total area**.

```python
CARD_SIZES = {
    "A": (2, 3),
    "B": (4, 2),
    "C": (4, 4),
}

def card_areas(labels):
    for label in labels:
        if label not in CARD_SIZES:
            print("Skipped unknown label:", label)
            continue
        width, height = CARD_SIZES[label]
        yield label, width * height

def factor_widths(area):
    width = 1
    while width * width < area:
        if area % width == 0:
            yield width
            yield area // width
        width += 1
    if width * width == area:
        yield width

requests = ["A", "C", "?", "A"]
area_stream = card_areas(requests)
print("Area stream created.")

total_area = 0
accepted_count = 0
for label, area in area_stream:
    print(label, "area:", area, "cm²")
    total_area += area
    accepted_count += 1

print("Accepted cards:", accepted_count)
print("Total area:", total_area, "cm²")

if accepted_count > 0:
    print("Average area:", round(total_area / accepted_count, 2), "cm²")
    print("Possible display dimensions:")
    for width in factor_widths(total_area):
        print(width, "cm ×", total_area // width, "cm")
else:
    print("No average or display dimensions: no cards were accepted.")

# Area stream created.
# A area: 6 cm²
# C area: 16 cm²
# Skipped unknown label: ?
# A area: 6 cm²
# Accepted cards: 3
# Total area: 28 cm²
# Average area: 9.33 cm²
# Possible display dimensions:
# 1 cm × 28 cm
# 28 cm × 1 cm
# 2 cm × 14 cm
# 14 cm × 2 cm
# 4 cm × 7 cm
# 7 cm × 4 cm
```

Creating `area_stream` does not process a card. The `for` loop starts it, skips `"?"`, and consumes the remaining labels. Two A requests contribute two areas of 6 cm². The second generator calculates dimension pairs only after the total area of 28 cm² is known.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: a list is iterable, but next needs an iterator</strong></summary>

**Scenario.** The workshop has the request list `["A", "C", "A"]` and wants its first label.

```python
requests = ["A", "C", "A"]

try:
    next(requests)
except TypeError:
    print("Get an iterator first.")

cursor = iter(requests)
print(next(cursor))  # A
```

**Check.** `iter(requests)` creates the cursor. `next(cursor)` advances that cursor by one request.

</details>

<details>
<summary><strong>Case Study 2: a finished iterator does not restart itself</strong></summary>

**Scenario.** The label A is requested twice, but the first cursor has already reached the end.

```python
choices = ["A"]
cursor = iter(choices)

print(next(cursor))  # A
try:
    next(cursor)
except StopIteration:
    print("That cursor is finished.")

print(next(iter(choices)))  # A again, using a new cursor.
```

**Check.** Make a new iterator from the list to start another pass. A generator that has been exhausted likewise cannot be reset; call its generator function again to make a new one.

</details>

<details>
<summary><strong>Case Study 3: a live view differs from a saved list</strong></summary>

**Scenario.** The catalog initially has A and B. The workshop adds C after saving a list of areas.

```python
areas = {"A": 6, "B": 8}
view = areas.values()
saved = list(view)

areas["C"] = 16

print(list(view))  # [6, 8, 16]
print(saved)       # [6, 8]
```

**Check.** The view reflects the current dictionary. The list keeps the earlier values.

</details>

<details>
<summary><strong>Case Study 4: a square area has one middle factor</strong></summary>

**Scenario.** Card C has area 16 cm². The two factors meet at 4 because `4 × 4 = 16`.

```python
def factor_widths(area):
    width = 1
    while width * width < area:
        if area % width == 0:
            yield width
            yield area // width
        width += 1
    if width * width == area:
        yield width

print(list(factor_widths(16)))  # [1, 16, 2, 8, 4]
```

**Check.** The final `if` yields 4 once. Yielding both `width` and `area // width` at that point would repeat 4.

</details>

<details>
<summary><strong>Case Study 5: take only a finite set of square-tile sizes</strong></summary>

**Scenario.** Fibonacci numbers suggest possible side lengths for future square tiles. Ignore the initial zero and use the next five values.

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

sides = fibonacci()
next(sides)  # Skip zero: a zero-width physical tile is not useful.

for _ in range(5):
    side = next(sides)
    print(side, "cm side:", side * side, "cm² area")

# 1 cm side: 1 cm² area
# 1 cm side: 1 cm² area
# 2 cm side: 4 cm² area
# 3 cm side: 9 cm² area
# 5 cm side: 25 cm² area
```

**Check.** The first two positive terms are both 1, so the 1 cm tile size appears twice. The generator could continue indefinitely; asking for five positive terms makes this calculation finite.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 1.8 idea | What it means | Rectangle-card example |
| :--- | :--- | :--- |
| Iterable | An object that can supply an iterator. | `["A", "C", "A"]` can supply a cursor over three requests. |
| Iterator | An object that remembers progress and supplies the next value. | `next(cursor)` returns A, then C, then A. |
| `StopIteration` | Signals that an iterator has no further values. | A fourth manual `next` call finds no request. |
| `for` loop | Obtains an iterator and handles exhaustion automatically. | Process each requested card without managing `StopIteration`. |
| Independent cursors | Separate iterators can traverse the same iterable at different positions. | One cursor may be at C while another is still at A. |
| Lazy `range` | Represents numeric positions without storing a list of every integer. | Generate card positions as a loop needs them. |
| Dictionary view | An iterable view reflects the dictionary's current contents. | `areas.values()` sees C after C is added. |
| `yield` and generator | Produce one value, pause, then resume for the next request. | Yield each accepted card's area or each valid factor width. |
| Paired factors | Test widths up to the square root and yield each paired factor. | Area 16 gives `1, 16, 2, 8, 4`; the 4 appears once. |
| Infinite generator | Can keep producing values while a consumer takes a finite prefix. | Take five positive Fibonacci side lengths for square tiles. |

[🔝 Back to Top](#top)
