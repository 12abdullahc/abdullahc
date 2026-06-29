# Module 1: Foundations of Object-Oriented Programming (OOP) in Python

Welcome to **Module 1** of your MotoGP Team Management & Live Telemetry Analytics system course. In this module, we lay down the foundational pillars of OOP in Python. We will explore how classes and objects are constructed under the hood, how Python manages namespaces, and how to write clean, pythonic code that models the real-world domain of MotoGP racing.

---

## 1. Theoretical Deep Dive

### Classes vs. Objects (Blueprints vs. Instances)
In Python, a **Class** is a blueprint or template for creating objects. An **Object** (or instance) is a concrete manifestation of that class, containing its own state and behavior. 
Under the hood, classes are themselves objects of type `type`. When Python compiles a class definition, it creates a class object in memory. When you instantiate a class, you create a new instance object pointing to that class object.

### The Lifecycle of Object Creation: `__new__` vs `__init__`
When you instantiate a class via `bike = RaceBike("Bagnaia", 355.0)`:
1. Python first calls the static method `__new__(cls, *args, **kwargs)`. This method is responsible for allocating memory and returning a raw, uninitialized instance of the class.
2. If `__new__` returns an instance of the class, Python then calls `__init__(self, *args, **kwargs)` (the initializer) to bind values to the newly created instance (`self`).

### Under the Hood: Namespaces & `__dict__`
Python resolves attribute lookups using dictionaries. Every class and every instance maintains a namespace dictionary called `__dict__`.
- **Instance Namespace**: Contains attributes specific to that object (e.g., `self.rider`).
- **Class Namespace**: Contains attributes and methods shared by all instances of the class (e.g., class variables, methods).

When you look up an attribute `instance.attribute`:
1. Python checks `instance.__dict__`.
2. If not found, it checks `instance.__class__.__dict__`.
3. If not found there, it follows the **Method Resolution Order (MRO)** up through base classes.
4. If still not found, it raises an `AttributeError`.

```
[ Instance: Ducati GP24 ] ----(Lookup fails)----> [ Class: RaceBike ] ----(Lookup fails)----> [ Parent Class: object ]
  __dict__: {                         __dict__: {                       __dict__: {
    "rider": "Bagnaia",                 "CATEGORY": "MotoGP",             "__init__": <func>,
    "max_speed": 355.0                  "accelerate": <func>              ...
  }                                   }                                 }
```

### The Role of `self`
In Python, instance methods are simply functions defined inside a class block. When a method is called on an instance (e.g., `bike.accelerate(10)`), Python automatically translates it under the hood to:
```python
RaceBike.accelerate(bike, 10)
```
The parameter `self` is not a keyword but a strong PEP 8 convention. It acts as the reference to the active object instance. Methods that have `self` are **bound methods**; calling them binds the instance to the first argument.

### Class Variables vs. Instance Variables
- **Instance Variables**: Defined inside methods (usually `__init__`) using `self.attribute`. They represent the state unique to each instance.
- **Class Variables**: Defined directly inside the class body, outside of any methods. They are shared across all instances of the class.
  
> [!WARNING]
> **Mutable Class Variables Gotcha:** If you define a class variable with a mutable type (like a list or dict), modifying it in-place (e.g., `self.list_var.append(x)`) modifies the shared object across all instances. Always initialize lists or dicts inside the `__init__` method unless you explicitly want shared state.

### String Representation: `__str__` vs. `__repr__`
Python provides two magic (dunder) methods to define how an object is printed:
- `__str__(self)`: Intended to return a user-friendly, highly readable string representation. Used by `print()` and `str()`.
- `__repr__(self)`: Intended to return an unambiguous, detailed string representation, ideally resembling the Python code used to construct the object. Used by debuggers, interactive shells, and `repr()`.

---

## 2. MotoGP Blueprint (Code Example)

Below is a PEP 8 compliant, type-hinted implementation modeling a basic `RaceBike` and a `MotoGPTeam`.

```python
from typing import List, Optional

class RaceBike:
    # Class Variable (Shared across all bike instances)
    CATEGORY: str = "MotoGP"

    def __init__(self, rider: str, max_speed: float, bike_id: str) -> None:
        """
        Initializes a new MotoGP Race Bike.
        
        :param rider: Name of the rider.
        :param max_speed: Maximum speed capability in km/h.
        :param bike_id: Unique identification string for the chassis.
        """
        # Instance Variables (Unique to each bike instance)
        self.rider: str = rider
        self.max_speed: float = max_speed
        self.bike_id: str = bike_id
        self.current_speed: float = 0.0

    def accelerate(self, increment: float) -> None:
        """Increase current speed, capped at max_speed."""
        self.current_speed = min(self.current_speed + increment, self.max_speed)

    def brake(self, decrement: float) -> None:
        """Decrease current speed, bottoming out at 0.0."""
        self.current_speed = max(self.current_speed - decrement, 0.0)

    def __str__(self) -> str:
        """User-friendly representation of the bike."""
        return f"{self.rider}'s Bike [{self.bike_id}] | Speed: {self.current_speed}/{self.max_speed} km/h"

    def __repr__(self) -> str:
        """Unambiguous representation that mimics instantiation code."""
        return f"RaceBike(rider={self.rider!r}, max_speed={self.max_speed!r}, bike_id={self.bike_id!r})"


class MotoGPTeam:
    # Class Variables
    MAX_RIDERS: int = 2

    def __init__(self, team_name: str, manufacturer: str) -> None:
        """
        Initializes a MotoGP racing team.
        
        :param team_name: Name of the team.
        :param manufacturer: Bike constructor/manufacturer.
        """
        self.team_name: str = team_name
        self.manufacturer: str = manufacturer
        self.bikes: List[RaceBike] = []  # Composition: Team contains bikes

    def register_bike(self, bike: RaceBike) -> bool:
        """
        Registers a bike and rider to the team roster.
        Respects the team rider limit (MAX_RIDERS).
        """
        if len(self.bikes) >= self.MAX_RIDERS:
            print(f"[!] Warning: Cannot register {bike.rider}. Roster full for {self.team_name}.")
            return False
        
        self.bikes.append(bike)
        return True

    def get_fastest_bike(self) -> Optional[RaceBike]:
        """Returns the bike with the highest theoretical top speed on the roster."""
        if not self.bikes:
            return None
        return max(self.bikes, key=lambda b: b.max_speed)

    def __str__(self) -> str:
        """User-friendly summary of the team roster."""
        riders = ", ".join(bike.rider for bike in self.bikes) or "No riders signed"
        return f"Team {self.team_name} ({self.manufacturer}) - Roster: [{riders}]"

    def __repr__(self) -> str:
        return f"MotoGPTeam(team_name={self.team_name!r}, manufacturer={self.manufacturer!r})"


# --- Live Sandbox Execution ---
if __name__ == "__main__":
    # Create bikes
    pecco_bike = RaceBike("Francesco Bagnaia", 361.2, "DUC-63")
    marquez_bike = RaceBike("Marc Marquez", 359.8, "DUC-93")
    martin_bike = RaceBike("Jorge Martin", 362.4, "DUC-89")

    # Create team
    ducati_lenovo = MotoGPTeam("Ducati Lenovo Team", "Ducati")

    # Register riders/bikes
    print(f"Registering Pecco: {ducati_lenovo.register_bike(pecco_bike)}")
    print(f"Registering Marquez: {ducati_lenovo.register_bike(marquez_bike)}")
    # Try to register a third rider (should exceed MAX_RIDERS)
    print(f"Registering Martin: {ducati_lenovo.register_bike(martin_bike)}")

    # Display team info
    print("\n--- Team Info ---")
    print(str(ducati_lenovo))
    print(repr(ducati_lenovo))

    # Test speed simulation
    print("\n--- Speed Simulation ---")
    pecco_bike.accelerate(120.0)
    pecco_bike.accelerate(300.0)  # Should cap at 361.2
    print(str(pecco_bike))
    print(repr(pecco_bike))
    
    # Get fastest bike on roster
    fastest = ducati_lenovo.get_fastest_bike()
    if fastest:
        print(f"\nFastest Bike on roster: {fastest.rider} with a max speed of {fastest.max_speed} km/h")
```

