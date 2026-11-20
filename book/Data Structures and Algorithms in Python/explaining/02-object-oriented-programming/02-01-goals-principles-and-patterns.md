<span id="top"></span>

# Object-Oriented Programming — Section 2.1: Goals, Principles, and Patterns

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.1, printed pages 57–61 of the supplied PDF.  
> **Topic:** Section 2.1; 2.1.1 Object-Oriented Design Goals; 2.1.2 Object-Oriented Design Principles; 2.1.3 Design Patterns.  
> **Domain focus:** The **MotoGP Practice session at the 2026 Indonesian Grand Prix**, Friday 9 October, at Mandalika.  
> **Learning goal:** Explain each design idea, show why a small timing example fits it, and work through one runnable program.  
> **User Prompt:** "Reexplain [Section 2.1] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One MotoGP Practice Session](#background-intuition)
   - [1. The verified session data](#background-data)
   - [2. Why make a result an object?](#background-objects)
2. [Part 1: Section 2.1 — The Design Map](#part-1)
   - [1. Object, class, interface, and implementation](#part-1-vocabulary)
   - [2. Goals, principles, and patterns answer different questions](#part-1-map)
3. [Part 2: Section 2.1.1 — Object-Oriented Design Goals](#part-2)
   - [1. Robustness](#part-2-robustness)
   - [2. Adaptability](#part-2-adaptability)
   - [3. Reusability](#part-2-reusability)
4. [Part 3: Section 2.1.2 — Object-Oriented Design Principles](#part-3)
   - [1. Modularity](#part-3-modularity)
   - [2. Abstraction and abstract data types](#part-3-abstraction)
   - [3. Duck typing and abstract base classes](#part-3-interfaces)
   - [4. Encapsulation](#part-3-encapsulation)
5. [Part 4: Section 2.1.3 — Design Patterns](#part-4)
   - [1. What a pattern describes](#part-4-description)
   - [2. Algorithm design patterns](#part-4-algorithms)
   - [3. Software engineering patterns and an Adapter example](#part-4-software)
6. [Part 5: A Complete Practice-Result Program](#part-5)
   - [1. Define the problem and plan](#part-5-plan)
   - [2. Run the program](#part-5-program)
   - [3. Trace the calculations and design choices](#part-5-trace)
7. [Part 6: Summary](#part-6)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One MotoGP Practice Session

<span id="background-data"></span>

### 1. The verified session data

We will use **Friday's MotoGP Practice**, not the separate Free Practice 1 session or the weekend's Sprint and Grand Prix. The [full Practice classification published by Yamaha Factory Racing](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) gives the following best laps; the [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) confirms the session and Raúl Fernández's fastest time.

| Practice place | Rider | Team | Best lap | Seconds | Milliseconds |
| :---: | :--- | :--- | ---: | ---: | ---: |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | 88.725 | 88,725 |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | 89.426 | 89,426 |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP | 1:29.558 | 89.558 | 89,558 |

A lap written as `1:29.426` is **one minute and 29.426 seconds**. Thus Marc's lap is `60 + 29.426 = 89.426` seconds, or `89,426` milliseconds. A lower best-lap time is quicker. Fabio's best lap took `89,558 − 89,426 = 132` milliseconds longer than Marc's, so the difference is **0.132 seconds**. The gap from Raúl's P1 time to Marc's is **0.701 seconds**; to Fabio's it is **0.833 seconds**.

**Why this example?** Three real results from one session let us compare like with like. The arithmetic is small enough to check by hand, leaving room to focus on program design. **How to solve a lap-gap question:** select two best laps from this same Practice classification, convert each to the same unit, subtract the quicker time from the slower one, and label the result in seconds.

<span id="background-objects"></span>

### 2. Why make a result an object?

A Practice result has several related facts: rider, team, session, and best-lap time. We also want operations such as converting milliseconds to seconds and finding a difference between two laps. An **object** can keep the data and operations together:

```text
Marc's PracticeResult
├─ rider: Marc Márquez
├─ team: Ducati Lenovo Team
├─ best lap: 89,426 ms
├─ lap_seconds() → 89.426
└─ difference_seconds(Raúl's result) → 0.701
```

The diagram describes the **teaching model** we will build; it is not an official MotoGP data format. We use integer milliseconds internally because official lap times are precise to thousandths of a second. Dividing by `1000` gives seconds for display.

**Why this example?** A result naturally groups related facts, and both reports below need the same conversion rule. **How to design it:** identify the facts that belong to one result, give the result a small set of useful operations, then decide which details callers should see.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 2.1 — The Design Map

<span id="part-1-vocabulary"></span>

### 1. Object, class, interface, and implementation

A **class** describes a kind of object. An **object** is one instance of that class. `PracticeResult` is the class we will write; Marc's, Fabio's, and Raúl's results are three distinct objects. Each object has its own rider, team, and best-lap time.

The class's **interface** is what another part of the program is promised it can use. For our example, a report can read a rider's name and call `lap_seconds()` or `difference_seconds(reference)`. The **implementation** is how those promises are fulfilled: the class stores an integer `_lap_ms` and divides by `1000` when needed. A caller needs the promise and its meaning, not the storage formula.

```python
# The eventual public use will look like this:
print(marc.rider)                 # Marc Márquez
print(marc.lap_seconds())         # 89.426
print("{:.3f}".format(fabio.difference_seconds(marc)))  # 0.132
```

**Why this example?** It shows the difference between asking an object for a result and reaching into its stored timing data. **How to read it:** start with the object name (`marc` or `fabio`), then read the attribute or method after the dot. The complete class definition appears in Part 5.

<span id="part-1-map"></span>

### 2. Goals, principles, and patterns answer different questions

| Kind of design advice | Question | Practice-result example |
| :--- | :--- | :--- |
| **Goal** | What quality do we want? | An impossible negative lap should produce a clear error. |
| **Principle** | How should we organize the code? | Keep the timing conversion inside `PracticeResult`. |
| **Pattern** | What reusable solution shape fits a recurring problem? | Wrap an older tuple so it offers the `lap_seconds()` method a report expects. |

Section 2.1 moves from desired **outcomes** to organizing **principles**, then names **patterns** that help with recurring problems. A pattern is useful only when its context fits; adding every named pattern to a three-result script would add work without helping the calculation.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 2.1.1 — Object-Oriented Design Goals

The book names three main goals: **robustness**, **adaptability**, and **reusability**. They concern the quality of the software, not who was fastest in Practice.

<span id="part-2-robustness"></span>

### 1. Robustness: respond sensibly to bad input

Correct software gives the expected answer for valid data and behaves sensibly when data is invalid. A Practice best lap of `89,426` milliseconds is valid. A hypothetical input of `-250` milliseconds is impossible and must not appear as a real lap time. We can check the value as the object is created:

```python
if type(lap_ms) is not int or lap_ms <= 0:
    raise ValueError("lap_ms must be a positive integer")
```

**Why this example?** A negative time makes the error obvious, and checking the constructor protects every later calculation that uses the object. **How to solve it:** state the rule (a lap time must be a positive integer number of milliseconds), test the input before storing it, and raise a clear error if it breaks the rule. `type(lap_ms) is not int` also rejects `True`, which Python otherwise treats as a kind of integer.

The book uses the Therac-25 radiation-therapy accidents to show why software robustness matters in high-stakes settings. Our timing exercise is low stakes, but it teaches the same habit of stating and checking assumptions. We also check that two results belong to the **same session** before comparing them in Part 5.

<span id="part-2-adaptability"></span>

### 2. Adaptability: accommodate a new question

Suppose a first report only prints best laps. A later report also needs the difference from the session leader. We can add one operation to the result class while keeping the existing `lap_seconds()` use intact:

```python
def difference_seconds(self, reference):
    return (self._lap_ms - reference._lap_ms) / 1000
```

For Marc compared with Raúl, this is `(89,426 − 88,725) / 1000 = 0.701` seconds. For Fabio compared with Marc, it is `(89,558 − 89,426) / 1000 = 0.132` seconds. A **positive** answer means `self` took longer; zero means equal times. The complete version also checks that both results are from the same session.

**Why this example?** The new question uses data the class already owns. **How to solve it:** define the new operation's input and result, implement it once in the class, then call it from a new report. Existing code that calls `lap_seconds()` still works. The book also discusses **portability**, the ability to run on different platforms with little change, as a related aspect of adaptable software.

<span id="part-2-reusability"></span>

### 3. Reusability: use one component for more than one task

One `PracticeResult` class can serve a **lap-time report** and a **gap report**. Both use the same validated result objects. The first calls `lap_seconds()`; the second calls `difference_seconds(reference)`.

| Report | Question | Result for Marc |
| :--- | :--- | ---: |
| Lap-time report | What was his best Practice lap? | 89.426 s |
| Gap report | How much longer than Raúl's best lap? | +0.701 s |

In a larger project, a separate lap-time dashboard and a separate comparison application could both import `PracticeResult` from `practice_result.py`. Part 5 runs both reports in one file so the example is easy to try.

**Why this example?** Two reports with different outputs make the shared behavior concrete. **How to solve it:** put the common timing rules in the result class, then let each application call its public operations. Do not copy the conversion and subtraction formulas into every application. Reuse should fit the new task: the book's Therac-20/Therac-25 discussion is also a warning that reused software still needs to be checked against its new requirements.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 2.1.2 — Object-Oriented Design Principles

The three principles here are **modularity**, **abstraction**, and **encapsulation**. They help us reach the goals above.

<span id="part-3-modularity"></span>

### 1. Modularity: give each part a clear job

**Modularity** divides a program into interacting units with clear responsibilities. In Python, a module is usually one `.py` file. A larger version of this teaching program could be split as follows:

| Module | Responsibility | Example contents |
| :--- | :--- | :--- |
| `practice_result.py` | Represent and validate one result. | `PracticeResult`, `lap_seconds()` |
| `reports.py` | Display results. | `show_lap()`, `show_gap()` |
| `main.py` | Provide this session's data and run the reports. | Raúl, Marc, and Fabio objects |

**Why this example?** A wrong best-lap conversion has a different home from a printing mistake. **How to solve it:** identify responsibilities, place related code together, and let modules communicate through a small public interface. A **module** is a file-level unit; a **class** is a definition that can live inside a module. Part 5 keeps everything in one file so it is easy to run; the responsibilities are still separate.

<span id="part-3-abstraction"></span>

### 2. Abstraction and abstract data types: specify what is promised

**Abstraction** focuses on the behavior a caller needs and leaves internal detail aside. An **abstract data type (ADT)** describes values and supported operations without prescribing one storage layout. Think of this as a contract for a Practice result:

| Operation or rule | Promise to the caller |
| :--- | :--- |
| Create a result | Supply a session, rider, team, and positive best-lap time in milliseconds. |
| `lap_seconds()` | Return that best-lap time in seconds. |
| `difference_seconds(reference)` | For results from the same session, return this time minus the reference time in seconds. |

The contract says that `marc.lap_seconds()` is `89.426`. It does not require the implementation to store `89426`; another version could store a `timedelta` and keep the same public result.

**Why this example?** The caller's question is about a lap time in seconds, not the internal storage. **How to solve it:** write down valid inputs, each operation's result, and the unit and sign of that result before writing the method body. Then check the implementation against this contract.

<span id="part-3-interfaces"></span>

### 3. Duck typing and abstract base classes: two ways to express an interface

Python often uses **duck typing**: a function can use an object that supplies the behavior it needs. This small report asks only for a `lap_seconds()` method:

```python
def show_seconds(result):
    print("{:.3f} s".format(result.lap_seconds()))
```

It works with a `PracticeResult` and could work with an adapter for older timing data that also provides `lap_seconds()`. The two classes need not share a parent class for this call to work.

**Why this example?** It makes an interface visible as an actual method call. **How to solve it:** look at what the function calls, supply that method with the promised behavior, and test it with each object type. A missing method produces an error when the call runs.

Python also has **abstract base classes (ABCs)** for declaring required operations more formally. An ABC can mark a method as abstract; a concrete subclass must implement it before it can be instantiated. Section 2.1 introduces this option and points to Python's `abc` and `collections` facilities. We do not need an ABC for one tiny report; the method contract is enough to understand the example.

<span id="part-3-encapsulation"></span>

### 4. Encapsulation: keep the representation behind the interface

**Encapsulation** keeps a class's implementation details within the class. In our program, `_lap_ms` is the stored representation. Callers use `lap_seconds()` and `difference_seconds(...)` instead of reading `_lap_ms` and repeating formulas. The leading underscore means **nonpublic by Python convention**; it is not a strict access barrier.

```python
# Good: use the public operation and its documented unit.
seconds = marc.lap_seconds()

# Avoid in report code: it relies on an internal storage choice.
seconds = marc._lap_ms / 1000
```

**Why this example?** Both lines currently return `89.426`, but only the first survives an internal storage change without editing the report. **How to solve it:** define a public operation for the needed answer, keep conversion inside the class, and avoid outside assignments to `_lap_ms` that could bypass validation. If changing a lap were a real requirement, add a checked public method rather than modifying `_lap_ms` directly.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Section 2.1.3 — Design Patterns

<span id="part-4-description"></span>

### 1. What a pattern describes

A **design pattern** is a reusable template for a recurring problem, not a finished piece of code. The book describes a pattern by its **name**, **context**, **solution template**, and **result**. We can preview the **Adapter** pattern using a hypothetical older timing record:

| Pattern part | Practice-result example |
| :--- | :--- |
| Name | Adapter |
| Context | An old record is a tuple, but the new report calls `lap_seconds()`. |
| Template | Wrap the tuple in an object that provides `lap_seconds()`. |
| Result | The report can read the older record through the interface it already uses. |

**Why this example?** The mismatch is small and visible: a tuple has no `lap_seconds()` method. **How to solve it:** identify the method the report expects, write a wrapper that offers it, and keep the old tuple inside that wrapper. The older tuple is an invented teaching representation; the rider and timing values below still come from the verified Practice classification.

<span id="part-4-algorithms"></span>

### 2. Algorithm design patterns

The book lists these recurring **algorithm** approaches. Section 2.1 introduces their names; later chapters develop them in detail.

| Pattern | Basic idea |
| :--- | :--- |
| Recursion | Solve a problem using smaller instances of itself. |
| Amortization | Analyze a sequence of operations by spreading occasional high costs over it. |
| Divide-and-conquer | Split into smaller subproblems, solve them, and combine the answers. |
| Prune-and-search (decrease-and-conquer) | Discard a part that cannot contain the desired answer, then continue on what remains. |
| Brute force | Examine straightforward possibilities directly. |
| Dynamic programming | Save answers to overlapping subproblems and reuse them. |
| Greedy method | Make a locally best choice at each step according to a rule. |

For three known Practice results, direct subtraction is enough. We do not need a more elaborate algorithm merely because a pattern has a name.

<span id="part-4-software"></span>

### 3. Software engineering patterns and an Adapter example

The book also names **Iterator**, **Adapter**, **Position**, **Composition**, **Template method**, **Locator**, and **Factory method** as software engineering patterns. These concern how program parts cooperate. Our `for result in results` loop previews the use of iteration; the following wrapper makes Adapter concrete:

```python
# Hypothetical old storage format for Marc's verified Practice result.
old_marc_row = ("Marc Márquez", "Ducati Lenovo Team", 89426)

class LegacyLapAdapter:
    def __init__(self, row):
        self._row = row

    def lap_seconds(self):
        return self._row[2] / 1000


def show_seconds(result):
    print("{:.3f} s".format(result.lap_seconds()))


adapted_marc = LegacyLapAdapter(old_marc_row)
show_seconds(adapted_marc)  # 89.426 s
```

The adapter supplies exactly the method `show_seconds` needs. It is a small teaching sketch: a production adapter would validate the tuple's length and lap value before accepting it.

**Why this example?** It shows a real interface mismatch and a direct way to bridge it. **How to solve it:** inspect the old value, identify the new caller's required method, add that method in a wrapper, then run the caller with the wrapper. The pattern's benefit comes from preserving the caller's interface.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: A Complete Practice-Result Program

<span id="part-5-plan"></span>

### 1. Define the problem and plan

**Problem:** Print the three riders' best Practice laps in seconds, print each rider's difference from P1 Raúl Fernández, and calculate Fabio's difference from Marc. All three observations come from the same Friday Practice session.

**Plan:**

1. Convert each `m:ss.sss` best lap to an integer number of milliseconds.
2. Create one `PracticeResult` object per rider, with the same session label.
3. Reject invalid lap values when an object is created.
4. Give the class public methods for seconds and signed differences.
5. Pass the objects to two small report functions.
6. Check the output against hand subtraction.

**Why this example?** One short program connects the book's design goals and principles to an answer we can verify. **How to solve it:** follow the plan in order, keeping source facts (rider, team, best lap) separate from the hypothetical program structure.

<span id="part-5-program"></span>

### 2. Run the program

Save the following as `practice_results.py` and run `python practice_results.py` with Python 3:

```python
SESSION = "2026 Indonesian GP MotoGP Practice, 9 October"


class PracticeResult:
    def __init__(self, session, rider, team, lap_ms):
        if not session or not rider or not team:
            raise ValueError("session, rider, and team are required")
        if type(lap_ms) is not int or lap_ms <= 0:
            raise ValueError("lap_ms must be a positive integer")

        self._session = session
        self.rider = rider
        self.team = team
        self._lap_ms = lap_ms

    def lap_seconds(self):
        return self._lap_ms / 1000

    def difference_seconds(self, reference):
        if not isinstance(reference, PracticeResult):
            raise TypeError("reference must be a PracticeResult")
        if self._session != reference._session:
            raise ValueError("results must be from the same session")
        return (self._lap_ms - reference._lap_ms) / 1000


def show_lap(result):
    print("{} | {} | {:.3f} s".format(
        result.rider, result.team, result.lap_seconds()
    ))


def show_gap(result, reference):
    print("{}: {:+.3f} s".format(
        result.rider, result.difference_seconds(reference)
    ))


# Verified Friday Practice best laps, expressed as integer milliseconds.
raul = PracticeResult(SESSION, "Raúl Fernández",
                      "SuperFile Trackhouse MotoGP Team", 88725)
marc = PracticeResult(SESSION, "Marc Márquez",
                      "Ducati Lenovo Team", 89426)
fabio = PracticeResult(SESSION, "Fabio Quartararo",
                       "Monster Energy Yamaha MotoGP", 89558)
results = [raul, marc, fabio]

print("Friday Practice best laps:")
for result in results:
    show_lap(result)

print("Differences from Raúl's P1 best lap:")
for result in results:
    show_gap(result, raul)

print("Fabio minus Marc: {:+.3f} s".format(
    fabio.difference_seconds(marc)
))
```

Expected output:

```text
Friday Practice best laps:
Raúl Fernández | SuperFile Trackhouse MotoGP Team | 88.725 s
Marc Márquez | Ducati Lenovo Team | 89.426 s
Fabio Quartararo | Monster Energy Yamaha MotoGP | 89.558 s
Differences from Raúl's P1 best lap:
Raúl Fernández: +0.000 s
Marc Márquez: +0.701 s
Fabio Quartararo: +0.833 s
Fabio minus Marc: +0.132 s
```

<span id="part-5-trace"></span>

### 3. Trace the calculations and design choices

| Call | Millisecond subtraction | Displayed result | Meaning |
| :--- | ---: | ---: | :--- |
| `marc.difference_seconds(raul)` | `89,426 − 88,725 = 701` | `+0.701 s` | Marc's best lap took longer than Raúl's. |
| `fabio.difference_seconds(raul)` | `89,558 − 88,725 = 833` | `+0.833 s` | Fabio's best lap took longer than Raúl's. |
| `fabio.difference_seconds(marc)` | `89,558 − 89,426 = 132` | `+0.132 s` | Fabio's best lap took longer than Marc's. |

The `+` in the display comes from `{:+.3f}`: show a sign and three digits after the decimal point. It does not mean a race time penalty. These are differences between each rider's **fastest Practice lap**, not finish gaps from the Sprint or Grand Prix.

The code illustrates **robustness** with constructor and same-session checks; **adaptability** with a separate difference method; **reusability** because the result class can also be imported by separate reporting applications; **modularity** because representing a result and displaying one are different jobs; **abstraction** because reports ask for seconds; and **encapsulation** because they do not read `_lap_ms`.

**How to check the program:** run it, compare each result with the hand calculations in the table, then try `PracticeResult(SESSION, "Test", "Test Team", -250)` in an interactive prompt. The last call should raise `ValueError` rather than create an impossible result.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 2.1 idea | Plain-language meaning | Practice-result example |
| :--- | :--- | :--- |
| Object and class | A class defines a kind of value; each object is one instance. | Marc, Fabio, and Raúl each have a `PracticeResult`. |
| Robustness | Give correct answers for valid data and sensible responses to invalid data. | Reject a nonpositive lap and cross-session comparison. |
| Adaptability | Make a useful change without breaking existing callers. | Add a difference operation while keeping lap reports. |
| Reusability | Use a suitable component in different applications. | Separate lap-time and gap-report applications can import `PracticeResult`. |
| Modularity | Give related code a clear responsibility. | Result class, report functions, and session data have separate jobs. |
| Abstraction | Specify the operations and results that callers need. | `lap_seconds()` promises seconds regardless of storage. |
| Encapsulation | Keep representation details behind public operations. | Reports call methods instead of reading `_lap_ms`. |
| Design pattern | Adapt a named solution template to a recurring context. | An Adapter gives an older tuple a `lap_seconds()` method. |

[🔝 Back to Top](#top)
