<span id="top"></span>

# 6.1 Stacks — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.1, printed pages 229–238 (the supplied PDF).<br>
> **Topic:** 6.1 Stacks; 6.1.1 The Stack Abstract Data Type; 6.1.2 Simple Array-Based Stack Implementation; 6.1.3 Reversing Data Using a Stack; 6.1.4 Matching Parentheses and HTML Tags.<br>
> **Domain Focus:** Rectangle cards added to a display board, an undo action, a reversed review order, and a geometry report with grouped calculations and HTML tags.<br>
> **User Prompt:** Reexplain [`Section 6.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rectangle-Card Board](#background)
   - [1. Keep the geometry from the earlier guides](#background-cards)
   - [2. Why an undo history needs a stack](#background-undo)
2. [Part 1: 6.1 Stacks](#part-1)
   - [1. Push, pop, and top](#part-1-operations)
   - [2. Trace the board's history](#part-1-trace)
3. [Part 2: 6.1.1 The Stack Abstract Data Type](#part-2)
   - [1. Specify behavior before storage](#part-2-interface)
   - [2. Handle an empty stack](#part-2-empty)
4. [Part 3: 6.1.2 Simple Array-Based Stack Implementation](#part-3)
   - [1. Put the top at the end of a Python list](#part-3-adapter)
   - [2. Read the implementation](#part-3-code)
   - [3. Understand time and space costs](#part-3-cost)
5. [Part 4: 6.1.3 Reversing Data Using a Stack](#part-4)
   - [1. Reverse the card review order](#part-4-cards)
   - [2. Connect the example to the book's file reversal](#part-4-file)
6. [Part 5: 6.1.4 Matching Parentheses and HTML Tags](#part-5)
   - [1. Check grouping symbols in an area expression](#part-5-delimiters)
   - [2. Check nested tags in the geometry report](#part-5-html)
7. [Part 6: One Connected Geometry Program](#part-6)
   - [1. The complete program](#part-6-program)
   - [2. Trace its result](#part-6-trace)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rectangle-Card Board

<span id="background-cards"></span>

### 1. Keep the geometry from the earlier guides

The [Section 5.3 guide](../05-array-based-sequences/05-03-dynamic-arrays-and-amortization.md) uses four rectangular cards. We keep the same physical cards and measurements:

| Card | Width | Height | Area, width × height |
| :--- | ----: | -----: | -------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

If we place `A`, then `B`, then `C`, then `D`, their individual areas sum to **6 + 8 + 16 + 4 = 34 cm²**. This is the sum of the cards' areas; it does not assume they cover a board without gaps or overlap.

<span id="background-undo"></span>

### 2. Why an undo history needs a stack

Suppose we place `D` last and then press **Undo**. The card we remove should be `D`, the most recently placed card. If we press Undo again, we remove `C`. This rule is **last in, first out**, or **LIFO**.

```text
Bottom                                       Top
  A       B       C       D  ← most recent placement
                           ↑ remove this one first
```

A **stack** is a collection that exposes this one end, called the **top**. We add to the top and remove from the top. In this guide, the stack records card labels; the card measurements stay in a separate lookup table. An Undo operation uses the removed label to subtract that card's area from the running total.

> **Mental model:** The stack remembers the order of actions. Geometry tells us the area of each action's card.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 6.1 Stacks

The book introduces a stack with familiar examples such as a pile of plates, a browser's Back history, and Undo. The rule is the same in our board activity: we can reach the latest placement before the older ones.

<span id="part-1-operations"></span>

### 1. Push, pop, and top

| Operation | Plain-language meaning | Board example |
| :-------- | :--------------------- | :------------ |
| `push(e)` | Add element `e` on top. | Place card `D`; record `D`. |
| `top()` | Read the top element without removing it. | See that `D` is the latest card. |
| `pop()` | Remove and return the top element. | Undo `D`; it leaves the history. |

**Reading** and **removing** are different. Two calls to `top()` both return `D` while the stack is unchanged. After `pop()` returns `D`, the new top is `C`.

<span id="part-1-trace"></span>

### 2. Trace the board's history

The table writes stack contents **bottom to top**. The running area belongs to the cards still placed on the board.

| Action | Stack afterward | Top afterward | Cards still placed | Total area |
| :----- | :-------------- | :------------ | -----------------: | ---------: |
| Start | `[]` | none | 0 | 0 cm² |
| `push("A")` | `[A]` | `A` | 1 | 6 cm² |
| `push("B")` | `[A, B]` | `B` | 2 | 14 cm² |
| `push("C")` | `[A, B, C]` | `C` | 3 | 30 cm² |
| `push("D")` | `[A, B, C, D]` | `D` | 4 | 34 cm² |
| `top()` | `[A, B, C, D]` | `D` | 4 | 34 cm² |
| `pop()` → `D` | `[A, B, C]` | `C` | 3 | 30 cm² |

Notice that **stack size = pushes − pops**: after four pushes and one pop, the size is `3`. The area after Undo is **34 − area(`D`) = 34 − 4 = 30 cm²**. The stack alone does not calculate that area; our board program does.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 6.1.1 The Stack Abstract Data Type

An **abstract data type (ADT)** describes which operations are available and what they mean. It does not prescribe how to store the elements. The same stack behavior could later be implemented with a list or another structure.

<span id="part-2-interface"></span>

### 1. Specify behavior before storage

For a stack `S`, Section 6.1.1 gives this interface. Each example row starts independently with `[A, B, C]` (bottom to top):

| Stack expression | Result or effect | Example after pushing `A`, `B`, `C` |
| :--------------- | :--------------- | :----------------------------------- |
| `S.push(e)` | Add `e` at the top. | `S.push("D")` makes `D` the top. |
| `S.pop()` | Remove and return the top. | Returns `C`, leaving `[A, B]`. |
| `S.top()` | Return the top without removal. | Returns `C`; size stays `3`. |
| `S.is_empty()` | Report whether there are no elements. | `False`. |
| `len(S)` | Report the number of elements. | `3`. |

The ADT accepts any kind of element; card labels are just our example. It does not impose a fixed maximum size. A real program is still limited by available memory. There is no stack operation for removing `A` directly from the bottom: to reach it through the interface, we must first pop `C` and `B`.

<span id="part-2-empty"></span>

### 2. Handle an empty stack

`len(S)` is `0` and `S.is_empty()` is `True` for a new stack. Calling `top()` or `pop()` at that point is an error: there is no card to read or undo. The book's Python implementation uses an `Empty` exception for both operations.

```python
if not history.is_empty():
    latest_card = history.pop()
    print("Undo", latest_card)
else:
    print("There is no card to undo.")
```

Checking first makes the Undo behavior clear to the user. In other situations, a program can catch `Empty` to handle an unexpected empty stack.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 6.1.2 Simple Array-Based Stack Implementation

The book builds `ArrayStack` by using a Python `list` behind the stack interface. This is an **adapter**: we present stack operations while reusing list operations for storage.

<span id="part-3-adapter"></span>

### 1. Put the top at the end of a Python list

```text
List index:      0     1     2     3
Stored label:   [A]   [B]   [C]   [D]
                                  ↑ top
```

The last list element is the top. A list can append or remove that element without shifting all the earlier elements. Putting the top at index `0` would make each insertion or removal shift the other references.

| Stack operation | Python-list operation used internally |
| :-------------- | :------------------------------------ |
| `push(e)` | `_data.append(e)` |
| `pop()` | `_data.pop()` |
| `top()` | `_data[-1]` |
| `is_empty()` | `len(_data) == 0` |
| `len(S)` | `len(_data)` through `__len__` |

The leading underscore in `_data` marks it as an implementation detail by Python convention. Code using the stack should call its public methods, so the internal storage choice can change without changing the stack interface.

<span id="part-3-code"></span>

### 2. Read the implementation

The full `ArrayStack` definition appears in [Part 6](#part-6-program). Its central methods are:

```python
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
```

The `top` method leaves `_data` unchanged. The `pop` method removes the last item and returns it. Both check for an empty stack before indexing or removing; their public error is `Empty`, not an accidental list error.

<span id="part-3-cost"></span>

### 3. Understand time and space costs

Let **n** be the number of card labels currently in the stack. The stack stores **O(n)** references.

| Operation | Time in this list-backed implementation | Reason |
| :-------- | :-------------------------------------- | :----- |
| `len(S)` | O(1) | The list keeps its length. |
| `is_empty()` | O(1) | It checks the length. |
| `top()` | O(1) | It reads the final element. |
| `push(e)` | O(1) amortized | Most appends use spare capacity; a resize can copy O(n) references. |
| `pop()` | O(1) amortized | Removing at the end is cheap; an occasional resize can cost O(n). |

The [Section 5.3 guide](../05-array-based-sequences/05-03-dynamic-arrays-and-amortization.md) explains **amortized** cost: a long sequence of operations is cheap on average even though an individual resize can be expensive. The book also mentions a fixed-capacity variant that reserves storage in advance and keeps a separate size counter; that variant must decide what to do when it becomes full.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 6.1.3 Reversing Data Using a Stack

<span id="part-4-cards"></span>

### 1. Reverse the card review order

To review the cards from newest to oldest, push the original order onto a **new** stack, then pop until it is empty:

```text
Push:  A → B → C → D    stack bottom-to-top: [A, B, C, D]
Pop:   D → C → B → A    review order:         [D, C, B, A]
```

This is the same LIFO rule used by Undo, but here we pop every entry to make a reversed sequence. Reversing their order does not change the sum of their areas: **4 + 16 + 8 + 6 = 34 cm²**. The review stack is separate from the live Undo stack, so preparing the report does not remove cards from the board.

Moving all entries from one stack into a second stack reverses their order. Moving them back to the first stack reverses them **again**, restoring the original order. `reverse_labels` instead appends the popped labels to a list, preserving the first reversal as the review order.

For **n** labels, pushing them all and popping them all takes O(n) time and O(n) extra space. The complete program below includes `reverse_labels`.

<span id="part-4-file"></span>

### 2. Connect the example to the book's file reversal

The book demonstrates the same operation with a text file: read its lines into a stack, then pop and write the lines back in reverse order. Imagine a file with one card calculation per line:

```text
A: 2 × 3 = 6 cm²
B: 4 × 2 = 8 cm²
C: 4 × 4 = 16 cm²
D: 2 × 2 = 4 cm²
```

After the reversal, the lines appear in `D`, `C`, `B`, `A` order. The book's code removes each input line's trailing newline before pushing it, then adds a newline when writing each popped line. This matters when the original final line has no newline: after reversal, that line is written first and must not run into the next line. Our in-memory `reverse_labels` function uses the same ordering logic without rewriting a file.

This use of a stack reverses **order**, not the contents of each item. A card `A` still measures 2 cm by 3 cm after it moves to the end of the review order.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 6.1.4 Matching Parentheses and HTML Tags

Here a stack does something different from Undo or full reversal: it remembers **unfinished opening symbols** until their matching closing symbols appear.

<span id="part-5-delimiters"></span>

### 1. Check grouping symbols in an area expression

Consider the written math expression below. It groups the four card areas, which still total 34 cm²:

```text
{[(2×3)+(4×2)]+[(4×4)+(2×2)]}
```

Scan the expression from left to right. Push each opening `(`, `[`, or `{`. At a closing `)`, `]`, or `}`, pop **the most recent unmatched opening** and check its type. The expression is matched only if every closer finds the right opener and the stack is empty at the end.

| Input | Result | Why |
| :---- | :----- | :-- |
| `[(2×3)+(4×2)]` | Matched | Each `(` closes before the surrounding `[` closes. |
| `[(2×3)+(4×2])` | Not matched | `]` arrives while `(` is still on top. |
| `[(2×3)+(4×2)]}` | Not matched | The final `}` has no opening `{`. |
| `[(2×3)+(4×2)` | Not matched | An opening `[` remains at the end. |

The program checks **grouping**, not arithmetic correctness. For example, balanced parentheses do not prove that an expression has a valid formula or that its result is 34. The braces and brackets here are mathematical grouping marks in a string; this is not a Python expression being evaluated.

<span id="part-5-html"></span>

### 2. Check nested tags in the geometry report

Suppose the class publishes the **original four-card total** in a simple HTML report:

```html
<section><p>6 + 8 + 16 + 4 = 34 cm²</p></section>
```

Opening `<section>` is pushed, then opening `<p>` is pushed. Closing `</p>` must match the top `p`; closing `</section>` must then match `section`. If we close `section` before `p`, the nesting is wrong:

```html
<section><p>6 + 8 + 16 + 4 = 34 cm²</section></p>
```

The book uses a simple tag-matching algorithm for this lesson. Our `is_matched_html` function below follows that idea and assumes tags contain **only their names**, with no attributes, comments, or self-closing tags. It is a nesting example, not a complete HTML validator. Both the delimiter and simple-tag checks scan input of length **n** in O(n) time and can use O(n) stack space. Checking a delimiter's type takes O(1) time because there are only three opening and three closing types.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: One Connected Geometry Program

<span id="part-6-program"></span>

### 1. The complete program

Save this as `rectangle_card_stacks.py`. It uses a stack for Undo, a second stack to reverse review order, and stacks to check the written area expression and the original four-card report's tags.

```python
class Empty(Exception):
    """Raised when top or pop needs an element but the stack has none."""


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


def reverse_labels(labels):
    stack = ArrayStack()
    for label in labels:
        stack.push(label)

    result = []
    while not stack.is_empty():
        result.append(stack.pop())
    return result


def is_matched(expression):
    partners = {")": "(", "]": "[", "}": "{"}
    stack = ArrayStack()
    for character in expression:
        if character in "([{":
            stack.push(character)
        elif character in partners:
            if stack.is_empty() or stack.pop() != partners[character]:
                return False
    return stack.is_empty()


def is_matched_html(markup):
    stack = ArrayStack()
    start = markup.find("<")
    while start != -1:
        end = markup.find(">", start + 1)
        if end == -1:
            return False
        tag = markup[start + 1:end]
        if tag.startswith("/"):
            if stack.is_empty() or stack.pop() != tag[1:]:
                return False
        else:
            stack.push(tag)
        start = markup.find("<", end + 1)
    return stack.is_empty()


card_sizes = {"A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2)}
placement_order = ["A", "B", "C", "D"]
history = ArrayStack()
total_area = 0

for label in placement_order:
    width, height = card_sizes[label]
    history.push(label)
    total_area += width * height

print(f"Placed {len(history)} cards; total area = {total_area} cm^2")
print(f"Latest card before Undo: {history.top()}")

undone = history.pop()
width, height = card_sizes[undone]
total_area -= width * height
print(f"Undid {undone}; {len(history)} cards remain; area = {total_area} cm^2")
print(f"Latest card after Undo: {history.top()}")

# Use the original sequence to review all four placements, including D.
print(f"Newest-to-oldest review: {reverse_labels(placement_order)}")

area_expression = "{[(2*3)+(4*2)]+[(4*4)+(2*2)]}"
original_report = "<section><p>6 + 8 + 16 + 4 = 34 cm^2</p></section>"
print(f"Area grouping matched: {is_matched(area_expression)}")
print(f"Original report tags matched: {is_matched_html(original_report)}")
```

The `area_expression` and `original_report` are **text to check**, not calculations the program evaluates. Both describe the original 34 cm² four-card board, before Undo; the current board area after Undo is 30 cm². The program calculates its running area from the width-and-height multiplication in the placement loop and the subtraction after `pop()`.

<span id="part-6-trace"></span>

### 2. Trace its result

```text
Placed 4 cards; total area = 34 cm^2
Latest card before Undo: D
Undid D; 3 cards remain; area = 30 cm^2
Latest card after Undo: C
Newest-to-oldest review: ['D', 'C', 'B', 'A']
Area grouping matched: True
Original report tags matched: True
```

The first two lines show the original four-card board. Undo removes only `D` and subtracts its 4 cm². The review uses `placement_order` to build a separate stack, so its output still contains all four cards. The expression and report also describe that original board. Both matching checks succeed because each closing symbol or tag meets the most recent unfinished opener.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does looking at the latest card undo it?</strong></summary>

**Scenario:** The history contains `[A, B, C, D]`, and the board area is 34 cm².

**Check:** `history.top()` returns `D`, but the stack still has four labels and the board area remains 34 cm².

**Next step:** `history.pop()` returns `D` and leaves `[A, B, C]`. Subtract `D`'s 4 cm² to get **30 cm²**. This is the difference between reading the top and removing it.

</details>

<details>
<summary><strong>Case Study 2: What if Undo is pressed again?</strong></summary>

**Scenario:** After undoing `D`, the top is `C`. A second `pop()` returns `C`.

**Result:** The remaining history is `[A, B]`, and the remaining area is **30 − 16 = 14 cm²**. A third Undo would remove `B`, then a fourth would remove `A`. A fifth Undo must be handled as an empty-stack case.

</details>

<details>
<summary><strong>Case Study 3: Why does reversal preserve total area?</strong></summary>

**Scenario:** The original review order is `[A, B, C, D]`; popping a review stack produces `[D, C, B, A]`.

**Math:** The original sum is `6 + 8 + 16 + 4 = 34`. The reversed sum is `4 + 16 + 8 + 6 = 34`. Reversal changes position, not each card's dimensions or area.

</details>

<details>
<summary><strong>Case Study 4: Can the same bracket counts still be wrong?</strong></summary>

**Scenario:** A student writes `[(2×3)+(4×2])` in the geometry worksheet.

**Problem:** There are three opening and three closing symbols, but `]` meets an unmatched `(` at the top of the stack.

**Result:** `is_matched` returns `False`. Matching requires the right **nesting and type**, not just equal counts.

</details>

<details>
<summary><strong>Case Study 5: Why do crossed report tags fail?</strong></summary>

**Scenario:** The report contains `<section><p>34 cm²</section></p>`.

**Problem:** When `</section>` appears, the top unfinished tag is `p`.

**Result:** `is_matched_html` returns `False`. The report must close `p` before `section`: `<section><p>34 cm²</p></section>`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 6.1 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Stack / LIFO** | The latest added element is removed first. | Undo removes `D` before `C`. |
| **Stack ADT** | Define `push`, `pop`, `top`, `is_empty`, and `len` without choosing storage. | Store labels and ask for the latest placement. |
| **Array-based stack** | Use the end of a Python list as the top. | `append("D")` pushes; `pop()` removes `D`. |
| **Amortized cost** | Most end operations are constant time; occasional resizes cost more. | Growing the history can copy its stored references. |
| **Reversal** | Push all items, then pop all items to get opposite order. | `[A, B, C, D]` becomes `[D, C, B, A]`. |
| **Delimiter matching** | Each closer must match the latest unmatched opener. | Check grouping in the written area expression. |
| **Simple HTML tag matching** | Nested closing tags must follow reverse opening order. | Close `<p>` before `<section>` in the report. |

[🔝 Back to Top](#top)
