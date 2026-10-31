<span id="top"></span>

# 13.5 Tries — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 13, Section 13.5, printed pages 604–612 (the supplied PDF).<br>
> **Topic:** 13.5 Tries; 13.5.1 Standard Tries; 13.5.2 Compressed Tries; 13.5.3 Suffix Tries; 13.5.4 Search Engine Indexing.<br>
> **Domain Focus:** Finding grid routes and repeated moves around a 4-by-1 rectangle.<br>
> **User Prompt:** Reexplain [`Section 13.5`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].<br>

---

## Table of Contents

1. [Background & Conceptual Intuition: A Catalog of Grid Routes](#background)
   - [1. Keep the route, not just its endpoint](#background-routes)
   - [2. Ask three different search questions](#background-questions)
2. [Part 1: 13.5 Tries](#part-1)
   - [1. Prepare the collection for many searches](#part-1-purpose)
   - [2. Strings, alphabet, and lengths](#part-1-notation)
3. [Part 2: 13.5.1 Standard Tries](#part-2)
   - [1. Make shared prefixes into shared paths](#part-2-shape)
   - [2. Tell a complete route from a prefix](#part-2-search)
   - [3. Size, time, and a small Python model](#part-2-cost)
   - [4. Matching words in a document](#part-2-words)
4. [Part 3: 13.5.2 Compressed Tries](#part-3)
   - [1. Shorten chains that do not branch](#part-3-compress)
   - [2. Count nodes and store labels as slices](#part-3-space)
   - [3. Search through a multi-character label](#part-3-search)
5. [Part 4: 13.5.3 Suffix Tries](#part-4)
   - [1. Index every starting position of one route](#part-4-suffixes)
   - [2. Compare quadratic input with linear compact space](#part-4-space)
   - [3. Find a repeated geometric move](#part-4-query)
   - [4. Construction cost and match positions](#part-4-build)
6. [Part 5: 13.5.4 Search Engine Indexing](#part-5)
   - [1. Put occurrence lists behind words](#part-5-index)
   - [2. Combine two geometry keywords](#part-5-query)
7. [Part 6: Simple Geometry Study Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Catalog of Grid Routes

<span id="background-routes"></span>

### 1. Keep the route, not just its endpoint

Continue the grid-robot example from Section 13.4. The robot starts at `(0, 0)`, and each character means one unit move: `E` east, `N` north, `W` west, or `S` south. Its route `EEEENWWWWS` traces a 4-by-1 rectangle: four steps east, one north, four west, and one south. The rectangle has perimeter `4 + 1 + 4 + 1 = 10` and area `4 × 1 = 4`.

Now imagine a small catalog of possible walks from the same origin. Some stop at a rectangle corner; others go to nearby points.

| Stored route | Endpoint | Geometric description |
| :----------- | :------- | :-------------------- |
| `E` | `(1, 0)` | First point on the lower edge. |
| `EEEE` | `(4, 0)` | Lower-right corner. |
| `EEEEN` | `(4, 1)` | Upper-right corner. |
| `EEEES` | `(4, -1)` | One step below the lower-right corner. |
| `N` | `(0, 1)` | Upper-left corner. |
| `NE` | `(1, 1)` | First point on the upper edge. |

The **ordered move string** is the item we store. A destination alone would not tell us which path the robot took. The catalog will be our connected example for standard and compressed tries; the full rectangle route will be our example for suffix tries.

<span id="background-questions"></span>

### 2. Ask three different search questions

| Question | Example | Intended answer |
| :------- | :------ | :-------------- |
| **Exact route:** Is this whole string stored? | `EEE` | No. |
| **Prefix:** Does any stored route begin this way? | `EEE` | Yes: `EEEE`, `EEEEN`, and `EEEES`. |
| **Substring:** Does the full rectangle walk contain these consecutive moves anywhere? | `WW` | Yes, three times. |

A trie over the **catalog of complete routes** handles the first two questions. A suffix trie built from **one full route** handles the third. Keeping these two inputs separate will prevent us from confusing a prefix of a stored key with a substring of a longer text.

> **Mental model:** Shared beginnings share a tree path. To search inside one long string at any position, put every suffix of that string into a trie.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 13.5 Tries

<span id="part-1-purpose"></span>

### 1. Prepare the collection for many searches

Section 13.2 studies matching a pattern against text and can prepare the **pattern** before searching. Section 13.5 reverses the situation: we have a relatively fixed collection or text and expect **many later queries**. Spending time to build an index can make those queries easier.

A **trie** (from “retrieval”) is a tree organized by successive characters. Routes beginning with `E` share the first `E` step; routes beginning with `EEEE` share four steps. Instead of writing each route independently, a trie makes each shared prefix one shared path.

The book first indexes a set of complete strings, then saves nodes by compressing paths, then indexes every suffix of a single string, and finally applies a trie to word lookup in a search engine. These are related structures with different search goals.

<span id="part-1-notation"></span>

### 2. Strings, alphabet, and lengths

Let `S` be the set of stored strings, `s = |S|` the number of strings, `Σ` their alphabet, and `n` the sum of their lengths. Our six routes use `Σ = {E, N, W, S}`, although this particular catalog contains no `W`. We will add a special end marker `$` that is **not** a direction, giving an alphabet of five symbols for the marked keys.

The original route lengths add to `1 + 4 + 5 + 5 + 1 + 2 = 18`. After appending one `$` to each of the six routes, their stored lengths add to `n = 18 + 6 = 24`. Whenever we count nodes in this example, `n` means the **marked** strings' total length.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 13.5.1 Standard Tries

<span id="part-2-shape"></span>

### 1. Make shared prefixes into shared paths

In a **standard trie**, the root has no character label. Every other node has **one character**; children of the same parent have different labels. Reading labels from root to a leaf spells one stored string. Shared beginnings use the same nodes.

The book first assumes no stored string is a prefix of another, so every stored string can end at a leaf. Our catalog breaks that assumption: `E` is a prefix of `EEEE`, and `N` is a prefix of `NE`. Appending `$` to **every** route makes `E$` and `EEEE$` distinct leaf paths without changing the routes themselves.

```text
root
├─ E
│  ├─ $ → E
│  └─ E
│     └─ E
│        └─ E
│           ├─ $ → EEEE
│           ├─ N
│           │  └─ $ → EEEEN
│           └─ S
│              └─ $ → EEEES
└─ N
   ├─ $ → N
   └─ E
      └─ $ → NE
```

Each `$` is a leaf marking a complete route. The labels after arrows tell us **which unmarked route** that leaf represents; they are not extra tree nodes. The six routes therefore give six leaves. The book's Figure 13.10 uses the words `bear`, `bell`, `bid`, `bull`, `buy`, `sell`, `stock`, and `stop` to show the same sharing of word beginnings.

<span id="part-2-search"></span>

### 2. Tell a complete route from a prefix

For an **exact** search, start at the root and follow one child for each character, then require the end marker `$`. For a **prefix** search, follow only the proposed prefix; any reachable path can lead to stored routes. A missing child ends either search immediately.

| Query | Exact stored route? | Prefix of a stored route? | Reason |
| :---- | :------------------ | :------------------------ | :----- |
| `E` | Yes | Yes | `E$` is a leaf; longer `E...` routes also exist. |
| `EEE` | No | Yes | The path exists, but there is no `$` after three `E` moves. |
| `EW` | No | No | No `W` child follows the first `E`. |

This is the same distinction as the book's examples: `bull` reaches a leaf, `be` stops at an internal node, and `bet` meets a missing branch. To **list** every route with a prefix, visit the leaves below its path; the list itself takes extra time to produce.

<span id="part-2-cost"></span>

### 3. Size, time, and a small Python model

For `s` strings with total stored length `n`, Proposition 13.6 gives a standard trie's height as the longest string length, no more than `|Σ|` children per internal node, exactly `s` leaves, and at most `n + 1` nodes. Our marked keys have maximum length `6` and `n = 24`, so the general bound is `25` nodes. Sharing prefixes leaves this particular trie with **15 nodes**.

If a query has `m` characters and the alphabet has `d` symbols, finding the next child at each level depends on how children are stored:

| Child lookup | Search cost | Tradeoff |
| :----------- | :---------- | :------- |
| Scan child labels | `O(md)` | Simple representation. |
| Balanced search structure | `O(m log d)` | Ordered child lookup. |
| Hash table | Expected `O(m)` | Average-case lookup. |
| Direct array by alphabet symbol | `O(m)` | Extra space at nodes. |

The following small Python model uses dictionaries for child lookup. It makes the `$` leaf explicit.

```python
END = "$"
routes = {"E", "EEEE", "EEEEN", "EEEES", "N", "NE"}
root = {}


def add_route(trie, route):
    node = trie
    for symbol in route + END:
        node = node.setdefault(symbol, {})


def walk(trie, symbols):
    node = trie
    for symbol in symbols:
        node = node.get(symbol)
        if node is None:
            return None
    return node


def has_route(trie, route):
    return walk(trie, route + END) is not None


def routes_with_prefix(trie, prefix):
    node = walk(trie, prefix)
    if node is None:
        return []

    found = []

    def collect(current, spelling):
        if END in current:
            found.append(spelling)
        for symbol, child in sorted(current.items()):
            if symbol != END:
                collect(child, spelling + symbol)

    collect(node, prefix)
    return found


for route in routes:
    add_route(root, route)

print(has_route(root, "E"))             # True
print(has_route(root, "EEE"))           # False
print(routes_with_prefix(root, "EEE"))  # ['EEEE', 'EEEEN', 'EEEES']
```

With dictionary child lookup, inserting a route of length `m` takes expected `O(m)` time, and inserting all routes takes expected `O(n)` time. Finding the prefix path takes expected `O(m)`; `routes_with_prefix` then also visits and outputs matching descendants. These expectations rely on hash-table behavior, not on the shape of the rectangle.

<span id="part-2-words"></span>

### 4. Matching words in a document

The book also applies a standard trie to words extracted from a document. A leaf can store the positions where its word occurs; its example records `stock` at positions `17, 40, 51, 62`. An exact query finds a word's leaf, while a prefix query can collect leaves below a shared prefix.

This **word trie** indexes whole words. It does not automatically find a pattern in the middle of a word or across word boundaries. That different search question motivates suffix tries in Part 4.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 13.5.2 Compressed Tries

<span id="part-3-compress"></span>

### 1. Shorten chains that do not branch

In the standard trie, the path from the first `E` node through the next three `E` nodes has a stretch where each intermediate node has only one child. Those nodes do not represent a choice. A **compressed trie**, also called a **Patricia trie**, replaces such a one-child chain with one multi-character label.

Here is the same catalog with character sequences written **on edges** for readability. The book equivalently puts each sequence at the child node.

```text
root
├─ "E" → u
│        ├─ "$"   → E
│        └─ "EEE" → v
│                    ├─ "$"  → EEEE
│                    ├─ "N$" → EEEEN
│                    └─ "S$" → EEEES
└─ "N" → w
         ├─ "$"  → N
         └─ "E$" → NE
```

For example, the path for `EEEEN$` reads `E`, then `EEE`, then `N$`. It still spells the same marked key. Compression changes how we **group** characters in the tree; it does not change any route.

<span id="part-3-space"></span>

### 2. Count nodes and store labels as slices

The standard diagram has **15 nodes**. The compressed one has **10**: one root, three branching internal nodes (`u`, `v`, `w`), and six leaves. Proposition 13.7 states the general result: a compressed trie has `s` leaves and `O(s)` nodes because its nonroot internal nodes no longer have just one child. The root can be an exception when every string begins with the same character.

An `O(s)` **node count** does not by itself mean that copied label text needs only `O(s)` characters. The book keeps the original strings in a primary array and stores each compressed label as a reference to a slice. Let an array `A` hold our marked keys in the table's order, so `A[2] = EEEEN$`. Then `A[2][1:4] = EEE` supplies the long middle label; the reference can be written `(2, 1:4)`. Each label reference takes constant space, giving `O(s)` trie nodes and references **in addition to** the stored strings. Copying every long label could use more character space.

<span id="part-3-search"></span>

### 3. Search through a multi-character label

A query must compare **every character** of each compressed label it traverses. The prefix `EEE` reads the initial edge `E` and then stops after two characters of the `EEE` edge. It is a valid prefix of three catalog routes even though it stops **inside** an edge. It is not an exact stored route, because no `$` follows it there.

Compression saves nodes; it does not automatically reduce the number of characters compared. With hashed child selection, tracing `m` query characters is still expected `O(m)` before any matching routes are listed. The book compresses its word example too: `stock` and `stop` continue to share their beginning `sto`.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 13.5.3 Suffix Tries

<span id="part-4-suffixes"></span>

### 1. Index every starting position of one route

Our catalog trie searches **beginnings of stored routes**. To find a move pattern anywhere in one long route, use the full rectangle walk

```text
Index:  0 1 2 3 4 5 6 7 8 9
Move:   E E E E N W W W W S
X = EEEENWWWWS
```

Here `n = |X| = 10` means the length of this one rectangle route; in Parts 1–3, `n = 24` meant the total length of the marked catalog keys. A **suffix** `X[j:n]` starts at index `j` and runs to the end. A suffix trie stores all `n` nonempty suffixes, one for each `j = 0, ..., n - 1`. As with the route catalog, append a fresh `$` to each suffix so each complete suffix has its own leaf.

| Start `j` | Suffix before marker | Marked key |
| --------: | :------------------- | :--------- |
| 0 | `EEEENWWWWS` | `EEEENWWWWS$` |
| 4 | `NWWWWS` | `NWWWWS$` |
| 5 | `WWWWS` | `WWWWS$` |
| 6 | `WWWS` | `WWWS$` |
| 7 | `WWS` | `WWS$` |
| 8 | `WS` | `WS$` |
| 9 | `S` | `S$` |

The omitted table rows are the suffixes starting at indices `1`, `2`, and `3`. The book's Figure 13.14 uses the eight suffixes of `minimize` to demonstrate the same construction.

<span id="part-4-space"></span>

### 2. Compare quadratic input with linear compact space

If we write all suffixes separately, their direction-character counts are `10 + 9 + ... + 1 = 10(11)/2 = 55`, plus ten end markers. In general that sum is `n(n + 1)/2 = Θ(n²)`. A plain, explicit suffix trie can therefore have quadratic size.

The **compressed suffix trie** shares prefixes and stores long labels as slices of the augmented text `T = X + "$"`, so a label can include the end marker. Proposition 13.8 gives **`O(n)` space** for its nodes and slice references; keeping `T` itself also takes `O(n)` space. A label such as `(j, k)` refers to `T[j:k]` rather than making a second copy of those characters. This structure is also called a **suffix tree** or **position tree**.

<span id="part-4-query"></span>

### 3. Find a repeated geometric move

A pattern `P` occurs inside `X` exactly when `P` can be followed as a prefix of **some suffix**. We may finish at a node or partway through a compressed label.

The two-west pattern `WW` occurs three times along the rectangle's upper edge:

| Start index | Starting point before `WW` | Point after two west steps |
| ----------: | :-------------------------- | :------------------------- |
| 5 | `(4, 1)` | `(2, 1)` |
| 6 | `(3, 1)` | `(1, 1)` |
| 7 | `(2, 1)` | `(0, 1)` |

The pattern `NWW` occurs only at index `4`, from `(4, 0)` to `(2, 1)`. In a compressed suffix trie, its search can stop inside the long label for the unique suffix `NWWWWS$`. `WWN` does not occur: the north move comes **before** the westward run.

<span id="part-4-build"></span>

### 4. Construction cost and match positions

The compact **space** bound does not make a simple insertion algorithm linear-time. Inserting all suffixes one at a time with basic child scanning takes `O(|Σ|n²)` time in the book's analysis. More specialized `O(n)` construction algorithms exist, but the section does not develop them. Once built, following a length-`m` pattern compares its `m` characters; reporting every occurrence also takes time for the results.

Suffix leaves can record their starting indices. The book also explains a way to recover **one** occurrence from a slice label: if a root-to-node spelling `Y` has length `y` and its final slice ends at text offset `k`, then `Y = T[k-y:k]`, so that occurrence begins at `k-y`. For the leaf spelling `NWWWWS$`, `k = 11` and `y = 7` in our augmented text, giving `11 - 7 = 4`. Finding **all** occurrences of a shorter pattern such as `WW` requires collecting the relevant suffix starts, here `5, 6, 7`.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 13.5.4 Search Engine Indexing

<span id="part-5-index"></span>

### 1. Put occurrence lists behind words

The book's final application is a simplified web search engine. It collects pages, extracts words, and builds an **inverted index**: each word `w` leads to a list `L(w)` of pages containing that word. A compressed trie stores the distinct words; each word leaf points to its occurrence list in a separate array. Large lists can live on disk while the smaller word trie stays in memory.

For a tiny geometry version, imagine three searchable map cards:

| Card | Route discussed | Indexed words |
| :--- | :-------------- | :------------ |
| `P1` | `EEEE` along the lower edge | `rectangle`, `east` |
| `P2` | `EEEEN` to the upper-right corner | `east`, `north` |
| `P3` | `EEEENWWWWS` around the rectangle | `rectangle`, `east`, `north` |

Their inverted lists are `L(east) = [P1, P2, P3]`, `L(north) = [P2, P3]`, and `L(rectangle) = [P1, P3]`. The trie finds the word; the list tells us **which cards** contain it. These word lists are different from the suffix start indices in Part 4.

<span id="part-5-query"></span>

### 2. Combine two geometry keywords

A query for **both** `rectangle` and `north` intersects the two occurrence lists:

```text
L(rectangle) ∩ L(north)
= [P1, P3] ∩ [P2, P3]
= [P3]
```

Only `P3` contains both words. Keeping lists sorted or in searchable maps helps compute intersections. A real search engine also ranks results by relevance; the trie and occurrence lists here answer the simpler question of **which pages qualify**.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: Is a path prefix also a complete route?</strong></summary>

**Scenario:** The robot has stored `E` and `EEEE`, among other routes.

**Problem:** `E` ends a real route but is also the beginning of a longer one.

**Fix:** Store `E$` and `EEEE$`. For an exact search, require the end marker. For a prefix search, follow only the direction letters.

**Result:** `E` is both an exact route and a prefix; `EEE` is a prefix of three routes but is not an exact route.

</details>

<details>
<summary><strong>Case Study 2: What does a compressed path save?</strong></summary>

**Scenario:** The catalog contains `EEEE`, `EEEEN`, and `EEEES`.

**Problem:** Several consecutive `E` nodes have no choice to make.

**Fix:** Replace their one-child chain with the label `EEE` while retaining the branching point after the fourth east move.

**Result:** This catalog uses 10 compressed-trie nodes instead of 15 standard-trie nodes. Searching `EEE` still compares three `E` characters and stops inside the long label.

</details>

<details>
<summary><strong>Case Study 3: Where are two consecutive west steps?</strong></summary>

**Scenario:** The full rectangle route is `EEEENWWWWS`.

**Problem:** `WW` is not a prefix of the whole route, so a trie containing only that one complete route does not answer this substring query.

**Fix:** Index all ten terminated suffixes, then follow `WW` in their suffix trie and collect matching suffix starts.

**Result:** Starts `5`, `6`, and `7` each describe two west steps on the upper edge; the three segments end at `(2, 1)`, `(1, 1)`, and `(0, 1)`.

</details>

<details>
<summary><strong>Case Study 4: Which card discusses both the rectangle and north?</strong></summary>

**Scenario:** Three map cards have word lists `L(rectangle) = [P1, P3]` and `L(north) = [P2, P3]`.

**Problem:** A two-word query needs cards containing **both** words.

**Fix:** Find each word in the compressed term trie, then intersect the associated occurrence lists.

**Result:** The intersection is `[P3]`, the card about the full rectangle walk.

</details>

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

| Section 13.5 idea | What is indexed? | Geometry search it answers |
| :---------------- | :--------------- | :------------------------- |
| **Standard trie** | Complete route strings, one character per nonroot node. | Is `EEEEN` stored? Is `EEE` a route prefix? |
| **End marker** | A unique symbol after every stored route. | Distinguish stored `E` from longer routes starting with `E`. |
| **Compressed trie** | The same routes with one-child chains grouped into labels. | Follow `EEE` through a long edge using fewer nodes. |
| **Suffix trie** | Every suffix of the full rectangle route. | Find `WW` at starts `5`, `6`, and `7`. |
| **Inverted index** | Words mapped to lists of map cards. | Find cards containing both `rectangle` and `north`. |

Our **six-route catalog** has 15 standard-trie nodes or 10 compressed-trie nodes. The **ten-move rectangle walk** has ten suffixes and three occurrences of `WW`. The choice of what to index follows the question: whole route, route beginning, move sequence anywhere, or words shared by map cards.

[🔝 Back to Top](#top)
