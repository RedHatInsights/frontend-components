# Shield

Truncating long text and showing tooltip with full text variant above the truncated snippet.

## Usage

Import LongTextTooltip from this package.

```JSX
import React from 'react';
import { LongTextTooltip } from '@red-hat-insights/insights-frontend-components';
class YourCmp extends React.Component {
  render() {
    return (
        <LongTextTooltip content={'Lorem ipsum'} maxLength={250} tooltipPosition={'top'} maxWidth={'50vw'} />
    )
  }
}
```

## Props

LongTextTooltip

```javascript
{
    content: propTypes.string,
    maxLength: propTypes.number,
    tooltipPosition: propTypes.string, // (top), right, bottom, left
    tooltipMaxWidth: propTypes.string
};
```
