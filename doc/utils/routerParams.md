# Router parameters
If you want to record where user is located you should use utility which will take care of this and stores it into redux.

Do not use `withRouter` from `react-router-dom` anymore, but use this utility instead.

This utility is just wrapper over `withRouter` so anything which you want to use from such decorator can be used as well.
### Usage
```JSX
import React from 'react'
import { routerParams } from '@red-hat-insights/insights-frontend-components';

const yourCmp = ({ match, location }) => {
  // do something with match and location
  return (
    <div>Some text</div>
  )
}

export default withRouter(yourCmp);
```
