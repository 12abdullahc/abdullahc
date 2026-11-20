<span id="top"></span>

# Stacks, Queues, and Deques — Section 6.1: Stacks

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.1, printed pages 229–238 ([chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C06.pdf)).  
> **Topic:** Last-in, first-out order; the stack abstract data type; a list-based implementation; reversing data; matching parentheses and HTML tags.  
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika, using Marc Márquez, Fabio Quartararo, and Raúl Fernández.  
> **Learning goal:** Predict every stack operation, implement a stack, explain its costs, and use it to reverse notes and check nested text.  
> **User Prompt:** "Reexplain [Section 6.1] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Practice Notebook](#background-intuition)
   - [1. One verified session](#background-data)
   - [2. A pile of notes](#background-stack)
2. [Part 1: Section 6.1 — What a Stack Does](#part-1)
   - [1. Last in, first out](#part-1-lifo)
   - [2. Undo and browser Back](#part-1-uses)
3. [Part 2: Section 6.1.1 — The Stack Abstract Data Type](#part-2)
   - [1. The five public operations](#part-2-interface)
   - [2. Trace operations and handle an empty stack](#part-2-trace)
4. [Part 3: Section 6.1.2 — A Simple Array-Based Stack](#part-3)
   - [1. Adapt the end of a Python list](#part-3-adapter)
   - [2. Build and use `ArrayStack`](#part-3-code)
   - [3. Time, space, and reserved capacity](#part-3-cost)
5. [Part 4: Section 6.1.3 — Reversing Data](#part-4)
   - [1. Reverse a review order](#part-4-review)
   - [2. Reverse the lines of a file](#part-4-file)
6. [Part 5: Section 6.1.4 — Matching Parentheses and HTML Tags](#part-5)
   - [1. Match three kinds of grouping symbols](#part-5-delimiters)
   - [2. Match simple nested HTML tags](#part-5-html)
7. [Part 6: Complete Worked Practice Notebook](#part-6)
   - [1. Solve the task step by step](#part-6-steps)
   - [2. Run and trace the program](#part-6-program)
8. [Part 7: Summary](#part-7)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Practice Notebook

<span id="background-data"></span>

### 1. One verified session

We will use three entries from **MotoGP Practice on Friday 9 October 2026**, during the Indonesian Grand Prix. The [MotoGP session report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) identifies the session and riders; [Yamaha's full Practice results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give their positions, teams, and best laps.

| Practice position | Rider | Team | Best lap |
| :---------------: | :---- | :--- | -------: |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:29.558 |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 |

The rows put Marc and Fabio first for our study. **They are not in classification order.** Their positions and best laps are real; the order in which we add, undo, or reverse notebook entries below is a teaching example. None of those notebook actions changes a MotoGP result.

**Why this example?** Three real entries are enough to see every push and pop without losing track of the top. **How to use the data:** keep each rider's position, team, and lap together, and distinguish the official Practice position from our chosen notebook order.

<span id="background-stack"></span>

### 2. A pile of notes

Imagine writing one note for Raúl, then one for Fabio, then one for Marc. Put each new note on top of a pile:

```text
Top     Marc Márquez       ← newest note
        Fabio Quartararo
Bottom  Raúl Fernández    ← oldest note
```

If you can take a note only from the top, Marc comes off first, then Fabio, then Raúl. This is a **stack**. The rule is **last in, first out**, abbreviated **LIFO**. A stack exposes the newest item through its **top**; the older items remain underneath.

**Why this example?** A small pile makes "top" physical and makes LIFO different from Practice ranking. **How to predict removal:** write the entry order from bottom to top, then read it backward as items are removed.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 6.1 — What a Stack Does

<span id="part-1-lifo"></span>

### 1. Last in, first out

The book introduces stacks using physical piles and familiar software actions. We need three verbs:

| Operation | Meaning | Practice notebook example |
| :-------- | :------ | :------------------------ |
| **Push** | Add an item on top. | Add Marc's note after Fabio's. |
| **Top** | Read the top item without removing it. | See that Marc's note is newest. |
| **Pop** | Remove and return the top item. | Take Marc's note off the pile. |

Starting with `[Raúl, Fabio, Marc]`, where the **rightmost item is the top**, `top()` returns Marc and leaves the stack unchanged. `pop()` returns Marc and leaves `[Raúl, Fabio]`. A second `pop()` returns Fabio.

```text
Before: [Raúl, Fabio, Marc]  top → Marc
top(): Marc                 [Raúl, Fabio, Marc]  (unchanged)
pop(): Marc                 [Raúl, Fabio]
pop(): Fabio                [Raúl]
```

**Why this example?** Using the same note twice shows the key difference between seeing and removing. **How to solve a stack trace:** after each push, add at the right; after each pop, cross out the rightmost item; after top, leave the drawing alone.

<span id="part-1-uses"></span>

### 2. Undo and browser Back

An editor's **Undo** action can use a stack of recent changes. If we type the three rider notes in our chosen order, the latest change is the Marc note. Undo removes that change before it can undo Fabio's. A browser's **Back** behavior has the same recent-first idea: the most recently visited previous page is the first one to revisit. A complete browser also manages forward navigation, so a single simple stack is only the part of the model relevant here.

| Action | Recent-first item | What happens next |
| :----- | :---------------- | :---------------- |
| Add Marc's note last | Marc's note | Undo targets Marc's note. |
| Undo once | Fabio's note | A second Undo targets Fabio's note. |
| View Marc's Practice page after Fabio's | Fabio's page | Back returns to Fabio's page. |

**Why these examples?** Both applications need to recover the latest earlier state; that is exactly the stack's access rule. **How to decide whether a stack fits:** ask whether the next item needed is always the most recently added one. If it is, push on arrival and pop when stepping back.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 6.1.1 — The Stack Abstract Data Type

An **abstract data type** (ADT) specifies behavior without choosing storage. We can describe what a stack does before deciding to store its items in a Python list.

<span id="part-2-interface"></span>

### 1. The five public operations

Let `S` be a stack and `e` any item. Section 6.1.1 gives this interface:

| Operation | Result | If `S = [Raúl, Fabio]` |
| :-------- | :----- | :--------------------- |
| `S.push(e)` | Add `e` at the top; return no item. | `S.push("Marc")` makes `[Raúl, Fabio, Marc]`. |
| `S.pop()` | Remove and return the top item. | Returns Fabio; leaves `[Raúl]`. |
| `S.top()` | Return the top item without removal. | Returns Fabio; leaves `[Raúl, Fabio]`. |
| `S.is_empty()` | Return `True` if there are no items. | `False`. |
| `len(S)` | Return the number of items. | `2`. |

Each row starts independently with the stack shown in the column heading. The interface permits any element type: a code, a whole rider record, or something else. It gives no fixed maximum size, although a real computer has finite memory. The public interface has no "remove the bottom rider" operation; in `[Raúl, Fabio]`, reaching Raúl requires popping Fabio first.

**Why this example?** It separates the contract from any implementation detail. **How to use an ADT description:** state the stack's starting contents, apply one operation, then report both its return value and the resulting contents.

<span id="part-2-trace"></span>

### 2. Trace operations and handle an empty stack

The table traces a fresh stack. Contents are always written **bottom to top**:

| Step | Operation | Returned value | Stack afterward |
| ---: | :-------- | :------------- | :-------------- |
| 0 | Start | — | `[]` |
| 1 | `push("Raúl")` | None | `[Raúl]` |
| 2 | `push("Fabio")` | None | `[Raúl, Fabio]` |
| 3 | `push("Marc")` | None | `[Raúl, Fabio, Marc]` |
| 4 | `top()` | Marc | `[Raúl, Fabio, Marc]` |
| 5 | `len(S)` | 3 | `[Raúl, Fabio, Marc]` |
| 6 | `pop()` | Marc | `[Raúl, Fabio]` |
| 7 | `pop()` | Fabio | `[Raúl]` |
| 8 | `pop()` | Raúl | `[]` |
| 9 | `is_empty()` | True | `[]` |
| 10 | `pop()` | error: `Empty` | `[]` |

An empty stack has no top item. The book's implementation raises a custom `Empty` exception for `top()` and `pop()` when there is nothing to return. For user-facing Undo, we can check first:

```python
if history.is_empty():
    print("No Practice note to undo.")
else:
    print("Undo:", history.pop())
```

**Why this example?** It covers reading, removing, counting, and the edge case that causes a program error. **How to solve it:** keep a bottom-to-top list after every row; never remove anything for `top()`; before `pop()` or `top()`, check whether the list is empty.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 6.1.2 — A Simple Array-Based Stack

<span id="part-3-adapter"></span>

### 1. Adapt the end of a Python list

The book implements the stack ADT with a Python `list`. The last list element becomes the top:

```text
List index:   0       1       2
Stored:     [Raúl,  Fabio,  Marc]
                             ↑ top
```

This is an **adapter**: the public stack methods use existing list operations internally.

| Stack operation | List operation |
| :-------------- | :------------- |
| `push(e)` | `_data.append(e)` |
| `pop()` | `_data.pop()`, after an empty check |
| `top()` | `_data[-1]`, after an empty check |
| `is_empty()` | `len(_data) == 0` |
| `len(S)` | `len(_data)` |

Putting the top at the **end** matters. Appending or removing there normally leaves the earlier elements in place. If the top were at index `0`, insertion and removal would shift the other elements.

**Why this example?** Three positions make the list-to-stack mapping visible. **How to implement the adapter:** hide the list in `_data`, expose only stack operations, and use the list's end consistently as the top.

<span id="part-3-code"></span>

### 2. Build and use `ArrayStack`

This small class follows the behavior in the book. Run the whole block in Python 3:

```python
class Empty(Exception):
    """Raised when top or pop is requested from an empty stack."""


class ArrayStack:
    def __init__(self):
        self._data = []

    def __len__(self):
        return len(self._data)

    def is_empty(self):
        return len(self._data) == 0

    def push(self, item):
        self._data.append(item)

    def top(self):
        if self.is_empty():
            raise Empty("Stack is empty")
        return self._data[-1]

    def pop(self):
        if self.is_empty():
            raise Empty("Stack is empty")
        return self._data.pop()


notes = ArrayStack()
notes.push("Raúl")
notes.push("Fabio")
notes.push("Marc")
print(len(notes), notes.top())
print(notes.pop(), notes.top())
```

```text
3 Marc
Marc Fabio
```

`__len__` makes Python's `len(notes)` call our method. The leading underscore in `_data` signals that callers should use the stack methods instead of editing its storage directly. After the final print, the stack is `[Raúl, Fabio]`.

**Why this example?** It turns the ADT contract into runnable code and checks that `top()` did not remove Marc before `pop()` did. **How to solve an implementation question:** match every public method to the list operation above, add the empty checks before indexing or popping, and test the result on a three-item trace.

<span id="part-3-cost"></span>

### 3. Time, space, and reserved capacity

For `n` stored entries, the book's costs for this list-based design are:

| Operation | Time | Reason |
| :-------- | :--- | :----- |
| `len(S)`, `is_empty()` | `O(1)` worst case | The list keeps its length. |
| `top()` | `O(1)` worst case | Read the last reference. |
| `push(e)` | `O(1)` **amortized** | Most appends are constant time; an occasional resize copies many references. |
| `pop()` | `O(1)` **amortized** | Removing the last item is normally constant time; resizing can occasionally cost more. |
| Storage | `O(n)` | Keep one reference per stored entry, plus spare list capacity. |

**Amortized** means a long sequence of pushes or pops averages constant work per operation. One particular operation can take `O(n)` when the underlying array resizes. Reserving capacity in advance can avoid resize costs while the entries fit, but then physical list length and logical stack size differ:

```python
storage = [None] * 3  # three allocated slots
size = 0              # no stack items yet
print(len(storage), size)
```

```text
3 0
```

A reserved-capacity stack must track `size` separately, use `size - 1` for the top, clear popped slots, and decide what to do when all slots are full. Treating `len(storage)` as the number of items would incorrectly report three entries in this empty stack.

**Why this example?** It makes the difference between allocated room and actual items concrete. **How to analyze cost:** count the normal list work, account for occasional resizing across many operations, and keep memory use separate from running time.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 6.1.3 — Reversing Data Using a Stack

<span id="part-4-review"></span>

### 1. Reverse a review order

Suppose our notebook records Raúl, Fabio, then Marc. To review the newest note first, push the entries in that order and pop until empty:

```python
review = ArrayStack()  # use the class from Part 3
for rider in ["Raúl Fernández", "Fabio Quartararo", "Marc Márquez"]:
    review.push(rider)

while not review.is_empty():
    print(review.pop())
```

```text
Marc Márquez
Fabio Quartararo
Raúl Fernández
```

The first pop returns the last push. After all three pops, `review` is empty. This is a reversal of **our note-entry order**, not a reordering of the official Practice classification.

Moving items from one stack into a **second** stack also reverses their stored order: `[Raúl, Fabio, Marc]` becomes `[Marc, Fabio, Raúl]` in the second stack (bottom to top). Moving them straight back reverses the order again and restores `[Raúl, Fabio, Marc]`. To **print** newest first, pop and print from the original stack as the code does.

**Why this example?** The output shows LIFO directly, with Marc and Fabio first in the review. **How to solve a reversal:** push each original item once, then pop and output each item once. For `n` items, this takes `O(n)` time and `O(n)` extra space.

<span id="part-4-file"></span>

### 2. Reverse the lines of a file

The book applies the same steps to a text file. Here is a teaching version using `ArrayStack` from Part 3:

```python
def reverse_file(filename):
    lines = ArrayStack()

    with open(filename, "r", encoding="utf-8") as source:
        for line in source:
            lines.push(line.rstrip("\n"))

    with open(filename, "w", encoding="utf-8") as target:
        while not lines.is_empty():
            target.write(lines.pop() + "\n")
```

If `practice_notes.txt` contains three lines in the order Raúl, Fabio, Marc, calling `reverse_file("practice_notes.txt")` overwrites that file with Marc, Fabio, Raúl. Each input line loses its old trailing newline before it is pushed; a newline is added when it is written. That detail keeps a last input line **without** a newline from joining the next line after reversal. The function normalizes line endings and adds a final newline, so use a copy if exact original line-ending style matters.

**Why this example?** It is the book's file-reversal application with familiar rider notes. **How to solve it:** finish reading and pushing all lines before opening the same file for writing; then pop one line per write. Reading first is essential because opening a file in write mode truncates its old contents.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Section 6.1.4 — Matching Parentheses and HTML Tags

<span id="part-5-delimiters"></span>

### 1. Match three kinds of grouping symbols

Consider a note such as `[Marc (P5), Fabio (P7)]`. The `(` after Marc must meet its own `)` before the outer `[` can meet `]`. The most recent unmatched opener is always the next one that must close, so a stack fits.

| Next character | Stack of unmatched openers | What to do |
| :------------- | :------------------------- | :--------- |
| `[` | `[` | Push it. |
| `(` | `[ (` | Push it. |
| `)` | `[` | Pop `(` and match. |
| `(` | `[ (` | Push it. |
| `)` | `[` | Pop `(` and match. |
| `]` | empty | Pop `[` and match. |

All other characters in the note are ignored by this **grouping-symbol checker**. It does not check whether the surrounding text is valid Python or valid arithmetic.

```python
def is_matched(expression):
    opening = "([{"
    closing = ")]}"
    left = ArrayStack()  # use the class from Part 3

    for char in expression:
        if char in opening:
            left.push(char)
        elif char in closing:
            if left.is_empty():
                return False
            if opening.index(left.pop()) != closing.index(char):
                return False

    return left.is_empty()


print(is_matched("[Marc (P5), Fabio (P7)]"))
print(is_matched("[Marc (P5), Fabio (P7])"))
print(is_matched("[Marc (P5)"))
```

```text
True
False
False
```

The second string tries to close `(` with `]`, the wrong type. The third leaves `[` unmatched at the end. A closing symbol when the stack is already empty also fails. A single scan costs `O(n)` time for a string of length `n` and uses at most `O(n)` stack space.

**Why this example?** The three strings show a valid nesting, a type mismatch, and an unfinished opening. **How to solve it:** push each opener; for each closer, require a nonempty stack and the corresponding top opener; finally require an empty stack.

<span id="part-5-html"></span>

### 2. Match simple nested HTML tags

Tags also nest. In `<section><p>Marc P5</p><p>Fabio P7</p></section>`, the most recently opened `p` must close before `section`. Store opening tag names on a stack, and compare each closing name with the name popped from the top.

```python
def is_matched_html(raw):
    tags = ArrayStack()  # use the class from Part 3
    pos = 0

    while True:
        start = raw.find("<", pos)
        if start == -1:
            break
        end = raw.find(">", start + 1)
        if end == -1:
            return False

        tag = raw[start + 1:end]
        if tag.startswith("/"):
            if tags.is_empty() or tags.pop() != tag[1:]:
                return False
        else:
            tags.push(tag)
        pos = end + 1

    return tags.is_empty()


print(is_matched_html(
    "<section><p>Marc P5</p><p>Fabio P7</p></section>"
))
print(is_matched_html("<section><p>Marc P5</section></p>"))
```

```text
True
False
```

In the second string, `</section>` arrives while `p` is still on top, so the order is wrong. The scan is `O(n)` time in the text length and uses `O(n)` space in the worst case. This is the book's **simple paired-tag model**: it assumes plain opening and closing names. It does not handle real HTML features such as attributes, void or self-closing tags, comments, or quoted `>` characters; use an HTML parser for actual web pages.

**Why this example?** It transfers the same nested-match rule from brackets to tag names. **How to solve it:** push opening names, compare every closing name with the latest opening name, reject an early mismatch, and require an empty stack at the end.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Complete Worked Practice Notebook

<span id="part-6-steps"></span>

### 1. Solve the task step by step

Build a small notebook program that uses all three real Practice entries. Its note-entry order is **Raúl, Fabio, Marc**, chosen to make Marc the newest item and Fabio the next item after Undo.

1. Store each rider with the team, actual Practice position, and best lap from the source table.
2. Push the three entries onto a history stack. Read the top, then undo once with `pop()`.
3. Push the same entries onto a second stack and pop them all to get newest-first review order.
4. Check a bracketed report label and a simple HTML report with the two matching functions.
5. Compare each printed result with the stack traces above.

**Why this example?** It combines the four uses of Section 6.1 while keeping the official data separate from our simulated notebook actions. **How to solve it:** follow the push order, mark the top after each change, and trace each independent stack before reading the output.

<span id="part-6-program"></span>

### 2. Run and trace the program

Save this as `practice_stack.py` and run `python practice_stack.py`:

```python
class Empty(Exception):
    """Raised when a stack has no top item."""


class ArrayStack:
    def __init__(self):
        self._data = []

    def __len__(self):
        return len(self._data)

    def is_empty(self):
        return len(self._data) == 0

    def push(self, item):
        self._data.append(item)

    def top(self):
        if self.is_empty():
            raise Empty("Stack is empty")
        return self._data[-1]

    def pop(self):
        if self.is_empty():
            raise Empty("Stack is empty")
        return self._data.pop()


def is_matched(expression):
    opening = "([{"
    closing = ")]}"
    left = ArrayStack()
    for char in expression:
        if char in opening:
            left.push(char)
        elif char in closing:
            if left.is_empty():
                return False
            if opening.index(left.pop()) != closing.index(char):
                return False
    return left.is_empty()


def is_matched_html(raw):
    tags = ArrayStack()
    pos = 0
    while True:
        start = raw.find("<", pos)
        if start == -1:
            break
        end = raw.find(">", start + 1)
        if end == -1:
            return False
        tag = raw[start + 1:end]
        if tag.startswith("/"):
            if tags.is_empty() or tags.pop() != tag[1:]:
                return False
        else:
            tags.push(tag)
        pos = end + 1
    return tags.is_empty()


# Real Friday Practice data; this is our chosen note-entry order.
entries = [
    ("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, "1:28.725"),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, "1:29.558"),
    ("Marc Márquez", "Ducati Lenovo Team", 5, "1:29.426"),
]

history = ArrayStack()
for entry in entries:
    history.push(entry)

print("Newest note:", history.top()[0])
print("Undo note:", history.pop()[0])
print("New top:", history.top()[0])

review = ArrayStack()
for entry in entries:
    review.push(entry)

print("Newest-first review:")
while not review.is_empty():
    name, team, place, lap = review.pop()
    print(f"{name} — {team}: P{place}, {lap}")

print("Grouping valid:", is_matched("[Marc (P5), Fabio (P7)]"))
print("Tags valid:", is_matched_html(
    "<section><p>Marc P5</p><p>Fabio P7</p></section>"
))
```

```text
Newest note: Marc Márquez
Undo note: Marc Márquez
New top: Fabio Quartararo
Newest-first review:
Marc Márquez — Ducati Lenovo Team: P5, 1:29.426
Fabio Quartararo — Monster Energy Yamaha MotoGP Team: P7, 1:29.558
Raúl Fernández — SuperFile Trackhouse MotoGP Team: P1, 1:28.725
Grouping valid: True
Tags valid: True
```

The history stack still contains Raúl and Fabio after one Undo. The review stack is separate and becomes empty after printing. The printed positions and times remain the real **Practice** results, even though the printed order is the reverse of our chosen note-entry order.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section idea | Rule to remember | Practice notebook example |
| :----------- | :--------------- | :------------------------ |
| Stack / LIFO | The newest item leaves first. | Enter Raúl, Fabio, Marc; pop Marc. |
| `top()` versus `pop()` | Read without removal versus remove and return. | See Marc, then undo Marc. |
| Stack ADT | Specify five operations before storage. | `push`, `pop`, `top`, `is_empty`, `len`. |
| Empty stack | No top item exists. | Reject Undo when there is no note. |
| List adapter | Keep the top at the list's end. | `append` pushes; `pop()` removes the last note. |
| Costs | Push and pop are amortized `O(1)`; storage is `O(n)`. | A rare resize can make one push slower. |
| Reversal | Push all, then pop all. | Review Marc, Fabio, Raúl. |
| Nested matching | The latest opener must close first. | Check brackets and simple report tags. |

[🔝 Back to Top](#top)
