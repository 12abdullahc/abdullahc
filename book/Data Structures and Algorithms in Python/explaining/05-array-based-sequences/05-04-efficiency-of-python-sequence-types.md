<span id="top"></span>

# Array-Based Sequences — Section 5.4: Efficiency of Python's Sequence Types

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.4 (printed pages 202–209; [chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C05.pdf)).  
> **Topic:** The costs of reading, searching, copying, and changing lists and tuples; string scanning, searching, and construction.  
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika. All named rider results below come from that one session.  
> **Learning goal:** Predict a sequence operation's cost by counting entries read, copied, or shifted, then choose a suitable way to build a rider report.  
> **User Prompt:** "Reexplain [Section 5.4] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Practice Session, Several Kinds of Work](#background-intuition)
   - [1. Verified entries and our selected order](#background-data)
   - [2. What the cost symbols count](#background-cost)
2. [Part 1: Section 5.4 — One Sequence, Different Costs](#part-1)
3. [Part 2: Section 5.4.1 — Reading Lists and Tuples](#part-2)
   - [1. Constant-time operations: length and a known index](#part-2-access)
   - [2. Search for a value: `count`, `index`, and `in`](#part-2-search)
   - [3. Lexicographic comparison](#part-2-compare)
   - [4. Create new instances: slices, `+`, and repetition](#part-2-create)
4. [Part 3: Section 5.4.1 — Changing Lists](#part-3)
   - [1. Assignment and append](#part-3-append)
   - [2. Insert and shift right](#part-3-insert)
   - [3. Pop, delete, and remove](#part-3-remove)
   - [4. Extend, reverse, and sort](#part-3-extend)
   - [5. Construct a list from records](#part-3-construct)
5. [Part 4: Section 5.4.2 — Python's String Class](#part-4)
   - [1. Scan characters and make new text](#part-4-scan)
   - [2. Search for a substring](#part-4-pattern)
   - [3. Assemble a report with `join`](#part-4-join)
6. [Part 5: Complete Worked Practice Notebook](#part-5)
   - [1. Solve the selection and report task](#part-5-steps)
   - [2. Run and trace the program](#part-5-program)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Practice Session, Several Kinds of Work

<span id="background-data"></span>

### 1. Verified entries and our selected order

The [MotoGP Friday Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) and [Yamaha's full Practice results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give the following riders, teams, official positions, and best single laps. The **selected order** starts with Marc Márquez and Fabio Quartararo to make the examples easy to follow. It is **not** the official ranking; the P numbers are that ranking.

| Selected index | Rider | Team | Official Practice place | Best lap | Milliseconds |
| ---: | :--- | :--- | ---: | ---: | ---: |
| `0` | Marc Márquez | Ducati Lenovo Team | P5 | 1:29.426 | 89,426 |
| `1` | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | P7 | 1:29.558 | 89,558 |
| `2` | Raúl Fernández | SuperFile Trackhouse MotoGP Team | P1 | 1:28.725 | 88,725 |
| `3` | Marco Bezzecchi | Aprilia Racing | P2 | 1:28.944 | 88,944 |
| `4` | Jorge Martín | Aprilia Racing | P3 | 1:29.206 | 89,206 |
| `5` | Pedro Acosta | Red Bull KTM Factory Racing | P4 | 1:29.394 | 89,394 |
| `6` | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team | P6 | 1:29.430 | 89,430 |
| `7` | Álex Márquez | BK8 Gresini Racing MotoGP | P8 | 1:29.572 | 89,572 |
| `8` | Franco Morbidelli | Pertamina Enduro VR46 Racing Team | P9 | 1:29.693 | 89,693 |

For example, `1:29.426` is `60,000 + 29,426 = 89,426` milliseconds. Fabio's and Marc's best laps differ by `89,558 − 89,426 = 132` milliseconds, or **0.132 seconds**. These are fastest laps from Practice, not race finishing gaps. Small subsets and review queues below rearrange **references to these real entries** for teaching; they do not change the session results.

**Why these entries?** Two riders share Aprilia Racing and two share Pertamina Enduro VR46 Racing Team, so `count` and `remove` can show what repeated values mean. Marc and Fabio at selected indices `0` and `1` make direct access easy to verify. **How to solve a data question:** keep the selected index, official place, and lap unit separate before choosing an operation.

<span id="background-cost"></span>

### 2. What the cost symbols count

| Symbol | Meaning in this guide | Example |
| :--- | :--- | :--- |
| `n` | Entries in the original list or tuple | The table has `n = 9` records. |
| `k` | An index, or the first match/difference position | Fabio is at selected index `k = 1`. |
| `r` | Entries copied into a slice | `names[1:3]` has `r = 2` names. |
| `m` | Entries in a second sequence, or characters in a search pattern | Two more records, or the five characters in `"Fabio"`. |
| `N` | Characters in a text string | The full rider-report line has `N` characters. |

**O(1)** means the work stays bounded as the sequence grows; **O(n)** means work grows at most linearly; **Θ(n)** means it grows linearly both above and below. **Amortized O(1)** means a whole series of operations has constant average work per operation, even if an occasional operation costs O(n). These are growth bounds, not seconds. We treat a reference move or comparison of our small integer lap values as constant work. Comparing long strings or running an expensive custom comparison adds that element-level cost.

**Why define symbols first?** A slice's cost depends on its **output length**, while an insertion's cost depends on how many later entries move. **How to solve a cost question:** identify the operation's input size, then count the entries it must inspect, create, or shift.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 5.4 — One Sequence, Different Costs

Section 5.3 explained why adding at the **end** of a dynamic array is O(1) amortized. Section 5.4 asks a broader question: what changes when we read a known position, search for an unknown value, create a copy, or edit the middle? A `list` can be changed; a `tuple` cannot have its positions reassigned, inserted, or deleted. A `str` is also immutable and holds characters, so building a longer string means making a result.

For the same number of references, a tuple generally needs less **container storage** than a list because it need not reserve spare cells for future appends. Exact byte counts depend on the interpreter and do not include the objects those references point to. Tuple immutability is also **shallow**: a tuple can still refer to a mutable object.

Consider the first four selected riders:

```text
Index:     0                 1                   2                3
Rider:     Marc Márquez      Fabio Quartararo    Raúl Fernández   Marco Bezzecchi
```

Reading index `1` goes straight to Fabio's cell. Looking for a name scans until it is found. Inserting Jorge Martín at index `2` moves Raúl and Marco right. Copying indices `1:3` makes a new two-entry sequence. The answer may involve the same riders, but the operations do different amounts of work.

The book summarizes nonmutating list/tuple costs in **Table 5.3** and list mutation costs in **Table 5.4**. The [current Python complexity table](https://docs.python.org/3/builtins/time-complexity.html) describes **exact built-in types in CPython**; another Python implementation or a subclass can have different costs. We use the book's array-based model and label any CPython-specific fact.

**Why this example?** Four familiar entries let us count actual reads, copies, and shifts. **How to solve it:** draw the indices before and after an operation, then count the positions touched.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 5.4.1 — Reading Lists and Tuples

<span id="part-2-access"></span>

### 1. Constant-time operations: length and a known index

```python
selected = [
    ("Marc Márquez", 5, 89426),
    ("Fabio Quartararo", 7, 89558),
    ("Raúl Fernández", 1, 88725),
]
fixed = tuple(selected)
print(len(selected))
print(selected[1][0])
print(fixed[1][0])
```

```text
3
Fabio Quartararo
Fabio Quartararo
```

`len(selected)` reads a stored length: **O(1)**. `selected[1]` and `fixed[1]` locate one indexed reference directly: **O(1)**. The additional `[0]` reads the name field of a fixed-size three-field tuple, also O(1). Constructing `fixed = tuple(selected)` is a separate **O(n)** step because a new tuple receives `n` references. By contrast, `tuple(fixed)` can return the existing tuple without copying it in CPython.

**Why this example?** Fabio is at selected index `1`, so the result can be checked against the table without a search. **How to solve it:** use `len` for the count, use the known index for the record, and then use the record's field index. Remember that constructing the tuple has its own cost.

<span id="part-2-search"></span>

### 2. Search for a value: `count`, `index`, and `in`

Here is a **five-rider subset** of the same Practice session, in selected order. Pedro's team is absent from this subset, although Pedro was in the session.

```python
teams = [
    "Ducati Lenovo Team",                 # Marc
    "Monster Energy Yamaha MotoGP Team", # Fabio
    "SuperFile Trackhouse MotoGP Team",  # Raúl
    "Aprilia Racing",                     # Marco
    "Aprilia Racing",                     # Jorge
]
print(teams.count("Aprilia Racing"))
print(teams.index("Monster Energy Yamaha MotoGP Team"))
print("Red Bull KTM Factory Racing" in teams)
```

```text
2
1
False
```

`count` must inspect all `n` entries to be sure it found every match: **Θ(n)** for simple comparisons. `index` and `in` may stop at the first match. If the first match is at index `k`, they inspect `k + 1` entries: **O(k + 1)**. An absent value makes them inspect all `n` entries; `in` returns `False`, while `index` raises `ValueError`. A tuple of the same teams has the same search pattern.

**Why this example?** Marco and Jorge genuinely share Aprilia Racing, so counting returns `2`; Fabio's team appears early, so `index` stops at `1`. **How to solve a search question:** choose `count` for *how many*, `index` for *where the first one is*, and `in` for *whether any exists*. State the subset being searched.

<span id="part-2-compare"></span>

### 3. Lexicographic comparison

Lists and tuples compare corresponding elements from left to right. The **first unequal pair** decides the ordering. If all shared elements agree, the shorter sequence comes first. Compare two ordered pairs of official Practice places, each starting with Marc's P5:

```python
marc_and_fabio = (5, 7)  # Marc P5, Fabio Quartararo P7
marc_and_alex = (5, 8)   # Marc P5, Álex Márquez P8
print(marc_and_fabio < marc_and_alex)
print((5,) < (5, 7))
```

```text
True
True
```

The first comparison checks `5 == 5`, then decides at `7 < 8`. The second finds a matching prefix and puts the shorter tuple first. If the first difference occurs at index `k`, up to `k + 1` element comparisons are needed; a long matching prefix can make this **O(n)**. This is a comparison of two **sequences of numbers**, not a new MotoGP classification or a way to compare total lap time.

**Why this example?** A shared first number forces Python to examine the second, revealing the left-to-right rule. **How to solve it:** compare the first pair, move right only while equal, and use length only if one sequence runs out first.

<span id="part-2-create"></span>

### 4. Create new instances: slices, `+`, and repetition

```python
names = ["Marc Márquez", "Fabio Quartararo", "Raúl Fernández", "Marco Bezzecchi"]
print(names[1:3])
print(names[:2] + names[2:])
print(names[:2] * 2)
print(names)
```

```text
['Fabio Quartararo', 'Raúl Fernández']
['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández', 'Marco Bezzecchi']
['Marc Márquez', 'Fabio Quartararo', 'Marc Márquez', 'Fabio Quartararo']
['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández', 'Marco Bezzecchi']
```

| Operation | Entries placed in the new result | Cost |
| :--- | :--- | :--- |
| `names[1:3]` | Two, at indices `1` and `2`; stop `3` is excluded. | **O(r)** for slice length `r = 2`. |
| `left + right` | All `n₁ + n₂` entries. | **O(n₁ + n₂)**. |
| `names[:2] * 2` | Four references: the pair repeated twice. | **O(cn)** for `c` copies of an `n`-entry input. |

These operations make **shallow** copies of references. Repetition here lays out the same two names twice in a teaching worksheet; it does not claim the riders posted two entries in Practice. Ordinary nonempty tuple slices, tuple concatenation, and tuple repetition follow the same output-size idea. A full slice of a tuple may reuse the same immutable tuple in CPython, so the general rule concerns a newly created result.

**Why this example?** The outputs show exactly how many references each operation creates. **How to solve it:** calculate the result length first. For a slice, subtract its normalized start from its stop; for `+`, add operand lengths; for repetition, multiply the input length by the count.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 5.4.1 — Changing Lists

Only the mutable `list` supports these edits. A tuple of rider records can be read or copied, but its positions cannot be changed in place.

<span id="part-3-append"></span>

### 1. Assignment and append

```python
lap_slots = [89426, None]  # Marc's lap; one unfilled worksheet slot
lap_slots[1] = 89558       # Fill Fabio's existing slot.
lap_slots.append(88725)    # Add Raúl as a new entry.
print(lap_slots)
```

```text
[89426, 89558, 88725]
```

Assignment changes one existing cell and leaves the length at `2`: **O(1)**. `append` increases the length to `3`: **O(1) amortized**. Most appends use spare storage; one that forces a resize can take O(n). The `None` slot was an unfilled position in our worksheet, not a missing official Practice lap. Section 5.3 explains the resize accounting.

**Why this example?** It separates *filling an existing slot* from *adding a new slot*. **How to solve it:** check whether the index already exists. Use assignment to replace its value; use `append` to add at the end.

<span id="part-3-insert"></span>

### 2. Insert and shift right

Suppose a four-rider **review queue** currently lists Marc, Fabio, Marco, and Pedro. Insert Raúl at index `2`:

```text
Before: index 0 Marc | 1 Fabio | 2 Marco | 3 Pedro
Move:                              Marco → 3, Pedro → 4
After:  index 0 Marc | 1 Fabio | 2 Raúl  | 3 Marco | 4 Pedro
```

```python
queue = ["Marc Márquez", "Fabio Quartararo", "Marco Bezzecchi", "Pedro Acosta"]
queue.insert(2, "Raúl Fernández")
print(queue)
```

```text
['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández', 'Marco Bezzecchi', 'Pedro Acosta']
```

For original length `n` and insert index `k`, entries `k` through `n − 1` move right: **`n − k` shifts**. The book's simplified `DynamicArray.insert` (Code Fragment 5.5) moves them **rightmost first**, so an old entry is not overwritten before it moves. In four entries, insertion at the front shifts `4`, at index `2` shifts `2`, and at the end shifts `0`. Add the new write and occasional resize: the book gives **O(n − k + 1) amortized**. Front or middle insertion is linear as `n` grows; end insertion has amortized constant cost.

**Why this example?** Two actual riders visibly move, so the cost is tied to positions rather than lap values. **How to solve it:** mark `k`, count the entries from `k` to the old end, shift from right to left, then write the new rider at `k`.

<span id="part-3-remove"></span>

### 3. Pop, delete, and remove

Removing by **position** and removing by **value** answer different questions:

```python
queue = ["Marc Márquez", "Fabio Quartararo", "Raúl Fernández", "Marco Bezzecchi"]
print(queue.pop(1))
print(queue)

teams = ["Aprilia Racing", "Ducati Lenovo Team", "Aprilia Racing"]
teams.remove("Aprilia Racing")
print(teams)
```

```text
Fabio Quartararo
['Marc Márquez', 'Raúl Fernández', 'Marco Bezzecchi']
['Ducati Lenovo Team', 'Aprilia Racing']
```

`pop(1)` knows the index, returns Fabio, then shifts Raúl and Marco left. `del queue[1]` would use the same shift pattern without returning the removed value. At index `k`, either operation shifts `n − k − 1` later entries: **O(n − k)** including constant removal work. `pop()` at the end shifts none and is **O(1) amortized** (an occasional storage shrink may cost more).

`remove(value)` first searches from the left, then shifts later entries. It removes the **first** matching Aprilia team label, leaving the other. With simple comparisons, searching plus shifting takes **O(n)**; an absent value takes a full search and raises `ValueError`. The book's teaching implementation (Code Fragment 5.6) sets the old final cell to `None` after shifting so it does not keep an unnecessary reference.

**Why this example?** Two Aprilia entries show that `remove` does not remove every equal value, while `pop(1)` identifies Fabio by position. **How to solve it:** if you know the position, use `pop(k)` when you need the removed item or `del` otherwise; if you know only a value, find its first match and account for both search and shifting. These edits change only our review queues, not the official Practice results.

<span id="part-3-extend"></span>

### 4. Extend, reverse, and sort

Start with Marc and Fabio's lap records, then bring in Raúl and Marco:

```python
laps = [("Marc Márquez", 89426), ("Fabio Quartararo", 89558)]
laps.extend([("Raúl Fernández", 88725), ("Marco Bezzecchi", 88944)])
print("extended:", [name for name, _ in laps])
laps.reverse()
print("reversed:", [name for name, _ in laps])
laps.sort(key=lambda record: record[1])
print("fastest laps:", [name for name, _ in laps])
```

```text
extended: ['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández', 'Marco Bezzecchi']
reversed: ['Marco Bezzecchi', 'Raúl Fernández', 'Fabio Quartararo', 'Marc Márquez']
fastest laps: ['Raúl Fernández', 'Marco Bezzecchi', 'Marc Márquez', 'Fabio Quartararo']
```

| Operation | Work on a list of length `n` | Cost in the book's model |
| :--- | :--- | :--- |
| `laps.extend(extra)` or `laps += extra` | Add `m` incoming entries to the same list. | **O(m) amortized**, plus any cost of producing/iterating over `extra`. |
| `laps + extra` | Make a **new** list containing both inputs. | **O(n + m)**. |
| `laps.reverse()` | Swap pairs from the ends inward. | **O(n)**. |
| `laps.sort(key=...)` | Order records by integer milliseconds. | **O(n log n)** worst case with constant-cost keys/comparisons. |

`reverse` changes the current order; it does not sort by performance. Here `sort` uses a numeric key, and a **lower** best-lap time comes first. `sort()` changes the list and returns `None`; [`sorted()`](https://docs.python.org/3/howto/sorting.html) would create a new list. The book's Table 5.5 times repeated front, middle, and end insertions on its own computer; its microseconds are observations, while the shift counts explain the growth pattern.

Adding `m` entries with `m` calls to `append` is also **O(m) total amortized**. `extend` can be faster in practice because one built-in call handles the work, avoiding repeated Python-level method calls; when the incoming source has a known length, the destination can reserve room in advance. In the book's known-size list model, this needs at most one resize for that `extend` call. The asymptotic O(m) bound stays the same.

**Why this example?** The same four real riders pass through three visibly different transformations. **How to solve it:** use `extend` to add a group to an existing list, `reverse` to invert its current order, and `sort(key=...)` when the target order is based on a field such as lap milliseconds.

<span id="part-3-construct"></span>

### 5. Construct a list from records

```python
practice = [
    ("Marc Márquez", 89426),
    ("Fabio Quartararo", 89558),
    ("Raúl Fernández", 88725),
]
milliseconds = [lap_ms for _, lap_ms in practice]
print(milliseconds)
```

```text
[89426, 89558, 88725]
```

The comprehension reads each of `n` records and places one integer in a new list: **O(n)** time and **O(n)** output space. A loop with `append` also takes O(n) total amortized time; the comprehension often reduces Python-level loop and method-call overhead. Creating `[None] * n` worksheet slots also takes O(n) time because `n` references must be written. If the repeated element is mutable, those slots refer to the *same* object unless you make independent objects, as Section 5.2 explains.

**Why this example?** We need numeric lap values for calculations, and there is exactly one value per record. **How to solve it:** choose the field to extract, visit each record once, and account for the size of the new list.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 5.4.2 — Python's String Class

A `str` is an immutable sequence of characters. Its index and slice syntax look familiar, but a text operation that creates a result has to produce characters for that result. Let `N` be the input string length and `m` a substring-pattern length.

<span id="part-4-scan"></span>

### 1. Scan characters and make new text

```python
label = "  Marc Márquez | Ducati Lenovo Team  "
print(label.strip())
print(label[2:6])
print("fabio".islower())
print("Fabio".islower())
```

```text
Marc Márquez | Ducati Lenovo Team
Marc
True
False
```

An indexed character can be read directly in O(1), and a slice of `r` characters takes **O(r)** when it makes new text. `strip` may inspect the ends and build a result, taking **O(N)** in the worst case even if the result is short. Predicates such as `islower` may stop as soon as an uppercase character proves `False`; to return `True`, they must examine all relevant characters. Other string methods that construct a new result need at least enough work to produce its output, and may also scan the input.

**Why this example?** Spaces at both ends give `strip` real work, while lowercase and mixed-case rider names show early stopping. **How to solve it:** ask whether the method reads one known character, scans until a decision, or creates a new sequence of characters; count input scanned and output produced.

<span id="part-4-pattern"></span>

### 2. Search for a substring

```python
report = "Marc Márquez|Fabio Quartararo"
print(report.find("Fabio"))
print("Fabio" in report)
print(report.find("Pedro"))
```

```text
13
True
-1
```

`find` returns the start index of the first match, or `-1` if none exists. `in` answers whether the substring appears. A **naive teaching algorithm** would try each possible start in `N` characters and compare up to `m` pattern characters there, costing **O(Nm)** in the worst case. That explains why pattern search is a different problem from accessing `report[13]`. The book previews a better linear-time pattern algorithm in Chapter 13.

The O(Nm) bound is **not** a claim about Python's built-in `find`. The [current CPython complexity table](https://docs.python.org/3/builtins/time-complexity.html#str-bytes-bytearray) gives **O(N)** worst case for forward substring search with `in`, `find`, or `index`. With `find(pattern, start, end)`, the searched region determines `N`; a separate slice is unnecessary. Other implementations may differ.

**Why this example?** Marc and Fabio appear in one short report, so the match at character `13` is checkable by hand; Pedro is absent only from this **report string**, not the Practice session. **How to solve it:** distinguish a known index from an unknown pattern, decide whether you need a Boolean or the match's start position, and do not assign a naive algorithm's bound to an optimized built-in.

<span id="part-4-join"></span>

### 3. Assemble a report with `join`

```python
names = ["Marc Márquez", "Fabio Quartararo", "Raúl Fernández"]
report = ", ".join(names)
print(report)
```

```text
Marc Márquez, Fabio Quartararo, Raúl Fernández
```

Strings are immutable. In a general repeated-concatenation model, `report += piece` creates a longer result each time and recopies the growing prefix. For `q` equal-size pieces, the copied lengths grow like `1 + 2 + ⋯ + q = Θ(q²)`. Some CPython versions optimize particular `+=` cases, so a short timing run may not follow that curve. [Python's sequence documentation](https://docs.python.org/3/builtins/stdtypes.html#common-sequence-operations) recommends collecting pieces and calling `str.join` once. Joining `q` pieces takes **O(q + L)**, where `L` is the final text length including separators: it must inspect the pieces and write the output characters.

The book's version, `"".join(c for c in document if c.isalpha())`, scans a document, selects letters, then constructs one final string. For a document of `N` characters, the scan plus join is **O(N)**. A generator avoids an explicit temporary list in the source code, although `join` may buffer pieces internally.

**Why this example?** A rider-name report is naturally made from several pieces, and its output is easy to inspect. **How to solve it:** build or select the pieces, choose a separator, and join them once; count both the pieces visited and the characters written.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Complete Worked Practice Notebook

<span id="part-5-steps"></span>

### 1. Solve the selection and report task

We want to answer five questions about the same nine Practice entries: How many are in our selected notebook? Where is Fabio in our chosen order? How many selected riders belong to Aprilia Racing? Which three entries have the fastest laps? What short text report lists that top three?

1. Store each entry as one tuple: rider, team, official place, best-lap milliseconds. Keep the selected order from the opening table.
2. Use `len` and a known index for direct questions; use `count` or `index` when a value must be found.
3. Copy the records before sorting, so the selected notebook order remains available. Sort the copy by its numeric lap field.
4. Build the report's pieces from the first three sorted records and call `join` once.
5. Use a separate **review queue** to demonstrate a middle insertion and removal. This queue is an editorial selection, not an official session classification.

**Why this task?** Each question asks for a different sequence behavior, so the operation choice has a visible reason. **How to solve it:** choose the operation whose work matches the question: direct access, search, copying, shifting, sorting, or text construction.

<span id="part-5-program"></span>

### 2. Run and trace the program

```python
# Friday 9 October 2026 Indonesian GP MotoGP Practice.
# Each tuple is (rider, team, official place, best-lap milliseconds).
practice = [
    ("Marc Márquez", "Ducati Lenovo Team", 5, 89426),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, 89558),
    ("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88725),
    ("Marco Bezzecchi", "Aprilia Racing", 2, 88944),
    ("Jorge Martín", "Aprilia Racing", 3, 89206),
    ("Pedro Acosta", "Red Bull KTM Factory Racing", 4, 89394),
    ("Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", 6, 89430),
    ("Álex Márquez", "BK8 Gresini Racing MotoGP", 8, 89572),
    ("Franco Morbidelli", "Pertamina Enduro VR46 Racing Team", 9, 89693),
]

names = [record[0] for record in practice]
teams = [record[1] for record in practice]
print("selected entries:", len(practice))
print("selected index 1:", practice[1][0])
print("Fabio's selected index:", names.index("Fabio Quartararo"))
print("Aprilia entries:", teams.count("Aprilia Racing"))
print("opening pair:", names[:2])

by_lap = practice.copy()
by_lap.sort(key=lambda record: record[3])
print("fastest three:", [record[0] for record in by_lap[:3]])

queue = names[:4]
queue.insert(2, names[4])        # Bring Jorge into the review queue.
moved_out = queue.pop(3)         # Move Raúl to a separate review.
print("review queue:", queue)
print("moved out:", moved_out)

pieces = ["{} P{}".format(record[0], record[2]) for record in by_lap[:3]]
report = " | ".join(pieces)
print("report:", report)
print("report contains Marco:", "Marco" in report)
```

```text
selected entries: 9
selected index 1: Fabio Quartararo
Fabio's selected index: 1
Aprilia entries: 2
opening pair: ['Marc Márquez', 'Fabio Quartararo']
fastest three: ['Raúl Fernández', 'Marco Bezzecchi', 'Jorge Martín']
review queue: ['Marc Márquez', 'Fabio Quartararo', 'Jorge Martín', 'Marco Bezzecchi']
moved out: Raúl Fernández
report: Raúl Fernández P1 | Marco Bezzecchi P2 | Jorge Martín P3
report contains Marco: True
```

The notebook length and `practice[1]` use stored length and a known index. Finding Fabio's selected index with `names.index` may search; `teams.count` inspects all nine entries. `practice.copy()` copies nine references, while sorting that copy leaves the selected order intact. The queue insertion shifts Raúl and Marco right; `pop(3)` then removes Raúl from that **review queue** and shifts Marco left. The report's `join` writes one final string from three pieces. The official P1–P3 labels remain the source classification, regardless of the queue edits.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Question | Operation and cost | Practice example |
| :--- | :--- | :--- |
| Is the position already known? | `len(data)` and `data[k]`: **O(1)**. | Read Fabio at selected index `1`. |
| Must a value be found? | `count`: **O(n)**; `index`/`in`: up to **O(n)**. | Count two Aprilia Racing entries. |
| Does it create a sequence? | Slice: **O(result length)**; `+`: **O(sum of input lengths)**; repetition: **O(output length)**. | Copy the Marc–Fabio opening pair. |
| Does an edit move later entries? | `insert(k, x)` and `pop(k)` depend on **n − k**; `remove(x)` also searches. | Insert Jorge in a review queue. |
| Is the edit at the end? | `append` and `pop()` are **O(1) amortized**. | Add one rider record at the end. |
| Is an existing list enlarged or ordered? | `extend` is **O(m) amortized**; `reverse` **O(n)**; `sort` **O(n log n)** worst case. | Sort by best-lap milliseconds. |
| Is text being assembled? | Repeated immutable concatenation can be quadratic; collect `q` pieces and `join` in **O(q + output length)**. | Build the top-three report. |

The practical method is to ask what must be **read, searched, copied, shifted, or written**. The number of affected entries or characters usually explains the cost more clearly than the method name alone.

[🔝 Back to Top](#top)
