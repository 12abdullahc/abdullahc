<span id="top"></span>

# Object-Oriented Programming — Section 2.2: Software Development

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.2, printed pages 62–68 of the supplied PDF.  
> **Topic:** Section 2.2; 2.2.1 Design; 2.2.2 Pseudo-Code; 2.2.3 Coding Style and Documentation; 2.2.4 Testing and Debugging.  
> **Domain focus:** The **MotoGP Practice session at the 2026 Indonesian Grand Prix**, Friday 9 October, at Mandalika.  
> **Learning goal:** Work from a small report's requirements through class design, pseudocode, readable Python, tests, and debugging.  
> **User Prompt:** "Reexplain [Section 2.2] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Friday Practice Report](#background-intuition)
   - [1. Use one verified session](#background-data)
   - [2. State the report's requirements](#background-task)
2. [Part 1: Section 2.2 — Three Development Phases](#part-1)
3. [Part 2: Section 2.2.1 — Design](#part-2)
   - [1. Assign actions to actors](#part-2-responsibilities)
   - [2. Plan with CRC cards](#part-2-crc)
   - [3. Sketch a UML class diagram](#part-2-uml)
4. [Part 3: Section 2.2.2 — Pseudo-Code](#part-3)
   - [1. Write the steps before Python syntax](#part-3-algorithm)
   - [2. Read the notation and trace two riders](#part-3-notation)
5. [Part 4: Section 2.2.3 — Coding Style and Documentation](#part-4)
   - [1. Make names and layout communicate intent](#part-4-style)
   - [2. Distinguish comments from docstrings](#part-4-documentation)
6. [Part 5: Section 2.2.4 — Testing and Debugging](#part-5)
   - [1. Choose cases that can reveal mistakes](#part-5-cases)
   - [2. Test from the top or from the bottom](#part-5-order)
   - [3. Automate checks and rerun them](#part-5-automation)
   - [4. Trace a failed report](#part-5-debugging)
7. [Part 6: Complete Program and Test Suite](#part-6)
   - [1. Run the Practice report](#part-6-program)
   - [2. Check the output by hand](#part-6-trace)
   - [3. Run a focused `unittest` suite](#part-6-tests)
8. [Part 7: Summary](#part-7)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Friday Practice Report

<span id="background-data"></span>

### 1. Use one verified session

The examples use the **MotoGP Practice** classification from Friday 9 October 2026 at the Indonesian Grand Prix. The [Yamaha Factory Racing full results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give the rider, team, position, and best lap below; the [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) confirms Raúl Fernández led this session.

| Official Practice place | Rider | Team | Best lap | Milliseconds |
| :---: | :--- | :--- | ---: | ---: |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | 88,725 |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | 89,426 |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP | 1:29.558 | 89,558 |

For example, `1:29.426` means `60 + 29.426 = 89.426` seconds, or `89,426` milliseconds. Marc's best lap took `89,426 − 88,725 = 701` milliseconds more than Raúl's, so his **best-lap difference** from Raúl was `+0.701 s`. Fabio's was `+0.833 s`; Fabio's lap took `+0.132 s` more than Marc's. These are calculated from fastest laps in this Practice session, not race finishing gaps.

**Why this example?** The official classification supplies real, checkable inputs while integer milliseconds keep subtraction exact. **How to solve a difference:** convert both laps to the same unit, subtract the reference lap from the rider's lap, divide milliseconds by `1000`, and label the session and result.

<span id="background-task"></span>

### 2. State the report's requirements

Imagine a small **selected-rider Practice report**. Raúl's P1 lap is its reference. The user selects Marc and Fabio. The report should:

1. Keep each result's rider, team, session, and best lap together.
2. Print the selected riders in the supplied order, with seconds and differences from Raúl.
3. Reject a nonpositive lap time or a comparison across different sessions.
4. Say `No riders selected.` when the selected list is empty.

The positions P1, P5, and P7 above are the **official classification positions**. The report's two output lines form a selection, not a new P1–P2 ranking. Its classes, list, and output layout are teaching choices; the rider, team, and best-lap facts come from the cited classification.

**Why this example?** Four short requirements give us something concrete to design, implement, and test. **How to start:** write down the desired output, the valid inputs, and the special cases before deciding which Python statements to use.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 2.2 — Three Development Phases

The book opens Section 2.2 with three phases of a traditional software project:

| Phase | Question | Practice-report work |
| :--- | :--- | :--- |
| **Design** | What components should exist, and what should each do? | Give one result and the overall report separate responsibilities. |
| **Implementation** | How will the design become working code? | Write the classes, methods, and `main()` in Python. |
| **Testing and debugging** | Does the code meet its requirements, and where is a failure? | Check real examples and special cases; inspect the first wrong step. |

These phases are a way to organize the work. A failing test may reveal a mistake in the implementation **or** an incomplete design requirement, so the developer may return to an earlier phase.

**Why this example?** The Practice report is small enough to follow from beginning to end. **How to use the phases:** first assign responsibilities, then code those responsibilities, then compare actual behavior with the four stated requirements.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 2.2.1 — Design

Design chooses classes, how they interact, what each stores, and what each does. The book recommends thinking about **responsibilities**, **independence**, and **behaviors**.

<span id="part-2-responsibilities"></span>

### 1. Assign actions to actors

Treat a required **action** as a verb, then assign it to an **actor** that has the right data:

| Required action | Actor | Data or collaborator needed |
| :--- | :--- | :--- |
| Validate and store one best lap. | `PracticeResult` | Session, rider, team, integer milliseconds. |
| Convert one lap to seconds. | `PracticeResult` | Its own milliseconds. |
| Calculate a difference from a reference lap. | `PracticeResult` | Another `PracticeResult` from the same session. |
| Build display lines for selected riders. | `PracticeReport` | Selected results and the reference result. |
| Provide verified data and print the lines. | `main()` | Raúl, Marc, and Fabio results. |

**Responsibility** means each action has an owner. **Independence** means a class keeps the data needed for its own work: `PracticeReport` asks a result for its seconds instead of reading `_lap_ms` and dividing again. **Behavior** means a method has a clear promise: `difference_seconds(reference)` returns this lap minus the reference in seconds, with a positive answer for a slower lap.

**Why this example?** A missing owner is easy to spot in a five-row table. **How to solve the design:** list the verbs in the requirements, assign each to the object with the necessary data, then state the inputs, outputs, and units of each public method. Two classes are enough for this fixed-size report.

<span id="part-2-crc"></span>

### 2. Plan with CRC cards

A **CRC card** records a proposed **Class**, its **Responsibilities**, and its **Collaborators**. It is a planning aid, not a Python class definition. For our report:

| Class | Responsibilities | Collaborators |
| :--- | :--- | :--- |
| `PracticeResult` | Validate and store one result; return lap seconds and signed differences. | Another `PracticeResult` when comparing laps. |
| `PracticeReport` | Keep the selected order; return lines or an empty-selection message. | `PracticeResult` objects. |

Try the book's **action/actor cycle**: take one action, give it to an actor, then repeat. If an actor collects too many unrelated jobs, reconsider the split. Here, formatting the whole selection belongs to `PracticeReport`; one result's timing arithmetic stays in `PracticeResult`.

**Why this example?** CRC cards expose which class must ask another for information. **How to use them:** read each responsibility aloud, name any collaborator required to complete it, and check that every requirement from the background has an owner.

<span id="part-2-uml"></span>

### 3. Sketch a UML class diagram

**UML** (Unified Modeling Language) gives a standard way to sketch object-oriented structures. The book's Figure 2.3 uses a `CreditCard` class with three compartments: class name, stored fields such as `balance`, and methods such as `charge(price)`. A compact Practice-result sketch follows the same idea:

```text
+--------------------------------------+
| PracticeResult                       |  class name
+--------------------------------------+
| _session, rider, team, _lap_ms        |  fields
+--------------------------------------+
| lap_seconds()                        |  methods
| difference_seconds(reference)        |
+--------------------------------------+

PracticeReport --uses--> PracticeResult
```

The leading underscore marks an internal field by Python convention. The sketch leaves out syntax such as `def` and `self` so we can first see what the class owns and offers. `PracticeReport` collaborates with result objects through their methods. The runnable definitions appear in Part 6.

**Why this example?** The three compartments separate stored facts from behaviors. **How to read it:** start at the class name, check whether its fields support its assigned responsibilities, then check that its methods offer what collaborators need.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 2.2.2 — Pseudo-Code

<span id="part-3-algorithm"></span>

### 1. Write the steps before Python syntax

**Pseudocode** describes an algorithm for a human reader. It is structured enough to check the steps and special cases, but it is not executable Python. For the report lines:

```text
Algorithm report_lines(reference, selected):
    { selected contains Practice results from the reference session. }
    n ← length(selected)
    if n = 0:
        return ["No riders selected."]

    lines ← empty list
    for j from 0 to n - 1:
        result ← selected[j]
        gap ← result.difference_seconds(reference)
        append formatted rider, team, lap seconds, and gap to lines
    return lines
```

This plan delegates timing arithmetic to `PracticeResult`. It also describes the empty selection before entering the loop. If a selected result comes from another session, `difference_seconds` will signal an error according to its method contract.

**Why this example?** The loop and the empty case are easier to inspect without string-formatting details. **How to solve it:** identify the input (`reference`, `selected`), decide what each path returns, and trace each selected entry once before translating the steps to Python.

<span id="part-3-notation"></span>

### 2. Read the notation and trace two riders

The book mixes English, mathematical notation, and Python-like structure in its pseudocode:

| Pseudocode mark | Meaning | Python counterpart |
| :--- | :--- | :--- |
| Indentation | Steps beneath a loop or decision belong to it. | Indented blocks. |
| `selected[0]` through `selected[n - 1]` | The valid indexes of a list with `n` items. | Python lists also start at index `0`. |
| `←` | Assign a value. | `=` |
| `{ ... }` | Explanation for the reader. | A `#` comment. |
| `signal an error` | Required behavior without language syntax. | For example, `raise ValueError(...)`. |

For `selected = [marc, fabio]`, `n = 2`. The loop visits `j = 0` (Marc) and `j = 1` (Fabio), then stops. It returns two lines with `+0.701 s` and `+0.833 s`. If `selected = []`, `n = 0` and the algorithm returns the message immediately.

**Why this example?** Two entries make the last valid index visible: it is `1`, not `2`. **How to check it:** write down `n`, list the indexes from `0` through `n - 1`, and confirm that the first and last selected riders are both processed. Pseudocode is a plan to translate; its arrow and brace notation should not be pasted into a `.py` file.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 2.2.3 — Coding Style and Documentation

<span id="part-4-style"></span>

### 1. Make names and layout communicate intent

The book recommends [PEP 8's Python style conventions](https://peps.python.org/pep-0008/): **four spaces** for each indentation level and spaces rather than tabs. Its printed examples sometimes use two spaces to fit the page; the runnable code here uses four.

| Kind | Convention | Practice-report example |
| :--- | :--- | :--- |
| Class | Singular `CamelCase` or `CapWords` noun. | `PracticeResult`, `PracticeReport` |
| Function or method | Lowercase words with underscores; describe an action or returned value. | `difference_seconds()`, `lines()` |
| Variable or parameter | Descriptive lowercase name. | `reference`, `selected`, `lap_ms` |
| Intended constant | Uppercase words with underscores. | `SESSION` |
| Internal field | One leading underscore by convention. | `_lap_ms`, `_selected` |

The unit-bearing name `lap_ms` prevents a common error: treating `89,426` as seconds. Uppercase `SESSION` signals an intended constant; Python does not enforce immutability from the spelling alone.

**Why this example?** A unit mistake would make every displayed time wrong. **How to solve it:** choose names that reveal the value's meaning and unit, use consistent indentation, and read the code as a teammate would. In the final program, `lap_seconds()` performs the conversion in one place.

<span id="part-4-documentation"></span>

### 2. Distinguish comments from docstrings

A `#` **comment** explains a local decision that might surprise a reader. A **docstring** describes a module, class, function, or method for readers and tools. It is a string literal placed as the **first statement** in that body, usually in triple quotes. [PEP 257](https://peps.python.org/pep-0257/) gives docstring conventions. This shortened excerpt shows where each belongs; Part 6 has the complete runnable class.

```python
class PracticeResult:
    """Store one rider's best lap in integer milliseconds."""

    def lap_seconds(self):
        """Return the best-lap time in seconds."""
        return self._lap_ms / 1000

# Keep the two selected riders in their official classification order.
selected = [marc, fabio]
```

The docstrings state the public meaning and unit. The comment explains why the list has that order. A longer docstring starts with a short summary, leaves a blank line, then gives details. For `difference_seconds`, those details could say that `reference` must be from the same session, that a positive result means a slower lap, and that a different session raises `ValueError`. After importing the completed program, `help(PracticeResult.lap_seconds)` can display the method's docstring; Python also supplies `pydoc`. A triple-quoted string elsewhere in a function is still a string literal, but it is **not** that function's retrievable docstring.

**Why this example?** A reader needs both the method's contract and the reason for a local choice. **How to document it:** put the stable promise in a docstring, put a short explanation beside a nonobvious decision, and avoid comments that merely repeat the code.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Section 2.2.4 — Testing and Debugging

<span id="part-5-cases"></span>

### 1. Choose cases that can reveal mistakes

**Testing** compares actual behavior with a stated expected result. Trying every possible input is impractical, so the book recommends representative values and special cases. Its sorting example includes empty, one-item, equal, already sorted, and reverse-sorted inputs. For our report, a useful set is:

| Case | Expected behavior | Mistake it could reveal |
| :--- | :--- | :--- |
| Marc compared with Raúl | `+0.701 s` | Wrong subtraction or unit conversion. |
| Fabio compared with Raúl | `+0.833 s` | Wrong source value or skipped last entry. |
| `selected = []` | `No riders selected.` | Empty-list failure. |
| `selected = [marc]` | One Marc line. | One-item loop mistake. |
| `selected = [fabio, marc]` | Two lines in that order. | Accidental sorting or lost first/last entry. |
| Hypothetical lap of `0` or `-250` ms | `ValueError`. | Missing input validation. |
| A result from another session | `ValueError` when compared. | Mixing incomparable sessions. |

The final two cases are **hypothetical tests**, not MotoGP results. The book also emphasizes list boundaries: operations at the first or last position are easy places for bugs. With two selected riders, test both entries explicitly. Randomly generated inputs can supplement these checks, but they cannot replace cases with known expected answers.

**Method coverage** means every method is called by some test. **Statement coverage** means every statement executes in some test. For example, testing both an empty and a nonempty selection exercises both paths in `PracticeReport.lines()`. Coverage shows what ran; it does not prove the values are correct. We still check the arithmetic against the official laps.

**Why these examples?** The ordinary two-rider report and special cases challenge different assumptions. **How to design tests:** list each requirement and boundary, write the expected answer before running code, then choose at least one case that could fail if the rule were implemented incorrectly.

<span id="part-5-order"></span>

### 2. Test from the top or from the bottom

The report depends on the result class, so we can choose a testing order:

| Strategy | First step | In this project |
| :--- | :--- | :--- |
| **Top-down** | Check high-level behavior using **stubs** for unfinished lower-level pieces. | Give `PracticeReport` a stub result that returns `89.426` seconds and `0.701` difference. |
| **Bottom-up** | Unit-test low-level pieces, then the code that calls them. | Check `PracticeResult`, then `PracticeReport.lines()`, then the printed script. |

A **stub** is a small stand-in with predictable behavior. For example, a temporary object could provide `rider = "Marc Márquez"`, `team = "Ducati Lenovo Team"`, and methods that return `89.426` and `0.701`. This lets us work on report formatting before finishing timing arithmetic. **Unit testing** checks a small component in isolation; the companion suite in Part 6 mainly follows the bottom-up order.

**Why this example?** It separates a formatting problem from a timing problem. **How to choose an order:** identify which component depends on which; either replace unfinished dependencies with controlled stubs or test the dependencies first.

<span id="part-5-automation"></span>

### 3. Automate checks and rerun them

Python's [`unittest` module](https://docs.python.org/3/library/unittest.html) groups test cases and reports failures. The complete program uses `if __name__ == "__main__":` so running `python practice_report.py` prints the demonstration, while importing it from `test_practice_report.py` does not print it. The test file in Part 6 checks timing, output order, empty input, invalid input, and a different session.

After a change, run the same suite again. **Regression testing** asks whether the change broke behavior that had worked before. A fixed two-rider report should still handle the empty and single-rider cases.

**Why this example?** Manual checking of `+0.701` is useful once; an automated check keeps that expectation available for future edits. **How to solve it:** save the program and test file in the same folder, run `python test_practice_report.py`, investigate any failure, and rerun the whole suite after a fix.

<span id="part-5-debugging"></span>

### 4. Trace a failed report

**Testing** finds a mismatch; **debugging** locates its cause. Suppose a faulty draft prints Marc's line but omits Fabio's. A test expecting two lines fails. If that draft used `for j in range(len(selected) - 1)`, then with two riders `range(1)` visits only index `0`.

```python
# Faulty draft: the final selected rider is skipped.
for j in range(len(selected) - 1):
    print(selected[j].rider)
```

**Why this example?** An off-by-one loop bug has a visible symptom and a clear first wrong step. **How to debug it:** inspect `len(selected)` (`2`), the visited `j` values (`0` only), and the last valid index (`1`). A temporary `print(j)` can reveal the trace. A debugger can pause at a **breakpoint** and inspect the variables; Python's [`pdb` debugger](https://docs.python.org/3/library/pdb.html) and IDE debuggers support this. Replace the faulty loop with `for result in selected`, as in the final program, then rerun all tests. Remove temporary trace prints after the cause is fixed.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Complete Program and Test Suite

<span id="part-6-program"></span>

### 1. Run the Practice report

Save this file as `practice_report.py` and run `python practice_report.py` with Python 3. The two classes follow the action/actor plan; `main()` supplies the three verified Practice results.

```python
"""Report selected riders from one MotoGP Practice session."""

SESSION = "2026 Indonesian GP MotoGP Practice, 9 October"


class PracticeResult:
    """Store one rider's best lap in integer milliseconds."""

    def __init__(self, session, rider, team, lap_ms):
        if not session or not rider or not team:
            raise ValueError("session, rider, and team are required")
        if type(lap_ms) is not int or lap_ms <= 0:
            raise ValueError("lap_ms must be a positive integer")

        self._session = session
        self.rider = rider
        self.team = team
        self._lap_ms = lap_ms

    def lap_seconds(self):
        """Return the best-lap time in seconds."""
        return self._lap_ms / 1000

    def difference_seconds(self, reference):
        """Return this lap minus a same-session reference, in seconds.

        A positive result means this lap took longer. Comparing results
        from different sessions raises ValueError.
        """
        if not isinstance(reference, PracticeResult):
            raise TypeError("reference must be a PracticeResult")
        if self._session != reference._session:
            raise ValueError("results must be from the same session")
        return (self._lap_ms - reference._lap_ms) / 1000


class PracticeReport:
    """Build display lines for selected results against one reference."""

    def __init__(self, reference, selected):
        self._reference = reference
        self._selected = list(selected)

    def lines(self):
        """Return one line per rider, or an empty-selection message."""
        if not self._selected:
            return ["No riders selected."]

        lines = []
        for result in self._selected:
            lines.append("{} | {} | {:.3f} s | {:+.3f} s".format(
                result.rider,
                result.team,
                result.lap_seconds(),
                result.difference_seconds(self._reference),
            ))
        return lines


def main():
    """Show Marc and Fabio relative to Raúl's P1 Practice lap."""
    raul = PracticeResult(SESSION, "Raúl Fernández",
                          "SuperFile Trackhouse MotoGP Team", 88725)
    marc = PracticeResult(SESSION, "Marc Márquez",
                          "Ducati Lenovo Team", 89426)
    fabio = PracticeResult(SESSION, "Fabio Quartararo",
                           "Monster Energy Yamaha MotoGP", 89558)

    # Keep the selected riders in their official classification order.
    report = PracticeReport(raul, [marc, fabio])
    print("Friday 2026 Indonesian GP MotoGP Practice")
    print("Reference: {} | {} | {:.3f} s".format(
        raul.rider, raul.team, raul.lap_seconds()
    ))
    for line in report.lines():
        print(line)
    print("Fabio minus Marc: {:+.3f} s".format(
        fabio.difference_seconds(marc)
    ))


if __name__ == "__main__":
    main()
```

Expected output:

```text
Friday 2026 Indonesian GP MotoGP Practice
Reference: Raúl Fernández | SuperFile Trackhouse MotoGP Team | 88.725 s
Marc Márquez | Ducati Lenovo Team | 89.426 s | +0.701 s
Fabio Quartararo | Monster Energy Yamaha MotoGP | 89.558 s | +0.833 s
Fabio minus Marc: +0.132 s
```

<span id="part-6-trace"></span>

### 2. Check the output by hand

| Selected rider | Stored best lap | Subtract Raúl's `88,725 ms` | Divide by `1000` |
| :--- | ---: | ---: | ---: |
| Marc Márquez | `89,426 ms` | `701 ms` | `+0.701 s` |
| Fabio Quartararo | `89,558 ms` | `833 ms` | `+0.833 s` |

For the last line, `89,558 − 89,426 = 132 ms = +0.132 s`. The `{:+.3f}` format requests a sign and three decimal places. The report preserves `[marc, fabio]` order; it does not assign new official positions. An empty `PracticeReport(raul, [])` returns `['No riders selected.']`.

**Why this example?** Every number in the output can be traced back to one official Practice best lap and one subtraction. **How to check it:** verify the conversion to milliseconds, inspect the selected order, compute each difference by hand, and compare the displayed strings with the requirement.

<span id="part-6-tests"></span>

### 3. Run a focused `unittest` suite

Save this companion file as `test_practice_report.py` beside `practice_report.py`:

```python
import unittest

from practice_report import PracticeReport, PracticeResult, SESSION


class PracticeReportTests(unittest.TestCase):
    def setUp(self):
        self.raul = PracticeResult(
            SESSION, "Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 88725
        )
        self.marc = PracticeResult(
            SESSION, "Marc Márquez", "Ducati Lenovo Team", 89426
        )
        self.fabio = PracticeResult(
            SESSION, "Fabio Quartararo", "Monster Energy Yamaha MotoGP", 89558
        )

    def test_lap_differences(self):
        self.assertAlmostEqual(self.marc.difference_seconds(self.raul), 0.701)
        self.assertAlmostEqual(self.fabio.difference_seconds(self.raul), 0.833)
        self.assertAlmostEqual(self.fabio.difference_seconds(self.marc), 0.132)

    def test_two_selected_riders(self):
        lines = PracticeReport(self.raul, [self.marc, self.fabio]).lines()
        self.assertEqual(len(lines), 2)
        self.assertIn("Marc Márquez", lines[0])
        self.assertTrue(lines[0].endswith("+0.701 s"))
        self.assertIn("Fabio Quartararo", lines[1])
        self.assertTrue(lines[1].endswith("+0.833 s"))

    def test_empty_selection(self):
        self.assertEqual(
            PracticeReport(self.raul, []).lines(), ["No riders selected."]
        )

    def test_one_rider(self):
        lines = PracticeReport(self.raul, [self.marc]).lines()
        self.assertEqual(len(lines), 1)
        self.assertIn("Marc Márquez", lines[0])

    def test_reversed_selection_keeps_order(self):
        lines = PracticeReport(self.raul, [self.fabio, self.marc]).lines()
        self.assertIn("Fabio Quartararo", lines[0])
        self.assertIn("Marc Márquez", lines[1])

    def test_nonpositive_lap_is_rejected(self):
        with self.assertRaises(ValueError):
            PracticeResult(SESSION, "Test rider", "Test team", 0)

    def test_other_session_is_rejected(self):
        other = PracticeResult("Another session", "Test rider", "Test team", 90000)
        with self.assertRaises(ValueError):
            PracticeReport(self.raul, [other]).lines()


if __name__ == "__main__":
    unittest.main()
```

Run `python test_practice_report.py`. The suite should report **seven passing tests**. The `Test rider` entries and `Another session` are hypothetical test data; they are not entries from the official classification. The tests check both the numeric rule and the special cases, then remain available as regression checks after a change.

**Why this example?** The tests challenge both normal arithmetic and failures at boundaries. **How to solve a failure:** read which test failed, compare its expected result with the actual result, trace the first difference, fix the cause, and rerun all seven tests.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 2.2 idea | Plain-language meaning | Practice-report example |
| :--- | :--- | :--- |
| Design, implementation, testing | Plan components, write code, compare behavior with requirements. | Define the report, implement it, then check its output. |
| Responsibilities and independence | Give each action to the actor that owns its data. | `PracticeResult` does timing; `PracticeReport` formats selections. |
| CRC cards | Record classes, duties, and collaborators. | The report collaborates with result objects. |
| UML class diagram | Sketch class name, fields, and methods. | `PracticeResult` stores `_lap_ms` and offers `lap_seconds()`. |
| Pseudocode | Describe the algorithm before language details. | Visit indexes `0` through `n - 1`, including Fabio. |
| Coding style | Make layout and names consistent and informative. | Four-space indentation and `lap_ms` reveal structure and units. |
| Documentation | Explain a public promise or a local decision. | A docstring states the returned unit; a comment explains order. |
| Testing | Try normal, boundary, and invalid inputs with expected answers. | Check `+0.701 s`, empty input, and a wrong session. |
| Regression testing | Rerun earlier checks after a change. | Keep the seven tests after fixing a bug. |
| Debugging | Find the first step where behavior diverges. | Inspect a loop that skips Fabio's final entry. |

[🔝 Back to Top](#top)
