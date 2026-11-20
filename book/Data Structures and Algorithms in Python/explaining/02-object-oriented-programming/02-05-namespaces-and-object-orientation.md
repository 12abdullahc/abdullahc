<span id="top"></span>

# Object-Oriented Programming — Section 2.5: Namespaces and Object-Orientation

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.5, printed pages 96–100 of the supplied PDF.  
> **Topic:** 2.5 Namespaces and Object-Orientation; 2.5.1 Instance and Class Namespaces; 2.5.2 Name Resolution and Dynamic Dispatch.  
> **Domain focus:** The **MotoGP Practice session at the 2026 Indonesian Grand Prix**, Friday 9 October, at Mandalika.  
> **Learning goal:** Locate a name in a local, instance, or class namespace; explain one child object's state; and predict which method an object call will run.  
> **User Prompt:** "Reexplain [Section 2.5] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Practice Session, Several Places for Names](#background-intuition)
   - [1. Use verified results from one session](#background-data)
   - [2. Ask what each object knows](#background-task)
2. [Part 1: Section 2.5 — What a Namespace Does](#part-1)
   - [1. Map a name to an object](#part-1-map)
   - [2. Separate a local name from a saved attribute](#part-1-local)
3. [Part 2: Section 2.5.1 — Instance and Class Namespaces](#part-2)
   - [1. Read the book's three-namespace picture](#part-2-picture)
   - [2. See where assignments create entries](#part-2-assignments)
   - [3. Share a class member and shadow it on one instance](#part-2-class-data)
   - [4. Nest a report-row class](#part-2-nested)
   - [5. Use `__slots__` for small row objects](#part-2-slots)
4. [Part 3: Section 2.5.2 — Name Resolution and Dynamic Dispatch](#part-3)
   - [1. Trace ordinary dotted lookup](#part-3-lookup)
   - [2. Bind a method to its object](#part-3-binding)
   - [3. Follow an inherited method to an override](#part-3-dispatch)
   - [4. Know the limits of the simple lookup rule](#part-3-limits)
5. [Part 4: Complete Practice-Report Program](#part-4)
   - [1. Run the program](#part-4-program)
   - [2. Trace the output](#part-4-trace)
6. [Part 5: Small Worked Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Practice Session, Several Places for Names

<span id="background-data"></span>

### 1. Use verified results from one session

The examples use **Friday MotoGP Practice** at the 2026 Indonesian Grand Prix. The [Yamaha Factory Racing full results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give these riders, teams, official positions, and fastest laps; the [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) also identifies Raúl Fernández as fastest.

| Official Practice place | Rider | Team | Best lap | Milliseconds | Difference from Raúl |
| :---: | :--- | :--- | ---: | ---: | ---: |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | 88,725 | +0.000 s |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | 89,426 | +0.701 s |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP | 1:29.558 | 89,558 | +0.833 s |

Convert `1:29.426` to `60,000 + 29,426 = 89,426 ms`. Then `89,426 − 88,725 = 701 ms` for Marc and `89,558 − 88,725 = 833 ms` for Fabio. Their two best laps differ by `89,558 − 89,426 = 132 ms`. These are **Practice best-lap comparisons**, not race finishing gaps.

**Why this example?** Real results let us check every displayed number while keeping the namespace question small. **How to solve the timing part:** convert each lap to the same unit, subtract the reference, and label which rider and session the number describes.

<span id="background-task"></span>

### 2. Ask what each object knows

Imagine a report that holds three **result objects**. Raúl's result is a plain `PracticeResult`. Marc's and Fabio's are `ReferencedPracticeResult` objects that also remember Raúl as the comparison reference. This subclass is a **teaching display choice**: it is not an official MotoGP result type or a claim that the riders belong to different sporting categories.

Each result owns its rider, team, Practice place, and lap time. The `PracticeResult` class owns shared display behavior. The subclass overrides one summary method so a Marc or Fabio line includes a gap to Raúl. A `PracticeReport.Row` helper stores each result and generates its line when asked.

```text
Raúl result:     rider, team, P1, 88,725 ms
Marc result:     rider, team, P5, 89,426 ms, reference → Raúl result
Fabio result:    rider, team, P7, 89,558 ms, reference → Raúl result

PracticeResult class:            shared summary() and line()
ReferencedPracticeResult class:  its own summary() override
```

**Why this arrangement?** The two kinds of result make it easy to ask where data lives and which `summary()` runs. **How to read it:** distinguish the real recorded values from the report's chosen object design, then trace one result object at a time.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 2.5 — What a Namespace Does

<span id="part-1-map"></span>

### 1. Map a name to an object

A **namespace** maps a name to an object. The object can be a number, string, function, class, module, or instance. The same spelling can exist in different namespaces without referring to the same thing. In a Python module, the name `PracticeResult` refers to a class object; in that class's namespace, `summary` refers to a function; in Marc's instance namespace, `lap_ms` refers to the integer `89426`.

| Name | Namespace | Value in this example |
| :--- | :--- | :--- |
| `PracticeResult` | Module | The class object. |
| `summary` | `PracticeResult` class | The base summary function. |
| `summary` | `ReferencedPracticeResult` class | The overriding summary function. |
| `lap_ms` | Marc's instance | `89426`. |
| `lap_ms` | Fabio's instance | `89558`. |

The two class entries named `summary` are distinct definitions. The two instance entries named `lap_ms` are distinct pieces of rider data. The module can also assign `result_type = PracticeResult`: both names then refer to the **same class object**, showing that classes are values as well as definitions.

**Why this example?** Repeated spellings make the need for a namespace visible. **How to locate a name:** first identify the expression's context—module code, a function call, or `object.name`—then identify the namespace where that name was bound.

<span id="part-1-local"></span>

### 2. Separate a local name from a saved attribute

An initializer makes the difference between a temporary parameter and an object's lasting state clear:

```python
class PracticeResult:
    def __init__(self, rider, team, place, lap_ms):
        self.rider = rider
        self.team = team
        self.place = place
        self.lap_ms = lap_ms
```

The `rider` on the right of `=` is a **local parameter name** for this call. `self.rider` on the left stores an attribute on this particular instance. When initialization finishes, the call's local names are gone, but Marc's object still has `rider = "Marc Márquez"` and Fabio's still has `rider = "Fabio Quartararo"`. Each initializer call writes to its own `self`.

An unqualified name in a method follows Python's local/enclosing/module/built-in name rules; the surrounding **class body is not automatically a method's enclosing local scope**. For a class member, write `self.DISPLAY_LABEL` or `PracticeResult.DISPLAY_LABEL`, not a bare `DISPLAY_LABEL`. See the [Python scopes and namespaces tutorial](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces).

**Why this example?** It stops a common mix-up between a constructor argument and a field. **How to trace it:** read the right side using this call's arguments, then record the left side in the instance receiving `self`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 2.5.1 — Instance and Class Namespaces

<span id="part-2-picture"></span>

### 1. Read the book's three-namespace picture

The book's Figure 2.8 shows a `CreditCard` class namespace, a separate `PredatoryCreditCard` class namespace, and **one** namespace for a `PredatoryCreditCard` instance. Both initializers write fields into that same child object: the parent sets customer, bank, account, limit, and balance; the child adds its annual-rate field. The parent class defines methods such as `charge` and `make_payment`; the child defines its own `charge` override and a new `process_month`. The child object does **not** contain one parent-instance namespace plus another child-instance namespace.

Our Marc object has the same shape. `PracticeResult.__init__` stores the four source-data fields on `marc`. `ReferencedPracticeResult.__init__` adds `_reference` to **that same object**:

| Namespace | Selected direct entries | Meaning |
| :--- | :--- | :--- |
| Marc **instance** | `rider`, `team`, `place`, `lap_ms`, `_reference` | One object's data, written by both initializers. |
| `ReferencedPracticeResult` **class** | `__init__`, overriding `summary` | Behavior defined by the child. |
| `PracticeResult` **class** | `DISPLAY_LABEL`, `__init__`, `summary`, `line` | Shared label and base behavior. |

Fabio has his **own** five fields, with his team, P7 place, `89558`, and the same Raúl reference object. `vars(marc)` reveals Marc's ordinary instance dictionary. `PracticeResult.__dict__` and `ReferencedPracticeResult.__dict__` show entries defined **directly** by those classes; inherited methods are looked up, not copied into the child class's dictionary.

**Why this example?** Marc and Fabio make it possible to compare both shared methods and separate state. **How to solve a namespace diagram:** draw one box for each class and one for each instance; place every `self.name = ...` field in the receiving instance's box and each class-body `def` in that class's box.

<span id="part-2-assignments"></span>

### 2. See where assignments create entries

```python
class PracticeResult:
    DISPLAY_LABEL = "Practice result"  # class namespace

    def __init__(self, rider, team, place, lap_ms):
        self.rider = rider             # this instance's namespace
        self.team = team               # this instance's namespace
        self.place = place             # this instance's namespace
        self.lap_ms = lap_ms           # this instance's namespace

    def summary(self):               # function in the class namespace
        return "{}: {} ms".format(self.rider, self.lap_ms)
```

`DISPLAY_LABEL` is assigned while Python executes the class body. The `def` statements also create names in that class namespace. The four `self.name = ...` statements run later, once per new result, and write to that individual instance. The parent initializer called through `super().__init__(...)` still receives the **same child object** as `self`; its assignments therefore appear beside `_reference` in `vars(marc)`.

For ordinary unslotted objects, a per-instance `__dict__` commonly holds these fields. A class exposes its namespace through a read-only `__dict__` view. The later `__slots__` example shows why an instance is **not guaranteed** to have a dictionary.

**Why this example?** It attaches each assignment syntax to the namespace it changes. **How to solve it:** ask *when* the line executes—once at class definition or on each initializer call—and whether the assignment target is `self.name` or a bare name in the class body.

<span id="part-2-class-data"></span>

### 3. Share a class member and shadow it on one instance

The book puts a fixed rejected-charge amount in `PredatoryCreditCard.OVERLIMIT_FEE = 5`. That name is in the **class namespace**, so instances can find the shared value without storing a separate copy. Our display uses `PracticeResult.DISPLAY_LABEL = "Practice result"` as a shared text label. It affects wording only, not a rider's official result or lap time.

```python
print(PracticeResult.DISPLAY_LABEL)  # Practice result
print(marc.DISPLAY_LABEL)            # Practice result: found through the class
marc.DISPLAY_LABEL = "Focus rider"   # new entry on Marc's instance
print(marc.DISPLAY_LABEL)            # Focus rider
print(fabio.DISPLAY_LABEL)           # Practice result
print(PracticeResult.DISPLAY_LABEL)  # Practice result
```

The instance assignment **shadows** the class entry for Marc alone. It does not edit `PracticeResult.DISPLAY_LABEL`, nor does it alter Fabio. Uppercase in the book's `OVERLIMIT_FEE` is a naming convention, not a lock against reassignment. A mutable class value, such as `rows = []`, would be **one shared list** across instances; put `self.rows = []` in `__init__` when each report needs its own list.

**Why this example?** A harmless display label lets us see shadowing without changing any timing facts. **How to predict it:** before the assignment, find the label on the class; after `marc.DISPLAY_LABEL = ...`, check Marc's instance first, then compare Fabio and the class unchanged.

<span id="part-2-nested"></span>

### 4. Nest a report-row class

The book also defines a class inside another class. This places the **inner class name in the outer class namespace**; it does not create an inheritance relationship. A report can organize its small row helper this way:

```python
class PracticeReport:
    class Row:
        def __init__(self, result):
            self.result = result

        def text(self):
            return self.result.line()

    def __init__(self, results):
        self._rows = [self.Row(result) for result in results]
```

`PracticeReport.Row` names the nested class. `self.Row` in the report initializer finds it through the report's class. A `Row` is **not** a `PracticeReport` subclass and receives **no automatic reference** to the report instance; the result must be passed explicitly. A subclass of `PracticeReport` could define a different `Row`, and `self.Row` would then find that subclass's choice.

**Why this example?** A row is genuinely a small helper belonging to the report's organization. **How to trace the name:** look for `Row` in the report class namespace, construct that class, then look at the separate row object's `result` field.

<span id="part-2-slots"></span>

### 5. Use `__slots__` for small row objects

The book introduces `__slots__` for cases with many small objects. It declares which **instance data attributes** a class expects, often avoiding a separate dictionary per instance. Our report row can use one slot:

```python
class PracticeReport:
    class Row:
        __slots__ = ("result",)

        def __init__(self, result):
            self.result = result
```

`("result",)` is a one-item tuple; the comma matters. Each row still has its **own** `result` value, but a plain `Row` has no normal instance `__dict__`. Assigning `row.note = "focus"` raises `AttributeError` because `note` is undeclared. Slots do not make the allowed value immutable: `row.result` could still be reassigned.

A slotted subclass that wants to remain without an instance dictionary declares **only its new field**:

```python
class TaggedRow(PracticeReport.Row):
    __slots__ = ("note",)
```

`TaggedRow` inherits the `result` slot and adds `note`. A subclass that omits `__slots__` normally regains an instance dictionary; a slotted child cannot remove a dictionary already supplied by its base. The book's credit-card slots example follows the same rule. Slots list **data fields**, not methods. See the [Python `__slots__` rules](https://docs.python.org/3/reference/datamodel.html#object.__slots__). They are useful when many small objects make dictionary overhead relevant; our three-row report does not need them for speed.

**Why this example?** It makes the storage distinction visible without hiding Marc's ordinary result dictionary, which we still want to inspect. **How to check it:** create a row, ask whether it has `__dict__`, try an undeclared field, then compare a child with its own slots to one without them.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 2.5.2 — Name Resolution and Dynamic Dispatch

<span id="part-3-lookup"></span>

### 1. Trace ordinary dotted lookup

For the **ordinary fields and methods in this example**, the book's introductory rule for `object.name` is: look on the instance, then its actual class, then its ancestor classes. If none provides the name, raise `AttributeError`. For a `ReferencedPracticeResult` named `marc`, the first match is:

| Expression | First place `name` is found | Reason |
| :--- | :--- | :--- |
| `marc.lap_ms` | Marc's instance | Parent initializer stored `89426` there. |
| `marc._reference` | Marc's instance | Child initializer stored Raúl's object there. |
| `marc.summary` | `ReferencedPracticeResult` class | Child overrides `summary`. |
| `marc.line` | `PracticeResult` class | Child inherits the base `line`. |
| `marc.DISPLAY_LABEL` | `PracticeResult` class, at first | The class provides the shared label. |
| `marc.unknown_name` | Nowhere | Raises `AttributeError`. |

After `marc.DISPLAY_LABEL = "Focus rider"`, the `DISPLAY_LABEL` lookup ends at **Marc's instance** instead. Fabio still finds the class value. The class's `summary` function is **not copied** into every result object: attribute lookup finds and binds it when needed.

**Why this table?** Every row follows one step of the same rule but ends in a different namespace. **How to solve `object.name`:** name the runtime class of the object, check the object's own fields, check that class, follow its bases, and stop at the first match or `AttributeError`.

<span id="part-3-binding"></span>

### 2. Bind a method to its object

A class body stores a function such as `PracticeResult.line`. Accessing it as `marc.line` produces a **bound method** with Marc as its `self`. For this ordinary inherited method, these calls have the same effect:

```python
marc.line()
PracticeResult.line(marc)
```

The first spelling supplies Marc implicitly; the second supplies him explicitly. In the full program, `marc.line.__self__ is marc` is true, while `marc.line.__func__ is PracticeResult.line` identifies the shared function. The function is on the class, but it reads the **particular object's** fields through `self`.

The same function can therefore format Fabio's different team and `89,558 ms` lap without being duplicated in Fabio's instance namespace. See the [Python method-object explanation](https://docs.python.org/3/tutorial/classes.html#method-objects).

**Why this example?** It makes the hidden `self` argument observable. **How to trace a method call:** find the function in the class hierarchy, pair it with the receiving object, and read each `self.field` from that object.

<span id="part-3-dispatch"></span>

### 3. Follow an inherited method to an override

**Dynamic dispatch** means an ordinary method call uses the receiving object's runtime class. The base `line()` asks `self.summary()` for its content:

```python
class PracticeResult:
    def line(self):
        return "{}: {}".format(self.DISPLAY_LABEL, self.summary())

class ReferencedPracticeResult(PracticeResult):
    def summary(self):
        basic = super().summary()
        gap_ms = self.lap_ms - self._reference.lap_ms
        return "{}, {:+.3f} s to {}".format(
            basic, gap_ms / 1000, self._reference.rider
        )
```

For `marc.line()`, Python finds `line` in **`PracticeResult`**, but the `self` inside it remains Marc's **`ReferencedPracticeResult` object**. Thus `self.summary()` finds the **child override**. That override calls `super().summary()` to reuse the base formatting on the **same Marc object**, then adds `89,426 − 88,725 = 701 ms`, or `+0.701 s`. `fabio.line()` follows the same path and adds `+0.833 s`; `raul.line()` uses the base `summary()` because Raúl's object is a plain `PracticeResult`.

```text
marc.line()
    → PracticeResult.line(marc)
    → marc.summary()
    → ReferencedPracticeResult.summary(marc)
    → PracticeResult.summary(marc) through super()
    → append +0.701 s to Raúl
```

A function such as `def show(result): return result.line()` needs no rider-specific `if` statements. Its call reaches the appropriate behavior for the object passed at runtime. The `super()` call deliberately requests the next implementation in the inheritance order; calling `self.summary()` from **inside the override** would invoke that same override again.

**Why this example?** One inherited method and two real rider results expose the method choice without an artificial class for each rider. **How to solve it:** start with the object at the call site, find `line`, keep the same `self` throughout, and resolve the inner `self.summary()` from that object's runtime class.

<span id="part-3-limits"></span>

### 4. Know the limits of the simple lookup rule

The instance → class → ancestors rule is a good model for the **ordinary fields and methods above**, but it is not all of Python's attribute machinery. A data descriptor such as a `@property` can take precedence over an instance dictionary; a slot is also represented by a descriptor on its class. Multiple inheritance follows a defined method-resolution order, and a custom `__getattribute__` can change normal lookup. Special syntax such as `len(obj)` usually looks up `__len__` on the object's **type**, not by the same ordinary instance-first path. The [Python descriptor guide](https://docs.python.org/3/howto/descriptor.html) and [special-method lookup rules](https://docs.python.org/3/reference/datamodel.html#special-method-lookup) explain the fuller behavior.

Our result and report examples use ordinary fields and methods for the lookup table. The slotted row example is handled separately so its storage rule is not mistaken for the ordinary instance-dictionary picture.

**Why include this limit?** It keeps the useful first model from becoming a false universal rule. **How to choose the model:** use the simple path for these ordinary attributes, then check for descriptors, slots, custom lookup, or special-method syntax when a new class introduces them.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Practice-Report Program

<span id="part-4-program"></span>

### 1. Run the program

Save this code as a `.py` file and run it with Python 3. The rider, team, place, and best-lap inputs are from the cited **one Friday Practice session**. The referenced-result subclass, report layout, label, and row storage are teaching choices.

```python
SESSION = "2026 Indonesian GP MotoGP Practice, 9 October"


class PracticeResult:
    DISPLAY_LABEL = "Practice result"

    def __init__(self, rider, team, place, lap_ms):
        if type(place) is not int or place <= 0:
            raise ValueError("place must be a positive integer")
        if type(lap_ms) is not int or lap_ms <= 0:
            raise ValueError("lap_ms must be a positive integer")
        self.rider = rider
        self.team = team
        self.place = place
        self.lap_ms = lap_ms

    def summary(self):
        return "P{} {} ({}), {:.3f} s".format(
            self.place, self.rider, self.team, self.lap_ms / 1000
        )

    def line(self):
        return "{}: {}".format(self.DISPLAY_LABEL, self.summary())


class ReferencedPracticeResult(PracticeResult):
    def __init__(self, rider, team, place, lap_ms, reference):
        if not isinstance(reference, PracticeResult):
            raise TypeError("reference must be a PracticeResult")
        super().__init__(rider, team, place, lap_ms)
        self._reference = reference

    def summary(self):
        basic = super().summary()
        gap_ms = self.lap_ms - self._reference.lap_ms
        return "{}, {:+.3f} s to {}".format(
            basic, gap_ms / 1000, self._reference.rider
        )


class PracticeReport:
    class Row:
        __slots__ = ("result",)

        def __init__(self, result):
            self.result = result

        def text(self):
            return self.result.line()

    def __init__(self, results):
        self._rows = [self.Row(result) for result in results]

    def lines(self):
        return [row.text() for row in self._rows]


class TaggedRow(PracticeReport.Row):
    __slots__ = ("note",)

    def __init__(self, result, note):
        super().__init__(result)
        self.note = note


class FlexibleRow(PracticeReport.Row):
    pass


def main():
    raul = PracticeResult(
        "Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88725
    )
    marc = ReferencedPracticeResult(
        "Marc Márquez", "Ducati Lenovo Team", 5, 89426, raul
    )
    fabio = ReferencedPracticeResult(
        "Fabio Quartararo", "Monster Energy Yamaha MotoGP", 7, 89558, raul
    )

    report = PracticeReport([raul, marc, fabio])
    print("Session:", SESSION)
    for line in report.lines():
        print(line)

    print("Marc instance fields:", sorted(vars(marc)))
    print("Fabio instance fields:", sorted(vars(fabio)))
    print("Base defines line:", "line" in PracticeResult.__dict__)
    print("Child defines line:", "line" in ReferencedPracticeResult.__dict__)
    print("Child defines summary:", "summary" in ReferencedPracticeResult.__dict__)
    print("Marc's bound self is Marc:", marc.line.__self__ is marc)
    print("Marc's line function is base line:",
          marc.line.__func__ is PracticeResult.line)
    print("Base summary on Marc:", PracticeResult.summary(marc))

    print("Shared label:", PracticeResult.DISPLAY_LABEL)
    marc.DISPLAY_LABEL = "Focus rider"
    print("Marc's label:", marc.DISPLAY_LABEL)
    print("Fabio's label:", fabio.DISPLAY_LABEL)
    print("Class label unchanged:", PracticeResult.DISPLAY_LABEL)
    print("Marc's updated report line:", report.lines()[1])

    row = report._rows[0]
    print("Nested row name:", PracticeReport.Row.__qualname__)
    print("Plain row has dictionary:", hasattr(row, "__dict__"))
    try:
        row.note = "focus"
    except AttributeError:
        print("Undeclared row field: AttributeError")
    tagged = TaggedRow(marc, "focus")
    flexible = FlexibleRow(fabio)
    print("Tagged row note:", tagged.note)
    print("Tagged row has dictionary:", hasattr(tagged, "__dict__"))
    print("Unslotted child row has dictionary:", hasattr(flexible, "__dict__"))

    try:
        print(marc.unknown_name)
    except AttributeError:
        print("Unknown result name: AttributeError")


if __name__ == "__main__":
    main()
```

The program uses ordinary, inspectable result instances and a separate slotted row class. A row keeps a reference to its result, so changing Marc's **display label** is visible when the report asks that row for text again. It does not change Marc's lap time or official P5 place. The reference stored by Marc and Fabio points to the same Raúl result object; it is not a new copy of Raúl's lap.

**Why this combined example?** One report shows where attributes are stored, how methods are found, and why a subclass override changes a line produced by inherited code. **How to solve it:** construct the three results, draw their instance fields, inspect the two class dictionaries, then trace each `line()` call and the row's storage rule.

<span id="part-4-trace"></span>

### 2. Trace the output

```text
Session: 2026 Indonesian GP MotoGP Practice, 9 October
Practice result: P1 Raúl Fernández (SuperFile Trackhouse MotoGP Team), 88.725 s
Practice result: P5 Marc Márquez (Ducati Lenovo Team), 89.426 s, +0.701 s to Raúl Fernández
Practice result: P7 Fabio Quartararo (Monster Energy Yamaha MotoGP), 89.558 s, +0.833 s to Raúl Fernández
Marc instance fields: ['_reference', 'lap_ms', 'place', 'rider', 'team']
Fabio instance fields: ['_reference', 'lap_ms', 'place', 'rider', 'team']
Base defines line: True
Child defines line: False
Child defines summary: True
Marc's bound self is Marc: True
Marc's line function is base line: True
Base summary on Marc: P5 Marc Márquez (Ducati Lenovo Team), 89.426 s
Shared label: Practice result
Marc's label: Focus rider
Fabio's label: Practice result
Class label unchanged: Practice result
Marc's updated report line: Focus rider: P5 Marc Márquez (Ducati Lenovo Team), 89.426 s, +0.701 s to Raúl Fernández
Nested row name: PracticeReport.Row
Plain row has dictionary: False
Undeclared row field: AttributeError
Tagged row note: focus
Tagged row has dictionary: False
Unslotted child row has dictionary: True
Unknown result name: AttributeError
```

The first three report lines come from the same `Row.text()` and inherited `PracticeResult.line()` code, yet Marc's and Fabio's summaries include different gaps because `self.summary()` reaches their subclass override. The two `vars(...)` lists each show **one instance namespace** containing fields set by both initializers. The class checks show that `line` remains defined on the base class while `summary` is defined again on the child.

The display-label assignment adds one entry to **Marc's instance** after those `vars(...)` lines. Fabio and the class retain the shared label. The slotted row lacks a dictionary; the slotted child adds only its new `note` field, while the child without slots gets a dictionary. The last line shows the end of an unsuccessful ordinary attribute lookup.

**Why trace this output?** Each printed line can be tied to a specific namespace or method lookup. **How to verify it:** check the five fields in Marc's `vars(...)`, follow `line → summary` for each result, then compare the row storage and class-label lines with their definitions.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Small Worked Cases

1. **Find a saved value.** When `ReferencedPracticeResult.__init__` has finished creating Marc, where are `rider = "Marc Márquez"` and `_reference = raul` stored? **Why this case?** Both parent and child constructors contributed fields. **Solve:** both entries are in **Marc's one instance namespace**. The parent wrote `self.rider`; the child wrote `self._reference`. There is no separate parent-object box inside Marc.

2. **Find two definitions with one spelling.** Both `PracticeResult` and `ReferencedPracticeResult` define `summary`. Which one runs for `marc.summary()`? Which one runs for `raul.summary()`? **Why this case?** It tests class lookup rather than field lookup. **Solve:** Marc's runtime class is `ReferencedPracticeResult`, so its override is found first; Raúl is a plain `PracticeResult`, so the base version runs. The child override can still call `super().summary()` to reuse the base text on Marc.

3. **Predict a class-member shadow.** After `marc.DISPLAY_LABEL = "Focus rider"`, what do `marc.DISPLAY_LABEL`, `fabio.DISPLAY_LABEL`, and `PracticeResult.DISPLAY_LABEL` return? **Why this case?** An instance assignment and a class assignment look similar but affect different namespaces. **Solve:** Marc finds his new instance value, `"Focus rider"`; Fabio and the class still return `"Practice result"`. No official time or position changed.

4. **Trace an inherited call.** Why does `marc.line()` contain `+0.701 s` even though `line` is defined only on `PracticeResult`? **Why this case?** It is the central dynamic-dispatch step. **Solve:** base `line()` runs with Marc as `self`; its `self.summary()` looks up `summary` on Marc's runtime class and reaches the child override. That override subtracts `88,725` from `89,426` milliseconds and divides `701` by `1000`.

5. **Tell nesting from inheritance.** Does `PracticeReport.Row` automatically receive the enclosing report object as `self`? **Why this case?** The dot in a nested class name can be mistaken for a parent-child relationship. **Solve:** no. `Row` is a class value stored in `PracticeReport`'s namespace. The report explicitly passes a result to `Row(result)`; each row stores that result in its **own** instance.

6. **Predict a slot error.** A plain `PracticeReport.Row` has `__slots__ = ("result",)`. What happens on `row.note = "focus"`, and why can `TaggedRow` store `note`? **Why this case?** It checks declared fields and the subclass rule. **Solve:** the plain row raises `AttributeError` because it has no `note` slot or instance dictionary. `TaggedRow` declares `__slots__ = ("note",)`, adding that field while inheriting `result`. `FlexibleRow`, which declares no slots, normally gains a dictionary instead.

7. **Separate data from a method.** For `marc.lap_ms` and `marc.line`, which lookup yields data and which yields a bound method? **Why this case?** Both use dot syntax but behave differently. **Solve:** `lap_ms` is the integer `89426` found on Marc's instance. `line` is a function found on `PracticeResult` and bound to Marc, so `marc.line()` supplies him as `self`. A missing dotted name raises `AttributeError`.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 2.5 idea | What to remember | Practice-report check |
| :--- | :--- | :--- |
| Namespace | A context maps names to objects; repeated spellings can name different values. | `summary` exists in both classes; `lap_ms` differs for Marc and Fabio. |
| Instance versus class | `self.name = ...` stores per-object data; class-body assignments and `def` create class entries. | Marc's five fields are in one instance; `line` is on the base class. |
| Class member | A class value is shared through lookup until an instance shadows it. | Marc's `DISPLAY_LABEL` can change without changing Fabio's or the class's. |
| Nested class | An inner class name belongs to an outer class namespace, without inheriting from it. | `PracticeReport.Row` stores a result passed by the report. |
| `__slots__` | Slotted instances can avoid a normal dictionary; a child declares only new slots to stay slotted. | `Row` has `result`; `TaggedRow` adds `note`. |
| Dynamic dispatch | Ordinary method lookup uses the actual object, including when inherited code calls `self.method()`. | Marc's and Fabio's `line()` calls reach gap-aware summaries. |

The rider, team, place, and best-lap facts come from the cited 2026 Indonesian GP Friday Practice classification. The referenced-result subclass, display label, and report rows are teaching tools. To predict any example, identify **the object**, **where the name was defined**, and **the runtime class used for the next method call**.

[🔝 Back to Top](#top)
