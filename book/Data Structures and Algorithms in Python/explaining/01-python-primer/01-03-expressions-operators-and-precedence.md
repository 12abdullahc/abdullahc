<span id="top"></span>

# Python Primer — Section 1.3: Expressions, Operators, and Precedence

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_.  
> **Topic:** Section 1.3 operator groups and Section 1.3.1 compound expressions and precedence.  
> **Domain focus:** The **2026 Indonesian Grand Prix MotoGP weekend** at Mandalika: Friday 9 October Practice, Saturday 10 October Sprint, and Sunday 11 October Grand Prix.  
> **Learning goal:** Read and solve Python expressions by choosing the right operand types, understanding each operator, and grouping calculations correctly.  
> **User Prompt:** "Reexplain [Section 1.3] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Weekend, Several Kinds of Questions](#background)
   - [1. The verified weekend data](#background-results)
   - [2. From values to expressions](#background-expressions)
2. [Part 1: Section 1.3 — Expressions and Operators](#part-1)
   - [1. Logical operators](#part-1-logical)
   - [2. Equality and identity](#part-1-equality)
   - [3. Order comparisons](#part-1-comparison)
   - [4. Arithmetic operators](#part-1-arithmetic)
   - [5. Bitwise operators](#part-1-bitwise)
   - [6. Sequence operators](#part-1-sequences)
   - [7. Set and frozenset operators](#part-1-sets)
   - [8. Dictionary operators](#part-1-dictionaries)
   - [9. Extended assignment](#part-1-augmented)
3. [Part 2: Section 1.3.1 — Compound Expressions and Operator Precedence](#part-2)
   - [1. Why grouping changes a result](#part-2-grouping)
   - [2. The book's precedence order](#part-2-table)
   - [3. Equal precedence and exponentiation](#part-2-associativity)
   - [4. Chained comparisons, assignment, and a conditional expression](#part-2-chains)
4. [Part 3: A Connected MotoGP Weekend Program](#part-3)
5. [Part 4: Simple MotoGP Study Cases](#part-4)
   - [1. An average needs parentheses](#part-4-average)
   - [2. Text positions need conversion](#part-4-text)
   - [3. `+=` changes a shared list](#part-4-list)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Weekend, Several Kinds of Questions

<span id="background-results"></span>

### 1. The verified weekend data

We will follow **Marc Márquez** of **Ducati Lenovo Team** and **Fabio Quartararo** of **Monster Energy Yamaha MotoGP Team** at the 2026 Indonesian Grand Prix. The [Yamaha Factory Racing weekend classification](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) supplies these results; MotoGP also published reports for [Friday Practice](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847), [Saturday's Sprint](https://www.motogp.com/en/news/2026/10/10/marc-marquez-wins-dramatic-mandalika-sprint-martin-loses-the-lead-after-rollercoaster-ride-to-fourth/1174849), and [Sunday's Grand Prix](https://www.motogp.com/en/news/2026/10/11/bezzecchi-beats-fernandez-in-mandalika-as-martin-returns-to-championship-summit/1174850).

| Session | Marc Márquez | Fabio Quartararo | Other context |
| :--- | :--- | :--- | :--- |
| Friday Practice | P5; best lap `1:29.426` = `89.426` s | P7; best lap `1:29.558` = `89.558` s | Raúl Fernández of SuperFile Trackhouse MotoGP Team was P1. |
| Saturday Sprint | P1; winning time `19:37.125` over 13 laps | P9; `+10.248` s to Marc | A finishing position or gap describes the Sprint, not one best lap. |
| Sunday Grand Prix | P6; `+10.778` s | P9; `+19.999` s | Both gaps are to winner Marco Bezzecchi of Aprilia Racing; the race lasted 27 laps. |

Friday's **best-lap difference** is `89.558 - 89.426 = 0.132` seconds. Sunday's **finish difference** is `19.999 - 10.778 = 9.221` seconds because both gaps use the same winner as their reference. These are calculations from the published data, not separate official classification entries. We will not subtract a Friday lap from a Saturday or Sunday race gap: those numbers measure different things.

<span id="background-expressions"></span>

### 2. From values to expressions

An **expression** produces a value. An **operator** tells Python what to do with its **operands**. In `fabio_lap - marc_lap`, the two lap times are operands and `-` is the operator. The meaning of an operator can depend on its operands: `+` adds numbers but joins strings.

```python
marc_lap = 89.426
fabio_lap = 89.558
print("{:.3f}".format(fabio_lap - marc_lap))  # 0.132
print("Marc " + "Márquez")                  # Marc Márquez
```

**Why this example?** A real timing subtraction and a real rider name show two uses of expressions without inventing a race statistic. **How do we solve one?** Identify what each operand represents, apply the operator for those types, and label the result with its session and unit.

> **Mental model:** Check the operands, then the operator, then the grouping. A correct Python result still needs a correct MotoGP interpretation.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 1.3 — Expressions and Operators

<span id="part-1-logical"></span>

### 1. Logical operators

`not` reverses a truth value. `and` requires both conditions to hold. `or` requires at least one. Comparisons such as `position == 1` produce Boolean results that these operators can combine.

```python
marc_sprint_position = 1
fabio_sprint_position = 9

print(marc_sprint_position == 1 and fabio_sprint_position <= 10)  # True
print(marc_sprint_position == 1 or fabio_sprint_position == 1)   # True
print(not (fabio_sprint_position == 1))                          # True
```

**Why this example?** Marc's win and Fabio's P9 are facts from the **same Sprint**, so each yes-or-no test has a clear meaning. **How do we solve it?** Evaluate each comparison first; then combine its `True` or `False` result with `and`, `or`, or `not`.

`and` and `or` **short-circuit**: Python skips the right side when the left side already settles the result. That lets us guard a value we have not loaded yet:

```python
race_record = None
safe_top_ten_check = race_record is not None and race_record["position"] <= 10
print(safe_top_ten_check)  # False
```

Python never attempts the lookup after the left side is `False`. Here `None` means “our notebook has not loaded the record”; it does **not** mean the rider lacked a race result. With non-Boolean operands, `and` and `or` can return an operand rather than a literal Boolean, so use explicit comparisons when a yes-or-no answer is intended.

<span id="part-1-equality"></span>

### 2. Equality and identity

`==` asks whether two values are equal; `!=` asks whether they differ. `is` asks whether two names refer to the **same object**; `is not` asks whether they do not. Equal contents do not require the same object.

```python
first_selection = ["Marc Márquez", "Fabio Quartararo"]
second_selection = ["Marc Márquez", "Fabio Quartararo"]
alias = first_selection

print(first_selection == second_selection)  # True
print(first_selection is second_selection)  # False
print(first_selection is alias)              # True
print(first_selection != ["Raúl Fernández"])  # True
```

**Why this example?** Two separate notebook lists can contain the same real riders, while an alias is another name for one list. **How do we solve it?** Use `==` to compare selections by contents; use `is` only when object identity is the question. Use `value is None` for the unique missing-value placeholder. Avoid `is` for comparing numeric results or rider-name strings.

<span id="part-1-comparison"></span>

### 3. Order comparisons

`<`, `<=`, `>`, and `>=` compare order. For lap times, a **smaller** number is quicker; for finishing positions, a **smaller** number is a better placing.

```python
marc_friday_lap_s = 89.426
fabio_friday_lap_s = 89.558
print(marc_friday_lap_s < fabio_friday_lap_s)  # True
print(0 < marc_friday_lap_s < 90)             # True
```

**Why this example?** The Friday best laps have the same unit and session. **How do we solve it?** Compare the numbers directly after converting `m:ss.sss` to seconds. `0 < marc_friday_lap_s < 90` checks both bounds in one readable expression.

Strings compare **lexicographically**, character by character and with case sensitivity. `"9" < "10"` is `False` because the first character `"9"` comes after `"1"`; that is not a numeric position comparison. Convert numeric text before comparing it. In Python 3, an incompatible order comparison such as `5 < "Fabio"` raises `TypeError`.

<span id="part-1-arithmetic"></span>

### 4. Arithmetic operators

| Operator | What it does | Weekend teaching example |
| :--- | :--- | :--- |
| `+`, `-` | Add or subtract numbers. | Sunday: `19.999 - 10.778 = 9.221` s between Marc and Fabio. |
| `*` | Multiply. | `2 * 13 = 26` laps, the length of two Sprint-sized groups. |
| `/` | True division, producing a float. | `13 / 4 = 3.25` groups of four laps. |
| `//` | Floor division. | `13 // 4 = 3` complete four-lap groups. |
| `%` | Remainder paired with `//`. | `13 % 4 = 1` lap left over. |
| `**` | Exponentiation. | `2 ** 3 = 8` include/exclude choices for three sessions. |

The lap-group examples are **illustrative arithmetic on the Sprint's published 13 laps**, not additional race results. A useful check for whole-number grouping is `13 == (13 // 4) * 4 + (13 % 4)`.

```python
sprint_laps = 13
group_size = 4
print(sprint_laps / group_size)   # 3.25
print(sprint_laps // group_size)  # 3
print(sprint_laps % group_size)   # 1
print((sprint_laps // group_size) * group_size + sprint_laps % group_size)  # 13
print(2 ** 3)  # 8
```

**Why this example?** Thirteen laps give a small, exact way to distinguish `/`, `//`, and `%`. **How do we solve it?** Three whole groups use 12 laps; one remains. True division includes the fractional group. With three sessions, each either included or excluded from a notebook view, `2 ** 3` counts eight possible selections.

`//` means **floor**, not truncation toward zero. For a generic signed offset, `-13 // 4` is `-4` and `-13 % 4` is `3`, because `-13 = (-4 * 4) + 3`. With a negative divisor, the remainder has the divisor's sign: `13 // -4` is `-4` and `13 % -4` is `-3`. These signed examples explain Python's rule; they are not lap counts. The quotient-and-remainder identity also applies to floats, subject to floating-point approximation. Division by zero raises `ZeroDivisionError`.

<span id="part-1-bitwise"></span>

### 5. Bitwise operators

Bitwise operators act on an integer's **binary digits**. As a notebook illustration, give Friday, Saturday, and Sunday separate bit flags. The flags indicate which **views we select**, not whether a rider participated.

```python
FRIDAY = 0b001
SATURDAY = 0b010
SUNDAY = 0b100
selected_views = FRIDAY | SATURDAY

print(selected_views)             # 3
print(bool(selected_views & FRIDAY))  # True
print(selected_views ^ SATURDAY)  # 1
print((~selected_views) & 0b111)  # 4
print(FRIDAY << 2)                # 4
print(SUNDAY >> 2)                # 1
```

| Symbol | Bit operation | Notebook reading |
| :--- | :--- | :--- |
| `&` | AND | Keep a flag present in both masks. |
| <code>&#124;</code> | OR | Combine selected session flags. |
| `^` | XOR | Keep flags present in exactly one mask; here it toggles Saturday off. |
| `~` | Complement | Flip bits; mask with `0b111` to keep only our three days. |
| `<<`, `>>` | Shift | Move a bit left or right. |

**Why this example?** Three days give three visible bits, so each result can be checked by looking at `001`, `010`, and `100`. **How do we solve it?** Combine Friday and Saturday with `|` to get `011`; `&` tests a bit, `^` toggles one, and the mask `0b111` limits the complement to our three flags. Python integers have no fixed three-bit width, so `~selected_views` by itself is negative. `^` is XOR, not exponentiation; use `**` for a power.

<span id="part-1-sequences"></span>

### 6. Sequence operators

Lists, tuples, and strings are **ordered sequences**. They support indexing, slicing, concatenation, repetition, membership, and comparisons. This list is a **selected subset** of Friday Practice riders in classification order: Raúl P1, Marc P5, Fabio P7. The positions are not consecutive because we omitted other riders.

```python
selected_friday_riders = ["Raúl Fernández", "Marc Márquez", "Fabio Quartararo"]
print(selected_friday_riders[0])    # Raúl Fernández
print(selected_friday_riders[-1])   # Fabio Quartararo
print(selected_friday_riders[1:3])  # ['Marc Márquez', 'Fabio Quartararo']
print(selected_friday_riders[::2])  # ['Raúl Fernández', 'Fabio Quartararo']
print("Marc Márquez" in selected_friday_riders)      # True
print("Marco Bezzecchi" not in selected_friday_riders)  # True
```

A slice `sequence[start:stop]` includes `start` but excludes `stop`. A third part gives a step: `[::2]` takes every second entry, and `[::-1]` reverses a sequence. Omitted bounds reach the ends; negative indices count backward from the end.

`+` joins sequences of the same kind, and `*` repeats one. These form **notebook entries**, not classification results:

```python
watchlist = ["Marc Márquez"] + ["Fabio Quartararo"]
print(watchlist)                  # ['Marc Márquez', 'Fabio Quartararo']
print(2 * ["Marc Márquez"])       # ['Marc Márquez', 'Marc Márquez']
print("Marc" in "Marc Márquez")   # True
print(["Fabio Quartararo"] < ["Marc Márquez"])  # True
```

String `in` can find a **substring**; list `in` looks for an equal element. Sequence comparisons are lexicographic: the last comparison is true because `"Fabio"` sorts before `"Marc"`, not because Fabio placed ahead. A list can replace or delete entries:

```python
watchlist = ["Marc Márquez", "Fabio Quartararo"]
watchlist[1] = "Raúl Fernández"
del watchlist[0]
print(watchlist)  # ['Raúl Fernández']
```

A list slice can also be replaced or deleted. Strings and tuples cannot be changed in place. **Why these examples?** A small rider selection makes indices and slices easy to see. **How do we solve a sequence question?** Decide whether you need an item, a range, a membership test, or a changed list; then choose the corresponding operation.

<span id="part-1-sets"></span>

### 7. Set and frozenset operators

Sets answer **which distinct riders** appear, without an index or dependable display order. These are the real **top five** from Friday Practice and Sunday's Grand Prix in the [published classifications](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia):

```python
friday_top_five = {
    "Raúl Fernández", "Marco Bezzecchi", "Jorge Martín",
    "Pedro Acosta", "Marc Márquez",
}
sunday_top_five = {
    "Marco Bezzecchi", "Raúl Fernández", "Jorge Martín",
    "Ai Ogura", "Pedro Acosta",
}
print(len(friday_top_five & sunday_top_five))  # 4
print(friday_top_five - sunday_top_five == {"Marc Márquez"})  # True
print(sunday_top_five - friday_top_five == {"Ai Ogura"})      # True
print(friday_top_five ^ sunday_top_five == {"Marc Márquez", "Ai Ogura"})  # True
print(len(friday_top_five | sunday_top_five))  # 6
print({"Marc Márquez"} < friday_top_five)      # True
print(friday_top_five <= friday_top_five)      # True
```

| Set operation | Meaning here |
| :--- | :--- |
| `left & right` | Rider appears in both top fives: **intersection**. |
| <code>left &#124; right</code> | Rider appears in either top five: **union**. |
| `left - right` | Rider appears only in the left top five: **difference**. |
| `left ^ right` | Rider appears in exactly one top five: **symmetric difference**. |
| `left < right`, `left <= right` | Proper subset, or subset including equality. |

**Why this example?** The two real classifications overlap but are not identical: Marc appears only in Friday's top five, while Ai Ogura appears only in Sunday's. **How do we solve it?** Convert each collection of rider names to a set, choose the operation that matches “both,” “either,” or “only one,” and compare sets by membership. `>` and `>=` mean proper superset and superset. Disjoint sets can be incomparable under this partial order. `frozenset` supports the same read-only set operations but cannot be changed.

<span id="part-1-dictionaries"></span>

### 8. Dictionary operators

A dictionary maps **keys** to **values**. This one maps rider names to Friday Practice best laps in seconds:

```python
friday_best_laps = {
    "Marc Márquez": 89.426,
    "Fabio Quartararo": 89.558,
}
print(friday_best_laps["Marc Márquez"])  # 89.426
print("Marc Márquez" in friday_best_laps)  # True
print(89.426 in friday_best_laps)          # False: membership checks keys

friday_best_laps["Raúl Fernández"] = 88.725
print(len(friday_best_laps))  # 3
trial = dict(friday_best_laps)
del trial["Raúl Fernández"]
print("Raúl Fernández" in trial)             # False
print("Raúl Fernández" in friday_best_laps)  # True
```

**Why this example?** We can ask for a particular rider's result without remembering a list index. **How do we solve it?** Use `mapping[key]` to retrieve a value, `mapping[key] = value` to add or replace one, and `del mapping[key]` to remove a **notebook entry**. Removing an entry from `trial` does not alter the published result or the original dictionary. `in` tests keys, not values. Dictionaries compare equal when they contain equal key–value associations; unlike sets, they do not use `<` or `>` for subset order.

<span id="part-1-augmented"></span>

### 9. Extended assignment

`+=`, `-=`, `*=`, and related forms use a name's current value to assign an updated result. Marc completed the 13-lap Sprint and 27-lap Grand Prix; adding these **counts** gives 40 laps across the two races. This sum is a teaching calculation, not a championship statistic.

```python
marc_completed_laps = 0
marc_completed_laps += 13
marc_completed_laps += 27
print(marc_completed_laps)  # 40
```

For numbers, `total += amount` has the same value as `total = total + amount`. For a mutable list, however, `+=` changes the **same list**, so aliases see the change:

```python
watchlist = ["Marc Márquez"]
same_list = watchlist
watchlist += ["Fabio Quartararo"]
print(same_list)  # ['Marc Márquez', 'Fabio Quartararo']

watchlist = watchlist + ["Raúl Fernández"]
print(watchlist)  # ['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández']
print(same_list)  # ['Marc Márquez', 'Fabio Quartararo']
```

**Why this example?** It links the operators to Section 1.2's distinction between mutation and rebinding. **How do we solve it?** Use `+=` for an intended in-place list extension; use `watchlist = watchlist + [...]` or copy first when a separate list is needed. The exact effect of augmented assignment depends on the object's type.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 1.3.1 — Compound Expressions and Operator Precedence

<span id="part-2-grouping"></span>

### 1. Why grouping changes a result

A **compound expression** combines operations. Python groups them by **precedence**, much like algebra. Suppose our teaching question is the **mean of Marc's and Fabio's Friday Practice best laps**, both in seconds. It is not an official classification value:

```python
marc_lap = 89.426
fabio_lap = 89.558
print("{:.3f}".format((marc_lap + fabio_lap) / 2))  # 89.492
print("{:.3f}".format(marc_lap + fabio_lap / 2))    # 134.205
```

**Why this example?** The same two real lap values produce very different results when the grouping changes. **How do we solve it?** Add both times first, then divide the **sum** by two. Parentheses express that intended order. Without them, Python divides only Fabio's time before adding Marc's.

<span id="part-2-table"></span>

### 2. The book's precedence order

This is the Section 1.3.1 hierarchy, from **higher** to **lower** precedence. Parentheses can make a different grouping explicit.

| Priority | Operator family | Form | Weekend reading |
| ---: | :--- | :--- | :--- |
| 1 | Member access | `object.member` | `name.lower`. |
| 2 | Calls, indexing, slicing | `f(...)`, `data[i]`, `data[a:b]` | `laps["Marc Márquez"]`. |
| 3 | Exponentiation | `**` | `2 ** 3` session-view choices. |
| 4 | Unary sign and bit complement | `+x`, `-x`, `~x` | A signed difference or bit mask. |
| 5 | Multiplication and division | `*`, `/`, `//`, `%` | Group 13 Sprint laps. |
| 6 | Addition and subtraction | `+`, `-` | Subtract two Friday best laps. |
| 7 | Bit shifts | `<<`, `>>` | Move a session-view bit. |
| 8 | Bitwise AND | `&` | Test a session-view bit. |
| 9 | Bitwise XOR | `^` | Toggle one bit. |
| 10 | Bitwise OR | <code>&#124;</code> | Combine bit flags. |
| 11 | Comparisons, identity, membership | `== != < <= > >= is is not in not in` | Check positions or rider membership. |
| 12 | Logical NOT | `not` | Reverse a condition. |
| 13 | Logical AND | `and` | Require two conditions. |
| 14 | Logical OR | `or` | Accept either condition. |
| 15 | Conditional expression | `yes if condition else no` | Choose a message from a comparison. |
| 16 | Assignment forms | `=`, `+=`, and related forms | Save or update a result. |

The book puts assignment at the bottom as a practical reading aid. Ordinary `=` is an **assignment statement**, not a general value-producing expression that can be inserted anywhere. The table helps read code; parentheses still make a compound calculation easier to check.

<span id="part-2-associativity"></span>

### 3. Equal precedence and exponentiation

Most operators at the same level group **left to right**. Exponentiation and nested unary operators group **right to left**. Small numbers isolate these rules from the weekend data:

```python
print(10 - 3 + 2)  # 9: (10 - 3) + 2
print(2 ** 3 ** 2)  # 512: 2 ** (3 ** 2)
print(-2 ** 2)     # -4: -(2 ** 2)
print((-2) ** 2)   # 4
print(2 ** -2)     # 0.25
```

**Why this example?** Real lap times would hide which operator grouped first. **How do we solve it?** Work from parentheses, then the precedence table. Powers nest from the right; a leading minus applies after the power, while a minus on the right of `**` may be part of its exponent. Use parentheses when the sign matters.

<span id="part-2-chains"></span>

### 4. Chained comparisons, assignment, and a conditional expression

A comparison chain checks both bounds without repeating the middle value:

```python
marc_friday_lap_s = 89.426
fabio_friday_lap_s = 89.558

print(0 < marc_friday_lap_s < 90)  # True
quicker_of_two = (
    "Marc Márquez" if marc_friday_lap_s < fabio_friday_lap_s
    else "Fabio Quartararo"
)
print(quicker_of_two)  # Marc Márquez
```

`0 < marc_friday_lap_s < 90` means the lap time is above zero **and** below 90 seconds. Python evaluates the middle expression once; it does not compare a Boolean with `90`. The conditional expression chooses the quicker rider **of these two**, not the overall Friday Practice leader (Raúl Fernández was P1).

Python also allows chained assignment:

```python
first_note = second_note = ["Marc Márquez"]
print(first_note is second_note)  # True
first_note.append("Fabio Quartararo")
print(second_note)  # ['Marc Márquez', 'Fabio Quartararo']
```

**Why these examples?** The chain expresses a realistic time range, the conditional chooses one of two riders, and chained assignment reveals shared list identity. **How do we solve them?** Read a comparison chain as joined tests, read `a if test else b` as “choose `a` when true,” and remember that both assignment targets can refer to the same mutable object.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: A Connected MotoGP Weekend Program

This program answers three **separate** questions with verified results: who had the quicker Friday best lap, who placed ahead in Saturday's Sprint, and how far apart Marc and Fabio finished on Sunday. The Sunday gaps both use winner **Marco Bezzecchi** as their reference.

```python
marc = "Marc Márquez"
fabio = "Fabio Quartararo"

teams = {
    marc: "Ducati Lenovo Team",
    fabio: "Monster Energy Yamaha MotoGP Team",
}
friday_lap_s = {marc: 89.426, fabio: 89.558}
sprint_positions = {marc: 1, fabio: 9}
sunday_positions = {marc: 6, fabio: 9}
sunday_gaps_to_winner_s = {marc: 10.778, fabio: 19.999}

friday_gap_s = friday_lap_s[fabio] - friday_lap_s[marc]
sunday_finish_gap_s = (
    sunday_gaps_to_winner_s[fabio] - sunday_gaps_to_winner_s[marc]
)
friday_quicker = marc if friday_lap_s[marc] < friday_lap_s[fabio] else fabio
sprint_ahead = marc if sprint_positions[marc] < sprint_positions[fabio] else fabio
both_friday_under_90 = (
    0 < friday_lap_s[marc] < 90 and 0 < friday_lap_s[fabio] < 90
)

print("{} — {}".format(marc, teams[marc]))
print("{} — {}".format(fabio, teams[fabio]))
print("Friday Practice: {} quicker by {:.3f} s".format(friday_quicker, friday_gap_s))
print("Both Friday best laps under 90 s: {}".format(both_friday_under_90))
print("Saturday Sprint: {} ahead (P{} vs P{})".format(
    sprint_ahead, sprint_positions[marc], sprint_positions[fabio],
))
print("Sunday Grand Prix: Marc P{}, Fabio P{}; finish gap {:.3f} s".format(
    sunday_positions[marc], sunday_positions[fabio], sunday_finish_gap_s,
))
```

**Output:**

```text
Marc Márquez — Ducati Lenovo Team
Fabio Quartararo — Monster Energy Yamaha MotoGP Team
Friday Practice: Marc Márquez quicker by 0.132 s
Both Friday best laps under 90 s: True
Saturday Sprint: Marc Márquez ahead (P1 vs P9)
Sunday Grand Prix: Marc P6, Fabio P9; finish gap 9.221 s
```

**Why this example?** It uses dictionary lookup, subtraction, comparisons, `and`, a chained comparison, and conditional expressions in one small, coherent weekend report. **How do we solve it?**

1. Store each session's values in a separately named dictionary with a unit where needed.
2. Compare **Friday best laps** with each other; smaller seconds means quicker.
3. Compare **Saturday Sprint positions** with each other; smaller position means ahead.
4. Subtract the two **Sunday race gaps to the same winner** to find the time between Marc and Fabio.
5. Format the derived differences to three decimal places, matching the published millisecond precision.

The program does not average or subtract unlike measures across sessions. The 0.132-second and 9.221-second differences are derived answers, not extra classification rows.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple MotoGP Study Cases

<span id="part-4-average"></span>

### 1. An average needs parentheses

**Scenario:** A teaching note asks for the mean of Marc's and Fabio's **Friday Practice best laps**.

**Why this case?** It makes precedence visible in a calculation where the intended order can be checked by hand.

```python
marc_lap_s = 89.426
fabio_lap_s = 89.558
wrong_mean = marc_lap_s + fabio_lap_s / 2
correct_mean = (marc_lap_s + fabio_lap_s) / 2
print("{:.3f}".format(wrong_mean))    # 134.205
print("{:.3f}".format(correct_mean))  # 89.492
```

**How to solve it:** The mean is **the sum of two times divided by two**. Put the sum in parentheses. `134.205` seconds is not a reasonable mean of two values near 89 seconds; checking the expected scale catches the mistake. The mean is a teaching calculation, not an official Practice statistic.

<span id="part-4-text"></span>

### 2. Text positions need conversion

**Scenario:** Saturday's Sprint placed **Fabio Quartararo P9** and his Monster Energy Yamaha MotoGP teammate **Álex Rins P10**. Suppose their positions arrive as strings.

**Why this case?** String ordering follows characters, so it can give the opposite answer from numeric position ordering.

```python
fabio_place_text = "9"
rins_place_text = "10"
print(fabio_place_text < rins_place_text)            # False
print(int(fabio_place_text) < int(rins_place_text))  # True
```

**How to solve it:** Convert both strings with `int(...)`, then compare `9 < 10`. A lower finishing position number means Fabio placed ahead. The raw string comparison looks first at `"9"` and `"1"`, so it answers an alphabetical question instead.

<span id="part-4-list"></span>

### 3. `+=` changes a shared list

**Scenario:** We want to keep an earlier two-rider notebook selection before adding another real weekend rider.

**Why this case?** The two forms of addition look similar, but one changes the list that an alias also sees.

```python
watchlist = ["Marc Márquez", "Fabio Quartararo"]
earlier = watchlist
watchlist += ["Raúl Fernández"]
print(earlier)  # ['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández']
```

**How to solve it:** Copy the list **before** extending it when the earlier selection must stay separate:

```python
watchlist = ["Marc Márquez", "Fabio Quartararo"]
earlier = list(watchlist)
watchlist += ["Raúl Fernández"]
print(earlier)    # ['Marc Márquez', 'Fabio Quartararo']
print(watchlist)  # ['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández']
```

These are notebook selections, not complete session classifications. The copied outer list is enough here because the rider-name strings are immutable.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section idea | Question it answers | Weekend example |
| :--- | :--- | :--- |
| Logical `not`, `and`, `or` | Do one or more conditions hold? | Marc P1 in the Sprint **and** Fabio P9. |
| Equality `==` versus identity `is` | Are values equal, or are names aliases? | Equal rider lists can be separate objects. |
| Order comparisons | Which number is lower or higher? | `89.426 < 89.558`: Marc's Friday best lap was quicker. |
| Arithmetic `+ - * / // % **` | What is a difference, quotient, remainder, or power? | Friday best-lap gap `0.132` s; 13 Sprint laps in groups of four. |
| Bitwise operators | Which binary flags are selected? | Friday and Saturday notebook views. |
| Sequence index, slice, `+`, `*`, `in` | Which selected riders appear, and in what order? | A Friday Practice rider selection. |
| Set operations and subset comparisons | Which riders occur in both or either collection? | Friday and Sunday top-five riders. |
| Dictionary lookup and membership | What value belongs to a rider key? | `friday_best_laps["Marc Márquez"]`. |
| Extended assignment | How does a value or shared collection change? | `marc_completed_laps += 13`; list `+=`. |
| Precedence and parentheses | Which operation happens first? | `(89.426 + 89.558) / 2`. |

> **Mental model:** Name the session and unit, choose the operator that answers the question, then use parentheses when the grouping carries meaning. Check that the result still describes the MotoGP fact you started with.

[🔝 Back to Top](#top)

