const { sync } = require('load-json-file');
const { knuthShuffle } = require('knuth-shuffle');
const { matchesExclusion, validate, print } = require('./utils');

// validate arguments
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

let prettyPrint = false;
if (process.argv[3] && ['--pretty', '-p'].includes(process.argv[3])) {
  prettyPrint = true;
}

/**
 * Person
 * @typedef {Object} Person
 * @property {String} name - Unique name
 * @property {String} family - Family Person is in
 */

/**
 * @typedef {"name" | "family"} ExclusionType
 */

/**
 * Exclusion
 * @typedef {Object} Exclusion
 * @property {ExclusionType} type - Exclusion type
 * @property {Person.family | Person.name} subject - Person family or name
 * @property {Person.name} value - Person name
 */

/**
 * Configuration
 * @typedef {Object} Configuration
 * @property {Person[]} people - Array of People
 * @property {Exclusion[] | undefined} exclusions - Optional Array of Exclusions
 */

// get config
const config = sync(process.argv[2]);
// validate configuration
if (!validate(config)) process.exit(1);

/**
 * @param {Person[]} people
 * @param {Exclusion[]} exclusions
 * @returns {Array}
 */
const calculate = (people, exclusions) => {
  // clone people array
  const matches = people.map(p => ({ ...p }));
  const pairs = [];

  const validMatch = (p, m) => {
    // skip matches that have already been used
    if (pairs.map(p => p[1]).includes(m.name)) return false;
    // skip matches that are in the same family
    if (p.family === m.family) return false;
    // skip exclusions
    return (
      exclusions
        // filter exclusions to ones that we know about and that match the person
        .filter(
          e =>
            matchesExclusion(e, p, 'name') || matchesExclusion(e, p, 'family')
        )
        // reduce the array to a boolean, false if the match is the exclusion value
        .reduce((acc, e) => acc && m.name !== e.value, true)
    );
  };

  people.forEach(p => {
    let i = Math.floor(Math.random() * matches.length);
    let match = matches[i];
    const time = new Date();
    while (!validMatch(p, match)) {
      if (new Date() - time > 2000) {
        console.error('Infinite loop');
        process.exit(1);
      }
      i = Math.floor(Math.random() * matches.length);
      match = matches[i];
    }
    matches.splice(i, 1);
    pairs.push([p.name, match.name]);
  });

  return pairs;
};

const exclusions = config.exclusions || [];
const pairs = calculate(knuthShuffle(config.people), knuthShuffle(exclusions));
print(pairs, prettyPrint);