---

## 3. Recommended Tools Spotlight

To ensure your code meets professional standards, integrate these tools into your workflow:
1. **`mypy` (Static Type Checker)**: Python is dynamically typed, but type hints make it robust. Use `mypy` to catch type errors before runtime.
   - Installation: `pip install mypy`
   - Execution: `mypy learn_oop_module1.py`
2. **`pytest` (Testing Framework)**: Industry-standard testing framework. Use it to assert class logic.
   - Installation: `pip install pytest`
   - Simple check: Put tests in a file starting with `test_` and run `pytest`.
3. **VS Code Interactive Debugger**: Set breakpoints inside `__init__` and inspect variables in the variables pane to watch `self` mutate in real-time.

---

## 4. Pit-Lane Challenge (Exercise)

### Background
During a MotoGP race, tyre degradation (wear) is critical. Pit wall engineers monitor the tyre's operational temperature to predict wear rate. 

### Specifications
Write a Python class named `RaceTyre` that meets the following specifications:
1. **Class Variables**:
   - `OPTIMAL_TEMP_RANGE`: A tuple representing the minimum and maximum optimal temperature range in Celsius: `(80.0, 110.0)`.
   - `ACTIVE_TYRES_COUNT`: An integer tracking the total number of `RaceTyre` objects instantiated.
2. **Instance Variables**:
   - `compound`: A string representing the compound type (e.g., `"Soft"`, `"Medium"`, `"Hard"`).
   - `temperature`: A float representing the current temperature of the tyre in Celsius.
   - `wear_percentage`: A float representing the degradation percentage (starts at `0.0`, must never exceed `100.0`).
3. **Methods**:
   - `__init__(self, compound: str, temperature: float)`: Initializes the tyre. Increments `ACTIVE_TYRES_COUNT` by 1.
   - `simulate_lap(self, lap_distance_km: float)`: Calculates the degradation for the lap.
     - The wear rate depends on the tyre compound:
       - `"Soft"`: Base wear of `1.5%` per kilometer.
       - `"Medium"`: Base wear of `1.0%` per kilometer.
       - `"Hard"`: Base wear of `0.6%` per kilometer.
     - **Temperature Penalty**: If the current temperature is *outside* the `OPTIMAL_TEMP_RANGE`:
       - If below `80.0`°C, add a penalty of `(80.0 - temperature) * 0.02%` per kilometer.
       - If above `110.0`°C, add a penalty of `(temperature - 110.0) * 0.05%` per kilometer.
     - Calculate the total wear increment for the lap and add it to `self.wear_percentage` (capped at `100.0%`).
   - `__str__(self)`: Returns a clean user message: `"<compound> Tyre | Wear: <wear_percentage>% | Temp: <temp>C"`.
   - `__repr__(self)`: Returns `RaceTyre(compound='<compound>', temperature=<temp>)`.

---

## 5. Telemetry Readout (Answer Key)

Below is the solution to the Pit-Lane Challenge. Try coding it yourself first before revealing it!

<details>
<summary>Click to reveal solution</summary>

```python
class RaceTyre:
    # Class Variables
    OPTIMAL_TEMP_RANGE: tuple[float, float] = (80.0, 110.0)
    ACTIVE_TYRES_COUNT: int = 0

    def __init__(self, compound: str, temperature: float) -> None:
        """
        Initializes a RaceTyre and tracks instance creation.
        """
        self.compound: str = compound
        self.temperature: float = temperature
        self.wear_percentage: float = 0.0
        
        # Accessing and modifying class variable via the class itself
        RaceTyre.ACTIVE_TYRES_COUNT += 1

    def simulate_lap(self, lap_distance_km: float) -> None:
        """
        Simulates tyre wear over a single lap, factoring in compound and temperature penalty.
        """
        # Determine base wear rate per km
        if self.compound == "Soft":
            base_wear_rate = 1.5
        elif self.compound == "Medium":
            base_wear_rate = 1.0
        elif self.compound == "Hard":
            base_wear_rate = 0.6
        else:
            # Fallback for unknown compounds
            base_wear_rate = 1.0

        # Calculate penalty for suboptimal temperatures
        temp_penalty = 0.0
        min_opt, max_opt = self.OPTIMAL_TEMP_RANGE

        if self.temperature < min_opt:
            temp_penalty = (min_opt - self.temperature) * 0.02
        elif self.temperature > max_opt:
            temp_penalty = (self.temperature - max_opt) * 0.05

        # Total wear rate per km = base rate + penalty rate
        total_wear_rate_per_km = base_wear_rate + temp_penalty
        
        # Calculate wear increment for this lap
        wear_increment = lap_distance_km * total_wear_rate_per_km
        
        # Update wear percentage, capped at 100%
        self.wear_percentage = min(self.wear_percentage + wear_increment, 100.0)

    def __str__(self) -> str:
        return f"{self.compound} Tyre | Wear: {self.wear_percentage:.2f}% | Temp: {self.temperature}°C"

    def __repr__(self) -> str:
        return f"RaceTyre(compound={self.compound!r}, temperature={self.temperature!r})"


# --- Exercise Verification Verification Run ---
if __name__ == "__main__":
    print(f"Initial Tyres Count: {RaceTyre.ACTIVE_TYRES_COUNT}")
    
    # Instantiate tyres
    front_tyre = RaceTyre("Soft", 75.0)    # Suboptimal (cold)
    rear_tyre = RaceTyre("Medium", 95.0)   # Optimal temperature
    hot_tyre = RaceTyre("Hard", 120.0)     # Suboptimal (hot)

    print(f"Tyres Count after instantiation: {RaceTyre.ACTIVE_TYRES_COUNT}")

    # Lap length at Circuit of the Americas: 5.513 km
    lap_length = 5.513

    # Simulate lap
    front_tyre.simulate_lap(lap_length)
    rear_tyre.simulate_lap(lap_length)
    hot_tyre.simulate_lap(lap_length)

    print("\n--- Tyre Status after 1 Lap ---")
    print(str(front_tyre))
    print(str(rear_tyre))
    print(str(hot_tyre))

    print("\n--- Developer Repr Output ---")
    print(repr(front_tyre))
```
</details>

---

# Module 2: The Core Pillars (Part 1) - Encapsulation & Inheritance

Welcome to **Module 2**. Now that you understand how objects are instantiated and how namespaces resolve lookups, we will dive into the first two core pillars of Object-Oriented Programming: **Encapsulation** and **Inheritance**. We will explore how Python implements these concepts differently from languages like Java or C++, and look under the hood at Python's Method Resolution Order (MRO).

---

## 1. Theoretical Deep Dive

### Encapsulation: Access Modifiers & Python's Philosophy
In many languages, keywords like `private`, `protected`, and `public` enforce strict boundary access. Python takes a different approach, guided by the principle: *"We are all consenting adults here."* Python does not statically prevent access to attributes; instead, it relies on naming conventions and name mangling.

#### 1. Public Attributes (No prefix)
Attributes like `self.rider` are public. They can be read, modified, and deleted from outside the class.

#### 2. Protected Attributes (Single Underscore `_`)
Attributes prefixed with a single underscore (e.g., `self._engine_temp`) are **protected by convention**. This is a signal to other developers that the attribute is internal and should not be accessed directly outside the class or its subclasses. 
- *Note:* Python's interpreter does not enforce this restriction. It will still allow access (`print(bike._engine_temp)`). However, linters like `pylint` will flag this as a warning.

#### 3. Private Attributes (Double Underscore `__`)
Attributes prefixed with a double underscore (e.g., `self.__log_data`) trigger **Name Mangling**.
- **Under the Hood:** To prevent name collisions in subclass hierarchies, the Python interpreter dynamically renames these attributes to `_ClassName__attribute`.
- If class `TelemetrySensor` has `self.__log_data`, it is stored in the object's `__dict__` as `_TelemetrySensor__log_data`.
- If a subclass attempts to access `self.__log_data`, it will raise an `AttributeError` because Python expects it to be in the subclass's prefix form (e.g., `_Subclass__log_data`).

