import { collapseBuilder, sizeCalculator } from './helpers';

const tree = [
  { isTreeOpen: false, cells: [] },
  { isTreeOpen: false, cells: [], treeParent: 0 },
  { cells: [], treeParent: 1 },
  { cells: [], treeParent: 1 },
  { cells: [], treeParent: 0 },
  { cells: [], treeParent: 0 },
  { cells: [] },
];

describe('TreeTable helpers - sizeCalculator', () => {
  it('only first level', () => {
    const rows = sizeCalculator([['first'], ['second'], { cells: 'third' }]);
    expect(rows.filter((row) => row.level !== 0).length).toBe(0);
  });

  it('should create multi level', () => {
    const rows = sizeCalculator(tree);
    const [firstLevel, secondLevel, thirdLevel] = [...new Array(3)].map((_item, key) => rows.filter(({ level }) => level === key));
    expect(firstLevel.length + secondLevel.length + thirdLevel.length).toBe(tree.length);
    expect(firstLevel.every(({ treeParent }) => treeParent === undefined)).toBeTruthy();
    expect(secondLevel.every(({ treeParent }) => treeParent === 0)).toBeTruthy();
    expect(thirdLevel.every(({ treeParent }) => treeParent === 1)).toBeTruthy();
  });
});

describe('TreeTable helpers - collapseBuilder', () => {
  it('should open first level', () => {
    const rows = collapseBuilder()(tree, null, null, { rowData: { id: 0 } });
    const [firstLevel, secondLevel] = [...new Array(3)].map((_item, key) => rows.filter(({ level }) => level === key));
    expect(firstLevel[0].isTreeOpen).toBeTruthy();
    expect(secondLevel.every(({ isTreeOpen }) => !isTreeOpen)).toBeTruthy();
  });

  it('should collapse all levels', () => {
    const openedTree = [...tree];
    openedTree[0].isTreeOpen = true;
    openedTree[1].isTreeOpen = true;
    const rows = collapseBuilder()(tree, null, null, { rowData: { id: 0 } });
    const [firstLevel] = [...new Array(3)].map((_item, key) => rows.filter(({ level }) => level === key));
    expect(firstLevel[0].isTreeOpen).toBeFalsy();
    expect(rows.every(({ isTreeOpen }) => !isTreeOpen)).toBeTruthy();
  });
});
