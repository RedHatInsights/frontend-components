import { RowWrapperProps } from '@patternfly/react-table';
export interface TreeTableRow extends RowWrapperProps {
  [index: string]: any;
  level: number;
  isTreeOpen?: boolean;
  point?: Point;
  posinset?: string | number;
  treeParent: number;
}

export interface RowData {
  level?: number;
  isTreeOpen?: boolean;
  id: number;
}

export interface TreeTableRowProps {
  rowData: Partial<RowData>;
}

export type Point = {
  size: number;
};

type Points = {
  [key: string | number]: Point;
};

export const sizeCalculator = (rows: TreeTableRow[]) => {
  const points: Points = {};

  for (let key = 0; key < rows.length; key++) {
    if (!rows[key].cells) {
      (rows[key] as Partial<TreeTableRow>) = {
        cells: rows[key],
      };
    }

    const currRow = rows[key];
    currRow.level = rows[currRow.treeParent] ? rows[currRow.treeParent].level + 1 : 0;
    const pointKey = typeof currRow.treeParent === 'undefined' ? 0 : currRow.treeParent + 1;
    if (!points[pointKey]) {
      points[pointKey] = { size: 0 };
    }

    const currPoint = points[pointKey];
    currPoint.size = currPoint.size + 1;
    currRow.point = currPoint;
    currRow.posinset = currPoint.size;
  }

  return rows;
};

export const collapseBuilder =
  (parentKey = 'treeParent') =>
  (rows: TreeTableRow[], _e: any, _val: any, { rowData }: { rowData: RowData }) => {
    const currRow = rows[rowData.id];
    const isTreeOpen = !currRow.isTreeOpen;
    const rowsToChange = [rows[rowData.id], ...(isTreeOpen === false ? rows.filter((row) => row[parentKey] === rowData.id) : [])];
    for (let key = 0; key < rowsToChange.length; key++) {
      rowsToChange[key].isTreeOpen = rowsToChange[key].isTreeOpen === undefined ? undefined : isTreeOpen;
    }

    return rows;
  };
