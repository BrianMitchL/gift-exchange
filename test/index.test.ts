import * as Exports from '../src/index';

describe('index', () => {
  it('exports the right stuff', () => {
    expect(Exports.calculate).toBeDefined();
    expect(Exports.derange).toBeDefined();
    expect(Exports.DerangementError).toBeDefined();
  });
});
