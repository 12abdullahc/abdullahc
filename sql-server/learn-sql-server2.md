# SQL Server Learning Workspace

Welcome to your structured, hands-on SQL Server learning journey! We will use this file to track progress, record notes, and complete exercises.

## Curriculum Tracker

- [x] **Phase 1: Basic SQL Server**
  - [x] 1.1 Introduction to Databases, Relational Models, and SSMS *(Completed)*
  - [x] 1.2 SQL Basics: SELECT, WHERE, and ORDER BY *(Completed)*
  - [x] 1.3 Filtering Data: AND, OR, IN, BETWEEN, and LIKE *(Completed)*
  - [x] 1.4 Aggregating Data: GROUP BY, HAVING, and Aggregate Functions *(Completed)*
  - [x] 1.5 Joining Tables: INNER, LEFT, RIGHT, and FULL OUTER JOINs *(Completed)*
  - [x] 1.6 Data Manipulation Language (DML): INSERT, UPDATE, and DELETE *(Completed)*
  - [x] 1.7 Basic Data Types in SQL Server *(Completed)*
- [x] **Phase 2: Intermediate SQL Server**
  - [x] 2.1 Subqueries (Scalar, Multi-valued, and Correlated) *(Completed)*
  - [x] 2.2 Common Table Expressions (CTEs) *(Completed)*
  - [x] 2.3 Window Functions *(Completed)*
  - [x] 2.4 Database Constraints *(Completed)*
  - [x] 2.5 Designing Tables and Views *(Completed)*
  - [x] 2.6 Introduction to Indexes (Clustered vs. Non-Clustered Indexes) *(Completed)*
  - [x] 2.7 Built-in Functions *(Completed)*
- [x] **Phase 3: Advanced SQL Server**
  - [x] 3.1 Stored Procedures (Creating, input/output parameters, and execution) *(Completed)*
  - [x] 3.2 User-Defined Functions (UDFs) *(Completed)*
  - [x] 3.3 Triggers *(Completed)*
  - [x] 3.4 Transactions and Error Handling *(Completed)*
  - [x] 3.5 Query Optimization Basics *(Completed)*
  - [x] 3.6 Dynamic SQL *(Completed)*
  - [x] 3.7 Advanced Indexing and Partitioning concepts *(Completed)*

---

## Lesson 1.1: Introduction to Databases, Relational Models, and SSMS

### 1. Explanation

#### What is a Database?
A database is an organized, digital collection of structured data. Instead of keeping data in isolated text files or spreadsheets, databases allow multiple users to store, query, and update large volumes of information securely and efficiently.

#### Relational Database Management System (RDBMS)
Microsoft SQL Server is an **RDBMS**. 
- **Relational**: Data is stored in tables (relations).
- **Tables**: Made of **columns** (attributes/fields) and **rows** (records/tuples).
- **Primary Key (PK)**: A column (or combination of columns) that uniquely identifies each row in a table. It cannot contain `NULL` values, and all values must be unique.
- **Foreign Key (FK)**: A column in one table that links to a Primary Key in another table. This establishes and enforces a link (relationship) between the data in the two tables, maintaining **referential integrity**.

#### What is SSMS?
**SQL Server Management Studio (SSMS)** is the primary integrated environment for managing SQL Server infrastructure. It is a desktop application used to:
- Connect to SQL Server instances.
- Write, execute, and debug SQL queries (T-SQL).
- Create and modify database objects (tables, views, stored procedures) visually or via script.
- Analyze query performance and administer server settings.

---

### 2. Practical Real-World Example

To illustrate the relational model, let's design a simple E-commerce database containing two tables: `Customers` and `Orders`. Each customer can place multiple orders, establishing a **one-to-many** relationship.

#### Table DDL (Data Definition Language)
```sql
-- Create the Customers table
CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY, -- Primary Key, auto-incrementing
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);

-- Create the Orders table
CREATE TABLE Orders (
    OrderID INT IDENTITY(1001,1) PRIMARY KEY, -- Primary Key, auto-incrementing starting at 1001
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID), -- Foreign Key pointing to Customers
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL
);
```

#### Sample Data
```sql
-- Insert sample Customers
INSERT INTO Customers (FirstName, LastName, Email) VALUES
('Jane', 'Doe', 'jane.doe@example.com'),
('John', 'Smith', 'john.smith@example.com');

-- Insert sample Orders for Jane Doe (CustomerID = 1)
INSERT INTO Orders (CustomerID, TotalAmount) VALUES
(1, 150.50),
(1, 89.99);

-- Insert sample Order for John Smith (CustomerID = 2)
INSERT INTO Orders (CustomerID, TotalAmount) VALUES
(2, 45.00);
```

#### Explanation of Syntax
- **`IDENTITY(1,1)`**: This automatically generates numeric identifiers for new rows. The first parameter is the starting value (seed), and the second is the increment value.
- **`PRIMARY KEY`**: Enforces that the column uniquely identifies each row.
- **`FOREIGN KEY REFERENCES Customers(CustomerID)`**: Ensures that any ID entered into `Orders.CustomerID` must already exist in `Customers.CustomerID`. It prevents orphaned orders.
- **`DECIMAL(10,2)`**: Defines a numeric field with 10 total digits, 2 of which are after the decimal point (ideal for monetary values).

---

### 3. Practice Exercise

Review the following database design for a library management system:

```sql
CREATE TABLE Books (
    BookID INT PRIMARY KEY,
    Title VARCHAR(150),
    Author VARCHAR(100)
);

CREATE TABLE Loans (
    LoanID INT PRIMARY KEY,
    BookID INT FOREIGN KEY REFERENCES Books(BookID),
    MemberName VARCHAR(100),
    LoanDate DATE
);
```

**Your Tasks:**
1. Identify which column acts as the Primary Key for the `Books` table.
2. Identify the Foreign Key in the `Loans` table and specify which table/column it references.
3. If you attempt to insert a row into the `Loans` table with a `BookID` of `999` when the `Books` table only has `BookID` values `1` through `5`, what will SQL Server do? Why?

#### Solution:
1. The primary key for the `Books` table is **`BookID`** (declared via `BookID INT PRIMARY KEY`).
2. The foreign key is **`BookID`** in the `Loans` table, which references the **`BookID`** column of the **`Books`** table (declared via `BookID INT FOREIGN KEY REFERENCES Books(BookID)`).
3. SQL Server will raise a **Foreign Key constraint violation error** and reject the transaction. This is because a foreign key ensures referential integrity—it guarantees that a record cannot reference a non-existent parent key in the related table.

---

## Lesson 1.2: SQL Basics: SELECT, WHERE, and ORDER BY

### 1. Explanation

In SQL Server, the most common operations involve querying data that already exists. This is done using the `SELECT` statement, often combined with `WHERE` and `ORDER BY` to filter and sort results.

#### The `SELECT` Statement
The `SELECT` clause tells the database which columns you want to retrieve.
- `SELECT *` retrieves all columns from the table.
- `SELECT Column1, Column2` retrieves only the specified columns, which is faster and uses less resources.

#### The `FROM` Clause
Specifies the table or tables from which the query will retrieve the data.

#### The `WHERE` Clause
Filters the records. Only rows that satisfy the given condition are returned.
Common comparison operators in `WHERE`:
- `=` (Equal to)
- `>` or `>=` (Greater than / Greater than or equal to)
- `<` or `<=` (Less than / Less than or equal to)
- `<>` or `!=` (Not equal to)

#### The `ORDER BY` Clause
Sorts the output rows based on one or more columns.
- `ASC` (default): Sorts in ascending order (A to Z, smallest number to largest, oldest date to newest).
- `DESC`: Sorts in descending order (Z to A, largest number to smallest, newest date to oldest).

> [!IMPORTANT]
> **SQL Query Execution Order**
> Although you write queries starting with `SELECT`, SQL Server processes the clauses in a different order:
> 1. `FROM` (Where the data is)
> 2. `WHERE` (Which rows to filter out)
> 3. `SELECT` (Which columns to return and calculate)
> 4. `ORDER BY` (How to sort the final presentation)

---

### 2. Practical Real-World Example

Let's look at an `Employees` table in an HR database.

#### Table DDL & Sample Data
```sql
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Department VARCHAR(50) NOT NULL,
    Salary DECIMAL(10,2) NOT NULL,
    HireDate DATE NOT NULL
);

INSERT INTO Employees (FirstName, LastName, Department, Salary, HireDate) VALUES
('Alice', 'Johnson', 'IT', 75000.00, '2021-03-15'),
('Bob', 'Smith', 'HR', 48000.00, '2019-06-01'),
('Charlie', 'Brown', 'IT', 62000.00, '2023-01-10'),
('David', 'Miller', 'Sales', 55000.00, '2020-11-20'),
('Emma', 'Davis', 'Sales', 42000.00, '2022-08-05');
```

#### SQL Query Example
Retrieve the names and salaries of employees in the 'IT' department, sorted from highest to lowest salary.

```sql
SELECT FirstName, LastName, Salary
FROM Employees
WHERE Department = 'IT'
ORDER BY Salary DESC;
```

#### Why We Use This Specific Syntax
- We specify `FirstName, LastName, Salary` instead of `*` because it's a best practice to only retrieve the data needed, which reduces network load and memory consumption.
- The `WHERE Department = 'IT'` filters out HR and Sales employees early in the execution pipeline.
- `ORDER BY Salary DESC` makes it easy to immediately see the top earners in the department.

---

### 3. Practice Exercise

Using the same `Employees` table structure above, write a T-SQL query to do the following:

Retrieve the **`FirstName`**, **`LastName`**, and **`HireDate`** of all employees who have a salary **greater than or equal to `50000.00`**, sorted by their **`HireDate`** from oldest to newest (ascending order).

#### Solution:
```sql
SELECT FirstName, LastName, HireDate
FROM Employees
WHERE Salary >= 50000.00
ORDER BY HireDate ASC;
```

---

## Lesson 1.3: Filtering Data: AND, OR, IN, BETWEEN, and LIKE (wildcards)

### 1. Explanation

To build more specific queries, you often need to filter data using multiple criteria or pattern matching. SQL Server provides logical and comparison operators to refine your search.

#### Logical Operators: `AND` & `OR`
- **`AND`**: Returns rows only when *all* specified conditions are true.
- **`OR`**: Returns rows when *at least one* of the specified conditions is true.

#### Range Operator: `BETWEEN`
Filters rows where a column value falls within an inclusive range (both start and end values are included).
- Syntactically cleaner than writing `Column >= X AND Column <= Y`.

#### Set Operator: `IN`
Checks if a value matches any value in a list of literal values or subquery results.
- Syntactically cleaner than writing multiple `OR` statements (e.g., `Category = 'IT' OR Category = 'HR'`).

#### Pattern Matching Operator: `LIKE`
Performs wildcard searches on string columns.
- **`%`**: Represents any string of zero or more characters (e.g., `'%computer%'` matches any string containing "computer").
- **`_`**: Represents a single character (e.g., `'h_t'` matches "hat", "hot", "hit").

---

### 2. Practical Real-World Example

Let's look at a `Products` table in a retail database.

#### Table DDL & Sample Data
```sql
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL
);

INSERT INTO Products (ProductName, Category, Price, StockQuantity) VALUES
('Quantum Laptop', 'Electronics', 1200.00, 15),
('Ergonomic Chair', 'Office Furniture', 249.99, 8),
('Wireless Mouse', 'Electronics', 25.50, 120),
('USB-C Hub', 'Electronics', 49.99, 45),
('Notebook Pack', 'Office Supplies', 12.99, 300),
('Office Desk', 'Office Furniture', 450.00, 4);
```

#### SQL Query Example
Find all electronics products that are priced between $20.00 and $100.00, and contain the word "Wireless" or "Hub" in their name.

