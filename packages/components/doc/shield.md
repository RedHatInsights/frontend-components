# Shield

This component using Patternfly icons with optional tooltip implementation for Shield icon with Badge sign.

List of impacts is available in `consts.js` file.

## Usage

Import Shield from this package.

```JSX
import React from 'react';
import { Shield } from '@redhat-cloud-services/frontend-components';

const YourCmp = () => {
    return (
        <Shield impact={'Critical'} hasTooltip={true} size={'md'} />
    )
}
```

## Props

You can also use all the props from Patternfly Tooltip component - [Documentation](http://patternfly-react.surge.sh/patternfly-4/components/tooltip)

```javascript
{
    impact: propTypes.oneOfType([
        propTypes.string,
        propTypes.number
    ]),
    hasTooltip: propTypes.bool,
    disableQuestionIcon: propTypes.bool
    tooltipPosition: propTypes.string, // top, (right), bottom, left
    tooltipPrefix: propTypes.string,
    title: propTypes.string,
    size: propTypes.string // sm, (md), lg, xl
};
```
