# Encapsulation in Python (Simplified Guide)

> **Source Article:** [GeeksforGeeks - Encapsulation in Python](https://www.geeksforgeeks.org/python/encapsulation-in-python/)

Encapsulation is one of the core foundation pillars of Object-Oriented Programming (OOP).

---

## 💊 Real-World Analogy: The Capsule
Think of a medical capsule (pill). It wraps various medicine powders inside a single protective outer shell.
- You don't interact with the individual powders directly.
- You swallow the capsule, and it safely delivers the medicine.
- In Python, a **Class** is the capsule, wrapping **Data (variables)** and **Actions (methods)** together into a single unit.

---

## 📌 Chunk 1: What is Encapsulation?

### Simple Explanation
Encapsulation means **wrapping data (variables) and methods (functions) into a single container (a Class)** and restricting direct access to some of the object's components.

### Why do we use it?
1. **Data Hiding & Security:** Keeps secret or sensitive data hidden from external interference.
2. **Data Integrity:** Prevents accidental corruption of variables by enforcing validation checks.
3. **Abstraction:** Exposes *what* a class does, while hiding *how* it does it.

### Code Example: Introductory Concept
```python
class Employee:
    def __init__(self, name, salary):
        self.name = name          # Public attribute (anyone can see/change)
        self.__salary = salary    # Private attribute (hidden from outside)

emp = Employee("Fedrick", 50000)

# Accessing Public Variable
print(emp.name)      # Output: Fedrick

# Trying to access Private Variable directly
print(emp.__salary)  # Raises AttributeError!
```

### What happened here?
- `name` is public, so Python lets you read it directly.
- `__salary` starts with a double underscore (`__`), making it **private**. Python blocks direct outside access to protect it.

---

## 🛡️ Chunk 2: Why Do We Need Encapsulation?

Imagine a Bank Account:
- If your account balance were an open variable, anyone could write `account.balance = 1000000` or `account.balance = -500`.
- With encapsulation, `balance` is hidden. You can only deposit or withdraw through specific methods that check if the transaction is valid!

### Core Benefits:
| Benefit | What it means in plain English |
| :--- | :--- |
| **Data Protection** | Prevents unauthorized modifications from outside code. |
| **Validation Control** | Allows setter methods to reject invalid values (e.g., negative salary). |
| **Modularity** | Keeps class logic organized in one place. |
| **Maintainability** | You can change internal implementation details without breaking external code. |

---

## 🔑 Chunk 3: Access Specifiers in Python

Access specifiers control who can see or change variables/methods in a class.

Python offers **3 levels of access**:
1. **Public Members**
2. **Protected Members**
3. **Private Members**

---

### 1. Public Members
- **Syntax:** Normal variable name (`self.name`).
- **Visibility:** Accessible from anywhere (inside class, subclasses, and outside objects).
- **Default Behavior:** In Python, all variables and methods are public by default.

```python
class Employee:
    def __init__(self, name):
        self.name = name  # Public variable

    def display_name(self):  # Public method
        print(self.name)

emp = Employee("John")
emp.display_name()  # Output: John
print(emp.name)     # Output: John (Directly accessible)
```

---

### 2. Protected Members
- **Syntax:** Single underscore prefix (`self._age`).
- **Visibility:** Intended to be accessed **only within the class and its subclasses (child classes)**.
- **Python Reality:** Python does **not** strictly enforce protected access. The single underscore `_` is a **convention** (a standard agreement among programmers meaning: *"Please don't touch this outside this class family"*).

```python
class Employee:
    def __init__(self, name, age):
        self.name = name
        self._age = age  # Protected attribute (convention)

class SubEmployee(Employee):
    def show_age(self):
        # Accessible in child class
        print(f"Age: {self._age}")

emp = SubEmployee("Ross", 30)
print(emp.name)     # Output: Ross
emp.show_age()      # Output: Age: 30
```

---

### 3. Private Members
- **Syntax:** Double underscore prefix (`self.__salary`).
- **Visibility:** Accessible **ONLY inside the class** where it is defined.
- **Python Mechanism (Name Mangling):** Python renames `__salary` internally to `_ClassName__salary` to prevent accidental direct access.

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.__salary = salary  # Private attribute

    def show_salary(self):
        # Accessible inside the class method
        print(f"Salary: {self.__salary}")

emp = Employee("Robert", 60000)
print(emp.name)        # Output: Robert
emp.show_salary()      # Output: Salary: 60000

# Direct access fails:
# print(emp.__salary)  # Error: AttributeError

# Name Mangling bypass (Not recommended, but possible in Python!):
print(emp._Employee__salary)  # Output: 60000
```

---

## ⚙️ Chunk 4: Protected & Private Methods

Just like attributes (variables), **methods (functions inside a class)** can also be public, protected, or private.

- **Protected Method (`_method()`):** Meant for internal or subclass use.
- **Private Method (`__method()`):** Accessible only inside the class itself.

### Code Example: Bank Account System
```python
class BankAccount:
    def __init__(self):
        self.balance = 1000  # Initial balance

    def _show_balance(self):
        # Protected method: Internal / subclass reporting
        print(f"Balance: ₹{self.balance}")

    def __update_balance(self, amount):
        # Private method: Internal state update logic
        self.balance += amount

    def deposit(self, amount):
        # Public method: Safe entry point for user actions
        if amount > 0:
            self.__update_balance(amount)  # Calls private method
            self._show_balance()           # Calls protected method
        else:
            print("Invalid deposit amount!")

account = BankAccount()
account.deposit(500)
# Output:
# Balance: ₹1000
# Balance: ₹1500
```

---

## 🎛️ Chunk 5: Getter and Setter Methods

Because private variables cannot be accessed directly from outside, we use **Getter** and **Setter** methods to safely inspect and modify them.

- **Getter (`get_...`):** Returns the private value.
- **Setter (`set_...`):** Updates the private value after applying validation rules.

### Code Example
```python
class Employee:
    def __init__(self):
        self.__salary = 50000  # Private attribute

    # Getter Method: Reads data safely
    def get_salary(self):
        return self.__salary

    # Setter Method: Modifies data safely with validation
    def set_salary(self, amount):
        if amount > 0:
            self.__salary = amount
        else:
            print("Invalid salary amount!")

emp = Employee()

# Read salary using getter
print(emp.get_salary())  # Output: 50000

# Try setting valid salary
emp.set_salary(60000)
print(emp.get_salary())  # Output: 60000

# Try setting invalid salary
emp.set_salary(-1000)    # Output: Invalid salary amount!
```

---

## 💡 Summary Cheat Sheet

| Concept | Syntax | Access Location | Python Enforcement |
| :--- | :--- | :--- | :--- |
| **Public** | `name` | Everywhere | Unrestricted |
| **Protected** | `_name` | Class & Subclasses | Convention only (developer hint) |
| **Private** | `__name` | Class only | Name Mangling (`_Class__name`) |
| **Getter** | `get_val()` | Outside / Inside | Reads private variable |
| **Setter** | `set_val(x)` | Outside / Inside | Updates private variable with validation |
