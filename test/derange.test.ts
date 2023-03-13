import { describe, expect, it } from 'vitest';
// I'm not sure how to configure TypeScript in a way that works with this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import './to-be-valid-derangement';
import { calculate, validateMatches, Exclusion, Person } from '../src';

const personArrayOfLength = (length: number): Person[] =>
  new Array(length).fill(true).map((_, i) => ({ name: '' + (i + 1) }));

describe('validateMatches', () => {
  it('marks empty arrays as valid', () => {
    expect(validateMatches([], [])).toBeTruthy();
  });

  it('marks arrays of different lengths as invalid', () => {
    expect(validateMatches([{ name: '1' }], [])).toBeFalsy();
  });

  it('marks an array with a length of one as invalid', () => {
    expect(validateMatches([{ name: '1' }], [{ name: '1' }])).toBeFalsy();
  });

  it('marks as invalid when the same name has itself', () => {
    expect(
      validateMatches(
        [{ name: '1' }, { name: '2' }],
        [{ name: '1' }, { name: '2' }]
      )
    ).toBeFalsy();
  });

  it('marks as invalid when the same group has itself', () => {
    expect(
      validateMatches(
        [
          { name: '1', group: 'a' },
          { name: '2', group: 'a' }
        ],
        [
          { name: '2', group: 'a' },
          { name: '1', group: 'a' }
        ]
      )
    ).toBeFalsy();
  });

  it('marks arrays with groups as valid', () => {
    const input: Person[] = [
      { name: '1', group: 'a' },
      { name: '2', group: 'a' },
      { name: '3', group: 'b' },
      { name: '4', group: 'b' }
    ];

    const a: Person[] = [
      { name: '3', group: 'b' },
      { name: '4', group: 'b' },
      { name: '1', group: 'a' },
      { name: '2', group: 'a' }
    ];
    const b: Person[] = [
      { name: '3', group: 'b' },
      { name: '4', group: 'b' },
      { name: '2', group: 'a' },
      { name: '1', group: 'a' }
    ];
    const c: Person[] = [
      { name: '4', group: 'b' },
      { name: '3', group: 'b' },
      { name: '1', group: 'a' },
      { name: '2', group: 'a' }
    ];
    const d: Person[] = [
      { name: '4', group: 'b' },
      { name: '3', group: 'b' },
      { name: '2', group: 'a' },
      { name: '1', group: 'a' }
    ];
    expect(validateMatches(input, a)).toBeTruthy();
    expect(validateMatches(input, b)).toBeTruthy();
    expect(validateMatches(input, c)).toBeTruthy();
    expect(validateMatches(input, d)).toBeTruthy();
  });

  it('treats a mix of groups being defined correctly', () => {
    const input: Person[] = [
      { name: '1', group: 'a' },
      { name: '2', group: 'a' },
      { name: '3' },
      { name: '4' }
    ];

    const a: Person[] = [
      { name: '3' },
      { name: '4' },
      { name: '1', group: 'a' },
      { name: '2', group: 'a' }
    ];
    const b: Person[] = [
      { name: '3' },
      { name: '4' },
      { name: '2', group: 'a' },
      { name: '1', group: 'a' }
    ];
    const c: Person[] = [
      { name: '4' },
      { name: '3' },
      { name: '1', group: 'a' },
      { name: '2', group: 'a' }
    ];
    const d: Person[] = [
      { name: '4' },
      { name: '3' },
      { name: '2', group: 'a' },
      { name: '1', group: 'a' }
    ];
    expect(validateMatches(input, a)).toBeTruthy();
    expect(validateMatches(input, b)).toBeTruthy();
    expect(validateMatches(input, c)).toBeTruthy();
    expect(validateMatches(input, d)).toBeTruthy();
  });

  it('validates complete three person array', () => {
    const input = personArrayOfLength(3);

    const a: Person[] = [{ name: '1' }, { name: '2' }, { name: '3' }];
    const b: Person[] = [{ name: '1' }, { name: '3' }, { name: '2' }];
    const c: Person[] = [{ name: '2' }, { name: '1' }, { name: '3' }];
    const d: Person[] = [{ name: '2' }, { name: '3' }, { name: '1' }];
    const e: Person[] = [{ name: '3' }, { name: '1' }, { name: '2' }];
    const f: Person[] = [{ name: '3' }, { name: '2' }, { name: '1' }];
    expect(validateMatches(input, a)).toBeFalsy();
    expect(validateMatches(input, b)).toBeFalsy();
    expect(validateMatches(input, c)).toBeFalsy();
    expect(validateMatches(input, d)).toBeTruthy();
    expect(validateMatches(input, e)).toBeTruthy();
    expect(validateMatches(input, f)).toBeFalsy();
  });

  describe('exclusions', () => {
    it('validates that p.name:1 cannot match p.name:2', () => {
      const input = personArrayOfLength(3);
      const exclusions: Exclusion[] = [
        {
          type: 'name',
          subject: '1', // a person with the name (set above in `type`) of '1'
          excludedType: 'name',
          excludedSubject: '2' // cannot match this person.name
        }
      ];

      const a: Person[] = [{ name: '1' }, { name: '2' }, { name: '3' }];
      const b: Person[] = [{ name: '1' }, { name: '3' }, { name: '2' }];
      const c: Person[] = [{ name: '2' }, { name: '1' }, { name: '3' }];
      const d: Person[] = [{ name: '2' }, { name: '3' }, { name: '1' }];
      const e: Person[] = [{ name: '3' }, { name: '1' }, { name: '2' }];
      const f: Person[] = [{ name: '3' }, { name: '2' }, { name: '1' }];
      expect(validateMatches(input, a, exclusions)).toBeFalsy();
      expect(validateMatches(input, b, exclusions)).toBeFalsy();
      expect(validateMatches(input, c, exclusions)).toBeFalsy();
      expect(validateMatches(input, d, exclusions)).toBeFalsy();
      expect(validateMatches(input, e, exclusions)).toBeTruthy();
      expect(validateMatches(input, f, exclusions)).toBeFalsy();
    });

    it('validates that p.name:2 cannot match p.name:1', () => {
      const input = personArrayOfLength(3);
      const exclusions: Exclusion[] = [
        {
          type: 'name',
          subject: '2', // a person with the name (set above in `type`) of '2'
          excludedType: 'name',
          excludedSubject: '1' // cannot match this person.name
        }
      ];

      const a: Person[] = [{ name: '1' }, { name: '2' }, { name: '3' }];
      const b: Person[] = [{ name: '1' }, { name: '3' }, { name: '2' }];
      const c: Person[] = [{ name: '2' }, { name: '1' }, { name: '3' }];
      const d: Person[] = [{ name: '2' }, { name: '3' }, { name: '1' }];
      const e: Person[] = [{ name: '3' }, { name: '1' }, { name: '2' }];
      const f: Person[] = [{ name: '3' }, { name: '2' }, { name: '1' }];
      expect(validateMatches(input, a, exclusions)).toBeFalsy();
      expect(validateMatches(input, b, exclusions)).toBeFalsy();
      expect(validateMatches(input, c, exclusions)).toBeFalsy();
      expect(validateMatches(input, d, exclusions)).toBeTruthy();
      expect(validateMatches(input, e, exclusions)).toBeFalsy();
      expect(validateMatches(input, f, exclusions)).toBeFalsy();
    });

    it('validates that p.group:a cannot match p.name:1', () => {
      const input: Person[] = [
        { name: '1' },
        { name: '2' },
        { name: '3', group: 'a' }
      ];
      const exclusions: Exclusion[] = [
        {
          type: 'group',
          subject: 'a', // a person with the group (set above in `type`) of 'a'
          excludedType: 'name',
          excludedSubject: '1' // cannot match this person.name
        }
      ];

      const a: Person[] = [
        { name: '1' },
        { name: '2' },
        { name: '3', group: 'a' }
      ];
      const b: Person[] = [
        { name: '1' },
        { name: '3', group: 'a' },
        { name: '2' }
      ];
      const c: Person[] = [
        { name: '2' },
        { name: '1' },
        { name: '3', group: 'a' }
      ];
      const d: Person[] = [
        { name: '2' },
        { name: '3', group: 'a' },
        { name: '1' }
      ];
      const e: Person[] = [
        { name: '3', group: 'a' },
        { name: '1' },
        { name: '2' }
      ];
      const f: Person[] = [
        { name: '3', group: 'a' },
        { name: '2' },
        { name: '1' }
      ];
      expect(validateMatches(input, a, exclusions)).toBeFalsy();
      expect(validateMatches(input, b, exclusions)).toBeFalsy();
      expect(validateMatches(input, c, exclusions)).toBeFalsy();
      expect(validateMatches(input, d, exclusions)).toBeFalsy();
      expect(validateMatches(input, e, exclusions)).toBeTruthy();
      expect(validateMatches(input, f, exclusions)).toBeFalsy();
    });

    it('validates that p.name:1 cannot match p.group:a', () => {
      const input: Person[] = [
        { name: '1' },
        { name: '2' },
        { name: '3', group: 'a' }
      ];
      const exclusions: Exclusion[] = [
        {
          type: 'name',
          subject: '1', // a person with the name (set above in `type`) of '1'
          excludedType: 'group',
          excludedSubject: 'a' // cannot match this person.group
        }
      ];

      const a: Person[] = [
        { name: '1' },
        { name: '2' },
        { name: '3', group: 'a' }
      ];
      const b: Person[] = [
        { name: '1' },
        { name: '3', group: 'a' },
        { name: '2' }
      ];
      const c: Person[] = [
        { name: '2' },
        { name: '1' },
        { name: '3', group: 'a' }
      ];
      const d: Person[] = [
        { name: '2' },
        { name: '3', group: 'a' },
        { name: '1' }
      ];
      const e: Person[] = [
        { name: '3', group: 'a' },
        { name: '1' },
        { name: '2' }
      ];
      const f: Person[] = [
        { name: '3', group: 'a' },
        { name: '2' },
        { name: '1' }
      ];
      expect(validateMatches(input, a, exclusions)).toBeFalsy();
      expect(validateMatches(input, b, exclusions)).toBeFalsy();
      expect(validateMatches(input, c, exclusions)).toBeFalsy();
      expect(validateMatches(input, d, exclusions)).toBeTruthy();
      expect(validateMatches(input, e, exclusions)).toBeFalsy();
      expect(validateMatches(input, f, exclusions)).toBeFalsy();
    });
  });
});

