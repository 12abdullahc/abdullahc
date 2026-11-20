<span id="top"></span>

# Python Primer — Section 1.6: Simple Input and Output

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** Section 1.6 simple input and output; 1.6.1 console input and output; and 1.6.2 files.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Display clear results, convert text entered at the console into useful values, and read or write a small text file without confusing session results or units.<br>
> **User Prompt:** "Reexplain [Section 1.6] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: How Results Enter and Leave a Program](#background)
   - [1. The weekend facts used below](#background-results)
   - [2. Console and file input and output](#background-flow)
2. [Part 1: Section 1.6 — Simple Input and Output](#part-1)
   - [1. Values, text, and destinations](#part-1-values)
   - [2. A small input-to-answer trace](#part-1-trace)
3. [Part 2: Section 1.6.1 — Console Input and Output](#part-2)
   - [1. The `print` function: spaces, separators, and line endings](#part-2-print)
   - [2. Make the printed result readable](#part-2-format)
   - [3. The `input` function: prompts and returned strings](#part-2-input)
   - [4. Read two values from one reply](#part-2-split)
   - [5. A sample program: a Sunday finish difference](#part-2-program)
4. [Part 3: Section 1.6.2 — Files](#part-3)
   - [1. Opening a text file and choosing a mode](#part-3-open)
   - [2. Reading: `read`, `readline`, `readlines`, and iteration](#part-3-read)
   - [3. Writing: `write`, `writelines`, and `print(file=...)`](#part-3-write)
   - [4. File position: `tell` and `seek`](#part-3-position)
5. [Part 4: A Connected Three-Day MotoGP Program](#part-4)
6. [Part 5: Simple Input and Output Study Cases](#part-5)
   - [1. Numeric input is still text](#part-5-conversion)
   - [2. `writelines` does not insert newlines](#part-5-newlines)
   - [3. Opening with `w` replaces earlier contents](#part-5-overwrite)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: How Results Enter and Leave a Program

<span id="background-results"></span>

### 1. The weekend facts used below

We will use results for **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team**. The [Yamaha Factory Racing weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) list the classifications and times. MotoGP also reported [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | Meaning of the time |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5, best lap `1:29.426` = `89.426` s | P7, best lap `1:29.558` = `89.558` s | Each time is one rider's quickest lap in that Practice session. |
| Saturday Sprint | P1, winner in `19:37.125` | P9, `+10.248` s | The winner's time covers the 13-lap Sprint; Fabio's value is his finish gap to Marc. |
| Sunday Grand Prix | P6, `+10.778` s | P9, `+19.999` s | Both 27-lap race gaps are to winner Marco Bezzecchi of Aprilia Racing. |

The **Friday best-lap difference** is `89.558 - 89.426 = 0.132` seconds. The **Sunday finish difference** is `19.999 - 10.778 = 9.221` seconds because both gaps have the same winner as their reference. These differences are calculations from published results, not separate official results. A program should label them so a reader does not mistake a best lap, winner's total time, and finish gap for the same measure.

<span id="background-flow"></span>

### 2. Console and file input and output

**Input** brings text into a program. **Output** sends information out. For this section, the console means the terminal where the program runs; a file keeps text for a later read.

```text
Keyboard -- input() --> Python value -- calculation --> print() -- screen
                                   |
                                   +-----------> write() -- text file
Text file -- read() --------------> Python value
```

**Why this example?** A MotoGP result can be typed, printed, saved, and read back, so each arrow has a concrete job. **How do we solve it?** First decide whether the program needs a value from the keyboard or a stored file. Then convert entered text if arithmetic is required, compute using comparable session values, and choose a clear screen or file destination for the answer.

> **Mental model:** `input` produces a string. `print` displays values. `open` gives a program a stream for reading or writing file contents.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.6 — Simple Input and Output

<span id="part-1-values"></span>

### 1. Values, text, and destinations

Python may keep a position as an integer, a lap time as a float, and a rider name as a string. Console input and text files deal in **text**, so the program must be clear about when it is using text and when it is using a number. Output also needs a destination: the screen by default, or an open file when requested.

```python
rider = "Marc Márquez"
friday_position = 5
friday_best_lap_s = 89.426

print(rider, "Friday Practice P", friday_position, "in", friday_best_lap_s, "s")
```

```text
Marc Márquez Friday Practice P 5 in 89.426 s
```

The example runs, but the space between `P` and `5` makes the result less natural. Later examples show how to control that display. The numeric values remain numbers inside the program even though `print` turns them into visible text.

**Why this example?** It starts with one published Friday result and exposes the default spaces inserted by `print`. **How do we solve it?** Keep the position and lap time in suitable numeric variables, then choose a display that states the session and units.

<span id="part-1-trace"></span>

### 2. A small input-to-answer trace

Suppose the user types `89.558` for Fabio's Friday best lap. The program receives `"89.558"`, a string. Converting it with `float` gives a number that can be compared with Marc's `89.426` seconds:

| Step | Value | Python type | Meaning |
| :--- | :--- | :--- | :--- |
| Typed reply | `"89.558"` | `str` | Text entered for Fabio's Friday best lap. |
| After `float` | `89.558` | `float` | A best-lap duration in seconds. |
| After subtraction | About `0.132` | `float` | Difference between two Friday best laps, in seconds. |
| Printed answer | `0.132 s` | Visible text | A labeled answer the reader can interpret. |

**Why this example?** The quoted and unquoted forms look similar on screen but behave differently in arithmetic. **How do we solve it?** Convert once, calculate with the numeric value, and include `s` and `Friday Practice` in the explanation or output.

A float may contain a tiny binary rounding residue after subtraction; formatting the answer to three decimals produces the visible `0.132 s`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 1.6.1 — Console Input and Output

<span id="part-2-print"></span>

### 1. The `print` function: spaces, separators, and line endings

The book first introduces `print`. It accepts any number of values, converts non-string values for display, inserts a space between values by default, and ends with a newline. Calling `print()` alone creates a blank line. The optional `sep` changes the separator; `end` changes the ending.

```python
print("Marc Márquez", "Ducati Lenovo Team", sep=" | ")
print("Friday Practice", "P5", sep=": ", end="; ")
print("Saturday Sprint", "P1", sep=": ")
print()
print("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", sep=" | ")
```

```text
Marc Márquez | Ducati Lenovo Team
Friday Practice: P5; Saturday Sprint: P1

Fabio Quartararo | Monster Energy Yamaha MotoGP Team
```

The second and third calls share one line because the second call ends with `"; "` rather than a newline. `sep` can contain several characters or be empty. `end=""` is useful when the next output should continue immediately on the same line.

**Why this example?** The real rider and team names make separators visible, while Friday and Saturday results show what `end` changes. **How do we solve it?** Ask where spaces and line breaks should appear, then set `sep` and `end` for that layout. Use `print()` only when a blank line is actually wanted.

<span id="part-2-format"></span>

### 2. Make the printed result readable

A single formatted string avoids unwanted spaces inside `P5` and keeps the three decimal places of a published best lap. The `{:.3f}` field tells `format` to display a number with exactly three digits after the decimal point.

```python
rider = "Marc Márquez"
position = 5
lap_s = 89.426

print("{} — Friday Practice P{}, best lap {:.3f} s".format(rider, position, lap_s))
print("Sunday Grand Prix: Fabio Quartararo P{}, +{:.3f} s".format(9, 19.999))
```

```text
Marc Márquez — Friday Practice P5, best lap 89.426 s
Sunday Grand Prix: Fabio Quartararo P9, +19.999 s
```

Formatting controls the **display**; it does not turn a Friday best lap into a Sunday race gap or change the stored number. A file destination for `print` is covered in Part 3.

**Why this example?** It repairs the `P 5` display from Part 1 and shows that a number needs its session meaning beside it. **How do we solve it?** Build a text template with fields, put the values in the same order in `format(...)`, and label every time with its unit and session.

<span id="part-2-input"></span>

### 3. The `input` function: prompts and returned strings

`input(prompt)` shows the optional prompt, waits until the user presses Enter, and returns the entered characters as a `str`. The ending newline from Enter is not part of that returned string. The user can see typed characters in a normal terminal, but the program still has to convert the returned text before numeric work.

```python
raw_position = input("Marc's Friday Practice position: ")
position = int(raw_position)

print(type(raw_position).__name__)
print(position == 5)
```

A run in which the user types the published position:

```text
Marc's Friday Practice position: 5
str
True
```

`int` accepts suitable whole-number text, and `float` accepts suitable decimal-number text. An invalid reply raises `ValueError`; this small example assumes the user enters a valid value. The prompt is a request to reenter a known result, not a live results feed.

**Why this example?** `"5"` and `5` look similar, but only the latter is an integer position. **How do we solve it?** Capture the reply, convert it once with `int`, and use the converted value in the comparison. Use `float` when the entered value can contain a decimal fraction.

<span id="part-2-split"></span>

### 4. Read two values from one reply

The book also shows how `split()` breaks one reply into pieces. Here we ask for two Friday best laps **already converted to seconds**, separated by a space:

```python
reply = input("Friday best laps in seconds (Marc Fabio): ")
pieces = reply.split()
marc_lap_s = float(pieces[0])
fabio_lap_s = float(pieces[1])
difference_s = round(fabio_lap_s - marc_lap_s, 3)

print("Friday best-lap difference: {:.3f} s".format(difference_s))
```

For the reply `89.426 89.558`:

```text
Friday best laps in seconds (Marc Fabio): 89.426 89.558
Friday best-lap difference: 0.132 s
```

`split()` without an argument separates at whitespace. This code expects exactly the two values in the stated order; a missing piece or invalid decimal needs validation in a program that accepts arbitrary input.

**Why this example?** Both values belong to the same session and unit, so the subtraction has a clear meaning. **How do we solve it?** Split the reply, convert each selected piece with `float`, subtract Marc's duration from Fabio's, and print the calculated difference with its label.

<span id="part-2-program"></span>

### 5. A sample program: a Sunday finish difference

The book's sample program reads a number, computes a new number, and prints an answer. This MotoGP version follows that same flow with **Sunday race gaps to the same winner**. We ask the user to reenter Fabio's published `+19.999`-second gap; Marc's published gap is `+10.778` seconds.

```python
fabio_gap_s = float(input("Fabio's Sunday gap to Bezzecchi (s): "))
marc_gap_s = 10.778
finish_difference_s = fabio_gap_s - marc_gap_s

print("Fabio Quartararo — Monster Energy Yamaha MotoGP Team")
print("Marc Márquez — Ducati Lenovo Team")
print("Calculated Sunday finish difference: {:.3f} s".format(finish_difference_s))
```

For the entered number `19.999`:

```text
Fabio's Sunday gap to Bezzecchi (s): 19.999
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Marc Márquez — Ducati Lenovo Team
Calculated Sunday finish difference: 9.221 s
```

**Why this example?** It makes the full console path visible: prompt, string reply, numeric conversion, calculation, and labeled output. **How do we solve it?** Use `float(input(...))`, subtract gaps that share **Sunday's winner Marco Bezzecchi** as their reference, and print `9.221 s` as a derived finish difference. The program trusts the entered number; it does not verify it against an official service.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 1.6.2 — Files

A file lets a program keep text beyond one console run. `open` returns a **file object**. The program then reads from or writes to that object. The book shows explicit `close()`; the examples here use `with open(...) as fp:`, which closes the file when the indented block finishes, including when an error interrupts it. Closing also flushes buffered output.

<span id="part-3-open"></span>

### 1. Opening a text file and choosing a mode

| Mode | Meaning | MotoGP notebook effect |
| :--- | :--- | :--- |
| `"r"` | Read text; this is the default if the mode is omitted. | Read a saved weekend note; the file must already exist. |
| `"w"` | Write text; create or **replace** the file. | Start a fresh note. Existing contents are lost when opened. |
| `"a"` | Append text; create the file if needed. | Add Saturday and Sunday after Friday without erasing Friday. |
| `"rb"` / `"wb"` | Read or write **bytes**. | Appropriate for binary data, not the text reports below. |

Use `encoding="utf-8"` with these text examples so accented rider names are read and written consistently. A relative filename such as `"indonesia_2026_notes.txt"` is resolved from the program's **current working directory**. `open(filename)` is equivalent to opening for text reading; it will raise `FileNotFoundError` if the file is absent.

```python
filename = "indonesia_2026_notes.txt"

with open(filename, "w", encoding="utf-8") as fp:
    fp.write("Friday Practice: Marc Márquez P5, 89.426 s\n")

with open(filename, "a", encoding="utf-8") as fp:
    fp.write("Saturday Sprint: Marc Márquez P1\n")
    fp.write("Sunday Grand Prix: Marc Márquez P6, +10.778 s\n")

with open(filename, "r", encoding="utf-8") as fp:
    print(fp.read(), end="")
```

```text
Friday Practice: Marc Márquez P5, 89.426 s
Saturday Sprint: Marc Márquez P1
Sunday Grand Prix: Marc Márquez P6, +10.778 s
```

**Why this example?** It uses the three real days to show the difference between starting a file with `"w"` and adding to it with `"a"`. **How do we solve it?** Choose a clear filename, open for writing once, add `\n` at each line's end, append later entries, then reopen for reading. The final `end=""` prevents `print` from adding an extra blank line after `read()`, because the file already ends with a newline.

<span id="part-3-read"></span>

### 2. Reading: `read`, `readline`, `readlines`, and iteration

The book's file-method table distinguishes several ways to read:

| Operation | What it returns or does |
| :--- | :--- |
| `fp.read()` | All remaining text from the current position. |
| `fp.read(k)` | Up to `k` **characters** from a text file. |
| `fp.readline()` | One line, often including its final `\n`. |
| `fp.readlines()` | A list of all remaining lines, with line endings retained. |
| `for line in fp` | Visits lines one at a time, useful for a larger file. |

Each read advances the file's current position. At the end, `read()` returns `""`, while `readline()` also returns `""`. Reading every line into a list uses memory proportional to the file, so iteration is a good choice when a report is large.

```python
filename = "indonesia_2026_reading.txt"
with open(filename, "w", encoding="utf-8") as fp:
    fp.write("Friday Practice: Marc P5, Fabio P7\n")
    fp.write("Saturday Sprint: Marc P1, Fabio P9\n")
    fp.write("Sunday Grand Prix: Marc P6, Fabio P9\n")

with open(filename, "r", encoding="utf-8") as fp:
    first = fp.readline()
    rest = fp.read()
print(first, end="")
print(rest, end="")

with open(filename, "r", encoding="utf-8") as fp:
    lines = fp.readlines()
print("Number of lines:", len(lines))

with open(filename, "r", encoding="utf-8") as fp:
    for line in fp:
        print("Visited:", line.rstrip("\n"))
```

```text
Friday Practice: Marc P5, Fabio P7
Saturday Sprint: Marc P1, Fabio P9
Sunday Grand Prix: Marc P6, Fabio P9
Number of lines: 3
Visited: Friday Practice: Marc P5, Fabio P7
Visited: Saturday Sprint: Marc P1, Fabio P9
Visited: Sunday Grand Prix: Marc P6, Fabio P9
```

**Why this example?** The three sessions make it easy to see how `readline()` consumes only Friday and `read()` then consumes Saturday and Sunday. **How do we solve it?** Open again to start at the beginning for `readlines()` or iteration. Strip the newline only for the final `Visited:` display; the stored line remains unchanged. The position numbers are real, but these compact lines are teaching summaries.

<span id="part-3-write"></span>

### 3. Writing: `write`, `writelines`, and `print(file=...)`

`write(string)` writes exactly the characters supplied; it does **not** add a newline. `writelines(sequence)` writes the strings in order and also does **not** add separators. `print(..., file=fp)` sends formatted print output to an open text file and retains `print`'s usual separator and newline behavior.

```python
filename = "indonesia_2026_writing.txt"
with open(filename, "w", encoding="utf-8") as fp:
    fp.write("Marc Márquez — Ducati Lenovo Team\n")
    fp.writelines([
        "Friday Practice: P5, best lap 89.426 s\n",
        "Saturday Sprint: P1, winner in 19:37.125\n",
    ])
    print("Sunday Grand Prix: P6, +10.778 s", file=fp)

with open(filename, "r", encoding="utf-8") as fp:
    print(fp.read(), end="")
```

```text
Marc Márquez — Ducati Lenovo Team
Friday Practice: P5, best lap 89.426 s
Saturday Sprint: P1, winner in 19:37.125
Sunday Grand Prix: P6, +10.778 s
```

**Why this example?** The same real rider's weekend shows the different newline responsibilities of all three writing methods. **How do we solve it?** Add `\n` to every string passed to `write` or `writelines` when a new line is wanted. Let `print(file=fp)` add its normal newline. Use `with` so the file is closed before reading it back.

<span id="part-3-position"></span>

### 4. File position: `tell` and `seek`

`tell()` gives a position marker for a file, and `seek(...)` moves to a permitted position. For text files, that marker can be an **opaque cookie**, not a simple character index. Use `seek(0)` to restart at the beginning or save a value from `tell()` and pass it back to `seek(...)`. In binary mode, ordinary offsets count bytes; do not assume that arbitrary byte offsets work in a text file, especially with accented names.

```python
filename = "indonesia_2026_riders.txt"
with open(filename, "w", encoding="utf-8") as fp:
    fp.write("Marc Márquez\nFabio Quartararo\n")

with open(filename, "r", encoding="utf-8") as fp:
    first = fp.readline()
    saved_position = fp.tell()
    second = fp.readline()
    fp.seek(saved_position)
    second_again = fp.readline()
    fp.seek(0)
    opening = fp.read(8)

print(first.rstrip("\n"))
print(second.rstrip("\n"))
print(second_again.rstrip("\n"))
print(repr(opening))
```

```text
Marc Márquez
Fabio Quartararo
Fabio Quartararo
'Marc Már'
```

**Why this example?** Repeating Fabio's line proves that `seek(saved_position)` returned to a previously recorded place. The final read includes `á`, making the character-versus-byte distinction concrete. **How do we solve it?** Record a valid position after the first line, read onward, seek back to that saved marker, then use `seek(0)` for a fresh read from the start. In text mode, `read(8)` returns eight characters.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: A Connected Three-Day MotoGP Program

This program asks for a rider code, then writes and reads a text report for that rider's **Friday Practice, Saturday Sprint, and Sunday Grand Prix**. The program uses only known records shown in the official results; the typed code chooses a record rather than fetching new data. Running it creates or replaces a clearly named text file in the current working directory.

```python
records = {
    "MARC": {
        "name": "Marc Márquez",
        "team": "Ducati Lenovo Team",
        "friday_position": 5,
        "friday_best_lap_s": 89.426,
        "sprint_position": 1,
        "sprint_note": "winner in 19:37.125",
        "grand_prix_position": 6,
        "grand_prix_gap_s": 10.778,
    },
    "FABIO": {
        "name": "Fabio Quartararo",
        "team": "Monster Energy Yamaha MotoGP Team",
        "friday_position": 7,
        "friday_best_lap_s": 89.558,
        "sprint_position": 9,
        "sprint_note": "+10.248 s to Marc Márquez",
        "grand_prix_position": 9,
        "grand_prix_gap_s": 19.999,
    },
}

code = input("Rider code (MARC or FABIO): ").strip().upper()

if code not in records:
    print("Unknown rider code.")
else:
    rider = records[code]
    filename = "indonesia_2026_" + code.lower() + ".txt"

    with open(filename, "w", encoding="utf-8") as fp:
        print("{} — {}".format(rider["name"], rider["team"]), file=fp)
        print(
            "Friday Practice: P{}, best lap {:.3f} s".format(
                rider["friday_position"], rider["friday_best_lap_s"]
            ),
            file=fp,
        )
        print(
            "Saturday Sprint: P{}, {}".format(
                rider["sprint_position"], rider["sprint_note"]
            ),
            file=fp,
        )
        print(
            "Sunday Grand Prix: P{}, +{:.3f} s to Marco Bezzecchi".format(
                rider["grand_prix_position"], rider["grand_prix_gap_s"]
            ),
            file=fp,
        )

    print("Saved and read back:", filename)
    with open(filename, "r", encoding="utf-8") as fp:
        for line in fp:
            print(line, end="")
```

For `MARC`, the console shows:

```text
Rider code (MARC or FABIO): MARC
Saved and read back: indonesia_2026_marc.txt
Marc Márquez — Ducati Lenovo Team
Friday Practice: P5, best lap 89.426 s
Saturday Sprint: P1, winner in 19:37.125
Sunday Grand Prix: P6, +10.778 s to Marco Bezzecchi
```

For `FABIO`, the saved lines instead show his team and results:

```text
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Friday Practice: P7, best lap 89.558 s
Saturday Sprint: P9, +10.248 s to Marc Márquez
Sunday Grand Prix: P9, +19.999 s to Marco Bezzecchi
```

**Why this example?** It joins console input, string methods, a dictionary lookup, file output, and file input in one small report. The same program handles both priority riders while labeling each day's result correctly. **How do we solve it?**

1. Store each published result under a name that states its session and meaning.
2. Read a code with `input`, remove surrounding spaces, and normalize its case.
3. Reject an unknown code before looking up a record.
4. Open a rider-specific report with `"w"` and UTF-8; use `print(file=fp)` for one line per result.
5. Finish the `with` block so the file closes, then reopen it with `"r"` and display each stored line.

The report keeps Friday best-lap seconds, Saturday's Sprint result, and Sunday's gap to **Bezzecchi** in separate lines. It never subtracts a lap time from a race gap.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Input and Output Study Cases

<span id="part-5-conversion"></span>

### 1. Numeric input is still text

**Scenario:** A user enters Fabio's Sunday gap as `19.999`, then the program needs to compare it with Marc's `10.778`-second gap.

**Why this case?** The console displays digits, but `input` returns a string. Subtracting a float from that string would raise `TypeError`.

```python
raw_gap = "19.999"  # The string input() would return for this reply.
fabio_gap_s = float(raw_gap)
marc_gap_s = 10.778

print(type(raw_gap).__name__)  # str
print("{:.3f} s".format(fabio_gap_s - marc_gap_s))  # 9.221 s
```

**How to solve it:** Convert the reply with `float` before subtracting. Keep both values as Sunday gaps to the same winner and label the calculated difference.

<span id="part-5-newlines"></span>

### 2. `writelines` does not insert newlines

**Scenario:** We intend to save two Friday Practice position notes, one per line.

**Why this case?** `writelines` writes the supplied strings exactly; it does not add line endings:

```python
filename = "indonesia_2026_lines.txt"
with open(filename, "w", encoding="utf-8") as fp:
    fp.writelines(["Marc Márquez P5", "Fabio Quartararo P7"])

with open(filename, "r", encoding="utf-8") as fp:
    print(fp.read())
```

```text
Marc Márquez P5Fabio Quartararo P7
```

**How to solve it:** Include `\n` in each entry that should end a line:

```python
filename = "indonesia_2026_lines.txt"
with open(filename, "w", encoding="utf-8") as fp:
    fp.writelines(["Marc Márquez P5\n", "Fabio Quartararo P7\n"])

with open(filename, "r", encoding="utf-8") as fp:
    print(fp.read(), end="")
```

```text
Marc Márquez P5
Fabio Quartararo P7
```

These are compact teaching notes from the published Friday classification, not new official table rows.

<span id="part-5-overwrite"></span>

### 3. Opening with `w` replaces earlier contents

**Scenario:** Friday is already recorded, and we want to add Saturday.

**Why this case?** Opening the same file with `"w"` a second time truncates it immediately. To preserve Friday, choose `"a"` for the later entry.

```python
filename = "indonesia_2026_append.txt"
with open(filename, "w", encoding="utf-8") as fp:
    fp.write("Friday Practice: Marc Márquez P5\n")

with open(filename, "a", encoding="utf-8") as fp:
    fp.write("Saturday Sprint: Marc Márquez P1\n")

with open(filename, "r", encoding="utf-8") as fp:
    print(fp.read(), end="")
```

```text
Friday Practice: Marc Márquez P5
Saturday Sprint: Marc Márquez P1
```

**How to solve it:** Start a fresh file with `"w"` only when replacing its contents is intended. Open it later with `"a"` to add a new session, and include a newline so the entries remain separate.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section idea | What to remember | MotoGP example |
| :--- | :--- | :--- |
| `print` | Displays values; `sep` and `end` control spaces and line endings. | Show Marc Márquez and Ducati Lenovo Team with a clear separator. |
| `input` | Returns the entered text as `str` without the Enter newline. | Enter a Friday position or Sunday gap. |
| Conversion | Use `int` or `float` before numeric work. | Convert Fabio's `"19.999"` to a race-gap number. |
| One reply, several values | `split()` separates a string into pieces. | Read Marc's and Fabio's Friday lap seconds. |
| File modes | `"r"` reads, `"w"` replaces, and `"a"` appends. | Keep Friday, Saturday, and Sunday notes. |
| Reading | Choose `read`, `readline`, `readlines`, or line iteration for the job. | Visit one session line at a time. |
| Writing | `write` and `writelines` do not add newlines; `print(file=fp)` normally does. | Write a three-line rider report. |
| Position | `tell` saves a position; `seek(0)` or `seek(saved_position)` moves safely in text mode. | Reread Fabio's name from a saved place. |
| Meaning | Label the session, result type, and unit. | Friday best lap `89.426 s` differs from Sunday finish gap `+10.778 s`. |

> **Mental model:** Decide where the information comes from, convert entered text when needed, calculate with matching measures, and send a clearly labeled result to the screen or a text file.

[🔝 Back to Top](#top)
