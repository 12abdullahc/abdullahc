# 🏁 Python Object-Oriented Programming (OOP) Interactive Course: MotoGP Edition

Welcome to your personalized Python OOP course! This interactive textbook, workbook, and progress tracker is fully themed around the high-octane world of **MotoGP** (Grand Prix motorcycle racing). 

From track telemetry and engine mappings to tire compound selections and factory team structures, you will learn standard software design patterns using the physics, rules, and engineering of MotoGP.

---

## 📊 Course Progress Tracker

### Phase 1: Basics of OOP
- [x] 1.1 Introduction to OOP (What is a class vs. an object?)
- [x] 1.2 The `__init__` method (Constructor) and Instance Attributes
- [x] 1.3 Instance Methods and the 'self' parameter
- [x] 1.4 Class Attributes vs. Instance Attributes

### Phase 2: The Core Pillars of OOP
- [x] 2.1 Encapsulation (Public, Protected, Private; Getters & Setters)
- [x] 2.2 Inheritance (Single & Multi-level, Method Overriding)
- [x] 2.3 Polymorphism (Method Overriding & Duck Typing)
- [x] 2.4 Abstraction (Abstract Base Classes & `abc` module)

### Phase 3: Advanced OOP Concepts
- [x] 3.1 Class Methods (`@classmethod`) vs. Static Methods (`@staticmethod`)
- [x] 3.2 Property Decorators (`@property`, `@setter`)
- [x] 3.3 Magic/Dunder Methods (`__str__`, `__repr__`, `__add__`, `__len__`, etc.)
- [x] 3.4 Multiple Inheritance and Method Resolution Order (MRO)
- [x] 3.5 Introduction to Metaclasses (Overview & Use Cases)

---

## 📘 Lesson 1.1: Introduction to OOP (What is a class vs. an object?)