#### 4. The `@property` Decorator (Getters and Setters)
Rather than writing verbose `get_speed()` and `set_speed()` methods, Python uses descriptors via the `@property` decorator to implement getters and setters. This allows attributes to be accessed like normal attributes, but run custom validation or calculation logic under the hood.

```python
class Sensor:
    def __init__(self, value: float) -> None:
        self._value = value

    @property
    def value(self) -> float:
        """Getter: returns the value."""
        return self._value

    @value.setter
    def value(self, val: float) -> None:
        """Setter: adds validation."""
        if val < 0:
            raise ValueError("Telemetry values cannot be negative")
        self._value = val
```

---

### Inheritance: Hierarchies and method dispatch
Inheritance allows a subclass to acquire the attributes and methods of a parent class. Python supports three primary types of inheritance:
1. **Single Inheritance**: Subclass inherits from one parent.
2. **Multilevel Inheritance**: A subclass inherits from a class which in turn inherits from another class (e.g., `RaceBike -> QualifyingBike -> SuperQualifyingBike`).
3. **Multiple Inheritance**: A subclass inherits directly from more than one parent class.

#### Method Resolution Order (MRO) & C3 Linearization
When you call a method on an object in a multiple inheritance setup, Python must determine the search order to locate that method. It does this using the **C3 Linearization** algorithm.
- You can inspect this order using `Class.mro()` or the `__mro__` attribute.
- C3 enforces two main properties:
  - **Subclass Parent Relationship**: Subclasses are searched before parent classes.
  - **Left-to-Right Ordering**: Parent classes listed first in the class definition are searched first.

#### The Magic of `super()`
The `super()` function returns a proxy object that delegates method calls to a parent or sibling class in the MRO. 
- In single inheritance, `super()` simply calls the parent class's method.
- In multiple inheritance, `super()` does not just look at the parent; it looks at the **next class in the MRO**. This is critical for **cooperative multiple inheritance**, preventing grandparent classes from having their initializers called multiple times.

---

## 2. MotoGP Blueprint (Code Example)

Here we model secure `TelemetrySensor` logging and specialized bike classes using encapsulation, inheritance, and MRO.

```python
from typing import List, Dict, Any
import time

class TelemetrySensor:
    def __init__(self, sensor_type: str) -> None:
        self.sensor_type: str = sensor_type
        # Protected attribute: intended for internal or subclass use
        self._is_calibrated: bool = False
        # Private attribute: name mangled to prevent direct external access
        self.__log_history: List[Dict[str, Any]] = []

    @property
    def is_calibrated(self) -> bool:
        """Getter for the protected attribute."""
        return self._is_calibrated

    @property
    def log_count(self) -> int:
        """Getter returning a computed property based on the private log history."""
        return len(self.__log_history)

    def calibrate(self) -> None:
        """Calibrate the sensor."""
        self._is_calibrated = True
        self.__record_log("CALIBRATION", "Sensor calibrated successfully.")

    # Private helper method (name mangled to _TelemetrySensor__record_log)
    def __record_log(self, event_type: str, details: str) -> None:
        self.__log_history.append({
            "timestamp": time.time(),
            "event": event_type,
            "details": details
        })

    def capture_data(self, data_point: float) -> None:
        """Capture sensor reading (public API)."""
        if not self._is_calibrated:
            raise RuntimeError("Cannot capture data: Sensor not calibrated.")
        self.__record_log("DATA_CAPTURE", f"Value: {data_point}")


class RaceBike:
    def __init__(self, rider: str, base_weight: float) -> None:
        self.rider: str = rider
        self.base_weight: float = base_weight  # in kg
        self._engine_mapping: str = "Standard"  # Protected configuration

    def get_performance_profile(self) -> str:
        """Returns performance configuration of the bike."""
        return f"Rider: {self.rider} | Weight: {self.base_weight}kg | Engine Map: {self._engine_mapping}"


class QualifyingBike(RaceBike):
    """
    Subclass representing a bike optimized for short-run qualifying sessions.
    Inherits from RaceBike (Single Inheritance).
    """
    def __init__(self, rider: str, base_weight: float) -> None:
        # Use super() to initialize base class attributes
        # Qualifying bikes are stripped of excess parts to be 5kg lighter
        super().__init__(rider, base_weight - 5.0)
        self._engine_mapping = "Qualifying-Maximum"  # Overriding protected attribute
        self.has_super_soft_tyres: bool = True

    # Method Overriding
    def get_performance_profile(self) -> str:
        """Overrides base behavior to add qualifying-specific configurations."""
        base_profile = super().get_performance_profile()
        return f"[Qualifying Spec] {base_profile} | Super Soft Tyres: {self.has_super_soft_tyres}"


class RaceDayBike(RaceBike):
    """
    Subclass representing a bike optimized for long-run consistency and tyre management.
    """
    def __init__(self, rider: str, base_weight: float, fuel_capacity: float) -> None:
        super().__init__(rider, base_weight)
        self.fuel_capacity: float = fuel_capacity  # in liters
        self._engine_mapping = "Race-Conserve"

    def get_performance_profile(self) -> str:
        base_profile = super().get_performance_profile()
        return f"[Race Spec] {base_profile} | Fuel capacity: {self.fuel_capacity}L"


# --- Cooperative Multiple Inheritance Mixin Demonstration ---
class GPSLogger:
    """A mixin class to add GPS coordinate logging."""
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        # Pass remaining arguments to the next initializer in MRO
        super().__init__(*args, **kwargs)
        self.gps_coordinates: List[tuple[float, float]] = []

    def log_gps(self, latitude: float, longitude: float) -> None:
        self.gps_coordinates.append((latitude, longitude))


class SmartRaceBike(GPSLogger, RaceBike):
    """
    A smart bike inheriting from both GPSLogger (Mixin) and RaceBike.
    Demonstrates Multiple Inheritance.
    """
    def __init__(self, rider: str, base_weight: float) -> None:
        # super() navigates MRO: SmartRaceBike -> GPSLogger -> RaceBike -> object
        super().__init__(rider=rider, base_weight=base_weight)


# --- Live Sandbox Execution ---
if __name__ == "__main__":
    print("=== ENCAPSULATION DEMO ===")
    sensor = TelemetrySensor("EngineTemp")
    sensor.calibrate()
    sensor.capture_data(105.4)
    print(f"Sensor calibrated: {sensor.is_calibrated}")
    print(f"Log count: {sensor.log_count}")
    
    # Try to access private attribute (will fail)
    try:
        print(sensor.__log_history)
    except AttributeError as e:
        print(f"Expected failure: {e}")

    # Access private attribute via name mangled name (possible but discouraged)
    print(f"Mangled Access: {sensor._TelemetrySensor__log_history}")

    print("\n=== INHERITANCE & METHOD OVERRIDING DEMO ===")
    standard_bike = RaceBike("Enea Bastianini", 157.0)
    qual_bike = QualifyingBike("Jorge Martin", 157.0)
    race_bike = RaceDayBike("Francesco Bagnaia", 157.0, 22.0)

    print(standard_bike.get_performance_profile())
    print(qual_bike.get_performance_profile())
    print(race_bike.get_performance_profile())

    print("\n=== MULTIPLE INHERITANCE & MRO DEMO ===")
    smart_bike = SmartRaceBike("Marc Marquez", 157.0)
    smart_bike.log_gps(34.0522, -118.2437)
    
    print(f"Smart Bike Rider: {smart_bike.rider}")
    print(f"Smart Bike GPS Logs: {smart_bike.gps_coordinates}")
    
    print("\nMethod Resolution Order (MRO) for SmartRaceBike:")
    for cls in SmartRaceBike.mro():
        print(f" - {cls.__name__}")
```

---

## 3. Recommended Tools Spotlight

1. **`inspect` Module (Python Standard Library)**: Inspect MRO programmatically.
   - Example:
     ```python
     import inspect
     print(inspect.getmro(SmartRaceBike))
     ```
