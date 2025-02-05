export interface Person {
  name: string;
  group?: string;
}

export interface Exclusion {
  /**
   * Which property on the Person interface the `subject` refers to when
   * selecting the current person.
   *
   * @example 'name' or 'group'
   */
  type: keyof Person;
  /**
   * The value of the given type to select the current person.
   * Internally, we use `person[exclusion.type] === exclusion.subject` to select
   * the current person.
   */
  subject: string;
  /**
   * Which property on the Person interface the `subject` refers to when
   * selecting the excluded person.
   *
   * @example 'name' or 'group'
   */
  excludedType: keyof Person;
  /**
   * The value of the given type to select the current person.
   * Internally, we use `person[exclusion.excludedType] !== exclusion.excludedSubject`
   * to check if a the current person is allowed to match with the exclusion rule
   */
  excludedSubject: string;
}

function shuffle<T = unknown>(array: T[]) {
  let i = array.length;
  let j;

  while (i !== 0) {
    j = Math.floor(Math.random() * i);
    i -= 1;

    const swap = array[i];
    array[i] = array[j];
    array[j] = swap;
  }

  return array;
}

export function validateMatches(
  a: Person[],
  b: Person[],
  exclusions: Exclusion[] = [],
) {
  if (a.length !== b.length) return false;

  // pA - person a, pB - person b
  return a.every((pA, i) => {
    const pB = b[i];
    // skip matches that are the same name
    if (pA.name === pB.name) return false;
    // skip matches that are in the same group, if groups are defined
    if ((pA.group || pB.group) && pA.group === pB.group) return false;

    return (
      exclusions
        // filter to exclusions of subjects that match pA
        .filter((exclusion) => pA[exclusion.type] === exclusion.subject)
        // reject pB if they have an excludedType of excludedValue
        .every(
          (exclusion) =>
            pB[exclusion.excludedType] !== exclusion.excludedSubject,
        )
    );
  });
}

export function calculate(
  people: Person[],
  exclusionsOrOptions?:
    | { exclusions?: Exclusion[]; timeout?: number }
    | Exclusion[],
): Person[] {
  if (people.length < 2) {
    return people.slice(0);
  }
  let exclusions: Exclusion[];
  let timeout = 1000;
  if (Array.isArray(exclusionsOrOptions)) {
    exclusions = exclusionsOrOptions;
  } else {
    exclusions = exclusionsOrOptions?.exclusions ?? [];
    timeout = exclusionsOrOptions?.timeout ?? 1000;
  }

  let buffer1: Person[] = [];
  let buffer2: Person[] = [];

  // https://www.youtube.com/watch?v=5kC5k5QBqcc
  const shuffleAndSlide = () => {
    const shuffled = shuffle(people.slice());
    buffer1 = shuffled.slice(0);
    buffer2 = shuffled.slice(0);

    // slide each element over by one on buffer2.
    // we check the people array before this, and are mutating buffers for
    // performance, so it is safe to use a non-null assertion here.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    buffer2.push(buffer2.shift()!);
  };

  const startTime = Date.now();
  const testDerangement: typeof validateMatches = (...args) => {
    // prevent infinite loops when no combination is found
    if (Date.now() - startTime > timeout) {
      const error = new Error("No combinations found");
      error.name = "GiftExchangeError";
      throw error;
    }
    return validateMatches(...args);
  };

  shuffleAndSlide();
  while (!testDerangement(buffer1, buffer2, exclusions)) {
    shuffleAndSlide();
  }

  // map back to the order of the given person argument
  return people.map((p) => {
    const personIndex = buffer1.findIndex((match) => match.name === p.name);
    return buffer2[personIndex];
  });
}
