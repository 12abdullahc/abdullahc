<span id="top"></span>

# 13.4 Text Compression and the Greedy Method — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 13, Section 13.4, printed pages 601–603 (the supplied PDF).<br>
> **Topic:** 13.4 Text Compression and the Greedy Method; 13.4.1 The Huffman Coding Algorithm; 13.4.2 The Greedy Method.<br>
> **Domain Focus:** Encoding a grid route that traces a 4-by-1 rectangle, then checking its bit count and decoded geometry.<br>
> **User Prompt:** Reexplain [`Section 13.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: A Rectangle Written as Directions](#background)
   - [1. Draw the rectangle](#background-route)
   - [2. Why do the direction counts matter?](#background-counts)
2. [Part 1: 13.4 Text Compression and the Greedy Method](#part-1)
   - [1. From characters to bits](#part-1-bits)
   - [2. Prefix codes and coding trees](#part-1-prefix)
3. [Part 2: 13.4.1 The Huffman Coding Algorithm](#part-2)
   - [1. Repeatedly join the two lightest trees](#part-2-merge)
   - [2. Build a code for the rectangle route](#part-2-tree)
   - [3. Count and read the encoded bits](#part-2-payload)
   - [4. Why this greedy merge works here](#part-2-why)
   - [5. Python code and construction cost](#part-2-code)
4. [Part 3: 13.4.2 The Greedy Method](#part-3)
   - [1. Local choice and global result](#part-3-choice)
   - [2. A geometry calculation where a local choice fails](#part-3-counterexample)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: A Rectangle Written as Directions

<span id="background-route"></span>

### 1. Draw the rectangle

Continue the grid-robot examples from the earlier Chapter 13 notes. The robot starts at `(0, 0)`. Each character is one unit move: `E` east, `N` north, `W` west, or `S` south. Give it this ten-character route:

```text
X = EEEENWWWWS
```

| Commands just followed | Position reached | Geometric role |
| :--------------------- | :--------------- | :------------- |
| None | (0, 0) | Start |
| `EEEE` | (4, 0) | Lower-right corner |
| `N` | (4, 1) | Upper-right corner |
| `WWWW` | (0, 1) | Upper-left corner |
| `S` | (0, 0) | Return to start |

The route traces a **4-by-1 rectangle**. Its perimeter is `4 + 1 + 4 + 1 = 10` grid units, and its area is `4 × 1 = 4` square units. Encoding the directions must preserve their exact order; otherwise the robot could draw a different path.

<span id="background-counts"></span>

### 2. Why do the direction counts matter?

The four directions do not occur equally often:

| Direction | `E` | `W` | `N` | `S` | Total |
| :-------- | --: | --: | --: | --: | ----: |
| Occurrences in `X` | 4 | 4 | 1 | 1 | 10 |

If every direction has a **fixed two-bit codeword**, the ten moves need `10 × 2 = 20` payload bits. Could the common directions use fewer bits and the rare directions use more? That is the compression question in Section 13.4.

> **Mental model:** A codeword represents one source character. Huffman coding chooses the lengths of those codewords from character frequencies, then concatenates them in the original character order.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 13.4 Text Compression and the Greedy Method

<span id="part-1-bits"></span>

### 1. From characters to bits

The section describes compressing a character string `X` into a binary string `Y`. A shorter binary representation can reduce storage and the amount of data transmitted. The book contrasts this goal with fixed-length character representations: traditional ASCII uses 7 bits per character, extended ASCII uses 8, and Unicode was originally proposed with 16 bits per character. Unicode encodings can also use variable-length representations. Our four-direction route uses a simpler **two-bit fixed-code baseline** because it has just four possible symbols.

For each distinct character `c`, let **`f(c)`** be the number of times it appears in `X`, and let **`code(c)`** be its bit string. Every occurrence of `c` contributes `len(code(c))` bits. The total encoded **payload** length is:

```text
sum over distinct c of f(c) × len(code(c))
```

For the rectangle route, `f(E) = f(W) = 4` and `f(N) = f(S) = 1`. A one-bit code for a common direction can save more bits than a one-bit code for a rare direction. We must still be able to read the joined codewords without guessing where one ends and the next begins.

The book illustrates the idea with the 46-character phrase `a fast runner need never be afraid of the dark`, counting spaces as characters. Its figure gives the frequent letter `r` the code `011` and the rare letter `h` the longer code `10111`. Those are the figure's particular bit assignments; the important idea is the relationship between **frequency** and **codeword length**.

<span id="part-1-prefix"></span>

### 2. Prefix codes and coding trees

A **prefix code** does not allow any complete codeword to be the beginning of another codeword. For example, `0` and `01` cannot both be codewords: when we read a leading `0`, we would not know whether to stop or keep reading.

A **binary coding tree** makes the boundary clear. Put characters only at **leaves**; label each left edge `0` and each right edge `1`. A character's codeword is the sequence of edge labels from the root to its leaf. Once we reach a leaf, we have read one complete character and can restart at the root for the next one. No leaf can be an ancestor of another leaf, so no codeword is a prefix of another.

Give each leaf its character frequency. An internal node's frequency is the sum of all leaf frequencies below it. The root frequency is the length of the input string: **10** for our route and **46** for the book's phrase.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 13.4.1 The Huffman Coding Algorithm

<span id="part-2-merge"></span>

### 1. Repeatedly join the two lightest trees

Huffman's algorithm begins with **one single-node tree per distinct character**. A min-priority queue keeps track of each tree's root frequency. Repeatedly remove the two trees with the smallest frequencies, put them below a new parent whose frequency is their sum, and insert that parent tree back into the queue. With `d` distinct characters, exactly **`d - 1` merges** leave one coding tree.

```text
Count each distinct character.
Put one weighted leaf for each character in a min-priority queue.
While more than one tree remains:
    remove the two minimum-frequency trees
    join them below a parent weighted by their frequency sum
    insert the new tree
Read each leaf's code from its root-to-leaf path.
```

The PDF's pseudocode says “for each character” when making the initial trees. The surrounding explanation and `d - 1` merge count require **one tree per distinct character**, using its total frequency. We use that interpretation here.

<span id="part-2-tree"></span>

### 2. Build a code for the rectangle route

The route has four distinct characters, so it starts with four leaves and takes three merges. With a particular choice for equal-frequency ties:

| Merge | Trees joined | New parent frequency | Why this pair? |
| ----: | :----------- | -------------------: | :------------- |
| 1 | `N:1` and `S:1` | 2 | The two smallest leaves. |
| 2 | `(N,S):2` and `E:4` | 6 | The smallest two trees now available; `E` and `W` tie at 4. |
| 3 | `W:4` and `((N,S),E):6` | 10 | The only two trees left. |

Choose left edges as `0` and right edges as `1`. One resulting tree is:

```text
                   (10)
                  /    \
               0 /      \ 1
                W:4      (6)
                        /   \
                     0 /     \ 1
                      (2)    E:4
                     /   \
                  0 /     \ 1
                   N:1    S:1
```

Its codewords are:

| Direction | Frequency | Root-to-leaf code | Bits per occurrence | Frequency × bits |
| :-------- | --------: | :---------------- | ------------------: | ---------------: |
| `W` | 4 | `0` | 1 | 4 |
| `E` | 4 | `11` | 2 | 8 |
| `N` | 1 | `100` | 3 | 3 |
| `S` | 1 | `101` | 3 | 3 |
| **Total** | **10** | | | **18 bits** |

There are other valid Huffman trees because some frequencies tie. Their exact `0` and `1` words can change, while the optimal weighted bit count for these frequencies stays **18**.

<span id="part-2-payload"></span>

### 3. Count and read the encoded bits

Replace each character of `EEEENWWWWS` with its codeword, **keeping the route order**:

```text
Route:     E   E   E   E   N    W  W  W  W  S
Codewords: 11  11  11  11  100  0  0  0  0  101
Payload:   111111111000000101
```

The printed spaces between codewords are only for us; the payload has no separators. Its length is `4 × 2 + 1 × 3 + 4 × 1 + 1 × 3 = 18` bits. A fixed two-bit code for the same four-symbol alphabet would use **20 payload bits** for this route.

There is a second way to check the bit count. Each merge adds one tree edge to every character in the joined trees, increasing the weighted code length by that parent frequency. The merge weights are `2`, `6`, and `10`, and `2 + 6 + 10 = 18` bits.

Because the code is prefix-free, a decoder with the same tree reads bits until it reaches a leaf, outputs that direction, and returns to the root. It recovers **exactly** `EEEENWWWWS`, so the rectangle's perimeter and area are unchanged. The 18-bit figure counts the **encoded route only**. Storing or transmitting the coding tree also takes space; for this tiny example, that overhead may exceed the two saved payload bits.

<span id="part-2-why"></span>

### 4. Why this greedy merge works here

The algorithm's local choice is to combine the **two least frequent** trees now available. The book explains the key optimality idea: there is an optimal prefix-code tree in which the two least frequent characters sit as sibling leaves. Merge them into one weighted surrogate, solve the smaller problem, and then expand that surrogate back into two leaves. Repeating this step constructs an **optimal prefix code for the given character frequencies**.

The book states this result and gives the intuition rather than a full proof. The claim is about minimizing the weighted total `sum f(c) × len(code(c))` among prefix codes. It does not include the cost of describing the tree or guarantee that every short input produces a smaller complete file.

<span id="part-2-code"></span>

### 5. Python code and construction cost

The PDF gives priority-queue pseudocode. This Python version builds the tree and then walks it to obtain codewords. The increasing `serial` value gives heap entries a stable comparison key when frequencies tie.

```python
from collections import Counter
from heapq import heappop, heappush


def huffman_tree(text):
    heap = []
    for serial, (symbol, frequency) in enumerate(sorted(Counter(text).items())):
        heappush(heap, (frequency, serial, symbol))

    if not heap:
        return None

    serial = len(heap)
    while len(heap) > 1:
        left_frequency, _, left = heappop(heap)
        right_frequency, _, right = heappop(heap)
        parent = (left, right)
        heappush(heap, (left_frequency + right_frequency, serial, parent))
        serial += 1
    return heap[0][2]


def codewords(tree):
    result = {}

    def visit(node, bits):
        if isinstance(node, str):
            result[node] = bits or "0"  # convention for a one-symbol input
        else:
            visit(node[0], bits + "0")
            visit(node[1], bits + "1")

    if tree is not None:
        visit(tree, "")
    return result


route = "EEEENWWWWS"
codes = codewords(huffman_tree(route))
payload = "".join(codes[direction] for direction in route)
print(codes)         # {'W': '0', 'N': '100', 'S': '101', 'E': '11'}
print(len(payload))  # 18
```

If `n` is the number of input characters and `d` is the number of distinct characters, counting frequencies takes `O(n)` time. Building the min-heap and making `d - 1` merges take `O(d log d)` time, for **`O(n + d log d)` tree construction** as stated in the book. The tree and heap use `O(d)` nodes or entries. Generating the codeword strings and writing the encoded payload require additional output work; the construction bound alone is not a bound on a complete compressed file.

The empty input has no tree or codewords in this example implementation. For a one-symbol input, the root is already a leaf; we assign that symbol `"0"` so occurrences have a nonempty bit representation. These are practical conventions beyond the section's main algorithm.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 13.4.2 The Greedy Method

<span id="part-3-choice"></span>

### 1. Local choice and global result

A **greedy algorithm** starts from a defined state, then repeatedly chooses the best currently available improvement according to a cost measure. It commits to each choice and continues. For Huffman coding, the local choice is the lowest-frequency pair. Its **greedy-choice property** says this pair can belong together in some optimal coding tree, so committing to that merge does not rule out an optimal final answer.

The book warns that a locally best choice is **not automatically** a globally best solution for every problem. An argument such as the least-frequent-sibling property is needed before using a greedy strategy as an optimality claim.

<span id="part-3-counterexample"></span>

### 2. A geometry calculation where a local choice fails

Recall the matrix-chain problem from Section 13.3. Suppose `A` holds two rows of 2D point coordinates (`2 × 2`), `B` maps two coordinates into four features (`2 × 4`), and `C` maps four features into three outputs (`4 × 3`). A tempting greedy rule is **multiply the cheaper adjacent pair first**:

| First pair | Immediate cost | Total after the remaining multiplication |
| :--------- | -------------: | ---------------------------------------: |
| `AB` | `2 × 2 × 4 = 16` | `(AB)C`: `16 + 2 × 4 × 3 = 40` |
| `BC` | `2 × 4 × 3 = 24` | `A(BC)`: `24 + 2 × 2 × 3 = 36` |

The cheaper **immediate** pair is `AB`, yet choosing `BC` first gives the cheaper **complete** calculation: 36 rather than 40 scalar multiplications. This derived geometry example shows why the greedy rule for Huffman coding needs its own correctness reasoning. The matrix-chain method in Section 13.3 instead checks every final split in a dynamic programming table.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: How can the rectangle route be decoded without spaces?</strong></summary>

**Scenario:** The encoded route is `111111111000000101`, with codewords `W=0`, `E=11`, `N=100`, and `S=101`.

**Problem:** The bits do not contain separators between moves.

**Fix:** Follow the coding tree from its root until a leaf is reached, output that direction, then restart at the root. `11` reaches `E`; `100` reaches `N`; a single `0` reaches `W`; `101` reaches `S`.

**Result:** Decoding gives `E E E E N W W W W S`, the original route. It again traces the 4-by-1 rectangle and ends at `(0, 0)`.

</details>

<details>
<summary><strong>Case Study 2: Does every square route benefit from Huffman coding?</strong></summary>

**Scenario:** The earlier 2-by-2-square route is `EENNWWSS`.

**Problem:** Its four directions each occur twice, so no direction is more frequent than another.

**Fix:** Build a Huffman tree for frequencies `2, 2, 2, 2`. The merges form a balanced tree with two-bit codewords for all four directions.

**Result:** Its eight moves use **16 payload bits**, exactly the same as an ordinary two-bit fixed code. Huffman coding does not guarantee a saving for every frequency distribution.

</details>

<details>
<summary><strong>Case Study 3: Is an 18-bit payload an 18-bit file?</strong></summary>

**Scenario:** The rectangle route's Huffman code has 18 payload bits, two fewer than a fixed two-bit code.

**Problem:** Someone receiving the bits also needs to know the code tree or equivalent codebook.

**Fix:** Count the representation of that codebook, any file header, and any padding needed to store bits in whole bytes when evaluating a complete storage format.

**Result:** The **payload** is 18 bits. The total stored size could exceed the fixed-code alternative for this small route; the section's optimal-prefix-code claim concerns the weighted codeword length for a known frequency distribution.

</details>

<details>
<summary><strong>Case Study 4: What if the route uses only one direction?</strong></summary>

**Scenario:** The route is `EEEE`, four steps east. Its alphabet for this input has one distinct symbol.

**Problem:** A single-leaf Huffman tree has a root-to-leaf path of length zero, which is awkward as an ordinary bit codeword.

**Fix:** The Python example assigns the sole symbol `E` the code `0` as a practical convention.

**Result:** The payload is `0000`. With the codebook and symbol count known, it represents four east moves and ends at `(4, 0)`.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 13.4 idea | Plain-language meaning | Rectangle-route example |
| :---------------- | :--------------------- | :---------------------- |
| **Frequency `f(c)`** | Number of times a character appears. | `E` and `W` occur four times each; `N` and `S` once each. |
| **Prefix code** | No full codeword begins another codeword. | `0`, `11`, `100`, and `101` can be decoded without separators. |
| **Coding tree** | Left/right paths supply bit codewords; leaves hold characters. | The root weight is 10, the number of moves. |
| **Huffman merge** | Repeatedly combine the two least frequent trees. | Merge weights `2`, `6`, and `10` give **18 payload bits**. |
| **Greedy-choice property** | A local choice can be kept in an optimal solution. | The two rare directions can be sibling leaves in an optimal tree. |
| **Construction cost** | Frequency counting plus heap merges. | `O(n + d log d)` for `n` characters and `d` distinct directions. |

The rectangle's route has **10 unit moves**, a **10-unit perimeter**, and **4 square units of area**. Huffman coding changes only its binary representation: this example uses **18 payload bits** instead of **20 fixed-code payload bits**, and decoding restores the same ordered directions.

[🔝 Back to Top](#top)
