import { Configuration, DerangementError, Exclusion, Person } from './models';

export const personArrayOfLength = (length: number): Person[] =>
  new Array(length).fill(true).map((v, i) => ({ name: '' + (i + 1) }));

export const validateConfiguration = (config: Configuration): boolean => {
  const prefix = 'Invalid configuration: ';
  if (!('people' in config)) {
    console.error(`${prefix}There must be a people array.`);
    return false;
  }
  const names = config.people.map(person => person.name);
  if (names.length !== new Set(names).size) {
    console.error(`${prefix}Each name must be unique.`);
    return false;
  }

  if ('exclusions' in config) {
    if (!config.exclusions.every(e => !!e.type && !!e.subject && !!e.value)) {
      console.error(
        `${prefix}Each exclusion must have a type, subject, and value.`
      );
      return false;
    }
    // @ts-ignore
    if (config.exclusions.some(e => e.type !== 'name' || e.type !== 'group')) {
      console.error(
        `${prefix}The exclusion type must be a a key of a Person, 'name' or 'group'.`
      );
      return false;
    }
  }
  return true;
};

export const print = (a: Person[], b: Person[], pretty = false): void => {
  const pairs = a.map((pA, i) => ({ from: pA.name, to: b[i].name }));
  if (pretty) {
    console.table(pairs);
  } else {
    console.log(pairs);
  }
};

const shuffle = (array: any[]) => {
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
};

type ValidateMatches = (
  a: Person[],
  b: Person[],
  exclusions?: Exclusion[]
) => boolean;

export const isValid: ValidateMatches = (a, b, exclusions = []) => {
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
        // filter to exclusions to subjects that match pA
        .filter(exclusion => pA[exclusion.type] === exclusion.subject)
        // reject pB if the name equals the exclusion value
        .every(exclusion => pB.name !== exclusion.value)
    );
  });
};

export const derange = (
  people: readonly Person[],
  exclusions: Exclusion[] = []
): Person[] => {
  if (people.length < 2) {
    return people.slice(0);
  }

  let buffer1 = [];
  let buffer2 = [];

  // https://www.youtube.com/watch?v=5kC5k5QBqcc
  const shuffleAndSlide = () => {
    const shuffled = shuffle([...people]);
    buffer1 = shuffled.slice(0);
    buffer2 = shuffled.slice(0);

    // slide each element over by one on buffer2
    buffer2.push(buffer2.shift());
  };

  let now = new Date();
  const testDerangement: ValidateMatches = (...args): boolean => {
    // prevent infinite loops when no combination is found
    if (new Date().getTime() - now.getTime() > 1e3)
      throw new DerangementError('No derangement found');
    return isValid(...args);
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
