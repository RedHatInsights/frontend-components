# Reboot

Implementation of 'reboot' icon with a label

## Usage

Import Reboot and styles from this package.

```JSX
import React from 'react';
import { Reboot } from '@redhat-cloud-services/frontend-components';

class YourCmp extends React.Component {
  render() {
    return (
        <Reboot/>

        // if you want it to be red:
        <Reboot red/>
    )
  }
}
```

## Props

Reboot

```javascript
{
    className: propTypes.string
    red: propTypes.string
};
```
