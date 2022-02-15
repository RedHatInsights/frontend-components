import items from '../__fixtures__/items';
import columns from '../__fixtures__/columns';
import rowsBuilder from './rowsBuilder';

describe('rowsBuilder', () => {
  const exampleItems = items(30);

  it('returns a rows configuration', () => {
    const result = rowsBuilder(exampleItems, columns);
    expect(result).toMatchSnapshot();
  });
});
