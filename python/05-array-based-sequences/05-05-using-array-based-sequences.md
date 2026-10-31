<span id="top"></span>

# 5.5 Using Array-Based Sequences — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.5, printed pages 210–218 (the supplied PDF).<br>
> **Topic:** 5.5 Using Array-Based Sequences; 5.5.1 Storing High Scores for a Game; 5.5.2 Sorting a Sequence; 5.5.3 Simple Cryptography.<br>
> **Domain Focus:** Ranking rectangular display cards by area, sorting their measurements, and encoding a short geometry report.<br>
> **User Prompt:** Reexplain [`Section 5.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: One Set of Rectangle Cards](#background)
   - [1. Keep the measurements connected](#background-cards)
   - [2. Three tasks for one display board](#background-tasks)
2. [Part 1: 5.5 Using Array-Based Sequences](#part-1)
   - [1. Why these applications use positions](#part-1-positions)
   - [2. Keep the three kinds of order separate](#part-1-order)
3. [Part 2: 5.5.1 Storing High Scores for a Game](#part-2)
   - [1. Turn a game entry into a card entry](#part-2-entry)
   - [2. Reserve a fixed board and track active entries](#part-2-capacity)
   - [3. Decide whether a card qualifies](#part-2-qualify)
   - [4. Shift lower entries and trace the top three](#part-2-shift)
   - [5. Understand the cost and the book's order wording](#part-2-cost)
4. [Part 3: 5.5.2 Sorting a Sequence](#part-3)
   - [1. Grow a sorted prefix](#part-3-prefix)
   - [2. Move card D's area into place](#part-3-trace)
   - [3. Count the work](#part-3-cost)
5. [Part 4: 5.5.3 Simple Cryptography](#part-4)
   - [1. Plaintext, ciphertext, and a new string](#part-4-terms)
   - [2. Rotate alphabet indices with modulo](#part-4-modulo)
   - [3. Build translation arrays and transform the report](#part-4-tables)
   - [4. Keep the 26-letter assumption precise](#part-4-ascii)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace its result](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Set of Rectangle Cards

<span id="background-cards"></span>

### 1. Keep the measurements connected

The earlier [Chapter 5 guides](05-01-python-sequence-types.md) use rectangular cards. A card's **area = width × height**. The four original cards are:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

Their individual areas sum to **6 + 8 + 16 + 4 = 34 cm²**. As in [Section 5.3](05-03-dynamic-arrays-and-amortization.md) and [Section 5.4](05-04-efficiency-of-python-sequence-types.md), five more physical cards repeat some dimensions: `E` is like `A`, `F` like `B`, `G` like `C`, `H` like `D`, and `I` like `A`.

```text
Card:   A  B   C  D  E  F   G  H  I
Area:   6  8  16  4  6  8  16  4  6   cm²
Index:  0  1   2  3  4  5   6  7  8
```

The nine areas sum to **74 cm²**. This is a sum of card areas; it does not claim the cards cover a board without overlap or gaps. Labels distinguish cards with equal areas.

<span id="background-tasks"></span>

### 2. Three tasks for one display board

Imagine a class preparing a rectangle display. It wants to:

1. Keep only the **three largest** cards on a featured list.
2. Arrange **all nine** cards from smallest to largest area.
3. Encode a written report, `MAX=16; TOTAL=74`, for a classroom puzzle.

The same measurements support all three tasks, but each task asks an array-based sequence to do something different: hold ranked references, shift entries into order, or use character positions to create a new string.

> **Mental model:** An index identifies a position. The algorithm decides what that position means: a rank, a place in sorted order, or a letter in a translation table.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 5.5 Using Array-Based Sequences

<span id="part-1-positions"></span>

### 1. Why these applications use positions

Earlier sections explained the storage and costs of lists, tuples, and strings. Section 5.5 puts them to work. A Python list can reserve positions for future entries, shift references between positions, and change a character *list* before joining it into a new string. Direct indexing lets us read or replace a known position in **O(1)** time, but shifting a run of entries still takes time proportional to the number moved.

In the cost statements below, `n` is the number of card entries, `C` is a featured board's capacity, and `N` is a message's character count. **O(f)** gives an upper bound on how work grows; **Θ(f)** means the growth matches `f` up to constant factors in the stated case. One area multiplication or comparison is treated as a constant-size step for these small integer dimensions.

The book's examples are a video-game high-score board, insertion sort, and a Caesar cipher. We keep their algorithms and use card areas as scores. For the cipher, the message describes those card areas; the cipher changes letters in the report, not the numeric measurements.

<span id="part-1-order"></span>

### 2. Keep the three kinds of order separate

| Sequence | Order we need | Example |
| :------- | :------------ | :------ |
| Featured area board | **Descending** area, with at most three cards | `C:16, G:16, B:8`. |
| Full card list after insertion sort | **Ascending** area, with all nine cards | `D:4, H:4, A:6, ...`. |
| Caesar translation table | Alphabet order supplies indices `0` through `25` | Index `0` maps `A` to `D` for a shift of 3. |

The featured board and sorted list answer different questions. The board's area sum is 40 cm²; the sum across all nine physical cards remains 74 cm².

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 5.5.1 Storing High Scores for a Game

The book's Code Fragment 5.7 defines a `GameEntry` with a player's name and score. Code Fragment 5.8 puts such entries in a fixed-capacity `Scoreboard`. For our geometry version, a card's **label** identifies it and its **area** plays the role of its score.

<span id="part-2-entry"></span>

### 1. Turn a game entry into a card entry

```python
class CardEntry:
    def __init__(self, label, width, height):
        self.label = label
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


card_c = CardEntry("C", 4, 4)
print(card_c.label, card_c.area())  # C 16
```

An **object** keeps related facts together. We store the label as well as dimensions because `A`, `E`, and `I` each have area 6 cm² but remain different physical cards. The book stores a score directly; our `area()` method derives the comparable number from width and height.

<span id="part-2-capacity"></span>

### 2. Reserve a fixed board and track active entries

The book creates its backing list with `[None] * capacity`. Repeating `None` is safe here because `None` is immutable. Our featured list has capacity 3:

```text
Reserved cells: [ None ][ None ][ None ]
Cell indices:      0       1       2
Active entries:  n = 0
```

After retaining `A`, its state is `[A:6, None, None]` with **capacity 3** but **active count `n = 1`**. The list itself already has length 3 and will not be resized. `None` marks an unused cell; it is not a card. The invariant is **0 ≤ n ≤ capacity**, and the active cards occupy exactly indices `0` through `n − 1`, highest area first.

Creating `[None] * capacity` takes **O(capacity)** time and backing space up front. The book's `__getitem__` simply indexes this backing list. Thus an in-range unused cell returns `None`, while an index outside the three reserved cells raises `IndexError`. Its `__str__` joins only the `n` active entries for display. Our complete program below keeps this storage rule, exposes the active count through `active_count()`, and validates that capacity is positive; the book assumes a positive capacity. To visit only cards, use indices `0` through `active_count() − 1`; iterating the simple board object directly can also reach its unused `None` cells.

<span id="part-2-qualify"></span>

### 3. Decide whether a card qualifies

While fewer than three cards are active, **every new card qualifies**, even a small one. Once full, a new area must be **strictly greater** than the last (lowest) retained area. With descending order, the last active position is the cutoff.

```text
Not full?                   Keep the new card.
Full and new area > cutoff? Keep it and drop one old card.
Full and new area ≤ cutoff? Leave the board unchanged.
```

After `A`, `B`, and `C`, the board is `[C:16, B:8, A:6]`. Card `D` has area 4 and is rejected. Card `E` has area 6; **6 equals the cutoff**, so it is also rejected. This equality rule is part of the book's scoreboard design, not a mathematical rule about rectangles.

Checking the capacity and comparing with the last entry is **O(1)**. If the card qualifies, putting it in order can require shifts.

<span id="part-2-shift"></span>

### 4. Shift lower entries and trace the top three

To insert a qualifying card, start from the final active index and move smaller entries one cell right. Move from right to left so an entry is not overwritten before it is copied. The book's Figure 5.19 illustrates the same move for a new game score.

```text
Before F (area 8):  [ C:16 ][ B:8 ][ A:6 ]
Place F after B:    [ C:16 ][ B:8 ][ F:8 ]  ← A is overwritten; no shift needed

Before G (area 16): [ C:16 ][ B:8 ][ F:8 ]
Shift B right:      [ C:16 ][ B:8 ][ B:8 ]  ← F is overwritten
Place G after C:    [ C:16 ][ G:16 ][ B:8 ]
```

The backing list never gains a fourth cell. `F:8` needs no shift because the previous `B:8` is not smaller; it replaces the last entry. `G:16` shifts `B:8` right and then occupies the gap. The inner comparison uses **`<`**, so a new card of equal area stops *after* an earlier equal-area card.

| Card considered | Area | Decision | Active board, high to low |
| :-------------- | ---: | :------- | :------------------------ |
| `A` | 6 | Keep; space available | `A:6` |
| `B` | 8 | Keep; space available | `B:8, A:6` |
| `C` | 16 | Keep; fills board | `C:16, B:8, A:6` |
| `D` | 4 | Reject; below 6 | `C:16, B:8, A:6` |
| `E` | 6 | Reject; tied with cutoff 6 | `C:16, B:8, A:6` |
| `F` | 8 | Keep; `A` drops | `C:16, B:8, F:8` |
| `G` | 16 | Keep; `F` drops | `C:16, G:16, B:8` |
| `H` | 4 | Reject; below 8 | `C:16, G:16, B:8` |
| `I` | 6 | Reject; below 8 | `C:16, G:16, B:8` |

The selected three card areas total **16 + 16 + 8 = 40 cm²**. The board contains references to these three card records, not a calculation of their geometric union.

<span id="part-2-cost"></span>

### 5. Understand the cost and the book's order wording

Let `C` be the board's fixed capacity. A rejected card takes **O(1)** time after the cutoff check. A qualifying card may shift up to `C − 1` references, so `add` takes **O(C)** worst-case time and **O(1)** when no shift is needed. The backing list never resizes because its `C` cells were reserved in advance. Figure 5.18 shows reserved and active cells; Figure 5.19 shows the insertion shift.

The prose, figures, and `add` method place scores **highest to lowest**, which is **nonincreasing** order. Code Fragment 5.8's docstring calls it “nondecreasing”; that word conflicts with the demonstrated behavior. We follow the algorithm and figures.

> **Mental model:** Fixed capacity saves resizing, but it does not remove the cost of shifting ranked entries.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 5.5.2 Sorting a Sequence

The featured board keeps only three cards in descending order. Now arrange **all** cards from smallest to largest. The book introduces **insertion sort** with high-level steps in Code Fragment 5.9, Python assignments in Code Fragment 5.10, and a letter-by-letter trace in Figure 5.20.

<span id="part-3-prefix"></span>

### 1. Grow a sorted prefix

At the start, the first element alone is sorted. On each pass, hold the next element in a variable called `current`, shift larger earlier values right, and place `current` into its proper gap. After pass `k`, positions `0` through `k` are sorted. This is the **sorted-prefix invariant**.

```python
def insertion_sort(areas):
    for k in range(1, len(areas)):
        current = areas[k]
        j = k
        while j > 0 and areas[j - 1] > current:
            areas[j] = areas[j - 1]
            j -= 1
        areas[j] = current


values = [6, 8, 16, 4]
insertion_sort(values)
print(values)  # [4, 6, 8, 16]
```

The code moves values with assignment; it does **not** call the `list.insert` method. `current` preserves the value that would otherwise be overwritten while entries shift. The strict `>` also leaves equal-area cards in their earlier relative order if we sort card records by area.

<span id="part-3-trace"></span>

### 2. Move card D's area into place

Start with `[6, 8, 16, 4]`, the areas of `A`, `B`, `C`, and `D`:

| Pass | `current` | Sorted prefix after the pass | Shifts |
| ---: | --------: | :--------------------------- | -----: |
| Start | — | `[6]` | 0 |
| `k = 1` | 8 | `[6, 8]` | 0 |
| `k = 2` | 16 | `[6, 8, 16]` | 0 |
| `k = 3` | 4 | `[4, 6, 8, 16]` | 3 |

On the last pass, `D`'s area 4 moves left past 16, 8, and 6. The three larger values shift right; the final list is in ascending area order. For all nine cards, stable ascending order by area is **`D:4, H:4, A:6, E:6, I:6, B:8, F:8, C:16, G:16`**.

<span id="part-3-cost"></span>

### 3. Count the work

For `n` entries in reverse order, pass 1 shifts one value, pass 2 shifts two, and so on. The total is

**1 + 2 + ⋯ + (n − 1) = n(n − 1)/2 = Θ(n²).**

For example, reverse-ordered areas `[16, 8, 6, 4]` require **1 + 2 + 3 = 6 shifts**. An already ascending list needs no shifts, but the outer loop still visits `n − 1` entries, giving **Θ(n)** time. A nearly sorted list has few shifts and can be close to linear. The algorithm rearranges the supplied list **in place** and holds only `current`, `j`, and `k`, so its auxiliary storage is **O(1)**. These time and space claims follow from the book's loops; [Section 5.4](05-04-efficiency-of-python-sequence-types.md) describes the different worst-case bound of Python's built-in `list.sort()`.

> **Mental model:** After each pass, the left part is sorted; only the next card's position remains to be found.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 5.5.3 Simple Cryptography

<span id="part-4-terms"></span>

### 1. Plaintext, ciphertext, and a new string

A **plaintext** is the original message. A **ciphertext** is its transformed version. **Encryption** changes plaintext to ciphertext; **decryption** restores it. The book uses a **Caesar cipher**: each uppercase Latin letter is replaced by one a fixed number of alphabet positions away. This is a classroom transformation, not a secure way to protect information.

Our plaintext is the report for all nine cards: `MAX=16; TOTAL=74`. For a rotation of 3, its ciphertext will be `PDA=16; WRWDO=74`. The numbers, spaces, equals signs, and semicolon remain where they are, so the quantities still refer to the same cards.

Python strings are immutable, so we build a new one. The book converts a string to a list of one-character strings, changes selected list entries, and joins the list:

```python
report = "MAX=16; TOTAL=74"
characters = list(report)
print(characters[:3])          # ['M', 'A', 'X']
print("".join(characters) == report)  # True
```

`list(report)` and `"".join(characters)` each take **O(N)** time for a report of `N` characters. An empty string is the separator for `join`, so no extra characters appear between pieces.

<span id="part-4-modulo"></span>

### 2. Rotate alphabet indices with modulo

Number the uppercase Latin letters `A` through `Z` as **0 through 25**. For a shift `r`, the encrypted index is **`(i + r) % 26`**, and the decrypted index is **`(i − r) % 26`**. `% 26` returns a remainder from 0 to 25, so the alphabet wraps around.

| Letter | `i = ord(letter) − ord('A')` | Shift by 3 | Replacement |
| :----- | --------------------------: | :--------- | :---------- |
| `A` | 0 | `(0 + 3) % 26 = 3` | `D` |
| `T` | 19 | `(19 + 3) % 26 = 22` | `W` |
| `X` | 23 | `(23 + 3) % 26 = 0` | `A` |
| `Z` | 25 | `(25 + 3) % 26 = 2` | `C` |

`ord('A')` is 65 and `ord('X')` is 88 because these 26 uppercase Latin letters have consecutive code points. The book's Figure 5.21 uses `T`: `ord('T') − ord('A') = 84 − 65 = 19`, so the translation table's index 19 supplies `W` for shift 3. `chr` reverses the code-point conversion. To decrypt an encrypted `A`, Python computes `(0 − 3) % 26 = 23`, which points back to `X`.

<span id="part-4-tables"></span>

### 3. Build translation arrays and transform the report

Code Fragment 5.11 preallocates two lists of 26 cells, fills one with encryption replacements and the other with decryption replacements, then joins each into a fixed translation string. With shift 3, they are:

```text
Alphabet index: 0 1 2 3 4 ... 22 23 24 25
Original:       A B C D E ...  W  X  Y  Z
Encoder:        D E F G H ...  Z  A  B  C
Decoder:        X Y Z A B ...  T  U  V  W
```

As whole strings, the encoder is `DEFGHIJKLMNOPQRSTUVWXYZABC` and the decoder is `XYZABCDEFGHIJKLMNOPQRSTUVW`. For each uppercase `A`–`Z` report character, look up its index with `ord(character) − ord('A')` and replace it from the appropriate table. Leave every other character untouched. The full program below implements both directions.

Building the two 26-character tables takes **O(26)** time and space, constant with respect to report length. Transforming a report of `N` characters takes **O(N)** time and **O(N)** extra space: a character list is made, scanned, and joined into a new string.

<span id="part-4-ascii"></span>

### 4. Keep the 26-letter assumption precise

The book says it restricts the cipher to uppercase `A`–`Z`, but its Code Fragment 5.11 tests `character.isupper()`. In current Python, [the `isupper` method](https://docs.python.org/3.14/builtins/stdtypes.html#str.isupper) also accepts uppercase letters outside `A`–`Z`. Those characters can produce an index outside the 26-cell table and raise `IndexError`. Our version tests **`'A' <= character <= 'Z'`** so it transforms exactly the letters for which the table was built. Other characters are preserved.

The [Python documentation for `ord` and `chr`](https://docs.python.org/3.14/builtins/functions.html#ord) describes their code-point conversions. The cipher's arithmetic relies specifically on the consecutive `A`–`Z` subset, not on every character Python considers a letter.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. The complete program

This self-contained version adapts the book's three algorithms. `AreaBoard` follows the fixed-capacity score board, `insertion_sort_by_area` keeps the book's shifting loop, and `CaesarCipher` builds the two 26-letter translation tables. The board constructor rejects a nonpositive capacity, and the cipher transforms only `A`–`Z`.

```python
class CardEntry:
    def __init__(self, label, width, height):
        self.label = label
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def __str__(self):
        return f"{self.label}:{self.area()}"


class AreaBoard:
    def __init__(self, capacity=3):
        if capacity < 1:
            raise ValueError("capacity must be positive")
        self._board = [None] * capacity
        self._n = 0

    def active_count(self):
        return self._n

    def __getitem__(self, index):
        return self._board[index]

    def __str__(self):
        return " ".join(str(self._board[j]) for j in range(self._n))

    def add(self, card):
        new_area = card.area()
        if self._n == len(self._board) and new_area <= self._board[-1].area():
            return False
        if self._n < len(self._board):
            self._n += 1
        j = self._n - 1
        while j > 0 and self._board[j - 1].area() < new_area:
            self._board[j] = self._board[j - 1]
            j -= 1
        self._board[j] = card
        return True


def insertion_sort_by_area(cards):
    for k in range(1, len(cards)):
        current = cards[k]
        j = k
        while j > 0 and cards[j - 1].area() > current.area():
            cards[j] = cards[j - 1]
            j -= 1
        cards[j] = current


class CaesarCipher:
    def __init__(self, shift):
        encoder = [None] * 26
        decoder = [None] * 26
        for k in range(26):
            encoder[k] = chr((k + shift) % 26 + ord("A"))
            decoder[k] = chr((k - shift) % 26 + ord("A"))
        self.forward = "".join(encoder)
        self.backward = "".join(decoder)

    def _transform(self, original, code):
        characters = list(original)
        for k in range(len(characters)):
            if "A" <= characters[k] <= "Z":
                index = ord(characters[k]) - ord("A")
                characters[k] = code[index]
        return "".join(characters)

    def encrypt(self, message):
        return self._transform(message, self.forward)

    def decrypt(self, secret):
        return self._transform(secret, self.backward)


cards = [
    CardEntry("A", 2, 3), CardEntry("B", 4, 2),
    CardEntry("C", 4, 4), CardEntry("D", 2, 2),
    CardEntry("E", 2, 3), CardEntry("F", 4, 2),
    CardEntry("G", 4, 4), CardEntry("H", 2, 2),
    CardEntry("I", 2, 3),
]

board = AreaBoard(3)
for card in cards:
    board.add(card)
print("top cards:", board)
print("top area:", sum(board[j].area() for j in range(board.active_count())), "cm^2")

ordered = cards.copy()
insertion_sort_by_area(ordered)
print("ascending:", " ".join(str(card) for card in ordered))

report = f"MAX={max(card.area() for card in cards)}; TOTAL={sum(card.area() for card in cards)}"
cipher = CaesarCipher(3)
secret = cipher.encrypt(report)
print("report:", report)
print("encrypted:", secret)
print("decrypted:", cipher.decrypt(secret))
```

<span id="part-5-trace"></span>

### 2. Trace its result

```text
top cards: C:16 G:16 B:8
top area: 40 cm^2
ascending: D:4 H:4 A:6 E:6 I:6 B:8 F:8 C:16 G:16
report: MAX=16; TOTAL=74
encrypted: PDA=16; WRWDO=74
decrypted: MAX=16; TOTAL=74
```

The featured board keeps only `C`, `G`, and `B`; its 40 cm² is a subset total. `ordered = cards.copy()` makes a separate list in **O(n)** time so insertion sort can rearrange that list without changing the original card order. The sorting algorithm itself uses **O(1)** auxiliary storage. Equal-area cards stay in their original relative order because the loop shifts only a **strictly larger** earlier area.

The report uses all nine cards, so its maximum is **16 cm²** and its total is **74 cm²**. In `MAX`, the `X` wraps to `A` under a shift of 3; the digits and punctuation are unchanged. Decryption uses the reverse table and restores the exact original report.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Are three reserved cells already three card entries?</strong></summary>

No. A fresh featured board has the backing list `[None, None, None]`, whose **capacity and list length are 3**, but its **active count is 0**. After card `A` arrives, the state is `[A:6, None, None]` and active count is 1. The `None` slots are storage for future entries, not rectangles with zero area.

</details>

<details>
<summary><strong>Case Study 2: Why does card E fail while card F enters?</strong></summary>

After `A`, `B`, and `C`, the cutoff is `A`'s 6 cm². `E` also has area 6, but a full board requires **strictly more** than the cutoff, so it stays out. `F` has area 8, qualifies, and displaces `A`. The new order is `C:16, B:8, F:8`: the earlier `B` stays before the equally sized `F`.

</details>

<details>
<summary><strong>Case Study 3: Does the top-three total equal the total area of all cards?</strong></summary>

No. The featured cards are `C:16`, `G:16`, and `B:8`, totaling **40 cm²**. All nine card areas total **74 cm²**. The first number answers “How much area do the selected cards have?” The second answers “How much area do all nine individual cards have?” Neither number by itself describes a physical union of overlapping rectangles.

</details>

<details>
<summary><strong>Case Study 4: How does D's area reach the front of an insertion sort?</strong></summary>

From `[6, 8, 16, 4]`, hold 4 as `current`. Move 16 one cell right, then 8, then 6. Put 4 in the freed index 0. The result is `[4, 6, 8, 16]` after **three shifts**. The original order of the other three areas stays intact.

</details>

<details>
<summary><strong>Case Study 5: When does insertion sort do quadratic work?</strong></summary>

If card areas begin in reverse order, each next value must pass all earlier values. For `[16, 8, 6, 4]`, the passes make 1, 2, and 3 shifts: **6 total**. With `n` values, the sum is `n(n − 1)/2`, or **Θ(n²)**. An already sorted list still takes a linear scan, but needs no shifts.

</details>

<details>
<summary><strong>Case Study 6: Why does the encrypted report still contain 16 and 74?</strong></summary>

The rotation table has entries only for uppercase `A`–`Z`. For `MAX=16; TOTAL=74`, `M→P`, `A→D`, and `X→A`, producing `PDA=16; WRWDO=74`. Digits, spaces, `=`, and `;` remain unchanged, so the geometry quantities are visible. Decrypting maps the letters back and restores `MAX=16; TOTAL=74`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Application | Array-based idea | Result for our cards | Cost to remember |
| :---------- | :--------------- | :------------------- | :--------------- |
| Fixed-capacity featured board | Reserve `[None] * capacity`, track active `n`, and shift smaller ranked entries right. | Top three: `C:16, G:16, B:8`; selected area **40 cm²**. | Setup **O(capacity)** time and space; admission check **O(1)**; qualifying insertion up to **O(capacity)**. |
| Insertion sort | Keep a sorted prefix; hold the next card and shift larger areas right. | All nine in ascending area order. | **Θ(n)** when sorted; **Θ(n²)** in reverse order. |
| Caesar cipher | Index a 26-letter translation table and join transformed characters into a new string. | `MAX=16; TOTAL=74` becomes `PDA=16; WRWDO=74`. | **O(N)** time and extra space for `N` report characters. |

The book's algorithms teach how position-based storage supports ranking, sorting, and text transformation. The complete program also makes two assumptions explicit: a featured board needs **positive capacity**, and a 26-letter cipher should transform only **`A`–`Z`**.

> **Final mental model:** Reserve positions for a bounded ranking, shift values to grow sorted order, and use letter indices to create a transformed string.

[🔝 Back to Top](#top)
