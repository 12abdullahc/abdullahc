<span id="top"></span>

# Stacks, Queues, and Deques — Section 6.2: Queues

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.2, printed pages 239–246 ([chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C06.pdf)).  
> **Topic:** First-in, first-out order; the queue abstract data type; a circular array implementation; wraparound, resizing, and operation costs.  
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika, using Marc Márquez, Fabio Quartararo, and other riders from that same session.  
> **Learning goal:** Trace a queue from front to back, implement it without shifting every item, and explain why a circular array preserves arrival order.  
> **User Prompt:** "Reexplain [Section 6.2] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: A Practice Review Desk](#background-intuition)
   - [1. One verified Practice session](#background-data)
   - [2. An imagined line of review requests](#background-line)
2. [Part 1: Section 6.2 — What a Queue Does](#part-1)
   - [1. Front, back, and first in, first out](#part-1-fifo)
   - [2. Trace the waiting requests](#part-1-trace)
3. [Part 2: Section 6.2.1 — The Queue Abstract Data Type](#part-2)
   - [1. The five public operations](#part-2-interface)
   - [2. Handle an empty queue](#part-2-empty)
4. [Part 3: Section 6.2.2 — An Array-Based Queue](#part-3)
   - [1. Why a plain list needs more thought](#part-3-naive)
   - [2. Reuse slots with a circular array](#part-3-circular)
   - [3. Trace wraparound](#part-3-wrap)
   - [4. Grow while preserving queue order](#part-3-resize)
   - [5. Build `ArrayQueue`](#part-3-code)
   - [6. Time, space, and optional shrinking](#part-3-cost)
5. [Part 4: Complete Worked Practice Review](#part-4)
   - [1. Solve the task step by step](#part-4-steps)
   - [2. Run and trace the program](#part-4-program)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: A Practice Review Desk

<span id="background-data"></span>

### 1. One verified Practice session

All rider facts in this guide come from **MotoGP Practice on Friday 9 October 2026** at Mandalika. The [MotoGP session report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) identifies the session; [Yamaha's full Practice results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) list the positions, teams, and best laps.

| Practice position | Rider | Team | Best lap | Code in examples |
| :---------------: | :---- | :--- | -------: | :--------------- |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | `MARC` |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:29.558 | `FABIO` |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | `RAUL` |
| P2 | Marco Bezzecchi | Aprilia Racing | 1:28.944 | `MARCO` |
| P4 | Pedro Acosta | Red Bull KTM Factory Racing | 1:29.394 | `PEDRO` |
| P3 | Jorge Martín | Aprilia Racing | 1:29.206 | `JORGE` |

Marc and Fabio appear first because we will handle their requests first. The table is **not sorted by Practice position**. A lower best-lap time earns a better Practice position; neither result tells us when a request would arrive at an analysis desk.

**Why this example?** Real names and times make each queue item meaningful, while six short codes keep the storage diagrams readable. **How to use the data:** use a code to identify a rider record, and keep the official position separate from the imagined request order.

<span id="background-line"></span>

### 2. An imagined line of review requests

Imagine that an analyst receives requests to review the riders' Practice entries in this **chosen teaching order**: Marc, Fabio, Raúl, Marco, Pedro, Jorge. This is an invented desk workflow, not a report of riders lining up at the circuit. At first, only the first three requests are waiting:

```text
Front                                      Back
MARC  →  FABIO  →  RAUL
 ↑ next request to handle                ↑ newest request
```

The analyst handles the **oldest waiting request** first. Marc leaves, then Fabio. A new request joins at the back; it cannot jump ahead of Raúl. That rule is **first in, first out**, abbreviated **FIFO**.

The [stack in Section 6.1](06-01-stacks.md) would remove the newest item from the same three-item insertion order, which would be Raúl. A queue removes Marc instead. Both structures can hold the same records; their removal rules differ.

**Why this example?** It makes FIFO visible without confusing request arrival with Practice ranking. **How to predict service order:** write requests from front to back, remove from the left, and add new ones at the right.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 6.2 — What a Queue Does

The book introduces queues with waiting lines and requests waiting for service. The **front** is the oldest waiting item; the **back** is where a new item arrives.

<span id="part-1-fifo"></span>

### 1. Front, back, and first in, first out

| Action | Meaning | Review-desk example |
| :----- | :------ | :------------------ |
| **Enqueue** | Add an item at the back. | Add Raúl after Fabio. |
| **First** | Read the front without removing it. | See that Marc is next. |
| **Dequeue** | Remove and return the front. | Handle Marc; Fabio becomes next. |

For `[MARC, FABIO, RAUL]`, written **front to back**, `first()` returns `MARC` and leaves all three waiting. `dequeue()` returns `MARC` and leaves `[FABIO, RAUL]`. A second dequeue returns `FABIO`.

```text
Before:     [MARC, FABIO, RAUL]  front → MARC
first():     MARC                [MARC, FABIO, RAUL]  (unchanged)
dequeue():   MARC                [FABIO, RAUL]
dequeue():   FABIO               [RAUL]
```

**Why this example?** Marc and Fabio make the difference between looking and serving easy to check. **How to solve it:** point to the leftmost item for both operations; remove that item only for `dequeue()`.

<span id="part-1-trace"></span>

### 2. Trace the waiting requests

Each row starts from the preceding row. The rightmost item is always the newest request:

| Step | Action | Returned value | Queue afterward, front to back | Length |
| ---: | :----- | :------------- | :----------------------------- | -----: |
| 0 | Start | — | `[]` | 0 |
| 1 | `enqueue(MARC)` | None | `[MARC]` | 1 |
| 2 | `enqueue(FABIO)` | None | `[MARC, FABIO]` | 2 |
| 3 | `enqueue(RAUL)` | None | `[MARC, FABIO, RAUL]` | 3 |
| 4 | `first()` | `MARC` | `[MARC, FABIO, RAUL]` | 3 |
| 5 | `dequeue()` | `MARC` | `[FABIO, RAUL]` | 2 |
| 6 | `enqueue(MARCO)` | None | `[FABIO, RAUL, MARCO]` | 3 |
| 7 | `dequeue()` | `FABIO` | `[RAUL, MARCO]` | 2 |

Notice that `MARCO` joined after `RAUL`, so Marco cannot be served before Raúl. The queue tracks **which request is next**. It does not compare lap times or compute a Practice position; those facts belong to each rider record.

**Why this example?** An arrival after one removal tests whether we really keep FIFO order. **How to solve a queue trace:** update the left and right ends separately, write the returned value, then count the remaining items.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 6.2.1 — The Queue Abstract Data Type

An **abstract data type** (ADT) describes the operations a queue promises without requiring a particular storage method. The front-to-back rule stays the same whether we later use a circular array or another implementation.

<span id="part-2-interface"></span>

### 1. The five public operations

Let `Q` be a queue and `e` any item. The examples below each start independently with `Q = [MARC, FABIO, RAUL]`:

| Operation | Contract | Example result |
| :-------- | :------- | :------------- |
| `Q.enqueue(e)` | Add `e` at the back; return no item. | `enqueue(MARCO)` gives `[MARC, FABIO, RAUL, MARCO]`. |
| `Q.dequeue()` | Remove and return the front. | Returns `MARC`; leaves `[FABIO, RAUL]`. |
| `Q.first()` | Return the front without removal. | Returns `MARC`; queue stays the same. |
| `Q.is_empty()` | Return `True` exactly when no items wait. | `False`. |
| `len(Q)` | Return the number of waiting items. | `3`. |

The queue may hold codes, whole rider records, or other kinds of items. The ADT sets no fixed maximum capacity, although memory is finite. It has no operation for removing Fabio from the middle while Marc remains at the front.

**Why this example?** The table states behavior before any array indices appear. **How to use an ADT contract:** identify the front and back, apply one operation to the stated starting queue, and report both its return value and its resulting contents.

<span id="part-2-empty"></span>

### 2. Handle an empty queue

For a new queue, `len(Q)` is `0` and `Q.is_empty()` is `True`. `Q.first()` and `Q.dequeue()` cannot return a request then. The book's array implementation raises an `Empty` exception for either call.

```python
if waiting.is_empty():
    print("No Practice request is waiting.")
else:
    code = waiting.dequeue()
    print("Review", code)
```

The empty check is suitable when an empty line of work is normal. If the program expected at least one request, an `Empty` exception can instead expose a mistaken assumption.

**Why this example?** The empty case is the one place where "take the first item" has no answer. **How to solve it:** check `is_empty()` before `first()` or `dequeue()`, or deliberately handle the `Empty` exception.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 6.2.2 — An Array-Based Queue

<span id="part-3-naive"></span>

### 1. Why a plain list needs more thought

A simple list can store requests in front-to-back order:

```python
waiting = ["MARC", "FABIO", "RAUL"]
served = waiting.pop(0)
print(served, waiting)
```

```text
MARC ['FABIO', 'RAUL']
```

The result is correct, but `pop(0)` must shift Fabio and Raúl left. With `n` waiting entries, removing the first element costs `O(n)` time. We could leave old slots in place and move a front index right, but then a long-running queue might retain many abandoned slots. The book avoids both problems by treating a fixed-size array as **circular** and reusing freed slots.

**Why this example?** It separates a correct answer from an efficient method. **How to spot the cost:** after removing index `0`, count how many surviving entries must move.

<span id="part-3-circular"></span>

### 2. Reuse slots with a circular array

The implementation keeps three pieces of state:

| Field | Meaning | After Marc and Fabio have been served from a three-slot array |
| :---- | :------ | :------------------------------------------------------------- |
| `_data` | Physical slots | `[None, None, RAUL]` |
| `_front` | Index of the first live item | `2` |
| `_size` | Number of live items | `1` |

The **logical queue** is now `[RAUL]`, even though Raúl sits at physical index `2`. For array capacity `N`, the remainder operator `%` wraps an index after `N - 1` back to `0`:

| Purpose | Formula | Three-slot example |
| :------ | :------ | :----------------- |
| Advance front after a dequeue | `(_front + 1) % N` | From `2`, advance to `0`. |
| Find the next free slot for enqueue | `(_front + _size) % N` | Front `2`, size `1`: use `0`. |
| Find logical item `k` from the front | `(_front + k) % N` | After Marco joins, front `2` and item `1` is at `0`. |

Here `k = 0` means the front item. The enqueue formula uses `_size` **before** increasing it. Dequeue sets the old front slot to `None` so the queue no longer holds a reference to the served item.

**Why this example?** Raúl at index `2` shows why physical array order is not the queue's service order. **How to solve an index question:** write `_front`, `_size`, and `N`, substitute into the formula, and use the remainder to wrap.

<span id="part-3-wrap"></span>

### 3. Trace wraparound

Use **three slots only for this teaching trace**; the book's class begins with ten. Start with Marc, Fabio, and Raúl:

```text
Index:         0       1       2
Physical:    [MARC,  FABIO,  RAUL]   front = 0, size = 3
Logical:      MARC → FABIO → RAUL
```

After two dequeues, Marc and Fabio have been served. Now enqueue Marco and Pedro:

| Action | Insertion slot | Physical array afterward | Front | Logical queue |
| :----- | :------------- | :----------------------- | ----: | :------------ |
| Dequeue Marc and Fabio | — | `[None, None, RAUL]` | 2 | `[RAUL]` |
| Enqueue Marco | `(2 + 1) % 3 = 0` | `[MARCO, None, RAUL]` | 2 | `[RAUL, MARCO]` |
| Enqueue Pedro | `(2 + 2) % 3 = 1` | `[MARCO, PEDRO, RAUL]` | 2 | `[RAUL, MARCO, PEDRO]` |

The physical left-to-right array is `[MARCO, PEDRO, RAUL]`. **Raúl is still first** because `_front = 2`. Wraparound reuses slots; it does not change who arrived earlier.

**Why this example?** Two removals create free slots at the start, and two additions make the wrap visible. **How to solve it:** update front and size after each dequeue, calculate each insertion slot from the current values, and reconstruct the logical queue starting at `_front`.

<span id="part-3-resize"></span>

### 4. Grow while preserving queue order

The three slots are full when Jorge's request arrives. The queue doubles its capacity to six, copying the **logical** order into new slots beginning at index `0`. Only then does it add Jorge:

```text
Before growth: [MARCO, PEDRO, RAUL]                 front = 2
Copied order:  [RAUL, MARCO, PEDRO, ·, ·, ·]        front = 0
After Jorge:   [RAUL, MARCO, PEDRO, JORGE, ·, ·]   front = 0
```

The dot means an unused slot. The queue is now `[RAUL, MARCO, PEDRO, JORGE]` from front to back. Copying the old physical slots to the same indexes would fail: after capacity changes from three to six, a traversal from front `2` would visit indexes `2, 3, 4` and encounter empty slots instead of Marco and Pedro. The resize itself serves no request.

**Why this example?** A wrapped, full array tests whether a resize preserves FIFO order. **How to solve a resize:** visit old logical items at `(_front + k) % N` for `k = 0, 1, ...`; copy them to new indices `0, 1, ...`; reset `_front` to `0`; then enqueue the new item.

<span id="part-3-code"></span>

### 5. Build `ArrayQueue`

This implementation follows the book's circular-array design. Its default capacity is ten; `capacity=3` is available for the small trace above.

```python
class Empty(Exception):
    """Raised when a queue has no first item."""


class ArrayQueue:
    def __init__(self, capacity=10):
        if capacity < 1:
            raise ValueError("Capacity must be positive")
        self._data = [None] * capacity
        self._size = 0
        self._front = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def first(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        return self._data[self._front]

    def dequeue(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        answer = self._data[self._front]
        self._data[self._front] = None
        self._front = (self._front + 1) % len(self._data)
        self._size -= 1
        return answer

    def enqueue(self, item):
        if self._size == len(self._data):
            self._resize(2 * len(self._data))
        available = (self._front + self._size) % len(self._data)
        self._data[available] = item
        self._size += 1

    def _resize(self, new_capacity):
        old = self._data
        self._data = [None] * new_capacity
        for k in range(self._size):
            self._data[k] = old[(self._front + k) % len(old)]
        self._front = 0


requests = ArrayQueue(capacity=3)
for code in ("MARC", "FABIO", "RAUL"):
    requests.enqueue(code)
print(requests.first(), len(requests))
print(requests.dequeue(), requests.first())
```

```text
MARC 3
MARC FABIO
```

`first()` leaves Marc waiting, while `dequeue()` removes Marc. The underscore fields are implementation details; ordinary users should call the public methods. The `_resize` loop uses the old `_front` to copy entries in service order before resetting it.

**Why this example?** The code realizes every ADT operation and checks the front without depending on the physical slot layout. **How to build it:** maintain `_size` separately from array capacity, update `_front` only on dequeue or resize, and resize before inserting into a full array.

<span id="part-3-cost"></span>

### 6. Time, space, and optional shrinking

Let `n` be the number of waiting requests:

| Operation | Cost in the basic class | Reason |
| :-------- | :---------------------- | :----- |
| `len(Q)`, `is_empty()`, `first()` | `O(1)` worst case | Read stored state or one slot. |
| `dequeue()` | `O(1)` worst case | Clear one slot and advance one index. |
| `enqueue(e)` | `O(1)` amortized; `O(n)` on a growth step | Most inserts write one slot; a full array copies `n` items. |

The basic class **does not shrink**. Its array can remain large after many dequeues, so its current storage is tied to the largest queue it has held, even when few requests remain. The book gives this optional check to add **after** `self._size -= 1` in `dequeue()`:

```python
if 0 < self._size < len(self._data) // 4:
    self._resize(len(self._data) // 2)
```

It halves the array only when the queue is nonempty and less than one-quarter full; the zero-size guard avoids shrinking an empty queue to zero capacity. With this variant, a shrinking dequeue may cost `O(n)` on that occasion, but dequeue is `O(1)` **amortized** across many operations and storage is `O(n + c)` for current size `n` and a fixed baseline capacity `c`. The gap between one-quarter full and full prevents a resize on every alternating arrival and removal. The runnable class above uses the basic version without this optional check.

**Why this example?** It separates the cheap normal operation from an occasional copy. **How to analyze it:** state worst-case time for a single operation, amortized time across a long sequence, and whether the particular implementation releases unused capacity.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Worked Practice Review

<span id="part-4-steps"></span>

### 1. Solve the task step by step

Our imagined review desk receives Marc, Fabio, and Raúl requests first. After handling Marc and Fabio, it receives Marco and Pedro requests; Jorge arrives when the three-slot queue is full.

1. Store each rider's real name, team, Practice position, and best lap in a lookup table.
2. Enqueue the first three **hypothetical requests** and check that `first()` returns Marc without removal.
3. Dequeue Marc and Fabio. Raúl must now be at the front.
4. Enqueue Marco and Pedro. They occupy freed physical slots, while Raúl remains logically first.
5. Enqueue Jorge. The array grows and copies the waiting requests in FIFO order.
6. Dequeue the remaining requests to verify that growth did not change service order.

**Why this example?** The same six real rider entries support FIFO, wraparound, and growth without inventing Practice results. **How to solve it:** trace the logical queue separately from the physical array and check that the front rider stays the same across wraparound and resizing.

<span id="part-4-program"></span>

### 2. Run and trace the program

Save this self-contained code as `practice_queue.py` and run `python practice_queue.py`:

```python
class Empty(Exception):
    """Raised when a queue has no first item."""


class ArrayQueue:
    def __init__(self, capacity=10):
        if capacity < 1:
            raise ValueError("Capacity must be positive")
        self._data = [None] * capacity
        self._size = 0
        self._front = 0

    def __len__(self):
        return self._size

    def is_empty(self):
        return self._size == 0

    def first(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        return self._data[self._front]

    def dequeue(self):
        if self.is_empty():
            raise Empty("Queue is empty")
        answer = self._data[self._front]
        self._data[self._front] = None
        self._front = (self._front + 1) % len(self._data)
        self._size -= 1
        return answer

    def enqueue(self, item):
        if self._size == len(self._data):
            self._resize(2 * len(self._data))
        available = (self._front + self._size) % len(self._data)
        self._data[available] = item
        self._size += 1

    def _resize(self, new_capacity):
        old = self._data
        self._data = [None] * new_capacity
        for k in range(self._size):
            self._data[k] = old[(self._front + k) % len(old)]
        self._front = 0


# Real Indonesian GP Friday Practice records.
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


waiting = ArrayQueue(capacity=3)  # small capacity makes wraparound visible
for code in ("MARC", "FABIO", "RAUL"):
    waiting.enqueue(code)

print("First request:", practice[waiting.first()][0])
print("Handled:", describe(waiting.dequeue()))
print("Handled:", describe(waiting.dequeue()))

for code in ("MARCO", "PEDRO"):
    waiting.enqueue(code)

# Inspect private fields here only to study the physical layout.
print("After wrap:", waiting._data, "front =", waiting._front)
print("First after wrap:", practice[waiting.first()][0])

waiting.enqueue("JORGE")  # full queue grows from 3 slots to 6
print("After growth:", waiting._data, "front =", waiting._front)
print("First after growth:", practice[waiting.first()][0])

remaining = []
while not waiting.is_empty():
    remaining.append(practice[waiting.dequeue()][0])
print("Remaining FIFO order:", ", ".join(remaining))
```

```text
First request: Marc Márquez
Handled: Marc Márquez — Ducati Lenovo Team: P5, 1:29.426
Handled: Fabio Quartararo — Monster Energy Yamaha MotoGP Team: P7, 1:29.558
After wrap: ['MARCO', 'PEDRO', 'RAUL'] front = 2
First after wrap: Raúl Fernández
After growth: ['RAUL', 'MARCO', 'PEDRO', 'JORGE', None, None] front = 0
First after growth: Raúl Fernández
Remaining FIFO order: Raúl Fernández, Marco Bezzecchi, Pedro Acosta, Jorge Martín
```

The printed physical arrays are **study inspections** of private fields. Application code should use `first()`, `dequeue()`, and the other public methods. Raúl stays first across both changes in physical layout, proving that the queue kept the imagined request arrival order. The positions and laps printed for Marc and Fabio are still their actual **Practice** results.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section idea | Rule to remember | Practice review example |
| :----------- | :--------------- | :---------------------- |
| Queue / FIFO | Serve the oldest waiting item first. | Enqueue Marc, Fabio, Raúl; dequeue Marc. |
| `first()` versus `dequeue()` | Read without removal versus remove and return. | See Marc, then handle Marc. |
| Queue ADT | Behavior comes before storage. | `enqueue`, `dequeue`, `first`, `is_empty`, `len`. |
| Empty queue | There is no front item to return. | Reject a request to serve when none wait. |
| Circular array | Wrap indices to reuse empty slots. | Marco and Pedro occupy freed slots `0` and `1`. |
| Logical versus physical order | Start from `_front` to find the next item. | `[MARCO, PEDRO, RAUL]` still serves Raúl first. |
| Resizing | Copy logical order to the new array. | Raúl stays first when Jorge arrives. |
| Costs | Normal operations are constant time; growth is occasional. | Enqueue is `O(1)` amortized. |

[🔝 Back to Top](#top)
