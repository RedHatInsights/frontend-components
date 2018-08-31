
# Donut Chart

This component is usefull to display x number of values to compare them to an overall value

```jsx
import React from 'react'
import { Donut } from '@red-hat-isnights/insights-frontend-components';

let DonutValues = [
    ['value1', 5],
    ['value2', 10],
    ['value3', 20],
    ['value4', 40]
];

<Donut values={DonutValues} totalLabel='label for donut-hole' identifier='donut-identifier'/>;

```

## Donut with Legend

```jsx

<Donut values={DonutValues} totalLabel='label for donut-hole' identifier='donut-identifier' withLegend/>;

```

## Donut with Legend and Links

```jsx

const typeLink = '/foo/';

// The link prop will append the label (value1, value2, value3, value4) to the typeLink const
// in this case, you'll get the link /actions/value1 etc.

<Donut values={DonutValues} link={typeLink} totalLabel='label for donut-hole' identifier='donut-identifier' withLegend/>;

```

## Props

```JS
{
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    values: propTypes.array,
    width: propTypes.number,
    totalLabel: propTypes.string,
    withLabel: propTypes.bool,
}
```