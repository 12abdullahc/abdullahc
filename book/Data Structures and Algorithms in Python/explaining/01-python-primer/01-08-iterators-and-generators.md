<span id="top"></span>

# Python Primer — Section 1.8: Iterators and Generators

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** Section 1.8 iterable objects, iterators, the `iter` and `next` protocol, and generator functions using `yield`.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Trace how values are produced one at a time, distinguish a reusable iterable from a stateful iterator, and write a generator that yields verified MotoGP weekend results without inventing lap-by-lap data.<br>
> **User Prompt:** "Reexplain [Section 1.8] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Visiting Weekend Results](#background)
   - [1. The verified results used below](#background-results)
   - [2. A sequence of results has a visiting order](#background-order)
2. [Part 1: Section 1.8 — Iterables and Iterators](#part-1)
   - [1. An iterable supplies an iterator](#part-1-iterable)
   - [2. `next` advances one iterator until exhaustion](#part-1-next)
   - [3. A `for` loop and two independent iterators](#part-1-for)
   - [4. A list iterator sees its original list](#part-1-mutation)
   - [5. `range` produces values without a large list](#part-1-range)
   - [6. Dictionary views and materializing values](#part-1-views)
3. [Part 2: Section 1.8 — Generators](#part-2)
   - [1. Replace an accumulated list with `yield`](#part-2-yield)
   - [2. A generator starts on demand and remembers its place](#part-2-state)
   - [3. A generator ends, and a new call starts fresh](#part-2-end)
   - [4. Yield paired factors without scanning every number](#part-2-factors)
   - [5. Use a finite prefix of an infinite generator](#part-2-fibonacci)
4. [Part 3: A Connected Three-Day MotoGP Report](#part-3)
5. [Part 4: Simple Iterator and Generator Study Cases](#part-4)
   - [1. Exhaustion is a normal end, not a missing rider](#part-4-exhaustion)
   - [2. A used generator does not restart itself](#part-4-restart)
   - [3. A best lap is not every lap in a race](#part-4-meaning)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: Visiting Weekend Results

<span id="background-results"></span>

### 1. The verified results used below

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team**. The [Yamaha Factory Racing weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give their classifications, times, and gaps. MotoGP also reported [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | Meaning |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` = `89.426` s | P7; best lap `1:29.558` = `89.558` s | Each time is one rider's quickest lap in Practice. |
| Saturday Sprint | P1; winner in `19:37.125` | P9; `+10.248` s to Marc | The finishing classification covers 13 laps. |
| Sunday Grand Prix | P6; `+10.778` s | P9; `+19.999` s | Both gaps are to winner Marco Bezzecchi of Aprilia Racing after 27 laps. |

The Friday best-lap difference is `89.558 - 89.426 = 0.132` seconds. The Sunday finish difference is `19.999 - 10.778 = 9.221` seconds because both gaps use Bezzecchi as their reference. These are **calculations from published values**, not separate official results. Friday best laps, Saturday Sprint results, and Sunday race gaps remain different measures.

<span id="background-order"></span>

### 2. A sequence of results has a visiting order

Imagine a notebook list with **Friday, Saturday, and Sunday** entries for Marc. A program can visit the entries one at a time instead of copying them all into a new list. The object that remembers “which entry is next” is an **iterator**. A function that produces entries with `yield` creates a **generator**, a convenient kind of iterator.

```text
Friday Practice → Saturday Sprint → Sunday Grand Prix → no more entries
      next()            next()            next()          StopIteration
```

The arrows represent **visits to stored session records**. They are not laps ridden on track. The published Friday time is a best lap, so it cannot supply 13 Sprint lap times or 27 Grand Prix lap times.

**Why this example?** Three real days give an order short enough to trace by hand. **How do we solve it?** Choose a meaningful row order, ask for the next row, and stop when no rows remain. Use the same session and unit labels when a row is displayed.

> **Mental model:** An iterable can provide a fresh iterator. An iterator has a current position. A generator function is a compact way to define an iterator's next values.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.8 — Iterables and Iterators

The book defines an **iterable** as an object from which `iter(obj)` can obtain an iterator. An **iterator** supplies successive values through `next(iterator)`. A list is iterable, but the list itself is not its own iterator.

Section 1.8 names several other iterable sources. The value returned at each step depends on the source:

| Iterable source | Values visited |
| :--- | :--- |
| `("Marc Márquez", "Fabio Quartararo")` | The two names in tuple order. |
| `{"Marc Márquez", "Fabio Quartararo"}` | The two names, with no guaranteed set order. |
| `"MARC"` | The characters `M`, `A`, `R`, `C`; this is a rider code, not four riders. |
| A rider-to-team dictionary | Its **keys**, the rider names; use `.values()` or `.items()` for other views. |
| An opened text file | Its lines, one at a time. |
| A user-defined iterable | Whatever values its `__iter__` method makes available. |

**Why these examples?** They show that “iterable” describes how values can be visited, not one specific data type. **How do we solve it?** Identify the values the source actually supplies, call `iter(source)` when a manual cursor is needed, and use `for` when ordinary traversal is enough. A set does not promise the same order as a tuple or list.

<span id="part-1-iterable"></span>

### 1. An iterable supplies an iterator

```python
friday_riders = ["Marc Márquez", "Fabio Quartararo"]

try:
    next(friday_riders)
except TypeError:
    print("A list is iterable, not an iterator.")

friday_iterator = iter(friday_riders)
print(next(friday_iterator))
```

```text
A list is iterable, not an iterator.
Marc Márquez
```

The list is an **illustrative notebook selection** of two real Friday riders, not the official classification order. Calling `iter(friday_riders)` creates an iterator positioned before its first entry. The first `next` returns Marc and moves that iterator forward.

**Why this example?** The difference between the list and its iterator is easy to miss because both refer to the same selected riders. **How do we solve it?** Ask `iter(list)` for an iterator, then call `next` on that iterator. Do not call `next` directly on the list.

<span id="part-1-next"></span>

### 2. `next` advances one iterator until exhaustion

An iterator remembers how far it has traveled. After its last value, another `next` raises `StopIteration`. This is the normal signal for the end of a traversal, not a claim that a rider is missing from the official results.

```python
friday_riders = ["Marc Márquez", "Fabio Quartararo"]
cursor = iter(friday_riders)

print(next(cursor))  # Marc Márquez
print(next(cursor))  # Fabio Quartararo

try:
    next(cursor)
except StopIteration:
    print("No more selected Friday riders.")
```

```text
Marc Márquez
Fabio Quartararo
No more selected Friday riders.
```

`next(cursor, default)` can return a supplied default instead of raising at exhaustion. For example, `next(cursor, "finished")` would now return `"finished"`. That default is a teaching marker; it is not a rider name.

**Why this example?** Two values let us see each advance and the exact point of exhaustion. **How do we solve it?** Track the cursor before the first entry, after Marc, after Fabio, and at the end. Catch `StopIteration` only when manually calling `next` and a graceful end is needed.

<span id="part-1-for"></span>

### 3. A `for` loop and two independent iterators

A `for` loop gets an iterator from its iterable, asks for values in turn, and ends normally when `StopIteration` signals exhaustion. Starting a new loop over the same list gets a fresh iterator. Two iterators obtained from one list keep **independent positions**:

```python
friday_riders = ["Marc Márquez", "Fabio Quartararo"]

for rider in friday_riders:
    print("Friday selection:", rider)

first_cursor = iter(friday_riders)
second_cursor = iter(friday_riders)

print("First cursor:", next(first_cursor))
print("First cursor:", next(first_cursor))
print("Second cursor:", next(second_cursor))
```

```text
Friday selection: Marc Márquez
Friday selection: Fabio Quartararo
First cursor: Marc Márquez
First cursor: Fabio Quartararo
Second cursor: Marc Márquez
```

**Why this example?** It shows why two reports can traverse the same stored selection without sharing a cursor position. **How do we solve it?** Give each traversal its own call to `iter`. The second cursor can still return Marc even after the first cursor has returned Fabio.

<span id="part-1-mutation"></span>

### 4. A list iterator sees its original list

An iterator created from a list refers to that list; it does not copy its entries. If the list changes before the iterator finishes, the remaining visits can change too:

```python
selected = ["Marc Márquez", "Fabio Quartararo"]
cursor = iter(selected)
print(next(cursor))

selected.append("Raúl Fernández")
print(list(cursor))
```

```text
Marc Márquez
['Fabio Quartararo', 'Raúl Fernández']
```

Raúl Fernández was also a real Friday Practice rider and topped that session, but his **append to this selected notebook list is illustrative**. This list is not the official classification order. Changing a collection during traversal can make a report hard to reason about, so keep a stable list or take a snapshot when the intended selection must not change.

**Why this example?** The new entry appears after the cursor was created, proving the iterator is not an independent list copy. **How do we solve it?** Track the shared list object separately from the cursor's position: the cursor has already passed Marc, then visits the list's current remaining entries.

<span id="part-1-range"></span>

### 5. `range` produces values without a large list

`range` is an iterable that represents a progression of integers without building a list of every value first. It can number the **13 Sprint laps** or **27 Grand Prix laps** without claiming to know each lap's time:

```python
sprint_lap_numbers = range(1, 14)
grand_prix_lap_numbers = range(1, 28)

print(len(sprint_lap_numbers), sprint_lap_numbers[-1])
print(len(grand_prix_lap_numbers), grand_prix_lap_numbers[-1])

large_teaching_range = range(1_000_000)
print(len(large_teaching_range))
print(next(iter(large_teaching_range)))
```

```text
13 13
27 27
1000000
0
```

The million-number range illustrates scale; it is **not** a MotoGP session. `list(large_teaching_range)` would actually create a million-element list, which the example does not need. `range` itself stores a compact description of the progression.

**Why this example?** The real lap counts make `range(start, stop)` concrete, while the larger teaching range shows why a lazy iterable is useful. **How do we solve it?** Set the excluded stop one beyond the final lap number, then request only the values needed.

<span id="part-1-views"></span>

### 6. Dictionary views and materializing values

A dictionary's `keys()`, `values()`, and `items()` return **views** that can be iterated. They do not immediately create separate lists. A view can reflect later changes to its dictionary; `list(...)`, `tuple(...)`, or `set(...)` materializes values when a separate collection is needed.

```python
teams = {
    "Marc Márquez": "Ducati Lenovo Team",
    "Fabio Quartararo": "Monster Energy Yamaha MotoGP Team",
}
names_view = teams.keys()

print(list(names_view))
print(list(teams.values()))
print(list(teams.items()))

teams["Raúl Fernández"] = "SuperFile Trackhouse MotoGP Team"
print(list(names_view))

friday_positions = {"Marc Márquez": 5, "Fabio Quartararo": 7}
print(tuple(friday_positions.values()))
print(sorted(set(friday_positions.values())))
```

```text
['Marc Márquez', 'Fabio Quartararo']
['Ducati Lenovo Team', 'Monster Energy Yamaha MotoGP Team']
[('Marc Márquez', 'Ducati Lenovo Team'), ('Fabio Quartararo', 'Monster Energy Yamaha MotoGP Team')]
['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández']
(5, 7)
[5, 7]
```

All three team associations and the two Friday positions are real weekend facts. Adding Raúl to this **teaching dictionary** demonstrates a live view, not a change to an official entry. Iterating a dictionary while changing its size can raise an error; this example adds the entry **between** traversals.

**Why this example?** Real rider/team pairs make the three dictionary views easy to distinguish. **How do we solve it?** Use `keys` for riders, `values` for teams, and `items` for rider/team pairs. Call `list` when a fixed list is needed; use `tuple` or `set` when those collection properties are wanted.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 1.8 — Generators

The book's unnumbered **Generators** part explains a shorter way to create an iterator. A function containing `yield` is a **generator function**. Calling it returns a generator object; execution of its body begins when the program requests the first value. Each `yield` sends one value out and **pauses** the function, retaining its local state for the next request.

<span id="part-2-yield"></span>

### 1. Replace an accumulated list with `yield`

The book starts with a function that collects factors of an integer in a list, then rewrites it to yield factors one by one. We can use the **27 laps** in Sunday's Grand Prix as the integer. Its factors are an arithmetic exercise, not lap times or race results.

```python
def factors_list(n):
    results = []
    for candidate in range(1, n + 1):
        if n % candidate == 0:
            results.append(candidate)
    return results

def factors(n):
    for candidate in range(1, n + 1):
        if n % candidate == 0:
            yield candidate

print(factors_list(27))

factor_stream = factors(27)
print(next(factor_stream))
print(list(factor_stream))
```

```text
[1, 3, 9, 27]
1
[3, 9, 27]
```

`factors_list(27)` builds and returns all four factors at once. `factors(27)` returns a generator; the first `next` obtains `1`, and `list(factor_stream)` consumes only the **remaining** factors. The generator can avoid storing the full result list.

**Why this example?** `27` is a verified Grand Prix lap count, and its few factors can be checked by division. **How do we solve it?** For each candidate, test whether the remainder `n % candidate` is zero. Append to a list when all answers are needed together; use `yield` when values can be produced as they are requested.

<span id="part-2-state"></span>

### 2. A generator starts on demand and remembers its place

A weekend report has a natural three-row sequence. This generator scans verified placement rows and yields only those for the selected rider. The `print` at the top of its body helps show **when** that body starts:

```python
weekend_positions = [
    ("Friday Practice", "Marc Márquez", 5),
    ("Friday Practice", "Fabio Quartararo", 7),
    ("Saturday Sprint", "Marc Márquez", 1),
    ("Saturday Sprint", "Fabio Quartararo", 9),
    ("Sunday Grand Prix", "Marc Márquez", 6),
    ("Sunday Grand Prix", "Fabio Quartararo", 9),
]

def positions_for(rider, rows):
    print("Scanning for", rider)
    for session, name, position in rows:
        if name == rider:
            yield (session, position)

marc_stream = positions_for("Marc Márquez", weekend_positions)
print("Generator created")
print(next(marc_stream))
print(next(marc_stream))
print(list(marc_stream))

fabio_stream = positions_for("Fabio Quartararo", weekend_positions)
print(list(fabio_stream))
```

```text
Generator created
Scanning for Marc Márquez
('Friday Practice', 5)
('Saturday Sprint', 1)
[('Sunday Grand Prix', 6)]
Scanning for Fabio Quartararo
[('Friday Practice', 7), ('Saturday Sprint', 9), ('Sunday Grand Prix', 9)]
```

The first scan starts on the **first `next`**, not when `positions_for(...)` is called. After yielding Friday P5, the generator keeps its place and continues toward Saturday P1. A separate call makes a fresh generator for Fabio. These numbers are **session placements**, not lap counts or timing gaps.

**Why this example?** Marc's and Fabio's real three-day positions show both saved state and independent generator calls without inventing lap-by-lap data. **How do we solve it?** Put a `for` loop inside the generator, filter rows by the requested rider, and `yield` one matching row each time the caller requests another value.

<span id="part-2-end"></span>

### 3. A generator ends, and a new call starts fresh

A generator is itself an iterator: `iter(generator) is generator`. Once it is exhausted, it stays exhausted. The `for` loop or `list(...)` handles its final `StopIteration` automatically. A bare `return` can end a generator early.

Modern Python also permits `return value` inside a generator, although the book simplifies this point. That value is **not another yielded row**; it is attached to the final `StopIteration` for code that catches it explicitly:

```python
def one_friday_position():
    yield ("Friday Practice", "Marc Márquez", 5)
    return "report complete"

stream = one_friday_position()
print(iter(stream) is stream)
print(next(stream))

try:
    next(stream)
except StopIteration as finished:
    print(finished.value)

print(list(stream))
print(list(one_friday_position()))
```

```text
True
('Friday Practice', 'Marc Márquez', 5)
report complete
[]
[('Friday Practice', 'Marc Márquez', 5)]
```

**Why this example?** The single real Friday placement isolates the difference between a **yielded result** and an end marker. **How do we solve it?** Use `yield` for each report row. Stop by reaching the function's end or using bare `return` in ordinary generators. If a value is returned, read it from `StopIteration.value` only when that advanced behavior is actually needed. Call the generator function again for a fresh traversal.

<span id="part-2-factors"></span>

### 4. Yield paired factors without scanning every number

The book improves its factors generator by checking candidates only up to the square root. If `candidate` divides `n`, both `candidate` and `n // candidate` are factors. A perfect square has one middle factor, which must be yielded only once:

```python
def paired_factors(n):
    candidate = 1
    while candidate * candidate < n:
        if n % candidate == 0:
            yield candidate
            yield n // candidate
        candidate += 1
    if candidate * candidate == n:
        yield candidate

print(list(paired_factors(13)))
print(list(paired_factors(27)))
print(list(paired_factors(9)))
```

```text
[1, 13]
[1, 27, 3, 9]
[1, 9, 3]
```

`13` is the Sprint lap count, `27` is the Grand Prix lap count, and `9` is Fabio's P9 finish position in both weekend races. Their factors are **mathematical teaching outputs**, not official sporting measurements. The paired results are not necessarily sorted. For `9`, the middle factor `3` appears only once.

**Why this example?** The three small verified integers show a prime, a composite number, and a perfect square. **How do we solve it?** Test while `candidate² < n`, yield each factor pair when the division is exact, then check the equal square-root case once.

<span id="part-2-fibonacci"></span>

### 5. Use a finite prefix of an infinite generator

The book ends with a generator for the Fibonacci sequence. Its loop has no natural end, but `yield` lets the caller request only a finite prefix:

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

sequence = fibonacci()
first_seven = []
for _ in range(7):
    first_seven.append(next(sequence))
print(first_seven)
```

```text
[0, 1, 1, 2, 3, 5, 8]
```

These are mathematical sequence values, **not MotoGP positions or lap times**. The seven requests are a teaching limit. Calling `list(fibonacci())` would keep requesting values without reaching a normal end.

**Why this example?** It shows why on-demand production matters even when a sequence is potentially infinite. **How do we solve it?** Keep the two most recent numbers as local state, `yield` the current one, update the pair, and make the caller set a finite limit on the number of requests.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: A Connected Three-Day MotoGP Report

The program below stores six verified result rows: one for each priority rider on each day. The generator `rows_for` yields only the selected rider's rows. A `for` loop consumes one fresh generator per rider, so both reports cover Friday, Saturday, and Sunday in order.

```python
riders = {
    "MARC": ("Marc Márquez", "Ducati Lenovo Team"),
    "FABIO": ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team"),
}

weekend_rows = [
    ("Friday Practice", "MARC", 5, "best lap 89.426 s"),
    ("Friday Practice", "FABIO", 7, "best lap 89.558 s"),
    ("Saturday Sprint", "MARC", 1, "winner in 19:37.125"),
    ("Saturday Sprint", "FABIO", 9, "+10.248 s to Marc Márquez"),
    ("Sunday Grand Prix", "MARC", 6, "+10.778 s to Marco Bezzecchi"),
    ("Sunday Grand Prix", "FABIO", 9, "+19.999 s to Marco Bezzecchi"),
]

def rows_for(code, rows):
    for session, row_code, position, detail in rows:
        if row_code == code:
            yield "{}: P{}, {}".format(session, position, detail)

for code in ("MARC", "FABIO"):
    name, team = riders[code]
    print("{} — {}".format(name, team))
    for line in rows_for(code, weekend_rows):
        print("  " + line)
```

```text
Marc Márquez — Ducati Lenovo Team
  Friday Practice: P5, best lap 89.426 s
  Saturday Sprint: P1, winner in 19:37.125
  Sunday Grand Prix: P6, +10.778 s to Marco Bezzecchi
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
  Friday Practice: P7, best lap 89.558 s
  Saturday Sprint: P9, +10.248 s to Marc Márquez
  Sunday Grand Prix: P9, +19.999 s to Marco Bezzecchi
```

**Why this example?** It uses `yield` for a real report task instead of only for numeric sequences. Marc and Fabio each have a fresh three-row traversal, with every result labeled by session and type. **How do we solve it?**

1. Store the published row facts in Friday, Saturday, Sunday order.
2. Define `rows_for` to scan the rows and `yield` only matching rider codes.
3. Call `rows_for` separately for Marc and Fabio, producing independent generators.
4. Let the `for` loop consume each generator until normal exhaustion.
5. Print the rider and team once, then each yielded session result.

The generator filters **stored classifications**. It cannot generate unknown lap-by-lap times from the published best-lap and finishing summaries.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Iterator and Generator Study Cases

<span id="part-4-exhaustion"></span>

### 1. Exhaustion is a normal end, not a missing rider

**Scenario:** A manual cursor has already returned both riders in our illustrative Friday selection.

**Why this case?** A final `next` raises `StopIteration` because the cursor is used up, even though both real riders are present in the source results.

```python
cursor = iter(["Marc Márquez", "Fabio Quartararo"])
print(next(cursor))
print(next(cursor))
print(next(cursor, "finished"))
```

```text
Marc Márquez
Fabio Quartararo
finished
```

**How do we solve it?** Use a `for` loop for ordinary traversal, or give manual `next` a default when the end is expected. The string `"finished"` is a sentinel, not a third rider.

<span id="part-4-restart"></span>

### 2. A used generator does not restart itself

**Scenario:** We need to read a two-rider Friday best-lap stream twice.

**Why this case?** A generator remembers its position; asking the same exhausted object again gives no more values.

```python
def selected_friday_best_laps_s():
    yield ("Marc Márquez", 89.426)
    yield ("Fabio Quartararo", 89.558)

stream = selected_friday_best_laps_s()
print(list(stream))
print(list(stream))
print(list(selected_friday_best_laps_s()))
```

```text
[('Marc Márquez', 89.426), ('Fabio Quartararo', 89.558)]
[]
[('Marc Márquez', 89.426), ('Fabio Quartararo', 89.558)]
```

**How do we solve it?** Call the generator function again to create a fresh stream. If the program must revisit the same values repeatedly, materialize them once with `list(...)` and reuse that list.

<span id="part-4-meaning"></span>

### 3. A best lap is not every lap in a race

**Scenario:** A program has Friday best laps for Marc and Fabio plus Saturday and Sunday finish information, but a report asks for every lap time of each race.

**Why this case?** A generator changes **how known data are delivered**, not which data are known. The published Friday best laps do not reveal all 13 Sprint or 27 Grand Prix lap times.

**How do we solve it?** Yield only the verified session rows available in the source. If a report genuinely needs lap-by-lap times, obtain a separate official lap-time dataset before writing a generator over it. Keep `89.426` and `89.558` seconds labeled as Friday **best laps**, and `+10.248`, `+10.778`, and `+19.999` seconds labeled as finish gaps from their respective races.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section idea | What to remember | MotoGP example |
| :--- | :--- | :--- |
| Iterable | Supplies a fresh iterator through `iter(obj)`. | A list of Marc and Fabio's selected Friday entries. |
| Iterator | Has a current position and returns one value per `next` call. | Visit Marc, then Fabio, then reach the end. |
| `StopIteration` | Signals that an iterator has no next value; `for` handles it. | A three-day report ends after Sunday. |
| Independent iterators | Two iterators over one list keep separate positions. | One cursor reaches Fabio while another still starts at Marc. |
| Lazy iterable | Represents values without immediately building a list. | `range(1, 28)` represents Sunday lap numbers 1–27. |
| Dictionary views | `keys`, `values`, and `items` can reflect later dictionary changes. | View real rider/team pairs. |
| Generator | A function with `yield` returns a stateful iterator. | Yield Friday, Saturday, and Sunday rows for one rider. |
| Yield and resumption | The body pauses at `yield` and continues on the next request. | After Marc's Friday P5, the next match is Saturday P1. |
| Generator exhaustion | A used generator stays used; call the function again for a fresh one. | Produce a new Friday best-lap stream for a second pass. |
| Data meaning | Laziness never creates missing facts. | A best lap is not a full sequence of lap times. |

> **Mental model:** Ask whether you have an iterable or an already-moving iterator. Use `iter` and `next` to trace one step at a time, `for` for normal traversal, and `yield` when a function should produce values on demand. Label every yielded MotoGP value by its actual session and measure.

[🔝 Back to Top](#top)
