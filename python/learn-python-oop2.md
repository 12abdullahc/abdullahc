# Module 1: Basics - Classes and Objects

Welcome to your journey to master Object-Oriented Programming (OOP) in Python! We will explore these concepts using the fast-paced, high-tech world of **MotoGP Racing**.

---

## 1. Concept Explanation

At its core, **Object-Oriented Programming (OOP)** is a programming paradigm that organizes code around "objects" rather than actions, and "data" rather than logic. 

To understand OOP, you must understand its two fundamental building blocks:
*   **Class (The Blueprint):** A class is a template or schema. It defines what data an object will hold and what behaviors it can perform. It doesn't represent a specific physical thing, but rather the *description* of that thing.
*   **Object or Instance (The Real Thing):** An object is an actual, concrete instance created from the class blueprint. It has real data values assigned to it and occupies space in your computer's memory.

### Attributes and Methods
Within a class, we define two main things:
1.  **Attributes (State/Data):** These are variables stored inside an object. They represent the characteristics or properties of the object.
2.  **Methods (Behavior/Actions):** These are functions defined inside a class that operate on the object's attributes. They represent what the object can *do* or what can be *done* to it.

### Python Syntax: `__init__` and `self`
In Python, we define a class using the `class` keyword.
*   **`__init__(self, ...)` (Constructor):** This is a special method called automatically when you create a new object. Its job is to initialize the starting attributes of the object.
*   **`self`:** This parameter represents the specific instance of the class you are currently creating or operating on. It allows you to bind attributes and call methods on the specific object.

---

## 2. MotoGP Case Study

Let's translate this directly to the MotoGP paddock:

*   **The Class (Blueprint):** Imagine the engineering blueprint for a **Ducati Desmosedici GP** race bike. The blueprint details that every bike of this design must have a rider's name, an engine displacement (cc), a current gear, and a speed tracker.
*   **The Object (Instance):** The actual, physical red motorcycle with number **#63** that Francesco Bagnaia rides onto the track at Mugello is an **object** (an instance of the Ducati GP class). Another physical motorcycle with number **#89** ridden by Jorge Martín is a *separate* object created from the same class blueprint.
*   **Attributes:** 
    *   `rider_name` = `"Francesco Bagnaia"`
    *   `engine_cc` = `1000`
    *   `current_speed` = `354.6` (in km/h)
    *   `gear` = `6`
*   **Methods:** 
    *   `accelerate()`: Increases the `current_speed`.
    *   `shift_up()`: Increments the `gear`.
    *   `pit_stop()`: Resets the speed to `0` and changes tires.

---

## 3. Production-Ready Code Example

Below is a clean, type-hinted, and commented Python script showing how to define and use a `MotoGPBike` class.

```python
class MotoGPBike:
    """Represents a high-performance MotoGP motorcycle."""

    def __init__(self, rider: str, team: str, engine_cc: int = 1000) -> None:
        """Initializes a new MotoGP motorcycle instance.

        Args:
            rider: The name of the rider pilot.
            team: The racing team.
            engine_cc: The engine displacement in cubic centimeters (default: 1000).
        """
        # Attributes (State)
        self.rider: str = rider
        self.team: str = team
        self.engine_cc: int = engine_cc
        self.current_speed: float = 0.0  # Speed in km/h
        self.gear: int = 1               # Current gear (1 to 6)

    def accelerate(self, speed_increase: float) -> None:
        """Simulates accelerating the motorcycle by increasing its speed.

        Args:
            speed_increase: The amount of speed to add in km/h.
        """
        self.current_speed += speed_increase
        print(f"[{self.rider}] accelerates! Current speed: {self.current_speed:.1f} km/h.")

    def shift_gear(self, target_gear: int) -> None:
        """Changes the transmission gear of the bike.

        Args:
            target_gear: The target gear (1 to 6).
        """
        if 1 <= target_gear <= 6:
            self.gear = target_gear
            print(f"[{self.rider}] shifted to gear {self.gear}.")
        else:
            print(f"Invalid gear change: Gear {target_gear} is out of bounds for a MotoGP transmission.")

    def get_telemetry(self) -> str:
        """Returns a string representation of the bike's current telemetry data."""
        return f"Telemetry -> Rider: {self.rider} | Gear: {self.gear} | Speed: {self.current_speed:.1f} km/h"


# --- Demonstration of instantiation and behavior ---
if __name__ == "__main__":
    # Instantiating two distinct objects from the MotoGPBike blueprint
    pecco_bike = MotoGPBike(rider="Francesco Bagnaia", team="Ducati Lenovo Team")
    martin_bike = MotoGPBike(rider="Jorge Martín", team="Prima Pramac Racing")

    # Accessing attributes
    print(f"Rider 1: {pecco_bike.rider} racing for {pecco_bike.team}")
    print(f"Rider 2: {martin_bike.rider} racing for {martin_bike.team}")

    # Invoking methods to alter state
    pecco_bike.shift_gear(2)
    pecco_bike.accelerate(120.5)
    pecco_bike.shift_gear(3)
    pecco_bike.accelerate(95.0)

    # Let's check telemetry
    print(pecco_bike.get_telemetry())
    print(martin_bike.get_telemetry())
```

### Simpler, Bare-Bones Example

```python
# Defining the blueprint (Class)
class SimpleMotoGPBike:
    def __init__(self, rider, team):
        self.rider = rider  # Attribute (State)
        self.team = team    # Attribute (State)

    def cheer(self):
        # Method (Behavior)
        print(f"Go {self.rider} with {self.team}!")

# Instantiating objects (Instances)
bike1 = SimpleMotoGPBike(rider="Francesco Bagnaia", team="Ducati Lenovo Team")
bike2 = SimpleMotoGPBike(rider="Jorge Martín", team="Prima Pramac Racing")

# Accessing attributes and calling methods
print(bike1.rider)  # Output: Francesco Bagnaia
bike2.cheer()       # Output: Go Jorge Martín with Prima Pramac Racing!
```

---

## 4. Practical Exercise

**Task:** Create a class named `Rider` that represents a MotoGP racer.

### Requirements:
1.  **Attributes:**
    *   `name` (string): The rider's name.
    *   `team` (string): The rider's team name.
    *   `points` (integer): The rider's championship points, starting at `0`.
    *   `is_active` (boolean): Tracks if the rider is currently racing, starting at `True`.
2.  **Methods:**
    *   `finish_race(position: int) -> None`: 
        *   This method should add championship points based on the race finishing position:
            *   1st place: `25` points
            *   2nd place: `20` points
            *   3rd place: `16` points
            *   Any other finish (4th or lower): `0` points
        *   If the rider is not active (`is_active` is `False`), print a message saying they cannot race and do not award points.
    *   `retire() -> None`:
        *   Sets `is_active` to `False` and prints a retirement announcement.

