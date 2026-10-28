<span id="top"></span>

# 1.3 Expressions, Operators, and Precedence — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.3, printed pages 12–17 (the supplied PDF).  
> **Topic:** Expressions, the book's operator groups, and 1.3.1 Compound Expressions and Operator Precedence.  
> **Domain Focus:** The rectangular cards from Sections 1.1–1.2: dimensions, areas, ordered choices, and labels.  
> **User Prompt:** Reexplain Section 1.3 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rectangle-Card Workshop](#background)
   - [1. The same cards](#background-cards)
   - [2. From values to expressions](#background-expressions)
2. [Part 1: 1.3 Expressions and Operators](#part-1)
   - [1. Logical operators](#logical)
   - [2. Equality and identity operators](#equality)
   - [3. Comparison operators](#comparison)
   - [4. Arithmetic operators](#arithmetic)
   - [5. Bitwise operators](#bitwise)
   - [6. Sequence operators](#sequence)
   - [7. Set and dictionary operators](#sets-dicts)
   - [8. Extended assignment operators](#augmented)
3. [Part 2: 1.3.1 Compound Expressions and Operator Precedence](#part-2)
   - [1. Why grouping changes an answer](#precedence-intuition)
   - [2. Precedence from higher to lower](#precedence-table)
   - [3. Equal precedence and special cases](#precedence-cases)
   - [4. Chained comparisons and assignments](#chains)
4. [Part 3: One Connected Geometry Program](#part-3)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The same cards

Our class is arranging rectangular cards on a display board. The card dimensions are in centimetres:

| Card | Width | Height |   Area |
| :--- | ----: | -----: | -----: |
| `A`  |     2 |      3 |  6 cm² |
| `B`  |     4 |      2 |  8 cm² |
| `C`  |     4 |      4 | 16 cm² |

Choosing `A`, `C`, and `A` again means three physical cards, total area **28 cm²**, and two different card labels. We will use these values for calculations, tests, slices, sets, and lookup tables.

<span id="background-expressions"></span>

### 2. From values to expressions

An **expression** combines values and produces a result. The values that an operator works on are its **operands**:

```python
width = 2
height = 3
area = width * height  # width and height are operands of *
print(area)            # 6
```

The meaning of an operator depends on the operand types. `2 + 3` adds numbers, while `"Card " + "A"` joins strings. Compound expressions combine several operations, so Python needs rules for grouping them.

> **Mental model:** First ask what each operand represents; then ask what the operator means for those types; finally check how the expression is grouped.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.3 Expressions and Operators

<span id="logical"></span>

### 1. Logical operators

`not` reverses a truth value. `and` requires both conditions to be true; `or` needs at least one. For card `A` and a 4 cm × 4 cm allowed rectangle:

```python
width, height = 2, 3
valid = width > 0 and height > 0
fits_dimensions = width <= 4 and height <= 4
needs_review = not fits_dimensions
accepted_label = "A" == "A" or "A" == "B"
print(valid, fits_dimensions, needs_review, accepted_label)
# True True False True
```

`and` and `or` **short-circuit**: Python skips the right operand when the left operand already determines the answer. This can prevent an invalid lookup:

```python
dimensions = None
safe_width = dimensions is not None and dimensions[0] > 0
print(safe_width)  # False; dimensions[0] was never attempted
```

In conditions, they work like Boolean logic. Python may return an operand rather than a literal `True` or `False` when given non-Boolean operands, so write an explicit comparison when a Boolean result is the goal.

<span id="equality"></span>

### 2. Equality and identity operators

`==` asks whether values are equivalent; `!=` asks whether they differ. `is` asks whether two names refer to the **same object**; `is not` asks whether they do not.

```python
first = [2, 3]
second = [2, 3]
alias = first
print(first == second)  # True: equal dimensions
print(first is second)  # False: two separate lists
print(first is alias)   # True: same list object
print(first != [4, 2])  # True: different dimensions
```

For geometry values, `==` is usually the right question. Use `is` for identity questions such as detecting aliases or checking `value is None`. Avoid using `is` to compare numeric or string values; whether equal-looking literals share an object is not the geometry fact we need.

<span id="comparison"></span>

### 3. Comparison operators

`<`, `<=`, `>`, and `>=` compare order. With numbers, they answer geometry questions:

```python
area_a = 2 * 3
area_b = 4 * 2
print(area_a < area_b)    # True: 6 < 8
print(area_b <= 8)        # True
print(0 < area_a <= 10)   # True: a chained comparison
```

Strings are compared **lexicographically**, character by character and case-sensitively. Thus `"A" < "B"` is true because of label order, not because one card is smaller. Even `"10" < "2"` is true as text. Convert numeric input before comparing measurements. In modern Python, an incompatible order comparison such as `5 < "A"` raises `TypeError`.

<span id="arithmetic"></span>

### 4. Arithmetic operators

| Operator | Geometry meaning                                    | Example result      |
| :------- | :-------------------------------------------------- | :------------------ |
| `+`, `-` | Add or subtract lengths or areas.                   | `6 + 16` is `22`.   |
| `*`      | Multiply dimensions.                                | `2 * 3` is `6` cm². |
| `/`      | True division.                                      | `11 / 2` is `5.5`.  |
| `//`     | Floor division.                                     | `11 // 2` is `5`.   |
| `%`      | Remainder paired with `//`.                         | `11 % 2` is `1`.    |
| `**`     | Exponentiation, used later in the precedence table. | `4 ** 2` is `16`.   |

For card `A`, area is `width * height` and perimeter is `2 * (width + height)`:

```python
width, height = 2, 3
print(width * height)       # 6 cm^2
print(2 * (width + height)) # 10 cm
print(2 * width + height)   # 7: a different expression
```

If a row of the board is 11 cm wide, card `A` is 2 cm wide, and we allow no gaps, `11 // 2` gives **five whole card widths** and `11 % 2` gives **1 cm left over**. By contrast, `11 / 2` gives the real-number quotient `5.5`. True division returns a float even when both operands are integers. With `+`, `-`, or `*`, two integer operands produce an integer; using a float produces a float.

Floor division is **not truncation toward zero**. On a coordinate axis, let `x = -11` cm and grid-cell width be `2` cm:

```python
x, cell_width = -11, 2
q = x // cell_width
r = x % cell_width
print(q, r)                         # -6 1
print(q * cell_width + r == x)       # True
```

Python keeps `x = (x // cell_width) * cell_width + (x % cell_width)`. With a positive divisor, the remainder lies from zero up to, but not including, the divisor. With a negative divisor, the remainder is nonpositive and greater than the divisor. These rules also apply to floating-point operands, subject to floating-point approximation.

<span id="bitwise"></span>

### 5. Bitwise operators

Bitwise operators work on the binary digits of integers. For a geometry workshop, imagine four **edge flags** showing which sides of a rectangle need a coloured border:

```python
TOP = 0b0001
RIGHT = 0b0010
BOTTOM = 0b0100
LEFT = 0b1000
marked = TOP | RIGHT
print(marked)              # 3: top and right
print(bool(marked & TOP))   # True: top is marked
print(marked ^ RIGHT)      # 1: toggle right off
print(TOP << 3)            # 8: move bit to left position
print(LEFT >> 3)           # 1: move bit to top position
print((~marked) & 0b1111)  # 12: bottom and left within four flags
```

| Symbol              | Meaning for integer bits          | Four-edge idea                                |
| :------------------ | :-------------------------------- | :-------------------------------------------- |
| `&`                 | AND: bits present in both.        | Find a shared marked edge.                    |
| <code>&#124;</code> | OR: bits present in either.       | Combine edge marks.                           |
| `^`                 | XOR: bits present in exactly one. | Toggle an edge.                               |
| `~`                 | Complement: invert bits.          | Use a mask to limit the result to four edges. |
| `<<`, `>>`          | Shift bits left or right.         | Move a single edge flag's position.           |

Python integers are not fixed to four bits, so `~marked` alone is negative; `& 0b1111` keeps only our four relevant bits. **`^` is XOR, not exponentiation**; use `**` for powers.

<span id="sequence"></span>

### 6. Sequence operators

Lists, tuples, and strings are **sequences**. They support indexing, slicing, concatenation, repetition, membership tests, and value comparisons.

```python
choices = ["A", "C", "A"]
print(choices[0])         # A: first item
print(choices[-1])        # A: last item
print(choices[0:2])       # ['A', 'C']
print(choices[::2])       # ['A', 'A']
print(choices + ["B"])    # ['A', 'C', 'A', 'B']
print(2 * ["A"])          # ['A', 'A']
print("C" in choices)     # True
print("B" not in choices) # True
```

The slice `choices[start:stop]` includes `start` but excludes `stop`. A third part, `choices[start:stop:step]`, skips by `step`. Omitted bounds reach the sequence ends; a negative step can reverse it, as in `["A", "B", "C"][::-1]`. Negative indices count from the end.

Lists can also replace or remove entries:

```python
trial = ["A", "C", "A"]
trial[1] = "B"
del trial[0]
print(trial)  # ['B', 'A']
```

A slice can replace or delete a run of list entries. Strings and tuples cannot be changed this way. For strings, `in` can check a **substring**, so `"Card" in "Card A"` is true. Sequence comparisons are lexicographic, comparing the first differing item: `["A", "C"] < ["B"]` is true because `"A" < "B"`, not because the left cards have a smaller combined area.

<span id="sets-dicts"></span>

### 7. Set and dictionary operators

Suppose the left and right halves of the board use these card **types**:

```python
left = {"A", "B"}
right = {"B", "C"}
print((left | right) == {"A", "B", "C"}) # True: union
print((left & right) == {"B"})           # True: intersection
print((left - right) == {"A"})           # True: left-only
print((left ^ right) == {"A", "C"})      # True: exactly one side
print({"A"} < left)                    # True: proper subset
print(left <= left)                    # True: subset or equal
print("C" not in left)                 # True
```

For sets, `<` and `<=` mean **proper subset** and **subset**, while `>` and `>=` mean proper superset and superset. These are not numeric or lexicographic comparisons. Two disjoint nonempty sets can be neither less than, equal to, nor greater than each other. Set equality ignores display order; `set` and `frozenset` support these set operations.

A dictionary instead maps card labels to dimensions:

```python
sizes = {"A": (2, 3), "B": (4, 2)}
print(sizes["A"])           # (2, 3)
print("A" in sizes)          # True: tests keys
sizes["C"] = (4, 4)         # add or reset a mapping
del sizes["B"]              # remove a mapping
print(sizes == {"A": (2, 3), "C": (4, 4)})  # True
```

`key in sizes` checks **keys**, not dimensions stored as values. Dictionaries compare equal when they have the same key–value pairs; they do not support order comparisons such as `sizes < other_sizes`.

<span id="augmented"></span>

### 8. Extended assignment operators

`+=`, `-=`, `*=`, and similar forms update a name using its previous value. With a number, `total_area += 6` is the concise form of `total_area = total_area + 6`:

```python
total_area = 0
total_area += 6  # card A
total_area += 16 # card C
print(total_area) # 22
```

The effect on **aliases** depends on the object's type. A list's `+=` changes the existing list, while `choices = choices + [...]` makes a new list and rebinds `choices`:

```python
choices = ["A"]
same_list = choices
choices += ["C"]         # mutate the shared list
print(same_list)         # ['A', 'C']
choices = choices + ["B"] # create a new list, then rebind choices
print(choices)           # ['A', 'C', 'B']
print(same_list)         # ['A', 'C']
```

For immutable numbers and strings, an extended assignment rebinds the name to a new object. Do not assume every `+=` works like a list's in-place extension.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.3.1 Compound Expressions and Operator Precedence

<span id="precedence-intuition"></span>

### 1. Why grouping changes an answer

A **compound expression** has more than one operation. Python groups operators by **precedence**, much like ordinary algebra. Parentheses make our intended grouping explicit:

```python
width, height = 2, 3
print(2 * width + height)   # 7
print(2 * (width + height)) # 10: rectangle perimeter
```

The first expression doubles only the width. A rectangle's perimeter doubles the **sum** of width and height, so it needs the second expression. Parentheses are useful even when Python would already choose the intended order: they show the geometry to the reader.

<span id="precedence-table"></span>

### 2. Precedence from higher to lower

The following is the book's Section 1.3 hierarchy for the operators it introduces. **Higher rows bind before lower rows** unless parentheses override them:

| Priority | Operator family                | Symbols or form                       | Card-workshop use            |
| -------: | :----------------------------- | :------------------------------------ | :--------------------------- |
|        1 | Member access                  | `object.member`                       | `label.lower`.               |
|        2 | Calls, indexing, slicing       | `f(...)`, `s[i]`, `s[a:b]`            | `sizes["A"]`.                |
|        3 | Power                          | `**`                                  | `side ** 2` for square area. |
|        4 | Unary signs and bit complement | `+x`, `-x`, `~x`                      | `-offset`.                   |
|        5 | Multiply and divide            | `*`, `/`, `//`, `%`                   | `width * height`.            |
|        6 | Add and subtract               | `+`, `-`                              | Combine card areas.          |
|        7 | Bit shifts                     | `<<`, `>>`                            | Move an edge flag.           |
|        8 | Bitwise AND                    | `&`                                   | Find a marked edge.          |
|        9 | Bitwise XOR                    | `^`                                   | Toggle a flag.               |
|       10 | Bitwise OR                     | <code>&#124;</code>                   | Combine flags.               |
|       11 | Comparisons and membership     | `== != < <= > >= is is not in not in` | `area <= limit`.             |
|       12 | Logical NOT                    | `not`                                 | `not within_budget`.         |
|       13 | Logical AND                    | `and`                                 | Width **and** height fit.    |
|       14 | Logical OR                     | `or`                                  | Choose type `A` **or** `B`.  |
|       15 | Conditional expression         | `yes if condition else no`            | Choose a size label.         |
|       16 | Assignment forms               | `=`, `+=`, and similar                | Save a result.               |

The book includes assignments in this practical table, but plain `=` is an **assignment statement**, not a value-producing expression that you can freely insert into another expression. The table is a reading aid, not a reason to omit parentheses from a complicated formula.

<span id="precedence-cases"></span>

### 3. Equal precedence and special cases

Most operators at the same level group from **left to right**. For a trim strip, `8 - 3 + 2` means `(8 - 3) + 2`, which is `7`.

Exponentiation groups from the **right**: `2 ** 3 ** 2` means `2 ** (3 ** 2)`, or `512`. Unary minus around powers deserves care:

```python
print(2 ** 3 ** 2) # 512
print(-2 ** 2)     # -4: the power is formed before the leading minus
print((-2) ** 2)   # 4: square a negative number
print(2 ** -2)     # 0.25
```

The last expression shows that the unary minus on a power's **right operand** is part of that exponent. Parentheses are the simplest way to communicate a sign-sensitive formula. The conditional expression also sits below `or` in the table:

```python
area = 6
size_label = "small" if area <= 8 else "large"
print(size_label)  # small
```

<span id="chains"></span>

### 4. Chained comparisons and assignments

Python permits a **comparison chain**:

```python
width, height = 2, 3
print(0 < width <= 4)            # True
print(0 < width * height <= 10)  # True: 6 is in the interval
```

`0 < area <= 10` means the area is greater than zero **and** at most ten. Python evaluates the middle expression once. Do not read it as `(0 < area) <= 10`.

Python also permits chained assignment:

```python
width = height = 2
print(width, height)  # 2 2
```

Both names receive the rightmost value. If the rightmost value is a mutable object, chained assignment can make aliases, just as ordinary assignment can.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: One Connected Geometry Program

The workshop chooses cards `A`, `C`, and `A` again. The following program uses arithmetic, augmented assignment, dictionary lookup, set membership, a chained comparison, logical `and`, and a conditional expression:

```python
sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
choices = ["A", "C", "A"]
board_area_budget = 30
requested_card = "A"
total_area = 0

for label in choices:
    width, height = sizes[label]
    total_area += width * height

different_labels = set(choices)
within_budget = 0 < total_area <= board_area_budget
area_check = within_budget and requested_card in sizes
message = "within budget" if area_check else "review"

print("Cards chosen: {}".format(len(choices)))
print("Different sizes: {}".format(len(different_labels)))
print("Total area: {} cm^2".format(total_area))
print("Area check: {}".format(message))
```

**Output:**

```text
Cards chosen: 3
Different sizes: 2
Total area: 28 cm^2
Area check: within budget
```

| Choice processed |     Area added | Running `total_area` |
| :--------------- | -------------: | -------------------: |
| First `A`        |  2 × 3 = 6 cm² |                6 cm² |
| `C`              | 4 × 4 = 16 cm² |               22 cm² |
| Second `A`       |  2 × 3 = 6 cm² |               28 cm² |

The condition `0 < total_area <= board_area_budget` checks `0 < 28 <= 30`. The program uses an **area budget** only; a total area below the board's area does not, by itself, prove the cards can be packed onto a particular board without overlap.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: The perimeter is 7 cm instead of 10 cm</strong></summary>

**Scenario:** Card `A` is 2 cm by 3 cm. We want `2(width + height)`.

**Problem:** Multiplication binds before addition:

```python
width, height = 2, 3
print(2 * width + height)  # 7
```

**Fix:** Group the sum explicitly:

```python
width, height = 2, 3
print(2 * (width + height))  # 10
```

The parentheses express the actual geometry formula.

</details>

<details>
<summary><strong>Case Study 2: Equal dimensions are different objects</strong></summary>

**Scenario:** Two separately measured cards both have dimensions `[2, 3]`.

**Problem:** `is` asks whether they are the same list object, so it is false even when their measurements match.

```python
first = [2, 3]
second = [2, 3]
print(first is second)  # False
print(first == second)  # True
```

**Fix:** Use `==` for the measurement comparison. Reserve `is` for identity, such as `selected is None`.

</details>

<details>
<summary><strong>Case Study 3: Negative coordinates and floor division</strong></summary>

**Scenario:** A point lies at `x = -11` cm on a 2 cm grid.

**Problem:** Truncating `-11 / 2` toward zero would give `-5`, but Python's `//` takes the **floor**, which is `-6`.

```python
x, cell_width = -11, 2
print(x / cell_width)   # -5.5
print(x // cell_width)  # -6
print(x % cell_width)   # 1
```

**Check:** `(-6 * 2) + 1 = -11`. The quotient and remainder still reconstruct the coordinate.

</details>

<details>
<summary><strong>Case Study 4: `+=` changes a shared choice list</strong></summary>

**Scenario:** Another name refers to the workshop's choice list.

**Problem:** List `+=` extends the shared list, so both names see the new `C`:

```python
choices = ["A"]
original = choices
choices += ["C"]
print(original)  # ['A', 'C']
```

**Fix when a separate list is intended:** Use `choices = choices + ["C"]` to make a new outer list before rebinding `choices`, or create a copy first with `list(choices)`.

</details>

<details>
<summary><strong>Case Study 5: `<` means different things for sets and lists</strong></summary>

**Scenario:** We compare the card types used in two display-board regions.

```python
left_types = {"A"}
all_types = {"A", "B"}
print(left_types < all_types)  # True: proper subset

left_sequence = ["A", "C"]
right_sequence = ["B"]
print(left_sequence < right_sequence)  # True: "A" comes before "B"
```

For **sets**, the question is whether every left member belongs to the right set and at least one extra member exists. For **lists**, Python compares the ordered entries lexicographically. Neither expression compares the regions' geometric areas.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Operator group                                                   | Question it answers in this workshop                  |
| :--------------------------------------------------------------- | :---------------------------------------------------- |
| Logical `not`, `and`, `or`                                       | Are dimensions valid, and is the area within a limit? |
| Equality `==` versus identity `is`                               | Do two measurements match, or are two names aliases?  |
| Comparison `<`, `<=`, `>`, `>=`                                  | Is one numeric area below a limit?                    |
| Arithmetic `+ - * / // % **`                                     | What is an area, perimeter, quotient, or remainder?   |
| Bitwise complement, AND, OR, XOR, and shifts                     | Which of four edge flags are marked?                  |
| Sequence index, slice, `+`, `*`, `in`                            | Which cards were chosen, in what order?               |
| Set union, intersection, difference, XOR, and subset comparisons | Which card types occur on either or both regions?     |
| Dictionary `[key]` and `in`                                      | Which dimensions belong to a card label?              |
| Extended assignment `+=`                                         | How does a running total or shared list change?       |
| Precedence and parentheses                                       | Which calculation is grouped first?                   |

[🔝 Back to Top](#top)
