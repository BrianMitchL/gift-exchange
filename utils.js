/**
 * Validate the configuration file.
 * @param {Configuration} config - configuration object
 * @return {boolean} - configuration validity
 */
exports.validate = config => {
  const prefix = 'Invalid JSON file: ';
  if (!'people' in config) {
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

/**
 * @param {Exclusion} exclusion
 * @param {Person} person
 * @param {ExclusionType} exclusionType
 * @returns {boolean}
 */
exports.matchesExclusion = (exclusion, person, exclusionType) =>
  exclusion.type === exclusionType &&
  person[exclusionType] === exclusion.subject;
