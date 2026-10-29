<span id="top"></span>

# 1.12 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.12, printed pages 51–54 (the supplied PDF).  
> **Topic:** Reinforcement R-1.1–R-1.12; Creativity C-1.13–C-1.28; Projects P-1.29–P-1.36.  
> **Domain Focus:** Rectangle-card measurements, square tiles, display-board layouts, and small simulations.  
> **User Prompt:** Reexplain Section 1.12 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. Keep one geometry setting](#background-cards)
   - [2. Read the three exercise groups](#background-groups)
2. [Part 1: Reinforcement — R-1.1 to R-1.12](#part-1)
   - [1. Number properties and functions](#reinforcement-numbers)
   - [2. Square areas and comprehensions](#reinforcement-squares)
   - [3. Indices, ranges, and generated patterns](#reinforcement-sequences)
   - [4. Select a card by a random position](#reinforcement-random)
3. [Part 2: Creativity — C-1.13 to C-1.28](#part-2)
   - [1. Reverse, compare, and recognize pairs](#creativity-sequences)
   - [2. Changing a list versus changing a loop name](#creativity-scale)
   - [3. Generate patterns and labels](#creativity-patterns)
   - [4. Random order, input, products, and bounds](#creativity-process)
   - [5. Text and arithmetic checks](#creativity-text)
   - [6. Factor order and vector length](#creativity-geometry)
4. [Part 3: Projects — P-1.29 to P-1.36](#part-3)
   - [1. Enumerate arrangements and count halvings](#projects-patterns)
   - [2. Make change and build calculators](#projects-calculators)
   - [3. Controlled output and counting experiments](#projects-counting)
5. [Part 4: One Connected Geometry Program](#part-4)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. Keep one geometry setting

Students cut rectangular cards for a display board. **Area = width × height**, with all lengths in centimetres.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The request `['A', 'C', 'A']` contains **three physical cards**, even though there are only two card types. Their areas are `[6, 16, 6]` cm². The total is `28` cm² and the average is about `9.33` cm² per card. An unknown label `'?'` is skipped.

Some exercises need other small measurements: square tiles with side lengths `1, 2, 3, ...`, a display strip that can be halved, or coordinates such as `(3, 4)`. These still belong to the same workshop.

<span id="background-groups"></span>

### 2. Read the three exercise groups

Section 1.12 contains **36 prompts**, grouped by the kind of work they ask for. It does not introduce a new Python syntax rule; it asks us to combine ideas from Sections 1.1–1.11.

| Group | Exercise IDs | Main kind of work |
| :--- | :--- | :--- |
| Reinforcement | R-1.1–R-1.12 | Short functions, expressions, and direct checks. |
| Creativity | C-1.13–C-1.28 | Explain behavior and design small algorithms. |
| Projects | P-1.29–P-1.36 | Build programs with several steps or inputs. |

The tables below explain **what each numbered prompt is asking** and attach it to a small card-workshop situation. A restriction such as “do not use `min` or `max`” belongs to its particular exercise; it is not a rule for every program in the guide.

> **Mental model:** First identify the input and requested output. Then note any restriction, such as a forbidden operator or a required order. Finally, trace a small geometry example before writing a general program.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement — R-1.1 to R-1.12

<span id="reinforcement-numbers"></span>

### 1. Number properties and functions: R-1.1–R-1.3

These prompts turn a simple question into a function that accepts data and returns a value.

| ID | Reexplained task and key condition | Geometry connection |
| :--- | :--- | :--- |
| **R-1.1** | Decide whether integer `n` is an exact multiple of integer `m`; return a Boolean. | A 28 cm strip holds seven 4 cm lengths with no remainder. |
| **R-1.2** | Decide whether integer `k` is even **without** multiplication, modulo, or division operators. | Can a count of cards be divided into pairs? The function must also handle negative integer parity. |
| **R-1.3** | Scan a **nonempty** numeric sequence and return `(smallest, largest)`; do not call built-in `min` or `max`. | Areas `[6, 16, 6]` have extrema `(6, 16)`. |

For R-1.3, imagine comparing each newly measured card with the smallest and largest area seen so far. Returning a tuple gives both answers together. For R-1.2, “even” describes an integer's parity; negative numbers are possible inputs even though a physical card count cannot be negative.
For R-1.1, a zero value of `m` needs a deliberate rule because `n % 0` raises an error.

<span id="reinforcement-squares"></span>

### 2. Square areas and comprehensions: R-1.4–R-1.7

Add square tiles to the display. A square with side `s` has area `s²`. If `n = 5`, the **positive** side lengths **strictly below** `n` are `1, 2, 3, 4`.

| ID | Reexplained task | With `n = 5` |
| :--- | :--- | :--- |
| **R-1.4** | Write a function that adds the squares of all positive integers below `n`. | `1² + 2² + 3² + 4² = 30`. |
| **R-1.5** | Express that same sum in **one command** using a comprehension and `sum`. | The result is still `30`. |
| **R-1.6** | Write a function that adds squares of only **odd** positive integers below `n`. | `1² + 3² = 10`. |
| **R-1.7** | Express the odd-square sum in **one command** using a comprehension and `sum`. | The result is still `10`. |

```python
n = 5
sides = list(range(1, n))
areas = [side**2 for side in sides]
odd_areas = [side**2 for side in sides if side % 2 == 1]

print(sides)            # [1, 2, 3, 4]
print(sum(areas))       # 30
print(sum(odd_areas))   # 10
```

The loop or comprehension must stop before `n`; `range(1, n)` expresses that boundary. The function versions ask you to organize the calculation as a reusable operation. The one-command versions ask for the same arithmetic in a compact expression.

<span id="reinforcement-sequences"></span>

### 3. Indices, ranges, and generated patterns: R-1.8–R-1.11

| ID | Reexplained task | Geometry connection |
| :--- | :--- | :--- |
| **R-1.8** | For `-n <= k < 0` in a length-`n` sequence, convert negative index `k` to the equivalent nonnegative index `n + k`. | In `['A', 'C', 'A']`, index `-2` and index `1` both select C. |
| **R-1.9** | Choose `range` arguments that produce exactly `50, 60, 70, 80`. | Mark a board every 10 cm; the stop must come after 80. |
| **R-1.10** | Choose a descending `range` that produces `8, 6, ..., -8`. | Mark positions every 2 cm across a signed coordinate line. |
| **R-1.11** | Use a list comprehension to make powers of two from `1` through `256`. | A series of 1 cm-high strips doubles its width each time. |

```python
labels = ["A", "C", "A"]
print(labels[-2], labels[len(labels) - 2])  # C C
print(list(range(50, 90, 10)))             # [50, 60, 70, 80]
print(list(range(8, -10, -2)))             # [8, 6, 4, 2, 0, -2, -4, -6, -8]
print([2**power for power in range(9)])   # 1, 2, 4, ..., 256
```

In each `range`, the stop value is **excluded**. The descending example needs a negative step and a stop below `-8`. For R-1.11, the exponent begins at `0`, because `2⁰ = 1`.

<span id="reinforcement-random"></span>

### 4. Select a card by a random position: R-1.12

**R-1.12** asks for a version of `choice(data)` that uses `randrange` as its random-selection tool. The given sequence is nonempty. Choose a valid **index** first, then return the element at that index.

```python
from random import randrange

physical_cards = ["A", "C", "A"]
position = randrange(len(physical_cards))
chosen_label = physical_cards[position]
print(0 <= position < len(physical_cards))  # True
print(chosen_label in physical_cards)        # True
```

The two A entries are two different positions, so a uniform choice of positions gives card type A two chances and C one chance. Calling `random.choice` inside the proposed implementation would miss the exercise's “using only `randrange`” requirement.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity — C-1.13 to C-1.28

<span id="creativity-sequences"></span>

### 1. Reverse, compare, and recognize pairs: C-1.13–C-1.15

| ID | Reexplained task | Geometry connection |
| :--- | :--- | :--- |
| **C-1.13** | Describe list reversal in pseudocode, then compare that method with a Python function. | Reverse the display order of area readings `[6, 8, 16]` to `[16, 8, 6]`. |
| **C-1.14** | Find whether two **different positions** hold integers whose product is odd. | Two odd coordinate marks, such as `1` and `3`, have an odd product; the areas `6, 8, 16` do not. |
| **C-1.15** | Decide whether every number in a sequence is distinct. | `[6, 16, 6]` is not distinct because the two A cards have equal areas. |

For C-1.14, an odd product requires **two odd factors**, not merely one. Check two different entries, such as coordinate marks `1` and `3`. For C-1.15, comparing the number of entries with the number of distinct values is one way to think about the question.

<span id="creativity-scale"></span>

### 2. Changing a list versus changing a loop name: C-1.16–C-1.17

These two prompts refer back to a `scale` function from Section 1.5. Their puzzle is about **what gets changed**. Suppose card A's side lengths `[2, 3]` are doubled. The new dimensions `[4, 6]` produce area `24 cm²`.

| ID | Reexplained question | Key distinction |
| :--- | :--- | :--- |
| **C-1.16** | Why can `data[j] *= factor` affect the caller's list even though numbers are immutable? | It computes a new number and stores it **in a slot of the shared list**. |
| **C-1.17** | Would `for val in data: val *= factor` scale that list? | Rebinding local `val` does **not** replace a list slot. |

```python
indexed_sides = [2, 3]
for j in range(len(indexed_sides)):
    indexed_sides[j] *= 2

loop_sides = [2, 3]
for value in loop_sides:
    value *= 2

print(indexed_sides)  # [4, 6]
print(loop_sides)     # [2, 3]
```

In the first loop, the list is mutable even though each integer is immutable. In the second loop, `value` receives each integer, then is rebound to a new integer; the list still holds its original integers.

<span id="creativity-patterns"></span>

### 3. Generate patterns and labels: C-1.18–C-1.19

| ID | Reexplained task | Geometry connection |
| :--- | :--- | :--- |
| **C-1.18** | Use a comprehension to generate `0, 2, 6, 12, ... , 90`. | Each value is the area of a rectangle with sides `i` and `i + 1`, for `i` from `0` to `9`. |
| **C-1.19** | Generate the lowercase alphabet without typing all 26 letters. | Produce labels for many card types; character codes advance from `'a'`. |

```python
first_areas = [side * (side + 1) for side in range(5)]
first_labels = [chr(ord("a") + offset) for offset in range(5)]

print(first_areas)   # [0, 2, 6, 12, 20]
print(first_labels)  # ['a', 'b', 'c', 'd', 'e']
```

The zero term is a mathematical pattern entry, not a physical card with positive side lengths. The `ord` and `chr` functions convert between a character and its numeric code.

<span id="creativity-process"></span>

### 4. Random order, input, products, and bounds: C-1.20–C-1.23

| ID | Reexplained task and constraint | Geometry connection |
| :--- | :--- | :--- |
| **C-1.20** | Implement a **uniform** in-place shuffle using `randint` as the random tool. | Mix three physical cards; on each backward pass, swap the current position with one uniformly chosen earlier position, including itself. |
| **C-1.21** | Keep calling `input()` until it raises `EOFError`, then output the saved lines in reverse order. | A recorder enters card labels or measurements; after input ends, display the notes last-to-first. |
| **C-1.22** | Produce an array whose entry `c[i]` is `a[i] * b[i]` for two equal-length integer arrays. | Widths `[2, 4, 4]` and heights `[3, 2, 4]` produce areas `[6, 8, 16]`. |
| **C-1.23** | Show an out-of-bounds list assignment and catch its `IndexError` to print `Don't try buffer overflow attacks in Python!` | Assigning to index `3` of a three-area list fails; valid existing indices are `0`, `1`, and `2`. |

The book calls C-1.22 a “dot product,” but the array it specifies is **elementwise multiplication**. In standard mathematics, the dot product of those width and height vectors is the single number `6 + 8 + 16 = 30`. Preserve the exercise's requested array output while keeping these two meanings separate.

```python
widths = [2, 4, 4]
heights = [3, 2, 4]
area_array = [widths[j] * heights[j] for j in range(len(widths))]
scalar_dot_product = sum(area_array)

print(area_array)          # [6, 8, 16]
print(scalar_dot_product)  # 30
```

For C-1.20, swapping each position with a choice from the remaining positions is what gives every arrangement of **distinct physical cards** an equal chance. Repeated labels such as A and A still represent separate cards. For C-1.21, end-of-file signals that there are no more lines; on many Windows consoles it is entered with Ctrl+Z and Enter, while the book describes Ctrl+D.

<span id="creativity-text"></span>

### 5. Text and arithmetic checks: C-1.24–C-1.26

| ID | Reexplained task | Workshop connection |
| :--- | :--- | :--- |
| **C-1.24** | Count vowels in an input string. | Count the vowel letters in a card description such as `"A blue card"`. |
| **C-1.25** | Return a copy of a sentence with punctuation removed. | Clean a display note such as `"A, C, A!"` into `"A C A"`. |
| **C-1.26** | Read three integers and test whether they form a correct arithmetic statement **in their given order**. | The measurements `2, 3, 6` satisfy `2 * 3 == 6`, matching card A's area. |

These are still Python-primer tasks: loop through characters, build a result, read input, and test conditions. The geometry examples give a reason for the text and arithmetic checks, but the original prompts allow other strings and integers.

<span id="creativity-geometry"></span>

### 6. Factor order and vector length: C-1.27–C-1.28

| ID | Reexplained task | Geometry connection |
| :--- | :--- | :--- |
| **C-1.27** | Adapt the efficient factor generator from Section 1.8 so that factors come out in **increasing order**. | A 28 cm² display rectangle has possible whole-number widths `1, 2, 4, 7, 14, 28`. |
| **C-1.28** | Implement `norm(v, p)` and default to `p = 2`. | A displacement of 3 cm across and 4 cm up has Euclidean length `√(3² + 4²) = 5` cm. |

Factors come in pairs: for area `28`, `1 × 28`, `2 × 14`, and `4 × 7`. To retain the factor generator's speed, scan only through `√n`, report small factors, and save their large partners for reverse-order reporting. If `n` is a perfect square, its square-root factor should appear only once.

For a vector `v = (v₁, ..., vₙ)`, the usual mathematical **p-norm** is `(Σ |vᵢ|ᵖ)^(1/p)` for `p ≥ 1`. With positive components `(3, 4)`, the `2`-norm is `5` and the `1`-norm is `7`. The default argument makes `norm(v)` mean `norm(v, 2)`.

```python
from math import sqrt

area = 28
small = [d for d in range(1, int(sqrt(area)) + 1) if area % d == 0]
large = [area // d for d in reversed(small)]
factors = small + large

vector = (3, 4)
euclidean_length = sqrt(sum(component**2 for component in vector))
print(factors)            # [1, 2, 4, 7, 14, 28]
print(euclidean_length)   # 5.0
```

The factor code uses `28`, which is not a perfect square; a general implementation must avoid duplicating a square root when it is an integer.
It displays a list to make the order visible; C-1.27 specifically asks for a generator.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Projects — P-1.29 to P-1.36

These prompts ask for complete programs. The geometry examples below show the underlying pattern without changing the original program's required input or output.

<span id="projects-patterns"></span>

### 1. Enumerate arrangements and count halvings: P-1.29–P-1.30

| ID | Reexplained program goal | Geometry connection |
| :--- | :--- | :--- |
| **P-1.29** | Output every string that uses each of `c`, `a`, `t`, `d`, `o`, `g` exactly once. | Arrange three distinct cards A, B, C in all `3! = 6` orders before considering the original six-letter problem with `6! = 720` orders. |
| **P-1.30** | For an input integer greater than `2`, count how many divisions by `2` make the value fall below `2`. | Repeatedly halve a 28 cm strip: `28 → 14 → 7 → 3.5 → 1.75`, which takes four halvings. |

```python
from itertools import permutations

orders = list(permutations(("A", "B", "C")))
print(len(orders))  # 6

length = 28
halvings = 0
while length >= 2:
    length /= 2
    halvings += 1
print(halvings, length)  # 4 1.75
```

The small arrangement shows why every position must receive one unused item. In the original P-1.29 project, the six given letters must each appear once in every output string; simply picking a random letter six times could repeat one and omit another.

<span id="projects-calculators"></span>

### 2. Make change and build calculators: P-1.31–P-1.33

| ID | Reexplained program goal | Workshop connection |
| :--- | :--- | :--- |
| **P-1.31** | Given an amount charged and an amount paid, return bills and coins for the difference, aiming for as **few pieces** as possible; denominations may come from any current or former government's monetary system. | Decomposing a remaining 6 cm strip into permitted lengths resembles choosing denominations for change. The actual project uses money. |
| **P-1.32** | Read calculator numbers and operators on **separate console lines**, showing the display after each entry. | Inputs `2`, `*`, `3`, `=` can calculate card A's `2 × 3 = 6` cm². |
| **P-1.33** | Simulate button presses of a handheld calculator, including basic arithmetic and a **clear/reset** action. | Enter A's area, clear the screen, then calculate B's `4 × 2 = 8` cm². |

For P-1.31, always taking the largest available denomination first may fail to use the fewest pieces. With values `1, 3, 4`, making `6` as `4 + 1 + 1` takes three pieces; `3 + 3` takes two. The program needs a strategy that matches the chosen monetary system and its “fewest” goal.

The calculator projects need **state**: the current display, a saved first number, and a pending operator. P-1.32 emphasizes line-by-line console input and output. P-1.33 additionally requires a reset action that clears the state.

| Button or line entered | Possible display | State idea |
| :--- | :--- | :--- |
| `2` | `2` | First number entered. |
| `*` | `2` | Multiplication is pending. |
| `3` | `3` | Second number entered. |
| `=` | `6` | Compute `2 * 3`. |
| `C` | `0` | Clear the display and pending operation. |

<span id="projects-counting"></span>

### 3. Controlled output and counting experiments: P-1.34–P-1.36

| ID | Reexplained program goal | Workshop connection |
| :--- | :--- | :--- |
| **P-1.34** | Print `I will never spam my friends again.` **100 numbered times**, with **eight different** random-looking typos. | Number 100 card tags and mark exactly eight as altered; keep a separate count of selected positions. |
| **P-1.35** | For group sizes `5, 10, 15, ..., 100`, estimate by repeated random experiments how often two people share a birthday. | Imagine 365 possible date stamps for cards; a collision occurs when two independent draws get the same stamp. |
| **P-1.36** | Read whitespace-separated words and report each word's frequency. | Card-label tokens `A C A` have counts `A: 2` and `C: 1`, like repeated words. |

The birthday simulation needs **365 possible dates**, not just card types A, B, and C: with only three labels, duplicates would be far too common. With 365 equally likely birthdays, the probability of a shared birthday is already slightly above one half at **23** people. The book describes it as more than half for sizes greater than 23; the project's tested sizes step by five, so `25` is the first tested size beyond that threshold.

For P-1.34, decide which eight line numbers will contain typos before printing, or track the number altered while printing. For P-1.36, split the input into words, then update a count for each one; repeated tokens must increase a stored count rather than create separate final entries.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This program combines several exercise ideas in the original card workshop. It filters unknown labels, computes areas, scans for extrema without `min` or `max`, lists factor widths in order, counts repeated labels, and selects a card by a random **position**.

```python
from math import sqrt
from random import Random

CARD_SIZES = {
    "A": (2, 3),
    "B": (4, 2),
    "C": (4, 4),
}

def card_area(label):
    width, height = CARD_SIZES[label]
    return width * height

def area_limits(values):
    if not values:
        return None
    smallest = largest = values[0]
    for value in values[1:]:
        if value < smallest:
            smallest = value
        if value > largest:
            largest = value
    return smallest, largest

def ordered_factors(n):
    small, large = [], []
    divisor = 1
    while divisor * divisor <= n:
        if n % divisor == 0:
            small.append(divisor)
            partner = n // divisor
            if partner != divisor:
                large.append(partner)
        divisor += 1
    return small + list(reversed(large))

requests = ["A", "C", "?", "A"]
accepted = [label for label in requests if label in CARD_SIZES]
areas = [card_area(label) for label in accepted]
total = sum(areas)
average = total / len(accepted) if accepted else None

label_counts = {}
for label in accepted:
    label_counts[label] = label_counts.get(label, 0) + 1

rng = Random(7)
chosen = accepted[rng.randrange(len(accepted))] if accepted else None

print("Accepted:", accepted)
print("Areas:", areas)
print("Count:", len(accepted))
print("Total:", total, "cm²")
print("Average:", f"{average:.2f} cm²" if average is not None else "(none)")
print("Area limits:", area_limits(areas))
print("Factor widths:", ordered_factors(total) if total > 0 else [])
print("Label counts:", label_counts)
print("A diagonal:", round(sqrt(2**2 + 3**2), 2), "cm")
print("Seeded card draw:", chosen)
```

The fixed results are `['A', 'C', 'A']`, `[6, 16, 6]`, count `3`, total `28 cm²`, average `9.33 cm²`, area limits `(6, 16)`, factor widths `[1, 2, 4, 7, 14, 28]`, and label counts `{'A': 2, 'C': 1}`. A's diagonal is about `3.61 cm`. The seeded draw chooses one of the three accepted **positions**; both A cards remain possible choices. If all requests are unknown, the count and total are zero, the average and area limits are `None`, and the factor list is empty.

| Exercise connection | Program step |
| :--- | :--- |
| R-1.3 | `area_limits` compares values without built-in `min` or `max`. |
| R-1.12 | `randrange` chooses a valid position. |
| C-1.27 and C-1.28 | Factors are ordered; `sqrt` finds a diagonal. |
| P-1.36 | A dictionary counts repeated card labels. |

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: pair cards without forbidden arithmetic operators</strong></summary>

**Scenario.** For R-1.2, decide whether an integer count can be paired off without multiplication, modulo, or division.

```python
def even_by_pairs(k):
    remaining = abs(k)
    while remaining >= 2:
        remaining -= 2
    return remaining == 0

print(even_by_pairs(6))   # True
print(even_by_pairs(3))   # False
print(even_by_pairs(-6))  # True
```

**Check.** Repeatedly remove pairs until either zero or one remains. `abs` lets the same parity rule handle negative integers, even though a physical card count is nonnegative.

</details>

<details>
<summary><strong>Case Study 2: two odd coordinate marks make an odd product</strong></summary>

**Scenario.** C-1.14 asks for two different entries whose product is odd. Consider coordinate marks `1`, `3`, and `4`.

```python
marks = [1, 3, 4]
first, second = 0, 1

print(first != second)                    # True
print(marks[first] * marks[second])      # 3, odd
print(marks[first] * marks[2])           # 4, even
```

**Check.** The first pair uses two odd values; replacing `3` with even `4` makes the product even.

</details>

<details>
<summary><strong>Case Study 3: count a square-root factor once</strong></summary>

**Scenario.** Card C has area `16 cm²`, a perfect square. Its whole-number factor widths should be increasing.

```python
from math import isqrt

area = 16
small = [d for d in range(1, isqrt(area) + 1) if area % d == 0]
large = [area // d for d in reversed(small) if d * d != area]
print(small + large)  # [1, 2, 4, 8, 16]
```

**Check.** `4 × 4` contributes the factor `4` only once. The larger partners are placed after the smaller factors in increasing order.

</details>

<details>
<summary><strong>Case Study 4: the largest piece first may use more pieces</strong></summary>

**Scenario.** To understand P-1.31, imagine filling a 6 cm gap with pieces of lengths `1`, `3`, and `4` cm.

```python
largest_first = [4, 1, 1]
fewer_pieces = [3, 3]

print(sum(largest_first), len(largest_first))  # 6 3
print(sum(fewer_pieces), len(fewer_pieces))    # 6 2
```

**Check.** Both choices fill the same gap, but two pieces are better than three. The original project applies this reasoning to money and its chosen denominations.

</details>

<details>
<summary><strong>Case Study 5: estimate a matching date stamp</strong></summary>

**Scenario.** P-1.35 uses birthdays. Imagine giving each card one of 365 possible date stamps and asking whether a group contains a repeat.

```python
from random import Random

rng = Random(7)

def has_matching_stamp(group_size):
    seen = set()
    for _ in range(group_size):
        stamp = rng.randrange(365)
        if stamp in seen:
            return True
        seen.add(stamp)
    return False

trials = 1000
matches = sum(has_matching_stamp(23) for _ in range(trials))
print(0 <= matches <= trials)  # True
```

**Check.** Every trial starts with an empty `seen` set but continues the seeded generator's sequence. The fraction `matches / trials` estimates the chance of a collision for 23 independently drawn stamps; one experiment is only an estimate.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Exercise range | Main idea | Rectangle-card connection |
| :--- | :--- | :--- |
| R-1.1–R-1.3 | Boolean number tests and manual extrema. | Check strip divisibility and scan card areas. |
| R-1.4–R-1.7 | Square sums, odd filtering, and one-command comprehensions. | Add areas of square tiles with sides below `n`. |
| R-1.8–R-1.11 | Negative indices, exclusive `range` stops, and powers of two. | Locate cards and generate measurement marks. |
| R-1.12 | Choose a sequence element by a random valid position. | Draw from the three physical cards A, C, A. |
| C-1.13–C-1.15 | Reverse lists and check odd pairs or distinctness. | Reverse measurements and inspect repeated A areas. |
| C-1.16–C-1.17 | Distinguish list-slot updates from loop-name rebinding. | Double card sides by assigning into the list. |
| C-1.18–C-1.19 | Build numeric and character patterns. | Generate consecutive-side rectangle areas and labels. |
| C-1.20–C-1.23 | Shuffle, reverse input, multiply corresponding entries, and catch invalid indices. | Mix cards, reverse notes, pair widths with heights. |
| C-1.24–C-1.26 | Process text and test arithmetic relationships. | Clean display notes and check `2 × 3 = 6`. |
| C-1.27–C-1.28 | Order factor pairs and calculate vector norms. | List widths for 28 cm² and find a 3–4–5 diagonal. |
| P-1.29–P-1.33 | Build arrangement, halving, change, and calculator programs. | Arrange cards, halve a strip, and calculate areas. |
| P-1.34–P-1.36 | Control output and count random or repeated events. | Number tags, simulate date stamps, and count labels. |

[🔝 Back to Top](#top)
