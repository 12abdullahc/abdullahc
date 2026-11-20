<span id="top"></span>

# Algorithm Analysis — Section 3.1: Experimental Studies

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 3](<../../file/Data Structures and Algorithms in Python - C03.pdf>), Section 3.1, printed pages 111–114.  
> **Topic:** Measuring running time, the limits of experiments, primitive operations, and worst-case analysis.  
> **Domain focus:** The **2026 Brazilian Grand Prix MotoGP Q2 session** at Goiânia on 21 March 2026.  
> **Learning goal:** Explain each part of Section 3.1 with small, worked examples; then run a timing experiment and understand what its results can and cannot prove.  
> **User Prompt:** "Reexplain [Section 3.1] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: One Q2 Session, Two Kinds of Time](#background-intuition)
2. [Part 1: Section 3.1 — Experimental Studies](#part-1)
   - [1. Define the algorithm and its input size](#part-1-input)
   - [2. Time one run](#part-1-clock)
   - [3. Repeat runs and change the input](#part-1-repeat)
   - [4. Read a running-time plot](#part-1-plot)
3. [Part 2: Challenges of Experimental Analysis](#part-2)
   - [1. The environment affects measurements](#part-2-environment)
   - [2. Tested inputs are only a sample](#part-2-sample)
   - [3. Timing requires an implementation](#part-2-implementation)
4. [Part 3: Section 3.1.1 — Moving Beyond Experimental Analysis](#part-3)
   - [1. The goal of a general analysis](#part-3-goal)
   - [2. Count primitive operations](#part-3-operations)
   - [3. Express work as a function of input size](#part-3-function)
   - [4. Best, average, and worst cases](#part-3-cases)
5. [Part 4: Complete Worked Experiment](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: One Q2 Session, Two Kinds of Time

The [MotoGP report](https://www.motogp.com/en/news/2026/03/21/di-giannantonio-heads-bezzecchi-after-dramatic-first-qualifying-in-brazil/1010237) and [published Q2 timing classification](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Qualifying2.pdf) identify these riders in **one session**, Qualifying 2 (Q2) for the 2026 Brazilian GP:

| Q2 place | Rider | Team | Best Q2 lap | In seconds |
| ---: | :--- | :--- | ---: | ---: |
| P3 | Marc Márquez | Ducati Lenovo Team | 1:17.491 | 77.491 |
| P4 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:17.561 | 77.561 |
| P5 | Jorge Martín | Aprilia Racing | 1:17.630 | 77.630 |
| P6 | Ai Ogura | Trackhouse MotoGP Team | 1:17.702 | 77.702 |

Each entry is that rider's **best Q2 lap**, not every lap the rider completed. Convert minutes to seconds before comparing: Marc's `1:17.491` is `60 + 17.491 = 77.491` seconds. Fabio's is `77.561` seconds, so Marc's best Q2 lap was `77.561 − 77.491 = 0.070` seconds quicker.

For the computer-science example, imagine a list of these four records. We want the **first record in the list** whose best Q2 lap is **below 77.500 seconds**. That cutoff is a teaching choice: Marc qualifies, while Fabio, Jorge, and Ai do not. We can deliberately change the list order to study the search. Such an order is **an illustrative program input**, not the official Q2 classification.

There are two different clocks in this chapter:

| Quantity | What it measures | Example |
| :--- | :--- | :--- |
| MotoGP lap time | A rider's fastest Q2 circuit | Marc: 77.491 seconds |
| Algorithm running time | How long Python takes to search a list | Measured on your computer; varies |

**Why this example?** Marc and Fabio are only `0.070` seconds apart in the real session, and the cutoff separates their records. That makes it easy to see which value a search accepts while keeping racing time separate from program time. **How to solve it:** convert `m:ss.sss` to seconds, state the cutoff, compare each record in the chosen list order, and stop at the first value below the cutoff.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 3.1 — Experimental Studies

An **experimental study** implements an algorithm, runs it on chosen inputs, and measures its running time. Section 3.1 starts with this concrete approach before asking what the measurements leave unanswered.

<span id="part-1-input"></span>

### 1. Define the Algorithm and Its Input Size

Use a left-to-right search. The function returns a **zero-based index**, or `None` if no record is below the cutoff:

```python
q2 = {
    "MARC": ("Marc Márquez", "Ducati Lenovo Team", 77.491),
    "FABIO": ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 77.561),
    "JORGE": ("Jorge Martín", "Aprilia Racing", 77.630),
    "AI": ("Ai Ogura", "Trackhouse MotoGP Team", 77.702),
}

def first_under(records, cutoff):
    for index, record in enumerate(records):
        if record[2] < cutoff:  # record[2] is the best Q2 lap in seconds
            return index
    return None

records = [q2[key] for key in ("FABIO", "JORGE", "AI", "MARC")]
position = first_under(records, 77.500)
print(position)
if position is not None:
    print(records[position][0])
```

```text
3
Marc Márquez
```

The `is not None` check lets us use the returned index safely; a list with no qualifying rider returns `None` instead.

Trace the comparisons in that **illustrative** order:

| Check | Rider | Is the best lap below 77.500 s? | Action |
| ---: | :--- | :--- | :--- |
| 1 | Fabio | `77.561 < 77.500` is false | Continue. |
| 2 | Jorge | `77.630 < 77.500` is false | Continue. |
| 3 | Ai | `77.702 < 77.500` is false | Continue. |
| 4 | Marc | `77.491 < 77.500` is true | Return index `3`. |

The **input size** `n` is the number of records in the list. Here `n = 4`. It is not the lap time, the cutoff, or a rider's starting position. Reordering the same four records keeps `n = 4` but can change how soon the function returns.

**Why this example?** A search that may stop early shows that equal-sized inputs can require different work. **How to solve it:** identify what one list element is, count the elements to get `n`, then follow the loop until it returns or reaches the end.

<span id="part-1-clock"></span>

### 2. Time One Run

The book places a clock reading before and after an algorithm and subtracts:

```text
elapsed time = ending clock reading − starting clock reading
```

The starting point of the clock cancels in that subtraction. For example, readings of `1000.200` and `1000.205` seconds give `0.005` seconds elapsed; the number `1000` has no bearing on the duration. The book's `time.time()` readings are seconds since an epoch, but the search needs only their difference.

For a short interval in modern Python, [`time.perf_counter()`](https://docs.python.org/3/library/time.html#time.perf_counter) is designed for elapsed-time measurements. The book also mentions `time.clock()`, which [was removed in Python 3.8](https://docs.python.org/3.8/whatsnew/3.8.html#api-and-feature-removals). Use [`time.process_time()`](https://docs.python.org/3/library/time.html#time.process_time) if you specifically want process CPU time. CPU-time readings can still vary between runs, and a timer's resolution limits how finely it can report short intervals.

Continue after the previous code:

```python
from time import perf_counter

# A constructed benchmark input, not 10,000 real Q2 riders.
benchmark_records = [q2["FABIO"]] * 9_999 + [q2["MARC"]]

start = perf_counter()
position = first_under(benchmark_records, 77.500)
elapsed_ms = (perf_counter() - start) * 1_000

print(position)                  # Always 9999.
print(f"{elapsed_ms:.6f} ms")    # Varies by run and computer.
```

The list is created **before** `start`, so the interval measures the search call rather than list creation. `9_999` Fabio-record copies are followed by one Marc-record copy; the copies are **synthetic benchmark data** made from real Q2 values. This does not claim that Fabio rode 9,999 laps or that Q2 had 10,000 riders.

**Why this example?** Putting the only qualifying value last makes the search inspect every record, so the timed operation is easy to identify. **How to solve it:** prepare input first, read the clock, call the function once, read the clock again, and subtract. Check the returned index separately from the changing elapsed time.

<span id="part-1-repeat"></span>

### 3. Repeat Runs and Change the Input

One run can be noisy. Python's [`timeit.repeat`](https://docs.python.org/3/library/timeit.html#timeit.repeat) runs a statement several times per trial and repeats the trial. The following continues from the same code. At each `n`, it times **100 searches per trial** and performs **five trials**:

```python
from timeit import repeat

for n in (1_000, 2_000, 4_000, 8_000):
    benchmark_records = [q2["FABIO"]] * (n - 1) + [q2["MARC"]]
    trial_seconds = repeat(
        lambda: first_under(benchmark_records, 77.500),
        number=100,
        repeat=5,
    )
    best_ms_per_search = min(trial_seconds) * 1_000 / 100
    print(n, f"{best_ms_per_search:.6f} ms/search")
```

The five returned numbers are **batch durations in seconds**. Dividing the shortest batch by `100` estimates milliseconds per search with less interference from occasional slow trials. It still includes call and timing-loop overhead and is not a universal running time. Try Marc first as a second input structure at each `n`: `[q2["MARC"]] + [q2["FABIO"]] * (n - 1)`. That search checks one record rather than `n`. Keep the cutoff, computer, Python version, and timing procedure the same while comparing the two structures.

**Why this example?** Increasing `n` reveals a possible trend; moving Marc between the start and end shows that **arrangement** matters too. **How to solve it:** choose sizes, construct each input outside the timed statement, repeat the same call, convert seconds to milliseconds, and compare the two input structures.

<span id="part-1-plot"></span>

### 4. Read a Running-Time Plot

Figure 3.1 in the book is a **hypothetical scatter plot**. Its horizontal axis is input size `n`, and its vertical axis is measured running time `t`, usually in milliseconds. A dot `(n, t)` means one particular run on one particular input of size `n` took `t` milliseconds.

Here are **invented teaching coordinates**, not results from MotoGP or from running the Python code:

| Input size `n` | Hypothetical search time `t` | Plot point |
| ---: | ---: | :--- |
| 1,000 | 0.030 ms | `(1000, 0.030)` |
| 2,000 | 0.060 ms | `(2000, 0.060)` |
| 4,000 | 0.120 ms | `(4000, 0.120)` |

In this illustration, doubling `n` doubles `t`. A real experiment would have multiple dots at each `n` because the clock and input arrangements vary. Fitting a curve sensibly requires enough trials and varied, representative inputs. Even then, the curve describes sampled dots; it cannot establish what happens on **every** possible input.

**Why this example?** The simple doubling pattern makes the two axes and the meaning of a dot visible without pretending to report measured results. **How to solve it:** read `n` across and `t` up, label the units, compare repeated dots at each size, and check which inputs generated them before describing a pattern.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Challenges of Experimental Analysis

Section 3.1 gives three reasons that timing experiments alone cannot provide a general account of an algorithm.

<span id="part-2-environment"></span>

### 1. The Environment Affects Measurements

Suppose one person runs the Marc-last search on a laptop and another runs it on a faster desktop. Different hardware, Python versions, background processes, and machine load can change the milliseconds even though both searches inspect the same `n` records. A wall-clock measurement may include time when another process is using the CPU.

**Why this example?** The algorithm's logical work stays fixed while the measured time can change. **How to solve a fair comparison:** run both candidate algorithms with the same inputs and measurement procedure on the same machine, repeat the trials, and record the environment. The numbers then describe those tested runs.

<span id="part-2-sample"></span>

### 2. Tested Inputs Are Only a Sample

If every benchmark puts Marc first, `first_under` returns after one comparison for `n = 1_000` and for `n = 8_000`. A plot of those runs will miss the Marc-last input, which requires `n` comparisons. No finite list of test cases covers every input size, order, and value.

**Why this example?** It exposes a sampling error even when every clock reading is accurate. **How to solve it:** test different sizes **and** structures, including a match first, a match last, and no match; then state exactly which cases the measurements cover.

<span id="part-2-implementation"></span>

### 3. Timing Requires an Implementation

We cannot run a stopwatch on an algorithm that exists only as a plan. Imagine proposing two ways to search the Q2 records and wanting to compare them before writing both programs. Implementing every candidate may take more work than examining their steps.

**Why this example?** It connects Section 3.1's experimental approach to the next subsection's step counting. **How to solve it:** describe each algorithm's repeated steps, choose an input size `n`, and count the work before deciding which implementations are worth testing.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 3.1.1 — Moving Beyond Experimental Analysis

<span id="part-3-goal"></span>

### 1. The Goal of a General Analysis

The book seeks an analysis that (1) is independent of a particular computer or software setup, (2) can be done from an algorithm description before code exists, and (3) covers all possible inputs. Instead of asking only, "How many milliseconds did this run take?", ask, "How many basic steps could a size-`n` input require?"

For `first_under`, the answer starts with the loop: one record is inspected per pass, and the function may stop early. Counting those passes already tells us something no single stopwatch reading can guarantee.

**Why this example?** The same Q2 search lets us compare observation with reasoning. **How to solve it:** write down what repeats, what makes it stop, and the maximum number of repetitions for a list of length `n`.

<span id="part-3-operations"></span>

### 2. Count Primitive Operations

A **primitive operation** is a basic action that the book's analysis treats as constant-time. It lists assignment, identifier lookup, arithmetic, comparison, list indexing, function call **excluding the function body's work**, and return. In the Q2 program:

| Operation | Simple example |
| :--- | :--- |
| Assignment | `position = 3` |
| Identifier lookup | Read `cutoff` |
| Arithmetic | Convert `60 + 17.491` |
| Comparison | Test `77.491 < 77.500` |
| List indexing | Read `records[3]` |
| Function call | Start `first_under(records, cutoff)` |
| Return | Send index `3` back to the caller |

Counting a function call as one operation **does not make its body free**; we must count what happens inside it too. For a simple model, focus on the `record[2] < cutoff` comparison. Every inspected record performs that comparison exactly once. The complete program also performs loop, indexing, lookup, and return work, so this selected count is not the full count of Python instructions.

**Why this example?** One comparison per inspected record gives an exact count that is easy to trace. **How to solve it:** choose the operation being counted, identify the line that performs it, and count how many times that line runs. State any work you left out.

<span id="part-3-function"></span>

### 3. Express Work as a Function of Input Size

Let `n` be the number of records and `k` be the **one-based** position of the first record below the cutoff. If there is no match, set `k = n` for counting purposes. The number of selected comparisons is:

```text
comparisons = k, if a match occurs at position k
comparisons = n, if no match occurs
```

| Illustrative input order | `n` | Comparisons |
| :--- | ---: | ---: |
| Marc, Fabio, Jorge, Ai | 4 | 1 |
| Fabio, Marc, Jorge, Ai | 4 | 2 |
| Fabio, Jorge, Ai, Marc | 4 | 4 |
| Fabio, Jorge, Ai | 3 | 3; no match |

The book uses `f(n)` for an operation-count function of input size. To obtain one count for each `n`, we must specify **which case** we mean. For the worst case, the comparison-count function for this search is exactly `f(n) = n`. A fuller primitive-operation count includes fixed setup and a bounded amount of work per inspected record, so it can be bounded by `a n + b` for suitable constants `a` and `b` under this model.

**Why this example?** The table shows why `n` alone cannot predict the exact work of an early-exit search. **How to solve it:** count visited records for each ordering, then choose a case such as worst case before writing `f(n)`.

<span id="part-3-cases"></span>

### 4. Best, Average, and Worst Cases

Figure 3.2 in the book shows that different inputs of the **same size** may take different times. For our four real Q2 records, the selected comparison counts range from one to four:

| Case at `n = 4` | Illustrative order | Comparisons |
| :--- | :--- | ---: |
| Best | Marc first | 1 |
| Middle | Marc second or third | 2 or 3 |
| Worst | Marc last | 4 |

An **average case** needs a probability rule. Suppose exactly one matching Marc record is equally likely to occupy any of the four positions, with Fabio, Jorge, and Ai filling the other places. The expected comparison count is `(1 + 2 + 3 + 4) / 4 = 2.5`. That is an **assumed model of illustrative list orders**, not a claim about MotoGP results. If lists without a qualifying record are possible, or some orders are more likely, the average changes.

Worst-case analysis needs no probability model: every list of `n` records causes **at most `n` comparisons**, and a last match or no match reaches that limit. The book uses worst case by default in later running-time claims.

**Why this example?** Reordering the same four published records isolates best, average, and worst behavior without changing `n`. **How to solve it:** find the earliest and latest possible stop, calculate an average only after stating the distribution, and use the maximum for a guarantee covering every list of that size.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Complete Worked Experiment

Save this as `q2_search_study.py` and run it with Python 3. It combines a correctness check on four distinct riders with repeated timing on **constructed** larger inputs:

```python
from timeit import repeat

MARC = ("Marc Márquez", "Ducati Lenovo Team", 77.491)
FABIO = ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 77.561)
JORGE = ("Jorge Martín", "Aprilia Racing", 77.630)
AI = ("Ai Ogura", "Trackhouse MotoGP Team", 77.702)
CUTOFF = 77.500

def first_under(records, cutoff):
    for index, record in enumerate(records):
        if record[2] < cutoff:
            return index
    return None

# The order is chosen for the example, not copied from the Q2 classification.
small = [FABIO, JORGE, AI, MARC]
found = first_under(small, CUTOFF)
print("Small list:", found, small[found][0])

print("records | best ms/search (measured on this computer)")
for n in (1_000, 2_000, 4_000, 8_000):
    large = [FABIO] * (n - 1) + [MARC]
    assert first_under(large, CUTOFF) == n - 1
    trials = repeat(
        lambda: first_under(large, CUTOFF),
        number=100,
        repeat=5,
    )
    best_ms = min(trials) * 1_000 / 100
    print(f"{n:7d} | {best_ms:.6f}")
```

The first output line is always `Small list: 3 Marc Márquez`. The four millisecond values vary by computer and run. In the larger lists, repeated copies of Fabio's **published best-lap record** are benchmark inputs; they are not extra Q2 laps or riders.

**Why this example?** The small list checks that the search gives the right answer before timing it. The large lists then make `n` visible and force the last-match path, so the experiment and the worst-case count refer to the same path. **How to solve it:**

1. Read the four Q2 best-lap values and convert them to seconds.
2. Choose a cutoff that separates Marc from the three slower records.
3. Trace the small list by hand: false, false, false, true; return index `3`.
4. Build each larger list **before** timing, with Marc last; the assertion checks the answer.
5. Repeat 100 searches in each of five trials and divide the shortest batch by 100.
6. Interpret any measured trend alongside the exact worst-case comparison count `f(n) = n`.

If the timings fluctuate, rerun the experiment and inspect the trial values. Do not replace the measured results with MotoGP lap times: a rider's `77.491` seconds and a Python search's measured milliseconds answer different questions.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 3.1 idea | Plain-language meaning | Q2 search example |
| :--- | :--- | :--- |
| Experimental study | Run code on chosen inputs and time it. | Time `first_under` on constructed lists. |
| Input size `n` | Amount of input supplied to the algorithm. | Number of records in the list. |
| Running-time plot | Put input size on the horizontal axis and measured milliseconds on the vertical axis. | A dot `(n, t)` describes one search run. |
| Experimental limits | Machine, sample choice, and implementation affect what timings show. | Marc-first tests miss Marc-last work. |
| Primitive operation | A basic action counted in an abstract model. | One lap-versus-cutoff comparison per inspected record. |
| `f(n)` | Work count stated in terms of input size and a chosen case. | Worst-case selected comparison count: `f(n) = n`. |
| Average case | Expected work under an explicit probability model. | One uniformly placed Marc among four records: 2.5 comparisons. |
| Worst case | Maximum work among inputs of size `n`. | Marc last makes the search inspect all `n` records. |

**Section 3.1's path:** measure particular runs → recognize the limits of those measurements → count basic steps → describe work in terms of `n` → use the worst case for a guarantee.

[🔝 Back to Top](#top)
