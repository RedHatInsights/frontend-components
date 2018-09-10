# Breadcrumbs
This component is to show user from where he came and to easilly go back number of times.

## Usage
There are two components available for use `Breadcrumbs` and `ConnectedBreadcrumbs`

### Breadcrumbs
Simplest component, you have to provide data which will be rendered, navigation and eerything.
```JSX
import React from 'react'
import { Breadcrumbs } from '@red-hat-insights/insights-frontend-components';

const yourCmp = () => (
  <Breadcrumbs
    items={[{title: 'something', navigate: 'somewhere'}]}
    current="Place"
    onNavigate={(event, navigateTo, hops) => someFnc()}
  />
)
```

### ConnectedBreadcrumbs
This component is connected directly to `react-dom-router` and is trying to guess where you've been and how to navigate there.
```JSX
import React from 'react'
import { ConnectedBreadcrumbs } from '@red-hat-insights/insights-frontend-components';

const yourCmp = () => (
  <ConnectedBreadcrumbs current="Place" />
)
```

## Props
```javascript
{
  items: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    navigate: PropTypes.string,
  })),
  current: PropTypes.string,
  onNavigate: PropTypes.func(event, navigateTo, hops)
}
```

* `hops` - number of jumps to root place