Write your code and run it to verify that passing positions like `1`, `2`, and `3` updates the points correctly, and that retiring the rider prevents further race points.

---

## 5. Exercise Solution

*Try to write the code yourself before checking this solution!*

<details>
<summary>Click here to reveal the solution</summary>

```python
class Rider:
    """Represents a MotoGP rider participating in the championship."""

    def __init__(self, name: str, team: str) -> None:
        """Initializes a new Rider instance.

        Args:
            name: The rider's name.
            team: The racing team.
        """
        self.name: str = name
        self.team: str = team
        self.points: int = 0
        self.is_active: bool = True

    def finish_race(self, position: int) -> None:
        """Updates championship points based on race finishing position.

        Args:
            position: The race finishing position (1-indexed).
        """
        if not self.is_active:
            print(f"Warning: {self.name} has retired and cannot race.")
            return

        points_system = {
            1: 25,
            2: 20,
            3: 16
        }
        
        # Get points awarded, defaulting to 0 for positions 4 and below
        awarded_points = points_system.get(position, 0)
        self.points += awarded_points
        
        if awarded_points > 0:
            print(f"{self.name} finished P{position}! Awarded {awarded_points} points. Total points: {self.points}.")
        else:
            print(f"{self.name} finished P{position}. No points awarded. Total points: {self.points}.")

    def retire(self) -> None:
        """Retires the rider from active racing."""
        self.is_active = False
        print(f"Official Announcement: {self.name} of {self.team} has retired from active MotoGP racing.")


# --- Verification Code ---
if __name__ == "__main__":
    rider = Rider("Marc Márquez", "Gresini Racing")
    
    # Check initial state
    print(f"Rider: {rider.name} | Points: {rider.points} | Active: {rider.is_active}")
    
    # Race finishes
    rider.finish_race(1)  # Expected: +25 points
    rider.finish_race(3)  # Expected: +16 points
    rider.finish_race(5)  # Expected: +0 points (Total should be 41)
    
    # Retire rider
    rider.retire()
    
    # Try to race after retirement
    rider.finish_race(2)  # Expected: Warning, no points added
```

</details>

***

# Module 2: Intermediate - Inheritance

Welcome back to our MotoGP-themed Object-Oriented Programming (OOP) course! In this module, we will explore the first pillar of OOP: **Inheritance**.

---

## 1. Concept Explanation

**Inheritance** is a mechanism that allows you to create a new class (the **derived class** or **child class**) that reuses, extends, and modifies the attributes and methods defined in an existing class (the **base class** or **parent class**).

This represents an **"IS-A" relationship**. For example, a sports car *is a* car; a Ducati GP bike *is a* race bike.

### Why Use Inheritance?
1.  **Code Reuse:** You write common attributes and methods once in the parent class, and all child classes automatically inherit them.
2.  **Specialization:** Child classes can define their own unique properties or modify behavior without affecting the parent class.

### Key Python Syntax
*   **Inheriting:** We specify the parent class in parentheses after the child class name: `class ChildClass(ParentClass):`.
*   **`super()` function:** We use `super()` to refer to the parent class. This is commonly used in the child's `__init__` constructor to invoke the parent's initialization code: `super().__init__(arg1, arg2)`.

---

## 2. MotoGP Case Study

In the MotoGP paddock, every racing machine shares a set of common physical properties and regulations (e.g., must have 2 wheels, a maximum engine capacity of 1000cc, telemetry logging capabilities, and can start its engine).

However, different manufacturers have highly specialized, unique technologies:
*   **`RaceBike` (Parent Class):** Defines generic race bike features: `manufacturer`, `weight_kg`, `engine_cc`, and a `start_engine()` method.
*   **`DucatiGP` (Child Class):** Inherits from `RaceBike`. Adds a unique **Holeshot Device** (a mechanical system to compress suspension for lightning-fast race starts) and a specific method to trigger it: `toggle_holeshot_device()`.
*   **`YamahaM1` (Child Class):** Inherits from `RaceBike`. Adds a specific focus on **cornering speed telemetry** and a custom method to read corner speed sensors.

By using inheritance, we don't have to rewrite the engine initialization, weight, and general speed attributes for every single bike model.

---

## 3. Production-Ready Code Example

Below is a clean, type-hinted, and commented Python script showing inheritance in action.

```python
class RaceBike:
    """The base (parent) class representing a generic MotoGP race bike."""

    def __init__(self, manufacturer: str, weight_kg: float, engine_cc: int = 1000) -> None:
        """Initializes general race bike attributes."""
        self.manufacturer: str = manufacturer
        self.weight_kg: float = weight_kg
        self.engine_cc: int = engine_cc
        self.engine_started: bool = False

    def start_engine(self) -> None:
        """Starts the motorcycle engine."""
        self.engine_started = True
        print(f"The {self.manufacturer} 1000cc engine ROARS to life!")

    def get_details(self) -> str:
        """Returns a string describing the bike's specs."""
        return f"{self.manufacturer} GP Bike | Weight: {self.weight_kg}kg | Displacement: {self.engine_cc}cc"


class DucatiGP(RaceBike):
    """A specialized derived class representing a Ducati MotoGP bike."""

    def __init__(self, rider: str, weight_kg: float = 157.0) -> None:
        """Initializes the Ducati bike with specialized rider and device features.

        Uses super() to invoke the parent class constructor.
        """
        # Call the parent class (RaceBike) constructor
        super().__init__(manufacturer="Ducati", weight_kg=weight_kg)
        self.rider: str = rider
        self.holeshot_device_engaged: bool = False

    def toggle_holeshot_device(self, engage: bool) -> None:
        """Engages or disengages the mechanical ride-height (holeshot) device."""
        self.holeshot_device_engaged = engage
        status = "ENGAGED (Rear suspension compressed for launch)" if engage else "DISENGAGED"
        print(f"[{self.rider}'s Ducati] Holeshot device is now {status}.")

    def launch(self) -> None:
        """Launches the bike at the start line using the holeshot device state."""
        if self.holeshot_device_engaged:
            print(f"[{self.rider}'s Ducati] Perfect rocket start! Zero wheelie.")
            self.holeshot_device_engaged = False  # Deactivates automatically after turn 1
        else:
            print(f"[{self.rider}'s Ducati] Standard launch. Front wheel lifted slightly.")


# --- Demonstration ---
if __name__ == "__main__":
    # Instantiate the specialized DucatiGP bike
    pecco_ducati = DucatiGP(rider="Francesco Bagnaia")

    # Access inherited attributes and methods
    print(pecco_ducati.get_details())  # Inherited from RaceBike
    pecco_ducati.start_engine()        # Inherited from RaceBike

    # Access Ducati-specific behaviors
    pecco_ducati.toggle_holeshot_device(True)
    pecco_ducati.launch()
```

