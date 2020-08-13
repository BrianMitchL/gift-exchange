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

export class DerangementError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, DerangementError.prototype);
    this.name = 'DerangementError';
  }
}
