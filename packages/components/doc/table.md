# Table
To use simple implementation of table component with basic styling use Table component. Please note that this table has
limited range of functions - select, sort, pagination.

If you are interested in treeview (expandable) table you can see the docs for it in [TreeviewTable](treeview-table.md).

### Usage
To use this component simply import it and pass header, rows and if you want footer as well. Any of these props can be
omitted.
```javascript
import React from 'react';
import { Table, Pagination } from '@red-hat-insight/insights-frontend-components';

export default () => (
  <Table 
    header={['First', 'Second', 'Third']}
    rows={[
      {cells: ['1-1', '1-2', '1-3']},
      {cells: ['2-1', '2-2', '2-3']},
      {cells: ['3-1', '3-2', '3-3']}
    ]}
    footer={<Pagination numberOfItems={3} /> }
  />
) 

```

#### Table variants
* Larger table columns

```javascript
import React from 'react';
import { Table, Pagination, TableVariant } from '@red-hat-insight/insights-frontend-components';

export default () => (
  <Table 
    header={['First', 'Second', 'Third']}
    variant={TableVariant.large}
    rows={[
      {cells: ['1-1', '1-2', '1-3']},
      {cells: ['2-1', '2-2', '2-3']},
      {cells: ['3-1', '3-2', '3-3']}
    ]}
    footer={<Pagination numberOfItems={3} /> }
  />
) 

```

#### Custom classes

As for what to put into cells, you are free to put anything which can be rendered, so HTML, string, number, React component
or object with `title` and `className` for modifying class for that column.

```JSX
export default () => (
  <Table 
    header={['First', 'Second', 'Third', 'Fourth']}
    rows={[
      {
        cells: [
          'Simple string',
          <div>or some HTML</div>,
          {
            title: 'object with classes',
            className: 'some-special-class'
          },
          {
            title: <div>Or mix something really complex</div>
            className: 'specific-class'
          }
        ],
      }
    ]}
    footer={<Pagination numberOfItems={3} /> }
  />
) 
```

#### Column width

If you have table with multiple lines it's good to use pagination, however if in such table your column values has
different length it's good to set the initial width of each column. You have two options either specify width for such
column or set `fitContent` to wrap each column.

```JSX
export default () => (
  <Table 
    header={[
      {
        title: 'First',
        fitContent: true,
      },
      {
        title: 'Second',
        width: 30
      },
      {
        title: 'Third',
        width: 'max'
      }
    ]}
    rows={[
      {cells: ['1-1', '1-2', '1-3']},
      {cells: ['2-1', '2-2', '2-3']},
      {cells: ['3-1', '3-2', '3-3']}
    ]}
    footer={<Pagination numberOfItems={3} /> }
  />
) 
```

#### Custom IDs for keys

If you want to have better controll over keys used for rendering you have 2 options:
 * use object instead of array for rows

```JSX
export default () => (
  <Table 
    header={['First', 'Second']}
    rows={{
      someId: {
        cells: ['one', 'two']
      }
    }}
    footer={<Pagination numberOfItems={3} /> }
  />
) 
```

* add id for each row
```JSX
export default () => (
  <Table 
    header={['First', 'Second']}
    rows={[
      {
        id: 'someId',
        cells: ['one', 'two']
      }
    ]
    }
    footer={<Pagination numberOfItems={3} /> }
  />
) 
```

#### Turn off sorting
If you want to turn off sorting for some header column you will have to pass object instead of string.
```JSX
export default () => (
  <Table 
    header={['First', {title: 'Second', hasSort: false}]}
    rows={[
      {
        cells: ['one', 'two']
      }
    ]
    }
    footer={<Pagination numberOfItems={3} /> }
  />
) 
```

Be awere that you can still force sorting by this column programaticall and user will see that the table is sorted by 
such column, he however will have no chance to change the direction on this column.

### Props
```javascript
{
  expandable: PropTypes.bool, // enable expand actions for table
  variant: PropTypes.oneOf(Object.keys(TableVariant)), // different table sizes
  hasCheckbox: PropTypes.bool, // show/hide checkbox in first cell
  sortBy: PropTypes.shape({
    index: PropTypes.number,
    direction: PropTypes.oneOf(Object.keys(SortDirection))
  }),
  className: PropTypes.string, // additional classNames to table
  rows: PropTypes.arrayOf(PropTypes.shape({cells: PropTypes.node})), // table body
  header: PropTypes.arrayOf(PropTypes.node), // table header
  footer: PropTypes.node, // table footer (usually Pagination)
  onSort: PropTypes.func(event, colKey, direction), // function callback called when sorted by row
  onItemSelect: PropTypes.func(event, rowKey, isSelected), // function callback called when row selected
  onColClick: PropTypes.func(event, rowKey, colKey), // function callback called when cell clicked
  onRowClick: PropTypes.func(event, rowKey), // function callback called when row clicked
  onExpandClick: PropTypes.func(event, row, rowKey) // function callback called when row is expanded
}
```
