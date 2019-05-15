# Spinner

This component is a loading state

## Usage

Import Spinner from this package.

```JSX
import React from 'react';
import { Spinner } from '@redhat-cloud-services/frontend-components';

class YourCmp extends React.Component {
  render() {
    return (
        <Spinner/>
        <Spinner centered/>
    )
  }
}
```

## Props

```javascript
{
    className: propTypes.string,
    centered: propTypes.bool
};
```
