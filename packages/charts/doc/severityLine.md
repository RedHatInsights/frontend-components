# Severity Line Chart

Display a level of severity given a value between 1-Low and 4-Critical severity.

```jsx
import React from react;
import { SeverityLine } from '@redhat-cloud-services/frontend-components-charts';

<SeverityLine value={2} title='High Severity'/>
```

## Props

```jsx
SeverityLine.propTypes = {
    value: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    config: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number
    })
};
```