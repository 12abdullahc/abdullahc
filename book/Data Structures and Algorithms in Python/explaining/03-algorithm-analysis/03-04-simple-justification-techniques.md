<span id="top"></span>

# Algorithm Analysis — Section 3.4: Simple Justification Techniques

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, [Chapter 3](<../../file/Data Structures and Algorithms in Python - C03.pdf>), Section 3.4, printed pages 137–140.  
> **Topic:** Proof by example and counterexample; contrapositive and contradiction; induction and loop invariants.  
> **Domain focus:** The **2026 Brazilian Grand Prix MotoGP Q2 session** at Goiânia on 21 March 2026.  
> **Learning goal:** Choose the right kind of justification for a claim and carry each of the section's proofs through step by step.  
> **User Prompt:** "Reexplain [Section 3.4] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: What Does a Claim Need?](#background-intuition)
2. [Part 1: Section 3.4.1 — By Example](#part-1)
   - [1. Prove an existence claim with a witness](#part-1-witness)
   - [2. Refute a universal claim with a counterexample](#part-1-counterexample)
   - [3. Know what a few examples cannot establish](#part-1-limits)
3. [Part 2: Section 3.4.2 — The "Contra" Attack](#part-2)
   - [1. Prove an implication by its contrapositive](#part-2-contrapositive)
   - [2. Negate "and" and "or" correctly](#part-2-demorgan)
   - [3. Prove a claim by contradiction](#part-2-contradiction)
4. [Part 3: Section 3.4.3 — Induction and Loop Invariants](#part-3)
   - [1. Build an induction proof](#part-3-induction)
   - [2. Bound the section's Fibonacci sequence](#part-3-fibonacci)
   - [3. Prove the sum of the first `n` positions](#part-3-sum)
   - [4. State a useful loop invariant](#part-3-invariant)
   - [5. Prove a first-match search correct](#part-3-find)
5. [Part 4: Summary](#part-4)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: What Does a Claim Need?

[Section 3.3](03-03-asymptotic-analysis.md) bounded an algorithm's work. Section 3.4 asks a broader question: **what makes a statement about an algorithm or a mathematical pattern true for every allowed input?** Running one example gives evidence about that example. A proof explains why the claim follows for all inputs named in it.

The [MotoGP Q2 report](https://www.motogp.com/en/news/2026/03/21/di-giannantonio-heads-bezzecchi-after-dramatic-first-qualifying-in-brazil/1010237) and [published Q2 timing classification](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Qualifying2.pdf) record 12 riders in **one session**, Qualifying 2 at the 2026 Brazilian GP. These five records will supply names, teams, and integer Q2 places for the examples:

| Q2 place | Rider | Team | Best Q2 lap |
| ---: | :--- | :--- | ---: |
| P1 | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team | 1:17.410 |
| P2 | Marco Bezzecchi | Aprilia Racing | 1:17.480 |
| P3 | Marc Márquez | Ducati Lenovo Team | 1:17.491 |
| P4 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team | 1:17.561 |
| P11 | Francesco Bagnaia | Ducati Lenovo Team | 1:18.122 |

The places and teams are **reported facts**. Below, rider pairings, briefing groups, and lists selected from these records are **teaching constructions**, not official MotoGP events or statistics. A Q2 place such as P3 is the integer `3`. A Python list index starts at `0`; it is a different number. When a proof says "for every integer" or "for every list," the Q2 records illustrate the idea but do not limit the proof to 12 riders.

| Kind of claim | What would justify it? | Q2 illustration |
| :--- | :--- | :--- |
| "At least one selected rider has property `P`." | Exhibit one valid **witness**. | Fabio Quartararo is a top-four rider on Monster Energy Yamaha MotoGP Team. |
| "Every selected rider has property `P`." | Reason about all selected riders, or check the complete finite selection. | To prove this about the four listed top-four records, all four would need checking. |
| "Not every selected rider has property `P`." | Exhibit one valid **counterexample**. | Fabio Quartararo disproves "every top-four rider is on Ducati Lenovo Team." |
| "This search returns the first match on every list." | Prove what the loop has ruled out before returning. | A team search must rule out every earlier entry. |

**Why these examples?** The same small Q2 classification supports different types of claim without changing the source data. **How to solve a justification question:** state the exact set being discussed, identify words such as **some**, **every**, or **first**, and choose evidence that matches that claim.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Section 3.4.1 — By Example

<span id="part-1-witness"></span>

### 1. Prove an Existence Claim with a Witness

An **existence claim** has the form "there is an `x` in a set `S` with property `P`." One qualifying `x` is enough. Consider:

```text
Claim: At least one rider in the Q2 top four was on
       Monster Energy Yamaha MotoGP Team.
Witness: Fabio Quartararo was P4 and rode for that team.
```

The witness meets both conditions: he belongs to the **top-four set**, and his team has the named property. Marc Márquez is also in the top four, but his Ducati Lenovo team would not witness this particular claim.

**Why this example?** Fabio supplies a real, directly checkable witness, so the logic of "at least one" is visible. **How to solve it:** identify the allowed set, name one member of it, and verify every condition in the property. No search through an infinite set is required once a valid witness is found.

<span id="part-1-counterexample"></span>

### 2. Refute a Universal Claim with a Counterexample

A **universal claim** says every member of a set has property `P`. To show it is false, find one member that lacks `P`:

```text
False claim: Every Q2 top-four rider was on Ducati Lenovo Team.
Counterexample: Fabio Quartararo was P4, but his team was
                Monster Energy Yamaha MotoGP Team.
```

Marc Márquez at P3 **does** satisfy the claimed property. His supporting example cannot rescue a claim containing the word "every" after Fabio supplies a counterexample.

The book's Example 3.17 uses exactly this pattern with numbers. The proposed claim is that `2^i − 1` is prime for **every integer `i > 1`**. The first two checks, `i = 2` and `i = 3`, give primes `3` and `7`. But `i = 4` gives:

```text
2⁴ − 1 = 16 − 1 = 15 = 3 × 5.
```

Since `15` has factors other than `1` and itself, it is not prime. The valid input `i = 4` defeats the universal statement.

**Why these examples?** Fabio's team makes the counterexample concrete, while `2⁴ − 1` preserves the chapter's original number-theory argument. **How to solve it:** verify that your chosen input is allowed, compute the claimed property, and show precisely where the universal statement fails.

<span id="part-1-limits"></span>

### 3. Know What a Few Examples Cannot Establish

Checking Marc P3 and Fabio P4 proves facts **about those two riders**. It does not prove a statement about every Q2 rider, much less every possible future qualifying list. Similarly, testing `2^i − 1` for `i = 2` and `3` did not prove the prime claim; `i = 4` broke it.

The direction of evidence matters:

| Claim | One matching example | One failing example |
| :--- | :--- | :--- |
| "Some `x` has `P`." | Proves the claim. | Does not settle it if other allowed members remain. |
| "Every `x` has `P`." | Does not settle it if other allowed members remain. | Refutes the claim. |

For a **fixed finite set** such as the published 12 Q2 riders, a complete check of all 12 can prove a claim limited to that set. For "every input list of any size," a finite collection of runs cannot finish the proof.

**Why this distinction?** The same observations have different force under "some" and "every." **How to solve it:** write the quantifier first, then ask whether the example is meant to establish existence, expose an exception, or merely test a broader conjecture.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: Section 3.4.2 — The "Contra" Attack

<span id="part-2-contrapositive"></span>

### 1. Prove an Implication by Its Contrapositive

An implication "if `p`, then `q`" is logically equivalent to its **contrapositive**, "if **not `q`**, then **not `p`**." This is useful when the negated conclusion is easier to work with. It is **not** the reverse statement "if `q`, then `p`."

The book's Example 3.18 says: for any integers `a` and `b`, **if `ab` is even, then `a` is even or `b` is even**. Let `a` and `b` be two Q2 place numbers only as an illustration. Marc's P3 and Fabio's P4 give `3 × 4 = 12`, an even product with an even factor. That one pair is a check, not the proof for arbitrary integers.

To prove the general claim, turn it around:

```text
Original:       If ab is even, then a is even or b is even.
Contrapositive: If a is odd and b is odd, then ab is odd.
```

Suppose `a = 2j + 1` and `b = 2k + 1` for integers `j` and `k`. Multiply and factor out `2`:

```text
ab = (2j + 1)(2k + 1)
   = 4jk + 2j + 2k + 1
   = 2(2jk + j + k) + 1.
```

The bracket is an integer, so `ab` has the form `2m + 1` and is odd. We have proved the contrapositive, which proves the original claim for **all integers** `a` and `b`.

**Why this example?** Marc's P3 and Fabio's P4 make the parity statement easy to check, while the algebra shows why it holds beyond Q2. **How to solve it:** identify `p` and `q`, form `¬q → ¬p`, rewrite odd integers as `2j+1`, and simplify the product.

<span id="part-2-demorgan"></span>

### 2. Negate "And" and "Or" Correctly

The contrapositive depends on negating the **whole** conclusion. **De Morgan's laws** provide the exact transformations:

| Statement | Its negation |
| :--- | :--- |
| `P or Q` | `not P and not Q` |
| `P and Q` | `not P or not Q` |

In the parity proof, the negation of "`a` is even **or** `b` is even" is "`a` is **not** even **and** `b` is **not** even." Every integer is either even or odd, so this becomes "`a` is odd **and** `b` is odd." The negation is **not** "`a` is odd or `b` is odd": for Q2 places `a = 3` and `b = 4`, that mistaken expression is true even though the original "one is even" expression is also true.

The second law will appear in the contradiction proof: negating "`a` is odd **and** `b` is odd" yields "`a` is even **or** `b` is even."

**Why this example?** The small P3/P4 pair catches a common error in negating "or." **How to solve it:** negate each component **and** swap `or` with `and`, or `and` with `or`; then simplify "not even" and "not odd" for integers.

<span id="part-2-contradiction"></span>

### 3. Prove a Claim by Contradiction

In a proof by **contradiction**, assume the situation in the claim is possible **and** the desired conclusion is false. Then derive an impossibility. The book's Example 3.19 states: **if `ab` is odd, then both `a` and `b` are odd**. Di Giannantonio's P1 and Marc's P3 illustrate a consistent starting case: `1 × 3 = 3` is odd, and both factors are odd. Again, the pair is an illustration, not the general proof.

For arbitrary integers, suppose `ab` is odd, but **not** both factors are odd. By De Morgan's law, `a` is even **or** `b` is even. If `a` is even, write `a = 2j`:

```text
ab = (2j)b = 2(jb), which is even.
```

If instead `b` is even, the same argument gives `ab = a(2k) = 2(ak)`, also even. Either case contradicts the premise that `ab` is odd. Therefore both factors must be odd.

**Why this example?** The P1/P3 check shows the starting condition is possible; the contradiction explains why an even factor is impossible in **any** odd product. **How to solve it:** retain the premise, negate the conclusion with De Morgan's law, handle the possible cases, and identify the exact conflict.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: Section 3.4.3 — Induction and Loop Invariants

<span id="part-3-induction"></span>

### 1. Build an Induction Proof

A statement such as "this formula works for every integer `n ≥ 1`" covers infinitely many values. Checking `n = 1, 2, 3, 4` is useful for finding mistakes, but it cannot establish the whole statement. **Induction** connects each new case to earlier cases that have already been justified:

| Stage | What to establish | Reason |
| :--- | :--- | :--- |
| **Base case or cases** | Prove the first required value, sometimes the first several. | Starts the chain with known truths. |
| **Induction step** | Assume the necessary smaller cases are true; use them to prove the next case. | Extends the chain. |
| **Conclusion** | State the result for every allowed `n`. | Every particular positive `n` is reached after finitely many steps. |

The chapter states the step in **strong induction** form: when proving `Q(n)`, we may assume `Q(j)` for every positive `j < n`. This is useful when a recurrence depends on both `n−1` and `n−2`. If a formula needs only `n−1`, an ordinary one-step induction is enough.

**Why this example?** The first four Q2 places, `1, 2, 3, 4`, make it easy to see why four checks are not a proof about every `n`. **How to solve an induction problem:** write exactly what `Q(n)` says, prove enough base cases for the recurrence, state the assumption on smaller cases, and show how it yields `Q(n)`.

<span id="part-3-fibonacci"></span>

### 2. Bound the Section's Fibonacci Sequence

Proposition 3.20 uses a **shifted Fibonacci sequence**:

```text
F(1) = 1,   F(2) = 2,
F(n) = F(n − 1) + F(n − 2) for n > 2.
```

This starts `1, 2, 3, 5, 8, …`; its second value is `2`, unlike the common `1, 1, 2, 3, …` version. To picture the recurrence for `1 ≤ n ≤ 12`, arrange the first `n` Q2 riders in classification order and **hypothetically** divide them into briefing groups of either one rider or two **adjacent** riders. Their actual teams do not affect the grouping count. For larger `n`, the proof concerns an abstract longer list, not additional riders in this Q2 session.

| `n` | First `n` Q2 riders | Possible group-size patterns | `F(n)` |
| ---: | :--- | :--- | ---: |
| 1 | Di Giannantonio | `[1]` | 1 |
| 2 | Di Giannantonio, Bezzecchi | `[1,1]`, `[2]` | 2 |
| 3 | Add Marc Márquez | `[1,1,1]`, `[1,2]`, `[2,1]` | 3 |
| 4 | Add Fabio Quartararo | `[1,1,1,1]`, `[1,1,2]`, `[1,2,1]`, `[2,1,1]`, `[2,2]` | 5 |

For example, `[2,1,1]` groups Di Giannantonio with Bezzecchi, then leaves Marc and Fabio in separate groups. Every grouping of `n` riders ends with either **one** rider (leaving a grouping of `n−1`) or **two** adjacent riders (leaving a grouping of `n−2`). The cases cannot overlap, so their counts add to the recurrence above. This grouping is a teaching model, **not** a recorded Q2 activity.

The proposition claims **`F(n) < 2^n` for every `n ≥ 1`**. Because `F(n)` uses two earlier values, prove **two** base cases:

```text
n = 1:  F(1) = 1 < 2¹ = 2.
n = 2:  F(2) = 2 < 2² = 4.
```

For `n > 2`, assume `F(j) < 2^j` for all positive `j < n`. In particular, the assumption applies to `n−1` and `n−2`:

```text
F(n) = F(n − 1) + F(n − 2)
     < 2^(n−1) + 2^(n−2)
     = 3·2^(n−2)
     < 4·2^(n−2) = 2^n.
```

That proves the claim for every positive `n`. At the actual four-rider illustration, `F(4) = 5 < 16 = 2⁴`. The inequality compares mathematical counts; it does **not** claim a MotoGP measurement or the runtime of a grouping program.

**Why this example?** Grouping Marc and Fabio with adjacent Q2 riders makes `F(n−1)+F(n−2)` visible. **How to solve it:** split the groupings by the final group size, verify both base cases, then apply the induction assumption to both smaller terms.

<span id="part-3-sum"></span>

### 3. Prove the Sum of the First `n` Positions

Proposition 3.21 repeats the triangular-sum identity from Proposition 3.3:

```text
1 + 2 + ··· + n = n(n + 1)/2.
```

The first four Q2 places give a simple check: `1 + 2 + 3 + 4 = 10`, and `4(4+1)/2 = 10`. These are **place numbers**, not lap times or a racing score. To prove the formula for every positive integer `n`, let `Q(n)` be that equality.

1. **Base case, `n = 1`:** The left side is `1`, and the right side is `1(2)/2 = 1`.
2. **Induction step, `n ≥ 2`:** Assume `Q(n−1)`, so `1 + ··· + (n−1) = (n−1)n/2`. Add the new last term `n`:

   ```text
   1 + ··· + (n−1) + n
     = (n−1)n/2 + n
     = ((n−1)n + 2n)/2
     = n(n+1)/2.
   ```

The base and step establish the formula for every `n ≥ 1`. For `n > 12`, `1+···+n` is just a mathematical extension; it does not describe more riders in this 12-rider Q2 session.

**Why this example?** Official Q2 places already begin `1, 2, 3, 4`, so the formula has an immediate four-value check. **How to solve it:** prove the first case, assume the sum through `n−1`, add `n`, and simplify to the desired expression.

<span id="part-3-invariant"></span>

### 4. State a Useful Loop Invariant

A **loop invariant** is a claim that holds whenever execution reaches a chosen point in the loop. It is an induction proof over iterations. The section gives three obligations:

1. **Initialization:** The claim holds before the first iteration.
2. **Maintenance:** If it holds before an iteration that continues, the loop body makes it hold before the next iteration.
3. **Conclusion:** At a return or normal exit, the claim implies the result we wanted.

For a search for the **first** match, "the current item has not matched yet" is too weak. The useful claim says **none of the earlier items matched**. It explains why returning the current index gives the *first* match, not merely *a* match.

An invariant also needs a **termination argument** when proving that the algorithm finishes. In the next search, the index increases after each mismatch and the finite list length bounds how often that can happen.

**Why this example?** A first-match search has a small loop whose correctness depends on remembering what earlier iterations established. **How to solve it:** choose a statement about the processed prefix, check it before the loop, show one unsuccessful pass extends it, and use it at both kinds of exit.

<span id="part-3-find"></span>

### 5. Prove a First-Match Search Correct

Code Fragment 3.9 scans a sequence and returns the **smallest index** containing a requested value, or `-1` if there is no match. We apply that algorithm to team labels from five **selected** Q2 records, listed in official classification order:

| Selected-list index | Q2 place | Rider | Team |
| ---: | ---: | :--- | :--- |
| `0` | P1 | Fabio Di Giannantonio | Pertamina Enduro VR46 Racing Team |
| `1` | P2 | Marco Bezzecchi | Aprilia Racing |
| `2` | P3 | Marc Márquez | Ducati Lenovo Team |
| `3` | P4 | Fabio Quartararo | Monster Energy Yamaha MotoGP Team |
| `4` | P11 | Francesco Bagnaia | Ducati Lenovo Team |

Marc and Bagnaia share a team. A search for `"Ducati Lenovo Team"` must return **index `2`**, because Marc's entry comes before Bagnaia's **in this selected list**. Index `2` is not the same notation as Marc's Q2 place P3.

```python
def find(S, val):
    """Return the first index holding val, or -1 when val is absent."""
    j = 0
    while j < len(S):
        if S[j] == val:
            return j
        j += 1
    return -1

selected_q2 = [
    ("Fabio Di Giannantonio", "Pertamina Enduro VR46 Racing Team", 1),
    ("Marco Bezzecchi", "Aprilia Racing", 2),
    ("Marc Márquez", "Ducati Lenovo Team", 3),
    ("Fabio Quartararo", "Monster Energy Yamaha MotoGP Team", 4),
    ("Francesco Bagnaia", "Ducati Lenovo Team", 11),
]
teams = [record[1] for record in selected_q2]
first_ducati = find(teams, "Ducati Lenovo Team")
print(first_ducati)
print(selected_q2[first_ducati][0])
print(find(teams, "Trackhouse MotoGP Team"))
print(find([], "Ducati Lenovo Team"))
```

```text
2
Marc Márquez
-1
-1
```

The invariant at the start of a loop check with index `j` is:

```text
L_j: val differs from every item S[0], S[1], ..., S[j−1].
```

| Stage | Reason | Consequence |
| :--- | :--- | :--- |
| **Initially, `j = 0`** | There are no earlier items. `L₀` is *vacuously true*. | The invariant starts true, even for an empty list. |
| **After a mismatch at `j`** | `L_j` rules out `S[0:j]`; the failed comparison also rules out `S[j]`. | Incrementing `j` establishes `L_(j+1)`. |
| **When `S[j] == val`** | Every earlier position was ruled out by `L_j`. | Returning `j` gives the **first** match. |
| **When `j == len(S)`** | `L_j` now rules out the entire list. | Returning `-1` correctly means no match in `S`. |

On every mismatch, `j` increases by one. It cannot remain below the finite list length forever, so the function terminates. The search itself makes at most `n` comparisons for a list of `n` values. With fixed-length team labels treated as constant-cost comparisons, that is `O(n)` time and `O(1)` extra space. Creating the example's `teams` list happens **before** the search and is separate work.

The `-1` for Trackhouse means only that **these five selected rows** lack that team. The [full Q2 classification](https://www.ducati.at/fileadmin/user_upload/page2015/news2026/20260322_MotoGP_Brasilien/2026_MotoGP_Brasilien_Results_Qualifying2.pdf) includes Ai Ogura at P6 for Trackhouse MotoGP Team. A search result must always be read relative to the list actually searched.

**Why this example?** Marc's earlier Ducati Lenovo entry and Bagnaia's later one test the word **first**. Fabio's entry shows that the scan can pass a different team, while the empty-list call checks the zero-iteration case. **How to solve it:** trace the selected-list indices, write the "no earlier match" invariant, prove initialization and maintenance, explain both returns, and show that `j` cannot increase forever.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Summary

| Section 3.4 technique | Claim it addresses | What completes the justification |
| :--- | :--- | :--- |
| **Witness** | "Some `x` has `P`." | Name one allowed `x` and verify `P`; Fabio Quartararo witnesses a top-four Yamaha-team claim. |
| **Counterexample** | "Every `x` has `P`" is false. | Name one allowed exception; `i = 4` refutes the book's `2^i−1` prime claim. |
| **Contrapositive** | `p → q` | Prove `¬q → ¬p`; odd × odd is odd. |
| **De Morgan's laws** | Negation of "and" or "or" | Negate both components and swap the connective. |
| **Contradiction** | A proposed conclusion must hold. | Assume the premise and the conclusion's negation, then derive a conflict. |
| **Induction** | A claim holds for every positive `n`. | Prove base cases and a step from smaller cases; `F(n) < 2^n` needs two bases. |
| **Loop invariant** | A loop returns the promised answer. | Show initialization, maintenance, and the exit implication; earlier indices are ruled out before `find` returns. |

**Section 3.4's path:** match the proof method to the claim → establish it for one allowed object or for arbitrary inputs as needed → keep track of the assumptions → use induction or an invariant when the claim spans many sizes or iterations.

[🔝 Back to Top](#top)