2. **Pylint (Linter)**: Use Pylint to enforce access rules. If you access `_engine_mapping` from outside a class method, Pylint will raise a `protected-access` warning.
3. **Mypy with Subtyping**: Check that instances of subclasses are recognized correctly by static analysis when a base class type is expected (Liskov Substitution Principle verification).

---

## 4. Pit-Lane Challenge (Exercise)

### Background
The team wants to protect sensor settings from accidental modification by the mechanics, while allowing engineers to set warning thresholds. Furthermore, we need to create a specialized sensor subclass for tyre pressure monitoring.

### Specifications
1. Write a base class `SensorUnit` with:
   - A private attribute `__warning_threshold` (float, initialized to `100.0`).
   - A property `warning_threshold` with a getter and setter. The setter must validate that the threshold is positive (throw a `ValueError` otherwise).
   - A public method `check_value(self, current_value: float) -> bool` that returns `True` if the value exceeds the threshold (warning triggered), otherwise `False`.
2. Write a subclass `TyrePressureSensor` that inherits from `SensorUnit`:
   - Overrides `__init__` to set the base warning threshold to a default of `2.2` (bar) using `super()`.
   - Overrides `check_value(self, current_value: float) -> bool` to warn if the pressure is **outside** the optimal range: it should trigger a warning (return `True`) if the pressure is either *below* `1.8` bar or *above* the set `warning_threshold` (e.g., `2.5` bar).

---

## 5. Telemetry Readout (Answer Key)

Below is the solution to the Pit-Lane Challenge.

<details>
<summary>Click to reveal solution</summary>

```python
class SensorUnit:
    def __init__(self, initial_threshold: float = 100.0) -> None:
        # Private attribute encapsulated
        if initial_threshold <= 0:
            raise ValueError("Threshold must be positive.")
        self.__warning_threshold: float = initial_threshold

    @property
    def warning_threshold(self) -> float:
        """Getter for warning threshold."""
        return self.__warning_threshold

    @warning_threshold.setter
    def warning_threshold(self, value: float) -> None:
        """Setter with validation."""
        if value <= 0:
            raise ValueError("Threshold must be positive.")
        self.__warning_threshold = value

    def check_value(self, current_value: float) -> bool:
        """Returns True if the value exceeds the threshold."""
        return current_value > self.__warning_threshold


class TyrePressureSensor(SensorUnit):
    def __init__(self, initial_threshold: float = 2.2) -> None:
        # Initialize parent class with tyre pressure threshold (default: 2.2 bar)
        super().__init__(initial_threshold)
        # Protected variable for low pressure warning limit
        self._min_pressure_limit: float = 1.8

    def check_value(self, current_value: float) -> bool:
        """
        Overrides parent method to trigger warning if pressure is 
        too low (< 1.8 bar) OR too high (> warning_threshold).
        """
        if current_value < self._min_pressure_limit:
            print(f"[!] Alert: Pressure dangerously low ({current_value} bar)!")
            return True
        
        # Check parent's threshold using warning_threshold property
        if super().check_value(current_value):
            print(f"[!] Alert: Pressure exceeds threshold ({current_value} > {self.warning_threshold} bar)!")
            return True
            
        return False


# --- Exercise Verification Run ---
if __name__ == "__main__":
    # Base Sensor Unit test
    temp_sensor = SensorUnit(initial_threshold=110.0)
    print(f"Base Sensor Threshold: {temp_sensor.warning_threshold}")
    print(f"Temp 105.0 exceeds limit? {temp_sensor.check_value(105.0)}")
    print(f"Temp 115.0 exceeds limit? {temp_sensor.check_value(115.0)}")

    print("\n--- Tyre Pressure Sensor Unit test ---")
    pressure_sensor = TyrePressureSensor(initial_threshold=2.4)
    print(f"Optimal Tyre pressure threshold: {pressure_sensor.warning_threshold}")
    
    # Test values
    print(f"Pressure 2.0 warning? {pressure_sensor.check_value(2.0)}")  # Within bounds (1.8 - 2.4)
    print(f"Pressure 1.7 warning? {pressure_sensor.check_value(1.7)}")  # Under bounds
    print(f"Pressure 2.5 warning? {pressure_sensor.check_value(2.5)}")  # Over bounds
```

</details>

---

# Module 3: The Core Pillars (Part 2) - Polymorphism & Composition

Welcome to **Module 3**. We have covered encapsulation and class inheritance. In this module, we explore the final two key concepts that allow developers to build decoupled, flexible systems: **Polymorphism** and **Composition**. We will examine how Python handles dynamic interfaces under the hood, compare composition against inheritance, and implement a flexible component structure.

---

## 1. Theoretical Deep Dive

### Polymorphism: "Many Forms"
Polymorphism refers to the ability of different classes to respond to the same method interface in unique ways. In Python, there are two primary ways to achieve this:

#### 1. Duck Typing (Implicit/Dynamic Polymorphism)
Python is dynamically typed and adheres to the philosophy: *"If it walks like a duck and quacks like a duck, it's a duck."*
- Unlike C# or Java, which require classes to implement a specific `interface` or inherit from a specific parent to be treated interchangeably, Python only checks if the object supports the called method/attribute at runtime.
- **Under the Hood:** Python's interpreter attempts to call the method. If the object namespace (`__dict__`) or its class namespace contains a function matching that method name, it binds and executes it. If not, it raises an `AttributeError`.

#### 2. Abstract Base Classes (ABCs)
While Duck Typing is powerful, it can be too permissive for large codebases. The standard library `abc` module provides a way to define **formal interfaces** using Abstract Base Classes.
- **`@abstractmethod` Decorator**: Declares a method that subclasses *must* override.
- **Instantiation Lock**: Python prevents you from instantiating any class that inherits from an ABC but has not overridden all abstract methods.
- **Under the Hood:** When a class is declared with a metaclass of `abc.ABCMeta` (implicitly done when inheriting from `abc.ABC`), Python checks the class attributes upon instantiation. If any method in the inheritance hierarchy is marked as an abstract method and has not been overridden, Python raises a `TypeError`.

---

### Composition vs. Inheritance: "IS-A" vs. "HAS-A"
- **Inheritance** models an **"IS-A"** relationship. A `QualifyingBike` *is a* `RaceBike`. While inheritance allows quick code reuse, it can lead to deeply nested, fragile class hierarchies. If a parent class changes, every subclass down the chain can break.
- **Composition** models a **"HAS-A"** relationship. A `RaceBike` *has an* `Engine`, *has a* `Suspension`, and *has a* `Gearbox`. Instead of inheriting behavior, a class delegates tasks to composed objects.

```
Inheritance (Tight Coupling):
[ RaceBike ] <|--- [ QualifyingBike ] <|--- [ SuperQualifyingBike ]

Composition (Loose Coupling):
[ MotoGPBike ]
   |---> HAS-A: [ Engine ]
   |---> HAS-A: [ Suspension ]
   |---> HAS-A: [ PitStopStrategy ]
```

#### Why Favor Composition Over Inheritance?
1. **Loose Coupling**: Composed objects can be swapped or modified easily without affecting the host class.
2. **Dynamic Behavior**: Composed objects can be swapped out **at runtime** (e.g., swapping a dry-weather pit strategy for a wet-weather one).
3. **Better Testability**: You can inject mock objects representing components during unit testing.

---

## 2. MotoGP Blueprint (Code Example)

Here we design a flexible composed `MotoGPBike` that uses different engine components and a polymorphic `PitStopStrategy` interface.

