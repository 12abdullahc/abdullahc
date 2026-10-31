<span id="top"></span>

# 10.2 Hash Tables — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 10, Section 10.2, printed pages 410–426 ([supplied Chapter 10 PDF](<../Data Structures and Algorithms in Python - C10.pdf>)).<br>
> **Topic:** 10.2 Hash Tables; 10.2.1 Hash Functions; 10.2.2 Collision-Handling Schemes; 10.2.3 Load Factors, Rehashing, and Efficiency; 10.2.4 Python Hash Table Implementation.<br>
> **Domain Focus:** The [Section 10.1](10-01-maps-and-dictionaries.md) rectangle cards, now given stable numeric IDs so we can calculate bucket positions by hand.<br>
> **User Prompt:** Reexplain Section 10.2 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: Finding a Rectangle Card](#background)
   - [1. The familiar cards and new IDs](#background-cards)
   - [2. From a map question to a table position](#background-question)
2. [Part 1: 10.2 Hash Tables](#part-1)
   - [1. Why direct indexing is limited](#part-1-direct)
   - [2. Buckets and collisions](#part-1-buckets)
3. [Part 2: 10.2.1 Hash Functions](#part-2)
   - [1. Hash code first, compression second](#part-2-stages)
   - [2. Hash codes must use enough information](#part-2-codes)
   - [3. Python keys and stable hashes](#part-2-python)
   - [4. Division and MAD compression](#part-2-compression)
4. [Part 3: 10.2.2 Collision-Handling Schemes](#part-3)
   - [1. Separate chaining](#part-3-chaining)
   - [2. Open addressing and linear probing](#part-3-linear)
   - [3. Deletion needs an available marker](#part-3-delete)
   - [4. Other probing sequences](#part-3-variants)
5. [Part 4: 10.2.3 Load Factors, Rehashing, and Efficiency](#part-4)
   - [1. What the load factor counts](#part-4-load)
   - [2. Grow and rehash the card table](#part-4-resize)
   - [3. Expected time, worst-case time, and space](#part-4-cost)
6. [Part 5: 10.2.4 Python Hash Table Implementation](#part-5)
   - [1. Shared `HashMapBase` work](#part-5-base)
   - [2. The chaining subclass](#part-5-chain)
   - [3. The probing subclass](#part-5-probe)
7. [Part 6: One Connected Geometry Program](#part-6)
   - [1. Build two small hash maps](#part-6-code)
   - [2. Trace the output](#part-6-output)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: Finding a Rectangle Card

<span id="background-cards"></span>

### 1. The familiar cards and new IDs

[Section 10.1](10-01-maps-and-dictionaries.md) stored the dimensions of rectangular cards under labels `A`, `B`, and `C`. Here each size also gets a **fixed integer ID**. The IDs are keys for our hand-worked hash table; the label and dimensions are values. Card `D` joins later when the table grows.

| Card | Fixed ID | Width | Height | Area |
| :--- | -------: | ----: | -----: | ---: |
| `A` | 3 | 2 cm | 3 cm | 6 cm² |
| `B` | 10 | 4 cm | 2 cm | 8 cm² |
| `C` | 17 | 4 cm | 4 cm | 16 cm² |
| `D` | 24 | 2 cm | 2 cm | 4 cm² |

The first three cards are exactly the earlier sizes. An ID is an arbitrary identifier: `17` identifies C, but C's area is 16 cm². Its ID does **not** come from its area or dimensions. Resizing a card can change its area while its ID stays the same.

<span id="background-question"></span>

### 2. From a map question to a table position

The map question is familiar: “Given ID `17`, what are C's dimensions?” The [unsorted map in Section 10.1](10-01-maps-and-dictionaries.md#part-6) checks its stored keys one by one. With `n` distinct IDs, a lookup can take `O(n)` time.

A hash table tries to jump to a candidate bucket. It computes a small array index from the key, checks that location, and handles any other keys that landed there.

```text
card ID → hash computation → bucket index → check stored key → card data
```

We use a **toy table of seven slots** and the hand-calculable rule `h(k) = k mod 7`. This lets us see collisions. Python's built-in `dict` uses its own hashing and storage rules; the slot numbers below describe only our teaching table.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 10.2 Hash Tables

<span id="part-1-direct"></span>

### 1. Why direct indexing is limited

If every possible key were a small integer, we could put its value directly at the array position named by that key. For example, a table with positions `0` through `17` could put C at position `17`. A direct lookup would be `O(1)`.

That approach can waste space. Our three IDs `3`, `10`, and `17` would require at least 18 positions even though we have only three card sizes. An ID such as `1_000_000` would make a direct array much larger. Map keys can also be strings or other hashable objects, which are not array indices.

A **hash table** uses a smaller **bucket array**. A hash function turns a key into an index from `0` to `N - 1`, where `N` is the array's capacity.

<span id="part-1-buckets"></span>

### 2. Buckets and collisions

For `N = 7`, our toy hash function gives:

| Card | Key `k` | `k mod 7` | Starting bucket |
| :--- | ------: | --------: | --------------: |
| A | 3 | 3 | 3 |
| B | 10 | 3 | 3 |
| C | 17 | 3 | 3 |

Different keys have reached the same bucket. This is a **collision**. The values 6, 8, and 16 cm² do not decide the bucket; the **keys** do. The table must keep all three associations and still distinguish IDs `3`, `10`, and `17` when searching.

> **Mental model:** Hashing chooses where to start looking. A collision-handling rule finishes the search without confusing distinct keys.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 10.2.1 Hash Functions

<span id="part-2-stages"></span>

### 1. Hash code first, compression second

The book separates a hash function into two stages:

1. A **hash code** converts a key into an integer. The integer may be negative or too large for the bucket array.
2. A **compression function** converts that integer into one of the valid positions `0` through `N - 1`.

```text
key k → integer hash code i → compressed index h(k) in 0 ... N - 1
```

In our toy calculation, the hash code for integer ID `k` is simply `i = k`. Compression is `i mod 7`. Keeping the stages separate matters when a table grows: the key's hash code stays usable, while compression must use the **new** capacity.

A collision can happen in either stage. If two keys get the same hash code, compression cannot separate them. Different hash codes can also compress to the same bucket, as our IDs do.

<span id="part-2-codes"></span>

### 2. Hash codes must use enough information

If a key fits within the chosen hash-code width, its bit pattern can be interpreted as an integer code. A longer key can be split into chunks and combined by addition or bitwise exclusive-or; keeping only one chunk would discard distinctions in the other chunks. Addition loses **order**. Suppose a map uses the ordered pair `(width, height)` as a shape key:

| Shape key | Naive sum | Polynomial code with `a = 7` |
| :-------- | --------: | ---------------------------: |
| `(2, 3)` | `2 + 3 = 5` | `2 × 7 + 3 = 17` |
| `(3, 2)` | `3 + 2 = 5` | `3 × 7 + 2 = 23` |

The pairs describe rectangles with the same area but opposite width and height. They are different ordered keys. The simple sum always gives them the same code; the polynomial code distinguishes them **before** compression. A later compression step can still cause a collision.

For components `x₀, x₁, …, xₘ₋₁`, the book presents a polynomial hash code:

```text
x₀a^(m-1) + x₁a^(m-2) + ... + xₘ₋₂a + xₘ₋₁
```

A loop can evaluate it without separately calculating each power:

```python
def polynomial_code(components, base=7):
    code = 0
    for component in components:
        code = code * base + component
    return code

print(polynomial_code((2, 3)))  # 17
print(polynomial_code((3, 2)))  # 23
```

The loop evaluates the polynomial by **Horner's rule**, multiplying the running result by `base` before adding the next component. A fixed-width implementation can overflow, so choosing the base and mixing method affects the resulting spread; Python's integers in this snippet grow instead.

The section also describes a **cyclic-shift code** for strings. It rotates the running bits before mixing in each next character. This, like the polynomial rule, makes character position matter. In the book's word-list experiment, a zero-bit shift (simple addition) produced 234,735 colliding words, versus 190 with a five-bit shift. These are examples of hash-code design, not formulas that Python's current `dict` promises to use.

<span id="part-2-python"></span>

### 3. Python keys and stable hashes

Python's `hash(key)` provides an integer hash code for a **hashable** key. A hashable object's code must remain stable while it is used as a key. Equal keys must have equal hashes; **unequal** keys may still collide. A tuple such as `(2, 3)` is usable as a dictionary key because its elements are hashable. A list such as `[2, 3]` is not.

```python
area_by_size = {(2, 3): 6, (4, 2): 8}
print(area_by_size[(2, 3)])  # 6
# area_by_size[[2, 3]]  # TypeError: list is unhashable
```

The book's fixed-width hash-code discussion is a conceptual model; Python's actual hash width depends on the platform. In current Python, a plain user-defined object is hashable by **identity** by default. A class that defines value-based `__eq__` without a compatible `__hash__` becomes unhashable. For a custom value-based key, equality and hashing must agree, and fields used for hashing must remain stable. See the [Python glossary](https://docs.python.org/3.12/glossary.html#term-hashable) and [data model](https://docs.python.org/3.12/reference/datamodel.html#object.__hash__).

Python salts string hashes, so `hash("A")` can differ between program runs ([Python data model](https://docs.python.org/3.12/reference/datamodel.html#object.__hash__)). We use fixed integer IDs and an explicitly defined toy hash function for reproducible arithmetic. A Python `dict` preserves insertion order ([Python dictionary reference](https://docs.python.org/3.12/library/stdtypes.html#mapping-types-dict)).

<span id="part-2-compression"></span>

### 4. Division and MAD compression

The **division method** maps integer code `i` to `i mod N`. Choosing a prime capacity often helps avoid patterns, but it cannot guarantee no collisions: `N = 7` is prime and IDs `3`, `10`, and `17` all leave remainder `3`.

The book also presents **multiply-add-and-divide (MAD)** compression:

```text
h(k) = ((a × i + b) mod p) mod N
```

Here `i` is the key's integer hash code, `p` is a prime larger than `N`, and `a` and `b` are chosen parameters with `1 ≤ a < p` and `0 ≤ b < p`. The book chooses them randomly for its hash-map implementation. To calculate one fixed example by hand, choose `N = 7`, `p = 23`, `a = 3`, and `b = 1`:

| Card ID `i` | `(3i + 1) mod 23` | Final `mod 7` |
| ----------: | ----------------: | ------------: |
| 3 | 10 | 3 |
| 10 | 8 | 1 |
| 17 | 6 | 6 |

These three keys now start in different buckets. That is a result for **these keys and parameters**, not a promise that MAD eliminates every collision.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 10.2.2 Collision-Handling Schemes

A collision rule tells us how to store and later find every item whose first bucket is the same.

<span id="part-3-chaining"></span>

### 1. Separate chaining

With **separate chaining**, each bucket can hold a small secondary map. The book uses the `UnsortedTableMap` from Section 10.1 for those bucket maps. In our seven-slot example, bucket `3` holds all three cards:

| Bucket index | Contents after A, B, C are inserted |
| -----------: | :----------------------------------- |
| 0, 1, 2 | empty |
| 3 | `(3, A) → (10, B) → (17, C)` |
| 4, 5, 6 | empty |

The pair `(3, A)` abbreviates ID `3` with A's full `(label, width, height)` value; likewise for B and C. The arrows show a scan order within a bucket, not extra array positions. To look up ID `17`, compute `17 mod 7 = 3`, then compare keys inside bucket `3` until finding `17`. Assigning a new value to `17` changes that one association. Deleting `10` removes only B's entry from the bucket.

If keys spread evenly, an individual bucket has about `n/N` entries on average. With a bounded load factor, operations are **expected** to be fast. If every key lands in one bucket, that bucket's list scan is `O(n)`.

<span id="part-3-linear"></span>

### 2. Open addressing and linear probing

With **open addressing**, items live directly in the main array. Each slot holds at most one item, so the table must have free slots. **Linear probing** tries the starting bucket, then the next position, wrapping around:

```text
h(k), (h(k) + 1) mod N, (h(k) + 2) mod N, ...
```

Our three keys all start at `3`. Their insertions proceed as follows:

| Key inserted | Slots checked | Final slot |
| -----------: | :------------ | ---------: |
| 3 (A) | 3 | 3 |
| 10 (B) | 3, 4 | 4 |
| 17 (C) | 3, 4, 5 | 5 |

The table now has A at slot `3`, B at `4`, and C at `5`. Looking up C must follow the **same** sequence. It cannot look only at `h(17) = 3`, because collision handling placed C elsewhere.

<span id="part-3-delete"></span>

### 3. Deletion needs an available marker

Suppose B is deleted from slot `4`. If that slot became an ordinary empty slot, a search for C would start at `3`, reach empty `4`, and wrongly stop before C at `5`.

Linear probing uses a special **available marker**, also called a tombstone:

| Slot | Before deleting B | After deleting B |
| ---: | :---------------- | :--------------- |
| 3 | A | A |
| 4 | B | `AVAIL` |
| 5 | C | C |

Search **continues past** `AVAIL`. It stops when it finds the key or reaches a slot that has never held an item (`None` in the book's implementation). During insertion, the algorithm remembers the first `AVAIL` slot but keeps looking for an existing copy of the key before reusing that slot. This prevents duplicate keys. If no matching key appears, new card D can reuse slot `4`.

<span id="part-3-variants"></span>

### 4. Other probing sequences

Linear probing can form long adjacent runs, called **clusters**. The section briefly compares other ways to choose the next slot. These are alternatives within open addressing; each lookup must repeat the same sequence that insertion used.

| Scheme | Probe positions after `h(k)` | Idea and limit |
| :----- | :--------------------------- | :------------- |
| Linear | `(h(k) + i) mod N` | Simple, but adjacent clusters can grow. |
| Quadratic | `(h(k) + i²) mod N` | Spreads probes; can still form a different clustering pattern. |
| Double hashing | `(h(k) + i × h₂(k)) mod N` | A second hash sets a nonzero step for each key. |
| Pseudorandom | A repeatable sequence derived from the key's code. | Aims to spread probes without storing a separate chain. |

For quadratic probing, the book notes a guarantee of finding an empty slot when `N` is prime and the table is **less than half full**; that guarantee does not extend to every capacity or load. For double hashing it gives `h₂(k) = q - (k mod q)` with prime `q < N`. If `q = 5` and `N = 7`, our IDs `3`, `10`, and `17` get steps `2`, `5`, and `3`. After A occupies slot `3`, B can try `3, 1` and C can try `3, 6`.

The book also mentions a pseudorandom-style probe sequence in the Python implementation of its time. The exact internal strategy of today's Python `dict` is version-specific; the schemes above are teaching models.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 10.2.3 Load Factors, Rehashing, and Efficiency

<span id="part-4-load"></span>

### 1. What the load factor counts

The **load factor** is `λ = n/N`, where `n` is the number of **distinct stored keys** and `N` is the number of bucket slots. Our three sizes occupy three map entries in a seven-slot table:

```text
λ = 3 / 7 ≈ 0.43
```

The Section 10.1 choice sequence selected six physical cards, but it still used only three distinct size keys. Counting those six choices does **not** make the load `6/7`. Updating A's stored value also leaves `n` unchanged.

Separate chaining can physically hold more than one item per bucket, even if `λ > 1`, but searches grow as chains grow. The book suggests keeping chaining's load below about `0.9` and linear probing's below about `0.5` for good performance. Those are design guidelines for the approaches studied here, not universal rules for every hash table. Open addressing cannot store more than `N` items in `N` slots, and performance degrades well before it fills completely.

<span id="part-4-resize"></span>

### 2. Grow and rehash the card table

The book's shared hash-map base grows its table when insertion makes `n > N/2`. Add D, ID `24`, to our three sizes without deleting any. Then `n = 4` and `4/7 ≈ 0.57`, so the seven-slot teaching table grows.

For this example, use the book's growth formula `N_new = 2N_old - 1`: `2 × 7 - 1 = 13`. Every existing item must be placed again using the new capacity:

| Card | ID | Old `ID mod 7` | New `ID mod 13` |
| :--- | -: | -------------: | --------------: |
| A | 3 | 3 | 3 |
| B | 10 | 3 | 10 |
| C | 17 | 3 | 4 |
| D | 24 | 3 | 11 |

The card values are unchanged; **bucket positions can change**. Simply copying old array positions would make later lookups use `mod 13` and miss some cards. The new load is `4/13 ≈ 0.31`. In the book's implementation, the hash code stage remains the same; the MAD compression stage is reapplied using the new capacity.

Under the same good-distribution assumption, rehashing all entries costs `O(n)` at that moment. By growing capacity substantially, an implementation spreads that occasional work over many insertions. This is the same **amortized** idea used for dynamic arrays in Section 5.3.

<span id="part-4-cost"></span>

### 3. Expected time, worst-case time, and space

The book compares the Section 10.1 unsorted list with a hash table whose capacity stays proportional to its number of entries:

| Operation | Unsorted list map | Hash table, expected | Hash table, worst case |
| :-------- | :---------------- | :------------------- | :--------------------- |
| Find `M[k]` | `O(n)` | `O(1)` | `O(n)` |
| Assign `M[k] = v` | `O(n)` | `O(1)` amortized with resizing | `O(n)` |
| Delete `del M[k]` | `O(n)` | `O(1)` | `O(n)` |
| `len(M)` | `O(1)` | `O(1)` | `O(1)` |
| Iterate all keys | `O(n)` | `O(n)` | `O(n)` |

The expected results assume a good distribution of hashes, a controlled load factor, and inexpensive hash and equality operations. A poor or deliberately collision-heavy input can force long chains or probe sequences. The book uses this to explain why string-hash randomization helps defend systems that accept attacker-chosen keys. The bucket array and its entries use `O(n)` space when the capacity is kept proportional to `n`.

For a probing table, visiting all keys scans the **bucket array**, so the direct cost is `O(N)`. It becomes `O(n)` in the table because the analysis assumes `N = O(n)`. These are expected-case map costs, not a guarantee that every Python `dict` operation takes constant time.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 10.2.4 Python Hash Table Implementation

This subsection presents **Python classes written by the book's authors** to teach two hash-table designs. It is separate from the internal C implementation of Python's built-in `dict`.

<span id="part-5-base"></span>

### 1. Shared `HashMapBase` work

The book extends `MapBase` from Section 10.1 with `HashMapBase`. The base owns the bucket array, an item count, the hash computation, the map's public lookup/assignment/deletion methods, and resizing. Its compression is randomized MAD applied to Python's `hash(key)`.

```text
MutableMapping → MapBase → HashMapBase
                              ├─ ChainHashMap
                              └─ ProbeHashMap
```

`HashMapBase` does **not** decide how one bucket stores an item. It delegates to `_bucket_getitem`, `_bucket_setitem`, and `_bucket_delitem` in its child class. The child also supplies key iteration. When a key is new, the child increments the distinct-item count; replacing an existing value does not. After successful deletion, the base decrements the count. On resize, the base saves existing pairs, creates a larger array, resets the count, and reinserts those pairs.

<span id="part-5-chain"></span>

### 2. The chaining subclass

The book's `ChainHashMap` makes a bucket into an `UnsortedTableMap` only when the first item hashes there. It delegates a bucket lookup, update, or deletion to that small map. Before and after an assignment, it compares the bucket's length to decide whether the overall map gained a **new key**. Iteration walks every nonempty bucket and yields its keys.

In our geometry example, the secondary map at bucket `3` contains IDs `3`, `10`, and `17`. Changing C's dimensions updates the entry for ID `17`; it does not increase the number of card sizes.

<span id="part-5-probe"></span>

### 3. The probing subclass

The book's `ProbeHashMap` keeps each item directly in the main array. It uses a unique `AVAIL = object()` marker for deleted slots. Its `_find_slot` helper returns whether a key was found and which index contains it, or where a new entry can be inserted. That helper remembers the first available slot, searches past tombstones, and stops at a never-used slot. Lookup, assignment, and deletion all use it. Iteration skips empty and `AVAIL` positions.

| Slot state | Lookup action | Insertion action |
| :--------- | :------------ | :--------------- |
| Item with matching key | Return its value. | Replace its value. |
| Item with another key | Keep probing. | Keep probing. |
| `AVAIL` from deletion | Keep probing. | Remember it; continue checking for the key. |
| `None`, never used | Key is absent. | Insert at the first remembered `AVAIL`, or here. |

The table distinguishes `AVAIL` from `None` because a key could sit beyond a deleted entry. The book's two subclasses share the public map behavior and differ at precisely this collision-handling layer.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: One Connected Geometry Program

<span id="part-6-code"></span>

### 1. Build two small hash maps

This runnable **teaching version** follows the book's shared-base and two-subclass design. It uses `ID mod capacity` instead of randomized MAD, so its positions match the earlier tables. It stores pairs directly in short Python lists or tuples rather than reusing the full `MapBase._Item` class from Section 10.1. The map operations and resize behavior are the concepts to follow.

```python
from collections.abc import MutableMapping


class HashMapBase(MutableMapping):
    def __init__(self, capacity=7):
        self._table = [None] * capacity
        self._n = 0

    def _slot(self, key):
        return key % len(self._table)  # fixed integer IDs in this study

    def __len__(self):
        return self._n

    def __getitem__(self, key):
        return self._bucket_getitem(self._slot(key), key)

    def __setitem__(self, key, value):
        self._bucket_setitem(self._slot(key), key, value)
        if self._n > len(self._table) // 2:
            self._resize(2 * len(self._table) - 1)

    def __delitem__(self, key):
        self._bucket_delitem(self._slot(key), key)
        self._n -= 1

    def _resize(self, new_capacity):
        saved = list(self.items())
        self._table = [None] * new_capacity
        self._n = 0
        for key, value in saved:
            self[key] = value


class ChainHashMap(HashMapBase):
    def _bucket_getitem(self, slot, key):
        bucket = self._table[slot]
        if bucket is not None:
            for stored_key, value in bucket:
                if stored_key == key:
                    return value
        raise KeyError(key)

    def _bucket_setitem(self, slot, key, value):
        if self._table[slot] is None:
            self._table[slot] = []
        bucket = self._table[slot]
        for index, (stored_key, _) in enumerate(bucket):
            if stored_key == key:
                bucket[index] = (stored_key, value)
                return
        bucket.append((key, value))
        self._n += 1

    def _bucket_delitem(self, slot, key):
        bucket = self._table[slot]
        if bucket is not None:
            for index, (stored_key, _) in enumerate(bucket):
                if stored_key == key:
                    bucket.pop(index)
                    return
        raise KeyError(key)

    def __iter__(self):
        for bucket in self._table:
            if bucket is not None:
                for key, _ in bucket:
                    yield key


class ProbeHashMap(HashMapBase):
    AVAIL = object()

    def _find_slot(self, start, key):
        first_available = None
        for offset in range(len(self._table)):
            slot = (start + offset) % len(self._table)
            entry = self._table[slot]
            if entry is None:
                if first_available is not None:
                    return False, first_available
                return False, slot
            if entry is self.AVAIL:
                if first_available is None:
                    first_available = slot
            elif entry[0] == key:
                return True, slot
        if first_available is not None:
            return False, first_available
        raise RuntimeError("Hash table is full")

    def _bucket_getitem(self, start, key):
        found, slot = self._find_slot(start, key)
        if not found:
            raise KeyError(key)
        return self._table[slot][1]

    def _bucket_setitem(self, start, key, value):
        found, slot = self._find_slot(start, key)
        if found:
            stored_key, _ = self._table[slot]
            self._table[slot] = (stored_key, value)
        else:
            self._table[slot] = (key, value)
            self._n += 1

    def _bucket_delitem(self, start, key):
        found, slot = self._find_slot(start, key)
        if not found:
            raise KeyError(key)
        self._table[slot] = self.AVAIL

    def __iter__(self):
        for entry in self._table:
            if entry is not None and entry is not self.AVAIL:
                yield entry[0]


cards = {
    3: ("A", 2, 3),
    10: ("B", 4, 2),
    17: ("C", 4, 4),
}
choices = [3, 17, 3, 99, 10, 3, 17]

for MapType in (ChainHashMap, ProbeHashMap):
    card_map = MapType()
    for card_id, card in cards.items():
        card_map[card_id] = card

    total_area = 0
    for card_id in choices:
        if card_id in card_map:
            _, width, height = card_map[card_id]
            total_area += width * height

    print(MapType.__name__, len(card_map), "sizes,", total_area, "cm^2")

    card_map[3] = ("A", 3, 3)  # resize A, but keep its fixed ID
    print("A area after resize:", card_map[3][1] * card_map[3][2],
          "cm^2; distinct IDs:", len(card_map))

    del card_map[10]
    print("C after deleting B:", card_map[17][0])

grown = ProbeHashMap()
for card_id, card in {**cards, 24: ("D", 2, 2)}.items():
    grown[card_id] = card
print("After adding D:", len(grown._table), "slots;",
      "IDs:", sorted(grown))
```

<span id="part-6-output"></span>

### 2. Trace the output

```text
ChainHashMap 3 sizes, 58 cm^2
A area after resize: 9 cm^2; distinct IDs: 3
C after deleting B: C
ProbeHashMap 3 sizes, 58 cm^2
A area after resize: 9 cm^2; distinct IDs: 3
C after deleting B: C
After adding D: 13 slots; IDs: [3, 10, 17, 24]
```

The choice list is the Section 10.1 sequence expressed as IDs: A, C, A, unknown, B, A, C. Both maps find the same six accepted cards and `58 cm²` total. The unknown ID `99` is skipped. Updating A changes its dimensions and area to `3 × 3 = 9 cm²` but leaves three distinct IDs. The earlier `58 cm²` was calculated **before** this resize. Deleting B still leaves C findable, including in the probing map where B's old slot becomes `AVAIL`. Adding D in a fresh probing map crosses the half-full threshold and expands the seven slots to thirteen.

The code's `_slot` method accepts the fixed integer IDs used here. For general Python keys, the book's base computes `hash(key)` and applies MAD compression.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Does the area choose a card's bucket?</strong></summary>

**Scenario:** C has ID `17` and area `16 cm²`. We resize C to a different width and height.

**Reason:** The map hashes its **key**, ID `17`. The dimensions and area are values. With seven slots, its starting bucket remains `17 mod 7 = 3` while the table capacity remains seven.

**Result:** A change to a card's geometry updates its stored value; it does not require a new key. If the **table** resizes, compression uses the new capacity and can move the entry.

</details>

<details>
<summary><strong>Case Study 2: Is a collision the same as an equal key?</strong></summary>

**Scenario:** IDs `3` and `10` both map to slot `3` under `mod 7`.

**Reason:** They are distinct keys with the same **bucket index**. A lookup still compares actual keys in the chain or along the probe sequence.

**Result:** Looking up ID `10` returns B's 4 cm by 2 cm dimensions, never A's 2 cm by 3 cm dimensions.

</details>

<details>
<summary><strong>Case Study 3: Why does a deleted slot need AVAIL?</strong></summary>

**Scenario:** Linear probing put A, B, and C at slots `3`, `4`, and `5`. B is deleted.

**Problem:** Replacing B with `None` would make a search for C stop at `4`, before reaching C.

**Fix:** Mark slot `4` with `AVAIL`. Search continues to `5`, and a later insertion may reuse `4` after checking that its key is not already elsewhere.

</details>

<details>
<summary><strong>Case Study 4: Do six selected cards make the table six-sevenths full?</strong></summary>

**Scenario:** The students select A three times, B once, and C twice.

**Reason:** The size map has three **distinct** keys, regardless of six physical selections. Its load is `3/7`. A separate frequency map would also have three keys, with values `3`, `1`, and `2`.

**Result:** Load counts entries in the hash table, not the sum of their values.

</details>

<details>
<summary><strong>Case Study 5: Why might a hash table still take linear time?</strong></summary>

**Scenario:** Every new card ID is `7` larger than the previous one, so `k mod 7` always selects the same bucket.

**Reason:** A chain grows long, or probing must pass a long run of occupied slots. A fixed, predictable pattern defeats this toy hash rule.

**Result:** Good distribution and controlled load support **expected** `O(1)` operations; worst-case lookup can still be `O(n)`. Choosing a prime capacity alone does not remove our `3, 10, 17` collision.

</details>

<details>
<summary><strong>Case Study 6: Can dimensions themselves be a Python dictionary key?</strong></summary>

**Scenario:** We want to map a rectangle size to its area.

**Reason:** The immutable tuple `(2, 3)` is hashable because its elements are hashable integers. A list `[2, 3]` is unhashable, so Python rejects it as a `dict` key.

**Result:** `{(2, 3): 6}` works. The order matters: `(3, 2)` is a different tuple key even though its rectangle has the same area.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 10.2 idea | Plain-language meaning | Rectangle-card example |
| :---------------- | :--------------------- | :--------------------- |
| **Hash table** | Use a key-derived index to begin a map lookup. | ID `17` starts at slot `17 mod 7 = 3`. |
| **Hash code and compression** | First make an integer code; then fit it into the table's index range. | Code `17` compresses to slot `3` in seven slots. |
| **Collision** | Distinct keys can choose the same starting slot. | IDs `3`, `10`, and `17` all start at `3`. |
| **Separate chaining** | Keep colliding entries in a small map at one bucket. | Bucket `3` holds A, B, and C. |
| **Linear probing** | Try the next slots until the key or a usable slot is found. | A, B, C occupy `3`, `4`, `5`. |
| **Available marker** | Preserve a probe path after deletion. | Deleting B leaves `AVAIL` at `4`, so C is still found at `5`. |
| **Load factor** | Divide distinct entries by bucket capacity. | Three sizes in seven slots give `3/7`. |
| **Rehashing** | Grow the array and recompute positions using the new capacity. | Adding D grows seven slots to thirteen in the teaching program. |
| **Efficiency** | Good spreading gives expected constant-time core operations; collisions can force linear time. | A patterned set of IDs can make one long chain. |
| **Book's class design** | Share hashing and resizing in a base; handle collisions in subclasses. | `HashMapBase` delegates to `ChainHashMap` or `ProbeHashMap`. |

[🔝 Back to Top](#top)
