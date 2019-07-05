import { Exclusion, Person } from './models';
import { derange } from './utils';

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
