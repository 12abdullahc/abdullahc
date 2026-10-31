<span id="top"></span>

# 12.4 Studying Sorting through an Algorithmic Lens — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 12, Section 12.4, printed pages 562–566 ([supplied Chapter 12 PDF](<../Data Structures and Algorithms in Python - C12.pdf>)).<br>
> **Topic:** 12.4 Studying Sorting through an Algorithmic Lens; 12.4.1 Lower Bound for Sorting; 12.4.2 Linear-Time Sorting: Bucket-Sort and Radix-Sort.<br>
> **Domain Focus:** The same six rectangular cards used in [Sections 12.1–12.3](12-01-why-study-sorting-algorithms.md); compare their areas, place them in area buckets, and sort their dimensions as pairs.<br>
> **User Prompt:** Reexplain Section 12.4 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: What Can a Sort Learn?](#background)
   - [1. Reuse the six rectangle cards](#background-cards)
   - [2. Two ways to learn where a card belongs](#background-ways)
2. [Part 1: 12.4 Studying Sorting through an Algorithmic Lens](#part-1)
   - [1. Ask what any sorting method can achieve](#part-1-question)
   - [2. Separate a lower bound from an algorithm's upper bound](#part-1-bounds)
3. [Part 2: 12.4.1 Lower Bound for Sorting](#part-2)
   - [1. Treat each comparison as a yes-or-no question](#part-2-tree)
   - [2. Count possible arrival orders](#part-2-factorial)
   - [3. Derive the worst-case comparison bound](#part-2-proof)
   - [4. Apply the argument to distinct-area cards](#part-2-cards)
4. [Part 3: 12.4.2 Linear-Time Sorting: Bucket-Sort and Radix-Sort](#part-3)
   - [1. Use a bounded integer key as a bucket index](#part-3-buckets)
   - [2. Trace area buckets and their cost](#part-3-trace)
   - [3. Keep equal-key cards in arrival order](#part-3-stable)
   - [4. Sort pairs of dimensions with stable passes](#part-3-radix)
   - [5. Extend the idea and run a Python example](#part-3-code)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: What Can a Sort Learn?

<span id="background-cards"></span>

### 1. Reuse the six rectangle cards

The [Section 12.1 guide](12-01-why-study-sorting-algorithms.md) introduced these cards in **arrival order** `D, C, A, B, E, F`. We will keep the labels attached so we can see what happens to different cards with the same area.

| Card | Width | Height | Area = width × height |
| :--- | ----: | -----: | --------------------: |
| `D` | 4 cm | 4 cm | 16 cm² |
| `C` | 3 cm | 4 cm | 12 cm² |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 2 cm | 4 cm | 8 cm² |
| `E` | 1 cm | 8 cm | 8 cm² |
| `F` | 4 cm | 5 cm | 20 cm² |

Sorting by **area** should produce `[A:6, B:8, E:8, C:12, D:16, F:20]` if the method preserves the arrival order of the two 8 cm² cards. Cards `B` and `E` are different physical objects even though their areas are equal.

<span id="background-ways"></span>

### 2. Two ways to learn where a card belongs

The earlier [merge-sort](12-02-merge-sort.md) and [quick-sort](12-03-quick-sort.md) guides ordered cards by asking questions like **“Is this area less than that area?”** Those are *comparisons*. Section 12.4 asks how many such questions any comparison-based method may need.

Our measured areas also have a useful extra property: they are **whole numbers in a known, small range**, from 0 through 20 cm². We can use an area such as `8` directly as an index into a collection of numbered buckets. This gives the algorithm information that an arbitrary pairwise comparison alone does not provide.

| Sorting task | Information the method uses | Example |
| :----------- | :-------------------------- | :------ |
| Compare areas | The answer to `area of A < area of B?` | `6 < 8` is true. |
| Place by area key | A bounded integer that names a bucket | An 8 cm² card goes in bucket `8`. |
| Sort by two measurements | An ordered pair, with one component taking priority | `(width, height)` puts `(1, 8)` before `(2, 3)`. |

> **Mental model:** A limit on the number of *comparisons* applies when comparisons are the way a sorting method learns order. A bounded integer key gives bucket-sort and radix-sort another way to organize the cards.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 12.4 Studying Sorting through an Algorithmic Lens

<span id="part-1-question"></span>

### 1. Ask what any sorting method can achieve

The chapter has already discussed **merge-sort** and **quick-sort**, and it introduced **heap-sort** in Section 9.4. Merge-sort and heap-sort have O(n log n) worst-case running time; randomized quick-sort has O(n log n) *expected* running time but can have an O(n²) run. Here `n` is the number of items, and `log n` grows slowly as the input gets larger.

Section 12.4 steps back from individual implementations and asks two connected questions:

1. If a method learns order by comparing pairs of items, can it guarantee fewer than about `n log n` comparisons for **every** possible input?
2. If the keys have a special form, can a method sort them faster by using that form?

The first question leads to a lower bound. The second leads to bucket-sort and radix-sort. The assumptions matter: the answers are about **different kinds of sorting methods**.

<span id="part-1-bounds"></span>

### 2. Separate a lower bound from an algorithm's upper bound

The book uses asymptotic notation to describe how work grows with `n`:

| Notation | Meaning here | Example |
| :------- | :----------- | :------ |
| **O(f(n))** | An upper bound on growth for a stated algorithm and case. | Merge-sort takes O(n log n) time in the worst case. |
| **Ω(f(n))** | A lower bound on growth for the stated problem and model. | Every comparison sort has some input requiring Ω(n log n) comparisons. |

The lower bound does **not** say that every input needs `n log n` comparisons. It says no comparison-based sorting algorithm can guarantee a better *worst-case* comparison count over all distinct-key inputs. Bucket-sort uses direct indexing instead of determining order solely through pairwise comparisons, so that particular limit does not rule it out.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 12.4.1 Lower Bound for Sorting

<span id="part-2-tree"></span>

### 1. Treat each comparison as a yes-or-no question

Imagine sorting only cards `A`, `B`, and `C` by their distinct areas `6`, `8`, and `12`. For this lower-bound thought experiment, the sorter receives the cards in an unknown order and can learn their area order **only by comparing input items**. The printed labels and measurements help us follow the example; the sorter cannot use them as a precomputed lookup table. A question such as “Is the area at input position 0 less than the area at position 1?” has two possible answers: **yes** or **no**. The next comparison may depend on that answer.

We can draw every possible sequence of answers as a **binary decision tree**:

```text
compare two areas?
├── yes → next comparison or finished order
└── no  → next comparison or finished order
```

Each internal node is one comparison. Each root-to-leaf path is one possible run. The algorithm need not actually store this tree; it is a mathematical picture of all paths it could take. A tree of height `h` has at most `2^h` leaves, so it cannot distinguish more than `2^h` possibilities with `h` yes-or-no answers.

<span id="part-2-factorial"></span>

### 2. Count possible arrival orders

Three **distinct-area** cards can arrive in `3! = 3 × 2 × 1 = 6` orders: `ABC`, `ACB`, `BAC`, `BCA`, `CAB`, and `CBA`. A correct comparison sort must discover enough to put the cards into the right output positions for whichever order arrived. A leaf in its decision tree cannot stand for two different permutations that require different rearrangements.

| Maximum comparisons on a path | At most this many leaves | Enough for 6 orders? |
| ----------------------------: | -----------------------: | :------------------- |
| 2 | `2² = 4` | No. |
| 3 | `2³ = 8` | Yes, at least in terms of capacity. |

Therefore, **some** arrival order of these three cards requires at least `⌈log₂(6)⌉ = 3` comparisons. The leaf count establishes a minimum; it does not by itself construct a sorting algorithm.

<span id="part-2-proof"></span>

### 3. Derive the worst-case comparison bound

With `n` distinct keys, the number of possible input permutations is

```text
n! = n × (n − 1) × ... × 2 × 1.
```

The decision tree needs **at least `n!` leaves**. Since a height-`h` binary tree has at most `2^h` leaves, `2^h ≥ n!`, which means

```text
h ≥ ⌈log₂(n!)⌉.
```

To see why this grows on the order of `n log n`, look at the largest half of the factors in `n!`. At least `⌈n/2⌉` of them are at least `n/2`, so `n! ≥ (n/2)^(n/2)` for `n ≥ 2`. Taking logarithms gives

```text
log₂(n!) ≥ (n/2) log₂(n/2) = Ω(n log n).
```

This is the book's **worst-case comparison lower bound** (Proposition 12.4). Counting comparisons alone is enough: if an algorithm must make that many comparisons on some input, its total running time cannot be smaller.

<span id="part-2-cards"></span>

### 4. Apply the argument to distinct-area cards

Take `A:6`, `B:8`, `C:12`, `D:16`, and `F:20`. These five area keys are distinct. They can arrive in `5! = 120` orders. Because `2⁶ = 64 < 120 ≤ 128 = 2⁷`, a comparison sort needs **at least 7 comparisons in its worst case** for these five cards.

We leave out `E:8` from this particular factorial count. With all six cards and **area alone** as the key, `B` and `E` tie, so claiming `6!` different area orders would misuse the distinct-key argument. The general Ω(n log n) result still applies to the sorting problem because its possible inputs include sequences of `n` distinct keys.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 12.4.2 Linear-Time Sorting: Bucket-Sort and Radix-Sort

<span id="part-3-buckets"></span>

### 1. Use a bounded integer key as a bucket index

The book's bucket-sort assumes each entry has an **integer key** `k` in the known range `0` through `N − 1`. Create an array of `N` initially empty sequences, `B[0]` through `B[N−1]`. For each entry, append it to `B[k]`. Finally, read the buckets in numeric order and append their entries to the output.

For our cards, let the key be area in cm². The largest area is `20`, so choose `N = 21` and make buckets `0` through `20`. The key is an **array index**, not the result of comparing this card's area with every other card's area. The book's pseudocode moves entries out of and back into its input sequence; the Python teaching example below returns a new list.

<span id="part-3-trace"></span>

### 2. Trace area buckets and their cost

Process `D, C, A, B, E, F` from front to back:

| Card read | Area key | Bucket after appending this card |
| :-------- | -------: | :------------------------------- |
| `D` | 16 | `B[16] = [D]` |
| `C` | 12 | `B[12] = [C]` |
| `A` | 6 | `B[6] = [A]` |
| `B` | 8 | `B[8] = [B]` |
| `E` | 8 | `B[8] = [B, E]` |
| `F` | 20 | `B[20] = [F]` |

All other buckets are empty. Scanning `B[0]` through `B[20]` gives `[A, B, E, C, D, F]`, with areas `[6, 8, 8, 12, 16, 20]`.

There are `N` buckets to create and inspect and `n` entries to place and collect. Under the book's constant-time bucket-operation assumption, bucket-sort takes **O(n + N) time and O(n + N) space**. Here `n = 6` and `N = 21`; `n + N = 27` describes the scale of the work, **not** an exact count of Python operations. If `N = O(n)`, the time is O(n). If the key range is huge compared with the number of cards, creating and scanning all those buckets is costly.

<span id="part-3-stable"></span>

### 3. Keep equal-key cards in arrival order

A sort is **stable** when entries with equal keys keep their original relative order. In the original sequence, `B:8` arrives before `E:8`. Both go into `B[8]`, where appending in input order makes `[B, E]`. Reading that bucket from front to back keeps `B` before `E` in the output.

Stability depends on the procedure, not merely the bucket names: process the input from front to back, add each entry to the **end** of its bucket, and read each bucket from front to back. Reversing one bucket during output would still give sorted area numbers but would change the order of equal-area physical cards. This stable behavior is what radix-sort needs for multi-part keys.

<span id="part-3-radix"></span>

### 4. Sort pairs of dimensions with stable passes

Now ask a **different geometry question**: order cards by `(width, height)`, with width first and height breaking width ties. This is *lexicographic order*: `(w₁, h₁)` comes before `(w₂, h₂)` if `w₁ < w₂`, or if the widths tie and `h₁ < h₂`. It is **not** area order: `E` has width 1 and comes before `A` with width 2, even though `E` has larger area.

Radix-sort handles this pair by making two **stable** bucket passes. The lower-priority component, height, goes first; the higher-priority component, width, goes last:

| Stage | Card order | Why |
| :---- | :--------- | :-- |
| Arrival | `D, C, A, B, E, F` | Measurements have not been sorted. |
| Stable pass by **height** | `A, D, C, B, F, E` | Heights are `3, 4, 4, 4, 5, 8`; the three height-4 cards retain `D, C, B` order. |
| Stable pass by **width** | `E, A, B, C, D, F` | Widths are `1, 2, 2, 3, 4, 4`; height order survives within each equal-width group. |

The final dimension pairs are `(1, 8), (2, 3), (2, 4), (3, 4), (4, 4), (4, 5)`. Within width 2, `A` remains before `B` because its height 3 came before height 4. Within width 4, `D` remains before `F` because height 4 came before height 5.

If we reverse the passes—**width first, height last**—the result is `A, B, C, D, F, E`. That is ordered primarily by height and puts width-1 card `E` last. Stability preserves an earlier pass **within ties in the later pass**; therefore, the most important component must be sorted last.

<span id="part-3-code"></span>

### 5. Extend the idea and run a Python example

For a key with `d` components `(k₁, k₂, …, k_d)`, make stable bucket passes in the order `k_d, …, k₂, k₁`. If each component is an integer from `0` through `N − 1`, the book gives **O(d(n + N)) time** (Proposition 12.6). This is O(n) when `d` is fixed and `N = O(n)`. A growing number of components or a very large key range changes that conclusion. The book notes that strings can be treated as multi-part keys, with extra care for varying lengths.

This original Python example runs both sorts on the same cards. Its helper returns a new list; it assumes every key is a nonnegative integer below `bucket_count`.

```python
cards = [
    ("D", 4, 4), ("C", 3, 4), ("A", 2, 3),
    ("B", 2, 4), ("E", 1, 8), ("F", 4, 5),
]


def stable_bucket_sort(items, key, bucket_count):
    buckets = [[] for _ in range(bucket_count)]
    for item in items:                    # input order
        buckets[key(item)].append(item)  # append to the end

    result = []
    for bucket in buckets:                # key order
        result.extend(bucket)             # preserve order within a bucket
    return result


by_area = stable_bucket_sort(cards, lambda card: card[1] * card[2], 21)
by_height = stable_bucket_sort(cards, lambda card: card[2], 9)
by_dimensions = stable_bucket_sort(by_height, lambda card: card[1], 9)

print([card[0] for card in by_area])        # ['A', 'B', 'E', 'C', 'D', 'F']
print([card[0] for card in by_height])      # ['A', 'D', 'C', 'B', 'F', 'E']
print([card[0] for card in by_dimensions])  # ['E', 'A', 'B', 'C', 'D', 'F']
```

The area pass uses 21 buckets for integer keys `0..20`. Each dimension pass uses 9 buckets for integer measurements `0..8`. The two sorts answer different questions, so their final card orders need not match.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Why are two comparisons insufficient for three distinct areas?</strong></summary>

**Scenario:** Cards `A`, `B`, and `C` have areas 6, 8, and 12 cm² and may arrive in any order.

**Reasoning:** There are `3! = 6` possible orders. Two yes-or-no comparisons have at most `2² = 4` answer paths, fewer than six. A third comparison allows up to eight paths.

**Result:** A comparison-based method needs at least three comparisons for **some** arrival order of these three cards.

</details>

<details>
<summary><strong>Case Study 2: Why not count 6! area orders for all six cards?</strong></summary>

**Scenario:** Cards `B` and `E` both have area 8 cm². We are comparing **areas only**.

**Problem:** The `n!` argument assumes distinct keys. An area comparison cannot distinguish the order of `B` and `E` by value alone.

**Fix:** Use the five distinct-area cards `A, B, C, D, F` for the literal calculation: `5! = 120`, so at least `⌈log₂ 120⌉ = 7` comparisons are needed in the worst case.

</details>

<details>
<summary><strong>Case Study 3: Where do two equal-area cards go?</strong></summary>

**Scenario:** Bucket-sort reads `B:8` before `E:8` in the original arrival sequence.

**Reasoning:** Both cards go into bucket `B[8]`. Appending to that bucket produces `[B, E]`; reading it front to back produces the same order.

**Result:** The sorted area sequence contains both cards, with `B` before `E`. The sorted **numbers** alone would not show whether that stable order was preserved.

</details>

<details>
<summary><strong>Case Study 4: Why does radix-sort handle height before width?</strong></summary>

**Scenario:** The new key is `(width, height)`, so width is more important. A height pass gives `A, D, C, B, F, E`.

**Reasoning:** A following *stable* width pass groups widths while retaining height order within each width: `E, A, B, C, D, F`. Reversing the passes gives `A, B, C, D, F, E`, which wrongly puts width-1 card `E` after the width-4 cards.

**Result:** Sort the **less important** component first and the **more important** component last.

</details>

<details>
<summary><strong>Case Study 5: Can a change of units make area buckets expensive?</strong></summary>

**Scenario:** We keep the same six physical cards but measure area in mm² instead of cm². Since `1 cm² = 100 mm²`, card `F`'s 20 cm² becomes 2000 mm².

**Reasoning:** Direct indexing from 0 through the maximum key now needs `N = 2001` buckets instead of `N = 21`, even though `n` is still six. The sorted physical order does not change, but the `N` term in O(n + N) becomes much larger.

**Result:** Bucket-sort's speed depends on the size of the integer key range and its representation, not just on how many cards we sort.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 12.4 idea | Plain-language meaning | Rectangle-card example |
| :---------------- | :--------------------- | :--------------------- |
| **Comparison model** | Learn order by asking yes-or-no questions about pairs. | Is `A:6` smaller than `B:8`? |
| **Decision tree** | Picture every possible sequence of comparison answers. | Three distinct-area cards have six possible arrival orders. |
| **Comparison lower bound** | Some distinct-key input forces at least `⌈log₂(n!)⌉` comparisons, which is Ω(n log n). | Five distinct-area cards yield `5! = 120` orders and a minimum worst-case count of 7. |
| **Bucket-sort assumption** | Keys are integers in a known range `0..N−1`. | Area 8 goes directly to `B[8]`. |
| **Bucket-sort cost** | Create/scan `N` buckets and move `n` entries: O(n + N) time and space. | Six cards in cm² use buckets `0..20`, so `N = 21`. |
| **Stability** | Equal-key entries keep their arrival order. | Area bucket `B[8]` keeps `[B, E]`. |
| **Radix-sort order** | Stable passes process tuple components from last to first. | Sort height, then width, for `(width, height)` keys. |
| **Radix-sort cost** | `d` passes with bounded integer components take O(d(n + N)) time. | Two dimension passes use nine buckets each for measurements `0..8`. |

[🔝 Back to Top](#top)
