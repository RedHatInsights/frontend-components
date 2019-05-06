# Matrix chart
This component is usefull to display 4 quadrants chart in which you can show circles with number of items per same hit.
You can change size of chart and it's axis scales (0 - 6 instead of 0 - 10 for instance).

```jsx
import React from 'react'
import { Matrix } from '@red-hat-isnights/insights-frontend-components';

export default () => <Matrix data={
  {
    topRight: [{position: [1, 2], label: 'First'}],
    topLeft: [{position: [0, 3], label: 'Second'}],
    bottomRight: [{position: [4, 2], label: 'Third'}],
    bottomLeft: [{position: [3, 4], label: 'Fourth'}]
  }
} />;
```
## Props
```JS
{
  data: dataShape.isrequired,
  config: configShape,
  labels: labelsShape
}
```
### Data shape
This prop is required and without it the component will not render.
```JS
{
  topRight: arrayOf({position: arrayOf(number), label: string}),
  topLeft: arrayOf({position: arrayOf(number), label: string}),
  bottomRight: arrayOf({position: arrayOf(number), label: string}),
  bottomLeft: arrayOf({position: arrayOf(number), label: string})
}
```

Simplest example can look like
```JS
{
  topRight: [{position: [1, 2], label: 'First'}],
  topLeft: [{position: [0, 3], label: 'Second'}],
  bottomRight: [{position: [4, 2], label: 'Third'}],
  bottomLeft: [{position: [3, 4], label: 'Fourth'}]
}
```
### Config shape
```JS
{
  max: PropTypes.number,
  min: PropTypes.number,
  size: PropTypes.number,
  gridSize: PropTypes.number,
  pad: PropTypes.number,
  shift: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string)
}
```
### Labels shape
```JS
{
  yLabel: PropTypes.string,
  xLabel: PropTypes.string,
  subLabels: PropTypes.shape({
    xLabels: PropTypes.arrayOf(PropTypes.string),
    yLabels: PropTypes.arrayOf(PropTypes.string)
  })
}
```

### API
TODO