<span id="top"></span>

# 11.1 Binary Search Trees — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 11, Section 11.1, printed pages 460–474 ([supplied Chapter 11 PDF](<../Data Structures and Algorithms in Python - C11.pdf>)).<br>
> **Topic:** 11.1 Binary Search Trees; 11.1.1 Navigating a Binary Search Tree; 11.1.2 Searches; 11.1.3 Insertions and Deletions; 11.1.4 Python Implementation; 11.1.5 Performance of a Binary Search Tree.<br>
> **Domain Focus:** Square tiles measured in centimetres; side lengths as ordered keys, areas and stock counts as values, and one catalog we search and update as sizes are added or removed.<br>
> **User Prompt:** Reexplain Section 11.1 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: A Square-Tile Catalog](#background)
   - [1. Turn measurements into map entries](#background-data)
   - [2. Build one search tree for the whole lesson](#background-tree)
2. [Part 1: 11.1 Binary Search Trees](#part-1)
   - [1. The ordering rule applies to whole subtrees](#part-1-rule)
   - [2. Inorder traversal lists keys in order](#part-1-inorder)
3. [Part 2: 11.1.1 Navigating a Binary Search Tree](#part-2)
   - [1. Find the smallest and largest keys](#part-2-extremes)
   - [2. Move to the next or previous key](#part-2-neighbors)
4. [Part 3: 11.1.2 Searches](#part-3)
   - [1. Follow comparisons to an exact key or a miss](#part-3-exact)
   - [2. Ask for a boundary or a range](#part-3-range)
5. [Part 4: 11.1.3 Insertions and Deletions](#part-4)
   - [1. Insert a new size or replace its value](#part-4-insert)
   - [2. Remove a position with zero or one child](#part-4-simple-delete)
   - [3. Remove a position with two children](#part-4-two-child-delete)
6. [Part 5: 11.1.4 Python Implementation](#part-5)
   - [1. Connect tree positions to map entries](#part-5-structure)
   - [2. Follow the helper and public methods](#part-5-methods)
   - [3. Use the tile catalog through `TreeMap`](#part-5-code)
7. [Part 6: 11.1.5 Performance of a Binary Search Tree](#part-6)
   - [1. Relate work to tree height](#part-6-height)
   - [2. Compare a short tree with a chain](#part-6-shapes)
8. [Part 7: Simple Geometry Study Cases](#part-7)
9. [Part 8: Summary](#part-8)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Square-Tile Catalog

<span id="background-data"></span>

### 1. Turn measurements into map entries

The [Section 1.1 guide](../01-python-primer/01-01-overview.md) used rectangular cards and calculated **area = width × height**. Imagine that the same class now keeps square tiles. A square needs only one side measurement, so **area = side × side**. The catalog must answer questions such as “Is there a 6 cm tile?”, “What is the next larger size?”, and “Which sizes fall between 5 cm and 12 cm?”

| Side length (key) | Area of one tile | Tiles in stock | Stored value `(area, stock)` |
| ----------------: | ---------------: | -------------: | :--------------------------- |
| 2 cm | 4 cm² | 1 | `(4, 1)` |
| 4 cm | 16 cm² | 1 | `(16, 1)` |
| 6 cm | 36 cm² | 1 | `(36, 1)` |
| 8 cm | 64 cm² | 1 | `(64, 1)` |
| 10 cm | 100 cm² | 1 | `(100, 1)` |
| 12 cm | 144 cm² | 1 | `(144, 1)` |
| 14 cm | 196 cm² | 1 | `(196, 1)` |

The **key** is the side length. The **value** records the area of one tile and how many tiles of that size are in stock. For example, `6 → (36, 1)` says that a 6 cm square has area `6 × 6 = 36 cm²` and one such tile is available. A map has one entry per **distinct side length**; the stock number represents multiple physical tiles of that size.

<span id="background-tree"></span>

### 2. Build one search tree for the whole lesson

Insert the seven keys in this order: `8, 4, 12, 2, 6, 10, 14`. Place each smaller key to the left of the key being compared and each larger key to its right. The resulting tree is drawn with **keys only**; each position also holds its value from the table.

```text
             8
           /   \
          4     12
         / \   /  \
        2   6 10   14
```

For example, finding the 10 cm tile begins at `8`. Since `10 > 8`, move right to `12`. Since `10 < 12`, move left to `10`. Its stored value is `(100, 1)`, so the tile's area is 100 cm².

This is a **search tree of map entries**, unlike the earlier board-cut tree, whose branches represented physical pieces. The drawing's left and right branches express comparisons between keys. We will keep updating this same catalog in the examples below.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 11.1 Binary Search Trees

<span id="part-1-rule"></span>

### 1. The ordering rule applies to whole subtrees

A **binary search tree (BST)** stores key–value entries in a binary tree. At every position with key `k`:

- **Every** key in its left subtree is smaller than `k`.
- **Every** key in its right subtree is larger than `k`.

The rule is about all descendants, not just the two immediate children. For instance, `6` is in the left subtree of `8`, so `6 < 8`. It is also in the right subtree of `4`, so `6 > 4`. Likewise, `10` must be greater than `8` but less than `12`.

The value does not decide where an entry goes. Our tree is ordered by **side length**, not by stock count. The areas happen to increase with side length here because all side lengths are positive and `s²` increases as `s` increases. A different value, such as color or stock count, would not necessarily increase in tree order.

The strict smaller/larger rule gives one position per key. If the class receives another 6 cm square, it updates the value for key `6`; it does not add a second `6` position.

> **Mental model:** At each position, the key divides the remaining search space into smaller keys on the left and larger keys on the right.

<span id="part-1-inorder"></span>

### 2. Inorder traversal lists keys in order

An **inorder traversal** visits the left subtree, then the current position, then the right subtree. On our tree, that gives:

```text
left of 8:  2, 4, 6
root:       8
right of 8: 10, 12, 14
full order: 2, 4, 6, 8, 10, 12, 14
```

Why must that list be sorted? Recursively, the left subtree produces keys smaller than the root, and the right subtree produces keys larger than the root. Both subtrees obey the same rule, so each produces its own increasing list. Joining **left list → root → right list** gives one increasing list. This is the idea behind Proposition 11.1 in the book.

The catalog can therefore list tile sizes in order without sorting the entries again. Visiting all `n` positions once takes `O(n)` time.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 11.1.1 Navigating a Binary Search Tree

<span id="part-2-extremes"></span>

### 1. Find the smallest and largest keys

Start at the root and repeatedly follow **left** children to reach the smallest key. Follow **right** children to reach the largest key.

| Question | Path in our tree | Answer |
| :------- | :--------------- | :----- |
| Smallest tile size | `8 → 4 → 2` | 2 cm; area 4 cm² |
| Largest tile size | `8 → 12 → 14` | 14 cm; area 196 cm² |

In the book's `TreeMap`, `first()` and `last()` return the corresponding **positions**. Methods such as `find_min()` can instead return a `(key, value)` pair. An empty tree has no first or last position.

<span id="part-2-neighbors"></span>

### 2. Move to the next or previous key

The **successor** of a position is the next key in increasing order; the **predecessor** is the previous key. The book calls the position methods `after(p)` and `before(p)`.

To find `after(p)`:

1. If `p` has a right subtree, go into it and then as far **left** as possible.
2. Otherwise, go **up** until you reach an ancestor from its left side. That ancestor is next.
3. If no such ancestor exists, `p` has the largest key, so the answer is `None`.

| Position | Next position | Why? |
| :------- | :------------ | :--- |
| `4` | `6` | `6` is the leftmost position of `4`'s right subtree. |
| `6` | `8` | `6` has no right subtree; climb past `4` to `8`. |
| `14` | `None` | Nothing is larger. |

`before(p)` is symmetric: use the rightmost position of a left subtree, or climb until you come from an ancestor's right side. Thus `before(8) = 6` and `before(2) = None`.

A single neighbor search can climb the tree's height. Yet walking from `first()` through every successive `after()` visits the entire tree in `O(n)` total time: across the whole walk, each tree edge is traversed only a constant number of times.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 11.1.2 Searches

<span id="part-3-exact"></span>

### 1. Follow comparisons to an exact key or a miss

At a position, compare the requested key with its key. Equality means **found**; a smaller key sends the search left, and a larger key sends it right. Only one branch can still contain the answer.

| Request | Comparisons and path | Result |
| :------ | :------------------- | :----- |
| Find side `10` | `10 > 8`, then `10 < 12`, then `10 = 10` | Return the 10 cm tile with area 100 cm². |
| Find side `5` | `5 < 8`, then `5 > 4`, then `5 < 6` | The left child of `6` is empty: no 5 cm entry yet. |

The book's internal subtree search returns the **last position visited** when the requested key is absent. In the second row that position is `6`. This is useful for attaching a new entry at the empty child. It does **not** mean that key `6` is a successful lookup for key `5`.

The public behavior depends on the method: `find_position(5)` can return that last position, while `catalog[5]` raises `KeyError` when the key is absent. An empty tree has no position to return. The last visited position is not guaranteed to be the numerically closest key: for a request of `8.5`, this tree ends at `10`, though `8` is closer.

<span id="part-3-range"></span>

### 2. Ask for a boundary or a range

A sorted map can answer more than exact-match questions. For a requested side of 9 cm, the first catalog key **greater than or equal to** 9 is `10`; the greatest key **less than** 9 is `8`. Tree comparisons and predecessor/successor navigation find such boundaries without inspecting every tile.

The book's `find_range(start, stop)` returns entries whose keys satisfy **`start ≤ key < stop`**. Before adding any new size:

```text
find_range(5, 12) → sides 6, 8, 10
                     areas 36, 64, 100 cm²
```

The 12 cm tile is excluded because the upper bound is strict. Passing `None` for either boundary leaves that end unbounded. A range search reaches its first possible match and then advances through the matches in order. If it reports `s` entries, its cost is `O(h + s)`, where `h` is tree height.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: 11.1.3 Insertions and Deletions

<span id="part-4-insert"></span>

### 1. Insert a new size or replace its value

To insert, search for the proposed key first. If it already exists, replace its **value** and leave the tree shape alone. For example, receiving two more 6 cm tiles changes the entry from `6 → (36, 1)` to `6 → (36, 3)`. The total area of those three tiles is `3 × 36 = 108 cm²`.

If the key is absent, attach a new position at the empty child where the search stopped. A new 5 cm square has area `5 × 5 = 25 cm²`. The path is `8 → 4 → 6`; since `5 < 6` and the left child of `6` is empty, put `5 → (25, 1)` there:

```text
             8
           /   \
          4     12
         / \   /  \
        2   6 10   14
           /
          5
```

The search rule still holds: `4 < 5 < 6 < 8`. In an empty tree, the first inserted entry becomes the root. After this insertion, `find_range(5, 12)` yields sides `5, 6, 8, 10` and their areas `25, 36, 64, 100 cm²`.

<span id="part-4-simple-delete"></span>

### 2. Remove a position with zero or one child

Deletion removes a **key and its value** from the catalog. Removing a size with stock 3 removes that whole map entry; reducing its stock to 2 would be a value update instead.

Starting from the tree above, make these two changes in order:

1. **Delete the leaf `14`.** It has no child, so remove its link from `12`.
2. **Delete `6`, which has one child, `5`.** Connect `5` directly to `4` as `4`'s right child.

The tree becomes:

```text
             8
           /   \
          4     12
         / \   /
        2   5 10
```

Only the links on the search path and at the removed position change. The sorted keys are now `2, 4, 5, 8, 10, 12`.

<span id="part-4-two-child-delete"></span>

### 3. Remove a position with two children

Now delete key `8`, whose position has both a left and a right child. Simply promoting one child would lose the other subtree. Instead, find `8`'s **immediate predecessor**: the rightmost key of its left subtree, which is `5` in the current tree. Copy the entire `(key, value)` entry for `5` into `8`'s position, then remove the old `5` position.

```text
             5
           /   \
          4     12
         /     /
        2     10
```

The old predecessor has no right child—otherwise a larger key inside the left subtree would have been the predecessor. It can therefore be removed using the zero-or-one-child rule. Copying the **whole entry** matters: key `5` must stay paired with its 25 cm² area, not with the 64 cm² value formerly associated with `8`.

The final inorder keys are `2, 4, 5, 10, 12`, still increasing. Search and insertion follow one downward path. Deletion may continue down into the predecessor's subtree, but that combined route is still bounded by the tree's height, so each operation takes `O(h)` time.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: 11.1.4 Python Implementation

<span id="part-5-structure"></span>

### 1. Connect tree positions to map entries

The book implements a class called `TreeMap` by combining a linked binary tree with its earlier `MapBase` class. A tree **position** identifies a node; the node's element is a map item containing a key and a value. `TreeMap.Position.key()` and `.value()` expose those two parts. Our position for side `5`, for example, stores the entry `5 → (25, 1)`.

These roles are distinct:

| Object or idea | What it identifies | Tile example |
| :------------- | :----------------- | :----------- |
| Key | What comparisons order | Side length `5` cm |
| Value | Information kept with that key | `(25, 1)` = area and stock |
| Position | A place in the linked tree | The left child of position `6` just after insertion |
| Parent/left/right links | How positions connect | `5` is reached from `6` by a left link |

The same key–value mapping can have a different tree shape if entries are inserted in a different order. The position and its links are implementation details; callers use the map operations to get or change values.

<span id="part-5-methods"></span>

### 2. Follow the helper and public methods

The implementation builds larger operations from a few navigation helpers. Here `p` means a position and `k` a requested key.

| Method group | What it does in the tree | Tile-catalog interpretation |
| :----------- | :----------------------- | :-------------------------- |
| `_subtree_search(p, k)` | Descends from `p`; returns an exact hit or the last position before an empty link. | Search for side `5` stops at `6` before insertion. |
| `_subtree_first_position(p)`, `_subtree_last_position(p)` | Walk left or right to an extreme within a subtree. | The whole tree's smallest and largest sides are `2` and `14`. |
| `first()`, `last()`, `before(p)`, `after(p)` | Return positions in key order. | `after(6)` is position `8` in the starting tree. |
| `find_position(k)` | Finds an exact position or the last visited position; returns `None` if empty. | It can supply the parent for a new 5 cm entry. |
| `find_min()`, `find_ge(k)`, `find_range(start, stop)` | Return ordered map entries rather than positions. | `find_ge(9)` returns the 10 cm entry. |
| `find_max()`, `find_lt(k)`, `find_le(k)`, `find_gt(k)` | Give the opposite extreme or other strict/inclusive boundaries; the book names these operations but omits their code bodies here. | `find_lt(9)` would return the 8 cm entry. |
| `__getitem__`, `__setitem__`, `__delitem__` | Implement `M[k]`, `M[k] = v`, and `del M[k]`. | Read, replace/insert, or remove a tile size. |
| `__iter__` | Yields keys in increasing order. A symmetric `__reversed__` could yield them in decreasing order, but its code is omitted in this section. | `list(catalog)` lists available side lengths from smallest. |

The bracket operations require an **exact key**. Reading or deleting a missing key raises `KeyError`. By contrast, a boundary method such as `find_ge(9)` is designed to return a nearby qualifying entry. If no key qualifies, it returns `None`.

The ordinary `TreeMap` also has `_rebalance_access`, `_rebalance_insert`, and `_rebalance_delete` hooks. They do nothing for this basic BST. Later balanced-search-tree classes can override them to repair the shape after an access or update.

<span id="part-5-code"></span>

### 3. Use the tile catalog through `TreeMap`

Assuming the book's `TreeMap` class and its supporting tree/map classes have already been defined, this small client uses the public interface. `TreeMap` is a textbook class, **not** a Python built-in.

```python
catalog = TreeMap()
for side in (8, 4, 12, 2, 6, 10, 14):
    catalog[side] = (side * side, 1)  # (area in cm², stock)

print(catalog[6])                     # (36, 1)
print(catalog.find_ge(9))             # (10, (100, 1))
print([side for side, value in catalog.find_range(5, 12)])
# [6, 8, 10]

catalog[6] = (36, 3)                  # update one value; no new position
catalog[5] = (25, 1)                  # add a new position
print(list(catalog))                  # [2, 4, 5, 6, 8, 10, 12, 14]
```

`find_range` gives `(key, value)` pairs, while iteration over the map gives keys. The code's insertion order creates the tree drawn in the background; replacing the value for key `6` does not change that shape.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: 11.1.5 Performance of a Binary Search Tree

<span id="part-6-height"></span>

### 1. Relate work to tree height

Let `n` be the number of stored keys and `h` the number of **edges** on the longest root-to-leaf path. A search visits at most `h + 1` positions. It cannot inspect both branches at one comparison, so work for one search, insertion, deletion, predecessor, or successor is proportional to the path length: `O(h + 1)`, usually written `O(h)` for nontrivial trees.

| Operation | Time | Reason |
| :-------- | :--- | :----- |
| Exact lookup, insert, delete | `O(h)` | Follow a search path; deletion may also find a predecessor. |
| First/last or one predecessor/successor | `O(h)` | Follow links down or up the tree. |
| Range query returning `s` entries | `O(h + s)` | Reach the first match, then report the matches. |
| Full iteration, including a reverse version if implemented | `O(n)` | Visit every position once in total. |
| Storage | `O(n)` | Keep one linked position per distinct key. |

For a one-position tree, `h = 0` but an operation still takes constant time; the more literal bound is `O(h + 1)`. The book commonly uses `O(h)` as the asymptotic shorthand.

<span id="part-6-shapes"></span>

### 2. Compare a short tree with a chain

Our starting seven-key tree has height `2`: its longest root-to-leaf path has two edges. A search checks at most three positions. If we insert the **same keys in increasing order**—`2, 4, 6, 8, 10, 12, 14`—ordinary BST insertion makes a right-leaning chain:

```text
2
 \
  4
   \
    6
     \
      8
       \
        10
          \
           12
             \
              14
```

That tree has height `6`, and finding `14` checks all seven positions. For `n` keys, a chain has height `n − 1`, so a single search can take `O(n)` time. A short tree has height on the order of `log n`, giving `O(log n)` search paths. With a suitably random sequence of insertions and removals, the book gives an **expected** height of `O(log n)`; ordinary BST updates **do not guarantee** that height. The following sections study trees that rebalance to control height.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: A missing tile size still leaves a useful search path</strong></summary>

**Scenario:** Starting with the seven-key tree, a student asks for a 5 cm square.

**Problem:** The path `8 → 4 → 6` ends at an empty left child. Returning the value for key `6` would incorrectly claim a 5 cm tile exists.

**Fix:** Treat the lookup as absent. `catalog[5]` raises `KeyError`; the last visited position `6` identifies where insertion belongs. Add `5 → (25, 1)` at its left child.

**Result:** The inorder sizes become `2, 4, 5, 6, 8, 10, 12, 14`. The new tile's area is `5 × 5 = 25 cm²`.

</details>

<details>
<summary><strong>Case Study 2: Choose sizes inside a measurement interval</strong></summary>

**Scenario:** After adding the 5 cm tile, choose sizes at least 5 cm but strictly less than 12 cm.

**Problem:** The upper boundary is easy to misread as inclusive.

**Fix:** Use `find_range(5, 12)`, whose test is `5 ≤ side < 12`.

**Result:** The sides are `5, 6, 8, 10` cm, with one-tile areas `25, 36, 64, 100` cm². The 12 cm tile is outside the interval.

</details>

<details>
<summary><strong>Case Study 3: More tiles of one size do not add a search-tree node</strong></summary>

**Scenario:** The class has one 6 cm tile and receives two more.

**Problem:** Three physical tiles might be confused with three map entries that all have key `6`.

**Fix:** Keep one key and change its stock value from `1` to `3`: `catalog[6] = (36, 3)`.

**Result:** The position count and tree shape stay the same. The three tiles cover `3 × (6 × 6) = 108 cm²` in total.

</details>

<details>
<summary><strong>Case Study 4: Delete a size with two subtrees</strong></summary>

**Scenario:** After inserting `5`, removing leaf `14`, and promoting `5` when deleting `6`, remove root key `8`.

**Problem:** The root still has both a left and a right subtree; dropping it would disconnect entries.

**Fix:** Move predecessor entry `5 → (25, 1)` into the root position and delete the old `5` position, which has no right child.

**Result:** The remaining keys are `2, 4, 5, 10, 12` in order. Key `5` still maps to 25 cm², and key `8` is absent.

</details>

<details>
<summary><strong>Case Study 5: Why can the same tile catalog search slowly?</strong></summary>

**Scenario:** One student inserts the seven sizes in the order `8, 4, 12, 2, 6, 10, 14`, producing the short tree shown earlier; another inserts them in increasing order.

**Problem:** Both catalogs hold the same key–value entries, but the second tree is a chain.

**Result:** The first tree has height `2` and finds a key in at most three position checks. The chain has height `6` and may require seven checks. Tree shape, not the geometry formula, determines search cost.

</details>

[🔝 Back to Top](#top)

---

<span id="part-8"></span>

## Part 8: Summary

| Section 11.1 idea | Plain-language meaning | Square-tile example |
| :---------------- | :--------------------- | :------------------ |
| **BST rule** | All left-subtree keys are smaller; all right-subtree keys are larger. | Side `6` is right of `4` but left of `8`. |
| **Key versus value** | Keys control placement; values store associated data. | Key `6` maps to `(36, 3)` after a stock update. |
| **Inorder traversal** | Left, position, right lists keys increasingly. | `2, 4, 6, 8, 10, 12, 14` initially. |
| **Navigation** | Reach extremes or move to adjacent sorted keys. | `after(6) = 8`; `before(8) = 6`. |
| **Search** | Follow one comparison path; a miss stops at an empty link. | Searching for `5` stops below `6` before insertion. |
| **Insertion** | Replace an existing value or attach a new position. | Update stock at `6`; attach new side `5`. |
| **Deletion** | Remove a leaf, promote an only child, or replace a two-child entry with its predecessor. | Delete `14`, then `6`, then `8` in the worked sequence. |
| **Range query** | Report keys from an inclusive start to an exclusive stop. | `[5, 12)` gives `5, 6, 8, 10` after insertion. |
| **Height and time** | Path operations take `O(h)`; a basic BST may become a chain. | Seven keys give height `2` or `6`, depending on insertion order. |

[🔝 Back to Top](#top)
