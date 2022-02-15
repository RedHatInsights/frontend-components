import React from 'react';

const childRowForRule = (item, idx, DetailsComponent) => ({
  parent: idx * 2,
  fullWidth: true,
  cells: [{ title: <DetailsComponent item={item} key={'item-' + item.rowId} /> }],
});

// eslint-disable-next-line import/prefer-default-export
export const itemDetailsRow = (item, idx, options) =>
  typeof options?.detailsComponent !== 'undefined' && childRowForRule(item, idx, options.detailsComponent);
