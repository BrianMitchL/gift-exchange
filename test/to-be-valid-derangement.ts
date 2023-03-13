import { expect } from "vitest";
import { Exclusion, Person } from "../src";

interface CustomMatchers<R = unknown> {
  toBeValidDerangement(base: Person[], exclusions?: Exclusion[]): R;
}

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */

expect.extend({
  toBeValidDerangement(
    _: Person[] | (() => Person[]),
    base: Person[],
    exclusions: Exclusion[] = []
  ) {
    const testDerangement = (received: Person[]) => {
      if (received === base)
        return {
          message: () =>
            `the tested value and base value cannot be the same object`,
          pass: false,
        };

      if (!Array.isArray(received) || !Array.isArray(base))
        return {
          message: () => `the tested value and base value must be an array`,
          pass: false,
        };

      if (received.length !== base.length)
        return {
          message: () =>
            `the tested value must have the same length as the base array`,
          pass: false,
        };

      if (received.length > 1 && this.equals(received, base))
        return {
          message: () => `the tested value cannot equal the base value`,
          pass: false,
        };

      if (
        received.some((pA, i) => {
          const pB = base[i];

          return pA.name === pB.name;
        })
      )
        return {
          message: () => `someone is assigned themselves`,
          pass: false,
        };

      if (
        received.some((pA, i) => {
          const pB = base[i];

          return (pA.group || pB.group) && pA.group === pB.group;
        })
      )
        return {
          message: () =>
            `someone is assigned a person in the same group as themselves`,
          pass: false,
        };

      if (
        received.some((pA, i) => {
          const pB = base[i];

          return exclusions
            .filter((exclusion) => pA[exclusion.type] === exclusion.subject)
            .some(
              (exclusion) =>
                pB[exclusion.excludedType] !== exclusion.excludedSubject
            );
        })
      ) {
        return {
          message: () =>
            `a match is present that does not conform to an exclusion`,
          pass: false,
        };
      }
      return {
        message: () =>
          `the test array is a valid derangement of the given base array`,
        pass: true,
      };
    };

    if (typeof _ === "function") {
      try {
        return testDerangement(_());
      } catch (e) {
        return {
          message: () => (e instanceof Error ? e.message : String(e)),
          pass: false,
        };
      }
    } else {
      return testDerangement(_);
    }
  },
});
