import filters from '../__fixtures__/filters';
import { toDeselectValue, toFilterChips } from './filterChipHelpers';

describe('toFilterChips', () => {
  it('returns filterchips for active filters', () => {
    const filterChips = toFilterChips(filters, { 'checkbox-filter': ['OPTION 1-value'], name: ['TEST NAME'] });
    expect(filterChips[0].chips[0].name).toEqual('OPTION 1');
    expect(filterChips[1].chips[0].name).toEqual('TEST NAME');
  });
});

describe('toDeselectValue', () => {
  it('should return a value to pass as action to the seleciton manager', () => {
    expect(
      toDeselectValue(filters, {
        category: 'Checkbox Filter',
        chips: [
          {
            name: 'OPTION 2',
          },
        ],
      })
    ).toEqual(['OPTION 2-value', 'checkbox-filter']);
  });
});
