<span id="top"></span>

# 2.5 Namespaces and Object-Orientation — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.5, printed pages 96–100 (the supplied PDF).  
> **Topic:** 2.5 Namespaces and Object-Orientation; 2.5.1 Instance and Class Namespaces; 2.5.2 Name Resolution and Dynamic Dispatch.  
> **Domain Focus:** Rectangle cards, a 30 cm² material allowance, and card positions on a 12 cm display row.  
> **User Prompt:** Reexplain Section 2.5 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Card Workshop](#background)
   - [1. Recall the measurements and the row](#background-cards)
   - [2. Why names need homes](#background-names)
2. [Part 1: 2.5 Namespaces and Object-Orientation](#part-1)
   - [1. A namespace connects names to objects](#part-1-namespace)
   - [2. Separate local names from object attributes](#part-1-scope)
3. [Part 2: 2.5.1 Instance and Class Namespaces](#part-2)
   - [1. One tracked budget, three namespaces](#part-2-three)
   - [2. How assignments establish entries](#part-2-entries)
   - [3. Share a value through a class data member](#part-2-class-data)
   - [4. Nest a helper class for placements](#part-2-nested)
   - [5. Use `__slots__` for many small objects](#part-2-slots)
4. [Part 3: 2.5.2 Name Resolution and Dynamic Dispatch](#part-3)
   - [1. Trace ordinary attribute lookup](#part-3-lookup)
   - [2. See a method bind to an instance](#part-3-binding)
   - [3. Choose the method at runtime](#part-3-dispatch)
   - [4. Know the limits of the simple lookup model](#part-3-caveat)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Trace the output](#part-4-trace)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Card Workshop

<span id="background-cards"></span>

### 1. Recall the measurements and the row

Our earlier guides use three rectangular card sizes. Width and height are measured in centimetres; area is measured in square centimetres.

| Card | Width | Height | Area | Separate border length |
| :--- | ----: | -----: | ---: | ---------------------: |
| `A` | 2 cm | 3 cm | 6 cm² | 10 cm |
| `B` | 4 cm | 2 cm | 8 cm² | 12 cm |
| `C` | 4 cm | 4 cm | 16 cm² | 16 cm |

The workshop reserves `A`, `C`, and a second physical `A`. Together they use **6 + 16 + 6 = 28 cm²** of a **30 cm² material allowance**. A following request for `B` is refused because **28 + 8 = 36 cm²**. Their separate borders total **10 + 16 + 10 = 36 cm**.

The accepted cards can sit along a **12 cm wide, 4 cm high** display row with left edges at **0, 4, 8 cm**. They end at 2, 8, and 10 cm and do not overlap. An area allowance accounts for material; the row's width, height, and positions answer a different question about physical placement.

<span id="background-names"></span>

### 2. Why names need homes

In Section 2.4 we made `TrackedCardBudget` inherit from `CardBudget`. A tracked object has an area limit, a used area, a list of reserved cards, and a rejected-request count. Its **data belongs to that individual object**. Methods such as `reserve()` are defined on classes and can serve many objects.

The name `reserve` occurs in both classes: the parent defines the basic area check, and the child defines the version that also counts refusals. Python must know **which namespace owns each name** and **which definition a call should use**. This section explains those two questions with the same card workshop.

> **Mental model:** A namespace is a labeled set of names. An object keeps its own measurements; a class keeps behavior and shared values; lookup connects a dotted name to the right entry.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 2.5 Namespaces and Object-Orientation

<span id="part-1-namespace"></span>

### 1. A namespace connects names to objects

A **namespace** maps an identifier such as `_used_area` or `reserve` to an object or value in a particular scope. The mapped value need not be a number: functions, classes, and modules are objects too. When Python executes a class definition, the class name identifies a new class object in the surrounding namespace. A top-level class name enters the module namespace; a nested class name enters the outer class namespace.

```python
class Rectangle:
    UNIT = "cm"

    def area(self):
        return self._width * self._height
```

Here the `Rectangle` **class namespace** contains `UNIT` and `area` (among Python-created entries). `UNIT` refers to a string; `area` refers to a function. A specific rectangle's `_width` and `_height` will be **instance attributes** after its initializer assigns them. The book's opening definition of a namespace covers all of these mappings.

| Name | Where the example defines it | What it identifies |
| :--- | :--- | :--- |
| `Rectangle` | Module scope | The class object. |
| `UNIT` | `Rectangle` class body | The shared string `"cm"`. |
| `area` | `Rectangle` class body | A function used as a method. |
| `_width` | One rectangle instance | That rectangle's width. |

<span id="part-1-scope"></span>

### 2. Separate local names from object attributes

Section 1.10 introduced local and global names. This section adds **instance** and **class** namespaces. An initializer makes the difference visible:

```python
def __init__(self, width, height):
    self._width = width
    self._height = height
```

`width` and `height` on the right are local parameter names for this call. `self._width` and `self._height` on the left become attributes of this particular rectangle. When the call finishes, the local parameter names cease to be available in that call, but the rectangle keeps its attributes. Another rectangle has its own `_width` and `_height` entries, even if their numerical values happen to match.

Python commonly stores ordinary instance attributes in a per-object `__dict__`. The class also has a namespace, exposed for inspection by its `__dict__` mapping. We will examine normal instance dictionaries first and then see how `__slots__` changes storage for small helper objects.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 2.5.1 Instance and Class Namespaces

<span id="part-2-three"></span>

### 1. One tracked budget, three namespaces

The book's Figure 2.8 places a parent class, a child class, and one child instance side by side. Its credit-card instance has **one instance namespace** containing both fields initialized by `CreditCard` and the added annual-rate field initialized by `PredatoryCreditCard`. The parent and child each have their own class namespace and can each define a method named `charge`.

Our geometry analogue is a `TrackedCardBudget(30)` after reserving `A`, `C`, `A` and refusing `B`:

| Namespace | Selected names defined there | Meaning |
| :--- | :--- | :--- |
| This tracked **instance** | `_area_limit = 30`, `_used_area = 28`, `_cards`, `_rejected_attempts = 1` | State belonging to this one budget, including parent-initialized and child-initialized fields. |
| `TrackedCardBudget` **class** | `__init__`, overriding `reserve`, `rejection_count` | Behavior supplied specifically by the child class. |
| `CardBudget` **class** | `__init__`, basic `reserve`, `used_area`, `total_border` | Behavior available to ordinary budgets and inherited by tracked budgets. |

The child object does **not** have a separate parent-instance namespace. Both initializers assign fields to the same `self`. It may have the same 28 cm² used area as another budget, but each object still holds its own state.

For an ordinary unslotted instance, `vars(tracked)` lets us inspect its current attribute dictionary. `CardBudget.__dict__` and `TrackedCardBudget.__dict__` show what each class defines directly; inherited methods are found through lookup rather than copied into the child class's dictionary.

<span id="part-2-entries"></span>

### 2. How assignments establish entries

The location of an assignment matters:

```python
class CardBudget:
    AREA_UNIT = "cm^2"       # class namespace

    def __init__(self, area_limit):  # function in class namespace
        self._area_limit = area_limit  # one instance namespace
        self._used_area = 0           # the same instance namespace
        self._cards = []              # a new list for this instance
```

`AREA_UNIT` is assigned directly in the class body, so it becomes a **class data member**. The `def` statement also places a function named `__init__` in that class. When an instance is created, each `self.name = value` assignment stores a value for that instance. The new list `[]` is created on every initializer call, so two budgets do not accidentally share one reservation list.

The subclass's `super().__init__(area_limit)` uses that parent initializer with the **same child instance** as `self`; afterward `self._rejected_attempts = 0` adds one more field to that instance. This is why all four fields in the table above live together.

<span id="part-2-class-data"></span>

### 3. Share a value through a class data member

The book moves a fixed $5 rejected-charge fee into `PredatoryCreditCard.OVERLIMIT_FEE`, a class member shared by its instances. Our row has a similar shared default: its ruler marks are normally **4 cm** apart.

```python
class DisplayRow:
    default_mark_step_cm = 4

    def ruler_marks(self):
        return list(range(0, self._width_cm, self.default_mark_step_cm))
```

For a 12 cm row, the default marks are **0, 4, 8 cm**. `DisplayRow.default_mark_step_cm` is one value in the class namespace, not a separate copy in every row. Reading `row.default_mark_step_cm` finds that class value when the row has no attribute of its own with that name.

An assignment through one ordinary instance changes the lookup for **that instance**:

```python
dense_row = DisplayRow(12, 4)
dense_row.default_mark_step_cm = 3
```

Now `dense_row` has its own `default_mark_step_cm = 3`, so its marks are 0, 3, 6, 9 cm. The class value remains 4, and another row still uses 0, 4, 8 cm. This is **shadowing**, not a change to the class default. For a policy intended never to vary by instance, use a clearly named constant such as `AREA_UNIT` and avoid assigning a same-named instance field. Also avoid a mutable list as a shared class default unless sharing that single list is intended.

<span id="part-2-nested"></span>

### 4. Nest a helper class for placements

The book next defines a class inside another class. The inner class name enters the **outer class namespace**; nesting says where the helper belongs, not what it inherits from. The book uses this idea later for different node types in linked lists and trees.

Our `DisplayRow` can own a small `Placement` helper:

```python
class DisplayRow:
    class Placement:
        def __init__(self, label, card, left_cm):
            self.label = label
            self.card = card
            self.left_cm = left_cm

    def add(self, label, card, left_cm):
        placement = self.Placement(label, card, left_cm)
        # Validate and then store this placement.
```

The name `Placement` is found as `DisplayRow.Placement`. The `self.Placement` access in `add()` finds that class through the row's class namespace. A placement **is not** a `DisplayRow`; it is a small object that the row **uses**. `DisplayRow` and some other layout class can each define a nested `Placement` without a naming collision at module scope.

<span id="part-2-slots"></span>

### 5. Use `__slots__` for many small objects

Normally, each `Placement` could hold its fields in an instance dictionary. If a layout had very many simple placements, the dictionary overhead might matter. The book introduces `__slots__` as a way to declare the allowed instance-attribute names and avoid that dictionary for a suitable class:

```python
class DisplayRow:
    class Placement:
        __slots__ = ("label", "card", "left_cm")

        def __init__(self, label, card, left_cm):
            self.label = label
            self.card = card
            self.left_cm = left_cm
```

The placement still has three **per-instance values**. They are stored through slots rather than a normal instance `__dict__`. On this class, assigning an undeclared field such as `placement.color = "blue"` raises `AttributeError`. Slots do not freeze the allowed values: `placement.left_cm` could still be changed. For a row that checks non-overlap when placing cards, changing a saved position later would require another validation step; our program leaves placements in place.

If we inherit from this slotted helper and want the child to remain without a normal instance dictionary, the child declares **only its new instance attributes**:

```python
class AnnotatedPlacement(DisplayRow.Placement):
    __slots__ = ("note",)
```

An `AnnotatedPlacement` can use the inherited `label`, `card`, and `left_cm` slots and its new `note` slot. The trailing comma makes `("note",)` a one-item tuple. If this child omits `__slots__`, its instances normally gain a dictionary; if the base already has a dictionary, child slots cannot remove it. Slots list **data attributes**, not methods. See the [Python data model's `__slots__` rules](https://docs.python.org/3/reference/datamodel.html#object.__slots__). We use slots only for the lightweight nested helper, keeping the ordinary budgets easy to inspect and extend.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 2.5.2 Name Resolution and Dynamic Dispatch

<span id="part-3-lookup"></span>

### 1. Trace ordinary attribute lookup

The book gives a useful simple path for `obj.name` in the kind of classes we have written: look for an instance entry, then an entry in the object's actual class, then in its parent classes; if no entry exists, raise `AttributeError`. In a multiple-inheritance hierarchy, the parent search follows Python's method-resolution order.

With `tracked = TrackedCardBudget(30)`, these names resolve in different places:

| Expression | Where its name is found | What it means |
| :--- | :--- | :--- |
| `tracked._used_area` | `tracked` instance | The current material area, 28 cm² after the three reservations. |
| `tracked.rejection_count()` | `TrackedCardBudget` class | A method added by the child. |
| `tracked.used_area()` | `CardBudget` class | A method inherited from the parent. |
| `tracked.reserve(card)` | `TrackedCardBudget` class | The child's overriding method. |
| `tracked.missing_name` | Nowhere in this hierarchy | Raises `AttributeError`. |

The first line is **data**, not a method. The three callable entries are methods. Looking up `reserve` on a plain `CardBudget` would find the parent's version, while looking it up on a `TrackedCardBudget` finds the child's version first.

<span id="part-3-binding"></span>

### 2. See a method bind to an instance

The class body stores a function. When we access it through an instance, Python supplies that instance as the method's `self`:

```python
tracked.used_area()             # usual bound-method call
CardBudget.used_area(tracked)   # equivalent for this ordinary instance method
```

Both calls return 28 after `A`, `C`, `A`. The function definition is shared, while the `self` argument chooses whose `_used_area` to read. We do not need one copy of `used_area()` in every budget's instance dictionary.

<span id="part-3-dispatch"></span>

### 3. Choose the method at runtime

**Dynamic dispatch** means the actual object's class determines which implementation of an overridden method is used when the program runs. This helper calls `reserve` without knowing which budget class it receives:

```python
def try_extra_card(budget, card):
    return budget.reserve(card)
```

If `budget` refers to a plain `CardBudget`, `reserve()` performs the area check. If it refers to a `TrackedCardBudget`, the child's `reserve()` runs, asks `super().reserve(card)` to perform that same check, and counts a refusal. After `A`, `C`, `A`, each budget rejects `B` and stays at **28 cm²**; only the tracked one records **one failed request**.

The call is selected from the **runtime object**, not from the parameter name `budget`. The subclass method must return the parent's `True` or `False` result so callers of `try_extra_card()` see the same contract. Calling `self.reserve(card)` inside the override would call the override again; `super().reserve(card)` deliberately continues to the parent implementation.

<span id="part-3-caveat"></span>

### 4. Know the limits of the simple lookup model

The book's instance → class → ancestors path is a teaching model for **ordinary attributes and methods**. Python has extra rules: properties and slot descriptors can take precedence over an instance dictionary, custom `__getattribute__` can change lookup, and multiple inheritance uses a defined method-resolution order. Our budget lookup table uses ordinary fields and methods, so the simple path predicts it correctly. The [Python descriptor guide](https://docs.python.org/3/howto/descriptor.html) explains the fuller rules.

> **Mental model:** The same dotted spelling, `budget.reserve(card)`, can reach different class functions because `budget` can refer to different kinds of objects.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

Save this as `namespace_geometry.py` and run it with `python namespace_geometry.py`. It creates a plain budget and a tracked budget, places the accepted cards on a row, and inspects where selected names are defined.

```python
class Rectangle:
    UNIT = "cm"

    def __init__(self, width, height):
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


class CardBudget:
    AREA_UNIT = "cm^2"

    def __init__(self, area_limit):
        if area_limit <= 0:
            raise ValueError("area limit must be positive")
        self._area_limit = area_limit
        self._used_area = 0
        self._cards = []

    def used_area(self):
        return self._used_area

    def card_count(self):
        return len(self._cards)

    def total_border(self):
        return sum(card.perimeter() for card in self._cards)

    def reserve(self, card):
        area = card.area()
        if self._used_area + area > self._area_limit:
            return False
        self._cards.append(card)
        self._used_area += area
        return True


class TrackedCardBudget(CardBudget):
    def __init__(self, area_limit):
        super().__init__(area_limit)
        self._rejected_attempts = 0

    def reserve(self, card):
        success = super().reserve(card)
        if not success:
            self._rejected_attempts += 1
        return success

    def rejection_count(self):
        return self._rejected_attempts


class DisplayRow:
    default_mark_step_cm = 4

    class Placement:
        __slots__ = ("label", "card", "left_cm")

        def __init__(self, label, card, left_cm):
            self.label = label
            self.card = card
            self.left_cm = left_cm

        def right_cm(self):
            return self.left_cm + self.card.width()

    def __init__(self, width_cm=12, height_cm=4):
        if not isinstance(width_cm, int):
            raise TypeError("row width must be a whole number of centimetres")
        if width_cm <= 0 or height_cm <= 0:
            raise ValueError("row dimensions must be positive")
        self._width_cm = width_cm
        self._height_cm = height_cm
        self._placements = []

    def add(self, label, card, left_cm):
        if left_cm < 0 or left_cm + card.width() > self._width_cm:
            raise ValueError("card exceeds row width")
        if card.height() > self._height_cm:
            raise ValueError("card exceeds row height")
        for placed in self._placements:
            overlaps = left_cm < placed.right_cm() and placed.left_cm < left_cm + card.width()
            if overlaps:
                raise ValueError("cards overlap")
        self._placements.append(self.Placement(label, card, left_cm))

    def spans(self):
        return [(p.label, p.left_cm, p.right_cm()) for p in self._placements]

    def ruler_marks(self):
        step = self.default_mark_step_cm
        if not isinstance(step, int) or step <= 0:
            raise ValueError("mark step must be a positive whole number")
        return list(range(0, self._width_cm, step))

    def first_placement(self):
        return self._placements[0]


def try_extra_card(budget, card):
    return budget.reserve(card)


def main():
    sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
    plain = CardBudget(30)
    tracked = TrackedCardBudget(30)
    row = DisplayRow(12, 4)

    for label, left_cm in (("A", 0), ("C", 4), ("A", 8)):
        card = Rectangle(*sizes[label])
        plain.reserve(Rectangle(*sizes[label]))
        tracked.reserve(card)
        row.add(label, card, left_cm)

    plain_result = try_extra_card(plain, Rectangle(*sizes["B"]))
    tracked_result = try_extra_card(tracked, Rectangle(*sizes["B"]))

    dense_row = DisplayRow(12, 4)
    dense_row.default_mark_step_cm = 3

    print("Tracked instance fields:", sorted(vars(tracked)))
    print("reserve in child class:", "reserve" in TrackedCardBudget.__dict__)
    print("used_area in child class:", "used_area" in TrackedCardBudget.__dict__)
    print("Parent method result:", tracked.used_area(), CardBudget.AREA_UNIT)
    print("Plain B accepted:", plain_result)
    print("Tracked B accepted:", tracked_result)
    print("Tracked rejections:", tracked.rejection_count())
    print("Tracked card count:", tracked.card_count())
    print("Separate borders:", tracked.total_border(), Rectangle.UNIT)
    print("Row spans:", row.spans())
    print("Default ruler marks:", row.ruler_marks())
    print("Dense ruler marks:", dense_row.ruler_marks())
    print("Class step stays:", DisplayRow.default_mark_step_cm, Rectangle.UNIT)
    print("Nested helper:", DisplayRow.Placement.__qualname__)
    print("Placement has a dictionary:", hasattr(row.first_placement(), "__dict__"))


if __name__ == "__main__":
    main()
```

The two budgets simulate the **same request sequence for comparison**; they do not represent a second cutting order. Each budget starts with a separate `_cards` list. The tracked budget and row refer to the **same three card objects**; the plain budget uses separate cards with the same dimensions for comparison. The row's `Placement` objects hold a label, a card reference, and a left edge. `DisplayRow.add()` checks the row's width and height and rejects horizontal overlap for cards placed along the same bottom edge. Its ruler marks use whole-centimetre steps and describe positions but do not automatically place the cards.

<span id="part-4-trace"></span>

### 2. Trace the output

| Action | Namespace or method involved | Geometry result |
| :--- | :--- | :--- |
| Construct `tracked` | Parent and child initializers assign to one instance. | Limit 30 cm², used area 0, rejection count 0. |
| Reserve `A`, `C`, `A` | Child `reserve` delegates to parent `reserve`. | Used area 28 cm²; three physical cards. |
| Attempt `B` on both budgets | Runtime type selects each `reserve` implementation. | Both refuse 36 cm²; only tracked counts the refusal. |
| Place accepted cards | Nested `DisplayRow.Placement` stores each position. | Horizontal spans `[0, 2]`, `[4, 8]`, `[8, 10]` cm. |
| Read class default through rows | `row` uses class step 4; `dense_row` shadows it with 3. | Ruler marks 0, 4, 8 versus 0, 3, 6, 9 cm. |

Running the program prints:

```text
Tracked instance fields: ['_area_limit', '_cards', '_rejected_attempts', '_used_area']
reserve in child class: True
used_area in child class: False
Parent method result: 28 cm^2
Plain B accepted: False
Tracked B accepted: False
Tracked rejections: 1
Tracked card count: 3
Separate borders: 36 cm
Row spans: [('A', 0, 2), ('C', 4, 8), ('A', 8, 10)]
Default ruler marks: [0, 4, 8]
Dense ruler marks: [0, 3, 6, 9]
Class step stays: 4 cm
Nested helper: DisplayRow.Placement
Placement has a dictionary: False
```

The output says `used_area` is **not directly defined** in `TrackedCardBudget.__dict__`, yet `tracked.used_area()` works because Python finds the parent method. It says the placement has no normal `__dict__` because its class uses slots; its `label`, `card`, and `left_cm` values still belong to that individual placement.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Do two tracked budgets share one area total?</strong></summary>

**Scenario:** One tracked budget reserves `A` and another newly constructed tracked budget reserves nothing.

**Problem:** If `_used_area` were shared class data, the second budget might incorrectly report 6 cm².

**Fix:** Each `CardBudget.__init__` call assigns `self._used_area = 0` and `self._cards = []` to the new object. The child also initializes its own `_rejected_attempts` on that object.

**Result:** The first budget reports 6 cm² used; the second reports 0 cm². They share the method definitions, not their measurements or reservation lists.

</details>

<details>
<summary><strong>Case Study 2: Where does an inherited method live?</strong></summary>

**Scenario:** `tracked.used_area()` returns 28 cm².

**Problem:** The `TrackedCardBudget` class body does not define `used_area()`.

**Fix:** Attribute lookup finds `used_area` in the parent `CardBudget` class and binds the current `tracked` object as `self`.

**Result:** One parent function reads the correct 28 cm² from the child object's instance state; no method copy is placed in each instance.

</details>

<details>
<summary><strong>Case Study 3: Can one row use a closer ruler grid?</strong></summary>

**Scenario:** The ordinary 12 cm row has marks 0, 4, 8 cm; another row needs marks every 3 cm.

**Problem:** Changing `DisplayRow.default_mark_step_cm` would affect all rows that rely on the class default.

**Fix:** Assign `dense_row.default_mark_step_cm = 3` to that one unslotted row. Its instance entry shadows the class entry.

**Result:** The dense row has marks 0, 3, 6, 9 cm; the class default remains 4 cm and the ordinary row remains 0, 4, 8 cm.

</details>

<details>
<summary><strong>Case Study 4: Is a placement a kind of display row?</strong></summary>

**Scenario:** A row stores a card's label and left edge in a `DisplayRow.Placement` object.

**Problem:** The class name is nested under `DisplayRow`, which could be mistaken for inheritance.

**Fix:** Read the two relationships separately: `DisplayRow.Placement` is a name in the row class's namespace; a row **contains** placement instances. `Placement` does not inherit from `DisplayRow`.

**Result:** The helper has an unambiguous name and can store `A` at 0 cm without pretending to be a row.

</details>

<details>
<summary><strong>Case Study 5: What does a slotted placement allow?</strong></summary>

**Scenario:** Many rows might contain many lightweight placements.

**Problem:** A dictionary for every placement can use extra memory, but the object needs `label`, `card`, and `left_cm` values.

**Fix:** The nested class declares `__slots__ = ("label", "card", "left_cm")`. An annotated subclass would declare only an additional `("note",)` slot.

**Result:** Each placement retains its own three values without a normal instance dictionary. Assigning an undeclared `color` field raises `AttributeError`; declared fields can still be changed.

</details>

<details>
<summary><strong>Case Study 6: Why does the same helper call behave differently?</strong></summary>

**Scenario:** `try_extra_card(budget, B)` runs once with a plain budget and once with a tracked budget, each already at 28 cm².

**Problem:** Both should reject the extra 8 cm² card, but only the tracked budget should record the failed request.

**Fix:** Python resolves `budget.reserve` using the actual object's class at runtime. The tracked override calls the parent method through `super()` and then increments its own counter on `False`.

**Result:** Both calls return `False` and preserve 28 cm² used area; the tracked rejection count becomes 1.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 2.5 idea | Plain-language meaning | Geometry study case |
| :--- | :--- | :--- |
| **Namespace** | A scope maps names to objects, including functions and classes. | `DisplayRow` identifies a class; its `default_mark_step_cm` identifies 4. |
| **Instance namespace** | Each object stores its own ordinary state. | One tracked budget stores 28 cm² used and one rejected request. |
| **Class namespace** | A class stores methods and shared values. | `CardBudget` owns `used_area`; `DisplayRow` owns the 4 cm default step. |
| **Inheritance and one instance** | Parent and child initializers can assign fields to the same child object. | One tracked budget holds `_used_area` and `_rejected_attempts`. |
| **Class data member** | A value defined in a class body can be read by its instances. | A row uses the shared 4 cm ruler-mark default. |
| **Nested class** | A helper class is named inside another class without inheriting from it. | `DisplayRow.Placement` stores a card's position. |
| **`__slots__`** | Declared instance fields can be stored without a normal per-instance dictionary. | A small placement stores only its label, card, and left edge. |
| **Name resolution** | Dotted access finds a name on the object or along its class hierarchy. | `tracked.used_area()` finds the parent method. |
| **Dynamic dispatch** | The actual object's class selects an overridden method at runtime. | Only `TrackedCardBudget.reserve()` counts a refused `B`. |

[🔝 Back to Top](#top)
