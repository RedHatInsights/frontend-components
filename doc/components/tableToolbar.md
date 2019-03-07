# Table Toolbar

Implementation of 'table toolbar' that can contain table actions. Simply a styled wrapper for Patternfly's Toolbar component

## Usage

Import TableToolbar and styles from this package.

```JSX
import React from 'react';
import { TableToolbar } from '@redhat-insights/insights-frontent-components';
import { ToolbarItem } from '@patternfly/react-core';


class YourCmp extends React.Component {
  render() {
    return (
        <TableToolbar>
            // Whatever content you want inside the toolbar (search, buttons, etc) can go in ToolbarItem
            <ToolbarGroup>
              <ToolbarItem> Foo </ToolbarItem>
              <ToolbarItem> Bar </ToolbarItem>
            </ToolbarGroup>
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

### Use the toolbar as a table footer

```JSX
import React from 'react';
import { TableToolbar } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
        <Table>
            // Table content
        </Table>
        <TableToolbar isFooter>
            // Whatever content you want inside the footer
        </TableToolbar>
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