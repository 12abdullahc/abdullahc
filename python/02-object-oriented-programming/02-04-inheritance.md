<span id="top"></span>

# 2.4 Inheritance — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.4, printed pages 82–95 (the supplied PDF).  
> **Topic:** 2.4 Inheritance; 2.4.1 Extending the CreditCard Class; 2.4.2 Hierarchy of Numeric Progressions; 2.4.3 Abstract Base Classes.  
> **Domain Focus:** Rectangle cards, a 30 cm² material allowance, a 12 cm display row, ruler marks, growing squares, and Fibonacci-width strips.  
> **User Prompt:** Reexplain Section 2.4 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Card Workshop, Several Related Objects](#background)
   - [1. Recall the cards and the display row](#background-cards)
   - [2. Why related classes help](#background-classes)
2. [Part 1: 2.4 Inheritance](#part-1)
   - [1. Read an “is a” hierarchy](#part-1-hierarchy)
   - [2. Override a method or add a method](#part-1-changes)
   - [3. Python's exception hierarchy](#part-1-exceptions)
3. [Part 2: 2.4.1 Extending the CreditCard Class](#part-2)
   - [1. Connect the book's example to a card-material budget](#part-2-bridge)
   - [2. Initialize the subclass with `super()`](#part-2-initialize)
   - [3. Reuse the parent method and preserve its result](#part-2-reserve)
   - [4. Understand nonpublic members](#part-2-members)
4. [Part 3: 2.4.2 Hierarchy of Numeric Progressions](#part-3)
   - [1. Put iterator mechanics in a base class](#part-3-base)
   - [2. Arithmetic progression: evenly spaced card positions](#part-3-arithmetic)
   - [3. Geometric progression: square side lengths](#part-3-geometric)
   - [4. Fibonacci progression: strips across the row](#part-3-fibonacci)
   - [5. Keep stateful progressions bounded in examples](#part-3-bounded)
5. [Part 4: 2.4.3 Abstract Base Classes](#part-4)
   - [1. Separate an abstract role from a formal abstract class](#part-4-abstract)
   - [2. Let a sequence base class supply shared methods](#part-4-sequence)
   - [3. Upgrade the ruler-mark `Range`](#part-4-range)
   - [4. Override a generic search when arithmetic suffices](#part-4-membership)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace the output](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Card Workshop, Several Related Objects

<span id="background-cards"></span>

### 1. Recall the cards and the display row

We will keep the rectangle cards from the earlier guides. Their measurements are in centimetres.

| Card | Width | Height | Area | Separate border length |
| :--- | ----: | -----: | ---: | ---------------------: |
| `A` | 2 cm | 3 cm | 6 cm² | 10 cm |
| `B` | 4 cm | 2 cm | 8 cm² | 12 cm |
| `C` | 4 cm | 4 cm | 16 cm² | 16 cm |

The workshop reserves three physical cards, `A`, `C`, and another `A`. Their total material area is **6 + 16 + 6 = 28 cm²**, within a **30 cm² allowance**. A request for `B` afterward would raise the total to **36 cm²**, so the budget rejects it. Their separate border lengths add to **36 cm**.

For a layout example, the left edges of `A`, `C`, `A` are at **0, 4, 8 cm** on a **12 cm wide, 4 cm high** row. The cards end at 2, 8, and 10 cm, respectively. They fit without overlapping. The gaps and the unoccupied 2 cm at the right are allowed; the material allowance and the physical layout are separate questions.

<span id="background-classes"></span>

### 2. Why related classes help

The original `CardBudget` already checks an area limit. Suppose a teacher also wants to **count rejected card requests**. We can make a more specific budget that keeps the old rule and adds this record. We will also make related number generators for positions and dimensions, then give our finite ruler marks the standard behavior of a Python sequence.

| Workshop object | Shared behavior | New or specialized behavior |
| :--- | :--- | :--- |
| `TrackedCardBudget` | Reserve cards using `CardBudget`'s area check. | Count failed reservations. |
| `ArithmeticProgression` | Produce the next number using `Progression`'s iterator protocol. | Add a fixed distance between marks. |
| `GeometricProgression` | Use the same iterator protocol. | Multiply a side length by a fixed factor. |
| `FibonacciProgression` | Use the same iterator protocol. | Add the previous two strip widths. |
| `Range` as a `Sequence` | Supply length and indexed values. | Inherit useful sequence searches. |

The numbers in these examples have different meanings: card area is in **cm²**, positions and lengths are in **cm**, and counts have no physical unit. We only add quantities with compatible meanings.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 2.4 Inheritance

<span id="part-1-hierarchy"></span>

### 1. Read an “is a” hierarchy

The book begins with buildings: a ranch **is a** house, and a house **is a** building. It uses that nesting to introduce **inheritance**. A general **base class** (also called a parent class or superclass) holds common behavior. A more specific **subclass** (or child class) inherits that behavior and may change or add to it.

```text
CardBudget
└── TrackedCardBudget

Progression
├── ArithmeticProgression
├── GeometricProgression
└── FibonacciProgression
```

`TrackedCardBudget` **is a** `CardBudget`: it can reserve cards and report used area. By comparison, a report that merely **contains** rectangles is not thereby a kind of rectangle. Use inheritance when the child can sensibly be treated as the parent, not simply because two classes work together.

In Python, the parent appears in parentheses after the new class name:

```python
class TrackedCardBudget(CardBudget):
    ...
```

The inherited methods remain available unless the subclass replaces them. For example, if the parent defines `used_area()`, a tracked budget can call `tracked.used_area()` without defining that method again.

<span id="part-1-changes"></span>

### 2. Override a method or add a method

The section identifies two ways for a subclass to differ from its base:

| Change | Meaning | Workshop example |
| :--- | :--- | :--- |
| **Specialize by overriding** | Define a method with the same name and a more specific implementation. | `TrackedCardBudget.reserve()` records a refusal. |
| **Extend with a new method** | Define a behavior the parent did not have. | `TrackedCardBudget.rejection_count()` reports the count. |

The subclass can still call inherited behavior with `super()`. In our single-inheritance examples, `super().reserve(card)` runs the next `reserve` implementation supplied by `CardBudget`; `super().__init__(area_limit)` runs its initializer. More generally, `super()` follows Python's method-resolution order, which matters when several classes are involved. See the [Python `super()` documentation](https://docs.python.org/3/library/functions.html#super).

<span id="part-1-exceptions"></span>

### 3. Python's exception hierarchy

The book also shows that exceptions form an inheritance hierarchy. Most ordinary application errors descend from `Exception`; `ValueError` and `IndexError` are examples. `SystemExit` and `KeyboardInterrupt` branch from `BaseException` outside that usual `Exception` branch. A workshop-specific error, if we needed one, would ordinarily inherit from `Exception` so normal application error handling could catch it.

```python
class InvalidCardError(Exception):
    pass
```

Our card examples can use built-in `ValueError` for invalid dimensions, so they do not require a new exception class. The hierarchy still illustrates the same **is a** rule: a `ValueError` is an `Exception`.

> **Mental model:** Inheritance puts a shared promise in a parent and lets a child keep that promise while adding a narrower rule or a new operation.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 2.4.1 Extending the CreditCard Class

<span id="part-2-bridge"></span>

### 1. Connect the book's example to a card-material budget

The book revisits its `CreditCard` and defines `PredatoryCreditCard(CreditCard)`. The new class calls the parent's initialization, **overrides** `charge()` to add a $5 fee when a charge is refused, and **adds** `process_month()` to grow a positive balance by a monthly interest factor. Under the book's effective-annual-growth model, the monthly factor is `(1 + apr) ** (1 / 12)`. Those money rules belong to the book's example; our geometry case will only count rejected requests and will not turn a rejected card into used material.

| Book's subclass | Geometry subclass |
| :--- | :--- |
| `PredatoryCreditCard` is a `CreditCard`. | `TrackedCardBudget` is a `CardBudget`. |
| Inherited constructor initializes shared credit-card state. | Inherited constructor initializes the area limit and empty reservation list. |
| Overridden `charge()` calls `super().charge(price)`. | Overridden `reserve()` calls `super().reserve(card)`. |
| New `process_month()` adds a behavior. | New `rejection_count()` adds a behavior. |

<span id="part-2-initialize"></span>

### 2. Initialize the subclass with `super()`

The parent already knows how to start an empty budget. The child calls that initializer, then adds its own counter:

```python
class TrackedCardBudget(CardBudget):
    def __init__(self, area_limit):
        super().__init__(area_limit)
        self._rejected_attempts = 0
```

For `TrackedCardBudget(30)`, the inherited initializer sets the 30 cm² limit, 0 cm² used area, and empty card list. The subclass adds one new instance field, `_rejected_attempts`. Each new tracked budget gets its own counter. Calling `super().__init__` avoids copying the parent's validation and setup into the child.

<span id="part-2-reserve"></span>

### 3. Reuse the parent method and preserve its result

```python
    def reserve(self, card):
        success = super().reserve(card)
        if not success:
            self._rejected_attempts += 1
        return success

    def rejection_count(self):
        return self._rejected_attempts
```

The base `reserve()` checks the proposed area **before** changing the budget and returns `True` or `False`. The override observes that result, counts a refusal, and returns the **same Boolean** to its caller. This preserves the parent's outward contract. For `A`, `C`, `A`, then `B`, the outcomes are `True`, `True`, `True`, `False`; the used area remains **28 cm²**, and the rejection count becomes **1**.

Notice that `rejection_count()` is an **extension**: the parent has no method with that name. A caller that only knows about `CardBudget` can still use `reserve()` and `used_area()` on this child object. A caller that knows it has a `TrackedCardBudget` can also ask for `rejection_count()`.

<span id="part-2-members"></span>

### 4. Understand nonpublic members

The book's subclass directly changes the parent's `_balance`. A name beginning with one underscore is a **nonpublic convention** in Python, not a formal access barrier. A subclass can reach such a field, but it then depends on how the parent stores its data. If the parent changes that representation, the child may need changes too. A double leading underscore triggers name mangling; it is still not absolute privacy.

Our child can calculate remaining material with the parent's `_area_limit` and public `used_area()`:

```python
    def remaining_area(self):
        return self._area_limit - self.used_area()
```

After `A`, `C`, `A`, this is **30 − 28 = 2 cm²**. This code deliberately illustrates the book's subclass-to-parent dependency. If we controlled a larger library, a public `area_limit()` accessor on `CardBudget` would reduce that dependency.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 2.4.2 Hierarchy of Numeric Progressions

<span id="part-3-base"></span>

### 1. Put iterator mechanics in a base class

A **numeric progression** is a sequence in which a rule determines each next value. The book puts the common iterator steps in `Progression` and lets subclasses supply different **advance rules**. The base itself produces `0, 1, 2, ...` by default, so it is a usable, **concrete** class.

```python
class Progression:
    def __init__(self, start=0):
        self._current = start

    def _advance(self):
        self._current += 1

    def __next__(self):
        if self._current is None:
            raise StopIteration
        answer = self._current
        self._advance()
        return answer

    def __iter__(self):
        return self
```

`next(progression)` saves and returns the **current** value, but first calls `_advance()` to prepare the next one. That call uses the actual object's method. If the object is an `ArithmeticProgression`, its overridden `_advance()` runs even though `__next__()` was inherited from `Progression`. This is **polymorphism** in the program's behavior.

The book uses `None` as a convention for the end of a possible finite progression; a subsequent `next()` then raises `StopIteration`. The progressions below keep generating numbers, so we deliberately request only a fixed number of terms.

<span id="part-3-arithmetic"></span>

### 2. Arithmetic progression: evenly spaced card positions

An **arithmetic progression** adds one fixed increment: `next = current + increment`. For left-edge ruler marks with a 4 cm step:

```python
class ArithmeticProgression(Progression):
    def __init__(self, increment=1, start=0):
        super().__init__(start)
        self._increment = increment

    def _advance(self):
        self._current += self._increment
```

Create `positions = ArithmeticProgression(4)`. Three calls to `next(positions)` yield **0, 4, 8 cm**. These are the left edges of `A`, `C`, `A` on our row. The next value would be 12 cm, but the three-card layout does not use it.

For term number `n` beginning at zero, the value is `start + n × increment`. With `start = 0` and `increment = 4`, the first three are 0, 4, and 8.

<span id="part-3-geometric"></span>

### 3. Geometric progression: square side lengths

A **geometric progression** multiplies by a fixed factor: `next = current × base`. Here “geometric” names this number pattern; it is not a synonym for every shape calculation.

```python
class GeometricProgression(Progression):
    def __init__(self, base=2, start=1):
        super().__init__(start)
        self._base = base

    def _advance(self):
        self._current *= self._base
```

If a separate cutting exercise uses square side lengths **1, 2, 4 cm**, their areas are **1² = 1**, **2² = 4**, and **4² = 16 cm²**. The three squares need **21 cm²** of material, within the same 30 cm² allowance if considered as a *new, alternative* set of cuts. Starting at 1 is useful because repeated multiplication from 0 would stay at 0.

<span id="part-3-fibonacci"></span>

### 4. Fibonacci progression: strips across the row

A **Fibonacci progression** needs the two previous values: `next = previous + current`. The book's generalized class accepts any first and second values. To make **1 cm high** rectangular strips that fill a 12 cm row, choose starting widths **1 cm and 1 cm**. The first five widths are **1, 1, 2, 3, 5 cm**, which sum to **12 cm**. Their total area is **12 cm²**.

```python
class FibonacciProgression(Progression):
    def __init__(self, first=0, second=1):
        super().__init__(first)
        self._previous = second - first

    def _advance(self):
        self._previous, self._current = (
            self._current,
            self._previous + self._current,
        )
```

Why store `second - first` before any value is returned? On the first advance, the new current value is `(second - first) + first = second`. For `first = 1` and `second = 1`, the initial `_previous` is 0. The first `next()` returns 1 and prepares the second 1; later advances produce 2, 3, and 5. Tuple assignment updates the two fields together using their old values.

<span id="part-3-bounded"></span>

### 5. Keep stateful progressions bounded in examples

Unlike our finite three-mark `Range` from Section 2.3, these progression objects **are their own iterators**. A call to `next()` consumes one value and leaves the object ready for the next. A `for` loop over the default progression would continue indefinitely, so take only the terms needed for the study case:

```python
positions = ArithmeticProgression(4)
left_edges = [next(positions) for _ in range(3)]  # [0, 4, 8]
next(positions)                                    # 12, not 0
```

For a fresh run beginning at 0, construct a new `ArithmeticProgression(4)`. The book's `print_progression(n)` helper likewise asks for exactly `n` values; it also advances the same iterator.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 2.4.3 Abstract Base Classes

<span id="part-4-abstract"></span>

### 1. Separate an abstract role from a formal abstract class

The book designed `Progression` mainly to share code, yet `Progression()` works. It is therefore **concrete**, even though it plays a base-class role. A **formal abstract base class** declares methods that a concrete child must provide and cannot itself be instantiated while those methods remain abstract.

```python
from abc import ABC, abstractmethod


class AbstractMarks(ABC):
    @abstractmethod
    def __len__(self):
        pass

    @abstractmethod
    def __getitem__(self, index):
        pass

    def contains(self, value):
        return any(self[index] == value for index in range(len(self)))
```

`AbstractMarks()` raises `TypeError`. A child that implements only `__len__` still cannot be instantiated; it also needs `__getitem__`. Merely inheriting from `ABC` does not make every method abstract: the `@abstractmethod` declarations are what set these requirements. The concrete `contains()` method is a **template method**: it is written once in the base and works when a child supplies the two missing operations. See the [Python `abc` documentation](https://docs.python.org/3/library/abc.html).

<span id="part-4-sequence"></span>

### 2. Let a sequence base class supply shared methods

The book illustrates the same pattern with a simplified `Sequence`: it requires `__len__` and `__getitem__`, then builds `__contains__`, `index`, and `count` from them. Python already provides this abstraction. In current Python, import it from **`collections.abc`**:

```python
from collections.abc import Sequence
```

The older book prints `collections.Sequence`; that location is obsolete for runnable current-Python examples. The standard [`Sequence` documentation](https://docs.python.org/3/library/collections.abc.html) lists `__len__` and `__getitem__` as required and provides `__contains__`, `__iter__`, `__reversed__`, `index`, and `count` as inherited methods. The base can use the child's indexed values without knowing whether they are stored in a list or calculated from a formula.

<span id="part-4-range"></span>

### 3. Upgrade the ruler-mark `Range`

Our Section 2.3 `Range` can become a `Sequence` subclass while retaining its start/step/length representation:

```python
class Range(Sequence):
    def __len__(self):
        return self._length

    def __getitem__(self, index):
        if not isinstance(index, int):
            raise TypeError("index must be an integer")
        if index < 0:
            index += len(self)
        if not 0 <= index < len(self):
            raise IndexError("range index out of bounds")
        return self._start + index * self._step
```

The complete version below includes `__init__`. For `marks = Range(0, 12, 4)`, the stored rule represents **0, 4, 8**. We get `marks.count(4) == 1`, `marks.index(8) == 2`, and `8 in marks` without writing those three search methods in `Range`. An out-of-range integer index must raise `IndexError`; the inherited iteration depends on that signal to stop.

This `Range` is a **finite, reusable sequence**: two calls to `list(marks)` each produce `[0, 4, 8]`. `ArithmeticProgression(4)` is an **unbounded, stateful iterator**: its next call resumes where the last one left off. Both can describe the same first three x coordinates, but they serve different uses.

<span id="part-4-membership"></span>

### 4. Override a generic search when arithmetic suffices

The inherited `Sequence.__contains__` can examine marks one by one. For a very long regular ruler, we can ask whether a target is aligned with the step and has a valid index. This follows the book's suggested `Range.__contains__` improvement:

```python
class FastRange(Range):
    def __contains__(self, value):
        if not isinstance(value, int):
            return super().__contains__(value)
        offset = value - self._start
        return offset % self._step == 0 and 0 <= offset // self._step < len(self)
```

For `FastRange(0, 2_000_000, 100)`, **100,000** is present because it is **1,000 steps** from zero and that index is in range. A value such as **100,050** is absent because it is not a multiple of the 100 cm step. The same quotient test works for a negative step. The non-integer fallback keeps normal sequence equality behavior, for example `4.0 in FastRange(0, 12, 4)` remains true. This override uses `Range`'s nonpublic `_start` and `_step`, so it has the same representation dependency discussed earlier.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. The complete program

Save this as `inheritance_geometry.py` and run it with `python inheritance_geometry.py`. It joins the budget, progression, and sequence examples without treating area and length as interchangeable.

```python
from collections.abc import Sequence


class Rectangle:
    """A rectangular card with positive dimensions in centimetres."""

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
    """Track cards against a material-area allowance."""

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


class TrackedCardBudget(CardBudget):
    """Keep the area rule and count failed reservation attempts."""

    def __init__(self, area_limit):
        super().__init__(area_limit)
        self._rejected_attempts = 0

    def reserve(self, card):
        success = super().reserve(card)
        if not success:
            self._rejected_attempts += 1
        return success

    def rejection_count(self):
        return self._rejected_attempts

    def remaining_area(self):
        return self._area_limit - self.used_area()


class Progression:
    """An iterator whose default values are 0, 1, 2, ..."""

    def __init__(self, start=0):
        self._current = start

    def _advance(self):
        self._current += 1

    def __next__(self):
        if self._current is None:
            raise StopIteration
        answer = self._current
        self._advance()
        return answer

    def __iter__(self):
        return self

    def print_progression(self, count):
        print(" ".join(str(next(self)) for _ in range(count)))


class ArithmeticProgression(Progression):
    def __init__(self, increment=1, start=0):
        super().__init__(start)
        self._increment = increment

    def _advance(self):
        self._current += self._increment


class GeometricProgression(Progression):
    def __init__(self, base=2, start=1):
        super().__init__(start)
        self._base = base

    def _advance(self):
        self._current *= self._base


class FibonacciProgression(Progression):
    def __init__(self, first=0, second=1):
        super().__init__(first)
        self._previous = second - first

    def _advance(self):
        self._previous, self._current = (
            self._current,
            self._previous + self._current,
        )


class Range(Sequence):
    """A finite sequence of integer ruler marks, like a small range."""

    def __init__(self, start, stop=None, step=1):
        if stop is None:
            start, stop = 0, start
        if not all(isinstance(value, int) for value in (start, stop, step)):
            raise TypeError("range arguments must be integers")
        if step == 0:
            raise ValueError("step cannot be zero")
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
            raise IndexError("range index out of bounds")
        return self._start + index * self._step


def main():
    sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
    budget = TrackedCardBudget(30)

    for label in ("A", "C", "A"):
        budget.reserve(Rectangle(*sizes[label]))
    b_accepted = budget.reserve(Rectangle(*sizes["B"]))

    positions = ArithmeticProgression(4)
    left_edges = [next(positions) for _ in range(3)]

    side_progression = GeometricProgression(2, 1)
    square_sides = [next(side_progression) for _ in range(3)]
    square_areas = [side * side for side in square_sides]

    width_progression = FibonacciProgression(1, 1)
    strip_widths = [next(width_progression) for _ in range(5)]

    marks = Range(0, 12, 4)

    print("Reserved cards:", budget.card_count())
    print("Reserved area:", budget.used_area(), "cm^2")
    print("Separate borders:", budget.total_border(), "cm")
    print("B accepted:", b_accepted)
    print("Rejected requests:", budget.rejection_count())
    print("Material remaining:", budget.remaining_area(), "cm^2")
    print("Card left edges:", left_edges)
    print("Ruler marks:", list(marks))
    print("8 cm mark index:", marks.index(8))
    print("4 cm mark count:", marks.count(4))
    print("6 cm is a mark:", 6 in marks)
    print("Square sides:", square_sides, "cm")
    print("Square areas:", square_areas, "cm^2")
    print("Strip widths:", strip_widths, "cm; total:", sum(strip_widths), "cm")


if __name__ == "__main__":
    main()
```

`Rectangle` and `CardBudget` carry forward the earlier workshop rules. `TrackedCardBudget` changes only what happens when a reservation fails. The progression subclasses inherit `__next__()` and replace `_advance()`. `Range` supplies the two methods required by `Sequence`, then uses the inherited searches.

<span id="part-5-trace"></span>

### 2. Trace the output

| Step | Calculation or method call | Result |
| :--- | :--- | :--- |
| Reserve `A`, `C`, `A` | `6 + 16 + 6` | 28 cm² used; 3 cards. |
| Try `B` | `28 + 8 > 30` | Refused; 28 cm² still used; rejection count 1. |
| Compute card positions | Start 0, add 4 twice. | 0, 4, 8 cm. |
| Compute square sizes | Start 1, multiply by 2 twice. | Sides 1, 2, 4 cm; areas 1, 4, 16 cm². |
| Compute strip widths | Begin 1, 1; add previous two. | 1, 1, 2, 3, 5 cm; total 12 cm. |
| Search finite ruler marks | `Range(0, 12, 4)` | Marks 0, 4, 8; 8 is at index 2. |

Running the program prints:

```text
Reserved cards: 3
Reserved area: 28 cm^2
Separate borders: 36 cm
B accepted: False
Rejected requests: 1
Material remaining: 2 cm^2
Card left edges: [0, 4, 8]
Ruler marks: [0, 4, 8]
8 cm mark index: 2
4 cm mark count: 1
6 cm is a mark: False
Square sides: [1, 2, 4] cm
Square areas: [1, 4, 16] cm^2
Strip widths: [1, 1, 2, 3, 5] cm; total: 12 cm
```

The square set and strip set are **alternative study cases**, not extra reservations against the already-used 28 cm² budget. If we wanted to cut either set, we would check it against a fresh allowance and separately check its physical layout.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does the tracked budget keep the parent's area rule?</strong></summary>

**Scenario:** A tracked budget accepts `A`, `C`, `A`, then receives a request for `B`.

**Problem:** The new counter must not let a rejected 8 cm² card enter the budget or change its reserved area.

**Fix:** `TrackedCardBudget.reserve()` asks `super().reserve(card)` to make the decision. It increments its counter only when the returned value is `False`, then returns that same value.

**Result:** Three cards remain reserved, area stays at 28 cm², and exactly one request is counted as rejected. The object still behaves as a `CardBudget` for callers of the parent interface.

</details>

<details>
<summary><strong>Case Study 2: Why does the arithmetic progression produce 0 before 4?</strong></summary>

**Scenario:** Place three cards at left edges 0, 4, and 8 cm.

**Problem:** Updating `_current` before saving the answer would skip the starting mark.

**Fix:** In `Progression.__next__`, save `answer = self._current`, call the child's `_advance()`, and then return `answer`.

**Result:** The first three calls give 0, 4, 8. A fourth call on the same object gives 12 because the iterator keeps its place.

</details>

<details>
<summary><strong>Case Study 3: What if square growth starts at zero?</strong></summary>

**Scenario:** A square-side progression multiplies each length by 2.

**Problem:** Starting at 0 produces 0, 0, 0, ...; no positive square appears.

**Fix:** Start at 1 cm. The sides 1, 2, 4 cm give areas 1, 4, 16 cm².

**Result:** The areas total 21 cm² for this separate cutting exercise. The **side lengths** double, while the **areas** multiply by 4 each step.

</details>

<details>
<summary><strong>Case Study 4: How can Fibonacci start with two equal strip widths?</strong></summary>

**Scenario:** Fill a 12 cm row with 1 cm high strips of widths 1, 1, 2, 3, 5 cm.

**Problem:** The class must know enough history to produce the requested second 1 after returning the first 1.

**Fix:** Initialize `_current = first = 1` and `_previous = second - first = 0`; the first advance makes the next current value `0 + 1 = 1`.

**Result:** The five widths total 12 cm and their 1 cm height makes a 12 cm² strip area.

</details>

<details>
<summary><strong>Case Study 5: Why can `Range` inherit `count()` and `index()`?</strong></summary>

**Scenario:** The finite ruler holds marks 0, 4, and 8 cm.

**Problem:** Hand-writing a search for every sequence operation repeats logic.

**Fix:** `Range` inherits from `Sequence` and implements `__len__` plus `__getitem__`. The base class uses them to provide `count`, `index`, iteration, and membership.

**Result:** `marks.count(4)` is 1 and `marks.index(8)` is 2. An invalid indexed read raises `IndexError`, allowing inherited iteration to finish.

</details>

<details>
<summary><strong>Case Study 6: When is a formula better than searching each mark?</strong></summary>

**Scenario:** A long ruler has marks every 100 cm from 0 up to, but not including, 2,000,000 cm.

**Problem:** Generic membership may check many marks to decide whether 100,000 cm is present.

**Fix:** `FastRange.__contains__` checks whether the offset is divisible by the step and whether the resulting index is in bounds.

**Result:** 100,000 cm is present at index 1,000; 100,050 cm is absent. A negative-step range uses the same integer test.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 2.4 idea | Plain-language meaning | Geometry study case |
| :--- | :--- | :--- |
| **Inheritance and “is a”** | A specific class keeps the useful behavior of a general one. | A `TrackedCardBudget` is a `CardBudget`. |
| **Overriding** | A child supplies its own implementation of a parent method. | `reserve()` also counts refused requests. |
| **Extension** | A child adds a method the parent lacks. | `rejection_count()` reports failed requests. |
| **`super()`** | Call the next implementation in the inheritance order. | The child reuses budget initialization and the area check. |
| **Nonpublic member convention** | A leading underscore asks callers to avoid depending on an internal field. | `remaining_area()` depends on the parent's `_area_limit`. |
| **Progression hierarchy** | Share the iterator protocol; override the rule for the next number. | Marks 0, 4, 8; sides 1, 2, 4; strip widths 1, 1, 2, 3, 5. |
| **Concrete versus abstract** | A concrete class can be created; a formal abstract class still has required methods to fill in. | `Progression()` works; `AbstractMarks()` cannot be created. |
| **Template method and `Sequence`** | Shared operations call a few methods supplied by each child. | `Range` provides length and indexing, then inherits `count()` and `index()`. |
| **Efficient override** | A child may replace a general scan with a correct formula. | `FastRange` tests step alignment for a long ruler. |

[🔝 Back to Top](#top)
