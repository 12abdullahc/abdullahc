<span id="top"></span>

# Priority Queues — Section 9.2: Implementing a Priority Queue

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.2 (printed pages 365–369).  
> **Topic:** 9.2.1 The Composition Design Pattern; 9.2.2 Implementation with an Unsorted List; 9.2.3 Implementation with a Sorted List.  
> **Domain focus:** MotoGP Q2 qualifying at the 2026 French Grand Prix, Le Mans, on 9 May 2026.  
> **Learning goal:** Trace both list implementations, explain where each spends time, and choose one for a given workload.  
> **User Prompt:** "Reexplain [Section 9.2] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Answer, Two Storage Orders](#background-intuition)
   - [1. Use one verified Q2 session](#background-session)
   - [2. Compare the two layouts](#background-layouts)
2. [Part 1: Section 9.2 — Keep the ADT, Choose a Representation](#part-1)
   - [1. The behavior stays the same](#part-1-contract)
   - [2. What a positional list provides](#part-1-positions)
3. [Part 2: Section 9.2.1 — The Composition Design Pattern](#part-2)
   - [1. Keep a key with its rider record](#part-2-item)
   - [2. Share code in a base class](#part-2-base)
4. [Part 3: Section 9.2.2 — Implementation with an Unsorted List](#part-3)
   - [1. Add at the end](#part-3-add)
   - [2. Scan to find the minimum](#part-3-scan)
   - [3. Inspect, remove, and measure the cost](#part-3-cost)
5. [Part 4: Section 9.2.3 — Implementation with a Sorted List](#part-4)
   - [1. Maintain key order](#part-4-invariant)
   - [2. Walk backward to insert](#part-4-insert)
   - [3. Use the first position for the minimum](#part-4-minimum)
6. [Part 5: Compare the Two Implementations](#part-5)
   - [1. Worst-case operation costs](#part-5-table)
   - [2. Choose by the workload](#part-5-workload)
   - [3. Equal keys and empty queues](#part-5-edges)
7. [Part 6: Complete Runnable Demonstration](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Answer, Two Storage Orders

<span id="background-session"></span>

### 1. Use One Verified Q2 Session

We will store selected **best-lap records from one session**: the 2026 French Grand Prix MotoGP Q2 classification at Le Mans on Saturday, 9 May. These rider, team, position, and lap-time facts come from the [official MotoGP timing sheet](https://resources.motogp.com/files/results/2026/FRA/MotoGP/Q2/Classification.pdf). The [official session report](https://www.motogp.com/en/news/2026/05/07/motogp-q2-bagnaia-de-retour-aux-affaires/1064614) confirms the same session and front-row result.

| Q2 place | Rider | Team | Best lap | Priority key |
| ---: | :--- | :--- | ---: | ---: |
| 1 | Francesco Bagnaia | Ducati Lenovo Team | `1:29.634` | `89_634` ms |
| 2 | Marc Márquez | Ducati Lenovo Team | `1:29.646` | `89_646` ms |
| 3 | Marco Bezzecchi | Aprilia Racing | `1:29.657` | `89_657` ms |
| 5 | Pedro Acosta | Red Bull KTM Factory Racing | `1:29.817` | `89_817` ms |
| 6 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | `1:29.831` | `89_831` ms |

As in the [Section 9.1 explanation](09-01-the-priority-queue-abstract-data-type.md), a **smaller best-lap time has higher priority**. For example, `89_646 < 89_831`, so Marc's Q2 best lap was faster than Fabio's by `185` milliseconds. To get an integer key from `1:29.646`, calculate `1 × 60_000 + 29 × 1_000 + 646 = 89_646` ms.

We will add four records in this **chosen teaching order**: Fabio, Marc, Bezzecchi, Bagnaia. The official classification does not tell us to use this insertion order; it helps us see how a later insertion can change the minimum. The queue is a data-structure exercise using published results, not a model of every MotoGP qualifying rule.

**Why this example?** Fabio and Marc are easy to compare, Bezzecchi tests an insertion between existing keys, and Bagnaia tests a new smallest key. **How to solve it:** keep all records from the same session, convert each lap to integer milliseconds, and use that number as the key.

<span id="background-layouts"></span>

### 2. Compare the Two Layouts

After adding the four records in that order, the two implementations may store the **same entries** like this:

```text
Unsorted: Fabio(89,831) → Marc(89,646) → Bezzecchi(89,657) → Bagnaia(89,634)
Sorted:   Bagnaia(89,634) → Marc(89,646) → Bezzecchi(89,657) → Fabio(89,831)
```

The arrows show neighboring positions in a linked positional list. The sorted line is in **nondecreasing key order**, not alphabetical rider order. Both queues must return Bagnaia as the minimum because `89_634` is smallest.

| Question | Unsorted list | Sorted list |
| :--- | :--- | :--- |
| Where does a new entry go? | At the end. | At the position that preserves key order. |
| How do we find the minimum? | Scan the waiting entries. | Read the first entry. |
| What answer does `min()` give here? | Bagnaia. | Bagnaia. |

**Why this example?** It separates the **answer** from the **storage order**. **How to solve it:** compare the keys to predict the answer, then inspect each implementation's invariant to see where its work happens.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 9.2 — Keep the ADT, Choose a Representation

<span id="part-1-contract"></span>

### 1. The Behavior Stays the Same

Section 9.1 defined the priority queue **abstract data type (ADT)**. Section 9.2 supplies two concrete classes, `UnsortedPriorityQueue` and `SortedPriorityQueue`. Both must support the same calls:

| Call | Required result |
| :--- | :--- |
| `P.add(k, v)` | Add one key–value entry. |
| `P.min()` | Return a minimum-key `(key, value)` pair without removal. |
| `P.remove_min()` | Remove and return a minimum-key `(key, value)` pair. |
| `P.is_empty()` | Say whether no entries remain. |
| `len(P)` | Count the entries. |

Both minimum calls raise the book's `Empty` exception if the queue has no entries. Equal minimum keys may be returned in any order under the ADT. Section 9.2 changes **how** the calls are carried out and **how long** they take; it does not change their meaning.

**Why this example?** With Marc and Fabio in either implementation, `min()` must return Marc's `89_646` ms record. **How to solve it:** check the operation contract first, then trace storage separately. If two implementations give different minimum keys for the same entries, at least one is wrong.

<span id="part-1-positions"></span>

### 2. What a Positional List Provides

Both book implementations keep their entries in a `PositionalList`, built on a **doubly linked list**. A *position* identifies a location; the *element* at that position is the stored key–value item. For example, the unsorted list can hold Fabio's item at its first position and Bagnaia's at its last.

| Positional-list call | What it lets the queue do | Cost in this linked list |
| :--- | :--- | ---: |
| `first()`, `last()` | Find an end position. | `O(1)` |
| `before(p)`, `after(p)` | Move one position. | `O(1)` |
| `add_first(item)`, `add_last(item)`, `add_after(p, item)` | Insert at a known place. | `O(1)` |
| `delete(p)` | Remove a known position. | `O(1)` |
| `len(L)` | Count positions. | `O(1)` |

Here `O(1)` means the work does not grow with the number of waiting entries. `O(n)` means the work can grow in proportion to the `n` entries currently waiting. Moving one linked position is constant time; visiting **all** positions is linear time.

A Python built-in `list` uses an array. In particular, `list.pop(0)` shifts later elements and costs `O(n)`. The book's constant-time first-position deletion depends on its linked `PositionalList`.

**Why this example?** The operation-cost table later depends on these small positional-list operations. **How to solve a cost question:** count how many positions the priority-queue method visits, then add the cost of inserting or deleting at the position it found.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 9.2.1 — The Composition Design Pattern

<span id="part-2-item"></span>

### 1. Keep a Key with Its Rider Record

**Composition** builds one object from contained objects. Here the priority queue contains a `PositionalList`; each list element is an `_Item` containing a key and a value. The value can be a rider record such as `("Marc Márquez", "Ducati Lenovo Team", "1:29.646")`.

```text
Priority queue
└── PositionalList in _data
    └── _Item
        ├── _key   = 89,646
        └── _value = Marc Márquez / Ducati Lenovo Team / 1:29.646
```

Code Fragment 9.1 puts `_Item` inside `PriorityQueueBase`. `_Item.__lt__` compares **keys only**:

```python
def __lt__(self, other):
    return self._key < other._key
```

Thus Marc's item compares below Fabio's because `89_646 < 89_831`. Their names and teams are returned as information, not used to decide who has priority. The book declares `_key` and `_value` in `__slots__`, limiting the fields each `_Item` instance stores.

**Why this example?** A lap-time key is useful only if it stays paired with the right rider and team. **How to solve it:** create one item per record, store both parts together, and define item comparison using the key.

<span id="part-2-base"></span>

### 2. Share Code in a Base Class

Both concrete queues **inherit** from `PriorityQueueBase`. The base class defines `_Item` and a shared emptiness check:

```python
def is_empty(self):
    return len(self) == 0
```

Each concrete queue defines `__len__` by returning the length of its own `_data` list. Therefore the same `is_empty()` method works for both. Inheritance shares code between classes; composition describes the objects each queue contains. They serve different purposes here.

**Why this example?** We need one definition of "empty" for both storage strategies. **How to solve it:** let each implementation report its length, then let the base class compute `len(self) == 0`. Because the positional list maintains its length, this check is `O(1)`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 9.2.2 — Implementation with an Unsorted List

<span id="part-3-add"></span>

### 1. Add at the End

Code Fragment 9.2 defines `UnsortedPriorityQueue`. It creates an empty positional list in `_data`. Its `add(k, v)` wraps the pair in an `_Item` and calls `add_last`. It does **no key search** during insertion.

| Teaching insertion | Unsorted `_data` afterward |
| :--- | :--- |
| Add Fabio, `89_831` | `Fabio` |
| Add Marc, `89_646` | `Fabio → Marc` |
| Add Bezzecchi, `89_657` | `Fabio → Marc → Bezzecchi` |
| Add Bagnaia, `89_634` | `Fabio → Marc → Bezzecchi → Bagnaia` |

Each append is `O(1)` with the linked positional list. The newest entry may be the fastest, slowest, or somewhere between; the unsorted list does not care yet.

**Why this example?** Bagnaia goes to the end even though his key is smallest, making the "cheap now, search later" choice visible. **How to solve it:** append the new `_Item` without comparing keys; do the comparison only when asked for the minimum.

<span id="part-3-scan"></span>

### 2. Scan to Find the Minimum

The book's nonpublic `_find_min()` first checks for an empty queue. It starts with the **first position** as the best candidate, then visits every later position using `after(p)`. It changes the candidate only when the next item's key is **strictly smaller**. It returns the winning **position**, so `remove_min()` can delete that exact position.

| Position visited | Question | Smallest candidate afterward |
| :--- | :--- | :--- |
| Fabio `89_831` | Start here. | Fabio `89_831` |
| Marc `89_646` | Is `89_646 < 89_831`? Yes. | Marc `89_646` |
| Bezzecchi `89_657` | Is `89_657 < 89_646`? No. | Marc `89_646` |
| Bagnaia `89_634` | Is `89_634 < 89_646`? Yes. | Bagnaia `89_634` |

With `n` nonempty entries, the first is only a starting candidate and the other `n - 1` entries each need one comparison. Our four-rider scan makes **three key comparisons**. The scan is `O(n)` time.

**Why this example?** The intermediate candidates show why the algorithm cannot stop when it finds Marc: Bagnaia appears later and has a smaller key. **How to solve it:** start at `first()`, advance with `after()`, compare each item's key to the current best, and return the best position after reaching the end.

<span id="part-3-cost"></span>

### 3. Inspect, Remove, and Measure the Cost

`min()` calls `_find_min()`, reads Bagnaia's item, and returns its `(key, value)` pair. The four entries remain. `remove_min()` calls `_find_min()` again, then uses `delete(p)` on the returned position. It returns Bagnaia's pair and leaves three entries.

```text
Before:           Fabio → Marc → Bezzecchi → Bagnaia     len(P) = 4
P.min():          Bagnaia (89,634 ms)                    len(P) = 4
P.remove_min():   Bagnaia (89,634 ms)                    len(P) = 3
After:            Fabio → Marc → Bezzecchi
```

`min()` is `O(n)` because of its scan. `remove_min()` is also `O(n)`: the scan costs `O(n)`, then deleting a **known linked position** costs `O(1)`. A `min()` call just before `remove_min()` performs two scans in this implementation; the first call does not cache the winner. `len(P)` and `is_empty()` are `O(1)`.

**Why this example?** It separates the cost of *finding* a position from the cost of *deleting* it. **How to solve it:** account for each step. `O(n) + O(1)` is `O(n)`, and looking with `min()` does not remove an entry.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 9.2.3 — Implementation with a Sorted List

<span id="part-4-invariant"></span>

### 1. Maintain Key Order

`SortedPriorityQueue` also contains a positional list, but it maintains an **invariant**: keys are in nondecreasing order from first to last. That means each key is less than or equal to the one after it.

```text
first → Bagnaia(89,634) → Marc(89,646) → Bezzecchi(89,657) → Fabio(89,831) ← last
```

Because the first position always holds a minimum-key item, a minimum request does not need to scan. Insertion has to preserve the invariant.

**Why this example?** The same four entries now have an obvious first minimum. **How to solve it:** check the key order after every insertion, not just at the end. If the new key breaks nondecreasing order, move it to the correct place before storing it.

<span id="part-4-insert"></span>

### 2. Walk Backward to Insert

Code Fragment 9.3 creates an `_Item` for the new pair and begins at the **last position**. While the new item has a strictly smaller key than the current item, it moves one position backward with `before(p)`. It stops at the first existing key **less than or equal to** the new key and inserts after it. If it moves before the first position, it inserts at the front.

| New entry | Backward comparisons | Sorted `_data` afterward |
| :--- | :--- | :--- |
| Fabio `89_831` | List is empty. | `Fabio` |
| Marc `89_646` | `89_646 < 89_831`: move past Fabio. | `Marc → Fabio` |
| Bezzecchi `89_657` | Move past Fabio; stop at Marc because `89_657 < 89_646` is false. | `Marc → Bezzecchi → Fabio` |
| Bagnaia `89_634` | Move past Fabio, Bezzecchi, and Marc; insert first. | `Bagnaia → Marc → Bezzecchi → Fabio` |

The sorted insertions above make `0 + 1 + 2 + 3 = 6` key comparisons. Bagnaia's insertion checks all three existing entries. In general, a new smallest key can require examining all `n` waiting entries, so `add` has **`O(n)` worst-case time**. If the new key is at least the last key, the walk stops after one comparison and that insertion is `O(1)`.

**Why this example?** Marc, Bezzecchi, and Bagnaia exercise three insertion traces: front, middle, and front again after a longer backward walk. **How to solve it:** begin at `last()`, move backward only while `new < current`, then insert after the stopping position or at the front if there is none.

<span id="part-4-minimum"></span>

### 3. Use the First Position for the Minimum

For a nonempty sorted list, `min()` reads the first item's key and value without deleting it. `remove_min()` deletes that first position and returns its key and value. After Bagnaia is removed, Marc becomes first.

```text
Before:           Bagnaia → Marc → Bezzecchi → Fabio     len(P) = 4
P.min():          Bagnaia (89,634 ms)                    len(P) = 4
P.remove_min():   Bagnaia (89,634 ms)                    len(P) = 3
After:            Marc → Bezzecchi → Fabio
```

Both operations are `O(1)` because finding and deleting the first **linked** position are `O(1)`. The expensive work was already done by `add`. `len(P)` and `is_empty()` remain `O(1)`.

**Why this example?** It shows the payoff for keeping the list sorted during insertion. **How to solve it:** rely on the invariant, read `first()` for `min()`, and delete `first()` for `remove_min()`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Compare the Two Implementations

<span id="part-5-table"></span>

### 1. Worst-Case Operation Costs

The book's Tables 9.1 and 9.2 compare the methods for a queue of `n` entries. These bounds assume its **doubly linked positional list**:

| Operation | Unsorted list | Sorted list | Source of the cost |
| :--- | ---: | ---: | :--- |
| `len(P)` | `O(1)` | `O(1)` | Both lists keep a count. |
| `P.is_empty()` | `O(1)` | `O(1)` | The base method checks the count. |
| `P.add(k, v)` | `O(1)` | `O(n)` | Append versus search backward for a place. |
| `P.min()` | `O(n)` | `O(1)` | Scan all entries versus read first. |
| `P.remove_min()` | `O(n)` | `O(1)` | Scan and delete versus delete first. |
| Space for `n` entries | `O(n)` | `O(n)` | Both hold one item per entry. |

The sorted `add` bound is **worst case**; a particular new-largest-key insertion can stop immediately. The unsorted `min` and `remove_min` still need to examine all `n` entries in the book's code.

**Why this example?** The table makes the cost tradeoff visible without changing the ADT result. **How to solve a complexity question:** find the loop, count its possible visits, and add the positional-list operation costs. A constant-time step after a linear scan does not make the entire method constant time.

<span id="part-5-workload"></span>

### 2. Choose by the Workload

Suppose we add the four Q2 records and then ask `min()` **three times** without removing anything. The unsorted version appends without key comparisons, but each peek makes three comparisons: `3 × 3 = 9` comparisons. The sorted version makes six key comparisons during our four insertions, then its three peeks read the first position without key comparisons. These counts describe this **specific insertion order**, not a general benchmark.

| Work pattern | More attractive list | Reason |
| :--- | :--- | :--- |
| Many additions, rare minimum requests | Unsorted | Put each new entry at the end quickly. |
| Few additions, many repeated `min()` calls | Sorted | Pay to arrange entries once, then read the first. |
| Add and eventually remove every entry | Depends on the operation sequence | One version may pay during additions, the other during removals; both can have quadratic total work in the worst case. |

For `n` additions followed by `n` removals, an unsorted queue can spend `O(n²)` total time on the repeated scans. A sorted queue can spend `O(n²)` total time on insertions that each travel through much of the list. The cost of an individual `remove_min()` is still `O(1)` for sorted storage.

**Why this example?** The same data can favor different implementations depending on how often we ask for the minimum. **How to solve it:** estimate how many times the program calls `add`, `min`, and `remove_min`; then use the cost table to identify where the repeated work occurs.

<span id="part-5-edges"></span>

### 3. Equal Keys and Empty Queues

The actual Q2 millisecond keys in our table are distinct. To study a tie, deliberately round Pedro's `89.817` seconds and Fabio's `89.831` seconds to the nearest tenth: both become `89.8` seconds. This is a **teaching key** with less precision than the official times. With Pedro inserted before Fabio, both book implementations would keep Pedro ahead among those equal-key entries: the unsorted scan replaces its candidate only for a strictly smaller key, and sorted insertion places a new equal key after the existing one.

That tie behavior comes from these **implementations**. The priority queue ADT permits either equal-key entry to be returned; code that requires a particular tie rule should specify and implement one. At full millisecond precision, Pedro's actual lap is `14` ms quicker than Fabio's.

Calling `min()` or `remove_min()` when the list is empty raises `Empty` in either class. A safe processing loop checks first:

```python
while not P.is_empty():
    key, rider_record = P.remove_min()
    print(key, rider_record)
```

**Why these examples?** Rounding exposes the difference between a chosen key and the original data; an empty queue tests the boundary of both implementations. **How to solve them:** keep enough precision for the task, do not assume a tie policy from the ADT, and check emptiness before requesting a minimum.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Complete Runnable Demonstration

The following program uses a **small educational doubly linked positional list** so its operation costs match the linked-list assumptions above. It uses nodes directly as positions; the book's full `PositionalList` adds position validation and a separate position wrapper. The two priority-queue classes follow the Section 9.2 algorithms.

Save the code as `q2_list_priority_queues.py`, then run `python q2_list_priority_queues.py`:

```python
class Empty(Exception):
    pass


class _Node:
    def __init__(self, item=None, prev=None, next=None):
        self.item = item
        self.prev = prev
        self.next = next


class PositionalList:
    def __init__(self):
        self._head = _Node()
        self._tail = _Node()
        self._head.next = self._tail
        self._tail.prev = self._head
        self._size = 0

    def __len__(self):
        return self._size

    def first(self):
        node = self._head.next
        return None if node is self._tail else node

    def last(self):
        node = self._tail.prev
        return None if node is self._head else node

    def before(self, node):
        prev = node.prev
        return None if prev is self._head else prev

    def after(self, node):
        next_node = node.next
        return None if next_node is self._tail else next_node

    def _insert_between(self, item, prev, next_node):
        node = _Node(item, prev, next_node)
        prev.next = node
        next_node.prev = node
        self._size += 1
        return node

    def add_first(self, item):
        return self._insert_between(item, self._head, self._head.next)

    def add_last(self, item):
        return self._insert_between(item, self._tail.prev, self._tail)

    def add_after(self, node, item):
        return self._insert_between(item, node, node.next)

    def delete(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev
        self._size -= 1
        return node.item


class PriorityQueueBase:
    class _Item:
        __slots__ = ("_key", "_value")

        def __init__(self, key, value):
            self._key = key
            self._value = value

        def __lt__(self, other):
            return self._key < other._key

    def is_empty(self):
        return len(self) == 0


class UnsortedPriorityQueue(PriorityQueueBase):
    def __init__(self):
        self._data = PositionalList()

    def __len__(self):
        return len(self._data)

    def add(self, key, value):
        self._data.add_last(self._Item(key, value))

    def _find_min(self):
        if self.is_empty():
            raise Empty("priority queue is empty")
        best = self._data.first()
        walk = self._data.after(best)
        while walk is not None:
            if walk.item < best.item:
                best = walk
            walk = self._data.after(walk)
        return best

    def min(self):
        item = self._find_min().item
        return item._key, item._value

    def remove_min(self):
        item = self._data.delete(self._find_min())
        return item._key, item._value


class SortedPriorityQueue(PriorityQueueBase):
    def __init__(self):
        self._data = PositionalList()

    def __len__(self):
        return len(self._data)

    def add(self, key, value):
        new = self._Item(key, value)
        walk = self._data.last()
        while walk is not None and new < walk.item:
            walk = self._data.before(walk)
        if walk is None:
            self._data.add_first(new)
        else:
            self._data.add_after(walk, new)

    def min(self):
        if self.is_empty():
            raise Empty("priority queue is empty")
        item = self._data.first().item
        return item._key, item._value

    def remove_min(self):
        if self.is_empty():
            raise Empty("priority queue is empty")
        item = self._data.delete(self._data.first())
        return item._key, item._value


def lap_to_ms(lap):
    minutes, rest = lap.split(":")
    seconds, milliseconds = rest.split(".")
    return int(minutes) * 60_000 + int(seconds) * 1_000 + int(milliseconds)


def stored_names(queue):
    names = []
    position = queue._data.first()  # Inspect storage only for this demonstration.
    while position is not None:
        names.append(position.item._value[0])
        position = queue._data.after(position)
    return names


# Selected 2026 French GP Q2 best laps; insertion order is a teaching choice.
riders = [
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", "1:29.831"),
    ("Marc Márquez", "Ducati Lenovo Team", "1:29.646"),
    ("Marco Bezzecchi", "Aprilia Racing", "1:29.657"),
    ("Francesco Bagnaia", "Ducati Lenovo Team", "1:29.634"),
]

for queue_type in (UnsortedPriorityQueue, SortedPriorityQueue):
    P = queue_type()
    for name, team, lap in riders:
        P.add(lap_to_ms(lap), (name, team, lap))

    print(queue_type.__name__)
    print("Stored:", " -> ".join(stored_names(P)))
    key, (name, team, lap) = P.min()
    print("Peek: {} | {} | {} | {} ms; count = {}".format(
        name, team, lap, key, len(P)
    ))

    removed = []
    while not P.is_empty():
        _, (name, _, _) = P.remove_min()
        removed.append(name)
    print("Removed:", " -> ".join(removed))
    print("Empty:", P.is_empty())
```

Expected output:

```text
UnsortedPriorityQueue
Stored: Fabio Quartararo -> Marc Márquez -> Marco Bezzecchi -> Francesco Bagnaia
Peek: Francesco Bagnaia | Ducati Lenovo Team | 1:29.634 | 89634 ms; count = 4
Removed: Francesco Bagnaia -> Marc Márquez -> Marco Bezzecchi -> Fabio Quartararo
Empty: True
SortedPriorityQueue
Stored: Francesco Bagnaia -> Marc Márquez -> Marco Bezzecchi -> Fabio Quartararo
Peek: Francesco Bagnaia | Ducati Lenovo Team | 1:29.634 | 89634 ms; count = 4
Removed: Francesco Bagnaia -> Marc Márquez -> Marco Bezzecchi -> Fabio Quartararo
Empty: True
```

**Why this example?** It runs the same four records through both classes, showing different storage order but identical minimum answers. **How to solve it:** use the same keys and insertion order, inspect each list only to understand its layout, then call the public `min()` and `remove_min()` methods to check the ADT behavior. The program intentionally keeps the positional-list stand-in small; it is sufficient for these operations but is not a general-purpose validated linked-list library.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 9.2 idea | Plain-language meaning | French GP Q2 example |
| :--- | :--- | :--- |
| Composition | The queue contains a positional list of key–value `_Item` objects. | Keep Marc's `89_646` ms key with his rider/team record. |
| Base class | Share `_Item` and `is_empty()` across implementations. | Both classes check `len(P) == 0`. |
| Unsorted list | Append quickly and scan for a minimum later. | Bagnaia is appended last but found by the scan. |
| Sorted list | Search during insertion so a minimum stays first. | Bagnaia is inserted at the front. |
| `min()` | Return a minimum without deleting it. | Bagnaia remains among four entries. |
| `remove_min()` | Return and delete a minimum. | Bagnaia leaves; Marc becomes the next minimum. |
| Cost tradeoff | Unsorted favors `add`; sorted favors `min` and `remove_min`. | The work occurs during different calls for the same Q2 records. |
| Linked-list assumption | A known position can be deleted in `O(1)`. | Sorted `remove_min()` deletes its first position quickly. |
| Equal keys | The ADT allows either tied minimum; these list algorithms use strict `<`. | Rounded Pedro and Fabio keys tie at `89.8` seconds. |

[🔝 Back to Top](#top)
