<span id="top"></span>

# 5.6 Multidimensional Data Sets — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.6, printed pages 219–223 (the supplied PDF).<br>
> **Topic:** 5.6 Multidimensional Data Sets; Constructing a Multidimensional List; Two-Dimensional Arrays and Positional Games; Tic-Tac-Toe.<br>
> **Domain Focus:** A three-row, three-column display of the same rectangular cards, their areas, and a game played at the card positions.<br>
> **User Prompt:** Reexplain [`Section 5.6`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rectangle-Card Grid](#background)
   - [1. Arrange the nine familiar cards](#background-cards)
   - [2. Separate a card's position from its area](#background-position)
2. [Part 1: 5.6 Multidimensional Data Sets](#part-1)
   - [1. From one index to two](#part-1-dimensions)
   - [2. Read a list of rows](#part-1-indexing)
   - [3. Sum rows, columns, and diagonals](#part-1-sums)
3. [Part 2: Constructing a Multidimensional List](#part-2)
   - [1. A repeated flat list has no row lists](#part-2-flat)
   - [2. Repeating one row aliases every row](#part-2-alias)
   - [3. Create independent rows](#part-2-correct)
4. [Part 3: Two-Dimensional Arrays and Positional Games](#part-3)
   - [1. Put game marks at card positions](#part-3-board)
   - [2. Make a legal mark and alternate turns](#part-3-mark)
   - [3. Check rows, columns, and diagonals](#part-3-win)
   - [4. Distinguish an unfinished game from a tie](#part-3-tie)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Trace its result](#part-4-trace)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rectangle-Card Grid

<span id="background-cards"></span>

### 1. Arrange the nine familiar cards

The earlier [Chapter 5 guides](05-01-python-sequence-types.md) use four rectangles: `A` is 2 × 3 cm, `B` is 4 × 2 cm, `C` is 4 × 4 cm, and `D` is 2 × 2 cm. Their areas are 6, 8, 16, and 4 cm². As in [Section 5.3](05-03-dynamic-arrays-and-amortization.md), cards `E`, `F`, `G`, and `H` repeat the dimensions of `A`, `B`, `C`, and `D`; `I` repeats `A`. Each label names a different physical card.

Now place the nine cards in **three rows and three columns**:

| Row and column | Column 0 | Column 1 | Column 2 |
| :------------- | :------- | :------- | :------- |
| Row 0 | `A`: 6 cm² | `B`: 8 cm² | `C`: 16 cm² |
| Row 1 | `D`: 4 cm² | `E`: 6 cm² | `F`: 8 cm² |
| Row 2 | `G`: 16 cm² | `H`: 4 cm² | `I`: 6 cm² |

The row-major area data is `[[6, 8, 16], [4, 6, 8], [16, 4, 6]]`. The nine individual areas still sum to **74 cm²**. Placing cards in a table says where they are in our *data*; it does not specify that the real rectangles tile a physical board without gaps or overlaps.

<span id="background-position"></span>

### 2. Separate a card's position from its area

Card `F` is at **row 1, column 2** and has **area 8 cm²**. Card `G` is at **row 2, column 0** and has **area 16 cm²**. The ordered pair `(row, column)` answers *where*; width × height answers *how much area*. Row and column indices begin at **0**, so the center card `E` is `(1, 1)`.

These grid coordinates are table positions. They are not automatically Cartesian `(x, y)` coordinates of a card's physical corner. This distinction lets us reuse the same positions later for a tic-tac-toe board without changing any card dimensions.

> **Mental model:** One index chooses a row; a second index chooses an entry within that row.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 5.6 Multidimensional Data Sets

<span id="part-1-dimensions"></span>

### 1. From one index to two

Lists, tuples, and strings are **one-dimensional sequences**: `areas[5]` picks one position in a line of values. A two-dimensional data set has **rows and columns**, so we use two indices, `grid[row][column]`. The book also mentions three-dimensional scans and other data with more independent coordinates; Section 5.6 concentrates on two dimensions.

A two-dimensional numeric table is often called a **matrix**. Figure 5.22 in the book shows an 8-row, 10-column integer table. In that figure, `stores[3][5]` is 100 and `stores[6][2]` is 632. Both indices start at zero, just like our card table.

For the card areas, let `r = 3` rows and `c = 3` columns. Valid nonnegative row indices are 0, 1, 2; valid nonnegative column indices are 0, 1, 2. A full rectangular grid has `r × c = 9` cells.

<span id="part-1-indexing"></span>

### 2. Read a list of rows

Python commonly represents a two-dimensional table as a **list whose elements are row lists**:

```python
area_grid = [[6, 8, 16], [4, 6, 8], [16, 4, 6]]
print(area_grid[1])     # [4, 6, 8]: row D, E, F
print(area_grid[1][2])  # 8: card F
print(area_grid[2][0])  # 16: card G
```

Read `area_grid[1][2]` in two steps: `area_grid[1]` selects the second row list, then `[2]` selects its third entry. With valid indices, each list access is **O(1)**, so the pair of accesses is also **O(1)**. This is a *nested* representation, not a promise of one contiguous two-dimensional memory block.

The outer list can technically contain rows of different lengths. We call it a **3 × 3 matrix** only because we constructed and maintain exactly three rows with exactly three entries in each. This rectangular-shape rule is a program invariant, not something ordinary Python lists enforce for us.

<span id="part-1-sums"></span>

### 3. Sum rows, columns, and diagonals

Once the indices are clear, geometry questions become precise. Each row total is the sum of the card areas in that row:

| Selected positions | Arithmetic | Sum |
| :----------------- | :--------- | --: |
| Row 0: `A`, `B`, `C` | 6 + 8 + 16 | 30 cm² |
| Row 1: `D`, `E`, `F` | 4 + 6 + 8 | 18 cm² |
| Row 2: `G`, `H`, `I` | 16 + 4 + 6 | 26 cm² |
| Column 0: `A`, `D`, `G` | 6 + 4 + 16 | 26 cm² |
| Column 1: `B`, `E`, `H` | 8 + 6 + 4 | 18 cm² |
| Column 2: `C`, `F`, `I` | 16 + 8 + 6 | 30 cm² |
| Main diagonal: `A`, `E`, `I` | 6 + 6 + 6 | 18 cm² |
| Other diagonal: `C`, `E`, `G` | 16 + 6 + 16 | 38 cm² |

The row totals add to **30 + 18 + 26 = 74 cm²**; the column totals add to **26 + 18 + 30 = 74 cm²**. Each method counts every card exactly once. A diagonal sum counts only its three selected cards. These are sums of individual rectangle areas, not geometric union areas.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Constructing a Multidimensional List

The book warns that list repetition can create the wrong structure even when the printed values initially look correct. We want **three distinct row lists**, each with three zero-valued cells, before filling in card areas.

<span id="part-2-flat"></span>

### 1. A repeated flat list has no row lists

```python
flat = ([0] * 3) * 3
print(flat)       # [0, 0, 0, 0, 0, 0, 0, 0, 0]
print(len(flat))  # 9
```

The first multiplication creates three zeros. The second repeats those entries three times in **one flat list**. `flat[2]` is an integer, not row 2, so `flat[2][0]` cannot mean card `G`'s grid position. A flat list *could* encode a 3 × 3 grid with an index formula such as `flat[row * 3 + column]`; it simply does not provide the book's list-of-rows `grid[row][column]` interface. The book uses the same mistaken pattern with general `r` and `c`.

<span id="part-2-alias"></span>

### 2. Repeating one row aliases every row

```python
wrong = [[0] * 3] * 3
wrong[2][0] = 16  # meant to fill G's area only
print(wrong)             # [[16, 0, 0], [16, 0, 0], [16, 0, 0]]
print(wrong[0] is wrong[2])  # True: the same inner list
```

This expression does create an outer list of three entries, but each entry refers to **the same mutable row list**. Changing column 0 through row 2 also changes what we see through rows 0 and 1. Figure 5.23 in the book draws that shared-row structure. `A` and `D` have not somehow become 16 cm²; the data structure is wrong.

The repeated zeros are a different matter: integers are immutable, so sharing references to zero causes no such row-edit problem. The problem is sharing the **mutable inner list**. [Section 5.2](05-02-low-level-arrays.md) explains the same reference-aliasing idea for one-dimensional lists.

<span id="part-2-correct"></span>

### 3. Create independent rows

```python
correct = [[0] * 3 for _ in range(3)]
correct[2][0] = 16
print(correct)                # [[0, 0, 0], [0, 0, 0], [16, 0, 0]]
print(correct[0] is correct[2])  # False: separate row lists
```

The comprehension evaluates `[0] * 3` **once for each row**, making a fresh row object each time. Figure 5.24 depicts this valid structure. In general, `[[0] * c for _ in range(r)]` creates `r` independent rows of `c` cells in **O(rc)** time and space. The `_` simply means the loop number is not used in the row expression. For our grid, the 3 × 3 slots can now be filled with the nine card areas without affecting other rows.

> **Mental model:** Repeat immutable cell values inside a new row; construct each mutable row separately.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Two-Dimensional Arrays and Positional Games

The book moves from numeric tables to a simple positional game: **tic-tac-toe**. A game board is also a 3 × 3 matrix. The grid holds marks `X`, `O`, or an empty symbol instead of card areas. The same row and column coordinates apply.

<span id="part-3-board"></span>

### 1. Put game marks at card positions

Our card-position legend is:

```text
          Column 0  Column 1  Column 2
Row 0        A         B         C
Row 1        D         E         F
Row 2        G         H         I
```

We may play on a **separate** mark grid laid over those positions. Marking `(1, 1)` means mark the center, card `E`'s position. It does not change `E`'s width, height, or 6 cm² area. The book uses a blank space for an empty cell; our program displays `.` so empty cells remain visible in text output.

```python
marks = [["."] * 3 for _ in range(3)]
marks[1][1] = "X"
print(marks)  # [['.', '.', '.'], ['.', 'X', '.'], ['.', '.', '.']]
```

<span id="part-3-mark"></span>

### 2. Make a legal mark and alternate turns

Code Fragment 5.12 in the book demonstrates the `TicTacToe` public interface. Code Fragment 5.13 implements it. A new game has nine empty positions and starts with `X`. A call `mark(i, j)` puts the current player's mark in row `i`, column `j`, then switches the next player between `X` and `O`.

Before changing a cell, `mark` must reject an index outside **0 through 2**, an occupied cell, and any move after a winner exists. The explicit index check matters because Python ordinarily accepts negative list indices, but `(-1, 0)` is not a legal coordinate in this game.

For our short example, the moves are `X:A`, `O:B`, `X:E`, `O:C`, `X:I`. The players alternate, and `X` claims the `A`–`E`–`I` diagonal:

```text
X|O|O
-----
.|X|.
-----
.|.|X
```

<span id="part-3-win"></span>

### 3. Check rows, columns, and diagonals

A winning mark occupies all three cells in **one row**, **one column**, or **one diagonal**. A 3 × 3 board has **3 + 3 + 2 = 8** possible winning lines. The main diagonal has positions `(0,0)`, `(1,1)`, `(2,2)`; the other has `(0,2)`, `(1,1)`, `(2,0)`.

The book's `_is_win(mark)` checks these eight lines and `winner()` checks whether `X` or `O` has one. In our example, `X` is at `A`, `E`, and `I`, so `winner()` returns `"X"`. The corresponding **card areas** on that diagonal add to **6 + 6 + 6 = 18 cm²**, but the game is won by marks occupying positions, not by that area sum.

For this fixed 3 × 3 board, checking its eight short lines takes **O(1)** time. That statement relies on the board size being fixed; it does not claim any arbitrary-sized game's winner check is constant time.

<span id="part-3-tie"></span>

### 4. Distinguish an unfinished game from a tie

The book's nine-move test in Code Fragment 5.12 fills the board with no winning line:

```text
O|X|O
-----
O|X|X
-----
X|O|X
```

Here `winner()` returns `None`, and **because all nine cells are filled**, the test prints `Tie`. But `winner()` also returns `None` at the start of a new game and during play whenever nobody has won yet. A general tie check needs **both** “no winner” and “no empty cells.” The `winner()` method in Code Fragment 5.13 does not itself test fullness; its docstring's tie wording should be read in the context of the completed demonstration.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

<span id="part-4-program"></span>

### 1. The complete program

This program creates independent numeric rows, fills them from the familiar card dimensions, and computes row, column, total, and diagonal sums. A separate tic-tac-toe class then uses the same A–I positions. It follows the book's checks and turn sequence; `.` is our visible empty-cell symbol.

```python
card_rows = [
    [("A", 2, 3), ("B", 4, 2), ("C", 4, 4)],
    [("D", 2, 2), ("E", 2, 3), ("F", 4, 2)],
    [("G", 4, 4), ("H", 2, 2), ("I", 2, 3)],
]

area_grid = [[0] * 3 for _ in range(3)]
for row in range(3):
    for column in range(3):
        _, width, height = card_rows[row][column]
        area_grid[row][column] = width * height

row_totals = [sum(area_grid[row]) for row in range(3)]
column_totals = [
    sum(area_grid[row][column] for row in range(3))
    for column in range(3)
]
main_diagonal = sum(area_grid[index][index] for index in range(3))
other_diagonal = sum(area_grid[index][2 - index] for index in range(3))

print("area grid:", area_grid)
print("F (1,2):", area_grid[1][2], "cm^2")
print("G (2,0):", area_grid[2][0], "cm^2")
print("row totals:", row_totals)
print("column totals:", column_totals)
print("all area:", sum(row_totals), "cm^2")
print("diagonal areas:", main_diagonal, other_diagonal, "cm^2")


class TicTacToe:
    def __init__(self):
        self._board = [["."] * 3 for _ in range(3)]
        self._player = "X"

    def mark(self, row, column):
        if not (0 <= row < 3 and 0 <= column < 3):
            raise ValueError("invalid board position")
        if self._board[row][column] != ".":
            raise ValueError("board position occupied")
        if self.winner() is not None:
            raise ValueError("game is already complete")
        self._board[row][column] = self._player
        self._player = "O" if self._player == "X" else "X"

    def _is_win(self, mark):
        board = self._board
        for row in range(3):
            if all(board[row][column] == mark for column in range(3)):
                return True
        for column in range(3):
            if all(board[row][column] == mark for row in range(3)):
                return True
        if all(board[index][index] == mark for index in range(3)):
            return True
        if all(board[index][2 - index] == mark for index in range(3)):
            return True
        return False

    def winner(self):
        for mark in ("X", "O"):
            if self._is_win(mark):
                return mark
        return None

    def __str__(self):
        return "\n-----\n".join("|".join(row) for row in self._board)


game = TicTacToe()
for row, column in ((0, 0), (0, 1), (1, 1), (0, 2), (2, 2)):
    game.mark(row, column)
print("marks:")
print(game)
print("winner:", game.winner())
```

<span id="part-4-trace"></span>

### 2. Trace its result

```text
area grid: [[6, 8, 16], [4, 6, 8], [16, 4, 6]]
F (1,2): 8 cm^2
G (2,0): 16 cm^2
row totals: [30, 18, 26]
column totals: [26, 18, 30]
all area: 74 cm^2
diagonal areas: 18 38 cm^2
marks:
X|O|O
-----
.|X|.
-----
.|.|X
winner: X
```

The nested loops fill nine independently assignable positions from nine card records. Summing every row or every column counts each card once, yielding the same 74 cm². The diagonal sums select only three cells each. The separate mark board shows `X` winning along `A`–`E`–`I`; its marks do not modify `area_grid`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which card is at `area_grid[1][2]`?</strong></summary>

Index `1` first selects the second row, `[4, 6, 8]`, containing `D`, `E`, and `F`. Index `2` then selects its third area, **8 cm²**, belonging to `F`. The area is not a row or column number; it is the value stored at that position.

</details>

<details>
<summary><strong>Case Study 2: Why can't a nine-element list use `grid[row][column]`?</strong></summary>

`([0] * 3) * 3` produces one list of length nine. It has the right **number of values**, but no row lists. `flat[2]` is the third zero, so trying `flat[2][0]` cannot select row 2, column 0. A flat representation would use `flat[row * 3 + column]`; the book's nested representation needs an outer list whose entries are rows.

</details>

<details>
<summary><strong>Case Study 3: Why did filling G also appear to fill A and D?</strong></summary>

With `wrong = [[0] * 3] * 3`, all three outer entries refer to the same inner list. Setting `wrong[2][0] = 16` to record `G` makes `wrong[0][0]` and `wrong[1][0]` appear as 16 too. `A` and `D` have not changed size; the repeated-row construction aliased their storage. `[[0] * 3 for _ in range(3)]` gives each row its own list.

</details>

<details>
<summary><strong>Case Study 4: Do the row and column totals agree?</strong></summary>

Rows give `30 + 18 + 26 = 74 cm²`. Columns give `26 + 18 + 30 = 74 cm²`. Both traversals include each of the nine cells once, so their grand totals must agree even if two cards trade positions. The main diagonal gives only `A + E + I = 18 cm²`; it is a different selection.

</details>

<details>
<summary><strong>Case Study 5: Does X win because its diagonal cards have equal areas?</strong></summary>

No. The moves mark positions `A`, `E`, and `I` with `X`, forming the main diagonal. Their areas happen to be 6 + 6 + 6 = 18 cm², but the game rule checks **three matching marks in one line**. The same three positions would win if their card dimensions differed.

</details>

<details>
<summary><strong>Case Study 6: Does `winner() is None` always mean a tie?</strong></summary>

No. A new, empty board has no winner and is unfinished. The book's nine-move example has no winner **and** no empty cells, so it is a tie. To classify a tie, test both conditions. The class also rejects an out-of-range mark such as `(-1, 0)` even though a raw Python list would accept a negative index.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Question | Answer from Section 5.6 |
| :------- | :----------------------- |
| How is a 2D table represented? | Use an outer list of independent row lists; `grid[row][column]` performs two indexing steps. |
| Why can repeated-list initialization fail? | `([0] * c) * r` is flat; `[[0] * c] * r` repeats a reference to one mutable row. |
| How should zero-filled rows be made? | `[[0] * c for _ in range(r)]` creates `r` distinct rows in **O(rc)** time and space. |
| What is our card grid's total area? | Row totals and column totals each sum to **74 cm²**. |
| How does tic-tac-toe use the grid? | Each mark occupies one `(row, column)` cell; a win is one of eight three-cell lines. |
| When is a full game a tie? | Only when all nine cells are occupied **and** `winner()` is `None`. |

The [Python FAQ on multidimensional lists](https://docs.python.org/3.14/faq/programming.html#how-do-i-create-a-multidimensional-list) confirms why repeated inner lists alias and why constructing each row separately works. The cards' numeric grid and the game's mark grid use the same coordinates while storing different information.

> **Final mental model:** A two-dimensional Python list is a list of row lists. Build each row separately, then use the first index for a row and the second for a position inside it.

[🔝 Back to Top](#top)
