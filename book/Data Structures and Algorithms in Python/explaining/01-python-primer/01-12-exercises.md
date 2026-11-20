<span id="top"></span>

# Python Primer — Section 1.12: Exercises

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.<br>
> **Topic:** The 36 Reinforcement, Creativity, and Projects exercises that apply Chapter 1.<br>
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.<br>
> **Learning goal:** Recognize what each exercise asks, choose an appropriate Python technique, and work through small examples without confusing teaching calculations with race results.<br>
> **User Prompt:** "Reexplain [Section 1.12] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: Three Kinds of Exercises](#background)
2. [Part 1: Reinforcement R-1.1–R-1.3 — Predicates and Extremes](#part-1)
   - [R-1.1 multiples](#r-1-1) · [R-1.2 evenness](#r-1-2) · [R-1.3 min/max](#r-1-3)
3. [Part 2: Reinforcement R-1.4–R-1.7 — Sums and Comprehensions](#part-2)
   - [R-1.4 squares](#r-1-4) · [R-1.5 one-command squares](#r-1-5) · [R-1.6 odd squares](#r-1-6) · [R-1.7 one-command odd squares](#r-1-7)
4. [Part 3: Reinforcement R-1.8–R-1.12 — Indices, Ranges, and Choice](#part-3)
   - [R-1.8 negative indices](#r-1-8) · [R-1.9 ascending range](#r-1-9) · [R-1.10 descending range](#r-1-10) · [R-1.11 powers of two](#r-1-11) · [R-1.12 random choice](#r-1-12)
5. [Part 4: Creativity C-1.13–C-1.17 — Lists and Mutation](#part-4)
   - [C-1.13 reversal](#c-1-13) · [C-1.14 odd product](#c-1-14) · [C-1.15 unique values](#c-1-15) · [C-1.16 indexed scaling](#c-1-16) · [C-1.17 loop variable](#c-1-17)
6. [Part 5: Creativity C-1.18–C-1.23 — Patterns, Input, and Errors](#part-5)
   - [C-1.18 number pattern](#c-1-18) · [C-1.19 alphabet](#c-1-19) · [C-1.20 shuffle](#c-1-20) · [C-1.21 EOF input](#c-1-21) · [C-1.22 array product](#c-1-22) · [C-1.23 index error](#c-1-23)
7. [Part 6: Creativity C-1.24–C-1.28 — Text, Factors, and Norms](#part-6)
   - [C-1.24 vowels](#c-1-24) · [C-1.25 punctuation](#c-1-25) · [C-1.26 formulas](#c-1-26) · [C-1.27 factors](#c-1-27) · [C-1.28 norms](#c-1-28)
8. [Part 7: Projects P-1.29–P-1.33 — Enumeration and Calculators](#part-7)
   - [P-1.29 permutations](#p-1-29) · [P-1.30 division count](#p-1-30) · [P-1.31 change](#p-1-31) · [P-1.32 console calculator](#p-1-32) · [P-1.33 button calculator](#p-1-33)
9. [Part 8: Projects P-1.34–P-1.36 — Text and Simulation](#part-8)
   - [P-1.34 typos](#p-1-34) · [P-1.35 birthdays](#p-1-35) · [P-1.36 word counts](#p-1-36)
10. [Part 9: Summary](#part-9)

---

<span id="background"></span>

## Background & Conceptual Intuition: Three Kinds of Exercises

**Reinforcement** exercises check one Chapter 1 idea at a time. **Creativity** exercises combine ideas or ask why code behaves as it does. **Projects** ask for complete programs with input, state, and output. The exercise numbers below follow the book; the explanations and MotoGP examples are new.

The [official Yamaha weekend results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) provide a consistent small dataset:

| Rider and team | Friday Practice best lap | Saturday Sprint | Sunday Grand Prix |
| :--- | :--- | :--- | :--- |
| Marc Márquez — Ducati Lenovo Team | P5, `1:29.426` = `89.426` s | P1, winner over 13 laps | P6 over 27 laps, `+10.778` s to winner |
| Fabio Quartararo — Monster Energy Yamaha MotoGP Team | P7, `1:29.558` = `89.558` s | P9, `+10.248` s to Marc | P9, `+19.999` s to winner |

Sunday's winner was Marco Bezzecchi of Aprilia Racing. A position (`P5`), a single Friday best lap (`89.426` s), and a race gap (`+10.778` s) are **different measures**. When an exercise needs arbitrary integers, currency, birthdays, or typos, those are explicitly teaching inputs rather than published MotoGP facts. The calculated Friday difference `89.558 - 89.426 = 0.132` s compares only the two selected best laps.

**Why this example?** Two real riders give us short lists, integer positions, and comparable Friday lap times. **How to solve the chapter exercises:** identify the input and output first, preserve each exercise's constraints, trace a tiny case by hand, then run the code and check boundaries such as empty lists, zero, or an excluded `range` stop.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement R-1.1–R-1.3 — Predicates and Extremes

<span id="r-1-1"></span>

### R-1.1 — Is one integer a multiple of another?

The task is to return a Boolean for `n = m × i` with integer `i`. With a nonzero divisor, a zero remainder is the direct test:

```python
def is_multiple(n, m):
    if m == 0:
        return n == 0
    return n % m == 0

print(is_multiple(27, 3))
print(is_multiple(13, 3))
print(is_multiple(0, 0))
```

```text
True
False
True
```

**Why this example?** The real Sunday race had 27 laps and the Sprint had 13; their divisibility by 3 is easy to check by hand. The zero case checks the book's literal definition `n = m × i`: zero equals `0 × i`. **How to solve it:** handle `m = 0` before using remainder, then test `n % m == 0` for nonzero `m`.

<span id="r-1-2"></span>

### R-1.2 — Test evenness without multiplication, remainder, or division

The exercise bans `*`, `%`, and division. The last binary bit of an integer is zero exactly when it is even:

```python
def is_even(k):
    return (k & 1) == 0

print(is_even(6), is_even(9))
```

```text
True False
```

**Why this example?** Marc's Sunday P6 is even and Fabio's P9 is odd, so both outcomes appear. **How to solve it:** use bitwise `& 1` to inspect parity; do not use any of the prohibited arithmetic operators.

<span id="r-1-3"></span>

### R-1.3 — Find the smallest and largest without `min` or `max`

Initialize both answers with the first element, then update them while scanning the rest:

```python
def minmax(data):
    smallest = largest = data[0]  # The exercise promises nonempty input.
    for value in data[1:]:
        if value < smallest:
            smallest = value
        if value > largest:
            largest = value
    return (smallest, largest)

selected_friday_best_laps_s = [88.725, 89.426, 89.558]
print(minmax(selected_friday_best_laps_s))
```

```text
(88.725, 89.558)
```

The three times belong to Raúl Fernández, Marc, and Fabio in Friday Practice. This is the range of **these selected riders**, not the full field.

**Why this example?** Three values expose both updates without a long trace. **How to solve it:** use `data[0]` as a valid starting value, compare each later value twice, and return a two-item tuple. An empty sequence would need a separate policy, but the exercise supplies a nonempty one.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Reinforcement R-1.4–R-1.7 — Sums and Comprehensions

These four exercises use **positive integers strictly below** `n`. We use `n = 6` because Marc finished Sunday P6; the resulting sums are math drills, not MotoGP scores.

<span id="r-1-4"></span>

### R-1.4 — Sum all positive squares below `n` with a loop

```python
def square_sum_below(n):
    total = 0
    for k in range(1, n):
        total += k * k
    return total

print(square_sum_below(6))
```

```text
55
```

**Why this example?** For `n = 6`, the five terms `1² + 2² + 3² + 4² + 5²` are easy to trace. **How to solve it:** start at 1, stop before `n`, add each `k²`, and return the accumulator.

<span id="r-1-5"></span>

### R-1.5 — Express the same sum in one command

```python
n = 6
print(sum([k * k for k in range(1, n)]))
```

```text
55
```

**Why this example?** It should match R-1.4 exactly. **How to solve it:** the comprehension builds the terms, and built-in `sum` adds them. `range(1, n)` still excludes `n`.

<span id="r-1-6"></span>

### R-1.6 — Sum only odd positive squares below `n`

```python
def odd_square_sum_below(n):
    total = 0
    for k in range(1, n):
        if k % 2 == 1:
            total += k * k
    return total

print(odd_square_sum_below(6))
```

```text
35
```

**Why this example?** For `n = 6`, only `1² + 3² + 5² = 35` survives the filter. **How to solve it:** test whether each candidate is odd before adding its square. R-1.2's operator ban applies to R-1.2, not this exercise.

<span id="r-1-7"></span>

### R-1.7 — Write the odd-square sum in one command

```python
n = 6
print(sum([k * k for k in range(1, n) if k % 2 == 1]))
```

```text
35
```

**Why this example?** The result checks the loop from R-1.6. **How to solve it:** put the oddness test after the `for` part of the comprehension, then pass the generated list to `sum`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Reinforcement R-1.8–R-1.12 — Indices, Ranges, and Choice

<span id="r-1-8"></span>

### R-1.8 — Translate a negative index

For a sequence `s` of length `n` and a valid negative index `k`, the same element has nonnegative index `n + k`:

```python
fabio_positions = ["Friday P7", "Saturday P9", "Sunday P9"]
n = len(fabio_positions)
k = -2
print(n + k, fabio_positions[k], fabio_positions[n + k])
```

```text
1 Saturday P9 Saturday P9
```

**Why this example?** Three real session positions make `-2` visibly mean “second from the end.” **How to solve it:** calculate `n + k`; here `3 + (-2) = 1`. This formula assumes `-n <= k < 0`.

<span id="r-1-9"></span>

### R-1.9 — Produce `50, 60, 70, 80` with `range`

```python
print(list(range(50, 90, 10)))
```

```text
[50, 60, 70, 80]
```

**Why this example?** The values are prescribed by the exercise and are illustrative number labels, not race data. **How to solve it:** start at 50, step by 10, and choose 90 as the **excluded** stop.

<span id="r-1-10"></span>

### R-1.10 — Produce a descending even sequence

```python
print(list(range(8, -10, -2)))
```

```text
[8, 6, 4, 2, 0, -2, -4, -6, -8]
```

**Why this example?** It shows a negative step and an excluded lower stop. **How to solve it:** start at 8, subtract 2 each time, and stop before `-10`.

<span id="r-1-11"></span>

### R-1.11 — Build powers of two with a comprehension

```python
print([2 ** k for k in range(9)])
```

```text
[1, 2, 4, 8, 16, 32, 64, 128, 256]
```

**Why this example?** The required list follows one rule instead of nine unrelated numbers. **How to solve it:** generate exponents 0 through 8; `2 ** 0` gives the first value, 1.

<span id="r-1-12"></span>

### R-1.12 — Recreate `choice` using `randrange`

For a **nonempty** sequence, every valid index must have the same chance of being selected:

```python
from random import randrange

def my_choice(data):
    return data[randrange(len(data))]

riders = [
    ("Marc Márquez", "Ducati Lenovo Team"),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team"),
]
selected = my_choice(riders)
print(selected in riders)
```

```text
True
```

**Why this example?** Real rider/team pairs show that random selection returns a whole element, while the printed check does not depend on a particular draw. **How to solve it:** draw one index from `0` through `len(data) - 1` and return that element. This classroom draw does not determine an official result.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Creativity C-1.13–C-1.17 — Lists and Mutation

<span id="c-1-13"></span>

### C-1.13 — Reverse a list by swapping its ends

Write the plan in pseudocode first, then translate each step to Python:

```text
left = first index
right = last index
while left is before right:
    swap data[left] and data[right]
    move left rightward and right leftward
```

```python
def reverse_in_place(data):
    left, right = 0, len(data) - 1
    while left < right:
        data[left], data[right] = data[right], data[left]
        left += 1
        right -= 1

marc_positions = [5, 1, 6]  # Friday, Saturday, Sunday
reverse_in_place(marc_positions)
print(marc_positions)
```

```text
[6, 1, 5]
```

**Why this example?** Marc's real three-day positions give a tiny list with a visible first/last swap. The reversed list is a **display exercise**, not chronological weekend order. **How to solve it:** maintain two indices, swap until they meet, and compare the result with Python's `data.reverse()` (which also changes the list in place).

<span id="c-1-14"></span>

### C-1.14 — Find two distinct elements with an odd product

An integer product is odd only when **both factors are odd**. “Distinct elements” means two positions; the values may happen to be equal:

```python
def has_odd_product_pair(data):
    odd_count = 0
    for value in data:
        if value % 2 != 0:
            odd_count += 1
            if odd_count == 2:
                return True
    return False

print(has_odd_product_pair([5, 7]))
print(has_odd_product_pair([5, 5]))
print(has_odd_product_pair([6, 9]))
```

```text
True
True
False
```

The first pair uses Marc's and Fabio's Friday positions; the repeated `[5, 5]` is a teaching edge case, not a published pair.

**Why this example?** It separates different **positions** from different **values**. **How to solve it:** count odd entries and return `True` once two have been found; there is no need to multiply every possible pair.

<span id="c-1-15"></span>

### C-1.15 — Decide whether all values are different

A set keeps one copy of each numeric value:

```python
def all_different(data):
    return len(set(data)) == len(data)

print(all_different([5, 1, 6]))  # Marc: Friday, Sprint, Grand Prix
print(all_different([7, 9, 9]))  # Fabio: Friday, Sprint, Grand Prix
```

```text
True
False
```

**Why this example?** Fabio's P9 on both Saturday and Sunday makes a real repeated-value case. **How to solve it:** compare the number of entries with the number of unique values. The exercise's numbers can be placed in a set; for unhashable objects, a different comparison method would be needed.

<span id="c-1-16"></span>

### C-1.16 — Why indexed scaling changes the caller's list

The floats are immutable, but the **list slots** can be assigned new float objects:

```python
def scale(data, factor):
    for j in range(len(data)):
        data[j] *= factor

friday_best_laps_s = [89.426, 89.558]
scale(friday_best_laps_s, 1000)
print(friday_best_laps_s)
```

```text
[89426.0, 89558.0]
```

**Why this example?** Converting Marc's and Fabio's Friday best laps from seconds to milliseconds makes the change obvious. **How to solve it:** understand `data[j] *= factor` as “compute a new number, then assign it into slot `j`.” The caller and function refer to the same mutable list.

<span id="c-1-17"></span>

### C-1.17 — Why rebinding a loop variable does not scale the list

This version changes only the local name `val`:

```python
def ineffective_scale(data, factor):
    for val in data:
        val *= factor

friday_best_laps_s = [89.426, 89.558]
ineffective_scale(friday_best_laps_s, 1000)
print(friday_best_laps_s)
```

```text
[89.426, 89.558]
```

**Why this example?** Using the same real lap times as C-1.16 isolates the effect of the changed loop body. **How to solve it:** compare `val *= factor` with `data[j] *= factor`. Rebinding `val` does not assign to any list slot; use indices or return a new list if a changed result is wanted.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Creativity C-1.18–C-1.23 — Patterns, Input, and Errors

<span id="c-1-18"></span>

### C-1.18 — Discover a numeric pattern for a comprehension

The required values `0, 2, 6, 12, …, 90` follow `k(k + 1)` for `k = 0, …, 9`:

```python
print([k * (k + 1) for k in range(10)])
```

```text
[0, 2, 6, 12, 20, 30, 42, 56, 72, 90]
```

**Why this example?** This exact list belongs to the exercise; it is a number pattern, not MotoGP data. **How to solve it:** inspect successive terms, recognize twice the triangular numbers, and encode `k(k + 1)` in one comprehension.

<span id="c-1-19"></span>

### C-1.19 — Generate the alphabet without typing every letter

```python
letters = [chr(code) for code in range(ord("a"), ord("z") + 1)]
print("".join(letters))
```

```text
abcdefghijklmnopqrstuvwxyz
```

**Why this example?** Rider codes such as `MARC` and `FABIO` contain letters, but the task is about generating the entire alphabet. **How to solve it:** turn `"a"` and `"z"` into character codes with `ord`, include the last code with `+ 1`, then turn each code back into a letter with `chr`.

<span id="c-1-20"></span>

### C-1.20 — Shuffle a list uniformly using only `randint`

The Fisher–Yates method fixes the last slot first, then the next-to-last, choosing uniformly among the slots not yet fixed:

```python
from random import randint

def shuffle_in_place(data):
    for last in range(len(data) - 1, 0, -1):
        chosen = randint(0, last)
        data[last], data[chosen] = data[chosen], data[last]

riders = ["Marc Márquez", "Fabio Quartararo", "Raúl Fernández"]
original = riders.copy()
shuffle_in_place(riders)
print(sorted(riders) == sorted(original))
```

```text
True
```

**Why this example?** The names are real Friday Practice riders, but their shuffled order is an arbitrary classroom display. **How to solve it:** at each step choose an index from `0` through `last` **inclusive**, swap, and reduce the unfixed region. Every permutation has probability `1/n!` if each `randint` draw is uniform.

<span id="c-1-21"></span>

### C-1.21 — Read until end-of-file, then reverse the lines

`input()` raises `EOFError` when no more input is available. Save each line before printing in reverse order:

```python
lines = []
while True:
    try:
        lines.append(input())
    except EOFError:
        break

for line in reversed(lines):
    print(line)
```

For example, entering `Marc Friday P5` followed by `Fabio Friday P7` prints Fabio's line first after end-of-file. In a Windows console, end input with **Ctrl+Z, then Enter**; on many Unix terminals, use **Ctrl+D**.

**Why this example?** Two verified Friday classifications make the reversal visible without a long input stream. **How to solve it:** keep reading until the exception, then traverse the saved lines backward. The reversal changes output order, not the published classification.

<span id="c-1-22"></span>

### C-1.22 — Multiply two arrays element by element

The book calls this a “dot product” but explicitly requires an **array** `c` where `c[i] = a[i] * b[i]`. That definition is an elementwise product; a conventional dot product would be one scalar sum.

```python
def elementwise_product(a, b):
    if len(a) != len(b):
        raise ValueError("Arrays must have equal length")
    return [a[i] * b[i] for i in range(len(a))]

sprint_positions = [1, 9]       # Marc, Fabio
grand_prix_positions = [6, 9]   # Marc, Fabio
print(elementwise_product(sprint_positions, grand_prix_positions))
```

```text
[6, 81]
```

**Why this example?** Two actual two-rider position arrays let us check `1 × 6` and `9 × 9` by hand. The products are teaching values, not race positions. **How to solve it:** check equal lengths, multiply matching indices, and return the new array. The conventional scalar dot product here would be `6 + 81 = 87`, which is **not** the exercise's specified output.

<span id="c-1-23"></span>

### C-1.23 — Catch an out-of-bounds list assignment

```python
positions = [5, 7]
try:
    positions[2] = 9
except IndexError:
    print("Don't try buffer overflow attacks in Python!")
```

```text
Don't try buffer overflow attacks in Python!
```

**Why this example?** The two real Friday positions make valid indices `0` and `1`, so index `2` is visibly outside the list. The assigned `9` is a teaching value. **How to solve it:** put the potentially invalid assignment inside `try`, catch `IndexError` specifically, and print the requested message. Python checks bounds rather than writing past the list.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Creativity C-1.24–C-1.28 — Text, Factors, and Norms

<span id="c-1-24"></span>

### C-1.24 — Count vowels in a string

```python
def vowel_count(text):
    return sum(character.lower() in "aeiou" for character in text)

print(vowel_count("Fabio Quartararo"))
```

```text
8
```

**Why this example?** Fabio's real name is a short input with repeated vowels. **How to solve it:** scan each character, normalize case, and count membership in the five English vowel letters. This definition counts `a, e, i, o, u`; accented letters would need an explicit normalization policy.

<span id="c-1-25"></span>

### C-1.25 — Return a copy of a sentence without punctuation

```python
import string

def without_punctuation(sentence):
    return "".join(
        character for character in sentence
        if character not in string.punctuation
    )

print(without_punctuation("Marc, Fabio!"))
```

```text
Marc Fabio
```

**Why this example?** A two-name display makes the removed comma and exclamation point easy to see. **How to solve it:** keep characters outside `string.punctuation` and join them into a **new** string. This library constant covers ASCII punctuation; Unicode punctuation requires a broader rule.

<span id="c-1-26"></span>

### C-1.26 — Check arithmetic formulas in the given number order

The exercise gives examples such as `a + b = c` and `a = b - c`. We can test basic operations with the equality sign on either side of the operation, without rearranging `a, b, c`:

```python
def can_form_formula(a, b, c):
    left_operation = (
        a + b == c or a - b == c or a * b == c
        or (b != 0 and a == b * c)  # a / b = c
    )
    right_operation = (
        a == b + c or a == b - c or a == b * c
        or (c != 0 and a * c == b)  # a = b / c
    )
    return left_operation or right_operation

a = int(input("a: "))
b = int(input("b: "))
c = int(input("c: "))
print(can_form_formula(a, b, c))
```

Entering `5`, `7`, and `12` prints `True` because `5 + 7 = 12`. The first two integers are Marc's and Fabio's Friday positions; `12` is a calculated teaching value, not another published position.

**Why this example?** It tests one transparent formula before considering the other operators. **How to solve it:** read three integers, test each permitted equation in the **same order**, and guard division by zero. Cross multiplication checks division equations exactly for integer inputs.

<span id="c-1-27"></span>

### C-1.27 — Yield factors in increasing order efficiently

A factor below `√n` has a paired factor above `√n`. Yield the small ones while scanning upward, handle a perfect square once, then scan the same small candidates downward for their large partners:

```python
def increasing_factors(n):
    if n < 1:
        raise ValueError("n must be positive")
    k = 1
    while k * k < n:
        if n % k == 0:
            yield k
        k += 1
    if k * k == n:
        yield k
    k -= 1
    while k >= 1:
        if n % k == 0:
            yield n // k
        k -= 1

print(list(increasing_factors(9)))
print(list(increasing_factors(20)))
```

```text
[1, 3, 9]
[1, 2, 4, 5, 10, 20]
```

**Why this example?** Fabio's Sunday P9 supplies a perfect square; his rider number 20 supplies a non-square teaching input. The factors are mathematics, not results. **How to solve it:** test candidates only up to `√n`, avoid yielding the square root twice, and emit the large partners in reverse candidate order. This takes `O(√n)` time and constant extra storage beyond the generator.

<span id="c-1-28"></span>

### C-1.28 — Compute the `p`-norm, defaulting to Euclidean norm

For a vector `v`, the `p`-norm is `(sum(abs(x) ** p for x in v)) ** (1/p)` for `p >= 1`:

```python
def norm(v, p=2):
    if p < 1:
        raise ValueError("p must be at least 1")
    return sum(abs(x) ** p for x in v) ** (1 / p)

friday_positions = [5, 7]  # Marc, Fabio
print("{:.3f}".format(norm(friday_positions)))
print("{:.3f}".format(norm(friday_positions, 1)))
```

```text
8.602
12.000
```

**Why this example?** The two real Friday positions make a short vector: Euclidean norm is `√(5² + 7²) = √74` and the 1-norm is `5 + 7`. Neither norm is a racing statistic. **How to solve it:** use absolute values, sum the `p`th powers, take the `p`th root, and make `p = 2` the default.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Projects P-1.29–P-1.33 — Enumeration and Calculators

Projects need a complete input-to-output story. The first project has fixed letters from the book; the remaining examples use the weekend where a real session value fits. Any purchase price or calculator result is a teaching input, not a MotoGP result.

<span id="p-1-29"></span>

### P-1.29 — Output every arrangement of six given letters

The exercise fixes the letters `c, a, t, d, o, g`, each used exactly once. There are `6! = 720` arrangements:

```python
from itertools import permutations

arrangements = ["".join(letters) for letters in permutations("catdog")]
assert len(arrangements) == len(set(arrangements)) == 720
for arrangement in arrangements:
    print(arrangement)
```

The program prints all 720 strings. An excerpt from its output is:

```text
catdog
catdgo
...
godtac
```

**Why this example?** The fixed six-letter input is part of the exercise, so the code preserves it rather than substituting rider names. **How to solve it:** select one unused character for each next position, then continue until all six are used. `itertools.permutations` performs that enumeration; the assertion checks that all 720 strings are distinct, and the loop prints every one.

<span id="p-1-30"></span>

### P-1.30 — Count repeated divisions by two

Start with an integer greater than two, divide repeatedly, and count until the value falls below two:

```python
def divisions_until_below_two(n):
    if n <= 2:
        raise ValueError("n must be greater than 2")
    count = 0
    while n >= 2:
        n /= 2
        count += 1
    return count

n = int(input("Positive integer > 2: "))
print(divisions_until_below_two(n))
```

For the real 13-lap Sprint count, a console run is:

```text
Positive integer > 2: 13
3
```

Entering the Grand Prix's 27-lap count instead prints `4`. These division counts are mathematical results only.

**Why this example?** The Sprint and Grand Prix supply two real positive inputs that stop after different numbers of divisions. **How to solve it:** read the integer, initialize a counter, divide once per loop, and stop when the current value is below two.

<span id="p-1-31"></span>

### P-1.31 — Make change with few bills and coins

Use **integer cents** to avoid floating-point money errors. This example chooses U.S. denominations; an illustrative MotoGP program costs $17.35 and the customer pays $20.00. That price is **not** a published merchandise price.

```python
DENOMINATIONS = [
    ("100-dollar bill", 10000), ("50-dollar bill", 5000),
    ("20-dollar bill", 2000), ("10-dollar bill", 1000),
    ("5-dollar bill", 500), ("2-dollar bill", 200),
    ("1-dollar bill", 100), ("half-dollar", 50),
    ("quarter", 25), ("dime", 10), ("nickel", 5), ("penny", 1),
]

def make_change(charged_cents, paid_cents):
    if paid_cents < charged_cents:
        raise ValueError("Amount paid is too small")
    remaining = paid_cents - charged_cents
    pieces = []
    for name, value in DENOMINATIONS:
        count, remaining = divmod(remaining, value)
        if count:
            pieces.append((name, count))
    return pieces

charged_cents = int(input("Charge in cents: "))
paid_cents = int(input("Paid in cents: "))
for name, count in make_change(charged_cents, paid_cents):
    print("{}: {}".format(name, count))
```

For the illustrative $17.35 charge and $20.00 payment, a console run is:

```text
Charge in cents: 1735
Paid in cents: 2000
2-dollar bill: 1
half-dollar: 1
dime: 1
nickel: 1
```

**Why this example?** The $2.65 difference needs several denominations but remains easy to verify: `200 + 50 + 10 + 5 = 265` cents. These four pieces are minimal for this amount with the listed U.S. denominations. **How to solve it:** read the charged and paid amounts in cents, subtract, then take as many of each largest fitting denomination as possible. For an arbitrary currency, a greedy choice might not minimize the number of pieces, so that property must be checked.

<span id="p-1-32"></span>

### P-1.32 — Build a line-by-line console calculator

In this version each **number or operator** is one console input; a number may contain a decimal point. After **every** input, show the current value:

```python
value = 0.0
pending_operator = "+"

while True:
    try:
        token = input("input: ").strip()
    except EOFError:
        break
    if token == "q":
        break
    if token in {"+", "-", "*", "/"}:
        pending_operator = token
    elif token != "=":
        number = float(token)
        if pending_operator == "+":
            value += number
        elif pending_operator == "-":
            value -= number
        elif pending_operator == "*":
            value *= number
        elif pending_operator == "/":
            if number == 0:
                print("display: Error")
                break
            value /= number
    print("display: {:g}".format(value))
```

With inputs `5`, `+`, `7`, `=`, the displays are `5`, `5`, `12`, `12`. The numbers 5 and 7 recall Marc's and Fabio's Friday positions; 12 is a calculation, not a classification.

**Why this example?** The four inputs expose when the calculator applies an operation. **How to solve it:** hold a current value and a pending operator, parse each input token, apply the operator when a number arrives, and print the display after each accepted token. This small program assumes valid numeric input and uses `q` or end-of-file to stop.

<span id="p-1-33"></span>

### P-1.33 — Simulate individual calculator button presses

This project models **buttons** rather than whole-number tokens. A two-digit number requires two digit presses; `C` clears the display and pending state. This version applies the pending operation on `=` or when another operator is pressed:

```python
def apply_operation(left, operator, right):
    if operator == "+":
        return left + right
    if operator == "-":
        return left - right
    if operator == "*":
        return left * right
    if operator == "/":
        return left / right
    raise ValueError("Unknown operator")

screen = "0"
stored = None
pending_operator = None
start_new_number = True

while True:
    try:
        button = input("button: ").strip()
    except EOFError:
        break
    if button == "q":
        break
    if screen == "Error" and button != "C":
        print("screen:", screen)
        continue
    try:
        if button == "C":
            screen, stored, pending_operator = "0", None, None
            start_new_number = True
        elif len(button) == 1 and button.isdigit():
            screen = button if start_new_number else screen + button
            start_new_number = False
        elif button == ".":
            if start_new_number:
                screen = "0."
                start_new_number = False
            elif "." not in screen:
                screen += "."
        elif button in {"+", "-", "*", "/"}:
            if stored is not None and pending_operator and not start_new_number:
                stored = apply_operation(stored, pending_operator, float(screen))
            else:
                stored = float(screen)
            screen = "{:g}".format(stored)
            pending_operator = button
            start_new_number = True
        elif button == "=" and pending_operator and not start_new_number:
            screen = "{:g}".format(
                apply_operation(stored, pending_operator, float(screen))
            )
            stored, pending_operator = None, None
            start_new_number = True
        else:
            print("Unknown button")
            continue
    except ZeroDivisionError:
        screen, stored, pending_operator = "Error", None, None
        start_new_number = True
    print("screen:", screen)
```

Pressing `5`, `+`, `7`, `=`, `C` shows `5`, `5`, `7`, `12`, `0`. Pressing `1` then `2` builds the display `12` before any operation.

**Why this example?** The same `5 + 7` arithmetic as P-1.32 highlights the different input model. **How to solve it:** keep the visible entry, a stored operand, a pending operation, and a flag for the next entry. Process one button at a time, print the screen after each button, and make clear/reset restore the initial state. After a division-by-zero `Error`, press `C` before continuing.

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Projects P-1.34–P-1.36 — Text and Simulation

<span id="p-1-34"></span>

### P-1.34 — Print 100 numbered lines with eight different typos

This project prescribes the sentence **“I will never spam my friends again.”** The typos are deliberately artificial; unlike the MotoGP examples, this text comes from the exercise itself.

```python
from random import Random

sentence = "I will never spam my friends again."
typos = [
    "I wll never spam my friends again.",
    "I will nevr spam my friends again.",
    "I will never sapm my friends again.",
    "I will never spam ny friends again.",
    "I will never spam my freinds again.",
    "I will never spam my friends agian.",
    "I will never spamm my friends again.",
    "I will never spam my friends againn.",
]
rng = Random(2026)
typo_lines = dict(zip(rng.sample(range(1, 101), 8), typos))

for number in range(1, 101):
    print("{}. {}".format(number, typo_lines.get(number, sentence)))
```

The program prints all 100 lines; exactly eight numbered lines contain different altered sentences.

**Why this example?** The fixed list of eight distinct mistakes makes the requirement checkable, while random sampling decides which lines receive them. **How to solve it:** make 100 numbered positions, select eight different positions, map a different typo to each, and print either the mapped typo or the original sentence. The seed makes the placement reproducible for a teaching run.

<span id="p-1-35"></span>

### P-1.35 — Estimate shared-birthday probability

A “birthday” here is a uniformly drawn day number from `0` through `364` for **hypothetical people**, not a real rider's birthday. Run repeated experiments for group sizes `5, 10, …, 100`:

```python
from random import Random

rng = Random(2026)

def has_matching_birthday(group_size):
    seen = set()
    for _ in range(group_size):
        day = rng.randrange(365)
        if day in seen:
            return True
        seen.add(day)
    return False

trials = 1000
for group_size in range(5, 101, 5):
    matches = sum(has_matching_birthday(group_size) for _ in range(trials))
    print("{:3}: {:.3f}".format(group_size, matches / trials))
```

Each printed fraction is an **estimate** and may vary with the seed, trial count, or Python version. For a mathematical check, the exact probability of at least one match is `1 - ∏((365 - i)/365)` for `i = 0, …, n-1`:

```python
def exact_match_probability(n):
    all_distinct = 1.0
    for i in range(n):
        all_distinct *= (365 - i) / 365
    return 1 - all_distinct

for n in (20, 23, 25):
    print(n, "{:.3f}".format(exact_match_probability(n)))
```

```text
20 0.411
23 0.507
25 0.569
```

**Why this example?** The simulation tests how a surprising collision probability grows as a group becomes larger. **How to solve it:** for each requested size, draw birthdays, detect repeats with a set, count experiments with a match, and divide by the number of trials. The first group size with probability above one half is **23**, although the book's wording says “more than 23”; the requested sequence skips 23 and goes from 20 to 25.

<span id="p-1-36"></span>

### P-1.36 — Count whitespace-separated words

Read the full input, split it at whitespace, and update a dictionary count for each word:

```python
import sys

counts = {}
for word in sys.stdin.read().split():
    counts[word] = counts.get(word, 0) + 1

for word in sorted(counts):
    print(word, counts[word])
```

For this small input made only from real rider names:

```text
Marc Márquez
Fabio Quartararo
Marc Márquez
```

the program prints:

```text
Fabio 1
Marc 2
Márquez 2
Quartararo 1
```

**Why this example?** Repeating Marc's name twice makes the dictionary update visible. The lines are an illustrative input list, not a result classification. **How to solve it:** read until end-of-file, split into words, increment `counts.get(word, 0)`, and print each word with its frequency. This version preserves spelling and case exactly; punctuation remains part of a word unless an extra cleaning step is added.

[🔝 Back to Top](#top)

---

<span id="part-9"></span>

## Part 9: Summary

| Exercise group | Core question | Useful Python idea |
| :--- | :--- | :--- |
| R-1.1–R-1.3 | Is a property true, or what are the extremes? | Boolean tests, a zero-divisor special case, one pass through a sequence. |
| R-1.4–R-1.7 | Which values belong in a sum? | `range` boundaries, accumulation, comprehension filters. |
| R-1.8–R-1.12 | How are sequences indexed or generated? | Negative indices, exclusive stops, powers, random valid indices. |
| C-1.13–C-1.17 | Does code change a list or just a name? | Swaps, parity, sets, indexed assignment, loop-variable binding. |
| C-1.18–C-1.23 | What pattern or behavior does the task specify? | Comprehensions, Fisher–Yates, EOF, elementwise products, `IndexError`. |
| C-1.24–C-1.28 | How do we transform text or numeric structures? | Character filtering, arithmetic cases, ordered factors, `p`-norm. |
| P-1.29–P-1.33 | How does a complete program track work? | Enumeration, loop counters, denominations, calculator state. |
| P-1.34–P-1.36 | How do text and repeated experiments get counted? | Sampled typo positions, simulation, frequency dictionaries. |

> **Mental model:** First state the exercise's required input, output, and restrictions. Use the smallest example that exposes the rule, then check boundaries and the complete program behavior. Marc, Fabio, and their teams supply real weekend labels; derived arithmetic, random draws, and fictional purchases remain teaching examples.

[🔝 Back to Top](#top)
