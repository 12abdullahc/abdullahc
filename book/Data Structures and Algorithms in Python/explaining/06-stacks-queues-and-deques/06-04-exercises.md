<span id="top"></span>

# Stacks, Queues, and Deques — Section 6.4: Exercises

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 6, Section 6.4, printed pages 250–254 ([chapter PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C06.pdf)).<br>
> **Topic:** Reinforcement R-6.1–R-6.14, Creativity C-6.15–C-6.31, and Projects P-6.32–P-6.37.<br>
> **Domain focus:** **Friday 9 October 2026 MotoGP Practice** at the Indonesian Grand Prix in Mandalika. Rider cards feature Marc Márquez, Fabio Quartararo, and other riders from that same session.<br>
> **Learning goal:** Solve each kind of exercise by tracing its state, respecting its storage limits, and checking the final order, return value, and running time.<br>
> **User Prompt:** "Reexplain [Section 6.4] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Session, Three Structures](#background-intuition)
   - [1. The verified rider cards](#background-data)
   - [2. How to read an exercise](#background-method)
2. [Part 1: Reinforcement, R-6.1–R-6.14](#part-1)
   - [1. Stack traces and matching, R-6.1–R-6.6](#part-1-stacks)
   - [2. Queue traces and arrays, R-6.7–R-6.11](#part-1-queues)
   - [3. Deque traces and middle swaps, R-6.12–R-6.14](#part-1-deques)
3. [Part 2: Creativity, C-6.15–C-6.31](#part-2)
   - [1. Stack limits and parsing, C-6.15–C-6.19](#part-2-stacks)
   - [2. Generate, evaluate, and combine, C-6.20–C-6.23](#part-2-generate)
   - [3. ADT adapters and restoration, C-6.24–C-6.29](#part-2-adapters)
   - [4. Probability and bridge puzzles, C-6.30–C-6.31](#part-2-puzzles)
4. [Part 3: Projects, P-6.32–P-6.37](#part-3)
   - [1. Two deque projects, P-6.32–P-6.33](#part-3-deques)
   - [2. Evaluator and leaky stack, P-6.34–P-6.35](#part-3-evaluator)
   - [3. FIFO lots and two stacks in one array, P-6.36–P-6.37](#part-3-applications)
5. [Part 4: Complete Worked Practice Notebook](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Session, Three Structures

<span id="background-data"></span>

### 1. The verified rider cards

Our examples use the **MotoGP Practice classification on Friday 9 October 2026**, not the Sprint or Grand Prix. The [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) identifies the session, and [Yamaha's full Practice results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) provide these positions, teams, and best laps.

| Practice position | Rider | Team | Best lap | Card |
| :---------------: | :---- | :--- | -------: | :--- |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | `MARC` |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:29.558 | `FABIO` |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | `RAUL` |
| P2 | Marco Bezzecchi | Aprilia Racing | 1:28.944 | `MARCO` |
| P4 | Pedro Acosta | Red Bull KTM Factory Racing | 1:29.394 | `PEDRO` |
| P3 | Jorge Martín | Aprilia Racing | 1:29.206 | `JORGE` |
| P6 | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team | 1:29.430 | `DIGGIA` |
| P8 | Álex Márquez | BK8 Gresini Racing MotoGP | 1:29.572 | `ALEX` |

Marc and Fabio appear first in the table because they anchor the examples; the table is **not** in classification order. A card's name, team, position, and lap are factual. Its placement in a hypothetical stack, queue, or deque is a teaching choice and says nothing about the riders' arrival or service order at Practice.

**Why these cards?** A small, repeated set lets us see that the structure's rules, rather than the Practice positions, determine the next card removed. **How to use them:** replace a book integer with a card only when illustrating an algorithm; use the book's original integers for its exact trace answers.

<span id="background-method"></span>

### 2. How to read an exercise

Section 6.4 is an **exercise set**, so its "parts" are the three exercise groups rather than new textbook subsections. The summaries below paraphrase the questions; use the chapter PDF for the exact wording and constraints.

Before solving any prompt, write down four things:

1. **Orientation.** Stack diagrams below run bottom → top; queue and deque diagrams run front → back.
2. **Allowed operations.** A solution that gives the right final order with an extra list may still violate a one-queue or one-stack restriction.
3. **State changes.** A peek changes nothing. A failed removal that raises `Empty` changes nothing. A bounded insertion that raises `Full` changes nothing.
4. **Proof or check.** For a trace, list returned values in call order. For an algorithm, state its invariant and test a small case. For a cost claim, count the transfers and distinguish worst-case from amortized time.

| Structure | Example contents | Next removal | Reason |
| :-------- | :--------------- | :----------- | :----- |
| Stack, bottom → top | `[MARC, FABIO, RAUL]` | `RAUL` | Last pushed, first out. |
| Queue, front → back | `[MARC, FABIO, RAUL]` | `MARC` | First enqueued, first out. |
| Deque, front → back | `[MARC, FABIO, RAUL]` | `MARC` or `RAUL` | Either end may be removed. |

**Why this example?** The three structures contain the *same* cards. **How to solve a new exercise:** label the two ends and apply the permitted method to the correct end before doing any arithmetic.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-6.1–R-6.14

Reinforcement exercises check whether the basic ADTs and the chapter's array implementations are understood. The most reliable method is a short state table. Write the returned value **before** changing the drawing, then draw the state afterward.

<span id="part-1-stacks"></span>

### 1. Stack traces and matching, R-6.1–R-6.6

**R-6.1 — Trace a stack.** The book begins with an empty stack and interleaves pushes with eight pops. Put the top at the right. The pop results, in call order, are **`3, 8, 2, 1, 6, 7, 4, 9`**; `[5]` remains. For example, `push(5), push(3), pop()` returns `3` and leaves `[5]`. Continue the same way after every push and pop.

**Why this example?** The first three calls reveal LIFO without a long trace. **How to solve the full prompt:** draw one state per call and take each `pop()` from the rightmost end. Count eight returned values, then check the one leftover value.

**R-6.2 — Count successful changes.** There are 25 pushes and 10 attempted pops, but three pops raise and catch `Empty`. Only seven pops remove anything, so the final size is **`25 − 7 = 18`**. The 12 `top()` calls only inspect values.

**Why this example?** It catches the common mistake of subtracting every attempted pop. **How to solve it:** mark calls as successful insertion, successful deletion, or no size change; then calculate the net change.

**R-6.3 — Transfer `S` to `T`.** Repeat `T.push(S.pop())` until `S` is empty. If `S = [MARC, FABIO, RAUL]` bottom → top and `T` starts empty, `T` ends `[RAUL, FABIO, MARC]` bottom → top. `S` is empty.

**Why this example?** All three rider cards make the reversal visible. **How to solve it:** move only the current top, then trace the destination's top. A single whole-stack transfer reverses order.

**R-6.4 — Clear a stack recursively.** The base case is `S.is_empty()`. Otherwise, pop one item and call the same function on the smaller stack:

```python
def clear_stack(S):
    if S.is_empty():
        return
    S.pop()
    clear_stack(S)
```

**Why this example?** A three-card stack becomes a two-card stack, then one card, then the empty base case. **How to solve it:** prove that each call reduces size by one; without that reduction, recursion might never stop. The recursion itself uses `O(n)` call-stack space.

**R-6.5 — Reverse a list with a stack.** Push list values left to right, then replace each list position left to right with a pop. `[MARC, FABIO, RAUL]` becomes `[RAUL, FABIO, MARC]`. The stack gives the reverse because the last pushed item is the first popped.

**Why this example?** It applies exactly the transfer reversal in R-6.3 to an ordinary list. **How to solve it:** use two passes of length `n`; the additional stack uses `O(n)` space.

**R-6.6 — Define matching delimiters.** Every closing `)`, `]`, or `}` must match the **most recent unmatched** opening delimiter of the same type, and no opener may remain after the scan. Push openers; for each closer, reject an empty stack or a different top. Thus `[(MARC, FABIO)]` matches, while `[(MARC, FABIO])` fails when `]` meets `(`.

**Why this example?** The wrong string contains the same counts of brackets, so counting alone gives the wrong answer. **How to solve it:** check nesting with the top of a stack, then require an empty stack at the end. This is the rule used in the [stack guide](06-01-stacks.md).

<span id="part-1-queues"></span>

### 2. Queue traces and arrays, R-6.7–R-6.11

**R-6.7 — Trace a queue.** Starting empty, the book uses the same inserted integers as R-6.1 but replaces pushes and pops with enqueues and dequeues. The eight dequeue results are **`5, 3, 2, 8, 9, 1, 7, 6`**; `[4]` remains. The first three calls, `enqueue(5), enqueue(3), dequeue()`, return `5` because the front is the leftmost value.

**Why this example?** Comparing it with R-6.1 isolates the effect of FIFO versus LIFO. **How to solve it:** append every enqueue on the right and remove every dequeue from the left.

**R-6.8 — Count successful dequeues.** Of 15 attempted dequeues, five raise and catch `Empty`. The ten successful dequeues cancel ten of the 32 enqueues, leaving **`22`** elements. The ten `first()` calls do not remove an item.

**R-6.9 — Track the front index.** In the R-6.8 sequence, the initial `ArrayQueue` capacity is 30 and the queue never exceeds it, so no resize changes the indexing basis. Each of the ten successful dequeues advances `_front` once. Starting from zero, the final front index is **`(0 + 10) % 30 = 10`**. Failed dequeues and `first()` calls do not advance it.

**Why these examples?** The same successful-dequeue count answers two different questions: logical size and physical front position. **How to solve them:** keep separate columns for `_size` and `_front`; only a successful dequeue changes both.

**R-6.10 — Fix the resize walk.** A circular queue's physical index zero is not necessarily its logical front. In a four-slot illustration, physical slots `[MARC, FABIO, RAUL, MARCO]` with `_front = 2` represent logical order `[RAUL, MARCO, MARC, FABIO]`. A resize that copies `old[k]` starts with Marc and breaks FIFO. Copy `old[(_front + k) % old_capacity]` for `k = 0, …, _size−1`, then set `_front = 0`.

**Why this example?** Four distinct cards show both the wrap and the wrong first item. **How to solve it:** write physical indices and logical order separately; verify that the new array begins with the old logical front.

**R-6.11 — Adapt `collections.deque` to the queue ADT.** Keep one `deque` as the backing store. `enqueue(e)` calls `append(e)`; `dequeue()` calls `popleft()`; `first()` reads index `0`; `len` delegates to `len`. Translate empty-container `IndexError` into the queue ADT's `Empty` exception if using the book's interface.

```python
from collections import deque

class Empty(Exception):
    pass

class DequeQueue:
    def __init__(self):
        self._data = deque()

    def __len__(self):
        return len(self._data)

    def is_empty(self):
        return len(self._data) == 0

    def enqueue(self, item):
        self._data.append(item)

    def first(self):
        if self.is_empty():
            raise Empty("queue is empty")
        return self._data[0]

    def dequeue(self):
        if self.is_empty():
            raise Empty("queue is empty")
        return self._data.popleft()
```

**Why this example?** A rider-card request is naturally served oldest first. **How to solve the adapter:** map each abstract operation to one concrete deque operation, then check the empty behavior and `O(1)` end operations.

<span id="part-1-deques"></span>

### 3. Deque traces and middle swaps, R-6.12–R-6.14

**R-6.12 — Trace both ends.** In the book's integer sequence, the value-returning calls produce **`9, 5, 9, 4, 7, 4, 8`** and leave `[7, 6]` front → back. The prompt says `back()` once, but Section 6.3 names the rear-peek method `last()`. Read `back()` as that rear peek when tracing the intended ADT.

**Why this example?** A rear peek and front deletion are easy to confuse. **How to solve it:** after each call, update a front-to-back list; peeks return an end value without removing it. The [deque guide](06-03-double-ended-queues.md) gives the end-operation rules.

**R-6.13 — Swap positions four and five using one empty queue.** The book starts with `D = [1,2,3,4,5,6,7,8]`. The permitted queue `Q` starts empty. First enqueue `D.delete_first()` three times, so `Q=[1,2,3]` and `D=[4,5,6,7,8]`. Move `4` from the deque's front to its back, enqueue the new front `5`, then enqueue the back `4`. Enqueue the remaining `6,7,8` from `D`. Finally, dequeue everything from `Q` into `D.add_last`. The result is `[1,2,3,5,4,6,7,8]`.

**Why this example?** The book's eight numbers make the two unchanged outer groups and the swapped middle pair visible. **How to solve it:** inspect `Q` before the final transfer: it must already read `[1,2,3,5,4,6,7,8]`. The transfer then preserves that FIFO order.

**R-6.14 — Make the same swap using one empty stack.** Move the last five deque items to stack `S`, leaving `D=[1,2,3]` and `S=[8,7,6,5,4]` bottom → top. Add `S.pop()` (the `4`) to the *front* of `D`, then add `S.pop()` (the `5`) to the *back*: `D=[4,1,2,3,5]`. Move the front `4` to the back, obtaining `[1,2,3,5,4]`. Finally, pop `6,7,8` from `S` and add each to the back. The result is `[1,2,3,5,4,6,7,8]`.

**Why this example?** Moving the original suffix to a stack makes `4` and `5` available first; the unchanged `6,7,8` then return in order. **How to solve it:** trace both `S` and `D` after each phase, and check that `S` is empty at the end. A correct final deque obtained with an extra list would not satisfy the prompt's storage limit.

[🔝 Back to Top](#top)

---
<span id="part-2"></span>

## Part 2: Creativity, C-6.15–C-6.31

These prompts ask for an algorithm under a constraint. The constraint is part of the problem: "one comparison," "no recursion," "one queue," and "constant additional memory" must hold as well as the final answer. For each design below, identify what each structure stores and what remains true after one step.

<span id="part-2-stacks"></span>

### 1. Stack limits and parsing, C-6.15–C-6.19

**C-6.15 — Find the maximum with probability `2/3`.** The three distinct integers arrive in a uniformly random stack order. We may inspect only two of them with one variable and one comparison:

```text
x = S.pop()
if x < S.top():
    x = S.pop()
report x
```

`x` is the larger of the original top two. The true maximum is in those two positions in two of the three possible positions, so this reports it with probability **`2/3`**. If the comparison is false, the second item stays on the stack; the prompt asks for the reported value, not preservation of the stack.

**Why this example?** Three distinct lap-time ranks, such as Marc's, Fabio's, and Raúl's, make the "two of three positions" argument visible. The algorithm applies to the exercise's **integers**, and "maximum" here means the largest integer, not the quickest lap. **How to solve it:** choose two positions, compare their values once, and count the positions in which the global maximum is among the inspected pair.

**C-6.16 — Bounded `ArrayStack`.** Add an optional `maxlen` to the constructor. If it is `None`, the stack is unbounded. If finite, reject `push` with `Full` when `len(stack) == maxlen`, **before** changing the list. For `maxlen=3`, `[MARC,FABIO,RAUL]` stays exactly the same after a fourth attempted push. Validate that a finite bound is a nonnegative integer; with bound zero, every push is full.

**C-6.17 — Preallocate the bounded stack.** For finite `maxlen=c`, allocate `[None] * c` once and keep a separate `_size`. `push(e)` writes `_data[_size] = e` then increments `_size`; `pop()` decrements `_size`, reads that slot, and clears it to `None`. Only indices below `_size` are live. Handle `maxlen=None` through the ordinary growing-list path or a separate unbounded class.

**Why these examples?** A three-card limit makes the difference between allocated capacity and live count concrete. **How to solve them:** state the invariant `0 ≤ _size ≤ maxlen`, test a full push, and check that a failed push leaves both the data and size unchanged. C-6.17's array length is the capacity, not the stack's logical length.

**C-6.18 — Reverse a stack using two temporary stacks.** Transfer every item `S → A`, then `A → B`, then `B → S`. Each transfer reverses order, so three transfers reverse the original. For `S=[MARC,FABIO,RAUL]` bottom → top, the final `S=[RAUL,FABIO,MARC]`, and `A` and `B` are empty.

**Why this example?** Three distinct riders expose each of the three reversals. **How to solve it:** write the bottom-to-top order after every transfer; merely saying "use two stacks" does not prove the final order.

**C-6.19 — Match opening HTML tags with attributes.** An opening tag such as `<rider team="Ducati Lenovo Team">` must match `</rider>` by the **tag name** `rider`. Read the name after `<` up to whitespace or `>`; ignore the attributes for matching. Push opening names, and compare each closing name with the top. A mismatch, unexpected closing tag, or remaining opener is invalid.

**Why this example?** Marc's team name contains spaces, so comparing an entire opening-tag string with the closing tag would fail even when the nesting is correct. **How to solve it:** separate tokenization of the tag name from stack-based nesting. This is an extension of the chapter's simplified HTML matcher, not a complete browser-grade HTML parser.

<span id="part-2-generate"></span>

### 2. Generate, evaluate, and combine, C-6.20–C-6.23

**C-6.20 — Enumerate permutations without recursion.** Store unfinished search states `(prefix, unused)` in an explicit stack. Start with `([], [MARC,FABIO,RAUL])`. Pop a state; if `unused` is empty, output `prefix`. Otherwise, for every unused card, push a new state with that card added to the prefix and removed from unused. A three-card input yields **`3! = 6`** full orders.

**Why this example?** Three riders are enough to list and count every arrangement while seeing the branching. **How to solve it:** the stack replaces recursive call frames; every output has each rider once, and each choice path yields one unique output. If a specific output order is required, push children in the reverse order of the desired traversal.

**C-6.21 — Generate subsets with a stack and a queue.** Put all `n` input items into stack `S` and put the empty subset into queue `Q`. Pop one item `x` from `S`. Let `m` be the current queue length; repeat exactly `m` times: dequeue a subset `U`, then enqueue both `U` and `U ∪ {x}`. After processing each item, every old subset has one version without `x` and one with it. The queue holds **`2^n`** subsets at the end. For `{MARC,FABIO,RAUL}` there are eight, including the empty and full subsets.

**Why this example?** Three yes/no rider choices visibly double `1 → 2 → 4 → 8`. **How to solve it:** capture `m` *before* enqueuing new subsets so the newly created items are not processed during the same round. Copy `U` when constructing the included version so both queue entries remain independent.

**C-6.22 — Evaluate postfix arithmetic.** Scan tokens from left to right. Push each number. On a binary operator, pop the **right** operand first, then the left, compute `left operator right`, and push the result. A single value must remain at the end. Marc's Practice best lap is 89,426 milliseconds and Fabio's is 89,558 milliseconds, so:

```text
89558 89426 -   →   132 milliseconds
```

**Why this example?** Subtraction proves why operand order matters; reversing the pops would produce `−132`. **How to solve it:** detect too few operands, an unknown operator, division by zero, and more than one final value. The millisecond numbers are real session lap times; the postfix expression is our teaching calculation.

**C-6.23 — Put original `T` below original `S` while restoring `R`.** Suppose `R=[1,2,3]`, `S=[4,5]`, and `T=[6,7,8,9]`, each bottom → top as in the book's example. First transfer all **two** original `S` items to `R`. Then transfer all **four** original `T` items to `R`. Finally transfer exactly **six** items from `R` to `S`. The original `R` elements are never popped in that last phase. The final states are `R=[1,2,3]`, `S=[6,7,8,9,4,5]`, `T=[]`.

**Why this example?** The book's different group sizes make accidental mixing with the original `R` easy to spot. **How to solve it:** record the original sizes of `S` and `T`, and stop the final transfer after their sum; moving until `R` is empty would destroy the required restoration.

<span id="part-2-adapters"></span>

### 3. ADT adapters and restoration, C-6.24–C-6.29

**C-6.24 — Implement a stack with one queue.** Keep the stack top at the queue's **front**. To `push(x)` onto a queue of length `n`, enqueue `x`, then rotate the previous `n` front items to the back. `x` is now front. `pop()` is `dequeue()` and `top()` is `first()`. This uses only one queue instance and a constant number of local variables. Costs: `push = O(n)`; `pop = O(1)`; `top = O(1)`.

**Why this example?** Enqueueing Fabio after Marc and rotating Marc behind him makes Fabio the stack top without a second container. **How to solve it:** trace two pushes, then verify that the queue front is always the latest pushed item.

**C-6.25 — Implement a queue with two stacks and prove amortized `O(1)`.** Keep newly enqueued cards in an `in` stack and older cards ready for removal in an `out` stack. `enqueue` pushes to `in`. `dequeue` and `first` use `out`; only when it is empty, transfer **all** `in` items to `out`. That reversal puts the oldest enqueued card on top of `out`. A single transfer can take `O(n)` time.

For a formal amortized bound, count each stack push or pop as one unit and use potential `Φ = 2·|in|`. Enqueue costs one unit and raises `Φ` by two, so amortized cost is 3. A transfer of `k` items plus a final pop or peek costs at most `2k+1` and lowers `Φ` by `2k`, so amortized cost is at most 1. An ordinary `out` pop or peek also costs 1. Since `Φ` starts at zero and never becomes negative, `m` operations take `O(m)` total time.

**Why this example?** Four enqueued rider cards show a costly first dequeue followed by cheap later ones. **How to solve it:** prove that each card moves from `in` to `out` at most once; do not mistake one call's `O(n)` worst case for the sequence's `O(1)` amortized bound.

**C-6.26 — Implement a deque with two stacks.** Let the top of a `front` stack represent the deque's front and the top of a `back` stack represent its back. `add_first` and `add_last` push directly to their respective stacks. To inspect or delete an end whose stack is empty, transfer the entire other stack into it, reversing the order. Direct operations cost `O(1)`; a transfer costs `O(n)`.

**Why this example?** `[MARC,FABIO,RAUL]` can be stored all on one side, then transferred when the other end is requested. **How to solve it:** trace the logical front-to-back order before and after transfer. Unlike the two-stack FIFO queue in C-6.25, alternating requests at opposite ends can force repeated `O(n)` transfers, so this simple deque design does **not** have amortized `O(1)` for arbitrary operation sequences.

**C-6.27 — Search a stack and restore it.** While popping every item of `S` into initially empty queue `Q`, compare each item with `x` and remember only a Boolean `found`. To restore the exact stack order, perform three more whole-container transfers: `Q → S`, `S → Q`, and `Q → S`. After all four transfers, `S` has its original bottom-to-top order and `Q` is empty. The scan and restoration take `O(n)` time and a constant number of non-container variables.

**Why this example?** Searching for Fabio in `[MARC,FABIO,RAUL]` finds him during the first transfer, but returning immediately would leave the stack damaged. **How to solve it:** finish all restoration passes before returning `found`; check both a present and an absent target.

**C-6.28 — Bound `ArrayQueue`.** Add optional `maxlen`. Before enqueueing, if the logical size equals a finite bound, raise `Full`. Do not write an array slot, advance `_front`, or change `_size` on failure. A bound of zero rejects every enqueue; `None` means unbounded.

**C-6.29 — Rotate an `ArrayQueue` in `O(1)`.** The requested effect is `enqueue(dequeue())` while preserving size. For an empty queue, the equivalent dequeue raises `Empty`; for one item, the logical order is unchanged. If the array is **not full**, copy the old front item into the free slot at `(_front + _size) % capacity`, clear the old front slot, and advance `_front` modulo capacity. If the array **is full**, just advance `_front`: the old front item already occupies the physical slot that becomes the new logical rear. Keep `_size` unchanged in both cases.

**Why these examples?** A three-card queue in a four-slot array shows a free tail slot; the same queue in a three-slot array shows why blindly clearing the old front would lose an item. **How to solve them:** reason from logical indices, test empty, singleton, partial, and full arrays, and make sure rotate does not trigger resize or shrink.

<span id="part-2-puzzles"></span>

### 4. Probability and bridge puzzles, C-6.30–C-6.31

**C-6.30 — Distribute odd and even values between two queues.** The book has 50 even and 50 odd integers, Bob chooses one queue at random, and he runs a random number of round-robin steps. If the queue choice is equally likely and the number of steps makes each item in the chosen nonempty queue equally likely to be last processed, put **one even value alone** in `Q` and the other 49 evens with all 50 odds in `R`. Then

```text
P(last item even) = (1/2)(1) + (1/2)(49/99) = 74/99 ≈ 74.75%.
```

Among layouts with one all-even queue of size `k`, the probability is `(1 + (50−k)/(100−k))/2`, which falls as `k` grows from 1. Mixing odd items into both queues cannot improve the average under the stated uniform-item assumption. The prompt does not completely specify the distribution of the random step count, so **`74/99` is conditional on that uniformity**; without it, a single universal numeric probability is not justified.

**Why this example?** Keeping the original odd/even game matters: rider positions and lap times do not supply its random model. **How to solve it:** state the sample space and random assumptions first, calculate the even fraction in each queue, and then optimize the weighted average.

**C-6.31 — Move four cows in 34 minutes.** Preserve the book's bridge and two-cow yoke rules. The cows take 2, 4, 10, and 20 minutes individually; a pair travels at the slower cow's time. The yoke must come back for another forward crossing. One valid schedule is:

| Step | Crossing | Minutes | Total |
| ---: | :------- | ------: | ----: |
| 1 | 2 and 4 go across | 4 | 4 |
| 2 | 2 returns with yoke | 2 | 6 |
| 3 | 10 and 20 go across | 20 | 26 |
| 4 | 4 returns with yoke | 4 | 30 |
| 5 | 2 and 4 go across | 4 | **34** |

**Why this example?** It is the exercise's own scheduling problem; changing it into rider cards would hide the yoke constraint. **How to solve it:** send the two slow cows together, use the two fast cows to return the yoke, and track the bank and elapsed time after every crossing.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Projects, P-6.32–P-6.37

A project needs a complete interface, an invariant that stays true after every operation, and tests for empty, full, wrapped, and partly used states. The small examples here are **design checks**, not replacements for the full project specifications.

<span id="part-3-deques"></span>

### 1. Two deque projects, P-6.32–P-6.33

**P-6.32 — Build an array-backed deque.** Use an array of capacity `c > 0`, a front index `f`, and a live size `n`. Logical item `i` is always at `data[(f+i) % c]` for `0 ≤ i < n`. The four end updates follow directly:

| Method | Index to use | State change |
| :----- | :----------- | :----------- |
| `add_first(e)` | New `f = (f−1) % c` | Write `e` at new `f`; increment `n`. |
| `add_last(e)` | `(f+n) % c` | Write `e` there; increment `n`. |
| `delete_first()` | Old `f` | Return and clear it; advance `f`; decrement `n`. |
| `delete_last()` | `(f+n−1) % c` | Return and clear it; decrement `n`. |

On a full array, allocate a larger array, copy the `n` live elements in logical order to indices `0..n−1`, and reset `f=0`. `first`, `last`, and both deletions raise `Empty` when `n=0`. End operations are `O(1)` except a resizing insertion, which is `O(n)` worst case and `O(1)` amortized with geometric growth.

**Why this example?** Start with a three-slot array, append `MARC` and `FABIO`, remove Marc, append `RAUL`, then prepend `MARCO`. The logical deque is `[MARCO,FABIO,RAUL]` after the front wraps. Appending `PEDRO` triggers a resize; the copied order must be `[MARCO,FABIO,RAUL,PEDRO]`. **How to solve it:** use the formula for logical item `i` before and after each operation; never infer the front from physical index zero.

**P-6.33 — Extend the array deque to `collections.deque` behavior.** Keep the P-6.32 invariant and support the table's public behaviors: `len`, `appendleft`, `append`, `popleft`, `pop`, front/back and arbitrary indexed get, indexed set, `clear`, `rotate(k)`, `remove(e)`, and `count(e)`. Accept optional `maxlen`. When a bounded deque is full, `appendleft` evicts the old rightmost item and `append` evicts the old leftmost item; `maxlen=0` silently keeps the deque empty. Normalize negative indices and raise `IndexError` for an invalid index. `remove(e)` removes the first equal element or raises `ValueError` if absent.

For `rotate(k)`, normalize `k` modulo `n` when nonempty. Move items end-to-end or use a carefully justified circular-array update; merely changing `f` in an array with vacant slots can expose stale or empty slots. The simple move method is `O(min(|k| mod n, n−(|k| mod n)))` after choosing the shorter direction. `count` and `remove` require a scan, so they are `O(n)`. An arbitrary indexed get/set is `O(1)` with the circular index formula.

**Why this example?** With `maxlen=3`, `[MARC,FABIO,RAUL]` followed by `appendleft(MARCO)` becomes `[MARCO,MARC,FABIO]`: the opposite-end Raúl card is evicted. **How to solve it:** define bounded insertion before writing code, then test each public behavior against Python's `collections.deque` on short sequences, including `maxlen=0`, negative indices, and a wrapped array.

<span id="part-3-evaluator"></span>

### 2. Evaluator and leaky stack, P-6.34–P-6.35

**P-6.34 — Read and evaluate a postfix expression.** Turn C-6.22's stack algorithm into a complete input program. Split whitespace-delimited tokens; recognize signed numbers separately from operator tokens; pop **right then left** for a binary operator; print the one final value. Reject an operator with fewer than two operands, leftover operands, an unknown token, or division by zero. For example, `5 2 + 8 3 - * 4 /` means `(5+2)·(8−3)/4 = 8.75`.

**Why this example?** It uses addition, subtraction, multiplication, and division, so both operand order and final-stack validation are exercised. **How to solve it:** write the token cases, state that the stack contains intermediate numeric results, and trace a short expression before accepting general input. The MotoGP millisecond subtraction in C-6.22 is a simpler first test.

**P-6.35 — Build a fixed-capacity `LeakyStack` for Undo.** Use a circular array with capacity `c > 0`, a bottom index `f`, and live size `n`. Logical bottom-to-top item `i` occupies `data[(f+i) % c]`. If `n<c`, push at `(f+n) % c` and increment `n`. If full, overwrite `data[f]` with the new item and advance `f`; this discards the oldest **bottom** entry and leaves `n=c`. `top` and `pop` address `(f+n−1) % c`; pop clears the slot.

**Why this example?** At capacity three, pushing `MARC`, `FABIO`, `RAUL`, then `MARCO` leaves `[FABIO,RAUL,MARCO]` bottom → top. The newest Undo item survives, while the oldest falls out. **How to solve it:** contrast this with C-6.16's full stack, which raises `Full`; test wraparound and a push after a pop. Reject capacity zero or specify its behavior explicitly.

<span id="part-3-applications"></span>

### 3. FIFO lots and two stacks in one array, P-6.36–P-6.37

**P-6.36 — Calculate capital gain or loss with a queue.** Store each buy as a lot `(remaining_quantity, purchase_price)`, oldest lot at the queue front. Before selling `q` shares, verify that at least `q` are held. Then repeatedly consume `take = min(q, front_quantity)` from the oldest lot, add `take × (sale_price − purchase_price)` to gain, and reduce both `q` and the lot's remaining quantity. Dequeue a lot only when fully consumed. The queue's FIFO rule selects the tax basis; a partial lot stays at the front.

For a small check, buy 2 shares at 20 and 3 at 24, then sell 4 at 30. The gain is `2×(30−20) + 2×(30−24) = 32`; one share from the second lot remains at purchase price 24. Prices here are **synthetic stock prices**, not MotoGP financial facts.

**Why this example?** The sale crosses a lot boundary and leaves a partial lot, exposing the two cases a single-lot example would miss. **How to solve it:** keep quantity and money in separate variables, reject overselling before modifying the queue, and report a negative result as a loss. Use the [queue guide](06-02-queues.md) for FIFO behavior.

**P-6.37 — Share one array between red and blue stacks.** Let red grow rightward from index zero and blue grow leftward from index `N−1`. With red size `r` and blue size `b`, red occupies `[0,r)`, blue occupies `[N−b,N)`, and free cells lie in `[r,N−b)`. Red's top is `data[r−1]`; blue's top is `data[N−b]`. A push checks for collision, writes at its next free end, then increments that stack's size. A pop reads and clears its top slot, then decrements its size. Every operation is `O(1)`.

**Why this example?** In six slots, red pushes `MARC` and `FABIO` while blue pushes `RAUL` and `MARCO`, producing physical slots `[MARC,FABIO,None,None,MARCO,RAUL]`. Their tops are Fabio and Marco, and the two middle slots can be used by either side. **How to solve it:** maintain `r+b ≤ N` and check empty operations separately for each color. The prompt assumes capacity stays strictly larger than the combined size; a collision check still makes an implementation robust.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Worked Practice Notebook

The following small program combines three exercise methods. It swaps the middle two of eight hypothetical rider cards using only a deque and one empty queue (R-6.13), generates all subsets of three cards with a stack and queue (C-6.21), and evaluates Fabio's minus Marc's **Friday Practice** best-lap time in milliseconds as postfix arithmetic (C-6.22/P-6.34).

**Why these examples?** The middle pair is Marc and Fabio, so the swap is easy to inspect; three cards make the `2^3` subset count visible; subtraction checks the postfix operand order. The record values come from the verified Practice table. The card order and the decision to swap it are hypothetical study operations, not official classification changes.

**How to solve the notebook:**

1. Draw the eight cards front → back, with Marc in position four and Fabio in position five. Before transferring the queue back, check that it reads `RAUL, MARCO, PEDRO, FABIO, MARC, JORGE, DIGGIA, ALEX`.
2. Start subset generation with one empty subset. Each popped card doubles the queue's current number of subsets.
3. Convert `1:29.558` and `1:29.426` to 89,558 and 89,426 milliseconds. The postfix tokens `89558 89426 -` must compute `89558 − 89426`, not the reverse.

```python
from collections import deque
from decimal import Decimal, InvalidOperation


# R-6.13: D and Q are the only containers used by the swap.
D = deque(["RAUL", "MARCO", "PEDRO", "MARC",
           "FABIO", "JORGE", "DIGGIA", "ALEX"])
Q = deque()
print("Before:", " → ".join(D))

Q.append(D.popleft())  # first three cards, in order
Q.append(D.popleft())
Q.append(D.popleft())
D.append(D.popleft())  # move Marc temporarily to D's back
Q.append(D.popleft())  # Fabio
Q.append(D.pop())      # Marc
Q.append(D.popleft())  # final three cards, in order
Q.append(D.popleft())
Q.append(D.popleft())
while Q:
    D.append(Q.popleft())
print("After: ", " → ".join(D))


# C-6.21: an explicit stack and queue replace recursive subset generation.
def generate_subsets(items):
    S = list(items)      # list end is the stack top
    Q = deque([()])      # queue begins with the empty subset
    while S:
        item = S.pop()
        old_count = len(Q)
        for _ in range(old_count):
            subset = Q.popleft()
            Q.append(subset)
            Q.append(subset + (item,))
    return list(Q)


subsets = generate_subsets(["MARC", "FABIO", "RAUL"])
print("Subset count:", len(subsets))
print("Marc/Fabio pair exists:",
      any(set(group) == {"MARC", "FABIO"} for group in subsets))


# C-6.22 and P-6.34: the stack holds intermediate numeric values.
def evaluate_postfix(expression):
    values = []
    for token in expression.split():
        if token in {"+", "-", "*", "/"}:
            if len(values) < 2:
                raise ValueError("operator needs two operands")
            right = values.pop()
            left = values.pop()
            if token == "+":
                values.append(left + right)
            elif token == "-":
                values.append(left - right)
            elif token == "*":
                values.append(left * right)
            else:
                if right == 0:
                    raise ZeroDivisionError("division by zero")
                values.append(left / right)
        else:
            try:
                values.append(Decimal(token))
            except InvalidOperation as exc:
                raise ValueError("unknown token: " + token) from exc
    if len(values) != 1:
        raise ValueError("expression must leave one value")
    return values[0]


print("Fabio minus Marc (ms):", evaluate_postfix("89558 89426 -"))
```

```text
Before: RAUL → MARCO → PEDRO → MARC → FABIO → JORGE → DIGGIA → ALEX
After:  RAUL → MARCO → PEDRO → FABIO → MARC → JORGE → DIGGIA → ALEX
Subset count: 8
Marc/Fabio pair exists: True
Fabio minus Marc (ms): 132
```

The queue `Q` is empty after the swap, and every rider card appears exactly once. The subset count checks the include/exclude invariant. The lap-gap result is **132 milliseconds = 0.132 seconds**, matching the cited Practice best laps.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Exercise family | Core method | Check before calling it solved |
| :-------------- | :---------- | :----------------------------- |
| R-6.1–R-6.2, R-6.7–R-6.9, R-6.12 | Trace one call at a time. | Returned values, size, and front index agree with successful operations only. |
| R-6.3–R-6.6, R-6.13–R-6.14 | Use LIFO/FIFO transfers deliberately. | The final order is right and only the allowed temporary structure was used. |
| C-6.15–C-6.23 | State the choice, recursion replacement, or operand-order invariant. | Count `n!` permutations or `2^n` subsets; check parsing and group order. |
| C-6.24–C-6.29 | Implement one ADT with another and track physical indices. | Empty/full behavior, restoration, and worst-case versus amortized costs are explicit. |
| C-6.30–C-6.31 | Keep the original probability and bridge rules. | Random assumptions are stated; every crossing and return is accounted for. |
| P-6.32–P-6.37 | Define state, invariant, and boundary behavior first. | Wraparound, eviction, partial lots, and two-stack collision cases are tested. |

The same rider card can be first from a queue, last from a stack, or removable from either end of a deque. That difference comes from the **operation rules**, not from the rider's Practice position. For the exact wording and restrictions of every exercise, return to the [Section 6.4 PDF](../../file/Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C06.pdf).

[🔝 Back to Top](#top)
