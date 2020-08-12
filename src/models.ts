export interface Person {
  name: string;
  group?: string;
}

export interface Exclusion {
  type: keyof Person;
  subject: string;
  value: string;
}

export class DerangementError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, DerangementError.prototype);
    this.name = 'DerangementError';
  }
}