```python
from abc import ABC, abstractmethod
from typing import List

# --- 1. Polymorphism: Abstract Base Class for Pit Strategies ---
class PitStopStrategy(ABC):
    @abstractmethod
    def execute_strategy(self, team_name: str, laps_remaining: int) -> str:
        """Calculate and return action command for pit stop crew."""
        pass


class AggressiveDryStrategy(PitStopStrategy):
    def execute_strategy(self, team_name: str, laps_remaining: int) -> str:
        if laps_remaining > 5:
            return f"[{team_name}] Strategy: Pit-in now. Swap to Soft tyres for aggressive qualifying-pace sprint."
        return f"[{team_name}] Strategy: Stay out. Push tyres to maximum wear limit."


class WetWeatherStrategy(PitStopStrategy):
    def execute_strategy(self, team_name: str, laps_remaining: int) -> str:
        return f"[{team_name}] Strategy: Pit-in immediately. Swap to Wet tyres and adjust engine map to Wet-Traction."


# --- 2. Composition: Modular Bike Components ---
class Engine:
    def __init__(self, cylinder_count: int, displacement_cc: int) -> None:
        self.cylinder_count: int = cylinder_count
        self.displacement_cc: int = displacement_cc
        self.status: str = "Idle"

    def start(self) -> None:
        self.status = "Running"

    def get_specs(self) -> str:
        return f"V{self.cylinder_count} {self.displacement_cc}cc Engine"


class Suspension:
    def __init__(self, brand: str, stiffness: float) -> None:
        self.brand: str = brand
        self.stiffness: float = stiffness  # Scale of 1.0 to 10.0

    def adjust_stiffness(self, value: float) -> None:
        self.stiffness = value

    def get_specs(self) -> str:
        return f"{self.brand} Suspension [Stiffness: {self.stiffness}]"


class MotoGPBike:
    """
    Built using COMPOSITION.
    Instead of inheriting from parts, it HAS-A engine and suspension.
    """
    def __init__(self, model_name: str, engine: Engine, suspension: Suspension) -> None:
        self.model_name: str = model_name
        # Composing the object using parts injected at instantiation
        self.engine: Engine = engine
        self.suspension: Suspension = suspension

    def start_bike(self) -> None:
        self.engine.start()
        print(f"{self.model_name} roared to life! Engine status: {self.engine.status}")

    def get_bike_configuration(self) -> str:
        return (
            f"Bike Model: {self.model_name}\n"
            f" - Engine: {self.engine.get_specs()}\n"
            f" - Suspension: {self.suspension.get_specs()}"
        )


# --- 3. Duck Typing Demo (Implicit Polymorphism) ---
class ExternalWeatherService:
    """Uses a different hierarchy but conforms to the weather signature."""
    def check_weather(self) -> str:
        return "Rainy"


class OfficialRaceControl:
    """Another independent class conforming to the weather signature."""
    def check_weather(self) -> str:
        return "Dry"


def analyze_race_conditions(weather_source) -> str:
    """
    Demonstrates Duck Typing.
    This function accepts any object that has a check_weather method.
    """
    weather = weather_source.check_weather()
    if weather == "Rainy":
        return "Flag-to-Flag race declared! Prepare wet setups."
    return "Standard race conditions."


# --- Live Sandbox Execution ---
if __name__ == "__main__":
    print("=== ABC & POLYMORPHISM ===")
    strategies: List[PitStopStrategy] = [
        AggressiveDryStrategy(),
        WetWeatherStrategy()
    ]
    
    # Polymorphic execution: Same interface, different actions
    for strat in strategies:
        print(strat.execute_strategy("Ducati Lenovo", laps_remaining=8))

    print("\n=== COMPOSITION ===")
    # Create parts
    v4_engine = Engine(cylinder_count=4, displacement_cc=1000)
    ohlins_forks = Suspension(brand="Ohlins", stiffness=7.5)
    
    # Inject components to construct the bike
    gp24 = MotoGPBike("Ducati Desmosedici GP24", v4_engine, ohlins_forks)
    gp24.start_bike()
    print(gp24.get_bike_configuration())

    print("\n=== DUCK TYPING ===")
    aws_weather = ExternalWeatherService()
    fim_control = OfficialRaceControl()
    
    print(analyze_race_conditions(aws_weather))
    print(analyze_race_conditions(fim_control))
```

---

## 3. Recommended Tools Spotlight

1. **`typing.Protocol` (Structural Subtyping / Static Duck Typing)**:
   - Python 3.8+ introduced `Protocol`. This lets you define interface requirements for tools like `mypy` without forcing inheritance.
   - Example:
     ```python
     from typing import Protocol

     class WeatherProvider(Protocol):
         def check_weather(self) -> str: ...
     ```
   - Running `mypy` will verify that arguments passed to `analyze_race_conditions` conform to the `WeatherProvider` protocol, offering static duck typing support.
2. **Metaclass Inspection**: Inspect the `__abstractmethods__` attribute of a class programmatically to see what is locking instantiation.

---

## 4. Pit-Lane Challenge (Exercise)

### Background
To support offline track testing and live telemetry broadcasting, the bike's logging module needs to change its destination target (local NVMe SSD vs Cloud storage stream) dynamically.

### Specifications
1. Write an Abstract Base Class named `TelemetryLogger` with:
   - An abstract method `log_data(self, system: str, reading: float) -> str`.
2. Implement two concrete subclasses of `TelemetryLogger`:
   - `LocalFileLogger`: returns `"[FILE LOG] System: <system> | Value: <reading> -> Written to local NVMe SSD."`
   - `CloudLogger`: returns `"[CLOUD UPLOAD] System: <system> | Value: <reading> -> Sent to AWS Kinesis Stream."`
3. Write a class named `BikeTelemetryAggregator` that utilizes **Composition**:
   - `__init__(self, logger: TelemetryLogger)`: Receives and stores a `TelemetryLogger` instance.
   - `change_logger(self, new_logger: TelemetryLogger) -> None`: Allows swapping the logger component at runtime.
   - `record_reading(self, system: str, reading: float) -> None`: Calls the polymorphic `log_data` method on its composed logger and prints the resulting string.

---

## 5. Telemetry Readout (Answer Key)

Below is the solution to the Pit-Lane Challenge.

<details>
<summary>Click to reveal solution</summary>

```python
from abc import ABC, abstractmethod

class TelemetryLogger(ABC):
    @abstractmethod
    def log_data(self, system: str, reading: float) -> str:
        """Log the telemetry data point."""
        pass


class LocalFileLogger(TelemetryLogger):
    def log_data(self, system: str, reading: float) -> str:
        return f"[FILE LOG] System: {system} | Value: {reading} -> Written to local NVMe SSD."


class CloudLogger(TelemetryLogger):
    def log_data(self, system: str, reading: float) -> str:
        return f"[CLOUD UPLOAD] System: {system} | Value: {reading} -> Sent to AWS Kinesis Stream."


class BikeTelemetryAggregator:
    def __init__(self, logger: TelemetryLogger) -> None:
        # Composition: Aggregator is composed with a logger (Dependency Injection)
        self.logger: TelemetryLogger = logger

    def change_logger(self, new_logger: TelemetryLogger) -> None:
        """Dynamic component swapping at runtime."""
        self.logger = new_logger

    def record_reading(self, system: str, reading: float) -> None:
        # Call the polymorphic method on the composed logger
        log_result = self.logger.log_data(system, reading)
        print(log_result)


# --- Exercise Verification Run ---
if __name__ == "__main__":
    local_log = LocalFileLogger()
    cloud_log = CloudLogger()

    # Start with local file logging
    aggregator = BikeTelemetryAggregator(local_log)
    print("--- Session Start (Offline practice) ---")
    aggregator.record_reading("EngineRPM", 16500.0)
    aggregator.record_reading("TireTempRear", 95.4)

    # Swap to Cloud logging once network goes live
    print("\n--- Network Connection Established ---")
    aggregator.change_logger(cloud_log)
    aggregator.record_reading("EngineRPM", 16800.0)
    aggregator.record_reading("GPSLatitude", 44.4173)
```

</details>

---

# Module 4: Advanced OOP & Magic Methods

Welcome to **Module 4**. In this module, we transition from standard object design to advanced Pythonic mechanics. We will dive deep into Python's magic (dunder) methods to overload operators, analyze memory management and the underlying object lifecycle, and build custom iterators and context managers for streaming data.

---

## 1. Theoretical Deep Dive

### Operator Overloading: Customizing Built-in Syntaxes
In Python, you can control how custom objects respond to mathematical operators, comparisons, and representation. Python maps syntax triggers (like `+` or `<`) to internal magic methods:
- **Comparisons**: `__eq__` (==), `__lt__` (<), `__le__` (<=), etc.
- **Arithmetic**: `__add__` (+), `__sub__` (-), `__mul__` (*), etc.
- **Size/Length**: `__len__` (called via `len()`).
- **Coercion**: `__str__` (readable representation) and `__repr__` (unambiguous developer representation).

