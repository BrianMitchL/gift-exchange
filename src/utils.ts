import { Configuration, Person, Validation } from './models';

export const personArrayOfLength = (length: number): Person[] =>
  new Array(length).fill(true).map((v, i) => ({ name: '' + (i + 1) }));

export const validateConfiguration = (config: Configuration): Validation => {
  const errors: string[] = [];

  // people
  if (!('people' in config)) {
    errors.push('`people` must be defined');
  } else if (!Array.isArray(config.people)) {
    errors.push('`people` must be an array');
  } else if (
    !config.people.every(
      p => typeof p === 'object' && typeof p.name === 'string'
    )
  ) {
    errors.push(
      'Each element in `people` must be an object with a `name` that is a string'
    );
  } else {
    const names = config.people.map(person => person.name);
    if (names.length !== new Set(names).size) {
      errors.push('Each name in `people` must be unique.');
    }
  }

  // exclusions
  if ('exclusions' in config) {
    if (!Array.isArray(config.exclusions)) {
      errors.push('`exclusions` must be an array');
    } else {
      if (
        !config.exclusions.every(
          e =>
            typeof e === 'object' &&
            typeof e.type === 'string' &&
            typeof e.subject === 'string' &&
            typeof e.value === 'string'
        )
      ) {
        errors.push(
          'Each exclusion must be an object and have a `type`, `subject`, and `value` that are each strings.'
        );
      } else if (
        // @ts-ignore
        config.exclusions.some(e => e.type !== 'name' && e.type !== 'group')
      ) {
        errors.push(
          "The exclusion `type` must be a a key of a Person, 'name' or 'group'."
        );
      }
    }
  }

  return {
    errors,
    valid: errors.length === 0
  };
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
