<span id="top"></span>

# Object-Oriented Programming — Section 2.4: Inheritance

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.4, printed pages 82–95 of the supplied PDF.  
> **Topic:** 2.4 Inheritance; 2.4.1 Extending the CreditCard Class; 2.4.2 Hierarchy of Numeric Progressions; 2.4.3 Abstract Base Classes.  
> **Domain focus:** The **MotoGP Practice session at the 2026 Indonesian Grand Prix**, Friday 9 October, at Mandalika.  
> **Learning goal:** Recognize a valid class hierarchy, reuse and override inherited methods, trace three progression rules, and use an abstract sequence base class.  
> **User Prompt:** "Reexplain [Section 2.4] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Practice Session, Several Kinds of Objects](#background-intuition)
   - [1. Keep the verified results and units together](#background-data)
   - [2. Separate recorded facts from teaching rules](#background-scenario)
2. [Part 1: Section 2.4 — Inheritance](#part-1)
   - [1. Test the “is a” relationship](#part-1-hierarchy)
   - [2. Follow method lookup and polymorphism](#part-1-dispatch)
   - [3. Read the exception hierarchy](#part-1-exceptions)
3. [Part 2: Section 2.4.1 — Extending the CreditCard Class](#part-2)
   - [1. Understand the book's subclass](#part-2-book)
   - [2. Initialize the parent and child state](#part-2-init)
   - [3. Override one operation and add another](#part-2-override)
   - [4. Recognize a nonpublic-member dependency](#part-2-members)
4. [Part 3: Section 2.4.2 — Hierarchy of Numeric Progressions](#part-3)
   - [1. Share the iterator mechanism](#part-3-base)
   - [2. Arithmetic: add a fixed difference](#part-3-arithmetic)
   - [3. Geometric: multiply by a fixed factor](#part-3-geometric)
   - [4. Fibonacci: remember two values](#part-3-fibonacci)
   - [5. Control a stateful, unbounded iterator](#part-3-state)
5. [Part 4: Section 2.4.3 — Abstract Base Classes](#part-4)
   - [1. Distinguish a concrete base from a formal ABC](#part-4-abstract)
   - [2. Inherit useful `Sequence` operations](#part-4-sequence)
   - [3. Override a generic search with arithmetic](#part-4-membership)
6. [Part 5: Complete Practice-Display Program](#part-5)
   - [1. Run the program](#part-5-program)
   - [2. Trace the output](#part-5-trace)
7. [Part 6: Small Worked Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Practice Session, Several Kinds of Objects

<span id="background-data"></span>

### 1. Keep the verified results and units together

We use the **Friday MotoGP Practice** classification at the 2026 Indonesian Grand Prix. [Yamaha Factory Racing's full results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give these positions, riders, teams, and fastest laps. The [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) also identifies Raúl Fernández as fastest in that session.

| Official Practice place | Rider | Team | Best lap | Best lap in ms | Difference from Raúl |
| :---: | :--- | :--- | ---: | ---: | ---: |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | 88,725 | +0.000 s |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | 89,426 | +0.701 s |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP | 1:29.558 | 89,558 | +0.833 s |

For example, `1:29.426` is `60,000 + 29,426 = 89,426` milliseconds. Marc's best lap took `89,426 − 88,725 = 701 ms` more than Raúl's; Fabio's took `89,558 − 88,725 = 833 ms` more. Their difference is `833 − 701 = 132 ms`. These are **best-lap differences in one Practice session**, not race finishing gaps.

**Why this example?** Marc and Fabio have two comparable results with a common reference. **How to solve the timing question:** convert all laps to milliseconds, subtract Raúl's value from each rider's value, and divide by 1,000 only when displaying seconds.

<span id="background-scenario"></span>

### 2. Separate recorded facts from teaching rules

Imagine an analyst's **two-slot Practice comparison board**. It shows Marc and Fabio beside Raúl's P1 reference. A more specialized board also counts attempts to add another result after both slots are full. A chart for the two real gaps can use calculated tick marks and other number patterns.

The board's **two-slot capacity**, refusal counter, and chart scales are teaching choices. They are not MotoGP regulations or additional recorded results. Raúl is P1 even if this hypothetical display refuses to add him while it is full.

```text
Verified Practice results
    ├── Raúl's P1 best lap: 88,725 ms (reference)
    ├── Marc's P5 best lap: 89,426 ms → +701 ms
    └── Fabio's P7 best lap: 89,558 ms → +833 ms

Teaching objects
    ├── ComparisonBoard → TrackedComparisonBoard
    ├── Progression → arithmetic / geometric / Fibonacci rules
    └── Sequence → Range → FastRange for chart marks
```

**Why this setting?** The same small display gives each inheritance example a concrete purpose. **How to read it:** identify which values came from the classification, which values were calculated from those laps, and which rules exist only in our program.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 2.4 — Inheritance

<span id="part-1-hierarchy"></span>

### 1. Test the “is a” relationship

The book starts with a **ranch is a house is a building** example. A **base class** (parent or superclass) describes a general kind of object; a **subclass** (child) is a more specific kind that inherits its available behavior. The child may **override** a method with a specialized implementation or **extend** the class with a new method.

```python
class TrackedComparisonBoard(ComparisonBoard):
    ...
```

The parentheses name the base class. A tracked comparison board **is a** comparison board: it can accept results and report its size, with extra refusal tracking. By contrast, Marc **has a** team affiliation; a rider is not a kind of team. Make Marc and Fabio **instances containing data**, not `MarcMárquez(Team)` and `FabioQuartararo(Team)` subclasses.

```text
ComparisonBoard
└── TrackedComparisonBoard

Progression
├── ArithmeticProgression
├── GeometricProgression
└── FibonacciProgression
```

`isinstance(tracked, ComparisonBoard)` is true for a `TrackedComparisonBoard` object, and `issubclass(TrackedComparisonBoard, ComparisonBoard)` is true for the classes. Both follow the “is a” relationship; neither says that the tracked object is the **same object** as an ordinary board.

**Why this example?** The board's extra counting rule gives us a genuine specialized board while keeping riders and teams as facts about results. **How to choose a parent:** ask whether every child could sensibly be used where the parent is expected, then put only their shared behavior in the parent.

<span id="part-1-dispatch"></span>

### 2. Follow method lookup and polymorphism

When `tracked.add(marc)` runs, Python finds `add` in `TrackedComparisonBoard` before looking in `ComparisonBoard`. If the child does not define `__len__`, Python finds the inherited version in the base. A subclass's method with the **same name** overrides the inherited one for that object. This lets one expression use different implementations according to the object's class: **polymorphism**.

The progression hierarchy in Part 3 makes this especially visible. The base class's `__next__()` calls `self._advance()`. With an `ArithmeticProgression` object, `self._advance()` reaches its add-a-fixed-amount override; with a `GeometricProgression`, it reaches multiplication. The base method does not need an `if` for every child type.

[`super().add(result)`](https://docs.python.org/3/library/functions.html#super) asks Python to continue method lookup **after** the class containing that call. In our single-inheritance board this reaches `ComparisonBoard.add`; with multiple inheritance, the next method follows the class's method-resolution order, so `super()` is not always simply “call the direct parent.”

**Why this example?** The same method call can preserve a common interface while producing specialized behavior. **How to trace it:** name the receiving object's class, find the first implementation in its lookup order, then follow any `super()` or `self.other_method()` calls.

<span id="part-1-exceptions"></span>

### 3. Read the exception hierarchy

The book also uses Python's exception classes as an inheritance diagram. This excerpt shows the branches needed for our examples:

```text
BaseException
├── Exception
│   ├── ValueError
│   └── LookupError
│       └── IndexError
├── KeyboardInterrupt
└── SystemExit
```

The full program raises `ValueError` for an invalid board capacity and `IndexError` for an invalid chart-mark index. Both are kinds of `Exception`, so an `except Exception:` handler would catch them. `KeyboardInterrupt` and `SystemExit` are outside that ordinary application-error branch. A custom application error would normally inherit from `Exception` or one of its suitable children.

**Why this example?** It is an existing hierarchy where the “is a” test has a practical result for error handling. **How to solve a catch question:** walk from the raised exception class up through its bases and check whether the handler names one of them.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 2.4.1 — Extending the CreditCard Class

<span id="part-2-book"></span>

### 1. Understand the book's subclass

The book defines `PredatoryCreditCard(CreditCard)`. It calls the inherited initializer with customer, bank, account, and limit; that initializer also sets the starting balance to zero. The child then stores an annual interest rate. Its `charge(price)` override asks `super().charge(price)` to make the usual credit-limit decision. If the charge is refused, it assesses a **$5 fee**, but still returns the parent's `False`. Its new `process_month()` method grows a positive balance by the monthly factor **`(1 + apr) ** (1 / 12)`**. The book uses an **effective annual rate** here: simply applying `apr / 12` every month would not produce that same annual growth.

| Book's card example | Practice-display counterpart |
| :--- | :--- |
| `PredatoryCreditCard` is a `CreditCard`. | `TrackedComparisonBoard` is a `ComparisonBoard`. |
| The child calls `super().__init__(...)` for shared fields. | The child calls the board initializer for capacity and an empty selection. |
| The `charge()` override delegates to the parent and preserves its Boolean result. | The `add()` override delegates to the parent and preserves its Boolean result. |
| `process_month()` is a new operation. | `refusal_count()` is a new operation. |

The $5 fee and interest are **features of the textbook's card**, not MotoGP rules or values in our board. The common programming shape is “reuse a decision, then add specialized behavior.”

**Why this comparison?** It maps each role in the book's code to an easily visible board operation. **How to solve an inheritance design:** identify what the parent already does, what the child must add, and which return value callers of the parent expect.

<span id="part-2-init"></span>

### 2. Initialize the parent and child state

```python
class TrackedComparisonBoard(ComparisonBoard):
    def __init__(self, capacity):
        super().__init__(capacity)
        self._refusals = 0
```

The parent initializer creates the capacity and empty selected-result list. The child adds its own counter. For `TrackedComparisonBoard(2)`, the first object begins with two free slots and zero refusals. If another tracked board is constructed, it gets a **separate** list and counter. When a subclass defines `__init__`, Python does **not** automatically run the base initializer; the explicit `super().__init__(capacity)` matters.

**Why this example?** Two short lines show which class owns each part of the new object's state. **How to trace it:** enter the child's initializer, follow `super().__init__` to create the inherited fields, then return and set the child's counter.

<span id="part-2-override"></span>

### 3. Override one operation and add another

```python
    def add(self, result):
        accepted = super().add(result)
        if not accepted:
            self._refusals += 1
        return accepted

    def refusal_count(self):
        return self._refusals
```

The base `add()` decides whether there is room. The override observes that result and counts a refusal, but returns the **same** `True` or `False` to the caller. With capacity two, adding Marc and Fabio succeeds. Attempting to add Raúl next returns `False`, leaves the selection unchanged, and changes the refusal count from `0` to `1`. This refusal is caused only by the **hypothetical display capacity**; Raúl's official Practice position is P1.

`refusal_count()` is an **extension** because the base board has no method by that name. An ordinary board user can still call `add()` and `len()` on the tracked child; a caller that knows it has the child can also inspect its refusal count.

**Why this example?** It checks that the child adds information without losing the parent's accepted/refused contract. **How to solve the trace:** check the parent result first, increment the counter only for `False`, and verify both the return value and selected-list length.

<span id="part-2-members"></span>

### 4. Recognize a nonpublic-member dependency

The book's `PredatoryCreditCard.process_month()` directly updates the inherited `_balance`. A single leading underscore is a **nonpublic convention**, not a Python access barrier. Such access can be useful, but the child now depends on the parent's internal representation. The book also explains why interest should not be added through `charge()`: the credit-limit check could refuse interest, even though interest is supposed to accrue.

Our child can expose a remaining-slot calculation using its parent's `_capacity`:

```python
    def remaining_slots(self):
        return self._capacity - len(self)
```

After Marc and Fabio are selected, this returns `0`. The direct `_capacity` access makes the same kind of parent-child dependency visible. If the board API grew, a public `capacity()` method could give the child that information without depending on the field name. A double-leading-underscore name triggers name mangling, but is not absolute privacy.

**Why this example?** It reveals a tradeoff hidden by otherwise convenient inheritance. **How to assess it:** note each child access to a parent field, ask whether the parent promises that field's meaning, and use a public method when one expresses the needed behavior.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 2.4.2 — Hierarchy of Numeric Progressions

<span id="part-3-base"></span>

### 1. Share the iterator mechanism

A **progression** produces a succession of numbers by repeatedly applying an advance rule. The book's `Progression` base class owns the common iterator behavior. Its default rule adds one, so `Progression(0)` itself produces `0, 1, 2, ...` and is a usable, **concrete** class.

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

One `next(progression)` call saves the current value, advances the object's state, and returns the **saved** value. If `_current` is `None`, the iterator has ended and raises `StopIteration`. The book allows that signal for a finite subclass, although the examples below keep generating values.

The key inheritance step is `self._advance()`. When `self` is an arithmetic child, Python uses its overridden add rule. When `self` is a Fibonacci child, Python uses its two-value rule. `__next__()` is written once but works for every child.

**Why this example?** It isolates the shared “return one value, then prepare the next” mechanism from the rule that changes. **How to trace it:** write `_current` before the call, save that as `answer`, apply the object's `_advance()`, then report the saved answer and new state.

<span id="part-3-arithmetic"></span>

### 2. Arithmetic: add a fixed difference

An **arithmetic progression** uses `next = current + increment`:

```python
class ArithmeticProgression(Progression):
    def __init__(self, increment=1, start=0):
        super().__init__(start)
        self._increment = increment

    def _advance(self):
        self._current += self._increment
```

Marc's difference from Raúl is **701 ms** and Fabio's is **833 ms**; their difference is **132 ms**. Starting an arithmetic progression at `701` with increment `132` yields:

| Term | Calculation | Value | Status |
| :---: | :--- | ---: | :--- |
| 0 | Start | 701 ms | Marc's calculated Practice gap. |
| 1 | `701 + 132` | 833 ms | Fabio's calculated Practice gap. |
| 2 | `833 + 132` | 965 ms | Teaching value generated by the rule. |

The **third term is not another rider's result or a prediction**. We chose this starting pair only to make the constant increment visible beside the two real gaps.

**Why this example?** The two real gaps happen to give an easy fixed difference. **How to solve it:** subtract the first term from the second to find the increment, then add that same amount once per new term, labeling generated terms separately from the observations.

<span id="part-3-geometric"></span>

### 3. Geometric: multiply by a fixed factor

A **geometric progression** uses `next = current × base`:

```python
class GeometricProgression(Progression):
    def __init__(self, base=2, start=1):
        super().__init__(start)
        self._base = base

    def _advance(self):
        self._current *= self._base
```

For a hypothetical timing chart that offers successively wider comparison windows, choose `start=125 ms` and `base=2`. The values are **125, 250, 500, 1000 ms**. Each is twice the one before it. Both Marc's `701 ms` and Fabio's `833 ms` gaps are less than the `1000 ms` window, but the window sizes are **display settings**, not official lap data. The book defaults to `start=1`; starting at zero with repeated multiplication would remain zero forever.

**Why this example?** A doubling scale makes multiplication visibly different from the arithmetic class's fixed addition. **How to solve it:** start with the first chosen width and multiply by the same factor for each next width; never infer a rider's performance from those generated widths.

<span id="part-3-fibonacci"></span>

### 4. Fibonacci: remember two values

A **Fibonacci-style progression** uses `next = previous + current`, so it needs two pieces of state. The book's generalized class lets us choose the first two values:

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

Use the two calculated Practice gaps as **starting numbers**, `first=701` and `second=833` milliseconds. Then `_previous` begins at `833 − 701 = 132`. The first call to `next()` returns `701` and advances `_current` to `132 + 701 = 833`. Later terms are `701 + 833 = 1534` and `833 + 1534 = 2367`.

```text
Returned terms: 701, 833, 1534, 2367, ...
                Marc  Fabio   generated teaching values
```

The later terms are **mathematical outputs**, not further 2026 Practice gaps, lap times, or predictions. The tuple assignment computes both new fields from the **old** fields before storing either result; updating one field alone first would spoil the recurrence.

**Why this example?** The first two real differences give a short trace of why `second - first` is needed. **How to solve it:** write down the two starting values, calculate the initial `_previous`, then for each `next()` return the old current and update the pair together.

<span id="part-3-state"></span>

### 5. Control a stateful, unbounded iterator

These progression objects are **their own iterators**: `iter(progression) is progression`. Calling `next()` consumes one term; it does not restart the object. The book's `print_progression(n)` requests exactly `n` terms and also consumes them. A bare `for value in ArithmeticProgression(...)` would keep running because this class never sets `_current` to `None`.

```python
steps = ArithmeticProgression(132, 701)
first_three = [next(steps) for _ in range(3)]  # [701, 833, 965]
next(steps)                                    # 1097, not 701
```

The book's Fragment 2.12 prints demonstration sequences and Fragment 2.13 shows their output; the driver has **no assertions**, so its printed lines need checking if used as a test. Our complete program prints a bounded number of terms and checks those lines against hand calculations.

**Why this example?** It prevents a common mistake: expecting a reused iterator to begin again. **How to solve it:** request only the terms needed, track how many `next()` calls have happened, and construct a fresh progression when a fresh start is required.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 2.4.3 — Abstract Base Classes

<span id="part-4-abstract"></span>

### 1. Distinguish a concrete base from a formal ABC

The book designed `Progression` mainly to share code, but `Progression()` still works. It is therefore **concrete**, even though it plays a parent role. A formal **abstract base class** (ABC) declares behavior a usable child must provide. In Python, [`@abstractmethod`](https://docs.python.org/3/library/abc.html#abc.abstractmethod) marks a requirement:

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

`AbstractMarks()` raises `TypeError` because two required methods are missing. A child that implements only `__len__` still cannot be constructed. `contains()` is already implemented: once a child supplies both missing operations, that shared method can work with the child's values. Inheriting `ABC` alone does **not** make a class uninstantiable; the abstract methods do.

**Why this example?** It shows an exact contract for a collection of chart marks. **How to solve a subclass requirement:** list the inherited abstract methods, implement every one with the promised behavior, and then use the inherited concrete methods.

<span id="part-4-sequence"></span>

### 2. Inherit useful `Sequence` operations

The book's simplified `Sequence` ABC requires `__len__` and `__getitem__`, then supplies `__contains__`, `index`, and `count` using those two methods. Modern Python provides this pattern in [`collections.abc.Sequence`](https://docs.python.org/3/library/collections.abc.html):

```python
from collections.abc import Sequence

class Range(Sequence):
    def __len__(self):
        return self._length

    def __getitem__(self, index):
        # Check index, then calculate start + index × step.
        ...
```

The complete `Range` below fills in initialization and indexing. It stores **start, step, and length**, like Section 2.3's range example; it calculates a mark only when asked. The book writes `collections.Sequence`, which is historical; `collections.abc.Sequence` is the current import. Unlike the book's simplified sketch, today's `Sequence` also supplies iteration and reverse iteration.

For the hypothetical chart marks `Range(0, 1001, 250)`, the values are `0, 250, 500, 750, 1000` milliseconds. Without defining any search methods in `Range`:

| Expression | Result | What the inherited method does |
| :--- | :--- | :--- |
| `750 in marks` | `True` | Searches for a matching value. |
| `701 in marks` | `False` | Marc's real gap is between marks. |
| `marks.index(750)` | `3` | Finds the first matching index. |
| `marks.count(500)` | `1` | Counts equal values. |

The inherited iteration requires `__getitem__` to raise `IndexError` beyond the final mark. Python's built-in `range` already offers a fuller implementation; our small class exposes how inheritance supplies the operations.

**Why this example?** The real `701 ms` gap lets us ask a concrete membership question about a teaching scale. **How to solve it:** implement length and indexed values first, list the five small values by hand, then check membership, index, and count against that list.

<span id="part-4-membership"></span>

### 3. Override a generic search with arithmetic

The inherited `Sequence.__contains__` may inspect values one at a time. Regular integer marks permit a faster calculation: a target belongs when its offset from the start is a whole number of steps **and** its calculated index is in bounds.

```python
class FastRange(Range):
    def __contains__(self, value):
        if type(value) is not int:
            return super().__contains__(value)
        offset = value - self._start
        return offset % self._step == 0 and 0 <= offset // self._step < len(self)
```

For `FastRange(0, 1001, 250)`, `750 − 0 = 750`; `750 / 250 = 3`, a valid index, so `750 in fast_marks` is true. `701 % 250 = 201`, so Marc's `701 ms` gap is not itself a tick. The same divisibility-and-index rule works for negative steps. A value that is not a built-in `int` falls back to the parent search, preserving sequence equality such as `750.0 == 750` and the behavior of custom integer subclasses.

This specialized override checks integer membership without scanning all chart marks. It accesses inherited `_start` and `_step`, so it carries the same nonpublic-field dependency discussed in Part 2.

**Why this example?** It shows that inheritance can provide a correct general method while a child supplies a more efficient method for its special representation. **How to solve membership:** subtract the start, check divisibility by the step, then check the resulting index against the sequence length.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Complete Practice-Display Program

<span id="part-5-program"></span>

### 1. Run the program

Save this code as a `.py` file and run it with Python 3. The three result objects contain sourced facts from one session. The board rules and generated chart numbers are explicitly teaching features.

```python
from collections.abc import Sequence


SESSION = "2026 Indonesian GP MotoGP Practice, 9 October"


class PracticeResult:
    def __init__(self, session, place, rider, team, lap_ms):
        if type(lap_ms) is not int or lap_ms <= 0:
            raise ValueError("lap_ms must be a positive integer")
        self.session = session
        self.place = place
        self.rider = rider
        self.team = team
        self.lap_ms = lap_ms

    def gap_ms(self, reference):
        if self.session != reference.session:
            raise ValueError("results must be from the same session")
        return self.lap_ms - reference.lap_ms


class ComparisonBoard:
    def __init__(self, capacity):
        if type(capacity) is not int or capacity <= 0:
            raise ValueError("capacity must be a positive integer")
        self._capacity = capacity
        self._selected = []

    def add(self, result):
        if len(self._selected) >= self._capacity:
            return False
        self._selected.append(result)
        return True

    def __len__(self):
        return len(self._selected)

    def __getitem__(self, index):
        return self._selected[index]


class TrackedComparisonBoard(ComparisonBoard):
    def __init__(self, capacity):
        super().__init__(capacity)
        self._refusals = 0

    def add(self, result):
        accepted = super().add(result)
        if not accepted:
            self._refusals += 1
        return accepted

    def refusal_count(self):
        return self._refusals

    def remaining_slots(self):
        return self._capacity - len(self)


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

    def print_progression(self, n):
        if type(n) is not int or n < 0:
            raise ValueError("n must be a nonnegative integer")
        print(" ".join(str(next(self)) for _ in range(n)))


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
    def __init__(self, start, stop=None, step=1):
        if stop is None:
            start, stop = 0, start
        if any(type(value) is not int for value in (start, stop, step)):
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


class FastRange(Range):
    def __contains__(self, value):
        if type(value) is not int:
            return super().__contains__(value)
        offset = value - self._start
        return offset % self._step == 0 and 0 <= offset // self._step < len(self)


def main():
    raul = PracticeResult(
        SESSION, 1, "Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 88725
    )
    marc = PracticeResult(SESSION, 5, "Marc Márquez", "Ducati Lenovo Team", 89426)
    fabio = PracticeResult(
        SESSION, 7, "Fabio Quartararo", "Monster Energy Yamaha MotoGP", 89558
    )

    board = TrackedComparisonBoard(2)
    print("Tracked board is a board:", isinstance(board, ComparisonBoard))
    print("Marc added:", board.add(marc))
    print("Fabio added:", board.add(fabio))
    print("Raúl added while full:", board.add(raul))
    print("Refused attempts:", board.refusal_count())
    print("Remaining slots:", board.remaining_slots())
    for result in board:
        print("{} ({}; P{}): +{:.3f} s to Raúl".format(
            result.rider, result.team, result.place,
            result.gap_ms(raul) / 1000
        ))

    arithmetic = ArithmeticProgression(132, 701)
    print("Arithmetic illustration (ms):", end=" ")
    arithmetic.print_progression(3)
    print("Next arithmetic term (teaching):", next(arithmetic))
    geometric = GeometricProgression(2, 125)
    print("Geometric chart widths (ms):", end=" ")
    geometric.print_progression(4)
    fibonacci = FibonacciProgression(701, 833)
    print("Fibonacci illustration (ms):", end=" ")
    fibonacci.print_progression(4)

    marks = Range(0, 1001, 250)
    print("Marks are a Sequence:", isinstance(marks, Sequence))
    print("Chart marks (ms):", list(marks))
    print("701 in marks:", 701 in marks)
    print("750 in marks:", 750 in marks)
    print("Index of 750:", marks.index(750))
    print("Count of 500:", marks.count(500))
    fast_marks = FastRange(0, 1001, 250)
    print("Fast search, 750:", 750 in fast_marks)
    print("Fast search, 701:", 701 in fast_marks)


if __name__ == "__main__":
    main()
```

`PracticeResult` keeps rider, team, official Practice place, session, and best lap together. `ComparisonBoard` implements the capacity rule; its child adds a refusal counter without copying the parent's rule. The progressions share `__next__` but change `_advance`. `Range` provides the two required `Sequence` methods and gains the inherited search methods. This small `Range` supports integer indexing, including negative indexes, but not slicing or every feature of Python's built-in `range`.

**Why one combined program?** It puts each inheritance relationship into an operation we can inspect. **How to solve it:** create the result objects, trace the board's three additions, request a fixed number of terms from each progression, then compare the chart-mark searches against the five marks written out by hand.

<span id="part-5-trace"></span>

### 2. Trace the output

```text
Tracked board is a board: True
Marc added: True
Fabio added: True
Raúl added while full: False
Refused attempts: 1
Remaining slots: 0
Marc Márquez (Ducati Lenovo Team; P5): +0.701 s to Raúl
Fabio Quartararo (Monster Energy Yamaha MotoGP; P7): +0.833 s to Raúl
Arithmetic illustration (ms): 701 833 965
Next arithmetic term (teaching): 1097
Geometric chart widths (ms): 125 250 500 1000
Fibonacci illustration (ms): 701 833 1534 2367
Marks are a Sequence: True
Chart marks (ms): [0, 250, 500, 750, 1000]
701 in marks: False
750 in marks: True
Index of 750: 3
Count of 500: 1
Fast search, 750: True
Fast search, 701: False
```

The board prints Marc and Fabio in **selection order**. Their `P5` and `P7` labels are the **official Practice places**; they do not become P1 and P2 because the display shows two rows. Raúl's refused addition is solely a board-capacity outcome. The arithmetic terms `965` and `1097`, all geometric widths, and the Fibonacci terms after `833` are generated teaching values.

The `Range` object stores three numbers describing a rule, while `list(marks)` builds a five-item list for this output. The inherited `Sequence` searches and the overridden `FastRange` search agree on the two membership questions.

**Why trace the output?** It checks both inherited behavior and the numbers the subclass adds or generates. **How to verify it:** write the board state after each addition, calculate each progression's next term by hand, and enumerate the five chart marks before checking the search lines.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Small Worked Cases

1. **Choose the inheritance relationship.** Should `MarcMárquez` inherit from `DucatiLenovoTeam`, or should `TrackedComparisonBoard` inherit from `ComparisonBoard`? **Why this case?** Class relationships must describe kinds of objects, not just facts that happen to be related. **Solve:** Marc has a team affiliation, so a result object stores his rider and team as fields. A tracked board is still a comparison board, so it can inherit from `ComparisonBoard`.

2. **Trace a refused addition.** A new `TrackedComparisonBoard(2)` accepts Marc and Fabio. What happens when the analyst next calls `board.add(raul)`? **Why this case?** It exercises the override's path that differs from the parent. **Solve:** `super().add(raul)` finds two selected objects and returns `False` without appending. The child increments `_refusals` to `1` and returns `False`. `len(board)` remains `2`, and Raúl remains the actual P1 rider in the source classification.

3. **Find a missing initializer.** Suppose the child sets `_refusals = 0` in its `__init__` but omits `super().__init__(capacity)`. Why will a later inherited `add()` fail? **Why this case?** It tests whether inheritance was mistaken for automatic field initialization. **Solve:** the parent initializer never created `_capacity` or `_selected`; the parent's `add()` tries to read them. Call `super().__init__(capacity)` before setting the child field.

4. **Advance, then advance again.** For `ArithmeticProgression(132, 701)`, what follows three calls to `next()`? For `FibonacciProgression(701, 833)`, what is its third term? **Why this case?** Both questions require tracking state rather than rereading the starting values. **Solve:** arithmetic returns `701, 833, 965`, so the fourth call returns `1097`. Fibonacci returns `701, 833, 1534`, because `701 + 833 = 1534`. Values after the first two real gaps are generated teaching numbers.

5. **Complete an ABC contract.** A subclass of `Sequence` defines `__len__` but no `__getitem__`. Can it be constructed and used as a sequence? **Why this case?** It reveals the difference between a parent that merely shares code and an ABC that enforces required methods. **Solve:** no: `__getitem__` remains abstract, so construction raises `TypeError`. Implement indexed values and an out-of-range `IndexError`; then the inherited iteration, membership, `index`, and `count` can work.

6. **Check a reverse chart scale.** What does `FastRange(1000, -1, -250)` contain, and does it contain `750` or `701`? **Why this case?** A negative step checks that the arithmetic override works in both directions. **Solve:** the marks are `1000, 750, 500, 250, 0`. For `750`, the offset is `-250`, divisible by the step `-250`, with index `1`, so membership is true. `701` is not aligned to the step, so membership is false. These are hypothetical chart marks, not Practice measurements.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 2.4 idea | What to remember | Practice-display check |
| :--- | :--- | :--- |
| Inheritance | A child is a more specific kind of its base and inherits shared behavior. | A `TrackedComparisonBoard` is a `ComparisonBoard`; a rider has a team. |
| `super()` and overriding | Reuse the next implementation in method-resolution order and preserve the parent's contract. | A full board returns `False`, stays full, and records one refusal. |
| Progression hierarchy | One `__next__()` delegates its advance rule to the actual object's `_advance()`. | Arithmetic gives `701, 833, 965`; only the first two are real calculated gaps. |
| Abstract base class | Abstract methods state what a concrete child must provide; concrete inherited methods can use them. | `Range` implements length and indexing, then inherits sequence searches. |
| Specialized method | A child can override a correct generic method for its representation. | `FastRange` checks regular integer marks by divisibility and bounds. |

Keep **source facts**, **calculated Practice gaps**, and **generated teaching values** labeled separately. The riders, teams, positions, and fastest laps come from the cited 2026 Indonesian GP Practice classification. The board capacity, refusal counter, and chart scales exist only to make the inheritance behavior visible.

[🔝 Back to Top](#top)
