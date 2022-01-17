import { ConfigDefaults } from './Props';

export function createRows(segmentData) {
  const rows = [];
  segmentData.forEach((item) => {
    const {
      position: [first, second],
      ...rest
    } = item;
    rows[first] = rows[first] || [];
    rows[first][second] = [...(rows[first][second] || []), ...[rest]];
  });
  return rows;
}

export function callOnSegmentData(segmentData, callback) {
  return segmentData.map((rows, rowKey) => rows.map((cell, cellKey) => callback && callback(rows, rowKey, cell, cellKey)));
}

export function calculateFragements(data, config) {
  const {
    size = 540,
    gridSize = size - 110,
    colors: [colorTopLeft, colorTopRight, colorBottomLeft, colorBottomRight] = ConfigDefaults.colors,
  } = config;

  return {
    data: {
      topRight: { rows: createRows(data.topRight), color: colorTopRight, coords: [gridSize / 2, 0] },
      topLeft: { rows: createRows(data.topLeft), color: colorTopLeft, coords: [0, 0] },
      bottomRight: { rows: createRows(data.bottomRight), color: colorBottomRight, coords: [gridSize / 2, gridSize / 2] },
      bottomLeft: { rows: createRows(data.bottomLeft), color: colorBottomLeft, coords: [0, gridSize / 2] },
    },
  };
}
