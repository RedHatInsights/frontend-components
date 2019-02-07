# Table Toolbar

Implementation of 'table toolbar' that can contain table actions

## Usage

Import TableToolbar and styles from this package.

```JSX
import React from 'react';
import { TableToolbar } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
        <TableToolbar>
            // Whatever content you want inside the toolbar (search, buttons, etc)
        </TableToolbar>
        <Table>
            // Table content
        </Table>
    )
  }
}
```

### Add results to the toolbar

```JSX
import React from 'react';
import { TableToolbar } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
        <TableToolbar results={ number of results }>
            // Whatever content you want inside the toolbar (search, buttons, etc)
        </TableToolbar>
        <Table>
            // Table content
        </Table>
    )
  }
}
```

## Props

TableToolbar

```javascript
{
    results: propTypes.number,
    className: propTypes.string,
    children: propTypes.any
};
```