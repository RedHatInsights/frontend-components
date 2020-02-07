export const sizeCalculator = (rows) => {
    let points = {};

    for (let key = 0; key < rows.length; key++) {
        const currRow = rows[key];
        if (!points[currRow.level || 0]) {
            points[currRow.level || 0] = { size: 0 };
        }

        const currPoint = points[currRow.level || 0];
        currPoint.size = currPoint.size + 1;
        currRow.point = currPoint;
        currRow.posinset = currPoint.size;
    }

    return rows;
};

export const collapseBuilder = (parentKey = 'treeParent') => (rows, _e, _val, { rowData }) => {
    const currRow = rows[rowData.id];
    const isTreeOpen = !currRow.isTreeOpen;
    const rowsToChange = [
        rows[rowData.id],
        ...isTreeOpen === false ? rows.filter(row => row[parentKey] === rowData.id) : []
    ];
    for (let key = 0; key < rowsToChange.length; key++) {
        rowsToChange[key].isTreeOpen = rowsToChange[key].isTreeOpen === undefined ? undefined : isTreeOpen;
    }

    return rows;
};
