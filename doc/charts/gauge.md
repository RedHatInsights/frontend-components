
# Gauge Chart

This component is usefull to display x number of values to compare them to 100

```jsx
import React from 'react'
import { Gauge } from '@red-hat-isnights/insights-frontend-components';

<Gauge value={10} identifier='gauge-identifier' label='sample-gauge'/>

```

## Props

```JS
{
    className: propTypes.string,
    height: propTypes.number,
    width: propTypes.number,
    identifier: propTypes.string,
    label: propTypes.string
    value: propTypes.array,
}
```