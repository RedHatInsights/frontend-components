# Treeview Table
This table is variantion of classic table, you can enable this by passing `expandable` to table props and if data
matches the data structure table will be rendered with chevrons to enable collapsing of their rows.

Notes:
 * collapsed rows doesn't have select
 * multiple collapsed rows for one parent is possible
 * parent can also be colapsible
 * every table action (custom classes, DOM elements as cells, etc.) are possible for this table as well

## Usage
Pass `expandable` to props and when user interacts with table you will be notified by `onExpandClick` callback with 
`event`, `row`, `rowKey` arguments.

```JSX
import React from 'react';
import { Table, Pagination, TableVariant } from '@red-hat-insight/insights-frontend-components';

export default () => (
  <Table 
    header={['First', 'Second', 'Third']}
    onExpandClick={(event, row, rowKey) => onExpandClicked(event, row, rowKey)}
    variant={TableVariant.large}
    rows={[
      {
        children: [1]
        isActive: false,
        cells: ['1-1', '1-2', '1-3']
      },
      {
        isOpen: false,
        cells: [{ title: 'This text will span across whole table.' colSpan: 3}]
      },
      {
        cells: ['3-1', '3-2', '3-3']
      }
    ]}
    footer={<Pagination numberOfItems={3} />}
  />
) 
```

### Data structure explained
```javascript
rows = [
  {
    children: [1] // row index
    isActive: false, // bool to change if children rows are expanded or not
    cells: ['1-1', '1-2', '1-3']
  },
  {
    isOpen: false, // bool to indicate if this row is expanded
    cells: [{ title: 'This text will span across whole table.' colSpan: 3}]
  },
  {
    cells: ['3-1', '3-2', '3-3']
  }
];
```
To indicate that some row is parent pass children array to it with keys (works both for arrays and objects). If you wnat
to expand some parent you will indicate this by changing `isOpen` of such row to `true`. If you want to change chevron
of opened parent you will set `isActive` to true.

### Sorting, filtering, pagination
Since this component is based of Table you can do same things with it as with default table, just keep in mind that
treeview table is using flat structure so you'll have to come up with more complex functions when you interact with the
table.

Also if you want to load child data asynchronously, you are free to do so, just pass empty title when no data are presented
or some loading element to indicate data fetching.

Again cells can be whatever you want from string, to DOM objects.

## Props
Same as for [Table](table.md#props).
