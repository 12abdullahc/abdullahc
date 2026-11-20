<span id="top"></span>

# Priority Queues — Section 9.1: The Priority Queue Abstract Data Type

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 9, Section 9.1 (printed pages 363–364).  
> **Topic:** 9.1.1 Priorities and 9.1.2 The Priority Queue ADT.  
> **Domain focus:** MotoGP Q2 qualifying at the 2026 French Grand Prix, Le Mans, on 9 May 2026.  
> **Learning goal:** Choose a priority key, explain every ADT operation, and trace a queue from insertion to empty.  
> **User Prompt:** "Reexplain [Section 9.1] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Fastest Waiting Lap](#background-intuition)
   - [1. One verified session and one question](#background-session)
   - [2. Turn a lap time into a priority key](#background-key)
2. [Part 1: Section 9.1 — Why a Priority Queue?](#part-1)
   - [1. Arrival order and priority order](#part-1-order)
   - [2. What the abstract data type promises](#part-1-adt)
3. [Part 2: Section 9.1.1 — Priorities](#part-2)
   - [1. Choose the rule before choosing the next item](#part-2-rule)
   - [2. Compare keys consistently](#part-2-comparison)
4. [Part 3: Section 9.1.2 — The Priority Queue ADT](#part-3)
   - [1. An entry has a key and a value](#part-3-entry)
   - [2. The five operations](#part-3-operations)
   - [3. Follow the book's Example 9.1](#part-3-book-example)
5. [Part 4: Solve a MotoGP Queue Step by Step](#part-4)
   - [1. Trace the operations](#part-4-trace)
   - [2. Run a small Python demonstration](#part-4-program)
6. [Part 5: Ties, Empty Queues, and Fixed Keys](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: Fastest Waiting Lap

<span id="background-session"></span>

### 1. One Verified Session and One Question

The [official MotoGP Q2 classification](https://resources.motogp.com/files/results/2026/FRA/MotoGP/Q2/Classification.pdf) records these best laps at Le Mans on **Saturday, 9 May 2026**. The [official session report](https://www.motogp.com/en/news/2026/05/07/motogp-q2-bagnaia-de-retour-aux-affaires/1064614) also identifies the riders and teams. These are selected rows from that **one session**, not laps from different races.

| Q2 place | Rider | Team | Best lap | Key in milliseconds |
| ---: | :--- | :--- | ---: | ---: |
| 1 | Francesco Bagnaia | Ducati Lenovo Team | `1:29.634` | `89_634` |
| 2 | Marc Márquez | Ducati Lenovo Team | `1:29.646` | `89_646` |
| 3 | Marco Bezzecchi | Aprilia Racing | `1:29.657` | `89_657` |
| 5 | Pedro Acosta | Red Bull KTM Factory Racing | `1:29.817` | `89_817` |
| 6 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | `1:29.831` | `89_831` |

Suppose we have already collected a few of these best-lap records and want to repeatedly take the **fastest remaining record**. A priority queue can answer that question. It is a teaching model built from the published Q2 results; it is not a reconstruction of the official timing system or the order in which laps were set.

**Why this example?** Marc and Fabio provide a clear comparison, and Bagnaia shows that a record inserted later in our simulation can become the new minimum. All the numbers come from the same timed session, so comparing them is meaningful.

**How to solve it:** identify the quantity that decides "fastest" (best-lap time), give each rider's record that time as its key, and request the entry with the smallest key.

<span id="background-key"></span>

### 2. Turn a Lap Time into a Priority Key

`1:29.646` means **1 minute and 29.646 seconds**. Convert it to integer milliseconds:

```text
Marc:    1 × 60,000 + 29 × 1,000 + 646 = 89,646 ms
Fabio:   1 × 60,000 + 29 × 1,000 + 831 = 89,831 ms
Bagnaia: 1 × 60,000 + 29 × 1,000 + 634 = 89,634 ms
```

The smaller number is the faster lap: `89,634 < 89,646 < 89,831`. Marc's Q2 best lap was `89,831 - 89,646 = 185` ms quicker than Fabio's; Bagnaia's was `89,646 - 89,634 = 12` ms quicker than Marc's.

```python
marc_ms = 60_000 + 29_000 + 646
fabio_ms = 60_000 + 29_000 + 831
print(marc_ms < fabio_ms)       # True
print(fabio_ms - marc_ms)       # 185
```

**Why this example?** A lap string is easy for a person to read; integer milliseconds give Python one precise numeric type to compare. **How to solve it:** convert every lap using the same units, then use `<` to choose the minimum. In Python, underscores in integer literals improve readability and do not change the value: `89_646 == 89646`.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 9.1 — Why a Priority Queue?

<span id="part-1-order"></span>

### 1. Arrival Order and Priority Order Answer Different Questions

An ordinary **first-in, first-out (FIFO) queue** serves the earliest arrival. Section 9.1 recalls a call-center line, where that rule is often sensible. Aircraft waiting to land or passengers on a standby list may instead need an order based on urgency or policy. In a **priority queue**, a supplied key decides which entry comes next.

For a small Q2 teaching simulation, imagine adding Fabio's published best-lap record first and Marc's second:

```text
Insertion order: Fabio (89,831 ms) → Marc (89,646 ms)
FIFO next:       Fabio, because his record was added first
Minimum next:    Marc, because 89,646 < 89,831
```

The arrows describe our **chosen simulation order**, not the historical order of laps in Q2.

**Why this example?** Two familiar riders are enough to reveal the difference between "first added" and "fastest." **How to solve it:** write down the rule the task actually asks for. If it asks for the first arrival, use FIFO; if it asks for the smallest lap-time key, take the minimum-key entry.

<span id="part-1-adt"></span>

### 2. What the Abstract Data Type Promises

An **abstract data type (ADT)** specifies what operations mean without specifying how entries are stored. Section 9.1 tells us that adding a `(key, value)` pair makes it available, and that asking for the minimum returns an entry whose key is no larger than any other waiting key.

The ADT does **not** require its entries to sit in sorted order in memory. The book's trace displays entries in key order to help the reader, but a later implementation could organize them differently while giving the same answers.

> **Mental model:** Give the queue a lap-time key and a rider record. Ask it to inspect or remove a record with the smallest key.

**Why this example?** We can predict the result before choosing any particular Python storage structure. **How to solve it:** describe the allowed calls and their results first; treat storage and speed as separate implementation questions in later sections of Chapter 9.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 9.1.1 — Priorities

<span id="part-2-rule"></span>

### 1. Choose the Rule Before Choosing the Next Item

A "priority" is meaningful only after we state a rule. For the Q2 example, our rule is **smaller best-lap time means higher priority**. This is a *minimum-oriented* priority queue: if Fabio and Marc are waiting, Marc's key `89_646` wins over Fabio's `89_831`.

```text
Waiting entries: Fabio (89,831), Marc (89,646)
Smallest key:    89,646
Next rider:      Marc Márquez
```

The rule can differ in another application. For example, an air-traffic system might derive its key from several factors. The priority queue only compares the keys it receives; it does not decide which factors are appropriate.

**Why this example?** "Priority" can sound subjective, whereas a measured lap time makes the comparison visible. **How to solve it:** (1) state what "next" means, (2) convert each candidate to a key under that rule, and (3) choose the smallest key.

<span id="part-2-comparison"></span>

### 2. Compare Keys Consistently

Section 9.1 allows keys other than numbers, provided the keys have a **consistent less-than ordering**. Every key in our queue is an integer number of milliseconds, so `89_646 < 89_831` is well defined. Do not mix milliseconds with seconds in the same queue: `89_646` and `89.831` describe comparable durations only **after** conversion to a common unit.

The rider's name and team do not determine priority in this example. They identify the record we want back after the key wins. In Python 3, comparing incompatible key types such as an integer and a string can raise `TypeError`.

**Why this example?** A priority queue can only make a reliable choice when the keys mean the same thing and can be compared. **How to solve it:** normalize units and types before insertion; keep descriptive rider information in the value.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 9.1.2 — The Priority Queue ADT

<span id="part-3-entry"></span>

### 1. An Entry Has a Key and a Value

Each entry is a `(key, value)` pair. For Marc, a useful entry is:

```python
(89_646, ("Marc Márquez", "Ducati Lenovo Team", "1:29.646"))
```

The **key** `89_646` controls selection. The **value** retains the rider, team, and display lap so the result is useful to a person. Values can be any objects; the ADT compares the keys. Distinct entries may have equal keys.

**Why this example?** Returning only `89_646` would tell us the time but not whose record it was. **How to solve it:** store the comparison number as the key and the information needed after selection as the value.

<span id="part-3-operations"></span>

### 2. The Five Operations

Let `P` name a priority queue. These are the operations in Section 9.1:

| Operation | Meaning | Q2 example |
| :--- | :--- | :--- |
| `P.add(k, v)` | Insert an entry with key `k` and value `v`. | Add Marc's `89_646` ms record. |
| `P.min()` | Return a minimum-key `(key, value)` pair **without removing it**; error if empty. | Inspect the fastest waiting record. |
| `P.remove_min()` | Remove and return a minimum-key `(key, value)` pair; error if empty. | Take that record out of the queue. |
| `P.is_empty()` | Return `True` exactly when no entries remain. | Check whether any records wait. |
| `len(P)` | Return the number of waiting entries. | Count the records. |

For two waiting records, the crucial distinction is:

```text
Before:              Marc (89,646), Fabio (89,831); len(P) = 2
P.min():             returns Marc;                 len(P) = 2
P.remove_min():      returns Marc;                 len(P) = 1
Next P.min():        returns Fabio;                len(P) = 1
```

If several entries share the minimum key, either minimum operation may choose **any one of them**. The ADT does not promise first-in or alphabetical order for ties.

**Why this example?** `min()` and `remove_min()` can return the same rider, but only one changes the queue. **How to solve it:** use `min()` when you only need to look; use `remove_min()` when that entry must stop waiting. Check `is_empty()` or `len(P) > 0` before either call if emptiness is possible.

<span id="part-3-book-example"></span>

### 3. Follow the Book's Example 9.1

The book first inserts four letter values with keys `5`, `9`, `3`, and `7`: `(5, A)`, `(9, C)`, `(3, B)`, and `(7, D)`. The letters are just values; the numbers decide priority. Here is the logic of its operation sequence in compact form:

| Step | Call | Result or count afterward |
| ---: | :--- | :--- |
| 1 | Add the four entries | Four wait; minimum is `(3, B)`. |
| 2 | `P.min()` | Returns `(3, B)`; **four** still wait. |
| 3 | `P.remove_min()` | Returns `(3, B)`; three wait. |
| 4 | `P.remove_min()` | Returns `(5, A)`; two wait. |
| 5 | `len(P)` | Returns `2`. |
| 6 | `P.remove_min()` | Returns `(7, D)`; one waits. |
| 7 | `P.remove_min()` | Returns `(9, C)`; none wait. |
| 8 | `P.is_empty()` | Returns `True`. |
| 9 | `P.remove_min()` | Causes an empty-queue error. |

**Why this example?** The small keys make the ADT contract easy to check without race data. **How to solve it:** keep a set of waiting entries after each call, find the smallest key for each minimum operation, and decrease the count only when `remove_min()` runs. The displayed sorted order is for reasoning, not a required physical layout.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Solve a MotoGP Queue Step by Step

<span id="part-4-trace"></span>

### 1. Trace the Operations

Start with an empty `P`. Add **four selected Q2 records** in the teaching order Fabio, Marc, Bezzecchi, Bagnaia. Each value contains the rider and team from the background table. After an addition, the minimum may change:

| Call | Returned result or new minimum | `len(P)` afterward |
| :--- | :--- | ---: |
| `P.add(89_831, Fabio)` | Minimum: Fabio `89_831` | 1 |
| `P.add(89_646, Marc)` | Minimum: Marc `89_646` | 2 |
| `P.add(89_657, Bezzecchi)` | Minimum: Marc `89_646` | 3 |
| `P.add(89_634, Bagnaia)` | Minimum: Bagnaia `89_634` | 4 |
| `P.min()` | Returns Bagnaia `89_634`; nothing removed | 4 |
| `P.remove_min()` | Returns Bagnaia `89_634`; Marc is now minimum | 3 |
| `P.remove_min()` | Returns Marc `89_646` | 2 |
| `P.remove_min()` | Returns Bezzecchi `89_657` | 1 |
| `P.remove_min()` | Returns Fabio `89_831` | 0 |
| `P.is_empty()` | Returns `True` | 0 |

`Fabio`, `Marc`, `Bezzecchi`, and `Bagnaia` in this table abbreviate the full rider-and-team values. The table shows **logical answers**, not the queue's internal storage or the historical sequence of laps.

**Why this example?** Fabio starts as the minimum, Marc takes that place when inserted, and Bagnaia takes it later. This makes changing priorities visible even though no stored key changes. **How to solve it:** after each `add`, compare the new key with the current minimum; after each `remove_min`, scan the remaining keys to identify the next smallest. Notice that `P.min()` leaves the count at four.

<span id="part-4-program"></span>

### 2. Run a Small Python Demonstration

Section 9.1 defines behavior, not a Python implementation. The following short wrapper uses Python's `heapq` only to make the **same ADT calls runnable**. Its internal counter prevents equal keys from forcing a comparison between rider records. We do not need to study heaps yet to follow the output.

Save as `q2_priority_queue.py`, then run `python q2_priority_queue.py`:

```python
import heapq
from itertools import count


def lap_to_ms(lap):
    minutes, rest = lap.split(":")
    seconds, milliseconds = rest.split(".")
    return int(minutes) * 60_000 + int(seconds) * 1_000 + int(milliseconds)


class PriorityQueue:
    def __init__(self):
        self._entries = []
        self._insertion_number = count()

    def add(self, key, value):
        heapq.heappush(self._entries, (key, next(self._insertion_number), value))

    def min(self):
        if self.is_empty():
            raise IndexError("priority queue is empty")
        key, _, value = self._entries[0]
        return key, value

    def remove_min(self):
        if self.is_empty():
            raise IndexError("priority queue is empty")
        key, _, value = heapq.heappop(self._entries)
        return key, value

    def is_empty(self):
        return len(self._entries) == 0

    def __len__(self):
        return len(self._entries)


# Selected best laps from the 2026 French GP MotoGP Q2 classification.
# This list order is chosen for teaching; it is not lap-arrival history.
riders = [
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", "1:29.831"),
    ("Marc Márquez", "Ducati Lenovo Team", "1:29.646"),
    ("Marco Bezzecchi", "Aprilia Racing", "1:29.657"),
    ("Francesco Bagnaia", "Ducati Lenovo Team", "1:29.634"),
]

P = PriorityQueue()
for name, team, lap in riders:
    P.add(lap_to_ms(lap), (name, team, lap))
    _, (minimum_name, _, minimum_lap) = P.min()
    print("After adding {}: minimum is {} ({})".format(
        name, minimum_name, minimum_lap
    ))

key, (name, _, lap) = P.min()
print("Peek: {} ({}, {} ms); count = {}".format(name, lap, key, len(P)))

while not P.is_empty():
    key, (name, team, lap) = P.remove_min()
    print("Remove: {} | {} | {} | {} ms".format(name, team, lap, key))

print("Empty:", P.is_empty())
try:
    P.min()
except IndexError as error:
    print("min() on empty:", error)
```

Expected output:

```text
After adding Fabio Quartararo: minimum is Fabio Quartararo (1:29.831)
After adding Marc Márquez: minimum is Marc Márquez (1:29.646)
After adding Marco Bezzecchi: minimum is Marc Márquez (1:29.646)
After adding Francesco Bagnaia: minimum is Francesco Bagnaia (1:29.634)
Peek: Francesco Bagnaia (1:29.634, 89634 ms); count = 4
Remove: Francesco Bagnaia | Ducati Lenovo Team | 1:29.634 | 89634 ms
Remove: Marc Márquez | Ducati Lenovo Team | 1:29.646 | 89646 ms
Remove: Marco Bezzecchi | Aprilia Racing | 1:29.657 | 89657 ms
Remove: Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:29.831 | 89831 ms
Empty: True
min() on empty: priority queue is empty
```

**Why this example?** It turns the abstract trace into a program whose output can be checked against the official times. **How to solve it:** convert each time to milliseconds, add each `(key, value)` pair, use `min()` to inspect without changing the count, then keep calling `remove_min()` until `is_empty()` becomes `True`. The counter gives this particular wrapper a deterministic tie behavior; Section 9.1 itself does not require that behavior.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Ties, Empty Queues, and Fixed Keys

### 1. What if two keys tie?

Pedro Acosta's actual Q2 best lap was `1:29.817`; Fabio Quartararo's was `1:29.831`. At full millisecond precision, Pedro is faster by `14` ms. If a **different teaching exercise** rounds both keys to the nearest tenth of a second, both become `89.8` seconds:

```text
Pedro: 89.817 s → 89.8 s
Fabio: 89.831 s → 89.8 s
```

Now either record is a valid result of `min()` or `remove_min()` because the *stored keys* tie. That rounded queue can no longer reproduce their exact Q2 order.

**Why this example?** It shows both the ADT's tie rule and the cost of throwing away timing precision. **How to solve it:** decide the precision your task needs before creating keys. Keep the official millisecond keys when the exact faster lap matters.

### 2. What if no entries remain?

Calling `P.min()` or `P.remove_min()` on an empty queue is an error under the Section 9.1 contract. The final `P.min()` in the program demonstrates this. For ordinary processing, guard the call:

```python
if not P.is_empty():
    key, rider_record = P.remove_min()
```

**Why this example?** The final removal changes the queue from one entry to zero; a later minimum request cannot return a rider. **How to solve it:** check `P.is_empty()` or `len(P) > 0` before requesting a minimum when the queue may be empty.

### 3. Can a stored priority change by itself?

In Section 9.1's initial ADT, an entry's key stays as supplied when it was added. If a separate rider record later changes, the stored `89_831` key does **not** update automatically. The basic five operations do not include "change this entry's key"; Section 9.5 introduces an adaptable priority queue for that need.

**Why this example?** A qualifying best lap can improve over a session, so it is tempting to assume an old queued key will follow an edited record. **How to solve it:** for this Section 9.1 model, treat inserted keys as fixed. If your problem requires updates, choose a data structure with an explicit update operation.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 9.1 idea | Plain-language meaning | French GP Q2 example |
| :--- | :--- | :--- |
| Priority queue | Choose by a priority key instead of arrival order. | Marc can be selected before Fabio in our insertion simulation. |
| Minimum-oriented rule | Smaller key comes first. | `89_646 < 89_831`, so Marc's lap precedes Fabio's. |
| Key and value | Key decides priority; value identifies the result. | `89_646` ms and Marc's rider/team record. |
| `add(k, v)` | Make one entry wait. | Add Bagnaia with key `89_634`. |
| `min()` | Look at a minimum entry without removing it. | Bagnaia remains waiting; count stays four. |
| `remove_min()` | Return and remove a minimum entry. | Bagnaia leaves; Marc becomes minimum. |
| `is_empty()` and `len(P)` | Test whether entries remain and count them. | Stop after the fourth removal. |
| Tied keys | Either minimum-key entry may be chosen. | Rounding Pedro and Fabio to tenths creates a tie. |
| Fixed key | An inserted key does not update by itself. | Editing a separate lap record does not change a stored key. |

[🔝 Back to Top](#top)
