<span id="top"></span>

# 10.5 Sets, Multisets, and Multimaps — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 10, Section 10.5, printed pages 446–451 ([supplied Chapter 10 PDF](<../Data Structures and Algorithms in Python - C10.pdf>)).<br>
> **Topic:** 10.5 Sets, Multisets, and Multimaps; 10.5.1 The Set ADT; 10.5.2 Python's MutableSet Abstract Base Class; 10.5.3 Implementing Sets, Multisets, and Multimaps.<br>
> **Domain Focus:** The earlier rectangle cards, with unique designs, repeated physical cards, and multiple designs sharing one area.<br>
> **User Prompt:** Reexplain Section 10.5 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Display, Three Questions](#background)
   - [1. Keep the established rectangle cards](#background-cards)
   - [2. Unique designs, physical copies, and area groups](#background-questions)
2. [Part 1: 10.5 Sets, Multisets, and Multimaps](#part-1)
   - [1. The three collection meanings](#part-1-types)
   - [2. Why the key or element must match the question](#part-1-identity)
3. [Part 2: 10.5.1 The Set ADT](#part-2)
   - [1. Five core set behaviors](#part-2-core)
   - [2. Removal and comparisons](#part-2-compare)
   - [3. Geometry with union, intersection, difference, and symmetric difference](#part-2-algebra)
   - [4. New results versus in-place updates](#part-2-update)
4. [Part 3: 10.5.2 Python's MutableSet Abstract Base Class](#part-3)
   - [1. Implement five methods and inherit the rest](#part-3-template)
   - [2. Derive proper subset and union](#part-3-derived)
   - [3. Read the time bounds carefully](#part-3-cost)
5. [Part 4: 10.5.3 Implementing Sets, Multisets, and Multimaps](#part-4)
   - [1. A set can store keys without values](#part-4-set)
   - [2. A multiset counts physical cards](#part-4-multiset)
   - [3. A multimap keeps every area-to-design association](#part-4-multimap)
6. [Part 5: One Connected Geometry Program](#part-5)
   - [1. Define a set and a multimap](#part-5-code)
   - [2. Run the rectangle-card activity](#part-5-demo)
   - [3. Read the output](#part-5-output)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Display, Three Questions

<span id="background-cards"></span>

### 1. Keep the established rectangle cards

Our class is still cutting rectangular cards for a display board. [Section 10.1](10-01-maps-and-dictionaries.md) introduced A, B, and C; [Section 10.2](10-02-hash-tables.md) added D; [Section 10.3](10-03-sorted-maps.md) used F in a border-length example; and [Section 10.4](10-04-skip-lists.md) added G. This study uses these **six selected designs**. Section 10.3 also used E (`3 × 3` cm, area `9` cm²), but E is outside the catalog for the group calculations below.

| Design | Dimensions | Area | Why it matters here |
| :--- | :--- | ---: | :--- |
| A | 2 × 3 cm | 6 cm² | Chosen several times |
| B | 4 × 2 cm | 8 cm² | Chosen once |
| C | 4 × 4 cm | 16 cm² | Chosen twice |
| D | 2 × 2 cm | 4 cm² | Another distinct design |
| F | 1 × 6 cm | 6 cm² | Same area as A, different shape |
| G | 3 × 4 cm | 12 cm² | Added in the skip-list study |

For a rectangle, **area = width × height**. A and F both have area 6 cm², but they are different designs: A is `2 × 3` cm and F is `1 × 6` cm. We will use their **labels** as design identities and their **areas** as measurements.

<span id="background-questions"></span>

### 2. Unique designs, physical copies, and area groups

The earlier choice sequence was `A, C, A, X, B, A, C`. `X` is unknown and is rejected. The six accepted physical cards are `A, C, A, B, A, C`.

| Question | Useful collection | Answer from the accepted choices |
| :--- | :--- | :--- |
| Which **different designs** were chosen? | Set | `{A, B, C}`: three designs |
| How many **physical copies** of each design? | Multiset | A × 3, B × 1, C × 2: six cards |
| Which designs have **a given area**? | Multimap | Area `6` can point to both A and F in the catalog |

The total area of the six accepted cards is `3(6) + 1(8) + 2(16) = 58` cm². Adding one area per distinct design would give only `6 + 8 + 16 = 30` cm², which does not count repeated physical cards.

> **Mental model:** A set answers “which distinct elements?”, a multiset answers “how many of each?”, and a multimap answers “which values belong to this key?”

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 10.5 Sets, Multisets, and Multimaps

These collections are closely related to the map ideas studied earlier, but they have different public meanings. Choosing the collection depends on whether **uniqueness**, **multiplicity**, or **one-to-many association** matters.

<span id="part-1-types"></span>

### 1. The three collection meanings

| Collection | Mathematical content | Card example | What duplicates do |
| :--- | :--- | :--- | :--- |
| Set | Distinct elements | `{A, B, C}` | Adding A again has no effect. |
| Multiset (bag) | Elements with occurrence counts | `{A × 3, B × 1, C × 2}` | Another A increases A's count. |
| Multimap | Keys with potentially several associated values | `6 → [A, F]` | A second value can share key `6`; even an identical pair may be stored twice. |

A standard map associates **one value per key**. If an area-to-label map stored `6 → A` and then `6 → F`, the second assignment would replace the first. A multimap retains both associations. A set of *area numbers* would also collapse A and F into one element, because both have area `6`.

<span id="part-1-identity"></span>

### 2. Why the key or element must match the question

For “which designs?”, use the unique design labels `A` and `F` as separate set elements. For “how many copies?”, count labels from the actual selection sequence. For “which designs have area 6?”, use area `6` as a multimap key and keep A and F as separate values.

The same physical activity can need all three views. None of the structures automatically knows whether `6` means “one area,” “one design,” or “one card”; we choose that meaning when we select the element or key.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 10.5.1 The Set ADT

A **set** is an unordered collection of distinct elements. Python provides mutable `set` and immutable `frozenset`. A set can test membership, remove duplicates, and perform the familiar operations of mathematical set theory. Set elements used in Python's built-in hash-backed set must be hashable; our string labels are.

<span id="part-2-core"></span>

### 1. Five core set behaviors

The book treats five behaviors as fundamental for a mutable set `S`:

| Behavior | Meaning | Rectangle example |
| :--- | :--- | :--- |
| `S.add(e)` | Add `e`; do nothing if it is already present. | Adding A twice still leaves one A design. |
| `S.discard(e)` | Remove `e` if present; do nothing if absent. | Discarding unknown X is harmless. |
| `e in S` | Test membership. | `"C" in S` asks whether C is represented. |
| `len(S)` | Count distinct elements. | `len({"A", "B", "C"}) = 3`. |
| `iter(S)` | Visit each element once. | Visit A, B, and C in **unspecified order**. |

The five behaviors describe the interface. A data structure such as a hash table or search tree can supply the storage. A Python set does **not** promise sorted output or the order in which labels were inserted. We use `sorted(S)` in examples when a stable display order helps.

<span id="part-2-compare"></span>

### 2. Removal and comparisons

Other set behaviors can be built from the five core ones:

| Behavior | Meaning | Edge case |
| :--- | :--- | :--- |
| `S.remove(e)` | Remove `e`. | Raises `KeyError` if `e` is absent. |
| `S.pop()` | Remove and return an arbitrary element. | Raises `KeyError` if `S` is empty. |
| `S.clear()` | Remove every element. | The result is an empty set. |
| `S == T`, `S != T` | Compare membership, regardless of visit order. | `{A, B} == {B, A}`. |
| `S <= T`, `S < T` | Subset and proper subset. | `{A, B} < {A, B, C}`. |
| `S >= T`, `S > T` | Superset and proper superset. | `{A, B, C} > {A, B}`. |
| `S.isdisjoint(T)` | Check whether no element is shared. | `{A, F}` and `{C, D}` are disjoint. |

**Proper subset** means both “every element of `S` is in `T`” **and** “`S` is smaller than `T`.” The comparison operators do **not** order sets by cardinality or alphabetically. For example, `{A, B} < {C, D, F}` is false even though the left set has fewer elements, because A and B are missing from the right set.

Use `set()` for an empty built-in set. The literal `{}` creates an empty dictionary.

<span id="part-2-algebra"></span>

### 3. Geometry with union, intersection, difference, and symmetric difference

Let `N` be designs **narrower than 4 cm** and `L` be designs with **area at least 8 cm²**:

```text
N = {A, D, F, G}     widths: 2, 2, 1, 3 cm
L = {B, C, G}        areas: 8, 16, 12 cm²
```

G belongs to both groups: its width is 3 cm and its area is 12 cm². The remaining results are:

| Expression | Mathematical meaning | Resulting design labels |
| :--- | :--- | :--- |
| `N \| L` | Union: in either group | `{A, B, C, D, F, G}` |
| `N & L` | Intersection: in both groups | `{G}` |
| `N - L` | Difference: in N but not L | `{A, D, F}` |
| `L - N` | Difference: in L but not N | `{B, C}` |
| `N ^ L` | Symmetric difference: in exactly one group | `{A, B, C, D, F}` |

Here `^` means **symmetric difference**, not exponentiation. Union and intersection are symmetric in their two operands, while difference depends on which set comes first. The operator forms use sets as operands; Python's named set methods, such as `union` and `intersection`, can accept other iterables too.

<span id="part-2-update"></span>

### 4. New results versus in-place updates

The book distinguishes two forms of each algebraic operation. `N | L` makes a **new set**; `N |= L` changes the existing `N` in place. The underlying `__ior__` method returns the modified object. Likewise, `&=`, `^=`, and `-=` update the left-hand set rather than making a separate result.

If another name refers to the same mutable set object, that name sees an in-place change. This is different from rebinding a name to a new object. The program in Part 5 demonstrates the difference with a small `MutableSet` subclass.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 10.5.2 Python's MutableSet Abstract Base Class

The book explains that an **abstract base class** supplies many set methods when a concrete subclass supplies the five core ones. In current Python, import it from [`collections.abc.MutableSet`](https://docs.python.org/3.12/library/collections.abc.html); the book's older `collections.MutableSet` spelling reflects its publication-era API.

<span id="part-3-template"></span>

### 1. Implement five methods and inherit the rest

A concrete mutable set subclass implements `add`, `discard`, `__contains__`, `__len__`, and `__iter__`. The inherited methods then call those primitives. This is the **template method** idea: general set algorithms are written once, while the subclass chooses how elements are stored.

Our `CardSet` in Part 5 stores label strings in a built-in set and supplies exactly those five methods. Its constructor also accepts an iterable, so inherited operations that create a new instance can construct another `CardSet`. Current [`collections.abc` mixin guidance](https://docs.python.org/3.12/library/collections.abc.html) uses a construction hook named `_from_iterable`; a different constructor may need that hook overridden.

<span id="part-3-derived"></span>

### 2. Derive proper subset and union

For `S < T`, the book's sample algorithm first checks `len(S) < len(T)`, then tests that every element of `S` belongs to `T`. Both conditions are required:

```text
S is a proper subset of T
    ⇔ len(S) < len(T) and every x in S is also in T.
```

For a new union `S | T`, its sample algorithm creates a new concrete set and adds every element of `S` and `T`. Repeated elements have no effect. For an in-place union `S |= T`, it adds only the elements of `T` to `S`, then returns `S`. The book writes these as illustrative methods; our code lets Python's current `MutableSet` mixin supply them.

<span id="part-3-cost"></span>

### 3. Read the time bounds carefully

Let `n = len(S)` and `m = len(T)`. If the concrete set uses hashing with expected constant-time membership and addition, the book's union algorithms take:

| Operation | Expected time | Work done |
| :--- | :--- | :--- |
| New union `S | T` | `O(n + m)` | Visit both sets to build a result. |
| In-place union `S |= T` | `O(m)` | Visit T and add its elements to S. |

These are bounds for **hash-backed primitives**, not promises made by the abstract base class for every possible subclass. A subclass backed by a slower structure can give inherited operations different costs.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 10.5.3 Implementing Sets, Multisets, and Multimaps

The section closes by connecting each abstraction to map storage. The key question is what the underlying map stores: bare elements, counts, or containers of values.

<span id="part-4-set"></span>

### 1. A set can store keys without values

One easy set implementation could put each set element in a map key and attach an unused value such as `None`. For example, design A could be stored as `"A" → None`. This works, but the value field carries no information. The book notes that a more efficient set implementation stores the elements directly in a suitable structure.

The public set behavior stays the same regardless of storage. A hash-backed set is useful for expected fast membership; an ordered structure could support sorted traversal. The set ADT itself does not promise an order.

<span id="part-4-multiset"></span>

### 2. A multiset counts physical cards

A **multiset**, also called a **bag**, allows repeated elements. A practical representation is a map from element to its **occurrence count**:

```text
"A" → 3       "B" → 1       "C" → 2
```

The sum of positive counts is the number of physical cards, `3 + 1 + 2 = 6`. Multiplying each count by its design's area gives the total cut area, `58` cm².

Python's [`collections.Counter`](https://docs.python.org/3.12/library/collections.html#collections.Counter) provides this pattern. Iterating a `Counter` visits its **distinct keys** once; `elements()` repeats each element according to a positive integer count; `most_common(n)` reports frequent elements. `len(counter)` counts stored distinct keys, **not** the sum of counts. A `Counter` can also hold zero or negative counts, so a plain positive-count multiset model should keep its counts positive and remove exhausted keys.

A multiset's union has different arithmetic from a set's union. For positive counts, `Counter`'s `|` takes the **larger count** for each element, while `+` **adds counts**. For example, if one bag has two A cards and another has one A card, their bag union has two A cards, whereas combining both physical piles with `+` has three.

<span id="part-4-multimap"></span>

### 3. A multimap keeps every area-to-design association

A **multimap** allows one key to have several values. The book implements one by mapping each key to a list of associated values. For our catalog:

```text
4  → [D]
6  → [A, F]
8  → [B]
12 → [G]
16 → [C]
```

There are **five distinct area keys** but **six key-value pairs**. A and F both map from area `6`, while their labels still identify two designs. The same pair could even be added twice, because a list appends each value; the multimap would then contain two associations for that pair.

The book's multimap operations behave as follows:

| Operation | Meaning | Area-6 example |
| :--- | :--- | :--- |
| `add(k, v)` | Add another pair, even when key `k` exists. | `add(6, "F")` retains A and F. |
| `find(k)` | Return one pair for `k`; raise `KeyError` if absent. | Could return `(6, "A")`. |
| `find_all(k)` | Iterate every pair for `k`; empty if absent. | `(6, "A")` and `(6, "F")`. |
| `pop(k)` | Remove and return one pair for `k`; raise `KeyError` if absent. | The list-backed version removes F first. |
| `len(M)` | Count **pairs**, not distinct keys. | All six designs give length `6`. |
| `iter(M)` | Iterate all pairs. | Includes both area-6 pairs. |

The book describes `find` and `pop` as returning an **arbitrary** matching pair. Its specific list-backed example uses the first value for `find` and the last for `pop`; callers should not treat that choice as the abstract guarantee. When `pop` removes a key's last value, the implementation removes the now-empty list and its outer map key. The book's listing omits `__len__` but says it returns the stored pair count; our executable class includes it.

With a hash-backed outer map and list buckets, lookup and an end-of-list append or pop are expected constant-time operations; consuming `find_all(k)` takes time proportional to the number of returned pairs. Those costs come from the chosen storage, not from the multimap definition alone.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Program

The program uses one catalog of rectangle designs for all three collection questions. Run the two Python blocks in one file or in the same interpreter session. The printed set results are sorted for display; this does not make the underlying set ordered.

<span id="part-5-code"></span>

### 1. Define a set and a multimap

```python
from collections import Counter
from collections.abc import MutableSet


class CardSet(MutableSet):
    """A set of distinct card labels, backed by a built-in set."""

    def __init__(self, labels=()):
        self._labels = set(labels)

    def __contains__(self, label):
        return label in self._labels

    def __iter__(self):
        return iter(self._labels)

    def __len__(self):
        return len(self._labels)

    def add(self, label):
        self._labels.add(label)

    def discard(self, label):
        self._labels.discard(label)


class MultiMap:
    """Store every key-value pair in a list under its key."""

    def __init__(self):
        self._groups = {}
        self._pair_count = 0

    def __len__(self):
        return self._pair_count

    def __iter__(self):
        for key, group in self._groups.items():
            for value in group:
                yield key, value

    def add(self, key, value):
        group = self._groups.get(key)
        if group is None:
            group = []
            self._groups[key] = group
        group.append(value)
        self._pair_count += 1

    def find(self, key):
        group = self._groups[key]  # KeyError if absent
        return key, group[0]

    def find_all(self, key):
        for value in self._groups.get(key, ()):
            yield key, value

    def pop(self, key):
        group = self._groups[key]  # KeyError if absent
        value = group.pop()
        if not group:
            del self._groups[key]
        self._pair_count -= 1
        return key, value
```

`CardSet` supplies the five methods required by current `MutableSet`. `MultiMap` stores **lists** under its keys and maintains a separate count of **all pairs**. Its loops expose every pair rather than only the outer dictionary keys.

<span id="part-5-demo"></span>

### 2. Run the rectangle-card activity

```python
# label: (width, height), both in centimetres
dimensions = {
    "A": (2, 3),
    "B": (4, 2),
    "C": (4, 4),
    "D": (2, 2),
    "F": (1, 6),
    "G": (3, 4),
}
areas = {label: width * height
         for label, (width, height) in dimensions.items()}

narrow = CardSet(label for label, (width, height) in dimensions.items()
                 if width < 4)
large = CardSet(label for label, area in areas.items() if area >= 8)

print("Narrow:", sorted(narrow))
print("Large:", sorted(large))
print("Union:", sorted(narrow | large))
print("Intersection:", sorted(narrow & large))
print("Narrow minus large:", sorted(narrow - large))
print("Symmetric difference:", sorted(narrow ^ large))
print("Squares proper subset of all:",
      CardSet(("C", "D")) < (narrow | large))

starter = CardSet(("A",))
alias = starter
starter |= CardSet(("B", "C"))
print("In-place union:", sorted(starter), alias is starter)

choices = ["A", "C", "A", "X", "B", "A", "C"]
accepted = [label for label in choices if label in dimensions]
counts = Counter(accepted)

print("Accepted:", accepted)
print("Unique chosen:", sorted(CardSet(accepted)))
print("Counts:", sorted(counts.items()))
print("Distinct designs:", len(counts))
print("Physical cards:", sum(counts.values()))
print("Total area:", sum(areas[label] * count
                         for label, count in counts.items()))
print("Expanded multiset:", sorted(counts.elements()))
print("Most common:", counts.most_common(1))

by_area = MultiMap()
for label in ("D", "A", "B", "C", "F", "G"):
    by_area.add(areas[label], label)

print("Area-to-design pairs:", len(by_area))
print("Distinct area keys:", len({area for area, _ in by_area}))
print("All designs at area 6:", list(by_area.find_all(6)))
print("One design at area 6:", by_area.find(6))
print("Remove one at area 6:", by_area.pop(6))
print("Area 6 after one removal:", list(by_area.find_all(6)))
print("Remove last at area 6:", by_area.pop(6))
print("Area 6 after both removals:", list(by_area.find_all(6)))
print("Missing area 99:", list(by_area.find_all(99)))
```

<span id="part-5-output"></span>

### 3. Read the output

```text
Narrow: ['A', 'D', 'F', 'G']
Large: ['B', 'C', 'G']
Union: ['A', 'B', 'C', 'D', 'F', 'G']
Intersection: ['G']
Narrow minus large: ['A', 'D', 'F']
Symmetric difference: ['A', 'B', 'C', 'D', 'F']
Squares proper subset of all: True
In-place union: ['A', 'B', 'C'] True
Accepted: ['A', 'C', 'A', 'B', 'A', 'C']
Unique chosen: ['A', 'B', 'C']
Counts: [('A', 3), ('B', 1), ('C', 2)]
Distinct designs: 3
Physical cards: 6
Total area: 58
Expanded multiset: ['A', 'A', 'A', 'B', 'C', 'C']
Most common: [('A', 3)]
Area-to-design pairs: 6
Distinct area keys: 5
All designs at area 6: [(6, 'A'), (6, 'F')]
One design at area 6: (6, 'A')
Remove one at area 6: (6, 'F')
Area 6 after one removal: [(6, 'A')]
Remove last at area 6: (6, 'A')
Area 6 after both removals: []
Missing area 99: []
```

The result separates three counts: **six physical cards** in the accepted selection, **three distinct chosen designs**, and **six area-to-design pairs across the full six-design catalog**. These happen to include the same number `6` in two places, but the quantities mean different things.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

Try each question before opening its answer. The cases reuse the same cards and collection meanings.

<details>
<summary><strong>Case Study 1: A second A changes one collection but not another</strong></summary>

**Question:** The selection already contains A once. What happens when the student chooses another A?

**Work:** A set of chosen designs contains A as one element. A multiset records another physical copy.

**Answer:** The set is unchanged. A's multiset count increases from `1` to `2`, and the physical-card area total increases by `6` cm².

</details>

<details>
<summary><strong>Case Study 2: Geometry groups overlap at G</strong></summary>

**Question:** Which cards are both narrower than 4 cm and at least 8 cm² in area?

**Work:** The narrow group is `{A, D, F, G}`. The large-area group is `{B, C, G}`. Compare their common labels.

**Answer:** Their intersection is `{G}`. G is `3 × 4` cm, so its width is `3 < 4` cm and its area is `3 × 4 = 12 ≥ 8` cm².

</details>

<details>
<summary><strong>Case Study 3: A smaller set is not automatically a subset</strong></summary>

**Question:** Is `{A, B} < {C, D, F}` true because the left set has only two elements?

**Work:** Proper subset needs every left-hand element on the right, as well as a smaller size. Neither A nor B appears on the right.

**Answer:** No. Set `<` compares membership, not just the number of elements.

</details>

<details>
<summary><strong>Case Study 4: Six copies versus three designs</strong></summary>

**Question:** Why does `len(Counter(["A", "C", "A", "B", "A", "C"]))` equal `3` instead of `6`?

**Work:** `Counter` is dictionary-like. Its stored keys are the distinct labels A, B, and C; their values are counts `3, 1, 2`.

**Answer:** `len` counts three stored labels. `sum(counts.values()) = 6` counts physical copies. Their total area is `3(6) + 1(8) + 2(16) = 58` cm².

</details>

<details>
<summary><strong>Case Study 5: Bag union is not pile addition</strong></summary>

**Question:** One bag contains two A cards and another bag contains one A card. How many A cards do `P | Q` and `P + Q` contain for `Counter` objects?

**Work:** Multiset union takes the maximum count: `max(2, 1) = 2`. Adding the physical piles sums counts: `2 + 1 = 3`.

**Answer:** `P | Q` contains two A cards; `P + Q` contains three. Ordinary set union would contain just the one distinct design A.

</details>

<details>
<summary><strong>Case Study 6: Two designs under one area</strong></summary>

**Question:** A and F both have area 6 cm². What would a standard area-to-label map do, and what does the multimap do?

**Work:** A standard map has one value per key, so assigning F after A at key `6` replaces A. The multimap's area-6 list holds both labels.

**Answer:** `find_all(6)` yields `(6, "A")` and `(6, "F")`. Its length counts both pairs. In the shown list-backed version, `pop(6)` removes F first; A remains until another `pop(6)` removes the final pair and the area-6 key.

</details>

<details>
<summary><strong>Case Study 7: Missing elements have different removal rules</strong></summary>

**Question:** What happens if unknown label X is removed from a set using `discard` versus `remove`? What does `find_all(99)` do in the multimap?

**Work:** `discard` is defined to ignore an absent set element, while `remove` signals that absence. `find_all` is an iterator over matching pairs.

**Answer:** `discard("X")` has no effect; `remove("X")` raises `KeyError`. `find_all(99)` yields no pairs. By contrast, multimap `find(99)` or `pop(99)` raises `KeyError`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Idea | Collection meaning | Rectangle-card example |
| :--- | :--- | :--- |
| Set | Distinct elements with no promised iteration order. | Accepted choices contain designs `{A, B, C}`. |
| Five set primitives | Add, discard, membership, length, iteration. | Adding A twice still gives one A design. |
| Set algebra | Combine or compare membership. | Narrow `∩` large-area is `{G}`. |
| Proper subset | Every element belongs to a larger set. | `{C, D} < {A, B, C, D, F, G}`. |
| `MutableSet` | Concrete subclass supplies five core methods. | `CardSet` inherits union and subset behavior. |
| Multiset | Element-to-count representation of repeats. | A × 3, B × 1, C × 2: six cards, 58 cm². |
| `Counter` iteration | Visits distinct keys; `elements()` repeats copies. | Three labels versus six physical cards. |
| Multimap | Key-to-container representation of multiple values. | Area `6 → [A, F]`. |
| Multimap length | Counts pairs, including repeated pairs. | Six catalog designs give six area-to-label pairs. |

**Key takeaway:** Decide what must be unique. Use a set for distinct designs, a multiset for repeated physical cards, and a multimap when several designs belong to one measurement key.

[🔝 Back to Top](#top)
