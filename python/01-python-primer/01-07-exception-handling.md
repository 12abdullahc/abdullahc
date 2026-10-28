<span id="top"></span>

# 1.7 Exception Handling — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.7, printed pages 33–38 (the supplied PDF).  
> **Topic:** Exception types; 1.7.1 Raising an Exception; 1.7.2 Catching an Exception.  
> **Domain Focus:** Detecting and handling bad measurements, unknown rectangular cards, an empty average, and a missing card file.  
> **User Prompt:** Reexplain Section 1.7 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The same card sizes and choices](#background-cards)
   - [2. Why calculations can fail](#background-errors)
2. [Part 1: 1.7 Exception Handling](#part-1)
   - [1. An exception interrupts the normal path](#exception-path)
   - [2. Common exception types](#exception-types)
   - [3. The exception travels to a handler](#propagation)
3. [Part 2: 1.7.1 Raising an Exception](#part-2)
   - [1. Signal an invalid measurement with raise](#raise)
   - [2. Separate wrong types from wrong values](#type-value)
   - [3. Decide which checks belong in a function](#validation)
4. [Part 3: 1.7.2 Catching an Exception](#part-3)
   - [1. Guard an expected case or catch a failure](#guard-or-catch)
   - [2. Read a number with try and except](#try-except)
   - [3. Handle file errors](#file-errors)
   - [4. Choose handlers, skip, or re-raise](#handlers)
   - [5. Run cleanup with finally](#finally)
5. [Part 4: One Connected Geometry Program](#part-4)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The same card sizes and choices

Students cut rectangular cards for a display board. For each card, **area = width × height**.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The request `["A", "C", "A"]` means three **physical cards**, including two A cards. Their total area is `6 + 16 + 6 = 28` cm², and their average is `28 / 3 ≈ 9.33` cm² per card. An unknown label `"?"` should be skipped.

<span id="background-errors"></span>

### 2. Why calculations can fail

Section 1.6 read typed text and file contents. That data may be incomplete or invalid. A student might enter `"wide"` instead of a number, give a negative length, request an unknown card, or ask for an average when no cards were accepted. A file might be missing.

| What happened? | Why the usual calculation cannot continue |
| :--- | :--- |
| Width is `"wide"` | It cannot be converted to a numeric length. |
| Height is `-2` cm | A physical rectangle cannot have a negative side length. |
| Label is `"?"` | There is no matching card in the catalog. |
| Accepted count is `0` | Division by zero cannot produce an average. |
| Card file is absent | There are no saved measurements to read. |

An **exception** lets Python signal such a problem. A **handler** lets the program decide whether to skip the card, explain the error, retry input, or stop.

> **Mental model:** Work normally until a specific operation fails. The exception identifies the failure; a suitable handler decides what happens next.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.7 Exception Handling

<span id="exception-path"></span>

### 1. An exception interrupts the normal path

An exception is an object representing an unusual event or error. Python can raise one automatically, and our code can raise one deliberately. When an exception occurs, Python **stops the current sequence of statements** and looks for code that can handle that kind of exception.

```python
width_text = "wide"

try:
    width = int(width_text)
    area = width * 3  # This line is skipped when int raises ValueError.
except ValueError:
    print("Width must be a whole number.")
# Width must be a whole number.
```

Here `int("wide")` raises a `ValueError`. The handler prints a useful message. Without a matching handler, the exception would continue outward and eventually stop the program with a traceback.

<span id="exception-types"></span>

### 2. Common exception types

The book's Table 1.6 lists these exceptions. The examples show where each could appear in our card workshop.

| Exception | Meaning in this study case |
| :--- | :--- |
| `Exception` | Base class for many ordinary errors. A broad `except Exception` can catch its subclasses. |
| `AttributeError` | Ask an object for an operation it lacks, such as `(2, 3).append(4)`. |
| `EOFError` | `input()` cannot read another line because input has ended. An empty line entered by a person is different. |
| `IOError` | The book's name for an input/output failure, such as a file that cannot be opened. In current Python it is an alias of `OSError`. |
| `IndexError` | Read a position outside a sequence, such as `dimensions[2]` when only width and height are present. |
| `KeyError` | Look up `areas["?"]` when `"?"` is not a dictionary key; removing a missing item with `set.remove` also raises it. |
| `KeyboardInterrupt` | The user interrupts the running program, usually with Ctrl+C. |
| `NameError` | Use a name that was never defined, such as a misspelled `total_area`. |
| `StopIteration` | Ask an exhausted iterator for another item with `next`. A normal `for` loop handles this internally. |
| `TypeError` | Use an operation with an unsuitable type, such as `2 + "3"`. |
| `ValueError` | Supply a value of an acceptable general type but unsuitable content, such as `int("wide")`. |
| `ZeroDivisionError` | Compute `total_area / count` when `count` is `0`. |

`FileNotFoundError` is a more specific modern `OSError` for a missing file. `KeyboardInterrupt` is unusual in this table: it inherits from `BaseException` directly, so `except Exception` does not catch it.

<span id="propagation"></span>

### 3. The exception travels to a handler

Suppose a function reads a width and calls `float`. If conversion fails, and that function has no matching handler, the exception **propagates** to its caller. The caller can catch it. If no caller catches it, the program ends with an error report.

```python
def area_from_text(width_text, height_text):
    width = float(width_text)
    height = float(height_text)
    return width * height

try:
    print(area_from_text("wide", "3"))
except ValueError:
    print("Skipped this card: a measurement is not numeric.")
# Skipped this card: a measurement is not numeric.
```

The `ValueError` starts inside `float`, passes through `area_from_text`, and reaches the surrounding `try`. The multiplication never runs.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.7.1 Raising an Exception

<span id="raise"></span>

### 1. Signal an invalid measurement with raise

Python cannot know every rule of our geometry problem. It can multiply `-2 * 3`, but a physical card cannot have a side length of `-2` cm. We express that rule by raising an exception ourselves:

```python
height = -2

if height <= 0:
    raise ValueError("height must be positive")
```

`raise` creates an exceptional path immediately. Later statements on that path are skipped; a matching handler can continue after its `try` statement. The message explains which rule was broken. The book uses the same idea to reject a negative input to a square-root function.

<span id="type-value"></span>

### 2. Separate wrong types from wrong values

A function can check two different questions: **Is the input the right kind of object?** and **Is its value allowed?**

```python
def rectangle_area(width, height):
    if not isinstance(width, (int, float)) or not isinstance(height, (int, float)):
        raise TypeError("width and height must be numbers")
    if width <= 0 or height <= 0:
        raise ValueError("width and height must be positive")
    return width * height

for dimensions in ((2, 3), (0, 3), ("wide", 3)):
    try:
        print(rectangle_area(*dimensions))
    except (TypeError, ValueError) as error:
        print(type(error).__name__ + ":", error)

# 6
# ValueError: width and height must be positive
# TypeError: width and height must be numbers
```

The first pair gives A's 6 cm². The zero width is a numeric value, but it breaks the geometry rule, so it gets `ValueError`. The text width is the wrong kind of object, so it gets `TypeError`. These checks follow the book's distinction between a wrong type and an invalid value.

<span id="validation"></span>

### 3. Decide which checks belong in a function

The book contrasts **checking every input explicitly** with writing a shorter function and letting Python raise a natural error. For example, adding numeric areas works, but a string mixed into the list naturally causes `TypeError`:

```python
print(sum([6, 16, 6]))  # 28

try:
    print(sum([6, "16", 6]))
except TypeError:
    print("One area is text, so the total cannot be calculated.")
```

Explicit checks are useful when the rule belongs to the problem: a length must be positive, even though Python happily multiplies a negative number. Natural errors are often enough when an operation already rejects the input clearly. Adding many redundant checks can make a small function harder to read.

The book's longer validation example uses `collections.Iterable`. In current Python, that abstract type is imported from `collections.abc`; the simple area function above needs no such import.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.7.2 Catching an Exception

<span id="guard-or-catch"></span>

### 1. Guard an expected case or catch a failure

An average requires at least one accepted card. If an empty selection is a normal possibility, check the count before division:

```python
total_area = 0
count = 0

if count > 0:
    print(total_area / count)
else:
    print("No cards were accepted; there is no average.")
```

We can also attempt the division and catch its exception:

```python
total_area = 0
count = 0

try:
    print(total_area / count)
except ZeroDivisionError:
    print("No cards were accepted; there is no average.")
```

Both avoid a crash. The first makes an expected empty selection visible before division; the second handles the failure after it occurs. The book compares these two approaches for division. Exception handling is especially useful when a failure is hard to predict in advance, such as bad user input or a file-opening problem.

<span id="try-except"></span>

### 2. Read a number with try and except

A `try` block contains the operation that may fail. An `except` block names the error it handles. More than one exception type can share a handler by placing the types in a tuple.

```python
try:
    height = int(input("Height for card A (cm): "))
    print("Area:", 2 * height, "cm²")
except (ValueError, EOFError) as error:
    print("Could not read a height:", error)
```

`input()` may raise `EOFError` if no more input is available. `int(...)` may raise `ValueError` if the entered text is not an integer. In either case, the area-printing line is skipped. On a normal input such as `3`, the handler is skipped and the area is `6` cm². An ordinary end of a text file read by `read()` or a `for` loop does **not** raise `EOFError`.

The book also shows a retry loop for invalid input. A retry must make progress toward a usable value; if input has permanently ended, retrying `EOFError` forever would not help.

<span id="file-errors"></span>

### 3. Handle file errors

Opening a file may fail even when the program's logic is sound: the path might not exist or access might be denied. The book catches `IOError as e`. Current Python code usually catches `OSError`, or the narrower `FileNotFoundError` when only a missing file is expected.

```python
try:
    with open("card_measurements.txt", "r", encoding="utf-8") as file:
        print(file.read())
except OSError as error:
    print("Could not read the card file:", error)
```

`as error` gives the handler the exception object, including its diagnostic message. If the file exists, its contents are printed; otherwise the handler reports the failure. The `with` block closes a successfully opened file when the block ends.

<span id="handlers"></span>

### 4. Choose handlers, skip, or re-raise

Different problems can need different responses. `except ValueError` can report a bad number; `except EOFError` can report that input ended and use bare `raise` to pass that exception to a caller.

```python
def read_width():
    try:
        return int(input("Card width in cm: "))
    except ValueError:
        print("Enter a whole-number width.")
        return None
    except EOFError:
        print("Input ended; no more cards can be read.")
        raise
```

Here `None` lets the caller decide whether to ask again. On ended input, bare `raise` sends the same `EOFError` outward. Handlers are checked in order, so put specific cases before broad ones.

```python
def parse_width(raw):
    try:
        return int(raw)
    except ValueError:
        print("Width is not a whole number.")
        raise  # Re-raise the same ValueError.

try:
    parse_width("wide")
except ValueError:
    print("The caller skips this card.")

# Width is not a whole number.
# The caller skips this card.
```

The book also shows `pass` as a handler body. It does nothing, which can be appropriate for an intentionally ignored unknown card:

```python
areas = {"A": 6, "B": 8, "C": 16}

for label in ["A", "?", "C"]:
    try:
        print(label, areas[label])
    except KeyError:
        pass  # Skip this unknown label.
# A 6
# C 16
```

Use a silent `pass` only when ignoring the failure is the intended result; otherwise it hides useful information. A final bare `except:` catches virtually everything, including a user's keyboard interrupt, so the book recommends using it sparingly. Catch the specific errors you can actually handle.

<span id="finally"></span>

### 5. Run cleanup with finally

`finally` runs when the `try` statement finishes, whether its main block succeeds or raises an exception. It also runs while an exception is being re-raised or passed to an outer handler.

```python
try:
    try:
        int("wide")
    finally:
        print("Finished processing this card.")
except ValueError:
    print("The caller skips the card.")

# Finished processing this card.
# The caller skips the card.
```

The `finally` block does **not** make the `ValueError` disappear. It runs first; the outer handler then catches the error. This is useful for releasing resources. For files, `with open(...)` is normally the simpler way to ensure a file is closed.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This program keeps the catalog from the earlier sections. It raises `ValueError` when a label is unknown, catches that error for each request, and calculates the average only when at least one physical card was accepted.

```python
CARD_SIZES = {
    "A": (2, 3),
    "B": (4, 2),
    "C": (4, 4),
}

def rectangle_area(width, height):
    if width <= 0 or height <= 0:
        raise ValueError("card dimensions must be positive")
    return width * height

def area_for_label(label):
    if label not in CARD_SIZES:
        raise ValueError("unknown card label: " + label)
    width, height = CARD_SIZES[label]
    return rectangle_area(width, height)

requests = "A C ? A".split()
total_area = 0
accepted_count = 0

for label in requests:
    try:
        area = area_for_label(label)
    except ValueError as error:
        print("Skipped:", error)
        continue

    print(label, "area:", area, "cm²")
    total_area += area
    accepted_count += 1

print("Accepted cards:", accepted_count)
print("Total area:", total_area, "cm²")
if accepted_count > 0:
    print("Average area:", round(total_area / accepted_count, 2), "cm²")
else:
    print("No average: no cards were accepted.")

# A area: 6 cm²
# C area: 16 cm²
# Skipped: unknown card label: ?
# A area: 6 cm²
# Accepted cards: 3
# Total area: 28 cm²
# Average area: 9.33 cm²
```

The `try` covers one requested card at a time. An invalid label skips only that request; the later A still runs. Counting accepted requests instead of distinct labels correctly treats two A cards as two physical cards. The final count check handles an empty or entirely invalid request list.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: numeric text and nonnumeric text</strong></summary>

**Scenario.** A student types a height for card A. `"3"` converts to an integer; `"wide"` does not.

```python
for raw_height in ("3", "wide"):
    try:
        height = int(raw_height)
        print("A area:", 2 * height, "cm²")
    except ValueError:
        print("Skipped:", raw_height, "is not a whole-number height")

# A area: 6 cm²
# Skipped: wide is not a whole-number height
```

**Check.** `int("wide")` raises `ValueError`, so multiplication is skipped for that entry.

</details>

<details>
<summary><strong>Case Study 2: a negative side is a geometry error</strong></summary>

**Scenario.** Python can multiply `4 * -2`, but a physical B card cannot have a negative height.

```python
width, height = 4, -2

try:
    if width <= 0 or height <= 0:
        raise ValueError("card sides must be positive")
    print("B area:", width * height)
except ValueError as error:
    print("Rejected B:", error)

# Rejected B: card sides must be positive
```

**Check.** The error comes from the workshop's geometry rule, so our code raises it explicitly.

</details>

<details>
<summary><strong>Case Study 3: an unknown label is a missing dictionary key</strong></summary>

**Scenario.** A request contains `"?"`, which is absent from the card-area dictionary.

```python
areas = {"A": 6, "B": 8, "C": 16}

for label in ("A", "?", "C"):
    try:
        print(label, areas[label], "cm²")
    except KeyError:
        print("Skipped unknown label:", label)

# A 6 cm²
# Skipped unknown label: ?
# C 16 cm²
```

**Check.** Direct dictionary lookup raises `KeyError`. A program can catch it, or check `label in areas` before lookup when unknown labels are expected often.

</details>

<details>
<summary><strong>Case Study 4: no accepted cards means no average</strong></summary>

**Scenario.** The request list contains only `"?"`. The accepted count stays zero.

```python
areas = {"A": 6, "B": 8, "C": 16}
accepted = []
for label in ("?",):
    if label in areas:
        accepted.append(areas[label])
count = len(accepted)

if count == 0:
    print("No average: no known cards were accepted.")
else:
    print("Average:", sum(accepted) / count)

# No average: no known cards were accepted.
```

**Check.** A conditional guard is clear here because an empty selection is an ordinary outcome. Dividing by `count` without the guard would raise `ZeroDivisionError`.

</details>

<details>
<summary><strong>Case Study 5: a missing card file and cleanup</strong></summary>

**Scenario.** The saved measurement file is absent. Opening it raises `FileNotFoundError`, a specific kind of `OSError`.

```python
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as folder:
    path = Path(folder) / "card_measurements.txt"
    try:
        with path.open("r", encoding="utf-8") as file:
            print(file.read())
    except FileNotFoundError:
        print("No saved measurements were found.")
    finally:
        print("Finished checking the card file.")

# No saved measurements were found.
# Finished checking the card file.
```

**Check.** The temporary directory makes the missing-file example repeatable. `finally` runs after the handler; `with` would close the file if it had opened successfully.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 1.7 idea | What it means | Rectangle-card example |
| :--- | :--- | :--- |
| Exception | An object signals that the normal sequence cannot continue. | `int("wide")` raises `ValueError`. |
| Propagation | An unhandled error moves from a function to its caller. | A failed text conversion reaches the request handler. |
| `raise` | Signal a problem the program's rules can identify. | Reject a negative card side with `ValueError`. |
| `TypeError` versus `ValueError` | Distinguish an unsuitable type from an unsuitable value. | Text width versus numeric zero width. |
| `try` / `except` | Attempt work and handle named failures. | Skip an unknown label after `KeyError` or `ValueError`. |
| Multiple handlers | Handle several types together or give each a different response. | Catch malformed numeric text and ended console input. |
| `pass` and bare `raise` | Intentionally do nothing, or re-raise the active error. | Ignore `"?"` by policy, or let a caller decide about bad input. |
| `finally` | Run cleanup even while an error is in flight. | Finish card processing or release a resource. |
| Guarding division | Check an expected empty count before calculating. | Report no average when zero cards were accepted. |

[🔝 Back to Top](#top)