---

## 4. Practical Exercise

**Task:** Design a class hierarchy for MotoGP Team Personnel.

### Requirements:
1.  Create a base class called `TeamMember`.
    *   **Attributes:**
        *   `name` (string)
        *   `role` (string)
    *   **Methods:**
        *   `get_info() -> str`: Returns a string formatted as `"Name: [name] | Role: [role]"`.
2.  Create a derived class called `CrewChief` that inherits from `TeamMember`.
    *   **Attributes:** Inherits `name` and `role` from `TeamMember`, and adds `years_experience` (integer).
    *   **Constructor:** Must use `super()` to initialize the parent fields.
    *   **Methods:**
        *   `get_info() -> str`: Override the parent method (or extend it) to also return the years of experience.
        *   `tune_engine() -> None`: Prints a message like `"Crew Chief [Name] is fine-tuning the torque maps and engine braking parameters."`.

Verify your implementation by instantiating a `CrewChief` (e.g., name="Cristian Gabarrini", experience=15), printing their details, and invoking their specialized method.

---

## 5. Exercise Solution

*Try to write the code yourself before checking this solution!*

<details>
<summary>Click here to reveal the solution</summary>

```python
class TeamMember:
    """Base class for any staff member in a MotoGP team."""

    def __init__(self, name: str, role: str) -> None:
        self.name: str = name
        self.role: str = role

    def get_info(self) -> str:
        """Returns general details about the team member."""
        return f"Name: {self.name} | Role: {self.role}"


class CrewChief(TeamMember):
    """Derived class for a Crew Chief, inheriting from TeamMember."""

    def __init__(self, name: str, years_experience: int) -> None:
        """Initializes a Crew Chief by calling the parent constructor."""
        # A Crew Chief's role is always "Crew Chief"
        super().__init__(name=name, role="Crew Chief")
        self.years_experience: int = years_experience

    def get_info(self) -> str:
        """Overrides parent method to append experience info."""
        base_info = super().get_info()
        return f"{base_info} | Experience: {self.years_experience} years"

    def tune_engine(self) -> None:
        """Executes a specialist chief duty."""
        print(f"Crew Chief {self.name} is fine-tuning the torque maps and engine braking parameters.")


# --- Verification Code ---
if __name__ == "__main__":
    chief = CrewChief(name="Cristian Gabarrini", years_experience=15)
    
    # Verify info shows inherited and child attributes
    print(chief.get_info())
    
    # Verify specialized methods work
    chief.tune_engine()
```

</details>

***

# Module 3: Intermediate - Polymorphism

Welcome back! In this module, we will explore the second pillar of OOP: **Polymorphism**.

---

## 1. Concept Explanation

**Polymorphism** comes from Greek words meaning "many shapes". In OOP, it refers to the ability of different classes to respond to the same method call in their own unique way.

Polymorphism allows you to treat objects of different subclasses as if they were objects of the parent class, while still executing their specialized behaviors.

### How it works: Method Overriding
When a child class defines a method with the exact same name and signature as a method in its parent class, it **overrides** the parent's method. When you call that method on a child object, Python runs the child's version of the method, not the parent's.

### Why is this useful?
Imagine you have a list containing different objects (e.g., cars, bikes, trucks). You can loop through them and call `.accelerate()` on all of them. You don't need to know the specific class of each object at runtime; they will all accelerate in their own custom way.

---

## 2. MotoGP Case Study

In modern MotoGP, aerodynamics are a massive point of differentiation. Every bike has fairing components and winglets designed to manage airflow.
*   **The Interface:** Every GP bike must implement a method called `deploy_aero()`.
*   **`DucatiGP` implementation:** Focuses on *ground-effect* downforce, extending lower winglets when leaning into corners to pull the bike toward the asphalt.
*   **`YamahaM1` implementation:** Focuses on *anti-wheelie* downforce, adjusting the nose winglets during high-acceleration straightaways to keep the front wheel on the ground.
*   **The Telemetry Loop:** The race control software can loop through every active bike on track and trigger `.deploy_aero()` without needing to check whether the bike is a Ducati or a Yamaha. Each bike executes its manufacturer-specific aero behavior automatically.

---

## 3. Production-Ready Code Example

Below is a clean, type-hinted, and commented Python script showing polymorphism in action.

```python
class RaceBike:
    """Base class for any MotoGP race bike."""

    def __init__(self, rider: str, team: str) -> None:
        self.rider: str = rider
        self.team: str = team

    def deploy_aero(self) -> str:
        """Generic aerodynamic deployment (to be overridden by subclasses)."""
        return f"[{self.rider}] Standard aerodynamic configuration deployed."


class DucatiGP(RaceBike):
    """Ducati implementation of a GP bike."""

    def __init__(self, rider: str) -> None:
        super().__init__(rider=rider, team="Ducati Lenovo Team")

    def deploy_aero(self) -> str:
        """Overrides parent deploy_aero with Ducati-specific ground-effect logic."""
        return f"[{self.rider}'s Ducati] Ground-effect side panels deployed to suck bike to the asphalt during cornering."


class YamahaM1(RaceBike):
    """Yamaha implementation of a GP bike."""

    def __init__(self, rider: str) -> None:
        super().__init__(rider=rider, team="Monster Energy Yamaha")

    def deploy_aero(self) -> str:
        """Overrides parent deploy_aero with Yamaha-specific anti-wheelie logic."""
        return f"[{self.rider}'s Yamaha] Front fairing winglets adjusted to generate 30kg of downforce, suppressing front-wheel lift."


# --- Demonstration of Polymorphism ---
def activate_track_aero_systems(bikes: list[RaceBike]) -> None:
    """Takes a list of any RaceBike objects and executes deploy_aero on each."""
    print("--- Race Control: Activating Aerodynamic Systems ---")
    for bike in bikes:
        # Polymorphic call: Python dynamically calls the correct method version
        aero_log = bike.deploy_aero()
        print(aero_log)


if __name__ == "__main__":
    # Create a list containing different subclasses of RaceBike
    grid = [
        DucatiGP("Francesco Bagnaia"),
        YamahaM1("Fabio Quartararo"),
        RaceBike("Generic Rider", "Wildcard Team")  # Baseline parent class
    ]

    # Process all of them polymorphically
    activate_track_aero_systems(grid)
```

---

## 4. Practical Exercise

**Task:** Design a telemetry downforce calculator using Polymorphism.

### Requirements:
1.  Create a base class called `AeroWinglet`.
    *   It should have an `__init__(self, surface_area_cm2: float)` constructor.
    *   Create a method `calculate_downforce(self, speed_kmh: float) -> float`.
    *   This base method should return a baseline downforce: `surface_area_cm2 * speed_kmh * 0.001` (in Newtons).
