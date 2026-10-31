<span id="top"></span>

# 5.2 Low-Level Arrays — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.2, printed pages 185–191 (the supplied PDF).<br>
> **Topic:** 5.2 Low-Level Arrays; 5.2.1 Referential Arrays; 5.2.2 Compact Arrays in Python.<br>
> **Domain Focus:** Four rectangular display cards, their width and height measurements, and their areas in square centimetres.<br>
> **User Prompt:** Reexplain [`Section 5.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Board](#background)
   - [1. Keep one set of measurements](#background-cards)
   - [2. A position is not a memory address](#background-positions)
2. [Part 1: 5.2 Low-Level Arrays](#part-1)
   - [1. Bits, bytes, addresses, and RAM](#part-1-memory)
   - [2. Contiguous, equal-size cells](#part-1-cells)
   - [3. Calculate a cell's address](#part-1-address)
   - [4. Read the book's string diagram as a model](#part-1-string)
3. [Part 2: 5.2.1 Referential Arrays](#part-2)
   - [1. Store references when objects differ in size](#part-2-references)
   - [2. Slices and list copies share elements](#part-2-slices)
   - [3. Repeated references and `extend`](#part-2-repeat-extend)
   - [4. Copy nested mutable measurements independently](#part-2-deepcopy)
4. [Part 3: 5.2.2 Compact Arrays in Python](#part-3)
   - [1. Store the data directly](#part-3-compact)
   - [2. Use `array.array` and a type code](#part-3-array)
   - [3. Compare memory without guessing a universal byte count](#part-3-memory)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. The complete program](#part-4-program)
   - [2. Trace its result](#part-4-trace)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Board

<span id="background-cards"></span>

### 1. Keep one set of measurements

Continue the four-card board from the [Section 5.1 guide](05-01-python-sequence-types.md). Each card is a rectangle, so **area = width × height**.

| Position | Card | Width | Height | Area |
| -------: | :--- | ----: | -----: | ---: |
| `0` | `A` | 2 cm | 3 cm | 6 cm² |
| `1` | `B` | 4 cm | 2 cm | 8 cm² |
| `2` | `C` | 4 cm | 4 cm | 16 cm² |
| `3` | `D` | 2 cm | 2 cm | 4 cm² |

Their total card area is **6 + 8 + 16 + 4 = 34 cm²**. As before, this sums the four individual card areas; it does not assume the cards form a larger rectangle without gaps or overlaps.

We will follow these same values through two storage ideas:

```text
Card areas in order:        6       8       16       4
Sequence positions:         0       1        2       3
```

<span id="background-positions"></span>

### 2. A position is not a memory address

**Position `2`** means the third card in our sequence, card `C`. A **memory address** identifies a byte in the computer's memory. They are different numbers. An array's layout lets the computer calculate which address corresponds to a position.

For example, imagine—not as a claim about actual Python memory—that four area values occupy equal-size cells starting at address `1000`. If each cell takes **4 bytes**, the cells begin at addresses `1000`, `1004`, `1008`, and `1012`. The third value, `16`, starts at `1008`. The address calculation will be explained in Part 1.

> **Mental model:** An index tells us **which item** we want. The array's starting address and cell width tell the computer **where that item's cell begins**.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 5.2 Low-Level Arrays

The section first moves below Python's familiar `seq[k]` notation. It explains how memory is numbered and why an array can find a cell directly from an index.

<span id="part-1-memory"></span>

### 1. Bits, bytes, addresses, and RAM

A **bit** is one binary digit, either `0` or `1`. A **byte** is 8 bits. Memory contains many bytes, and each byte has a numbered **address** so the computer can locate it. Addresses are often drawn in consecutive order, like `1000`, `1001`, `1002`, and so on.

The book describes main memory as **random access memory (RAM)**: in the idealized model used for analysis, a particular byte can be read or written by its address in **O(1)** time. “Random access” means we may choose a location directly; it does not mean that the computer picks a random location. Real timing can also be affected by caches and other hardware details.

| Term | Simple meaning | Card-board analogy |
| :--- | :------------- | :----------------- |
| Bit | One `0` or `1` | A tiny piece of stored information. |
| Byte | Eight bits | A numbered unit of memory. |
| Address | A number identifying a byte | A location number, separate from card position. |
| RAM access | Access a chosen address directly | Ask for the bytes holding card `C`'s stored value. |

<span id="part-1-cells"></span>

### 2. Contiguous, equal-size cells

An **array** uses a consecutive region of memory for a sequence of **cells**. Every cell has the same width in bytes. A cell may occupy more than one byte: four cells of 4 bytes each need 16 consecutive bytes.

Why require equal-size cells? With a fixed width, the computer can skip exactly `k` cells to reach index `k`. If every cell had an unpredictable width, the starting address alone would not tell us where the third or fourth cell begins.

Our conceptual compact area array looks like this:

```text
Index:          0       1       2       3
Value:         [6]     [8]     [16]    [4]
Start address: 1000    1004    1008    1012
```

This drawing assumes **4 bytes per area value** for the calculation. It is a teaching model, not a report of the addresses or storage width chosen by a Python `list`.

<span id="part-1-address"></span>

### 3. Calculate a cell's address

If `start` is the first cell's address, `cell_size` is the number of bytes per cell, and `k` is the zero-based index, then:

```text
address of cell k = start + cell_size × k
```

With `start = 1000` and `cell_size = 4`, the board's four area cells are:

| Card | Index `k` | Calculation | Cell's first byte | Bytes occupied |
| :--- | --------: | :---------- | ----------------: | :------------- |
| `A` | `0` | `1000 + 4 × 0` | `1000` | `1000–1003` |
| `B` | `1` | `1000 + 4 × 1` | `1004` | `1004–1007` |
| `C` | `2` | `1000 + 4 × 2` | `1008` | `1008–1011` |
| `D` | `3` | `1000 + 4 × 3` | `1012` | `1012–1015` |

For card `C`, the arithmetic is **1000 + 4 × 2 = 1008**. A fixed amount of address arithmetic locates one cell, so indexed access to a fixed-width array is **O(1)** in this model. Reading *all* four areas to sum them still requires visiting all four cells; for `n` cards, that scan takes O(n) work.

<span id="part-1-string"></span>

### 4. Read the book's string diagram as a model

The book uses the string `SAMPLE` to show the same formula. Its figure assumes **2 bytes per character** and a starting address of `2146`. The character at index `4` is `L`, and its modeled address is **2146 + 2 × 4 = 2154**.

This is a clear example of fixed-width cell arithmetic. The book's two-byte assumption is **not a universal rule for current Python strings**: modern CPython uses flexible internal character widths. The [Python Unicode representation specification](https://peps.python.org/pep-0393/) explains that implementation detail. Our four-byte area example is likewise an explicit model, not a claim about every Python runtime.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 5.2.1 Referential Arrays

The book next asks how an array can hold elements of very different sizes while keeping its cells equally wide. It explains lists and tuples with **references to objects** in their cells. The reference cells are equal-size; the objects they point to can live elsewhere and have different sizes. The [CPython list FAQ](https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython) confirms this contiguous array of references for CPython lists; other Python implementations may choose different internal layouts.

<span id="part-2-references"></span>

### 1. Store references when objects differ in size

Our card labels and measurements have different forms: `"A"` is short text, `(2, 3)` is a pair, and a full card record might contain even more information. A list can still hold them because each list cell holds a **reference**, not the complete object in that cell.

```text
Referential list cells:   [ref A] [ref B] [ref C] [ref D]
                             |       |       |       |
Objects elsewhere:         card A  card B  card C  card D
```

If the reference cells were 8 bytes each in a hypothetical machine, the four cells could start at `2000`, `2008`, `2016`, and `2024`. The cell for index `2` starts at `2000 + 8 × 2 = 2016`. Its reference then leads to the object for card `C`. **The consecutive cells contain references; the card objects themselves need not be consecutive.** The precise reference width and addresses depend on the implementation.

The book's hospital example uses `None` to mark an empty bed. On our board, `None` could similarly mark a card position whose measurements have not been entered:

```python
card_slots = [[2, 3], None, [4, 4], [2, 2]]
card_slots[1]  # None: card B's measurements are temporarily absent
```

The list still has four indexed positions. Before multiplying dimensions, a program would need to check whether the chosen entry is `None`.

<span id="part-2-slices"></span>

### 2. Slices and list copies share elements

A list slice creates a **new outer list**, but its cells refer to the **same element objects** as the corresponding cells of the old list. `list(existing_list)` also makes this kind of **shallow copy**. This explains both of the following behaviors.

First, area numbers are immutable. Replacing a cell in a sliced list does not change the old list's cell:

```python
areas = [6, 8, 16, 4]
top_areas = areas[:2]
top_areas[0] = 15
print(top_areas)  # [15, 8]
print(areas)      # [6, 8, 16, 4]
```

The value `15` is a trial area value; we have not changed the stored dimensions here. Assignment makes `top_areas[0]` refer to a different integer; it does not change the integer `6` or the original list cell.

For a visible sharing effect, use **mutable inner lists** for dimensions. In Section 5.1 we kept each pair as a tuple; here we temporarily use a list pair so we can edit a measurement:

```python
dimensions = [[2, 3], [4, 2], [4, 4], [2, 2]]
top_cards = dimensions[:2]
top_cards[0][0] = 5
print(dimensions[0])  # [5, 3]
```

The two outer lists are different, but `top_cards[0]` and `dimensions[0]` are the **same inner list**. Editing that shared list changes card `A`'s stored width from 2 to 5 cm, so its recalculated area would be **5 × 3 = 15 cm²**. This is a separate trial; the later examples restore the original `2 × 3` card.

<span id="part-2-repeat-extend"></span>

### 3. Repeated references and `extend`

The book uses `counters = [0] * 8` to demonstrate repetition. For our four cards, we can begin with one zero counter per position:

```python
counters = [0] * 4
counters[2] += 1
print(counters)  # [0, 0, 1, 0]
```

The repeated cells initially reference the same immutable zero object. `counters[2] += 1` computes a new integer and replaces **only cell 2** with a reference to it. The other three counters remain zero.

Repetition is different when the repeated element is mutable. This is a common mistake when preparing two blank board rows:

```python
rows = [[0, 0]] * 2
rows[0][0] = 6
print(rows)  # [[6, 0], [6, 0]]: both positions share one row
```

To create two independent rows, make each row separately:

```python
rows = [[0, 0] for _ in range(2)]
rows[0][0] = 6
print(rows)  # [[6, 0], [0, 0]]
```

The book also shows that `extend` appends **references to existing elements**, not independent copies of those elements. Here we add the bottom-row cards to a list of top-row cards:

```python
cards = [[2, 3], [4, 2]]
bottom = [[4, 4], [2, 2]]
cards.extend(bottom)
bottom[0][0] = 5
print(cards[2])  # [5, 4]: card C's shared dimensions changed
```

This trial would make card `C`'s area **5 × 4 = 20 cm²**. `extend` adds new cells to `cards`, but the cell for `C` still points to the same mutable list as `bottom[0]`. The complete program later starts again with the original measurements.

<span id="part-2-deepcopy"></span>

### 4. Copy nested mutable measurements independently

If we need a working set of card dimensions that can be edited without changing the originals, a shallow outer copy is insufficient. The `copy` module provides [`deepcopy`](https://docs.python.org/3/library/copy.html), which recursively copies the nested mutable lists in this example:

```python
from copy import deepcopy

dimensions = [[2, 3], [4, 2], [4, 4], [2, 2]]
trial = deepcopy(dimensions)
trial[0][0] = 5
print(dimensions[0])  # [2, 3]
print(trial[0])       # [5, 3]
```

For these four card records, the original and trial can now hold different measurements. `deepcopy` does not promise a physically separate copy of every immutable value; what matters here is that the mutable inner lists are independent.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 5.2.2 Compact Arrays in Python

A **compact array** stores each element's primary data directly in its array cells. A **referential array** stores references in its cells and keeps the element objects elsewhere. The book's string diagram illustrates compact character storage; Python's `array` module supplies compact arrays for selected primitive types.

<span id="part-3-compact"></span>

### 1. Store the data directly

Compare two conceptual ways to keep the same four card areas:

```text
Compact cells:       [ 6 ][ 8 ][ 16 ][ 4 ]

Referential cells:   [ → ][ → ][  → ][ → ]
                       |    |     |    |
Separate objects:      6    8    16    4
```

The compact form can use less memory because it does not need reference cells **plus** separately stored Python number objects for the values it references. Several list cells may share one object, as the earlier zero-counter example shows. Compact numeric values are also adjacent in memory, which can help a computer's cache when a program scans them. These are reasons compact arrays can be useful; they are not a guarantee that every individual operation will be faster on every machine.

For a stated **model** with 4-byte area values and 8-byte references, the four compact values need **4 × 4 = 16 bytes of element data**. Four reference cells alone need **4 × 8 = 32 bytes**, before counting their separate number objects or container overhead. Those widths are assumptions for the example, not universal measurements of a Python list.

<span id="part-3-array"></span>

### 2. Use `array.array` and a type code

The [`array` module](https://docs.python.org/3/library/array.html) provides a compact array class. Its constructor begins with a **type code** describing which kind of values its cells can store:

```python
from array import array

areas = array("i", [6, 8, 16, 4])  # "i" means signed C integers
print(areas[2])       # 16
print(areas.tolist())  # [6, 8, 16, 4]
print(areas.itemsize)  # bytes per stored item on this machine
```

The actual `itemsize` of `"i"` depends on the platform's C integer representation. For decimal measurements such as 2.5 cm, a floating-point type code such as `"d"` may be appropriate. A compact `array("i")` accepts supported integer values; it cannot hold an arbitrary tuple, card object, or text label in one cell.

The book's Table 5.1 groups type codes by underlying C data type. We only need a few to understand the choice:

| Type codes from the book | Kind of cell data | Geometry use |
| :----------------------- | :---------------- | :----------- |
| `b`, `B` | Signed or unsigned small integers | Small whole-number counts. |
| `h`, `H`, `i`, `I`, `l`, `L` | Signed or unsigned integer families | Whole-number widths or areas. |
| `f`, `d` | Floating-point numbers | Measurements that may have fractional centimetres. |
| `u` | Unicode characters | Text rather than numeric area values. |

The exact widths depend on the C types on the machine, so check an array's `itemsize` rather than assuming a byte count from the table. The book's `u` entry is historical; [current Python documentation](https://docs.python.org/3/library/array.html) marks that type code as deprecated. The book points to `ctypes` for lower-level compact records of custom structures; that is beyond this card-area example.

<span id="part-3-memory"></span>

### 3. Compare memory without guessing a universal byte count

`len(areas) * areas.itemsize` gives the bytes needed for the **stored items** in an `array.array` instance. It does not include all container overhead. `sys.getsizeof` reports bytes directly attributed to an object, but it does **not** recursively add the sizes of objects referenced by a list. Therefore, a direct comparison of `getsizeof(a_list)` and `getsizeof(an_array)` is not a complete total-memory comparison.

```python
from array import array
from sys import getsizeof

area_list = [6, 8, 16, 4]
compact_areas = array("i", area_list)

print(len(compact_areas) * compact_areas.itemsize)  # item data bytes
print(getsizeof(area_list))     # list's own directly attributed bytes
print(getsizeof(compact_areas)) # array object's directly attributed bytes
```

The displayed numbers depend on the Python implementation and machine. With only four values, fixed container overhead can even make the compact array object's `getsizeof` value larger than the list object's value; the latter still omits the referenced integer objects. The [Python `getsizeof` documentation](https://docs.python.org/3/library/sys.html#sys.getsizeof) explains its scope.

**Reading note for the PDF:** Its one-million-integer discussion calls the values 64-bit, then compares per-value storage with 4 bytes. Those are different widths: a true 64-bit value needs **8 bytes**, so one million such raw values need **8,000,000 bytes** before container overhead. The PDF's object-size figures were measured on its system and should not be treated as current Python constants. The reliable lesson is the difference between direct fixed-width data and references plus separately stored objects.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This program calculates the same four card areas, stores the areas in a compact integer array, and tests how a shallow slice differs from an independent copy of the dimension records.

<span id="part-4-program"></span>

### 1. The complete program

```python
from array import array
from copy import deepcopy

labels = "ABCD"
dimensions = [[2, 3], [4, 2], [4, 4], [2, 2]]
areas = array("i", [width * height for width, height in dimensions])

top_row = dimensions[:2]      # new outer list, shared inner lists
trial_row = deepcopy(top_row)  # independent inner lists for this trial
trial_row[0][0] = 5

for k in range(len(labels)):
    width, height = dimensions[k]
    print("{}: {} x {} = {} cm^2".format(labels[k], width, height, areas[k]))

print("Areas:", areas.tolist())
print("Total area: {} cm^2".format(sum(areas)))
print("Top slice shares card A:", top_row[0] is dimensions[0])
print("Original A dimensions:", dimensions[0])
print("Trial A dimensions:", trial_row[0])
print("Trial A area: {} cm^2".format(trial_row[0][0] * trial_row[0][1]))
```

The list comprehension computes one area from each width-height pair. The `array("i", ...)` stores those whole-number areas in fixed-width numeric cells. `top_row` is a shallow slice, so its first element is the same mutable list as `dimensions[0]`. `deepcopy` makes the trial's inner lists independent, allowing the new width of 5 cm without changing the original card `A`.

<span id="part-4-trace"></span>

### 2. Trace its result

| Index | Card | Original dimensions | Area | Running total |
| ----: | :--- | :------------------ | ---: | ------------: |
| `0` | `A` | `[2, 3]` | 6 cm² | 6 cm² |
| `1` | `B` | `[4, 2]` | 8 cm² | 14 cm² |
| `2` | `C` | `[4, 4]` | 16 cm² | 30 cm² |
| `3` | `D` | `[2, 2]` | 4 cm² | 34 cm² |

The program prints:

```text
A: 2 x 3 = 6 cm^2
B: 4 x 2 = 8 cm^2
C: 4 x 4 = 16 cm^2
D: 2 x 2 = 4 cm^2
Areas: [6, 8, 16, 4]
Total area: 34 cm^2
Top slice shares card A: True
Original A dimensions: [2, 3]
Trial A dimensions: [5, 3]
Trial A area: 15 cm^2
```

The `True` comes from two list positions referring to the **same inner list**; it does not rely on a particular numeric memory address. The trial area is separate from the unchanged original total of 34 cm².

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Where does card C's area cell begin?</strong></summary>

**Scenario:** Use the hypothetical compact layout with `start = 1000`, `cell_size = 4` bytes, and card `C` at index `2`.

**Calculation:** `1000 + 4 × 2 = 1008`.

**Result:** The cell begins at byte address `1008` and occupies `1008–1011`. This is an address-model exercise, not a claim about where a real Python object is stored.

</details>

<details>
<summary><strong>Case Study 2: Why did changing a sliced card change the original?</strong></summary>

**Scenario:** `dimensions = [[2, 3], [4, 2], [4, 4], [2, 2]]` and `top = dimensions[:2]`.

**Problem:** `top[0][0] = 5` also makes `dimensions[0][0]` equal `5`.

**Reason:** The slice made a new outer list, but both lists still refer to card `A`'s same mutable dimension list.

**Fix:** Use `deepcopy(dimensions[:2])` when the trial must have independent nested measurements. The original `A` can then remain `2 × 3 = 6 cm²` while the trial becomes `5 × 3 = 15 cm²`.

</details>

<details>
<summary><strong>Case Study 3: Why is `[0] * 4` safe while `[[0, 0]] * 2` is surprising?</strong></summary>

**Scenario:** Start four card counters at zero, then separately try to start two blank rows.

**Problem:** `counters = [0] * 4` followed by `counters[2] += 1` changes only card `C`'s counter. But `rows = [[0, 0]] * 2` followed by `rows[0][0] = 6` changes both apparent rows.

**Reason:** Integers are immutable, so the counter operation replaces one reference. The two row positions refer to one mutable inner list.

**Fix:** Build independent rows with `[[0, 0] for _ in range(2)]`.

</details>

<details>
<summary><strong>Case Study 4: Did `extend` duplicate the bottom-row cards?</strong></summary>

**Scenario:** `cards = [[2, 3], [4, 2]]`, `bottom = [[4, 4], [2, 2]]`, and `cards.extend(bottom)`.

**Problem:** An edit to `bottom[0][0]` also appears in `cards[2][0]`.

**Reason:** `extend` added references to the existing inner card lists. It did not clone the card records.

**Result:** If the width becomes 5 cm, both names see card `C` as `[5, 4]`, with trial area `20 cm²`.

</details>

<details>
<summary><strong>Case Study 5: Which storage fits the four numeric areas?</strong></summary>

**Scenario:** The areas are whole numbers `[6, 8, 16, 4]`, and we want compact numeric storage.

**Choice:** `array("i", [6, 8, 16, 4])` stores signed integer values. Its `itemsize` tells us this machine's bytes per item; multiplying by four gives the bytes for four stored values.

**Limit:** This typed array cannot store a card's whole `[width, height]` list or a label such as `"A"` in one `"i"` cell. A regular list can hold those objects by reference.

</details>

<details>
<summary><strong>Case Study 6: Does `getsizeof(area_list)` count every integer object?</strong></summary>

**Scenario:** We compare `area_list = [6, 8, 16, 4]` with `compact_areas = array("i", area_list)`.

**Problem:** `getsizeof(area_list)` measures the list's directly attributed storage, not the full graph of integer objects it references.

**Fix:** State exactly what each number measures. Use `compact_areas.itemsize` for the array's stored-item width, and do not present the two `getsizeof` calls alone as a complete memory comparison.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 5.2 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Byte and address** | Memory is divided into numbered bytes. | Position `2` is card `C`; a modeled byte address for its area cell is `1008`. |
| **RAM access** | A chosen address can be accessed directly in the idealized O(1) model. | Find one known area cell without scanning earlier cells. |
| **Array cell** | Equal-size cells occupy consecutive memory. | Four modeled 4-byte areas fill bytes `1000–1015`. |
| **Address formula** | `start + cell_size × index` locates a cell. | Card `C`: `1000 + 4 × 2 = 1008`. |
| **Referential array** | Cells hold references to objects that may be elsewhere. | A list's cells point to four card-dimension records. |
| **Shallow copy** | New outer cells can still point to the same mutable elements. | `dimensions[:2]` shares the inner list for card `A`. |
| **Repetition and `extend`** | These operations can place additional references to existing objects. | `[[0, 0]] * 2` shares one row; `cards.extend(bottom)` shares card records. |
| **Compact array** | Fixed-type values live directly in array cells. | `array("i", [6, 8, 16, 4])` stores whole-number areas. |
| **Type code and `itemsize`** | The code selects a C data type; `itemsize` reveals its width here. | `"i"` chooses signed integers for the card areas. |

The key question is **what each cell holds**: an object reference or the element's data. That choice explains the copying behavior, the memory layout, and the reason Python offers both flexible lists and typed compact arrays.

[🔝 Back to Top](#top)
