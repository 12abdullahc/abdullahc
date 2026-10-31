<span id="top"></span>

# 7.8 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 7, Section 7.8, printed pages 294–298 (the supplied PDF).<br>
> **Topic:** Reinforcement R-7.1–R-7.23; Creativity C-7.24–C-7.43; Projects P-7.44–P-7.47.<br>
> **Domain Focus:** One set of rectangular cards used to trace linked nodes, positions, queues, sorting, favorites, and representation choices.<br>
> **User Prompt:** Reexplain [`Section 7.8`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: What the Exercises Practice](#background)
   - [1. Keep the rectangle cards connected](#background-cards)
   - [2. Read the request before choosing an algorithm](#background-method)
2. [Part 1: Reinforcement, R-7.1–R-7.10](#part-1)
   - [1. Singly and circular links: R-7.1–R-7.7](#part-1-single)
   - [2. Sentinels and empty positions: R-7.8–R-7.10](#part-1-double)
3. [Part 2: Reinforcement, R-7.11–R-7.23](#part-2)
   - [1. Positional-list operations: R-7.11–R-7.17](#part-2-positions)
   - [2. Move-to-front and counts: R-7.18–R-7.23](#part-2-favorites)
4. [Part 3: Creativity, C-7.24–C-7.36](#part-3)
   - [1. Build and reverse singly linked structures: C-7.24–C-7.30](#part-3-singly)
   - [2. Design position-aware structures: C-7.31–C-7.36](#part-3-positions)
5. [Part 4: Creativity, C-7.37–C-7.43](#part-4)
   - [1. Search and sort positional lists: C-7.37–C-7.38](#part-4-algorithms)
   - [2. Queues, favorites, joins, and shuffles: C-7.39–C-7.43](#part-4-applications)
6. [Part 5: Projects, P-7.44–P-7.47](#part-5)
   - [1. Map the four project requirements](#part-5-projects)
   - [2. Check edges and operation costs](#part-5-check)
7. [Part 6: One Connected Geometry Practice Program](#part-6)
   - [1. The complete program](#part-6-program)
   - [2. Trace its result](#part-6-trace)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: What the Exercises Practice

<span id="background-cards"></span>

### 1. Keep the rectangle cards connected

The earlier Chapter 7 guides used these four physical cards. Their **individual areas** stay the same as we change list order or representation:

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |

For one of each card, **6 + 8 + 16 + 4 = 34 cm²**. When an exercise needs an extra card, `E` is a separate 3 cm × 3 cm card with area **9 cm²**. Moving, reversing, or shuffling the four original nodes changes their order but preserves the 34 cm² sum; adding or removing a physical card changes it.

```text
Singly linked:      A → B → C → D → None
Circular:           A → B → C → D → A → ...
Doubly linked:   header ↔ A ↔ B ↔ C ↔ D ↔ trailer
```

The [Section 7.1](07-01-singly-linked-lists.md), [Section 7.2](07-02-circularly-linked-lists.md), and [Section 7.3](07-03-doubly-linked-lists.md) guides introduce these links; [Section 7.4](07-04-the-positional-list-adt.md) wraps a doubly linked node in a `Position`.

<span id="background-method"></span>

### 2. Read the request before choosing an algorithm

Section 7.8 contains **47 prompts**: 23 Reinforcement, 20 Creativity, and 4 Projects. `Chapter Notes` begins after P-7.47 on printed page 298. The prompts ask for different kinds of work:

| Wording in a prompt | Evidence to prepare |
| :------------------ | :------------------ |
| **Trace or describe** | Draw the order before and after each link change; name the head, tail, cursor, or saved positions. |
| **Implement** | State an interface, handle empty and one-node cases, and run a small example. |
| **Analyze or prove** | Count traversals, link changes, temporary nodes, or output records before stating a bound. |
| **Meet a restriction** | Keep exact conditions such as “no new nodes,” “no recursion,” or “O(1)” visible in the design. |

Here `n` usually means the number of nodes; in a particular prompt, it may also mean the size of a recent-access window or half of a `2n`-card shuffle. The table rows below restate each exercise's task and give a card-based starting point.

> **Mental model:** Keep three questions separate: which nodes exist, what order their links describe, and which numeric area or access count belongs to each card.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-7.1–R-7.10

<span id="part-1-single"></span>

### 1. Singly and circular links: R-7.1–R-7.7

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **R-7.1** | Find the **second-to-last node** of a singly linked chain ending in `None`. In `A → B → C → D → None`, stop when the next node is `D` and return node `C`, not merely its 16 cm² value. Decide what to return for zero or one node. |
| **R-7.2** | Concatenate singly linked `L` and `M` when given **only their first-node references**. For `L = [A, B]` and `M = [C, D]`, follow `L` to `B` and connect it to `C`; handle empty `L` or `M`. Without a saved tail, finding `B` takes O(length of `L`). |
| **R-7.3** | Count singly linked nodes recursively: `count(None) = 0` and `count(node) = 1 + count(node.next)`. The four-card chain returns 4; the calls add O(n) stack space. |
| **R-7.4** | Swap the **actual nodes** holding `B` and `D`, not their elements. In a singly linked list, first find each predecessor; in a doubly linked list, previous links are already available. Treat adjacent nodes, the first node, and equal node references separately. |
| **R-7.5** | Count a circular list by starting at `A`, following links until `A` is reached again, and counting each node once. `A → B → C → D → A` has four nodes; an empty ring needs its own result. |
| **R-7.6** | Given circular-node references `x` and `y`, traverse one full cycle from `x`. If `y` appears before returning to `x`, they share a ring; otherwise they do not. This terminates even if `y` belongs to another ring. |
| **R-7.7** | Give `LinkedQueue` a `rotate()` with the effect of dequeueing the front card and enqueueing it at the rear, **without allocating a new node**. `[A, B, C, D]` becomes `[B, C, D, A]`, still totaling 34 cm²; relink the original front node. |

R-7.4 and R-7.7 test **node identity**. A diagram that only swaps printed card labels can show the desired visible order while violating the prompt's requirement to move the existing nodes.

<span id="part-1-double"></span>

### 2. Sentinels and empty positions: R-7.8–R-7.10

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **R-7.8** | Find the middle node of a doubly linked list with header/trailer sentinels by **link hopping only**: no counter and no recursion. For four cards `[A, B, C, D]`, return the left-of-center node `B`; for three cards `[A, B, C]`, return `B`. A slow/fast or two-ended walk takes O(n) time. |
| **R-7.9** | Concatenate sentinel-based doubly linked `L = [A, B]` and `M = [C, D]` by reconnecting the boundary nodes, then update stored sizes. With both ends available, this takes O(1) link work and yields `[A, B, C, D]`, area **14 + 20 = 34 cm²**. Test either list empty. |
| **R-7.10** | Explain why `add_first` and `add_last` remain useful even though `add_before(first(), e)` and `add_after(last(), e)` seem similar. On an **empty** positional list, `first()` and `last()` are `None`, so those alternatives have no valid position; adding `A` still must work. |

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement, R-7.11–R-7.23

<span id="part-2-positions"></span>

### 1. Positional-list operations: R-7.11–R-7.17

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **R-7.11** | Write a standalone `max(L)` for a `PositionalList` of comparable elements. Store the **areas** `[6, 8, 16, 4]`, not card labels, and scan to return 16; state how an empty list is handled. |
| **R-7.12** | Put the previous maximum scan inside `PositionalList` as `L.max()`. The result and O(n) scan stay the same; only the calling interface changes. |
| **R-7.13** | Add `find(e)` that returns the **first matching Position** or `None`. In `[A, B, A]`, `find("A")` returns the first `A` position, not its label and not the later `A`. |
| **R-7.14** | Redo `find(e)` recursively, with **no loops**. Passing the current position to the next call gives O(n) time and O(n) additional call-stack space in the worst case. |
| **R-7.15** | Support the positional list's `__reversed__` method. Reading `[A, B, C, D]` backward yields `D, C, B, A`; follow predecessor positions and stop before the header sentinel. |
| **R-7.16** | Express `add_last` and `add_before` using **only** the helpers listed in the prompt: `is_empty`, `first`, `last`, `prev`, `next`, `add_after`, and `add_first`. For example, add last after the current last position, but use `add_first` when empty; add before the first via `add_first`. |
| **R-7.17** | Add `move_to_front(p)` by **relinking the existing node** at `p`, leaving all other nodes in relative order. Moving `B` in `[A, B, C, D]` gives `[B, A, C, D]`; unlike delete-and-reinsert, the saved position can still identify that same node. |

The source's R-7.16 helper set prints `prev` and `next`; the [Section 7.4 positional-list API](07-04-the-positional-list-adt.md) uses `before` and `after` for the corresponding neighbor operations. When coding, state which names your class provides. The empty-list and first-position cases are the reason the two requested methods need special treatment.

<span id="part-2-favorites"></span>

### 2. Move-to-front and counts: R-7.18–R-7.23

The [Section 7.6 guide](07-06-case-study-maintaining-access-frequencies.md) separates **access frequency** from card area. A request may move a record without changing any physical rectangle.

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **R-7.18** | Trace the source's six labels `a`–`f` through its twelve move-to-front accesses. The final front-to-back order is `[e, d, b, f, c, a]`, ordered by each label's most recent access. Treat the labels as six marked card slips; their dimensions do not control this order. |
| **R-7.19** | After `kn` accesses to an existing list of `n` elements, find the minimum and maximum number accessed **fewer than `k` times**. For `n = 4, k = 2`, eight accesses can give counts `[2, 2, 2, 2]` (minimum **0** below 2) or `[8, 0, 0, 0]` (maximum **3** below 2). In general the bounds are **0** and **n − 1**. |
| **R-7.20** | Reverse a move-to-front list with **O(n) accesses**. Starting `[A, B, C, D]`, access the original labels front to back—`A, B, C, D`—and the final order is `[D, C, B, A]`. |
| **R-7.21** | Construct `n²` move-to-front accesses costing `Ω(n³)` total. Repeatedly access the **current tail**; each search crosses `n` nodes. For an initial `[A, B, C, D]`, the cycle `D, C, B, A` restores the original order, so repeat it four times for 16 tail accesses. |
| **R-7.22** | Add `FavoritesList.clear()`. After the seven requests in Section 7.6, clearing should leave zero stored labels and `is_empty() == True`; it removes records rather than merely zeroing their counts. |
| **R-7.23** | Add `reset_counts()` that sets every count to zero **without changing list order**. For `[A(3), B(2), C(1), D(1)]`, the result is `[A(0), B(0), C(0), D(0)]`. This differs from `clear()`. |

For R-7.19, the `n` elements are already in `L`, so some may have zero accesses. This differs from the Section 7.6 `FavoritesList` implementation, which normally adds a label on its first access. All `n` counts cannot be below `k`: then their sum would be at most `n(k − 1) < nk`. Concentrating all `nk` accesses in one element makes the other `n − 1` counts zero. For R-7.21, choosing the tail each time gives `n²` searches of length `n`, hence a lower bound proportional to `n³`. A series of only O(n) accesses can reverse the list in R-7.20, but that does not say those accesses take O(n) *time*.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Creativity, C-7.24–C-7.36

<span id="part-3-singly"></span>

### 1. Build and reverse singly linked structures: C-7.24–C-7.30

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **C-7.24** | Implement the **complete stack ADT** with a singly linked list that has a **header sentinel**. Push and pop at the front; pushing `A` then `B` makes `B` the next card popped. |
| **C-7.25** | Implement the **complete queue ADT** with a singly linked list and **header sentinel**. Keep a rear reference so enqueueing `A, B, C` and dequeueing returns `A` first; maintain rear correctly when the queue becomes empty. |
| **C-7.26** | Implement `LinkedQueue.concatenate(Q2)` by splicing `Q2`'s node chain onto the receiver in **O(1)**, leaving `Q2` empty. `[A, B]` plus `[C, D]` becomes `[A, B, C, D]`; handle either queue empty and update sizes. |
| **C-7.27** | Model a singly linked list recursively: a nonempty list object holds its first card and a reference to another list representing the rest. `[A, B, C]` becomes “`A` plus the list `[B, C]`,” with an empty-list base case. |
| **C-7.28** | Reverse a singly linked chain **recursively and efficiently**. On unwinding, turn each forward link around; `[A, B, C, D]` becomes `[D, C, B, A]` in O(n) time, with O(n) call-stack space. Avoid a fresh scan for the tail on each return. |
| **C-7.29** | Reverse the same chain with **no recursion and O(1) additional space**. Hold `previous`, `current`, and `next` references while reversing each link; the four original nodes and 34 cm² sum remain. |
| **C-7.30** | Implement the [LeakyStack from P-6.35](../06-stacks-queues-and-deques/06-04-exercises.md) using a **singly linked list**. At capacity 3, pushing `A, B, C, D` accepts `D` and drops the oldest bottom `A`; retained cards `B, C, D` total **8 + 16 + 4 = 28 cm²**. |

A header sentinel makes front insertion/removal uniform, but the last real node still needs careful treatment. For C-7.26, an O(1) splice assumes the queues already store front, rear, and size; walking to find a rear would break the target bound.

<span id="part-3-positions"></span>

### 2. Design position-aware structures: C-7.31–C-7.36

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **C-7.31** | Design and implement a `ForwardList` ADT around a singly linked list. Specify how callers identify a location and which operations need a **predecessor**; deleting `B` from `A → B → C` cannot generally use a backward link that does not exist. |
| **C-7.32** | Design a **circular positional list** with a designated cursor. Define how `cursor` advances around `[A, B, C, D]`, what an empty list means, and how insert/delete affects the cursor. |
| **C-7.33** | Add `_DoublyLinkedBase.reverse()` by changing links of the existing nodes, **creating or destroying none**. `[A, B, C, D]` becomes `[D, C, B, A]`; include sentinel boundaries in the rewiring. |
| **C-7.34** | Add `PositionalList.swap(p, q)` that exchanges the **underlying nodes** at two positions, without new nodes. Swapping positions of `B` and `D` makes `[A, D, C, B]`; handle adjacent positions and identical positions. |
| **C-7.35** | Replace the `yield`-based `__iter__` with a **nested iterator class** that remembers its next position and implements `__iter__`/`__next__`. Iteration over `[A, B, C, D]` must still yield each label once. |
| **C-7.36** | Implement the **complete positional-list ADT** on a doubly linked list **without sentinels**. Head/tail become `None` when empty; test inserting the first card, deleting the only card, and updating both ends. |

Moving nodes differs from replacing labels. If `p_B` is a saved position for the actual `B` node, a node swap should leave `p_B` attached to that node even though its place in the order changes. A delete-and-reinsert strategy may invalidate the old position and violate the exercise's node-identity constraint.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Creativity, C-7.37–C-7.43

<span id="part-4-algorithms"></span>

### 1. Search and sort positional lists: C-7.37–C-7.38

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **C-7.37** | In a nondecreasing **integer** positional list, find two positions whose elements sum to `V` in **O(n)**, or return `None`. Store areas `[4, 6, 8, 16]` and set `V = 12`: the positions holding **4** and **8** (cards `D` and `B`) work. Start one position at each end and move inward according to the sum. |
| **C-7.38** | Implement positional-list `bubble_sort(L)` with `n − 1` scans, comparing adjacent elements and swapping an inverted pair. Sorting area values `[16, 6, 4, 8]` yields `[4, 6, 8, 16]`; with O(1) adjacent access/swap, the repeated scans take **O(n²)** time. |

In C-7.37, return two **distinct positions**, not just the values 4 and 8; a single node cannot pair with itself. In C-7.38, the book requires comparable elements; our area numbers are the comparable values. Sorting card-label strings directly would alphabetize labels instead of ordering their areas.

<span id="part-4-applications"></span>

### 2. Queues, favorites, joins, and shuffles: C-7.39–C-7.43

| Exercise | Reexplanation and connected card starting point |
| :------- | :--------------------------------------------- |
| **C-7.39** | Design a `PositionalQueue` with the **complete queue ADT**, `enqueue` returning a `Position`, and `delete(p)` removing a queued item early. If `[A, B, C]` is waiting, deleting saved `p_B` leaves `[A, C]`, area **6 + 16 = 22 cm²**. A `PositionalList` adapter is allowed. |
| **C-7.40** | Keep a move-to-front favorites list but purge labels not requested in the **most recent `n` accesses**. For window `n = 3` and requests `A, B, A, C, D`, the last three are `A, C, D`, so `B` should be absent. A last-access number and the recency-ordered tail help identify stale records. |
| **C-7.41** | Compute a natural join of linked lists of `n` and `m` pairs, then analyze it. Join `(A, 6)` from one list with `(6, "small")` from the other to emit `(A, 6, "small")`. With hashable join keys, a hash index on the second list gives expected **O(n + m + z)** time for `z` emitted triples and O(m) index space, plus any stored output. |
| **C-7.42** | Build a singly linked top-10 `Scoreboard` instead of the array version. Use areas as sample scores: `C:16, B:8, A:6, D:4`. Insert in score order, trim beyond ten, and handle equal scores according to a stated policy. |
| **C-7.43** | Shuffle a list of `2n` cards by splitting into equal halves and interleaving: `[A, B]` and `[C, D]` become `[A, C, B, D]`. The four-card area sum stays **34 cm²**; this is a specific alternating permutation, not a random shuffle. |

For C-7.41, if every left pair matches every right pair, `z = nm`, so a method that emits all results cannot take less than `Ω(z)` time. For C-7.40, purging is about **recent requests**, not whether a card's area is small or its all-time access count is low.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Projects, P-7.44–P-7.47

<span id="part-5-projects"></span>

### 1. Map the four project requirements

| Project | Reexplanation and connected card starting point |
| :------ | :--------------------------------------------- |
| **P-7.44** | Build a text editor storing characters in a `PositionalList` with a cursor. One simple display prints the text and uses a second line to **underline** the cursor position. A geometry note such as `A6` can be edited: with cursor on `A`, `insert ':'` places `:` **just after** it. `left`/`right` move one character with boundary no-ops; `delete` removes the character **just after** the cursor, doing nothing at the end. Document how the cursor behaves after insertion/deletion. |
| **P-7.45** | Implement a `SparseArray` backed by a list of only nonempty `(index, element)` entries, with `__getitem__(j)` and `__setitem__(j, e)`. A 101-cell display with `A` only at 0 and `C` only at 100 stores **2** entries, not 101. Define how `None` removes an entry and analyze search/update time. |
| **P-7.46** | Build the positional-list ADT on an **array** of position items, each storing its element and current array index. Inserting `E` before `C` shifts array entries; update every shifted item's recorded index so a saved `C` position still locates `C`. Analyze each operation; an array implementation does not inherit linked O(1) middle edits. |
| **P-7.47** | Implement `CardHand` using **one** positional list with cards grouped by hearts, clubs, spades, and diamonds. Keep four suit “fingers” so `add_card(r, s)` and `play(s)` take O(1); `play(s)` uses an arbitrary card if suit `s` is absent. Provide `__iter__()` for all cards and `all_of_suit(s)` for one suit. Our `A`–`D` rectangles can be marked as four physical playing-card slips, but the suit/rank rules remain those of the prompt. |

P-7.44's cursor is a **position in the character sequence**, so the exact meaning of “after the cursor” matters. P-7.45's `m`-entry storage is O(m) even if the largest valid index is much larger. P-7.46 tests whether saved position objects remain meaningful after array shifts. P-7.47 requires four suit groups in a single list, not four separate lists.

<span id="part-5-check"></span>

### 2. Check edges and operation costs

| Check | Why it matters |
| :---- | :------------- |
| Empty and one-element state | Sentinels, cursor movement, queue rear, sparse lookup, and hand fallback need defined behavior. |
| Node or position identity | A prompt that requires relinking cannot be satisfied by swapping card labels or replacing a node. |
| Claimed bound | O(1) splicing assumes stored ends; O(n) two-sum assumes a sorted list; join time includes emitted triples. |
| Preserved data | Reversing or shuffling `A`–`D` keeps four physical cards and their 34 cm² area sum. |
| Removed data | Deleting `B` subtracts its 8 cm² from a physical display; clearing a favorites list removes records, not rectangles. |

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: One Connected Geometry Practice Program

<span id="part-6-program"></span>

### 1. The complete program

This standalone program practices the second-to-last node (R-7.1), recursive counting (R-7.3), iterative link reversal (C-7.29), and a move-to-front reversal using O(n) **accesses** (R-7.20). It uses a simple singly linked chain; the tables above describe the additional ADTs requested by other exercises.

```python
CARD_SIZES = {
    "A": (2, 3), "B": (4, 2),
    "C": (4, 4), "D": (2, 2),
}


def area_of(label):
    width, height = CARD_SIZES[label]
    return width * height


class Node:
    __slots__ = ("label", "next")

    def __init__(self, label, next_node=None):
        self.label = label
        self.next = next_node


def make_chain(labels):
    head = None
    tail = None
    for label in labels:
        new_node = Node(label)
        if head is None:
            head = new_node
        else:
            tail.next = new_node
        tail = new_node
    return head


def nodes(head):
    walk = head
    while walk is not None:
        yield walk
        walk = walk.next


def labels(head):
    return [node.label for node in nodes(head)]


def total_area(head):
    return sum(area_of(node.label) for node in nodes(head))


def second_to_last(head):
    if head is None or head.next is None:
        return None
    walk = head
    while walk.next.next is not None:
        walk = walk.next
    return walk


def count_recursive(node):
    if node is None:
        return 0
    return 1 + count_recursive(node.next)


def reverse_links(head):
    previous = None
    current = head
    while current is not None:
        next_node = current.next
        current.next = previous
        previous = current
        current = next_node
    return previous


def move_to_front_by_label(head, wanted):
    if head is None or head.label == wanted:
        return head
    previous = head
    current = head.next
    while current is not None and current.label != wanted:
        previous = current
        current = current.next
    if current is None:
        return head
    previous.next = current.next
    current.next = head
    return current


head = make_chain(["A", "B", "C", "D"])
print("Start: {}, areas {}, total {} cm^2".format(
    labels(head), [area_of(label) for label in labels(head)],
    total_area(head)
))
found = second_to_last(head)
print("Second-to-last node: {} ({} cm^2)".format(
    found.label, area_of(found.label)
))
print("Recursive node count: {}".format(count_recursive(head)))

original_node_ids = {id(node) for node in nodes(head)}
head = reverse_links(head)
print("Link reversal: {}, total {} cm^2, same nodes {}".format(
    labels(head), total_area(head),
    {id(node) for node in nodes(head)} == original_node_ids
))

head = make_chain(["A", "B", "C", "D"])
for label in ["A", "B", "C", "D"]:
    head = move_to_front_by_label(head, label)
print("Move-to-front A,B,C,D: {}, total {} cm^2".format(
    labels(head), total_area(head)
))
```

The move-to-front helper searches by label, so finding a distant label can still take O(n). Once its node and predecessor are known, the relinking is local. R-7.17 specifically asks for a positional-list method that already receives `p` and keeps the existing node.

<span id="part-6-trace"></span>

### 2. Trace its result

```text
Start: ['A', 'B', 'C', 'D'], areas [6, 8, 16, 4], total 34 cm^2
Second-to-last node: C (16 cm^2)
Recursive node count: 4
Link reversal: ['D', 'C', 'B', 'A'], total 34 cm^2, same nodes True
Move-to-front A,B,C,D: ['D', 'C', 'B', 'A'], total 34 cm^2
```

Both reversals keep the same four dimensions and total area. The link reversal also keeps the **same four node objects**; it only changes their `next` references. The recursive count uses O(n) call-stack space, while the iterative reversal holds a fixed number of references.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which nodes are second-to-last and left-of-center?</strong></summary>

**Scenario:** The chain and the doubly linked display both hold `[A, B, C, D]`, with areas `[6, 8, 16, 4]` cm².

**Trace:** R-7.1 follows singly linked `next` references until `C.next` is `D`, returning node `C`. R-7.8 walks toward the middle of the doubly linked display without a counter; with four nodes it chooses the **left** of the two central nodes, `B`.

**Result:** The answers are `C` and `B` for two different questions. Neither traversal changes the **34 cm²** sum.

</details>

<details>
<summary><strong>Case Study 2: Can a queue splice preserve every card?</strong></summary>

**Scenario:** `Q1 = [A, B]` has area **14 cm²** and `Q2 = [C, D]` has area **20 cm²**.

**Trace:** C-7.26 connects `Q1`'s rear node to `Q2`'s front node and sets `Q1`'s rear to `Q2`'s former rear. Then it clears `Q2`'s front/rear references and size.

**Result:** `Q1 = [A, B, C, D]` totals **34 cm²** and `Q2` is empty. With stored ends, the splice changes a constant number of references; it does not copy or recreate card nodes.

</details>

<details>
<summary><strong>Case Study 3: Why do the linked reversals have different space costs?</strong></summary>

**Scenario:** Reverse `A → B → C → D → None`.

**Trace:** C-7.28 can reverse links while recursive calls unwind; C-7.29 instead keeps `previous`, `current`, and `next` and reverses each link in a loop. C-7.33 performs a related relinking task on a **doubly** linked list and must include both directions and sentinels.

**Result:** All three aim for `[D, C, B, A]` and preserve **34 cm²**. The recursive singly method uses O(n) call-stack space; the iterative singly method uses O(1) additional space. C-7.33 forbids creating or destroying nodes.

</details>

<details>
<summary><strong>Case Study 4: What do a pair sum, a sort, and a shuffle preserve?</strong></summary>

**Scenario:** The four areas are `[4, 6, 8, 16]` in sorted order, or the labels are `[A, B, C, D]` in display order.

**Trace:** C-7.37 moves from both ends of the sorted area list to find **4 + 8 = 12**, returning positions for `D` and `B`. C-7.38 sorts a scrambled area list into `[4, 6, 8, 16]`. C-7.43 splits labels `[A, B]` and `[C, D]`, then interleaves them into `[A, C, B, D]`.

**Result:** The two-sum result depends on the **target 12 cm²**; sorting and shuffling only reorder the four cards, so their individual-area sum remains **34 cm²**.

</details>

<details>
<summary><strong>Case Study 5: Can popularity change without changing geometry?</strong></summary>

**Scenario:** Request `A, A, A, B, C, B, D` as in Section 7.6. Counts become `A:3, B:2, C:1, D:1`.

**Trace:** R-7.23 resets all four counts to zero without changing the current list order. R-7.22 instead clears the favorites records. For C-7.40, a three-access window applied to `A, B, A, C, D` retains only labels requested in the last three accesses: `A, C, D`.

**Result:** The reference cards still have areas **6, 8, 16, 4 cm²** and unique-card sum **34 cm²**. The seven lookups reference **3 × 6 + 2 × 8 + 16 + 4 = 54 cm²** cumulatively; that is not physical area occupied by the cards.

</details>

<details>
<summary><strong>Case Study 6: How can a sparse board and editor use positions?</strong></summary>

**Scenario:** A 101-slot display uses only slot 0 for `A` and slot 100 for `C`. A text editor shows the measurement note `A6`.

**Trace:** P-7.45 stores only `(0, A)` and `(100, C)`: **two stored entries** instead of allocating 101 array cells; an absent slot reads as `None`. For P-7.44, a cursor on `A` inserts `:` **after** it, displaying `A:6`. P-7.46 reminds us that an array-backed position item must update its stored index if an insertion shifts it.

**Result:** The stored cards have individual-area sum **6 + 16 = 22 cm²**. The editor's character order and the sparse array's index mapping are separate representations of geometry information.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Exercise family | Core question | Geometry check |
| :-------------- | :------------ | :------------- |
| **R-7.1–R-7.10** | Where do links and sentinels lead, including empty cases? | `A → B → C → D` has four nodes and 34 cm². |
| **R-7.11–R-7.23** | What do positions, access order, and counts mean? | `max` of areas is 16; favorites counts are separate from area. |
| **C-7.24–C-7.36** | Can the same ADT work with new links or stricter space rules? | Reversal changes order while preserving four nodes and 34 cm². |
| **C-7.37–C-7.43** | Can a linked algorithm meet a specific time or output rule? | Pair sum 4 + 8 = 12; interleave yields `[A, C, B, D]`. |
| **P-7.44–P-7.47** | Can a complete design keep its cursor, indices, or suit groups correct? | Sparse slots hold `A` and `C` with 22 cm² of card area. |

The recurring proof is concrete: draw the nodes, check which references change, count how far a search walks, and verify that the same physical cards keep their areas unless an operation adds or removes a card.

[🔝 Back to Top](#top)
