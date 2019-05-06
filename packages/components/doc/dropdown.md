# Dropdown
Implementation of custom dropdown component which allows you to group clickable items under one button.

Later it will be possible to filter trough options, right now only button is rendered and clicking on it will reveal clickable item list.

### Usage
Import Dropdown, it's item and styles from this package. Then use them wherever you want (table, toolbar, forms, etc.)

```JSX
import React from 'react';
import { Dropdown, DropdownItem } from '@redhat-insights/insights-frontent-components/components/Dropdown';

import '@redhat-insights/insights-frontent-components/components/Dropdown.css';
// in scss file @import '~@redhat-insights/insights-frontent-components/components/Dropdown.css';

class YourCmp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };

    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.someLogic = this.someLogic.bind(this);
  }

  onToggle() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  someLogic(event) {
    //do something fancy with event
  }

  onSelect(event) {
    //do something regular with event
  }

  render() {
    return (
      <div>
        Some elements
        <Dropdown
          title="Some title"
          isCollapsed={this.state.collapsed}
          onToggle={this.onToggle}
          onSelect={this.onSelect}
        >
          <DropdownItem>Some item</DropdownItem>
          <DropdownItem isSeparator={true} />
          <DropdownItem component="button">another item</DropdownItem>
          <DropdownItem onClick={event => this.someLogic(event)}>Special on click</DropdownItem>
        </Dropdown>
      </div>
    )
  }
}
```

### Dropdown API
* To reveal drop items change `isCollapsed` to true

* Prop `isKebab` set to true will show kebab dropdown

* To show dropup set `direction` to `'up'`

* When clicked on dropdown event `onToggle` is fired which should change `isCollapsed`.

* When clicked on item `onSelect` event is triggered


### Props

1) Dropdown
```javascript
{
  position: PropTypes.oneOf(['left', 'right']),
  direction: PropTypes.oneOf(['up', 'down']),
  isKebab: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool,
  hasArrow: PropTypes.bool,
  onSelect: PropTypes.func,
  airaLabelledBy: PropTypes.string,
  onToggle: PropTypes.func
}
```

1) DropdownItem
```javascript
{
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.node,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number
}
```