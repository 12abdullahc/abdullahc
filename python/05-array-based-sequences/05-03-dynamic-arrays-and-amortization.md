<span id="top"></span>

# 5.3 Dynamic Arrays and Amortization — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.3, printed pages 192–201 (the supplied PDF).<br>
> **Topic:** 5.3 Dynamic Arrays and Amortization; 5.3.1 Implementing a Dynamic Array; 5.3.2 Amortized Analysis of Dynamic Arrays; 5.3.3 Python's List Class.<br>
> **Domain Focus:** Adding rectangular display cards one at a time while tracking their areas, list length, and reserved capacity.<br>
> **User Prompt:** Reexplain [`Section 5.3`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Growing Rectangle-Card Board](#background)
   - [1. Keep the card measurements connected](#background-cards)
   - [2. Separate length from capacity](#background-capacity)
2. [Part 1: 5.3 Dynamic Arrays and Amortization](#part-1)
   - [1. Why a fixed array cannot simply grow](#part-1-fixed)
   - [2. Why a Python list appears to grow smoothly](#part-1-list)
   - [3. Observe reserved space without assuming exact bytes](#part-1-experiment)
3. [Part 2: 5.3.1 Implementing a Dynamic Array](#part-2)
   - [1. Copy into a larger array when full](#part-2-resize)
   - [2. Trace the first nine card areas](#part-2-trace)
   - [3. Read the simplified class design](#part-2-class)
4. [Part 3: 5.3.2 Amortized Analysis of Dynamic Arrays](#part-3)
   - [1. One costly append versus a cheap series](#part-3-distinction)
   - [2. Add the copy costs for doubling](#part-3-sum)
   - [3. Pay for expensive appends with saved credits](#part-3-credits)
   - [4. Compare geometric growth with fixed increments](#part-3-growth)
   - [5. Consider removals and shrinking](#part-3-shrinking)
5. [Part 4: 5.3.3 Python's List Class](#part-4)
   - [1. Observe CPython's changing size](#part-4-size)
   - [2. Time a series of appends](#part-4-timing)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace its result](#part-5-results)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Growing Rectangle-Card Board

<span id="background-cards"></span>

### 1. Keep the card measurements connected

The [Section 5.1](05-01-python-sequence-types.md) and [Section 5.2](05-02-low-level-arrays.md) guides use four rectangle cards. We keep their dimensions and areas here:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

Their total card area is **6 + 8 + 16 + 4 = 34 cm²**. Imagine adding five more *physical* cards. Cards `E`, `F`, `G`, and `H` repeat the dimensions of `A`, `B`, `C`, and `D`; `I` repeats `A`. The nine area values, in insertion order, are:

```text
Card:  A  B   C  D  E  F   G  H  I
Area:  6  8  16  4  6  8  16  4  6    cm²
```

Each card gets one entry even if its dimensions match another card's. After all nine are added, the sum is **34 + 34 + 6 = 74 cm²**. This sum concerns the individual cards; no claim is made about a gap-free board layout.

<span id="background-capacity"></span>

### 2. Separate length from capacity

Suppose a sequence currently holds four card areas and has four storage cells. Its **length** is `4`, and its **capacity** is `4`. It is full. To add card `E`, the sequence needs room for a fifth value.

| Name | Meaning | Example after cards `A`–`D` |
| :--- | :------ | :--------------------------- |
| `n` or length | Number of card areas actually stored | `4` |
| capacity | Number of cells currently reserved | `4` |
| spare cells | `capacity − n` | `0` |

The invariant is **0 ≤ length ≤ capacity**. Reserved but unused cells are not entries in the sequence: when length is `4`, index `4` is not yet a valid card-area index, even if the storage has extra capacity. The section explains how a list can make room without changing the size of its existing low-level array.

> **Mental model:** The list that a programmer sees has a length. Its implementation may reserve more cells than that length so future `append` calls can use them.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 5.3 Dynamic Arrays and Amortization

<span id="part-1-fixed"></span>

### 1. Why a fixed array cannot simply grow

The [Section 5.2 guide](05-02-low-level-arrays.md) showed a low-level array as consecutive, equal-size cells. The system must choose the size of that region when allocating it. Bytes immediately after the region may already be used for something else, so the system cannot assume it can extend the same region in place.

The book contrasts this with immutable `tuple` and `str` objects: their contents do not gain new positions after construction, so an underlying fixed-size allocation suits them. A `list` offers a different public behavior: we can repeatedly append elements. The internal solution is a **dynamic array**.

For our four original areas, think of an underlying array like this:

```text
Capacity 4:  [ 6 ][ 8 ][ 16 ][ 4 ]
Length 4:      A    B     C    D
```

There is no free cell for `E`. The implementation allocates a *new* larger region and copies the four existing entries. For a referential array, these are copies of **references** to card-area objects, not copies of the rectangle cards themselves.

<span id="part-1-list"></span>

### 2. Why a Python list appears to grow smoothly

Python lets us write a simple sequence of appends:

```python
areas = []
for area in (6, 8, 16, 4, 6):
    areas.append(area)
print(areas)  # [6, 8, 16, 4, 6]
```

The book explains that a list can have **more allocated capacity than its current length**. A normal append uses the next unused cell. In the book's resize model, an append to a full array allocates a larger backing array, copies the existing references, and then inserts the new one. From the program's view, `append` still has the same public meaning. A real runtime may sometimes extend an allocation in place, so the model does not prescribe every physical memory move.

The exact capacity choices for Python's real `list` are implementation details. The doubling rule used later in this guide is the book's **analysis model**, not a promise that every Python list doubles at those exact lengths.

<span id="part-1-experiment"></span>

### 3. Observe reserved space without assuming exact bytes

The book appends `None` repeatedly and uses `sys.getsizeof` to observe list size. A small modern version of that experiment is:

```python
from sys import getsizeof

data = []
for _ in range(12):
    print(len(data), getsizeof(data))
    data.append(None)
```

Look for **plateaus** followed by **jumps**: several appends may leave the reported size unchanged, then one append causes a larger allocation. The book's experiment reported these values on its 64-bit machine:

| List length | Book's reported `getsizeof` | Inferred reference slots |
| ----------: | --------------------------: | -----------------------: |
| `0` | 72 bytes | 0 |
| `1–4` | 104 bytes | 4 |
| `5–8` | 136 bytes | 8 |
| `9–16` | 200 bytes | 16 |
| `17–25` | 272 bytes | 25 |

The inference assumes a **72-byte base** and **8 bytes per reference**: for example, `(272 − 72) ÷ 8 = 25` possible slots. The 25-slot step already shows why the book does not identify Python's real list policy with pure doubling. These are historical observations, not current or portable byte counts. `getsizeof(data)` reports storage directly attributed to the list, **not** the memory used by objects referenced by its elements. The [Python documentation](https://docs.python.org/3/library/sys.html#sys.getsizeof) makes this scope explicit. The observed bytes are evidence of reserved space, not a portable API for reading a list's exact capacity.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 5.3.1 Implementing a Dynamic Array

The book builds a simplified `DynamicArray` with length, capacity, and a reference to a fixed-length backing array. Its public examples are `append`, `len`, and indexed access. A private resize routine does the costly work when the backing array is full.

<span id="part-2-resize"></span>

### 1. Copy into a larger array when full

When length equals capacity, an append follows four steps:

1. Allocate a new array with larger capacity. In the book's worked strategy, make it **twice** the old capacity.
2. Copy the existing `n` references into the same positions of the new array.
3. Change the dynamic array's backing-array reference to the new array.
4. Write the new item at position `n`, then increase the length to `n + 1`.

For card `E` with area `6 cm²`:

```text
Old array, capacity 4: [ 6 ][ 8 ][ 16 ][ 4 ]
                          A    B     C    D

New array, capacity 8: [ 6 ][ 8 ][ 16 ][ 4 ][ 6 ][   ][   ][   ]
                          A    B     C    D    E   spare spare spare
```

The old four references are copied first, then `E` is inserted. The dynamic array now has **length 5**, **capacity 8**, and **3 spare cells**. The old backing array can later be reclaimed. Copying references preserves the element objects, so this resize does not itself duplicate the Python integers or card records.

<span id="part-2-trace"></span>

### 2. Trace the first nine card areas

Start with **capacity 1** and double only when a new append finds the array full. In this simplified cost model, count one unit for placing the new reference and one unit for each old reference copied during a resize.

| Append | Area added | Copies on this append | Capacity afterward | Spare cells afterward | Modeled work | Total card area |
| :----- | ---------: | --------------------: | -----------------: | --------------------: | -----------: | --------------: |
| `A` | 6 cm² | 0 | 1 | 0 | 1 | 6 cm² |
| `B` | 8 cm² | 1 | 2 | 0 | 2 | 14 cm² |
| `C` | 16 cm² | 2 | 4 | 1 | 3 | 30 cm² |
| `D` | 4 cm² | 0 | 4 | 0 | 1 | 34 cm² |
| `E` | 6 cm² | 4 | 8 | 3 | 5 | 40 cm² |
| `F` | 8 cm² | 0 | 8 | 2 | 1 | 48 cm² |
| `G` | 16 cm² | 0 | 8 | 1 | 1 | 64 cm² |
| `H` | 4 cm² | 0 | 8 | 0 | 1 | 68 cm² |
| `I` | 6 cm² | 8 | 16 | 7 | 9 | 74 cm² |

Adding the work column gives **24 units** for nine appends: **9 placements + (1 + 2 + 4 + 8) = 9 + 15 = 24**. The large costs at `E` and `I` are surrounded by cheap appends. Allocation and other bookkeeping also cost time; this unit count isolates the copied-reference pattern that drives the analysis.

<span id="part-2-class"></span>

### 3. Read the simplified class design

The book's implementation uses a fixed-length `ctypes` array of Python-object references. Its essential state can be read as:

| State | Purpose | Value after card `E` |
| :---- | :------ | -------------------: |
| `_n` | Number of stored areas | `5` |
| `_capacity` | Number of allocated reference cells | `8` |
| `_A` | The current backing array | An 8-cell array |

The append decision is short:

```text
if length == capacity:
    allocate a larger array and copy existing references
write the new area at index length
increase length by one
```

The full runnable class in Part 5 follows this structure. It is a teaching implementation with limited operations; it is not Python's built-in `list` or a compact numeric `array.array`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 5.3.2 Amortized Analysis of Dynamic Arrays

The book asks an important question: **Can a sequence of appends be efficient even though a few individual appends copy many elements?** Amortized analysis answers by accounting for the cost of the *whole sequence*.

<span id="part-3-distinction"></span>

### 1. One costly append versus a cheap series

If a full backing array contains `k` card areas, the next append must copy those `k` old references before placing the new one. That individual append costs **Θ(k)** in the simple copy model: its work grows in proportion to `k`. For example, appending `I` after `H` copies eight references and places one, a modeled cost of `9`.

Most appends do not resize. They place one reference in a spare cell, a constant amount of work. **Amortized O(1) per append** means that a series of `n` appends from empty takes **O(n) total time**. Here `O` gives an upper growth bound; the `Ω` notation used later gives a lower growth bound. Amortized O(1) does **not** say every single append has O(1) worst-case time, and it does not rely on appends being random.

<span id="part-3-sum"></span>

### 2. Add the copy costs for doubling

Starting with capacity 1, resize events copy **1, 2, 4, 8, ...** old references. These amounts form a geometric progression. In any first `n` appends, the largest copy is less than `n`, and the sum of all copies is less than `2n`:

```text
1 + 2 + 4 + ... + largest copied block < 2n
```

There are exactly `n` new-reference placements, one per append. In our model:

```text
total modeled work = n placements + fewer than 2n copies < 3n
```

For the nine-card trace, the copies total `1 + 2 + 4 + 8 = 15`, so the actual modeled work is `9 + 15 = 24`, below `3 × 9 = 27`. This gives the book's result: **n appends cost O(n) total, or O(1) amortized per append** under doubling. It says nothing about the geometric area of the cards; `n` counts sequence entries.

<span id="part-3-credits"></span>

### 3. Pay for expensive appends with saved credits

The book also gives an **accounting proof**. Imagine charging each append **3 credits** even when it only needs 1 credit to place the new area. Save the other 2 credits with that entry. When a resize later copies `k` existing entries, enough credits have accumulated since the previous resize to pay for those `k` copies.

For example, after capacity grows from 4 to 8 at card `E`, the later entries `E`, `F`, `G`, and `H` each carry 2 saved credits: **4 entries × 2 = 8 credits**. Appending `I` needs to copy eight old references. Those saved credits pay for the copies; the current append's charge pays for placing `I` and starts the next reserve. The exact credit story is an analysis tool, not money or extra fields stored by Python.

If allocation and other constant-factor work are included, the charge per append may need a different constant. The conclusion remains an **O(1) amortized** bound.

<span id="part-3-growth"></span>

### 4. Compare geometric growth with fixed increments

**Geometric growth** multiplies capacity by a factor greater than 1. Doubling uses factor `2`. The book notes that a smaller factor such as `1.25` can reduce unused space but causes more resize events and a larger constant in the amortized bound.

At capacity 8, appending the ninth card illustrates the tradeoff:

| Growth rule | New capacity after card `I` | Length | Spare cells |
| :---------- | --------------------------: | -----: | ----------: |
| Double capacity | 16 | 9 | 7 |
| Grow capacity by 25% | 10 | 9 | 1 |

Both are geometric strategies in this illustration. A smaller factor may save space at this point, but it must grow again sooner.

**Fixed-increment growth** adds the same number of cells every time. If we add only **one cell** on each overflow, the ninth append has already required copying `1 + 2 + ... + 8 = 36` old references. With 9 placements, that is **45 modeled work units**, compared with **24** for doubling. For `n` appends:

```text
copy work with increment 1 = 1 + 2 + ... + (n − 1)
                           = n(n − 1) / 2
total modeled work         = n + n(n − 1) / 2
                           = n(n + 1) / 2 = Θ(n²)
```

For any fixed positive increment `c`, there are about `n/c` resizes. If capacity starts at `c`, the copy sizes are `c, 2c, 3c, ...`; starting at 1 only shifts that pattern by a fixed amount. Their sum grows quadratically in `n` when `c` is fixed. The book states a **Ω(n²)** lower bound for this strategy; the simple copy model above also shows a matching O(n²) upper bound. The difference between multiplication and fixed addition in the capacity rule has a large effect on a long series of appends.

<span id="part-3-shrinking"></span>

### 5. Consider removals and shrinking

Doubling keeps capacity proportional to length while we only append, so storage is **O(n)** for `n` elements. After many removals, a dynamic array that never shrinks might retain a very large capacity for only a few cards.

Imagine capacity `16` after adding card `I`, then removing cards until only three remain. Without shrinking, **13 cells are spare**. The book discusses a possible rule: when length falls **below one-quarter of capacity**, allocate a backing array with **half** the old capacity and copy the remaining references. At length `3`, capacity `16` meets the trigger (`3 < 4`), so this rule would reduce capacity to `8`.

The one-quarter trigger leaves room between shrinking and the next growth event. For positive length, this model can keep capacity within a constant factor of length—at most four times as large—while retaining O(n) storage. Shrinking as soon as length falls to half could make alternating removals and appends repeatedly shrink and grow the array, causing expensive copying too often. This is a **proposed strategy** discussed in the section and exercises, not a claim about the exact policy of Python's `list`. An implementation also needs a small minimum capacity for an empty array.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 5.3.3 Python's List Class

The book returns to Python's built-in `list`. Its `getsizeof` experiment supports the dynamic-array explanation, but the observed capacity steps are **neither pure doubling nor a fixed increment**. Theoretical doubling is therefore a model for understanding amortization, not a transcription of Python's private growth formula. Current [CPython documentation](https://docs.python.org/3/faq/design.html#how-are-lists-implemented) likewise describes a variable-length array of references with extra space reserved on growth.

<span id="part-4-size"></span>

### 1. Observe CPython's changing size

When we append the four original areas and then card `E`, the list's visible length goes `0, 1, 2, 3, 4, 5` without exposing its capacity. The `getsizeof` experiment in Part 1 may show several unchanged byte counts followed by a jump. That is evidence of reserved storage, but exact numbers and capacity steps can change across Python versions and implementations.

Use the measured **list object size** to investigate the backing structure, not as the total memory cost of the card-area integers. The values `6`, `8`, `16`, and `4` are referenced objects and are excluded from the list's `getsizeof` result.

<span id="part-4-timing"></span>

### 2. Time a series of appends

A single append is so short that its timing is noisy. The book times a large series and divides by the number of appends. This version uses `perf_counter` to make the same kind of measurement:

```python
from time import perf_counter

def average_append_seconds(n):
    data = []
    start = perf_counter()
    for _ in range(n):
        data.append(None)
    elapsed = perf_counter() - start
    return elapsed / n

for n in (1_000, 10_000, 100_000):
    print(n, average_append_seconds(n))
```

The printed seconds vary by computer and run. The timed region includes loop overhead as well as `append`, and the last resize can affect a small sample. The book interprets repeated measurements across increasing `n` as evidence consistent with **amortized O(1)** append, even though some individual appends resize. The [Python time-complexity documentation](https://docs.python.org/3/builtins/time-complexity.html) also labels `list.append` as amortized O(1).

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

This runnable teaching class follows the book's `ctypes` approach. Its backing array has a fixed number of `py_object` reference cells. We only read cells already occupied by card areas. The class implements just `append`, `len`, and nonnegative indexing; Python's full `list` supports more operations.

<span id="part-5-program"></span>

### 1. The complete program

```python
import ctypes


class AreaArray:
    """A small dynamic array that stores references to card areas."""

    def __init__(self):
        self._n = 0
        self._capacity = 1
        self._A = self._make_array(self._capacity)
        self.copied_cells = 0

    def __len__(self):
        return self._n

    def __getitem__(self, k):
        if not 0 <= k < self._n:
            raise IndexError("invalid card-area index")
        return self._A[k]

    @property
    def capacity(self):
        return self._capacity

    def append(self, area):
        if self._n == self._capacity:
            self._resize(2 * self._capacity)
        self._A[self._n] = area
        self._n += 1

    def _resize(self, new_capacity):
        bigger = self._make_array(new_capacity)
        for k in range(self._n):
            bigger[k] = self._A[k]
            self.copied_cells += 1
        self._A = bigger
        self._capacity = new_capacity

    def _make_array(self, capacity):
        return (ctypes.py_object * capacity)()


cards = [
    ("A", 2, 3), ("B", 4, 2), ("C", 4, 4), ("D", 2, 2),
    ("E", 2, 3), ("F", 4, 2), ("G", 4, 4), ("H", 2, 2),
    ("I", 2, 3),
]
areas = AreaArray()

for label, width, height in cards:
    before = areas.copied_cells
    area = width * height
    areas.append(area)
    copied_now = areas.copied_cells - before
    print(
        "{}: area={} cm^2; n={}; capacity={}; copied={}".format(
            label, area, len(areas), areas.capacity, copied_now
        )
    )

total_area = sum(areas[k] for k in range(len(areas)))
print("Total card area: {} cm^2".format(total_area))
print("References copied during growth:", areas.copied_cells)
```

The `_resize` method allocates a larger fixed-length `ctypes` array, copies only the occupied references, then switches `_A` to it. It does not change the length; `append` places the new area and increases `_n`. The `copied_cells` counter makes the geometric series visible. The [Python `ctypes` documentation](https://docs.python.org/3/library/ctypes.html#arrays) describes fixed-length arrays, and [`py_object`](https://docs.python.org/3/library/ctypes.html#ctypes.py_object) represents Python-object references.

<span id="part-5-results"></span>

### 2. Trace its result

```text
A: area=6 cm^2; n=1; capacity=1; copied=0
B: area=8 cm^2; n=2; capacity=2; copied=1
C: area=16 cm^2; n=3; capacity=4; copied=2
D: area=4 cm^2; n=4; capacity=4; copied=0
E: area=6 cm^2; n=5; capacity=8; copied=4
F: area=8 cm^2; n=6; capacity=8; copied=0
G: area=16 cm^2; n=7; capacity=8; copied=0
H: area=4 cm^2; n=8; capacity=8; copied=0
I: area=6 cm^2; n=9; capacity=16; copied=8
Total card area: 74 cm^2
References copied during growth: 15
```

The output matches the trace in Part 2. Copy counts are **1 + 2 + 4 + 8 = 15**; adding nine new area entries gives **24 modeled units**. The program's `copied_cells` does not measure allocation time, interpreter overhead, or Python's own list policy.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What happens when card E is added to a full array?</strong></summary>

**Scenario:** Cards `A`–`D` occupy all four cells; their areas total `34 cm²`.

**Problem:** A fifth area cannot be placed in the existing four-cell backing array.

**Fix:** Allocate eight cells, copy the four existing references, then append `E`'s `2 × 3 = 6 cm²` area.

**Result:** Length `5`, capacity `8`, three spare cells, and total card area **40 cm²**. This append copies four old references; the next three appends need no resize.

</details>

<details>
<summary><strong>Case Study 2: Does the costly ninth append break O(1) amortized time?</strong></summary>

**Scenario:** After card `H`, length and capacity both equal `8`. Adding `I` copies eight references and places one new value.

**Problem:** That individual append uses **9 modeled work units**, much more than a no-resize append.

**Resolution:** Count the whole nine-append sequence: 9 placements and 15 copies make 24 units, below `3 × 9 = 27`. The bound concerns the series, so an occasional expensive append is included.

**Result:** O(1) *amortized* per append, while this one append has Θ(8) work in the model.

</details>

<details>
<summary><strong>Case Study 3: What if capacity grows by only one cell?</strong></summary>

**Scenario:** Begin with capacity 1 and add the nine card areas, increasing capacity by exactly one whenever full.

**Problem:** The appends copy `1 + 2 + ... + 8 = 36` old references. Adding nine placements gives **45 modeled work units**; doubling used **24**.

**Result:** For `n` card areas, the copy count is `n(n − 1)/2`, which grows quadratically. A fixed increment does not provide the same amortized O(1) bound.

</details>

<details>
<summary><strong>Case Study 4: Why choose a smaller geometric growth factor?</strong></summary>

**Scenario:** The array is full at capacity 8 before card `I` arrives.

**Choice:** Doubling grows to 16 cells, leaving 7 spare after `I`. Growing by 25% gives 10 cells, leaving 1 spare.

**Tradeoff:** The smaller increase uses less spare space at this point but will trigger another resize sooner. Both strategies can have O(1) amortized append when capacity grows geometrically.

</details>

<details>
<summary><strong>Case Study 5: Should the array keep 16 cells after most cards are removed?</strong></summary>

**Scenario:** Capacity is 16 after nine cards; removals leave only three.

**Problem:** Keeping capacity 16 leaves 13 unused cells. Repeating such growth and removal without shrinking can make storage large compared with the remaining card count.

**Possible rule:** When length falls below one-quarter of capacity, halve capacity. Here `3 < 16/4`, so a model using that rule could reduce capacity to 8. A carefully spaced shrink threshold avoids frequent grow-shrink oscillation.

</details>

<details>
<summary><strong>Case Study 6: Did a `getsizeof` jump reveal the exact Python list policy?</strong></summary>

**Scenario:** We append card areas to a built-in list and see the list object's reported bytes stay flat, then jump.

**Inference:** The jumps support the idea of reserved backing storage, but the byte counts depend on the runtime and include list metadata. They do not expose an official capacity value and do not include the referenced area objects.

**Result:** Use the book's doubling model to prove an amortized bound; use measured Python list sizes and timings as separate evidence about the actual implementation.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 5.3 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Length versus capacity** | Length counts stored items; capacity counts reserved cells. | After `E`, length is 5 and modeled capacity is 8. |
| **Dynamic array resize** | Allocate a larger array, copy occupied references, then switch backing arrays. | Appending `E` copies the four references for `A`–`D`. |
| **Doubling** | Capacity 1, 2, 4, 8, 16, ... leaves room for many cheap appends between resizes. | `I` causes 8 copies, but `F`–`H` caused none. |
| **Amortized analysis** | Bound total cost across a sequence, then divide by its operation count. | Nine appends use 24 modeled units, fewer than 3 per append on average. |
| **Geometric growth** | Multiply capacity by a factor above 1; smaller factors trade more resizes for less spare space. | At length 9, capacity 10 wastes less space than capacity 16. |
| **Fixed-increment growth** | Add the same number of cells every resize; copying accumulates quadratically. | Incrementing by 1 copies 36 references across nine appends. |
| **Shrinking** | Occasional reductions keep storage proportional after removals. | At length 3 and capacity 16, a quarter-full rule could shrink to 8. |
| **Python `list`** | A real list reserves space, but its private growth steps need not match doubling. | `getsizeof` shows jumps; long append runs support amortized O(1). |

The central idea is that **one expensive append can be part of an efficient sequence**. By reserving a proportional amount of extra room at each growth event, a dynamic array spreads copying work across many later appends.

[🔝 Back to Top](#top)