#### Cooperative Comparisons via `@total_ordering`
Implementing all six comparison dunder methods is tedious. The `functools` module provides the `@total_ordering` class decorator.
- If you define `__eq__` and *one* other comparison method (like `__lt__`), `@total_ordering` automatically generates the remaining four comparison methods (`__gt__`, `__le__`, `__ge__`, `__ne__`) for you, preventing code redundancy.

---

### Memory Management & the Object Lifecycle
Python objects go through three stages: Allocation, Initialization, and Destruction.

#### 1. Allocation: `__new__`
`__new__(cls, *args, **kwargs)` is a static method responsible for allocating memory and returning a raw instance of the class. It is the actual constructor.

#### 2. Initialization: `__init__`
`__init__(self, *args, **kwargs)` is an initializer. It receives the allocated instance from `__new__` and configures its attributes.

#### 3. Destruction: `__del__`
`__del__(self)` is the destructor. It is called when the object's reference count drops to 0 (garbage collection). 
- *Caution:* `__del__` is not guaranteed to execute immediately or at all in some interpreter shutdown scenarios, or if circular references keep the reference count above 0. It should not be used for critical resource cleanup (use context managers instead).

---

### Custom Iterators
To loop over an custom object, it must conform to the Iterator Protocol.
- **Iterable**: An object that returns an iterator when `iter(obj)` is called. It must implement `__iter__(self)`.
- **Iterator**: An object that returns its elements one by one when `next(iterator)` is called. It must implement `__next__(self)` and raise `StopIteration` when there are no more elements. It must also implement `__iter__(self)` returning `self`.

---

### Context Managers (`__enter__` and `__exit__`)
Context managers manage external resources, ensuring setup and teardown run reliably, even if exceptions occur. Used with the `with` statement:
1. `__enter__(self)`: Runs setup logic. The return value of this method is bound to the variable after the `as` keyword.
2. `__exit__(self, exc_type, exc_val, exc_tb)`: Runs cleanup logic.
   - If an exception occurs inside the `with` block, Python passes the exception class (`exc_type`), instance (`exc_val`), and traceback (`exc_tb`) to this method.
   - If `__exit__` returns `True`, the exception is suppressed. If it returns `False` or `None`, the exception propagates.

---

## 2. MotoGP Blueprint (Code Example)

Here we simulate a live telemetry connection stream (using iterator and context manager protocols) and implement operator overloading for comparing lap time instances.

```python
from typing import List, Optional
import time
from functools import total_ordering

# --- 1. Operator Overloading & Total Ordering ---
@total_ordering
class LapTime:
    def __init__(self, rider: str, lap_number: int, time_seconds: float) -> None:
        self.rider: str = rider
        self.lap_number: int = lap_number
        self.time_seconds: float = time_seconds

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, LapTime):
            return NotImplemented
        return self.time_seconds == other.time_seconds

    def __lt__(self, other: object) -> bool:
        if not isinstance(other, LapTime):
            return NotImplemented
        # Faster lap time means fewer seconds
        return self.time_seconds < other.time_seconds

    def __add__(self, other: object) -> "LapTime":
        """Combines two lap times to show total cumulative duration."""
        if not isinstance(other, LapTime):
            return NotImplemented
        return LapTime(
            rider=f"Combined ({self.rider} & {other.rider})",
            lap_number=0,
            time_seconds=self.time_seconds + other.time_seconds
        )

    def __str__(self) -> str:
        minutes = int(self.time_seconds // 60)
        seconds = self.time_seconds % 60
        return f"{self.rider} Lap {self.lap_number}: {minutes}:{seconds:06.3f}"

    def __repr__(self) -> str:
        return f"LapTime(rider={self.rider!r}, lap_number={self.lap_number!r}, time_seconds={self.time_seconds!r})"


# --- 2. Custom Iterators, Lifecycle, and Context Managers ---
class TelemetryPacket:
    def __new__(cls, *args, **kwargs):
        # Override __new__ (runs before __init__)
        instance = super().__new__(cls)
        # Allocates raw memory
        return instance

    def __init__(self, index: int, rpm: float, speed: float) -> None:
        self.index: int = index
        self.rpm: float = rpm
        self.speed: float = speed

    def __del__(self) -> None:
        # Runs when references drop to 0
        pass


class LiveTelemetryStream:
    """
    A class that acts as both a Context Manager and an Iterator.
    It manages the connection state of the telemetry stream and yields packets.
    """
    def __init__(self, bike_id: str, sample_count: int) -> None:
        self.bike_id: str = bike_id
        self.sample_count: int = sample_count
        self.current_sample: int = 0
        self.is_connected: bool = False

    # Context Manager Protocol
    def __enter__(self) -> "LiveTelemetryStream":
        self.is_connected = True
        print(f"[Stream] Connected to {self.bike_id} ECU telemetry stream.")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> Optional[bool]:
        self.is_connected = False
        print(f"[Stream] Disconnected from {self.bike_id} ECU telemetry stream.")
        if exc_type:
            print(f"[Stream] Stream aborted due to error: {exc_val}")
            return False  # Propagate exception
        return True

    # Iterator Protocol
    def __iter__(self) -> "LiveTelemetryStream":
        return self

    def __next__(self) -> TelemetryPacket:
        if not self.is_connected:
            raise RuntimeError("Cannot fetch telemetry: Stream connection closed.")
        
        if self.current_sample >= self.sample_count:
            raise StopIteration
        
        self.current_sample += 1
        # Generate simulated engine metrics
        simulated_rpm = 15000.0 + (self.current_sample * 200.0)
        simulated_speed = 280.0 + (self.current_sample * 5.5)
        
        return TelemetryPacket(self.current_sample, simulated_rpm, simulated_speed)


# --- Live Sandbox Execution ---
if __name__ == "__main__":
    print("=== OPERATOR OVERLOADING ===")
    pecco_lap1 = LapTime("Francesco Bagnaia", 1, 92.450)  # 1m 32.450s
    pecco_lap2 = LapTime("Francesco Bagnaia", 2, 91.980)  # 1m 31.980s
    marquez_lap1 = LapTime("Marc Marquez", 1, 91.980)      # Same time as Pecco's lap 2

    print(pecco_lap1)
    print(pecco_lap2)
    
    # Comparisons made possible by @total_ordering and dunder methods
    print(f"Is Pecco's Lap 2 faster than Lap 1? {pecco_lap2 < pecco_lap1}")
    print(f"Is Marquez's Lap 1 equal to Pecco's Lap 2? {marquez_lap1 == pecco_lap2}")
    print(f"Is Pecco's Lap 1 slower than or equal to Marquez's Lap 1? {pecco_lap1 >= marquez_lap1}")
    
    # Arithmetic Addition
    combined = pecco_lap1 + pecco_lap2
    print(f"Combined time: {combined}")

    print("\n=== CONTEXT MANAGER & ITERATOR DEMO ===")
    # Using the context manager to guarantee connection setup and cleanup
    with LiveTelemetryStream("DUC-93", sample_count=3) as stream:
        # Loop over the stream as an iterator
        for packet in stream:
            print(f"Packet #{packet.index} | Engine Speed: {packet.rpm:.0f} RPM | Speed: {packet.speed:.1f} km/h")
            
    print("\n=== VERIFYING CLEANUP ===")
    print(f"Is stream still connected? {stream.is_connected}")
```

---

## 3. Recommended Tools Spotlight

1. **`contextlib` Module**:
   - The standard library provides `@contextmanager` to write generator-based context managers, reducing boilerplate for simple tasks.
2. **`sys.getrefcount()`**:
   - Use `sys.getrefcount(obj)` to inspect the current number of references to an object in memory, helping to identify reference leaks before `__del__` triggers.
3. **`pytest.raises` for Iterators**:
   - Write tests to assert that iterators raise `StopIteration` once exhausted using `pytest.raises(StopIteration)`.

