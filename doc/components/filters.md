# Filters

## FilterInput
Implementation of the 'FilterInput' component for displaying filter inputs in toolbar filters. 

### Usage

Import FilterInput from this package. The `type` of input can be `radio` or `checkbox`. 

```JSX
import React from 'react';
import { FilterInput } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
      <FilterInput
          aria-label="label"
          id="id"
          label="label"
          addRemoveFilters={ jest.fn() }
          param="param"
          type="radio"
          value="value"
          filters={ { param: 'value' } }
      />
    )
  }
}
```

## FilterDropdown
Implementation of the 'FilterDropdown' component for displaying filter dropdowns in toolbar filters. 

### Usage

Import FilterDropdown from this package.

```JSX
import React from 'react';
import { FilterInput } from '@redhat-insights/insights-frontent-components/';

class YourCmp extends React.Component {
  render() {
    return (
      <FilterDropdown
          filters={ {} }
          addFilter={ jest.fn() }
          removeFilter={ jest.fn() }
          filterCategories={ [{ title: '', type: '', urlParam: '', values: [{ label: '', value: '' }]}] }
      />
    )
  }
}
```

