<span id="top"></span>

# 13.2 Pattern-Matching Algorithms — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 13, Section 13.2, printed pages 584–593 (the supplied PDF).<br>
> **Topic:** 13.2 Pattern-Matching Algorithms; 13.2.1 Brute Force; 13.2.2 The Boyer-Moore Algorithm; 13.2.3 The Knuth-Morris-Pratt Algorithm.<br>
> **Domain Focus:** Searching a grid robot's direction string for two consecutive trips around a unit square.<br>
> **User Prompt:** Reexplain [`Section 13.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Repeated Square Route](#background)
   - [1. Directions as text](#background-route)
   - [2. The search question](#background-question)
2. [Part 1: 13.2 Pattern-Matching Algorithms](#part-1)
   - [1. Define a match precisely](#part-1-definition)
   - [2. Connect the problem to Python's string tools](#part-1-python)
3. [Part 2: 13.2.1 Brute Force](#part-2)
   - [1. Try every possible starting position](#part-2-idea)
   - [2. Trace the route example](#part-2-trace)
   - [3. Code and cost](#part-2-code)
4. [Part 3: 13.2.2 The Boyer-Moore Algorithm](#part-3)
   - [1. Look from right to left](#part-3-look)
   - [2. Use the last occurrence to jump](#part-3-jump)
   - [3. Trace the same route](#part-3-trace)
   - [4. Code and cost](#part-3-code)
5. [Part 4: 13.2.3 The Knuth-Morris-Pratt Algorithm](#part-4)
   - [1. Use overlap within the pattern](#part-4-overlap)
   - [2. Build the failure function](#part-4-failure)
   - [3. Search without rereading earlier text](#part-4-search)
   - [4. Code and cost](#part-4-code)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Repeated Square Route

<span id="background-route"></span>

### 1. Directions as text

Continue the grid-robot idea from Section 13.1. The robot starts at (0, 0), and each character makes one unit move: `E` east, `N` north, `W` west, or `S` south. The four-character route `ENWS` goes east, north, west, and south. It traces the boundary of a **1-by-1 square** and returns to its starting point.

```text
(0, 1) ← (1, 1)
   ↓         ↑
(0, 0) → (1, 0)
```

The square has perimeter `4 × 1 = 4` units and area `1 × 1 = 1` square unit. Following `ENWSENWS` makes **two laps around that same square**. The robot travels 8 units, but the enclosed region still has area 1 square unit.

<span id="background-question"></span>

### 2. The search question

Suppose a long instruction string contains a slightly wrong attempt followed by two exact square laps:

```text
Text T:     ENWSENWEENWSENWS
Pattern P:  ENWSENWS
```

The text has `n = 16` characters; the pattern has `m = 8`. The first eight text characters are `ENWSENWE`: they agree with the pattern for seven characters, but the eighth is `E` instead of `S`. The final eight text characters, `T[8:16]`, equal the whole pattern. Thus the **first exact match begins at index 8**.

After the first eight moves, the robot is at (1, 1). From that point, the matching suffix draws the 1-by-1 square twice and returns to (1, 1). The match index `8` is a **text position**; `(1, 1)` is a **grid coordinate**.

Every algorithm below answers this same question. They differ in which characters they compare and which possible starting positions they test.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 13.2 Pattern-Matching Algorithms

<span id="part-1-definition"></span>

### 1. Define a match precisely

Let `T` be a text of length `n` and `P` be a pattern of length `m`. A match at starting index `s` means:

```text
T[s:s+m] == P
```

Equivalently, `T[s+k] == P[k]` for **every** pattern index `k` from `0` through `m - 1`. The possible starting indexes are `0` through `n - m` when `m ≤ n`. Our example has `16 - 8 + 1 = 9` possible starts: `0, 1, ..., 8`. The algorithms in this section return the **smallest** matching index, or `-1` if there is no match.

The book's text example looks for `"abacab"` inside a longer letter string and finds its first match at index 10. Our direction letters change the story, but the definition of a substring match is identical. An exact match compares **characters in order**; it does not decide whether two routes draw the same geometric picture.

<span id="part-1-python"></span>

### 2. Connect the problem to Python's string tools

Python already supplies string-search operations. They are useful for checking the answer while we study the algorithms behind the problem:

```python
text = "ENWSENWEENWSENWS"
pattern = "ENWSENWS"

print(pattern in text)       # True: a match exists
print(text.find(pattern))    # 8: first matching index
print(text.find("NN"))       # -1: no such substring
```

`text.index(pattern)` also finds the first index, but raises `ValueError` if the pattern is absent. `text.count(pattern)` counts non-overlapping occurrences; it is `1` for this text. Operations such as `partition`, `split`, and `replace` also need to locate text pieces. The three algorithms below focus on the basic **first-match** task, with the same `0` and `-1` return conventions as `str.find`.

> **Mental model:** Slide a pattern across the text. At each possible start, ask whether every pattern character equals the text character directly under it.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 13.2.1 Brute Force

<span id="part-2-idea"></span>

### 1. Try every possible starting position

The **brute-force** method begins at text index 0. It compares the pattern **left to right** with the text at that position. On a mismatch, it moves the pattern one position to the right and starts again at the pattern's first character. It stops at the first full match or after the last possible start.

```text
For s = 0, 1, ..., n - m:
    compare P[0] with T[s], P[1] with T[s+1], and so on
    if all m comparisons match, return s
Return -1 if no start worked
```

Checking the starts in increasing order makes the returned match the **first** one. Checking every valid start means a match cannot be missed.

<span id="part-2-trace"></span>

### 2. Trace the route example

At start `s = 0`, `T[0:8]` is `"ENWSENWE"`. The first seven characters agree with `P`, but `T[7]` is `"E"` while `P[7]` is `"S"`. Brute force then tries the next start.

| Start `s` | Consecutive characters matched from the left | Outcome |
| --------: | -------------------------------------------: | :------ |
| 0 | 7 | Last character differs: `E` versus `S`. |
| 1 | 0 | First character differs. |
| 2 | 0 | First character differs. |
| 3 | 0 | First character differs. |
| 4 | 3 | Fourth character differs: `E` versus `S`. |
| 5 | 0 | First character differs. |
| 6 | 0 | First character differs. |
| 7 | 1 | Second character differs: `E` versus `N`. |
| 8 | 8 | Full match: `T[8:16] == P`. |

Start 8 is the first full match, so the answer is `8`. The algorithm does not need to interpret the drawing to find it; the geometry helps us understand **what** that matching sequence describes.

<span id="part-2-code"></span>

### 3. Code and cost

```python
def find_brute(text, pattern):
    n, m = len(text), len(pattern)

    for start in range(n - m + 1):
        matched = 0
        while matched < m and text[start + matched] == pattern[matched]:
            matched += 1
        if matched == m:
            return start
    return -1


text = "ENWSENWEENWSENWS"
pattern = "ENWSENWS"
print(find_brute(text, pattern))  # 8
```

There are at most `n - m + 1` candidate starts, and one candidate may require `m` comparisons. The worst-case running time is therefore **`O(nm)`**; the search uses **`O(1)` extra space**. For example, if the text is many `E` moves and the pattern is many `E` moves followed by `N`, each candidate nearly matches before failing.

When `pattern == ""`, the first candidate succeeds immediately and the function returns `0`. When the pattern is longer than the text, there are no valid starts and it returns `-1`.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 13.2.2 The Boyer-Moore Algorithm

The book presents a **simplified Boyer-Moore** search using two ideas: look at a candidate from right to left, then use a mismatched character to jump over starts that cannot work.

<span id="part-3-look"></span>

### 1. Look from right to left

For each candidate start, compare the **last** pattern character first. If it matches, continue leftward. This is the book's **looking-glass heuristic**. A mismatch at the right edge can be detected with only one comparison; a matching suffix can still lead to an interior mismatch.

At start 0 in our example, the very first comparison is `P[7] = "S"` against `T[7] = "E"`. They differ. We can use that `"E"` to decide how far to move the pattern.

<span id="part-3-jump"></span>

### 2. Use the last occurrence to jump

Before searching, record the **rightmost index** of each character in the pattern:

| Character | `E` | `N` | `W` | `S` |
| :-------- | --: | --: | --: | --: |
| `last` index in `P = "ENWSENWS"` | 4 | 5 | 6 | 7 |

Suppose the current pattern index `j` mismatches the text character `c`. Let `last(c)` be the table value, or `-1` if `c` does not occur in the pattern. The simplified **character-jump heuristic** shifts the candidate start by:

```text
shift = max(1, j - last(c))
```

If `last(c) < j`, the shift lines up that rightmost occurrence of `c` with the mismatched text character. If `c` is absent, `last(c) = -1`, so the shift is `j + 1`: the whole relevant part of the pattern moves past it. If `last(c) > j`, a backward shift would be wrong, so we move right by just 1. On a real mismatch, `last(c) = j` cannot happen, because `P[j]` would then equal `c`.

For the mismatch at start 0, `j = 7`, `c = "E"`, and `last("E") = 4`. Thus `shift = 7 - 4 = 3`: starts 1 and 2 are skipped.

<span id="part-3-trace"></span>

### 3. Trace the same route

| Candidate start | Right-to-left result | Mismatch index `j` | Mismatched text character | Shift | Next start |
| --------------: | :------------------- | -----------------: | :------------------------ | ----: | ---------: |
| 0 | Last characters differ. | 7 | `E` | 3 | 3 |
| 3 | Last characters differ. | 7 | `W` | 1 | 4 |
| 4 | Four rightmost characters match, then a mismatch. | 3 | `E` | 1 | 5 |
| 5 | Last characters differ. | 7 | `E` | 3 | 8 |
| 8 | All eight characters match. | — | — | — | Return 8. |

At start 4, `last("E") = 4` lies **to the right** of the mismatching pattern index `j = 3`, so the shift is only 1. The algorithm cannot assume a large jump on every mismatch. In this example it examines five starts instead of brute force's nine, while still finding the first match.

<span id="part-3-code"></span>

### 4. Code and cost

```python
def find_boyer_moore(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0:
        return 0

    last = {character: index for index, character in enumerate(pattern)}
    start = 0

    while start <= n - m:
        j = m - 1
        while j >= 0 and pattern[j] == text[start + j]:
            j -= 1
        if j < 0:
            return start

        mismatched = text[start + j]
        start += max(1, j - last.get(mismatched, -1))
    return -1


print(find_boyer_moore("ENWSENWEENWSENWS", "ENWSENWS"))  # 8
```

The table takes **`O(m)` expected time** to build with a Python dictionary and stores at most `m` distinct characters. Search can still make **`O(nm)` character comparisons** in the worst case. The book's fixed-alphabet array analysis includes an `O(|Σ|)` table-initialization term. The original, fuller Boyer-Moore algorithm adds another shift rule and has a stronger worst-case bound; the code here follows the book's simplified version.

The reason for the worst case is visible in a straight-line route. If the text is many `E` moves and the pattern is `"NEEEEE"`, right-to-left comparison matches five `E` characters before failing at the initial `N`. The mismatched `E` occurs to the right in the pattern, so the start moves only one position. This repeats at many starts.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 13.2.3 The Knuth-Morris-Pratt Algorithm

<span id="part-4-overlap"></span>

### 1. Use overlap within the pattern

The **Knuth-Morris-Pratt (KMP)** method compares left to right, as brute force does. Its advantage comes after a partial match fails: it uses the pattern's own repeated pieces to determine which earlier comparisons are already known to hold.

Our pattern is two copies of a square lap:

```text
P = ENWS ENWS
    └──┘ └──┘
    lap 1 lap 2
```

The pattern begins with `"ENWS"` and ends with `"ENWS"`. That shared piece is a **border**: a prefix that is also a suffix. Such overlap tells KMP how much of a partial match it can keep after a mismatch. Geometrically, it is the same four-move square loop appearing twice in the instruction string.

<span id="part-4-failure"></span>

### 2. Build the failure function

For each pattern index `k`, the **failure value** `fail[k]` is the length of the longest **proper prefix** of `P[:k+1]` that is also a suffix of `P[:k+1]`. “Proper” means shorter than that entire piece. We always have `fail[0] = 0`.

```text
Pattern index k:  0 1 2 3 4 5 6 7
P[k]:             E N W S E N W S
fail[k]:          0 0 0 0 1 2 3 4
```

For example, `P[:7]` is `"ENWSENW"`. Its longest proper prefix that is also a suffix is `"ENW"`, so `fail[6] = 3`. For the whole pattern, the shared prefix and suffix are `"ENWS"`, so `fail[7] = 4`. The first four values are zero because no nonempty proper prefix of those pieces is also their suffix.

The failure table can be built in **`O(m)` time**. When a candidate border fails, the algorithm tries the next shorter border recorded in the table instead of checking every length from scratch.

<span id="part-4-search"></span>

### 3. Search without rereading earlier text

KMP keeps two positions: the current text index and the number of pattern characters already matched. It **does not move the text index backward** after a mismatch.

| Text position | What happens | Matched pattern length afterward |
| :------------ | :----------- | -------------------------------: |
| `0` through `6` | `"ENWSENW"` agrees with the first seven pattern characters. | 7 |
| `7`, character `E` | Expected `P[7] = "S"`. Fall back from 7 to `fail[6] = 3`; `E` also differs from `P[3] = "S"`, so fall back to 0. Then `E` matches `P[0]`. | 1 |
| `8`, character `E` | Expected `P[1] = "N"`. Fall back to 0, then match `P[0]` with this same text character. | 1 |
| `9` through `15` | `"NWSENWS"` completes the pattern. | 8 |

The match ends at text index 15, so its start is `15 - 8 + 1 = 8`. The key moment is text index 7: KMP tests that **same** `E` against shorter possible prefixes, but does not reread text positions 0 through 6.

<span id="part-4-code"></span>

### 4. Code and cost

```python
def build_failure(pattern):
    fail = [0] * len(pattern)
    border = 0

    for index in range(1, len(pattern)):
        while border > 0 and pattern[index] != pattern[border]:
            border = fail[border - 1]
        if pattern[index] == pattern[border]:
            border += 1
            fail[index] = border
    return fail


def find_kmp(text, pattern):
    if pattern == "":
        return 0

    fail = build_failure(pattern)
    matched = 0
    for index, character in enumerate(text):
        while matched > 0 and character != pattern[matched]:
            matched = fail[matched - 1]
        if character == pattern[matched]:
            matched += 1
            if matched == len(pattern):
                return index - len(pattern) + 1
    return -1


text = "ENWSENWEENWSENWS"
pattern = "ENWSENWS"
print(build_failure(pattern))  # [0, 0, 0, 0, 1, 2, 3, 4]
print(find_kmp(text, pattern))  # 8
```

Building the failure table takes **`O(m)` time and space**. Searching takes **`O(n)` time**, so the whole procedure is **`O(n + m)`**. The book's argument is that a search comparison either advances the text position or moves the candidate start forward through a failure-table fallback. Neither can advance beyond the text indefinitely. KMP therefore avoids the repeated near-complete comparisons that cause the earlier two methods' worst cases.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Do two routes that draw the same square match as text?</strong></summary>

**Scenario:** `ENWS` and `NESW` each go around the same 1-by-1 square from (0, 0) and return to the start, but in opposite directions.

**Problem:** A student expects a search for `"ENWS"` in `"NESW"` to succeed because the drawings cover the same boundary.

**Fix:** Compare the characters, starting at index 0. The first characters are `E` and `N`, so the strings are different.

**Result:** `"NESW".find("ENWS")` is `-1`. Exact pattern matching answers a question about **instruction sequences**, not geometric equivalence.

</details>

<details>
<summary><strong>Case Study 2: Can two square laps overlap as matches?</strong></summary>

**Scenario:** The text is `"ENWSENWSENWS"`, three consecutive square laps, and the pattern is `"ENWSENWS"`, two laps.

**Problem:** Looking only for the first match can hide another valid start.

**Fix:** Check the two eight-character slices: `T[0:8]` and `T[4:12]` both equal the pattern. Their matches share the middle `ENWS` lap.

**Result:** There are matches at indexes **0 and 4**. The functions in this guide return **0**, the first one. KMP's `fail[7] = 4` captures the overlap that is useful when adapting the search to find every match.

</details>

<details>
<summary><strong>Case Study 3: What do empty and oversized patterns mean?</strong></summary>

**Scenario:** The route text is `"ENWS"`. We search once for `""` and once for `"ENWSENWS"`.

**Problem:** It may seem that an empty pattern has no place to match, or that a long pattern could match if its drawing has the same shape.

**Fix:** Apply the substring definition. The empty string is present at the boundary before the first character; an eight-character pattern cannot fit inside a four-character text.

**Result:** All three functions return **0** for `""` and **-1** for `"ENWSENWS"`. These are the same conventions as `str.find`.

</details>

<details>
<summary><strong>Case Study 4: Does Boyer-Moore always jump far?</strong></summary>

**Scenario:** The text is a long straight eastward route, `"EEEEEEEEEE"`, and the pattern is `"NEEEEE"`.

**Problem:** A right-to-left scan seems fast, but each candidate matches five `E` moves before failing at the initial `N`.

**Fix:** Apply the last-occurrence rule. The mismatched text character `E` last appears at pattern index 5, to the right of the mismatch at index 0, so the shift is only 1.

**Result:** The simplified Boyer-Moore search repeats a long comparison at successive starts and returns **-1**. Its worst-case character-comparison cost remains `O(nm)`.

</details>

<details>
<summary><strong>Case Study 5: What does the match index mean on the grid?</strong></summary>

**Scenario:** All three algorithms return `8` for the main text and pattern.

**Problem:** Index 8 might be mistaken for an x-coordinate, a distance, or an area.

**Fix:** Follow the first eight moves, `"ENWSENWE"`, from (0, 0). They end at (1, 1). The match starts with the **next** move and traces the unit square twice from there.

**Result:** `8` is the offset in the text. The matching path starts at **(1, 1)**, travels **8 units**, and traces a region of **1 square unit** twice.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Method | Comparison direction | Information used to skip work | Worst-case character comparisons | Extra storage |
| :----- | :------------------- | :---------------------------- | :------------------------------- | :------------ |
| **Brute force** | Left to right at each start | None; try the next start. | `O(nm)` | `O(1)` |
| **Simplified Boyer-Moore** | Right to left at each start | Rightmost position of a mismatched character in `P`. | `O(nm)` | `O(d)` for `d` distinct pattern characters |
| **KMP** | Left to right through the text | The failure table for prefixes that are also suffixes. | `O(n)` after `O(m)` preprocessing | `O(m)` |

Each method returns **8** for the guide's route because `T[8:16] == "ENWSENWS"`. Their answers agree; their comparison strategies and worst-case costs differ. The matched text describes two laps around a unit square, while the returned number identifies **where those instructions begin in the text**.

[🔝 Back to Top](#top)
