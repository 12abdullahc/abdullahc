<span id="top"></span>

# Stacks, Queues, and Deques — Section 6.3: Double-Ended Queues

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.3, printed pages 247–249 ([chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C06.pdf)).  
> **Topic:** The deque abstract data type, its relationship to stacks and queues, circular-array implementation, and Python's `collections.deque`.  
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika, using Marc Márquez, Fabio Quartararo, and other riders from that session.  
> **Learning goal:** Trace changes at both ends, implement a deque with circular indices, and translate the abstract operations into Python's standard library.  
> **User Prompt:** "Reexplain [Section 6.3] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Two Ends of a Review Desk](#background-intuition)
   - [1. One verified Practice session](#background-data)
   - [2. A line of report cards with two open ends](#background-ends)
2. [Part 1: Section 6.3 — What a Deque Does](#part-1)
   - [1. Relate a deque to a stack and a queue](#part-1-connection)
   - [2. Trace both ends](#part-1-trace)
3. [Part 2: Section 6.3.1 — The Deque Abstract Data Type](#part-2)
   - [1. The eight public operations](#part-2-interface)
   - [2. Peeking, deleting, and the empty case](#part-2-empty)
4. [Part 3: Section 6.3.2 — A Circular-Array Deque](#part-3)
   - [1. Find both ends with modular arithmetic](#part-3-indices)
   - [2. Trace physical slots and a resize](#part-3-trace)
   - [3. Build `ArrayDeque`](#part-3-code)
   - [4. Understand the costs](#part-3-cost)
5. [Part 4: Section 6.3.3 — Python's `collections.deque`](#part-4)
   - [1. Translate the ADT operations](#part-4-map)
   - [2. Extra methods and bounded deques](#part-4-extra)
6. [Part 5: Complete Worked Practice Review](#part-5)
   - [1. Solve the task step by step](#part-5-steps)
   - [2. Run and trace the program](#part-5-program)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Two Ends of a Review Desk

<span id="background-data"></span>

### 1. One verified Practice session

We use rider records from **MotoGP Practice on Friday 9 October 2026** at Mandalika. The [MotoGP session report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) confirms the session; [Yamaha's full Practice results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) give the positions, teams, and best laps.

| Practice position | Rider | Team | Best lap | Short code |
| :---------------: | :---- | :--- | -------: | :--------- |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | `MARC` |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:29.558 | `FABIO` |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | `RAUL` |
| P2 | Marco Bezzecchi | Aprilia Racing | 1:28.944 | `MARCO` |
| P4 | Pedro Acosta | Red Bull KTM Factory Racing | 1:29.394 | `PEDRO` |
| P3 | Jorge Martín | Aprilia Racing | 1:29.206 | `JORGE` |

The table puts Marc and Fabio first for this lesson; it is **not** the official classification order. The rider facts are real. Every insertion, deletion, and review order below is an imagined operation on report cards, not a claim about who arrived at the track first or who was given priority in MotoGP Practice.

**Why this example?** It keeps the data consistent with the [stack](06-01-stacks.md) and [queue](06-02-queues.md) guides. **How to use it:** read a code as a report card about that rider, and keep its place in our study structure separate from the rider's official Practice position.

<span id="background-ends"></span>

### 2. A line of report cards with two open ends

Imagine that a review desk has three cards arranged left to right:

```text
Front / left                          Back / right
    MARC        FABIO        RAUL
      ↑                              ↑
  accessible                      accessible
```

The reviewer may add or remove a card at **either end**. The middle card, Fabio, is not directly removable through the basic end operations while Marc and Raúl remain. A **double-ended queue**, shortened to **deque** and pronounced "deck," provides this two-ended behavior.

**Why this example?** Marc and Raúl make the two ends visible, while Fabio shows what remains in the middle. **How to solve an end-operation question:** draw the cards front to back, mark both ends, and apply the operation only where its name says.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 6.3 — What a Deque Does

<span id="part-1-connection"></span>

### 1. Relate a deque to a stack and a queue

A deque permits insertions and deletions at **both** ends. A stack or queue appears when we restrict which ends we use:

| Allowed pattern | Result | From `[MARC, FABIO, RAUL]` |
| :-------------- | :----- | :------------------------- |
| Add at back; delete at front | Queue, **FIFO** | Marc leaves first. |
| Add and delete at the back | Stack, **LIFO** | Raúl leaves first. |
| Add and delete at either end | Deque | Remove Marc from the front or Raúl from the back. |

The core deque does not sort by lap time or locate a particular middle record for deletion. Fabio's P7 result does not give his card any special position in the deque; only our chosen arrangement does.

**Why this example?** It reuses the same three cards so the change in behavior comes only from the allowed end operations. **How to choose a structure:** decide which item must leave next. Use a queue for oldest-first service, a stack for newest-first undo, and a deque when either end may be needed.

<span id="part-1-trace"></span>

### 2. Trace both ends

We start with `[MARC, FABIO, RAUL]`, written **front to back**. The later additions are hypothetical editorial requests:

| Step | Operation | Returned value | Deque afterward, front to back |
| ---: | :-------- | :------------- | :----------------------------- |
| 0 | Start | — | `[MARC, FABIO, RAUL]` |
| 1 | `first()` | `MARC` | `[MARC, FABIO, RAUL]` |
| 2 | `last()` | `RAUL` | `[MARC, FABIO, RAUL]` |
| 3 | `delete_first()` | `MARC` | `[FABIO, RAUL]` |
| 4 | `delete_last()` | `RAUL` | `[FABIO]` |
| 5 | `add_first(MARCO)` | None | `[MARCO, FABIO]` |
| 6 | `add_last(PEDRO)` | None | `[MARCO, FABIO, PEDRO]` |
| 7 | `add_first(JORGE)` | None | `[JORGE, MARCO, FABIO, PEDRO]` |

The peeks in steps 1 and 2 do not remove anything. Deletions in steps 3 and 4 leave Fabio's card. Adding Marco to the front places it before Fabio; adding Pedro to the back places it after Fabio. This is a scheduling example at the review desk, **not** a change to the official Practice ranking.

**Why this example?** Every kind of end access appears in one short sequence. **How to solve it:** after each operation, update only the named end, record any returned card, and then check which cards are now first and last.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 6.3.1 — The Deque Abstract Data Type

An **abstract data type** (ADT) specifies behavior without saying how elements are stored. The deque ADT generalizes stack and queue behavior by allowing operations at both ends.

<span id="part-2-interface"></span>

### 1. The eight public operations

For a deque `D`, each example row starts independently with `D = [MARC, FABIO, RAUL]`:

| Operation | Contract | Example result |
| :-------- | :------- | :------------- |
| `D.add_first(e)` | Insert `e` at the front. | `add_first(MARCO)` gives `[MARCO, MARC, FABIO, RAUL]`. |
| `D.add_last(e)` | Insert `e` at the back. | `add_last(PEDRO)` gives `[MARC, FABIO, RAUL, PEDRO]`. |
| `D.delete_first()` | Remove and return the front. | Returns `MARC`; leaves `[FABIO, RAUL]`. |
| `D.delete_last()` | Remove and return the back. | Returns `RAUL`; leaves `[MARC, FABIO]`. |
| `D.first()` | Return the front without removal. | Returns `MARC`; length remains `3`. |
| `D.last()` | Return the back without removal. | Returns `RAUL`; length remains `3`. |
| `D.is_empty()` | Return `True` exactly when no items remain. | `False`. |
| `len(D)` | Return the number of items. | `3`. |

The ADT accepts any element type and sets no fixed maximum capacity, though computer memory is finite. It promises operations at the **ends**, not direct deletion of any rider selected by name from the middle.

**Why this example?** Starting each row from the same three-card state isolates the meaning of one operation. **How to use the contract:** identify the named end, state whether the operation returns an element, and show the resulting front-to-back order.

<span id="part-2-empty"></span>

### 2. Peeking, deleting, and the empty case

`first()` and `last()` are **peeks**: repeated calls return the same end card until the deque changes. `delete_first()` and `delete_last()` remove cards. If the deque is empty, neither end contains a card, so the two peeks and two deletions must report an error. A book-style array implementation uses the `Empty` exception; Python's `collections.deque` uses `IndexError` for empty end reads or removals.

After defining the `ArrayDeque` class in Part 3, an empty-deque check can be written as:

```python
review = ArrayDeque()
if not review.is_empty():
    print("Front card:", review.first())
    print("Back card:", review.last())
else:
    print("No report cards remain.")
```

**Why this example?** A two-ended structure still has an important zero-item edge case. **How to solve it:** check emptiness before reading or deleting an end when an empty deque is expected; otherwise handle the implementation's exception.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 6.3.2 — A Circular-Array Deque

Section 6.2 used a circular array for a queue. To support a deque, we also need to insert before the current front and delete after the current back. The book sketches this extension and leaves a complete array-deque implementation as an exercise.

<span id="part-3-indices"></span>

### 1. Find both ends with modular arithmetic

Let `N` be the physical array capacity, `_front` the index of the first live card, and `_size` the number of live cards. The remainder operator `% N` wraps an index around the array:

| End operation | Physical slot or update | Example with `N = 3` |
| :------------ | :---------------------- | :------------------- |
| Read front | `_front` | If front is `1`, read slot `1`. |
| Read back, when nonempty | `(_front + _size - 1) % N` | Front `1`, size `2`: back is slot `2`. |
| Add at front, if not full | `_front = (_front - 1) % N` | From front `0`, new front is slot `2`. |
| Add at back, if not full | `(_front + _size) % N` | Front `1`, size `1`: write slot `2`. |
| Delete at front | Clear `_front`, then advance it modulo `N`. | From front `2`, next front is slot `0`. |
| Delete at back | Clear `(_front + _size - 1) % N`. | Front `1`, size `2`: clear slot `2`. |

For an empty deque, the back formula would not identify a live element, so `last()` and `delete_last()` must check `_size` first. When `_size = N`, either addition must grow the array **before** writing a new item.

**Why this example?** The formulas show that both ends can move without shifting all existing cards. **How to solve an index question:** write `N`, `_front`, and `_size` before the operation; compute the target slot; then update size and, only when needed, front.

<span id="part-3-trace"></span>

### 2. Trace physical slots and a resize

Use a **three-slot teaching array**, starting with Marc, Fabio, and Raúl. The book's queue class starts with ten slots; three makes the end movements visible.

| Action | Physical slots `0, 1, 2` | `_front` | `_size` | Logical deque, front to back |
| :----- | :------------------------ | -------: | ------: | :--------------------------- |
| Start | `[MARC, FABIO, RAUL]` | 0 | 3 | `[MARC, FABIO, RAUL]` |
| Delete front Marc | `[·, FABIO, RAUL]` | 1 | 2 | `[FABIO, RAUL]` |
| Delete back Raúl | `[·, FABIO, ·]` | 1 | 1 | `[FABIO]` |
| Add front Marco | `[MARCO, FABIO, ·]` | 0 | 2 | `[MARCO, FABIO]` |
| Add back Pedro | `[MARCO, FABIO, PEDRO]` | 0 | 3 | `[MARCO, FABIO, PEDRO]` |

The dot means an unused slot. The array is now full. To add Jorge at the front, first double capacity to six and copy the **logical order** into new slots `0` to `2`. Reset `_front` to `0`, then move it one step left modulo six:

```text
After resize: [MARCO, FABIO, PEDRO, ·, ·, ·]    front = 0, size = 3
Add front:    [MARCO, FABIO, PEDRO, ·, ·, JORGE] front = 5, size = 4
Logical:      JORGE → MARCO → FABIO → PEDRO
```

Jorge is the **logical front** even though his physical slot is `5`. Copying the old slot indexes unchanged during a resize would be unsafe when the modulo base changes; instead, copy items in logical front-to-back order and reset front to `0`.

**Why this example?** It shows both-end deletion, reuse of freed slots, growth, and wraparound in one trace. **How to solve it:** reconstruct the logical deque by reading `_size` slots beginning at `_front`, wrapping modulo capacity, rather than reading physical slots left to right.

<span id="part-3-code"></span>

### 3. Build `ArrayDeque`

This complete teaching implementation extends the circular queue from Section 6.2. It grows when full and does not shrink. Run the block in Python 3:

```python
class Empty(Exception):
    """Raised when a deque has no end item to read or remove."""


class ArrayDeque:
    def __init__(self, capacity=10):
        if capacity < 1:
            raise ValueError("Capacity must be positive")
        self._data = [None] * capacity
        self._front = 0
        self._size = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def first(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        return self._data[self._front]

    def last(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        back = (self._front + self._size - 1) % len(self._data)
        return self._data[back]

    def add_first(self, item):
        if self._size == len(self._data):
            self._resize(2 * len(self._data))
        self._front = (self._front - 1) % len(self._data)
        self._data[self._front] = item
        self._size += 1

    def add_last(self, item):
        if self._size == len(self._data):
            self._resize(2 * len(self._data))
        available = (self._front + self._size) % len(self._data)
        self._data[available] = item
        self._size += 1

    def delete_first(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        answer = self._data[self._front]
        self._data[self._front] = None
        self._front = (self._front + 1) % len(self._data)
        self._size -= 1
        return answer

    def delete_last(self):
        if self.is_empty():
            raise Empty("Deque is empty")
        back = (self._front + self._size - 1) % len(self._data)
        answer = self._data[back]
        self._data[back] = None
        self._size -= 1
        return answer

    def _resize(self, new_capacity):
        old = self._data
        self._data = [None] * new_capacity
        for k in range(self._size):
            self._data[k] = old[(self._front + k) % len(old)]
        self._front = 0


review = ArrayDeque(capacity=3)
for code in ("MARC", "FABIO", "RAUL"):
    review.add_last(code)
print(review.first(), review.last())
print(review.delete_first(), review.delete_last())
review.add_first("MARCO")
review.add_last("PEDRO")
review.add_first("JORGE")  # grows, then wraps the front to slot 5
print(review.first(), review.last(), len(review))
```

```text
MARC RAUL
MARC RAUL
JORGE PEDRO 4
```

Each deletion clears its old slot to release the reference. `_size`, not the presence or absence of `None`, determines whether the deque is empty, so `None` could itself be a valid stored item. The underscore fields are implementation details; callers should use the public methods.

**Why this example?** It turns the index rules into a runnable class and checks both ends after growth. **How to build it:** adapt the queue's front removal and back insertion, add their opposite-end counterparts, and make all additions resize before writing into a full array.

<span id="part-3-cost"></span>

### 4. Understand the costs

For `n` live items in this **growing-only** class:

| Operation | Time | Reason |
| :-------- | :--- | :----- |
| `first()`, `last()`, `is_empty()`, `len(D)` | `O(1)` worst case | Read an end slot or stored state. |
| `delete_first()`, `delete_last()` | `O(1)` worst case | Clear one slot and adjust an index or size. |
| `add_first(e)`, `add_last(e)` | `O(1)` amortized; `O(n)` on a growth step | A full array requires copying the live items. |

This class does not shrink, so after many deletions its capacity can still reflect the largest deque it held. Adding a careful shrinking rule can make storage proportional to the current size plus a fixed baseline, with deletions then `O(1)` **amortized** rather than worst-case constant time. The ADT's behavior is independent of this storage choice.

**Why this example?** The same end operation may be cheap normally and expensive when it triggers a copy. **How to analyze it:** separate one operation's worst case from its average cost across many operations, and state whether the chosen implementation shrinks.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 6.3.3 — Python's `collections.deque`

Python supplies a ready-to-use `deque` in the `collections` module. Its interface has different names from the book's ADT; the [Python documentation](https://docs.python.org/3/library/collections.html#collections.deque) describes its end operations and additional methods. The book describes Python's implementation as fixed-size blocks linked in a doubly linked list, with circular-array ideas inside the blocks. Its internal representation is not the single teaching array drawn in Part 3.

<span id="part-4-map"></span>

### 1. Translate the ADT operations

| Book's deque ADT | Python `collections.deque` | Meaning |
| :-------------- | :------------------------- | :------ |
| `add_first(e)` | `d.appendleft(e)` | Add at the left/front. |
| `add_last(e)` | `d.append(e)` | Add at the right/back. |
| `delete_first()` | `d.popleft()` | Remove and return the front. |
| `delete_last()` | `d.pop()` | Remove and return the back. |
| `first()` | `d[0]` | Read the front without removal. |
| `last()` | `d[-1]` | Read the back without removal. |
| `is_empty()` | `len(d) == 0` | Test for no items. |
| `len(D)` | `len(d)` | Count items. |

```python
from collections import deque

cards = deque(["MARC", "FABIO", "RAUL"])
print(cards[0], cards[-1])
print(cards.popleft(), cards.pop())
cards.appendleft("MARCO")
cards.append("PEDRO")
print(list(cards))
```

```text
MARC RAUL
MARC RAUL
['MARCO', 'FABIO', 'PEDRO']
```

The two peeks leave all three original cards in place. On an empty Python deque, `popleft()`, `pop()`, `d[0]`, and `d[-1]` raise `IndexError`. The documentation describes approximately constant-time operations at either end, while indexed access near the **middle** can take `O(n)`. Converting the entire deque with `list(cards)` for display also takes `O(n)`.

**Why this example?** It repeats the same end operations with real Python method names. **How to translate code:** read `left` as the front, use `append` to add and `pop` to remove at the named end, and guard empty end reads or removals.

<span id="part-4-extra"></span>

### 2. Extra methods and bounded deques

Python's deque also supports `d[j]`, `d[j] = value`, `rotate`, `clear`, `count`, and `remove`. These go beyond the core eight ADT operations. `rotate(1)` moves the back item to the front; `remove(value)` deletes the **first** matching item and raises `ValueError` if none is found. Accessing or replacing an item near the middle can take `O(n)` time.

```python
from collections import deque

cards = deque(["MARC", "FABIO", "RAUL"])
print(cards[1])       # inspect the middle card
cards[1] = "PEDRO"    # replace it in this imagined display
cards.rotate(1)       # move the back card to the front
print(list(cards))
print(cards.count("MARC"))
cards.remove("PEDRO")
print(list(cards))
cards.clear()
print(len(cards))
```

```text
FABIO
['RAUL', 'MARC', 'PEDRO']
1
['RAUL', 'MARC']
0
```

This replaces a **display card**, not Fabio's official Practice result. **Why this example?** It shows the extra operations while keeping their effect separate from the core end-only ADT. **How to solve it:** update the displayed order after replacement and rotation, count or remove the requested code, then verify that `clear()` leaves length zero.

A Python deque can have a maximum length. When full, an end addition automatically discards an item from the **opposite** end:

```python
from collections import deque

display = deque(["MARC", "FABIO", "RAUL"], maxlen=3)
display.append("MARCO")      # front MARC is discarded
print(list(display))
display.appendleft("PEDRO")  # back MARCO is discarded
print(list(display))
```

```text
['FABIO', 'RAUL', 'MARCO']
['PEDRO', 'FABIO', 'RAUL']
```

This is an imagined **three-card display**, not an instruction to drop a real rider's result. The unbounded deque ADT does not discard an opposite-end item when a new one is added.

**Why this example?** The automatic discard is easy to miss and changes the outcome even though no explicit deletion appears. **How to solve a bounded-deque trace:** if it is full, remove the opposite-end item first, then insert the new item at the requested end.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Complete Worked Practice Review

<span id="part-5-steps"></span>

### 1. Solve the task step by step

The following program uses Python's unbounded `collections.deque` for an imagined review desk. The rider records are factual; the choices to add or remove each card are for learning.

1. Store each rider's Practice position, team, and best lap under a short code.
2. Start with Marc at the front, Fabio in the middle, and Raúl at the back.
3. Read both ends without deletion, then remove Marc from the front and Raúl from the back.
4. Add Marco at the front, Pedro at the back, and Jorge at the front.
5. Print the final front-to-back order and confirm that Fabio remains in the output.

**Why this example?** It exercises all four modifying end operations while showing real Marc and Fabio entries. **How to solve it:** write a one-line deque after each operation, then compare the final line with the program's output.

<span id="part-5-program"></span>

### 2. Run and trace the program

Save this as `practice_deque.py` and run `python practice_deque.py`:

```python
from collections import deque

# Verified Friday 2026 Indonesian GP MotoGP Practice results.
practice = {
    "MARC": ("Marc Márquez", "Ducati Lenovo Team", 5, "1:29.426"),
    "FABIO": ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 7, "1:29.558"),
    "RAUL": ("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, "1:28.725"),
    "MARCO": ("Marco Bezzecchi", "Aprilia Racing", 2, "1:28.944"),
    "PEDRO": ("Pedro Acosta", "Red Bull KTM Factory Racing", 4, "1:29.394"),
    "JORGE": ("Jorge Martín", "Aprilia Racing", 3, "1:29.206"),
}


def describe(code):
    name, team, place, lap = practice[code]
    return f"{name} — {team}: P{place}, {lap}"


review = deque(["MARC", "FABIO", "RAUL"])
print("Front:", describe(review[0]))
print("Back:", describe(review[-1]))

print("Removed front:", practice[review.popleft()][0])
print("Removed back:", practice[review.pop()][0])

review.appendleft("MARCO")
review.append("PEDRO")
review.appendleft("JORGE")

print("Final front-to-back review:")
for code in review:
    print(describe(code))
```

```text
Front: Marc Márquez — Ducati Lenovo Team: P5, 1:29.426
Back: Raúl Fernández — SuperFile Trackhouse MotoGP Team: P1, 1:28.725
Removed front: Marc Márquez
Removed back: Raúl Fernández
Final front-to-back review:
Jorge Martín — Aprilia Racing: P3, 1:29.206
Marco Bezzecchi — Aprilia Racing: P2, 1:28.944
Fabio Quartararo — Monster Energy Yamaha MotoGP Team: P7, 1:29.558
Pedro Acosta — Red Bull KTM Factory Racing: P4, 1:29.394
```

The final order is the review desk's **hypothetical card order**, not the official Practice classification. The positions and laps beside the names remain the real session data.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section idea | Rule to remember | Practice-card example |
| :----------- | :--------------- | :-------------------- |
| Deque | Add and remove at either end. | Remove Marc from the front or Raúl from the back. |
| Stack and queue connection | Restrict the ends to get LIFO or FIFO. | Back removal gives Raúl; front removal gives Marc. |
| Deque ADT | Eight public operations define behavior. | `add_first`, `add_last`, both deletes, both peeks, `is_empty`, `len`. |
| Empty deque | Neither end contains a card. | A book-style class raises `Empty`; Python raises `IndexError`. |
| Circular array | Move front or back with modulo capacity. | After growth, Jorge is at slot `5` but is first. |
| Resize | Copy in logical order, then reset front. | Keep `[MARCO, FABIO, PEDRO]` before adding Jorge. |
| Python deque | `appendleft`/`popleft` use the front; `append`/`pop` use the back. | Process the same card trace with standard-library methods. |
| `maxlen` | A full bounded deque discards from the opposite end. | Adding Marco at the back drops Marc from a three-card display. |

[🔝 Back to Top](#top)
