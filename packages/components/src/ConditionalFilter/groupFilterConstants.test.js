import { calculateSelected, mapTree, onTreeCheck } from './groupFilterConstants';

describe('onTreeCheck', () => {
  const onClick = jest.fn();

  const tree = [
    {
      onClick,
    },
  ];

  it('should call onClick function', () => {
    onTreeCheck(undefined, undefined, tree);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('mapTree', () => {
  const tree = {
    name: 'First level',
    id: 'firstLevel',
    type: 'treeView',
    children: [
      {
        name: 'Second level',
        id: 'secondLevel',
        children: [
          {
            name: 'Item 1',
            id: 'item1',
          },
          {
            name: 'Item 2',
            id: 'item2',
          },
        ],
      },
    ],
    defaultExpanded: true,
  };

  it('should add partial check properly', () => {
    const result = mapTree(tree, '', { '': { item1: true } }, { '': { item1: true } });
    expect(result.children[0].children[0].checkProps.checked).toEqual(true);
    expect(result.children[0].checkProps.checked).toEqual(null);
    expect(result.checkProps.checked).toEqual(null);
  });

  it('should add no check properly', () => {
    const result = mapTree(tree, '', { '': {} }, { '': {} });
    expect(result.children[0].children[0].checkProps.checked).toEqual(false);
    expect(result.children[0].checkProps.checked).toEqual(false);
    expect(result.checkProps.checked).toEqual(false);
  });

  it('should add all checked properly', () => {
    const result = mapTree(tree, '', { '': { item1: true, item2: true } }, { '': { item1: true, item2: true } });
    expect(result.children[0].children[0].checkProps.checked).toEqual(true);
    expect(result.children[0].checkProps.checked).toEqual(true);
    expect(result.checkProps.checked).toEqual(true);
  });
});

describe('calculateSelected - treeView', () => {
  const tree = {
    name: 'Second level',
    id: 'secondLevel',
    children: [
      {
        name: 'Item 1',
        id: 'item1',
      },
      {
        name: 'Item 2',
        id: 'item2',
      },
    ],
  };

  it('should calculate selected properly, checked = true', () => {
    const result = calculateSelected({ '': { item1: true } })('treeView', '', tree, true);
    const expectedResult = { '': { item1: true, item2: true } };
    expect(result).toEqual(expectedResult);
  });

  it('should calculate selected properly, checked = false', () => {
    const result = calculateSelected({ '': { item1: true, item2: true } })('treeView', '', tree, false);
    const expectedResult = { '': { '': false, item1: false, item2: false } };
    expect(result).toEqual(expectedResult);
  });

  it('should calculate selected with no activeGroup', () => {
    const result = calculateSelected({})('treeView', '', tree, false);
    const expectedResult = { '': { item1: true, item2: true } };
    expect(result).toEqual(expectedResult);
  });
});
