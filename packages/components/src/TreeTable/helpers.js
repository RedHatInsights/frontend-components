export const sizeCalculator = (rows) => {
  let points = {};

  for (let key = 0; key < rows.length; key++) {
    if (!rows[key].cells) {
      rows[key] = {
        cells: rows[key],
      };
    }

    let currRow = rows[key];
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
  (rows, _e, _val, { rowData }) => {
    const currRow = rows[rowData.id];
    const isTreeOpen = !currRow.isTreeOpen;
    const rowsToChange = [rows[rowData.id], ...(isTreeOpen === false ? rows.filter((row) => row[parentKey] === rowData.id) : [])];
    for (let key = 0; key < rowsToChange.length; key++) {
      rowsToChange[key].isTreeOpen = rowsToChange[key].isTreeOpen === undefined ? undefined : isTreeOpen;
    }

    return rows;
  };
