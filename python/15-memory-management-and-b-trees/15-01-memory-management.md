<span id="top"></span>

# 15.1 Memory Management — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 15, Section 15.1, printed pages 698–704 ([supplied PDF](../Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C15.pdf)).<br>
> **Topic:** 15.1 Memory Management; 15.1.1 Memory Allocation; 15.1.2 Garbage Collection; 15.1.3 Additional Memory Used by the Python Interpreter.<br>
> **Domain Focus:** A display board made of rectangles; their areas, references to them, and the memory needed while calculating a total area.<br>
> **User Prompt:** Reexplain [`Section 15.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rectangle Display Board](#background)
   - [1. The geometry problem](#background-geometry)
   - [2. Two different kinds of space](#background-space)
2. [Part 1: 15.1 Memory Management](#part-1)
   - [1. Words and addresses](#part-1-addresses)
   - [2. The three jobs of memory management](#part-1-jobs)
3. [Part 2: 15.1.1 Memory Allocation](#part-2)
   - [1. Objects in the memory heap](#part-2-heap)
   - [2. Free blocks and fragmentation](#part-2-fragmentation)
   - [3. Internal versus external fragmentation](#part-2-types)
   - [4. Four ways to choose a free block](#part-2-fit)
4. [Part 3: 15.1.2 Garbage Collection](#part-3)
   - [1. Reachable objects and roots](#part-3-roots)
   - [2. Reference counting](#part-3-counting)
   - [3. Why cycles need another check](#part-3-cycles)
   - [4. The textbook's mark-sweep model](#part-3-mark-sweep)
   - [5. Searching with little spare memory](#part-3-in-place)
5. [Part 4: 15.1.3 Additional Memory Used by the Python Interpreter](#part-4)
   - [1. The run-time call stack](#part-4-call-stack)
   - [2. Recursion and a total-area calculation](#part-4-recursion)
   - [3. The operand stack](#part-4-operand-stack)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rectangle Display Board

<span id="background-geometry"></span>

### 1. The geometry problem

Imagine planning a display board with three rectangular panels. Each panel has a width and a height in centimetres. We want to keep the panels in a program and find their combined area.

| Panel | Width | Height | Area = width × height |
| :---- | ----: | -----: | --------------------: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 3 cm | 4 cm | 12 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

The total is **6 + 12 + 16 = 34 cm²**. We will keep using these same panels while we ask how a program stores them, how it stops storing old panels, and what it needs while computing `34`.

<span id="background-space"></span>

### 2. Two different kinds of space

A panel's **area** is physical area on the display board, measured in cm². Its **memory usage** is computer storage, measured in bytes or memory words. A 16 cm² panel does not automatically use more memory than a 6 cm² panel: both can be represented by the same kind of object containing two dimensions.

| Geometry idea | Memory idea used below |
| :------------ | :--------------------- |
| A panel has dimensions and an area. | An object stores data about that panel. |
| The board keeps a panel in the design. | A live reference lets the program reach the panel object. |
| An old design is discarded. | Its objects may become unreachable and eligible for reclamation. |
| Several areas are added. | Function calls and intermediate results need temporary storage. |

The numbered memory slots in the allocation examples are **toy units** for studying contiguous blocks. They are not actual Python object sizes or a map of where the displayed rectangles sit.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 15.1 Memory Management

<span id="part-1-addresses"></span>

### 1. Words and addresses

The book begins with a simplified view of computer memory: a long sequence of **words**, each with an **address**. If there are `N` words, their word addresses run from `0` through `N − 1`. A word commonly contains several bytes. Its address tells the computer which storage location to use.

For a small model with `N = 16` words of 8 bytes each, there are `16 × 8 = 128` bytes in all, and the **word addresses** are `0` through `15`. The example is only to make the array-like layout concrete; actual byte addressing and memory hardware are more involved.

```text
word address:  0   1   2   3   4   5   ...  15
memory:      [ ][ ][ ][ ][ ][ ] ... [ ]
```

<span id="part-1-jobs"></span>

### 2. The three jobs of memory management

When the program creates a panel object, storage must be **allocated** for it. When the program can no longer reach an old panel, that storage can be **reclaimed**. While the program runs, the interpreter also needs room for things such as active function calls and intermediate calculations. Sections 15.1.1, 15.1.2, and 15.1.3 explain these jobs in that order.

> **Mental model:** Memory management answers three questions: Where can a new object go? When can an old object's space be reused? What temporary space is needed to run the calculation?

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 15.1.1 Memory Allocation

<span id="part-2-heap"></span>

### 1. Objects in the memory heap

Python objects live in a managed pool called the **memory heap**. This is a storage region, not the *heap* data structure used for priority queues in Chapter 9. Creating a rectangle asks the interpreter to arrange storage for a new object:

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


panel_a = Rectangle(2, 3)
print(panel_a.area())  # 6
```

`panel_a` is a name that refers to the rectangle object. The code does not choose its memory address. The interpreter works with the operating system and its own memory manager to find space.

<span id="part-2-fragmentation"></span>

### 2. Free blocks and fragmentation

An allocator can track unused **contiguous** stretches of memory, or **holes**, in a *free list*. In the book's simple model, the holes themselves can store the links that join this list. Suppose an illustrative 20-slot memory pool looks like this:

```text
addresses:  00 01 02 03 | 04 05 06 07 | 08 09 10 11 | 12 13 14 15 16 17 18 19
state:       A  A  A  A |  .  .  .  . |  B  B  B  B |  .  .  .  .  .  .  .  .
```

`A` and `B` mean allocated blocks; `.` means a free slot. The free list has one hole of **4** slots (`04`–`07`) and another of **8** slots (`12`–`19`). Although **4 + 8 = 12** slots are free, a request for **9 consecutive slots** fits in neither hole. The free space is **fragmented**. These block labels are only storage examples; they do not claim that geometry panel `A` really occupies four slots.

<span id="part-2-types"></span>

### 3. Internal versus external fragmentation

**Internal fragmentation** is unused space *inside* a block already allocated. For example, imagine reserving capacity for **8** rectangle records but filling only **3**. The unused part is **8 − 3 = 5 record slots**. The allocated block is larger than the current need.

**External fragmentation** is free space split into separate holes around allocated blocks. The 4-slot and 8-slot holes above are outside `A` and `B`, but neither is large enough for a 9-slot request. The distinction is where the unusable space lies:

| Type | Where is the unused space? | Rectangle-board example |
| :--- | :-------------------------- | :---------------------- |
| Internal | Inside a reserved block. | Capacity for 8 records; only 3 used. |
| External | In separate free holes among used blocks. | Free holes of 4 and 8 slots cannot serve a 9-slot request. |

<span id="part-2-fit"></span>

### 4. Four ways to choose a free block

The book compares four **heuristics** for choosing a hole. Imagine the free list is ordered as `H1 = 10`, `H2 = 7`, `H3 = 12`, and `H4 = 9` slots. A new panel record needs **6** slots. For next-fit, suppose the search resumes at `H4`.

| Heuristic | Rule | Hole chosen | Slots left in that hole |
| :-------- | :--- | :---------- | ----------------------: |
| **Best-fit** | Find the smallest hole that is large enough. | `H2` (7) | `7 − 6 = 1` |
| **First-fit** | Scan from the start; take the first large enough. | `H1` (10) | `10 − 6 = 4` |
| **Next-fit** | Resume the scan where the previous one stopped; wrap around if needed. | `H4` (9) | `9 − 6 = 3` |
| **Worst-fit** | Take the largest available hole. | `H3` (12) | `12 − 6 = 6` |

The requested six slots become allocated, and the remainder stays free. A small immediate remainder does **not** prove a policy is best over many requests: best-fit can leave many tiny holes; first-fit can crowd the start of the list; next-fit spreads its choices but may make a later large request harder; worst-fit tries to avoid repeatedly leaving very small remainders. Search effort and future fragmentation both matter. A size-prioritized structure could help find a largest hole for worst-fit.

These are **textbook allocation strategies**, not a claim that a current Python interpreter uses any one of them for `Rectangle` objects. Python's actual memory manager can have several layers and object-specific policies ([Python memory-management documentation](https://docs.python.org/3/c-api/memory.html#overview)).

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 15.1.2 Garbage Collection

Garbage collection is the process of finding objects the program can no longer reach and making their storage available for reuse. In languages such as C and C++, programmers may need to release allocated storage explicitly; Python manages object reclamation automatically. The key question is **reachability**, not whether a variable's name still sounds useful.

<span id="part-3-roots"></span>

### 1. Reachable objects and roots

The book calls objects referred to directly by names in active namespaces **root objects**. An object is **live** if a root reaches it directly or through references stored in other live objects. The reachability chain can be longer than one step.

```python
canvas = []
panel_a = Rectangle(2, 3)
canvas.append(panel_a)
del panel_a
print(canvas[0].area())  # 6
```

After `del panel_a`, the name is gone, yet `canvas` still refers to the list, and the list still refers to the rectangle. The rectangle remains live:

```text
active name canvas → list → Rectangle(2, 3)
```

If the program also removes the last reachable path to the rectangle, it becomes eligible for reclamation. `del` removes a binding or container entry; it is not a command to free an object unconditionally.

<span id="part-3-counting"></span>

### 2. Reference counting

In the reference-counting model, an object has a count of references pointing to it. Adding a reference raises the count; removing or replacing one lowers it. If the count reaches **zero**, there is no path to that object, so its storage can be reclaimed. Maintaining one count uses **O(1) extra space per object**, and changing it takes **O(1) time per reference update** in the book's model.

The rectangle in `canvas[0]` above still has a reference after `del panel_a`, so removing the name alone cannot make its count zero. In CPython, `sys.getrefcount(object)` can inspect a count, but the call itself adds a temporary reference, and implementation details can affect the displayed number. Use the reachability diagram to reason about this case rather than expecting a fixed printed count.

<span id="part-3-cycles"></span>

### 3. Why cycles need another check

Suppose two neighboring panels point to one another so a drawing tool can move left or right:

```python
class Panel:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.neighbor = None


left = Panel(2, 3)    # area 6 cm²
right = Panel(3, 4)   # area 12 cm²
left.neighbor = right
right.neighbor = left
canvas = left

left = None
right = None
canvas = None
```

Before the last assignment, `canvas → left panel ↔ right panel` is a live chain. After `canvas = None`, neither panel is reachable from an active name. Yet each panel still has an incoming reference from the other, so **neither count reaches zero just because the roots disappeared**. Reference counting alone misses this unreachable cycle.

The panels' geometry is still `6 + 12 = 18 cm²`; the arithmetic has no effect on whether they are live. Reachability depends on reference arrows.

<span id="part-3-mark-sweep"></span>

### 4. The textbook's mark-sweep model

The book presents **mark-sweep** as a classic way to find unreachable objects. Treat objects as vertices in a directed graph and references as arrows. In this textbook model, collection pauses the program, performs these steps, and then resumes it:

1. **Clear marks.** Start with all allocated objects unmarked.
2. **Mark from roots.** Follow every reference from active roots, using a graph traversal such as depth-first search (DFS). Mark each reached object.
3. **Sweep.** Scan the heap and reclaim unmarked objects.

Imagine that a new `Panel(4, 4)` remains in the current canvas while the old two-panel cycle above has lost all root paths. The new panel is marked and kept. The old cycle is unmarked and can be reclaimed, even though its two internal arrows still exist.

For a simple cost model, let `V` be the number of reachable objects, `E` their references examined during marking, and `H` the amount of heap scanned during sweeping. The work is **O(V + E + H)**. Reclamation may also be paired with an optional compaction step that moves live blocks together and reduces external fragmentation; a basic sweep alone does not promise that all free holes merge.

**Mark-sweep is an algorithmic model in the textbook.** Do not assume it describes the exact collector used by every Python implementation. CPython combines reference counting with a cycle detector; the `gc` module exposes controls for cyclic collection ([Python design FAQ](https://docs.python.org/3/faq/design.html#how-does-python-manage-memory)).

<span id="part-3-in-place"></span>

### 5. Searching with little spare memory

Ordinary recursive DFS remembers its path on a call stack. For a long chain of `V` reachable objects, this can require **O(V) extra space** just when a collector is short of memory. The book therefore sketches an **in-place DFS** idea: temporarily redirect a reference along the path so it records where to return, then restore that reference while backtracking. This simulates a recursion stack with only **O(1) auxiliary storage** in the textbook's model.

For our panels, imagine tracing `canvas → panel A → panel B`. An in-place traversal would use and restore those reference links while it walks. The book sketches this idea assuming the collector can identify which redirected link to restore on the way back. This is an internal collector technique, **not** Python code you should apply to your panel objects. The important tradeoff is that the traversal must still visit the live objects but cannot rely on a large separate stack.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 15.1.3 Additional Memory Used by the Python Interpreter

The heap holds the rectangle objects, but execution needs other working storage. The section highlights two different stacks: one for **active function calls** and one for **operands and intermediate results**.

<span id="part-4-call-stack"></span>

### 1. The run-time call stack

Each active function invocation has an **activation record**, or **frame**, on a call stack. The top frame belongs to the function currently running. A caller's frame remains below it while waiting for the callee to return. In the book's model, a frame keeps the call's local names and parameters, a reference to the function definition, and a **program counter** that identifies where execution should resume. The local names may refer to objects in the heap; the stack does not need to copy every rectangle object.

```text
top:    function currently calculating
        caller waiting for its result
bottom: first active call
```

When a function is called, its frame is pushed. When it returns, that frame is popped and execution resumes in the waiting caller.

<span id="part-4-recursion"></span>

### 2. Recursion and a total-area calculation

The book illustrates call-stack growth with factorial. We can use the same mechanism to add the areas of our three rectangles. Here the dimension pairs represent panels `A`, `B`, and `C` from the background:

```python
def total_area(rectangles, i=0):
    if i == len(rectangles):
        return 0
    width, height = rectangles[i]
    return width * height + total_area(rectangles, i + 1)


rectangles = [(2, 3), (3, 4), (4, 4)]
print(total_area(rectangles))  # 34
```

Each call has its **own** `i` and waits for the next call's result. Each call receives a reference to the same `rectangles` list object; this version does not make a new list slice at every level.

| Call frame | Area held pending | What happens next |
| :--------- | ----------------: | :---------------- |
| `i = 0` | `2 × 3 = 6` | Wait for `i = 1`. |
| `i = 1` | `3 × 4 = 12` | Wait for `i = 2`. |
| `i = 2` | `4 × 4 = 16` | Wait for `i = 3`. |
| `i = 3` | `0` | Base case returns `0`. |

Unwinding gives `16 + 0 = 16`, then `12 + 16 = 28`, then `6 + 28 = 34 cm²`. For `n` panels, this pattern reaches `n + 1` active calls at its deepest point, so its call-stack use grows as **O(n)**. A simple loop could add these areas with fewer active frames, but recursion makes the stack's purpose visible.

<span id="part-4-operand-stack"></span>

### 3. The operand stack

An **operand stack** holds values while an arithmetic expression is evaluated. Suppose a rectangle grows from width `2` by `1` cm and from height `3` by `1` cm. Its new area is **(2 + 1) × (3 + 1) = 3 × 4 = 12 cm²**.

```python
base_width, extra_width = 2, 1
base_height, extra_height = 3, 1
new_area = (base_width + extra_width) * (base_height + extra_height)
print(new_area)  # 12
```

The book's stack model can be traced like this; the rightmost value is on top:

| Conceptual step | Operand stack afterward |
| :-------------- | :---------------------- |
| Push width values `2`, `1`. | `[2, 1]` |
| Add them; push `3`. | `[3]` |
| Push height values `3`, `1`. | `[3, 3, 1]` |
| Add the height values; push `4`. | `[3, 4]` |
| Multiply the two results. | `[12]` |

The **call stack** remembers which function calls are active; the **operand stack** handles values inside an expression. This trace explains the idea, not a promise about the exact bytecode or stack operations of every Python version.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why can a new panel record fail to fit when free space remains?</strong></summary>

**Scenario:** The board program's toy memory pool has two free holes of 3 and 6 slots. A new record needs 7 contiguous slots.

**Problem:** There are `3 + 6 = 9` free slots altogether, but the largest single hole has only 6.

**Result:** The 7-slot request cannot fit in this pool without rearranging memory or obtaining more space. This is **external fragmentation**, not a calculation about the panel's area.

</details>

<details>
<summary><strong>Case Study 2: Is a rectangle gone when its short name is deleted?</strong></summary>

**Scenario:** `gallery = [Rectangle(4, 4)]`, then `featured = gallery[0]`, then `del featured`.

**Problem:** The short name disappeared, but `gallery[0]` still refers to the 4 × 4 rectangle.

**Result:** The rectangle remains reachable and its area can still be calculated as **16 cm²**. Removing a name does not erase another reference.

</details>

<details>
<summary><strong>Case Study 3: Why can two discarded panels keep nonzero counts?</strong></summary>

**Scenario:** The 2 × 3 and 3 × 4 panels each store a reference to the other. Every active name that reaches either panel is removed.

**Problem:** Their mutual references keep both counts above zero even though neither panel is reachable from a root.

**Result:** Reference counting alone misses the pair. A cycle detector or a tracing collector can recognize that the old **18 cm²** design is no longer reachable.

</details>

<details>
<summary><strong>Case Study 4: How much stack does a two-panel recursive total need?</strong></summary>

**Scenario:** Use the `total_area` function on panels `(2, 3)` and `(3, 4)`.

**Problem:** The first call waits for the second, and the second waits for the base case.

**Result:** At the deepest point there are **3 frames** (`i = 0`, `1`, `2`). They unwind to `0 + 12 + 6 = 18 cm²`. The number of frames grows with the number of panels.

</details>

<details>
<summary><strong>Case Study 5: Which stack holds an intermediate area value?</strong></summary>

**Scenario:** Compute `(2 + 2) * (3 + 1)` for an enlarged rectangle.

**Problem:** The two sums, `4` and `4`, must be available before multiplication.

**Result:** The textbook's **operand-stack** model holds those intermediate values and produces **16 cm²**. A call-stack frame instead tracks the active function evaluating the expression.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 15.1 idea | Plain-language meaning | Rectangle-board connection |
| :---------------- | :--------------------- | :------------------------- |
| **Addressed words** | Memory locations have addresses. | A rectangle object's data must occupy storage somewhere. |
| **Memory heap** | Managed storage for Python objects. | Creating a panel needs object storage. |
| **Free list** | Tracks available contiguous blocks in the textbook model. | A new record must fit in one suitable hole. |
| **Internal fragmentation** | Unused capacity inside an allocated block. | Reserve 8 records but fill only 3. |
| **External fragmentation** | Free space split into separate holes. | Holes of 4 and 8 cannot satisfy a 9-slot request. |
| **Fit heuristics** | Different rules select a hole. | A 6-slot request can leave different remainders. |
| **Live object** | Reachable from an active root, directly or indirectly. | `canvas → list → rectangle` keeps the rectangle live. |
| **Reference counting** | Tracks incoming references; zero means unreachable. | Deleting one name need not remove the list's reference. |
| **Cycle detection / mark-sweep** | Finds objects that remain mutually linked but have no root path. | Discarded neighboring panels can be reclaimed. |
| **Call stack** | Tracks active function invocations. | Recursive total area has one frame per level plus a base case. |
| **Operand stack** | Holds intermediate values during expression evaluation. | `(2 + 1) × (3 + 1)` produces `12`. |

[🔝 Back to Top](#top)
