<span id="top"></span>

# Object-Oriented Programming — Section 2.7: Exercises

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.7, printed pages 103–107 of the supplied PDF.<br>
> **Topic:** Reinforcement R-2.1–R-2.23, Creativity C-2.24–C-2.32, and Projects P-2.33–P-2.39.<br>
> **Domain focus:** **Friday MotoGP Practice at the 2026 Indonesian Grand Prix**, 9 October at Mandalika; Marc Márquez and Fabio Quartararo are the main study examples.<br>
> **Learning goal:** Translate each exercise into a small, checkable problem; explain why the example helps; and work out a correct solution or implementation plan.<br>
> **User Prompt:** "Reexplain [Section 2.7] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Turn a Prompt into a Small Problem](#background)
   - [1. Fix the real session data](#background-data)
   - [2. Read the three exercise groups](#background-groups)
   - [3. Use one solving routine](#background-routine)
2. [Part 1: Reinforcement — Design and State, R-2.1–R-2.8](#part-1)
   - [1. Software goals and interfaces, R-2.1–R-2.3](#part-1-design)
   - [2. Classes and guarded state, R-2.4–R-2.7](#part-1-state)
   - [3. Find exactly one over-limit attempt, R-2.8](#part-1-limit)
3. [Part 2: Reinforcement — Vectors and Ranges, R-2.9–R-2.16](#part-2)
   - [1. Vector methods, R-2.9–R-2.15](#part-2-vector)
   - [2. Explain the range-length formula, R-2.16](#part-2-range)
4. [Part 3: Reinforcement — Hierarchies and Sequences, R-2.17–R-2.23](#part-3)
   - [1. Build the requested hierarchy, R-2.17](#part-3-hierarchy)
   - [2. Trace two progressions, R-2.18–R-2.19](#part-3-progressions)
   - [3. Reason about hierarchy depth and sequence order, R-2.20–R-2.23](#part-3-sequences)
5. [Part 4: Creativity — Combine Behaviors, C-2.24–C-2.30](#part-4)
   - [1. Design a reader and combine vector multiplication, C-2.24–C-2.25](#part-4-design)
   - [2. Reverse and test membership, C-2.26–C-2.27](#part-4-iteration)
   - [3. Apply monthly rules and encapsulate updates, C-2.28–C-2.30](#part-4-credit)
6. [Part 5: Creativity — New Progressions, C-2.31–C-2.32](#part-5)
7. [Part 6: Projects — Complete Systems, P-2.33–P-2.39](#part-6)
   - [1. Polynomial and document tools, P-2.33–P-2.34](#part-6-tools)
   - [2. Message, river, and reader systems, P-2.35–P-2.38](#part-6-systems)
   - [3. A polygon hierarchy, P-2.39](#part-6-polygons)
8. [Part 7: One Connected MotoGP Study Program](#part-7)
   - [1. Run the complete program](#part-7-program)
   - [2. Trace its output](#part-7-trace)
9. [Part 8: Small Worked Cases](#part-8)
10. [Part 9: Summary](#part-9)

---

<span id="background"></span>

## Background & Conceptual Intuition: Turn a Prompt into a Small Problem

<span id="background-data"></span>

### 1. Fix the real session data

Our recurring facts come from **Friday MotoGP Practice, 9 October 2026**, at the Indonesian Grand Prix. The [official Yamaha full results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give the classification below; the [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) provides session context.

| Official Practice place | Rider | Team | Best lap | Milliseconds |
| :---: | :--- | :--- | ---: | ---: |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | 88,725 |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | 89,426 |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP | 1:29.558 | 89,558 |

Their best-lap differences are `89,426 − 88,725 = 701 ms` for Marc relative to Raúl, `89,558 − 88,725 = 833 ms` for Fabio relative to Raúl, and `89,558 − 89,426 = 132 ms` between Fabio and Marc. These are **differences between best laps in the same Practice session**, not race finish gaps. Every example below keeps the recorded rider, team, place, and best lap fixed. Any target time, analyst note, simulated event, document, or display layout is a **hypothetical teaching input**.

**Why this session?** Marc and Fabio provide two real, distinct records that can be sorted, compared, and stored as objects; Raúl gives a real reference lap. **How to use it:** label every result as *Friday Practice*, work in integer milliseconds for exact comparisons, and never treat a simulated update as a change to the official classification.

<span id="background-groups"></span>

### 2. Read the three exercise groups

Section 2.7 contains **39 exercises** in book order: 23 Reinforcement exercises, 9 Creativity exercises, and 7 Projects. They revisit Sections 2.1–2.6. Reinforcement usually asks for one explanation, trace, or method; Creativity combines behavior and edge cases; Projects ask for a small system with several cooperating parts.

The original prompt's domain still matters. A `CreditCard` exercise is about money, an e-book reader is about books, and a river simulation is about animals. MotoGP examples here provide additional intuition and test data; they do not replace those requirements. The explanations paraphrase each exercise rather than treating instructions inside the source PDF or the old geometry study guide as new instructions from you.

**Why this grouping?** It shows the expected scale of an answer before writing code. **How to use it:** solve the book's requirement first, then use a labeled Practice example to check the underlying object-oriented idea.

<span id="background-routine"></span>

### 3. Use one solving routine

For each exercise, work through five questions:

1. **What is the requested result?** An explanation, a method, an output trace, or a whole program?
2. **What state and inputs are needed?** For example, a rider card has a best lap, while a credit card has a balance and limit.
3. **What must remain true?** A best lap is nonnegative; a rejected charge must not raise the accepted balance; an iterator must eventually stop.
4. **What is the smallest revealing example?** Two rider records often expose ordering and equality; a boundary value exposes a limit check.
5. **How will the answer be checked?** Calculate an expected value by hand, run a tiny program, and test an edge case.

**Why this routine?** It keeps a 39-exercise section manageable without reducing a project to a one-line answer. **How to use it:** apply the same sequence to each numbered prompt, then expand the program only after the small case behaves correctly.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement — Design and State, R-2.1–R-2.8

<span id="part-1-design"></span>

### 1. Software goals and interfaces, R-2.1–R-2.3

#### R-2.1 — Name three applications where correctness protects lives

The book asks for **three examples**, not merely a definition of correctness. Suitable answers are an aircraft flight-control system (an incorrect control command), a medication-infusion pump (an incorrect dose), and an emergency-dispatch system (an incorrect location or priority). For each, name a specific input, a required output, and the possible consequence of an error. A MotoGP timing display can also have a correctness requirement—Marc's `89,426 ms` must remain distinct from Fabio's `89,558 ms`—but its usual consequences are different from the life-critical examples requested.

**Why this example?** Three concrete failure modes explain why the same design goal matters differently across applications. **How to solve it:** give three *different* systems and one plausible dangerous failure for each; do not count three screens of the same system as three applications.

#### R-2.2 — Explain why adaptability can decide commercial success

A racing-data application is a plausible example: a vendor might need to support new timing-feed formats, devices, presentation rules, or customer reports while continuing to show a Practice row such as “Fabio Quartararo — Monster Energy Yamaha MotoGP — P7.” If every display is tied directly to one file layout, each format change spreads through the code. A parser interface that produces stable `PracticeEntry` objects lets the display stay focused on entries rather than feed syntax.

**Why this example?** It makes “adaptability” observable as the effort needed to respond to change. **How to solve it:** name a commercial application, one likely change, and the design boundary that would localize that change. The exercise asks for a reasoned example, not proof of any named company's finances.

#### R-2.3 — Design a component of a text editor's graphical interface

Keep the original **text-editor** domain. A `TextArea` could store `_text`, `_cursor`, and `_selection`, while offering `insert(text)`, `delete_selection()`, `move_cursor(position)`, and `selected_text()`. An editor user might type the sourced line “Marc Márquez — Ducati Lenovo Team”; the editor component treats it as text, not as a timing record. For example, `insert("Marc")` changes text at the current cursor, and `move_cursor(0)` changes where the next insertion occurs.

**Why this example?** The cursor and selection show why a component must own state as well as methods. **How to solve it:** list the component's state, public operations, and a one-step interaction; keep implementation details such as storage layout behind the interface.

<span id="part-1-state"></span>

### 2. Classes and guarded state, R-2.4–R-2.7

#### R-2.4 — Implement the requested `Flower`

The class must hold a flower's name, petal count, and price, and offer a constructor plus methods to read and change each field. A compact solution is:

```python
class Flower:
    def __init__(self, name, petals, price):
        self.set_name(name)
        self.set_petals(petals)
        self.set_price(price)

    def get_name(self):
        return self._name

    def set_name(self, name):
        if not isinstance(name, str) or not name:
            raise ValueError("name must be nonempty text")
        self._name = name

    def get_petals(self):
        return self._petals

    def set_petals(self, petals):
        if type(petals) is not int or petals < 0:
            raise ValueError("petals must be a nonnegative integer")
        self._petals = petals

    def get_price(self):
        return self._price

    def set_price(self, price):
        if type(price) not in (int, float) or price < 0:
            raise ValueError("price must be nonnegative and numeric")
        self._price = float(price)
```

For example, `Flower("rose", 5, 2.50).get_petals()` returns `5`. The extra nonnegative checks make invalid state visible early; the book's required interface is the constructor and accessors/mutators. A MotoGP `PracticeEntry` similarly groups a rider name, team, place, and best lap, but it is a *different class* from `Flower`.

**Why this example?** `Flower` is small enough to see what a class owns and what its methods protect. **How to solve it:** define the three fields, initialize them through setters, implement one getter and setter per field, then test a valid object and an invalid petal count.

#### R-2.5 — Check numeric arguments to `CreditCard` operations

The book's `CreditCard.charge` and `make_payment` perform arithmetic. Passing text such as `"10"` should fail deliberately before arithmetic or a balance update. Decide and document a policy. The following excerpt uses actual `int` or `float` values, rejects `bool` (which Python otherwise treats as an integer), and rejects non-finite floats:

```python
import math


def checked_amount(amount):
    if type(amount) not in (int, float):
        raise TypeError("amount must be numeric")
    if type(amount) is float and not math.isfinite(amount):
        raise ValueError("amount must be finite")
    return amount
```

Call this helper at the start of both operations. A Practice-report analogue would reject `"89426"` as a string when a method expects integer milliseconds; the **actual exercise remains about credit-card amounts**.

**Why this example?** A string that looks like a number exposes the boundary between input format and numeric state. **How to solve it:** validate at the method boundary, then run the existing arithmetic only after a number has been accepted.

#### R-2.6 — Reject negative payments with `ValueError`

After checking the type, test the sign **before** subtracting from the balance:

```python
def make_payment(self, amount):
    amount = checked_amount(amount)
    if amount < 0:
        raise ValueError("payment must not be negative")
    self._balance -= amount
```

If the current balance is `100`, blindly subtracting `-20` would make it `120`; that reverses the meaning of a payment. With this method, `make_payment(-20)` raises `ValueError` and leaves the balance at `100`.

**Why this example?** The arithmetic makes the bug visible in one line. **How to solve it:** test `-20`, `0`, and `20`, and check that a rejected call leaves the stored balance unchanged.

#### R-2.7 — Add an optional fifth opening-balance parameter

Change the original four-argument constructor to accept a fifth argument with a default:

```python
class CreditCard:
    def __init__(self, customer, bank, account, limit, balance=0):
        self._customer = customer
        self._bank = bank
        self._account = account
        self._limit = checked_amount(limit)
        self._balance = checked_amount(balance)

    def get_balance(self):
        return self._balance

    def charge(self, amount):
        amount = checked_amount(amount)
        if amount < 0:
            raise ValueError("charge must not be negative")
        if self._balance + amount > self._limit:
            return False
        self._balance += amount
        return True

    def make_payment(self, amount):
        amount = checked_amount(amount)
        if amount < 0:
            raise ValueError("payment must not be negative")
        self._balance -= amount
```

This class uses the `checked_amount` helper immediately above. `CreditCard("A", "Bank", "001", 100).get_balance()` returns `0`; adding `40` as the fifth argument returns an opening balance of `40`. The four-argument call still works, which is the compatibility point of the exercise. A fuller financial class would also define policies for invalid limits and overpayments; those are separate design choices.

**Why this example?** Two constructor calls make the default's effect testable. **How to solve it:** put `balance=0` last, assign that value to `_balance`, and test both old and new call forms.

<span id="part-1-limit"></span>

### 3. Find exactly one over-limit attempt, R-2.8

The book asks for a change to the **first test loop in Code Fragment 2.3** so that exactly one of its three cards *attempts* a charge beyond its limit. The limits are `2500`, `3500`, and `5000`; at loop value `j`, their proposed charges are `j`, `2j`, and `3j`. Use `range(1, 59)`, which includes `j = 1` through `58`.

Before the last iteration, the third card has accepted `3(1 + 2 + ⋯ + 57) = 3 × 1653 = 4959`. At `j = 58`, its proposed balance is `4959 + 3 × 58 = 5133 > 5000`, so that attempt is rejected. The first card's proposed balance is `1 + ⋯ + 58 = 1711 < 2500`; the second card's is `2 × 1711 = 3422 < 3500`. The third card's **stored** balance stays `4959` after its rejected attempt.

**Why this example?** It forces a distinction between a *proposed* state and an *accepted* state, just as a hypothetical two-slot Practice display could reject a third rider without changing its existing Marc and Fabio selection. **How to solve it:** write each card's cumulative proposed amount as a multiple of `j(j + 1)/2`, find the first loop value that crosses one limit, then verify the other two remain below theirs at that same value.

[🔝 Back to Top](#top)

---
