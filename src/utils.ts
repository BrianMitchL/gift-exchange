import { Configuration, Person } from './models';

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

export const shuffle = (array: any[]) => {
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
