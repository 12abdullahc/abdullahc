<span id="top"></span>

# 1.2 Objects in Python — A MotoGP Weekend Study Guide

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.  
> **Topic:** Section 1.2: objects, assignment, creating and using objects, and Python's built-in classes.  
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.  
> **Learning goal:** Explain what Python names refer to, how objects are created and changed, and when to use each built-in class through small, runnable MotoGP examples.  
> **User Prompt:** "Reexplain [Section 1.2] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One MotoGP Weekend](#background)
   - [1. The weekend facts we will represent](#background-facts)
   - [2. Why Python objects matter](#background-objects)
2. [Part 1: 1.2 Objects in Python](#part-1)
   - [1. Every value has a class](#part-1-values)
   - [2. Names, objects, and types](#part-1-vocabulary)
3. [Part 2: 1.2.1 Identifiers, Objects, and the Assignment Statement](#part-2)
   - [1. Assignment binds a name to an object](#part-2-assignment)
   - [2. Identifier rules](#part-2-identifiers)
   - [3. Aliases, reassignment, and shared lists](#part-2-aliases)
   - [4. The special value `None`](#part-2-none)
4. [Part 3: 1.2.2 Creating and Using Objects](#part-3)
   - [1. Literals, constructors, and returned objects](#part-3-create)
   - [2. Accessors and mutators](#part-3-methods)
   - [3. New sorted list or changed original list?](#part-3-sorting)
5. [Part 4: 1.2.3 Python's Built-In Classes](#part-4)
   - [1. Mutable and immutable objects](#part-4-mutability)
   - [2. `bool`: yes or no](#part-4-bool)
   - [3. `int` and `float`: positions and times](#part-4-numbers)
   - [4. `list`, `tuple`, and `str`: ordered sequences](#part-4-sequences)
   - [5. `set` and `frozenset`: unique values](#part-4-sets)
   - [6. `dict`: look up a rider's result](#part-4-dict)
   - [7. A connected weekend program](#part-4-program)
6. [Part 5: Simple MotoGP Study Cases](#part-5)
   - [1. Preserve an earlier rider selection](#part-5-alias)
   - [2. Convert a displayed lap time](#part-5-time)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: One MotoGP Weekend

<span id="background-facts"></span>

### 1. The weekend facts we will represent

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team** across three sessions at Mandalika. These are the published classifications, not made-up rider results. [Yamaha Factory Racing's full weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) list the times, positions, and teams; MotoGP also reports the [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | What the time measures |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` (`89.426` s) | P7; best lap `1:29.558` (`89.558` s) | One rider's fastest Practice lap. |
| Saturday Sprint | P1; winning time `19:37.125` | P9; `+10.248` s | Total Sprint time or gap to Marc, the Sprint winner. |
| Sunday Grand Prix | P6; `+10.778` s | P9; `+19.999` s | Each rider's gap to race winner Marco Bezzecchi. |

A Friday best lap is a different measure from a Saturday or Sunday finishing gap. We keep the session and unit beside each value. Within Friday Practice, Fabio's best lap minus Marc's best lap is `89.558 - 89.426 = 0.132` seconds. Within Sunday's race, Fabio's gap minus Marc's gap to the **same winner** is `19.999 - 10.778 = 9.221` seconds between their finishes. Both differences are calculations from the published results.

<span id="background-objects"></span>

### 2. Why Python objects matter

To answer even a small weekend question, Python must hold different kinds of information: names and teams are **text**, positions are **whole numbers**, lap times are **decimal numbers**, and a selection of riders is an **ordered collection**. Python represents each of these values as an **object**. Section 1.2 explains how to name objects, create them, use their methods, and choose a suitable built-in class.

```text
Real result → Python object → name that refers to it → operation → answer
```

**Why this example?** The same two real riders give us several kinds of data without changing the story between subsections. **How do we solve a weekend question?** First identify the session and measure; then choose a Python object for each fact and apply an operation appropriate to its class.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.2 Objects in Python

<span id="part-1-values"></span>

### 1. Every value has a class

An **object** is a value Python can work with. Each object is an instance of a **class**, also called its **type**. The class determines which operations make sense: we can subtract two lap times, look up an item in a list, or ask a string to make a lowercase version of itself.

```python
rider_number = 93
marc_friday_lap = 89.426
rider_name = "Marc Márquez"
friday_positions = [5, 7]

print(type(rider_number).__name__)     # int
print(type(marc_friday_lap).__name__)  # float
print(type(rider_name).__name__)      # str
print(type(friday_positions).__name__)  # list
```

**Why this example?** Marc's rider number, a Practice lap in seconds, his name, and a short selection of Friday positions require four different classes. **How do we read it?** `type(value)` asks for the object's class; `.__name__` displays the short class name. The list `[5, 7]` is a teaching selection of Marc's and Fabio's positions, not the full classification.

<span id="part-1-vocabulary"></span>

### 2. Names, objects, and types

| Term | Meaning | Weekend example |
| :--- | :--- | :--- |
| **Object** | A value Python can use. | The float `89.426` or the list `[5, 7]`. |
| **Class / type** | The kind of an object and its available operations. | `float` for `89.426`. |
| **Identifier** | A legal name written in the program. | `marc_friday_lap`. |
| **Binding** | A name referring to an object. | `marc_friday_lap = 89.426`. |
| **Method** | An operation called through an object. | `riders.append("Fabio Quartararo")`. |

An object has a definite type, but a name can later refer to an object of another type:

```python
selected_result = 5
print(type(selected_result).__name__)  # int

selected_result = "Marc Márquez"
print(type(selected_result).__name__)  # str
```

The integer `5` did not turn into text. The name `selected_result` was **rebound** to a different object. This is part of Python's **dynamic typing**. In real programs, a more specific name such as `friday_position` or `rider_name` makes the meaning easier to follow.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.2.1 Identifiers, Objects, and the Assignment Statement

<span id="part-2-assignment"></span>

### 1. Assignment binds a name to an object

In an assignment, Python evaluates the expression on the **right** first. It then binds the identifier on the **left** to the resulting object. The `=` sign performs assignment; `==` asks whether values are equal.

```python
marc_friday_lap = 89.426
fabio_friday_lap = 89.558
lap_difference = fabio_friday_lap - marc_friday_lap

print("{:.3f} s".format(lap_difference))  # 0.132 s
```

**Why this example?** The two values are best laps from the **same** Friday Practice session, so subtraction has a clear meaning. **How do we solve it?** Put both published lap times in seconds, subtract Marc's lower time from Fabio's higher time, and display three decimal places. The result is a best-lap difference, not a Sprint or race finishing gap.

<span id="part-2-identifiers"></span>

### 2. Identifier rules

Python identifiers are **case-sensitive**: `marc_93` and `Marc_93` are different names. An identifier may contain letters, underscores, and digits after the first character; many Unicode letters are also allowed. It cannot start with a digit, contain a hyphen as part of the name, or be a reserved keyword.

| Candidate | Valid? | Reason |
| :--- | :--- | :--- |
| `marc_93`, `fabio_20`, `_draft` | Yes | Letters or underscore first; digits later. |
| `93_marc` | No | Starts with a digit. |
| `marc-time` | No | Python reads `-` as subtraction. |
| `class` | No | Reserved Python keyword. |

**Why these names?** Rider numbers make the rule memorable. **How do we choose a useful name?** Start with a letter, use underscores between words, and include the session or measure when it prevents confusion: `marc_friday_lap` is clearer than `time`.

<span id="part-2-aliases"></span>

### 3. Aliases, reassignment, and shared lists

An **alias** is a second name for the same object. If we later rebind one name, the other name still refers to the original object:

```python
selected_lap = 89.426
original_lap = selected_lap
selected_lap = 89.558

print(original_lap)  # 89.426
print(selected_lap)  # 89.558
```

At first, both names refer to the float `89.426`. The final assignment binds `selected_lap` to the float `89.558`; it does not change the earlier float. We used Marc's and Fabio's Friday lap values so the two bindings are easy to distinguish.

```text
Before: original_lap ──┐
                       ├──→ 89.426
        selected_lap ──┘

After:  original_lap ─────→ 89.426
        selected_lap ──────→ 89.558
```

A **mutable list** behaves differently when it is changed in place:

```python
riders = ["Marc Márquez"]
same_riders = riders
riders.append("Fabio Quartararo")
print(same_riders)  # ['Marc Márquez', 'Fabio Quartararo']

riders = ["Raúl Fernández"]
print(same_riders)  # ['Marc Márquez', 'Fabio Quartararo']
print(riders)       # ['Raúl Fernández']
```

**Why this example?** A rider selection is easy to grow, making the difference between **changing a shared object** and **rebinding a name** visible. **How do we reason about it?** After `same_riders = riders`, draw two arrows to one list. `.append(...)` changes that one list. The last assignment creates another list and moves only the `riders` arrow. These are teaching selections, not full classification lists.

<span id="part-2-none"></span>

### 4. The special value `None`

`None` is the special object used when we mean **no value has been supplied yet**. It is different from `0`, `0.0`, and an empty list.

```python
fabio_sprint_gap = None  # We have not loaded this result yet.
print(fabio_sprint_gap is None)  # True

fabio_sprint_gap = 10.248  # Published gap to Sprint winner Marc.
print(fabio_sprint_gap is None)  # False
```

**Why this example?** It shows a temporary missing value without claiming that Fabio had no Sprint result. **How do we solve it?** Use `is None` to check for the placeholder, then bind the name to the published numeric gap when it is available. `None` is not a lap time and should not be used in arithmetic.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.2.2 Creating and Using Objects

<span id="part-3-create"></span>

### 1. Literals, constructors, and returned objects

The book describes three common ways to obtain an object: write a **literal**, call a **constructor** (a class name followed by parentheses), or call a **function that returns an object**. Its `Widget(...)` notation illustrates a constructor in general. Here are built-in versions that run now:

```python
lap_from_literal = 89.426
lap_from_text = float("89.426")
riders_from_constructor = list(("Marc Márquez", "Fabio Quartararo"))
riders_in_name_order = sorted(riders_from_constructor)

print(lap_from_literal == lap_from_text)  # True
print(riders_from_constructor)            # ['Marc Márquez', 'Fabio Quartararo']
print(riders_in_name_order)               # ['Fabio Quartararo', 'Marc Márquez']
```

**Why this example?** Timing data often arrives as text, while a rider list may be built from another collection. **How do we solve it?** `float("89.426")` converts the numeric string to a float; `list((...))` constructs a list from a tuple; `sorted(...)` returns a new list in alphabetical order. The alphabetical order is for teaching and is not the Practice classification order.

<span id="part-3-methods"></span>

### 2. Accessors and mutators

A **method** is called after an object and a dot. An **accessor** reads information without changing that object; a **mutator** changes a mutable object's contents.

```python
riders = ["Marc Márquez"]
print(riders.count("Marc Márquez"))  # 1
riders.append("Fabio Quartararo")   # mutator
print(riders)  # ['Marc Márquez', 'Fabio Quartararo']

response = "Marc Márquez"
print(response.lower().startswith("marc"))  # True
print(response)  # Marc Márquez
```

**Why this example?** A list method demonstrates a visible change, while a string method demonstrates a new result that leaves the original text alone. **How do we read the chain?** `response.lower()` returns a new lowercase string, then `.startswith("marc")` checks that new string. Strings cannot be changed in place, so `response` remains capitalized.

<span id="part-3-sorting"></span>

### 3. New sorted list or changed original list?

The book compares the function `sorted(data)` with the list method `data.sort()`. Both can order a list, but they affect the original differently:

```python
riders = ["Marc Márquez", "Fabio Quartararo"]
alphabetical = sorted(riders)
print(riders)       # ['Marc Márquez', 'Fabio Quartararo']
print(alphabetical)  # ['Fabio Quartararo', 'Marc Márquez']

result = riders.sort()
print(riders)  # ['Fabio Quartararo', 'Marc Márquez']
print(result)  # None
```

**Why this example?** Our initial list preserves the order in which we selected Marc and Fabio. **How do we choose?** Use `sorted(riders)` when that order must remain available; use `riders.sort()` when changing the list is intended. `.sort()` returns `None`, so do not write `alphabetical = riders.sort()` expecting a sorted list.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 1.2.3 Python's Built-In Classes

<span id="part-4-mutability"></span>

### 1. Mutable and immutable objects

An **immutable** object cannot have its contents changed after creation. Reassigning its name to a new object is allowed. A **mutable** object can be changed in place, so all aliases see that change. The book's built-in class table includes these nine classes:

| Class | Mutable? | Weekend use |
| :--- | :--- | :--- |
| `bool` | No | Did Marc win the Sprint? |
| `int` | No | P1, P5, P7, P9, or rider number `93`. |
| `float` | No | `89.426` seconds for a Friday lap. |
| `list` | Yes | Riders selected in an order. |
| `tuple` | No | One fixed Practice result record. |
| `str` | No | Rider or team name. |
| `set` | Yes | Different team names mentioned. |
| `frozenset` | No | A fixed set of team names. |
| `dict` | Yes | Rider name mapped to a result. |

**Why this table?** The class tells us what kind of operation is safe. **How do we choose?** Decide whether the data needs order, duplicates, key-based lookup, or later changes; then choose the class that supplies those properties.

<span id="part-4-bool"></span>

### 2. `bool`: yes or no

The Boolean values are `True` and `False`. A comparison can produce one. In Saturday's Sprint, Marc finished P1 and Fabio finished P9:

```python
marc_sprint_position = 1
fabio_sprint_position = 9
print(marc_sprint_position == 1)   # True
print(fabio_sprint_position == 1)  # False
print(bool())                      # False
print(bool([]))                    # False
print(bool(["Marc Márquez"]))     # True
```

**Why this example?** “Did the rider win?” is a question with exactly two answers. **How do we solve it?** Compare the position with `1` using `==`. `bool(...)` also reports a value's truth value: zero and empty collections are false; nonzero numbers and nonempty collections are true. `bool()` with no argument is `False`.

<span id="part-4-numbers"></span>

### 3. `int` and `float`: positions and times

An **integer** is a whole number. Python integers can grow to very large magnitudes. The same integer can be written in decimal, binary (`0b`), octal (`0o`), or hexadecimal (`0x`). Marc's rider number, 93, gives one concrete value to compare:

```python
print(93, 0b1011101, 0o135, 0x5d)  # 93 93 93 93
print(int())                         # 0
print(int("93"))                     # 93
print(int("5d", 16))                # 93
print(int(89.426))                   # 89
```

`int("5d", 16)` reads a hexadecimal text value. `int(89.426)` **truncates toward zero**; it does not round the time, and `89` seconds is **not** Marc's recorded lap. For a negative teaching number, `int(-3.9)` would be `-3`. Invalid numeric text, such as `int("P5")`, raises `ValueError`.

A **float** stores a limited-precision approximation of a real number, which suits lap times expressed in seconds:

```python
print(float())          # 0.0
print(float(93))        # 93.0
print(float("89.426"))  # 89.426
print(8.9426e1)        # 89.426
```

`8.9426e1` is scientific notation for `89.426`. `2.0` and `2.` are also float literals. `float("1:29.426")` raises `ValueError` because the minute separator makes the whole string unsuitable for direct conversion. The second study case shows how to convert it. Floats have limited precision, so formatting a computed difference to three decimal places controls its **display**, not the underlying stored value.

**Why use both number classes?** Positions and rider numbers are whole; lap times have fractional seconds. **How do we choose?** Use `int` for a count or position, `float` for a decimal measurement, and preserve the source's unit and session when calculating.

<span id="part-4-sequences"></span>

### 4. `list`, `tuple`, and `str`: ordered sequences

A **sequence** has an order. Its first item has index `0`, not `1`; index `-1` selects the last item. These classes keep order but differ in what they contain and whether they can change.

| Class | Example | Contents | Change in place? |
| :--- | :--- | :--- | :--- |
| `list` | `["Marc Márquez", "Fabio Quartararo"]` | References to objects in a growable sequence. | Yes |
| `tuple` | `("Marc Márquez", 5, 89.426)` | References to objects in a fixed sequence. | No |
| `str` | `"Marc Márquez"` | Unicode characters. | No |

**List.** We can keep a selected subset of Friday Practice riders in classification order. The gaps in their position numbers show that this is not the full classification:

```python
selected_friday_riders = ["Raúl Fernández", "Marc Márquez", "Fabio Quartararo"]
print(selected_friday_riders[0])   # Raúl Fernández
print(selected_friday_riders[-1])  # Fabio Quartararo
print(len(selected_friday_riders))  # 3

copied_selection = list(selected_friday_riders)
print(copied_selection == selected_friday_riders)  # True
print(copied_selection is selected_friday_riders)  # False
```

`[]` makes an empty list. `list(existing_list)` makes a new **outer list** with the same element references. That is a **shallow copy**: nested mutable objects, if present, would still be shared. Lists can grow with `.append(...)` and can contain repeated values.

**Tuple.** A fixed result record can keep several related facts together:

```python
marc_friday = ("Marc Márquez", "Ducati Lenovo Team", 5, 89.426)
print(marc_friday[2])  # 5
print(marc_friday[3])  # 89.426

single_number = (93,)
print(type(single_number).__name__)  # tuple
print(type((93)).__name__)           # int
```

The comma in `(93,)` makes it a one-item tuple; `(93)` only groups the integer. `()` makes an empty tuple. A tuple's positions cannot be assigned to, though a name can be rebound to a different tuple.

**String.** Rider and team names are Unicode text. A one-character selection is still a string:

```python
rider = "Marc Márquez"
print(rider[0])                 # M
print(type(rider[0]).__name__)  # str
print(rider.lower())           # marc márquez
print(rider)                   # Marc Márquez
```

Strings can use single or double quotes. Escape sequences let text include a quote (`'Marc\'s team'`), a backslash (`"\\"`), a tab (`"\t"`), or a newline (`"\n"`). A Unicode escape such as `"\u00E1"` represents `á`; triple-quoted strings can span several lines. A string cannot be changed one character at a time; methods such as `.lower()` return a new string.

**Why these three examples?** A rider selection can grow, a result record has fixed fields, and a name is text. **How do we solve an indexing question?** Choose the right sequence, count from index `0`, and remember that `list` can change while `tuple` and `str` cannot.

<span id="part-4-sets"></span>

### 5. `set` and `frozenset`: unique values

A `set` holds each distinct value once. Suppose our notes mention Marc's Ducati team on Friday, Fabio's Yamaha team on Friday, and Marc's Ducati team again on Saturday. That is a **teaching list of team mentions**, not three different teams:

```python
team_mentions = [
    "Ducati Lenovo Team",
    "Monster Energy Yamaha MotoGP Team",
    "Ducati Lenovo Team",
]
unique_teams = set(team_mentions)
fixed_teams = frozenset(team_mentions)

print(len(team_mentions))  # 3
print(len(unique_teams))   # 2
print(len(fixed_teams))    # 2
print("Ducati Lenovo Team" in unique_teams)  # True
```

**Why this example?** It shows the difference between counting mentions and counting different names. **How do we solve it?** Convert the list to `set` to remove duplicates, then use `len` or `in`. A `frozenset` also keeps unique values, but cannot be changed after creation. A regular `set` can grow with `.add(...)`.

Sets use a hash table, so membership checks with `in` are typically fast. They have no dependable index or display order, so `unique_teams[0]` is invalid and printing a set may show either team first. Members must be **hashable**: strings work; lists do not. A nonempty set may be written as `{"Ducati Lenovo Team"}`. Use `set()` for an empty set; `{}` is an empty **dictionary**.

<span id="part-4-dict"></span>

### 6. `dict`: look up a rider's result

A **dictionary** maps each unique key to a value. Here, a rider's name is the key, and that rider's **Friday Practice best lap in seconds** is the value:

```python
friday_best_laps = {
    "Marc Márquez": 89.426,
    "Fabio Quartararo": 89.558,
}
print(friday_best_laps["Marc Márquez"])  # 89.426

friday_best_laps["Raúl Fernández"] = 88.725
print(len(friday_best_laps))  # 3
```

**Why this example?** We want to retrieve a result by rider name rather than remember a list index. **How do we solve it?** Use `friday_best_laps[name]` to look up the value. Assignment to a new key adds a result; assignment to an existing key replaces that key's value. Keys must be hashable, so strings work and lists do not. Values can be objects of any class. `{}` and `dict()` make empty dictionaries; `dict([("Marc Márquez", 89.426)])` constructs one from key–value pairs. `dict(friday_best_laps)` makes a new dictionary with the same key–value associations.

The jobs are different: a **list** remembers every selected item in order, a **set** answers which distinct items appear, and a **dictionary** looks up a value by key.

<span id="part-4-program"></span>

### 7. A connected weekend program

This teaching program keeps each session in its **own dictionary**. It answers three separate questions: the Friday best-lap difference, Saturday's Sprint places, and the Sunday finish difference. The source results are the classifications linked in the background section.

```python
marc = "Marc Márquez"
fabio = "Fabio Quartararo"

teams = {
    marc: "Ducati Lenovo Team",
    fabio: "Monster Energy Yamaha MotoGP Team",
}
friday_best_lap_s = {marc: 89.426, fabio: 89.558}
sprint_positions = {marc: 1, fabio: 9}
marc_sprint_winning_time = "19:37.125"
fabio_sprint_gap_s = 10.248
sunday_gaps_to_winner_s = {marc: 10.778, fabio: 19.999}

friday_difference = friday_best_lap_s[fabio] - friday_best_lap_s[marc]
sunday_difference = sunday_gaps_to_winner_s[fabio] - sunday_gaps_to_winner_s[marc]

print("{} ({}) / {} ({})".format(marc, teams[marc], fabio, teams[fabio]))
print("Friday Practice best-lap difference: {:.3f} s".format(friday_difference))
print("Saturday Sprint: Marc P{} ({}); Fabio P{} (+{:.3f} s)".format(
    sprint_positions[marc], marc_sprint_winning_time,
    sprint_positions[fabio], fabio_sprint_gap_s,
))
print("Sunday Grand Prix finishing difference: {:.3f} s".format(sunday_difference))
```

**Output:**

```text
Marc Márquez (Ducati Lenovo Team) / Fabio Quartararo (Monster Energy Yamaha MotoGP Team)
Friday Practice best-lap difference: 0.132 s
Saturday Sprint: Marc P1 (19:37.125); Fabio P9 (+10.248 s)
Sunday Grand Prix finishing difference: 9.221 s
```

**Why this example?** It brings strings, floats, integers, and dictionaries into one small program while keeping the three sessions separate. **How do we solve it?** First store each fact with its session and unit. Then look up values for the same question, subtract comparable values, and format the output. Sunday's two gaps share winner Marco Bezzecchi, so their difference gives the time between Marc's and Fabio's finishes. The displayed three decimal places match the published precision; formatting does not alter the stored float.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple MotoGP Study Cases

<span id="part-5-alias"></span>

### 1. Preserve an earlier rider selection

**Scenario:** We want to keep a one-rider selection for comparison before adding Fabio to another list.

**Why this case?** It tests the most important distinction in the assignment diagrams: a second name can share one mutable object.

```python
current_riders = ["Marc Márquez"]
earlier_riders = current_riders  # Alias, not a saved copy.
current_riders.append("Fabio Quartararo")
print(earlier_riders)  # ['Marc Márquez', 'Fabio Quartararo']
```

**How to solve it:** Construct a new list **before** changing the current one. For this simple list of strings, an outer list copy is enough:

```python
current_riders = ["Marc Márquez"]
earlier_riders = list(current_riders)
current_riders.append("Fabio Quartararo")
print(earlier_riders)  # ['Marc Márquez']
print(current_riders)  # ['Marc Márquez', 'Fabio Quartararo']
```

The two lists now have different identities. Their string elements may still be shared, which is safe here because strings are immutable.

<span id="part-5-time"></span>

### 2. Convert a displayed lap time

**Scenario:** Friday Practice displays Marc's best lap as `1:29.426` and Fabio's as `1:29.558`. We want the difference in **seconds**.

**Why this case?** A displayed time is text containing minutes and a colon. `float("1:29.426")` cannot parse that entire string, so we must turn the parts into numbers.

**How to solve it:** Split each string at `:`, convert minutes with `int`, convert seconds with `float`, and calculate `minutes * 60 + seconds`. Then subtract the two Friday values:

```python
marc_text = "1:29.426"
fabio_text = "1:29.558"

marc_minutes, marc_seconds = marc_text.split(":")
fabio_minutes, fabio_seconds = fabio_text.split(":")

marc_lap_s = int(marc_minutes) * 60 + float(marc_seconds)
fabio_lap_s = int(fabio_minutes) * 60 + float(fabio_seconds)
print("Marc: {:.3f} s".format(marc_lap_s))
print("Fabio: {:.3f} s".format(fabio_lap_s))
print("Difference: {:.3f} s".format(fabio_lap_s - marc_lap_s))
```

```text
Marc: 89.426 s
Fabio: 89.558 s
Difference: 0.132 s
```

`.split(":")` returns a two-item list of strings; the assignment gives each item a descriptive name. The difference compares two **best laps from one session**, not their race results.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section idea | What to remember | MotoGP example |
| :--- | :--- | :--- |
| **Object and class** | Every value has a type that determines its operations. | `89.426` is a `float`; `"Marc Márquez"` is a `str`. |
| **Identifier and binding** | A name refers to an object; assignment can rebind it. | `marc_friday_lap = 89.426`. |
| **Alias versus copy** | Two names may share one mutable object; a new list keeps an earlier selection separate. | `same_riders = riders` versus `list(riders)`. |
| **Creation and methods** | Literals, constructors, and functions produce objects; methods may read or change them. | `float("89.426")`, `sorted(riders)`, `riders.append(...)`. |
| **Built-in classes** | Choose based on number, text, order, uniqueness, lookup, and mutability. | `int` position, `list` selection, `set` teams, `dict` results. |
| **Session meaning** | Compare like measurements from the same session. | Friday lap difference `0.132` s; Sunday finish difference `9.221` s. |

> **Mental model:** A Python name points to an object. The object's class tells us what we can do with it, and the session label tells us what the MotoGP value actually means.

[🔝 Back to Top](#top)
