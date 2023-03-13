# gift-exchange [![npm](https://img.shields.io/npm/v/gift-exchange)](https://www.npmjs.com/package/gift-exchange) ![CI](https://github.com/BrianMitchL/gift-exchange/workflows/CI/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/BrianMitchL/gift-exchange/badge.svg?branch=master)](https://coveralls.io/github/BrianMitchL/gift-exchange?branch=master)

An algorithm to generate unbiased pairs of names for a gift exchange or secret
santa.

No person can be matched with themselves, anyone in the same group as
themselves, or against any of the custom exclusions that can be set.

## Install

```shell script
npm i gift-exchange
```

## Usage

The library ships CommonJS, ES module, and UMD builds. The UMD build makes the
library available with the `GiftExchange` name.

### `calculate`

```typescript
function calculate(people: Person[], exclusions?: Exclusion[]): Person[];
// or
function calculate(
  people: Person[],
  options?: {
    exclusions?: Exclusion[];
    timeout?: number;
  }
): Person[];
```

A `Person` array is always required. A `Person` must have a unique `name` and
optionally a `group`. A `Person` cannot be matched with another person in the
same `group` nor with themselves. A mix of people that both have and do not
have a `group` is supported. Additional exclusion logic can be configured with
[Exclusions](#exclusions).

`calculate` returns a new `Person` array or throws an Error if
the matching algorithm fails to find a valid match after 1 second (or custom
timeout, if provided), indicating that an impossible combination of people and
exclusions was provided. If given an impossible configuration or one with few
possible matches, and many people, this will block the thread. To avoid this,
it is recommended to run the script in a WebWorker.

```typescript
import { calculate, Person } from "gift-exchange";

const people: Person[] = [
  {
    name: "Brian",
  },
  {
    name: "Freja",
  },
];

try {
  const matches = calculate(people);
  const pairs: { from: string; to: string }[] = people.map((person, i) => ({
    from: person.name,
    to: matches[i].name,
  }));
  console.table(pairs);
} catch (e) {
  console.error(e);
}
```

### `validateMatches`

```typescript
validateMatches(a: Person[], b: Person[], exclusions?: Exclusion[]): boolean;
```

This is an internal helper function that validates that two `Person` arrays
and an optional `Exclusion` array are valid matches where no person is matched
with themselves, in the same group, or violating any exclusions. This could
be helpful if you are creating your own implementation.

### Exclusions

Exclusions build beyond the existing concept that no person can match another
in the same group.

Exclusions are single directional. Use the `type` and `subject` properties to
select a base Person or group of Persons (base selection). Then select an
`excludedType` and `excludedSubject` to select the Person or group of Persons
that the base selection cannot be matched with.

The There are two exclusion types, one of type `name` and one of type
`group`. The `type` refers to a key on the `Person` interface. The `subject` is
a selector for any number of people that have the given `type` equal to the
`subject`.

```typescript
import { Person, Exclusion } from "gift-exchange";

const people: Person[] = [
  {
    name: "Brian",
    group: "Mitchell",
  },
  {
    name: "Freja",
    group: "Andersen",
  },
];
const exclusions: Exclusion[] = [
  // a person with the name "Brian" cannot be assigned to a person with the name
  // "Freja" (but "Freja" could still be assigned to "Brian")
  {
    type: "name",
    subject: "Brian",
    excludedType: "name",
    excludedSubject: "Freja",
  },
  // anyone with the group "Andersen" cannot be assigned to a person with the
  // name "Brian"
  {
    type: "group",
    subject: "Andersen",
    excludedType: "name",
    excludedSubject: "Brian",
  },
  // anyone with the group "Andersen" cannot be assigned to a person with the
  // group "Mitchell"
  {
    type: "group",
    subject: "Andersen",
    excludedType: "group",
    excludedSubject: "Mitchell",
  },
];
```

## Notes

The algorithm is based off of Dr Hannah Dry's solution for secret santa as
described in Numberphile video
[The Problems with Secret Santa](https://www.youtube.com/watch?v=5kC5k5QBqcc&t=484).
This type of problem is called a
[derangement](https://en.wikipedia.org/wiki/Derangement). This approach gives
each person an equal chance for being matched with any other person. We make a
derangement, then check for the same group followed by each
exclusion in the list of exclusions. If the derangement does not satisfy each
exclusion rule, then we shuffle the list of people and make a new derangement.