### 1. Conceptual Explanation
In standard programming, we organize data and actions separately. But a MotoGP race team is a complex ecosystem. We need a way to group data (like a motorcycle's engine displacement, fuel level, and speed) together with its behaviors (accelerating, braking, and changing gears).

**Object-Oriented Programming (OOP)** is a paradigm that bundles data (attributes) and behavior (methods) into cohesive units called **Objects**.

To understand OOP, you must understand the distinction between a **Class** and an **Object**:

| Concept | Description | MotoGP Analogy |
| :--- | :--- | :--- |
| **Class** | A blueprint, template, or schema. It defines the structures and capabilities, but it occupies no memory for data. | The blueprints designed by Ducati Corse engineers for the Desmosedici GP24. |
| **Object** | An **instance** of a class. It is the concrete, tangible motorcycle built from those blueprints, occupying real space and holding specific data. | Francesco Bagnaia's physical #1 Ducati GP24 sitting in the pit lane. |

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
# 1. Define a Class (the blueprint)
class MotoGPBike:
    pass  # Placeholder class for now

# 2. Instantiate (create) Objects from our Class
pecco_bike = MotoGPBike()
marquez_bike = MotoGPBike()

# 3. Check memory addresses to confirm they are distinct instances
print("Pecco's Bike address:", pecco_bike)
print("Marquez's Bike address:", marquez_bike)
print("Are they the identical machine?", pecco_bike is marquez_bike)

# 4. Dynamically assign custom data (attributes) to each object
pecco_bike.rider = "Francesco Bagnaia"
pecco_bike.number = 1
pecco_bike.engine_config = "V4"

marquez_bike.rider = "Marc Marquez"
marquez_bike.number = 93
marquez_bike.engine_config = "V4"

# 5. Access these attributes
print(f"\nBike 1: Rider {pecco_bike.rider} (Grid #{pecco_bike.number}) runs a {pecco_bike.engine_config} engine.")
print(f"Bike 2: Rider {marquez_bike.rider} (Grid #{marquez_bike.number}) runs a {marquez_bike.engine_config} engine.")
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Define an empty class named `Rider` using `pass`.
2. Create two objects: `rider_one` and `rider_two`.
3. Dynamically assign these attributes:
   - `rider_one`: `name` = "Fabio Quartararo", `number` = 20, `world_championships` = 1
   - `rider_two`: `name` = "Jorge Martin", `number` = 89, `world_championships` = 0
4. Print a formatted string for each: `"Rider Fabio Quartararo (#20) has 1 World Championships."`

#### Model Solution:
```python
class Rider:
    pass

rider_one = Rider()
rider_two = Rider()

rider_one.name = "Fabio Quartararo"
rider_one.number = 20
rider_one.world_championships = 1

rider_two.name = "Jorge Martin"
rider_two.number = 89
rider_two.world_championships = 0

print(f"Rider {rider_one.name} (#{rider_one.number}) has {rider_one.world_championships} World Championships.")
print(f"Rider {rider_two.name} (#{rider_two.number}) has {rider_two.world_championships} World Championships.")
```

---

## 📘 Lesson 1.2: The `__init__` Method (Constructor) and Instance Attributes

### 1. Conceptual Explanation
Dynamically adding attributes (like `pecco_bike.rider = "..."` after creation) is dangerous. If you make a typo (`pecco_bike.ridr = "..."`), Python creates a new attribute instead of throwing an error, leading to silent bugs.

#### 🛠️ The Solution: The `__init__` Constructor
The `__init__` method runs **automatically** the moment you instantiate a class. It guarantees that every object is built with a standard list of **Instance Attributes** (variables unique to each object).

Inside the constructor, we use the `self` parameter to bind values to the specific object being built:
```python
class MotoGPBike:
    def __init__(self, rider, manufacturer):
        self.rider = rider              # Instance attribute
        self.manufacturer = manufacturer  # Instance attribute
```

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
class MotoGPBike:
    def __init__(self, rider, number, manufacturer):
        self.rider = rider
        self.number = number
        self.manufacturer = manufacturer
        self.engine_temp_celsius = 25.0  # Default initial ambient temperature

# Instantiate fully constructed objects in single lines!
bike_one = MotoGPBike("Francesco Bagnaia", 1, "Ducati")
bike_two = MotoGPBike("Brad Binder", 33, "KTM")

print(f"Rider: {bike_one.rider} | Bike: {bike_one.manufacturer} | Engine Temp: {bike_one.engine_temp_celsius}°C")
print(f"Rider: {bike_two.rider} | Bike: {bike_two.manufacturer} | Engine Temp: {bike_two.engine_temp_celsius}°C")
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Define a class `RaceTeam`.
2. Construct it with three parameters: `name`, `manufacturer`, and `team_principal`.
3. Add a default instance attribute `championship_points` initialized to `0`.
4. Instantiate "Ducati Lenovo Team" and "Aprilia Racing". Print their details.

#### Model Solution:
```python
class RaceTeam:
    def __init__(self, name, manufacturer, team_principal):
        self.name = name
        self.manufacturer = manufacturer
        self.team_principal = team_principal
        self.championship_points = 0

lenovo_ducati = RaceTeam("Ducati Lenovo Team", "Ducati", "Davide Tardozzi")
aprilia_racing = RaceTeam("Aprilia Racing", "Aprilia", "Massimo Rivola")

print(f"Team: {lenovo_ducati.name} run by {lenovo_ducati.team_principal} starts with {lenovo_ducati.championship_points} points.")
```

---

## 📘 Lesson 1.3: Instance Methods and the 'self' parameter

### 1. Conceptual Explanation
MotoGP objects are highly dynamic. A motorcycle does not just sit in the garage; it revs, speeds up, runs hot, and burns fuel. We model these actions using **Instance Methods** (functions defined inside a class).

#### 🌀 The `self` Parameter
Every instance method must take `self` as its first parameter.
- When you write `pecco_bike.accelerate(40)`, Python secretly translates it to `MotoGPBike.accelerate(pecco_bike, 40)`.
- `self` acts as the hook that allows the method to read and change that specific bike's telemetry.

---

### 2. Google Colab-Compatible Code Examples

#### A. Simple Example (No parameters except `self`)
Copy and run this cell to see a basic instance method:

```python
class MotoGPBike:
    def __init__(self, rider):
        self.rider = rider

    # A simple instance method that prints a message
    def start_engine(self):
        print(f"{self.rider}'s engine starts: VROOM!")

bike = MotoGPBike("Pecco Bagnaia")
bike.start_engine()
```

#### B. Medium Example (Accepting arguments to modify state)
Copy and run this cell to see an instance method that accepts arguments and updates an instance attribute:

```python
class MotoGPBike:
    def __init__(self, rider):
        self.rider = rider
        self.speed_kph = 0  # Initial speed is 0

    # Instance method that takes an argument to modify state
    def accelerate(self, increase):
        self.speed_kph += increase
        print(f"{self.rider} accelerated. Current speed: {self.speed_kph} km/h")

bike = MotoGPBike("Pecco Bagnaia")
bike.accelerate(80)
bike.accelerate(120)
```

#### C. Advanced Example (Modifying state with arguments & validation)
Copy and run this cell to see how instance methods can accept arguments, modify state, and include validation logic:

```python
class MotoGPBike:
    def __init__(self, rider, manufacturer):
        self.rider = rider
        self.manufacturer = manufacturer
        self.engine_rpm = 1000
        self.fuel_liters = 22.0  # Max fuel capacity permitted in MotoGP

    # Instance method
    def rev_engine(self, rpm_increase):
        self.engine_rpm += rpm_increase
        self.fuel_liters -= 0.05  # Burning fuel!
        
        # Max limit safety
        if self.engine_rpm > 18000:
            self.engine_rpm = 18000
            print("Limiter triggered! Maximum 18,000 RPM reached.")
            
        print(f"{self.rider}'s engine revved to {self.engine_rpm} RPM. Remaining Fuel: {self.fuel_liters:.2f}L")

bike = MotoGPBike("Marc Marquez", "Ducati")
bike.rev_engine(5000)
bike.rev_engine(15000)  # Exceeds limit
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Copy your `RaceTeam` class.
2. Add an instance method `award_points(self, position)`:
   - 1st place awards 25 points.
   - 2nd place awards 20 points.
   - 3rd place awards 16 points.
   - Any other position awards 0 points.
3. Print a confirmation message showing updated team standing points.

#### Model Solution:
```python
class RaceTeam:
    def __init__(self, name, manufacturer, team_principal):
        self.name = name
        self.manufacturer = manufacturer
        self.team_principal = team_principal
        self.championship_points = 0

    def award_points(self, position):
        points = 0
        if position == 1:
            points = 25
        elif position == 2:
            points = 20
        elif position == 3:
            points = 16
        
        self.championship_points += points
        print(f"{self.name} finished P{position}! Awarded {points} pts. Total Points: {self.championship_points}")

team = RaceTeam("Aprilia Racing", "Aprilia", "Massimo Rivola")
team.award_points(1)
team.award_points(3)
```

---

## 📘 Lesson 1.4: Class Attributes vs. Instance Attributes

### 1. Conceptual Explanation
- **Instance Attributes** are unique to each motorcycle (e.g. `rider`, `current_speed`).
- **Class Attributes** are shared by *every* single motorcycle created from that class. They are defined directly inside the class body, outside of any methods.

In MotoGP, the sole control tire manufacturer is Michelin. Every single team and rider uses Michelin tires. Therefore, the tire manufacturer is a perfect candidate for a **Class Attribute**.

---

### 2. Google Colab-Compatible Code Examples

#### A. Simple Example (Defining and accessing class attributes)
Copy and run this cell to see how class attributes are shared:

```python
class MotoGPBike:
    # CLASS ATTRIBUTE (Constant across all instances)
    SOLE_TIRE_SUPPLIER = "Michelin"

    def __init__(self, rider):
        # INSTANCE ATTRIBUTE (Unique to each bike)
        self.rider = rider

# Create instances
bike_a = MotoGPBike("Francesco Bagnaia")
bike_b = MotoGPBike("Marc Marquez")

# Access class attribute through class or instances
print("Access via Class:", MotoGPBike.SOLE_TIRE_SUPPLIER)
print("Access via Bike A:", bike_a.SOLE_TIRE_SUPPLIER)
print("Access via Bike B:", bike_b.SOLE_TIRE_SUPPLIER)
```

#### B. Medium Example (Modifying class attributes/tracking class-wide state)
Copy and run this cell to see how class attributes track state across all instances:

```python
class MotoGPBike:
    # CLASS ATTRIBUTE (Shared state)
    total_bikes_on_grid = 0

    def __init__(self, rider):
        self.rider = rider
        # Increment the class attribute when a new instance is created
        MotoGPBike.total_bikes_on_grid += 1

# Instantiate multiple bikes
bike1 = MotoGPBike("Fabio Quartararo")
bike2 = MotoGPBike("Brad Binder")
bike3 = MotoGPBike("Maverick Viñales")

print("Total registered grid competitors:", MotoGPBike.total_bikes_on_grid)
```

#### C. Advanced Example (Class Attribute Shadowing and Pitfalls)
Copy and run this cell to understand how shadowing works and how modifying a class attribute affects instances:

```python
class MotoGPBike:
    SOLE_TIRE_SUPPLIER = "Michelin"

    def __init__(self, rider):
        self.rider = rider

bike_a = MotoGPBike("Jorge Martin")
bike_b = MotoGPBike("Enea Bastianini")

# 1. SHADOWING PITFALL: Modifying class attribute via instance does NOT change the class!
# This actually creates a new instance attribute 'SOLE_TIRE_SUPPLIER' on bike_a,
# leaving the class attribute and bike_b's reference untouched.
bike_a.SOLE_TIRE_SUPPLIER = "Pirelli" 
print("Bike A supplier (shadowed):", bike_a.SOLE_TIRE_SUPPLIER)  # "Pirelli"
print("Bike B supplier (original):", bike_b.SOLE_TIRE_SUPPLIER)  # "Michelin"
print("Class supplier (unchanged):", MotoGPBike.SOLE_TIRE_SUPPLIER) # "Michelin"

# 2. CORRECT MODIFICATION: Modify directly via the Class
# This changes it for all instances that don't have a shadowed instance attribute.
MotoGPBike.SOLE_TIRE_SUPPLIER = "Dunlop"
print("\n--- After Class-Level modification ---")
print("Bike A supplier (still shadowed):", bike_a.SOLE_TIRE_SUPPLIER)  # "Pirelli"
print("Bike B supplier (updated class attribute):", bike_b.SOLE_TIRE_SUPPLIER)  # "Dunlop"
print("Class supplier:", MotoGPBike.SOLE_TIRE_SUPPLIER) # "Dunlop"
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Define a class `Rider`.
2. Create a class attribute `GOVERNING_BODY = "FIM"` and `total_active_riders = 0`.
3. In `__init__`, accept `name` and increment `total_active_riders`.
4. Create 3 rider instances and verify class-level tracking.

#### Model Solution:
```python
class Rider:
    GOVERNING_BODY = "FIM"
    total_active_riders = 0

    def __init__(self, name):
        self.name = name
        Rider.total_active_riders += 1

r1 = Rider("Pedro Acosta")
r2 = Rider("Marco Bezzecchi")
r3 = Rider("Fabio Di Giannantonio")

print("Governing Body:", r1.GOVERNING_BODY)
print("Total Active Riders on grid:", Rider.total_active_riders)
```

---

## 📘 Lesson 2.1: Encapsulation (Public, Protected, Private; Getters & Setters)

### 1. Conceptual Explanation
In MotoGP, telemetry data and Electronic Control Unit (ECU) fuel mapping strategies are highly classified secrets. If a rival manufacturer could read or alter your bike's throttle maps directly, it would ruin the competition.

We protect this data using **Encapsulation**.

#### 🎛️ Naming Conventions & Security
1. **Public** (`self.rider`): Accessible by anyone, anywhere.
2. **Protected** (`self._engine_displacement`): Single underscore. Warns other developers: *"Hands off unless you are subclassing."*
3. **Private** (`self.__ecu_fuel_map`): Double underscore. Python actively restricts outside access using **Name Mangling** (renaming it internally to `_ClassName__attributeName`).

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
class TelemetryData:
    def __init__(self, rider):
        self.rider = rider
        self.__lean_angle = 0.0  # Private attribute (double underscore)

    # Getter: Safe way to read lean angle
    def get_lean_angle(self):
        return self.__lean_angle

    # Setter: Safe way to set lean angle with physics check
    def set_lean_angle(self, angle):
        # 64 degrees is the maximum physical limit of traction in modern MotoGP!
        if not isinstance(angle, (int, float)):
            print("Error: Lean angle must be a valid number!")
        elif angle < 0 or angle > 64:
            print("Crash Warning: Cannot exceed 64 degrees lean angle limit!")
        else:
            self.__lean_angle = angle
            print(f"Telemetry updated: Lean angle is now {self.__lean_angle}°")

telemetry = TelemetryData("Jorge Martin")

# Attempting direct access raises AttributeError
try:
    print(telemetry.__lean_angle)
except AttributeError as e:
    print(f"Security active: {e}")

# Safe reading and writing
telemetry.set_lean_angle(58)
print("Lean angle reading:", telemetry.get_lean_angle())
telemetry.set_lean_angle(70)  # Triggers physics limit warning
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Define a class `EngineMap`.
2. Initialize it with a private attribute `__traction_control_level` set to default `3`.
3. Write getter `get_traction_control_level(self)`.
4. Write setter `set_traction_control_level(self, level)` checking that level is an integer between `1` (least intervention) and `5` (most intervention).

#### Model Solution:
```python
class EngineMap:
    def __init__(self):
        self.__traction_control_level = 3

    def get_traction_control_level(self):
        return self.__traction_control_level

    def set_traction_control_level(self, level):
        if not isinstance(level, int) or level < 1 or level > 5:
            print("Invalid setting! Engine Map level must be an integer between 1 and 5.")
        else:
            self.__traction_control_level = level
            print(f"ECU Map Updated: Traction Control set to level {self.__traction_control_level}")

ecu = EngineMap()
ecu.set_traction_control_level(4)
ecu.set_traction_control_level(6)  # Rejects setting
```

---

## 📘 Lesson 2.2: Inheritance (Single & Multi-level, Method Overriding)

### 1. Conceptual Explanation
Designing classes from scratch repeatedly wastes time. In MotoGP, a `MotoGPBike` and a `Moto3Bike` are both forms of a `RacingBike`.

#### 👪 The Power of Inheritance
Inheritance allows us to define standard attributes (`manufacturer`, `weight`) in a parent **Superclass** and inherit them into child **Subclasses**.
- Subclasses can use the `super()` function to run the parent constructor.
- Subclasses can also perform **Method Overriding** to change parent behavior to fit their specific requirements.

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
class RacingBike:
    def __init__(self, manufacturer, engine_cc):
        self.manufacturer = manufacturer
        self.engine_cc = engine_cc

    def activate_launch_control(self):
        print(f"Launch control active. Preparing parent {self.engine_cc}cc start sequence.")

# Subclass inheriting from RacingBike
class MotoGPBike(RacingBike):
    def __init__(self, manufacturer, rider, has_aero_wings):
        # Call parent constructor (all MotoGP bikes run 1000cc engines)
        super().__init__(manufacturer, 1000)
        self.rider = rider
        self.has_aero_wings = has_aero_wings

    # Method Overriding
    def activate_launch_control(self):
        # We can call the parent launch process, then add specialized steps!
        super().activate_launch_control()
        print(f"Engaging mechanical ride-height device. {self.rider} ready to launch!")

gp_bike = MotoGPBike("Ducati", "Francesco Bagnaia", True)
gp_bike.activate_launch_control()
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Create a parent class `RaceSession` with constructor accepting `circuit_name` and a method `start_session(self)` printing `"Session started at [circuit_name]!"`
2. Create a child subclass `QualifyingSession` inheriting from `RaceSession`. Accept parameter `pole_position_target_time`.
3. Override `start_session` to print the parent start message, plus: `"Targeting lap record time: [pole_position_target_time]s!"`
4. Instantiate and test.

#### Model Solution:
```python
class RaceSession:
    def __init__(self, circuit_name):
        self.circuit_name = circuit_name

    def start_session(self):
        print(f"Session started at {self.circuit_name}!")

class QualifyingSession(RaceSession):
    def __init__(self, circuit_name, pole_position_target_time):
        super().__init__(circuit_name)
        self.pole_position_target_time = pole_position_target_time

    def start_session(self):
        super().start_session()
        print(f"Qualifying shootout active! Targeting lap record time: {self.pole_position_target_time}s!")

q2 = QualifyingSession("Mugello", 105.15)
q2.start_session()
```

---

## 📘 Lesson 2.3: Polymorphism (Method Overriding & Duck Typing)

### 1. Conceptual Explanation
**Polymorphism** means "many forms". It allows us to treat different objects as if they were instances of a common class, yet their behaviors will vary depending on their specific class.

#### 🦆 Duck Typing
Python relies heavily on **Duck Typing** ("If it walks like a duck and quacks like a duck, it's a duck"). We don't care about the type or hierarchy of the object—only whether it implements the required method names!

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
# Two separate classes with NO inheritance relationship!
class SlickTire:
    def calculate_grip(self, track_condition):
        if track_condition == "Dry":
            return "Excellent Traction"
        return "Extreme Hydroplaning Hazard! Speed must be reduced."

class WetTire:
    def calculate_grip(self, track_condition):
        if track_condition == "Wet":
            return "Good Drainage & High Wet Traction"
        return "Tire overheating and degrading rapidly!"

# A unified interface function that works on ANY object with a calculate_grip method
def evaluate_tire_performance(tire_object, weather):
    grip_status = tire_object.calculate_grip(weather)
    print(f"Tire Evaluation: Track is {weather} -> Grip Level: {grip_status}")

slick = SlickTire()
wet = WetTire()

evaluate_tire_performance(slick, "Dry")
evaluate_tire_performance(wet, "Dry")
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Create a class `RiderBagnaia` with method `riding_style(self)` printing `"Calculated and ultra-smooth racing lines."`
2. Create a class `RiderMarquez` with method `riding_style(self)` printing `"Aggressive late-braking and rear-wheel steering."`
3. Write a function `analyze_riding_style(rider_object)` that calls `riding_style()` on the passed object.
4. Pass instances of both classes to test duck-typing.

#### Model Solution:
```python
class RiderBagnaia:
    def riding_style(self):
        print("Calculated and ultra-smooth racing lines.")

class RiderMarquez:
    def riding_style(self):
        print("Aggressive late-braking and rear-wheel steering.")

def analyze_riding_style(rider_object):
    rider_object.riding_style()  # Polymorphic call

pecco = RiderBagnaia()
marc = RiderMarquez()

analyze_riding_style(pecco)
analyze_riding_style(marc)
```

---

## 📘 Lesson 2.4: Abstraction (Abstract Base Classes & `abc` module)

### 1. Conceptual Explanation
**Abstraction** hides complex implementation details and exposes only the crucial features. 

#### 🔏 Defining absolute contracts
In MotoGP, governing body regulations require every bike to monitor and transmit standard parameters, but how each manufacturer programs their sensors is up to them. We enforce these mandatory standards using **Abstract Base Classes (ABCs)** via the `abc` module.
- An Abstract Base Class **cannot be instantiated** directly.
- **Abstract Methods** defined using `@abstractmethod` must be implemented by any child class, or Python will raise a `TypeError` at compile-time.

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
from abc import ABC, abstractmethod

# Abstract base class
class TelemetrySensor(ABC):
    @abstractmethod
    def read_sensor_data(self):
        pass

# Concrete subclass 1
class RpmSensor(TelemetrySensor):
    def read_sensor_data(self):
        return 16500  # Engine RPM readout

# Concrete subclass 2
class SpeedSensor(TelemetrySensor):
    def read_sensor_data(self):
        return 354.8  # Speed in km/h

# Attempting to construct the abstract base class fails immediately!
try:
    sensor = TelemetrySensor()
except TypeError as e:
    print(f"Correctly blocked abstract instantiation: {e}")

# Working with concrete subclasses
rpm_sensor = RpmSensor()
speed_sensor = SpeedSensor()
print(f"RPM Sensor: {rpm_sensor.read_sensor_data()} RPM")
print(f"Speed Sensor: {speed_sensor.read_sensor_data()} km/h")
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Import `ABC` and `abstractmethod`.
2. Define abstract class `AerodynamicPart(ABC)` with abstract method `calculate_downforce(self)`.
3. Create concrete subclasses `FrontWinglet` (returns `"Generates 40kg downforce under braking."`) and `TailDiffuser` (returns `"Cleans airflow turbulence behind the rider."`).
4. Test and verify.

#### Model Solution:
```python
from abc import ABC, abstractmethod

class AerodynamicPart(ABC):
    @abstractmethod
    def calculate_downforce(self):
        pass

class FrontWinglet(AerodynamicPart):
    def calculate_downforce(self):
        return "Generates 40kg downforce under braking."

class TailDiffuser(AerodynamicPart):
    def calculate_downforce(self):
        return "Cleans airflow turbulence behind the rider."

wing = FrontWinglet()
diffuser = TailDiffuser()
print("Front Winglet:", wing.calculate_downforce())
print("Tail Diffuser:", diffuser.calculate_downforce())
```

---

## 📘 Lesson 3.1: Class Methods vs. Static Methods

### 1. Conceptual Explanation
Sometimes we need class functions that don't operate on specific object instances. We use two specialized decorators for this:

1. **Class Methods (`@classmethod`)**:
   - First parameter is `cls` (the Class itself).
   - Perfect for **Alternative Constructors** (factory methods) to create objects using parsed data sources.
2. **Static Methods (`@staticmethod`)**:
   - No `self` or `cls` parameters.
   - Resides inside the class purely for organization. Perfect for general calculations and conversions.

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
class TelemetryData:
    def __init__(self, rider, top_speed_kph):
        self.rider = rider
        self.top_speed_kph = top_speed_kph

    # 1. CLASS METHOD: Alternative constructor parsing a CSV record string
    @classmethod
    def from_csv_row(cls, csv_string):
        # Expects: "RiderName,SpeedKPH"
        rider, speed_str = csv_string.split(",")
        return cls(rider.strip(), float(speed_str))

    # 2. STATIC METHOD: A pure unit converter utility helper
    @staticmethod
    def kph_to_mph(speed_kph):
        return speed_kph * 0.621371

# A. Normal Constructor
t1 = TelemetryData("Bagnaia", 361.2)

# B. Alternative Construction via classmethod
t2 = TelemetryData.from_csv_row("Marc Marquez, 358.9")
print(f"Rider Name: {t2.rider} | Top Speed: {t2.top_speed_kph} km/h")

# C. Static utility method usage
print(f"Top Speed in MPH: {TelemetryData.kph_to_mph(t2.top_speed_kph):.2f} mph")
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Define a class `RiderProfile`.
2. Construct it with `name` and `championships` (int).
3. Create a `@classmethod` `from_api_string(cls, data_string)` that accepts a string like `"Acosta:0"` and builds a profile.
4. Create a `@staticmethod` `is_legend(championship_count)` returning `True` if championships >= 5, else `False`.

#### Model Solution:
```python
class RiderProfile:
    def __init__(self, name, championships):
        self.name = name
        self.championships = championships

    @classmethod
    def from_api_string(cls, data_string):
        name, champ_str = data_string.split(":")
        return cls(name.strip(), int(champ_str))

    @staticmethod
    def is_legend(championship_count):
        return championship_count >= 5

r = RiderProfile.from_api_string("Valentino Rossi : 9")
print(f"Rider: {r.name} has {r.championships} championships.")
print("Is legend status?", RiderProfile.is_legend(r.championships))
```

---

## 📘 Lesson 3.2: Property Decorators (`@property`, `@setter`)

### 1. Conceptual Explanation
In Python, writing traditional getters and setters like `get_fuel()` is considered unpythonic. However, protecting and validating attributes remains critical (e.g. you cannot have more than 22 liters of fuel inside a MotoGP tank).

#### 🧬 Python properties to the rescue
The `@property` decorator allows you to define a method but access it **exactly like an attribute** (without parentheses `()`).
- **Getter Property (`@property`)**: Handles data fetching.
- **Setter Property (`@attribute.setter`)**: Intercepts assignments to perform checks and protect the variable.

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
class FuelTank:
    def __init__(self, fuel_liters):
        self._fuel_liters = fuel_liters  # Protected attribute (single underscore)

    # 1. Getter property
    @property
    def fuel_level(self):
        return self._fuel_liters

    # 2. Setter property with validation check
    @fuel_level.setter
    def fuel_level(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError("Fuel amount must be a number!")
        # MotoGP rules restrict tank capacity to exactly 22.0 liters
        if value < 0:
            self._fuel_liters = 0.0
        elif value > 22.0:
            self._fuel_liters = 22.0
            print("Overflow Warning: Capped at maximum MotoGP regulation 22.0L tank limit.")
        else:
            self._fuel_liters = value

# Testing
tank = FuelTank(15.5)
print("Current Fuel:", tank.fuel_level)  # Read like a simple attribute!

tank.fuel_level = 25.0  # Triggers cap logic
print("Fuel Level post-refuel:", tank.fuel_level)
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Create a class `TireTemperature`.
2. Keep protected attribute `self._celsius` inside `__init__`.
3. Create property `temperature` to get/set the value.
4. The setter must ensure temperature stays between `20` and `120` degrees. If input is outside bounds, print warning and cap it.

#### Model Solution:
```python
class TireTemperature:
    def __init__(self, celsius):
        self._celsius = celsius

    @property
    def temperature(self):
        return self._celsius

    @temperature.setter
    def temperature(self, value):
        if value < 20:
            self._celsius = 20
            print("Capped temperature at minimum 20°C ambient threshold.")
        elif value > 120:
            self._celsius = 120
            print("Warning: Tire compound overheating hazard! Capped at 120°C limit.")
        else:
            self._celsius = value

tire = TireTemperature(60)
tire.temperature = 140
print("Current Tire Temp:", tire.temperature)
```

---

## 📘 Lesson 3.3: Magic/Dunder Methods

### 1. Conceptual Explanation
**Dunder Methods** (Double UnderScore hooks) allow your custom objects to integrate with native Python syntax. When you implement these methods, your objects can be printed, added together, or checked for length exactly like native Python lists or numbers!

- `__str__(self)`: Controls print output for humans.
- `__repr__(self)`: Controls developer output for logs.
- `__len__(self)`: Enables using `len(obj)`.
- `__add__(self, other)`: Overloads the `+` operator.

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
class LapTimes:
    def __init__(self, rider, lap_list):
        self.rider = rider
        self.lap_list = lap_list  # List of floats representing lap times in seconds

    # Clean representation when printing
    def __str__(self):
        return f"Race records for {self.rider}: {len(self.lap_list)} timed laps."

    # Debugging representation
    def __repr__(self):
        return f"LapTimes(rider={self.rider!r}, lap_list={self.lap_list!r})"

    # Measuring count of laps run
    def __len__(self):
        return len(self.lap_list)

    # Overloading the + operator to merge two sets of laps!
    def __add__(self, other):
        if not isinstance(other, LapTimes):
            raise TypeError("Can only add another LapTimes instance!")
        combined_laps = self.lap_list + other.lap_list
        return LapTimes(self.rider, combined_laps)

# Testing Dunder methods
session1 = LapTimes("Pecco Bagnaia", [94.5, 94.2])
session2 = LapTimes("Pecco Bagnaia", [93.8, 93.9])

print(session1)          # Triggers __str__
print(repr(session1))    # Triggers __repr__
print("Laps completed:", len(session1)) # Triggers __len__

combined = session1 + session2  # Overloaded addition!
print("Total laps count:", len(combined))
print("Combined laps lists:", combined.lap_list)
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Define a class `ChampionshipPoints`.
2. Accept `rider` and `points` (int) in `__init__`.
3. Implement `__str__` to return `"Rider has points."`
4. Implement `__add__` to combine points from two instances for the same rider (raising a `ValueError` if the riders are different).

#### Model Solution:
```python
class ChampionshipPoints:
    def __init__(self, rider, points):
        self.rider = rider
        self.points = points

    def __str__(self):
        return f"{self.rider}: {self.points} World Championship Points."

    def __add__(self, other):
        if not isinstance(other, ChampionshipPoints):
            raise TypeError("Invalid operations! Must add another ChampionshipPoints instance.")
        if self.rider != other.rider:
            raise ValueError("Error: Cannot add points together for two different riders!")
        return ChampionshipPoints(self.rider, self.points + other.points)

r1 = ChampionshipPoints("Jorge Martin", 25)
r2 = ChampionshipPoints("Jorge Martin", 20)
total = r1 + r2
print(total)
```

---

## 📘 Lesson 3.4: Multiple Inheritance & Method Resolution Order (MRO)

### 1. Conceptual Explanation
Python supports **Multiple Inheritance**, meaning a single class can inherit from more than one parent. 

This introduces the **Diamond Problem** (when both parents define the same method). Python resolves this systematically using the **Method Resolution Order (MRO)** algorithm (specifically C3 Linearization).

#### 🗺️ Look-Up Hierarchy
MRO searches classes from **Left-to-Right** (in the order declared in your class header) and **Depth-First**, ensuring it visits subclasses before parent classes.

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab:

```python
class Aerodynamics:
    def tune_bike(self):
        print("Tuning winglets and ground-effect diffusers for downforce.")

class EngineMapping:
    def tune_bike(self):
        print("Calibrating cylinder ignition timings and fuel maps for torque.")

# Subclass inherits from BOTH parent classes (Left-to-Right order)
class DucatiGPBike(Aerodynamics, EngineMapping):
    def tune_bike(self):
        # Triggering parent method
        super().tune_bike()  # Which one does it call?
        print("GP Bike aerodynamic & engine configuration finalized!")

# Testing MRO resolution
bike = DucatiGPBike()
bike.tune_bike()  # Calls Aerodynamics.tune_bike() because it was listed first!

# Inspecting the exact MRO hierarchy list
print("\nDucatiGPBike MRO Search Path:")
for idx, cls in enumerate(DucatiGPBike.mro()):
    print(f"{idx+1}. {cls}")
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Create a class `RiderSensors` with method `initialize(self)` printing `"Calibrating heart rate and suit airbag telemetry."`
2. Create a class `BikeSensors` with method `initialize(self)` printing `"Calibrating suspension pots and wheel speed logs."`
3. Create a class `CompleteTelemetrySystem` inheriting from both. Call `super().initialize()` inside its `initialize()` method.
4. Check the resulting behavior and output the MRO list.

#### Model Solution:
```python
class RiderSensors:
    def initialize(self):
        print("Calibrating heart rate and suit airbag telemetry.")

class BikeSensors:
    def initialize(self):
        print("Calibrating suspension pots and wheel speed logs.")

class CompleteTelemetrySystem(RiderSensors, BikeSensors):
    def initialize(self):
        super().initialize()
        print("Central telemetry bridge online.")

telemetry = CompleteTelemetrySystem()
telemetry.initialize()
print("\nMRO:")
print(CompleteTelemetrySystem.mro())
```

---

## 📘 Lesson 3.5: Introduction to Metaclasses

### 1. Conceptual Explanation
Classes themselves are objects. If a class is an object, then there must be another class that designs and creates it. That class is called a **Metaclass** (a class of a class).
- By default, Python uses a built-in metaclass named `type` to construct all classes.
- We can create a custom metaclass to intercept, validate, or auto-configure class definitions **at compile time** (when Python first imports/reads the code, long before any objects are instantiated).

---

### 2. Google Colab-Compatible Code Example
Copy and run this cell in Google Colab. This metaclass automatically inspects class definitions to ensure that MotoGP manufacturers always enforce a standard safety check procedure:

```python
class EnforceSafetyCheckMeta(type):
    def __new__(cls, name, bases, attrs):
        # We intercept class creation to verify a safety_check method exists
        if "safety_check" not in attrs:
            raise TypeError(f"Regulation Violation: Class '{name}' must define a 'safety_check' method to compile!")
        return super().__new__(cls, name, bases, attrs)

# A. This class compiles successfully!
class YamahaTeam(metaclass=EnforceSafetyCheckMeta):
    def safety_check(self):
        print("Brake pressure & steering head bearings checked.")

# B. This class fails to import/compile immediately upon definition
try:
    type('RogueManufacturer', (object,), {}, metaclass=EnforceSafetyCheckMeta)
except TypeError as e:
    print(f"Compliance validation intercept success: {e}")
```

---

### 3. Practice Exercise & Model Solution

#### Task:
1. Create a metaclass `EnforceDocstringsMeta` inheriting from `type`.
2. Override `__new__(cls, name, bases, attrs)`.
3. Loop through attributes and verify every method (`callable(value)`) has a docstring (`value.__doc__` is not `None`). If not, raise `TypeError`.
4. Define a class `CompliantTeam` with the metaclass and a method with a docstring. Verify it compiles.

#### Model Solution:
```python
class EnforceDocstringsMeta(type):
    def __new__(cls, name, bases, attrs):
        for attr_name, value in attrs.items():
            if callable(value):
                if not value.__doc__ or not value.__doc__.strip():
                    raise TypeError(f"Regulation Error: Method '{attr_name}' in class '{name}' must have a docstring!")
        return super().__new__(cls, name, bases, attrs)

# Succeeds
class CompliantTeam(metaclass=EnforceDocstringsMeta):
    def run_tests(self):
        """Runs essential dyno calibrations on the engine chassis."""
        return True

print("CompliantTeam loaded successfully!")
```

---

## 🎉 Graduation: Master of Python OOP (MotoGP Championship Class)

Congratulations! You have completed the entire custom Python Object-Oriented Programming curriculum, journeying all the way from classes and objects to advanced meta-programming architectures under the MotoGP theme.

You are now equipped with the engineering principles needed to develop high-performance, clean, and modular Python programs. Keep your tires warm, your lines smooth, and happy coding!
