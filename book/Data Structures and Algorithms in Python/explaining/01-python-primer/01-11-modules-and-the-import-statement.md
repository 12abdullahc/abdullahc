<span id="top"></span>

# Python Primer — Section 1.11: Modules and the Import Statement

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** Module namespaces, import forms, creating a module, standard-library modules, and pseudo-random number generation.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Choose an import form, organize reusable code in a `.py` module, understand when module code runs, and use standard-library tools without confusing demonstrations with official race results.<br>
> **User Prompt:** "Reexplain [Section 1.11] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Reusing Weekend-Report Code](#background)
   - [1. The verified results used below](#background-results)
   - [2. A module is a reusable namespace](#background-model)
2. [Part 1: Section 1.11 — Modules and Imports](#part-1)
   - [1. Built-in names and standard-library modules](#part-1-builtins)
   - [2. `import module` and `from module import name`](#part-1-forms)
   - [3. Aliases and why wildcard imports obscure names](#part-1-aliases)
3. [Part 2: Creating a New Module](#part-2)
   - [1. Put reusable work in one `.py` file](#part-2-files)
   - [2. Run a module directly or import it](#part-2-main)
   - [3. Find the module and understand first-import execution](#part-2-search)
4. [Part 3: Section 1.11.1 — Existing Modules](#part-3)
   - [1. Ten standard-library modules named by the book](#part-3-table)
   - [2. Use `math.fsum` for a labeled calculation](#part-3-math)
5. [Part 4: Pseudo-Random Number Generation](#part-4)
   - [1. Deterministic values can look random](#part-4-idea)
   - [2. The six random methods in the section](#part-4-methods)
   - [3. Seed and separate generator instances](#part-4-seed)
6. [Part 5: A Connected Three-Day MotoGP Report in Two Files](#part-5)
7. [Part 6: Simple Import and Randomness Study Cases](#part-6)
   - [1. A direct import does not bind the module name](#part-6-direct)
   - [2. A local file name can hide a library module](#part-6-shadow)
   - [3. A random draw is not a sporting result](#part-6-sport)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Reusing Weekend-Report Code

<span id="background-results"></span>

### 1. The verified results used below

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team**. The [Yamaha Factory Racing weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give their classifications and times. MotoGP also reported [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | Meaning |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` = `89.426` s | P7; best lap `1:29.558` = `89.558` s | Each time is one rider's quickest Practice lap. |
| Saturday Sprint, 13 laps | P1; winner in `19:37.125` | P9; `+10.248` s to Marc | Position and gap are Sprint finish results. |
| Sunday Grand Prix, 27 laps | P6; `+10.778` s | P9; `+19.999` s | Both gaps are to winner Marco Bezzecchi of Aprilia Racing. |

The Friday best-lap difference is `89.558 - 89.426 = 0.132` seconds. This is **our calculation** from two published Friday times. It is not the Saturday Sprint gap, the Sunday Grand Prix gap, or a sequence of every lap time.

<span id="background-model"></span>

### 2. A module is a reusable namespace

Imagine putting rider/team names and verified session rows in `weekend_data.py`. A second file can import that module to print a report, and a third file could import it to make a chart. Each file can reuse the same definitions without copying the data by hand.

```text
weekend_data.py  →  definitions for riders and Friday/Saturday/Sunday rows
       ↑
import weekend_data
       ↑
report_weekend.py  →  reads the definitions and prints a report
```

An imported module is an **object** with its own namespace. With `import weekend_data`, a caller uses a qualified name such as `weekend_data.RIDER_TEAMS`. With `from weekend_data import RIDER_TEAMS`, the name `RIDER_TEAMS` is bound directly in the caller's namespace. The first form makes the source of the name visible at each use.

**Why this example?** Weekend reporting has more than one possible output, so shared data is a natural reason to make a module. **How do we solve it?** Put reusable definitions in one `.py` file, import them where needed, and keep each result labeled by its real session and measure.

> **Mental model:** `import` finds a module, executes its initialization when needed, and binds a name. The imported file keeps its own namespace; the caller chooses whether to refer to the module or to specific imported names.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.11 — Modules and Imports

Python provides a small set of always-available **built-in** names, including `abs`, `min`, `max`, and `round`. Other reusable functions live in modules, such as `math`. Importing lets one file use those definitions while keeping the module's names organized.

The book also illustrates `math.sin`, `math.cos`, and `math.sqrt`, and the constants `math.pi` and `math.e`. They share the `math` namespace even though each serves a different calculation.

<span id="part-1-builtins"></span>

### 1. Built-in names and standard-library modules

`min` needs no import. `sqrt` comes from `math`, so we must import the module before using `math.sqrt`:

```python
import math

marc_friday_best_lap_s = 89.426
fabio_friday_best_lap_s = 89.558
sprint_lap_count = 13

print("Quicker Friday best lap: {:.3f} s".format(
    min(marc_friday_best_lap_s, fabio_friday_best_lap_s)
))
print("Square root of 13: {:.3f}".format(math.sqrt(sprint_lap_count)))
```

```text
Quicker Friday best lap: 89.426 s
Square root of 13: 3.606
```

The quicker published Friday best lap belongs to Marc because a **smaller** lap time is quicker. The square root of the 13-lap Sprint count is only a **mathematical demonstration** of `math.sqrt`; `3.606` is not a MotoGP timing or lap count.

**Why this example?** The two calls make the built-in/module boundary visible. **How do we solve it?** Call `min` directly, then write `import math` before calling `math.sqrt` for the separate teaching calculation.

<span id="part-1-forms"></span>

### 2. `import module` and `from module import name`

The book shows both forms with `math`. The first binds the **module name**; the second binds the **selected names** directly:

```python
import math
print("Module name:", math.__name__)
print("sqrt through module: {:.3f}".format(math.sqrt(13)))
```

```text
Module name: math
sqrt through module: 3.606
```

```python
from math import pi, sqrt
print("pi: {:.3f}".format(pi))
print("sqrt directly: {:.3f}".format(sqrt(13)))
```

```text
pi: 3.142
sqrt directly: 3.606
```

The first block binds `math`, then looks up its `sqrt` attribute. The second binds `pi` and `sqrt` in the current namespace; it does **not** bind a name `math` there unless another statement imports `math`. `pi` and the square root are math values, not racing results.

**Why this example?** The output is the same for `sqrt(13)`, while the names used to reach the function differ. **How do we solve it?** Use `import math` when a clear `math.` prefix helps readers; use `from math import sqrt` when a few specific names are convenient and unambiguous.

<span id="part-1-aliases"></span>

### 3. Aliases and why wildcard imports obscure names

An alias supplies a shorter local name for the **same** module or imported object:

```python
import math
import math as race_math
from math import sqrt as square_root

print(race_math is math)
print(square_root is math.sqrt)
print("sqrt(27): {:.3f}".format(square_root(27)))
```

```text
True
True
sqrt(27): 5.196
```

The `27` is Sunday's verified Grand Prix lap count; its square root is a teaching calculation. Python does not copy the module or the function when it creates these aliases. The book also shows `from math import *`, which imports many names into the caller's namespace. That makes name origins hard to see and can replace an existing binding with the same spelling, so explicit imports are clearer for a report.

**Why this example?** It shows that imports bind names to objects, just as Section 1.10 described for other assignments. **How do we solve it?** Pick a clear alias only when it improves readability; list the exact imported names instead of using `*`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creating a New Module

The book's unnumbered **Creating a New Module** part puts a reusable `count` function in `utility.py` and imports it elsewhere. Here a small `lap_tools.py` module holds one reusable calculation. Put the two files below in the **same directory** for this introductory example.

<span id="part-2-files"></span>

### 1. Put reusable work in one `.py` file

**File `lap_tools.py`:**

```python
UNIT = "s"

def friday_best_lap_gap_s(marc_s, fabio_s):
    return fabio_s - marc_s

if __name__ == "__main__":
    gap = friday_best_lap_gap_s(89.426, 89.558)
    print("Self-check: {:.3f} {}".format(gap, UNIT))
```

**File `use_lap_tools.py`:**

```python
from lap_tools import friday_best_lap_gap_s

gap = friday_best_lap_gap_s(89.426, 89.558)
print("Friday Marc/Fabio best-lap gap: {:.3f} s".format(gap))
```

The function returns the **calculated difference between two Friday best laps**. Its parameters keep the calculation reusable; the caller supplies the verified values. The `from` import binds only `friday_best_lap_gap_s` in `use_lap_tools.py`.

**Why this example?** A two-argument calculation is small enough to understand as a standalone module, yet useful from another file. **How do we solve it?** Save the first listing as `lap_tools.py`, save the second beside it as `use_lap_tools.py`, then run the caller from that directory.

<span id="part-2-main"></span>

### 2. Run a module directly or import it

With the two files saved, these commands have different outputs:

```text
> python lap_tools.py
Self-check: 0.132 s

> python use_lap_tools.py
Friday Marc/Fabio best-lap gap: 0.132 s
```

When `lap_tools.py` runs directly, its `__name__` is `"__main__"`, so the guarded self-check runs. When `use_lap_tools.py` imports it, its `__name__` is `"lap_tools"`, so the guarded print is skipped while the function remains available. The book notes that a guard like this can hold simple checks that should run only when the module is executed as a script.

**Why this example?** The missing “Self-check” line during import shows the purpose of the guard. **How do we solve it?** Put reusable definitions above the guard; put script-only demonstration or checks inside `if __name__ == "__main__":`.

<span id="part-2-search"></span>

### 3. Find the module and understand first-import execution

Importing a module searches locations on Python's **module search path**, including the running script's directory in the ordinary two-file setup. A module that cannot be found raises `ModuleNotFoundError`. For this example, keeping `lap_tools.py` beside `use_lap_tools.py` makes the import straightforward. [Python's module tutorial](https://docs.python.org/3/tutorial/modules.html#the-module-search-path) explains the wider search path.

On first import in a running interpreter, Python executes the module's top-level statements to establish `UNIT` and the function definition. A later ordinary import of the same module in that interpreter normally reuses the loaded module object; it does not rerun those statements. Running `lap_tools.py` directly is a separate execution with the script name `"__main__"`.

**Why this example?** Import errors and unexpected top-level output are common when code first moves into separate files. **How do we solve it?** Check the file name and search location, keep definitions at module level, and guard work intended only for direct execution.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 1.11.1 — Existing Modules

The **standard library** provides many modules with Python. Section 1.11.1 lists ten useful examples; the list is a map of purposes, not a requirement to import all ten into one program.

<span id="part-3-table"></span>

### 1. Ten standard-library modules named by the book

| Module | Main purpose | Possible weekend-report use |
| :--- | :--- | :--- |
| `array` | Compact arrays of one basic type, often numeric. | Store a long numeric timing series if one is actually available. |
| `collections` | Specialized containers and counting tools. | Count selected result labels. |
| `copy` | Shallow and deep copying. | Make a separate teaching selection before changing it. |
| `heapq` | Heap operations. | Repeatedly retrieve a smallest numeric value. |
| `math` | Mathematical functions and constants. | Sum selected Friday best laps accurately. |
| `os` | Operating-system interfaces. | Work with report file paths and directories. |
| `random` | Pseudo-random values for demonstrations and simulations. | Shuffle a *teaching display order*, never rewrite official results. |
| `re` | Regular-expression matching. | Check a text pattern in a result file. |
| `sys` | Interpreter information and command-line arguments. | Read a script argument selecting a rider. |
| `time` | Clock and elapsed-time utilities. | Measure program runtime, separate from published lap times. |

Some purposes are only possibilities; this guide does **not** claim to have a full lap-time dataset or a local official results file. Each module remains a separate namespace until imported.

**Why this table?** The book uses it to show the breadth of reusable tools without requiring us to learn every API now. **How do we solve it?** State the report task first, choose the matching module, then import only the module or names the task actually needs.

<span id="part-3-math"></span>

### 2. Use `math.fsum` for a labeled calculation

For a concrete standard-library import, calculate the mean of the **two selected Friday Practice best laps**:

```python
from math import fsum

best_laps_s = {
    "Marc Márquez": 89.426,
    "Fabio Quartararo": 89.558,
}
mean_best_lap_s = fsum(best_laps_s.values()) / len(best_laps_s)
print("Selected Friday best-lap mean: {:.3f} s".format(mean_best_lap_s))
```

```text
Selected Friday best-lap mean: 89.492 s
```

This `89.492` seconds is **our calculation**, not an official session statistic. It combines only Marc's and Fabio's published Friday best laps. `fsum` belongs to `math`; `len` remains a built-in.

**Why this example?** It gives an imported library function a real arithmetic task while keeping its result properly labeled. **How do we solve it?** Import `fsum`, total the two comparable Friday times, divide by the number of selected riders, and format to the published thousandth-of-a-second precision.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Pseudo-Random Number Generation

The book's unnumbered **Pseudo-Random Number Generation** part explains that a computer can produce a sequence that appears random but is determined by an internal state. Python's `random` module uses the **Mersenne Twister** generator. Its results suit games and simulations; they are not evidence of what happened in a race.

<span id="part-4-idea"></span>

### 1. Deterministic values can look random

The book illustrates the basic idea with a recurrence of the form `next_state = (a * current_state + b) % n`. Here is a tiny **toy** recurrence, not the algorithm Python's `random` module uses:

```python
state = 1
values = []
for _ in range(4):
    state = (3 * state + 1) % 7
    values.append(state)
print(values)
```

```text
[4, 6, 5, 2]
```

Starting again from `state = 1` repeats the same four values. The small constants `3`, `1`, and `7` are mathematical teaching choices; these outputs are not rider positions, lap counts, or lap times. A **seed** supplies the starting state for a pseudo-random generator.

**Why this example?** Four hand-checkable steps reveal how a fixed start creates a repeatable sequence. **How do we solve it?** Start with `1`, apply the same formula repeatedly, and verify each remainder before moving to the next state.

<span id="part-4-methods"></span>

### 2. The six random methods in the section

Section 1.11 gives these common operations. For the examples below, a local `Random` instance has the same methods as the module-level generator:

| Method | Result | Boundary or effect |
| :--- | :--- | :--- |
| `seed(value)` | Resets the generator state. | The same accepted seed can reproduce a sequence. |
| `random()` | A floating-point value. | `0.0 <= value < 1.0`. |
| `randint(a, b)` | One integer. | Both `a` and `b` are possible. |
| `randrange(start, stop, step)` | One integer from that range. | `stop` is excluded, as with `range`. |
| `choice(sequence)` | One element of a nonempty sequence. | Does not alter the sequence. |
| `shuffle(list)` | Changes a mutable sequence in place. | Returns `None`, not a new shuffled list. |

This code uses real rider names as **labels in a classroom draw** and the verified 13-lap Sprint count as a numeric boundary. It checks properties that stay true without claiming a particular random draw as a sporting fact:

```python
from random import Random

rng = Random(2026)
riders = ["Marc Márquez", "Fabio Quartararo"]

fraction = rng.random()
lap_number_a = rng.randint(1, 13)
lap_number_b = rng.randrange(1, 14)
chosen_display_rider = rng.choice(riders)
display_order = riders.copy()
shuffle_result = rng.shuffle(display_order)

print(0.0 <= fraction < 1.0)
print(lap_number_a in range(1, 14), lap_number_b in range(1, 14))
print(chosen_display_rider in riders)
print(sorted(display_order) == sorted(riders), shuffle_result is None)
```

```text
True
True True
True
True True
```

`randint(1, 13)` may return `13`; `randrange(1, 14)` may also return `13` because `14` is excluded. These are possible **lap numbers**, not recorded lap times. `choice` and `shuffle` affect only teaching display choices. The exact selections may vary across Python versions even with the same seed, so this example prints stable checks instead of a version-specific draw.

**Why this example?** It distinguishes inclusive and exclusive upper bounds and shows that `shuffle` changes a list in place. **How do we solve it?** Seed a local generator, call each method on a suitable input, and check the documented range or effect rather than treating generated values as official results.

<span id="part-4-seed"></span>

### 3. Seed and separate generator instances

Two `Random` objects hold independent state. Giving both the same integer seed makes their first `random()` values agree, while reseeding one object does not change the other:

```python
from random import Random

first = Random(2026)
second = Random(2026)
first_value = first.random()
second_value = second.random()

print(first is second)
print(first_value == second_value)

first.random()  # Advance only the first object.
second.seed(2026)
print(second.random() == second_value)
```

```text
False
True
True
```

Module-level `random.random()` uses a shared default generator; separate `Random(...)` objects let independent demonstrations keep their own state. The [current Python documentation](https://docs.python.org/3/library/random.html#random.seed) accepts `None`, `int`, `float`, `str`, `bytes`, or `bytearray` as seeds; the book's older “any hashable” wording is no longer accurate. The documentation guarantees a compatible seeded `random()` sequence, while some higher-level selection algorithms may change between Python versions. For security tokens, Python provides [`secrets`](https://docs.python.org/3/library/secrets.html), because this pseudo-random generator is deterministic.

**Why this example?** It separates the idea of a reproducible sequence from shared global state. **How do we solve it?** Construct each generator explicitly with a seed, compare equivalent first draws, and advance or reseed only the instance whose sequence you intend to change.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: A Connected Three-Day MotoGP Report in Two Files

The reusable module below stores **six verified result rows**, one for each priority rider on each day. A separate script imports it and prints the rows. The code uses only published Practice best laps and race finish summaries, with no random values in the report.

**File `weekend_data.py`:**

```python
RIDER_TEAMS = {
    "MARC": ("Marc Márquez", "Ducati Lenovo Team"),
    "FABIO": ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team"),
}

WEEKEND_ROWS = [
    ("Friday Practice", "MARC", 5, "best lap 89.426 s"),
    ("Friday Practice", "FABIO", 7, "best lap 89.558 s"),
    ("Saturday Sprint", "MARC", 1, "winner in 19:37.125"),
    ("Saturday Sprint", "FABIO", 9, "+10.248 s to Marc Márquez"),
    ("Sunday Grand Prix", "MARC", 6, "+10.778 s to Marco Bezzecchi"),
    ("Sunday Grand Prix", "FABIO", 9, "+19.999 s to Marco Bezzecchi"),
]

def rows_for(code):
    return [
        (session, position, detail)
        for session, row_code, position, detail in WEEKEND_ROWS
        if row_code == code
    ]
```

**File `report_weekend.py`:**

```python
import weekend_data

for code in ("MARC", "FABIO"):
    rider, team = weekend_data.RIDER_TEAMS[code]
    print("{} — {}".format(rider, team))
    for session, position, detail in weekend_data.rows_for(code):
        print("  {}: P{}, {}".format(session, position, detail))
```

Run the report with both files in one directory:

```text
> python report_weekend.py
Marc Márquez — Ducati Lenovo Team
  Friday Practice: P5, best lap 89.426 s
  Saturday Sprint: P1, winner in 19:37.125
  Sunday Grand Prix: P6, +10.778 s to Marco Bezzecchi
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
  Friday Practice: P7, best lap 89.558 s
  Saturday Sprint: P9, +10.248 s to Marc Márquez
  Sunday Grand Prix: P9, +19.999 s to Marco Bezzecchi
```

**Why this example?** It shows the actual reason to create a module: one file owns the verified data and selection function, while another file uses them to make a report. **How do we solve it?**

1. Save the first listing as `weekend_data.py` and the second as `report_weekend.py` beside it.
2. Keep real rider/team names and the six labeled session results in the data module.
3. Have `rows_for(code)` return only the rows for one rider in Friday, Saturday, Sunday order.
4. Import the module and use qualified names, so each data source remains obvious.
5. Run `python report_weekend.py`; compare the output with the official classifications.

If another script imports `weekend_data`, it can reuse the same facts for a different presentation. Neither script can reconstruct every race lap time from these summary rows.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Import and Randomness Study Cases

<span id="part-6-direct"></span>

### 1. A direct import does not bind the module name

**Scenario:** A program imports only `sqrt` and then tries to use `math.pi`.

**Why this case?** The module was loaded to obtain `sqrt`, but the importing file received only the name requested by its `from` statement:

```python
from math import sqrt

print("sqrt(13): {:.3f}".format(sqrt(13)))
try:
    print(math.pi)
except NameError:
    print("NameError: this file did not bind the name math.")
```

```text
sqrt(13): 3.606
NameError: this file did not bind the name math.
```

**How do we solve it?** Add `import math` if qualified names such as `math.pi` are wanted, or explicitly write `from math import pi` if only `pi` is needed. The square root of the 13-lap count remains a mathematical teaching value.

<span id="part-6-shadow"></span>

### 2. A local file name can hide a library module

**Scenario:** A beginner names a report file `random.py`, then writes `import random` inside it. Python may find that local file when resolving the import, rather than the intended standard-library module.

**Why this case?** An import searches available module locations. The file name determines which module object Python may bind. Naming the report `report_weekend.py` avoids this collision.

**How do we solve it?** Give your own files descriptive names that do not match modules you plan to import. If `import random` lacks an expected attribute such as `Random`, check the imported module's path with `random.__file__` and rename a conflicting local file.

<span id="part-6-sport"></span>

### 3. A random draw is not a sporting result

**Scenario:** A classroom script uses `choice(["Marc Márquez", "Fabio Quartararo"])` to pick who appears first in a practice display.

**Why this case?** The draw changes presentation order only. It cannot decide who actually led Friday Practice, won the Sprint, or finished ahead on Sunday.

**How do we solve it?** Keep the verified classification rows in a data module. Use `random` only for a clearly labeled simulation or display experiment, and never replace the published results with its output.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section idea | What to remember | MotoGP example |
| :--- | :--- | :--- |
| Built-ins | Names such as `min` are available without an import. | Find the quicker of two Friday best-lap times. |
| Module object | `import module` binds a module name and preserves qualified access. | `import weekend_data`, then use `weekend_data.RIDER_TEAMS`. |
| Direct import | `from module import name` binds the selected name in the caller. | Import `friday_best_lap_gap_s` from `lap_tools`. |
| Alias | `as` binds another name to the same object. | `race_math` refers to the `math` module. |
| New module | A `.py` file can hold reusable definitions. | Put published weekend rows in `weekend_data.py`. |
| Main guard | `if __name__ == "__main__":` limits code to direct script execution. | Run the lap-gap self-check without printing it during import. |
| Standard library | Existing modules provide specialized tools. | Use `math.fsum` for a labeled selected-rider calculation. |
| Pseudo-random generator | A seed determines a repeatable sequence within supported guarantees. | Seed a teaching draw; keep it separate from actual race results. |
| `randint` / `randrange` | `randint` includes both endpoints; `randrange` excludes its stop. | Draw an illustrative lap number from 1 through 13. |
| `choice` / `shuffle` | Choose one item; or reorder a mutable list in place. | Change a demonstration's rider display order. |

> **Mental model:** Import the module or names the report needs, keep reusable definitions in a separate file, and use a main guard for direct-run checks. Standard-library functions solve general programming tasks; pseudo-random draws remain demonstrations, while the Friday, Saturday, and Sunday results come from published classifications.

[🔝 Back to Top](#top)