describe('calculate', () => {
  it('returns empty array when given an empty array', () => {
    expect(calculate([])).toEqual([]);
  });

  it('returns an equal array when given an array of length one', () => {
    expect(calculate([{ name: '1' }])).toEqual([{ name: '1' }]);
  });

  it('calculates a list of 3 people', () => {
    const input = personArrayOfLength(3);
    expect(calculate(input)).toBeValidDerangement(input);
  });

  it('calculates a list of 500 people', () => {
    const input = personArrayOfLength(500);
    expect(calculate(input)).toBeValidDerangement(input);
  });

  it('calculates with groups', () => {
    const input: Person[] = [
      { name: '1', group: 'a' },
      { name: '2', group: 'a' },
      { name: '3', group: 'b' },
      { name: '4', group: 'b' }
    ];

    expect(calculate(input)).toBeValidDerangement(input);
  });

  it('throws an error when an impossible combination is received', () => {
    const input = personArrayOfLength(3);
    const exclusions: Exclusion[] = [
      {
        type: 'name',
        subject: '2',
        excludedType: 'name',
        excludedSubject: '1'
      },
      {
        type: 'name',
        subject: '1',
        excludedType: 'name',
        excludedSubject: '2'
      }
    ];

    expect(() => calculate(input, exclusions)).toThrowError();
    expect(() => calculate(input, exclusions)).not.toBeValidDerangement(input);
  });

  it('throws an error when an impossible combination is received with a custom timeout', () => {
    const input = personArrayOfLength(3);
    const exclusions: Exclusion[] = [
      {
        type: 'name',
        subject: '2',
        excludedType: 'name',
        excludedSubject: '1'
      },
      {
        type: 'name',
        subject: '1',
        excludedType: 'name',
        excludedSubject: '2'
      }
    ];

    const start = Date.now();

    expect(() => calculate(input, { exclusions, timeout: 10 })).toThrowError();
    expect(() =>
      calculate(input, { exclusions, timeout: 10 })
    ).not.toBeValidDerangement(input);

    expect(Date.now() - start).toBeGreaterThanOrEqual(20);
  });

  it('calculates with a name exclusion', () => {
    const input = personArrayOfLength(3);
    const exclusions: Exclusion[] = [
      {
        type: 'name',
        subject: '2',
        excludedType: 'name',
        excludedSubject: '1'
      }
    ];

    expect(calculate(input, exclusions)).toBeValidDerangement(input);
  });

  it('calculates with a name exclusion using object argument syntax', () => {
    const input = personArrayOfLength(3);
    const exclusions: Exclusion[] = [
      {
        type: 'name',
        subject: '2',
        excludedType: 'name',
        excludedSubject: '1'
      }
    ];

    expect(calculate(input, { exclusions })).toBeValidDerangement(input);
  });

  it('calculates with a group exclusion', () => {
    const input = personArrayOfLength(3);
    input[0].group = 'a';
    const exclusions: Exclusion[] = [
      {
        type: 'name',
        subject: '2',
        excludedType: 'group',
        excludedSubject: 'a'
      }
    ];

    expect(calculate(input, exclusions)).toBeValidDerangement(input);
  });
});
