import '../to-be-valid-derangement';
import { calculate, derange, validateMatches } from '../src/derange';
import { personArrayOfLength } from '../src/utils';
import { DerangementError, Exclusion, Person } from '../src/models';

describe('derange', () => {
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
          [{ name: '1', group: 'a' }, { name: '2', group: 'a' }],
          [{ name: '2', group: 'a' }, { name: '1', group: 'a' }]
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
            value: '2' // cannot match this person.name
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
            value: '1' // cannot match this person.name
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
            value: '1' // cannot match this person.name
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
    });
  });

  describe('derange', () => {
    it('returns empty array when given an empty array', () => {
      expect(derange([])).toEqual([]);
    });

    it('returns an equal array when given an array of length one', () => {
      expect(derange([{ name: '1' }])).toEqual([{ name: '1' }]);
    });

    it('deranges a list of 3 people', () => {
      const input = personArrayOfLength(3);
      expect(derange(input)).toBeValidDerangement(input);
    });

    it('deranges a list of 500 people', () => {
      const input = personArrayOfLength(500);
      expect(derange(input)).toBeValidDerangement(input);
    });

    it('deranges with groups', () => {
      const input: Person[] = [
        { name: '1', group: 'a' },
        { name: '2', group: 'a' },
        { name: '3', group: 'b' },
        { name: '4', group: 'b' }
      ];

      expect(derange(input)).toBeValidDerangement(input);
    });

    it('throws an error when an impossible combination is received', () => {
      const input = personArrayOfLength(3);
      const exclusions: Exclusion[] = [
        {
          type: 'name',
          subject: '2',
          value: '1'
        },
        {
          type: 'name',
          subject: '1',
          value: '2'
        }
      ];

      expect(() => derange(input, exclusions)).toThrowError();
      expect(() => derange(input, exclusions)).not.toBeValidDerangement(input);
    });

    it('deranges with a name exclusion', () => {
      const input = personArrayOfLength(3);
      const exclusions: Exclusion[] = [
        {
          type: 'name',
          subject: '2',
          value: '1'
        }
      ];

      expect(derange(input, exclusions)).toBeValidDerangement(input);
    });
  });

  describe('calculate', () => {
    it('calculates exchanges', async () => {
      const input = personArrayOfLength(50);
      const result = await calculate(input);
      expect(result).toBeValidDerangement(input);
    });

    it('rejects Promise when given impossible exclusions', async () => {
      const input = personArrayOfLength(3);
      const exclusions: Exclusion[] = [
        {
          type: 'name',
          subject: '2',
          value: '1'
        },
        {
          type: 'name',
          subject: '1',
          value: '2'
        }
      ];
      try {
        await calculate(input, exclusions);
        expect(true).toBeFalsy();
      } catch (e) {
        expect(e instanceof DerangementError).toBeTruthy();
      }
    });
  });
});
