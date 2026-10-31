<span id="top"></span>

# 10.1 Maps and Dictionaries — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 10, Section 10.1, printed pages 402–409 ([supplied Chapter 10 PDF](<../Data Structures and Algorithms in Python - C10.pdf>)).<br>
> **Topic:** 10.1 Maps and Dictionaries; 10.1.1 The Map ADT; 10.1.2 Application: Counting Word Frequencies; 10.1.3 Python's MutableMapping Abstract Base Class; 10.1.4 Our MapBase Class; 10.1.5 Simple Unsorted Map Implementation.<br>
> **Domain Focus:** The rectangular cards from [Section 1.1](../01-python-primer/01-01-overview.md): labels, dimensions, area, and how often each card is chosen.<br>
> **User Prompt:** Reexplain Section 10.1 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Workshop](#background)
   - [1. The geometry data](#background-data)
   - [2. Two different questions about the same cards](#background-questions)
2. [Part 1: 10.1 Maps and Dictionaries](#part-1)
   - [1. Keys lead to values](#part-1-pairs)
   - [2. A map is an idea; a dictionary is Python's version](#part-1-terms)
3. [Part 2: 10.1.1 The Map ADT](#part-2)
   - [1. The five core operations](#part-2-core)
   - [2. Useful operations built around them](#part-2-convenience)
   - [3. Trace an update](#part-2-trace)
4. [Part 3: 10.1.2 Application: Counting Word Frequencies](#part-3)
   - [1. The book's word-count idea](#part-3-words)
   - [2. Count card choices with the same pattern](#part-3-cards)
   - [3. Trace the counts and areas](#part-3-trace)
5. [Part 4: 10.1.3 Python's MutableMapping Abstract Base Class](#part-4)
   - [1. The five-method contract](#part-4-contract)
   - [2. How inherited methods work](#part-4-inherited)
6. [Part 5: 10.1.4 Our MapBase Class](#part-5)
   - [1. Keep a key and value together](#part-5-item)
   - [2. Compare map items by key](#part-5-compare)
7. [Part 6: 10.1.5 Simple Unsorted Map Implementation](#part-6)
   - [1. Build the list-based map](#part-6-code)
   - [2. Reuse the card-count activity](#part-6-demo)
   - [3. Understand the running time](#part-6-time)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Workshop

<span id="background-data"></span>

### 1. The geometry data

We still have three rectangular cards. Each **label** identifies one card size, and each card has a **width** and **height** in centimetres.

| Label | Width | Height | Area = width × height |
| :---- | ----: | -----: | --------------------: |
| `A`   |  2 cm |   3 cm |                 6 cm² |
| `B`   |  4 cm |   2 cm |                 8 cm² |
| `C`   |  4 cm |   4 cm |                16 cm² |

Earlier, a dictionary connected each label to a pair of measurements:

```python
cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
width, height = cards["A"]
area = width * height  # 6 square centimetres
```

The label is the **key** used for lookup. The `(width, height)` tuple is the associated **value**. The area is calculated from that value.

<span id="background-questions"></span>

### 2. Two different questions about the same cards

Suppose students choose `A`, `C`, `A`, `B`, `A`, `C`. We need two related structures:

| Question | Structure | Meaning of `A` |
| :------- | :-------- | :------------- |
| What are a card's dimensions? | `cards = {"A": (2, 3), ...}` | `A` maps to `(2, 3)`. |
| How many times was it chosen? | `counts = {"A": 3, ...}` | `A` maps to `3`. |

The choice sequence has **six entries**, because choosing `A` three times represents three physical cards. The `counts` map has only **three keys**, because a map keeps one current value for each distinct label. We will use this distinction throughout Section 10.1.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 10.1 Maps and Dictionaries

<span id="part-1-pairs"></span>

### 1. Keys lead to values

A **map** stores associations of the form **key → value**. A key identifies an entry; its value is the information associated with that key. The book starts with countries as keys and currencies as values. Our geometry version uses card labels as keys and areas as values:

```text
"A" → 6 cm²      "B" → 8 cm²      "C" → 16 cm²
```

Keys must be **unique within one map**. Assigning a new value to `"A"` changes its existing entry; it does not create a second `"A"` entry. Values may repeat. If another card `E` measures 3 cm by 2 cm, both `A` and `E` can map to an area of 6 cm².

The bracket notation resembles a list lookup, but the key need not be a consecutive number. `cards["C"]` asks for the card labeled `C`; it does not mean “the item at position C.”

<span id="part-1-terms"></span>

### 2. A map is an idea; a dictionary is Python's version

The book uses **map** for the general data type and **dictionary** for Python's built-in `dict`. A map describes what operations users should be able to perform, without saying how entries must be stored. A Python dictionary is one implementation of that idea. Later in this section we will build a small map backed by a list.

```python
areas = {"A": 6, "B": 8, "C": 16}  # a Python dict
print(areas["B"])                    # 8
```

> **Mental model:** A map answers “what value belongs to this key?” For the cards, the key is a label, and the value can be dimensions, area, or a choice count, depending on the question.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 10.1.1 The Map ADT

An **abstract data type (ADT)** specifies observable operations. It does not require a particular storage method. The book gives five core map operations, using `M` for a map, `k` for a key, and `v` for a value.

<span id="part-2-core"></span>

### 1. The five core operations

| Operation | Meaning | Card example |
| :-------- | :------ | :----------- |
| `M[k]` | Return the value for `k`; raise `KeyError` if absent. | `areas["A"]` returns `6`. |
| `M[k] = v` | Add `k → v`, or replace the old value for `k`. | `counts["A"] = 2` updates A's count. |
| `del M[k]` | Remove `k` and its value; raise `KeyError` if absent. | `del counts["B"]` removes B's count. |
| `len(M)` | Count the distinct key–value entries. | `len(counts)` is `3` for A, B, and C. |
| `iter(M)` | Produce the keys, one at a time. | `for label in counts:` visits labels. |

The Python methods behind these operations are `__getitem__`, `__setitem__`, `__delitem__`, `__len__`, and `__iter__`. The last operation produces **keys**, even when the map's values are numbers.

<span id="part-2-convenience"></span>

### 2. Useful operations built around them

The section also lists convenient operations. These are especially useful when a key may be missing or when we want to examine every association.

| Operation | Meaning in the card activity |
| :-------- | :--------------------------- |
| `"A" in M` | Ask whether `A` is a key. |
| `M.get("D", 0)` | Read D's value, or return `0` if D is absent; do not insert D. |
| `M.setdefault("D", 0)` | Read D's value if present; otherwise insert `D → 0` and return `0`. |
| `M.pop("A")` | Remove A and return its value; a missing A raises `KeyError`. |
| `M.pop("A", 0)` | Remove A and return its value, or return `0` if A is absent. |
| `M.popitem()` | Remove and return one `(key, value)` pair; an empty map raises `KeyError`. |
| `M.clear()` | Remove every entry. |
| `M.keys()`, `M.values()`, `M.items()` | View keys, values, or `(key, value)` pairs. |
| `M.update(other)` | Assign the pairs supplied by another mapping. |
| `M == other`, `M != other` | Compare the associations in two maps. |

`M.values()` can include duplicates: two differently labeled rectangles can have the same area. For `pop`, **omitting** the default is different from **passing** `None` as a default: `M.pop("D")` raises if D is missing, whereas `M.pop("D", None)` returns `None`. These details follow the current [Python dictionary reference](https://docs.python.org/3.12/library/stdtypes.html#mapping-types-dict).

`popitem()` is not a way to select the card with the largest area. The general map idea does not promise that result. Current Python `dict` removes the most recently inserted pair, which is also unrelated to area.

<span id="part-2-trace"></span>

### 3. Trace an update

Start with an empty count map and process the first three choices, `A`, `C`, `A`:

| Step | Operation | Map afterward | Why |
| :--- | :-------- | :------------ | :-- |
| 0 | `counts = {}` | `{}` | No labels counted yet. |
| 1 | `counts["A"] = 1` | `{"A": 1}` | First A. |
| 2 | `counts["C"] = 1` | `{"A": 1, "C": 1}` | First C. |
| 3 | `counts["A"] = 2` | `{"A": 2, "C": 1}` | A's value is replaced. |

After step 3, `len(counts)` is **2**, although the class has selected **3 cards**. The map stores one count for each distinct label. Trying `counts["B"]` now raises `KeyError`; `counts.get("B", 0)` returns `0` without changing the map.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 10.1.2 Application: Counting Word Frequencies

<span id="part-3-words"></span>

### 1. The book's word-count idea

The book uses a map to count words in a document: a **word** is a key, and its **number of occurrences** is the value. Its example lowercases the text, separates it into whitespace-delimited pieces, removes nonalphabetic characters, then counts each remaining word. At the end, it scans the `(word, count)` pairs to find the largest count.

The central update is:

```python
freq[word] = 1 + freq.get(word, 0)
```

On the first occurrence, `get(word, 0)` supplies zero, so the new count is one. On later occurrences, it reads the existing count and adds one. The same pattern counts repeated card choices.

<span id="part-3-cards"></span>

### 2. Count card choices with the same pattern

This complete program counts accepted labels, finds the most chosen size, and totals the area of the physical cards chosen. `X` is an unknown label, so it is ignored.

```python
cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
chosen = ["A", "C", "A", "X", "B", "A", "C"]
counts = {}

for label in chosen:
    if label in cards:
        counts[label] = 1 + counts.get(label, 0)

most_chosen = None
largest_count = 0
total_area = 0

for label, count in counts.items():
    if count > largest_count:
        most_chosen = label
        largest_count = count
    width, height = cards[label]
    total_area += count * width * height

print("A:", counts.get("A", 0), "B:", counts.get("B", 0), "C:", counts.get("C", 0))
print("Most chosen:", most_chosen, largest_count)
print("Total area:", total_area, "cm^2")
```

```text
A: 3 B: 1 C: 2
Most chosen: A 3
Total area: 58 cm^2
```

The first loop builds the frequency map. The second loop examines its pairs and performs two calculations: find the largest count, and multiply each card's area by the number selected. The `if count > largest_count:` test keeps the first maximum encountered when counts tie; it does not establish a special tie-breaking rule for the map ADT.

<span id="part-3-trace"></span>

### 3. Trace the counts and areas

| Choice | Change to `counts` | Accepted cards so far | Area added |
| :----- | :----------------- | --------------------: | ---------: |
| `A` | A becomes 1. | 1 | 6 cm² |
| `C` | C becomes 1. | 2 | 16 cm² |
| `A` | A becomes 2. | 3 | 6 cm² |
| `X` | None: X is unknown. | 3 | 0 cm² |
| `B` | B becomes 1. | 4 | 8 cm² |
| `A` | A becomes 3. | 5 | 6 cm² |
| `C` | C becomes 2. | 6 | 16 cm² |

Thus `counts` has three entries: `A → 3`, `B → 1`, `C → 2`. The total area is `3 × 6 + 1 × 8 + 2 × 16 = 58 cm²`. If the input contained only unknown labels, `counts` would stay empty and `most_chosen` would stay `None`.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 10.1.3 Python's MutableMapping Abstract Base Class

<span id="part-4-contract"></span>

### 1. The five-method contract

An **abstract base class** supplies a shared interface and can supply ready-made methods. `Mapping` covers map reading operations; `MutableMapping` adds operations that change the map. In current Python, import these classes from [`collections.abc`](https://docs.python.org/3.12/library/collections.abc.html):

```python
from collections.abc import Mapping, MutableMapping
```

To make a concrete subclass of `MutableMapping`, implement the same five core methods from Part 2:

| Method to implement | Supports |
| :------------------ | :------- |
| `__getitem__(self, key)` | `M[key]` |
| `__setitem__(self, key, value)` | `M[key] = value` |
| `__delitem__(self, key)` | `del M[key]` |
| `__len__(self)` | `len(M)` |
| `__iter__(self)` | `for key in M` |

Then the inherited methods provide operations such as `get`, `in`, `setdefault`, `keys`, `items`, `pop`, and `update`. This is an example of the **template method** idea: a reusable method is written in terms of smaller operations supplied by the subclass.

<span id="part-4-inherited"></span>

### 2. How inherited methods work

Think of `"A" in M` as asking the map to retrieve `"A"`. If retrieval succeeds, the key exists; if `__getitem__` raises `KeyError`, it does not. Likewise, `setdefault("B", 0)` can try `M["B"]` and assign zero only if the lookup fails.

```text
Five methods we write → MutableMapping's reusable methods → familiar map syntax
```

This also explains why a custom map must raise `KeyError` for a missing key. Returning `None` for every failed lookup would make an inherited membership test think the key exists. Inheriting a method also does not make it fast: if our lookup scans a list, inherited `get` still pays for that scan.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 10.1.4 Our MapBase Class

<span id="part-5-item"></span>

### 1. Keep a key and value together

The book introduces `MapBase` as a reusable parent for several map implementations. It inherits `MutableMapping` and adds a small internal `_Item` class. Each `_Item` keeps a key and its value together, so a list or another storage structure can hold one object per map entry.

Here is a small version for our card study. Run it before the class in Part 6.

```python
from collections.abc import MutableMapping

class MapBase(MutableMapping):
    class _Item:
        __slots__ = ("_key", "_value")

        def __init__(self, key, value):
            self._key = key
            self._value = value

        def __eq__(self, other):
            return self._key == other._key

        def __ne__(self, other):
            return not (self == other)

        def __lt__(self, other):
            return self._key < other._key
```

The leading underscore marks `_Item`, `_key`, and `_value` as implementation details. `__slots__` limits each item to those two stored attributes. `MapBase` still cannot be used as a complete map: it leaves the five required methods for a child class to implement.

<span id="part-5-compare"></span>

### 2. Compare map items by key

The book's `_Item` defines equality and ordering using **keys**, regardless of the values. This makes item comparisons reusable in later map implementations. The unsorted map below compares a stored key directly with the requested key; assigning `"A"` again still updates its one existing item.

| Internal item | Key | Value |
| :------------ | :-- | ----: |
| Before another A choice | `"A"` | 1 |
| After another A choice | `"A"` | 2 |

The `<` comparison is groundwork for **sorted maps** later in Chapter 10. The unsorted map below scans for a matching key; it does not sort the entries. The book's class hierarchy places `MapBase` between `MutableMapping` and implementations such as `UnsortedTableMap`.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 10.1.5 Simple Unsorted Map Implementation

<span id="part-6-code"></span>

### 1. Build the list-based map

The book's `UnsortedTableMap` stores `_Item` objects in a Python list without sorting by key. This equivalent version uses one `_find` helper to show the scan shared by lookup, assignment, and deletion. Run this code after `MapBase` in Part 5.

```python
class UnsortedTableMap(MapBase):
    def __init__(self):
        self._table = []

    def _find(self, key):
        for index, item in enumerate(self._table):
            if item._key == key:
                return index
        return None

    def __getitem__(self, key):
        index = self._find(key)
        if index is None:
            raise KeyError(key)
        return self._table[index]._value

    def __setitem__(self, key, value):
        index = self._find(key)
        if index is None:
            self._table.append(self._Item(key, value))
        else:
            self._table[index]._value = value

    def __delitem__(self, key):
        index = self._find(key)
        if index is None:
            raise KeyError(key)
        self._table.pop(index)

    def __len__(self):
        return len(self._table)

    def __iter__(self):
        for item in self._table:
            yield item._key
```

`_find` returns a list index or `None`. Index `0` is a valid match, so we test `index is None`, not `if not index`. When assignment finds an existing label, it changes that item's value in place. Only a new label causes an append. Deletion removes the located item. Iteration yields **keys** rather than `_Item` objects.

<span id="part-6-demo"></span>

### 2. Reuse the card-count activity

The counting loop from Part 3 also works with the new map. Run this after the two class definitions:

```python
cards = {"A": (2, 3), "B": (4, 2), "C": (4, 4)}
chosen = ["A", "C", "A", "X", "B", "A", "C"]
counts = UnsortedTableMap()
total_area = 0

for label in chosen:
    if label in cards:
        counts[label] = counts.get(label, 0) + 1
        width, height = cards[label]
        total_area += width * height

print("A:", counts.get("A", 0), "B:", counts.get("B", 0), "C:", counts.get("C", 0))
print("Distinct labels:", len(counts))
print("Total area:", total_area, "cm^2")
print("Keys:", list(counts))
```

```text
A: 3 B: 1 C: 2
Distinct labels: 3
Total area: 58 cm^2
Keys: ['A', 'C', 'B']
```

The printed key order reflects **this list implementation's insertion order**. The map ADT does not require keys to be sorted. The successful `counts.get(...)` and `list(counts)` calls also show that `MutableMapping` supplies useful behavior once the five core methods work.

<span id="part-6-time"></span>

### 3. Understand the running time

Let `n` be the number of **distinct keys** in this map. A scan may need to inspect all `n` items before finding a label, or to prove that it is absent.

| Operation in this implementation | Worst-case time | Reason |
| :------------------------------- | :-------------- | :----- |
| `M[k]` | `O(n)` | `_find` may scan the whole list. |
| `M[k] = v` | `O(n)` | It searches before updating or appending. |
| `del M[k]` | `O(n)` | It searches; list removal may also shift items. |
| `len(M)` | `O(1)` | The list already knows its length. |
| Visit every key | `O(n)` total | `__iter__` yields each stored key once. |

For our three labels, a scan inspects at most three entries. With many distinct labels, repeated scans become costly. `get` is inherited, but it uses this map's `__getitem__`, so its lookup is also `O(n)` in the worst case. These costs describe the **unsorted list implementation**, not every map implementation or Python's built-in `dict`.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why does choosing A three times leave only one A key?</strong></summary>

**Scenario:** The choices are `A`, `A`, `A`.

**Reason:** Each `A` refers to the same key. The count changes from `1` to `2` to `3`; the map does not store three separate A entries.

**Result:** `counts == {"A": 3}` and `len(counts) == 1`, while three physical A cards cover `3 × 6 = 18 cm²`.

</details>

<details>
<summary><strong>Case Study 2: Can two labels have the same area?</strong></summary>

**Scenario:** Add `E`, a 3 cm by 2 cm card. Both `A` and `E` have area 6 cm².

**Reason:** Keys must be unique; values may repeat. An area map can hold `{"A": 6, "E": 6}`.

**Result:** `len(areas)` is `2`, and `list(areas.values())` contains two sixes. A values view is not a mathematical set of unique areas.

</details>

<details>
<summary><strong>Case Study 3: Does looking up an absent label create it?</strong></summary>

**Scenario:** The map contains only A and C. We ask for B's count.

**Reason:** `counts.get("B", 0)` returns zero without inserting B. `counts.setdefault("B", 0)` returns zero **and** inserts B. Direct `counts["B"]` raises `KeyError` until B is inserted.

**Result:** Use `get` for a temporary fallback and `setdefault` when the missing label should become a stored entry.

</details>

<details>
<summary><strong>Case Study 4: Why does a failed lookup need KeyError?</strong></summary>

**Scenario:** A custom map returns `None` from `__getitem__` when X is missing.

**Problem:** The inherited membership operation can interpret that return as a successful lookup, so `"X" in counts` may incorrectly report `True`.

**Fix:** Make `__getitem__` raise `KeyError("X")` for a missing key. Then `get("X", 0)` can safely return the fallback zero.

</details>

<details>
<summary><strong>Case Study 5: Can popitem find the largest rectangle?</strong></summary>

**Scenario:** The areas are A = 6 cm², B = 8 cm², and C = 16 cm².

**Problem:** `popitem()` removes an entry according to the map implementation; it does not compare areas. It also changes the map.

**Fix:** Inspect the pairs and compare their values, for example `max(areas, key=areas.get)` for a Python dictionary. This gives `"C"` without deleting an entry.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 10.1 idea | Plain-language meaning | Rectangle-card example |
| :--------------- | :--------------------- | :--------------------- |
| **Map / dictionary** | Associate one value with each distinct key; Python's `dict` is a map implementation. | `"A" → (2, 3)` stores A's dimensions. |
| **Unique keys, repeatable values** | One key cannot appear twice in the same map, but different keys may share a value. | A and E can each have area 6 cm². |
| **Five core operations** | Lookup, assign, delete, count entries, and iterate over keys. | `counts["A"]`, `del counts["A"]`, `len(counts)`. |
| **Frequency map** | Increment a count for every occurrence of a key. | `counts[label] = 1 + counts.get(label, 0)`. |
| **`MutableMapping`** | Supplies convenient methods when a subclass defines the five core methods. | Our custom map inherits `get`, `items`, and membership. |
| **`MapBase._Item`** | Keeps a key and value together; comparisons use keys. | One internal A item changes from count 1 to 3. |
| **Unsorted table map** | Stores items in a list and scans for keys. | Finding a card label can take `O(n)` time for `n` distinct labels. |

[🔝 Back to Top](#top)
