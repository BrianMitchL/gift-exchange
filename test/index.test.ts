import { describe, expect, it } from 'vitest';
import * as Exports from '../src';

describe('index', () => {
  it('exports the right stuff', () => {
    expect(Exports.calculate).toBeDefined();
    expect(Exports.validateMatches).toBeDefined();
    expect(Object.keys(Exports)).toEqual(['validateMatches', 'calculate']);
  });
});
