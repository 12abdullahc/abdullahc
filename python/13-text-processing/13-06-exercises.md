<span id="top"></span>

# 13.6 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 13, Section 13.6, printed pages 613–617 (the supplied PDF).<br>
> **Topic:** Reinforcement R-13.1–R-13.14; Creativity C-13.15–C-13.45; Projects P-13.46–P-13.57.<br>
> **Domain Focus:** A grid robot's 4-by-1 rectangle route, nearby route catalog, a 10-unit supply walk, and a small geometry gallery.<br>
> **User Prompt:** Reexplain [`Section 13.6`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].<br>

---

## Table of Contents

1. [Background & Conceptual Intuition: One Geometry Notebook](#background)
   - [1. Keep the rectangle route in view](#background-route)
   - [2. Read the kind of task before choosing an algorithm](#background-questions)
2. [Part 1: Reinforcement, R-13.1–R-13.14](#part-1)
   - [1. Borders and pattern matching: R-13.1–R-13.7](#part-1-patterns)
   - [2. Matrix chains and common subsequences: R-13.8–R-13.10](#part-1-dp)
   - [3. Huffman coding and tries: R-13.11–R-13.14](#part-1-trees)
3. [Part 2: Creativity, C-13.15–C-13.26](#part-2)
   - [1. Worst cases, rightmost matches, and nonoverlapping counts](#part-2-search)
   - [2. Prove or extend a search bound](#part-2-bounds)
4. [Part 3: Creativity, C-13.27–C-13.32](#part-3)
   - [1. Matrix chains and greedy decisions](#part-3-choices)
   - [2. Supply stops, guards, and polygon diagonals](#part-3-geometry)
5. [Part 4: Creativity, C-13.33–C-13.45](#part-4)
   - [1. Reversal, subsequences, and edit tables](#part-4-strings)
   - [2. Selection, three sums, and string overlap](#part-4-selection)
   - [3. Delete or compress trie paths](#part-4-tries)
6. [Part 5: Projects, P-13.46–P-13.57](#part-5)
   - [1. Alignment and search experiments](#part-5-experiments)
   - [2. Coding, trie, and indexing implementations](#part-5-build)
7. [Part 6: One Connected Geometry Program](#part-6)
   - [1. Trace repeated and circular route patterns](#part-6-program)
   - [2. Read its result](#part-6-trace)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Geometry Notebook

<span id="background-route"></span>

### 1. Keep the rectangle route in view

The earlier Chapter 13 guides use a robot that starts at `(0, 0)` and moves one grid unit for each `E`, `N`, `W`, or `S`. Its ten-character route is:

```text
Index:  0 1 2 3 4 5 6 7 8 9
Move:   E E E E N W W W W S
T = EEEENWWWWS
```

The robot reaches `(4, 0)` after four east steps, `(4, 1)` after north, `(0, 1)` after four west steps, and then returns to `(0, 0)`. The path is a **4-by-1 rectangle**, with perimeter `10` and area `4`. Section 13.5 also used the route catalog `{E, EEEE, EEEEN, EEEES, N, NE}`. We will reuse these strings and nearby map points while changing the algorithmic question.

The four west steps make several search questions concrete:

| Question about `T` | Example answer |
| :----------------- | :------------- |
| All overlapping starts of `WW` | `5, 6, 7`. |
| Rightmost start of `WW` | `7`. |
| Maximum number of nonoverlapping `WW` matches | `2`, at starts `5` and `7`. |
| `SEEE` on a circular reading of the route | Yes: `S` at index `9` joins the first three `E` moves. |
| `EWS` as a subsequence | Yes: use indices `0, 5, 9`, with gaps allowed. |

<span id="background-questions"></span>

### 2. Read the kind of task before choosing an algorithm

Section 13.6 is a set of **57 exercises** under the book's headings **Reinforcement** (14), **Creativity** (31), and **Projects** (12). An exercise might ask for a trace, an implementation, a proof, an optimal value, or an experiment. A small route example checks behavior; a stated running-time bound also needs a separate cost argument.

| Term | Meaning | Route example |
| :--- | :------ | :------------ |
| **Prefix** | A beginning of a string. | `EEEE` begins `T`. |
| **Suffix** | An ending of a string. | `S` ends `T`. |
| **Substring** | Consecutive characters anywhere. | `NWW` starts at `4`. |
| **Subsequence** | Characters in order, possibly with gaps. | `EWS` uses `0, 5, 9`. |
| **Border** | A prefix that is also a suffix. | `EE` is a proper border of the route fragment `EENEE`. |

Symbols such as `n` and `m` take their meaning from each exercise: they may be string lengths, matrix-chain sizes, or numbers of items. The tables below paraphrase **every exercise** and give a connected geometry starting point; the worked cases show how to reason about representative tasks.

> **Mental model:** Decide what must be returned, what counts as one operation, and whether the question needs a trace, a proof, or measured evidence.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-13.1–R-13.14

<span id="part-1-patterns"></span>

### 1. Borders and pattern matching: R-13.1–R-13.7

These exercises revisit the pattern tools in [Section 13.2](13-02-pattern-matching-algorithms.md). A **proper** prefix is shorter than the complete string; R-13.1 does not say “proper,” but R-13.2 does.

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **R-13.1** | List prefixes of the book's `aaabbaaa` that are also suffixes. Include the whole string if prefixes are not restricted to proper ones. On a grid fragment `EENEE`, `E` and `EE` are proper borders, while the whole fragment matches itself. |
| **R-13.2** | Find only the **longest proper** prefix/suffix match for the given DNA-like string. For `EENEE`, compare from both ends and obtain `EE`; exclude the entire string. |
| **R-13.3** | Draw every character comparison of brute-force matching for the supplied text `aaabaadaabaaa` and pattern `aabaaa`. A smaller trace uses `T = EEEENWWWWS` and `P = EEN`: failed alignments start at `0` and `1` before a match at `2`. |
| **R-13.4** | Repeat R-13.3 with Boyer–Moore, showing its alignments and shifts. Count the **search** comparisons, excluding work to compute `last(c)`. |
| **R-13.5** | Repeat R-13.3 with KMP, recording how the pattern moves after a mismatch. Exclude failure-table preprocessing comparisons from the requested trace. |
| **R-13.6** | Build Boyer–Moore's `last` map for the supplied sentence, treating spaces as characters. In the small pattern `EEN`, the last positions are `last(E)=1` and `last(N)=2`; absent symbols return `-1`. |
| **R-13.7** | Fill the KMP failure table for the supplied `cgtacgttcgtac` pattern. For the small pattern `EEN`, the longest proper border lengths of its prefixes are `[0, 1, 0]`. |

The **same search** can make different comparisons in brute force, Boyer–Moore, and KMP. Keep the text and pattern fixed when comparing their traces. For R-13.6, the book's sentence includes spaces; dropping them changes every later character index.

<span id="part-1-dp"></span>

### 2. Matrix chains and common subsequences: R-13.8–R-13.10

These exercises return to [Section 13.3](13-03-dynamic-programming.md). A matrix-chain answer needs an operation count and multiplication order; an LCS answer needs a table or backtrace and a valid subsequence.

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **R-13.8** | Find the cheapest parenthesization for the six supplied matrix sizes `10×5, 5×2, 2×20, 20×12, 12×4, 4×60` and show the costs. First practice with two 2D points in a `2×2` array, a `2×4` transform, and a `4×3` transform: `(AB)C` costs `40` scalar products, while `A(BC)` costs `36`. |
| **R-13.9** | Find a **different** length-six LCS for the book's Figure 13.8 strings. For a tiny geometric analogy, `EN` and `NE` both reach `(1, 1)` and have two different length-one LCS answers: `E` and `N`. |
| **R-13.10** | Build the full LCS-length table for `skullandbones` and `lullabybabies`, then backtrace one longest common subsequence. A two-route warm-up is the `EN` versus `NE` table; coordinate equality does not make the move strings equal. |

An LCS permits **skips** but preserves order. Matrix-chain parenthesization changes multiplication cost while preserving the final matrix product.

<span id="part-1-trees"></span>

### 3. Huffman coding and tries: R-13.11–R-13.14

The source exercises use the structures from [Sections 13.4](13-04-text-compression-and-the-greedy-method.md) and [13.5](13-05-tries.md).

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **R-13.11** | Count each character, including spaces, in the supplied `dogs do not spot hot pots or cats`, then repeatedly merge the two smallest frequencies into a Huffman tree. For our route, `E:4`, `W:4`, `N:1`, and `S:1` give merge weights `2, 6, 10` and an `18`-bit payload. |
| **R-13.12** | Draw a standard trie for the eight supplied strings; share a path only while characters match and mark each complete key. The route catalog has shared `E` and `N` beginnings; an end marker distinguishes `E` from `EEEE`. |
| **R-13.13** | Compress the one-child chains of **the same eight-key trie** from R-13.12. In the route catalog, the standard trie's `15` nodes reduce to `10` compressed nodes when long `E` chains become multi-character labels. |
| **R-13.14** | Draw a compact, slice-referenced suffix trie for the supplied text `minimize minime`; the **space is a character**. For the route text `T`, index the ten nonempty suffixes and store labels as slices of `T + "$"`. |

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity, C-13.15–C-13.26

<span id="part-2-search"></span>

### 1. Worst cases, rightmost matches, and nonoverlapping counts

The next seven exercises modify the output or expose an expensive input for the search algorithms. A match **start** is a zero-based text index.

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **C-13.15** | Construct a text and pattern that force brute force to use `Θ(nm)` comparisons. For `n ≥ 2m`, a straight route of `n` east moves and a proposed pattern `E` repeated `m-1` times followed by `N` nearly match at every alignment before the final turn fails. |
| **C-13.16** | Adapt brute force to return the **rightmost** match, or report absence. In `T`, the rightmost `WW` begins at `7`, not `5`. |
| **C-13.17** | Make Boyer–Moore return the rightmost match while retaining valid shifts. The same `WW` query should still return `7`. |
| **C-13.18** | Make KMP return the rightmost match, including overlaps where appropriate. Again, `WW` has starts `5,6,7` and the answer is `7`. |
| **C-13.19** | Adapt brute force to count a **maximum number of nonoverlapping** matches, like Python's `str.count`. Four consecutive `W` moves contain three overlapping `WW` starts but only two nonoverlapping matches. |
| **C-13.20** | Preserve Boyer–Moore's search behavior while producing the same nonoverlapping count as C-13.19. On the rectangle's westward side, the count is `2`. |
| **C-13.21** | Do the same with KMP, making the post-match state respect the no-overlap rule. The count remains `2`, even though there are three possible starts. |

For `T` and `P = WW`, the candidate intervals are `[5,7)`, `[6,8)`, and `[7,9)`. The first and third do not overlap; either adjacent pair does. This interval view makes the count and the geometry agree.

<span id="part-2-bounds"></span>

### 2. Prove or extend a search bound

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **C-13.22** | Justify why KMP builds a failure table in `O(m)` time. Track how its pattern index advances or falls back; a long run of `E` moves is useful for checking repeated-prefix behavior. |
| **C-13.23** | In `O(n+m)` time, find the longest prefix of a proposed pattern that occurs **anywhere** in the text. With `P = WWWN` and rectangle route `T`, `WWW` occurs but `WWWN` does not. |
| **C-13.24** | Test in `O(n+m)` time whether a pattern appears in the text or crosses from its end back to its beginning, assuming `m<n`. `SEEE` is such a wraparound pattern on the closed rectangle walk. |
| **C-13.25** | For a **binary** alphabet, compute the exercise's modified KMP failure relation and prove at most `n` **text–pattern** comparisons, apart from preprocessing. On a mismatch, the bit opposite the expected next bit informs the fallback. Encode an east/west-only route with `E=0` and `W=1`; the four-direction route itself is not binary. |
| **C-13.26** | Combine ideas from KMP with the book's simplified Boyer–Moore to obtain a worst-case `O(n+m)` method. A nearly matching straight-east text from C-13.15 is a useful stress case. |

For C-13.24, a practical geometric picture is to place the route letters around a loop. Starting at the final south step, the next letters on the loop are the first east steps. The constraint `m<n` and a valid start within the original text matter when testing a doubled string.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Creativity, C-13.27–C-13.32

<span id="part-3-choices"></span>

### 1. Matrix chains and greedy decisions

These exercises ask how a **local choice** relates to a full solution. Some problems have a justified greedy rule; others require dynamic programming. The required proof is specific to the problem.

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **C-13.27** | Extend matrix-chain dynamic programming to output the **optimal parentheses**, not only the minimum cost. For `2×2`, `2×4`, `4×3` geometry transforms, record the split that produces `A(BC)` with cost `36`. |
| **C-13.28** | Choose watering holes to minimize refill stops when one bottle covers `k` miles; argue why the choice works. Along the rectangle walk's ten-unit distance, let `k=4` and holes be at `2,3,5,7`: refilling at `3` and `7` reaches the finish at `10`. |
| **C-13.29** | Give and justify a minimum-coin greedy algorithm for denominations `25,10,5,1`. A 30-unit map-supply payment uses `25+5`; the proof must concern these denominations. |
| **C-13.30** | Exhibit denominations where taking the largest available coin first fails. For a 6-unit payment and `{1,3,4}`, greedy uses `4+1+1`, while `3+3` uses fewer coins. |
| **C-13.31** | Place the fewest radius-one guards on a line so every painting is within distance `1` of a guard. In a four-unit gallery hallway with paintings at `0,1,3,4`, guards at `1` and `4` cover all four. |
| **C-13.32** | Find a minimum-weight triangulation of a **convex polygon**, counting only added diagonal lengths. For vertices `(0,0),(4,0),(4,1),(0,2)`, the two quadrilateral choices cost `√17` and `√20`; the general problem needs an interval dynamic-programming comparison. |

<span id="part-3-geometry"></span>

### 2. Supply stops, guards, and polygon diagonals

For C-13.28, the next refill can be the **farthest reachable** watering hole. From distance `0` and range `4`, holes `2` and `3` are reachable but `5` is not. From `3`, hole `7` is reachable; from `7`, the finish at `10` is reachable. Stopping at `2` first would require at least two more refills, for example at `5` and `7`. One refill cannot suffice because a first stop no farther than `3` would leave more than four units to the finish. The full algorithm must also detect an unreachable gap.

For C-13.31, a guard at `1` covers hallway positions `[0,2]`; a guard at `4` covers `[3,5]`. One guard covers at most a length-two interval, so it cannot cover paintings spanning positions `0` to `4`. The problem allows guards **anywhere on the line**, not only at painting positions.

For C-13.32, the quadrilateral's shorter diagonal is from `(0,0)` to `(4,1)`, with length `√(4²+1²)=√17`. The other diagonal from `(4,0)` to `(0,2)` has length `√(4²+2²)=√20`. A larger polygon has interacting diagonal choices, so an interval table compares possible split vertices and counts each added diagonal once. For `v` vertices, trying all split vertices for each interval takes `O(v³)` time under the exercise's constant-time length and arithmetic assumption.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Creativity, C-13.33–C-13.45

<span id="part-4-strings"></span>

### 1. Reversal, subsequences, and edit tables

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **C-13.33** | In `O(n)` time, find the longest prefix of `T` that occurs inside its **reversed character order**. For `T=EENN`, the reversal is `NNEE`; the prefix `EE` occurs there, but `EEN` does not. Reversing letters is not the same as retracing moves. |
| **C-13.34** | Find the longest **palindromic suffix** and analyze time. The route fragment `ENWN` ends in `NWN`, which reads the same in either direction. |
| **C-13.35** | Use `O(n²)` time to find a longest **decreasing subsequence** of numbers. For distance labels `[10,8,9,5]`, `[10,8,5]` and `[10,9,5]` are both length-three decreasing choices. |
| **C-13.36** | Decide efficiently whether `P` is a **subsequence**, with gaps allowed, of `T` and give the running time. `EWS` appears in the rectangle route at indices `0,5,9`, although those letters are not adjacent. |
| **C-13.37** | Compute insertion/deletion/replacement **edit distance** in `O(nm)` time. Changing route `EEEEN` to `EEEES` takes one character replacement, even though their endpoints differ by two grid units. |
| **C-13.38** | Fill every requested `B(j,k)` value: the longest common **substring** length for the indicated suffixes of `X` and `Y`, in `O(nm)` total time. Route fragments `EEN` and `EES` share the contiguous substring `EE`, length `2`. |

A **subsequence** may skip positions; a **substring** must be contiguous. Edit distance counts string edits, not Euclidean distance between endpoints. Those distinctions determine both the recurrence and the answer.

<span id="part-4-selection"></span>

### 2. Selection, three sums, and string overlap

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **C-13.39** | Select `n` candies from `m` jars with capacities and per-piece prices to maximize value in `O(n+m)` time. For a geometry analogy, take three prize tiles from bins holding two 8-unit tiles and three 4-unit tiles; the best small choice is `8+8+4=20`. A general method must honor each bin's capacity and the stated linear bound. |
| **C-13.40** | For three integer arrays, test whether one value from each sums to target `k` within `O(n² log n)`. Think of choosing three straight-walk segment lengths whose total must be `7`; `4+2+1` is one candidate. |
| **C-13.41** | Solve the **same three-array sum** decision problem in `O(n²)` time. Sorting two arrays and using a two-pointer scan for each first-array value is one useful direction. |
| **C-13.42** | In `O(n+m)` time, find the longest prefix of one string equal to a suffix of another. `X=EEEENWWWWS` begins `EEEE`; `Y=NEEEE` ends `EEEE`. |

For C-13.39, a linear-time **weighted selection** can find a cutoff price, using each jar's piece count as its weight. Take all pieces priced above the cutoff, then enough at the cutoff to reach `n`; scanning the jars and writing the selected pieces gives `O(n+m)` time when enough pieces exist. Sorting all jar prices would miss that bound. For C-13.40, enumerating pairs from two arrays and binary-searching a sorted third array gives the stated `O(n² log n)` scale. C-13.41 asks for the stronger `O(n²)` scale.

<span id="part-4-tries"></span>

### 3. Delete or compress trie paths

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **C-13.43** | Delete one key from a **standard trie** without removing paths still used by another key; analyze the work. Removing `E` from the catalog removes its end marker, while `EEEE`, `EEEEN`, and `EEEES` still need their shared `E` branch. |
| **C-13.44** | Delete a key from a **compressed trie** and restore compression if a branch loses a child. If only one route remains below a former branch, merge its new one-child path into a longer label. |
| **C-13.45** | Convert a noncompact suffix trie into a compact, slice-referenced representation and analyze the traversal. For `T=EEEENWWWWS`, collapse one-child paths and refer to slices of `T + "$"` rather than copying every label. |

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Projects, P-13.46–P-13.57

<span id="part-5-experiments"></span>

### 1. Alignment and search experiments

Projects ask for working artifacts and evidence. The book's biological and website data are project **inputs**; our small route notebook gives a local test before a larger experiment.

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **P-13.46** | Use LCS to align two DNA strings. Practice the same table/backtrace on two paths to the same point, `EN` and `NE`; their common subsequence length is `1`. |
| **P-13.47** | Write an edit-distance program that shows the corresponding aligned pieces. A trace for `EEEEN` versus `EEEES` should show the single final-character replacement. |
| **P-13.48** | Experimentally compare **character-comparison counts** for brute force and KMP as pattern length varies. Search repeated east-run logs and a mix of turns under the same counting rule. |
| **P-13.49** | Repeat the comparison-count experiment for brute force and Boyer–Moore. Keep the route texts and pattern lengths comparable to P-13.48. |
| **P-13.50** | Time brute force, KMP, and Boyer–Moore on large texts and varied patterns. Report elapsed times separately from comparison counts; include text sizes and repeated trials. |
| **P-13.51** | Experiment with Python's `str.find` under favorable and unfavorable patterns and form a **hypothesis** about its strategy. Timing alone does not identify a unique internal algorithm. |

<span id="part-5-build"></span>

### 2. Coding, trie, and indexing implementations

| Exercise | Reexplanation and geometry starting point |
| :------- | :---------------------------------------- |
| **P-13.52** | Implement both Huffman **compression and decompression**. Round-trip `T=EEEENWWWWS`; its example payload is `18` bits, and a stored format must also represent the codebook and any byte padding. |
| **P-13.53** | Build a standard-trie class for ASCII keys, with construction from a list and exact membership testing. Use the ASCII direction catalog; `E` is present but `EEE` is only a prefix. |
| **P-13.54** | Build the same public behavior with a compressed trie. Use the catalog's long east chain to test multi-character labels and exact-key endings. |
| **P-13.55** | Build the exercise's named **“prefix trie”** for one ASCII string and a pattern-matching method. Section 13.5 does not define that as a separate trie type: a trie of **only prefixes** of `T` would miss substring `WW`. Specify whether matching may start anywhere; if it may, index suffixes or use another complete search method. |
| **P-13.56** | Implement the simplified search engine for a small site's pages: index words except stop words, and map each term to pages containing it. Three geometry map cards can stand in for pages. |
| **P-13.57** | Add a relevance ranking so qualifying pages appear in useful order. Test the ranking on the same map cards, separating **which pages match** from **which matching page comes first**. |

For P-13.48–P-13.51, record the input generator, sizes, pattern lengths, counting rule, and timing setup. A comparison count measures algorithm steps; elapsed time also includes implementation and machine effects.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: One Connected Geometry Program

<span id="part-6-program"></span>

### 1. Trace repeated and circular route patterns

This small program produces reference observations for several exercise types. The route is known to trace a rectangle; the code records its corners and finds pattern starts.

```python
route = "EEEENWWWWS"
step = {"E": (1, 0), "N": (0, 1), "W": (-1, 0), "S": (0, -1)}

points = [(0, 0)]  # position before move 0, then after each move
for move in route:
    x, y = points[-1]
    dx, dy = step[move]
    points.append((x + dx, y + dy))


def starts(text, pattern):
    return [
        i
        for i in range(len(text) - len(pattern) + 1)
        if text.startswith(pattern, i)
    ]


pattern = "WW"
hits = starts(route, pattern)
chosen = []
next_free = 0
for i in hits:
    if i >= next_free:
        chosen.append(i)
        next_free = i + len(pattern)

wrap_pattern = "SEEE"
extended = route + route[: len(wrap_pattern) - 1]
wrap_starts = [
    i for i in range(len(route)) if extended.startswith(wrap_pattern, i)
]

print("corners:", [points[i] for i in (0, 4, 5, 9, 10)])
print("all WW starts:", hits)
print("rightmost WW:", hits[-1])
print("nonoverlapping WW starts:", chosen)
print("circular SEEE starts:", wrap_starts)
```

<span id="part-6-trace"></span>

### 2. Read its result

```text
corners: [(0, 0), (4, 0), (4, 1), (0, 1), (0, 0)]
all WW starts: [5, 6, 7]
rightmost WW: 7
nonoverlapping WW starts: [5, 7]
circular SEEE starts: [9]
```

The `WW` matches start at three different points on the upper edge: `(4,1)`, `(3,1)`, and `(2,1)`. The first and third matched intervals are disjoint. The circular `SEEE` starts at the final south move and continues from the route's beginning. This direct scan is a **small reference calculation**; exercises requiring a particular asymptotic bound need the corresponding search method and proof.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why do overlapping starts and a nonoverlapping count differ?</strong></summary>

**Scenario:** The robot makes four consecutive west moves on the upper edge: `WWWW`.

**Problem:** `WW` starts at relative positions `0,1,2`, but neighboring matches share a move.

**Fix:** Model each length-two match as an interval and select disjoint intervals from left to right.

**Result:** There are **three starts** but at most **two nonoverlapping matches**. In the full route, select starts `5` and `7`.

</details>

<details>
<summary><strong>Case Study 2: What crosses the end of a circular route string?</strong></summary>

**Scenario:** The rectangle route `EEEENWWWWS` returns to its start.

**Problem:** `SEEE` does not appear as a normal substring within its ten written characters.

**Fix:** Read the last `S` and then the first three `E` characters as one wrapped sequence.

**Result:** `SEEE` is a circular match starting at `9`. The physical closed route makes the wraparound interpretation natural.

</details>

<details>
<summary><strong>Case Study 3: Why does the nearest supply stop waste a refill?</strong></summary>

**Scenario:** The robot can travel four route units per bottle; holes are at distances `2,3,5,7`, and the finish is at `10`.

**Problem:** Hole `2` is reachable but choosing it first requires more refills than choosing the farther reachable hole `3`.

**Fix:** At each stop, use the farthest hole within the current four-unit range, while checking that the next gap is reachable.

**Result:** Refill at `3` and `7`, then reach `10` with **two refills**. A route beginning with a refill at `2` needs at least three.

</details>

<details>
<summary><strong>Case Study 4: Can two different route strings have the same geometry endpoint?</strong></summary>

**Scenario:** `EN` and `NE` each use one east and one north move from `(0,0)`.

**Problem:** Both end at `(1,1)`, but their character orders differ.

**Fix:** Compare the strings by the exercise's rule, keeping endpoint geometry separate from string equality.

**Result:** Their LCS length is `1`; either `E` or `N` is an answer. Neither complete route is a subsequence of the other.

</details>

<details>
<summary><strong>Case Study 5: Does one character edit equal one grid unit?</strong></summary>

**Scenario:** The routes `EEEEN` and `EEEES` share four east moves.

**Problem:** Their endpoints are `(4,1)` and `(4,-1)`, two grid units apart vertically.

**Fix:** Count permitted **string edits**, not endpoint distance. Replace the final `N` with `S`.

**Result:** Edit distance is `1` even though the endpoints are separated by `2` units.

</details>

<details>
<summary><strong>Case Study 6: What survives when a short route leaves a trie?</strong></summary>

**Scenario:** A trie stores `E`, `EEEE`, `EEEEN`, and `EEEES`.

**Problem:** Deleting `E` must not erase the longer routes' shared first east step.

**Fix:** Remove the complete-key marker for `E`, then prune only nodes with no remaining key below them; compressed tries may also merge newly unbranched paths.

**Result:** `E` is absent as an exact key, while `EEEE`, `EEEEN`, and `EEEES` remain searchable.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Exercise range | Main idea | Geometry check |
| :------------- | :-------- | :------------- |
| **R-13.1–R-13.7; C-13.15–C-13.26** | Borders, search traces, search variants, and bounds. | `WW` has starts `5,6,7`, rightmost start `7`, and two disjoint matches; `SEEE` wraps. |
| **R-13.8–R-13.10; C-13.27; C-13.33–C-13.38; P-13.46–P-13.47** | Dynamic programming for matrix order, sequence comparison, and edits. | `A(BC)` costs `36` versus `40`; `EN` and `NE` share two possible length-one LCS answers. |
| **R-13.11; P-13.52** | Huffman frequency coding and round-trip decoding. | `E:4, W:4, N:1, S:1` give `18` payload bits for the ten-move rectangle. |
| **C-13.28–C-13.32; C-13.39–C-13.41** | Greedy choices, interval geometry, triangulation, selection, and sums. | Refills at `3,7` suffice for the ten-unit walk; guards at `1,4` cover paintings at `0,1,3,4`. |
| **R-13.12–R-13.14; C-13.43–C-13.45; P-13.53–P-13.55** | Standard, compressed, and suffix tries. | A short key can end inside a shared route family; the full route has `WW` suffix starts `5,6,7`. |
| **P-13.48–P-13.51; P-13.56–P-13.57** | Reproducible search experiments and indexed retrieval. | Use comparable route logs for measurements and map cards for word-list queries and ranking. |

The 57 exercises ask for different kinds of evidence. Use the same small geometry notebook to check indices, coordinates, and outputs, then match the requested cost bound, proof, or experiment to the specific exercise.

[🔝 Back to Top](#top)
