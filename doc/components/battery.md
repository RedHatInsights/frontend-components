# Battery

Implementation of 'battery' icons that represent levels of severity.

Later it will be possible to filter trough options, right now only button is rendered and clicking on it will reveal clickable item list.

## Usage

Import Battery, its font and styles from this package.

```JSX
import React from 'react';
import { Battery } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
        <Section type='icon-group'>
            { /* Low/1 Severity */ }
            <Battery label='test' severity='low'/>
            <Battery label='test' severity='1'/>
            { /* Medium/2 Severity */ }
            <Battery label='test' severity='medium'/>
            <Battery label='test' severity='2'/>
            { /* High/3 Severity */ }
            <Battery label='test' severity='high'/>
            <Battery label='test' severity='3'/>
            { /* Critical/4 Severity */ }
            <Battery label='test' severity='critical'/>
            <Battery label='test' severity='4'/>

            { /* Hidden Label */ }
            <Battery label='test' labelHidden severity='critical'/>
        </Section>
    )
  }
}
```

## Props

Battery

```javascript
{
    severity: propTypes.oneOfType([
        propTypes.string.isRequired,
        propTypes.number.isRequired
    ]),
    label: propTypes.string.isRequired
};
```