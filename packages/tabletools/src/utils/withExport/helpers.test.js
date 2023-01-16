import columns from '../__fixtures__/columns';
import items from '../__fixtures__/items';
import { csvForItems, jsonForItems } from './helpers';

const exampleItems = items(25);

describe('jsonForItems', () => {
  it('returns an json export of items', () => {
    const result = jsonForItems({
      columns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});

describe('csvForItems', () => {
  it('returns an csv export of items', () => {
    const result = csvForItems({
      columns,
      items: exampleItems,
    });

    expect(result).toMatchSnapshot();
  });
});
