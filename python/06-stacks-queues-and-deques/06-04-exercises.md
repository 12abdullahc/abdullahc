<span id="top"></span>

# 6.4 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.4, printed pages 250–254 (the supplied PDF).<br>
> **Topic:** Reinforcement R-6.1–R-6.14; Creativity C-6.15–C-6.31; Projects P-6.32–P-6.37.<br>
> **Domain Focus:** Rectangle-card areas used to practice stack, queue, and deque traces, invariants, circular storage, and expression evaluation.<br>
> **User Prompt:** Reexplain [`Section 6.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: What the Exercises Practice](#background)
   - [1. Keep the rectangle cards connected](#background-cards)
   - [2. Track state, order, and area separately](#background-method)
2. [Part 1: 6.4 Exercises at a Glance](#part-1)
   - [1. Read the three exercise groups](#part-1-groups)
   - [2. Choose a solving tool](#part-1-tools)
3. [Part 2: Reinforcement, R-6.1–R-6.14](#part-2)
   - [1. Stack and matching exercises, R-6.1–R-6.6](#part-2-stacks)
   - [2. Queue and circular-array exercises, R-6.7–R-6.11](#part-2-queues)
   - [3. Deque and middle-swap exercises, R-6.12–R-6.14](#part-2-deques)
4. [Part 3: Creativity, C-6.15–C-6.31](#part-3)
   - [1. Stack limits and parsing, C-6.15–C-6.19](#part-3-stack)
   - [2. Enumeration and evaluation, C-6.20–C-6.23](#part-3-enumeration)
   - [3. ADT adapters and queue invariants, C-6.24–C-6.29](#part-3-adapters)
   - [4. Probability and scheduling puzzles, C-6.30–C-6.31](#part-3-puzzles)
5. [Part 4: Projects, P-6.32–P-6.37](#part-4)
   - [1. Map the six projects](#part-4-map)
   - [2. Check a finished design](#part-4-check)
6. [Part 5: One Connected Geometry Practice Program](#part-5)
   - [1. The complete program](#part-5-program)
   - [2. Trace its result](#part-5-trace)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: What the Exercises Practice

<span id="background-cards"></span>

### 1. Keep the rectangle cards connected

The [stack](06-01-stacks.md), [queue](06-02-queues.md), and [deque](06-03-double-ended-queues.md) guides use these separate physical cards:

| Card | Width | Height | Area, width × height |
| :--- | ----: | -----: | -------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 2 cm | 2 cm | 4 cm² |
| `E` | 2 cm | 3 cm | 6 cm² |
| `F` | 4 cm | 2 cm | 8 cm² |
| `G` | 4 cm | 4 cm | 16 cm² |

The original `A`–`D` set has total individual area **6 + 8 + 16 + 4 = 34 cm²**. All seven have **64 cm²**. Repeated dimensions do not mean repeated identities: `E` and `A` are two different cards. These totals do not assume a gap-free display-board layout.

The book's exercises use integers, expressions, HTML, scheduling, cows, and stock transactions. The card cases in this guide are **new practice examples**. Use the supplied PDF for each exercise's exact wording and restrictions.

<span id="background-method"></span>

### 2. Track state, order, and area separately

An exercise about a data structure often asks for a returned value, final order, running time, or storage invariant. Use separate lines for each:

```text
Operation  →  returned value  →  logical contents  →  physical slots, if relevant
```

The card area is an additional geometry check. A stack, queue, or deque stores labels and order; it does not calculate area automatically. For a group of pending cards, **pending area = sum of each pending card's width × height**. A peek changes neither the collection nor its area. A successful removal changes both; an attempted removal that raises `Empty` changes neither.

For any sequence of operations, the size invariant is:

```text
final size = initial size + successful insertions − successful deletions
```

An error is not a successful deletion. This one line is especially useful for R-6.2 and R-6.8. When an exercise asks for time, distinguish one operation's worst case from its **amortized** cost over a sequence, as in the [array queue guide](06-02-queues.md).

> **Mental model:** First trace the order. Then check size and, for our cards, area. Finally justify the implementation cost or constraint.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 6.4 Exercises at a Glance

Section 6.4 is an exercise section, with three groups rather than new implementation subsections. The tables in Parts 2–4 paraphrase **all 37 numbered prompts** and point to the idea each one tests. They are a study map, not a replacement for the PDF's precise instructions.

<span id="part-1-groups"></span>

### 1. Read the three exercise groups

| Group | Numbers | Main kind of work | Good first step |
| :---- | :------ | :---------------- | :-------------- |
| **Reinforcement** | R-6.1–R-6.14 | Trace operations and apply the chapter's ADTs. | Write contents after every operation. |
| **Creativity** | C-6.15–C-6.31 | Design algorithms or adaptations under specific limits. | List permitted storage and operations. |
| **Projects** | P-6.32–P-6.37 | Build a complete class or program. | Specify state, invariants, and boundary cases. |

<span id="part-1-tools"></span>

### 2. Choose a solving tool

| Prompt clue | Useful representation | Geometry reminder |
| :---------- | :-------------------- | :---------------- |
| “Trace,” “returned values,” or “final size” | State table after every operation | Label order and total area are different facts. |
| “Circular array,” “front index,” or “resize” | Physical slots plus logical queue order | `[E, F, C, D]` can mean logical `[C, D, E, F]`. |
| “Preserve order” or “restore” | Write each transfer's reversal explicitly | Reversing twice restores the card order. |
| “Amortized” | Count how often each element moves across many calls | One costly transfer need not make every call costly. |
| “Expression” or “postfix” | Operand or opening-symbol stack | Multiply widths by heights before adding areas. |
| “Probability” or “time target” | Explicit sample space or schedule | Keep the prompt's original random or timing assumptions. |

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement, R-6.1–R-6.14

These prompts mainly test whether the stack, queue, and deque rules are applied in the correct order. For operation traces, write the contents **after** each call and record a return value separately; a peek leaves the contents unchanged.

<span id="part-2-stacks"></span>

### 1. Stack and matching exercises, R-6.1–R-6.6

| Exercise | What the book asks, in brief | Reading strategy |
| :------- | :--------------------------- | :--------------- |
| **R-6.1** | Trace return values from a given sequence of stack pushes and pops. | Top is the rightmost item in a bottom-to-top sketch; record returns before updating the sketch. |
| **R-6.2** | Find final stack size from push, pop, and top counts, including `Empty` errors. | Count only successful pops; top calls and failed pops do not change size. |
| **R-6.3** | Move every item from stack `S` to stack `T` using stack operations. | Each pop from `S` becomes a push to `T`, reversing order. |
| **R-6.4** | Remove every stack item recursively. | State the empty-stack base case; each recursive step removes one top item. |
| **R-6.5** | Reverse a list using a stack. | Push list items in their original order, then pop into the result. |
| **R-6.6** | Define precisely when grouping symbols in an arithmetic expression match. | Each closer must meet the most recent unmatched opener of the same type; nothing may remain open. |

For our cards, pushing `A, B, C, D` and popping all four produces `D, C, B, A`. The **popped cards** have total individual area **4 + 16 + 8 + 6 = 34 cm²**; the stack finishes empty. This is a practice trace for the reversal idea, not the book's integer trace.

<span id="part-2-queues"></span>

### 2. Queue and circular-array exercises, R-6.7–R-6.11

| Exercise | What the book asks, in brief | Reading strategy |
| :------- | :--------------------------- | :--------------- |
| **R-6.7** | Trace return values from a given queue operation sequence. | Remove from the front; insert at the back. |
| **R-6.8** | Find final queue size from enqueue, dequeue, and first counts, including `Empty` errors. | Failed dequeues and `first()` calls do not change size. |
| **R-6.9** | Find the final front index for R-6.8 using an `ArrayQueue` of initial capacity 30 that never fills past 30. | Advance `_front` only for successful dequeues; use modulo 30. |
| **R-6.10** | Explain why a changed `_resize` copy loop is wrong. | Copy from the logical front, not blindly from physical index `0`. |
| **R-6.11** | Implement the queue ADT using `collections.deque` as storage. | Map enqueue to `append`, dequeue to `popleft`, and first to index `0`; keep empty behavior explicit. |

R-6.10 is easiest to see with cards. After `A` and `B` leave a four-slot circular queue and `E`, `F` arrive, physical slots are `[E, F, C, D]` but logical order is `[C, D, E, F]`. Copying `old[k]` to the new array's index `k` would copy physical order and make `E` appear first. The correct walk starts at `_front = 2` and copies `C, D, E, F`.

<span id="part-2-deques"></span>

### 3. Deque and middle-swap exercises, R-6.12–R-6.14

| Exercise | What the book asks, in brief | Reading strategy |
| :------- | :--------------------------- | :--------------- |
| **R-6.12** | Trace a fixed sequence of deque operations and their returned values. | Keep both ends visible. The printed prompt says `back()` once; §6.3 names the rear peek `last()`. |
| **R-6.13** | Swap the middle two of eight deque items using only that deque and an initially empty queue. | Preserve the other six items and obey the prompt's temporary-storage restriction. |
| **R-6.14** | Make the same eight-item swap using only the deque and an initially empty stack. | Track how a stack reverses transfers, then restore the surrounding order. |

The book uses the numbers `1` through `8` for the swap. For a card analogy, add a distinct card `H` measuring 2 cm × 2 cm, area 4 cm². In `[A, B, C, D, E, F, G, H]`, swap the fourth and fifth cards to obtain `[A, B, C, E, D, F, G, H]`. Both orders have **64 + 4 = 68 cm²** of individual card area. The area check cannot prove the order is correct, so inspect the actual sequence too.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Creativity, C-6.15–C-6.31

Creativity prompts add constraints beyond getting the right output. A correct result may still fail an exercise if it uses too many variables, recursion where forbidden, a second queue where only one is allowed, or the wrong time bound.

<span id="part-3-stack"></span>

### 1. Stack limits and parsing, C-6.15–C-6.19

| Exercise | What the book asks, in brief | Constraint to keep in view |
| :------- | :--------------------------- | :------------------------- |
| **C-6.15** | With three distinct integers in random stack order, report the maximum with probability 2/3. | Straight-line pseudocode; one variable, one comparison, no loop or recursion. |
| **C-6.16** | Add optional `maxlen` to `ArrayStack` and raise `Full` when a bounded stack is full. | `None` means no fixed bound; test the bound before changing state. |
| **C-6.17** | Redo the bounded stack with its array preallocated to a finite `maxlen`. | Keep a separate live size; handle the unbounded `maxlen=None` case separately. |
| **C-6.18** | Reverse a stack in place using the transfer idea and two temporary stacks. | A transfer reverses order; plan how many reversals reach the desired final state. |
| **C-6.19** | Extend simple HTML tag matching to handle attributes in opening tags. | Compare the opening tag **name**, not the entire `<...>` contents, with its closing name. |

For C-6.15, the chance comes from the random order of three distinct values: the largest appears among two inspected positions in **2 of 3** equally likely positions. That explains the target probability; the exercise still asks for pseudocode satisfying all its restrictions. For C-6.16 and C-6.17, consider a card stack with maximum length `3`: pushing `D` onto `[A, B, C]` must raise `Full` and leave `[A, B, C]` unchanged.

<span id="part-3-enumeration"></span>

### 2. Enumeration and evaluation, C-6.20–C-6.23

| Exercise | What the book asks, in brief | Constraint to keep in view |
| :------- | :--------------------------- | :------------------------- |
| **C-6.20** | List all permutations of `{1, …, n}` without recursion, using an explicit stack. | A stack must hold unfinished search states; there are `n!` outputs. |
| **C-6.21** | List every subset of an n-element set `T` without recursion, using a stack and queue. | Each element has include/exclude choices; there are `2^n` outputs. |
| **C-6.22** | Evaluate postfix arithmetic expressions without recursion. | Push operands; an operator pops the **right** operand, then the left. |
| **C-6.23** | Rearrange three stacks so original `T` elements lie below original `S` elements in `S`, preserving each group's order, and restore `R`. | Write bottom-to-top order after every transfer; restoring `R` is part of the goal. |

With only cards `A`, `B`, `C`, there are **3! = 6** possible orders and **2³ = 8** subsets. Every permutation still contains the same three areas, totaling **6 + 8 + 16 = 30 cm²**. Subsets have different area sums; the empty subset has 0 cm² and `{A, B, C}` has 30 cm². These are small test cases for enumeration, not substitutions for the book's `{1, …, n}` and `T` requirements.

<span id="part-3-adapters"></span>

### 3. ADT adapters and queue invariants, C-6.24–C-6.29

| Exercise | What the book asks, in brief | Constraint to keep in view |
| :------- | :--------------------------- | :------------------------- |
| **C-6.24** | Implement a stack ADT with one queue. | Use only constant local memory; give running time for each stack operation. |
| **C-6.25** | Implement a queue ADT with two stacks. | Prove **amortized O(1)** time formally across operations, even if one call transfers many items. |
| **C-6.26** | Implement a deque ADT with two stacks. | Explain how both ends are represented and give operation times. |
| **C-6.27** | Search stack `S` for `x` using an initially empty queue and constant other variables. | Restore the exact original order of `S` before returning the result. |
| **C-6.28** | Add optional `maxlen` and `Full` behavior to `ArrayQueue`. | A failed enqueue must preserve the old queue and front index. |
| **C-6.29** | Add an efficient `ArrayQueue.rotate` equivalent to enqueueing the dequeued front. | Preserve `_size`, move the logical front correctly, and handle circular slots. |

For C-6.25, imagine `A, B, C, D` pushed into an **in** stack. When the first dequeue needs a card, transfer all four once into an **out** stack; `A` is then on top and leaves first. Later removals of `B`, `C`, and `D` use that out stack. A single transfer costs O(n), but each card crosses from in to out at most once. An accounting proof can charge each enqueue for its one push and reserve two more constant-cost units for that card's possible transfer (one pop, one push). A dequeue then pays for its final pop. Thus total work is proportional to the number of operations, giving O(1) amortized time per operation.

<span id="part-3-puzzles"></span>

### 4. Probability and scheduling puzzles, C-6.30–C-6.31

| Exercise | Original setting | How to study it |
| :------- | :--------------- | :-------------- |
| **C-6.30** | Arrange 50 odd and 50 even integers between two queues; a random queue choice and a random number of round-robin steps determine the final item. | Draw the sample space and state any assumed random distributions before computing a probability. |
| **C-6.31** | Move four cows with crossing times 2, 4, 10, and 20 minutes across a bridge with a two-cow yoke in 34 minutes. | Record who is on each bank, who carries the yoke, and the time of every crossing. |

These prompts have their own parity and bridge constraints. The rectangle-card area model does not determine their answers. In C-6.30, the wording does not specify the random distributions fully, so a numeric probability needs stated assumptions about how the queue and number of steps are chosen.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Projects, P-6.32–P-6.37

Projects ask for working implementations, not only a hand trace. Use the source prompt for exact required interfaces and input/output behavior.

<span id="part-4-map"></span>

### 1. Map the six projects

| Project | What to build | First design check |
| :------ | :------------ | :----------------- |
| **P-6.32** | The full array-backed deque suggested in §6.3.2. | `add_first`, `add_last`, `delete_first`, and `delete_last` work through wraparound and resize. |
| **P-6.33** | An array deque covering all public `collections.deque` behaviors in Table 6.4. | Include indexed access/replacement, `clear`, `rotate`, `remove`, `count`, and optional `maxlen` eviction. |
| **P-6.34** | A program that reads a postfix expression and prints its value. | Validate operand order and enough operands before every operator. |
| **P-6.35** | A fixed-capacity circular **LeakyStack** for Undo. | When full, a new push is accepted and the oldest bottom entry is discarded. |
| **P-6.36** | A FIFO capital-gain/loss calculator for buy and sell transactions. | Each sale consumes the oldest purchase lot, including partial lots. |
| **P-6.37** | Red and blue stacks sharing one array of capacity `N`. | Grow them from opposite ends; the prompt assumes `N` stays strictly greater than their combined sizes. |

P-6.36 is a stock-transaction problem; card areas can illustrate FIFO order, but the project must calculate gains and losses using purchase and sale prices. P-6.35 differs from C-6.16: a full bounded stack raises `Full`, while a full LeakyStack **accepts** the new item and forgets the oldest one.

<span id="part-4-check"></span>

### 2. Check a finished design

For each project, check the **empty**, **one-item**, **full**, **wrapped**, and **resized** states that apply. State an invariant that remains true after every operation. For an array deque, for example, the k-th logical element must be at `(_front + k) % capacity`; after resizing, logical order must remain unchanged. For the two-color stacks, red and blue occupied regions must never overlap.

Check performance claims against actual work. A single array resize or a two-stack transfer may cost O(n), while an appropriately designed sequence can still have O(1) amortized cost per operation. A successful geometry example is evidence for one case, not a proof for every input.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: One Connected Geometry Practice Program

<span id="part-5-program"></span>

### 1. The complete program

This small program checks representative stack, queue, and deque traces from the card cases. It is a practice harness for the chapter ideas, not a complete solution to the implementation projects. Save it as `rectangle_card_exercises.py`.

```python
from collections import deque


card_sizes = {
    "A": (2, 3), "B": (4, 2), "C": (4, 4), "D": (2, 2),
    "E": (2, 3), "F": (4, 2), "G": (4, 4),
}


def card_area(label):
    width, height = card_sizes[label]
    return width * height


# Stack: last placed card leaves first.
stack = []
for label in ("A", "B", "C", "D"):
    stack.append(label)
stack_pop_order = []
while stack:
    stack_pop_order.append(stack.pop())
print(f"Stack pop order: {stack_pop_order}; area = {sum(card_area(x) for x in stack_pop_order)} cm^2")

# Queue: first arrival leaves first. E and F are new physical cards.
line = deque(["A", "B", "C", "D"])
measured = [line.popleft(), line.popleft()]
line.append("E")
line.append("F")
print(f"Queue measured: {measured}; waiting = {list(line)}; pending = {sum(card_area(x) for x in line)} cm^2")

# Deque: choose either end for each operation.
tray = deque(["A", "B", "C", "D"])
removed = [tray.popleft(), tray.pop()]
tray.appendleft("E")
tray.append("F")
tray.appendleft("G")
removed_area = sum(card_area(x) for x in removed)
pending_area = sum(card_area(x) for x in tray)
print(f"Deque removed: {removed}; tray = {list(tray)}; pending = {pending_area} cm^2")
print(f"All seven cards: {removed_area} removed + {pending_area} pending = {removed_area + pending_area} cm^2")
```

The built-in `list` acts as a stack here, and `collections.deque` supplies queue and deque end operations. The code calculates area from dimensions separately. Converting a whole deque to a list for display takes O(n); the trace uses it only to show the small example's order.

<span id="part-5-trace"></span>

### 2. Trace its result

```text
Stack pop order: ['D', 'C', 'B', 'A']; area = 34 cm^2
Queue measured: ['A', 'B']; waiting = ['C', 'D', 'E', 'F']; pending = 34 cm^2
Deque removed: ['A', 'D']; tray = ['G', 'E', 'B', 'C', 'F']; pending = 54 cm^2
All seven cards: 10 removed + 54 pending = 64 cm^2
```

The **popped cards'** 34 cm² is the original `A`–`D` set in reverse order; the stack finishes empty. The queue's 34 cm² belongs to a **different** set, `C, D, E, F`. Equal totals do not imply identical contents. The deque line accounts for all seven cards: the removed `A` and `D` have 10 cm², and the remaining five have 54 cm².

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why must a circular resize follow the logical front?</strong></summary>

**Scenario:** A four-slot queue physically stores `[E, F, C, D]`, with `_front = 2` and `_size = 4`. Its logical order is `[C, D, E, F]`.

**Problem:** Copying physical slots `old[0]`, `old[1]`, `old[2]`, `old[3]` into a new array produces `[E, F, C, D]`, so `E` incorrectly becomes first.

**Fix:** Copy `old[(_front + k) % 4]` for `k = 0, 1, 2, 3`. The new array starts `[C, D, E, F]`. Both orders happen to total 34 cm², so area alone cannot reveal this FIFO error. This is an analogous card trace for R-6.10.

</details>

<details>
<summary><strong>Case Study 2: How many permutations and subsets do three cards have?</strong></summary>

**Scenario:** Use distinct cards `A`, `B`, `C`, with areas 6, 8, and 16 cm².

**Permutations:** The first position has 3 choices, the second 2, the third 1, giving **3! = 6** orders. Each order still has total area **30 cm²**.

**Subsets:** Each card is included or excluded, giving **2³ = 8** subsets. Their area sums, including the empty subset, are **0, 6, 8, 16, 14, 22, 24, 30 cm²**. This checks the output counts for the ideas in C-6.20 and C-6.21.

</details>

<details>
<summary><strong>Case Study 3: What does a postfix stack calculate?</strong></summary>

**Scenario:** To add the areas of `A` and `B`, write `2 3 * 4 2 * +` in postfix notation. Numbers are dimensions in centimetres.

| Token | Operand stack afterward | Meaning |
| :---- | :---------------------- | :------ |
| `2`, `3`, `*` | `[6]` | `2 × 3 = 6 cm²`, card `A`. |
| `4`, `2`, `*` | `[6, 8]` | `4 × 2 = 8 cm²`, card `B`. |
| `+` | `[14]` | `6 + 8 = 14 cm²`. |

The operator pops the right operand before the left. The order matters for a noncommutative operator: `2 3 * 4 2 * -` means **6 − 8 = −2 cm²**, the signed difference between `A`'s and `B`'s areas. Do not multiply two **areas** here: that would have unit cm⁴. C-6.22 and P-6.34 ask for general evaluators beyond this small expression.

</details>

<details>
<summary><strong>Case Study 4: What changes when a stack is full?</strong></summary>

**Scenario:** A capacity-three card stack holds `[A, B, C]` from bottom to top, with total individual area **6 + 8 + 16 = 30 cm²**. Card `D` has area 4 cm².

**Bounded ArrayStack:** Under C-6.16/C-6.17, `push(D)` raises `Full`; the stack and its 30 cm² remain unchanged.

**LeakyStack:** Under P-6.35, `push(D)` succeeds and discards the oldest bottom card `A`. The new stack is `[B, C, D]`, with **8 + 16 + 4 = 28 cm²**. The caller must account for that discarded card if it tracks area.

</details>

<details>
<summary><strong>Case Study 5: Why does a two-stack queue have amortized cost?</strong></summary>

**Scenario:** Push `A, B, C, D` into an input stack. The output stack starts empty.

**Transfer:** Move all four cards to the output stack once; its top becomes `A`. Then dequeueing gives `A`, `B`, `C`, `D` in FIFO order.

**Cost idea:** One dequeue may move four cards, but each card is moved from input to output at most once and later popped once. Over many queue operations, that bounds the total transfer work by a constant times the number of enqueued cards. A formal version of this argument is required by C-6.25.

</details>

<details>
<summary><strong>Case Study 6: Can an area total verify a middle swap?</strong></summary>

**Scenario:** Add card `H` (2 cm × 2 cm, 4 cm²) to get `[A, B, C, D, E, F, G, H]`. The fourth and fifth entries are `D` and `E`.

**Target:** `[A, B, C, E, D, F, G, H]`. Both sequences total **68 cm²** because swapping changes order, not card areas.

**Check:** Inspect the full order as well as the sum. R-6.13 and R-6.14 also restrict temporary storage to one empty queue or one empty stack respectively; this area check does not satisfy those algorithmic restrictions.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Exercise idea | What to establish | Rectangle-card check |
| :------------ | :---------------- | :------------------- |
| **Trace an ADT** | Record returns and front/top/back order after each call. | Stack `A`–`D` pops `D, C, B, A`. |
| **Count successful changes** | Ignore peeks and failed removals in the size equation. | A card cannot leave an empty tray. |
| **Preserve logical order** | Copy or transfer elements in the required sequence. | Wrapped queue slots `[E, F, C, D]` mean logical `[C, D, E, F]`. |
| **Respect constraints** | Check allowed temporary structures, variables, recursion, and bounds. | A correct 68 cm² swap can still violate R-6.13's storage rule. |
| **Prove amortized cost** | Count total moves over many operations. | Each card crosses between the two queue-adapter stacks at most once. |
| **Keep units and totals sound** | Calculate geometry outside the ADT. | `2 × 3 + 4 × 2 = 14 cm²`, with no area multiplication. |
| **Test implementation edges** | Exercise empty, full, wraparound, resize, and order restoration. | A full bounded stack and full LeakyStack handle `D` differently. |

[🔝 Back to Top](#top)
