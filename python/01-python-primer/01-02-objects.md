<span id="top"></span>

# 1.2 Objects in Python — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.2, printed pages 4–11 (the supplied PDF).  
> **Topic:** 1.2 Objects in Python; 1.2.1 Identifiers, Objects, and the Assignment Statement; 1.2.2 Creating and Using Objects; 1.2.3 Python's Built-In Classes.  
> **Domain Focus:** The rectangle cards from Section 1.1: dimensions, areas, selected cards, and card labels.  
> **User Prompt:** Reexplain Section 1.2 part by part, with background and connected math-geometry study cases, in the format of `01-01-overview`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle Cards](#background)
   - [1. The familiar geometry problem](#background-problem)
   - [2. Why objects matter here](#background-objects)
2. [Part 1: 1.2 Objects in Python](#part-1)
   - [1. Values are objects](#part-1-values)
   - [2. Names, classes, and types](#part-1-vocabulary)
3. [Part 2: 1.2.1 Identifiers, Objects, and Assignment](#part-2)
   - [1. Assignment and names](#part-2-assignment)
   - [2. Identifier rules](#part-2-identifiers)
   - [3. Aliases and reassignment](#part-2-aliases)
   - [4. The special value `None`](#part-2-none)
4. [Part 3: 1.2.2 Creating and Using Objects](#part-3)
   - [1. Ways to obtain an object](#part-3-create)
   - [2. Methods, accessors, and mutators](#part-3-methods)
5. [Part 4: 1.2.3 Python's Built-In Classes](#part-4)
   - [1. Mutable and immutable](#part-4-mutability)
   - [2. `bool`](#part-4-bool)
   - [3. `int` and `float`](#part-4-numbers)
   - [4. `list`, `tuple`, and `str`](#part-4-sequences)
   - [5. `set` and `frozenset`](#part-4-sets)
   - [6. `dict`](#part-4-dict)
   - [7. Connected geometry program](#part-4-program)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle Cards

<span id="background-problem"></span>

### 1. The familiar geometry problem

Section 1.1 measured rectangular cards for a classroom display. We will keep its three sizes:

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `A`  |  2 cm |   3 cm |                 6 cm² |
| `B`  |  4 cm |   2 cm |                 8 cm² |
| `C`  |  4 cm |   4 cm |                16 cm² |

Choosing `A`, `C`, and another `A` means **three physical cards** with total area 6 + 16 + 6 = **28 cm²**. There are only **two different labels**, `A` and `C`. This distinction will help us choose between lists and sets.

<span id="background-objects"></span>

### 2. Why objects matter here

The program needs several kinds of values: a width, a card label, an ordered record of choices, and a lookup table of sizes. Python represents each value as an **object**. A name refers to an object:

```text
width       ─────→  2
label       ─────→  "A"
choices     ─────→  ["A", "C", "A"]
card_sizes  ─────→  {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
```

The arrows matter. A name is a reference to an object, rather than a permanent container for one value. Section 1.2 explains what happens when we assign a name again or change an object.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.2 Objects in Python

<span id="part-1-values"></span>

### 1. Values are objects

The section starts with Python's object model: values are **objects**, and each object is an instance of a **class**. The class, also called its **type**, determines which operations the object supports.

```python
width = 2
scale = 1.5
label = "A"
print(type(width))  # <class 'int'>
print(type(scale))  # <class 'float'>
print(type(label))  # <class 'str'>
```

<span id="part-1-vocabulary"></span>

### 2. Names, classes, and types

| Term             | Simple meaning                              | Geometry example                     |
| :--------------- | :------------------------------------------ | :----------------------------------- |
| **Object**       | A value Python can work with.               | The number `2` or list `["A", "C"]`. |
| **Class / type** | The object's kind and available operations. | `int` for a whole-number width.      |
| **Identifier**   | A valid name in a program.                  | `width` or `card_sizes`.             |
| **Binding**      | A name's connection to an object.           | `width = 2` binds `width` to `2`.    |
| **Method**       | An operation supplied by an object.         | `choices.append("A")`.               |

An object has a definite type, but a **name can later refer to a different object**:

```python
measurement = 2
measurement = "2 cm"
```

After the second line, `measurement` refers to a string. The original integer did not turn into a string. This flexibility is called **dynamic typing**; descriptive, consistent names still make programs easier to read.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.2.1 Identifiers, Objects, and the Assignment Statement

<span id="part-2-assignment"></span>

### 1. Assignment and names

Python evaluates the **right side** of an assignment first, then binds the name on the left to the result:

```python
width = 2
height = 3
area = width * height
print(area)  # 6
```

In the third line, `width * height` produces an integer object with value `6`. The name `area` now refers to it. The `=` symbol assigns; `==` asks whether two values are equal.

<span id="part-2-identifiers"></span>

### 2. Identifier rules

Names are **case-sensitive**: `width` and `Width` differ. Names can contain letters, underscores, digits after the first character, and many Unicode letters. They cannot start with a digit or be Python keywords.

| Name                             | Valid? | Reason                                   |
| :------------------------------- | :----- | :--------------------------------------- |
| `card_width`, `width2`, `_draft` | Yes    | Letters, underscores, and a later digit. |
| `2width`                         | No     | Starts with a digit.                     |
| `card-width`                     | No     | A hyphen is subtraction syntax.          |
| `class`                          | No     | It is a Python keyword.                  |

Unicode names such as `café` are possible, though plain, descriptive names are often easier to share. The book's keyword count is historical; avoid the keywords of the Python version you use.

<span id="part-2-aliases"></span>

### 3. Aliases and reassignment

Two names can refer to the **same object**. The second name is an **alias**:

```python
width = 2.0
original_width = width
width = width + 1.0
print(width)           # 3.0
print(original_width)  # 2.0
```

After `original_width = width`, both names refer to the same `2.0` float. For `width = width + 1.0`, Python calculates a **new** `3.0` float, then rebinds `width` to it. The old object is unchanged.

```text
Before: width ───────────┐
                         ├──→ 2.0
        original_width ──┘

After:  width ───────────────→ 3.0
        original_width ──────→ 2.0
```

This differs from changing a **mutable object** through either of its names. The study cases will show that distinction with a list of dimensions.

<span id="part-2-none"></span>

### 4. The special value `None`

`None` represents no chosen or supplied value. It differs from zero, an empty string, and an empty list:

```python
selected_card = None
if selected_card is None:
    print("Choose a card first.")
```

`is None` checks for this specific object. Later, `selected_card = "A"` can rebind the name to a card label.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.2.2 Creating and Using Objects

<span id="part-3-create"></span>

### 1. Ways to obtain an object

The book shows three common ways to obtain an object: write a **literal**, call a **constructor**, or call a **function that returns an object**. A constructor has the general form `ClassName(...)`. We can use built-in classes before learning to define our own.

```python
dimensions = [2, 3]              # list literal
other_dimensions = list((2, 3))  # list constructor
areas = sorted([16, 6, 8])       # function returns a new list

print(dimensions)        # [2, 3]
print(other_dimensions)  # [2, 3]
print(areas)             # [6, 8, 16]
```

The first two lists have equal contents but are **different list objects**. `sorted(...)` produces a new sorted list. The book's `Widget(...)` is a general constructor illustration; `list(...)` is a concrete example we can run now.

<span id="part-3-methods"></span>

### 2. Methods, accessors, and mutators

A **method** is called with a dot after an object. Some methods **read** information (**accessors**); others **change** a mutable object (**mutators**).

```python
choices = ["A"]
choices.append("C")         # mutator: change this list
print(choices)             # ['A', 'C']
print(choices.count("A"))  # accessor: read a count, 1

label = "Card A"
print(label.lower().startswith("card"))  # True
print(label)                              # Card A
```

`choices.append("C")` changes the list. Strings are immutable: `label.lower()` returns a **new** lowercase string, and `.startswith("card")` checks that result. The original `label` stays `"Card A"`. Calling one method on another method's result is **method chaining**.

The book also contrasts `sorted(areas)`, which returns a new list, with `areas.sort()`, which changes `areas` and returns `None`:

```python
areas = [16, 6, 8]
ordered = sorted(areas)
print(areas)    # [16, 6, 8]
print(ordered)  # [6, 8, 16]

areas.sort()
print(areas)    # [6, 8, 16]
```

Choose based on whether the original order must remain available.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 1.2.3 Python's Built-In Classes

<span id="part-4-mutability"></span>

### 1. Mutable and immutable

An **immutable** object cannot be changed after creation. A name can refer to a _new_ object, as `width` did, but the old object stays unchanged. A **mutable** object can be changed in place while its name still refers to that same object.

| Built-in class         | Mutable? | Use with the cards                  |
| :--------------------- | :------- | :---------------------------------- |
| `bool`, `int`, `float` | No       | Fits on board? Count, width, area.  |
| `tuple`                | No       | A fixed pair `(width, height)`.     |
| `str`                  | No       | A label such as `"A"`.              |
| `frozenset`            | No       | A fixed group of unique labels.     |
| `list`                 | Yes      | Ordered choices, including repeats. |
| `set`                  | Yes      | Different labels seen so far.       |
| `dict`                 | Yes      | Labels mapped to dimensions.        |

<span id="part-4-bool"></span>

### 2. `bool`: a yes-or-no result

The Boolean objects are `True` and `False`. A comparison can produce one:

```python
area = 2 * 3
fits_limit = area <= 10
print(fits_limit)  # True
```

`bool(...)` finds a value's truth value; `bool()` alone is `False`. Zero and empty containers are false; nonzero numbers and nonempty containers are true:

```python
print(bool(0))      # False
print(bool(6))      # True
print(bool([]))     # False
print(bool(["A"]))  # True
```

An empty choice list therefore behaves as false in a condition. `len(choices) > 0` may state the geometry question more clearly for a beginner.

<span id="part-4-numbers"></span>

### 3. `int` and `float`: geometry measurements

**Integers** are whole numbers, such as a card count or a whole-centimetre width. Python integers can be arbitrarily large. Decimal, binary, octal, and hexadecimal are different ways to write integers:

```python
print(2, 0b10)   # 2 2
print(8, 0o10)   # 8 8
print(16, 0x10)  # 16 16
```

`int()` creates zero. `int("4")` converts a decimal string to `4`; `int("7f", 16)` reads a hexadecimal string as `127`. `int(3.9)` is `3` and `int(-3.9)` is `-3`: conversion **truncates toward zero**. `int("4 cm")` raises `ValueError` because it contains units.

**Floats** are approximate real numbers, useful for fractional dimensions or averages:

```python
width = 2.5
height = 3.0
print(width * height)  # 7.5
print(float("2.5"))    # 2.5
print(1.5e2)           # 150.0
```

`3.0` and `3.` are float literals; `1.5e2` is scientific notation for 150.0. `float()` creates `0.0`. Floats have limited precision, so floating-point arithmetic may return a close approximation rather than an exact mathematical real number.

<span id="part-4-sequences"></span>

### 4. Sequences: `list`, `tuple`, and `str`

A **sequence** has an order. Index `0` is the first item; index `-1` is the last. The book groups these three built-in classes as sequence types:

| Class   | Card example      | What it contains                                  | Changeable in place? |
| :------ | :---------------- | :------------------------------------------------ | :------------------- |
| `list`  | `["A", "C", "A"]` | An ordered, growable series of object references. | Yes                  |
| `tuple` | `(2, 3)`          | An ordered, fixed series of object references.    | No                   |
| `str`   | `"Card A"`        | An ordered series of Unicode characters.          | No                   |

**List.** A list can grow and can contain arbitrary objects. Our choice list keeps order **and repeats**:

```python
choices = ["A", "C", "A"]
print(choices[0])   # A
print(choices[-1])  # A
choices.append("B")
print(choices)      # ['A', 'C', 'A', 'B']
```

`[]` makes an empty list. `list(choices)` creates a different **outer** list with the same element references. That is a **shallow copy**: if an element is itself mutable, both outer lists still refer to that same inner object.

**Tuple.** A tuple works well for a fixed pair of dimensions:

```python
dimensions = (2, 3)
print(dimensions[0] * dimensions[1])  # 6
one_dimension = (2,)
not_a_tuple = (2)
print(type(one_dimension).__name__)  # tuple
print(type(not_a_tuple).__name__)     # int
```

The comma makes `(2,)` a one-element tuple. `(2)` only groups the integer `2`. `()` makes an empty tuple. `dimensions[0] = 5` raises `TypeError` because the tuple cannot be changed in place; `dimensions = (5, 3)` instead rebinds the name to a new tuple.

**String.** A string stores a card label or other text. A one-character result is still a `str`; Python has no separate character class:

```python
label = "Card A"
print(label[0])       # C
print(label.lower())  # card a
print(label)          # Card A
```

Strings can use single or double quotes, and triple quotes can span lines. The escape sequence `"\n"` represents a newline. Strings are Unicode and immutable: `label[0] = "c"` is not allowed, while `label.lower()` returns a new string.

<span id="part-4-sets"></span>

### 5. `set` and `frozenset`: unique labels

A **set** keeps one copy of each member. It answers which **different card sizes** were chosen:

```python
choices = ["A", "C", "A"]
different_labels = set(choices)
print(len(choices))           # 3 physical cards
print(len(different_labels))  # 2 different labels
print("A" in different_labels)  # True
```

A `set` can change, for example with `different_labels.add("B")`. A `frozenset` keeps unique members but cannot be changed after creation:

```python
choices = ["A", "C", "A"]
fixed_labels = frozenset(choices)
print(len(fixed_labels))  # 2
```

Sets use a **hash table**, making membership checks such as `"A" in different_labels` typically fast. They have **no dependable index or display order**. Do not use `different_labels[0]` or assume a particular printing order. Members must be **hashable**; strings and tuples of integers work, while lists do not. A nonempty set can be written as `{"A", "C"}`. Use `set()` for an empty set; `{}` creates an empty dictionary.

<span id="part-4-dict"></span>

### 6. `dict`: card labels to dimensions

A **dictionary** maps each unique key to a value. It lets us look up dimensions from a card label:

```python
card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
width, height = card_sizes["A"]
print(width * height)  # 6

card_sizes["D"] = (5, 3)
print(card_sizes["D"])  # (5, 3)
```

The string key `"A"` is hashable. The tuple value `(2, 3)` holds two measurements. Assigning to an existing key replaces its value. Keys must be hashable; values may be any objects. `{}` and `dict()` both create an empty dictionary. `dict([("A", (2, 3)), ("B", (4, 2))])` builds one from key–value pairs.

The jobs differ: a **list** records every choice in order, a **set** records which labels occurred, and a **dictionary** finds dimensions for a label.

<span id="part-4-program"></span>

### 7. Connected geometry program

The following program brings the objects together. The list counts **every chosen card** for total area; the set counts **different labels**:

```python
card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
choices = ["A", "C", "A"]
total_area = 0

for label in choices:
    width, height = card_sizes[label]
    total_area += width * height

different_labels = set(choices)
print("Cards chosen: {}".format(len(choices)))
print("Different sizes: {}".format(len(different_labels)))
print("Total area: {} cm^2".format(total_area))
print("Average area: {:.2f} cm^2".format(total_area / len(choices)))
```

**Output:**

```text
Cards chosen: 3
Different sizes: 2
Total area: 28 cm^2
Average area: 9.33 cm^2
```

The trace is 6 cm² for `A`, 16 cm² for `C`, then 6 cm² for the second `A`. The `{:.2f}` formatting instruction displays the average to two decimal places; it does not change the underlying division result.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Rebinding a number versus changing a shared list</strong></summary>

**Scenario:** A student wants to keep card `A`'s original dimensions while testing a wider version.

**Problem:** Two names can refer to one mutable list:

```python
dimensions = [2, 3]
original = dimensions
dimensions[0] = 5
print(original)  # [5, 3], not [2, 3]
```

**Why:** `original = dimensions` made an alias. Changing `dimensions[0]` changed the **shared object**. That differs from `width = width + 1.0`, which binds `width` to a new float.

**Fix:** Make a separate outer list before changing it:

```python
dimensions = [2, 3]
original = list(dimensions)
dimensions[0] = 5
print(original)    # [2, 3]
print(dimensions)  # [5, 3]
```

For a simple list of numbers, this copy is enough. For a list containing inner mutable lists, `list(dimensions)` still shares those inner objects.

</details>

<details>
<summary><strong>Case Study 2: Why did sorting give me `None`?</strong></summary>

**Scenario:** We want a sorted list of the card areas 16, 6, and 8 cm².

**Problem:** `list.sort()` changes its list and returns `None`:

```python
areas = [16, 6, 8]
ordered = areas.sort()
print(ordered)  # None
```

**Fix:** Use `sorted(areas)` when the result needs a new name:

```python
areas = [16, 6, 8]
ordered = sorted(areas)
print(ordered)  # [6, 8, 16]
print(areas)    # [16, 6, 8]
```

</details>

<details>
<summary><strong>Case Study 3: A set is not a count of physical cards</strong></summary>

**Scenario:** The student picks `A`, `C`, and `A` again.

**Problem:** `len(set(["A", "C", "A"]))` is `2`. Using that as the card count would omit the second `A` and give the wrong average.

**Fix:** Use the list for the number of physical cards and the set for the number of different labels:

```python
choices = ["A", "C", "A"]
print(len(choices))       # 3 cards
print(len(set(choices)))  # 2 sizes
```

The total area is 28 cm², so average area per **card** is 28 ÷ 3 ≈ 9.33 cm².

</details>

<details>
<summary><strong>Case Study 4: Similar-looking container notation</strong></summary>

**Scenario:** We want a one-element fixed tuple and an empty set of labels.

**Problem:** `(2)` is the integer `2`, while `{}` is an empty dictionary.

**Fix:** The comma and the constructor specify the intended types:

```python
one_side = (2,)
seen_labels = set()
print(type(one_side).__name__)     # tuple
print(type(seen_labels).__name__)  # set
```

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Question                                      | Answer in our geometry study                                     |
| :-------------------------------------------- | :--------------------------------------------------------------- |
| What does `width = 2` do?                     | It binds `width` to an `int` object.                             |
| What is an alias?                             | Another name for the same object, as in `original = dimensions`. |
| What is reassignment?                         | Moving a name to another object, as in `width = width + 1`.      |
| What is mutation?                             | Changing one object in place, as in `choices.append("A")`.       |
| Which object holds ordered, repeated choices? | A `list`.                                                        |
| Which object holds a fixed width–height pair? | A `tuple`.                                                       |
| Which object holds different labels only?     | A `set` or, if fixed, a `frozenset`.                             |
| Which object finds dimensions from a label?   | A `dict`.                                                        |

[🔝 Back to Top](#top)
