<span id="top"></span>

# 1.10 Scopes and Namespaces — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.10, printed pages 46–47 (the supplied PDF).  
> **Topic:** Name resolution; global and local scope; namespaces; first-class functions and classes.  
> **Domain Focus:** Keeping rectangular-card names clear across a program, its function calls, and reusable calculations.  
> **User Prompt:** Reexplain Section 1.10 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The same cards and choices](#background-cards)
   - [2. Names appear in more than one place](#background-names)
2. [Part 1: 1.10 Scopes and Namespaces — Names and Scope](#part-1)
   - [1. A name must lead to a value](#names)
   - [2. Module names and function-local names](#global-local)
   - [3. Each call gets its own local names](#each-call)
3. [Part 2: Namespaces and Name Resolution](#part-2)
   - [1. Caller and function have separate namespaces](#caller-function)
   - [2. A namespace maps names to objects](#namespace-map)
   - [3. Inspect names with dir and vars](#dir-vars)
   - [4. Python looks in the nearest scope first](#lookup)
4. [Part 3: First-Class Objects](#part-3)
   - [1. A function name refers to a function object](#function-binding)
   - [2. Pass a function to another function](#function-parameter)
   - [3. Return a function that remembers an enclosing value](#function-return)
5. [Part 4: One Connected Geometry Program](#part-4)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The same cards and choices

Students cut rectangular cards for a display board. **Area = width × height**, with lengths in centimetres.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The request `["A", "C", "A"]` describes **three physical cards**. Its areas are `[6, 16, 6]` cm², so the total is `28` cm² and the average is about `9.33` cm². An unknown label `"?"` is skipped.

<span id="background-names"></span>

### 2. Names appear in more than one place

A workshop program may store the request list in a name such as `requests`. A counting function may call its own parameter `data` and its running count `n`. Both the caller and the function are working on the same card problem, but they have different names available.

| Place | Example names | Purpose |
| :--- | :--- | :--- |
| Main program | `requests`, `CARD_SIZES`, `total_area` | Keep the workshop's data and final answers. |
| One function call | `data`, `target`, `n`, `item` | Count matching cards during that call. |
| Python built-ins | `print`, `max`, `len` | Supply ready-made operations. |

Section 1.10 explains **where a name belongs**, **how Python finds its value**, and **why a function can itself be a value**.

> **Mental model:** A **namespace** is a set of name-to-object bindings. A **scope** tells us where a name can be used. A function call gets local bindings while it runs; Python looks outward when a needed name is not local.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.10 Scopes and Namespaces — Names and Scope

<span id="names"></span>

### 1. A name must lead to a value

Before Python can calculate an expression such as `width * height`, it must find objects bound to both names. Finding the object associated with a name is called **name resolution**.

```python
width = 2
height = 3
area = width * height

print(area)  # 6
```

If the program uses a name that has no binding, Python raises `NameError`. A misspelling can cause this:

```python
width = 2
height = 3

try:
    print(width * heigth)  # Misspelled "height".
except NameError:
    print("A measurement name was not found.")
```

The error is about the **name**, not the multiplication rule. Python cannot start that multiplication until it knows what `heigth` refers to.

<span id="global-local"></span>

### 2. Module names and function-local names

A name assigned at the top level of a script belongs to that module's **global scope**. A parameter or a name assigned inside a function normally belongs to the function call's **local scope**. “Global” here means the current module, not every Python program.

```python
width = 2  # A's width in the module.

def show_c_width():
    width = 4  # A different, local name for C's width.
    print("Inside the function:", width)

show_c_width()
print("Outside the function:", width)

# Inside the function: 4
# Outside the function: 2
```

The local assignment `width = 4` does not reassign the outer `width = 2`. The two names have the same spelling but live in different scopes.

<span id="each-call"></span>

### 3. Each call gets its own local names

Calling a function creates local bindings for its parameters and calculations. A later call gets a new set. This lets one area function work for both A and C:

```python
def rectangle_area(width, height):
    area = width * height
    return area

print(rectangle_area(2, 3))  # A: 6
print(rectangle_area(4, 4))  # C: 16
```

During the first call, local `width` is 2 and local `area` becomes 6. During the second, local `width` is 4 and local `area` becomes 16. Returning the number gives it to the caller; the local name `area` itself does not become a new name in the caller.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Namespaces and Name Resolution

<span id="caller-function"></span>

### 1. Caller and function have separate namespaces

The book's Figure 1.8 shows a caller and a counting function with separate collections of names. Here is the same idea with our card requests:

```python
def count_cards(data, target):
    n = 0
    for item in data:
        if item == target:
            n += 1
    return n

requests = ["A", "C", "A"]
wanted = "A"
answer = count_cards(requests, wanted)

print(answer)  # 2
```

| Main program at the call | `count_cards` during the call |
| :--- | :--- |
| `requests` → the list `["A", "C", "A"]` | `data` → that same list object |
| `wanted` → `"A"` | `target` → the same target value |
| Waiting for an answer | `n` → a running count; `item` → each label in turn |

The parameter `data` is another name for the **same list object**, not a copy of the list. The function only reads it here. After the function returns 2, the caller binds that result to `answer`. The caller cannot directly use the function's local name `n`.

<span id="namespace-map"></span>

### 2. A namespace maps names to objects

A **namespace** is a mapping from names to objects. Thinking of it as a small dictionary helps:

```text
Caller namespace:  "requests" → ["A", "C", "A"]
                   "wanted"   → "A"

Call namespace:    "data"   → same list
                   "target" → "A"
                   "n"      → 2
```

Python commonly implements namespaces with dictionaries, but the key idea is the **mapping**, not a promise about internal storage. Different namespaces can contain the same name without forcing them to share a binding. Section 1.10 also notes that objects and classes have their own namespaces; their details come later in the book.

<span id="dir-vars"></span>

### 3. Inspect names with dir and vars

With no argument, `dir()` lists names in the current local scope. `vars()` gives a mapping of current local names to their values. We can inspect the names during an area calculation:

```python
def inspect_card(width, height):
    print("width" in dir())    # True: the name is local here.
    print(vars()["height"])   # 3: the local name maps to this value.
    return width * height

print(inspect_card(2, 3))      # 6
```

The workshop calculation should normally use `width` and `height` directly. `dir()` and `vars()` help us **inspect** the current namespace. With an object argument, `dir` lists available attributes; `vars` returns its attribute mapping when the object has one.

<span id="lookup"></span>

### 4. Python looks in the nearest scope first

If a name is not local, Python looks outward through enclosing function scopes, then the module's global scope, then built-in names. This is often remembered as **local → enclosing → global → built-ins**.

```python
UNIT = "cm²"  # Module-level name.

def describe_area(width, height):
    area = width * height       # width, height, area are local.
    return f"{area} {UNIT}"      # UNIT comes from the module.

print(describe_area(2, 3))      # 6 cm²
```

`print` is a built-in name. If a function defines a local name with the same spelling as an outer name, its local binding is found first. If no matching binding exists anywhere Python searches, `NameError` occurs.

An enclosing-function scope appears when one function is defined inside another. We will use one in the first-class-function example below: its inner function can still read a value supplied to its outer function.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: First-Class Objects

<span id="function-binding"></span>

### 1. A function name refers to a function object

A **first-class object** can be assigned to a name, passed as an argument, or returned by a function. Ordinary values such as numbers have these abilities. Python functions and classes do too.

When Python executes a `def` statement, it creates a function object and binds the function's name in the current namespace. A second name can refer to the **same function**, without defining it again:

```python
def rectangle_area(width, height):
    return width * height

area_of = rectangle_area

print(area_of(2, 3))             # 6
print(area_of is rectangle_area) # True
```

The book illustrates this with an alias for `print`. In the workshop we could write `show = print` and call `show("A area:", 6)`. The name `show` would refer to the existing built-in function. A class definition similarly binds a name to a class object; classes are developed in the next chapter.

<span id="function-parameter"></span>

### 2. Pass a function to another function

A function object can be passed as an argument. The book uses `max(..., key=abs)` to compare numbers by absolute value. We can pass a card-area function as `key` so `max` chooses the label with the largest area:

```python
CARD_SIZES = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}

def card_area(label):
    width, height = CARD_SIZES[label]
    return width * height

labels = ["A", "B", "C"]
largest_label = max(labels, key=card_area)

print(largest_label)                 # C
print(card_area(largest_label))      # 16
```

Notice `key=card_area` has **no parentheses**. We pass the function object; `max` calls it for each label. Writing `key=card_area("A")` would pass the number 6 instead of a function. The result of `max` is the winning **label** `"C"`, while the key function supplies its area for comparison.

<span id="function-return"></span>

### 3. Return a function that remembers an enclosing value

A function can also be a return value. This example prepares a rule for the total area of a chosen number of identical cards:

```python
def make_copy_total(number_of_copies):
    def total_for(one_card_area):
        return number_of_copies * one_card_area
    return total_for

two_copies = make_copy_total(2)
print(two_copies(6))  # Two A cards: 12 cm².
```

`make_copy_total(2)` returns the inner function object, not an area yet. When `two_copies(6)` runs later, it finds local `one_card_area = 6` and the **enclosing** `number_of_copies = 2`. This is why the lookup path includes enclosing function scopes. The inner function keeps access to that value even after the outer call has returned.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This program uses separate caller and function namespaces. The caller stores the catalog and requests. `summarize_cards` uses local names for its count and total, while `area_rule` is a parameter bound to a function object. The program then passes that function to `max` to select the largest accepted card.

```python
CARD_SIZES = {
    "A": (2, 3),
    "B": (4, 2),
    "C": (4, 4),
}

def card_area(label):
    width, height = CARD_SIZES[label]
    return width * height

def summarize_cards(labels, area_rule):
    accepted = []
    total_area = 0

    for label in labels:
        if label not in CARD_SIZES:
            print("Skipped unknown label:", label)
            continue
        one_area = area_rule(label)
        accepted.append(label)
        total_area += one_area

    count = len(accepted)
    average = round(total_area / count, 2) if count else None
    return accepted, total_area, average

requests = ["A", "C", "?", "A"]
area_of = card_area  # A second name for the same function object.

accepted, total, average = summarize_cards(requests, area_of)
largest = max(accepted, key=area_of) if accepted else None
average_text = f"{average} cm²" if average is not None else "(none)"

print("Accepted cards:", accepted)
print("Accepted count:", len(accepted))
print("Total area:", total, "cm²")
print("Average area:", average_text)
if largest is not None:
    print("Largest accepted card:", largest, area_of(largest), "cm²")

# Skipped unknown label: ?
# Accepted cards: ['A', 'C', 'A']
# Accepted count: 3
# Total area: 28 cm²
# Average area: 9.33 cm²
# Largest accepted card: C 16 cm²
```

Inside `summarize_cards`, `labels` refers to the caller's `requests` list and `area_rule` refers to the same function as `area_of`. Its `accepted` and `total_area` are local. The returned list remains available through the caller's new name `accepted`, and the two A requests correctly count as two physical cards.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: a misspelled measurement name</strong></summary>

**Scenario.** A calculation uses `heigth` instead of `height`.

```python
def area_of_a():
    width = 2
    height = 3
    return width * heigth

try:
    print(area_of_a())
except NameError:
    print("The calculation could not find 'heigth'.")

# The calculation could not find 'heigth'.
```

**Check.** Python cannot resolve the misspelled name, so multiplication never completes.

</details>

<details>
<summary><strong>Case Study 2: a local width does not replace the outer width</strong></summary>

**Scenario.** The main program stores A's width, while a function works with C's width.

```python
width = 2

def c_width():
    width = 4
    return width

print(c_width())  # 4
print(width)      # 2
```

**Check.** The function's `width` binding belongs to its call. The outer `width` still names 2.

</details>

<details>
<summary><strong>Case Study 3: a local name can refer to a shared list object</strong></summary>

**Scenario.** The caller passes a request list to a function that adds C.

```python
requests = ["A"]

def add_c(data):
    data.append("C")

add_c(requests)
print(requests)  # ['A', 'C']
```

**Check.** `data` is a local name, but it refers to the same mutable list as `requests`. Changing that list is different from rebinding the local name `data`.

</details>

<details>
<summary><strong>Case Study 4: reading a name before its local assignment</strong></summary>

**Scenario.** The program has a total of 28 cm². A function tries to add B's 8 cm² by assigning to a name with the same spelling.

```python
total_area = 28

def incorrect_addition():
    total_area += 8  # Treated as a local name, but has no local value yet.

try:
    incorrect_addition()
except UnboundLocalError:
    print("Pass the total in and return the new total.")

def add_area(current_total, new_area):
    return current_total + new_area

total_area = add_area(total_area, 8)
print(total_area)  # 36
```

**Check.** Because the function assigns to `total_area`, Python treats that name as local throughout the function. The attempted read occurs before a local value exists. Passing a value and returning the result makes the update clear.

</details>

<details>
<summary><strong>Case Study 5: a function is a value used by max</strong></summary>

**Scenario.** Select the largest card from A, B, and C using a function that computes area.

```python
sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}

def area_for(label):
    width, height = sizes[label]
    return width * height

rule = area_for
largest = max(["A", "B", "C"], key=rule)
print(largest, rule(largest))  # C 16
```

**Check.** `rule` and `area_for` refer to the same function. `max` calls it for each candidate and returns the label with the largest area.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 1.10 idea | What it means | Rectangle-card example |
| :--- | :--- | :--- |
| Name resolution | Find the object associated with a name. | Resolve `width` and `height` before multiplying. |
| `NameError` | No binding for a requested name was found. | Misspelling `height` as `heigth` breaks an area calculation. |
| Scope | The region where a name can be used. | A function's local `width` can differ from the module's `width`. |
| Namespace | A mapping of names to objects. | Caller `requests` and function `data` refer to the same list object. |
| Function call | Creates its own local parameter and calculation names. | `count_cards` uses `data`, `target`, `n`, and `item`. |
| `dir()` and `vars()` | Inspect local names and their current values. | Find `width` in local names and read `height` from the local mapping. |
| Outward lookup | Search local, enclosing, global, then built-in names. | Read global `CARD_SIZES` from `card_area`; find built-in `max`. |
| First-class function | A function can be named, passed, or returned like another value. | `area_of = card_area`; `max(..., key=area_of)`. |
| Function definition | Binds a name to a function object. | `def card_area(...):` gives the calculation a name. |
| Shared mutable object | A local parameter may refer to a caller-owned object. | `data.append("C")` changes the caller's request list. |

[🔝 Back to Top](#top)
