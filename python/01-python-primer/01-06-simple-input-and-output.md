<span id="top"></span>

# 1.6 Simple Input and Output — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.6, printed pages 30–32 (the supplied PDF).  
> **Topic:** 1.6.1 Console Input and Output; 1.6.2 Files, including reading and writing text.  
> **Domain Focus:** Entering rectangular-card measurements and choices, displaying their areas, and saving a small card report.  
> **User Prompt:** Reexplain Section 1.6 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The same card sizes and choices](#background-cards)
   - [2. Where input and output fit](#background-io)
2. [Part 1: 1.6 Simple Input and Output](#part-1)
   - [1. Console and file are two places to exchange data](#intro-channels)
3. [Part 2: 1.6.1 Console Input and Output](#part-2)
   - [1. The print function](#print)
   - [2. Control separators, line endings, and destination](#print-options)
   - [3. The input function returns text](#input)
   - [4. Convert numbers and split a line](#convert-split)
   - [5. A complete console area program](#console-program)
4. [Part 3: 1.6.2 Files](#part-3)
   - [1. Open a file in the right mode](#open-modes)
   - [2. File methods and the current position](#file-methods)
   - [3. Read a card file](#reading)
   - [4. Write and append a card report](#writing)
5. [Part 4: One Connected Geometry Program](#part-4)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-cards"></span>

### 1. The same card sizes and choices

Students cut rectangular cards for a display board. The dimensions are in centimetres, and **area = width × height**.

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The request `["A", "C", "A"]` means three **physical cards**, including two A cards. Their combined area is `6 + 16 + 6 = 28` cm², and their average area is about `9.33` cm² per card. We will also use `"?"` as an unknown label that the program skips.

<span id="background-io"></span>

### 2. Where input and output fit

Earlier sections computed the area from values already written in code. **Input** lets a person or a file supply the values. **Output** lets the program show a result or save it for later.

```text
Keyboard or card file → strings read by Python → convert and calculate → console or report file
```

For example, a student may type `2 3` for A's dimensions and `A C ? A` for card choices. Python reads the typed characters, converts the dimensions to numbers, ignores `?`, then reports **3 accepted cards** and **28 cm²**.

> **Mental model:** Read values, interpret them, calculate, then choose where the result should go.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.6 Simple Input and Output

<span id="intro-channels"></span>

### 1. Console and file are two places to exchange data

The section introduces two ways for a program to communicate:

| Channel | How a workshop program uses it | Does it persist after the run? |
| :--- | :--- | :--- |
| **Console** | Ask for dimensions with `input`; display an area with `print`. | The program does not itself save the exchange to a file. |
| **Text file** | Read a saved list of cards; write a report with `open` and file methods. | Yes, the file can be read again later. |

The arithmetic is the same in both cases. What changes is **where the values come from** and **where the results go**. Input from a keyboard arrives as text, so numeric measurements must be converted before multiplication.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.6.1 Console Input and Output

<span id="print"></span>

### 1. The print function

`print` sends output to the console by default. It can receive several arguments, separates them with spaces, and ends with a newline. A number is converted to display text automatically.

```python
width = 2
height = 3
area = width * height

print("A area:", area, "cm²")  # A area: 6 cm²
print()                       # Print an empty line.
print("Calculation complete")
```

The `6` above is still a number inside the program; `print` formats it as visible characters. Calling `print()` with no arguments outputs just a newline.

<span id="print-options"></span>

### 2. Control separators, line endings, and destination

The book introduces three optional `print` keyword arguments in this order:

| Option | Default | What changes |
| :--- | :--- | :--- |
| `sep` | One space between arguments | The text placed between arguments. |
| `end` | Newline after the last argument | The text placed after the last argument. |
| `file` | Console output | The destination for the output. |

```python
print("A", 6, sep=": ")      # A: 6
print("A", end=" -> ")
print(6, "cm²")              # Together: A -> 6 cm²
```

An empty separator, `sep=""`, joins arguments without anything between them. An empty ending, `end=""`, keeps the next output on the same line. We will use `file=fp` in Part 3 to direct the same `print` call into a report file.

<span id="input"></span>

### 3. The input function returns text

`input(prompt)` displays an optional prompt, waits for the user to type a line and press Enter, and returns the characters **before** Enter as a string. The returned string does not contain the Enter newline.

```python
label = input("Choose a card label: ")
print("You chose", label)
```

If the user enters `A`, the variable `label` contains the string `"A"`. If the user enters `2`, the result is the string `"2"`, not the integer `2`. That distinction matters for geometry:

```python
width_text = "2"
height_text = "3"

print(width_text + height_text)            # 23: strings join.
print(int(width_text) * int(height_text))  # 6: numbers multiply.
```

<span id="convert-split"></span>

### 4. Convert numbers and split a line

Use `int(...)` for whole-number dimensions or `float(...)` when a measurement can contain a decimal. If a person enters two measurements on one line, `split()` separates the text at whitespace:

```python
reply = input("Width and height of A (cm): ")  # Example input: 2 3
pieces = reply.split()                           # ["2", "3"]
width = float(pieces[0])
height = float(pieces[1])
print("A area:", width * height, "cm²")         # 6.0 cm²
```

`pieces[0]` and `pieces[1]` are still strings until `float` converts them. This simple example assumes the user enters exactly two valid numbers. Missing pieces or nonnumeric text need additional handling, introduced with exceptions in Section 1.7.

<span id="console-program"></span>

### 5. A complete console area program

The book ends its console discussion with a small program that reads a number, calculates a result, and prints it. Here the same pattern calculates card A's area:

```python
width = int(input("Width of A (cm): "))    # Example input: 2
height = int(input("Height of A (cm): "))  # Example input: 3
area = width * height
print("A area:", area, "cm²")              # A area: 6 cm²
```

Each `input` returns a string; each `int` turns that string into a whole number. The program then uses the same multiplication as in the earlier guides.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.6.2 Files

<span id="open-modes"></span>

### 1. Open a file in the right mode

`open(filename, mode)` returns a **file object** (the book calls it a proxy) through which the program reads or writes. If the mode is omitted, Python opens a text file for reading.

| Mode | Meaning for a card file |
| :--- | :--- |
| `"r"` or omitted | Read an existing file. |
| `"w"` | Write a file, replacing any existing contents. |
| `"a"` | Add new text at the end of a file. |
| `"rb"` / `"wb"` | Read or write bytes rather than text. |

```python
fp = open("card_mode_demo.txt", "w", encoding="utf-8")
fp.write("A 2 3\n")
fp.close()
```

`close()` releases the file and ensures buffered output is saved. The book shows opening and closing explicitly. **Modern Python practice** commonly uses `with` so the file closes automatically when the block ends:

```python
with open("card_mode_demo.txt", "w", encoding="utf-8") as fp:
    fp.write("A 2 3\n")
```

The examples name `encoding="utf-8"` so text such as `cm²` is handled consistently across computers. The demo filenames are relative to the directory from which the program runs. Running a `"w"` example again replaces that demo file's previous contents.

<span id="file-methods"></span>

### 2. File methods and the current position

A file object remembers **where the next read or write will occur**. Reading advances that position; `tell()` records it, and `seek(...)` moves to another position. The book's Table 1.5 introduces these operations:

| Operation | Meaning for a text file |
| :--- | :--- |
| `fp.read()` | Return all remaining text. |
| `fp.read(k)` | Return up to the next `k` characters. |
| `fp.readline()` | Return the next line (or the rest of the current line). |
| `fp.readlines()` | Return the remaining lines as a list of strings. |
| `for line in fp:` | Visit the remaining lines one at a time. |
| `fp.tell()` | Return a position value that can be saved. |
| `fp.seek(0)` or `fp.seek(saved_position)` | Go to the start or restore a saved position. |
| `fp.write(text)` | Write exactly the supplied text. |
| `fp.writelines(lines)` | Write each supplied string without adding line breaks. |
| `print(..., file=fp)` | Direct formatted print output to this file. |

**Text-mode detail:** The book describes `read(k)` and file positions in bytes. In current Python text mode, `read(k)` counts **characters**, and `tell()` returns a position value that is safe to pass back to `seek()`; it need not be a byte count. Binary mode counts bytes. See the [Python documentation on text streams](https://docs.python.org/3/library/io.html#io.TextIOBase).

```python
with open("card_position_demo.txt", "w", encoding="utf-8") as fp:
    fp.write("A 2 3\nC 4 4\n")

with open("card_position_demo.txt", "r", encoding="utf-8") as fp:
    print(repr(fp.read(1)))       # 'A'
    saved_position = fp.tell()
    print(repr(fp.read(4)))       # ' 2 3'
    fp.seek(saved_position)
    print(repr(fp.readline()))    # ' 2 3\n'
    fp.seek(0)
    print(repr(fp.readline()))    # 'A 2 3\n'
```

After reading one character, the next read starts immediately after it. The saved value returns to that exact place. `seek(0)` starts again at the beginning.

<span id="reading"></span>

### 3. Read a card file

Suppose the file holds one card per line as `label width height`. `readline()` takes one line; `read()` then takes what remains. Opening the file again starts a fresh read from the beginning.

```python
with open("card_lines_demo.txt", "w", encoding="utf-8") as fp:
    fp.writelines(["A 2 3\n", "C 4 4\n", "A 2 3\n"])

with open("card_lines_demo.txt", "r", encoding="utf-8") as fp:
    print(repr(fp.readline()))  # 'A 2 3\n'
    print(repr(fp.read()))      # 'C 4 4\nA 2 3\n'

with open("card_lines_demo.txt", "r", encoding="utf-8") as fp:
    for line in fp:
        pieces = line.split()
        label = pieces[0]
        width = int(pieces[1])
        height = int(pieces[2])
        print(label, width * height)
# A 6
# C 16
# A 6
```

A line read from a text file usually includes its trailing newline; `split()` removes surrounding whitespace while separating the fields. A fresh `open` returns a new file object starting at the beginning. For a small file, `readlines()` could make a list of its lines; a `for line in fp` loop processes one line at a time.

<span id="writing"></span>

### 4. Write and append a card report

`write` and `writelines` write the strings you supply. **Neither adds a newline for you.** Put `\n` in a string when a new line is needed. By contrast, `print(..., file=fp)` adds its usual newline unless `end` changes it.

```python
with open("card_notes_demo.txt", "w", encoding="utf-8") as fp:
    fp.write("A: 6 cm²\n")
    fp.writelines(["B: 8 cm²\n", "C: 16 cm²\n"])
    print("A+C+A total:", 28, "cm²", file=fp)

with open("card_notes_demo.txt", "a", encoding="utf-8") as fp:
    fp.write("Average: 9.33 cm²\n")

with open("card_notes_demo.txt", "r", encoding="utf-8") as fp:
    print(fp.read(), end="")
```

The first `with` creates or replaces the report. The second adds a line at its end. The final `with` reads it back. The report contains three card lines, one total line, and one average line.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This program reads A's dimensions and a list of requested labels from the console. It accepts A, B, and C, skips an unknown label, writes a report, and reads that report back to display it. The `with` blocks close the file automatically.

```python
def card_area(width, height):
    return width * height

dimension_reply = input("Width and height of A (cm): ")  # Example: 2 3
pieces = dimension_reply.split()
width_a = int(pieces[0])
height_a = int(pieces[1])

card_sizes = {"A": (width_a, height_a), "B": (4, 2), "C": (4, 4)}
choice_reply = input("Card labels: ")  # Example: A C ? A
requests = choice_reply.split()

accepted_count = 0
total_area = 0
for label in requests:
    if label not in card_sizes:
        continue
    width, height = card_sizes[label]
    total_area += card_area(width, height)
    accepted_count += 1

with open("card_report_demo.txt", "w", encoding="utf-8") as fp:
    print("Accepted cards:", accepted_count, file=fp)
    print("Total area:", total_area, "cm²", file=fp)
    if accepted_count:
        print("Average area:",
              round(total_area / accepted_count, 2), "cm²", file=fp)
    else:
        print("Average area: none", file=fp)

with open("card_report_demo.txt", "r", encoding="utf-8") as fp:
    for line in fp:
        print(line, end="")
```

**Sample console input:**

```text
2 3
A C ? A
```

**Report file contents and displayed result:**

```text
Accepted cards: 3
Total area: 28 cm²
Average area: 9.33 cm²
```

The first input line becomes the numbers `2` and `3`. The second becomes four labels. The loop adds areas for A, C, and A, giving **28 cm²**, and ignores `?`. The report is written with `"w"`, then read back line by line. `print(line, end="")` avoids adding a second newline to each line already read from the file. This simple program assumes the first input line contains two valid whole numbers; Section 1.7 discusses how to handle invalid input.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: The typed dimensions are still strings</strong></summary>

**Scenario.** A student types `2` and `3` for A's width and height. The program joins the raw strings instead of doing arithmetic:

```python
width_text = "2"
height_text = "3"

print(width_text + height_text)            # 23
print(int(width_text) * int(height_text))  # 6
```

**Check.** `+` joins two strings. After conversion to numbers, `*` computes A's area as **6 cm²**. For a measurement such as `2.5`, use `float(...)` instead of `int(...)`.

</details>

<details>
<summary><strong>Case Study 2: One measurement is missing</strong></summary>

**Scenario.** The program expects two dimensions, but the input line contains only `2`.

```python
reply = "2"
pieces = reply.split()

if len(pieces) == 2:
    width = float(pieces[0])
    height = float(pieces[1])
    print(width * height)
else:
    print("Enter width and height")
```

**Check.** The length check prevents an attempt to read `pieces[1]` when it does not exist. It does not yet check whether two supplied strings are valid numbers; that is an exception-handling topic in Section 1.7.

</details>

<details>
<summary><strong>Case Study 3: write does not separate report lines</strong></summary>

**Scenario.** Two `write` calls supply no newline, so their text runs together.

```python
with open("card_newline_demo.txt", "w", encoding="utf-8") as fp:
    fp.write("A: 6 cm²")
    fp.write("C: 16 cm²")

with open("card_newline_demo.txt", "r", encoding="utf-8") as fp:
    print(fp.read())  # A: 6 cm²C: 16 cm²
```

**Fix.** Supply `"A: 6 cm²\n"` in the first call, or use `print("A: 6 cm²", file=fp)` to get a newline automatically. `writelines` also needs newline characters in its supplied strings.

</details>

<details>
<summary><strong>Case Study 4: write mode replaces a file; append mode extends it</strong></summary>

**Scenario.** A workshop starts a report, starts over, and then adds a later card.

```python
with open("card_modes_demo.txt", "w", encoding="utf-8") as fp:
    fp.write("A: 6 cm²\n")

with open("card_modes_demo.txt", "w", encoding="utf-8") as fp:
    fp.write("C: 16 cm²\n")  # Replaces the earlier A line.

with open("card_modes_demo.txt", "a", encoding="utf-8") as fp:
    fp.write("A: 6 cm²\n")   # Adds a new line after C.

with open("card_modes_demo.txt", "r", encoding="utf-8") as fp:
    print(fp.read(), end="")
# C: 16 cm²
# A: 6 cm²
```

**Check.** `"w"` creates a fresh report or truncates an existing one. `"a"` writes at the end. Choose the mode before opening the file.

</details>

<details>
<summary><strong>Case Study 5: Text reads characters, and a saved position can be restored</strong></summary>

**Scenario.** A short report contains the text `cm²`. The superscript `²` occupies more than one byte in UTF-8, but it is still one character to a text-mode read.

```python
with open("card_unicode_demo.txt", "w", encoding="utf-8") as fp:
    fp.write("cm²")

with open("card_unicode_demo.txt", "r", encoding="utf-8") as fp:
    saved_position = fp.tell()
    print(fp.read(3))    # cm²: three characters
    fp.seek(saved_position)
    print(fp.read(3))    # cm² again
```

**Check.** In text mode, `read(3)` requests three characters. Save a position from `tell()` and pass that value to `seek()` to return there; do not assume the position value is a character index or byte count.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 1.6 idea | What it means | Rectangle-card example |
| :--- | :--- | :--- |
| `print` | Display values, with spaces and a final newline by default. | Show `A area: 6 cm²`. |
| `sep`, `end`, `file` | Choose the separator, ending, or destination. | Print a label and area together, or write them to a report. |
| `input` | Read a typed line as a string without the Enter newline. | Receive `"2 3"` or `"A C ? A"`. |
| `int`, `float`, `split` | Separate fields and convert numeric text before calculation. | Turn `"2"` and `"3"` into lengths and compute 6 cm². |
| `open` modes | Read, replace, or append to a file. | `"r"` reads; `"w"` starts a report; `"a"` adds a line. |
| File position and reading | Reads advance a position; line methods and iteration consume remaining text. | Read each `label width height` record. |
| Writing methods | `write` and `writelines` need explicit `\n`; `print(..., file=fp)` adds one by default. | Save the 28 cm² total on its own line. |
| Closing a file | `close()` or a `with` block releases it and saves buffered output. | Finish `card_report_demo.txt` before reading it back. |

[🔝 Back to Top](#top)
