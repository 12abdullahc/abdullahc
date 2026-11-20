<span id="top"></span>

# Python Primer — Section 1.7: Exception Handling

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** Section 1.7 exceptions and common exception types; 1.7.1 raising an exception; and 1.7.2 catching an exception.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Identify what went wrong at runtime, raise a clear exception for invalid data, catch expected failures at a useful boundary, and keep valid MotoGP results separate from invented bad input.<br>
> **User Prompt:** "Reexplain [Section 1.7] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Results and Errors](#background)
   - [1. The verified weekend results](#background-results)
   - [2. A bad notebook entry is not a racing result](#background-errors)
2. [Part 1: Section 1.7 — Exceptions and Common Types](#part-1)
   - [1. What happens when an exception is raised?](#part-1-meaning)
   - [2. Propagation through function calls](#part-1-propagation)
   - [3. Common exception types in the book](#part-1-types)
3. [Part 2: Section 1.7.1 — Raising an Exception](#part-2)
   - [1. Use `raise` for a specific invalid value](#part-2-raise)
   - [2. Separate the wrong type from a wrong value](#part-2-type-value)
   - [3. Decide when natural errors are enough](#part-2-natural)
   - [4. Give an empty selection a clear contract](#part-2-empty)
4. [Part 3: Section 1.7.2 — Catching an Exception](#part-3)
   - [1. Follow the `try` and `except` path](#part-3-try)
   - [2. Check before division or catch a failure](#part-3-guard-or-catch)
   - [3. Handle different expected failures separately](#part-3-multiple)
   - [4. Catch a file error at the file boundary](#part-3-file)
   - [5. Retry invalid input; stop on end of input](#part-3-input)
   - [6. Re-raise an exception when the caller must decide](#part-3-reraise)
   - [7. Use `else` and `finally` for their distinct jobs](#part-3-finally)
5. [Part 4: A Connected Three-Day MotoGP Report](#part-4)
6. [Part 5: Simple Exception Study Cases](#part-5)
   - [1. Do not hide a programming typo](#part-5-typo)
   - [2. Match the handler to the operation](#part-5-handler)
   - [3. A plausible number can still have the wrong meaning](#part-5-meaning)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Results and Errors

<span id="background-results"></span>

### 1. The verified weekend results

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team**. The [Yamaha Factory Racing weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) list the classifications, times, and gaps; MotoGP reported [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | What the number means |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` = `89.426` s | P7; best lap `1:29.558` = `89.558` s | One quickest lap per rider in that Practice session. |
| Saturday Sprint | P1; winner in `19:37.125` | P9; `+10.248` s to Marc | Results from the 13-lap Sprint. |
| Sunday Grand Prix | P6; `+10.778` s | P9; `+19.999` s | Race gaps to winner Marco Bezzecchi of Aprilia Racing after 27 laps. |

The **Friday best-lap difference** is `89.558 - 89.426 = 0.132` seconds. Because both Sunday gaps are measured from Bezzecchi, their **Sunday finish difference** is `19.999 - 10.778 = 9.221` seconds. Those differences are calculations from published values, not separate official results. A Friday best lap and a Sunday race gap measure different things and must stay separate.

<span id="background-errors"></span>

### 2. A bad notebook entry is not a racing result

A program might receive `"P7"` where it expects decimal lap seconds, a misspelled rider code such as `"MARCZ"`, or an empty list where it expects lap values. These are **invented input mistakes for teaching**. They do not describe anything that happened to the riders.

Python can represent such a runtime problem with an **exception object**. Code may **raise** an exception; another part of the program may **catch** it. If nobody catches it, Python stops that call path and prints a traceback.

```text
entered text → conversion or lookup → result
                         |
                         └─ exception → matching handler → useful response
                                      └─ no handler → traceback and stopped run
```

**Why these examples?** A result lookup and a numeric conversion are familiar tasks from the previous sections, but both have clear ways to fail. **How do we solve them?** Name the operation that can fail, identify its expected exception type, and decide whether to correct the input, return a meaningful alternative, or let the caller handle the error.

> **Mental model:** An exception is a signal about a failed operation. Catch it where the program has enough context to make a good decision.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.7 — Exceptions and Common Types

<span id="part-1-meaning"></span>

### 1. What happens when an exception is raised?

Python first tries to execute an expression. If the operation cannot succeed, it may **raise** an exception, ending the remaining statements in that current path unless a matching handler takes over. The exception has a **type**, often a message, and the traceback shows where it traveled.

For example, `float("89.558")` succeeds. `float("P7")` raises `ValueError`: `"P7"` is a position label, not decimal seconds. A shortened interactive error display looks like this:

```text
>>> float("P7")
Traceback (most recent call last):
  ...
ValueError: could not convert string to float: 'P7'
```

`"P7"` here is an invented mistaken input. The real Friday result remains Fabio's **P7** and **1:29.558** best lap. A `SyntaxError` is different: Python cannot parse the code itself. A `ValueError` occurs while valid Python code is running with an unsuitable value.

**Why this example?** The same characters can be valid as a position label and invalid as a lap-time number, so the exception's meaning is easy to see. **How do we solve it?** Read the traceback's final line for the exception type and message, find the failing operation, and use the correct input format or handle that specific failure.

<span id="part-1-propagation"></span>

### 2. Propagation through function calls

A function does not have to catch every exception it encounters. If it does not handle one, the exception **propagates** to its caller. That caller can handle it, or the exception keeps moving outward.

```python
def parse_lap_seconds(raw):
    return float(raw)

def friday_gap_from_fabio(raw):
    fabio_lap_s = parse_lap_seconds(raw)
    return round(fabio_lap_s - 89.426, 3)

print(friday_gap_from_fabio("89.558"))  # 0.132

try:
    friday_gap_from_fabio("not-a-time")
except ValueError:
    print("Enter Fabio's Friday best lap as decimal seconds.")
```

```text
0.132
Enter Fabio's Friday best lap as decimal seconds.
```

The invented `"not-a-time"` reply fails inside `parse_lap_seconds`. Since neither of the two functions catches it, the caller's `except ValueError` runs. The caller knows the prompt's meaning and can give a useful instruction.

**Why this example?** Two small calls make the travel path visible. **How do we solve it?** Trace from `float` outward: first `parse_lap_seconds`, then `friday_gap_from_fabio`, then the surrounding `try`. Handle the error at the level that can explain what the user should enter.

<span id="part-1-types"></span>

### 3. Common exception types in the book

The book's common-exceptions table includes the following types. The examples in the right column are **possible notebook failures**, not additional official MotoGP results.

| Exception | Meaning in this guide | Possible teaching situation |
| :--- | :--- | :--- |
| `Exception` | Base class for most ordinary application errors. | A broad handler might catch several notebook processing errors. |
| `AttributeError` | An object lacks a requested attribute or method. | Calling `89.426.append(...)` on a float. |
| `EOFError` | `input()` reaches end of input without a reply. | The rider-code prompt receives no more console input. |
| `IOError` / `OSError` | A file operation fails. | A weekend report cannot be opened; `FileNotFoundError` is a more specific case. |
| `IndexError` | A sequence index is outside its range. | Accessing index `2` in a two-item rider list. |
| `KeyError` | A mapping key or set element is missing. | Looking up invented code `"MARCZ"` in a rider dictionary. |
| `KeyboardInterrupt` | The user interrupts the program, often with Ctrl+C. | The user stops an input prompt. |
| `NameError` | A variable name is not defined. | The programmer misspells `marc_lap_s`. |
| `StopIteration` | An iterator has no next value. | Calling `next` after visiting both selected riders. |
| `TypeError` | An operation receives an unsuitable type or argument form. | Adding `89.426` to `"0.132"`. |
| `ValueError` | A suitable type has an unsuitable value. | Converting `"P7"` with `float`. |
| `ZeroDivisionError` | Division uses zero as the denominator. | Calculating a mean from zero selected laps. |

In modern Python, `IOError` is an alias of `OSError`. `EOFError` applies to `input()` reaching end of input; ordinary file `read()` and `readline()` return empty text at end of file. `KeyboardInterrupt` inherits from `BaseException` rather than ordinary `Exception`, so `except Exception` does not catch it. A `for` loop normally handles `StopIteration` internally.

**Why this table?** The exception type narrows the search from “something went wrong” to a particular operation. **How do we solve it?** Start with the operation: conversion suggests `ValueError`, a dictionary lookup suggests `KeyError`, and opening a missing file suggests `FileNotFoundError`. Catch only failures the surrounding code can usefully handle.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 1.7.1 — Raising an Exception

<span id="part-2-raise"></span>

### 1. Use `raise` for a specific invalid value

The `raise` statement lets a function signal that an input violates its requirement. A lap duration must be **finite and positive**. This first helper assumes it receives a number; the next example checks the input type as well.

```python
from math import isfinite

def positive_friday_lap(seconds):
    if not isfinite(seconds) or seconds <= 0:
        raise ValueError("Friday best-lap seconds must be finite and positive")
    return seconds

print(positive_friday_lap(89.426))

try:
    positive_friday_lap(-89.426)  # Invented invalid input.
except ValueError as error:
    print(type(error).__name__ + ":", error)
```

```text
89.426
ValueError: Friday best-lap seconds must be finite and positive
```

`ValueError` fits because `-89.426` is numeric but cannot be a valid lap duration. `isfinite` also rejects infinity and `NaN`, which are not lap durations. Raising an exception stops the function at that point; the later `return` is skipped. The caller chooses how to respond.

**Why this example?** The valid value is Marc's published Friday best-lap duration; the negative value is an obviously invented bad entry. **How do we solve it?** State the requirement first, test it before calculating, and raise an exception whose type and message describe the violated rule.

<span id="part-2-type-value"></span>

### 2. Separate the wrong type from a wrong value

The book's square-root sketch distinguishes an unsuitable **type** from an unsuitable **numeric value**. A lap validator can make the same distinction. In Python, `bool` is a subclass of `int`, so reject it explicitly if `True` and `False` should not count as lap seconds.

```python
from math import isfinite

def checked_friday_lap(seconds):
    if isinstance(seconds, bool) or not isinstance(seconds, (int, float)):
        raise TypeError("Friday lap seconds must be a number")
    if not isfinite(seconds) or seconds <= 0:
        raise ValueError("Friday lap seconds must be finite and positive")
    return float(seconds)

print("{:.3f}".format(checked_friday_lap(89.558)))

for bad_value in ("fast", -89.426, True, float("inf")):
    try:
        checked_friday_lap(bad_value)
    except (TypeError, ValueError) as error:
        print(type(error).__name__ + ":", error)
```

```text
89.558
TypeError: Friday lap seconds must be a number
ValueError: Friday lap seconds must be finite and positive
TypeError: Friday lap seconds must be a number
ValueError: Friday lap seconds must be finite and positive
```

The string `"fast"`, negative number, boolean, and infinity are invented invalid values. No published lap was changed. The tuple in the `except` clause means this small demonstration will display either expected validation error.

**Why this example?** It shows why `TypeError` and `ValueError` are not interchangeable: the first says the kind of object is wrong, and the second says a numeric object's value is outside the valid range. **How do we solve it?** Check type before comparing with zero; then check the numeric rule. Return a usable float only after both checks pass.

<span id="part-2-natural"></span>

### 3. Decide when natural errors are enough

The book contrasts detailed validation with letting an operation produce its own error. A small internal helper can sometimes rely on the natural `TypeError` from adding incompatible values:

```python
def total_selected_laps_s(laps_s):
    total = 0.0
    for lap_s in laps_s:
        total += lap_s
    return total

print("{:.3f}".format(total_selected_laps_s([89.426, 89.558])))

try:
    total_selected_laps_s([89.426, "89.558"])  # Invented mixed-type list.
except TypeError:
    print("The selected Friday laps must already be numbers.")
```

```text
178.984
The selected Friday laps must already be numbers.
```

The function does not check every element in advance. Adding a string to a float naturally fails. At a user-input boundary, however, validating or converting early can produce a clearer message. This helper illustrates the principle; it is not a complete replacement for Python's built-in `sum`.

**Why this example?** It makes the tradeoff concrete without inventing a new racing fact. **How do we solve it?** Decide where data enters the program. Convert and validate there; inside a small calculation, an ordinary Python error may be enough if the caller can handle it.

<span id="part-2-empty"></span>

### 4. Give an empty selection a clear contract

An empty list contains no lap to average. Dividing `sum([])` by `len([])` would raise `ZeroDivisionError`, but a domain-specific `ValueError` can explain the actual problem more clearly:

```python
def mean_selected_friday_lap_s(laps_s):
    if not laps_s:
        raise ValueError("Select at least one Friday best lap")
    return sum(laps_s) / len(laps_s)

print("{:.3f}".format(mean_selected_friday_lap_s([89.426, 89.558])))

try:
    mean_selected_friday_lap_s([])
except ValueError as error:
    print(error)
```

```text
89.492
Select at least one Friday best lap
```

`89.492` seconds is a **teaching mean of two published best laps**, not an official session statistic. If an empty selection is normal in a different application, returning `None` might be its chosen contract instead; document the choice.

**Why this example?** It connects an underlying arithmetic failure with the real cause: no selected values. **How do we solve it?** Check the precondition before division and raise a message that tells the caller what to fix.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 1.7.2 — Catching an Exception

<span id="part-3-try"></span>

### 1. Follow the `try` and `except` path

Put an operation that may fail inside `try`. If it succeeds, the matching `except` block is skipped. If it raises, the **rest of the `try` block is skipped** and the first matching handler runs. Code after the whole statement continues if the exception was handled.

```python
for raw in ("89.558", "not-a-time"):
    try:
        lap_s = float(raw)
        print("Converted:", "{:.3f}".format(lap_s))
    except ValueError:
        print("Could not convert Friday lap:", raw)
    print("Finished one entry")
```

```text
Converted: 89.558
Finished one entry
Could not convert Friday lap: not-a-time
Finished one entry
```

The second entry is invented bad text. It never reaches the `Converted:` line, but the handler prevents that expected bad entry from ending the whole loop.

**Why this example?** One good and one bad reply make both control-flow paths visible. **How do we solve it?** Place only the conversion and its dependent statement in `try`, catch `ValueError`, then continue at the next entry.

<span id="part-3-guard-or-catch"></span>

### 2. Check before division or catch a failure

The book compares two ways to handle possible division by zero: check the denominator before dividing, or try the division and catch `ZeroDivisionError`. The same Friday best-lap selection makes both paths visible:

```python
def mean_with_guard(laps_s):
    count = len(laps_s)
    if count == 0:
        return None
    return sum(laps_s) / count

def mean_with_handler(laps_s):
    total = sum(laps_s)
    count = len(laps_s)
    try:
        return total / count
    except ZeroDivisionError:
        return None

def show_mean(value):
    return "no mean" if value is None else "{:.3f} s".format(value)

for selected in ([89.426, 89.558], []):
    print("Guard:", show_mean(mean_with_guard(selected)))
    print("Handler:", show_mean(mean_with_handler(selected)))
```

```text
Guard: 89.492 s
Handler: 89.492 s
Guard: no mean
Handler: no mean
```

`89.492` seconds is a teaching mean of Marc's and Fabio's **Friday best laps**. The empty selection is invented for the example; it is not a missing official result.

**Why this example?** Both functions have the same contract and output, so the only difference is where they deal with zero. **How do we solve it?** If an empty collection is expected and easy to detect, the guard states the rule directly. If the operation itself is the clearest way to detect a failure, catch the specific exception around that operation. Keep the `try` block narrow so another error is not mistaken for division by zero.

<span id="part-3-multiple"></span>

### 3. Handle different expected failures separately

A decimal conversion and a rider dictionary lookup can fail for different reasons. Separate handlers give the caller a specific response. Only one handler runs for a given exception.

```python
from math import isfinite

def compare_friday_entry(code, raw_lap_s):
    published_laps_s = {"MARC": 89.426, "FABIO": 89.558}
    try:
        entered_lap_s = float(raw_lap_s)
        if not isfinite(entered_lap_s) or entered_lap_s <= 0:
            raise ValueError("Friday lap must be finite and positive")
        published_lap_s = published_laps_s[code]
    except ValueError:
        return "Enter positive, finite decimal lap seconds."
    except KeyError:
        return "Use rider code MARC or FABIO."
    return "Difference from stored Friday best lap: {:.3f} s".format(
        abs(entered_lap_s - published_lap_s)
    )

print(compare_friday_entry("MARC", "89.426"))
print(compare_friday_entry("MARC", "P5"))
print(compare_friday_entry("MARCZ", "89.426"))
```

```text
Difference from stored Friday best lap: 0.000 s
Enter positive, finite decimal lap seconds.
Use rider code MARC or FABIO.
```

`"P5"` as a lap value and `"MARCZ"` as a code are invented mistakes. The function's `0.000 s` is a calculated difference between the reentered number and the stored Marc value, not a separate official result. Because conversion runs first, an invalid decimal is reported before a bad code if both are present.

**Why this example?** The same function has two expected failure points, each with a different remedy. **How do we solve it?** Catch `ValueError` for numeric conversion or an invalid lap duration, and `KeyError` for the mapping lookup. Keep each message tied to the operation that actually failed.

<span id="part-3-file"></span>

### 4. Catch a file error at the file boundary

Section 1.6 opened text files. Reading a report that is not there raises `FileNotFoundError`, a specific kind of `OSError`. The book uses `IOError` for file failures; in modern Python, `IOError` is an alias of `OSError`. Catch the specific error when the missing file is an expected situation:

```python
def read_optional_report(filename):
    try:
        with open(filename, "r", encoding="utf-8") as fp:
            return fp.read()
    except FileNotFoundError:
        return None

def read_required_report(filename):
    try:
        with open(filename, "r", encoding="utf-8") as fp:
            return fp.read()
    except OSError as error:
        print("Unable to read the required report:", error)
        raise
```

The first function returns `None` for one **expected absence**; a successful read returns the report's text. Its caller can then print a clear message or create a new report. The second prints context but re-raises other file failures so the caller can decide how to handle them. The exact system error text depends on the filename and operating system; therefore, the example does not claim a fixed error message.

**Why this example?** Files introduce a real failure boundary independent of rider results. **How do we solve it?** Catch `FileNotFoundError` if a missing optional report is normal. For a required report, preserve the exception after adding context rather than pretending the file was read successfully.

<span id="part-3-input"></span>

### 5. Retry invalid input; stop on end of input

The book discusses `ValueError` and `EOFError` when reading console input. An invalid decimal can be retried. End of input means no new reply is available, so repeating the same prompt forever would not help.

```python
from math import isfinite

def read_friday_lap():
    while True:
        try:
            raw = input("Fabio's Friday best lap in seconds: ")
            lap_s = float(raw)
            if not isfinite(lap_s) or lap_s <= 0:
                raise ValueError("Friday lap must be finite and positive")
            return lap_s
        except ValueError:
            print("Enter positive, finite decimal seconds, such as 89.558.")
        except EOFError:
            print("Input ended; no lap was entered.")
            return None

lap_s = read_friday_lap()
if lap_s is not None:
    print("Accepted Friday lap: {:.3f} s".format(lap_s))
```

A run with one invented bad reply followed by Fabio's published value:

```text
Fabio's Friday best lap in seconds: fast
Enter positive, finite decimal seconds, such as 89.558.
Fabio's Friday best lap in seconds: 89.558
Accepted Friday lap: 89.558 s
```

**Why this example?** It shows two distinct recovery choices: retry a wrong format, but end cleanly when the input stream is exhausted. **How do we solve it?** Catch `ValueError` around `float` and loop; catch `EOFError` around `input` and return `None`. The caller checks for `None` before formatting the number.

<span id="part-3-reraise"></span>

### 6. Re-raise an exception when the caller must decide

Sometimes a function knows how to add context but cannot decide how to recover. A bare `raise` **inside an `except` block** re-raises the current exception. The caller can then handle it.

```python
def parse_position(raw):
    try:
        return int(raw)
    except ValueError:
        print("Could not parse a numeric position:", raw)
        raise

try:
    parse_position("P9")  # Invented mistaken input; use "9" for Fabio's P9.
except ValueError:
    print("Caller: ask for the position number without P.")
```

```text
Could not parse a numeric position: P9
Caller: ask for the position number without P.
```

**Why this example?** It separates the parser's knowledge of the failed conversion from the caller's knowledge of what the user should enter next. **How do we solve it?** Print or record local context, use bare `raise` in the handler, and let the caller catch the original `ValueError`. Avoid using bare `raise` when there is no current exception to re-raise.

<span id="part-3-finally"></span>

### 7. Use `else` and `finally` for their distinct jobs

An optional `else` block runs only when the `try` block completes **without an exception**. A `finally` block runs after the attempt whether it succeeded, a handler caught an error, or an exception is still propagating. The book emphasizes `finally` for cleanup; a `with` block is usually clearer for closing files, as shown in Section 1.6.

```python
for raw in ("89.426", "bad"):
    try:
        lap_s = float(raw)
    except ValueError:
        print("Rejected Friday lap text:", raw)
    else:
        print("Accepted Friday lap: {:.3f} s".format(lap_s))
    finally:
        print("Conversion attempt finished")
```

```text
Accepted Friday lap: 89.426 s
Conversion attempt finished
Rejected Friday lap text: bad
Conversion attempt finished
```

**Why this example?** Success, failure, and cleanup are visible without opening a file. **How do we solve it?** Put conversion in `try`, expected error response in `except`, success-only work in `else`, and cleanup in `finally`. Avoid returning from `finally` because that can hide an exception or replace an earlier return.

A bare `except:` catches even interruption and exit signals, so use it sparingly. Catch the specific expected types before a broader handler, and do not silently `pass` over an error that the program still needs to address.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: A Connected Three-Day MotoGP Report

This small program lets a user choose **Marc** or **Fabio** and displays the selected rider's verified Friday, Saturday, and Sunday results. A mistyped code raises `KeyError` during dictionary lookup and receives a useful response. The other two calculations use **matching measures**: Friday best laps with Friday best laps, and Sunday gaps to Bezzecchi with Sunday gaps to Bezzecchi.

```python
records = {
    "MARC": {
        "name": "Marc Márquez",
        "team": "Ducati Lenovo Team",
        "friday_position": 5,
        "friday_lap_s": 89.426,
        "sprint_position": 1,
        "sprint_note": "winner in 19:37.125",
        "grand_prix_position": 6,
        "grand_prix_gap_s": 10.778,
    },
    "FABIO": {
        "name": "Fabio Quartararo",
        "team": "Monster Energy Yamaha MotoGP Team",
        "friday_position": 7,
        "friday_lap_s": 89.558,
        "sprint_position": 9,
        "sprint_note": "+10.248 s to Marc Márquez",
        "grand_prix_position": 9,
        "grand_prix_gap_s": 19.999,
    },
}

try:
    code = input("Rider code (MARC or FABIO): ").strip().upper()
    rider = records[code]
except EOFError:
    print("Input ended; no rider report was selected.")
except KeyError:
    print("Unknown rider code. Enter MARC or FABIO.")
else:
    print("{} — {}".format(rider["name"], rider["team"]))
    print(
        "Friday Practice: P{}, best lap {:.3f} s".format(
            rider["friday_position"], rider["friday_lap_s"]
        )
    )
    print(
        "Saturday Sprint: P{}, {}".format(
            rider["sprint_position"], rider["sprint_note"]
        )
    )
    print(
        "Sunday Grand Prix: P{}, +{:.3f} s to Marco Bezzecchi".format(
            rider["grand_prix_position"], rider["grand_prix_gap_s"]
        )
    )

    friday_difference_s = abs(
        records["FABIO"]["friday_lap_s"] - records["MARC"]["friday_lap_s"]
    )
    sunday_difference_s = abs(
        records["FABIO"]["grand_prix_gap_s"]
        - records["MARC"]["grand_prix_gap_s"]
    )
    print("Calculated Friday best-lap difference: {:.3f} s".format(friday_difference_s))
    print("Calculated Sunday finish difference: {:.3f} s".format(sunday_difference_s))
```

For `MARC`:

```text
Rider code (MARC or FABIO): MARC
Marc Márquez — Ducati Lenovo Team
Friday Practice: P5, best lap 89.426 s
Saturday Sprint: P1, winner in 19:37.125
Sunday Grand Prix: P6, +10.778 s to Marco Bezzecchi
Calculated Friday best-lap difference: 0.132 s
Calculated Sunday finish difference: 9.221 s
```

For `FABIO`, the rider-specific lines become:

```text
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Friday Practice: P7, best lap 89.558 s
Saturday Sprint: P9, +10.248 s to Marc Márquez
Sunday Grand Prix: P9, +19.999 s to Marco Bezzecchi
```

**Why this example?** It brings exception handling into a useful report without making the official data itself an error. A user can mistype a code; the stored session records remain valid. **How do we solve it?**

1. Store each rider's verified values with names that state the session and unit.
2. Read and normalize the code, then attempt the dictionary lookup inside `try`.
3. Catch `KeyError` for an unknown code and `EOFError` for end of input; neither case prints a misleading report.
4. Put the normal report in `else` so it runs only after a successful lookup.
5. Format the two derived differences separately and label what each measures.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Exception Study Cases

<span id="part-5-typo"></span>

### 1. Do not hide a programming typo

**Scenario:** A developer writes `marc_lpa_s` instead of `marc_lap_s`. Python raises `NameError` because the misspelled name was never defined.

**Why this case?** A broad catch can make a code defect look like missing MotoGP data. The result is harder to debug.

**How do we solve it?** Correct the variable name after reading the traceback. Catch `ValueError` around expected user conversion failures, not every exception around the whole program. If a broad outer handler is genuinely needed, record the error and normally re-raise unexpected exceptions.

<span id="part-5-handler"></span>

### 2. Match the handler to the operation

**Scenario:** A program expects `int("9")` for Fabio's Saturday P9 position, but invented input `"P9"` is passed to `int`.

**Why this case?** `int("P9")` raises `ValueError`. Catching only `TypeError` will not handle it:

```python
raw_position = "P9"  # Invented mistaken entry, not a changed official result.

try:
    position = int(raw_position)
except ValueError:
    print("Enter 9 for Fabio's Saturday Sprint position.")
```

```text
Enter 9 for Fabio's Saturday Sprint position.
```

**How do we solve it?** Identify the failing operation and its actual exception type, then catch that type at the input boundary. The official position is still **P9**; the user simply needs to enter its numeric part for `int`.

<span id="part-5-meaning"></span>

### 3. A plausible number can still have the wrong meaning

**Scenario:** A developer accidentally puts Fabio's Saturday Sprint finish gap `10.248` into a list of Friday best-lap seconds.

**Why this case?** Both values are floats, so Python may raise **no exception** even though the calculation is meaningless. Exception handling cannot replace correct data labels.

```python
friday_best_laps_s = {"MARC": 89.426, "FABIO": 89.558}
sprint_gap_to_marc_s = 10.248

print("{:.3f} s".format(
    friday_best_laps_s["FABIO"] - friday_best_laps_s["MARC"]
))
print("Sprint gap to Marc: {:.3f} s".format(sprint_gap_to_marc_s))
```

```text
0.132 s
Sprint gap to Marc: 10.248 s
```

**How do we solve it?** Keep the Friday best-lap mapping and Saturday Sprint gap in separately named variables, then choose values from the same session for each question. The example prints both measures separately so no invalid mixed calculation is presented as a result.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section idea | What to remember | MotoGP notebook example |
| :--- | :--- | :--- |
| Exception | A runtime failure is represented by an object with a type and often a message. | `float("P7")` raises `ValueError` when seconds were expected. |
| Propagation | An uncaught exception travels to the caller and may produce a traceback. | A failed `float` reaches the Friday comparison's caller. |
| Common types | The operation suggests the likely type of failure. | `KeyError` for an unknown rider code; `ZeroDivisionError` for division by zero. |
| `raise` | A function can signal a violated requirement directly. | Reject invented negative Friday lap seconds with `ValueError`. |
| `try` / `except` | Catch a specific expected failure where a useful response is possible. | Ask for decimal seconds again after a conversion failure. |
| Multiple handlers | Different operations can need different recovery messages. | `ValueError` for parsing; `KeyError` for rider lookup. |
| Re-raising | Bare `raise` inside a handler preserves the current exception for the caller. | A position parser adds context, then lets its caller decide. |
| `else` / `finally` | `else` is success-only; `finally` runs after the attempt in either case. | Print a report only for a known rider; finish a conversion attempt cleanly. |
| Data meaning | No exception guarantees that the selected measurements make sense together. | Keep Friday best laps separate from Saturday and Sunday finish gaps. |

> **Mental model:** Find the operation that can fail, decide whether its input violates a rule or Python will raise naturally, and catch only the failures you can handle. Preserve each result's session and unit even when every value is numerically valid.

[🔝 Back to Top](#top)
