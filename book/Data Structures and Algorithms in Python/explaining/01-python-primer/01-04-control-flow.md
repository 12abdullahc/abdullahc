<span id="top"></span>

# 1.4 Control Flow — A MotoGP Weekend Study Guide

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.  
> **Topic:** Section 1.4: control flow, conditionals, and loops.  
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.  
> **Learning goal:** Follow exactly which lines a Python program runs, then use decisions and repetition to answer small questions about real MotoGP results.  
> **User Prompt:** "Reexplain [Section 1.4] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Weekend, Different Questions](#background)
   - [1. The results used in the examples](#background-results)
   - [2. What control flow adds](#background-flow)
2. [Part 1: 1.4 Control Flow](#part-1)
   - [1. A colon begins a controlled block](#part-1-colon)
   - [2. Indentation determines the path](#part-1-indentation)
3. [Part 2: 1.4.1 Conditionals](#part-2)
   - [1. Run a block only if a condition is true](#part-2-if)
   - [2. Choose one branch with `elif` and `else`](#part-2-elif)
   - [3. Understand truthy and falsey values](#part-2-truthiness)
   - [4. Put a decision inside another decision](#part-2-nested)
4. [Part 3: 1.4.2 Loops](#part-3)
   - [1. Repeat while a condition stays true](#part-3-while)
   - [2. Search safely with `while`](#part-3-search)
   - [3. Visit each item with `for`](#part-3-for)
   - [4. Build a running total or find an extreme](#part-3-accumulate)
   - [5. Understand the loop variable](#part-3-variable)
   - [6. Use indices when a position matters](#part-3-indices)
   - [7. Stop or skip with `break` and `continue`](#part-3-break-continue)
5. [Part 4: A Connected Weekend Program](#part-4)
6. [Part 5: Simple MotoGP Study Cases](#part-5)
   - [1. Put the most specific branch first](#part-5-order)
   - [2. Search an empty selection safely](#part-5-empty)
   - [3. See where `break` stops](#part-5-break)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Weekend, Different Questions

<span id="background-results"></span>

### 1. The results used in the examples

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team**. The small examples also use **Raúl Fernández** of **SuperFile Trackhouse MotoGP Team** and **Marco Bezzecchi** of **Aprilia Racing** when a session winner makes the result clearer. The figures below come from [Yamaha Factory Racing's published weekend classifications](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia). MotoGP's reports describe the [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | Other result used below |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` = `89.426` s | P7; best lap `1:29.558` = `89.558` s | Raúl Fernández P1; `1:28.725` = `88.725` s. |
| Saturday Sprint | P1; winner in `19:37.125` | P9; `+10.248` s to Marc | The Sprint was 13 laps. |
| Sunday Grand Prix | P6; `+10.778` s | P9; `+19.999` s | Marco Bezzecchi won in `40:46.582`; both gaps are to him. |

**Keep the measurements separate.** A Friday number above is one fastest Practice lap. A Saturday or Sunday `+` number is a finishing gap to that session's winner. We may compare two values from the **same** session and with the **same** meaning; we should not average a Practice lap with a Grand Prix finishing gap.

<span id="background-flow"></span>

### 2. What control flow adds

An expression such as `89.558 - 89.426` answers one fixed question. A program also needs to decide **whether** to accept a rider name, **which** message fits a result, and **how many times** to repeat a check.

| Weekend question | Python construct |
| :--- | :--- |
| Was Marc the Sprint winner? | `if` runs a block when a condition is true. |
| Is a Friday best lap below one of several example thresholds? | `if`–`elif`–`else` chooses a branch in order. |
| How do we examine every selected rider? | `for` visits each item. |
| Where is Fabio in a selection? | `while` searches until a match or the end. |
| What if a selection contains `"?"`? | `continue` skips that one entry. |

**Why these examples?** The rider results stay fixed while the Python structure changes, so we can see what each control statement contributes. **How do we solve a question?** Label its session and measure, write the condition or collection, then trace which lines run. The examples below are independent unless a code block states otherwise.

> **Mental model:** A conditional chooses a path. A loop repeats a path. Indentation tells Python which instructions belong to that path.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.4 Control Flow

Normally Python runs statements from top to bottom. A **control structure** changes that order by deciding to run, skip, or repeat its body. In Python, the body is an **indented block**.

<span id="part-1-colon"></span>

### 1. A colon begins a controlled block

The header of an `if`, `while`, or `for` statement ends with `:`. The indented line below it belongs to that statement. Python also permits one simple statement on the header line after `:`, but an indented block is the usual, clearer form.

```python
marc_sprint_position = 1

if marc_sprint_position == 1:
    print("Marc won Saturday's Sprint")
```

```text
Marc won Saturday's Sprint
```

**Why this example?** Marc's published P1 makes the condition easy to check by eye. **How to solve it:** Compare the stored Sprint position with `1`. The expression `marc_sprint_position == 1` evaluates to `True`, so Python executes the indented `print`. The colon and indentation are both necessary parts of this block form.

<span id="part-1-indentation"></span>

### 2. Indentation determines the path

Dedenting ends a block. A line aligned with `if` runs after that decision, whether the condition was true or false.

```python
fabio_practice_seconds = 89.558

if fabio_practice_seconds < 89.500:
    print("Fabio's Friday best lap was under 89.500 s")
print("Friday Practice check complete")
```

```text
Friday Practice check complete
```

**Why this example?** The false condition makes the indentation boundary visible: the first message disappears, but the second still appears. **How to solve it:** Evaluate `89.558 < 89.500` as `False`; skip the indented body; continue at the unindented line. Use consistent indentation, conventionally four spaces, for each level. Nested structures add another level.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.4.1 Conditionals

<span id="part-2-if"></span>

### 1. Run a block only if a condition is true

An `if` statement first evaluates its condition. If the result is true, its body runs. If false, that body is skipped. A membership condition is useful before looking up a rider in a dictionary.

```python
practice_laps = {
    "Marc Márquez": 89.426,
    "Fabio Quartararo": 89.558,
}
selected_rider = "Marc Márquez"

if selected_rider in practice_laps:
    print("Friday best lap: {:.3f} s".format(practice_laps[selected_rider]))
```

```text
Friday best lap: 89.426 s
```

**Why this example?** It shows a practical reason to make a decision: only a known key can be looked up safely. **How to solve it:** Check membership first. Because Marc is a key, retrieve his Friday best lap and format it to three decimal places. If `selected_rider` were `"?"`, the body would be skipped, avoiding a missing-key error.

<span id="part-2-elif"></span>

### 2. Choose one branch with `elif` and `else`

An `elif` is considered only when the earlier `if` and `elif` tests were false. An optional `else` covers whatever remains. Python takes **at most one** branch in the chain; with a final `else`, exactly one branch runs.

```python
marc_practice_seconds = 89.426

if marc_practice_seconds < 89.000:
    description = "under 89.000 s"
elif marc_practice_seconds < 89.500:
    description = "89.000 to under 89.500 s"
else:
    description = "89.500 s or more"

print(description)
```

```text
89.000 to under 89.500 s
```

The thresholds here are **teaching ranges**, not official MotoGP categories. They let us trace all three possible paths using actual Friday laps:

| Friday rider | Best lap in seconds | First branch that applies |
| :--- | ---: | :--- |
| Raúl Fernández | `88.725` | `if`: under `89.000` s. |
| Marc Márquez | `89.426` | `elif`: `89.000` to under `89.500` s. |
| Fabio Quartararo | `89.558` | `else`: `89.500` s or more. |

**Why this example?** The three real laps fall into three different ranges, so each branch has a concrete result. **How to solve it:** Test from top to bottom and stop at the first true condition. If the broader test `lap < 89.500` came first, Raúl would match it before the more specific `lap < 89.000` test. The order is part of the algorithm.

<span id="part-2-truthiness"></span>

### 3. Understand truthy and falsey values

Python can use a value itself as a condition. The empty string `""` is falsey; a nonempty string is truthy. A nonempty rider name is still not automatically a **valid** rider selection.

```python
practice_laps = {"Marc Márquez": 89.426, "Fabio Quartararo": 89.558}
query = ""

if query:
    print("A name was entered")
else:
    print("No name was entered")

query = "Fabio Quartararo"
if query and query in practice_laps:
    print("Known Friday rider:", query)
```

```text
No name was entered
Known Friday rider: Fabio Quartararo
```

**Why this example?** An input form may submit a blank value; a simple conditional can catch it before lookup. **How to solve it:** First ask whether the string contains anything. Then test membership in the published-result dictionary. Other common falsey values include `0`, `None`, and empty collections. An `if` test can also use an explicit Boolean expression such as `query != ""`.

<span id="part-2-nested"></span>

### 4. Put a decision inside another decision

An inner `if` is useful when a second question only makes sense after the first succeeds. Here we first establish that a rider is in our Friday data, then examine that rider's lap.

```python
practice_laps = {"Marc Márquez": 89.426, "Fabio Quartararo": 89.558}
query = "Fabio Quartararo"

if query in practice_laps:
    if practice_laps[query] < 89.500:
        print("Known rider with a best lap under 89.500 s")
    else:
        print("Known rider with a best lap of 89.500 s or more")
    print("Known rider checked")
print("Lookup complete")
```

```text
Known rider with a best lap of 89.500 s or more
Known rider checked
Lookup complete
```

**Why this example?** It shows three indentation levels and prevents looking up an unknown name. **How to solve it:** The outer test succeeds for Fabio. The inner comparison is false because `89.558` is not below `89.500`, so its `else` runs. The two later lines run as Python leaves the inner and then outer blocks. For an unknown name, only `Lookup complete` would print.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.4.2 Loops

A **`while` loop** checks a condition before each pass and repeats while it is true. A **`for` loop** takes successive values from an iterable such as a list, tuple, string, dictionary, set, or file. A dictionary's direct loop visits keys; a set should not be used when a particular visit order matters.

<span id="part-3-while"></span>

### 1. Repeat while a condition stays true

```python
selected_riders = ["Marc Márquez", "Fabio Quartararo"]
index = 0

while index < len(selected_riders):
    print(index, selected_riders[index])
    index += 1
```

```text
0 Marc Márquez
1 Fabio Quartararo
```

**Why this example?** Two riders make it easy to trace each pass and the stopping point. **How to solve it:** Start at index `0`; print and increment it while it is smaller than the list length, `2`. When it reaches `2`, the condition is false. If the list were empty, the loop would run zero times. Forgetting `index += 1` here would leave the condition true indefinitely.

<span id="part-3-search"></span>

### 2. Search safely with `while`

The book's sequence search checks that an index is valid **before** reading the element at that index. We can use the same pattern to find Fabio's first appearance in a chosen list of Friday riders. This is a **selection order**, not the official Practice ranking.

```python
selected_riders = ["Marc Márquez", "Fabio Quartararo", "Raúl Fernández"]
target = "Fabio Quartararo"
index = 0

while index < len(selected_riders) and selected_riders[index] != target:
    index += 1

if index < len(selected_riders):
    print("First Fabio selection at index", index)
else:
    print("Fabio was not selected")
```

```text
First Fabio selection at index 1
```

**Why this example?** A missing rider must not make the search read beyond the list. **How to solve it:** At each pass, first check `index < len(selected_riders)`. Python evaluates `and` from left to right and stops when the left condition is false. It therefore never evaluates `selected_riders[index]` after `index` reaches the end. That behavior is called **short-circuiting**.

| Selection | Final `index` | Result |
| :--- | ---: | :--- |
| `['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández']` | `1` | Fabio found at index 1. |
| `['Marc Márquez']` | `1` | No Fabio; index equals the length. |
| `[]` | `0` | No Fabio; body never runs. |

<span id="part-3-for"></span>

### 3. Visit each item with `for`

When every selected rider needs the same operation, `for` gives us the names directly and manages the traversal.

```python
teams = {
    "Marc Márquez": "Ducati Lenovo Team",
    "Fabio Quartararo": "Monster Energy Yamaha MotoGP Team",
}
selected_riders = ["Marc Márquez", "Fabio Quartararo"]

for rider in selected_riders:
    print(rider, "—", teams[rider])
```

```text
Marc Márquez — Ducati Lenovo Team
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
```

**Why this example?** Both real teams are displayed without writing two nearly identical `print` calls. **How to solve it:** Each pass assigns the next name from `selected_riders` to `rider`, then uses that name as a key to fetch its team. We do not need an explicit index. The list fixes Marc-then-Fabio display order.

<span id="part-3-accumulate"></span>

### 4. Build a running total or find an extreme

A loop can carry a result from one pass to the next. Start a sum at zero and add each selected **Friday Practice best lap**. This sum is a teaching calculation across three riders' laps, not an official session result or one rider's lap.

```python
friday_best_laps = [88.725, 89.426, 89.558]  # Raúl, Marc, Fabio; seconds
total_seconds = 0.0

for lap_seconds in friday_best_laps:
    total_seconds += lap_seconds

print("Sum of selected Friday best laps: {:.3f} s".format(total_seconds))
```

```text
Sum of selected Friday best laps: 267.709 s
```

To find an **extreme**, start with a real element, then replace it only when a better candidate appears. The book demonstrates a maximum; here the largest **Sunday race gap to the same winner** among the selected riders is a maximum.

```python
sunday_gaps = {
    "Raúl Fernández": 4.260,
    "Marc Márquez": 10.778,
    "Fabio Quartararo": 19.999,
}
names = list(sunday_gaps)
largest_gap_rider = names[0]  # The dictionary must be nonempty.

for rider in names:
    if sunday_gaps[rider] > sunday_gaps[largest_gap_rider]:
        largest_gap_rider = rider

print("Largest gap among selected finishers:", largest_gap_rider)
```

```text
Largest gap among selected finishers: Fabio Quartararo
```

**Why these examples?** The sum shows an **accumulator**; the maximum shows a changing **best-so-far candidate**. **How to solve them:** Keep all values in one session and unit, initialize the result appropriately, update it inside the loop, and report precisely which selected set it describes. The maximum code requires a nonempty collection; `names[0]` would fail if it were empty. For fastest Friday best lap, reverse the comparison to `<`, because a lower time is faster.

<span id="part-3-variable"></span>

### 5. Understand the loop variable

On each pass, a `for` loop assigns the next element to its loop variable. Assigning a new value to that name does not replace the original list element.

```python
selected_riders = ["Marc Márquez", "Fabio Quartararo"]

for rider in selected_riders:
    rider = "Checked"

print(selected_riders)
```

```text
['Marc Márquez', 'Fabio Quartararo']
```

**Why this example?** It separates **rebinding a name** from **changing a collection**, an idea introduced in Section 1.2. **How to solve it:** Trace each assignment to `rider`; the entries inside `selected_riders` remain the same. If we needed to replace entries, we would assign through their indices instead. Calling a mutating method on a mutable element is different again: it can change that shared element.

<span id="part-3-indices"></span>

### 6. Use indices when a position matters

`range(n)` produces `0, 1, ..., n - 1`. Thus `range(len(gaps))` visits every valid index in a list. Track an index when the question asks **which position** holds the largest value.

```python
riders = ["Raúl Fernández", "Marc Márquez", "Fabio Quartararo"]
sunday_gaps = [4.260, 10.778, 19.999]  # Seconds behind Marco Bezzecchi
largest_index = 0  # Requires a nonempty list.

for index in range(len(sunday_gaps)):
    if sunday_gaps[index] > sunday_gaps[largest_index]:
        largest_index = index

print(largest_index, riders[largest_index], sunday_gaps[largest_index])
```

```text
2 Fabio Quartararo 19.999
```

**Why this example?** The answer needs both the numerical gap and the matching rider position in our selected list. **How to solve it:** Start with index `0`, compare every gap against the current largest, and retain the index of the larger value. The strict `>` also keeps the **first** maximum if two values tie; `>=` would select the later one. This list index is not Fabio's official Sunday finishing position: that was P9.

<span id="part-3-break-continue"></span>

### 7. Stop or skip with `break` and `continue`

`continue` skips the rest of the **current pass** and moves to the next pass. `break` stops the **nearest enclosing loop** immediately. Use either when its effect is clearer than adding more nested conditions.

```python
known_riders = {"Marc Márquez", "Fabio Quartararo"}
requests = ["Marc Márquez", "?", "Fabio Quartararo"]

for rider in requests:
    if rider not in known_riders:
        continue
    print("Accepted:", rider)
```

```text
Accepted: Marc Márquez
Accepted: Fabio Quartararo
```

Here `"?"` is an **illustrative invalid input**, not a rider or a result. The loop still reaches Fabio after skipping it.

```python
requests = ["Marc Márquez", "Fabio Quartararo", "Raúl Fernández"]

for rider in requests:
    if rider == "Fabio Quartararo":
        print("Found Fabio")
        break
    print("Checked:", rider)
```

```text
Checked: Marc Márquez
Found Fabio
```

**Why these examples?** Both contain Fabio after another entry, so we can see whether the loop reaches or stops at him. **How to solve them:** Use `continue` for one entry to ignore and `break` when no later entries need checking. In a `while` loop, make sure `continue` does not skip an index update needed to reach the stopping condition. The book advises using both statements sparingly because too many exits can obscure the loop's path.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: A Connected Weekend Program

The following program joins the section's ideas. It accepts two real riders, skips an illustrative unknown selection, labels each rider's **Saturday Sprint** result, finds the quicker **Friday Practice best lap** among accepted riders, and calculates the **Sunday Grand Prix finish gap** between Marc and Fabio. Each comparison remains within its session. The Sprint positions are published results; the `P2–P9` band is a teaching label.

```python
weekend = {
    "Marc Márquez": {
        "team": "Ducati Lenovo Team",
        "friday_best_lap_s": 89.426,
        "sprint_position": 1,
        "race_position": 6,
        "race_gap_to_winner_s": 10.778,
    },
    "Fabio Quartararo": {
        "team": "Monster Energy Yamaha MotoGP Team",
        "friday_best_lap_s": 89.558,
        "sprint_position": 9,
        "race_position": 9,
        "race_gap_to_winner_s": 19.999,
    },
}

requests = ["Marc Márquez", "?", "Fabio Quartararo"]
accepted = []

for rider in requests:
    if rider not in weekend:
        print("Skip unknown selection:", rider)
        continue

    result = weekend[rider]
    accepted.append(rider)
    if result["sprint_position"] == 1:
        sprint_note = "winner"
    elif result["sprint_position"] <= 9:
        sprint_note = "P2–P9"
    else:
        sprint_note = "outside P1–P9"

    print("{} ({}): Friday {:.3f} s; Sprint P{} ({}); GP P{}, +{:.3f} s".format(
        rider, result["team"], result["friday_best_lap_s"],
        result["sprint_position"], sprint_note,
        result["race_position"], result["race_gap_to_winner_s"],
    ))

if accepted:
    fastest_index = 0
    for index in range(len(accepted)):
        if (weekend[accepted[index]]["friday_best_lap_s"]
                < weekend[accepted[fastest_index]]["friday_best_lap_s"]):
            fastest_index = index
    print("Quicker Friday best lap:", accepted[fastest_index])

    target = "Fabio Quartararo"
    index = 0
    while index < len(accepted) and accepted[index] != target:
        index += 1
    if index < len(accepted):
        print("First Fabio selection: position", index + 1)

    if "Marc Márquez" in accepted and "Fabio Quartararo" in accepted:
        gap = (weekend["Fabio Quartararo"]["race_gap_to_winner_s"]
               - weekend["Marc Márquez"]["race_gap_to_winner_s"])
        print("Sunday finish gap between the riders: {:.3f} s".format(gap))
else:
    print("No known riders were selected")
```

```text
Marc Márquez (Ducati Lenovo Team): Friday 89.426 s; Sprint P1 (winner); GP P6, +10.778 s
Skip unknown selection: ?
Fabio Quartararo (Monster Energy Yamaha MotoGP Team): Friday 89.558 s; Sprint P9 (P2–P9); GP P9, +19.999 s
Quicker Friday best lap: Marc Márquez
First Fabio selection: position 2
Sunday finish gap between the riders: 9.221 s
```

**Why this example?** It shows how small conditions and loops cooperate in one useful program, while the labels prevent us from mixing a lap time with a race gap. **How to solve it:**

1. Store each published fact under a rider and a session-specific key.
2. Walk through the requests with `for`; skip `"?"` before looking it up.
3. For an accepted rider, choose the Sprint description in order. The first matching branch wins.
4. Check `accepted` before reading index `0`. Then use a `for` loop and `<` to find the quicker Friday best lap.
5. Search for Fabio with a guarded `while` loop and print a one-based selection position.
6. Subtract Sunday's two gaps to the **same winner**, Marco Bezzecchi: `19.999 - 10.778 = 9.221` seconds. This is a derived finish gap, not a Friday lap comparison.

| Request | Decision | Accepted list after this pass |
| :--- | :--- | :--- |
| Marc Márquez | Known rider; Sprint winner. | `['Marc Márquez']` |
| `?` | Unknown; `continue` skips it. | `['Marc Márquez']` |
| Fabio Quartararo | Known rider; Sprint P9. | `['Marc Márquez', 'Fabio Quartararo']` |

If all requests were unknown or the list were empty, the final `else` would report that no known riders were selected; the program would not try to read `accepted[0]`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple MotoGP Study Cases

<span id="part-5-order"></span>

### 1. Put the most specific branch first

**Question.** Why would the following code fail to call Marc the Saturday Sprint winner?

```python
marc_sprint_position = 1

if marc_sprint_position <= 9:
    label = "P1–P9"
elif marc_sprint_position == 1:
    label = "winner"

print(label)
```

```text
P1–P9
```

**Why this example?** Marc's P1 satisfies **both** conditions, so the wrong order has an obvious effect. **How to solve it:** Put the more specific `== 1` test first. Once Python chooses a branch, it ignores the rest of that chain.

```python
marc_sprint_position = 1

if marc_sprint_position == 1:
    label = "winner"
elif marc_sprint_position <= 9:
    label = "P2–P9"
else:
    label = "outside P1–P9"

print(label)
```

```text
winner
```

<span id="part-5-empty"></span>

### 2. Search an empty selection safely

**Question.** What happens when Fabio is absent or nobody was selected?

```python
for selected in ([], ["Marc Márquez"], ["Marc Márquez", "Fabio Quartararo"]):
    index = 0
    while index < len(selected) and selected[index] != "Fabio Quartararo":
        index += 1
    print("Fabio found:", index < len(selected))
```

```text
Fabio found: False
Fabio found: False
Fabio found: True
```

**Why this example?** It tests the search's two edge cases as well as a successful lookup. **How to solve it:** For an empty list, `0 < 0` is false; Python does not attempt `selected[0]`. For Marc alone, the index advances to `1`, equal to the length. In both cases the final test is false. In the last list, the loop stops at Fabio's index before reaching the end.

<span id="part-5-break"></span>

### 3. See where `break` stops

**Question.** Does finding Fabio in one session stop a scan of all three sessions? This sample contains **selected names**, not full classification order.

```python
selected_by_session = {
    "Friday Practice": ["Marc Márquez", "Fabio Quartararo"],
    "Saturday Sprint": ["Marc Márquez", "Fabio Quartararo"],
    "Sunday Grand Prix": ["Marc Márquez", "Fabio Quartararo"],
}

for session, riders in selected_by_session.items():
    for rider in riders:
        if rider == "Fabio Quartararo":
            break
        print(session + ":", rider)
```

```text
Friday Practice: Marc Márquez
Saturday Sprint: Marc Márquez
Sunday Grand Prix: Marc Márquez
```

**Why this example?** The same two real riders appear in each session, making the inner and outer loop boundaries easy to see. **How to solve it:** The `break` exits only `for rider in riders`, the nearest loop. The outer `for session, riders ...` continues to Saturday and Sunday. Use a separate flag or another strategy if the intention is to stop both loops.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Construct | Weekend question | Key detail |
| :--- | :--- | :--- |
| `:` plus an indented block | Which instructions belong to this decision or loop? | Dedenting ends the body. |
| `if` | Is this rider present in our result dictionary? | The body may be skipped. |
| `elif` / `else` | Which description fits the Friday lap or Sprint place? | Conditions are tested in order; at most one branch runs. |
| Nested `if` | Is a known rider also below an example threshold? | The inner test runs only when its outer path runs. |
| `while` | Have we found Fabio or reached the end? | Retest the condition and make progress toward stopping. |
| `for item in collection` | What happens for each selected rider? | The loop variable receives each item. |
| `for index in range(len(data))` | Where in our selection is the extreme value? | An index is a position, not a MotoGP finishing place. |
| `break` / `continue` | Stop searching or skip an invalid selection? | Stop the nearest loop / skip one pass. |

> **Mental model:** Decide, repeat, and trace. State the session and measure before comparing results; then use indentation and the condition values to predict exactly which lines Python will run.

[🔝 Back to Top](#top)
