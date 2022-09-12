# Primary toolbar
This component tries to unify look and feel of data toolbar accross all appliacations.

## Usage
This component serves as proxy for other components so to understand fully what config you have to send you can check corresponding docs
* `pagination` - [PF4 pagination](https://www.patternfly.org/v4/components/pagination)
* `exportConfig` - download button from cloud services frontend components (missing doc)
* `actionsConfig` - custom component, check example
* `sortByConfig` - custom component, check example
* `bulkSelect` - [FE component bulk select](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/bulkd_select.md)
* `filterConfig` - [FE component conditional filter](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/conditionalFilter.md)
* `activeFiltersConfig` - filter chips component from cloud services frontend components (missing doc)

**example**
```JSX
import React, { useState } from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
export default myCmp = () => {
    const [ page, onSetPage ] = useState(1);
    const [ perPage, onSetPerPage ] = useState(1);
    const [ checked, onCheck ] = useState(false);
    const [ direction, onDirectionSet ] = useState('asc');
    return (
        <PrimaryToolbar
            pagination={{
                itemCount: 100,
                page,
                perPage,
                onSetPage: (page) => onSetPage(page),
                onPerPageSelect: (perPage) => onSetPerPage(perPage)

            }}
            exportConfig={{
                onSelect: console.log
            }}
            actionsConfig={{
                actions: [
                    <Button key="first" onClick={console.log}>Some action</Button>,
                    <Button key="second" onClick={console.log}>Another button</Button>,
                    {
                        label: 'Or objects',
                        onClick: console.log
                    },
                    'or plain string'
                ],
                onSelect: console.log,
                dropdownProps: { className: 'custom-class' }
            } }
            sortByConfig={{
                direction,
                onSortChange: (e, direction) => onDirectionSet(direction)
            }}
            bulkSelect={{
                items: [{
                    title: 'Some action',
                    onClick: () => onCheck(true)
                }],
                checked,
                onSelect: () => onChecked(!checked)
            }}
            filterConfig={{
                items: [{
                    label: 'First filter'
                }, {
                    label: 'Second filter',
                    type: 'checkbox',
                    filterValues: {
                        items: [{ label: 'Some checkbox' }]
                    }
                }]
            }}
            activeFiltersConfig={{
                filters: [{
                    category: 'Some',
                    chips: [{
                        name: 'something'
                    }, {
                        name: 'something 2'
                    }]
                }, {
                    category: 'Another',
                    chips: [{
                        name: 'One chip'
                    }]
                }, {
                    name: 'Something else'
                }],
                onDelete: console.log
            }}
        />
    )
}
```

### PropTypes
Since we are using components defined in different components some are reused, please go to corresponding components for full list of prop types and their default values

```JS
id: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
className: PropTypes.string,
toggleIsExpanded: PropTypes.func,
bulkSelect: PropTypes.shape(BulkSelect.propTypes),
filterConfig: PropTypes.shape(ConditionalFilter.propTypes),
pagination: PropTypes.shape(Pagination.propTypes),
sortByConfig: PropTypes.shape({
    direction: PropTypes.oneOf(Object.values(SortByDirection)),
    onSortChange: PropTypes.func
}),
exportConfig: PropTypes.shape(DownloadButton.propTypes),
activeFiltersConfig: PropTypes.shape(FilterChips.propTypes),
children: PropTypes.node, // will be placed before pagination and should be wrapped in data toolbar item from PF
actionsConfig: PropTypes.shape({
    actions: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.shape({
            label: PropTypes.node,
            value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
            onClick: PropTypes.func,
            props: PropTypes.any
        })
    ])),
    dropdownProps: Actions.propTypes.dropdownProps,
    onSelect: Actions.propTypes.onSelect
})
```