```sql
SELECT ProductName, Category, Price, StockQuantity
FROM Products
WHERE Category = 'Electronics'
  AND Price BETWEEN 20.00 AND 100.00
  AND (ProductName LIKE '%Wireless%' OR ProductName LIKE '%Hub%');
```

#### Why We Use This Specific Syntax
- **`BETWEEN 20.00 AND 100.00`** is clean, legible, and checks the range inclusively.
- **Parentheses** around `(ProductName LIKE '%Wireless%' OR ProductName LIKE '%Hub%')` are critical. In SQL, `AND` has operator precedence over `OR`. Without parentheses, the query would evaluate as: *(Category is Electronics AND Price is in range AND name has Wireless)* OR *(name has Hub)*, which would return non-Electronics products named "Hub".

---

### 3. Practice Exercise

Using the `Products` table defined above, write a T-SQL query that does the following:

Retrieve the **`ProductName`**, **`Category`**, **`Price`**, and **`StockQuantity`** for all products that:
1. Belong to either the **'Electronics'** or **'Office Supplies'** categories.
2. Have a **`StockQuantity`** of **less than 100**.
3. Have a **`ProductName`** starting with the letter **'Q'** or ending with the word **'Hub'**.

Sort the results by **`Price`** in descending order.

#### Solution:
```sql
SELECT ProductName, Category, Price, StockQuantity
FROM Products
WHERE Category IN ('Electronics', 'Office Supplies')
  AND StockQuantity < 100
  AND (ProductName LIKE 'Q%' OR ProductName LIKE '%Hub')
ORDER BY Price DESC;
```

---

## Lesson 1.4: Aggregating Data: GROUP BY, HAVING, and Aggregate Functions

### 1. Explanation

In database systems, you frequently need to summarize data rather than list every individual record. This is known as data aggregation.

#### Aggregate Functions
These functions perform a calculation on a set of values and return a single summarizing value:
- **`COUNT()`**: Counts the number of items. `COUNT(*)` counts all rows; `COUNT(column)` counts only non-NULL values in that column.
- **`SUM()`**: Adds up numeric values.
- **`AVG()`**: Calculates the average of numeric values.
- **`MIN()`**: Finds the smallest value (works on numbers, dates, and strings).
- **`MAX()`**: Finds the largest value (works on numbers, dates, and strings).

#### The `GROUP BY` Clause
Used to group rows that have the same values in specified columns. 
> [!IMPORTANT]
> **The GROUP BY Rule**
> When you use grouping, every column in your `SELECT` list must satisfy one of two conditions:
> 1. It is wrapped inside an aggregate function (e.g. `SUM(Salary)`), OR
> 2. It is listed in the `GROUP BY` clause.
>
> If you try to SELECT a raw column that is not grouped, SQL Server will raise an error because it doesn't know which raw value to display for the group.

#### The `HAVING` Clause
Filters the grouped records *after* the aggregations have been calculated.
- **`WHERE` vs `HAVING`**:
  - `WHERE` filters rows *before* grouping. It cannot contain aggregate functions (e.g., `WHERE SUM(Salary) > 1000` is illegal).
  - `HAVING` filters groups *after* grouping. It typically contains aggregate functions.

---

### 2. Practical Real-World Example

Let's look at a `Sales` table tracking transactions.

#### Table DDL & Sample Data
```sql
CREATE TABLE Sales (
    SaleID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    SaleDate DATE NOT NULL
);

INSERT INTO Sales (ProductName, Category, Quantity, TotalPrice, SaleDate) VALUES
('Quantum Laptop', 'Electronics', 1, 1200.00, '2023-01-15'),
('Wireless Mouse', 'Electronics', 2, 51.00, '2023-01-16'),
('Ergonomic Chair', 'Office Furniture', 1, 249.99, '2023-01-18'),
('USB-C Hub', 'Electronics', 3, 149.97, '2023-01-20'),
('Notebook Pack', 'Office Supplies', 10, 129.90, '2023-01-22'),
('Office Desk', 'Office Furniture', 2, 900.00, '2023-01-25');
```

#### SQL Query Example
Find the total sales amount and total quantities sold for each product category since January 15th, 2023. Only show categories that have total sales exceeding $200.00, sorted from highest to lowest sales.

```sql
SELECT Category, 
       SUM(TotalPrice) AS TotalSales, 
       SUM(Quantity) AS TotalQtySold,
       COUNT(SaleID) AS TransactionCount
FROM Sales
WHERE SaleDate >= '2023-01-15'
GROUP BY Category
HAVING SUM(TotalPrice) > 200.00
ORDER BY TotalSales DESC;
```

#### Why We Use This Specific Syntax
- **`WHERE SaleDate >= '2023-01-15'`**: Filters out any sales before this date *before* the server spends resources grouping the rows.
- **`GROUP BY Category`**: Instructs the database to create a unique row for each category.
- **`HAVING SUM(TotalPrice) > 200.00`**: Filters out "Office Supplies" because its total sales ($129.90) did not exceed $200.00.
- **`AS TotalSales`**: Assigns an alias to the calculated column, making the output readable and allowing us to refer to it in `ORDER BY`.

---

### 3. Practice Exercise

Using the same `Sales` table defined above, write a T-SQL query to do the following:

Calculate the **average item unit price** (which is `TotalPrice / Quantity`), **minimum item unit price**, and **maximum item unit price** for each product category.
Only include categories that have **more than 1 transaction** (i.e. more than 1 row in the `Sales` table).
Sort the results alphabetically by **`Category`** name.

#### Solution:
```sql
SELECT Category,
       AVG(TotalPrice / Quantity) AS AvgUnitPrice,
       MIN(TotalPrice / Quantity) AS MinUnitPrice,
       MAX(TotalPrice / Quantity) AS MaxUnitPrice
FROM Sales
GROUP BY Category
HAVING COUNT(SaleID) > 1
ORDER BY Category ASC;
```

---

## Lesson 1.5: Joining Tables: INNER, LEFT, RIGHT, and FULL OUTER JOINs

### 1. Explanation

In a normalized relational database, related pieces of data are spread across different tables to minimize redundancy. To construct meaningful reports, we must combine records from two or more tables based on a related column between them (typically Primary Keys and Foreign Keys).

SQL Server supports several types of joins:

#### `INNER JOIN`
Returns rows when there is a match in **both** tables. If a row in Table A does not have a corresponding matching key in Table B, that row is excluded from the results entirely.

#### `LEFT JOIN` (or `LEFT OUTER JOIN`)
Returns **all** rows from the left table, and the matched rows from the right table. If no match is found, the columns from the right table will contain `NULL`.

#### `RIGHT JOIN` (or `RIGHT OUTER JOIN`)
Returns **all** rows from the right table, and the matched rows from the left table. If no match is found, the columns from the left table will contain `NULL`.

#### `FULL OUTER JOIN`
Returns rows when there is a match in **either** the left or right table. If there is no match on one side, the missing side's columns will return `NULL`.

---

### 2. Practical Real-World Example

Let's consider a company database with `Departments` and `Employees`.

#### Table DDL & Sample Data
```sql
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY,
    DeptName VARCHAR(50) NOT NULL
);

CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    DeptID INT FOREIGN KEY REFERENCES Departments(DeptID)
);

-- Insert Departments
INSERT INTO Departments (DeptID, DeptName) VALUES
(10, 'IT'),
(20, 'HR'),
(30, 'Sales'),
(40, 'Marketing'); -- Marketing has no employees

-- Insert Employees
INSERT INTO Employees (FirstName, LastName, DeptID) VALUES
('Alice', 'Johnson', 10),
('Bob', 'Smith', 20),
('Charlie', 'Brown', 10),
('David', 'Miller', NULL); -- David has no department assigned yet
```

#### SQL Query Examples

**1. Retrieve only employees with an assigned department (INNER JOIN):**
```sql
SELECT E.FirstName, E.LastName, D.DeptName
FROM Employees E
INNER JOIN Departments D ON E.DeptID = D.DeptID;
-- Note: David (no department) and Marketing (no employees) are omitted.
```

**2. Retrieve ALL employees, including those without a department (LEFT JOIN):**
```sql
SELECT E.FirstName, E.LastName, D.DeptName
FROM Employees E
LEFT JOIN Departments D ON E.DeptID = D.DeptID;
-- Note: David appears with DeptName as NULL. Marketing is omitted.
```

**3. Retrieve ALL departments, including those without any employees (RIGHT JOIN):**
```sql
SELECT E.FirstName, E.LastName, D.DeptName
FROM Employees E
RIGHT JOIN Departments D ON E.DeptID = D.DeptID;
-- Note: Marketing appears with FirstName and LastName as NULL. David is omitted.
```

#### Why We Use This Specific Syntax
- **`E` and `D` (Aliases)**: Used to shorten table names and clarify which table a column belongs to (e.g., `E.DeptID` vs `D.DeptID`). This is crucial if both tables share the same column name.
- **`ON` clause**: Specifies the condition that links the tables (e.g., `E.DeptID = D.DeptID`). Without this, the database will attempt to match every row of the left table with every row of the right table (a Cartesian Product / CROSS JOIN).

---

### 3. Practice Exercise

Consider the following two tables:

```sql
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    City VARCHAR(50) NOT NULL
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    OrderDate DATE NOT NULL,
    Amount DECIMAL(10,2) NOT NULL
);
```

Write a T-SQL query to retrieve the **`CustomerName`**, **`City`**, **`OrderID`**, and **`Amount`** for **all** customers. 
If a customer has not placed any orders, their `OrderID` and `Amount` should show as `NULL`.
Sort the results by **`CustomerName`** in ascending order.

#### Solution:
```sql
SELECT C.CustomerName, C.City, O.OrderID, O.Amount
FROM Customers C
LEFT JOIN Orders O ON C.CustomerID = O.CustomerID
ORDER BY C.CustomerName ASC;
```

---

## Lesson 1.6: Data Manipulation Language (DML): INSERT, UPDATE, and DELETE

### 1. Explanation

Data Manipulation Language (DML) statements are used to add, modify, and delete data within database tables. While queries (SELECT) retrieve data without changing it, DML statements modify the state of the database.

#### The `INSERT` Statement
Adds new rows (records) to a table.
- **Single row INSERT:**
  ```sql
  INSERT INTO TableName (Column1, Column2) 
  VALUES (Value1, Value2);
  ```
- **Multi-row INSERT:**
  ```sql
  INSERT INTO TableName (Column1, Column2) 
  VALUES 
  (Value1a, Value2a),
  (Value1b, Value2b);
  ```
- *Note:* If a column is an identity column (e.g. `IDENTITY(1,1)`), you do not specify it in the column list or values, as SQL Server generates this value automatically.

#### The `UPDATE` Statement
Modifies existing records in a table.
- **Syntax:**
  ```sql
  UPDATE TableName
  SET Column1 = NewValue1, Column2 = NewValue2
  WHERE Condition;
  ```
- > [!CAUTION]
  > **The Dangerous UPDATE**
  > If you omit the `WHERE` clause in an `UPDATE` statement, SQL Server will update **every single row** in the table with the new values. Always double-check your `WHERE` filter!

#### The `DELETE` Statement
Removes existing records from a table.
- **Syntax:**
  ```sql
  DELETE FROM TableName
  WHERE Condition;
  ```
- > [!CAUTION]
  > **The Dangerous DELETE**
  > If you omit the `WHERE` clause in a `DELETE` statement, SQL Server will delete **every row** in the table, leaving you with an empty table. 

- **`DELETE` vs. `TRUNCATE TABLE`**:
  - `DELETE` is a logged row-by-row operation. It can be filtered with `WHERE`, fires triggers, and does not reset identity counters.
  - `TRUNCATE TABLE` is a high-speed, minimally logged DDL operation that deletes *all* rows in a table. It cannot be filtered with `WHERE`, bypasses triggers, and resets identity columns back to their seed value.

---

### 2. Practical Real-World Example

Let's look at an `Inventory` table in a warehouse management system.

