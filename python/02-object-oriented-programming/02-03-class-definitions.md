<span id="top"></span>

# 2.3 Class Definitions — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.3, printed pages 69–81 (the supplied PDF).  
> **Topic:** 2.3 Class Definitions; 2.3.1 Example: CreditCard Class; 2.3.2 Operator Overloading and Python's Special Methods; 2.3.3 Example: Multidimensional Vector Class; 2.3.4 Iterators; 2.3.5 Example: Range Class.  
> **Domain Focus:** Rectangle cards, a 30 cm² paper allowance, 2D positions on a display row, and evenly spaced ruler marks.  
> **User Prompt:** Reexplain Section 2.3 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Cards on a Display Row](#background)
   - [1. Keep the familiar card measurements](#background-cards)
   - [2. Add an area allowance and positions](#background-project)
2. [Part 1: 2.3 Class Definitions](#part-1)
   - [1. A class is a blueprint for state and behavior](#part-1-blueprint)
3. [Part 2: 2.3.1 Example: CreditCard Class](#part-2)
   - [1. Translate the book's example into geometry](#part-2-bridge)
   - [2. Read `class`, `self`, and `__init__`](#part-2-constructor)
   - [3. Encapsulate state and update it through methods](#part-2-state)
   - [4. Check errors and test both outcomes](#part-2-tests)
4. [Part 3: 2.3.2 Operator Overloading and Python's Special Methods](#part-3)
   - [1. Match familiar syntax to special methods](#part-3-map)
   - [2. Reflected operations and other built-in behavior](#part-3-reflected)
   - [3. Defaults and a current-Python note](#part-3-defaults)
5. [Part 4: 2.3.3 Example: Multidimensional Vector Class](#part-4)
   - [1. Lists and vectors mean different things](#part-4-meaning)
   - [2. Build vector behavior over a coordinate list](#part-4-implementation)
   - [3. Use vectors for card positions](#part-4-layout)
6. [Part 5: 2.3.4 Iterators](#part-5)
   - [1. The iterator protocol](#part-5-protocol)
   - [2. A sequence iterator and a generator](#part-5-sequence)
7. [Part 6: 2.3.5 Example: Range Class](#part-6)
   - [1. A lazy sequence of ruler marks](#part-6-lazy)
   - [2. Length, indexing, and negative steps](#part-6-indexing)
8. [Part 7: One Connected Geometry Program](#part-7)
   - [1. The complete program](#part-7-program)
   - [2. Trace the printed result](#part-7-trace)
9. [Part 8: Simple Geometry Study Cases](#part-8)
10. [Part 9: Summary](#part-9)

---

<span id="background"></span>

## Background & Conceptual Intuition: Cards on a Display Row

<span id="background-cards"></span>

### 1. Keep the familiar card measurements

Our earlier guides used these rectangular cards, measured in centimetres:

| Card | Width | Height | Area | Separate border length |
| :--- | ----: | -----: | ---: | ---------------------: |
| `A` | 2 cm | 3 cm | 6 cm² | 10 cm |
| `B` | 4 cm | 2 cm | 8 cm² | 12 cm |
| `C` | 4 cm | 4 cm | 16 cm² | 16 cm |

Choosing `A`, `C`, `A` means **three physical cards**, including two distinct copies of `A`. Their total area is **6 + 16 + 6 = 28 cm²**, and their separate borders total **10 + 16 + 10 = 36 cm**.

<span id="background-project"></span>

### 2. Add an area allowance and positions

The workshop has a **30 cm² allowance of card material**. A program can reserve area for `A`, `C`, and `A`, leaving 2 cm². It must refuse an additional `B` because **28 + 8 = 36 cm²**, which exceeds the allowance. This is an area-accounting rule, not a claim that area alone proves cards physically fit on a board.

For a separate layout example, place the three accepted cards along a **12 cm wide, 4 cm high display row**. Their left edges are at horizontal positions **0, 4, and 8 cm**. Their right edges are at 2, 8, and 10 cm, so they fit within the 12 cm row without overlapping. A 2D position such as **⟨4, 0⟩** can be represented by a vector, and `0, 4, 8` can come from a range-like object.

These two small geometry tasks connect the classes in this section: a budget object keeps state, vectors describe shifts and positions, an iterator visits a sequence, and a range represents regular ruler marks.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 2.3 Class Definitions

<span id="part-1-blueprint"></span>

### 1. A class is a blueprint for state and behavior

A **class** is a blueprint for objects. It defines shared **methods** (behaviors) and the **attributes**, or instance variables, that each object uses for its own state. This is a main way to build an abstraction: callers see what an object can do without depending on its internal representation.

| Blueprint | One instance | State belonging to that instance | Shared behavior |
| :--- | :--- | :--- | :--- |
| `Rectangle` | A 2 × 3 cm card | Width 2, height 3 | `area()`, `perimeter()` |
| `CardBudget` | One 30 cm² allowance | Limit 30, used area 28 | `reserve()`, `release()` |
| `Vector` | Position ⟨4, 0⟩ | Coordinates 4 and 0 | Indexing, addition, string form |

Two `CardBudget` objects can have different used areas even though the same method definitions serve both. The code inside a method uses `self` to reach the particular object on which it was called.

> **Mental model:** The class supplies the recipe; each instance carries its own measurements or running total.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 2.3.1 Example: CreditCard Class

<span id="part-2-bridge"></span>

### 1. Translate the book's example into geometry

The book implements a `CreditCard` class from the design in Section 2.2. Each card stores a customer, bank, account, credit limit, and balance. `charge(price)` returns `False` if a purchase would exceed the limit; otherwise it increases the balance and returns `True`. `make_payment(amount)` reduces the balance. The book uses this example to teach class mechanics, not financial modeling in this guide.

Our **`CardBudget`** uses the same shape of state change with geometry values:

| Book's credit card | Workshop's card-material budget |
| :--- | :--- |
| Credit limit | Area allowance: 30 cm² |
| Current balance | Area already reserved: 0, then 6, 22, 28 cm² |
| `charge(price)` may be denied | `reserve(card)` may return `False` if the card exceeds the allowance |
| `make_payment(amount)` lowers the balance | `release(card)` gives back the area of a reserved card |

The analogy concerns **state and rules**. Money and area have different units; we never add a dollar amount to a square-centimetre value.

<span id="part-2-constructor"></span>

### 2. Read `class`, `self`, and `__init__`

A class definition begins with `class`, a name, a colon, and an indented body. Methods are functions written inside that body. Their first parameter is conventionally named `self`:

```python
class CardBudget:
    def __init__(self, area_limit):
        self._area_limit = area_limit
        self._used_area = 0

    def used_area(self):
        return self._used_area
```

`__init__` initializes each new object's state. The book calls it the constructor; more precisely, Python calls it during object construction to set up the newly created instance. In `self._area_limit = area_limit`, the left side is a field on the object; the right side is the local parameter.

Using the complete classes in Part 7:

```python
first_budget = CardBudget(30)
second_budget = CardBudget(50)
first_budget.reserve(Rectangle(2, 3))
print(first_budget.used_area())  # 6
print(second_budget.used_area())  # 0
```

The caller writes `first_budget.used_area()` with no visible argument. Python supplies `first_budget` as `self` to the method declared as `used_area(self)`. The same method can therefore read the state of either instance.

<span id="part-2-state"></span>

### 3. Encapsulate state and update it through methods

The leading underscore in `_used_area` means **nonpublic by convention**. It does not make the field inaccessible. Clients should use an **accessor** such as `used_area()` to read it and controlled **update methods** such as `reserve(card)` and `release(card)` to change it. This helps keep the object's state consistent.

For a 30 cm² allowance, `reserve()` should add a card's area only when it fits:

```text
Start at 0 cm²
Reserve A: 0 + 6 = 6 cm²       → accept
Reserve C: 6 + 16 = 22 cm²     → accept
Reserve A: 22 + 6 = 28 cm²     → accept
Reserve B: 28 + 8 = 36 cm²     → refuse; remain at 28 cm²
```

`release(card)` is a different update: it removes a card that was actually reserved and subtracts its area. If we keep a reference to the first `A`, releasing it after `A`, `C`, `A` changes used area from **28 to 22 cm²**. Card `B` can then be reserved exactly: **22 + 8 = 30 cm²**. The complete program in Part 7 defines both methods and retains the `Rectangle` class from Section 2.2 so card dimensions remain positive.

<span id="part-2-tests"></span>

### 4. Check errors and test both outcomes

The book explicitly notes that its introductory `CreditCard` implementation does not validate all input types or reject negative charges. We should not copy such gaps into the geometry analogy. `Rectangle(-2, 3)` must not become a negative-area card, and a budget with a nonpositive allowance is invalid.

The book's wallet demonstration calls each `CreditCard` method, giving **method coverage**, but it never tests a rejected charge, so it misses **statement coverage** for that branch. Its printed output also requires a person to check it. For our `CardBudget`, test both:

```text
reserve(A), reserve(C), reserve(A) → True, True, True; used area 28 cm²
reserve(B) afterward             → False; used area stays 28 cm²
```

An automated check should compare the actual values with these expected values rather than merely print them. As in Section 2.2, a `if __name__ == "__main__":` guard lets a file run demonstrations directly without running them when the class is imported.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 2.3.2 Operator Overloading and Python's Special Methods

<span id="part-3-map"></span>

### 1. Match familiar syntax to special methods

**Operator overloading** lets a class give familiar syntax a meaning that fits its objects. For numbers, `+` adds; for lists, it concatenates. A new class has no useful vector-addition rule until we define one. Special method names have **two underscores before and after** the central name.

| Syntax | Special method involved | Geometry use |
| :--- | :--- | :--- |
| `u + v` | `u.__add__(v)` | Add coordinates of two shifts. |
| `u == v`, `u != v` | `__eq__`, `__ne__` | Compare vector coordinates. |
| `len(u)` | `u.__len__()` | Count coordinates: 2 for a 2D vector. |
| `u[0]`, `u[0] = 4` | `__getitem__`, `__setitem__` | Read or set the horizontal coordinate. |
| `str(u)` | `u.__str__()` | Display a position as `<4, 0>` in our program. |
| `iter(u)`, `next(it)` | `__iter__`, `__next__` | Visit coordinates or sequence entries. |
| `x in u` | `__contains__` or iteration fallback | Ask whether a coordinate value occurs. |

The book's Table 2.1 lists many more families: arithmetic and reflected arithmetic, in-place and unary operations, comparisons, indexing, membership, calling an object, length, hashing, conversion, and iteration. We will use the methods that serve this geometry case.

<span id="part-3-reflected"></span>

### 2. Reflected operations and other built-in behavior

For `u + v`, Python first asks the left operand whether it can add the right one. If the left method cannot handle the operation, a suitable **reflected** method on the right operand may get a chance. For example, supporting `3 * shift` for a user-defined vector could require `shift.__rmul__(3)` when the integer's multiplication does not handle that vector. The order matters: multiplication is not always commutative, as with matrices.

Special methods also support built-in functions that do not look like dot-method calls. `len(u)` consults `u.__len__()`, and `str(u)` consults `u.__str__()`. Numeric conversions can use `__int__` or `__float__` when those meanings fit a class; our vector does not define them. A class may supply `__bool__` for truth testing; otherwise Python can use `__len__`, making an empty container false and a nonempty one true. With neither method, a user-defined object is truthy by default.

<span id="part-3-defaults"></span>

### 3. Defaults and a current-Python note

Methods are **not all implied** by one another. If `Vector` has no suitable `__add__`, `u + v` fails. Defining `__lt__` and `__eq__` does not automatically give a class a working `<=` operator. A class should implement each operation whose meaning it promises. Without custom equality, separate user-defined objects normally compare by identity even when their fields look alike; `u is v` asks whether they are the **same object**, while `u == v` can use value equality defined by `__eq__`.

The book says defining `__eq__` does not automatically define `!=`, and its `Vector` implements `__ne__` explicitly. In current Python, inherited `object.__ne__` normally delegates to `__eq__` and negates a valid result; writing `__ne__` can still make the intended behavior explicit. See the [Python data model](https://docs.python.org/3/reference/datamodel.html#object.__eq__). We include both methods in the study class to mirror the book.

The book also notes that `__len__` plus `__getitem__` lets its vector be iterated without a written `__iter__`. Current Python's older sequence fallback actually calls consecutive `__getitem__` indexes until `IndexError`; `__len__` is useful but not required for that fallback. Membership can fall back to iteration when `__contains__` is absent. See the [sequence and membership methods](https://docs.python.org/3/reference/datamodel.html#object.__getitem__) in the official documentation.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 2.3.3 Example: Multidimensional Vector Class

<span id="part-4-meaning"></span>

### 1. Lists and vectors mean different things

The book's `Vector` example represents coordinates in any number of dimensions. Its example adds **⟨5, −2, 3⟩ + ⟨1, 4, 2⟩ = ⟨6, 2, 5⟩**. A Python list is a useful internal container, but list `+` has a different public meaning:

```python
print([4, 0] + [0, 1])  # [4, 0, 0, 1]: concatenation
```

For geometric shifts, we want **⟨4, 0⟩ + ⟨0, 1⟩ = ⟨4, 1⟩**: add corresponding coordinates, keeping the result two-dimensional. This is why `Vector.__add__` should build a new vector rather than expose the list's `+` operation.

<span id="part-4-implementation"></span>

### 2. Build vector behavior over a coordinate list

The book's vector stores a coordinate list inside each instance. Its public behavior includes:

| Method | What it does | Small 2D example |
| :--- | :--- | :--- |
| `__init__(dimension)` | Start with that many zero coordinates. | `Vector(2)` starts as ⟨0, 0⟩. |
| `__len__()` | Return the dimension. | `len(u)` is 2. |
| `__getitem__(j)` / `__setitem__(j, value)` | Read or change one coordinate. | `u[0] = 4`; `u[-1]` reads the last coordinate. |
| `__add__(other)` | Add matching coordinates; reject different dimensions. | ⟨4, 0⟩ + ⟨0, 1⟩ = ⟨4, 1⟩. |
| `__eq__` / `__ne__` | Compare coordinate values. | Two distinct ⟨4, 0⟩ vectors compare equal. |
| `__str__()` | Make a readable string. | `str(u)` is `<4, 0>` in our program. |

The key addition step is:

```python
result = Vector(len(self))
for j in range(len(self)):
    result[j] = self[j] + other[j]
return result
```

Before this loop, the method checks that the dimensions match. `result` is a **new object**, so adding two shifts does not overwrite either input. The indexing methods delegate to the internal list, including its negative-index behavior.

<span id="part-4-layout"></span>

### 3. Use vectors for card positions

Let the first card start at **⟨0, 0⟩** and let a horizontal shift be **⟨4, 0⟩**. Add the shift once for the `C` position and twice for the last `A`:

```text
first A:  ⟨0, 0⟩
C:        ⟨0, 0⟩ + ⟨4, 0⟩ = ⟨4, 0⟩
second A: ⟨4, 0⟩ + ⟨4, 0⟩ = ⟨8, 0⟩
```

The book's `__add__` checks only that `other` has a length and indexed coordinates, so `Vector + list` can also work when dimensions match. That is **polymorphism**: the method depends on needed behavior rather than the exact right-hand class. The reverse `list + Vector` is a separate question and is not supplied by the book's `Vector` class.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 2.3.4 Iterators

<span id="part-5-protocol"></span>

### 1. The iterator protocol

An **iterator** remembers where it is in a sequence. Calling `next(it)` asks for the next item; after the last item, `__next__` raises `StopIteration`. A `for` loop handles this stopping signal for us. An iterator's `__iter__` normally returns the iterator itself.

```text
Cards:       A       C       A
next(it):    A  →    C  →    A  →    StopIteration
```

The source implements a low-level `SequenceIterator` with a reference to a sequence and a current index. It starts its index at `-1`, increments before each read, and stops at the sequence length. Our complete program follows that design.

<span id="part-5-sequence"></span>

### 2. A sequence iterator and a generator

`SequenceIterator(data)` works with a sequence supporting `len(data)` and `data[j]`. For our lazy ruler marks, it can visit `0`, `4`, and `8` in order:

```python
marks = Range(0, 12, 4)
for x in SequenceIterator(marks):
    print(x)  # prints 0, then 4, then 8 on separate lines
```

The book says writing a separate iterator class is often unnecessary. A **generator** can yield the same values with less machinery:

```python
def card_areas(cards):
    for card in cards:
        yield card.area()
```

For `A`, `C`, `A`, this generator yields `6`, `16`, `6` cm². The explicit iterator remains useful for seeing how index state, `__next__`, and `StopIteration` work.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 2.3.5 Example: Range Class

<span id="part-6-lazy"></span>

### 1. A lazy sequence of ruler marks

The book contrasts Python 2's list-producing `range` with Python 3's **lazy** `range` object. A range stores a compact description of an arithmetic sequence instead of storing every number. That matters when a loop needs many positions but not a giant list in memory.

For our display row, `range(0, 12, 4)` represents the ruler marks **0, 4, 8**. The stop value, `12`, is **excluded**. The book creates a simplified class named `Range` to show how this can work. It stores the start, step, and number of values; it does not store the values themselves.

| Expression | Result | Geometry meaning |
| :--- | :--- | :--- |
| `Range(0, 12, 4)` | 0, 4, 8 | Left edges of `A`, `C`, `A`. |
| `len(marks)` | 3 | Three positions. |
| `marks[1]` | 4 | Second card starts 4 cm from the left. |
| `marks[-1]` | 8 | Last card starts 8 cm from the left. |

The book also gives `range(8, 140, 5)` as a larger example: it has 27 values, and index 15 gives 83. Our three-mark example keeps the same arithmetic visible.

<span id="part-6-indexing"></span>

### 2. Length, indexing, and negative steps

For start `s`, step `d`, and valid index `k`, the value is **s + k × d**. Thus `Range(0, 12, 4)[2]` is **0 + 2 × 4 = 8**. The number of marks is the size of the half-open interval rounded up in steps of 4: **(12 − 0 + 4 − 1) // 4 = 3**. A negative index is translated from the end: index `-1` becomes `len(marks) - 1`, or 2. An index outside the sequence raises `IndexError`; a zero step raises `ValueError`.

A negative step walks backward. `Range(8, -1, -4)` should represent **8, 4, 0**. The printed length expression in Code Fragment 2.6 overcounts some negative-step ranges; for example, it gives five values for `Range(8, 0, -2)` even though **8, 6, 4, 2** has four. Our complete program uses a separate formula for negative steps. Python's built-in [`range` documentation](https://docs.python.org/3/library/stdtypes.html#ranges) defines the intended stop and step behavior.

This study `Range` is deliberately smaller than Python's built-in class: it supports integer indexing and iteration, but not every built-in feature such as slicing.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: One Connected Geometry Program

<span id="part-7-program"></span>

### 1. The complete program

Save this as `geometry_cards.py`. It carries the accepted card areas, positions, iterator, and lazy ruler marks through one run:

```python
"""Measure and position rectangular cards for a classroom display."""


class Rectangle:
    """A card with positive width and height, measured in centimetres."""

    def __init__(self, width, height):
        if width <= 0 or height <= 0:
            raise ValueError("width and height must be positive")
        self._width = width
        self._height = height

    def area(self):
        return self._width * self._height

    def perimeter(self):
        return 2 * (self._width + self._height)


class CardBudget:
    """Track cards against an area allowance in square centimetres."""

    def __init__(self, area_limit):
        if area_limit <= 0:
            raise ValueError("area limit must be positive")
        self._area_limit = area_limit
        self._used_area = 0
        self._cards = []

    def used_area(self):
        return self._used_area

    def card_count(self):
        return len(self._cards)

    def total_border(self):
        return sum(card.perimeter() for card in self._cards)

    def reserve(self, card):
        area = card.area()
        if self._used_area + area > self._area_limit:
            return False
        self._cards.append(card)
        self._used_area += area
        return True

    def release(self, card):
        self._cards.remove(card)
        self._used_area -= card.area()


class Vector:
    """A vector whose coordinates can be indexed and added."""

    def __init__(self, dimension):
        if dimension < 0:
            raise ValueError("dimension cannot be negative")
        self._coords = [0] * dimension

    def __len__(self):
        return len(self._coords)

    def __getitem__(self, index):
        return self._coords[index]

    def __setitem__(self, index, value):
        self._coords[index] = value

    def __add__(self, other):
        if len(self) != len(other):
            raise ValueError("vector dimensions must agree")
        result = Vector(len(self))
        for index in range(len(self)):
            result[index] = self[index] + other[index]
        return result

    def __eq__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return self._coords == other._coords

    def __ne__(self, other):
        return not self == other

    def __str__(self):
        return "<" + ", ".join(str(value) for value in self._coords) + ">"


class SequenceIterator:
    """Visit indexed entries of a sequence one at a time."""

    def __init__(self, sequence):
        self._sequence = sequence
        self._index = -1

    def __next__(self):
        self._index += 1
        if self._index < len(self._sequence):
            return self._sequence[self._index]
        raise StopIteration

    def __iter__(self):
        return self


class Range:
    """A small range-like sequence with integer indexing."""

    def __init__(self, start, stop=None, step=1):
        if step == 0:
            raise ValueError("step cannot be zero")
        if stop is None:
            start, stop = 0, start
        if not all(isinstance(value, int) for value in (start, stop, step)):
            raise TypeError("range arguments must be integers")

        if step > 0:
            self._length = max(0, (stop - start + step - 1) // step)
        else:
            stride = -step
            self._length = max(0, (start - stop + stride - 1) // stride)
        self._start = start
        self._step = step

    def __len__(self):
        return self._length

    def __getitem__(self, index):
        if not isinstance(index, int):
            raise TypeError("index must be an integer")
        if index < 0:
            index += len(self)
        if not 0 <= index < len(self):
            raise IndexError("range index out of range")
        return self._start + index * self._step


def main():
    """Show the budget and positions of three chosen cards."""
    sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
    budget = CardBudget(30)

    for label in ["A", "C", "A"]:
        width, height = sizes[label]
        budget.reserve(Rectangle(width, height))

    width, height = sizes["B"]
    b_accepted = budget.reserve(Rectangle(width, height))

    origin = Vector(2)
    shift = Vector(2)
    shift[0] = 4
    second = origin + shift
    third = second + shift
    marks = Range(0, 12, 4)

    print("Cards accepted:", budget.card_count())
    print("Area reserved:", budget.used_area(), "cm^2")
    print("Separate borders:", budget.total_border(), "cm")
    print("B accepted:", b_accepted)
    print("Positions:", origin, second, third)
    print("Ruler marks:", list(SequenceIterator(marks)))


if __name__ == "__main__":
    main()
```

The example uses five small classes to expose five ideas from the section. `Rectangle` and `CardBudget` hold per-instance state; `Vector` defines useful operator behavior; `SequenceIterator` remembers an index; `Range` computes ruler marks from a compact description. The program shows a valid row layout but does not implement collision detection or automatic card placement.

<span id="part-7-trace"></span>

### 2. Trace the printed result

| Step | Area reserved | Accepted cards | Geometry meaning |
| :--- | ---: | ---: | :--- |
| Start | 0 cm² | 0 | Empty allowance. |
| Reserve `A` | 6 cm² | 1 | First 2 × 3 card. |
| Reserve `C` | 22 cm² | 2 | Add 4 × 4 card. |
| Reserve another `A` | 28 cm² | 3 | Count the second physical `A`. |
| Try `B` | 28 cm² | 3 | Refuse because 28 + 8 > 30. |

The vector positions are **⟨0, 0⟩**, **⟨4, 0⟩**, and **⟨8, 0⟩**. The custom range describes the same x coordinates as **0, 4, 8**. Running the script prints:

```text
Cards accepted: 3
Area reserved: 28 cm^2
Separate borders: 36 cm
B accepted: False
Positions: <0, 0> <4, 0> <8, 0>
Ruler marks: [0, 4, 8]
```

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Do two budgets share one used-area value?</strong></summary>

**Scenario:** One class budget reserves card `A`; another new budget has reserved nothing.

**Problem:** If used area were one shared value, the second budget would incorrectly report 6 cm².

**Fix:** `self._used_area` belongs to each `CardBudget` instance. Calling `first.reserve(a)` changes `first`, while `second.used_area()` remains `0`.

**Result:** One class definition serves independent objects with independent state.

</details>

<details>
<summary><strong>Case Study 2: What happens when `B` exceeds the allowance?</strong></summary>

**Scenario:** `A`, `C`, `A` have already reserved 28 cm² out of 30 cm². Card `B` needs 8 cm².

**Problem:** Accepting `B` would reserve 36 cm², above the allowance.

**Fix:** `reserve()` checks the proposed total before changing `_used_area` or appending the card. It returns `False` and leaves the used area at **28 cm²**.

**Result:** A test for rejection checks a branch the book's basic `CreditCard` demonstration does not exercise.

</details>

<details>
<summary><strong>Case Study 3: Why does a vector need its own `+`?</strong></summary>

**Scenario:** A 4 cm horizontal move and a 1 cm vertical move should combine into a 2D displacement.

**Problem:** `[4, 0] + [0, 1]` produces a four-item list, `[4, 0, 0, 1]`.

**Fix:** `Vector.__add__` adds corresponding coordinates, so **⟨4, 0⟩ + ⟨0, 1⟩ = ⟨4, 1⟩**. If dimensions differ, it raises `ValueError` instead of silently dropping a coordinate.

</details>

<details>
<summary><strong>Case Study 4: When does the iterator stop?</strong></summary>

**Scenario:** The ruler marks are `0`, `4`, and `8` cm.

**Problem:** A fourth indexed read would go beyond the three marks.

**Fix:** `SequenceIterator` returns the three values on successive `next(...)` calls and then raises `StopIteration`. A `for` loop catches that signal and ends normally.

**Result:** The iterator needs only the sequence's length and indexed items; it does not store another list of marks.

</details>

<details>
<summary><strong>Case Study 5: Can the ruler count backward?</strong></summary>

**Scenario:** Read positions from 8 cm back toward 0 cm, stepping by 4 cm.

**Problem:** A positive-step length formula does not correctly count all descending ranges.

**Fix:** `Range(8, -1, -4)` uses the negative-step branch and represents **8, 4, 0**. `len(...)` is **3**, and index `-1` returns **0**. A step of zero is rejected.

</details>

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Section 2.3 idea | Plain-language meaning | Geometry study case |
| :--- | :--- | :--- |
| **Class and instance** | One class defines behavior; each object has its own state. | Two budgets can have different used areas. |
| **`self` and `__init__`** | A method reaches the called object; initialization sets its starting state. | A new `CardBudget(30)` begins at 0 cm² used. |
| **Encapsulation** | Keep state behind accessors and controlled updates. | `reserve()` checks before changing `_used_area`. |
| **Operator overloading** | Give an operator a class-specific meaning through a special method. | `Vector.__add__` adds coordinates. |
| **Sequence special methods** | Connect `len`, indexing, and other syntax to methods. | `len(shift)` is 2; `shift[0]` is 4. |
| **Vector** | Store coordinates with geometric rather than list-concatenation behavior. | ⟨4, 0⟩ + ⟨0, 1⟩ = ⟨4, 1⟩. |
| **Iterator** | Produce one item at a time and signal completion. | Visit the x positions 0, 4, and 8 cm. |
| **Lazy range** | Store start, step, and length instead of every value. | `Range(0, 12, 4)` represents 0, 4, 8. |

[🔝 Back to Top](#top)
