<span id="top"></span>

# Data Abstraction in Python — Comprehensive Chunk-by-Chunk Guide

> **Source Article:** [GeeksforGeeks - Data Abstraction in Python](https://www.geeksforgeeks.org/python/data-abstraction-in-python/)  
> **Topic:** Object-Oriented Programming (OOP) in Python — Data Abstraction & Abstract Base Classes (ABCs)  
> **Domain Focus:** Computational Linear Algebra & Vector Space Transformations  
> **User Prompt:** "reexplain the following article chunk by chunk, easy to understand and coherence example in linear algebra study cases: https://www.geeksforgeeks.org/python/data-abstraction-in-python/"

---

## 📚 Table of Contents
1. [📐 Real-World & Conceptual Intuition](#real-world-intuition)
2. [📌 Chunk 1: What is Data Abstraction & Why Use It?](#chunk-1)
3. [🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module](#chunk-2)
4. [🧩 Chunk 3: The Four Core Building Blocks of Abstraction](#chunk-3)
   - [1. Abstract Methods (`@abstractmethod`)](#abstract-methods)
   - [2. Concrete Methods (Shared Implementation)](#concrete-methods)
   - [3. Abstract Properties (`@property` + `@abstractmethod`)](#abstract-properties)
   - [4. Abstract Class Instantiation Safeguards](#instantiation-safeguards)
5. [🏆 Chunk 4: Complete Computational Linear Algebra Architecture](#chunk-4)
6. [📊 Chunk 5: Summary Comparison & Key Takeaways](#chunk-5)

---

<span id="real-world-intuition"></span>
## 📐 Real-World & Conceptual Intuition

### The High-Level Vector Transformation vs. Underlying Matrix Storage
In computational mathematics, machine learning (e.g., neural network forward passes, PCA), computer graphics, and physics simulations:
- The **High-Level Algorithm** (such as an iterative linear solver, a 3D graphics renderer, or a principal component extractor) only cares about the mathematical behavior of a **Linear Transformation** $T: \mathbb{R}^n \to \mathbb{R}^m$:
  $$\mathbf{y} = T(\mathbf{x}) = A\mathbf{x}$$
- The algorithm does **not** need to know whether matrix $A$ is:
  - An explicit dense 2D floating-point array stored in contiguous RAM,
  - A compressed sparse structure (like CSR or COO) storing only non-zero coordinates to save gigabytes of memory,
  - A diagonal matrix where transformation is a simple $O(n)$ element-wise scalar product, or
  - An implicit matrix-free analytical operator (such as a 2D/3D rotation by angle $\theta$ using trigonometric formulas without storing any grid).
- **That is Abstraction:** Exposing a clean, unified contract (`matvec(x)`, `shape`, `compute_residual()`) to algorithms while fully encapsulating and hiding the underlying data structures and specialized arithmetic underneath.

```
┌────────────────────────────────────────────────────────────────────────┐
│             NUMERICAL ALGORITHMS / ML PIPELINES / GRAPHICS             │
│       [Apply Transformation A*x]   [Compute Residual]   [Eigenvalues]  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Calls Standard Abstract Interface)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ABSTRACT CONTRACT (LinearOperator)                   │
│   + matvec(x)   + shape   + compute_residual(x, b)   + is_square       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Implemented by Subclasses)
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
│      DenseMatrix      │ │    DiagonalMatrix │ │     SparseCSRMatrix   │
│ - Full 2D List/Array  │ │ - 1D Diagonal Vec │ │ - Values & ColIndices │
│ - O(n^2) Dot Products │ │ - O(n) Scaling    │ │ - Row Pointer Array   │
│ - Dense Cache Layout  │ │ - Zero Overhead   │ │ - O(nnz) Sparse Math  │
└───────────────────────┘ └───────────────────┘ └───────────────────────┘
```

[🔝 Back to Top](#top)

---

<span id="chunk-1"></span>
## 📌 Chunk 1: What is Data Abstraction & Why Use It?

### 1. Simple Definition
**Data Abstraction** is the OOP paradigm of **hiding internal representation details** (e.g., memory layouts, index arithmetic, storage compression) and exposing only the essential interface to the outside caller. It cleanly decouples **what** mathematical operation an object performs from **how** it computes or stores that operation.

### 2. Linear Algebra Analogy
In linear algebra, a **linear mapping** (or linear operator) $T: V \to W$ between two vector spaces preserves addition and scalar multiplication:

$$T(\alpha \mathbf{u} + \beta \mathbf{v}) = \alpha T(\mathbf{u}) + \beta T(\mathbf{v})$$

When an iterative numerical algorithm—such as the **Conjugate Gradient Method**, **Power Iteration for Eigenvalues**, or a **Linear System Solver** $A\mathbf{x} = \mathbf{b}$—runs:
- It asks the operator to compute the vector-matrix product $A\mathbf{x}$.
- It asks for the structural dimension of the space (e.g., `shape = (n, n)`).
- It asks for the residual error vector $\mathbf{r} = \mathbf{b} - A\mathbf{x}$.
- The algorithm does **not care** if $A$ is a 10,000-by-10,000 dense array requiring 800 MB of RAM or a tridiagonal finite-difference stencil requiring just 3 vectors.
- **That is Abstraction:** A unified interface shared across wildly distinct mathematical structures.

### 3. Core Benefits of Abstraction
| Benefit | Explanation | Computational Linear Algebra Analogy |
| :--- | :--- | :--- |
| **Complexity Reduction** | Hides pointer indirection, stride offsets, and sparse coordinate lists. | The caller writes `y = op.matvec(x)`; the internal class handles index bounds and sparse pointer arithmetic. |
| **Contract Enforcement** | Guarantees every operator implements crucial linear algebra operations. | Mathematical theorems require every operator to expose its dimension `shape` and linear action `matvec()`. |
| **Maintainability** | Switch matrix representations without breaking client algorithms. | Swap a naive `DenseMatrix` with a memory-efficient `SparseCSRMatrix` without changing a single line in your eigensolver. |
| **Polymorphic Pipelines** | Enables algorithms to treat heterogeneous operators identically. | An iterative solver loops through dense, diagonal, and sparse operators using the exact same method invocations. |

[🔝 Back to Top](#top)

---

<span id="chunk-2"></span>
## 🏛️ Chunk 2: Abstract Base Classes (ABC) and the `abc` Module

Python does not possess built-in `interface` or `pure virtual` keywords like Java or C++. Instead, Python provides the standard library **`abc` module** (Abstract Base Classes).

### Key Rules:
1. **Inherit from `ABC`:** A class must inherit from `abc.ABC` to become an Abstract Base Class.
2. **The `@abstractmethod` Decorator:** Declares that a method has no implementation in the base class and **must be implemented** by any concrete subclass.
3. **No Direct Instantiation:** If a class inherits from `ABC` and contains at least one `@abstractmethod`, Python prevents creating an instance of that class directly.

### Linear Algebra Syntax Example:
```python
from abc import ABC, abstractmethod

# Abstract Base Class (Blueprint for all Vector Transformations)
class VectorTransform(ABC):
    @abstractmethod
    def transform(self, vector: list[float]) -> list[float]:
        """Mandatory contract: Every linear map must define how it maps an input vector."""
        pass

# Concrete Subclass (Uniform Scaling Operator in R^n)
class UniformScale(VectorTransform):
    def __init__(self, scalar: float):
        self.scalar = scalar

    def transform(self, vector: list[float]) -> list[float]:
        return [self.scalar * x for x in vector]

# Creating an instance of the concrete subclass
scaler = UniformScale(scalar=2.5)
v = [1.0, -3.0, 4.0]
print(f"Original vector: {v}")
print(f"Scaled vector:   {scaler.transform(v)}")
```

#### Output:
```text
Original vector: [1.0, -3.0, 4.0]
Scaled vector:   [2.5, -7.5, 10.0]
```

[🔝 Back to Top](#top)

---

<span id="chunk-3"></span>
## 🧩 Chunk 3: The Four Core Building Blocks of Abstraction

---

<span id="abstract-methods"></span>
### 1. Abstract Methods (`@abstractmethod`)

An **Abstract Method** is declared inside the abstract base class with a method header and a `pass` statement (or docstring, without operational body). It acts as an unbreakable contract: every derived subclass **must** provide its own specific implementation, or Python will refuse to instantiate it.

#### Linear Algebra Introductory Example:
```python
from abc import ABC, abstractmethod

# Abstract Blueprint for Linear Operators in Vector Spaces
class LinearOperator(ABC):
    @abstractmethod
    def matvec(self, x: list[float]) -> list[float]:
        """Mandatory: Every operator must implement matrix-vector multiplication A*x."""
        pass

# Concrete Implementation: 2D Reflection across the X-axis: T([x, y]) = [x, -y]
class ReflectionX2D(LinearOperator):
    def matvec(self, x: list[float]) -> list[float]:
        return [x[0], -x[1]]

reflector = ReflectionX2D()
v = [3.0, 4.0]
print(f"Reflected vector of {v} across x-axis: {reflector.matvec(v)}")
```

#### Output:
```text
Reflected vector of [3.0, 4.0] across x-axis: [3.0, -4.0]
```

---

<details>
<summary>📐 <b>Linear Algebra Case Study: Coordinate Matrix-Vector Multiplication ($A\mathbf{x}$)</b> (Click to expand)</summary>

#### 🤖 Scenario: Enforcing Coordinate Transformation Contracts
In linear algebra, any explicit matrix $A \in \mathbb{R}^{m \times n}$ acts on a vector $\mathbf{x} \in \mathbb{R}^n$ to yield a transformed vector $\mathbf{y} \in \mathbb{R}^m$ through the dot product of each row with $\mathbf{x}$:

$$y_i = \sum_{j=1}^{n} A_{ij} x_j$$

Because different matrix types (dense grids, diagonal vectors, sparse indices) execute this product with distinct data structures, the base class `MatrixOperator` defines `apply()` as an **abstract method**.

---

#### ❌ Broken Code (The Problem)
A developer creates `DenseMatrix` inheriting from `MatrixOperator`, stores the 2D array, but **forgets to implement** the mandatory `apply()` method:

```python
from abc import ABC, abstractmethod

class MatrixOperator(ABC):
    def __init__(self, rows: int, cols: int):
        self.rows = rows
        self.cols = cols

    @abstractmethod
    def apply(self, vector: list[float]) -> list[float]:
        """Mandatory: Every matrix must define its vector transformation A*x."""
        pass

# ❌ INCOMPLETE SUBCLASS: Forgot apply()
class DenseMatrix(MatrixOperator):
    def __init__(self, data: list[list[float]]):
        rows = len(data)
        cols = len(data[0]) if rows > 0 else 0
        super().__init__(rows=rows, cols=cols)
        self.data = data

    # BUG: Developer forgot to implement apply()!

# Attempting to instantiate the matrix
matrix = DenseMatrix(data=[[1.0, 2.0], [3.0, 4.0]])
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class DenseMatrix without an implementation for abstract method 'apply'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Contract Established:** `MatrixOperator` defined `apply()` decorated with `@abstractmethod`.
2. **Missing Implementation:** `DenseMatrix` inherited from `MatrixOperator` but provided no implementation for `apply()`.
3. **Instantiation Guard:** Python's metaclass detected the missing abstract method during `DenseMatrix(...)` instantiation and immediately raised a `TypeError`.

---

#### ✅ Fixed Code (The Solution)
Implement `apply()` inside `DenseMatrix` with proper vector length checks and inner dot products:

```python
from abc import ABC, abstractmethod

class MatrixOperator(ABC):
    def __init__(self, rows: int, cols: int):
        self.rows = rows
        self.cols = cols

    @abstractmethod
    def apply(self, vector: list[float]) -> list[float]:
        """Mandatory: Every matrix must define its vector transformation A*x."""
        pass

# ✅ FULLY COMPLIANT SUBCLASS
class DenseMatrix(MatrixOperator):
    def __init__(self, data: list[list[float]]):
        rows = len(data)
        cols = len(data[0]) if rows > 0 else 0
        super().__init__(rows=rows, cols=cols)
        self.data = data

    def apply(self, vector: list[float]) -> list[float]:
        if len(vector) != self.cols:
            raise ValueError(f"Dimension mismatch: Vector length {len(vector)} != Matrix columns {self.cols}")
        # Standard row-vector dot products
        return [sum(self.data[i][j] * vector[j] for j in range(self.cols)) for i in range(self.rows)]

# Instantiate and execute
matrix = DenseMatrix(data=[[1.0, 2.0], [3.0, 4.0]])
x = [5.0, 6.0]
result = matrix.apply(x)
print(f"Matrix shape: {matrix.rows}x{matrix.cols}")
print(f"A * x = {result}")
```

#### 🎉 Output:
```text
Matrix shape: 2x2
A * x = [17.0, 39.0]
```

</details>

[🔝 Back to Top](#top)

---

<span id="concrete-methods"></span>
### 2. Concrete Methods (Shared Implementation)

An Abstract Base Class is **not limited** to empty abstract declarations. It can contain **Concrete Methods**—methods with fully functional, shared logic. All derived child classes inherit this code automatically, preventing error-prone code duplication.

#### Linear Algebra Introductory Example:
```python
import math
from abc import ABC, abstractmethod

class VectorSpace(ABC):
    # Abstract Method (Dimension depends on specific space)
    @abstractmethod
    def basis_dimension(self) -> int:
        pass

    # Concrete Method: Standard Euclidean L2 Norm ||v||_2 = sqrt(sum(v_i^2))
    def compute_l2_norm(self, vector: list[float]) -> float:
        return math.sqrt(sum(v ** 2 for v in vector))

class Euclidean3D(VectorSpace):
    def basis_dimension(self) -> int:
        return 3

space = Euclidean3D()
v = [3.0, 4.0, 0.0]
print(f"Space Dimension: {space.basis_dimension()}")
print(f"Euclidean L2 Norm of {v}: {space.compute_l2_norm(v)}")
```

#### Output:
```text
Space Dimension: 3
Euclidean L2 Norm of [3.0, 4.0, 0.0]: 5.0
```

---

<details>
<summary>📐 <b>Linear Algebra Case Study: Standardized Residual & Error Tracking ($\mathbf{r} = \mathbf{b} - A\mathbf{x}$)</b> (Click to expand)</summary>

#### 🤖 Scenario: Universal Linear System Residuals
When solving a system of linear equations $A\mathbf{x} = \mathbf{b}$ in numerical linear algebra, every solver evaluates candidate solution accuracy via the **residual vector** $\mathbf{r}$ and its **$L_2$ Euclidean norm**:

$$\mathbf{r} = \mathbf{b} - A\mathbf{x}, \quad \|\mathbf{r}\|_2 = \sqrt{\sum_{i=1}^{m} r_i^2}$$

Because this formula is mathematically identical regardless of whether $A$ is dense, diagonal, or sparse, implementing it once in the abstract base class as a **concrete method** guarantees that all linear operators calculate residuals and norms with identical numerical consistency.

---

#### ❌ Broken Code (The Problem)
A developer creating `DiagonalLinearOperator` decides to write a custom `compute_residual()` method, but changes the argument signature and forgets to calculate the square root in the norm:

```python
from abc import ABC, abstractmethod

class LinearSystemOperator(ABC):
    @abstractmethod
    def matvec(self, x: list[float]) -> list[float]:
        pass

    # Concrete Method: Universal Residual Engine
    def compute_residual(self, x: list[float], b: list[float]) -> tuple[list[float], float]:
        ax = self.matvec(x)
        residual = [b_i - ax_i for b_i, ax_i in zip(b, ax)]
        norm = sum(r ** 2 for r in residual) ** 0.5
        return residual, norm

class DiagonalLinearOperator(LinearSystemOperator):
    def __init__(self, diagonal: list[float]):
        self.diagonal = diagonal

    def matvec(self, x: list[float]) -> list[float]:
        return [d * xi for d, xi in zip(self.diagonal, x)]

    # ❌ BROKEN OVERRIDE: Altered parameter signature!
    def compute_residual(self, error_vector_only: list[float]) -> float:
        return sum(e ** 2 for e in error_vector_only)

# Numerical solver interacts via standard (x, b) signature
diag_op = DiagonalLinearOperator(diagonal=[2.0, 5.0, 10.0])
x_guess = [1.0, 1.0, 1.0]
b_target = [2.0, 5.0, 10.0]

# Standard solver call -> CRASH
print(diag_op.compute_residual(x_guess, b_target))
```

#### 💥 Error Output:
```text
TypeError: DiagonalLinearOperator.compute_residual() takes 2 positional arguments but 3 were given
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Reinventing Standard Math:** The base class already provided a verified, generic `compute_residual(x, b)`.
2. **Signature Corruption:** The subclass altered the parameter list, breaking polymorphic compatibility with the linear solver engine.
3. **Concrete Method Principle:** Subclasses should inherit standard mathematical algorithms rather than overriding them needlessly.

---

#### ✅ Fixed Code (The Solution)
Remove the redundant override in `DiagonalLinearOperator` and let it seamlessly inherit the concrete residual engine from `LinearSystemOperator`:

```python
import math
from abc import ABC, abstractmethod

class LinearSystemOperator(ABC):
    @abstractmethod
    def matvec(self, x: list[float]) -> list[float]:
        pass

    # Concrete Method 1: Standardized Vector L2 Norm
    def vector_norm(self, v: list[float]) -> float:
        return math.sqrt(sum(val ** 2 for val in v))

    # Concrete Method 2: Universal Residual and Relative Error
    def compute_residual(self, x: list[float], b: list[float]) -> tuple[list[float], float, float]:
        ax = self.matvec(x)
        residual = [b_i - ax_i for b_i, ax_i in zip(b, ax)]
        res_norm = self.vector_norm(residual)
        b_norm = self.vector_norm(b)
        rel_error = (res_norm / b_norm) if b_norm > 0 else 0.0
        return residual, round(res_norm, 4), round(rel_error, 4)

# Clean Subclass: Inherits concrete numerical math effortlessly
class DiagonalLinearOperator(LinearSystemOperator):
    def __init__(self, diagonal: list[float]):
        self.diagonal = diagonal

    def matvec(self, x: list[float]) -> list[float]:
        return [d * xi for d, xi in zip(self.diagonal, x)]

# Testing inherited functionality
diag_op = DiagonalLinearOperator(diagonal=[2.0, 5.0, 10.0])
x_approx = [1.0, 0.8, 1.1]
b_exact = [2.0, 5.0, 10.0]

res_vec, res_norm, rel_err = diag_op.compute_residual(x=x_approx, b=b_exact)
print(f"A * x: {diag_op.matvec(x_approx)}")
print(f"Target b: {b_exact}")
print(f"Residual Vector: {res_vec}")
print(f"Residual L2 Norm ||r||_2: {res_norm}")
print(f"Relative Error ||r||/||b||: {rel_err}")
```

#### 🎉 Output:
```text
A * x: [2.0, 4.0, 11.0]
Target b: [2.0, 5.0, 10.0]
Residual Vector: [0.0, 1.0, -1.0]
Residual L2 Norm ||r||_2: 1.4142
Relative Error ||r||/||b||: 0.1246
```

</details>

[🔝 Back to Top](#top)

---

<span id="abstract-properties"></span>
### 3. Abstract Properties (`@property` + `@abstractmethod`)

Just as methods can be enforced, Python enables enforcing **getter properties**. In linear algebra, this ensures that every concrete operator explicitly declares its mathematical dimensions, matrix rank, or structural properties.

> [!IMPORTANT]
> **Decorator Order Matters:** Always place `@property` on the **outside** and `@abstractmethod` on the **inside**:
> ```python
> @property
> @abstractmethod
> def shape(self) -> tuple[int, int]:
>     pass
> ```

#### Linear Algebra Introductory Example:
```python
from abc import ABC, abstractmethod

class LinearMap(ABC):
    @property
    @abstractmethod
    def shape(self) -> tuple[int, int]:
        """Mandatory: Returns (rows, cols) representing operator dimensions."""
        pass

class IdentityMatrix3D(LinearMap):
    @property
    def shape(self) -> tuple[int, int]:
        return (3, 3)

ident = IdentityMatrix3D()
print(f"Operator Dimensions: {ident.shape}")
```

#### Output:
```text
Operator Dimensions: (3, 3)
```

---

<details>
<summary>📐 <b>Linear Algebra Case Study: Matrix Dimensions & Subspace Compatibility</b> (Click to expand)</summary>

#### 🤖 Scenario: Shape Invariance in Matrix-Vector Algebra
In linear algebra, matrix-vector multiplication $A\mathbf{x}$ is defined if and only if:

$$\text{columns}(A) = \text{dimension}(\mathbf{x})$$

To guard against dimension mismatches in mathematical pipelines, every linear operator must expose its structural `shape` as `(rows, cols)` and a descriptive `operator_name`.

---

#### ❌ Broken Code (The Problem)
A developer implements `SparseCoordinateMatrix` to store sparse non-zero coordinates `(row, col, value)`, but forgets to implement the required `shape` property:

```python
from abc import ABC, abstractmethod

class LinearOperator(ABC):
    @property
    @abstractmethod
    def shape(self) -> tuple[int, int]:
        """Returns (rows, cols) representing the dimension of the operator."""
        pass

    @property
    @abstractmethod
    def operator_name(self) -> str:
        """Returns the descriptive name of the linear operator."""
        pass

class SparseCoordinateMatrix(LinearOperator):
    def __init__(self, name: str, entries: list[tuple[int, int, float]]):
        self._name = name
        self.entries = entries

    # Developer implemented operator_name...
    @property
    def operator_name(self) -> str:
        return self._name

    # ❌ BUG: Forgot to implement the abstract property 'shape'!

# Attempting to instantiate the sparse operator
sparse_op = SparseCoordinateMatrix(name="Laplacian-COO", entries=[(0, 0, 2.0), (1, 1, 2.0)])
```

#### 💥 Error Output:
```text
TypeError: Can't instantiate abstract class SparseCoordinateMatrix without an implementation for abstract method 'shape'
```

---

#### 🔍 Step-by-Step Breakdown:
1. **Property Declared:** `LinearOperator` required `shape` via `@property` and `@abstractmethod`.
2. **Missing Property:** `SparseCoordinateMatrix` omitted `shape`.
3. **Compile/Instantiation Guard:** Python caught the missing contract member before the object could cause dimension errors in a solver.

---

#### ✅ Fixed Code (The Solution)
Implement both abstract properties using `@property`:

```python
from abc import ABC, abstractmethod

class LinearOperator(ABC):
    @property
    @abstractmethod
    def shape(self) -> tuple[int, int]:
        """Returns (rows, cols) representing the dimension of the operator."""
        pass

    @property
    @abstractmethod
    def operator_name(self) -> str:
        """Returns the descriptive name of the linear operator."""
        pass

class SparseCoordinateMatrix(LinearOperator):
    def __init__(self, name: str, rows: int, cols: int, entries: list[tuple[int, int, float]]):
        self._name = name
        self._rows = rows
        self._cols = cols
        self.entries = entries

    @property
    def shape(self) -> tuple[int, int]:
        return (self._rows, self._cols)

    @property
    def operator_name(self) -> str:
        return self._name

# Instantiating and querying properties
sparse_op = SparseCoordinateMatrix(
    name="Laplacian-COO",
    rows=4,
    cols=4,
    entries=[(0, 0, 2.0), (1, 1, 2.0), (2, 2, 2.0), (3, 3, 2.0)]
)

print(f"Operator: {sparse_op.operator_name}")
print(f"Shape: {sparse_op.shape}")
print(f"Stored Non-Zero Count: {len(sparse_op.entries)}")
```

#### 🎉 Output:
```text
Operator: Laplacian-COO
Shape: (4, 4)
Stored Non-Zero Count: 4
```

</details>

[🔝 Back to Top](#top)

---

<span id="instantiation-safeguards"></span>
### 4. Abstract Class Instantiation Safeguards

An Abstract Base Class containing abstract members **cannot be instantiated directly**. Attempting to do so triggers a `TypeError`.

#### Why Does Python Enforce This?
An abstract class is an **incomplete mathematical blueprint**. For instance, an abstract `LinearOperator` knows that it maps vectors, but has no data structure (no 2D array, no diagonal entries, no sparse coordinates). Allowing a raw `LinearOperator()` instance would cause runtime crashes whenever `matvec()` is called.

```python
from abc import ABC, abstractmethod

class LinearOperator(ABC):
    @abstractmethod
    def matvec(self, x: list[float]) -> list[float]:
        pass

# ❌ Direct instantiation attempt:
try:
    generic_operator = LinearOperator()
except TypeError as error:
    print(f"Captured Error: {error}")
```

#### Output:
```text
Captured Error: Can't instantiate abstract class LinearOperator without an implementation for abstract method 'matvec'
```

[🔝 Back to Top](#top)

---

<span id="chunk-4"></span>
## 🏆 Chunk 4: Complete Computational Linear Algebra Architecture

Here is a complete, production-grade Object-Oriented architecture integrating **Abstract Methods**, **Concrete Methods**, **Abstract Properties**, and **Polymorphic Numerical Algorithms**.

It models four fundamentally distinct mathematical linear operators:
1. **`DenseMatrix`**: Stored as an explicit 2D floating array with $O(mn)$ dot products.
2. **`DiagonalMatrix`**: Stored as a single 1D diagonal vector with $O(n)$ scaling.
3. **`SparseCSRMatrix`**: Stored in standard Compressed Sparse Row (CSR) format (`values`, `col_indices`, `row_ptrs`) for high-dimensional sparse systems.
4. **`Rotation2DOperator`**: Stored matrix-free via an angle $\theta$, computing rotations analytically without a 2D memory array.

The base class implements the classic **Power Iteration Algorithm**—demonstrating how an advanced numerical algorithm computes the dominant eigenvalue $\lambda_{\max}$ and eigenvector $\mathbf{v}$ polymorphically using **only** the abstract contract!

```python
import math
from abc import ABC, abstractmethod
from typing import List, Tuple, Dict, Any

# ==========================================================
# 1. ABSTRACT BASE CLASS (Linear Operator Contract)
# ==========================================================
class LinearOperator(ABC):
    """
    Abstract Base Class representing a mathematical Linear Operator T: R^n -> R^m.
    Enforces dimensional and matrix-vector contracts while providing universal
    spectral analysis, norm calculation, and residual tracking algorithms.
    """

    # ------------------------------------------------------
    # ABSTRACT PROPERTIES (Mandatory Operator Specifications)
    # ------------------------------------------------------
    @property
    @abstractmethod
    def shape(self) -> Tuple[int, int]:
        """Returns (rows, cols) representing the dimension of the operator."""
        pass

    @property
    @abstractmethod
    def operator_name(self) -> str:
        """Descriptive identifier for logging and reporting."""
        pass

    # ------------------------------------------------------
    # ABSTRACT METHODS (Storage-Specific Implementation)
    # ------------------------------------------------------
    @abstractmethod
    def matvec(self, x: List[float]) -> List[float]:
        """Computes the matrix-vector product y = A * x."""
        pass

    @abstractmethod
    def non_zero_elements(self) -> int:
        """Returns the number of explicitly stored non-zero entries."""
        pass

    # ------------------------------------------------------
    # CONCRETE METHODS (Shared Numerical Algebra Engine)
    # ------------------------------------------------------
    @property
    def is_square(self) -> bool:
        """Returns True if the operator maps a vector space to itself (n x n)."""
        rows, cols = self.shape
        return rows == cols

    def vector_l2_norm(self, v: List[float]) -> float:
        """Standard Euclidean L2 Norm: ||v||_2 = sqrt(sum(v_i^2))."""
        return math.sqrt(sum(val ** 2 for val in v))

    def inner_product(self, u: List[float], v: List[float]) -> float:
        """Standard Euclidean Inner Product (Dot Product) <u, v>."""
        if len(u) != len(v):
            raise ValueError(f"Inner product dimension mismatch: {len(u)} vs {len(v)}")
        return sum(a * b for a, b in zip(u, v))

    def compute_residual(self, x: List[float], b: List[float]) -> Tuple[List[float], float]:
        """
        Calculates linear system residual vector r = b - A*x and its L2 norm ||r||_2.
        Universal for any linear system A*x = b.
        """
        ax = self.matvec(x)
        if len(ax) != len(b):
            raise ValueError(f"Dimension mismatch in residual: A*x ({len(ax)}) vs b ({len(b)})")
        residual = [b_i - ax_i for b_i, ax_i in zip(b, ax)]
        res_norm = self.vector_l2_norm(residual)
        return residual, res_norm

    def power_iteration(self, num_iterations: int = 35, tolerance: float = 1e-7) -> Tuple[float, List[float]]:
        """
        Power Iteration Algorithm:
        Computes the dominant eigenvalue and eigenvector of any square operator
        relying solely on the abstract matvec() method!
        """
        if not self.is_square:
            raise ValueError("Power iteration requires a square linear operator.")

        n = self.shape[0]
        # Initial unit test vector
        b_k = [1.0 / math.sqrt(n)] * n
        eigenvalue = 0.0

        for _ in range(num_iterations):
            # Compute A * b_k using the abstract contract
            b_k1 = self.matvec(b_k)
            norm = self.vector_l2_norm(b_k1)
            if norm < 1e-12:
                break
            b_k1_norm = [val / norm for val in b_k1]

            # Rayleigh quotient estimation: lambda = (b^T * A * b) / (b^T * b)
            rayleigh = self.inner_product(b_k1_norm, self.matvec(b_k1_norm))
            if abs(rayleigh - eigenvalue) < tolerance:
                eigenvalue = rayleigh
                b_k = b_k1_norm
                break
            eigenvalue = rayleigh
            b_k = b_k1_norm

        return eigenvalue, b_k

    def sparsity_ratio(self) -> float:
        """Percentage of structural zeros: 1 - (nnz / (rows * cols))."""
        total_entries = self.shape[0] * self.shape[1]
        if total_entries == 0:
            return 0.0
        return 1.0 - (self.non_zero_elements() / total_entries)


# ==========================================================
# 2. CONCRETE SUBCLASSES (Diverse Linear Algebra Formats)
# ==========================================================
class DenseMatrix(LinearOperator):
    """Explicit 2D Dense Matrix representation."""
    def __init__(self, name: str, data: List[List[float]]):
        self._name = name
        self._data = data
        self._rows = len(data)
        self._cols = len(data[0]) if self._rows > 0 else 0

    @property
    def shape(self) -> Tuple[int, int]:
        return (self._rows, self._cols)

    @property
    def operator_name(self) -> str:
        return self._name

    def matvec(self, x: List[float]) -> List[float]:
        if len(x) != self._cols:
            raise ValueError(f"Vector dimension {len(x)} incompatible with columns {self._cols}")
        return [sum(self._data[i][j] * x[j] for j in range(self._cols)) for i in range(self._rows)]

    def non_zero_elements(self) -> int:
        return sum(1 for row in self._data for val in row if abs(val) > 1e-12)


class DiagonalMatrix(LinearOperator):
    """Memory-lean Diagonal Matrix (stores only the main diagonal)."""
    def __init__(self, name: str, diagonal_entries: List[float]):
        self._name = name
        self._diag = diagonal_entries
        self._n = len(diagonal_entries)

    @property
    def shape(self) -> Tuple[int, int]:
        return (self._n, self._n)

    @property
    def operator_name(self) -> str:
        return self._name

    def matvec(self, x: List[float]) -> List[float]:
        if len(x) != self._n:
            raise ValueError(f"Vector dimension {len(x)} incompatible with diagonal size {self._n}")
        # O(n) element-wise product
        return [d * xi for d, xi in zip(self._diag, x)]

    def non_zero_elements(self) -> int:
        return sum(1 for val in self._diag if abs(val) > 1e-12)


class SparseCSRMatrix(LinearOperator):
    """Compressed Sparse Row (CSR) matrix for large, sparse linear systems."""
    def __init__(
        self,
        name: str,
        shape: Tuple[int, int],
        values: List[float],
        col_indices: List[int],
        row_ptrs: List[int]
    ):
        self._name = name
        self._shape = shape
        self._values = values
        self._col_indices = col_indices
        self._row_ptrs = row_ptrs

    @property
    def shape(self) -> Tuple[int, int]:
        return self._shape

    @property
    def operator_name(self) -> str:
        return self._name

    def matvec(self, x: List[float]) -> List[float]:
        if len(x) != self._shape[1]:
            raise ValueError(f"Vector dimension {len(x)} mismatch with matrix cols {self._shape[1]}")
        y = [0.0] * self._shape[0]
        for i in range(self._shape[0]):
            start = self._row_ptrs[i]
            end = self._row_ptrs[i + 1]
            for idx in range(start, end):
                y[i] += self._values[idx] * x[self._col_indices[idx]]
        return y

    def non_zero_elements(self) -> int:
        return len(self._values)


class Rotation2DOperator(LinearOperator):
    """Matrix-free analytical 2D Counter-Clockwise Rotation Operator."""
    def __init__(self, name: str, angle_degrees: float):
        self._name = name
        self._angle_deg = angle_degrees
        rad = math.radians(angle_degrees)
        self._cos = math.cos(rad)
        self._sin = math.sin(rad)

    @property
    def shape(self) -> Tuple[int, int]:
        return (2, 2)

    @property
    def operator_name(self) -> str:
        return self._name

    def matvec(self, x: List[float]) -> List[float]:
        if len(x) != 2:
            raise ValueError(f"Vector dimension {len(x)} invalid for 2D rotation.")
        # [cos -sin; sin cos] * [x0, x1]^T
        return [
            self._cos * x[0] - self._sin * x[1],
            self._sin * x[0] + self._cos * x[1]
        ]

    def non_zero_elements(self) -> int:
        return 4


# ==========================================================
# 3. POLYMORPHIC LINEAR ALGEBRA AUDIT PIPELINE
# ==========================================================
def run_linear_algebra_pipeline(
    operators: List[LinearOperator],
    x_input: List[float],
    b_target: List[float]
) -> None:
    """
    Polymorphic evaluation of diverse linear operators.
    The caller interacts exclusively through the abstract LinearOperator interface!
    """
    print("=" * 85)
    print("📐 COMPUTATIONAL LINEAR ALGEBRA & LINEAR OPERATOR AUDIT")
    print("=" * 85)

    for op in operators:
        rows, cols = op.shape
        print(f"\n🔷 OPERATOR: {op.operator_name} (Shape: {rows}x{cols} | Square: {op.is_square})")
        print(f"   ⚙️ Storage Telemetry: Stored NNZ = {op.non_zero_elements()} | Sparsity Ratio = {op.sparsity_ratio() * 100:.1f}%")

        # 1. Apply Transformation A * x
        transformed = op.matvec(x_input)
        print(f"   📍 Action A*x -> Input x: {[round(v, 3) for v in x_input]}")
        print(f"   ✨ Result  y: {[round(v, 4) for v in transformed]}")

        # 2. Compute Residual ||b - A*x||_2
        residual_vec, res_norm = op.compute_residual(x=x_input, b=b_target)
        print(f"   🎯 Residual ||b - A*x||_2 = {res_norm:.4f} (Residual vector: {[round(v, 4) for v in residual_vec]})")

        # 3. Compute Dominant Eigenpair via Abstract Power Iteration
        if op.is_square:
            dom_eig, dom_vec = op.power_iteration()
            print(f"   🌟 Spectral Analysis: Dominant Eigenvalue λ_max ≈ {dom_eig:.4f}")
            print(f"      Dominant Eigenvector v ≈ {[round(v, 4) for v in dom_vec]}")
        else:
            print("   ⚠️ Spectral Analysis: Skipped (Non-square matrix).")


# ==========================================================
# 4. SIMULATION EXECUTION
# ==========================================================
if __name__ == "__main__":
    # Test vector x and target RHS b for 3D operators
    x_test = [1.0, 2.0, -1.0]
    b_goal = [5.0, 10.0, 1.0]

    operator_suite: List[LinearOperator] = [
        # 1. Dense Covariance Matrix (3x3)
        DenseMatrix(
            name="DenseCovariance-3x3",
            data=[
                [4.0, 1.0, 2.0],
                [1.0, 5.0, 0.0],
                [2.0, 0.0, 3.0]
            ]
        ),
        # 2. Diagonal Scaling Matrix (3x3)
        DiagonalMatrix(
            name="SpectralScaling-3x3",
            diagonal_entries=[6.0, 3.0, 1.5]
        ),
        # 3. Sparse Tridiagonal 1D Discretized Laplacian (3x3)
        # Matrix:
        # [ 2 -1  0 ]
        # [-1  2 -1 ]
        # [ 0 -1  2 ]
        SparseCSRMatrix(
            name="TridiagonalLaplacian-3x3",
            shape=(3, 3),
            values=[2.0, -1.0, -1.0, 2.0, -1.0, -1.0, 2.0],
            col_indices=[0, 1, 0, 1, 2, 1, 2],
            row_ptrs=[0, 2, 5, 7]
        )
    ]

    run_linear_algebra_pipeline(operator_suite, x_test, b_goal)
```

#### 🎉 Output:
```text
=====================================================================================
📐 COMPUTATIONAL LINEAR ALGEBRA & LINEAR OPERATOR AUDIT
=====================================================================================

🔷 OPERATOR: DenseCovariance-3x3 (Shape: 3x3 | Square: True)
   ⚙️ Storage Telemetry: Stored NNZ = 7 | Sparsity Ratio = 22.2%
   📍 Action A*x -> Input x: [1.0, 2.0, -1.0]
   ✨ Result  y: [4.0, 11.0, -1.0]
   🎯 Residual ||b - A*x||_2 = 2.4495 (Residual vector: [1.0, -1.0, 2.0])
   🌟 Spectral Analysis: Dominant Eigenvalue λ_max ≈ 6.1451
      Dominant Eigenvector v ≈ [0.6794, 0.593, 0.4321]

🔷 OPERATOR: SpectralScaling-3x3 (Shape: 3x3 | Square: True)
   ⚙️ Storage Telemetry: Stored NNZ = 3 | Sparsity Ratio = 66.7%
   📍 Action A*x -> Input x: [1.0, 2.0, -1.0]
   ✨ Result  y: [6.0, 6.0, -1.5]
   🎯 Residual ||b - A*x||_2 = 4.8218 (Residual vector: [-1.0, 4.0, 2.5])
   🌟 Spectral Analysis: Dominant Eigenvalue λ_max ≈ 6.0000
      Dominant Eigenvector v ≈ [1.0, 0.0001, 0.0]

🔷 OPERATOR: TridiagonalLaplacian-3x3 (Shape: 3x3 | Square: True)
   ⚙️ Storage Telemetry: Stored NNZ = 7 | Sparsity Ratio = 22.2%
   📍 Action A*x -> Input x: [1.0, 2.0, -1.0]
   ✨ Result  y: [0.0, 4.0, -4.0]
   🎯 Residual ||b - A*x||_2 = 9.2736 (Residual vector: [5.0, 6.0, 5.0])
   🌟 Spectral Analysis: Dominant Eigenvalue λ_max ≈ 3.4142
      Dominant Eigenvector v ≈ [0.5, -0.7071, 0.5]
```

[🔝 Back to Top](#top)

---

<span id="chunk-5"></span>
## 📊 Chunk 5: Summary Comparison & Key Takeaways

### 1. Summary Comparison Table

| Abstraction Member | Decorator Syntax | Implemented in Abstract Base Class? | Must Child Subclass Override? | Primary Objective |
| :--- | :--- | :---: | :---: | :--- |
| **Abstract Method** | `@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce storage-specific transformation logic (e.g. `matvec()`). |
| **Concrete Method** | None | ✅ **Yes** (Full Body) | ❌ No (Inherited) | Provide reusable, universal mathematical algorithms (e.g. `compute_residual()`, `power_iteration()`). |
| **Abstract Property** | `@property`<br>`@abstractmethod` | ❌ No (`pass`) | ✅ **Yes** | Enforce mandatory mathematical dimensions and properties (e.g. `shape`, `operator_name`). |
| **Abstract Class** | Inherits `ABC` | N/A | N/A | Acts as the architectural blueprint; prevents direct instantiation of incomplete models. |

---

### 2. 🔑 Core Takeaways & Mental Model

1. **Abstraction = "What to do" vs. "How to do it"**:
   - The Abstract Base Class (`LinearOperator`) dictates **what** operations must exist across the computational pipeline (`matvec()`, `shape`, `compute_residual()`).
   - The concrete child classes (`DenseMatrix`, `DiagonalMatrix`, `SparseCSRMatrix`, `Rotation2DOperator`) define **how** those matrix products are calculated and stored in memory.

2. **Always Inherit `abc.ABC`**:
   - Without inheriting `ABC`, the `@abstractmethod` decorator will not prevent direct instantiation of the base class.

3. **Decorator Order Matters for Abstract Properties**:
   ```python
   # ✅ Correct Order: @property on outside, @abstractmethod on inside
   @property
   @abstractmethod
   def shape(self) -> tuple[int, int]:
       pass
   ```

4. **Algorithms Operate on Interfaces, Not Implementations**:
   - The Power Iteration algorithm in `LinearOperator` computes eigenvalues without knowing anything about 2D grids or CSR arrays. It relies purely on the abstract `matvec()` contract. This is the cornerstone of high-performance numerical scientific software (such as SciPy's `LinearOperator` or PETSc).

5. **Fail-Fast Safety via Instantiation Guards**:
   - If an engineer introduces a new sparse format or geometric transform and forgets to implement a required method, Python raises a `TypeError` immediately at object instantiation, preventing silent numerical bugs or runtime crashes during complex linear solves.

---

[🔝 Back to Top](#top)
