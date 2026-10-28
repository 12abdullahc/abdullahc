<span id="top"></span>

# 1.5 Functions — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.5, printed pages 23–29 (the supplied PDF).  
> **Topic:** Defining and returning from functions; 1.5.1 Information Passing; 1.5.2 Python's Built-In Functions.  
> **Domain Focus:** Reusable calculations for the rectangular cards from Sections 1.1–1.4: area, repeated choices, resizing, and summary measurements.  
> **User Prompt:** Reexplain Section 1.5 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Reusable Rectangle-Card Calculations](#background)
   - [1. The same card workshop](#background-cards)
   - [2. Why put a calculation in a function?](#background-function)
2. [Part 1: 1.5 Functions](#part-1)
   - [1. Functions and methods](#function-method)
   - [2. A definition has a signature and a body](#definition)
   - [3. Each call has its own local names](#local-scope)
   - [4. Return a result and stop](#return)
3. [Part 2: 1.5.1 Information Passing](#part-2)
   - [1. Formal and actual parameters](#parameters)
   - [2. Mutable arguments: changing an object versus rebinding a name](#mutable)
   - [3. A documented in-place geometry operation](#scale)
   - [4. Default values allow different call forms](#defaults)
   - [5. Replace a standard mapping when the workshop changes](#custom-mapping)
   - [6. One-, two-, and three-argument range](#range-forms)
   - [7. Positional, keyword, and key-function arguments](#keywords)
4. [Part 3: 1.5.2 Python's Built-In Functions](#part-3)
   - [1. The built-ins by purpose](#builtins-groups)
   - [2. Calculate and order card measurements](#builtins-math)
   - [3. Work with collections and iterators](#builtins-iteration)
   - [4. Inspect values and convert card labels](#builtins-inspection)
5. [Part 4: One Connected Geometry Program](#part-4)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Reusable Rectangle-Card Calculations

<span id="background-cards"></span>

### 1. The same card workshop

A class cuts rectangular cards for a display board. Width and height are in centimetres, so **area = width × height** is in square centimetres.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The sequence `["A", "C", "A"]` represents **three physical cards**. Its total area is `6 + 16 + 6 = 28` cm²; the average is `28 / 3 ≈ 9.33` cm² per card. Repeated A cards count separately.

<span id="background-function"></span>

### 2. Why put a calculation in a function?

If several parts of a program need a rectangle's area, copying `width * height` everywhere makes later changes harder. A **function** gives the calculation a name, receives the measurements it needs, and sends back a result:

```text
width, height → rectangle_area → area
2 cm, 3 cm   → rectangle_area → 6 cm²
4 cm, 4 cm   → rectangle_area → 16 cm²
```

The **caller** is the code that asks the function to run. The caller supplies **arguments**, and the function can **return** an answer. Later, the same function can be used inside a loop that totals many cards.

> **Mental model:** A function is a reusable named calculation. Identify what it receives, what it returns, and whether it changes any object the caller owns.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.5 Functions

<span id="function-method"></span>

### 1. Functions and methods

The section begins by distinguishing a function called by name, such as `sorted(data)`, from a **method** called on a particular object, such as `data.sort()`. The method belongs to that object's class and uses dot syntax.

```python
areas = [16, 6, 8]

ordered = sorted(areas)
print(ordered)  # [6, 8, 16]
print(areas)    # [16, 6, 8]: sorted returned a new list.

areas.sort()
print(areas)    # [6, 8, 16]: sort changed this list.
```

This chapter section focuses first on defining ordinary functions. Methods and object-oriented design are developed later in the book. The difference between **returning a new object** and **changing an existing object** will also matter when we pass a list to our own functions.

<span id="definition"></span>

### 2. A definition has a signature and a body

The `def` line names the function and its **formal parameters**. The indented lines are its body. Defining a function does not run its body; calling it does.

```python
def rectangle_area(width, height):
    return width * height

print(rectangle_area(2, 3))  # 6: card A
print(rectangle_area(4, 4))  # 16: card C
```

Read `def rectangle_area(width, height):` as "define an operation that expects a width and a height." Python does not require parameter or return types in this signature. The multiplication is performed when a call supplies actual values; an unsuitable value may cause an error at run time. A good description of a reusable function should say that its dimensions are lengths in centimetres and its return value is an area in cm².

The book's first example counts how often a target occurs in an iterable. Here is its geometry counterpart:

```python
def count_label(data, target):
    count = 0
    for label in data:
        if label == target:
            count += 1
    return count

print(count_label(["A", "C", "A"], "A"))  # 2
```

<span id="local-scope"></span>

### 3. Each call has its own local names

Each call gets a separate set of **local names** for its parameters and variables. The book calls the information kept for a call an **activation record**; its local namespace includes names such as `width`, `height`, and `area` below.

```python
def rectangle_area(width, height):
    area = width * height
    return area

area = 100
print(rectangle_area(2, 3))  # 6
print(area)                  # 100
```

The local `area` inside the function is separate from the caller's `area`. Another call creates another set of local names. Local names can still refer to the **same objects** as caller names; that distinction becomes important for mutable arguments in Part 2.

<span id="return"></span>

### 4. Return a result and stop

`return` immediately ends the current call and passes a value back to the caller. A function may have several possible returns, reached on different paths:

```python
def first_large_area(areas, minimum):
    for area in areas:
        if area >= minimum:
            return area
    return None

print(first_large_area([6, 8, 16], 12))  # 16
print(first_large_area([6, 8], 12))      # None
```

The final `return None` is reached only if the loop finishes without finding a large card. Returning without a value, or reaching the end of a function without any `return`, also gives the caller `None`. This is different from returning zero: zero can be a meaningful numeric answer, while `None` here means "no matching area."

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.5.1 Information Passing

<span id="parameters"></span>

### 1. Formal and actual parameters

In `def count_label(data, target):`, `data` and `target` are **formal parameters**: names in the function definition. In `count_label(choices, "A")`, `choices` and `"A"` are **actual arguments** supplied by the caller.

```python
def count_label(data, target):
    count = 0
    for label in data:
        if label == target:
            count += 1
    return count

choices = ["A", "C", "A"]
number_of_a = count_label(choices, "A")
print(number_of_a)  # 2
```

At call time, binding the parameters acts much like assigning `data = choices` and `target = "A"` in the function's local scope. The list is **not copied**; `data` and `choices` refer to the same list while the call runs. The returned integer is then assigned to `number_of_a` in the caller. This is the idea shown by the book's parameter-passing diagram.

| Name | Scope | Refers to |
| :--- | :--- | :--- |
| `choices` | Caller | The list `["A", "C", "A"]`. |
| `data` | Function call | That same list. |
| `target` | Function call | The string `"A"`. |
| `number_of_a` | Caller | The returned integer `2`. |

<span id="mutable"></span>

### 2. Mutable arguments: changing an object versus rebinding a name

Because a parameter can alias a caller's list, **mutating that list** inside a function is visible to the caller. **Reassigning the parameter name** to another list is not.

```python
def add_choice(choices, label):
    choices.append(label)

def replace_local(choices):
    choices = ["B"]  # Only the local name now refers to this new list.
    return choices

selected = ["A", "C"]
add_choice(selected, "A")
print(selected)                 # ['A', 'C', 'A']
print(replace_local(selected))  # ['B']
print(selected)                 # Still ['A', 'C', 'A']
```

An unexpected mutation in a counting function would be poor design. If a function intentionally changes a caller-owned object, state that clearly in its name or documentation.

<span id="scale"></span>

### 3. A documented in-place geometry operation

The book's scaling example intentionally changes each entry of a numeric list. For a 2 cm × 3 cm card, doubling both lengths produces a 4 cm × 6 cm card:

```python
def scale_lengths_in_place(lengths, factor):
    """Multiply each length in the caller's list by factor."""
    for index in range(len(lengths)):
        lengths[index] *= factor

dimensions = [2, 3]
scale_lengths_in_place(dimensions, 2)
print(dimensions)                  # [4, 6]
print(dimensions[0] * dimensions[1])  # 24 cm²
```

The area becomes **24 cm²**, four times the original 6 cm², because *both* lengths doubled. The function's purpose is to update `dimensions`; it has no explicit return, so its return value is `None`. This differs from `rectangle_area`, which computes and returns a value without changing its inputs.

<span id="defaults"></span>

### 4. Default values allow different call forms

A default value makes an argument optional. The book calls a function with several valid call forms **polymorphic**.

```python
def scaled_area(width, height, scale=1):
    return (width * scale) * (height * scale)

print(scaled_area(2, 3))     # 6: default scale 1
print(scaled_area(2, 3, 2))  # 24: both lengths doubled
```

With positional arguments, values match parameters from left to right. Required parameters come before parameters with defaults; a definition like `def scaled_area(width, scale=1, height):` is invalid because a required parameter follows an optional one. A caller may supply the optional value or let Python use its default.

<span id="custom-mapping"></span>

### 5. Replace a standard mapping when the workshop changes

The book revisits its earlier GPA program: a function can use standard grade-to-points values, while letting a caller supply a different school policy. The card equivalent is a standard size chart with an optional custom chart:

```python
def total_area(choices, sizes=None):
    if sizes is None:
        sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
    total = 0
    for label in choices:
        if label in sizes:
            width, height = sizes[label]
            total += width * height
    return total

choices = ["A", "C", "A"]
print(total_area(choices))  # 28 cm² with standard sizes

custom_sizes = {"A": (3, 3), "C": (4, 4)}
print(total_area(choices, custom_sizes))  # 34 cm²
```

The custom chart makes A a 3 cm × 3 cm card, so the total is `9 + 16 + 9 = 34` cm². The function still performs the same algorithm. Here `None` means "no custom chart supplied"; the standard chart is created inside the call. This also avoids sharing a mutable dictionary as a default value.

<span id="range-forms"></span>

### 6. One-, two-, and three-argument range

`range` has three useful call forms. It is technically a class constructor, as the book notes, but its calls illustrate how one name can accept different numbers of arguments:

```python
print(list(range(3)))        # [0, 1, 2]
print(list(range(1, 4)))     # [1, 2, 3]
print(list(range(0, 6, 2)))  # [0, 2, 4]
```

Think of these as positions along a ruler: start at 0 by default, stop **before** the stop value, and move by 1 unless a step is supplied. The book sketches how a `None` sentinel can distinguish a one-argument call from a two-argument call. This small geometry helper uses the same idea:

```python
def ruler_marks(start, stop=None, step=1):
    if stop is None:
        stop = start
        start = 0
    return list(range(start, stop, step))

print(ruler_marks(3))        # [0, 1, 2]
print(ruler_marks(1, 4))     # [1, 2, 3]
print(ruler_marks(0, 6, 2))  # [0, 2, 4]
```

<span id="keywords"></span>

### 7. Positional, keyword, and key-function arguments

**Positional** arguments match parameters by order. A **keyword** argument names the parameter being filled:

```python
def scaled_area(width, height, scale=1):
    return (width * scale) * (height * scale)

print(scaled_area(2, 3, 2))          # 24: third positional argument
print(scaled_area(2, 3, scale=2))    # 24: named argument
print(scaled_area(height=3, width=2))  # 6: named arguments can change order
```

Some APIs require particular arguments to be named; the book mentions such **keyword-only** parameters. A useful standard-library example is `max(..., key=...)`. Its `key` receives a **function object** that produces a comparison value.

Imagine two marks measured from the board's centre: −12 cm to the left and +8 cm to the right. The greatest signed coordinate is +8, but the farthest mark is −12:

```python
print(max(-12, 8))           # 8
print(max(-12, 8, key=abs))  # -12
```

Here `abs` has no parentheses: Python passes the function itself, and `max` calls it for each candidate. User-defined functions can be passed the same way:

```python
def card_area(card):
    label, dimensions = card
    width, height = dimensions
    return width * height

cards = [("A", (2, 3)), ("B", (4, 2)), ("C", (4, 4))]
print(max(cards, key=card_area)[0])  # C
```

The `key` changes **how** the candidates are compared; `max` still returns an original candidate, here the C record. `sorted` supports a similar `key` argument.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.5.2 Python's Built-In Functions

Python supplies many functions automatically, so a program can call them without first defining them. The book's Table 1.4 surveys these common built-ins. An **iterable** supplies values one after another; a **sequence** such as a list, tuple, or string also supports positions such as `items[0]`. Sets and dictionaries are iterable but do not support numeric sequence indices.

<span id="builtins-groups"></span>

### 1. The built-ins by purpose

| Purpose | Built-ins in the section | Card-workshop use |
| :--- | :--- | :--- |
| Input and output | `print`, `input`, `open` | Display a total; later read choices or a file. |
| Character encoding | `ord`, `chr` | Convert a label character and its Unicode code point. |
| Mathematics | `abs`, `divmod`, `pow`, `round`, `sum` | Distances, whole pieces and remainder, square area, rounded average, total. |
| Ordering | `max`, `min`, `sorted` | Largest or smallest area; a new ordered list. |
| Collections and iteration | `range`, `len`, `reversed`, `all`, `any`, `map`, `iter`, `next` | Positions, counts, reverse visits, tests, transformed values, iterator steps. |
| Object information | `hash`, `id`, `isinstance`, `type` | Inspect an object's hash, identity, or class. |

The first row's console and file operations are developed in Section 1.6. The iterator protocol behind `iter` and `next` is developed in Section 1.8. Here we concentrate on what each tool contributes to a small geometry program.

<span id="builtins-math"></span>

### 2. Calculate and order card measurements

```python
areas = [6, 16, 6]

print(sum(areas))                  # 28 cm² total
print(round(sum(areas) / len(areas), 2))  # 9.33 cm² average
print(min(areas), max(areas))      # 6 16
print(sorted([16, 6, 8]))         # [6, 8, 16]
print(pow(4, 2))                  # 16: a 4 cm square
print(abs(-3))                    # 3: distance from a signed coordinate
print(divmod(13, 4))              # (3, 1): three 4 cm segments, 1 cm left
```

`divmod(x, y)` returns the quotient and remainder together. `pow(x, y)` computes a power; its three-argument form `pow(x, y, z)` also takes a remainder modulo `z`. `round(x, k)` rounds to `k` decimal places; for exact halfway cases, Python uses the nearest **even** result, so `round(2.5)` is `2` and `round(3.5)` is `4`. The displayed 9.33 is a rounded form of the exact average `28 / 3`.

<span id="builtins-iteration"></span>

### 3. Work with collections and iterators

`len` counts elements; `reversed` gives a reverse visit; `map` applies a function to successive elements; `iter` gets an iterator and `next` takes its next value.

```python
card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
choices = ["A", "C", "A"]

def area_for_label(label):
    width, height = card_sizes[label]
    return width * height

print(len(choices))                   # 3
print(list(map(area_for_label, choices)))  # [6, 16, 6]
print(list(reversed(["A", "B", "C"])))  # ['C', 'B', 'A']

visits = iter(choices)
print(next(visits))  # A
print(next(visits))  # C
```

`map` and `reversed` supply values for iteration; wrapping them in `list(...)` makes all their values visible in these examples. `all` asks whether **every** Boolean value is true; `any` asks whether **at least one** is true:

```python
validity = [True, False, True]  # A, unknown ?, C
print(all(validity))  # False: not every request was valid.
print(any(validity))  # True: at least one request was valid.
```

For an empty iterable, `all([])` is `True` and `any([])` is `False`. That does not mean an empty workshop has accepted cards; use `len(choices)` or a count when you need to know that.

<span id="builtins-inspection"></span>

### 4. Inspect values and convert card labels

`ord` and `chr` connect a character to its Unicode code point. `type` and `isinstance` answer questions about classes. `id` and `hash` report object-related integers, but their exact values are not workshop measurements.

```python
print(ord("A"))             # 65
print(chr(65))              # A
print(type(6) is int)       # True
print(isinstance(6, int))   # True
```

Use `isinstance(value, SomeClass)` when asking whether a value belongs to a class or one of its subclasses. `id(obj)` is about an object's identity; `hash(obj)` is for hashable objects and supports structures such as dictionaries and sets. Do not treat either integer as an area, card index, or stable label.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

The workshop now has reusable functions. `rectangle_area` computes one card's area. `summarize_cards` accepts the requested labels and size chart, skips unknown labels, and returns a count, total, and average. Its optional `scale` enlarges **both** dimensions. Neither function changes the caller's list or dictionary.

```python
def rectangle_area(width, height):
    return width * height

def summarize_cards(requests, sizes, scale=1):
    accepted_count = 0
    total = 0

    for label in requests:
        if label not in sizes:
            continue
        width, height = sizes[label]
        total += rectangle_area(width * scale, height * scale)
        accepted_count += 1

    if accepted_count == 0:
        return 0, 0, None

    average = round(total / accepted_count, 2)
    return accepted_count, total, average

card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
requests = ["A", "C", "?", "A"]

count, total_area, average_area = summarize_cards(requests, card_sizes)
print("Accepted cards:", count)
print("Total area:", total_area, "cm²")
print("Average area:", average_area, "cm²")

double_size = summarize_cards(requests, card_sizes, scale=2)
print("Area when both lengths double:", double_size[1], "cm²")
print("Original requests:", requests)
```

| Request | Action | Accepted count | Running area at scale 1 |
| :--- | :--- | ---: | ---: |
| First `A` | Add `2 × 3 = 6` cm². | 1 | 6 cm² |
| `C` | Add `4 × 4 = 16` cm². | 2 | 22 cm² |
| `?` | Unknown; skip it. | 2 | 22 cm² |
| Second `A` | Add another 6 cm². | 3 | 28 cm² |

The first call returns `(3, 28, 9.33)`. The keyword call `scale=2` doubles every accepted card's width and height, making each area four times as large and the total **112 cm²**. The requests list remains `["A", "C", "?", "A"]`. With no accepted cards, the function returns `(0, 0, None)`, so it never divides by zero.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Printing an area does not return it</strong></summary>

**Scenario.** A helper displays A's area, but the caller needs a numeric result for a total.

```python
def show_area(width, height):
    print(width * height)

answer = show_area(2, 3)  # Prints 6.
print(answer)             # None
```

**Why?** `print` displays a value; it does not make that value the function's return. To let the caller add areas, write `return width * height` inside the function. If the caller then wants output, it can print the returned value.

</details>

<details>
<summary><strong>Case Study 2: Rebinding a parameter does not erase the caller's choices</strong></summary>

**Scenario.** A function tries to replace the selection with an empty list:

```python
def clear_local(choices):
    choices = []
    return choices

selected = ["A", "C", "A"]
print(clear_local(selected))  # []
print(selected)               # ['A', 'C', 'A']
```

**Why?** `choices = []` gives the local name a new list. To change the caller's list intentionally, use a mutation such as `choices.clear()` and document that behavior; to keep the caller's list intact, return a new list and let the caller decide whether to assign it.

</details>

<details>
<summary><strong>Case Study 3: A custom size chart changes the answer, not the formula</strong></summary>

**Scenario.** The workshop makes A a 3 cm × 3 cm card for one display. C remains 4 cm × 4 cm.

```python
def total_area(choices, sizes=None):
    if sizes is None:
        sizes = {"A": (2, 3), "C": (4, 4)}
    total = 0
    for label in choices:
        width, height = sizes[label]
        total += width * height
    return total

choices = ["A", "C", "A"]
print(total_area(choices))  # 28
print(total_area(choices, sizes={"A": (3, 3), "C": (4, 4)}))  # 34
print(total_area(choices))  # 28 again
```

**Check.** The keyword argument supplies a different mapping for one call. The default behavior remains the standard 6 + 16 + 6 calculation for later calls.

</details>

<details>
<summary><strong>Case Study 4: A key function changes what “largest” means</strong></summary>

**Scenario.** A card edge lies 12 cm left of the board centre; another lies 8 cm right. We want the mark farthest from the centre.

```python
offsets = [-12, 8]
print(max(offsets))           # 8: greatest signed coordinate
print(max(offsets, key=abs))  # -12: greatest distance from zero
```

**Check.** `key=abs` passes the built-in function `abs` itself. `max` compares 12 with 8, then returns the original value −12. Writing `key=abs()` would try to call `abs` before `max` had a candidate to pass it.

</details>

<details>
<summary><strong>Case Study 5: An empty selection needs an explicit meaning</strong></summary>

**Scenario.** No valid cards were selected, so an average cannot be computed.

```python
def average_area(areas):
    if not areas:
        return None
    return sum(areas) / len(areas)

print(average_area([]))         # None
print(average_area([6, 16, 6]))  # 9.333333333333334
print(all([]), any([]))         # True False
```

**Check.** `None` means “no average.” The `all` and `any` results describe logical tests over an empty iterable; they do not provide an average or a card count.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 1.5 idea | What it means | Rectangle-card example |
| :--- | :--- | :--- |
| Function definition and call | Name a reusable body; run it with arguments. | `rectangle_area(2, 3)` returns 6 cm². |
| Local names | Each call has its own parameter and variable names. | A local `area` does not replace the caller's `area`. |
| `return` | End the call and send a value back. | Return 16 for the first large card, or `None` if absent. |
| Formal and actual parameters | Call arguments bind to parameter names; objects are not copied. | `data` and `choices` can name the same list. |
| Mutation versus rebinding | Changing a shared list affects the caller; assigning a new local list does not. | `append` changes selected cards; `choices = []` only rebinds locally. |
| Defaults and keywords | Omit an optional argument or supply it by name. | `scale=2` doubles both lengths and quadruples area. |
| `key` function | Compare transformed values and return an original item. | `max(offsets, key=abs)` finds the farthest signed mark. |
| Built-in functions | Use ready-made math, ordering, collection, and inspection operations. | `sum` totals areas; `round` displays the average; `len` counts cards. |

[🔝 Back to Top](#top)
