export interface Person {
  name: string;
  group?: string;
}

export interface Exclusion {
  /**
   * Which property on the Person interface the `subject` refers to when
   * selecting the current person.
   *
   * @example 'name' or 'group'
   */
  type: keyof Person;
  /**
   * The value of the given type to select the current person.
   * Internally, we use `person[exclusion.type] === exclusion.subject` to select
   * the current person.
   */
  subject: string;
  /**
   * Which property on the Person interface the `subject` refers to when
   * selecting the excluded person.
   *
   * @example 'name' or 'group'
   */
  excludedType: keyof Person;
  /**
   * The value of the given type to select the current person.
   * Internally, we use `person[exclusion.excludedType] !== exclusion.excludedSubject`
   * to check if a the current person is allowed to match with the exclusion rule
   */
  excludedSubject: string;
}

export const personArrayOfLength = (length: number): Person[] =>
  new Array(length).fill(true).map((_, i) => ({ name: '' + (i + 1) }));

export const shuffle = <T = any>(array: T[]) => {
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

export class DerangementError extends Error {
  constructor(...params: Parameters<ErrorConstructor>) {
    super(...params);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'DerangementError';
  }
}