2.  Create a derived class called `FrontWinglet` that inherits from `AeroWinglet`.
    *   Override `calculate_downforce`. It should return a higher coefficient: `surface_area_cm2 * speed_kmh * 0.0025`.
3.  Create a derived class called `SideFairingWinglet` that inherits from `AeroWinglet`.
    *   Override `calculate_downforce`. It should return a moderate coefficient: `surface_area_cm2 * speed_kmh * 0.0015`.
4.  Write a function `display_winglet_telemetry(winglets: list[AeroWinglet], speed: float) -> None` that:
    *   Loops through a list of winglets.
    *   Calls the polymorphic `.calculate_downforce(speed)` method on each.
    *   Prints out the class name of the winglet, its surface area, and the calculated downforce. *(Hint: You can print the class name of an object using `type(obj).__name__`)*.

Verify by running this with a speed of `300.0` km/h.

---

## 5. Exercise Solution

*Try to write the code yourself before checking this solution!*

<details>
<summary>Click here to reveal the solution</summary>

```python
class AeroWinglet:
    """Base class representing aerodynamic winglets on a race bike."""

    def __init__(self, surface_area_cm2: float) -> None:
        self.surface_area_cm2: float = surface_area_cm2

    def calculate_downforce(self, speed_kmh: float) -> float:
        """Returns baseline downforce in Newtons."""
        return self.surface_area_cm2 * speed_kmh * 0.001


class FrontWinglet(AeroWinglet):
    """Front fairing winglet designed to suppress wheelies."""

    def calculate_downforce(self, speed_kmh: float) -> float:
        """Overrides baseline for high downforce efficiency."""
        return self.surface_area_cm2 * speed_kmh * 0.0025


class SideFairingWinglet(AeroWinglet):
    """Side fairing panels designed for cornering stability."""

    def calculate_downforce(self, speed_kmh: float) -> float:
        """Overrides baseline for moderate ground-effect downforce."""
        return self.surface_area_cm2 * speed_kmh * 0.0015


def display_winglet_telemetry(winglets: list[AeroWinglet], speed: float) -> None:
    """Polymorphically calculates and displays downforce telemetry for winglet elements."""
    print(f"\n--- Telemetry Scan at {speed} km/h ---")
    for winglet in winglets:
        name = type(winglet).__name__
        downforce = winglet.calculate_downforce(speed)
        print(f"Winglet Type: {name:<18} | Area: {winglet.surface_area_cm2} cm² | Downforce: {downforce:.2f} N")


# --- Verification Code ---
if __name__ == "__main__":
    telemetry_setup = [
        AeroWinglet(150.0),
        FrontWinglet(150.0),
        SideFairingWinglet(150.0)
    ]
    
    display_winglet_telemetry(telemetry_setup, 300.0)
```

</details>

***

# Module 4: Intermediate - Encapsulation

Welcome back! In this module, we will explore the third pillar of OOP: **Encapsulation**.

---

## 1. Concept Explanation

**Encapsulation** is the practice of bundling data (attributes) and methods that operate on that data inside a single unit (a class), while restricting direct access to some of the object's components. 

Encapsulation acts as a protective shield that prevents external code from directly modifying or corrupting an object's internal state.

### How Python Implements Encapsulation
Unlike some programming languages (like Java or C++), Python does not have strict keyword enforcement for `private` or `public` access. Instead, Python uses conventions:
1.  **Public Attributes:** Accessible from anywhere. E.g., `self.rider = "Bagnaia"`.
2.  **Protected Attributes (Convention):** Prefixed with a single underscore. E.g., `self._telemetry_active = True`. This signals to other developers, *"This is internal; please don't access or change this directly outside this class, though Python won't stop you."*
3.  **Private Attributes (Enforced):** Prefixed with a double underscore. E.g., `self.__ecu_mapping = 1`. Python activates **Name Mangling** for these. It renames the variable under the hood to `_ClassName__attributeName` so that direct external modification raises an `AttributeError`.

### Getters and Setters
To read or write private attributes safely, we define public methods:
*   **Getter (Accessor):** A public method that returns the value of a private attribute.
*   **Setter (Mutator):** A public method that updates the value of a private attribute, typically performing **validation** or authorization checks first.

---

## 2. MotoGP Case Study

In the high-stakes world of MotoGP, ECU maps (combining engine torque curves, traction control settings, and engine braking parameters) are highly guarded secrets. Direct access to change them is restricted to certified crew chiefs using secure interfaces.
*   **The Problem:** If anyone could access a bike object and directly write `bike.engine_temp_c = -50.0` or `bike.ecu_mode = 9999`, it could corrupt telemetry dashboards or break control algorithms.
*   **The Encapsulation Solution:** We make `__ecu_mode` and `__engine_temp_c` private. 
    *   We provide a read-only getter for the engine temperature (since it represents a real hardware sensor reading; external software cannot "set" temperature).
    *   We provide a setter for `ecu_mode` that checks if the new mode is within valid ranges (e.g., A, B, or C). If an invalid mode is requested, the system rejects it and logs a warning.

---

## 3. Production-Ready Code Example

Below is a clean, type-hinted, and commented Python script showing encapsulation in action.

```python
class EngineECU:
    """Manages secure telemetry and configurations for a MotoGP engine."""

    def __init__(self, rider: str, initial_ecu_mode: str = "Power_A") -> None:
        self.rider: str = rider
        # Private attributes
        self.__ecu_mode: str = initial_ecu_mode
        self.__engine_temp_c: float = 85.0  # Sensor value, read-only from outside

    # Getter for engine temperature (Read-Only)
    def get_engine_temp(self) -> float:
        """Returns the current engine temperature sensor value."""
        return self.__engine_temp_c

    # Getter for ECU mode
    def get_ecu_mode(self) -> str:
        """Returns the active ECU mapping mode."""
        return self.__ecu_mode

    # Setter for ECU mode (with validation)
    def set_ecu_mode(self, new_mode: str) -> None:
        """Updates the ECU mapping mode after validating input.

        Args:
            new_mode: The new mapping name ("Power_A", "Power_B", or "Rain").
        """
        valid_modes = {"Power_A", "Power_B", "Rain"}
        if new_mode in valid_modes:
            self.__ecu_mode = new_mode
            print(f"[ECU Alert] {self.rider}'s bike map successfully updated to: {self.__ecu_mode}")
        else:
            print(f"[ECU Rejection] Map update rejected: '{new_mode}' is not a valid MotoGP fuel mapping.")


# --- Demonstration of Encapsulation ---
if __name__ == "__main__":
    ecu = EngineECU("Marc Márquez")

    # 1. Attempting direct access to private attributes (Will fail)
    try:
        # This will raise an AttributeError because of Name Mangling
        print(ecu.__ecu_mode)
    except AttributeError as e:
        print(f"Direct access failed as expected: {e}")

    # 2. Reading state via public getters
    print(f"Current engine temperature: {ecu.get_engine_temp()}°C")
    print(f"Current ECU mode: {ecu.get_ecu_mode()}")

    # 3. Setting state via public setter (Valid map)
    ecu.set_ecu_mode("Rain")

    # 4. Setting state via public setter (Invalid map - validation will trigger rejection)
    ecu.set_ecu_mode("Maximum_Boost_Illegal")
```

