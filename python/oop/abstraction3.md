<span id="top"></span>

# Data Abstraction in Python — Comprehensive Chunk-by-Chunk Guide

> **Source Article:** [GeeksforGeeks - Data Abstraction in Python](https://www.geeksforgeeks.org/python/data-abstraction-in-python/)  
> **Topic:** Object-Oriented Programming (OOP) in Python — Data Abstraction & Abstract Base Classes (ABCs)  
> **Domain Focus:** Industrial Robotics & Overall Equipment Effectiveness (OEE) Telemetry Case Studies  
> **User Prompt:** "reexplain the following article chunk by chunk, easy to understand and coherence example in oee (overall equipment effectiveness) robot study cases: https://www.geeksforgeeks.org/python/data-abstraction-in-python/"

---

## 📚 Table of Contents
1. [🏭 Real-World & Conceptual Intuition](#real-world-intuition)
2. [📌 Chunk 1: What is Data Abstraction & Why Use It?](#chunk-1)
3. [🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module](#chunk-2)
4. [🧩 Chunk 3: The Four Core Building Blocks of Abstraction](#chunk-3)
   - [1. Abstract Methods (`@abstractmethod`)](#abstract-methods)
   - [2. Concrete Methods (Shared Implementation)](#concrete-methods)
   - [3. Abstract Properties (`@property` + `@abstractmethod`)](#abstract-properties)
   - [4. Abstract Class Instantiation Safeguards](#instantiation-safeguards)
5. [🏆 Chunk 4: Complete Industrial Robotics OEE Simulation Architecture](#chunk-4)
6. [📊 Chunk 5: Summary Comparison & Key Takeaways](#chunk-5)

---

<span id="real-world-intuition"></span>
## 🏭 Real-World & Conceptual Intuition

### The Plant Operator Dashboard vs. Robot Joint Kinematics
In a high-automation smart manufacturing plant (e.g., automotive assembly or electronics packaging):
- The **Plant Manager** or **SCADA Operator** interacts with a high-level **dashboard**: they monitor shift production targets, view live **OEE (Overall Equipment Effectiveness)** percentages, press the `Start Batch` or `Emergency Stop` buttons, and dispatch work orders.
- The operator **does not** need to manually compute 6-axis inverse kinematics matrices, count optical encoder pulses per microsecond, calculate servo motor PWM current loops, or tune PID temperature curves for laser welding nozzles.
- **That is Abstraction:** Exposing a clean, standard, and intuitive interface to the supervisory system while encapsulating and hiding the intricate hardware mechanics and math underneath.

```
┌────────────────────────────────────────────────────────┐
│             PLANT OPERATOR / SCADA / MES               │
│     [Start Shift]    [Calculate OEE]    [E-Stop]       │
└───────────────────────────┬────────────────────────────┘
                            │ (Calls Standard Methods)
                            ▼
┌────────────────────────────────────────────────────────┐
│               ABSTRACT CONTRACT (OEERobot)             │
│   + execute_cycle()  + calculate_oee()  + emergency()  │
└───────────────────────────┬────────────────────────────┘
                            │ (Implemented by Subclasses)
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ FanucArcWelder   │ │  ABBPalletizer   │ │ KUKAPaintRobot   │
│ - Seam Tracking  │ │ - Vacuum Suction │ │ - Atomizer Valve │
│ - Torch Voltage  │ │ - Box Stacking   │ │ - Flow Meter     │
│ - Wire Feed Rate │ │ - Weight Sensor  │ │ - Bell Cup Speed │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

[🔝 Back to Top](#top)

---

<span id="chunk-1"></span>
## 📌 Chunk 1: What is Data Abstraction & Why Use It?

### 1. Simple Definition
**Data Abstraction** is the OOP technique of **hiding internal implementation details** and exposing only the essential features to the outside caller. It cleanly decouples **what** an entity does from **how** it achieves it.

### 2. OEE Industrial Robotics Analogy
**OEE (Overall Equipment Effectiveness)** is the gold-standard metric in manufacturing to measure how well equipment runs:

$$\text{OEE} = \text{Availability} \times \text{Performance} \times \text{Quality}$$

Where:
- **Availability (A):** Ratio of actual Operating Time to Planned Production Time (penalized by breakdowns & setups).
- **Performance (P):** Ratio of Actual Production Speed to Ideal Design Speed (penalized by micro-stops & slow cycles).
- **Quality (Q):** Ratio of Good, defect-free parts to Total Parts Produced (penalized by scrap & rework).

In a smart factory fleet:
- Every robotic workstation (`WeldingRobot`, `PalletizingRobot`, `PaintingRobot`) must collect telemetry and report its OEE score.
- The central Manufacturing Execution System (MES) simply calls `robot.calculate_oee()`.
- The MES does not care whether a robot uses pneumatic suction cups, robotic servo spot guns, or electrostatic paint atomizers.
- **That is Abstraction:** A unified contract (`calculate_oee()`) shared across heterogeneous industrial robots.

### 3. Core Benefits of Abstraction
| Benefit | Explanation | Industrial Robotics & OEE Analogy |
| :--- | :--- | :--- |
| **Complexity Reduction** | Hides low-level servo math and sensor physics. | The supervisor triggers `run_cycle()`; internal PLC and robot controllers handle joint trajectory interpolation. |
| **Contract Enforcement** | Guarantees every robot model implements critical lifecycle hooks. | ISO safety standards mandate every robotic workcell must provide `emergency_stop()` and `calibrate_axes()`. |
| **Maintainability** | Upgrade robot controllers without breaking the plant MES. | Swap an ABB welding torch for a Fanuc laser welder without rewriting the factory OEE reporting engine. |
| **Polymorphic Fleet Control** | The factory controller manages all diverse robots uniformly. | The MES loops through 50 mixed-brand robots, calculating plant-wide OEE using the exact same method call. |

[🔝 Back to Top](#top)

---

<span id="chunk-2"></span>
## 🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module

Python does not have built-in `interface` or `abstract` keywords like C# or Java. Instead, Python provides the standard **`abc` module** (Abstract Base Classes).

### Key Rules:
1. **Inherit from `ABC`:** A class must inherit from `abc.ABC` to become an Abstract Base Class.
2. **The `@abstractmethod` Decorator:** Declares that a method has no implementation in the base class and **must be implemented** by any concrete subclass.
3. **No Direct Instantiation:** If a class inherits from `ABC` and contains at least one `@abstractmethod`, Python prevents creating an instance of that class directly.

### Industrial Robotics Syntax Example:
```python
from abc import ABC, abstractmethod

# Abstract Base Class (Blueprint for all Robotic Motion Planners)
class MotionStrategy(ABC):
    @abstractmethod
    def plan_trajectory(self, target_coordinates: tuple) -> str:
        """Mandatory contract: Every robot kinematic solver must plan motion paths."""
        pass

# Concrete Subclass (Linear Interpolation for Pick-and-Place)
class LinearMotionPlanner(MotionStrategy):
    def plan_trajectory(self, target_coordinates: tuple) -> str:
        return f"🦾 Linear Trajectory computed to Cartesian target {target_coordinates} at 1.8 m/s."

# Creating an instance of the concrete subclass
planner = LinearMotionPlanner()
print(planner.plan_trajectory(target_coordinates=(120.5, 45.0, 310.2)))
```

#### Output:
```text
🦾 Linear Trajectory computed to Cartesian target (120.5, 45.0, 310.2) at 1.8 m/s.
```

[🔝 Back to Top](#top)

---

<span id="chunk-3"></span>
## 🧩 Chunk 3: The Four Core Building Blocks of Abstraction

---

<span id="abstract-methods"></span>
### 1. Abstract Methods (`@abstractmethod`)

An **Abstract Method** is declared in the abstract base class with a method header and a `pass` statement (no body). It acts as an unbreakable contract: any subclass **must** provide its own specific implementation, or Python will refuse to instantiate it.

#### Robotics Introductory Example:
```python
from abc import ABC, abstractmethod

# Abstract Blueprint for Industrial End-Effectors (Tooling)
class EndEffector(ABC):
    @abstractmethod
    def actuate_tool(self, grip_pressure_bar: float) -> str:
        """Mandatory: Every gripper/tool must define how it actuates."""
        pass

# Concrete Implementation (Pneumatic 2-Finger Gripper)
class PneumaticGripper(EndEffector):
    def actuate_tool(self, grip_pressure_bar: float) -> str:
        clamping_force_n = grip_pressure_bar * 65.0
        return f"🗜️ Pneumatic Gripper clamped with {clamping_force_n:.1f} N of holding force."

gripper = PneumaticGripper()
print(gripper.actuate_tool(grip_pressure_bar=6.0))
```

#### Output:
```text
🗜️ Pneumatic Gripper clamped with 390.0 N of holding force.
```

---

<details>
<summary>🏭 <b>Industrial Robotics Case Study: Workcell Homing & Safety Calibration Routine</b> (Click to expand)</summary>

#### 🤖 Scenario: Startup Axis Homing & Zero-Point Calibration
At the beginning of each production shift, every industrial robot must perform an axis zero-point calibration routine before entering automatic production mode. Because a 6-axis Articulated Arm homes differently than a 4-axis SCARA or Delta robot, the base class `IndustrialRobot` defines `calibrate_axes()` as an **abstract method**.

---

#### ❌ Broken Code (The Problem)
A developer created `FanucWeldingRobot` inheriting from `IndustrialRobot`, but **forgot to implement** the mandatory `calibrate_axes()` method:

```python
from abc import ABC, abstractmethod

class IndustrialRobot(ABC):
    def __init__(self, robot_id: str, workstation: str):
        self.robot_id = robot_id
        self.workstation = workstation

    @abstractmethod
    def calibrate_axes(self) -> str:
        """Mandatory: Every robot model must execute its joint homing routine."""
        pass

# ❌ INCOMPLETE SUBCLASS: Forgot calibrate_axes()
class FanucWeldingRobot(IndustrialRobot):
    def __init__(self, robot_id: str):
        super().__init__(robot_id=robot_id, workstation="Automotive Chassis Cell #4")
        self.weld_current_amp = 220

    # BUG: Developer forgot to implement calibrate_axes()!

# Attempting to commission the robot for the shift
robot = FanucWeldingRobot(robot_id="FANUC-WELD-01")
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class FanucWeldingRobot without an implementation for abstract method 'calibrate_axes'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Contract Established:** `IndustrialRobot` declared `calibrate_axes()` as `@abstractmethod`.
2. **Missing Implementation:** `FanucWeldingRobot` inherited from `IndustrialRobot` but omitted `calibrate_axes()`.
3. **Instantiation Guard:** Python's metaclass detected the unresolved abstract method when `FanucWeldingRobot()` was called and immediately halted execution with a `TypeError`.

---

#### ✅ Fixed Code (The Solution)
Implement `calibrate_axes()` inside `FanucWeldingRobot`:

```python
from abc import ABC, abstractmethod

class IndustrialRobot(ABC):
    def __init__(self, robot_id: str, workstation: str):
        self.robot_id = robot_id
        self.workstation = workstation

    @abstractmethod
    def calibrate_axes(self) -> str:
        """Mandatory: Every robot model must execute its joint homing routine."""
        pass

# ✅ FULLY COMPLIANT SUBCLASS
class FanucWeldingRobot(IndustrialRobot):
    def __init__(self, robot_id: str):
        super().__init__(robot_id=robot_id, workstation="Automotive Chassis Cell #4")
        self.weld_current_amp = 220

    def calibrate_axes(self) -> str:
        return (
            f"[{self.robot_id} @ {self.workstation}] All 6 articulated joints calibrated. "
            f"Zero-pulse optical mastering confirmed. Weld gun set to {self.weld_current_amp}A."
        )

# Instantiate and commission
robot = FanucWeldingRobot(robot_id="FANUC-WELD-01")
print(robot.calibrate_axes())
```

#### 🎉 Output:
```text
[FANUC-WELD-01 @ Automotive Chassis Cell #4] All 6 articulated joints calibrated. Zero-pulse optical mastering confirmed. Weld gun set to 220A.
```

</details>

[🔝 Back to Top](#top)

---

<span id="concrete-methods"></span>
### 2. Concrete Methods (Shared Implementation)

An Abstract Base Class is **not limited** to abstract methods. It can also contain **Concrete Methods**—methods with fully functional, shared logic. All derived child classes inherit this code automatically without writing repetitive or error-prone duplicate calculations.

#### Robotics Introductory Example:
```python
from abc import ABC, abstractmethod

class RobotController(ABC):
    # Abstract Method (Proprietary drive system per manufacturer)
    @abstractmethod
    def get_drive_architecture(self) -> str:
        pass

    # Concrete Method (Shared ISO 13849 Safety E-Stop Routine)
    def trigger_emergency_stop(self, fault_code: str) -> str:
        return f"🚨 EMERGENCY STOP TRIPPED [Code: {fault_code}]: Servo power isolated in 12ms."

class KUKARobot(RobotController):
    def get_drive_architecture(self) -> str:
        return "KUKA KRC5 Controller with Brushless AC Servos"

kuka = KUKARobot()
print(f"Controller: {kuka.get_drive_architecture()}")
print(kuka.trigger_emergency_stop(fault_code="E-STOP-GATE-OPEN"))
```

#### Output:
```text
Controller: KUKA KRC5 Controller with Brushless AC Servos
🚨 EMERGENCY STOP TRIPPED [Code: E-STOP-GATE-OPEN]: Servo power isolated in 12ms.
```

---

<details>
<summary>🏭 <b>Industrial Robotics Case Study: Standardized OEE Mathematics & Shift Availability Tracking</b> (Click to expand)</summary>

#### 🤖 Scenario: Universal OEE Telemetry & ISO Safety Checks
All industrial robots in a modern plant (whether from Fanuc, ABB, KUKA, or Yaskawa) calculate their OEE metrics using the **exact same standardized mathematical equations**:
1. **$\text{Availability} = \frac{\text{Operating Time}}{\text{Planned Production Time}}$**
2. **$\text{Performance} = \frac{\text{Ideal Cycle Time} \times \text{Total Count}}{\text{Operating Time} \times 60}$**
3. **$\text{Quality} = \frac{\text{Good Count}}{\text{Total Count}}$**
4. **$\text{OEE} = \text{Availability} \times \text{Performance} \times \text{Quality}$**

Because these formulas are universal, writing them inside the abstract base class as **concrete methods** guarantees that every robot workstation uses the exact same validated mathematical engine.

---

#### ❌ Broken Code (The Problem)
A developer working on `ABBPickAndPlaceRobot` attempted to re-implement `calculate_availability()`, but accidentally corrupted the formula and method signature:

```python
from abc import ABC, abstractmethod

class OEERobot(ABC):
    @abstractmethod
    def execute_task(self) -> str:
        pass

    # Concrete Method: Universal Availability Calculator
    def calculate_availability(self, planned_min: float, downtime_min: float) -> float:
        operating_time = planned_min - downtime_min
        return (operating_time / planned_min) * 100.0 if planned_min > 0 else 0.0

class ABBPickAndPlaceRobot(OEERobot):
    def __init__(self, robot_id: str):
        self.robot_id = robot_id

    def execute_task(self) -> str:
        return "ABB FlexPicker: High-speed delta pick-and-place active."

    # ❌ BROKEN OVERRIDE: Changed the argument signature and broke the math!
    def calculate_availability(self, downtime_only: float) -> float:
        return 100.0 - downtime_only

# Factory SCADA system calls standardized OEE engine
abb_robot = ABBPickAndPlaceRobot("ABB-DELTA-02")

# SCADA expects standard (planned_min, downtime_min) signature -> CRASH
print(abb_robot.calculate_availability(480.0, 35.0))
```

#### 💥 Error Output:
```text
TypeError: ABBPickAndPlaceRobot.calculate_availability() takes 2 positional arguments but 3 were given
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Reinventing Common Logic:** The base class already provided a standardized `calculate_availability(planned_min, downtime_min)` method.
2. **Signature Mismatch:** Subclass re-declared the method with different parameters, breaking polymorphism across the factory SCADA software.
3. **Rule of Concrete Methods:** Inherit standard mathematical formulas directly to prevent regressions and maintain codebase consistency.

---

#### ✅ Fixed Code (The Solution)
Remove the redundant method in `ABBPickAndPlaceRobot` and let it inherit the concrete methods from `OEERobot`:

```python
from abc import ABC, abstractmethod

class OEERobot(ABC):
    def __init__(self, robot_id: str, workstation: str):
        self.robot_id = robot_id
        self.workstation = workstation

    @abstractmethod
    def execute_task(self) -> str:
        pass

    # Concrete Method 1: Standard OEE Availability Calculator
    def calculate_availability(self, planned_min: float, downtime_min: float) -> float:
        operating_time = planned_min - downtime_min
        return round((operating_time / planned_min) * 100.0, 2) if planned_min > 0 else 0.0

    # Concrete Method 2: OEE World-Class Benchmark Classifier
    def evaluate_oee_grade(self, oee_percentage: float) -> str:
        if oee_percentage >= 85.0:
            return "🌟 World-Class (OEE >= 85%)"
        elif oee_percentage >= 70.0:
            return "✅ Acceptable / Typical (70% - 84%)"
        else:
            return "⚠️ Needs Improvement (OEE < 70%)"

# Clean Subclass: Inherits concrete methods effortlessly
class ABBPickAndPlaceRobot(OEERobot):
    def __init__(self, robot_id: str):
        super().__init__(robot_id=robot_id, workstation="Packaging Cell #2")

    def execute_task(self) -> str:
        return "ABB IRB 360 FlexPicker: Sorting 120 parts/min with delta kinematics."

# Testing inherited functionality
abb = ABBPickAndPlaceRobot("ABB-DELTA-02")
print(f"Station: {abb.robot_id} ({abb.workstation})")
print(abb.execute_task())

availability = abb.calculate_availability(planned_min=480.0, downtime_min=30.0)
print(f"Shift Availability: {availability}%")
print(f"Benchmark: {abb.evaluate_oee_grade(oee_percentage=availability)}")
```

#### 🎉 Output:
```text
Station: ABB-DELTA-02 (Packaging Cell #2)
ABB IRB 360 FlexPicker: Sorting 120 parts/min with delta kinematics.
Shift Availability: 93.75%
Benchmark: 🌟 World-Class (OEE >= 85%)
```

</details>

[🔝 Back to Top](#top)

---

<span id="abstract-properties"></span>
### 3. Abstract Properties (`@property` + `@abstractmethod`)

Just as methods can be enforced, Python allows enforcing **properties** (getter attributes). This ensures that every subclass defines mandatory physical constants or performance ratings.

> [!IMPORTANT]
> **Decorator Order Matters:** Always place `@property` on the **outside** and `@abstractmethod` on the **inside**:
> ```python
> @property
> @abstractmethod
> def attribute_name(self) -> float:
>     pass
> ```

#### Robotics Introductory Example:
```python
from abc import ABC, abstractmethod

class RoboticArm(ABC):
    @property
    @abstractmethod
    def max_payload_kg(self) -> float:
        """Mandatory specification: Maximum wrist payload capacity."""
        pass

class KUKAHvyArm(RoboticArm):
    @property
    def max_payload_kg(self) -> float:
        return 210.0  # 210 kg heavy-duty payload capacity

arm = KUKAHvyArm()
print(f"Rated Payload: {arm.max_payload_kg} kg")
```

#### Output:
```text
Rated Payload: 210.0 kg
```

---

<details>
<summary>🏭 <b>Industrial Robotics Case Study: Ideal Cycle Time & Rated Payload Specifications</b> (Click to expand)</summary>

#### 🤖 Scenario: OEE Ideal Cycle Time & Workcell Capacity
To compute **Performance** in OEE ($P = \frac{\text{Ideal Time} \times \text{Count}}{\text{Operating Time}}$), every robot model must declare its **`ideal_cycle_time_sec`** (the theoretical fastest time in seconds to produce one unit under perfect laboratory conditions) and its **`rated_payload_kg`**.

---

#### ❌ Broken Code (The Problem)
A developer implemented `KUKAPrecisionPainter`, but forgot to implement the `ideal_cycle_time_sec` property:

```python
from abc import ABC, abstractmethod

class OEERobot(ABC):
    @property
    @abstractmethod
    def ideal_cycle_time_sec(self) -> float:
        """Ideal design cycle time per unit (seconds) used for OEE Performance."""
        pass

    @property
    @abstractmethod
    def rated_payload_kg(self) -> float:
        """Maximum allowable end-effector payload in kilograms."""
        pass

class KUKAPrecisionPainter(OEERobot):
    def __init__(self, robot_id: str):
        self.robot_id = robot_id

    # Developer implemented rated_payload_kg...
    @property
    def rated_payload_kg(self) -> float:
        return 16.0

    # ❌ BUG: Forgot to implement ideal_cycle_time_sec property!

# Attempting to instantiate for OEE calculation
painter = KUKAPrecisionPainter("KUKA-PAINT-05")
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class KUKAPrecisionPainter without an implementation for abstract method 'ideal_cycle_time_sec'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Specification Enforced:** `OEERobot` defined `ideal_cycle_time_sec` as an abstract property.
2. **Missing Property:** `KUKAPrecisionPainter` failed to implement the property.
3. **Early Contract Guard:** Python raised a `TypeError` before the unconfigured robot could enter the factory simulation.

---

#### ✅ Fixed Code (The Solution)
Implement both properties decorated with `@property`:

```python
from abc import ABC, abstractmethod

class OEERobot(ABC):
    @property
    @abstractmethod
    def ideal_cycle_time_sec(self) -> float:
        """Ideal design cycle time per unit (seconds) used for OEE Performance."""
        pass

    @property
    @abstractmethod
    def rated_payload_kg(self) -> float:
        """Maximum allowable end-effector payload in kilograms."""
        pass

class KUKAPrecisionPainter(OEERobot):
    def __init__(self, robot_id: str):
        self.robot_id = robot_id

    @property
    def ideal_cycle_time_sec(self) -> float:
        return 24.0  # 24.0 seconds ideal cycle per car door panel

    @property
    def rated_payload_kg(self) -> float:
        return 16.0  # 16.0 kg spray gun & atomizer assembly

# Instantiating and verifying technical specs
painter = KUKAPrecisionPainter("KUKA-PAINT-05")
print(f"Robot ID: {painter.robot_id}")
print(f"Ideal Design Cycle: {painter.ideal_cycle_time_sec} sec/part")
print(f"Rated Payload: {painter.rated_payload_kg} kg")
```

#### 🎉 Output:
```text
Robot ID: KUKA-PAINT-05
Ideal Design Cycle: 24.0 sec/part
Rated Payload: 16.0 kg
```

</details>

[🔝 Back to Top](#top)

---

<span id="instantiation-safeguards"></span>
### 4. Abstract Class Instantiation Safeguards

An Abstract Base Class containing abstract members **cannot be instantiated directly**. Attempting to do so triggers a `TypeError`.

#### Why Does Python Enforce This?
An abstract class is an **incomplete architectural blueprint**. For example, an abstract `OEERobot` does not know whether it operates a spot weld gun, a suction cup array, or an electrostatic spray bell. Allowing a raw `OEERobot()` instance would cause runtime crashes whenever domain-specific methods are called.

```python
from abc import ABC, abstractmethod

class OEERobot(ABC):
    @abstractmethod
    def process_part(self):
        pass

# ❌ Direct instantiation attempt:
try:
    generic_robot = OEERobot()
except TypeError as error:
    print(f"Captured Error: {error}")
```

#### Output:
```text
Captured Error: Can't instantiate abstract class OEERobot without an implementation for abstract method 'process_part'
```

[🔝 Back to Top](#top)

---

<span id="chunk-4"></span>
## 🏆 Chunk 4: Complete Industrial Robotics OEE Simulation Architecture

Here is a complete, production-grade Object-Oriented architecture integrating **Abstract Methods**, **Concrete Methods**, **Abstract Properties**, and **Polymorphic Fleet Execution** to calculate realistic shift OEE metrics across three diverse smart factory workcells.

```python
from abc import ABC, abstractmethod
from typing import List, Dict, Any

# ==========================================================
# 1. ABSTRACT BASE CLASS (Industrial OEE Robot Contract)
# ==========================================================
class OEERobot(ABC):
    """
    Abstract Base Class representing an automated robotic workstation.
    Enforces process implementation while providing universal OEE mathematics.
    """
    def __init__(self, robot_id: str, workstation: str, planned_production_min: float):
        self.robot_id = robot_id
        self.workstation = workstation
        self.planned_production_min = planned_production_min
        self.unplanned_downtime_min = 0.0

    # ------------------------------------------------------
    # ABSTRACT PROPERTIES (Mandatory Workcell Specs)
    # ------------------------------------------------------
    @property
    @abstractmethod
    def ideal_cycle_time_sec(self) -> float:
        """Theoretical fastest cycle time in seconds per part."""
        pass

    @property
    @abstractmethod
    def rated_payload_kg(self) -> float:
        """Maximum rated payload capacity in kilograms."""
        pass

    # ------------------------------------------------------
    # ABSTRACT METHODS (Workstation-Specific Tooling Logic)
    # ------------------------------------------------------
    @abstractmethod
    def execute_workstation_task(self, target_units: int) -> str:
        """Specific manufacturing process execution (welding, painting, palletizing)."""
        pass

    @abstractmethod
    def perform_quality_inspection(self, total_produced: int, defect_rate_pct: float) -> int:
        """Process-specific vision or probe inspection returning count of good parts."""
        pass

    # ------------------------------------------------------
    # CONCRETE METHODS (Universal Shared OEE Engine)
    # ------------------------------------------------------
    def log_downtime(self, minutes: float, reason: str) -> None:
        """Logs equipment breakdowns, tooling changes, or starved-line delays."""
        self.unplanned_downtime_min += minutes
        print(f"   ⚠️ [DOWNTIME LOGGED] {self.robot_id}: +{minutes} min due to '{reason}'")

    def calculate_oee_metrics(self, total_produced: int, good_parts: int) -> Dict[str, Any]:
        """
        Standardized OEE Telemetry Calculation Engine:
        - Availability (A) = Operating Time / Planned Production Time
        - Performance  (P) = (Ideal Cycle Time * Total Units) / (Operating Time in seconds)
        - Quality      (Q) = Good Parts / Total Units
        - OEE          (OEE) = A * P * Q
        """
        operating_time_min = max(0.0, self.planned_production_min - self.unplanned_downtime_min)
        operating_time_sec = operating_time_min * 60.0

        # 1. Availability
        availability = (operating_time_min / self.planned_production_min) if self.planned_production_min > 0 else 0.0

        # 2. Performance
        if operating_time_sec > 0 and total_produced > 0:
            ideal_operating_sec = self.ideal_cycle_time_sec * total_produced
            performance = min(1.0, ideal_operating_sec / operating_time_sec)
        else:
            performance = 0.0

        # 3. Quality
        quality = (good_parts / total_produced) if total_produced > 0 else 0.0

        # 4. Overall OEE
        oee = availability * performance * quality

        return {
            "operating_time_min": operating_time_min,
            "availability_pct": round(availability * 100.0, 2),
            "performance_pct": round(performance * 100.0, 2),
            "quality_pct": round(quality * 100.0, 2),
            "oee_pct": round(oee * 100.0, 2),
        }

    def evaluate_benchmark(self, oee_pct: float) -> str:
        """World-Class Industry Benchmark Rating."""
        if oee_pct >= 85.0:
            return "🌟 World-Class (OEE >= 85%)"
        elif oee_pct >= 75.0:
            return "✅ Good / Effective (75% - 84%)"
        elif oee_pct >= 65.0:
            return "⚠️ Acceptable / Minor Losses (65% - 74%)"
        else:
            return "❌ Critical Losses / Action Required (< 65%)"


# ==========================================================
# 2. CONCRETE SUBCLASSES (Specific Robot Implementations)
# ==========================================================
class FanucArcWelder(OEERobot):
    """Automotive Body Shop — High-Precision Spot & Arc Welding Cell."""
    @property
    def ideal_cycle_time_sec(self) -> float:
        return 15.0  # 15 seconds per chassis sub-assembly

    @property
    def rated_payload_kg(self) -> float:
        return 20.0  # Servo welding torch assembly

    def execute_workstation_task(self, target_units: int) -> str:
        return (
            f"🔥 [Fanuc ARC Mate] Executed 32 spot welds per chassis. "
            f"Laser optical seam-tracking active across {target_units} assemblies."
        )

    def perform_quality_inspection(self, total_produced: int, defect_rate_pct: float) -> int:
        defect_count = int(total_produced * (defect_rate_pct / 100.0))
        return total_produced - defect_count


class ABBPalletizer(OEERobot):
    """Packaging & Warehousing — High-Speed Carton Palletizing Cell."""
    @property
    def ideal_cycle_time_sec(self) -> float:
        return 6.0  # 6 seconds per master carton pick-and-place

    @property
    def rated_payload_kg(self) -> float:
        return 60.0  # Heavy pneumatic vacuum gripper

    def execute_workstation_task(self, target_units: int) -> str:
        return (
            f"📦 [ABB IRB 660] Stacked 4 layers on EUR-pallets. "
            f"Vacuum gripper picked and placed {target_units} cartons."
        )

    def perform_quality_inspection(self, total_produced: int, defect_rate_pct: float) -> int:
        defect_count = int(total_produced * (defect_rate_pct / 100.0))
        return total_produced - defect_count


class KUKAPaintRobot(OEERobot):
    """Paint Shop — Electrostatic Rotary Atomizer Spray Cell."""
    @property
    def ideal_cycle_time_sec(self) -> float:
        return 30.0  # 30 seconds per vehicle door panel coating

    @property
    def rated_payload_kg(self) -> float:
        return 16.0  # High-speed bell cup atomizer

    def execute_workstation_task(self, target_units: int) -> str:
        return (
            f"🎨 [KUKA KR 10] Applied 120-micron polyurethane clearcoat. "
            f"Electrostatic bell cup spinning at 45,000 RPM over {target_units} panels."
        )

    def perform_quality_inspection(self, total_produced: int, defect_rate_pct: float) -> int:
        defect_count = int(total_produced * (defect_rate_pct / 100.0))
        return total_produced - defect_count


# ==========================================================
# 3. POLYMORPHIC FACTORY TELEMETRY CONTROLLER
# ==========================================================
def run_shift_oee_audit(fleet: List[OEERobot], shift_data: List[Dict[str, Any]]) -> None:
    """
    Polymorphic evaluation of all factory robots during an 8-hour production shift.
    The caller interacts only through the abstract OEERobot interface!
    """
    print("=" * 85)
    print("🏭 SMART FACTORY OEE & ROBOTICS TELEMETRY AUDIT (8-HOUR PRODUCTION SHIFT)")
    print("=" * 85)

    shift_oee_sum = 0.0

    for robot, data in zip(fleet, shift_data):
        print(f"\n🤖 WORKCELL: {robot.robot_id} | {robot.workstation}")
        print(f"   ⚙️ Technical Specs: Ideal Cycle = {robot.ideal_cycle_time_sec}s | Max Payload = {robot.rated_payload_kg}kg")
        print(f"   {robot.execute_workstation_task(target_units=data['total_units'])}")

        # Log shift downtime incidents
        for downtime in data["downtime_events"]:
            robot.log_downtime(minutes=downtime["min"], reason=downtime["reason"])

        # Quality inspection
        good_units = robot.perform_quality_inspection(
            total_produced=data["total_units"],
            defect_rate_pct=data["defect_rate_pct"]
        )

        # Standardized OEE Calculation
        metrics = robot.calculate_oee_metrics(
            total_produced=data["total_units"],
            good_parts=good_units
        )

        shift_oee_sum += metrics["oee_pct"]

        print(f"   📊 TELEMETRY BREAKDOWN:")
        print(f"      • Operating Time: {metrics['operating_time_min']:.1f} / {robot.planned_production_min:.1f} min")
        print(f"      • Availability (A) : {metrics['availability_pct']}%")
        print(f"      • Performance  (P) : {metrics['performance_pct']}% ({data['total_units']} units produced)")
        print(f"      • Quality      (Q) : {metrics['quality_pct']}% ({good_units}/{data['total_units']} good units)")
        print(f"      • Workcell OEE     : {metrics['oee_pct']}% -> {robot.evaluate_benchmark(metrics['oee_pct'])}")

    plant_average_oee = shift_oee_sum / len(fleet)
    print("\n" + "=" * 85)
    print(f"🏁 PLANT-WIDE AVERAGE OEE SCORE: {plant_average_oee:.2f}%")
    print(f"   Fleet Status: {fleet[0].evaluate_benchmark(plant_average_oee)}")
    print("=" * 85)


# ==========================================================
# 4. SIMULATION EXECUTION (8-Hour Shift = 480 Minutes)
# ==========================================================
if __name__ == "__main__":
    # 8-hour planned production shift (480 minutes)
    PLANNED_SHIFT_MIN = 480.0

    robot_fleet: List[OEERobot] = [
        FanucArcWelder(
            robot_id="FANUC-WELD-01",
            workstation="Chassis Welding Cell #1",
            planned_production_min=PLANNED_SHIFT_MIN
        ),
        ABBPalletizer(
            robot_id="ABB-PALLET-02",
            workstation="Final Packaging Line #3",
            planned_production_min=PLANNED_SHIFT_MIN
        ),
        KUKAPaintRobot(
            robot_id="KUKA-PAINT-03",
            workstation="Automated Paint Booth #2",
            planned_production_min=PLANNED_SHIFT_MIN
        ),
    ]

    production_shift_data = [
        {
            "total_units": 1780,  # Expected ~1800 at 15s cycle
            "defect_rate_pct": 1.2,  # 1.2% weld seam porosity scrap
            "downtime_events": [
                {"min": 15.0, "reason": "Welding tip redressing & gas cylinder swap"},
                {"min": 10.0, "reason": "Chassis jig loading sensor alignment"}
            ]
        },
        {
            "total_units": 4400,  # Expected ~4500 at 6s cycle
            "defect_rate_pct": 0.5,  # 0.5% crushed carton rejection
            "downtime_events": [
                {"min": 20.0, "reason": "Stretch wrapper plastic roll replenishment"},
                {"min": 12.0, "reason": "AGV pallet transfer buffer delay"}
            ]
        },
        {
            "total_units": 890,   # Expected ~900 at 30s cycle
            "defect_rate_pct": 2.5,  # 2.5% clearcoat paint run / dust spec
            "downtime_events": [
                {"min": 25.0, "reason": "Atomizer solvent purge & nozzle color change"},
                {"min": 18.0, "reason": "Air filtration humidity stabilization"}
            ]
        }
    ]

    run_shift_oee_audit(robot_fleet, production_shift_data)
```

#### 🎉 Output:
```text
=====================================================================================
🏭 SMART FACTORY OEE & ROBOTICS TELEMETRY AUDIT (8-HOUR PRODUCTION SHIFT)
=====================================================================================

🤖 WORKCELL: FANUC-WELD-01 | Chassis Welding Cell #1
   ⚙️ Technical Specs: Ideal Cycle = 15.0s | Max Payload = 20.0kg
   🔥 [Fanuc ARC Mate] Executed 32 spot welds per chassis. Laser optical seam-tracking active across 1780 assemblies.
   ⚠️ [DOWNTIME LOGGED] FANUC-WELD-01: +15.0 min due to 'Welding tip redressing & gas cylinder swap'
   ⚠️ [DOWNTIME LOGGED] FANUC-WELD-01: +10.0 min due to 'Chassis jig loading sensor alignment'
   📊 TELEMETRY BREAKDOWN:
      • Operating Time: 455.0 / 480.0 min
      • Availability (A) : 94.79%
      • Performance  (P) : 97.8% (1780 units produced)
      • Quality      (Q) : 98.82% (1759/1780 good units)
      • Workcell OEE     : 91.61% -> 🌟 World-Class (OEE >= 85%)

🤖 WORKCELL: ABB-PALLET-02 | Final Packaging Line #3
   ⚙️ Technical Specs: Ideal Cycle = 6.0s | Max Payload = 60.0kg
   📦 [ABB IRB 660] Stacked 4 layers on EUR-pallets. Vacuum gripper picked and placed 4400 cartons.
   ⚠️ [DOWNTIME LOGGED] ABB-PALLET-02: +20.0 min due to 'Stretch wrapper plastic roll replenishment'
   ⚠️ [DOWNTIME LOGGED] ABB-PALLET-02: +12.0 min due to 'AGV pallet transfer buffer delay'
   📊 TELEMETRY BREAKDOWN:
      • Operating Time: 448.0 / 480.0 min
      • Availability (A) : 93.33%
      • Performance  (P) : 98.21% (4400 units produced)
      • Quality      (Q) : 99.5% (4378/4400 good units)
      • Workcell OEE     : 91.2% -> 🌟 World-Class (OEE >= 85%)

🤖 WORKCELL: KUKA-PAINT-03 | Automated Paint Booth #2
   ⚙️ Technical Specs: Ideal Cycle = 30.0s | Max Payload = 16.0kg
   🎨 [KUKA KR 10] Applied 120-micron polyurethane clearcoat. Electrostatic bell cup spinning at 45,000 RPM over 890 panels.
   ⚠️ [DOWNTIME LOGGED] KUKA-PAINT-03: +25.0 min due to 'Atomizer solvent purge & nozzle color change'
   ⚠️ [DOWNTIME LOGGED] KUKA-PAINT-03: +18.0 min due to 'Air filtration humidity stabilization'
   📊 TELEMETRY BREAKDOWN:
      • Operating Time: 437.0 / 480.0 min
      • Availability (A) : 91.04%
      • Performance  (P) : 100.0% (890 units produced)
      • Quality      (Q) : 97.53% (868/890 good units)
      • Workcell OEE     : 88.79% -> 🌟 World-Class (OEE >= 85%)

=====================================================================================
🏁 PLANT-WIDE AVERAGE OEE SCORE: 90.53%
   Fleet Status: 🌟 World-Class (OEE >= 85%)
=====================================================================================
```

[🔝 Back to Top](#top)

---

<span id="chunk-5"></span>
## 📊 Chunk 5: Summary Comparison & Key Takeaways

### 1. Summary Comparison Table

| Abstraction Member | Decorator Syntax | Implemented in Abstract Base Class? | Must Child Subclass Override? | Primary Objective |
| :--- | :--- | :---: | :---: | :--- |
| **Abstract Method** | `@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce unique, mandatory process logic for each robot workcell. |
| **Concrete Method** | None | ✅ **Yes** (Full Body) | ❌ No (Inherited) | Provide reusable, standardized OEE formulas and safety routines. |
| **Abstract Property** | `@property`<br>`@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce mandatory technical specifications (e.g. ideal cycle time). |
| **Abstract Class** | Inherits `ABC` | N/A | N/A | Acts as the architectural blueprint; prevents direct instantiation. |

---

### 2. 🔑 Core Takeaways & Mental Model

1. **Abstraction = "What to do" vs. "How to do it"**:
   - The Abstract Base Class (`OEERobot`) dictates **what** metrics and operations must exist across the plant.
   - The concrete child classes (`FanucArcWelder`, `ABBPalletizer`, `KUKAPaintRobot`) define **how** those manufacturing operations are physically executed.

2. **Always Inherit `abc.ABC`**:
   - Without inheriting `ABC`, the `@abstractmethod` decorator will not prevent direct instantiation of the base class.

3. **Decorator Order Matters for Abstract Properties**:
   ```python
   # ✅ Correct Order: @property on outside, @abstractmethod on inside
   @property
   @abstractmethod
   def ideal_cycle_time_sec(self) -> float:
       pass
   ```

4. **Prevents Runtime Bugs via Early Contract Checks**:
   - If an engineer adds a new robot model to the codebase and forgets to implement a required method, Python raises a `TypeError` at instantiation time rather than failing in the middle of a live production shift.

---

[🔝 Back to Top](#top)
