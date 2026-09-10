<span id="top"></span>

# Data Abstraction in Python — Comprehensive Chunk-by-Chunk Guide

> **Source Article:** [GeeksforGeeks - Data Abstraction in Python](https://www.geeksforgeeks.org/python/data-abstraction-in-python/)  
> **Topic:** Object-Oriented Programming (OOP) in Python — Data Abstraction & Abstract Base Classes (ABCs)  
> **Domain Focus:** Monster Energy Yamaha MotoGP Team Simple Study Cases (Rider Controls, Power Delivery & Pit Wall Telemetry)  
> **User Prompt:** "reexplain the following article chunk by chunk, easy to understand and coherence example in motogp yamaha team simple study cases: https://www.geeksforgeeks.org/python/data-abstraction-in-python/"

---

## 📚 Table of Contents
1. [🏍️ Real-World & Conceptual Intuition](#real-world-intuition)
2. [📌 Chunk 1: What is Data Abstraction & Why Use It?](#chunk-1)
3. [🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module](#chunk-2)
4. [🧩 Chunk 3: The Four Core Building Blocks of Abstraction](#chunk-3)
   - [1. Abstract Methods (`@abstractmethod`)](#abstract-methods)
   - [2. Concrete Methods (Shared Implementation)](#concrete-methods)
   - [3. Abstract Properties (`@property` + `@abstractmethod`)](#abstract-properties)
   - [4. Abstract Class Instantiation Safeguards](#instantiation-safeguards)
5. [🏆 Chunk 4: Complete Yamaha MotoGP Simple Simulation Architecture](#chunk-4)
6. [📊 Chunk 5: Summary Comparison & Key Takeaways](#chunk-5)

---

<span id="real-world-intuition"></span>
## 🏍️ Real-World & Conceptual Intuition

### The Yamaha Factory Cockpit & Pit Wall vs. 300 HP Engine Mechanics & ECU Firmware
In the **Monster Energy Yamaha MotoGP** pit garage:
- The **Yamaha Rider** (such as 2021 MotoGP World Champion Fabio Quartararo #20 or race-winner Álex Rins #42) sits on the saddle of a 300-horsepower **Yamaha YZR-M1**:
  - Twists the **throttle grip** to accelerate out of a corner.
  - Squeezes the **front brake lever** to decelerate into a hairpin turn.
  - Pushes the yellow **pit limiter button** on the handlebar to hold the bike at exactly 60 km/h down the pit lane.
- The rider **does not** need to manually calculate the fuel injection volume across 8 injectors, time the sparks at 18,000 RPM, or compute 6-axis gyroscope angles inside the Inertial Measurement Unit (IMU).
- The **Pit Wall Crew Chief** monitors high-level telemetry: remaining fuel in the 22-liter tank, engine mode, and lap times. The pit wall interacts with every bike using the exact same standard commands regardless of rider.
- **That is Abstraction:** Giving the rider and crew chief clean, simple controls while keeping the complex engineering and physics safely hidden underneath.

```
┌────────────────────────────────────────────────────────┐
│        YAMAHA RIDER COCKPIT / PIT WALL INTERFACE       │
│   [Twist Throttle]   [Squeeze Brakes]   [Pit Limiter]  │
└───────────────────────────┬────────────────────────────┘
                            │ (Calls Standard Methods)
                            ▼
┌────────────────────────────────────────────────────────┐
│             ABSTRACT BASE CLASS (YamahaM1)             │
│   + accelerate()  + apply_brakes()  + burn_fuel()      │
│   + toggle_pit_limiter()   + get_telemetry_status()    │
└───────────────────────────┬────────────────────────────┘
                            │ (Custom Implementation)
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │ QuartararoM1 │ │    RinsM1    │ │ YamahaTestM1 │
     │ - Rider: #20 │ │ - Rider: #42 │ │ - Rider: #35 │
     │ - Aggressive │ │ - Smooth     │ │ - Data Lab   │
     │ - Late Brake │ │ - Trail-Brake│ │ - Sensor Test│
     └──────────────┘ └──────────────┘ └──────────────┘
```

[🔝 Back to Top](#top)

---

<span id="chunk-1"></span>
## 📌 Chunk 1: What is Data Abstraction & Why Use It?

### 1. Simple Definition
**Data Abstraction** is the Object-Oriented Programming (OOP) practice of **hiding internal implementation details** and exposing only the essential features to the outside user.

It cleanly separates **what** an object can do from **how** it actually does it.

### 2. Simple Yamaha MotoGP Analogy
Consider how a Yamaha YZR-M1 accelerates:
- Both Fabio Quartararo and Álex Rins twist the throttle grip by 80%.
- Under the hood, their bikes respond differently based on rider preference:
  - **Quartararo's #20 bike** delivers aggressive, explosive torque to launch down straightaways.
  - **Rins' #42 bike** delivers progressive, smooth torque to preserve rear tire grip during long corners.
- Neither rider cares about the complex ECU ignition tables. To both riders, the action is identical: `bike.accelerate(80)`.
- **That is Abstraction:** One shared interface (`accelerate`), with customized mechanics hidden inside each bike!

### 3. Core Benefits of Abstraction
| Benefit | Explanation | Yamaha MotoGP Analogy |
| :--- | :--- | :--- |
| **Complexity Reduction** | Hides overwhelming engine mechanics and sensor data behind clean, readable methods. | The rider twists the throttle; the ECU handles fuel injection, valve timing, and traction control automatically. |
| **Contract Enforcement** | Guarantees that every motorcycle built by Yamaha implements essential racing capabilities. | Every bike must provide `accelerate()` and `apply_brakes()` before being allowed onto the racetrack. |
| **Code Reusability & Safety** | Common rules and formulas are written once in the base class and inherited by all bikes. | Universal FIM regulations (like the 60 km/h pit lane speed limit and fuel tank limit) are coded once in `YamahaM1`. |
| **Polymorphic Fleet Control** | The pit wall can manage all team bikes through a single unified interface. | The race engineer loops through Quartararo and Rins' bikes using `for bike in garage: bike.burn_fuel(laps)`. |

[🔝 Back to Top](#top)

---

<span id="chunk-2"></span>
## 🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module

Python does not have built-in `interface` or `abstract` keywords like Java or C#. Instead, Python provides abstraction through the standard library module **`abc` (Abstract Base Classes)**.

### Key Rules:
1. **Inherit from `ABC`:** A class must inherit from `abc.ABC` to designate itself as an Abstract Base Class.
2. **Use `@abstractmethod`:** Place this decorator above any method that child classes **must** implement.
3. **No Direct Instantiation:** If a class inherits from `ABC` and contains at least one `@abstractmethod`, Python prevents creating an instance of that class directly.

### Simple Yamaha MotoGP Syntax Example:
```python
from abc import ABC, abstractmethod

# Abstract Base Class (The Master Blueprint for all Yamaha Race Bikes)
class YamahaBike(ABC):
    @abstractmethod
    def start_engine(self) -> str:
        """Mandatory rule: Every Yamaha bike must define how its engine starts."""
        pass

# Concrete Subclass (Fabio Quartararo's Factory Race Bike)
class QuartararoM1(YamahaBike):
    def start_engine(self) -> str:
        return "🏍️ [Yamaha M1 #20] External starter roller engaged: 1000cc Crossplane engine roars to life!"

# Creating an instance of the concrete subclass
bike = QuartararoM1()
print(bike.start_engine())
```

#### Output:
```text
🏍️ [Yamaha M1 #20] External starter roller engaged: 1000cc Crossplane engine roars to life!
```

[🔝 Back to Top](#top)

---

<span id="chunk-3"></span>
## 🧩 Chunk 3: The Four Core Building Blocks of Abstraction

---

<span id="abstract-methods"></span>
### 1. Abstract Methods (`@abstractmethod`)

An **Abstract Method** is declared in the abstract base class with a header and a `pass` statement (no method body). It acts as an unbreakable contract: any child class **must** provide its own specific implementation, or Python will refuse to create the object.

#### Simple Introductory Example:
```python
from abc import ABC, abstractmethod

class YamahaBike(ABC):
    @abstractmethod
    def accelerate(self, throttle_pct: int) -> str:
        """Mandatory contract: Every bike must define how it delivers power."""
        pass

class QuartararoM1(YamahaBike):
    def accelerate(self, throttle_pct: int) -> str:
        return f"🚀 [#20 Quartararo] Throttle at {throttle_pct}%: Explosive drive out of the apex!"

bike = QuartararoM1()
print(bike.accelerate(throttle_pct=90))
```

#### Output:
```text
🚀 [#20 Quartararo] Throttle at 90%: Explosive drive out of the apex!
```

---

<details>
<summary>🏍️ <b>Yamaha MotoGP Case Study: Missing Acceleration Strategy on Test Bike</b> (Click to expand)</summary>

#### 🏁 Scenario: Commissioning a New Yamaha Test Bike
Yamaha creates a prototype bike for test rider Cal Crutchlow. The base class `YamahaM1` mandates that every bike must define its power acceleration strategy via `accelerate()`.

---

#### ❌ Broken Code (The Problem)
A junior technician creates `YamahaTestBike` inheriting from `YamahaM1`, but **forgets to implement** the mandatory `accelerate()` method:

```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    def __init__(self, rider: str):
        self.rider = rider

    @abstractmethod
    def accelerate(self, throttle_pct: int) -> str:
        """Mandatory contract."""
        pass

# ❌ INCOMPLETE SUBCLASS: Forgot to implement accelerate()!
class YamahaTestBike(YamahaM1):
    def __init__(self, rider: str):
        super().__init__(rider=rider)
        self.sensor_count = 64

# Attempting to start the test bike
test_bike = YamahaTestBike(rider="Cal Crutchlow")
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class YamahaTestBike without an implementation for abstract method 'accelerate'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Contract Established:** `YamahaM1` declared `accelerate()` decorated with `@abstractmethod`.
2. **Missing Implementation:** `YamahaTestBike` inherited from `YamahaM1` but omitted `accelerate()`.
3. **Instantiation Guard:** Python's metaclass detected the missing method and stopped the program with a `TypeError` before an incomplete bike could enter the track.

---

#### ✅ Fixed Code (The Solution)
Implement `accelerate()` inside `YamahaTestBike`:

```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    def __init__(self, rider: str):
        self.rider = rider

    @abstractmethod
    def accelerate(self, throttle_pct: int) -> str:
        """Mandatory contract."""
        pass

# ✅ FULLY COMPLIANT SUBCLASS
class YamahaTestBike(YamahaM1):
    def __init__(self, rider: str):
        super().__init__(rider=rider)
        self.sensor_count = 64

    def accelerate(self, throttle_pct: int) -> str:
        return f"🧪 [Test Lab - {self.rider}] Throttle at {throttle_pct}%: Recording engine vibration and chassis flex across {self.sensor_count} sensors."

# Instantiate and run
test_bike = YamahaTestBike(rider="Cal Crutchlow")
print(test_bike.accelerate(throttle_pct=85))
```

#### 🎉 Output:
```text
🧪 [Test Lab - Cal Crutchlow] Throttle at 85%: Recording engine vibration and chassis flex across 64 sensors.
```

</details>

[🔝 Back to Top](#top)

---

<span id="concrete-methods"></span>
### 2. Concrete Methods (Shared Implementation)

An Abstract Base Class is **not limited** to empty abstract methods. It can also contain **Concrete Methods**—methods with fully functional, shared code. All derived child classes inherit this code automatically, eliminating duplicate logic and preventing bugs.

#### Simple Introductory Example:
```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    # Abstract Method (Customized per rider)
    @abstractmethod
    def riding_style(self) -> str:
        pass

    # Concrete Method (Universal FIM Pit Lane Speed Limit: 60 km/h)
    def toggle_pit_limiter(self, active: bool) -> str:
        if active:
            return "🛑 [PIT LIMITER ON] Speed strictly locked at 60 km/h for safety."
        return "🟢 [PIT LIMITER OFF] Full race speed restored."

class QuartararoM1(YamahaM1):
    def riding_style(self) -> str:
        return "Late braking with high lean-angle apex speed."

bike = QuartararoM1()
print(f"Rider Style: {bike.riding_style()}")
print(bike.toggle_pit_limiter(active=True))
print(bike.toggle_pit_limiter(active=False))
```

#### Output:
```text
Rider Style: Late braking with high lean-angle apex speed.
🛑 [PIT LIMITER ON] Speed strictly locked at 60 km/h for safety.
🟢 [PIT LIMITER OFF] Full race speed restored.
```

---

<details>
<summary>🏍️ <b>Yamaha MotoGP Case Study: Standardized Fuel Consumption & Broken Method Overrides</b> (Click to expand)</summary>

#### 🏁 Scenario: Universal 22-Liter Fuel Tank Calculation
In MotoGP, all bikes are limited to a **22.0-liter** fuel tank. The fuel burned during a stint is calculated using a standard equation:

$$\text{Fuel Burned} = \text{Laps Completed} \times \text{Fuel per Lap (0.85 L)}$$

Because this rule applies to **every** Yamaha motorcycle, it is placed inside `YamahaM1` as a **concrete method** so all riders share the exact same telemetry calculations.

---

#### ❌ Broken Code (The Problem)
A programmer working on Álex Rins' bike attempted to re-write `calculate_fuel_remaining()` inside `RinsM1`, but accidentally changed the parameters, breaking the pit wall telemetry system:

```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    @abstractmethod
    def get_exhaust_sound(self) -> str:
        pass

    # Concrete Method: Standard fuel calculator
    def calculate_fuel_remaining(self, total_fuel: float, laps_done: int) -> float:
        return round(total_fuel - (laps_done * 0.85), 2)

class RinsM1(YamahaM1):
    def get_exhaust_sound(self) -> str:
        return "Roaring Crossplane Inline-4"

    # ❌ BROKEN OVERRIDE: Changed arguments from (total_fuel, laps_done) to (fuel_only)!
    def calculate_fuel_remaining(self, fuel_only: float) -> float:
        return fuel_only - 1.0

# Pit wall telemetry system calls the standard 2-argument method
bike = RinsM1()

# Pit wall passes (total_fuel=22.0, laps_done=5) -> CRASH!
print(bike.calculate_fuel_remaining(22.0, 5))
```

#### 💥 Error Output:
```text
TypeError: RinsM1.calculate_fuel_remaining() takes 2 positional arguments but 3 were given
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Reinventing Shared Logic:** The base class already provided a tested, universal `calculate_fuel_remaining(total_fuel, laps_done)` method.
2. **Signature Mismatch:** The child class replaced the method with incompatible parameters.
3. **Core Lesson:** When common behavior is already provided by a concrete method in the base class, **do not recreate it** in the child class unless you intentionally maintain the exact same signature.

---

#### ✅ Fixed Code (The Solution)
Remove the redundant method in `RinsM1` and let it inherit the concrete method directly:

```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    def __init__(self, rider: str, starting_fuel: float = 22.0):
        self.rider = rider
        self.fuel_liters = starting_fuel

    @abstractmethod
    def get_exhaust_sound(self) -> str:
        pass

    # Concrete Method 1: Universal Fuel Calculator
    def calculate_fuel_remaining(self, laps_done: int, fuel_per_lap: float = 0.85) -> float:
        burned = laps_done * fuel_per_lap
        self.fuel_liters = round(max(0.0, self.fuel_liters - burned), 2)
        return self.fuel_liters

    # Concrete Method 2: Pit Board Status Message
    def get_fuel_status_alert(self) -> str:
        if self.fuel_liters > 10.0:
            return "🟢 Fuel Level: Optimum (Push Hard)"
        elif self.fuel_liters > 3.0:
            return "🟡 Fuel Level: Moderate (Maintain Pace)"
        return "🔴 Fuel Level: Critical (Switch to Lean Map)"

# Clean Subclass: Inherits concrete methods effortlessly!
class RinsM1(YamahaM1):
    def get_exhaust_sound(self) -> str:
        return "Roaring Crossplane Inline-4"

# Test inherited concrete methods
bike = RinsM1(rider="Álex Rins")
print(f"Rider: {bike.rider}")
print(f"Sound: {bike.get_exhaust_sound()}")

# Run 5 laps
remaining = bike.calculate_fuel_remaining(laps_done=5)
print(f"Remaining Fuel after 5 laps: {remaining} Liters")
print(f"Pit Board: {bike.get_fuel_status_alert()}")
```

#### 🎉 Output:
```text
Rider: Álex Rins
Sound: Roaring Crossplane Inline-4
Remaining Fuel after 5 laps: 17.75 Liters
Pit Board: 🟢 Fuel Level: Optimum (Push Hard)
```

</details>

[🔝 Back to Top](#top)

---

<span id="abstract-properties"></span>
### 3. Abstract Properties (`@property` + `@abstractmethod`)

Just as you can enforce methods, Python allows you to enforce **properties** (getter attributes). This guarantees that every child class defines mandatory specifications like rider name, racing number, or maximum speed.

> [!IMPORTANT]
> **Decorator Order Matters:** Always put `@property` on the **outside** (top) and `@abstractmethod` on the **inside** (bottom):
> ```python
> @property
> @abstractmethod
> def property_name(self) -> str:
>     pass
> ```

#### Simple Introductory Example:
```python
from abc import ABC, abstractmethod

class YamahaBike(ABC):
    @property
    @abstractmethod
    def max_top_speed_kmh(self) -> int:
        """Mandatory specification: Maximum straight-line top speed."""
        pass

class QuartararoM1(YamahaBike):
    @property
    def max_top_speed_kmh(self) -> int:
        return 355

bike = QuartararoM1()
print(f"Top Speed: {bike.max_top_speed_kmh} km/h")
```

#### Output:
```text
Top Speed: 355 km/h
```

---

<details>
<summary>🏍️ <b>Yamaha MotoGP Case Study: Mandatory Technical Scrutineering Specifications</b> (Click to expand)</summary>

#### 🏁 Scenario: Official FIM Race Registration
Before participating in a Grand Prix weekend, technical officials inspect the registration of each motorcycle. The base class `YamahaM1` mandates that every registered bike must declare both its **`rider_name`** and its official **`race_number`**.

---

#### ❌ Broken Code (The Problem)
A developer creates `TestBike`, implements `rider_name`, but **forgets to implement `race_number`**:

```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    @property
    @abstractmethod
    def rider_name(self) -> str:
        pass

    @property
    @abstractmethod
    def race_number(self) -> int:
        pass

class TestBike(YamahaM1):
    @property
    def rider_name(self) -> str:
        return "Cal Crutchlow"

    # ❌ BUG: Forgot to implement race_number property!

# Attempting to instantiate for race entry
bike = TestBike()
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class TestBike without an implementation for abstract method 'race_number'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Properties Mandated:** `YamahaM1` declared two abstract properties.
2. **Incomplete Subclass:** `TestBike` forgot `race_number`.
3. **Safety Protection:** Python prevented instantiating an unnumbered motorcycle.

---

#### ✅ Fixed Code (The Solution)
Implement both properties decorated with `@property`:

```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    @property
    @abstractmethod
    def rider_name(self) -> str:
        pass

    @property
    @abstractmethod
    def race_number(self) -> int:
        pass

# ✅ FULLY COMPLIANT SUBCLASS
class TestBike(YamahaM1):
    @property
    def rider_name(self) -> str:
        return "Cal Crutchlow"

    @property
    def race_number(self) -> int:
        return 35

bike = TestBike()
print(f"Official Entry: #{bike.race_number} - {bike.rider_name}")
```

#### 🎉 Output:
```text
Official Entry: #35 - Cal Crutchlow
```

</details>

[🔝 Back to Top](#top)

---

<span id="instantiation-safeguards"></span>
### 4. Abstract Class Instantiation Safeguards

An Abstract Base Class containing unresolved abstract members **cannot be instantiated directly**. Attempting to do so immediately triggers a `TypeError`.

#### Why Does Python Enforce This?
An abstract class is an **incomplete blueprint**. For example, a generic `YamahaM1` does not know whether it uses Fabio Quartararo's aggressive throttle map, Álex Rins' smooth map, or the Test Team's sensor setup. Allowing someone to create a generic `YamahaM1()` would cause errors as soon as missing behavior is called.

```python
from abc import ABC, abstractmethod

class YamahaM1(ABC):
    @abstractmethod
    def accelerate(self):
        pass

# ❌ Direct instantiation attempt:
try:
    generic_bike = YamahaM1()
except TypeError as error:
    print(f"Captured Error: {error}")
```

#### Output:
```text
Captured Error: Can't instantiate abstract class YamahaM1 without an implementation for abstract method 'accelerate'
```

[🔝 Back to Top](#top)

---

<span id="chunk-4"></span>
## 🏆 Chunk 4: Complete Yamaha MotoGP Simple Simulation Architecture

Here is a clean, self-contained, runnable Python script that puts all four building blocks together. It simulates a 3-lap race stint for the Monster Energy Yamaha MotoGP team, highlighting **Abstract Methods**, **Concrete Methods**, **Abstract Properties**, and **Polymorphic Execution**.

```python
from abc import ABC, abstractmethod
from typing import List

# ==========================================================
# 1. ABSTRACT BASE CLASS (The Universal Yamaha Blueprint)
# ==========================================================
class YamahaM1(ABC):
    """
    Abstract blueprint representing a Monster Energy Yamaha YZR-M1 MotoGP bike.
    Enforces rider-specific controls while sharing universal team rules.
    """
    def __init__(self, starting_fuel_liters: float = 22.0):
        self.fuel_liters = starting_fuel_liters
        self.is_pit_limiter_on = False

    # ------------------------------------------------------
    # ABSTRACT PROPERTIES (Mandatory Motorcycle Specs)
    # ------------------------------------------------------
    @property
    @abstractmethod
    def rider_name(self) -> str:
        """Name of the Yamaha factory rider."""
        pass

    @property
    @abstractmethod
    def race_number(self) -> int:
        """Official racing number displayed on the front fairing."""
        pass

    @property
    @abstractmethod
    def engine_mode(self) -> str:
        """Rider-chosen power mapping profile."""
        pass

    # ------------------------------------------------------
    # ABSTRACT METHODS (Rider-Specific Actions)
    # ------------------------------------------------------
    @abstractmethod
    def accelerate(self, throttle_pct: int) -> str:
        """How this specific bike delivers power when the rider twists the throttle."""
        pass

    @abstractmethod
    def apply_brakes(self, pressure_pct: int) -> str:
        """How this specific bike slows down entering a corner."""
        pass

    # ------------------------------------------------------
    # CONCRETE METHODS (Shared Logic for ALL Yamaha Bikes)
    # ------------------------------------------------------
    def toggle_pit_limiter(self, active: bool) -> str:
        """FIM technical rule: Pit lane speed is capped strictly at 60 km/h."""
        self.is_pit_limiter_on = active
        if active:
            return f"🛑 [PIT LIMITER ON] #{self.race_number} speed capped at 60 km/h in pit lane."
        return f"🟢 [PIT LIMITER OFF] #{self.race_number} unleashed! Full 300 HP crossplane power ready."

    def burn_fuel(self, laps_completed: int, fuel_per_lap: float = 0.85) -> float:
        """Standard fuel consumption model (22L FIM tank limit)."""
        burned = round(laps_completed * fuel_per_lap, 2)
        self.fuel_liters = max(0.0, round(self.fuel_liters - burned, 2))
        return self.fuel_liters

    def get_telemetry_status(self) -> str:
        """Universal dashboard status printed for the pit wall crew chief."""
        limiter_state = "ENGAGED" if self.is_pit_limiter_on else "OFF"
        return (
            f"📊 Telemetry [#{self.race_number} {self.rider_name}]: "
            f"Mode: {self.engine_mode} | Fuel Left: {self.fuel_liters}L | Pit Limiter: {limiter_state}"
        )


# ==========================================================
# 2. CONCRETE SUBCLASSES (Specific Rider Setups)
# ==========================================================
class QuartararoM1(YamahaM1):
    """Fabio Quartararo's #20 bike: Aggressive throttle and deep late braking."""
    @property
    def rider_name(self) -> str:
        return "Fabio Quartararo"

    @property
    def race_number(self) -> int:
        return 20

    @property
    def engine_mode(self) -> str:
        return "Map 1 (Aggressive Full Power)"

    def accelerate(self, throttle_pct: int) -> str:
        return (
            f"🚀 [#{self.race_number} Quartararo] Throttle twisted to {throttle_pct}%! "
            f"Explosive drive out of the apex with high downforce front winglets."
        )

    def apply_brakes(self, pressure_pct: int) -> str:
        return (
            f"🛑 [#{self.race_number} Quartararo] Squeezes front Brembo lever to {pressure_pct}%! "
            f"Deep trail-braking right up to the apex curb."
        )


class RinsM1(YamahaM1):
    """Álex Rins' #42 bike: Smooth progressive throttle and tire preservation."""
    @property
    def rider_name(self) -> str:
        return "Álex Rins"

    @property
    def race_number(self) -> int:
        return 42

    @property
    def engine_mode(self) -> str:
        return "Map 2 (Smooth Corner Entry)"

    def accelerate(self, throttle_pct: int) -> str:
        return (
            f"🏍️ [#{self.race_number} Rins] Throttle twisted to {throttle_pct}%. "
            f"Smooth, progressive torque delivery preserving rear Michelin tire life."
        )

    def apply_brakes(self, pressure_pct: int) -> str:
        return (
            f"🎯 [#{self.race_number} Rins] Squeezes lever to {pressure_pct}%. "
            f"Fluid corner-entry braking carrying maximum mid-corner lean angle."
        )


class YamahaTestM1(YamahaM1):
    """Cal Crutchlow / Factory Test Team bike: Data logging & experimental parts."""
    @property
    def rider_name(self) -> str:
        return "Cal Crutchlow (Test Team)"

    @property
    def race_number(self) -> int:
        return 35

    @property
    def engine_mode(self) -> str:
        return "Map 3 (Sensor Diagnostics & Benchmark)"

    def accelerate(self, throttle_pct: int) -> str:
        return (
            f"🧪 [#{self.race_number} Test Lab] Throttle at {throttle_pct}%. "
            f"Logging suspension strain gauge and swingarm flex telemetry."
        )

    def apply_brakes(self, pressure_pct: int) -> str:
        return (
            f"🔬 [#{self.race_number} Test Lab] Brake pressure at {pressure_pct}%. "
            f"Testing new experimental carbon-carbon disc heat dissipation."
        )


# ==========================================================
# 3. POLYMORPHIC RACE CONTROLLER (Pit Wall System)
# ==========================================================
def run_motogp_stint(garage_bikes: List[YamahaM1], laps_to_run: int) -> None:
    """
    The Pit Wall operates through the abstract YamahaM1 interface.
    It doesn't matter which rider or bike is running — the commands are identical!
    """
    print("=" * 80)
    print("🏁 MONSTER ENERGY YAMAHA MOTOGP — PIT WALL RACE SIMULATION")
    print("=" * 80)

    for bike in garage_bikes:
        print(f"\n🔵 --- PIT GARAGE DISPATCH: #{bike.race_number} ({bike.rider_name}) ---")
        print(bike.get_telemetry_status())
        print(bike.toggle_pit_limiter(active=True))
        print("   Exiting pit lane at 60 km/h...")
        print(bike.toggle_pit_limiter(active=False))

        print(f"\n   [RACING STINT: {laps_to_run} LAPS]")
        print("   " + bike.accelerate(throttle_pct=95))
        print("   " + bike.apply_brakes(pressure_pct=88))

        remaining = bike.burn_fuel(laps_completed=laps_to_run)
        print(f"   ⛽ Fuel update after {laps_to_run} laps: {remaining}L remaining in 22L tank.")
        print(bike.get_telemetry_status())

    print("\n" + "=" * 80)
    print("🏁 SESSION COMPLETE: All Yamaha factory bikes returned safely to pit garage.")
    print("=" * 80)


# ==========================================================
# 4. SIMULATION EXECUTION (3-Lap Sprint Stint)
# ==========================================================
if __name__ == "__main__":
    factory_garage: List[YamahaM1] = [
        QuartararoM1(),
        RinsM1(),
        YamahaTestM1()
    ]
    run_motogp_stint(garage_bikes=factory_garage, laps_to_run=3)
```

#### 🎉 Output:
```text
================================================================================
🏁 MONSTER ENERGY YAMAHA MOTOGP — PIT WALL RACE SIMULATION
================================================================================

🔵 --- PIT GARAGE DISPATCH: #20 (Fabio Quartararo) ---
📊 Telemetry [#20 Fabio Quartararo]: Mode: Map 1 (Aggressive Full Power) | Fuel Left: 22.0L | Pit Limiter: OFF
🛑 [PIT LIMITER ON] #20 speed capped at 60 km/h in pit lane.
   Exiting pit lane at 60 km/h...
🟢 [PIT LIMITER OFF] #20 unleashed! Full 300 HP crossplane power ready.

   [RACING STINT: 3 LAPS]
   🚀 [#20 Quartararo] Throttle twisted to 95%! Explosive drive out of the apex with high downforce front winglets.
   🛑 [#20 Quartararo] Squeezes front Brembo lever to 88%! Deep trail-braking right up to the apex curb.
   ⛽ Fuel update after 3 laps: 19.45L remaining in 22L tank.
📊 Telemetry [#20 Fabio Quartararo]: Mode: Map 1 (Aggressive Full Power) | Fuel Left: 19.45L | Pit Limiter: OFF

🔵 --- PIT GARAGE DISPATCH: #42 (Álex Rins) ---
📊 Telemetry [#42 Álex Rins]: Mode: Map 2 (Smooth Corner Entry) | Fuel Left: 22.0L | Pit Limiter: OFF
🛑 [PIT LIMITER ON] #42 speed capped at 60 km/h in pit lane.
   Exiting pit lane at 60 km/h...
🟢 [PIT LIMITER OFF] #42 unleashed! Full 300 HP crossplane power ready.

   [RACING STINT: 3 LAPS]
   🏍️ [#42 Rins] Throttle twisted to 95%. Smooth, progressive torque delivery preserving rear Michelin tire life.
   🎯 [#42 Rins] Squeezes lever to 88%. Fluid corner-entry braking carrying maximum mid-corner lean angle.
   ⛽ Fuel update after 3 laps: 19.45L remaining in 22L tank.
📊 Telemetry [#42 Álex Rins]: Mode: Map 2 (Smooth Corner Entry) | Fuel Left: 19.45L | Pit Limiter: OFF

🔵 --- PIT GARAGE DISPATCH: #35 (Cal Crutchlow (Test Team)) ---
📊 Telemetry [#35 Cal Crutchlow (Test Team)]: Mode: Map 3 (Sensor Diagnostics & Benchmark) | Fuel Left: 22.0L | Pit Limiter: OFF
🛑 [PIT LIMITER ON] #35 speed capped at 60 km/h in pit lane.
   Exiting pit lane at 60 km/h...
🟢 [PIT LIMITER OFF] #35 unleashed! Full 300 HP crossplane power ready.

   [RACING STINT: 3 LAPS]
   🧪 [#35 Test Lab] Throttle at 95%. Logging suspension strain gauge and swingarm flex telemetry.
   🔬 [#35 Test Lab] Brake pressure at 88%. Testing new experimental carbon-carbon disc heat dissipation.
   ⛽ Fuel update after 3 laps: 19.45L remaining in 22L tank.
📊 Telemetry [#35 Cal Crutchlow (Test Team)]: Mode: Map 3 (Sensor Diagnostics & Benchmark) | Fuel Left: 19.45L | Pit Limiter: OFF

================================================================================
🏁 SESSION COMPLETE: All Yamaha factory bikes returned safely to pit garage.
================================================================================
```

[🔝 Back to Top](#top)

---

<span id="chunk-5"></span>
## 📊 Chunk 5: Summary Comparison & Key Takeaways

### 1. Summary Comparison Table

| Abstraction Member | Decorator Syntax | Has Code in Base Class? | Must Child Subclass Override? | Primary Objective |
| :--- | :--- | :---: | :---: | :--- |
| **Abstract Method** | `@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce rider-specific behaviors (e.g. unique acceleration and braking styles). |
| **Concrete Method** | None | ✅ **Yes** (Full Body) | ❌ No (Inherited) | Provide shared team rules and universal calculations (e.g. pit limiter, fuel burn). |
| **Abstract Property** | `@property`<br>`@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce mandatory motorcycle specifications (e.g. rider name, race number). |
| **Abstract Class** | Inherits `ABC` | N/A | N/A | Acts as the master blueprint; prevents direct instantiation of incomplete models. |

---

### 2. 🔑 Core Takeaways & Mental Model

1. **Abstraction = "What to do" vs. "How to do it"**:
   - The Abstract Base Class (`YamahaM1`) dictates **what** actions must exist across the entire team (`accelerate`, `apply_brakes`, `toggle_pit_limiter`).
   - The concrete child classes (`QuartararoM1`, `RinsM1`, `YamahaTestM1`) define **how** those actions are physically executed.

2. **Always Inherit `abc.ABC`**:
   - Simply adding `@abstractmethod` to a standard class will **not** prevent instantiation. You must inherit from `ABC`.

3. **Decorator Order Matters for Abstract Properties**:
   ```python
   # ✅ Correct Order: @property on outside, @abstractmethod on inside
   @property
   @abstractmethod
   def rider_name(self) -> str:
       pass
   ```

4. **Prevents Runtime Bugs via Early Contract Checks**:
   - If an engineer builds a new motorcycle class and forgets to implement a required method, Python raises an immediate `TypeError` at instantiation time—catching the bug in the garage before the bike reaches the track!

---

[🔝 Back to Top](#top)
