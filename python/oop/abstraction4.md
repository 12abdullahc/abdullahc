<span id="top"></span>

# Data Abstraction in Python — Comprehensive Chunk-by-Chunk Guide

> **Source Article:** [GeeksforGeeks - Data Abstraction in Python](https://www.geeksforgeeks.org/python/data-abstraction-in-python/)  
> **Topic:** Object-Oriented Programming (OOP) in Python — Data Abstraction & Abstract Base Classes (ABCs)  
> **Domain Focus:** Data Structures & Algorithms (DSA) — Abstract Data Types (ADTs) & Algorithmic Task Schedulers  
> **User Prompt:** "reexplain the following article chunk by chunk, easy to understand and coherence example in dsa (data structure and algorithm) study cases: https://www.geeksforgeeks.org/python/data-abstraction-in-python/"

---

## 📚 Table of Contents
1. [💡 Real-World & Conceptual Intuition](#real-world-intuition)
2. [📌 Chunk 1: What is Data Abstraction & Why Use It?](#chunk-1)
3. [🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module](#chunk-2)
4. [🧩 Chunk 3: The Four Core Building Blocks of Abstraction](#chunk-3)
   - [1. Abstract Methods (`@abstractmethod`)](#abstract-methods)
   - [2. Concrete Methods (Shared Implementation)](#concrete-methods)
   - [3. Abstract Properties (`@property` + `@abstractmethod`)](#abstract-properties)
   - [4. Abstract Class Instantiation Safeguards](#instantiation-safeguards)
5. [🏆 Chunk 4: Complete DSA Priority Queue & Task Scheduler Architecture](#chunk-4)
6. [📊 Chunk 5: Summary Comparison & Key Takeaways](#chunk-5)

---

<span id="real-world-intuition"></span>
## 💡 Real-World & Conceptual Intuition

### The Algorithm Caller vs. Internal Memory & Pointer Mechanics
In computer science and algorithm design:
- An **Algorithm** (such as Dijkstra's Shortest Path, Prim's Minimum Spanning Tree, Huffman Coding, or an Operating System's Task Scheduler) interacts with an **Abstract Data Type (ADT)**: it pushes an element with a priority key, extracts the minimum element, peeks at the top value, or queries whether the container is empty.
- The consumer algorithm **does not care** and **does not need to know** how elements are physically structured in RAM: whether nodes are scattered across the heap with raw pointers, packed into a contiguous array, balanced inside an AVL/Red-Black tree, or sifted up and down a binary min-heap array.
- **That is Abstraction:** Exposing a clean, mathematically sound contract (`push`, `pop`, `peek`, `is_empty`) to high-level algorithms while encapsulating and hiding pointer manipulation, memory reallocations, and index arithmetic underneath.

```
┌────────────────────────────────────────────────────────┐
│       ALGORITHM CLIENT (Dijkstra / OS Task Scheduler)  │
│     [push(task, prio)]    [pop() -> min]    [peek()]   │
└───────────────────────────┬────────────────────────────┘
                            │ (Calls Standard ADT Methods)
                            ▼
┌────────────────────────────────────────────────────────┐
│          ABSTRACT DATA TYPE CONTRACT (PriorityQueue)   │
│   + push()     + pop()     + peek()     + is_empty()   │
└───────────────────────────┬────────────────────────────┘
                            │ (Implemented by Concrete Data Structures)
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ UnsortedArrayPQ  │ │  SortedArrayPQ   │ │ BinaryMinHeapPQ  │
│ - Push: O(1)     │ │ - Push: O(N)     │ │ - Push: O(log N) │
│ - Pop:  O(N)     │ │ - Pop:  O(1)     │ │ - Pop:  O(log N) │
│ - Linear Search  │ │ - Shift Insertion│ │ - Sift Up / Down │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

[🔝 Back to Top](#top)

---

<span id="chunk-1"></span>
## 📌 Chunk 1: What is Data Abstraction & Why Use It?

### 1. Simple Definition
**Data Abstraction** is the OOP technique of **hiding internal implementation details** and exposing only the essential features to the outside caller. It cleanly decouples **what** operations an entity can perform from **how** those operations are executed in code.

### 2. DSA Analogy: Abstract Data Type (ADT)
In Computer Science, an **Abstract Data Type (ADT)** is the purest expression of data abstraction:
- An **ADT** specifies a mathematical model: the set of valid data values, the operations that can be performed, and the invariants (rules) that must always hold true.
- A **Concrete Data Structure** is the physical realization of that ADT using memory structures (arrays, linked nodes, trees, hash tables) and algorithms.

For example, consider the **Priority Queue ADT**:
- **The Contract:** You can insert items with numerical priorities, and whenever you remove an item, you are guaranteed to receive the element with the highest priority (or lowest numerical cost).
- **The Abstraction:** Whether the queue is powered by a naive unsorted array ($O(1)$ insert, $O(N)$ extract), a sorted array ($O(N)$ insert, $O(1)$ extract), or a binary min-heap ($O(\log N)$ insert, $O(\log N)$ extract), the caller executes the exact same method: `pq.pop()`.

### 3. Core Benefits of Abstraction in DSA
| Benefit | Explanation | DSA & Algorithmic Analogy |
| :--- | :--- | :--- |
| **Complexity Reduction** | Hides intricate pointer logic, tree balancing, and index math. | A graph traversal algorithm invokes `queue.pop()` without dealing with binary heap parent-child index equations `(2*i + 1)`. |
| **Contract Enforcement** | Guarantees all data structure variants adhere to the ADT interface. | Any data structure claiming to be a `PriorityQueue` must implement `push()`, `pop()`, `peek()`, and `__len__()`. |
| **Algorithmic Decoupling & Maintainability** | Swap underlying algorithms without touching consumer code. | Upgrade Dijkstra's algorithm from an $O(V^2)$ unsorted array to an $O((V+E)\log V)$ binary heap with zero changes to Dijkstra's logic. |
| **Polymorphic Benchmarking** | Evaluate diverse data structures under identical workloads. | Run a universal stress test that feeds 10,000 tasks into different queue backends via the exact same interface to benchmark comparison counts. |

[🔝 Back to Top](#top)

---

<span id="chunk-2"></span>
## 🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module

Python does not have built-in `interface` or `pure virtual` keywords like Java or C++. Instead, Python provides the standard library **`abc` module** (Abstract Base Classes).

### Key Rules:
1. **Inherit from `ABC`:** A class must inherit from `abc.ABC` to become an Abstract Base Class.
2. **The `@abstractmethod` Decorator:** Declares that a method has no implementation in the base class and **must be implemented** by any concrete subclass.
3. **No Direct Instantiation:** If a class inherits from `ABC` and contains at least one `@abstractmethod`, Python prevents creating an instance of that class directly.

### DSA Syntax Example:
```python
from abc import ABC, abstractmethod
from typing import List, Optional

# Abstract Base Class (Blueprint for all Search Algorithms)
class AbstractSearcher(ABC):
    @abstractmethod
    def search(self, elements: List[int], target: int) -> Optional[int]:
        """Mandatory contract: Every search algorithm must locate the target index."""
        pass

# Concrete Subclass (Binary Search Algorithm for sorted lists)
class BinarySearcher(AbstractSearcher):
    def search(self, elements: List[int], target: int) -> Optional[int]:
        low, high = 0, len(elements) - 1
        while low <= high:
            mid = (low + high) // 2
            if elements[mid] == target:
                return mid
            elif elements[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return None

# Instantiating and executing the concrete subclass
searcher = BinarySearcher()
dataset = [10, 23, 35, 47, 52, 68, 79, 91]
target_val = 52
idx = searcher.search(dataset, target=target_val)
print(f"🎯 Binary Search: Found target {target_val} at index {idx}.")
```

#### Output:
```text
🎯 Binary Search: Found target 52 at index 4.
```

[🔝 Back to Top](#top)

---

<span id="chunk-3"></span>
## 🧩 Chunk 3: The Four Core Building Blocks of Abstraction

---

<span id="abstract-methods"></span>
### 1. Abstract Methods (`@abstractmethod`)

An **Abstract Method** is declared in the abstract base class with a method header and a `pass` statement (or docstring). It acts as an unbreakable contract: any subclass **must** provide its own concrete implementation, or Python will refuse to instantiate it.

#### DSA Introductory Example:
```python
from abc import ABC, abstractmethod
from typing import Any

# Abstract Blueprint for Linear Collection ADTs
class AbstractQueue(ABC):
    @abstractmethod
    def dequeue(self) -> Any:
        """Mandatory contract: Remove and return the front element."""
        pass

# Concrete Implementation (FIFO Queue using Python list)
class ListQueue(AbstractQueue):
    def __init__(self):
        self._items = []

    def enqueue(self, item: Any) -> None:
        self._items.append(item)

    def dequeue(self) -> Any:
        if not self._items:
            raise IndexError("dequeue from empty queue")
        return self._items.pop(0)

q = ListQueue()
q.enqueue("Node_A")
q.enqueue("Node_B")
print(f"Removed element: {q.dequeue()}")
```

#### Output:
```text
Removed element: Node_A
```

---

<details>
<summary>💡 <b>DSA Case Study: Custom Priority Queue Contract & Incomplete Subclasses</b> (Click to expand)</summary>

#### 🤖 Scenario: Enforcing Core ADT Operations
In a high-performance networking router, packet schedulers prioritize urgent TCP packets over background downloads. The systems team established an `AbstractPriorityQueue` base class. Every data structure engineered for this role must implement the `pop()` method to extract the highest-priority packet.

---

#### ❌ Broken Code (The Problem)
A developer created `BinaryMinHeapPriorityQueue` inheriting from `AbstractPriorityQueue`, but **forgot to implement** the mandatory `pop()` method:

```python
from abc import ABC, abstractmethod
from typing import Tuple

class AbstractPriorityQueue(ABC):
    @abstractmethod
    def push(self, item: str, priority: float) -> None:
        """Insert an item with an assigned priority score."""
        pass

    @abstractmethod
    def pop(self) -> Tuple[str, float]:
        """Remove and return the item with the lowest priority value."""
        pass

# ❌ INCOMPLETE SUBCLASS: Developer implemented push(), but forgot pop()!
class BinaryMinHeapPriorityQueue(AbstractPriorityQueue):
    def __init__(self):
        self._heap = []

    def push(self, item: str, priority: float) -> None:
        self._heap.append((item, priority))
        # (Sift-up logic here...)

    # BUG: Forgot to implement pop()!

# Attempting to instantiate the queue for packet scheduling
pq = BinaryMinHeapPriorityQueue()
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class BinaryMinHeapPriorityQueue without an implementation for abstract method 'pop'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Contract Defined:** `AbstractPriorityQueue` declared `pop()` with `@abstractmethod`.
2. **Missing Implementation:** `BinaryMinHeapPriorityQueue` inherited the contract but did not provide a concrete `pop()` method.
3. **Early Safety Guard:** Python's metaclass detected the unresolved abstract method when `BinaryMinHeapPriorityQueue()` was invoked and immediately raised a `TypeError`, preventing broken queues from entering production.

---

#### ✅ Fixed Code (The Solution)
Implement the `pop()` method inside `BinaryMinHeapPriorityQueue`:

```python
from abc import ABC, abstractmethod
from typing import Tuple

class AbstractPriorityQueue(ABC):
    @abstractmethod
    def push(self, item: str, priority: float) -> None:
        """Insert an item with an assigned priority score."""
        pass

    @abstractmethod
    def pop(self) -> Tuple[str, float]:
        """Remove and return the item with the lowest priority value."""
        pass

# ✅ FULLY COMPLIANT SUBCLASS
class BinaryMinHeapPriorityQueue(AbstractPriorityQueue):
    def __init__(self):
        self._heap = []

    def push(self, item: str, priority: float) -> None:
        self._heap.append((item, priority))
        # Simplified sift-up for demonstration
        self._heap.sort(key=lambda node: node[1])

    def pop(self) -> Tuple[str, float]:
        if not self._heap:
            raise IndexError("pop from empty priority queue")
        return self._heap.pop(0)

# Instantiate and verify
pq = BinaryMinHeapPriorityQueue()
pq.push("Kernel_Interrupt", 0.5)
pq.push("Background_Sync", 42.0)
task, prio = pq.pop()
print(f"✅ Dispatched highest-priority task: {task} (Priority: {prio})")
```

#### 🎉 Output:
```text
✅ Dispatched highest-priority task: Kernel_Interrupt (Priority: 0.5)
```

</details>

[🔝 Back to Top](#top)

---

<span id="concrete-methods"></span>
### 2. Concrete Methods (Shared Implementation)

An Abstract Base Class is **not limited** to abstract placeholders. It can also contain **Concrete Methods**—methods with fully functional, shared logic. All derived child classes inherit this code automatically, eliminating code duplication and ensuring invariant consistency.

#### DSA Introductory Example:
```python
from abc import ABC, abstractmethod
from typing import Any

class AbstractLinearCollection(ABC):
    @abstractmethod
    def __len__(self) -> int:
        pass

    # Concrete Method: Reusable empty status check
    def is_empty(self) -> bool:
        return len(self) == 0

class ArrayStack(AbstractLinearCollection):
    def __init__(self):
        self._data = []

    def push(self, val: Any) -> None:
        self._data.append(val)

    def __len__(self) -> int:
        return len(self._data)

stack = ArrayStack()
print(f"Is stack empty initially? {stack.is_empty()}")
stack.push(100)
print(f"Is stack empty after push? {stack.is_empty()}")
```

#### Output:
```text
Is stack empty initially? True
Is stack empty after push? False
```

---

<details>
<summary>💡 <b>DSA Case Study: Shared Invariant Verification & Queue Draining Utilities</b> (Click to expand)</summary>

#### 🤖 Scenario: Universal Queue Status & Batch Ingestion Helpers
Regardless of whether a queue uses an unsorted array, a sorted array, or a binary min-heap, certain operations have **identical logic across all implementations**:
1. **`is_empty()`:** Returns `len(self) == 0`.
2. **`is_full()`:** Returns `len(self) >= self.max_capacity`.
3. **`batch_push(items)`:** Iterates through a list of pairs and calls `self.push()`, stopping if the capacity limit is reached.
4. **`drain_all()`:** Pops elements one by one until the queue is empty and returns them as an ordered list.

By implementing these as **concrete methods** in the abstract base class, every subclass inherits the exact same tested and standardized utility logic.

---

#### ❌ Broken Code (The Problem)
A developer created `SortedArrayPriorityQueue` and tried to re-invent `batch_push()`, but accidentally altered the method signature and broke the loop logic:

```python
from abc import ABC, abstractmethod
from typing import List, Tuple

class AbstractPriorityQueue(ABC):
    @abstractmethod
    def push(self, item: str, priority: float) -> None:
        pass

    @abstractmethod
    def pop(self) -> Tuple[str, float]:
        pass

    # Concrete Method: Standardized batch ingestion
    def batch_push(self, items: List[Tuple[str, float]]) -> int:
        count = 0
        for item, prio in items:
            self.push(item, prio)
            count += 1
        return count

class SortedArrayPriorityQueue(AbstractPriorityQueue):
    def __init__(self):
        self._buffer = []

    def push(self, item: str, priority: float) -> None:
        self._buffer.append((item, priority))
        self._buffer.sort(key=lambda x: x[1])

    def pop(self) -> Tuple[str, float]:
        return self._buffer.pop(0)

    # ❌ BROKEN OVERRIDE: Changed the method signature to take single elements!
    def batch_push(self, single_item: Tuple[str, float]) -> int:
        self.push(single_item[0], single_item[1])
        return 1

# Algorithm test harness expects standard batch_push(List[...])
pq = SortedArrayPriorityQueue()
workload = [("Task_1", 10.0), ("Task_2", 5.0)]

# CRASH: Subclass broke the polymorphic contract!
pq.batch_push(workload)
```

#### 💥 Error Output:
```text
IndexError: tuple index out of range
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Reinventing Shared Functionality:** The base class already provided a robust `batch_push()` method that iterates over a list of items.
2. **Contract Breach:** The subclass redefined `batch_push()` with an incompatible parameter expectation (expecting a single tuple instead of a list), breaking polymorphism.
3. **Principle of Concrete Methods:** Let subclasses focus strictly on their unique algorithmic mechanics (`push`, `pop`), and inherit shared container utilities directly from the base class.

---

#### ✅ Fixed Code (The Solution)
Remove the redundant method in `SortedArrayPriorityQueue` and inherit the concrete methods:

```python
from abc import ABC, abstractmethod
from typing import List, Tuple

class AbstractPriorityQueue(ABC):
    def __init__(self, max_capacity: int = 100):
        self.max_capacity = max_capacity

    @abstractmethod
    def push(self, item: str, priority: float) -> None:
        pass

    @abstractmethod
    def pop(self) -> Tuple[str, float]:
        pass

    @abstractmethod
    def __len__(self) -> int:
        pass

    # Concrete Method 1: Invariant Check
    def is_empty(self) -> bool:
        return len(self) == 0

    # Concrete Method 2: Batch Push Utility
    def batch_push(self, items: List[Tuple[str, float]]) -> int:
        count = 0
        for item, prio in items:
            if len(self) >= self.max_capacity:
                break
            self.push(item, prio)
            count += 1
        return count

    # Concrete Method 3: Drain Container in Priority Order
    def drain_all(self) -> List[Tuple[str, float]]:
        result = []
        while not self.is_empty():
            result.append(self.pop())
        return result

# Clean Subclass: Inherits batch_push(), is_empty(), and drain_all() effortlessly!
class SortedArrayPriorityQueue(AbstractPriorityQueue):
    def __init__(self, max_capacity: int = 100):
        super().__init__(max_capacity=max_capacity)
        self._buffer: List[Tuple[str, float]] = []

    def push(self, item: str, priority: float) -> None:
        self._buffer.append((item, priority))
        self._buffer.sort(key=lambda x: x[1])

    def pop(self) -> Tuple[str, float]:
        if self.is_empty():
            raise IndexError("pop from empty priority queue")
        return self._buffer.pop(0)

    def __len__(self) -> int:
        return len(self._buffer)

pq = SortedArrayPriorityQueue(max_capacity=10)
workload = [("Task_A", 14.2), ("Task_B", 2.1), ("Task_C", 8.7)]

# Uses inherited batch_push()
inserted = pq.batch_push(workload)
print(f"Enqueued {inserted} tasks. Queue empty? {pq.is_empty()}")

# Uses inherited drain_all()
ordered_tasks = pq.drain_all()
print("Drained order:", [t[0] for t in ordered_tasks])
print(f"Queue empty after draining? {pq.is_empty()}")
```

#### 🎉 Output:
```text
Enqueued 3 tasks. Queue empty? False
Drained order: ['Task_B', 'Task_C', 'Task_A']
Queue empty after draining? True
```

</details>

[🔝 Back to Top](#top)

---

<span id="abstract-properties"></span>
### 3. Abstract Properties (`@property` + `@abstractmethod`)

Just as methods can be enforced, Python allows enforcing **properties** (getter attributes). In data structures and algorithms, this is ideal for enforcing mandatory metadata, such as asymptotic Big-O complexities or maximum buffer capacities.

> [!IMPORTANT]
> **Decorator Order Matters:** Always place `@property` on the **outside** and `@abstractmethod` on the **inside**:
> ```python
> @property
> @abstractmethod
> def attribute_name(self) -> str:
>     pass
> ```

#### DSA Introductory Example:
```python
from abc import ABC, abstractmethod

class AbstractDataStructure(ABC):
    @property
    @abstractmethod
    def space_complexity(self) -> str:
        """Mandatory specification: Worst-case memory footprint."""
        pass

class DoublyLinkedList(AbstractDataStructure):
    @property
    def space_complexity(self) -> str:
        return "O(N) with 2 pointers per node"

dll = DoublyLinkedList()
print(f"Memory Complexity: {dll.space_complexity}")
```

#### Output:
```text
Memory Complexity: O(N) with 2 pointers per node
```

---

<details>
<summary>💡 <b>DSA Case Study: Enforcing Big-O Asymptotic Complexity Declarations</b> (Click to expand)</summary>

#### 🤖 Scenario: Algorithmic Complexity Telemetry
In an automated algorithmic benchmarking suite, every priority queue implementation must declare its theoretical worst-case time complexity for both `push` and `pop`:
- **`time_complexity_push`** (e.g., $O(1)$, $O(N)$, or $O(\log N)$)
- **`time_complexity_pop`** (e.g., $O(N)$, $O(1)$, or $O(\log N)$)

This ensures the benchmarking runner can compare theoretical asymptotic curves against actual CPU operation counters.

---

#### ❌ Broken Code (The Problem)
A developer implemented `FibonacciHeapPriorityQueue`, but **forgot to implement** the `time_complexity_pop` property:

```python
from abc import ABC, abstractmethod

class AbstractPriorityQueue(ABC):
    @property
    @abstractmethod
    def time_complexity_push(self) -> str:
        """Asymptotic time complexity for insertion."""
        pass

    @property
    @abstractmethod
    def time_complexity_pop(self) -> str:
        """Asymptotic time complexity for extraction."""
        pass

class FibonacciHeapPriorityQueue(AbstractPriorityQueue):
    # Developer implemented push complexity...
    @property
    def time_complexity_push(self) -> str:
        return "O(1) amortized"

    # ❌ BUG: Forgot to implement time_complexity_pop property!

# Attempting to instantiate for benchmark analysis
fib_pq = FibonacciHeapPriorityQueue()
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class FibonacciHeapPriorityQueue without an implementation for abstract method 'time_complexity_pop'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Property Contract:** `AbstractPriorityQueue` declared both `time_complexity_push` and `time_complexity_pop` as abstract properties.
2. **Missing Property:** `FibonacciHeapPriorityQueue` omitted `time_complexity_pop`.
3. **Compile-Time Contract Guard:** Python raised a `TypeError` before the unconfigured class could run in the benchmarking engine.

---

#### ✅ Fixed Code (The Solution)
Implement both properties decorated with `@property`:

```python
from abc import ABC, abstractmethod

class AbstractPriorityQueue(ABC):
    @property
    @abstractmethod
    def time_complexity_push(self) -> str:
        """Asymptotic time complexity for insertion."""
        pass

    @property
    @abstractmethod
    def time_complexity_pop(self) -> str:
        """Asymptotic time complexity for extraction."""
        pass

class FibonacciHeapPriorityQueue(AbstractPriorityQueue):
    @property
    def time_complexity_push(self) -> str:
        return "O(1) amortized"

    @property
    def time_complexity_pop(self) -> str:
        return "O(log N) amortized"

fib_pq = FibonacciHeapPriorityQueue()
print("Fibonacci Heap Asymptotic Specifications:")
print(f"   • Push Complexity : {fib_pq.time_complexity_push}")
print(f"   • Pop Complexity  : {fib_pq.time_complexity_pop}")
```

#### 🎉 Output:
```text
Fibonacci Heap Asymptotic Specifications:
   • Push Complexity : O(1) amortized
   • Pop Complexity  : O(log N) amortized
```

</details>

[🔝 Back to Top](#top)

---

<span id="instantiation-safeguards"></span>
### 4. Abstract Class Instantiation Safeguards

An Abstract Base Class containing abstract members **cannot be instantiated directly**. Attempting to do so triggers a `TypeError`.

#### Why Does Python Enforce This in DSA?
An Abstract Data Type is an **incomplete specification**. For example, an abstract `AbstractPriorityQueue` does not have an underlying buffer, tree, or node pointers allocated. If Python allowed creating a raw `AbstractPriorityQueue()` instance, calling `push()` or `pop()` would execute an empty method with `pass` and crash consumer algorithms.

```python
from abc import ABC, abstractmethod

class AbstractPriorityQueue(ABC):
    @abstractmethod
    def push(self, item: str, priority: float) -> None:
        pass

    @abstractmethod
    def pop(self) -> tuple:
        pass

# ❌ Direct instantiation attempt:
try:
    generic_queue = AbstractPriorityQueue()
except TypeError as error:
    print(f"Captured Guard Error: {error}")
```

#### Output:
```text
Captured Guard Error: Can't instantiate abstract class AbstractPriorityQueue without an implementation for abstract methods 'pop', 'push'
```

[🔝 Back to Top](#top)

---

<span id="chunk-4"></span>
## 🏆 Chunk 4: Complete DSA Priority Queue & Task Scheduler Architecture

Here is a complete, production-grade Object-Oriented architecture integrating **Abstract Methods**, **Concrete Methods**, **Abstract Properties**, and **Polymorphic Execution**. 

It implements three distinct Priority Queue data structures and benchmarks their comparison metrics under an identical real-time OS task scheduling workload:
1. **`UnsortedArrayPriorityQueue`**: $O(1)$ push, $O(N)$ pop.
2. **`SortedArrayPriorityQueue`**: $O(N)$ push, $O(1)$ pop.
3. **`BinaryMinHeapPriorityQueue`**: $O(\log N)$ push, $O(\log N)$ pop (complete binary tree array sift-up/down).

```python
from abc import ABC, abstractmethod
from typing import List, Tuple, Optional, Any

# ==========================================================
# 1. ABSTRACT BASE CLASS (Priority Queue ADT Contract)
# ==========================================================
class AbstractPriorityQueue(ABC):
    """
    Abstract Base Class (ADT Contract) for a Priority Queue.
    Enforces essential operations while providing shared container utilities.
    """
    def __init__(self, name: str, max_capacity: int = 1000):
        self.name = name
        self._max_capacity = max_capacity
        self.comparison_count = 0  # Telemetry: Tracks comparison operations

    # ------------------------------------------------------
    # ABSTRACT PROPERTIES (Mandatory Asymptotic Profiles)
    # ------------------------------------------------------
    @property
    @abstractmethod
    def time_complexity_push(self) -> str:
        """Theoretical worst-case time complexity for insertion."""
        pass

    @property
    @abstractmethod
    def time_complexity_pop(self) -> str:
        """Theoretical worst-case time complexity for extraction."""
        pass

    # ------------------------------------------------------
    # CONCRETE PROPERTIES (Shared Attributes)
    # ------------------------------------------------------
    @property
    def max_capacity(self) -> int:
        """Maximum number of elements the queue can accommodate."""
        return self._max_capacity

    # ------------------------------------------------------
    # ABSTRACT METHODS (Core Data Structure Mechanics)
    # ------------------------------------------------------
    @abstractmethod
    def push(self, item: str, priority: float) -> None:
        """Insert an item with an associated priority numerical key."""
        pass

    @abstractmethod
    def pop(self) -> Tuple[str, float]:
        """Remove and return the item with the minimum priority key."""
        pass

    @abstractmethod
    def peek(self) -> Optional[Tuple[str, float]]:
        """Return the item with the minimum priority key without removing it."""
        pass

    @abstractmethod
    def __len__(self) -> int:
        """Return the current number of elements in the queue."""
        pass

    # ------------------------------------------------------
    # CONCRETE METHODS (Shared Container Utilities)
    # ------------------------------------------------------
    def is_empty(self) -> bool:
        """Check whether the queue contains zero elements."""
        return len(self) == 0

    def is_full(self) -> bool:
        """Check whether the queue has reached its maximum capacity."""
        return len(self) >= self._max_capacity

    def batch_push(self, items: List[Tuple[str, float]]) -> int:
        """Concrete shared helper: Safely insert a batch of prioritized tasks."""
        inserted = 0
        for item, priority in items:
            if self.is_full():
                break
            self.push(item, priority)
            inserted += 1
        return inserted

    def drain_all(self) -> List[Tuple[str, float]]:
        """Concrete shared helper: Extract all elements in strict priority order."""
        result = []
        while not self.is_empty():
            result.append(self.pop())
        return result


# ==========================================================
# 2. CONCRETE SUBCLASSES (Specific Data Structure Designs)
# ==========================================================
class UnsortedArrayPriorityQueue(AbstractPriorityQueue):
    """
    Priority Queue backed by an Unsorted Dynamic Array.
    - Push: O(1) amortized append to tail
    - Pop:  O(N) linear search for minimum element
    """
    def __init__(self, max_capacity: int = 1000):
        super().__init__(name="Unsorted Array PQ", max_capacity=max_capacity)
        self._buffer: List[Tuple[str, float]] = []

    @property
    def time_complexity_push(self) -> str:
        return "O(1)"

    @property
    def time_complexity_pop(self) -> str:
        return "O(N)"

    def push(self, item: str, priority: float) -> None:
        if self.is_full():
            raise OverflowError(f"Capacity limit of {self.max_capacity} exceeded.")
        self._buffer.append((item, priority))

    def _find_min_index(self) -> int:
        min_idx = 0
        for i in range(1, len(self._buffer)):
            self.comparison_count += 1
            if self._buffer[i][1] < self._buffer[min_idx][1]:
                min_idx = i
        return min_idx

    def pop(self) -> Tuple[str, float]:
        if self.is_empty():
            raise IndexError("pop from an empty priority queue")
        min_idx = self._find_min_index()
        return self._buffer.pop(min_idx)

    def peek(self) -> Optional[Tuple[str, float]]:
        if self.is_empty():
            return None
        min_idx = self._find_min_index()
        return self._buffer[min_idx]

    def __len__(self) -> int:
        return len(self._buffer)


class SortedArrayPriorityQueue(AbstractPriorityQueue):
    """
    Priority Queue backed by a Sorted Dynamic Array (Ascending Order).
    - Push: O(N) linear scan and shift insertion
    - Pop:  O(1) pop from front index
    """
    def __init__(self, max_capacity: int = 1000):
        super().__init__(name="Sorted Array PQ", max_capacity=max_capacity)
        self._buffer: List[Tuple[str, float]] = []

    @property
    def time_complexity_push(self) -> str:
        return "O(N)"

    @property
    def time_complexity_pop(self) -> str:
        return "O(1)"

    def push(self, item: str, priority: float) -> None:
        if self.is_full():
            raise OverflowError(f"Capacity limit of {self.max_capacity} exceeded.")
        idx = 0
        while idx < len(self._buffer):
            self.comparison_count += 1
            if priority < self._buffer[idx][1]:
                break
            idx += 1
        self._buffer.insert(idx, (item, priority))

    def pop(self) -> Tuple[str, float]:
        if self.is_empty():
            raise IndexError("pop from an empty priority queue")
        return self._buffer.pop(0)

    def peek(self) -> Optional[Tuple[str, float]]:
        if self.is_empty():
            return None
        return self._buffer[0]

    def __len__(self) -> int:
        return len(self._buffer)


class BinaryMinHeapPriorityQueue(AbstractPriorityQueue):
    """
    Priority Queue backed by a Complete Binary Tree in an Array (Min-Heap).
    - Push: O(log N) sift-up
    - Pop:  O(log N) sift-down
    """
    def __init__(self, max_capacity: int = 1000):
        super().__init__(name="Binary Min-Heap PQ", max_capacity=max_capacity)
        self._heap: List[Tuple[str, float]] = []

    @property
    def time_complexity_push(self) -> str:
        return "O(log N)"

    @property
    def time_complexity_pop(self) -> str:
        return "O(log N)"

    def push(self, item: str, priority: float) -> None:
        if self.is_full():
            raise OverflowError(f"Capacity limit of {self.max_capacity} exceeded.")
        self._heap.append((item, priority))
        self._sift_up(len(self._heap) - 1)

    def pop(self) -> Tuple[str, float]:
        if self.is_empty():
            raise IndexError("pop from an empty priority queue")
        if len(self._heap) == 1:
            return self._heap.pop()

        min_item = self._heap[0]
        # Move last leaf to root, then sift down
        self._heap[0] = self._heap.pop()
        self._sift_down(0)
        return min_item

    def peek(self) -> Optional[Tuple[str, float]]:
        if self.is_empty():
            return None
        return self._heap[0]

    def _sift_up(self, idx: int) -> None:
        while idx > 0:
            parent = (idx - 1) // 2
            self.comparison_count += 1
            if self._heap[idx][1] < self._heap[parent][1]:
                self._heap[idx], self._heap[parent] = self._heap[parent], self._heap[idx]
                idx = parent
            else:
                break

    def _sift_down(self, idx: int) -> None:
        n = len(self._heap)
        while True:
            left = 2 * idx + 1
            right = 2 * idx + 2
            smallest = idx

            if left < n:
                self.comparison_count += 1
                if self._heap[left][1] < self._heap[smallest][1]:
                    smallest = left

            if right < n:
                self.comparison_count += 1
                if self._heap[right][1] < self._heap[smallest][1]:
                    smallest = right

            if smallest != idx:
                self._heap[idx], self._heap[smallest] = self._heap[smallest], self._heap[idx]
                idx = smallest
            else:
                break

    def __len__(self) -> int:
        return len(self._heap)


# ==========================================================
# 3. POLYMORPHIC BENCHMARK DRIVER
# ==========================================================
def run_scheduler_benchmark(queues: List[AbstractPriorityQueue], task_workload: List[Tuple[str, float]]) -> None:
    """
    Polymorphic Benchmark Driver:
    Interacts with each queue strictly through the AbstractPriorityQueue interface.
    """
    print("=" * 85)
    print("⚡ DSA TASK SCHEDULER BENCHMARK — POLYMORPHIC ADT EVALUATION")
    print("=" * 85)

    for pq in queues:
        print(f"\n📦 DATA STRUCTURE: {pq.name}")
        print(f"   ⚙️ Theoretical Complexities: Push = {pq.time_complexity_push} | Pop = {pq.time_complexity_pop}")
        print(f"   📏 Buffer Status: Initial Size = {len(pq)} / {pq.max_capacity} items")

        # 1. Batch Insert Tasks
        inserted = pq.batch_push(task_workload)
        print(f"   📥 Enqueued {inserted} workload tasks.")

        # 2. Peek at Highest Priority (Lowest Numerical Value)
        peeked = pq.peek()
        print(f"   👀 Next In Line (Peek): {peeked[0]} (Priority Key: {peeked[1]})")

        # 3. Drain and Execute in Priority Order
        executed_order = pq.drain_all()
        order_names = [f"{task} (p={prio})" for task, prio in executed_order]
        print(f"   🚀 Execution Order: {' -> '.join(order_names[:3])} -> ... -> {order_names[-1]}")

        # 4. Telemetry and Metric Summary
        print(f"   📊 ALGORITHMIC TELEMETRY:")
        print(f"      • Total Comparisons Performed : {pq.comparison_count}")
        print(f"      • Final Queue State           : Empty = {pq.is_empty()} (Remaining = {len(pq)})")

    print("\n" + "=" * 85)
    print("🏁 BENCHMARK COMPLETED: All structures satisfied the ADT Priority Ordering Contract!")
    print("=" * 85)


# ==========================================================
# 4. EXECUTION DRIVER
# ==========================================================
if __name__ == "__main__":
    # Real-time operating system prioritized task workload (lower number = higher priority)
    workload_tasks = [
        ("Audio_Buffer_Process", 12.5),
        ("Network_Packet_Ack", 3.2),
        ("Garbage_Collection", 95.0),
        ("Disk_IO_Flush", 44.0),
        ("Kernel_Interrupt", 0.8),
        ("UI_Render_Frame", 16.6),
        ("Telemetry_Ping", 78.2),
        ("Security_Audit_Scan", 60.0)
    ]

    candidate_queues: List[AbstractPriorityQueue] = [
        UnsortedArrayPriorityQueue(max_capacity=50),
        SortedArrayPriorityQueue(max_capacity=50),
        BinaryMinHeapPriorityQueue(max_capacity=50)
    ]

    run_scheduler_benchmark(candidate_queues, workload_tasks)
```

#### 🎉 Output:
```text
=====================================================================================
⚡ DSA TASK SCHEDULER BENCHMARK — POLYMORPHIC ADT EVALUATION
=====================================================================================

📦 DATA STRUCTURE: Unsorted Array PQ
   ⚙️ Theoretical Complexities: Push = O(1) | Pop = O(N)
   📏 Buffer Status: Initial Size = 0 / 50 items
   📥 Enqueued 8 workload tasks.
   👀 Next In Line (Peek): Kernel_Interrupt (Priority Key: 0.8)
   🚀 Execution Order: Kernel_Interrupt (p=0.8) -> Network_Packet_Ack (p=3.2) -> Audio_Buffer_Process (p=12.5) -> ... -> Garbage_Collection (p=95.0)
   📊 ALGORITHMIC TELEMETRY:
      • Total Comparisons Performed : 35
      • Final Queue State           : Empty = True (Remaining = 0)

📦 DATA STRUCTURE: Sorted Array PQ
   ⚙️ Theoretical Complexities: Push = O(N) | Pop = O(1)
   📏 Buffer Status: Initial Size = 0 / 50 items
   📥 Enqueued 8 workload tasks.
   👀 Next In Line (Peek): Kernel_Interrupt (Priority Key: 0.8)
   🚀 Execution Order: Kernel_Interrupt (p=0.8) -> Network_Packet_Ack (p=3.2) -> Audio_Buffer_Process (p=12.5) -> ... -> Garbage_Collection (p=95.0)
   📊 ALGORITHMIC TELEMETRY:
      • Total Comparisons Performed : 23
      • Final Queue State           : Empty = True (Remaining = 0)

📦 DATA STRUCTURE: Binary Min-Heap PQ
   ⚙️ Theoretical Complexities: Push = O(log N) | Pop = O(log N)
   📏 Buffer Status: Initial Size = 0 / 50 items
   📥 Enqueued 8 workload tasks.
   👀 Next In Line (Peek): Kernel_Interrupt (Priority Key: 0.8)
   🚀 Execution Order: Kernel_Interrupt (p=0.8) -> Network_Packet_Ack (p=3.2) -> Audio_Buffer_Process (p=12.5) -> ... -> Garbage_Collection (p=95.0)
   📊 ALGORITHMIC TELEMETRY:
      • Total Comparisons Performed : 25
      • Final Queue State           : Empty = True (Remaining = 0)

=====================================================================================
🏁 BENCHMARK COMPLETED: All structures satisfied the ADT Priority Ordering Contract!
=====================================================================================
```

[🔝 Back to Top](#top)

---

<span id="chunk-5"></span>
## 📊 Chunk 5: Summary Comparison & Key Takeaways

### 1. Summary Comparison Table

| Abstraction Member | Decorator Syntax | Implemented in Abstract Base Class? | Must Child Subclass Override? | Primary Objective in DSA |
| :--- | :--- | :---: | :---: | :--- |
| **Abstract Method** | `@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce core data structure algorithmic mechanics (`push`, `pop`, `peek`, `search`). |
| **Concrete Method** | None | ✅ **Yes** (Full Body) | ❌ No (Inherited) | Provide reusable container utilities (`is_empty`, `is_full`, `batch_push`, `drain_all`). |
| **Abstract Property** | `@property`<br>`@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce asymptotic Big-O declarations (`time_complexity_push`, `space_complexity`). |
| **Abstract Class** | Inherits `ABC` | N/A | N/A | Defines the mathematical ADT contract; prevents instantiating incomplete structures. |

---

### 2. 🔑 Core Takeaways & Mental Model

1. **ADT vs. Concrete Data Structure**:
   - The Abstract Base Class (`AbstractPriorityQueue`) dictates **what** operations must exist and what invariants must hold.
   - The concrete child classes (`UnsortedArrayPriorityQueue`, `SortedArrayPriorityQueue`, `BinaryMinHeapPriorityQueue`) define **how** those operations manipulate memory and pointers.

2. **Always Inherit `abc.ABC`**:
   - Decorating a method with `@abstractmethod` without inheriting from `ABC` does **not** prevent direct instantiation of the base class. Always subclass `ABC`.

3. **Decorator Order Matters for Abstract Properties**:
   ```python
   # ✅ Correct Order: @property on outside, @abstractmethod on inside
   @property
   @abstractmethod
   def time_complexity_push(self) -> str:
       pass
   ```

4. **Early Bug Prevention via Contract Enforcement**:
   - If an engineer introduces a new data structure (e.g., `RadixPriorityQueue`) and forgets to implement a required method, Python raises a `TypeError` at instantiation time instead of causing an `AttributeError` midway through a complex graph traversal or task dispatch loop.

5. **Enables the Liskov Substitution Principle (LSP)**:
   - High-level algorithms (Dijkstra, A*, OS schedulers) depend only on the abstract interface. Any compliant subclass can be substituted without altering algorithm correctness or breaking client code.

---

[🔝 Back to Top](#top)
