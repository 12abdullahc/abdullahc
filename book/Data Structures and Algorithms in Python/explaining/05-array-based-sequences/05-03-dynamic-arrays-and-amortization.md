<span id="top"></span>

# Array-Based Sequences — Section 5.3: Dynamic Arrays and Amortization

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.3 (printed pages 192–201; [chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C05.pdf)).  
> **Topic:** Length and capacity; growing a dynamic array; amortized analysis; Python list behavior.  
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika. All named riders, teams, places, and laps below come from this one session.  
> **Learning goal:** Trace every resize, explain why a single expensive append can coexist with constant amortized append time, and distinguish the teaching array from a real Python list.  
> **User Prompt:** "Reexplain [Section 5.3] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Practice Log That Grows](#background-intuition)
   - [1. The verified session entries](#background-data)
   - [2. Length, capacity, and unused cells](#background-capacity)
2. [Part 1: Section 5.3 — Why a Dynamic Array Is Needed](#part-1)
   - [1. What happens when a fixed array fills?](#part-1-full)
   - [2. Observe list memory without guessing its capacity](#part-1-size)
3. [Part 2: Section 5.3.1 — Implementing a Dynamic Array](#part-2)
   - [1. The resize and append steps](#part-2-steps)
   - [2. Trace nine real Practice entries](#part-2-trace)
   - [3. A small runnable implementation](#part-2-program)
4. [Part 3: Section 5.3.2 — Amortized Analysis of Dynamic Arrays](#part-3)
   - [1. One costly append versus a sequence of appends](#part-3-aggregate)
   - [2. Pay for copies with saved credits](#part-3-accounting)
   - [3. Compare growth rules](#part-3-growth)
   - [4. Shrink without repeated copying](#part-3-shrink)
5. [Part 4: Section 5.3.3 — Python's List Class](#part-4)
   - [1. What the model predicts, and what CPython documents](#part-4-list)
   - [2. Time many appends carefully](#part-4-timing)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Practice Log That Grows

<span id="background-data"></span>

### 1. The verified session entries

The [MotoGP Friday Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) and [Yamaha's full Practice results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) record these riders, teams, official positions, and best single laps. We will **append in the selected order shown**, beginning with Marc Márquez and Fabio Quartararo. The selected order is for the array lesson; the **P** numbers remain the official Practice classification.

| Append order | Rider | Team | Official Practice place | Best lap | Milliseconds |
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

`1:29.426` means one minute plus 29.426 seconds, or `60,000 + 29,426 = 89,426` milliseconds. Fabio's and Marc's best laps differ by `89,558 − 89,426 = 132` milliseconds, or **0.132 seconds**. These are fastest Practice laps, not race finish times.

**Why this example?** Nine distinct, real entries are enough to cross capacities `1`, `2`, `4`, and `8` in a doubling model. Each growth event has a different rider, so we can check that copying preserves the earlier entries. **How to solve the data setup:** convert all times to one unit, keep each rider's fields together, and label the selected order separately from the official place.

<span id="background-capacity"></span>

### 2. Length, capacity, and unused cells

A dynamic array has a **logical length** `n`: the number of entries we have added. Its underlying storage has a **capacity** `c`: the number of cells currently reserved. The basic invariant is `0 ≤ n ≤ c`. An unused reserved cell is *not* an existing entry, so an array with length `3` and capacity `4` has valid nonnegative indices `0`, `1`, and `2`, but not `3`.

```text
After three selected riders, in a capacity-four teaching array:

Index:    0                 1                   2                  3
Cell:    Marc Márquez       Fabio Quartararo    Raúl Fernández     unused
         <--------------- length = 3 --------->
         <------------------- capacity = 4 ----------------------->
```

The cells contain **references** to rider records, as in Section 5.2. Reserving one more cell does not invent a fourth Practice entry. The diagrams and capacity numbers in this guide describe the book's **simplified doubling array**; they are not a measurement of Python's actual `list` allocation policy.

**Why this example?** The spare fourth cell makes it easy to see why `append` can sometimes write immediately. **How to solve an index or space question:** identify `n` and `c`; use `n` to decide which entries exist and `c − n` to count spare cells.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 5.3 — Why a Dynamic Array Is Needed

<span id="part-1-full"></span>

### 1. What happens when a fixed array fills?

A low-level array has a fixed number of adjacent cells. If a capacity-four array already holds Marc, Fabio, Raúl, and Marco, it cannot assume the next memory cell is free. To append Jorge Martín, a dynamic array can:

1. Allocate a **new** array with room for eight references.
2. Copy the four existing references into its first four cells, in order.
3. Make the new array the backing storage.
4. Write Jorge's reference in cell `4` and change the length from `4` to `5`.

```text
Before: [ Marc | Fabio | Raúl | Marco ]                 n = 4, c = 4
After:  [ Marc | Fabio | Raúl | Marco | Jorge | _ | _ | _ ]  n = 5, c = 8
```

The old rider records themselves are **not duplicated**: the new cells receive references to them. The old backing array can be released once it is no longer needed. This is why a resize copies work proportional to the current number of entries, even though the final placement of Jorge takes one cell write.

**Why this example?** Jorge is our fifth distinct rider, exactly when a capacity-four array must grow. **How to solve a full-array append:** compare `n` with `c`; if equal, allocate larger storage and copy indices `0` through `n − 1`; then write the new entry at index `n` and increase `n`.

<span id="part-1-size"></span>

### 2. Observe list memory without guessing its capacity

Python's `list` lets us append without managing this backing storage ourselves. A list commonly has reserved room beyond its length. You can see changes in the list object's reported size with [`sys.getsizeof`](https://docs.python.org/3/library/sys.html#sys.getsizeof):

```python
import platform
import sys

entries = []
previous_bytes = None
print(platform.python_implementation(), sys.version.split()[0])
for count in range(26):
    current_bytes = sys.getsizeof(entries)
    if current_bytes != previous_bytes:
        print("length={}, list bytes={}".format(len(entries), current_bytes))
        previous_bytes = current_bytes
    entries.append(None)  # Placeholder values for a storage experiment.
```

The **numbers and change points depend on the Python implementation, version, and machine**. A plateau means several successive lengths had the same reported list-object size in that run; a jump is consistent with a storage change. `getsizeof` reports the object's direct size and **does not include the size of objects it refers to**. The book's byte counts are observations from its older Python environment, not a portable table of today's list capacities. This experiment does not expose a public `list.capacity` property.

**Why this example?** It makes the difference between logical length and reserved memory observable without pretending the book's capacity sequence is Python's exact rule. **How to solve it:** start with an empty list, measure after each append count, print only size changes, and interpret the result as a measurement of that run.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 5.3.1 — Implementing a Dynamic Array

<span id="part-2-steps"></span>

### 1. The resize and append steps

The book's `DynamicArray` keeps three private pieces of state: `_n` (length), `_capacity`, and `_A` (a fixed-size array of Python-object references). It starts with capacity `1`. The key operation is:

```text
append(value):
    if length == capacity:
        resize to twice the capacity
    backing_array[length] = value
    length += 1

resize(new_capacity):
    allocate new fixed-size array
    for each existing index k from 0 through length - 1:
        new_array[k] = old_array[k]
    replace the backing array
    update capacity
```

Here `__len__` returns `_n`, while `__getitem__` reads a cell only if its index is within the logical length. The `ctypes.py_object` array in the book is a way to model fixed-size reference storage in Python. Its details are for learning how the structure works; normal application code should use `list`.

**Why this example?** It isolates the one case that creates extra work: `length == capacity`. **How to solve a trace:** record length and capacity *before* append, decide whether to resize, count old references copied, then place the new reference and update length.

<span id="part-2-trace"></span>

### 2. Trace nine real Practice entries

Start with an empty teaching array of capacity `1`. Each append writes **one new reference**. A resize additionally copies all existing references. The “work” column counts these reference writes only; it is **not elapsed time** and excludes allocation overhead.

| Append | Selected rider | Length after | Capacity after | Old references copied | Modeled work: `1 + copies` | Cumulative work |
| ---: | :--- | ---: | ---: | ---: | ---: | ---: |
| 1 | Marc Márquez | 1 | 1 | 0 | 1 | 1 |
| 2 | Fabio Quartararo | 2 | 2 | 1 | 2 | 3 |
| 3 | Raúl Fernández | 3 | 4 | 2 | 3 | 6 |
| 4 | Marco Bezzecchi | 4 | 4 | 0 | 1 | 7 |
| 5 | Jorge Martín | 5 | 8 | 4 | 5 | 12 |
| 6 | Pedro Acosta | 6 | 8 | 0 | 1 | 13 |
| 7 | Fabio Di Giannantonio | 7 | 8 | 0 | 1 | 14 |
| 8 | Álex Márquez | 8 | 8 | 0 | 1 | 15 |
| 9 | Franco Morbidelli | 9 | 16 | 8 | 9 | 24 |

For the **fifth append**, four existing references move to capacity-eight storage before Jorge is placed. For the **ninth append**, eight move before Franco is placed. Across all nine appends, there are `9` new placements and `1 + 2 + 4 + 8 = 15` copies: **24 modeled reference writes**. The ninth append alone costs `9` in this model.

**Why this example?** The full trace shows both cheap and costly appends with no repeated rider entries. **How to solve any row:** if the previous length is smaller than the previous capacity, copies are `0`; otherwise copies equal the previous length and capacity doubles. Add `1` for the new placement.

<span id="part-2-program"></span>

### 3. A small runnable implementation

This `PracticeLog` follows the book's dynamic-array idea. It stores one tuple per real Practice entry. The `copied_references` counter makes resize work visible; it is teaching instrumentation, not part of Python's `list` interface.

```python
import ctypes


class PracticeLog:
    def __init__(self):
        self._n = 0
        self._capacity = 1
        self._data = (ctypes.py_object * self._capacity)()
        self.copied_references = 0

    def __len__(self):
        return self._n

    def __getitem__(self, index):
        if not 0 <= index < self._n:
            raise IndexError("PracticeLog index out of range")
        return self._data[index]

    @property
    def capacity(self):
        return self._capacity

    def append(self, record):
        if self._n == self._capacity:
            self._resize(2 * self._capacity)
        self._data[self._n] = record
        self._n += 1

    def _resize(self, new_capacity):
        new_data = (ctypes.py_object * new_capacity)()
        for index in range(self._n):
            new_data[index] = self._data[index]
            self.copied_references += 1
        self._data = new_data
        self._capacity = new_capacity


# Rider, team, official Practice place, best-lap milliseconds.
practice_entries = (
    ("Marc Márquez", "Ducati Lenovo Team", 5, 89426),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89558),
    ("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88725),
    ("Marco Bezzecchi", "Aprilia Racing", 2, 88944),
    ("Jorge Martín", "Aprilia Racing", 3, 89206),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 4, 89394),
    ("Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", 6, 89430),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 8, 89572),
    ("Franco Morbidelli", "Pertamina Enduro VR46 Racing Team", 9, 89693),
)

log = PracticeLog()
for record in practice_entries:
    copies_before = log.copied_references
    log.append(record)
    copies_now = log.copied_references - copies_before
    print("{}: length={}, capacity={}, copies={}".format(
        record[0], len(log), log.capacity, copies_now
    ))

print("Total reference copies:", log.copied_references)
print("Fabio minus Marc:", log[1][3] - log[0][3], "ms")
```

```text
Marc Márquez: length=1, capacity=1, copies=0
Fabio Quartararo: length=2, capacity=2, copies=1
Raúl Fernández: length=3, capacity=4, copies=2
Marco Bezzecchi: length=4, capacity=4, copies=0
Jorge Martín: length=5, capacity=8, copies=4
Pedro Acosta: length=6, capacity=8, copies=0
Fabio Di Giannantonio: length=7, capacity=8, copies=0
Álex Márquez: length=8, capacity=8, copies=0
Franco Morbidelli: length=9, capacity=16, copies=8
Total reference copies: 15
Fabio minus Marc: 132 ms
```

**Why this example?** It connects the resize algorithm to both the full nine-rider trace and a checkable lap comparison. **How to solve it:** run the program, verify that copies occur on appends `2`, `3`, `5`, and `9`, then use the selected indices `1` and `0` for Fabio and Marc. The code deliberately implements only the operations needed for this lesson; for example, it rejects negative indices instead of reproducing every `list` feature.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 5.3.2 — Amortized Analysis of Dynamic Arrays

<span id="part-3-aggregate"></span>

### 1. One costly append versus a sequence of appends

If the array is full with `k` entries, the next append copies `k` references and writes one new reference: its cost is **Θ(k)** in our model. That is the **worst case for one append**. It does not mean every append copies `k` items. The capacity becomes `2k`, allowing many later appends with one placement each.

For `n` appends starting from capacity `1`, the resize copy counts are powers of two below `n`:

```text
total copies = 1 + 2 + 4 + ... < 2n
new placements = n
total modeled writes < 3n
average modeled writes per append < 3
```

The power-of-two sum is **geometric**: each term doubles, yet the whole sum is less than twice its largest relevant scale. For our nine Practice entries, `15 < 18`, and `24 < 27`. Thus `n` appends cost **O(n) total**, so one append costs **O(1) amortized**. This is the conclusion of the book's **Proposition 5.1**. “Amortized” averages the work over a sequence of operations; it does **not** promise that every individual append is O(1), and it does not use a probability distribution.

**Why this example?** Franco's ninth append is visibly expensive, but the complete log has many cheap appends. **How to solve an amortized question:** count all placements, sum all resize copies, bound the geometric series, then divide the total bound by the number of appends.

<span id="part-3-accounting"></span>

### 2. Pay for copies with saved credits

The book also explains the same result with an **accounting method**. Imagine charging each append **3 credits**. Spend `1` credit on the new placement and save the other `2` for later copies. Credits are a proof device, not money or measured runtime.

In the nine-entry trace, the charges total `9 × 3 = 27` credits. The modeled work costs `24`, so `3` remain. The balance never goes below zero:

| After append | Marc | Fabio | Raúl | Marco | Jorge | Pedro | Di Giannantonio | Álex | Franco |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Saved credit balance | 2 | 3 | 3 | 5 | 3 | 5 | 7 | 9 | 3 |

Why does a constant charge keep working for a longer sequence? After a resize from `k/2` to `k`, the array has `k/2 + 1` entries. By the time another append triggers the next resize, `k/2` more appends have been charged, counting that triggering append. Their `2` saved credits each can pay for the `k` references copied by that next resize. The first capacity-one case also has enough saved credit from Marc's append to cover the copy when Fabio is added. This argument gives a constant charge per append and therefore an O(n) bound for `n` appends.

**Why this example?** It answers the natural question, “Who pays for the expensive ninth append?” **How to solve it:** charge the same amount on every append, pay immediate placement, carry forward unused credit, and check that no resize makes the balance negative.

<span id="part-3-growth"></span>

### 3. Compare growth rules

Doubling is one **geometric growth** rule. Other fixed factors greater than `1` also give constant amortized append time: the successive resize costs form a geometric series bounded by a constant multiple of `n`. They trade copy frequency against spare space. The book contrasts growth factors such as `2` and `1.25`. A smaller factor leaves fewer unused cells after growth but requires more frequent copying. The exact rounded capacities depend on the chosen rule.

Apply both geometric rules to the **same nine-rider sequence**, beginning at capacity `1`. Doubling ends at capacity `16` after the ninth append, leaving `16 − 9 = 7` spare cells and having copied `15` old references in total. For the factor-`1.25` model, round each new capacity **up** to an integer. Its capacities after successive appends are `1, 2, 3, 4, 5, 7, 7, 9, 9`: the ninth rider fits in capacity `9`, leaving **no spare cell**, but reaching that state required `1 + 2 + 3 + 4 + 5 + 7 = 22` copies. The smaller growth factor uses less spare storage here and copies more often.

Suppose instead that the array grows by **one cell every time it fills**. Adding our nine riders would copy `1 + 2 + ... + 8 = 36` old references, plus `9` new placements, for **45 modeled writes**. For general `n`, the copies total `n(n − 1)/2 = Θ(n²)`, so the amortized cost per append grows with `n`. Any fixed positive increment has the same quadratic order as `n` becomes large. This is the book's **Proposition 5.2**.

| Growth rule in a teaching array | Capacity after 9 appends | Spare cells after 9 appends | Copies for 9 appends | Amortized append |
| :--- | ---: | ---: | ---: | :--- |
| Double when full | `16` | `7` | `15` | O(1) |
| Multiply by `1.25` when full, rounded upward | `9` | `0` | `22` | O(1) |
| Add one cell when full | `9` | `0` | `36` | Θ(n) |

The doubling array's capacity stays less than `2n` once it is nonempty, so its reserved reference cells use **O(n) space**. “O(n) space” describes how storage grows with length; it does not say that every cell is occupied by a rider record.

**Why this example?** A concrete ninth entry makes the time–space tradeoff visible. **How to solve a growth-rule comparison:** state the capacity update, count how often copying happens, add the copy costs, and compare unused capacity after the same number of entries.

<span id="part-3-shrink"></span>

### 4. Shrink without repeated copying

Dynamic arrays may also reclaim storage after removals. A naive rule that **halves capacity as soon as length falls to half** can bounce between two sizes: at capacity `8`, removing from length `5` to `4` shrinks to capacity `4`; appending back to length `5` grows to `8` again. Repeating those two edits causes repeated copies.

The book describes a wider gap between growth and shrink thresholds: grow when **full**, but shrink to half when length falls **below one quarter** of capacity. In our model, after all nine riders are stored at capacity `16`, removals down to length `4` leave the capacity at `16`; a further removal to length `3` crosses below `16/4 = 4`, so the array can shrink to capacity `8` and copy its three remaining references. A practical implementation also keeps a minimum capacity, such as `1`.

This is a **policy illustration**, not a claim that Python's `list` uses exactly these thresholds. The point is to leave enough distance between a shrink and the next growth so alternating append/remove operations do not trigger a resize every time.

**Why this example?** The capacity `8` and `16` states already appear in our Practice trace. **How to solve a shrink decision:** compute `c/4`, compare the new length with that threshold, and, when it is lower, allocate half-capacity storage and copy only the surviving entries.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 5.3.3 — Python's List Class

<span id="part-4-list"></span>

### 1. What the model predicts, and what CPython documents

Python's `list` supports `append` and indexed access without asking us to manage `_capacity`. [Python's time-complexity table](https://docs.python.org/3/builtins/time-complexity.html) describes **CPython**: it lists indexed access as **O(1)** and `append` as **O(1) amortized**, and notes that an individual append may be O(n) when storage is resized. Other Python implementations may differ. The [CPython design FAQ](https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython) describes a list as a contiguous array of references with some over-allocation.

Our `PracticeLog` doubles exactly at lengths `1`, `2`, `4`, and `8` because **we wrote that rule**. The book's Section 5.3.3 notes that real Python list growth is not a pure doubling sequence or a fixed-increment sequence. Its historical `getsizeof` table is evidence from one interpreter, not a rule to hard-code. Use a normal `list` for the Practice entries in ordinary Python code:

```python
practice = []
practice.append(("Marc Márquez", "Ducati Lenovo Team", 5, 89426))
practice.append(("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89558))
print(len(practice))
print(practice[1][3] - practice[0][3], "ms")
```

```text
2
132 ms
```

**Why this example?** It connects the lesson back to the `list` students will actually write. **How to solve it:** call `append` for each complete rider record, use `len` for the number of records, and index the two records needed for the lap comparison. Do not infer the list's exact capacity from `len`.

<span id="part-4-timing"></span>

### 2. Time many appends carefully

The book times a **whole sequence** of appends and divides by the number of operations. This is more suitable for studying amortized behavior than timing one append, whose duration can include an occasional resize. A small experiment is:

```python
from time import perf_counter


def average_append_seconds(count):
    values = []
    start = perf_counter()
    for _ in range(count):
        values.append(None)
    elapsed = perf_counter() - start
    return elapsed / count


for count in (10_000, 100_000, 1_000_000):
    print("{} appends: {:.9f} seconds each".format(
        count, average_append_seconds(count)
    ))
```

The printed seconds vary by computer, interpreter, system load, and run. The loop itself takes time too, so these values are **not** the isolated cost of `list.append`. A few measurements do not prove a complexity bound; the geometric-copy argument above supplies the reasoning. The experiment can help you see whether average time per append stays roughly in the same scale as the workload grows.

**Why this example?** It follows the book's measurement idea while keeping the result separate from the mathematical proof. **How to solve it:** time the complete loop, divide by its append count, repeat for larger counts, and treat the output as run-specific evidence.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Question | Answer from Section 5.3 | Practice-log reminder |
| :--- | :--- | :--- |
| What is length? | Number of entries actually stored. | Nine riders means length `9`. |
| What is capacity? | Number of reserved reference cells. | Our doubling model ends at capacity `16`. |
| When is append expensive? | When a full backing array must be replaced and its references copied. | Franco's ninth append copies eight old references. |
| Why is append amortized O(1)? | Geometric growth makes all copies across `n` appends total O(n). | Nine placements plus fifteen copies give twenty-four modeled writes. |
| Why not grow one cell at a time? | Repeated copying adds up to Θ(n²) work. | Nine appends would take forty-five modeled writes. |
| Is Python's list exactly this model? | No; its exact allocation is implementation dependent. | Use `list.append` without expecting capacity `16` at length `9`. |

To solve a new dynamic-array problem, write down **length and capacity before each operation**, apply the stated growth or shrink rule, count references copied, then distinguish the cost of **one operation** from the **total across the sequence**.

[🔝 Back to Top](#top)
