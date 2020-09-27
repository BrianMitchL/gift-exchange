import { DerangementError, Exclusion, Person, shuffle } from './utils';

export type ValidateMatches = (
  a: Person[],
  b: Person[],
  exclusions?: Exclusion[]
) => boolean;

export const validateMatches: ValidateMatches = (
  a,
  b,
  exclusions = [] as Exclusion[]
) => {
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
        .filter(exclusion => pA[exclusion.type] === exclusion.subject)
        // reject pB if they have an excludedType of excludedValue
        .every(
          exclusion => pB[exclusion.excludedType] !== exclusion.excludedSubject
        )
    );
  });
};

export function derange(people: Person[], exclusions?: Exclusion[]): Person[];
export function derange(
  people: Person[],
  options?: { exclusions?: Exclusion[]; timeout?: number }
): Person[];

export function derange(
  people: Person[],
  exclusionsOrOptions?:
    | { exclusions?: Exclusion[]; timeout?: number }
    | Exclusion[]
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
    const shuffled = shuffle([...people]);
    buffer1 = shuffled.slice(0);
    buffer2 = shuffled.slice(0);

    // slide each element over by one on buffer2
    buffer2.push(buffer2.shift()!);
  };

  const startTime = Date.now();
  const testDerangement: ValidateMatches = (...args): boolean => {
    // prevent infinite loops when no combination is found
    if (Date.now() - startTime > timeout)
      throw new DerangementError('No derangement found');
    return validateMatches(...args);
  };

  shuffleAndSlide();
  while (!testDerangement(buffer1, buffer2, exclusions)) {
    shuffleAndSlide();
  }

  // map back to the order of the given person argument
  return people.map(p => {
    const personIndex = buffer1.findIndex(match => match.name === p.name);
    return buffer2[personIndex];
  });
}

export function calculate(people: Person[], exclusions?: Exclusion[]): Promise<Person[]>;
export function calculate(
  people: Person[],
  options?: { exclusions?: Exclusion[]; timeout?: number }
): Promise<Person[]>;
/**
 * @deprecated
 * This is thread blocking, even when in wrapped in a Promise
 * A better non-blocking approach would be to wrap the call in a WebWorker
 */
export function calculate(
  people: Person[],
  exclusionsOrOptions?: any
): Promise<Person[]> {
  return new Promise((resolve, reject) => {
    try {
      resolve(derange(people, exclusionsOrOptions));
    } catch (e) {
      reject(e);
    }
  });
}
