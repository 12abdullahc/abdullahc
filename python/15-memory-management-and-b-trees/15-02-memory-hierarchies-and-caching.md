<span id="top"></span>

# 15.2 Memory Hierarchies and Caching — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 15, Section 15.2, printed pages 705–710 ([supplied PDF](../Data%20Structures%20and%20Algorithms%20in%20Python%20-%20C15.pdf)).<br>
> **Topic:** 15.2 Memory Hierarchies and Caching; 15.2.1 Memory Systems; 15.2.2 Caching Strategies.<br>
> **Domain Focus:** A 4 × 4 mosaic of unit-square tiles; area queries, row and column scans, and cached pages describing the mosaic.<br>
> **User Prompt:** Reexplain [`Section 15.2`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Tile Mosaic](#background)
   - [1. The geometry problem](#background-geometry)
   - [2. From tile positions to data blocks](#background-blocks)
2. [Part 1: 15.2 Memory Hierarchies and Caching](#part-1)
   - [1. Why moving data can dominate a calculation](#part-1-travel)
3. [Part 2: 15.2.1 Memory Systems](#part-2)
   - [1. Five levels, from small and fast to large and slow](#part-2-levels)
4. [Part 3: 15.2.2 Caching Strategies](#part-3)
   - [1. Find the level that limits this problem](#part-3-bottleneck)
   - [2. Read the book's speed comparisons carefully](#part-3-ratios)
   - [3. Why the equal-cost memory model is still useful](#part-3-model)
   - [4. Temporal and spatial locality](#part-3-locality)
   - [5. Caching and the virtual-memory model](#part-3-caching)
   - [6. Blocking: transfer neighbors together](#part-3-blocking)
   - [7. What happens when the fast level fills?](#part-3-full)
   - [8. The book's browser-cache analogy](#part-3-browser)
5. [Part 4: Page Replacement and a Five-Request Trace](#part-4)
   - [1. FIFO, LRU, and random replacement](#part-4-policies)
   - [2. Trace five row-page requests](#part-4-trace)
   - [3. Cost and implementation tradeoffs](#part-4-costs)
   - [4. A difficult repeated pattern](#part-4-worst-case)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Tile Mosaic

<span id="background-geometry"></span>

### 1. The geometry problem

Imagine a square display board made from **4 rows and 4 columns** of small square tiles. Each tile measures **1 cm × 1 cm**, so its area is **1 cm²**. The whole mosaic has area **4 × 4 = 16 cm²**. The upper-left region, 2 rows high and 3 columns wide, has area **2 × 3 = 6 cm²** and perimeter **2(2 + 3) = 10 cm**.

```text
              column 0   column 1   column 2   column 3
row 0             0          1          2          3
row 1             4          5          6          7
row 2             8          9         10         11
row 3            12         13         14         15
```

The numbers are **logical record positions** in row-major order: move across a row before starting the next one. In this teaching model, position `(r, c)` has index **`4r + c`**. The upper-left 2 × 3 region therefore asks for records `0, 1, 2, 4, 5, 6`.

<span id="background-blocks"></span>

### 2. From tile positions to data blocks

Suppose the 16 tile records are stored **contiguously** and transferred four records at a time. The records for each row happen to form one block:

| Block | Tile-record positions | Geometry row |
| :---- | :-------------------- | :----------- |
| `B0` | `0, 1, 2, 3` | Top row |
| `B1` | `4, 5, 6, 7` | Second row |
| `B2` | `8, 9, 10, 11` | Third row |
| `B3` | `12, 13, 14, 15` | Bottom row |

We will use a **toy fully associative fast cache with two block slots**: any block can use either slot. It can hold `2 × 4 = 8` of the 16 tile records at once. This is a model of data movement, not a claim that a Python `list` stores tile objects contiguously or that an actual CPU cache has two slots. Tile area is measured in cm²; cache capacity is measured in records or blocks.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 15.2 Memory Hierarchies and Caching

<span id="part-1-travel"></span>

### 1. Why moving data can dominate a calculation

Computing a tile's area requires one small multiplication: `1 × 1 = 1`. For a very large mosaic, getting the needed tile records to the processor can take longer than doing those multiplications. Section 15.2 asks us to count **where data lives** and **how often it must move** between storage levels.

The 4 × 4 mosaic is small enough to calculate by hand, but it lets us see the same issue. A row scan and a column scan both inspect all 16 tiles and compute **16 cm²**. Their arithmetic is the same; their block-transfer counts can differ greatly.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 15.2.1 Memory Systems

<span id="part-2-levels"></span>

### 1. Five levels, from small and fast to large and slow

The book's Figure 15.1 places storage in a hierarchy. Moving away from the CPU generally gives **more capacity** and **slower access**:

| Level | Role in the textbook picture | Relative capacity and access |
| :---- | :---------------------------- | :--------------------------- |
| **CPU registers** | Values used immediately by the CPU. | Smallest, fastest. |
| **Caches** | Recently or nearby used data. | Bigger than registers, slower. |
| **Internal/main memory** | A program's working data in RAM. | Bigger than caches, slower. |
| **External memory** | Persistent storage such as a disk. | Much bigger, much slower in the book's comparison. |
| **Network storage** | Data reached through a network. | Another potentially larger, slower level in the book's model. |

```text
near CPU:  registers → caches → main memory → external storage → network storage
           smaller/faster                                  larger/slower
```

Data is copied between neighboring levels as the program runs. The CPU may need a tile record that is not yet in the fast level, so the system transfers a block containing it from a slower level.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 15.2.2 Caching Strategies

<span id="part-3-bottleneck"></span>

### 1. Find the level that limits this problem

The most important boundary often lies between the **smallest level that can hold the whole data set** and the faster level just above it. In our toy model, the 16-record mosaic fits in a 16-record main memory but not in an 8-record cache. Cache-to-main-memory transfers matter. If a collection of mosaics grows beyond main memory, main-memory-to-external-storage transfers can become the larger concern.

| Toy data set | Fits in toy cache (8 records)? | Fits in toy main memory (16 records)? | Boundary to watch |
| :----------- | :----------------------------- | :------------------------------------ | :---------------- |
| One 4 × 4 mosaic: 16 records | No | Yes | Cache ↔ main memory |
| Ten such mosaics: 160 records | No | No | Main memory ↔ external storage |

The capacities are invented for this lesson. They help us choose which transfers to count; they are not hardware specifications.

<span id="part-3-ratios"></span>

### 2. Read the book's speed comparisons carefully

To show why transfers matter, the textbook gives rough comparisons: main-memory access can take **10–100 times** as long as cache access, and disk access can take **100,000–1,000,000 times** as long as main-memory access. Those are examples from the book's hardware context, **not universal timings for current machines**. Its email-versus-walking analogy emphasizes the same point: a slow-level transfer can dominate many quick calculations.

For the mosaic, a design that avoids one expensive block load can be useful even if it performs the same number of `1 × 1` multiplications. We will use small, explicitly invented time units later rather than treating the textbook's ratios as a benchmark.

<span id="part-3-model"></span>

### 3. Why the equal-cost memory model is still useful

Earlier algorithm analysis in the book generally treats memory accesses as having equal cost. That simplified model makes algorithms portable: real cache sizes, storage devices, and access times vary by machine and may be unknown. It is still useful for comparing basic operation counts.

Caching gives another reason the model often works reasonably well: repeated and nearby accesses can be served from a faster level. When a data set is too large or its access pattern defeats the cache, transfer counts become important too. We will keep both views separate:

| Question | Simple model | Hierarchy-aware model |
| :------- | :----------- | :-------------------- |
| How many tile records are inspected? | Count the 16 accesses. | Still count 16 accesses. |
| How many slow transfers occur? | Treat all accesses alike. | Count cache misses and block loads. |

> **Mental model:** The area formula tells us *what* to compute; the access order influences *how often* the computer must fetch data.

<span id="part-3-locality"></span>

### 4. Temporal and spatial locality

Many programs use a small part of their data repeatedly and also read nearby data soon after one location. The book names these two patterns:

| Locality | Plain-language rule | Mosaic example |
| :------- | :------------------ | :------------- |
| **Temporal** | A location used now is likely to be used again soon. | Inspect tile `0`, then return to tile `0` while checking the top row. |
| **Spatial** | Locations near one just used are likely to be used soon. | After tile `0`, inspect tiles `1`, `2`, and `3` across the same row. |

A repeated row-by-row scan has both kinds: neighboring tile records are read in sequence, and the next pass may revisit the same records. Locality is an **expectation about a workload**, not a guarantee of a hit. Our two-slot cache cannot retain all four row blocks between full passes. A column scan of row-major records moves from `0` to `4` to `8` to `12`, so consecutive requests land in different row blocks.

<span id="part-3-caching"></span>

### 5. Caching and the virtual-memory model

The book describes a **primary** level (smaller and faster) and a **secondary** level (larger and slower). These are relative names: primary might mean CPU cache with main memory as secondary, or main memory with external storage as secondary.

In the book's simplified **virtual-memory** picture, a program can address data in the larger secondary-level space. When it requests data that is absent from primary, the system brings it into primary. Keeping that copy for likely reuse is **caching**, motivated by temporal locality. Modern virtual-memory implementations have more details than this two-level teaching model.

For our mosaic, suppose block `B0` is on the slower side and the fast cache is empty. A request for tile `0` is a **miss** and loads `B0`; a later request for tile `0` is a **hit** while `B0` remains there. A hit can be served from the faster level.

<span id="part-3-blocking"></span>

### 6. Blocking: transfer neighbors together

**Blocking** means transferring a contiguous group of locations containing the requested one. This uses spatial locality: if tile `0` is requested, nearby row-major positions `1`, `2`, and `3` may soon be needed too. The book calls such a block a **cache line** between cache and main memory, and a **page** between main and external memory. Figure 15.2 illustrates blocks in the external-memory address space.

Our upper-left 2 × 3 region uses indices `0, 1, 2, 4, 5, 6`:

```python
side = 4
region = [side * row + col for row in range(2) for col in range(3)]
print(region)       # [0, 1, 2, 4, 5, 6]
print(len(region))  # 6 tiles = 6 cm^2
```

Starting with an empty two-block cache, the first access to `0` loads `B0`. Accesses to `1` and `2` hit in that block. The first access to `4` loads `B1`; `5` and `6` then hit. Thus **6 tile requests cause 2 block loads and 4 hits**. Each load brings four records, including a neighboring tile we did not ask for. The Python code calculates logical indices; it does not control actual machine cache lines.

<span id="part-3-full"></span>

### 7. What happens when the fast level fills?

The two cache slots can hold `B0` and `B1`, but not `B0`, `B1`, and `B2` at once. If the program requests a tile in row 2, it must bring in `B2` and make room by **evicting** one cached block. Which block should leave? That choice is a **replacement policy**.

In the toy model, an evicted block is still available in the slower level; eviction removes its fast copy. A later request for it will miss and reload it. The important cost is often the number of these slow block transfers.

<span id="part-3-browser"></span>

### 8. The book's browser-cache analogy

The book uses a web browser to make replacement concrete. Imagine four web pages `P0` through `P3`, each showing the tile data for one mosaic row. The browser has **`m = 2` cache slots**. A page can occupy either slot, so this toy cache is **fully associative**. Assume the browser can quickly check whether a requested page is present and unchanged.

| Request result | Browser action | Mosaic interpretation |
| :------------- | :------------- | :-------------------- |
| **Hit** | Use the cached copy. | The row page is already in a fast slot. |
| **Miss, empty slot** | Fetch the page from the network and fill the slot. | A new row page enters the cache. |
| **Miss, full cache** | Choose a page to evict, then fetch the requested page. | A policy decides which older row page leaves. |

Here a *web page* is the browser's cached item. It is an analogy for memory-block replacement, not the same thing as a virtual-memory *page* transferred between disk and RAM.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Page Replacement and a Five-Request Trace

<span id="part-4-policies"></span>

### 1. FIFO, LRU, and random replacement

When both browser-cache slots are occupied, the book compares three ways to choose a page to remove (Figure 15.3):

| Policy | Evict... | Does a hit change the eviction order? |
| :----- | :------- | :------------------------------------ |
| **FIFO** (first in, first out) | The page that entered the cache earliest. | **No.** A hit does not change its arrival time. |
| **LRU** (least recently used) | The page whose most recent request was earliest. | **Yes.** A hit makes that page the most recently used. |
| **Random** | A randomly selected resident page. | No usage order is maintained. |

FIFO asks **when a page entered**; LRU asks **when it was last requested**. Those are different timestamps. Random replacement is simple, but its result must be specified before we can trace a particular run.

<span id="part-4-trace"></span>

### 2. Trace five row-page requests

Suppose the teacher opens mosaic row pages in the order **`P0, P1, P0, P2, P0`**, starting with an empty two-slot cache. In each ordered cache state below, the left page is oldest according to that policy and the right page is newest.

| Step | Request | FIFO result and order afterward | LRU result and order afterward |
| ---: | :------ | :------------------------------ | :----------------------------- |
| 1 | `P0` | Miss; `[P0]` | Miss; `[P0]` |
| 2 | `P1` | Miss; `[P0, P1]` | Miss; `[P0, P1]` |
| 3 | `P0` | Hit; `[P0, P1]` | Hit; `[P1, P0]` |
| 4 | `P2` | Miss; evict `P0`; `[P1, P2]` | Miss; evict `P1`; `[P0, P2]` |
| 5 | `P0` | Miss; evict `P1`; `[P2, P0]` | Hit; `[P2, P0]` |

Both policies fetched the first two pages. The **third request** is the turning point: LRU records that `P0` was just used, while FIFO still treats it as the oldest arrival. On this one trace, FIFO has **4 misses and 1 hit**; LRU has **3 misses and 2 hits**. The row pages still describe the same 4 × 4 mosaic, so caching changes the access cost, not the geometry.

For random replacement, step 4 may evict `P0` or `P1`. If it evicts `P0`, step 5 misses; if it evicts `P1`, step 5 hits. Random has no single deterministic miss count for this sequence without a specified draw.

<span id="part-4-costs"></span>

### 3. Cost and implementation tradeoffs

To make the trace's cost visible, suppose a **hit costs 1 toy time unit** and a **miss costs 20 toy time units total**, including fetching the page. Then:

```text
FIFO: 4 misses × 20 + 1 hit × 1 = 81 toy units
LRU:  3 misses × 20 + 2 hits × 1 = 62 toy units
```

These invented units exclude policy bookkeeping and are **not measured browser or hardware times**. Real replacement policies also consume time and space:

| Policy | Book's implementation idea | Extra policy work, assuming fast membership lookup |
| :----- | :------------------------- | :------------------------------------------------- |
| Random | Choose a resident slot randomly when replacement is needed. | O(1) per replacement; no recency update on hits. |
| FIFO | Keep cached pages in a queue; add only when fetched, remove the oldest on eviction. | O(1) per replacement; no queue change on hits. |
| LRU | Keep pages ordered by last use in an adaptable priority queue or linked list, with a direct way to find and move a page's node. | O(1) update/eviction is possible, but hits also need an order update and the structure uses extra space. |

The O(1) statements concern **replacement-policy overhead** under the book's quick lookup assumption. A linked list by itself does not find an arbitrary page in O(1); an index or direct node handle is needed. Even with constant-time operations, LRU's extra work and storage can matter.

<span id="part-4-worst-case"></span>

### 4. A difficult repeated pattern

Now request **three** different row pages in a cycle, `P0, P1, P2, P0, P1, P2, ...`, but keep only **two** slots (`m = 2`). After the first two misses fill the cache, every next request misses under both FIFO and LRU. For the first six requests there are **6 misses**: the first two fill empty slots and the following **4 misses require replacements**.

The same problem occurs in the book's general pattern of cycling through **`m + 1` pages with an `m`-page cache**. This is a worst-case example, not a prediction for most workloads. The book reports experimental simulations in which LRU usually performs better than FIFO, and FIFO usually better than random; no one policy wins on every possible request sequence.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Which memory boundary matters for the mosaic?</strong></summary>

**Scenario:** One 4 × 4 mosaic has 16 tile records. Our toy cache holds 8 records and toy main memory holds 16.

**Problem:** The board fits in main memory but not wholly in the cache.

**Result:** Count transfers between cache and main memory. If the project grows to ten such mosaics, it has `10 × 16 = 160` records and no longer fits in this toy main memory; transfers from external storage may become the main concern.

</details>

<details>
<summary><strong>Case Study 2: How many block loads find a 2 × 3 region?</strong></summary>

**Scenario:** The upper-left rectangle covers tile records `0, 1, 2, 4, 5, 6`. The cache starts empty and each block contains one four-record row.

**Problem:** Six records are requested, but records `0`–`2` share `B0` and records `4`–`6` share `B1`.

**Result:** There are **2 misses and 4 hits**, so only two row-block loads are needed. The geometry result is **6 cm²**. With the invented costs above, access time is `2 × 20 + 4 × 1 = 44` toy units, versus `6 × 20 = 120` in a comparison model with one-record transfers, no blocking, and the same 20-unit cost for each miss.

</details>

<details>
<summary><strong>Case Study 3: Why can two scans of the same board cost differently?</strong></summary>

**Scenario:** Read all 16 tiles, starting with an empty two-block cache. A row-major scan reads `0, 1, ..., 15`. A column-major scan reads `0, 4, 8, 12, 1, 5, 9, 13, ...`.

**Problem:** The row-major scan finishes each four-record block before moving on. The column-major scan alternates among four row blocks, more than the two slots can retain.

**Result:** Under FIFO or LRU in this toy fully associative cache, row-major gives **4 misses and 12 hits**; column-major gives **16 misses and 0 hits**. Both calculate **16 cm²**. With the same toy costs, that is `4 × 20 + 12 = 92` versus `16 × 20 = 320` units. This illustrates spatial locality, not a measured speedup for a Python `list`.

</details>

<details>
<summary><strong>Case Study 4: Does reopening row 0 protect it from eviction?</strong></summary>

**Scenario:** A two-page cache receives `P0, P1, P0, P2`.

**Problem:** `P0` is the oldest arrival, but `P1` is the least recently used page after the second `P0` request.

**Result:** FIFO evicts **`P0`**; LRU evicts **`P1`**. A fifth request for `P0` misses under FIFO and hits under LRU.

</details>

<details>
<summary><strong>Case Study 5: Can random replacement promise the fifth request is fast?</strong></summary>

**Scenario:** Use the same `P0, P1, P0, P2, P0` request order, but choose a random resident page when `P2` arrives.

**Problem:** The two possible victims lead to different outcomes.

**Result:** Evicting `P0` makes the final `P0` a miss; evicting `P1` makes it a hit. A random policy has no fixed result for this single trace until its choice is known.

</details>

<details>
<summary><strong>Case Study 6: Does LRU always benefit from revisits?</strong></summary>

**Scenario:** With two slots, cycle through `P0, P1, P2` repeatedly.

**Problem:** Each page returns only after two other distinct pages have been requested, so it has already been evicted under FIFO and LRU.

**Result:** Once the cache is full, **every request causes a miss and replacement** for both policies. Locality must match the cache capacity to help.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Section 15.2 idea | Plain-language meaning | Mosaic example |
| :---------------- | :--------------------- | :------------- |
| **Memory hierarchy** | Fast storage is usually smaller; slower storage can hold more. | The two-block cache holds only half of the 16 records. |
| **Bottleneck boundary** | Focus on transfers between the level that holds the data and the faster level above it. | One mosaic fits in toy main memory, not in toy cache. |
| **Temporal locality** | Recently used data may be used again soon. | `P0` is requested twice before `P2`. |
| **Spatial locality** | Nearby data may be requested next. | Tiles `0, 1, 2, 3` share a row block. |
| **Caching** | Keep a fast copy of data fetched from a slower level. | After loading `B0`, later requests in that block hit. |
| **Blocking** | Transfer neighboring locations together. | One four-record load serves several tile requests. |
| **Cache line / page** | Names for blocks at different hierarchy boundaries. | `B0` can model a cache line; a disk-to-RAM block is a page. |
| **Fully associative cache** | Any item may occupy any slot. | Either of two browser-cache slots can hold `P0`. |
| **FIFO** | Evict the oldest arrival. | A hit on `P0` does not save it from eviction. |
| **LRU** | Evict the least recently requested item. | The hit on `P0` makes `P1` the victim. |
| **Random** | Select a resident item randomly. | The final `P0` may hit or miss. |
| **Worst-case cycle** | `m + 1` repeatedly requested pages can defeat an `m`-slot cache. | Three row pages in two slots miss repeatedly. |

[🔝 Back to Top](#top)