---

## 4. Pit-Lane Challenge (Exercise)

### Background
During race weekend analysis, telemetry engineers need to record a block of tyre temperature telemetry points into a temporary buffer and perform calculations, before automatically summarizing results. We also want to merge buffers using basic arithmetic.

### Specifications
Write a Python class named `TelemetryBuffer` that acts as a context manager, supports length checking, and implements arithmetic addition:
1. **Methods & Properties**:
   - `__init__(self, name: str)`: Initializes the buffer with a name and an empty list of floats `data_points`.
   - **Context Manager**:
     - `__enter__`: Logs `"[Buffer] Starting recording session for: <name>"` and returns the buffer instance.
     - `__exit__`: Computes and logs a summary when leaving the block: `"[Buffer] Session Ended. Recorded <count> points. Max: <max> | Min: <min> | Avg: <avg>"`. If no data was recorded, prints `"[Buffer] Session Ended. No telemetry points recorded."` (Prevent division-by-zero crashes!).
   - **Operator Overloading**:
     - `__len__`: Returns the number of points in `data_points`.
     - `__str__`: Returns `TelemetryBuffer('<name>'): <count> points | Average: <avg>`.
     - `__add__`: Adding two `TelemetryBuffer` instances returns a **new** `TelemetryBuffer` with the combined list of `data_points` and a merged name: `"Combined (<name1> & <name2>)"`.

---

## 5. Telemetry Readout (Answer Key)

Below is the solution to the Pit-Lane Challenge.

<details>
<summary>Click to reveal solution</summary>

```python
from typing import List, Optional

class TelemetryBuffer:
    def __init__(self, name: str, data_points: Optional[List[float]] = None) -> None:
        self.name: str = name
        self.data_points: List[float] = data_points if data_points is not None else []

    # --- Context Manager Protocol ---
    def __enter__(self) -> "TelemetryBuffer":
        print(f"[Buffer] Starting recording session for: {self.name}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        total_points = len(self.data_points)
        if total_points > 0:
            max_val = max(self.data_points)
            min_val = min(self.data_points)
            avg_val = sum(self.data_points) / total_points
            print(f"[Buffer] Session Ended. Recorded {total_points} points. Max: {max_val:.2f} | Min: {min_val:.2f} | Avg: {avg_val:.2f}")
        else:
            print("[Buffer] Session Ended. No telemetry points recorded.")

    # --- Operator Overloading ---
    def __len__(self) -> int:
        return len(self.data_points)

    def __str__(self) -> str:
        avg = sum(self.data_points) / len(self.data_points) if self.data_points else 0.0
        return f"TelemetryBuffer({self.name!r}): {len(self)} points | Average: {avg:.2f}"

    def __repr__(self) -> str:
        return f"TelemetryBuffer(name={self.name!r}, data_points={self.data_points!r})"

    def __add__(self, other: "TelemetryBuffer") -> "TelemetryBuffer":
        if not isinstance(other, TelemetryBuffer):
            return NotImplemented
        # Create a new combined buffer
        combined_name = f"Combined ({self.name} & {other.name})"
        combined_points = self.data_points + other.data_points
        return TelemetryBuffer(name=combined_name, data_points=combined_points)


# --- Exercise Verification Run ---
if __name__ == "__main__":
    # Test context manager session 1
    session1 = TelemetryBuffer("TireTempRear")
    with session1 as buf1:
        buf1.data_points.extend([85.0, 92.5, 98.4, 101.2])
    
    # Test context manager session 2
    session2 = TelemetryBuffer("TireTempFront")
    with session2 as buf2:
        buf2.data_points.extend([80.2, 85.5, 89.0])

    print("\n--- Individual Buffers ---")
    print(session1)
    print(session2)

    # Overloaded add test
    print("\n--- Combining Buffers via + Operator ---")
    combined_buffer = session1 + session2
    print(combined_buffer)
    print(f"Total Combined Points Count: {len(combined_buffer)}")
```

</details>

---

# Module 5: Modern Pythonic OOP & Patterns

Welcome to **Module 5**. In this final module, we focus on writing optimized, modern Python code and implementing standard creational, structural, and behavioral design patterns in clean Pythonic ways. We will learn how to reduce memory footprint using dataclasses and slots, and how to structure global singletons, component factories, and real-time observers.

---

## 1. Theoretical Deep Dive

### Modern Pythonic OOP: `@dataclass` & `__slots__`

#### 1. Data Classes (`@dataclass`)
Introduced in Python 3.7 via the `dataclasses` module, the `@dataclass` decorator automatically generates common boilerplate methods for classes that exist primarily to store state.
- **Auto-generated boilerplate**: Methods like `__init__()`, `__repr__()`, `__eq__()`, and `__ne__()` are automatically generated for you based on the type-hinted fields defined in the class body.
- This reduces code size and improves maintainability.

#### 2. Memory Optimization with `__slots__`
By default, Python storing instance variables in a local dictionary (`__dict__`) to allow attributes to be added or modified dynamically at runtime. However, dictionaries consume substantial memory overhead because they use hash tables.
- **The Solution:** Declaring `__slots__` inside a class tells Python to allocate a fixed sequence of memory slots for attributes, and explicitly **disables** the creation of `__dict__` and `__weakref__` namespaces for instances.
- **Benefits:**
  - **Memory Reduction**: Saves up to 50-70% of RAM per instance, which is crucial when handling millions of real-time telemetry packets.
  - **Faster Attribute Access**: Retrieving values is slightly faster since Python bypasses dictionary lookups.
  - **Constraint Enforcement**: Prevents typos by disallowing the addition of arbitrary dynamic attributes outside the predefined slot list.

---

### Design Patterns in Python

#### 1. Creational Patterns: Singleton
The Singleton pattern restricts class instantiation to exactly one global instance. This is useful for central coordinators, like a global race control dashboard.
- **Pythonic Implementation:** We override `__new__` to control the allocation. Before allocating memory, we check if an `_instance` reference already exists on the class object. If it does, we bypass allocation and return the existing instance.

#### 2. Creational Patterns: Factory Method
The Factory pattern provides an interface or utility to instantiate objects without specifying their exact concrete class types beforehand.
- **Pythonic Implementation:** Rather than using complex class structures, factories in Python are often implemented as clean `@staticmethods` or class methods that check strings/enums and return the appropriate instance.

#### 3. Behavioral Patterns: Observer Pattern
The Observer pattern establishes a one-to-many relationship where a single subject maintains a roster of subscribers and automatically notifies them of status updates or alerts.
- **Pythonic Implementation:** A Subject class implements methods to `register()`, `deregister()`, and `notify()` observers. Concrete observer classes implement a common callback method (like `update()`).

---

## 2. MotoGP Blueprint (Code Example)

Here we combine `@dataclass` with `__slots__` for lightweight packet streaming, build a global `RaceControl` Singleton, a `BikeFactory` for setting up session configurations, and an Observer system to notify pit crews of tyre wear flags.

