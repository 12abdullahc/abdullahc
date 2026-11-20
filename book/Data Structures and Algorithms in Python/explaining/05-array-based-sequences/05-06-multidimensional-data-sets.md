<span id="top"></span>

# Array-Based Sequences — Section 5.6: Multidimensional Data Sets

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.6 (printed pages 219–223; [chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C05.pdf)).<br>
> **Topic:** Two-dimensional data, nested-list construction, and a tic-tac-toe game stored as a grid.<br>
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika. All real rider, team, place, and lap-time facts below come from that one session.<br>
> **Learning goal:** Read a cell by row and column, create independent rows, traverse a grid, and explain each rule in a small positional game.<br>
> **User Prompt:** "Reexplain [Section 5.6] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Turn One Practice List into a Grid](#background-intuition)
   - [1. Verified session data](#background-data)
   - [2. The selected teaching grid](#background-grid)
2. [Part 1: Section 5.6 — From One Index to Two](#part-1)
   - [1. Rows, columns, and nested indexing](#part-1-indexing)
   - [2. Visit rows, columns, and diagonals](#part-1-traversal)
   - [3. More dimensions and the shape of a list](#part-1-shape)
3. [Part 2: Constructing a Multidimensional List](#part-2)
   - [1. A repeated list can be flat](#part-2-flat)
   - [2. Repeating a row shares that row](#part-2-alias)
   - [3. Build a fresh list for every row](#part-2-independent)
   - [4. Cost and the mutable-cell detail](#part-2-cost)
4. [Part 3: Two-Dimensional Arrays and Positional Games](#part-3)
   - [1. Represent a tic-tac-toe board](#part-3-board)
   - [2. Place legal marks and trace the turns](#part-3-moves)
   - [3. Check the eight winning lines](#part-3-wins)
   - [4. Distinguish a tie from an unfinished game](#part-3-tie)
5. [Part 4: Complete Worked Practice Program](#part-4)
   - [1. Solve the grid and game problems step by step](#part-4-steps)
   - [2. Run the program and explain the output](#part-4-program)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Turn One Practice List into a Grid

<span id="background-data"></span>

### 1. Verified session data

The [MotoGP Friday report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) identifies the session and teams; [Yamaha's full Practice classification](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) lists the official places and fastest single laps. We select these nine riders **in the lesson order shown** so that Marc Márquez and Fabio Quartararo appear first. The order in this table is not the session ranking; the **P** column is the published Practice place.

| Lesson order | Rider | Team | Practice place | Best lap | Best lap (ms) |
| ---: | :--- | :--- | ---: | ---: | ---: |
| 1 | Marc Márquez | Ducati Lenovo Team | P5 | 1:29.426 | 89,426 |
| 2 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | P7 | 1:29.558 | 89,558 |
| 3 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | P1 | 1:28.725 | 88,725 |
| 4 | Marco Bezzecchi | Aprilia Racing | P2 | 1:28.944 | 88,944 |
| 5 | Jorge Martín | Aprilia Racing | P3 | 1:29.206 | 89,206 |
| 6 | Pedro Acosta | Red Bull KTM Factory Racing | P4 | 1:29.394 | 89,394 |
| 7 | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team | P6 | 1:29.430 | 89,430 |
| 8 | Álex Márquez | BK8 Gresini Racing MotoGP | P8 | 1:29.572 | 89,572 |
| 9 | Franco Morbidelli | Pertamina Enduro VR46 Racing Team | P9 | 1:29.693 | 89,693 |

We use integer **milliseconds** in code: `1:29.426` becomes `60,000 + 29,426 = 89,426` ms. A smaller best-lap value is faster. Fabio's best lap minus Marc's is `89,558 − 89,426 = 132` ms. This is a comparison of **their fastest individual Practice laps**, not a race-finish gap.

**Why these entries?** Nine real results fill a small `3 × 3` teaching grid exactly, and Marc and Fabio provide an easy first lookup and comparison. **How to solve the data setup:** record each rider's name, team, official P place, and best-lap milliseconds; keep the selected teaching order distinct from the official ranking.

<span id="background-grid"></span>

### 2. The selected teaching grid

We put the nine entries into three rows, from left to right. **These rows and columns are invented for the lesson.** They are neither MotoGP grid positions nor a published arrangement of Practice results.

| Teaching row | Column 0 | Column 1 | Column 2 |
| ---: | :--- | :--- | :--- |
| 0 | Marc Márquez (P5) | Fabio Quartararo (P7) | Raúl Fernández (P1) |
| 1 | Marco Bezzecchi (P2) | Jorge Martín (P3) | Pedro Acosta (P4) |
| 2 | Fabio Di Giannantonio (P6) | Álex Márquez (P8) | Franco Morbidelli (P9) |

The corresponding number grid contains the same riders' best laps in milliseconds:

```text
              column 0  column 1  column 2
row 0           89426     89558     88725
row 1           88944     89206     89394
row 2           89430     89572     89693
```

**Why this layout?** It makes the difference between a **coordinate** and a **result** visible: Fabio is at teaching coordinate `(0, 1)` but finished Practice **P7**. **How to use it:** first choose a row, then a column inside that row. For example, row `0`, column `1` finds Fabio's record and `89,558` ms.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 5.6 — From One Index to Two

<span id="part-1-indexing"></span>

### 1. Rows, columns, and nested indexing

An ordinary Python list is one-dimensional: `laps[1]` selects one item. A two-dimensional table needs two coordinates. Python commonly represents it as an **outer list of row lists**. `grid[row][column]` means: get the chosen row from the outer list, then get the chosen cell from that row. For a `3 × 3` grid, both coordinates run from `0` through `2`.

The book's Figure 5.22 uses an `8 × 10` integer table. In that figure, `stores[3][5]` is `100` and `stores[6][2]` is `632`: the first index is always the row. Our smaller table uses the same rule.

```python
lap_ms = [
    [89_426, 89_558, 88_725],
    [88_944, 89_206, 89_394],
    [89_430, 89_572, 89_693],
]

print(lap_ms[0][0])  # Marc Márquez, P5
print(lap_ms[0][1])  # Fabio Quartararo, P7
print(lap_ms[1][0])  # Marco Bezzecchi, P2
```

```text
89426
89558
88944
```

**Why this example?** Marc and Fabio sit next to each other in the *same row*, while Marco is in the *same column* as Marc. Those three cells expose which index changes when we move horizontally or vertically. **How to solve a lookup:** locate the teaching row, read that row with `lap_ms[row]`, then read its column with `[column]`. Do not substitute a rider's official P place for either grid coordinate.

For a valid coordinate, each of the two list-index operations takes constant time, so `grid[row][column]` is **O(1)**. A Python list of lists contains separate row objects; it is not one single contiguous rectangular block. [Python's implementation notes](https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython) describe the reference storage used by CPython lists.

<span id="part-1-traversal"></span>

### 2. Visit rows, columns, and diagonals

Indexing one cell answers a one-rider question. To answer a question about several cells, we must **visit** those cells. A row is already a list, but a column is assembled by taking the same column index from each row. A diagonal changes both indices together.

```python
lap_ms = [
    [89_426, 89_558, 88_725],
    [88_944, 89_206, 89_394],
    [89_430, 89_572, 89_693],
]

print(lap_ms[0])
print([lap_ms[row][1] for row in range(3)])
print([lap_ms[i][i] for i in range(3)])
print(min(min(row) for row in lap_ms))
```

```text
[89426, 89558, 88725]
[89558, 89206, 89572]
[89426, 89206, 89693]
88725
```

The first line is the teaching row containing Marc, Fabio, and Raúl. The second line is column `1`: Fabio, Jorge, and Álex. The third is the top-left to bottom-right diagonal: Marc, Jorge, and Franco. The final line visits every row to find the **smallest best-lap time**, Raúl Fernández's `88,725` ms. The row and diagonal groupings are teaching coordinates, not MotoGP categories.

**Why this example?** It contrasts direct cell access with walking through several cells, while using a meaningful lap-time question: which selected rider recorded the quickest single lap? **How to solve it:** state the coordinates you need, visit each relevant cell, then apply `min` because a **lower** lap time is quicker. Visiting all `r × c` cells takes **O(rc)** time.

<span id="part-1-shape"></span>

### 3. More dimensions and the shape of a list

The term **multidimensional** is broader than two dimensions. A hypothetical data set with several sessions could use `data[session][row][column]`: three indices, one level of list for each index. We stay with Friday Practice so the real results in this lesson all describe the same session.

Python does not enforce a rectangular shape for nested lists. `[[1, 2], [3]]` is legal, but the second row has no column `1`. For a table that is meant to have `r` rows and `c` columns, **every row must have length `c`**. That is a rule of our program, not a rule imposed by Python.

```python
ragged = [[89_426, 89_558], [88_944]]
print([len(row) for row in ragged])
print(ragged[1][0])
```

```text
[2, 1]
88944
```

**Why this example?** A list can look like a table while quietly missing cells. **How to solve a rectangular-grid problem:** decide the required row and column counts first; build each row to that length; if data comes from outside the program, check each row before indexing it. A missing cell would raise `IndexError`.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Constructing a Multidimensional List

The book compares three similar-looking ways to make an `r × c` table. Only one of them creates `r` **independent row lists**. The distinction matters whenever a program changes a cell.

<span id="part-2-flat"></span>

### 1. A repeated list can be flat

Suppose we want three rows of three initially empty cells. Parentheses do not turn a list into a row inside another list:

```python
flat = ([None] * 3) * 3
print(flat)
print(len(flat))
flat[0 * 3 + 1] = "Fabio Quartararo"
print(flat[1])
```

```text
[None, None, None, None, None, None, None, None, None]
9
Fabio Quartararo
```

This is **one list of nine cells**. `flat[0]` is a cell, so `flat[0][1]` is not two-dimensional indexing. A flat list can intentionally represent a grid by converting `(row, column)` to `row * columns + column`, as the example does. It simply has a different access rule.

**Why this example?** The expression `([None] * 3) * 3` looks like “three groups of three,” so it is easy to expect rows that are not actually present. **How to solve it:** inspect the outer structure and ask what `flat[0]` returns. If it returns a cell instead of a row, use one index plus a coordinate formula, or construct nested rows.

<span id="part-2-alias"></span>

### 2. Repeating a row shares that row

Adding another pair of brackets creates an outer list, but multiplication **reuses the same inner row object**:

```python
shared = [[None] * 3] * 3
shared[0][0] = "Marc Márquez"
print(shared)
print(shared[0] is shared[1])
```

```text
[['Marc Márquez', None, None], ['Marc Márquez', None, None], ['Marc Márquez', None, None]]
True
```

We made **one** inner list and placed three references to it in the outer list. Editing its first cell through `shared[0]` changes what every row reference shows. Figure 5.23 in the book draws this shared-row structure. The three visible copies of Marc's name are a **data-structure bug**, not three Practice entries. [Python's FAQ](https://docs.python.org/3/faq/programming.html#how-do-i-create-a-multidimensional-list) demonstrates the same trap.

**Why this example?** A single assignment exposes aliasing immediately. **How to solve it:** test whether two rows are the same object with `is`; if they are, rebuild the outer list with a fresh inner list for each row. Assigning new rider names into the shared structure cannot repair its row independence.

<span id="part-2-independent"></span>

### 3. Build a fresh list for every row

A list comprehension evaluates its row expression **once per iteration**. Here it creates three separate row lists:

```python
grid = [[None] * 3 for _ in range(3)]
grid[0][0] = "Marc Márquez"
grid[0][1] = "Fabio Quartararo"
print(grid)
print(grid[0] is grid[1])
```

```text
[['Marc Márquez', 'Fabio Quartararo', None], [None, None, None], [None, None, None]]
False
```

The `_` is a conventional name for a loop value we do not need. On each of the three iterations, `[None] * 3` makes a new row. Figure 5.24 in the book shows these distinct rows. A change in row `0` now leaves rows `1` and `2` alone.

**Why this example?** The same two riders that revealed the grid coordinates now show a correct assignment to two adjacent cells. **How to solve it:** use `[[initial_value] * columns for _ in range(rows)]`, then fill each `grid[row][column]`. Confirm the rows are distinct when mutation matters.

<span id="part-2-cost"></span>

### 4. Cost and the mutable-cell detail

Creating `r` rows with `c` slots each takes **O(rc)** time and stores **O(rc)** cell references, plus the outer row references. A later read or assignment to a known valid cell is **O(1)**. A loop over every cell is **O(rc)**. These are counts of operations or storage as the grid grows, not stopwatch measurements for this fixed nine-cell example.

The safe row construction above repeats `None`, which is fine because we **replace** cells with rider values. If the initial cell itself is a **mutable object**, multiplication still shares that object *within its row*. To give every cell its own dictionary, create the dictionary in the inner loop:

```python
cells = [[{} for _ in range(3)] for _ in range(3)]
cells[0][0]["rider"] = "Marc Márquez"
print(cells[0])
print(cells[1])
```

```text
[{'rider': 'Marc Márquez'}, {}, {}]
[{}, {}, {}]
```

**Why this example?** Fresh rows and fresh **mutable cells** are two different requirements. **How to solve it:** identify which objects will be changed in place; construct each of those objects in the appropriate comprehension iteration. [Python's sequence documentation](https://docs.python.org/3/builtins/stdtypes.html#common-sequence-operations) explains that repetition copies references, not the contained objects.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Two-Dimensional Arrays and Positional Games

Section 5.6 next uses **tic-tac-toe** to show why row and column access is useful. Code Fragment 5.12 exercises the game interface; Code Fragment 5.13 implements the game. We can reuse the *coordinates* of our rider teaching grid while keeping the **game board separate** from the real Practice data. Imagine a classroom demonstration in which `X` is Marc's marker and `O` is Fabio's marker. This game is fictional; it says nothing about what either rider did at Mandalika.

<span id="part-3-board"></span>

### 1. Represent a tic-tac-toe board

A board has three rows and three columns. Each cell holds one of three symbols: `"X"`, `"O"`, or `"."` for empty. We use a visible dot so a printed board is easy to inspect. The board starts with nine independent empty cells and `X` to move first:

```python
board = [["."] * 3 for _ in range(3)]
next_marker = "X"
print(board)
print(next_marker)
```

```text
[['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']]
X
```

**Why this example?** It applies the row-construction rule to a second problem: a game board whose cells must change independently. **How to solve it:** choose one symbol for each possible cell state, make three separate rows, and keep the next turn in a separate variable. The board does not store rider lap times or official P places.

<span id="part-3-moves"></span>

### 2. Place legal marks and trace the turns

A move `mark(row, column)` must write the **current** marker only when the coordinates are in `0..2`, the cell is empty, and the game has not ended. Then it switches `X` to `O` or `O` to `X`. Explicitly reject negative indices: Python normally treats `board[-1]` as the last row, but a tic-tac-toe coordinate `-1` is outside this board's rules.

Here is a short fictional sequence. The rider names label the two players only; coordinates refer to the separate game board.

| Turn | Marker | Named player | `(row, column)` | State changed |
| ---: | :---: | :--- | :---: | :--- |
| 1 | X | Marc Márquez | `(0, 0)` | Top left becomes X |
| 2 | O | Fabio Quartararo | `(0, 1)` | Top middle becomes O |
| 3 | X | Marc Márquez | `(1, 1)` | Center becomes X |
| 4 | O | Fabio Quartararo | `(0, 2)` | Top right becomes O |
| 5 | X | Marc Márquez | `(2, 2)` | Bottom right becomes X |

After turn 5, the board is:

```text
X | O | O
---------
. | X | .
---------
. | . | X
```

**Why these moves?** The first two use the same coordinates as Marc and Fabio's cells in the **rider teaching grid**, so the two-index rule is familiar. The next three create a clear diagonal win. **How to solve each move:** check the row and column bounds, check the target cell, write the current symbol, determine whether play has ended, and switch the stored next marker for any later turn. An occupied-cell or out-of-range move should raise an error rather than overwrite the board.

<span id="part-3-wins"></span>

### 3. Check the eight winning lines

For a `3 × 3` board, a player wins when one nonempty symbol fills any of **eight** lines: three rows, three columns, and two diagonals. The key is to check **the same marker in all three cells**. Three empty dots are not a win.

| Kind of line | Coordinates | Number of lines |
| :--- | :--- | ---: |
| Row `r` | `(r, 0)`, `(r, 1)`, `(r, 2)` | 3 |
| Column `c` | `(0, c)`, `(1, c)`, `(2, c)` | 3 |
| Main diagonal | `(0, 0)`, `(1, 1)`, `(2, 2)` | 1 |
| Other diagonal | `(0, 2)`, `(1, 1)`, `(2, 0)` | 1 |

In the move trace, `board[0][0]`, `board[1][1]`, and `board[2][2]` are all `"X"`. That is the **main diagonal**, so the fictional `X` player wins. It is coincidence that those coordinates line up with Marc, Jorge, and Franco in the separate rider teaching grid; the lap results do not determine game moves.

**Why this example?** Rows and columns alone would miss the win. **How to solve it:** inspect all eight coordinate patterns, return `"X"` or `"O"` when a line has three equal nonempty cells, and return `None` when no line wins. Since the board is fixed at `3 × 3`, checking its eight lines is **O(1)**.

<span id="part-3-tie"></span>

### 4. Distinguish a tie from an unfinished game

`winner() is None` means **no one has a winning line yet**. That can happen during play and after a full board with no winner. A tie therefore needs a second condition: **every cell is filled**.

```text
O | X | O
---------
O | X | X
---------
X | O | X
```

This example board is full and has no winning row, column, or diagonal, so it is a tie. On the empty starting board, `winner()` is also `None`, but there are nine open cells, so play is unfinished. The book's Code Fragment 5.12 demonstrates a tie after a complete sequence; its `winner()` result must be interpreted together with board fullness.

**Why this example?** It prevents the common mistake of declaring a tie after the first nonwinning move. **How to solve it:** call `winner()` first; if there is no winner, scan for empty cells. Report a tie only when none remain. Reject further moves after either a win or a tie.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Worked Practice Program

<span id="part-4-steps"></span>

### 1. Solve the grid and game problems step by step

The program below joins the two uses of a `3 × 3` grid without mixing their data.

1. Store the nine real Friday Practice records as `(rider, team, official_place, best_lap_ms)` tuples in the selected lesson order.
2. Make three independent rows. Fill `rider_grid[row][column]` from the flat record list using `row * 3 + column`.
3. Read Marc and Fabio at `(0, 0)` and `(0, 1)`. Subtract their best-lap milliseconds. Visit all nine cells to find the quickest selected lap.
4. Make a separate tic-tac-toe board. Check coordinates, occupancy, and game completion before each mark.
5. Check the three rows, three columns, and two diagonals for a winner; check fullness to identify a tie.
6. Play the five **fictional** moves from Part 3 and print the board and winner.

**Why this program?** A rider table and a positional game use the same nested-list mechanics for different purposes. **How to solve it:** establish each grid's meaning before writing index expressions; keep official P places as record fields rather than grid coordinates.

<span id="part-4-program"></span>

### 2. Run the program and explain the output

```python
# Friday 9 October 2026 Indonesian GP MotoGP Practice.
# Tuple fields: (rider, team, official Practice place, best-lap milliseconds).
records = [
    ("Marc Márquez", "Ducati Lenovo Team", 5, 89_426),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89_558),
    ("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88_725),
    ("Marco Bezzecchi", "Aprilia Racing", 2, 88_944),
    ("Jorge Martín", "Aprilia Racing", 3, 89_206),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 4, 89_394),
    ("Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", 6, 89_430),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 8, 89_572),
    ("Franco Morbidelli", "Pertamina Enduro VR46 Racing Team", 9, 89_693),
]

ROWS = 3
COLS = 3
rider_grid = [[None] * COLS for _ in range(ROWS)]
for row in range(ROWS):
    for column in range(COLS):
        rider_grid[row][column] = records[row * COLS + column]

marc = rider_grid[0][0]
fabio = rider_grid[0][1]
for row, column in [(0, 0), (0, 1)]:
    rider, team, place, lap_ms = rider_grid[row][column]
    print(f"({row}, {column}): {rider} — {team}, P{place}, {lap_ms:,} ms")
print(f"Fabio minus Marc: {fabio[3] - marc[3]} ms")

quickest = rider_grid[0][0]
for row in rider_grid:
    for record in row:
        if record[3] < quickest[3]:
            quickest = record
print(f"Quickest selected lap: {quickest[0]}, P{quickest[2]}, {quickest[3]:,} ms")


class TicTacToe:
    """A separate 3 × 3 board; '.' represents an empty cell."""

    def __init__(self):
        self._board = [["."] * 3 for _ in range(3)]
        self._next = "X"

    def winner(self):
        board = self._board
        for i in range(3):
            if board[i][0] != "." and board[i][0] == board[i][1] == board[i][2]:
                return board[i][0]
            if board[0][i] != "." and board[0][i] == board[1][i] == board[2][i]:
                return board[0][i]
        if board[0][0] != "." and board[0][0] == board[1][1] == board[2][2]:
            return board[0][0]
        if board[0][2] != "." and board[0][2] == board[1][1] == board[2][0]:
            return board[0][2]
        return None

    def is_tie(self):
        return self.winner() is None and all("." not in row for row in self._board)

    def mark(self, row, column):
        if not (0 <= row < 3 and 0 <= column < 3):
            raise ValueError("Coordinates must be 0, 1, or 2")
        if self.winner() is not None or self.is_tie():
            raise ValueError("The game is finished")
        if self._board[row][column] != ".":
            raise ValueError("That cell is occupied")
        self._board[row][column] = self._next
        self._next = "O" if self._next == "X" else "X"

    def __str__(self):
        return "\n---------\n".join(" | ".join(row) for row in self._board)


# A fictional classroom game: X represents Marc, O represents Fabio.
game = TicTacToe()
for row, column in [(0, 0), (0, 1), (1, 1), (0, 2), (2, 2)]:
    game.mark(row, column)

print(game)
players = {"X": "Marc Márquez", "O": "Fabio Quartararo"}
print("Game winner:", players[game.winner()])
print("Game is a tie:", game.is_tie())
```

```text
(0, 0): Marc Márquez — Ducati Lenovo Team, P5, 89,426 ms
(0, 1): Fabio Quartararo — Monster Energy Yamaha MotoGP Team, P7, 89,558 ms
Fabio minus Marc: 132 ms
Quickest selected lap: Raúl Fernández, P1, 88,725 ms
X | O | O
---------
. | X | .
---------
. | . | X
Game winner: Marc Márquez
Game is a tie: False
```

The first two output lines use **teaching coordinates** to retrieve actual session records. The `132 ms` subtraction compares two best laps from the same Practice session. The nested traversal finds Raúl's P1 lap as the lowest time among the nine selected riders. The remaining lines are the separate, fictional game: `X` occupies the main diagonal, so `winner()` returns `"X"`; the player-name dictionary displays Marc's name. The board still has empty cells, and it has a winner, so it is not a tie.

To check the move rules, try `game.mark(-1, 0)` on a **new** `TicTacToe` object: it raises `ValueError` before Python can interpret `-1` as the last row. On the finished example game, **any** further move raises the game-finished error. An occupied cell during an unfinished game raises the occupied-cell error.

**Why this output check?** It verifies both meanings of the grids: real Practice numbers and hypothetical game marks. **How to check your own solution:** compare every printed rider field with the session table, trace the five moves in order, inspect all eight winning lines, and check that a tie requires a full board without a winner.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Question | Answer |
| :--- | :--- |
| What does `grid[row][column]` do? | Select a row from the outer list, then a cell from that row. |
| Why does `([None] * c) * r` fail as a nested grid? | It creates one flat list of `r × c` cells. |
| Why does `[[None] * c] * r` fail when cells change? | All `r` outer entries refer to the same mutable row. |
| How do we make independent rows? | Use `[[None] * c for _ in range(r)]`. |
| How do we make independent mutable cells too? | Create each cell inside a nested comprehension, such as `[[{} for _ in range(c)] for _ in range(r)]`. |
| How much work is a known-cell lookup versus a full visit? | **O(1)** for a valid known cell; **O(rc)** to visit all `r × c` cells. |
| When does tic-tac-toe end? | After one of eight lines has three matching nonempty marks, or after a full board with no winner. |

The Friday Practice records show how a two-dimensional structure can organize real data **without changing the data's official meaning**. The game shows the same coordinate mechanics in a small changing board. In both cases, decide what each axis means, create the right shape, and check the result against that meaning.

[🔝 Back to Top](#top)
