# Conditional filter

Component that allows you fine grained filtering, by choosing group and then using specific component to filter.

## Usage

You have to pass config array (`items` prop) in order to enable component mapping. The different type used as filter component is passed in `type` property of each object definition.

If you do not pass any items to this component Text filter will be rendered by default.

You can control which filter is active by passing `onChange` and `value` (you have to pass both props, otherwise state values will be used).

There are 3 components predesigned for you to use, plus one custom definition component if you need to use something completely different.

### 1) Textual component
This component should be used if user defined values are required and filtering by substrings is allowed.

You can listen on two events, either `onSubmit` if you want to wait for user to hit enter. Or `onChange` and you will be notified everytime user types anything in text field.
* `onChange` - usefull to filter table as user types in input
```JSX
import React, { Component, useState } from 'react';
import { ConditionalFilter, conditionalFilterType } from '@redhat-cloud-services/frontend-components';

class SomeCmp extends Component {
    render() {
        const [ value, onChange ] = useState();
        return (
            <ConditionalFilter items={[{
                type: conditionalFilterType.text,
                label: 'Textual',
                value: 'textual',
                filterValues: {
                    onChange: (event, value) => onChange(value)
                    placeholder: 'Some placeholder',
                    value
                }
            }]}
            />
        );
    }
}
```

* `onSubmit` - usefull if you don't want to call your server everytime user types something in, or you do not want to pass value in filter
```JSX
import React, { Component, useState } from 'react';
import { ConditionalFilter, conditionalFilterType } from '@redhat-cloud-services/frontend-components';

class SomeCmp extends Component {
    render() {
        const [ value, onSubmit ] = useState();
        return (
            <ConditionalFilter items={[{
                type: conditionalFilterType.text,
                label: 'Textual',
                value: 'textual',
                filterValues: {
                    onSubmit: (event, value) => onSubmit(value)
                    placeholder: 'Some placeholder'
                }
            }]}
            />
        );
    }
}
```
* Props - passed from `filterValues`
```JS
{
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
}
```
### 2) Checkbox component
This type is usefull if you want to show user multiple predefined choices. Choices are passed in config's field `filterValues` as `items`. You can pass `value`, `onClick`, `label`, `id` or any parameter similiar to `SelectOption` of PF4.

If you want to listen on changes you have to pass `onChange` function in `filterValues`.
```JSX
import React, { Component, useState } from 'react';
import { ConditionalFilter, conditionalFilterType } from '@redhat-cloud-services/frontend-components';

class SomeCmp extends Component {
    render() {
        const [ value, onChange ] = useState();
        return (
            <ConditionalFilter items={[{
                type: conditionalFilterType.checkbox,
                label: 'Checkbox',
                value: 'checkbox',
                filterValues: {
                    onChange: (event, value) => onChange(value),
                    value,
                    items: [
                        { label: 'First value', value: 'first' },
                        { label: 'Second value', value: 'second' },
                        { label: 'Third value', value: 'third' }
                    ]
                }
            }]}
            />
        );
    }
}
```
* `onChange` - callback has parameters `event`, `newSelection`, `selection` where `newSelection` is curently selected values and `selection` is value that is selected/unselected.
* Props - passed from `filterValues`
```JS
{
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string
    }) ])),
    placeholder: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node,
        id: PropTypes.string,
        onClick: PropTypes.func
    }))
}
```

### 3) Radio component
This component is somewhat similiar to `Checkbox` with a slight variation that you can select only one value. Props passed to this component are same as with `Checkbox`.
```JSX
import React, { Component, useState } from 'react';
import { ConditionalFilter, conditionalFilterType } from '@redhat-cloud-services/frontend-components';

class SomeCmp extends Component {
    render() {
        const [ value, onChange ] = useState();
        return (
            <ConditionalFilter items={[{
                type: conditionalFilterType.radio,
                label: 'Radio',
                value: 'radio',
                filterValues: {
                    onChange: (event, value) => onChange(value),
                    value,
                    items: [
                        { label: 'First value', value: 'first' },
                        { label: 'Second value', value: 'second' },
                        { label: 'Third value', value: 'third' }
                    ]
                }
            }]}
            />
        );
    }
}
```
* `onChange` - callback has parameters `event`, `selection` where `selection` is curently selected value.
* Props - passed from `filterValues`
```JS
{
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string
    }) ]),
    placeholder: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node,
        id: PropTypes.string,
        isChecked: PropTypes.bool,
        onChange: PropTypes.func // if you want to listen directly on change function for radio input
    }))
}
```

### *) Custom component
If you want to display some custom component, for instance color picker, date picker or something more complicated you can use this type.

```JSX
import React, { Component } from 'react';
import { ConditionalFilter, conditionalFilterType } from '@redhat-cloud-services/frontend-components';

class SomeCmp extends Component {
    render() {
        return (
            <ConditionalFilter items={[{
                type: conditionalFilterType.custom,
                label: 'Cusom',
                value: 'custom',
                filterValues: {
                    children: <div>Some component</div>
            }]}
            />
        );
    }
}
```
* Props - passed from `filterValues`
```JS
{
    children: Proptypes.node
}
