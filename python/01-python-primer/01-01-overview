<span id="top"></span>

# 1.1 Python Overview — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 1, Section 1.1, printed pages 2–3 (the supplied PDF).  
> **Topic:** 1.1 Python Overview; 1.1.1 The Python Interpreter; 1.1.2 Preview of a Python Program.  
> **Domain Focus:** Rectangular cards measured in centimetres; area, total area, and average area.  
> **User Prompt:** Reexplain [`Section 1.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`oop-concept2.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Activity](#background)
   - [1. The geometry problem](#background-problem)
   - [2. From a formula to an algorithm](#background-algorithm)
2. [Part 1: 1.1 Python Overview](#part-1)
   - [1. Why use a programming language?](#part-1-language)
   - [2. Python's history and the scope of this chapter](#part-1-scope)
3. [Part 2: 1.1.1 The Python Interpreter](#part-2)
   - [1. Try a calculation interactively](#part-2-interactive)
   - [2. Save and run a script](#part-2-script)
   - [3. Inspect a run with an editor or debugger](#part-2-ide)
4. [Part 3: 1.1.2 Preview of a Python Program](#part-3)
   - [1. Connect the book's GPA example to geometry](#part-3-bridge)
   - [2. The complete rectangle-card program](#part-3-program)
   - [3. Follow the program step by step](#part-3-walkthrough)
   - [4. Trace a sample run](#part-3-trace)
5. [Part 4: How Python Reads the Program](#part-4)
   - [1. Lines and continuation](#part-4-lines)
   - [2. Indentation and nested blocks](#part-4-indentation)
   - [3. Comments](#part-4-comments)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Activity

<span id="background-problem"></span>

### 1. The geometry problem

Imagine a class cutting rectangular cards for a display board. The teacher offers three card sizes. Students choose cards one at a time, and the class wants the **total area** of the chosen cards and the **average area per card**.

| Card | Width | Height |   Area |
| :--- | ----: | -----: | -----: |
| `A`  |  2 cm |   3 cm |  6 cm² |
| `B`  |  4 cm |   2 cm |  8 cm² |
| `C`  |  4 cm |   4 cm | 16 cm² |

For a rectangle, **area = width × height**. If a student chooses `A` and `C`, the areas are 6 cm² and 16 cm². Their total is 22 cm², and their average is 22 ÷ 2 = 11 cm² per card. Choosing a card twice counts as choosing two physical cards.

<span id="background-algorithm"></span>

### 2. From a formula to an algorithm

The formula tells us how to find **one** area. A computer also needs exact instructions for choosing cards, rejecting unknown labels, keeping a running total, and knowing when to stop. Those instructions form an **algorithm**.

```text
Card label → find dimensions → multiply → update count and total → report average
```

| Geometry idea                       | Meaning in the program                         |
| :---------------------------------- | :--------------------------------------------- |
| Each card has a width and height.   | Store each label with its two measurements.    |
| One card has an area.               | Compute `width * height`.                      |
| Several cards have a total area.    | Add each accepted card's area to `total_area`. |
| An average needs a number of cards. | Divide by `count` only when `count > 0`.       |

This is the background for every example below. The arithmetic stays simple so we can focus on what the Python instructions mean.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 1.1 Python Overview

<span id="part-1-language"></span>

### 1. Why use a programming language?

The section opens with the idea that **data structures and algorithms require precise instructions**. A data structure organizes information; an algorithm says what steps to perform with it. Python is a **high-level language**, meaning its code is much closer to ordinary mathematical instructions than machine instructions are.

```python
width = 2
height = 3
area = width * height
```

Read this as: remember the width as `2`, remember the height as `3`, multiply them, and remember the result as `area`. In Python, `*` means multiplication. The `=` sign **assigns a value to a name**; it is not asking whether two sides are equal. After these lines, `area` is `6`.

Our eventual card table is a **data structure**. The steps that read labels and calculate the average are an **algorithm**. Python is the language used to write both.

<span id="part-1-scope"></span>

### 2. Python's history and the scope of this chapter

The book briefly notes that Guido van Rossum developed Python in the early 1990s. Python 2 appeared in 2000 and Python 3 in 2008; they have important differences. **The book targets Python 3.1 or later.** That is a statement about the book's examples, not a version you need to install today.

This chapter is a selective primer for the Python features used later in the book. It assumes some programming experience, so this guide pauses to explain beginner details. Chapter 2 develops object-oriented programming further.

> **Mental model:** Geometry supplies the rule, an algorithm supplies the steps, and Python expresses those steps for the computer.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 1.1.1 The Python Interpreter

The **interpreter** is the software that reads and runs Python commands. The section shows two main ways to give it commands: type them one at a time or save them in a plain-text file.

<span id="part-2-interactive"></span>

### 1. Try a calculation interactively

Running `python` in a terminal normally opens an interactive session. The `>>>` symbols are Python's prompt; you type only the text after them.

```text
>>> width = 2
>>> height = 3
>>> width * height
6
```

The interpreter immediately shows the value of the expression `width * height`. It displays the number `6`; **we** know the unit is cm² because the inputs were measured in centimetres. Interactive mode is useful for checking a small calculation or experimenting with a command.

<span id="part-2-script"></span>

### 2. Save and run a script

For a calculation we want to repeat, we save commands as **source code** in a plain-text `.py` file. For example, put this in `rectangle_cards.py`:

```python
width = 2
height = 3
area = width * height
print(area)
```

From a terminal in the same folder, run:

```text
python rectangle_cards.py
```

The output is `6`. In a script, the line `print(area)` asks for visible output. A bare `area` or `width * height` line in a script does **not** automatically display its value as it does at the interactive prompt.

The book also shows an option that runs the script **and then** opens the interactive prompt:

```text
python -i rectangle_cards.py
6
>>> area
6
```

| Command                        | What happens                                   | Geometry use                          |
| :----------------------------- | :--------------------------------------------- | :------------------------------------ |
| `python`                       | Start an interactive prompt.                   | Try `2 * 3`.                          |
| `python rectangle_cards.py`    | Run saved commands, then exit.                 | Repeat the area calculation.          |
| `python -i rectangle_cards.py` | Run saved commands, then keep the prompt open. | Inspect `width`, `height`, or `area`. |

<span id="part-2-ide"></span>

### 3. Inspect a run with an editor or debugger

An **integrated development environment (IDE)** combines tools for writing and running code. The book uses **IDLE** as an example. Its debugger can pause a program, execute one step at a time, and show the current values of names such as `count` and `total_area`. That is helpful when the final average is surprising: inspect the values after each accepted card to find the first wrong step.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 1.1.2 Preview of a Python Program

<span id="part-3-bridge"></span>

### 1. Connect the book's GPA example to geometry

The book previews a program that accepts letter grades until the user enters a blank line. It looks up point values, ignores unknown grades, counts accepted courses, adds their points, and calculates a GPA only when at least one course was accepted.

Our card program uses the **same sequence of decisions and calculations**:

| Book's GPA program                        | Our geometry program                               |
| :---------------------------------------- | :------------------------------------------------- |
| Enter a letter grade.                     | Enter a card label.                                |
| Look up a grade's point value.            | Look up a card's width and height.                 |
| Ignore an unknown grade.                  | Ignore an unknown card label.                      |
| Count accepted courses and sum points.    | Count accepted cards and sum their areas.          |
| Calculate GPA when the count is positive. | Calculate average area when the count is positive. |

You do not need to memorize the card table or the GPA program. Notice how a **repeat–check–calculate–report** pattern works for both problems.

<span id="part-3-program"></span>

### 2. The complete rectangle-card program

Replace the short `rectangle_cards.py` script with this version:

```python
# Each card stores (width, height) in centimetres.
cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
count = 0
total_area = 0
done = False

print("Choose cards A, B, or C.")
while not done:
    label = input("Card (blank to finish): ")
    if label == "":
        done = True
    elif label not in cards:
        print("Unknown card; try A, B, or C.")
    else:
        width, height = cards[label]
        area = width * height
        count += 1
        total_area += area
        print("{}: {} x {} = {} cm^2".format(label, width, height, area))

if count > 0:
    print("Cards counted: {}".format(count))
    print("Total area: {} cm^2".format(total_area))
    print("Average area: {} cm^2".format(total_area / count))
else:
    print("No cards selected.")
```

The measurements are deliberately small whole numbers. `cards` is a **dictionary**: each label points to a pair of dimensions. For instance, `"A": (2, 3)` means card `A` is 2 cm wide and 3 cm high. The pair `(2, 3)` is a **tuple**. These names are useful here; the chapter explains Python's data structures more fully later.

<span id="part-3-walkthrough"></span>

### 3. Follow the program step by step

1. **Prepare.** `count` and `total_area` start at zero. `done` starts as `False`, so the `while not done:` loop can run.
2. **Ask.** `input(...)` waits for a line of text. A blank line sets `done = True`, so the next loop check ends the repetition.
3. **Check.** `label not in cards` detects an unknown label. Its message appears, but the count and total do not change. Only an `A`, `B`, or `C` reaches the `else` branch.
4. **Calculate.** `width, height = cards[label]` takes the two measurements from the chosen card. `area = width * height` applies the rectangle formula.
5. **Accumulate.** `count += 1` means `count = count + 1`. Likewise, `total_area += area` adds this card's area to the running total.
6. **Report.** Each `{}` in a print string is replaced by a value supplied to `.format(...)`. After the loop, `if count > 0:` permits division. With no accepted cards, the `else` branch avoids dividing by zero.

The program counts **each valid entry**, even if a student enters the same card label more than once. It accepts uppercase labels exactly as written in `cards`.

<span id="part-3-trace"></span>

### 4. Trace a sample run

Suppose the student enters `A`, then an unknown `X`, then `C`, then a blank line:

| Input | What the program does                      | `count` afterward | `total_area` afterward |
| :---- | :----------------------------------------- | ----------------: | ---------------------: |
| `A`   | Add 2 × 3 = 6 cm².                         |                 1 |                      6 |
| `X`   | Print an error message; ignore this label. |                 1 |                      6 |
| `C`   | Add 4 × 4 = 16 cm².                        |                 2 |                     22 |
| blank | Set `done` to `True`; end the loop.        |                 2 |                     22 |

The final average is **22 ÷ 2 = 11 cm² per card**. The visible interaction is:

```text
Choose cards A, B, or C.
Card (blank to finish): A
A: 2 x 3 = 6 cm^2
Card (blank to finish): X
Unknown card; try A, B, or C.
Card (blank to finish): C
C: 4 x 4 = 16 cm^2
Card (blank to finish):
Cards counted: 2
Total area: 22 cm^2
Average area: 11.0 cm^2
```

The `11.0` appears because Python's `/` division produces a floating-point result.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: How Python Reads the Program

The preview also teaches three reading rules: where a statement ends, how indentation groups instructions, and what comments do.

<span id="part-4-lines"></span>

### 1. Lines and continuation

A Python statement **normally ends at a newline**. If a calculation is long, it can continue onto the next line while a parenthesis, bracket, or brace remains open:

```python
total_area = (
    6 + 16
)
```

The book also mentions a backslash at the very end of a line as another continuation method:

```python
total_area = 6 + \
    16
```

Both assign `22` to `total_area`. Open parentheses are often easier to read because the grouping is visible.

<span id="part-4-indentation"></span>

### 2. Indentation and nested blocks

Python uses **indentation**, or leading spaces, to show which instructions belong to a loop or decision. In the full program, these levels matter:

```python
while not done:                 # repeat this block
    label = input("Card: ")    # inside the loop
    if label == "":            # decision inside the loop
        done = True            # inside that decision

if count > 0:                   # outside the loop; run once at the end
    print(total_area / count)
```

The first `if` is **nested** inside the `while`. The final `if` is back at the left margin, so it runs after the loop. If the final report were indented inside the loop, it could print an unfinished average after every entry. Use four spaces for each level in these examples, and keep lines in the same block aligned.

<span id="part-4-comments"></span>

### 3. Comments

Text after `#` on a line is a **comment**. It helps a person understand the code; the interpreter ignores it while running the program.

```python
# Each card stores (width, height) in centimetres.
cards = {"A": (2, 3)}  # A is 2 cm wide and 3 cm high
```

The comment explains the measurements. The dictionary assignment is the part Python executes.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why does a script show no answer?</strong></summary>

**Scenario:** We save an area calculation in a file and run it, but nothing appears.

**Problem:** In a script, a bare expression does not request output:

```python
width = 2
height = 3
width * height
```

**Fix:** Ask Python to display the value:

```python
print(width * height)
```

**Output:** `6`. At the interactive `>>>` prompt, typing `width * height` alone would also display `6`.

</details>

<details>
<summary><strong>Case Study 2: Should an unknown card affect the average?</strong></summary>

**Scenario:** The input sequence is `A`, `X`, `C`, blank. `X` is not in the card table.

**Problem:** Increasing `count` before checking the label would count a card whose area was never added. That would make the average wrong.

**Fix:** The program checks `elif label not in cards:` first and updates `count` and `total_area` only in the valid-card `else` branch.

**Result:** `count = 2`, `total_area = 22`, and average area is `11.0 cm^2`. This matches two real selected cards.

</details>

<details>
<summary><strong>Case Study 3: What if the student chooses no cards?</strong></summary>

**Scenario:** The first input is blank. Both `count` and `total_area` remain zero.

**Problem:** Evaluating `total_area / count` would try to divide by zero and raise `ZeroDivisionError`.

**Fix:** The final `if count > 0:` checks that division is allowed; otherwise the program prints `No cards selected.`

</details>

<details>
<summary><strong>Case Study 4: Why does the report print too early?</strong></summary>

**Scenario:** A student indents the final report under `while not done:`. The report runs during every loop iteration and may use an unfinished total.

**Fix:** Move the final `if count > 0:` back to the left margin, as in the complete program. The loop gathers all accepted cards; the unindented report runs once after input ends.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 1.1 idea           | Plain-language meaning                                                              | Rectangle-card example                                    |
| :------------------------- | :---------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **High-level language**    | Express steps with readable words and symbols.                                      | `area = width * height` resembles the geometry formula.   |
| **Interpreter**            | Software that runs Python commands.                                                 | It calculates `2 * 3` at the prompt or runs a saved file. |
| **Interactive mode**       | Try a command and see its result immediately.                                       | Enter `width * height` and see `6`.                       |
| **Script**                 | A reusable plain-text `.py` program.                                                | `rectangle_cards.py` processes a sequence of cards.       |
| **Newline / continuation** | A line usually ends a statement; open delimiters or a backslash allow continuation. | Split `6 + 16` over two lines.                            |
| **Indentation**            | Leading spaces define loops and decision blocks.                                    | Only a valid card reaches the area calculation.           |
| **Comment**                | A note for readers that Python ignores.                                             | `# Each card stores (width, height)`.                     |

[🔝 Back to Top](#top)
