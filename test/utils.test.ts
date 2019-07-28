import {
  personArrayOfLength,
  shuffle,
  validateConfiguration
} from '../src/utils';
import { Configuration, Validation } from '../src/models';

describe('utils', () => {
  describe('personArrayOfLength', () => {
    it('creates a Person array of specified length', () => {
      expect(personArrayOfLength(0)).toEqual([]);
      expect(personArrayOfLength(1)).toEqual([{ name: '1' }]);
      expect(personArrayOfLength(2)).toEqual([{ name: '1' }, { name: '2' }]);
    });

    it('throws when creating an array with a negative length', () => {
      expect(() => personArrayOfLength(-3)).toThrow(RangeError);
    });
  });

  describe('validateConfiguration', () => {
    it('validates the simplest config', () => {
      const config: Configuration = {
        people: []
      };

      const expected: Validation = { errors: [], valid: true };
      expect(validateConfiguration(config)).toEqual(expected);
    });

    it('returns as invalid when config.people is not defined', () => {
      const expected: Validation = {
        errors: ['`people` must be defined'],
        valid: false
      };

      // @ts-ignore
      expect(validateConfiguration({})).toEqual(expected);
    });

    it('returns as invalid when config.people is not an array', () => {
      const expected: Validation = {
        errors: ['`people` must be an array'],
        valid: false
      };

      // @ts-ignore
      expect(validateConfiguration({ people: 'hello' })).toEqual(expected);
    });

    it('returns as invalid when config.people is not an array of objects with at least a name', () => {
      const expected: Validation = {
        errors: [
          'Each element in `people` must be an object with a `name` that is a string'
        ],
        valid: false
      };

      // @ts-ignore
      expect(validateConfiguration({ people: [1] })).toEqual(expected);
      // @ts-ignore
      expect(validateConfiguration({ people: [{ name: 1 }] })).toEqual(
        expected
      );
    });

    it('returns as invalid when there are duplicate people', () => {
      const config: Configuration = {
        people: [{ name: '1' }, { name: '1' }]
      };

      const expected: Validation = {
        errors: ['Each name in `people` must be unique.'],
        valid: false
      };
      expect(validateConfiguration(config)).toEqual(expected);
    });

    it('returns as invalid when exclusions is defined but not an array', () => {
      const config = {
        people: [],
        exclusions: 'hello'
      };

      const expected: Validation = {
        errors: ['`exclusions` must be an array'],
        valid: false
      };

      // @ts-ignore
      expect(validateConfiguration(config)).toEqual(expected);
    });

    it('validates that an exclusion is an object with the right properties', () => {
      const config = {
        people: [],
        exclusions: ['bad']
      };
      const config2 = {
        people: [],
        exclusions: [{ type: 0xbad, subject: 'test', value: 'test' }]
      };
      const config3 = {
        people: [],
        exclusions: [{ type: 'name', subject: 0xbad, value: 'test' }]
      };
      const config4 = {
        people: [],
        exclusions: [{ type: 'name', subject: 'test', value: 0xbad }]
      };

      const expected: Validation = {
        errors: [
          'Each exclusion must be an object and have a `type`, `subject`, and `value` that are each strings.'
        ],
        valid: false
      };

      // @ts-ignore
      expect(validateConfiguration(config)).toEqual(expected);
      // @ts-ignore
      expect(validateConfiguration(config2)).toEqual(expected);
      // @ts-ignore
      expect(validateConfiguration(config3)).toEqual(expected);
      // @ts-ignore
      expect(validateConfiguration(config4)).toEqual(expected);
    });

    it('returns as invalid when an exclusion type is not a key of a Person', () => {
      const config = {
        people: [],
        exclusions: [{ type: 'bad', subject: 'test', value: 'test' }]
      };

      const expected: Validation = {
        errors: [
          "The exclusion `type` must be a a key of a Person, 'name' or 'group'."
        ],
        valid: false
      };

      // @ts-ignore
      expect(validateConfiguration(config)).toEqual(expected);
    });

    it('validates a good config with exclusions', () => {
      const config: Configuration = {
        people: [{ name: 'Brian', group: 'Mitchell' }],
        exclusions: [{ type: 'name', subject: 'Brian', value: 'Someone else' }]
      };

      const expected: Validation = {
        errors: [],
        valid: true
      };

      expect(validateConfiguration(config)).toEqual(expected);
    });
  });

  describe('shuffle', () => {
    it('should shuffle an array in place', () => {
      const arr = [1, 2, 3];
      expect(shuffle(arr)).toBe(arr);
    });

    it('should not equal the same elements in a similar array', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const newArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(shuffle(arr)).not.toEqual(newArr);
    });
  });
});
