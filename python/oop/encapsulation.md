<span id="top"></span>

# Python Encapsulation — In-Depth Comprehensive Guide

> **Source Article:** [GeeksforGeeks — Encapsulation in Python](https://www.geeksforgeeks.org/python/encapsulation-in-python/)  
> **Topic:** Encapsulation in Python — Data Hiding, Access Specifiers (Public, Protected, Private), Name Mangling, Getters/Setters, and Managed Properties (`@property`)  
> **Domain Focus:** Mathematical Geometry, 2D Cartesian Coordinate Systems & Precision Optical Lens Study Cases  
> **User Prompt:** "reexplain the following article part by part, easy to understand and coherence example in math geometry simple study cases with the background: https://www.geeksforgeeks.org/python/encapsulation-in-python/"  

---

## Table of Contents
1. [Background & Conceptual Intuition: Why Geometry Demands Encapsulation](#background-intuition)
   - [1.1 Physical and Analytical Invariants in Euclidean Space](#geometry-invariants)
   - [1.2 The Peril of Raw Attribute Mutation: Negative Radii and Corrupted Math](#peril-raw-mutation)
   - [1.3 System Architecture Diagram: The Encapsulated Geometry Firewall](#system-architecture)
2. [Part 1: What is Encapsulation? (Bundling & Invariant Defense)](#part-1)
   - [2.1 Formal Definition: Cohesion of State, Behavior & Integrity](#part-1-definition)
   - [2.2 The Dual Mechanisms: Bundling and Controlled Access](#part-1-dual-mechanisms)
   - [2.3 The Architectural Advantage: Decoupling Interface from Representation](#part-1-decoupling)
3. [Part 2: Access Modifiers in Python (Public, Protected, and Private)](#part-2)
   - [3.1 Python's Access Philosophy: Conventions and "Consenting Adults"](#part-2-philosophy)
   - [3.2 Public Members (`self.name`): Open Spatial Properties](#part-2-public)
   - [3.3 Protected Members (`self._unit`): Subclass Collaboration](#part-2-protected)
   - [3.4 Private Members (`self.__radius`): Defense via Name Mangling](#part-2-private)
   - [3.5 How Name Mangling Works Internally (`_ClassName__attribute`)](#part-2-name-mangling)
4. [Part 3: Declaring Protected and Private Methods](#part-3)
   - [3.1 Internal Mathematical Helper Routines](#part-3-helper-routines)
   - [3.2 Protected Validation Methods (`_validate_bounds()`)](#part-3-protected-methods)
   - [3.3 Private Mathematical Update Engines (`__recompute_affine_matrix()`)](#part-3-private-methods)
   - [3.4 Geometry Code Example: Orchestrated Coordinate Transformation](#part-3-geometry-example)
5. [Part 4: Controlled Access via Getter and Setter Methods](#part-4)
   - [4.1 Classical Accessor & Mutator Patterns](#part-4-classical-patterns)
   - [4.2 Enforcing Invariants at the Setter Gateway](#part-4-enforcing-invariants)
   - [4.3 Geometry Code Example: Defending Against Non-Positive Radius Inputs](#part-4-geometry-example)
6. [Part 5: Pythonic Managed Attributes: `@property` and Setters](#part-5)
   - [5.1 The `@property` Decorator: Clean Dot-Syntax with Full Gatekeeper Protection](#part-5-property-decorator)
   - [5.2 The `@<property>.setter` and Invariant Validation](#part-5-property-setter)
   - [5.3 Dynamic Computed Properties: Eliminating Stale Redundant State](#part-5-computed-properties)
   - [5.4 Geometry Code Example: The Complete `CalibratedCircle` Architecture](#part-5-geometry-example)
7. [Part 6: Practical Geometry Case Studies (Failure Analysis & Fixes)](#part-6)
   - [Case Study 1: The Raw Radius Inversion Disaster (Silent Calculation Corruption)](#case-study-1)
   - [Case Study 2: Optical Ellipse Axis Collapse ($a < b$ Invariant Breach)](#case-study-2)
   - [Case Study 3: The Stale Cached Area Disaster (Redundant Storage vs. Computed Properties)](#case-study-3)
   - [Case Study 4: Accidental Name Collision in Deep Coordinate Hierarchies](#case-study-4)
8. [Part 7: Comprehensive Comparative Breakdown & Key Takeaways](#part-7)
   - [7.1 Access Level Comparative Matrix (Public vs. Protected vs. Private)](#part-7-matrix)
   - [7.2 The Seven Golden Rules of Encapsulated Geometry Design](#golden-rules)
   - [7.3 Architectural Mental Models Summary](#mental-models)

---

<span id="background-intuition"></span>
## 1. Background & Conceptual Intuition: Why Geometry Demands Encapsulation

<span id="geometry-invariants"></span>
### 1.1 Physical and Analytical Invariants in Euclidean Space

In mathematical geometry, every spatial figure is governed by strict **domain invariants**—mathematical and physical laws that must **always remain true**:
- **A Circle's Radius:** Must be strictly positive real numbers ($r > 0$). A circle with radius $r = -5.0\text{ mm}$ or $r = 0.0$ does not physically exist in Euclidean space.
- **A Rectangle's Dimensions:** Width and height must be strictly positive ($w > 0, h > 0$). Negative dimensions create nonsensical negative perimeters.
- **An Optical Ellipse:** By Euclidean definition, its semi-major axis $a$ must be greater than or equal to its semi-minor axis $b$ ($a \ge b > 0$). If $a < b$, the optical axis inverts, causing eccentricity calculations $\sqrt{1 - (b/a)^2}$ to crash with complex numbers.
- **A Triangle's Edges:** Any three edges $(a, b, c)$ must obey the **Triangle Inequality Theorem**: $a + b > c$, $a + c > b$, and $b + c > a$. If three edges do not satisfy this, they cannot physically connect to close a triangle.

<span id="peril-raw-mutation"></span>
### 1.2 The Peril of Raw Attribute Mutation: Negative Radii and Corrupted Math

Consider what happens when an engineering or CAD codebase leaves geometric dimensions exposed as raw, unrestricted public attributes:

```python
# ❌ UNPROTECTED CODE: Zero Encapsulation
class RawCircle:
    def __init__(self, radius: float):
        self.radius = radius

# An external caller or UI slider accidentally assigns an impossible number:
c = RawCircle(5.0)
c.radius = -12.5  # 💥 Physically impossible, but Python allows it!

# Downstream formulas fail or produce nonsensical output:
perimeter = 2 * 3.14159 * c.radius  # Evaluates to -78.54 mm!
```

When data is exposed without defense:
1. **Silent Data Corruption:** Code executes without throwing errors, but computes negative laser cutting travel paths or negative material costs.
2. **Scattered Validation Logic:** Every function in the software that touches `c.radius` must re-check `if c.radius <= 0:` over and over again, cluttering the codebase.
3. **Fragile Couplings:** If internal representations change (e.g. storing radius as micrometers instead of millimeters), all external code reading `c.radius` directly breaks.

<span id="system-architecture"></span>
### 1.3 System Architecture Diagram: The Encapsulated Geometry Firewall

Encapsulation wraps the internal data behind an impenetrable **validation firewall**. External client code communicates strictly through public gateways (getters, setters, or managed `@property` interfaces):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL CLIENT CODE                             │
│                  Executes: `circle.radius = new_value`                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      THE ENCAPSULATED DEFENSE FIREWALL                      │
│                  (@radius.setter Gatekeeper Method)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Validation Check: Is new_value a real number AND new_value > 0.0?           │
│                                                                             │
│   ❌ IF INVALID (e.g., -5.0):                                               │
│      Raise ValueError: "Radius must be strictly positive real number."      │
│      [Internal state remains SAFE and UNCORRUPTED]                          │
│                                                                             │
│   ✅ IF VALID (e.g., 8.5):                                                  │
│      Assign to private storage: self.__radius = float(new_value)            │
│      Synchronize dependent geometry (bounding box, cached matrices)         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PROTECTED INTERNAL STATE IN RAM                       │
│    • Private Attribute: `self.__radius = 8.5` (Mangling: `_Circle__radius`) │
│    • Dynamic Computed State: `diameter` (Derived: 2 · r on the fly)         │
│    • Invariant Guarantee: r > 0 IS MATHEMATICALLY GUARANTEED AT ALL TIMES   │
└─────────────────────────────────────────────────────────────────────────────┘
```

[🔝 Back to Top](#top)

---

<span id="part-1"></span>
## 2. Part 1: What is Encapsulation? (Bundling & Invariant Defense)

<span id="part-1-definition"></span>
### 2.1 Formal Definition: Cohesion of State, Behavior & Integrity

Core definition:
> **Encapsulation** is an object-oriented programming paradigm that **bundles data (attributes) and the methods that operate on that data into a single autonomous unit (a class)**, while **restricting direct external access** to the internal components to protect data integrity and hide implementation details.

In essence:
- **Bundling (Packaging):** Coordinates, dimensions, and equations are not scattered across detached functions; they are packaged together into a unified geometric entity (`Circle`, `Rectangle`, `Vector`).
- **Information Hiding (Shielding):** Internal implementation details, raw storage representations, and intermediate calculation matrices are hidden from external view.
- **Invariant Defense (Gatekeeping):** External code cannot mutate internal values into mathematically or physically impossible states.

<span id="part-1-dual-mechanisms"></span>
### 2.2 The Dual Mechanisms: Bundling and Controlled Access

```
                    ┌────────────────────────────────────────┐
                    │             ENCAPSULATION              │
                    ├────────────────────┬───────────────────┤
                    │   1. BUNDLING      │ 2. CONTROLLED     │
                    │   (Cohesion)       │    ACCESS         │
                    ├────────────────────┼───────────────────┤
                    │ Data (radius) and  │ Restricting       │
                    │ behaviors (area,   │ direct mutation;  │
                    │ perimeter) live in │ enforcing rules   │
                    │ a unified entity.  │ via gatekeepers.  │
                    └────────────────────┴───────────────────┘
```

<span id="part-1-decoupling"></span>
### 2.3 The Architectural Advantage: Decoupling Interface from Representation

Encapsulation separates **what an object does (its public interface)** from **how it stores its data (its internal representation)**:
- A CAD client asks for a circle's diameter: `c.diameter`.
- Internally, does the circle store `self.__radius`, or does it store `self.__diameter`, or does it store a vertex boundary polygon?
- **The client does not know and does not care!** The class author is free to optimize internal memory storage, change coordinate units from inches to millimeters, or add caching, without breaking a single line of client code.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>
## 3. Part 2: Access Modifiers in Python (Public, Protected, and Private)

<span id="part-2-philosophy"></span>
### 3.1 Python's Access Philosophy: Conventions and "Consenting Adults"

In languages like C++, Java, or C#, access levels are enforced by strict compiler keywords (`public`, `protected`, `private`). If code tries to touch a private variable, the code fails to compile.

Python adheres to a different philosophical principle:
> *"We are all consenting adults here."*

Python does not strictly lock memory. Instead, Python relies on **well-defined naming conventions** and an automated runtime mechanism called **Name Mangling**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PYTHON ACCESS SPECIFIER CONVENTIONS                     │
├───────────────┬──────────────────────┬──────────────────────────────────────┤
│ Access Level  │ Naming Syntax        │ Intended Scope & Visibility          │
├───────────────┼──────────────────────┼──────────────────────────────────────┤
│ 1. Public     │ `self.radius`        │ Accessible from anywhere.            │
│ 2. Protected  │ `self._radius`       │ Internal to class and subclasses.    │
│ 3. Private    │ `self.__radius`      │ Internal to class only. Mangled!     │
└───────────────┴──────────────────────┴──────────────────────────────────────┘
```

<span id="part-2-public"></span>
### 3.2 Public Members (`self.name`): Open Spatial Properties

Variables and methods defined without leading underscores are **Public**:
- Freely accessible, readable, and modifiable by any code inside or outside the class.
- Intended for safe, non-invariant attributes (like user-friendly labels or descriptive tags: `self.label = "Hole_A"`).

<span id="part-2-protected"></span>
### 3.3 Protected Members (`self._unit`): Subclass Collaboration

Variables and methods prefixed with a **single leading underscore (`_`)** are **Protected**:
- By convention, this signals to other developers: *"This attribute is internal. Do not touch it from outside, but subclasses are welcome to use it."*
- Python does not enforce this restriction at runtime—it is an engineering agreement respected by linters, IDEs, and professional programmers.
- Ideal for shared framework state (such as measurement units `self._unit = "mm"` or coordinate precision tolerances `self._epsilon = 1e-7`).

<span id="part-2-private"></span>
### 3.4 Private Members (`self.__radius`): Defense via Name Mangling

Variables and methods prefixed with **two leading underscores (and at most one trailing underscore, e.g. `__radius`)** are **Private**:
- Python runtime activates **Name Mangling** to prevent direct external access.
- Intended for mission-critical dimensional state where unauthorized mutation would break physical geometry invariants.

<span id="part-2-name-mangling"></span>
### 3.5 How Name Mangling Works Internally (`_ClassName__attribute`)

When Python compiles a class containing `self.__radius`, it automatically rewrites the attribute name in the object's dictionary namespace:
$$\text{Internal Key} = \text{\_} + \text{ClassName} + \text{\_\_} + \text{attributeName}$$

For example, inside a `PrecisionCircle` class:
`self.__radius` $\to$ internally stored as `_PrecisionCircle__radius`

If external code attempts to access `circle.__radius`, Python looks for `'__radius'` in the object dictionary, fails to find it, and raises an `AttributeError`!

```python
class PrecisionCircle:
    def __init__(self, label: str, radius: float):
        self.label = label              # Public: Safe for open access
        self._unit = "mm"               # Protected: For internal & subclass collaboration
        self.__radius = float(radius)   # Private: Protected by name mangling!

    def get_radius(self) -> float:
        return self.__radius

# Instantiating the circle
c = PrecisionCircle(label="Bore_A", radius=10.0)

# 1. Public member access: Fully accessible
print(f"Public Label   : {c.label}")

# 2. Protected member access: Accessible, but IDE will flag as internal convention
print(f"Protected Unit : {c._unit}")

# 3. Private member access: Throws an AttributeError!
try:
    print(c.__radius)
except AttributeError as err:
    print(f"Private Shield Caught: {err}")

# 4. Inspecting the actual instance dictionary to reveal Name Mangling:
print(f"Object Keys in RAM: {list(c.__dict__.keys())}")
print(f"Accessing via Mangled Name: {c._PrecisionCircle__radius} mm")
```

#### Output:
```text
Public Label   : Bore_A
Protected Unit : mm
Private Shield Caught: 'PrecisionCircle' object has no attribute '__radius'
Object Keys in RAM: ['label', '_unit', '_PrecisionCircle__radius']
Accessing via Mangled Name: 10.0 mm
```

> [!CAUTION]
> While you technically *can* read or mutate `c._PrecisionCircle__radius` using its mangled name, doing so violates Python design contracts, bypasses invariant defense, and creates brittle code that breaks if the class is ever refactored or renamed. Never access mangled attributes directly from outside the class!

[🔝 Back to Top](#top)

---

<span id="part-3"></span>
## 4. Part 3: Declaring Protected and Private Methods

Encapsulation applies equally to **methods**. Not every function written inside a class should be callable by outside users.

<span id="part-3-helper-routines"></span>
### 4.1 Internal Mathematical Helper Routines

In geometric engines, complex operations (such as rotating coordinate systems or projecting bounding boxes) require intermediate mathematical steps:
- Normalizing vectors
- Computing determinants
- Auditing coordinate boundaries

These steps are implementation details. Exposing them on the public interface pollutes the API and confuses users.

<span id="part-3-protected-methods"></span>
### 4.2 Protected Helper Methods (`_validate_bounds()`)
- Defined with a single leading underscore: `def _validate_coordinates(self, x, y):`
- Signals that the helper is intended for internal use and can be extended by derived classes.

<span id="part-3-private-methods"></span>
### 4.3 Private Mathematical Update Engines (`__recompute_affine_matrix()`)
- Defined with double leading underscores: `def __recompute_affine_matrix(self):`
- Name-mangled so it cannot be invoked from outside or accidentally overridden by child subclasses.

<span id="part-3-geometry-example"></span>
### 4.4 Geometry Code Example: Orchestrated Coordinate Transformation

```python
import math

class PlanarPolygon:
    """Demonstrates public, protected, and private methods in geometry."""
    def __init__(self, label: str, vertices: list):
        self.label = label
        self._tolerance = 1e-6                 # Protected tolerance
        self.__vertices = []                   # Private coordinate storage
        self.__set_vertices(vertices)          # Safe private initialization

    # 1. PUBLIC METHOD: The clean, user-facing interface
    def translate(self, dx: float, dy: float) -> None:
        """Translates all vertices by dx and dy."""
        if not self._is_valid_offset(dx, dy):
            raise ValueError("Offset values must be finite real numbers.")
        
        self.__apply_translation_vector(dx, dy)
        print(f"✅ [{self.label}] Successfully translated by ({dx}, {dy})")

    def get_vertices(self) -> list:
        """Public read-only view of vertices."""
        return list(self.__vertices)

    # 2. PROTECTED METHOD: Subclasses can reuse or customize this validation rule
    def _is_valid_offset(self, dx: float, dy: float) -> bool:
        return math.isfinite(dx) and math.isfinite(dy)

    # 3. PRIVATE METHODS: Core internal execution hidden behind name mangling
    def __set_vertices(self, vertices: list) -> None:
        if len(vertices) < 3:
            raise ValueError(f"A polygon requires at least 3 vertices. Received: {len(vertices)}")
        self.__vertices = [(float(x), float(y)) for x, y in vertices]

    def __apply_translation_vector(self, dx: float, dy: float) -> None:
        self.__vertices = [(x + dx, y + dy) for x, y in self.__vertices]

# Instantiating the polygon
triangle = PlanarPolygon("Truss_A", [(0, 0), (4, 0), (0, 3)])

# 1. Invoking public interface: Clean & intuitive
triangle.translate(dx=5.0, dy=2.0)
print(f"Updated Coordinates: {triangle.get_vertices()}")

# 2. Attempting to call private transformation method directly from outside:
try:
    triangle.__apply_translation_vector(1.0, 1.0)
except AttributeError as err:
    print(f"🛡️ Protection Shield Caught: {err}")
```

#### Output:
```text
✅ [Truss_A] Successfully translated by (5.0, 2.0)
Updated Coordinates: [(5.0, 2.0), (9.0, 2.0), (5.0, 5.0)]
🛡️ Protection Shield Caught: 'PlanarPolygon' object has no attribute '__apply_translation_vector'
```

[🔝 Back to Top](#top)

---

<span id="part-4"></span>
## 5. Part 4: Controlled Access via Getter and Setter Methods

<span id="part-4-classical-patterns"></span>
### 5.1 Classical Accessor & Mutator Patterns

In traditional Object-Oriented design, private attributes are exposed via explicit getter and setter functions:
- **Getter (Accessor):** A method that inspects and returns the private value (`get_radius()`).
- **Setter (Mutator):** A method that receives a proposed new value, validates it against domain invariants, and updates the private attribute only if valid (`set_radius(new_val)`).

<span id="part-4-enforcing-invariants"></span>
### 5.2 Enforcing Invariants at the Setter Gateway

The setter method is the **gatekeeper**. It enforces physical and mathematical laws before assignment:

```python
def set_radius(self, new_radius: float) -> None:
    if not isinstance(new_radius, (int, float)):
        raise TypeError(f"Radius must be numeric. Received: {type(new_radius).__name__}")
    if new_radius <= 0:
        raise ValueError(f"Geometry Invariant Violation: Radius must be strictly positive (>0). Received: {new_radius}")
    self.__radius = float(new_radius)
```

<span id="part-4-geometry-example"></span>
### 5.3 Geometry Code Example: Defending Against Non-Positive Radius Inputs

```python
class ClassicalCircle:
    """Demonstrates classical getter and setter methods in geometry invariant defense."""
    def __init__(self, initial_radius: float):
        self.__radius = None  # Placeholder
        self.set_radius(initial_radius)  # Enforce validation on instantiation!

    # Getter Method
    def get_radius(self) -> float:
        return self.__radius

    # Setter Method (Gatekeeper)
    def set_radius(self, new_radius: float) -> None:
        if not isinstance(new_radius, (int, float)):
            raise TypeError("Radius must be an int or float.")
        if new_radius <= 0:
            raise ValueError(f"Radius must be strictly positive (> 0). Received: {new_radius}")
        self.__radius = float(new_radius)

    def calculate_area(self) -> float:
        return 3.1415926535 * (self.__radius ** 2)

# Valid initialization
c = ClassicalCircle(5.0)
print(f"Circle Radius : {c.get_radius()} mm | Area: {c.calculate_area():.2f} mm²")

# Valid update via setter
c.set_radius(8.0)
print(f"Updated Radius: {c.get_radius()} mm | Area: {c.calculate_area():.2f} mm²")

# Invalid update attempt:
try:
    c.set_radius(-10.0)
except ValueError as err:
    print(f"🛡️ Gatekeeper Rejection: {err}")
```

#### Output:
```text
Circle Radius : 5.0 mm | Area: 78.54 mm²
Updated Radius: 8.0 mm | Area: 201.06 mm²
🛡️ Gatekeeper Rejection: Radius must be strictly positive (> 0). Received: -10.0
```

[🔝 Back to Top](#top)

---

<span id="part-5"></span>
## 6. Part 5: Pythonic Managed Attributes: `@property` and Setters

While classical `get_radius()` and `set_radius()` methods work, writing `c.set_radius(c.get_radius() + 2)` is verbose and un-Pythonic.

Python solves this elegantly with the **`@property` decorator**.

<span id="part-5-property-decorator"></span>
### 6.1 The `@property` Decorator: Clean Dot-Syntax with Full Gatekeeper Protection

The `@property` decorator turns an instance method into a **getter** that can be accessed with standard dot syntax:
```python
@property
def radius(self) -> float:
    return self.__radius

# Client writes:
current_r = c.radius  # Calls the method behind the scenes!
```

<span id="part-5-property-setter"></span>
### 6.2 The `@<property>.setter` and Invariant Validation

To allow modification, define a companion setter decorated with `@<property_name>.setter`:
```python
@radius.setter
def radius(self, new_radius: float) -> None:
    if new_radius <= 0:
        raise ValueError("Radius must be > 0")
    self.__radius = float(new_radius)

# Client writes natural assignment:
c.radius = 12.5  # Transparently intercepts and validates!
```

<span id="part-5-computed-properties"></span>
### 6.3 Dynamic Computed Properties: Eliminating Stale Redundant State

One of the greatest dangers in geometry software is storing **redundant, dependent state**:
- If you store `self.radius` AND `self.diameter` AND `self.area` as three separate variables in `__init__`, what happens when someone updates `self.radius = 10.0`?
- Unless you remember to manually update `self.diameter` and `self.area`, **they become stale and desynchronized**!

With `@property`, you compute dependent geometric dimensions dynamically on demand. Zero redundant storage, zero desynchronization risk!

<span id="part-5-geometry-example"></span>
### 6.4 Geometry Code Example: The Complete `CalibratedCircle` Architecture

```python
import math

class CalibratedCircle:
    """State-of-the-art Pythonic encapsulation using managed properties."""
    def __init__(self, radius: float, label: str = "Washer"):
        self.label = label
        # Triggers the @radius.setter immediately for initialization validation!
        self.radius = radius

    # 1. MANAGED PROPERTY: radius (Getter)
    @property
    def radius(self) -> float:
        """Exposes the internal private radius safely."""
        return self.__radius

    # 2. MANAGED PROPERTY SETTER: radius (Gatekeeper)
    @radius.setter
    def radius(self, new_radius: float) -> None:
        """Guarantees Euclidean geometry invariants."""
        if not isinstance(new_radius, (int, float)):
            raise TypeError("Radius must be numeric.")
        if new_radius <= 0:
            raise ValueError(f"Geometry Invariant Violation: Radius must be > 0. Received: {new_radius}")
        self.__radius = float(new_radius)

    # 3. COMPUTED PROPERTY: diameter (Derived: 2 · r, no redundant storage!)
    @property
    def diameter(self) -> float:
        return 2.0 * self.__radius

    @diameter.setter
    def diameter(self, new_diameter: float) -> None:
        """Setting diameter automatically updates the radius!"""
        self.radius = new_diameter / 2.0

    # 4. COMPUTED PROPERTY: area (Derived: π · r²)
    @property
    def area(self) -> float:
        return math.pi * (self.__radius ** 2)

    def __repr__(self) -> str:
        return f"CalibratedCircle(radius={self.radius}, diameter={self.diameter}, area={self.area:.2f})"

# 1. Instantiating
c = CalibratedCircle(radius=5.0, label="Gasket Bore")
print("Initial Circle :", c)

# 2. Natural dot-syntax mutation with automatic invariant validation:
c.radius = 7.5
print("After r = 7.5  :", c)

# 3. Mutating via computed diameter property:
c.diameter = 20.0  # Sets radius to 10.0!
print("After d = 20.0 :", c)

# 4. Invariant violation caught transparently:
try:
    c.radius = -4.0
except ValueError as err:
    print(f"🛡️ Defense Caught: {err}")
```

#### Output:
```text
Initial Circle : CalibratedCircle(radius=5.0, diameter=10.0, area=78.54)
After r = 7.5  : CalibratedCircle(radius=7.5, diameter=15.0, area=176.71)
After d = 20.0 : CalibratedCircle(radius=10.0, diameter=20.0, area=314.16)
🛡️ Defense Caught: Geometry Invariant Violation: Radius must be > 0. Received: -4.0
```

[🔝 Back to Top](#top)

---

<span id="part-6"></span>
## 7. Part 6: Practical Geometry Case Studies (Failure Analysis & Fixes)

To solidify encapsulation in production systems, let us examine four authentic failure scenarios from computational geometry.

---

<span id="case-study-1"></span>
### Case Study 1: The Raw Radius Inversion Disaster (Silent Calculation Corruption)

<details open>
<summary>📐 <b>Case Study 1: The Unprotected Dimension Disaster</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: Laser Cutter Travel Path Reversal
A sheet metal fabrication tool takes circular cutouts and generates CNC G-code toolpaths. Because attributes were completely public, an operator script entered an offset value that resulted in a negative radius. Downstream perimeter calculations produced a negative distance, causing the laser head to crash into the machine limiter.

---

#### ❌ Broken Code (The Problem)
```python
class RawCutout:
    def __init__(self, tag: str, radius: float):
        self.tag = tag
        self.radius = radius  # Public attribute: zero protection!

    def calculate_cutting_path(self) -> float:
        return 2.0 * 3.14159 * self.radius

hole = RawCutout("Mount_Hole", 10.0)

# Unchecked mutation from external script:
hole.radius = -15.0  # 💥 Corrupted physical state!

travel_distance = hole.calculate_cutting_path()
print(f"Cutting path distance: {travel_distance} mm")  # -94.25 mm!
```

---

#### 🔍 Step-by-Step Breakdown:
1. `RawCutout.radius` has no gatekeeper.
2. An external offset operation produced a negative value.
3. The method executed mathematical equations on an impossible physical state without raising any error, leading to machine damage.

---

#### ✅ Fixed Code (The Solution)
```python
class ProtectedCutout:
    def __init__(self, tag: str, radius: float):
        self.tag = tag
        self.radius = radius  # Delegates to @radius.setter

    @property
    def radius(self) -> float:
        return self.__radius

    @radius.setter
    def radius(self, value: float) -> None:
        if not isinstance(value, (int, float)) or value <= 0:
            raise ValueError(f"Cutout radius must be strictly positive (>0). Received: {value}")
        self.__radius = float(value)

    def calculate_cutting_path(self) -> float:
        return 2.0 * 3.14159 * self.__radius

hole = ProtectedCutout("Mount_Hole", 10.0)

try:
    hole.radius = -15.0
except ValueError as err:
    print(f"✅ Invariant Guard Protected System: {err}")
```

#### 🎉 Output:
```text
✅ Invariant Guard Protected System: Cutout radius must be strictly positive (>0). Received: -15.0
```

</details>

---

<span id="case-study-2"></span>
### Case Study 2: Optical Ellipse Axis Collapse ($a < b$ Invariant Breach)

<details open>
<summary>📐 <b>Case Study 2: Multi-Variable Coupled Invariant Defense</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: Optical Lens Simulator Axis Inversion
An optical engineering simulator models elliptical collimator lenses. By Euclidean definition, an ellipse requires that its semi-major axis $a$ is strictly greater than or equal to its semi-minor axis $b$ ($a \ge b > 0$). When a user changed $a$ without updating $b$, the lens inverted, crashing the eccentricity solver with a math domain error.

---

#### ❌ Broken Code (The Problem)
```python
import math

class UnprotectedEllipse:
    def __init__(self, a: float, b: float):
        self.a = a  # Semi-major axis
        self.b = b  # Semi-minor axis

    def calculate_eccentricity(self) -> float:
        # e = √(1 - (b/a)²)
        return math.sqrt(1.0 - (self.b / self.a) ** 2)

lens = UnprotectedEllipse(a=10.0, b=5.0)  # Valid initially: 10 >= 5

# Client mutates 'a' independently:
lens.a = 3.0  # 💥 Now a < b (3.0 < 5.0)!

# lens.calculate_eccentricity()  # 💥 ValueError: math domain error (square root of negative number!)
```

---

#### 🔍 Step-by-Step Breakdown:
1. $a$ and $b$ are coupled geometric variables.
2. Mutating them independently creates a window where $a < b$.
3. When $a < b$, $(b/a) > 1$, making $1 - (b/a)^2$ negative. The square root fails.
4. **The Solution:** Encapsulate both axes, and provide an **atomic synchronized update method**.

---

#### ✅ Fixed Code (The Solution)
```python
import math

class OpticalEllipse:
    """Encapsulated optical lens enforcing coupled geometric invariants."""
    def __init__(self, a: float, b: float):
        self.set_axes(a, b)

    @property
    def a(self) -> float: return self.__a

    @property
    def b(self) -> float: return self.__b

    def set_axes(self, a: float, b: float) -> None:
        """Atomic gatekeeper enforcing physical coupling rules: a >= b > 0."""
        if a <= 0 or b <= 0:
            raise ValueError("Axes must be strictly positive real numbers.")
        if a < b:
            raise ValueError(f"Geometry Invariant Breach: Semi-major axis 'a' ({a}) must be >= semi-minor axis 'b' ({b}).")
        self.__a = float(a)
        self.__b = float(b)

    def calculate_eccentricity(self) -> float:
        return math.sqrt(1.0 - (self.__b / self.__a) ** 2)

lens = OpticalEllipse(a=12.0, b=6.0)
print(f"✅ Calibrated Lens Eccentricity: {lens.calculate_eccentricity():.4f}")

try:
    lens.set_axes(a=4.0, b=9.0)
except ValueError as err:
    print(f"🛡️ Coupled Guard Prevented Inversion: {err}")
```

#### 🎉 Output:
```text
✅ Calibrated Lens Eccentricity: 0.8660
🛡️ Coupled Guard Prevented Inversion: Geometry Invariant Breach: Semi-major axis 'a' (4.0) must be >= semi-minor axis 'b' (9.0).
```

</details>

---

<span id="case-study-3"></span>
### Case Study 3: The Stale Cached Area Disaster (Redundant Storage vs. Computed Properties)

<details open>
<summary>📐 <b>Case Study 3: Eliminating Redundant Stale State</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: Architectural Cost Estimator Desynchronization
An architectural CAD tool calculates aluminum frame pricing. The `Rectangle` class stores `width`, `height`, and a pre-calculated `area` variable in `__init__`. When client code resizes the rectangle, the `area` variable remains unchanged, billing the customer for the wrong square meterage.

---

#### ❌ Broken Code (The Problem)
```python
class DesynchronizedRectangle:
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
        # ❌ FATAL REDUNDANCY: Storing dependent derived state as an independent variable!
        self.area = width * height

r = DesynchronizedRectangle(10.0, 5.0)
print(f"Initial Area: {r.area} m²")  # 50.0 m²

# Resizing the rectangle:
r.width = 20.0
r.height = 10.0

# 💥 The dimensions changed, but self.area is STALE!
print(f"Stale Billed Area: {r.area} m² (Should be 200.0 m²!)")
```

---

#### 🔍 Step-by-Step Breakdown:
1. Storing data that can be calculated on the fly introduces **state desynchronization**.
2. **The Solution:** Convert `area` into a read-only `@property`. It computes the area at the exact moment it is requested, guaranteeing 100% synchronization.

---

#### ✅ Fixed Code (The Solution)
```python
class SynchronizedRectangle:
    def __init__(self, width: float, height: float):
        self.width = float(width)
        self.height = float(height)

    # ✅ Computed property: Dynamically derived, impossible to become stale!
    @property
    def area(self) -> float:
        return self.width * self.height

r = SynchronizedRectangle(10.0, 5.0)
print(f"Initial Area : {r.area} m²")

r.width = 20.0
r.height = 10.0
print(f"✅ Dynamic Area: {r.area} m² (Always synchronized with dimensions!)")
```

#### 🎉 Output:
```text
Initial Area : 50.0 m²
✅ Dynamic Area: 200.0 m² (Always synchronized with dimensions!)
```

</details>

---

<span id="case-study-4"></span>
### Case Study 4: Accidental Name Collision in Deep Coordinate Hierarchies

<details open>
<summary>📐 <b>Case Study 4: Private Name Mangling vs. Subclass Attribute Overwriting</b> (Click to collapse/expand)</summary>

#### 🤖 Scenario: Subclass Overwriting Internal Coordinate Scale
A base class `SpatialFigure` stores a private internal calibration matrix multiplier. A derived class `TexturedPolygon` also introduces an attribute of the same name for visual zoom. Without name mangling, the child would overwrite the parent's physical coordinate scale.

---

#### ✅ Code Demonstration: How Name Mangling Protects Hierarchies
```python
class SpatialFigure:
    def __init__(self, coordinate_scale: float = 1.0):
        # ✅ Private: mangled to _SpatialFigure__scale
        self.__scale = float(coordinate_scale)

    def get_real_world_dimension(self, raw_unit: float) -> float:
        return raw_unit * self.__scale

class TexturedPolygon(SpatialFigure):
    def __init__(self, coordinate_scale: float, visual_zoom: float):
        super().__init__(coordinate_scale)
        # ✅ Private: mangled to _TexturedPolygon__scale (NO COLLISION!)
        self.__scale = float(visual_zoom)

    def get_visual_magnification(self) -> float:
        return self.__scale

poly = TexturedPolygon(coordinate_scale=2.5, visual_zoom=100.0)

print(f"✅ Spatial Scale (Parent): {poly.get_real_world_dimension(10.0)} mm (Uses 2.5x)")
print(f"✅ Visual Zoom   (Child) : {poly.get_visual_magnification()}x (Uses 100.0x)")
print(f"Instance Dictionary Namespace in RAM:")
for k, v in poly.__dict__.items():
    print(f"  {k} = {v}")
```

#### 🎉 Output:
```text
✅ Spatial Scale (Parent): 25.0 mm (Uses 2.5x)
✅ Visual Zoom   (Child) : 100.0x (Uses 100.0x)
Instance Dictionary Namespace in RAM:
  _SpatialFigure__scale = 2.5
  _TexturedPolygon__scale = 100.0
```

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>
## 8. Part 7: Comprehensive Comparative Breakdown & Key Takeaways

<span id="part-7-matrix"></span>
### 7.1 Access Level Comparative Matrix (Public vs. Protected vs. Private)

| Dimension | Public Members | Protected Members | Private Members |
| :--- | :--- | :--- | :--- |
| **Syntax** | `self.label` | `self._unit` | `self.__radius` |
| **Python Mechanism** | Plain dictionary key. | Plain dictionary key. | **Name Mangling** (`_Class__attr`). |
| **Intended Visibility** | Public everywhere. | Class & Subclasses only. | Internal to defining class only. |
| **Runtime Enforcement** | None (Directly accessible). | None (Convention only). | Python blocks `obj.__attr` access. |
| **Geometry Use Case** | Display tags, labels, shape IDs. | Shared tolerances, units, base matrices. | Strict physical invariants ($r > 0, w > 0, a \ge b$). |
| **Best Practice** | Use for non-sensitive data. | Use for subclass customization. | Use for invariant-critical state. |

---

<span id="golden-rules"></span>
### 7.2 The Seven Golden Rules of Encapsulated Geometry Design

1. **Defend Physical Invariants at the Class Boundary**:  
   Never permit impossible dimensions ($r \le 0$, negative coordinates where disallowed). Enforce boundaries via setters.
2. **Never Expose Raw Mutable State Directly**:  
   Wrap geometric dimensions inside `@property` and `@<prop>.setter` methods.
3. **Compute Dependent Properties Dynamically**:  
   Do not store `diameter` or `area` as separate variables. Calculate them on demand via `@property` to prevent state desynchronization.
4. **Use Name Mangling (`__var`) to Defend Base State**:  
   Prefix critical variables with double underscores to prevent subclasses from accidentally overwriting them.
5. **Keep Internal Mathematical Helpers Private**:  
   Internal normalization, determinant, or clipping routines should be private (`__method`) or protected (`_method`).
6. **Use Atomic Setters for Coupled Invariants**:  
   When two or more variables depend on each other (such as an ellipse's semi-major $a$ and semi-minor $b$), update them together in a single atomic method (`set_axes(a, b)`).
7. **Respect the Protected Convention (`_var`)**:  
   Never read or write single-underscore attributes from outside the class hierarchy.

---

<span id="mental-models"></span>
### 7.3 Architectural Mental Models Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   ENCAPSULATED GEOMETRY ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   class EncapsulatedFigure:                                                 │
│       def __init__(self, dimension):                                        │
│           self.label = "Public Tag"      # 1. Public: Free access           │
│           self._unit = "mm"              # 2. Protected: Subclass internal  │
│           self.dimension = dimension     # 3. Routes to @setter             │
│                                                                             │
│       @property                          # 4. Managed Getter                │
│       def dimension(self):                                                  │
│           return self.__dimension       # 5. Private Mangled Storage       │
│                                                                             │
│       @dimension.setter                  # 6. Invariant Gatekeeper          │
│       def dimension(self, val):                                             │
│           if val <= 0:                                                      │
│               raise ValueError("Dimension must be > 0")                     │
│           self.__dimension = float(val)                                     │
│                                                                             │
│       @property                          # 7. Dynamic Computed State        │
│       def derived_area(self):                                               │
│           return self.__dimension ** 2  # Impossible to desynchronize!      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

[🔝 Back to Top](#top)
