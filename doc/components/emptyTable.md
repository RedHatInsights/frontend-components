# Empty Table

Implementation of 'empty table' that can display text for an empty table state

## Usage

Import EmptyTable and styles from this package.

```JSX
import React from 'react';
import { EmptyTable } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
        <EmptyTable>
            // Text describing why table is empty
        </EmptyTable>
    )
  }
}
```

### Center the content

```JSX
import React from 'react';
import { EmptyTable } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
        <EmptyTable centered>
            // Text describing why table is empty
        </EmptyTable>
    )
  }
}
```

## Props

EmptyTable

```javascript
{
    centered: propTypes.bool,
    className: propTypes.string,
    children: propTypes.any
};
```