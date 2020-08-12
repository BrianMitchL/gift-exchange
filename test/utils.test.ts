import { personArrayOfLength, shuffle } from '../src/utils';

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
