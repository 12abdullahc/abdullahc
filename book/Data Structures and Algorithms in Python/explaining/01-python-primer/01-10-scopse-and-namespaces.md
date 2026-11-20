<span id="top"></span>

# Python Primer — Section 1.10: Scopes and Namespaces

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** Name resolution, local and global scopes, namespaces, and functions as first-class objects.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Trace where Python finds a name, distinguish rebinding from changing a shared object, inspect local names, and pass or return a function while reporting verified weekend results.<br>
> **User Prompt:** "Reexplain [Section 1.10] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Names in a Weekend Report](#background)
   - [1. The verified results used below](#background-results)
   - [2. A name belongs to a namespace](#background-model)
2. [Part 1: Section 1.10 — Scopes and Namespaces](#part-1)
   - [1. A name must be found before its value can be used](#part-1-name)
   - [2. A function assignment creates a local binding](#part-1-local)
   - [3. Each function call gets its own local names](#part-1-calls)
   - [4. Search from the nearest scope outward](#part-1-lookup)
   - [5. Reading a local name too early raises `UnboundLocalError`](#part-1-unbound)
   - [6. Inspect names with `dir()` and `vars()`](#part-1-inspect)
   - [7. Rebinding a name differs from changing a shared list](#part-1-shared)
3. [Part 2: First-Class Objects](#part-2)
   - [1. Bind a second name to a function](#part-2-alias)
   - [2. Pass a function to another function](#part-2-pass)
   - [3. Return a function that remembers its session](#part-2-return)
4. [Part 3: A Connected Three-Day MotoGP Report](#part-3)
5. [Part 4: Simple Scope Study Cases](#part-4)
   - [1. A parameter can use the same spelling as an outer name](#part-4-parameter)
   - [2. A missing key is different from a missing name](#part-4-key)
   - [3. Two returned functions can remember different sessions](#part-4-closures)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Names in a Weekend Report

<span id="background-results"></span>

### 1. The verified results used below

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team**. The [Yamaha Factory Racing weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) provide their classifications and times. MotoGP also reported [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | Meaning |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` = `89.426` s | P7; best lap `1:29.558` = `89.558` s | Each time is one rider's quickest Practice lap. |
| Saturday Sprint, 13 laps | P1; winner in `19:37.125` | P9; `+10.248` s to Marc | Position and gap are Sprint finish results. |
| Sunday Grand Prix, 27 laps | P6; `+10.778` s | P9; `+19.999` s | Both gaps are to winner Marco Bezzecchi of Aprilia Racing. |

The Sunday gaps share a winner, so `19.999 - 10.778 = 9.221` seconds is a **calculated** finish difference between Fabio and Marc. Friday's `89.426` and `89.558` are best-lap times, not complete sequences of race laps. We will keep session and measurement labels attached to every value.

<span id="background-model"></span>

### 2. A name belongs to a namespace

Suppose a report defines `session = "Sunday Grand Prix"` at the top of a file. A function may also define its own `session = "Friday Practice"`. The spelling is the same, but the two bindings belong to different **namespaces**. A namespace maps names to objects; the book explains that Python generally implements such mappings with dictionaries. A **scope** is the part of a program where a particular namespace can be used for name lookup.

```text
module namespace:       session → "Sunday Grand Prix"
function-call namespace: session → "Friday Practice"
```

**Why this example?** The two real session labels make it obvious which value a line of code should display. **How do we solve it?** At each use of `session`, identify where that line executes and search the nearest available namespace first. A function's local binding can hide an outer binding without changing it.

> **Mental model:** A name is a label in a namespace. Lookups find a binding; assignments create or replace a binding in the appropriate scope. Two matching spellings do not force two scopes to share one binding.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.10 — Scopes and Namespaces

Section 1.10 begins with a simple need: before Python can evaluate an expression such as `x + y`, it must find the objects named by `x` and `y`. At the top level of a module, assignments normally bind names in that module's global namespace. Inside a function, parameters and ordinary assignments normally bind local names. Python then resolves a used name from the nearest visible scope outward.

<span id="part-1-name"></span>

### 1. A name must be found before its value can be used

Here the two Friday best laps are bound to names before they are subtracted. A deliberately never-bound identifier shows what happens when lookup fails:

```python
marc_best_lap_s = 89.426
fabio_best_lap_s = 89.558

print(
    "Friday best-lap difference: {:.3f} s".format(
        fabio_best_lap_s - marc_best_lap_s
    )
)

try:
    print(not_assigned_yet)
except NameError:
    print("NameError: not_assigned_yet has no binding.")
```

```text
Friday best-lap difference: 0.132 s
NameError: not_assigned_yet has no binding.
```

`NameError` concerns the Python identifier `not_assigned_yet`; it does **not** say a rider is missing from the official classification. The `0.132` seconds are calculated from two published best laps in the same Friday session.

**Why this example?** The book starts from name resolution in an expression. These short assignments show why a lookup succeeds, and the unused identifier shows the failure clearly. **How do we solve it?** Bind names before using them, check their spelling and scope, and only then perform the calculation.

<span id="part-1-local"></span>

### 2. A function assignment creates a local binding

The module-level `session` and the function's `session` are separate. Assigning inside the function does not replace the outer value:

```python
session = "Sunday Grand Prix"

def show_friday_session():
    session = "Friday Practice"
    print("Inside function:", session)

show_friday_session()
print("At module level:", session)
```

```text
Inside function: Friday Practice
At module level: Sunday Grand Prix
```

The inner assignment makes `session` local for that call. The module's `session` still refers to Sunday afterward. The name is reused to demonstrate scope, not to claim the two sessions are interchangeable.

**Why this example?** Friday and Sunday make the two values easy to distinguish. **How do we solve it?** Draw two namespaces, place each assignment in the one where it executes, and read the nearest `session` when each `print` runs.

<span id="part-1-calls"></span>

### 3. Each function call gets its own local names

The book illustrates a call to `count(data, target)` with separate caller and callee namespaces. The caller's list and the parameter `data` can refer to the **same list object**, while `target`, `n`, and `item` are names local to a particular call. We can count Marc's P1 result and Fabio's two P9 results without mixing the counters:

```python
marc_positions = [5, 1, 6]   # Friday, Saturday, Sunday
fabio_positions = [7, 9, 9]  # Friday, Saturday, Sunday

def count(data, target):
    n = 0
    for item in data:
        if item == target:
            n += 1
    return n

print("Marc P1 entries:", count(marc_positions, 1))
print("Fabio P9 entries:", count(fabio_positions, 9))
print("Marc source list:", marc_positions)
```

```text
Marc P1 entries: 1
Fabio P9 entries: 2
Marc source list: [5, 1, 6]
```

For the first call, `data` refers to `marc_positions`, `target` is `1`, and local `n` ends at `1`. The second call creates fresh local bindings, with `data` referring to `fabio_positions`, `target` equal to `9`, and its own `n` ending at `2`. The lists hold **session positions**; adding or counting positions is a programming exercise, not a combined sporting score.

**Why this example?** It mirrors the book's caller-versus-callee diagram while prioritizing Marc and Fabio. **How do we solve it?** Trace each call separately: pair arguments with parameters, start a new local `n`, visit each item, then return the count. A parameter can share the caller's object without sharing the caller's name binding.

<span id="part-1-lookup"></span>

### 4. Search from the nearest scope outward

For ordinary function code, a useful lookup order is **local → enclosing function → module global → built-ins** (often shortened to **LEGB**). This example uses all three custom scopes:

```python
event = "2026 Indonesian GP"

def make_friday_label(rider):
    session = "Friday Practice"

    def label(position):
        return "{}: {}: {} P{}".format(event, session, rider, position)

    return label

marc_label = make_friday_label("Marc Márquez")
fabio_label = make_friday_label("Fabio Quartararo")
print(marc_label(5))
print(fabio_label(7))
```

```text
2026 Indonesian GP: Friday Practice: Marc Márquez P5
2026 Indonesian GP: Friday Practice: Fabio Quartararo P7
```

When `label` runs, `position` is **local** to that call; `session` and `rider` come from the **enclosing** `make_friday_label` call; `event` is **global** to the module. The `print` calls use Python's **built-in** function because no nearer `print` binding was made. Each returned label function keeps the enclosing values from the call that created it.

**Why this example?** The real rider and session names make it possible to point to a value at every lookup level. **How do we solve it?** Start at the line that uses a name, check its local bindings, then enclosing function bindings, module bindings, and finally built-ins. Stop at the first match.

<span id="part-1-unbound"></span>

### 5. Reading a local name too early raises `UnboundLocalError`

An assignment **anywhere** in an ordinary function body makes that name local there unless declared otherwise. That means a read above the assignment does not fall back to a module name:

```python
headline_rider = "Marc Márquez"

def broken_headline():
    print(headline_rider)
    headline_rider = "Fabio Quartararo"

try:
    broken_headline()
except UnboundLocalError:
    print("UnboundLocalError: local headline_rider was read too early.")

def show_headline(current_rider):
    print("Headline rider:", current_rider)

show_headline(headline_rider)
```

```text
UnboundLocalError: local headline_rider was read too early.
Headline rider: Marc Márquez
```

Python treats `headline_rider` inside `broken_headline` as a local name because of its later assignment. The attempted read happens before that local binding exists. [`UnboundLocalError` is a kind of `NameError`](https://docs.python.org/3/reference/executionmodel.html#resolution-of-names). Passing the desired value as a parameter makes the dependency explicit. Python also has `global` and `nonlocal` for deliberate rebinding in outer scopes, but a parameter or return value is simpler for this report.

**Why this example?** It catches a surprising result of Python's local-binding rule. **How do we solve it?** Look through the whole function for assignments to the name. If one exists, supply the value as a parameter or assign the local before reading it.

<span id="part-1-inspect"></span>

### 6. Inspect names with `dir()` and `vars()`

The book introduces `dir()` and `vars()` as ways to inspect a namespace. With no argument, `dir()` gives a list of names in the current local scope; `vars()` gives a mapping of local names to objects. We check only selected names so the example does not depend on every detail of the running environment:

```python
def inspect_friday_result():
    rider = "Marc Márquez"
    position = 5
    print("rider listed by dir:", "rider" in dir())
    local_values = vars()
    print("vars rider:", local_values["rider"])
    print("vars position:", local_values["position"])

inspect_friday_result()
```

```text
rider listed by dir: True
vars rider: Marc Márquez
vars position: 5
```

The first result checks **name membership**; the next two retrieve values by name from the mapping. [`dir()`](https://docs.python.org/3/library/functions.html#dir) is meant for inspection rather than a guaranteed complete account of every possible attribute. Do not use writes to the mapping returned by no-argument `vars()` as a way to change function-local variables; bind local names directly in code.

**Why this example?** It makes the abstract idea of a namespace visible without printing a long, environment-dependent list. **How do we solve it?** Call each inspector where the names are local, check for a known name, then read its corresponding value from `vars()`.

<span id="part-1-shared"></span>

### 7. Rebinding a name differs from changing a shared list

Separate names may still point to the same mutable object. Appending through a local parameter changes the caller's list; assigning that parameter to a new list changes only the local binding:

```python
selected_riders = ["Marc Márquez"]

def extend_selection(rows):
    rows.append("Fabio Quartararo")
    rows = ["Raúl Fernández"]
    print("Inside function:", rows)

extend_selection(selected_riders)
print("Caller list:", selected_riders)
```

```text
Inside function: ['Raúl Fernández']
Caller list: ['Marc Márquez', 'Fabio Quartararo']
```

All three names are real Friday Practice riders. The list is an **illustrative selection**, not the official classification order. `rows.append(...)` acts on the shared list; `rows = [...]` makes the local name refer to a different list. The caller's name still refers to the original, now extended, list.

**Why this example?** It prevents the common mistake “local scope means nothing inside a function can affect the caller.” **How do we solve it?** Ask whether a line **mutates an object** or **rebinds a name**. If the caller's list must remain unchanged, work with a copy or return a new list instead of appending to the shared one.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: First-Class Objects

The book's unnumbered **First-Class Objects** part says functions and classes are values that can be bound to names, passed to other functions, and returned. A `def` statement creates a function object and binds its name to that object. Using another name for the same function does not copy the function.

<span id="part-2-alias"></span>

### 1. Bind a second name to a function

The book assigns another name to `print`. Here the alias announces a real rider and team:

```python
announce = print
announce("Marc Márquez — Ducati Lenovo Team")
print(announce is print)
```

```text
Marc Márquez — Ducati Lenovo Team
True
```

`announce` and `print` refer to the **same** built-in function object. Calling either name invokes it. The new name is a local or global binding according to where the assignment appears; here it is at module level.

**Why this example?** It is the shortest way to see that a function is a value associated with a name. **How do we solve it?** Assign the function object without parentheses, then call it through the new name. Parentheses on the right would call the function immediately instead.

<span id="part-2-pass"></span>

### 2. Pass a function to another function

The book uses `max(..., key=abs)` to demonstrate passing a function object. We can pass a report-specific function to `max` in the same way. The function calculates each selected rider's absolute difference from Marc's Friday best lap:

```python
friday_best_laps_s = {
    "Marc Márquez": 89.426,
    "Fabio Quartararo": 89.558,
}

def difference_from_marc(rider):
    return abs(friday_best_laps_s[rider] - friday_best_laps_s["Marc Márquez"])

most_different_rider = max(friday_best_laps_s, key=difference_from_marc)
print(most_different_rider)
print("Difference: {:.3f} s".format(difference_from_marc(most_different_rider)))
```

```text
Fabio Quartararo
Difference: 0.132 s
```

`max` visits the dictionary's rider-name keys and **calls** `difference_from_marc` for each. The `key=` argument receives the function itself, so it is written `key=difference_from_marc`, without `()`. Here Marc's difference from his own time is `0`, and Fabio's is `0.132` seconds. This is a calculation from published Friday best laps, not a separately published statistic.

**Why this example?** It gives `key=` a meaningful job with real data, while preserving the book's function-as-argument idea. **How do we solve it?** Write a one-argument function that returns the comparison value for each rider, pass that function to `max`, and label the resulting measure accurately.

<span id="part-2-return"></span>

### 3. Return a function that remembers its session

A function can create and return another function. The returned one can still use a name from the enclosing call:

```python
def make_position_line(session):
    def line(rider, position):
        return "{}: {} P{}".format(session, rider, position)
    return line

sprint_line = make_position_line("Saturday Sprint")
sunday_line = make_position_line("Sunday Grand Prix")

print(sprint_line("Marc Márquez", 1))
print(sunday_line("Fabio Quartararo", 9))
```

```text
Saturday Sprint: Marc Márquez P1
Sunday Grand Prix: Fabio Quartararo P9
```

`make_position_line` returns the function object `line`, without calling it. The two calls create two enclosing scopes: one retains `"Saturday Sprint"`, and the other retains `"Sunday Grand Prix"`. A function that retains needed enclosing bindings this way is often called a **closure**. Class definitions also bind a class name to a class object; Chapter 2 develops object and class namespaces in detail.

**Why this example?** It connects first-class functions to the scope rules from Part 1. **How do we solve it?** Bind the session in an outer call, define a small inner function that uses it, return the inner function, then call each returned function with real rider positions.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: A Connected Three-Day MotoGP Report

This program uses a **module namespace** for verified result data, an **enclosing function namespace** for the selected session, and an **inner function namespace** for a rider code. Each reporter is a function value returned by `make_reporter` and passed to `print_two_riders`. Friday best laps and weekend finish results keep their own labels.

```python
RIDER_TEAMS = {
    "MARC": ("Marc Márquez", "Ducati Lenovo Team"),
    "FABIO": ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team"),
}

RESULTS = {
    "Friday Practice": {
        "MARC": (5, "best lap 89.426 s"),
        "FABIO": (7, "best lap 89.558 s"),
    },
    "Saturday Sprint": {
        "MARC": (1, "winner in 19:37.125"),
        "FABIO": (9, "+10.248 s to Marc Márquez"),
    },
    "Sunday Grand Prix": {
        "MARC": (6, "+10.778 s to Marco Bezzecchi"),
        "FABIO": (9, "+19.999 s to Marco Bezzecchi"),
    },
}

def make_reporter(selected_session):
    def report(code):
        rider, team = RIDER_TEAMS[code]
        position, detail = RESULTS[selected_session][code]
        return "{} — {}: P{}, {}".format(rider, team, position, detail)
    return report

def print_two_riders(reporter):
    for code in ("MARC", "FABIO"):
        print("  " + reporter(code))

for session in ("Friday Practice", "Saturday Sprint", "Sunday Grand Prix"):
    print(session)
    print_two_riders(make_reporter(session))
```

```text
Friday Practice
  Marc Márquez — Ducati Lenovo Team: P5, best lap 89.426 s
  Fabio Quartararo — Monster Energy Yamaha MotoGP Team: P7, best lap 89.558 s
Saturday Sprint
  Marc Márquez — Ducati Lenovo Team: P1, winner in 19:37.125
  Fabio Quartararo — Monster Energy Yamaha MotoGP Team: P9, +10.248 s to Marc Márquez
Sunday Grand Prix
  Marc Márquez — Ducati Lenovo Team: P6, +10.778 s to Marco Bezzecchi
  Fabio Quartararo — Monster Energy Yamaha MotoGP Team: P9, +19.999 s to Marco Bezzecchi
```

**Why this example?** A three-day report gives a real reason to keep module data, per-session state, and per-rider inputs separate. It also shows that a returned function can be passed to another function. **How do we solve it?**

1. Store the rider/team lookup and the six published result rows at module level.
2. Pass a session into `make_reporter`; its local `selected_session` becomes the enclosing value for `report`.
3. Let each call of `report(code)` use its local `code`, the enclosing session, and the module-level dictionaries.
4. Return `report` as a function value and pass it to `print_two_riders`.
5. Create a fresh reporter for Friday, Saturday, and Sunday; print both priority riders for each day.

The data contain session summaries only. The code does not invent all 13 Sprint or 27 Grand Prix lap times from a Friday best lap or a finish gap.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Scope Study Cases

<span id="part-4-parameter"></span>

### 1. A parameter can use the same spelling as an outer name

**Scenario:** A caller has a default display rider, and a function receives a rider to display for one call.

**Why this case?** The parameter's spelling can match a module name without replacing that module binding.

```python
rider = "Marc Márquez"

def show_rider(rider):
    print("Inside:", rider)

show_rider("Fabio Quartararo")
print("Outside:", rider)
```

```text
Inside: Fabio Quartararo
Outside: Marc Márquez
```

**How do we solve it?** Treat the argument-to-parameter binding as local to the call. Read the local `rider` inside the function and the module `rider` outside it. Both names are display choices, not claims that either rider changed teams or results.

<span id="part-4-key"></span>

### 2. A missing key is different from a missing name

**Scenario:** An example dictionary contains only Marc. A lookup for Fabio's code fails even though Fabio is a real weekend rider.

**Why this case?** The variable `selected_teams` exists, so name resolution succeeds. The dictionary then lacks the requested key, which is a different problem:

```python
selected_teams = {"MARC": "Ducati Lenovo Team"}

try:
    print(selected_teams["FABIO"])
except KeyError:
    print("KeyError: FABIO is absent from this teaching selection.")
```

```text
KeyError: FABIO is absent from this teaching selection.
```

**How do we solve it?** First ask whether the Python name `selected_teams` is bound. Then ask whether the key is present in that dictionary. Add Fabio's verified team to the selection if the report needs him; do not interpret this teaching `KeyError` as an official missing rider.

<span id="part-4-closures"></span>

### 3. Two returned functions can remember different sessions

**Scenario:** A report needs to reuse one formatter for Friday and another for Sunday.

**Why this case?** Both functions come from the same definition, yet each retains the enclosing session from its own factory call:

```python
def make_session_title(session):
    def title():
        return session
    return title

friday_title = make_session_title("Friday Practice")
sunday_title = make_session_title("Sunday Grand Prix")

print(friday_title())
print(sunday_title())
```

```text
Friday Practice
Sunday Grand Prix
```

**How do we solve it?** Call the factory separately for each real session, keep the returned functions under different names, and call each when needed. The stored session comes from its enclosing scope rather than from the most recent factory call.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section idea | What to remember | MotoGP example |
| :--- | :--- | :--- |
| Name lookup | A used name must resolve to a binding; otherwise `NameError` occurs. | Bind the Friday best-lap names before subtracting them. |
| Local scope | Parameters and ordinary function assignments create local bindings. | The function's Friday `session` does not replace the module's Sunday `session`. |
| Per-call namespace | Each call gets its own parameter and local-name bindings. | `count` starts a new `n` for Marc's P1 and Fabio's P9 counts. |
| Outward lookup | Search local, enclosing, module global, then built-ins for ordinary function code. | A position label reads local `position`, enclosing `rider`, and global `event`. |
| Early local read | A name assigned later in a function is local there; an earlier read can raise `UnboundLocalError`. | Pass the headline rider as a parameter. |
| Introspection | No-argument `dir()` lists local names; `vars()` provides their mapping. | Inspect `rider` and `position` in a Friday result function. |
| Binding versus mutation | Rebinding a local name and changing a shared object have different effects. | Appending Fabio changes the caller's selected list; rebinding `rows` does not. |
| First-class function | A function can be named, passed, or returned like another value. | Return a reporter for each session and pass it to the display function. |

> **Mental model:** At every use of a name, ask which scope supplies its binding. At every assignment, ask which namespace receives the new binding. When a function receives an object, ask separately whether it rebinds a local name or changes the shared object. Functions themselves are values that can be carried between these scopes.

[🔝 Back to Top](#top)
