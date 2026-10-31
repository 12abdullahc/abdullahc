<span id="top"></span>

# 11.7 Exercises — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 11, Section 11.7, printed pages 528–534 ([supplied Chapter 11 PDF](<../Data Structures and Algorithms in Python - C11.pdf>)).<br>
> **Topic:** Reinforcement R-11.1–R-11.28; Creativity C-11.29–C-11.60; Projects P-11.61–P-11.70.<br>
> **Domain Focus:** The square-tile catalog from [Section 11.1](11-01-binary-search-trees.md): side length as an ordered key, `(area, stock)` as its value, and the same keys viewed through different search trees.<br>
> **User Prompt:** Reexplain Section 11.7 part by part, with background and simple, connected math-geometry study cases, in the format of `01-01-overview.md`.

---

## Table of Contents

1. [Background & Conceptual Intuition: One Catalog, Several Trees](#background)
   - [1. Reopen the square-tile catalog](#background-catalog)
   - [2. Know what an exercise is asking you to produce](#background-method)
2. [Part 1: Reinforcement, R-11.1–R-11.28](#part-1)
   - [1. Binary-search-tree shapes and search, R-11.1–R-11.6](#part-1-bst)
   - [2. AVL rotations and repairs, R-11.7–R-11.13](#part-1-avl)
   - [3. Splay access patterns, R-11.14–R-11.15](#part-1-splay)
   - [4. (2,4) and red-black representations, R-11.16–R-11.25](#part-1-multiway)
   - [5. Red-black deletion hooks, R-11.26–R-11.28](#part-1-hooks)
3. [Part 2: Creativity, C-11.29–C-11.60](#part-2)
   - [1. Sorting, rotations, and ordered ranges, C-11.29–C-11.36](#part-2-ranges)
   - [2. Counts, metadata, and constant-time neighbors, C-11.37–C-11.46](#part-2-metadata)
   - [3. Tree shapes, joins, and colors, C-11.47–C-11.55](#part-2-joins)
   - [4. Splay variants and position validity, C-11.56–C-11.60](#part-2-splay)
4. [Part 3: Projects, P-11.61–P-11.70](#part-3)
   - [1. Measure and build ordered maps, P-11.61–P-11.68](#part-3-maps)
   - [2. Merge heaps and simulate moving points, P-11.69–P-11.70](#part-3-other)
5. [Part 4: One Connected Geometry Practice Program](#part-4)
   - [1. Build and query the tile tree](#part-4-program)
   - [2. Read its output and limits](#part-4-trace)
6. [Part 5: Simple Geometry Study Cases](#part-5)
7. [Part 6: Summary](#part-6)

---

<span id="background"></span>

## Background & Conceptual Intuition: One Catalog, Several Trees

<span id="background-catalog"></span>

### 1. Reopen the square-tile catalog

The classroom keeps square tiles by **side length**. A side `s` centimetres gives one-tile area `s²` square centimetres. The map key is the side length; its value is `(one-tile area, stock count)`. Start with one tile of each size:

| Side key | 2 cm | 4 cm | 6 cm | 8 cm | 10 cm | 12 cm | 14 cm |
| :------- | ---: | ---: | ---: | ---: | ----: | ----: | ----: |
| One-tile area | 4 cm² | 16 cm² | 36 cm² | 64 cm² | 100 cm² | 144 cm² | 196 cm² |
| Stock | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

The seven one-tile areas total `4 + 16 + 36 + 64 + 100 + 144 + 196 = 560 cm²`. Their familiar binary-search-tree snapshot is:

```text
                  8
                /   \
               4     12
              / \   /  \
             2   6 10  14
```

Its inorder listing is `2, 4, 6, 8, 10, 12, 14`. [Section 11.3](11-03-avl-trees.md) balances binary trees, [Section 11.4](11-04-splay-trees.md) moves accessed keys toward the root, [Section 11.5](<11-05-(2,4)-trees.md>) groups keys in nodes, and [Section 11.6](11-06-red-black-trees.md) uses colors. Those structural changes preserve the side-to-area relationship and the sorted order.

The book's exercises have their **own** keys, figures, and code fragments. The tile catalog below is a connected study case, not a replacement for an exercise's specified input. The PDF supplies exercise prompts; this guide paraphrases their goals and supplies starting methods.

<span id="background-method"></span>

### 2. Know what an exercise is asking you to produce

| Request | What a complete response needs | Tile-catalog habit |
| :------ | :----------------------------- | :----------------- |
| **Draw or trace** | Show the tree after the requested operation or group of operations. | Record the root, child links, colors or multiway boxes after each stage. |
| **Prove or disprove** | Give an invariant and argument, or one valid counterexample. | Small sets such as `{4, 8, 12}` make order effects visible. |
| **Design or implement** | Specify stored fields, update paths, edge cases, and time bound. | Keep key, area, stock, subtree size, and position identity distinct. |
| **Experiment** | Name workloads and measurements, then compare actual runs. | Use the same side-key operation stream for every implementation. |

For a tree of height `h`, a single ordinary search follows at most one root-to-leaf path, so its cost is `O(h)`. For `n` entries, AVL, (2,4), and red-black trees keep logarithmic height; a plain binary search tree or a splay tree can have a linear-height **snapshot**. Splay trees instead provide amortized guarantees over a sequence of operations. A range that reports `s` entries also needs time to output those `s` entries.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Reinforcement, R-11.1–R-11.28

These exercises rehearse the chapter's structures. Draw the book's exact requested inputs when answering the original problems; use the tile steps to understand the method.

<span id="part-1-bst"></span>

### 1. Binary-search-tree shapes and search, R-11.1–R-11.6

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **R-11.1** | Draw the binary search tree after the book's ascending key-and-letter insertions. | Insert tile sides `2, 4, 6` in that order: every next key goes right, creating a chain. |
| **R-11.2** | Draw every intermediate tree for the book's eight insertion keys. | Insert `8, 4, 12, 2` one at a time; redraw the appropriate left or right child after each insertion. |
| **R-11.3** | Count all distinct binary search tree shapes on three ordered keys. | Fix root `4`, `8`, or `12` for `{4,8,12}`; the two extreme-root choices each allow two shapes, giving five total. |
| **R-11.4** | Disprove that insertion order never changes a binary search tree. | `8,4,12` makes root `8` with two children; `4,8,12` makes a right chain. |
| **R-11.5** | Test the same insertion-order claim for AVL trees. | Compare `4,2,6,8` with `6,4,8,2`; both results are AVL, but their roots differ. |
| **R-11.6** | Rewrite the recursive subtree search in Code Fragment 11.4 without recursion. | Walk `8 → 12 → 10` when seeking absent side `9`; return the last visited position `10`, as the fragment does on a miss. |

An AVL balance rule limits *height difference*, not the tree to one unique shape. For the R-11.5 tile sequences, the first result has root `4` and the second root `6`; both contain the same four keys. An iterative search for R-11.6 must retain the fragment's exact return behavior, because `TreeMap` uses the final position after an unsuccessful search.

<span id="part-1-avl"></span>

### 2. AVL rotations and repairs, R-11.7–R-11.13

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **R-11.7** | Classify the trinode restructurings in Figures 11.12 and 11.14 as one or two rotations. | Mark `z`, its taller child `y`, and taller grandchild `x`; aligned links need one rotation, bent links two. |
| **R-11.8** | Insert key `52` into the AVL tree in Figure 11.14(b) and show repair. | On the tile tree, insert `16` under `14` and check heights upward; apply the book's figure for the requested `52`. |
| **R-11.9** | Remove key `62` from Figure 11.14(b) and show any rebalancing. | In the four-key AVL tree with root `4`, left child `2`, and right chain `6 → 8`, delete `2` and rotate `6` above `4`. |
| **R-11.10** | Explain why an array-based binary-tree rotation can take `Ω(n)` time. | Think of moving a whole tile subtree's indexed positions; linked pointers move only a few links, but array indexes may change for many nodes. |
| **R-11.11** | Analyze the deletion-repair schematic in Figure 11.13 when `y`'s two child heights tie. | Draw a small balanced subtree around `z` and track the repaired subtree's height, not just its new root. |
| **R-11.12** | Repeat R-11.11 when `y`'s child heights are unequal. | Compare the height before deletion with the height after restructuring; that decides whether repair must continue upward. |
| **R-11.13** | Explain why a deletion tie chooses the child `x` aligned with `y`. | Test the tied-child diagram both ways and check the heights of the three pieces after rotation. |

The exact labels in R-11.7–R-11.9 and the schematic in R-11.11–R-11.13 come from the cited book figures. For any analogous tile trace, recompute heights after each structural change. In the seven-key tree, inserting `16` gives a right-heavy branch below `14`; inserting `18` next creates a right-right imbalance at `14`, repaired by rotating `16` above `14`. The keys remain sorted, and the added areas are `16² + 18² = 580 cm²`.

<span id="part-1-splay"></span>

### 3. Splay access patterns, R-11.14–R-11.15

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **R-11.14** | Start empty, perform the book's three specified groups of splay insertions, searches, and deletions, and draw after **each group**. | On a separate practice copy, access `14` from the seven-key tree and write each zig-zig rotation before drawing the resulting root. |
| **R-11.15** | Determine the shape after accessing all entries of a splay tree in increasing key order. | Splay `2,4,6,8,10,12,14` in that order; watch each newly accessed maximum become the root. |

For the tile tree, the first access to `14` follows `8 → 12 → 14`. A zig-zig step moves `14` to the root. Accessing all seven sides in increasing order eventually leaves a **left chain** rooted at `14`. That tall final picture does not contradict an amortized bound: it describes one state, while amortized analysis charges a complete operation sequence.

<span id="part-1-multiway"></span>

### 4. (2,4) and red-black representations, R-11.16–R-11.25

A (2,4) node holds one, two, or three keys; its external endpoints all share one depth. A red-black tree represents a multiway node by merging red children with a black parent. For the original seven tiles, one shared representation is:

```text
(2,4):                     red-black:
         [8]                         8B
       /     \                     /    \
 [2 | 4 | 6] [10 | 12 | 14]       4B     12B
                                 / \     /  \
                                2R 6R 10R 14R
```

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **R-11.16** | Test whether the multiway tree in Figure 11.23(a) satisfies the (2,4) rules. | Check each node's child count and whether every conceptual external endpoint is at one depth. |
| **R-11.17** | Find the promoted key for the proposed alternative split of a temporary five-child node. | For an overflow holding `10,12,14,16`, a left node holding `10` and right node holding `14,16` require promoting `12`. |
| **R-11.18** | Disprove insertion-order independence for (2,4) trees. | Insert the same five tile sides in two orders; different four-key overflows can promote different keys. |
| **R-11.19** | Draw four red-black representations of one (2,4) tree. | A 3-node can put its red child on either side; give two different 3-nodes independent orientation choices. |
| **R-11.20** | For keys `1` through `15`, find valid (2,4) trees with the fewest and most nodes. | Count **internal** nodes: all 15 keys fit in 5 three-key nodes, while 15 one-key nodes also form a valid perfect tree. |
| **R-11.21** | Trace the book's specified insertion sequence in both a (2,4) tree and its red-black representation. | After each tile insertion, record the multiway split and the matching color or rotation update. |
| **R-11.22** | Prove or disprove four proposed statements about red-black subtrees, siblings, and the two conversion directions. | Test the root-color rule on a subtree, then remember that a two-key (2,4) node has two valid red-link orientations. |
| **R-11.23** | Explain why BST, AVL, splay, and red-black trees list entries in the same order. | Inorder walk each valid seven-key binary representation: each lists `2,4,6,8,10,12,14`. |
| **R-11.24** | Compare maximum possible heights with 100,000 entries across the chapter's tree types. | Separate plain BST and splay `O(n)` snapshots from AVL, (2,4), and red-black `O(log n)` height guarantees. |
| **R-11.25** | Give a red-black tree that fails AVL balance. | Make black depths equal while allowing a branch with enough red links to make one child subtree two levels taller. |

For R-11.18, the five sides `2,4,6,8,10` inserted in that order yield root `[6]` with leaves `[2|4]` and `[8|10]`. Order `4,6,8,10,2` yields root `[8]` with leaves `[2|4|6]` and `[10]`. For R-11.19, use root `[6|12]` with leaves `[2|4]`, `[8|10]`, and `[14]`. Choose either red-link orientation for the root's two-key node and independently for the left two-key leaf; fixing the middle leaf's orientation gives `2 × 2 = 4` representations.

For R-11.20, the **external endpoint count is fixed** at `n + 1 = 16`. “Fewest and most nodes” must therefore concern internal nodes: `3 + 4 × 3 = 15` keys fit in five three-key nodes, whereas a perfect tree of 15 one-key nodes also works. For R-11.22, a red-black tree determines its associated (2,4) grouping, but one (2,4) tree can have more than one red-black orientation. A red-rooted subtree also needs recoloring before it meets the red-black **root** property on its own. A nonroot node with no sibling must be red: making it black would give its path one extra black level.

<span id="part-1-hooks"></span>

### 5. Red-black deletion hooks, R-11.26–R-11.28

These three prompts justify the cases used by the deletion hook in Section 11.6.2. Let `p` be the parent of the **physically removed** position, after the usual binary-search-tree deletion step. To delete a key with two children, the chapter's `TreeMap` replaces its item with its predecessor's item and physically removes the predecessor position. That position can differ from the requested entry's old position.

| Exercise | What to establish | First step with the tiles |
| :------- | :---------------- | :------------------------ |
| **R-11.26** | If `p` has no children afterward, show the removed node was a red leaf. | Draw `p` and its sole former child; check what deleting a black child would do to black depth. |
| **R-11.27** | If `p` has one child afterward, identify the usual black deficit and the red-leaf exception. | Compare black depths under `p`; if its remaining child is red, recoloring can repair the local depth. |
| **R-11.28** | If `p` has two children afterward, show the removed node was black with one red child. | Only a removed node's surviving child can have filled its slot; use the red and depth rules to determine both colors. |

The stock value `(s²,1)` is irrelevant to these proofs: the outcome depends on **links and colors**. Sketch a parent `p` with its children before and after physical removal, then apply the red-black depth rule to every terminal path.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Creativity, C-11.29–C-11.60

These prompts ask for proofs, counterexamples, augmented maps, and algorithms. A plausible tree picture is useful evidence, but complexity claims need an argument about how much of the tree an operation visits or changes.

<span id="part-2-ranges"></span>

### 1. Sorting, rotations, and ordered ranges, C-11.29–C-11.36

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **C-11.29** | Sort `n` comparable items with an AVL or red-black tree in worst-case `O(n log n)` time. | Insert seven distinct sides, then output inorder; count insertion and traversal work separately. |
| **C-11.30** | Establish a worst-case total sorting bound using a splay tree. | Insert all seven sides and traverse inorder; charge the **whole sequence** using amortized insertion cost. |
| **C-11.31** | Redo C-10.28 for `TreeMap`: make `setdefault` avoid an unnecessary second search. | Search once for side `8`; return its existing area, or insert a missing side at the found boundary. |
| **C-11.32** | Show that `O(n)` rotations can transform one ordered `n`-node binary-tree shape into another with the same inorder entries. | Rotate both seven-key shapes into the same ordered chain, then reverse the target's rotations. |
| **C-11.33** | Prove that, for an absent key, its predecessor and successor lie on its binary-search path. | Seek side `9`: path `8 → 12 → 10 → ∅` contains predecessor `8` and successor `10`. |
| **C-11.34** | Explain why `find_range` in Code Fragment 11.6 costs `O(s + h)` despite calling `after` repeatedly. | Report `[6,13)` as `6,8,10,12`; charge traversed search edges across all successive steps only once. |
| **C-11.35** | Design `remove_range(start, stop)` for a binary search tree in `O(s + h)` time. | Remove the four side keys in `[6,13)` with one initial boundary search and local structural work. |
| **C-11.36** | Give an AVL-tree method for `remove_range` in `O(s log n)` and explain the harder bound. | Delete each of the `s` reported keys with AVL rebalancing; each deletion may repair up a logarithmic path. |

A **range** here is half-open: `[start, stop)` includes `start` and excludes `stop`. For `[6,13)`, `s = 4`. Its keys have one-tile areas `36 + 64 + 100 + 144 = 344 cm²`. The time to *report* those entries is at least `Ω(s)`. For C-11.34, do not multiply a single `after` worst case of `O(h)` by `s`: successive inorder moves share traversed edges in an aggregate traversal.

For C-11.32, rotations preserve inorder order. The two trees therefore need the same inorder entries; rotations can change shape while leaving the side-key ordering intact.

<span id="part-2-metadata"></span>

### 2. Counts, metadata, and constant-time neighbors, C-11.37–C-11.46

A **subtree size** counts entries below a position, including that position. On the initial tile tree, the root's size is `7`, each child subtree has size `3`, and each leaf has size `1`. A **rank** is how many stored keys are smaller than a query key.

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **C-11.37** | Add metadata so `count_range(start, stop)` takes `O(h)` time. | Store subtree sizes and compute `rank(<13) − rank(<6) = 6 − 2 = 4`. |
| **C-11.38** | Maintain the C-11.37 counts in an AVL subclass. | Recompute affected sizes after tile insertion, deletion, and each rotation; leave untouched subtrees alone. |
| **C-11.39** | Construct AVL deletions that need `Ω(log n)` trinode restructurings. | Build repeated height-sensitive levels; make a deletion lower each repaired subtree enough to imbalance its parent. |
| **C-11.40** | Implement AVL balancing with balance factors instead of stored subtree heights. | Store left-height minus right-height as `−1, 0, 1` at stable nodes; update factors after rotations. |
| **C-11.41** | Keep a direct minimum-position reference for worst-case `O(1)` `find_min`. | Point to tile side `2`; update the pointer when `2` is deleted or a new smaller side is inserted. |
| **C-11.42** | Add the C-11.41 minimum reference to an AVL implementation. | Verify rotations do not change the minimum key, while insertion or deletion may change the pointer. |
| **C-11.43** | Make `before(p)` and `after(p)` worst-case `O(1)` while preserving other bounds. | Link the positions in sorted order: `2 ⇄ 4 ⇄ 6 ⇄ 8 ⇄ 10 ⇄ 12 ⇄ 14`. |
| **C-11.44** | Maintain the C-11.43 neighbor links in an AVL tree. | Insert or delete a side in the sorted chain and rebalance the tree; rotations preserve inorder neighbors. |
| **C-11.45** | Use the C-11.43 augmentation to delete a *known position* in `O(1)` in a plain BST. | With `p` already given, reach its predecessor directly, remove the physical one-child-or-leaf node, and splice neighbor links. |
| **C-11.46** | Support `at_index(i)` and `index_of(p)` in `O(h)`. | Use subtree sizes: zero-based `at_index(3)` returns the position holding `8`, and `index_of(position 10) = 4`. |

The `count_range` answer counts **distinct side-key entries**, not physical tile stock. If the stock at side `6` rises from one to three, `count_range(6,13)` remains `4`, although the physical area in that range rises by `2 × 36 = 72 cm²`. For C-11.45, the `O(1)` claim starts with an existing position; locating a key still costs search time.

<span id="part-2-joins"></span>

### 3. Tree shapes, joins, and colors, C-11.47–C-11.55

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **C-11.47** | Construct a splay tree and red-black tree on the same ten entries with identical preorder. | Choose a target preorder, then check both the splay update history and a valid red-black coloring for that shape. |
| **C-11.48** | Show that nodes temporarily unbalanced after AVL insertion need not be consecutive on the insertion-to-root path. | Track height differences at every ancestor after placing a new side, before any repair. |
| **C-11.49** | Show that physical deletion initially creates at most one unbalanced AVL node. | Walk upward from the physical removal: at the first imbalance, the taller child still sets the same subtree height, so higher ancestors do not newly unbalance before repair. |
| **C-11.50** | Join two ordered (2,4) trees whose keys are all separated, in `O(log n + log m)` time. | Put sides `2,4,6` in `T` and `10,12,14` in `U`; join at compatible heights while preserving equal external depth. |
| **C-11.51** | Repeat the C-11.50 join for red-black trees. | Use black-depth-compatible joining and restore root, red, and depth rules. |
| **C-11.52** | Prove Proposition 11.7: `n` entries in a multiway search tree imply `n + 1` external nodes. | The seven-key (2,4) tree has eight empty search intervals; inserting `16` makes eight keys and nine intervals. |
| **C-11.53** | Encode red-black color without extra per-node space when keys are distinct. | Propose an unambiguous representation, then prove color can be recovered and updates preserve it. |
| **C-11.54** | Destructively split a red-black tree around an existing key `k` in `O(log n)` time. | Split at tile side `8` into keys `2,4,6` and `10,12,14`; repair both resulting trees and discard the original tree. |
| **C-11.55** | Prove that every AVL tree admits a valid red-black coloring. | Relate AVL subtree heights to the possible black depths rather than assuming the given drawing is already colored. |

For C-11.50 and C-11.51, the ordered precondition is essential: every key in `T` must be less than every key in `U`. The join or split may change node positions and colors, but it does not change a surviving tile's area. C-11.52 counts conceptual **external** search endpoints, not stored tile entries.

<span id="part-2-splay"></span>

### 4. Splay variants and position validity, C-11.56–C-11.60

| Exercise | What to work out | First step with the tiles |
| :------- | :--------------- | :------------------------ |
| **C-11.56** | Design a one-pass, top-down splay search using zig, zig-zig, and zig-zag steps. | Seek tile side `14` and split the visited path into temporary left and right assemblies before joining them. |
| **C-11.57** | Analyze a half-splay that stops when an accessed depth `d` falls to `⌊d/2⌋`. | Track original depth and final depth separately; amortized analysis concerns the sequence, not one picture. |
| **C-11.58** | Find an access sequence yielding the specified alternating left-right chain in an odd-size splay tree. | Start with a small odd tile-key set, record roots after each access, and build the zig-zag pattern. |
| **C-11.59** | Exhibit a `TreeMap` position that becomes invalid even though its entry remains after deleting a two-child node. | Save the position for side `6`, delete root key `8` using predecessor replacement, then examine the saved position. |
| **C-11.60** | Repair the C-11.59 position-validity flaw. | Preserve the position associated with the surviving side `6` while changing the tree's links and deletion logic. |

For C-11.59, the entry `6` can move into the old root position while the old `6` node is physically removed. A saved position pointing at that old node is invalid even though the **entry** survives. This is a distinction between a map entry and the node that currently stores it. The book's exact implementation determines which position object is invalid; trace its predecessor-swap code before writing the final counterexample.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Projects, P-11.61–P-11.70

Projects require running code, measurements, or a full data-structure design. The table gives a starting plan and keeps cross-chapter dependencies visible.

<span id="part-3-maps"></span>

### 1. Measure and build ordered maps, P-11.61–P-11.68

| Exercise | What to build or measure | Geometry starting plan |
| :------- | :----------------------- | :--------------------- |
| **P-11.61** | Experimentally compare AVL, splay, and red-black map performance on operation sequences. | Replay identical tile-side insert, lookup, and delete workloads; record elapsed time and operation mix. |
| **P-11.62** | Extend P-11.61's comparison with the skip-list map from P-10.53. | Use the same tile keys and random seed for each structure; consult the Chapter 10 project for its implementation requirements. |
| **P-11.63** | Implement the Map ADT of Section 10.1.1 using a (2,4) tree. | Store `side → (side², stock)`; implement search, insertion, deletion, split, transfer, and fusion. |
| **P-11.64** | Extend P-11.63 to all Sorted Map ADT methods from Section 10.3. | Add tile predecessor, successor, range, minimum, and maximum queries using ordered branches. |
| **P-11.65** | Extend P-11.63 with positional `first`, `last`, `before`, `after`, and `find_position`. | Give **each tile entry its own position**, even when keys `2,4,6` share one node. |
| **P-11.66** | Write conversions between red-black trees and corresponding (2,4) trees. | Merge red children into black parents; choose and document one valid orientation when converting back. |
| **P-11.67** | Implement the alternative BST multimap with duplicate keys in distinct nodes, using Code Fragment 10.17's interface. | Store two physical 6-cm tiles as separate nodes and maintain `left ≤ node ≤ right` across updates. |
| **P-11.68** | Implement C-11.56's top-down splay method and experimentally compare it with the chapter's bottom-up method. | Give both versions the same hot-side lookup sequence and report measured time and resulting heights. |

A normal map has one entry per side key; setting side `6` again changes its stored value. P-11.67 intentionally changes that representation to allow several nodes with equal keys. P-11.65 also needs more than a pointer to a **multiway node**: positions must identify individual entries inside a node.

<span id="part-3-other"></span>

### 2. Merge heaps and simulate moving points, P-11.69–P-11.70

| Exercise | What to build | Geometry starting plan |
| :------- | :------------ | :--------------------- |
| **P-11.69** | Describe a concrete mergeable heap supporting `add`, `min`, `remove_min`, and `merge(h)`, each in `O(log n)` for resulting size `n`; merging empties `h`. | Treat tile areas as heap priorities, describe how two tile batches join, and justify each bound. |
| **P-11.70** | Implement the book's “Jumping Leprechauns” simulation with a sorted map of horizon positions. | Represent the horizon as a number line: each point `xᵢ` starts with `gᵢ = 1,000,000` gold, jumps by `r gᵢ` for random `r` between `−1` and `1`, then takes half the gold of its nearest leprechaun on each side. |

P-11.70 is its **own simulation**, not a tile-inventory problem. The geometric link is the ordered one-dimensional coordinate `xᵢ`: predecessor and successor in the sorted map find the nearest leprechauns to the left and right for each gold transfer. Process leprechauns in the order the prompt specifies, updating the sorted map when a position changes. Handle equal coordinates and endpoints deliberately in the implementation; the excerpt does not prescribe a tie rule.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: One Connected Geometry Practice Program

<span id="part-4-program"></span>

### 1. Build and query the tile tree

This small program builds the seven-key **plain** binary search tree shown above. It stores subtree sizes for rank and index queries, and prunes branches during a half-open range query. It is a practice model for C-11.33, C-11.34, C-11.37, and C-11.46, not a substitute for the chapter's AVL, splay, (2,4), or red-black implementations.

```python
class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.size = 1


def size(node):
    return 0 if node is None else node.size


def insert(node, key):
    if node is None:
        return Node(key)
    if key < node.key:
        node.left = insert(node.left, key)
    elif key > node.key:
        node.right = insert(node.right, key)
    node.size = 1 + size(node.left) + size(node.right)
    return node


def search_path(node, key):
    path = []
    while node is not None:
        path.append(node.key)
        if key == node.key:
            break
        node = node.left if key < node.key else node.right
    return path


def in_range(node, start, stop):
    if node is None:
        return
    if start < node.key:
        yield from in_range(node.left, start, stop)
    if start <= node.key < stop:
        yield node.key
    if node.key < stop:
        yield from in_range(node.right, start, stop)


def rank_before(node, key):
    count = 0
    while node is not None:
        if key <= node.key:
            node = node.left
        else:
            count += size(node.left) + 1
            node = node.right
    return count


def at_index(node, index):
    while node is not None:
        left_size = size(node.left)
        if index < left_size:
            node = node.left
        elif index == left_size:
            return node
        else:
            index -= left_size + 1
            node = node.right
    raise IndexError(index)


root = None
for side in (8, 4, 12, 2, 6, 10, 14):
    root = insert(root, side)

selected = list(in_range(root, 6, 13))
print("search for 9:", search_path(root, 9))
print("range [6, 13):", selected)
print("range area:", sum(side * side for side in selected), "cm²")
print("range count:", rank_before(root, 13) - rank_before(root, 6))
print("index 3:", at_index(root, 3).key)
```

<span id="part-4-trace"></span>

### 2. Read its output and limits

```text
search for 9: [8, 12, 10]
range [6, 13): [6, 8, 10, 12]
range area: 344 cm²
range count: 4
index 3: 8
```

The absent-key path ends at `10` because the next left child is empty. The two rank calls count `6` keys below `13` and `2` below `6`, so the difference is `4`. `at_index` uses **zero-based** sorted positions and returns a `Node` position; the print statement reads its key. This code updates sizes only on insertion; a full augmented map must also repair sizes after deletion and rotation. Its height may grow to `n − 1` under sorted insertions because it is an ordinary BST.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Simple Geometry Study Cases

Try each question before opening its work. Each case uses the same side lengths but takes a fresh tree snapshot unless stated otherwise.

<details>
<summary><strong>Case 1 — Can the same tiles make different valid trees?</strong></summary>

**Question.** Insert sides `4, 8, 12` as `8,4,12` and then, in a fresh BST, as `4,8,12`. What changes?

**Work.** The first root is `8` with children `4` and `12`. The second root is `4` with right child `8`, whose right child is `12`. Both inorder walks are `4,8,12`.

**Answer.** The shape and height change, while the keys and area sum `16 + 64 + 144 = 224 cm²` stay the same. This is the counterexample pattern for R-11.4.

</details>

<details>
<summary><strong>Case 2 — Can two insertion orders produce different AVL trees?</strong></summary>

**Question.** Use keys `2,4,6,8` in orders `4,2,6,8` and `6,4,8,2`. Are both results AVL?

**Work.** The first has root `4`, left child `2`, and right branch `6 → 8`. The second has root `6`, right child `8`, and left branch `4 → 2`. At each node, left and right subtree heights differ by at most one.

**Answer.** Both are valid AVL trees with different roots. Their common one-tile area is `4 + 16 + 36 + 64 = 120 cm²`.

</details>

<details>
<summary><strong>Case 3 — What does splaying side 14 change?</strong></summary>

**Question.** Search for `14` in the original seven-key BST and splay the found node.

**Work.** The path is `8 → 12 → 14`, an aligned right-right case. Rotate `12` above `8`, then `14` above `12`. The new root is `14`; its left child is `12`, whose left child is `8`. The subtrees containing `2,4,6,10` remain in sorted places.

**Answer.** A repeat access to `14` meets it at the root. The inorder listing and `560 cm²` total stay unchanged, even though the tree is now taller.

</details>

<details>
<summary><strong>Case 4 — Which key rises when a (2,4) node overflows?</strong></summary>

**Question.** Start from root `[8]` with right leaf `[10|12|14]`. Insert a new 16-cm tile.

**Work.** The leaf temporarily holds `[10|12|14|16]`. The chapter's split promotes `14`, leaving `[10|12]` and `[16]`, so the root becomes `[8|14]`. The alternative split in R-11.17 promotes `12`, leaving `[10]` and `[14|16]`.

**Answer.** Both arrangements preserve search order and equal external depth. The new area total is `560 + 16² = 816 cm²`. The source's specified split choice matters when drawing its requested tree.

</details>

<details>
<summary><strong>Case 5 — Does every red-black tree satisfy AVL balance?</strong></summary>

**Question.** Can the same seven tile keys form a valid red-black tree that is not AVL?

**Work.** Consider `4B` as root, with left child `2B` and right child `10R`. Give `10R` black children `8B` and `12B`; put red `6R` under `8B` and red `14R` under `12B`. Every terminal node has black depth `2`, and red nodes have no red children. The left subtree at the root has height `0` edges; the right has height `2` edges.

**Answer.** Yes. The red-black rules hold, but the root's child subtree heights differ by `2`, violating AVL balance. The tile area remains `560 cm²`.

</details>

<details>
<summary><strong>Case 6 — How many keys and how much area are in a range?</strong></summary>

**Question.** Query `[6,13)` in the seven-key catalog. What do `find_range` and `count_range` answer?

**Work.** The sorted keys inside are `6,8,10,12`. Their one-tile areas sum to `36 + 64 + 100 + 144 = 344 cm²`. There are six keys below `13` and two below `6`.

**Answer.** `find_range` reports four entries and `count_range` returns `6 − 2 = 4`. If stock at side `6` becomes three, the count remains four while physical tile area in the range becomes `344 + 72 = 416 cm²`.

</details>

<details>
<summary><strong>Case 7 — Why can a saved position fail after deletion?</strong></summary>

**Question.** Save a position for side `6` in the original BST, then delete root side `8` using predecessor replacement. Does the saved position necessarily continue to identify the surviving `6` entry?

**Work.** The predecessor of `8` is `6`. Predecessor replacement copies the `6` entry into the root's node, then physically removes the former `6` node. The saved position refers to that removed node.

With the chapter's `TreeMap` class available, an explicit command sequence is:

```python
m = TreeMap()
for side in (8, 4, 12, 2, 6, 10, 14):
    m[side] = (side * side, 1)
saved = m.find_position(6)
del m[8]
print(m[6])       # The entry survives: (36, 1).
m.parent(saved)   # Raises ValueError: the saved position is no longer valid.
```

**Answer.** No. The map still contains side `6` and its `36 cm²` one-tile area, but that saved position is invalid. In this implementation, `saved.key()` may still read the detached node's old item; `m.parent(saved)` checks position validity. This is the C-11.59 issue that C-11.60 asks you to repair.

</details>

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Summary

| Exercise family | Main idea to carry forward | Square-tile check |
| :-------------- | :------------------------- | :---------------- |
| **BST and AVL shapes** | Insertion order can change shape; balancing limits height without fixing a unique tree. | Inorder still lists `2,4,6,8,10,12,14`. |
| **Splay operations** | Accesses restructure the tree; judge sequence bounds separately from one tall snapshot. | Splaying `14` changes the root, not `14² = 196 cm²`. |
| **(2,4) and red-black trees** | Multiway splits and color repairs preserve order while bounding height. | Seven keys give eight external intervals; red links can encode multiway groups. |
| **Augmented maps** | Subtree sizes, neighbor links, and minimum pointers accelerate different questions. | `count_range(6,13) = 4`; `at_index(3)` holds key `8`. |
| **Projects** | Implement the full interface and test with the same workload. | Keep distinct side keys, physical stock, and positional identity separate. |

Return to the [Section 11.1](11-01-binary-search-trees.md) catalog whenever a tree drawing feels abstract: a key is a side length, its value records area and stock, and a tree operation changes how that key is reached. For the book's exact figures and operation sequences, use the [supplied Chapter 11 PDF](<../Data Structures and Algorithms in Python - C11.pdf>).

[🔝 Back to Top](#top)
