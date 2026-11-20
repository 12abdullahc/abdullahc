<span id="top"></span>

# Object-Oriented Programming — Section 2.3: Class Definitions

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.3, printed pages 69–81 of the supplied PDF.  
> **Topic:** Section 2.3; 2.3.1 CreditCard; 2.3.2 Operator Overloading and Python's Special Methods; 2.3.3 Multidimensional Vector; 2.3.4 Iterators; 2.3.5 Range.  
> **Domain focus:** The **MotoGP Practice session at the 2026 Indonesian Grand Prix**, Friday 9 October, at Mandalika.  
> **Learning goal:** Build small classes, understand the syntax Python calls behind operators and loops, and trace one complete timing-display program.  
> **User Prompt:** "Reexplain [Section 2.3] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Friday Practice Display](#background-intuition)
   - [1. The verified results and units](#background-data)
   - [2. The teaching display](#background-display)
2. [Part 1: Section 2.3 — From a Class Plan to Objects](#part-1)
3. [Part 2: Section 2.3.1 — The CreditCard Class](#part-2)
   - [1. Understand the book's stateful example](#part-2-book)
   - [2. Read `class`, `self`, and `__init__`](#part-2-constructor)
   - [3. Protect state with public operations](#part-2-state)
   - [4. Check the rejected branch](#part-2-branch)
4. [Part 3: Section 2.3.2 — Operator Overloading and Special Methods](#part-3)
   - [1. Translate syntax into method calls](#part-3-methods)
   - [2. Reflected operations and defaults](#part-3-defaults)
5. [Part 4: Section 2.3.3 — A Multidimensional Vector](#part-4)
   - [1. Distinguish vector addition from list concatenation](#part-4-meaning)
   - [2. Implement coordinate operations](#part-4-implementation)
   - [3. Use a two-coordinate Practice gap vector](#part-4-gaps)
6. [Part 5: Section 2.3.4 — Iterators](#part-5)
   - [1. Follow `iter`, `next`, and `StopIteration`](#part-5-protocol)
   - [2. Compare an iterator with a generator](#part-5-generator)
7. [Part 6: Section 2.3.5 — The Range Class](#part-6)
   - [1. Represent chart marks without storing a list](#part-6-lazy)
   - [2. Calculate length and indexes, including reverse steps](#part-6-indexing)
8. [Part 7: Complete Practice-Display Program](#part-7)
   - [1. Run the program](#part-7-program)
   - [2. Trace its output](#part-7-trace)
9. [Part 8: Small Cases to Solve Yourself](#part-8)
10. [Part 9: Summary](#part-9)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Friday Practice Display

<span id="background-data"></span>

### 1. The verified results and units

We use **Friday MotoGP Practice** at the 2026 Indonesian Grand Prix. The [Yamaha Factory Racing Practice classification](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) supplies these riders, teams, positions, and fastest laps; the [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) confirms Raúl Fernández was fastest.

| Official Practice place | Rider | Team | Best lap | Milliseconds | Difference from Raúl |
| :---: | :--- | :--- | ---: | ---: | ---: |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | 88,725 | +0.000 s |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | 89,426 | +0.701 s |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP | 1:29.558 | 89,558 | +0.833 s |

The last column is **calculated** from the best laps: `89,426 − 88,725 = 701 ms` for Marc and `89,558 − 88,725 = 833 ms` for Fabio. One second has 1,000 milliseconds. Fabio's lap was `89,558 − 89,426 = 132 ms`, or `0.132 s`, longer than Marc's. These are Practice best-lap differences, not Sprint or race finish gaps.

**Why this example?** All three riders took part in the same session, so their best laps can be compared directly. **How to solve it:** convert the displayed `m:ss.sss` times to milliseconds, subtract in that unit, then divide by 1,000 when displaying seconds.

<span id="background-display"></span>

### 2. The teaching display

Imagine a **two-slot comparison display**. An analyst selects Marc and Fabio to show beside Raúl's P1 reference lap. The display can accept two selected result objects; a third addition is refused until one is removed. A pair of numbers, `<701, 833>`, can hold Marc's and Fabio's differences from Raúl in milliseconds. A chart scale can mark `0, 250, 500, 750, 1000` milliseconds.

The **two-slot limit** and **chart marks** are teaching choices, not MotoGP rules or recorded results. The rider names, teams, official places, and best laps are the sourced facts. This one display gives us simple reasons to define a stateful class, overload an operator, visit items one at a time, and represent an evenly spaced sequence.

```text
Real Practice results → selected result objects → gap vector → chart marks
                        (two-slot display)      (Marc, Fabio)   (0 to 1000 ms)
```

**Why this example?** Each new class answers one visible need in the same small task. **How to design it:** keep source data separate from display rules, decide what each object owns, then check each operation against the hand-calculated gaps above.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 2.3 — From a Class Plan to Objects

A **class** defines behavior shared by a kind of object. An **instance** is one object created from that class, with its own state. The preceding section planned responsibilities; Section 2.3 shows the Python definitions that make the plan executable.

| Class | One instance | State kept by that instance | Public behavior |
| :--- | :--- | :--- | :--- |
| `PracticeResult` | Marc's Friday result | Rider, team, session, 89,426 ms | `lap_seconds()`, `difference_ms(...)` |
| `ComparisonBoard` | A two-slot display | Capacity 2, selected riders | `add()`, `remove()`, indexing |
| `Vector` | Marc/Fabio gap pair | Coordinates 701 and 833 ms | Indexing, `+`, equality |
| `Range` | Chart scale | Start 0, step 250, length 5 | Length and indexed marks |

Two separate `ComparisonBoard(2)` objects start empty independently. Adding Marc to one does not add him to the other. The class supplies the same methods to both; `self` lets each method work with the particular instance on which it was called.

**Why this example?** It separates the shared definition from each object's changing state. **How to read a class:** identify the instance fields created in `__init__`, then identify the methods that use those fields without requiring callers to manipulate them directly.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 2.3.1 — The CreditCard Class

<span id="part-2-book"></span>

### 1. Understand the book's stateful example

The book implements the `CreditCard` class previewed in Section 2.2. Each card holds a customer, bank, account number, credit limit, and current balance. Accessor methods report those values. `charge(price)` returns `False` when a proposed charge would exceed the limit; otherwise it increases the balance and returns `True`. `make_payment(amount)` lowers the balance.

Our two-slot `ComparisonBoard` uses the same **check before changing state** shape:

| Book's `CreditCard` | Teaching `ComparisonBoard` |
| :--- | :--- |
| Credit limit | Two display slots. |
| Balance | Number of selected riders. |
| `charge(price)` can be refused. | `add(result)` returns `False` if both slots are full. |
| `make_payment(amount)` lowers a balance. | `remove(result)` frees a slot. |

This is a comparison of class mechanics, not a conversion between money and lap time. The display capacity is hypothetical. The actual `CreditCard` example teaches how methods protect state and communicate success or refusal.

**Why this example?** A visible two-slot limit makes the book's accepted and rejected updates easy to trace. **How to solve an update:** compute whether the new state is allowed; if it is not, return `False` without changing fields; otherwise update the object's fields and return `True`.

<span id="part-2-constructor"></span>

### 2. Read `class`, `self`, and `__init__`

This shortened definition shows the syntax; Part 7 contains the full runnable class:

```python
class ComparisonBoard:
    def __init__(self, capacity):
        self._capacity = capacity
        self._selected = []

    def count(self):
        return len(self._selected)
```

`class ComparisonBoard:` begins a class body. A method is a function defined inside that body. Its first parameter, conventionally `self`, refers to the instance receiving the call. `__init__` initializes each new instance: `self._capacity` and `self._selected` belong to that board, while `capacity` is only the input parameter. The leading underscore asks other code to treat these fields as internal.

```python
first = ComparisonBoard(2)
second = ComparisonBoard(2)
first.add(marc)                 # add() is in the complete class below
print(first.count())           # 1
print(second.count())          # 0
```

When the caller writes `first.count()`, Python supplies `first` as the `self` argument to `count(self)`. The book calls `__init__` a constructor; more precisely, Python calls it to **initialize** a newly created object.

**Why this example?** Two boards make independent instance state visible. **How to trace it:** after each call, name the receiving object, find its `_selected` list, and update only that list.

<span id="part-2-state"></span>

### 3. Protect state with public operations

The book's card exposes **accessors** such as `get_balance()` and controlled updates such as `charge()` and `make_payment()`. In our display, `count()` reads the number selected, while `add()` and `remove()` change the selection. Callers should not append directly to `board._selected`, because that would bypass the two-slot rule. A single underscore is a **Python convention**, not a privacy barrier.

```text
Start:             []                       count 0
add(Marc):         [Marc]                   count 1, True
add(Fabio):        [Marc, Fabio]            count 2, True
add(Raúl):         [Marc, Fabio]            count 2, False
remove(Marc):      [Fabio]                  count 1
add(Raúl):         [Fabio, Raúl]            count 2, True
```

The two-slot display changes **which results are selected**; it never changes Marc's, Fabio's, or Raúl's recorded best lap. In the full class, `remove()` uses list removal, which raises `ValueError` if the specified object is absent.

**Why this example?** It shows the distinction between an object's state and the data in other objects it refers to. **How to solve the trace:** write the selected list before the call, check the capacity condition, then write the list and return value afterward.

<span id="part-2-branch"></span>

### 4. Check the rejected branch

The book notes that its introductory `CreditCard` implementation leaves some input validation to clients. For example, a negative charge is not rejected by that simple class. Its wallet demonstration calls the methods but does not exercise every branch of `charge()`: a rejected charge deserves a test too. Our full `ComparisonBoard` checks that capacity is a positive integer, then tries both a successful and a refused `add()`.

```python
board = ComparisonBoard(2)
assert board.add(marc) is True
assert board.add(fabio) is True
assert board.add(raul) is False
assert board.count() == 2
```

Here the assertion after rejection is essential: returning `False` alone is insufficient if the failed call still changed the list. The names `marc`, `fabio`, and `raul` refer to the verified Practice result objects created in Part 7.

**Why this example?** The rejected path tests the rule that makes this class useful. **How to solve it:** test a board below capacity, at capacity, and after a refusal; compare both the return values and the stored count.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 2.3.2 — Operator Overloading and Special Methods

<span id="part-3-methods"></span>

### 1. Translate syntax into method calls

**Operator overloading** gives familiar Python syntax a meaning for a user-defined class. A **special method** has two underscores on each side of its name. The book's Table 2.1 surveys many families, including arithmetic, comparisons, indexing, membership, conversions, hashing, and iteration. These are the ones used in our display:

| Expression | Special method | Meaning here |
| :--- | :--- | :--- |
| `len(board)` | `board.__len__()` | Number of selected riders. |
| `board[0]` | `board.__getitem__(0)` | First selected result, Marc. |
| `gaps[0] = 701` | `gaps.__setitem__(0, 701)` | Set Marc's coordinate in milliseconds. |
| `gaps + change` | `gaps.__add__(change)` | Add corresponding coordinates. |
| `gaps == copy` | `gaps.__eq__(copy)` | Compare coordinate values. |
| `str(gaps)` | `gaps.__str__()` | Display `<701, 833>`. |
| `iter(sequence)` | `sequence.__iter__()` when supplied | Obtain an iterator. |
| `next(iterator)` | `iterator.__next__()` | Obtain the next item. |

The object before the dot receives `self`. `len(board)` is written as a built-in call, but Python consults the board's `__len__`. A class should define only operations that have a clear meaning for its objects; `Vector` has coordinate addition, while adding two boards would need a separate, stated rule.

**Why this example?** Each expression is used later in the same program. **How to read overloaded syntax:** identify the left operand, look up the corresponding special method, then check that method's return value, validation, and unit.

<span id="part-3-defaults"></span>

### 2. Reflected operations and defaults

For `left + right`, Python normally tries the left object's `__add__`. If that method returns `NotImplemented` for an unsupported type, Python may try the right object's reflected `__radd__`. For example, a vector class could define `__rmul__` to support `2 * gaps` when an integer cannot multiply the vector itself. In-place `+=` has a separate `__iadd__` hook before ordinary addition behavior. We do not need those extra operations for the Practice display.

With no custom `__eq__`, two separate user-defined objects normally compare by **identity**. `gaps is copy` asks whether they are the same object; `gaps == copy` can compare coordinates after `Vector.__eq__` defines that meaning. The book writes both `__eq__` and `__ne__` for its vector. In [current Python's data model](https://docs.python.org/3/reference/datamodel.html#object.__eq__), inherited `object.__ne__` normally delegates to `__eq__` and inverts a valid result; our full class implements `__ne__` explicitly to make the rule visible. Defining `__eq__` without a compatible `__hash__` also makes this mutable vector unhashable, so it is not a dictionary key.

`__len__` and integer `__getitem__` can let Python iterate over a sequence even when no `__iter__` is written. Python asks for indexes `0, 1, ...` until `__getitem__` raises `IndexError`; `__len__` helps with length but is not required for that older fallback. An explicit `__iter__` is the clearer interface for a purpose-built iterator. Indexing with a slice such as `gaps[0:2]` passes a `slice` object; the small `Vector` and `Range` classes below support integer indexes only.

Other defaults matter too. `if board:` uses `__bool__` when a class defines it; otherwise `__len__` makes an empty board false and a nonempty board true. `marc in board` uses `__contains__` when available, or searches by iteration when it is absent; our board's indexed iteration supplies that fallback. Comparisons have their own methods: defining `__lt__` for `<` and `__eq__` for `==` does **not** automatically supply `__le__` for `<=`. Check the operation the program actually uses rather than assuming one method defines a whole family.

**Why these examples?** They prevent the common assumption that defining one operator supplies every related operation. **How to solve an operator question:** check the exact method Python seeks, decide what it means for the class, return `NotImplemented` for an unsupported operand where appropriate, and test the syntax itself.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 2.3.3 — A Multidimensional Vector

<span id="part-4-meaning"></span>

### 1. Distinguish vector addition from list concatenation

The book's `Vector` stores a list of coordinates, but gives `+` a mathematical **coordinate-by-coordinate** meaning. Python's list `+` joins lists instead:

```python
print([89426, 89558] + [-88725, -88725])
# [89426, 89558, -88725, -88725]
```

That four-item list is not a pair of lap differences. For a two-coordinate vector ordered as **Marc, Fabio**, the useful calculation is:

```text
best laps (ms)        <89426, 89558>
reference offsets  +  <-88725, -88725>
                     ------------------
differences (ms)      <701, 833>
```

The negative values are the arithmetic operation “subtract Raúl's `88,725 ms` from each coordinate”; they are **not** negative recorded lap times. The order of the two coordinates must stay fixed or the vector loses its rider meaning.

**Why this example?** It uses only verified lap values while making list concatenation and vector addition visibly different. **How to solve it:** label the coordinate order, put comparable millisecond values in each vector, then add coordinates at the same index.

<span id="part-4-implementation"></span>

### 2. Implement coordinate operations

Like the book's example, our `Vector(dimension)` starts with `dimension` zero coordinates in an internal list. The class defines these public behaviors:

| Method | Promise | Practice example |
| :--- | :--- | :--- |
| `__len__()` | Return the number of coordinates. | `len(gaps)` is `2`. |
| `__getitem__(j)` | Return coordinate `j`. | `gaps[0]` is Marc's `701 ms`. |
| `__setitem__(j, value)` | Change coordinate `j`. | `laps[1] = 89558` stores Fabio's time. |
| `__add__(other)` | Return a **new** vector with matching coordinates added. | `<89426, 89558> + <-88725, -88725>`. |
| `__eq__()` and `__ne__()` | Compare coordinate values. | A distinct vector `<701, 833>` can equal `gaps`. |
| `__str__()` | Make a readable string. | `str(gaps)` is `<701, 833>`. |

The heart of `__add__` is a loop over matching indexes:

```python
answer = Vector(len(self))
for j in range(len(self)):
    answer[j] = self[j] + other[j]
return answer
```

Before the loop, check that `other` has the same length. A two-coordinate result plus a three-coordinate result has no coordinate-by-coordinate answer under this contract, so the method raises `ValueError`. `answer` is a new object; neither input vector is overwritten. The book's version can add another indexed sequence of the same length because it relies on `len(other)` and `other[j]`; the full teaching class below follows that idea.

**Why this example?** The loop makes each step of overloaded `+` inspectable. **How to solve it:** validate the dimensions, create a fresh result of that dimension, add each indexed pair, then return the new vector.

<span id="part-4-gaps"></span>

### 3. Use a two-coordinate Practice gap vector

With the complete class in Part 7, the construction looks like this:

```python
laps = Vector(2)
laps[0] = 89426                 # Marc
laps[1] = 89558                 # Fabio
offsets = Vector(2)
offsets[0] = -88725             # subtract Raúl's best lap
offsets[1] = -88725
gaps = laps + offsets
print(gaps)                     # <701, 833>
print(gaps[-1])                 # 833: the final coordinate
```

Negative indexing comes from the internal Python list: `-1` means the last coordinate. Two separate `Vector(2)` objects with the same two values compare equal through `__eq__`, while `is` remains false because they are different objects.

**Why this example?** Marc and Fabio remain the focus while Raúl supplies a common reference. **How to solve it:** build both vectors in the same rider order, add them, then check `701` and `833` against the hand subtractions in the background table.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Section 2.3.4 — Iterators

<span id="part-5-protocol"></span>

### 1. Follow `iter`, `next`, and `StopIteration`

An **iterator** remembers where it is while providing one item at a time. `iter(sequence)` obtains an iterator. Each `next(it)` calls its `__next__()` method; once there are no items, `__next__` raises `StopIteration`. A `for` loop handles that stopping signal for us. An iterator's `__iter__()` returns the iterator itself.

```text
selected board:      Marc              Fabio
first next(it):      Marc
second next(it):                       Fabio
third next(it):     StopIteration
```

The book's `SequenceIterator` stores a sequence reference and an index. It uses the sequence's length and integer indexing to fetch one value at a time. Our version starts at index `0`, returns the current item, then advances the index; it has the same external behavior as the book's version, which starts at `-1` and advances before reading.

```python
it = SequenceIterator(board)
print(next(it).rider)  # Marc Márquez
print(next(it).rider)  # Fabio Quartararo
# A third next(it) raises StopIteration.
```

**Why this example?** Two selected riders let us see every iterator state and its end. **How to solve it:** track the index before each call, return the corresponding item, advance once, and raise `StopIteration` when the index reaches the length. Create a new iterator for a fresh pass.

<span id="part-5-generator"></span>

### 2. Compare an iterator with a generator

Python can also iterate over `board` directly because its `__getitem__` supplies indexes `0`, `1`, and then raises `IndexError`. This is the older **sequence fallback**: `__len__` is useful for size, but the indexed reads and final `IndexError` are what let fallback iteration stop. The explicit `SequenceIterator` makes the state machine visible.

For many tasks, a **generator** is shorter than a separate iterator class:

```python
def gap_values(reference, results):
    for result in results:
        yield result.difference_ms(reference)

# With the board holding Marc and Fabio:
print(list(gap_values(raul, board)))  # [701, 833]
```

`yield` pauses the function between values and resumes it for the next one. The book introduces generators as a convenient way to build iterators after explaining the underlying protocol. The complete program uses `SequenceIterator` so the calls to `__iter__` and `__next__` are visible.

**Why this example?** It produces the same two real gaps with less code. **How to choose:** use a generator when yielding values is the whole job; use an explicit iterator class when its stored state or protocol behavior is what you need to study or customize.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Section 2.3.5 — The Range Class

<span id="part-6-lazy"></span>

### 1. Represent chart marks without storing a list

Python 3's built-in [`range`](https://docs.python.org/3/library/stdtypes.html#ranges) represents evenly spaced integers compactly. The book defines a simplified `Range` class to show the idea: store **start**, **step**, and **length**, then calculate any requested value. It need not save a list of every mark.

Our hypothetical comparison chart has tick marks every `250 ms` from `0` through `1000 ms`:

| Expression | Result | Meaning in the teaching chart |
| :--- | :--- | :--- |
| `Range(0, 1001, 250)` | `0, 250, 500, 750, 1000` | Five gap-axis marks in ms. |
| `len(ticks)` | `5` | Five marks. |
| `ticks[3]` | `750` | Fourth mark. |
| `ticks[-1]` | `1000` | Last mark. |

The `stop` value is **excluded**. We choose `1001` so the last included mark is `1000`. Marc's `701 ms` gap lies between the `500` and `750` marks; Fabio's `833 ms` lies between `750` and `1000`. The marks are display guides, not additional recorded lap results.

**Why this example?** Regular chart marks fit a range, and the actual gaps give the scale a purpose. **How to solve it:** choose a start, excluded stop, and nonzero step; calculate the first few values by repeated addition; check that the final included value stays before the stop.

<span id="part-6-indexing"></span>

### 2. Calculate length and indexes, including reverse steps

For start `s`, step `d`, and index `k`, a range value is **`s + k × d`**. Thus `ticks[3]` is `0 + 3 × 250 = 750`. A negative index counts from the end: `ticks[-1]` becomes `ticks[5 - 1]`, which is `1000`. An index outside `0` through `4` raises `IndexError`; a zero step raises `ValueError`.

For a **positive** step, this length expression counts the values in the half-open interval:

```text
length = max(0, (stop - start + step - 1) // step)
      = max(0, (1001 - 0 + 250 - 1) // 250)
      = 5
```

For a **negative** step, count the distance in the opposite direction using `stride = -step`:

```text
Range(1000, -1, -250) → 1000, 750, 500, 250, 0
length = max(0, (start - stop + stride - 1) // stride) = 5
```

Code Fragment 2.6 in the book prints a single length expression that gives a wrong answer for some negative-step inputs: it counts five for `Range(8, 0, -2)`, although the values are `8, 6, 4, 2` and the length is four. The complete class below uses separate formulas by step sign. It supports integer indexing and iteration, but does not implement all built-in `range` features such as slicing.

**Why this example?** A reverse range exposes an edge case hidden by the forward chart scale. **How to solve it:** determine the direction from the sign of `step`, count only values that stay before the excluded stop in that direction, then verify `len(...)` and `[-1]` by listing a small case by hand.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Complete Practice-Display Program

<span id="part-7-program"></span>

### 1. Run the program

This program joins the small ideas into one trace. `PracticeResult` holds one rider's sourced result; `ComparisonBoard` owns the hypothetical selection; `Vector` calculates the two gaps; `SequenceIterator` visits a sequence; and `Range` calculates chart marks. Save the code as a `.py` file and run it with Python 3.

```python
SESSION = "2026 Indonesian GP MotoGP Practice, 9 October"


class PracticeResult:
    def __init__(self, session, rider, team, lap_ms):
        if not all(isinstance(x, str) and x.strip()
                   for x in (session, rider, team)):
            raise ValueError("session, rider, and team must be nonempty text")
        if type(lap_ms) is not int or lap_ms <= 0:
            raise ValueError("lap_ms must be a positive integer")
        self._session = session
        self.rider = rider
        self.team = team
        self._lap_ms = lap_ms

    def lap_ms(self):
        return self._lap_ms

    def lap_seconds(self):
        return self._lap_ms / 1000

    def difference_ms(self, reference):
        if not isinstance(reference, PracticeResult):
            raise TypeError("reference must be a PracticeResult")
        if self._session != reference._session:
            raise ValueError("results must be from the same session")
        return self._lap_ms - reference._lap_ms


class ComparisonBoard:
    def __init__(self, capacity):
        if type(capacity) is not int or capacity <= 0:
            raise ValueError("capacity must be a positive integer")
        self._capacity = capacity
        self._selected = []

    def count(self):
        return len(self._selected)

    def add(self, result):
        if self.count() >= self._capacity:
            return False
        self._selected.append(result)
        return True

    def remove(self, result):
        self._selected.remove(result)

    def __len__(self):
        return self.count()

    def __getitem__(self, index):
        return self._selected[index]


class Vector:
    def __init__(self, dimension):
        if type(dimension) is not int or dimension < 0:
            raise ValueError("dimension must be a nonnegative integer")
        self._coords = [0] * dimension

    def __len__(self):
        return len(self._coords)

    def __getitem__(self, index):
        if type(index) is not int:
            raise TypeError("vector index must be an integer")
        return self._coords[index]

    def __setitem__(self, index, value):
        if type(index) is not int:
            raise TypeError("vector index must be an integer")
        self._coords[index] = value

    def __add__(self, other):
        if not hasattr(other, "__len__") or not hasattr(other, "__getitem__"):
            return NotImplemented
        if len(self) != len(other):
            raise ValueError("vector dimensions must agree")
        answer = Vector(len(self))
        for j in range(len(self)):
            answer[j] = self[j] + other[j]
        return answer

    def __eq__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return self._coords == other._coords

    def __ne__(self, other):
        same = self.__eq__(other)
        if same is NotImplemented:
            return NotImplemented
        return not same

    def __str__(self):
        return "<" + ", ".join(str(x) for x in self._coords) + ">"


class SequenceIterator:
    def __init__(self, sequence):
        self._sequence = sequence
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self._index >= len(self._sequence):
            raise StopIteration
        value = self._sequence[self._index]
        self._index += 1
        return value


class Range:
    def __init__(self, start, stop=None, step=1):
        if stop is None:
            start, stop = 0, start
        if any(type(x) is not int for x in (start, stop, step)):
            raise TypeError("range arguments must be integers")
        if step == 0:
            raise ValueError("step cannot be zero")
        self._start = start
        self._step = step
        if step > 0:
            self._length = max(0, (stop - start + step - 1) // step)
        else:
            stride = -step
            self._length = max(0, (start - stop + stride - 1) // stride)

    def __len__(self):
        return self._length

    def __getitem__(self, index):
        if type(index) is not int:
            raise TypeError("range index must be an integer")
        if index < 0:
            index += self._length
        if not 0 <= index < self._length:
            raise IndexError("range index out of bounds")
        return self._start + index * self._step


def main():
    raul = PracticeResult(
        SESSION, "Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 88725
    )
    marc = PracticeResult(SESSION, "Marc Márquez", "Ducati Lenovo Team", 89426)
    fabio = PracticeResult(
        SESSION, "Fabio Quartararo", "Monster Energy Yamaha MotoGP", 89558
    )

    board = ComparisonBoard(2)
    print("Marc added:", board.add(marc))
    print("Fabio added:", board.add(fabio))
    print("Raúl added while full:", board.add(raul))
    print("Selected riders:", len(board))
    for result in SequenceIterator(board):
        print("{}: {:.3f} s, +{:.3f} s to Raúl".format(
            result.rider, result.lap_seconds(),
            result.difference_ms(raul) / 1000
        ))

    laps = Vector(len(board))
    offsets = Vector(len(board))
    for j in range(len(board)):
        laps[j] = board[j].lap_ms()
        offsets[j] = -raul.lap_ms()
    gaps = laps + offsets
    print("Gap vector (Marc, Fabio) in ms:", gaps)
    print("Fabio gap from vector:", gaps[-1], "ms")

    copy = Vector(2)
    copy[0], copy[1] = 701, 833
    print("Same coordinates:", gaps == copy)
    print("Same object:", gaps is copy)

    ticks = Range(0, 1001, 250)
    print("Chart marks in ms:", list(SequenceIterator(ticks)))
    print("Last chart mark:", ticks[-1])
    reverse = Range(1000, -1, -250)
    print("Reverse marks in ms:", list(SequenceIterator(reverse)))

    board.remove(marc)
    print("Raúl added after removal:", board.add(raul))
    print("Final selected riders:", [result.rider for result in board])


if __name__ == "__main__":
    main()
```

The class definitions are longer than the task itself because each one makes a specific operation explicit. For this teaching version, `ComparisonBoard.add()` enforces capacity but does not check the type of the object being added. A production display would validate that input and decide what to do about duplicates. This scope keeps the book's central idea—controlled state changes—easy to follow.

**Why this combined example?** Every class has a distinct job, and the final values can be checked against the source table. **How to solve it:** construct the three result objects, select Marc and Fabio, calculate gaps in milliseconds, then use the iterator and range classes to display and label those results.

<span id="part-7-trace"></span>

### 2. Trace its output

```text
Marc added: True
Fabio added: True
Raúl added while full: False
Selected riders: 2
Marc Márquez: 89.426 s, +0.701 s to Raúl
Fabio Quartararo: 89.558 s, +0.833 s to Raúl
Gap vector (Marc, Fabio) in ms: <701, 833>
Fabio gap from vector: 833 ms
Same coordinates: True
Same object: False
Chart marks in ms: [0, 250, 500, 750, 1000]
Last chart mark: 1000
Reverse marks in ms: [1000, 750, 500, 250, 0]
Raúl added after removal: True
Final selected riders: ['Fabio Quartararo', 'Raúl Fernández']
```

The first `False` is a **display-capacity decision**, not a claim about Raúl's performance: he was P1 in the actual Practice session. After removing Marc, the same result object can be added. The vector's `701` and `833` are the two hand-calculated differences. `Same coordinates: True` uses `__eq__`; `Same object: False` uses identity. The `Range` object calculates its five marks rather than storing them as a list; `list(SequenceIterator(ticks))` builds a list only to print them.

**Why trace the output?** A class method is easier to understand when its return value and its effect on state are checked together. **How to verify it:** follow `board._selected` after each update, compute each subtraction once by hand, and count the values in each range before looking at the printed lines.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Small Cases to Solve Yourself

1. **A refused selection.** Start with an empty `ComparisonBoard(2)`. Add Marc, then Fabio, then Raúl. What does the third `add()` return, and what does `len(board)` return? **Why this case?** It reaches the branch a successful-only trace misses. **Solve:** after two accepted additions the list has length 2, equal to capacity; the third call returns `False` before appending, so the length remains `2`. Raúl's P1 result is unchanged.

2. **A new vector, not a changed input.** Let `laps = <89426, 89558>` and `offsets = <-88725, -88725>`. What does `laps + offsets` contain, and what remains in `laps`? **Why this case?** It checks the result of `__add__` and whether the operands are mutated. **Solve:** add at the same indexes to get `<701, 833>`; `laps` still contains `<89426, 89558>` because `__add__` builds a new vector. `laps + Vector(3)` raises `ValueError` because the dimensions disagree.

3. **An exhausted iterator.** Create `it = SequenceIterator(board)` when the board contains Marc and Fabio. What happens on three calls to `next(it)`? **Why this case?** It makes the stopping rule concrete. **Solve:** the first returns Marc's result, the second Fabio's, and the third raises `StopIteration`. `SequenceIterator(board)` creates a fresh iterator starting at Marc again.

4. **A reverse range.** What are `list(SequenceIterator(Range(8, 0, -2)))`, its length, and its final value? **Why this case?** It tests the negative-step formula that the book's printed expression mishandles. **Solve:** the values are `[8, 6, 4, 2]`, the length is `4`, and index `-1` returns `2`; zero is the excluded stop.

5. **A unit check.** What is Fabio's best-lap difference from Marc in this Practice session? **Why this case?** It prevents mixing the two reference choices. **Solve:** `89,558 - 89,426 = 132 ms = 0.132 s`. The vector's `833 ms` is Fabio's difference from **Raúl**, so subtract the correct pair for the question.

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Book topic | What to remember | Practice-display check |
| :--- | :--- | :--- |
| `CreditCard` class | Each instance owns state; methods check a rule before an update. | A full two-slot board refuses a third selection and stays at length 2. |
| Special methods | Python syntax such as `+`, `len`, and `[]` calls class-defined behavior. | `laps + offsets` produces a coordinate sum; `len(board)` counts selections. |
| `Vector` | Indexes identify coordinates; addition requires the same dimension and returns a new vector. | Marc/Fabio gap vector is `<701, 833>` ms. |
| Iterator | `__next__` returns one item and eventually raises `StopIteration`. | The board yields Marc, then Fabio, then stops. |
| `Range` | Store start, step, and length; calculate a value when indexed. | `Range(0, 1001, 250)` supplies five chart marks. |

Keep the **session, coordinate order, unit, and reference rider** with every calculation. Those four labels make the class behavior and the numbers checkable. The best-lap times and rider affiliations come from the cited 2026 Indonesian GP Practice classification; the two-slot display and chart scale are teaching scenarios.

[🔝 Back to Top](#top)