#### Table DDL & Sample Data
```sql
CREATE TABLE Inventory (
    ItemID INT IDENTITY(1,1) PRIMARY KEY,
    ItemName VARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL
);

INSERT INTO Inventory (ItemName, Quantity, UnitPrice) VALUES
('USB-C Cable', 150, 9.99),
('Wireless Mouse', 80, 24.50),
('Mechanical Keyboard', 25, 89.99);
```

#### DML SQL Examples

**1. Add a new item (INSERT):**
```sql
INSERT INTO Inventory (ItemName, Quantity, UnitPrice)
VALUES ('HDMI Adapter', 60, 14.99);
```

**2. Update stock and price of the mechanical keyboard (UPDATE):**
```sql
UPDATE Inventory
SET Quantity = Quantity + 10, UnitPrice = 84.99
WHERE ItemName = 'Mechanical Keyboard';
```

**3. Delete an item from inventory (DELETE):**
```sql
DELETE FROM Inventory
WHERE ItemName = 'Wireless Mouse';
```

#### Why We Use This Specific Syntax
- We specify columns in `INSERT INTO Inventory (ItemName, Quantity, UnitPrice)` so SQL Server maps values accurately. It also safeguards your script from breaking if columns are added or re-ordered in the table definition later.
- We use `Quantity = Quantity + 10` in `UPDATE` to incrementally modify the current value of the column rather than overwriting it with a hardcoded static value.
- In `UPDATE` and `DELETE`, we filter by specific criteria (`WHERE ItemName = ...`) to target precisely the intended rows.

---

### 3. Practice Exercise

Suppose we have an `Employees` table with this structure:

```sql
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Department VARCHAR(50) NOT NULL,
    Salary DECIMAL(10,2) NOT NULL
);
```

Write T-SQL statements to perform the following:
1. **Insert** a new employee named "Sarah Connor" who works in the "Security" department with a salary of `65000.00`.
2. **Update** the salary of all employees in the "IT" department by giving them a **10% raise**.
3. **Delete** all employees who belong to the "Marketing" department.

#### Solution:
```sql
-- 1. Insert Sarah Connor
INSERT INTO Employees (FirstName, LastName, Department, Salary)
VALUES ('Sarah', 'Connor', 'Security', 65000.00);

-- 2. Update IT salaries (10% raise)
UPDATE Employees
SET Salary = Salary * 1.10
WHERE Department = 'IT';

-- 3. Delete Marketing employees
DELETE FROM Employees
WHERE Department = 'Marketing';
```

---

## Lesson 1.7: Basic Data Types in SQL Server (INT, VARCHAR, DATETIME, DECIMAL, etc.)

### 1. Explanation

In SQL Server, every table column, local variable, and function parameter must have an explicitly defined data type. Selecting the correct data type is critical because it enforces data integrity, reduces storage sizes, and optimizes indexing and performance.

We can group the primary T-SQL data types into three main families:

#### 1. Numeric Data Types
- **`INT`** (Integer): A 4-byte integer. Ranges from $-2,147,483,648$ to $2,147,483,647$. Ideal for auto-incrementing identity keys and whole numbers.
- **`BIGINT`**: An 8-byte integer. Used when numbers might exceed the `INT` range.
- **`DECIMAL(p, s)`** or **`NUMERIC(p, s)`**: Fixed-precision and scale numeric values. 
  - **`p` (Precision)**: The maximum total number of decimal digits that can be stored, both to the left and to the right of the decimal point.
  - **`s` (Scale)**: The maximum number of decimal digits that can be stored to the right of the decimal point.
  - *Example:* `DECIMAL(8,2)` stores up to 8 digits total, with 2 after the decimal point (e.g. `999999.99`). Essential for currency and financial data to avoid rounding errors.
- **`BIT`**: Stores `0`, `1`, or `NULL`. This is used to represent boolean values (`True`/`False` or `Yes`/`No`).

#### 2. String Data Types
- **`VARCHAR(n)`**: Variable-length, non-Unicode string data. Uses 1 byte per character. `n` defines the maximum characters (1 to 8,000, or `max` for up to 2 GB). It only uses space equal to the actual text length + 2 bytes overhead.
- **`CHAR(n)`**: Fixed-length, non-Unicode string data. If you insert a string shorter than `n`, it is padded with trailing spaces. Use this for data of a strictly fixed length (e.g. USA State abbreviations like `CHAR(2)` or country codes like `CHAR(3)`).
- **`NVARCHAR(n)`**: Variable-length, Unicode string data. Uses 2 bytes per character. Essential for columns storing international character sets (e.g., Arabic, Japanese, accents, or emojis).
- **`NCHAR(n)`**: Fixed-length, Unicode string data.

#### 3. Date and Time Data Types
- **`DATE`**: Stores a date only (e.g., `YYYY-MM-DD`), from January 1, 0001 to December 31, 9999.
- **`TIME`**: Stores time of day only (e.g., `HH:MM:SS.nnnnnnn`), with sub-second accuracy.
- **`DATETIME`**: Stores both date and time (accuracy to 3.33 milliseconds).
- **`DATETIME2(n)`**: The modern, recommended replacement for `DATETIME`. It has a wider date range (starting from year 0001) and configurable sub-second precision `n` (0 to 7).

---

### 2. Practical Real-World Example

Let's design a `ProductsMetadata` table illustrating optimal data type decisions.

#### Table DDL
```sql
CREATE TABLE ProductsMetadata (
    ProductID INT IDENTITY(1,1) PRIMARY KEY, -- Auto-incrementing whole number
    SKU CHAR(8) NOT NULL,                     -- Fixed alphanumeric code (e.g., 'PROD1234')
    ProductName NVARCHAR(150) NOT NULL,       -- Unicode variable string to support international names
    UnitPrice DECIMAL(10,2) NOT NULL,         -- Money representation (precise to 2 decimal places)
    IsActive BIT DEFAULT 1 NOT NULL,          -- Active status flag (1 = True, 0 = False)
    CreatedDate DATETIME2(3) DEFAULT SYSUTCDATETIME() NOT NULL -- Modern date/time, millisecond accuracy
);
```

#### Why We Choose These Data Types
- **`CHAR(8)` for SKU**: Because SKU codes are strictly 8 characters long. Using `VARCHAR(8)` would waste 2 bytes of storage per row due to length-tracking overhead.
- **`NVARCHAR(150)` for ProductName**: Because the company sells internationally and product names can contain foreign accents or characters that non-Unicode `VARCHAR` would corrupt into question marks (`?`).
- **`DECIMAL(10,2)` for UnitPrice**: Prevents rounding discrepancies associated with float or real data types.

---

### 3. Practice Exercise

You are tasked with designing a T-SQL schema for a vehicle licensing department.

Create a table named **`VehicleRegistrations`** with the following requirements:
1. **`RegistrationID`**: An auto-incrementing integer starting at 1 that serves as the Primary Key.
2. **`LicensePlate`**: A fixed-length string of exactly 7 characters (standard plates do not support Unicode characters). It must not allow nulls.
3. **`OwnerName`**: A variable-length string of up to 100 characters that supports international/Unicode names. It must not allow nulls.
4. **`VehicleModel`**: A variable-length string of up to 50 characters (only standard/non-Unicode characters are expected). It must not allow nulls.
5. **`PurchasePrice`**: A precise decimal number that can support amounts up to `$999,999.99`. It must not allow nulls.
6. **`IsCommercial`**: A true/false flag indicating if the vehicle is for commercial use. It must not allow nulls.
7. **`ExpiryDate`**: A date-only value (no time element required). It must not allow nulls.

Write the `CREATE TABLE` DDL statement.

#### Solution:
```sql
CREATE TABLE VehicleRegistrations (
    RegistrationID INT IDENTITY(1,1) PRIMARY KEY,
    LicensePlate CHAR(7) NOT NULL,
    OwnerName NVARCHAR(100) NOT NULL,
    VehicleModel VARCHAR(50) NOT NULL,
    PurchasePrice DECIMAL(8,2) NOT NULL,
    IsCommercial BIT NOT NULL,
    ExpiryDate DATE NOT NULL
);
```

---

## Lesson 2.1: Subqueries (Scalar, Multi-valued, and Correlated subqueries)

### 1. Explanation

A **subquery** is a T-SQL query nested inside another query (called the outer query). Subqueries can reside within the `SELECT`, `FROM`, `WHERE`, or `HAVING` clauses.

There are three primary categories of subqueries in T-SQL:

#### 1. Scalar Subquery
Returns exactly **one value** (one row and one column). Because it evaluates to a single value, you can use it alongside standard comparison operators like `=`, `<`, `>`, or `<>`.
- *Example:* Get employees whose salary is above the company-wide average:
  ```sql
  SELECT FirstName, LastName, Salary
  FROM Employees
  WHERE Salary > (SELECT AVG(Salary) FROM Employees);
  ```

#### 2. Multi-Valued Subquery
Returns **multiple rows but only one column** (a list of values). Because it returns a set, you cannot use simple scalar comparisons. Instead, you pair it with set-based operators such as `IN`, `ANY`, `ALL`, or `SOME`.
- *Example:* Find customers who have placed an order in the IT category:
  ```sql
  SELECT CustomerName 
  FROM Customers
  WHERE CustomerID IN (SELECT CustomerID FROM Orders WHERE Category = 'IT');
  ```

#### 3. Correlated Subquery
Unlike standard subqueries which execute once, a **correlated subquery** references one or more columns from the outer query. It is evaluated repeatedly, once for **every row** evaluated by the outer query.
- *Example:* Find employees who earn more than the average salary of their *specific* department:
  ```sql
  SELECT E1.FirstName, E1.LastName, E1.Department, E1.Salary
  FROM Employees E1
  WHERE E1.Salary > (
      SELECT AVG(E2.Salary)
      FROM Employees E2
      WHERE E2.Department = E1.Department
  );
  ```
  *(Here, `E2.Department = E1.Department` correlates the inner query to the current outer row `E1`.)*

---

### 2. Practical Real-World Example

Let's query a database containing `Customers` and `Orders`.

#### Table DDL & Sample Data
```sql
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL
);

CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    OrderDate DATE NOT NULL,
    Amount DECIMAL(10,2) NOT NULL
);

INSERT INTO Customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie');
INSERT INTO Orders VALUES 
(101, 1, '2023-05-10', 250.00),
(102, 1, '2023-05-12', 450.00),
(103, 2, '2023-05-15', 120.00);
```

#### SQL Query Examples

**1. Multi-Valued Subquery (Find customers with zero orders):**
```sql
SELECT CustomerName
FROM Customers
WHERE CustomerID NOT IN (SELECT CustomerID FROM Orders);
-- Returns: Charlie
```

