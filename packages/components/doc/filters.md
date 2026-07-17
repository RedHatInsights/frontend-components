# Filters

## FilterInput
Implementation of the 'FilterInput' component for displaying filter inputs in toolbar filters. 

### Usage

Import FilterInput from this package. The `type` of input can be `radio` or `checkbox`. 

```JSX
import React from 'react';
import { FilterInput } from '@redhat-cloud-services/frontend-components/Filters';

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
import { FilterDropdown } from '@redhat-cloud-services/frontend-components/Filters';

class YourCmp extends React.Component {
  render() {
    return (
      <FilterDropdown
          filters={ {} }
          addFilter={ console.log }
          removeFilter={ console.log }
          filterCategories={ [{ title: '', type: '', urlParam: '', values: [{ label: '', value: '' }]}] }
      />
    )
  }
}
```
