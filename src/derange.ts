import { DerangementError, Exclusion, Person } from './models';
import { shuffle } from './utils';

export type ValidateMatches = (
  a: Person[],
  b: Person[],
  exclusions?: Exclusion[]
) => boolean;

export const validateMatches: ValidateMatches = (a, b, exclusions = []) => {
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
        // reject pB if the name equals the exclusion value
        .every(exclusion => pB.name !== exclusion.value)
    );
  });
};

export const derange = (
  people: Person[],
  exclusions: Exclusion[] = []
): Person[] => {
  if (people.length < 2) {
    return people.slice(0);
  }

  let buffer1: Person[] = [];
  let buffer2: Person[] = [];

  // https://www.youtube.com/watch?v=5kC5k5QBqcc
  const shuffleAndSlide = () => {
    const shuffled = shuffle([...people]);
    buffer1 = shuffled.slice(0);
    buffer2 = shuffled.slice(0);

    // slide each element over by one on buffer2
    buffer2.push(buffer2.shift());
  };

  const startTime = Date.now();
  const testDerangement: ValidateMatches = (...args): boolean => {
    // prevent infinite loops when no combination is found
    if (Date.now() - startTime > 1e3)
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
};

export const calculate = async (
  people: Person[],
  exclusions: Exclusion[] = []
): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(derange(people, exclusions));
    } catch (e) {
      reject(e);
    }
  });
};
