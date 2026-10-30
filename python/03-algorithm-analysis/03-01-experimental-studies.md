<span id="top"></span>

# 3.1 Experimental Studies — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 3, Section 3.1, printed pages 111–114 (the supplied PDF).  
> **Topic:** 3.1 Experimental Studies; Challenges of Experimental Analysis; 3.1.1 Moving Beyond Experimental Analysis.  
> **Domain Focus:** Rectangular cards measured in centimetres; finding the first card whose area reaches a chosen size.  
> **User Prompt:** Reexplain [`Section 3.1`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: The Rectangle-Card Search](#background)
   - [1. The geometry problem](#background-problem)
   - [2. What does input size mean?](#background-size)
2. [Part 1: 3.1 Experimental Studies](#part-1)
   - [1. Measure elapsed time](#part-1-timing)
   - [2. Repeat the experiment and vary the input](#part-1-inputs)
   - [3. Read a running time plot](#part-1-plot)
3. [Part 2: Challenges of Experimental Analysis](#part-2)
   - [1. Different environments are hard to compare](#part-2-environments)
   - [2. A finite sample cannot cover every input](#part-2-samples)
   - [3. Timing requires an implementation](#part-2-implementation)
4. [Part 3: 3.1.1 Moving Beyond Experimental Analysis](#part-3)
   - [1. What a general analysis should do](#part-3-goals)
   - [2. Counting Primitive Operations](#part-3-operations)
   - [3. Measuring Operations as a Function of Input Size](#part-3-function)
   - [4. Focusing on the Worst-Case Input](#part-3-worst)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: The Rectangle-Card Search

<span id="background-problem"></span>

### 1. The geometry problem

Imagine a workshop with rectangular cards. Each card has a width and height in centimetres, and its **area is width × height**. These are the same simple cards used in the earlier Python overview:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |

We want the **position of the first card with area at least 16 cm²**. In the ordered list `A, B, C`, the first qualifying card is `C` at index `2`: we check areas 6, then 8, then 16. In `C, A, B`, `C` is at index `0`, so we stop after one check. If no card reaches 16 cm², we inspect the entire list and report that there is no match.

Here is the algorithm in Python. Positions start at `0`, as Python list indexes do:

```python
def first_large_card(cards, minimum_area):
    for index, (width, height) in enumerate(cards):
        if width * height >= minimum_area:
            return index
    return None


cards = [(2, 3), (4, 2), (4, 4)]  # A, B, C
print(first_large_card(cards, 16))  # 2: C is at index 2
```

The area calculation gives the **answer to the geometry question**. Section 3.1 asks a different question: **how much work does the algorithm do to find that answer?**

<span id="background-size"></span>

### 2. What does input size mean?

For this search, the **input size** `n` is the number of cards in the list. It is not the width, height, area, or area threshold. We keep the dimensions small and the threshold fixed at 16 cm² so that changing `n` mainly changes how many cards may need checking.

| Input list | `n` | First qualifying card | Cards checked |
| :--- | ---: | :--- | ---: |
| `A, B, C` | 3 | Third card | 3 |
| `C, A, B` | 3 | First card | 1 |
| `A, B, A` | 3 | None | 3 |

The first two lists have the same `n` and the same cards. Their different order changes how soon the search stops. This observation will matter when we discuss experiments, input structure, and worst-case analysis.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 3.1 Experimental Studies

The book begins with **experimental analysis**: implement an algorithm, run it on test inputs, and record how long each run takes. The measurements help us see how running time changes as inputs change.

<span id="part-1-timing"></span>

### 1. Measure elapsed time

The basic measurement is a difference between two clock readings:

```text
elapsed time = ending time − starting time
```

The book demonstrates this idea with `time.time()`, which reads a wall clock as seconds since a fixed starting point called the **epoch**. Subtracting the two readings removes that starting point and leaves the elapsed seconds. Here is the same experiment using `time.perf_counter()`, a clock suited to measuring short elapsed intervals in current Python:

```python
from time import perf_counter

cards = [(2, 3)] * 9_999 + [(4, 4)]  # 10,000 cards; C is last

start = perf_counter()
position = first_large_card(cards, 16)
elapsed_seconds = perf_counter() - start

print(position)         # 9999
print(elapsed_seconds)  # varies from run to run and machine to machine
```

The list is built **before** `start`, so the measured interval covers the search rather than card creation. The returned position is predictable; the measured seconds are not. `perf_counter()` gives elapsed time, which may include pauses while the computer runs other work. The book also mentions `time.clock()`; [Python removed it in 3.8](https://docs.python.org/3.12/whatsnew/3.8.html#api-and-feature-removals). For CPU time specifically, current Python provides [`time.process_time()`](https://docs.python.org/3.12/library/time.html#time.process_time).

<span id="part-1-inputs"></span>

### 2. Repeat the experiment and vary the input

One clock reading can be noisy, especially for a short search. The book mentions Python's `timeit` module for repeated timing. This runnable experiment repeats the **same search** 100 times per trial and makes five trials for each input size:

```python
from timeit import repeat

for n in (1_000, 2_000, 4_000, 8_000):
    cards = [(2, 3)] * (n - 1) + [(4, 4)]  # C is last
    trials = repeat(
        lambda: first_large_card(cards, 16),
        number=100,
        repeat=5,
    )
    best_ms_per_search = 1_000 * min(trials) / 100
    print(n, best_ms_per_search)
```

Each printed row is a **summary measurement** for that `n`: the fastest of five trial totals, each covering 100 calls, divided by 100. The result is in milliseconds per call. It includes some overhead from the lambda and timing loop, so it is a useful reference rather than a guaranteed running time. To study input structure as well as size, also try a list with `C` first and one with no `C` at each `n`. Keep the Python version, machine, threshold, and measurement procedure the same when comparing these runs. See the [Python `timeit` documentation](https://docs.python.org/3.12/library/timeit.html#python-interface) for how `number` and `repeat` work.

| Test at size `n` | Example list | Area checks before stopping |
| :--- | :--- | ---: |
| Match first | `C, A, A, ...` | 1 |
| Match last | `A, A, ..., C` | `n` |
| No match | `A, A, A, ...` | `n` |

The table predicts the **work**, not exact milliseconds. Timing can confirm a trend, but the clock cannot tell us the number of elementary operations directly.

<span id="part-1-plot"></span>

### 3. Read a running time plot

Figure 3.1 in the book uses hypothetical timing data: input size `n` is on the horizontal axis and measured running time `t` is on the vertical axis. A dot at `(n, t)` means **one run** on an input of size `n` took `t` milliseconds. Several runs may produce several dots at the same `n`. To mirror that figure, plot individual trial times rather than the summary measurements printed by the `timeit` example.

For our card search, the horizontal value could be `n = 4_000`; the vertical value is whatever the timer measured for that particular list and run. A list with `C` first may produce a much lower dot than one with `C` last, even at the same size. Repeating at several sizes can suggest a pattern, and a statistical fit may describe the sampled dots. A meaningful claim needs enough representative inputs and trials; a smooth plot alone is not a proof about every input.

> **Mental model:** A timer measures a particular **run**. A plot collects runs. Neither one automatically describes all lists of the same size.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Challenges of Experimental Analysis

The book identifies three limits of timing experiments. Each appears in the rectangle-card search.

<span id="part-2-environments"></span>

### 1. Different environments are hard to compare

Suppose one student times the search on a laptop and another times it on a faster desktop. A shorter measured time may reflect the hardware, Python implementation, system load, or other software rather than a better algorithm. Even two runs on one computer can differ while other processes share the CPU.

To compare two search methods experimentally, run both with the **same input lists and measurement setup** on the same environment. Record the environment when sharing results. The measurement is still an observation about those runs, not an environment-independent property of the method.

<span id="part-2-samples"></span>

### 2. A finite sample cannot cover every input

Suppose we time only lists beginning with `C`. Every tested search stops after one card, even when `n` is large. Those tests miss lists with `C` last or no qualifying card, where the search checks all `n` cards.

No finite set of trials covers every possible size and ordering. Choosing varied, representative inputs improves an experiment, but untested inputs can still behave differently.

<span id="part-2-implementation"></span>

### 3. Timing requires an implementation

We can only time `first_large_card` after writing runnable code. Early in design, we may want to compare this left-to-right scan with another proposed approach **before** building either one. This is the book's most serious limitation of experimental analysis: implementing every candidate can take substantial work, even when a simpler analysis could rule one out.

The next part develops a way to reason from the algorithm's steps, without requiring a timer or a finished program.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 3.1.1 Moving Beyond Experimental Analysis

<span id="part-3-goals"></span>

### 1. What a general analysis should do

The book wants an analysis that can **compare algorithms independently of a particular computer**, work from a **description of the steps before implementation**, and **account for all possible inputs**. Instead of asking only “How many milliseconds did this run take?”, we ask “How many basic steps can the algorithm perform for an input of size `n`?”

For the card search, we can answer that question by examining the loop: one card is checked on each pass, and the search may stop early.

<span id="part-3-operations"></span>

### 2. Counting Primitive Operations

A **primitive operation** is a basic step that the analysis treats as taking a constant amount of time. The book's examples include these:

| Primitive operation | Rectangle-card example |
| :--- | :--- |
| Assign a name to an object | `index = 0` |
| Look up the object named by an identifier | Read `minimum_area` |
| Perform arithmetic | Compute `width * height` |
| Compare numbers | Test `area >= minimum_area` |
| Access one list element by index | Read `cards[0]` |
| Call a function, excluding its body | Start `first_large_card(cards, 16)` |
| Return from a function | Return the found position or `None` |

The function body is **not free** just because the call itself counts as one operation; its steps must be counted too. We use the number of operations as a substitute for time. This model assumes each listed step has a bounded, roughly comparable cost. For our small card measurements, that is a useful simplification; it is not a claim that every Python expression always takes exactly the same number of nanoseconds.

In the search, each checked card certainly requires **one area multiplication and one numeric comparison**. We can count those two selected operations exactly. A fuller count would also include name lookups, iteration, unpacking, and return steps.

<span id="part-3-function"></span>

### 3. Measuring Operations as a Function of Input Size

The book calls the primitive-operation count a function **`f(n)`** of input size `n`. The aim is to describe how the count changes as the input grows. Our search also depends on **where the first qualifying card occurs**, so let `k` be its position when counting from `1`:

```text
k = 1   if C is the first card
k = n   if C is the last card, or if no card qualifies
```

Each of the `k` checked cards causes one multiplication and one comparison, so the count of these **selected** operations is `2k`. For example:

| `n` | Input arrangement | `k` | Multiplications + comparisons |
| ---: | :--- | ---: | ---: |
| 3 | `C, A, B` | 1 | 2 |
| 3 | `A, B, C` | 3 | 6 |
| 4 | `A, A, A, C` | 4 | 8 |
| 4 | `A, A, A, A` | 4 | 8 |

The **full** primitive-operation count is larger than `2k`, because the table omits other steps. For a fixed implementation and small card measurements, it has a fixed amount of setup plus a roughly fixed amount of work for each checked card: think of `a × k + b`, where `a` and `b` are constants determined by the counting model and exit path. A last-card match and no match both require `n` area checks, although their final return steps differ. For the worst-case path, the count has the form `f(n) = a × n + b` in this simple model. Section 3.2 develops common growth functions, and Section 3.3 explains how to compare them formally.

<span id="part-3-worst"></span>

### 4. Focusing on the Worst-Case Input

The three-card table already showed that **the same `n` can have different running times**. To get one dependable measure for each size, the book usually studies the **worst case**: the most work the algorithm may do among all inputs of that size.

For any list of `n` cards, this search checks **at most `n` cards**. If `C` is last or no card qualifies, it checks exactly `n`. If `C` is first, it checks only one.

| For `n = 4` | Input | Cards checked |
| :--- | :--- | ---: |
| Best case | `C, A, A, A` | 1 |
| Another input | `A, C, A, A` | 2 |
| Worst case | `A, A, A, C` or `A, A, A, A` | 4 |

Could we instead report an **average**? Only after saying how likely each kind of list is. For instance, **if exactly one `C` is equally likely to occupy any of the four positions**, the average number of checks is `(1 + 2 + 3 + 4) ÷ 4 = 2.5`. If lists without a `C` are common, the average changes. Figure 3.2 in the book illustrates how different inputs of one size can range from best-case to worst-case times and why an unspecified “average” is ambiguous.

The worst-case count needs no probability assumption. It gives an upper bound for **every** list of size `n`. For the rest of the book, running-time claims use the worst case unless stated otherwise.

> **Mental model:** For an input size `n`, ask how many cards the search *might have to* inspect. That answer covers the easy lists as well as the hard ones.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why do two lists of three cards take different work?</strong></summary>

**Scenario:** Compare `C, A, B` with `A, B, C`. Both have three cards and the same areas: 16, 6, and 8 cm².

**Check:** The first search meets 16 cm² immediately and does one area check. The second meets it at the third card and does three checks.

**Lesson:** Input size alone does not determine the work for a search that can stop early. The **arrangement** also matters.

</details>

<details>
<summary><strong>Case Study 2: Did we time card creation or the search?</strong></summary>

**Scenario:** A student starts the timer, builds 10,000 cards, and then searches them.

**Problem:** The reported interval includes list creation. It cannot be read as the time for `first_large_card` alone.

**Fix:** Build `cards` before reading the starting clock, as in Part 1. Time only the search call when the question is “How long does this search take?”

</details>

<details>
<summary><strong>Case Study 3: Why do repeated times differ for the same list?</strong></summary>

**Scenario:** The list always has `C` last, and the function always checks the same number of cards, but five clock readings differ.

**Explanation:** Other computer activity, timer resolution, and runtime effects can change the measured elapsed time. The algorithm's input and logical steps have not changed.

**Check:** Repeat the measurement with `timeit`, inspect the spread of trial results, and describe the environment. A single reading is weak evidence about speed.

</details>

<details>
<summary><strong>Case Study 4: Does a fast plot of first-match inputs settle the worst case?</strong></summary>

**Scenario:** At every tested `n`, the student puts `C` first. The plotted times stay small.

**Problem:** The sample excludes lists with `C` last or absent. For such a list, every card must be checked.

**Result:** The plot describes the tested inputs. Counting the loop's steps shows that **up to `n` checks** are possible for any input size `n`.

</details>

<details>
<summary><strong>Case Study 5: What is the average across different card lists?</strong></summary>

**Scenario:** Some lists contain a 16 cm² card, while others contain only 6 cm² and 8 cm² cards.

**Problem:** There is no unique average number of checks until we specify how often each kind of list occurs. Every no-match list needs `n` checks.

**Fix:** State a probability rule before calculating an expected average. If no such rule is available, use the worst-case count of `n` checks to cover every list.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 3.1 idea | Plain-language meaning | Rectangle-card example |
| :--- | :--- | :--- |
| **Experimental study** | Run an implementation and measure actual elapsed time. | Time `first_large_card(cards, 16)` for several lists. |
| **Input size `n`** | A measure of how much input the algorithm receives. | The number of cards, not their area. |
| **Running-time plot** | Show each measured run as a point `(n, t)`. | Plot the measured milliseconds against card count. |
| **Experimental limits** | Machine, sample selection, and implementation affect what timing can tell us. | First-match tests miss the last-match search. |
| **Primitive operations** | Basic steps counted without depending on a particular clock. | Each checked card needs an area multiplication and comparison. |
| **`f(n)`** | An operation-count function of input size. | A full-list scan has a count of the form `a × n + b`. |
| **Worst case** | The greatest work possible among inputs of the same size. | `C` last or absent makes the search check all `n` cards. |
| **Average case** | Expected work under a specified input distribution. | With one uniformly placed `C` among four cards, the average is 2.5 checks. |

**The section's progression:** measure some runs → notice what experiments cannot guarantee → count basic steps → describe their growth with `n` → use the worst-case input for a dependable bound.

[🔝 Back to Top](#top)