---

## 4. Practical Exercise

**Task:** Create a class named `TireWearTracker` to manage tire telemetry safely.

### Requirements:
1.  **Attributes:**
    *   `__tire_pressure_psi` (float): Private attribute representing current tire pressure.
    *   `__compound` (string): Private attribute, one of: `"Soft"`, `"Medium"`, or `"Hard"`.
2.  **Constructor:**
    *   `__init__(self, compound: str, initial_pressure_psi: float)`
3.  **Methods:**
    *   `get_compound(self) -> str`: Getter for compound (read-only; do not define a setter for compound).
    *   `get_pressure(self) -> float`: Getter for tire pressure.
    *   `set_pressure(self, new_pressure: float) -> None`: Setter for tire pressure.
        *   Must validate that `new_pressure` is between `15.0` psi and `35.0` psi.
        *   If the new pressure is within the valid range, update `__tire_pressure_psi`.
        *   If outside the valid range, print a warning like `"ALERT: Sensor pressure [pressure] is outside limits! Rejecting update."` and do not update.

Verify your implementation by creating a tracker for a `"Medium"` compound tire at `20.0` psi. Try setting the pressure to a valid value (e.g. `22.5` psi) and an invalid value (e.g. `12.0` psi or `40.0` psi), and checking the result.

---

## 5. Exercise Solution

*Try to write the code yourself before checking this solution!*

<details>
<summary>Click here to reveal the solution</summary>

```python
class TireWearTracker:
    """Tracks tire compounds and sensor telemetry safely using encapsulation."""

    def __init__(self, compound: str, initial_pressure_psi: float) -> None:
        self.__compound: str = compound
        self.__tire_pressure_psi: float = initial_pressure_psi

    def get_compound(self) -> str:
        """Returns the tire compound (Read-only)."""
        return self.__compound

    def get_pressure(self) -> float:
        """Returns the current tire pressure in PSI."""
        return self.__tire_pressure_psi

    def set_pressure(self, new_pressure: float) -> None:
        """Validates and updates the tire pressure sensor value."""
        min_psi = 15.0
        max_psi = 35.0
        
        if min_psi <= new_pressure <= max_psi:
            self.__tire_pressure_psi = new_pressure
            print(f"[Sensor Update] Tire pressure updated to {self.__tire_pressure_psi} PSI.")
        else:
            print(f"[Sensor Alert] Rejected pressure change to {new_pressure} PSI. Outside safe bounds ({min_psi}-{max_psi} PSI).")


# --- Verification Code ---
if __name__ == "__main__":
    tracker = TireWearTracker("Medium", 20.0)
    
    # Read values
    print(f"Tire Compound: {tracker.get_compound()}")
    print(f"Initial Pressure: {tracker.get_pressure()} PSI")
    
    # Update pressure - Valid
    tracker.set_pressure(22.5)
    print(f"Updated Pressure: {tracker.get_pressure()} PSI")
    
    # Update pressure - Invalid (under pressure)
    tracker.set_pressure(12.0)
    print(f"Pressure after low change: {tracker.get_pressure()} PSI (Should remain 22.5)")
    
    # Update pressure - Invalid (over pressure)
    tracker.set_pressure(38.0)
    print(f"Pressure after high change: {tracker.get_pressure()} PSI (Should remain 22.5)")
```

</details>

***

# Module 5: Intermediate - Abstraction

Welcome back! In this module, we will explore the final pillar of OOP: **Abstraction**.

---

## 1. Concept Explanation

**Abstraction** is the process of hiding complex internal details of a system and exposing only the simple, essential interface required to interact with it.

If encapsulation is about *hiding data for protection*, abstraction is about *hiding complexity for simplicity*.

### Implementing Abstraction in Python
In Python, we achieve abstraction using **Abstract Base Classes (ABCs)** from the built-in `abc` module.
1.  **Abstract Class:** A class that inherits from `ABC`. It cannot be instantiated directly (you cannot run `system = EngineSystem()`). Its sole purpose is to serve as a design contract or template for other classes.
2.  **Abstract Method:** A method decorated with `@abstractmethod` inside an abstract class. It has no body implementation (just a docstring or `pass`). Every concrete child class *must* override and implement this method, or Python will raise a `TypeError` when you try to instantiate the child.

---

## 2. MotoGP Case Study

MotoGP bikes are mechanical masterpieces containing extreme internal complexities.
*   **The Complexity:** A Ducati Desmosedici engine features a **Desmodromic valve control system**. Instead of traditional valve springs (which can flex or float at extreme RPMs), a Desmo engine uses a mechanical cam-and-rocker system to both open and actively force-close the engine valves at 18,000 RPM.
*   **The Abstraction:** A rider riding down the Mugello straight doesn't need to manually orchestrate the opening and closing rocker levers of the Desmodromic cams. The mechanical details are abstracted away. The rider interacts with a single, simple control interface: `press_throttle(percentage: float)`.
*   **Design Contract:** We can design an abstract class `Engine` with abstract methods like `combust()`. 
    *   `DesmosediciGP` implements `combust()` using Desmodromic valve logic.
    *   `YamahaM1` implements `combust()` using pneumatic spring valves.
    *   The motorcycle controller interacts with the generic `Engine` interface and triggers `combust()` without needing to know which valve actuation technology is hidden inside.

---

## 3. Production-Ready Code Example

Below is a clean, type-hinted, and commented Python script showing abstraction in action.

