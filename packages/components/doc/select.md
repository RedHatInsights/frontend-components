# Select

This component is restyled [react-select](https://react-select.com) that allows wast configuration of select component. It looks and feels like PF4 select with capabilities of react-select component.

This improvement is using Async, Creatable and default component. To change which variant should be used please pass `variant` prop to this component it's values are in `SelectVariant` and they are `default`, `async` and `creatable`

## Usage

Please go to [react-selec#props](https://react-select.com/props) to see full list of available props.

This component requires at least 3 props to function correctly.
* `options` - array of objects with shape `{value: String, label: Node}` where `value` is what will be searched and `label` is what is shown to user.
* `value` - `Array` or `String` of selected values
* `onChange` - callback that is used for setting current value (it will return array for multi value selector)

```JSX
import React, { useState } from 'react';
import { Select }  from '@redhat-cloud-services/frontend-components';

const options = [
    {value: 'value1', label: 'Value 1'},
    {value: 'value2', label: 'Value 2'}
]

export default () => {
    const [ value, onSetValue ] = useState();
    return <Select 
        value={value}
        options={options}
        onChange={onSetValue}
    />;
};

```

### Creatable variant
You have 2 options how to add new options to select. Either with creatable variant or with callback function to create new options.

1) Creatable variant
```JSX
import React, { useState } from 'react';
import { Select, SelectVariant }  from '@redhat-cloud-services/frontend-components';

const options = [
    {value: 'value1', label: 'Value 1'},
    {value: 'value2', label: 'Value 2'}
]

export default () => {
    const [ value, onSetValue ] = useState();
    return <Select 
        value={value}
        options={options}
        onChange={onSetValue}
        variant={SelectVariant.creatable}
    />;
};
```

2) Callback `onCreateOption`
```JSX
import React, { useState } from 'react';
import { Select, SelectVariant }  from '@redhat-cloud-services/frontend-components';

const options = [
    {value: 'value1', label: 'Value 1'},
    {value: 'value2', label: 'Value 2'}
]

export default () => {
    const [ value, onSetValue ] = useState();
    const [ customValue, onCreateValue ] = useState([]);
    return <Select 
        value={value}
        options={[...options, customValue]}
        onChange={onSetValue}
        variant={SelectVariant.creatable}
        onCreateOption={(newValue) => {
            /* This is not optimal because it calls render twice try to optimize it by using useReducer or object state */
            onCreateValue([...customValue, { value: newValue, label: newValue }]);
            onSetValue([...value, newValue]);
        }}
    />;
};
```

### Async variant
This example is just minimal effort to make async work, please refer to [react-select.com#async](https://react-select.com/async) for full examples and additional props like `defaultOptions` and how to corectly use `loadOptions`.

```JSX
import React, { useState } from 'react';
import { Select, SelectVariant }  from '@redhat-cloud-services/frontend-components';

const options = [
    {value: 'value1', label: 'Value 1'},
    {value: 'value2', label: 'Value 2'}
]

export default () => {
    const [ value, onSetValue ] = useState();
    return <Select 
        value={value}
        loadOptions={(_inputValue, callback) => {
            setTimeout(() => {
                callback(options);
            }, 1000);
        }}
        onChange={onSetValue}
        variant={SelectVariant.async}
    />;
};
```
### Simple value
By default Select will return value when option is selected. If you want to control both value and label set `simpleValue` to false. This will force select to send objects when option selected instead of strings.

### Multi select
If you want to use multi select set `isMulti` prop to true. This will change select from single select to multi select.

If you want to use checkboxes instead of tick icons you can add `isCheckbox` prop to select to indicate it.
