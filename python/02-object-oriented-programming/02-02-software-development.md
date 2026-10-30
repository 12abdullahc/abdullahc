<span id="top"></span>

# 2.2 Software Development — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.2, printed pages 62–68 (the supplied PDF).  
> **Topic:** 2.2 Software Development; 2.2.1 Design; 2.2.2 Pseudo-Code; 2.2.3 Coding Style and Documentation; 2.2.4 Testing and Debugging.  
> **Domain Focus:** The rectangle cards from earlier guides: plan, implement, test, and debug an area-and-border report.  
> **User Prompt:** Reexplain Section 2.2 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Card-Report Project](#background)
   - [1. The familiar geometry](#background-cards)
   - [2. What the new program must do](#background-task)
2. [Part 1: 2.2 Software Development](#part-1)
   - [1. Three development phases](#part-1-phases)
3. [Part 2: 2.2.1 Design](#part-2)
   - [1. Give each actor a responsibility](#part-2-responsibilities)
   - [2. Plan with CRC cards](#part-2-crc)
   - [3. Sketch a UML class diagram](#part-2-uml)
4. [Part 3: 2.2.2 Pseudo-Code](#part-3)
   - [1. Describe the report before writing Python](#part-3-algorithm)
   - [2. Read the book's pseudocode conventions](#part-3-notation)
5. [Part 4: 2.2.3 Coding Style and Documentation](#part-4)
   - [1. Make the code readable](#part-4-style)
   - [2. Use comments and docstrings for different jobs](#part-4-documentation)
6. [Part 5: 2.2.4 Testing and Debugging](#part-5)
   - [1. Test representative and special cases](#part-5-testing)
   - [2. Choose a testing order](#part-5-order)
   - [3. Automate tests and rerun them after changes](#part-5-automation)
   - [4. Debug a failed run](#part-5-debugging)
7. [Part 6: One Connected Geometry Program](#part-6)
   - [1. The complete card-report program](#part-6-program)
   - [2. Trace the sample selection](#part-6-trace)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Card-Report Project

<span id="background-cards"></span>

### 1. The familiar geometry

Our earlier study guides used three rectangular card sizes. A classroom selects cards for a display and may put tape around **each separate card**.

| Card | Width | Height | Area = width × height | Perimeter = 2 × (width + height) |
| :--- | ----: | -----: | --------------------: | -------------------------------: |
| `A`  |  2 cm |   3 cm |                 6 cm² |                            10 cm |
| `B`  |  4 cm |   2 cm |                 8 cm² |                            12 cm |
| `C`  |  4 cm |   4 cm |                16 cm² |                            16 cm |

For the selection `A`, `C`, `A`, the total area is **6 + 16 + 6 = 28 cm²**. The tape needed for three separate borders is **10 + 16 + 10 = 36 cm**. The second `A` is another physical card, so it must be counted again.

<span id="background-task"></span>

### 2. What the new program must do

Section 2.1 introduced a `Rectangle` object that checks its dimensions and answers `area()` and `perimeter()`. Now imagine building a small **card-report program** around it. The program should:

1. Recognize the labels `A`, `B`, and `C`; reject an unknown label.
2. Create a separate rectangle object for every chosen label.
3. Report the number of cards, total area, and total border length.
4. Give sensible results for an empty selection and reject nonpositive dimensions.

These requirements give us one connected example for **design → pseudocode → implementation → testing → debugging**. We will keep the arithmetic simple so the development decisions are easy to see.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 2.2 Software Development

<span id="part-1-phases"></span>

### 1. Three development phases

The section opens with three major phases of traditional software development:

| Phase | Main question | Card-report work |
| :--- | :--- | :--- |
| **Design** | What parts should exist, and how should they interact? | Decide what `Rectangle`, `CardCatalog`, and `CardReport` each own. |
| **Implementation** | How do we express the design in code? | Write the classes, methods, and report script in Python. |
| **Testing and debugging** | Does the program behave as intended, and where is a failure? | Check `A`, `C`, `A`, empty input, and invalid data; inspect any wrong result. |

A design is a plan, implementation turns that plan into a program, and testing checks the running program against expected behavior. If a test exposes a wrong assumption, we revise the code or the plan and check again.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 2.2.1 Design

<span id="part-2-responsibilities"></span>

### 1. Give each actor a responsibility

Object-oriented design decides which classes to define, how they interact, which data each stores, and which actions each performs. The book gives three rules of thumb:

| Rule | Plain-language meaning | Card-report decision |
| :--- | :--- | :--- |
| **Responsibilities** | Name the actions the program must perform, then choose an actor for each. | A `Rectangle` *measures* itself; a `CardReport` *totals* chosen cards. |
| **Independence** | Give each class authority over its own work and the data that work needs. | `Rectangle` owns width and height because its methods use them. |
| **Behaviors** | Specify what each class's methods do so collaborators know what to expect. | `area()` returns square centimetres; `perimeter()` returns centimetres. |

An **action → actor** pass makes the plan concrete:

| Action | Actor | Data it needs |
| :--- | :--- | :--- |
| Check positive dimensions; calculate one area or perimeter | `Rectangle` | Width and height |
| Turn a known label into a new card; reject an unknown label | `CardCatalog` | The label-to-dimensions table |
| Count cards; total their areas and borders | `CardReport` | The chosen rectangle objects |
| Display the finished numbers | `main()` | A completed report |

Every required action now has an owner. The public methods are the **behaviors** through which the actors collaborate. Keeping the geometry formula inside `Rectangle` avoids making `CardReport` depend on its internal fields.

<span id="part-2-crc"></span>

### 2. Plan with CRC cards

A **CRC card** is a small planning card: **Class–Responsibility–Collaborator**. Put the proposed class name at the top, its responsibilities on the left, and the other classes it must use on the right. CRC cards are paper design aids; they are different from the physical display cards `A`, `B`, and `C`.

| Proposed class | Responsibilities | Collaborators |
| :--- | :--- | :--- |
| `Rectangle` | Validate dimensions; return area and perimeter. | None for these tasks. |
| `CardCatalog` | Look up a label; create one new rectangle. | `Rectangle` |
| `CardReport` | Count chosen cards; total area and border length. | `Rectangle` |

The book describes an **action/actor cycle**: find an action, assign it to the best actor, then repeat until all actions have owners. A small CRC card encourages a class to have a manageable number of responsibilities and collaborators.

<span id="part-2-uml"></span>

### 3. Sketch a UML class diagram

**UML** (Unified Modeling Language) provides a standard visual notation for object-oriented designs. The book's Figure 2.3 uses a `CreditCard` class to show a diagram with three compartments: **class name**, **fields**, and **methods**. Our geometry version uses the same layout:

```text
+---------------------------+
| Rectangle                 |  class name
+---------------------------+
| _width                    |  fields (stored data)
| _height                   |
+---------------------------+
| area()                    |  methods (behaviors)
| perimeter()               |
+---------------------------+
```

The diagram is a design sketch, not Python syntax. It tells a collaborator that a rectangle offers `area()` and `perimeter()` while keeping its dimensions as internal fields. The complete code appears in Part 6.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 2.2.2 Pseudo-Code

<span id="part-3-algorithm"></span>

### 1. Describe the report before writing Python

**Pseudocode** is a human-readable description of an algorithm. It is more structured than ordinary prose but is not a runnable program. It keeps the important steps while leaving out low-level language details.

```text
Algorithm make_report(labels, catalog):
    { Each label stands for one physical card. }
    cards ← empty list
    n ← length(labels)
    for j from 0 to n - 1:
        label ← labels[j]
        if label is unknown to catalog:
            indicate an error and stop
        card ← catalog.make(label)  { a new, validated rectangle }
        append card to cards

    area_total ← 0
    border_total ← 0
    for each card in cards:
        area_total ← area_total + card.area()
        border_total ← border_total + card.perimeter()
    return length(cards), area_total, border_total
```

For `A`, `C`, `A`, the loop creates **three** cards, then returns **(3, 28 cm², 36 cm)**. With no labels, both totals remain zero. The steps also say what happens to an unknown label and where dimension validation belongs; leaving either out would hide an important design decision.

<span id="part-3-notation"></span>

### 2. Read the book's pseudocode conventions

The book blends Python-like structure, mathematical notation, and English:

| In pseudocode | Meaning in the Python program |
| :--- | :--- |
| Indentation groups the loop and decision steps. | Indentation also defines Python blocks. |
| `labels[0]` through `labels[n - 1]` are the `n` entries. | Python list indexes start at zero; `labels[n]` is past the end. |
| `{ ... }` explains a step to a human reader. | Python uses `#` for a code comment. |
| `indicate an error` names a required response. | The implementation can `raise ValueError(...)`. |
| `←` means assign a new value. | Python writes `=` for assignment. |

Do not paste pseudocode into a `.py` file and expect it to run. Its job is to make the algorithm clear enough that the Python implementation can be checked against it.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 2.2.3 Coding Style and Documentation

<span id="part-4-style"></span>

### 1. Make the code readable

The book points to Python's style guide and recommends meaningful names. Python code normally uses **four spaces per indentation level** and avoids tabs. The book prints some examples with **two spaces** only to fit its page width; the program below uses four.

| Kind of name | Convention described by the book | Geometry example |
| :--- | :--- | :--- |
| Class | Singular noun in `CamelCase`. | `Rectangle`, `CardCatalog`, `CardReport` |
| Function or method | Lowercase words joined by underscores; usually an action verb. A value-returning method may name the value. | `make()`, `total_area()`, `area()` |
| Object, parameter, or field | Lowercase noun. | `width`, `label`, `cards` |
| Intended constant | Capitals with underscores. | `CARD_SIZES` |
| Internal name | A single leading underscore signals nonpublic use by convention. | `_width`, `_cards` |

Names should tell a reader what a value or action means. For example, `total_border` makes clear that we add the perimeters of separate cards; it does not claim to find the perimeter of one combined shape. Uppercase naming signals an intended constant but does not make a Python dictionary immutable.

<span id="part-4-documentation"></span>

### 2. Use comments and docstrings for different jobs

A `#` **comment** explains a local decision, especially one the code alone does not make obvious. In our program, `# Make a new object even when a label repeats.` explains why two `A` entries are both processed.

A **docstring** formally describes a module, class, function, or method. It is a string literal placed **first in that body**, usually within triple quotes. A short docstring can use one summary line; a longer one begins with a summary, a blank line, then details. The book illustrates both forms with a `scale(data, factor)` function.

```python
def total_area(self):
    """Return the area of all selected cards in square centimetres."""
    return sum(card.area() for card in self._cards)
```

Here the first string is the method's docstring. Python stores it so tools such as `help(...)` and `pydoc` can display it. The book also describes standalone triple-quoted strings as multiline block comments. Technically, a triple-quoted string elsewhere is a string literal; it becomes a retrievable docstring only in the first-statement position. The complete program below includes docstrings for its main pieces.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 2.2.4 Testing and Debugging

<span id="part-5-testing"></span>

### 1. Test representative and special cases

**Testing** runs a program to check whether it behaves correctly. Checking every possible input is usually impractical, so choose representative values and cases likely to expose errors. The book uses a sorting routine to illustrate empty, single-item, all-equal, already-sorted, and reverse-sorted inputs. For our card report, useful cases are:

| Input or action | Expected result | What it checks |
| :--- | :--- | :--- |
| `Rectangle(2, 3)` | Area 6 cm²; perimeter 10 cm. | Basic rectangle methods. |
| No chosen labels | 0 cards; 0 cm²; 0 cm. | Empty collection. |
| `A` | 1 card; 6 cm²; 10 cm. | Single card. |
| `A`, `A` | 2 cards; 12 cm²; 20 cm. | Repeated label means two cards. |
| `A`, `C`, `B` | 3 cards; 30 cm²; 38 cm. | Distinct first and last entries are included. |
| `Rectangle(0, 3)` or `Rectangle(-2, 3)` | `ValueError`. | Invalid dimensions. |
| Unknown label `X` | `ValueError`. | Invalid catalog lookup. |

The book also calls out inserting or removing items at the **beginning or end of a list** as structural boundary cases. In our report, `A`, `C`, `B` helps expose a related mistake if the first or last chosen label is skipped.

At a minimum, test every method at least once (**method coverage**). Better, run every statement at least once (**statement coverage**). Neither measure proves the answers are right: a wrong `+` in an area formula could execute perfectly and still return the wrong number. Tests need stated expected results, not just successful execution.

Handcrafted cases like these are essential. Python's `random` module can generate positive dimensions or shuffle label orders to supplement them, but random testing does not replace carefully chosen boundary and invalid cases.

<span id="part-5-order"></span>

### 2. Choose a testing order

Classes and functions form a dependency hierarchy. Our `CardCatalog` creates `Rectangle` objects; `CardReport` asks rectangles for measurements; `main()` uses all three classes.

| Strategy | Order | Card-report example |
| :--- | :--- | :--- |
| **Top-down** | Test the high-level behavior first; temporarily replace unfinished lower-level pieces with **stubs**. | Give `CardReport` a stub card whose `area()` returns 6 and `perimeter()` returns 10. |
| **Bottom-up** | Test low-level pieces first, then the code that uses them. | Check `Rectangle`, then `CardCatalog` and `CardReport`, then `main()`. |

A **stub** supplies a predictable stand-in result. It lets us check report totals before the real rectangle code is complete. Testing one component in isolation is **unit testing**; bottom-up testing commonly uses it because failures in already-tested lower-level pieces are less likely to obscure the cause.

<span id="part-5-automation"></span>

### 3. Automate tests and rerun them after changes

Python code under `if __name__ == "__main__":` runs when a file is executed directly, but not when another file imports it. The complete example uses this guard for its demonstration. A module can instead put direct self-checks there.

Python's `unittest` module can group test cases into suites and report their results. After saving the complete program below as `rectangle_cards.py`, save this small companion as `test_rectangle_cards.py`:

```python
import unittest

from rectangle_cards import CardCatalog, CardReport, Rectangle


class CardTests(unittest.TestCase):
    def test_rectangle_measurements(self):
        card = Rectangle(2, 3)
        self.assertEqual(card.area(), 6)
        self.assertEqual(card.perimeter(), 10)

    def test_empty_report(self):
        report = CardReport([])
        self.assertEqual(report.count(), 0)
        self.assertEqual(report.total_area(), 0)
        self.assertEqual(report.total_border(), 0)

    def test_duplicate_label(self):
        catalog = CardCatalog({"A": (2, 3)})
        first = catalog.make("A")
        second = catalog.make("A")
        self.assertIsNot(first, second)
        report = CardReport([first, second])
        self.assertEqual(report.count(), 2)
        self.assertEqual(report.total_area(), 12)
        self.assertEqual(report.total_border(), 20)

    def test_mixed_selection(self):
        catalog = CardCatalog({"A": (2, 3), "C": (4, 4)})
        report = CardReport([
            catalog.make("A"), catalog.make("C"), catalog.make("A")
        ])
        self.assertEqual(report.count(), 3)
        self.assertEqual(report.total_area(), 28)
        self.assertEqual(report.total_border(), 36)

    def test_invalid_width(self):
        with self.assertRaises(ValueError):
            Rectangle(-2, 3)

    def test_unknown_label(self):
        catalog = CardCatalog({"A": (2, 3)})
        with self.assertRaises(ValueError):
            catalog.make("X")


if __name__ == "__main__":
    unittest.main()
```

Run it with `python test_rectangle_cards.py`. After adding a feature or fixing a bug, rerun earlier tests. That repeated check is **regression testing**: it looks for new changes that broke behavior that previously worked.

<span id="part-5-debugging"></span>

### 4. Debug a failed run

**Debugging** traces a program to locate the cause of a failure. Suppose a test expects **28 cm²** for `A`, `C`, `A`, but the program reports **22 cm²**. Testing tells us the result is wrong; debugging asks which step lost the second `A`.

Temporary `print(...)` calls can show the chosen labels, each created card, and the running area. The book notes that these traces later need to be removed or disabled. A **debugger** can pause at a **breakpoint** after each loop iteration so we can inspect `label` and `chosen_cards` directly. Python includes `pdb`, and IDEs such as IDLE provide visual debugger tools.

If the list has only two objects after three labels, inspect the creation loop. If it has three, inspect the three `area()` results and the total. This narrows the search to the first step where observed values differ from the plan.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: One Connected Geometry Program

<span id="part-6-program"></span>

### 1. The complete card-report program

This implementation follows the responsibility plan and pseudocode above. Save it as `rectangle_cards.py`:

```python
"""Measure rectangular cards for a classroom display."""


class Rectangle:
    """Represent a rectangle with positive dimensions in centimetres."""

    def __init__(self, width, height):
        if width <= 0 or height <= 0:
            raise ValueError("width and height must be positive")
        self._width = width
        self._height = height

    def area(self):
        """Return the area in square centimetres."""
        return self._width * self._height

    def perimeter(self):
        """Return the border length in centimetres."""
        return 2 * (self._width + self._height)


class CardCatalog:
    """Create a separate rectangle for each known card label."""

    def __init__(self, sizes):
        self._sizes = sizes

    def make(self, label):
        """Return a new card for label, or report an unknown label."""
        if label not in self._sizes:
            raise ValueError("unknown card label: {}".format(label))
        width, height = self._sizes[label]
        return Rectangle(width, height)


class CardReport:
    """Summarize a selection of separate rectangle cards."""

    def __init__(self, cards):
        self._cards = cards

    def count(self):
        """Return the number of selected cards."""
        return len(self._cards)

    def total_area(self):
        """Return the combined area in square centimetres."""
        return sum(card.area() for card in self._cards)

    def total_border(self):
        """Return the sum of the cards' separate perimeters in centimetres."""
        return sum(card.perimeter() for card in self._cards)


CARD_SIZES = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}


def main():
    """Print a report for three selected physical cards."""
    catalog = CardCatalog(CARD_SIZES)
    chosen_labels = ["A", "C", "A"]
    chosen_cards = []

    # Make a new object even when a label repeats.
    for label in chosen_labels:
        chosen_cards.append(catalog.make(label))

    report = CardReport(chosen_cards)
    print("Cards:", report.count())
    print("Total area:", report.total_area(), "cm^2")
    print("Border for separate cards:", report.total_border(), "cm")


if __name__ == "__main__":
    main()
```

`Rectangle` owns geometry, `CardCatalog` owns label lookup, and `CardReport` owns the totals. The `main()` function connects them and prints the result. Importing this module for the `unittest` example does not run `main()` because of the `__main__` guard.

<span id="part-6-trace"></span>

### 2. Trace the sample selection

| Label visited | Object created | Running count | Running area | Running separate-border total |
| :--- | :--- | ---: | ---: | ---: |
| `A` | New 2 × 3 cm rectangle | 1 | 6 cm² | 10 cm |
| `C` | New 4 × 4 cm rectangle | 2 | 22 cm² | 26 cm |
| `A` | Another new 2 × 3 cm rectangle | 3 | 28 cm² | 36 cm |

The report methods calculate their totals after all three objects are created. The running totals in the table are a **manual trace** of those same additions, not variables stored by the program. Running the script prints:

```text
Cards: 3
Total area: 28 cm^2
Border for separate cards: 36 cm
```

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Who should calculate one card's area?</strong></summary>

**Scenario:** Both the display report and a cutting plan need to know an individual card's measurements.

**Problem:** If each report reads `_width` and `_height` and repeats the formula, the geometry rule is spread across components.

**Fix:** Assign the area and perimeter actions to `Rectangle` on the CRC plan. Give `CardReport` the responsibility to add results from the cards' public methods.

**Result:** One class owns the dimensions and their formulas; the report collaborates through a clear interface.

</details>

<details>
<summary><strong>Case Study 2: Why does the pseudocode stop at `n - 1`?</strong></summary>

**Scenario:** `labels` contains `A`, `C`, `A`, so `n = 3`.

**Problem:** The valid positions are `labels[0]`, `labels[1]`, and `labels[2]`. Trying `labels[3]` goes past the end and raises `IndexError` in Python.

**Fix:** Iterate from `0` through `n - 1`. For three labels, that means indexes `0`, `1`, and `2`; each physical card is created once.

</details>

<details>
<summary><strong>Case Study 3: Why test an empty selection?</strong></summary>

**Scenario:** The classroom chooses no cards.

**Problem:** Testing only the usual `A`, `C`, `A` selection would not show how the report behaves with no objects.

**Fix:** Check `CardReport([])`. It should report **0 cards, 0 cm² of area, and 0 cm of border**. Keep this test when the program gains new features so later changes cannot silently break the empty case.

</details>

<details>
<summary><strong>Case Study 4: A test gets 22 cm² instead of 28 cm²</strong></summary>

**Scenario:** A faulty version of the program processes `A`, `C`, `A` but reports **22 cm²**.

**Problem:** That is the sum of only the first `A` and `C`, suggesting the second `A` was skipped. The wrong total alone does not prove where the bug lies.

**Fix:** Pause after the creation loop and inspect `chosen_labels` and `chosen_cards`. If there are three labels but only two objects, trace the loop to find the skipped iteration. If there are three objects, inspect their individual `area()` results and `CardReport.total_area()`.

**Result:** Once the cause is fixed, rerun the original `A`, `C`, `A` test and the other earlier cases. That is debugging followed by regression testing.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 2.2 idea | Plain-language meaning | Rectangle-card example |
| :--- | :--- | :--- |
| **Design** | Assign data and actions to classes before coding. | `Rectangle` measures; `CardReport` totals. |
| **CRC card** | List a proposed class, its duties, and its collaborators. | `CardCatalog` creates a `Rectangle`. |
| **UML class diagram** | Sketch class name, fields, and methods. | `Rectangle` has `_width`, `_height`, `area()`, and `perimeter()`. |
| **Pseudocode** | Describe key algorithm steps for a human reader. | Visit every label, create a card, then sum its measurements. |
| **Coding style** | Use consistent layout and meaningful names. | Four-space indentation and `total_border()` make intent clear. |
| **Docstring** | Give a module, class, or function retrievable documentation. | `area()` states that its result is in square centimetres. |
| **Testing** | Run chosen inputs and compare with expected results. | `A`, `C`, `A` should yield 28 cm² and 36 cm. |
| **Unit and regression testing** | Check components individually and rerun old checks after changes. | Test `Rectangle` alone, then rerun the card suite after an edit. |
| **Debugging** | Trace execution to locate a cause after a failure is found. | Pause the loop if the second `A` is missing. |

[🔝 Back to Top](#top)