```python
from abc import ABC, abstractmethod

class Engine(ABC):
    """Abstract Base Class representing a generic MotoGP engine system."""

    def __init__(self, model_name: str) -> None:
        self.model_name: str = model_name

    @abstractmethod
    def combust(self, fuel_ml: float) -> float:
        """Abstract method to perform combustion and return horse power generated.

        Must be overridden by all concrete engine subclasses.
        """
        pass

    @abstractmethod
    def actuate_valves(self) -> None:
        """Abstract method to actuate cylinder valves.

        Must be overridden by all concrete engine subclasses.
        """
        pass


class DesmosediciEngine(Engine):
    """Ducati's engine implementing specialized Desmodromic mechanical valve logic."""

    def __init__(self) -> None:
        super().__init__(model_name="Ducati Desmosedici V4")

    def actuate_valves(self) -> None:
        """Implements valve control using Desmodromic dual-cam rocker arms."""
        print(f"[{self.model_name}] Cam active: Pulling rocker opens valve, pushing rocker closes valve. No springs used.")

    def combust(self, fuel_ml: float) -> float:
        """Executes fuel combustion with high mechanical reliability at high RPM."""
        self.actuate_valves()
        power = fuel_ml * 1.55  # Desmo efficiency coefficient
        print(f"[{self.model_name}] Combustion complete! Generated {power:.1f} HP.")
        return power


class InlineFourEngine(Engine):
    """Yamaha's engine implementing traditional pneumatic valve spring logic."""

    def __init__(self) -> None:
        super().__init__(model_name="Yamaha Inline-4")

    def actuate_valves(self) -> None:
        """Implements valve control using high-pressure pneumatic gas chambers."""
        print(f"[{self.model_name}] Pneumatic pressure active: Gas springs retracting valves at speed.")

    def combust(self, fuel_ml: float) -> float:
        """Executes fuel combustion using inline-4 geometry."""
        self.actuate_valves()
        power = fuel_ml * 1.48  # Pneumatic spring efficiency coefficient
        print(f"[{self.model_name}] Combustion complete! Generated {power:.1f} HP.")
        return power
```

---

## 4. Practical Exercise

**Task:** Design an abstract Braking System class using `ABC`.

### Requirements:
1.  Create an abstract class called `BrakingSystem` that inherits from `ABC`.
    *   Define an abstract method `apply_brake(self, pressure_bar: float) -> float`. (It should return the stopping force in Newtons).
2.  Create a concrete subclass called `CarbonBrake`.
    *   It should have an `__init__(self, current_temp_c: float)` constructor.
    *   Implement `apply_brake`. Carbon brakes require high heat to function efficiently:
        *   If `current_temp_c` is greater than or equal to `250.0`°C, return `pressure_bar * 125.0`.
        *   If `current_temp_c` is less than `250.0`°C (cold brakes), return `pressure_bar * 30.0`.
3.  Create a concrete subclass called `SteelBrake`.
    *   Steel brakes work consistently across all operating temperatures.
    *   Implement `apply_brake`. It should always return `pressure_bar * 80.0` regardless of temperature.
4.  Write client code that instantiates both brakes (e.g. a cold `CarbonBrake` at `100.0`°C, a hot `CarbonBrake` at `320.0`°C, and a `SteelBrake`), and applies `8.5` bar of pressure to each, displaying the stopping force.

---

## 5. Exercise Solution

*Try to write the code yourself before checking this solution!*

<details>
<summary>Click here to reveal the solution</summary>

```python
from abc import ABC, abstractmethod

class BrakingSystem(ABC):
    """Abstract Base Class defining the contract for MotoGP braking mechanics."""

    @abstractmethod
    def apply_brake(self, pressure_bar: float) -> float:
        """Calculates and returns stopping force in Newtons based on brake pressure.

        Must be implemented by subclasses.
        """
        pass


class CarbonBrake(BrakingSystem):
    """Carbon-fiber brakes used in dry conditions, highly dependent on thermal operating windows."""

    def __init__(self, current_temp_c: float) -> None:
        self.current_temp_c: float = current_temp_c

    def apply_brake(self, pressure_bar: float) -> float:
        """Implements dry-condition carbon brake telemetry logic."""
        if self.current_temp_c >= 250.0:
            # Hot carbon brakes are extremely effective
            return pressure_bar * 125.0
        else:
            # Cold carbon brakes lack friction efficiency
            return pressure_bar * 30.0


class SteelBrake(BrakingSystem):
    """Steel brakes used mostly in wet races, offering reliable baseline friction."""

    def apply_brake(self, pressure_bar: float) -> float:
        """Implements consistent braking logic across all temperatures."""
        return pressure_bar * 80.0


# --- Verification Code ---
if __name__ == "__main__":
    cold_carbon = CarbonBrake(current_temp_c=100.0)
    hot_carbon = CarbonBrake(current_temp_c=320.0)
    wet_steel = SteelBrake()

    pressure = 8.5  # Input braking pressure in bar
    
    print(f"Applying {pressure} bar of brake pressure:")
    print(f"Cold Carbon Brake stopping force: {cold_carbon.apply_brake(pressure)} N")
    print(f"Hot Carbon Brake stopping force: {hot_carbon.apply_brake(pressure)} N")
    print(f"Steel Brake stopping force:      {wet_steel.apply_brake(pressure)} N")
```

</details>

***

# Module 6: Advanced - Magic Methods & Properties

Welcome to the Advanced stage! In this module, we will explore Python **Magic Methods** and the **`@property`** decorator.

---

## 1. Concept Explanation

### Magic Methods (Dunder Methods)
Magic methods are special built-in methods whose names begin and end with double underscores (e.g., `__init__`). They are also called **dunder methods** (short for **D**ouble **Under**score).
Magic methods allow your custom objects to integrate seamlessly with Python's operators and built-in functions:
*   **`__str__(self) -> str`:** Invoked when you pass the object to `print()` or `str()`. It should return a user-friendly, readable string representation of the object.
*   **`__repr__(self) -> str`:** Invoked when you inspect an object in the interactive shell. It should return an unambiguous string that ideally looks like the code needed to recreate the object.
*   **`__add__(self, other) -> CustomObject`:** Invoked when you use the `+` operator on two objects. This allows you to define custom behavior for adding two of your instances together.

### Properties (`@property`)
Properties provide a clean, Pythonic alternative to traditional getters and setters. Using the `@property` decorator, you can define a method that can be accessed like a normal public variable (e.g. `bike.displacement` instead of `bike.get_displacement()`).
*   **`@property` (Getter):** Marks the method as a read-only property.
*   **`@<name>.setter` (Setter):** Allows you to write validation logic that executes when someone assigns a value using the assignment operator (e.g., `bike.displacement = 1000`).

---

## 2. MotoGP Case Study

In MotoGP, telemetry data and track regulations are core to engine operations.
1.  **Overloading `+` (Magic Method):** Lap telemetry is gathered in segments or "sectors". A MotoGP lap has four sectors. Each sector telemetry packet contains speed readings and throttle percentages. If we want to merge the telemetry of two sectors into a single packet, overloading the `+` operator using `__add__` lets us write simple, readable code like: `full_lap = sector_1 + sector_2`.
2.  **Printing Telemetry (Magic Method):** Overloading `__str__` allows us to instantly print telemetry diagnostics to the pitwall monitors by writing `print(telemetry_packet)`.
3.  **Engine Displacement Limits (Properties):** The FIM (governing body) regulates that MotoGP engine displacement must not exceed 1000cc. We can make displacement a property. If a programmer attempts to increase a motorcycle engine displacement value to `1002` cc, the property setter will block it to prevent rule violations.

