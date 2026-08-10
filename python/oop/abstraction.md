# Data Abstraction in Python (Simplified Guide)

> **Source Article:** [GeeksforGeeks - Data Abstraction in Python](https://www.geeksforgeeks.org/python/data-abstraction-in-python/)

**Abstraction** is one of the core pillars of Object-Oriented Programming (OOP) in Python. 

---

## 🚗 Real-World Analogy: Driving a Car or Using a Smartphone

Think about driving a car:
- You use the **steering wheel**, **accelerator pedal**, and **brakes** to control the car.
- You don't need to know how the engine burns fuel, how the transmission shifts gears, or how the brake fluid pressure builds up inside the lines.
- **That is Abstraction:** Exposing only the essential interface (steering wheel/pedals) while hiding the complex background machinery.

### Graphic Software Example:
In a drawing application (like Photoshop or Paint), you can draw various shapes: **Circle**, **Rectangle**, and **Triangle**.
- All shapes share common actions: `draw()`, `resize()`, `get_area()`.
- You (the user/software caller) only care that every shape can compute its area and draw itself.
- **How** a `Circle` calculates area ($\pi \times r^2$) vs. how a `Rectangle` does it ($width \times height$) is hidden inside each specific shape class.

---

## 📌 Chunk 1: What is Data Abstraction?

### Simple Explanation
Data abstraction means **hiding the complex internal implementation details of a feature and showing only the essential functionality to the outside user or program**.

### Why Do We Use Abstraction?
1. **Reduces Complexity:** You interact with high-level functions without cluttering your code with internal logic.
2. **Enforces Consistency:** Ensures all derived child classes follow a standardized template/interface.
3. **Improves Maintainability:** Internal implementation details can be changed or optimized without breaking external code that relies on the class.
4. **Enhances Security:** Keeps core logic and internal mechanisms protected from accidental tampering.

---

## 🏛️ Chunk 2: Abstract Base Class (ABC)

In Python, standard classes don't force child classes to implement specific methods. To enforce rules and create blueprints, Python provides the **`abc` module**.

### Key Concepts:
- **ABC (Abstract Base Class):** A class that inherits from `abc.ABC`. It acts as a **blueprint** and cannot be instantiated on its own.
- **`@abstractmethod` Decorator:** Placed above a method inside an Abstract Class to declare: *"Every subclass MUST implement this method!"*

### Code Example: Basic Abstract Class
```python
from abc import ABC, abstractmethod

# Abstract Base Class (Blueprint)
class Greet(ABC):
    @abstractmethod
    def say_hello(self):
        pass  # Abstract method has no implementation body

# Concrete Class (Child class implementing the blueprint)
class English(Greet):
    def say_hello(self):
        return "Hello!"

# Creating an instance of the concrete child class
g = English()
print(g.say_hello())
```

### Output:
```text
Hello!
```

### 🔍 Breakdown:
- `Greet` inherits from `ABC`, making it an abstract base class.
- `@abstractmethod` decorates `say_hello()`, marking it as a required action.
- `English` inherits from `Greet` and provides the actual code for `say_hello()`.
- Now, any language class added in the future (e.g., `Spanish`, `French`) **must** also provide its own `say_hello()` method.

---

## 🧩 Chunk 3: Components of Abstraction

Abstraction in Python consists of **4 key building blocks**:

---

### 1. Abstract Method
An **Abstract Method** is a method declared in an abstract class that has **no implementation body** (usually just contains `pass`). 
It acts as a placeholder that forces subclasses to override it with their own logic.

#### Code Example:
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def make_sound(self):
        pass  # Placeholder - no implementation here
```

#### 🔍 Explanation:
- `make_sound()` inside `Animal` has no code.
- It acts as an obligatory contract: any specific animal (like `Dog`, `Cat`, `Lion`) derived from `Animal` **must** write its own `make_sound()` code.

---

### 2. Concrete Method
A **Concrete Method** is a normal, fully implemented method inside an abstract class. Subclasses inherit and use it directly without needing to redefine it.

#### Code Example:
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    # Abstract Method (Must be overridden by child classes)
    @abstractmethod
    def make_sound(self):
        pass

    # Concrete Method (Shared logic ready to use)
    def move(self):
        return "Moving forward..."

class Dog(Animal):
    def make_sound(self):
        return "Bark!"

# Instantiate Dog
dog = Dog()
print(dog.make_sound())  # Output: Bark!
print(dog.move())        # Output: Moving forward...
```

#### Output:
```text
Bark!
Moving forward...
```

#### 🔍 Explanation:
- `move()` already has working logic defined in `Animal`.
- `Dog` automatically inherits `move()` without writing any extra code, promoting **code reuse**.

---

### 3. Abstract Property
Just like abstract methods, Python allows you to create **Abstract Properties**. You combine `@property` and `@abstractmethod` decorators to enforce that subclasses define specific getter attributes.

#### Code Example:
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @property
    @abstractmethod
    def species(self):
        pass  # Abstract property

class Dog(Animal):
    @property
    def species(self):
        return "Canine"

dog = Dog()
print(dog.species)
```

#### Output:
```text
Canine
```

#### 🔍 Explanation:
- `@property` converts `species` into a read-only attribute access (accessed via `dog.species` without `()`).
- Combining `@property` and `@abstractmethod` guarantees every child subclass provides this attribute.

<details>
<summary>🏁 MotoGP Case Study Example: Abstract Property (Click to expand/collapse)</summary>

> **Prompt History:** `add example in motogp study cases (hide/accordion) and make it broken code and the solution to understanding it step-by-step`

### 🏍️ Scenario: FIM Technical Regulations
In MotoGP, the **FIM (Fédération Internationale de Motocyclisme)** enforces strict technical regulations. Every prototype race bike must define mandatory specifications like **`minimum_weight`** (157 kg) and **`max_engine_capacity`** (1000 cc) as abstract properties.

---

### ❌ Broken Code (The Problem)

In this example, the team created a `DucatiDesmosedici` child class but forgot to implement the abstract `@property minimum_weight`:

```python
from abc import ABC, abstractmethod

# Abstract Base Class (FIM Standard Blueprint)
class MotoGPBike(ABC):
    @property
    @abstractmethod
    def minimum_weight(self) -> float:
        """Abstract property: Must return bike minimum weight in kg."""
        pass

    @property
    @abstractmethod
    def max_engine_capacity(self) -> int:
        """Abstract property: Must return max engine capacity in cc."""
        pass

# Derived Concrete Class
class DucatiDesmosedici(MotoGPBike):
    def __init__(self, rider: str):
        self.rider = rider

    # Developer implemented max_engine_capacity, BUT forgot minimum_weight!
    @property
    def max_engine_capacity(self) -> int:
        return 1000

# ❌ Attempting to instantiate the Ducati bike
pecco_bike = DucatiDesmosedici("Francesco Bagnaia")
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class DucatiDesmosedici without an implementation for abstract method 'minimum_weight'
```

---

### 🔍 Step-by-Step Breakdown: Understanding the Issue

1. **Contract Definition:** `MotoGPBike` inherits from `ABC` and defines **two** abstract properties (`minimum_weight` and `max_engine_capacity`).
2. **Incomplete Implementation:** `DucatiDesmosedici` only implements `@property def max_engine_capacity(self)`. It omits `minimum_weight`.
3. **Python Rule:** Python strictly prevents instantiation of any class that leaves abstract methods/properties unimplemented.

---

### ✅ Fixed Code (The Solution)

To resolve the error, implement all mandatory `@property` decorators in `DucatiDesmosedici`:

```python
from abc import ABC, abstractmethod

# Abstract Base Class (FIM Standard Blueprint)
class MotoGPBike(ABC):
    @property
    @abstractmethod
    def minimum_weight(self) -> float:
        """Abstract property: Must return bike minimum weight in kg."""
        pass

    @property
    @abstractmethod
    def max_engine_capacity(self) -> int:
        """Abstract property: Must return max engine capacity in cc."""
        pass

# Derived Concrete Class (Fully Compliant)
class DucatiDesmosedici(MotoGPBike):
    def __init__(self, rider: str):
        self.rider = rider

    @property
    def minimum_weight(self) -> float:
        return 157.0  # FIM Minimum Weight in Kg

    @property
    def max_engine_capacity(self) -> int:
        return 1000  # 1000cc limit

# ✅ Successfully instantiating the Ducati bike
pecco_bike = DucatiDesmosedici("Francesco Bagnaia")
print(f"Rider: {pecco_bike.rider}")
print(f"Minimum Weight: {pecco_bike.minimum_weight} kg")
print(f"Max Engine Capacity: {pecco_bike.max_engine_capacity} cc")
```

#### 🎉 Output:
```text
Rider: Francesco Bagnaia
Minimum Weight: 157.0 kg
Max Engine Capacity: 1000 cc
```

</details>

---

### 4. Abstract Class Instantiation (Strict Rule)

> [!WARNING]
> You **cannot create an instance directly from an Abstract Class** if it contains unimplemented abstract methods or properties.

#### Code Example (Raises Error):
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def make_sound(self):
        pass

# Attempting to create an object directly from Animal
animal = Animal()
```

#### Output / Error:
```text
TypeError: Can't instantiate abstract class Animal with abstract method make_sound
```

#### 🔍 Explanation:
- Python prevents `Animal()` creation because `make_sound()` is incomplete.
- To use it, you **must create a child class** (like `Dog`), implement all abstract methods, and instantiate that child class instead.

---

## 📊 Summary Comparison Table

| Component | Decorator(s) | Has Body Code in Abstract Class? | Must Subclass Implement It? | Primary Use Case |
| :--- | :--- | :---: | :---: | :--- |
| **Abstract Method** | `@abstractmethod` | ❌ No (`pass`) | ✅ Yes | Enforce required behavior across child classes. |
| **Concrete Method** | None | ✅ Yes | ❌ No (Inherited) | Share common reusable functionality. |
| **Abstract Property** | `@property`<br>`@abstractmethod` | ❌ No (`pass`) | ✅ Yes | Enforce mandatory attributes/properties. |
| **Abstract Class** | Inherits `ABC` | N/A | N/A | Blueprint containing abstract/concrete members; cannot be instantiated directly. |

---

## 🔑 Key Takeaways

1. **Abstraction = Hiding complexity**, showing only essential interfaces.
2. Import `ABC` and `@abstractmethod` from Python's built-in `abc` module.
3. Classes inheriting `ABC` with `@abstractmethod` **cannot be instantiated directly** (throws `TypeError`).
4. Abstract classes can contain both **abstract methods** (unimplemented blueprints) and **concrete methods** (ready-to-use shared code).
5. Abstraction enforces consistency across large software projects with multiple developers.
