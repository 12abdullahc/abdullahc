<span id="top"></span>

# Python Classes and Objects — In-Depth Comprehensive Guide

> **Source Article:** [GeeksforGeeks — Python Classes and Objects](https://www.geeksforgeeks.org/python/python-classes-and-objects/)  
> **Topic:** Python Classes, Objects, Instantiation, `__init__()`, `self`, `__str__()` vs `__repr__()`, Class vs. Instance Attributes, and Methods  
> **Domain Focus:** Mathematical Geometry, 2D Cartesian Coordinate Systems & CAD Vector Engine Simple Study Cases  
> **User Prompt:** "reexplain the following article part by part, easy to understand and coherence example in math geometry simple study cases with the background: https://www.geeksforgeeks.org/python/python-classes-and-objects/"

---

## Table of Contents
1. [Background & Conceptual Intuition: Why Geometry Illuminates Classes & Objects](#background-intuition)
   - [1.1 From Physical Graph Paper to Digital Memory](#graph-paper-to-memory)
   - [1.2 Euclid's Axioms as Classes, Drafted Figures as Objects](#euclid-axioms)
   - [1.3 System Architecture Diagram: 2D Geometry Engine](#system-architecture)
2. [Part 1: What are Classes and Objects?](#part-1)
   - [2.1 The Concept of a User-Defined Type](#part-1-user-defined-type)
   - [2.2 Modeling Geometric Concepts: From Definition to Instance](#part-1-definition-to-instance)
   - [2.3 The Core Trilogy: State, Behavior, and Identity](#part-1-trilogy)
3. [Part 2: Creating a Class in Python](#part-2)
   - [3.1 Syntax, PEP 8 Conventions, and the `class` Keyword](#part-2-syntax)
   - [3.2 Defining Class Attributes at Class Scope](#part-2-class-attributes)
   - [3.3 Accessing Attributes via the Dot (`.`) Operator](#part-2-dot-operator)
   - [3.4 Geometry Syntax Example: The `CartesianPlane` Specification](#part-2-geometry-example)
4. [Part 3: Objects — Instantiation, State, and Identity](#part-3)
   - [4.1 Instantiation Syntax (`object = ClassName()`)](#part-3-instantiation)
   - [4.2 Under the Hood: Memory Allocation and `id()`](#part-3-memory-allocation)
   - [4.3 Dot Notation Access on Instances](#part-3-dot-access)
   - [4.4 Multiple Instances with Independent Lifecycles](#part-3-multiple-instances)
   - [4.5 Geometry Syntax Example: Discrete Points on a Plane](#part-3-geometry-example)
5. [Part 4: Initializing Objects with `__init__()` and Demystifying `self`](#part-4)
   - [5.1 The Role of `__init__()` as the Object Initializer](#part-4-init-role)
   - [5.2 What is `self`? How Python Dispatches Method Calls](#part-4-demystifying-self)
   - [5.3 Binding Instance Attributes to `self`](#part-4-instance-attributes)
   - [5.4 Class Attributes vs. Instance Attributes in `__init__`](#part-4-class-vs-instance)
   - [5.5 Geometry Syntax Example: `Point2D` and `Circle` Initializers](#part-4-geometry-example)
6. [Part 5: Custom String Representation with `__str__()` and `__repr__()`](#part-5)
   - [5.1 The Problem with Default Python Output (`<__main__... at 0x...>`)](#part-5-default-output)
   - [5.2 The Role of `__str__()` (Human-Readable Output)](#part-5-str-role)
   - [5.3 The Critical Companion: `__repr__()` (Developer & Debug Output)](#part-5-repr-companion)
   - [5.4 Geometry Syntax Example: Expressive Vector & Circle Inspection](#part-5-geometry-example)
7. [Part 6: Deep Dive — Class Variables vs. Instance Variables](#part-6)
   - [6.1 Namespace Resolution Hierarchy (Instance $\to$ Class)](#part-6-namespace-lookup)
   - [6.2 The Shadowing Trap: `self.attr` vs. `ClassName.attr`](#part-6-shadowing-trap)
   - [6.3 The Mutable Class Attribute Disaster (Shared Lists/Dictionaries)](#part-6-mutable-trap)
   - [6.4 Best Practice Matrix: When to Use Class vs. Instance Variables](#part-6-best-practice)
8. [Part 7: Methods in Classes (Instance, Class, and Static Methods)](#part-7)
   - [7.1 Instance Methods (`def method(self)`)](#part-7-instance-methods)
   - [7.2 Class Methods (`@classmethod` and `cls`) as Factory Constructors](#part-7-class-methods)
   - [7.3 Static Methods (`@staticmethod`) as Pure Mathematical Utilities](#part-7-static-methods)
   - [7.4 Geometry Syntax Example: A Complete `Circle2D` Engineering Class](#part-7-geometry-example)
9. [Part 8: Comprehensive Comparative Breakdown: Class vs. Object](#part-8)
   - [8.1 The Head-to-Head Architectural Comparison](#part-8-comparison-table)
   - [8.2 Namespace and Memory Flowchart](#part-8-flowchart)
10. [Part 9: Practical Geometry Case Studies (Failure Analysis & Fixes)](#part-9)
    - [Case Study 1: The Mutable Vertex List Leaking Across Polygons](#case-study-1)
    - [Case Study 2: Memory Identity (`is`) vs. Spatial Equality (`==`)](#case-study-2)
    - [Case Study 3: The Missing `self` Parameter in Vector Translation](#case-study-3)
    - [Case Study 4: Geometric Object Composition (`LineSegment2D` built from `Point2D`)](#case-study-4)
11. [Part 10: Summary, Key Takeaways & Mental Models](#part-10)
    - [10.1 Ten Golden Rules of Python Classes & Objects](#golden-rules)
    - [10.2 Architectural Mental Models for Geometry Software](#mental-models)

---

<span id="background-intuition"></span>
## 1. Background & Conceptual Intuition: Why Geometry Illuminates Classes & Objects

<span id="graph-paper-to-memory"></span>
### 1.1 From Physical Graph Paper to Digital Memory

In computational geometry, graphics engines, and physical simulations, raw data structures (such as loose tuples or dictionaries) quickly break down:
- A raw tuple `pt = (3.0, 4.0)` holds numbers, but carries no mathematical behavior: it cannot compute its own Euclidean distance to the origin, cannot self-validate, and cannot be translated without external procedures.
- A raw dictionary `circle = {"radius": 5.0, "center": (0.0, 0.0)}` cannot protect its physical invariants: external code can accidentally mutate `circle["radius"] = -25.0`, producing nonsensical geometry.

**Mathematical geometry** is inherently object-oriented:
1. **Invariant Defense:** Every geometric figure is bounded by strict mathematical laws (e.g., a circle's radius $r > 0$, orthogonal 2D coordinates $(x, y)$).
2. **Separation of Definition from Realization:** The analytical formula for a shape exists independently of any physical drawing, while an actual drawn component has position, dimensions, and memory presence.
3. **Cohesion of State and Behavior:** A geometric figure packages its spatial dimensions (state) directly with its analytical transformations and measurements (behavior).

When writing a 2D Computer-Aided Design (CAD) engine, a vector graphics system, or a CNC laser fabricator, you need an architecture that models geometric reality with precision and integrity.

<span id="euclid-axioms"></span>
### 1.2 Euclid's Axioms as Classes, Drafted Figures as Objects

Consider Euclidean geometry:
- **Euclid's Definition of a Circle (The Class):** *"A circle is a plane figure bounded by one curved line such that all straight lines drawn from a certain point within it to the bounding line are equal."* Notice: Euclid's definition does not weigh anything, does not consume ink, and does not occupy a coordinate on your screen. It is an **analytical blueprint**.
- **A Drafted Washer Component (The Object):** When a machinist drafts a specific circular bolt hole with radius $r = 5.0\text{ mm}$ centered at $(12.0, 8.5)$, they create a **concrete instance** of Euclid's definition. It consumes real RAM in your computer, possesses unique spatial coordinates, and can be measured, transformed, or rendered.

```
                  THE EUCLIDEAN BLUEPRINT (CLASS)
                   ┌───────────────────────────┐
                   │       class Circle:       │
                   │  - Rule: Area = π · r²    │
                   │  - Rule: Perim = 2 · π · r│
                   └─────────────┬─────────────┘
                                 │
                 Instantiation: Circle(radius)
                                 │
          ┌──────────────────────┴──────────────────────┐
          ▼                                             ▼
  CONCRETE OBJECT #1                            CONCRETE OBJECT #2
┌───────────────────────────┐                 ┌───────────────────────────┐
│ Center: (0.0, 0.0)        │                 │ Center: (15.0, 30.0)      │
│ Radius: 5.0 mm            │                 │ Radius: 12.5 mm           │
│ Area: 78.54 mm²           │                 │ Area: 490.87 mm²          │
│ Memory: 0x000001A8F0C10   │                 │ Memory: 0x000001A8F0DF0   │
└───────────────────────────┘                 └───────────────────────────┘
```

<span id="system-architecture"></span>
### 1.3 System Architecture Diagram: 2D Geometry Engine

Here is how the core class and object concepts assemble into a robust 2D geometry pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           2D CAD GEOMETRY ENGINE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ CLASS DEFINITION ] (User-defined Type / Template)                        │
│   class Point2D:                                                            │
│     ├── Class Attribute:     dimension = 2, coordinate_system = "Cartesian" │
│     ├── Initializer:         def __init__(self, x, y, label="P"):           │
│     │                          self.x = x; self.y = y; self.label = label   │
│     ├── Instance Method:     def distance_to(self, other):                  │
│     ├── Class Method:        @classmethod def origin(cls):                  │
│     ├── Static Method:       @staticmethod def is_valid(x, y):              │
│     └── String Formatter:    def __str__(self): / def __repr__(self):       │
│                                                                             │
│                                      │                                      │
│                       Instantiation via Calling: Point2D(3.0, 4.0)          │
│                                      │                                      │
│                                      ▼                                      │
│  [ OBJECT INSTANCES ] (Independent Entities in Memory)                      │
│                                                                             │
│    Point #1: "Anchor"                       Point #2: "Target"              │
│   ┌───────────────────────────────┐        ┌───────────────────────────────┐│
│   │ • State:    x=0.0, y=0.0      │        │ • State:    x=3.0, y=4.0      ││
│   │ • Identity: id = 0x21a4f0     │        │ • Identity: id = 0x21a5b8     ││
│   │ • Behavior: .distance_to(p2)  │        │ • Behavior: .translate(dx, dy)││
│   │ • Repr:     Point2D(0.0, 0.0) │        │ • Repr:     Point2D(3.0, 4.0) ││
│   └───────────────────────────────┘        └───────────────────────────────┘│
│                   │                                        │                │
│                   └────────────────────┬───────────────────┘                │
│                                        ▼                                    │
│             [ COMPOSITE OBJECT ]: LineSegment2D(start=p1, end=p2)           │
│             • Length: 5.0 units  • Midpoint: (1.5, 2.0)                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

[🔝 Back to Top](#top)

---

<span id="part-1"></span>
## 2. Part 1: What are Classes and Objects?

<span id="part-1-user-defined-type"></span>
### 2.1 The Concept of a User-Defined Type

In Python, every fundamental piece of data belongs to a built-in type:
- `42` is an instance of `<class 'int'>`
- `3.14159` is an instance of `<class 'float'>`
- `"Euclid"` is an instance of `<class 'str'>`
- `[1, 2, 3]` is an instance of `<class 'list'>`

These primitive types are great for generic mathematics, but Python does not ship with built-in types for geometric concepts like `Point2D`, `Circle`, `Ray`, or `Polygon`. 

Core definition:
> A **Class** is a user-defined template or prototype from which objects are created. It bundles data (attributes) and functions (methods) into a unified, reusable data type. When you define a class, you create a brand-new type in Python's type system.

> An **Object** is a specific, self-contained instance of a class. It holds real values (state), exhibits defined actions (behavior), and occupies a distinct address in system memory (identity).

<span id="part-1-definition-to-instance"></span>
### 2.2 Modeling Geometric Concepts: From Definition to Instance

To see how a class acts as a template for geometric entities, consider defining a planar coordinate space:

```python
# 📐 Mathematical Geometry: Planar Space Template
class CartesianSpace:
    """Class blueprint defining universal properties of a 2D Cartesian plane."""
    dimension: int = 2                       # Class attribute: every figure in this space has 2 axes
    coordinate_system: str = "Orthogonal 2D" # Class attribute: x and y axes meet at 90°

# Creating an instance of CartesianSpace
canvas_layer = CartesianSpace()

# Accessing the shared class attribute via dot notation
print(f"Canvas Dimension: {canvas_layer.dimension}D")
print(f"Coordinate System: {canvas_layer.coordinate_system}")
```

#### Output:
```text
Canvas Dimension: 2D
Coordinate System: Orthogonal 2D
```

*What happened here?*
- `CartesianSpace` is our custom class blueprint.
- `canvas_layer` is an individual object instantiated from that blueprint.
- `dimension` is a **class attribute** that is universally true for all figures rendered within this space.

<span id="part-1-trilogy"></span>
### 2.3 The Core Trilogy: State, Behavior, and Identity

Every geometric object in Python is fundamentally characterized by three pillars:

| Characteristic | Formal Definition | Mathematical Geometry Study Case |
| :--- | :--- | :--- |
| **1. State** | The data, properties, or values held internally by the object. | A `Point2D` has state: $x = 3.0, y = 4.0$, label = `"Vertex_A"`. A `Circle` has state: radius $r = 5.0$, center at $(0, 0)$. |
| **2. Behavior** | The actions, computations, or transformations the object can execute. | A `Point2D` can compute its Euclidean distance to another point via $\sqrt{\Delta x^2 + \Delta y^2}$ or translate its position by $(\Delta x, \Delta y)$. |
| **3. Identity** | The distinct physical address where the object resides in system RAM. | Two points created at the exact same coordinates $(3.0, 4.0)$ are separate physical entities in computer memory, each with its own `id()`. |

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANATOMY OF A GEOMETRY OBJECT                    │
├────────────────────┬─────────────────────────┬─────────────────────────┤
│      1. STATE      │       2. BEHAVIOR       │       3. IDENTITY       │
├────────────────────┼─────────────────────────┼─────────────────────────┤
│ Attributes / Data  │ Methods / Calculations  │ System Memory Address   │
│                    │                         │                         │
│ self.x = 3.0       │ distance_to(other)      │ hex(id(self))           │
│ self.y = 4.0       │ translate(dx, dy)       │ 0x0000021A3B0F10        │
│ self.label = "A"   │ rotate(radians)         │ (Unique integer in RAM) │
└────────────────────┴─────────────────────────┴─────────────────────────┘
```

[🔝 Back to Top](#top)

---

<span id="part-2"></span>
## 3. Part 2: Creating a Class in Python

<span id="part-2-syntax"></span>
### 3.1 Syntax, PEP 8 Conventions, and the `class` Keyword

In Python, a class is declared using the `class` keyword, followed by the class name, a colon (`:`), and an indented code block:

```python
class ClassName:
    # Class attributes, constructors, and methods live here
    pass
```

#### Conventions & Standards (PEP 8):
1. **Naming:** Classes must follow **PascalCase** (e.g., `CartesianPoint`, `CircleGeometry`, `VectorEngine`). Never use `snake_case` for class names.
2. **Docstrings:** Always supply an informative docstring immediately following the `class` header explaining the geometric concept being modeled.
3. **The `pass` statement:** If a class definition is temporarily empty, `pass` acts as a placeholder so Python does not raise an `IndentationError`.

<span id="part-2-class-attributes"></span>
### 3.2 Defining Class Attributes at Class Scope

Variables defined directly inside the body of a class (outside of any method) are **Class Attributes**. 

- They belong to the class itself, not to any individual instance.
- They are shared by all instances created from the class.
- They are stored in the class's internal dictionary namespace (`ClassName.__dict__`).
- They are ideal for universal constants (such as $\pi$, coordinate dimensions, measurement standards, or global shape counters).

<span id="part-2-dot-operator"></span>
### 3.3 Accessing Attributes via the Dot (`.`) Operator

The **dot operator (`.`)** is Python's universal mechanism for property access and method invocation:
- `ClassName.attribute` $\to$ accesses a class attribute directly on the class blueprint.
- `instance.attribute` $\to$ accesses an attribute via an instantiated object.

<span id="part-2-geometry-example"></span>
### 3.4 Geometry Syntax Example: The `CartesianPlane` Specification

```python
class CartesianPlane:
    """Specification of a 2D Euclidean coordinate drafting plane."""
    # Class Attributes: Constants common to all figures on this plane
    AXIS_COUNT: int = 2
    GRID_UNIT: str = "millimeters"
    ORIGIN_COORDINATE: tuple = (0.0, 0.0)

# 1. Accessing class attributes directly from the class blueprint (no object needed yet!)
print("--- Class Blueprint Inspection ---")
print(f"Plane Axes Count : {CartesianPlane.AXIS_COUNT}")
print(f"Standard Unit    : {CartesianPlane.GRID_UNIT}")
print(f"Origin Landmark  : {CartesianPlane.ORIGIN_COORDINATE}")

# 2. Instantiating two drafting viewports
viewport_a = CartesianPlane()
viewport_b = CartesianPlane()

# 3. Accessing the shared class attributes through instances
print("\n--- Instance Access via Dot Operator ---")
print(f"Viewport A Unit  : {viewport_a.GRID_UNIT}")
print(f"Viewport B Unit  : {viewport_b.GRID_UNIT}")
```

#### Output:
```text
--- Class Blueprint Inspection ---
Plane Axes Count : 2
Standard Unit    : millimeters
Origin Landmark  : (0.0, 0.0)

--- Instance Access via Dot Operator ---
Viewport A Unit  : millimeters
Viewport B Unit  : millimeters
```

[🔝 Back to Top](#top)

---

<span id="part-3"></span>
## 4. Part 3: Objects — Instantiation, State, and Identity

<span id="part-3-instantiation"></span>
### 4.1 Instantiation Syntax (`object = ClassName()`)

Creating an object from a class is known as **instantiation** (bringing an instance into physical existence).
The syntax resembles calling a function:
```python
my_shape = Circle()
```
When Python encounters `ClassName()`, two critical events take place behind the scenes:
1. Python calls `__new__()` to allocate raw heap memory for the new object.
2. Python calls `__init__()` to initialize the object's starting state.
3. Python returns the live memory reference and binds it to the variable `my_shape`.

<span id="part-3-memory-allocation"></span>
### 4.2 Under the Hood: Memory Allocation and `id()`

In Python, every live object is assigned a unique integer ID by the runtime, retrieved via `id(obj)`. In CPython, `id(obj)` represents the **actual memory address** of the object in RAM. Formatting this number as hexadecimal (`hex(id(obj))`) shows the physical memory pointer.

Even if two objects hold identical geometric coordinates, they are **two separate physical entities** in memory:

```
RAM Address: 0x0000021A4B0F10          RAM Address: 0x0000021A4B1A80
┌───────────────────────────┐          ┌───────────────────────────┐
│     Point Object: pt1     │          │     Point Object: pt2     │
│ Coordinates: (5.0, 8.0)   │          │ Coordinates: (5.0, 8.0)   │
└───────────────────────────┘          └───────────────────────────┘
              ▲                                      ▲
              │                                      │
        Variable 'pt1'                         Variable 'pt2'
```

<span id="part-3-dot-access"></span>
### 4.3 Dot Notation Access on Instances

Once an object exists, the dot operator is used to inspect or mutate its attributes:
```python
pt1.x = 10.0   # Mutates instance state
print(pt1.x)   # Reads instance state
```

<span id="part-3-multiple-instances"></span>
### 4.4 Multiple Instances with Independent Lifecycles

You can spawn hundreds or thousands of unique objects from a single class. Mutating the attributes of one object has **zero impact** on other objects instantiated from the same class.

<span id="part-3-geometry-example"></span>
### 4.5 Geometry Syntax Example: Discrete Points on a Plane

```python
class RawPoint:
    """A minimal geometry class without custom constructor yet."""
    space_name: str = "Euclidean 2D"

# 1. Instantiating three distinct geometric point objects
pt1 = RawPoint()
pt2 = RawPoint()
pt3 = pt1  # pt3 is an ALIAS pointing to the exact same memory address as pt1!

# 2. Attaching instance-specific attributes dynamically via dot notation
pt1.x = 3.0
pt1.y = 4.0

pt2.x = 9.0
pt2.y = 12.0

# 3. Verifying Memory Identity using id() and hex()
print(f"pt1 Memory Address : {hex(id(pt1))} | Coordinates: ({pt1.x}, {pt1.y})")
print(f"pt2 Memory Address : {hex(id(pt2))} | Coordinates: ({pt2.x}, {pt2.y})")
print(f"pt3 Memory Address : {hex(id(pt3))} | Coordinates: ({pt3.x}, {pt3.y})")

# 4. Identity Testing with the 'is' operator
print("\n--- Identity Verification ---")
print(f"pt1 is pt2 : {pt1 is pt2} (Separate objects in RAM)")
print(f"pt1 is pt3 : {pt1 is pt3} (Identical pointers in RAM)")

# 5. Proving independence: Mutating pt2 does not affect pt1
pt2.x = 99.0
print(f"\nAfter modifying pt2.x -> pt1.x remains: {pt1.x}")
```

#### Output:
```text
pt1 Memory Address : 0x1cf9e230 | Coordinates: (3.0, 4.0)
pt2 Memory Address : 0x1cf9e290 | Coordinates: (9.0, 12.0)
pt3 Memory Address : 0x1cf9e230 | Coordinates: (3.0, 4.0)

--- Identity Verification ---
pt1 is pt2 : False (Separate objects in RAM)
pt1 is pt3 : True (Identical pointers in RAM)

After modifying pt2.x -> pt1.x remains: 3.0
```

[🔝 Back to Top](#top)

---

<span id="part-4"></span>
## 5. Part 4: Initializing Objects with `__init__()` and Demystifying `self`

<span id="part-4-init-role"></span>
### 5.1 The Role of `__init__()` as the Object Initializer

In Section 4.5, we manually attached `.x` and `.y` to objects after creation. This manual approach is dangerous: an engineer might forget to set `.x`, resulting in an incomplete, corrupted object that crashes the CAD engine when calculations run.

To solve this, Python provides the **`__init__()`** method (known colloquially as the "dunder init" or constructor):
- The name starts and ends with double underscores (`__`), designating it as a **special method (dunder method)**.
- It is executed **automatically** whenever a new instance is created.
- It enforces that all essential initial dimensions (coordinates, radii, tags) are provided up front at creation time.

<span id="part-4-demystifying-self"></span>
### 5.2 What is `self`? How Python Dispatches Method Calls

Beginners are often confused by `self`. Why must it be written as the first parameter of every method?

Here is the secret:
> `self` is an explicit reference to the **specific instance** currently executing the method.

When you write:
```python
p1 = Point2D(3.0, 4.0)
p1.distance_from_origin()
```
Python's interpreter translates this call under the hood to:
```python
Point2D.distance_from_origin(p1)
```
Python automatically passes `p1` as the first argument into the function. Inside the method body, `self` becomes an alias for `p1`. If another object `p2` calls the method, `self` becomes an alias for `p2`.

```
User writes:                p1.translate(dx=2.0, dy=1.0)
                                      │
                                      ▼
Python translates to:       Point2D.translate(p1, dx=2.0, dy=1.0)
                                               │
                                               ▼
Method signature:           def translate(self,   dx,      dy):
                                            │
                                            └─► self is now bound to p1!
```

> [!NOTE]
> `self` is not a reserved Python keyword—it is a strong PEP 8 convention. You could technically name it `this` or `me`, but doing so violates Python community standards and will make your code unreadable to other engineers. Always use `self`.

<span id="part-4-instance-attributes"></span>
### 5.3 Binding Instance Attributes to `self`

Inside `__init__()`, any variable assigned to `self.` (e.g. `self.x = x`) becomes an **Instance Attribute**.
- It is private to that specific object.
- It is stored directly in that object's instance dictionary (`self.__dict__`).

<span id="part-4-class-vs-instance"></span>
### 5.4 Class Attributes vs. Instance Attributes in `__init__`

The distinction between shared geometric rules and unique individual dimensions is fundamental:
- **Class Attributes:** Properties common to every shape produced by that blueprint (e.g. `coordinate_plane = "2D Euclidean"`).
- **Instance Attributes:** Properties unique to a single concrete shape (e.g. `self.label = "Borehole_A"`, `self.radius = 3.5`).

```python
class PlanarCircle:
    # 🌍 Class Attribute: Universal across all planar circles
    coordinate_plane: str = "2D Euclidean"

    def __init__(self, label: str, radius: float):
        # 👤 Instance Attributes: Unique to each individual circle instance
        self.label: str = label
        self.radius: float = float(radius)

# Creating an individual circle object
c1 = PlanarCircle(label="Borehole_A", radius=3.5)

print(f"Shape Label      : {c1.label}")            # Instance attribute unique to c1
print(f"Radius Value     : {c1.radius} mm")         # Instance attribute unique to c1
print(f"Coordinate Plane : {c1.coordinate_plane}")   # Class attribute shared by all
```

<span id="part-4-geometry-example"></span>
### 5.5 Geometry Syntax Example: `Point2D` and `Circle` Initializers

```python
import math

class Point2D:
    """Represents a discrete 2D Cartesian coordinate point."""
    COORDINATE_SYSTEM: str = "2D Cartesian"  # Class attribute

    def __init__(self, x: float, y: float, label: str = "Origin"):
        # Instance attributes bound to this specific point
        self.x: float = float(x)
        self.y: float = float(y)
        self.label: str = label

    def distance_from_origin(self) -> float:
        """Euclidean distance to (0, 0) via hypotenuse formula: √(x² + y²)"""
        return math.hypot(self.x, self.y)

    def translate(self, dx: float, dy: float) -> None:
        """Translates the point's position by dx and dy."""
        self.x += dx
        self.y += dy

# Instantiating points with __init__ parameters
pt_a = Point2D(x=3.0, y=4.0, label="P_Alpha")
pt_b = Point2D(x=6.0, y=8.0, label="P_Beta")

print(f"[{pt_a.label}] Coordinates: ({pt_a.x}, {pt_a.y}) | Distance to Origin: {pt_a.distance_from_origin():.1f}")
print(f"[{pt_b.label}] Coordinates: ({pt_b.x}, {pt_b.y}) | Distance to Origin: {pt_b.distance_from_origin():.1f}")

# Demonstrating self: mutating pt_a does not touch pt_b
pt_a.translate(dx=1.0, dy=0.0)
print(f"After translating pt_a: ({pt_a.x}, {pt_a.y}) | pt_b remains: ({pt_b.x}, {pt_b.y})")
```

#### Output:
```text
[P_Alpha] Coordinates: (3.0, 4.0) | Distance to Origin: 5.0
[P_Beta] Coordinates: (6.0, 8.0) | Distance to Origin: 10.0
After translating pt_a: (4.0, 4.0) | pt_b remains: (6.0, 8.0)
```

[🔝 Back to Top](#top)

---

<span id="part-5"></span>
## 6. Part 5: Custom String Representation with `__str__()` and `__repr__()`

<span id="part-5-default-output"></span>
### 6.1 The Problem with Default Python Output (`<__main__... at 0x...>`)

When you create an object and print it without defining custom string representations, Python prints its internal type name and memory address:
```python
p = Point2D(3.0, 4.0)
print(p)
# Output: <__main__.Point2D object at 0x0000021A4B0F10>
```

This output is nearly useless in a CAD or engineering workspace. An engineer reviewing coordinates wants to see `Point(x=3.0, y=4.0)`, not an opaque hex memory address!

<span id="part-5-str-role"></span>
### 6.2 The Role of `__str__()` (Human-Readable Output)

The **`__str__()`** dunder method defines what happens when your object is converted to a string for end users:
- Invoked automatically by `print(obj)` and `str(obj)`.
- Intended to be **readable, clean, and intuitive** for human users or UI displays.
- Must always return a `str`.

For example, in a geometric coordinate class:
```python
def __str__(self) -> str:
    # Formats state cleanly for human presentation:
    return f"Point '{self.label}' at ({self.x:.1f}, {self.y:.1f})"
```

<span id="part-5-repr-companion"></span>
### 6.3 The Critical Companion: `__repr__()` (Developer & Debug Output)

While basic introductions often stop at `__str__()`, professional Python engineering requires understanding **`__repr__()`**:

| Method | Target Audience | Primary Goal | Typical Format |
| :--- | :--- | :--- | :--- |
| **`__str__()`** | End-users, UI displays, Logs | Maximum readability | `"Point 'Vertex A' at (3.0, 4.0)"` |
| **`__repr__()`** | Developers, Debuggers, REPL | Unambiguous code representation | `"Point2D(x=3.0, y=4.0, label='Vertex A')"` |

> [!TIP]
> A great rule of thumb for `__repr__()`: If possible, write the string such that copying and pasting it into Python (`eval(repr(obj))`) recreates an identical object!
> If a class implements `__repr__()` but omits `__str__()`, Python will automatically fall back to using `__repr__()` for `print(obj)`.

<span id="part-5-geometry-example"></span>
### 6.4 Geometry Syntax Example: Expressive Vector & Circle Inspection

```python
import math

class Circle2D:
    """Models a planar circular disc with precision string representations."""
    def __init__(self, center_x: float, center_y: float, radius: float, tag: str = "Circle"):
        if radius <= 0:
            raise ValueError(f"Radius must be strictly positive. Received: {radius}")
        self.center_x = float(center_x)
        self.center_y = float(center_y)
        self.radius = float(radius)
        self.tag = tag

    def calculate_area(self) -> float:
        return math.pi * (self.radius ** 2)

    # 1. Human-Readable Presentation String
    def __str__(self) -> str:
        return f"[{self.tag}] Radius: {self.radius:.2f} mm @ ({self.center_x:.1f}, {self.center_y:.1f})"

    # 2. Unambiguous Developer Diagnostic String
    def __repr__(self) -> str:
        return f"Circle2D(center_x={self.center_x}, center_y={self.center_y}, radius={self.radius}, tag={self.tag!r})"

# Instantiating geometry objects
c1 = Circle2D(center_x=0.0, center_y=0.0, radius=5.0, tag="Inner Bore")
c2 = Circle2D(center_x=12.5, center_y=20.0, radius=8.75, tag="Mount Flange")

# Invoking __str__() via print()
print("--- End-User View (__str__) ---")
print(c1)
print(c2)

# Invoking __repr__() in container inspection or via repr()
print("\n--- Developer Diagnostic View (__repr__) ---")
print(repr(c1))
print([c1, c2])  # Lists display the __repr__ of contained objects!
```

#### Output:
```text
--- End-User View (__str__) ---
[Inner Bore] Radius: 5.00 mm @ (0.0, 0.0)
[Mount Flange] Radius: 8.75 mm @ (12.5, 20.0)

--- Developer Diagnostic View (__repr__) ---
Circle2D(center_x=0.0, center_y=0.0, radius=5.0, tag='Inner Bore')
[Circle2D(center_x=0.0, center_y=0.0, radius=5.0, tag='Inner Bore'), Circle2D(center_x=12.5, center_y=20.0, radius=8.75, tag='Mount Flange')]
```

[🔝 Back to Top](#top)

---

<span id="part-6"></span>
## 7. Part 6: Deep Dive — Class Variables vs. Instance Variables

Because the distinction between class and instance variables is one of the most common sources of subtle production bugs in Python, we provide an exhaustive, practical breakdown here.

<span id="part-6-namespace-lookup"></span>
### 7.1 Namespace Resolution Hierarchy (Instance $\to$ Class)

When you access an attribute via `instance.attr`, Python executes a strict lookup order:
1. **Instance Namespace (`instance.__dict__`):** Does this specific object hold an attribute named `attr`? If yes, return it.
2. **Class Namespace (`type(instance).__dict__`):** Does the class blueprint define `attr`? If yes, return it.
3. **Inheritance MRO (Base Classes):** Does any ancestor parent class define `attr`?
4. **AttributeError:** If nowhere to be found, Python raises `AttributeError`.

```
                  ATTRIBUTE ACCESS: `p1.coordinate_plane`
                                   │
                                   ▼
            ┌──────────────────────────────────────────────┐
            │ 1. Check Instance: `p1.__dict__`             │
            │    Does 'coordinate_plane' exist here?       │
            └──────────────────────┬───────────────────────┘
                        NO         │          YES ──► Return instance value
                                   ▼
            ┌──────────────────────────────────────────────┐
            │ 2. Check Class: `Point2D.__dict__`           │
            │    Does 'coordinate_plane' exist here?       │
            └──────────────────────┬───────────────────────┘
                                   │ YES
                                   ▼
                     Return "Cartesian 2D" (Class Value)
```

<span id="part-6-shadowing-trap"></span>
### 7.2 The Shadowing Trap: `self.attr` vs. `ClassName.attr`

What happens if you reassign an attribute that was originally defined at the class level?

- If you write `ClassName.attr = new_value`, you update the class attribute for **all current and future instances**.
- If you write `self.attr = new_value` through an instance, you **do not modify the class attribute**! Instead, Python silently creates a brand-new **instance attribute** on that single object that **shadows (masks)** the class attribute!

```python
class GeometricFigure:
    COLOR_THEME = "Black/White"  # Class attribute

fig1 = GeometricFigure()
fig2 = GeometricFigure()

# Shadowing via instance assignment:
fig1.COLOR_THEME = "Blueprint Cyan"  # Creates instance variable on fig1 only!

print(f"fig1 Theme: {fig1.COLOR_THEME}")  # "Blueprint Cyan" (from fig1.__dict__)
print(f"fig2 Theme: {fig2.COLOR_THEME}")  # "Black/White"    (still from Class)
print(f"Class Theme: {GeometricFigure.COLOR_THEME}")  # "Black/White"
```

<span id="part-6-mutable-trap"></span>
### 7.3 The Mutable Class Attribute Disaster (Shared Lists/Dictionaries)

If a class attribute is an **immutable** type (like `int`, `float`, `str`, `tuple`), the shadowing trap creates an annoyance. But if the class attribute is a **mutable** type (like `list`, `dict`, `set`), it causes severe, silent data corruption across unrelated objects. (See [Case Study 1](#case-study-1) for a full breakdown).

<span id="part-6-best-practice"></span>
### 7.4 Best Practice Matrix: When to Use Class vs. Instance Variables

| Criteria | Class Attribute | Instance Attribute |
| :--- | :--- | :--- |
| **Where Declared** | Directly inside `class` body, outside any method. | Inside `__init__()`, bound to `self.`. |
| **Memory Allocation** | One single copy stored in the class namespace. | Separate copy allocated in heap for each object. |
| **Best Used For** | Universal constants, mathematical configurations, default units, shared ID counters. | Unique spatial coordinates ($x, y$), custom dimensions ($w, h, r$), instance labels. |
| **Mutation Rule** | Always mutate via `ClassName.var = ...`. | Always mutate via `self.var = ...` or methods. |
| **Safety Warning** | **Never place mutable containers (`[]`, `{}`) here!** | Safely hold mutable vertex lists or logs. |

[🔝 Back to Top](#top)

---

<span id="part-7"></span>
## 8. Part 7: Methods in Classes (Instance, Class, and Static Methods)

Classes contain more than just simple functions. Python provides three distinct categories of methods, each tailored to a specific architectural responsibility:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE THREE METHOD TIERS IN PYTHON                      │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ 1. INSTANCE METHOD       │ 2. CLASS METHOD          │ 3. STATIC METHOD      │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ Signature:               │ Signature:               │ Signature:            │
│  def method(self, ...)   │  @classmethod            │  @staticmethod        │
│                          │  def method(cls, ...)    │  def method(...)      │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ First Argument:          │ First Argument:          │ First Argument:       │
│  `self` (Instance)       │  `cls` (Class itself)    │  None (Pure function) │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ Access Scope:            │ Access Scope:            │ Access Scope:         │
│  Can read/write instance │  Can read/write class    │  No access to self or │
│  and class attributes.   │  state & spawn instances.│  cls. Independent.    │
├──────────────────────────┼──────────────────────────┼───────────────────────┤
│ Geometry Purpose:        │ Geometry Purpose:        │ Geometry Purpose:     │
│  Transform coordinates,  │  Factory constructors    │  Math validation and  │
│  compute area/perimeter. │  (e.g., from diameter).  │  unit conversions.    │
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

<span id="part-7-instance-methods"></span>
### 8.1 Instance Methods (`def method(self)`)
- The default method type in Python.
- Takes `self` as the mandatory first parameter.
- Operates on the internal state of a specific concrete instance.

<span id="part-7-class-methods"></span>
### 8.2 Class Methods (`@classmethod` and `cls`) as Factory Constructors
- Decorated with `@classmethod`.
- Takes `cls` (the class object itself) as the first parameter.
- **Why use it?** In geometry, shapes can often be created through multiple mathematical formulas. For example, a circle can be specified by its **radius**, or by its **diameter**, or by **three perimeter points**. Because Python does not support multiple `__init__()` method signatures (method overloading), `@classmethod` provides elegant **Alternative Factory Constructors**!

<span id="part-7-static-methods"></span>
### 8.3 Static Methods (`@staticmethod`) as Pure Mathematical Utilities
- Decorated with `@staticmethod`.
- Does not receive `self` or `cls`. It is a plain function living inside the class's logical namespace.
- **Why use it?** When a calculation is conceptually tied to the geometry class, but does not need to inspect or mutate any object state (e.g. validating coordinate ranges, converting radians to degrees).

<span id="part-7-geometry-example"></span>
### 8.4 Geometry Syntax Example: A Complete `Circle2D` Engineering Class

```python
import math

class Circle2D:
    """Industrial-grade 2D Circle demonstrating all three method tiers."""
    DEFAULT_UNIT: str = "cm"

    def __init__(self, radius: float, center_x: float = 0.0, center_y: float = 0.0):
        # Validation using static method helper
        if not self.is_valid_radius(radius):
            raise ValueError(f"Radius must be a positive number. Received: {radius}")
        self.radius = float(radius)
        self.center_x = float(center_x)
        self.center_y = float(center_y)

    # 1. INSTANCE METHOD: Operates on self
    def calculate_area(self) -> float:
        return math.pi * (self.radius ** 2)

    def calculate_circumference(self) -> float:
        return 2.0 * math.pi * self.radius

    # 2. CLASS METHOD: Factory constructor building Circle from diameter instead of radius
    @classmethod
    def from_diameter(cls, diameter: float, center_x: float = 0.0, center_y: float = 0.0) -> "Circle2D":
        """Factory: Instantiates a Circle2D given its diameter."""
        computed_radius = diameter / 2.0
        return cls(radius=computed_radius, center_x=center_x, center_y=center_y)

    # 3. STATIC METHOD: Pure utility function with zero dependencies on self or cls
    @staticmethod
    def is_valid_radius(r: float) -> bool:
        """Validates if a given number can physically serve as a radius."""
        return isinstance(r, (int, float)) and r > 0.0

    def __repr__(self) -> str:
        return f"Circle2D(radius={self.radius}, center=({self.center_x}, {self.center_y}))"

# 1. Using standard __init__ constructor
circle_a = Circle2D(radius=7.0, center_x=2.0, center_y=3.0)
print(f"Circle A (from radius 7.0): Area = {circle_a.calculate_area():.2f} {circle_a.DEFAULT_UNIT}²")

# 2. Using alternative classmethod factory constructor
circle_b = Circle2D.from_diameter(diameter=14.0, center_x=2.0, center_y=3.0)
print(f"Circle B (from diameter 14.0): {circle_b}")

# 3. Using static utility method
print(f"Is radius -5.0 valid? {Circle2D.is_valid_radius(-5.0)}")
print(f"Is radius 10.5 valid? {Circle2D.is_valid_radius(10.5)}")
```

#### Output:
```text
Circle A (from radius 7.0): Area = 153.94 cm²
Circle B (from diameter 14.0): Circle2D(radius=7.0, center=(2.0, 3.0))
Is radius -5.0 valid? False
Is radius 10.5 valid? True
```

[🔝 Back to Top](#top)

---

<span id="part-8"></span>
## 9. Part 8: Comprehensive Comparative Breakdown: Class vs. Object

Below is the expanded, engineering-grade comparative breakdown between a class and an object:

<span id="part-8-comparison-table"></span>
### 8.1 The Head-to-Head Architectural Comparison

| Dimension | Class (The Analytical Blueprint) | Object (The Concrete Figure) |
| :--- | :--- | :--- |
| **Fundamental Nature** | Abstract template or specification defining structure and behavior. | Live physical entity holding actual values in memory. |
| **Creation Mechanism** | Declared in source code using the `class` keyword. | Instantiated at runtime by calling the class (`obj = ClassName()`). |
| **Memory Allocation** | Allocated once when the module/script is compiled and loaded. | Allocated dynamically on the system heap every time an instance is spawned. |
| **State Storage** | Stores shared class attributes in `ClassName.__dict__`. | Stores unique instance state in its private `instance.__dict__`. |
| **Analogy in Geometry** | Euclid's universal formula for an equilateral triangle. | A specific aluminum equilateral triangle plate with side $s = 10\text{ cm}$. |
| **Python Syntax Check** | `isinstance(Circle, type) == True` | `isinstance(c1, Circle) == True` |
| **Quantity** | There is only one `Circle` class definition in memory. | There can be millions of distinct `Circle` objects instantiated from it. |

<span id="part-8-flowchart"></span>
### 8.2 Namespace and Memory Flowchart

```
┌────────────────────────────────────────────────────────────────────────┐
│                         PYTHON RUNTIME MEMORY                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ CLASS NAMESPACE: Point2D ]                                          │
│  Location: Heap Memory Block A                                         │
│  Attributes Dictionary:                                                │
│    ├── 'COORDINATE_SYSTEM': "Cartesian 2D"                             │
│    ├── '__init__': <function Point2D.__init__>                         │
│    ├── 'distance_to': <function Point2D.distance_to>                   │
│    └── '__str__': <function Point2D.__str__>                           │
│                                                                        │
│                     ▲                                ▲                 │
│                     │ __class__ pointer              │ __class__       │
│                     │                                │                 │
│  [ INSTANCE #1: pt_a ]              [ INSTANCE #2: pt_b ]              │
│  Location: Heap Memory Block B      Location: Heap Memory Block C      │
│  Unique State (__dict__):           Unique State (__dict__):           │
│    ├── 'x': 0.0                       ├── 'x': 3.0                     │
│    ├── 'y': 0.0                       ├── 'y': 4.0                     │
│    └── 'label': "Origin"              └── 'label': "Anchor"            │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

[🔝 Back to Top](#top)

---

<span id="part-9"></span>
## 10. Part 9: Practical Geometry Case Studies (Failure Analysis & Fixes)

To solidify these concepts, we examine four realistic geometry engineering challenges. Each case study details the scenario, exhibits the broken code, explains the failure mechanism step-by-step, and delivers the production-ready solution.

---

<span id="case-study-1"></span>
### Case Study 1: The Mutable Vertex List Leaking Across Polygons

<details open>
<summary>📐 <b>Case Study 1: The Mutable Class Attribute Disaster</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: CAD Polyline Vertex Contamination
A junior CAD programmer is writing a `Polygon` class to manage 2D polygons for CNC sheet-metal cutouts. They define a `vertices` list to hold the $(x, y)$ coordinate tuples of the shape. Mistakenly, they declare `vertices = []` as a **class attribute** instead of inside `__init__()`.

---

#### ❌ Broken Code (The Problem)
```python
class BrokenPolygon:
    # ❌ FATAL BUG: Declaring mutable container at the class level!
    vertices: list = []

    def __init__(self, name: str):
        self.name = name

    def add_vertex(self, x: float, y: float) -> None:
        self.vertices.append((x, y))

# Creating two distinct polygons
triangle = BrokenPolygon("Triangle")
triangle.add_vertex(0.0, 0.0)
triangle.add_vertex(3.0, 0.0)
triangle.add_vertex(0.0, 4.0)

quadrilateral = BrokenPolygon("Square")
quadrilateral.add_vertex(10.0, 10.0)
quadrilateral.add_vertex(10.0, 20.0)

print(f"Triangle Vertices ({len(triangle.vertices)}): {triangle.vertices}")
print(f"Square Vertices   ({len(quadrilateral.vertices)}): {quadrilateral.vertices}")
```

#### 💥 Error / Unexpected Output:
```text
Triangle Vertices (5): [(0.0, 0.0), (3.0, 0.0), (0.0, 4.0), (10.0, 10.0), (10.0, 20.0)]
Square Vertices   (5): [(0.0, 0.0), (3.0, 0.0), (0.0, 4.0), (10.0, 10.0), (10.0, 20.0)]
```

*What went wrong?*
The triangle now contains 5 vertices including the square's corners! Because `vertices = []` was placed directly in the class body, Python created **only one list** in memory. Both `triangle` and `quadrilateral` reference that identical list in RAM. Modifying one silently corrupted the other.

---

#### 🔍 Step-by-Step Breakdown:
1. **Shared Memory Reference:** When `BrokenPolygon` is compiled, `vertices = []` allocates a single list object.
2. **Delegated Lookup:** When calling `self.vertices.append()`, Python looks up `vertices` on `self`. Finding none in the instance dictionary, it falls back to the class attribute and appends to the shared list.
3. **The Solution:** Instance-specific storage (lists, dicts, arrays) must **always** be initialized inside `__init__()` on `self`.

---

#### ✅ Fixed Code (The Solution)
```python
class CleanPolygon:
    def __init__(self, name: str):
        self.name = name
        # ✅ Isolated: Every polygon instance receives its own unique list in RAM!
        self.vertices: list = []

    def add_vertex(self, x: float, y: float) -> None:
        self.vertices.append((float(x), float(y)))

    def vertex_count(self) -> int:
        return len(self.vertices)

triangle = CleanPolygon("Triangle")
triangle.add_vertex(0.0, 0.0)
triangle.add_vertex(3.0, 0.0)
triangle.add_vertex(0.0, 4.0)

quadrilateral = CleanPolygon("Square")
quadrilateral.add_vertex(10.0, 10.0)
quadrilateral.add_vertex(10.0, 20.0)

print(f"✅ {triangle.name} Vertices ({triangle.vertex_count()}): {triangle.vertices}")
print(f"✅ {quadrilateral.name} Vertices ({quadrilateral.vertex_count()}): {quadrilateral.vertices}")
```

#### 🎉 Output:
```text
✅ Triangle Vertices (3): [(0.0, 0.0), (3.0, 0.0), (0.0, 4.0)]
✅ Square Vertices (2): [(10.0, 10.0), (10.0, 20.0)]
```

</details>

---

<span id="case-study-2"></span>
### Case Study 2: Memory Identity (`is`) vs. Spatial Equality (`==`)

<details open>
<summary>📐 <b>Case Study 2: Memory Identity vs. Coordinate Value Equality</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: CAD Polyline Vertex Deduplication
A path planning algorithm for a 3D printer needs to eliminate duplicate consecutive vertices along a toolpath. Two distinct point instances share the exact same spatial coordinate $(5.0, 12.0)$. The algorithm checks `if p1 == p2: skip_vertex()`. 

---

#### ❌ Broken Code (The Problem)
```python
class NaiveCoordinate:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

node_a = NaiveCoordinate(5.0, 12.0)
node_b = NaiveCoordinate(5.0, 12.0)

print(f"Identity Check (node_a is node_b) : {node_a is node_b}")
print(f"Equality Check (node_a == node_b) : {node_a == node_b}  <-- ❌ Evaluates to False!")
```

#### 💥 Error / Unexpected Output:
```text
Identity Check (node_a is node_b) : False
Equality Check (node_a == node_b) : False  <-- ❌ Evaluates to False!
```

*What went wrong?*
Mathematically, $(5.0, 12.0)$ is identical to $(5.0, 12.0)$. But in Python, if your class does not define the **`__eq__()`** dunder method, the `==` operator falls back to testing **memory identity** (`id(node_a) == id(node_b)`). Because `node_a` and `node_b` live at different heap memory addresses, Python treats them as unequal!

---

#### 🔍 Step-by-Step Breakdown:
1. **`is` operator:** Checks if two variables point to the exact same memory address (`id(a) == id(b)`).
2. **`==` operator:** Checks value equivalence. For custom classes, you must implement `__eq__(self, other)` to teach Python what "equality" means in your domain.
3. **Floating-point safety:** When comparing coordinates, always use `math.isclose()` to prevent false negatives caused by floating-point rounding inaccuracies (e.g. $0.1 + 0.2 \ne 0.3$).

---

#### ✅ Fixed Code (The Solution)
```python
import math

class RobustCoordinate:
    def __init__(self, x: float, y: float):
        self.x = float(x)
        self.y = float(y)

    # ✅ Teach Python how to compare two geometric coordinates
    def __eq__(self, other: object) -> bool:
        if not isinstance(other, RobustCoordinate):
            return NotImplemented
        return math.isclose(self.x, other.x, abs_tol=1e-7) and \
               math.isclose(self.y, other.y, abs_tol=1e-7)

    def __repr__(self) -> str:
        return f"Coord({self.x}, {self.y})"

node_a = RobustCoordinate(5.0, 12.0)
node_b = RobustCoordinate(5.0, 12.0)
node_c = node_a  # Alias pointing to same memory address

print(f"node_a: {node_a} @ {hex(id(node_a))}")
print(f"node_b: {node_b} @ {hex(id(node_b))}")
print(f"node_c: {node_c} @ {hex(id(node_c))}")

print(f"\n✅ Spatial Equality (node_a == node_b) : {node_a == node_b} (Same coordinates)")
print(f"✅ Memory Identity (node_a is node_b) : {node_a is node_b} (Distinct objects in RAM)")
print(f"✅ Memory Identity (node_a is node_c) : {node_a is node_c} (Same pointer in RAM)")
```

#### 🎉 Output:
```text
node_a: Coord(5.0, 12.0) @ 0x1cf9e350
node_b: Coord(5.0, 12.0) @ 0x1cf9e3b0
node_c: Coord(5.0, 12.0) @ 0x1cf9e350

✅ Spatial Equality (node_a == node_b) : True (Same coordinates)
✅ Memory Identity (node_a is node_b) : False (Distinct objects in RAM)
✅ Memory Identity (node_a is node_c) : True (Same pointer in RAM)
```

</details>

---

<span id="case-study-3"></span>
### Case Study 3: The Missing `self` Parameter in Vector Translation

<details open>
<summary>📐 <b>Case Study 3: The Missing `self` Parameter Error</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: Translation Vector Bug
A developer implements a `translate` method on a 2D vector class. They write standard mathematical parameters `(dx, dy)`, but forget to include `self` in the parameter signature.

---

#### ❌ Broken Code (The Problem)
```python
class BrokenVector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    # ❌ FATAL BUG: Forgot 'self' parameter!
    def translate(dx: float, dy: float):
        # Python will try to pass the instance as the 1st parameter ('dx')!
        pass

vec = BrokenVector(2.0, 5.0)
vec.translate(3.0, 4.0)
```

#### 💥 Error Output:
```text
TypeError: BrokenVector.translate() takes 2 positional arguments but 3 were given
```

*Why does Python say 3 arguments were given when we only wrote 2?*
Because `vec.translate(3.0, 4.0)` is translated by Python into:
`BrokenVector.translate(vec, 3.0, 4.0)`. Python supplied `vec` as argument #1, `3.0` as argument #2, and `4.0` as argument #3! Since the definition only had two parameters `(dx, dy)`, Python threw a `TypeError`.

---

#### ✅ Fixed Code (The Solution)
```python
class WorkingVector:
    def __init__(self, x: float, y: float):
        self.x = float(x)
        self.y = float(y)

    # ✅ Correct: 'self' is explicitly declared as parameter #1
    def translate(self, dx: float, dy: float) -> None:
        self.x += dx
        self.y += dy

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

vec = WorkingVector(2.0, 5.0)
vec.translate(3.0, 4.0)
print(f"✅ Translated Vector: {vec}")
```

#### 🎉 Output:
```text
✅ Translated Vector: Vector(5.0, 9.0)
```

</details>

---

<span id="case-study-4"></span>
### Case Study 4: Geometric Object Composition (`LineSegment2D` built from `Point2D`)

<details open>
<summary>📐 <b>Case Study 4: Building Higher-Order Geometry via Composition</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: Creating a Line Segment from Two Discrete Points
In real-world CAD, classes are not isolated islands; they interact and compose. A `LineSegment2D` has a start point and an end point. Instead of duplicating `start_x, start_y, end_x, end_y`, an elegant OOP design **composes** two `Point2D` objects inside `LineSegment2D`.

```python
import math

class Point2D:
    def __init__(self, x: float, y: float, label: str = "P"):
        self.x = float(x)
        self.y = float(y)
        self.label = label

    def distance_to(self, other: "Point2D") -> float:
        return math.hypot(self.x - other.x, self.y - other.y)

    def __repr__(self) -> str:
        return f"{self.label}({self.x:.1f}, {self.y:.1f})"

class LineSegment2D:
    """A line segment defined by two composed Point2D instances."""
    def __init__(self, start: Point2D, end: Point2D, layer: str = "Geometry"):
        # Composition: Storing existing objects as internal state!
        self.start = start
        self.end = end
        self.layer = layer

    def calculate_length(self) -> float:
        """Delegates distance math to the start Point2D object!"""
        return self.start.distance_to(self.end)

    def calculate_midpoint(self) -> Point2D:
        """Computes and returns a BRAND NEW Point2D instance at the midpoint."""
        mid_x = (self.start.x + self.end.x) / 2.0
        mid_y = (self.start.y + self.end.y) / 2.0
        return Point2D(x=mid_x, y=mid_y, label="Midpoint")

    def __str__(self) -> str:
        return f"Line [{self.start} -> {self.end}] on Layer '{self.layer}'"

# 1. Instantiate endpoints
p_start = Point2D(x=0.0, y=0.0, label="Start")
p_end = Point2D(x=6.0, y=8.0, label="End")

# 2. Compose into LineSegment2D
segment = LineSegment2D(start=p_start, end=p_end)

print(segment)
print(f"📏 Segment Length : {segment.calculate_length():.2f} units")
print(f"📍 Midpoint       : {segment.calculate_midpoint()}")
```

#### 🎉 Output:
```text
Line [Start(0.0, 0.0) -> End(6.0, 8.0)] on Layer 'Geometry'
📏 Segment Length : 10.00 units
📍 Midpoint       : Midpoint(3.0, 4.0)
```

</details>

[🔝 Back to Top](#top)

---

<span id="part-10"></span>
## 11. Part 10: Summary, Key Takeaways & Mental Models

<span id="golden-rules"></span>
### 10.1 Ten Golden Rules of Python Classes & Objects

1. **Classes are Blueprints; Objects are Physical Realities**:  
   The `Circle` class does not occupy canvas area—it is only the definition. An object `c1 = Circle(radius=5.0)` is a concrete physical entity with its own distinct memory address (`id(c1)`).
2. **Always Bind Instance State in `__init__()`**:  
   Do not assign instance attributes outside methods. Initialize all fields on `self` inside `__init__()` so every object starts in a complete, valid state.
3. **`self` Represents the Concrete Instance**:  
   Python passes the invoking object as `self` automatically. Inside a method, `self.x` accesses this specific object's coordinate.
4. **Never Put Mutable Containers in Class Attributes**:  
   `vertices = []` or `cache = {}` at the class level will be shared globally by every instance, leading to devastating data leakage bugs.
5. **Implement Both `__str__()` and `__repr__()`**:  
   Use `__str__()` for human-readable presentations (`"Circle @ (0, 0)"`), and `__repr__()` for unambiguous developer debugging (`"Circle2D(radius=5.0)"`).
6. **Override `__eq__()` for Value Equality**:  
   By default, Python compares objects by memory identity (`id(a) == id(b)`). Implement `__eq__()` using floating-point tolerances (`math.isclose`) to verify geometric equivalence.
7. **Use `@classmethod` as Alternative Constructors**:  
   Since Python lacks method overloading, use `@classmethod` to offer flexible constructors (e.g. `Circle.from_diameter(d)`).
8. **Use `@staticmethod` for Decoupled Utilities**:  
   If a helper method does not need `self` or `cls` (such as validating coordinate inputs or converting units), mark it with `@staticmethod`.
9. **Beware Attribute Shadowing**:  
   Writing `self.CLASS_VAR = 10` does not change the class attribute; it creates a new instance attribute on `self` that hides the class attribute.
10. **Prefer Composition Over Monolithic Classes**:  
    Build complex geometries (like polygons and line segments) by composing simpler primitives (like points and vectors).

<span id="mental-models"></span>
### 10.2 Architectural Mental Models for Geometry Software

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   THE PYTHON CLASS/OBJECT ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   class Blueprint:               # Analytical Definition                    │
│     CONSTANT = value             # Class Attribute (Shared by all)          │
│                                                                             │
│     def __init__(self, data):    # Constructor / Initializer                │
│       self.data = data           # Instance Attribute (Unique to this)      │
│                                                                             │
│     def behavior(self):          # Instance Method (Transforms self)        │
│       return self.data * 2                                                  │
│                                                                             │
│     @classmethod                 # Factory Constructor                      │
│     def create_alt(cls, raw):                                               │
│       return cls(parsed_data)                                               │
│                                                                             │
│     @staticmethod                # Pure Utility                             │
│     def validate(val):                                                      │
│       return val > 0                                                        │
│                                                                             │
│     def __str__(self):           # User-Facing String                       │
│       return f"Info: {self.data}"                                           │
│                                                                             │
│     def __repr__(self):          # Debug-Facing Code String                 │
│       return f"Blueprint({self.data!r})"                                    │
│                                                                             │
│     def __eq__(self, other):     # Value Equality Check                     │
│       return self.data == other.data                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

[🔝 Back to Top](#top)
