export interface Person {
  name: string;
  family: string;
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
