# Dark Theme

Switch the theme to Dark

## Usage

Import Dark Component and wrap your page with it.

Supports `<Main>` and `<PageHeader>`

```JSX
import React from 'react';
import { Dark } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
    render() {
        return (
            <Dark>
                <PageHeader>
                    <PageHeaderTitle title='title'/>
                <PageHeader>
                <Main>
                    . . .
                </Main>

            </Dark>
        )
    }
}
```

## Props

Dark

```javascript
{
    children: propTypes.node
};
```