---

## 3. Production-Ready Code Example

Let's implement this in a production-ready telemetry and rules script:

```python
class TelemetryPacket:
    """Represents a set of telemetry data points captured on track."""

    def __init__(self, sector: int, avg_speed: float, top_speed: float) -> None:
        self.sector: int = sector
        self.avg_speed: float = avg_speed
        self.top_speed: float = top_speed

    def __str__(self) -> str:
        """Returns a user-friendly diagnostic summary of this sector packet."""
        return f"[Sector {self.sector}] Speed Avg: {self.avg_speed:.1f} km/h | Top: {self.top_speed:.1f} km/h"

    def __add__(self, other: "TelemetryPacket") -> "TelemetryPacket":
        """Combines the telemetry data of two sectors by averaging and taking the max top speed."""
        combined_sector = int(f"{self.sector}{other.sector}")  # e.g., Sector 1 + 2 = Sector 12
        new_avg = (self.avg_speed + other.avg_speed) / 2.0
        new_top = max(self.top_speed, other.top_speed)
        return TelemetryPacket(sector=combined_sector, avg_speed=new_avg, top_speed=new_top)


class MotoGPRegulations:
    """Enforces FIM engine specifications using properties."""

    def __init__(self, rider: str, initial_displacement_cc: int) -> None:
        self.rider: str = rider
        # Internal backing variable (protected)
        self._engine_cc: int = 1000
        # Call the setter to run initial validation
        self.engine_cc = initial_displacement_cc

    @property
    def engine_cc(self) -> int:
        """Getter for the engine displacement in cc."""
        return self._engine_cc

    @engine_cc.setter
    def engine_cc(self, value: int) -> None:
        """Setter for the engine displacement that enforces the 1000cc FIM limit."""
        max_limit = 1000
        if value <= max_limit:
            self._engine_cc = value
            print(f"[FIM Technical Check] {self.rider}'s engine displacement set to: {self._engine_cc}cc. STATUS: APPROVED.")
        else:
            print(f"[FIM Technical Violation] Rejected {value}cc for {self.rider}. Cannot exceed {max_limit}cc regulation!")
```

---

## 4. Practical Exercise

**Task:** Create a class `RaceTime` that represents a lap time in minutes and seconds, along with properties.

### Requirements:
1.  **Constructor:** `__init__(self, minutes: int, seconds: float)`
2.  **Magic Methods:**
    *   `__str__(self) -> str`: Return the time formatted nicely as `"MM:SS.FFF"`. For example: `1` minute and `45.320` seconds should output `"01:45.320"`. *(Hint: You can format numbers using `f"{self.minutes:02d}:{self.seconds:06.3f}"`)*.
    *   `__add__(self, other: RaceTime) -> RaceTime`: Adding two `RaceTime` objects must return a new `RaceTime` object. 
        *   Be sure to add seconds together. If the sum of seconds is greater than or equal to `60.0`, subtract `60.0` from seconds and add `1` to the minutes.
3.  **Properties:**
    *   Create a read-only property `@property` called `total_seconds` (no setter).
    *   It should return the entire time value calculated completely in seconds (`minutes * 60 + seconds`).

Verify your class by instantiating a lap time of `1` minute, `35.250` seconds, and another of `0` minutes, `45.850` seconds. Add them together, print the sum, and print the `total_seconds` property of the sum.

---

## 5. Exercise Solution

*Try to write the code yourself before checking this solution!*

<details>
<summary>Click here to reveal the solution</summary>

```python
class RaceTime:
    """Represents lap time telemetry with arithmetic capabilities."""

    def __init__(self, minutes: int, seconds: float) -> None:
        self.minutes: int = minutes
        self.seconds: float = seconds

    def __str__(self) -> str:
        """Returns the formatted race time representation."""
        return f"{self.minutes:02d}:{self.seconds:06.3f}"

    def __add__(self, other: "RaceTime") -> "RaceTime":
        """Adds two RaceTime segments and rolls over seconds when necessary."""
        total_mins = self.minutes + other.minutes
        total_secs = self.seconds + other.seconds
        
        # Roll over seconds to minutes
        if total_secs >= 60.0:
            total_mins += int(total_secs // 60)
            total_secs = total_secs % 60.0
            
        return RaceTime(total_mins, total_secs)

    @property
    def total_seconds(self) -> float:
        """Calculates and returns the entire time represented in seconds."""
        return (self.minutes * 60) + self.seconds
```

</details>

***

# Module 7: Advanced - Class/Static Methods & Composition

Welcome to the final module of the MotoGP Python OOP syllabus! In this lesson, we will cover **Class Methods**, **Static Methods**, and **Composition vs. Inheritance**.

---

## 1. Concept Explanation

### Class Methods (`@classmethod`)
A class method is bound to the class itself rather than individual instances. 
*   It is decorated with `@classmethod`.
*   It takes `cls` (the class itself) as its first argument instead of `self`.
*   **Common Use Case:** Creating "factory methods" (alternative constructors) that instantiate objects with predefined settings.

### Static Methods (`@staticmethod`)
A static method does not have access to either the instance (`self`) or the class (`cls`). It acts like a plain function, but is grouped inside a class block because it is conceptually related to it.
*   It is decorated with `@staticmethod`.
*   It takes no automatic first parameter.
*   **Common Use Case:** Utility functions that perform computations from input parameters without accessing or modifying class state.

### Composition ("HAS-A")
**Composition** is a design pattern where a class is composed of one or more instances of other classes as attributes. 
Unlike inheritance (which represents an **"IS-A"** relationship), composition represents a **"HAS-A"** relationship. 
*   *Example:* A motorcycle **IS-A** vehicle (Inheritance), but a motorcycle **HAS-AN** engine, **HAS-A** chassis, and **HAS** tires (Composition).
*   **Why choose Composition?** It provides greater flexibility. You can swap out component behaviors dynamically at runtime, and classes remain decoupled, avoiding complex multi-level inheritance hierarchies.

---

## 2. MotoGP Case Study

Let's look at how these three concepts align in the team garage:
1.  **Composition:** A MotoGP racing motorcycle is built by assembling discrete specialized components: an `Engine` object (e.g. V4 configuration), a `Chassis` object (e.g. aluminum twin-spar structure), and a list of `Tire` objects. The `MotoGPBike` class coordinates these parts rather than inheriting from them.
2.  **Class Methods (Factory):** When a race weekend switches from dry to rain, the mechanics need to rebuild the bike setups. Instead of manually specifying all setup values in the constructor, we can use a class factory method: `MotoGPBike.build_wet_setup(rider_name)`. This method returns a bike initialized with wet tires and soft ECU torque settings automatically.
3.  **Static Methods (Utilities):** Calculating theoretical tire wear or fuel consumption based strictly on air temperature and lap count doesn't require knowing details about a specific bike instance. We can host a static utility method `estimate_wear(laps, temp)` inside the `Tire` class.

