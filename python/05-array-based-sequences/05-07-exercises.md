<span id="top"></span>

# 5.7 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 5, Section 5.7, printed pages 224–227 (the supplied PDF).<br>
> **Topic:** Reinforcement R-5.1–R-5.12; Creativity C-5.13–C-5.31; Projects P-5.32–P-5.37.<br>
> **Domain Focus:** One set of rectangular cards, their areas, a three-by-three display grid, and a short geometry report.<br>
> **User Prompt:** Reexplain [`Section 5.7`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Activity](#background)
   - [1. Keep the same cards and measurements](#background-cards)
   - [2. What an exercise is asking you to show](#background-tasks)
2. [Part 1: Reinforcement, R-5.1–R-5.12](#part-1)
   - [1. Observe list storage: R-5.1–R-5.3](#part-1-storage)
   - [2. Work with arrays and cost: R-5.4–R-5.8](#part-1-arrays)
   - [3. Revisit ciphers and grids: R-5.9–R-5.12](#part-1-cipher-grid)
3. [Part 2: Creativity, C-5.13–C-5.20](#part-2)
   - [1. Initial capacity, shuffling, and slower growth](#part-2-growth)
   - [2. Shrinking and the gap between thresholds](#part-2-shrink)
4. [Part 3: Creativity, C-5.21–C-5.31](#part-3)
   - [1. Design fair timing experiments: C-5.21–C-5.24](#part-3-timing)
   - [2. Scan, count, and find a missing value: C-5.25–C-5.28](#part-3-scan)
   - [3. Join, reassemble, and recurse: C-5.29–C-5.31](#part-3-join)
5. [Part 4: Projects, P-5.32–P-5.37](#part-4)
   - [1. Three dimensions and matrix operations](#part-4-matrices)
   - [2. Extend a cipher by separating its mapping](#part-4-ciphers)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. Reassemble, total, filter, and join the cards](#part-5-program)
   - [2. Trace its result](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Activity

<span id="background-cards"></span>

### 1. Keep the same cards and measurements

The [earlier Chapter 5 guides](05-01-python-sequence-types.md) use four rectangles: `A` is 2 × 3 cm, `B` is 4 × 2 cm, `C` is 4 × 4 cm, and `D` is 2 × 2 cm. Their areas are **6, 8, 16, and 4 cm²**. Cards `E`, `F`, `G`, and `H` repeat those four dimensions, and `I` repeats `A`. Repeated dimensions do not mean the physical cards are the same object.

| Card sequence | `A` | `B` | `C` | `D` | `E` | `F` | `G` | `H` | `I` |
| :------------ | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| Area (cm²) | 6 | 8 | 16 | 4 | 6 | 8 | 16 | 4 | 6 |

The area list is `[6, 8, 16, 4, 6, 8, 16, 4, 6]`; its total is **74 cm²**. The same values form the [Section 5.6 grid](05-06-multidimensional-data-sets.md):

```text
       column 0  column 1  column 2
row 0      A:6       B:8      C:16
row 1      D:4       E:6       F:8
row 2     G:16       H:4       I:6
```

We will also use card **IDs** when an exercise requires integers in a particular range. An ID identifies a size: `1 → 4 cm²`, `2 → 6 cm²`, `3 → 8 cm²`, `4 → 16 cm²`. An ID is not an area measurement.

<span id="background-tasks"></span>

### 2. What an exercise is asking you to show

Section 5.7 is a set of **37 exercises**, not another exposition section. The book divides them into reinforcement (12), creativity (19), and projects (6). Each asks for a different kind of evidence:

| Request in an exercise | What your answer should contain |
| :--------------------- | :------------------------------ |
| **Observe or benchmark** | A reproducible setup, measured results from your Python build, and an interpretation. |
| **Implement** | Working code, valid inputs, edge cases, and a trace on a small example. |
| **Prove or analyze** | A cost model, the number of operations or copies, and a bound that follows from that count. |
| **Design a data operation** | A representation, an algorithm, and time/space costs including any output. |

Here, `n` usually means the number of items; `N` is often a dynamic array's allocated **capacity**. `O(n)` is an upper bound on how work grows, while `Ω(n)` is a lower bound. A timing measurement can illustrate a bound but cannot by itself prove one. The guidance below restates every prompt and gives a card-based starting point; it is a study guide rather than a completed answer sheet for all 37 assignments.

> **Mental model:** First identify the data, then the operation, then what must be measured or proved. The geometry stays fixed while the algorithm changes.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-5.1–R-5.12

<span id="part-1-storage"></span>

### 1. Observe list storage: R-5.1–R-5.3

The first three tasks revisit the [list-memory experiment from Section 5.3](05-03-dynamic-arrays-and-amortization.md). A list has a **length** (occupied positions) and an implementation-dependent allocation for references. Its reported object size can change in jumps.

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **R-5.1** | Run the book's append-and-measure experiment on your own Python build. Append areas `A` through `I`; record length and `sys.getsizeof(data)` after each step, then compare your observations with the book's historical output. |
| **R-5.2** | Print only allocation changes. The book's sample capacity sequence begins `0, 4, 8, 16, 25, …`; treat this as a result from that build, not a Python rule. To report an **exhausted capacity**, print the length *before* the append that changes the size: appending `E` to four cards reports `4`, even though the new length is `5`. |
| **R-5.3** | Start with a sufficiently long list, pop one card at a time, and print only size decreases. Shrinking may occur well after a pop first makes a free cell; do not assume every pop changes the allocation. |

For R-5.2, the essential detector is `if new_bytes != old_bytes:` after each append; for R-5.3, use `if new_bytes < old_bytes:` after each pop. [`sys.getsizeof`](https://docs.python.org/3/library/sys.html#sys.getsizeof) measures the list object and its internal allocation, **not** the full size of the Python objects referenced by its entries. The [Python FAQ](https://docs.python.org/3/faq/design.html#how-are-lists-implemented-in-cpython) describes CPython's over-allocation, but the exact jump lengths depend on implementation and version.

<span id="part-1-arrays"></span>

### 2. Work with arrays and cost: R-5.4–R-5.8

The book's teaching `DynamicArray` has `_n` occupied cells, `_capacity` allocated cells, and a backing array `_A`. These exercises change that **teaching class** or study operations on the built-in `list`; the two should not be confused.

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **R-5.4** | Translate a negative index `k` to `k + _n` before checking bounds. For `[A, B, C, D]`, `-1` selects `D` (4 cm²), `-4` selects `A` (6 cm²), and `-5` remains invalid. |
| **R-5.5** | Rework the append accounting when copying a full capacity-`k` array into capacity `2k` costs `3k` units. Charge **7 units per append**: one for its ordinary write and six saved for a future copy. |
| **R-5.6** | When insertion must grow the array, copy the prefix before the insertion point, write the new card, and copy the suffix one cell later. Inserting `E` at index 2 of full `[A, B, C, D]` gives `[A, B, E, C, D]` while copying each old reference once. |
| **R-5.7** | Find a duplicate ID among `n` integers restricted to `1..n−1`. For `[2, 3, 4, 1, 2]`, ID `2` repeats; it names the 6 cm² size. A Boolean seen array indexed by ID takes `O(n)` time and space. |
| **R-5.8** | Benchmark `pop(0)`, `pop(len(data)//2)`, and `pop()` starting each run with a fresh list of the same length. In nine cards, the first operation shifts eight references, the first middle operation shifts about four, and the last operation shifts none. For each starting length, perform that kind of pop until empty and report average microseconds per pop, as in the book's Table 5.5. |

Why is the charge in R-5.5 **7**, rather than 4? Each ordinary append costs 1. Between a growth from `k/2` to `k` and the next growth from `k` to `2k`, about `k/2` appends occur. Saving 6 units from each produces `3k` units to pay the next copy. A second check is the geometric series: over `n` appends, the total number of copied cells is less than `2n`, so copy cost is less than `6n`; ordinary writes cost `n`, giving less than `7n` total. This establishes **O(1) amortized** cost per append even though a single growth is `O(n)`.

For R-5.7, a sum trick works only under a stronger interpretation: every ID `1..n−1` appears at least once and exactly one appears twice. The wording alone is easy to misread. A seen array still detects a duplicate if the repeated ID has more than two occurrences. For R-5.8, recreate the input for every **complete run** and divide its elapsed time by the number of pops. The list deliberately gets shorter within a run; all three variants should start at the same length.

<span id="part-1-cipher-grid"></span>

### 3. Revisit ciphers and grids: R-5.9–R-5.12

These tasks draw on the [cipher in Section 5.5](05-05-using-array-based-sequences.md) and the grid in Section 5.6.

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **R-5.9** | Replace the fixed English uppercase alphabet with an explicit ordered alphabet of length `m`; rotate an index modulo `m`. If Greek card labels begin `Α, Β, Γ, Δ, …`, a one-position shift sends those four labels to `Β, Γ, Δ, Ε`. Decide how to handle each language's case and characters outside that alphabet. |
| **R-5.10** | Build the Caesar encoder and decoder strings with comprehensions and `''.join(...)` in the constructor. With shift 3, the uppercase encoder begins `DEFG…` and ends `…ABC`; its decoder reverses that mapping. |
| **R-5.11** | Use nested loops to sum all entries of the `n × n` area grid. The three row totals are 30, 18, and 26 cm², so the result is 74 cm². |
| **R-5.12** | Replace the explicit inner loop with `sum(sum(row) for row in grid)`. It still visits all nine area values and returns 74 cm². |

For R-5.9, direct arithmetic on `ord('A')` only fits the contiguous English `A`–`Z` mapping used by the original example. An explicitly listed alphabet tells the algorithm what counts as a letter and what order to rotate. For R-5.11 and R-5.12, the total is the **sum of individual card areas**, not the geometric union of their shapes.

> **Mental model:** A result can be a measurement, a new implementation, or a proof. Write down which kind the exercise asks for before choosing code.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity, C-5.13–C-5.20

<span id="part-2-growth"></span>

### 1. Initial capacity, shuffling, and slower growth

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **C-5.13** | Repeat the memory experiment starting with a nonempty list, such as the areas of `A`–`D`, then append `E`–`I`. Compare the *observed* expansion lengths with a run starting empty. Initial construction and Python build can affect the first allocation; measure instead of assuming one universal sequence. |
| **C-5.14** | Write a shuffle that treats every ordering equally under uniform random draws. Work from the last position toward the first, choosing `j` uniformly from `0..i` and swapping positions `i` and `j`. A shuffled `[A, B, C, D]` still has total area 34 cm². |
| **C-5.15** | If a full capacity `N` grows to about `1.25N`, show that repeated appends still cost `O(n)` overall. Earlier copy sizes form a geometric series; use a rounding rule that always adds at least one cell. |

For C-5.14, choose a different random range at each step:

```python
from random import randrange

def shuffle_cards(cards):
    for i in range(len(cards) - 1, 0, -1):
        j = randrange(i + 1)
        cards[i], cards[j] = cards[j], cards[i]
```

At step `i`, each remaining card has probability `1/(i+1)` of occupying that position, assuming uniform draws. This is the Fisher–Yates method. A shuffle changes **order**, not the multiset of areas or their sum. Python's [`random` documentation](https://docs.python.org/3/library/random.html#random.shuffle) describes its built-in shuffler; `random` is for simulation, not secure encryption.

For C-5.15, read the copy costs backward from the last growth: each earlier capacity is roughly `4/5` of the next. If the last copied capacity is at most about `n`, the total is bounded by a constant times `n(1 + 4/5 + (4/5)² + ⋯) = 5n`. The smaller growth factor increases the constant and number of resizes, but the overall bound remains linear.

<span id="part-2-shrink"></span>

### 2. Shrinking and the gap between thresholds

Growing at **full** and shrinking below **one quarter full** leaves space between the two thresholds. That gap is the basis of the following amortized arguments.

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **C-5.16** | Add `pop()` to the teaching `DynamicArray`: reject an empty array; otherwise return the last item, clear its reference, decrease `_n`, then halve capacity when `_n < _capacity/4`. For capacity 8, length 2 is exactly one quarter and stays put; a pop to length 1 triggers a shrink. Keep capacity at least 1. |
| **C-5.17** | Analyze `n` appends followed by `n` pops. Each growth and shrink copies a geometric series of card references, so the whole `2n`-operation sequence costs `O(n)`. |
| **C-5.18** | Extend that argument to *any* mixture of `n` appends and pops on an initially empty array. A costly grow needs many appends since the previous shrink; a costly quarter-full shrink needs many pops since the previous grow. Charge the copy to those operations. |
| **C-5.19** | Shrink to the **current length** when that length falls below one quarter of capacity. The next append may immediately grow the now-full array, so pair that growth's cost with the preceding shrink. The next large shrink still needs many pops; prove the total remains `O(n)`. |
| **C-5.20** | Change the threshold to **strictly below one half** and shrink to the current length. Now short append/pop cycles near half full can repeatedly copy a large array. Construct such a cycle to show a quadratic worst-case sequence. |

The difference between C-5.19 and C-5.20 is measurable in the copy count, not just the fraction printed in the rule. For C-5.19, a shrink to length `s` can be followed by one immediate grow, but another quarter-full shrink needs roughly `s/2` pops. For C-5.20, choose `m` as a power of two: append `m+1` items from empty, then pop once to reach capacity `2m`, length `m`. Pop to `m−1`: the array shrinks to `m−1`. Append: it is full, so it grows to `2m−2`. Two pops lead to length `m−2`, strictly below half capacity, and cause another shrink. Repeat while the size remains at least `m/2`. There are `Θ(m)` short cycles, each copying `Θ(m)` references, hence **Ω(m²)** work for `Θ(m)` operations, including the initial setup.

Do not transfer that failure to C-5.16: shrinking only below one quarter creates a wider gap before another large resize can occur. In the small card list, this means a single added or removed card near half full does not repeatedly repack most of the list.

> **Mental model:** An expensive resize is affordable when enough cheap operations occur before the next expensive resize. The threshold determines whether that separation exists.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Creativity, C-5.21–C-5.31

<span id="part-3-timing"></span>

### 1. Design fair timing experiments: C-5.21–C-5.24

These are experiment-design tasks. Use the same logical input and output for each method, several input sizes, and repeated measurements. The [`timeit` documentation](https://docs.python.org/3/library/timeit.html) gives a standard way to time short Python operations. Report your Python version and measured times; do not copy the book's timings as if they were current results.

| Exercise | Controlled comparison using the cards |
| :------- | :------------------------------------ |
| **C-5.21** | Build a long text from card labels and areas using four methods: repeated string `+=`, append pieces then `join`, list comprehension then `join`, and generator expression then `join`. Check that every method produces exactly the same text before comparing times. |
| **C-5.22** | Start with areas `A`–`D`; add `E`–`I` either by `extend` or five calls to `append`. Both must end with the nine-area list and total 74 cm². Time equivalent work over larger repeated inputs. |
| **C-5.23** | Convert card `(width, height)` records to areas with a list comprehension or an `append` loop. Both must produce `[6, 8, 16, 4, 6, 8, 16, 4, 6]`. |
| **C-5.24** | Time `remove` when the target is a unique labeled card at the beginning, middle, or end of a list. Use labels or unique records, since area `6` occurs three times and `remove(6)` always removes the first one. |

For C-5.24, `remove` first **searches by value** and then **shifts later entries**. Removing `A` has little search but many shifts; removing `I` has much search but no shift. All three positions can have `Θ(n)` work. To mirror Table 5.5, start each trial with `N` unique values, repeatedly select the current first, middle, or last value and call `remove` until empty, then divide elapsed time by `N`. Recreate that starting list for each complete trial and keep setup outside the timing. Timing alone does not establish a worst-case bound, and a particular Python build may optimize one expression differently.

<span id="part-3-scan"></span>

### 2. Scan, count, and find a missing value: C-5.25–C-5.28

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **C-5.25** | Remove **all** copies of an area in `O(n)` worst-case time. Scan once with a read index and a write index; keep every value unequal to the target, then delete the unused tail. Removing all 6 cm² cards leaves `[8, 16, 4, 8, 16, 4]`, total 56 cm². |
| **C-5.26** | Find five repeated **occurrences** among IDs restricted to `1..n−5`. Use a Boolean seen array and record each ID encountered after its first appearance. In our nine cards, the IDs are `[2, 3, 4, 1, 2, 3, 4, 1, 2]`; five extra occurrences appear, but only four distinct IDs repeat. State which interpretation of “five repeated” your output uses. |
| **C-5.27** | Mark which representable positive `k`-bit values occur, then scan for an unmarked value. With `k` about `log₂ n + 1`, a Boolean table of `2^k` entries is `O(n)` in the exercise's word-cost model. For the nine area values, `17` is one absent value representable in five bits. |
| **C-5.28** | Prove the previous task has an `Ω(n)` worst-case lower bound: if an algorithm leaves an input position unread, that position could contain its proposed answer. In general it must inspect all `n` entries to certify that answer is missing. |

The in-place compaction for C-5.25 is short enough to trace:

```python
def remove_all(data, value):
    write = 0
    for item in data:
        if item != value:
            data[write] = item
            write += 1
    del data[write:]
```

Each original item is read once; tail deletion is at most `n` more work, so total time is `O(n)` under ordinary unit-cost comparisons. The scan itself keeps only two counters, but Python's list deletion need not promise constant temporary space. Repeatedly calling `data.remove(value)` can rescan and shift the list many times, making a quadratic case.

For C-5.27 and C-5.28, interpret the requested answer as a **positive** representable integer, excluding zero. Otherwise zero would be absent from a list of positive integers without reading it, contradicting the intended `Ω(n)` lower bound. With `n ≥ 2` and `k = ⌈log₂ n⌉ + 1`, there are more than `n` positive candidates below `2^k`; the Boolean table still has `O(n)` cells. The textbook's cost model treats a `k`-bit integer operation as constant time. Python integers have variable precision, so a literal implementation's bit and memory costs need separate accounting. The existence argument is the pigeonhole principle.

<span id="part-3-join"></span>

### 3. Join, reassemble, and recurse: C-5.29–C-5.31

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **C-5.29** | Join pairs `(card, area)` with pairs `(area, size_name)` on their shared area. Index the second list by area, then emit `(card, area, size_name)` for every match; `A` joins with `(6, "small")` to produce `("A", 6, "small")`. If `K` triples are produced, expected hash-based time is `O(n + m + K)`, not simply `O(n + m)`. |
| **C-5.30** | Number each card record by its original position. If packets arrive in order `2, 0, 1, 4, 3, 5, 7, 6, 8`, put each in its numbered slot of a nine-cell list. When all slots are filled, reading left to right restores `A` through `I` in `O(n)` time and space. |
| **C-5.31** | Sum the grid recursively: add one row's sum to the recursive sum of the remaining rows, with zero for no rows. For the card grid, `30 + (18 + (26 + 0)) = 74` cm². Each of the nine entries is still visited once. |

A natural join may return many rows: if all `n` left pairs and all `m` right pairs have the same middle value, it must emit `nm` triples. That output alone costs `Ω(nm)` time and space if materialized. For packets, the `O(n)` claim assumes each sequence number is valid and each packet appears once; handling missing or duplicate packets requires detection or a stated policy. Recursion in C-5.31 changes control flow, not the number of grid cells to add; for a grid with `r` rows and `c` columns, the sum takes `O(rc)` time and `O(r)` recursion depth when only rows recurse.

> **Mental model:** A scan visits inputs; a join can also produce a large output; a packet index lets you restore order without sorting.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Projects, P-5.32–P-5.37

<span id="part-4-matrices"></span>

### 1. Three dimensions and matrix operations

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **P-5.32** | Add corresponding values in two equally shaped three-dimensional data sets. Think of two layers of small card grids; a value is chosen by `[layer][row][column]`. Check the shape at every level before adding. |
| **P-5.33** | Give a `Matrix` class addition and multiplication with the appropriate dimension checks. Addition needs equal shapes and adds matching cells. Multiplication needs `columns(left) = rows(right)` and uses row-by-column dot products. |

For P-5.32, let `M = [[6, 8], [16, 4]]` and `Z = [[0, 0], [0, 0]]`. Let `X` have two **independent copies** of `M` as its layers, and let `Y` have layers `Z` and another copy of `M`. Their componentwise sum is `[M, [[12, 16], [32, 8]]]`. Layer totals are **34** and **68 cm²**, for **102 cm²** altogether. This is addition at each of eight matching positions, not concatenation of layers. In Python, `[[row[:] for row in M] for _ in range(2)]` builds `X` without shared mutable rows.

For P-5.33, use `M` and `Q = [[4, 16], [8, 6]]` as simple number matrices:

```text
M + Q = [[10, 24], [24, 10]]
M × Q = [[88, 144], [96, 280]]
```

The top-left product entry is `6×4 + 8×8 = 88`; in general, `(M×Q)[i][j] = sum(M[i][t] * Q[t][j] for t in shared_indices)`. Multiplication is **not** entrywise multiplication. If these entries are treated as physical areas, products have units cm⁴, so the matrix product is an algebra exercise rather than another area total. Reject empty or ragged matrices unless the class explicitly defines their behavior.

<span id="part-4-ciphers"></span>

### 2. Extend a cipher by separating its mapping

The [Section 5.5 report](05-05-using-array-based-sequences.md) is `MAX=16; TOTAL=74`. The following projects share a mapping idea but ask for different constructors and class relationships.

| Exercise | Reexplanation and card study case |
| :------- | :-------------------------------- |
| **P-5.34** | Preserve upper- and lowercase English letters under a Caesar shift, while leaving digits and punctuation alone. A shift of 3 sends `Max=16; Total=74` to `Pda=16; Wrwdo=74`. |
| **P-5.35** | Accept a 26-letter uppercase permutation as the substitution encoder. Validate that every `A`–`Z` letter appears exactly once, then construct the inverse decoder from the encoder. A reverse-alphabet mapping sends `MAX=16; TOTAL=74` to `NZC=16; GLGZO=74`. |
| **P-5.36** | Implement `CaesarCipher` as a `SubstitutionCipher` subclass. Its constructor creates the shifted 26-letter permutation and passes it to the parent constructor; shift 3 again gives `PDA=16; WRWDO=74`. |
| **P-5.37** | Implement `RandomCipher` as another subclass. Its constructor shuffles the uppercase alphabet into a permutation and lets the parent build the inverse. The ciphertext varies; test that decrypting the encrypted report restores the report. |

For P-5.34, check ASCII uppercase and lowercase ranges separately; `str.isupper()` also recognizes letters outside `A`–`Z`. For P-5.35–P-5.37, a **permutation** is essential: if two plaintext letters map to one ciphertext letter, decryption cannot choose the original. The parent class should own encryption and decryption, while each subclass chooses a mapping. These exercises teach mapping mechanics; a simple substitution cipher is not suitable for protecting private information.

> **Mental model:** Matrix methods depend on shape; cipher methods depend on a reversible alphabet mapping. Validate those conditions at construction or operation time.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

<span id="part-5-program"></span>

### 1. Reassemble, total, filter, and join the cards

This small runnable program links packet order (C-5.30), the grid sum (R-5.11/R-5.12), one-pass removal (C-5.25), and a join (C-5.29). Its input cards are the same `A`–`I` used throughout the chapter.

```python
def remove_all(data, value):
    write = 0
    for item in data:
        if item != value:
            data[write] = item
            write += 1
    del data[write:]


def join_on_area(card_areas, area_names):
    by_area = {}
    for area, name in area_names:
        by_area.setdefault(area, []).append(name)
    return [
        (label, area, name)
        for label, area in card_areas
        for name in by_area.get(area, ())
    ]


cards = [
    ("A", 2, 3), ("B", 4, 2), ("C", 4, 4),
    ("D", 2, 2), ("E", 2, 3), ("F", 4, 2),
    ("G", 4, 4), ("H", 2, 2), ("I", 2, 3),
]
arrival_order = [2, 0, 1, 4, 3, 5, 7, 6, 8]
packets = [(i, cards[i]) for i in arrival_order]

restored = [None] * len(cards)
for position, card in packets:
    if not 0 <= position < len(restored) or restored[position] is not None:
        raise ValueError("invalid or repeated packet number")
    restored[position] = card
if any(card is None for card in restored):
    raise ValueError("a packet is missing")

card_areas = [(label, width * height) for label, width, height in restored]
areas = [area for _, area in card_areas]
grid = [areas[i:i + 3] for i in range(0, len(areas), 3)]
without_six = areas.copy()
remove_all(without_six, 6)

area_names = [(4, "small"), (6, "small"), (8, "medium"), (16, "large")]
joined = join_on_area(card_areas, area_names)

print("restored:", "".join(label for label, _, _ in restored))
print("areas:", areas)
print("grid total:", sum(sum(row) for row in grid), "cm^2")
print("without 6:", without_six, "total", sum(without_six), "cm^2")
print("joined A:", joined[0])
print("joined rows:", len(joined))
```

<span id="part-5-trace"></span>

### 2. Trace its result

```text
restored: ABCDEFGHI
areas: [6, 8, 16, 4, 6, 8, 16, 4, 6]
grid total: 74 cm^2
without 6: [8, 16, 4, 8, 16, 4] total 56 cm^2
joined A: ('A', 6, 'small')
joined rows: 9
```

The numbered slots restore the original card order even though arrivals are scrambled. The grid counts all nine cards once. Removing three 6 cm² entries subtracts 18 cm² from 74 cm². Each card joins one size-name row here, so the join produces nine rows; other inputs could produce more or fewer matches. The functions' time bounds are `O(n)` for packet placement and removal and expected `O(n + m + K)` for the join, where `K` is the number of resulting rows.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why does a full array need seven units charged per append?</strong></summary>

Imagine adding cards one at a time to a backing array that doubles. A normal write costs 1 unit. Copying `k` old card references at a growth costs `3k`. Since roughly `k/2` new cards arrived since the previous growth, saving 6 units from each gives `6(k/2) = 3k` for the copy. Thus charging 1 + 6 = **7** units per append pays for all work over a sequence. The occasional expensive append is still expensive by itself.

</details>

<details>
<summary><strong>Case Study 2: Which duplicate does the card-ID array contain?</strong></summary>

The first five cards have size IDs `[2, 3, 4, 1, 2]`. Mark IDs 2, 3, 4, and 1 as seen in order. The final 2 is already marked, so the repeated ID is **2**, corresponding to area **6 cm²**. These are IDs in `1..4`; applying the exercise's numeric range directly to area values such as 16 would be incorrect.

</details>

<details>
<summary><strong>Case Study 3: Can a shuffle change the total area?</strong></summary>

Suppose a valid shuffle changes `[A, B, C, D]` to `[C, D, A, B]`. The areas change order from `[6, 8, 16, 4]` to `[16, 4, 6, 8]`, but both totals are **34 cm²**. A shuffle is a permutation of positions, so every card occurs exactly once after it.

</details>

<details>
<summary><strong>Case Study 4: Why is repeated `remove(6)` the wrong cost argument?</strong></summary>

Each call may scan to find the next 6 and shift later references. If many of `n` areas equal 6, doing that up to `n` times can cost `Θ(n²)`. A single read/write pass copies the six areas that are not 6 toward the front, then deletes the tail. Its output is `[8, 16, 4, 8, 16, 4]`, and **74 − 3×6 = 56 cm²** remains.

</details>

<details>
<summary><strong>Case Study 5: What does a joined row mean?</strong></summary>

The left pair `("C", 16)` says card `C` has area 16 cm². The right pair `(16, "large")` says area 16 belongs to the `large` category. Matching the middle value produces `("C", 16, "large")`. If three category rows shared area 16, `C` would produce three triples, and a runtime analysis must count all three outputs.

</details>

<details>
<summary><strong>Case Study 6: How do matrix addition and multiplication differ?</strong></summary>

For `M = [[6, 8], [16, 4]]` and `Q = [[4, 16], [8, 6]]`, addition matches positions: top-left is `6 + 4 = 10`. Multiplication combines a row and a column: top-left is `6×4 + 8×8 = 88`. Thus `M + Q` and `M × Q` answer different mathematical questions; a matrix class needs separate shape checks and separate algorithms.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Exercise range | Main question | Rectangle-card reminder |
| :------------- | :------------ | :---------------------- |
| **R-5.1–R-5.3; C-5.13** | What does a particular Python build reveal about list allocation? | Measure size jumps while adding and removing `A`–`I`; do not assume fixed jump points. |
| **R-5.4–R-5.8; C-5.15–C-5.20** | How do indexing, insertion, removal, and resizing affect cost? | Separate occupied cards from allocated slots; count shifts and copied references. |
| **C-5.14; C-5.21–C-5.24** | How do we shuffle fairly and compare implementation choices fairly? | A permutation preserves area totals; each benchmark must perform equivalent card work. |
| **R-5.7; C-5.25–C-5.30** | How do scans, joins, and numbered positions organize data? | IDs find repeats, one pass removes areas, joins add categories, packet numbers restore order. |
| **R-5.11–R-5.12; C-5.31; P-5.32–P-5.33** | How do nested dimensions change access and arithmetic? | The 3 × 3 area grid totals 74 cm²; matrix multiplication is a row-by-column operation. |
| **R-5.9–R-5.10; P-5.34–P-5.37** | How does a reversible alphabet mapping support cipher variants? | Encode the same `MAX=16; TOTAL=74` report and construct an inverse mapping. |

The chapter's exercises connect observation, implementation, and proof. Check a small geometry example to catch indexing or arithmetic mistakes; use a separate cost argument when the question asks for a complexity bound.

> **Final mental model:** Keep the cards fixed, change one operation at a time, and match the evidence to the question: a trace for behavior, measurements for experiments, and counted work for proofs.

[🔝 Back to Top](#top)
