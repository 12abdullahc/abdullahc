<span id="top"></span>

# 10.6 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 10, Section 10.6, printed pages 452–458 ([supplied Chapter 10 PDF](<../Data Structures and Algorithms in Python - C10.pdf>)).<br>
> **Topic:** 10.6 Exercises: Reinforcement (R-10.1–R-10.27), Creativity (C-10.28–C-10.49), and Projects (P-10.50–P-10.55).<br>
> **Domain Focus:** One rectangle-card catalog used to practice maps, collisions, ordered searches, maxima, skip lists, sets, and indexes.<br>
> **User Prompt:** Reexplain Section 10.6 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Catalog, Many Questions](#background)
   - [1. The established rectangle cards](#background-cards)
   - [2. How to read an exercise](#background-method)
2. [Part 1: Reinforcement (R-10.1–R-10.27)](#part-1)
   - [1. Map methods and representations (R-10.1–R-10.5)](#part-1-maps)
   - [2. Hashing and collisions (R-10.6–R-10.17)](#part-1-hashing)
   - [3. Sorted maps, maxima, and skip lists (R-10.18–R-10.24)](#part-1-ordered)
   - [4. Sets and birthdays (R-10.25–R-10.27)](#part-1-sets)
3. [Part 2: Creativity (C-10.28–C-10.49)](#part-2)
   - [1. Improve and measure hash maps (C-10.28–C-10.37)](#part-2-hashing)
   - [2. Search ordered data and find maxima (C-10.38–C-10.43)](#part-2-ordered)
   - [3. Extend skip lists (C-10.44–C-10.45)](#part-2-skips)
   - [4. Sets, indexes, and insertion order (C-10.46–C-10.49)](#part-2-collections)
4. [Part 3: Projects (P-10.50–P-10.55)](#part-3)
   - [1. Measure hash-code collisions (P-10.50–P-10.51)](#part-3-experiments)
   - [2. Build ordered maps and skip lists (P-10.52–P-10.54)](#part-3-build)
   - [3. Check spelling with a set (P-10.55)](#part-3-spelling)
5. [Part 4: One Connected Geometry Program](#part-4)
   - [1. Run the catalog through four structures](#part-4-program)
   - [2. Read the results](#part-4-output)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Catalog, Many Questions

Section 10.6 is an **exercise collection**, not another data-structure implementation. Its three groups ask you to use, adapt, and combine the ideas from [maps](10-01-maps-and-dictionaries.md), [hash tables](10-02-hash-tables.md), [sorted maps](10-03-sorted-maps.md), [skip lists](10-04-skip-lists.md), and [sets and multimaps](10-05-sets-multisets-and-multimaps.md). The tables below paraphrase each exercise and give a first step. The later cases work through selected techniques.

<span id="background-cards"></span>

### 1. The established rectangle cards

The class is still cutting rectangular cards for a display. The six-design catalog from Section 10.5 is:

| Design | Width × height | Area | Perimeter | Stable ID for hashing |
| :--- | :--- | ---: | ---: | ---: |
| A | 2 × 3 cm | 6 cm² | 10 cm | 3 |
| B | 4 × 2 cm | 8 cm² | 12 cm | 10 |
| C | 4 × 4 cm | 16 cm² | 16 cm | 17 |
| D | 2 × 2 cm | 4 cm² | 8 cm | 24 |
| F | 1 × 6 cm | 6 cm² | 14 cm | — |
| G | 3 × 4 cm | 12 cm² | 14 cm | — |

For a rectangle, **area = width × height** and **perimeter = 2(width + height)**. A and F have equal area but remain different designs. Section 10.3 also considered E, a `3 × 3` cm square with area `9` cm² and perimeter `12` cm; we add it only when a maxima example needs it.

The earlier choice stream was `A, C, A, X, B, A, C`. The unknown label X is rejected. The accepted cards are `A, C, A, B, A, C`: three A, one B, and two C, for `3(6) + 1(8) + 2(16) = 58` cm².

<span id="background-method"></span>

### 2. How to read an exercise

Every exercise becomes easier when you answer three questions first:

1. **What is the key or element?** A label identifies a design; an area groups designs; a date groups birthdays.
2. **What must remain true?** Examples: map keys are unique, a probe must still find every stored key, and every upper skip-list level is a subset of the level below.
3. **What cost is being measured?** Let `n` be the number of stored entries and `m` the number of hash-table slots. A worst-case bound differs from an expected bound that assumes well-distributed hashes or random skip-list promotions.

| Question about the display | Suitable view |
| :--- | :--- |
| What is A's area? | Map: label → area |
| Which designs have area 6? | Multimap: `6 → [A, F]` |
| Which distinct designs were chosen? | Set: `{A, B, C}` |
| How many physical cards were chosen? | Multiset/counts: `A:3, B:1, C:2` |
| What is the first available area at least 7? | Sorted map: successor is area `8` |
| Which design gives more area for no more border? | Cost–performance maxima |

> **Mental model:** Identify the question, choose the key, state the invariant, then count the work. The same rectangles let us check each choice.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement (R-10.1–R-10.27)

These exercises rehearse the chapter's definitions and trace its algorithms. Each row names the skill and a concrete way to begin.

<span id="part-1-maps"></span>

### 1. Map methods and representations (R-10.1–R-10.5)

A **map** stores one value per key. The `MutableMapping` abstract base class can derive convenient operations from five core methods: lookup, assignment, deletion, iteration, and length. An unsorted table map scans its entries to find a key.

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| R-10.1 | Derive `pop(key[, default])` from the five map methods. | Look up A, delete it, and return its area. For a missing X, distinguish an omitted default from a supplied `None` using a unique sentinel. |
| R-10.2 | Derive `items()` and analyze it on an unsorted table. | Yield each label with `self[label]`. If each lookup scans `n` entries, all `n` pairs take Θ(`n²`). |
| R-10.3 | Override `items()` for an unsorted table. | Visit stored entries directly to produce every label–area pair in Θ(`n`) total time. |
| R-10.4 | Bound `n` insertions into an initially empty unsorted table. | Insert `n` new labels; successive scans of lengths `0, 1, …, n−1` sum to Θ(`n²`) in the worst case. |
| R-10.5 | Replace the Python-list backing store with a positional list. | Keep the same key search and update behavior; deleting a located position is constant time, but locating it still takes linear time. |

**Background:** A derived method can be correct yet slower than a method that uses the representation directly. R-10.2 and R-10.3 make this distinction visible.

<span id="part-1-hashing"></span>

### 2. Hashing and collisions (R-10.6–R-10.17)

A hash table converts a key into a **home slot**. Its load factor is `α = n/m`. A collision means two keys choose the same home slot. Chaining keeps a collection at each slot; open addressing searches other slots inside the table.

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| R-10.6 | Decide which collision schemes can have `α > 1`. | Several IDs may live in one chain. An open-addressed table needs a slot for every stored entry. |
| R-10.7 | Hash position objects consistently with equality. | If two positions name the same underlying node, their hashes must match; stable node identity is one possible basis. |
| R-10.8 | Design a hash code for patterned VIN strings. | Mix characters in order, such as with a polynomial accumulation; merely summing characters makes reordered strings collide. |
| R-10.9 | Place the book's eleven integers with separate chaining. | Compute each home slot, then append colliding keys to that slot's chain. |
| R-10.10 | Place the same keys with linear probing. | After a collision, try the next slot, wrapping around. |
| R-10.11 | Place the same keys with quadratic probing. | Try `(h(k) + i²) mod 11` for `i = 0, 1, …`; check whether the sequence actually finds an empty slot. |
| R-10.12 | Place the same keys with double hashing. | Advance by `h′(k) = 7 − (k mod 7)` rather than by one. |
| R-10.13 | Give best and worst total time for `n` chained insertions. | With constant-time hashing and well-spread keys, total insertion is Θ(`n`); one growing chain can cause Θ(`n²`). |
| R-10.14 | Rehash the entries in Figure 10.6 into a 19-cell table. | Use the stated `h(k) = 3k mod 17` literally: it gives home slots `0` through `16`, even though the table has cells `17` and `18`. |
| R-10.15 | Make the resize threshold configurable. | Store a maximum permitted load factor in the base class, apply it after insertion, and update the concrete hash-map subclasses to use it. |
| R-10.16 | Write quadratic-probing insertion with a deletion marker. | Remember the first `AVAILABLE` slot, but continue searching for an existing equal key before inserting. |
| R-10.17 | Change `ProbeHashMap` to quadratic probing. | Make every lookup, insertion, and deletion follow the same probe sequence. |

For R-10.9–R-10.12, the book reuses the key sequence `12, 44, 13, 88, 23, 94, 11, 39, 20, 16, 5` and `h(k) = (3k + 5) mod 11`. Use the **same insertion order** for all four schemes. A particularly useful check is that quadratic probing cannot insert the final key `5` under this rule, although slot `4` remains empty. Its probe sequence does not visit that slot. This is why “there is free space” alone does not prove an open-addressing insertion will succeed.

<span id="part-1-ordered"></span>

### 3. Sorted maps, maxima, and skip lists (R-10.18–R-10.24)

A **sorted map** answers predecessor, successor, and range questions by key order. A skip list supports the same kind of search through randomly chosen upper levels. A **maxima set** retains cost–performance pairs that no other pair dominates: lower cost and higher performance are better.

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| R-10.18 | Explain why a hash table is a poor direct representation for sorted-map operations. | A bucket number does not reveal whether area `8` follows area `6`. |
| R-10.19 | Design a sorted map with a doubly linked list. | Keep area keys in order; predecessor/successor are easy once a node is found, while search is linear. |
| R-10.20 | Bound `n` deletions from a sorted table initially holding `2n` entries. | Each array deletion can shift Θ(`n`) entries, so the worst-case total is Θ(`n²`). |
| R-10.21 | Analyze a binary-search variant that continues left on equality. | With unique map keys, it finds the same position as the original; it also behaves as a left-bound search when duplicates are later allowed. |
| R-10.22 | Compare two streams of cost–performance pairs. | Lower cost with lower performance preserves trade-offs; lower cost with higher performance removes older dominated pairs. State which map implementation supplies your time bound. |
| R-10.23 | Draw skip-list updates to Figure 10.13. | Trace deletion of `38`, insertion of `48` and `24`, then deletion of `55`. Record the coin flips: different flips give valid different drawings. |
| R-10.24 | Write skip-list deletion pseudocode. | Search once for the key, remove every node in its tower, then remove empty top levels. |

For R-10.22, if a skip-list sorted map implements the chapter's maxima-set algorithm, `n` successively cheaper **and lower-performing** entries all remain, giving expected Θ(`n log n`) total work. If each new entry is cheaper **and better**, it replaces the sole previous maximum, so the map stays tiny and total work is expected Θ(`n`). An array-backed sorted map has different shift costs.

<span id="part-1-sets"></span>

### 4. Sets and birthdays (R-10.25–R-10.27)

A set stores distinct elements. Its five basic mutable-set behaviors are membership, iteration, length, addition, and discard. A multimap associates one key with several values.

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| R-10.25 | Derive `MutableSet.pop()`. | Take any element from iteration, discard it, and return it; raise `KeyError` for an empty set. |
| R-10.26 | Derive `isdisjoint` and its runtime. | Iterate the smaller of two design sets and test membership in the larger. The O(`min(n,m)`) claim assumes constant-time membership in the larger set. |
| R-10.27 | Choose a birthday database structure for “everyone today” and “next birthday.” | Use recurring month/day keys with a collection of names at each key; after the final date, wrap to the first. |

The birthday question combines two requirements: **duplicates** (several friends can share one date) and **order** (find the next date). Use month/day rather than the original birth year to order recurring birthdays. A plain map from date to one name loses friends, and an unordered set cannot directly answer “next.”

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity (C-10.28–C-10.49)

These exercises change implementations or combine chapter ideas. A useful rule is to preserve the original public behavior before claiming a faster implementation.

<span id="part-2-hashing"></span>

### 1. Improve and measure hash maps (C-10.28–C-10.37)

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| C-10.28 | Optimize `setdefault` in `UnsortedTableMap`. | Search for A once; return its value if found, or append A with the default. |
| C-10.29 | Optimize `setdefault` in `ProbeHashMap`. | Reuse one probe walk to find either A's slot or the insertion slot. |
| C-10.30 | Optimize `setdefault` in `ChainHashMap`. | Search one chain once, inserting only if its key is absent. |
| C-10.31 | Find a prime in `[M, 2M]` using a sieve. | Mark multiples of primes through `√(2M)`, then inspect the inclusive target interval. |
| C-10.32 | Compare chained and probed hash maps experimentally. | Insert the same seeded random IDs at several load thresholds; record operation times and collision behavior. |
| C-10.33 | Store small chain buckets more compactly. | Represent an empty bucket by `None`, a one-item bucket by its item, and larger buckets by a collection. |
| C-10.34 | Cache an item's hash code. | During a resize, recompute only its table slot, not the hash of a long original key. |
| C-10.35 | Delete from linear probing without tombstones. | Repair the following collision cluster so every surviving key is still reachable from its home slot. |
| C-10.36 | Prove the reach of quadratic probe offsets. | For an odd prime `N`, `i²` gives only `(N−1)/2` distinct nonzero offsets; for `N ≡ 3 (mod 4)`, alternating `+i²` and `−i²` covers every nonzero offset. |
| C-10.37 | Make probing a replaceable strategy. | Share table logic while subclasses supply linear or quadratic probe positions. |

**Why C-10.36 matters:** For an odd prime `N`, `i` and `N−i` have the same square modulo `N`. Counting the home slot `i=0` gives only `(N+1)/2` distinct slots under ordinary `+i²` probing. When `N ≡ 3 (mod 4)`, the negatives of those nonzero squares fill the other half, so the alternating `±i²` rule can reach all `N` slots. This is a claim about a specific probe rule, not about every use of quadratic probing.

<span id="part-2-ordered"></span>

### 2. Search ordered data and find maxima (C-10.38–C-10.43)

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| C-10.38 | Support repeated keys in a sorted search table. | Find the first area `6` in O(`log n`), then emit its `s` matching designs in O(`s`): total O(`log n + s`). |
| C-10.39 | Revisit the two binary searches when keys repeat. | The original search can stop at a middle `6`; R-10.21's leftward variant returns the first `6`. |
| C-10.40 | Select the `k`th key from two sorted tables in O(`log² n`). | Binary-search candidate ranks in each table; for each candidate, binary-search the other table to find its combined rank. |
| C-10.41 | Improve that selection to O(`log n`). | Binary-search a partition `i + j = k` whose left-side keys are all no greater than its right-side keys. |
| C-10.42 | Count 1s in an `n × n` binary matrix in O(`n log n`). | In each row, binary-search the change from leading 1s to trailing 0s; add the row counts. |
| C-10.43 | Find all cost–performance maxima in O(`n log n`). | Sort by increasing perimeter; for equal perimeters keep the largest area, then retain only new area records. |

C-10.40 and C-10.41 assume the two tables have no duplicate keys across them. C-10.42 guarantees order **within each row**, so searching one row does not locate the boundary in another. In C-10.43, a rectangle with a smaller perimeter and at least as much area dominates a worse rectangle.

<span id="part-2-skips"></span>

### 3. Extend skip lists (C-10.44–C-10.45)

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| C-10.44 | Insert and delete top-down without `above` or `prev` links. | Choose the new tower height first; scan forward and down, splicing or unlinking nodes at the levels you encounter. |
| C-10.45 | Retrieve an item by rank in expected O(`log n`). | Store a span on each forward link so a search can skip a known number of bottom-level entries. |

A normal skip-list search compares **keys**, such as area `7` versus area `8`. Rank lookup asks for the **third entry**, regardless of key. The extra spans tell us how many bottom-level entries each long horizontal jump passes.

<span id="part-2-collections"></span>

### 4. Sets, indexes, and insertion order (C-10.46–C-10.49)

| Exercise | What to work out | First step with the cards |
| :--- | :--- | :--- |
| C-10.46 | Derive mutable-set symmetric difference. | Copy one design set; toggle membership for each element in the other. |
| C-10.47 | Derive mutable-set intersection. | Start an empty set and add only designs present in both inputs. |
| C-10.48 | Build an inverted file for text. | Map each word to every position where it appears in card descriptions; keep words in sorted order for ordered queries. |
| C-10.49 | Design an insertion-ordered dictionary with fast operations. | Combine a hash map `key → list node` with a doubly linked list in arrival order. Updating an existing key keeps its position. |

**Insertion order differs from sorted-key order.** If cards arrive C, A, B, an insertion-ordered dictionary iterates C, A, B; an area-sorted map might iterate A, B, C. An inverted index stores **positions**, not just the fact that a word exists.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Projects (P-10.50–P-10.55)

The projects ask for complete artifacts or experiments. Start with a small verifiable card dataset before scaling to a larger input.

<span id="part-3-experiments"></span>

### 1. Measure hash-code collisions (P-10.50–P-10.51)

| Exercise | What to build | First small check |
| :--- | :--- | :--- |
| P-10.50 | Compare string hash-code schemes using Internet text files. | First hash labels and geometry terms such as “square” and “rectangle”; define a collision-counting rule for **distinct strings with equal hash codes**. |
| P-10.51 | Repeat a collision study on ten-digit phone numbers. | Generate or obtain a repeatable sample, then compare distinct-number collisions under the chosen hash codes. |

A **hash-code collision** occurs before compression to a table slot. Use a table keyed by full hash code to detect distinct strings or numbers sharing a code. Two different codes can still compress to the same slot, so do not mix the two counts. For a reproducible experiment, record the sample size, random seed or data source, hash functions, and collision-counting rule.

<span id="part-3-build"></span>

### 2. Build ordered maps and skip lists (P-10.52–P-10.54)

| Exercise | What to build | First small check |
| :--- | :--- | :--- |
| P-10.52 | Implement the insertion-ordered dictionary from C-10.49. | Insert A, B, C; change B's area; iteration should still visit A, B, C. |
| P-10.53 | Implement the sorted-map ADT using a skip list. | Insert distinct area keys `4, 6, 8`; check lookup, predecessor, successor, range, replacement, and deletion. |
| P-10.54 | Animate skip-list search, insertion, and deletion. | Show the path to area `8` and the random promotions when area `12` is inserted. |

For P-10.53, area `6` must have a value such as `[A, F]` if both designs are to remain visible; a sorted **map** still has one value per distinct key.

<span id="part-3-spelling"></span>

### 3. Check spelling with a set (P-10.55)

| Exercise | What to build | First small check |
| :--- | :--- | :--- |
| P-10.55 | Return the word itself if found, or dictionary words one edit away. | Put `rectangle` in a set; swapping adjacent letters in `rectanlge` can propose `rectangle`. Also try insertion, deletion, and replacement. |

A set makes candidate membership checks fast on average. Generate candidates, test them against the word set, and remove duplicate suggestions. The optional phonetic idea is an extension to the one-edit checker.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Program

This small program uses ordinary Python collections to **illustrate** the exercise ideas. Its seven-slot lists are explicit toy hash tables; `dict` itself is not being used as the implementation of the collision exercise.

<span id="part-4-program"></span>

### 1. Run the catalog through the chapter's structures

```python
from bisect import bisect_left
from collections import Counter, defaultdict

catalog = {
    "A": (2, 3), "B": (4, 2), "C": (4, 4),
    "D": (2, 2), "F": (1, 6), "G": (3, 4),
}
area = {label: width * height for label, (width, height) in catalog.items()}

# A map and a multimap answer different questions.
by_area = defaultdict(list)
for label, square_cm in area.items():
    by_area[square_cm].append(label)

# Four stable IDs collide at home slot 3 of a seven-slot table.
ids = {"A": 3, "B": 10, "C": 17, "D": 24}
chains = [[] for _ in range(7)]
linear = [None] * 7
for label, key in ids.items():
    home = key % 7
    chains[home].append(label)
    slot = home
    while linear[slot] is not None:
        slot = (slot + 1) % 7
    linear[slot] = label

# Sorted rows retain both designs with area 6.
rows = sorted((square_cm, label) for label, square_cm in area.items())
areas = [square_cm for square_cm, _ in rows]
first_six = bisect_left(areas, 6)
first_at_least_seven = bisect_left(areas, 7)

# Cost is perimeter; performance is area. E is an added candidate.
candidates = {**catalog, "E": (3, 3)}
points = sorted(
    (2 * (width + height), width * height, label)
    for label, (width, height) in candidates.items()
)
maxima = []
best_area = -1
i = 0
while i < len(points):
    cost = points[i][0]
    same_cost = []
    while i < len(points) and points[i][0] == cost:
        same_cost.append(points[i])
        i += 1
    best_here = max(same_cost, key=lambda point: point[1])
    if best_here[1] > best_area:
        maxima.append((best_here[2], cost, best_here[1]))
        best_area = best_here[1]

choices = ["A", "C", "A", "X", "B", "A", "C"]
accepted = [label for label in choices if label in catalog]
counts = Counter(accepted)

print("A's area:", area["A"])
print("Designs with area 6:", by_area[6])
print("Chain at slot 3:", chains[3])
print("Linear slots:", {i: label for i, label in enumerate(linear) if label})
print("First area 6 row:", rows[first_six])
print("First area >= 7:", rows[first_at_least_seven])
print("Maxima (label, perimeter, area):", maxima)
print("Chosen designs:", sorted(set(accepted)))
print("Counts:", {label: counts[label] for label in sorted(counts)})
print("Total chosen area:", sum(area[label] for label in accepted))
```

<span id="part-4-output"></span>

### 2. Read the results

```text
A's area: 6
Designs with area 6: ['A', 'F']
Chain at slot 3: ['A', 'B', 'C', 'D']
Linear slots: {3: 'A', 4: 'B', 5: 'C', 6: 'D'}
First area 6 row: (6, 'A')
First area >= 7: (8, 'B')
Maxima (label, perimeter, area): [('D', 8, 4), ('A', 10, 6), ('E', 12, 9), ('G', 14, 12), ('C', 16, 16)]
Chosen designs: ['A', 'B', 'C']
Counts: {'A': 3, 'B': 1, 'C': 2}
Total chosen area: 58
```

The **map** answers A → 6. The **multimap** keeps A and F under area 6. Hashing the four IDs modulo 7 puts all four in one chain, while linear probing places them in successive free slots. The sorted rows return A as the first area-6 design and B as the first design with area at least 7. The maxima scan excludes B because E has the same perimeter and more area, and excludes F because cheaper A already has the same area. Finally, a set gives three chosen designs, while the counter and sum account for six physical cards.

The maxima computation sorts `n` points, then scans each equal-perimeter group once: O(`n log n`) time overall. The sample keeps one representative at each winning cost; an application that must preserve several designs with identical cost and area can collect all tied labels.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

Try each question before opening its work. The cases connect the same catalog to the different exercise groups.

<details>
<summary><strong>Case 1 — Why does a hash collision not mean the keys are equal?</strong></summary>

**Question.** A, B, C, and D have stable IDs `3, 10, 17, 24`. What happens with `h(k) = k mod 7` under chaining and linear probing?

**Work.** Each ID has remainder `3`, so all four choose home slot `3`. Chaining stores `[A, B, C, D]` at slot `3`. Linear probing stores A at `3`, then B at `4`, C at `5`, and D at `6`.

**Answer.** The four IDs are distinct keys with the same home slot. Collision resolution keeps all four. Their equality is determined by the full ID, not by the remainder.

</details>

<details>
<summary><strong>Case 2 — Why must an area query use a multimap or duplicate rows?</strong></summary>

**Question.** The sorted catalog has rows `(4,D), (6,A), (6,F), (8,B), (12,G), (16,C)`. What should “all designs with area 6” return, and what does a left-bound search do?

**Work.** A conventional map keyed by area can hold only one value at key `6`. A multimap stores `6 → [A,F]`, or a sorted search table can store two rows. A left-bound binary search for `6` returns index `1`; scanning equal keys then yields A and F. The original `_find_index` from Section 10.3 may stop at the middle equal row instead, which is why C-10.39 asks about duplicates.

**Answer.** Return both A and F. Finding the first match and scanning its `s` equals costs O(`log n + s`).

</details>

<details>
<summary><strong>Case 3 — Which rectangles belong to a border-versus-area maxima set?</strong></summary>

**Question.** Treat perimeter as a cost to minimize and area as a performance to maximize. Include E, the `3 × 3` square, alongside the six-design catalog. Which designs remain?

**Work.** In increasing perimeter order, the best area at each cost is D `(8,4)`, A `(10,6)`, E `(12,9)`, G `(14,12)`, and C `(16,16)`. B `(12,8)` is dominated by E at equal cost; F `(14,6)` is dominated by A at lower cost and equal area. Each surviving point increases area as cost increases, so no cheaper survivor offers at least as much area.

**Answer.** The maxima are D, A, E, G, and C. With the original six-design catalog alone, B remains and E is absent.

</details>

<details>
<summary><strong>Case 4 — How does one skip list answer an ordered area question?</strong></summary>

**Question.** Suppose a skip list stores distinct area keys `4, 6, 8, 12, 16`, with value `[A,F]` at key `6`. What is the first key at least `7`?

**Work.** Search horizontally while the next key is less than `7`, then descend a level. At the bottom, the predecessor is `6` and the next key is `8`. An example set of levels is:

```text
top:     -∞ -------------------------- +∞
level 2: -∞ -------- 8 --------------- +∞
level 1: -∞ -- 4 ---- 8 -- 12 --------- +∞
bottom:  -∞ -- 4 -- 6 -- 8 -- 12 -- 16 -- +∞
```

The upper levels are samples of the bottom level. Their exact shape depends on coin flips; the ordered answer does not.

**Answer.** Key `8`, whose value is design B.

</details>

<details>
<summary><strong>Case 5 — Why do set and multiset totals differ?</strong></summary>

**Question.** The accepted choices are `A, C, A, B, A, C`. How many designs and physical cards were chosen, and what is their total area?

**Work.** The set `{A,B,C}` has three labels. The counts are A:3, B:1, C:2, giving six physical cards. Add each physical card's area: `3 × 6 + 1 × 8 + 2 × 16 = 58` cm².

**Answer.** Three distinct designs, six cards, and `58` cm². Summing each set member once would give `30` cm² and answer a different question.

</details>

<details>
<summary><strong>Case 6 — How can a binary grid exercise use the same geometry?</strong></summary>

**Question.** A four-row display grid marks occupied cells with 1. Each row's 1s come before its 0s: `1110`, `1100`, `1000`, `0000`. How many cells are occupied?

**Work.** Binary-search each row for its first 0. The boundary indexes are `3, 2, 1, 0`, which are also the row counts of 1s. Add them: `3 + 2 + 1 + 0 = 6`.

**Answer.** Six occupied cells. C-10.42 scales the same rowwise search to `n` rows of length `n` for O(`n log n`) work.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Exercise group | Main habit | Geometry reminder |
| :--- | :--- | :--- |
| Reinforcement | Trace an existing method, representation, or complexity bound. | Four distinct IDs can share one home slot. |
| Creativity | Change an implementation while preserving its invariant and public behavior. | A left-bound search preserves both A and F at area 6. |
| Projects | Build or measure a complete structure, with small repeatable checks. | The same catalog can test ordered iteration, skip-list search, and collision counts. |
| Across all groups | Match the structure to the actual question. | Labels identify designs; areas group designs; counts represent physical cards. |

Start a solution by writing the **key**, the **invariant**, and the **expected result on a tiny case**. Then analyze how much work that solution performs for `n` entries. That sequence connects the chapter's maps, hash tables, sorted maps, skip lists, and sets to the same rectangle-card activity.

[🔝 Back to Top](#top)