---

## 3. Production-Ready Code Example

Below is a clean, type-hinted Python script demonstrating all three concepts:

```python
class Engine:
    """Represents a high-performance racing engine component."""

    def __init__(self, layout: str, horsepower: int) -> None:
        self.layout: str = layout
        self.horsepower: int = horsepower

    def get_specs(self) -> str:
        return f"{self.layout} powerplant generating {self.horsepower} HP"


class Chassis:
    """Represents the carbon/aluminum chassis frame component."""

    def __init__(self, material: str, stiffness: str) -> None:
        self.material: str = material
        self.stiffness: str = stiffness


class MotoGPBike:
    """A prototype motorcycle utilizing composition and class/static methods."""

    def __init__(self, rider: str, engine: Engine, chassis: Chassis, wet_setup: bool = False) -> None:
        # Composition: Engine and Chassis instances are objects inside MotoGPBike
        self.rider: str = rider
        self.engine: Engine = engine
        self.chassis: Chassis = chassis
        self.wet_setup: bool = wet_setup

    def get_bike_diagnostics(self) -> str:
        """Returns diagnostic details by querying its composed elements."""
        setup_type = "WET" if self.wet_setup else "DRY"
        return f"Rider: {self.rider} | Setup: {setup_type} | Frame: {self.chassis.material} | Engine: {self.engine.get_specs()}"

    @classmethod
    def build_ducati_factory_spec(cls, rider: str) -> "MotoGPBike":
        """Class method acting as a factory constructor for a default Ducati spec."""
        default_engine = Engine(layout="Desmosedici V4", horsepower=285)
        default_chassis = Chassis(material="Carbon Fiber Monocoque", stiffness="High")
        # Return a new instance of cls (MotoGPBike)
        return cls(rider=rider, engine=default_engine, chassis=default_chassis, wet_setup=False)

    @staticmethod
    def calculate_ideal_tire_pressure(track_temp_c: float) -> float:
        """Static utility method to calculate optimal starting tire pressure in bar."""
        # Simple algorithm: baseline 1.8 bar, decreasing slightly as track temp increases
        if track_temp_c > 40.0:
            return 1.75
        elif track_temp_c < 20.0:
            return 1.90
        return 1.80


# --- Demonstration of Class/Static Methods & Composition ---
if __name__ == "__main__":
    # 1. Instantiate using the Class Method Factory
    pecco_bike = MotoGPBike.build_ducati_factory_spec("Francesco Bagnaia")
    print(pecco_bike.get_bike_diagnostics())

    # 2. Call the Static Method directly on the Class
    optimal_pressure = MotoGPBike.calculate_ideal_tire_pressure(track_temp_c=45.5)
    print(f"Optimal tire pressure for 45.5°C track: {optimal_pressure} bar")
```

---

## 4. Practical Exercise

**Task:** Design a MotoGP Team management structure using Composition and Class/Static Methods.

### Requirements:
1.  Create a class `Rider` with attributes `name` (str) and `points` (int).
2.  Create a class `Motorcycle` with attributes `make` (str) and `displacement` (int).
3.  Create a class `Team` representing a racing team.
    *   **Composition:** The constructor `__init__(self, name: str, riders: list[Rider], motorcycles: list[Motorcycle])` must store lists of `Rider` and `Motorcycle` objects.
    *   **Class Method:** Create a factory method `@classmethod` `build_two_rider_team(cls, team_name: str, make: str, r1_name: str, r2_name: str)`:
        *   It should instantiate two `Rider` objects (points start at 0).
        *   It should instantiate two prototype `Motorcycle` objects (make = `make`, displacement = `1000`).
        *   It should return an initialized `Team` instance containing these components.
    *   **Static Method:** Create a method `@staticmethod` `is_championship_active(year: int) -> bool`:
        *   The MotoGP World Championship was founded in 1949. Return `True` if `year` is greater than or equal to `1949`, otherwise return `False`.

Verify your implementation by constructing the `"Ducati Lenovo Team"` with riders `"Pecco Bagnaia"` and `"Marc Márquez"` using your team factory method. Print out the team details, and check if the year `1950` is a valid championship year using your static method.

---

## 5. Exercise Solution

*Try to write the code yourself before checking this solution!*

<details>
<summary>Click here to reveal the solution</summary>

```python
class Rider:
    """Represents a racing pilot."""

    def __init__(self, name: str) -> None:
        self.name: str = name
        self.points: int = 0


class Motorcycle:
    """Represents a racing motorcycle prototype."""

    def __init__(self, make: str, displacement: int = 1000) -> None:
        self.make: str = make
        self.displacement: int = displacement


class Team:
    """Manages riders and bikes using composition and factory methods."""

    def __init__(self, name: str, riders: list[Rider], motorcycles: list[Motorcycle]) -> None:
        # Composition: Team contains objects of Rider and Motorcycle
        self.name: str = name
        self.riders: list[Rider] = riders
        self.motorcycles: list[Motorcycle] = motorcycles

    def get_details(self) -> str:
        """Returns details about the team components."""
        rider_names = [rider.name for rider in self.riders]
        bike_makes = [bike.make for bike in self.motorcycles]
        return f"Team: {self.name} | Riders: {', '.join(rider_names)} | Bikes: {', '.join(bike_makes)}"

    @classmethod
    def build_two_rider_team(cls, team_name: str, make: str, r1_name: str, r2_name: str) -> "Team":
        """Factory class method to set up a standard two-rider grid team."""
        riders = [Rider(r1_name), Rider(r2_name)]
        bikes = [Motorcycle(make), Motorcycle(make)]
        return cls(name=team_name, riders=riders, motorcycles=bikes)

    @staticmethod
    def is_championship_active(year: int) -> bool:
        """Validates if a given calendar year falls within the MotoGP racing history."""
        starting_year = 1949
        return year >= starting_year


# --- Verification Code ---
if __name__ == "__main__":
    # Test Class Method (Factory) and Composition
    team = Team.build_two_rider_team(
        team_name="Ducati Lenovo Team", 
        make="Ducati", 
        r1_name="Pecco Bagnaia", 
        r2_name="Marc Márquez"
    )
    print(team.get_details())

    # Test Static Method
    year_to_check = 1950
    active = Team.is_championship_active(year_to_check)
    print(f"Was the MotoGP championship active in {year_to_check}? {active}")
```

</details>
