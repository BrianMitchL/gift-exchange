import { Configuration, Exclusion, Person } from './models';

export const validate = (config: Configuration): boolean => {
  const prefix = 'Invalid JSON file: ';
  if (!('people' in config)) {
    console.error(`${prefix}There must be a people array.`);
    return false;
  }
  const names = config.people.map(person => person.name);
  if (names.length !== new Set(names).size) {
    console.error(`${prefix}Each name must be unique.`);
    return false;
  }
  if (!config.people.every(p => !!p.family)) {
    console.error(`${prefix}Each person must have a family.`);
    return false;
  }
  if ('exclusions' in config) {
    if (!config.exclusions.every(e => !!e.type && !!e.subject && !!e.value)) {
      console.error(
        `${prefix}Each exclusion must have a type, subject, and value.`
      );
      return false;
    }
  }
  return true;
};

export const matchesExclusion = (
  exclusion: Exclusion,
  person: Person,
  exclusionType: Exclusion['type']
): boolean =>
  exclusion.type === exclusionType &&
  person[exclusionType] === exclusion.subject;

export const print = (pairs: string[][], pretty = false): void => {
  if (pretty) {
    console.table(pairs.map(p => ({ from: p[0], to: p[1] })));
  } else {
    console.log(pairs);
  }
};
