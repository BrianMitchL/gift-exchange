# gift-exchange [![Build Status](https://travis-ci.org/BrianMitchL/gift-exchange.svg?branch=master)](https://travis-ci.org/BrianMitchL/gift-exchange)[![Coverage Status](https://coveralls.io/repos/github/BrianMitchL/gift-exchange/badge.svg?branch=master)](https://coveralls.io/github/BrianMitchL/gift-exchange?branch=master)

An algorithm to generate unbiased pairs of names for a gift exchange or secret
santa.

No person can be matched with themselves, anyone in the same group as
themselves, or against any of the custom exclusions that can be set.

## Install

```shell script
npm i gift-exchange
```

## Usage

`gift-exchange` exports two functions (`calculate` and `calculateSync`) and an
Error, `DerangementError`.

A `Person` array is always required. A `Person` must have a unique `name` and
optionally a `group`. A `Person` cannot be matched with another person in the
same `group` nor with themselves. A mix of people that both have and do not
have a `group` is supported.

```typescript
import { Person } from 'gift-exchange';

const people: Person[] = [
  {
    name: 'Brian',
    group: 'Mitchell'
  },
  {
    name: 'Freja'
  }
];
```

### `calculate`

This returns a Promise that resolves with a new array of people or
rejects with a `DerangementError`. This error is thrown if the matching
algorithm fails to find a valid match after 1 second, indicating that an
impossible combination of people and exclusions was provided.

```typescript
import { calculate, Person } from 'gift-exchange';

const people: Person[] = [
  {
    name: 'Brian'
  },
  {
    name: 'Freja'
  }
];

calculate(people).then(matches => {
  const pairs: { from: string; to: string }[] = people.map((pA, i) => ({
    from: pA.name,
    to: matches[i].name
  }));
  console.table(pairs);
});
```

### `calculateSync`

This returns a new array of people or throws a `DerangementError` if
the matching algorithm fails to find a valid match after 1 second, indicating
that an impossible combinations of people and exclusions was provided.

```typescript
import { calculateSync, Person } from 'gift-exchange';

const people: Person[] = [
  {
    name: 'Brian'
  },
  {
    name: 'Freja'
  }
];

try {
  const matches = calculateSync(people);
  const pairs: { from: string; to: string }[] = people.map((pA, i) => ({
    from: pA.name,
    to: matches[i].name
  }));
  console.table(pairs);
} catch (e) {
  console.error(e);
}
```

### Exclusions

The `calculate` and `calculateSync` functions can also be called with a second
argument `exclusions`. This builds upon the concept that no person can match
another in the same group.

There are two exclusion types, one of type `name` and one of type
`group`. The `type` refers to a key on the `Person` interface. The `subject` is
a selector for any number of people that have the given `type` equal to the
`subject`. The `value` always refers to a `Person`s `name` that the
`type` `subject` pair cannot match with.

```typescript
import { Person, Exclusion } from 'gift-exchange';

const people: Person[] = [
  {
    name: 'Brian',
    group: 'Mitchell'
  },
  {
    name: 'Freja',
    group: 'Andersen'
  }
];
const exclusions: Exclusion[] = [
  // a person with the name "Brian" cannot be assigned to a person with the name
  // "Freja" (but "Freja" could still be assigned to "Brian")
  {
    type: 'name',
    subject: 'Brian',
    value: 'Freja'
  },
  // anyone with the group "Andersen" cannot be assigned to a person with the
  // name "Brian"
  {
    type: 'group',
    subject: 'Andersen',
    value: 'Brian'
  }
];
```

## Notes

The algorithm is based off of Dr Hannah Dry's solution for secret santa as
described in Numberphile video
[The Problems with Secret Santa](https://www.youtube.com/watch?v=5kC5k5QBqcc&t=484).
This type of problem is called a
[derangement](https://en.wikipedia.org/wiki/Derangement). This approach gives
each person an equal chance for being matched with any other person. A
derangement is made, and then checked for the same group followed by each
exclusion in the list of exclusions. If the derangement does not satisfy each
exclusion rule, the list of people is shuffled and a new derangement is made.
