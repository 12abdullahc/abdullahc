<span id="top"></span>

# 2.7 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.7, printed pages 103–107 (the supplied PDF).  
> **Topic:** Reinforcement exercises R-2.1–R-2.23; Creativity exercises C-2.24–C-2.32; Projects P-2.33–P-2.39.  
> **Domain Focus:** Rectangular cards, a 30 cm² material allowance, a 12 cm display row, coordinate vectors, and polygon measurements.  
> **User Prompt:** Reexplain Section 2.7 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Exercises as Small Design Problems](#background)
   - [1. Keep the card workshop in view](#background-workshop)
   - [2. Read the three exercise groups](#background-groups)
2. [Part 1: Reinforcement — Design and State, R-2.1–R-2.8](#part-1)
   - [1. Software goals and interfaces, R-2.1–R-2.3](#part-1-design)
   - [2. A class and guarded state, R-2.4–R-2.7](#part-1-state)
   - [3. A precise credit-limit test, R-2.8](#part-1-test)
3. [Part 2: Reinforcement — Vectors and Ranges, R-2.9–R-2.16](#part-2)
   - [1. Vector operations, R-2.9–R-2.15](#part-2-vector)
   - [2. Count positions in a range, R-2.16](#part-2-range)
4. [Part 3: Reinforcement — Hierarchies and Sequences, R-2.17–R-2.23](#part-3)
   - [1. Choose a class hierarchy, R-2.17](#part-3-hierarchy)
   - [2. Trace progressions, R-2.18–R-2.19](#part-3-progressions)
   - [3. Judge hierarchy depth and compare sequences, R-2.20–R-2.23](#part-3-sequences)
5. [Part 4: Creativity — Combine Behaviors, C-2.24–C-2.30](#part-4)
   - [1. Design a reader and extend vector multiplication, C-2.24–C-2.25](#part-4-design)
   - [2. Iterate backward and test membership, C-2.26–C-2.27](#part-4-iteration)
   - [3. Add monthly rules and an internal update method, C-2.28–C-2.30](#part-4-credit)
6. [Part 5: Creativity — New Progressions, C-2.31–C-2.32](#part-5)
7. [Part 6: Projects — Complete Systems, P-2.33–P-2.39](#part-6)
   - [1. Polynomial and document tools, P-2.33–P-2.34](#part-6-tools)
   - [2. Message, river, and reader simulations, P-2.35–P-2.38](#part-6-systems)
   - [3. A polygon hierarchy, P-2.39](#part-6-polygons)
8. [Part 7: One Connected Geometry Program](#part-7)
   - [1. The complete program](#part-7-program)
   - [2. Trace the output](#part-7-trace)
9. [Part 8: Simple Geometry Study Cases](#part-8)
10. [Part 9: Summary](#part-9)

---

<span id="background"></span>

## Background & Conceptual Intuition: Exercises as Small Design Problems

<span id="background-workshop"></span>

### 1. Keep the card workshop in view

The earlier guides used these rectangular cards. Widths and heights are in centimetres.

| Card | Width | Height | Area | Separate border |
| :--- | ----: | -----: | ---: | --------------: |
| `A` | 2 cm | 3 cm | 6 cm² | 10 cm |
| `B` | 4 cm | 2 cm | 8 cm² | 12 cm |
| `C` | 4 cm | 4 cm | 16 cm² | 16 cm |

Our running plan selects **`A₁`, `C`, `A₂`**: two distinct physical cards of size `A` and one of size `C`. Their total area is **28 cm²**, within a **30 cm² material allowance**; their separate borders total **36 cm**. On a **12 cm by 4 cm** row, place their left edges at **0, 4, and 8 cm**. Their horizontal spans are **[0, 2]**, **[4, 8]**, and **[8, 10] cm**, so they fit without overlap. Adding `B` would propose **36 cm²** of material and must be rejected. Material allowance and position on the row are separate questions.

<span id="background-groups"></span>

### 2. Read the three exercise groups

Section 2.7 contains **39 prompts**, in the book's order: 23 Reinforcement exercises, 9 Creativity exercises, and 7 Projects. They revisit Sections 2.1–2.6. The prompts in the PDF are **material to explain**; the geometry cases below are extra practice and do not replace the original tasks. In particular, a credit-card exercise still concerns money, and a river exercise still concerns animals.

For each prompt, ask three questions: **What state must the objects hold? What operation changes or reads that state? What invariant or boundary must remain true?** In the card workshop, a card holds dimensions, a budget records accepted area, and an attempted addition cannot take accepted area above 30 cm².

| Book group | Main kind of work | Workshop connection |
| :--- | :--- | :--- |
| Reinforcement | Explain, trace, or make one focused change. | Check a card's state, a position vector, or a ruler sequence. |
| Creativity | Combine methods and define edge behavior. | Add a rule for planning or iterating over placements. |
| Projects | Design a working system with several parts. | Build a tool for measuring shapes or communicating a plan. |

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement — Design and State, R-2.1–R-2.8

<span id="part-1-design"></span>

### 1. Software goals and interfaces, R-2.1–R-2.3

**R-2.1 — Correctness.** The book asks for three software applications in which a defect could put human life at risk. Think of aircraft control, medical dosing, or emergency dispatch. The point is to connect a software **goal** to the cost of a wrong result. Our card program has a smaller consequence, but a wrong area formula could still make the class cut too much material. State the expected behavior, such as `2 × 3 = 6 cm²`, before testing it.

**R-2.2 — Adaptability.** The book asks for an application whose commercial success depends on adapting over time. A drawing or CAD application is a plausible case: new file formats, devices, and customer workflows change its requirements. In the workshop, a `Rectangle` can later become one member of a wider `Shape` family. A design with clear interfaces makes that extension easier. A specific commercial example needs a reason why change matters to its users.

**R-2.3 — Encapsulation.** The original task is to describe a component of a text editor's graphical interface and the methods it would offer. A text area, for example, might expose `insert`, `delete`, and `select` while holding the cursor and selection state inside. For geometry practice, picture a drawing canvas with `add_card`, `move_card`, and `draw`; callers need those actions, not direct access to every internal coordinate.

<span id="part-1-state"></span>

### 2. A class and guarded state, R-2.4–R-2.7

**R-2.4 — A simple class.** Implement the book's `Flower` with a name (`str`), number of petals (`int`), and price (`float`), including a constructor and methods that read and change those fields. A parallel workshop `Card` could hold a label, width, and height. In either class, decide what values are valid: a negative petal count or negative width should not become ordinary state.

**R-2.5 — Check numeric input.** Modify the book's `CreditCard` so `charge` and `make_payment` receive sensible numeric amounts. A workshop `CardBudget.add_area` similarly needs a numeric area before comparing it with its limit. The check belongs at the operation that receives the value; otherwise an invalid value can enter the object.

**R-2.6 — Reject a negative payment.** The book specifically requires `make_payment` to raise `ValueError` for a negative amount. This matters because subtracting a negative payment would increase debt. In the workshop, `release_area(-8)` would have the same sign mistake: a release operation should reject negative input rather than silently add 8 cm².

**R-2.7 — Optional opening balance.** Add a fifth, optional constructor parameter to `CreditCard` for its initial balance. Existing four-argument calls must still begin at zero. The parallel `CardBudget(limit, used=0)` starts with no material used unless a caller supplies a valid initial amount. A default argument keeps old callers working while extending the class.

<span id="part-1-test"></span>

### 3. A precise credit-limit test, R-2.8

**R-2.8 — Make exactly one card attempt an over-limit charge.** The book asks for a change to the first test loop in Code Fragment 2.3. Its three limits are 2500, 3500, and 5000; iteration `j` attempts charges of `j`, `2j`, and `3j`. One valid change is `range(1, 59)`, which tries `j = 1` through `58`.

At `j = 58`, the third card has previously accepted `3(1 + 2 + ⋯ + 57) = 4959`; its proposed new balance is **5133**, above 5000. The first two proposed balances are **1711** and **3422**, below their limits. Thus **only the third card attempts** an over-limit charge. Its stored balance does **not** exceed 5000, because `charge` rejects that attempt. This distinction is the same one we use when `B` proposes 36 cm² but the workshop keeps its accepted total at 28 cm².

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement — Vectors and Ranges, R-2.9–R-2.16

<span id="part-2-vector"></span>

### 1. Vector operations, R-2.9–R-2.15

A **vector** can record a move as `(horizontal, vertical)`. Moving from one card position to the next might use `u = (4, 0)` cm. A one-centimetre upward move is `v = (0, 1)` cm. Vector arithmetic acts on corresponding coordinates; all vectors in an operation must have the same dimension.

| Exercise | Original task | Small geometry check |
| :--- | :--- | :--- |
| **R-2.9** | Add `Vector.__sub__` for `u - v`. | `(4, 0) - (0, 1) = (4, -1)`. Return a new vector. |
| **R-2.10** | Add `Vector.__neg__` for `-u`. | The reverse of `(4, 0)` is `(-4, 0)`. |
| **R-2.11** | Support a list on the left of `+`, as in `[5, 3, 10, -2, 1] + u`. | `Vector.__radd__` receives the list after its own addition cannot handle the vector. Use a five-coordinate vector here. |
| **R-2.12** | Make `v * 3` scale a vector through `__mul__`. | `(4, 0) * 3 = (12, 0)`. |
| **R-2.13** | Make `3 * v` work through `__rmul__`. | `3 * (4, 0) = (12, 0)`. Operand order selects the reflected method. |
| **R-2.14** | Make `u * v` produce a dot product. | `(4, 0) · (0, 1) = 0`, a **scalar**, not a vector. |
| **R-2.15** | Accept either an integer dimension or an iterable of coordinates in `Vector`'s constructor. | `Vector(2)` starts as `(0, 0)`; `Vector([4, 0])` starts with those coordinates. Copy iterable values into the vector's own storage. |

The original Vector class begins with one meaning for `*` in each exercise. Later **C-2.25** asks how to support both meanings together. A new vector is appropriate for subtraction, negation, and scaling; a number is appropriate for the dot product. The list example in R-2.11 has **five** coordinates, so it cannot be added to a two-dimensional workshop move without first choosing a compatible example.

<span id="part-2-range"></span>

### 2. Count positions in a range, R-2.16

**R-2.16 — Explain the length formula for `Range`.** For a **positive** step, the book's formula is

```text
length = max(0, (stop - start + step - 1) // step)
```

It counts integers `start + k·step` with `k ≥ 0` that remain **strictly below** `stop`. The added `step - 1` makes integer division round a positive partial step upward. For the card row, `Range(0, 12, 4)` gives **0, 4, 8**, so its length is `(12 - 0 + 4 - 1) // 4 = 3`. Position 12 is excluded. This particular formula assumes a positive step; a negative-step range needs different bounds and counting logic.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Reinforcement — Hierarchies and Sequences, R-2.17–R-2.23

<span id="part-3-hierarchy"></span>

### 1. Choose a class hierarchy, R-2.17

**R-2.17 — Draw the requested animal hierarchy.** The book specifies that `Goat`, `Pig`, and `Horse` extend `object`, while `Racer` and `Equestrian` extend `Horse`. Keep those relationships and each class's own fields and methods in the requested diagram:

```text
object
├── Goat              tail; milk(), jump()
├── Pig               nose; eat(food), wallow()
└── Horse             height, color; run(), jump()
    ├── Racer         race()
    └── Equestrian    weight; trot(), is_trained()
```

The same design question appears in geometry:

```text
Polygon
└── Quadrilateral
    └── Rectangle
        └── Square
```

A `Rectangle` can know width, height, area, and perimeter. A `Square` adds the rule **width = height**. If setters can change width or height independently, the subclass must preserve that rule or the hierarchy becomes misleading.

<span id="part-3-progressions"></span>

### 2. Trace progressions, R-2.18–R-2.19

**R-2.18 — Generalized Fibonacci.** With the book's initial pair **2, 2**, each later value is the sum of the previous two. Number the emitted values: `1: 2`, `2: 2`, `3: 4`, `4: 6`, `5: 10`, `6: 16`, `7: 26`, `8: 42`. The **eighth** value is **42**. The workshop can use such a sequence as labels for increasingly large *sample* plans; these values are separate from the fixed 12 cm row.

**R-2.19 — Arithmetic progression and a large boundary.** The progression starts at **0** and grows by **128 = 2⁷**. Its values are `128k` for `k = 0, 1, 2, …`. The first value at least **2⁶³** occurs when `k = 2⁵⁶`. Therefore **2⁵⁶ calls** to `next` return values below 2⁶³, and call **2⁵⁶ + 1** first returns 2⁶³. For a smaller ruler analogy, a progression `0, 4, 8, 12, …` has three values below 12; its fourth call returns 12. Count calls from the first emitted value, not from the first increment.

<span id="part-3-sequences"></span>

### 3. Judge hierarchy depth and compare sequences, R-2.20–R-2.23

**R-2.20 — Too many inheritance levels.** The book asks about possible efficiency disadvantages of a deep hierarchy. Several layers of constructors or overrides may add calls and make behavior harder to follow. A long chain from `Polygon` through many specialized intermediate shapes can put area logic far from the object that uses it. The precise runtime cost depends on the methods actually called; hierarchy depth alone is not a measured running time.

**R-2.21 — Too few inheritance levels.** A very shallow hierarchy can duplicate methods in siblings or force a large parent to inspect every shape's type. If `Rectangle`, `Square`, and other shapes each repeat common perimeter or drawing logic, future changes require edits in several places. Choose layers that express genuinely shared behavior.

**R-2.22 — Sequence equality.** Extend the book's `Sequence` class from Code Fragment 2.14 with `__eq__`: first compare lengths, then corresponding elements. Workshop ruler marks `[0, 4, 8]` equal another sequence with those values, even when the sequences are distinct objects. Equality means matching contents here, not shared identity.

**R-2.23 — Sequence ordering.** Add `__lt__` with **lexicographic** order: compare the first differing elements; if all compared elements match, the shorter sequence comes first. Thus `[0, 4, 8] < [0, 4, 10]`, and `[0, 4] < [0, 4, 8]`. The card row's position list is a concrete sequence to compare.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Creativity — Combine Behaviors, C-2.24–C-2.30

<span id="part-4-design"></span>

### 1. Design a reader and extend vector multiplication, C-2.24–C-2.25

**C-2.24 — E-book reader design.** The original prompt asks for a class design and inheritance diagram for an electronic book reader that can buy, list, and read books; it does **not** require implementation yet. Identify objects such as a catalog, a user's library, and a reading view, then decide which relationships are inheritance and which are ordinary references. A workshop analogy is a card catalog, a selected card plan, and a display view. A catalog is **held by** a planner; it is not a specialized planner.

**C-2.25 — Two meanings of `*`.** Combine scalar multiplication and dot product in one `Vector.__mul__`. Check the other operand's kind: `(2, 3) * 3 = (6, 9)` is a vector, while `(2, 3) * (4, 2) = 14` is a scalar. For a type this class cannot handle, return `NotImplemented` so Python can try an appropriate reflected operation. The corresponding `__rmul__` supports `3 * v`.

<span id="part-4-iteration"></span>

### 2. Iterate backward and test membership, C-2.26–C-2.27

**C-2.26 — Reverse iterator.** Implement `ReversedSequenceIterator` for a sequence: begin at the last valid index, return one item per `next`, and raise `StopIteration` when no items remain. For the row's left edges `[0, 4, 8]`, iteration gives **8, 4, 0**. Starting at `len(sequence) - 1` also handles an empty sequence: its first call stops immediately.

**C-2.27 — Fast `Range.__contains__`.** The book wants membership without visiting every value. For an integer candidate `x` in a positive-step range, check `start ≤ x < stop` and `(x - start) % step == 0`. Hence **8 is** in `Range(0, 12, 4)` but **6 is not**. If you extend the book's `Range` to support negative steps, fix its length and indexing logic too, then reverse the membership bounds (`stop < x ≤ start`). An empty range contains nothing. State how noninteger candidates should be handled if matching Python's built-in `range` behavior matters. The integer test takes constant time relative to the range's length.

<span id="part-4-credit"></span>

### 3. Add monthly rules and an internal update method, C-2.28–C-2.30

**C-2.28 — Extra charge after ten calls.** Extend `PredatoryCreditCard` so every `charge` call **after the tenth in a month** incurs an additional **$1** surcharge, then reset the count for a new month. Count a rejected charge too: the rule concerns **calls**, not successful purchases. State when the month changes. A workshop rehearsal could count card requests in a planning session, but the actual exercise's fee and balance remain financial quantities.

**C-2.29 — Minimum payment.** Set a monthly minimum as a percentage of the credit-card balance and add a late fee if that minimum has not been paid by the next month. Track the amount paid toward the requirement, the month boundary, and when the fee is applied. A geometry quota can help rehearse the state machine, but square centimetres are not dollars; keep the book's payment rule in money.

**C-2.30 — An internal balance setter.** Add `_set_balance(b)` to `CreditCard` and have `PredatoryCreditCard` use it instead of writing `_balance` directly. This gives the parent one place to validate balance changes. The leading underscore signals an internal-use convention in Python; it is not enforced privacy. A card budget could similarly use `_set_used_area` to centralize checks for its 30 cm² rule.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Creativity — New Progressions, C-2.31–C-2.32

**C-2.31 — Successive absolute differences.** Design a `Progression` whose first two emitted values default to **2** and **200**; every later value is the absolute difference of the previous two. With smaller study seeds **2** and **8**, the sequence is **2, 8, 6, 2, 4, 2, 2, 0, …**. The object must retain two preceding values, and its first two calls must return the seeds before applying the rule. These numbers could label sample layout sizes, but they are not automatically valid dimensions for our fixed row.

**C-2.32 — Successive square roots.** Design a `Progression` starting by default at **65536**, with each following value its square root: **65536, 256, 16, 4, 2, √2, …**. Do not assume every result stays an integer. For geometry practice, treat the numbers as **dimensionless drawing scale factors**; repeatedly taking a square root of a length would change its physical units and confuse the model.

Both exercises ask what **state** a generator needs between calls. The difference rule needs two values; the square-root rule needs one.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Projects — Complete Systems, P-2.33–P-2.39

Projects require several cooperating pieces. Keep the book's input and output in view, then use the workshop only to build a small test. Decide missing details explicitly so another person can run and judge the program.

<span id="part-6-tools"></span>

### 1. Polynomial and document tools, P-2.33–P-2.34

**P-2.33 — Differentiate a polynomial.** The program must read a polynomial written in standard algebraic notation and output its first derivative. If a card's sides depend on a variable length `x` as `x` and `x + 3`, then its area is `A(x) = x² + 3x`, and `A′(x) = 2x + 3`. This checks the **math**; the project also needs a parser for coefficients, signs, powers, and constants. If `x` is in centimetres, the derivative of area with respect to `x` has centimetre units.

**P-2.34 — Letter-frequency chart.** Read a document, count its alphabetic characters, and show a bar chart of letter frequencies. A tiny workshop note `A C A` has `A: 2` and `C: 1`, so `A`'s bar should be twice `C`'s if bar length represents count. The real input is document text, not the card list. Decide case folding and what counts as an alphabetic character before graphing.

<span id="part-6-systems"></span>

### 2. Message, river, and reader simulations, P-2.35–P-2.38

**P-2.35 — Packet transfer.** Simulate Alice creating message packets, a channel transferring them, and Bob receiving, reading, and deleting them. Model each stage with appropriate objects and queues; a packet should not be read before it arrives. A packet could carry the instruction “place `C` at 4 cm” for a geometry test, while the original project remains a communication simulation.

**P-2.36 — Bear and fish river.** Simulate a one-dimensional river list containing bears, fish, and empty cells. Animals move to a neighboring cell or stay according to random choices. The book specifies outcomes for same-species meetings (stay and reproduce into a random previously empty cell) and a bear-fish meeting (the fish dies). Picture cells numbered `0` through `11`, like row positions, to trace one move. Define behavior at the ends, when no empty cell exists, and how moves in one time step are ordered.

**P-2.37 — Gender and strength.** Extend the river simulation with an `Animal` base class holding gender and strength. Opposite-gender animals of the same species reproduce; same-gender animals of the same species compete, with the stronger surviving. Reuse the P-2.36 river and state a tie rule. This project tests whether shared animal state sits in the parent while species-specific behavior stays in the right subclass.

**P-2.38 — Build the e-book reader.** Implement the reader designed in C-2.24: acquire eligible public-domain books from an Internet source, list the user's books, and let the user read one. A geometry lesson could be one sample book in a local test, but the delivered project must still support the book workflow. Separate catalog lookup, acquisition, storage, and reading so each operation has a clear job.

<span id="part-6-polygons"></span>

### 3. A polygon hierarchy, P-2.39

**P-2.39 — Interactive polygon measurements.** Design an abstract `Polygon` with `area` and `perimeter`, and concrete or further specialized classes for `Triangle`, `Quadrilateral`, `Pentagon`, `Hexagon`, and `Octagon`. Include `IsoscelesTriangle`, `EquilateralTriangle`, `Rectangle`, and `Square` in appropriate places. Ask the user for enough measurements and report the selected shape's area and perimeter. The project also suggests accepting vertex input and checking whether two polygons are similar.

```text
Polygon
├── Triangle
│   └── IsoscelesTriangle
│       └── EquilateralTriangle
├── Quadrilateral
│   └── Rectangle
│       └── Square
├── Pentagon
├── Hexagon
└── Octagon
```

For `Rectangle(2, 3)`, area is **6 cm²** and perimeter is **10 cm**. For `Square(4)`, they are **16 cm²** and **16 cm**. A polygon's number of sides, or even its side lengths alone in general, does **not** determine its area. A general implementation needs sufficient geometry such as vertex coordinates; alternatively, a class can explicitly assume a regular polygon and ask for the measurements its formula requires. An abstract method should promise a result only when the concrete class has enough information to compute it.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: One Connected Geometry Program

<span id="part-7-program"></span>

### 1. The complete program

This short program joins the recurring workshop checks. Its `Vector2` shows the two outcomes of multiplication from C-2.25. The program is a **study example**, not a solution to all 39 prompts.

```python
class Rectangle:
    def __init__(self, label, width, height):
        self.label = label
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def border(self):
        return 2 * (self.width + self.height)


class Workshop:
    def __init__(self, area_limit):
        self.area_limit = area_limit
        self.cards = []
        self.used_area = 0

    def add(self, card):
        if self.used_area + card.area() > self.area_limit:
            return False
        self.cards.append(card)
        self.used_area += card.area()
        return True


class Vector2:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __neg__(self):
        return Vector2(-self.x, -self.y)

    def __mul__(self, other):
        if isinstance(other, (int, float)):
            return Vector2(self.x * other, self.y * other)
        if isinstance(other, Vector2):
            return self.x * other.x + self.y * other.y
        return NotImplemented

    def __rmul__(self, other):
        return self * other

    def __repr__(self):
        return f"Vector2({self.x}, {self.y})"


plan = Workshop(30)
for card in [Rectangle("A", 2, 3), Rectangle("C", 4, 4),
             Rectangle("A", 2, 3)]:
    assert plan.add(card)

print("Accepted labels:", [card.label for card in plan.cards])
print("Used area:", plan.used_area)
print("Add B:", plan.add(Rectangle("B", 4, 2)))
print("Area after B:", plan.used_area)
print("Separate borders:", sum(card.border() for card in plan.cards))

left_edges = list(range(0, 12, 4))
spans = [(left, left + card.width)
         for left, card in zip(left_edges, plan.cards)]
row_fits = (all(card.height <= 4 and 0 <= left and right <= 12
                for (left, right), card in zip(spans, plan.cards))
            and all(spans[i][1] <= spans[i + 1][0]
                    for i in range(len(spans) - 1)))
print("Spans:", spans)
print("Row fits:", row_fits)
print("Ruler marks:", left_edges)
print("Reverse marks:", list(reversed(left_edges)))

shift = Vector2(4, 0)
up = Vector2(0, 1)
print("Reverse shift:", -shift)
print("Three shifts:", 3 * shift)
print("Shift dot up:", shift * up)
```

<span id="part-7-trace"></span>

### 2. Trace the output

```text
Accepted labels: ['A', 'C', 'A']
Used area: 28
Add B: False
Area after B: 28
Separate borders: 36
Spans: [(0, 2), (4, 8), (8, 10)]
Row fits: True
Ruler marks: [0, 4, 8]
Reverse marks: [8, 4, 0]
Reverse shift: Vector2(-4, 0)
Three shifts: Vector2(12, 0)
Shift dot up: 0
```

The failed `B` request leaves `used_area` at **28**. The vector result `Vector2(12, 0)` is a displacement, not a claim that another card fits at 12 cm; the row ends there. The dot product is a number because it combines corresponding coordinates: `4·0 + 0·1 = 0`.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Simple Geometry Study Cases

<details>
<summary><strong>Case 1: A rejected request must not change accepted area</strong></summary>

**Scenario:** The plan already contains `A₁`, `C`, and `A₂`, using 28 cm².

**Problem:** A request to add `B` proposes 28 + 8 = 36 cm², above the 30 cm² allowance.

**Fix:** Check the proposed total before changing the card list or the saved total.

**Result:** Return `False`; keep three cards and 28 cm². This mirrors the rejected attempt in R-2.8, while its original quantities are credit limits and balances.

</details>

<details>
<summary><strong>Case 2: A ruler mark is both a position and a sequence value</strong></summary>

**Scenario:** Candidate left edges come from `Range(0, 12, 4)`.

**Problem:** Decide whether 8 cm and 6 cm are marks, then visit all marks backward.

**Fix:** Apply the range bounds and step test: 8 is within `[0, 12)` and divisible by 4; 6 is not. Reverse iteration begins at the last index.

**Result:** The marks are `0, 4, 8`; membership is `True` for 8 and `False` for 6; reversed order is `8, 4, 0`. This joins R-2.16, C-2.26, and C-2.27.

</details>

<details>
<summary><strong>Case 3: A vector operation needs a declared result type</strong></summary>

**Scenario:** A horizontal move is `(4, 0)` cm and an upward move is `(0, 1)` cm.

**Problem:** Scaling the horizontal move and comparing the directions both use `*` in the vector exercises.

**Fix:** Check the right operand: a number scales each coordinate; another vector calls for a dot product.

**Result:** `3 * (4, 0)` is the vector `(12, 0)` cm, while `(4, 0) · (0, 1)` is the scalar `0` cm². The first is a move; the second measures directional alignment.

</details>

<details>
<summary><strong>Case 4: A shape name is not enough measurement data</strong></summary>

**Scenario:** A user selects `Rectangle` and enters sides 2 cm and 3 cm; another selects `Pentagon` but enters only its side count.

**Problem:** The rectangle is measurable, while the general pentagon's area remains unknown.

**Fix:** Compute the rectangle directly. For the pentagon, request vertices or specify a regular-pentagon model with sufficient measurements.

**Result:** The rectangle has area 6 cm² and perimeter 10 cm. The pentagon cannot yet produce a valid area. This is the central input-design question in P-2.39.

</details>

<details>
<summary><strong>Case 5: Separate the formula from the parser</strong></summary>

**Scenario:** A variable card has sides `x` and `x + 3` cm.

**Problem:** Find how its area changes as `x` changes, and then imagine reading the formula as text.

**Fix:** First expand `A(x) = x² + 3x`, then differentiate term by term to get `A′(x) = 2x + 3`. Separately, design a parser that can recognize the same polynomial from standard notation.

**Result:** At `x = 2 cm`, area is 10 cm² and the derivative is 7 cm. The arithmetic check does not by itself finish the input-processing project P-2.33.

</details>

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Exercise group | Question to ask before coding | Geometry reminder |
| :--- | :--- | :--- |
| R-2.1–R-2.8 | What is the object's valid state, and when may it change? | Rejecting `B` leaves accepted area at 28 cm². |
| R-2.9–R-2.16 | Which operation and boundary does the syntax represent? | Scaling a move returns a vector; a dot product returns a scalar; `Range(0, 12, 4)` has three marks. |
| R-2.17–R-2.23 | What belongs in a parent, and what order does a sequence use? | A square preserves equal sides; ruler marks can be compared lexicographically. |
| C-2.24–C-2.32 | What extra state or edge rule makes the extension coherent? | Reverse iteration, fast mark lookup, and progressions each need explicit state. |
| P-2.33–P-2.39 | What input is sufficient, and how do components cooperate? | A shape needs measurements or vertices before it can promise an area. |

**Keep the source task and the study case distinct.** The geometry workshop gives small values to trace; the book's requested programs still have their original domains and requirements.

[🔝 Back to Top](#top)
