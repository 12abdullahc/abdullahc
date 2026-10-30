<span id="top"></span>

# 2.6 Shallow and Deep Copying — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.6, printed pages 101–102 (the supplied PDF).  
> **Topic:** 2.6 Shallow and Deep Copying; the unnumbered subsection “Python's copy Module.”  
> **Domain Focus:** Editable drafts of the rectangle-card display: three placed cards, a 30 cm² material allowance, and a 12 cm by 4 cm row.  
> **User Prompt:** Reexplain Section 2.6 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: An Editable Card Plan](#background)
   - [1. Keep the familiar measurements](#background-cards)
   - [2. A plan is a list of references](#background-plan)
2. [Part 1: Assignment Creates an Alias](#part-1)
   - [1. Two names, one outer list](#part-1-alias)
   - [2. See the geometry change through both names](#part-1-geometry)
3. [Part 2: A Shallow Copy Makes a New Outer List](#part-2)
   - [1. Construct a second list](#part-2-list)
   - [2. Separate list edits from placement edits](#part-2-layers)
   - [3. Follow a change into the contained card](#part-2-card)
4. [Part 3: A Deep Copy Follows the References](#part-3)
   - [1. Copy the placement and rectangle objects too](#part-3-graph)
   - [2. Compare the three reference patterns](#part-3-compare)
5. [Part 4: Python's `copy` Module](#part-4)
   - [1. Choose `copy.copy` or `copy.deepcopy`](#part-4-functions)
   - [2. Understand what “one level” means for a custom object](#part-4-custom)
   - [3. Know what a deep copy promises in this example](#part-4-limits)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace the output](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: An Editable Card Plan

<span id="background-cards"></span>

### 1. Keep the familiar measurements

The earlier guides used these cards, measured in centimetres:

| Card | Width | Height | Area | Separate border length |
| :--- | ----: | -----: | ---: | ---------------------: |
| `A` | 2 cm | 3 cm | 6 cm² | 10 cm |
| `B` | 4 cm | 2 cm | 8 cm² | 12 cm |
| `C` | 4 cm | 4 cm | 16 cm² | 16 cm |

The proposed display uses **`A₁`, `C`, `A₂`**. The subscripts distinguish two **physical** cards of size `A`: they have equal dimensions but are separate objects. Their total area is **6 + 16 + 6 = 28 cm²**, within the workshop's **30 cm² allowance**. Their separate borders add to **36 cm**.

Place the cards on a **12 cm wide, 4 cm high** row with left edges at **0, 4, 8 cm**. Their horizontal spans are **[0, 2]**, **[4, 8]**, and **[8, 10] cm**. They fit, with no overlap. The area allowance and physical fitting are different checks.

<span id="background-plan"></span>

### 2. A plan is a list of references

We will model an **editable draft**, not an already finalized `CardBudget`. A Python list holds **references to objects**. Our list points to three `Placement` objects; each placement records a label, a left edge, and a reference to a `Rectangle` card:

```text
plan list → Placement("A", left 0) → Rectangle(2, 3)
          → Placement("C", left 4) → Rectangle(4, 4)
          → Placement("A", left 8) → Rectangle(2, 3)
```

Moving a placement changes its **position**. Resizing its card changes its **area and border length**. Adding a placement changes the **list**. Those are three different levels of change, which makes this a useful case for understanding copies.

The program recalculates area from the draft cards after every edit. We do not mutate cards already recorded in the earlier `CardBudget`, because its saved `_used_area` would not update automatically if a card's dimensions changed.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Assignment Creates an Alias

<span id="part-1-alias"></span>

### 1. Two names, one outer list

Section 2.6 begins with a reminder from Chapter 1: assignment **binds a name** to an object; it does not copy that object. The book's `palette = warmtones` makes two names for one list of colors. For our card draft:

```python
original = make_plan()  # defined in the complete program below
alias = original

alias is original  # True
```

`is` asks whether two expressions identify the **same object**. The two names above point to one list, so any edit to that list is visible through either name. Equal card measurements are a different issue: `A₁` and `A₂` both measure 2 × 3 cm but are distinct objects.

<span id="part-1-geometry"></span>

### 2. See the geometry change through both names

Suppose the draft adds a new **1 × 1 cm marker card `D`** at x = 10 cm. It ends at x = 11 cm, fits in the 12 cm row, and adds 1 cm² of material:

```python
alias.append(Placement("D", Rectangle(1, 1), 10))
```

Because `alias` and `original` are **one list**, both names now show four placements and an area of **28 + 1 = 29 cm²**. Their separate borders total **36 + 4 = 40 cm**. No second list was created; the two names cannot maintain independent membership.

> **Mental model:** Assignment changes the name you use to reach an object. It does not duplicate the list or any card.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: A Shallow Copy Makes a New Outer List

<span id="part-2-list"></span>

### 1. Construct a second list

The book next uses `list(warmtones)` to make a **shallow copy** of a list. Start with a fresh three-card plan so the alias experiment does not affect this one:

```python
original = make_plan()
shallow = list(original)

shallow is original        # False: two lists
shallow[0] is original[0]  # True: one first Placement
```

The **outer list** is new, but its entries are references to the **same Placement objects** that the original list contains. Each shared placement, in turn, references the same card. The book's Figure 2.10 makes this exact distinction for two lists of mutable colors.

<span id="part-2-layers"></span>

### 2. Separate list edits from placement edits

Appending `D` to `shallow` changes only that list:

```python
shallow.append(Placement("D", Rectangle(1, 1), 10))
```

The `original` list still has **three** placements and **28 cm²** of card area. `shallow` has **four** placements and **29 cm²**. Removing or rearranging entries in one list would likewise leave the other list's membership unchanged.

Now move the first placement in the shallow draft from x = 0 to x = 1 cm:

```python
shallow[0].left_cm = 1
```

This edits the **shared Placement object**, so both `original[0]` and `shallow[0]` now describe the first `A` at **[1, 3] cm**. It still fits before `C` at [4, 8] cm. The lists are separate, but the element is shared. This is the book's warning about editing a color object through one shallow-copied list.

<span id="part-2-card"></span>

### 3. Follow a change into the contained card

There is another reference inside the placement: its `Rectangle` card. If we resize the first shallow-draft card from **2 × 3** to **3 × 3 cm**, that same card is visible through the original draft:

```python
shallow[0].card.resize(3, 3)
```

The first `A` now has **9 cm²** area and **12 cm** border instead of 6 cm² and 10 cm. The original draft's area becomes **9 + 16 + 6 = 31 cm²**; the shallow draft, which also contains `D`, becomes **32 cm²**. Their separate-border totals become **38 cm** and **42 cm**. The resized first card spans **[1, 4] cm**, meeting `C` at x = 4 without overlap. Both drafts fit the row physically but exceed the 30 cm² material allowance and would need revision before cutting.

This is why a shallow copy is suitable for trying a different **list of placements** only when you do not intend to edit the shared placements or cards themselves.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: A Deep Copy Follows the References

<span id="part-3-graph"></span>

### 1. Copy the placement and rectangle objects too

The book's Figure 2.11 shows a new list containing new color objects. For our three-card draft, Python's `copy.deepcopy()` follows the references through each placement to its card:

```python
import copy

original = make_plan()
deep = copy.deepcopy(original)

deep is original                     # False: different lists
deep[0] is original[0]               # False: different Placements
deep[0].card is original[0].card     # False: different Rectangles
```

In **this simple graph**, the deep draft has its own list, placements, and rectangles. If we move or resize its first card, the original draft keeps its original position and measurements. Conversely, the shallow-draft edits in Part 2 leave this deep copy as it was when copied: its first card remains at **[0, 2] cm**, with area **6 cm²**, and its three-card total remains **28 cm²**.

<span id="part-3-compare"></span>

### 2. Compare the three reference patterns

| Operation on a fresh plan | Same outer list? | Same first placement? | Same first rectangle? | Appending `D` affects original? | Moving or resizing first card affects original? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `alias = original` | Yes | Yes | Yes | Yes | Yes |
| `shallow = list(original)` | No | Yes | Yes | No | Yes |
| `deep = copy.deepcopy(original)` | No | No | No | No | No |

The table describes the classes in this guide. A deep copy is **not** a promise that every number, string, function, or shared resource in an arbitrary program receives a new identity. It means the copy operation recursively handles the referenced objects according to their copy behavior. We will return to that limit in Part 4.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Python's `copy` Module

<span id="part-4-functions"></span>

### 1. Choose `copy.copy` or `copy.deepcopy`

At the end of Section 2.6, the book introduces Python's `copy` module. Its two functions express the distinction directly:

```python
import copy

shallow = copy.copy(original)       # new outer list; shared placements
deep = copy.deepcopy(original)     # new list, placements, and cards here
```

For a **plain list**, `copy.copy(original)` has the same shallow structure as `list(original)`: a new list holding the old element references. `copy.deepcopy(original)` recursively copies the contained mutable objects in our plan. The [Python `copy` documentation](https://docs.python.org/3/library/copy.html) defines both operations and explains the reference distinction.

<span id="part-4-custom"></span>

### 2. Understand what “one level” means for a custom object

A shallow copy only constructs a new **outer object**. If the outer object itself contains a list, that list may still be shared:

```python
class PlanBox:
    def __init__(self, placements):
        self.placements = placements

box = PlanBox(make_plan())
box_copy = copy.copy(box)

box_copy is box                      # False: two PlanBox objects
box_copy.placements is box.placements  # True: one list
```

This differs from shallow-copying the list directly, where **the list is the outer object** and therefore receives a new list. The `DisplayRow` from Section 2.5 has an internal `_placements` list too: a generic shallow copy of the row would leave that contained list shared. Such a copy is not automatically an independent editable layout.

<span id="part-4-limits"></span>

### 3. Know what a deep copy promises in this example

For our plain `Placement` and `Rectangle` objects, `deepcopy` gives us independent mutable objects. In a larger object graph, the module tracks objects already copied during one operation so it can handle shared references and recursive structures. For example:

```python
one_card = Rectangle(2, 3)
two_references = [one_card, one_card]
copied = copy.deepcopy(two_references)

copied[0] is copied[1]  # True: sharing within the copied list is preserved
copied[0] is one_card   # False: the copied card is separate from the original
```

`two_references` is **two references to one card object**, not two physical `A` cards. Our real three-card plan constructs two distinct `A` rectangles. Custom classes can define their own `__copy__()` or `__deepcopy__()` behavior, and a deep copy can duplicate data that a program intended to share. Choose a copy depth that matches which edits must be independent; a copy also does not check whether a draft still meets the 30 cm² allowance or fits the row.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. The complete program

Save this as `copying_geometry.py` and run it with `python copying_geometry.py`. The alias experiment starts from one fresh draft. The shallow and deep copies are then made from a second fresh draft, so the earlier append does not affect their comparison.

```python
import copy


class Rectangle:
    """An editable card with dimensions measured in centimetres."""

    def __init__(self, width, height):
        self.resize(width, height)

    def resize(self, width, height):
        if width <= 0 or height <= 0:
            raise ValueError("width and height must be positive")
        self._width = width
        self._height = height

    def width(self):
        return self._width

    def height(self):
        return self._height

    def area(self):
        return self._width * self._height

    def perimeter(self):
        return 2 * (self._width + self._height)


class Placement:
    """A card placed along the bottom of a display row."""

    def __init__(self, label, card, left_cm):
        self.label = label
        self.card = card
        self.left_cm = left_cm

    def span(self):
        return (self.left_cm, self.left_cm + self.card.width())


def make_plan():
    """Return A, C, and a distinct second A on a 12 by 4 cm row."""
    return [
        Placement("A", Rectangle(2, 3), 0),
        Placement("C", Rectangle(4, 4), 4),
        Placement("A", Rectangle(2, 3), 8),
    ]


def marker_d():
    return Placement("D", Rectangle(1, 1), 10)


def total_area(plan):
    return sum(placed.card.area() for placed in plan)


def total_border(plan):
    return sum(placed.card.perimeter() for placed in plan)


def main():
    aliased_original = make_plan()
    alias = aliased_original
    alias.append(marker_d())
    print("Alias is original list:", alias is aliased_original)
    print("Alias append: original count/area:", len(aliased_original), total_area(aliased_original))

    original = make_plan()
    shallow = list(original)
    module_shallow = copy.copy(original)
    deep = copy.deepcopy(original)

    print("Two A cards are one object:", original[0].card is original[2].card)
    print("Shallow is original list:", shallow is original)
    print("Shallow first placement shared:", shallow[0] is original[0])
    print("copy.copy first placement shared:", module_shallow[0] is original[0])
    print("Deep is original list:", deep is original)
    print("Deep first placement shared:", deep[0] is original[0])
    print("Deep first card shared:", deep[0].card is original[0].card)

    shallow.append(marker_d())
    print("After shallow append, counts:", len(original), len(shallow), len(deep))
    print("After shallow append, areas:", total_area(original), total_area(shallow), total_area(deep))

    shallow[0].left_cm = 1
    print("After moving A, original/deep spans:", original[0].span(), deep[0].span())

    shallow[0].card.resize(3, 3)
    print("After resizing A, areas:", total_area(original), total_area(shallow), total_area(deep))
    print("After resizing A, borders:", total_border(original), total_border(shallow), total_border(deep))
    print("Within 30 cm^2:", *(total_area(plan) <= 30 for plan in (original, shallow, deep)))
    print("Final shallow spans:", [placed.span() for placed in shallow])


if __name__ == "__main__":
    main()
```

The three area values in the final comparison are recalculated from the current cards. They do not come from a `CardBudget` cache. `module_shallow` is included to show that `copy.copy(list)` shares elements just as `list(original)` does; it is not otherwise edited.

<span id="part-5-trace"></span>

### 2. Trace the output

| Moment | Original draft | Shallow draft | Deep draft |
| :--- | :--- | :--- | :--- |
| Freshly copied | `A₁`, `C`, `A₂`: 28 cm² | Same three placements: 28 cm² | Three independent placements: 28 cm² |
| Append `D` through `shallow` | Three placements: 28 cm² | Four placements: 29 cm² | Three placements: 28 cm² |
| Move first `A` to x = 1 | First span [1, 3] cm | First span [1, 3] cm | First span [0, 2] cm |
| Resize first `A` to 3 × 3 | 31 cm²; borders 38 cm | 32 cm²; borders 42 cm | 28 cm²; borders 36 cm |

The separate **alias** run begins with its own 28 cm² plan. Appending `D` through the alias changes that original list to **29 cm²**. In the shallow/deep run, the first card's final width is 3 cm and its left edge is 1 cm, so its span is **[1, 4] cm**. `C` starts at 4 cm, the second `A` at 8 cm, and `D` at 10 cm. The shallow layout remains physically valid even though its 32 cm² area exceeds the material allowance.

Running the program prints:

```text
Alias is original list: True
Alias append: original count/area: 4 29
Two A cards are one object: False
Shallow is original list: False
Shallow first placement shared: True
copy.copy first placement shared: True
Deep is original list: False
Deep first placement shared: False
Deep first card shared: False
After shallow append, counts: 3 4 3
After shallow append, areas: 28 29 28
After moving A, original/deep spans: (1, 3) (0, 2)
After resizing A, areas: 31 32 28
After resizing A, borders: 38 42 36
Within 30 cm^2: False False True
Final shallow spans: [(1, 4), (4, 8), (8, 10), (10, 11)]
```

The `False` for “Two A cards are one object” is intentional: choosing size `A` twice means two physical cards. The `True` for shallow placement sharing tells a different story: two draft lists can point to the **same** placement object.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does `alias = original` make a second card plan?</strong></summary>

**Scenario:** A three-card draft holds `A₁`, `C`, `A₂`, totaling 28 cm². A new name `alias` is assigned to that list.

**Problem:** Adding a 1 × 1 cm marker `D` through `alias` unexpectedly appears in `original` too.

**Fix:** Recognize that `alias is original` is `True`: both names identify the same list. Make a list copy when independent membership is needed.

**Result:** The single shared list contains four placements and totals 29 cm² after the append.

</details>

<details>
<summary><strong>Case Study 2: Can a shallow draft try another card without adding it to the original?</strong></summary>

**Scenario:** `shallow = list(original)` begins with the same three placements, then appends `D` at x = 10 cm.

**Problem:** We want a fourth placement in the trial draft while the original remains a three-card plan.

**Fix:** The `list` constructor makes a new outer list. Append changes that list's membership only.

**Result:** Original area stays 28 cm²; shallow area becomes 29 cm². The new 1 × 1 cm card fits in the 12 × 4 cm row.

</details>

<details>
<summary><strong>Case Study 3: Why did moving a card in the shallow draft move it in the original?</strong></summary>

**Scenario:** The shallow draft sets its first placement's `left_cm` from 0 to 1.

**Problem:** The original draft's first `A` also moves from [0, 2] to [1, 3] cm.

**Fix:** Distinguish the new list from the still-shared placement object: `shallow[0] is original[0]` is `True`.

**Result:** Both lists show the same moved card. A deep copy is needed when placement edits should be independent.

</details>

<details>
<summary><strong>Case Study 4: Why did a size change break the original material limit?</strong></summary>

**Scenario:** Through the shallow draft, resize the first `A` from 2 × 3 to 3 × 3 cm.

**Problem:** The original was within 30 cm² before the edit, but its area now rises from 28 to 31 cm².

**Fix:** The placement's `card` reference also leads to a shared rectangle. Recalculate the draft's area and recheck the allowance after dimensions change; use a deep copy to isolate exploratory size edits.

**Result:** The original and shallow drafts have areas 31 and 32 cm², while the pre-edit deep draft stays at 28 cm².

</details>

<details>
<summary><strong>Case Study 5: Is `copy.copy` always enough for an independent row?</strong></summary>

**Scenario:** A `PlanBox` object holds a list of placements, and `copy.copy(box)` makes another `PlanBox`.

**Problem:** Appending to `box_copy.placements` would also change `box.placements` because both boxes still reference one list.

**Fix:** Check the first contained level: `box_copy.placements is box.placements` is `True`. Copy that list too, or use a suitable deep copy, depending on which nested edits must be isolated.

**Result:** “Shallow” means a new **outer object**. The outer object is the list in `copy.copy(original)` but the `PlanBox` in `copy.copy(box)`.

</details>

<details>
<summary><strong>Case Study 6: Are two references to one `A` two physical cards?</strong></summary>

**Scenario:** A list contains the same `Rectangle(2, 3)` object twice.

**Problem:** Treating those two references as two independent physical `A` cards would make a later resize affect both list positions at once.

**Fix:** Construct two separate rectangles for `A₁` and `A₂`. Deep copying a list with a repeated reference preserves that internal sharing in the copied graph; it does not reinterpret one object as two physical cards.

**Result:** The main plan has two distinct `A` objects, so changing one does not change the other.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 2.6 idea | Plain-language meaning | Geometry study case |
| :--- | :--- | :--- |
| **Assignment alias** | Two names reach one object; no copy occurs. | Appending `D` through `alias` changes `original`. |
| **Shallow list copy** | Make a new list but keep references to the same elements. | A trial list can add `D`; moving shared `A₁` still affects the original. |
| **Indirect aliasing** | A new outer container can still lead to a shared nested object. | `shallow[0].card` and `original[0].card` reach the same rectangle. |
| **Deep copy** | Recursively copy the contained objects according to their copy behavior. | The deep draft keeps its own first placement and rectangle. |
| **`copy.copy`** | Request a generic shallow copy of the outer object. | Copying a list gives a new list; copying `PlanBox` leaves its list shared. |
| **`copy.deepcopy`** | Request a recursive copy, with memoization of objects already visited. | A copied plan has independent placements while repeated references remain repeated. |
| **Identity with `is`** | Test whether two expressions refer to the same object. | Two equal-sized `A` cards are distinct; a shallow draft shares one placement. |
| **Recheck geometry after edits** | Copying does not enforce area or layout constraints. | A resized draft can fit the row yet exceed 30 cm² of material. |

[🔝 Back to Top](#top)
