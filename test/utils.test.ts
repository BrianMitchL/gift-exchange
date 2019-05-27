import * as Exports from '../src/utils';

describe('utils', () => {
  it('exports the right stuff', () => {
    expect(Exports.matchesExclusion).toBeDefined();
    expect(Exports.print).toBeDefined();
    expect(Exports.validate).toBeDefined();
  });
});
