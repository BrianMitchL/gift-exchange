import "vitest";
import { Exclusion, Person } from "./src";

interface CustomMatchers<R = unknown> {
  toBeValidDerangement(base: Person[], exclusions?: Exclusion[]): R;
}

declare module "vitest" {
  // eslint-disable-next-line
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
