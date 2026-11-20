<span id="top"></span>

# Object-Oriented Programming — Section 2.6: Shallow and Deep Copying

> **Source:** Goodrich, Tamassia, and Goldwasser, _Data Structures and Algorithms in Python_, Chapter 2, Section 2.6, printed pages 101–102 of the supplied PDF.<br>
> **Topic:** Assignment and aliases; shallow copies; deep copies; the unnumbered “Python's copy Module” passage.<br>
> **Domain focus:** The **MotoGP Practice session at the 2026 Indonesian Grand Prix**, Friday 9 October, at Mandalika.<br>
> **Learning goal:** Predict which list and rider-card objects are shared after assignment, shallow copying, and deep copying, then choose a copy operation for an editable report.<br>
> **User Prompt:** "Reexplain [Section 2.6] part by part in more detail, with simple examples, why each example was chosen, and how to solve it, in the format of [01-01-overview.md]. [Use real riders and teams from a specific 2026 MotoGP session, prioritize riders like Marc Marquez and Fabio Quartararo]."

---

## Table of Contents

1. [Background & Conceptual Intuition: An Editable Practice Selection](#background-intuition)
   - [1. Keep the verified session data fixed](#background-data)
   - [2. Draw the objects and the editable notes](#background-objects)
2. [Part 1: Assignment Creates an Alias](#part-1)
   - [1. Bind two names to one list](#part-1-alias)
   - [2. Trace an addition through both names](#part-1-add)
3. [Part 2: A Shallow Copy Makes a New Outer List](#part-2)
   - [1. Copy the list but share the rider cards](#part-2-structure)
   - [2. Separate a list edit from a card edit](#part-2-edits)
   - [3. Follow a nested notes list](#part-2-nested)
4. [Part 3: A Deep Copy Follows Referenced Objects](#part-3)
   - [1. Copy the rider cards and notes too](#part-3-graph)
   - [2. Compare the three reference patterns](#part-3-compare)
5. [Part 4: Python's `copy` Module](#part-4)
   - [1. Choose the operation for the level you need to copy](#part-4-operations)
   - [2. Read “one level” from the object passed in](#part-4-card)
   - [3. A deep copy keeps repeated references repeated](#part-4-memo)
   - [4. Pick a copy by the edit you plan to make](#part-4-choose)
6. [Part 5: Complete Practice-Selection Program](#part-5)
   - [1. Run the program](#part-5-program)
   - [2. Trace the output](#part-5-trace)
7. [Part 6: Small Worked Cases](#part-6)
8. [Part 7: Summary](#part-7)

---

<span id="background-intuition"></span>

## Background & Conceptual Intuition: An Editable Practice Selection

<span id="background-data"></span>

### 1. Keep the verified session data fixed

We use **Friday MotoGP Practice** at the 2026 Indonesian Grand Prix. The [Yamaha Factory Racing full results](https://www.yamaha-motogp.com/motogp-season/11-10-2026-grand-prix-of-indonesia) provide these riders, teams, official places, and fastest laps; the [MotoGP Practice report](https://www.motogp.com/en/news/2026/10/09/mgp-ind-pr-report/1174847) also identifies Raúl Fernández as fastest.

| Official Practice place | Rider | Team | Best lap | Milliseconds |
| :---: | :--- | :--- | ---: | ---: |
| P1 | Raúl Fernández | SuperFile Trackhouse MotoGP Team | 1:28.725 | 88,725 |
| P5 | Marc Márquez | Ducati Lenovo Team | 1:29.426 | 89,426 |
| P7 | Fabio Quartararo | Monster Energy Yamaha MotoGP | 1:29.558 | 89,558 |

For reference, Marc's best lap was `89,426 − 88,725 = 701 ms` longer than Raúl's; Fabio's was `89,558 − 88,725 = 833 ms` longer. These are **calculated best-lap differences in the same Practice session**, not Sprint or race finish gaps. None of the copying examples edits the official rider, team, place, or lap fields.

**Why these results?** Marc and Fabio give our small selection two real, distinguishable objects, while Raúl gives us an optional third selection. **How to use the facts:** identify each source field once, keep the unit as milliseconds in code, and label report selections separately from official places.

<span id="background-objects"></span>

### 2. Draw the objects and the editable notes

Imagine an analyst preparing a **two-rider selection** for a Practice display. The initial outer list contains Marc's and Fabio's `RiderCard` objects. Each card holds its sourced fields **and** a mutable `notes` list for analyst-only display notes. A note such as `"highlight Marc"` is a hypothetical editing instruction, not a MotoGP observation.

```text
original list
   ├── index 0 ──→ Marc card: P5, Ducati Lenovo Team, 89,426 ms
   │                 └── notes ──→ []
   └── index 1 ──→ Fabio card: P7, Monster Energy Yamaha MotoGP, 89,558 ms
                     └── notes ──→ []

Raúl card: P1, SuperFile Trackhouse MotoGP Team, 88,725 ms
```

A list **contains references** to cards, and a card contains a reference to its notes list. Changing the list's membership, changing a card, and changing a card's notes are three different depths of edit. We will use `is` to test object identity, because two objects can hold equal-looking data while still being separate objects.

**Why this object graph?** The nested mutable notes make the difference between a shallow and deep copy observable without inventing a new lap time. **How to solve a copy question:** draw each mutable object as a box and each reference as an arrow, then mark which boxes a copy operation actually creates.

[🔝 Back to Top](#top)

---

<span id="part-1"></span>

## Part 1: Assignment Creates an Alias

<span id="part-1-alias"></span>

### 1. Bind two names to one list

Section 2.6 begins with the book's `palette = warmtones` example. Assignment binds another name to the **same list**; it does not duplicate the list or its color objects. For our two-rider selection:

```python
original = [marc, fabio]
alias = original

print(alias is original)  # True
```

`original` and `alias` are two labels for one outer list. `alias[0] is original[0]` is also true, because both expressions follow the same list slot to Marc's card.

**Why this example?** It isolates the first possible misconception: a new variable is not a new object. **How to solve it:** follow the right side of `=` to the existing list and draw a second name pointing to that list, with no new box.

<span id="part-1-add"></span>

### 2. Trace an addition through both names

Suppose the analyst adds Raúl to the selection through the alias:

```python
alias.append(raul)
print(len(original))  # 3
print(original[2].rider)  # Raúl Fernández
```

Because there is only **one** outer list, both names now see Marc, Fabio, and Raúl. The list order is the analyst's selection order; it does **not** turn official P5, P7, and P1 into a new classification. The cards and their recorded fields have not changed.

**Why this example?** Appending changes only the outer list, so it shows aliasing before any nested-object complexity. **How to solve it:** find the object on which `append()` runs; then list every name that reaches that same object.

[🔝 Back to Top](#top)

---

<span id="part-2"></span>

## Part 2: A Shallow Copy Makes a New Outer List

<span id="part-2-structure"></span>

### 1. Copy the list but share the rider cards

The book next writes `list(warmtones)` to make a **shallow copy**. Start a fresh two-rider selection for this trace:

```python
original = [marc, fabio]
shallow = list(original)

print(shallow is original)        # False: two outer lists
print(shallow[0] is original[0])  # True: one Marc card
```

`list(original)` creates a new list but places references to the **same cards** in its slots. Those cards still point to the same notes lists. This is the structure shown by the book's Figure 2.10 for two lists of mutable color objects.

```text
original list ──index 0──┐
                         ├──→ Marc card ──→ Marc notes list
shallow list  ──index 0──┘
```

**Why this example?** The two identity checks pinpoint the boundary of the copy. **How to solve it:** draw a second list box, copy its arrows to the original cards, and stop—do not draw new card or notes boxes.

<span id="part-2-edits"></span>

### 2. Separate a list edit from a card edit

Adding Raúl to the **shallow list** does not add him to the original:

```python
shallow.append(raul)
print(len(shallow))   # 3
print(len(original))  # 2
```

Replacing a slot behaves the same way at the list level. If `shallow[0] = raul`, only the shallow list's first arrow changes; `original[0]` still points to Marc. By contrast, `shallow[0].notes.append("highlight Marc")` edits the **card reached by both lists**, so Marc's notes also change when viewed through `original[0]`. These are separate alternative edits to a fresh shallow copy: after replacing index 0 with Raúl, that index would no longer refer to Marc.

**Why these examples?** A new list protects its membership and slot assignments, but not the mutable objects already in its slots. **How to solve an edit:** locate the assignment or method receiver—`shallow` for `append`, `shallow[0]`'s slot for replacement, or Marc's nested notes list for the note edit.

<span id="part-2-nested"></span>

### 3. Follow a nested notes list

A card can itself be shallow-copied. That makes a new **card object** while leaving its contained notes list shared:

```python
import copy

card_copy = copy.copy(marc)
print(card_copy is marc)              # False
print(card_copy.notes is marc.notes)  # True
```

If `card_copy.notes.append("layout draft")` runs, both cards' `notes` attributes lead to the changed **same list**. This shows why “shallow” means **one level from the object passed to the copy operation**: `copy.copy(original)` copies the outer list; `copy.copy(marc)` copies the outer card. Neither recursively duplicates all contained mutables.

**Why this example?** It prevents the phrase “shallow copy” from being confused with “always copy one list.” **How to solve it:** name the exact object passed to `copy.copy`, draw a new box for that object, and leave its outgoing references aimed at the old children.

[🔝 Back to Top](#top)

---

<span id="part-3"></span>

## Part 3: A Deep Copy Follows Referenced Objects

<span id="part-3-graph"></span>

### 1. Copy the rider cards and notes too

For a fresh selection of the plain `RiderCard` objects used here, `copy.deepcopy` follows references to the cards and their mutable notes lists:

```python
import copy

original = [marc, fabio]
deep = copy.deepcopy(original)

print(deep is original)                    # False: new outer list
print(deep[0] is original[0])              # False: new Marc card
print(deep[0].notes is original[0].notes)  # False: new notes list

deep[0].notes.append("private draft")
print(original[0].notes)  # []
```

The last line assumes Marc's original notes started empty and this fresh example made no earlier note edits. The deep copy can now hold a different analyst note without changing the original. The sourced `rider`, `team`, `place`, and `lap_ms` values are the **same values** in both cards; this code does not alter them.

**Why this example?** The three identity checks show exactly how far the copy follows this object graph. **How to solve it:** draw a new list, new rider-card boxes, and new notes-list boxes; then follow the note edit only from the deep copy's arrows.

<span id="part-3-compare"></span>

### 2. Compare the three reference patterns

For a fresh `[marc, fabio]` selection before any edits:

| Operation | Same outer list? | Same Marc card? | Same Marc notes list? | Outer-list edit affects original? | Marc-note edit affects original? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `alias = original` | Yes | Yes | Yes | Yes | Yes |
| `shallow = list(original)` | No | Yes | Yes | No | Yes |
| `deep = copy.deepcopy(original)` | No | No | No | No | No |

The book's Figures **2.9, 2.10, and 2.11** show these same three patterns with a list of mutable color objects. The table is about our **plain mutable card and notes objects**; it does not promise a new identity for every immutable string or integer inside an arbitrary deep-copied object graph.

**Why this table?** It separates two questions that “did I copy it?” often blurs: whether the list is shared and whether a mutable child is shared. **How to use it:** identify which level the planned edit touches, then read the corresponding column before choosing an operation.

[🔝 Back to Top](#top)

---

<span id="part-4"></span>

## Part 4: Python's `copy` Module

<span id="part-4-operations"></span>

### 1. Choose the operation for the level you need to copy

Python's [`copy` module](https://docs.python.org/3/library/copy.html) provides `copy.copy(x)` for a shallow copy and `copy.deepcopy(x)` for a deep copy. For an ordinary list such as our rider selection, `list(original)`, `original.copy()`, `original[:]`, and `copy.copy(original)` all create a new outer list whose entries still refer to the original rider cards:

```python
import copy

original = [marc, fabio]
module_shallow = copy.copy(original)

print(module_shallow is original)        # False
print(module_shallow[0] is original[0])  # True
```

`copy.deepcopy(original)` also creates a new outer list, then follows references into the cards and their mutable notes. These statements describe the **ordinary list and `RiderCard` objects in this guide**; custom classes can define their own copy behavior.

**Why this example?** It connects the book's `list(warmtones)` picture with the named operations in `copy`, without making the syntax seem like a different kind of graph. **How to solve it:** check the object supplied as `x`, then ask whether the operation duplicates only `x` or follows its references.

<span id="part-4-card"></span>

### 2. Read “one level” from the object passed in

The word *shallow* does not always mean “copy one list.” It means that the object passed to `copy.copy` is new, while its referenced children stay shared:

```python
card_copy = copy.copy(marc)
deep_card = copy.deepcopy(marc)

print(card_copy is marc)              # False
print(card_copy.notes is marc.notes)  # True
print(deep_card.notes is marc.notes)   # False
```

Here `card_copy` is a new Marc card with the same notes list. `deep_card` has its own notes list. Neither result changes Marc's recorded team, place, or lap time.

**Why this example?** Copying the list and copying one card are easy to mix up. **How to solve it:** circle the expression inside the parentheses first; that object is the outer level of the copy.

<span id="part-4-memo"></span>

### 3. A deep copy keeps repeated references repeated

Suppose an analyst accidentally places the **same Marc card** in two list positions. Deep copying the list does not create two unrelated Marc cards:

```python
repeated = [marc, marc]
repeated_copy = copy.deepcopy(repeated)

print(repeated[0] is repeated[1])            # True
print(repeated_copy[0] is repeated_copy[1])  # True
print(repeated_copy[0] is marc)              # False
```

`deepcopy` remembers objects it has already copied during one operation. This *memo* preserves the repeated-reference pattern and also helps it handle cycles. A deep copy need not duplicate every immutable value, and copying a larger graph than you need may copy more state than intended.

**Why this example?** “Deep” can sound as if every path creates a separate object. **How to solve it:** draw one new Marc card, then aim both positions in `repeated_copy` at that new card.

<span id="part-4-choose"></span>

### 4. Pick a copy by the edit you plan to make

| Planned edit | Suitable operation here | Reason |
| :--- | :--- | :--- |
| Keep two names for the same live selection | `alias = original` | Both names should see membership changes. |
| Change only selection membership or slot assignments | `list(original)` or `copy.copy(original)` | The new outer list has its own slots. |
| Change analyst notes independently | `copy.deepcopy(original)` | The new cards have new mutable notes lists. |

The module also supports class-specific `__copy__` and `__deepcopy__` methods. In a larger program, inspect those methods before assuming the ordinary behavior above. Copying is about object relationships; it does not check whether the recorded race data are accurate.

**Why this decision table?** The required copy depth follows from the planned mutation, not the number of nested brackets you can see. **How to use it:** first name the object you will edit, then choose the row that isolates or shares that object as intended.

[🔝 Back to Top](#top)

---

<span id="part-5"></span>

## Part 5: Complete Practice-Selection Program

<span id="part-5-program"></span>

### 1. Run the program

This program builds the alias and three selection copies **before** any edits. It creates the separate card copy and repeated-reference example later. The only values added to the selections are hypothetical analyst notes and a changed selection; the sourced Practice fields remain fixed. Save it as `practice_copies.py` and run `python practice_copies.py`.

```python
import copy


class RiderCard:
    def __init__(self, rider, team, place, lap_ms):
        self.rider = rider
        self.team = team
        self.place = place
        self.lap_ms = lap_ms
        self.notes = []  # Editable analyst notes, not an official result.


def rider_names(cards):
    return [card.rider for card in cards]


def main():
    # 2026 Indonesian GP, Friday MotoGP Practice, 9 October.
    marc = RiderCard("Marc Márquez", "Ducati Lenovo Team", 5, 89426)
    fabio = RiderCard("Fabio Quartararo", "Monster Energy Yamaha MotoGP", 7, 89558)
    raul = RiderCard("Raúl Fernández", "SuperFile Trackhouse MotoGP Team", 1, 88725)

    original = [marc, fabio]            # Analyst's selection order.
    alias = original                    # Same outer list.
    list_copy = list(original)          # New list; same cards.
    module_shallow = copy.copy(original)  # New list; same cards.
    deep = copy.deepcopy(original)      # New list, cards, and notes.

    print("Session: 2026 Indonesian GP Friday MotoGP Practice")
    print("Best-lap differences to Raúl (ms):",
          "Marc", marc.lap_ms - raul.lap_ms,
          "Fabio", fabio.lap_ms - raul.lap_ms)
    print("Alias is original:", alias is original)
    print("List copy is original:", list_copy is original)
    print("Module shallow is original:", module_shallow is original)
    print("Deep is original:", deep is original)
    print("List copy shares Marc:", list_copy[0] is original[0])
    print("Module shallow shares Marc:", module_shallow[0] is original[0])
    print("Deep shares Marc:", deep[0] is original[0])
    print("Deep shares Marc notes:", deep[0].notes is original[0].notes)

    alias.append(raul)
    print("After alias append, original:", rider_names(original))
    print("After alias append, list copy:", rider_names(list_copy))
    print("After alias append, deep:", rider_names(deep))

    list_copy[0].notes.append("highlight Marc")
    print("Original Marc notes:", original[0].notes)
    print("Module shallow Marc notes:", module_shallow[0].notes)
    print("Deep Marc notes:", deep[0].notes)

    deep[0].notes.append("private draft")
    print("After deep edit, original Marc notes:", original[0].notes)
    print("After deep edit, deep Marc notes:", deep[0].notes)

    module_shallow[1] = raul
    print("After shallow slot replacement, original second:", original[1].rider)
    print("After shallow slot replacement, module second:", module_shallow[1].rider)

    card_copy = copy.copy(marc)
    print("Card copy is Marc:", card_copy is marc)
    print("Card copy shares notes:", card_copy.notes is marc.notes)

    repeated = [marc, marc]
    repeated_copy = copy.deepcopy(repeated)
    print("Repeated copied entries share a card:", repeated_copy[0] is repeated_copy[1])
    print("Repeated copy shares original card:", repeated_copy[0] is marc)
    print("Recorded best laps (ms):", marc.lap_ms, fabio.lap_ms, raul.lap_ms)


if __name__ == "__main__":
    main()
```

**Why this program?** It puts the three copy patterns beside one another and edits one level at a time, so every printed identity or list change has a cause. **How to solve it:** read the initial selection-copy lines first, predict each `is` result from the object graph, then trace the four edits in order: outer-list append, shared note append, deep-copy note append, and shallow-list slot replacement.

<span id="part-5-trace"></span>

### 2. Trace the output

```text
Session: 2026 Indonesian GP Friday MotoGP Practice
Best-lap differences to Raúl (ms): Marc 701 Fabio 833
Alias is original: True
List copy is original: False
Module shallow is original: False
Deep is original: False
List copy shares Marc: True
Module shallow shares Marc: True
Deep shares Marc: False
Deep shares Marc notes: False
After alias append, original: ['Marc Márquez', 'Fabio Quartararo', 'Raúl Fernández']
After alias append, list copy: ['Marc Márquez', 'Fabio Quartararo']
After alias append, deep: ['Marc Márquez', 'Fabio Quartararo']
Original Marc notes: ['highlight Marc']
Module shallow Marc notes: ['highlight Marc']
Deep Marc notes: []
After deep edit, original Marc notes: ['highlight Marc']
After deep edit, deep Marc notes: ['private draft']
After shallow slot replacement, original second: Fabio Quartararo
After shallow slot replacement, module second: Raúl Fernández
Card copy is Marc: False
Card copy shares notes: True
Repeated copied entries share a card: True
Repeated copy shares original card: False
Recorded best laps (ms): 89426 89558 88725
```

Read the first four `is` lines as outer-list checks. The next four check whether the copies lead to the same Marc card and notes list. Appending Raúl through the alias changes `original` because they are the same list. Appending a note through `list_copy[0]` reaches the shared Marc card, so the module shallow copy sees it too. The deep copy's Marc card has a separate notes list; its later private draft stays there. Finally, replacing a slot in `module_shallow` changes only that new outer list. The last line confirms that all three sourced lap values remain unchanged.

**Why trace this output?** A line printed after an edit is evidence of which object received that edit. **How to solve it:** pair each output line with the nearest preceding mutation, then follow references from the changed object to every name that can observe it.

[🔝 Back to Top](#top)

---

<span id="part-6"></span>

## Part 6: Small Worked Cases

Treat each case as a **fresh** two-card setup, `original = [marc, fabio]`, with new empty notes lists. The `marc`, `fabio`, and `raul` cards have the sourced fields in the complete program above; any note text below is a hypothetical analyst edit.

### Case 1: A second name removes a rider from the same selection

```python
alias = original
alias.pop()
print(rider_names(original))  # ['Marc Márquez']
```

**Why this case?** Removing an element tests the same alias rule as appending one. **How to solve it:** `alias is original` is true, so `pop()` changes their one shared list. It does not change Fabio's card or his official P7 result; it only removes his card from this analyst selection.

### Case 2: A new list gets its own slot assignments

```python
shallow = original[:]
shallow[1] = raul
print(original[1].rider)  # Fabio Quartararo
print(shallow[1].rider)   # Raúl Fernández
```

**Why this case?** A slice is another familiar way to make a shallow list copy. **How to solve it:** draw two outer lists, then redirect only slot 1 of `shallow`. The original slot still points to Fabio. The list positions describe report selection order, not official Practice places.

### Case 3: A shallow list still reaches Fabio's notes

```python
shallow = list(original)
shallow[1].notes.append("check Yamaha row")
print(original[1].notes)  # ['check Yamaha row']
```

**Why this case?** Case 2's independent slot can hide the fact that the cards remain shared. **How to solve it:** follow `shallow[1]` to the same Fabio card reached by `original[1]`, then follow its `notes` reference. Both paths reach one mutable notes list.

### Case 4: A deep copy gets private Fabio notes

```python
deep = copy.deepcopy(original)
deep[1].notes.append("private Yamaha draft")
print(original[1].notes)  # []
print(deep[1].notes)      # ['private Yamaha draft']
```

**Why this case?** Fabio provides a second rider check that deep copying works for every selected card, not only Marc at index 0. **How to solve it:** mark the new outer list, new Fabio card, and new Fabio notes list before tracing the `append()` call.

### Case 5: A repeated reference stays repeated after deep copying

```python
repeated = [marc, marc]
new_repeated = copy.deepcopy(repeated)
print(new_repeated[0] is new_repeated[1])  # True
print(new_repeated[0] is marc)            # False
```

**Why this case?** It tests the subtle difference between copying an object graph and blindly creating a new object for every list position. **How to solve it:** the deep-copy memo maps the original Marc card to one new card, so both new positions point to that same new card.

[🔝 Back to Top](#top)

---

<span id="part-7"></span>

## Part 7: Summary

1. **Assignment aliases:** `alias = original` gives one list two names. An outer-list edit through either name is visible through both.
2. **Shallow copying duplicates the supplied outer object:** `list(original)` and `copy.copy(original)` make a new list but keep references to the same rider cards. List membership can diverge; edits to a shared card or its notes can still appear in both lists.
3. **Deep copying traverses the object graph:** `copy.deepcopy(original)` makes an independent list, cards, and mutable notes for the ordinary objects in this example. Its memo preserves repeated references inside the copied graph.
4. **Choose by planned edit:** share a live selection with an alias, change only selection slots with a shallow copy, or change analyst notes independently with a deep copy. Keep the sourced Practice fields separate from hypothetical notes.

For any new copy question, draw the outer list, each mutable child, and the arrows between them. Then identify the exact object being changed and the names that still reach it.

[🔝 Back to Top](#top)
