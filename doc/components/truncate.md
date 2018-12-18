# Truncate

Implementation of 'Truncate' that truncates text to a certain length

## Usage

Import Truncate and styles from this package.

```JSX
import React from 'react';
import { Truncate } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
        <Truncate
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            length= { 300 }
            expandText= 'Click me for more text'
            collapseText= 'Click me for less text'
            inline
        />
    )
  }
}
```

## Props

```javascript
Truncate.propTypes = {
    className: propTypes.string,
    text: propTypes.string, // Text you want clipped
    length: propTypes.number, // How many characters until clipping
    expandText: propTypes.string, // Text shown when collapsed (Expand me)
    collapseText: propTypes.string, // Text shown when expanded (Collapse me)
    inline: propTypes.bool // Inline?
};

Truncate.defaultProps = {
    length: 150,
    expandText: 'Read more',
    collapseText: 'Collapse'
};
```