**2. Correlated Subquery (Get each customer's largest single order amount):**
```sql
SELECT C.CustomerName,
       (SELECT MAX(O.Amount) 
        FROM Orders O 
        WHERE O.CustomerID = C.CustomerID) AS MaxOrderAmount
FROM Customers C;
-- Returns Alice: 450.00, Bob: 120.00, Charlie: NULL
```

#### Why We Use This Specific Syntax
- A subquery in the `SELECT` list (as in example 2) is a clean way to pull calculated aggregates from related tables on a row-by-row basis without needing a full `GROUP BY` on the outer query.
- In example 1, `NOT IN` is standard and readable, though in SQL Server it has a caveat: if the subquery returns any `NULL` values, the `NOT IN` comparison will return no rows. (We will address `NOT EXISTS` as a safer alternative in constraint and optimization sections later!).

---

### 3. Practice Exercise

Consider a `Products` table defined as:

```sql
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL
);
```

Write a T-SQL query using a **correlated subquery** to retrieve the **`ProductName`**, **`Category`**, and **`Price`** of all products that have a price **greater than the average price** of products in their **same Category**.

#### Solution:
```sql
SELECT P1.ProductName, P1.Category, P1.Price
FROM Products P1
WHERE P1.Price > (
    SELECT AVG(P2.Price)
    FROM Products P2
    WHERE P2.Category = P1.Category
);
```

---

## Lesson 2.2: Common Table Expressions (CTEs) and the WITH clause

### 1. Explanation

A **Common Table Expression (CTE)** is a temporary, named result set that exists only for the duration of a single execution scope of a query (such as a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement). You can think of a CTE as a "temporary view" that is defined inline and destroyed immediately after the statement runs.

CTEs are defined using the `WITH` keyword at the beginning of a query.

#### Why Use CTEs Instead of Subqueries?
1. **Improved Readability:** Standard subqueries require you to nest queries inside-out, which becomes hard to read. CTEs allow you to define query blocks top-to-bottom in a logical, linear order.
2. **Reusability:** You can reference the same CTE multiple times within the subsequent query (e.g. self-joining a CTE). In contrast, a subquery has to be written out multiple times.
3. **Recursive Queries:** T-SQL allows a CTE to reference itself, making it the primary tool for querying hierarchical structures like organizational trees, folder structures, or assembly hierarchies.

---

### 2. Practical Real-World Example

Let's solve the "find employees who earn more than their department's average" problem, but using a CTE instead of a correlated subquery.

#### Table DDL & Sample Data
*(We will use the `Employees` table from Lesson 1.2).*
```sql
-- CTE definition
WITH DepartmentAverages AS (
    -- Step 1: Calculate the average salary per department
    SELECT Department, AVG(Salary) AS AvgSalary
    FROM Employees
    GROUP BY Department
)
-- Step 2: Join the CTE back to the main Employees table
SELECT E.FirstName, E.LastName, E.Department, E.Salary, DA.AvgSalary
FROM Employees E
INNER JOIN DepartmentAverages DA ON E.Department = DA.Department
WHERE E.Salary > DA.AvgSalary;
```

#### Why We Use This Specific Syntax
- **`WITH DepartmentAverages AS (...)`**: Defines the name of the temporary result set (`DepartmentAverages`) and the query that populates it.
- **Inner Columns**: Inside the CTE query, we give the calculated column an alias `AvgSalary`. The outer query references it as `DA.AvgSalary`.
- **Cleaner Joining**: Rather than executing a correlated subquery for every single employee row (which is $O(N)$ subquery evaluations), SQL Server can compute the department averages once and perform an efficient hash or merge join.

---

### 3. Practice Exercise

Suppose we have a `Sales` table tracking transactions:

```sql
CREATE TABLE Sales (
    SaleID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    SaleDate DATE NOT NULL
);
```

Write a T-SQL query using a **Common Table Expression (CTE)** that does the following:

1. Define a CTE named **`CategorySalesSummary`** that calculates the **total sales amount** (`SUM(TotalPrice)`) and the **total quantity sold** (`SUM(Quantity)`) for each product **`Category`**.
2. Write an outer query targeting this CTE that retrieves the **`Category`**, **total sales amount**, and **total quantity sold** for only those categories where the total quantity sold is **greater than 50**.
3. Sort the final output by the total sales amount in **descending order**.

#### Solution:
```sql
WITH CategorySalesSummary AS (
    SELECT Category,
           SUM(TotalPrice) AS TotalSales,
           SUM(Quantity) AS TotalQty
    FROM Sales
    GROUP BY Category
)
SELECT Category, TotalSales, TotalQty
FROM CategorySalesSummary
WHERE TotalQty > 50
ORDER BY TotalSales DESC;
```

---

## Lesson 2.3: Window Functions (ROW_NUMBER, RANK, DENSE_RANK, SUM() OVER, etc.)

### 1. Explanation

A **window function** performs calculations across a set of table rows that are somehow related to the current row. This is comparable to the type of calculations done with aggregate functions. 

However, unlike regular aggregate functions, window functions **do not cause rows to become grouped** into a single output row. The rows retain their individual identities in the query output, while the calculated values appear on each row.

#### Syntax
```sql
FUNCTION() OVER (
    [PARTITION BY partition_column]
    [ORDER BY sort_column]
)
```
- **`OVER`**: Tells SQL Server that this is a window function.
- **`PARTITION BY`**: Divides the query result set into partitions (groups). The window function is applied to each partition separately. (If omitted, the entire table is treated as one partition).
- **`ORDER BY`**: Establishes the logical sequence of rows within each partition.

#### 1. Ranking Window Functions
- **`ROW_NUMBER()`**: Assigns a unique sequential integer to rows within a partition, starting at 1. No duplicate ranks are assigned, even if values are identical.
- **`RANK()`**: Assigns a rank starting at 1. If duplicate values exist, they receive the **same rank**. However, it leaves a **gap** in the sequence afterward. (e.g. 1, 2, 2, 4, 5).
- **`DENSE_RANK()`**: Similar to `RANK()`, but does **not** leave gaps in the sequence. (e.g. 1, 2, 2, 3, 4).

#### 2. Aggregate Window Functions
You can use standard aggregates (`SUM()`, `AVG()`, `COUNT()`, `MIN()`, `MAX()`) with the `OVER` clause to calculate running totals, cumulative counts, and moving averages.
- *Note:* If you use `SUM(Column) OVER (PARTITION BY A ORDER BY B)`, it calculates a **running total** up to the current row's sorting point. Without `ORDER BY B`, it calculates the **grand total** for the entire partition and prints it on every row.

---

### 2. Practical Real-World Example

Let's rank employees within their departments based on their salary, and display a department-wide running total of salary costs.

#### Table DDL & Sample Data
*(We will use the `Employees` table from Lesson 1.2, but add one duplicate salary to show ranking differences).*
```sql
-- DDL & Data insert (reconstructed for example context)
-- Alice (75k, IT), Bob (48k, HR), Charlie (62k, IT), David (55k, Sales), Emma (42k, Sales), Frank (62k, IT)
```

#### SQL Query Example
```sql
SELECT Department, FirstName, Salary,
       ROW_NUMBER() OVER (PARTITION BY Department ORDER BY Salary DESC) AS RowNum,
       RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) AS Rnk,
       DENSE_RANK() OVER (PARTITION BY Department ORDER BY Salary DESC) AS DenseRnk,
       SUM(Salary) OVER (PARTITION BY Department ORDER BY HireDate ASC) AS DeptRunningSalaryTotal
FROM Employees;
```

#### Results Analysis (Focusing on 'IT' department: Alice $75k, Charlie $62k, Frank $62k)
- **`ROW_NUMBER()`**: Assigns Alice = 1, Charlie = 2, Frank = 3 (or Frank = 2, Charlie = 3, arbitrarily).
- **`RANK()`**: Assigns Alice = 1, Charlie = 2, Frank = 2, next employee = 4 (note the gap; 3 is skipped).
- **`DENSE_RANK()`**: Assigns Alice = 1, Charlie = 2, Frank = 2, next employee = 3 (no gap).
- **`DeptRunningSalaryTotal`**: Adds up the salary chronologically by `HireDate` to calculate a running total of the department's payroll.

---

### 3. Practice Exercise

Using the `Sales` table defined in Lesson 1.4:

```sql
CREATE TABLE Sales (
    SaleID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL,
    SaleDate DATE NOT NULL
);
```

Write a T-SQL query that uses **Window Functions** to retrieve:
1. **`ProductName`**
2. **`Category`**
3. **`TotalPrice`**
4. **`SaleDate`**
5. **`CategoryRank`**: A sequential rank of the sale *within its category*, ordered by **`TotalPrice`** in descending order (highest sale amount gets rank 1). Use **`DENSE_RANK()`**.
6. **`CategoryRunningTotal`**: A running total of the **`TotalPrice`** *for each category*, ordered by the **`SaleDate`** in ascending order.

#### Solution:
```sql
SELECT ProductName, Category, TotalPrice, SaleDate,
       DENSE_RANK() OVER (PARTITION BY Category ORDER BY TotalPrice DESC) AS CategoryRank,
       SUM(TotalPrice) OVER (PARTITION BY Category ORDER BY SaleDate ASC) AS CategoryRunningTotal
FROM Sales;
```

---

## Lesson 2.4: Database Constraints (Primary Key, Foreign Key, Unique, Check, Default, Nullability)

### 1. Explanation

Constraints are rules enforced on data columns in a database table. They restrict the values that can be inserted, updated, or deleted, ensuring the overall **integrity**, accuracy, and reliability of the data.

SQL Server supports several types of constraints:

#### 1. Nullability (`NULL` / `NOT NULL`)
- **`NOT NULL`**: Forces a column to always have a value. Attempts to insert or update a row without providing a value will fail.
- **`NULL`** (Default): Explicitly allows missing, unknown, or inapplicable values in the column.

#### 2. Unique Constraints
- **`PRIMARY KEY`**: Uniquely identifies each row in a table. It implicitly enforces `NOT NULL` and `UNIQUE` constraints. A table can only have **one** primary key. In SQL Server, it also automatically creates a clustered index.
- **`UNIQUE`**: Enforces that all values in a column (or combinations of columns) are distinct. Unlike a primary key, you can have multiple `UNIQUE` constraints in a single table, and it allows **one** row to contain a `NULL` value.

#### 3. Referential Integrity
- **`FOREIGN KEY`**: Enforces a link (relationship) between two tables. It ensures that a value in the referencing column must exist in the referenced table's Primary Key or Unique Key.
- You can configure delete/update actions:
  - `ON DELETE NO ACTION` (default): Raises an error if you delete a parent record referenced by a child record.
  - `ON DELETE CASCADE`: Automatically deletes all child rows when their parent row is deleted.
  - `ON DELETE SET NULL`: Sets the child FK columns to `NULL` when the parent row is deleted.

#### 4. Logic & Default Value Enforcements
- **`CHECK`**: Validates that all values inserted into a column satisfy a boolean condition (e.g. `Price >= 0`). If the check evaluates to false, the record is rejected.
- **`DEFAULT`**: Automatically inserts a specified fallback value if the user inserts a row without providing one (e.g., setting an account creation date to the current date).

---

### 2. Practical Real-World Example

Let's design a `Users` table utilizing a rich set of database rules.

#### Table DDL
```sql
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY, -- Auto-incrementing Primary Key
    Username VARCHAR(50) NOT NULL UNIQUE,  -- Non-nullable and must be unique
    Email VARCHAR(100) NOT NULL UNIQUE,     -- Non-nullable and must be unique
    Age INT NOT NULL CHECK (Age >= 18),    -- CHECK constraint to block minors
    AccountBalance DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (AccountBalance >= 0), -- Default fee with CHECK
    Status VARCHAR(20) NOT NULL DEFAULT 'Active' 
        CHECK (Status IN ('Active', 'Suspended', 'Inactive')) -- Restricted options CHECK
);
```

#### Why We Choose These Constraints
- **`CHECK (Age >= 18)`**: Prevents illegal data inputs at the database level, serving as a backstop in case application-level validation fails.
- **`DEFAULT 0.00`**: Simplifies record creation by allowing new registrations to start with zero balance without requiring the application code to explicitly pass `0.00`.
- **`CHECK (Status IN (...))`**: Restricts inputs to a specific set of allowed strings, functioning similarly to an enum.

---

### 3. Practice Exercise

Let's design a table named **`Subscriptions`** for a streaming media platform.

Write a T-SQL `CREATE TABLE` DDL statement that complies with the following requirements:
1. **`SubscriptionID`**: An auto-incrementing integer starting at 1, serving as the Primary Key.
2. **`CustomerID`**: An integer referencing a `Customers(CustomerID)` table (assume the `Customers` table already exists). It must not allow NULLs.
3. **`SubscriptionType`**: A variable string up to 20 characters. It must not allow NULLs. It must only allow the values: **'Basic'**, **'Standard'**, or **'Premium'**, and it should **default to 'Basic'**.
4. **`MonthlyFee`**: A precise decimal number supporting fees up to `$99.99` (with 2 decimal places). It must not allow NULLs and it **must be greater than or equal to `0.00`**.
5. **`IsActive`**: A boolean flag (`BIT`). It must not allow NULLs and it should **default to 1** (true).
6. **`StartDate`**: A date/time value. It must not allow NULLs and it should **default to the current system date and time**.

#### Solution:
```sql
CREATE TABLE Subscriptions (
    SubscriptionID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customers(CustomerID),
    SubscriptionType VARCHAR(20) NOT NULL DEFAULT 'Basic' 
        CHECK (SubscriptionType IN ('Basic', 'Standard', 'Premium')),
    MonthlyFee DECIMAL(4,2) NOT NULL CHECK (MonthlyFee >= 0.00),
    IsActive BIT NOT NULL DEFAULT 1,
    StartDate DATETIME NOT NULL DEFAULT GETDATE()
);
```

---

## Lesson 2.5: Designing Tables and Views (CREATE TABLE, ALTER TABLE, CREATE VIEW)

### 1. Explanation

To build and scale database applications, administrators and developers write Data Definition Language (DDL) statements to define, modify, and restructure database tables and views.

#### Modifying Tables with `ALTER TABLE`
Once a table is created, business requirements might change. We use `ALTER TABLE` to modify the structure without losing existing data:
- **Add a column:**
  ```sql
  ALTER TABLE TableName ADD ColumnName DataType NULL;
  ```
- **Drop a column:**
  ```sql
  ALTER TABLE TableName DROP COLUMN ColumnName;
  ```
- **Alter a column's properties (data type/nullability):**
  ```sql
  ALTER TABLE TableName ALTER COLUMN ColumnName NewDataType NOT NULL;
  ```
- **Add a constraint:**
  ```sql
  ALTER TABLE TableName ADD CONSTRAINT DF_ColumnName DEFAULT 'Value' FOR ColumnName;
  ```

#### Virtual Tables: `CREATE VIEW`
A **view** is a saved T-SQL query that acts as a virtual table. It does not store physical data (by default). When you query a view, SQL Server executes the underlying query dynamically.

#### Why Use Views?
1. **Security:** Restricts direct table access. You can grant access to a view containing safe columns while masking sensitive information (like passwords or SSNs) in the source tables.
2. **Simplicity:** Hides complex database details (like multiple table joins, calculations, or filters) from developers. They can write simple `SELECT * FROM ViewName` statements.
3. **Consistency:** Centralizes business logic. If a calculation formula changes, you update it once in the view rather than search-and-replace in dozens of application source files.

---

### 2. Practical Real-World Example

Let's alter an existing table to track employee contact information, and then create a view for an active directory.

#### DDL Modifications & View Definition
```sql
-- 1. Add a new nullable phone number column to Employees
ALTER TABLE Employees ADD PhoneNumber VARCHAR(15) NULL;

-- 2. Create a clean view for application consumption
CREATE VIEW v_ActiveEmployeeDirectory AS
SELECT E.EmployeeID, E.FirstName, E.LastName, E.PhoneNumber, D.DeptName
FROM Employees E
INNER JOIN Departments D ON E.DeptID = D.DeptID;
```

#### Querying the View
```sql
-- The application queries the view as if it were a physical table
SELECT FirstName, LastName, DeptName
FROM v_ActiveEmployeeDirectory
WHERE DeptName = 'IT';
```

---

### 3. Practice Exercise

Suppose we have two pre-existing tables in our inventory database:

```sql
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    Price DECIMAL(10,2) NOT NULL
);
```

Write T-SQL statements to perform the following:
1. **Alter** the `Products` table to add a new nullable column named **`DiscountRate`** of type **`DECIMAL(3,2)`**.
2. **Add a DEFAULT constraint** to the newly added `DiscountRate` column so it defaults to **`0.00`**.
3. **Create a View** named **`v_ActiveProductsSummary`** that:
   - Performs an `INNER JOIN` between `Products` and `Categories` on `CategoryID`.
   - Returns: **`ProductID`**, **`ProductName`**, **`Price`**, and **`CategoryName`**.
   - Returns a calculated column named **`DiscountedPrice`**, representing the unit price minus the discount rate (use the formula: `Price * (1.00 - ISNULL(DiscountRate, 0.00))`).
   - Filters the view to only return products belonging to **active categories** (`IsActive = 1`).

#### Solution:
```sql
-- 1. Add column DiscountRate
ALTER TABLE Products ADD DiscountRate DECIMAL(3,2) NULL;

-- 2. Add Default Constraint
ALTER TABLE Products ADD CONSTRAINT DF_DiscountRate DEFAULT 0.00 FOR DiscountRate;

-- 3. Create view
CREATE VIEW v_ActiveProductsSummary AS
SELECT P.ProductID, P.ProductName, P.Price, C.CategoryName,
       P.Price * (1.00 - ISNULL(P.DiscountRate, 0.00)) AS DiscountedPrice
FROM Products P
INNER JOIN Categories C ON P.CategoryID = C.CategoryID
WHERE C.IsActive = 1;
```

---

## Lesson 2.6: Introduction to Indexes (Clustered vs. Non-Clustered Indexes)

### 1. Explanation

An **index** is an on-disk structure associated with a table or view that speeds up the retrieval of rows. Think of it like the index at the back of a massive textbook: instead of reading the entire book page-by-page to find a topic (known in databases as a **Table Scan**), you look up the term in the index and jump directly to the target page numbers (known as an **Index Seek**).

SQL Server structures indexes as B-Trees (Balanced Trees) to perform rapid lookups.

#### 1. Clustered Indexes
- A clustered index sorts and stores the **actual data rows** of the table physically based on the index key.
- Because physical data can only be sorted in one order, a table can have **only one** clustered index.
- Automatically, when you create a `PRIMARY KEY` constraint, SQL Server builds a clustered index on those key columns.
- *Note:* A table without a clustered index is called a **Heap**. Heaps store data in no specific order, which can cause significant performance penalties when searching large tables.

#### 2. Non-Clustered Indexes
- A non-clustered index is a **separate structure** from the table's data rows.
- It contains the index key columns and a pointer (bookmark) back to the actual data row in the clustered index (or the Heap).
- You can have **multiple** (up to 999) non-clustered indexes on a single table.
- This functions exactly like the textbook index, which contains alphabetically ordered keywords pointing to their respective page numbers.

#### 3. Composite Indexes
- An index that contains **more than one column**. 
- The order of columns in a composite index is critical. The index is sorted first by the first column, then by the second, and so on. (For example, an index on `(LastName, FirstName)` is highly efficient for queries filtering on `LastName` or `LastName + FirstName`, but useless for queries filtering on `FirstName` alone).

---

### 2. Practical Real-World Example

Let's look at performance optimizations on a `Customers` database.

#### SQL Examples

**1. Create a non-clustered index to speed up lookup searches by Last Name:**
```sql
CREATE NONCLUSTERED INDEX IX_Employees_LastName 
ON Employees(LastName);
```

**2. Create a unique non-clustered index to speed up user logins by Email:**
```sql
CREATE UNIQUE NONCLUSTERED INDEX UX_Users_Email 
ON Users(Email);
```
*(By declaring it as `UNIQUE`, SQL Server ensures no two rows can have the same email address while optimizing index seeks).*

**3. Create a composite index to optimize queries searching by Department and salary range:**
```sql
CREATE NONCLUSTERED INDEX IX_Employees_Dept_Salary 
ON Employees(Department, Salary);
```

#### Why We Use This Specific Indexing Strategy
- Adding indexes improves **Read** performance (`SELECT` statements), but incurs a cost on **Write** performance (`INSERT`, `UPDATE`, `DELETE` statements) because SQL Server must update the B-Tree structures every time table data changes. Therefore, index columns should be selected carefully based on production query patterns.

---

### 3. Practice Exercise

Suppose we have an `Orders` table with the following structure:

```sql
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    OrderDate DATE NOT NULL,
    Status VARCHAR(20) NOT NULL,
    TotalAmount DECIMAL(10,2) NOT NULL
);
```

Write T-SQL statements to perform the following optimizations:
1. **Create a non-clustered index** named **`IX_Orders_CustomerID`** on the **`CustomerID`** column. Explain in a comment why indexing foreign key columns is considered a database best practice.
2. **Create a composite non-clustered index** named **`IX_Orders_OrderDate_Status`** on the **`OrderDate`** and **`Status`** columns (in that order).

#### Solution:
```sql
-- 1. Indexing FK columns is best practice because:
--    a) These columns are frequently used in JOIN statements. Indexing them avoids expensive table scans during joins.
--    b) It speeds up referential integrity checks (validation) performed by SQL Server during inserts/deletes.
CREATE NONCLUSTERED INDEX IX_Orders_CustomerID 
ON Orders(CustomerID);

-- 2. Create composite index on OrderDate and Status
CREATE NONCLUSTERED INDEX IX_Orders_OrderDate_Status 
ON Orders(OrderDate, Status);
```

---

## Lesson 2.7: Built-in Functions (String manipulation, Date/Time arithmetic, and NULL handling like COALESCE and ISNULL)

### 1. Explanation

SQL Server provides a rich library of built-in functions to process strings, manage dates, and safely handle `NULL` values. Mastering these functions is critical to clean, robust data transformation.

#### 1. String Manipulation Functions
- **`LEN(string)`**: Returns the number of characters in the string, excluding trailing spaces.
- **`SUBSTRING(string, start, length)`**: Extracts a portion of a string. Note that T-SQL uses **1-based indexing** (i.e. the first character is at position 1).
- **`CONCAT(string1, string2, ...)`**: Concatenates multiple strings together. Importantly, it automatically converts `NULL` values into empty strings, avoiding the ANSI behavior where `string + NULL` results in a total `NULL` output.
- **`UPPER(string)` / `LOWER(string)`**: Converts all characters to uppercase or lowercase.
- **`TRIM(string)`**: Removes leading and trailing spaces.

#### 2. Date and Time Arithmetic Functions
- **`GETDATE()`** or **`SYSUTCDATETIME()`**: Returns the database server's current date/time. `SYSUTCDATETIME` returns UTC time with high precision (`DATETIME2`).
- **`DATEADD(datepart, number, date)`**: Adds or subtracts time intervals.
  - *Example:* `DATEADD(day, 30, OrderDate)` adds 30 days to the order date.
- **`DATEDIFF(datepart, startdate, enddate)`**: Calculates the elapsed time between two dates in the units of `datepart` (e.g., `day`, `month`, `year`, `hour`).
  - *Example:* `DATEDIFF(day, OrderDate, DeliveryDate)` returns the number of days taken to deliver.

#### 3. NULL Handling Functions
- **`ISNULL(check_expression, replacement_value)`**: A T-SQL specific function. If `check_expression` is `NULL`, it returns `replacement_value`. It takes exactly two arguments.
- **`COALESCE(expression1, expression2, ...)`**: An ANSI-SQL standard function. It evaluates arguments in order and returns the **first non-NULL** value in the list. It can accept more than two arguments.

---

### 2. Practical Real-World Example

Let's query a `SupportTickets` database to analyze ticket handling metrics.

#### Table DDL & Sample Data
```sql
CREATE TABLE SupportTickets (
    TicketID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerFirstName VARCHAR(50) NOT NULL,
    CustomerLastName VARCHAR(50) NOT NULL,
    OpenDate DATETIME2 NOT NULL,
    CloseDate DATETIME2 NULL, -- NULL indicates the ticket is still open
    Notes NVARCHAR(MAX) NULL
);

INSERT INTO SupportTickets (CustomerFirstName, CustomerLastName, OpenDate, CloseDate, Notes) VALUES
('Jane', 'Doe', '2023-06-01 09:30:00', '2023-06-03 14:00:00', 'Resolved router issue.'),
('John', 'Smith', '2023-06-05 10:15:00', NULL, NULL);
```

#### SQL Query Example
Construct full customer names, calculate ticket durations in days, and output notes safely.

```sql
SELECT TicketID,
       CONCAT(UPPER(CustomerLastName), ', ', CustomerFirstName) AS CustomerFullName,
       DATEDIFF(day, OpenDate, ISNULL(CloseDate, SYSUTCDATETIME())) AS DaysOpen,
       COALESCE(Notes, 'No resolution notes provided.') AS TicketNotes
FROM SupportTickets;
```

#### Why We Use This Specific Syntax
- **`CONCAT`**: Ensures that even if a first name or last name column were to contain a NULL (due to schema edits), the concatenation won't crash into a NULL result.
- **`ISNULL(CloseDate, SYSUTCDATETIME())`**: Allows us to calculate how long open tickets have been active by substituting the missing close date with the current system date.
- **`COALESCE`**: Provides a fallback display value for rows with empty notes.

---

### 3. Practice Exercise

Suppose we have an `Employees` table with the following structure:

```sql
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    HireDate DATE NOT NULL,
    TerminationDate DATE NULL, -- NULL means employee is still active
    PhoneNumber VARCHAR(20) NULL
);
```

Write a T-SQL query that retrieves the following columns for all employees:
1. **`EmployeeID`**
2. **`FullName`**: Constructed in the format **"LASTNAME, FirstName"** (where LASTNAME is entirely capitalized).
3. **`TenureMonths`**: The number of months the employee has been with the company. This is the difference in months between `HireDate` and `TerminationDate`. If the employee is still active, use the current system date as the end date.
4. **`ContactNumber`**: The employee's Phone Number. If `PhoneNumber` is NULL, output the string **'No Phone Listed'**.

#### Solution:
```sql
SELECT EmployeeID,
       CONCAT(UPPER(LastName), ', ', FirstName) AS FullName,
       DATEDIFF(month, HireDate, ISNULL(TerminationDate, GETDATE())) AS TenureMonths,
       ISNULL(PhoneNumber, 'No Phone Listed') AS ContactNumber
FROM Employees;
```

---

## Lesson 3.1: Stored Procedures (Creating, input/output parameters, and execution)

### 1. Explanation

A **stored procedure** is a prepared batch of T-SQL code saved directly in the database. Instead of application servers repeatedly sending large, multi-statement queries over the network, they can execute the stored procedure by name.

#### Key Advantages
1. **Performance:** The first time a stored procedure runs, SQL Server compiles it and caches the execution plan. Subsequent executions use this cached plan, reducing CPU and execution overhead.
2. **Security:** Stored procedures help prevent **SQL Injection** since input parameters are treated strictly as literals, not executable code. Developers can also grant users `EXECUTE` permissions on a procedure without granting them direct `SELECT` or `UPDATE` permissions on the underlying tables (enforcing data separation).
3. **Consistency & Maintainability:** If a business rule or database schema changes, you modify the stored procedure on the server. There is no need to compile, test, and redeploy new versions of consumer application binaries.

#### Input and Output Parameters
- **Input Parameters:** Pass data from the caller into the procedure's query logic.
- **Output Parameters:** Send calculated data, status codes, or values back from the procedure to the caller. They are declared with the **`OUTPUT`** keyword.

---

### 2. Practical Real-World Example

Let's write a stored procedure to insert a sales record and output the employee's total overall sales.

#### Table DDL & Sample Data
```sql
CREATE TABLE SalesLogs (
    SaleID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    SaleDate DATETIME2 DEFAULT SYSUTCDATETIME()
);
```

#### Creating the Stored Procedure
```sql
CREATE PROCEDURE dbo.usp_AddSaleAndGetEmployeeTotal
    @EmployeeID INT,
    @Amount DECIMAL(10,2),
    @TotalSales DECIMAL(10,2) OUTPUT -- Output parameter to return results
AS
BEGIN
    SET NOCOUNT ON; -- Suppresses the "X row(s) affected" message, improving network efficiency.

    -- 1. Insert the new transaction
    INSERT INTO SalesLogs (EmployeeID, Amount)
    VALUES (@EmployeeID, @Amount);

    -- 2. Calculate the updated sum and assign it to the output parameter
    SELECT @TotalSales = SUM(Amount)
    FROM SalesLogs
    WHERE EmployeeID = @EmployeeID;
END;
```

#### Executing the Stored Procedure & Capturing Output
To test it, we declare a local T-SQL variable to capture the returned output parameter:
```sql
DECLARE @EmployeeTotal DECIMAL(10,2);

-- Run the procedure (using the OUTPUT keyword on execution is critical)
EXEC dbo.usp_AddSaleAndGetEmployeeTotal 
    @EmployeeID = 5, 
    @Amount = 150.50, 
    @TotalSales = @EmployeeTotal OUTPUT;

-- Display the returned value
SELECT @EmployeeTotal AS CumulativeSalesForEmployee;
```

---

### 3. Practice Exercise

Suppose we have a `Products` table defined as:

```sql
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL
);
```

Write T-SQL scripts to do the following:
1. **Create a Stored Procedure** named **`sp_UpdateStockAndGetPrice`** that accepts:
   - **`@ProductID`** (INT) as an input parameter.
   - **`@QuantityChange`** (INT) as an input parameter representing stock adjustments (it can be positive for incoming stock, or negative for product sales).
   - **`@CurrentPrice`** (DECIMAL(10,2)) as an **OUTPUT** parameter.
   - The procedure should:
     - Update the `StockQuantity` for the product by adding `@QuantityChange` to its current value.
     - Retrieve the product's unit `Price` and assign it to the `@CurrentPrice` output parameter.
2. Write a T-SQL query demonstrating how to **declare a variable**, **execute** this stored procedure for a product (e.g. ProductID = 1, adjusting stock by -5 units), and **select** the captured output price.

#### Solution:
```sql
-- 1. Create Stored Procedure
CREATE PROCEDURE dbo.sp_UpdateStockAndGetPrice
    @ProductID INT,
    @QuantityChange INT,
    @CurrentPrice DECIMAL(10,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Update stock quantity
    UPDATE Products
    SET StockQuantity = StockQuantity + @QuantityChange
    WHERE ProductID = @ProductID;

    -- Retrieve product price
    SELECT @CurrentPrice = Price
    FROM Products
    WHERE ProductID = @ProductID;
END;
GO

-- 2. Execute Stored Procedure
DECLARE @PriceOutput DECIMAL(10,2);

EXEC dbo.sp_UpdateStockAndGetPrice
    @ProductID = 1,
    @QuantityChange = -5,
    @CurrentPrice = @PriceOutput OUTPUT;

SELECT @PriceOutput AS ProductPriceAfterUpdate;
```

---

## Lesson 3.2: User-Defined Functions (Scalar and Table-Valued Functions)

### 1. Explanation

A **User-Defined Function (UDF)** is a database object that encapsulates logic and returns a value. UDFs allow you to reuse code blocks in multiple queries.

#### Key Differences Between Stored Procedures and Functions
- **Side Effects:** Functions **cannot** make permanent changes to the database. Running DML statements (like `INSERT`, `UPDATE`, or `DELETE` against physical tables) inside a UDF is strictly forbidden.
- **Execution context:** Stored procedures must be executed using `EXEC`. Functions, however, are expressions and can be called directly inside `SELECT` lists, `WHERE` clauses, `HAVING` clauses, or even `JOIN` statements.

T-SQL supports two primary categories of functions:

#### 1. Scalar Functions
Returns a **single data value** (e.g., an `INT`, `DATETIME`, or `VARCHAR`).
- **Syntax:**
  ```sql
  CREATE FUNCTION dbo.fn_Name (@Parameter DataType)
  RETURNS ReturnDataType
  AS
  BEGIN
      -- Logic
      RETURN @ReturnValue;
  END;
  ```
- > [!IMPORTANT]
  > **The Schema Rule for Scalar UDFs**
  > When executing a scalar User-Defined Function, you **must** prefix the function name with its schema (typically `dbo.`). For example, writing `SELECT fn_CalculateTax(Price) ...` will fail. You must write `SELECT dbo.fn_CalculateTax(Price) ...`.

#### 2. Table-Valued Functions (TVF)
Returns an **entire result set (a virtual table)**. These are highly useful as parameterized views.
- **Inline Table-Valued Functions (ITVFs):** Returns a table directly from a single `SELECT` statement. Because they contain no procedural block (`BEGIN...END`), SQL Server compiles them directly into the calling query's execution plan. They perform exceptionally well.
  - **Syntax:**
    ```sql
    CREATE FUNCTION dbo.fn_GetActiveUsers (@Status VARCHAR(20))
    RETURNS TABLE
    AS
    RETURN (
        SELECT UserID, Username FROM Users WHERE Status = @Status
    );
    ```

---

### 2. Practical Real-World Example

Let's build a scalar function to calculate discounts and an Inline TVF to filter active items.

#### SQL Code
```sql
-- Scalar function to calculate discounted pricing
CREATE FUNCTION dbo.fn_CalculateDiscount (@Price DECIMAL(10,2), @DiscountRate DECIMAL(3,2))
RETURNS DECIMAL(10,2)
AS
BEGIN
    RETURN @Price * (1.00 - ISNULL(@DiscountRate, 0.00));
END;
GO

-- Inline TVF to retrieve electronics products below a specific price threshold
CREATE FUNCTION dbo.fn_GetCheapElectronics (@MaxPrice DECIMAL(10,2))
RETURNS TABLE
AS
RETURN (
    SELECT ProductID, ProductName, Price
    FROM Products
    WHERE Category = 'Electronics' AND Price <= @MaxPrice
);
GO

-- Using BOTH in a single query
SELECT ProductID, ProductName, Price, 
       dbo.fn_CalculateDiscount(Price, 0.15) AS DiscountedPrice15Percent
FROM dbo.fn_GetCheapElectronics(500.00);
```

---

### 3. Practice Exercise

Suppose we have an `Employees` table with this structure:

```sql
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Department VARCHAR(50) NOT NULL,
    Salary DECIMAL(10,2) NOT NULL,
    HireDate DATE NOT NULL
);
```

Write T-SQL scripts to do the following:
1. **Create a Scalar Function** named **`dbo.fn_GetYearsOfService`** that accepts **`@EmployeeID`** (INT) as input and returns an **`INT`** representing the number of full years between the employee's `HireDate` and the current date (use `DATEDIFF` with `year`).
2. **Create an Inline Table-Valued Function (ITVF)** named **`dbo.fn_GetEmployeesByDept`** that accepts **`@DeptName`** (VARCHAR(50)) as input and returns a table containing: **`EmployeeID`**, **`FirstName`**, **`LastName`**, and **`Salary`** of all employees in that department.
3. Write a **`SELECT` query** demonstrating how to call the ITVF to fetch employees in the **'IT'** department, and call the scalar function `dbo.fn_GetYearsOfService(EmployeeID)` to include each employee's years of service in the output columns.

#### Solution:
```sql
-- 1. Create Scalar Function
CREATE FUNCTION dbo.fn_GetYearsOfService (@EmployeeID INT)
RETURNS INT
AS
BEGIN
    DECLARE @Years INT;
    SELECT @Years = DATEDIFF(year, HireDate, GETDATE())
    FROM Employees
    WHERE EmployeeID = @EmployeeID;
    RETURN @Years;
END;
GO

-- 2. Create Inline TVF
CREATE FUNCTION dbo.fn_GetEmployeesByDept (@DeptName VARCHAR(50))
RETURNS TABLE
AS
RETURN (
    SELECT EmployeeID, FirstName, LastName, Salary
    FROM Employees
    WHERE Department = @DeptName
);
GO

-- 3. Query combining both functions
SELECT EmployeeID, FirstName, LastName, Salary, 
       dbo.fn_GetYearsOfService(EmployeeID) AS YearsOfService
FROM dbo.fn_GetEmployeesByDept('IT');
```

---

## Lesson 3.3: Triggers (AFTER and INSTEAD OF triggers, utilizing Inserted and Deleted tables)

### 1. Explanation

A **trigger** is a special class of stored procedure that executes (fires) automatically in response to certain database server events. DML triggers fire when a user performs a Data Manipulation Language (DML) action (`INSERT`, `UPDATE`, or `DELETE`) on a table or view.

There are two primary types of DML triggers:

#### 1. `AFTER` (or `FOR`) Triggers
Fires **after** the triggering DML action successfully completes and all constraints (such as Primary Keys, Foreign Keys, or Check Constraints) have passed validation.
- Typically used for auditing logs, calculating totals in separate tables, or syncing auxiliary data.

#### 2. `INSTEAD OF` Triggers
Fires **in place of** the triggering DML action. The original statement is discarded, and the instructions inside the trigger execute instead.
- Typically used to implement insert, update, or delete capabilities on complex views that contain multiple joins and would otherwise be read-only.

#### The `inserted` and `deleted` Logical Tables
When a DML trigger executes, SQL Server maintains two temporary, memory-resident tables called **`inserted`** and **`deleted`**. They share the exact structural schema as the target table.
- **`inserted`**: Contains the new rows added during `INSERT` statements, or the modified rows during `UPDATE` statements.
- **`deleted`**: Contains the old values removed during `DELETE` statements, or the old values prior to modification during `UPDATE` statements.

| DML Statement | `inserted` Table Content | `deleted` Table Content |
| :--- | :--- | :--- |
| **`INSERT`** | New rows being added | Empty |
| **`DELETE`** | Empty | Rows being deleted |
| **`UPDATE`** | New modified values | Old pre-modified values |

---

### 2. Practical Real-World Example

Let's build an auditing trigger on a `Products` table to write history logs to an `AuditLogs` table whenever items are deleted.

#### Table DDL & Sample Data
```sql
CREATE TABLE AuditLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    Action VARCHAR(10) NOT NULL,
    TableName VARCHAR(50) NOT NULL,
    RecordID INT NOT NULL,
    LogDate DATETIME2 DEFAULT SYSUTCDATETIME(),
    PerformedBy VARCHAR(100) DEFAULT SUSER_SNAME()
);
```

#### Creating the AFTER DELETE Trigger
```sql
CREATE TRIGGER trg_Products_AuditDelete
ON Products
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Copy details of deleted rows from the 'deleted' logical table
    INSERT INTO AuditLogs (Action, TableName, RecordID)
    SELECT 'DELETE', 'Products', ProductID
    FROM deleted;
END;
GO
```

#### How It Works
If a user runs `DELETE FROM Products WHERE ProductID = 10`, SQL Server processes the delete, routes a copy of the row matching `ProductID = 10` to the temporary `deleted` table, and automatically executes `trg_Products_AuditDelete`, logging the transaction to `AuditLogs`.

---

### 3. Practice Exercise

Suppose we have an `Employees` table and a `SalaryChangeLogs` auditing table defined as:

```sql
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Salary DECIMAL(10,2) NOT NULL
);

CREATE TABLE SalaryChangeLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT NOT NULL,
    OldSalary DECIMAL(10,2) NOT NULL,
    NewSalary DECIMAL(10,2) NOT NULL,
    ChangeDate DATETIME2 DEFAULT SYSUTCDATETIME()
);
```

Write T-SQL code to do the following:
1. **Create an `AFTER UPDATE` Trigger** named **`trg_Employees_SalaryAudit`** on the `Employees` table.
2. The trigger must:
   - Check if the `Salary` column was updated (use the T-SQL system function `UPDATE(Salary)`).
   - If it was updated, insert a record into `SalaryChangeLogs` containing the `EmployeeID`, the old salary (from the `deleted` table), the new salary (from the `inserted` table), and the current timestamp.
   - Only log rows where the salary value actually changed (i.e. `NewSalary <> OldSalary`) to avoid writing logs when a query updates a row but sets the salary to the exact same value.

#### Solution:
```sql
CREATE TRIGGER trg_Employees_SalaryAudit
ON Employees
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the Salary column was part of the update statement
    IF UPDATE(Salary)
    BEGIN
        -- Insert salary adjustments only when they physically change
        INSERT INTO SalaryChangeLogs (EmployeeID, OldSalary, NewSalary)
        SELECT i.EmployeeID, d.Salary, i.Salary
        FROM inserted i
        INNER JOIN deleted d ON i.EmployeeID = d.EmployeeID
        WHERE i.Salary <> d.Salary;
    END;
END;
```

---

## Lesson 3.4: Transactions and Error Handling (BEGIN TRAN, COMMIT, ROLLBACK, and TRY...CATCH blocks)

### 1. Explanation

A **transaction** is a single logical unit of work containing one or more SQL statements. Transactions ensure data integrity by enforcing **ACID** properties (Atomicity, Consistency, Isolation, and Durability). Essentially: either **all** database updates in a transaction succeed and are saved, or they **all** fail and are completely undone.

#### Transaction Control Commands
- **`BEGIN TRANSACTION`** (or `BEGIN TRAN`): Marks the boundary point where a transactional unit of work starts.
- **`COMMIT TRANSACTION`** (or `COMMIT`): Saves all modifications made since the start of the transaction permanently to disk.
- **`ROLLBACK TRANSACTION`** (or `ROLLBACK`): Reverts the database state back to the point before `BEGIN TRAN` was executed, undoing all pending changes.

#### Error Handling with `TRY...CATCH`
To manage runtime exceptions (such as constraint violations, divides-by-zero, or custom exceptions), SQL Server provides structured error handling:
- **`BEGIN TRY ... END TRY`**: Contains the SQL code you wish to execute. If a statement inside the `TRY` block throws an error, execution immediately breaks out and routes to the `CATCH` block.
- **`BEGIN CATCH ... END CATCH`**: Contains error handling, logging, and recovery logic.

#### The Transaction + Error Handling Pattern
Within the `CATCH` block, it is a critical database best practice to inspect **`@@TRANCOUNT`** (a system variable returning the number of active transaction locks). If a transaction is active, you must run `ROLLBACK` to prevent locking tables.

---

### 2. Practical Real-World Example

Let's write a stored procedure to transfer funds between two bank accounts securely.

#### Table DDL & Sample Data
```sql
CREATE TABLE Accounts (
    AccountID INT PRIMARY KEY,
    OwnerName VARCHAR(50) NOT NULL,
    Balance DECIMAL(10,2) NOT NULL CHECK (Balance >= 0.00)
);

INSERT INTO Accounts VALUES (1, 'Alice', 500.00), (2, 'Bob', 100.00);
```

#### Creating the Safe Transfer Stored Procedure
```sql
CREATE PROCEDURE dbo.usp_TransferFunds
    @SenderID INT,
    @ReceiverID INT,
    @Amount DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Start Transaction
        BEGIN TRANSACTION;

        -- 1. Deduct funds from sender (triggers balance CHECK constraint if funds are insufficient)
        UPDATE Accounts
        SET Balance = Balance - @Amount
        WHERE AccountID = @SenderID;

        -- 2. Add funds to receiver
        UPDATE Accounts
        SET Balance = Balance + @Amount
        WHERE AccountID = @ReceiverID;

        -- If both updates succeeded, commit changes
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- If an error occurred and we have an open transaction, ROLLBACK
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END;

        -- Re-throw the error back to the application layer
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH;
END;
```

---

### 3. Practice Exercise

Suppose we are building an order fulfillment module with the following tables:

```sql
CREATE TABLE Inventory (
    ProductID INT PRIMARY KEY,
    Stock INT NOT NULL CHECK (Stock >= 0)
);

CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    Qty INT NOT NULL
);
```

Write T-SQL code to do the following:
1. **Create a Stored Procedure** named **`dbo.usp_PlaceOrder`** that accepts input parameters: **`@ProductID`** (INT) and **`@Qty`** (INT).
2. The procedure must use a **`TRY...CATCH`** structure to wrap a transactional execution:
   - **`BEGIN TRAN`** at the start of the `TRY` block.
   - **Deduct** `@Qty` from `Inventory.Stock` for the specified `@ProductID`.
   - **Insert** the order row into the `Orders` table.
   - Run a check to see if the product's remaining stock has dropped below 0. If it has, raise a custom exception using **`THROW 50000, 'Insufficient inventory stock to complete this order.', 1;`** to force transaction abortion.
   - **`COMMIT`** the transaction at the end of the `TRY` block.
   - In the **`CATCH`** block, check if a transaction is open (`@@TRANCOUNT > 0`). If so, **`ROLLBACK`** it. Then, use **`THROW`** (with no parameters) to re-raise the caught exception.

#### Solution:
```sql
CREATE PROCEDURE dbo.usp_PlaceOrder
    @ProductID INT,
    @Qty INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Deduct stock from inventory
        UPDATE Inventory
        SET Stock = Stock - @Qty
        WHERE ProductID = @ProductID;

        -- 2. Verify we still have stock
        DECLARE @CurrentStock INT;
        SELECT @CurrentStock = Stock 
        FROM Inventory 
        WHERE ProductID = @ProductID;

        IF @CurrentStock < 0 
        BEGIN
            THROW 50000, 'Insufficient inventory stock to complete this order.', 1;
        END;

        -- 3. Record the transaction
        INSERT INTO Orders (ProductID, Qty)
        VALUES (@ProductID, @Qty);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- Rollback if transaction is open
        IF @@TRANCOUNT > 0
        BEGIN
            ROLLBACK TRANSACTION;
        END;

        -- Re-throw exception
        THROW;
    END CATCH;
END;
```

---

## Lesson 3.5: Query Optimization Basics (Reading Execution Plans, parameter sniffing, and sargability)

### 1. Explanation

Query optimization is the process of writing queries and designing objects so SQL Server retrieves data with minimal CPU, memory, and disk reads.

#### 1. Reading Execution Plans
An execution plan is a graphical map showing how the SQL Server Query Optimizer runs a query. Common operations include:
- **Table Scan / Clustered Index Scan:** The optimizer must read **every single row** in the table from start to finish. This is highly inefficient on large tables.
- **Index Seek / Clustered Index Seek:** Highly efficient. The optimizer uses a B-Tree index to pinpoint only the exact rows needed, skipping the rest of the table.
- **Key Lookup (or Bookmark Lookup):** Occurs when the engine uses a non-clustered index, but your query requests columns not included in that index. The engine must jump back to the clustered index to fetch the missing columns for *every* matched row, resulting in high random I/O.
  - *Fix:* Create a **covering index** that uses the `INCLUDE` clause to attach the requested columns directly to the index's leaf nodes.

#### 2. Sargability (Search Argument-able)
A query is **sargable** if the engine can leverage an index to perform an **Index Seek**.
- Queries become **non-sargable** when you apply a function, math operation, or implicit data type conversion directly to an indexed column in the `WHERE` clause. This prevents SQL Server from using the index tree directly, forcing it to evaluate the function for every row (Index Scan).

| Non-Sargable (Bad) | Sargable (Good) | Why? |
| :--- | :--- | :--- |
| `WHERE YEAR(OrderDate) = 2023` | `WHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'` | Applying `YEAR()` forces evaluation on every row. |
| `WHERE LEFT(Sku, 4) = 'PROD'` | `WHERE Sku LIKE 'PROD%'` | Using a function prevents index seeks. |
| `WHERE ISNULL(Status, 'A') = 'A'`| `WHERE Status = 'A' OR Status IS NULL` | Applying `ISNULL()` blocks the index. |

#### 3. Parameter Sniffing
When a stored procedure compiles for the first time, SQL Server inspects ("sniffs") the parameters passed in to construct an execution plan optimized for those specific inputs.
- If the first parameter is atypical (e.g. searching for a term that matches 95% of rows, yielding a Table Scan plan), SQL Server caches that plan. Subsequent calls requesting only 1 row will use the cached, highly inefficient Table Scan plan.
- *Fixes:* Use local variables in the procedure, attach `OPTION (RECOMPILE)` to compile the query on every execution, or use `OPTIMIZE FOR` hints.

---

### 2. Practical Real-World Example

Let's optimize a query retrieving employee details based on their years of service.

#### Non-Sargable Query (Forces Index Scan)
```sql
SELECT EmployeeID, FirstName, LastName
FROM Employees
WHERE DATEDIFF(year, HireDate, GETDATE()) >= 10;
```
*(Because `HireDate` is wrapped in `DATEDIFF`, SQL Server must compute `DATEDIFF` on every single employee row in the table, ignoring any index on `HireDate`).*

#### Sargable Query (Performs Index Seek)
```sql
SELECT EmployeeID, FirstName, LastName
FROM Employees
WHERE HireDate <= DATEADD(year, -10, GETDATE());
```
*(By computing the threshold date first, we compare `HireDate` directly against a static date literal. This allows SQL Server to perform a fast Index Seek).*

---

### 3. Practice Exercise

Rewrite the following three non-sargable conditions so that they are fully **sargable**, allowing the Query Optimizer to perform an **Index Seek** on the filter columns.

1. **Condition 1 (Date Part Extraction):**
   ```sql
   WHERE DATEPART(year, OrderDate) = 2022
   ```
2. **Condition 2 (String Prefix Lookup):**
   ```sql
   WHERE SUBSTRING(SkuCode, 1, 4) = 'PROD'
   ```
3. **Condition 3 (NULL Handling Fallback):**
   ```sql
   WHERE ISNULL(Status, 'Pending') = 'Pending'
   ```

#### Solution:
1. **Condition 1 Rewritten:**
   ```sql
   WHERE OrderDate >= '2022-01-01' AND OrderDate < '2023-01-01'
   ```
2. **Condition 2 Rewritten:**
   ```sql
   WHERE SkuCode LIKE 'PROD%'
   ```
3. **Condition 3 Rewritten:**
   ```sql
   WHERE Status = 'Pending' OR Status IS NULL
   ```

---

## Lesson 3.6: Dynamic SQL (Using sp_executesql and understanding SQL injection risks)

### 1. Explanation

**Dynamic SQL** is a programming technique that allows you to construct a SQL query dynamically as a text string at runtime and then execute it.

#### Why Use Dynamic SQL?
1. **Dynamic Database Objects:** Standard T-SQL does not allow you to use variables in place of table names or column names (e.g. `SELECT * FROM @TableName` is invalid). Dynamic SQL allows you to construct these queries dynamically.
2. **Complex Search Filters:** When a user can query data using any combination of 10 optional filters, writing a static query using `AND (@Param IS NULL OR Col = @Param)` can yield terrible execution plans. Building a SQL string containing only the active filters optimizes performance.

#### Methods of Execution
- **`EXEC (@SQLString)`**: Concatenates strings and runs them. **Avoid this method.** It does not support parameterization, is highly vulnerable to SQL Injection, and prevents plan caching.
- **`sp_executesql`**: The recommended system stored procedure. It accepts a parameterized SQL string and parameter declarations. It encourages plan reuse and protects against SQL injection.

#### SQL Injection Risks & Defenses
SQL Injection occurs when an attacker manipulates dynamic queries by appending malicious SQL commands (e.g., entering `' OR 1=1; DROP TABLE Users; --` into a text field).

**How to secure Dynamic SQL:**
1. **Parameterize Input Values:** Pass parameters to `sp_executesql` rather than stitching them directly into the SQL string.
2. **Sanitize Object Identifiers:** When table names or column names must be variable, pass them through the T-SQL system function **`QUOTENAME()`**. It wraps the string in brackets (e.g., converting `MyTable` to `[MyTable]`), preventing attackers from breakout commands.

---

### 2. Practical Real-World Example

Let's build a safe, parameterized dynamic query to filter employees.

#### Safe Dynamic Query Stored Procedure
```sql
CREATE PROCEDURE dbo.usp_GetEmployeesSafely
    @Department VARCHAR(50) = NULL,
    @MinSalary DECIMAL(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SQL NVARCHAR(MAX);
    DECLARE @ParamList NVARCHAR(MAX);

    -- 1. Initialize base query
    SET @SQL = N'SELECT EmployeeID, FirstName, LastName, Department, Salary 
                 FROM Employees 
                 WHERE 1 = 1'; -- Dummy filter simplifies appending 'AND' conditions

    -- 2. Append filters dynamically
    IF @Department IS NOT NULL
        SET @SQL = @SQL + N' AND Department = @pDept';

    IF @MinSalary IS NOT NULL
        SET @SQL = @SQL + N' AND Salary >= @pMinSalary';

    -- 3. Declare parameter types
    SET @ParamList = N'@pDept VARCHAR(50), @pMinSalary DECIMAL(10,2)';

    -- 4. Execute safely using sp_executesql
    EXEC sp_executesql 
        @stmt = @SQL, 
        @params = @ParamList, 
        @pDept = @Department, 
        @pMinSalary = @MinSalary;
END;
```

---

### 3. Practice Exercise

Write a T-SQL stored procedure named **`dbo.usp_SafeTableSearch`** that performs a lookup search against any arbitrary table and column in the database, protected against SQL injection.

The procedure must accept three input parameters:
1. **`@TableName`** (NVARCHAR(128)) - The name of the table to query.
2. **`@SearchColumn`** (NVARCHAR(128)) - The name of the column to filter on.
3. **`@SearchValue`** (NVARCHAR(100)) - The literal value to search for.

The procedure should:
- Safely escape `@TableName` and `@SearchColumn` against SQL Injection using `QUOTENAME()`.
- Construct a dynamic SQL statement in the format: `SELECT * FROM [TableName] WHERE [ColumnName] = @pVal`.
- Execute the statement safely using `sp_executesql`, passing `@SearchValue` as a parameter.

#### Solution:
```sql
CREATE PROCEDURE dbo.usp_SafeTableSearch
    @TableName NVARCHAR(128),
    @SearchColumn NVARCHAR(128),
    @SearchValue NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SQL NVARCHAR(MAX);

    -- Construct dynamic SQL. Table and Column identifiers are escaped safely.
    SET @SQL = N'SELECT * FROM ' + QUOTENAME(@TableName) + 
               N' WHERE ' + QUOTENAME(@SearchColumn) + N' = @pVal';

    -- Execute query safely using parameterization
    EXEC sp_executesql 
        @stmt = @SQL, 
        @params = N'@pVal NVARCHAR(100)', 
        @pVal = @SearchValue;
END;
```

---

## Lesson 3.7: Advanced Indexing and Partitioning concepts

### 1. Explanation

As databases grow to contain millions or billions of rows, simple indexing is no longer sufficient. Enterprise SQL Server databases leverage advanced indexing structures and data layout architectures to scale query execution.

#### 1. Covering Indexes (Using `INCLUDE`)
A non-clustered index is "covering" if it contains all the columns requested by a query.
- When an index only contains the `WHERE` clause column, but your query selects three other columns, SQL Server performs a **Key Lookup** to the clustered index to fetch those extra values. This causes massive random I/O.
- By using the **`INCLUDE`** clause, you can attach non-key columns to the leaf nodes of the non-clustered index. 
- *Why is it better than a composite key?* SQL Server does not sort the columns inside the `INCLUDE` block. This reduces index sizes, keeps B-Tree depth shallow, and minimizes transaction log overhead on writes.
  - **Syntax:**
    ```sql
    CREATE NONCLUSTERED INDEX IX_Orders_OrderDate 
    ON Orders(OrderDate) 
    INCLUDE (CustomerID, TotalAmount);
    ```

#### 2. Filtered Indexes
A filtered index is a non-clustered index that includes a `WHERE` clause inside its definition. It only indexes rows matching that filter.
- **Benefits:** Saves significant disk storage space, reduces index maintenance overhead on inserts, and makes seeks highly targeted.
  - **Syntax:**
    ```sql
    CREATE NONCLUSTERED INDEX IX_Orders_PendingStatus 
    ON Orders(OrderDate) 
    WHERE Status = 'Pending';
    ```

#### 3. Table Partitioning
Partitioning divides very large tables and indexes into smaller, physical chunks (partitions) based on a column key (e.g. ranges of years or ranges of IDs), while maintaining a single, logical table interface.
- **Key Concepts:**
  - **Partition Function:** Defines the logical boundaries of how table data is divided (e.g., partition 1: dates `< 2024`, partition 2: dates `2024` to `2025`).
  - **Partition Scheme:** Maps the logical partitions onto physical database files/filegroups.
- **Benefits:**
  - **Partition Elimination:** If you query `WHERE TransactionDate = '2025-06-01'`, SQL Server immediately skips reading all other partitions, reducing logical I/O.
  - **Fast Archiving (Metadata Switch):** You can remove an entire year of data (millions of rows) instantly by switching a partition out into a staging table—a metadata-only change that takes milliseconds and uses zero transaction log space.

---

### 2. Practical Real-World Example

Let's optimize a high-frequency lookup query selecting customer activity.

#### Query to Optimize
```sql
SELECT CustomerID, TotalAmount 
FROM Orders 
WHERE OrderDate = '2023-06-26';
```

#### Optimizing with a Covering Index
If we only indexed `OrderDate`, SQL Server would seek the index, but then execute a Key Lookup for *every* matching row to fetch `CustomerID` and `TotalAmount`. We cover the query:
```sql
CREATE NONCLUSTERED INDEX IX_Orders_OrderDate_Cover
ON Orders(OrderDate)
INCLUDE (CustomerID, TotalAmount);
```
*(Now, the Query Optimizer performs a pure **Index Seek** with zero Key Lookups because all columns in the SELECT and WHERE statements are stored in the index).*

---

### 3. Practice Exercise

Suppose we are managing a high-volume warehouse system with an `InventoryLogs` table structured as:

```sql
CREATE TABLE InventoryLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    TransactionDate DATE NOT NULL,
    AdjustedQuantity INT NOT NULL,
    LocationCode VARCHAR(10) NULL
);
```

Write T-SQL statements to perform the following advanced index optimizations:
1. **Create a covering non-clustered index** named **`IX_InventoryLogs_ProductDate`** on key columns **`ProductID`** and **`TransactionDate`** (in that order). **Include** the columns **`AdjustedQuantity`** and **`LocationCode`** in the index leaf nodes. Write a comment (`--`) explaining why using `INCLUDE` is better than creating a composite index key containing all four columns.
2. **Create a filtered index** named **`IX_InventoryLogs_NullLocation`** on the **`TransactionDate`** column, containing only the rows where **`LocationCode` is NULL**.

#### Solution:
```sql
-- 1. Create covering index on ProductID and TransactionDate
--    *Why INCLUDE is better than a composite key of all 4 columns:*
--    Included columns are only stored at the index leaf node level, not in the index B-tree itself.
--    This means SQL Server does not sort them. Doing so keeps the index tree narrower/shallow,
--    saves index storage size, and reduces write overhead since the engine doesn't sort
--    AdjustedQuantity and LocationCode when rows are updated.
CREATE NONCLUSTERED INDEX IX_InventoryLogs_ProductDate
ON InventoryLogs (ProductID, TransactionDate)
INCLUDE (AdjustedQuantity, LocationCode);

-- 2. Create filtered index on TransactionDate where LocationCode is NULL
CREATE NONCLUSTERED INDEX IX_InventoryLogs_NullLocation
ON InventoryLogs (TransactionDate)
WHERE LocationCode IS NULL;
```

---

## Course Completed! 🎓

Congratulations! You have completed the entire curriculum, covering basic, intermediate, and advanced concepts in Microsoft SQL Server (T-SQL) database administration and development. You are now equipped with the core knowledge to design tables, formulate highly optimized queries, handle exceptions, write secure dynamic queries, and manage indexes at enterprise scale.

Keep practicing and refer to this workspace workbook whenever you need a quick reference.
