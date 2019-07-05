export interface Person {
  name: string;
  group?: string;
}

export interface Exclusion {
  type: keyof Person;
  subject: string;
  value: string;
}

export interface Configuration {
  people: Person[];
  exclusions?: Exclusion[];
}

export class DerangementError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, DerangementError.prototype);
    this.name = 'DerangementError';
  }
}
