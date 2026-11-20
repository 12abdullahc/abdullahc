<span id="top"></span>

# Array-Based Sequences — Section 5.1: Python's Sequence Types

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.1 (printed page 184; [chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C05.pdf)).  
> **Topic:** The three sequence types; public behavior; implementation details; asymptotic and experimental analysis.  
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika, using Marc Márquez, Fabio Quartararo, and Raúl Fernández.  
> **Learning goal:** Read and choose Python sequences, predict what copies and slices share, and explain a simple search's cost through small, runnable examples.  
> **User Prompt:** "Reexplain [Section 5.1] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]"

---

## Table of Contents

1. [Background & Conceptual Intuition: One Practice Classification](#background-intuition)
   - [1. The verified session data](#background-data)
   - [2. One position connects several facts](#background-positions)
2. [Part 1: Section 5.1 — The Three Sequence Types](#part-1)
   - [1. What an ordered sequence gives us](#part-1-order)
   - [2. Why use a list, tuple, or string?](#part-1-types)
3. [Part 2: Public Behaviors](#part-2)
   - [1. Index and slice the selected riders](#part-2-index-slice)
   - [2. Tell an alias from a copy](#part-2-copy)
   - [3. Read and copy a list of lists](#part-2-nested)
4. [Part 3: Implementation Details](#part-3)
   - [1. Program to the public interface](#part-3-interface)
   - [2. Look inside when efficiency matters](#part-3-efficiency)
5. [Part 4: Asymptotic and Experimental Analyses](#part-4)
   - [1. Count the work in a fastest-lap search](#part-4-asymptotic)
   - [2. Time a larger, synthetic notebook](#part-4-experiment)
6. [Part 5: Complete Worked Practice Notebook](#part-5)
   - [1. Solve the task step by step](#part-5-steps)
   - [2. Run the program and trace its output](#part-5-program)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Practice Classification

<span id="background-data"></span>

### 1. The verified session data

At Mandalika, each rider's **Practice** result records a fastest single lap and a classification position. The [MotoGP Friday report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) and [Yamaha's complete event results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give these entries:

| Rider | Team | Official Practice position | Fastest lap | Milliseconds |
| :--- | :--- | ---: | ---: | ---: |
| Marc Márquez | Ducati Lenovo Team | P5 | 1:29.426 | 89,426 |
| Fabio Quartararo | Monster Energy Yamaha MotoGP Team | P7 | 1:29.558 | 89,558 |
| Raúl Fernández | SuperFile Trackhouse MotoGP Team | P1 | 1:28.725 | 88,725 |

The table puts Marc and Fabio first for our comparison. **Its row order is our choice; it is not the official classification order.** A lap of `1:29.426` means one minute and 29.426 seconds, or `60,000 + 29,426 = 89,426` milliseconds. A smaller lap time is quicker. Fabio's and Marc's best laps differ by `89,558 − 89,426 = 132` milliseconds, or **0.132 seconds**. This is a best-lap comparison within Practice, not a Sprint or race finishing gap.

**Why this example?** One real session gives us short, related collections of names, teams, places, and times. **How to solve the comparison:** choose the two Practice lap values, convert both to the same unit, subtract the smaller from the larger, and label the answer as a best-lap gap.

<span id="background-positions"></span>

### 2. One position connects several facts

Run this setup before the short snippets below:

```python
riders = ("Marc Márquez", "Fabio Quartararo", "Raúl Fernández")
teams = (
    "Ducati Lenovo Team",
    "Monster Energy Yamaha MotoGP Team",
    "SuperFile Trackhouse MotoGP Team",
)
initials = "MFR"
places = [5, 7, 1]
lap_ms = [89_426, 89_558, 88_725]
```

Each sequence has **three elements in the same selected order**. The letters in `initials` are our teaching shorthand, not official rider numbers. Python starts positions at `0`, so position `1` connects `riders[1]` (Fabio), `teams[1]` (his Yamaha team), `places[1]` (official P7), and `lap_ms[1]` (`89_558`). Position `1` in our lists does **not** mean official P1; the official place is stored separately.

| Python position `k` | `initials[k]` | `riders[k]` | `places[k]` | `lap_ms[k]` |
| ---: | :---: | :--- | ---: | ---: |
| `0` | `"M"` | Marc Márquez | `5` | `89_426` |
| `1` | `"F"` | Fabio Quartararo | `7` | `89_558` |
| `2` | `"R"` | Raúl Fernández | `1` | `88_725` |

Section 5.1 is a **roadmap** for Chapter 5. It names the topics below but does not print these MotoGP examples, a program, or numerical cost bounds. Those are added here to make the ideas concrete.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 5.1 — The Three Sequence Types

The book opens with three built-in sequence classes: **`list`, `tuple`, and `str`**. A sequence keeps elements in an order and lets us ask for the element at position `k` using `seq[k]`. The three types share that notation, but their rules and internal representations differ.

<span id="part-1-order"></span>

### 1. What an ordered sequence gives us

```python
print(riders[0])    # first selected rider
print(lap_ms[1])    # Fabio's lap in milliseconds
print(initials[2])  # Raúl's one-character code
```

```text
Marc Márquez
89558
R
```

**Why this example?** The same `[k]` syntax retrieves a full name, a number, or a character; the type of element depends on the sequence. **How to solve an indexing question:** identify the selected rider's position, count from zero, and use that same position in the aligned sequences. Check the `places` value separately if you need the official rank.

<span id="part-1-types"></span>

### 2. Why use a list, tuple, or string?

| Type | Session example | What it contains | Can an existing element be replaced? |
| :--- | :--- | :--- | :--- |
| `list` | `lap_ms = [89_426, 89_558, 88_725]` | Our numeric lap records | Yes |
| `tuple` | `riders = ("Marc Márquez", ...)` | Names in a chosen, fixed order | No |
| `str` | `initials = "MFR"` | Characters in an ordered code | No |

A list is **mutable**: we can change a selection or correct an entry in place. A tuple and a string are **immutable**: their existing positions cannot be assigned new values. For example, changing which riders to study is legal in a list:

```python
selected = ["Marc Márquez", "Fabio Quartararo"]
selected[1] = "Raúl Fernández"
print(selected)
```

```text
['Marc Márquez', 'Raúl Fernández']
```

By contrast, `riders[1] = "Raúl Fernández"` and `initials[1] = "R"` would each raise `TypeError`. We can still bind the name `riders` to a **new** tuple; immutability prevents changing the old tuple itself.

**Why this example?** Changing a selected rider alters only our study list, not any official result. It shows mutation without pretending that an official lap changed. **How to choose:** use a list when positions need in-place edits, a tuple when a group of entries should stay fixed, and a string for text. These are practical choices; Section 5.1 introduces the types before the chapter studies their operations in detail.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Public Behaviors

**Public behavior** means what a Python program can observe: which operations work, what they return, and whether they change an existing object. Section 5.1 singles out **copies, slices, and multidimensional data** because mistaken assumptions about them can cause bugs.

<span id="part-2-index-slice"></span>

### 1. Index and slice the selected riders

An index returns one element. A slice `seq[start:stop]` returns the portion from `start` **up to but excluding** `stop`:

```python
print(riders[1])      # one tuple element
print(riders[:2])     # Marc and Fabio, still a tuple
print(lap_ms[:2])     # their two best laps, a new list
print(initials[:2])   # their one-character codes, as a string
print(riders[-1])     # last selected rider
```

```text
Fabio Quartararo
('Marc Márquez', 'Fabio Quartararo')
[89426, 89558]
MF
Raúl Fernández
```

`-1` counts from the end of our **selected sequence**, not from the official classification. **Why this example?** The first two positions isolate the requested Marc–Fabio comparison, while the last position checks our understanding of selected order. **How to solve it:** write the desired Python positions, set the slice stop one past the final position, and inspect the result's type as well as its contents.

<span id="part-2-copy"></span>

### 2. Tell an alias from a copy

Assignment can give two names to **one list**. A full slice makes a **new outer list**:

```python
selected = ["Marc Márquez", "Fabio Quartararo"]
alias = selected
copied = selected[:]

copied[1] = "Raúl Fernández"
print(selected)  # unchanged: copied is a separate list

alias[0] = "Raúl Fernández"
print(selected)  # changed: alias and selected name the same list
print(alias is selected, copied is selected)
```

```text
['Marc Márquez', 'Fabio Quartararo']
['Raúl Fernández', 'Fabio Quartararo']
True False
```

`is` asks whether two names refer to the **same object**. **Why this example?** A separate rider-selection draft should not unexpectedly rewrite the original selection. **How to solve a copy bug:** decide whether you want shared edits. Use `alias = selected` to share one list; use `copied = selected[:]` for an independent **flat** list. The next example shows why a nested list needs more care.

<span id="part-2-nested"></span>

### 3. Read and copy a list of lists

We can store a small result table as a list of **rows**, with each row another list. The columns below are name, team, official place, and best lap in milliseconds:

```python
rows = [
    ["Marc Márquez", "Ducati Lenovo Team", 5, 89_426],
    ["Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89_558],
    ["Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88_725],
]

print(rows[1][0], rows[1][3])
outer_copy = rows[:]
print(outer_copy is rows, outer_copy[0] is rows[0])

# Make independent row lists before trying a hypothetical lap time.
scenario_rows = [row[:] for row in rows]
scenario_rows[0][3] = 90_000  # invented what-if value, not an official result
print(rows[0][3], scenario_rows[0][3])
```

```text
Fabio Quartararo 89558
False True
89426 90000
```

`rows[1][3]` means **row 1, then column 3**: Fabio's `89_558` ms. `rows[:]` copies only the outer list, so `outer_copy[0]` is still the same inner row object as `rows[0]`. Editing that shared row through `outer_copy` would affect `rows`. In this two-level table of strings and integers, `[row[:] for row in rows]` makes separate row lists. The `90_000` ms value is deliberately hypothetical and is stored only in `scenario_rows`.

**Why this example?** A rider-results table is a natural list of lists, and the two `is` results expose the shallow-copy trap. **How to solve it:** select a row, then a column; before editing a trial table, copy each inner row as well as the outer list. If the row elements themselves contain mutable objects, a deeper copying plan is needed.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Implementation Details

Section 5.1 connects sequences to **encapsulation**: the public interface tells us how to use an object correctly, while studying its implementation helps explain efficiency. It says these sequence types have an array-based representation at a low level, but their different behavior does not imply identical storage.

<span id="part-3-interface"></span>

### 1. Program to the public interface

We can find Marc and Fabio's Practice best-lap gap with documented sequence operations alone:

```python
gap_ms = lap_ms[1] - lap_ms[0]
print("Fabio–Marc Practice best-lap gap: {:.3f} s".format(gap_ms / 1_000))
```

```text
Fabio–Marc Practice best-lap gap: 0.132 s
```

The program needs only `lap_ms[k]`, arithmetic, and formatting. It does not need to know where the list lives in memory. **Why this example?** It shows what the public interface already guarantees for a correct answer. **How to solve it:** find the aligned indices (`0` for Marc, `1` for Fabio), subtract `89_426` from `89_558`, divide milliseconds by `1_000`, and label the result as a Practice best-lap gap.

<span id="part-3-efficiency"></span>

### 2. Look inside when efficiency matters

Suppose the notebook held many laps. We would want to know whether an operation reads one position, scans many positions, or makes a new collection. The public expression tells us **what** happens; implementation analysis helps explain **how much work** it takes. Section 5.1 introduces this question, and later parts of Chapter 5 analyze particular operations.

| Expression | Public result in our notebook | Efficiency question to ask |
| :--- | :--- | :--- |
| `lap_ms[1]` | Fabio's `89_558` ms | How does indexed access locate one element? |
| `lap_ms[:2]` | A new list with two lap values | How much data must be copied for a slice? |
| `min(lap_ms)` | The smallest stored lap, `88_725` ms | How many entries must be inspected? |

**Why this example?** These expressions can all produce correct answers while doing different amounts of work. **How to investigate:** first state the observable result, then examine the operation's implementation or documented cost. Do not infer that every operation has the same cost merely because all three sequence types support indexing.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Asymptotic and Experimental Analyses

**Asymptotic analysis** predicts how work grows as input size `n` grows. **Experimental analysis** runs code and measures what happened on a particular system. Section 5.1 says the chapter uses both approaches. The worked search and its O(n) bound below are our teaching illustration, not a bound printed in Section 5.1 itself.

<span id="part-4-asymptotic"></span>

### 1. Count the work in a fastest-lap search

For a **nonempty** list, start with its first lap as the current best and compare each later lap:

```python
def fastest_lap_ms(times):
    best = times[0]
    for k in range(1, len(times)):
        if times[k] < best:
            best = times[k]
    return best

print(fastest_lap_ms(lap_ms))
```

```text
88725
```

| Step | Lap inspected | Comparison | Current best |
| :--- | ---: | :--- | ---: |
| Start | Marc: `89_426` | None yet | `89_426` |
| `k = 1` | Fabio: `89_558` | `89_558 < 89_426` is false | `89_426` |
| `k = 2` | Raúl: `88_725` | `88_725 < 89_426` is true | `88_725` |

For `n` stored laps, this particular loop makes `n − 1` comparisons. If `n` doubles, the comparisons grow roughly in proportion to `n`; we describe the growth as **O(n)**. The exact time in seconds depends on the machine and Python interpreter. An empty input needs a separate check because `times[0]` would fail.

**Why this example?** The real three-rider data lets us see every comparison, while the same loop works for a longer notebook. **How to solve the cost question:** choose `n` as the number of lap entries, count the loop's comparisons, then keep the dominant growth term. For the answer, trace the changing `best` value and convert `88_725` ms back to Raúl's `1:28.725`.

<span id="part-4-experiment"></span>

### 2. Time a larger, synthetic notebook

We can repeat the three official lap numbers **only to build artificial benchmark inputs**. Repeated entries do not represent additional riders or laps in the real session:

```python
from timeit import timeit

for n in (3, 300, 3_000):
    sample = lap_ms * (n // len(lap_ms))
    seconds = timeit(lambda: fastest_lap_ms(sample), number=1_000)
    print("{} entries: {:.6f} s for 1,000 searches".format(n, seconds))
```

This prints three measurements; their numeric values vary by computer and run. The comparison counts for one search are `2`, `299`, and `2,999`. Compare the trend over several sizes and, if needed, repeat the measurement. Timing can support an O(n) prediction, but three measurements cannot prove it.

**Why this example?** It tests the same search we just analyzed while changing only the number of entries. **How to solve an experimental question:** keep the operation and repeat count fixed, change `n`, record the times, and compare their trend with the predicted work. State that the larger inputs are synthetic.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Complete Worked Practice Notebook

The task is to show each selected rider's real Practice entry, calculate each gap to the fastest selected lap, and compare Marc with Fabio. Raúl is included and was **P1 in the full session**, so the fastest selected lap is also the official session's fastest lap.

<span id="part-5-steps"></span>

### 1. Solve the task step by step

1. Store full names, teams, initials, official places, and lap milliseconds in the **same selected order**.
2. Find the smallest lap time. Here `min(lap_ms)` gives `88_725` ms for Raúl.
3. For each selected position `k`, read all fields at that `k` and subtract `88_725` from its lap time.
4. Divide milliseconds by `1_000` only when displaying seconds; the stored integers keep the subtraction exact.
5. Subtract Marc's lap from Fabio's lap to answer the specific comparison: `89_558 − 89_426 = 132` ms.

**Why this example?** It combines all three sequence types and a short scan without mixing sessions or mistaking our chosen order for the official finishing order. **How to solve it:** follow the five steps, then check every calculated gap against the original millisecond values.

<span id="part-5-program"></span>

### 2. Run the program and trace its output

Save this standalone code as `practice_sequences.py` and run it with Python 3:

```python
# Indonesian GP MotoGP Practice, Friday 9 October 2026.
# Three selected riders, kept in the same order in every sequence.
riders = ("Marc Márquez", "Fabio Quartararo", "Raúl Fernández")
teams = (
    "Ducati Lenovo Team",
    "Monster Energy Yamaha MotoGP Team",
    "SuperFile Trackhouse MotoGP Team",
)
initials = "MFR"
places = [5, 7, 1]
lap_ms = [89_426, 89_558, 88_725]

fastest_ms = min(lap_ms)

for k in range(len(riders)):
    gap_ms = lap_ms[k] - fastest_ms
    print("{} | {} | {} | P{} | {:.3f} s | +{:.3f} s".format(
        initials[k], riders[k], teams[k], places[k],
        lap_ms[k] / 1_000, gap_ms / 1_000
    ))

marc_fabio_gap_ms = lap_ms[1] - lap_ms[0]
print("Fabio–Marc best-lap gap: {:.3f} s".format(marc_fabio_gap_ms / 1_000))
```

```text
M | Marc Márquez | Ducati Lenovo Team | P5 | 89.426 s | +0.701 s
F | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | P7 | 89.558 s | +0.833 s
R | Raúl Fernández | SuperFile Trackhouse MotoGP Team | P1 | 88.725 s | +0.000 s
Fabio–Marc best-lap gap: 0.132 s
```

| Selected index `k` | Rider | Calculation against `88_725` ms | Displayed gap |
| ---: | :--- | :--- | ---: |
| `0` | Marc | `89_426 − 88_725 = 701` ms | `+0.701 s` |
| `1` | Fabio | `89_558 − 88_725 = 833` ms | `+0.833 s` |
| `2` | Raúl | `88_725 − 88_725 = 0` ms | `+0.000 s` |

Fabio's and Marc's gaps to the **same** session leader differ by `0.833 − 0.701 = 0.132` seconds, matching the direct subtraction. The code prints lap times as total seconds (`89.426 s`), while the official table writes the same duration as minutes and seconds (`1:29.426`).

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 5.1 idea | Plain-language meaning | Practice example |
| :--- | :--- | :--- |
| `list`, `tuple`, `str` | Ordered sequences with different rules | Millisecond laps, fixed rider names, and one-character codes |
| `seq[k]` | Read the element at position `k` | `lap_ms[1]` is Fabio's `89_558` ms; P7 is stored separately |
| Slices | Select a range whose stop is excluded | `riders[:2]` selects Marc and Fabio |
| Copies | A new outer list may still share inner objects | `rows[:]` shares row lists; `[row[:] for row in rows]` separates these rows |
| Encapsulation | Use the public interface for correctness | Compute `lap_ms[1] - lap_ms[0]` without knowing the storage layout |
| Asymptotic analysis | Predict how work grows with input size | The illustrated fastest-lap loop makes `n − 1` comparisons: O(n) |
| Experimental analysis | Measure actual runs and compare trends | Time the same search on synthetic lists of 3, 300, and 3,000 entries |

Section 5.1 introduces these themes. The later chapter sections supply the detailed operation rules and implementation analyses; the worked MotoGP calculations here make the roadmap easier to follow.

[🔝 Back to Top](#top)
