<span id="top"></span>

# Python Primer — Section 1.1: Python Overview

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.  
> **Topic:** Why Python is used, how its interpreter runs commands, and how to read a first Python program.  
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.  
> **Learning goal:** Explain each part of Section 1.1 through small, runnable examples, then solve a program modeled on the book's GPA example.  
> **User Prompt:** "Reexplain [Section 1.1] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [oop-concept2.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Three-Day MotoGP Weekend](#background-intuition)
2. [Part 1: Section 1.1 — Why Python?](#part-1)
   - [1. From a question to instructions](#part-1-instructions)
   - [2. Python versions and the book's scope](#part-1-versions)
3. [Part 2: Section 1.1.1 — The Python Interpreter](#part-2)
   - [1. Interactive mode](#part-2-interactive)
   - [2. Scripts and `python -i`](#part-2-scripts)
   - [3. An IDE and its debugger](#part-2-ide)
4. [Part 3: Section 1.1.2 — Preview of a Python Program](#part-3)
   - [1. Translate the GPA problem into MotoGP data](#part-3-translation)
   - [2. Solve the problem step by step](#part-3-algorithm)
   - [3. Complete runnable program and output](#part-3-program)
   - [4. Read the program's syntax carefully](#part-3-syntax)
5. [Part 4: Summary](#part-4)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Three-Day MotoGP Weekend

Imagine following Marc Márquez and Fabio Quartararo through Friday Practice, Saturday's Sprint, and Sunday's Grand Prix. Each session gives us a small question for Python: compare best laps, read finishing positions, or calculate a finishing gap. The figures below come from [Yamaha Factory Racing's full weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia); MotoGP's session reports provide further context.

Friday's **Practice** classification gives each rider's fastest single lap:

| Practice position | Rider            | Team                              | Best lap | Seconds used in code |
| :---------------: | :--------------- | :-------------------------------- | -------: | -------------------: |
|         1         | Raúl Fernández   | SuperFile Trackhouse MotoGP Team  | 1:28.725 |               88.725 |
|         5         | Marc Márquez     | Ducati Lenovo Team                | 1:29.426 |               89.426 |
|         7         | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:29.558 |               89.558 |

Saturday and Sunday have finishing classifications. In each row, a `+` time is the gap to that session's winner:

| Session | Marc Márquez — Ducati Lenovo Team | Fabio Quartararo — Monster Energy Yamaha MotoGP Team |
| :--- | :--- | :--- |
| [Saturday Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), 13 laps | P1, winner in 19:37.125 | P9, +10.248 s to Marc |
| [Sunday Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850), 27 laps | P6, +10.778 s to winner Marco Bezzecchi | P9, +19.999 s to Bezzecchi |

A Friday lap of `1:29.426` means **one minute plus 29.426 seconds**: `60 + 29.426 = 89.426` seconds. Converting both Friday laps first makes subtraction straightforward. A _lower_ lap time is quicker, so `89.558 − 89.426 = 0.132` seconds means Marc's best Practice lap was 0.132 seconds quicker than Fabio's. On Sunday, the two riders' gaps to the same winner let us calculate `19.999 − 10.778 = 9.221` seconds between their race finishes. These calculations use different session measures and remain separate.

**Why these examples?** The three days show that a useful program starts by choosing the right data for its question. **How do we solve them?** Label the session and unit, select two comparable values from that session, perform the calculation, and state what the answer measures.

```text
Friday Practice best laps → convert to seconds → 0.132 s best-lap gap
Saturday Sprint results → read positions → Marc P1, Fabio P9
Sunday Grand Prix gaps to the winner → subtract → 9.221 s finish gap
```

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.1 — Why Python?

<span id="part-1-instructions"></span>

### 1. From a Question to Instructions

An **algorithm** is an ordered set of steps that solves a problem. A **program** writes those steps in a language a computer can run. Python is a _high-level language_: we can express the calculation using names such as `marc_seconds` and `fabio_seconds` instead of handling hardware instructions ourselves. This makes it easier to focus on the logic of a data-structures problem: what data to keep, what operations to perform, and how to check the answer.

Here is the whole lap-gap calculation:

```python
marc_seconds = 89.426
fabio_seconds = 89.558
gap_seconds = fabio_seconds - marc_seconds
print("Friday Practice: Marc's best lap was {:.3f} s quicker.".format(gap_seconds))
```

```text
Friday Practice: Marc's best lap was 0.132 s quicker.
```

**Why this example?** It separates the four essential actions: store, calculate, name the result, and show it. **How to solve it:**

1. Convert the official `m:ss.sss` best laps to seconds.
2. Assign each number to a descriptive name with `=`.
3. Subtract Marc's time from Fabio's; the result is positive because Fabio's number is larger.
4. Use `print` to display the gap. `:.3f` keeps three digits after the decimal point, matching the timing precision shown in the classification.

The book uses a student GPA calculation for the same reason: a small, familiar question can reveal how a whole program is built. We will use a rider-selection notebook for the longer example in Part 3.

<span id="part-1-versions"></span>

### 2. Python Versions and the Book's Scope

The book traces Python to Guido van Rossum's work in the early 1990s, notes Python 2's release in 2000 and Python 3's release in 2008, and teaches **Python 3**, specifically Python 3.1 or later at the time it was written. Python 2 and Python 3 have incompatible syntax and behavior in some places, so use a Python 3 interpreter for the examples here. For instance, `print("Hello")` is the function-call form used in Python 3.

Section 1.1 is a preview. It introduces enough syntax to follow a program; later sections develop objects, operators, control flow, functions, and input in depth. The historical version numbers in the book describe its publication context, not a recommendation to install Python 3.1 today.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 1.1.1 — The Python Interpreter

The **Python interpreter** is the software that runs Python commands. You can give it a command at a prompt or a sequence of commands saved in a plain-text `.py` file. The `python` command below assumes it points to Python 3 on your computer; on some systems the command is `python3` or `py -3`.

<span id="part-2-interactive"></span>

### 1. Interactive Mode: Ask One Question at a Time

Open a terminal and type `python`. The `>>>` marker is the interpreter's prompt; type only the text after it. Here we try Saturday's Sprint classification:

```text
>>> marc_sprint_place = 1
>>> fabio_sprint_place = 9
>>> fabio_sprint_gap = 10.248
>>> print("Saturday Sprint: Marc P{}, Fabio P{} (+{:.3f} s).".format(marc_sprint_place, fabio_sprint_place, fabio_sprint_gap))
Saturday Sprint: Marc P1, Fabio P9 (+10.248 s).
```

**Why this example?** The Sprint result is short enough to inspect one value at a time, and the prompt shows each command's effect immediately. **How to solve it:** assign Marc's and Fabio's finishing places, assign Fabio's gap to Sprint winner Marc, then use `print` to label the output. The places are positions; `10.248` is a gap in seconds. If you change a value at the prompt, the next command uses the new value. Type `exit()` when finished.

An interactive session is useful for trying one idea or inspecting a value while debugging. It begins with a fresh workspace unless you run a saved script first.

<span id="part-2-scripts"></span>

### 2. Scripts: Save a Repeatable Sequence

For Sunday's Grand Prix, both riders' gaps are measured from winner Marco Bezzecchi. Save the following text as `race_gap.py`:

```python
# Sunday 2026 Indonesian GP: seconds behind race winner Marco Bezzecchi.
marc_race_gap = 10.778
fabio_race_gap = 19.999

print("Marc Márquez (Ducati Lenovo Team): P6, +{:.3f} s".format(marc_race_gap))
print("Fabio Quartararo (Monster Energy Yamaha MotoGP Team): P9, +{:.3f} s".format(fabio_race_gap))
print("Sunday Grand Prix gap from Marc to Fabio: {:.3f} s".format(fabio_race_gap - marc_race_gap))
```

Run it in a terminal from the folder containing that file:

```text
python race_gap.py
```

```text
Marc Márquez (Ducati Lenovo Team): P6, +10.778 s
Fabio Quartararo (Monster Energy Yamaha MotoGP Team): P9, +19.999 s
Sunday Grand Prix gap from Marc to Fabio: 9.221 s
```

**Why this example?** A saved script lets you rerun the Sunday calculation and share it. **How to solve it:** save the code with the `.py` suffix, run `python` with the file name, and subtract Marc's winner-relative gap from Fabio's. Because both finished the same 27-lap race, `19.999 − 10.778 = 9.221` seconds is their finish-time difference.

The book also introduces `python -i race_gap.py`. That runs the script **and then leaves the interactive prompt open**, with its variables available:

```text
python -i race_gap.py
>>> marc_race_gap
10.778
```

Use this when the script's output looks surprising and you want to inspect a value immediately after execution. The precise command to launch Python can vary by installation, but the difference between _running a script_ and _staying interactive afterward_ is the key idea.

<span id="part-2-ide"></span>

### 3. An IDE: Edit and Debug in One Place

An **integrated development environment** (IDE) combines a code editor with tools to run and inspect a program. The book names **IDLE**, which comes with standard Python distributions. Its debugger can pause a program and show variable values.

For the Sunday race-gap script, put a breakpoint on the final `print` line. Before that line runs, inspect `marc_race_gap` (`10.778`) and `fabio_race_gap` (`19.999`). Then step once and compare the printed `9.221` with your manual subtraction.

**Why this example?** Seeing both stored values helps distinguish a data-entry mistake from a subtraction mistake. **How to solve it:** pause before the result, inspect the variables, check the arithmetic, then resume. A terminal, IDLE, and other IDEs all run Python code; the IDE adds a convenient view of the process.

| Way to run code            | What you provide                   | What it helps you do                   |
| :------------------------- | :--------------------------------- | :------------------------------------- |
| `python`                   | Commands typed at `>>>`            | Try a quick calculation.               |
| `python race_gap.py`       | A saved `.py` file                 | Repeat the Sunday calculation.         |
| `python -i race_gap.py`    | A saved file, then prompt commands | Inspect values after the script runs.  |
| IDE / IDLE                 | A file opened in an editor         | Set breakpoints and step through code. |

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 1.1.2 — Preview of a Python Program

The book's **Code Fragment 1.1** reads letter grades, looks up each grade's points, and computes a GPA. It also handles an unrecognized grade, stops when the user enters a blank line, and checks that at least one grade was accepted before dividing. Here we keep that learning pattern while using verified **Friday Practice** best laps. Saturday's Sprint and Sunday's race have already provided separate examples of finishing results.

<span id="part-3-translation"></span>

### 1. Translate the GPA Problem into MotoGP Data

Our teaching problem is: **Select riders by code and calculate the mean of their Friday Practice best-lap times.** The mean is useful here because it exercises the same count-and-total logic as GPA. It is **not** a MotoGP classification metric. Enter each rider code once if you want a mean across distinct riders; this introductory program counts repeated entries again.

| In the book's GPA program | In the Practice notebook         | Purpose                  |
| :------------------------ | :------------------------------- | :----------------------- |
| Letter grade, such as `A` | Rider code, such as `MARC`       | What the user types.     |
| `points` dictionary       | `best_lap_seconds` dictionary    | Look up a numeric value. |
| Number of valid courses   | Number of valid selections       | Count accepted inputs.   |
| Total grade points        | Sum of selected best-lap seconds | Build the numerator.     |
| Blank line                | Blank line                       | End input.               |
| Unknown grade             | Unknown rider code               | Warn and keep waiting.   |
| GPA                       | Mean of selected best laps       | Divide total by count.   |

The code uses short, uppercase input codes because they are easy to type. The displayed rider and team names identify the real entries in the classification; accents are included in the Spanish riders' names for readability.

<span id="part-3-algorithm"></span>

### 2. Solve the Problem Step by Step

1. **Prepare the lookup.** Convert each official best lap to seconds: `MARC → 89.426`, `FABIO → 89.558`, and `RAUL → 88.725`.
2. **Start empty.** Set the accepted-selection count to `0`, the total to `0.0`, and a `done` flag to `False`.
3. **Ask repeatedly.** A `while not done` loop reads one code per turn.
4. **Choose one path.** A blank input sets `done` to `True`; an unknown code prints a warning; a known code adds one to the count and adds its seconds to the total.
5. **Finish safely.** After the loop, divide only if the count is greater than zero. Otherwise, report that no valid riders were selected.
6. **Display the answer.** Show three _decimal places_ so the output keeps the thousandths of a second used in official lap timing.

**Why this example?** It preserves the book's main ideas—lookup, input, loop, branches, accumulation, and a safe final division—using Marc, Fabio, and Raúl from Friday Practice. **How to solve it:** follow the six steps in order and trace the changing count and total after every input.

<span id="part-3-program"></span>

### 3. Complete Runnable Program and Output

Save this as `practice_notebook.py` and run `python practice_notebook.py`:

```python
print("Friday 2026 Indonesian GP MotoGP Practice best-lap notebook")
print("Enter MARC, FABIO, or RAUL, one code per line.")
print("Press Enter on an empty line to finish.")

# Friday Practice best laps, converted from m:ss.sss to seconds.
best_lap_seconds = {
    "MARC": 89.426,
    "FABIO": 89.558,
    "RAUL": 88.725,
}

# The same codes retrieve the verified rider and team names.
rider_and_team = {
    "MARC": "Marc Márquez | Ducati Lenovo Team",
    "FABIO": "Fabio Quartararo | Monster Energy Yamaha MotoGP Team",
    "RAUL": "Raúl Fernández | SuperFile Trackhouse MotoGP Team",
}

num_selected = 0
total_seconds = 0.0
done = False

while not done:
    code = input("Rider code (blank to finish): ")
    if code == "":
        done = True
    elif code not in best_lap_seconds:
        print("Unknown code '{}' ignored.".format(code))
    else:
        num_selected += 1
        total_seconds += best_lap_seconds[code]
        print("{}: {:.3f} s".format(rider_and_team[code], best_lap_seconds[code]))

if num_selected > 0:
    mean_seconds = total_seconds / num_selected
    print("Mean of selected best laps: {:.3f} s".format(mean_seconds))
else:
    print("No valid riders selected.")
```

Example input and output (the typed inputs are `MARC`, `UNKNOWN`, `FABIO`, and then a blank line):

```text
Friday 2026 Indonesian GP MotoGP Practice best-lap notebook
Enter MARC, FABIO, or RAUL, one code per line.
Press Enter on an empty line to finish.
Rider code (blank to finish): MARC
Marc Márquez | Ducati Lenovo Team: 89.426 s
Rider code (blank to finish): UNKNOWN
Unknown code 'UNKNOWN' ignored.
Rider code (blank to finish): FABIO
Fabio Quartararo | Monster Energy Yamaha MotoGP Team: 89.558 s
Rider code (blank to finish):
Mean of selected best laps: 89.492 s
```

| Input      | Branch taken            | `num_selected` | `total_seconds` |
| :--------- | :---------------------- | -------------: | --------------: |
| Start      | No input yet            |              0 |           0.000 |
| `MARC`     | Known code: add 89.426  |              1 |          89.426 |
| `UNKNOWN`  | Unknown code: warn only |              1 |          89.426 |
| `FABIO`    | Known code: add 89.558  |              2 |         178.984 |
| Blank line | Stop the loop           |              2 |         178.984 |

Finally, `178.984 / 2 = 89.492` seconds. If the first input is a blank line, `num_selected` remains zero and the program prints `No valid riders selected.` without attempting division.

<span id="part-3-syntax"></span>

### 4. Read the Program's Syntax Carefully

#### The lookup dictionary and assignment

`best_lap_seconds` maps each code to a number. For example, `best_lap_seconds["FABIO"]` retrieves `89.558`. `=` assigns a value; `+=` updates the existing value, so `num_selected += 1` means `num_selected = num_selected + 1`. The labels dictionary uses the same keys to retrieve rider and team names.

**Why this example?** The book's grade-to-points map uses the same structure. **How to solve a lookup:** check that the key exists first (`code in best_lap_seconds`), then access `best_lap_seconds[code]`.

#### Newlines, continuation, and indentation

A newline normally finishes a Python statement. The dictionary above occupies several physical lines because its opening `{` has not yet been closed. Parentheses and square brackets work the same way. Continuing from the earlier `marc_seconds` and `fabio_seconds` values, the book also mentions a trailing backslash for explicit continuation:

```python
gap_seconds = (fabio_seconds
               - marc_seconds)  # open parentheses continue the statement

gap_seconds = fabio_seconds \
    - marc_seconds               # a backslash also continues it
```

**Why this example?** The book's grade dictionary wraps across lines, so it helps to see that a wrapped statement is still one instruction. **How to read it:** look for an unclosed delimiter or a trailing `\`; the next physical line belongs to the same statement. Parentheses are usually easier to read than a backslash.

Indentation determines which statements belong to a block. The following is an excerpt of the notebook's control flow, with its variables initialized as in the full program:

```python
while not done:                 # loop header
    code = input()              # inside the loop
    if code == "":             # inside the loop
        done = True             # inside the if branch

if num_selected > 0:            # outside the loop: run once afterward
    print(total_seconds / num_selected)
```

`if`, `elif`, and `else` in the full program align with one another, so **only one** of their branches runs for each input. The final `if` aligns with `while`, so it runs only after the loop has finished. **Why this example?** Indentation changes what gets repeated and what gets skipped. **How to trace it:** start at a header ending in `:`, follow its indented lines, and watch where the code returns to the previous indentation level.

#### Comments, blank input, and formatting

`#` begins a comment that Python ignores for execution; it explains why a line is there. For example, `# Friday Practice best laps...` documents the session and unit of the numbers. `input()` returns text, and pressing Enter without typing anything gives the empty string `""`, which our program uses as a stop signal. `code not in best_lap_seconds` catches an unsupported code before dictionary lookup can fail.

The book's final GPA format, `{0:.3}`, means **three significant digits**. Our lap-time format, `{:.3f}`, means **three digits after the decimal point**. This distinction matters for timing: formatting `89.492` with three significant digits would show `89.5`, losing the thousandths.

```python
print("{:.3}".format(89.492))   # three significant digits: 89.5
print("{:.3f}".format(89.492))  # three decimal places: 89.492
```

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Summary

| Section idea              | Plain-language meaning                                     | MotoGP example                                    |
| :------------------------ | :--------------------------------------------------------- | :------------------------------------------------ |
| High-level Python program | Write clear steps for the computer.                        | Store best laps and subtract to find a gap.       |
| Interpreter               | Software that runs Python commands.                        | Read Saturday Sprint places at `>>>`.             |
| Script                    | Saved `.py` commands run as a group.                       | Rerun Sunday's `race_gap.py`.                     |
| IDE / debugger            | Edit code and inspect it while it runs.                    | Pause before printing Sunday's race gap.         |
| Dictionary                | Find a value from a key.                                   | `"FABIO" → 89.558`.                               |
| Branches and loop         | Decide what to do for each input; keep asking until blank. | Accept `MARC`, warn for `UNKNOWN`, stop at Enter. |
| Indentation               | Defines which statements belong to a loop or branch.       | Add a lap only inside the known-code `else`.      |
| Zero-count guard          | Divide only when there is at least one valid item.         | Print a message if no rider was selected.         |

[🔝 Back to Top](#top)
