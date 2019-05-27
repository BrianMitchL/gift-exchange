import { matchesExclusion } from './utils';
import { Exclusion, Person } from './models';

export const calculate = (
  people: Person[],
  exclusions: Exclusion[]
): string[][] => {
  // clone people array
  const matches = people.map(p => ({ ...p }));
  const pairs: string[][] = [];

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
    const time = new Date().getTime();
    while (!validMatch(p, match)) {
      if (new Date().getTime() - time > 2000) {
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
