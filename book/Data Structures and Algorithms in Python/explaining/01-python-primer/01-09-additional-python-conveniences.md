<span id="top"></span>

# Python Primer — Section 1.9: Additional Python Conveniences

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** Conditional expressions, comprehension syntax, packing and unpacking, and simultaneous assignment.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Read and write Section 1.9's compact Python forms, explain what each form does, and choose clear examples from verified MotoGP results.<br>
> **User Prompt:** "Reexplain [Section 1.9] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Shorter Code for a Three-Day Report](#background)
   - [1. The verified results used below](#background-results)
   - [2. Four conveniences, four jobs](#background-map)
2. [Part 1: Section 1.9.1 — Conditional Expressions](#part-1)
   - [1. Choose one value with `if ... else`](#part-1-choose)
   - [2. Put a small choice inside a function call](#part-1-argument)
   - [3. Keep a longer decision as an `if` statement](#part-1-readable)
3. [Part 2: Section 1.9.2 — Comprehension Syntax](#part-2)
   - [1. Replace an append loop with a list comprehension](#part-2-list)
   - [2. Filter rows or choose a label for every row](#part-2-filter)
   - [3. Make squares and factors from lap-count integers](#part-2-math)
   - [4. Build a set, dictionary, or generator expression](#part-2-forms)
   - [5. Give a generator expression to `sum`](#part-2-sum)
4. [Part 3: Section 1.9.3 — Packing and Unpacking of Sequences](#part-3)
   - [1. Commas pack values into a tuple](#part-3-pack)
   - [2. Unpack exactly the number of values supplied](#part-3-unpack)
   - [3. Unpack the pair returned by `divmod`](#part-3-divmod)
   - [4. Unpack pairs in loops and dictionary items](#part-3-loops)
5. [Part 4: Simultaneous Assignments](#part-4)
   - [1. Assign several names and swap display order](#part-4-swap)
   - [2. Update two Fibonacci values together](#part-4-fibonacci)
6. [Part 5: A Connected Three-Day MotoGP Report](#part-5)
7. [Part 6: Simple Study Cases](#part-6)
   - [1. Choosing a label is different from filtering a row](#part-6-choose-filter)
   - [2. A dictionary key must identify the intended record](#part-6-keys)
   - [3. Keep unlike session measures separate](#part-6-measures)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: Shorter Code for a Three-Day Report

<span id="background-results"></span>

### 1. The verified results used below

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team**. The [Yamaha Factory Racing weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) list the classifications and times; MotoGP reported [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | What the numbers mean |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5, best lap `1:29.426` = `89.426` s | P7, best lap `1:29.558` = `89.558` s | Each time is one rider's quickest Practice lap. |
| Saturday Sprint, 13 laps | P1, winner in `19:37.125` | P9, `+10.248` s to Marc | Position and gap are Sprint finish results. |
| Sunday Grand Prix, 27 laps | P6, `+10.778` s | P9, `+19.999` s | Both gaps are to winner Marco Bezzecchi of Aprilia Racing. |

**Raúl Fernández**, riding for **SuperFile Trackhouse MotoGP Team**, led Friday Practice in `1:28.725` (`88.725` seconds). We use him only where a three-rider Practice example helps. A calculation such as `89.558 - 89.426 = 0.132` seconds is a difference between two **Friday best laps**. It is not a Saturday or Sunday race gap.

<span id="background-map"></span>

### 2. Four conveniences, four jobs

Section 1.9 introduces compact forms for common tasks:

| Task | Python form | Weekend question |
| :--- | :--- | :--- |
| Choose one value | `a if condition else b` | Which rider had the quicker Friday best lap? |
| Build a collection | `[expression for item in source]` | Which selected Friday riders were in the top five? |
| Match a record's fields to names | `name, team, position = record` | Who rode for which team and finished where? |
| Update several names together | `left, right = right, left` | How can a report reverse its display order? |

The concise form should make the **meaning** easier to see. A comprehension does not create facts absent from the source, and a short expression is not automatically clearer than a few ordinary statements.

**Why these examples?** A three-day result set gives small, real records that can be transformed without inventing lap-by-lap data. **How do we solve them?** First identify the session, rider, and measure; then use the Python form that matches the actual task.

> **Mental model:** Conditional expressions choose; comprehensions build or stream; unpacking names the parts of a record; simultaneous assignment updates names from the old values together.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.9.1 — Conditional Expressions

The pattern `value_if_true if condition else value_if_false` is an **expression**: it produces one value. Python checks the condition first and evaluates only the selected side. It is useful when an ordinary `if`/`else` would assign one of two short values, especially when the true-case value reads naturally at the start.

<span id="part-1-choose"></span>

### 1. Choose one value with `if ... else`

Here are the long and short forms of the same Friday Practice comparison:

```python
marc_best_lap_s = 89.426
fabio_best_lap_s = 89.558

if marc_best_lap_s < fabio_best_lap_s:
    quicker_rider_long = "Marc Márquez"
else:
    quicker_rider_long = "Fabio Quartararo"

quicker_rider_short = (
    "Marc Márquez" if marc_best_lap_s < fabio_best_lap_s else "Fabio Quartararo"
)

print(quicker_rider_long)
print(quicker_rider_short)
```

```text
Marc Márquez
Marc Márquez
```

The order is **true value**, `if`, **condition**, `else`, **false value**. A smaller lap time is quicker, and `89.426 < 89.558` is true. This example uses different published times; a real program that must handle equal times needs an explicit tie rule.

**Why this example?** The same real comparison makes the two syntaxes easy to compare. **How do we solve it?** Convert both published `m:ss.sss` best laps to seconds, compare those seconds, and place the chosen rider name on the correct side of the expression.

<span id="part-1-argument"></span>

### 2. Put a small choice inside a function call

Because the conditional form produces a value, it can be passed directly to `print` or another function:

```python
marc_sprint_position = 1
fabio_sprint_position = 9

print(
    "Marc won Saturday's Sprint."
    if marc_sprint_position == 1
    else "Marc did not win Saturday's Sprint."
)
print(
    "Fabio was in the Sprint top five."
    if fabio_sprint_position <= 5
    else "Fabio finished outside the Sprint top five."
)
```

```text
Marc won Saturday's Sprint.
Fabio finished outside the Sprint top five.
```

Python evaluates the condition first, then only the message it needs. The other message is skipped. The published P1 and P9 are **Sprint positions**, not lap times.

**Why this example?** The book shows that a conditional expression can sit where a function expects an argument. **How do we solve it?** Write the exact question as a Boolean condition, put the message for `True` before `if`, and the message for `False` after `else`.

<span id="part-1-readable"></span>

### 3. Keep a longer decision as an `if` statement

The short form is helpful when both outcomes are simple. Suppose a report needs different wording for a winner, a top-five finisher, and everyone else. Three branches read more clearly as statements:

```python
def sprint_label(position):
    if position == 1:
        return "winner"
    elif position <= 5:
        return "top five"
    else:
        return "outside top five"

print("Marc:", sprint_label(1))
print("Fabio:", sprint_label(9))
```

```text
Marc: winner
Fabio: outside top five
```

The values `1` and `9` are Marc's and Fabio's actual Sprint finishing positions. The function's categories are our report labels, not extra official classifications.

**Why this example?** It shows the practical limit of squeezing a decision into one expression. **How do we solve it?** Count the outcomes first. For three meaningful cases, write separate `if`/`elif`/`else` branches and return the chosen label.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 1.9.2 — Comprehension Syntax

A **comprehension** describes how to build a collection by saying what value to make, where its inputs come from, and optionally which inputs to keep. A related **generator expression** produces values on demand instead of building a collection. The list pattern is `[expression for item in iterable if condition]`; the final `if condition` is optional. The book begins with squares and factors, then extends the idea to sets, dictionaries, and a generator expression.

<span id="part-2-list"></span>

### 1. Replace an append loop with a list comprehension

These three Friday Practice entries are shown in their published position order. The loop and comprehension produce the same list of names:

```python
friday_results = [
    ("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88.725),
    ("Marc Márquez", "Ducati Lenovo Team", 5, 89.426),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89.558),
]

names_from_loop = []
for name, team, position, best_lap_s in friday_results:
    names_from_loop.append(name)

names_from_comprehension = [
    name for name, team, position, best_lap_s in friday_results
]

print(names_from_loop == names_from_comprehension)
print(names_from_comprehension)
```

```text
True
['Raúl Fernández', 'Marc Márquez', 'Fabio Quartararo']
```

Read the comprehension from the `for`: **for each** record, unpack its four fields, then put `name` into the new list. The names remain in the source list's order.

**Why this example?** A small real result list makes the append loop and comprehension visibly equivalent. **How do we solve it?** Identify the source rows, choose the part to keep (`name`), then move the loop into square brackets with that chosen expression at the front.

<span id="part-2-filter"></span>

### 2. Filter rows or choose a label for every row

The `if` at the **end** of a comprehension decides whether an input row contributes an output. A conditional expression at the **front** chooses a value for every input row:

```python
friday_results = [
    ("Raúl Fernández", 1),
    ("Marc Márquez", 5),
    ("Fabio Quartararo", 7),
]

top_five_names = [
    name for name, position in friday_results if position <= 5
]
labels_for_all = [
    "top five" if position <= 5 else "outside top five"
    for name, position in friday_results
]

print(top_five_names)
print(labels_for_all)
```

```text
['Raúl Fernández', 'Marc Márquez']
['top five', 'top five', 'outside top five']
```

The first list has **two** entries because Fabio's P7 is filtered out. The second has **three** labels because it chooses one label for each of the three real riders.

**Why this example?** The two kinds of `if` look similar but solve different problems. **How do we solve it?** If the question is “Which rows qualify?”, put `if` after the `for`. If the question is “What label should every row receive?”, put `a if condition else b` before the `for`.

<span id="part-2-math"></span>

### 3. Make squares and factors from lap-count integers

The book uses squares and factors to show that the expression may transform an input and the trailing `if` may test it. Here the integers come from the **13-lap Sprint** and **27-lap Grand Prix**. Their squares and factors are arithmetic teaching outputs, not lap times or race points:

```python
first_four_sprint_lap_numbers = range(1, 5)
squares = [lap_number * lap_number for lap_number in first_four_sprint_lap_numbers]

grand_prix_lap_count = 27
factors = [
    candidate
    for candidate in range(1, grand_prix_lap_count + 1)
    if grand_prix_lap_count % candidate == 0
]

print(squares)
print(factors)
```

```text
[1, 4, 9, 16]
[1, 3, 9, 27]
```

`range(1, 5)` covers only the first four lap **numbers** for this small example; it does not imply that we have recorded their times. For factors, `%` gives the remainder. A remainder of zero means the candidate divides `27` exactly.

**Why this example?** It follows the book's numeric pattern while using verified session lap counts. **How do we solve it?** For a transformation, place the arithmetic expression first. For a selection, place the divisibility test at the end and keep only matching candidates.

<span id="part-2-forms"></span>

### 4. Build a set, dictionary, or generator expression

Changing the delimiters changes the kind of result. We can use the same six verified position rows to see three forms:

```python
weekend_positions = [
    ("Friday Practice", "Marc Márquez", "Ducati Lenovo Team", 5),
    ("Friday Practice", "Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7),
    ("Saturday Sprint", "Marc Márquez", "Ducati Lenovo Team", 1),
    ("Saturday Sprint", "Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 9),
    ("Sunday Grand Prix", "Marc Márquez", "Ducati Lenovo Team", 6),
    ("Sunday Grand Prix", "Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 9),
]

teams = {team for session, name, team, position in weekend_positions}
marc_positions = {
    session: position
    for session, name, team, position in weekend_positions
    if name == "Marc Márquez"
}
fabio_position_stream = (
    position
    for session, name, team, position in weekend_positions
    if name == "Fabio Quartararo"
)

print(sorted(teams))
print(marc_positions)
print(next(fabio_position_stream))
print(list(fabio_position_stream))
```

```text
['Ducati Lenovo Team', 'Monster Energy Yamaha MotoGP Team']
{'Friday Practice': 5, 'Saturday Sprint': 1, 'Sunday Grand Prix': 6}
7
[9, 9]
```

The **set comprehension** keeps each team only once; `sorted` makes its display order predictable. The **dictionary comprehension** maps Marc's three distinct session names to positions. The **generator expression** makes an iterator: the first `next` returns Fabio's Friday P7; `list(...)` then consumes Saturday P9 and Sunday P9. A generator expression is the modern name for what the book calls a generator comprehension.

**Why this example?** The same real rows reveal what each form keeps: unique teams, key/value pairs, or values on demand. **How do we solve it?** Choose `{value for ...}` for unique values, `{key: value for ...}` for lookups, and `(value for ...)` when values can be consumed one at a time. Choose dictionary keys that distinguish the records you need.

<span id="part-2-sum"></span>

### 5. Give a generator expression to `sum`

The book's `sum(k*k for k in range(...))` pattern computes a total without first constructing a list of all squares. Using the 13 Sprint lap **numbers** gives a small checkable calculation:

```python
sprint_lap_count = 13
sum_of_number_squares = sum(
    lap_number * lap_number
    for lap_number in range(1, sprint_lap_count + 1)
)
print(sum_of_number_squares)
```

```text
819
```

This is the arithmetic sum `1² + 2² + ... + 13²`; `819` is **not** a MotoGP timing or scoring statistic. Because the generator expression is the sole argument to `sum`, it does not need an extra pair of parentheses. Unlike a list comprehension, it does not build a list of the 13 squares first.

**Why this example?** It shows the book's motivation for a generator expression: consume transformed values immediately. **How do we solve it?** Define the correct integer range, square each value in the generator expression, and pass that expression directly to `sum`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 1.9.3 — Packing and Unpacking of Sequences

**Packing** puts several values into one tuple, even when no parentheses appear. **Unpacking** assigns the values from an iterable to separate names. The number of values must match the number of targets unless starred unpacking is used; this section uses the exact-count form from the book.

<span id="part-3-pack"></span>

### 1. Commas pack values into a tuple

The commas in the first assignment create one four-field tuple. A function can also return several written values as one tuple:

```python
marc_friday_result = "Marc Márquez", "Ducati Lenovo Team", 5, 89.426

def fabio_friday_result():
    return "Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89.558

print(type(marc_friday_result).__name__)
print(marc_friday_result)
print(type(fabio_friday_result()).__name__)
```

```text
tuple
('Marc Márquez', 'Ducati Lenovo Team', 5, 89.426)
tuple
```

Each tuple contains a real rider, that rider's team, the Friday Practice position, and the Friday best lap in seconds. The values form **one record**; the function returns one tuple object.

**Why this example?** A result row naturally has several related fields, just as the book's short number sequences do. **How do we solve it?** Write the fields in a fixed order separated by commas, and document that order so later code knows what each field means.

<span id="part-3-unpack"></span>

### 2. Unpack exactly the number of values supplied

Names on the left receive values from the iterable on the right in order. Parentheses around the names are optional:

```python
result = ("Marc Márquez", "Ducati Lenovo Team", 5, 89.426)
name, team, position, best_lap_s = result
first_lap, second_lap, third_lap = range(1, 4)

print(name, position, best_lap_s)
print(first_lap, second_lap, third_lap)

try:
    name, position = result
except ValueError as error:
    print(type(error).__name__)
```

```text
Marc Márquez 5 89.426
1 2 3
ValueError
```

The four-field result needs four targets. `range(1, 4)` is not a tuple, but it is iterable and supplies exactly three numbers. The failed two-target assignment raises `ValueError` because the record supplies four values. These lap numbers are **indices only**, not measured times.

**Why this example?** It shows both the useful exact match and the common “too many values to unpack” mistake. **How do we solve it?** Count the record fields before assigning, match each to a descriptive name, and keep the field order consistent.

<span id="part-3-divmod"></span>

### 3. Unpack the pair returned by `divmod`

The book uses `divmod(a, b)` as a function whose two results can be unpacked. For an illustrative report layout, group the **27 Grand Prix lap numbers** into blocks of ten:

```python
grand_prix_lap_count = 27
full_blocks, leftover_laps = divmod(grand_prix_lap_count, 10)

print(full_blocks, leftover_laps)
print(full_blocks * 10 + leftover_laps)
```

```text
2 7
27
```

`divmod(27, 10)` returns `(2, 7)`: two complete ten-number blocks and seven numbers left. Ten is a **teaching choice** for display grouping, not an official MotoGP segment. The second line checks that `2 * 10 + 7` reconstructs the verified 27-lap count.

**Why this example?** The quotient/remainder pair has obvious names, so unpacking is clearer than using `[0]` and `[1]`. **How do we solve it?** Decide the block size, call `divmod(total, block_size)`, assign both returned values, and check `quotient * block_size + remainder == total`.

<span id="part-3-loops"></span>

### 4. Unpack pairs in loops and dictionary items

When each loop item is a pair, the loop header can name both parts. A dictionary's `.items()` supplies `(key, value)` pairs:

```python
sprint_positions = [("Marc Márquez", 1), ("Fabio Quartararo", 9)]
teams = {
    "Marc Márquez": "Ducati Lenovo Team",
    "Fabio Quartararo": "Monster Energy Yamaha MotoGP Team",
}

for rider, position in sprint_positions:
    print(rider, "P{}".format(position))

for rider, team in teams.items():
    print(rider, "—", team)
```

```text
Marc Márquez P1
Fabio Quartararo P9
Marc Márquez — Ducati Lenovo Team
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
```

The first loop unpacks each Sprint result pair. The second unpacks each dictionary item into its rider key and team value. The example dictionary is written in Marc-then-Fabio order; modern Python preserves that insertion order during this traversal.

**Why this example?** It applies the book's pair-unpacking loop to real rider/team records. **How do we solve it?** Check the shape of one loop item, put the same number of target names in the `for` header, and use `.items()` when both a dictionary key and value are needed.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simultaneous Assignments

After packing and unpacking, the book has an unnumbered **Simultaneous Assignments** part. Python evaluates the expressions on the right using the **old** values before assigning the targets on the left. This supports multiple assignments and swaps. Thinking of a temporary tuple helps explain the result, but Python does not promise to allocate a physical tuple for every swap.

<span id="part-4-swap"></span>

### 1. Assign several names and swap display order

Marc's three published positions can be assigned together. A separate pair of names represents **display order**, which can be swapped without changing any race result:

```python
marc_friday_p, marc_sprint_p, marc_sunday_p = 5, 1, 6
first_display, second_display = "Marc Márquez", "Fabio Quartararo"

print(marc_friday_p, marc_sprint_p, marc_sunday_p)
print(first_display, "then", second_display)

first_display, second_display = second_display, first_display
print(first_display, "then", second_display)
```

```text
5 1 6
Marc Márquez then Fabio Quartararo
Fabio Quartararo then Marc Márquez
```

For the swap, the right side first reads old `second_display` and old `first_display`. Only then are the two names assigned. The swap changes **which name appears first**, not Marc's or Fabio's results.

**Why this example?** It makes the book's swap pattern concrete without swapping facts between riders. **How do we solve it?** Identify the names that represent presentation order, place them in reversed order on the right, and read all right-side values as the old state.

<span id="part-4-fibonacci"></span>

### 2. Update two Fibonacci values together

The book revisits its Fibonacci generator from Section 1.8. Simultaneous assignment lets it advance two sequence values without losing the old `a` before calculating the new `b`:

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

sequence = fibonacci()
first_seven = [next(sequence) for _ in range(7)]
print(first_seven)
```

```text
[0, 1, 1, 2, 3, 5, 8]
```

At `a, b = b, a + b`, both right-side expressions use the old pair. If the old pair is `(2, 3)`, the new pair is `(3, 5)`. Fibonacci numbers are a **mathematical teaching sequence**, not MotoGP positions or times.

**Why this example?** It shows a case where the update order matters; assigning `a = b` first would lose the old `a` needed for the sum. **How do we solve it?** Keep the two current values together, yield the value to report, then update both names in one assignment.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: A Connected Three-Day MotoGP Report

The program below combines the section's ideas. A dictionary comprehension builds a rider lookup, a list comprehension selects each rider's three verified rows, unpacking names every field, and a conditional expression marks Marc's Saturday Sprint win. Each displayed value retains its session and measure.

```python
rider_records = [
    ("MARC", "Marc Márquez", "Ducati Lenovo Team"),
    ("FABIO", "Fabio Quartararo", "Monster Energy Yamaha MotoGP Team"),
]
riders = {code: (name, team) for code, name, team in rider_records}

weekend_rows = [
    ("Friday Practice", "MARC", 5, "best lap 89.426 s"),
    ("Friday Practice", "FABIO", 7, "best lap 89.558 s"),
    ("Saturday Sprint", "MARC", 1, "elapsed 19:37.125"),
    ("Saturday Sprint", "FABIO", 9, "+10.248 s to Marc Márquez"),
    ("Sunday Grand Prix", "MARC", 6, "+10.778 s to Marco Bezzecchi"),
    ("Sunday Grand Prix", "FABIO", 9, "+19.999 s to Marco Bezzecchi"),
]

for code in ("MARC", "FABIO"):
    name, team = riders[code]
    selected_rows = [
        (session, position, detail)
        for session, row_code, position, detail in weekend_rows
        if row_code == code
    ]
    print("{} — {}".format(name, team))
    for session, position, detail in selected_rows:
        label = (
            "P1 (winner)"
            if session == "Saturday Sprint" and position == 1
            else "P{}".format(position)
        )
        print("  {}: {}, {}".format(session, label, detail))
```

```text
Marc Márquez — Ducati Lenovo Team
  Friday Practice: P5, best lap 89.426 s
  Saturday Sprint: P1 (winner), elapsed 19:37.125
  Sunday Grand Prix: P6, +10.778 s to Marco Bezzecchi
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
  Friday Practice: P7, best lap 89.558 s
  Saturday Sprint: P9, +10.248 s to Marc Márquez
  Sunday Grand Prix: P9, +19.999 s to Marco Bezzecchi
```

**Why this example?** It puts the compact forms into one report task while keeping the published Friday, Saturday, and Sunday facts distinct. **How do we solve it?**

1. Store each rider's code, real name, and team in a fixed three-field record.
2. Build a code-to-identity lookup with a dictionary comprehension.
3. Store the six published session rows in Friday, Saturday, Sunday order.
4. For each rider code, filter its rows with a list comprehension and unpack the resulting fields in the display loop.
5. Use one short conditional expression to label the actual Saturday P1 as a win; retain `P5`, `P6`, `P7`, and `P9` for the other results.

The list comprehension selects **known result summaries**. It does not infer lap-by-lap times from a best lap or a race finish gap.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Study Cases

<span id="part-6-choose-filter"></span>

### 1. Choosing a label is different from filtering a row

**Scenario:** A Friday Practice report must either show every selected rider with a top-five label or show only selected riders who were in the top five.

**Why this case?** A conditional expression and a comprehension's trailing `if` can look similar but produce different numbers of entries.

```python
friday_positions = [("Marc Márquez", 5), ("Fabio Quartararo", 7)]

all_labels = [
    "top five" if position <= 5 else "outside top five"
    for name, position in friday_positions
]
top_five_riders = [
    name for name, position in friday_positions if position <= 5
]

print(all_labels)
print(top_five_riders)
```

```text
['top five', 'outside top five']
['Marc Márquez']
```

**How do we solve it?** Choose a value at the front of the comprehension when every rider should remain. Put `if` after the `for` when nonqualifying riders should be absent.

<span id="part-6-keys"></span>

### 2. A dictionary key must identify the intended record

**Scenario:** Two Friday riders have results from the same session. Keying a dictionary only by session would retain one position for that session:

```python
friday_rows = [
    ("Friday Practice", "Marc Márquez", 5),
    ("Friday Practice", "Fabio Quartararo", 7),
]

by_session = {
    session: position for session, rider, position in friday_rows
}
by_rider = {
    rider: position for session, rider, position in friday_rows
}

print(by_session)
print(by_rider)
```

```text
{'Friday Practice': 7}
{'Marc Márquez': 5, 'Fabio Quartararo': 7}
```

**Why this case?** Dictionary keys are unique; the second Friday row replaces the first when both use the same key. **How do we solve it?** Choose a key that distinguishes the records needed by the report. For this one-session example, rider name works. For a multi-session report, use a pair such as `(session, rider)`.

<span id="part-6-measures"></span>

### 3. Keep unlike session measures separate

**Scenario:** A report has Marc's Friday `89.426`-second best lap, his Saturday Sprint win, and his Sunday `+10.778`-second race gap. A tempting comprehension might put all numbers into one unnamed list.

**Why this case?** The numbers have different units and meanings: a fastest single lap, a race elapsed time or finishing position, and a gap to the Sunday winner. A concise expression cannot make them comparable.

**How do we solve it?** Keep each row's session and measurement label, as in the connected program. Compare Friday best laps with other Friday best laps, or Sunday finish gaps with other Sunday finish gaps. If a calculation needs every lap time, obtain a separate official lap-time dataset first.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section idea | What to remember | MotoGP example |
| :--- | :--- | :--- |
| Conditional expression | `a if test else b` produces one chosen value; only that side is evaluated. | Choose which Friday rider had the quicker best lap. |
| Readable branch | Use ordinary `if`/`elif`/`else` when several outcomes need explanation. | Label a Sprint winner, top-five finisher, or other finisher. |
| List comprehension | `[value for item in source if test]` builds a list; the final filter is optional. | Select the Friday riders in the top five. |
| Set comprehension | `{value for item in source}` keeps unique values. | List the two priority riders' teams once each. |
| Dictionary comprehension | `{key: value for item in source}` builds a lookup; keys must distinguish records. | Map Marc's three sessions to his positions. |
| Generator expression | `(value for item in source)` produces values on demand. | Stream Fabio's three positions or feed squares to `sum`. |
| Packing | Commas group values into a tuple. | Put rider, team, position, and best lap in one Friday record. |
| Unpacking | Assign one value per target; exact-count unpacking requires matching counts. | Name the four fields in a result row or the two results of `divmod`. |
| Simultaneous assignment | Evaluate right-side values before updating left-side names. | Swap report display order while keeping rider results unchanged. |

> **Mental model:** Start with the meaning of the source data. Use a conditional expression for a small choice, a comprehension for a clear collection or stream, unpacking to name record fields, and simultaneous assignment when several names must update from the old state together.

[🔝 Back to Top](#top)