```python
from dataclasses import dataclass
from typing import List, Dict, Any

# --- 1. Dataclasses & Slots for Memory Optimization ---
@dataclass
class TelemetryReading:
    # Overriding __dict__ with __slots__ saves memory
    __slots__ = ("timestamp", "coolant_temp", "tire_pressure_psi")
    timestamp: float
    coolant_temp: float
    tire_pressure_psi: float


# --- 2. Creational Patterns: Singleton (Global RaceControl) ---
class RaceControl:
    _instance = None  # Class variable storing the single instance

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            # Create instance using super() if it does not exist
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, track_name: str = "Jerez") -> None:
        if self._initialized:
            return  # Prevent initialization overwrite
        self.track_name: str = track_name
        self.flag_status: str = "GREEN"  # Global track condition
        self._initialized = True

    def update_flag(self, new_flag: str) -> None:
        self.flag_status = new_flag
        print(f"[RaceControl] Track status updated to: {new_flag}")


# --- 3. Creational Patterns: Factory Pattern (BikeFactory) ---
class Bike:
    def __init__(self, model_name: str, config: str) -> None:
        self.model_name = model_name
        self.config = config

    def __repr__(self) -> str:
        return f"Bike(model_name={self.model_name!r}, config={self.config!r})"


class QualifyingBike(Bike):
    pass


class RaceDayBike(Bike):
    pass


class BikeFactory:
    @staticmethod
    def create_bike(session_type: str, model_name: str) -> Bike:
        """Factory Method to create bike setups based on session type."""
        if session_type.upper() == "QUALIFYING":
            return QualifyingBike(model_name, "Ultra-Soft Tyres & Max engine mapping")
        elif session_type.upper() == "RACE":
            return RaceDayBike(model_name, "Medium Tyres & Conservation engine mapping")
        else:
            raise ValueError(f"Unknown session type: {session_type}")


# --- 4. Behavioral Patterns: Observer Pattern ---
class Subject(list):
    """Subject class maintaining subscribers."""
    def register(self, subscriber: "Observer") -> None:
        self.append(subscriber)

    def deregister(self, subscriber: "Observer") -> None:
        self.remove(subscriber)

    def notify(self, message: Dict[str, Any]) -> None:
        for subscriber in self:
            subscriber.update(message)


class Observer:
    def update(self, message: Dict[str, Any]) -> None:
        pass


class TyreMonitor(Subject):
    def __init__(self, sensor_id: str) -> None:
        super().__init__()
        self.sensor_id = sensor_id
        self.degradation: float = 0.0

    def record_degradation(self, wear: float) -> None:
        self.degradation = wear
        if self.degradation >= 80.0:
            # Trigger alert notifications to observers
            self.notify({
                "sensor_id": self.sensor_id,
                "event": "CRITICAL_WEAR",
                "degradation": self.degradation
            })


class PitCrewTeam(Observer):
    def __init__(self, team_name: str) -> None:
        self.team_name = team_name

    def update(self, message: Dict[str, Any]) -> None:
        print(f"[Pit Crew {self.team_name}] RECEIVED ALERT: {message['sensor_id']} has critical wear ({message['degradation']}%). Preparing replacement tyre!")


class TelemetryDashboard(Observer):
    def update(self, message: Dict[str, Any]) -> None:
        print(f"[Dashboard UI] Rendering Warning Banner: {message['sensor_id']} wear critical!")


# --- Live Sandbox Execution ---
if __name__ == "__main__":
    print("=== SINGLETON RACE CONTROL ===")
    rc1 = RaceControl("Mugello")
    rc2 = RaceControl("Silverstone")  # Returns rc1 instance, retains "Mugello" initialization
    
    print(f"rc1 Track: {rc1.track_name} | Flag: {rc1.flag_status}")
    print(f"rc2 Track: {rc2.track_name} | Flag: {rc2.flag_status}")
    print(f"Are they the same instance? {rc1 is rc2}")
    
    rc1.update_flag("RED")
    print(f"rc2 Flag after update: {rc2.flag_status}")

    print("\n=== BIKE FACTORY ===")
    qualifying_gp = BikeFactory.create_bike("qualifying", "Yamaha M1")
    raceday_gp = BikeFactory.create_bike("race", "Yamaha M1")
    print(qualifying_gp)
    print(raceday_gp)

    print("\n=== OBSERVER PATTERN (TYRE DEGRADATION MONITOR) ===")
    rear_tyre_monitor = TyreMonitor("REAR_TYRE_01")
    
    crew_a = PitCrewTeam("Ducati Crew A")
    dashboard = TelemetryDashboard()
    
    # Register subscribers
    rear_tyre_monitor.register(crew_a)
    rear_tyre_monitor.register(dashboard)
    
    # Record normal wear (no notification)
    print("Recording normal wear:")
    rear_tyre_monitor.record_degradation(45.0)
    
    # Record critical wear (subscribers get notified)
    print("\nRecording critical wear:")
    rear_tyre_monitor.record_degradation(82.5)
```

---

## 3. Recommended Tools Spotlight

1. **`pympler` or `sys.getsizeof()` (Memory Profilers)**:
   - Use `sys.getsizeof()` to evaluate how much RAM is saved when applying slots vs standard dictionary structures.
2. **`dataclasses.asdict()`**:
   - Easily serialize dataclass objects to dictionaries for API payloads or JSON files using `dataclasses.asdict(instance)`.
3. **Observer Testing with Mocks**:
   - In unit testing, replace concrete observers with mock objects (from `unittest.mock`) to assert that the subject's `notify` method triggers correct subscriber calls.

---

## 4. Pit-Lane Challenge (Exercise)

### Background
To optimize processing in the team's data analytics cluster, we want to represent incoming engine engine telemetry values in a memory-optimized slots structure using a dataclass. Furthermore, we must raise alarms across the team's console dashboards when temperatures exceed thresholds.

### Specifications
Write a solution implementing the Observer pattern integrated with a slots-based dataclass:
1. **`EngineTelemetryPacket` (Dataclass)**:
   - Must use `__slots__`.
   - Fields: `rpm` (float), `coolant_temp` (float), and `throttle_pos` (float).
2. **`TelemetryObserver` (Observer Interface)**:
   - Abstract method `update(self, packet: EngineTelemetryPacket)`.
3. **`EngineDiagnosticSystem` (Subject)**:
   - Maintains a roster of observers.
   - Has a method `process_packet(self, packet: EngineTelemetryPacket)`. If `coolant_temp` exceeds `105.0`°C, notify all observers.
4. **`PitGarageConsole` (Concrete Observer)**:
   - Holds an identifier `crew_member` (string).
   - Prints: `"[Console Alert -> <crew_member>] CRITICAL ENGINE OVERHEAT! Temp: <temp>C | RPM: <rpm>"` when notified.

---

## 5. Telemetry Readout (Answer Key)

Below is the solution to the Pit-Lane Challenge.

<details>
<summary>Click to reveal solution</summary>

```python
from dataclasses import dataclass
from typing import List

# 1. Create a slots-based dataclass for Telemetry
@dataclass
class EngineTelemetryPacket:
    __slots__ = ("rpm", "coolant_temp", "throttle_pos")
    rpm: float
    coolant_temp: float
    throttle_pos: float  # Percentage 0.0 - 100.0


# 2. Observer Interface
class TelemetryObserver:
    def update(self, packet: EngineTelemetryPacket) -> None:
        pass


# 3. Subject Class
class EngineDiagnosticSystem:
    def __init__(self) -> None:
        self._observers: List[TelemetryObserver] = []

    def register_observer(self, obs: TelemetryObserver) -> None:
        self._observers.append(obs)

    def process_packet(self, packet: EngineTelemetryPacket) -> None:
        # Check critical condition: temp > 105.0 C
        if packet.coolant_temp > 105.0:
            self._notify_all(packet)

    def _notify_all(self, packet: EngineTelemetryPacket) -> None:
        for obs in self._observers:
            obs.update(packet)


# 4. Concrete Observer
class PitGarageConsole(TelemetryObserver):
    def __init__(self, crew_member: str) -> None:
        self.crew_member = crew_member

    def update(self, packet: EngineTelemetryPacket) -> None:
        print(f"[Console Alert -> {self.crew_member}] CRITICAL ENGINE OVERHEAT! Temp: {packet.coolant_temp}°C | RPM: {packet.rpm:.0f}")


# --- Exercise Verification Run ---
if __name__ == "__main__":
    diag_system = EngineDiagnosticSystem()
    console1 = PitGarageConsole("Chief Mechanic")
    console2 = PitGarageConsole("Engine Engineer")

    diag_system.register_observer(console1)
    diag_system.register_observer(console2)

    # Simulated stream of packets
    packet_ok = EngineTelemetryPacket(rpm=14500.0, coolant_temp=98.5, throttle_pos=85.0)
    packet_hot = EngineTelemetryPacket(rpm=17200.0, coolant_temp=108.2, throttle_pos=100.0)

    print("Processing safe telemetry packet...")
    diag_system.process_packet(packet_ok)  # No output expected

    print("\nProcessing overheat telemetry packet...")
    diag_system.process_packet(packet_hot)  # Both consoles should alert
```

</details>




