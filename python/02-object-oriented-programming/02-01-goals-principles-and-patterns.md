<span id="top"></span>

# 2.1 Goals, Principles, and Patterns — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.1, printed pages 57–61 (the supplied PDF).  
> **Topic:** 2.1 Goals, Principles, and Patterns; 2.1.1 Object-Oriented Design Goals; 2.1.2 Object-Oriented Design Principles; 2.1.3 Design Patterns.  
> **Domain Focus:** The rectangular cards from Chapter 1: positive dimensions, area, border length, and a classroom display.  
> **User Prompt:** Reexplain Section 2.1 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The familiar measurements](#background-cards)
   - [2. Why organize the program around objects?](#background-design)
2. [Part 1: 2.1 Goals, Principles, and Patterns](#part-1)
   - [1. Objects, classes, and the public view](#part-1-objects)
   - [2. Three kinds of design advice](#part-1-map)
3. [Part 2: 2.1.1 Object-Oriented Design Goals](#part-2)
   - [1. Robustness](#part-2-robustness)
   - [2. Adaptability](#part-2-adaptability)
   - [3. Reusability](#part-2-reusability)
4. [Part 3: 2.1.2 Object-Oriented Design Principles](#part-3)
   - [1. Modularity](#part-3-modularity)
   - [2. Abstraction and abstract data types](#part-3-abstraction)
   - [3. Duck typing and abstract base classes](#part-3-interfaces)
   - [4. Encapsulation](#part-3-encapsulation)
5. [Part 4: 2.1.3 Design Patterns](#part-4)
   - [1. What a pattern records](#part-4-template)
   - [2. The two pattern groups in the book](#part-4-groups)
   - [3. Two small geometry previews](#part-4-previews)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. Build and use rectangle objects](#part-5-program)
   - [2. Trace the result](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The familiar measurements

Our Chapter 1 study guides described three rectangular cards by their width and height. We will keep the same measurements, in centimetres:

| Card | Width | Height | Area = width × height | Perimeter = 2 × (width + height) |
| :--- | ----: | -----: | --------------------: | -------------------------------: |
| `A`  |  2 cm |   3 cm |                 6 cm² |                            10 cm |
| `B`  |  4 cm |   2 cm |                 8 cm² |                            12 cm |
| `C`  |  4 cm |   4 cm |                16 cm² |                            16 cm |

Choosing `A`, `C`, and another `A` means **three physical cards**. Their total area is **6 + 16 + 6 = 28 cm²**. If each card gets its *own* border, the total border length is **10 + 16 + 10 = 36 cm**. That 36 cm is the sum of three individual perimeters; it is not the perimeter of a combined arrangement.

<span id="background-design"></span>

### 2. Why organize the program around objects?

We could keep widths, heights, and formulas scattered through a program. As the workshop grows, a card report might need area, a cutting plan might need perimeter, and both must reject impossible dimensions. Repeating those rules in several places makes changes harder.

An object-oriented design gives a rectangular card its measurements and operations such as `area()` and `perimeter()`. Other code can ask a card for a result without repeating its formula. The arithmetic is simple; the point of this section is **how to organize the code that uses it**.

```text
card A: width 2 cm, height 3 cm
        ├─ area()      → 6 cm²
        └─ perimeter() → 10 cm
```

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 2.1 Goals, Principles, and Patterns

<span id="part-1-objects"></span>

### 1. Objects, classes, and the public view

An **object** is an instance of a **class**. A class describes what its objects know and can do. It typically defines **instance variables** (data members) and **methods** (member functions). For a rectangle, the dimensions are data; `area()` is a method.

The class gives other parts of the program a concise, consistent **public view**. A card report needs to know that `card.area()` returns an area. It need not know how the rectangle stores its dimensions or calculates the answer. The public methods and their promised behavior form an **interface**; the stored values and method bodies are part of the **implementation**.

<span id="part-1-map"></span>

### 2. Three kinds of design advice

| Kind | Question it answers | Rectangle-card example |
| :--- | :--- | :--- |
| **Goal** | What quality should the program have? | Reject a negative width clearly. |
| **Principle** | How should we organize the program to reach that goal? | Put the width check in the rectangle class. |
| **Pattern** | What named solution template may fit a recurring problem? | Adapt an older `(width, height)` record to an `area()` interface. |

The next three parts follow the book's order: **goals**, **principles**, then **patterns**. A goal is an outcome; a principle is design guidance; a pattern describes a solution shape that can be reused when its context fits.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 2.1.1 Object-Oriented Design Goals

The book names three main goals: **robustness**, **adaptability**, and **reusability**.

<span id="part-2-robustness"></span>

### 1. Robustness

A program should be correct for its expected inputs and handle unexpected inputs sensibly. A width of `2` cm and height of `3` cm give a valid 6 cm² card. A width of `-2` cm is not a physical rectangle; silently reporting `-6 cm²` would be misleading.

```python
if width <= 0 or height <= 0:
    raise ValueError("width and height must be positive")
```

The check makes the invalid value visible where a rectangle is created. A caller can catch the error and ask for new measurements. Robustness does not require inventing an area for an impossible card.

The book cites the Therac-25 radiation-therapy accidents as a grave example of the harm software errors can cause. Our card measurements are low stakes, but the same habit of checking assumptions matters.

<span id="part-2-adaptability"></span>

### 2. Adaptability

Requirements change. The workshop first asks for area to cover the display board. Later it asks for border tape around each card. If rectangle behavior is in one class, we can add `perimeter()` and keep existing `area()` calls working:

```python
def perimeter(self):
    return 2 * (self._width + self._height)
```

For card `A`, this returns **2 × (2 + 3) = 10 cm**. The book also mentions **portability**: running on different platforms with minimal changes. Portability is related to adaptability, though the three named goals here are robustness, adaptability, and reusability.

<span id="part-2-reusability"></span>

### 3. Reusability

A useful component can serve more than one application. A classroom display-report application can import `Rectangle` to total areas; a separate cutting-plan application can import the same class to total individual border lengths. Reuse means the same tested rectangle behavior serves both systems. The single-file program below runs both calculations together so you can study them in one place.

| Application | It asks each card for... | `A`, `C`, `A` result |
| :--- | :--- | ---: |
| Display report | `area()` | 28 cm² total |
| Cutting plan | `perimeter()` | 36 cm total |

Reuse must still fit the problem. The book cautions that inappropriate reuse of Therac-20 software in Therac-25 contributed to errors. In our smaller example, a rectangle class should not be forced to represent a shape whose measurements and rules are fundamentally different.

> **Mental model:** A well-designed card object should give sensible answers, accept useful changes, and serve more than one appropriate task.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 2.1.2 Object-Oriented Design Principles

The book uses **modularity**, **abstraction**, and **encapsulation** to help achieve the goals above. They address different design decisions.

<span id="part-3-modularity"></span>

### 1. Modularity

**Modularity** divides a program into separate, interacting units with clear jobs. In Python, a **module** is a source file containing related functions and classes. A larger card program might be arranged like this:

| Module | Responsibility |
| :--- | :--- |
| `geometry.py` | Define rectangles and their measurements. |
| `card_report.py` | Combine the measurements of chosen cards. |
| `main.py` | Read choices and display the report. |

If the area is wrong, we can inspect the geometry calculation separately from input handling. The same separation helps testing, debugging, and reuse. A module is a file-level unit; a class is a definition inside a module. They are related, but they are not the same thing.

<span id="part-3-abstraction"></span>

### 2. Abstraction and abstract data types

**Abstraction** keeps the essential behavior in view and leaves unnecessary details aside. An **abstract data type (ADT)** is a mathematical specification of data and operations: what information is represented, which operations are available, their inputs, and what results they promise. It does not prescribe the code or storage used to implement those operations.

For a *rectangular card* ADT, a compact contract could be:

| Item | Promise |
| :--- | :--- |
| Data | A positive width and height, measured in centimetres. |
| `area()` | Return width × height in cm². |
| `perimeter()` | Return 2 × (width + height) in cm. |

A client can write `card.area()` without knowing whether the class stores two numbers, a dimension pair, or some other representation. The formula describes the promised result; the method body chooses how to calculate it.

<span id="part-3-interfaces"></span>

### 3. Duck typing and abstract base classes

Python often uses **duck typing**: code can use an object if it provides the needed behavior at runtime. This function asks only for an `area()` method:

```python
def total_area(cards):
    return sum(card.area() for card in cards)
```

It can work with rectangle cards and with a future square-card class that also provides `area()`. The classes do not have to share a parent class for this function to call their methods.

Python also supports **abstract base classes (ABCs)** when we want to state a common interface more formally. An ABC with an abstract `area()` method cannot be instantiated directly; a concrete subclass must implement that method. The `abc` module supplies formal support, and the book points to existing ABCs in `collections`. Its examples generally use the interface idea without explicit ABC declarations.

<span id="part-3-encapsulation"></span>

### 4. Encapsulation

**Encapsulation** keeps implementation details inside a class and lets clients rely on its public interface. In the program below, clients call `card.area()` instead of reading `card._width` and multiplying it by `card._height` themselves.

The leading underscore in `_width` signals **nonpublic by convention**. Python still allows access to it; the underscore is not a strict privacy barrier. If a client changes `card._width` to `-2`, it can bypass the constructor's positive-dimension check. A class that needs resizing should provide a checked public method for it.

Encapsulation also helps adaptability: the class can change its internal representation while keeping the same `area()` behavior for callers.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 2.1.3 Design Patterns

<span id="part-4-template"></span>

### 1. What a pattern records

A **design pattern** is a general template for a problem that appears repeatedly. The book describes a pattern through its **name**, the **context** in which it applies, a **template** for a solution, and the **result** of using it. A pattern is guidance to adapt to a real problem, not a finished program.

For example, the **Adapter** pattern can be previewed with our cards:

| Pattern part | Geometry example |
| :--- | :--- |
| Name | Adapter |
| Context | Old card data is stored as `(width, height)`, but a report calls `card.area()`. |
| Template | Put the old data inside an object that offers `area()`. |
| Result | The report can use the old card data through its expected interface. |

<span id="part-4-groups"></span>

### 2. The two pattern groups in the book

The book lists these **algorithm design patterns**:

- Recursion
- Amortization
- Divide-and-conquer
- Prune-and-search (decrease-and-conquer)
- Brute force
- Dynamic programming
- Greedy method

It also lists these **software engineering patterns**:

- Iterator
- Adapter
- Position
- Composition
- Template method
- Locator
- Factory method

These are names to recognize for now. The book explains the individual patterns in later sections and chapters; Section 2.1 does not teach their full implementations.

<span id="part-4-previews"></span>

### 3. Two small geometry previews

**Divide-and-conquer** is an algorithm idea: split a problem into smaller parts, solve each part the same way, then combine the answers. For `A`, `C`, `A`, split the list into `A` and `C`, `A`; split the second part again into `C` and `A`. A single card supplies its own area. Combine **16 + 6 = 22 cm²**, then **6 + 22 = 28 cm²**. Three cards do not need recursive splitting, but the repeated split-and-combine process shows the pattern.

**Adapter** is a software design idea: connect two interfaces that do not already match. A tuple `(2, 3)` contains card `A`'s dimensions, but it has no `area()` method. An adapter object could hold that tuple and offer `area()`, allowing `total_area` to process it. These are previews of the patterns, not complete treatments of when to choose them.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. Build and use rectangle objects

Here is a small runnable example. The class syntax is a preview; later sections of Chapter 2 explain class definitions in detail. Save this as `rectangle_cards.py`:

```python
class Rectangle:
    def __init__(self, width, height):
        if width <= 0 or height <= 0:
            raise ValueError("width and height must be positive")
        self._width = width
        self._height = height

    def area(self):
        return self._width * self._height

    def perimeter(self):
        return 2 * (self._width + self._height)


def total_area(cards):
    return sum(card.area() for card in cards)


def total_border(cards):
    return sum(card.perimeter() for card in cards)


sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
chosen_labels = ["A", "C", "A"]
chosen_cards = []

for label in chosen_labels:
    width, height = sizes[label]
    chosen_cards.append(Rectangle(width, height))

print("Cards:", len(chosen_cards))
print("Total area:", total_area(chosen_cards), "cm^2")
print("Border for separate cards:", total_border(chosen_cards), "cm")
```

The constructor `__init__` checks dimensions when each object is created. The underscore names are implementation details by convention. `total_area` and `total_border` use the public methods, so they do not repeat geometry formulas. The loop creates a **new rectangle object for each choice**, including the second `A`.

<span id="part-5-trace"></span>

### 2. Trace the result

| Choice | New object's dimensions | `area()` | `perimeter()` |
| :--- | :--- | ---: | ---: |
| First `A` | 2 × 3 cm | 6 cm² | 10 cm |
| `C` | 4 × 4 cm | 16 cm² | 16 cm |
| Second `A` | 2 × 3 cm | 6 cm² | 10 cm |
| **Total** | **3 cards** | **28 cm²** | **36 cm** |

Running the script prints:

```text
Cards: 3
Total area: 28 cm^2
Border for separate cards: 36 cm
```

The program is in one file so it is easy to run. A larger application could place `Rectangle` and the report functions in separate modules without changing their public behavior.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What should happen to a negative width?</strong></summary>

**Scenario:** Someone enters `-2` cm by `3` cm for a card.

**Problem:** Multiplying directly would give `-6 cm²`, which is not a usable card area.

**Fix:** The `Rectangle` constructor rejects nonpositive dimensions. A user-facing program can catch the error and request another measurement:

```python
try:
    bad_card = Rectangle(-2, 3)
except ValueError as error:
    print(error)
```

**Output:** `width and height must be positive`. This is robustness: invalid data receives a clear response instead of a misleading geometry result.

</details>

<details>
<summary><strong>Case Study 2: What if the workshop adds border tape?</strong></summary>

**Scenario:** The original report needs area. A new cutting plan needs tape around each of `A`, `C`, and `A`.

**Fix:** Ask each card for `perimeter()` and add the results. The total is **10 + 16 + 10 = 36 cm**. The existing area report still gives **28 cm²**.

**Why this matters:** Adding `perimeter()` illustrates adaptability. A separate cutting-plan application could also import the same rectangle class, illustrating reusability.

</details>

<details>
<summary><strong>Case Study 3: Why not change `_width` directly?</strong></summary>

**Scenario:** Code outside the class assigns `card._width = -2` after a valid card was created.

**Problem:** Python allows this, and `area()` would then give a negative result. The constructor's check has been bypassed.

**Fix:** Treat underscore names as nonpublic. If resizing is required, add a public `resize(width, height)` method that validates both new dimensions; otherwise create a new valid `Rectangle`.

**Result:** Clients use the class's public operations, and each supported way to set dimensions checks the positive-dimension rule.

</details>

<details>
<summary><strong>Case Study 4: Can an older dimension pair join the report?</strong></summary>

**Scenario:** The report calls `card.area()`, but an older record is just the tuple `(2, 3)`.

**Problem:** A tuple has no `area()` method, so `total_area([(2, 3)])` fails.

**Fix:** An Adapter can wrap the pair in an object that validates its dimensions and supplies `area()`. The report can then use it alongside rectangle objects because it offers the method the report expects.

**Result:** The old data can be reused through a matching interface. Section 2.1 names this pattern; later material develops it more fully.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 2.1 idea | Plain-language meaning | Rectangle-card example |
| :--- | :--- | :--- |
| **Object and class** | An object is an instance of a class that defines data and methods. | Each chosen card is a `Rectangle` object. |
| **Robustness** | Handle expected and unexpected inputs sensibly. | Reject a negative width. |
| **Adaptability** | Allow useful changes as requirements evolve. | Add `perimeter()` for border tape. |
| **Reusability** | Use a suitable component in more than one application. | Import `Rectangle` into separate display-report and cutting-plan applications. |
| **Modularity** | Give separate interacting units clear jobs. | Keep geometry, reporting, and input work separate. |
| **Abstraction** | Specify essential behavior without requiring clients to know the implementation. | `area()` promises a result in cm². |
| **Encapsulation** | Keep internals behind a public interface. | Call `area()` rather than modifying `_width`. |
| **Design pattern** | A named template for a recurring design problem. | An Adapter can give a dimension pair an `area()` interface. |

[🔝 Back to Top](#top)
