# Table
To use simple implementation of table component with basic styling use Table component. Please note that this table has
limited range of functions - select, sort, pagination.

### Usage
To use this component simply import it and pass header, rows and if you want footer as well. Any of these props can be
omitted.
```javascript
import React from 'react';
import { Table, Pagination } from '@red-hat-insight/insights-frontend-components';

export default () => (
  <Table 
    header={['First', 'Second', 'Third']}
    rows={{
      cells: ['1-1', '1-2', '1-3'],
      cells: ['2-1', '2-2', '2-3'],
      cells: ['3-1', '3-2', '3-3']
    }}
    footer={<Pagination numberOfItems={3} />
  />
) 

```

### Props
```javascript
{
  hasCheckbox: PropTypes.bool, // show/hide checkbox in first cell
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(Object.keys(SortDirection))
  }),
  className: PropTypes.string, // additional classNames to table
  rows: PropTypes.arrayOf(PropTypes.shape({cells: PropTypes.node})), // table body
  header: PropTypes.arrayOf(PropTypes.node), // table header
  footer: PropTypes.node, // table footer (usually Pagination)
  onSort: PropTypes.func, // function callback called when sorted by row
  onItemSelect: PropTypes.func // function callback called when row selected
}
```
