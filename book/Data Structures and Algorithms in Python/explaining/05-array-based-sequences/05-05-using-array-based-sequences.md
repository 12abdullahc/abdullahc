<span id="top"></span>

# Array-Based Sequences — Section 5.5: Using Array-Based Sequences

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.5 (printed pages 210–218; [chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C05.pdf)).<br>
> **Topic:** A fixed-capacity high-score board, insertion sort, and a Caesar cipher.<br>
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika. The rider results below come from this one session.<br>
> **Learning goal:** Use positions in arrays to keep a small ranking, sort all entries by fastest lap, and transform a short text report; explain why every shift and lookup is needed.<br>
> **User Prompt:** "Reexplain [Section 5.5] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Practice Session, Three Array Jobs](#background-intuition)
   - [1. Verified session entries](#background-data)
   - [2. Make a teaching score from a best lap](#background-score)
2. [Part 1: Section 5.5 — What Positions Mean in Each Application](#part-1)
3. [Part 2: Section 5.5.1 — Storing High Scores for a Game](#part-2)
   - [1. Entry objects and reserved cells](#part-2-entry)
   - [2. Decide whether a new entry qualifies](#part-2-qualify)
   - [3. Shift entries and trace the top three](#part-2-trace)
   - [4. Count the work and read the book's order carefully](#part-2-cost)
4. [Part 3: Section 5.5.2 — Sorting a Sequence](#part-3)
   - [1. Maintain a sorted prefix](#part-3-prefix)
   - [2. Trace the nine Practice laps](#part-3-trace)
   - [3. Best, worst, and stable order](#part-3-cost)
5. [Part 4: Section 5.5.3 — Simple Cryptography](#part-4)
   - [1. Plaintext, ciphertext, and character lists](#part-4-terms)
   - [2. Convert letters to indices and wrap around](#part-4-modulo)
   - [3. Build encoder and decoder arrays](#part-4-tables)
   - [4. Transform only the 26 letters in the table](#part-4-ascii)
6. [Part 5: Complete Worked Practice Program](#part-5)
   - [1. Solve the three jobs step by step](#part-5-steps)
   - [2. Run the program and explain its output](#part-5-program)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Practice Session, Three Array Jobs

<span id="background-data"></span>

### 1. Verified session entries

The [MotoGP Friday Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) and [Yamaha's full Practice classification](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) record these riders, teams, official positions, and fastest single laps. We will **process them in the selected order shown**, beginning with Marc Márquez and Fabio Quartararo. That order is for the lesson; the **P** values are the official Practice places.

| Processing order | Rider | Team | Official Practice place | Best lap | Milliseconds |
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

`1:29.426` means `60,000 + 29,426 = 89,426` milliseconds. **Lower** best-lap milliseconds mean a faster lap. Fabio's and Marc's laps differ by `89,558 − 89,426 = 132` milliseconds, or **0.132 seconds**. These figures describe Friday Practice, not a race result.

**Why these entries?** Starting with Marc and Fabio makes it clear how a ranked board changes when the quicker Raúl, Marco, and Jorge arrive later. The same nine entries can then be sorted into official fastest-lap order. **How to solve the data setup:** store each rider with the team, official P place, and best lap; keep the processing order separate from the result ranking.

<span id="background-score"></span>

### 2. Make a teaching score from a best lap

The book's game board treats a **larger score as better**. Our raw lap times work the other way: smaller is faster. To keep the book's comparisons unchanged, define an **instructional pace score**:

```text
pace score = 90,000 − best-lap milliseconds
```

The 90,000-millisecond (90-second) reference is chosen only because all nine selected laps are below it. This score is **not official MotoGP points** and is not a published session measurement. It preserves the ranking: a lap that takes fewer milliseconds gets a larger score.

```python
marc_score = 90_000 - 89_426
fabio_score = 90_000 - 89_558
print(marc_score, fabio_score)
print(marc_score > fabio_score)
```

```text
574 442
True
```

| Rider | Best lap (ms) | Teaching pace score |
| :--- | ---: | ---: |
| Marc Márquez | 89,426 | 574 |
| Fabio Quartararo | 89,558 | 442 |
| Raúl Fernández | 88,725 | 1,275 |
| Marco Bezzecchi | 88,944 | 1,056 |
| Jorge Martín | 89,206 | 794 |
| Pedro Acosta | 89,394 | 606 |
| Fabio Di Giannantonio | 89,430 | 570 |
| Álex Márquez | 89,572 | 428 |
| Franco Morbidelli | 89,693 | 307 |

**Why this example?** Marc's quicker lap gives `574`, greater than Fabio's `442`, so the book's “high score first” rule now matches “fast lap first.” **How to solve it:** convert laps to one unit, subtract each from the same fixed reference, and check that a smaller time produces a larger result.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 5.5 — What Positions Mean in Each Application

Section 5.5 applies arrays to three different tasks. An index in the score board is a **rank among a limited number of retained entries**. An index in insertion sort is a **place in a growing sorted prefix**. An index in the cipher table identifies one of the **26 uppercase Latin letters**. The same ability to read or write a known position supports all three algorithms, but moving several entries still takes several steps.

| Application | Sequence and its order | Question it answers |
| :--- | :--- | :--- |
| High-score board | At most three rider references, **highest teaching score first** | Which three selected laps are fastest? |
| Insertion sort | All nine rider references, **lowest lap milliseconds first** | How do all nine compare by best lap? |
| Caesar cipher | 26 letter replacements at indices `0`–`25` | How is a short Practice note transformed? |

The first two orders identify the same fastest riders, but the board retains only three records while sorting retains all nine. The cipher changes text, not lap times or positions. Let `C` be board capacity, `n` the number of records to sort, and `N` the message length. We count simple reference moves, integer comparisons, and character lookups as constant-size steps; elapsed time depends on the computer and Python implementation.

**Why this overview?** It prevents a common mix-up: the board is descending by a derived score, while the sorting algorithm is ascending by actual lap time. **How to solve a new application:** decide what an index means, state the required order, then count the cells read or moved.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 5.5.1 — Storing High Scores for a Game

The book's Code Fragment 5.7 stores a player's name and score in a `GameEntry`. Code Fragment 5.8 uses those entries in a fixed-capacity `Scoreboard`. Here a Practice entry keeps a rider, team, official place, and lap time; its teaching pace score plays the game's score role.

The book's `GameEntry` offers `get_name()`, `get_score()`, and `__str__()` methods to read and display its two fields. Our complete `PracticeEntry` uses clearly named attributes and derives its score in the constructor; the board algorithm needs the same essential pair of facts: **who the entry belongs to** and **which number to compare**.

<span id="part-2-entry"></span>

### 1. Entry objects and reserved cells

The book reserves all `C` board cells with `[None] * C` and tracks the number of **active** entries separately. Its `Scoreboard` defaults to capacity `10`, and Figure 5.18 shows six active entries in ten reserved cells. We choose capacity `3` so every change fits in a short trace. The backing Python list already has length `3` when our board is empty:

```python
cells = [None] * 3
active = 0
cells[0] = ("Marc Márquez", 574)
active += 1
print(len(cells), active)
print(cells)
```

```text
3 1
[('Marc Márquez', 574), None, None]
```

The invariant is `0 ≤ active ≤ C`. Only indices `0` through `active − 1` are score entries; the remaining `None` cells are reserved space. Repeating `None` is suitable here because it is a single immutable sentinel. Repeating a mutable entry object would make several cells refer to that **same object**. Reserving the cells costs **O(C)** time and space.

The book's simple `__getitem__` reads the backing list directly, so an unused in-range position can return `None`. In the complete program, `__getitem__` checks the **active** range before returning an entry; this teaching version also rejects negative indices. Both versions rely on the separate active count. The book's display method joins only active entries.

**Why this example?** It exposes the difference between list length `3`, board capacity `3`, and active count `1`. **How to solve an access question:** inspect the active count first; a reserved `None` cell is not a rider score.

<span id="part-2-qualify"></span>

### 2. Decide whether a new entry qualifies

While the board has fewer than `C` active entries, **every new entry qualifies**. Once full, a new score qualifies only when it is **strictly greater** than the last retained score, the cutoff. A tie with that cutoff is rejected under the book's policy. Our nine best laps produce distinct scores, so the tie rule is a policy explanation rather than an invented session tie.

```text
If active < C:            accept the entry.
If active == C and new score > lowest retained score: accept it.
Otherwise:               leave the board unchanged.
```

After Marc, Fabio, and Raúl, the capacity-three board is `[Raúl:1275, Marc:574, Fabio:442]`. Marco's `1056` is above the `442` cutoff, so he qualifies and Fabio drops from the board. The cutoff check is **O(1)** because the board knows where its last active cell is. Placing a qualifier in rank order may take more work.

**Why this example?** Marco's arrival shows a full board accepting a new entry and replacing its lowest retained score. **How to solve it:** check whether space remains; if full, compare the new score with the last active entry using the strict `>` rule.

<span id="part-2-trace"></span>

### 3. Shift entries and trace the top three

To insert a qualifying entry, the algorithm moves smaller scores one cell **right**, starting near the end and working backward. Moving rightmost first preserves each old reference until it has been copied. For Marco's arrival:

```text
Before: [ Raúl:1275 ][ Marc:574 ][ Fabio:442 ]
Move:                  Marc:574 → final cell (Fabio drops)
Write:  [ Raúl:1275 ][ Marco:1056 ][ Marc:574 ]
```

The inner loop shifts only when an earlier score is **strictly smaller** than the new one. If equal scores appeared above the cutoff, the earlier entry would stay before the new one. Process all nine verified Practice entries:

| New rider | Teaching score | Decision | Board after this rider, high score first |
| :--- | ---: | :--- | :--- |
| Marc Márquez | 574 | Space available | Marc |
| Fabio Quartararo | 442 | Space available | Marc, Fabio |
| Raúl Fernández | 1,275 | Space available | Raúl, Marc, Fabio |
| Marco Bezzecchi | 1,056 | Qualifies; Fabio drops | Raúl, Marco, Marc |
| Jorge Martín | 794 | Qualifies; Marc drops | Raúl, Marco, Jorge |
| Pedro Acosta | 606 | Below cutoff 794 | Raúl, Marco, Jorge |
| Fabio Di Giannantonio | 570 | Below cutoff 794 | Raúl, Marco, Jorge |
| Álex Márquez | 428 | Below cutoff 794 | Raúl, Marco, Jorge |
| Franco Morbidelli | 307 | Below cutoff 794 | Raúl, Marco, Jorge |

The final board contains the session's official P1–P3 fastest laps. Marc and Fabio remain in the **full nine-entry dataset** even after they leave the three-place board.

**Why this example?** The board changes twice after becoming full, so both qualification and replacement are visible. **How to solve a board trace:** process entries one at a time, compare against the cutoff when full, shift lower scores from right to left, and write the new reference in the gap.

<span id="part-2-cost"></span>

### 4. Count the work and read the book's order carefully

A rejected entry takes **O(1)** time after the cutoff check. An accepted entry may shift as many as `C − 1` references, so insertion is **O(C)** worst case. The board never resizes because its `C` cells were reserved at construction. Processing `n` entries is **O(nC)** in the worst case; for our fixed `C = 3`, that is O(n). Figures 5.18 and 5.19 show the reserved cells and rightward shift.

The book's code and figures place higher scores **first**, which is **nonincreasing** order. One docstring in Code Fragment 5.8 calls it “nondecreasing”; the actual comparisons and example order show the intended ranking. Our board follows the code's high-to-low behavior.

**Why this cost example?** Reserving space removes growth work but cannot remove the shifts needed to maintain rank. **How to solve it:** count the number of retained cells `C`, then count how many lower scores a qualifying entry can pass.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 5.5.2 — Sorting a Sequence

The board keeps only three riders. To arrange **all nine** by best lap, the book introduces **insertion sort** (Code Fragments 5.9 and 5.10). It grows a sorted prefix of one list by placing each next entry in the right position.

<span id="part-3-prefix"></span>

### 1. Maintain a sorted prefix

Before pass `k`, positions `0` through `k − 1` are sorted. Save the entry at `k` in `current`, move any earlier **larger lap time** one cell right, then place `current` into the freed position. After the pass, positions `0` through `k` are sorted. This is the **sorted-prefix invariant**.

```python
def insertion_sort_laps(records):
    for k in range(1, len(records)):
        current = records[k]
        j = k
        while j > 0 and records[j - 1][1] > current[1]:
            records[j] = records[j - 1]
            j -= 1
        records[j] = current


small = [
    ("Marc Márquez", 89426),
    ("Fabio Quartararo", 89558),
    ("Raúl Fernández", 88725),
    ("Marco Bezzecchi", 88944),
]
insertion_sort_laps(small)
print([name for name, _ in small])
```

```text
['Raúl Fernández', 'Marco Bezzecchi', 'Marc Márquez', 'Fabio Quartararo']
```

For Raúl's pass, save his `88,725` ms entry, shift Fabio's `89,558` and Marc's `89,426` one cell right, then put Raúl in cell `0`. The code uses **assignments**, not `list.insert`; the held `current` record prevents it from being lost when a cell is overwritten.

**Why this example?** Raúl arrives after two slower laps and must pass both, so every step of a nontrivial insertion is visible. **How to solve it:** mark the already sorted prefix, save the next record, shift only records with greater milliseconds, and place the saved record in the gap.

<span id="part-3-trace"></span>

### 2. Trace the nine Practice laps

The table uses each rider's **official P place as a compact label** for the record. The positions inside the brackets are the insertion sort's **current list positions**, not new official results. A larger P number in this session corresponds to a slower best lap among these nine.

| Pass | New record | Sorted prefix after the pass, labeled by official place | References shifted right |
| ---: | :--- | :--- | ---: |
| Start | Marc P5 | `[P5]` | 0 |
| `k = 1` | Fabio Quartararo P7 | `[P5, P7]` | 0 |
| `k = 2` | Raúl P1 | `[P1, P5, P7]` | 2 |
| `k = 3` | Marco P2 | `[P1, P2, P5, P7]` | 2 |
| `k = 4` | Jorge P3 | `[P1, P2, P3, P5, P7]` | 2 |
| `k = 5` | Pedro P4 | `[P1, P2, P3, P4, P5, P7]` | 2 |
| `k = 6` | Fabio Di Giannantonio P6 | `[P1, P2, P3, P4, P5, P6, P7]` | 1 |
| `k = 7` | Álex P8 | `[P1, P2, P3, P4, P5, P6, P7, P8]` | 0 |
| `k = 8` | Franco P9 | `[P1, P2, P3, P4, P5, P6, P7, P8, P9]` | 0 |

The actual trace makes `0 + 2 + 2 + 2 + 2 + 1 + 0 + 0 = 9` reference shifts. Its final order agrees with the official P1–P9 Practice classification because we sorted the same best-lap values. Figure 5.20 in the book shows the same sorted-prefix idea with letters.

**Why this example?** It shows that a sorting algorithm can recover an order different from the one in which records were supplied. **How to solve a trace:** after each pass, write the entire sorted prefix and count how many earlier times exceed `current`.

<span id="part-3-cost"></span>

### 3. Best, worst, and stable order

If the input is already ascending, the inner shift loop runs zero times, but the outer loop still considers `n − 1` entries: **Θ(n)** best-case time. If the input is reverse-ordered, pass `k` shifts `k` entries. The sum is

```text
1 + 2 + ... + (n − 1) = n(n − 1)/2 = Θ(n²).
```

For `n = 9`, the reverse-order case would require `36` shifts; our real selected order required `9`. The algorithm changes its input list in place and holds only a few extra variables, so its **auxiliary** space is **O(1)**. If we first copy the list to preserve the original order, that copy separately costs O(n) time and space.

The loop shifts only when an earlier lap is **strictly greater** than `current`, so equal-key records would remain in their earlier relative order. This is **stability**; it is a property of the algorithm even though these nine best laps are distinct. The [CPython complexity table](https://docs.python.org/3/builtins/time-complexity.html) gives built-in `list.sort()` an O(n log n) worst-case bound for ordinary constant-cost comparisons, while this insertion sort is a small algorithm we can trace by hand.

**Why this example?** The actual nine-shift count sits between the easy already-sorted case and the 36-shift reverse case. **How to solve a complexity question:** count the outer passes, find the maximum shifts on each pass, sum `1` through `n − 1`, and state separately whether the input list was copied.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 5.5.3 — Simple Cryptography

The book's third application is a **Caesar cipher**. It maps each uppercase Latin letter to a letter a fixed number of positions later in the alphabet. The example is for learning indexed translation; a fixed letter rotation does not protect a private message.

<span id="part-4-terms"></span>

### 1. Plaintext, ciphertext, and character lists

**Plaintext** is the original message; **ciphertext** is the transformed message. **Encryption** applies the mapping, and **decryption** applies its inverse. Use this short ASCII note about the same Practice session:

```text
MARC P5; FABIO P7
```

Here `MARC` abbreviates Marc Márquez and `FABIO P7` identifies Fabio Quartararo. The P5 and P7 values are the official Friday Practice places. With a shift of three letters, the encrypted note is `PDUF S5; IDELR S7`. Digits, spaces, and the semicolon are left in place.

Python strings cannot have individual characters reassigned. The book converts a message to a **list of one-character strings**, changes selected list cells, and joins them into a new string:

```python
message = "MARC P5; FABIO P7"
characters = list(message)
print(characters[:4])
print("".join(characters) == message)
```

```text
['M', 'A', 'R', 'C']
True
```

For a message of `N` characters, making this list and joining it each take O(N) time. The empty string in `"".join` is a separator that adds no characters.

**Why this example?** Marc and Fabio are identifiable in a compact report whose encrypted form can be checked letter by letter. **How to solve it:** separate the text into character positions, replace only letters covered by the cipher, and assemble one new string.

<span id="part-4-modulo"></span>

### 2. Convert letters to indices and wrap around

Number `A` through `Z` as indices `0` through `25`. For letter index `i` and rotation `r`, encryption uses **`(i + r) % 26`**; decryption uses **`(i − r) % 26`**. The `% 26` operation wraps a value past `25` back to the start of the alphabet.

| Letter | Index `ord(letter) − ord('A')` | Shift by 3 | Encrypted letter |
| :--- | ---: | :--- | :--- |
| `M` | 12 | `(12 + 3) % 26 = 15` | `P` |
| `F` | 5 | `(5 + 3) % 26 = 8` | `I` |
| `X` | 23 | `(23 + 3) % 26 = 0` | `A` |
| `Z` | 25 | `(25 + 3) % 26 = 2` | `C` |

`ord('A')` is `65`, so `ord('M') − ord('A') = 77 − 65 = 12`. `chr(65 + 15)` produces `P`. For decryption, an encrypted `P` has index `15`, and `(15 − 3) % 26 = 12` returns `M`. The book's Figure 5.21 uses the same index arithmetic with `T` and a three-position rotation. Python documents [`ord` and `chr`](https://docs.python.org/3/builtins/functions.html#ord) as code-point conversions.

**Why this example?** `M` and `F` come from the actual note, while `X` and `Z` reveal why modulo is needed. **How to solve it:** convert a letter to index `0`–`25`, add or subtract the rotation, take `% 26`, and convert the resulting index back to a letter.

<span id="part-4-tables"></span>

### 3. Build encoder and decoder arrays

The book's Code Fragment 5.11 reserves **two 26-cell arrays**. At index `i`, one holds the encryption replacement for original letter `i`; the other holds its decryption replacement. With rotation `3`:

```python
shift = 3
encoder = [None] * 26
decoder = [None] * 26
for i in range(26):
    encoder[i] = chr(ord("A") + (i + shift) % 26)
    decoder[i] = chr(ord("A") + (i - shift) % 26)
print("".join(encoder))
print("".join(decoder))
```

```text
DEFGHIJKLMNOPQRSTUVWXYZABC
XYZABCDEFGHIJKLMNOPQRSTUVW
```

An `A` in plaintext uses encoder index `0`, giving `D`; an `X` uses index `23`, giving `A`. To decrypt encrypted `D`, use decoder index `3`, giving `A`. The 26-cell tables take **O(26)** setup time and space, constant relative to message length. Transforming `N` characters takes **O(N)** time and **O(N)** extra space for the character list and output string.

**Why this example?** The complete translation strings make every array position inspectable, including wraparound. **How to solve it:** fill both tables using the formulas, then look up each covered message character by `ord(character) − ord('A')`.

<span id="part-4-ascii"></span>

### 4. Transform only the 26 letters in the table

The translation arrays cover **only `A` through `Z`**. The book's example uses `character.isupper()` as a guard, but [Python's `isupper`](https://docs.python.org/3/builtins/stdtypes.html#str.isupper) also recognizes uppercase letters outside this 26-letter range. For instance, `Á` from rider name Álex is uppercase yet has no cell in our table:

```python
print("Á".isupper())
print("A" <= "Á" <= "Z")
```

```text
True
False
```

Use `"A" <= character <= "Z"` before indexing either table. This keeps accented letters, lowercase text, digits, spaces, and punctuation unchanged. It avoids an out-of-range table index and makes the cipher's assumption explicit. The short ASCII note avoids partly transforming a full accented rider name.

**Why this example?** Real rider names in our session contain accents, so the 26-letter limit matters in this domain. **How to solve it:** check membership in the table's **actual input range**, rather than asking only whether a character is uppercase.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Complete Worked Practice Program

<span id="part-5-steps"></span>

### 1. Solve the three jobs step by step

1. Make a `PracticeEntry` for each verified rider. Keep the official place and lap time, and derive the teaching pace score from the lap.
2. Offer each entry to a capacity-three `Scoreboard`, which retains the highest derived scores in descending order.
3. Copy the full entry list, then insertion-sort that copy by **ascending actual lap milliseconds**. Count each rightward reference shift.
4. Build both Caesar translation tables and encrypt the Marc/Fabio Practice note. Decrypt it to check that the reverse table restores the original text.

**Why one program?** It shows that the board, full sort, and cipher answer different questions about the same session. **How to solve it:** keep the factual result data in one place; give each algorithm its own sequence and order rule.

<span id="part-5-program"></span>

### 2. Run the program and explain its output

```python
class PracticeEntry:
    def __init__(self, rider, team, place, lap_ms):
        self.rider = rider
        self.team = team
        self.place = place
        self.lap_ms = lap_ms
        self.pace_score = 90_000 - lap_ms  # Instructional, not official points.


class Scoreboard:
    def __init__(self, capacity=3):
        if capacity < 1:
            raise ValueError("capacity must be positive")
        self._cells = [None] * capacity
        self._n = 0

    def __len__(self):
        return self._n

    def __getitem__(self, index):
        if not 0 <= index < self._n:
            raise IndexError("active board index out of range")
        return self._cells[index]

    def __str__(self):
        return " | ".join(
            "{} P{} ({})".format(self._cells[i].rider,
                                   self._cells[i].place,
                                   self._cells[i].pace_score)
            for i in range(self._n)
        )

    def add(self, entry):
        capacity = len(self._cells)
        if self._n == capacity and entry.pace_score <= self._cells[-1].pace_score:
            return False
        if self._n < capacity:
            self._n += 1
        j = self._n - 1
        while j > 0 and self._cells[j - 1].pace_score < entry.pace_score:
            self._cells[j] = self._cells[j - 1]
            j -= 1
        self._cells[j] = entry
        return True


def insertion_sort_by_lap(records):
    shifts = 0
    for k in range(1, len(records)):
        current = records[k]
        j = k
        while j > 0 and records[j - 1].lap_ms > current.lap_ms:
            records[j] = records[j - 1]
            shifts += 1
            j -= 1
        records[j] = current
    return shifts


class CaesarCipher:
    def __init__(self, shift):
        encoder = [None] * 26
        decoder = [None] * 26
        for i in range(26):
            encoder[i] = chr(ord("A") + (i + shift) % 26)
            decoder[i] = chr(ord("A") + (i - shift) % 26)
        self.forward = "".join(encoder)
        self.backward = "".join(decoder)

    def _transform(self, text, table):
        characters = list(text)
        for i in range(len(characters)):
            if "A" <= characters[i] <= "Z":
                index = ord(characters[i]) - ord("A")
                characters[i] = table[index]
        return "".join(characters)

    def encrypt(self, message):
        return self._transform(message, self.forward)

    def decrypt(self, secret):
        return self._transform(secret, self.backward)


# Friday 9 October 2026 Indonesian GP MotoGP Practice, in teaching order.
entries = [
    PracticeEntry("Marc Márquez", "Ducati Lenovo Team", 5, 89426),
    PracticeEntry("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89558),
    PracticeEntry("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88725),
    PracticeEntry("Marco Bezzecchi", "Aprilia Racing", 2, 88944),
    PracticeEntry("Jorge Martín", "Aprilia Racing", 3, 89206),
    PracticeEntry("Pedro Acosta", "Red Bull KTM Factory Racing", 4, 89394),
    PracticeEntry("Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", 6, 89430),
    PracticeEntry("Álex Márquez", "BK8 Gresini Racing MotoGP", 8, 89572),
    PracticeEntry("Franco Morbidelli", "Pertamina Enduro VR46 Racing Team", 9, 89693),
]

board = Scoreboard(3)
for entry in entries:
    board.add(entry)
print("top-three board:", board)
print("top-three teams:", [board[i].team for i in range(len(board))])

ordered = entries.copy()
shifts = insertion_sort_by_lap(ordered)
print("sorted official places:", [entry.place for entry in ordered])
print("insertion-sort shifts:", shifts)

message = "MARC P{}; FABIO P{}".format(entries[0].place, entries[1].place)
cipher = CaesarCipher(3)
secret = cipher.encrypt(message)
print("message:", message)
print("encrypted:", secret)
print("decrypted:", cipher.decrypt(secret))
```

```text
top-three board: Raúl Fernández P1 (1275) | Marco Bezzecchi P2 (1056) | Jorge Martín P3 (794)
top-three teams: ['SuperFile Trackhouse MotoGP Team', 'Aprilia Racing', 'Aprilia Racing']
sorted official places: [1, 2, 3, 4, 5, 6, 7, 8, 9]
insertion-sort shifts: 9
message: MARC P5; FABIO P7
encrypted: PDUF S5; IDELR S7
decrypted: MARC P5; FABIO P7
```

The board keeps only the three highest teaching scores, matching the three lowest real lap times. The copied list keeps all nine records; insertion sort turns their teaching order into the official fastest-lap order with nine shifts. The original `entries` list remains in Marc/Fabio-first order because `ordered = entries.copy()` made a separate outer list. The cipher changes the ASCII letters of its note and leaves the official place digits visible. Decryption restores the exact note.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Application | Array-based idea | Result for this Practice session | Cost to remember |
| :--- | :--- | :--- | :--- |
| Fixed-capacity high-score board | Reserve `[None] * C`, track active entries, and shift smaller scores right. | Raúl P1, Marco P2, Jorge P3 retained. | Setup **O(C)**; rejection **O(1)**; accepted insertion up to **O(C)**. |
| Insertion sort | Hold the next record and shift larger lap times right to grow a sorted prefix. | All nine records end in P1–P9 order. | **Θ(n)** best case; **Θ(n²)** worst case; **O(1)** auxiliary space before any optional copy. |
| Caesar cipher | Use 26-entry encoder and decoder arrays, then join transformed characters. | `MARC P5; FABIO P7` becomes `PDUF S5; IDELR S7`. | Table setup **O(26)**; transform **O(N)** time and space for `N` characters. |

To solve a new array-based task, state what each **position** means, choose the required order, preserve any value that shifting could overwrite, and count the entries or characters visited. Keep the source facts separate from teaching transformations such as the pace score and letter rotation.

[🔝 Back to Top](#top)
