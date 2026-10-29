<span id="top"></span>

# 1.11 Modules and the Import Statement — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.11, printed pages 48–50 (the supplied PDF).  
> **Topic:** Importing names; creating a module; existing standard-library modules; pseudo-random number generation.  
> **Domain Focus:** Reusing rectangle-card calculations, finding card diagonals, and making repeatable sample choices.  
> **User Prompt:** Reexplain Section 1.11 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Geometry Toolbox](#background)
   - [1. The same rectangle-card workshop](#background-cards)
   - [2. Why put calculations in another file?](#background-toolbox)
2. [Part 1: 1.11 Modules and the Import Statement](#part-1)
   - [1. Built-in names and library names](#builtins-and-library)
   - [2. Import a module or selected names](#import-styles)
   - [3. Why `from ... import *` can be confusing](#wildcard-import)
   - [4. A module is an object with its own names](#module-object)
3. [Part 2: Creating a New Module](#part-2)
   - [1. Save the shared geometry definitions](#create-module)
   - [2. Import and use the new module](#use-module)
   - [3. Run code only when the file is the main program](#main-guard)
4. [Part 3: 1.11.1 Existing Modules](#part-3)
   - [1. What the standard library provides](#library-table)
   - [2. Use `math` for a connected geometry question](#math-geometry)
5. [Part 4: Pseudo-Random Number Generation](#part-4)
   - [1. A number sequence can look random but be repeatable](#pseudo-random)
   - [2. Seeds and independent generators](#seeds)
   - [3. Choose, count, and shuffle cards](#random-operations)
6. [Part 5: One Connected Geometry Program](#part-5)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Geometry Toolbox

<span id="background-cards"></span>

### 1. The same rectangle-card workshop

Students cut rectangular cards for a display board. **Area = width × height**, with lengths in centimetres.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The request `['A', 'C', 'A']` represents **three physical cards**. Their areas are `[6, 16, 6]` cm², so the total is `28` cm² and the average is about `9.33` cm² per card. An unknown label such as `'?'` is skipped.

We also want a card's **diagonal**: the straight line from one corner to the opposite corner. For width `w` and height `h`, the Pythagorean theorem gives `diagonal = √(w² + h²)`. Card A's diagonal is `√13 ≈ 3.61` cm.

<span id="background-toolbox"></span>

### 2. Why put calculations in another file?

Several workshop programs might need the same card sizes, area formula, and diagonal formula. A **module** lets us save those definitions in one Python file and import them elsewhere. Python's `math` module already supplies `sqrt`, the square-root operation needed for a diagonal.

```text
card_workshop.py  →  geometry_cards.py  →  math.sqrt
main program         our reusable module   standard-library function
```

> **Mental model:** A module is a named toolbox. `import` makes the toolbox, or selected tools from it, available to the current program. The module keeps its own names, which connects directly to Section 1.10's namespaces.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.11 Modules and the Import Statement

<span id="builtins-and-library"></span>

### 1. Built-in names and library names

Python provides a small collection of names immediately, including `max`, `min`, `abs`, `round`, and `list`. For example, `max` finds the largest card area without an import:

```python
areas = [6, 8, 16]
print(max(areas))  # 16
```

Many more operations live in **standard-library modules**. The `math` module contains `sqrt`, `sin`, `cos`, and constants such as `pi` and `e`. We must import a module or a name from it before using it in our file.

<span id="import-styles"></span>

### 2. Import a module or selected names

There are two common ways to reach `sqrt`:

```python
import math

diagonal_a = math.sqrt(2**2 + 3**2)
print(round(diagonal_a, 2))  # 3.61
```

`import math` binds the name `math` to a module object. The dot in `math.sqrt` means “find `sqrt` in that module.” This makes the origin of the operation visible.

```python
from math import pi, sqrt

diagonal_a = sqrt(2**2 + 3**2)
sticker_area = pi * 1**2  # A circular sticker of radius 1 cm
print(round(diagonal_a, 2))   # 3.61
print(round(sticker_area, 2))  # 3.14
```

`from math import pi, sqrt` binds `pi` and `sqrt` directly in the current namespace; it does **not** bind the name `math`. Both styles use the same mathematical operations.

| Statement | Name made available here | Use |
| :--- | :--- | :--- |
| `import math` | `math` | `math.sqrt(13)` |
| `from math import sqrt` | `sqrt` | `sqrt(13)` |
| `import math as geometry_math` | `geometry_math` | `geometry_math.sqrt(13)` |

The optional `as` gives the imported module a local name. It does not change the module itself.

<span id="wildcard-import"></span>

### 3. Why `from ... import *` can be confusing

`from math import *` brings many public names from `math` into the current namespace. A name already used for a geometry calculation can be replaced without the import line naming it explicitly:

```python
pi = 3  # A rough classroom estimate
from math import *

print(round(pi, 2))  # 3.14: the import rebound pi
```

The result is mathematically better here, but the change to `pi` is easy to miss. Explicit imports show which names enter the program; `import math` also keeps them visibly under `math.`.

<span id="module-object"></span>

### 4. A module is an object with its own names

Like the functions from Section 1.10, a module is an object. A name can refer to it, and another name can refer to that same object:

```python
import math

geometry_math = math
print(geometry_math is math)       # True
print(geometry_math.sqrt(13) > 3)  # True
```

The caller's namespace contains `math` and `geometry_math`; the module's namespace contains `sqrt` and `pi`. Neither `sqrt` nor `pi` becomes a bare name in the caller just because we used `import math`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creating a New Module

<span id="create-module"></span>

### 1. Save the shared geometry definitions

Save this as **`geometry_cards.py`**. Its file name supplies the module name `geometry_cards`; the functions and card table are the tools it offers.

```python
# geometry_cards.py
from math import sqrt

CARD_SIZES = {
    "A": (2, 3),
    "B": (4, 2),
    "C": (4, 4),
}

def card_area(label):
    width, height = CARD_SIZES[label]
    return width * height

def card_diagonal(label):
    width, height = CARD_SIZES[label]
    return sqrt(width**2 + height**2)

if __name__ == "__main__":
    print("Direct module check: A =", card_area("A"), "cm²")
```

`CARD_SIZES`, `card_area`, and `card_diagonal` are names in this module. `sqrt` is also a name in this module because of its `from math import sqrt` statement. The functions use that module namespace when called from another file.

<span id="use-module"></span>

### 2. Import and use the new module

Save the next code in another `.py` file **beside** `geometry_cards.py`, then run that file. The module name in an `import` statement leaves off `.py`.

```python
import geometry_cards
from geometry_cards import card_area

print(geometry_cards.card_area("A"))          # 6
print(round(geometry_cards.card_diagonal("A"), 2))  # 3.61
print(card_area("C"))                         # 16
```

`import geometry_cards` gives access through the module name. `from geometry_cards import card_area` also creates a direct local name for that function. Both refer to the same function object. The module's top-level statements run when it is first imported in a Python process; later imports in that process normally reuse the loaded module.

<span id="main-guard"></span>

### 3. Run code only when the file is the main program

Python sets a file's special `__name__` value according to how it is used:

| How `geometry_cards.py` is used | Its `__name__` | Does the direct check run? |
| :--- | :--- | :--- |
| Run as `python geometry_cards.py` | `"__main__"` | Yes: prints A's 6 cm² area. |
| Imported with `import geometry_cards` | `"geometry_cards"` | No: the guarded print is skipped. |

The definitions outside the guard still execute during import, so `card_area` and `card_diagonal` become available. The guard keeps a quick check or script action from printing every time another program imports the module.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.11.1 Existing Modules

<span id="library-table"></span>

### 1. What the standard library provides

Python ships with modules for tasks beyond the built-in names. Section 1.11 gives these examples:

| Module | Main job | Possible workshop use |
| :--- | :--- | :--- |
| `array` | Store many values of one basic type compactly. | Keep a large collection of measured widths. |
| `collections` | Provide specialized containers. | Count how often each card label appears. |
| `copy` | Make shallow or deep copies. | Copy a card record before changing it. |
| `heapq` | Maintain a heap for priority access. | Repeatedly find a small-area card. |
| `math` | Provide mathematical functions and constants. | Find diagonals with `sqrt`. |
| `os` | Interact with the operating system. | Work with a workshop data directory. |
| `random` | Generate pseudo-random selections. | Draw a card label for a sample. |
| `re` | Match text patterns. | Check a label's text format. |
| `sys` | Access interpreter and program information. | Read command-line arguments. |
| `time` | Work with clock time. | Measure how long a calculation takes. |

We import only the modules needed for a particular program. A library module can itself import other modules, just as our `geometry_cards.py` imports from `math`.

<span id="math-geometry"></span>

### 2. Use `math` for a connected geometry question

Card C is 4 cm wide and 4 cm high. Its diagonal is the hypotenuse of a right triangle with legs of length 4 cm:

```python
import math

diagonal_c = math.sqrt(4**2 + 4**2)
print(round(diagonal_c, 2))  # 5.66 cm

sticker_radius = 1  # cm
sticker_area = math.pi * sticker_radius**2
print(round(sticker_area, 2))  # 3.14 cm²
```

The circular sticker is a second geometry calculation in the same workshop. `math.sqrt` supplies the diagonal's square root; `math.pi` supplies the constant for a circle's area. The `math` module also contains `sin`, `cos`, and `e`, though this card task does not need them.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Pseudo-Random Number Generation

<span id="pseudo-random"></span>

### 1. A number sequence can look random but be repeatable

Suppose we want to draw card labels for a classroom simulation. A computer can keep a hidden **state** and update it by a fixed rule. This tiny rule illustrates the idea:

```text
next_state = (2 × current_state + 1) % 5

starting at 1:  1 → 3 → 2 → 0 → 1 → ...
```

The values vary, but the same starting state gives the same sequence. This is **pseudo-random** generation. Python's `random` module uses a much more sophisticated generator, the Mersenne Twister; the tiny formula above is only a teaching model, not Python's algorithm.

Pseudo-random results are useful for simulations and repeatable examples. They should not be used where an unpredictable security secret is required.

<span id="seeds"></span>

### 2. Seeds and independent generators

A **seed** sets a generator's starting state. Two separate `Random` objects with the same seed and the same sequence of calls produce the same classroom sample within the same Python implementation:

```python
from random import Random

labels = ("A", "B", "C")
first = Random(7)
second = Random(7)

first_draws = [first.choice(labels) for _ in range(3)]
second_draws = [second.choice(labels) for _ in range(3)]
print(first_draws == second_draws)  # True
```

Each call advances only its own generator's state. The module-level functions such as `random.choice(...)` use a shared default generator; `random.seed(7)` resets that default generator. An instance such as `Random(7)` keeps the workshop's sequence separate from unrelated code that also uses `random`.

<span id="random-operations"></span>

### 3. Choose, count, and shuffle cards

Section 1.11 introduces these common operations. Here `rng = Random(7)` and `labels = ["A", "B", "C"]`:

| Operation | Result or effect | Card interpretation |
| :--- | :--- | :--- |
| `rng.seed(7)` | Restart this generator from seed `7`. | Repeat the same sampling setup. |
| `rng.random()` | Float `x` with `0.0 <= x < 1.0`. | A basic random value for a simulation. |
| `rng.randint(1, 3)` | Integer from `1` through `3`, **including 3**. | Pick one of three numbered positions. |
| `rng.randrange(0, 3)` | Integer from `0` through `2`; stop `3` is excluded. | Pick a valid index into `labels`. |
| `rng.choice(labels)` | One element from the nonempty list. | Pick A, B, or C directly. |
| `rng.shuffle(labels)` | Rearrange the list **in place**; return `None`. | Mix the order of the labels. |

`randrange` can also take a step, just like `range`: `rng.randrange(0, 6, 2)` chooses from `0`, `2`, and `4`. Here is a small card draw and shuffle:

```python
from random import Random

rng = Random(7)
labels = ["A", "B", "C"]
picked = rng.choice(labels)
order = labels.copy()
rng.shuffle(order)

print(picked in labels)                    # True
print(sorted(order) == sorted(labels))    # True
```

`shuffle` changes `order`, leaving the original `labels` list in its original order. It preserves the same three card labels.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

Use the `geometry_cards.py` file from Part 2. Save this program as **`card_workshop.py` in the same directory**, then run `python card_workshop.py`.

```python
# card_workshop.py
import geometry_cards as cards
from random import Random

requests = ["A", "C", "?", "A"]
accepted = [label for label in requests if label in cards.CARD_SIZES]
areas = [cards.card_area(label) for label in accepted]
total_area = sum(areas)
average_area = total_area / len(accepted) if accepted else None
largest = max(accepted, key=cards.card_area) if accepted else None

print("Accepted:", accepted)
print("Areas:", areas)
print("Count:", len(accepted))
print("Total area:", total_area, "cm²")
print("Average area:", f"{average_area:.2f} cm²" if average_area is not None else "(none)")
if largest is not None:
    print("Largest accepted:", largest, cards.card_area(largest), "cm²")
print("A diagonal:", round(cards.card_diagonal("A"), 2), "cm")

rng = Random(7)
sampled = [rng.choice(tuple(cards.CARD_SIZES)) for _ in range(3)]
sample_total = sum(cards.card_area(label) for label in sampled)
print("Seeded sample:", sampled)
print("Sample total:", sample_total, "cm²")
```

The fixed request list gives `['A', 'C', 'A']`, areas `[6, 16, 6]`, count `3`, total `28 cm²`, average `9.33 cm²`, and largest accepted card C with `16 cm²`. The `?` is ignored before any area lookup. A's diagonal is about `3.61 cm`. The final two lines describe a **separate** three-card random sample; they do not change the fixed request total.

| Name or expression | Where it comes from | Job |
| :--- | :--- | :--- |
| `cards` | `import geometry_cards as cards` | Namespace for our card sizes and functions. |
| `cards.card_area` | Our module | Convert a known label to its rectangle area. |
| `cards.card_diagonal` | Our module, using `math.sqrt` | Find a card's corner-to-corner length. |
| `Random` | `from random import Random` | Create an independent seeded generator. |
| `rng.choice(...)` | The generator object | Choose labels for the separate sample. |

The two files make the division of work clear: `geometry_cards.py` defines reusable geometry operations, while `card_workshop.py` decides which cards to process and what to report.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: a qualified name shows which module supplies a tool</strong></summary>

**Scenario.** We imported `math`, then need card A's diagonal.

```python
import math

diagonal_a = math.sqrt(2**2 + 3**2)
print(round(diagonal_a, 2))  # 3.61
```

**Check.** `import math` gives us `math.sqrt`. A bare `sqrt(13)` would need a separate `from math import sqrt` or another binding for `sqrt`.

</details>

<details>
<summary><strong>Case Study 2: a broad import can replace an existing name</strong></summary>

**Scenario.** The workshop starts with a rough value for a circular sticker calculation.

```python
pi = 3
rough_area = pi * 1**2

from math import *
precise_area = pi * 1**2

print(rough_area)                 # 3
print(round(precise_area, 2))    # 3.14
```

**Check.** The wildcard import rebinds `pi`. `import math` would let us write `math.pi` while leaving the existing `pi` alone.

</details>

<details>
<summary><strong>Case Study 3: imported module checks stay quiet</strong></summary>

**Scenario.** `geometry_cards.py` from Part 2 has a guarded direct check.

```python
import geometry_cards
import geometry_cards

print(geometry_cards.__name__)        # geometry_cards
print(geometry_cards.card_area("B"))  # 8
```

**Check.** Importing does not print the guarded A check. The second import normally reuses the already loaded module instead of running its top-level code again.

</details>

<details>
<summary><strong>Case Study 4: a seed repeats a sampling setup</strong></summary>

**Scenario.** Two students want to compare results from the same three-card draw.

```python
from random import Random

labels = ("A", "B", "C")
draw_one = Random(7)
draw_two = Random(7)

first = [draw_one.choice(labels) for _ in range(3)]
second = [draw_two.choice(labels) for _ in range(3)]
print(first == second)  # True
```

**Check.** Identical seeds and identical calls give matching samples for these two generators. Each draw still advances its own state.

</details>

<details>
<summary><strong>Case Study 5: shuffle changes order, not the card collection</strong></summary>

**Scenario.** The physical cards A, C, and A are mixed before display.

```python
from random import Random

cards = ["A", "C", "A"]
original = cards.copy()
result = Random(7).shuffle(cards)

print(result)                       # None
print(sorted(cards) == sorted(original))  # True
print(len(cards))                   # 3
```

**Check.** `shuffle` mutates the list and returns `None`. Both A cards remain, so their combined area contribution is still `12 cm²`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 1.11 idea | What it means | Rectangle-card example |
| :--- | :--- | :--- |
| Built-in names | Available without an import. | `max([6, 8, 16])` gives `16`. |
| Standard-library module | A supplied namespace of related tools. | `math.sqrt` finds a card diagonal. |
| `import module` | Bind the module object; use dotted names. | `import math`, then `math.sqrt(13)`. |
| `from module import name` | Bind selected names directly in this file. | `from math import sqrt`. |
| `from module import *` | Bind many public names, possibly replacing existing ones. | `pi = 3` is replaced by `math`'s `pi`. |
| Module object | Can be assigned another name like other objects. | `geometry_math = math`. |
| New module | Save reusable definitions in a `.py` file. | `geometry_cards.py` stores sizes and formulas. |
| Main guard | Run a check only when the file is started directly. | `if __name__ == "__main__":` prints A's area only in a direct run. |
| Existing modules | Provide tools for containers, math, text, system tasks, and more. | `math` and `random` support the workshop. |
| Pseudo-random generator | Uses state to produce a repeatable sequence. | `Random(7)` makes a repeatable card sample. |
| `choice` and `shuffle` | Choose one item or mix a list in place. | Draw A/B/C; reorder A/C/A without losing a card. |
| `randint` and `randrange` | Select integers with different endpoint rules. | Choose positions `1..3` or indices `0..2`. |

[🔝 Back to Top](#top)
