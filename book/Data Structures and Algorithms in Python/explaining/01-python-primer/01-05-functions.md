<span id="top"></span>

# Python Primer — Section 1.5: Functions

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** Section 1.5 functions; 1.5.1 information passing; and 1.5.2 Python's built-in functions.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Define reusable functions, trace their arguments and return values, recognize caller-visible mutation, and choose useful built-ins for small MotoGP questions.<br>
> **User Prompt:** "Reexplain [Section 1.5] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Reusable Weekend Questions](#background)
   - [1. The published results we will use](#background-results)
   - [2. Why give a calculation a name?](#background-function)
2. [Part 1: Section 1.5 — Functions](#part-1)
   - [1. A function and a method](#part-1-function-method)
   - [2. Definition, signature, body, and call](#part-1-definition)
   - [3. Local names and each call's activation record](#part-1-locals)
   - [4. `return` ends a call; `None` means no returned value](#part-1-return)
3. [Part 2: Section 1.5.1 — Information Passing](#part-2)
   - [1. Formal parameters and actual arguments](#part-2-parameters)
   - [2. Mutating a caller's list versus rebinding a local name](#part-2-mutation)
   - [3. A documented in-place unit conversion](#part-2-in-place)
   - [4. Default values and safe optional mappings](#part-2-defaults)
   - [5. The three `range` call forms](#part-2-range)
   - [6. Positional arguments, keyword arguments, and function objects](#part-2-keywords)
4. [Part 3: Section 1.5.2 — Python's Built-In Functions](#part-3)
   - [1. Built-ins grouped by purpose](#part-3-groups)
   - [2. Mathematics and ordering](#part-3-math)
   - [3. Collections and iteration](#part-3-iteration)
   - [4. Characters and object inspection](#part-3-inspection)
5. [Part 4: A Connected MotoGP Weekend Program](#part-4)
6. [Part 5: Simple MotoGP Study Cases](#part-5)
   - [1. Printing a gap does not return it](#part-5-print-return)
   - [2. A mutable default can retain old riders](#part-5-mutable-default)
   - [3. An empty selection has no mean lap](#part-5-empty)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: Reusable Weekend Questions

<span id="background-results"></span>

### 1. The published results we will use

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team** at Mandalika. The [Yamaha Factory Racing full weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give the classifications, times, and gaps; MotoGP reported [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | Other result used below |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` = `89.426` s | P7; best lap `1:29.558` = `89.558` s | Raúl Fernández of SuperFile Trackhouse MotoGP Team was P1 in `1:28.725` = `88.725` s. |
| Saturday Sprint | P1; won in `19:37.125` over 13 laps | P9; `+10.248` s to Marc | These are Sprint finish results, not single-lap times. |
| Sunday Grand Prix | P6; `+10.778` s | P9; `+19.999` s | Winner Marco Bezzecchi of Aprilia Racing was the common reference for both gaps. |

The **Friday best-lap difference** is `89.558 - 89.426 = 0.132` seconds. The **Sunday finishing difference** is `19.999 - 10.778 = 9.221` seconds because both riders' race gaps are measured from Bezzecchi. These are calculated answers, not separate official results. A function that subtracts two values is useful only when its caller supplies values with a comparable session and unit.

<span id="background-function"></span>

### 2. Why give a calculation a name?

Suppose we need to calculate a gap in several parts of a report. Repeating the subtraction everywhere makes the purpose less clear. A **function** packages steps under a name. The **caller** supplies **arguments**, and the function can **return** a result:

```text
Fabio's Friday best lap, Marc's Friday best lap
                  ↓ arguments
             lap_difference_s
                  ↓ return
       0.132 s best-lap difference
```

**Why this example?** The two real Friday times are simple enough to subtract by hand, so we can focus on what the call receives and returns. **How do we solve it?** Convert both `m:ss.sss` displays to seconds, pass the two numbers in the documented order, and interpret the returned number as a **Friday Practice best-lap** difference.

> **Mental model:** For each function, ask what it receives, what it returns, and whether it changes an object owned by the caller.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.5 — Functions

<span id="part-1-function-method"></span>

### 1. A function and a method

A **function** is called by name, such as `sorted(data)`. A **method** is called through an object with a dot, such as `data.sort()`. Both can perform an operation, but they may affect the object differently:

```python
selected_friday_laps_s = [89.558, 88.725, 89.426]  # Fabio, Raúl, Marc
ordered = sorted(selected_friday_laps_s)
print(ordered)                 # [88.725, 89.426, 89.558]
print(selected_friday_laps_s)  # [89.558, 88.725, 89.426]

selected_friday_laps_s.sort()
print(selected_friday_laps_s)  # [88.725, 89.426, 89.558]
```

**Why this example?** The three published Friday best laps are deliberately listed in a selected, non-ranking order, so sorting has a visible effect. **How do we solve it?** Use `sorted(...)` when the original notebook order must remain available. Use `.sort()` when changing the list itself is intended. This section first defines ordinary functions; methods are developed further later in the book.

<span id="part-1-definition"></span>

### 2. Definition, signature, body, and call

The `def` line gives a function its name and **formal parameters**. The indented statements are its **body**. Defining a function stores the operation; the body runs only when the function is **called**.

```python
def lap_difference_s(slower_lap_s, faster_lap_s):
    difference_s = slower_lap_s - faster_lap_s
    return round(difference_s, 3)

print(lap_difference_s(89.558, 89.426))  # 0.132
```

Read the signature `def lap_difference_s(slower_lap_s, faster_lap_s):` as “expect two best-lap durations already expressed in seconds, with the slower duration first.” The call binds Fabio's `89.558` to `slower_lap_s` and Marc's `89.426` to `faster_lap_s`. The body subtracts and returns the three-decimal result. The names and order make the intended calculation explicit without implying which lap happened first.

**Why this example?** The result can be verified directly: `89.558 - 89.426 = 0.132`. **How do we solve it?** Write the desired input and output first, place the calculation inside `def`, and call it with two **Friday Practice best laps**. A normal Python signature does not require type declarations; an unsuitable argument may cause an error when the call runs.

The book's first function counts a target in data. This MotoGP counterpart counts **mentions in an illustrative notebook list**, not official classification entries:

```python
def count_rider(entries, target):
    count = 0
    for rider in entries:
        if rider == target:
            count += 1
    return count

notes = ["Marc Márquez", "Fabio Quartararo", "Marc Márquez"]
print(count_rider(notes, "Marc Márquez"))  # 2
```

The loop must visit `entries`, the collection being searched. The supplied book's later membership sketch appears to loop over the target instead; that would not perform the intended search.

<span id="part-1-locals"></span>

### 3. Local names and each call's activation record

Each call gets its own **local namespace** for parameters and variables. The book calls the information maintained for a call an **activation record**. A local name with the same spelling as a caller's name is still a separate binding.

```python
def describe_friday_gap(marc_lap_s, fabio_lap_s):
    session = "Friday Practice"  # Local to this call.
    gap_s = fabio_lap_s - marc_lap_s
    return "{}: {:.3f} s".format(session, gap_s)

session = "Sunday Grand Prix"
print(describe_friday_gap(89.426, 89.558))
print(session)
```

```text
Friday Practice: 0.132 s
Sunday Grand Prix
```

**Why this example?** The two values of `session` make the scope boundary visible without mixing the sessions' numeric data. **How do we solve it?** Trace the call: its own `session` and `gap_s` exist while the body runs; returning the text ends the call. The caller's `session` remains `"Sunday Grand Prix"`. A second call receives fresh local bindings. Local names may still refer to the **same mutable object** as a caller's name, as Part 2 shows.

<span id="part-1-return"></span>

### 4. `return` ends a call; `None` means no returned value

`return value` immediately ends the call and sends `value` to the caller. Different paths can return different values. For example, this function stops as soon as it finds the target rider:

```python
def contains_rider(entries, target):
    for rider in entries:
        if rider == target:
            return True
    return False

selected = ["Marc Márquez", "Fabio Quartararo"]
print(contains_rider(selected, "Fabio Quartararo"))  # True
print(contains_rider(selected, "Raúl Fernández"))    # False
```

**Why this example?** It distinguishes “found” from “searched all entries and did not find it.” **How do we solve it?** Return `True` inside the loop on a match. If the loop finishes, return `False` afterward. The first return stops the loop and function immediately.

A bare `return`, or reaching the end of the body without a return, gives the caller `None`. `None` is different from a numeric zero or a meaningful `False` result. Printing a value inside a function also does **not** return that value; Part 5 shows the difference.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 1.5.1 — Information Passing

<span id="part-2-parameters"></span>

### 1. Formal parameters and actual arguments

In a definition, `slower_lap_s` and `faster_lap_s` are **formal parameters**: local names waiting for values. In a call, expressions such as `fabio_lap_s` and `marc_lap_s` are **actual arguments**. Python evaluates those arguments, then binds each formal parameter to the corresponding object.

```python
def lap_difference_s(slower_lap_s, faster_lap_s):
    return round(slower_lap_s - faster_lap_s, 3)

marc_lap_s = 89.426
fabio_lap_s = 89.558
friday_gap_s = lap_difference_s(fabio_lap_s, marc_lap_s)
print(friday_gap_s)  # 0.132
```

| Name | Where it lives | What it refers to during the call |
| :--- | :--- | :--- |
| `fabio_lap_s` | Caller | Friday's `89.558`-second float. |
| `marc_lap_s` | Caller | Friday's `89.426`-second float. |
| `slower_lap_s` | Function call | The same `89.558`-second value passed first. |
| `faster_lap_s` | Function call | The same `89.426`-second value passed second. |
| `friday_gap_s` | Caller, after return | The returned `0.132`-second value. |

**Why this example?** It shows that the caller's names need not match the parameter names. **How do we solve it?** Match each actual argument to its formal parameter by **position**, perform the function body, and bind the returned object to the caller's result name. Passing an object does not automatically copy it.

<span id="part-2-mutation"></span>

### 2. Mutating a caller's list versus rebinding a local name

A list argument is mutable. While the call runs, its parameter and the caller's name can refer to the **same list**. A method such as `.append(...)` changes that shared object; assigning a new list to the parameter moves only the local name.

```python
def add_rider_in_place(riders, name):
    riders.append(name)

def replace_local_selection(riders):
    riders = ["Raúl Fernández"]
    return riders

watchlist = ["Marc Márquez"]
add_rider_in_place(watchlist, "Fabio Quartararo")
print(watchlist)  # ['Marc Márquez', 'Fabio Quartararo']

print(replace_local_selection(watchlist))  # ['Raúl Fernández']
print(watchlist)  # ['Marc Márquez', 'Fabio Quartararo']
```

**Why this example?** A growing notebook selection shows caller-visible change without changing any official result. **How do we solve it?** Draw two names pointing to one list during `add_rider_in_place`; `append` changes that list. In `replace_local_selection`, the parameter is rebound to a new list, leaving the caller's `watchlist` intact. State intentional mutation in a function's name or documentation.

<span id="part-2-in-place"></span>

### 3. A documented in-place unit conversion

The book's `scale(data, factor)` example changes each entry of a numeric list through its index. We can use that pattern for a genuine unit conversion: the Friday best laps `89.426` and `89.558` **seconds** become `89426` and `89558` **milliseconds**. No rider's actual lap changes.

```python
def milliseconds_in_place(times_s):
    """Replace seconds in the caller's list with integer milliseconds."""
    for index in range(len(times_s)):
        times_s[index] = round(times_s[index] * 1000)

friday_laps = [89.426, 89.558]  # Marc and Fabio; values are seconds.
returned = milliseconds_in_place(friday_laps)
print(friday_laps)       # [89426, 89558]; values are now milliseconds.
print(returned is None)  # True
```

**Why this example?** Scaling by `1000` is useful and easy to verify, while showing the same caller-visible mutation as the book's example. **How do we solve it?** Visit each valid index, calculate milliseconds, and assign the converted integer into that position. The function has no explicit `return`, so its result is `None`. Keep the new variable name or documentation clear about the new unit before doing later arithmetic.

<span id="part-2-defaults"></span>

### 4. Default values and safe optional mappings

A **default value** lets a caller omit a trailing argument. The book calls this ability to support several call forms **polymorphic**. Here the default is three decimal places, matching the published Friday timing precision:

```python
def lap_text(seconds, decimals=3):
    return "{:.{}f} s".format(seconds, decimals)

print(lap_text(89.426))     # 89.426 s
print(lap_text(89.426, 2))  # 89.43 s
```

**Why this example?** One formatting function serves a precise display and a shorter display without changing the stored lap time. **How do we solve it?** The first call uses `decimals=3`. The second supplies `2` for that parameter. Required parameters must appear before defaulted ones in a definition; `def lap_text(decimals=3, seconds):` is invalid.

The book's GPA example also lets a caller replace its usual lookup mapping. Our MotoGP counterpart uses **teaching thresholds**, not official Practice categories. The optional mapping is created inside the function when none is supplied:

```python
def practice_band(lap_s, limits=None):
    if limits is None:
        limits = {"first": 89.000, "second": 89.500}
    if lap_s < limits["first"]:
        return "first teaching band"
    if lap_s < limits["second"]:
        return "second teaching band"
    return "outside teaching bands"

print(practice_band(88.725))  # first teaching band
print(practice_band(89.426))  # second teaching band
print(practice_band(89.558))  # outside teaching bands

custom_limits = {"first": 89.500, "second": 90.000}
print(practice_band(89.558, custom_limits))  # second teaching band
```

**Why this example?** The same function can apply a standard or caller-supplied policy while retaining real lap inputs. **How do we solve it?** Use `None` as “no custom mapping supplied,” build the default map for that call, then test thresholds in order. The book writes a dictionary directly as a default in its GPA illustration; creating the dictionary inside the call avoids accidentally sharing a mutable default across calls.

<span id="part-2-range"></span>

### 5. The three `range` call forms

`range` accepts one, two, or three positional arguments. It is technically a built-in class constructor, as the book notes, and it illustrates multiple call forms. The stop value is **excluded**.

```python
print(list(range(3)))        # [0, 1, 2]
print(list(range(1, 4)))     # [1, 2, 3]
print(list(range(1, 8, 2)))  # [1, 3, 5, 7]

sprint_lap_numbers = range(1, 14)
print(len(sprint_lap_numbers), sprint_lap_numbers[0], sprint_lap_numbers[-1])
```

```text
[0, 1, 2]
[1, 2, 3]
[1, 3, 5, 7]
13 1 13
```

**Why this example?** The 13-lap Sprint gives a real reason to generate lap **numbers** from 1 through 13. This is a numbering example, not a list of actual lap times. **How do we solve it?** For `range(start, stop)`, choose `stop=14` to include lap number 13. The three-argument form adds a step.

The book uses `None` to explain how one function can interpret one argument as the **stop** or two arguments as **start and stop**. This small helper demonstrates the idea:

```python
def selected_numbers(start, stop=None, step=1):
    if stop is None:
        stop = start
        start = 0
    return list(range(start, stop, step))

print(selected_numbers(3))        # [0, 1, 2]
print(selected_numbers(1, 4))     # [1, 2, 3]
print(selected_numbers(1, 8, 2))  # [1, 3, 5, 7]
```

<span id="part-2-keywords"></span>

### 6. Positional arguments, keyword arguments, and function objects

**Positional** arguments fill parameters by order. **Keyword** arguments name the parameter to fill and can make a call clearer:

```python
def result_label(rider, position, session="Friday Practice"):
    return "{}: {} P{}".format(session, rider, position)

print(result_label("Marc Márquez", 5))
print(result_label(position=9, rider="Fabio Quartararo", session="Saturday Sprint"))
```

```text
Friday Practice: Marc Márquez P5
Saturday Sprint: Fabio Quartararo P9
```

**Why this example?** Both calls describe real results, but the second call shows that named arguments need not follow the parameter order. **How do we solve it?** Match a positional argument from left to right, or match each keyword to its parameter name. Some APIs have **keyword-only** parameters that must be named.

A function itself can be passed as an argument. `max(..., key=abs)` asks `max` to compare candidates by their **absolute values**. Use a teaching reference of `89.500` seconds for two real Friday laps:

```python
marc_offset_s = round(89.426 - 89.500, 3)  # -0.074 s
fabio_offset_s = round(89.558 - 89.500, 3)  # +0.058 s
offsets = [marc_offset_s, fabio_offset_s]

print(offsets)               # [-0.074, 0.058]
print(max(offsets))          # 0.058
print(max(offsets, key=abs))  # -0.074
```

**Why this example?** The signed offsets make `max` and `max(..., key=abs)` choose different candidates; the reference time is only a teaching benchmark. **How do we solve it?** Without `key`, compare signed numbers. With `key=abs`, Python calls `abs` on each candidate to compare magnitudes, then returns the **original signed candidate**. Pass `abs` without parentheses because the function object is the argument. `sorted` also accepts a `key` function.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 1.5.2 — Python's Built-In Functions

Python supplies built-in functions without requiring us to define them first. The book's Table 1.4 groups common tools by their job. An **iterable** supplies values one after another; a **sequence** such as a list, tuple, or string also supports numeric indices. Sets and dictionaries are iterable but are not numeric-index sequences.

<span id="part-3-groups"></span>

### 1. Built-ins grouped by purpose

| Purpose | Built-ins listed in Section 1.5 | MotoGP notebook use |
| :--- | :--- | :--- |
| Input and output | `print`, `input`, `open` | Display a result; later read user input or a file. |
| Character encoding | `ord`, `chr` | Convert a rider's initial and its Unicode code point. |
| Mathematics | `abs`, `divmod`, `pow`, `round`, `sum` | Gap magnitude, lap-count grouping, powers, precision, total. |
| Ordering | `max`, `min`, `sorted` | Largest or smallest selected value; a new ordered list. |
| Collections and iteration | `range`, `len`, `reversed`, `all`, `any`, `map`, `iter`, `next` | Lap numbers, counts, reverse order, tests, conversions, iterator steps. |
| Object information | `hash`, `id`, `isinstance`, `type` | Inspect an object's hash, identity, or class. |

`input` and `open` are developed with console and file operations in Section 1.6. The iterator protocol behind `iter` and `next` is developed in Section 1.8. We use the built-ins below to answer small, checkable questions now.

<span id="part-3-math"></span>

### 2. Mathematics and ordering

All three values below are **Friday Practice best laps in seconds**, selected from Raúl, Marc, and Fabio. Their total and mean are teaching calculations, not official session statistics.

```python
selected_friday_laps_s = [89.558, 88.725, 89.426]  # Fabio, Raúl, Marc
print("{:.3f}".format(sum(selected_friday_laps_s)))  # 267.709
print(round(sum(selected_friday_laps_s) / len(selected_friday_laps_s), 3))  # 89.236
print(min(selected_friday_laps_s))  # 88.725
print(max(selected_friday_laps_s))  # 89.558
print(sorted(selected_friday_laps_s))  # [88.725, 89.426, 89.558]
print(divmod(27, 13))  # (2, 1)
print(pow(2, 3))       # 8
print(abs(-0.132))     # 0.132
```

**Why this example?** The Friday values make `min` and `max` meaningful within one session, while the published 27 Grand Prix laps and 13 Sprint laps give `divmod` small whole-number inputs. **How do we solve it?** Use `sum` then divide by `len` for a teaching mean; use `min` for the quickest of these three best laps and `max` for the slowest. `divmod(27, 13)` gives two 13-lap groups with one lap left; that grouping is arithmetic, not a racing classification. `pow(2, 3)` counts include/exclude choices for three session views.

`round(x, k)` rounds to `k` decimal places. At an exact half, Python uses the nearest even last digit: `round(2.5)` is `2` and `round(3.5)` is `4`. `pow(x, y, z)` computes a power modulo `z`, useful for integer arithmetic. When printed float results need a fixed number of decimals, `"{:.3f}".format(value)` controls the display; it does not make the underlying float exact.

<span id="part-3-iteration"></span>

### 3. Collections and iteration

`len` counts items; `reversed` supplies items in reverse order; `map` applies a function to successive items. `iter` creates an iterator, and `next` takes its next value.

```python
riders = ["Marc Márquez", "Fabio Quartararo"]

def to_milliseconds(seconds):
    return round(seconds * 1000)

print(len(riders))                    # 2
print(list(reversed(riders)))        # ['Fabio Quartararo', 'Marc Márquez']
print(list(map(to_milliseconds, [89.426, 89.558])))  # [89426, 89558]

visits = iter(riders)
print(next(visits))  # Marc Márquez
print(next(visits))  # Fabio Quartararo
```

**Why this example?** It shows a reusable conversion function applied to both real Friday lap times, and it makes the order of rider visits visible. **How do we solve it?** Pass the function object `to_milliseconds` to `map` without calling it; wrap `map` and `reversed` in `list(...)` to display all supplied values. After these two `next` calls, another `next(visits)` would raise `StopIteration`.

`all` asks whether **every** value is true; `any` asks whether **at least one** is true:

```python
friday_top_ten_checks = [5 <= 10, 7 <= 10]  # Marc P5, Fabio P7
sprint_win_checks = [1 == 1, 9 == 1]       # Marc P1, Fabio P9

print(all(friday_top_ten_checks))  # True
print(any(sprint_win_checks))       # True
print(all([]))                     # True
print(any([]))                     # False
```

**Why this example?** The Friday and Saturday facts give clear yes-or-no collections, kept in separate lists. **How do we solve it?** Apply `all` when every selected condition must hold and `any` when one is enough. For an empty iterable, `all([])` is `True` and `any([])` is `False`; check `len(...)` separately if at least one rider must be present.

<span id="part-3-inspection"></span>

### 4. Characters and object inspection

`ord` maps one Unicode character to its code point; `chr` reverses that mapping. `type` identifies an object's class, and `isinstance` checks membership in a class or its subclasses:

```python
print(ord("M"))                   # 77
print(chr(77))                    # M
print(type(89.426).__name__)      # float
print(isinstance(89.426, float))  # True
```

**Why this example?** “M” is Marc's initial, and `89.426` is a Friday lap stored as a float. **How do we solve it?** Give `ord` a one-character string; give `chr` its integer code point. Use `type` to inspect the specific class and `isinstance` when subclass relationships should count. `id(obj)` reports an identity-related integer; `hash(obj)` produces an integer for a hashable object and supports dictionaries and sets. Their exact integer values are not stable lap times, rider numbers, or list indices, so we do not print fixed values for them.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: A Connected MotoGP Weekend Program

The following program uses small functions to select known riders, calculate two **separate** gaps, and format their weekend results. It also shows a default parameter, a keyword argument, a list parameter, and a returned list. The gap helper receives one mapping at a time: either Friday best laps or Sunday gaps to the **same** winner.

```python
def known_riders(requests, records):
    accepted = []
    for rider in requests:
        if rider in records:
            accepted.append(rider)
    return accepted

def difference_between(values_s, rider_a, rider_b):
    return abs(values_s[rider_a] - values_s[rider_b])

def rider_line(rider, records, decimals=3):
    result = records[rider]
    return "{} ({}) — Friday {:.{}f} s; Sprint P{}; GP P{}, +{:.{}f} s".format(
        rider, result["team"], result["friday_lap_s"], decimals,
        result["sprint_position"], result["race_position"],
        result["race_gap_to_winner_s"], decimals,
    )

records = {
    "Marc Márquez": {
        "team": "Ducati Lenovo Team",
        "friday_lap_s": 89.426,
        "sprint_position": 1,
        "race_position": 6,
        "race_gap_to_winner_s": 10.778,
    },
    "Fabio Quartararo": {
        "team": "Monster Energy Yamaha MotoGP Team",
        "friday_lap_s": 89.558,
        "sprint_position": 9,
        "race_position": 9,
        "race_gap_to_winner_s": 19.999,
    },
}

requests = ["Marc Márquez", "?", "Fabio Quartararo"]
accepted = known_riders(requests, records)
for rider in accepted:
    print(rider_line(rider, records, decimals=3))

if len(accepted) == 2:
    marc, fabio = accepted
    friday_laps_s = {
        marc: records[marc]["friday_lap_s"],
        fabio: records[fabio]["friday_lap_s"],
    }
    sunday_gaps_s = {
        marc: records[marc]["race_gap_to_winner_s"],
        fabio: records[fabio]["race_gap_to_winner_s"],
    }
    friday_gap_s = difference_between(friday_laps_s, marc, fabio)
    sunday_finish_gap_s = difference_between(sunday_gaps_s, marc, fabio)
    print("Friday best-lap difference: {:.3f} s".format(friday_gap_s))
    print("Sunday finish difference: {:.3f} s".format(sunday_finish_gap_s))

print("Accepted:", accepted)
print("Original requests:", requests)
```

**Output:**

```text
Marc Márquez (Ducati Lenovo Team) — Friday 89.426 s; Sprint P1; GP P6, +10.778 s
Fabio Quartararo (Monster Energy Yamaha MotoGP Team) — Friday 89.558 s; Sprint P9; GP P9, +19.999 s
Friday best-lap difference: 0.132 s
Sunday finish difference: 9.221 s
Accepted: ['Marc Márquez', 'Fabio Quartararo']
Original requests: ['Marc Márquez', '?', 'Fabio Quartararo']
```

**Why this example?** Each function has one job: filter a teaching request list, compare like measurements, or format one real rider's results. **How do we solve it?**

1. Store the published facts under names that state their session and unit.
2. Call `known_riders` with the illustrative requests; its local `accepted` list is returned, while the caller's `requests` list stays unchanged.
3. Call `rider_line(..., decimals=3)` for each accepted rider. The keyword names the optional parameter.
4. Build a **Friday best-lap** mapping and a separate **Sunday race-gap** mapping. Call `difference_between` on each mapping separately.
5. Interpret `0.132` seconds as a best-lap difference and `9.221` seconds as the finish difference derived from gaps to Bezzecchi.

The `"?"` entry is illustrative unknown input, not a rider. The two small dictionaries collect values for separate calls without altering the original records. Both calculated differences are displayed to three decimals, without treating a Friday lap and a Sunday race gap as interchangeable.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple MotoGP Study Cases

<span id="part-5-print-return"></span>

### 1. Printing a gap does not return it

**Scenario:** A helper displays Marc and Fabio's Friday best-lap difference, but the caller wants to reuse the numeric answer.

**Why this case?** It separates visible output from a function's returned value.

```python
def show_friday_gap(fabio_s, marc_s):
    print("{:.3f} s".format(fabio_s - marc_s))

answer = show_friday_gap(89.558, 89.426)
print(answer)
```

```text
0.132 s
None
```

**How to solve it:** Use `return` inside the helper, then print in the caller if a display is needed:

```python
def friday_gap_s(fabio_s, marc_s):
    return round(fabio_s - marc_s, 3)

answer = friday_gap_s(89.558, 89.426)
print(answer)          # 0.132
print(answer < 0.200)  # True
```

The second call can compare the returned number to a teaching threshold because the value is available to the caller.

<span id="part-5-mutable-default"></span>

### 2. A mutable default can retain old riders

**Scenario:** We want each call with no supplied list to start a new notebook selection.

**Why this case?** A default list is created once when the function is defined. Mutating it can surprise the next caller.

```python
def collect_badly(rider, selected=[]):
    selected.append(rider)
    return selected

print(collect_badly("Marc Márquez"))      # ['Marc Márquez']
print(collect_badly("Fabio Quartararo"))  # ['Marc Márquez', 'Fabio Quartararo']
```

**How to solve it:** Use `None` as the default and make a fresh list **inside** each call:

```python
def collect_rider(rider, selected=None):
    if selected is None:
        selected = []
    selected.append(rider)
    return selected

print(collect_rider("Marc Márquez"))      # ['Marc Márquez']
print(collect_rider("Fabio Quartararo"))  # ['Fabio Quartararo']
```

These lists are teaching selections, not official classification rows. If a caller explicitly passes a list, this function appends to that caller-owned list as its name and body indicate.

<span id="part-5-empty"></span>

### 3. An empty selection has no mean lap

**Scenario:** We want the mean of selected **Friday Practice best laps**. There may be no selected laps yet.

**Why this case?** Dividing by `len([])` would divide by zero; a function must define what an empty request means.

```python
def mean_lap_s(laps_s):
    if not laps_s:
        return None
    return sum(laps_s) / len(laps_s)

print(mean_lap_s([]))  # None
print("{:.3f}".format(mean_lap_s([89.426, 89.558])))  # 89.492
```

**How to solve it:** Check the list first and return `None` when no mean exists. Otherwise sum only comparable Friday best laps and divide by their count. `89.492` seconds is a **teaching mean of two riders' best laps**, not an official session result.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section idea | What to remember | MotoGP example |
| :--- | :--- | :--- |
| Function definition | `def` gives a name and formal parameters; the indented body runs on a call. | `lap_difference_s(89.558, 89.426)`. |
| Local namespace | Each call has its own parameter and local-name bindings. | The function's `session` does not rebind the caller's `session`. |
| `return` | Ends the call and sends a value back; no value means `None`. | Return `0.132` for further Friday calculations. |
| Information passing | Actual arguments bind to formal parameters; objects are not automatically copied. | `fabio_lap_s` binds to `slower_lap_s`. |
| Mutable arguments | A method or indexed assignment can change the caller's list; local rebinding cannot. | Convert Marc's and Fabio's Friday seconds to milliseconds in place. |
| Defaults and keywords | Defaults allow omitted trailing arguments; keywords name their parameters. | `lap_text(89.426)`; `result_label(position=9, ...)`. |
| Function objects | A callable can be passed without calling it first. | `max(offsets, key=abs)`. |
| Built-ins | Use tools for mathematics, ordering, iteration, encoding, and inspection. | `min` finds Raúl's fastest time among three selected Friday laps. |
| Session meaning | A function is reusable only when its inputs satisfy its intended meaning. | Compare Friday laps together; compare Sunday gaps to the same winner together. |

> **Mental model:** Define the function's inputs, returned value, units, and mutation behavior. Trace one call by binding its arguments to local parameters, running its body, and taking its returned result back to the caller.

[🔝 Back to Top](#top)
