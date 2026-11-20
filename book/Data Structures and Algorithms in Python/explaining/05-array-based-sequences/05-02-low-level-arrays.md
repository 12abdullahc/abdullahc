<span id="top"></span>

# Array-Based Sequences — Section 5.2: Low-Level Arrays

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.2 (printed pages 185–191; [chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C05.pdf)).  
> **Topic:** Array cells and addresses; referential arrays; compact arrays in Python.  
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika, with Marc Márquez, Fabio Quartararo, and Raúl Fernández.  
> **Learning goal:** Explain how an index locates an array cell, predict when Python collections share objects, and choose a compact array for numeric lap times.  
> **User Prompt:** "Reexplain [Section 5.2] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Practice Session, Two Storage Jobs](#background-intuition)
   - [1. The verified session entries](#background-data)
   - [2. An index is not an address](#background-index)
2. [Part 1: Section 5.2 — Low-Level Array Cells](#part-1)
   - [1. Bits, bytes, addresses, and RAM](#part-1-memory)
   - [2. Equal-width cells and the address formula](#part-1-address)
   - [3. Read the book's `SAMPLE` diagram carefully](#part-1-sample)
3. [Part 2: Section 5.2.1 — Referential Arrays](#part-2)
   - [1. A list or tuple holds references](#part-2-references)
   - [2. A slice copies references; assignment redirects a cell](#part-2-slice)
   - [3. Copy mutable rider notes independently](#part-2-deepcopy)
   - [4. Repeated references: counters and review rows](#part-2-repeat)
   - [5. `extend` adds references to existing objects](#part-2-extend)
4. [Part 3: Section 5.2.2 — Compact Arrays in Python](#part-3)
   - [1. Direct values versus references](#part-3-compact)
   - [2. Store lap milliseconds with `array.array`](#part-3-array)
   - [3. Measure the right kind of memory](#part-3-memory)
5. [Part 4: Complete Worked Practice Notebook](#part-4)
   - [1. Solve the storage and comparison task](#part-4-steps)
   - [2. Run and trace the program](#part-4-program)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Practice Session, Two Storage Jobs

<span id="background-data"></span>

### 1. The verified session entries

The [MotoGP Friday Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) and [Yamaha's full Practice results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) record these riders, teams, positions, and fastest single laps:

| Rider | Team | Official Practice place | Best lap | Milliseconds |
| :--- | :--- | ---: | ---: | ---: |
| Marc Márquez | Ducati Lenovo Team | P5 | 1:29.426 | 89,426 |
| Fabio Quartararo | Monster Energy Yamaha MotoGP Team | P7 | 1:29.558 | 89,558 |
| Raúl Fernández | SuperFile Trackhouse MotoGP Team | P1 | 1:28.725 | 88,725 |

Our **selected order** is Marc, Fabio, Raúl, so their Python indices are `0`, `1`, `2`. Those indices are different from the official places `5`, `7`, `1`. A lap such as `1:29.426` becomes `60,000 + 29,426 = 89,426` milliseconds. Fabio's and Marc's best laps differ by `89,558 − 89,426 = 132` milliseconds, or **0.132 seconds**. This compares one best lap per rider in the same Practice session; it is not a race finishing gap.

**Why this example?** Rider names and team names vary in length, while the three lap times are numbers of one chosen kind. They make the difference between storing **references to objects** and storing **numeric values directly** useful to see. **How to solve the data question:** keep the selected order aligned, convert times to one unit, and preserve the official place as its own field.

<span id="background-index"></span>

### 2. An index is not an address

An **index** is a position in a sequence: Fabio is at index `1` in our selected order. A **memory address** identifies a byte in the computer's memory. An array's layout connects the two: given the first cell's address and the width of each cell, we can calculate where a chosen cell begins.

```text
Selected index:      0                  1                  2
Rider:               Marc Márquez       Fabio Quartararo   Raúl Fernández
Best lap (ms):       89,426             89,558             88,725
Official place:      P5                 P7                 P1
```

The memory diagrams below use **invented addresses and stated cell widths**. They explain the book's low-level model; they do not report the actual addresses of these Python objects. The detailed Python snippets are teaching examples added to Section 5.2, which uses diagrams and short expressions rather than a complete MotoGP program.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 5.2 — Low-Level Array Cells

<span id="part-1-memory"></span>

### 1. Bits, bytes, addresses, and RAM

A **bit** is a `0` or `1`; a **byte** is eight bits. Each byte of main memory has a numbered address. A value can occupy several consecutive bytes. **Random access memory (RAM)** lets a program ask for a particular address directly. In the book's idealized RAM model, reading or writing one chosen memory location takes **O(1)** time: the work does not grow with the total number of locations. Real elapsed time can still depend on caches and other hardware details.

| Term | Meaning in this guide | Practice example |
| :--- | :--- | :--- |
| Index | Position in our chosen sequence | Fabio is at index `1`. |
| Address | Number identifying a byte | The invented address `1004` below starts Fabio's cell. |
| Cell width | Bytes reserved for one array element | Our first model assumes `4` bytes per lap value. |
| Random access | Choose one memory location directly | Ask for Fabio's cell without scanning Marc's cell first. |

**Why this example?** It separates a Python position from the physical location used to hold data. **How to solve a memory-location question:** identify the index, the first cell's address, and the fixed cell width before doing any arithmetic.

<span id="part-1-address"></span>

### 2. Equal-width cells and the address formula

An array uses a **contiguous** run of equal-width cells. If each cell has width `w` bytes and the first cell begins at address `b`, then cell `k` begins at:

```text
address of cell k = b + w × k
```

Imagine that our three millisecond values occupy **4-byte cells** beginning at the invented address `1000`:

| Selected index `k` | Rider | Value | First byte: `1000 + 4 × k` | Bytes in cell |
| ---: | :--- | ---: | ---: | :--- |
| `0` | Marc | `89_426` | `1000` | `1000–1003` |
| `1` | Fabio | `89_558` | `1004` | `1004–1007` |
| `2` | Raúl | `88_725` | `1008` | `1008–1011` |

```python
base_address = 1000       # hypothetical, not a Python object's address
cell_width = 4            # bytes in this example's model
fabio_index = 1
print(base_address + cell_width * fabio_index)
```

```text
1004
```

**Why this example?** Fabio is one cell after Marc in our selected order, so the arithmetic is easy to check: `1000 + 4 × 1 = 1004`. **How to solve it:** multiply the zero-based index by the cell width, then add the base address. This fixed amount of address arithmetic explains **O(1) indexed cell location** in the RAM model. It does not mean that summing all `n` lap values takes O(1); a complete scan still visits `n` cells.

<span id="part-1-sample"></span>

### 3. Read the book's `SAMPLE` diagram carefully

Figures 5.2 and 5.3 in the book apply the formula to `SAMPLE`. They **assume two bytes per character** and start the first character at address `2146`:

```text
Index:          0     1     2     3     4     5
Character:      S     A     M     P     L     E
Modeled start: 2146  2148  2150  2152  2154  2156
```

At index `4`, the character is `L`, and its modeled first byte is `2146 + 2 × 4 = 2154`; the two-byte cell occupies `2154–2155`. **Why this example?** It connects the book's figure to the same formula used for Fabio's modeled lap cell. **How to solve it:** read the character's zero-based index from the figure, multiply by the figure's **assumed** character width, then add the base address.

The two-byte width is a **model in the book**, not a rule for every current Python string. Modern CPython uses a flexible Unicode representation with one-, two-, or four-byte character storage depending on the string, as described in [PEP 393](https://peps.python.org/pep-0393/). Do not use the figure's `2146` or two-byte width as a measurement of a real Python string.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 5.2.1 — Referential Arrays

A Python `list` or `tuple` can contain objects of very different sizes because its indexed cells hold equal-width **references to objects**. The referenced objects need not sit next to one another in memory. A tuple does not allow its cells to be rebound, but a tuple cell can still refer to a mutable object. This is the representation idea behind the section's diagrams; the exact layout depends on the Python implementation. The [CPython list FAQ](https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython) describes CPython lists as contiguous arrays of references.

<span id="part-2-references"></span>

### 1. A list or tuple holds references

Consider three review slots in our own notebook. `None` means a slot is **not filled yet**; it says nothing about whether a rider participated in Practice:

```python
review_slots = [None, None, None]
review_slots[0] = "Marc Márquez | Ducati Lenovo Team"
review_slots[1] = "Fabio Quartararo | Monster Energy Yamaha MotoGP Team"
print(review_slots[1])
print(review_slots[2] is None)
```

```text
Fabio Quartararo | Monster Energy Yamaha MotoGP Team
True
```

```text
List cells:       [ ref ]          [ ref ]          [ ref ]
                     |                |                |
Objects:         Marc/team text  Fabio/team text      None
```

The two text objects have different lengths, but the list's **reference cells** have a fixed width. `review_slots[2]` holds a reference to the special `None` object until we fill it. **Why this example?** Names and teams make variable-size objects visible, and `None` shows how a position can exist before its worksheet entry is ready. **How to solve it:** use the index to find the cell, follow its reference to the object, and check `is None` before treating an unfilled slot as text.

<span id="part-2-slice"></span>

### 2. A slice copies references; assignment redirects a cell

A list slice makes a **new outer list** whose cells initially refer to the same element objects. For immutable integers, replacing a sliced list's cell changes **that list's reference**, not the original list's cell:

```python
lap_ms = [89_426, 89_558, 88_725]
pair = lap_ms[:2]        # new list: Marc's and Fabio's times
pair[1] = lap_ms[2]      # trial: put Raúl's real time in the second slot

print(lap_ms)
print(pair)
print(pair is lap_ms)
```

```text
[89426, 89558, 88725]
[89426, 88725]
False
```

The original `lap_ms[1]` still holds Fabio's `89_558`. The trial `pair[1]` now refers to Raúl's `88_725`. Neither integer object was altered. `list(lap_ms)` also makes a shallow outer copy. In Figures 5.5 and 5.6, the book similarly takes `primes[3:6]` (the values `7`, `11`, `13`) and then replaces only the sliced list's last cell; the stop index `6` is excluded. **Why this example?** It mirrors those diagrams with real Practice values and shows that a new outer list can change its own selection. **How to solve it:** draw two rows of reference cells; after assignment, redirect only the cell on the left-hand side.

<span id="part-2-deepcopy"></span>

### 3. Copy mutable rider notes independently

When an element itself is mutable, a shallow copy still shares that element. The `reviewed` flag below belongs to **our study notebook**, not to the official MotoGP classification:

```python
from copy import deepcopy

records = [
    {"rider": "Marc Márquez", "team": "Ducati Lenovo Team", "reviewed": False},
    {"rider": "Fabio Quartararo", "team": "Monster Energy Yamaha MotoGP Team", "reviewed": False},
]

shallow = records[:]
shallow[0]["reviewed"] = True
print(shallow is records, shallow[0] is records[0])
print(records[0]["reviewed"])

independent = deepcopy(records)
independent[1]["reviewed"] = True
print(records[1]["reviewed"], independent[1]["reviewed"])
```

```text
False True
True
False True
```

The slice copied the list but shared Marc's dictionary, so changing his notebook flag through `shallow` also changed `records`. `deepcopy` made separate dictionaries for this trial. Immutable strings within them need not be duplicated for the dictionaries to be independent. **Why this example?** It makes the difference between **rebinding a list cell** and **mutating a shared object** visible without changing a real result. **How to solve a copy problem:** identify every mutable level you plan to edit; a one-level slice is enough only when sharing the elements is acceptable. See the [Python `copy` documentation](https://docs.python.org/3/library/copy.html) for the general shallow/deep distinction.

<span id="part-2-repeat"></span>

### 4. Repeated references: counters and review rows

The book uses repeated zeros to show why sharing an **immutable** object is harmless when one counter is updated:

```python
counters = [0] * 3       # one study counter per selected rider
counters[1] += 1         # record one review of Fabio's entry
print(counters)
```

```text
[0, 1, 0]
```

`+= 1` computes a new integer and rebinds **only cell 1**; the other cells still refer to zero. Repeating a **mutable** inner list is different:

```python
shared_rows = [[False]] * 3
shared_rows[0][0] = True
print(shared_rows)

separate_rows = [[False] for _ in range(3)]
separate_rows[0][0] = True
print(separate_rows)
```

```text
[[True], [True], [True]]
[[True], [False], [False]]
```

The Boolean values are worksheet review flags, not official rider statuses. In `shared_rows`, all three cells refer to **one inner list**, so one edit appears in every row. The comprehension creates three distinct inner lists. **Why this example?** It explains why `[0] * 3` works for counters while `[[False]] * 3` surprises people. **How to solve it:** ask whether the repeated element can be mutated; if it can and rows must be independent, create each row separately.

<span id="part-2-extend"></span>

### 5. `extend` adds references to existing objects

`extend` adds one outer-list cell for each supplied element; it does **not** clone the supplied objects:

```python
marc = {"rider": "Marc Márquez", "team": "Ducati Lenovo Team", "reviewed": False}
fabio = {"rider": "Fabio Quartararo", "team": "Monster Energy Yamaha MotoGP Team", "reviewed": False}

watchlist = [marc]
additional = [fabio]
watchlist.extend(additional)
print(watchlist[1] is additional[0])

additional[0]["reviewed"] = True
print(watchlist[1]["reviewed"])
```

```text
True
True
```

**Why this example?** A notebook often grows from one focus rider to two, and the shared `reviewed` flag proves that `extend` copied a reference rather than a rider dictionary. **How to solve it:** after `extend`, compare the two element references with `is`; if later edits must be independent, copy the mutable records before adding them.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 5.2.2 — Compact Arrays in Python

A **compact array** holds each element's value directly in its fixed-width cell. A referential list holds references in its cells, with Python value objects elsewhere. The book uses character storage in a string as one compact example; its two-byte diagram is the stated model discussed above. For our numeric lap times, Python's `array` module provides a concrete compact sequence. A numeric cell cannot hold an arbitrary rider dictionary or team name.

<span id="part-3-compact"></span>

### 1. Direct values versus references

```text
Same three lap values in a conceptual model:

Compact numeric cells:  [ 89,426 ][ 89,558 ][ 88,725 ]

Referential cells:      [   ref  ][   ref  ][   ref  ]
                            |          |          |
Python int objects:       89,426     89,558     88,725
```

In a **hypothetical** model with 4-byte numeric cells and 8-byte references, three compact values use `3 × 4 = 12` bytes of **element data**. Three reference cells use `3 × 8 = 24` bytes **before** counting separate integer objects and container overhead. These are arithmetic examples, not measured sizes for a Python runtime. Compact values also sit adjacent in memory, which can improve locality during a scan; a particular program is not guaranteed to run faster solely because it uses a compact array.

**Why this example?** We already know the three lap values, so only the storage method changes. **How to solve a storage comparison:** state the assumed width of each kind of cell, multiply by the number of elements, and be clear about which overhead is excluded.

<span id="part-3-array"></span>

### 2. Store lap milliseconds with `array.array`

Python's [`array` module](https://docs.python.org/3/library/array.html) offers compact arrays whose **type code** restricts the kind of element. We use signed C `long` (`"l"`) for the millisecond values. Its documented minimum size is four bytes, enough for these 89,000-range values; the actual width is platform-dependent.

```python
from array import array

compact_laps = array("l", [89_426, 89_558, 88_725])
print(compact_laps.tolist())
print(compact_laps[1] - compact_laps[0])
print(compact_laps.typecode)
```

```text
[89426, 89558, 88725]
132
l
```

`compact_laps.itemsize` is the bytes per stored value **on your machine**. For example, run `print(compact_laps.itemsize)` and calculate `len(compact_laps) * compact_laps.itemsize` to find the bytes used by the stored numeric items; do not assume the result is always `12`. The array object has additional overhead.

| Type code | Cell kind in the book's table | Example use |
| :--- | :--- | :--- |
| `"b"`, `"B"` | Signed or unsigned small integer | Small counters, if values fit |
| `"h"`, `"H"`, `"i"`, `"I"`, `"l"`, `"L"` | Integer families with different C widths | Milliseconds when the chosen range fits |
| `"f"`, `"d"` | Floating-point numbers | Measurements that require fractional values |

The book's `"i"` is a signed C `int` with a documented minimum of two bytes, which could be too small for `89_426`. The `"l"` code has a minimum of four bytes, enough for these values, although its actual width still varies by platform. The book also lists `"u"` for Unicode characters; [current Python documentation](https://docs.python.org/3/library/array.html) deprecates that code. For this lesson, a normal `str` is the clearer place for rider names.

**Why this example?** Integer milliseconds preserve the exact `132` ms subtraction, and the typed array shows what compact numeric storage looks like in real Python. **How to solve it:** choose a type code that fits the value range, create the array from numeric values, then use familiar indexing to read or compare them. A numeric `array("l")` will reject a rider name because it is not an integer value.

<span id="part-3-memory"></span>

### 3. Measure the right kind of memory

`sys.getsizeof` reports the size **directly attributed to an object**. For a list, it does not recursively include the integer objects its cells refer to. Therefore, comparing only `getsizeof(a_list)` with `getsizeof(an_array)` is not a complete comparison of the memory used by the values.

```python
from array import array
from sys import getsizeof

lap_list = [89_426, 89_558, 88_725]
lap_array = array("l", lap_list)

print("Compact item bytes:", len(lap_array) * lap_array.itemsize)
print("List object bytes:", getsizeof(lap_list))
print("Array object bytes:", getsizeof(lap_array))
```

The exact numbers depend on the Python implementation and machine. The first line counts the compact array's **item data**; the other lines report the two container objects' directly attributed sizes. The list's printed size omits its referenced integer objects, as the [Python `getsizeof` documentation](https://docs.python.org/3/library/sys.html#sys.getsizeof) explains. With only three values, fixed container overhead can dominate the comparison. The PDF's one-million-integer discussion mixes 64-bit values with a four-byte calculation, so its exact byte totals should not be reused as general facts. A 64-bit raw value itself needs eight bytes.

**Why this example?** It prevents a common mistake: using one convenient size number as though it measured an entire object graph. **How to solve a memory question:** say whether you mean item payload, container storage, or the whole graph of referenced objects, and report platform measurements only with that scope. The book mentions `ctypes` for lower-level compact records with multiple fields; our typed lap array needs only one numeric field per cell.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Worked Practice Notebook

We will keep each rider's name, team, and official place in a referential list of records, then keep the three numeric best laps in a compact array. The two collections use the **same selected order**. A separate trial copy receives a study note without changing the original records.

<span id="part-4-steps"></span>

### 1. Solve the storage and comparison task

1. Put Marc, Fabio, and Raúl at indices `0`, `1`, `2` in the record list. Keep their official places `5`, `7`, `1` as data, not as indices.
2. Convert their official best laps to `89_426`, `89_558`, and `88_725` milliseconds and create an `array("l")` in that same order.
3. Use the index to join a rider record to its lap value. `min` finds the session leader's `88_725` ms because Raúl is included.
4. Subtract `89_426` from `89_558` for Fabio's `132` ms best-lap difference from Marc.
5. Slice the first two record references, then use `deepcopy` for a trial that needs independent mutable note fields.

**Why this example?** It puts the section's two storage methods to work on the same verified session. **How to solve it:** align the indices first, choose reference storage for varied records and compact storage for uniform numbers, and copy the mutable records before adding trial annotations.

<span id="part-4-program"></span>

### 2. Run and trace the program

Save this standalone program as `practice_low_level_arrays.py` and run it with Python 3:

```python
from array import array
from copy import deepcopy

# Indonesian GP MotoGP Practice, Friday 9 October 2026.
# The selected order is Marc, Fabio, Raúl; official places are separate data.
records = [
    {"rider": "Marc Márquez", "team": "Ducati Lenovo Team", "place": 5, "note": None},
    {"rider": "Fabio Quartararo", "team": "Monster Energy Yamaha MotoGP Team", "place": 7, "note": None},
    {"rider": "Raúl Fernández", "team": "SuperFile Trackhouse MotoGP Team", "place": 1, "note": None},
]
lap_ms = array("l", [89_426, 89_558, 88_725])

fastest_ms = min(lap_ms)
print("Computed best-lap gaps to Practice leader Raúl Fernández:")
for k, record in enumerate(records):
    gap_ms = lap_ms[k] - fastest_ms
    print("{} | {} | P{} | {:.3f} s | +{:.3f} s".format(
        record["rider"], record["team"], record["place"],
        lap_ms[k] / 1_000, gap_ms / 1_000
    ))

print("Fabio–Marc best-lap gap: {} ms".format(lap_ms[1] - lap_ms[0]))

shallow_pair = records[:2]
trial_pair = deepcopy(shallow_pair)
trial_pair[0]["note"] = "focus rider"  # our notebook note, not session data
print("Shallow slice shares Marc record:", shallow_pair[0] is records[0])
print("Trial shares Marc record:", trial_pair[0] is records[0])
print("Original Marc note:", records[0]["note"])
print("Trial Marc note:", trial_pair[0]["note"])
```

```text
Computed best-lap gaps to Practice leader Raúl Fernández:
Marc Márquez | Ducati Lenovo Team | P5 | 89.426 s | +0.701 s
Fabio Quartararo | Monster Energy Yamaha MotoGP Team | P7 | 89.558 s | +0.833 s
Raúl Fernández | SuperFile Trackhouse MotoGP Team | P1 | 88.725 s | +0.000 s
Fabio–Marc best-lap gap: 132 ms
Shallow slice shares Marc record: True
Trial shares Marc record: False
Original Marc note: None
Trial Marc note: focus rider
```

| Selected index `k` | Rider | Official place | Compact lap value | Gap from Raúl's `88_725` ms |
| ---: | :--- | ---: | ---: | ---: |
| `0` | Marc | P5 | `89_426` | `701` ms |
| `1` | Fabio | P7 | `89_558` | `833` ms |
| `2` | Raúl | P1 | `88_725` | `0` ms |

The `True` for the shallow pair means its Marc cell refers to the original record. The `False` for the trial means `deepcopy` made a separate mutable record. The program prints total seconds (`89.426 s`) for calculation; the official timing format for the same value is `1:29.426`. All three places and lap values remain the verified Practice results.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 5.2 idea | Plain-language meaning | Practice example |
| :--- | :--- | :--- |
| Byte address | Location of one byte in the memory model | Fabio's invented 4-byte cell begins at `1004` when the base is `1000` |
| Fixed-width cells | Each cell has the same width, so an index gives an address by arithmetic | `base + width × k` locates index `1` directly |
| Referential array | Cells hold references to objects stored elsewhere | A list holds Marc's and Fabio's different-length name/team records |
| Shallow slice | New outer cells can still share the original elements | `records[:2][0] is records[0]` is `True` |
| Mutation versus rebinding | An edit to a shared object is visible through both lists; replacing one list cell is local | A shared `reviewed` flag changes; replacing `pair[1]` leaves `lap_ms` unchanged |
| Repetition and `extend` | These can place the same object reference in multiple cells | `[[False]] * 3` shares one row; `extend` shares Fabio's record |
| Compact array | Store uniform primitive values directly | `array("l", [89_426, 89_558, 88_725])` holds the numeric lap times |
| Memory measurement | Separate item bytes, container bytes, and referenced objects | `itemsize` describes the compact value width; `getsizeof(list)` omits its int objects |

The address diagrams are models, while the rider, team, position, and lap-time facts come from the cited 2026 Practice results. Section 5.3 continues with how array-backed sequences grow and shrink.

[🔝 Back to Top](#top)
