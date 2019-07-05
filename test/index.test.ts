import '../to-be-valid-derangement';
import { calculate } from '../src';
import { personArrayOfLength } from '../src/utils';
import { DerangementError, Exclusion } from '../src/models';

describe('index', () => {
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
