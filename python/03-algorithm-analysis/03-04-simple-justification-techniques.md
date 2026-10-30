<span id="top"></span>

# 3.4 Simple Justification Techniques — A Geometry Study Guide

> **Source Article:** Michael T. Goodrich, Roberto Tamassia, and Michael H. Goldwasser, _Data Structures and Algorithms in Python_, Chapter 3, Section 3.4, printed pages 137–140 (the supplied PDF).  
> **Topic:** 3.4 Simple Justification Techniques; 3.4.1 By Example; 3.4.2 The “Contra” Attack; 3.4.3 Induction and Loop Invariants.  
> **Domain Focus:** Rectangular cards with integer side lengths; area parity, a staircase of strips, card groupings, and a search for the first matching area.  
> **User Prompt:** Reexplain [`Section 3.4`] part by part, with background and simple, connected math-geometry study cases, in the format of [`01-01-overview.md`].

---

## Table of Contents

1. [Background & Conceptual Intuition: What Makes a Claim True?](#background)
   - [1. Continue the rectangle-card workshop](#background-cards)
   - [2. Separate examples, universal claims, and algorithm claims](#background-claims)
2. [Part 1: 3.4.1 By Example](#part-1)
   - [1. Prove an existence claim with a witness](#part-1-witness)
   - [2. Refute a universal claim with a counterexample](#part-1-counterexample)
3. [Part 2: 3.4.2 The “Contra” Attack](#part-2)
   - [1. Prove an implication by its contrapositive](#part-2-contrapositive)
   - [2. Negate compound claims with De Morgan’s laws](#part-2-demorgan)
   - [3. Prove an odd-area claim by contradiction](#part-2-contradiction)
4. [Part 3: 3.4.3 Induction and Loop Invariants](#part-3)
   - [1. The induction template](#part-3-induction)
   - [2. Bound the number of card groupings](#part-3-fibonacci)
   - [3. Prove the staircase-area formula](#part-3-staircase)
   - [4. The loop-invariant template](#part-3-invariant)
   - [5. Prove a first-area search correct](#part-3-find)
5. [Part 4: Simple Geometry Study Cases](#part-4)
6. [Part 5: Summary](#part-5)

---

<span id="background"></span>

## Background & Conceptual Intuition: What Makes a Claim True?

<span id="background-cards"></span>

### 1. Continue the rectangle-card workshop

In [Section 3.1](03-01-experimental-studies.md), we measured work on rectangular cards. [Section 3.2](03-02-the-seven-functions-used-in-this-book.md) introduced growth functions, and [Section 3.3](03-03-asymptotic-analysis.md) used them to bound work. Now we must **justify** statements such as “this result is correct for every allowed input.” Our familiar cards are:

| Card | Width | Height | Area |
| :--- | ----: | -----: | ---: |
| `A` | 2 cm | 3 cm | 6 cm² |
| `B` | 4 cm | 2 cm | 8 cm² |
| `C` | 4 cm | 4 cm | 16 cm² |
| `D` | 5 cm | 4 cm | 20 cm² |

For the parity examples, widths and heights are **positive whole numbers of centimetres**. Thus each dimension and its area is either odd or even. The workshop can make more cards with other dimensions; checking only `A` through `D` would not prove a claim about **every** possible card.

For algorithm examples, `n` is the number of cards. A card’s area is measured in cm², while `n`, comparisons, and loop iterations are counts without area units. When we prove a geometric formula, `n` can also count the number of strips being assembled; the meaning will be stated at that point.

<span id="background-claims"></span>

### 2. Separate examples, universal claims, and algorithm claims

An **example** shows what happens for one valid choice. A **proof** explains why a claim follows for every choice covered by that claim. The kind of claim determines what evidence is enough:

| Form of claim | What is enough? | Card-workshop example |
| :--- | :--- | :--- |
| “There exists a card with property `P`.” | Produce one such card. | `C` has an area divisible by 4: `16 = 4 × 4`. |
| “Every card has property `P`.” | Prove it for an arbitrary allowed card. | For whole-number sides, an odd area requires two odd sides. |
| “Not every card has property `P`.” | Produce one counterexample. | `A` has even area but does not have two even sides. |
| “This algorithm always returns the first matching card.” | Show why every path through the algorithm gives that result. | Track which earlier cards a scan has ruled out. |

The techniques below provide these missing reasons. In particular, a few successful program runs cannot establish an “every input” claim. A claim about **running speed** also needs a bound on the work over the relevant input sizes, as in Section 3.3.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: 3.4.1 By Example

<span id="part-1-witness"></span>

### 1. Prove an existence claim with a witness

An existence claim says **at least one** object has a property. To prove it, name a valid object and check the property. For example:

```text
Claim: Some workshop card has area divisible by 4.
Witness: Card C is 4 cm × 4 cm, so its area is 16 cm² = 4 × 4 cm².
```

The witness must meet **all** conditions in the claim. A card from another workshop would not prove a claim limited to these four cards, and an area calculation alone would not prove a claim about a card’s width.

<span id="part-1-counterexample"></span>

### 2. Refute a universal claim with a counterexample

A universal claim says **every** object in a specified set has a property. To show it is false, find **one allowed object** without the property. Consider this tempting statement:

```text
False claim: Every card with even area has both an even width and an even height.
Counterexample: A is 2 cm × 3 cm. Its area is 6 cm² (even), but 3 is odd.
```

The book’s Example 3.17 uses the same logic in number theory. It refutes the claim that `2^i − 1` is prime for every integer `i > 1`. At `i = 4`, the value is `2⁴ − 1 = 15 = 3 × 5`, which is composite. We can **picture the factorization** with a new 3 cm × 5 cm rectangular card: its 15 unit squares form three rows of five. One value of `i` defeats the universal claim.

An example supporting a universal claim does not prove it. All four displayed cards have even areas, yet the 3 cm × 5 cm card has odd area. The four examples cannot settle a claim about **all** possible rectangular cards.

> **Mental model:** A witness proves “there is one.” A counterexample disproves “there are no exceptions.”

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: 3.4.2 The “Contra” Attack

<span id="part-2-contrapositive"></span>

### 1. Prove an implication by its contrapositive

An implication has the form **“if `p`, then `q`.”** Its **contrapositive** is “if **not `q`**, then **not `p`**.” These statements are logically equivalent: proving the second proves the first. The book’s Example 3.18 becomes a claim about a whole-number-width card:

```text
Original:       If area w × h is even, then w is even or h is even.
Contrapositive: If w is odd and h is odd, then area w × h is odd.
```

To prove the contrapositive, write the two odd side lengths as `w = 2j + 1` and `h = 2k + 1` for whole numbers `j` and `k`. Multiply:

```text
w × h = (2j + 1)(2k + 1)
      = 4jk + 2j + 2k + 1
      = 2(2jk + j + k) + 1.
```

The product is one more than an even number, so it is odd. Therefore an even-area card **cannot** have both sides odd; at least one side must be even. For a small check, a 3 cm × 5 cm card has odd area `15 cm²`.

<span id="part-2-demorgan"></span>

### 2. Negate compound claims with De Morgan’s laws

Moving from the original claim to its contrapositive requires negating the **whole** conclusion. De Morgan’s laws tell us how the words **or** and **and** change:

| Original condition | Its negation | Geometry reading |
| :--- | :--- | :--- |
| `P or Q` | `not P and not Q` | “Width even **or** height even” becomes “width odd **and** height odd.” |
| `P and Q` | `not P or not Q` | “Width odd **and** height odd” becomes “width even **or** height even.” |

Here each side is a whole number, so “not even” means odd and “not odd” means even. Negating “width even **or** height even” as “width odd **or** height odd” would be wrong: card `A` has even width and odd height, so the original condition is true for `A`.

<span id="part-2-contradiction"></span>

### 3. Prove an odd-area claim by contradiction

To prove a claim by **contradiction**, assume the claim is false and show that this makes an impossibility. The starting conditions must themselves be consistent. The book’s Example 3.19 says: **if `w × h` is odd, then both `w` and `h` are odd**. Our 3 cm × 5 cm card shows that an odd-area starting condition is possible.

Assume `w × h` is odd, but the conclusion is false. By De Morgan’s law, **at least one** of `w` and `h` is even. The two cases are symmetric, so take `w = 2j`:

```text
w × h = (2j)h = 2(jh), which is even.
```

The same area cannot be odd and even. Therefore the assumption that the conclusion is false must be rejected: **both sides are odd**. If the even side were `h` instead, the calculation would be `w(2k) = 2(wk)` and give the same contradiction.

The contrapositive proof and the contradiction proof establish related parity facts, but their **assumptions differ**. In a contradiction proof of “if `p`, then `q`,” we assume `p` **and** `not q` before deriving the conflict.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: 3.4.3 Induction and Loop Invariants

<span id="part-3-induction"></span>

### 1. The induction template

A statement such as “the formula works for every integer `n ≥ 1`” covers infinitely many sizes. Checking a few sizes cannot finish the job. **Mathematical induction** provides a reusable proof pattern:

| Stage | What to show | Why it matters |
| :--- | :--- | :--- |
| **Base case** | Prove the first required size, often `n = 1`. | Starts the chain with a known true statement. |
| **Induction step** | For `n` beyond the base cases, assume the needed smaller claims and prove the claim for `n`. | Extends the chain to the next size. |
| **Conclusion** | Every `n ≥ 1` can be reached from the base cases by finitely many steps. | Covers all allowed sizes. |

The section uses **strong induction**: when proving the claim for `n`, we may assume it for every positive integer `j < n`. Some recurrences need more than one earlier value. A formula that uses only the `n − 1` case needs only ordinary induction. The next two examples show both situations.

<span id="part-3-fibonacci"></span>

### 2. Bound the number of card groupings

Line up `n` rectangular cards in a fixed order. Draw brackets around each card alone or around **two neighboring cards** as one group. The cards’ dimensions do not affect these adjacency choices. Let `F(n)` count the ways to divide the entire row into groups:

| Number of cards `n` | Possible groupings | `F(n)` |
| ---: | :--- | ---: |
| 1 | `[A]` | 1 |
| 2 | `[A][B]`, `[AB]` | 2 |
| 3 | `[A][B][C]`, `[AB][C]`, `[A][BC]` | 3 |
| 4 | `[A][B][C][D]`, `[AB][C][D]`, `[A][BC][D]`, `[A][B][CD]`, `[AB][CD]` | 5 |

For `n > 2`, the first group holds **one** card, leaving `n − 1` cards, or **two** cards, leaving `n − 2`. These cases do not overlap and cover every grouping:

```text
F(1) = 1,    F(2) = 2,    F(n) = F(n − 1) + F(n − 2) for n > 2.
```

This is the book’s shifted Fibonacci definition in Proposition 3.20. It claims **`F(n) < 2^n`** for every `n ≥ 1`. A proof needs **two** base cases because the recurrence reaches back two positions:

```text
n = 1: F(1) = 1 < 2¹ = 2.
n = 2: F(2) = 2 < 2² = 4.
```

For `n > 2`, assume `F(j) < 2^j` for every positive `j < n`. In particular, this holds for `n − 1` and `n − 2`. Then:

```text
F(n) = F(n − 1) + F(n − 2)
     < 2^(n−1) + 2^(n−2)
     = 3 · 2^(n−2)
     < 4 · 2^(n−2) = 2^n.
```

That completes the induction. **`F(n)` counts possible groupings**, not the running time of an unspecified program that generates them. A runtime claim would need an algorithm and a count of its operations.

<span id="part-3-staircase"></span>

### 3. Prove the staircase-area formula

[Section 3.2](03-02-the-seven-functions-used-in-this-book.md) pictured a staircase made from `n` unit-width rectangular strips of heights `1, 2, ..., n` cm. Its total area is `1 + 2 + ... + n` cm². Proposition 3.21, the same identity as Proposition 3.3, proves:

```text
1 + 2 + ... + n = n(n + 1)/2.
```

Let `P(n)` mean that this formula gives the staircase’s area for `n` strips.

1. **Base, `n = 1`:** One 1 cm × 1 cm strip has area `1 cm²`, and `1(1 + 1)/2 = 1`.
2. **Step, `n ≥ 2`:** Assume the first `n − 1` strips have area `(n − 1)n/2`. Add the `n`th strip, whose area is `n cm²`:

   ```text
   (n − 1)n/2 + n = (n² − n + 2n)/2 = n(n + 1)/2.
   ```

Therefore the formula holds for every positive `n`. At `n = 4`, four strips have total area `1 + 2 + 3 + 4 = 10 cm²`, matching `4(5)/2`. In Section 3.3, the same triangular sum counted repeated visits; **the arithmetic is the same, but area and operation counts have different units**.

<span id="part-3-invariant"></span>

### 4. The loop-invariant template

An induction proof can also follow a loop. A **loop invariant** is a statement that stays true at each loop check. The section asks us to establish three things:

1. **Initialization:** The statement is true before the first iteration.
2. **Maintenance:** If it is true before an iteration that continues, the loop body makes it true at the next check.
3. **Conclusion:** When the loop returns or finishes, the statement helps prove the desired result.

A loop invariant by itself does not show that a loop **terminates**. For the search below, the index increases by one after each unsuccessful check and cannot increase past the finite list length without ending the loop.

<span id="part-3-find"></span>

### 5. Prove a first-area search correct

Code Fragment 3.9 scans a list for the **first index** containing a requested value. Here we scan card dimensions for the first card with a requested **area**. For this search, add a 2 cm × 4 cm card. It has the same `8 cm²` area as `B` but occurs later:

```python
def find_first_area(cards, target_area):
    j = 0
    while j < len(cards):
        width, height = cards[j]
        if width * height == target_area:
            return j
        j += 1
    return -1


cards = [(2, 3), (4, 2), (4, 4), (2, 4), (5, 4)]
print(find_first_area(cards, 8))   # 1: B is before the later 8 cm² card
print(find_first_area(cards, 12))  # -1: no card has area 12 cm²
print(find_first_area([], 8))      # -1: the empty list has no match
```

The invariant at each loop check with index `j` is:

```text
None of the first j cards, at indices 0 through j − 1, has target_area.
```

| Stage | Why the invariant holds | What it proves |
| :--- | :--- | :--- |
| **Before the first check** | `j = 0`; there are no earlier cards to contradict the claim. This is *vacuously true*. | The invariant starts true. |
| **After an unsuccessful check** | The card at index `j` is not a match. Increasing `j` adds that card to the already ruled-out prefix. | The invariant holds at the next check. |
| **When a match is found** | The current card matches, and every earlier card was ruled out. | Returning `j` gives the **first** matching index. |
| **When the loop is exhausted** | `j = len(cards)` and all cards are in the ruled-out prefix. | Returning `-1` correctly means no match exists. |

The index advances on every unsuccessful pass, so the scan terminates. As in Section 3.3, it uses `O(n)` time in the worst case and `O(1)` extra space. The proof of **first** occurrence depends on the invariant’s “first `j` cards” wording; showing only that a returned card matches would be too weak.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Simple Geometry Study Cases

<details>
<summary><strong>Case Study 1: What does one 3 cm × 5 cm card prove?</strong></summary>

**Scenario:** A new card has width `3 cm`, height `5 cm`, and area `15 cm²`.

**Check:** It witnesses “there exists a card with odd area.” It also shows that `2⁴ − 1 = 15` is composite, because the 15 unit squares form a `3 × 5` rectangle.

**Lesson:** One valid object proves an existence claim or refutes a universal claim. It cannot by itself prove a claim about every card or every integer `i > 1`.

</details>

<details>
<summary><strong>Case Study 2: Why is the negation of “or” an “and”?</strong></summary>

**Scenario:** We want to prove that an even-area card has an even width **or** an even height.

**Check:** If the conclusion were false, **neither** side would be even, so **both** would be odd. Writing the sides as `2j + 1` and `2k + 1` gives area `2(2jk + j + k) + 1`, which is odd.

**Lesson:** The contrapositive is easier to calculate, and De Morgan’s law supplies its correct assumption.

</details>

<details>
<summary><strong>Case Study 3: Can an odd-area card have an even side?</strong></summary>

**Scenario:** Suppose an area is odd but its width is even, `w = 2j`.

**Check:** Its area would be `w × h = 2(jh)`, which is even. The area would have to be both odd and even, a contradiction. The same reasoning works if the height is even.

**Result:** An odd area requires **both** side lengths to be odd.

</details>

<details>
<summary><strong>Case Study 4: How does one strip extend a staircase proof?</strong></summary>

**Scenario:** Three unit-width strips of heights 1, 2, and 3 cm make `6 cm²`. Add a fourth strip of height 4 cm.

**Check:** The previous area is `3(4)/2 = 6 cm²`. The new area is `6 + 4 = 10 cm²`, which equals `4(5)/2`.

**Lesson:** Induction repeats this exact step: assuming the formula for `n − 1` strips, adding strip `n` gives the formula for `n` strips. The base case starts the chain.

</details>

<details>
<summary><strong>Case Study 5: Why does the grouping proof need two base cases?</strong></summary>

**Scenario:** A row of cards is divided into groups of one card or two neighboring cards.

**Check:** The first group leaves either `n − 1` or `n − 2` cards, so `F(n) = F(n − 1) + F(n − 2)`. To prove a bound for `F(3)`, we already need bounds for **both** `F(2)` and `F(1)`.

**Lesson:** Match the base cases and induction assumptions to the recurrence. Proving only the `n = 1` case would leave a gap.

</details>

<details>
<summary><strong>Case Study 6: Why must a search rule out earlier cards?</strong></summary>

**Scenario:** The areas are `[6, 8, 16, 8, 20]` cm². We ask for the first `8 cm²` card.

**Check:** At index `j = 1`, the earlier prefix contains only `6`, so it has no match. The current area is `8`, and the scan returns `1`. The later `8` at index `3` does not change which match is first.

**Lesson:** The loop invariant proves more than “a match was found”: it proves **no smaller index could have matched**.

</details>

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Summary

| Section 3.4 technique | What must be shown | Rectangle-card example |
| :--- | :--- | :--- |
| **Witness** | One valid object has the stated property. | `C` has area `16 cm²`, divisible by 4. |
| **Counterexample** | One valid object violates a universal claim. | `A` has even area but an odd height. |
| **Contrapositive** | Prove `not q → not p` to establish `p → q`. | Two odd side lengths give an odd area. |
| **De Morgan’s laws** | Negate a whole `or` or `and` claim correctly. | “No side is even” means “both sides are odd.” |
| **Contradiction** | Assume the claim false and derive an impossibility. | An even side would make an allegedly odd area even. |
| **Induction** | Prove base cases and a step from smaller sizes. | The staircase gains `n cm²` when strip `n` is added. |
| **Strong induction** | Use all smaller claims needed by a recurrence. | Card groupings use both `F(n − 1)` and `F(n − 2)`. |
| **Loop invariant** | Establish, preserve, and use a statement about loop state. | Earlier cards are ruled out before returning the first matching area. |

**The section’s progression:** use a witness or counterexample for a single decisive case → use negation to prove implications → use induction for all integer sizes → use an invariant to prove a loop’s result.

[🔝 Back to Top](#top)
